import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer, preview } from 'vite';
import * as THREE from 'three';
import { loadGlb, names } from '../app/scene/tools/bake-v41-node.mjs';
import { createCoachMotion } from '../src/coach-motion.js';
import { createV42Playback } from '../src/v42-playback.js';
import { BodyViewer } from '../src/viewer.js';
import { createBakedClock } from '../app/scene/src/baked-motion.js';
import { OFFICIAL_FLARE_SEQUENCE } from '../src/official-poses.js';
import { V42_DEFAULT_SEQUENCE, V42_SELECTION_HISTORY_KEY, resolveV42Sequence, saveV42DefaultSequence, createV42Clock, isV42Sequence } from '../src/v42-default.js';
import { createTransitionEdits, compatibleTransitionEdits } from '../src/transition-edits.js';

const root = fileURLToPath(new URL('../', import.meta.url)), out = path.join(root, 'output/web-v42-integration');
await fs.mkdir(out, { recursive: true });
const checks = [];
function check(name, pass, detail) { checks.push({ name, pass: Boolean(pass), detail });console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`);assert.ok(pass, name); }
class Storage {
  constructor(values = {}) { this.values = new Map(Object.entries(values)); }
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}
const formal = 'flare-demonstration-v1', undo = 'flare-demonstration-backup-v1';
const clockDoc = JSON.parse(await fs.readFile(path.join(root, 'public/coach/flare-v42-clock.json'), 'utf8'));
const clock = createV42Clock(clockDoc);
let maxError = 0;
for (let i = 0; i <= 1000; i++) { const t = 9 * i / 1000;maxError = Math.max(maxError, Math.abs(clock.toSequence(clock.toClip(t)) - t)); }
check('Shared clock round trips the entire 0–9 timeline', maxError < 1e-10, maxError);
check('Half-speed accepted clip completes in 2.7 wall seconds', Math.abs(clock.advance(0, 2.7 * .5)) < 1e-9);
const appClock = createBakedClock();
const subrange = { startTime: 1, endTime: 3 };
const preciseLoop = clock.advance(2.9, .04, subrange);
check('Nonlinear subrange crossing preserves clip-time remainder exactly', Math.abs(preciseLoop - 1.1581316100) < 1e-9 && Math.abs(preciseLoop - appClock.advance(2.9, .04, 1, [1, 3])) < 1e-12, preciseLoop);
let loopError = 0;
for (const [startTime, endTime] of [[0, 9], [1, 3], [3, 5], [7, 9]]) {
  const range = { startTime, endTime }, clipSpan = clock.toClip(endTime) - clock.toClip(startTime);
  for (const t of [startTime, startTime + (endTime - startTime) * .95, endTime]) for (const speed of [.25, .5, 1, 1.5]) {
    for (const delta of [.04, clipSpan * 3.25 / speed]) {
      const web = clock.advance(t, delta * speed, range), app = appClock.advance(t, delta, speed, [startTime, endTime]);
      loopError = Math.max(loopError, Math.abs(web - app));
    }
  }
}
check('Subrange and full-circle clock crossings match App at four speeds including multiple wraps', loopError < 1e-12, loopError);
const empty = new Storage();
check('Fresh default is v42 without changing storage', resolveV42Sequence(empty).source.playback === 'flare-v42-r12' && empty.length === 0);
const custom = structuredClone(OFFICIAL_FLARE_SEQUENCE);custom.source.origin = 'browser-saved-steps';
const selected = '\n' + JSON.stringify(custom, null, 2) + '\n';
const user = new Storage({ [formal]: selected, [undo]: 'old undo bytes', 'flare-pose-library-v1': 'personal bytes', 'flare-transition-library-v1': 'K/routes/draft bytes' });
check('Existing personal selection is kept byte-for-byte', resolveV42Sequence(user).source.origin === custom.source.origin && user.getItem(formal) === selected);
saveV42DefaultSequence(user);
const history = JSON.parse(user.getItem(V42_SELECTION_HISTORY_KEY));
check('Adoption keeps exact independent snapshot and undo', history.entries[0].storage[formal] === selected && user.getItem(undo) === selected && user.getItem('flare-transition-library-v1') === 'K/routes/draft bytes');
const rejected = new Storage({ [formal]: selected });
rejected.setItem = function (key, value) { if (key !== V42_SELECTION_HISTORY_KEY) this.values.set(key, String(value)); };
assert.throws(() => saveV42DefaultSequence(rejected));
check('Rejected independent backup cannot replace formal animation', rejected.getItem(formal) === selected);
check('v41 K library is isolated from R12 playback selection', !compatibleTransitionEdits(createTransitionEdits(OFFICIAL_FLARE_SEQUENCE), V42_DEFAULT_SEQUENCE));
check('New K/route edits leave baked playback instead of being ignored', !isV42Sequence({ ...V42_DEFAULT_SEQUENCE, corrections: [{ segment: 0 }] }) && !isV42Sequence({ ...V42_DEFAULT_SEQUENCE, footCurves: [{}] }) && !isV42Sequence({ ...V42_DEFAULT_SEQUENCE, interpolation: 'linear' }));
const rigData = JSON.parse(await fs.readFile(path.join(root, 'public/coach/coach-rig.json'), 'utf8'));
const [editable, accepted, appGltf] = await Promise.all([
  loadGlb('../../public/coach/flare-coach.glb'), loadGlb('../../public/coach/flare-coach-v42-r12-animated.glb'),
  loadGlb('../../app/assets/scene/coach/flare-coach-v42-r12-animated.meshopt.glb.gz'),
]);
const baseMotion = createCoachMotion({ model: editable.scene, rigData });
const playback = createV42Playback({ base: baseMotion, gltf: accepted, clockDocument: clockDoc, scene: new THREE.Scene(), rigData });
playback.setDisplaySequence(V42_DEFAULT_SEQUENCE);playback.setDisplayMode('motion');
function animationTick(motion, range, time, delta, speed, legacyStep) {
  const nextFrame = globalThis.requestAnimationFrame;
  const viewer = { motion, playbackRange: range, time, speed, previous: 0, playing: true, mode: 'motion', callbacks: {},
    controls: { update: () => false }, renderer: { render() {} }, animate() {},
    paceStep: legacyStep ?? (() => { throw new Error('R12 must bypass sequence-domain pacing and wrapping'); }),
  };
  try { globalThis.requestAnimationFrame = () => 0;BodyViewer.prototype.animate.call(viewer, delta * 1000);return viewer.time; }
  finally { globalThis.requestAnimationFrame = nextFrame; }
}
const actualRangeTick = animationTick(playback, subrange, 2.9, .04, 1);
check('Real viewer animation tick uses clip-domain subrange wrapping', Math.abs(actualRangeTick - preciseLoop) < 1e-12, actualRangeTick);
const actualWholeTick = animationTick(playback, null, 8.99, .04, 1);
check('Real viewer animation tick crosses the whole-circle seam using shared clock', Math.abs(actualWholeTick - appClock.advance(8.99, .04, 1)) < 1e-12, actualWholeTick);
for (const model of ['v41', 'periodic']) {
  const legacy = { advanceDisplayTime: () => null, update() {}, getMetrics: () => ({ period: 9, motionModel: model }) };
  const oldRange = animationTick(legacy, subrange, 2.99, .04, 1, () => .04);
  const oldFull = animationTick(legacy, null, 8.99, .04, 1, () => .04);
  check(`${model} retains previous sequence-domain range and whole-circle playback`, Math.abs(oldRange - 1.03) < 1e-12 && Math.abs(oldFull - .03) < 1e-12);
}
const appMixer = new THREE.AnimationMixer(appGltf.scene), appAction = appMixer.clipAction(appGltf.animations[0]);
appAction.setLoop(THREE.LoopOnce, 1);appAction.clampWhenFinished = true;appAction.play();
let boneError = 0;
for (let i = 0; i <= 180; i++) {
  const time = 9 * i / 180;playback.update(time);appAction.enabled = true;appAction.paused = false;appMixer.setTime(clock.toClip(time));appGltf.scene.updateMatrixWorld(true);
  for (const name of names) {
    const a = playback.group.getObjectByName(name).matrixWorld.elements, b = appGltf.scene.getObjectByName(name).matrixWorld.elements;
    boneError = Math.max(boneError, ...a.map((value, k) => Math.abs(value - b[k])));
  }
}
check('Web adapter matches packaged App GLB at 181 identical timeline times / 22 bones', boneError < 1e-6, boneError);
const savedTime = playback.getMetrics().time;
playback.sampleTrajectory({ startTime: 0, endTime: 9, samples: 64 });
check('R12 trajectory sampling preserves the paused frame', playback.getMetrics().time === savedTime);
playback.applyPose(baseMotion.capturePose());
check('Auxiliary pose preview shows original rig instead of leaving R12 over it', !accepted.scene.visible && editable.scene.visible && !playback.isV42Playback());
playback.update(savedTime);
check('Returning from auxiliary preview restores R12', accepted.scene.visible && !editable.scene.visible && playback.isV42Playback());
playback.setDisplaySequence(OFFICIAL_FLARE_SEQUENCE);
check('Choosing v41 immediately hides R12 and shows original rig', !accepted.scene.visible && editable.scene.visible);
playback.setDisplaySequence(V42_DEFAULT_SEQUENCE);playback.setDisplayMode('pose');
check('Original editor rig stays available independently', playback.group === editable.scene && playback.getEditableHandles().length > 0 && !accepted.scene.visible);
if (process.argv.includes('--node-only')) {
  await fs.writeFile(path.join(out, 'verification-node.json'), JSON.stringify({ checks, errors: [], failure: null }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, evidence: path.join(out, 'verification-node.json') }));
  process.exit(0);
}

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const dist = process.argv.includes('--dist');
const server = dist
  ? await preview({ root, configFile: false, logLevel: 'error', preview: { host: '127.0.0.1', port: 8886, strictPort: true }, build: { outDir: 'dist' } })
  : await createServer({ root, configFile: false, cacheDir: 'output/web-v42-integration/.vite', logLevel: 'error', optimizeDeps: { entries: ['index.html', 'muscle-viewer.html'] }, server: { host: '127.0.0.1', port: 8886, strictPort: true, hmr: false } });
if (!dist) await server.listen();
let browser, failure;
const errors = [];
try {
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  async function page(seed) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1020 } });
    if (seed) await context.addInitScript(({ key, value }) => { if (location.origin === 'http://127.0.0.1:8886' && localStorage.getItem(key) === null) localStorage.setItem(key, value); }, { key: formal, value: seed });
    const p = await context.newPage();p.on('pageerror', e => { errors.push(e.message);console.log('PAGEERROR', e.message); });
    await p.route('**/*', route => { const url = route.request().url();return url.startsWith('http') && new URL(url).origin !== 'http://127.0.0.1:8886' ? route.abort() : route.continue(); });
    await p.goto('http://127.0.0.1:8886/?inspect=1', { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => window.flareInspector?.status().ready, undefined, { timeout: 60000 });
    return p;
  }
  const p = await page();
  check('Fresh browser displays R12 baked clip', await p.evaluate(() => window.flareInspector.status().motion.version === 'flare-v42-r12'));
  const browserTicks = await p.evaluate(() => {
    const v = window.flareInspector.viewer, saved = { time: v.time, speed: v.speed, range: v.playbackRange, playing: v.playing, previous: v.previous };
    const schedule = window.requestAnimationFrame, results = [];
    try {
      window.requestAnimationFrame = () => 0;
      for (const [time, range] of [[2.9, { startTime: 1, endTime: 3 }], [8.99, null]]) {
        v.time = time;v.playbackRange = range;v.speed = 1;v.playing = true;v.previous = 0;v.animate(40);
        results.push({ time: v.time, clipTime: v.motion.getMetrics().clipTime });
      }
      return results;
    } finally {
      window.requestAnimationFrame = schedule;v.playing = saved.playing;v.speed = saved.speed;v.playbackRange = saved.range;v.previous = saved.previous;v.setTime(saved.time);
    }
  });
  check('Built browser R12 tick preserves precise subrange overshoot', Math.abs(browserTicks[0].time - preciseLoop) < 1e-12 && Math.abs(browserTicks[0].clipTime - clock.toClip(preciseLoop)) < 1e-12, browserTicks[0]);
  check('Built browser R12 tick preserves whole-circle overshoot', Math.abs(browserTicks[1].time - appClock.advance(8.99, .04, 1)) < 1e-12, browserTicks[1]);
  const poseSamples = [];
  for (const time of [0, 1.8, 3.5, 4.5, 6.8, 8.6, 9]) {
    const result = await p.evaluate(t => {
      window.flareInspector.setTime(t);const s = window.flareInspector.status();
      return { time: s.time, clipTime: s.motion.clipTime, visible: s.coachVisible, projection: window.flareInspector.projectCoach(), phase: s.motion.demonstration };
    }, time);
    poseSamples.push(result);
    check(`Time ${time} uses shared exact clock`, Math.abs(result.clipTime - clock.toClip(time)) < 1e-8, result.clipTime);
    check(`Time ${time} fits viewport`, result.visible && result.projection.min.every(v => v >= -1.01) && result.projection.max.every(v => v <= 1.01), result.projection);
  }
  await p.evaluate(() => window.flareInspector.setTime(2.4));
  const beforeReturn = await p.evaluate(() => ({ time: window.flareInspector.status().time, bone: window.flareInspector.viewer.motion.group.getObjectByName('rightForearm').matrixWorld.elements.slice() }));
  await p.evaluate(() => { window.flareInspector.viewer.setMode('anatomy');window.flareInspector.viewer.setMode('motion'); });
  check('Anatomy return preserves exact R12 frame', await p.evaluate(before => {
    const v = window.flareInspector.viewer;return v.time === before.time && v.motion.group.getObjectByName('rightForearm').matrixWorld.elements.every((x, i) => Math.abs(x - before.bone[i]) < 1e-10);
  }, beforeReturn));
  await p.screenshot({ path: path.join(out, 'desktop.png') });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.locator('[data-close-drawer="library"]').evaluate(button => button.click());
  await p.locator('[data-close-drawer="details"]').evaluate(button => button.click());
  await p.waitForTimeout(350);
  check('390px layout has no page overflow', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const phoneProjection = await p.evaluate(() => window.flareInspector.projectCoach());
  check('390px R12 body fits viewport', phoneProjection.min.every(v => v >= -1.01) && phoneProjection.max.every(v => v <= 1.01), phoneProjection);
  await p.screenshot({ path: path.join(out, 'mobile.png') });
  const old = await page(selected);
  check('Existing formal animation does not auto-upgrade', await old.evaluate(key => localStorage.getItem(key), formal) === selected && await old.evaluate(() => window.flareInspector.status().motion.version !== 'flare-v42-r12'));
  await old.locator('#use-v42-default').evaluate(button => button.click());
  check('Explicit adoption selects baked R12 and stores independent backup', await old.evaluate(({ formal, history }) => JSON.parse(localStorage.getItem(formal)).source.playback === 'flare-v42-r12' && JSON.parse(localStorage.getItem(history)).entries.length === 1 && window.flareInspector.status().motion.version === 'flare-v42-r12', { formal, history: V42_SELECTION_HISTORY_KEY }));
  await old.locator('#edit-current-pose').evaluate(button => button.click());
  check('Original pose editor remains available', await old.evaluate(() => window.flareInspector.viewer.poseEditor.getState().enabled && window.flareInspector.viewer.motion.getEditableHandles().length > 0));
  await old.locator('#pose-undo-demonstration').evaluate(button => button.click());
  check('Undo restores previous personal formal sequence', await old.evaluate(expected => JSON.stringify(window.flareInspector.demonstration()) === JSON.stringify(expected), custom));
  await old.locator('[data-mode="motion"]').evaluateAll(buttons => buttons[0].click());
  check('Restored personal sequence uses original runtime', await old.evaluate(() => window.flareInspector.status().motion.version !== 'flare-v42-r12'));
  check('No browser runtime errors', errors.length === 0, errors);
  await fs.writeFile(path.join(out, 'samples.json'), JSON.stringify(poseSamples, null, 2));
} catch (error) { failure = error; }
finally { await browser?.close();if (dist) await new Promise(resolve => server.httpServer.close(resolve));else await server.close();await fs.writeFile(path.join(out, 'verification.json'), JSON.stringify({ checks, errors, failure: failure?.stack ?? null }, null, 2)); }
if (failure) throw failure;
console.log(JSON.stringify({ passed: checks.length, evidence: path.join(out, 'verification.json') }));
