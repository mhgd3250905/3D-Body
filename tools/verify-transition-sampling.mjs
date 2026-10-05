import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createFlareSequence } from '../src/flare-sequence.js';

const sourceUrl = new URL('../public/coach/flare-sequence.json', import.meta.url);
const sourceBytes = fs.readFileSync(sourceUrl, 'utf8');
const document = JSON.parse(sourceBytes);
const originalSteps = JSON.stringify(document.steps);
const { steps, period } = document;
const baseline = createFlareSequence(steps, { period });
const sides = ['left', 'right'];
const points = ['wrist', 'elbowPole', 'ankle', 'kneePole'];
const rotations = ['handQuaternion', 'footQuaternion'];
const twists = ['elbowTwist', 'kneeTwist'];
let checks = 0;
function equal(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
  checks++;
}
function close(actual, expected, label, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);
  checks++;
}
function check(condition, label) {
  assert.ok(condition, label);
  checks++;
}
function rejects(call, label, expected = TypeError) {
  assert.throws(call, expected, label);
  checks++;
}
const timeAt = (segment, at, cycles = 0, duration = period) => (cycles + (segment + at) / steps.length) * duration;
const smoothstep = value => value * value * (3 - 2 * value);
const correctionA = { id: 'adjust-one', segment: 1, at: 0.27, pose: baseline.sample(timeAt(1, 0.27)) };
correctionA.pose.pelvis[0] += 0.08;
correctionA.pose.limbs.left.kneePole[2] -= 0.12;
correctionA.pose.bodyQuaternion = correctionA.pose.bodyQuaternion.map(value => value * -3);
correctionA.pose.torsoQuaternion = [0.2, -0.1, 0.3, 2];
correctionA.pose.limbs.left.elbowTwist = 2 * Math.PI + 0.2;
correctionA.pose.limbs.right.kneeTwist = Math.PI - 0.1;
const correctionB = { id: 'adjust-two', segment: 1, at: 0.74, pose: baseline.sample(timeAt(1, 0.74)) };
correctionB.pose.pelvis[0] -= 0.05;
correctionB.pose.limbs.right.ankle[1] += 0.1;
correctionB.pose.torsoQuaternion = [0, 0, 0, -2];
correctionB.pose.limbs.left.elbowTwist = -0.3;
correctionB.pose.limbs.right.kneeTwist = -Math.PI + 0.1;
const closingCorrection = { id: 'adjust-wrap', segment: 8, at: 0.6, pose: structuredClone(steps[8].pose) };
closingCorrection.pose.pelvis[2] += 0.03;
const corrections = [correctionB, closingCorrection, correctionA];
const originalCorrections = JSON.stringify(corrections);
const sequence = createFlareSequence(steps, { period, corrections });

equal(steps.length, 9, 'The current saved loop has nine original anchors');
equal(sequence.steps, steps, 'Corrections must not insert or reorder original steps');
equal(sequence.period, baseline.period, 'Corrections must preserve the original period');
equal(sequence.keyframes, baseline.keyframes, 'Phase keyframes must remain original step indices');
for (let index = 0; index < steps.length; index++) {
  for (const cycle of [0, 1, -1, 3]) {
    equal(sequence.sample(timeAt(index, 0, cycle)), steps[index].pose, 'An original anchor must retain every saved value');
    equal(sequence.stepAt(timeAt(index, 0, cycle)), index, 'An original anchor must retain its step index');
  }
}
equal(steps[0].pose, steps.at(-1).pose, 'The first and repeated last poses must match');
equal(sequence.sample(period), steps[0].pose, 'The loop must close on the original first pose');
equal(sequence.sample(-period), steps[0].pose, 'Negative loop time must close on the original first pose');
for (const correction of corrections) {
  for (const cycle of [0, 1, -1, 3]) {
    equal(sequence.sample(timeAt(correction.segment, correction.at, cycle)), correction.pose, 'A correction must retain raw saved values, including quaternion scale and sign');
  }
}
const alternatePeriod = 13.7;
const alternate = createFlareSequence(steps, { period: alternatePeriod, corrections });
for (let index = 0; index < steps.length; index++) equal(alternate.sample(timeAt(index, 0, 0, alternatePeriod)), steps[index].pose, 'Non-integer duration anchor arithmetic must retain the saved pose');
for (const correction of corrections) equal(alternate.sample(timeAt(correction.segment, correction.at, 2, alternatePeriod)), correction.pose, 'Non-integer duration correction arithmetic must retain the saved pose');

