import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createFlareRig } from '../src/flare-rig.js';

// These tests inspect the original GLB's rig and vertices without rendering.
// Stub image decoding only; the production browser still loads real textures.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, value) { this.type = type; Object.assign(this, value); } };
const source = new URL('../public/coach/flare-coach.glb', import.meta.url);
const bytes = fs.readFileSync(fileURLToPath(source));
const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const rigData = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const motion = createCoachMotion({ model, driver: createFlareRig(), rigData });
const clone = value => JSON.parse(JSON.stringify(value));
const vector = value => new THREE.Vector3().fromArray(value);
const meshes = [];
model.traverse(object => { if (object.isSkinnedMesh) meshes.push(object); });
const originalScales = new Map();
model.traverse(object => { if (object.isBone) originalScales.set(object.name, object.scale.toArray()); });
let checkedPoses = 0, maximumLengthError = 0, maximumPalmDrift = 0;

function verifyRig({ checkGround = true } = {}) {
  const metrics = motion.getMetrics();
  for (const [name, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[name]);
    maximumLengthError = Math.max(maximumLengthError, error);
    assert.ok(error < 1e-6, `${name} stretched by ${error} m`);
  }
  for (const drift of Object.values(metrics.supportDrift)) {
    if (drift === null) continue;
    maximumPalmDrift = Math.max(maximumPalmDrift, drift);
    assert.ok(drift < 1e-5, `Locked palm moved by ${drift} m`);
  }
  for (const values of Object.values(metrics.joints)) assert.ok(values.every(Number.isFinite));
  assert.ok([...metrics.bounds.min, ...metrics.bounds.max, ...metrics.bodyQuaternion].every(Number.isFinite));
  assert.ok(Math.abs(Math.hypot(...metrics.bodyQuaternion) - 1) < 1e-7);
  if (checkGround && metrics.groundLock) assert.ok(metrics.minFootHeight >= -1e-6, `Foot crossed the floor: ${metrics.minFootHeight}`);
  const inverse = model.matrixWorld.clone().invert();
  for (const side of ['left', 'right']) {
    for (const [suffix, joint] of [['UpperArm', 'Shoulder'], ['Forearm', 'Elbow'], ['Hand', 'Wrist'], ['Thigh', 'Hip'], ['Shin', 'Knee'], ['Foot', 'Ankle']]) {
      const bone = model.getObjectByName(side + suffix);
      const actual = bone.getWorldPosition(new THREE.Vector3()).applyMatrix4(inverse);
      assert.ok(actual.distanceTo(vector(metrics.joints[side + joint])) < 1e-6, `${bone.name} does not match its endpoint`);
      assert.deepEqual(bone.scale.toArray(), originalScales.get(bone.name));
    }
  }
  checkedPoses++;
  return metrics;
}

function verifyActualFeet() {
  const inverse = model.matrixWorld.clone().invert();
  const p = new THREE.Vector3();
  let minimum = Infinity;
  for (const mesh of meshes) {
    const indices = mesh.geometry.getAttribute('skinIndex');
    const weights = mesh.geometry.getAttribute('skinWeight');
    if (!indices || !weights) continue;
    for (let i = 0; i < indices.count; i++) {
      let foot = false;
      for (let component = 0; component < 4; component++) {
        const bone = mesh.skeleton.bones[indices.getComponent(i, component)];
        if (/Foot$/.test(bone.name) && weights.getComponent(i, component) > 0.999) foot = true;
      }
      if (!foot) continue;
      mesh.getVertexPosition(i, p).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);
      minimum = Math.min(minimum, p.y);
    }
  }
  assert.ok(minimum >= -1e-6, `Actual shoe vertex crossed the floor: ${minimum}`);
  return minimum;
}

assert.equal(motion.group, model);
assert.equal(verifyRig().mode, 'standing');
assert.equal(motion.getEditableHandles().length, 11);
assert.ok(motion.getMetrics().joints.leftWrist[1] < 1);
assert.equal(motion.getEditableHandles().filter(handle => handle.canRotate).length, 11);
verifyActualFeet();

// Replaying serialized captures retains all endpoints and the existing face rig.
for (const time of [null, 0, 2, 4, 6, 8]) {
  if (time === null) motion.reset(); else motion.update(time);
  const before = motion.getMetrics();
  const saved = clone(motion.capturePose());
  const effective = motion.applyPose(saved);
  const after = verifyRig();
  assert.equal(after.mode, 'manual');
  assert.equal(after.manual, true);
  for (const [name, position] of Object.entries(before.joints)) {
    assert.ok(vector(position).distanceTo(vector(after.joints[name])) < 1e-5, `${name} changed after ${time} capture/import`);
  }
  assert.deepEqual(effective, motion.capturePose());
  assert.deepEqual(effective.limbs.left.handLocked, before.supports.left);
}

