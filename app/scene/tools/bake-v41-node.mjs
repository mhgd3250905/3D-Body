// Reproduce PR #3's default v41 motion without a browser or WebGL context.
// The source mirror is immutable git 53d72b412840a942fefc818836b68ad2a2d7e0d1.
// Run from any directory: node app/scene/tools/bake-v41-node.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createCoachMotion } from '../source/v41-runtime/src/coach-motion.js';
import { BodyViewer } from '../source/v41-runtime/src/viewer.js';
import { OFFICIAL_FLARE_SEQUENCE } from '../source/v41-runtime/src/official-poses.js';
import { createTransitionEdits, transitionOptions } from '../source/v41-runtime/src/transition-edits.js';
import { installSpineHelpers } from '../source/v41-runtime/src/spine-helpers.js';
import { phaseTimeline, samplePhase, phaseItems, supportLabel } from '../source/v41-runtime/src/flare-phase-muscles.js';
import { FLARE_GROUPS } from '../source/v41-runtime/src/flare-muscle-groups.js';

globalThis.location ??= { search: '' };
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result = value; this.onload?.(); this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(value => { this.result = `data:${blob.type || 'application/octet-stream'};base64,${Buffer.from(value).toString('base64')}`; this.onload?.(); this.onloadend?.(); }); }
};
export const sceneFile = relative => new URL('../' + relative, import.meta.url);
export const readJson = relative => JSON.parse(fs.readFileSync(sceneFile(relative), 'utf8'));
export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export const names = ['pelvis', 'torso', 'neck', 'head', 'leftScapula', 'leftUpperArm', 'leftForearm', 'leftHand',
  'leftThigh', 'leftPatella', 'leftShin', 'leftFoot', 'rightScapula', 'rightUpperArm', 'rightForearm', 'rightHand',
  'rightThigh', 'rightPatella', 'rightShin', 'rightFoot', 'spineLower', 'spineUpper'];
