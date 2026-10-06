import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { TRANSITION_STORAGE_KEY, createTransitionEdits } from '../src/transition-edits.js';
import { createFlareSequence } from '../src/flare-sequence.js';
import { OFFICIAL_LOOP_UPGRADE_MARKER_KEY } from '../src/official-poses.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/playwright');
const sourcePath = path.join(root, 'public/coach/flare-sequence.json');
const sourceBytes = await fs.readFile(sourcePath, 'utf8'), source = JSON.parse(sourceBytes);
const exported = JSON.parse(await fs.readFile(path.join(root, '托马斯/16.json'), 'utf8'));
const personal = { ...structuredClone(exported), draft: structuredClone(exported.steps[11].pose), title: 'Preserve the original seventeen steps', removed: [], extra: { preserve: true } };
const PERSONAL_KEY = 'flare-pose-library-v1', OFFICIAL_KEY = 'flare-demonstration-v1';
const personalRaw = '\n  ' + JSON.stringify(personal, null, 3) + '\n';
const officialRaw = '\n ' + JSON.stringify(source, null, 2) + '\n';
const base = process.env.TRANSITION_TEST_URL || 'http://127.0.0.1:8810/?inspect=1';
const origin = new URL(base).origin;
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const checks = [], errors = [], screenshots = [];
let browser, activePage, failure;
const checkpointPath = path.join(output, 'transition-ui-checkpoint.json');
await fs.mkdir(output, { recursive: true });
function check(name, condition, detail) {
  checks.push({ name, pass: Boolean(condition), ...(detail === undefined ? {} : { detail }) });
  assert.ok(condition, name);
}
function difference(a, b) {
  let maximum = 0;
  function visit(x, y) {
    if (typeof x === 'number' || typeof y === 'number') maximum = Math.max(maximum, typeof x === 'number' && typeof y === 'number' && Number.isFinite(x) && Number.isFinite(y) ? Math.abs(x - y) : Infinity);
    else if (x && y && typeof x === 'object' && typeof y === 'object') {
      if (Object.keys(x).length !== Object.keys(y).length) maximum = Infinity;
      for (const key of Object.keys(x)) visit(x[key], y[key]);
    } else if (x !== y) maximum = Infinity;
  }
  visit(a, b);return maximum;
}
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const inspect = page => page.evaluate(() => ({ transitions: window.flareInspector.transitions(), pose: window.flareInspector.capturePose(), status: window.flareInspector.status(), formal: window.flareInspector.demonstration(), boneRotations: window.flareInspector.boneRotations?.() }));
const stored = (page, key) => page.evaluate(key => localStorage.getItem(key), key);
async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true' && typeof window.flareInspector?.transitions === 'function', null, { timeout: 45000 });
}
async function pageFor(transitionRaw, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport, acceptDownloads: true });
  const seed = { [PERSONAL_KEY]: personalRaw, [OFFICIAL_KEY]: officialRaw, [OFFICIAL_LOOP_UPGRADE_MARKER_KEY]: source.source.revision };
  if (transitionRaw) seed[TRANSITION_STORAGE_KEY] = transitionRaw;
  await context.addInitScript(({ origin, seed }) => {
    if (location.origin === origin && !localStorage.getItem('transition-ui-seeded')) {
      for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
      localStorage.setItem('transition-ui-seeded', '1');
    }
  }, { origin, seed });
  const page = await context.newPage();activePage = page;page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push({ type: 'pageerror', message: error.message }));
  page.on('console', message => { if (message.type() === 'error') errors.push({ type: 'console', message: message.text(), location: message.location() }); });
  await page.goto(base);await ready(page);return page;
}
async function preserved(page, label) {
  check(label + ': original personal bytes and formal bytes remain unchanged', await stored(page, PERSONAL_KEY) === personalRaw && await stored(page, OFFICIAL_KEY) === officialRaw);
  check(label + ': original nine formal anchors remain unchanged', equal((await inspect(page)).formal, source));
  assert.equal(errors.length, 0, JSON.stringify(errors));
}
async function drawer(page, side, open) {
  const button = page.locator('#toggle-' + side);
  if (await button.getAttribute('aria-expanded') !== String(open)) await button.click();
}
async function mode(page, value) {
  await drawer(page, 'library', true);await page.locator(`button[data-mode="${value}"]`).click();
}
async function reveal(page, selector) {
  await drawer(page, 'details', true);
  const field = page.locator(selector);
  if (!await field.isVisible()) await field.locator('xpath=ancestor::details[1]').locator('summary').click();
  return field;
}
const blur = page => page.evaluate(() => document.activeElement?.blur());
async function seek(page, time) {
  await page.locator('#transition-global-scrub').evaluate((input, value) => { input.value = String(value);input.dispatchEvent(new Event('input', { bubbles: true })); }, time);
  await blur(page);
}
async function adjustPelvis(page, centimetres) {
  await drawer(page, 'details', true);
  await page.locator('#transition-handle').selectOption('pelvis');
  const input = page.locator('#transition-pos-0');
  await input.fill(String(Number(await input.inputValue()) + centimetres));await input.press('Tab');await blur(page);
}
async function screenshot(page, name) {
  await page.waitForFunction(() => document.querySelector('#toast').hidden);
  const filename = path.join(output, name);await page.screenshot({ path: filename });screenshots.push(filename);
}
async function download(page, selector, name) {
  const pending = page.waitForEvent('download');await page.locator(selector).click();
  const item = await pending, destination = path.join(output, name);await item.saveAs(destination);return destination;
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  if (process.argv.includes('--fixed-frames')) {
    const baseline = createFlareSequence(source.steps, { period: source.period });
    const edits = createTransitionEdits(source);edits.interpolation = 'linear';
    edits.points = [1.45, 2.6].map((time, index) => ({ id: `fixed-neighbor-${index}`, segment: Math.floor(time), at: time % 1, name: '保留已有中间帧', pose: baseline.sample(time) }));
    const page = await pageFor(JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [edits] }));
    await mode(page, 'transition');await drawer(page, 'details', true);
    const at = async time => { await seek(page, time);return inspect(page); };
    await seek(page, 0);
    for (let index = 0; index < 60; index++) await page.keyboard.press('ArrowRight');
    check('Sixty frame steps land on the existing original node rather than a near-zero blue K', (await inspect(page)).transitions.state.fixedIndex === 1 && (await inspect(page)).transitions.state.at === 0);
    const before = [];
    for (const time of [1.2, 1.8, 2.2, 2.8]) before.push(await at(time));
    await page.locator('[data-transition-fixed="2"]').click();
    check('A white marker opens the existing original pose for editing', (await inspect(page)).transitions.state.fixedIndex === 2 && await page.locator('#transition-pos-0').isEnabled() && await page.locator('#transition-keyframe-button').textContent() === '更新原关键帧 · K');
    await blur(page);await page.keyboard.press('k');
    check('K without an adjustment does not rewrite an original frame', await stored(page, OFFICIAL_KEY) === officialRaw);
    await adjustPelvis(page, 2);const changed = await inspect(page);await page.keyboard.press('k');
    let frame = await inspect(page);const savedFormal = structuredClone(frame.formal);
    check('Saving updates the existing node and preserves the displayed edited pose', difference(frame.formal.steps[2].pose, changed.pose) < 1e-7 && difference(frame.pose, changed.pose) < 1e-6);
    check('A fixed-frame update keeps the same nine IDs, times and other original poses', frame.formal.steps.length === 9 && frame.formal.period === source.period && equal(frame.formal.steps.map(step => step.id), source.steps.map(step => step.id)) && frame.formal.steps.every((step, index) => index === 2 || equal(step, source.steps[index])));
    check('Existing intermediate keyframes and interpolation settings survive an original update', equal(frame.transitions.document.points, edits.points) && frame.transitions.document.interpolation === 'linear');
    const after = [];
    for (const time of [1.2, 1.8, 2.2, 2.8]) after.push(await at(time));
    check('Both neighboring spans regenerate while preceding and following K frames bound the change', difference(after[1].status.motion.joints, before[1].status.motion.joints) > 1e-4 && difference(after[2].status.motion.joints, before[2].status.motion.joints) > 1e-4 && difference(after[0].pose, before[0].pose) < 1e-7 && difference(after[3].pose, before[3].pose) < 1e-7);
    check('Saving original frames does not create or overwrite personal steps or drafts', await stored(page, PERSONAL_KEY) === personalRaw && (await inspect(page)).formal.source.origin === 'browser-keyframe-edit');
    await page.reload();await ready(page);await mode(page, 'transition');await seek(page, 2);await drawer(page, 'details', true);
    check('Reload restores the updated original frame with its intermediate K frames', equal((await inspect(page)).formal, savedFormal) && equal((await inspect(page)).transitions.document.points, edits.points));
    await page.locator('#transition-undo-document').click();
    check('An original update can be undone after reload without losing K frames', equal((await inspect(page)).formal.steps, source.steps) && equal((await inspect(page)).transitions.document.points, edits.points));
    await page.locator('[data-transition-fixed="0"]').click();await adjustPelvis(page, 1);await page.keyboard.press('k');frame = await inspect(page);
    check('Editing the first 09 updates both closure poses and keeps their separate metadata', equal(frame.formal.steps[0].pose, frame.formal.steps[8].pose) && difference(frame.formal.steps[0].pose, source.steps[0].pose) > 1e-4 && frame.formal.steps[8].id === source.steps[8].id && frame.formal.steps[8].name === source.steps[8].name);
    await page.locator('[data-transition-fixed="8"]').click();await adjustPelvis(page, 1);await page.keyboard.press('k');
    const exportedFrame = await inspect(page);
    check('Editing the final 09 also updates the first 09 without adding a frame', equal(exportedFrame.formal.steps[0].pose, exportedFrame.formal.steps[8].pose) && exportedFrame.formal.steps.length === 9);
    const backupPath = await download(page, '#transition-export', 'fixed-frame-animation-backup.json');
    const backup = JSON.parse(await fs.readFile(backupPath, 'utf8'));
    check('One animation backup contains updated original poses, K frames and settings', equal(backup.sequence, exportedFrame.formal) && equal(backup.points, edits.points) && backup.interpolation === 'linear');
    await page.locator('#transition-undo-document').click();await page.locator('#transition-undo-document').click();
    check('Undo restores both original closure poses with all K frames', equal((await inspect(page)).formal.steps, source.steps) && equal((await inspect(page)).transitions.document.points, edits.points));
    await page.locator('#transition-import-file').setInputFiles(backupPath);
    await page.waitForFunction(expected => JSON.stringify(window.flareInspector.demonstration()) === expected, JSON.stringify(backup.sequence));
    check('Import restores updated originals together with their generated spans', equal((await inspect(page)).formal, backup.sequence) && equal((await inspect(page)).transitions.document.points, edits.points));
    await page.locator('#transition-undo-document').click();
    check('Undoing a complete animation import restores the prior originals and K frames', equal((await inspect(page)).formal.steps, source.steps) && equal((await inspect(page)).transitions.document.points, edits.points));
    const rawBeforeInvalid = { official: await stored(page, OFFICIAL_KEY), transitions: await stored(page, TRANSITION_STORAGE_KEY) };
    const invalidBackup = structuredClone(backup);invalidBackup.sequence.steps[1].id = 'another-animation';
    await page.locator('#transition-import-file').setInputFiles({ name: 'wrong-layout.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalidBackup)) });
    await page.waitForFunction(() => document.querySelector('#toast').textContent.includes('另一组') || document.querySelector('#toast').textContent.includes('顺序'));
    check('An unrelated animation backup leaves both original and transition storage untouched', await stored(page, OFFICIAL_KEY) === rawBeforeInvalid.official && await stored(page, TRANSITION_STORAGE_KEY) === rawBeforeInvalid.transitions);
    await seek(page, 2);await adjustPelvis(page, 3);const beforeFailure = await inspect(page), transitionBeforeFailure = await stored(page, TRANSITION_STORAGE_KEY);
    await page.evaluate(() => { window.originalStorageSetItem = Storage.prototype.setItem;Storage.prototype.setItem = function(key, value) { if (key === 'flare-demonstration-v1') throw new DOMException('Test quota failure', 'QuotaExceededError');return window.originalStorageSetItem.call(this, key, value); }; });
    await page.keyboard.press('k');
    const afterFailure = await inspect(page);
    check('A failed original save keeps the prior sequence and edited pose available', equal(afterFailure.formal, beforeFailure.formal) && difference(afterFailure.pose, beforeFailure.pose) < 1e-7 && afterFailure.transitions.state.dirty && await stored(page, TRANSITION_STORAGE_KEY) === transitionBeforeFailure);
    await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem;delete window.originalStorageSetItem; });
    await page.keyboard.press('k');
    await mode(page, 'motion');await page.evaluate(() => window.flareInspector.setTime(2));
    check('Normal playback samples the updated original pose from the same animation', difference((await inspect(page)).pose, (await inspect(page)).formal.steps[2].pose) < 1e-6);
    await mode(page, 'pose');
    check('The ordinary pose editor reads the updated formal pose without changing personal data', equal((await page.evaluate(() => window.flareInspector.presetLibrary()))[2].pose, (await inspect(page)).formal.steps[2].pose) && await stored(page, PERSONAL_KEY) === personalRaw);
    await mode(page, 'transition');await seek(page, 4);await adjustPelvis(page, 1);const unsavedOriginal = await inspect(page);
    await seek(page, 4.5);await page.keyboard.press('k');
    check('Saving a blue K at another time preserves the unsaved white-frame adjustment', equal((await inspect(page)).transitions.document.draft, unsavedOriginal.transitions.document.draft));
    await drawer(page, 'library', true);await page.locator('#transition-return-draft').click();
    check('The preserved original draft can still be resumed and saved to its original position', (await inspect(page)).transitions.state.fixedIndex === 4 && (await inspect(page)).transitions.state.dirty && difference((await inspect(page)).pose, unsavedOriginal.pose) < 1e-6);
    await page.keyboard.press('k');await drawer(page, 'details', true);await page.locator('#transition-interpolation').selectOption('smooth');
    const rawBeforeUndoFailure = await stored(page, TRANSITION_STORAGE_KEY);
    await page.evaluate(() => { window.originalStorageSetItem = Storage.prototype.setItem;Storage.prototype.setItem = function(key, value) { if (key === 'flare-transition-library-v1') throw new DOMException('Test quota failure', 'QuotaExceededError');return window.originalStorageSetItem.call(this, key, value); }; });
    await page.locator('#transition-undo-document').click();
    check('A failed undo preserves its retry history and reports that browser storage was not saved', await stored(page, TRANSITION_STORAGE_KEY) === rawBeforeUndoFailure && await page.locator('#transition-undo-document').isEnabled() && (await page.locator('#toast').textContent()).includes('浏览器保存失败'));
    await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem;delete window.originalStorageSetItem; });
    await page.locator('#transition-undo-document').click();
    const retriedUndo = await inspect(page), savedEntries = JSON.parse(await stored(page, TRANSITION_STORAGE_KEY)).entries;
    check('Retrying the undo commits the prior settings when storage becomes available', retriedUndo.transitions.document.interpolation === 'linear' && savedEntries.some(entry => entry.interpolation === 'linear' && equal(entry.base, retriedUndo.transitions.document.base)));
    // Pose mode may remember its own draft; use an independent context for the mobile check.
    const mobile = await pageFor(JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [edits] }), { width: 390, height: 844 });
    await mode(mobile, 'transition');await seek(mobile, 1);await adjustPelvis(mobile, 1);await drawer(mobile, 'details', false);
    check('The update-original button stays accessible with mobile drawers closed', await mobile.locator('#transition-keyframe-button').isVisible() && await mobile.locator('#transition-keyframe-button').isEnabled());
    await mobile.locator('#transition-keyframe-button').click();
    check('A mobile original update preserves IDs and intermediate frames', equal((await inspect(mobile)).formal.steps.map(step => step.id), source.steps.map(step => step.id)) && equal((await inspect(mobile)).transitions.document.points, edits.points));
    await mode(page, 'transition');await seek(page, 2);await drawer(page, 'details', true);
    await screenshot(page, 'fixed-frame-editor.png');
    check('Original-frame editing leaves source files unchanged and has no browser errors', await fs.readFile(sourcePath, 'utf8') === sourceBytes && errors.length === 0, errors);
  } else if (process.argv.includes('--keyframe-spans')) {
    const page = await pageFor();await mode(page, 'transition');await drawer(page, 'details', true);
    const at = async time => { await seek(page, time);return inspect(page); };
    const before = [];
    for (const time of [.25, .49, .51, .75, 1.3]) before.push(await at(time));
    await seek(page, .5);await page.locator('#transition-handle').selectOption('leftKnee');
    const rotateKnee = async degrees => {
      const input = page.locator('#transition-rot-0');await input.fill(String(Number(await input.inputValue()) + degrees));await input.press('Tab');await blur(page);
    };
    await rotateKnee(18);const edited = await inspect(page);
    await page.locator('#transition-name').fill('左膝过渡');await blur(page);await page.keyboard.press('k');
    let frame = await inspect(page);const firstId = frame.transitions.document.points[0]?.id;
    check('Saving the edited knee keeps the pose shown during editing', frame.transitions.document.points.length === 1 && difference(frame.pose, edited.pose) < 1e-6);
    check('Saving K preserves the actual bone rotations displayed during editing', difference(frame.boneRotations, edited.boneRotations) < 1e-7);
    const after = [];
    for (const time of [.25, .49, .51, .75, 1.3]) after.push(await at(time));
    check('A saved K frame changes generated poses on both sides of the frame', after.slice(0, 4).every((item, index) => difference(item.status.motion.joints, before[index].status.motion.joints) > 1e-4));
    check('The correction leaves the adjacent original segment unchanged', difference(after[4].pose, before[4].pose) < 1e-7);
    const keyframe = await at(.5), leftLimit = await at(.4999), rightLimit = await at(.5001);
    check('Both generated sides approach the exact saved keyframe without a position snap', difference(leftLimit.status.motion.joints, keyframe.status.motion.joints) < .003 && difference(rightLimit.status.motion.joints, keyframe.status.motion.joints) < .003);
    const maximumBoneAngle = (a, b) => Math.max(...Object.keys(a).map(name => {
      const dot = a[name].reduce((sum, value, index) => sum + value * b[name][index], 0);
      return 2 * Math.acos(Math.min(1, Math.abs(dot)));
    }));
    check('Both generated sides approach the saved bone orientations without a rotation snap', maximumBoneAngle(leftLimit.boneRotations, keyframe.boneRotations) < .02 && maximumBoneAngle(rightLimit.boneRotations, keyframe.boneRotations) < .02);
    await seek(page, .5);await page.locator('#transition-handle').selectOption('leftKnee');await rotateKnee(12);await page.keyboard.press('k');frame = await inspect(page);
    check('Updating the K frame retains its identifier and rebuilds both sides', frame.transitions.document.points.length === 1 && frame.transitions.document.points[0].id === firstId && difference((await at(.25)).status.motion.joints, after[0].status.motion.joints) > 1e-4 && difference((await at(.75)).status.motion.joints, after[3].status.motion.joints) > 1e-4);
    await seek(page, .7);await page.keyboard.press('k');
    const boundedBefore = await at(.8);await seek(page, .5);await page.locator('#transition-handle').selectOption('leftKnee');await rotateKnee(8);await page.keyboard.press('k');
    check('A subsequent saved frame bounds the preceding correction influence', difference((await at(.8)).pose, boundedBefore.pose) < 1e-7 && (await inspect(page)).transitions.document.points.length === 2);
    const saved = (await inspect(page)).transitions.document.points;
    await page.reload();await ready(page);await mode(page, 'transition');
    check('Reload preserves both keyframes and their regenerated neighboring pose', equal((await inspect(page)).transitions.document.points, saved) && difference((await at(.8)).pose, boundedBefore.pose) < 1e-7);
    await preserved(page, 'K frame neighboring spans');
    await drawer(page, 'details', true);await seek(page, .5);await page.locator('#transition-interpolation').scrollIntoViewIfNeeded();
    await screenshot(page, 'transition-continuous-editor.png');
    check('The neighboring span workflow produced no JavaScript or console errors', errors.length === 0, errors);
    assert.equal(await fs.readFile(sourcePath, 'utf8'), sourceBytes);
  } else if (process.argv.includes('--interpolation-only')) {
    const baseline = createFlareSequence(source.steps, { period: source.period });
    const legacy = createTransitionEdits(source);delete legacy.interpolation;
    legacy.points = [.2, .7].map((at, index) => ({ id: `linear-fixture-${index}`, name: index ? '接回下一步' : '侧撑过渡', segment: 1, at, pose: baseline.sample(1 + at) }));
    const legacyRaw = JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [legacy] });
    const page = await pageFor(legacyRaw);await mode(page, 'transition');await drawer(page, 'details', true);
    check('Existing transition data loads as smooth without rewriting old raw storage', (await inspect(page)).transitions.document.interpolation === 'smooth' && await stored(page, TRANSITION_STORAGE_KEY) === legacyRaw);
    check('The interpolation selector is visible at the top of the adjustment panel', await page.locator('#transition-interpolation').isVisible() && await page.locator('#transition-interpolation').inputValue() === 'smooth');
    await seek(page, 1.45);const smoothPose = (await inspect(page)).pose;
    await page.locator('#transition-interpolation').selectOption('linear');
    let frame = await inspect(page);
    const expected = createFlareSequence(source.steps, { period: source.period, corrections: legacy.points, interpolation: 'linear' }).sample(1.45);
    check('Linear selection reaches the actual rig and keeps the independent arc route', frame.status.motion.interpolation === 'linear' && frame.status.motion.legPath === 'arc');
    check('The real rig rotation matches local linear timing between saved frames', difference(frame.pose.bodyQuaternion, expected.bodyQuaternion) < 1e-7 && difference(frame.pose.bodyQuaternion, smoothPose.bodyQuaternion) > 1e-5);
    check('Choosing interpolation preserves every previously saved frame', equal(frame.transitions.document.points, legacy.points));
    await adjustPelvis(page, 1.5);const draftPose = (await inspect(page)).pose;
    await page.locator('#transition-interpolation').selectOption('smooth');await page.locator('#transition-interpolation').selectOption('linear');
    frame = await inspect(page);
    check('Comparing linear and smooth retains the unsaved pose and its temporary draft', frame.transitions.state.dirty && frame.transitions.document.draft && difference(frame.pose, draftPose) < 1e-6);
    await (await reveal(page, '#transition-leg-path')).selectOption('linear');frame = await inspect(page);
    check('Comparing leg paths also retains the unsaved pose and interpolation choice', frame.transitions.state.dirty && frame.transitions.document.interpolation === 'linear' && difference(frame.pose, draftPose) < 1e-6);
    await (await reveal(page, '#transition-leg-path')).selectOption('arc');await blur(page);await page.keyboard.press('k');
    frame = await inspect(page);
    check('K saves the selected pose and keeps linear timing active', frame.transitions.document.points.length === 3 && frame.transitions.document.interpolation === 'linear' && !frame.transitions.document.draft && equal(frame.transitions.document.points.slice(0, 2), legacy.points));
    const savedPoints = frame.transitions.document.points;
    await seek(page, 1.6);await page.locator('#transition-interpolation').selectOption('smooth');await page.locator('#transition-undo-document').click();
    check('Undo restores the previous interpolation without changing saved poses', (await inspect(page)).transitions.document.interpolation === 'linear' && equal((await inspect(page)).transitions.document.points, savedPoints));
    await page.reload();await ready(page);
    check('Reload restores linear timing in full motion playback and keeps all saved frames', (await inspect(page)).status.motion.interpolation === 'linear' && equal((await inspect(page)).transitions.document.points, savedPoints));
    await mode(page, 'transition');await drawer(page, 'details', true);
    const exportPath = await download(page, '#transition-export', 'transition-linear-export.json');
    const exported = JSON.parse(await fs.readFile(exportPath, 'utf8'));
    check('JSON export includes the interpolation choice and every saved keyframe', exported.interpolation === 'linear' && equal(exported.points, savedPoints));
    await (await reveal(page, '#transition-enabled')).uncheck();frame = await inspect(page);
    check('Disabling restores the original playback while retaining linear choice and frames', frame.status.motion.interpolation === 'smooth' && frame.status.motion.legPath === 'linear' && frame.transitions.document.interpolation === 'linear' && equal(frame.transitions.document.points, savedPoints));
    await (await reveal(page, '#transition-enabled')).check();frame = await inspect(page);
    check('Reenabling restores the saved linear mode and independent arc path', frame.status.motion.interpolation === 'linear' && frame.status.motion.legPath === 'arc');
    const beforeInvalid = await stored(page, TRANSITION_STORAGE_KEY);
    await page.locator('#transition-import-file').setInputFiles({ name: 'invalid-interpolation.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...exported, interpolation: 'unknown' })) });
    await page.waitForFunction(() => document.querySelector('#transition-import-file').value === '');
    check('Unsupported interpolation import is refused without changing saved data', await stored(page, TRANSITION_STORAGE_KEY) === beforeInvalid);
    const oldExport = structuredClone(exported);delete oldExport.interpolation;
    await page.locator('#transition-import-file').setInputFiles({ name: 'old-transition-export.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(oldExport)) });
    await page.waitForFunction(() => document.querySelector('#transition-import-file').value === '');
    check('Old exports still import as smooth and retain their exact saved frame records', (await inspect(page)).status.motion.interpolation === 'smooth' && equal((await inspect(page)).transitions.document.points, savedPoints));
    await page.locator('#transition-import-file').setInputFiles(exportPath);
    await page.waitForFunction(() => document.querySelector('#transition-import-file').value === '');
    check('New exports restore linear timing and frames through import', (await inspect(page)).status.motion.interpolation === 'linear' && equal((await inspect(page)).transitions.document.points, savedPoints));
    await blur(page);await page.keyboard.press('Space');await page.waitForFunction(() => window.flareInspector.transitions().state.previewing && window.flareInspector.transitions().state.at > .02);
    await page.locator('#transition-interpolation').selectOption('smooth');frame = await inspect(page);
    check('Changing interpolation during preview pauses and applies the requested value', !frame.transitions.state.previewing && frame.status.motion.interpolation === 'smooth');
    await page.locator('#transition-interpolation').selectOption('linear');await seek(page, 1.45);
    await preserved(page, 'Linear interpolation workflow');
    assert.equal(await fs.readFile(sourcePath, 'utf8'), sourceBytes);
    await page.locator('#transition-interpolation').scrollIntoViewIfNeeded();
    await screenshot(page, 'transition-linear-editor.png');
    await page.setViewportSize({ width: 430, height: 900 });await drawer(page, 'details', true);
    check('The interpolation selector remains usable in the mobile adjustment drawer', await page.locator('#transition-interpolation').isVisible());
    check('The focused interpolation workflow produced no JavaScript or console errors', errors.length === 0, errors);
  } else if (process.argv.includes('--focus-shortcuts')) {
    const page = await pageFor();await mode(page, 'transition');await drawer(page, 'details', true);
    await seek(page, .35);await page.locator('#transition-global-scrub').focus();
    const before = (await inspect(page)).status.time;
    await page.keyboard.press('ArrowRight');
    const after = (await inspect(page)).status.time;
    check('A focused global range still advances by one animation frame', Math.abs(after - before - 1 / 60) < 1e-9, { before, after });
    await page.keyboard.press('k');
    const saved = (await inspect(page)).transitions.document.points;
    check('K creates a frame immediately after stepping a focused timeline', saved.length === 1 && Math.abs(saved[0].at - after) < 1e-9);
    await page.locator('#transition-name').focus();await page.keyboard.press('k');
    check('Typing K in the name field does not create or update an animation frame', equal((await inspect(page)).transitions.document.points, saved));
    await preserved(page, 'Focused timeline shortcuts');
    await seek(page, 1.5);await drawer(page, 'library', true);await drawer(page, 'details', true);
    await page.locator('#transition-handle').scrollIntoViewIfNeeded();
    await screenshot(page, 'transition-editor.png');
    check('The short check produced no JavaScript or console errors', errors.length === 0, errors);
  } else {
  let page, firstId, pointsBeforeDisable;
  if (process.argv.includes('--resume-at-playback')) {
    let checkpoint;
    try { checkpoint = JSON.parse(await fs.readFile(checkpointPath, 'utf8')); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const previous = JSON.parse(await fs.readFile(path.join(output, 'transition-ui-verification.json'), 'utf8'));
      assert.equal(previous.errors.length, 0, 'The earlier UI checks had console errors');
      const document = createTransitionEdits(source);
      document.points = [
        { id: 'resume-first-frame', name: 'K帧验证 · 更新', segment: 0, at: .35, pose: structuredClone(source.steps[0].pose) },
        { id: 'resume-second-frame', name: '09 → 10 · 65.0%', segment: 0, at: .65, pose: structuredClone(source.steps[1].pose) },
      ];
      checkpoint = { sourceBytes, checks: previous.checks.filter(item => item.pass), firstId: document.points[0].id, points: document.points, transitionRaw: JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [document] }) };
      await fs.writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2));
    }
    assert.equal(checkpoint.sourceBytes, sourceBytes, 'The original pose baseline changed since the checkpoint');
    checks.push(...checkpoint.checks);firstId = checkpoint.firstId;pointsBeforeDisable = checkpoint.points;
    page = await pageFor(checkpoint.transitionRaw);await mode(page, 'transition');
  } else {
  page = await pageFor();
  await preserved(page, 'Initial load');
  await mode(page, 'transition');await drawer(page, 'details', true);
  check('Animation editing exposes the bottom transport, eight editable spans and nine original markers', await page.locator('#transition-transport').isVisible() && await page.locator('[data-transition-segment]').count() === 8 && await page.locator('[data-transition-fixed]').count() === 9);
  const anchorErrors = [];
  for (let index = 0; index < source.steps.length; index++) {
    await page.locator(`[data-transition-fixed="${index}"]`).click();
    const frame = await inspect(page);anchorErrors.push(difference(frame.pose, source.steps[index].pose));
    assert.ok(await page.locator('#transition-keyframe-button').isDisabled());
    assert.equal(frame.status.editor.enabled, false);
  }
  check('All nine original markers load the saved anchors and cannot overwrite them with K', Math.max(...anchorErrors) < 1e-6, { maximumPoseDifference: Math.max(...anchorErrors) });
  await seek(page, .35);await adjustPelvis(page, 2);
  const temporary = await inspect(page);
  check('Editing creates a separate temporary pose and its return button without adding a saved frame', temporary.transitions.state.dirty && temporary.transitions.document.draft && temporary.transitions.document.points.length === 0 && await page.locator('#transition-return-draft').isVisible());
  await page.locator('#transition-name').fill('K帧验证 · 调整髋部');await blur(page);await page.keyboard.press('k');
  let frame = await inspect(page);
  firstId = frame.transitions.document.points[0]?.id;
  check('K saves one named frame at the selected time with its actual editable pose', frame.transitions.document.points.length === 1 && frame.transitions.document.points[0].name === 'K帧验证 · 调整髋部' && Math.abs(frame.transitions.document.points[0].at - .35) < 1e-9 && difference(frame.transitions.document.points[0].pose, temporary.pose) < 1e-6 && await page.locator('[data-transition-marker]').count() === 1);
  await preserved(page, 'First K frame');
  const beforeUndo = frame.pose;
  await adjustPelvis(page, 2);
  check('The next body adjustment changes only the editable pose', difference((await inspect(page)).pose, beforeUndo) > 1e-5);
  await page.keyboard.press('Control+z');
  frame = await inspect(page);
  check('Ctrl+Z restores the transition pose and leaves its saved frame intact', difference(frame.pose, beforeUndo) < 1e-6 && frame.transitions.document.points.length === 1 && frame.transitions.document.points[0].id === firstId);
  await preserved(page, 'Transition undo');
  await adjustPelvis(page, 1.5);await page.locator('#transition-name').fill('K帧验证 · 更新');await blur(page);
  const updatedPose = (await inspect(page)).pose;await page.keyboard.press('k');frame = await inspect(page);
  check('K updates the existing frame without adding a duplicate and retains its new name', frame.transitions.document.points.length === 1 && frame.transitions.document.points[0].id === firstId && frame.transitions.document.points[0].name === 'K帧验证 · 更新' && difference(frame.transitions.document.points[0].pose, updatedPose) < 1e-6);

  await page.evaluate(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (...args) {
      window.__transitionCaptureEditorEnabled = window.flareInspector.status().editor.enabled;
      HTMLCanvasElement.prototype.toBlob = original;return original.apply(this, args);
    };
  });
  await download(page, '#capture-button', 'transition-editor-export.png');
  await page.waitForFunction(() => !document.querySelector('#capture-button').disabled);
  check('PNG capture keeps the editor disabled while rendering and restores it afterward', await page.evaluate(() => window.__transitionCaptureEditorEnabled === false && window.flareInspector.status().editor.enabled === true));
  await blur(page);await page.keyboard.press('h');
  check('The bottom transport remains usable with both sidebars hidden', await page.locator('#library-drawer').isHidden() && await page.locator('#details-drawer').isHidden() && await page.locator('#transition-transport').isVisible());
  await seek(page, .65);const timeBefore = (await inspect(page)).status.time;
  await page.keyboard.press('ArrowRight');const timeAfter = (await inspect(page)).status.time;
  await page.keyboard.press('ArrowLeft');
  check('Arrow keys advance and retreat by one 60 fps frame from the bottom timeline', Math.abs(timeAfter - timeBefore - 1 / 60) < 1e-9 && Math.abs((await inspect(page)).status.time - timeBefore) < 1e-9);
  await page.keyboard.press('k');frame = await inspect(page);
  check('K adds a second frame while both sidebars remain hidden', frame.transitions.document.points.length === 2 && await page.locator('[data-transition-marker]').count() === 2 && await page.locator('#details-drawer').isHidden());
  await page.locator('#transition-preview-scope').selectOption('segment');await blur(page);await page.keyboard.press('Space');
  await page.waitForFunction(() => window.flareInspector.transitions().state.previewing && window.flareInspector.transitions().state.at > .03);
  frame = await inspect(page);
  check('Space previews the chosen segment and disables body editing', frame.transitions.state.previewing && frame.transitions.state.segment === 0 && !frame.status.editor.enabled);
  await page.keyboard.press('Space');
  await page.locator('#transition-preview-scope').selectOption('loop');await page.locator('#transition-global-speed').selectOption('1');await blur(page);await page.keyboard.press('Space');
  await page.waitForFunction(() => window.flareInspector.transitions().state.segment >= 1, null, { timeout: 10000 });
  check('Full-loop preview moves across an original segment boundary', (await inspect(page)).transitions.state.previewing);
  await page.keyboard.press('Space');await preserved(page, 'Preview and hidden-sidebar keys');

  pointsBeforeDisable = (await inspect(page)).transitions.document.points;
  await fs.writeFile(checkpointPath, JSON.stringify({ sourceBytes, checks, firstId, points: pointsBeforeDisable, transitionRaw: await stored(page, TRANSITION_STORAGE_KEY) }, null, 2));
  }
  let frame;
  await (await reveal(page, '#transition-enabled')).uncheck();frame = await inspect(page);
  check('Disabling corrections changes playback to linear without deleting any saved frame', !frame.transitions.document.enabled && frame.status.motion.legPath === 'linear' && equal(frame.transitions.document.points, pointsBeforeDisable));
  await page.reload();await ready(page);await preserved(page, 'Reload');
  frame = await inspect(page);
  check('Reload restores both saved frames, their updated names and the disabled state', frame.transitions.document.points.length === 2 && equal(frame.transitions.document.points, pointsBeforeDisable) && !frame.transitions.document.enabled);
  await mode(page, 'transition');await (await reveal(page, '#transition-enabled')).check();
  await page.locator(`[data-transition-marker="${firstId}"]`).click();
  frame = await inspect(page);
  check('Clicking a restored frame marker reloads its exact saved editable pose', difference(frame.pose, frame.transitions.document.points.find(point => point.id === firstId).pose) < 1e-6 && await page.locator('#transition-name').inputValue() === 'K帧验证 · 更新');
  await drawer(page, 'library', true);await page.locator(`[data-transition-remove="${firstId}"]`).click();
  check('Removing a frame updates the timeline and keeps the other frame', (await inspect(page)).transitions.document.points.length === 1 && await page.locator(`[data-transition-marker="${firstId}"]`).count() === 0);
  await drawer(page, 'details', true);await page.locator('#transition-undo-document').click();
  check('Undo restores the removed frame and its original identifier', equal((await inspect(page)).transitions.document.points, pointsBeforeDisable));
  const exportPath = await download(page, '#transition-export', 'transition-export.json');
  const exportedTransitions = JSON.parse(await fs.readFile(exportPath, 'utf8'));
  check('Export downloads the complete current transition document', equal(exportedTransitions, (await inspect(page)).transitions.document));
  const imported = structuredClone(exportedTransitions);imported.points[0].name = '导入帧 · 保留编号';
  await page.locator('#transition-import-file').setInputFiles({ name: 'transition-import.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
  await page.waitForFunction(name => window.flareInspector.transitions().document.points[0].name === name, imported.points[0].name);
  check('Import restores a compatible transition document without touching original anchors', equal((await inspect(page)).transitions.document, imported));
  await page.locator('#transition-undo-document').click();
  check('Import can be undone to the complete prior document', equal((await inspect(page)).transitions.document, exportedTransitions));
  const invalid = structuredClone(imported);invalid.points.at(-1).pose.bodyQuaternion = [0, 0, 0, 0];
  const transitionRawBeforeInvalid = await stored(page, TRANSITION_STORAGE_KEY);
  await page.locator('#transition-import-file').setInputFiles({ name: 'invalid-transition.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid)) });
  await page.waitForFunction(() => document.querySelector('#toast').textContent.includes('无效'));
  check('An invalid later imported pose rejects the whole file without replacing saved data', await stored(page, TRANSITION_STORAGE_KEY) === transitionRawBeforeInvalid && equal((await inspect(page)).transitions.document, exportedTransitions));

  await page.evaluate(() => {
    const original = File.prototype.text;
    File.prototype.text = async function () {
      File.prototype.text = original;const text = await original.call(this);
      await new Promise(resolve => { window.__transitionImportRelease = resolve; });return text;
    };
  });
  await page.locator('#transition-import-file').setInputFiles({ name: 'delayed-transition.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
  await page.waitForFunction(() => typeof window.__transitionImportRelease === 'function');
  await mode(page, 'pose');const poseDuringImport = (await inspect(page)).pose;
  await page.evaluate(() => window.__transitionImportRelease());
  await page.waitForFunction(name => window.flareInspector.transitions().document.points[0].name === name, imported.points[0].name);
  check('Finishing an import after switching modes preserves the current personal draft display', difference((await inspect(page)).pose, poseDuringImport) < 1e-6);
  await preserved(page, 'Import after mode switch');
  await mode(page, 'transition');await drawer(page, 'details', true);
  await page.locator('#transition-undo-document').click();
  await page.locator(`[data-transition-marker="${firstId}"]`).click();
  await drawer(page, 'library', true);await drawer(page, 'details', true);
  await screenshot(page, 'transition-desktop.png');
  await preserved(page, 'Final desktop');

  const mobile = await pageFor(await stored(page, TRANSITION_STORAGE_KEY), { width: 390, height: 844 });
  await mode(mobile, 'transition');await mobile.locator('#canvas-focus').click();
  const mobileTransport = await mobile.locator('#transition-transport').boundingBox();
  check('The mobile bottom timeline fits within the viewport and has no horizontal overflow', mobileTransport && mobileTransport.x >= 0 && mobileTransport.x + mobileTransport.width <= 390 && mobileTransport.y + mobileTransport.height <= 844 && await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await mobile.locator(`[data-transition-marker="${firstId}"]`).click();
  check('A mobile frame marker loads the saved correction and enables K update', difference((await inspect(mobile)).pose, pointsBeforeDisable.find(point => point.id === firstId).pose) < 1e-6 && await mobile.locator('#transition-keyframe-button').isEnabled());
  await seek(mobile, 1.4);await mobile.locator('#transition-keyframe-button').click();
  check('The mobile bottom K button adds a frame with both sidebars hidden', (await inspect(mobile)).transitions.document.points.length === 3 && await mobile.locator('#details-drawer').isHidden() && await mobile.locator('#library-drawer').isHidden());
  await drawer(mobile, 'details', true);
  const mobileDrawer = await mobile.locator('#details-drawer').boundingBox();
  check('The mobile body controls sit above the bottom transport', mobileDrawer && mobileDrawer.y + mobileDrawer.height <= mobileTransport.y + 1);
  await drawer(mobile, 'details', false);await screenshot(mobile, 'transition-mobile.png');
  await preserved(mobile, 'Mobile editing');
  check('No JavaScript or console errors occurred in either isolated context', errors.length === 0, errors);
  assert.equal(await fs.readFile(sourcePath, 'utf8'), sourceBytes);
  }
} catch (error) {
  failure = error.stack;await activePage?.screenshot({ path: path.join(output, 'transition-failure.png') }).catch(() => {});
} finally {
  const scope = process.argv.includes('--fixed-frames')
    ? 'Direct original-keyframe editing, bounded adjacent spans, existing K and personal-data preservation, closure, reload undo, complete animation backup, failed storage and mobile controls in isolated Chrome contexts.'
    : process.argv.includes('--keyframe-spans')
    ? 'Only actual knee K save/update and neighboring generated spans, keyframe approach continuity, next-key influence bounds, reload and exact original preservation in an isolated Chrome context.'
    : process.argv.includes('--interpolation-only')
    ? 'Only interpolation selection and actual rig timing, legacy compatibility, drafts, K save, undo, full playback, reload, JSON import/export, disabling and mobile access in an isolated Chrome context.'
    : process.argv.includes('--focus-shortcuts')
    ? 'Only focused timeline ArrowRight/K, the text-input K guard, exact original-key preservation and a clean editor screenshot in an isolated Chrome context.'
    : 'Isolated Chrome contexts: K save/update, anchors, temporary pose, Ctrl+Z, hidden sidebars, frame stepping, previews, reload, delete/undo, enable/disable, export/import and a mobile layout. Original user browser data is never opened.';
  const report = { pass: !failure && errors.length === 0, passed: checks.filter(item => item.pass).length, total: checks.length, checks, errors, failure, screenshots, personalRawSha256: createHash('sha256').update(personalRaw).digest('hex'), resumedAtPlayback: process.argv.includes('--resume-at-playback'), scope };
  const reportPath = path.join(output, process.argv.includes('--fixed-frames') ? 'fixed-frame-ui-verification.json' : process.argv.includes('--keyframe-spans') ? 'transition-keyframe-span-verification.json' : process.argv.includes('--interpolation-only') ? 'transition-interpolation-verification.json' : process.argv.includes('--focus-shortcuts') ? 'transition-shortcut-verification.json' : 'transition-ui-verification.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));await browser?.close();
  console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, errors, failure, report: reportPath, screenshots }, null, 2));
  if (!report.pass) process.exitCode = 1;
}