motion.reset();
const unreachable = motion.editHandle('leftWrist', { position: [8, 8, 8] });
assert.ok(vector(unreachable.limbs.left.wrist).distanceTo(new THREE.Vector3(8, 8, 8)) > 1);
assert.ok(verifyRig().warnings.length);

motion.reset();
const torsoTarget = vector(motion.getMetrics().joints.shoulderCenter).add(new THREE.Vector3(0.1, 0.05, 0.08));
motion.editHandle('torso', {
  position: torsoTarget.toArray(),
  quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.6, 0.4, 0.2)).toArray(),
});
assert.ok(torsoTarget.distanceTo(vector(verifyRig().joints.shoulderCenter)) < 1e-6, 'Torso control pivot did not retain its requested position');

motion.reset();
let belowFloor = motion.capturePose();
belowFloor.groundLock = false;
belowFloor.pelvis[1] = 0.2;
belowFloor.limbs.left.ankle = [0.1, -0.3, 0];
belowFloor.limbs.right.ankle = [-0.1, -0.3, 0];
motion.applyPose(belowFloor);
assert.ok(verifyRig({ checkGround: false }).minFootHeight < 0, 'Explicitly disabled ground lock was ignored');
belowFloor = motion.capturePose(); belowFloor.groundLock = true;
motion.applyPose(belowFloor);
verifyRig();

// Elbow and knee controls select the bend side while retaining both lengths.
motion.reset();
let pose = motion.capturePose();
const shoulder = vector(motion.getMetrics().joints.leftShoulder);
pose.limbs.left.wrist = shoulder.clone().add(new THREE.Vector3(0, -0.32, 0)).toArray();
pose.limbs.left.elbowPole = shoulder.clone().add(new THREE.Vector3(0.5, -0.15, 0)).toArray();
motion.applyPose(pose);
const elbowA = motion.getMetrics().joints.leftElbow[0];
motion.editHandle('leftElbow', { position: shoulder.clone().add(new THREE.Vector3(-0.5, -0.15, 0)).toArray() });
const elbowB = verifyRig().joints.leftElbow[0];
assert.ok(elbowA - elbowB > 0.20, 'Elbow pole did not reverse the bend');
pose = motion.capturePose();
const hip = vector(motion.getMetrics().joints.leftHip);
pose.limbs.left.ankle = hip.clone().add(new THREE.Vector3(0, -0.55, 0)).toArray();
pose.limbs.left.kneePole = hip.clone().add(new THREE.Vector3(0, -0.2, 0.5)).toArray();
motion.applyPose(pose);
const kneeA = motion.getMetrics().joints.leftKnee[2];
motion.editHandle('leftKnee', { position: hip.clone().add(new THREE.Vector3(0, -0.2, -0.5)).toArray() });
const kneeB = verifyRig().joints.leftKnee[2];
assert.ok(kneeA - kneeB > 0.30, 'Knee pole did not reverse the bend');

motion.editHandle('leftWrist', { quaternion: [0, 2, 0, 2] });
assert.ok(Math.abs(Math.hypot(...motion.capturePose().limbs.left.handQuaternion) - 1) < 1e-7);
const footQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.8, 0.4, -0.6)).toArray();
motion.editHandle('leftAnkle', { position: [0, -20, 0], quaternion: footQuaternion });
verifyRig();
verifyActualFeet();

// Locked palm contact is invariant under large pelvis drags and body rotations.
motion.update(0);
const contacts = clone(motion.getMetrics().joints);
motion.editHandle('pelvis', { position: [5, 5, 5] });
verifyRig();
for (const side of ['left', 'right']) assert.ok(vector(contacts[side + 'Palm']).distanceTo(vector(motion.getMetrics().joints[side + 'Palm'])) < 1e-6);
motion.editHandle('torso', { quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(1, 0.9, 0.2)).toArray() });
verifyRig();
for (const side of ['left', 'right']) assert.ok(vector(contacts[side + 'Palm']).distanceTo(vector(motion.getMetrics().joints[side + 'Palm'])) < 1e-6);
const manual = motion.capturePose();
motion.setLayer('reveal');
motion.setHighlight('shoulders');
assert.deepEqual(motion.capturePose(), manual, 'Appearance reset the manual pose');

