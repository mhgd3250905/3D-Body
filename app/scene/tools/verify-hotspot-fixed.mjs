import assert from 'node:assert/strict';
import * as THREE from 'three';
import { loadGlb, readJson } from './bake-v41-node.mjs';
import { createBakedMotion } from '../src/baked-motion.js';
import { buildMmRest } from '../src/mapped-mesh.js';
import { createHotspotDepth } from '../src/hotspot-depth.js';

const gltf = await loadGlb('public/coach/flare-coach-v41-animated.meshopt.glb.gz');
const motion = createBakedMotion(gltf, readJson('source/coach/coach-v41-rig.json'));
const skinned = buildMmRest(motion, gltf.scene); motion.reset();
const camera = new THREE.PerspectiveCamera(32, 1, .02, 40);
const player = { coach: gltf.scene, camera, time: -1, getMetrics: () => motion.getMetrics() };
const depth = createHotspotDepth(player, skinned), groups = ['abs', 'hip-flexors', 'glute-max', 'triceps'];
const aim = angle => { camera.position.set(Math.sin(angle) * 3, .9, Math.cos(angle) * 3); camera.lookAt(0, .9, 0); camera.updateMatrixWorld(true); };
aim(0);
const initial = new Map(groups.map(group => [group, depth.sampleFixed(group)])), records = new Map(initial);
for (const record of records.values()) assert.ok(record?.candidateKey && Math.abs(record.normal.length() - 1) < 1e-10);
assert.equal(initial.get('abs').occluded, false);
const reads = depth.getStats().vertexReads;
let orbitCases = 0;
for (let step = 1; step <= 36; step++) {
  aim(step / 36 * Math.PI * 2);
  for (const group of groups) {
    const result = depth.sampleFixed(group, 'both', records.get(group)), start = initial.get(group);
    assert.equal(result.candidateKey, start.candidateKey, 'camera motion must not select another triangle');
    assert.equal(result.side, start.side, 'camera motion must not switch body side');
    assert.equal(result.point.distanceTo(start.point), 0, 'the anchor stays fixed in world space while orbiting');
    assert.equal(result.normal.distanceTo(start.normal), 0, 'surface normal follows the body, not the camera');
    if (step === 18 && group === 'abs') assert.equal(result.occluded, true, 'the same front anchor is now naturally behind the body');
    records.set(group, result); orbitCases++;
  }
}
assert.equal(depth.getStats().vertexReads, reads, 'orbiting fixed anchors does not reskin the actor');

const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), normal = new THREE.Vector3();
let poseCases = 0;
for (const time of [2.37, 6.25]) {
  motion.update(time); player.time = time; const frozen = motion.getMetrics();
  for (const group of groups) {
    const result = depth.sampleFixed(group, 'both', records.get(group)), start = initial.get(group);
    assert.equal(result.candidateKey, start.candidateKey, 'a new pose keeps the same source surface triangle');
    assert.equal(result.side, start.side); assert.ok(Math.abs(result.normal.length() - 1) < 1e-10);
    const [uuid, ...indices] = result.candidateKey.split(':'), mesh = skinned.find(value => value.uuid === uuid);
    mesh.getVertexPosition(+indices[0], a).applyMatrix4(mesh.matrixWorld);
    mesh.getVertexPosition(+indices[1], b).applyMatrix4(mesh.matrixWorld);
    mesh.getVertexPosition(+indices[2], c).applyMatrix4(mesh.matrixWorld);
    normal.subVectors(b, a).cross(c.clone().sub(a)).normalize();
    assert.ok(normal.distanceTo(result.normal) < 1e-10, 'normal is the actual outward posed face normal');
    assert.ok(a.add(b).add(c).multiplyScalar(1 / 3).distanceTo(result.point) < 1e-10);
    assert.ok(result.point.distanceTo(start.point) > .01, 'the anchor moves with its posed body surface');
    records.set(group, result); poseCases++;
  }
  assert.deepEqual(motion.getMetrics(), frozen);
}
const left = depth.sampleFixed('abs', 'left'), right = depth.sampleFixed('abs', 'right', left);
assert.equal(right.side, 'right'); assert.notEqual(left.candidateKey, right.candidateKey, 'an explicit allowed-side change may choose a new anchor');
assert.equal(depth.sampleFixed('missing-group', 'both', left), null, 'candidate keys cannot escape their requested group');
left.normal.set(0, 0, 0); left.point.set(99, 99, 99);
const restored = depth.sampleFixed('abs', 'left', left);
assert.ok(Math.abs(restored.normal.length() - 1) < 1e-10 && restored.point.length() < 5, 'returned vectors cannot mutate the retained source sample');
console.log(JSON.stringify({ status: 'passed', scope: 'real-v41-fixed-surface-callout-anchors', orbitCases, poseCases,
  retainsCandidateAndSide: true, tracksActualTriangleNormal: true, cameraOrbitVertexReads: depth.getStats().vertexReads - reads - 2 * reads,
  limitation: 'Geometry checks; billboard rasterization and native visual acceptance are separate.' }, null, 2));
motion.dispose();
