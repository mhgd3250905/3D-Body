import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { evaluateSegmentArc, evaluateSegmentOrbit } from '../src/segment-guides.js';

// The actual local Snow GLB is decoded into an isolated in-memory scene.
// No browser, user storage, original posture export or frozen reference is written.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
const raw = await fs.readFile(new URL('../public/coach/flare-coach.glb', import.meta.url));
const { scene: model } = await new GLTFLoader().parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
const rigData = JSON.parse(await fs.readFile(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const sourceBytes = await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8');
const source = JSON.parse(sourceBytes), sourceCopy = structuredClone(source);
const beforeUrl = new URL('../output/segment-guide-motion/before-smooth-paths.json', import.meta.url);
const beforeBytes = await fs.readFile(beforeUrl, 'utf8'), before = JSON.parse(beforeBytes);
const oldLegacyUrl = new URL('../output/segment-guide-motion/before-guides.json', import.meta.url);
const oldLegacyBytes = await fs.readFile(oldLegacyUrl, 'utf8');
const motion = createCoachMotion({ model, rigData });
const vector = values => new THREE.Vector3().fromArray(values);
const quaternion = values => new THREE.Quaternion().fromArray(values);
const digest = value => createHash('sha256').update(value).digest('hex');
const bones = [];model.traverse(object => { if (object.isBone) bones.push(object); });
const options = { period: source.period, interpolation: 'linear', corrections: [], skippedSteps: [], footCurves: [], segmentGuides: [] };
const baseGuide = { id: 'orbit-09-10-controlled', from: { kind: 'step', id: source.steps[0].id },
  to: { kind: 'step', id: source.steps[1].id }, timing: 'linear', bends: {}, bendAngles: {} };
const checks = [], cases = [];
let maximumBoneLengthError = 0, maximumReplayError = 0, maximumAdjacentBoneAngle = 0;
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
function physical(metrics) {
  for (const [key, value] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(value - metrics.expectedLengths[key]);maximumBoneLengthError = Math.max(maximumBoneLengthError, error);
    assert.ok(error < 1e-9, key + ' keeps its real length');
  }
  for (const drift of Object.values(metrics.supportDrift)) if (drift !== null) assert.ok(drift < 1e-7);
  assert.ok(!metrics.groundLock || metrics.minFootHeight >= .006 - 1e-7);
  for (const joint of Object.values(metrics.joints)) assert.ok(joint.every(Number.isFinite));
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
  motion.setSequence(source.steps, before.options);
  const unchanged = before.times.map(time => ({ time, pose: motion.samplePose(time), frame: frameAt(time) }));
  check('Nine frozen guide routes, joints, diagnostics and non-leg rotations remain exact after the hip-roll fix',
    JSON.stringify(withoutGeneratedLegRoll(unchanged)) === JSON.stringify(withoutGeneratedLegRoll(before.frames)));
  const frozenSmooth = { id: 'pre-orbit-smooth-fixture', from: baseGuide.from, to: baseGuide.to, timing: 'linear',
    bends: { pelvis: [.003, 0, .004], leftAnkle: [0, .02, 0] }, bendAngles: { leftKnee: .25 },
    smoothPaths: { rightAnkle: { bend: [.02, .08, -.04] } } };
  motion.setSequence(source.steps, { ...options, segmentGuides: [frozenSmooth] });
  const smoothTimes = [0, .001, .0625, .25, .5, .75, .9375, .999, 1, 2];
  const smoothFrames = smoothTimes.map(time => ({ time, pose: motion.samplePose(time), frame: frameAt(time) }));
  // The historical full-skin hash included the generated leg roll now fixed.
  // Keep its spatial fixture above; verify this arc's actual goals and keys.
  check('Existing smooth-arc goals still follow their saved midpoint and preserve raw endpoint poses',
    smoothFrames.filter(sample => sample.time > 0 && sample.time < 1).every(sample =>
      vector(sample.frame.guideTargets.rightAnkle).distanceTo(vector(evaluateSegmentArc(
        smoothFrames[0].frame.joints.rightAnkle, smoothFrames[8].frame.joints.rightAnkle,
        frozenSmooth.smoothPaths.rightAnkle.bend, sample.time))) < 1e-10) &&
    [0, 8, 9].every(index => JSON.stringify(smoothFrames[index].pose) === JSON.stringify(source.steps[smoothTimes[index]].pose)));

  motion.setSequence(source.steps, options);
  const baseline = frames(), start = baseline[0].joints.rightAnkle, end = baseline.at(-1).joints.rightAnkle;
  const chord = vector(end).sub(vector(start)).normalize();
  const perpendicularUp = new THREE.Vector3(0, 1, 0).addScaledVector(chord, -chord.y).normalize();
  const center = vector(start).lerp(vector(end), .5).addScaledVector(perpendicularUp, -.65);
  const orbitPath = { center: center.toArray(), arc: 'short', normal: [0, 0, 1], note: 'Controlled equal-radius reference' };
  const orbitGuide = { ...structuredClone(baseGuide), orbitPaths: { rightAnkle: orbitPath } };
  const orbitBytes = JSON.stringify(orbitGuide);
  motion.setSequence(source.steps, { ...options, segmentGuides: [orbitGuide] });
  const circle = frames(), radius = vector(start).distanceTo(center);
  let circleError = 0, targetError = 0;
  for (const frame of circle.slice(1, -1)) {
    const expected = evaluateSegmentOrbit(start, end, orbitPath, frame.time);
    assert.ok(vector(frame.guideTargets.rightAnkle).distanceTo(vector(expected)) < 1e-10);
    circleError = Math.max(circleError, Math.abs(vector(frame.guideTargets.rightAnkle).distanceTo(center) - radius));
    targetError = Math.max(targetError, frame.diagnostics.goalErrors.rightAnkle);
  }
  check('A fully reachable equal-radius orbit follows the exact circle about its chosen center', circleError < 1e-9 && targetError < 1e-8,
    { center: center.toArray(), radius, maximumCircleRadiusError: circleError, maximumIKResidual: targetError });
  check('Saved endpoint poses and the other seven originals remain raw', source.steps.every((step, index) =>
    JSON.stringify(motion.samplePose(index)) === JSON.stringify(step.pose)));
  check('Orbit metadata and normal remain available without rewriting the saved profile',
    JSON.stringify(motion.getSegmentGuideAt(.5).guide.orbitPaths.rightAnkle) === JSON.stringify(orbitPath));

  const movedPath = { ...orbitPath, center: center.clone().add(new THREE.Vector3(.025, .02, -.05)).toArray() };
  const variableGuide = { ...structuredClone(baseGuide), orbitPaths: { rightAnkle: movedPath } };
  const variable = frames({ segmentGuides: [variableGuide] });
  const variableStart = vector(start).distanceTo(vector(movedPath.center)), variableEnd = vector(end).distanceTo(vector(movedPath.center));
  let variableRadiusError = 0, variableTargetError = 0;
  for (const frame of variable.slice(1, -1)) {
    variableRadiusError = Math.max(variableRadiusError, Math.abs(vector(frame.guideTargets.rightAnkle).distanceTo(vector(movedPath.center))
      - variableStart * (1 - frame.time) - variableEnd * frame.time));
    variableTargetError = Math.max(variableTargetError, frame.diagnostics.goalErrors.rightAnkle);
  }
  check('Changing XYZ center changes the route and linearly blends unequal endpoint radii', Math.abs(variableStart - variableEnd) > .001 &&
    variableRadiusError < 1e-9 && variableTargetError < 1e-8 &&
    vector(variable[16].joints.rightAnkle).distanceTo(vector(circle[16].joints.rightAnkle)) > .005,
    { radii: [variableStart, variableEnd], maximumRadialBlendError: variableRadiusError, maximumIKResidual: variableTargetError });
  const easedGuide = structuredClone(orbitGuide);easedGuide.timing = 'smooth';
  const eased = frameAt(.25, { segmentGuides: [easedGuide] }), easedProgress = .25 * .25 * (3 - 2 * .25);
  check('The chosen outer timing drives orbital angle and radius consistently',
    vector(eased.guideTargets.rightAnkle).distanceTo(vector(evaluateSegmentOrbit(start, end, orbitPath, easedProgress))) < 1e-10);
  const longGuide = structuredClone(orbitGuide);longGuide.orbitPaths.rightAnkle.arc = 'long';
  const long = frames({ segmentGuides: [longGuide] });
  const longResidual = Math.max(...long.slice(1, -1).map(frame => frame.diagnostics.goalErrors.rightAnkle));
  check('Short and long arcs choose different routes while retaining the exact endpoints',
    vector(long[16].guideTargets.rightAnkle).distanceTo(vector(circle[16].guideTargets.rightAnkle)) > radius &&
    vector(long[0].joints.rightAnkle).distanceTo(vector(start)) < 1e-10 &&
    vector(long.at(-1).joints.rightAnkle).distanceTo(vector(end)) < 1e-10);
  check('An unreachable long arc keeps the drawn target and its measured physical residual', longResidual > 1 &&
    long.slice(1, -1).every(frame => Math.abs(frame.diagnostics.goalErrors.rightAnkle -
      vector(frame.guideTargets.rightAnkle).distanceTo(vector(frame.joints.rightAnkle))) < 1e-10));

  motion.update(3.317);const snapshot = state();
  const times = [.91, .02, .56, .74, .23, .0001, .9999];
  const forward = times.map(time => frameAt(time)), backward = [...times].reverse().map(time => frameAt(time)).reverse();
  check('Orbit sampling in arbitrary time order remains deterministic and leaves live matrices and clock untouched',
    JSON.stringify(forward) === JSON.stringify(backward) && JSON.stringify(state()) === JSON.stringify(snapshot));
  for (const [name, pathGuide, samples] of [['circle', orbitGuide, circle], ['variable', variableGuide, variable], ['long constrained', longGuide, long]]) {
    motion.setSequence(source.steps, { ...options, segmentGuides: [pathGuide] });
    for (let index = 0; index < samples.length; index++) {
      const frame = samples[index], pose = motion.samplePose(frame.time, { segmentGuides: [pathGuide] });
      motion.applyPose(pose);const metrics = motion.getMetrics();physical(metrics);
      for (const [joint, expected] of Object.entries(frame.joints)) {
        const error = vector(metrics.joints[joint]).distanceTo(vector(expected));maximumReplayError = Math.max(maximumReplayError, error);
        assert.ok(error < 1e-9, 'Orbit raw pose replays ' + joint);
      }
      const visibleRotations = bones.map(bone => bone.quaternion.clone());motion.update(frame.time);
      bones.forEach((bone, boneIndex) => assert.ok(visibleRotations[boneIndex].angleTo(bone.quaternion) < 1e-7));
      if (name === 'circle' && index) for (const [bone, rotation] of Object.entries(frame.boneRotations)) {
        maximumAdjacentBoneAngle = Math.max(maximumAdjacentBoneAngle, quaternion(samples[index - 1].boneRotations[bone]).angleTo(quaternion(rotation)));
      }
    }
    cases.push({ name, samples: samples.length,
      maximumIKResidual: Math.max(...samples.slice(1, -1).map(frame => frame.diagnostics.goalErrors.rightAnkle)) });
  }
  check('Actual orbit and constrained long-arc poses preserve bone lengths, floor, locked support and replay',
    maximumReplayError < 1e-9 && maximumAdjacentBoneAngle < 1,
    { maximumBoneLengthError, maximumReplayError, maximumAdjacentBoneAngle });
  motion.setSequence(source.steps, { ...options, segmentGuides: [orbitGuide] });
  let endpointAngle = 0;
  for (const [time, nearbyTime] of [[0, 1e-6], [1, 1 - 1e-6]]) {
    const exact = frameAt(time), near = frameAt(nearbyTime);
    for (const [bone, rotation] of Object.entries(exact.boneRotations)) {
      endpointAngle = Math.max(endpointAngle, quaternion(rotation).angleTo(quaternion(near.boneRotations[bone])));
    }
  }
  check('Orbit bone rotations approach the saved endpoint orientations continuously', endpointAngle < .02, endpointAngle);

  const layered = structuredClone(orbitGuide);layered.bends.rightAnkle = [3, 3, 3];
  layered.smoothPaths = { rightAnkle: { bend: [-3, -3, -3] } };
  const oldCurve = { id: 'lower-priority-foot-curve', side: 'right', from: baseGuide.from, to: baseGuide.to, bend: [.8, -.8, .8] };
  const layeredFrames = frames({ segmentGuides: [layered], footCurves: [oldCurve] });
  check('Orbit targets override same-joint smooth paths, offsets and old foot curves', layeredFrames.slice(1, -1).every((frame, index) =>
    vector(frame.guideTargets.rightAnkle).distanceTo(vector(circle[index + 1].guideTargets.rightAnkle)) < 1e-10 &&
    vector(frame.joints.rightAnkle).distanceTo(vector(circle[index + 1].joints.rightAnkle)) < 1e-9 && frame.curveTargets?.right));
  const blocked = structuredClone(orbitGuide);blocked.orbitPaths.rightWrist = { center: [.3, .3, 0], arc: 'long', normal: [0, 0, 1] };
  const blockedFrame = frameAt(.5, { segmentGuides: [blocked] });
  check('Both-end support wrists stay fixed and cannot become orbit targets', !blockedFrame.guideTargets.rightWrist &&
    vector(blockedFrame.joints.rightWrist).distanceTo(vector(circle[16].joints.rightWrist)) < 1e-9 &&
    blockedFrame.diagnostics.warnings.some(warning => warning.includes('支撑手')));
  const linked = structuredClone(orbitGuide);
  linked.orbitPaths.pelvis = { center: [0, -.5, 0], arc: 'short', normal: [0, 0, 1] };
  linked.orbitPaths.leftWrist = { center: [0, 0, 0], arc: 'short', normal: [0, 0, 1] };
  const linkedFrame = frameAt(.5, { segmentGuides: [linked] });
  for (const joint of ['pelvis', 'leftWrist']) assert.ok(vector(linkedFrame.guideTargets[joint]).distanceTo(vector(evaluateSegmentOrbit(
    baseline[0].joints[joint], baseline.at(-1).joints[joint], linked.orbitPaths[joint], .5))) < 1e-10);
  motion.applyPose(motion.samplePose(.5, { segmentGuides: [linked] }));physical(motion.getMetrics());
  check('Pelvis and a free hand use actual endpoint orbits while keeping support and measured residuals',
    Number.isFinite(linkedFrame.diagnostics.goalErrors.pelvis) && Number.isFinite(linkedFrame.diagnostics.goalErrors.leftWrist));

  motion.setSequence(source.steps, { ...options, segmentGuides: [orbitGuide] });motion.update(.5);
  const beforeBad = state(), installed = frameAt(.5), installedGuide = motion.getSegmentGuideAt(.5);
  for (const collision of [start, end]) {
    const bad = structuredClone(orbitGuide);bad.orbitPaths.rightAnkle.center = [...collision];
    assert.throws(() => frameAt(.5, { segmentGuides: [bad] }));
    assert.throws(() => motion.setSequence(source.steps, { ...options, segmentGuides: [bad] }));
    assert.equal(JSON.stringify(state()), JSON.stringify(beforeBad));
    assert.equal(JSON.stringify(frameAt(.5)), JSON.stringify(installed));
    assert.equal(JSON.stringify(motion.getSegmentGuideAt(.5)), JSON.stringify(installedGuide));
  }
  check('A center colliding with either actual endpoint fails before replacing the live animation', true);
  const invalidNormal = structuredClone(orbitGuide);invalidNormal.orbitPaths.rightAnkle.normal = [0, 0, 0];
  assert.throws(() => motion.setSequence(source.steps, { ...options, segmentGuides: [invalidNormal] }));
  check('Invalid center-plane data is rejected atomically', JSON.stringify(state()) === JSON.stringify(beforeBad));

  const point = { id: 'retained-K-before-orbit', segment: 0, at: .4, pose: motion.samplePose(.4, { segmentGuides: [] }) };
  const pointBytes = JSON.stringify(point);
  const dormant = frames({ corrections: [point] });
  check('An existing K is preserved as a hard anchor and makes a nonadjacent orbit dormant', dormant.every(frame => !frame.guideTargets) &&
    JSON.stringify(motion.samplePose(.4, { corrections: [point] })) === JSON.stringify(point.pose));
  const pointGuide = structuredClone(orbitGuide);pointGuide.from = { kind: 'point', id: point.id };
  const pointStart = frameAt(.4, { corrections: [point], segmentGuides: [pointGuide] });
  const pointMidpoint = frameAt(.7, { corrections: [point], segmentGuides: [pointGuide] });
  check('An adjacent K-to-original orbit uses their actual endpoints and preserves the raw K pose',
    vector(pointMidpoint.guideTargets.rightAnkle).distanceTo(vector(evaluateSegmentOrbit(pointStart.joints.rightAnkle, end, orbitPath, .5))) < 1e-10 &&
    JSON.stringify(motion.samplePose(.4, { corrections: [point], segmentGuides: [pointGuide] })) === JSON.stringify(point.pose));
  check('Clearing orbit guides restores the unchanged original animation', JSON.stringify(frames({ segmentGuides: [] })) === JSON.stringify(baseline));
  check('Source frames, supplied K/profile data and all frozen references remain unchanged', JSON.stringify(source) === JSON.stringify(sourceCopy) &&
    JSON.stringify(orbitGuide) === orbitBytes && JSON.stringify(point) === pointBytes &&
    beforeBytes === await fs.readFile(beforeUrl, 'utf8') && oldLegacyBytes === await fs.readFile(oldLegacyUrl, 'utf8') &&
    sourceBytes === await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8'));
} catch (error) { failure = error; }
const report = { note: 'Controlled formal 09→10 source fixtures; this does not describe the user browser data.', checks,
  count: checks.length, passed: checks.filter(check => check.pass).length, cases,
  maximumBoneLengthError, maximumReplayError, maximumAdjacentBoneAngle, sourceSha256: digest(sourceBytes),
  ...(failure ? { failure: { message: failure.message, stack: failure.stack } } : {}) };
await fs.mkdir(new URL('../output/segment-guide-motion/', import.meta.url), { recursive: true });
await fs.writeFile(new URL('../output/segment-guide-motion/orbit-path-verification.json', import.meta.url), JSON.stringify(report, null, 2));
process.stdout.write(JSON.stringify(report, null, 2) + '\n');if (failure) throw failure;
