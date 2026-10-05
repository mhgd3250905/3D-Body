import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createFlareSequence } from '../src/flare-sequence.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/playwright');
const fixturePath = path.join(output, 'keyframe-interpolation-fixture.json');
const beforePath = path.join(output, 'keyframe-interpolation-before.json');
const after = process.argv.includes('--after');
const stage = after ? 'after' : 'before';
const sides = ['left', 'right'];
const bones = sides.flatMap(side => ['UpperArm', 'Forearm', 'Thigh', 'Shin'].map(suffix => side + suffix));
const sourcePath = path.join(root, 'public/coach/flare-sequence.json');
const sourceBytes = await fs.readFile(sourcePath, 'utf8'), source = JSON.parse(sourceBytes);
const sourceOriginal = JSON.stringify(source);
const vector = values => new THREE.Vector3().fromArray(values);
const sha256 = text => createHash('sha256').update(text).digest('hex');
const frameInterval = .005;
await fs.mkdir(output, { recursive: true });
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, value) { this.type = type; Object.assign(this, value); } };
const bytes = await fs.readFile(path.join(root, 'public/coach/flare-coach.glb'));
const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const rigData = JSON.parse(await fs.readFile(path.join(root, 'public/coach/coach-rig.json'), 'utf8'));
const motion = createCoachMotion({ model, rigData });

function maximumDifference(a, b) {
  let maximum = 0;
  const visit = (x, y) => {
    if (typeof x === 'number' || typeof y === 'number') maximum = Math.max(maximum, typeof x === 'number' && typeof y === 'number' ? Math.abs(x - y) : Infinity);
    else if (x && y && typeof x === 'object' && typeof y === 'object') {
      if (Object.keys(x).length !== Object.keys(y).length) maximum = Infinity;
      for (const key of Object.keys(x)) visit(x[key], y[key]);
    } else if (x !== y) maximum = Infinity;
  };
  visit(a, b);return maximum;
}
function flexion(joints, side, arm) {
  const [root, middle, end] = arm ? ['Shoulder', 'Elbow', 'Wrist'] : ['Hip', 'Knee', 'Ankle'];
  const pivot = vector(joints[side + middle]);
  return 180 - vector(joints[side + root]).sub(pivot).angleTo(vector(joints[side + end]).sub(pivot)) * 180 / Math.PI;
}
function snapshot() {
  const metrics = motion.getMetrics();
  return {
    pose: motion.capturePose(), metrics,
    rotations: Object.fromEntries(bones.map(name => [name, model.getObjectByName(name).getWorldQuaternion(new THREE.Quaternion()).toArray()])),
  };
}
function delta(a, b) {
  const positions = Object.fromEntries(Object.keys(a.metrics.joints).map(name => [name, vector(a.metrics.joints[name]).distanceTo(vector(b.metrics.joints[name]))]));
  const rotations = Object.fromEntries(bones.map(name => [name, new THREE.Quaternion().fromArray(a.rotations[name]).angleTo(new THREE.Quaternion().fromArray(b.rotations[name])) * 180 / Math.PI]));
  return { positions, rotations, maximumPosition: Math.max(...Object.values(positions)), maximumRotation: Math.max(...Object.values(rotations)) };
}
function editableCorrection(segment, at, suffix) {
  motion.setSequence(source.steps, { period: source.period, legPath: 'arc', interpolation: 'linear' });
  motion.update(segment + at);
  const metrics = motion.getMetrics();
  const freeSide = sides.find(side => !metrics.supports[side]) ?? 'left';
  motion.editHandle(freeSide + 'Elbow', { position: vector(metrics.joints[freeSide + 'Elbow']).add(new THREE.Vector3(.04, .03, -.025)).toArray() });
  const current = motion.getMetrics();
  motion.editHandle(freeSide + 'Knee', { position: vector(current.joints[freeSide + 'Knee']).add(new THREE.Vector3(-.04, .015, .04)).toArray() });
  return { id: 'regression-k-' + suffix, segment, at, pose: motion.capturePose() };
}
function parallelKneeCorrection() {
  motion.setSequence(source.steps, { period: source.period, legPath: 'arc', interpolation: 'linear' });
  motion.update(.42);const pose = motion.capturePose(), metrics = motion.getMetrics();
  for (const side of sides) pose.limbs[side].kneePole = vector(metrics.joints[side + 'Hip']).lerp(vector(pose.limbs[side].ankle), .5).toArray();
  motion.applyPose(pose);
  return { id: 'parallel-knee-K', segment: 0, at: .42, pose: motion.capturePose() };
}
function oppositePolePair(nearStraight) {
  motion.reset();const neutral = motion.capturePose();neutral.groundLock = false;
  for (const side of sides) neutral.limbs[side].handLocked = false;
  motion.applyPose(neutral);const metrics = motion.getMetrics();
  const a = structuredClone(neutral), b = structuredClone(neutral);
  for (const side of sides) {
    for (const arm of [true, false]) {
      const rootName = arm ? 'Shoulder' : 'Hip', endName = arm ? 'Wrist' : 'Ankle';
      const root = vector(metrics.joints[side + rootName]);
      const direction = vector(metrics.joints[side + endName]).sub(root).normalize();
      if (nearStraight) direction.negate();
      const basis = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]
        .sort((x, y) => Math.abs(x.dot(direction)) - Math.abs(y.dot(direction)))[0];
      const bend = basis.addScaledVector(direction, -basis.dot(direction)).normalize();
      const length = metrics.expectedLengths[side + (arm ? 'UpperArm' : 'Thigh')] + metrics.expectedLengths[side + (arm ? 'Forearm' : 'Shin')];
      const radius = nearStraight ? length - 2e-7 : length * .85;
      const end = root.clone().addScaledVector(direction, radius);
      const pole = arm ? 'elbowPole' : 'kneePole', endpoint = arm ? 'wrist' : 'ankle';
      a.limbs[side][endpoint] = end.toArray();b.limbs[side][endpoint] = end.toArray();
      a.limbs[side][pole] = root.clone().addScaledVector(direction, length * .45).addScaledVector(bend, .08).toArray();
      b.limbs[side][pole] = root.clone().addScaledVector(direction, length * .45).addScaledVector(bend, -.08).toArray();
    }
  }
  const start = motion.applyPose(a), end = motion.applyPose(b);
  return [
    { id: 'mechanical-start', phase: 'front', pose: start },
    { id: 'mechanical-end', phase: 'sideA', pose: end },
  ];
}

