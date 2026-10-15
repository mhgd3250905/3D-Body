// Independent baked-GLB audit of the complete free-hand transfer route.
// Read-only assets. Outputs are confined to --out (default R5 agent-audit).
// node tools/motion-v42/audit-compact-recovery.mjs --candidate path --reference path --out directory
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const args = { reference: path.join(root, 'output/flare-v42-20261015/flare-coach-v42-candidate.glb'),
  candidate: path.join(root, 'output/flare-v42-r6-20261015/flare-coach-v42-candidate.glb'),
  out: path.join(root, 'output/flare-v42-r6-20261015/agent-audit/coach'), intervals: 540, collisionEvery: 3 };
const options = { '--reference': 'reference', '--candidate': 'candidate', '--out': 'out', '--intervals': 'intervals', '--collision-every': 'collisionEvery' };
for (let i = 2; i < process.argv.length; i++) {
  const key = options[process.argv[i]], value = process.argv[++i];
  if (!key || value === undefined) throw new Error('Unknown/missing argument');
  args[key] = typeof args[key] === 'number' ? Number(value) : path.resolve(value);
}
if (!Number.isInteger(args.intervals) || args.intervals < 24 || args.intervals > 3600 || !Number.isInteger(args.collisionEvery) || args.collisionEvery < 1) throw new Error('Invalid sampling');
for (const key of ['reference', 'candidate']) if (!fs.existsSync(args[key])) throw new Error(`${key} missing: ${args[key]}`);
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const rig = JSON.parse(fs.readFileSync(path.join(root, 'app/scene/source/coach/coach-v41-rig.json'), 'utf8'));
const sides = ['left', 'right'], armNames = sides.flatMap(s => ['UpperArm', 'Forearm', 'Hand'].map(p => s + p));
const V = a => new THREE.Vector3(...a), Q = a => new THREE.Quaternion(...a).normalize(), degrees = x => x * 180 / Math.PI;
const distance = (a, b) => V(a).distanceTo(V(b)), max = a => a.length ? Math.max(...a) : 0;
const stats = values => { if (!values.length) return null; const a = [...values].sort((x, y) => x - y); return { min: a[0], max: a.at(-1), mean: a.reduce((s, x) => s + x, 0) / a.length, median: a[Math.round((a.length - 1) * .5)], p95: a[Math.round((a.length - 1) * .95)] }; };
const floorY = -.014, nearY = .011, airborneY = .056, minBend = .005;

function bodyFrame(j) {
  const origin = V(j.torso), x = V(j.leftShoulder).sub(V(j.rightShoulder)).normalize(), up = origin.clone().sub(V(j.pelvis));
  up.addScaledVector(x, -up.dot(x)).normalize();
  const front = x.clone().cross(up).normalize();
  return { origin: origin.toArray(), left: x.toArray(), up: up.toArray(), front: front.toArray(),
    project: p => { const d = V(p).sub(origin); return [d.dot(x), d.dot(up), d.dot(front)]; } };
}
function bend(s, e, w) {
  const axis = V(w).sub(V(s)).normalize(), offset = V(e).sub(V(s));
  offset.addScaledVector(axis, -offset.dot(axis));
  return { axis: axis.toArray(), radius: offset.length(), unit: offset.normalize().toArray() };
}
function cyclicRuns(rows, predicate) {
  const n = rows.length - 1, bits = rows.slice(0, -1).map(predicate);
  if (!bits.some(Boolean)) return [];
  if (bits.every(Boolean)) return [Array.from({ length: n }, (_, i) => i)];
  const start = (bits.findIndex(v => !v) + 1) % n, result = []; let current = null;
  for (let k = 0; k < n; k++) { const i = (start + k) % n; if (bits[i]) { current ??= []; current.push(i); } else if (current) { result.push(current); current = null; } }
  if (current) result.push(current);
  return result;
}

