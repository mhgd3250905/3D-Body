import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from '../scene/node_modules/three/build/three.module.js';
import { captureRuntime, compareCapture, loadGlb, readJson, sceneFile, sha256, verifyMirror, names } from '../scene/tools/bake-v41-node.mjs';
import { installSpineHelpers } from '../scene/source/v41-runtime/src/spine-helpers.js';
import { createBakedClock, createBakedMotion } from '../scene/src/baked-motion.js';
import { buildMmRest, createSurfaceSelection } from '../scene/src/mapped-mesh.js';
import { isCoveredActorPart, isOriginalActorHeadPart } from '../scene/src/study-body.js';
import { GROUPS, phaseAt, phaseTicks } from '../scene/src/phase.js';
import { resolveGroup, MUSCLE_BY_ID } from '../scene/src/legacy/muscle-map.js';
import { createCoachMotion as createRootMotion } from '../../src/coach-motion.js';
import { BodyViewer as RootViewer } from '../../src/viewer.js';
import { phaseTimeline, samplePhase, phaseItems } from '../scene/source/v41-runtime/src/flare-phase-muscles.js';

// Checks current root v41 runtime against the App's actual AnimationMixer
// boundary, independently from the retained immutable bake source mirror.
const manifest = readJson('tools/v41-source-manifest.json'); verifyMirror();
assert.equal(manifest.commit, '53d72b412840a942fefc818836b68ad2a2d7e0d1');
for (const item of manifest.files) {
  const bytes = fs.readFileSync(sceneFile(item.destination));
  assert.equal(bytes.length, item.bytes); assert.equal(sha256(bytes), item.sha256, 'v41 provenance changed: ' + item.destination);
}
assert.equal(sha256(fs.readFileSync(new URL('../../public/coach/flare-coach.glb', import.meta.url))), manifest.originalAssetSha256, 'Web/App source model differs');
const rig = readJson('source/coach/coach-v41-rig.json'), sequence = readJson('source/coach/flare-sequence-v41.json');
const timing = readJson('src/v41-clock.json'), phases = readJson('src/v41-phases.json'), clock = createBakedClock(timing);
const source = await loadGlb('source/coach/flare-coach-v41-animated.glb');
const runtime = await loadGlb('public/coach/flare-coach-v41-animated.meshopt.glb.gz');
const meshesOf = scene => { const result = []; scene.traverse(mesh => { if (mesh.isSkinnedMesh) result.push(mesh); }); return result; };

// Raw original is loaded afresh before any motion/helper initialization.
const rawOriginal = await loadGlb('source/coach/flare-coach-v41-base.glb');
const rawMeshes = meshesOf(rawOriginal.scene), sourceMeshes = meshesOf(source.scene), runtimeMeshes = meshesOf(runtime.scene);
assert.equal(rawMeshes.length, sourceMeshes.length); assert.equal(sourceMeshes.length, runtimeMeshes.length);
let rawPositionValues = 0, normalizedNormalMaxError = 0, rawNormalNormalizationMaxDiff = 0;
for (let i = 0; i < rawMeshes.length; i++) {
  const raw = rawMeshes[i], baked = sourceMeshes[i]; assert.equal(raw.name, baked.name);
  assert.equal(raw.skeleton.bones.length, 20, 'Raw model was already changed by runtime helpers');
  assert.equal(baked.skeleton.bones.length, 22);
  const before = raw.geometry.attributes.position, after = baked.geometry.attributes.position;
  assert.equal(before.count, after.count); assert.deepEqual(raw.geometry.index.array, baked.geometry.index.array);
  for (let vertex = 0; vertex < before.count; vertex++) for (let component = 0; component < 3; component++) {
    assert.equal(before.getComponent(vertex, component), after.getComponent(vertex, component), 'Bake changed original mesh position'); rawPositionValues++;
  }
  const p = new THREE.Vector3(), q = new THREE.Vector3(), rawNormal = raw.geometry.attributes.normal;
  let normalize = false;
  for (let vertex = 0; vertex < before.count; vertex++) if (Math.abs(p.fromBufferAttribute(rawNormal, vertex).length() - 1) > 0.0005) { normalize = true; break; }
  // Reproduce GLTFExporter's actual normalization: clone the existing typed
  // normalized attribute, then setXYZ. The source stores signed Int16 normals,
  // so writing the normalized values rounds again to that same representation.
  const NormalArray = (rawNormal.isInterleavedBufferAttribute ? rawNormal.data.array : rawNormal.array).constructor;
  const expectedNormal = new THREE.BufferAttribute(new NormalArray(before.count * 3), 3, rawNormal.normalized);
  for (let vertex = 0; vertex < before.count; vertex++) {
    p.fromBufferAttribute(rawNormal, vertex);
    if (normalize) { if (p.lengthSq() === 0) p.set(1, 0, 0); else p.normalize(); }
    expectedNormal.setXYZ(vertex, p.x, p.y, p.z);
    p.fromBufferAttribute(expectedNormal, vertex); q.fromBufferAttribute(baked.geometry.attributes.normal, vertex);
    normalizedNormalMaxError = Math.max(normalizedNormalMaxError, p.distanceTo(q));
    rawNormalNormalizationMaxDiff = Math.max(rawNormalNormalizationMaxDiff, q.distanceTo(p.fromBufferAttribute(rawNormal, vertex)));
  }
  const rawMaterials = [].concat(raw.material), bakedMaterials = [].concat(baked.material); assert.equal(rawMaterials.length, bakedMaterials.length);
  for (let slot = 0; slot < rawMaterials.length; slot++) {
    const a = rawMaterials[slot], b = bakedMaterials[slot]; assert.equal(a.type, b.type);
    for (const field of ['color', 'emissive']) assert.deepEqual(a[field]?.toArray(), b[field]?.toArray());
    for (const field of ['roughness', 'metalness', 'opacity', 'transparent', 'side', 'alphaTest', 'vertexColors']) assert.equal(a[field], b[field]);
  }
}
assert.equal(normalizedNormalMaxError, 0, 'Baked normals differ from typed normalized original');

