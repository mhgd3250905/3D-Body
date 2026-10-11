import * as THREE from 'three';
import { GROUP_MUSCLES, MUSCLE_BY_ID, muscleAt } from './legacy/muscle-map.js';
import { isCoveredActorPart } from './study-body.js';

const clamp = THREE.MathUtils.clamp;
const SIDES = ['left', 'right'];
const PROXY_CELL = .032;
const PROXY_PARTS = new Set(['Coach_Body', 'Coach_Training_Tee', 'Coach_Training_Shorts', 'Coach_Face', 'Coach_Hair', 'Coach_Sneakers', 'Coach_Soles']);
const OUTWARD = {
  deltFront: [.3, 0, 1], deltSide: [1, 0, 0], deltRear: [.3, 0, -1],
  triceps: [0, 0, -1], forearmFlex: [0, 0, 1], forearmExt: [.6, 0, -1],
  serratus: [.7, 0, .7], oblique: [.8, 0, .6], lats: [.5, 0, -1],
  gluteMed: [1, 0, -.3], glutes: [.3, -.1, -1], hipFlexor: [.25, 0, 1],
  adductors: [-1, 0, 0], quadLat: [.6, 0, .7], hamLat: [.3, 0, -1], hamMed: [0, 0, -1],
};
const visible = mesh => { for (let p = mesh; p; p = p.parent) if (!p.visible) return false; return true; };
const proxyPart = mesh => { for (let p = mesh; p; p = p.parent) if (PROXY_PARTS.has(p.name)) return true; return false; };

