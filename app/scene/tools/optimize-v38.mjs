import fs from 'node:fs';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder } from 'meshoptimizer';
import { fileURLToPath } from 'node:url';

const source = new URL('../source/coach/flare-coach-v38-animated.glb', import.meta.url);
const runtime = new URL('../public/coach/flare-coach-v38-animated.meshopt.glb.gz', import.meta.url);
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const document = await io.read(fileURLToPath(source));
document.createExtension(EXTMeshoptCompression).setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
// Encoding only: do not quantize, simplify, reorder or resample animations.
const zipped = gzipSync(await io.writeBinary(document), { level: 9 });
fs.writeFileSync(runtime, zipped);
const phases = JSON.parse(fs.readFileSync(new URL('../src/v38-phases.json', import.meta.url), 'utf8'));
const clock = { version: 'v38', frameTimes: phases.frames.map(frame => frame.time), sequenceTime: phases.frames.map(frame => frame.sequenceTime) };
fs.writeFileSync(new URL('../src/v38-clock.json', import.meta.url), JSON.stringify(clock) + '\n');
const files = ['source/coach/flare-coach-v38-animated.glb', 'source/coach/flare-sequence-v38.json', 'src/v38-phases.json', 'src/v38-clock.json', 'public/coach/flare-coach-v38-animated.meshopt.glb.gz'];
const manifest = { version: 'v38', package: 'Flare-v38-motion-package.zip', packageSha256: 'bce665b282faa003bcc84836e420930a2e8a54d31a709f34ea189f1c56210dee',
  sourceBytes: fs.statSync(source).size, runtimeBytes: zipped.length, encoding: 'Lossless meshopt + gzip; no quantization, simplification or animation resampling',
  clip: 'flare_v38_loop', license: 'Snow Rig / Blender Foundation CC BY 4.0, modified',
  files: files.map(destination => { const data = fs.readFileSync(new URL('../' + destination, import.meta.url)); return { destination, bytes: data.length, sha256: sha(data) }; }) };
fs.writeFileSync(new URL('./v38-source-manifest.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
