import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { TRAINING_CLIP_IDS, createTrainingClip, createTrainingMotion } from '../src/training-motion.js';

// Decode only texture dimensions in Node. Geometry, weights and IK are real.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
const read = path => fs.readFileSync(new URL(path, import.meta.url));
const rigData = JSON.parse(read('../public/coach/coach-rig.json'));
const snapshot = read('../托马斯/阶段1-可用动画-2026-10-06.json');
const originalSequence = read('../public/coach/flare-sequence.json');
const rigBefore = JSON.stringify(rigData);
const bytes = read('../public/coach/flare-coach.glb');
const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const motion = createCoachMotion({ model, rigData });
motion.update(.7);
const liveBefore = motion.capturePose();
const meshes = [], bones = [];
model.traverse(object => {
  if (object.isSkinnedMesh) meshes.push({ mesh: object, geometry: object.geometry, material: object.material });
  if (object.isBone) bones.push({ bone: object, scale: object.scale.toArray() });
});
const manager = createTrainingMotion({ rigData, motion });
assert.deepEqual(manager.ids, TRAINING_CLIP_IDS);
assert.throws(() => createTrainingClip('not-a-clip', { rigData, motion }));
const clips = TRAINING_CLIP_IDS.map(id => manager.createClip(id));
for (const clip of clips) {
  for (const time of [0, .2, clip.period / 2, clip.period, -clip.period, 2 * clip.period]) {
    const pose = clip.sample(time);
    assert.equal(pose.version, 1);
    assert.equal(pose.groundLock, true);
    assert.deepEqual(clip.sample(time), pose, `${clip.id} sampling is deterministic`);
    assert.equal(clip.describe(time).measuredForce, false);
    assert.equal(clip.describe(time).measuredActivation, false);
  }
  const mutable = clip.sample(0); mutable.pelvis[1] = 99;
  assert.notEqual(clip.sample(0).pelvis[1], 99, 'A caller cannot change cached poses');
  assert.deepEqual(clip.sample(0), clip.sample(clip.period), `${clip.id} loop endpoint`);
  assert.deepEqual(clip.sample(.37), clip.sample(.37 + clip.period), `${clip.id} periodic sampling`);
  assert.throws(() => clip.sample(NaN));
  assert.throws(() => clip.describe(Infinity));
}
assert.deepEqual(motion.capturePose(), liveBefore, 'Constructing and sampling clips cannot move the original rig');
assert.equal(JSON.stringify(rigData), rigBefore, 'Clip construction cannot mutate landmarks');
console.log('OK Pure sampling, standard poses, rejected invalid IDs/times, finite loop periods and fresh results');

