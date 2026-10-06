import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { TRANSITION_STORAGE_KEY, createTransitionEdits } from '../src/transition-edits.js';
import { OFFICIAL_LOOP_UPGRADE_MARKER_KEY } from '../src/official-poses.js';

// Reuse the existing transition/trajectory UI tools' isolated seed, inspector,
// drawer, timeline and screenshot workflow. Never open a real browser profile.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/playwright');
const sourcePath = path.join(root, 'public/coach/flare-sequence.json');
const originalExportPath = path.join(root, '托马斯/16.json');
const sourceBytes = await fs.readFile(sourcePath, 'utf8');
const exportBytes = await fs.readFile(originalExportPath, 'utf8');
const source = JSON.parse(sourceBytes), originalExport = JSON.parse(exportBytes);
const PERSONAL_KEY = 'flare-pose-library-v1', OFFICIAL_KEY = 'flare-demonstration-v1';
const GUIDE_KEY = 'flare-trajectory-guide-v1';
const officialRaw = '\n ' + JSON.stringify(source, null, 2) + '\n';
const personalRaw = '\n  ' + JSON.stringify({ ...structuredClone(originalExport),
  draft: structuredClone(originalExport.steps[11].pose), title: 'Preserve personal steps and draft',
  removed: [], extra: { preserve: true } }, null, 3) + '\n';
const seedEdits = createTransitionEdits(source);
seedEdits.interpolation = 'linear';
// A valid, previously saved pose deliberately placed at a different time makes
// its skip effect measurable without inventing targets or modifying assets.
seedEdits.points = [{ id: 'frame-skip-blue', name: '保留蓝 K 的原姿态', segment: 0, at: .5,
  pose: structuredClone(source.steps[1].pose) }];
const seedGuide = { version: 1, enabled: true, feet: true, knees: true, pelvis: true };
const base = process.env.FRAME_SKIP_TEST_URL || process.env.TRANSITION_TEST_URL || 'http://127.0.0.1:8810/?inspect=1';
const origin = new URL(base).origin;
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.USERPROFILE,
  '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const checks = [], errors = [], screenshots = [];
const blueId = seedEdits.points[0].id;
let browser, activePage, failure;
await fs.mkdir(output, { recursive: true });

function check(name, condition, detail) {
  checks.push({ name, pass: Boolean(condition), ...(detail === undefined ? {} : { detail }) });
  assert.ok(condition, name);
}
function difference(a, b) {
  let maximum = 0;
  function visit(x, y) {
    if (typeof x === 'number' || typeof y === 'number') maximum = Math.max(maximum,
      Number.isFinite(x) && Number.isFinite(y) ? Math.abs(x - y) : Infinity);
    else if (x && y && typeof x === 'object' && typeof y === 'object') {
      if (Object.keys(x).length !== Object.keys(y).length) maximum = Infinity;
      for (const key of Object.keys(x)) visit(x[key], y[key]);
    } else if (x !== y) maximum = Infinity;
  }
  visit(a, b);return maximum;
}
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sameNumbers = (a, b) => Array.isArray(a) && equal([...a].sort((x, y) => x - y), [...b].sort((x, y) => x - y));
const stored = (page, key) => page.evaluate(key => localStorage.getItem(key), key);
const blur = page => page.evaluate(() => document.activeElement?.blur());
const nextFrames = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const inspect = page => page.evaluate(() => ({
  transitions: window.flareInspector.transitions(), trajectory: window.flareInspector.trajectory(),
  status: window.flareInspector.status(), pose: window.flareInspector.capturePose(),
  formal: window.flareInspector.demonstration(), bones: window.flareInspector.boneRotations(),
}));
const point = frame => frame.transitions.document.points.find(item => item.id === blueId);
const withoutSkip = ({ skipped, ...rest }) => rest;
const guideFrame = (frame, time) => frame.trajectory.data?.frames.find(item => Math.abs(item.time - time) < 1e-10);
const pathDifference = (a, b) => difference(a.trajectory.data.frames, b.trajectory.data.frames);
const bounds = (frame, start, end) => Math.abs(frame.trajectory.range?.startTime - start) < 1e-9 &&
  Math.abs(frame.trajectory.range?.endTime - end) < 1e-9;

