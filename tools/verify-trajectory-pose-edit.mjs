import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createTransitionEdits, transitionOptions } from '../src/transition-edits.js';
import { solveTrajectoryPose } from '../src/trajectory-pose-edit.js';

const root = new URL('../', import.meta.url), sourceURL = new URL('public/coach/flare-sequence.json', root);
const sourceBytes = await fs.readFile(sourceURL, 'utf8'), source = JSON.parse(sourceBytes), original = structuredClone(source);
const checks = [], failures = [], measurements = [], mockMeasurements = [];
const clone = value => structuredClone(value), hash = value => createHash('sha256').update(value).digest('hex');
const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));
const stepRef = index => ({ kind: 'step', id: source.steps[index].id });
let assertions = 0;
function equal(a, b, message) { assert.deepEqual(a, b, message);assertions++; }
function ok(value, message) { assert.ok(value, message);assertions++; }
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }return value; }
function fixture(initial = [0, 0, 0]) {
  const sequence = clone(source);
  for (const step of sequence.steps) { step.pose.mockJoint = clone(initial);step.pose.userNote = 'Keep unknown raw pose metadata';step.pose.limbs.left.userNote = 'Keep limb metadata'; }
  sequence.steps.at(-1).pose = clone(sequence.steps[0].pose);
  const edits = createTransitionEdits(sequence);
  edits.draft = { segment: 4, at: .33, pose: clone(sequence.steps[4].pose), name: 'Keep draft' };
  edits.footCurves = [];edits.userState = { keep: 'all fields' };
  return { sequence, edits };
}
function mock({ anchor = stepRef(0), clock = 0, fn = value => value, clamp = value => value, objectiveTarget } = {}) {
  const calls = { solve: 0, sample: 0, objectiveErrors: [], candidatePositions: [], options: [] };
  const motion = {
    applyPose() { throw new Error('Forbidden live applyPose'); }, update() { throw new Error('Forbidden live update'); }, setSequence() { throw new Error('Forbidden live setSequence'); },
    solveJointPose(input, { position }) {
      calls.solve++;calls.candidatePositions.push(clone(position));const value = clamp(clone(position)), pose = clone(input);pose.mockJoint = value;
      // Deliberately report a false perfect single-frame residual: only the
      // actual sampleTrajectory objective may determine the accepted result.
      return { pose, position: value, error: 0, warnings: [] };
    },
    sampleTrajectory(options) {
      calls.sample++;calls.options.push({ samples: options.samples, startTime: options.startTime, endTime: options.endTime,
        footCurves: clone(options.footCurves), skippedSteps: clone(options.skippedSteps) });
      assert.equal(options.samples, 2);assert.equal(options.startTime, options.endTime);assert.ok(Array.isArray(options.footCurves));assert.ok(Array.isArray(options.skippedSteps));
      const pose = anchor.kind === 'step' ? options.steps.find(step => step.id === anchor.id)?.pose : options.corrections.find(point => point.id === anchor.id)?.pose;
      assert.ok(pose);const wrapped = (options.startTime % 9 + 9) % 9;
      const endpoint = Math.abs(wrapped - clock) < 1e-10 || (anchor.kind === 'step' && anchor.id === source.steps[0].id && Math.abs(wrapped - 8) < 1e-10);
      const position = endpoint ? clone(pose.mockJoint) : fn(clone(pose.mockJoint));
      if (!endpoint && objectiveTarget) calls.objectiveErrors.push(distance(position, objectiveTarget));
      return { frames: [{ time: options.startTime, joints: { leftAnkle: position, rightAnkle: position, rightWrist: position } }, { time: options.endTime, joints: { leftAnkle: clone(position) } }] };
    },
  };
  return { motion, calls };
}
function solve(input, motion, target, options = {}) {
  const before = clone(input), result = solveTrajectoryPose({ motion, ...input, anchor: stepRef(0), time: .5, joint: 'leftAnkle', target, ...options });
  equal(input, before, 'Solver mutated its original sequence/document');
  ok(result.error <= result.initialError, 'Solver accepted increased actual error');ok(result.iterations <= 5);equal(result.requestedPosition, target);
  return result;
}

