import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import * as THREE from '../scene/node_modules/three/build/three.module.js';
import { GLTFLoader } from '../scene/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from '../scene/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js';
import { createCoachMotion } from '../scene/src/legacy/coach-motion.js';
import { createBakedClock, createBakedMotion } from '../scene/src/baked-motion.js';
import { attachStudyBody, attachStudyHead, prepareStudySpine, isCoveredActorPart, isOriginalActorHeadPart } from '../scene/src/study-body.js';
import { buildMmRest, createSurfaceSelection } from '../scene/src/mapped-mesh.js';
import { GROUPS, phaseAt, phaseTicks } from '../scene/src/phase.js';
import { resolveGroup, MUSCLE_BY_ID } from '../scene/src/legacy/muscle-map.js';

// Independent local-source checks. They work in a fresh clone without the ZIP
// extraction directory and do not stand in for browser or real-device QA.
const scene = fileURLToPath(new URL('../scene/', import.meta.url));
const file = relative => path.join(scene, relative);
const json = relative => JSON.parse(fs.readFileSync(file(relative), 'utf8'));
const hash = relative => crypto.createHash('sha256').update(fs.readFileSync(file(relative))).digest('hex');
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.location ??= { search: '' };
async function load(relative) {
  let bytes = fs.readFileSync(file(relative));
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = gunzipSync(bytes);
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
}

const rig = json('public/coach/coach-rig.json');
const timing = json('src/v38-clock.json');
const sequence = json('source/coach/flare-sequence-v38.json');
const phases = json('src/v38-phases.json');
const clock = createBakedClock(timing);
const manifest = json('tools/v38-source-manifest.json');
assert.equal(manifest.packageSha256, 'bce665b282faa003bcc84836e420930a2e8a54d31a709f34ea189f1c56210dee');
for (const item of manifest.files) {
  assert.equal(hash(item.destination), item.sha256, 'v38 provenance changed: ' + item.destination);
  assert.equal(fs.statSync(file(item.destination)).size, item.bytes);
}
const [source, runtime, original, studySource, headSource] = await Promise.all([
  load('source/coach/flare-coach-v38-animated.glb'),
  load('public/coach/flare-coach-v38-animated.meshopt.glb.gz'),
  load('source/coach/flare-coach.glb'),
  load('public/coach/flare-coach-study-body.meshopt.glb.gz'),
  load('public/coach/flare-coach-study-head.meshopt.glb.gz'),
]);
assert.equal(hash('source/coach/flare-coach-v38-animated.glb'),
  'bd2f5cb722a16e342486bda435574ac0e2aa632d2843d32d7420d64bcd386ff5', 'Incoming v38 source changed');
assert.equal(hash('source/coach/flare-sequence-v38.json'),
  'a8657eaa85bc971cab9fe5e119fada9192c07efbc80b4c32560cad0fb7f38184', 'Incoming v38 poses changed');

const meshesOf = model => { const result = []; model.traverse(mesh => { if (mesh.isSkinnedMesh) result.push(mesh); }); return result; };
const sourceMeshes = meshesOf(source.scene), runtimeMeshes = meshesOf(runtime.scene);
assert.equal(runtimeMeshes.length, sourceMeshes.length, 'Compression changed mesh count');
let losslessAttributeValues = 0, triangleCyclicRotations = 0, inverseBindValues = 0;
for (let index = 0; index < sourceMeshes.length; index++) {
  const a = sourceMeshes[index], b = runtimeMeshes[index];
  assert.equal(a.name, b.name);
  assert.deepEqual(a.matrix.toArray(), b.matrix.toArray(), 'Compression changed mesh transforms');
  const sourceMaterials = [].concat(a.material), runtimeMaterials = [].concat(b.material);
  assert.equal(sourceMaterials.length, runtimeMaterials.length);
  for (let slot = 0; slot < sourceMaterials.length; slot++) {
    const before = sourceMaterials[slot], after = runtimeMaterials[slot];
    assert.equal(before.type, after.type);
    for (const field of ['color', 'emissive']) assert.deepEqual(before[field]?.toArray(), after[field]?.toArray());
    for (const field of ['roughness', 'metalness', 'opacity', 'transparent', 'side', 'alphaTest', 'vertexColors'])
      assert.equal(before[field], after[field], 'Compression changed authored material ' + field);
  }
  assert.deepEqual(Object.keys(a.geometry.attributes).sort(), Object.keys(b.geometry.attributes).sort());
  for (const [name, before] of Object.entries(a.geometry.attributes)) {
    const after = b.geometry.attributes[name];
    assert.equal(before.count, after.count); assert.equal(before.itemSize, after.itemSize);
    for (let vertex = 0; vertex < before.count; vertex++) for (let component = 0; component < before.itemSize; component++) {
      assert.equal(before.getComponent(vertex, component), after.getComponent(vertex, component), 'Compression changed ' + a.name + ':' + name);
      losslessAttributeValues++;
    }
  }
  const originalIndices = a.geometry.index.array, compressedIndices = b.geometry.index.array;
  assert.equal(originalIndices.length, compressedIndices.length);
  for (let i = 0; i < originalIndices.length; i += 3) {
    let rotation = -1;
    for (let k = 0; k < 3; k++) if ([0, 1, 2].every(j => originalIndices[i + j] === compressedIndices[i + (j + k) % 3])) { rotation = k; break; }
    assert.ok(rotation >= 0, 'Compression changed triangle winding/order');
    if (rotation) triangleCyclicRotations++;
  }
  assert.equal(a.skeleton.bones.length, 22); assert.equal(b.skeleton.bones.length, 22);
  assert.deepEqual(a.skeleton.bones.map(bone => bone.name), b.skeleton.bones.map(bone => bone.name));
  for (let i = 0; i < 22; i++) {
    assert.deepEqual(a.skeleton.boneInverses[i].toArray(), b.skeleton.boneInverses[i].toArray()); inverseBindValues += 16;
  }
  assert.deepEqual(a.bindMatrix.toArray(), b.bindMatrix.toArray());
}

