import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import * as THREE from 'three';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull.js';
import { loadGlb, readJson } from './bake-v41-node.mjs';
import { createBakedMotion } from '../src/baked-motion.js';

const gltf = await loadGlb('public/coach/flare-coach-v41-animated.meshopt.glb.gz');
const originals = [];
gltf.scene.traverse(mesh => { if (mesh.isSkinnedMesh) originals.push({ mesh, geometry: mesh.geometry, material: mesh.material, visible: mesh.visible }); });
const start = performance.now(), motion = createBakedMotion(gltf, readJson('source/coach/coach-v41-rig.json'));
const initializationMs = performance.now() - start;
const point = new THREE.Vector3(), camera = new THREE.PerspectiveCamera(32, .62, .02, 40), epsilon = 2e-6;
const gaps = [];
let vertices = 0, triangles = 0, groups = 0, points = 0, poseHullMs = 0, vertexReads = 0;
for (const { mesh } of originals) {
  const original = mesh.getVertexPosition;
  mesh.getVertexPosition = function (...args) { vertexReads++; return original.apply(this, args); };
}

for (const time of [0, 2.37, 6.25]) {
  motion.update(time); const before = motion.getMetrics(), reads = vertexReads, poseStart = performance.now();
  const local = motion.getBodyHulls(); poseHullMs += performance.now() - poseStart;
  assert.equal(local, motion.getBodyHulls(), 'a paused pose reuses the same hull arrays');
  assert.equal(vertexReads, reads, 'reading hulls must never traverse the dense skinned mesh');
  assert.deepEqual(motion.getMetrics(), before, 'a bounds query must not alter the pose, clock or metrics');
  groups = local.length; points = local.reduce((count, values) => count + values.length, 0);
  assert.ok(groups > 10 && groups <= 22 && points < 1000, 'the silhouette stays a small union of body regions');
  const hulls = local.map(values => ({ bounds: new THREE.Box3().setFromPoints(values).expandByScalar(epsilon),
    faces: new ConvexHull().setFromPoints(values).faces }));
  const contains = (hull, p) => hull.bounds.containsPoint(p) && hull.faces.every(face => face.distanceToPoint(p) <= epsilon);
  for (const { mesh } of originals) {
    mesh.skeleton.update();
    const count = mesh.geometry.attributes.position.count, membership = new Uint32Array(count), index = mesh.geometry.index;
    for (let i = 0; i < count; i++) {
      mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld);
      let mask = 0;
      for (let h = 0; h < hulls.length; h++) if (contains(hulls[h], point)) mask |= 1 << h;
      assert.notEqual(mask, 0, `source vertex escaped local hulls: ${mesh.name}/${i} at ${time}`);
      membership[i] = mask; vertices++;
    }
    for (let t = 0; t < index.count; t += 3) {
      // All three endpoints inside ONE convex region proves that the complete
      // rendered triangle is covered, including cross-bone skinning faces.
      assert.notEqual(membership[index.getX(t)] & membership[index.getX(t + 1)] & membership[index.getX(t + 2)], 0,
        `a blended triangle crosses an uncovered gap: ${mesh.name}/${t / 3} at ${time}`);
      triangles++;
    }
  }
  const centre = new THREE.Box3().setFromPoints(local.flat()).getCenter(new THREE.Vector3());
  const envelope = motion.getBodyEnvelope();
  for (const angle of [-Math.PI / 3, 0, Math.PI / 2]) {
    camera.position.set(centre.x + Math.sin(angle) * 3, centre.y + 1.1, centre.z + Math.cos(angle) * 3);
    camera.lookAt(centre); camera.updateMatrixWorld(true);
    const project = p => { const value = p.clone().project(camera); return { x: value.x, y: value.y }; };
    const previous = convex(envelope.map(project)), polygons = local.map(values => convex(values.map(project)));
    const bounds = previous.reduce((box, p) => ({ minX: Math.min(box.minX, p.x), maxX: Math.max(box.maxX, p.x), minY: Math.min(box.minY, p.y), maxY: Math.max(box.maxY, p.y) }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    let formerArea = 0, released = 0;
    for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) {
      const p = { x: bounds.minX + (x + .5) / 100 * (bounds.maxX - bounds.minX), y: bounds.minY + (y + .5) / 100 * (bounds.maxY - bounds.minY) };
      if (!inside(previous, p)) continue;
      formerArea++; if (!polygons.some(polygon => inside(polygon, p))) released++;
    }
    gaps.push({ time, angle: +angle.toFixed(3), releasedFraction: +(released / formerArea).toFixed(3) });
    assert.equal(local, motion.getBodyHulls(), 'camera orbit does not invalidate pose hulls');
  }
}
assert.ok(gaps.filter(result => result.releasedFraction > .1).length >= 6, 'separate limb regions must release useful space in most tested views');
const previous = motion.getBodyHulls(); motion.reset();
assert.notEqual(motion.getBodyHulls(), previous, 'reset invalidates the posed hulls');
const resetHulls = motion.getBodyHulls(); motion.update(2.37);
assert.notEqual(motion.getBodyHulls(), resetHulls, 'seeking invalidates the posed hulls');
for (const original of originals) {
  assert.equal(original.mesh.geometry, original.geometry); assert.equal(original.mesh.material, original.material); assert.equal(original.mesh.visible, original.visible);
}
console.log(JSON.stringify({ status: 'passed', scope: 'real-v41-whole-triangle-local-body-hull-coverage',
  poses: 3, cameraViews: gaps.length, vertices, triangles, groups, points, initializationMs: +initializationMs.toFixed(2),
  averagePoseHullMs: +(poseHullMs / 3).toFixed(3), gaps,
  limitation: 'CPU coverage and projected available-space checks, not phone visual acceptance.' }, null, 2));
motion.dispose();

function convex(input) {
  const points = [...input].sort((a, b) => a.x - b.x || a.y - b.y), lower = [], upper = [];
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  for (const p of points) { while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop(); lower.push(p); }
  for (const p of points.reverse()) { while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop(); upper.push(p); }
  lower.pop(); upper.pop(); return lower.concat(upper);
}
function inside(polygon, p) {
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i], b = polygon[(i + 1) % polygon.length];
    if ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) < -1e-8) return false;
  }
  return true;
}