check('A nonlinear sampled objective is optimized rather than directly adding the target delta to a keyframe', () => {
  const input = fixture([.1, .05, .1]), fn = value => [value[0] ** 3 + .1 * value[0], value[1] + .4 * value[1] ** 2, Math.sin(value[2])];
  const target = fn([.18, .063, .085]), { motion, calls } = mock({ fn, objectiveTarget: target });
  const result = solve(freeze(input), motion, target);ok(result.improved);ok(result.error < 1e-5, 'Nonlinear residual remains too large');
  const naiveDelta = target[0] - fn(input.sequence.steps[0].pose.mockJoint)[0];
  ok(Math.abs(result.pose.mockJoint[0] - input.sequence.steps[0].pose.mockJoint[0] - naiveDelta) > .02, 'The fixture failed to distinguish direct delta from inverse sampling');
  equal(result.pose.userNote, input.sequence.steps[0].pose.userNote);equal(result.pose.limbs.left.userNote, input.sequence.steps[0].pose.limbs.left.userNote);
  equal(result.document, input.edits, 'Temporary original edit rewrote document base/settings/draft');
  for (let index = 1; index < 8; index++) equal(result.sequence.steps[index], input.sequence.steps[index]);
  equal(result.sequence.steps[0].pose, result.sequence.steps[8].pose);ok(calls.solve > result.iterations);mockMeasurements.push({ label: 'nonlinear', initialError: result.initialError, error: result.error, iterations: result.iterations });
});
check('Backtracking rejects overshooting real samples and accepts only a descending nonlinear result', () => {
  const initial = [(Math.PI / 2 - .01) / 40, 0, 0], input = fixture(initial), target = [.8, 0, 0], fn = value => [Math.sin(40 * value[0]), value[1], value[2]];
  const { motion, calls } = mock({ fn, objectiveTarget: target }), result = solve(input, motion, target);
  ok(result.improved);ok(result.error < 1e-5);ok(calls.objectiveErrors.some(error => error > result.initialError + .1), 'No overshooting sample was tested');
  ok(calls.candidatePositions.some(position => Math.abs(position[0] - (initial[0] - .08)) < 1e-9), 'Maximum-step clipping was not exercised');
  mockMeasurements.push({ label: 'backtracking', initialError: result.initialError, error: result.error, iterations: result.iterations });
});
check('Constraints return a measured partial best; zero influence returns the exact original raw pose unchanged', () => {
  const input = fixture(), target = [.3, 0, 0];let api = mock({ clamp: value => value.map(number => Math.max(-.01, Math.min(.01, number))) });
  const constrained = solve(input, api.motion, target, { time: 0 });ok(constrained.improved);equal(constrained.iterations, 1);equal(api.calls.solve, 1);
  ok(constrained.error > .28);ok(constrained.error < constrained.initialError);equal(constrained.position, [.01, 0, 0]);
  api = mock({ fn: () => [0, 0, 0] });const unchanged = solve(input, api.motion, target);
  equal(unchanged.improved, false);equal(unchanged.error, unchanged.initialError);equal(unchanged.pose, input.sequence.steps[0].pose);equal(unchanged.sequence, input.sequence);equal(unchanged.document, input.edits);
});
check('Bounded exploration escapes a flat projected objective without accepting an unchanged or worse sample', () => {
  const input = fixture(), target = [0, .01, 0], fn = value => [value[0], Math.max(0, value[1] - .03), value[2]], api = mock({ fn, objectiveTarget: target });
  const result = solve(input, api.motion, target);ok(result.improved);ok(result.error < 1e-8);equal(result.iterations, 1);
  ok(api.calls.candidatePositions.some(value => Math.abs(value[1] - .04) < 1e-10));
  ok(api.calls.objectiveErrors.some(error => error > result.initialError), 'Exploration did not evaluate and reject a worse candidate');
  mockMeasurements.push({ label: 'flat-constraint', initialError: result.initialError, error: result.error, iterations: result.iterations });
});
check('An endpoint goal solves once, closure aliases stay paired, and returned objects do not alias each other or input', () => {
  const input = fixture(), api = mock(), target = [.02, .01, -.015], result = solve(input, api.motion, target, { time: 8 });
  equal(api.calls.solve, 1);equal(result.iterations, 1);ok(result.error < 1e-10);equal(result.sequence.steps[0].pose, result.sequence.steps[8].pose);
  result.sequence.steps[0].pose.mockJoint[0] = 999;equal(result.sequence.steps[8].pose.mockJoint, target);equal(result.pose.mockJoint, target);equal(input.sequence.steps[0].pose.mockJoint, [0, 0, 0]);
  equal(solve(input, mock().motion, target, { maxIterations: 0 }).improved, false);
});
check('Selected K identity/time and all unselected original/K/settings/draft/curve fields survive', () => {
  const input = fixture(), point = { id: 'inverse-selected-K', segment: 0, at: .25, name: 'Keep name', pose: clone(input.sequence.steps[0].pose), custom: 'Keep point field' };
  input.edits.points = [point, { id: 'untouched-K', segment: 3, at: .4, pose: clone(input.sequence.steps[3].pose) }];
  input.edits.footCurves = [{ id: 'keep-route', side: 'left', from: stepRef(0), to: { kind: 'point', id: point.id }, bend: [0, .01, 0] }];
  const api = mock({ anchor: { kind: 'point', id: point.id }, clock: .25, fn: value => value.map(number => 2 * number) });
  const result = solve(input, api.motion, [.03, .01, 0], { anchor: { kind: 'point', id: point.id }, time: .5 });ok(result.improved);ok(result.error < 1e-5);
  equal(result.sequence, input.sequence);equal(result.document.base, input.edits.base);equal(result.document.draft, input.edits.draft);equal(result.document.footCurves, input.edits.footCurves);
  equal(result.document.points[1], input.edits.points[1]);equal({ ...result.document.points[0], pose: null }, { ...point, pose: null });
  equal(result.document.points.length, input.edits.points.length);ok(api.calls.options.every(options => options.footCurves.length === 1));
});
check('Unknown/inactive anchors and invalid coordinates/iterations/joints are rejected without source changes', () => {
  const input = fixture(), api = mock();
  for (const options of [{ anchor: { kind: 'step', id: 'missing' } }, { target: [0, NaN, 0] }, { time: Infinity }, { joint: 'missingJoint' },
    ...[-1, 1.2, 6, null].map(maxIterations => ({ maxIterations }))]) assert.throws(() => solveTrajectoryPose({ motion: api.motion, ...input, anchor: stepRef(0), time: .5, joint: 'leftAnkle', target: [.1, 0, 0], ...options }));
  const off = clone(input);off.edits.skippedSteps = [0, 8];assert.throws(() => solveTrajectoryPose({ motion: api.motion, ...off, anchor: stepRef(0), time: .5, joint: 'leftAnkle', target: [.1, 0, 0] }));
  off.edits.points = [{ id: 'off-K', segment: 0, at: .25, pose: clone(off.sequence.steps[0].pose), skipped: true }];
  assert.throws(() => solveTrajectoryPose({ motion: api.motion, ...off, anchor: { kind: 'point', id: 'off-K' }, time: .5, joint: 'leftAnkle', target: [.1, 0, 0] }));
  off.edits.points[0].skipped = false;off.edits.enabled = false;
  assert.throws(() => solveTrajectoryPose({ motion: api.motion, ...off, anchor: { kind: 'point', id: 'off-K' }, time: .5, joint: 'leftAnkle', target: [.1, 0, 0] }));
  equal(input, fixture());
});

