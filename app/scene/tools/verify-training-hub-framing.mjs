import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createBakedMotion } from '../src/baked-motion.js';
import { characterFromLocation, characterAsset, applyCharacter } from '../src/characters.js';
import { GROUPS, phaseTicks } from '../src/phase.js';
import { muscleAt, resolveGroup } from '../src/legacy/muscle-map.js';
import { fitHubAngle } from '../src/training-hub-stage.js';
import { createHubTransitions } from '../src/training-hub-transitions.js';

globalThis.ProgressEvent ??= class { constructor(type, fields) { Object.assign(this, { type }, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const fixture = path => new URL(path, import.meta.url);
const rig = JSON.parse(fs.readFileSync(fixture('../public/coach/coach-v41-rig.json')));
const preset = fs.readFileSync(fixture('../../lib/platform/scene/scene_hub_camera.dart'), 'utf8');
const parse = (_, key, position, target, fov) => [key, {
  position: position.split(',').map(Number), target: target.split(',').map(Number), fov: Number(fov),
}];
const readCameras = pattern => Object.fromEntries([...preset.matchAll(pattern)].map(row => parse(...row)));
const angleCameras = readCameras(/(\d+): SceneHubCamera\(\[([^\]]+)]\s*,\s*\[([^\]]+)]\s*,\s*(\d+(?:\.\d+)?)\s*\)/g);
const standing = readCameras(/'([^']+)':\s*SceneHubCamera\(\s*\[([^\]]+)]\s*,\s*\[([^\]]+)]\s*,\s*(\d+(?:\.\d+)?)\s*\)/g);

assert.deepEqual(Object.keys(angleCameras), phaseTicks.map(({ phase }) => String(phase)));
assert.deepEqual(Object.keys(standing), Object.keys(GROUPS));

const angleStage = 452, navigation = 54;
const phones = [[320, 24], [390, 24], [393, 59], [430, 34], [430, 0]]
  .map(([width, statusInset]) => ({ width, height: angleStage - navigation - statusInset, statusInset }));
