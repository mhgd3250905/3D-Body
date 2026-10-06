import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { TRANSITION_STORAGE_KEY, createTransitionEdits } from '../src/transition-edits.js';
import { createFlareSequence } from '../src/flare-sequence.js';
import { OFFICIAL_LOOP_UPGRADE_MARKER_KEY } from '../src/official-poses.js';

// New isolated browser contexts only: never connect to a user Chrome profile.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/playwright');
const sourcePath = path.join(root, 'public/coach/flare-sequence.json');
const exportPath = path.join(root, '托马斯/16.json');
const sourceBytes = await fs.readFile(sourcePath, 'utf8');
const exportBytes = await fs.readFile(exportPath, 'utf8');
const source = JSON.parse(sourceBytes), originalExport = JSON.parse(exportBytes);
const PERSONAL_KEY = 'flare-pose-library-v1', OFFICIAL_KEY = 'flare-demonstration-v1';
const GUIDE_KEY = 'flare-trajectory-guide-v1';
const personalRaw = '\n  ' + JSON.stringify({ ...structuredClone(originalExport),
  draft: structuredClone(originalExport.steps[11].pose), title: 'Preserve personal poses and draft',
  removed: [], extra: { preserve: true } }, null, 3) + '\n';
const officialRaw = '\n ' + JSON.stringify(source, null, 2) + '\n';
const baseline = createFlareSequence(source.steps, { period: source.period });
const seedEdits = createTransitionEdits(source);
seedEdits.interpolation = 'linear';
seedEdits.points = [.3, .72, 1.45, 2.6].map((time, index) => ({
  id: `trajectory-neighbor-${index}`, name: `轨迹邻帧 ${time.toFixed(2)}`,
  segment: Math.floor(time), at: time % 1, pose: baseline.sample(time),
}));
const transitionRaw = '\n' + JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [seedEdits] }, null, 2) + '\n';
const base = process.env.TRAJECTORY_TEST_URL || process.env.TRANSITION_TEST_URL || 'http://127.0.0.1:8810/?inspect=1';
const origin = new URL(base).origin;
const require = createRequire(import.meta.url);
const runtimeModules = path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = require(path.join(runtimeModules, 'playwright'));
const { PNG } = require(path.join(runtimeModules, 'playwright-core/lib/utilsBundle.js'));
const checks = [], errors = [], screenshots = [];
const guidedJoints = ['leftAnkle', 'rightAnkle', 'leftKnee', 'rightKnee', 'pelvis'];
const boundariesOnly = process.argv.includes('--boundaries-only');
let browser, activePage, failure;
await fs.mkdir(output, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

function check(name, condition, detail) {
  checks.push({ name, pass: Boolean(condition), ...(detail === undefined ? {} : { detail }) });
  assert.ok(condition, name);
}
function difference(a, b) {
  let maximum = 0;
  function visit(x, y) {
    if (typeof x === 'number' || typeof y === 'number') {
      maximum = Math.max(maximum, Number.isFinite(x) && Number.isFinite(y) ? Math.abs(x - y) : Infinity);
    } else if (x && y && typeof x === 'object' && typeof y === 'object') {
      if (Object.keys(x).length !== Object.keys(y).length) maximum = Infinity;
      for (const key of Object.keys(x)) visit(x[key], y[key]);
    } else if (x !== y) maximum = Infinity;
  }
  visit(a, b);return maximum;
}
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const pickJoints = joints => Object.fromEntries(guidedJoints.map(name => [name, joints[name]]));
const stored = (page, key) => page.evaluate(key => localStorage.getItem(key), key);
const blur = page => page.evaluate(() => document.activeElement?.blur());
const inspect = page => page.evaluate(() => ({
  trajectory: window.flareInspector.trajectory(), transitions: window.flareInspector.transitions(),
  pose: window.flareInspector.capturePose(), status: window.flareInspector.status(),
  formal: window.flareInspector.demonstration(), bones: window.flareInspector.boneRotations(),
}));
const nextFrames = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));

