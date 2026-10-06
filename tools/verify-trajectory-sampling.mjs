import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';

const root = new URL('../', import.meta.url);
const sourceUrl = new URL('public/coach/flare-sequence.json', root);
const personalUrl = new URL('托马斯/16.json', root);
const sourceBytes = await fs.readFile(sourceUrl, 'utf8'), source = JSON.parse(sourceBytes);
const personalBytes = await fs.readFile(personalUrl);
const original = structuredClone(source);
const glbBytes = await fs.readFile(new URL('public/coach/flare-coach.glb', root));
const rigBytes = await fs.readFile(new URL('public/coach/coach-rig.json', root), 'utf8');
const rigData = JSON.parse(rigBytes), period = source.period;
const coreJoints = ['leftAnkle', 'rightAnkle', 'leftKnee', 'rightKnee', 'pelvis'];
const toleranceMetres = 1e-8, checks = [], failures = [], comparisons = [];
const summary = { comparedFrames: 0, stateSnapshots: 0, maximumCoreDifference: 0, maximumJointDifference: 0, overrideDifferences: {}, rejectedInputs: 0 };
const sha256 = value => createHash('sha256').update(value).digest('hex');
const engineFiles = ['src/coach-motion.js', 'src/flare-sequence.js', 'src/limb-arc.js'];
const engineBytes = Object.fromEntries(await Promise.all(engineFiles.map(async file => [file, await fs.readFile(new URL(file, root), 'utf8')])));

// Texture decoding is irrelevant to IK; geometry, weights and all 20 bones are real.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
const { scene: model } = await new GLTFLoader().parseAsync(glbBytes.buffer.slice(glbBytes.byteOffset, glbBytes.byteOffset + glbBytes.byteLength), '');
const motion = createCoachMotion({ model, rigData });
const nodes = [], skeletons = new Set();
model.traverse(object => { nodes.push(object);if (object.isSkinnedMesh) skeletons.add(object.skeleton); });
const bones = nodes.filter(object => object.isBone);