let fixture;
if (after) {
  fixture = JSON.parse(await fs.readFile(fixturePath, 'utf8'));
  assert.equal(fixture.sourceSha256, sha256(sourceBytes), 'The formal source changed since the before measurement');
} else {
  fixture = {
    format: 'keyframe-interpolation-regression', version: 1, sourceSha256: sha256(sourceBytes),
    explanation: 'Original nine poses are copied unchanged. Extra K poses come from the real editor API. Mechanical opposite-pole cases are separate legal Snow reachability fixtures and do not describe a fault in the user poses.',
    scenarios: [
      { id: 'formal-nine', period: source.period, steps: structuredClone(source.steps), corrections: [] },
      { id: 'formal-nine-with-k', period: source.period, steps: structuredClone(source.steps), corrections: [editableCorrection(0, .43, 'a'), editableCorrection(2, .61, 'b')] },
      { id: 'formal-nine-with-parallel-k', period: source.period, steps: structuredClone(source.steps), corrections: [parallelKneeCorrection()] },
      { id: 'bent-opposite-poles', period: 2, steps: oppositePolePair(false), corrections: [], probes: [.5, 1.5] },
      { id: 'near-straight-opposite-poles', period: 2, steps: oppositePolePair(true), corrections: [], probes: [.5, 1.5] },
    ],
  };
  await fs.writeFile(fixturePath, JSON.stringify(fixture, null, 2));
}
const fixtureBytes = JSON.stringify(fixture);
const results = [], failures = [];
let totalSamples = 0;
const extraOption = process.argv.find(argument => argument.startsWith('--pose-option='));
const extra = extraOption ? (() => {
  const [key, value] = extraOption.slice('--pose-option='.length).split(':');
  if (!key || !value) throw new Error('Use --pose-option=optionName:optionValue');
  return { [key]: value };
})() : {};

