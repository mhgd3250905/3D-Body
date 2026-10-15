// Independent v42 candidate. Never overwrites the frozen v41 assets or app defaults.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { NodeIO } from '../../app/scene/node_modules/@gltf-transform/core/dist/index.modern.js';
import { ALL_EXTENSIONS } from '../../app/scene/node_modules/@gltf-transform/extensions/dist/index.modern.js';
import { loadGlb, readJson, names, sha256, verifyMirror } from '../../app/scene/tools/bake-v41-node.mjs';
import { createNaturalFlareMotion } from './natural-motion.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'output/flare-v42-r3-20261015');
fs.mkdirSync(output, { recursive: true });
verifyMirror();
const count = 540, duration = 1.35;
const rigData = readJson('source/coach/coach-v41-rig.json');
const model = (await loadGlb('source/coach/flare-coach-v41-base.glb')).scene;
const baselineModel = (await loadGlb('source/coach/flare-coach-v41-base.glb')).scene;
const motion = createNaturalFlareMotion({ model, baselineModel, rigData });
const bones = names.map(name => model.getObjectByName(name));
assert.ok(bones.every(Boolean));
const position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
const frames = [];
for (let i = 0; i <= count; i++) {
  motion.updatePhase(i / count);
  model.updateMatrixWorld(true);
  const local = bones.map(bone => {
    // Runtime spine helpers own their world matrix. All deform bones are parallel.
    bone.matrixWorld.decompose(position, quaternion, scale);
    assert.ok(scale.distanceTo(new THREE.Vector3(1, 1, 1)) < 1e-6, 'Unexpected animated scale');
    return [...position.toArray(), ...quaternion.normalize().toArray()];
  });
  const metrics = motion.getMetrics();
  frames.push({ phase: i / count, time: i / count * duration, local,
    baselineTime: i === count ? 9 : motion.sourceSequenceTime() });
}
let seamPositionMm = 0, seamAngleDeg = 0;
for (let j = 0; j < bones.length; j++) {
  seamPositionMm = Math.max(seamPositionMm, new THREE.Vector3(...frames[0].local[j]).distanceTo(new THREE.Vector3(...frames.at(-1).local[j])) * 1000);
  seamAngleDeg = Math.max(seamAngleDeg, new THREE.Quaternion(...frames[0].local[j].slice(3)).angleTo(new THREE.Quaternion(...frames.at(-1).local[j].slice(3))) * 180 / Math.PI);
}
assert.ok(seamPositionMm < 0.01 && seamAngleDeg < 0.01, 'Candidate loop is not closed');
const tracks = names.flatMap((name, j) => {
  const translations = [], rotations = [];
  let previous = null;
  for (const frame of frames) {
    translations.push(...frame.local[j].slice(0, 3));
    let q = frame.local[j].slice(3, 7);
    if (previous && previous.reduce((sum, x, k) => sum + x * q[k], 0) < 0) q = q.map(x => -x);
    rotations.push(...q); previous = q;
  }
  return [{ name, type: 'translation', size: 'VEC3', values: translations }, { name, type: 'rotation', size: 'VEC4', values: rotations }];
});
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
function geometryDigest(document) {
  return document.getRoot().listMeshes().map(mesh => ({ name: mesh.getName(), primitives: mesh.listPrimitives().map(p => ({
    mode: p.getMode(), material: p.getMaterial()?.getName(),
    indices: p.getIndices() ? sha256(Buffer.from(p.getIndices().getArray().buffer)) : null,
    attributes: Object.fromEntries(p.listSemantics().map(key => {
      const accessor = p.getAttribute(key), values = accessor.getArray();
      return [key, { count: accessor.getCount(), type: accessor.getType(), normalized: accessor.getNormalized(), sha256: sha256(Buffer.from(values.buffer, values.byteOffset, values.byteLength)) }];
    })),
  })) }));
}
const assets = [];
for (const [kind, source] of [
  ['coach', 'flare-coach-v41-animated.glb'],
  ['training', 'flare-coach-v41-training-human-collarfix-20261013.glb'],
]) {
  const sourcePath = path.join(root, 'app/scene/source/coach', source);
  const document = await io.read(sourcePath), before = geometryDigest(document);
  const materialBefore = (await io.writeJSON(document)).json.materials;
  const old = document.getRoot().listAnimations();
  for (const animation of old) {
    const channels = animation.listChannels(), samplers = animation.listSamplers();
    animation.dispose(); channels.forEach(c => c.dispose()); samplers.forEach(s => s.dispose());
  }
  const buffer = document.getRoot().listBuffers()[0];
  const times = document.createAccessor('v42_phase_time').setType('SCALAR').setArray(new Float32Array(frames.map(f => f.time))).setBuffer(buffer);
  const animation = document.createAnimation('flare_v42_candidate_loop');
  for (const track of tracks) {
    const bone = document.getRoot().listNodes().find(node => node.getName() === track.name);
    assert.ok(bone, `Missing ${track.name}`);
    const values = document.createAccessor(`v42_${track.name}_${track.type}`).setType(track.size).setArray(new Float32Array(track.values)).setBuffer(buffer);
    const sampler = document.createAnimationSampler().setInterpolation('LINEAR').setInput(times).setOutput(values);
    const channel = document.createAnimationChannel().setTargetNode(bone).setTargetPath(track.type).setSampler(sampler);
    animation.addSampler(sampler).addChannel(channel);
  }
  const target = path.join(output, `flare-${kind}-v42-candidate.glb`);
  await io.write(target, document);
  const readback = await io.read(target);
  assert.deepEqual(geometryDigest(readback), before, 'Original body geometry/skin attributes changed');
  assert.deepEqual((await io.writeJSON(readback)).json.materials, materialBefore, 'Original materials changed');
  assert.equal(readback.getRoot().listAnimations().length, 1);
  const baked = await loadGlb('../../' + path.relative(root, target).replaceAll('\\', '/'));
  const clip = baked.animations[0], mixer = new THREE.AnimationMixer(baked.scene), action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  let bakedBoneErrorMm = 0;
  for (let i = 0; i <= count; i += 15) {
    action.enabled = true; action.paused = false; mixer.setTime(frames[i].time); baked.scene.updateMatrixWorld(true);
    for (let j = 0; j < names.length; j++) {
      const point = baked.scene.getObjectByName(names[j]).getWorldPosition(new THREE.Vector3());
      bakedBoneErrorMm = Math.max(bakedBoneErrorMm, point.distanceTo(new THREE.Vector3(...frames[i].local[j])) * 1000);
    }
  }
  assert.ok(bakedBoneErrorMm < 0.01, 'GLB readback differs from authored bone transforms');
  mixer.stopAllAction(); mixer.uncacheRoot(baked.scene);
  const bytes = fs.readFileSync(target);
  assets.push({ kind, source: path.relative(root, sourcePath).replaceAll('\\', '/'), sourceSha256: sha256(fs.readFileSync(sourcePath)),
    output: path.relative(root, target).replaceAll('\\', '/'), sha256: sha256(bytes), bytes: bytes.length,
    geometryAndSkinAttributesPreserved: true, materialsPreserved: true, bakedBoneErrorMm });
}
const previousAvailable = ['coach','training'].every(kind => fs.existsSync(path.join(root, `output/flare-v42-20261015/flare-${kind}-v42-candidate.glb`)));
const clock = { duration, previousAvailable, phases: frames.map(f => f.phase), baselineSequenceTimes: frames.map(f => f.baselineTime) };
fs.writeFileSync(path.join(output, 'comparison-clock.json'), JSON.stringify(clock));
const dependencies = new Map();
function recordDependency(filename) {
  const relative = path.relative(root, filename).replaceAll('\\', '/');
  if (dependencies.has(relative)) return;
  const bytes = fs.readFileSync(filename); dependencies.set(relative, { path: relative, sha256: sha256(bytes) });
  if (!/\.[cm]?js$/.test(filename)) return;
  for (const match of bytes.toString().matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)) {
    const next = path.resolve(path.dirname(filename), match[1]);
    if (fs.existsSync(next)) recordDependency(next);
  }
}
recordDependency(fileURLToPath(new URL('./natural-motion.mjs', import.meta.url)));
const manifest = { version: motion.parameters.revision, branch: 'codex/flare-motion-natural-v42', date: '2026-10-15',
  status: 'Authored motion candidate for visual review; not motion capture and not an App release.',
  duration, frames: frames.length, tracks: tracks.length, bones: names.length, parameters: motion.parameters,
  implementationSha256: sha256(fs.readFileSync(new URL('./natural-motion.mjs', import.meta.url))),
  dependencies: [...dependencies.values()],
  seamPositionMm, seamAngleDeg, assets, license: 'Snow Rig / Blender Foundation CC BY 4.0; original attribution retained',
  geometry: 'Only animation replaced in copies of the two accepted bodies. Original meshes, weights, materials and source assets retained.',
};
fs.writeFileSync(path.join(output, 'bake-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(output, 'index.html'), fs.readFileSync(new URL('./index.html', import.meta.url)));
fs.writeFileSync(path.join(output, 'preview.js'), fs.readFileSync(new URL('./preview.js', import.meta.url)));
console.log(JSON.stringify(manifest, null, 2));