function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function freeze(value) {
  if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child);Object.freeze(value); }
  return value;
}
function currentState() {
  // Read metrics first to settle its lazy bounds cache. No world-matrix updater is
  // used here: even matrix flags or skeleton buffer changes must be observable.
  const metrics = motion.getMetrics();
  return {
    metrics, pose: motion.capturePose(), handles: motion.getEditableHandles(),
    nodes: nodes.map(object => ({
      name: object.name, uuid: object.uuid, parent: object.parent?.uuid ?? null,
      position: object.position.toArray(), quaternion: object.quaternion.toArray(), rotation: object.rotation.toArray(), scale: object.scale.toArray(),
      matrix: object.matrix.toArray(), matrixWorld: object.matrixWorld.toArray(),
      matrixAutoUpdate: object.matrixAutoUpdate, matrixWorldAutoUpdate: object.matrixWorldAutoUpdate,
      matrixWorldNeedsUpdate: object.matrixWorldNeedsUpdate, visible: object.visible, frustumCulled: object.frustumCulled,
      userData: structuredClone(object.userData),
      ...(object.isSkinnedMesh ? { bindMatrix: object.bindMatrix.toArray(), bindMatrixInverse: object.bindMatrixInverse.toArray() } : {}),
    })),
    skeletons: [...skeletons].map(skeleton => ({
      boneMatrices: Array.from(skeleton.boneMatrices), frame: skeleton.frame,
      boneTexture: skeleton.boneTexture ? {
        version: skeleton.boneTexture.version, data: Array.from(skeleton.boneTexture.image?.data ?? []),
        sourceVersion: skeleton.boneTexture.source?.version,
      } : null,
    })),
  };
}
function verifyFrames(result, options, label) {
  assert.equal(result.startTime, options.startTime, label + ': startTime');
  assert.equal(result.endTime, options.endTime, label + ': endTime');
  const count = options.samples ?? 64;
  const uniformTimes = Array.from({ length: count }, (_, index) => index === count - 1 ? options.endTime : options.startTime + (options.endTime - options.startTime) * index / (count - 1));
  const expectedTimes = options.includeTimes?.length && options.endTime !== options.startTime
    ? [...new Set([...uniformTimes, ...options.includeTimes])].sort((a, b) => a - b) : uniformTimes;
  assert.equal(result.frames.length, expectedTimes.length, label + ': sample count');
  assert.equal(result.frames[0].time, options.startTime, label + ': exact first time');
  assert.equal(result.frames.at(-1).time, options.endTime, label + ': exact last time');
  const jointNames = Object.keys(motion.getMetrics().joints).sort();
  for (const [index, frame] of result.frames.entries()) {
    assert.ok(Number.isFinite(frame.time), label + ': finite time');
    const expectedTime = expectedTimes[index];
    assert.ok(Math.abs(frame.time - expectedTime) <= 16 * Number.EPSILON * Math.max(1, Math.abs(expectedTime)), label + ': uniform times plus exact requested K times');
    if (index) assert.ok(frame.time >= result.frames[index - 1].time, label + ': ordered samples');
    assert.deepEqual(Object.keys(frame.joints).sort(), jointNames, label + ': all actual joints');
    for (const [name, position] of Object.entries(frame.joints)) {
      assert.ok(Array.isArray(position) && position.length === 3 && position.every(Number.isFinite), `${label}: finite ${name} at ${frame.time}`);
    }
  }
}
function retainedSample(options, label) {
  const input = structuredClone(options), before = currentState();
  const result = motion.sampleTrajectory(options);
  assert.deepEqual(currentState(), before, label + ': live pose/time/mode/warnings/bones/model changed');
  assert.deepEqual(options, input, label + ': sampler modified its inputs');
  summary.stateSnapshots++;
  verifyFrames(result, options, label);
  return result;
}
function compareToPlayback(result, label) {
  const entry = { label, frames: result.frames.length, maximumCoreDifference: 0, maximumJointDifference: 0 };
  for (const frame of result.frames) {
    motion.update(frame.time);
    const expected = motion.getMetrics().joints;
    for (const name of Object.keys(expected)) {
      const distance = Math.hypot(...frame.joints[name].map((value, index) => value - expected[name][index]));
      entry.maximumJointDifference = Math.max(entry.maximumJointDifference, distance);
      if (coreJoints.includes(name)) entry.maximumCoreDifference = Math.max(entry.maximumCoreDifference, distance);
      assert.ok(distance <= toleranceMetres, `${label}: ${name} differs from actual playback by ${distance} m at ${frame.time} s`);
    }
    summary.comparedFrames++;
  }
  summary.maximumCoreDifference = Math.max(summary.maximumCoreDifference, entry.maximumCoreDifference);
  summary.maximumJointDifference = Math.max(summary.maximumJointDifference, entry.maximumJointDifference);
  comparisons.push(entry);
}
function maximumCoreDifference(first, second) {
  assert.equal(first.frames.length, second.frames.length);
  return Math.max(0, ...first.frames.flatMap((frame, index) => coreJoints.map(name => Math.hypot(...frame.joints[name].map((value, component) => value - second.frames[index].joints[name][component])))));
}
function configure(steps = source.steps, options = {}) {
  motion.setSequence(steps, { period, ...options });
  motion.setLayer('trajectory-verification');motion.setHighlight('trajectory-selection');
  motion.update(3.137);
}
function makePose(time, handle, offset) {
  configure();motion.update(time);
  const position = motion.getEditableHandles().find(value => value.id === handle).position.map((value, index) => value + offset[index]);
  motion.editHandle(handle, { position });
  return motion.capturePose();
}