for (const scenario of fixture.scenarios) {
  for (const legPath of ['linear', 'arc']) for (const interpolation of ['linear', 'smooth']) {
    const options = { period: scenario.period, corrections: scenario.corrections, legPath, interpolation, ...extra };
    const result = {
      scenario: scenario.id, options, maximumLengthError: 0, maximumSupportDrift: 0, minimumShoeHeight: Infinity,
      maximumFramePositionStep: 0, maximumFrameRotationStepDegrees: 0, worstFrame: null,
      maximumAnchorPoseDifference: 0, maximumAnchorRotationDifferenceDegrees: 0,
      kneeFlexionDegrees: { minimum: Infinity, maximum: 0 }, elbowFlexionDegrees: { minimum: Infinity, maximum: 0 },
      boundaryProbes: [], maximumNearAnchorRotationDegrees: 0, maximumNearAnchorPosition: 0,
      rawAnchorsExact: true, supportFlagsExact: true, warnings: 0,
    };
    try {
      const anchors = scenario.steps.map((step, index) => ({ time: index * scenario.period / scenario.steps.length, pose: step.pose }));
      anchors.push(...scenario.corrections.map(point => ({ time: (point.segment + point.at) * scenario.period / scenario.steps.length, pose: point.pose })));
      const requested = createFlareSequence(scenario.steps, { period: scenario.period, corrections: scenario.corrections, interpolation });
      for (const anchor of anchors) {
        assert.deepEqual(requested.sample(anchor.time), anchor.pose);
        motion.applyPose(anchor.pose);const direct = snapshot();
        motion.setSequence(scenario.steps, options);motion.update(anchor.time);const played = snapshot();
        result.maximumAnchorPoseDifference = Math.max(result.maximumAnchorPoseDifference, maximumDifference(direct.pose, played.pose));
        result.maximumAnchorRotationDifferenceDegrees = Math.max(result.maximumAnchorRotationDifferenceDegrees, delta(direct, played).maximumRotation);
      }
      assert.ok(result.maximumAnchorPoseDifference < 1e-8, 'Playback anchor differs from directly applying its saved pose');
      assert.ok(result.maximumAnchorRotationDifferenceDegrees < 1e-4, 'Playback anchor bone rotations differ from directly applying its saved pose');
      motion.setSequence(scenario.steps, options);
      const count = Math.round(scenario.period / frameInterval);
      let previous = null;
      for (let index = 0; index <= count; index++) {
        const time = index * frameInterval;motion.update(time);const current = snapshot(), metrics = current.metrics;
        totalSamples++;
        for (const [name, length] of Object.entries(metrics.segmentLengths)) result.maximumLengthError = Math.max(result.maximumLengthError, Math.abs(length - metrics.expectedLengths[name]));
        for (const value of Object.values(metrics.supportDrift)) if (value != null) result.maximumSupportDrift = Math.max(result.maximumSupportDrift, value);
        result.minimumShoeHeight = Math.min(result.minimumShoeHeight, metrics.minFootHeight);
        const reference = requested.sample(time);
        for (const side of sides) {
          if (metrics.supports[side] !== reference.limbs[side].handLocked) result.supportFlagsExact = false;
          for (const arm of [true, false]) {
            const degrees = flexion(metrics.joints, side, arm), target = arm ? result.elbowFlexionDegrees : result.kneeFlexionDegrees;
            target.minimum = Math.min(target.minimum, degrees);target.maximum = Math.max(target.maximum, degrees);
          }
        }
        for (const values of Object.values(metrics.joints)) assert.ok(values.every(Number.isFinite), 'A joint became non-finite');
        for (const values of Object.values(current.rotations)) assert.ok(values.every(Number.isFinite), 'A bone rotation became non-finite');
        if (metrics.groundLock) assert.ok(metrics.minFootHeight >= -1e-6, 'A grounded shoe crossed the floor');
        result.warnings += metrics.warnings.length;
        if (previous) {
          const change = delta(previous, current);
          result.maximumFramePositionStep = Math.max(result.maximumFramePositionStep, change.maximumPosition);
          if (change.maximumRotation > result.maximumFrameRotationStepDegrees) { result.maximumFrameRotationStepDegrees = change.maximumRotation;result.worstFrame = { time, ...change }; }
        }
        previous = current;
      }
      assert.ok(result.maximumLengthError < 1e-6, 'Authored bone lengths changed');
      assert.ok(result.maximumSupportDrift < 1e-6, 'A locked hand moved off its saved anchor');
      assert.equal(result.supportFlagsExact, true, 'Support flags no longer match the saved span endpoints');
      for (const boundary of [...anchors.map(anchor => anchor.time), ...(scenario.probes ?? [])]) {
        for (const epsilon of [1e-3, 1e-5, 1e-7]) {
          motion.update(boundary - epsilon);const left = snapshot();motion.update(boundary);const exact = snapshot();motion.update(boundary + epsilon);const right = snapshot();
          const incoming = delta(left, exact), outgoing = delta(exact, right);
          const maximumRotation = Math.max(incoming.maximumRotation, outgoing.maximumRotation);
          const maximumPosition = Math.max(incoming.maximumPosition, outgoing.maximumPosition);
          result.boundaryProbes.push({ time: boundary, epsilon, maximumRotationDegrees: maximumRotation, maximumPosition, incoming, outgoing });
          if (epsilon === 1e-7 && anchors.some(anchor => anchor.time === boundary)) {
            result.maximumNearAnchorRotationDegrees = Math.max(result.maximumNearAnchorRotationDegrees, maximumRotation);
            result.maximumNearAnchorPosition = Math.max(result.maximumNearAnchorPosition, maximumPosition);
          }
        }
      }
    } catch (error) { failures.push({ scenario: scenario.id, options, message: error.message }); }
    results.push(result);
  }
}
assert.equal(JSON.stringify(fixture), fixtureBytes, 'Regression poses were mutated');
assert.equal(JSON.stringify(source), sourceOriginal, 'Original formal poses were mutated');
assert.equal(await fs.readFile(sourcePath, 'utf8'), sourceBytes, 'The original formal JSON changed');
const comparison = [];
if (after) {
  const before = JSON.parse(await fs.readFile(beforePath, 'utf8'));
  for (const result of results) {
    const previous = before.results.find(item => item.scenario === result.scenario && item.options.legPath === result.options.legPath && item.options.interpolation === result.options.interpolation);
    comparison.push({ scenario: result.scenario, legPath: result.options.legPath, interpolation: result.options.interpolation,
      beforeFrameRotationDegrees: previous.maximumFrameRotationStepDegrees, afterFrameRotationDegrees: result.maximumFrameRotationStepDegrees,
      beforeNearAnchorRotationDegrees: previous.maximumNearAnchorRotationDegrees, afterNearAnchorRotationDegrees: result.maximumNearAnchorRotationDegrees,
      beforeNearAnchorPosition: previous.maximumNearAnchorPosition, afterNearAnchorPosition: result.maximumNearAnchorPosition });
    try {
      if (result.options.legPath === 'linear') {
        assert.ok(Math.abs(previous.maximumFrameRotationStepDegrees - result.maximumFrameRotationStepDegrees) < 1e-4, 'The legacy linear path changed its bone rotation behavior');
        assert.ok(Math.abs(previous.maximumFramePositionStep - result.maximumFramePositionStep) < 1e-8, 'The legacy linear path changed its joint position behavior');
        for (let index = 0; index < result.boundaryProbes.length; index++) {
          assert.ok(Math.abs(previous.boundaryProbes[index].maximumRotationDegrees - result.boundaryProbes[index].maximumRotationDegrees) < 1e-4, 'The legacy linear path changed at a saved boundary');
          assert.ok(Math.abs(previous.boundaryProbes[index].maximumPosition - result.boundaryProbes[index].maximumPosition) < 1e-8, 'The legacy linear path changed its boundary positions');
        }
      }
      if (result.options.legPath === 'arc' && result.scenario === 'bent-opposite-poles') {
        assert.ok(result.maximumFrameRotationStepDegrees < previous.maximumFrameRotationStepDegrees * .25, 'Opposite bend planes still produce a large forearm rotation spike');
      }
      if (result.options.legPath === 'arc' && result.scenario === 'formal-nine-with-parallel-k') {
        const coarse = result.boundaryProbes.find(probe => probe.time === .42 && probe.epsilon === 1e-3);
        const fine = result.boundaryProbes.find(probe => probe.time === .42 && probe.epsilon === 1e-5);
        const tiny = result.boundaryProbes.find(probe => probe.time === .42 && probe.epsilon === 1e-7);
        assert.ok(tiny.maximumRotationDegrees < .001, 'The exact K pose still has a fixed bone rotation gap beside it');
        assert.ok(tiny.maximumPosition < 1e-6, 'The exact K pose still has a fixed joint position gap beside it');
        assert.ok(fine.maximumRotationDegrees < coarse.maximumRotationDegrees * .1 + 1e-5 && tiny.maximumRotationDegrees < fine.maximumRotationDegrees * .1 + 1e-5, 'K-frame rotation probes do not converge as the time gap shrinks');
      }
    } catch (error) { failures.push({ scenario: result.scenario, options: result.options, message: error.message }); }
  }
}
const engineHashes = {};
for (const relative of ['src/coach-motion.js', 'src/limb-arc.js', 'src/flare-sequence.js']) engineHashes[relative] = sha256(await fs.readFile(path.join(root, relative), 'utf8'));
const report = { pass: failures.length === 0, stage, sourceSha256: sha256(sourceBytes), fixture: fixturePath, engineHashes, frameInterval, totalSamples, failures, results, comparison,
  scope: 'Actual Snow deform bones and original nine anchors, legal editor-created K poses, opposite bend poles and near-straight arm/leg fixtures. Before reports measure defects without judging user poses; direct applyPose equivalence, original data, fixed lengths, saved support flags and floor locks are always checked.' };
const reportPath = path.join(output, 'keyframe-interpolation-' + stage + '.json');
await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, stage, totalSamples, failures, report: reportPath,
  results: results.map(result => ({ scenario: result.scenario, legPath: result.options.legPath, interpolation: result.options.interpolation,
    frameRotationDegrees: result.maximumFrameRotationStepDegrees, nearAnchorRotationDegrees: result.maximumNearAnchorRotationDegrees,
    nearAnchorPosition: result.maximumNearAnchorPosition, anchorPoseDifference: result.maximumAnchorPoseDifference,
    minimumElbowFlexion: result.elbowFlexionDegrees.minimum, minimumKneeFlexion: result.kneeFlexionDegrees.minimum })), comparison }, null, 2));
if (!report.pass) process.exitCode = 1;
