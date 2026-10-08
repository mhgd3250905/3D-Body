import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import crypto from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import * as THREE from '../scene/node_modules/three/build/three.module.js';
import { GLTFLoader } from '../scene/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from '../scene/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js';
import { createCoachMotion } from '../scene/src/legacy/coach-motion.js';
import { computePacing, pacingRate, paceStep } from '../scene/src/pacing.js';
import { buildMmRest, createSurfaceSelection } from '../scene/src/mapped-mesh.js';
import { attachStudyBody, attachStudyHead, isCoveredActorPart, isOriginalActorHeadPart } from '../scene/src/study-body.js';
import { GROUPS, phaseAt, phaseTicks } from '../scene/src/phase.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const sceneRoot = path.join(root, 'app/scene');
const reference = path.join(root, '.reference/flare-app-info-20261008/unpacked/flare-app-package');
const referenceSrc = path.join(reference, '08_源代码/3D-Body-design-muscle-sync');
const sourceManifest = JSON.parse(fs.readFileSync(path.join(sceneRoot, 'tools/source-manifest.json'), 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const availableReference = fs.existsSync(referenceSrc);
for (const file of sourceManifest.files) {
  assert.equal(hash(path.join(sceneRoot, file.destination)), file.sha256, 'Copied source changed: ' + file.destination);
  if (availableReference) assert.equal(hash(path.join(reference, file.source)), file.sha256, 'Reference differs: ' + file.source);
}

globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.location ??= { search: '' };
async function loadModel(file) {
  let bytes = fs.readFileSync(file);
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = gunzipSync(bytes);
  return (await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene;
}
const model = await loadModel(path.join(sceneRoot, 'public/coach/flare-coach.meshopt.glb.gz'));
const originalModel = await loadModel(path.join(sceneRoot, 'source/coach/flare-coach.glb'));
let losslessAttributeValues = 0, triangleCyclicRotations = 0;
function compareGeometry(original, compressed) {
  const first = [], second = []; original.traverse(mesh => { if (mesh.isMesh) first.push(mesh); }); compressed.traverse(mesh => { if (mesh.isMesh) second.push(mesh); });
  assert.equal(first.length, second.length, 'Lossless compression changed mesh count');
  for (let index = 0; index < first.length; index++) {
    const a = first[index], b = second[index]; assert.equal(a.name, b.name, 'Lossless compression changed mesh names');
    for (const [name, before] of Object.entries(a.geometry.attributes)) {
      const after = b.geometry.attributes[name]; assert.equal(before.count, after.count, 'Attribute size changed'); assert.equal(before.itemSize, after.itemSize);
      for (let i = 0; i < before.count; i++) for (let component = 0; component < before.itemSize; component++) {
        assert.equal(before.getComponent(i, component), after.getComponent(i, component), 'Lossless compression changed ' + a.name + ':' + name); losslessAttributeValues++;
      }
    }
    const originalIndices = a.geometry.index.array, compressedIndices = b.geometry.index.array;
    assert.equal(originalIndices.length, compressedIndices.length);
    // Meshopt's TRIANGLES codec may rotate a triangle's three indices. Its
    // vertices, winding, face order and every surface point remain identical.
    for (let i = 0; i < originalIndices.length; i += 3) {
      let rotation = -1;
      for (let k = 0; k < 3; k++) if ([0, 1, 2].every(j => originalIndices[i + j] === compressedIndices[i + (j + k) % 3])) { rotation = k; break; }
      assert.ok(rotation >= 0, 'Compression changed a triangle at ' + a.name + ':' + i / 3);
      if (rotation) triangleCyclicRotations++;
    }
    assert.deepEqual(a.matrix.toArray(), b.matrix.toArray(), 'Lossless compression changed node transforms');
  }
}
compareGeometry(originalModel, model);
const originalMini = await loadModel(path.join(sceneRoot, 'source/anatomy/mannequin-reference.glb'));
const compressedMini = await loadModel(path.join(sceneRoot, 'public/anatomy/mannequin-reference.meshopt.glb.gz'));
compareGeometry(originalMini, compressedMini);
const originalStudy = await loadModel(path.join(sceneRoot, 'source/coach/flare-coach-study-body.glb'));
const compressedStudy = await loadModel(path.join(sceneRoot, 'public/coach/flare-coach-study-body.meshopt.glb.gz'));
compareGeometry(originalStudy, compressedStudy);
// Keep historical derivative assets independently verifiable. They are not
// attached to the runtime actor, whose geometry and original outfit remain.
const studyBody = attachStudyBody(originalModel, compressedStudy);
assert.equal(studyBody.visible, false, 'Historical study skin must start hidden');
const originalHead = await loadModel(path.join(sceneRoot, 'source/coach/flare-coach-study-head.glb'));
const compressedHead = await loadModel(path.join(sceneRoot, 'public/coach/flare-coach-study-head.meshopt.glb.gz'));
compareGeometry(originalHead, compressedHead);
const studyHead = attachStudyHead(originalModel, compressedHead);
assert.equal(studyHead.visible, false, 'Historical study head must start hidden');
assert.equal(studyBody.skeleton.bones.length, 20);
assert.equal(studyHead.skeleton.bones.length, 20);
for (const historical of [studyBody, studyHead]) {
  assert.deepEqual(historical.skeleton.bones.map(bone => bone.name), rigBoneNames());
  for (const inverse of historical.skeleton.boneInverses) assert.ok(inverse.elements.every(Number.isFinite), 'Invalid historical inverse bind');
}
function rigBoneNames() { return compressedStudy.getObjectByName('Coach_Body').skeleton.bones.map(bone => bone.name); }
assert.ok(!model.getObjectByName('Coach_Study_Body') && !model.getObjectByName('Coach_Study_Head'), 'Runtime actor attached a historical study model');
const runtimePlayerSource = fs.readFileSync(path.join(sceneRoot, 'src/player.js'), 'utf8');
assert.ok(!/attachStudy(?:Body|Head)\s*\(/.test(runtimePlayerSource), 'Runtime player still attaches a study model');
assert.ok(!/loadOfflineGlb\([^\n]*flare-coach-study/.test(runtimePlayerSource), 'Runtime player still loads a study model');
const rig = JSON.parse(fs.readFileSync(path.join(sceneRoot, 'public/coach/coach-rig.json'), 'utf8'));
const motion = createCoachMotion({ model, rigData: rig });
let referenceMotion, viewerPrototype, referenceModel;
if (availableReference) {
  const { createCoachMotion: originalMotion } = await import(pathToFileURL(path.join(referenceSrc, 'src/coach-motion.js')).href);
  ({ BodyViewer: { prototype: viewerPrototype } } = await import(pathToFileURL(path.join(referenceSrc, 'src/viewer.js')).href));
  referenceModel = await loadModel(path.join(referenceSrc, 'public/coach/flare-coach.glb'));
  referenceMotion = originalMotion({ model: referenceModel, rigData: rig });
}
let maxJointError = 0, maxQuaternionError = 0;
for (let index = 0; index <= 180; index++) {
  const time = index * 0.05; motion.update(time); const current = motion.getMetrics();
  for (const p of Object.values(current.joints)) assert.ok(p.every(Number.isFinite), 'Nonfinite joint at ' + time);
  if (referenceMotion) {
    referenceMotion.update(time); const original = referenceMotion.getMetrics();
    for (const [name, value] of Object.entries(current.joints)) maxJointError = Math.max(maxJointError,
      new THREE.Vector3().fromArray(value).distanceTo(new THREE.Vector3().fromArray(original.joints[name])));
    for (const name of ['bodyQuaternion', 'pelvisQuaternion', 'torsoQuaternion']) {
      maxQuaternionError = Math.max(maxQuaternionError, new THREE.Quaternion().fromArray(current[name]).angleTo(new THREE.Quaternion().fromArray(original[name])));
    }
    assert.deepEqual(current.supports, original.supports, 'Support differs at ' + time);
  }
}
assert.ok(maxJointError < 0.001, 'Package joints differ by >= 1 mm');
assert.ok(maxQuaternionError < 0.000001, 'Package pose orientation differs');
motion.update(0); const first = motion.getMetrics().joints; motion.update(9); const closing = motion.getMetrics().joints;
for (const [name, p] of Object.entries(first)) assert.ok(new THREE.Vector3().fromArray(p).distanceTo(new THREE.Vector3().fromArray(closing[name])) < 1e-9, 'Loop seam changed: ' + name);

motion.update(2); const beforeMap = motion.getMetrics();
const meshes = buildMmRest(motion, model); assert.ok(meshes.length >= 12);
assert.deepEqual(motion.getMetrics().joints, beforeMap.joints, 'Surface mapping changed the frozen pose');
const selection = createSurfaceSelection(meshes);
const coveredMeshes = meshes.filter(isCoveredActorPart);
assert.ok(coveredMeshes.length >= 3, 'Expected the clipped body and both garments');
const faceMeshes = meshes.filter(isOriginalActorHeadPart);
assert.ok(faceMeshes.length >= 8, 'Expected the original face, hair and eye/mouth parts');
assert.ok(!meshes.some(mesh => mesh.userData.studySkin || mesh.userData.studyHead), 'Runtime geometry contains a study derivative');
const originalMaterials = new Map(meshes.map(mesh => [mesh, mesh.material]));
const originalVisibility = new Map(meshes.map(mesh => [mesh, mesh.visible]));
const materialFields = ['roughness', 'metalness', 'opacity', 'transparent', 'side', 'alphaTest', 'vertexColors',
  'map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap', 'alphaMap'];
const materialSnapshots = new Map();
for (const mesh of meshes) for (const material of [].concat(mesh.material)) materialSnapshots.set(material, {
  type: material.type, color: material.color?.toArray(), emissive: material.emissive?.toArray(),
  fields: Object.fromEntries(materialFields.map(field => [field, material[field]])),
});
function verifyOriginalAppearance(mesh) {
  assert.equal(mesh.visible, originalVisibility.get(mesh), 'Selection changed visibility: ' + mesh.name);
  const originals = [].concat(originalMaterials.get(mesh)), active = [].concat(mesh.material);
  assert.equal(active.length, originals.length, 'Selection changed material slots: ' + mesh.name);
  for (let index = 0; index < originals.length; index++) {
    const before = materialSnapshots.get(originals[index]), after = active[index];
    assert.equal(after.type, before.type, 'Selection changed material type: ' + mesh.name);
    assert.deepEqual(after.color?.toArray(), before.color, 'Selection replaced authored color: ' + mesh.name);
    assert.deepEqual(after.emissive?.toArray(), before.emissive, 'Selection changed authored emissive: ' + mesh.name);
    for (const field of materialFields) assert.equal(after[field], before.fields[field], 'Selection changed ' + field + ': ' + mesh.name);
  }
}
const groupIds = Object.keys(GROUPS); assert.equal(groupIds.length, 17, 'Expected all 17 app muscle groups');
let selectionCases = 0;
for (const tick of phaseTicks) {
  motion.update(tick.time); const frozen = motion.getMetrics();
  for (const groupId of groupIds) {
    selection.show(groupId, phaseAt(tick.time).items, true);
    for (const mesh of meshes) {
      assert.equal(mesh.material, originalMaterials.get(mesh), 'Selection replaced an original actor material: ' + mesh.name);
      verifyOriginalAppearance(mesh);
    }
    for (const mesh of [...coveredMeshes, ...faceMeshes]) assert.equal(mesh.visible, true, 'Selection hid the original outfit or face: ' + mesh.name);
    assert.deepEqual(motion.getMetrics().joints, frozen.joints, 'Selection changed the paused pose');
    assert.equal(motion.getMetrics().time, tick.time, 'Selection changed the paused time');
    selection.restore();
    for (const mesh of meshes) { assert.equal(mesh.material, originalMaterials.get(mesh), 'Restore did not return original material identity'); verifyOriginalAppearance(mesh); }
    selectionCases++;
  }
}
let vertices = 0, triangles = 0;
for (const mesh of meshes) {
  vertices += mesh.geometry.attributes.position.count; triangles += mesh.geometry.index.count / 3;
  assert.equal(mesh.geometry.attributes.mmRest.count, mesh.geometry.attributes.position.count);
  assert.ok(mesh.geometry.attributes.mmRest.array.every(Number.isFinite), 'Invalid surface map');
}

let kneeMin = 180, plantedElbowMin = 180, freeElbowMin = 180, maxSegmentError = 0;
const angle = (a, pivot, b) => new THREE.Vector3().fromArray(a).sub(new THREE.Vector3().fromArray(pivot))
  .angleTo(new THREE.Vector3().fromArray(b).sub(new THREE.Vector3().fromArray(pivot))) * 180 / Math.PI;
for (let index = 0; index <= 900; index++) {
  motion.update(index / 100); const metrics = motion.getMetrics(), joints = metrics.joints;
  for (const side of ['left', 'right']) {
    kneeMin = Math.min(kneeMin, angle(joints[side + 'Hip'], joints[side + 'Knee'], joints[side + 'Ankle']));
    const elbow = angle(joints[side + 'Shoulder'], joints[side + 'Elbow'], joints[side + 'Wrist']);
    if (joints[side + 'Wrist'][1] < 0.07) plantedElbowMin = Math.min(plantedElbowMin, elbow);
    else freeElbowMin = Math.min(freeElbowMin, elbow);
  }
  for (const [segment, length] of Object.entries(metrics.segmentLengths)) maxSegmentError = Math.max(maxSegmentError, Math.abs(length - metrics.expectedLengths[segment]));
}
assert.ok(kneeMin >= 176, 'Straight-leg rule failed: ' + kneeMin);
assert.ok(plantedElbowMin >= 178, 'Support elbow rule failed: ' + plantedElbowMin);
assert.ok(freeElbowMin >= 179, 'Free-arm rule failed: ' + freeElbowMin);
assert.ok(maxSegmentError < 1e-6, 'Limb length changed');

const table = computePacing(model, motion, 0);
let maxPacingError = 0, maxClockStepError = 0;
if (referenceMotion) {
  const original = { coach: referenceModel, motion: referenceMotion, time: 0, speed: 0.5 };
  original.pacing = viewerPrototype.computePacing.call(original);
  original.pacingRate = time => viewerPrototype.pacingRate.call(original, time);
  for (let index = 0; index <= 180; index++) {
    const time = index * 0.05; original.time = time;
    maxPacingError = Math.max(maxPacingError, Math.abs(pacingRate(table, motion, time) - original.pacingRate(time)));
    maxClockStepError = Math.max(maxClockStepError, Math.abs(paceStep(table, motion, time, 1 / 60, 0.5) - viewerPrototype.paceStep.call(original, 1 / 60)));
  }
}
assert.ok(maxPacingError < 1e-12, 'Paced wall clock differs from BodyViewer');
assert.ok(maxClockStepError < 1e-12, 'Eight-substep clock differs from BodyViewer');
const wallDurations = [], expectedDurations = [1.21, 1.40, 1.02, 0.85, 0.94, 1.05, 1.49, 1.03];
for (let phase = 0; phase < 8; phase++) {
  const a = phase, b = phase === 7 ? 9 : phase + 1, bins = Math.round((b - a) * 2000); let wall = 0;
  for (let index = 0; index < bins; index++) wall += (b - a) / bins / pacingRate(table, motion, a + (index + 0.5) * (b - a) / bins);
  wallDurations.push(wall);
  assert.ok(Math.abs(wall / expectedDurations[phase] - 1) < 0.01, 'Guide phase timing differs by > 1% at phase ' + (phase + 9));
}
assert.deepEqual(phaseTicks.map(key => key.phase), [9, 10, 11, 12, 13, 14, 15, 16]);
assert.deepEqual(phaseTicks.map(key => phaseAt(key.time).support), ['both', 'right', 'right', 'right', 'both', 'left', 'left', 'left']);

const built = path.join(root, 'app/assets/scene');
const builtHtml = fs.readFileSync(path.join(built, 'index.html'), 'utf8');
const refs = [...builtHtml.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
for (const ref of refs) { assert.ok(ref.startsWith('./'), 'Nonrelative bundle URL: ' + ref); assert.ok(fs.existsSync(path.resolve(built, ref)), 'Missing emitted bundle'); }
const allBuiltFiles = [];
function walk(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
  const file = path.join(directory, entry.name); if (entry.isDirectory()) walk(file); else allBuiltFiles.push(file);
} }
walk(built); const bundledBytes = allBuiltFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
assert.ok(bundledBytes < 9 * 1024 * 1024, 'Scene unexpectedly loads a large atlas');
assert.equal(hash(path.join(built, 'coach/flare-coach.meshopt.glb.gz')), hash(path.join(sceneRoot, 'public/coach/flare-coach.meshopt.glb.gz')));
assert.equal(hash(path.join(built, 'anatomy/mannequin-reference.meshopt.glb.gz')), hash(path.join(sceneRoot, 'public/anatomy/mannequin-reference.meshopt.glb.gz')));
assert.equal(hash(path.join(built, 'coach/flare-coach-study-body.meshopt.glb.gz')), hash(path.join(sceneRoot, 'public/coach/flare-coach-study-body.meshopt.glb.gz')));
assert.equal(hash(path.join(built, 'coach/flare-coach-study-head.meshopt.glb.gz')), hash(path.join(sceneRoot, 'public/coach/flare-coach-study-head.meshopt.glb.gz')));
assert.ok(!allBuiltFiles.some(file => /muscles\.bin|bones\.bin|fitness-reference|flare-coach\.glb$/.test(file)), 'Unneeded atlas or duplicate original body bundled');
const optimization = JSON.parse(fs.readFileSync(path.join(sceneRoot, 'tools/model-optimization.json'), 'utf8'));
assert.equal(hash(path.join(sceneRoot, optimization.source)), optimization.sourceSha256);
assert.equal(hash(path.join(sceneRoot, optimization.runtime)), optimization.runtimeSha256);
assert.ok(optimization.runtimeBytes <= 3 * 1024 * 1024, 'Coach compressed payload exceeds M0 target');
console.log(JSON.stringify({ status: 'passed', referenceAvailable: availableReference,
  copiedFiles: sourceManifest.files.length, paritySamples: referenceMotion ? 181 : 0, jointMaxErrorMm: maxJointError * 1000,
  quaternionMaxErrorRadians: maxQuaternionError, kneeMinDegrees: kneeMin, plantedElbowMinDegrees: plantedElbowMin,
  freeElbowMinDegrees: freeElbowMin, limbMaxLengthErrorMeters: maxSegmentError, pacingMaxError: maxPacingError,
  substepClockMaxError: maxClockStepError, phaseWallSecondsAt1x: wallDurations, vertices, triangles,
  losslessAttributeValues, triangleCyclicRotations, compressedCoachBytes: optimization.runtimeBytes, compressedMiniatureBytes: optimization.miniature.runtimeBytes,
  historicalStudyBodyVertices: studyBody.geometry.attributes.position.count, historicalStudyBodyTriangles: studyBody.geometry.index.count / 3,
  historicalStudyHeadVertices: studyHead.geometry.attributes.position.count, historicalStudyHeadTriangles: studyHead.geometry.index.count / 3,
  runtimeStudyAttached: false, selectionCases, selectedGroups: groupIds.length, selectedPhases: phaseTicks.length,
  originalOutfitAndFaceVisibleDuringSelection: true, originalMaterialAppearancePreserved: true,
  originalMaterialIdentityDuringSelection: true, originalMaterialIdentityRestored: true,
  garmentAndFaceVisibilityRestored: true, bundledFiles: allBuiltFiles.length, bundledBytes }, null, 2));
