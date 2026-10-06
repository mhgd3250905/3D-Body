import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { evaluateSegmentArc } from '../src/segment-guides.js';

// All checks use a separate in-memory copy of the existing local Snow GLB.
// No browser, user storage, editable asset or before-guide fixture is changed.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
const bytes = await fs.readFile(new URL('../public/coach/flare-coach.glb', import.meta.url));
const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const rigData = JSON.parse(await fs.readFile(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const sourceBytes = await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8');
const source = JSON.parse(sourceBytes), original = structuredClone(source);
const beforeUrl = new URL('../output/segment-guide-motion/before-smooth-paths.json', import.meta.url);
const oldFixtureBytes = await fs.readFile(beforeUrl, 'utf8'), oldFixture = JSON.parse(oldFixtureBytes);
const beforeGuidesUrl = new URL('../output/segment-guide-motion/before-guides.json', import.meta.url);
const beforeGuidesBytes = await fs.readFile(beforeGuidesUrl, 'utf8');
const motion = createCoachMotion({ model, rigData });
const vector = values => new THREE.Vector3().fromArray(values);
const quaternion = values => new THREE.Quaternion().fromArray(values);
const bones = [];model.traverse(object => { if (object.isBone) bones.push(object); });
const checks = [], routes = [];
let maximumBoneLengthError = 0, maximumReplayError = 0, maximumBoneAngle = 0;
const options = { period: source.period, interpolation: 'linear', corrections: [], skippedSteps: [], footCurves: [], segmentGuides: [] };
const baseGuide = { id: 'smooth-09-10-fixture', from: { kind: 'step', id: source.steps[0].id },
  to: { kind: 'step', id: source.steps[1].id }, timing: 'linear', bends: {}, bendAngles: {} };
function check(name, pass, detail) {
  checks.push({ name, pass: Boolean(pass), ...(detail === undefined ? {} : { detail }) });assert.ok(pass, name);
}
function frameAt(time, override = {}) {
  return motion.sampleTrajectory({ startTime: time, endTime: time, samples: 2, includeBoneRotations: true, ...override }).frames[0];
}
function frames(override = {}) {
  return motion.sampleTrajectory({ startTime: 0, endTime: 1, samples: 33, includeBoneRotations: true, ...override }).frames;
}
function state() {
  const metrics = motion.getMetrics();
  return { pose: motion.capturePose(), time: metrics.time, mode: metrics.mode, warnings: metrics.warnings,
    matrices: bones.map(bone => [...bone.matrixWorld.elements]), scales: bones.map(bone => bone.scale.toArray()) };
}
function turns(samples, joint = 'rightAnkle') {
  return samples.slice(1, -1).map((frame, index) => vector(frame.joints[joint]).sub(vector(samples[index].joints[joint]))
    .angleTo(vector(samples[index + 2].joints[joint]).sub(vector(frame.joints[joint]))) * 180 / Math.PI);
}
function physical(metrics) {
  for (const [key, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[key]);maximumBoneLengthError = Math.max(maximumBoneLengthError, error);
    assert.ok(error < 1e-9, key + ' preserves its original length');
  }
  for (const drift of Object.values(metrics.supportDrift)) if (drift !== null) assert.ok(drift < 1e-7);
  assert.ok(!metrics.groundLock || metrics.minFootHeight >= .006 - 1e-7);
  for (const position of Object.values(metrics.joints)) assert.ok(position.every(Number.isFinite));
}
function withoutGeneratedLegRoll(samples) {
  const result = structuredClone(samples);
  for (const sample of result) for (const side of ['left', 'right']) {
    for (const field of ['thighTwist', 'kneeTwist']) delete sample.pose.limbs[side][field];
    for (const bone of ['Thigh', 'Shin', 'Patella']) delete sample.frame.boneRotations[side + bone];
  }
  return result;
}
let failure;
try {
  motion.setSequence(source.steps, oldFixture.options);
  const unchanged = oldFixture.times.map(time => ({ time, pose: motion.samplePose(time), frame: frameAt(time) }));
  // The frozen sample includes the generated leg roll intentionally corrected
  // by the hip repair. Keep all route geometry and non-leg rotations exact;
  // actual new leg frames, replay and endpoint continuity are checked below.
  check('Nine frozen guide routes, joints, diagnostics and non-leg rotations remain exact after the hip-roll fix',
    JSON.stringify(withoutGeneratedLegRoll(unchanged)) === JSON.stringify(withoutGeneratedLegRoll(oldFixture.frames)));

  motion.setSequence(source.steps, options);
  const baseline = frames(), start = baseline[0].joints.rightAnkle, end = baseline.at(-1).joints.rightAnkle;
  const chordMidpoint = vector(start).lerp(vector(end), .5), oldMidpoint = vector(baseline[16].joints.rightAnkle);
  const seededMidpoint = oldMidpoint.clone().setY(chordMidpoint.y + .08);
  const seededBend = seededMidpoint.clone().sub(chordMidpoint).toArray();
  const smoothGuide = { ...structuredClone(baseGuide), smoothPaths: { rightAnkle: { bend: seededBend } } };
  const smoothBytes = JSON.stringify(smoothGuide);
  motion.setSequence(source.steps, { ...options, segmentGuides: [smoothGuide] });
  const smooth = frames(), oldTurn = Math.max(...turns(baseline)), newTurn = Math.max(...turns(smooth));
  let maximumTargetError = 0;
  for (const frame of smooth.slice(1, -1)) {
    const expected = evaluateSegmentArc(start, end, seededBend, frame.time);
    assert.ok(vector(frame.guideTargets.rightAnkle).distanceTo(vector(expected)) < 1e-10);
    maximumTargetError = Math.max(maximumTargetError, frame.diagnostics.goalErrors.rightAnkle);
  }
  check('A seeded explicit arc replaces the old clipped route with a reachable smooth goal', maximumTargetError < 1e-8 && newTurn < 12 && newTurn < oldTurn / 3,
    { baselineMaximumTurnDegrees: oldTurn, smoothMaximumTurnDegrees: newTurn, maximumTargetError, midpoint: seededMidpoint.toArray() });
  check('Exact original 09 and 10 poses plus all other original frames remain raw', source.steps.every((step, index) =>
    JSON.stringify(motion.samplePose(index)) === JSON.stringify(step.pose)));
  check('The arc handle is exactly the desired midpoint rather than an offset on the old route',
    vector(smooth[16].guideTargets.rightAnkle).distanceTo(seededMidpoint) < 1e-12);
  const zeroGuide = frames({ segmentGuides: [baseGuide] });
  const untouched = Object.keys(zeroGuide[16].joints).filter(joint => !['rightAnkle', 'rightKnee', 'rightToe'].includes(joint));
  check('Redrawing one foot preserves every other joint position and the common support hand', smooth.every((frame, index) =>
    untouched.every(joint => vector(frame.joints[joint]).distanceTo(vector(zeroGuide[index].joints[joint])) < 1e-9)));

  for (const [name, shift] of [['raise 5 cm', [0, .05, 0]], ['sideways 2 cm and inward 3 cm', [.02, 0, .03]]]) {
    const edited = structuredClone(smoothGuide);edited.smoothPaths.rightAnkle.bend = vector(seededBend).add(vector(shift)).toArray();
    const preview = frames({ segmentGuides: [edited] });
    const maximum = Math.max(...preview.slice(1, -1).map(frame => frame.diagnostics.goalErrors.rightAnkle));
    check(name + ': changing the arc handle changes a reachable actual path', maximum < 1e-8 &&
      vector(preview[16].joints.rightAnkle).distanceTo(seededMidpoint.clone().add(vector(shift))) < 1e-8,
      { maximumTargetError: maximum, maximumTurnDegrees: Math.max(...turns(preview)) });
    routes.push({ name, maximumTargetError: maximum, maximumTurnDegrees: Math.max(...turns(preview)) });
  }
  motion.update(3.317);const snapshot = state();
  const times = [.92, .03, .51, .73, .23, .001, .999];
  const forward = times.map(time => frameAt(time)), backward = [...times].reverse().map(time => frameAt(time)).reverse();
  check('Random-time direct arc sampling is deterministic and leaves live pose, matrices and clock unchanged',
    JSON.stringify(forward) === JSON.stringify(backward) && JSON.stringify(state()) === JSON.stringify(snapshot));
  for (let index = 0; index < smooth.length; index++) {
    const frame = smooth[index], pose = motion.samplePose(frame.time);
    motion.applyPose(pose);const metrics = motion.getMetrics();physical(metrics);
    for (const [joint, expected] of Object.entries(frame.joints)) {
      const error = vector(metrics.joints[joint]).distanceTo(vector(expected));maximumReplayError = Math.max(maximumReplayError, error);
      assert.ok(error < 1e-9, 'Actual GLB pose replays ' + joint);
    }
    const visibleRotations = bones.map(bone => bone.quaternion.clone());motion.update(frame.time);
    bones.forEach((bone, boneIndex) => assert.ok(visibleRotations[boneIndex].angleTo(bone.quaternion) < 1e-7));
    if (index) for (const [bone, values] of Object.entries(frame.boneRotations)) {
      maximumBoneAngle = Math.max(maximumBoneAngle, quaternion(smooth[index - 1].boneRotations[bone]).angleTo(quaternion(values)));
    }
  }
  check('Every arc pose preserves real bone lengths, floor and locked support and replays the same skin orientation', maximumReplayError < 1e-9 && maximumBoneAngle < 1,
    { maximumBoneLengthError, maximumReplayError, maximumBoneAngle });
  const epsilon = 1e-6;
  let endpointAngle = 0;
  for (const [exact, near] of [[0, epsilon], [1, 1 - epsilon]]) {
    const saved = frameAt(exact), nearby = frameAt(near);
    for (const [bone, rotation] of Object.entries(saved.boneRotations)) {
      endpointAngle = Math.max(endpointAngle, quaternion(rotation).angleTo(quaternion(nearby.boneRotations[bone])));
    }
  }
  check('Visible endpoint bone rotations approach the saved poses continuously', endpointAngle < .02, endpointAngle);

  const impossible = structuredClone(smoothGuide);impossible.smoothPaths.rightAnkle.bend = [3, -3, 3];
  const limited = frameAt(.5, { segmentGuides: [impossible] });
  motion.applyPose(motion.samplePose(.5, { segmentGuides: [impossible] }));physical(motion.getMetrics());
  check('Unreachable arcs retain their drawn target and report an honest actual residual', limited.diagnostics.goalErrors.rightAnkle > 1 &&
    Math.abs(limited.diagnostics.goalErrors.rightAnkle - vector(limited.guideTargets.rightAnkle).distanceTo(vector(limited.joints.rightAnkle))) < 1e-10 &&
    limited.diagnostics.warnings.length > 0);

  const ignoredOffset = structuredClone(smoothGuide);ignoredOffset.bends.rightAnkle = [3, 3, 3];
  check('An explicit smooth path overrides the old same-joint offset rather than adding it', JSON.stringify(frames({ segmentGuides: [ignoredOffset] })) === JSON.stringify(smooth));
  const oldCurve = { id: 'coexisting-old-right-curve', side: 'right', from: baseGuide.from, to: baseGuide.to, bend: [.5, -.8, .8] };
  const withCurve = frames({ footCurves: [oldCurve] });
  check('An explicit arc overrides the old same-foot curve while retaining its backup target metadata',
    withCurve.slice(1, -1).every((frame, index) => frame.curveTargets?.right &&
      vector(frame.guideTargets.rightAnkle).distanceTo(vector(smooth[index + 1].guideTargets.rightAnkle)) < 1e-10 &&
      vector(frame.joints.rightAnkle).distanceTo(vector(smooth[index + 1].joints.rightAnkle)) < 1e-9));
  const blockedHand = structuredClone(smoothGuide);blockedHand.smoothPaths.rightWrist = { bend: [.2, .2, .2] };
  const blocked = frameAt(.5, { segmentGuides: [blockedHand] });
  check('A hand locked at both ends stays anchored even when a malformed UI attempts to redraw it', !blocked.guideTargets.rightWrist &&
    vector(blocked.joints.rightWrist).distanceTo(vector(smooth[16].joints.rightWrist)) < 1e-9 &&
    blocked.diagnostics.warnings.some(warning => warning.includes('支撑手')));

  const bodyAndHand = structuredClone(smoothGuide);
  bodyAndHand.smoothPaths.pelvis = { bend: [.003, 0, .003] };
  bodyAndHand.smoothPaths.leftWrist = { bend: [0, .03, 0] };
  const linked = frameAt(.5, { segmentGuides: [bodyAndHand] });
  check('Pelvis and a free hand also use actual endpoint arcs with measured linkage residuals',
    vector(linked.guideTargets.pelvis).distanceTo(vector(frameAt(0).joints.pelvis).lerp(vector(frameAt(1).joints.pelvis), .5)
      .add(vector(bodyAndHand.smoothPaths.pelvis.bend))) < 1e-10 && Number.isFinite(linked.diagnostics.goalErrors.leftWrist));
  motion.applyPose(motion.samplePose(.5, { segmentGuides: [bodyAndHand] }));physical(motion.getMetrics());

  const point = { id: 'retained-K-before-redraw', segment: 0, at: .4, pose: motion.samplePose(.4, { segmentGuides: [] }) };
  const dormant = frames({ corrections: [point] });
  check('Existing K frames stay hard anchors and make a nonadjacent redraw dormant', dormant.every(frame => !frame.guideTargets) &&
    JSON.stringify(motion.samplePose(.4, { corrections: [point] })) === JSON.stringify(point.pose));
  const pointGuide = structuredClone(smoothGuide);pointGuide.from = { kind: 'point', id: point.id };
  const pointTarget = frameAt(.7, { corrections: [point], segmentGuides: [pointGuide] });
  const pointStart = frameAt(.4, { corrections: [point], segmentGuides: [pointGuide] });
  check('Redrawing an adjacent K-to-original span uses those exact actual endpoints', pointTarget.guideTargets &&
    vector(pointTarget.guideTargets.rightAnkle).distanceTo(vector(evaluateSegmentArc(pointStart.joints.rightAnkle, end, seededBend, .5))) < 1e-10 &&
    JSON.stringify(motion.samplePose(.4, { corrections: [point], segmentGuides: [pointGuide] })) === JSON.stringify(point.pose));
  check('Explicitly clearing guides restores the unchanged old automatic trajectory',
    JSON.stringify(frames({ segmentGuides: [] })) === JSON.stringify(baseline));
  check('Source data, profile fixture, and both pre-change references remain intact', JSON.stringify(source) === JSON.stringify(original) &&
    JSON.stringify(smoothGuide) === smoothBytes && oldFixtureBytes === await fs.readFile(beforeUrl, 'utf8') &&
    beforeGuidesBytes === await fs.readFile(beforeGuidesUrl, 'utf8') &&
    sourceBytes === await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8'));
  routes.unshift({ name: 'seeded 8 cm arc preserving sweep XZ', midpoint: seededMidpoint.toArray(), maximumTargetError,
    baselineMaximumTurnDegrees: oldTurn, maximumTurnDegrees: newTurn });
} catch (error) { failure = error; }
const report = { note: 'Controlled formal-source fixtures, not the user browser animation.', checks, count: checks.length,
  passed: checks.filter(check => check.pass).length, routes, maximumBoneLengthError, maximumReplayError, maximumBoneAngle,
  sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
  ...(failure ? { failure: { message: failure.message, stack: failure.stack } } : {}) };
const output = new URL('../output/segment-guide-motion/smooth-path-verification.json', import.meta.url);
await fs.mkdir(new URL('../output/segment-guide-motion/', import.meta.url), { recursive: true });
await fs.writeFile(output, JSON.stringify(report, null, 2));process.stdout.write(JSON.stringify(report, null, 2) + '\n');
if (failure) throw failure;
