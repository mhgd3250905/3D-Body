import fs from 'node:fs';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder } from 'meshoptimizer';
import { fileURLToPath } from 'node:url';

const source = new URL('../source/coach/flare-coach-v41-animated.glb', import.meta.url);
const runtime = new URL('../public/coach/flare-coach-v41-animated.meshopt.glb.gz', import.meta.url);
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const document = await io.read(fileURLToPath(source));
document.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
// Encoding only: do not quantize, simplify, reorder or resample animation.
const zipped = gzipSync(await io.writeBinary(document), { level: 9 }); fs.writeFileSync(runtime, zipped);
const mirror = JSON.parse(fs.readFileSync(new URL('../source/v41-runtime/source-manifest.json', import.meta.url), 'utf8'));
const files = ['source/coach/flare-coach-v41-base.glb', 'source/coach/coach-v41-rig.json', 'public/coach/coach-v41-rig.json',
  'source/coach/flare-coach-v41-animated.glb', 'source/coach/flare-sequence-v41.json', 'src/v41-phases.json', 'src/v41-clock.json',
  'public/coach/flare-coach-v41-animated.meshopt.glb.gz', 'source/v41-runtime/source-manifest.json', ...mirror.files.map(item => item.destination)];
const manifest = { version: 'v41', repository: mirror.repository, commit: mirror.commit, originalAsset: mirror.sourceAsset,
  originalAssetSha256: mirror.sourceAssetSha256, sourceBytes: fs.statSync(source).size, runtimeBytes: zipped.length,
  encoding: 'Lossless meshopt + gzip relative to the baked GLB; no quantization, simplification or track resampling',
  bake: 'Pure Node source runtime / BodyViewer paced clock, 60fps, 22 bones; GLTFExporter normalizes source normals when required',
  clip: 'flare_v41_loop', license: 'Snow Rig / Blender Foundation CC BY 4.0, modified; attribution retained',
  files: files.map(destination => { const bytes = fs.readFileSync(new URL('../' + destination, import.meta.url)); return { destination, bytes: bytes.length, sha256: sha(bytes) }; }) };
fs.writeFileSync(new URL('./v41-source-manifest.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ version: manifest.version, commit: manifest.commit, sourceBytes: manifest.sourceBytes, runtimeBytes: manifest.runtimeBytes, files: manifest.files.length }, null, 2));
