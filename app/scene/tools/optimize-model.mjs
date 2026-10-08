import fs from 'node:fs';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder } from 'meshoptimizer';
import { fileURLToPath } from 'node:url';

const source = new URL('../source/coach/flare-coach.glb', import.meta.url);
const intermediate = new URL('../source/coach/flare-coach.meshopt.glb', import.meta.url);
const output = new URL('../public/coach/flare-coach.meshopt.glb.gz', import.meta.url);
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const document = await io.read(fileURLToPath(source));
// The method name QUANTIZE refers to a recommended separate preprocessing
// step. We intentionally DO NOT run quantize(), reorder(), or simplify().
// Without preprocessing this extension encodes the original accessor bytes
// losslessly (no float filters). gzip is the recommended lossless outer layer.
document.createExtension(EXTMeshoptCompression).setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
const encoded = await io.writeBinary(document), zipped = gzipSync(encoded, { level: 9 });
fs.writeFileSync(intermediate, encoded); fs.writeFileSync(output, zipped);
const original = fs.readFileSync(source);
const result = {
  version: 1, source: 'source/coach/flare-coach.glb', intermediate: 'source/coach/flare-coach.meshopt.glb',
  runtime: 'public/coach/flare-coach.meshopt.glb.gz', compression: 'EXT_meshopt_compression without quantization or reorder, then gzip level 9',
  quantization: false, simplification: false, meshMerging: false,
  toolVersions: { gltfTransformCore: '4.2.1', gltfTransformExtensions: '4.2.1', meshoptimizer: '0.22.0' },
  sourceBytes: original.byteLength, meshoptBytes: encoded.byteLength, runtimeBytes: zipped.byteLength,
  sourceSha256: sha(original), meshoptSha256: sha(encoded), runtimeSha256: sha(zipped),
  modelLicense: 'Snow Rig, Blender Foundation, CC BY 4.0; project modifications preserved',
  reproduce: 'npm ci && npm run optimize:model && npm run build && npm run verify',
};
const miniSource = new URL('../source/anatomy/mannequin-reference.glb', import.meta.url);
const miniDocument = await io.read(fileURLToPath(miniSource));
miniDocument.createExtension(EXTMeshoptCompression).setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
const miniEncoded = await io.writeBinary(miniDocument), miniZipped = gzipSync(miniEncoded, { level: 9 });
fs.writeFileSync(new URL('../source/anatomy/mannequin-reference.meshopt.glb', import.meta.url), miniEncoded);
fs.writeFileSync(new URL('../public/anatomy/mannequin-reference.meshopt.glb.gz', import.meta.url), miniZipped);
const miniOriginal = fs.readFileSync(miniSource);
result.miniature = { source: 'source/anatomy/mannequin-reference.glb', runtime: 'public/anatomy/mannequin-reference.meshopt.glb.gz',
  sourceBytes: miniOriginal.byteLength, meshoptBytes: miniEncoded.byteLength, runtimeBytes: miniZipped.byteLength,
  sourceSha256: sha(miniOriginal), runtimeSha256: sha(miniZipped), license: 'Blender Studio Human Base Meshes, CC0-1.0' };
fs.writeFileSync(new URL('./model-optimization.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