assert.equal(source.animations.length, 1); assert.equal(runtime.animations.length, 1);
const clip = runtime.animations[0];
assert.equal(clip.name, 'flare_v38_loop'); assert.equal(clip.tracks.length, 44);
assert.equal(clip.duration, source.animations[0].duration);
let losslessTrackValues = 0;
for (let i = 0; i < clip.tracks.length; i++) {
  const a = source.animations[0].tracks[i], b = clip.tracks[i];
  assert.equal(a.name, b.name); assert.equal(a.getInterpolation(), b.getInterpolation());
  assert.equal(b.times.length, 540); assert.equal(b.getInterpolation(), THREE.InterpolateLinear);
  assert.deepEqual(a.times, b.times); assert.deepEqual(a.values, b.values);
  assert.ok(b.values.every(Number.isFinite));
  const size = b.getValueSize();
  for (let component = 0; component < size; component++)
    assert.equal(b.values[component], b.values[(b.times.length - 1) * size + component], 'Loop track seam changed');
  for (let frame = 1; frame < b.times.length; frame++) assert.ok(b.times[frame] > b.times[frame - 1], 'Nonmonotonic animation time');
  losslessTrackValues += b.times.length + b.values.length;
}

assert.equal(timing.frameTimes.length, 540); assert.equal(timing.sequenceTime.length, 540);
assert.equal(clock.period, 9); assert.ok(Math.abs(clock.duration - clip.duration) < 1e-5);
let clockRoundtripError = 0;
for (let i = 0; i < timing.frameTimes.length; i++) {
  if (i) { assert.ok(timing.frameTimes[i] > timing.frameTimes[i - 1]); assert.ok(timing.sequenceTime[i] > timing.sequenceTime[i - 1]); }
  clockRoundtripError = Math.max(clockRoundtripError, Math.abs(clock.toSequence(clock.toWall(timing.sequenceTime[i])) - timing.sequenceTime[i]));
  assert.ok(Math.abs(clock.toWall(timing.sequenceTime[i]) - timing.frameTimes[i]) < 1e-9);
  const phase = phaseAt(timing.sequenceTime[i]), incoming = phases.frames[i];
  assert.equal(phase.source, incoming.phaseSource); assert.equal(phase.support, incoming.support);
  assert.deepEqual(phase.items.map(item => [item.groupId, item.side, item.level]),
    ['primary', 'secondary'].flatMap(level => incoming[level].map(item => [item.id, item.side, level])), 'Phase/muscle synchronization changed');
}
assert.ok(clockRoundtripError < 1e-12, 'Sequence/wall domain roundtrip drift');
for (const speed of [0.25, 0.5, 1, 1.5]) {
  const start = 2.37, wall = clock.toWall(start), advance = 0.143;
  assert.ok(Math.abs(clock.toWall(clock.advance(start, advance, speed)) - wall - advance * speed) < 1e-12, 'Applied a second pacing pass');
  assert.ok(Math.abs(clock.advance(start, clock.duration / speed, speed) - start) < 1e-10, 'Whole-loop duration changed');
  const range = [3, 4], rangeDuration = clock.toWall(4) - clock.toWall(3);
  assert.ok(Math.abs(clock.advance(3.4, rangeDuration / speed, speed, range) - 3.4) < 1e-10, 'Range loop changed paused domain');
}

