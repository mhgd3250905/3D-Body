import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createBakedMotion } from '../src/baked-motion.js';
import { characterFromLocation, characterAsset, applyCharacter } from '../src/characters.js';
import { GROUPS, phaseAt, phaseTicks } from '../src/phase.js';
import { muscleAt, resolveGroup } from '../src/legacy/muscle-map.js';
import { fitHubMuscle, getHubMuscleFrame, hubMuscleCutoff, resolveHubMuscleCamera } from '../src/training-hub-stage.js';
import { fitHubAngle } from '../src/training-hub-angle-fit.js';
import { createHubTransitions } from '../src/training-hub-transitions.js';

globalThis.ProgressEvent ??= class { constructor(type, fields) { Object.assign(this, { type }, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const fixture = path => new URL(path, import.meta.url);
const readJson = path => JSON.parse(fs.readFileSync(fixture(path)));
const rig = readJson('../public/coach/coach-v41-rig.json');
const { frameCount } = readJson('../src/v42-r17-phases.json');
const catalog = readJson('../../assets/data/phase-muscles.json');
const preset = fs.readFileSync(fixture('../../lib/platform/scene/scene_hub_camera.dart'), 'utf8');
const number = key => Number(preset.match(new RegExp(key + ' = (-?[.\\d]+);'))[1]);
const fov = number('angleFov');
const angles = Object.fromEntries([...preset.matchAll(/^\s+(\d+): (-?[.\d]+),/gm)].map(([, key, yaw]) => [key, Number(yaw)]));
const standingHeight = number('standingHeight'), standingDistance = number('standingDistance');
const standing = Object.fromEntries([...preset.matchAll(/'([^']+)':\s*_MuscleFocus\(([^)]+)\),/g)].map(([, group, values]) => {
  const [side, center, ...region] = values.split(',').slice(0, 5).map(Number);
  return [group, { side, center, region }];
}));
function standingShot({ side, center, region }, focus = false) {
  const y = focus ? center : standingHeight;
  return { position: [0, y, side * standingDistance], target: [0, y, 0], fov: 26, overviewHeight: standingHeight,
    ...(focus ? { region } : {}) };
}
assert.deepEqual(Object.keys(angles), phaseTicks.map(({ phase }) => String(phase)));
assert.deepEqual(Object.keys(standing), Object.keys(GROUPS));
assert.ok(frameCount > 500);

for (const { phase, time } of phaseTicks) {
  const runtime = phaseAt(time);
  const { primary } = catalog.phases.find(item => item.source === phase);
  const items = runtime.items.filter(item => item.level === 'primary');
  assert.deepEqual(items.map(item => item.groupId), primary.map(item => item.id), 'same primary order in playback data and in chips');
  for (const item of items) {
    assert.equal(item.colour, catalog.groups.find(group => group.groupId === item.groupId).colour);
  }
}

const angleStage = 452, standingStage = 400, navigation = 54;
const phones = [[320, 0], [320, 24], [360, 24], [390, 24], [393, 59], [430, 34], [430, 0]];
const project = new THREE.Vector3();
const camera = new THREE.PerspectiveCamera(fov, 1, .02, 40);
const readModel = async path => {
  const bytes = gunzipSync(fs.readFileSync(fixture('../public/' + path.replace(/^\.\//, ''))));
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
};

const angleActors = ['original', 'training', 'shadow', 'chrome', 'street', 'robot', 'cyber'];
const angleBoundsFile = fixture('../src/training-hub-angle-bounds.json');

// Precompute the bind-space source points and pack each bone's affine
// transform once per mesh per sample. This gives the same weighted skinned
// points as getVertexPosition without doing matrix products for every vertex.
function prepareSurface(mesh) {
  const { position, skinIndex, skinWeight } = mesh.geometry.attributes;
  const source = new Float64Array(position.count * 3);
  const weights = new Float64Array(position.count * 4);
  const indices = new Uint32Array(position.count * 4);
  const point = new THREE.Vector3();
  const skin = mesh.isSkinnedMesh;
  assert.ok(!(mesh.geometry.morphAttributes.position?.length), mesh.name + ' has no position morph targets');
  for (let vertex = 0; vertex < position.count; vertex++) {
    point.fromBufferAttribute(position, vertex);
    if (skin) point.applyMatrix4(mesh.bindMatrix);
    point.toArray(source, vertex * 3);
    if (!skin) continue;
    for (let k = 0; k < 4; k++) {
      weights[vertex * 4 + k] = skinWeight.getComponent(vertex, k);
      indices[vertex * 4 + k] = skinIndex.getComponent(vertex, k) * 12;
    }
  }
  const toWorld = new THREE.Matrix4();
  const boneMatrix = new THREE.Matrix4();
  const transform = new Float64Array(skin ? mesh.skeleton.bones.length * 12 : 12);
  function pack(matrix, offset) {
    const e = matrix.elements;
    for (let axis = 0; axis < 3; axis++) {
      transform[offset++] = e[axis];
      transform[offset++] = e[4 + axis];
      transform[offset++] = e[8 + axis];
      transform[offset++] = e[12 + axis];
    }
  }
  return function visit(accept) {
    if (skin) {
      toWorld.multiplyMatrices(mesh.matrixWorld, mesh.bindMatrixInverse);
      for (let bone = 0; bone < mesh.skeleton.bones.length; bone++) {
        boneMatrix.multiplyMatrices(mesh.skeleton.bones[bone].matrixWorld, mesh.skeleton.boneInverses[bone]);
        boneMatrix.premultiply(toWorld);
        pack(boneMatrix, bone * 12);
      }
    } else pack(mesh.matrixWorld, 0);
    const n = skin ? 4 : 1;
    for (let i = 0, base = 0; i < source.length; i += 3, base += 4) {
      const x = source[i], y = source[i + 1], z = source[i + 2];
      let px = 0, py = 0, pz = 0;
      for (let k = 0; k < n; k++) {
        const w = skin ? weights[base + k] : 1;
        if (w === 0) continue;
        const b = indices[base + k];
        px += w * (transform[b] * x + transform[b + 1] * y + transform[b + 2] * z + transform[b + 3]);
        py += w * (transform[b + 4] * x + transform[b + 5] * y + transform[b + 6] * z + transform[b + 7]);
        pz += w * (transform[b + 8] * x + transform[b + 9] * y + transform[b + 10] * z + transform[b + 11]);
      }
      accept(px, py, pz);
    }
  };
}

async function* angleSurfaces() {
  for (const ids of [['original', 'street'], ['training', 'shadow', 'chrome', 'robot', 'cyber']]) {
    const modelFor = id => id === 'training' ? characterFromLocation('?body=training') : characterFromLocation('?character=' + id);
    const gltf = await readModel(characterAsset(modelFor(ids[0])));
    const known = new Set();
    function collectSurface() {
      const meshes = [];
      gltf.scene.traverseVisible(mesh => {
        if (!mesh.isMesh || known.has(mesh)) return;
        known.add(mesh);
        meshes.push(mesh);
      });
      return meshes;
    }
    const baseMeshes = collectSurface();
    const base = baseMeshes.map(prepareSurface);
    const accessories = Object.fromEntries(ids.map(id => {
      applyCharacter(gltf.scene, modelFor(id));
      return [id, collectSurface().map(prepareSurface)];
    }));
    const motion = createBakedMotion(gltf, rig);
    const clip = gltf.animations.find(clip => clip.name === 'flare_v42_candidate_loop');
    try {
      yield { ids, motion, clip, baseMeshes, base, accessories };
    } finally {
      motion.dispose();
    }
  }
}

async function measureAngleActors() {
  const boxes = {};
  let samples = 0;
  for await (const { ids, motion, clip, baseMeshes, base, accessories } of angleSurfaces()) {
    const keys = [...new Set(clip.tracks.flatMap(track => [...track.times]))].sort((a, b) => a - b);
    const times = keys.flatMap((time, i) => i + 1 === keys.length ? [time] :
      [0, .25, .5, .75].map(fraction => THREE.MathUtils.lerp(time, keys[i + 1], fraction)));
    for (const id of ids) boxes[id] = new THREE.Box3();
    const box = new THREE.Box3(), vertex = new THREE.Vector3();
    const grow = (x, y, z) => box.expandByPoint(vertex.set(x, y, z));
    for (const time of times) {
      motion.update(motion.clock.toSequence(time));
      box.makeEmpty();
      for (const visit of base) visit(grow);
      for (const id of ids) boxes[id].union(box);
      for (const id of ids) {
        box.makeEmpty();
        for (const visit of accessories[id]) visit(grow);
        boxes[id].union(box);
      }
      samples += ids.length;
    }
    // Cross-check the packed evaluator against the scene's own skin API at
    // each stage anchor before using these samples to verify the camera.
    for (const { time } of phaseTicks) {
      motion.update(time);
      for (const [index, mesh] of baseMeshes.entries()) {
        let vertexIndex = 0;
        const exact = new THREE.Vector3();
        const vertexPoint = new THREE.Vector3();
        base[index]((x, y, z) => {
          const vertex = vertexIndex++;
          if (vertex % 307 !== 0) return;
          mesh.getVertexPosition(vertex, exact).applyMatrix4(mesh.matrixWorld);
          assert.ok(exact.distanceToSquared(vertexPoint.set(x, y, z)) < 1e-10, mesh.name + ' agrees with Three.js world skinning');
        });
      }
    }
  }
  // One fixed pivot serves all costumes. Round each face outward to 1mm
  // and leave 1mm more between quarter-key samples and for CPU/GPU rounding.
  const union = new THREE.Box3();
  for (const box of Object.values(boxes)) union.union(box);
  const bounds = {
    min: union.min.toArray().map(value => (Math.floor(value * 1000) - 1) / 1000),
    max: union.max.toArray().map(value => (Math.ceil(value * 1000) + 1) / 1000),
  };
  return { bounds, samples };
}

if (process.argv.includes('--write-angle-bounds')) {
  const { bounds, samples } = await measureAngleActors();
  fs.writeFileSync(angleBoundsFile, JSON.stringify(bounds, null, 2) + '\n');
  console.log(JSON.stringify({ bounds, samples }, null, 2));
  process.exit(0);
}

const angleBounds = JSON.parse(fs.readFileSync(angleBoundsFile, 'utf8'));
const yaws = Object.values(angles);
const minimumYaw = Math.min(...yaws), maximumYaw = Math.max(...yaws);
const mannequin = await readModel('./anatomy/mannequin-reference.meshopt.glb.gz');
const bounds = new THREE.Box3().setFromObject(mannequin.scene);
const surfaces = { front: new Map(), back: new Map() };
const focusSurfaces = { front: new Map(), back: new Map() };
const body = [];
const overview = [];
const point = new THREE.Vector3(), direction = new THREE.Vector3();
mannequin.scene.updateMatrixWorld(true);
const muscleFrame = getHubMuscleFrame(mannequin.scene, bounds);
mannequin.scene.traverse(mesh => {
  if (!mesh.isMesh) return;
  const { position, normal } = mesh.geometry.attributes;
  for (let vertex = 0; vertex < position.count; vertex++) {
    point.fromBufferAttribute(position, vertex);
    const panel = muscleAt(point);
    point.applyMatrix4(mesh.matrixWorld);
    body.push(point.clone());
    direction.fromBufferAttribute(normal, vertex).transformDirection(mesh.matrixWorld);
    if (panel) for (const [side, forward] of [['front', 1], ['back', -1]]) {
      if (forward * direction.z <= -.025) continue;
      const surface = focusSurfaces[side];
      if (!surface.has(panel.id)) surface.set(panel.id, []);
      surface.get(panel.id).push(point.clone());
    }
    if (point.y <= hubMuscleCutoff) continue;
    overview.push(point.clone());
    // These vertices remain visible at full strength above the cutoff fade.
    if (!panel || panel.score < .035 || point.y < hubMuscleCutoff + .065) continue;
    if (Math.abs(direction.z) < .15) continue;
    const side = surfaces[direction.z > 0 ? 'front' : 'back'];
    if (!side.has(panel.id)) side.set(panel.id, []);
    side.get(panel.id).push(point.clone());
  }
});

function setCamera(position, target, fov, aspect) {
  camera.position.copy(position);
  camera.lookAt(target);
  camera.fov = fov;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}

let minimumSideMargin = 1, minimumHeight = 1, maximumHeight = 0;
let minimumFocusSideMargin = 1, maximumFocusSize = 0, maximumFocusZoom = 0, maximumFocusCenterOffset = 0;
const standingCoverage = [];
const focusedCoverage = [];
for (const [id, group] of Object.entries(GROUPS)) {
  const frame = standingShot(standing[id]);
  assert.equal(Math.sign(frame.position[2]), group.view === 'front' ? 1 : -1, id);
  const vertices = resolveGroup(id).muscles.flatMap(panel => surfaces[group.view].get(panel) ?? []);
  const focused = resolveGroup(id).muscles.flatMap(panel => focusSurfaces[group.view].get(panel) ?? []);
  assert.ok(vertices.length > 15, id + ' remains visible above the thigh feather');
  for (const [width, inset] of phones) {
    const height = standingStage - navigation - inset;
    setCamera(new THREE.Vector3(...frame.position), new THREE.Vector3(...frame.target), frame.fov, width / height);
    fitHubMuscle(camera, muscleFrame, height);
    const envelope = new THREE.Box2();
    for (const vertex of overview) {
      project.copy(vertex).project(camera);
      envelope.expandByPoint(new THREE.Vector2(project.x, project.y));
    }
    const sides = (1 - Math.max(Math.abs(envelope.min.x), Math.abs(envelope.max.x))) / 2;
    const vertical = (envelope.max.y - envelope.min.y) * height / (2 * standingStage);
    assert.ok(sides >= .15, id + ' preserves the specified lateral margin');
    assert.ok(vertical >= .65 && vertical <= .701, id + ' fills the 70% target within the lateral limit');
    if (width >= 360 && inset <= 48) assert.ok(vertical >= .698, id + ' fills 70% of a typical phone stage');
    assert.ok(envelope.min.y >= -.986 && envelope.max.y <= .986, 'no clipping near toolbar or bottom');
    minimumSideMargin = Math.min(minimumSideMargin, sides);
    minimumHeight = Math.min(minimumHeight, vertical);
    maximumHeight = Math.max(maximumHeight, vertical);
    if (width === 390) standingCoverage.push({ id, visibleAtlasVertices: vertices.length,
      stageHeight: Number(vertical.toFixed(3)), sideMargin: Number(sides.toFixed(3)) });

    const shot = resolveHubMuscleCamera(camera, muscleFrame, standingShot(standing[id], true), width, height, true);
    assert.ok(shot && shot.cutoff < bounds.min.y);
    setCamera(new THREE.Vector3(...shot.position), new THREE.Vector3(...shot.target), shot.fov, width / height);
    const region = new THREE.Box2();
    for (const vertex of focused) {
      project.copy(vertex).project(camera);
      region.expandByPoint(new THREE.Vector2(project.x * width / 2, project.y * height / 2));
    }
    const size = region.getSize(new THREE.Vector2());
    const span = Math.max(size.x, size.y) / Math.min(width, standingStage);
    const center = region.getCenter(new THREE.Vector2());
    const centerOffset = center.length() / Math.min(width, standingStage);
    assert.ok(span <= .25, id + ' fits within the bilateral 25% cap');
    assert.ok(centerOffset < .02, id + ' stays centered');
    let focusSideMargin = 1, realZoom = 0;
    for (const vertex of body) {
      project.copy(vertex).project(camera);
      focusSideMargin = Math.min(focusSideMargin, (1 - Math.abs(project.x)) / 2);
      const depthTowardCamera = standing[id].side * vertex.z;
      realZoom = Math.max(realZoom, (standingDistance - depthTowardCamera) / (Math.abs(shot.position[2]) - depthTowardCamera));
    }
    assert.ok(focusSideMargin > .03, id + ' keeps the full visible outline inside both sides');
    assert.ok(realZoom <= 1.35, id + ' respects the magnification cap');
    minimumFocusSideMargin = Math.min(minimumFocusSideMargin, focusSideMargin);
    maximumFocusSize = Math.max(maximumFocusSize, span);
    maximumFocusZoom = Math.max(maximumFocusZoom, realZoom);
    maximumFocusCenterOffset = Math.max(maximumFocusCenterOffset, centerOffset);
    if (width === 390) focusedCoverage.push({ id, regionSpan: Number(span.toFixed(3)), maximumZoom: Number(realZoom.toFixed(3)),
      requiresZoomOut: Math.abs(shot.position[2]) > standingDistance });
  }
}

const angleFixture = fitHubAngle(angleBounds, { yaws, fov, aspect: 390 / 374 });
const base = { phaseSource: 9, phaseTime: 0, angleCamera: { yaw: angles[9], ...angleFixture, fov },
  muscleId: 'deltoids', muscleCamera: standingShot(standing.deltoids), showMuscles: true };
let orbitFrames = 0, minOrbitClearance = Infinity, minimumOrbitSideMargin = 1;
for (const [fromId, from] of Object.entries(standing)) for (const [toId, to] of Object.entries(standing)) {
  if (fromId === toId) continue;
  const fromShot = resolveHubMuscleCamera(camera, muscleFrame, standingShot(from, true), 390, 322, true);
  const toShot = resolveHubMuscleCamera(camera, muscleFrame, standingShot(to, true), 390, 322, true);
  const orbit = createHubTransitions(9);
  orbit.configure({ ...base, muscleId: fromId, muscleCamera: fromShot }, 0);
  orbit.configure({ ...base, muscleId: toId, muscleCamera: toShot }, 1);
  for (let elapsed = 0; elapsed <= 700; elapsed += 20) {
    orbit.sample(1 + elapsed);
    const shot = orbit.frame.muscle;
    point.setFromSpherical(shot.orbit).add(shot.target);
    const clearance = bounds.distanceToPoint(point);
    minOrbitClearance = Math.min(minOrbitClearance, clearance);
    assert.ok(clearance > 2.1, fromId + ' to ' + toId + ' orbit stays outside mannequin bounds');
    setCamera(point, shot.target, shot.fov, 390 / 322);
    for (const x of [bounds.min.x, bounds.max.x]) for (const z of [bounds.min.z, bounds.max.z]) {
      project.set(x, shot.target.y, z).project(camera);
      const sideMargin = (1 - Math.abs(project.x)) / 2;
      minimumOrbitSideMargin = Math.min(minimumOrbitSideMargin, sideMargin);
      assert.ok(sideMargin >= .03, fromId + ' to ' + toId + ' keeps the lateral silhouette in the stage');
    }
    orbitFrames++;
  }
}

const viewFor = yaw => ({ cos: Math.cos(yaw), sin: Math.sin(yaw) });
const anchorViews = yaws.map(viewFor);
const orbitViews = Array.from({ length: 721 }, (_, i) => viewFor(THREE.MathUtils.lerp(minimumYaw, maximumYaw, i / 720)));
const anglePhones = [...phones, [372, 0], [390, 0]];
const round = value => Number(value.toFixed(4));
const measured = await measureAngleActors();
assert.deepEqual(angleBounds, measured.bounds, 'precomputed angle bounds match current assets and sampled cycle');

function projection(x, y, z, { cos, sin }, { target, distance }) {
  x -= target[0]; y -= target[1]; z -= target[2];
  return [x * cos - z * sin, y, distance - x * sin - z * cos];
}

const tangent = Math.tan(THREE.MathUtils.degToRad(fov / 2));
let minimumDepth = Infinity;
function angleMargins(views, fit, aspect) {
  const { min, max } = angleBounds;
  const margins = { lateral: 1, top: 1, bottom: 1 };
  for (const view of views) for (const x of [min[0], max[0]]) {
    for (const y of [min[1], max[1]]) for (const z of [min[2], max[2]]) {
      const [right, up, depth] = projection(x, y, z, view, fit);
      minimumDepth = Math.min(minimumDepth, depth);
      margins.lateral = Math.min(margins.lateral, (1 - Math.abs(right / depth / tangent / aspect)) / 2);
      margins.top = Math.min(margins.top, (1 - up / depth / tangent) / 2);
      margins.bottom = Math.min(margins.bottom, (1 + up / depth / tangent) / 2);
    }
  }
  return margins;
}

const profiles = anglePhones.map(([width, statusInset]) => {
  const height = angleStage - navigation - statusInset;
  const aspect = width / height;
  const fit = fitHubAngle(angleBounds, { yaws, fov, aspect });
  const { min, max } = angleBounds;
  assert.deepEqual(fit.target, min.map((value, axis) => (value + max[axis]) / 2), 'fixed center is the full-cycle box midpoint');
  const anchorMargins = angleMargins(anchorViews, fit, aspect);
  const sampledOrbitMargins = angleMargins(orbitViews, fit, aspect);
  const minimumMargin = Math.min(...Object.values(anchorMargins));
  assert.ok(minimumMargin >= .04 - 1e-10, 'box clears 4% at every phase yaw at width ' + width);
  assert.ok(minimumMargin < .0401, 'no unnecessary extra zoom reserve at width ' + width);
  assert.ok(Math.min(...Object.values(sampledOrbitMargins)) >= 0, 'box stays in-frame while rotating at width ' + width);
  return { width, statusInset, height, fit, anchorMargins, sampledOrbitMargins };
});
const angleFits = Object.fromEntries(angleActors.map(id =>
  [id, profiles.map(profile => ({ ...profile, phases: {} }))]));

for await (const { ids, motion, base, accessories } of angleSurfaces()) {
  for (const { phase, time } of phaseTicks) {
    motion.update(time);
    const yaw = angles[phase], cos = Math.cos(yaw), sin = Math.sin(yaw);
    for (const id of ids) {
      for (const { width, height, fit, phases } of angleFits[id]) {
        let left = Infinity, right = -Infinity, bottom = Infinity, top = -Infinity;
        const [cx, cy, cz] = fit.target;
        function accept(x, y, z) {
          const depth = fit.distance - (x - cx) * sin - (z - cz) * cos;
          const horizontal = ((x - cx) * cos - (z - cz) * sin) / depth / tangent;
          const vertical = (y - cy) / depth / tangent;
          left = Math.min(left, horizontal);
          right = Math.max(right, horizontal);
          bottom = Math.min(bottom, vertical);
          top = Math.max(top, vertical);
        }
        for (const visit of base) visit(accept);
        for (const visit of accessories[id]) visit(accept);
        const widthDp = (right - left) * height / 2;
        const heightDp = (top - bottom) * height / 2;
        const horizontal = widthDp >= heightDp;
        phases[phase] = {
          widthDp: round(widthDp), heightDp: round(heightDp),
          longSide: horizontal ? 'width' : 'height',
          longSideRatio: round(horizontal ? widthDp / width : heightDp / angleStage),
        };
      }
    }
  }
}

const minimumMargins = field => Object.fromEntries(['lateral', 'top', 'bottom'].map(side =>
  [side, round(Math.min(...profiles.map(profile => profile[field][side])))]));
console.log(JSON.stringify({ angleAnchorCornerProjections: anglePhones.length * anchorViews.length * 8,
  angleOrbitCornerProjections: anglePhones.length * orbitViews.length * 8, anglePoseSamples: measured.samples, actors: angleActors.length,
  angleStage, navigation, angleViewportProfiles: anglePhones, anchorCount: phaseTicks.length,
  fixedCamera: { fov, yawRange: [minimumYaw, maximumYaw], center: profiles[0].fit.target },
  minimumAngleMargins: minimumMargins('anchorMargins'), minimumSampledAngleOrbitMargins: minimumMargins('sampledOrbitMargins'),
  minCameraDepthM: round(minimumDepth), angleFits, orbitFrames, minOrbitClearanceM: round(minOrbitClearance),
  minimumOrbitSideMargin: round(minimumOrbitSideMargin),
  minimumStandingSideMargin: round(minimumSideMargin), standingStageHeightRange: [round(minimumHeight), round(maximumHeight)],
  standingCoverage, focused: { minimumSideMargin: round(minimumFocusSideMargin), maximumSize: round(maximumFocusSize),
    maximumZoom: round(maximumFocusZoom), maximumCenterOffset: round(maximumFocusCenterOffset), groups: focusedCoverage } }, null, 2));
