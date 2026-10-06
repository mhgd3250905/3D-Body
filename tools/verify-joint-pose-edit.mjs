import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';

// Only decode the existing Snow geometry. No browser, network, asset writes or
// user's storage are involved in this focused pure-pose API check.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, value) { this.type = type;Object.assign(this, value); } };
const raw = await fs.readFile(new URL('../public/coach/flare-coach.glb', import.meta.url));
const { scene: model } = await new GLTFLoader().parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
const rigData = JSON.parse(await fs.readFile(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const sourceBytes = await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8');
const source = JSON.parse(sourceBytes), original = structuredClone(source);
const motion = createCoachMotion({ model, rigData });
const vector = array => new THREE.Vector3().fromArray(array);
const checks = [], results = [];
const bones = [];model.traverse(object => { if (object.isBone) bones.push(object); });
let maximumReplayError = 0, maximumBoneLengthError = 0, failure;
function check(name, pass, detail) {
  checks.push({ name, pass: Boolean(pass), ...(detail === undefined ? {} : { detail }) });assert.ok(pass, name);
}
function state() {
  const metrics = motion.getMetrics();
  return { pose: motion.capturePose(), time: metrics.time, mode: metrics.mode, warnings: metrics.warnings,
    matrices: bones.map(bone => [...bone.matrixWorld.elements]), scales: bones.map(bone => bone.scale.toArray()) };
}
function actual(pose) {
  return motion.sampleTrajectory({ steps: [{ id: 'pure-joint-fixture', pose }], corrections: [],
    skippedSteps: [], footCurves: [], startTime: 0, endTime: 0, samples: 2 }).frames[0].joints;
}
function restore() { motion.update(3.317); }
function validatePhysical(metrics) {
  for (const [key, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[key]);maximumBoneLengthError = Math.max(maximumBoneLengthError, error);
    assert.ok(error < 1e-9, `${key} length changed`);
  }
  const length = vector(rigData.landmarks.pelvis).distanceTo(vector(rigData.landmarks.torso));
  assert.ok(Math.abs(vector(metrics.joints.pelvis).distanceTo(vector(metrics.joints.waist)) - .3 * length) < 1e-9);
  assert.ok(Math.abs(vector(metrics.joints.waist).distanceTo(vector(metrics.joints.shoulderCenter)) - .7 * length) < 1e-9);
  for (const drift of Object.values(metrics.supportDrift)) if (drift !== null) assert.ok(drift < 1e-7);
  if (metrics.groundLock) assert.ok(metrics.minFootHeight >= -1e-7);
  for (const point of Object.values(metrics.joints)) assert.ok(point.every(Number.isFinite));
}
function test(input, joint, goal, name, expectation = {}) {
  const snapshot = state(), inputBytes = JSON.stringify(input), before = actual(input);
  const result = motion.solveJointPose(input, { joint, position: goal });
  check(name + ': pure and deterministic', JSON.stringify(state()) === JSON.stringify(snapshot) && JSON.stringify(input) === inputBytes &&
    JSON.stringify(motion.solveJointPose(input, { joint, position: goal })) === JSON.stringify(result));
  assert.equal(result.pose.groundLock, input.groundLock);
  for (const side of ['left', 'right']) assert.equal(result.pose.limbs[side].handLocked, input.limbs[side].handLocked);
  assert.ok(Number.isFinite(result.error) && result.error >= 0 && Array.isArray(result.warnings));
  assert.ok(['pelvis', 'body', 'upperBody', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'].includes(result.linkedGroup));
  assert.ok(Math.abs(result.error - vector(result.position).distanceTo(vector(goal))) < 1e-12);
  assert.deepEqual(Object.keys(result.joints).sort(), Object.keys(before).sort());
  motion.applyPose(result.pose);const metrics = motion.getMetrics();validatePhysical(metrics);
  const error = vector(metrics.joints[joint]).distanceTo(vector(result.position));maximumReplayError = Math.max(maximumReplayError, error);
  check(name + ': returned pose replays the actual goal and preserves locks/lengths/floor', error < 1e-9);
  motion.applyPose(result.pose);assert.ok(vector(motion.getMetrics().joints[joint]).distanceTo(vector(result.position)) < 1e-9);
  if (expectation.reachable) check(name + ': reachable goal attained', result.error < 1e-7, result.error);
  if (expectation.limited) check(name + ': unreachable goal reports its measured residual', result.limited && result.error > expectation.limited, result.error);
  if (expectation.preserveLocked) for (const side of ['left', 'right']) if (input.limbs[side].handLocked &&
    joint !== side + 'Wrist' && joint !== side + 'Palm') {
    assert.ok(vector(metrics.joints[side + 'Palm']).distanceTo(vector(before[side + 'Palm'])) < 1e-7);
  }
  results.push({ name, joint, requestedPosition: goal, position: result.position,
    error: result.error, limited: result.limited, linkedGroup: result.linkedGroup, warnings: result.warnings });
  restore();return result;
}
try {
  motion.setSequence(source.steps, { period: source.period });restore();
  const locked = structuredClone(source.steps[0].pose), free = structuredClone(locked);
  free.limbs.left.handLocked = false;free.limbs.right.handLocked = false;
  const freeInitial = actual(free);
  // Reachable bent fixtures use only the original rig's points and lengths.
  for (const side of ['left', 'right']) {
    free.limbs[side].wrist = vector(freeInitial[side + 'Shoulder']).lerp(vector(freeInitial[side + 'Wrist']), .8).toArray();
    free.limbs[side].ankle = vector(freeInitial[side + 'Hip']).lerp(vector(freeInitial[side + 'Ankle']), .8).toArray();
  }
  const joints = actual(free), names = Object.keys(joints);
  check('API covers every currently sampled joint, including waist', names.length === 21 && names.includes('waist'));
  for (const joint of names) test(free, joint, joints[joint], 'No-op ' + joint, { reachable: true });
  for (const joint of ['shoulderCenter', 'waist']) {
    test(free, joint, vector(joints[joint]).add(new THREE.Vector3(.004, 0, 0)).toArray(), 'Translate ' + joint, { reachable: true });
  }
  const towardShoulder = vector(joints.shoulderCenter).sub(vector(joints.pelvis)).normalize();
  test(free, 'pelvis', vector(joints.pelvis).addScaledVector(towardShoulder, .01).toArray(), 'Independent pelvis reachable', { reachable: true });
  for (const joint of ['neck', 'head', 'leftShoulder', 'rightShoulder', 'leftHip', 'rightHip']) {
    const hip = joint.endsWith('Hip'), pivot = vector(joints[hip ? 'pelvis' : 'waist']);
    const goal = vector(joints[joint]).sub(pivot).applyAxisAngle(new THREE.Vector3(0, 1, 0), .06).add(pivot).toArray();
    test(free, joint, goal, 'Linked swing ' + joint, { reachable: true });
  }
  for (const side of ['left', 'right']) for (const suffix of ['Elbow', 'Knee']) {
    const arm = suffix === 'Elbow', root = vector(joints[side + (arm ? 'Shoulder' : 'Hip')]);
    const end = vector(joints[side + (arm ? 'Wrist' : 'Ankle')]), middle = vector(joints[side + suffix]);
    const axis = end.clone().sub(root).normalize(), center = root.clone().addScaledVector(axis, middle.clone().sub(root).dot(axis));
    const goal = middle.sub(center).applyAxisAngle(axis, .12).add(center).toArray();
    test(free, side + suffix, goal, 'Reachable bend circle ' + side + suffix, { reachable: true });
    test(free, side + suffix, root.clone().lerp(end, .5).toArray(), 'On-axis bend direction ' + side + suffix, { limited: .01 });
  }
  for (const joint of ['leftWrist', 'rightWrist', 'leftPalm', 'rightPalm', 'leftAnkle', 'rightAnkle', 'leftToe', 'rightToe']) {
    test(free, joint, vector(joints[joint]).add(new THREE.Vector3(.002, .002, 0)).toArray(), 'Reachable endpoint ' + joint, { reachable: true });
  }
  test(free, 'leftAnkle', vector(joints.leftAnkle).setY(-1).toArray(), 'Ground-limited ankle', { limited: .5 });
  test(free, 'head', joints.waist, 'Head radius cannot collapse to waist', { limited: .1 });
  test(free, 'leftHip', joints.pelvis, 'Hip radius cannot collapse to pelvis', { limited: .01 });
  const lockedJoints = actual(locked);
  test(locked, 'pelvis', vector(lockedJoints.pelvis).add(new THREE.Vector3(.05, 0, 0)).toArray(), 'Locked hands useful hip shift', { preserveLocked: true });
  test(locked, 'leftPalm', vector(lockedJoints.leftPalm).add(new THREE.Vector3(.004, 0, 0)).toArray(), 'Selected locked palm anchor moves explicitly', { preserveLocked: true });
  test(locked, 'head', vector(lockedJoints.head).add(new THREE.Vector3(.03, 0, 0)).toArray(), 'Locked hands upper swing', { preserveLocked: true });
  const straight = structuredClone(free);
  const straightActual = actual(straight), hip = vector(straightActual.leftHip), ankle = vector(straightActual.leftAnkle);
  const maximum = vector(rigData.landmarks.leftHip).distanceTo(vector(rigData.landmarks.leftKnee)) +
    vector(rigData.landmarks.leftKnee).distanceTo(vector(rigData.landmarks.leftAnkle));
  straight.limbs.left.ankle = hip.clone().addScaledVector(ankle.clone().sub(hip).normalize(), maximum).toArray();
  const nearlyStraight = actual(straight);
  const stable = test(straight, 'leftKnee', vector(nearlyStraight.leftKnee).add(new THREE.Vector3(.02, 0, 0)).toArray(), 'Near-straight knee preserves its plane');
  check('Near-straight bend has an explicit stability warning and does not flip', stable.warnings.some(warning => warning.includes('接近伸直')) &&
    vector(stable.position).distanceTo(vector(nearlyStraight.leftKnee)) < 1e-5);
  const shoulder = vector(nearlyStraight.leftShoulder), wrist = vector(nearlyStraight.leftWrist);
  const armMaximum = vector(rigData.landmarks.leftShoulder).distanceTo(vector(rigData.landmarks.leftElbow)) +
    vector(rigData.landmarks.leftElbow).distanceTo(vector(rigData.landmarks.leftWrist));
  straight.limbs.left.wrist = shoulder.clone().addScaledVector(wrist.clone().sub(shoulder).normalize(), armMaximum).toArray();
  const straightArm = actual(straight);
  const stableArm = test(straight, 'leftElbow', vector(straightArm.leftElbow).add(new THREE.Vector3(.02, 0, 0)).toArray(), 'Near-straight elbow preserves its plane');
  check('Near-straight elbow also keeps its original bend direction', stableArm.warnings.some(warning => warning.includes('接近伸直')) &&
    vector(stableArm.position).distanceTo(vector(straightArm.leftElbow)) < 1e-5);
  motion.applyPose(locked);const current = motion.capturePose(), hipGoal = vector(current.pelvis).add(new THREE.Vector3(.05, 0, 0)).toArray();
  const pureHip = motion.solveJointPose(current, { joint: 'pelvis', position: hipGoal });
  motion.editHandle('pelvis', { position: hipGoal });const liveHip = motion.getMetrics();
  check('Default live pelvis editing still agrees with the optional pure base frame', Object.entries(pureHip.joints).every(([joint, values]) =>
    vector(values).distanceTo(vector(liveHip.joints[joint])) < 1e-8));restore();
  const beforeInvalid = JSON.stringify(state());
  for (const goal of [{ joint: 'missing', position: [0, 0, 0] }, { joint: 'head', position: [NaN, 0, 0] }, { joint: 'head', position: [1, 2] }]) {
    assert.throws(() => motion.solveJointPose(free, goal));
  }
  check('Invalid goals fail atomically without live-state changes', JSON.stringify(state()) === beforeInvalid);
  check('Original formal/source poses remain byte-for-byte untouched', JSON.stringify(source) === JSON.stringify(original) &&
    await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8') === sourceBytes);
} catch (error) { failure = error.stack; }
const output = new URL('../output/playwright/joint-pose-edit-verification.json', import.meta.url);
await fs.mkdir(new URL('.', output), { recursive: true });
const report = { pass: !failure && checks.every(check => check.pass), checks, results, failure,
  maximumReplayError, maximumBoneLengthError, skinning: motion.getMetrics().skinning };
await fs.writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: checks.filter(check => check.pass).length,
  total: checks.length, cases: results.length, maximumReplayError, maximumBoneLengthError,
  failure, report: fileURLToPath(output) }, null, 2));
if (!report.pass) process.exitCode = 1;