const historical = createCoachMotion({ model: original.scene, rigData: rig });
historical.setSequence(sequence.steps, { period: sequence.period });
let motion = createBakedMotion(runtime, rig, clock);
const a = new THREE.Vector3(), b = new THREE.Vector3();
const originalBody = original.scene.getObjectByName('Coach_Body'), currentBody = runtime.scene.getObjectByName('Coach_Body');
let maxBoneError = 0, maxSkinError = 0, maxMetricError = 0, worstBone = null;
for (let frame = 0; frame < timing.frameTimes.length; frame++) {
  const time = timing.sequenceTime[frame]; historical.update(time); motion.update(time);
  original.scene.updateMatrixWorld(true); runtime.scene.updateMatrixWorld(true);
  originalBody.skeleton.update(); currentBody.skeleton.update();
  for (const bone of currentBody.skeleton.bones) {
    const error = original.scene.getObjectByName(bone.name).getWorldPosition(a).distanceTo(bone.getWorldPosition(b));
    if (error > maxBoneError) { maxBoneError = error; worstBone = { frame, bone: bone.name, time }; }
  }
  for (let vertex = 0; vertex < originalBody.geometry.attributes.position.count; vertex += 97) {
    originalBody.getVertexPosition(vertex, a).applyMatrix4(originalBody.matrixWorld);
    currentBody.getVertexPosition(vertex, b).applyMatrix4(currentBody.matrixWorld);
    maxSkinError = Math.max(maxSkinError, a.distanceTo(b));
  }
  const actual = motion.getMetrics(), expected = historical.getMetrics();
  for (const [name, value] of Object.entries(actual.joints)) {
    assert.ok(value.every(Number.isFinite), 'Nonfinite compatibility joint ' + name);
    if (expected.joints[name]) maxMetricError = Math.max(maxMetricError, a.fromArray(value).distanceTo(b.fromArray(expected.joints[name])));
  }
}
// Source timing JSON is rounded to six decimals. Include that quantization,
// rather than comparing it with the author's more precise unrounded bake.
assert.ok(maxBoneError < 0.001, 'Baked bones differ from supplied v38 by >=1mm');
assert.ok(maxSkinError < 0.001, 'Baked skin differs from supplied v38 by >=1mm');
assert.ok(maxMetricError < 0.001, 'Compatibility landmarks differ from supplied runtime by >=1mm');
motion.reset();
const neutralStudyVertices = new Map();
for (const gltf of [studySource, headSource]) for (const mesh of meshesOf(gltf.scene)) {
  gltf.scene.updateMatrixWorld(true); mesh.skeleton.update();
  const vertices = [];
  for (let vertex = 0; vertex < mesh.geometry.attributes.position.count; vertex += 97)
    vertices.push(mesh.getVertexPosition(vertex, a).applyMatrix4(mesh.matrixWorld).clone());
  neutralStudyVertices.set(mesh.name, vertices);
}
prepareStudySpine(studySource.scene, rig); prepareStudySpine(headSource.scene, rig);
const studyBody = attachStudyBody(runtime.scene, studySource.scene);
const studyHead = attachStudyHead(runtime.scene, headSource.scene);
motion.dispose();
motion = createBakedMotion(runtime, rig, clock);
for (const mesh of [studyBody, studyHead]) {
  assert.equal(mesh.skeleton.bones.length, 22, 'Restored study skin misses baked waist helpers');
  assert.deepEqual(mesh.skeleton.bones.map(bone => bone.name), currentBody.skeleton.bones.map(bone => bone.name));
  for (const inverse of mesh.skeleton.boneInverses) assert.ok(inverse.elements.every(Number.isFinite), 'Invalid study inverse bind');
  const { skinIndex, skinWeight } = mesh.geometry.attributes;
  let helperVertices = 0;
  for (let vertex = 0; vertex < skinIndex.count; vertex++) {
    let total = 0, helper = false;
    for (let component = 0; component < 4; component++) {
      const index = skinIndex.getComponent(vertex, component), weight = skinWeight.getComponent(vertex, component);
      assert.ok(index >= 0 && index < 22); assert.ok(weight >= 0 && weight <= 1.000001); total += weight;
      if (weight > 0 && /^spine(?:Lower|Upper)$/.test(mesh.skeleton.bones[index].name)) helper = true;
    }
    assert.ok(Math.abs(total - 1) < 1e-5, 'Unnormalized study skin weights'); if (helper) helperVertices++;
  }
  if (mesh.userData.studySkin) assert.ok(helperVertices > 100, 'Study body retains rigid original 20-bone waist');
  mesh.skeleton.update();
  const neutral = neutralStudyVertices.get(mesh.userData.studySkin ? 'Coach_Body' : 'Coach_Study_Head');
  for (let vertex = 0, probe = 0; vertex < mesh.geometry.attributes.position.count; vertex += 97, probe++) {
    mesh.getVertexPosition(vertex, a).applyMatrix4(mesh.matrixWorld);
    assert.ok(a.distanceTo(neutral[probe]) < 1e-6, 'Restored study binding changed the neutral surface');
  }
}

