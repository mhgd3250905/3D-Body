// Read-only geometry/kinematics comparison. This does not infer forces or technique quality.
// node tools/motion-v42/audit-candidate.mjs [candidate.glb] [--out directory]
// Options: --baseline path --intervals 540 --body-every 3 --contact-y 0.006 --near 0.005
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const defaults = {
  candidate: path.join(root, 'output/flare-v42-r12-20261015/flare-coach-v42-candidate.glb'),
  baseline: path.join(root, 'output/flare-v42-r11-20261015/flare-coach-v42-candidate.glb'),
  out: path.join(root, 'output/flare-v42-r12-20261015/geometry-coach'),
  intervals: 540, bodyEvery: 3, contactY: 0.006, near: 0.005,
};
const args = { ...defaults };
const options = new Map([['--candidate', 'candidate'], ['--baseline', 'baseline'], ['--out', 'out'],
  ['--intervals', 'intervals'], ['--body-every', 'bodyEvery'], ['--contact-y', 'contactY'], ['--near', 'near']]);
let positional = false, explicitBaseline = false;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (options.has(arg)) {
    const key = options.get(arg), value = process.argv[++i];
    if (key === 'baseline') explicitBaseline = true;
    if (value === undefined) throw new Error(`Missing value for ${arg}`);
    args[key] = typeof defaults[key] === 'number' ? Number(value) : path.resolve(value);
  } else if (!arg.startsWith('-') && !positional) { args.candidate = path.resolve(arg); positional = true; }
  else throw new Error(`Unknown argument: ${arg}`);
}
const baselineFallback = !explicitBaseline && !fs.existsSync(args.baseline);
if (baselineFallback) {
  args.baseline = path.join(root, 'app/scene/source/coach/flare-coach-v41-animated.glb');
  console.warn(`R11 baseline is unavailable; using tracked v41 coach baseline: ${args.baseline}`);
}
if (!Number.isInteger(args.intervals) || args.intervals < 24 || args.intervals > 3600) throw new Error('--intervals must be an integer 24..3600');
if (!Number.isInteger(args.bodyEvery) || args.bodyEvery < 1) throw new Error('--body-every must be a positive integer');
if (!Number.isFinite(args.contactY) || !Number.isFinite(args.near) || args.near <= 0) throw new Error('Invalid contact threshold');
for (const key of ['candidate', 'baseline']) if (!fs.existsSync(args[key])) throw new Error(`${key} not found: ${args[key]}`);

globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const rig = JSON.parse(fs.readFileSync(path.join(root, 'app/scene/source/coach/coach-v41-rig.json'), 'utf8'));
const V = a => new THREE.Vector3(...a), Q = a => new THREE.Quaternion(...a).normalize();
const deg = r => r * 180 / Math.PI;
const distance = (a, b) => V(a).distanceTo(V(b));
const angle = (a, b, c) => deg(V(a).sub(V(b)).angleTo(V(c).sub(V(b))));
const extent = values => values.length ? { min: Math.min(...values), max: Math.max(...values) } : null;
const stats = values => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b), at = q => sorted[Math.round((sorted.length - 1) * q)];
  return { ...extent(values), median: at(.5), p95: at(.95) };
};
const sides = ['left', 'right'];
const major = ['pelvis', 'torso', 'neck', 'head', ...sides.flatMap(s => [s + 'UpperArm', s + 'Forearm', s + 'Hand', s + 'Thigh', s + 'Shin', s + 'Foot'])];
const spans = sides.flatMap(s => [
  [s + 'UpperArm', s + 'UpperArm', s + 'Forearm'], [s + 'Forearm', s + 'Forearm', s + 'Hand'],
  [s + 'Thigh', s + 'Thigh', s + 'Shin'], [s + 'Shin', s + 'Shin', s + 'Foot'],
]);
const floorY = -0.014;

