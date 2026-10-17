import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createBakedMotion } from '../src/baked-motion.js';
import { characterFromLocation, characterAsset, applyCharacter } from '../src/characters.js';
import { FlarePlayer, CAMERA_PRESETS } from '../src/player.js';

globalThis.ProgressEvent ??= class { constructor(type, fields) { Object.assign(this, { type }, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const rig = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-v41-rig.json', import.meta.url), 'utf8'));
const rows = [];
for (const search of ['', '?body=training', '?character=shadow', '?character=chrome', '?character=street', '?character=robot', '?character=cyber']) {
  const character = characterFromLocation(search), asset = characterAsset(character);
  const bytes = gunzipSync(fs.readFileSync(new URL('../public/' + asset.replace(/^\.\//, ''), import.meta.url)));
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  applyCharacter(gltf.scene, character);
  const motion = createBakedMotion(gltf, rig), meshes = [], loopBounds = new THREE.Box3();
  gltf.scene.traverse(mesh => { if (mesh.isMesh && mesh.visible) meshes.push(mesh); });
  for (let i = 0; i < 18; i++) {
    motion.update(i * 9 / 18); const bounds = motion.getMetrics().bounds;
    loopBounds.union(new THREE.Box3(new THREE.Vector3(...bounds.min), new THREE.Vector3(...bounds.max)));
  }
  loopBounds.expandByScalar(rig.height * 0.045);
  for (const height of [650, 400]) {
    const camera = new THREE.PerspectiveCamera(32, 390 / height, 0.02, 40);
    const player = Object.create(FlarePlayer.prototype);
    Object.assign(player, { camera, baseFov: 32, container: { clientWidth: 390, clientHeight: height },
      framingMode: 'main', viewInset: 0, viewInsetTarget: 0, loopBounds,
      controls: { target: new THREE.Vector3(), update() { camera.lookAt(this.target); camera.updateMatrixWorld(true); } } });
    player.updateFramingTarget(); player.applyProjection(); player.resetView(CAMERA_PRESETS.standard);
    const min = new THREE.Vector2(Infinity, Infinity), max = new THREE.Vector2(-Infinity, -Infinity), p = new THREE.Vector3();
    for (let frame = 0; frame <= 180; frame++) {
      motion.update(frame / 20);
      for (const mesh of meshes) {
        for (let i = 0; i < mesh.geometry.attributes.position.count; i += 24) {
          if (mesh.isSkinnedMesh) mesh.getVertexPosition(i, p); else p.fromBufferAttribute(mesh.geometry.attributes.position, i);
          p.applyMatrix4(mesh.matrixWorld).project(camera);
          const pixel = new THREE.Vector2((p.x + 1) / 2 * 390, (1 - p.y) / 2 * height); min.min(pixel); max.max(pixel);
        }
      }
    }
    assert.ok(min.x >= 3 && max.x <= 387 && min.y >= 3 && max.y <= height - 3,
      `${character.id} ${height}px stage clips body: ${JSON.stringify({ min: min.toArray(), max: max.toArray() })}`);
    rows.push({ character: character.id, viewport: [390, height], projectedMin: min.toArray(), projectedMax: max.toArray() });
  }
  motion.dispose();
}
console.log(JSON.stringify({ status: 'passed', scope: 'v42-r16-default-home-seven-characters-projection', poses: 181, vertexStride: 24,
  cases: rows, limitation: 'CPU vertex projection checks canvas fit; it does not inspect GPU shading or host overlays.' }, null, 2));
