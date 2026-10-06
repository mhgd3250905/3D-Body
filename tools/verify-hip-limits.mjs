import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';

// Decode the real local GLB; only image decoding is stubbed for this CPU check.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, value) { this.type = type;Object.assign(this, value); } };
const bytes = fs.readFileSync(new URL('../public/coach/flare-coach.glb', import.meta.url));
const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const rigData = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const source = JSON.parse(fs.readFileSync(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8'));
const motion = createCoachMotion({ model, rigData });
const vector = value => new THREE.Vector3().fromArray(value);
const torsoLength = vector(rigData.landmarks.pelvis).distanceTo(vector(rigData.landmarks.torso));
const lower = torsoLength * .3, upper = torsoLength * .7;
const checks = [];
let maxShoulderDrift = 0, maxLengthError = 0, maxSupportDrift = 0, minFootHeight = Infinity;

function verify(before, { wholeUpper = false } = {}) {
  const after = motion.getMetrics();
  const drift = vector(before.joints.shoulderCenter).distanceTo(vector(after.joints.shoulderCenter));
  maxShoulderDrift = Math.max(maxShoulderDrift, drift);
  assert.ok(drift < 1.01e-7, `Shoulder center moved ${drift} m`);
  if (wholeUpper) for (const name of ['neck', 'head', 'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist', 'leftPalm', 'rightPalm']) {
    assert.ok(vector(before.joints[name]).distanceTo(vector(after.joints[name])) < 1.01e-7, `${name} moved with independent hips`);
  }
  const waist = vector(motion.getEditableHandles().find(handle => handle.id === 'waist').position);
  const lengths = [
    [waist.distanceTo(vector(after.joints.pelvis)), lower],
    [waist.distanceTo(vector(after.joints.shoulderCenter)), upper],
    ...Object.entries(after.segmentLengths).map(([name, length]) => [length, after.expectedLengths[name]]),
  ];
  for (const [actual, expected] of lengths) {
    const error = Math.abs(actual - expected);maxLengthError = Math.max(maxLengthError, error);
    assert.ok(error < 1e-6, `Bone stretched ${error} m`);
  }
  for (const values of Object.values(after.joints)) assert.ok(values.every(Number.isFinite));
  for (const distance of Object.values(after.supportDrift)) if (distance !== null) {
    maxSupportDrift = Math.max(maxSupportDrift, distance);assert.ok(distance < 1e-5, 'Locked palm drifted');
  }
  minFootHeight = Math.min(minFootHeight, after.minFootHeight);
  if (after.groundLock) assert.ok(after.minFootHeight >= -1e-6, 'Shoe crossed the floor');
  return after;
}

// Large drags/rotations exercise reach limiting, across all original poses.
for (let index = 0; index < source.steps.length; index++) {
  for (let axis = 0; axis < 3; axis++) for (const sign of [-1, 1]) for (const kind of ['position', 'rotation']) {
    motion.applyPose(source.steps[index].pose);
    const before = motion.getMetrics(), pose = motion.capturePose();
    const change = kind === 'position'
      ? { position: pose.pelvis.map((value, component) => value + (component === axis ? sign * .5 : 0)) }
      : { quaternion: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3().setComponent(axis, 1), sign * Math.PI / 2)
        .multiply(new THREE.Quaternion().fromArray(pose.pelvisQuaternion ?? pose.bodyQuaternion)).toArray() };
    motion.editHandle('pelvis', change);
    verify(before, { wholeUpper: kind === 'rotation' });
    checks.push({ index, kind, axis, sign, pass: true });
  }
}

// Double support must allow a visible hip edit while both hands stay planted.
motion.applyPose(source.steps[0].pose);
const supportBefore = motion.getMetrics(), supportPose = motion.capturePose();
assert.ok(supportPose.limbs.left.handLocked && supportPose.limbs.right.handLocked);
motion.editHandle('pelvis', { position: supportPose.pelvis.map((value, index) => value + (index === 0 ? .05 : 0)) });
const supportAfter = verify(supportBefore, { wholeUpper: true });
const supportedMovement = vector(supportBefore.joints.pelvis).distanceTo(vector(supportAfter.joints.pelvis));
assert.ok(supportedMovement > .035, `Double support reduced hip movement to ${supportedMovement} m`);
checks.push({ name: 'Visible independent hip drag in double support', pass: true, movement: supportedMovement });

// Requests on either side of the fixed waist pivot must not normalize to
// opposite hip positions. Their small common tangent is the reachable edit.
motion.applyPose(source.steps[0].pose);
const fixedWaist = vector(motion.getEditableHandles().find(handle => handle.id === 'waist').position);
const radial = vector(motion.capturePose().pelvis).sub(fixedWaist).normalize();
const tangent = new THREE.Vector3(1, 0, 0).addScaledVector(radial, -radial.x).normalize().multiplyScalar(.0001);
const nearPivot = [];
for (const sign of [-1, 1]) {
  motion.applyPose(source.steps[0].pose);const before = motion.getMetrics();
  motion.editHandle('pelvis', { position: fixedWaist.clone().addScaledVector(radial, sign * .001).add(tangent).toArray() });
  nearPivot.push(vector(verify(before, { wholeUpper: true }).joints.pelvis));
}
const pivotJump = nearPivot[0].distanceTo(nearPivot[1]);
assert.ok(pivotJump < 1e-6, `A 2 mm request through the waist made the hips jump ${pivotJump} m`);
checks.push({ name: 'Fixed-upper drag stays continuous through waist-pivot requests', pass: true, pivotJump });

// A straight drag through the shoulder must stop on the near reach boundary.
motion.reset();
const standing = motion.getMetrics(), start = vector(standing.joints.pelvis), center = vector(standing.joints.shoulderCenter);
const opposite = center.clone().multiplyScalar(2).sub(start);
const torso = model.getObjectByName('torso');
const upperBefore = torso.getWorldQuaternion(new THREE.Quaternion());
motion.editHandle('pelvis', { position: opposite.toArray() });
const clipped = verify(standing), clippedRoot = vector(clipped.joints.pelvis);
assert.ok(clippedRoot.clone().sub(center).dot(start.clone().sub(center)) > 0, 'Hip drag jumped to the opposite side');
assert.ok(Math.abs(clippedRoot.distanceTo(center) - Math.abs(upper - lower)) < 1e-6);
assert.ok(upperBefore.angleTo(torso.getWorldQuaternion(new THREE.Quaternion())) < 1e-6, 'Upper body flipped during the drag');
checks.push({ name: 'Cross-shoulder drag stops before opposite-side flip', pass: true });

// At the inner boundary inward motion stops, while tangent/outward edits work.
const boundary = motion.capturePose(), direction = clippedRoot.clone().sub(center).normalize();
for (const [name, target, shouldMove] of [
  ['inward', clippedRoot.clone().addScaledVector(direction, -.02), false],
  ['outward', clippedRoot.clone().addScaledVector(direction, .02), true],
  ['tangent', clippedRoot.clone().add(new THREE.Vector3(.02, 0, 0)), true],
]) {
  motion.applyPose(boundary);const before = motion.getMetrics();
  motion.editHandle('pelvis', { position: target.toArray() });
  const after = verify(before), movement = vector(after.joints.pelvis).distanceTo(vector(before.joints.pelvis));
  assert.ok(shouldMove ? movement > .019 : movement < 1e-7, `${name} boundary drag was incorrect: ${movement}`);
  checks.push({ name: `Inner boundary ${name} edit`, pass: true, movement });
}

const report = new URL('../output/playwright/independent-hips-boundary-verification.json', import.meta.url);
fs.mkdirSync(new URL('../output/playwright/', import.meta.url), { recursive: true });
const sourceHashes = Object.fromEntries(['src/coach-motion.js', 'public/coach/flare-sequence.json'].map(name => [name,
  createHash('sha256').update(fs.readFileSync(new URL('../' + name, import.meta.url))).digest('hex')]));
const result = { pass: true, cases: checks.length, maxShoulderDrift, maxLengthError, maxSupportDrift, minFootHeight, supportedMovement, sourceHashes, checks };
fs.writeFileSync(report, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ ...result, checks: undefined, report: fileURLToPath(report) }, null, 2));