function cyclicRuns(rows, predicate) {
  const n = rows.length - 1, bits = rows.slice(0, -1).map(predicate);
  if (!bits.some(Boolean)) return [];
  if (bits.every(Boolean)) return [{ indices: Array.from({ length: n }, (_, i) => i), wraps: true }];
  const origin = (bits.findIndex(v => !v) + 1) % n, result = []; let run = null;
  for (let k = 0; k < n; k++) {
    const i = (origin + k) % n;
    if (bits[i]) { run ??= { indices: [], wraps: false }; if (run.indices.length && i < run.indices.at(-1)) run.wraps = true; run.indices.push(i); }
    else if (run) { result.push(run); run = null; }
  }
  if (run) result.push(run);
  return result;
}
function describeRun(run, rows, dt, side = null) {
  const first = run.indices[0], last = run.indices.at(-1);
  const result = { firstFrame: first, lastFrame: last, wraps: run.wraps, sampleCount: run.indices.length,
    approximateDurationSeconds: run.indices.length * dt, startPhase: rows[first].phase, endPhase: rows[last].phase };
  if (side) {
    const selected = run.indices.map(i => rows[i]), reference = selected[0].surface[side].palmCentroid;
    result.palmPatchHorizontalExcursionFromFirstMetres = Math.max(...selected.map(r => Math.hypot(r.surface[side].palmCentroid[0] - reference[0], r.surface[side].palmCentroid[2] - reference[2])));
    result.palmPatch3dExcursionFromFirstMetres = Math.max(...selected.map(r => distance(r.surface[side].palmCentroid, reference)));
    result.handMinY = extent(selected.map(r => r.surface[side].handMinY));
    result.palmMinY = extent(selected.map(r => r.surface[side].palmMinY));
    result.elbowDegrees = extent(selected.map(r => r.angles[side + 'Elbow']));
  }
  return result;
}

