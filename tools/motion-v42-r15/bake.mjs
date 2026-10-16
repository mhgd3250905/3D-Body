// Independent R15 candidate. Never overwrites the accepted R14 or App defaults.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { NodeIO } from '../../app/scene/node_modules/@gltf-transform/core/dist/index.modern.js';
import { ALL_EXTENSIONS } from '../../app/scene/node_modules/@gltf-transform/extensions/dist/index.modern.js';
import { loadGlb, readJson, names, sha256, verifyMirror } from '../../app/scene/tools/bake-v41-node.mjs';
import { createReferenceMotion } from './reference-motion.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
let outputArgument = 'output/flare-v42-r15-20261017';
if (process.argv.length > 2) {
  if (process.argv.length !== 4 || process.argv[2] !== '--out') throw new Error('Usage: node tools/motion-v42-r15/bake.mjs [--out output/<new-batch>]');
  outputArgument = process.argv[3];
}
const outputRoot = path.join(root, 'output');
const output = path.resolve(root, outputArgument);
if (path.dirname(output) !== outputRoot || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(path.basename(output))) {
  throw new Error('--out must name a direct child directory of this project\'s output directory');
}
if (fs.existsSync(output) && (fs.lstatSync(output).isSymbolicLink() || !fs.statSync(output).isDirectory())) {
  throw new Error('Output must be a regular directory, not a symbolic link or file');
}
if (fs.existsSync(output) && fs.readdirSync(output).some(name => /\.glb$/i.test(name) || name === 'bake-manifest.json')) {
  throw new Error(`Refusing to overwrite an existing baked batch: ${output}. Choose a new --out directory.`);
}
fs.mkdirSync(output, { recursive: true });
verifyMirror();
const count = 540, duration = 1.35;
const rigData = readJson('source/coach/coach-v41-rig.json');
const sourceBatch=path.join(root,'output/flare-v42-r14-20261016');
const acceptedHashes={coach:'364faba82bb68d1d6a40f5cb53003d4ff721912445474c404548632a93e5921d',training:'1b65dfa69ef674ad968a1534e0e0d6e7fa1a28b07c4ca0d9132d36282f324e68'};
for(const [kind,expected]of Object.entries(acceptedHashes))assert.equal(sha256(fs.readFileSync(path.join(sourceBatch,`flare-${kind}-v42-candidate.glb`))),expected,`Frozen R14 ${kind} hash mismatch`);
const frozen = await loadGlb('../../output/flare-v42-r14-20261016/flare-training-v42-candidate.glb');
const model = (await loadGlb('../../output/flare-v42-r14-20261016/flare-training-v42-candidate.glb')).scene;
const baselineModel = (await loadGlb('source/coach/flare-coach-v41-base.glb')).scene;
const recovery0=JSON.parse(fs.readFileSync(path.join(sourceBatch,'recovery-samples.json'),'utf8'))[0];
const sourceClock=JSON.parse(fs.readFileSync(path.join(sourceBatch,'comparison-clock.json'),'utf8'));
const motion = createReferenceMotion({model,sourceModel:frozen.scene,baselineModel,rigData,clip:frozen.animations[0],clock:sourceClock,palmAnchors:{left:recovery0.joints.leftPalm,right:recovery0.joints.rightPalm}});
const bones = names.map(name => model.getObjectByName(name));
assert.ok(bones.every(Boolean));
const position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
const frames = [], recoverySamples = [];
for (let i = 0; i <= count; i++) {
  motion.updatePhase(i / count);
  model.updateMatrixWorld(true);
  const local = bones.map(bone => {
    // Runtime spine helpers own their world matrix. All deform bones are parallel.
    bone.matrixWorld.decompose(position, quaternion, scale);
    assert.ok(scale.distanceTo(new THREE.Vector3(1, 1, 1)) < 1e-6, `Unexpected animated scale ${bone.name} phase=${i/count}: ${scale.toArray()}`);
    return [...position.toArray(), ...quaternion.normalize().toArray()];
  });
  const metrics = motion.getMetrics();
  recoverySamples.push({ phase: i / count, armRefinement: metrics.design?.armRefinement ?? null, reachPreparation: metrics.design?.reachPreparation ?? null, planeRefinement: metrics.design?.planeRefinement ?? null, referenceStudy: metrics.design?.referenceStudy ?? null,
    joints: Object.fromEntries(['pelvis','torso','leftShoulder','leftElbow','leftWrist','leftPalm','rightShoulder','rightElbow','rightWrist','rightPalm'].map(key => [key, metrics.joints[key]])) });
  frames.push({ phase: i / count, time: i / count * duration, local,
    baselineTime: i === count ? 9 : motion.sourceSequenceTime() });
}
// A preview must seek reproducibly after arbitrary scrubbing, not just when
// evaluated sequentially during baking. The sampler scene must stay immutable.
let randomAccessPositionMm=0,randomAccessAngleDegrees=0;
for(const frameIndex of [405,135,270,0,405]){
  motion.updatePhase(frameIndex/count);model.updateMatrixWorld(true);
  for(let j=0;j<bones.length;j++){
    bones[j].matrixWorld.decompose(position,quaternion,scale);
    randomAccessPositionMm=Math.max(randomAccessPositionMm,position.distanceTo(new THREE.Vector3(...frames[frameIndex].local[j]))*1000);
    randomAccessAngleDegrees=Math.max(randomAccessAngleDegrees,quaternion.normalize().angleTo(new THREE.Quaternion(...frames[frameIndex].local[j].slice(3)))*180/Math.PI);
  }
}
assert.ok(randomAccessPositionMm<.001&&randomAccessAngleDegrees<.001,'Motion depends on the previous seek position');
let seamPositionMm = 0, seamAngleDeg = 0;
for (let j = 0; j < bones.length; j++) {
  seamPositionMm = Math.max(seamPositionMm, new THREE.Vector3(...frames[0].local[j]).distanceTo(new THREE.Vector3(...frames.at(-1).local[j])) * 1000);
  seamAngleDeg = Math.max(seamAngleDeg, new THREE.Quaternion(...frames[0].local[j].slice(3)).angleTo(new THREE.Quaternion(...frames.at(-1).local[j].slice(3))) * 180 / Math.PI);
}
assert.ok(seamPositionMm < 0.01 && seamAngleDeg < 0.01, `Candidate loop is not closed: ${seamPositionMm} mm, ${seamAngleDeg} degrees`);
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
  ['coach', 'flare-coach-v42-candidate.glb'],
  ['training', 'flare-training-v42-candidate.glb'],
]) {
  const sourcePath = path.join(sourceBatch, source);
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
const previousAvailable = ['coach','training'].every(kind => fs.existsSync(path.join(root, `output/flare-v42-r12-20261015/flare-${kind}-v42-candidate.glb`)));
const firstAvailable = ['coach','training'].every(kind => fs.existsSync(path.join(root, `output/flare-v42-20261015/flare-${kind}-v42-candidate.glb`)));
const clock = { duration, previousAvailable, firstAvailable, phases: frames.map(f => f.phase), baselineSequenceTimes: frames.map(f => f.baselineTime) };
fs.writeFileSync(path.join(output, 'comparison-clock.json'), JSON.stringify(clock));
fs.writeFileSync(path.join(output, 'recovery-samples.json'), JSON.stringify(recoverySamples));
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
recordDependency(fileURLToPath(new URL('./reference-motion.mjs', import.meta.url)));
const manifest = { version: motion.parameters.revision, branch: 'local R15 reference study on master', date: '2026-10-17',
  status: 'Authored motion candidate for visual review; not motion capture and not an App release.',
  duration, frames: frames.length, tracks: tracks.length, bones: names.length, parameters: motion.parameters,
  recoveryDesign: motion.describeRecovery?.(),
  baseVersion: 'motion-v42-r14', baseAssets: ['coach','training'].map(kind=>({kind,sha256:sha256(fs.readFileSync(path.join(sourceBatch,`flare-${kind}-v42-candidate.glb`)))})),
  implementationSha256: sha256(fs.readFileSync(new URL('./reference-motion.mjs', import.meta.url))),
  dependencies: [...dependencies.values()],
  seamPositionMm, seamAngleDeg, randomAccessPositionMm, randomAccessAngleDegrees, assets, license: 'Snow Rig / Blender Foundation CC BY 4.0; original attribution retained',
  geometry: 'Only animation replaced in copies of the two accepted bodies. Original meshes, weights, materials and source assets retained.',
};
fs.writeFileSync(path.join(output, 'bake-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.mkdirSync(path.join(output,'authoring'),{recursive:true});
for(const name of ['bake.mjs','reference-motion.mjs'])fs.copyFileSync(new URL('./'+name,import.meta.url),path.join(output,'authoring',name));
fs.writeFileSync(path.join(output,'VIEWER.txt'),'http://127.0.0.1:8877/r15-preview/\n');
console.log(JSON.stringify(manifest, null, 2));