// Independently reproduce only the helper-weight redistribution on a second
// fresh input, then compare it with the permanent baked 22-bone skin.
const helperInput = await loadGlb('source/coach/flare-coach-v41-base.glb'); helperInput.scene.updateMatrixWorld(true);
const preparedMeshes = meshesOf(helperInput.scene), skeletons = new Set(preparedMeshes.map(mesh => mesh.skeleton));
assert.ok(installSpineHelpers({ model: helperInput.scene, meshes: preparedMeshes, skeletons, landmarks: rig.landmarks }));
let helperWeightValues = 0;
for (let i = 0; i < preparedMeshes.length; i++) for (const name of ['skinIndex', 'skinWeight']) {
  const a = preparedMeshes[i].geometry.attributes[name], b = sourceMeshes[i].geometry.attributes[name];
  for (let vertex = 0; vertex < a.count; vertex++) for (let component = 0; component < a.itemSize; component++) {
    assert.equal(a.getComponent(vertex, component), b.getComponent(vertex, component), 'Baked helper weights differ'); helperWeightValues++;
  }
}
let losslessAttributeValues = 0, triangleCyclicRotations = 0, inverseBindValues = 0;
for (let i = 0; i < sourceMeshes.length; i++) {
  const a = sourceMeshes[i], b = runtimeMeshes[i]; assert.equal(a.name, b.name); assert.deepEqual(a.matrix.toArray(), b.matrix.toArray());
  assert.deepEqual(Object.keys(a.geometry.attributes).sort(), Object.keys(b.geometry.attributes).sort());
  for (const [name, before] of Object.entries(a.geometry.attributes)) {
    const after = b.geometry.attributes[name]; assert.equal(before.count, after.count); assert.equal(before.itemSize, after.itemSize);
    for (let vertex = 0; vertex < before.count; vertex++) for (let component = 0; component < before.itemSize; component++) {
      assert.equal(before.getComponent(vertex, component), after.getComponent(vertex, component), 'Compression changed model attribute'); losslessAttributeValues++;
    }
  }
  const ai = a.geometry.index.array, bi = b.geometry.index.array; assert.equal(ai.length, bi.length);
  for (let j = 0; j < ai.length; j += 3) {
    let rotation = -1; for (let k = 0; k < 3; k++) if ([0, 1, 2].every(component => ai[j + component] === bi[j + (component + k) % 3])) { rotation = k; break; }
    assert.ok(rotation >= 0, 'Compression changed triangle'); if (rotation) triangleCyclicRotations++;
  }
  assert.equal(b.skeleton.bones.length, 22); assert.deepEqual(a.skeleton.bones.map(bone => bone.name), b.skeleton.bones.map(bone => bone.name));
  assert.deepEqual(a.bindMatrix.toArray(), b.bindMatrix.toArray());
  for (let j = 0; j < 22; j++) { assert.deepEqual(a.skeleton.boneInverses[j].toArray(), b.skeleton.boneInverses[j].toArray()); inverseBindValues += 16; }
}
assert.equal(source.animations.length, 1); assert.equal(runtime.animations.length, 1);
const clip = runtime.animations[0]; assert.equal(clip.name, 'flare_v41_loop'); assert.equal(clip.tracks.length, 44);
let losslessTrackValues = 0, seamTrackMaxError = 0;
for (let i = 0; i < clip.tracks.length; i++) {
  const a = source.animations[0].tracks[i], b = clip.tracks[i]; assert.equal(a.name, b.name); assert.deepEqual(a.times, b.times); assert.deepEqual(a.values, b.values);
  assert.equal(b.times.length, timing.frameTimes.length); assert.equal(b.getInterpolation(), THREE.InterpolateLinear);
  const size = b.getValueSize();
  for (let component = 0; component < size; component++) seamTrackMaxError = Math.max(seamTrackMaxError, Math.abs(b.values[component] - b.values[(b.times.length - 1) * size + component]));
  assert.ok(b.values.every(Number.isFinite)); losslessTrackValues += b.times.length + b.values.length;
}
assert.equal(seamTrackMaxError, 0);
const capture = await captureRuntime(), liveParity = compareCapture(runtime, capture);
const rootGltf = await loadGlb('source/coach/flare-coach-v41-base.glb');
const rootMotion = createRootMotion({ model: rootGltf.scene, rigData: rig });
rootMotion.setSequence(sequence.steps, { period: sequence.period, corrections: sequence.corrections, legPath: sequence.legPath,
  interpolation: sequence.interpolation, skippedSteps: sequence.skippedSteps, footCurves: sequence.footCurves, segmentGuides: sequence.segmentGuides });