// Actual triangle surfaces: an AABB is only a lower bound, never a collision verdict.
// Refit BVHs reuse rest topology; narrow phase includes segment/triangle intersection,
// vertex/triangle distance and all edge/edge distances (including coplanar contacts).
const ta = new THREE.Triangle(), tb = new THREE.Triangle(), closest = new THREE.Vector3();
const aa = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], bb = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
const segU = new THREE.Vector3(), segV = new THREE.Vector3(), segW = new THREE.Vector3();
const intD = new THREE.Vector3(), intE1 = new THREE.Vector3(), intE2 = new THREE.Vector3(), intH = new THREE.Vector3(), intS = new THREE.Vector3(), intQ = new THREE.Vector3();
function edgeDistanceSq(p, q, a, b) {
  segU.subVectors(q, p); segV.subVectors(b, a); segW.subVectors(p, a);
  const A = segU.dot(segU), B = segU.dot(segV), C = segV.dot(segV), D = segU.dot(segW), E = segV.dot(segW), tiny = 1e-20;
  let s = 0, t = 0;
  if (A <= tiny && C <= tiny) return p.distanceToSquared(a);
  if (A <= tiny) t = THREE.MathUtils.clamp(E / C, 0, 1);
  else if (C <= tiny) s = THREE.MathUtils.clamp(-D / A, 0, 1);
  else { const denom = A * C - B * B; s = denom > tiny ? THREE.MathUtils.clamp((B * E - C * D) / denom, 0, 1) : 0; t = (B * s + E) / C; if (t < 0) { t = 0; s = THREE.MathUtils.clamp(-D / A, 0, 1); } else if (t > 1) { t = 1; s = THREE.MathUtils.clamp((B - D) / A, 0, 1); } }
  return segW.addScaledVector(segU, s).addScaledVector(segV, -t).lengthSq();
}
function edgeHitsTriangle(p, q, a, b, c) {
  intD.subVectors(q, p); intE1.subVectors(b, a); intE2.subVectors(c, a); intH.crossVectors(intD, intE2);
  const det = intE1.dot(intH), eps = 1e-12;
  if (Math.abs(det) < eps) return false;
  const inv = 1 / det; intS.subVectors(p, a); const u = inv * intS.dot(intH);
  if (u < -eps || u > 1 + eps) return false;
  intQ.crossVectors(intS, intE1); const v = inv * intD.dot(intQ), t = inv * intE2.dot(intQ);
  return v >= -eps && u + v <= 1 + eps && t >= -eps && t <= 1 + eps;
}
function triangleDistanceSq(a, b) {
  for (let i = 0; i < 3; i++) if (edgeHitsTriangle(a[i], a[(i + 1) % 3], ...b) || edgeHitsTriangle(b[i], b[(i + 1) % 3], ...a)) return 0;
  ta.set(...a); tb.set(...b); let best = Infinity;
  for (let i = 0; i < 3; i++) {
    const da = a[i].distanceToSquared(tb.closestPointToPoint(a[i], closest)), db = b[i].distanceToSquared(ta.closestPointToPoint(b[i], closest));
    if (Number.isFinite(da)) best = Math.min(best, da); if (Number.isFinite(db)) best = Math.min(best, db);
    for (let j = 0; j < 3; j++) best = Math.min(best, edgeDistanceSq(a[i], a[(i + 1) % 3], b[j], b[(j + 1) % 3]));
  }
  return best;
}
function verifyGeometryKernel() {
  const a = [[0, 0, 0], [1, 0, 0], [0, 1, 0]].map(V), parallel = [[0, 0, 2], [1, 0, 2], [0, 1, 2]].map(V), crossing = [[.2, .2, -1], [.2, .2, 1], [.8, .2, 0]].map(V), coplanar = [[.1, .1, 0], [.3, .1, 0], [.1, .3, 0]].map(V);
  if (Math.abs(triangleDistanceSq(a, parallel) - 4) > 1e-10 || triangleDistanceSq(a, crossing) > 1e-16 || triangleDistanceSq(a, coplanar) > 1e-16) throw new Error('Triangle distance kernel sanity check failed');
}
verifyGeometryKernel();
const emptyBox = () => [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
function expandBox(box, p) { for (let k = 0; k < 3; k++) { box[k] = Math.min(box[k], p[k]); box[k + 3] = Math.max(box[k + 3], p[k]); } }
function boxDistanceSq(a, b) { let d = 0; for (let k = 0; k < 3; k++) d += Math.max(0, a[k] - b[k + 3], b[k] - a[k + 3]) ** 2; return d; }
function pointBoxDistanceSq(p, b) { let d = 0; for (let k = 0; k < 3; k++) d += Math.max(0, b[k] - p[k], p[k] - b[k + 3]) ** 2; return d; }
function buildTree(triangles, restPositions) {
  const centroids = triangles.map(t => [0, 1, 2].map(k => t.reduce((s, id) => s + restPositions[id][k], 0) / 3));
  const recurse = indices => {
    const node = { box: emptyBox(), count: indices.length };
    if (indices.length <= 8) node.indices = indices;
    else { const box = emptyBox(); for (const i of indices) expandBox(box, centroids[i]); const sizes = [0, 1, 2].map(k => box[k + 3] - box[k]), axis = sizes.indexOf(Math.max(...sizes)); indices.sort((a, b) => centroids[a][axis] - centroids[b][axis]); const half = indices.length >> 1; node.left = recurse(indices.slice(0, half)); node.right = recurse(indices.slice(half)); }
    return node;
  };
  return recurse(triangles.map((_, i) => i));
}
function refitTree(tree, triangles, positions) {
  const box = tree.box; box[0] = box[1] = box[2] = Infinity; box[3] = box[4] = box[5] = -Infinity;
  if (tree.indices) { for (const i of tree.indices) for (const id of triangles[i]) expandBox(box, positions[id]); }
  else { refitTree(tree.left, triangles, positions); refitTree(tree.right, triangles, positions); for (let k = 0; k < 3; k++) { box[k] = Math.min(tree.left.box[k], tree.right.box[k]); box[k + 3] = Math.max(tree.left.box[k + 3], tree.right.box[k + 3]); } }
}
function readTriangle(vectors, triangle, positions) { for (let k = 0; k < 3; k++) vectors[k].fromArray(positions[triangle[k]]); }
function surfaceDistance(partA, partB, positions) {
  let best = Infinity, pairs = 0; const stack = [[partA.tree, partB.tree]];
  while (stack.length) {
    const [a, b] = stack.pop(); if (boxDistanceSq(a.box, b.box) > best) continue;
    if (a.indices && b.indices) {
      for (const ai of a.indices) { readTriangle(aa, partA.triangles[ai], positions); for (const bi of b.indices) { readTriangle(bb, partB.triangles[bi], positions); pairs++; const d = triangleDistanceSq(aa, bb); if (d < best) best = d; if (best <= 1e-16) return { distanceMetres: Math.sqrt(best), intersectOrTouchWithin10Nanometres: true, trianglePairs: pairs,
        witness: { a: { ...partA.sources[ai], worldVertices: partA.triangles[ai].map(id => [...positions[id]]) }, b: { ...partB.sources[bi], worldVertices: partB.triangles[bi].map(id => [...positions[id]]) } } }; } }
    } else {
      const children = !a.indices && (b.indices || a.count >= b.count) ? [[a.left, b], [a.right, b]] : [[a, b.left], [a, b.right]];
      children.sort((x, y) => boxDistanceSq(y[0].box, y[1].box) - boxDistanceSq(x[0].box, x[1].box)); stack.push(...children);
    }
  }
  return { distanceMetres: Math.sqrt(best), intersectOrTouchWithin10Nanometres: false, trianglePairs: pairs };
}
function pointSurfaceDistance(point, part, positions) {
  let best = Infinity; const vector = V(point), stack = [part.tree];
  while (stack.length) {
    const node = stack.pop(); if (pointBoxDistanceSq(point, node.box) > best) continue;
    if (node.indices) { for (const i of node.indices) { readTriangle(aa, part.triangles[i], positions); ta.set(...aa); best = Math.min(best, vector.distanceToSquared(ta.closestPointToPoint(vector, closest))); } }
    else { const children = [node.left, node.right]; children.sort((a, b) => pointBoxDistanceSq(point, b.box) - pointBoxDistanceSq(point, a.box)); stack.push(...children); }
  }
  return Math.sqrt(best);
}

async function sample(file, label) {
  const bytes = fs.readFileSync(file), sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const raw = bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes;
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
  const model = gltf.scene, clip = [...gltf.animations].sort((a, b) => b.tracks.length - a.tracks.length)[0];
  if (!clip || clip.duration <= 0) throw new Error('No positive animation clip');
  model.updateMatrixWorld(true); const bones = new Map(), meshes = [];
  model.traverse(o => { if (o.isBone) bones.set(o.name, o); if (o.isSkinnedMesh) { meshes.push(o); o.skeleton.update(); } });
  const rest = new Map([...bones].map(([n, b]) => [n, b.matrixWorld.clone().invert()]));
  const landmarks = Object.fromEntries(Object.entries(rig.landmarks).map(([n, p]) => [n, { point: V(p), bone: ['pelvis', 'torso', 'neck', 'head'].includes(n) ? n : n.replace(/Shoulder$/, 'UpperArm').replace(/Elbow$/, 'Forearm').replace(/Wrist$/, 'Hand').replace(/Hip$/, 'Thigh').replace(/Knee$/, 'Shin').replace(/Ankle$/, 'Foot') }]));
  const refs = [], restPositions = [], parts = Object.fromEntries(['head', 'trunk', 'legs', 'left', 'right'].map(n => [n, { triangles: [], sources: [] }]));
  const hands = { left: [], right: [] }, palms = { left: [], right: [] }, shoes = { left: [], right: [] }, point = new THREE.Vector3();
  for (const mesh of meshes) {
    const { skinIndex, skinWeight, position } = mesh.geometry.attributes, selected = Object.fromEntries(Object.keys(parts).map(n => [n, new Uint8Array(position.count)])), offset = refs.length;
    const isShoe = /^Coach_(Sneakers|Soles|Shoe_Details)(?:_|$)/.test(mesh.name);
    for (let i = 0; i < position.count; i++) {
      mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld); refs.push({ mesh, index: i }); restPositions.push(point.toArray());
      const weights = { head: 0, trunk: 0, legs: 0, left: 0, right: 0, leftFoot: 0, rightFoot: 0 };
      for (let k = 0; k < 4; k++) { const n = mesh.skeleton.bones[skinIndex.getComponent(i, k)]?.name, w = skinWeight.getComponent(i, k); if (n === 'head') weights.head += w; if (['pelvis', 'torso', 'spineLower', 'spineUpper', 'neck'].includes(n)) weights.trunk += w; if (/^(left|right)(Thigh|Patella|Shin|Foot)$/.test(n)) weights.legs += w; for (const s of sides) { if (n === s + 'Hand') weights[s] += w; if (n === s + 'Foot') weights[s + 'Foot'] += w; } }
      selected.head[i] = weights.head > .001; selected.trunk[i] = weights.trunk > .7; selected.legs[i] = weights.legs > .001;
      for (const s of sides) { selected[s][i] = weights[s] > .001; if (weights[s] > .7) hands[s].push(offset + i); if (isShoe && weights[s + 'Foot'] > .7) shoes[s].push(offset + i); }
    }
    const index = mesh.geometry.index, count = index?.count ?? position.count;
    for (let i = 0; i < count; i += 3) { const ids = [0, 1, 2].map(k => index ? index.getX(i + k) : i + k); for (const n of Object.keys(parts)) if (ids.some(j => selected[n][j])) { parts[n].triangles.push(ids.map(j => j + offset)); parts[n].sources.push({ meshName: mesh.name, triangleIndex: i / 3, vertexIndices: ids }); } }
  }
  for (const s of sides) {
    const wrist = V(rig.landmarks[s + 'Wrist']), sign = s === 'left' ? 1 : -1, finger = new THREE.Vector3(sign * .98253144, .05483374, .17783482).normalize(), normal = new THREE.Vector3(sign * .06068526, -.99777448, -.02762938);
    normal.addScaledVector(finger, -normal.dot(finger)).normalize();
    const length = max(hands[s].map(i => V(restPositions[i]).sub(wrist).dot(finger))), central = hands[s].filter(i => { const d = V(restPositions[i]).sub(wrist).dot(finger); return d >= .15 * length && d <= .55 * length; }), depth = max(central.map(i => V(restPositions[i]).sub(wrist).dot(normal)));
    palms[s] = central.filter(i => V(restPositions[i]).sub(wrist).dot(normal) >= depth - .004);
    if (!hands[s].length || !palms[s].length || !shoes[s].length) throw new Error('Empty actual contact selection');
  }
  const collisionIds = [...new Set(Object.values(parts).flatMap(p => p.triangles.flat()))], surfaceIds = [...new Set([...Object.values(hands).flat(), ...Object.values(shoes).flat()])];
  for (const p of Object.values(parts)) { if (!p.triangles.length) throw new Error('Empty mesh triangle region'); p.tree = buildTree(p.triangles, restPositions); }
  console.log(`${label}: ${clip.duration}s; BVH triangles ${JSON.stringify(Object.fromEntries(Object.entries(parts).map(([n, p]) => [n, p.triangles.length])))}`);
  const positions = restPositions.map(p => [...p]), mixer = new THREE.AnimationMixer(model), action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  const rows = [], matrixRows = []; let nonFiniteMatrices = 0;
  const skin = ids => { for (const i of ids) { refs[i].mesh.getVertexPosition(refs[i].index, point).applyMatrix4(refs[i].mesh.matrixWorld); point.toArray(positions[i]); } };
  const surface = ids => { const center = new THREE.Vector3(); let minY = Infinity; for (const i of ids) { minY = Math.min(minY, positions[i][1]); center.add(V(positions[i])); } return { minY, centroid: center.divideScalar(ids.length).toArray() }; };
  for (let i = 0; i <= args.intervals; i++) {
    const phase = i / args.intervals; action.enabled = true; action.paused = false; mixer.setTime(phase * clip.duration); model.updateMatrixWorld(true); for (const mesh of meshes) mesh.skeleton.update();
    const bonePositions = {}, rotations = {}, matrices = {}, deltas = new Map();
    for (const [n, b] of bones) { bonePositions[n] = b.getWorldPosition(point).toArray(); rotations[n] = b.getWorldQuaternion(new THREE.Quaternion()).normalize().toArray(); matrices[n] = [...b.matrixWorld.elements]; if (!matrices[n].every(Number.isFinite)) nonFiniteMatrices++; deltas.set(n, b.matrixWorld.clone().multiply(rest.get(n))); }
    matrixRows.push(matrices);
    const joints = Object.fromEntries(Object.entries(landmarks).map(([n, l]) => [n, l.point.clone().applyMatrix4(deltas.get(l.bone)).toArray()])), frame = bodyFrame(joints), arms = {};
    const collisionFrame = i % args.collisionEvery === 0 || i === args.intervals; skin(surfaceIds); if (collisionFrame) { skin(collisionIds); for (const p of Object.values(parts)) refitTree(p.tree, p.triangles, positions); }
    for (const s of sides) {
      const shoulder = bonePositions[s + 'UpperArm'], elbow = bonePositions[s + 'Forearm'], wrist = bonePositions[s + 'Hand'], localWrist = frame.project(wrist), localElbow = frame.project(elbow), localShoulder = frame.project(shoulder);
      const hand = surface(hands[s]), palm = surface(palms[s]), shoe = surface(shoes[s]);
      arms[s] = { shoulder, elbow, wrist, localWrist, localElbow, localShoulder, upperLength: distance(shoulder, elbow), lowerLength: distance(elbow, wrist), elbowAngleDegrees: degrees(V(shoulder).sub(V(elbow)).angleTo(V(wrist).sub(V(elbow)))), bend: bend(shoulder, elbow, wrist), hand, palm, shoe,
        radialWrist: Math.hypot(localWrist[0], localWrist[2]), radialElbow: Math.hypot(localElbow[0], localElbow[2]), sideBeyondShoulder: Math.max(0, (s === 'left' ? 1 : -1) * (localWrist[0] - localShoulder[0])),
        mesh: collisionFrame ? { handHead: surfaceDistance(parts[s], parts.head, positions), handTrunk: surfaceDistance(parts[s], parts.trunk, positions), handLegs: surfaceDistance(parts[s], parts.legs, positions), wristTrunkDistanceMetres: pointSurfaceDistance(wrist, parts.trunk, positions), elbowTrunkDistanceMetres: pointSurfaceDistance(elbow, parts.trunk, positions) } : null };
    }
    rows.push({ frame: i, phase, time: phase * clip.duration, joints, bonePositions, rotations, bodyFrame: { origin: frame.origin, left: frame.left, up: frame.up, front: frame.front }, arms });
    if (i && i % 135 === 0) console.log(`${label}: ${i}/${args.intervals}`);
  }
  mixer.stopAllAction(); mixer.uncacheRoot(model);
  return { asset: { path: file, sha256, bytes: bytes.length, duration: clip.duration, clip: clip.name }, rows, matrixRows, nonFiniteMatrices,
    sampling: { intervals: args.intervals, collisionEvery: args.collisionEvery, meshSamples: rows.filter(r => r.arms.left.mesh).length, contactVertices: Object.fromEntries(sides.map(s => [s, { hand: hands[s].length, palm: palms[s].length, shoe: shoes[s].length }])), meshTriangles: Object.fromEntries(Object.entries(parts).map(([n, p]) => [n, p.triangles.length])) } };
}

