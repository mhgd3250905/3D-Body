import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/legacy/coach-motion.js';
import { attachStudyBody } from '../src/study-body.js';
import { buildMmRest } from '../src/mapped-mesh.js';
import { muscleAt } from '../src/legacy/muscle-map.js';
import calibration from '../src/core-calibration.json' with { type: 'json' };

globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.location ??= { search: '' };
const root = fileURLToPath(new URL('../', import.meta.url));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
for (const source of Object.values(calibration.sources)) assert.equal(sha(fs.readFileSync(path.join(root, source.path))), source.sha256, 'Calibration source changed: ' + source.path);
async function load(relative) {
  const bytes = fs.readFileSync(path.join(root, relative));
  return (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene;
}
const [model, study, reference] = await Promise.all(['coach', 'body', 'reference'].map(id => load(calibration.sources[id].path)));
const body = attachStudyBody(model, study), rig = JSON.parse(fs.readFileSync(path.join(root, calibration.sources.rig.path), 'utf8'));
const motion = createCoachMotion({ model, rigData: rig });
const geometry = body.geometry;
const immutableNames = ['position', 'normal', 'skinIndex', 'skinWeight'];
const beforeAttributes = Object.fromEntries(immutableNames.map(name => [name, sha(Buffer.from(geometry.attributes[name].array.buffer))]));
const beforeIndices = sha(Buffer.from(geometry.index.array.buffer));
motion.update(2); const frozenJoints = motion.getMetrics().joints;
buildMmRest(motion, model); assert.deepEqual(motion.getMetrics().joints, frozenJoints, 'Atlas changed the frozen motion');
for (const name of immutableNames) assert.equal(sha(Buffer.from(geometry.attributes[name].array.buffer)), beforeAttributes[name], 'Atlas changed ' + name);
assert.equal(sha(Buffer.from(geometry.index.array.buffer)), beforeIndices, 'Atlas changed triangles');
const rest = geometry.getAttribute('mmRest'); assert.ok(rest.array.every(Number.isFinite));
const mapHash = sha(Buffer.from(rest.array.buffer));
motion.reset(); model.updateMatrixWorld(true); body.skeleton.update();
const joints = motion.getMetrics().joints;
assert.ok(Math.abs(joints.leftHip[1] - calibration.canonicalAnchors.sourceHip[1]) < 1e-7, 'Measured hip anchor drifted');
assert.ok(Math.abs(joints.shoulderCenter[1] - calibration.canonicalAnchors.sourceShoulder[1]) < 1e-7, 'Measured shoulder anchor drifted');
const points = [], p = new THREE.Vector3();
for (let i = 0; i < geometry.attributes.position.count; i++) { body.getVertexPosition(i, p).applyMatrix4(body.matrixWorld); points.push(p.clone()); }
reference.updateMatrixWorld(true); const referenceBody = reference.getObjectByName('Fitness_Body_Surface'), referencePoints = [];
for (let i = 0; i < referenceBody.geometry.attributes.position.count; i++) {
  p.fromBufferAttribute(referenceBody.geometry.attributes.position, i).applyMatrix4(referenceBody.matrixWorld); referencePoints.push(p.clone());
}
const sourceY = target => (target - calibration.canonicalAnchors.yOffset) / calibration.canonicalAnchors.yScale;

// Sample actual triangle/plane intersections, interpolating the same mmRest
// values the fragment shader receives; this is not a copy of the mapping fn.
function contourCoverage(mesh, world, y, mappedAttribute = null) {
  const nodes = new Map(), key = point => point.toArray().map(value => Math.round(value * 100000)).join(':');
  for (let t = 0; t < mesh.geometry.index.count; t += 3) {
    const ids = [0, 1, 2].map(offset => mesh.geometry.index.getX(t + offset)), edges = new Map();
    for (let e = 0; e < 3; e++) {
      const ia = ids[e], ib = ids[(e + 1) % 3], a = world[ia], b = world[ib];
      if ((a.y - y) * (b.y - y) > 0 || Math.abs(a.y - b.y) < 1e-12) continue;
      const fraction = (y - a.y) / (b.y - a.y), position = a.clone().lerp(b, fraction);
      const mm = mappedAttribute ? new THREE.Vector3().fromBufferAttribute(mappedAttribute, ia).lerp(new THREE.Vector3().fromBufferAttribute(mappedAttribute, ib), fraction) : position.clone();
      edges.set(key(position), { position, mm });
    }
    if (edges.size !== 2) continue;
    const pair = [...edges.entries()];
    for (const [id, value] of pair) if (!nodes.has(id)) nodes.set(id, { ...value, neighbours: new Set() });
    nodes.get(pair[0][0]).neighbours.add(pair[1][0]); nodes.get(pair[1][0]).neighbours.add(pair[0][0]);
  }
  const seen = new Set(), components = [];
  for (const id of nodes.keys()) {
    if (seen.has(id)) continue;
    const queue = [id], members = []; seen.add(id);
    while (queue.length) { const id = queue.pop(); members.push(id); for (const next of nodes.get(id).neighbours) if (!seen.has(next)) { seen.add(next); queue.push(next); } }
    const bounds = new THREE.Box3().setFromPoints(members.map(id => nodes.get(id).position)); components.push({ members, bounds });
  }
  const middle = components.filter(c => c.bounds.min.x < -0.01 && c.bounds.max.x > 0.01 && c.bounds.min.z < 0 && c.bounds.max.z > 0)
    .sort((a, b) => b.members.length - a.members.length)[0]; assert.ok(middle, 'Missing actual core cross-section');
  const allowed = new Set(middle.members), sampled = new Set(); let count = 0, left = 0, right = 0;
  for (const id of middle.members) for (const neighbour of nodes.get(id).neighbours) {
    if (!allowed.has(neighbour)) continue; const edgeKey = [id, neighbour].sort().join('|'); if (sampled.has(edgeKey)) continue; sampled.add(edgeKey);
    const a = nodes.get(id), b = nodes.get(neighbour), steps = Math.max(2, Math.ceil(a.position.distanceTo(b.position) / 0.0002));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, position = a.position.clone().lerp(b.position, t), mm = a.mm.clone().lerp(b.mm, t); count++;
      if (position.z > 0 && muscleAt(mm)?.id === 'abs') { left = Math.max(left, position.x); right = Math.max(right, -position.x); }
    }
  }
  const halfWidth = Math.max(Math.abs(middle.bounds.min.x), Math.abs(middle.bounds.max.x));
  return { y, samples: count, halfWidth, left, right, fraction: (left + right) / (2 * halfWidth) };
}
const sections = [1.03, 1.08].map(targetY => {
  const source = contourCoverage(body, points, sourceY(targetY), rest);
  const target = contourCoverage(referenceBody, referencePoints, targetY);
  const baseline = contourCoverage(body, points, sourceY(targetY));
  assert.ok(Math.abs(source.fraction - target.fraction) < 0.035, 'Rectus relative width differs from the reference');
  assert.ok(Math.abs(source.left - source.right) < 0.001, 'Left/right rectus footprint differs by >=1 mm');
  assert.ok(Math.abs(source.fraction - target.fraction) < Math.abs(baseline.fraction - target.fraction), 'Measured calibration did not improve relative placement');
  return { targetY, source, target, baseline, relativeWidthError: Math.abs(source.fraction - target.fraction) };
});