check('Actual Snow exposes the pure trajectory API and original nine-node loop', () => {
  assert.equal(typeof motion.sampleTrajectory, 'function');assert.equal(bones.length, 20);
  assert.equal(source.steps.length, 9);assert.equal(period, 9);
  assert.deepEqual(source.steps[0].pose, source.steps[8].pose);
});

let corrections, nearCorrections, temporarySteps;
check('Legal temporary original-frame and intermediate-K fixtures use actual edited IK poses', () => {
  corrections = freeze([{ id: 'trajectory-middle-K', segment: 1, at: .42, pose: makePose(1.42, 'leftAnkle', [.07, .04, -.05]) }]);
  nearCorrections = freeze([...structuredClone(corrections), { id: 'trajectory-neighbor-K', segment: 1, at: .42001, pose: makePose(1.42001, 'rightAnkle', [-.025, .015, .02]) }]);
  temporarySteps = structuredClone(source.steps);
  temporarySteps[2].pose = makePose(2, 'rightAnkle', [-.06, .06, .025]);freeze(temporarySteps);
  assert.deepEqual(source, original);
});

for (const { label, legPath, interpolation, withCorrection } of [
  { label: 'arc-smooth-original', legPath: 'arc', interpolation: 'smooth', withCorrection: false },
  { label: 'arc-linear-K', legPath: 'arc', interpolation: 'linear', withCorrection: true },
  { label: 'original-line-smooth', legPath: 'linear', interpolation: 'smooth', withCorrection: false },
  { label: 'original-line-linear-K', legPath: 'linear', interpolation: 'linear', withCorrection: true },
]) {
  check(`${label}: all sampled joints equal real playback and retain the live scene`, () => {
    if (withCorrection) assert.ok(corrections, 'Correction fixture unavailable');
    configure(source.steps, { legPath, interpolation, corrections: withCorrection ? corrections : [] });
    const result = retainedSample({ startTime: 0, endTime: 8, samples: 33 }, label);
    compareToPlayback(result, label);
    for (const name of coreJoints) {
      const first = result.frames[0].joints[name], last = result.frames.at(-1).joints[name];
      assert.ok(Math.hypot(...first.map((value, index) => value - last[index])) <= toleranceMetres, label + ': 0..8 closure ' + name);
    }
    if (withCorrection) compareToPlayback(retainedSample({ startTime: 1.42, endTime: 1.42002, samples: 5 }, label + '-exact-K'), label + '-exact-K');
  });
}

check('Omitted sampling options use the currently selected saved route, time curve and K points', () => {
  configure(source.steps, { legPath: 'linear', interpolation: 'linear', corrections });
  const defaultSample = retainedSample({ startTime: .125, endTime: 2.625 }, 'saved defaults');
  const explicitSample = retainedSample({ startTime: .125, endTime: 2.625, samples: 64, steps: source.steps, corrections, legPath: 'linear', interpolation: 'linear' }, 'explicit saved options');
  assert.deepEqual(defaultSample, explicitSample);
  compareToPlayback(defaultSample, 'saved defaults');
});

check('Temporary raw-frame and K previews change their paths without replacing the current saved sequence', () => {
  configure(source.steps, { legPath: 'arc', interpolation: 'linear', corrections });
  const range = { startTime: .75, endTime: 2.75, samples: 41 };
  const base = retainedSample(range, 'current saved sequence');
  const rawFrame = retainedSample({ ...range, steps: temporarySteps }, 'temporary original frame');
  const freshK = retainedSample({ ...range, corrections: nearCorrections }, 'temporary neighboring K');
  const alternative = retainedSample({ ...range, legPath: 'linear', interpolation: 'smooth' }, 'temporary route and timing');
  summary.overrideDifferences.rawFrameMetres = maximumCoreDifference(base, rawFrame);
  summary.overrideDifferences.neighborKMetres = maximumCoreDifference(base, freshK);
  summary.overrideDifferences.routeTimingMetres = maximumCoreDifference(base, alternative);
  for (const [name, distance] of Object.entries(summary.overrideDifferences)) assert.ok(distance > 1e-4, name + ': preview did not change the actual path');
  assert.deepEqual(retainedSample(range, 'saved after all previews'), base);
  compareToPlayback(base, 'saved sequence after temporary previews');

  configure(temporarySteps, { legPath: 'arc', interpolation: 'linear', corrections });compareToPlayback(rawFrame, 'temporary original frame playback');
  configure(source.steps, { legPath: 'arc', interpolation: 'linear', corrections: nearCorrections });compareToPlayback(freshK, 'temporary K playback');
  configure(source.steps, { legPath: 'linear', interpolation: 'smooth', corrections });compareToPlayback(alternative, 'temporary route/timing playback');
});