const rootViewer = { coach: rootGltf.scene, motion: rootMotion, speed: 1, time: 0, pacing: null, pacingDisabled: false };
for (const key of ['computePacing', 'pacingRate', 'paceStep']) rootViewer[key] = RootViewer.prototype[key];
rootViewer.pacing = rootViewer.computePacing();
assert.equal(rootViewer.pacing.length, capture.pacing.length);
const rootPacingMaxError = Math.max(...rootViewer.pacing.map((value, i) => Math.abs(value - capture.pacing[i])));
assert.ok(rootPacingMaxError < 1e-12, 'Root/App source paced clock differs');
const motion = createBakedMotion(runtime, rig), rootBody = rootGltf.scene.getObjectByName('Coach_Body'), body = runtime.scene.getObjectByName('Coach_Body');
assert.equal(motion.getMetrics().motionRevision, 'v41'); assert.equal(motion.getMetrics().playback, 'AnimationMixer');
let rootBoneMaxErrorMm = 0, rootSkinMaxErrorMm = 0, rootMatrixMaxError = 0, clockRoundtripError = 0, rootMinFootHeight = Infinity;
const timeline = phaseTimeline(sequence, { smooth: true }), p = new THREE.Vector3(), q = new THREE.Vector3();
for (let i = 0; i < timing.frameTimes.length; i++) {
  const time = timing.sequenceTime[i]; rootMotion.update(time); motion.update(time);
  rootGltf.scene.updateMatrixWorld(true); runtime.scene.updateMatrixWorld(true); rootBody.skeleton.update(); body.skeleton.update();
  rootMinFootHeight = Math.min(rootMinFootHeight, rootMotion.getMetrics().minFootHeight);
  for (const name of names) {
    const rootBone = rootGltf.scene.getObjectByName(name), appBone = runtime.scene.getObjectByName(name);
    rootBoneMaxErrorMm = Math.max(rootBoneMaxErrorMm, rootBone.getWorldPosition(p).distanceTo(appBone.getWorldPosition(q)) * 1000);
    for (let component = 0; component < 16; component++) rootMatrixMaxError = Math.max(rootMatrixMaxError, Math.abs(rootBone.matrixWorld.elements[component] - appBone.matrixWorld.elements[component]));
  }
  for (let vertex = 0; vertex < rootBody.geometry.attributes.position.count; vertex += 97) {
    rootBody.getVertexPosition(vertex, p).applyMatrix4(rootBody.matrixWorld); body.getVertexPosition(vertex, q).applyMatrix4(body.matrixWorld);
    rootSkinMaxErrorMm = Math.max(rootSkinMaxErrorMm, p.distanceTo(q) * 1000);
  }
  clockRoundtripError = Math.max(clockRoundtripError, Math.abs(clock.toSequence(clock.toWall(time)) - time));
  assert.equal(phaseAt(time).source, phases.frames[i].phaseSource); assert.equal(phaseAt(time).support, phases.frames[i].support);
  const rootSample = samplePhase(timeline, time).current;
  assert.deepEqual(phaseAt(time).items.map(item => [item.groupId, item.side, item.level]), phaseItems(rootSample.phase, rootSample.support).map(item => [item.groupId, item.side, item.level]));
}
assert.ok(rootBoneMaxErrorMm < 0.01 && rootSkinMaxErrorMm < 0.01 && rootMatrixMaxError < 1e-5, 'Default root/App v41 pose differs');
assert.ok(clockRoundtripError < 1e-12);
for (const speed of [0.25, 0.5, 1]) {
  const start = 2.37, delta = 0.143;
  assert.ok(Math.abs(clock.toWall(clock.advance(start, delta, speed)) - clock.toWall(start) - delta * speed) < 1e-12);
  assert.ok(Math.abs(clock.advance(start, clock.duration / speed, speed) - start) < 1e-10);
}

