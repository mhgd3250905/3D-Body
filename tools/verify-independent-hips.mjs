import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createFlareSequence } from '../src/flare-sequence.js';
import { mirrorPose } from '../src/pose-mirror.js';
import { updateOfficialFrame } from '../src/official-poses.js';
import { createTransitionEdits, rebaseTransitionEdits, saveOfficialFrameEdits, TRANSITION_STORAGE_KEY } from '../src/transition-edits.js';

const root = fileURLToPath(new URL('../', import.meta.url)), output = path.join(root, 'output/playwright');
const frozenPath = path.join(output, 'independent-hips-before.json');
const frozenBytes = await fs.readFile(frozenPath, 'utf8'), frozen = JSON.parse(frozenBytes);
const sourceBytes = await fs.readFile(path.join(root, 'public/coach/flare-sequence.json'), 'utf8');
const personalBytes = await fs.readFile(path.join(root, '托马斯/16.json'), 'utf8');
const source = JSON.parse(sourceBytes), original = structuredClone(source);
const PERSONAL_KEY = 'flare-pose-library-v1', OFFICIAL_KEY = 'flare-demonstration-v1';
const hash = value => createHash('sha256').update(value).digest('hex');
const checks = [], errors = [], measurements = { legacyCPU: [], legacyUI: [], trajectorySamples: [] }, screenshots = [];
const tolerance = { legacyNumbers: 1e-10, quaternionRadians: 1e-7, shoulderMetres: 1e-6, supportMetres: 1e-7, boneLengthMetres: 1e-8, replayNumbers: 1e-7 };
const upperJoints = ['shoulderCenter', 'neck', 'head', ...['left', 'right'].flatMap(side => ['Shoulder', 'Elbow', 'Wrist', 'Palm'].map(suffix => side + suffix))];
let browser, activePage, failure;
await fs.mkdir(output, { recursive: true });
function difference(a, b) {
  if (typeof a === 'number' || typeof b === 'number') return typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) : Infinity;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Object.keys(a).length !== Object.keys(b).length) return Infinity;
    return Math.max(0, ...Object.keys(a).map(key => difference(a[key], b[key])));
  }
  return a === b ? 0 : Infinity;
}
const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));
const quaternion = value => new THREE.Quaternion().fromArray(value).normalize();
const angle = (a, b) => quaternion(a).angleTo(quaternion(b));
async function check(name, action) { await action();checks.push({ name, pass: true }); }
function assertRig(metrics) {
  for (const [name, length] of Object.entries(metrics.segmentLengths)) assert.ok(Math.abs(length - metrics.expectedLengths[name]) <= tolerance.boneLengthMetres, name + ': fixed bone length');
  assert.ok(metrics.minFootHeight >= .006 - 1e-7, 'Shoes crossed the floor');
  for (const point of Object.values(metrics.joints)) assert.ok(point.every(Number.isFinite), 'Non-finite actual joint');
}
function assertLocked(before, after) {
  for (const side of ['left', 'right']) if (before.supports[side]) {
    assert.equal(after.supports[side], true);
    for (const suffix of ['Wrist', 'Palm']) assert.ok(distance(before.joints[side + suffix], after.joints[side + suffix]) <= tolerance.supportMetres, side + suffix + ': locked contact moved');
  }
}
function compareLegacy(actual, expected) {
  const poseDifference = difference(actual.pose, expected.pose), jointDifference = difference(actual.metrics.joints, expected.metrics.joints);
  const lengthDifference = difference(actual.metrics.segmentLengths, expected.metrics.segmentLengths);
  const boneDifference = Math.max(0, ...Object.keys(expected.bones).map(name => angle(actual.bones[name], expected.bones[name])));
  assert.ok(poseDifference <= tolerance.legacyNumbers, 'Legacy capture changed at ' + expected.time);
  assert.ok(jointDifference <= tolerance.legacyNumbers, 'Legacy IK joints changed at ' + expected.time);
  assert.ok(lengthDifference <= tolerance.legacyNumbers);assert.ok(boneDifference <= tolerance.quaternionRadians, 'Legacy bones changed at ' + expected.time);
  assert.deepEqual(actual.metrics.supportHands, expected.metrics.supportHands);assert.deepEqual(actual.metrics.warnings, expected.metrics.warnings);
  assert.ok(!Object.hasOwn(actual.pose, 'pelvisQuaternion'), 'Legacy poses acquired an independent hip field');
  return { time: expected.time, poseDifference, jointDifference, lengthDifference, boneDifference };
}

globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
const glbBytes = await fs.readFile(path.join(root, 'public/coach/flare-coach.glb'));
const rigData = JSON.parse(await fs.readFile(path.join(root, 'public/coach/coach-rig.json'), 'utf8'));
const { scene: model } = await new GLTFLoader().parseAsync(glbBytes.buffer.slice(glbBytes.byteOffset, glbBytes.byteOffset + glbBytes.byteLength), '');
const motion = createCoachMotion({ model, rigData }), boneObjects = {};
model.traverse(object => { if (object.isBone) boneObjects[object.name] = object; });
const cpuFrame = () => ({ pose: motion.capturePose(), metrics: motion.getMetrics(), bones: Object.fromEntries(Object.entries(boneObjects).map(([name, bone]) => [name, bone.getWorldQuaternion(new THREE.Quaternion()).toArray()])) });

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base = process.env.HIPS_TEST_URL || 'http://127.0.0.1:8810/?inspect=1', origin = new URL(base).origin;
const inspect = page => page.evaluate(() => ({ pose: window.flareInspector.capturePose(), metrics: window.flareInspector.rigMetrics(),
  bones: window.flareInspector.boneRotations(), status: window.flareInspector.status(), transitions: window.flareInspector.transitions(),
  trajectory: window.flareInspector.trajectory(), formal: window.flareInspector.demonstration(), library: window.flareInspector.poseLibrary() }));
const stored = (page, key) => page.evaluate(key => localStorage.getItem(key), key);
const blur = page => page.evaluate(() => document.activeElement?.blur());
const nextFrames = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
async function ready(page) { await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, { timeout: 45000 }); }
async function pageFor() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  await context.addInitScript(({ origin, seed }) => {
    if (location.origin === origin && !localStorage.getItem('independent-hips-seeded')) {
      for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
      localStorage.setItem('independent-hips-seeded', '1');
    }
  }, { origin, seed: frozen.storageBefore });
  const page = await context.newPage();activePage = page;page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push({ type: 'pageerror', message: error.message }));
  page.on('console', message => { if (message.type() === 'error') errors.push({ type: 'console', message: message.text() }); });
  await page.goto(base);await ready(page);return page;
}
async function drawer(page, side, open = true) { const button = page.locator('#toggle-' + side);if (await button.getAttribute('aria-expanded') !== String(open)) await button.click(); }
async function mode(page, value) { await drawer(page, 'library');await page.locator(`button[data-mode="${value}"]`).click(); }
async function settleTrajectory(page) {
  await page.waitForFunction(() => { const state = window.flareInspector.trajectory();return !state.scheduled && (state.error || state.data || !state.preferences.enabled); });
  await nextFrames(page);const frame = await inspect(page);assert.equal(frame.trajectory.error, '');return frame;
}
async function seek(page, time) {
  await page.locator('#transition-global-scrub').evaluate((input, value) => { input.value = String(value);input.dispatchEvent(new Event('input', { bubbles: true })); }, time);
  await blur(page);return settleTrajectory(page);
}
async function numeric(page, prefix, kind, axis, delta) {
  const input = page.locator(`#${prefix}-${kind}-${axis}`);
  await input.fill(String(Number(await input.inputValue()) + delta));await input.press('Tab');await blur(page);await nextFrames(page);return inspect(page);
}
async function download(page, selector, name) {
  const pending = page.waitForEvent('download');await page.locator(selector).click();const item = await pending;
  const filename = path.join(output, name);await item.saveAs(filename);return filename;
}
function compareTrajectory(frame) {
  const time = frame.status.time, exact = frame.trajectory.data.frames.find(point => point.time === time);
  assert.ok(exact, 'Current authored time missing from sampled path');
  const error = Math.max(...['leftAnkle', 'rightAnkle', 'leftKnee', 'rightKnee', 'pelvis'].map(name => distance(exact.joints[name], frame.metrics.joints[name])));
  assert.ok(error <= tolerance.replayNumbers, 'Guide differs from actual edited hip IK');measurements.trajectorySamples.push({ time, error });
}

