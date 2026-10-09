// Bake step 2/2: turn capture.json (tools/bake/capture.mjs) into app-ready files and verify.
//
//   flare-coach-<ver>-animated.glb  public/coach/flare-coach.glb + the two runtime spine helper
//                                  bones (with the runtime's redistributed waist weights) +
//                                  AnimationClip "flare_<ver>_loop" (LINEAR, ~60 fps, seamless)
//   flare-<ver>-baked-60fps.json   raw per-frame bone transforms for other engines
//   flare-<ver>-phases.json       per-frame phase / support hand / active muscle groups
//
// Verification: the written GLB is re-loaded with GLTFLoader, played with AnimationMixer
// at every baked frame and at 24 live probe times between frames, and joint world
// positions + 1/97 of Coach_Body's skinned vertices are compared to the live runtime.
//
// usage: node tools/bake/build-glb.mjs [--capture tools/bake/out/capture.json] [--out tools/bake/out] [--ver v41] [--source 'Flare v41 runtime (git ...)']
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { installSpineHelpers } from '../../src/spine-helpers.js';
import { phaseTimeline, samplePhase, phaseItems, supportLabel } from '../../src/flare-phase-muscles.js';
import { FLARE_GROUPS } from '../../src/flare-muscle-groups.js';

// GLTFExporter needs FileReader (browser API) for binary output
globalThis.FileReader ??= class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(b => { this.result = b; this.onloadend?.(); this.onload?.(); }); } readAsDataURL(blob) { blob.arrayBuffer().then(b => { this.result = `data:${blob.type || 'application/octet-stream'};base64,` + Buffer.from(b).toString('base64'); this.onloadend?.(); this.onload?.(); }); } };

const arg = (name, fallback) => { const i = process.argv.indexOf('--' + name); return i >= 0 ? process.argv[i + 1] : fallback; };
const root = path.resolve(new URL('../..', import.meta.url).pathname);
const capturePath = arg('capture', path.join(root, 'tools/bake/out/capture.json'));
const outDir = arg('out', path.join(root, 'tools/bake/out'));
const VER = arg('ver', process.env.BAKE_VER || 'v41'), SRC = arg('source', process.env.BAKE_SOURCE || `Flare ${VER} runtime`);
const CLIP = arg('clip', `flare_${VER}_loop`);
fs.mkdirSync(outDir, { recursive: true });
const cap = JSON.parse(fs.readFileSync(capturePath, 'utf8'));
const rigData = JSON.parse(fs.readFileSync(path.join(root, 'public/coach/coach-rig.json'), 'utf8'));

const loadGlb = file => new Promise((resolve, reject) => { const b = fs.readFileSync(file); new GLTFLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), '', resolve, reject); });

// ---------- 1. model with the runtime's spine helpers made permanent ----------
const gltf = await loadGlb(path.join(root, 'public/coach/flare-coach.glb'));
const model = gltf.scene; model.updateMatrixWorld(true);
const meshes = [], skeletons = new Set();
model.traverse(o => { if (o.isSkinnedMesh) { meshes.push(o); skeletons.add(o.skeleton); } });
const spine = installSpineHelpers({ model, meshes, skeletons, landmarks: rigData.landmarks });
if (!spine) throw new Error('spine helpers not installed');
for (const name of spine.helpers) { const b = model.getObjectByName(name); b.matrixAutoUpdate = true; b.matrixWorldAutoUpdate = true; b.position.set(0, 0, 0); b.quaternion.identity(); b.scale.set(1, 1, 1); }
model.updateMatrixWorld(true);

// ---------- 2. clip ----------
const frames = cap.frames, F = frames.length; // last frame == first (seamless), included so LINEAR loops close
const times = new Float32Array(frames.map(f => f.wall));
const tracks = [];
const quats = cap.names.map(() => []), poss = cap.names.map(() => []);
cap.names.forEach((name, j) => {
  let prev = null;
  for (const f of frames) {
    const l = f.local[j]; let q = l.slice(3, 7);
    if (prev && prev[0] * q[0] + prev[1] * q[1] + prev[2] * q[2] + prev[3] * q[3] < 0) q = q.map(x => -x); // hemisphere continuity
    prev = q; quats[j].push(...q); poss[j].push(...l.slice(0, 3));
  }
  tracks.push(new THREE.VectorKeyframeTrack(`${name}.position`, times, poss[j]));
  tracks.push(new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, quats[j]));
});
const clip = new THREE.AnimationClip(CLIP, cap.loopWall, tracks);

