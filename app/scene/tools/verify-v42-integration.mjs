import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createBakedClock, createBakedMotion } from '../src/baked-motion.js';
import { characterFromLocation, characterAsset, applyCharacter } from '../src/characters.js';
import { phaseAt, phaseTicks, phaseAtV41, phaseTicksV41, phaseAtV38, phaseTicksV38 } from '../src/phase.js';
import { buildMmRest, createSurfaceSelection } from '../src/mapped-mesh.js';
import { createDetailView } from '../src/detail.js';
import { FlarePlayer, applyTrainingClothSink } from '../src/player.js';
import { createAdaptiveResolution } from '../src/adaptive-resolution.js';
import { createFlareFx } from '../src/fx.js';

// Real emitted rigs exercise the App boundary, rather than a second IK runtime.
globalThis.ProgressEvent ??= class { constructor(type, fields) { Object.assign(this, { type }, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.window = {}; window.parent = window;
globalThis.document = { createElement: () => ({ setAttribute() {}, append() {}, querySelector: () => ({}), remove() {} }) };
const read = file => JSON.parse(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'));
async function load(file) {
  let bytes = fs.readFileSync(new URL('../public/' + file.replace(/^\.\//, ''), import.meta.url));
  if (bytes[0] === 0x1f) bytes = gunzipSync(bytes);
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
}
const clock = createBakedClock(), timing = read('src/v42-clock.json'), phases = read('src/v42-phases.json');
assert.equal(clock.period, 9); assert.equal(clock.duration, 1.35);
assert.equal(timing.frameTimes.length, timing.sequenceTime.length);
for (let i = 1; i < timing.frameTimes.length; i++) {
  assert.ok(timing.frameTimes[i] > timing.frameTimes[i - 1]);
  assert.ok(timing.sequenceTime[i] > timing.sequenceTime[i - 1]);
}
let maxRoundtripError = 0;
for (let i = 0; i <= 1080; i++) {
  const t = i / 1080 * 9;
  maxRoundtripError = Math.max(maxRoundtripError, Math.abs(clock.toSequence(clock.toWall(t)) - t));
}
assert.ok(maxRoundtripError < 1e-10);
for (let i = 0; i < phases.frames.length; i++) {
  const frame = phases.frames[i], sampled = phaseAt(frame.sequenceTime);
  assert.equal(sampled.id, frame.phaseId); assert.equal(sampled.source, frame.phaseSource);
  assert.equal(sampled.support, frame.support);
  assert.deepEqual(sampled.items.map(item => [item.groupId, item.side]),
    [...frame.primary, ...frame.secondary].map(item => [item.id, item.side]));
}
for (const ticks of [phaseTicks, phaseTicksV41, phaseTicksV38])
  assert.deepEqual(ticks.map(tick => tick.phase), [9, 10, 11, 12, 13, 14, 15, 16]);
assert.deepEqual(phaseTicks.map(tick => phaseAt(tick.time).support), ['both', 'right', 'right', 'right', 'both', 'left', 'left', 'left']);
assert.deepEqual(phaseTicksV41.map(tick => phaseAtV41(tick.time).support), ['both', 'right', 'right', 'right', 'both', 'left', 'left', 'left']);
assert.deepEqual(phaseTicksV38.map(tick => phaseAtV38(tick.time).support), ['both', 'right', 'right', 'right', 'both', 'left', 'left', 'left']);
for (let i = 0; i < phaseTicks.length; i++) {
  const a = phaseTicks[i], b = phaseTicks[(i + 1) % phaseTicks.length];
  const boundary = (a.time + (i === phaseTicks.length - 1 ? clock.period : b.time)) / 2;
  assert.equal(phaseAt(boundary - 1e-7).source, a.phase, 'phase remains until the exact authored midpoint');
  assert.equal(phaseAt(boundary).source, b.phase, 'phase switches at the exact authored midpoint');
  assert.equal(phaseAt(boundary + 1e-7).source, b.phase);
}
for (const speed of [0.25, 0.5, 1, 1.5]) {
  let t = 0; const steps = 180, dt = (clock.duration / speed) / steps;
  for (let i = 0; i < steps - 1; i++) t = clock.advance(t, dt, speed);
  assert.ok(Math.abs(clock.toWall(t) - (steps - 1) / steps * clock.duration) < 1e-10, 'speed is applied exactly once');
  assert.ok(Math.min(clock.advance(t, dt, speed), 9 - clock.advance(t, dt, speed)) < 1e-8, 'one loop wraps');
  const range = [phaseTicks[1].time, phaseTicks[3].time], span = clock.toWall(range[1]) - clock.toWall(range[0]);
  const result = clock.advance(range[0], span * 1.25 / speed, speed, range);
  assert.ok(Math.abs(clock.toWall(result) - (clock.toWall(range[0]) + span * 0.25)) < 1e-10, 'subrange loops in clip time');
}

const rig = read('public/coach/coach-v41-rig.json'), rows = [];
for (const search of ['', '?body=training', '?character=shadow', '?character=chrome', '?character=street', '?character=robot', '?character=cyber']) {
  const character = characterFromLocation(search), asset = characterAsset(character);
  assert.ok(asset.includes('v42-r12'), 'every saved character selects v42/R12');
  const gltf = await load(asset), model = gltf.scene;
  applyCharacter(model, character); applyTrainingClothSink(model);
  const motion = createBakedMotion(gltf, rig), clip = gltf.animations.find(value => value.name === 'flare_v42_candidate_loop');
  assert.equal(clip.tracks.length, 44); assert.equal(motion.getMetrics().motionRevision, 'v42');
  assert.ok(Math.abs(clip.duration - clock.duration) < 1e-6);
  let poses = 0;
  for (let i = 0; i <= 180; i++) {
    motion.update(i / 180 * 9); const metrics = motion.getMetrics();
    assert.equal(metrics.skinning.bones, 22); assert.ok(Math.abs(metrics.wallTime - clock.toWall(metrics.time)) < 1e-10);
    assert.ok(Object.values(metrics.joints).flat().every(Number.isFinite)); poses++;
  }
  motion.update(0); const start = motion.getMetrics().joints; motion.update(9); const end = motion.getMetrics().joints;
  for (const key of Object.keys(start)) assert.ok(new THREE.Vector3(...start[key]).distanceTo(new THREE.Vector3(...end[key])) < 1e-5, 'loop closes: ' + key);
  motion.update(phaseTicks[2].time); const frozen = motion.getMetrics();
  const skinned = buildMmRest(motion, model), selection = createSurfaceSelection(skinned, model);
  assert.deepEqual(motion.getMetrics().joints, frozen.joints, 'bind-pose mapping restores the exact frame');
  const materials = skinned.map(mesh => mesh.material);
  const selected = phaseAt(frozen.time), group = selected.items.find(item => item.level === 'primary').groupId;
  selection.show(group, selected.items, true);
  assert.deepEqual(motion.getMetrics().joints, frozen.joints, 'selection preserves the exact frame');
  const player = Object.create(FlarePlayer.prototype);
  Object.assign(player, { coach: model, motion, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(32, 1, 0.02, 40),
    container: { clientWidth: 390, clientHeight: 844, append() {} },
    renderer: { domElement: { classList: { add() {}, remove() {} }, offsetWidth: 390, width: 390, height: 844 },
      shadowMap: { enabled: false }, info: { render: { calls: 0, triangles: 0 } }, setSize() {}, render() {} },
    adaptive: createAdaptiveResolution(), keyLight: { castShadow: false },
    perf: { renders: 0, colorPixels: 0, shadowPasses: 0, shadowPixels: 0, skippedShadows: 0,
      calls: 0, triangles: 0, intervals: [], renderTimes: [], lastRenderTick: -1, ticks: 0, resizes: 0 },
    controls: { target: new THREE.Vector3(0, 0.5, 0), enableDamping: false, update() {} }, callbacks: {},
    time: frozen.time, period: 9, speed: 1, playing: false, loopRange: null, running: false, autoFrame: true,
    viewInset: 0, viewInsetTarget: 0, baseFov: 32, framingMode: 'main' });
  player.camera.position.set(0, 2, 4); player.scene.add(model);
  const phaseMap = { scene: new THREE.Scene(), setDetail() {}, refreshEnvironment() {}, restorePhase() {},
    getFullBounds: () => new THREE.Box3(new THREE.Vector3(-0.5, 0, -0.3), new THREE.Vector3(0.5, 2, 0.3)) };
  const detail = createDetailView(player, phaseMap, null, () => selection.focusDirection());
  detail.open(group, selected); detail.setModel('muscles', selected); detail.setModel('motion', selected); detail.close();
  assert.equal(player.time, frozen.time); assert.deepEqual(motion.getMetrics().joints, frozen.joints, 'detail, swap and return preserve pose');
  selection.restore(); for (let i = 0; i < skinned.length; i++) assert.equal(skinned[i].material, materials[i], 'character material identity is restored');
  const savedPerformance = globalThis.performance, savedMatchMedia = globalThis.matchMedia;
  let now = 0, detailActive = false;
  globalThis.performance = { now: () => now }; globalThis.matchMedia = () => ({ matches: true });
  const fx = createFlareFx(player); let renders = 0;
  player.renderer.render = () => { renders++; };
  player.callbacks.onBeforeRender = () => fx.update(now, !detailActive);
  player.playing = true; player.running = true; player.last = 0;
  const frames = n => { for (let i = 0; i < n; i++) { now += 1000 / 60; player.tick(now); } };
  frames(180); assert.equal(fx.level, 1);
  const pausedTime = player.time, paused = motion.getMetrics().joints;
  player.playing = false; detailActive = true; player.framingMode = 'detail';
  player.glideTo(new THREE.Vector3(0, 1, 4), new THREE.Vector3(0, 0.5, 0));
  frames(90); assert.equal(fx.level, 0); assert.equal(player.time, pausedTime);
  assert.deepEqual(motion.getMetrics().joints, paused);
  const settled = renders; frames(90); assert.equal(renders, settled, 'reduced-motion detail finishes fading and becomes idle');
  fx.dispose(); globalThis.performance = savedPerformance;
  if (savedMatchMedia === undefined) delete globalThis.matchMedia; else globalThis.matchMedia = savedMatchMedia;
  detail.dispose(); selection.dispose(); motion.dispose();
  rows.push({ character: character.id, asset, poses, detailSameFrame: true, materialRestored: true, reducedMotionFxSettled: true });
}
for (const [revision, asset, clockFile] of [
  ['v41', 'coach/flare-coach-v41-animated.meshopt.glb.gz', 'src/v41-clock.json'],
  ['v38', 'coach/flare-coach-v38-animated.meshopt.glb.gz', 'src/v38-clock.json'],
]) {
  const gltf = await load(asset), oldRig = revision === 'v38' ? read('public/coach/coach-rig.json') : rig;
  const motion = createBakedMotion(gltf, oldRig); motion.update(2.375);
  assert.equal(motion.getMetrics().motionRevision, revision);
  assert.equal(motion.getMetrics().wallTime, createBakedClock(read(clockFile)).toWall(2.375)); motion.dispose();
}
console.log(JSON.stringify({ status: 'passed', scope: 'v42-r12-real-assets-app-clock-phases-seven-characters-detail-and-fx',
  period: clock.period, clipDuration: clock.duration, clockRoundtripMaxError: maxRoundtripError,
  phaseFrames: phases.frames.length, historicalClocksPreserved: ['v41', 'v38'], characters: rows,
  limitation: 'Node runtime regression; GPU output, native devices and long background timing require separate evidence.' }, null, 2));