function routeSummary(data, side, indices) {
  const n = data.rows.length - 1, rows = indices.map(i => data.rows[i]), before = data.rows[(indices[0] + n - 1) % n], land = data.rows[(indices.at(-1) + 1) % n], anchor = land.arms[side].wrist;
  const pathLength = key => rows.slice(1).reduce((sum, r, i) => sum + distance(rows[i].arms[side][key], r.arms[side][key]), 0);
  const sample = rows.map(r => r.arms[side]), clear = sample.filter(a => a.hand.minY > airborneY), metrics = clear.length ? clear : sample;
  const distanceToAnchor = (row, horizontal) => { const p = row.arms[side].wrist; return horizontal ? Math.hypot(p[0] - anchor[0], p[2] - anchor[2]) : distance(p, anchor); };
  const arrival = (threshold, horizontal) => { let at = rows.length; for (let i = rows.length - 1; i >= 0; i--) { if (distanceToAnchor(rows[i], horizontal) > threshold) break; at = i; } return { thresholdMetres: threshold, phase: at < rows.length ? rows[at].phase : land.phase, leadToContactSeconds: (rows.length - at) * data.asset.duration / n }; };
  const retreat = horizontal => { let minimum = Infinity, maxBacktrack = 0, minPhase = null, witness = null; for (const r of rows.slice(Math.floor(rows.length * .6))) { const d = distanceToAnchor(r, horizontal); if (d < minimum) { minimum = d; minPhase = r.phase; } if (d - minimum > maxBacktrack) { maxBacktrack = d - minimum; witness = { fromPhase: minPhase, toPhase: r.phase, fromDistanceMetres: minimum, toDistanceMetres: d }; } } return { maximumIncreaseAbovePriorMinimumMetres: maxBacktrack, witness }; };
  const crossings = []; for (let i = 1; i < rows.length; i++) { const a = rows[i - 1].arms[side].localWrist[2], b = rows[i].arms[side].localWrist[2]; if (a * b < 0) crossings.push({ phase: rows[i - 1].phase + (rows[i].phase - rows[i - 1].phase) * a / (a - b), direction: b > a ? 'back-to-front' : 'front-to-back' }); }
  const peak = (fn, candidates = rows) => { const row = candidates.reduce((a, b) => fn(a.arms[side]) >= fn(b.arms[side]) ? a : b); return { phase: row.phase, value: fn(row.arms[side]) }; };
  const dt = data.asset.duration / n, coreMotion = indices.slice(Math.floor(indices.length * .15), Math.ceil(indices.length * .85)).map(i => {
    const previous = data.rows[(i + n - 1) % n].arms[side].wrist, current = data.rows[i].arms[side].wrist, next = data.rows[(i + 1) % n].arms[side].wrist;
    return { phase: i / n, speed: V(next).sub(V(previous)).length() / (2 * dt), secondDifference: V(next).add(V(previous)).addScaledVector(V(current), -2).length() / (dt * dt) };
  });
  const corePeak = key => coreMotion.reduce((a, b) => a[key] >= b[key] ? a : b);
  return { lastNearContactPhase: before.phase, firstFreePhase: rows[0].phase, lastFreePhase: rows.at(-1).phase, nextNearContactPhase: land.phase, freeSampleCount: rows.length,
    releaseWrist: before.arms[side].wrist, landingWrist: anchor, releaseLocalWrist: before.arms[side].localWrist, landingLocalWrist: land.arms[side].localWrist,
    worldPathLengthMetres: pathLength('wrist'), bodyLocalPathLengthMetres: pathLength('localWrist'), bodyLocalElbowPathLengthMetres: pathLength('localElbow'),
    clearAirborne: { sampleCount: clear.length, wristRadiusFromBodyAxisMetres: stats(metrics.map(a => a.radialWrist)), elbowRadiusFromBodyAxisMetres: stats(metrics.map(a => a.radialElbow)), wristBeyondSameSideShoulderMetres: stats(metrics.map(a => a.sideBeyondShoulder)), wristBodyX: stats(metrics.map(a => a.localWrist[0])), wristBodyUp: stats(metrics.map(a => a.localWrist[1])), wristBodyFront: stats(metrics.map(a => a.localWrist[2])) },
    peakWorldWristHeight: peak(a => a.wrist[1]), peakBodyRadialWrist: peak(a => a.radialWrist), peakBodyLateralWrist: peak(a => Math.abs(a.localWrist[0])), frontBackCrossings: crossings,
    middle70PercentOfFreeWindowKinematics: { speedMetresPerSecond: stats(coreMotion.map(r => r.speed)), centeredSecondDifferenceMetresPerSecondSquared: stats(coreMotion.map(r => r.secondDifference)), maximumSpeedPhase: corePeak('speed').phase, maximumSecondDifferencePhase: corePeak('secondDifference').phase },
    finalApproachHorizontal: [.10, .05, .02].map(t => arrival(t, true)), finalApproach3d: [.15, .08, .03].map(t => arrival(t, false)), last40PercentOfFreeWindowBacktracking: { horizontal: retreat(true), threeDimensional: retreat(false) },
    trajectoryCheckpoints: [0, .1, .25, .5, .75, .9, 1].map(u => { const r = rows[Math.round(u * (rows.length - 1))], a = r.arms[side]; return { windowFraction: u, phase: r.phase, wristWorld: a.wrist, wristBody: a.localWrist, elbowBody: a.localElbow, distanceToNextAnchor: distance(a.wrist, anchor) }; }) };
}
function summarize(data) {
  const unique = data.rows.slice(0, -1), n = unique.length, dt = data.asset.duration / n, sidesOut = {};
  for (const side of sides) {
    const airRuns = cyclicRuns(data.rows, r => r.arms[side].palm.minY > nearY), contactRuns = cyclicRuns(data.rows, r => r.arms[side].palm.minY <= nearY), all = unique.map(r => r.arms[side]);
    const speed = [], acceleration = [], steps = [], temporalBend = [], reliableTemporal = [];
    for (let i = 0; i < n; i++) {
      const previous = unique[(i + n - 1) % n].arms[side], a = all[i], next = unique[(i + 1) % n].arms[side];
      speed.push(V(next.wrist).sub(V(previous.wrist)).length() / (2 * dt)); acceleration.push(V(next.wrist).add(V(previous.wrist)).addScaledVector(V(a.wrist), -2).length() / (dt * dt)); steps.push(distance(a.wrist, next.wrist));
      if (a.bend.radius >= minBend && next.bend.radius >= minBend && a.hand.minY > airborneY && next.hand.minY > airborneY) { const rotation = new THREE.Quaternion().setFromUnitVectors(V(next.bend.axis), V(a.bend.axis)), dot = V(a.bend.unit).dot(V(next.bend.unit).applyQuaternion(rotation)); temporalBend.push(dot); reliableTemporal.push({ phase: unique[i].phase, dot }); }
    }
    const meshRows = unique.filter(r => r.arms[side].mesh), meshMinimum = key => { const r = meshRows.reduce((a, b) => a.arms[side].mesh[key].distanceMetres <= b.arms[side].mesh[key].distanceMetres ? a : b); return { phase: r.phase, ...r.arms[side].mesh[key] }; };
    sidesOut[side] = { routes: airRuns.map(run => routeSummary(data, side, run)), contact: contactRuns.map(run => { const origin = data.rows[run[0]].arms[side].palm.centroid; return { firstPhase: data.rows[run[0]].phase, lastPhase: data.rows[run.at(-1)].phase, sampleCount: run.length, horizontalExcursionMetres: max(run.map(i => { const p = data.rows[i].arms[side].palm.centroid; return Math.hypot(p[0] - origin[0], p[2] - origin[2]); })) }; }),
      lengths: { upper: stats(all.map(a => a.upperLength)), lower: stats(all.map(a => a.lowerLength)) }, elbowAnglesDegrees: stats(all.map(a => a.elbowAngleDegrees)),
      handMinWorldY: stats(all.map(a => a.hand.minY)), palmMinWorldY: stats(all.map(a => a.palm.minY)), shoeMinWorldY: stats(all.map(a => a.shoe.minY)),
      speedMetresPerSecond: stats(speed), centeredSecondDifferenceMetresPerSecondSquared: stats(acceleration), adjacentWristStepMetres: stats(steps), speedMaximumPhase: speed.indexOf(Math.max(...speed)) / n, accelerationMaximumPhase: acceleration.indexOf(Math.max(...acceleration)) / n,
      loopBoundaryOneStepVelocityDifferenceMetresPerSecond: V(all[1].wrist).sub(V(all[0].wrist)).sub(V(data.rows.at(-1).arms[side].wrist).sub(V(all.at(-1).wrist))).length() / dt,
      temporalAxisAlignedBendDot: stats(temporalBend), oppositeConsecutiveBendSamples: reliableTemporal.filter(r => r.dot < 0),
      mesh: { samples: meshRows.length, minimumHandHead: meshMinimum('handHead'), minimumHandTrunk: meshMinimum('handTrunk'), minimumHandLegs: meshMinimum('handLegs'), handHeadTouchOrIntersectionPhases: meshRows.filter(r => r.arms[side].mesh.handHead.intersectOrTouchWithin10Nanometres).map(r => r.phase), handTrunkTouchOrIntersectionPhases: meshRows.filter(r => r.arms[side].mesh.handTrunk.intersectOrTouchWithin10Nanometres).map(r => r.phase), handLegsTouchOrIntersectionPhases: meshRows.filter(r => r.arms[side].mesh.handLegs.intersectOrTouchWithin10Nanometres).map(r => r.phase), freeWristTrunkDistance: stats(meshRows.filter(r => r.arms[side].hand.minY > airborneY).map(r => r.arms[side].mesh.wristTrunkDistanceMetres)), freeHandTrunkDistance: stats(meshRows.filter(r => r.arms[side].hand.minY > airborneY).map(r => r.arms[side].mesh.handTrunk.distanceMetres)) } };
  }
  const first = data.matrixRows[0], last = data.matrixRows.at(-1); let seam = 0;
  for (const name of Object.keys(first)) seam = Math.max(seam, ...first[name].map((v, i) => Math.abs(v - last[name][i])));
  return { asset: data.asset, sampling: data.sampling, nonFiniteMatrices: data.nonFiniteMatrices, loopSeamMaxMatrixComponentDifference: seam, sides: sidesOut };
}

