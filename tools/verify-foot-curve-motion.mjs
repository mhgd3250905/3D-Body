import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createTransitionEdits, validateTransitionEdits, loadTransitionEdits, saveTransitionEdits, transitionOptions, TRANSITION_STORAGE_KEY } from '../src/transition-edits.js';

const root = new URL('../', import.meta.url), output = new URL('output/playwright/', root);
const sourceURL = new URL('public/coach/flare-sequence.json', root), personalURL = new URL('托马斯/16.json', root);
const sourceBytes = await fs.readFile(sourceURL, 'utf8'), personalBytes = await fs.readFile(personalURL, 'utf8');
const source = JSON.parse(sourceBytes), originalSource = structuredClone(source), period = source.period;
const glbBytes = await fs.readFile(new URL('public/coach/flare-coach.glb', root)), rigBytes = await fs.readFile(new URL('public/coach/coach-rig.json', root), 'utf8');
const checks = [], failures = [], configurations = [], clipCases = [];
const stats = { actualSamples: 0, anchorComparisons: 0, trajectoryFrames: 0, retainedSnapshots: 0, maximumReachableTargetError: 0,
  maximumTrajectoryError: 0, maximumRawTargetError: 0, maximumBoneLengthError: 0, maximumSupportDrift: 0, maximumUnaffectedJointError: 0, minimumShoeHeight: Infinity };
const tolerance = { metres: 1e-8, numericalPose: 1e-10, boneRadians: 1e-7 };
const clone = value => structuredClone(value), hash = value => createHash('sha256').update(value).digest('hex');
const distance = (first, second) => Math.hypot(...first.map((value, index) => value - second[index]));
const ref = index => ({ kind: 'step', id: source.steps[index].id }), pointRef = point => ({ kind: 'point', id: point.id });
const makeCurve = (id, side, from, to, bend) => ({ id, side, from, to, bend });
const selected = makeCurve('actual-right-10-to-11', 'right', ref(1), ref(2), [0, .025, 0]);
const modes = ['arc', 'linear'].flatMap(legPath => ['linear', 'smooth'].map(interpolation => ({ legPath, interpolation })));
const endpoints = new Map(), originals = [];
let keyframe;

