import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Portable file/geometry checks for a fresh clone; no browser storage or source
// ZIP/Blender installation is needed. This does not replace visual verification.
const root = new URL('../', import.meta.url);
const read = path => fs.readFile(new URL(path, root));
const json = async path => JSON.parse(await read(path));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const originals = {
  '托马斯/阶段1-可用动画-2026-10-06.json': 'b68d9992dde6da810e31d785d8ba5b5e79ba62620e7cd2ff57260032fb480af3',
  'public/coach/flare-sequence.json': '743b028afef5cb7a854a0445c24a1456ef0dc0b8171a8a85df29241be57cf787',
  '托马斯/16.json': 'f9a5f0b08ddeb0939f777aa628f7357f85de897ae7a78eb3d11badd93a0d9483',
};
for (const [path, expected] of Object.entries(originals)) assert.equal(sha(await read(path)), expected, path);
const metadata = await json('public/anatomy/fitness-reference.json');
const bytes = await read('public/anatomy/fitness-reference.glb');
assert.equal(metadata.source, 'Blender Studio Human Base Meshes');
assert.equal(metadata.license, 'CC0-1.0');assert.equal(metadata.bodyRegistration, 'independent');
assert.equal(metadata.units, 'meters');assert.equal(metadata.frontAxis, '+Z');assert.equal(metadata.upAxis, '+Y');
assert.equal(bytes.length, metadata.glbBytes);assert.equal(sha(bytes), metadata.glbSha256);
const document = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString('utf8'));
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
const { scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
scene.updateMatrixWorld(true);
const meshes = [];scene.traverse(object => { if (object.isMesh) meshes.push(object); });
assert.equal(meshes.length, metadata.parts.length);assert.equal(meshes.length, 2);
let triangles = 0;
for (const mesh of meshes) {
  const part = metadata.parts.find(value => value.name === mesh.name);assert.ok(part, mesh.name);
  assert.equal(mesh.userData.partRole, part.partRole);
  const positions = mesh.geometry.getAttribute('position');
  const exportedNode = document.nodes.find(value => value.name === mesh.name && Number.isInteger(value.mesh));assert.ok(exportedNode, mesh.name);
  const exportedMesh = document.meshes[exportedNode.mesh];
  const exportedVertices = exportedMesh.primitives.reduce((total, primitive) => total + document.accessors[primitive.attributes.POSITION].count, 0);
  // Metadata counts authoring vertices; glTF splits vertices at UV/normal seams.
  assert.equal(positions.count, exportedVertices);assert.ok(positions.count >= part.vertices);
  assert.ok([...positions.array].every(Number.isFinite), `${mesh.name} finite geometry`);
  const count = (mesh.geometry.index?.count ?? positions.count) / 3;
  assert.equal(count, part.triangles);triangles += count;
}
assert.equal(triangles, metadata.triangles);
const bounds = new THREE.Box3().setFromObject(scene);
for (const endpoint of ['min', 'max']) for (let i = 0; i < 3; i++) {
  assert.ok(Math.abs(bounds[endpoint].getComponent(i) - metadata.bounds[endpoint][i]) < 1e-5, `${endpoint}[${i}]`);
}
// The authoring metadata also monitors local source archives. Only public
// runtime assets must exist in a clone; local-only archives are not required.
let sourceAssets = 0;
for (const [path, expected] of Object.entries(metadata.sourceHashesBefore)) {
  const normalized = path.replaceAll('\\', '/');
  if (!normalized.startsWith('public/')) continue;
  assert.equal(sha(await read(normalized)), expected, normalized);sourceAssets++;
}
assert.deepEqual(await read('docs/movement-teaching.md'), await read('public/movement-teaching.md'));
for (const mesh of meshes) { mesh.geometry.dispose();for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose(); }
console.log(JSON.stringify({passed:true,source:metadata.source,sourceVersion:metadata.sourceVersion,
  glbSha256:metadata.glbSha256,meshCount:meshes.length,triangles,originalMotionHashesUnchanged:true,
  originalRuntimeAssetsUnchanged:sourceAssets,teachingCopiesIdentical:true,requiresLocalBlenderArchives:false},null,2));