async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true' &&
    typeof window.flareInspector?.trajectory === 'function' &&
    Array.isArray(window.flareInspector.status().motion?.skippedSteps), null, { timeout: 45000 });
}
async function pageFor(edits = seedEdits) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const seed = { [PERSONAL_KEY]: personalRaw, [OFFICIAL_KEY]: officialRaw,
    [OFFICIAL_LOOP_UPGRADE_MARKER_KEY]: source.source.revision,
    [TRANSITION_STORAGE_KEY]: JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [edits] }),
    [GUIDE_KEY]: JSON.stringify(seedGuide) };
  await context.addInitScript(({ origin, seed }) => {
    if (location.origin === origin && !localStorage.getItem('frame-skip-ui-seeded')) {
      for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
      localStorage.setItem('frame-skip-ui-seeded', '1');
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
  await drawer(page, 'details', true);const field = page.locator(selector);
  if (!await field.isVisible()) await field.locator('xpath=ancestor::details[1]').locator('summary').click();
  return field;
}
async function settle(page, pending) {
  await page.waitForFunction(pending => {
    const trajectory = window.flareInspector.trajectory();
    return Boolean(trajectory.error) || !trajectory.scheduled && (!trajectory.preferences.enabled ||
      trajectory.data && (pending == null || trajectory.pending === pending));
  }, pending ?? null);
  await nextFrames(page);const frame = await inspect(page);
  assert.equal(frame.trajectory.error, '', `Trajectory failed: ${frame.trajectory.error}`);return frame;
}
async function seek(page, time) {
  await page.locator('#transition-global-scrub').evaluate((input, value) => {
    input.value = String(value);input.dispatchEvent(new Event('input', { bubbles: true }));
  }, time);
  await blur(page);return settle(page);
}
async function chooseOriginal(page, index) {
  await page.locator(`[data-transition-fixed="${index}"]`).click();await blur(page);return settle(page);
}
async function chooseBlue(page) {
  await page.locator(`[data-transition-marker="${blueId}"]`).click();await blur(page);return settle(page);
}
async function skip(page, right = false) {
  await page.locator(right ? '#transition-skip-current' : '#transition-skip-button').click();
  await blur(page);return settle(page);
}
async function adjustPelvis(page, centimetres) {
  await drawer(page, 'details', true);await page.locator('#transition-handle').selectOption('pelvis');
  const input = page.locator('#transition-pos-0');
  await input.fill(String(Number(await input.inputValue()) + centimetres));await input.press('Tab');await blur(page);
  return settle(page, true);
}
async function saveK(page) { await blur(page);await page.keyboard.press('k');return settle(page, false); }
async function screenshot(page, name) {
  await page.waitForFunction(() => document.querySelector('#toast').hidden);await nextFrames(page);
  const filename = path.join(output, name);await page.screenshot({ path: filename });screenshots.push(filename);
}
async function download(page, selector, name) {
  const pending = page.waitForEvent('download');await page.locator(selector).click();
  const destination = path.join(output, name);await (await pending).saveAs(destination);return destination;
}
async function assertPreserved(page, label, formal = source) {
  const frame = await inspect(page);
  check(label, equal(frame.formal, formal) && await stored(page, PERSONAL_KEY) === personalRaw &&
    await stored(page, GUIDE_KEY) === JSON.stringify(seedGuide));
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  const page = await pageFor();await mode(page, 'transition');await drawer(page, 'details', true);
  let frame = await seek(page, .25);
  check('Skip controls are disabled away from a saved original or K',
    await page.locator('#transition-skip-button').isDisabled() && await page.locator('#transition-skip-current').isDisabled());
  const before = {};
  for (const time of [1.5, 2, 2.5, 4.2]) before[time] = await seek(page, time);
  await chooseOriginal(page, 2);frame = await skip(page);
  check('Skipping one original keeps its stored pose, ID and time and marks both skip controls',
    sameNumbers(frame.transitions.document.skippedSteps, [2]) && sameNumbers(frame.status.motion.skippedSteps, [2]) &&
    frame.transitions.state.currentSkipped && equal(frame.formal, source) && frame.status.time === 2 &&
    (await page.locator('[data-transition-fixed="2"]').getAttribute('class')).includes('is-skipped') &&
    (await page.locator('#transition-skip-button').textContent()).includes('恢复此帧') &&
    (await page.locator('#transition-skip-current').textContent()).includes('恢复此帧'));
  const skippedOriginal = frame;
  check('Selecting the skipped original displays actual automatic interpolation rather than its saved pose',
    difference(frame.status.motion.joints, before[2].status.motion.joints) > 1e-5 &&
    difference(guideFrame(frame, 2)?.joints, frame.status.motion.joints) < 1e-7 &&
    (await page.locator('#transition-edit-state').textContent()).includes('自动补帧'));
  const after = {};
  for (const time of [1.5, 2.5, 4.2]) after[time] = await seek(page, time);
  check('The real Snow rig changes on both sides of the skipped key while a distant span stays exact',
    difference(after[1.5].status.motion.joints, before[1.5].status.motion.joints) > 1e-5 &&
    difference(after[2.5].bones, before[2.5].bones) > 1e-5 && difference(after[4.2].pose, before[4.2].pose) < 1e-7,
  { beforeSide: difference(after[1.5].status.motion.joints, before[1.5].status.motion.joints),
    afterSide: difference(after[2.5].bones, before[2.5].bones), distant: difference(after[4.2].pose, before[4.2].pose) });
  check('Guide bounds bridge the skipped original and sample the same regenerated rig',
    bounds(after[1.5], 1, 3) && bounds(after[2.5], 1, 3) &&
    difference(guideFrame(after[1.5], 2)?.joints, skippedOriginal.status.motion.joints) < 1e-7);
  await chooseOriginal(page, 2);await screenshot(page, 'frame-skip-original-desktop.png');
  frame = await skip(page, true);
  check('Restore uses the exact original stored pose and restores the previous bone transforms',
    !frame.transitions.state.currentSkipped && !(frame.transitions.document.skippedSteps ?? []).includes(2) &&
    equal(frame.formal.steps[2], source.steps[2]) && difference(frame.pose, before[2].pose) < 1e-7 &&
    difference(frame.bones, before[2].bones) < 1e-7 && await stored(page, OFFICIAL_KEY) === officialRaw);

  const blueBefore = await chooseBlue(page), blueStored = structuredClone(point(blueBefore));
  const beforeBlueSide = await seek(page, .25);await chooseBlue(page);frame = await skip(page);
  check('Skipping a blue K retains its ID, name, at and complete stored pose',
    point(frame).skipped === true && equal(withoutSkip(point(frame)), withoutSkip(blueStored)) &&
    frame.transitions.document.points.length === 1 && await page.locator(`[data-transition-marker="${blueId}"]`).count() === 1 &&
    (await page.locator(`[data-transition-marker="${blueId}"]`).getAttribute('class')).includes('is-skipped'));
  check('Selecting a skipped blue K displays the saved animation without that K',
    frame.transitions.state.currentSkipped && bounds(frame, 0, 1) &&
    difference(guideFrame(frame, .5)?.joints, frame.status.motion.joints) < 1e-7 &&
    difference(frame.pose, blueBefore.pose) > 1e-5);
  const afterBlueSide = await seek(page, .25);
  check('The actual route through a skipped blue K is rebuilt without deleting the K',
    bounds(afterBlueSide, 0, 1) && difference(afterBlueSide.status.motion.joints, beforeBlueSide.status.motion.joints) > 1e-5);
  await chooseBlue(page);frame = await skip(page, true);
  check('Restoring a blue K uses its exact stored pose and retains its metadata',
    !point(frame).skipped && equal(withoutSkip(point(frame)), withoutSkip(blueStored)) &&
    difference(frame.pose, blueBefore.pose) < 1e-7 && difference(frame.bones, blueBefore.bones) < 1e-7);
  await skip(page);const pendingBlue = await adjustPelvis(page, 1);frame = await saveK(page);
  check('K on an edited skipped blue key updates and restores that same key without duplication',
    !point(frame).skipped && !frame.transitions.state.currentSkipped && point(frame).id === blueId &&
    frame.transitions.document.points.length === 1 && difference(point(frame).pose, pendingBlue.pose) < 1e-7 &&
    pathDifference(frame, pendingBlue) < 1e-7);
  await assertPreserved(page, 'Blue skip, restore and K update preserve formal poses, personal steps/draft and display preferences');

  await chooseOriginal(page, 2);await skip(page);const pendingWhite = await adjustPelvis(page, 1);frame = await saveK(page);
  check('K on an edited skipped white key updates the original position and restores its anchor',
    !(frame.transitions.document.skippedSteps ?? []).includes(2) && !frame.transitions.state.currentSkipped &&
    difference(frame.formal.steps[2].pose, pendingWhite.pose) < 1e-7 && pathDifference(frame, pendingWhite) < 1e-7 &&
    equal(frame.formal.steps.map(step => step.id), source.steps.map(step => step.id)) && frame.formal.period === source.period);
  const updatedFormal = structuredClone(frame.formal);
  await skip(page);await chooseBlue(page);await skip(page);await chooseOriginal(page, 0);frame = await skip(page);
  check('Skipping the first 09 pairs the final 09 while retaining all nine nodes and the 0–8 timeline',
    sameNumbers(frame.transitions.document.skippedSteps, [0, 2, 8]) && sameNumbers(frame.status.motion.skippedSteps, [0, 2, 8]) &&
    equal(frame.formal, updatedFormal) && frame.formal.steps.length === 9 && Number(await page.locator('#transition-global-scrub').getAttribute('max')) === 8 &&
    (await page.locator('[data-transition-fixed="0"]').getAttribute('class')).includes('is-skipped') &&
    (await page.locator('[data-transition-fixed="8"]').getAttribute('class')).includes('is-skipped'));
  check('The skipped first 09 trajectory uses enabled neighbors across the previous cycle', bounds(frame, -2, 1));
  frame = await chooseOriginal(page, 8);
  check('The skipped final 09 trajectory reaches the next cycle without changing the nine-second period',
    bounds(frame, 7, 10) && frame.status.motion.period === 9 && frame.status.time === 8);
  frame = await skip(page);
  check('Restoring either 09 restores both closure anchors using their original poses',
    sameNumbers(frame.transitions.document.skippedSteps, [2]) && equal(frame.formal.steps[0], updatedFormal.steps[0]) &&
    equal(frame.formal.steps[8], updatedFormal.steps[8]));
  await page.locator('#transition-undo-document').click();frame = await settle(page);
  check('Undo restores the paired skip flags and all preserved stored poses',
    sameNumbers(frame.transitions.document.skippedSteps, [0, 2, 8]) && point(frame).skipped && equal(frame.formal, updatedFormal));

  const skipDocument = structuredClone(frame.transitions.document);
  await page.reload();await ready(page);await mode(page, 'transition');frame = await chooseOriginal(page, 0);
  check('Reload restores original and blue skip flags, clickable saved markers and cross-cycle bounds',
    sameNumbers(frame.transitions.document.skippedSteps, [0, 2, 8]) && point(frame).skipped && bounds(frame, -2, 1) &&
    await page.locator('[data-transition-fixed="0"]').isEnabled() && await page.locator(`[data-transition-marker="${blueId}"]`).isEnabled() &&
    equal(frame.formal, updatedFormal));
  await drawer(page, 'details', true);
  const backupPath = await download(page, '#transition-export', 'frame-skip-animation-backup.json');
  const backup = JSON.parse(await fs.readFile(backupPath, 'utf8'));
  check('Animation export preserves full original poses and both kinds of skip flags',
    equal(backup.sequence, updatedFormal) && sameNumbers(backup.skippedSteps, [0, 2, 8]) &&
    backup.points.find(item => item.id === blueId).skipped && equal(backup.points, skipDocument.points));
  await chooseOriginal(page, 0);await skip(page);await chooseBlue(page);await skip(page);
  await page.locator('#transition-import-file').setInputFiles(backupPath);
  await page.waitForFunction(() => {
    const doc = window.flareInspector.transitions().document;
    return doc.skippedSteps?.includes(0) && doc.skippedSteps.includes(8) && doc.points.find(item => item.id === 'frame-skip-blue')?.skipped;
  });
  frame = await settle(page);
  check('Import restores skip decisions without rewriting saved key poses or IDs',
    sameNumbers(frame.transitions.document.skippedSteps, backup.skippedSteps) && equal(frame.transitions.document.points, backup.points) && equal(frame.formal, backup.sequence));
  await seek(page, 1.5);await (await reveal(page, '#transition-enabled')).uncheck();frame = await settle(page);
  check('Disabling intermediate corrections still applies original-frame skips',
    !frame.transitions.document.enabled && sameNumbers(frame.status.motion.skippedSteps, [0, 2, 8]) && bounds(frame, 1, 3) && point(frame).skipped);
  await (await reveal(page, '#transition-enabled')).check();await settle(page);
  await assertPreserved(page, 'Paired skips, undo, reload, import/export and enable toggles preserve personal data and display preferences', updatedFormal);
  const beforeInvalid = { doc: await stored(page, TRANSITION_STORAGE_KEY), official: await stored(page, OFFICIAL_KEY), pose: (await inspect(page)).pose };
  const invalid = structuredClone(backup);invalid.skippedSteps = source.steps.map((_, index) => index);
  invalid.points = invalid.points.map(item => ({ ...item, skipped: true }));
  await page.locator('#transition-import-file').setInputFiles({ name: 'all-skipped.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid)) });
  await page.waitForFunction(() => document.querySelector('#transition-import-file').value === '');frame = await settle(page);
  check('Importing a document with no effective anchor rejects the whole file atomically',
    await stored(page, TRANSITION_STORAGE_KEY) === beforeInvalid.doc && await stored(page, OFFICIAL_KEY) === beforeInvalid.official && difference(frame.pose, beforeInvalid.pose) < 1e-7);
  await chooseOriginal(page, 0);await screenshot(page, 'frame-skip-wrap-desktop.png');
  await page.setViewportSize({ width: 430, height: 900 });await drawer(page, 'library', false);await drawer(page, 'details', true);
  await page.locator('#transition-skip-current').scrollIntoViewIfNeeded();
  check('Mobile bottom and adjustment-drawer skip buttons remain visible and enabled for saved keys',
    await page.locator('#transition-skip-button').isVisible() && await page.locator('#transition-skip-button').isEnabled() &&
    await page.locator('#transition-skip-current').isVisible() && await page.locator('#transition-skip-current').isEnabled() &&
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await drawer(page, 'details', false);frame = await skip(page);
  check('The mobile bottom button can restore paired closure anchors with both drawers hidden',
    sameNumbers(frame.transitions.document.skippedSteps, [2]) && await page.locator('#library-drawer').isHidden() && await page.locator('#details-drawer').isHidden());
  await screenshot(page, 'frame-skip-mobile.png');

  const dirtyPage = await pageFor();await mode(dirtyPage, 'transition');await chooseOriginal(dirtyPage, 2);
  const dirty = await adjustPelvis(dirtyPage, 2), savedDraft = structuredClone(dirty.transitions.document.draft);
  frame = await skip(dirtyPage);
  check('Skip first saves the current adjustment as a separate draft and then displays saved interpolation',
    equal(frame.transitions.document.draft, savedDraft) && !frame.transitions.state.dirty && frame.transitions.state.currentSkipped &&
    difference(frame.pose, dirty.pose) > 1e-5 && equal(frame.formal, source));
  await drawer(dirtyPage, 'library', true);await dirtyPage.locator('#transition-return-draft').click();frame = await settle(dirtyPage, true);
  check('Returning to that draft preserves its actual pose and previews restoring the skipped key on K',
    frame.transitions.state.dirty && frame.transitions.state.currentSkipped && difference(frame.pose, dirty.pose) < 1e-7 &&
    difference(guideFrame(frame, 2)?.joints, frame.status.motion.joints) < 1e-7);
  await mode(dirtyPage, 'motion');await mode(dirtyPage, 'transition');
  await assertPreserved(dirtyPage, 'Mode changes preserve saved source and the independent personal draft');

  const lastOriginalEdits = createTransitionEdits(source);
  lastOriginalEdits.skippedSteps = source.steps.map((_, index) => index).filter(index => index !== 2);
  const lastOriginal = await pageFor(lastOriginalEdits);await mode(lastOriginal, 'transition');await chooseOriginal(lastOriginal, 2);
  const pendingLast = await adjustPelvis(lastOriginal, 1);
  const lastRaw = await stored(lastOriginal, TRANSITION_STORAGE_KEY);
  await lastOriginal.locator('#transition-skip-button').click();frame = await settle(lastOriginal, true);
  check('Skipping the last effective original anchor is rejected without changing pose, draft or storage',
    await stored(lastOriginal, TRANSITION_STORAGE_KEY) === lastRaw && equal(frame.transitions.document, pendingLast.transitions.document) &&
    frame.transitions.state.dirty && !frame.transitions.state.currentSkipped && difference(frame.pose, pendingLast.pose) < 1e-7 &&
    equal(frame.status.camera, pendingLast.status.camera) && equal(frame.status.target, pendingLast.status.target));
  check('The last-anchor rejection is explained in the UI', /保留|有效|不能|无效|至少/.test(await lastOriginal.locator('#toast').textContent()));

  const lastBlueEdits = structuredClone(seedEdits);lastBlueEdits.skippedSteps = source.steps.map((_, index) => index);
  const lastBlue = await pageFor(lastBlueEdits);await mode(lastBlue, 'transition');frame = await chooseBlue(lastBlue);
  const lastBlueBefore = structuredClone(frame), lastBlueRaw = await stored(lastBlue, TRANSITION_STORAGE_KEY);
  await lastBlue.locator('#transition-skip-button').click();frame = await settle(lastBlue);
  check('Skipping the sole enabled blue K is rejected without deleting or rewriting it',
    await stored(lastBlue, TRANSITION_STORAGE_KEY) === lastBlueRaw && !point(frame).skipped &&
    equal(frame.transitions.document, lastBlueBefore.transitions.document) && difference(frame.pose, lastBlueBefore.pose) < 1e-7);
  // Click rather than uncheck(): a correct rejection immediately restores the
  // checked state, which Playwright's uncheck() itself would treat as failure.
  await (await reveal(lastBlue, '#transition-enabled')).click();frame = await settle(lastBlue);
  check('Disabling corrections when the sole anchor is blue is also rejected atomically',
    frame.transitions.document.enabled && await lastBlue.locator('#transition-enabled').isChecked() &&
    await stored(lastBlue, TRANSITION_STORAGE_KEY) === lastBlueRaw && difference(frame.pose, lastBlueBefore.pose) < 1e-7);
  await assertPreserved(lastBlue, 'Last-anchor rejection preserves original poses, personal bytes and guide settings');
  check('No JavaScript or console errors occurred in any isolated context', errors.length === 0, errors);
  check('Original source files remain byte-for-byte unchanged',
    await fs.readFile(sourcePath, 'utf8') === sourceBytes && await fs.readFile(originalExportPath, 'utf8') === exportBytes);
} catch (error) {
  failure = error.stack;
  const filename = path.join(output, 'frame-skip-ui-failure.png');
  await activePage?.screenshot({ path: filename }).then(() => screenshots.push(filename)).catch(() => {});
} finally {
  const report = { pass: !failure && errors.length === 0, passed: checks.filter(item => item.pass).length,
    total: checks.length, checks, errors, failure, screenshots,
    sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
    personalRawSha256: createHash('sha256').update(personalRaw).digest('hex'),
    scope: 'Isolated real Snow GLB browser checks: original/K skip and exact restore, both-side regeneration and distant-span preservation, automatic skipped-key display, K restores, paired 09 closure/wrapped trajectory, undo/reload/full import/export, disabled-correction behavior, dirty draft and personal/display preservation, atomic last-anchor refusal and mobile controls. No existing user browser profile or original asset is modified.' };
  const reportPath = path.join(output, 'frame-skip-ui-verification.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));await browser?.close();
  console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, errors, failure, report: reportPath, screenshots }, null, 2));
  if (!report.pass) process.exitCode = 1;
}