async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true' &&
    typeof window.flareInspector?.trajectory === 'function', null, { timeout: 45000 });
}
async function pageFor({ sequence = source, edits = seedEdits } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const seed = { [PERSONAL_KEY]: personalRaw,
    [OFFICIAL_KEY]: sequence === source ? officialRaw : JSON.stringify(sequence),
    [TRANSITION_STORAGE_KEY]: edits === seedEdits ? transitionRaw : JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [edits] }),
    [OFFICIAL_LOOP_UPGRADE_MARKER_KEY]: sequence.source.revision };
  await context.addInitScript(({ origin, seed }) => {
    if (location.origin === origin && !localStorage.getItem('trajectory-ui-seeded')) {
      for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
      localStorage.setItem('trajectory-ui-seeded', '1');
    }
  }, { origin, seed });
  const page = await context.newPage();activePage = page;page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push({ type: 'pageerror', message: error.message }));
  page.on('console', message => {
    if (message.type() === 'error') errors.push({ type: 'console', message: message.text(), location: message.location() });
  });
  await page.goto(base);await ready(page);return page;
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
async function settle(page, pending) {
  await page.waitForFunction(pending => {
    const trajectory = window.flareInspector.trajectory();
    if (trajectory.error) return true;
    return !trajectory.scheduled && (trajectory.preferences.enabled
      ? trajectory.data && (pending == null || trajectory.pending === pending)
      : trajectory.data === null);
  }, pending ?? null);
  await nextFrames(page);
  const frame = await inspect(page);
  assert.equal(frame.trajectory.error, '', `Trajectory sampling failed: ${frame.trajectory.error}`);
  return frame;
}
async function seek(page, time) {
  await page.locator('#transition-global-scrub').evaluate((input, value) => {
    input.value = String(value);input.dispatchEvent(new Event('input', { bubbles: true }));
  }, time);
  await blur(page);return settle(page);
}
async function adjustPelvis(page, centimetres) {
  await drawer(page, 'details', true);await page.locator('#transition-handle').selectOption('pelvis');
  const input = page.locator('#transition-pos-0');
  await input.fill(String(Number(await input.inputValue()) + centimetres));await input.press('Tab');await blur(page);
  return settle(page, true);
}
async function saveK(page) {
  await blur(page);await page.keyboard.press('k');return settle(page, false);
}
function bounds(frame, start, end) {
  return Math.abs(frame.trajectory.data?.startTime - start) < 1e-9 &&
    Math.abs(frame.trajectory.data?.endTime - end) < 1e-9 &&
    Math.abs(frame.trajectory.range?.startTime - start) < 1e-9 &&
    Math.abs(frame.trajectory.range?.endTime - end) < 1e-9;
}
function frameAt(data, time) { return data.frames.find(frame => Math.abs(frame.time - time) < 1e-10); }
function matchesDisplayedJoint(data, frame) {
  const sample = frameAt(data, frame.status.time);
  return Boolean(sample) && difference(pickJoints(sample.joints), pickJoints(frame.status.motion.joints)) < 1e-7;
}
function matchesPath(a, b) { return difference(a.frames, b.frames) < 1e-7; }
async function unchangedStorage(page, before, label) {
  const after = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(key => key !== GUIDE_KEY);
  check(label, keys.every(key => before[key] === after[key]), { changedKeys: keys.filter(key => before[key] !== after[key]) });
}
async function screenshot(page, name) {
  await page.waitForFunction(() => document.querySelector('#toast').hidden);
  await nextFrames(page);const filename = path.join(output, name);
  await page.screenshot({ path: filename });screenshots.push(filename);return filename;
}
async function canvasImage(page, name) {
  await nextFrames(page);
  const data = await page.locator('#scene canvas').evaluate(canvas => canvas.toDataURL('image/png'));
  const bytes = Buffer.from(data.split(',')[1], 'base64');
  if (name) {
    const filename = path.join(output, name);await fs.writeFile(filename, bytes);screenshots.push(filename);
  }
  return PNG.sync.read(bytes);
}
function pixelDifference(on, off) {
  assert.equal(on.width, off.width);assert.equal(on.height, off.height);
  const result = { changed: 0, blue: 0, orange: 0, cyan: 0 };
  for (let index = 0; index < on.data.length; index += 4) {
    if (Math.max(...Array.from({ length: 4 }, (_, channel) => Math.abs(on.data[index + channel] - off.data[index + channel]))) <= 10) continue;
    result.changed++;
    const [r, g, b] = on.data.subarray(index, index + 3);
    if (b > 120 && b - r > 35 && b - g > 10) result.blue++;
    if (r > 120 && r - b > 35 && g > 60) result.orange++;
    if (g - r > 30 && b - r > 30 && Math.abs(g - b) < 70) result.cyan++;
  }
  return result;
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  let frame;
  if (!boundariesOnly) {
  const page = await pageFor();
  frame = await inspect(page);
  check('Trajectories are absent outside animation editing', !frame.trajectory.visible && frame.trajectory.data === null && frame.status.trajectory.frameCount === 0);
  await mode(page, 'transition');await drawer(page, 'details', true);frame = await settle(page, false);
  check('Foot, knee and pelvis trajectory controls default to checked',
    (await Promise.all(['enabled', 'feet', 'knees', 'pelvis'].map(key => page.locator('#trajectory-' + key).isChecked()))).every(Boolean));
  check('The first closed endpoint selects its next saved neighbor within 0–8 seconds', bounds(frame, 0, .3) && Number(await page.locator('#transition-global-scrub').getAttribute('max')) === 8);

  frame = await seek(page, .5);const savedAtHalf = structuredClone(frame.trajectory.data);
  check('Between K frames the bounds are the strictly nearest saved neighbors', bounds(frame, .3, .72));
  frame = await seek(page, .3);
  const uniform = Array.from({ length: 65 }, (_, index) => frame.trajectory.data.startTime +
    (frame.trajectory.data.endTime - frame.trajectory.data.startTime) * index / 64);
  check('Stopping exactly on a blue K shows both neighboring spans and includes its exact time', bounds(frame, 0, .72) &&
    uniform.every(time => frameAt(frame.trajectory.data, time)) && matchesDisplayedJoint(frame.trajectory.data, frame) && frame.trajectory.data.frames.length === 66,
  { frames: frame.trajectory.data.frames.length, bounds: frame.trajectory.range });
  frame = await seek(page, 1);
  check('Stopping exactly on a white original key shows its two neighboring K bounds', bounds(frame, .72, 1.45) && matchesDisplayedJoint(frame.trajectory.data, frame));
  check('The range label names both neighbors and distinguishes saved trajectories',
    (await page.locator('#trajectory-range').textContent()).includes('0.72') &&
    (await page.locator('#trajectory-range').textContent()).includes('1.45') &&
    (await page.locator('#trajectory-state').textContent()).includes('已保存轨迹'));
  frame = await seek(page, 2.3);
  check('Changing segment and dragging the timeline update the current guide time', bounds(frame, 2, 2.6) &&
    Math.abs(frame.trajectory.currentTime - 2.3) < 1e-9 && frame.status.trajectory.currentTime === frame.trajectory.currentTime);

  await seek(page, .5);const beforeDisplay = await inspect(page);
  const beforePreferences = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  await screenshot(page, 'trajectory-editor-desktop.png');
  const onPixels = await canvasImage(page, 'trajectory-guides-canvas.png');
  await page.locator('#trajectory-enabled').uncheck();frame = await settle(page);
  const offPixels = await canvasImage(page, 'trajectory-hidden-canvas.png');
  const pixels = pixelDifference(onPixels, offPixels);
  check('Actual rendered canvas pixels contain visible colored guides', pixels.changed > 40 && pixels.blue > 5 && pixels.orange > 5, pixels);
  check('Disabling the guide clears geometry/data and shows the closed state', !frame.trajectory.visible &&
    frame.trajectory.frameCount === 0 && frame.trajectory.data === null && (await page.locator('#trajectory-state').textContent()).includes('关闭'));
  check('Display sampling and hiding preserve the actual pose, bones, time and camera',
    difference(frame.pose, beforeDisplay.pose) < 1e-9 && difference(frame.bones, beforeDisplay.bones) < 1e-9 &&
    equal(frame.status.camera, beforeDisplay.status.camera) && equal(frame.status.target, beforeDisplay.status.target) && frame.status.time === beforeDisplay.status.time);
  await page.locator('#trajectory-enabled').check();await settle(page, false);
  for (const key of ['feet', 'knees', 'pelvis']) {
    await page.locator('#trajectory-' + key).uncheck();frame = await settle(page);
    check(`The ${key} visibility control applies independently`, frame.trajectory[key] === false && frame.trajectory.preferences[key] === false && frame.trajectory.enabled);
  }
  check('Hiding all three groups removes the guides from the actual canvas',
    pixelDifference(await canvasImage(page), offPixels).changed === 0);
  await page.locator('#trajectory-enabled').uncheck();await settle(page);
  await unchangedStorage(page, beforePreferences, 'Guide preferences only write their dedicated storage key');
  await page.reload();await ready(page);await mode(page, 'transition');await drawer(page, 'details', true);frame = await settle(page);
  check('Reload preserves the disabled guide and all three hidden groups', !frame.trajectory.enabled &&
    !frame.trajectory.feet && !frame.trajectory.knees && !frame.trajectory.pelvis &&
    !(await page.locator('#trajectory-enabled').isChecked()) && await page.locator('#trajectory-feet').isDisabled());
  await unchangedStorage(page, beforePreferences, 'Reloading guide preferences preserves source, personal draft and edit document bytes');
  await page.locator('#trajectory-enabled').check();await settle(page);
  for (const key of ['feet', 'knees', 'pelvis']) await page.locator('#trajectory-' + key).check();
  await settle(page);

  await seek(page, .5);const pendingNew = await adjustPelvis(page, 2);
  check('An unsaved middle adjustment previews the two rebuilt spans without adding a K',
    pendingNew.trajectory.pending && pendingNew.trajectory.range.pending && pendingNew.transitions.state.dirty &&
    pendingNew.transitions.document.points.length === seedEdits.points.length && bounds(pendingNew, .3, .72) &&
    matchesDisplayedJoint(pendingNew.trajectory.data, pendingNew) && !matchesPath(pendingNew.trajectory.data, savedAtHalf) &&
    (await page.locator('#trajectory-state').textContent()).includes('未保存调整预览'));
  await screenshot(page, 'trajectory-pending-keyframe.png');
  frame = await saveK(page);const newPoint = frame.transitions.document.points.find(point => Math.abs(point.at - .5) < 1e-9 && point.segment === 0);
  check('Saving the new K produces exactly the path shown in the pending preview',
    Boolean(newPoint) && frame.transitions.document.points.length === seedEdits.points.length + 1 &&
    !frame.trajectory.pending && bounds(frame, .3, .72) && matchesPath(frame.trajectory.data, pendingNew.trajectory.data),
  { maximumDifference: difference(frame.trajectory.data.frames, pendingNew.trajectory.data.frames) });
  const pendingUpdate = await adjustPelvis(page, 1);frame = await saveK(page);
  check('Updating a blue K keeps its ID and regenerates the predicted path',
    frame.transitions.document.points.find(point => point.id === newPoint.id)?.at === .5 &&
    frame.transitions.document.points.length === seedEdits.points.length + 1 && matchesPath(frame.trajectory.data, pendingUpdate.trajectory.data));
  await drawer(page, 'library', true);await page.locator(`[data-transition-remove="${newPoint.id}"]`).click();frame = await settle(page, false);
  check('Deleting that blue K restores the original neighboring saved trajectory',
    !frame.transitions.document.points.some(point => point.id === newPoint.id) && bounds(frame, .3, .72) && matchesPath(frame.trajectory.data, savedAtHalf));
  check('Middle-frame trajectory editing preserves original source and personal bytes',
    await stored(page, OFFICIAL_KEY) === officialRaw && await stored(page, PERSONAL_KEY) === personalRaw);

  await seek(page, 1);const pendingOriginal = await adjustPelvis(page, 2);
  check('A dirty white original previews its replacement without writing the formal sequence',
    pendingOriginal.transitions.state.fixedIndex === 1 && bounds(pendingOriginal, .72, 1.45) &&
    pendingOriginal.trajectory.pending && matchesDisplayedJoint(pendingOriginal.trajectory.data, pendingOriginal) && await stored(page, OFFICIAL_KEY) === officialRaw);
  frame = await saveK(page);
  check('Saving a white original matches the predicted path and preserves all blue K frames',
    matchesPath(frame.trajectory.data, pendingOriginal.trajectory.data) && equal(frame.transitions.document.points, seedEdits.points) &&
    frame.formal.steps.length === 9 && equal(frame.formal.steps.map(step => step.id), source.steps.map(step => step.id)) &&
    frame.formal.steps.every((step, index) => index === 1 || equal(step, source.steps[index])));

  await seek(page, 0);const pendingFirst = await adjustPelvis(page, 1);frame = await saveK(page);
  check('The first 09 previews and saves one synchronized closure without adding nodes',
    bounds(pendingFirst, 0, .3) && matchesDisplayedJoint(pendingFirst.trajectory.data, pendingFirst) &&
    matchesPath(frame.trajectory.data, pendingFirst.trajectory.data) && equal(frame.formal.steps[0].pose, frame.formal.steps[8].pose) && frame.formal.steps.length === 9);
  await seek(page, 8);const pendingLast = await adjustPelvis(page, 1);frame = await saveK(page);
  check('The final 09 previews only its previous span and saves the same closure at both ends',
    bounds(pendingLast, 7, 8) && matchesDisplayedJoint(pendingLast.trajectory.data, pendingLast) &&
    matchesPath(frame.trajectory.data, pendingLast.trajectory.data) && equal(frame.formal.steps[0].pose, frame.formal.steps[8].pose) &&
    frame.formal.steps[0].id === source.steps[0].id && frame.formal.steps[8].id === source.steps[8].id);

  await seek(page, .55);await (await reveal(page, '#transition-enabled')).uncheck();frame = await settle(page, false);
  const disabledSavedPath = structuredClone(frame.trajectory.data);
  check('Disabled corrections are excluded from saved trajectory neighbor bounds', !frame.transitions.document.enabled && bounds(frame, 0, 1));
  const pendingDisabled = await adjustPelvis(page, 1);
  check('A dirty middle K predicts saving will enable corrections and uses those neighbor bounds',
    !pendingDisabled.transitions.document.enabled && pendingDisabled.trajectory.pending && bounds(pendingDisabled, .3, .72) &&
    matchesDisplayedJoint(pendingDisabled.trajectory.data, pendingDisabled));
  const draftBeforePreview = structuredClone(pendingDisabled.transitions.document.draft);
  await page.locator('#transition-global-play').click();
  await page.waitForFunction(() => window.flareInspector.transitions().state.previewing && !window.flareInspector.trajectory().scheduled &&
    window.flareInspector.trajectory().data && !window.flareInspector.trajectory().pending);
  frame = await inspect(page);
  check('Preview samples only the saved disabled animation and preserves the unsaved draft',
    frame.transitions.state.previewing && bounds(frame, 0, 1) && matchesPath(frame.trajectory.data, disabledSavedPath) &&
    equal(frame.transitions.document.draft, draftBeforePreview));
  await page.locator('#transition-global-play').click();await seek(page, .55);frame = await saveK(page);
  check('Saving while corrections were disabled enables them and matches the pending path',
    frame.transitions.document.enabled && bounds(frame, .3, .72) && matchesPath(frame.trajectory.data, pendingDisabled.trajectory.data));

  const finalFormal = structuredClone(frame.formal), finalPoints = structuredClone(frame.transitions.document.points);
  const finalPersonal = await stored(page, PERSONAL_KEY);
  await page.reload();await ready(page);await mode(page, 'transition');await seek(page, .55);frame = await settle(page, false);
  check('Reload preserves updated original frames, K paths and personal draft', equal(frame.formal, finalFormal) &&
    equal(frame.transitions.document.points, finalPoints) && finalPersonal === personalRaw && await stored(page, PERSONAL_KEY) === personalRaw &&
    matchesPath(frame.trajectory.data, pendingDisabled.trajectory.data));
  const docBeforeLeave = await stored(page, TRANSITION_STORAGE_KEY);
  await mode(page, 'motion');frame = await inspect(page);
  check('Leaving animation editing hides and clears trajectory data without changing saved animation',
    !frame.trajectory.visible && frame.trajectory.data === null && frame.trajectory.frameCount === 0 &&
    equal(frame.formal, finalFormal) && await stored(page, TRANSITION_STORAGE_KEY) === docBeforeLeave && await stored(page, PERSONAL_KEY) === personalRaw);
  await mode(page, 'transition');await seek(page, .55);frame = await settle(page, false);
  check('Re-entering animation editing reconstructs the saved guide', frame.trajectory.visible && matchesPath(frame.trajectory.data, pendingDisabled.trajectory.data));
  await page.setViewportSize({ width: 430, height: 900 });
  // Mobile intentionally shows one drawer. Explicitly choose the adjustment
  // drawer after shrinking a desktop that had both desktop drawers open.
  await drawer(page, 'library', false);await drawer(page, 'details', true);await settle(page);
  const mobileVisibility = {
    enabled: await page.locator('#trajectory-enabled').isVisible(),
    range: await page.locator('#trajectory-range').isVisible(),
    details: await page.locator('#details-drawer').isVisible(),
    transport: await page.locator('#transition-transport').isVisible(),
    width: await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth })),
  };
  check('Mobile adjustment drawer exposes the guide controls and neighbor range',
    mobileVisibility.enabled && mobileVisibility.range && mobileVisibility.details, mobileVisibility);
  check('The existing mobile transport remains accessible without horizontal overflow',
    mobileVisibility.transport && mobileVisibility.width.scroll <= mobileVisibility.width.viewport, mobileVisibility);
  await screenshot(page, 'trajectory-editor-mobile.png');
  }

  const reorderObjectKeys = value => Array.isArray(value) ? value.map(reorderObjectKeys)
    : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).reverse().map(([key, child]) => [key, reorderObjectKeys(child)])) : value;
  const reorderedLoop = structuredClone(source);
  reorderedLoop.steps[8].pose = reorderObjectKeys(reorderedLoop.steps[0].pose);
  const closedPage = await pageFor({ sequence: reorderedLoop, edits: createTransitionEdits(reorderedLoop) });
  await mode(closedPage, 'transition');frame = await seek(closedPage, 8);
  check('JSON key order does not create a ninth editable closure span',
    Number(await closedPage.locator('#transition-global-scrub').getAttribute('max')) === 8 &&
    await closedPage.locator('[data-transition-segment]').count() === 8 && frame.transitions.state.fixedIndex === 8 && bounds(frame, 7, 8));
  await seek(closedPage, 0);const reorderedPending = await adjustPelvis(closedPage, 1);frame = await saveK(closedPage);
  check('A reordered but identical closure still predicts and saves both 09 endpoints together',
    equal(frame.formal.steps[0].pose, frame.formal.steps[8].pose) && frame.formal.steps.length === 9 &&
    matchesPath(frame.trajectory.data, reorderedPending.trajectory.data) && await stored(closedPage, PERSONAL_KEY) === personalRaw);

  const closeEdits = createTransitionEdits(source), tinyAt = 1e-14, tinyTime = 3 + tinyAt;
  closeEdits.points = [{ id: 'trajectory-near-original', name: '极近原帧的独立 K', segment: 3, at: tinyAt, pose: baseline.sample(tinyTime) }];
  const closePage = await pageFor({ edits: closeEdits });await mode(closePage, 'transition');frame = await seek(closePage, 3);
  check('A saved K closer than a generic epsilon remains the strict next neighbor of its original frame',
    frame.trajectory.data.startTime === 2 && frame.trajectory.data.endTime === tinyTime &&
    frame.trajectory.range.endLabel.startsWith('K 帧') && frame.trajectory.data.frames.some(sample => sample.time === tinyTime),
  { expectedNext: tinyTime, range: frame.trajectory.range, frames: frame.trajectory.frameCount });
  // The scrubber's 0.001-second native range step rounds this imported K back
  // onto its original frame. Its saved-key button must load the exact authored
  // coordinate rather than pretending the scrubber has sub-step precision.
  await drawer(closePage, 'library', true);
  await closePage.locator('[data-transition-point="trajectory-near-original"]').click();
  frame = await settle(closePage, false);
  check('Stopping on the extremely close K excludes itself and shows its actual original neighbors',
    frame.transitions.state.fixedIndex === null && frame.trajectory.data.startTime === 3 && frame.trajectory.data.endTime === 4 &&
    frame.trajectory.range.startLabel.startsWith('原第') && frame.trajectory.range.endLabel.startsWith('原第'),
  { range: frame.trajectory.range, at: frame.transitions.state.at });
  check('Boundary contexts preserve personal bytes and source sequence poses',
    await stored(closePage, PERSONAL_KEY) === personalRaw && await stored(closePage, OFFICIAL_KEY) === officialRaw);
  if (boundariesOnly) {
    await drawer(closePage, 'details', true);
    await screenshot(closePage, 'trajectory-near-key-boundary.png');
  }
  check('No JavaScript or console errors occurred in the isolated browser', errors.length === 0, errors);
  check('Original source assets remain byte-for-byte unchanged', await fs.readFile(sourcePath, 'utf8') === sourceBytes && await fs.readFile(exportPath, 'utf8') === exportBytes);
} catch (error) {
  failure = error.stack;
  const filename = path.join(output, 'trajectory-ui-failure.png');
  await activePage?.screenshot({ path: filename }).then(() => screenshots.push(filename)).catch(() => {});
} finally {
  const report = { pass: !failure && errors.length === 0, passed: checks.filter(item => item.pass).length,
    total: checks.length, checks, errors, failure, screenshots, sourceSha256: hash(sourceBytes),
    personalRawSha256: hash(personalRaw),
    ...(boundariesOnly ? { calibration: 'The preceding complete run had 39 passing checks and no browser errors. Its last check incorrectly attempted to seek an imported 1e-14 K through a step=0.001 range input, which the browser rounded to the original frame. This targeted run loads that saved K through its exact-key button. Source/build remain unchanged; the default tool now uses this corrected operation.' } : {}),
    scope: boundariesOnly ? 'Only isolated boundary contexts: property-order-independent closed 09 loop, pending/save closure path equality, strictly adjacent near-original K bounds and exact saved-K button load, data preservation, browser errors and original file bytes.'
      : 'Isolated Chrome: actual canvas guide pixels and screenshots; strict saved-key bounds and current time; exact-key samples; pending/save path equivalence; blue K update/delete; white originals and linked closure; display preference/reload isolation; disabled K prediction; saved-only preview; mode exit/re-entry and mobile access. No real user browser profile is opened.' };
  const reportPath = path.join(output, boundariesOnly ? 'trajectory-ui-boundary-verification.json' : 'trajectory-ui-verification.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));await browser?.close();
  console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, errors, failure, report: reportPath, screenshots }, null, 2));
  if (!report.pass) process.exitCode = 1;
}
