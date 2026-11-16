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
const distance = number('angleDistance'), targetHeight = number('angleTargetHeight'), fov = number('angleFov');
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
const angle = yaw => ({ yaw, distance, targetHeight, fov });
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

const base = { phaseSource: 9, phaseTime: 0, angleCamera: angle(angles[9]),
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

const yaws = Object.values(angles);
const panRange = { start: Math.min(...yaws), end: Math.max(...yaws) };
const views = Array.from({ length: 51 }, (_, i) => THREE.MathUtils.lerp(panRange.start, panRange.end, i / 50))
  .concat(yaws).map(yaw => ({ cos: Math.cos(yaw), sin: Math.sin(yaw) }));
const tangent = Math.tan(THREE.MathUtils.degToRad(fov / 2));
let frames = 0, minimumDepth = Infinity, angleSideMargin = 1, angleTopMargin = 1, angleBottomMargin = 1;
const actors = ['original', 'training', 'shadow', 'chrome', 'street', 'robot', 'cyber'];
for (const body of actors) {
  const character = characterFromLocation('?character=' + body);
  const gltf = await readModel(characterAsset(character)); applyCharacter(gltf.scene, character);
  const motion = createBakedMotion(gltf, rig);
  // Scrubbing can leave any stored yaw over any pose, including in-between
  // frames. Cover the full time/yaw product rather than just phase jumps.
  for (let frame = 0; frame <= frameCount; frame++) {
    motion.update(motion.clock.toSequence(motion.clock.duration * frame / frameCount));
    const envelope = motion.getBodyEnvelope();
    for (const { cos, sin } of views) {
      let right = 0, top = 0, bottom = 0;
      for (const world of envelope) {
        const depth = distance - world.x * sin - world.z * cos;
        minimumDepth = Math.min(minimumDepth, depth);
        right = Math.max(right, Math.abs(world.x * cos - world.z * sin) / (depth * tangent));
        const y = (world.y - targetHeight) / (depth * tangent);
        top = Math.max(top, y);
        bottom = Math.max(bottom, -y);
      }
      for (const [width, statusInset] of phones) {
        const toolbar = navigation + statusInset;
        const height = angleStage - toolbar;
        const side = (1 - right * height / width) / 2;
        const topMargin = (toolbar + (1 - top) * height / 2) / angleStage;
        const bottomMargin = (1 - bottom) * height / (2 * angleStage);
        angleSideMargin = Math.min(angleSideMargin, side);
        angleTopMargin = Math.min(angleTopMargin, topMargin);
        angleBottomMargin = Math.min(angleBottomMargin, bottomMargin);
        assert.ok(Math.min(side, topMargin, bottomMargin) >= .1,
          body + ': incomplete angle at frame ' + frame + ' on width ' + width);
        assert.ok(top <= .8, 'leaves space between the athlete and the toolbar');
        frames++;
      }
    }
  }
  motion.dispose();
}

const round = value => Number(value.toFixed(4));
console.log(JSON.stringify({ frames, actors: actors.length, angleStage, navigation, phones, anchorCount: phaseTicks.length,
  fixedCamera: { distance, targetHeight, fov }, minimumAngleMargins: {
    lateral: round(angleSideMargin), top: round(angleTopMargin), bottom: round(angleBottomMargin),
  }, minCameraDepthM: round(minimumDepth), orbitFrames, minOrbitClearanceM: round(minOrbitClearance),
  minimumOrbitSideMargin: round(minimumOrbitSideMargin),
  minimumStandingSideMargin: round(minimumSideMargin), standingStageHeightRange: [round(minimumHeight), round(maximumHeight)],
  standingCoverage, focused: { minimumSideMargin: round(minimumFocusSideMargin), maximumSize: round(maximumFocusSize),
    maximumZoom: round(maximumFocusZoom), maximumCenterOffset: round(maximumFocusCenterOffset), groups: focusedCoverage } }, null, 2));