// Only image decoding is stubbed: geometry, authored weights and all real bones
// remain intact, and no browser or user's localStorage is opened by this tool.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
const { scene: model } = await new GLTFLoader().parseAsync(glbBytes.buffer.slice(glbBytes.byteOffset, glbBytes.byteOffset + glbBytes.byteLength), '');
const motion = createCoachMotion({ model, rigData: JSON.parse(rigBytes) });
const nodes = [], skeletons = new Set();model.traverse(object => { nodes.push(object);if (object.isSkinnedMesh) skeletons.add(object.skeleton); });
const bones = nodes.filter(object => object.isBone);
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function close(actual, expected, label, limit = tolerance.metres) { assert.ok(Math.abs(actual - expected) <= limit, `${label}: ${actual} vs ${expected}`); }
function quaternionDistance(first, second) { return new THREE.Quaternion().fromArray(first).normalize().angleTo(new THREE.Quaternion().fromArray(second).normalize()); }
function numericalDifference(first, second) {
  if (typeof first === 'number' || typeof second === 'number') return typeof first === 'number' && typeof second === 'number' ? Math.abs(first - second) : Infinity;
  if (first && second && typeof first === 'object' && typeof second === 'object') {
    if (Object.keys(first).length !== Object.keys(second).length) return Infinity;
    return Math.max(0, ...Object.keys(first).map(key => numericalDifference(first[key], second[key])));
  }
  return first === second ? 0 : Infinity;
}
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }return value; }
function frame() { return { pose: motion.capturePose(), metrics: motion.getMetrics(), bones: Object.fromEntries(bones.map(bone => [bone.name, bone.quaternion.toArray()])) }; }
function state() {
  const actual = frame();
  return { ...actual, handles: motion.getEditableHandles(),
    nodes: nodes.map(object => ({ name: object.name, parent: object.parent?.uuid, position: object.position.toArray(), quaternion: object.quaternion.toArray(),
      rotation: object.rotation.toArray(), scale: object.scale.toArray(), matrix: object.matrix.toArray(), matrixWorld: object.matrixWorld.toArray(),
      matrixWorldNeedsUpdate: object.matrixWorldNeedsUpdate, matrixAutoUpdate: object.matrixAutoUpdate, matrixWorldAutoUpdate: object.matrixWorldAutoUpdate,
      visible: object.visible, frustumCulled: object.frustumCulled, userData: clone(object.userData),
      ...(object.isSkinnedMesh ? { bindMatrix: object.bindMatrix.toArray(), bindMatrixInverse: object.bindMatrixInverse.toArray() } : {}) })),
    skeletons: [...skeletons].map(skeleton => ({ frame: skeleton.frame, matrices: Array.from(skeleton.boneMatrices), textureVersion: skeleton.boneTexture?.version,
      textureSourceVersion: skeleton.boneTexture?.source?.version,
      textureData: skeleton.boneTexture ? Array.from(skeleton.boneTexture.image?.data ?? []) : null })),
  };
}
function physical(metrics) {
  for (const [name, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[name]);stats.maximumBoneLengthError = Math.max(stats.maximumBoneLengthError, error);
    assert.ok(error <= tolerance.metres, name + ': real bone length changed');
  }
  for (const drift of Object.values(metrics.supportDrift)) if (drift !== null) { stats.maximumSupportDrift = Math.max(stats.maximumSupportDrift, drift);assert.ok(drift <= tolerance.metres, 'Locked palm moved'); }
  for (const values of Object.values(metrics.joints)) assert.ok(values.length === 3 && values.every(Number.isFinite));
  stats.minimumShoeHeight = Math.min(stats.minimumShoeHeight, metrics.minFootHeight);
  if (metrics.groundLock) assert.ok(metrics.minFootHeight >= .006 - 1e-7, 'Actual shoe crossed the floor');
}
function equalActual(actual, expected, label) {
  assert.ok(numericalDifference(actual.pose, expected.pose) <= tolerance.numericalPose, label + ': capture pose changed');
  assert.ok(numericalDifference(actual.metrics.joints, expected.metrics.joints) <= tolerance.metres, label + ': actual joints changed');
  assert.deepEqual(actual.metrics.supports, expected.metrics.supports, label + ': support flags changed');
  for (const [name, values] of Object.entries(expected.bones)) assert.ok(quaternionDistance(actual.bones[name], values) <= tolerance.boneRadians, label + ': ' + name + ' orientation changed');
}
function configure(options = {}) { motion.setSequence(source.steps, { period, ...options }); }
function resolveEndpoint(pose, side) { const value = endpoints.get(JSON.stringify(pose));assert.ok(value, 'Missing direct-apply endpoint reference');return clone(value[side + 'Ankle']); }
function expectedTarget(info, side) {
  const a = resolveEndpoint(info.span.from.pose, side), b = resolveEndpoint(info.span.to.pose, side), blend = info.span.blend;
  return a.map((value, index) => value * (1 - blend) + b[index] * blend + 4 * blend * (1 - blend) * info.curve.bend[index]);
}
function targetCheck(time, side, reachable = true) {
  const info = motion.getFootCurveAt(time, side);assert.ok(info, 'An active curve target is missing');
  const expected = expectedTarget(info, side), rawError = distance(info.position, expected);stats.maximumRawTargetError = Math.max(stats.maximumRawTargetError, rawError);
  assert.ok(rawError <= tolerance.metres, 'Curve target did not use direct actual IK endpoints and its time blend');
  const metrics = motion.getMetrics(), actualError = distance(metrics.joints[side + 'Ankle'], expected);
  if (reachable) { stats.maximumReachableTargetError = Math.max(stats.maximumReachableTargetError, actualError);assert.ok(actualError <= tolerance.metres, `Reachable curve differs from actual ${side} ankle by ${actualError} m at ${time} s`); }
  physical(metrics);stats.actualSamples++;
  return { expected, actualError, rawError };
}
function unaffected(actual, baseline, side) {
  const leg = new Set(['Hip', 'Knee', 'Ankle', 'Toe'].map(suffix => side + suffix));
  for (const [name, values] of Object.entries(baseline.metrics.joints)) if (!leg.has(name)) {
    const error = distance(actual.metrics.joints[name], values);stats.maximumUnaffectedJointError = Math.max(stats.maximumUnaffectedJointError, error);
    assert.ok(error <= tolerance.metres, name + ': foot curve moved an unrelated joint');
  }
  for (const key of ['pelvis', 'bodyQuaternion', 'torsoQuaternion', 'pelvisQuaternion']) assert.ok(numericalDifference(actual.pose[key], baseline.pose[key]) <= tolerance.numericalPose, key + ': foot curve altered the body pose');
  assert.deepEqual(actual.metrics.supports, baseline.metrics.supports);
}
function retainedSample(options) {
  const saved = clone(options), before = state(), result = motion.sampleTrajectory(options);
  assert.deepEqual(state(), before, 'Curve trajectory sampling changed pose, time, mode, warnings, bones or model');
  assert.deepEqual(options, saved, 'Curve trajectory modified its temporary inputs');stats.retainedSnapshots++;
  assert.equal(result.frames[0].time, options.startTime);assert.equal(result.frames.at(-1).time, options.endTime);
  return result;
}
function compareTrajectory(result, side, reachable = true) {
  for (const sample of result.frames) {
    motion.update(sample.time);const joints = motion.getMetrics().joints;
    for (const [name, values] of Object.entries(joints)) {
      const error = distance(sample.joints[name], values);stats.maximumTrajectoryError = Math.max(stats.maximumTrajectoryError, error);
      assert.ok(error <= tolerance.metres, name + ': sampled trajectory differs from actual playback');
    }
    const info = motion.getFootCurveAt(sample.time, side);
    if (info) {
      assert.ok(sample.curveTargets?.[side], 'Trajectory lacks raw desired curve target');
      assert.ok(distance(sample.curveTargets[side], expectedTarget(info, side)) <= tolerance.metres, 'Trajectory reports a clamped goal instead of raw curve target');
      if (reachable) assert.ok(distance(sample.curveTargets[side], sample.joints[side + 'Ankle']) <= tolerance.metres, 'Reachable trajectory target differs from actual ankle');
    } else assert.ok(!sample.curveTargets?.[side], 'Inactive curve still publishes targets');
    physical(motion.getMetrics());stats.trajectoryFrames++;
  }
}