check('Very close neighboring K points and a zero-length sampling interval remain finite and exact', () => {
  configure(source.steps, { legPath: 'arc', interpolation: 'linear', corrections: nearCorrections });
  compareToPlayback(retainedSample({ startTime: 1.419999, endTime: 1.420011, samples: 25 }, 'nearby K interval'), 'nearby K interval');
  const repeated = retainedSample({ startTime: 1.42001, endTime: 1.42001 }, 'zero interval');
  for (const frame of repeated.frames) assert.deepEqual(frame, repeated.frames[0]);
  compareToPlayback(repeated, 'zero interval');
});

check('Explicit K times augment uniform samples exactly, with sorted duplicate-free keyframe points', () => {
  configure(source.steps, { legPath: 'arc', interpolation: 'linear', corrections: nearCorrections });
  const options = { startTime: 1.4, endTime: 1.49, samples: 4, includeTimes: [1.42001, 1.42, 1.42, 1.4, 1.49] };
  const result = retainedSample(options, 'include exact K times');
  assert.equal(result.frames.length, 6);
  for (const time of [1.42, 1.42001]) assert.equal(result.frames.filter(frame => frame.time === time).length, 1, 'Requested K time was missed or duplicated: ' + time);
  compareToPlayback(result, 'include exact K times');
});

check('Standing and manual scenes, including existing warnings, retain every exposed state and skeleton value', () => {
  configure();motion.reset();
  assert.equal(motion.getMetrics().mode, 'standing');
  retainedSample({ startTime: 0, endTime: 1, samples: 2 }, 'standing state');
  motion.update(2.345);
  const manual = motion.capturePose();manual.groundLock = false;
  for (const side of ['left', 'right']) {
    manual.limbs[side].handLocked = false;
    manual.limbs[side].wrist = [side === 'left' ? 3 : -3, 3, 3];
    manual.limbs[side].ankle = [side === 'left' ? 3 : -3, -3, 3];
  }
  motion.applyPose(manual);
  assert.equal(motion.getMetrics().mode, 'manual');assert.ok(motion.getMetrics().warnings.length > 0, 'Warning fixture should be clamped by IK');
  retainedSample({ startTime: 0, endTime: 8, samples: 17 }, 'manual warning state');
});

check('Sampling in the mathematical trial leaves that mode intact while previewing the stored sequence', () => {
  configure(source.steps, { legPath: 'arc', interpolation: 'linear', corrections });
  const options = { startTime: 0, endTime: 8, samples: 17 };
  const saved = retainedSample(options, 'saved model reference');
  configure(source.steps, { legPath: 'arc', interpolation: 'linear', corrections, motionModel: 'periodic' });
  assert.equal(motion.getMetrics().motionModel, 'periodic');
  assert.deepEqual(retainedSample(options, 'periodic live mode'), saved);
});

check('Returned position arrays are independent of the live scene and future samples', () => {
  configure();const options = { startTime: .2, endTime: .6, samples: 3 };
  const first = retainedSample(options, 'returned data independence'), expected = structuredClone(first), before = currentState();
  first.frames[0].joints.leftAnkle[0] = 1234;first.frames[1].joints.pelvis[1] = -1234;
  assert.deepEqual(currentState(), before);
  assert.deepEqual(retainedSample(options, 'fresh returned data'), expected);
});