export async function loadGlb(relative) {
  let bytes = fs.readFileSync(sceneFile(relative));
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = gunzipSync(bytes);
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
}
export function verifyMirror() {
  const manifest = readJson('source/v41-runtime/source-manifest.json');
  assert.equal(manifest.commit, '53d72b412840a942fefc818836b68ad2a2d7e0d1');
  for (const item of manifest.files) {
    const bytes = fs.readFileSync(sceneFile(item.destination));
    assert.equal(bytes.length, item.bytes); assert.equal(sha256(bytes), item.sha256, 'v41 mirror changed: ' + item.source);
  }
  assert.equal(sha256(fs.readFileSync(sceneFile('source/coach/flare-coach-v41-base.glb'))), manifest.sourceAssetSha256, 'Original Snow differs from PR #3');
  return manifest;
}
export async function captureRuntime() {
  verifyMirror();
  const gltf = await loadGlb('source/coach/flare-coach-v41-base.glb'), coach = gltf.scene;
  const rig = readJson('source/coach/coach-v41-rig.json');
  const sequence = structuredClone(OFFICIAL_FLARE_SEQUENCE);
  const options = transitionOptions(createTransitionEdits(sequence));
  const motion = createCoachMotion({ model: coach, rigData: rig });
  motion.setSequence(sequence.steps, { period: sequence.period, ...options });
  const viewer = { coach, motion, speed: 1, time: 0, pacing: null, pacingDisabled: false };
  for (const key of ['computePacing', 'pacingRate', 'paceStep']) viewer[key] = BodyViewer.prototype[key];
  const period = motion.getMetrics().period, dt = 1 / 2400, raw = [0];
  while (viewer.time < period) {
    viewer.time += viewer.paceStep(dt); raw.push(viewer.time);
    assert.ok(raw.length <= 2400 * 120, 'Paced clock did not complete a loop');
  }
  const n = raw.length - 1, loopWall = (n - 1) * dt + dt * (period - raw[n - 1]) / (raw[n] - raw[n - 1]);
  const rawAt = wall => { const x = wall / dt, i = Math.min(Math.floor(x), n - 1), f = x - i; return Math.min(period, raw[i] + (raw[i + 1] - raw[i]) * f); };
  viewer.time = 0; let frames60 = 0;
  while (viewer.time < period) { viewer.time += viewer.paceStep(1 / 60); frames60++; }
  const nodes = names.map(name => coach.getObjectByName(name)), body = coach.getObjectByName('Coach_Body');
  assert.ok(nodes.every(Boolean));
  const vertexIds = []; for (let i = 0; i < body.geometry.attributes.position.count; i += 97) vertexIds.push(i);
  const P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3();
  const sample = time => {
    motion.update(time); coach.updateMatrixWorld(true); body.skeleton.update();
    for (const root of [coach, coach.getObjectByName('Coach_Rig')]) {
      assert.ok(root && root.position.length() < 1e-10 && root.quaternion.angleTo(new THREE.Quaternion()) < 1e-7
        && root.scale.distanceTo(new THREE.Vector3(1, 1, 1)) < 1e-10, 'Bake assumes identity root and armature transforms');
    }
    const local = nodes.map(node => {
      if (node.matrixAutoUpdate) return [...node.position.toArray(), ...node.quaternion.toArray(), ...node.scale.toArray()];
      // Runtime helpers store world matrices; the authored armature is identity.
      node.matrixWorld.decompose(P, Q, S); return [...P.toArray(), ...Q.toArray(), ...S.toArray()];
    });
    for (const value of local) assert.ok(value.slice(7, 10).every(scale => Math.abs(scale - 1) < 1e-10), 'Bake omits non-unit bone scale');
    const world = nodes.map(node => node.getWorldPosition(P).toArray());
    const verts = []; for (const i of vertexIds) { body.getVertexPosition(i, P).applyMatrix4(body.matrixWorld); verts.push(...P.toArray()); }
    return { local, world, verts };
  };
  const N = Math.round(loopWall * 60), frames = [];
  for (let i = 0; i <= N; i++) { const wall = i * loopWall / N, sequenceTime = i === N ? period : rawAt(wall); frames.push({ wall, raw: sequenceTime, ...sample(sequenceTime) }); }
  const probes = []; for (let k = 0; k < 24; k++) { const wall = (k + 0.37) * loopWall / 24, sequenceTime = rawAt(wall); probes.push({ wall, raw: sequenceTime, ...sample(sequenceTime) }); }
  const again = sample(frames[123].raw), determinismMaxDiff = Math.max(...again.world.flat().map((x, i) => Math.abs(x - frames[123].world.flat()[i])));
  assert.equal(determinismMaxDiff, 0, 'Live runtime capture is nondeterministic');
  return { names, sequence, options, period, loopWall, N, frames60, dtIntegrate: dt, pacing: [...viewer.pacing], vertexIds, frames, probes, determinismMaxDiff,
    smoothLoop: (motion.getLoopTimeScale(period * 0.995) ?? 1) > 1.5 };
}
export function compareCapture(gltf, cap) {
  const scene = gltf.scene, clip = gltf.animations.find(value => value.name === 'flare_v41_loop');
  assert.ok(clip); const mixer = new THREE.AnimationMixer(scene), action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  const nodes = names.map(name => scene.getObjectByName(name)), body = scene.getObjectByName('Coach_Body'), point = new THREE.Vector3();
  const check = sample => {
    action.enabled = true; action.paused = false; mixer.setTime(sample.wall); scene.updateMatrixWorld(true); body.skeleton.update();
    let joint = 0, skin = 0, jointName = null;
    nodes.forEach((node, i) => { const error = node.getWorldPosition(point).distanceTo(new THREE.Vector3(...sample.world[i])); if (error > joint) { joint = error; jointName = names[i]; } });
    cap.vertexIds.forEach((id, i) => { body.getVertexPosition(id, point).applyMatrix4(body.matrixWorld); skin = Math.max(skin, point.distanceTo(new THREE.Vector3(...sample.verts.slice(i * 3, i * 3 + 3)))); });
    return { joint, skin, jointName };
  };
  const frames = cap.frames.map((sample, i) => ({ frame: i, ...check(sample) }));
  const probes = cap.probes.map((sample, i) => ({ probe: i, wall: sample.wall, sequenceTime: sample.raw, ...check(sample) }));
  const max = (rows, key) => Math.max(...rows.map(row => row[key]));
  const evidence = { version: 'v41', scope: 'node-live-runtime-vs-animation-mixer', capturedFrames: frames.length, uniqueFrames: cap.N,
    bones: names.length, tracks: clip.tracks.length, loopWall: cap.loopWall, viewerFrames60: cap.frames60, integrationStep: cap.dtIntegrate,
    frameJointMaxErrorMm: max(frames, 'joint') * 1000, frameSkinMaxErrorMm: max(frames, 'skin') * 1000,
    liveProbeCount: probes.length, probeJointMaxErrorMm: max(probes, 'joint') * 1000, probeSkinMaxErrorMm: max(probes, 'skin') * 1000,
    skinVertexStride: 97, skinVertexCountPerFrame: cap.vertexIds.length, skinCheckedEveryFrame: true,
    determinismMaxDiff: cap.determinismMaxDiff, rootAndArmatureIdentity: true, boneScalesConstantUnit: true,
    seamBoneMaxErrorMm: Math.max(...cap.frames[0].world.map((value, i) => new THREE.Vector3(...value).distanceTo(new THREE.Vector3(...cap.frames.at(-1).world[i])))) * 1000,
    probes: probes.map(row => ({ probe: row.probe, wall: row.wall, sequenceTime: row.sequenceTime, joint: row.jointName, jointErrorMm: row.joint * 1000, skinErrorMm: row.skin * 1000 })) };
  mixer.stopAllAction(); mixer.uncacheRoot(scene);
  assert.ok(evidence.frameJointMaxErrorMm < 0.01 && evidence.frameSkinMaxErrorMm < 0.01, 'Baked frame parity failed');
  assert.ok(evidence.probeJointMaxErrorMm < 5 && evidence.probeSkinMaxErrorMm < 5, '60fps interpolation exceeds 5mm');
  assert.ok(evidence.seamBoneMaxErrorMm < 0.001, 'Loop seam changed');
  return evidence;
}
export async function bake() {
  const cap = await captureRuntime(), rig = readJson('source/coach/coach-v41-rig.json');
  const { scene: model } = await loadGlb('source/coach/flare-coach-v41-base.glb'); model.updateMatrixWorld(true);
  const meshes = [], skeletons = new Set(); model.traverse(value => { if (value.isSkinnedMesh) { meshes.push(value); skeletons.add(value.skeleton); } });
  const spine = installSpineHelpers({ model, meshes, skeletons, landmarks: rig.landmarks }); assert.ok(spine);
  for (const name of spine.helpers) { const bone = model.getObjectByName(name); bone.matrixAutoUpdate = true; bone.matrixWorldAutoUpdate = true; bone.position.set(0, 0, 0); bone.quaternion.identity(); bone.scale.set(1, 1, 1); }
  model.updateMatrixWorld(true); model.name = 'flare_coach_v41';
  const times = new Float32Array(cap.frames.map(frame => frame.wall)), tracks = [];
  names.forEach((name, bone) => {
    const positions = [], quaternions = []; let previous = null;
    for (const frame of cap.frames) {
      const local = frame.local[bone]; let q = local.slice(3, 7);
      if (previous && previous.reduce((sum, value, i) => sum + value * q[i], 0) < 0) q = q.map(value => -value);
      previous = q; positions.push(...local.slice(0, 3)); quaternions.push(...q);
    }
    tracks.push(new THREE.VectorKeyframeTrack(name + '.position', times, positions));
    tracks.push(new THREE.QuaternionKeyframeTrack(name + '.quaternion', times, quaternions));
  });
  const clip = new THREE.AnimationClip('flare_v41_loop', cap.loopWall, tracks);
  const bytes = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true, animations: [clip], onlyVisible: false }));
  fs.writeFileSync(sceneFile('source/coach/flare-coach-v41-animated.glb'), bytes);
  const timeline = phaseTimeline({ ...cap.sequence, ...cap.options }, { smooth: cap.smoothLoop });
  const frames = cap.frames.map((frame, i) => {
    const sampled = samplePhase(timeline, frame.raw), current = sampled.current, items = phaseItems(current.phase, current.support);
    return { frame: i, time: frame.wall, sequenceTime: frame.raw, keyIndex: current.index, phaseSource: current.phase.source,
      phaseId: current.phase.id, support: current.support,
      primary: items.filter(item => item.level === 'primary').map(item => ({ id: item.groupId, side: item.side })),
      secondary: items.filter(item => item.level === 'secondary').map(item => ({ id: item.groupId, side: item.side })) };
  });
  const phases = { format: 'flare-phases-v1', version: 'v41', clip: clip.name, fps: 60, duration: cap.loopWall, frameCount: frames.length,
    keys: timeline.keys.map(key => ({ keyIndex: key.index, sequenceTime: key.time, phaseId: key.phase.id, source: key.phase.source, support: key.support, supportLabel: supportLabel(key.support) })),
    phaseDefs: Object.fromEntries(timeline.keys.map(key => [key.phase.id, { source: key.phase.source, name: key.phase.name, detail: key.phase.detail, caption: key.phase.caption }])),
    groups: Object.fromEntries(FLARE_GROUPS.map(group => [group.groupId, { label: group.label, section: group.section, colour: group.colour }])), frames };
  fs.writeFileSync(sceneFile('src/v41-phases.json'), JSON.stringify(phases) + '\n');
  fs.writeFileSync(sceneFile('src/v41-clock.json'), JSON.stringify({ version: 'v41', frameTimes: frames.map(frame => frame.time), sequenceTime: frames.map(frame => frame.sequenceTime) }) + '\n');
  fs.writeFileSync(sceneFile('source/coach/flare-sequence-v41.json'), JSON.stringify({ ...cap.sequence, ...cap.options }, null, 2) + '\n');
  const evidence = compareCapture(await loadGlb('source/coach/flare-coach-v41-animated.glb'), cap);
  fs.mkdirSync(sceneFile('tools/evidence/'), { recursive: true });
  fs.writeFileSync(sceneFile('tools/evidence/v41-bake-parity.json'), JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify(evidence, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await bake();
