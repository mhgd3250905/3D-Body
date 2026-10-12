import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import * as THREE from 'three';
import { loadGlb, readJson } from './bake-v41-node.mjs';
import { createBakedMotion } from '../src/baked-motion.js';
import { buildMmRest } from '../src/mapped-mesh.js';
import { createHotspotDepth } from '../src/hotspot-depth.js';
import { GROUPS, phaseTicks } from '../src/phase.js';

const gltf = await loadGlb('public/coach/flare-coach-v41-animated.meshopt.glb.gz');
const motion = createBakedMotion(gltf, readJson('source/coach/coach-v41-rig.json'));
const skinned = buildMmRest(motion, gltf.scene);
const originals = skinned.map(mesh => ({ mesh, geometry: mesh.geometry, material: mesh.material, visible: mesh.visible }));
motion.reset();
const camera = new THREE.PerspectiveCamera(32, 1, .02, 40);
const player = { coach: gltf.scene, camera, time: -1, getMetrics: () => motion.getMetrics() };
const before = motion.getMetrics();
const started = performance.now(), depth = createHotspotDepth(player, skinned), creationMs = performance.now() - started;
assert.deepEqual(motion.getMetrics(), before, 'building callout metadata must not seek or change the actor');
const aim = (x, y, z, centre = new THREE.Vector3(0, .9, 0)) => { camera.position.set(x, y, z); camera.lookAt(centre); camera.updateMatrixWorld(true); };
const sample = (group, side = 'both', previous = null) => {
  const result = depth.sample(group, side, previous);
  assert.ok(result, 'mapped group has a surface anchor: ' + group + '/' + side);
  assert.ok(result.point.toArray().every(Number.isFinite));
  assert.ok(result.depth > 0 && Number.isFinite(result.depth));
  assert.ok(result.far >= 0 && result.far <= 1);
  assert.ok(result.facing >= -1.000001 && result.facing <= 1.000001);
  if (side !== 'both') assert.equal(result.side, side, 'a unilateral label cannot silently change side');
  return result;
};

// On the real athlete, a front-facing torso must not become "hidden" just
// because its former joint anchor was inside the body or its muscle is deep.
aim(0, .9, 3);
const frontAbs = sample('abs'), frontHip = sample('hip-flexors'), frontGlute = sample('glute-max');
assert.equal(frontAbs.occluded, false); assert.ok(frontAbs.facing > .8);
assert.equal(frontHip.occluded, false); assert.ok(frontHip.facing > .7, 'the hip anchor uses the outside of the shorts');
assert.equal(frontGlute.occluded, true); assert.ok(frontGlute.facing < -.5);
assert.ok(frontGlute.depth > frontAbs.depth && frontGlute.far > frontAbs.far, 'far is real camera-space depth');
aim(0, .9, -3);
const rearAbs = sample('abs'), rearHip = sample('hip-flexors'), rearGlute = sample('glute-max');
assert.equal(rearAbs.occluded, true); assert.equal(rearHip.occluded, true);
assert.equal(rearGlute.occluded, false); assert.ok(rearGlute.facing > .8);

// Every existing teaching group retains left/right coverage. These are the
// same atlas regions used by the coloured detail view, not invented joints.
let coverageCases = 0;
for (const group of Object.keys(GROUPS)) for (const side of ['left', 'right']) { sample(group, side); coverageCases++; }

aim(0, .9, 3); const near = sample('abs', 'left');
aim(0, .9, 6); const distantCamera = sample('abs', 'left');
assert.ok(Math.abs(near.far - distantCamera.far) < .012, 'camera orbit radius must not shrink/fade all cards together');
assert.ok(distantCamera.depth - near.depth > 2.9);

const reads = depth.getStats().vertexReads, orbitStarted = performance.now();
let previous = null;
for (let i = 0; i < 120; i++) {
  const angle = i / 120 * Math.PI * 2; aim(Math.sin(angle) * 3, 1.1, Math.cos(angle) * 3);
  for (const group of ['abs', 'glute-max', 'hip-flexors']) previous = sample(group, 'both', previous);
}
const orbitMs = performance.now() - orbitStarted;
assert.equal(depth.getStats().vertexReads, reads, 'camera rotation must not reskin the dense source actor');
assert.ok(depth.getStats().proxyVertices < 5000 && depth.getStats().proxyTriangles < 10000, 'occlusion uses a small surface proxy');

// Look for real crossed-body occlusion while facing the camera. Confirm a
// few examples with independent full-resolution Three raycasts; back-facing
// normals alone cannot establish these cases.
const exactRay = new THREE.Raycaster(), direction = new THREE.Vector3();
let checkedOccluders = 0, poseCases = 0, foundCrossedBody = 0;
for (const tick of phaseTicks.filter((_, i) => i % 2 === 0)) {
  motion.update(tick.time); player.time = tick.time;
  const frozen = motion.getMetrics(), target = new THREE.Vector3().fromArray(frozen.joints.pelvis);
  let preparedBounds = false;
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * Math.PI * 2;
    aim(target.x + Math.sin(angle) * 3, target.y + .5, target.z + Math.cos(angle) * 3, target);
    for (const group of ['abs', 'glute-max', 'hip-flexors', 'triceps']) {
      const value = sample(group); poseCases++;
      if (!value.occluded || value.facing < .3 || checkedOccluders >= 4) continue;
      foundCrossedBody++;
      if (!preparedBounds) {
        for (const mesh of skinned) { mesh.skeleton.update(); mesh.computeBoundingSphere(); mesh.computeBoundingBox(); }
        preparedBounds = true;
      }
      direction.subVectors(value.point, camera.position).normalize();
      exactRay.set(camera.position, direction);
      const hits = exactRay.intersectObjects(skinned.filter(mesh => mesh.visible), false);
      const first = hits[0];
      assert.ok(first && first.distance < camera.position.distanceTo(value.point) - .02,
        'the proxy must be supported by an actual source surface before the anchor: ' + group + '/' + tick.phase + '/' + i);
      checkedOccluders++;
    }
  }
  assert.deepEqual(motion.getMetrics().joints, frozen.joints);
}
assert.ok(foundCrossedBody >= 2 && checkedOccluders >= 2, 'actual occlusion is exercised in addition to back-facing normals');
for (const original of originals) {
  assert.equal(original.mesh.geometry, original.geometry);
  assert.equal(original.mesh.material, original.material);
  assert.equal(original.mesh.visible, original.visible);
}
console.log(JSON.stringify({ status: 'passed', scope: 'real-v41-callout-depth-surface-visibility', coverageCases, poseCases,
  checkedOccluders, creationMs: +creationMs.toFixed(2), orbit360SamplesMs: +orbitMs.toFixed(2),
  stats: depth.getStats(), limitation: 'CPU geometry/visibility checks; native visual acceptance remains with the user.' }, null, 2));
motion.dispose();