// ---------- 3. export ----------
model.name = `flare_coach_${VER}`;
const glb = await new GLTFExporter().parseAsync(model, { binary: true, animations: [clip], onlyVisible: false });
const glbPath = path.join(outDir, `flare-coach-${VER}-animated.glb`);
fs.writeFileSync(glbPath, Buffer.from(glb));

// ---------- 4. verify: reload + AnimationMixer vs live runtime ----------
const re = await loadGlb(glbPath), scene = re.scene;
const reClip = re.animations.find(a => a.name === CLIP); if (!reClip) throw new Error('clip missing after reload');
const mixer = new THREE.AnimationMixer(scene); const action = mixer.clipAction(reClip); action.play();
const nodes = cap.names.map(n => scene.getObjectByName(n));
const body = scene.getObjectByName('Coach_Body') ?? (() => { let m = null; scene.traverse(o => { if (!m && o.isSkinnedMesh && o.name.startsWith('Coach_Body')) m = o; }); return m; })();
const v = new THREE.Vector3();
const check = (sample, deform) => {
  mixer.setTime(sample.wall); scene.updateMatrixWorld(true);
  let joint = 0, jointName = '';
  nodes.forEach((n, j) => { n.getWorldPosition(v); const d = v.distanceTo(new THREE.Vector3(...sample.world[j])); if (d > joint) { joint = d; jointName = cap.names[j]; } });
  let skin = 0;
  if (deform) { body.skeleton.update(); cap.vertexIds.forEach((id, k) => { body.getVertexPosition(id, v).applyMatrix4(body.matrixWorld); skin = Math.max(skin, v.distanceTo(new THREE.Vector3(...sample.verts.slice(3 * k, 3 * k + 3)))); }); }
  return { joint, jointName, skin };
};
const stats = (rows, key) => rows.reduce((a, r) => Math.max(a, r[key]), 0);
const frameRows = frames.slice(0, -1).map((f, i) => ({ i, ...check(f, i % 10 === 0) }));
const probeRows = cap.probes.map((p, i) => ({ i, ...check(p, true) }));
const verify = {
  bakedFrames: { count: frameRows.length, maxJointErrorCm: stats(frameRows, 'joint') * 100, maxSkinVertexErrorCm: stats(frameRows, 'skin') * 100, skinCheckedEvery: 10 },
  liveProbesBetweenFrames: { count: probeRows.length, maxJointErrorCm: stats(probeRows, 'joint') * 100, maxSkinVertexErrorCm: stats(probeRows, 'skin') * 100,
    worst: (w => ({ probe: w.i, wall: +cap.probes[w.i].wall.toFixed(4), jointCm: w.joint * 100, joint: w.jointName, skinCm: w.skin * 100 }))(probeRows.reduce((a, r) => r.joint > a.joint ? r : a, { joint: 0 })),
    note: 'probes are live runtime samples at wall times between baked frames, so they measure the LINEAR interpolation error of the 60 fps clip' },
  seamFirstVsLastFrameCm: Math.max(...frames[0].world.map((p, j) => new THREE.Vector3(...p).distanceTo(new THREE.Vector3(...frames[F - 1].world[j])))) * 100,
  skinVertexSample: `${cap.vertexIds.length} Coach_Body vertices (every 97th)`,
};
verify.examples = [0, 90, 180, 270, 360, 450].map(i => ({ frame: i, wall: +frames[i].wall.toFixed(4), raw: +frames[i].raw.toFixed(4), ...check(frames[i], true) })).map(r => ({ ...r, joint: +(r.joint * 100).toFixed(5) + ' cm', skin: +(r.skin * 100).toFixed(4) + ' cm' }));