// Check the real mapped core triangles for collapsed edges or seam jumps.
// Shared material/UV vertices may have separate indices at the same position.
const coreVertex = index => {
  if (points[index].y < 0.90 || points[index].y > 1.16) return false;
  let total = 0;
  for (let k = 0; k < 4; k++) if (calibration.limits.coreBones.includes(body.skeleton.bones[geometry.attributes.skinIndex.getComponent(index, k)]?.name)) total += geometry.attributes.skinWeight.getComponent(index, k);
  return total > 0.98;
};
let checkedEdges = 0, minimumStretch = Infinity, maximumStretch = 0, maximumCoincidentGap = 0;
const coincident = new Map();
for (let i = 0; i < points.length; i++) if (coreVertex(i)) {
  const key = points[i].toArray().map(value => Math.round(value * 1000000)).join(':');
  const mapped = new THREE.Vector3().fromBufferAttribute(rest, i), previous = coincident.get(key);
  if (previous) maximumCoincidentGap = Math.max(maximumCoincidentGap, previous.distanceTo(mapped)); else coincident.set(key, mapped);
}
for (let t = 0; t < geometry.index.count; t += 3) {
  const ids = [0, 1, 2].map(offset => geometry.index.getX(t + offset)); if (!ids.every(coreVertex)) continue;
  for (let e = 0; e < 3; e++) {
    const a = ids[e], b = ids[(e + 1) % 3], length = points[a].distanceTo(points[b]); if (length < 1e-6) continue;
    const mappedLength = new THREE.Vector3().fromBufferAttribute(rest, a).distanceTo(new THREE.Vector3().fromBufferAttribute(rest, b));
    const stretch = mappedLength / length; minimumStretch = Math.min(minimumStretch, stretch); maximumStretch = Math.max(maximumStretch, stretch); checkedEdges++;
  }
}
assert.ok(checkedEdges > 1000, 'Too few actual core edges checked');
assert.ok(minimumStretch > 0.5 && maximumStretch < 2, 'Core mapping collapses or jumps across an actual edge');
assert.ok(maximumCoincidentGap < 0.001, 'Core mapping leaves >=1 mm gaps at coincident vertices');
const continuity = { checkedEdges, minimumStretch, maximumStretch, maximumCoincidentGap };