motion.update(2.37); const frozenBeforeMapping = motion.getMetrics();
const mapped = buildMmRest(motion, runtime.scene); assert.deepEqual(motion.getMetrics().joints, frozenBeforeMapping.joints);
const originals = new Map(mapped.map(mesh => [mesh, { material: mesh.material, visible: mesh.visible }]));
const selection = createSurfaceSelection(mapped); let selectionCases = 0, tintedCases = 0, curatedAngles = 0, groinLeaks = 0, handLeaks = 0;
for (const tick of phaseTicks) {
  motion.update(tick.time); const frozen = motion.getMetrics();
  for (const groupId of Object.keys(GROUPS)) {
    selection.show(groupId, phaseAt(tick.time).items, false);
    for (const mesh of mapped) assert.equal(mesh.material, originals.get(mesh).material, 'Home changed original material');
    selection.show(groupId, phaseAt(tick.time).items, true);
    const state = selection.getState(); assert.equal(state.groupId, groupId);
    assert.deepEqual(state.selectedPanels, resolveGroup(groupId).muscles.map(id => MUSCLE_BY_ID[id].index).sort((a, b) => a - b));
    let tinted = false;
    for (const mesh of mapped) {
      assert.equal(mesh.visible, originals.get(mesh).visible); assert.ok(!mesh.userData.studySkin && !mesh.userData.studyHead);
      if (isCoveredActorPart(mesh)) {
        const before = [].concat(originals.get(mesh).material), after = [].concat(mesh.material); assert.equal(before.length, after.length);
        for (let slot = 0; slot < after.length; slot++) {
          assert.ok(selection.isProxy(after[slot])); assert.equal(after[slot].type, before[slot].type);
          for (const field of ['color', 'emissive']) assert.deepEqual(after[slot][field]?.toArray(), before[slot][field]?.toArray());
          for (const field of ['roughness', 'metalness', 'opacity', 'transparent', 'side', 'alphaTest', 'map', 'normalMap']) assert.equal(after[slot][field], before[slot][field]);
        }
        const weights = mesh.geometry.attributes.focusW.array, rest = mesh.geometry.attributes.mmRest;
        for (let vertex = 0; vertex < weights.length; vertex++) {
          assert.ok(Number.isFinite(weights[vertex]) && weights[vertex] >= 0 && weights[vertex] <= 1.000001);
          if (weights[vertex] <= 0.05) continue; tinted = true; p.fromBufferAttribute(rest, vertex);
          if (Math.abs(p.x) < 0.07 && p.y > 0.72 && p.y < 0.90) groinLeaks++;
          if (Math.abs(p.x) > 0.36 && p.y < 0.88) handLeaks++;
        }
      } else assert.equal(mesh.material, originals.get(mesh).material, 'Tint replaced face/hair/hands/shoes');
      if (isOriginalActorHeadPart(mesh)) assert.equal(mesh.material, originals.get(mesh).material);
    }
    if (tinted) { tintedCases++; const direction = selection.focusDirection(); assert.ok(direction && direction.y >= 0.11 && Math.abs(direction.length() - 1) < 1e-6); curatedAngles++; }
    assert.deepEqual(motion.getMetrics().joints, frozen.joints); assert.equal(motion.getMetrics().time, tick.time);
    selection.restore(); for (const mesh of mapped) assert.equal(mesh.material, originals.get(mesh).material); selectionCases++;
  }
}
assert.equal(selectionCases, 136); assert.ok(tintedCases >= selectionCases * 0.8); assert.equal(groinLeaks, 0); assert.equal(handLeaks, 0);
selection.dispose(); motion.dispose();
const evidence = { status: 'passed', scope: 'v41-source-bake-compression-root-vs-app-clock-phases-and-clothed-selection', commit: manifest.commit,
  frames: timing.frameTimes.length, tracks: 44, bones: 22, rawPositionValues, normalizedNormalMaxError, rawNormalNormalizationMaxDiff, helperWeightValues,
  losslessAttributeValues, triangleCyclicRotations, inverseBindValues, losslessTrackValues, seamTrackMaxError,
  rootBoneMaxErrorMm, rootSkinMaxErrorMm, rootMatrixMaxError, clockRoundtripError, rootPacingMaxError,
  rootMinFootHeightMm: rootMinFootHeight * 1000, liveParity,
  selectionCases, tintedCases, curatedAngles, groinLeaks, handLeaks, originalFaceMaterialIdentity: true, runtimeStudyAttached: false,
  limitation: 'CPU parity is not browser shader output, full-surface floor acceptance, native device performance, or clinical validation.' };
fs.writeFileSync(sceneFile('tools/evidence/v41-verify.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ ...evidence, liveParity: { ...liveParity, probes: undefined } }, null, 2));