check('Real Snow has twenty bones and supplies direct-apply endpoints for all nine saved frames and an edited K', () => {
  assert.equal(bones.length, 20);assert.equal(source.steps.length, 9);assert.equal(period, 9);
  for (const step of source.steps) { motion.applyPose(step.pose);const actual = frame();originals.push(actual);endpoints.set(JSON.stringify(step.pose), clone(actual.metrics.joints));physical(actual.metrics); }
  configure({ legPath: 'arc', interpolation: 'linear' });motion.update(1.42);
  const old = motion.capturePose(), hip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), .025)
    .multiply(new THREE.Quaternion().fromArray(old.pelvisQuaternion ?? old.bodyQuaternion));
  motion.editHandle('pelvis', { quaternion: hip.toArray() });
  motion.editHandle('waist', { quaternion: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), .012).toArray() });
  const pose = motion.capturePose();pose.limbs.right.kneeTwist = .035;pose.limbs.left.elbowTwist = .02;
  motion.applyPose(pose);keyframe = { id: 'actual-foot-K', segment: 1, at: .42, pose: motion.capturePose() };
  assert.ok(keyframe.pose.pelvisQuaternion);assert.ok(keyframe.pose.torsoQuaternion);assert.equal(keyframe.pose.limbs.right.kneeTwist, .035);
  endpoints.set(JSON.stringify(keyframe.pose), clone(motion.getMetrics().joints));physical(motion.getMetrics());
});
for (const options of modes) check(`${options.legPath}/${options.interpolation}: reachable foot curve follows actual IK, preserves other joints and exact anchors`, () => {
  const times = Array.from({ length: 17 }, (_, index) => 1 + index / 16);configure(options);
  const baseline = times.map(time => { motion.update(time);return frame(); });
  configure({ ...options, footCurves: [selected] });const entry = { ...options, frames: times.length, maximumReachableTargetError: 0 };
  for (const [index, time] of times.entries()) {
    motion.update(time);const actual = frame(), measured = targetCheck(time, selected.side);
    entry.maximumReachableTargetError = Math.max(entry.maximumReachableTargetError, measured.actualError);unaffected(actual, baseline[index], selected.side);
  }
  for (let index = 0; index < originals.length; index++) { motion.update(index);equalActual(frame(), originals[index], 'Saved anchor ' + index);stats.anchorComparisons++; }
  motion.update(1.3125);const first = frame();for (const time of [7.7, .2, 1.8, 1.1, -4.4]) motion.update(time);motion.update(1.3125);
  equalActual(frame(), first, 'Seek/reverse history independence');motion.update(1.3125 + period);equalActual(frame(), first, 'Repeated cycle');
  configurations.push(entry);
});
check('Unreachable bends preserve raw goals in trajectory metadata while actual IK retains leg length and ground constraints', () => {
  const large = { ...clone(selected), id: 'unreachable-up', bend: [0, 4, 0] };configure({ legPath: 'arc', interpolation: 'linear', footCurves: [large] });
  motion.update(1.5);const measured = targetCheck(1.5, 'right', false);
  assert.ok(measured.actualError > 1, 'This fixture no longer exercises a constrained foot goal');
  assert.ok(motion.getMetrics().warnings.some(message => message.includes('脚踝')));clipCases.push({ time: 1.5, targetDifference: measured.actualError });
  const sampled = retainedSample({ startTime: 1.25, endTime: 1.75, samples: 5 });compareTrajectory(sampled, 'right', false);
  assert.ok(distance(sampled.frames[2].curveTargets.right, sampled.frames[2].joints.rightAnkle) > 1);
});
check('K insertion/skip/delete and original skipping activate only currently adjacent saved endpoints', () => {
  assert.ok(keyframe);const options = { legPath: 'arc', interpolation: 'linear', corrections: [keyframe] };
  configure(options);const times = [1.2, 1.42, 1.7], baseline = times.map(time => { motion.update(time);return frame(); });
  configure({ ...options, footCurves: [selected] });
  for (const [index, time] of times.entries()) { motion.update(time);equalActual(frame(), baseline[index], 'K insertion deactivates crossing original curve');assert.equal(motion.getFootCurveAt(time, 'right'), null); }
  const orphan = makeCurve('orphan-K-link', 'right', pointRef(keyframe), ref(2), [0, .01, 0]);
  configure({ legPath: 'arc', footCurves: [orphan] });assert.equal(motion.getFootCurveAt(1.7, 'right'), null);
  configure({ legPath: 'arc', skippedSteps: [2] });motion.update(1.5);const skipped = frame();
  configure({ legPath: 'arc', skippedSteps: [2], footCurves: [selected] });motion.update(1.5);equalActual(frame(), skipped, 'Skipped original curve endpoint');assert.equal(motion.getFootCurveAt(1.5, 'right'), null);
});
check('An active K with pelvis/torso frames and twists remains exact while its neighboring foot curve is rebuilt', () => {
  assert.ok(keyframe);const selectedK = makeCurve('original-to-actual-K', 'right', ref(1), pointRef(keyframe), [0, .005, 0]);
  motion.applyPose(keyframe.pose);const expectedK = frame();
  for (const options of modes) {
    const corrections = [keyframe], times = Array.from({ length: 9 }, (_, index) => 1 + keyframe.at * index / 8);
    configure({ ...options, corrections });const baseline = times.map(time => { motion.update(time);return frame(); });
    configure({ ...options, corrections, footCurves: [selectedK] });
    for (const [index, time] of times.entries()) { motion.update(time);targetCheck(time, 'right');unaffected(frame(), baseline[index], 'right'); }
    motion.update(1.42);equalActual(frame(), expectedK, 'Exact edited K with new fields');stats.anchorComparisons++;
    assert.ok(motion.capturePose().pelvisQuaternion);assert.ok(motion.capturePose().torsoQuaternion);assert.equal(motion.capturePose().limbs.right.kneeTwist, .035);
  }
});
check('A foot curve spanning skipped first/last 09 frames repeats across the loop and samples its unfolded endpoint pair', () => {
  const wrap = makeCurve('actual-wrapped-09', 'right', ref(7), ref(1), [0, .01, 0]);
  for (const interpolation of ['linear', 'smooth']) {
    configure({ legPath: 'arc', interpolation, skippedSteps: [0, 8], footCurves: [wrap] });
    for (const time of [-.5, 0, .5, 8, 8.5, 9]) {
      motion.update(time);const measured = targetCheck(time, 'right', false), span = motion.getFootCurveSpan(time);
      assert.equal(span.from.id, source.steps[7].id);assert.equal(span.to.id, source.steps[1].id);
      if (measured.actualError > tolerance.metres) clipCases.push({ label: 'wrapped-' + interpolation, time, targetDifference: measured.actualError });
    }
    motion.update(0);const first = frame();motion.update(period);equalActual(frame(), first, 'Wrapped curve closed cycle');
    compareTrajectory(retainedSample({ startTime: 7.5, endTime: 9.5, samples: 9, includeTimes: [8, 9] }), 'right', false);
  }
});
check('sampleTrajectory retains live scene state, includes raw curve targets and supports isolated curve overrides', () => {
  configure({ legPath: 'arc', interpolation: 'smooth', footCurves: [selected] });motion.setLayer('foot-curve-verification');motion.setHighlight('curve-inspection');motion.update(1.31);
  const options = freeze({ startTime: 1, endTime: 2, samples: 17 }), sampled = retainedSample(options);compareTrajectory(sampled, 'right');
  motion.update(1.31);const before = state();
  const alternative = { ...clone(selected), bend: [0, .04, .01] };
  const override = retainedSample(freeze({ ...options, footCurves: [alternative] }));
  assert.ok(distance(override.frames[8].curveTargets.right, sampled.frames[8].curveTargets.right) > .01, 'Temporary curve override did not change the desired path');
  const omitted = retainedSample({ ...options, footCurves: [] });assert.ok(omitted.frames.every(frame => frame.curveTargets === undefined), 'Explicitly removed curves still leak targets');
  assert.deepEqual(state(), before, 'Temporary curve preview replaced the live sequence');
  assert.deepEqual(motion.sampleTrajectory(options), sampled, 'Current saved curve changed after temporary overrides');
  motion.applyPose(keyframe.pose);assert.equal(motion.getMetrics().mode, 'manual');
  const fromManual = retainedSample(options);assert.deepEqual(fromManual, sampled, 'Unsaved manual pose leaked into saved-curve sampling');
});