try {
  await check('Frozen old browser baseline exists and describes all nine originals plus four transitions', () => {
    assert.equal(frozen.pass, true);assert.equal(frozen.frames.length, 13);assert.equal(frozen.sourceSha256, hash(sourceBytes));assert.deepEqual(frozen.source, source);
  });
  await check('The actual Snow module reproduces the frozen 13 old poses and limb orientations without new fields', () => {
    motion.setSequence(source.steps, { period: source.period, legPath: 'arc', interpolation: 'smooth' });
    for (const expected of frozen.frames) { motion.update(expected.time);measurements.legacyCPU.push(compareLegacy(cpuFrame(), expected)); }
  });
  let editedPose;
  await check('Independent hip rotation moves real pelvis/leg bones while preserving every upper joint and bone', () => {
    motion.applyPose(source.steps[0].pose);const before = cpuFrame();
    const desired = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(12)).multiply(quaternion(before.pose.bodyQuaternion));
    motion.editHandle('pelvis', { quaternion: desired.toArray() });const after = cpuFrame();editedPose = after.pose;
    assert.ok(Object.hasOwn(editedPose, 'pelvisQuaternion'));assert.ok(angle(before.bones.pelvis, after.bones.pelvis) > .01);
    for (const name of upperJoints) assert.ok(distance(before.metrics.joints[name], after.metrics.joints[name]) <= tolerance.supportMetres, name + ': hip rotation moved upper body');
    for (const name of ['torso', 'neck', 'head', 'leftUpperArm', 'rightUpperArm', 'leftForearm', 'rightForearm', 'leftHand', 'rightHand']) assert.ok(angle(before.bones[name], after.bones[name]) <= tolerance.quaternionRadians, name + ': upper bone rotated');
    assertRig(after.metrics);assertLocked(before.metrics, after.metrics);
  });
  await check('Optional pelvisQuaternion interpolates with each old endpoint body frame, including K and skip spans', () => {
    const raw = structuredClone(editedPose);raw.pelvisQuaternion = raw.pelvisQuaternion.map(value => -3 * value);
    const steps = structuredClone(source.steps);steps[1].pose = raw;
    for (const interpolation of ['linear', 'smooth']) {
      const sequence = createFlareSequence(steps, { period: source.period, interpolation });
      assert.deepEqual(sequence.sample(0), source.steps[0].pose);assert.deepEqual(sequence.sample(1), raw);
      const fraction = interpolation === 'linear' ? .25 : .25 * .25 * (3 - 2 * .25);
      assert.ok(angle(sequence.sample(.25).pelvisQuaternion, quaternion(source.steps[0].pose.bodyQuaternion).slerp(quaternion(raw.pelvisQuaternion), fraction).toArray()) < 1e-7);
      const corrected = createFlareSequence(source.steps, { period: source.period, interpolation, corrections: [{ id: 'hip-K', segment: 1, at: .5, pose: raw }] });
      assert.deepEqual(corrected.sample(1.5), raw);assert.ok(corrected.sample(1.25).pelvisQuaternion.every(Number.isFinite));
      const skipped = createFlareSequence(steps, { period: source.period, interpolation, skippedSteps: [2] });assert.ok(skipped.sample(2).pelvisQuaternion.every(Number.isFinite));
    }
    assert.ok(!Object.hasOwn(createFlareSequence(source.steps).sample(.25), 'pelvisQuaternion'));
  });
  await check('Mirror and official/transition storage preserve the independent hip frame and raw saved values', () => {
    assert.deepEqual(mirrorPose(mirrorPose(editedPose)), editedPose);
    const mirrored = mirrorPose(editedPose), wanted = new THREE.Matrix4().makeScale(-1, 1, 1).multiply(new THREE.Matrix4().makeRotationFromQuaternion(quaternion(editedPose.pelvisQuaternion))).multiply(new THREE.Matrix4().makeScale(-1, 1, 1));
    const actual = new THREE.Matrix4().makeRotationFromQuaternion(quaternion(mirrored.pelvisQuaternion));assert.ok(difference(wanted.elements, actual.elements) < 1e-10);
    const values = new Map(Object.entries(frozen.storageBefore)), storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
    const document = createTransitionEdits(source);document.points = [{ id: 'stored-hip-K', segment: 1, at: .5, pose: structuredClone(editedPose) }];document.draft = { segment: 1, at: .5, pose: structuredClone(editedPose) };
    const next = updateOfficialFrame(source, 0, editedPose), rebased = rebaseTransitionEdits(document, source, next);
    const saved = saveOfficialFrameEdits(next, rebased, storage);
    assert.deepEqual(JSON.parse(values.get(OFFICIAL_KEY)), next);assert.deepEqual(next.steps[0].pose, next.steps[8].pose);
    assert.deepEqual(saved.points[0].pose.pelvisQuaternion, editedPose.pelvisQuaternion);assert.deepEqual(saved.draft.pose.pelvisQuaternion, editedPose.pelvisQuaternion);
    assert.equal(values.get(PERSONAL_KEY), frozen.storageBefore[PERSONAL_KEY]);assert.equal(values.get('flare-demonstration-backup-v1'), frozen.storageBefore[OFFICIAL_KEY]);
  });
  await check('Invalid independent hip quaternions are rejected by motion, sampling and mirror without partial updates', () => {
    const invalid = [null, [], [0, 0, 0, 0], [0, 0, 1], [0, NaN, 0, 1], [0, Infinity, 0, 1], ['0', 0, 0, 1]];
    for (const value of invalid) {
      const pose = structuredClone(editedPose);pose.pelvisQuaternion = value;const before = cpuFrame();
      assert.throws(() => motion.applyPose(pose));assert.deepEqual(cpuFrame(), before);
      assert.throws(() => createFlareSequence([{ pose: editedPose }, { pose }]));assert.throws(() => mirrorPose(pose));
    }
  });
  if (!process.argv.includes('--module-only')) {
    browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
    const page = await pageFor();
    await check('The rebuilt browser preserves all frozen legacy poses, actual joints, bones and seeded storage bytes', async () => {
      const beforeStorage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
      for (const expected of frozen.frames) {
        await page.evaluate(time => window.flareInspector.setTime(time), expected.time);const actual = await inspect(page);measurements.legacyUI.push(compareLegacy(actual, expected));
      }
      assert.deepEqual(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage))), beforeStorage);
      for (const key of [PERSONAL_KEY, OFFICIAL_KEY, TRANSITION_STORAGE_KEY]) assert.equal(await stored(page, key), frozen.storageBefore[key]);
    });
    await page.evaluate(() => window.flareInspector.setTime(0));await drawer(page, 'details');await page.locator('#edit-current-pose').click();await drawer(page, 'details');
    await page.locator('#pose-handle-select').selectOption('pelvis');
    await check('Numeric hip translation fixes the shoulder center and palm contacts instead of translating the entire upper body', async () => {
      const before = await inspect(page), after = await numeric(page, 'pose', 'pos', 1, 1);
      const achieved = distance(before.pose.pelvis, after.pose.pelvis), shoulder = distance(before.metrics.joints.shoulderCenter, after.metrics.joints.shoulderCenter);
      assert.ok(achieved > 1e-4, 'Hip translation did not move the pelvis');assert.ok(shoulder <= tolerance.shoulderMetres, 'Hip translation moved the shoulder center');
      assert.ok(angle(before.pose.bodyQuaternion, after.pose.bodyQuaternion) > 1e-5, 'Spine failed to adapt to independent translation');
      assertRig(after.metrics);assertLocked(before.metrics, after.metrics);measurements.numericTranslation = { achieved, shoulder };
      await page.locator('#pose-undo').click();assert.ok(difference((await inspect(page)).pose, before.pose) < tolerance.replayNumbers);
    });
    await check('Numeric hip rotation changes its frame while upper joints and original body rotation remain fixed', async () => {
      const before = await inspect(page), after = await numeric(page, 'pose', 'rot', 1, 12);
      assert.ok(angle(before.pose.bodyQuaternion, after.pose.bodyQuaternion) < tolerance.quaternionRadians);
      assert.ok(angle(before.pose.pelvisQuaternion ?? before.pose.bodyQuaternion, after.pose.pelvisQuaternion) > .01);
      const upperChange = Math.max(...upperJoints.map(name => distance(before.metrics.joints[name], after.metrics.joints[name])));
      assert.ok(upperChange <= tolerance.supportMetres);assertRig(after.metrics);assertLocked(before.metrics, after.metrics);
      measurements.numericRotation = { upperChange, hipRadians: angle(before.pose.pelvisQuaternion ?? before.pose.bodyQuaternion, after.pose.pelvisQuaternion) };
    });
    await check('A real pointer drag picks the hip Y axis, moves the actual hip with a fixed shoulder and camera, and undoes once', async () => {
      await page.locator('[data-pose-transform="translate"]').click();await page.locator('#pose-fit').click();await nextFrames(page);
      const canvas = await page.locator('#scene').boundingBox(), handle = await page.evaluate(() => window.flareInspector.projectHandle('pelvis'));
      let point;
      for (const offset of [18, 24, 30, 38, 46, 54]) {
        await page.mouse.move(canvas.x + handle.x, canvas.y + handle.y - offset);await page.waitForTimeout(30);
        if ((await inspect(page)).status.editor.axis === 'Y') { point = { x: canvas.x + handle.x, y: canvas.y + handle.y - offset };break; }
      }
      assert.ok(point, 'Visible hip Y-axis was not pickable');const before = await inspect(page);
      await page.mouse.down();assert.equal((await inspect(page)).status.editor.dragging, true);
      await page.mouse.move(point.x, point.y - 16, { steps: 6 });await page.mouse.up();await nextFrames(page);const after = await inspect(page);
      const achieved = distance(before.pose.pelvis, after.pose.pelvis), shoulder = distance(before.metrics.joints.shoulderCenter, after.metrics.joints.shoulderCenter);
      assert.ok(achieved > 1e-4);assert.ok(shoulder <= tolerance.shoulderMetres);assert.equal(after.status.editor.dragging, false);
      assert.ok(difference(before.status.camera, after.status.camera) < 1e-8);assertRig(after.metrics);assertLocked(before.metrics, after.metrics);
      measurements.pointerTranslation = { achieved, shoulder, cameraDifference: difference(before.status.camera, after.status.camera) };
      await page.locator('#pose-undo').click();assert.ok(difference((await inspect(page)).pose, before.pose) < tolerance.replayNumbers);
    });
    let savedPersonalPose;
    await check('Personal save/export/import and mirror round trips retain hip fields and all seventeen original steps', async () => {
      savedPersonalPose = (await inspect(page)).pose;const originalSteps = JSON.parse(frozen.storageBefore[PERSONAL_KEY]).steps;
      await page.locator('#pose-name').fill('独立髋部验证');await page.locator('#pose-save').click();
      let current = await inspect(page);assert.deepEqual(current.library.steps.slice(0, originalSteps.length), originalSteps);
      const savedStep = current.library.steps.at(-1);assert.ok(difference(savedStep.pose, savedPersonalPose) < 1e-10);
      const exported = JSON.parse(await fs.readFile(await download(page, '#pose-export', 'independent-hips-personal.json'), 'utf8'));
      assert.deepEqual(exported.steps.at(-1).pose.pelvisQuaternion, savedPersonalPose.pelvisQuaternion);
      const mirrored = mirrorPose(savedPersonalPose), total = current.library.steps.length;
      await page.locator('#pose-import-file').setInputFiles({ name: 'independent-hip-mirror.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'flare-pose-library', version: 1, steps: [{ id: 'imported-hip', name: '髋部导入', pose: savedPersonalPose }, { id: 'mirrored-hip', name: '髋部镜像', pose: mirrored }] })) });
      await page.waitForFunction(total => window.flareInspector.poseLibrary().steps.length === total + 2, total);
      current = await inspect(page);assert.ok(angle(current.library.steps.at(-1).pose.pelvisQuaternion, mirrored.pelvisQuaternion) < tolerance.quaternionRadians);
      await drawer(page, 'library');await page.locator('[data-pose-load]').last().click();await drawer(page, 'details');
      const loaded = await inspect(page);assert.ok(angle(loaded.pose.pelvisQuaternion, mirrored.pelvisQuaternion) < tolerance.quaternionRadians);assertRig(loaded.metrics);
      assert.deepEqual(loaded.library.steps.slice(0, originalSteps.length), originalSteps);
    });
    await check('A later invalid hip field prevents a partial personal import and preserves the current draft and storage', async () => {
      await page.waitForTimeout(350);const before = await inspect(page), raw = await stored(page, PERSONAL_KEY), bad = structuredClone(savedPersonalPose);bad.pelvisQuaternion = [0, 0, 0, 0];
      await page.locator('#pose-import-file').setInputFiles({ name: 'invalid-hips.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'flare-pose-library', version: 1, steps: [{ name: '合法先行', pose: savedPersonalPose }, { name: '非法髋部', pose: bad }] })) });
      await page.waitForTimeout(100);const after = await inspect(page);
      assert.equal(await stored(page, PERSONAL_KEY), raw);assert.deepEqual(after.library.steps, before.library.steps);assert.ok(difference(after.pose, before.pose) < tolerance.replayNumbers);
    });
    const personalAfterEditing = await stored(page, PERSONAL_KEY);
    await mode(page, 'transition');await drawer(page, 'details');
    const neighborsBefore = [await seek(page, 1.25), await seek(page, 1.75)];await seek(page, 1.5);await page.locator('#transition-handle').selectOption('pelvis');
    let savedK;
    await check('Independent hip K saves the pending real IK pose, and its guide matches actual key and neighboring samples', async () => {
      const before = await inspect(page);await numeric(page, 'transition', 'pos', 1, 1);await numeric(page, 'transition', 'rot', 1, 12);
      const pending = await settleTrajectory(page);assert.ok(distance(before.metrics.joints.shoulderCenter, pending.metrics.joints.shoulderCenter) <= tolerance.shoulderMetres);assertRig(pending.metrics);compareTrajectory(pending);
      await blur(page);await page.keyboard.press('k');savedK = await settleTrajectory(page);
      assert.equal(savedK.transitions.document.points.length, 1);assert.ok(difference(savedK.transitions.document.points[0].pose, pending.pose) < tolerance.replayNumbers);
      assert.ok(difference(savedK.pose, pending.pose) < tolerance.replayNumbers);compareTrajectory(savedK);
      for (const [index, time] of [1.25, 1.75].entries()) {
        const frame = await seek(page, time);compareTrajectory(frame);assertRig(frame.metrics);
        assert.ok(difference(frame.metrics.joints, neighborsBefore[index].metrics.joints) > 1e-5, 'Neighboring span failed to regenerate');
      }
      await seek(page, 1.5);assert.equal(await stored(page, OFFICIAL_KEY), frozen.storageBefore[OFFICIAL_KEY]);assert.equal(await stored(page, PERSONAL_KEY), personalAfterEditing);
    });
    await check('Reload restores the hip K and actual bones without changing formal or personal source data', async () => {
      await page.reload();await ready(page);await mode(page, 'transition');await drawer(page, 'details');const restored = await seek(page, 1.5);
      assert.ok(difference(restored.pose, savedK.pose) < tolerance.replayNumbers);assert.ok(difference(restored.metrics.joints, savedK.metrics.joints) < tolerance.replayNumbers);
      for (const name of Object.keys(savedK.bones)) assert.ok(angle(restored.bones[name], savedK.bones[name]) <= tolerance.quaternionRadians);
      compareTrajectory(restored);assert.equal(await stored(page, PERSONAL_KEY), personalAfterEditing);assert.equal(await stored(page, OFFICIAL_KEY), frozen.storageBefore[OFFICIAL_KEY]);
    });
    let backupPath, backup;
    await check('Animation backup includes hip fields, and deleting/undoing a K restores its pose and generated path', async () => {
      backupPath = await download(page, '#transition-export', 'independent-hips-animation.json');backup = JSON.parse(await fs.readFile(backupPath, 'utf8'));
      assert.deepEqual(backup.points[0].pose.pelvisQuaternion, savedK.transitions.document.points[0].pose.pelvisQuaternion);
      assert.deepEqual(backup.sequence.steps, source.steps);
      await drawer(page, 'library');await page.locator('[data-transition-remove]').first().click();await settleTrajectory(page);assert.equal((await inspect(page)).transitions.document.points.length, 0);
      await drawer(page, 'details');await page.locator('#transition-undo-document').click();const restored = await settleTrajectory(page);
      assert.equal(restored.transitions.document.points.length, 1);assert.ok(difference(restored.pose, savedK.pose) < tolerance.replayNumbers);compareTrajectory(restored);
    });
    const fresh = await pageFor();await mode(fresh, 'transition');await drawer(fresh, 'details');
    await check('Animation import into a fresh isolated context restores the independent K without touching personal bytes', async () => {
      await fresh.locator('#transition-import-file').setInputFiles(backupPath);
      await fresh.waitForFunction(() => window.flareInspector.transitions().document.points.length === 1);
      const restored = await seek(fresh, 1.5);assert.ok(difference(restored.pose, savedK.pose) < tolerance.replayNumbers);compareTrajectory(restored);
      assert.equal(await stored(fresh, PERSONAL_KEY), frozen.storageBefore[PERSONAL_KEY]);assert.equal(await stored(fresh, OFFICIAL_KEY), frozen.storageBefore[OFFICIAL_KEY]);
    });
    await check('Invalid animation hip field import leaves its existing K, pose and both saved libraries intact', async () => {
      const bad = structuredClone(backup);bad.points[0].pose.pelvisQuaternion = [0, 0, 0, 0];
      const before = await inspect(fresh), raw = await stored(fresh, TRANSITION_STORAGE_KEY);
      await fresh.locator('#transition-import-file').setInputFiles({ name: 'invalid-hip-animation.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(bad)) });
      await fresh.waitForTimeout(100);const after = await inspect(fresh);
      assert.equal(await stored(fresh, TRANSITION_STORAGE_KEY), raw);assert.deepEqual(after.transitions.document, before.transitions.document);assert.ok(difference(after.pose, before.pose) < tolerance.replayNumbers);
      assert.equal(await stored(fresh, PERSONAL_KEY), frozen.storageBefore[PERSONAL_KEY]);assert.equal(await stored(fresh, OFFICIAL_KEY), frozen.storageBefore[OFFICIAL_KEY]);
    });
    await check('New hip controls remain accessible on mobile and no browser exception occurred', async () => {
      await fresh.locator('#transition-handle').selectOption('pelvis');
      assert.ok((await fresh.locator('#transition-handle option:checked').innerText()).includes('髋部'));
      await fresh.waitForFunction(() => document.querySelector('#toast').hidden);await drawer(fresh, 'library');await drawer(fresh, 'details');
      const desktop = path.join(output, 'independent-hips-editor.png');await fresh.screenshot({ path: desktop });screenshots.push(desktop);
      await fresh.setViewportSize({ width: 390, height: 844 });await drawer(fresh, 'details');await nextFrames(fresh);
      assert.equal(await fresh.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);assert.equal(await fresh.locator('#transition-pos-0').isEnabled(), true);
      assert.deepEqual(errors, []);
    });
  }
  await check('Original source files and frozen pre-change evidence remain byte-identical', async () => {
    assert.deepEqual(source, original);assert.equal(await fs.readFile(path.join(root, 'public/coach/flare-sequence.json'), 'utf8'), sourceBytes);
    assert.equal(await fs.readFile(path.join(root, '托马斯/16.json'), 'utf8'), personalBytes);assert.equal(await fs.readFile(frozenPath, 'utf8'), frozenBytes);
  });
} catch (error) {
  failure = error.stack;checks.push({ name: error.message, pass: false });
  await activePage?.screenshot({ path: path.join(output, 'independent-hips-failure.png') }).catch(() => {});
} finally {
  await browser?.close();
  const engineHashes = {};
  for (const filename of ['src/coach-motion.js', 'src/flare-sequence.js', 'src/pose-mirror.js', 'src/pose-editor.js', 'src/pose-panel.js', 'src/transition-panel.js']) engineHashes[filename] = hash(await fs.readFile(path.join(root, filename)));
  const report = { pass: !failure && errors.length === 0, passed: checks.filter(item => item.pass).length, total: checks.length, checks, errors, failure, measurements, screenshots, tolerance,
    sourceSha256: hash(sourceBytes), personalSha256: hash(personalBytes), frozenBeforeSha256: hash(frozenBytes), engineHashes,
    scope: 'Frozen 13 actual pre-change Snow samples, optional hip frame interpolation/mirror/validation/storage, independent numeric and real-pointer hip controls with a fixed shoulder center, support contacts and limb lengths, K/guide/bones/reload/backup/undo/import, and isolated-browser personal data preservation. Large movement limits are checked by a separate actual-rig tool; this does not establish physical balance or eliminate mesh intersections.' };
  const filename = path.join(output, 'independent-hips-verification.json');await fs.writeFile(filename, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, errors, failure, numericTranslation: measurements.numericTranslation,
    numericRotation: measurements.numericRotation, pointerTranslation: measurements.pointerTranslation, trajectorySamples: measurements.trajectorySamples, report: filename }, null, 2));
  if (!report.pass) process.exitCode = 1;
}
