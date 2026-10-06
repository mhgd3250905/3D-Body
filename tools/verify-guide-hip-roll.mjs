import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';

// Decode the actual local model into a separate scene. All references are
// read-only; only this tool's report is written under output/legacy-hip-rotation.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
const raw = await fs.readFile(new URL('../public/coach/flare-coach.glb', import.meta.url));
const { scene: model } = await new GLTFLoader().parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
const rigData = JSON.parse(await fs.readFile(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const sourceBytes = await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8');
const source = JSON.parse(sourceBytes), original = structuredClone(source);
const oldPoses = await Promise.all(['9', '10'].map(async file => JSON.parse(await fs.readFile(new URL(`../托马斯/${file}.json`, import.meta.url), 'utf8'))));
const beforeBytes = await fs.readFile(new URL('../output/segment-guide-motion/before-smooth-paths.json', import.meta.url), 'utf8');
const before = JSON.parse(beforeBytes);
const diagnostic = JSON.parse(await fs.readFile(new URL('../output/segment-guide-motion/old-frame10-roll-diagnostic.json', import.meta.url), 'utf8'));
const vector = values => new THREE.Vector3().fromArray(values);
const rotation = values => new THREE.Quaternion().fromArray(values);
model.updateMatrixWorld(true);
const inverseModel = model.matrixWorld.clone().invert(), position = new THREE.Vector3(), cloth = [];
model.traverse(mesh => {
  if (!mesh.isSkinnedMesh || mesh.name !== 'Coach_Training_Shorts') return;
  const weights = mesh.geometry.getAttribute('skinWeight'), indices = mesh.geometry.getAttribute('skinIndex');
  for (let index = 0; index < mesh.geometry.getAttribute('position').count; index++) {
    mesh.getVertexPosition(index, position).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverseModel);
    if (Math.abs(position.x) >= .13 || position.y <= .62 || position.y >= .94) continue;
    const links = [];
    for (let component = 0; component < 4; component++) {
      const weight = weights.getComponent(index, component);
      if (weight > 1e-7) links.push({ bone: mesh.skeleton.bones[indices.getComponent(index, component)].name, weight });
    }
    cloth.push({ index, links });
  }
});
const motion = createCoachMotion({ model, rigData }), bones = [];
model.traverse(object => { if (object.isBone) bones.push(object); });
const options = { period: source.period, interpolation: 'linear', corrections: [], skippedSteps: [], footCurves: [], segmentGuides: [] };
const guide = (from, to, extra = {}) => ({ id: `hip-roll-${from}-${to}`, from: { kind: 'step', id: source.steps[from].id },
  to: { kind: 'step', id: source.steps[to].id }, timing: 'linear', bends: {}, bendAngles: {}, ...extra });
const guides = [guide(0, 1), guide(1, 2)], checks = [], samples = [];
let maximumNodeError = 0, maximumBoneLengthError = 0, maximumReplayError = 0;
function check(name, pass, detail) {
  checks.push({ name, pass: Boolean(pass), ...(detail === undefined ? {} : { detail }) });assert.ok(pass, name);
}
function frameAt(time, override = {}) {
  return motion.sampleTrajectory({ startTime: time, endTime: time, samples: 2, includeBoneRotations: true, ...override }).frames[0];
}
function state() {
  const metrics = motion.getMetrics();
  return { pose: motion.capturePose(), time: metrics.time, mode: metrics.mode, warnings: metrics.warnings,
    matrices: bones.map(bone => [...bone.matrixWorld.elements]), scales: bones.map(bone => bone.scale.toArray()) };
}
function skinMetric(frame) {
  const matrices = Object.fromEntries(Object.entries(frame.boneRotations).map(([bone, values]) =>
    [bone, new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(rotation(values))).elements]));
  let minimum = Infinity, worst;
  for (const vertex of cloth) {
    const matrix = new THREE.Matrix3();matrix.elements.fill(0);
    for (const { bone, weight } of vertex.links) for (let index = 0; index < 9; index++) matrix.elements[index] += matrices[bone][index] * weight;
    const determinant = matrix.determinant();
    if (determinant < minimum) { minimum = determinant;worst = vertex; }
  }
  return { time: frame.time, minimumRotationalBlendDeterminant: minimum, worstVertex: worst?.index,
    worstWeights: worst?.links,
    rightThighPelvisAngleDegrees: rotation(frame.boneRotations.rightThigh).angleTo(rotation(frame.boneRotations.pelvis)) * 180 / Math.PI };
}
function physical(metrics) {
  for (const [key, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[key]);maximumBoneLengthError = Math.max(maximumBoneLengthError, error);
    assert.ok(error < 1e-9, key + ' preserves its real length');
  }
  for (const drift of Object.values(metrics.supportDrift)) if (drift !== null) assert.ok(drift < 1e-7);
  assert.ok(!metrics.groundLock || metrics.minFootHeight >= .006 - 1e-7);
}
let failure;
try {
  check('The two original posture backups identify the same unchanged canonical step 10', oldPoses.every(backup =>
    JSON.stringify(backup.steps.find(step => step.id === source.steps[1].sourceStepId)?.pose) === JSON.stringify(source.steps[1].pose)));
  motion.setSequence(source.steps, before.options);
  for (const old of before.frames) {
    const current = frameAt(old.time);
    for (const [joint, values] of Object.entries(old.frame.joints)) {
      const error = vector(current.joints[joint]).distanceTo(vector(values));maximumNodeError = Math.max(maximumNodeError, error);
      assert.ok(error < 1e-9, 'Frozen guided control path changed: ' + joint);
    }
    for (const [bone, values] of Object.entries(old.frame.boneRotations)) {
      if (/Thigh|Patella|Shin/.test(bone)) continue;
      assert.ok(rotation(current.boneRotations[bone]).angleTo(rotation(values)) < 1e-7, 'Unrelated bone frame changed: ' + bone);
    }
  }
  check('Nine actual pre-fix guided samples preserve every spatial node and all unrelated bone frames', true, { maximumNodeError });

  motion.setSequence(source.steps, { ...options, segmentGuides: guides });
  const frames = motion.sampleTrajectory({ startTime: 0, endTime: 2, samples: 65, includeTimes: [.999999, 1.000001], includeBoneRotations: true }).frames;
  const metrics = frames.map(skinMetric), midpoint = skinMetric(frameAt(.5));
  const oldMidpoint = diagnostic.reports.find(report => report.mode === 'guided').samples.find(sample => sample.t === .5);
  check('The old halfway pelvis/thigh collapse is removed without changing keyframe positions',
    oldMidpoint.minimumGroinBlendDet < .01 && midpoint.minimumRotationalBlendDeterminant > .2 &&
    midpoint.rightThighPelvisAngleDegrees < 130,
    { oldRotationalBlendDeterminant: oldMidpoint.minimumGroinBlendDet, current: midpoint });
  check('Both complete controlled spans avoid a nearly singular groin rotational blend',
    Math.min(...metrics.map(metric => metric.minimumRotationalBlendDeterminant)) > .1,
    { minimum: Math.min(...metrics.map(metric => metric.minimumRotationalBlendDeterminant)), samples: metrics.length });
  check('Raw original frames retain missing optional pelvis/twist fields and exact saved values', source.steps.every((step, index) =>
    JSON.stringify(motion.samplePose(index)) === JSON.stringify(step.pose)) && !Object.hasOwn(source.steps[1].pose, 'pelvisQuaternion'));
  let endpointAngle = 0;
  for (const nearbyTime of [.999999, 1.000001]) {
    const near = frameAt(nearbyTime), exact = frameAt(1);
    for (const bone of ['leftThigh', 'rightThigh', 'leftShin', 'rightShin']) {
      endpointAngle = Math.max(endpointAngle, rotation(near.boneRotations[bone]).angleTo(rotation(exact.boneRotations[bone])));
    }
  }
  check('The restored 10 pose and both near-endpoint leg frames remain continuous', endpointAngle < .02, endpointAngle);
  motion.update(3.317);const beforePure = state();
  const times = [.21, .53, .91, 1.11, 1.57, 1.93];
  const forward = times.map(time => frameAt(time)), reversed = [...times].reverse().map(time => frameAt(time)).reverse();
  check('The repaired leg orientation is deterministic and sampling leaves the live state intact',
    JSON.stringify(forward) === JSON.stringify(reversed) && JSON.stringify(state()) === JSON.stringify(beforePure));
  for (const frame of frames) {
    motion.applyPose(motion.samplePose(frame.time));const metrics = motion.getMetrics();physical(metrics);
    for (const [joint, expected] of Object.entries(frame.joints)) {
      const error = vector(metrics.joints[joint]).distanceTo(vector(expected));maximumReplayError = Math.max(maximumReplayError, error);
      assert.ok(error < 1e-9);
    }
    const rotations = bones.map(bone => bone.quaternion.clone());motion.update(frame.time);
    bones.forEach((bone, index) => assert.ok(bone.quaternion.angleTo(rotations[index]) < 1e-7));
  }
  check('The repaired poses replay actual skin rotations while preserving lengths, floor and support', true,
    { maximumBoneLengthError, maximumReplayError });

  const authored = structuredClone(source.steps);
  authored[0].pose.limbs.right.thighTwist = .15;authored[0].pose.limbs.right.kneeTwist = -.2;
  authored[1].pose.limbs.right.thighTwist = .45;authored[1].pose.limbs.right.kneeTwist = .3;
  authored[2].pose.limbs.right.thighTwist = .65;authored[2].pose.limbs.right.kneeTwist = .45;
  const authoredBytes = JSON.stringify(authored);
  motion.setSequence(authored, { ...options, segmentGuides: guides });
  check('Saved explicit thigh and knee rotations remain exact at their original frames', [0, 1, 2].every(index =>
    JSON.stringify(motion.samplePose(index)) === JSON.stringify(authored[index].pose)));
  const editedMiddle = frameAt(.5), plainMiddle = frameAt(.5, { steps: source.steps });
  check('Authored rotations have a visible bone effect without moving the spatial control path',
    rotation(editedMiddle.boneRotations.rightThigh).angleTo(rotation(plainMiddle.boneRotations.rightThigh)) > .02 &&
    rotation(editedMiddle.boneRotations.rightShin).angleTo(rotation(plainMiddle.boneRotations.rightShin)) > .02 &&
    Object.keys(plainMiddle.joints).every(joint => vector(editedMiddle.joints[joint]).distanceTo(vector(plainMiddle.joints[joint])) < 1e-9));

  motion.setSequence(source.steps, { ...options, segmentGuides: guides });
  const start = frameAt(0).joints.rightAnkle, end = frameAt(1).joints.rightAnkle;
  const direction = vector(end).sub(vector(start)).normalize();
  const up = new THREE.Vector3(0, 1, 0).addScaledVector(direction, -direction.y).normalize();
  const center = vector(start).lerp(vector(end), .5).addScaledVector(up, -.65).toArray();
  const orbitGuide = guide(0, 1, { orbitPaths: { rightAnkle: { center, arc: 'short', normal: [0, 0, 1] } } });
  const bentGuide = structuredClone(orbitGuide);bentGuide.bendAngles.rightKnee = .45;
  const unbent = frameAt(.5, { segmentGuides: [orbitGuide] }), bent = frameAt(.5, { segmentGuides: [bentGuide] });
  check('Bend-angle editing still moves the knee while retaining ankle and support targets',
    vector(unbent.joints.rightKnee).distanceTo(vector(bent.joints.rightKnee)) > .01 &&
    vector(unbent.joints.rightAnkle).distanceTo(vector(bent.joints.rightAnkle)) < 1e-9 &&
    vector(unbent.joints.rightWrist).distanceTo(vector(bent.joints.rightWrist)) < 1e-9);
  motion.applyPose(motion.samplePose(.5, { segmentGuides: [bentGuide] }));physical(motion.getMetrics());
  check('Original posture files, supplied explicit rotations and the pre-fix reference remain unchanged',
    JSON.stringify(source) === JSON.stringify(original) && JSON.stringify(authored) === authoredBytes &&
    sourceBytes === await fs.readFile(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8') &&
    beforeBytes === await fs.readFile(new URL('../output/segment-guide-motion/before-smooth-paths.json', import.meta.url), 'utf8'));
  samples.push(...[.25, .5, .75, .999999, 1, 1.000001, 1.25, 1.5, 1.75].map(time => skinMetric(frameAt(time))));
} catch (error) { failure = error; }
const report = { note: 'Controlled source fixtures, not browser storage. Rotational-blend determinant is a skin-collapse proxy, not anatomical volume.',
  checks, count: checks.length, passed: checks.filter(check => check.pass).length, samples, groinVertices: cloth.length,
  maximumNodeError, maximumBoneLengthError, maximumReplayError,
  sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
  ...(failure ? { failure: { message: failure.message, stack: failure.stack } } : {}) };
await fs.mkdir(new URL('../output/legacy-hip-rotation/', import.meta.url), { recursive: true });
await fs.writeFile(new URL('../output/legacy-hip-rotation/guide-hip-roll-verification.json', import.meta.url), JSON.stringify(report, null, 2));
process.stdout.write(JSON.stringify(report, null, 2) + '\n');if (failure) throw failure;
