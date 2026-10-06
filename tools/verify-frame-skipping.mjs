import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createFlareSequence } from '../src/flare-sequence.js';

const sourceUrl = new URL('../public/coach/flare-sequence.json', import.meta.url);
const sourceBytes = await fs.readFile(sourceUrl, 'utf8'), source = JSON.parse(sourceBytes), original = structuredClone(source);
const engineBytes = await fs.readFile(new URL('../src/flare-sequence.js', import.meta.url), 'utf8');
const count = source.steps.length, period = 18, checks = [], failures = [];
const sides = ['left', 'right'], vectorKeys = ['wrist', 'elbowPole', 'ankle', 'kneePole'];
const quaternionKeys = ['handQuaternion', 'footQuaternion'];
let assertions = 0, comparedPoses = 0, maximumPositionError = 0, maximumRotationError = 0;
const sha256 = value => createHash('sha256').update(value).digest('hex');
const smooth = value => value * value * (3 - 2 * value);
const atTime = (coordinate, cycle = 0, duration = period) => (cycle + coordinate / count) * duration;
const yaw = (angle, scale = 1) => [0, Math.sin(angle / 2) * scale, 0, Math.cos(angle / 2) * scale];
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label);assertions++; }
function close(actual, expected, label, tolerance = 1e-9) { assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);assertions++; }
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function pose(value, angle = value * .12, scale = 1) {
  const result = structuredClone(source.steps[0].pose);
  result.pelvis = [value, value * .25, -value * .1];result.bodyQuaternion = yaw(angle, scale);
  result.torsoQuaternion = yaw(angle * .4, scale);result.groundLock = value >= 0;
  result.testLabel = `pose-${value}`;
  for (const [sideIndex, side] of sides.entries()) {
    const limb = result.limbs[side];
    for (const [keyIndex, key] of vectorKeys.entries()) limb[key] = [value + sideIndex * .3, value * .2 + keyIndex * .1, value * -.15 + keyIndex * .05];
    for (const key of quaternionKeys) limb[key] = yaw(angle * .7, scale);
    limb.handLocked = (value + sideIndex) % 2 === 0;
    limb.elbowTwist = angle * .2;limb.kneeTwist = angle * .3;
  }
  return result;
}
const synthetic = source.steps.map((step, index) => ({ ...structuredClone(step), pose: pose(index) }));
// A skipped pose must disappear as an interpolation anchor, rather than merely
// becoming unselectable while its pronounced endpoint still shapes the path.
synthetic[2].pose = pose(20, 1.5);synthetic[3].pose = pose(-10, -1.2);
const originals = structuredClone(synthetic);
const firstK = { id: 'middle-K', segment: 2, at: .25, pose: pose(8, 1.2, -3) };
const secondK = { id: 'later-K', segment: 3, at: .6, pose: pose(-4, 1.8, 2) };
const corrections = [secondK, firstK], originalCorrections = structuredClone(corrections);
const skippedSteps = [3, 2], originalSkipped = [...skippedSteps];
const normalize = values => { const size = Math.hypot(...values);return values.map(value => value / size); };
function rotationDistance(first, second) {
  const a = normalize(first), b = normalize(second), dot = Math.abs(a.reduce((sum, value, index) => sum + value * b[index], 0));
  return 2 * Math.acos(Math.max(0, Math.min(1, dot)));
}
function expectedPose(actual, start, end, blend, label) {
  const vectors = (a, b, c) => {
    for (let index = 0; index < 3; index++) {
      const expected = b[index] * (1 - blend) + c[index] * blend;
      maximumPositionError = Math.max(maximumPositionError, Math.abs(a[index] - expected));close(a[index], expected, label);
    }
  };
  const rotations = (a, b, c) => {
    const turn = rotationDistance(b, c), actualTurn = rotationDistance(b, a), error = Math.abs(actualTurn - turn * blend);
    maximumRotationError = Math.max(maximumRotationError, error);close(actualTurn, turn * blend, label + ' rotation', 1e-7);
  };
  vectors(actual.pelvis, start.pelvis, end.pelvis);rotations(actual.bodyQuaternion, start.bodyQuaternion, end.bodyQuaternion);
  rotations(actual.torsoQuaternion, start.torsoQuaternion, end.torsoQuaternion);
  for (const side of sides) {
    for (const key of vectorKeys) vectors(actual.limbs[side][key], start.limbs[side][key], end.limbs[side][key]);
    for (const key of quaternionKeys) rotations(actual.limbs[side][key], start.limbs[side][key], end.limbs[side][key]);
    equal(actual.limbs[side].handLocked, start.limbs[side].handLocked && end.limbs[side].handLocked, label + ' support');
    for (const key of ['elbowTwist', 'kneeTwist']) close(actual.limbs[side][key], start.limbs[side][key] + (end.limbs[side][key] - start.limbs[side][key]) * blend, label + ' twist');
  }
  equal(actual.groundLock, start.groundLock, label + ' ground lock');comparedPoses++;
}
function finite(value) {
  if (typeof value === 'number') { assert.ok(Number.isFinite(value));assertions++; }
  else if (value && typeof value === 'object') for (const child of Object.values(value)) finite(child);
}
function globalBlend(coordinate, left, right, baseStart = 1, baseEnd = 4) {
  const progress = value => (value - baseStart) / (baseEnd - baseStart);
  return (smooth(progress(coordinate)) - smooth(progress(left))) / (smooth(progress(right)) - smooth(progress(left)));
}