let unchangedSamples = 0;
for (let segment = 0; segment < steps.length; segment++) {
  for (const at of [0.09, 0.31, 0.5, 0.83, 0.97]) {
    const time = timeAt(segment, at);
    equal(sequence.stepAt(time), baseline.stepAt(time), 'Nearest original step selection must not change');
    equal(sequence.transitionAt(time), baseline.transitionAt(time), 'Transition indices and elapsed progress must not change');
    if (![1, 8].includes(segment)) {
      equal(sequence.sample(time), baseline.sample(time), 'A correction must affect only its designated transition');
      unchangedSamples++;
    }
  }
}
const interior = 0.51;
const expectedBlend = (smoothstep(interior) - smoothstep(correctionA.at)) / (smoothstep(correctionB.at) - smoothstep(correctionA.at));
const interpolated = sequence.sample(timeAt(1, interior));
close(interpolated.pelvis[0], correctionA.pose.pelvis[0] * (1 - expectedBlend) + correctionB.pose.pelvis[0] * expectedBlend, 'Correction spans must use the original transition smoothstep');
check(Math.abs(expectedBlend - smoothstep((interior - correctionA.at) / (correctionB.at - correctionA.at))) > 1e-3, 'This fixture distinguishes global smoothstep from a stop at every correction');
for (const side of sides) {
  equal(interpolated.limbs[side].handLocked, correctionA.pose.limbs[side].handLocked && correctionB.pose.limbs[side].handLocked, 'Hand support must be shared by the two local span ends');
}
equal(interpolated.groundLock, correctionA.pose.groundLock, 'Ground lock must retain the local previous pose flag');
check(Object.hasOwn(interpolated, 'torsoQuaternion'), 'Torso corrections must interpolate');
check(Number.isFinite(interpolated.limbs.left.elbowTwist), 'Elbow twist corrections must interpolate');
check(Number.isFinite(interpolated.limbs.right.kneeTwist), 'Knee twist corrections must interpolate');

function rotationDistance(a = [0, 0, 0, 1], b = [0, 0, 0, 1]) {
  const normalized = values => {
    const maximum = Math.max(...values.map(Math.abs));
    const scaled = values.map(value => value / maximum);
    const length = Math.hypot(...scaled);
    return scaled.map(value => value / length);
  };
  const qa = normalized(a), qb = normalized(b);
  const dot = Math.abs(qa.reduce((sum, value, index) => sum + value * qb[index], 0));
  return 2 * Math.acos(Math.min(1, Math.max(0, dot)));
}
const angleDistance = (a = 0, b = 0) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
let maximumPositionJump = 0, maximumAngleJump = 0;
function compareAdjacent(before, after) {
  const position = (a, b) => { maximumPositionJump = Math.max(maximumPositionJump, Math.hypot(...a.map((value, index) => value - b[index]))); };
  const rotation = (a, b) => { maximumAngleJump = Math.max(maximumAngleJump, rotationDistance(a, b)); };
  position(before.pelvis, after.pelvis);
  rotation(before.bodyQuaternion, after.bodyQuaternion);
  rotation(before.torsoQuaternion, after.torsoQuaternion);
  for (const side of sides) {
    for (const point of points) position(before.limbs[side][point], after.limbs[side][point]);
    for (const key of rotations) rotation(before.limbs[side][key], after.limbs[side][key]);
    for (const key of twists) maximumAngleJump = Math.max(maximumAngleJump, angleDistance(before.limbs[side][key], after.limbs[side][key]));
  }
}
const boundaryTimes = [...steps.map((_, index) => timeAt(index, 0)), ...corrections.map(correction => timeAt(correction.segment, correction.at)), period];
for (const time of boundaryTimes) compareAdjacent(sequence.sample(time - 1e-7), sequence.sample(time + 1e-7));
check(maximumPositionJump < 1e-5, 'Position interpolation must be continuous across original anchors, corrections and loop wrap');
check(maximumAngleJump < 1e-5, 'Physical rotations must be continuous despite raw quaternion signs and wrapped twist values');