const reference = await sample(args.reference, 'R1 reference'), candidate = await sample(args.candidate, 'candidate');
const referenceSummary = summarize(reference), candidateSummary = summarize(candidate), flags = [], comparisonRows = [], comparison = { fixedBody: { maxNonArmMatrixComponentChange: 0, maxNonArmBoneOriginChangeMetres: 0 }, sides: {} };
for (let i = 0; i < reference.rows.length; i++) {
  const a = reference.rows[i], b = candidate.rows[i], row = { phase: a.phase, sides: {} };
  for (const name of Object.keys(a.bonePositions)) if (!armNames.includes(name)) { comparison.fixedBody.maxNonArmBoneOriginChangeMetres = Math.max(comparison.fixedBody.maxNonArmBoneOriginChangeMetres, distance(a.bonePositions[name], b.bonePositions[name])); comparison.fixedBody.maxNonArmMatrixComponentChange = Math.max(comparison.fixedBody.maxNonArmMatrixComponentChange, ...reference.matrixRows[i][name].map((v, k) => Math.abs(v - candidate.matrixRows[i][name][k]))); }
  for (const side of sides) {
    const ra = a.arms[side], ca = b.arms[side], axisAngle = V(ra.bend.axis).angleTo(V(ca.bend.axis)), align = new THREE.Quaternion().setFromUnitVectors(V(ca.bend.axis), V(ra.bend.axis)), aligned = V(ca.bend.unit).applyQuaternion(align), dot = V(ra.bend.unit).dot(aligned);
    row.sides[side] = { referenceNearContact: ra.palm.minY <= nearY, candidateNearContact: ca.palm.minY <= nearY, reliableBend: ra.bend.radius >= minBend && ca.bend.radius >= minBend && axisAngle < 170 * Math.PI / 180 && ra.hand.minY > airborneY && ca.hand.minY > airborneY,
      axisAlignedBendDot: dot, signedBendRotationDegrees: degrees(Math.atan2(V(ra.bend.axis).dot(V(ra.bend.unit).cross(aligned)), dot)),
      wristDisplacementMetres: distance(ra.wrist, ca.wrist), elbowDisplacementMetres: distance(ra.elbow, ca.elbow), shoulderDisplacementMetres: distance(ra.shoulder, ca.shoulder), palmDisplacementMetres: distance(ra.palm.centroid, ca.palm.centroid),
      handOrientationDifferenceDegrees: degrees(Q(a.rotations[side + 'Hand']).angleTo(Q(b.rotations[side + 'Hand']))),
      bodyRadialWristReductionMetres: ra.radialWrist - ca.radialWrist, sideExcursionReductionMetres: ra.sideBeyondShoulder - ca.sideBeyondShoulder, worldWristHeightReductionMetres: ra.wrist[1] - ca.wrist[1],
      upperLengthChangeMetres: ca.upperLength - ra.upperLength, lowerLengthChangeMetres: ca.lowerLength - ra.lowerLength };
  }
  comparisonRows.push(row);
}
for (const side of sides) {
  const values = comparisonRows.slice(0, -1).map(r => r.sides[side]), contact = values.filter(v => v.referenceNearContact), airborne = values.filter((_, i) => reference.rows[i].arms[side].hand.minY > airborneY), reliable = values.filter(v => v.reliableBend), ref = referenceSummary.sides[side], can = candidateSummary.sides[side];
  const originalWindows = cyclicRuns(reference.rows, r => r.arms[side].palm.minY > nearY);
  comparison.sides[side] = { pairedR1FreeWindows: originalWindows.map(indices => ({ reference: routeSummary(reference, side, indices), candidateAtSamePhases: routeSummary(candidate, side, indices) })),
    radialWristReductionAtR1AirborneFrames: stats(airborne.map(v => v.bodyRadialWristReductionMetres)), sideExcursionReductionAtR1AirborneFrames: stats(airborne.map(v => v.sideExcursionReductionMetres)),
    maxShoulderDisplacementMetres: max(values.map(v => v.shoulderDisplacementMetres)), maxContactWristDisplacementMetres: max(contact.map(v => v.wristDisplacementMetres)), maxContactElbowDisplacementMetres: max(contact.map(v => v.elbowDisplacementMetres)), maxContactPalmDisplacementMetres: max(contact.map(v => v.palmDisplacementMetres)), maxContactHandOrientationDifferenceDegrees: max(contact.map(v => v.handOrientationDifferenceDegrees)), contactClassificationChangedSamples: values.filter(v => v.referenceNearContact !== v.candidateNearContact).length,
    maxBoneLengthDifferenceMetres: max(values.flatMap(v => [Math.abs(v.upperLengthChangeMetres), Math.abs(v.lowerLengthChangeMetres)])), axisAlignedBendDot: stats(reliable.map(v => v.axisAlignedBendDot)), oppositeBendSamples: comparisonRows.filter(r => r.sides[side].reliableBend && r.sides[side].axisAlignedBendDot < 0).map(r => ({ phase: r.phase, cosine: r.sides[side].axisAlignedBendDot, signedDegrees: r.sides[side].signedBendRotationDegrees })),
    peakSpeedRatio: can.speedMetresPerSecond.max / ref.speedMetresPerSecond.max, peakSecondDifferenceRatio: can.centeredSecondDifferenceMetresPerSecondSquared.max / ref.centeredSecondDifferenceMetresPerSecondSquared.max };
  const c = comparison.sides[side];
  if (c.maxShoulderDisplacementMetres > .001) flags.push({ side, issue: 'shoulder-moved-over-1mm' });
  if (c.maxContactPalmDisplacementMetres > .001 || c.maxContactWristDisplacementMetres > .001 || c.maxContactElbowDisplacementMetres > .001 || c.maxContactHandOrientationDifferenceDegrees > .01 || c.contactClassificationChangedSamples) flags.push({ side, issue: 'contact-arm-orientation-anchor-or-near-contact-window-changed' });
  if (c.maxBoneLengthDifferenceMetres > .001 || can.lengths.upper.max - can.lengths.upper.min > .001 || can.lengths.lower.max - can.lengths.lower.min > .001) flags.push({ side, issue: 'bone-length-change-over-1mm' });
  if (c.oppositeBendSamples.length) flags.push({ side, issue: 'bend-halfspace-differs-from-R1-after-minimal-arm-axis-alignment', samples: c.oppositeBendSamples.length });
  if (can.oppositeConsecutiveBendSamples.length) flags.push({ side, issue: 'opposite-consecutive-elbow-bend-plane' });
  if (can.mesh.handHeadTouchOrIntersectionPhases.length || can.mesh.handTrunkTouchOrIntersectionPhases.length || can.mesh.handLegsTouchOrIntersectionPhases.length) flags.push({ side, issue: 'selected-hand-triangle-surface-touch-or-intersection' });
  if (can.handMinWorldY.min < floorY - .001 || can.shoeMinWorldY.min < floorY - .001) flags.push({ side, issue: 'selected-hand-or-shoe-below-stage' });
  if (!(c.radialWristReductionAtR1AirborneFrames?.mean > .001)) flags.push({ side, issue: 'whole-free-route-radial-compactness-not-improved-by-1mm-on-average' });
  if (can.routes.length !== ref.routes.length) flags.push({ side, issue: 'number-of-geometric-free-windows-changed' });
}
if (comparison.fixedBody.maxNonArmBoneOriginChangeMetres > .001 || comparison.fixedBody.maxNonArmMatrixComponentChange > .001) flags.push({ issue: 'non-arm-body-transform-change' });
if (candidate.nonFiniteMatrices || candidateSummary.loopSeamMaxMatrixComponentDifference > 1e-5) flags.push({ issue: 'non-finite-or-loop-seam' });
const report = { format: 'flare-compact-recovery-audit-v1', generatedAt: new Date().toISOString(), verdict: flags.length ? 'geometry-or-route-review-needed' : 'sampled-preservation-and-surface-checks-clear-route-metrics-require-review', flags,
  definitions: { bodyFrame: 'Origin=actual torso landmark; +X=right-shoulder to left-shoulder; +Y=pelvis-to-torso orthogonalized against X; +Z=X cross Y (project FRONT is +Z). Coordinates are metres, not world camera directions.',
    compactness: 'Whole R1 free-hand windows, actual local wrist/elbow coordinates, radial hypot(X,Z), side excursion beyond same-side shoulder bone, world/local path length, actual wrist/hand-to-trunk triangle distance. Shoulder extent is a bony reference, not skin clearance.',
    timing: 'Release/landing from actual fixed palmar-patch minY<=0.011m. Final-approach time is the beginning of the final uninterrupted suffix within declared distance to the next actual landing wrist. It avoids treating the starting point as early arrival when both supports share an anchor. Distance thresholds describe this comparison, not ideal technique.',
    bend: 'Project elbow off shoulder-wrist axis. Compare to R1 after minimal axis alignment and also compare consecutive candidate frames. Exclude bend radii<5mm and hands not clearly airborne; a negative cosine is review evidence, not an anatomical diagnosis.',
    mesh: 'Every triangle touching a vertex with head/Hand weight>0.001; central trunk sum pelvis/torso/spine/neck>0.7; legs any Thigh/Patella/Shin/Foot weight>0.001. All triangle corners are included. Refit BVH boxes prune only; narrow phase evaluates triangle distance/intersection and retains a triangle witness for any touch. Zero means sampled surface contact/intersection, not penetration depth. Palm selection matches prior audits: >0.7 Hand, central15–55% finger length, deepest4mm palmar patch.',
    continuity: 'Actual clip seconds. Central first/second finite differences and transported signed bend, with exact first/last matrices. Middle70% free-window metrics keep inherited landing spikes from hiding new transfer acceleration. Acceleration is a sampled kinematic indicator, not force; absence of a preservation/collision flag is not approval of route speed or timing.',
    thresholds: '1mm preservation/ground and 1mm mean compactness improvement are engineering checks, not real-athlete standards. Near-contact worldY=11mm; rendered stageY=-14mm; clearly airborne hand minY>56mm.' },
  limitations: ['Sampling cannot prove continuous-time nonintersection between checked phases.', 'Triangle distance measures selected external surfaces; it does not establish whole-body collision freedom, closed-solid containment, contact forces or dynamic balance.', 'Equal phase assumes the R1 body/timing map is retained. Whole-motion realism and useful recovery timing still require multi-angle visual/user review.'],
  reference: referenceSummary, candidate: candidateSummary, comparison };
fs.mkdirSync(args.out, { recursive: true });
fs.writeFileSync(path.join(args.out, 'compact-recovery-summary.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(args.out, 'reference-samples.json'), JSON.stringify(reference.rows) + '\n');
fs.writeFileSync(path.join(args.out, 'candidate-samples.json'), JSON.stringify(candidate.rows) + '\n');
fs.writeFileSync(path.join(args.out, 'comparison-samples.json'), JSON.stringify(comparisonRows) + '\n');
console.log(JSON.stringify({ report: path.join(args.out, 'compact-recovery-summary.json'), candidateSha256: candidate.asset.sha256, verdict: report.verdict, flags,
  sides: Object.fromEntries(sides.map(s => [s, { radialReduction: comparison.sides[s].radialWristReductionAtR1AirborneFrames, minimumHandHead: candidateSummary.sides[s].mesh.minimumHandHead, minimumHandTrunk: candidateSummary.sides[s].mesh.minimumHandTrunk, oppositeBendSamples: comparison.sides[s].oppositeBendSamples.length, speedRatio: comparison.sides[s].peakSpeedRatio, secondDifferenceRatio: comparison.sides[s].peakSecondDifferenceRatio }])) }, null, 2));