check('Invalid times, sample counts and temporary sequences fail without a partial state change', () => {
  configure(source.steps, { legPath: 'arc', interpolation: 'linear', corrections });
  const good = { startTime: 0, endTime: 1, samples: 3 };
  const badPoseSteps = structuredClone(source.steps);badPoseSteps[2].pose.limbs.left.ankle[1] = NaN;
  const invalid = [
    { ...good, startTime: NaN }, { ...good, startTime: Infinity }, { ...good, endTime: Infinity },
    { ...good, startTime: '0' }, { ...good, endTime: -1 },
    ...[0, 1, 2.5, 513, NaN, Infinity, '3'].map(samples => ({ ...good, samples })),
    { ...good, steps: [] }, { ...good, steps: badPoseSteps },
    { ...good, corrections: [{ ...corrections[0], at: 0 }] },
    { ...good, interpolation: 'invalid' },
  ];
  for (const [index, input] of invalid.entries()) {
    const before = currentState(), beforeInput = structuredClone(input);
    assert.throws(() => motion.sampleTrajectory(input), 'Invalid request accepted: ' + index);
    assert.deepEqual(currentState(), before, 'Rejected request changed live state: ' + index);
    assert.deepEqual(input, beforeInput, 'Rejected request changed input: ' + index);
    summary.stateSnapshots++;summary.rejectedInputs++;
  }
});

check('Original formal and personal files, all nine source nodes, and temporary inputs remain untouched', () => {
  assert.deepEqual(source, original);
  assert.deepEqual(temporarySteps.map(step => step.id), source.steps.map(step => step.id));
  assert.equal(temporarySteps.length, 9);assert.equal(corrections.length, 1);assert.equal(nearCorrections.length, 2);
});
try {
  assert.equal(await fs.readFile(sourceUrl, 'utf8'), sourceBytes);
  assert.deepEqual(await fs.readFile(personalUrl), personalBytes);
  for (const file of engineFiles) assert.equal(await fs.readFile(new URL(file, root), 'utf8'), engineBytes[file], 'Engine changed while this verification was running: ' + file);
  checks.push({ name: 'Formal/personal source bytes and measured engine files are unchanged', pass: true });
} catch (error) {
  checks.push({ name: 'Formal/personal source bytes and measured engine files are unchanged', pass: false });
  failures.push({ name: 'Source byte preservation', message: error.message, stack: error.stack });
}

const report = {
  pass: failures.length === 0, checks, failures, originalNodes: source.steps.length, bones: bones.length,
  coreJoints, toleranceMetres, ...summary, comparisons,
  sourceSha256: sha256(sourceBytes), personalSha256: sha256(personalBytes), glbSha256: sha256(glbBytes), rigSha256: sha256(rigBytes),
  engineHashes: Object.fromEntries(engineFiles.map(file => [file, sha256(engineBytes[file])])),
  fixtures: { corrections, nearCorrections, temporaryOriginalFrame: temporarySteps?.[2] },
  scope: 'CPU IK with the actual Snow GLB: five rendered trajectory positions and all other joints match saved-animation playback; live model transforms, bone matrices, skeleton buffers, pose, time, mode, warnings and visible motion metadata stay unchanged. Temporary frame/K/route previews preserve the current sequence and source bytes. Mathematical mode is preserved but trajectories preview the saved engine. This does not verify browser line rendering or physical plausibility.',
};
const output = new URL('../output/playwright/', import.meta.url);await fs.mkdir(output, { recursive: true });
const reportUrl = new URL('trajectory-sampling-verification.json', output);
await fs.writeFile(reportUrl, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: checks.filter(item => item.pass).length, checks: checks.length, failures,
  originalNodes: report.originalNodes, bones: report.bones, ...summary, report: reportUrl.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