motion.update(2.37);
const beforeMap = motion.getMetrics();
const mapped = buildMmRest(motion, runtime.scene);
assert.deepEqual(motion.getMetrics().joints, beforeMap.joints, 'Mapping changed the paused v38 pose');
assert.equal(motion.getMetrics().time, beforeMap.time);
for (const mesh of mapped) {
  assert.equal(mesh.geometry.attributes.mmRest.count, mesh.geometry.attributes.position.count);
  assert.ok(mesh.geometry.attributes.mmRest.array.every(Number.isFinite), 'Nonfinite mapped study surface');
}
const selection = createSurfaceSelection(mapped);
const originals = new Map(mapped.map(mesh => [mesh, { material: mesh.material, visible: mesh.visible }]));
const covered = mapped.filter(mesh => !mesh.userData.studySkin && isCoveredActorPart(mesh));
const face = mapped.filter(mesh => !mesh.userData.studyHead && isOriginalActorHeadPart(mesh));
assert.ok(covered.length >= 3); assert.ok(face.length >= 8);
let selectionCases = 0, studySamples = 0;
for (const tick of phaseTicks) {
  motion.update(tick.time); const frozen = motion.getMetrics();
  for (const groupId of Object.keys(GROUPS)) {
    selection.show(groupId, phaseAt(tick.time).items, true);
    const state = selection.getState();
    assert.deepEqual(state.selectedPanels, resolveGroup(groupId).muscles.map(id => MUSCLE_BY_ID[id].index).sort((a, b) => a - b), 'Other phase groups remain highlighted');
    const sourceSide = phaseAt(tick.time).items.find(item => item.groupId === groupId)?.side ?? 'both';
    assert.equal(state.side, sourceSide === 'left' ? 1 : sourceSide === 'right' ? -1 : 0);
    assert.equal(state.colour, '#e58b90'); assert.equal(state.base, '#d3c7ad');
    assert.equal(studyBody.visible, true); assert.equal(studyHead.visible, true);
    for (const mesh of [...covered, ...face]) assert.equal(mesh.visible, false, 'Detail did not hide original clothes/face');
    for (const mesh of [studyBody, studyHead]) {
      assert.equal(mesh.material.isMeshPhysicalMaterial, true); assert.ok(mesh.material.roughness >= 0.75, 'Study surface is glossy');
      mesh.skeleton.update();
      for (let vertex = 0; vertex < mesh.geometry.attributes.position.count; vertex += 97) {
        mesh.getVertexPosition(vertex, a).applyMatrix4(mesh.matrixWorld);
        assert.ok(a.toArray().every(Number.isFinite), 'Invalid animated study skin vertex'); studySamples++;
      }
    }
    assert.deepEqual(motion.getMetrics().joints, frozen.joints, 'Detail selection changed paused pose');
    assert.equal(motion.getMetrics().time, tick.time);
    selection.restore();
    for (const mesh of mapped) { assert.equal(mesh.material, originals.get(mesh).material); assert.equal(mesh.visible, originals.get(mesh).visible); }
    selectionCases++;
  }
}
assert.equal(selectionCases, 136);
selection.dispose(); motion.dispose();
console.log(JSON.stringify({ status: 'passed', scope: 'v38-baked-playback-and-restored-detail-mannequin',
  localSourcesOnly: true, frames: 540, tracks: clip.tracks.length, bones: 22, loopDurationAt1xSeconds: clock.duration,
  loopDurationAtHalfSpeedSeconds: clock.duration * 2, clockRoundtripError, losslessAttributeValues,
  triangleCyclicRotations, inverseBindValues, losslessTrackValues, boneMaxErrorMm: maxBoneError * 1000,
  skinMaxErrorMm: maxSkinError * 1000, compatibilityJointMaxErrorMm: maxMetricError * 1000, worstBone,
  skinVertexStride: 97, selectedGroups: Object.keys(GROUPS).length, selectedPhases: phaseTicks.length,
  selectionCases, studyVertexSamples: studySamples, studyWaistHelpersBound: true,
  originalMaterialIdentityAndVisibilityRestored: true,
  limitation: 'Does not verify visual shader output, real browser clicking, or native device performance.' }, null, 2));