if (!process.argv.includes('--mock-only')) {
  globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
  globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
  const bytes = await fs.readFile(new URL('public/coach/flare-coach.glb', root)), rig = JSON.parse(await fs.readFile(new URL('public/coach/coach-rig.json', root), 'utf8'));
  const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const motion = createCoachMotion({ model, rigData: rig }), nodes = [], skeletons = new Set();model.traverse(object => { nodes.push(object);if (object.isSkinnedMesh) skeletons.add(object.skeleton); });
  function snapshot() { return { pose: motion.capturePose(), metrics: motion.getMetrics(), nodes: nodes.map(object => ({ name: object.name, position: object.position.toArray(), quaternion: object.quaternion.toArray(),
    matrix: object.matrix.toArray(), world: object.matrixWorld.toArray(), matrixWorldNeedsUpdate: object.matrixWorldNeedsUpdate, visible: object.visible })),
    skeletons: [...skeletons].map(skeleton => Array.from(skeleton.boneMatrices)) }; }
  function actualSample(sequence, edits, time, joint) { const options = transitionOptions(edits);return motion.sampleTrajectory({ ...options, footCurves: options.footCurves ?? [], skippedSteps: options.skippedSteps ?? [],
    steps: sequence.steps, startTime: time, endTime: time, samples: 2 }).frames[0].joints[joint]; }
  for (const test of [
    { label: 'actual-endpoint-ankle', anchor: stepRef(1), time: 1, joint: 'rightAnkle', delta: [-.005, .01, .003] },
    { label: 'actual-interior-locked-wrist', anchor: stepRef(1), time: 1.5, joint: 'rightWrist', delta: [.01, .005, .002] },
    { label: 'actual-interior-K-ankle', anchor: { kind: 'point', id: 'actual-inverse-K' }, time: 1.65, joint: 'rightAnkle', delta: [-.004, .008, .003], withK: true },
    { label: 'actual-floor-plateau', anchor: stepRef(2), time: 1.5, joint: 'rightAnkle', delta: [0, .01, 0], interpolation: 'smooth' },
  ]) check(test.label + ': real resampling improves the selected pose and retains the live Snow scene', () => {
    const edits = createTransitionEdits(source);edits.interpolation = test.interpolation ?? 'linear';
    motion.setSequence(source.steps, { period: source.period, ...transitionOptions(edits) });motion.update(1.42);
    if (test.withK) edits.points = [{ id: 'actual-inverse-K', segment: 1, at: .42, name: 'Keep actual K identity', pose: motion.capturePose() }];
    motion.applyPose(motion.capturePose());const before = snapshot(), input = { sequence: freeze(clone(source)), edits: freeze(clone(edits)) };
    const initial = actualSample(source, edits, test.time, test.joint), target = initial.map((value, index) => value + test.delta[index]);
    const start = performance.now(), result = solve(input, motion, target, { anchor: test.anchor, time: test.time, joint: test.joint });const elapsedMs = performance.now() - start;
    equal(snapshot(), before, 'Actual inverse search mutated live pose/time/warnings/bones/matrices');
    const replay = actualSample(result.sequence, result.document, test.time, test.joint);ok(distance(replay, result.position) < 1e-10);ok(Math.abs(distance(replay, target) - result.error) < 1e-10);
    ok(result.improved, 'Actual objective did not improve');ok(result.error < result.initialError * .9, 'Real reduction was too small');
    if (test.withK) { equal(result.sequence, source);equal(result.document.points[0].id, edits.points[0].id);equal(result.document.points[0].at, edits.points[0].at); }
    else for (let index = 0; index < source.steps.length; index++) if (source.steps[index].id !== test.anchor.id) equal(result.sequence.steps[index], source.steps[index]);
    measurements.push({ label: test.label, initialError: result.initialError, error: result.error, iterations: result.iterations, elapsedMs });
  });
}
equal(source, original);equal(await fs.readFile(sourceURL, 'utf8'), sourceBytes);
const report = { pass: failures.length === 0, passed: checks.filter(check => check.pass).length, total: checks.length, assertions, checks, failures, mockMeasurements, measurements,
  sourceSha256: hash(sourceBytes), moduleSha256: hash(await fs.readFile(new URL('../src/trajectory-pose-edit.js', import.meta.url))),
  scope: 'Pure inverse editing of one explicit active original/K. Nonlinear true-objective descent, damped finite differences/backtracking/step cap, partial or unchanged constrained best, linked 09 closure, complete metadata/input retention, and small actual Snow resampling/state tests. No browser, storage write or automatic multi-frame fitting.' };
const output = new URL('../output/playwright/trajectory-pose-edit-verification.json', import.meta.url);await fs.mkdir(new URL('.', output), { recursive: true });await fs.writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, assertions, mockMeasurements, measurements, failures, report: output.pathname }, null, 2));if (!report.pass) process.exitCode = 1;