check('Skipping bridges previous and next enabled originals over their unchanged timestamps', () => {
  for (const interpolation of ['linear', 'smooth']) {
    const sequence = createFlareSequence(synthetic, { period, skippedSteps: [2], interpolation });
    for (const coordinate of [1.2, 1.75, 2, 2.6, 2.9]) {
      const fraction = (coordinate - 1) / 2, blend = interpolation === 'linear' ? fraction : smooth(fraction);
      expectedPose(sequence.sample(atTime(coordinate)), synthetic[1].pose, synthetic[3].pose, blend, interpolation + ' single skip');
    }
    assert.notDeepEqual(sequence.sample(atTime(2)), synthetic[2].pose);assertions++;
    equal(sequence.steps, synthetic, 'Original node storage');equal(sequence.period, period, 'Original cycle duration');
  }
});
check('Consecutive skips use real elapsed time, constant linear angular speed and long-span smooth timing', () => {
  const linear = createFlareSequence(synthetic, { period, skippedSteps, interpolation: 'linear' });
  const smoothSequence = createFlareSequence(synthetic, { period, skippedSteps, interpolation: 'smooth' });
  for (const coordinate of [1.25, 2, 2.5, 3.25, 3.75]) {
    const fraction = (coordinate - 1) / 3;
    expectedPose(linear.sample(atTime(coordinate)), synthetic[1].pose, synthetic[4].pose, fraction, 'linear long span');
    expectedPose(smoothSequence.sample(atTime(coordinate)), synthetic[1].pose, synthetic[4].pose, smooth(fraction), 'smooth long span');
  }
  const interval = .3, first = linear.sample(3), next = linear.sample(3 + interval);
  close((next.pelvis[0] - first.pelvis[0]) / interval, .5, 'Six-second span keeps position velocity');
  close(rotationDistance(first.bodyQuaternion, next.bodyQuaternion) / interval, .06, 'Six-second span keeps angular velocity', 1e-7);
  const epsilon = 1e-5;
  close((smoothSequence.sample(2 + epsilon).pelvis[0] - synthetic[1].pose.pelvis[0]) / epsilon, 0, 'Smooth speed begins near zero', 1e-5);
  close((synthetic[4].pose.pelvis[0] - smoothSequence.sample(8 - epsilon).pelvis[0]) / epsilon, 0, 'Smooth speed ends near zero', 1e-5);
});
check('Active K points split the long span, retain their raw values and bound the affected path', () => {
  for (const interpolation of ['linear', 'smooth']) {
    const sequence = createFlareSequence(synthetic, { period, skippedSteps, corrections, interpolation });
    for (const [coordinate, left, right, start, end] of [
      [1.5, 1, 2.25, synthetic[1].pose, firstK.pose],
      [2.9, 2.25, 3.6, firstK.pose, secondK.pose],
      [3.8, 3.6, 4, secondK.pose, synthetic[4].pose],
    ]) {
      const blend = interpolation === 'linear' ? (coordinate - left) / (right - left) : globalBlend(coordinate, left, right);
      expectedPose(sequence.sample(atTime(coordinate)), start, end, blend, interpolation + ' K-limited span');
    }
    for (const correction of corrections) for (const cycle of [-2, 0, 3]) equal(sequence.sample(atTime(correction.segment + correction.at, cycle)), correction.pose, 'Raw K values');
    for (const index of [0, 1, 4, 5, 6, 7, 8]) for (const cycle of [-2, 0, 3]) equal(sequence.sample(atTime(index, cycle)), synthetic[index].pose, 'Raw enabled original values');
  }
  assert.ok(Math.abs(globalBlend(2.9, 2.25, 3.6) - smooth((2.9 - 2.25) / (3.6 - 2.25))) > 1e-3, 'Fixture distinguishes global smooth timing from a stop at every K');assertions++;
});
check('Skipping does not alter remote original spans, phase indices or transitionAt grid coordinates', () => {
  const actualK = { id: 'remote-K', segment: 6, at: .35, pose: structuredClone(source.steps[6].pose) };
  actualK.pose.pelvis[0] += .03;
  for (const interpolation of ['linear', 'smooth']) {
    const baseline = createFlareSequence(source.steps, { period: source.period, corrections: [actualK], interpolation });
    const sequence = createFlareSequence(source.steps, { period: source.period, skippedSteps, corrections: [actualK], interpolation });
    for (const segment of [0, 4, 5, 6, 7, 8]) for (const at of [.13, .35, .57, .93]) {
      equal(sequence.sample(segment + at), baseline.sample(segment + at), 'Remote span output must be byte identical');
    }
    for (const coordinate of [0, 1.3, 2, 2.7, 3.9, 8.2]) equal(sequence.transitionAt(coordinate), baseline.transitionAt(coordinate), 'UI coordinates remain on original grid');
    equal(sequence.steps, baseline.steps, 'All original steps remain stored');equal(sequence.keyframes, baseline.keyframes, 'Original phase indices remain stored');
  }
});
check('Cross-cycle and paired 09 skipping bridge the wrap while preserving cycle closure', () => {
  for (const interpolation of ['linear', 'smooth']) {
    const sequence = createFlareSequence(synthetic, { period, skippedSteps: [8, 0], interpolation });
    for (const [coordinate, unfolded] of [[7.4, 7.4], [8.25, 8.25], [0, 9], [.75, 9.75]]) {
      const fraction = (unfolded - 7) / 3;
      expectedPose(sequence.sample(atTime(coordinate)), synthetic[7].pose, synthetic[1].pose, interpolation === 'linear' ? fraction : smooth(fraction), 'Wrapping long span');
    }
    const actual = createFlareSequence(source.steps, { period: source.period, skippedSteps: [0, 8], interpolation });
    equal(actual.sample(0), actual.sample(source.period), 'Paired 09 skip still closes');
    equal(actual.sample(-source.period), actual.sample(0), 'Negative cycle closes');
    const left = actual.sample(source.period - 1e-8), right = actual.sample(1e-8);
    close(Math.hypot(...left.pelvis.map((value, index) => value - right.pelvis[index])), 0, 'Loop position continuity', 1e-6);
    close(rotationDistance(left.bodyQuaternion, right.bodyQuaternion), 0, 'Loop angular continuity', 1e-6);
    equal(sequence.stepAt(atTime(0)), 1, 'Wrapping nearest original skips 09');
  }
  const independent = createFlareSequence(source.steps, { period: source.period, skippedSteps: [0] });
  equal(independent.sample(8), source.steps[8].pose, 'Core handles first and last indices independently');
});
check('Nearest original selection never selects a skipped index and exact ties advance', () => {
  const sequence = createFlareSequence(synthetic, { period, skippedSteps });
  for (let coordinate = -9; coordinate < 18; coordinate += .125) {
    assert.ok(!skippedSteps.includes(sequence.stepAt(atTime(coordinate))));assertions++;
  }
  equal(sequence.stepAt(atTime(2.49)), 1, 'Prior long-span original');equal(sequence.stepAt(atTime(2.5)), 4, 'Midpoint selects approaching original');
  equal(sequence.stepAt(atTime(2.51)), 4, 'Next long-span original');
});
check('A single remaining original is constant raw data; all originals may be skipped if K anchors remain', () => {
  const all = synthetic.map((_, index) => index), allButFour = all.filter(index => index !== 4);
  let calls = 0;
  const single = createFlareSequence(synthetic, { period, skippedSteps: allButFour, mapTransition() { calls++;throw new Error('Constant anchor must bypass mapping'); } });
  for (const time of [-27, 0, 3.2, 8, 17.99, 54]) { equal(single.sample(time), synthetic[4].pose, 'Single original raw constant');equal(single.stepAt(time), 4, 'Single original index'); }
  const singleK = createFlareSequence(synthetic, { period, skippedSteps: all, corrections: [firstK], mapTransition() { calls++;throw new Error('Constant K must bypass mapping'); } });
  for (const time of [-27, 0, 3.2, 8, 17.99, 54]) { equal(singleK.sample(time), firstK.pose, 'Single K raw constant');equal(singleK.stepAt(time), firstK.segment, 'Single K segment fallback'); }
  equal(calls, 0, 'No mapping for a constant saved anchor');
});
check('With only K anchors, smooth timing is local and both ordinary and wrapping K spans interpolate', () => {
  const all = synthetic.map((_, index) => index);
  const early = { id: 'early-only-K', segment: 1, at: .2, pose: pose(1, -.3, -2) };
  const late = { id: 'late-only-K', segment: 5, at: .4, pose: pose(5, .4, 3) };
  for (const interpolation of ['linear', 'smooth']) {
    const sequence = createFlareSequence(synthetic, { period, skippedSteps: all, corrections: [late, early], interpolation });
    for (const fraction of [.25, .5, .75]) {
      const blend = interpolation === 'linear' ? fraction : smooth(fraction);
      expectedPose(sequence.sample(atTime(1.2 + 4.2 * fraction)), early.pose, late.pose, blend, 'Only-K ordinary span');
      expectedPose(sequence.sample(atTime(5.4 + 4.8 * fraction)), late.pose, early.pose, blend, 'Only-K wrapping span');
    }
    equal(sequence.sample(atTime(1.2)), early.pose, 'Only-K raw early anchor');equal(sequence.sample(atTime(5.4)), late.pose, 'Only-K raw late anchor');
    equal(sequence.stepAt(atTime(1.2)), early.segment, 'Only-K early nearest segment');equal(sequence.stepAt(atTime(5.4)), late.segment, 'Only-K late nearest segment');
  }
});
check('One enabled original with multiple K points uses that original full-cycle smooth time curve', () => {
  const allButFour = synthetic.map((_, index) => index).filter(index => index !== 4);
  const late = { id: 'late-K', segment: 6, at: .5, pose: pose(8, 1.1) };
  const early = { id: 'early-K', segment: 1, at: .25, pose: pose(-1, -.7) };
  const sequence = createFlareSequence(synthetic, { period, skippedSteps: allButFour, corrections: [late, early] });
  for (const [coordinate, unfolded] of [[7.25, 7.25], [.5, 9.5]]) {
    expectedPose(sequence.sample(atTime(coordinate)), late.pose, early.pose, globalBlend(unfolded, 6.5, 10.25, 4, 13), 'Single-original full-cycle timing');
    equal(sequence.stepAt(atTime(coordinate)), 4, 'Single original stays selectable');
  }
});
check('Mapper receives the nearest real active anchors and long-span blend, with exact anchors bypassed', () => {
  const contexts = [];
  const sequence = createFlareSequence(synthetic, { period, skippedSteps, corrections, mapTransition(result, context) { contexts.push(structuredClone(context));context.start.pelvis[0] = 999;context.end.pelvis[0] = 999;return result; } });
  equal(sequence.sample(atTime(1)), synthetic[1].pose, 'Mapper original bypass');equal(sequence.sample(atTime(2.25)), firstK.pose, 'Mapper K bypass');equal(contexts.length, 0, 'Exact anchors bypass callbacks');
  sequence.sample(atTime(2.9));equal(contexts[0].start, firstK.pose, 'Mapper nearest start');equal(contexts[0].end, secondK.pose, 'Mapper nearest end');
  close(contexts[0].blend, globalBlend(2.9, 2.25, 3.6), 'Mapper globally retimed local blend');
  equal(sequence.sample(atTime(2.25)), firstK.pose, 'Mapper context cannot mutate private anchor');
});
check('Noninteger periods and nearby K points retain exact values and finite small-span interpolation', () => {
  const tiny = [
    { id: 'tiny-start', segment: 2, at: 1e-9, pose: pose(2, .2, -3) },
    { id: 'tiny-end', segment: 2, at: 1 - 1e-9, pose: pose(3, .3, 2) },
    { id: 'near-K-a', segment: 3, at: .42, pose: pose(4, .4) },
    { id: 'near-K-b', segment: 3, at: .42000002, pose: pose(5, .5) },
  ];
  for (const interpolation of ['linear', 'smooth']) {
    const sequence = createFlareSequence(synthetic, { period: 13.7, skippedSteps, corrections: tiny, interpolation });
    for (const point of tiny) for (const cycle of [-3, 0, 2]) equal(sequence.sample(atTime(point.segment + point.at, cycle, 13.7)), point.pose, 'Near-K exact saved values');
    for (const coordinate of [2 + 5e-10, 3 - 5e-10, 3.42000001]) finite(sequence.sample(atTime(coordinate, 0, 13.7)));
  }
});
check('Skipped option validation rejects invalid indices, duplicates and an empty active animation atomically', () => {
  const invalid = [null, false, 1, {}, '2', new Array(1), [-1], [count], [1.5], [NaN], [Infinity], ['2'], [2, 2], [3, 2, 3], synthetic.map((_, index) => index)];
  for (const skippedSteps of invalid) { assert.throws(() => createFlareSequence(synthetic, { period, skippedSteps }), TypeError);assertions++; }
  for (const time of [NaN, Infinity, '2']) {
    const sequence = createFlareSequence(synthetic, { period, skippedSteps });
    for (const method of ['sample', 'stepAt', 'transitionAt']) { assert.throws(() => sequence[method](time), TypeError);assertions++; }
  }
  const bad = structuredClone(firstK);bad.pose.limbs.left.ankle[0] = NaN;
  assert.throws(() => createFlareSequence(synthetic, { period, skippedSteps, corrections: [secondK, bad] }), TypeError);assertions++;
});
check('Omitted or empty skippedSteps remain compatible, and caller/output mutations cannot change private data', () => {
  for (const interpolation of ['smooth', 'linear']) {
    const omitted = createFlareSequence(source.steps, { period: source.period, corrections, interpolation });
    const empty = createFlareSequence(source.steps, { period: source.period, corrections, interpolation, skippedSteps: [] });
    for (const time of [-9, -.31, 0, .37, 1.42, 2.25, 3.6, 4.19, 6.53, 8.89, 9]) {
      equal(empty.sample(time), omitted.sample(time), 'Empty skip compatibility');equal(empty.stepAt(time), omitted.stepAt(time), 'Empty skip index compatibility');equal(empty.transitionAt(time), omitted.transitionAt(time), 'Empty skip grid compatibility');
    }
  }
  const mutableSteps = structuredClone(synthetic), mutablePoints = structuredClone(corrections), mutableSkip = [...skippedSteps];
  const independent = createFlareSequence(mutableSteps, { period, corrections: mutablePoints, skippedSteps: mutableSkip });
  const before = independent.sample(atTime(2.9));
  mutableSteps[1].pose.pelvis[0] = 999;mutablePoints[0].pose.pelvis[0] = 999;mutableSkip.length = 0;
  independent.steps[1].pose.pelvis[0] = 999;independent.sample(atTime(2.9)).pelvis[0] = 999;
  equal(independent.sample(atTime(2.9)), before, 'Private skipped topology and poses remain independent');
  equal(synthetic, originals, 'Input originals untouched');equal(corrections, originalCorrections, 'Input K points untouched');equal(skippedSteps, originalSkipped, 'Input skip order untouched');equal(source, original, 'Real original poses untouched');
});

try { equal(await fs.readFile(sourceUrl, 'utf8'), sourceBytes, 'Original saved asset bytes untouched'); }
catch (error) { failures.push({ name: 'Source byte preservation', message: error.message, stack: error.stack }); }
const report = { pass: failures.length === 0, checks, failures, assertions, originalNodes: count, comparedPoses, maximumPositionError, maximumRotationError,
  sourceSha256: sha256(sourceBytes), engineSha256: sha256(engineBytes),
  scope: 'Pure saved-pose sampler: unchanged timing and storage, isolated and consecutive skips, corrected long-span timing, cyclic skipping, exact raw anchors, active-step selection, one/only-K anchors, map context, finite close-K samples, validation and old empty-skip compatibility. Actual Snow bones and browser controls are verified separately.' };
const output = new URL('../output/playwright/', import.meta.url);await fs.mkdir(output, { recursive: true });
const reportUrl = new URL('frame-skipping-verification.json', output);await fs.writeFile(reportUrl, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: checks.filter(item => item.pass).length, checks: checks.length, assertions, comparedPoses, maximumPositionError, maximumRotationError, failures, report: reportUrl.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
