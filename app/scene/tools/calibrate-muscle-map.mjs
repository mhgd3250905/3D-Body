// Measure a reversible teaching-atlas coordinate calibration; never edit GLBs.
// Run from any cwd: node app/scene/tools/calibrate-muscle-map.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/legacy/coach-motion.js';
import { attachStudyBody } from '../src/study-body.js';

globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.location ??= { search: '' };
const root = fileURLToPath(new URL('../', import.meta.url));
const file = relative => path.join(root, relative);
const hash = relative => crypto.createHash('sha256').update(fs.readFileSync(file(relative))).digest('hex');
const paths = { coach: 'source/coach/flare-coach.glb', body: 'source/coach/flare-coach-study-body.glb',
  reference: 'source/anatomy/mannequin-reference.glb', rig: 'public/coach/coach-rig.json' };
async function load(relative) {
  const bytes = fs.readFileSync(file(relative));
  return (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene;
}
const [coach, study, reference] = await Promise.all([load(paths.coach), load(paths.body), load(paths.reference)]);
coach.updateMatrixWorld(true); study.updateMatrixWorld(true); reference.updateMatrixWorld(true);
const studySource = study.getObjectByName('Coach_Body');
assert.equal(studySource.skeleton.bones.length, 20);
const bonePairs = studySource.skeleton.bones.map(bone => {
  const original = coach.getObjectByName(bone.name); assert.ok(original?.isBone, 'Missing source bone: ' + bone.name);
  const source = original.getWorldPosition(new THREE.Vector3()).toArray();
  const derived = bone.getWorldPosition(new THREE.Vector3()).toArray();
  assert.ok(source.every((value, i) => Math.abs(value - derived[i]) < 1e-5), 'Bind-pose bone mismatch');
  return { name: bone.name, source, derived };
});
const body = attachStudyBody(coach, study);
const rig = JSON.parse(fs.readFileSync(file(paths.rig), 'utf8'));
const motion = createCoachMotion({ model: coach, rigData: rig });
motion.reset(); coach.updateMatrixWorld(true); body.skeleton.update();
const joints = motion.getMetrics().joints;
const sourceHip = new THREE.Vector3().fromArray(joints.leftHip).add(new THREE.Vector3().fromArray(joints.rightHip)).multiplyScalar(0.5);
const sourceShoulder = new THREE.Vector3().fromArray(joints.shoulderCenter);
const targetHip = new THREE.Vector3(0, 0.86, 0), targetShoulder = new THREE.Vector3(0, 1.36, -0.005);
const yScale = (targetShoulder.y - targetHip.y) / (sourceShoulder.y - sourceHip.y);
const yOffset = targetHip.y - yScale * sourceHip.y;
const sourcePoints = [], point = new THREE.Vector3();
for (let i = 0; i < body.geometry.attributes.position.count; i++) {
  body.getVertexPosition(i, point).applyMatrix4(body.matrixWorld); sourcePoints.push(point.clone());
}
const referenceMesh = reference.getObjectByName('Fitness_Body_Surface'); assert.ok(referenceMesh?.isMesh);
const referencePoints = [];
for (let i = 0; i < referenceMesh.geometry.attributes.position.count; i++) {
  point.fromBufferAttribute(referenceMesh.geometry.attributes.position, i).applyMatrix4(referenceMesh.matrixWorld); referencePoints.push(point.clone());
}
const armWeight = index => {
  let sum = 0;
  for (let component = 0; component < 4; component++) {
    const name = body.skeleton.bones[body.geometry.attributes.skinIndex.getComponent(index, component)]?.name;
    if (/^(left|right)(UpperArm|Forearm|Hand)$/.test(name)) sum += body.geometry.attributes.skinWeight.getComponent(index, component);
  }
  return sum;
};

// Joining actual plane-intersection segments isolates the midline component.
// A simple lateral bounding box would include separate arms at chest height.
function centralContour(points, indices, y, keep = () => true) {
  const nodes = new Map(), edges = [];
  const key = p => p.toArray().map(value => Math.round(value * 100000)).join(':');
  const add = p => { const id = key(p); if (!nodes.has(id)) nodes.set(id, { point: p, neighbours: new Set() }); return id; };
  for (let t = 0; t < indices.count; t += 3) {
    const ids = [indices.getX(t), indices.getX(t + 1), indices.getX(t + 2)];
    if (!ids.every(keep)) continue;
    const intersections = new Map();
    for (let edge = 0; edge < 3; edge++) {
      const a = points[ids[edge]], b = points[ids[(edge + 1) % 3]];
      if ((a.y - y) * (b.y - y) > 0 || Math.abs(a.y - b.y) < 1e-12) continue;
      const p = a.clone().lerp(b, (y - a.y) / (b.y - a.y)); intersections.set(key(p), p);
    }
    if (intersections.size !== 2) continue;
    const pair = [...intersections.values()].map(add); if (pair[0] === pair[1]) continue;
    nodes.get(pair[0]).neighbours.add(pair[1]); nodes.get(pair[1]).neighbours.add(pair[0]); edges.push(pair);
  }
  const seen = new Set(), components = [];
  for (const id of nodes.keys()) {
    if (seen.has(id)) continue;
    const pending = [id], ids = []; seen.add(id);
    while (pending.length) { const next = pending.pop(); ids.push(next); for (const neighbour of nodes.get(next).neighbours) {
      if (!seen.has(neighbour)) { seen.add(neighbour); pending.push(neighbour); }
    } }
    const ps = ids.map(id => nodes.get(id).point), bounds = new THREE.Box3().setFromPoints(ps);
    components.push({ points: ps, bounds, openEnds: ids.filter(id => nodes.get(id).neighbours.size === 1).length });
  }
  const middle = components.filter(c => c.bounds.min.x <= -0.01 && c.bounds.max.x >= 0.01 && c.bounds.min.z < 0 && c.bounds.max.z > 0)
    .sort((a, b) => b.points.length - a.points.length)[0];
  if (!middle) return { valid: false, reason: 'no_continuous_midline_component', components: components.length };
  const halfWidth = Math.max(Math.abs(middle.bounds.min.x), Math.abs(middle.bounds.max.x));
  return { valid: true, halfWidth, front: middle.bounds.max.z, back: middle.bounds.min.z,
    openEnds: middle.openEnds, points: middle.points.length, components: components.length };
}
const targetHeights = [0.86, 0.94, 1.03, 1.08, 1.16, 1.24, 1.30, 1.36];
const rows = [], measurements = [];
for (const targetY of targetHeights) {
  const sourceY = (targetY - yOffset) / yScale;
  const source = centralContour(sourcePoints, body.geometry.index, sourceY, index => armWeight(index) < 0.1);
  const target = centralContour(referencePoints, referenceMesh.geometry.index, targetY);
  const ratio = source.valid && target.valid ? target.halfWidth / source.halfWidth : null;
  const reasons = [];
  if (!source.valid) reasons.push(source.reason); if (!target.valid) reasons.push(target.reason);
  if (source.valid && (source.halfWidth < 0.09 || source.halfWidth > 0.20)) reasons.push('source_core_width_outside_guard');
  if (target.valid && (target.halfWidth < 0.10 || target.halfWidth > 0.20)) reasons.push('reference_core_width_outside_guard_or_arm_join');
  if (ratio !== null && (ratio < 0.8 || ratio > 1.3)) reasons.push('width_ratio_outside_guard');
  const accepted = reasons.length === 0;
  rows.push([sourceY, targetY, source.valid ? source.halfWidth : null, target.valid ? target.halfWidth : null,
    source.valid ? source.front : null, source.valid ? source.back : null, target.valid ? target.front : null, target.valid ? target.back : null]);
  measurements.push({ targetY, source, target, ratio, accepted, reasons,
    fallback: accepted ? null : 'interpolate_from_accepted_core_rows_to_canonical_shoulder_ratio' });
}
assert.ok(measurements.filter(row => row.accepted).length >= 4, 'Too few trustworthy core slices');
const result = {
  version: 1, purpose: 'relative teaching-region placement on the same Snow skin; not exact anatomical registration',
  sources: Object.fromEntries(Object.entries(paths).map(([name, relative]) => [name, { path: relative, sha256: hash(relative) }])),
  licenses: { snow: 'CC BY 4.0', reference: 'CC0' },
  canonicalAnchors: { sourceHip: sourceHip.toArray(), sourceShoulder: sourceShoulder.toArray(), targetHip: targetHip.toArray(),
    targetShoulder: targetShoulder.toArray(), sourceLeftHip: joints.leftHip, sourceLeftShoulder: joints.leftShoulder,
    targetLeftHip: [0.09, 0.86, 0], targetLeftShoulder: [0.19, 1.36, -0.005], yScale, yOffset,
    sourceResetFloorOffset: sourceHip.y - rig.landmarks.leftHip[1] },
  columns: ['sourceY', 'targetY', 'sourceHalfWidth', 'targetHalfWidth', 'sourceFront', 'sourceBack', 'targetFront', 'targetBack'],
  rows, measurements, bonePairs,
  limits: { quantizedContourJoinMetres: 0.00001, armWeightMaximum: 0.1, sourceHalfWidthMetres: [0.09, 0.20],
    targetHalfWidthMetres: [0.10, 0.20], widthRatio: [0.8, 1.3], coreBones: ['pelvis', 'spineLower', 'spineUpper', 'torso'],
    geometryModification: false, zDepthRemapping: false },
};
const destination = file('src/core-calibration.json'); fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ destination, canonicalAnchors: result.canonicalAnchors, rows, measurements }, null, 2));