function memory(values) { const entries = new Map(Object.entries(values));return { entries, getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, String(value)) }; }
const originalsRaw = { 'flare-pose-library-v1': personalBytes, 'flare-demonstration-v1': '\n ' + sourceBytes + '\n', 'flare-demonstration-backup-v1': 'original-backup-bytes' };
const storage = memory(originalsRaw), document = createTransitionEdits(source);
check('Curve JSON export/read/write preserves raw bends, point refs, draft and both source libraries', () => {
  assert.ok(keyframe);document.points = [clone(keyframe)];document.draft = { segment: 4, at: .33, name: 'Keep unsaved draft', pose: clone(keyframe.pose) };
  document.footCurves = [clone(selected), makeCurve('saved-K-curve', 'right', pointRef(keyframe), ref(2), [0, .01, 0]),
    makeCurve('saved-orphan', 'left', { kind: 'point', id: 'deleted-old-K' }, ref(4), [.03, .02, -.01])];
  const oldSequence = clone(source);oldSequence.steps[2].pose.pelvis[0] += .02;
  const oldEntry = createTransitionEdits(oldSequence);oldEntry.historical = 'Preserve unrelated old transition entry';
  storage.setItem(TRANSITION_STORAGE_KEY, JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [oldEntry] }));
  const input = clone(document), saved = saveTransitionEdits(document, source, storage);assert.deepEqual(document, input);
  assert.deepEqual(loadTransitionEdits(source, storage), document);assert.deepEqual(JSON.parse(storage.getItem(TRANSITION_STORAGE_KEY)).entries[0], oldEntry);
  const exported = JSON.parse(JSON.stringify({ ...saved, sequence: source })), restored = validateTransitionEdits(exported, source);
  assert.deepEqual(restored.footCurves, document.footCurves);assert.deepEqual(restored.draft, document.draft);assert.deepEqual(restored.sequence, source);
  const options = transitionOptions(restored);assert.deepEqual(options.footCurves, document.footCurves);options.footCurves[0].bend[1] = 999;
  assert.deepEqual(loadTransitionEdits(source, storage), document, 'Playback options mutated saved curve data');
  for (const [key, value] of Object.entries(originalsRaw)) assert.equal(storage.getItem(key), value);
});
check('Disabled, deleted and skipped K curves can remain as recoverable inactive entries', () => {
  const disabled = { ...clone(document), enabled: false };saveTransitionEdits(disabled, source, storage);
  const loaded = loadTransitionEdits(source, storage);assert.deepEqual(loaded.footCurves, document.footCurves);assert.deepEqual(loaded.draft, document.draft);
  assert.equal(transitionOptions(loaded).footCurves, undefined);configure(transitionOptions(loaded));assert.equal(motion.getFootCurveAt(1.7, 'right'), null);
  const deleted = { ...clone(document), points: [] };saveTransitionEdits(deleted, source, storage);
  assert.deepEqual(loadTransitionEdits(source, storage), deleted);configure(transitionOptions(deleted));assert.equal(motion.getFootCurveAt(1.7, 'left'), null);
  assert.equal(motion.getFootCurveAt(1.7, 'right').curve.id, selected.id, 'Original curve should reactivate after removing the split K');
  const skipped = clone(document);skipped.points[0].skipped = true;saveTransitionEdits(skipped, source, storage);configure(transitionOptions(skipped));
  assert.equal(motion.getFootCurveAt(1.7, 'right').curve.id, selected.id);assert.deepEqual(loadTransitionEdits(source, storage).footCurves, document.footCurves);
  for (const [key, value] of Object.entries(originalsRaw)) assert.equal(storage.getItem(key), value);
});
check('Malformed curve storage and setSequence fail without writing libraries or replacing the actual live pose', () => {
  const invalid = [
    [{ ...clone(selected), bend: [0, Infinity, 0] }], [{ ...clone(selected), bend: [0, 10001, 0] }], [{ ...clone(selected), from: clone(selected.to) }],
    [clone(selected), { ...clone(selected), id: 'duplicate-pair' }], [clone(selected), { ...clone(selected), side: 'left' }],
    [{ ...clone(selected), from: { kind: 'step', id: 'not-a-current-step' } }],
  ];
  configure({ legPath: 'arc', interpolation: 'linear', footCurves: [selected] });motion.update(1.5);
  for (const curves of invalid) {
    const bad = { ...clone(document), footCurves: curves }, before = new Map(storage.entries);
    assert.throws(() => saveTransitionEdits(bad, source, storage));assert.deepEqual(storage.entries, before, 'Rejected curve import wrote partial data');
    if (curves[0].from.id === 'not-a-current-step') continue; // Pure core permits inactive refs; storage binds original IDs.
    const live = state(), target = motion.getFootCurveAt(1.5, 'right');
    assert.throws(() => motion.setSequence(source.steps, { period, footCurves: curves }));assert.deepEqual(state(), live, 'Invalid curve replaced a valid live sequence');
    assert.deepEqual(motion.getFootCurveAt(1.5, 'right'), target);
  }
  for (const [key, value] of Object.entries(originalsRaw)) assert.equal(storage.getItem(key), value);
});
check('Formal JSON, personal export and all source/K/curve fixtures remain unchanged', () => {
  assert.deepEqual(source, originalSource);assert.deepEqual(selected, makeCurve('actual-right-10-to-11', 'right', ref(1), ref(2), [0, .025, 0]));
  assert.deepEqual(keyframe.pose.pelvisQuaternion.length, 4);assert.deepEqual(keyframe.pose.torsoQuaternion.length, 4);
});
assert.equal(await fs.readFile(sourceURL, 'utf8'), sourceBytes);assert.equal(await fs.readFile(personalURL, 'utf8'), personalBytes);
const engineHashes = {};
for (const filename of ['src/coach-motion.js', 'src/flare-sequence.js', 'src/foot-curves.js', 'src/limb-arc.js', 'src/transition-edits.js']) engineHashes[filename] = hash(await fs.readFile(new URL(filename, root)));
const report = { pass: failures.length === 0, passed: checks.filter(check => check.pass).length, total: checks.length, checks, failures, stats, configurations, clipCases, tolerance,
  fixture: { selectedCurve: selected, keyframe }, sourceSha256: hash(sourceBytes), personalSha256: hash(personalBytes), glbSha256: hash(glbBytes), rigSha256: hash(rigBytes), engineHashes,
  scope: 'Actual local Snow GLB CPU IK and transition-edits modules only. Measured reachable quadratic targets, constraints and raw-target metadata, exact originals/edited K, route/timing/seek consistency, inactive/split/wrap curves, pure trajectory state retention and curve JSON storage. No browser/UI, physics balance or mesh collision validation.' };
await fs.mkdir(output, { recursive: true });const reportURL = new URL('foot-curve-motion-verification.json', output);await fs.writeFile(reportURL, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, stats, failures, report: reportURL.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
