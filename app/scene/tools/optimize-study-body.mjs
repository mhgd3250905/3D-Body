import fs from 'node:fs';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder } from 'meshoptimizer';
import { fileURLToPath } from 'node:url';

const source = new URL('../source/coach/flare-coach-study-body.glb', import.meta.url);
const intermediate = new URL('../source/coach/flare-coach-study-body.meshopt.glb', import.meta.url);
const output = new URL('../public/coach/flare-coach-study-body.meshopt.glb.gz', import.meta.url);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const document = await io.read(fileURLToPath(source));
document.createExtension(EXTMeshoptCompression).setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
// Encode original accessor values. No quantization, simplification or reorder.
const encoded = await io.writeBinary(document), zipped = gzipSync(encoded, { level: 9 });
fs.writeFileSync(intermediate, encoded); fs.writeFileSync(output, zipped);
const original = fs.readFileSync(source);
const result = {
  source: 'source/coach/flare-coach-study-body.glb', runtime: 'public/coach/flare-coach-study-body.meshopt.glb.gz',
  sourceBytes: original.byteLength, meshoptBytes: encoded.byteLength, runtimeBytes: zipped.byteLength,
  sourceSha256: hash(original), runtimeSha256: hash(zipped),
  license: 'Snow Rig, Blender Foundation, CC BY 4.0; same source skin restored beneath clothing',
  bones: 20, quantization: false, simplification: false,
  reproduce: 'Run tools/blender/build_coach_study.py in Blender, then npm run optimize:study and npm run build',
};
const headSource = new URL('../source/coach/flare-coach-study-head.glb', import.meta.url);
const head = await io.read(fileURLToPath(headSource));
head.createExtension(EXTMeshoptCompression).setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
const headEncoded = await io.writeBinary(head), headZipped = gzipSync(headEncoded, { level: 9 });
fs.writeFileSync(new URL('../source/coach/flare-coach-study-head.meshopt.glb', import.meta.url), headEncoded);
fs.writeFileSync(new URL('../public/coach/flare-coach-study-head.meshopt.glb.gz', import.meta.url), headZipped);
const headOriginal = fs.readFileSync(headSource);
result.head = { source: 'source/coach/flare-coach-study-head.glb', runtime: 'public/coach/flare-coach-study-head.meshopt.glb.gz',
  sourceBytes: headOriginal.byteLength, meshoptBytes: headEncoded.byteLength, runtimeBytes: headZipped.byteLength,
  sourceSha256: hash(headOriginal), runtimeSha256: hash(headZipped),
  license: 'Snow Rig, Blender Foundation, CC BY 4.0; same mature head smoothed into a featureless mannequin',
  bones: 20, quantization: false, simplification: false };
fs.writeFileSync(new URL('./study-body-optimization.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