const vec = values => new THREE.Vector3().fromArray(values);
const span = points => Math.max(...points) - Math.min(...points);
const angle = (root, middle, end) => vec(root).sub(vec(middle)).angleTo(vec(end).sub(vec(middle)));
const stats = [];
let frames = 0, maximumBoneError = 0, maximumAnchorError = 0, minimumSurfaceY = Infinity;
const minimum = new THREE.Vector3();
for (const clip of clips) {
  const positions = [], rotations = [], firstPose = clip.sample(0), surfaces = [];
  let minimumFoot = Infinity, minimumElbow = Infinity, warnings = [];
  for (let index = 0; index <= 64; index++) {
    const time = clip.period * index / 64, requested = clip.sample(time);
    motion.applyPose(requested, clip.applyOptions);
    const metrics = motion.getMetrics();
    assert.deepEqual(metrics.supportHands, ['left', 'right']);
    warnings.push(...metrics.warnings);
    positions.push(metrics.joints);
    for (const [name, length] of Object.entries(metrics.segmentLengths)) {
      const error = Math.abs(length - metrics.expectedLengths[name]);
      maximumBoneError = Math.max(maximumBoneError, error);
      assert.ok(error < 1e-7, `${clip.id} cannot stretch ${name}`);
    }
    for (const side of ['left', 'right']) {
      const error = vec(metrics.joints[side + 'Wrist']).distanceTo(vec(firstPose.limbs[side].wrist));
      maximumAnchorError = Math.max(maximumAnchorError, error);
      assert.ok(error < 1e-7, `${clip.id} ${side} wrist drift ${error}`);
      assert.ok(metrics.supportDrift[side] < 1e-7, `${clip.id} palm lock`);
      minimumElbow = Math.min(minimumElbow, angle(metrics.joints[side + 'Shoulder'], metrics.joints[side + 'Elbow'], metrics.joints[side + 'Wrist']));
    }
    minimumFoot = Math.min(minimumFoot, metrics.minFootHeight);
    assert.ok(metrics.minFootHeight >= -.00001, `${clip.id} foot floor`);
    const boneRotations = bones.map(({ bone, scale }) => {
      assert.deepEqual(bone.scale.toArray(), scale, 'Training cannot scale any original bone');
      assert.ok(bone.quaternion.toArray().every(Number.isFinite));
      return bone.quaternion.clone();
    });
    rotations.push(boneRotations);
    for (const { mesh, geometry, material } of meshes) {
      assert.equal(mesh.geometry, geometry); assert.equal(mesh.material, material);
    }
    if (index % 8 === 0) {
      const inverse = model.matrixWorld.clone().invert();
      let floor = Infinity;
      for (const { mesh } of meshes) {
        const attribute = mesh.geometry.getAttribute('position');
        for (let vertex = 0; vertex < attribute.count; vertex++) {
          mesh.getVertexPosition(vertex, minimum).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);
          floor = Math.min(floor, minimum.y);
        }
      }
      surfaces.push({ time, floor });
      minimumSurfaceY = Math.min(minimumSurfaceY, floor);
    }
    frames++;
  }
  let maximumRotationJump = 0;
  for (let index = 1; index < rotations.length; index++) for (let bone = 0; bone < bones.length; bone++) {
    maximumRotationJump = Math.max(maximumRotationJump, rotations[index - 1][bone].angleTo(rotations[index][bone]));
  }
  stats.push({ id: clip.id, minimumFoot, minimumSurfaceY: Math.min(...surfaces.map(value => value.floor)),
    minimumElbowDegrees: minimumElbow * 180 / Math.PI, maximumRotationJumpDegrees: maximumRotationJump * 180 / Math.PI,
    pelvisX: span(positions.map(value => value.pelvis[0])), pelvisY: span(positions.map(value => value.pelvis[1])),
    shoulderY: span(positions.map(value => value.shoulderCenter[1])),
    leftAnkleY: span(positions.map(value => value.leftAnkle[1])), rightAnkleY: span(positions.map(value => value.rightAnkle[1])),
    leftAnkleX: span(positions.map(value => value.leftAnkle[0])), rightAnkleX: span(positions.map(value => value.rightAnkle[0])),
    warnings: [...new Set(warnings)] });
  assert.ok(maximumRotationJump < .6, `${clip.id} has a discontinuous knee/elbow roll`);
  for (const side of ['left', 'right']) for (const suffix of ['Shoulder', 'Elbow', 'Wrist', 'Hip', 'Knee', 'Ankle']) {
    assert.ok(vec(positions[0][side + suffix]).distanceTo(vec(positions.at(-1)[side + suffix])) < 1e-8, `${clip.id} real-rig loop ${side}${suffix}`);
  }
}
console.log(JSON.stringify(stats, null, 2));
assert.ok(minimumSurfaceY >= -.00001, `Original skinned surface below floor: ${minimumSurfaceY}`);
assert.ok(stats.every(value => !value.warnings.length), 'Clips must fit the actual rig without clamping');
assert.ok(stats.find(value => value.id === 'scapPush').shoulderY > .015);
assert.ok(stats.find(value => value.id === 'scapPush').minimumElbowDegrees > 165, 'Push must remain a near-straight-arm demonstration');
assert.ok(stats.find(value => value.id === 'supportShift').pelvisX > .14);
const seated = stats.find(value => value.id === 'straddleLift');
assert.ok(seated.leftAnkleY > .09 && seated.rightAnkleY > .09);
assert.ok(seated.pelvisY < 1e-8, 'Seated lift cannot be produced by a bouncing pelvis');
const rear = stats.find(value => value.id === 'rearSupport');
assert.ok(rear.leftAnkleY > .12 && rear.rightAnkleY > .12 && rear.pelvisY > .025);
const opening = stats.find(value => value.id === 'hipOpening');
assert.ok(opening.leftAnkleX > .15 && opening.rightAnkleX > .15, 'Hip opening visibly changes both leg paths');
assert.ok(opening.leftAnkleY < 1e-8 && opening.rightAnkleY < 1e-8 && opening.pelvisY < 1e-8);
console.log(`OK ${frames} original-rig poses preserve hand anchors and bone lengths (max length ${maximumBoneError}, wrist ${maximumAnchorError})`);
console.log(`OK Actual skin, clothes, hands and shoes stay above the floor at ${clips.length * 9} full-surface samples`);
console.log('OK Five distinct exercise motions, stable bending planes and closed real-rig loops');

motion.update(.7);
assert.deepEqual(motion.capturePose(), liveBefore, 'Returning to original Flare time restores the exact original pose');
assert.ok(read('../托马斯/阶段1-可用动画-2026-10-06.json').equals(snapshot));
assert.ok(read('../public/coach/flare-sequence.json').equals(originalSequence));
assert.equal(JSON.stringify(rigData), rigBefore);
console.log('OK Original sequence, accepted snapshot, asset geometry and live Flare frame remain intact');
console.log('Training motion: 5 focused checks passed. Browser viewing remains the integration task.');