async function audit(input, label) {
  const bytes = fs.readFileSync(input), sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const unpacked = bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes;
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(unpacked.buffer.slice(unpacked.byteOffset, unpacked.byteOffset + unpacked.byteLength), '');
  const model = gltf.scene, clip = [...gltf.animations].sort((a, b) => b.tracks.length - a.tracks.length)[0];
  if (!clip || !(clip.duration > 0)) throw new Error(`${label}: no positive-duration animation clip`);
  model.updateMatrixWorld(true);
  const bones = new Map(), meshes = [];
  model.traverse(o => { if (o.isBone) bones.set(o.name, o); if (o.isSkinnedMesh) { meshes.push(o); o.skeleton.update(); } });
  for (const name of major) if (!bones.has(name)) throw new Error(`${label}: missing bone ${name}`);
  const rest = new Map([...bones].map(([name, bone]) => [name, { inverse: bone.matrixWorld.clone().invert(), quaternion: bone.getWorldQuaternion(new THREE.Quaternion()).normalize(), position: bone.getWorldPosition(new THREE.Vector3()), scale: bone.getWorldScale(new THREE.Vector3()) }]));
  const landmarks = Object.fromEntries(Object.entries(rig.landmarks).map(([name, p]) => [name, {
    point: V(p), bone: ['pelvis', 'torso', 'neck', 'head'].includes(name) ? name : name.replace(/Shoulder$/, 'UpperArm').replace(/Elbow$/, 'Forearm').replace(/Wrist$/, 'Hand').replace(/Hip$/, 'Thigh').replace(/Knee$/, 'Shin').replace(/Ankle$/, 'Foot'),
  }]));
  const selection = Object.fromEntries(sides.map(s => [s, { hand: [], shoe: [], palm: [] }]));
  const point = new THREE.Vector3();
  for (const mesh of meshes) {
    const { skinIndex, skinWeight, position } = mesh.geometry.attributes;
    if (!skinIndex || !skinWeight || !position) continue;
    const isShoe = /^Coach_(Sneakers|Soles|Shoe_Details)(?:_|$)/.test(mesh.name);
    for (let index = 0; index < position.count; index++) {
      const weights = { leftHand: 0, rightHand: 0, leftFoot: 0, rightFoot: 0 };
      for (let k = 0; k < 4; k++) { const name = mesh.skeleton.bones[skinIndex.getComponent(index, k)]?.name; if (Object.hasOwn(weights, name)) weights[name] += skinWeight.getComponent(index, k); }
      for (const side of sides) {
        if (weights[side + 'Hand'] > .7) {
          mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld);
          selection[side].hand.push({ mesh, index, rest: point.clone() });
        }
        if (isShoe && weights[side + 'Foot'] > .7) selection[side].shoe.push({ mesh, index });
      }
    }
  }
  for (const side of sides) {
    if (!selection[side].hand.length || !selection[side].shoe.length) throw new Error(`${label}: empty actual hand/shoe selection for ${side}`);
    const sign = side === 'left' ? 1 : -1, wrist = V(rig.landmarks[side + 'Wrist']);
    const finger = new THREE.Vector3(sign * .98253144, .05483374, .17783482).normalize();
    const normal = new THREE.Vector3(sign * .06068526, -.99777448, -.02762938);
    normal.addScaledVector(finger, -normal.dot(finger)).normalize();
    const length = Math.max(...selection[side].hand.map(v => v.rest.clone().sub(wrist).dot(finger)));
    const central = selection[side].hand.filter(v => { const along = v.rest.clone().sub(wrist).dot(finger); return along >= length * .15 && along <= length * .55; });
    const depth = Math.max(...central.map(v => v.rest.clone().sub(wrist).dot(normal)));
    selection[side].palm = central.filter(v => v.rest.clone().sub(wrist).dot(normal) >= depth - .004);
    if (!selection[side].palm.length) throw new Error(`${label}: no central palmar patch for ${side}`);
  }
  const mixer = new THREE.AnimationMixer(model), action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  const rows = [], dt = clip.duration / args.intervals, matrixFrames = [], restLengths = Object.fromEntries(spans.map(([name, a, b]) => [name, rest.get(a).position.distanceTo(rest.get(b).position)]));
  let nonFiniteMatrices = 0, maxScaleDeviation = 0;
  const surface = refs => { let minY = Infinity; const center = new THREE.Vector3(); for (const { mesh, index } of refs) { mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld); minY = Math.min(minY, point.y); center.add(point); } return { minY, centroid: center.divideScalar(refs.length).toArray() }; };
  for (let i = 0; i <= args.intervals; i++) {
    const time = i * dt;
    action.enabled = true; action.paused = false; action.play(); mixer.setTime(time);
    model.updateMatrixWorld(true); for (const mesh of meshes) mesh.skeleton.update();
    const positions = {}, rotations = {}, deltas = new Map();
    for (const [name, bone] of bones) {
      if (!bone.matrixWorld.elements.every(Number.isFinite)) nonFiniteMatrices++;
      positions[name] = bone.getWorldPosition(point).toArray();
      rotations[name] = bone.getWorldQuaternion(new THREE.Quaternion()).normalize().toArray();
      maxScaleDeviation = Math.max(maxScaleDeviation, bone.getWorldScale(new THREE.Vector3()).distanceTo(rest.get(name).scale));
      deltas.set(name, bone.matrixWorld.clone().multiply(rest.get(name).inverse));
    }
    if (i === 0 || i === args.intervals) matrixFrames.push(Object.fromEntries([...bones].map(([name, bone]) => [name, [...bone.matrixWorld.elements]])));
    const joints = Object.fromEntries(Object.entries(landmarks).map(([name, l]) => [name, l.point.clone().applyMatrix4(deltas.get(l.bone)).toArray()]));
    const qDelta = name => Q(rotations[name]).multiply(rest.get(name).quaternion.clone().invert()).normalize();
    const angles = {
      chestVsPelvis: deg(qDelta('torso').angleTo(qDelta('pelvis'))), headVsChest: deg(qDelta('head').angleTo(qDelta('torso'))),
      neckVsChest: deg(qDelta('neck').angleTo(qDelta('torso'))), headVsNeck: deg(qDelta('head').angleTo(qDelta('neck'))),
      legAperture: deg(V(joints.leftAnkle).sub(V(joints.leftHip)).angleTo(V(joints.rightAnkle).sub(V(joints.rightHip)))),
    };
    const surfaces = {};
    for (const side of sides) {
      angles[side + 'Elbow'] = angle(joints[side + 'Shoulder'], joints[side + 'Elbow'], joints[side + 'Wrist']);
      angles[side + 'Knee'] = angle(joints[side + 'Hip'], joints[side + 'Knee'], joints[side + 'Ankle']);
      const hand = surface(selection[side].hand), palm = surface(selection[side].palm), shoe = surface(selection[side].shoe);
      surfaces[side] = { handMinY: hand.minY, palmMinY: palm.minY, shoeMinY: shoe.minY, palmCentroid: palm.centroid,
        handNearContact: hand.minY <= args.contactY + args.near, palmNearContact: palm.minY <= args.contactY + args.near };
    }
    let bodyMinY = null;
    if (i % args.bodyEvery === 0 || i === args.intervals) {
      bodyMinY = Infinity;
      for (const mesh of meshes) for (let j = 0; j < mesh.geometry.attributes.position.count; j++) { mesh.getVertexPosition(j, point).applyMatrix4(mesh.matrixWorld); bodyMinY = Math.min(bodyMinY, point.y); }
    }
    rows.push({ frame: i, phase: i / args.intervals, time, joints, bonePositions: Object.fromEntries(major.map(n => [n, positions[n]])), angles, surface: surfaces,
      boneSpans: Object.fromEntries(spans.map(([name, a, b]) => [name, distance(positions[a], positions[b])])), bodyMinY,
      rotations: Object.fromEntries(major.map(n => [n, rotations[n]])) });
  }
  const unique = rows.slice(0, -1), n = unique.length;
  for (let i = 0; i < n; i++) {
    const prev = unique[(i + n - 1) % n], next = unique[(i + 1) % n], row = unique[i];
    row.speed = {}; row.secondDifference = {};
    for (const name of ['pelvis', 'leftWrist', 'rightWrist', 'leftAnkle', 'rightAnkle', 'head']) {
      row.speed[name] = V(next.joints[name]).sub(V(prev.joints[name])).length() / (2 * dt);
      row.secondDifference[name] = V(next.joints[name]).add(V(prev.joints[name])).addScaledVector(V(row.joints[name]), -2).length() / (dt * dt);
    }
  }
  const seam = { maxWorldMatrixComponentDifference: 0, maxBoneWorldPositionDifferenceMetres: 0, maxBoneWorldRotationDifferenceDegrees: 0, jointPositionMaxMetres: 0, derivativeByJoint: {} };
  for (const name of bones.keys()) {
    const a = matrixFrames[0][name], b = matrixFrames[1][name];
    seam.maxWorldMatrixComponentDifference = Math.max(seam.maxWorldMatrixComponentDifference, ...a.map((v, j) => Math.abs(v - b[j])));
    const am = new THREE.Matrix4().fromArray(a), bm = new THREE.Matrix4().fromArray(b), ap = new THREE.Vector3(), bp = new THREE.Vector3(), aq = new THREE.Quaternion(), bq = new THREE.Quaternion(), scale = new THREE.Vector3();
    am.decompose(ap, aq, scale); bm.decompose(bp, bq, scale);
    seam.maxBoneWorldPositionDifferenceMetres = Math.max(seam.maxBoneWorldPositionDifferenceMetres, ap.distanceTo(bp));
    seam.maxBoneWorldRotationDifferenceDegrees = Math.max(seam.maxBoneWorldRotationDifferenceDegrees, deg(aq.normalize().angleTo(bq.normalize())));
  }
  for (const name of Object.keys(rows[0].joints)) seam.jointPositionMaxMetres = Math.max(seam.jointPositionMaxMetres, distance(rows[0].joints[name], rows.at(-1).joints[name]));
  for (const name of Object.keys(unique[0].speed)) {
    const incoming = V(rows.at(-1).joints[name]).sub(V(unique.at(-1).joints[name])).divideScalar(dt), outgoing = V(unique[1].joints[name]).sub(V(unique[0].joints[name])).divideScalar(dt);
    seam.derivativeByJoint[name] = { oneStepVelocityDifferenceMetresPerSecond: outgoing.distanceTo(incoming), perCycleDifference: outgoing.distanceTo(incoming) * clip.duration };
  }
  const boneSpans = Object.fromEntries(spans.map(([name]) => {
    const values = unique.map(r => r.boneSpans[name]), ex = extent(values);
    return [name, { rest: restLengths[name], ...ex, withinCycleRangeMetres: ex.max - ex.min, maxAbsoluteDeviationFromRestMetres: Math.max(...values.map(v => Math.abs(v - restLengths[name]))) }];
  }));
  const contact = {}, ground = {}, elbowByContact = {};
  for (const side of sides) {
    contact[side] = cyclicRuns(rows, r => r.surface[side].palmNearContact).map(run => describeRun(run, rows, dt, side));
    ground[side] = Object.fromEntries(['handMinY', 'palmMinY', 'shoeMinY'].map(key => {
      const values = unique.map(r => r.surface[side][key]);
      return [key, { ...extent(values), minimumClearanceAboveRenderedStage: Math.min(...values) - floorY,
        framesBelowWorldZero: values.filter(v => v < 0).length, framesBelowRenderedStage: values.filter(v => v < floorY).length }];
    }));
    elbowByContact[side] = { palmNearContact: stats(unique.filter(r => r.surface[side].palmNearContact).map(r => r.angles[side + 'Elbow'])),
      handClearlyAirborne: stats(unique.filter(r => r.surface[side].handMinY > args.contactY + .05).map(r => r.angles[side + 'Elbow'])) };
  }
  contact.bothPalmsNear = cyclicRuns(rows, r => r.surface.left.palmNearContact && r.surface.right.palmNearContact).map(run => describeRun(run, rows, dt));
  contact.neitherHandNear = cyclicRuns(rows, r => !r.surface.left.handNearContact && !r.surface.right.handNearContact).map(run => describeRun(run, rows, dt));
  const speeds = {}, secondDifferences = {};
  for (const name of Object.keys(unique[0].speed)) {
    for (const [key, output, factor] of [['speed', speeds, clip.duration], ['secondDifference', secondDifferences, clip.duration ** 2]]) {
      const values = unique.map(r => r[key][name]), max = Math.max(...values);
      output[name] = { atActualClipDuration: stats(values), perNormalizedCycle: stats(values.map(v => v * factor)), maxFrame: values.indexOf(max), maxPhase: values.indexOf(max) / n };
    }
  }
  const angularSpeed = Object.fromEntries(major.map(name => [name, stats(unique.map((r, i) => deg(Q(r.rotations[name]).angleTo(Q(unique[(i + 1) % n].rotations[name]))) / dt))]));
  const bodyValues = rows.filter(r => r.bodyMinY !== null).map(r => r.bodyMinY);
  const result = {
    label, asset: { path: input, bytes: bytes.length, sha256, clip: clip.name, duration: clip.duration, tracks: clip.tracks.length, bones: bones.size },
    sampling: { intervals: args.intervals, rowsIncludingRepeatedEnd: rows.length, dt, fullBodyEveryFrames: args.bodyEvery, fullBodySampleCount: bodyValues.length,
      verticesPerFullBodySample: meshes.reduce((sum, m) => sum + m.geometry.attributes.position.count, 0), surfaceVerticesPerFrame: Object.fromEntries(sides.map(s => [s, Object.fromEntries(Object.entries(selection[s]).map(([k, a]) => [k, a.length]))])) },
    integrity: { nonFiniteMatrices, maxBoneWorldScaleDeviationFromRest: maxScaleDeviation }, seam, boneSpans,
    anglesDegrees: Object.fromEntries(Object.keys(unique[0].angles).map(k => [k, extent(unique.map(r => r.angles[k]))])), elbowByGeometricContactDegrees: elbowByContact,
    ground: { renderedStageY: floorY, contactLayerY: args.contactY, nearContactTolerance: args.near, selectedRegions: ground,
      fullBodySampled: { ...extent(bodyValues), minimumClearanceAboveRenderedStage: Math.min(...bodyValues) - floorY, samplesBelowRenderedStage: bodyValues.filter(v => v < floorY).length } },
    geometricContact: contact, linearSpeedMetresPerSecond: speeds, centeredSecondDifferenceMetresPerSecondSquared: secondDifferences, boneAngularSpeedDegreesPerSecond: angularSpeed,
  };
  mixer.stopAllAction(); mixer.uncacheRoot(model);
  return { result, rows };
}

