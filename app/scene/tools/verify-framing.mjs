import fs from 'node:fs';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createBakedMotion } from '../src/baked-motion.js';
import { attachStudyBody, attachStudyHead, prepareStudySpine } from '../src/study-body.js';
import { FlarePlayer, CAMERA_PRESETS } from '../src/player.js';

globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
async function load(name) {
  const bytes = gunzipSync(fs.readFileSync(new URL('../public/coach/' + name, import.meta.url)));
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
}
const revision = process.argv.includes('--v38') ? 'v38' : 'v41';
const gltf = await load(`flare-coach-${revision}-animated.meshopt.glb.gz`);
const model = gltf.scene;
const rigFile = revision === 'v41' ? 'coach-v41-rig.json' : 'coach-rig.json';
const rigData = JSON.parse(fs.readFileSync(new URL('../public/coach/' + rigFile, import.meta.url), 'utf8'));
const motion = createBakedMotion(gltf, rigData), meshes = [], box = new THREE.Box3();
model.traverse(mesh => { if (mesh.isSkinnedMesh && mesh.visible) meshes.push(mesh); });
for (let i = 0; i < 18; i++) { motion.update(i / 2); const b = motion.getMetrics().bounds; box.union(new THREE.Box3(new THREE.Vector3().fromArray(b.min), new THREE.Vector3().fromArray(b.max))); }
box.expandByScalar(rigData.height * 0.045);
for (const padding of [0.75]) {
  const camera = new THREE.PerspectiveCamera(32, 390 / 650, 0.02, 40);
  camera.setViewOffset(390, 650, 10, 138, 390, 650); camera.updateProjectionMatrix();
  const controls = { target: new THREE.Vector3(), update() { const d = camera.position.clone().sub(this.target), length = d.length(); camera.position.copy(this.target).addScaledVector(d.normalize(), THREE.MathUtils.clamp(length, 0.45, 7)); camera.lookAt(this.target); camera.updateMatrixWorld(true); } };
  const fake = { camera, controls, container: { clientWidth: 390 }, insetLeft: 0,
    setCameraView: FlarePlayer.prototype.setCameraView };
  FlarePlayer.prototype.fitBounds.call(fake, box, CAMERA_PRESETS.standard, padding);
  const min = new THREE.Vector2(Infinity, Infinity), max = new THREE.Vector2(-Infinity, -Infinity), p = new THREE.Vector3();
  for (let frame = 0; frame <= 180; frame++) {
    motion.update(frame / 20); model.updateMatrixWorld(true);
    for (const mesh of meshes) {
      mesh.skeleton.update();
      for (let i = 0; i < mesh.geometry.attributes.position.count; i += 8) {
        mesh.getVertexPosition(i, p).applyMatrix4(mesh.matrixWorld).project(camera);
        const pixel = new THREE.Vector2((p.x + 1) / 2 * 390, (1 - p.y) / 2 * 650); min.min(pixel); max.max(pixel);
      }
    }
  }
  assert.ok(min.x >= 3 && max.x <= 387 && min.y >= 3 && max.y <= 647,
    'Authored body crosses the default stage boundary: ' + JSON.stringify({ min: min.toArray(), max: max.toArray(), camera: camera.position.toArray() }));
  console.log(JSON.stringify({ status: 'passed', motionRevision: revision, playback: 'AnimationMixer',
    scope: 'default-clothed-home-loop-projection', viewport: [390, 650], padding, staticOffset: [10, 138], sampledPoses: 181,
    vertexStride: 8, projectedVertexMin: min.toArray(), projectedVertexMax: max.toArray(), camera: camera.position.toArray() }, null, 2));
}