const endpointCorrections = [1e-9, 1 - 1e-9].map((at, index) => ({ id: `near-end-${index}`, segment: 3, at, pose: structuredClone(steps[3 + index].pose) }));
const endpointSequence = createFlareSequence(steps, { period, corrections: endpointCorrections });
for (const correction of endpointCorrections) equal(endpointSequence.sample(timeAt(3, correction.at)), correction.pose, 'A valid correction close to an anchor must remain selectable');
for (const at of [5e-10, 1 - 5e-10]) {
  const pose = endpointSequence.sample(timeAt(3, at));
  check([...pose.pelvis, ...pose.bodyQuaternion].every(Number.isFinite), 'Small endpoint spans must avoid smoothstep cancellation');
}

const invalidCorrections = [
  null, {}, new Array(1),
  [{ ...correctionA, id: '' }], [{ ...correctionA, id: 1 }],
  [correctionA, { ...correctionB, id: correctionA.id }],
  ...[-1, steps.length, 1.5, Infinity].map(segment => [{ ...correctionA, segment }]),
  ...[0, 1, -0.1, NaN, Infinity, '0.5'].map(at => [{ ...correctionA, at }]),
  [{ ...correctionA, pose: { ...correctionA.pose, version: 2 } }],
  [{ ...correctionA, pose: { ...correctionA.pose, pelvis: [1, 2] } }],
  [{ ...correctionA, pose: { ...correctionA.pose, bodyQuaternion: [0, 0, 0, 0] } }],
  [{ ...correctionA, pose: { ...correctionA.pose, torsoQuaternion: [0, 0, NaN, 1] } }],
  [{ ...correctionA, pose: { ...correctionA.pose, groundLock: 'true' } }],
  [{ ...correctionA, pose: { ...correctionA.pose, extra: { value: Infinity } } }],
];
for (const invalid of invalidCorrections) rejects(() => createFlareSequence(steps, { period, corrections: invalid }), 'Invalid correction arrays must be rejected entirely');
for (const key of ['handLocked', 'ankle', 'footQuaternion', 'kneeTwist']) {
  const invalid = structuredClone(correctionA);
  invalid.pose.limbs.left[key] = key === 'handLocked' ? 1 : key === 'ankle' ? [0, 0, NaN] : key === 'footQuaternion' ? [0, 0, 0, 0] : '0.2';
  rejects(() => createFlareSequence(steps, { corrections: [correctionB, invalid] }), 'An invalid later correction must prevent partial application');
}
for (const at of [correctionA.at, correctionA.at + 5e-9]) rejects(() => createFlareSequence(steps, { corrections: [correctionA, { ...correctionA, id: 'duplicate-position', at }] }), 'Duplicate and nearly duplicate positions must be rejected', /same position/);
check(createFlareSequence(steps, { corrections: [correctionA, { ...correctionA, id: 'separate-position', at: correctionA.at + 2e-8 }] }), 'Distinct correction positions beyond the tolerance must be accepted');
for (const time of [NaN, Infinity, '0.5']) {
  rejects(() => sequence.sample(time), 'Non-finite sampling time must be rejected');
  rejects(() => sequence.transitionAt(time), 'Non-finite transition time must be rejected');
}

let mapCalls = 0;
const mapped = createFlareSequence(steps, { period, corrections, mapTransition(pose, context) {
  mapCalls++;
  check(context.blend > 0 && context.blend < 1, 'Transition mapping must receive a span blend');
  context.start.pelvis[0] = 999;
  context.end.pelvis[0] = 999;
  pose.pelvis[1] += 0.02;
  return pose;
} });
equal(mapped.sample(0), steps[0].pose, 'Mapping must not alter original anchors');
equal(mapped.sample(timeAt(1, correctionA.at)), correctionA.pose, 'Mapping must not alter exact corrections');
equal(mapCalls, 0, 'Mapping must only run between anchors and corrections');
close(mapped.sample(timeAt(1, interior)).pelvis[1], interpolated.pelvis[1] + 0.02, 'Mapping must run after interpolation');
equal(mapped.sample(timeAt(1, correctionA.at)), correctionA.pose, 'Mapping context mutations must not alter stored correction poses');
equal(mapped.sample(0), steps[0].pose, 'Mapping context mutations must not alter stored original poses');
for (const mapTransition of [null, false, {}, 1]) rejects(() => createFlareSequence(steps, { mapTransition }), 'Invalid mapping callbacks must be rejected');
rejects(() => createFlareSequence(steps, { mapTransition: () => ({ version: 1 }) }).sample(0.25), 'Invalid mapped pose results must be rejected');