fs.mkdirSync(args.out, { recursive: true });
const baseline = await audit(args.baseline, 'baseline-v41');
console.log(JSON.stringify({ completed: 'baseline', clip: baseline.result.asset.clip, duration: baseline.result.asset.duration }));
const candidate = await audit(args.candidate, 'candidate');
const comparison = { flags: [], numbers: {} };
function flag(type, message, baselineValue, candidateValue) { comparison.flags.push({ type, message, baseline: baselineValue, candidate: candidateValue }); }
const b = baseline.result, c = candidate.result;
if (c.integrity.nonFiniteMatrices) flag('structural', 'Non-finite bone world matrices', b.integrity.nonFiniteMatrices, c.integrity.nonFiniteMatrices);
if (c.integrity.maxBoneWorldScaleDeviationFromRest > b.integrity.maxBoneWorldScaleDeviationFromRest + .00001) flag('structural', 'Bone world scale changes more than baseline by >1e-5', b.integrity.maxBoneWorldScaleDeviationFromRest, c.integrity.maxBoneWorldScaleDeviationFromRest);
if (c.seam.jointPositionMaxMetres > Math.max(.00001, b.seam.jointPositionMaxMetres + .00001)) flag('structural', 'Loop joint-position seam exceeds baseline by >0.01mm', b.seam.jointPositionMaxMetres, c.seam.jointPositionMaxMetres);
if (c.seam.maxBoneWorldRotationDifferenceDegrees > Math.max(.01, b.seam.maxBoneWorldRotationDifferenceDegrees + .01)) flag('structural', 'Loop bone-rotation seam exceeds baseline by >0.01 degree', b.seam.maxBoneWorldRotationDifferenceDegrees, c.seam.maxBoneWorldRotationDifferenceDegrees);
for (const [name, bs] of Object.entries(b.boneSpans)) {
  const cs = c.boneSpans[name];
  if (cs.withinCycleRangeMetres > bs.withinCycleRangeMetres + .001) flag('structural', `${name} bone-origin span varies >1mm more than baseline`, bs.withinCycleRangeMetres, cs.withinCycleRangeMetres);
  if (cs.maxAbsoluteDeviationFromRestMetres > bs.maxAbsoluteDeviationFromRestMetres + .001) flag('structural', `${name} bone-origin span deviates from rest >1mm more than baseline`, bs.maxAbsoluteDeviationFromRestMetres, cs.maxAbsoluteDeviationFromRestMetres);
  comparison.numbers[name + 'LengthRangeChangeMetres'] = cs.withinCycleRangeMetres - bs.withinCycleRangeMetres;
}
for (const side of sides) for (const key of ['handMinY', 'palmMinY', 'shoeMinY']) {
  const bs = b.ground.selectedRegions[side][key], cs = c.ground.selectedRegions[side][key];
  if (cs.min < floorY - .001) flag('geometry', `${side} ${key} crosses render floor by >1mm`, bs.min, cs.min);
  if (cs.min < bs.min - .005) flag('review', `${side} ${key} minimum drops >5mm from baseline`, bs.min, cs.min);
}
if (c.ground.fullBodySampled.min < floorY - .001) flag('geometry', 'Sampled full-body skin crosses render floor by >1mm', b.ground.fullBodySampled.min, c.ground.fullBodySampled.min);
const drift = (asset, side) => Math.max(0, ...asset.geometricContact[side].filter(r => r.sampleCount >= 3).map(r => r.palmPatchHorizontalExcursionFromFirstMetres));
for (const side of sides) if (drift(c, side) > drift(b, side) + .01) flag('review', `${side} near-contact palm-patch excursion increases >1cm; distinguish pivoting and sliding visually`, drift(b, side), drift(c, side));
for (const name of Object.keys(b.centeredSecondDifferenceMetresPerSecondSquared)) {
  const bs = b.centeredSecondDifferenceMetresPerSecondSquared[name].perNormalizedCycle.max, cs = c.centeredSecondDifferenceMetresPerSecondSquared[name].perNormalizedCycle.max;
  if (cs > bs * 1.5 && cs > bs + 10) flag('review', `${name} normalized-cycle second-difference peak rises >50%; visual continuity review only`, bs, cs);
}
comparison.numbers.durationRatio = c.asset.duration / b.asset.duration;
for (const key of Object.keys(b.anglesDegrees)) comparison.numbers[key] = { baseline: b.anglesDegrees[key], candidate: c.anglesDegrees[key] };
const report = {
  format: 'flare-motion-candidate-audit-v1', generatedAt: new Date().toISOString(),
  baselineSelection: { explicit: explicitBaseline, fallbackToV41: baselineFallback, path: args.baseline },
  verdict: comparison.flags.some(f => ['structural', 'geometry'].includes(f.type)) ? 'structural-or-geometric-regression-needs-review' : comparison.flags.length ? 'kinematic-review-needed' : 'measured-structural-checks-clear',
  definitions: {
    boneSpan: 'Euclidean distance between named actual bone world origins, tracked independently of skin and rig landmarks. Compared against its loaded rest and baseline variation.',
    rotation: 'Unsigned 3D angle between normalized q_current_world * inverse(q_rest_world) rotations. Not isolated axial twist. Quaternion normalization precedes every angle comparison.',
    jointAngles: 'Rig landmark points transported by actual bone world/rest-inverse matrices. Knee hip-knee-ankle; elbow shoulder-elbow-wrist; 180 degrees means straight. Leg aperture compares the two hip-to-ankle vectors in 3D.',
    surfaces: 'Actual deformed vertices via SkinnedMesh.getVertexPosition and mesh.matrixWorld, all frames for selected hands/shoes. Hand vertices have >0.7 Hand weight; shoe meshes match Coach_Sneakers/Soles/Shoe_Details with >0.7 Foot weight.',
    palmPatch: 'Fixed palmar-side vertex patch: source Snow finger/normal axes, central 15%-55% of hand length, within4mm of the deepest palmar surface. Its true skinned minY/centroid are measured, not a wrist proxy.',
    contact: 'Near-contact is purely height <= authored contactY + tolerance. No handLocked, phase label, force or COM criterion is used. Airborne elbow subset requires lowest hand skin >contactY+5cm.',
    drift: 'Horizontal excursion of one fixed skinned palm patch centroid within each cyclic near-contact run; palm rocking/pivoting can also move it. Not by itself proof of sliding.',
    derivatives: 'Centered finite differences of uniform normalized-phase samples. Actual-second and per-cycle numbers are both provided. Second differences are visual continuity indicators, not human dynamics/forces.',
    flagThresholds: 'Engineering comparison tolerances (loop0.01mm/0.01deg, extra length variation1mm, floor penetration1mm, height change5mm, extra patch excursion1cm, normalized second-difference peak +50%). These are not real-breaker biomechanical standards.',
  },
  limitations: ['No mass model, ground reaction forces, exact human anatomy or numeric realism percentage.', 'Whole-body mesh sampled at the documented cadence; this is not an exhaustive continuous-time collision proof.', 'Different timing maps may move events between normalized phases; summary event ranges, not pointwise pose identity, should be compared.', 'Animation source and prior files are read only; only this output folder is written.'],
  baseline: b, candidate: c, comparison,
};
fs.writeFileSync(path.join(args.out, 'audit.json'), JSON.stringify(report, null, 2) + '\n');
const compactAsset = asset => ({
  asset: asset.asset, sampling: asset.sampling, integrity: asset.integrity,
  seam: { maxWorldMatrixComponentDifference: asset.seam.maxWorldMatrixComponentDifference,
    maxBoneWorldPositionDifferenceMetres: asset.seam.maxBoneWorldPositionDifferenceMetres,
    maxBoneWorldRotationDifferenceDegrees: asset.seam.maxBoneWorldRotationDifferenceDegrees, jointPositionMaxMetres: asset.seam.jointPositionMaxMetres },
  maxBoneSpanRangeMetres: Math.max(...Object.values(asset.boneSpans).map(v => v.withinCycleRangeMetres)),
  anglesDegrees: asset.anglesDegrees, elbowByGeometricContactDegrees: asset.elbowByGeometricContactDegrees,
  minimumShoeClearanceAboveRenderedStageMetres: Math.min(...sides.map(s => asset.ground.selectedRegions[s].shoeMinY.minimumClearanceAboveRenderedStage)),
  minimumHandWorldYMetres: Math.min(...sides.map(s => asset.ground.selectedRegions[s].handMinY.min)),
  maxNearContactPalmHorizontalExcursionMetres: Object.fromEntries(sides.map(s => [s, drift(asset, s)])),
  noHandNearContactSampleCount: asset.geometricContact.neitherHandNear.reduce((sum, r) => sum + r.sampleCount, 0),
  fullBodySampled: asset.ground.fullBodySampled,
});
fs.writeFileSync(path.join(args.out, 'compact-summary.json'), JSON.stringify({ format: report.format,
  generatedAt: report.generatedAt, verdict: report.verdict, baselineSelection: report.baselineSelection, baseline: compactAsset(b), candidate: compactAsset(c),
  flags: comparison.flags, definitions: report.definitions, limitations: report.limitations,
  details: 'audit.json', samples: ['baseline-samples.json', 'candidate-samples.json'],
}, null, 2) + '\n');
for (const [name, data] of [['baseline-samples.json', baseline.rows], ['candidate-samples.json', candidate.rows]]) fs.writeFileSync(path.join(args.out, name), JSON.stringify(data) + '\n');
console.log(JSON.stringify({ verdict: report.verdict, report: path.join(args.out, 'audit.json'), candidateSha256: c.asset.sha256,
  baselineSelection: report.baselineSelection,
  angles: comparison.numbers, flags: comparison.flags }, null, 2));