body.computeBoundingBox(); body.computeBoundingSphere();
const ray = new THREE.Raycaster(), bary = new THREE.Vector3(), triangle = new THREE.Triangle();
function probe(name, x, targetY, front, expected, rawY = false) {
  const y = rawY ? targetY : sourceY(targetY); ray.set(new THREE.Vector3(x, y, front ? 0.5 : -0.5), new THREE.Vector3(0, 0, front ? -1 : 1));
  const hit = ray.intersectObject(body, false)[0]; assert.ok(hit, 'Probe missed the actual skin: ' + name);
  const ids = [hit.face.a, hit.face.b, hit.face.c]; triangle.set(points[ids[0]], points[ids[1]], points[ids[2]]).getBarycoord(hit.point, bary);
  const mm = new THREE.Vector3().fromBufferAttribute(rest, ids[0]).multiplyScalar(bary.x)
    .addScaledVector(new THREE.Vector3().fromBufferAttribute(rest, ids[1]), bary.y).addScaledVector(new THREE.Vector3().fromBufferAttribute(rest, ids[2]), bary.z);
  const region = muscleAt(mm); if (expected === '!abs') assert.notEqual(region?.id, 'abs', name); else assert.equal(region?.id, expected, name);
  if (x !== 0 && region) assert.equal(region.side, x > 0 ? 'left' : 'right', 'Side classification changed: ' + name);
  return { name, world: hit.point.toArray(), mapped: mm.toArray(), region: region?.id ?? null, side: region?.side ?? null };
}
const probes = [probe('rectus-left', 0.035, 1.03, true, 'abs'), probe('rectus-right', -0.035, 1.03, true, 'abs'),
  probe('rectus-midline', 0, 1.03, true, 'abs'), probe('oblique-left', 0.10, 1.03, true, 'oblique'), probe('oblique-right', -0.10, 1.03, true, 'oblique'),
  probe('chest-left', 0.07, 1.28, true, 'pec'), probe('chest-right', -0.07, 1.28, true, 'pec'),
  probe('back-left', 0.03, 1.03, false, 'erectors'), probe('back-right', -0.03, 1.03, false, 'erectors'),
  probe('hip-left', 0.11, 0.87, true, 'hipFlexor'), probe('hip-right', -0.11, 0.87, true, 'hipFlexor'),
  probe('below-pubis', 0.035, 0.80, true, '!abs', true)];
let checkedPhases = 0;
for (const time of [0, 1, 2, 3, 4, 5, 6, 7, 9]) {
  motion.update(time); model.updateMatrixWorld(true); body.skeleton.update();
  assert.equal(sha(Buffer.from(rest.array.buffer)), mapHash, 'Atlas drifts when pose changes');
  for (const name of immutableNames) assert.equal(sha(Buffer.from(geometry.attributes[name].array.buffer)), beforeAttributes[name], 'Motion changed authored ' + name);
  checkedPhases++;
}
for (const source of Object.values(calibration.sources)) assert.equal(sha(fs.readFileSync(path.join(root, source.path))), source.sha256, 'Verification modified source bytes');
const result = { status: 'passed', scope: 'measured relative teaching-region placement; not exact anatomical registration',
  sections, continuity, probes, checkedPhases, sourceHashesMatchCalibration: true, geometryWeightsNormalsUnchanged: true,
  frozenPoseRestored: true, mmRestStableAcrossPhases: true, mmRestSha256: mapHash };
const destination = path.join(root, 'tools/evidence/muscle-regions-verify.json');
fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