// Moving a locked wrist is an explicit anchor edit and must clamp gracefully.
motion.update(0);
const stationaryPalm = vector(motion.getMetrics().joints.rightPalm);
motion.editHandle('leftWrist', { position: [8, 8, 8] });
verifyRig();
assert.ok(stationaryPalm.distanceTo(vector(motion.getMetrics().joints.rightPalm)) < 1e-6);
assert.ok(motion.capturePose().limbs.left.handLocked);

// Bad imports are atomic and report readable Chinese errors.
const badImports = [
  pose => { pose.version = 2; },
  pose => { pose.pelvis[0] = NaN; },
  pose => { pose.pelvis[0] = Infinity; },
  pose => { pose.pelvis = Array(3); },
  pose => { pose.bodyQuaternion = [0, 0, 0, 0]; },
  pose => { pose.limbs.left.handLocked = 'true'; },
  pose => { pose.limbs.left.ankle[1] = '0'; },
  pose => { pose.limbs.left.wrist = [-10, 0, 0]; pose.limbs.right.wrist = [10, 0, 0]; },
];
for (const makeBad of badImports) {
  const good = motion.capturePose();
  const bad = clone(good); makeBad(bad);
  assert.throws(() => motion.applyPose(bad), /[\u4e00-\u9fff]/u);
  assert.deepEqual(motion.capturePose(), good, 'Invalid import partially changed the pose');
}
motion.reset();
assert.doesNotThrow(() => motion.editHandle('leftElbow', { quaternion: [0, 0, 0, 1] }));
assert.throws(() => motion.editHandle('missing', { position: [0, 0, 0] }), /未知/u);

// Deterministic edits cover arbitrary foot rotation, extreme endpoints, and
// many ground/IK intersections rather than duplicating the implementation.
let seed = 234891;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
for (let i = 0; i < 96; i++) {
  motion.reset();
  pose = motion.capturePose();
  pose.pelvis = [(random() - 0.5) * 2, (random() - 0.5) * 2, (random() - 0.5) * 2];
  pose.bodyQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(random() * 5, random() * 5, random() * 5)).toArray();
  for (const side of ['left', 'right']) {
    pose.limbs[side].wrist = [(random() - 0.5) * 6, (random() - 0.5) * 6, (random() - 0.5) * 6];
    pose.limbs[side].ankle = [(random() - 0.5) * 6, (random() - 0.5) * 6, (random() - 0.5) * 6];
    pose.limbs[side].footQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(random() * 6, random() * 6, random() * 6)).toArray();
  }
  motion.applyPose(pose);
  verifyRig();
  if (i % 12 === 0) verifyActualFeet();
}

// Editing contact anchors must not change the user's saved playback pose.
motion.update(0);
const playbackAnchors = clone(motion.getMetrics().supportAnchors);
motion.editHandle('leftWrist', { position: [8, 8, 8] });
motion.update(0);
assert.deepEqual(motion.getMetrics().supportAnchors, playbackAnchors);
for (let i = 0; i <= 270; i++) { motion.update(i / 30); verifyRig(); }

// Real skinned vertices remain consistent beneath transformed GLTF parents.
motion.update(0);
const shoe = model.getObjectByName('Coach_Soles');
const original = shoe.getVertexPosition(0, new THREE.Vector3()).applyMatrix4(shoe.matrixWorld);
model.position.set(1.2, 0.35, -0.7);
model.rotation.set(0.15, 0.6, -0.1);
model.scale.setScalar(1.15);
model.getObjectByName('Coach_Rig').position.set(0.06, 0.08, -0.03);
model.getObjectByName('Coach_Rig').rotation.set(0.2, -0.3, 0.1);
motion.applyPose(motion.capturePose());
verifyRig();
const actual = shoe.getVertexPosition(0, new THREE.Vector3()).applyMatrix4(shoe.matrixWorld).applyMatrix4(model.matrixWorld.clone().invert());
const transformedVertexError = original.distanceTo(actual);
assert.ok(transformedVertexError < 1e-6);
verifyActualFeet();
console.log(JSON.stringify({ pass: true, checkedPoses, maximumLengthError, maximumPalmDrift, transformedVertexError, originalBones: motion.getMetrics().skinning.bones, vertices: motion.getMetrics().skinning.weightedVertices }, null, 2));