const project = new THREE.Vector3();
const camera = new THREE.PerspectiveCamera(32, 1, .02, 40);
const readModel = async path => {
  const bytes = gunzipSync(fs.readFileSync(fixture('../public/' + path.replace(/^\.\//, ''))));
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
};

const mannequin = await readModel('./anatomy/mannequin-reference.meshopt.glb.gz');
const bounds = new THREE.Box3().setFromObject(mannequin.scene);
const mannequinFrames = [[320, 298], [390, 322], [430, 346]];
const surfaces = { front: new Map(), back: new Map() };
const point = new THREE.Vector3();
const direction = new THREE.Vector3();
mannequin.scene.updateMatrixWorld(true);
mannequin.scene.traverse(mesh => {
  if (!mesh.isMesh) return;
  const { position, normal } = mesh.geometry.attributes;
  for (let vertex = 0; vertex < position.count; vertex++) {
    point.fromBufferAttribute(position, vertex);
    // The runtime's CPU twin uses the same atlas scoring as the shader.
    const panel = muscleAt(point);
    if (!panel || panel.score < .035) continue;
    point.applyMatrix4(mesh.matrixWorld);
    direction.fromBufferAttribute(normal, vertex).transformDirection(mesh.matrixWorld);
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

const standingCoverage = [];
for (const [id, group] of Object.entries(GROUPS)) {
  const frame = standing[id];
  assert.equal(Math.sign(frame.position[2]), group.view === 'front' ? 1 : -1, id);
  const vertices = resolveGroup(id).muscles.flatMap(panel => surfaces[group.view].get(panel) ?? []);
  assert.ok(vertices.length > 75, id + ' has a sampled atlas region');
  for (const [width, height] of mannequinFrames) {
    setCamera(new THREE.Vector3(...frame.position), new THREE.Vector3(...frame.target), frame.fov, width / height);
    const screen = new THREE.Box2();
    for (const point of vertices) {
      project.copy(point).project(camera);
      screen.expandByPoint(new THREE.Vector2((project.x + 1) * width / 2, (1 - project.y) * height / 2));
    }
    const center = screen.getCenter(new THREE.Vector2());
    const size = screen.getSize(new THREE.Vector2());
    const span = Math.max(size.x, size.y) / Math.min(width, height);
    const centerX = center.x / width;
    const centerY = center.y / height;
    const fadeOpacity = Math.max(0, (screen.max.y - (height - 120)) / (120 * .78));
    assert.ok(span >= .43 && span <= .47, id + ' fits 45% of short edge');
    assert.ok(Math.abs(centerX - .5) < .025 && centerY >= .345 && centerY <= .39, id + ' is centered above the lower fade');
    assert.ok(fadeOpacity < .065, id + ' remains visible through the lower fade');
    if (id === 'hamstrings' && width === 390) standingCoverage.push({
      id, surfaceVertices: vertices.length, span: Number(span.toFixed(3)),
      centerY: Number(centerY.toFixed(3)), lowerEdgeY: Number((screen.max.y / height).toFixed(3)),
      fadeOpacity: Number(fadeOpacity.toFixed(3)),
    });
  }
}

const defaultShot = standing.deltoids;
setCamera(new THREE.Vector3(...defaultShot.position), new THREE.Vector3(...defaultShot.target), defaultShot.fov, 320 / 335);
project.set(0, bounds.max.y, 0).project(camera);
assert.ok(Math.abs(project.y) < .98, 'default deltoid overview retains the head');
project.set(0, .47, 0).project(camera);
assert.ok(project.y < -1, 'default deltoid overview crops above the knee');

const base = { phaseSource: 9, phaseTime: 0, angleCamera: angleCameras[9],
  muscleId: 'deltoids', muscleCamera: defaultShot, showMuscles: true };
let orbitFrames = 0, minOrbitClearance = Infinity;
for (const [fromId, fromShot] of Object.entries(standing)) for (const [toId, toShot] of Object.entries(standing)) {
  if (fromId === toId) continue;
  const orbit = createHubTransitions(9);
  orbit.configure({ ...base, muscleId: fromId, muscleCamera: fromShot }, 0);
  orbit.configure({ ...base, muscleId: toId, muscleCamera: toShot }, 1);
  for (let elapsed = 0; elapsed <= 700; elapsed += 20) {
    orbit.sample(1 + elapsed);
    const shot = orbit.frame.muscle;
    point.setFromSpherical(shot.orbit).add(shot.target);
    const clearance = bounds.distanceToPoint(point);
    minOrbitClearance = Math.min(minOrbitClearance, clearance);
    assert.ok(clearance > .7, fromId + ' to ' + toId + ' orbit stays outside mannequin bounds');
    orbitFrames++;
  }
}

let frames = 0, minimumDepth = Infinity, maxHorizontalNdc = 0, maxVerticalNdc = 0;
const vertices = ['original', 'training', 'shadow', 'chrome', 'street', 'robot', 'cyber'];
for (const body of vertices) {
  const character = characterFromLocation('?character=' + body);
  const gltf = await readModel(characterAsset(character)); applyCharacter(gltf.scene, character);
  const motion = createBakedMotion(gltf, rig);

  for (const from of phaseTicks) for (const to of phaseTicks) {
    if (from.phase === to.phase) continue;
    const state = createHubTransitions(motion.clock.period);
    state.configure({ ...base, phaseSource: from.phase, phaseTime: from.time, angleCamera: angleCameras[from.phase] }, 0);
    state.configure({ ...base, phaseSource: to.phase, phaseTime: to.time, angleCamera: angleCameras[to.phase] }, 1);
    for (let elapsed = 0; elapsed <= 700; elapsed += 70) {
      state.sample(1 + elapsed);
      const { angle, time } = state.frame;
      motion.update(time);
      const envelope = motion.getBodyEnvelope();
      for (const { width, height } of phones) {
        camera.aspect = width / height;
        camera.fov = angle.fov;
        camera.position.setFromSpherical(angle.orbit).add(angle.target);
        camera.lookAt(angle.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld(true);
        fitHubAngle(camera, angle.target, envelope);
        for (const point of envelope) {
          const depth = -project.copy(point).applyMatrix4(camera.matrixWorldInverse).z;
          minimumDepth = Math.min(minimumDepth, depth);
          project.copy(point).project(camera);
          maxHorizontalNdc = Math.max(maxHorizontalNdc, Math.abs(project.x));
          maxVerticalNdc = Math.max(maxVerticalNdc, Math.abs(project.y));
          assert.ok(Math.abs(project.x) < .971 && Math.abs(project.y) < .971 && depth >= camera.near * 2,
            body + ' ' + from.phase + ' -> ' + to.phase + ' ' + width + '×' + height + ' ' + elapsed + 'ms');
        }
        frames++;
      }
    }
  }
  motion.dispose();
}

console.log(JSON.stringify({ frames, actors: vertices.length, angleStage, navigation, phones, anchorCount: phaseTicks.length, muscleCount: Object.keys(standing).length, mannequinFrames,
  maxHorizontalNdc: Number(maxHorizontalNdc.toFixed(3)), maxVerticalNdc: Number(maxVerticalNdc.toFixed(3)),
  minCameraDepthM: Number(minimumDepth.toFixed(3)), orbitFrames, minOrbitClearanceM: Number(minOrbitClearance.toFixed(3)), standingCoverage }, null, 2));
