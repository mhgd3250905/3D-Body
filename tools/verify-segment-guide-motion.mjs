import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';

// Decode the existing local Snow skin. This check never opens a browser or
// touches the user's storage, editable model, or original posture exports.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, value) { this.type = type;Object.assign(this, value); } };
const raw = await fs.readFile(new URL('../public/coach/flare-coach.glb', import.meta.url));
const { scene: model } = await new GLTFLoader().parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
const rigData = JSON.parse(await fs.readFile(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const sourceBytes = await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8');
const source = JSON.parse(sourceBytes), sourceSnapshot = structuredClone(source);
const motion = createCoachMotion({ model, rigData });
const vector = array => new THREE.Vector3().fromArray(array);
const rotation = array => new THREE.Quaternion().fromArray(array);
const bones = [];model.traverse(object => { if (object.isBone) bones.push(object); });
const checks = [], segments = [], probes = [];
const output = new URL('../output/segment-guide-motion/', import.meta.url);
let maximumBoneLengthError = 0, maximumReplayError = 0, maximumEndpointAngle = 0, maximumStepAngle = 0;
function check(name, pass, detail) {
  checks.push({ name, pass: Boolean(pass), ...(detail === undefined ? {} : { detail }) });assert.ok(pass, name);
}
function state() {
  const metrics = motion.getMetrics();
  return { pose: motion.capturePose(), time: metrics.time, mode: metrics.mode, warnings: metrics.warnings,
    matrices: bones.map(bone => [...bone.matrixWorld.elements]), scales: bones.map(bone => bone.scale.toArray()) };
}
function liveFrame(time) {
  motion.update(time);const metrics = motion.getMetrics();
  return { time, pose: motion.capturePose(), joints: metrics.joints,
    boneRotations: Object.fromEntries(bones.map(bone => [bone.name, bone.quaternion.toArray()])) };
}
function guide(from, to, extra = {}) {
  return { id: `guide-${from}-${to}`, from: { kind: 'step', id: source.steps[from].id },
    to: { kind: 'step', id: source.steps[to].id }, timing: 'linear', bends: {}, bendAngles: {}, ...extra };
}
function sample(time, options = {}) {
  return motion.sampleTrajectory({ startTime: time, endTime: time, samples: 2, includeBoneRotations: true, ...options }).frames[0];
}
function physical(metrics) {
  for (const [key, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[key]);maximumBoneLengthError = Math.max(maximumBoneLengthError, error);
    assert.ok(error < 1e-9, key + ' has its real bone length');
  }
  for (const drift of Object.values(metrics.supportDrift)) if (drift !== null) assert.ok(drift < 1e-7);
  assert.ok(!metrics.groundLock || metrics.minFootHeight >= .006 - 1e-7);
  for (const point of Object.values(metrics.joints)) assert.ok(point.every(Number.isFinite));
}
let failure;
try {
  motion.setSequence(source.steps, { period: source.period });
  const frozen = JSON.parse(await fs.readFile(new URL('before-guides.json', output), 'utf8'));
  const legacy = frozen.times.map(liveFrame);
  check('Twenty frozen no-guide poses, joints and visible bone rotations remain exact', JSON.stringify(legacy) === JSON.stringify(frozen.samples));
  check('An explicit empty guide override uses the legacy route', JSON.stringify(sample(.437, { segmentGuides: [] })) === JSON.stringify(sample(.437)));

  for (const [from, to] of [[0, 1], [1, 2]]) {
    const active = guide(from, to), epsilon = 1e-6;
    motion.setSequence(source.steps, { period: source.period, segmentGuides: [active] });
    check(`${from + 9}→${to + 9}: exact saved endpoints stay raw`,
      JSON.stringify(motion.samplePose(from)) === JSON.stringify(source.steps[from].pose) &&
      JSON.stringify(motion.samplePose(to)) === JSON.stringify(source.steps[to].pose));
    const frames = motion.sampleTrajectory({ startTime: from, endTime: to, samples: 65, includeBoneRotations: true }).frames;
    const endpointAngles = [], increments = [];
    for (const [time, near] of [[from, from + epsilon], [to, to - epsilon]]) {
      const endpoint = sample(time), nearby = sample(near);
      for (const bone of Object.keys(endpoint.boneRotations)) {
        const angle = rotation(endpoint.boneRotations[bone]).angleTo(rotation(nearby.boneRotations[bone]));
        maximumEndpointAngle = Math.max(maximumEndpointAngle, angle);endpointAngles.push({ bone, time, angle });
      }
    }
    for (let index = 1; index < frames.length; index++) for (const bone of Object.keys(frames[index].boneRotations)) {
      const angle = rotation(frames[index - 1].boneRotations[bone]).angleTo(rotation(frames[index].boneRotations[bone]));
      maximumStepAngle = Math.max(maximumStepAngle, angle);increments.push({ bone, time: frames[index].time, angle });
    }
    const maximum = Math.max(...increments.map(item => item.angle));
    check(`${from + 9}→${to + 9}: epsilon bone orientation approaches each saved endpoint`, Math.max(...endpointAngles.map(item => item.angle)) < .02, endpointAngles.sort((a, b) => b.angle - a.angle).slice(0, 4));
    check(`${from + 9}→${to + 9}: 65 actual IK frames have no half-turn roll jump`, maximum < .65, increments.sort((a, b) => b.angle - a.angle).slice(0, 4));
    segments.push({ from: from + 9, to: to + 9, samples: frames.length, maximumAdjacentBoneAngle: maximum,
      maximumEndpointAngle: Math.max(...endpointAngles.map(item => item.angle)) });
    motion.update(4.317);const snapshot = state();
    const times = [.9371, .1431, .5217, .7913, .2919, .0103, .9981].map(value => from + value);
    const forward = times.map(time => sample(time)), reverse = [...times].reverse().map(time => sample(time)).reverse();
    check(`${from + 9}→${to + 9}: random-time sampling is order-independent and leaves live state untouched`,
      JSON.stringify(forward) === JSON.stringify(reverse) && JSON.stringify(state()) === JSON.stringify(snapshot));
    for (const frame of frames) {
      const purePose = motion.samplePose(frame.time);
      motion.applyPose(purePose);const metrics = motion.getMetrics();physical(metrics);
      for (const [joint, goal] of Object.entries(frame.joints)) {
        const error = vector(metrics.joints[joint]).distanceTo(vector(goal));maximumReplayError = Math.max(maximumReplayError, error);
        assert.ok(error < 1e-9, 'Pure guided sample replays ' + joint);
      }
      const replayRotations = Object.fromEntries(bones.map(bone => [bone.name, bone.quaternion.toArray()]));
      motion.update(frame.time);physical(motion.getMetrics());
      for (const bone of bones) assert.ok(rotation(replayRotations[bone.name]).angleTo(bone.quaternion) < 1e-7);
    }
    check(`${from + 9}→${to + 9}: all actual frames preserve bone lengths, floor, support and replayed skin orientation`, true);
    const middle = motion.samplePose((from + to) / 2);
    check(`${from + 9}→${to + 9}: guided skin rotation is stored in replayable twist fields`, ['left', 'right'].every(side =>
      ['upperArmTwist', 'elbowTwist', 'thighTwist', 'kneeTwist'].every(key => Number.isFinite(middle.limbs[side][key]))));
    const beforeTwist = state();const invalid = structuredClone(middle);invalid.limbs.left.upperArmTwist = NaN;
    assert.throws(() => motion.applyPose(invalid));check('Invalid added twist fails before live mutation', JSON.stringify(beforeTwist) === JSON.stringify(state()));
  }

  const zeroGuide = guide(0, 1), offsetGuide = guide(0, 1, { bends: { pelvis: [.01, -.01, .015],
    leftAnkle: [.015, .02, 0], rightAnkle: [0, .02, .01], leftWrist: [.008, .01, -.005], rightWrist: [2, 2, 2] },
    bendAngles: { leftKnee: .6, rightKnee: -.4, leftElbow: .3, rightElbow: -.2 } });
  motion.setSequence(source.steps, { period: source.period, segmentGuides: [offsetGuide] });
  const midpoint = sample(.5), zero = sample(.5, { segmentGuides: [zeroGuide] });
  check('Offsets and elbow/knee controls affect the actual complete IK pose', Object.entries(midpoint.joints).some(([joint, values]) =>
    vector(values).distanceTo(vector(zero.joints[joint])) > .005));
  check('Both-end support wrist rejects route movement and reports it', !Object.hasOwn(midpoint.guideTargets, 'rightWrist') &&
    vector(midpoint.joints.rightWrist).distanceTo(vector(zero.joints.rightWrist)) < 1e-7 &&
    midpoint.diagnostics.warnings.some(warning => warning.includes('支撑手')));
  check('Pelvis and both ankle targets plus free wrist have measured residuals',
    ['pelvis', 'leftAnkle', 'rightAnkle', 'leftWrist'].every(joint => midpoint.guideTargets[joint] &&
      Math.abs(midpoint.diagnostics.goalErrors[joint] - vector(midpoint.guideTargets[joint]).distanceTo(vector(midpoint.joints[joint]))) < 1e-10));
  motion.applyPose(motion.samplePose(.5));physical(motion.getMetrics());
  probes.push({ name: 'offset midpoint', goalErrors: midpoint.diagnostics.goalErrors, warnings: midpoint.diagnostics.warnings });

  const limitedGuide = guide(1, 2, { bends: { pelvis: [2, -3, 2], leftAnkle: [3, -3, 0], rightAnkle: [-3, -3, 0] } });
  motion.setSequence(source.steps, { period: source.period, segmentGuides: [limitedGuide] });
  const limited = sample(1.5);motion.applyPose(motion.samplePose(1.5));physical(motion.getMetrics());
  check('Unreachable goals are visibly projected with honest measured residuals',
    limited.diagnostics.goalErrors.pelvis > 1 && limited.diagnostics.goalErrors.leftAnkle > 1 && limited.diagnostics.warnings.length > 0);
  probes.push({ name: 'limited midpoint', goalErrors: limited.diagnostics.goalErrors, warnings: limited.diagnostics.warnings });

  const curve = { id: 'existing-foot-route', side: 'left', from: zeroGuide.from, to: zeroGuide.to, bend: [.01, .025, -.02] };
  motion.setSequence(source.steps, { period: source.period, footCurves: [curve], segmentGuides: [zeroGuide] });
  const withCurve = sample(.5), withoutCurve = sample(.5, { footCurves: [] });
  check('Old foot curves remain upstream goals and guided bend planes follow their actual endpoint', withCurve.curveTargets?.left &&
    vector(withCurve.joints.leftAnkle).distanceTo(vector(withoutCurve.joints.leftAnkle)) > .005 &&
    Number.isFinite(withCurve.boneRotations.leftThigh[0]));
  const unreachableCurve = { ...curve, bend: [.8, -.8, .8] };
  const smallOffset = { ...zeroGuide, bends: { leftAnkle: [.003, .007, -.004] } };
  const curveBaseline = sample(.5, { segmentGuides: [], footCurves: [unreachableCurve] });
  const actualBaselineGuide = sample(.5, { segmentGuides: [smallOffset], footCurves: [unreachableCurve] });
  check('A new handle offsets the actual old path even when its legacy target was unreachable',
    vector(actualBaselineGuide.guideTargets.leftAnkle).distanceTo(vector(curveBaseline.joints.leftAnkle)
      .add(vector(smallOffset.bends.leftAnkle))) < 1e-10 &&
    vector(actualBaselineGuide.guideTargets.leftAnkle).distanceTo(vector(actualBaselineGuide.curveTargets.left)) > .1);
  check('Explicit empty guides clear the route rather than reusing cached guide poses', JSON.stringify(sample(.5, { segmentGuides: [] })) ===
    JSON.stringify(sample(.5, { segmentGuides: [], footCurves: [curve] })) && !sample(.5, { segmentGuides: [] }).guideTargets);

  const activePoint = { id: 'segment-guide-existing-K', segment: 0, at: .4, pose: motion.samplePose(.4, { segmentGuides: [] }) };
  const pointGuide = { ...guide(0, 1), id: 'K-to-10-guide', from: { kind: 'point', id: activePoint.id } };
  motion.setSequence(source.steps, { period: source.period, corrections: [activePoint], segmentGuides: [pointGuide] });
  check('Existing K endpoints remain raw and the guide applies only on their active adjacent span',
    JSON.stringify(motion.samplePose(.4)) === JSON.stringify(activePoint.pose) && !sample(.2).guideTargets &&
    sample(.7).guideTargets && motion.getSegmentGuideAt(.7).span.from.id === activePoint.id);
  motion.setSequence(source.steps, { period: source.period, corrections: [activePoint], segmentGuides: [zeroGuide] });
  check('A nonadjacent guide becomes dormant without deleting or bypassing the inserted K', !sample(.2).guideTargets && !sample(.7).guideTargets);
  motion.setSequence(source.steps, { period: source.period, skippedSteps: [1], segmentGuides: [guide(0, 2)] });
  check('A guide spans skipped originals while preserving their raw saved poses', sample(1).guideTargets &&
    JSON.stringify(source) === JSON.stringify(sourceSnapshot));
  const wrapGuide = guide(8, 0, { bends: { leftAnkle: [0, .02, 0] } });
  motion.setSequence(source.steps, { period: source.period, segmentGuides: [wrapGuide] });
  check('Closing repeated 09 span and negative-time loop sampling stay equivalent', sample(8.5).guideTargets &&
    JSON.stringify(sample(8.5).joints) === JSON.stringify(sample(-.5).joints) &&
    JSON.stringify(motion.samplePose(0)) === JSON.stringify(source.steps[0].pose));
  const allGuides = source.steps.map((step, index) => guide(index, (index + 1) % source.steps.length, { timing: 'smooth' }));
  motion.setSequence(source.steps, { period: source.period, segmentGuides: allGuides });
  let allCycleMaximum = 0;
  for (let segment = 0; segment < source.steps.length; segment++) {
    const frames = motion.sampleTrajectory({ startTime: segment, endTime: segment + 1, samples: 33, includeBoneRotations: true }).frames;
    for (let index = 1; index < frames.length; index++) for (const bone of Object.keys(frames[index].boneRotations)) {
      allCycleMaximum = Math.max(allCycleMaximum, rotation(frames[index - 1].boneRotations[bone])
        .angleTo(rotation(frames[index].boneRotations[bone])));
    }
    for (const frame of frames) { motion.applyPose(motion.samplePose(frame.time));physical(motion.getMetrics()); }
  }
  check('All nine smooth spans preserve real constraints without sampled half-turn bone jumps', allCycleMaximum < 1, allCycleMaximum);
  check('Source posture files and all supplied guide fixtures remain unchanged',
    JSON.stringify(source) === JSON.stringify(sourceSnapshot) && sourceBytes === await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8'));
} catch (error) { failure = error; }
await fs.mkdir(output, { recursive: true });
const report = { checks, count: checks.length, passed: checks.filter(check => check.pass).length,
  sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'), segments, probes,
  maximumBoneLengthError, maximumReplayError, maximumEndpointAngle, maximumStepAngle,
  ...(failure ? { failure: { message: failure.message, stack: failure.stack } } : {}) };
await fs.writeFile(new URL('verification.json', output), JSON.stringify(report, null, 2));
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
if (failure) throw failure;