const linear = createFlareSequence(steps, { period, interpolation: 'linear' });
const linearCorrections = createFlareSequence(steps, { period, corrections, interpolation: 'linear' });
const explicitSmooth = createFlareSequence(steps, { period, corrections, interpolation: 'smooth' });
let maximumLinearPositionError = 0, linearTimeSamples = 0;
function positionProportion(pose, start, end, blend, label) {
  let error = 0;
  const compare = (actual, a, b) => {
    for (let axis = 0; axis < 3; axis++) error = Math.max(error, Math.abs(actual[axis] - (a[axis] * (1 - blend) + b[axis] * blend)));
  };
  compare(pose.pelvis, start.pelvis, end.pelvis);
  for (const side of sides) for (const point of points) compare(pose.limbs[side][point], start.limbs[side][point], end.limbs[side][point]);
  maximumLinearPositionError = Math.max(maximumLinearPositionError, error);linearTimeSamples++;
  close(error, 0, label);
}
for (let segment = 0; segment < steps.length; segment++) {
  for (const at of [.13, .46, .91]) {
    const time = timeAt(segment, at);
    positionProportion(linear.sample(time), steps[segment].pose, steps[(segment + 1) % steps.length].pose, at, 'Actual saved positions must follow elapsed time directly in linear mode');
    equal(explicitSmooth.sample(time), sequence.sample(time), 'Explicit smooth mode must retain the default sampling behavior exactly');
    equal(linear.stepAt(time), baseline.stepAt(time), 'Changing time interpolation must preserve original nearest-step selection');
    equal(linear.transitionAt(time), baseline.transitionAt(time), 'Changing time interpolation must preserve original segment indices and elapsed time');
  }
}
for (const [mode, playback] of [['smooth', explicitSmooth], ['linear', linearCorrections]]) {
  equal(playback.steps, steps, `${mode} mode must retain the original steps`);
  equal(playback.keyframes, baseline.keyframes, `${mode} mode must retain original phase indices`);
  for (let index = 0; index < steps.length; index++) {
    for (const cycle of [0, 1, -1]) equal(playback.sample(timeAt(index, 0, cycle)), steps[index].pose, `${mode} mode must retain raw original anchor values`);
  }
  for (const correction of corrections) {
    for (const cycle of [0, 1, -1]) equal(playback.sample(timeAt(correction.segment, correction.at, cycle)), correction.pose, `${mode} mode must retain raw correction values`);
  }
}
for (const at of [.31, .51, .70]) {
  const blend = (at - correctionA.at) / (correctionB.at - correctionA.at);
  const pose = linearCorrections.sample(timeAt(1, at));
  positionProportion(pose, correctionA.pose, correctionB.pose, blend, 'A linear correction span must use its local elapsed-time fraction');
  const torsoTurn = rotationDistance(correctionA.pose.torsoQuaternion, correctionB.pose.torsoQuaternion);
  close(rotationDistance(correctionA.pose.torsoQuaternion, pose.torsoQuaternion), torsoTurn * blend, 'Torso rotation must follow the same linear correction-span timing', 1e-7);
  close(pose.limbs.left.elbowTwist, correctionA.pose.limbs.left.elbowTwist - .5 * blend, 'Wrapped elbow twist must follow linear time');
  close(pose.limbs.right.kneeTwist, correctionA.pose.limbs.right.kneeTwist + .2 * blend, 'Wrapped knee twist must follow linear time');
}
const angularSegment = steps.findIndex((step, index) => rotationDistance(step.pose.bodyQuaternion, steps[(index + 1) % steps.length].pose.bodyQuaternion) > .2);
check(angularSegment >= 0, 'The real saved sequence must exercise a substantial body rotation');
const angularStart = steps[angularSegment].pose.bodyQuaternion;
const totalTurn = rotationDistance(angularStart, steps[(angularSegment + 1) % steps.length].pose.bodyQuaternion);
let previousRotation = angularStart, maximumLinearAngularStepError = 0;
for (const fraction of [.25, .5, .75, 1]) {
  const rotation = linear.sample(timeAt(angularSegment, fraction)).bodyQuaternion;
  const stepError = Math.abs(rotationDistance(previousRotation, rotation) - totalTurn / 4);
  maximumLinearAngularStepError = Math.max(maximumLinearAngularStepError, stepError);
  close(rotationDistance(angularStart, rotation), totalTurn * fraction, 'Actual body rotation must advance proportionally through the shortest arc', 1e-7);
  close(stepError, 0, 'Equal time intervals must produce equal angular steps', 1e-7);
  previousRotation = rotation;
}
const linearMapContexts = [];
const linearMapped = createFlareSequence(steps, { period, corrections, interpolation: 'linear', mapTransition(pose, context) {
  linearMapContexts.push(context);return pose;
} });
equal(linearMapped.sample(0), steps[0].pose, 'Linear mapping must bypass exact original anchors');
equal(linearMapped.sample(timeAt(1, correctionA.at)), correctionA.pose, 'Linear mapping must bypass exact correction anchors');
equal(linearMapContexts.length, 0, 'Linear mapping must not run for saved values');
linearMapped.sample(timeAt(4, .37));
close(linearMapContexts[0].blend, .37, 'Mapping on an uncorrected linear segment must receive elapsed time');
equal(linearMapContexts[0].start, steps[4].pose, 'Linear mapping must receive the original span start');
equal(linearMapContexts[0].end, steps[5].pose, 'Linear mapping must receive the original span end');
equal(linearMapped.sample(timeAt(1, interior)), linearCorrections.sample(timeAt(1, interior)), 'An identity mapper must leave the linear interpolation untouched');
close(linearMapContexts[1].blend, (interior - correctionA.at) / (correctionB.at - correctionA.at), 'Mapping on a corrected linear segment must receive local elapsed time');
equal(linearMapContexts[1].start, correctionA.pose, 'Linear mapping must receive the local correction start');
equal(linearMapContexts[1].end, correctionB.pose, 'Linear mapping must receive the local correction end');
for (const interpolation of [null, false, 1, '', 'Smooth', 'linear ', 'cubic', {}, ['linear']]) {
  rejects(() => createFlareSequence(steps, { interpolation }), 'Unsupported time interpolation modes must be rejected');
}
equal(createFlareSequence(steps, { period, interpolation: undefined }).sample(.31), baseline.sample(.31), 'An omitted interpolation option must continue to select smooth mode');