// ---------- 5. raw JSON ----------
const r6 = x => Math.round(x * 1e6) / 1e6;
const baked = {
  format: 'flare-baked-v1', clip: CLIP, source: `${SRC}, viewer default URL params, paced clock, speed 1`,
  fps: 60, effectiveFps: (F - 1) / cap.loopWall, frameCount: F, uniqueFrames: F - 1, duration: cap.loopWall, loop: 'seamless (last frame == first frame)',
  units: 'metres; quaternions [x,y,z,w]', coordinateSystem: 'three.js / glTF: right-handed, +Y up, character origin on the floor (y = 0)',
  hierarchy: 'every bone is a direct child of the armature node "Coach_Rig" (parallel deform bones, no bone-to-bone parenting); Coach_Rig and the scene root are identity for the whole clip, so local == model space',
  bones: cap.names, helperBones: spine.helpers, helperNote: `spineLower/spineUpper only exist in flare-coach-${VER}-animated.glb (runtime waist-skinning helpers). With the original flare-coach.glb use the 20 deform bones and ignore them.`,
  frameTimes: Array.from(times, r6), sequenceTime: frames.map(f => r6(f.raw)), sequencePeriod: cap.period,
  tracks: Object.fromEntries(cap.names.map((n, j) => [n, { position: poss[j].map(r6), quaternion: quats[j].map(r6) }])),
};
fs.writeFileSync(path.join(outDir, `flare-${VER}-baked-60fps.json`), JSON.stringify(baked));

// ---------- 6. phase / support / muscle timeline ----------
const timeline = phaseTimeline(cap.sequence, { smooth: cap.smoothLoop });
const GROUP = Object.fromEntries(FLARE_GROUPS.map(g => [g.groupId, g]));
const per = frames.map((f, i) => {
  const s = samplePhase(timeline, f.raw), c = s.current;
  const items = phaseItems(c.phase, c.support);
  return { frame: i, time: r6(f.wall), sequenceTime: r6(f.raw), keyIndex: c.index, phaseSource: c.phase.source, phaseId: c.phase.id, support: c.support,
    fadeTo: s.neighbour ? { keyIndex: s.neighbour.index, phaseId: s.neighbour.phase.id, w: r6(s.w) } : null,
    primary: items.filter(x => x.level === 'primary').map(x => ({ id: x.groupId, side: x.side })),
    secondary: items.filter(x => x.level === 'secondary').map(x => ({ id: x.groupId, side: x.side })) };
});
const segments = []; for (const p of per) { const last = segments.at(-1); if (last && last.keyIndex === p.keyIndex && last.phaseId === p.phaseId) { last.endFrame = p.frame; last.end = p.time; } else segments.push({ keyIndex: p.keyIndex, phaseId: p.phaseId, startFrame: p.frame, endFrame: p.frame, start: p.time, end: p.time }); }
const phaseDefs = Object.fromEntries(timeline.keys.map(k => [k.phase.id, { source: k.phase.source, name: k.phase.name, detail: k.phase.detail, caption: k.phase.caption }]));
const phases = {
  format: 'flare-phases-v1', clip: CLIP, fps: 60, duration: cap.loopWall, frameCount: F,
  note: 'Same rule as the app\'s muscle-sync panel: samplePhase(phaseTimeline(sequence,{smooth:true}), sequenceTime) from src/flare-phase-muscles.js. side is resolved from the support hand (left/right/both). fadeTo/w is the 0.16 s crossfade window (w 0..0.5).',
  keys: timeline.keys.map(k => ({ keyIndex: k.index, sequenceTime: k.time, phaseId: k.phase.id, source: k.phase.source, support: k.support, supportLabel: supportLabel(k.support) })),
  phaseDefs, segments,
  groups: Object.fromEntries(FLARE_GROUPS.map(g => [g.groupId, { label: g.label, section: g.section, colour: g.colour }])),
  frames: per,
};
fs.writeFileSync(path.join(outDir, `flare-${VER}-phases.json`), JSON.stringify(phases));
fs.writeFileSync(path.join(outDir, 'verify.json'), JSON.stringify(verify, null, 2));
console.log(JSON.stringify(verify, null, 2));
console.log('glb', (fs.statSync(glbPath).size / 1e6).toFixed(2), 'MB');