// Pause labels refer to the actor's actual teaching-map surface, not an
// internal joint. Each panel has a few stable surface samples; only these and
// a small, vertex-clustered occlusion proxy are skinned when the pose changes.
// Neither the source geometry nor any visible material is changed.
export function createHotspotDepth(player, skinned) {
  const panelSamples = new Map(), candidates = new Map(), parts = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), restPoint = new THREE.Vector3();
  const restNormal = new THREE.Vector3(), normalEdge = new THREE.Vector3(), outward = new THREE.Vector3();
  const statistics = { samples: 0, proxyVertices: 0, proxyTriangles: 0, poseUpdates: 0, vertexReads: 0, rayTriangles: 0 };
  let poseTime = null, rootMatrix = '', tree = null;
  const centre = new THREE.Vector3(), view = new THREE.Vector3(), cameraPoint = new THREE.Vector3(), eye = new THREE.Vector3();
  const ray = new THREE.Ray(), hit = new THREE.Vector3(), viewNormal = new THREE.Vector3();
  const height = player.getMetrics().neutralHeight || 1.69;

  for (const mesh of skinned) {
    const { geometry } = mesh, rest = geometry.attributes.mmRest, index = geometry.index?.array;
    if (!index) continue;
    if (isCoveredActorPart(mesh) && rest) {
      // About one in three source faces is enough to locate each region. The
      // final point is always on one of those real, fully skinned triangles.
      for (let t = 0; t < index.length; t += 9) {
        if (t + 2 >= index.length) break;
        const ia = index[t], ib = index[t + 1], ic = index[t + 2];
        a.fromBufferAttribute(rest, ia); b.fromBufferAttribute(rest, ib); c.fromBufferAttribute(rest, ic);
        restPoint.copy(a).add(b).add(c).multiplyScalar(1 / 3);
        const ax = Math.abs(restPoint.x), y = restPoint.y;
        if (ax < .10 && y > .68 && y < .94 || ax > .35 && y < .91) continue;
        const muscle = muscleAt(restPoint);
        if (!muscle || muscle.margin < .025) continue;
        const definition = MUSCLE_BY_ID[muscle.id], [cx, cy, cz] = definition.centre, [rx, ry, rz] = definition.radius;
        restNormal.subVectors(b, a).cross(normalEdge.subVectors(c, a)).normalize();
        outward.fromArray(OUTWARD[muscle.id] ?? [0, 0, Math.sign(cz) || 1]);
        if (muscle.side === 'right') outward.x *= -1;
        // Garments include inward-facing surfaces. Choose the outward face of
        // the teaching panel, otherwise a front hip label could incorrectly
        // report that its inner shorts lining is facing away from the camera.
        if (restNormal.dot(outward.normalize()) < .15) continue;
        const distance = ((ax - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((restPoint.z - cz) / rz) ** 2;
        const key = muscle.id + ':' + muscle.side, pool = panelSamples.get(key) ?? [];
        // A garment over the same region wins a close tie with the skin under
        // it. The small bias does not move a bare-arm anchor onto the sleeve.
        const rank = distance + (mesh.name === 'Coach_Body' ? .09 : 0);
        const sample = { mesh, key: mesh.uuid + ':' + ia + ':' + ib + ':' + ic, indices: [ia, ib, ic], rest: restPoint.clone(), rank, side: muscle.side,
          point: new THREE.Vector3(), normal: new THREE.Vector3(), panel: muscle.id };
        pool.push(sample); pool.sort((u, v) => u.rank - v.rank);
        if (pool.length > 36) pool.length = 36;
        panelSamples.set(key, pool);
      }
    }
    if (proxyPart(mesh)) parts.push(clusterProxy(mesh));
  }
  for (const [key, pool] of panelSamples) {
    const chosen = [];
    for (const sample of pool) {
      if (chosen.some(other => other.rest.distanceToSquared(sample.rest) < .012 ** 2)) continue;
      chosen.push(sample); if (chosen.length === 3) break;
    }
    panelSamples.set(key, chosen); statistics.samples += chosen.length;
  }
  for (const [groupId, group] of Object.entries(GROUP_MUSCLES)) {
    for (const side of SIDES) candidates.set(groupId + ':' + side,
      group.muscles.flatMap(panel => panelSamples.get(panel + ':' + side) ?? []));
  }
  const samples = [...panelSamples.values()].flat(), triangles = parts.flatMap(part => part.triangles);
  statistics.proxyVertices = parts.reduce((sum, part) => sum + part.sources.length, 0);
  statistics.proxyTriangles = triangles.length;

  function vertex(mesh, index, target) {
    statistics.vertexReads++;
    return mesh.getVertexPosition(index, target).applyMatrix4(mesh.matrixWorld);
  }
  function prepare() {
    const time = player.time ?? player.getMetrics().time;
    player.coach.updateMatrixWorld(true);
    const matrix = player.coach.matrixWorld.elements.join(',');
    if (time === poseTime && matrix === rootMatrix) return;
    poseTime = time; rootMatrix = matrix; statistics.poseUpdates++;
    for (const skeleton of new Set(skinned.map(mesh => mesh.skeleton))) skeleton.update();
    for (const sample of samples) {
      vertex(sample.mesh, sample.indices[0], a); vertex(sample.mesh, sample.indices[1], b); vertex(sample.mesh, sample.indices[2], c);
      sample.point.copy(a).add(b).add(c).multiplyScalar(1 / 3);
      sample.normal.subVectors(b, a).cross(viewNormal.subVectors(c, a)).normalize();
    }
    const bounds = new THREE.Box3();
    for (const part of parts) {
      part.visible = visible(part.mesh);
      for (let i = 0; i < part.sources.length; i++) {
        vertex(part.mesh, part.sources[i], part.points[i]);
        if (part.visible) bounds.expandByPoint(part.points[i]);
      }
    }
    if (!bounds.isEmpty()) bounds.getCenter(centre);
    if (!tree) tree = buildTree(triangles);
    updateBounds(tree);
  }

  function blocked(point) {
    view.subVectors(point, eye); const distance = view.length();
    ray.set(eye, view.multiplyScalar(1 / distance));
    // Clustering has a finite surface error. Ignore the last 4 cm so the
    // label's own garment and local proxy do not become a false occluder.
    const limit = Math.max(0, distance - .04);
    return intersects(tree, limit * limit);
  }
  function intersects(node, limitSq) {
    if (!node || !ray.intersectsBox(node.box)) return false;
    if (node.children) return intersects(node.children[0], limitSq) || intersects(node.children[1], limitSq);
    for (const triangle of node.triangles) {
      if (!triangle.part.visible) continue;
      statistics.rayTriangles++;
      if (ray.intersectTriangle(triangle.a, triangle.b, triangle.c, false, hit) && hit.distanceToSquared(eye) < limitSq) return true;
    }
    return false;
  }

  function choose(groupId, allowedSide, previous) {
    prepare(); player.camera.updateMatrixWorld(true); player.camera.getWorldPosition(eye);
    const previousSide = typeof previous === 'string' ? previous : previous?.side;
    const sides = allowedSide === 'both' ? SIDES : SIDES.includes(allowedSide) ? [allowedSide] : [];
    const choices = [];
    for (const side of sides) {
      let best = null;
      for (const candidate of candidates.get(groupId + ':' + side) ?? []) {
        if (!visible(candidate.mesh) || candidate.normal.lengthSq() < .5) continue;
        view.subVectors(eye, candidate.point).normalize();
        const facing = candidate.normal.dot(view);
        // A small angular dead band prevents a dashed line/rotate hint from
        // flickering when an already-hidden panel grazes the silhouette.
        const wasHidden = typeof previous === 'object' && previous?.occluded && previousSide === side;
        const back = facing < (wasHidden ? .025 : -.10);
        const occluded = back || blocked(candidate.point);
        // Prefer a central visible surface, not a camera-facing rim. Multi-
        // panel groups can correctly choose a front/side/rear panel as seen.
        const score = candidate.rank * .15 - facing * .18 + (occluded ? .8 : 0);
        if (!best || score < best.score) best = { candidate, facing, occluded, score, side };
      }
      if (best) choices.push(best);
    }
    if (!choices.length) return null;
    for (const choice of choices) choice.depth = -cameraPoint.copy(choice.candidate.point).applyMatrix4(player.camera.matrixWorldInverse).z;
    choices.sort((u, v) => Number(u.occluded) - Number(v.occluded) || u.depth - v.depth);
    const retained = choices.find(choice => choice.side === previousSide);
    const chosen = retained && retained.occluded === choices[0].occluded && retained.depth < choices[0].depth + .09 ? retained : choices[0];
    return chosen;
  }
  function describe(chosen) {
    const centreDepth = -cameraPoint.copy(centre).applyMatrix4(player.camera.matrixWorldInverse).z;
    // Translation of the camera toward/away from the actor subtracts equally
    // from both depths. Far therefore describes body-relative depth, never
    // the camera's arbitrary orbit radius or whether a deep muscle is hidden.
    const far = clamp(.5 + (chosen.depth - centreDepth) / (height * .42), 0, 1);
    return { point: chosen.candidate.point.clone(), side: chosen.side, depth: chosen.depth, far,
      occluded: chosen.occluded, facing: chosen.facing };
  }
  function sample(groupId, allowedSide = 'both', previous = null) {
    const chosen = choose(groupId, allowedSide, previous);
    return chosen ? describe(chosen) : null;
  }
  function sampleFacing(groupId, allowedSide = 'both', previous = null) {
    const chosen = choose(groupId, allowedSide, previous);
    if (!chosen) return null;
    // Bilateral callouts may follow the currently useful side as the view
    // changes. Reuse visibility/depth selection and its side hysteresis,
    // while also exposing the actual surface normal for a nearby billboard.
    return { ...describe(chosen), normal: chosen.candidate.normal.clone(), candidateKey: chosen.candidate.key };
  }
  function sampleFixed(groupId, allowedSide = 'both', previous = null) {
    const sides = allowedSide === 'both' ? SIDES : SIDES.includes(allowedSide) ? [allowedSide] : [];
    const key = previous?.candidateKey;
    const retained = key && sides.flatMap(side => candidates.get(groupId + ':' + side) ?? []).find(candidate => candidate.key === key);
    let chosen;
    if (retained) {
      prepare(); player.camera.updateMatrixWorld(true); player.camera.getWorldPosition(eye);
      if (!visible(retained.mesh) || retained.normal.lengthSq() < .5) return null;
      view.subVectors(eye, retained.point).normalize();
      const facing = retained.normal.dot(view), back = facing < (previous?.occluded ? .025 : -.10);
      chosen = { candidate: retained, side: retained.side, facing, occluded: back || blocked(retained.point),
        depth: -cameraPoint.copy(retained.point).applyMatrix4(player.camera.matrixWorldInverse).z };
    } else chosen = choose(groupId, allowedSide, previous);
    if (!chosen) return null;
    // Retain this exact surface triangle across camera turns AND pose updates.
    // It can become hidden behind a limb or face away; neither is permission
    // to slide the label to another surface or switch to the other body side.
    // Pass the returned record back as previous; null starts a new placement.
    return { ...describe(chosen), normal: chosen.candidate.normal.clone(), candidateKey: chosen.candidate.key };
  }
  return { sample, sampleFacing, sampleFixed, getStats: () => ({ ...statistics }) };
}

function clusterProxy(mesh) {
  // GLB positions are quantized independently per mesh; mmRest is already in
  // a common, metre-sized reference body and gives a consistent proxy density.
  const position = mesh.geometry.attributes.mmRest ?? mesh.geometry.attributes.position, index = mesh.geometry.index.array;
  const cells = new Map(), remap = new Uint32Array(position.count), sources = [], points = [], triangles = [];
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    const ix = Math.floor(x / PROXY_CELL), iy = Math.floor(y / PROXY_CELL), iz = Math.floor(z / PROXY_CELL);
    const key = ix + ',' + iy + ',' + iz, distance = (x - (ix + .5) * PROXY_CELL) ** 2 + (y - (iy + .5) * PROXY_CELL) ** 2 + (z - (iz + .5) * PROXY_CELL) ** 2;
    let cell = cells.get(key);
    if (!cell) { cell = { index: sources.length, distance }; cells.set(key, cell); sources.push(i); points.push(new THREE.Vector3()); }
    else if (distance < cell.distance) { sources[cell.index] = i; cell.distance = distance; }
    remap[i] = cell.index;
  }
  const part = { mesh, sources, points, triangles, visible: true }, faces = new Set();
  for (let i = 0; i < index.length; i += 3) {
    const a = remap[index[i]], b = remap[index[i + 1]], c = remap[index[i + 2]];
    if (a === b || b === c || c === a) continue;
    const key = [a, b, c].sort((u, v) => u - v).join(',');
    if (faces.has(key)) continue;
    faces.add(key); triangles.push({ a: points[a], b: points[b], c: points[c], part });
  }
  return part;
}

function buildTree(triangles) {
  if (!triangles.length) return null;
  const node = { box: new THREE.Box3() };
  if (triangles.length <= 12) { node.triangles = triangles; return node; }
  const box = new THREE.Box3();
  for (const t of triangles) box.expandByPoint(t.a).expandByPoint(t.b).expandByPoint(t.c);
  const size = box.getSize(new THREE.Vector3()), axis = size.x >= size.y && size.x >= size.z ? 'x' : size.y >= size.z ? 'y' : 'z';
  triangles.sort((u, v) => u.a[axis] + u.b[axis] + u.c[axis] - v.a[axis] - v.b[axis] - v.c[axis]);
  const middle = triangles.length >> 1;
  node.children = [buildTree(triangles.slice(0, middle)), buildTree(triangles.slice(middle))];
  return node;
}

function updateBounds(node) {
  if (!node) return;
  node.box.makeEmpty();
  if (node.children) {
    for (const child of node.children) { updateBounds(child); node.box.union(child.box); }
  } else for (const t of node.triangles) if (t.part.visible) node.box.expandByPoint(t.a).expandByPoint(t.b).expandByPoint(t.c);
}