const mutableSteps = structuredClone(steps), mutableCorrections = structuredClone(corrections);
const independent = createFlareSequence(mutableSteps, { period, corrections: mutableCorrections });
mutableSteps[0].pose.pelvis[0] = 999;
mutableCorrections[0].pose.pelvis[0] = 999;
independent.steps[0].pose.pelvis[0] = 999;
const mutableSample = independent.sample(timeAt(1, correctionA.at));
mutableSample.pelvis[0] = 999;
equal(independent.sample(0), steps[0].pose, 'Input and exposed step mutations must not alter private anchors');
equal(independent.sample(timeAt(1, correctionA.at)), correctionA.pose, 'Input and returned sample mutations must not alter private corrections');
const single = createFlareSequence([steps[0]], { period: 1, corrections: [{ id: 'single-correction', segment: 0, at: 0.5, pose: correctionA.pose }] });
equal(single.sample(0.5), correctionA.pose, 'A one-step loop must still support a correction on its wrapping span');
equal(JSON.stringify(steps), originalSteps, 'All source steps must remain byte exact');
equal(JSON.stringify(corrections), originalCorrections, 'Validation, sorting and sampling must not mutate input corrections');
equal(fs.readFileSync(sourceUrl, 'utf8'), sourceBytes, 'The formal saved loop asset must remain untouched');

console.log(JSON.stringify({ pass: true, checks, anchors: steps.length, corrections: corrections.length, unchangedSamples, source: 'public/coach/flare-sequence.json', maximumPositionJump, maximumAngleJump, mapTransitionVerified: true, interpolationModes: ['smooth', 'linear'], linearTimeSamples, maximumLinearPositionError, maximumLinearAngularStepError }, null, 2));
