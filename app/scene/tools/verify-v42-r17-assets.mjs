// Check the delivered runtime bytes against the verified bugfix release, not just names.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

const root = new URL('../../../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const release = JSON.parse(read('tools/motion-v42-r17/releases/v42-r17.json'));
const manifest = JSON.parse(read('app/scene/tools/v42-r17-source-manifest.json'));
for (const asset of manifest.assets) {
  const bytes = read(asset.destination); assert.equal(bytes.length, asset.bytes);
  assert.equal(sha(bytes), asset.sha256, 'Published asset differs: ' + asset.destination);
}
await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
function sameAccessor(a, b, label) {
  assert.equal(a.getType(), b.getType(), label); assert.equal(a.getNormalized(), b.getNormalized(), label);
  const x = a.getArray(), y = b.getArray(); assert.equal(x.constructor.name, y.constructor.name, label);
  assert.ok(Buffer.from(x.buffer, x.byteOffset, x.byteLength).equals(Buffer.from(y.buffer, y.byteOffset, y.byteLength)), label);
}
const bodies = [];
for (const verified of release.assets) {
  const name = verified.kind === 'coach' ? 'flare-coach-v42-r17-animated' : 'flare-coach-v42-r17-training-human';
  const bytes = read(`app/scene/source/coach/${name}.glb`);
  assert.equal(sha(bytes), verified.sha256); assert.equal(bytes.length, verified.bytes);
  if (verified.kind === 'coach') assert.ok(bytes.equals(read(`public/coach/${name}.glb`)), 'Web default uses the same R17');
  const source = await io.readBinary(bytes);
  const runtime = await io.readBinary(gunzipSync(read(`app/scene/public/coach/${name}.meshopt.glb.gz`)));
  const a = source.getRoot(), b = runtime.getRoot();
  assert.deepEqual((await io.writeJSON(source)).json.materials, (await io.writeJSON(runtime)).json.materials);
  assert.equal(a.listMeshes().length, b.listMeshes().length);
  let attributes = 0, triangles = 0, samplers = 0;
  for (let m = 0; m < a.listMeshes().length; m++) {
    const left = a.listMeshes()[m], right = b.listMeshes()[m]; assert.equal(left.getName(), right.getName());
    assert.equal(left.listPrimitives().length, right.listPrimitives().length);
    for (let p = 0; p < left.listPrimitives().length; p++) {
      const x = left.listPrimitives()[p], y = right.listPrimitives()[p]; assert.equal(x.getMode(), y.getMode());
      assert.equal(x.getMaterial()?.getName(), y.getMaterial()?.getName());
      assert.deepEqual(x.listSemantics(), y.listSemantics());
      for (const key of x.listSemantics()) { sameAccessor(x.getAttribute(key), y.getAttribute(key), left.getName() + ':' + key); attributes++; }
      const ix = x.getIndices()?.getArray(), iy = y.getIndices()?.getArray();
      assert.equal(ix?.length, iy?.length);
      if (ix) for (let t = 0; t < ix.length; t += 3) {
        assert.ok([0, 1, 2].some(k => [0, 1, 2].every(j => ix[t + j] === iy[t + (j + k) % 3])), 'Triangle changed'); triangles++;
      }
    }
  }
  assert.equal(a.listSkins().length, b.listSkins().length);
  for (let s = 0; s < a.listSkins().length; s++) {
    assert.deepEqual(a.listSkins()[s].listJoints().map(x => x.getName()), b.listSkins()[s].listJoints().map(x => x.getName()));
    sameAccessor(a.listSkins()[s].getInverseBindMatrices(), b.listSkins()[s].getInverseBindMatrices(), 'Inverse bind matrices');
  }
  assert.equal(a.listAnimations().length, 1); assert.equal(b.listAnimations().length, 1);
  const aa = a.listAnimations()[0], ab = b.listAnimations()[0]; assert.equal(aa.getName(), ab.getName());
  assert.equal(aa.listChannels().length, 44); assert.equal(ab.listChannels().length, 44);
  for (let c = 0; c < aa.listChannels().length; c++) {
    const x = aa.listChannels()[c], y = ab.listChannels()[c];
    assert.equal(x.getTargetNode().getName(), y.getTargetNode().getName()); assert.equal(x.getTargetPath(), y.getTargetPath());
    const xs = x.getSampler(), ys = y.getSampler(); assert.equal(xs.getInterpolation(), ys.getInterpolation());
    sameAccessor(xs.getInput(), ys.getInput(), 'Animation key times'); sameAccessor(xs.getOutput(), ys.getOutput(), 'Animation values'); samplers++;
  }
  bodies.push({ body: verified.kind, verifiedSha256: verified.sha256, meshAttributes: attributes, triangles, samplers, materialsUnchanged: true, inverseBindsUnchanged: true });
}
assert.ok(read('public/coach/flare-v42-r17-clock.json').equals(read('app/scene/src/v42-r17-clock.json')), 'App/Web clocks differ');
const clock = JSON.parse(read('app/scene/src/v42-r17-clock.json'));
const previousClock = JSON.parse(read('app/scene/src/v42-clock.json'));
const phases = JSON.parse(read('app/scene/src/v42-r17-phases.json'));
const previousPhases = JSON.parse(read('app/scene/src/v42-phases.json'));
assert.equal(clock.version, 'v42-r17');
assert.equal(phases.version, 'v42-r17');
assert.equal(clock.frameTimes.length, release.frames);
assert.equal(phases.frames.length, release.frames);
assert.deepEqual(clock.frameTimes, previousClock.frameTimes, 'Clip timeline changed');
let maximumSequenceTimeError = 0;
for (let i = 0; i < release.frames; i++) {
  maximumSequenceTimeError = Math.max(maximumSequenceTimeError, Math.abs(clock.sequenceTime[i] - previousClock.sequenceTime[i]));
  if (i) assert.ok(clock.sequenceTime[i] > clock.sequenceTime[i - 1], 'Teaching clock must remain invertible');
  for (const field of ['phaseId', 'phaseSource', 'support', 'primary', 'secondary'])
    assert.deepEqual(phases.frames[i][field], previousPhases.frames[i][field], 'Teaching phase changed: ' + field);
}
assert.ok(maximumSequenceTimeError < 1e-12, 'R17 must inherit the prior teaching timeline');
console.log(JSON.stringify({ passed: true, scope: 'verified-R17-source-and-lossless-runtime-byte-parity', publishedAssets: manifest.assets.length, bodies, teachingClock: { frames: release.frames, maximumSequenceTimeError, phaseAndSupportLabelsUnchanged: true } }, null, 2));
