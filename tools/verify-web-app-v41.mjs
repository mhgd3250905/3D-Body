// Compare the actual retained web runtime with the app's baked v41 player.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createBakedMotion, createBakedClock } from '../app/scene/src/baked-motion.js';

globalThis.location ??= { search: '' };
globalThis.ProgressEvent ??= class { constructor(type, fields) { Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
async function load(relative) {
  let bytes = fs.readFileSync(new URL('../' + relative, import.meta.url));
  if (relative.endsWith('.gz')) bytes = gunzipSync(bytes);
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
}
const rig = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-rig.json', import.meta.url)));
const timing = JSON.parse(fs.readFileSync(new URL('../app/scene/src/v41-clock.json', import.meta.url)));
const [web, app] = await Promise.all([
  load('public/coach/flare-coach.glb'),
  load('app/scene/public/coach/flare-coach-v41-animated.meshopt.glb.gz'),
]);
const live = createCoachMotion({ model: web.scene, rigData: rig });
const clock = createBakedClock(timing), baked = createBakedMotion(app, rig, clock);
const names = [];
app.scene.traverse(node => { if (node.isBone) names.push(node.name); });
assert.equal(names.length, 22);
let boneError = 0, rotationError = 0, matrixError = 0;
const p = new THREE.Vector3(), q = new THREE.Vector3();
const qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
const webBody = web.scene.getObjectByName('Coach_Body');
const appBody = app.scene.getObjectByName('Coach_Body');
for (const time of timing.sequenceTime) {
  live.update(time); baked.update(time);
  web.scene.updateMatrixWorld(true); app.scene.updateMatrixWorld(true);
  for (const name of names) {
    const a = web.scene.getObjectByName(name), b = app.scene.getObjectByName(name);
    assert.ok(a && b, name);
    boneError = Math.max(boneError, a.getWorldPosition(p).distanceTo(b.getWorldPosition(q)));
    rotationError = Math.max(rotationError, a.getWorldQuaternion(qa).normalize().angleTo(b.getWorldQuaternion(qb).normalize()));
    matrixError = Math.max(matrixError, ...a.matrixWorld.elements.map((v, i) => Math.abs(v - b.matrixWorld.elements[i])));
  }
  webBody.skeleton.update(); appBody.skeleton.update();
  // Runtime compression can reorder vertices. Compare the source to its
  // lossless baked copy through spatial samples verified by verify-v41.
}
assert.ok(boneError < 0.0001, 'Web/App bone positions differ by >0.1mm: ' + boneError);
assert.ok(rotationError < 0.0001, 'Web/App bone orientation differs: ' + rotationError);
// The exact source and encoded vertex ordering is tested separately by the
// bake and lossless checks; this check measures the installed web solver.
console.log(JSON.stringify({ status: 'passed', scope: 'installed-web-runtime-vs-app-v41',
  frames: timing.sequenceTime.length, bones: names.length,
  maxBoneErrorMm: boneError * 1000, maxRotationErrorRadians: rotationError,
  maxMatrixElementError: matrixError, clockRoundtripMaxError: Math.max(...timing.sequenceTime.map(t => Math.abs(clock.toSequence(clock.toWall(t)) - t))),
  limitation: 'Default packaged loop only; personal authored sequences keep their own version. Native performance not measured.' }, null, 2));
