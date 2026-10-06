import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createTransitionEdits, TRANSITION_STORAGE_KEY } from '../src/transition-edits.js';
import { OFFICIAL_LOOP_UPGRADE_MARKER_KEY } from '../src/official-poses.js';

// Same isolated seed, drawer, inspector and screenshot conventions as the
// transition/trajectory UI checks. This never opens the user's Chrome profile.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/playwright');
const sourceBytes = await fs.readFile(path.join(root, 'public/coach/flare-sequence.json'), 'utf8');
const exportBytes = await fs.readFile(path.join(root, '托马斯/16.json'), 'utf8');
const source = JSON.parse(sourceBytes), exported = JSON.parse(exportBytes);
const PERSONAL_KEY = 'flare-pose-library-v1', OFFICIAL_KEY = 'flare-demonstration-v1';
const personalRaw = '\n  ' + JSON.stringify({ ...structuredClone(exported),
  draft: structuredClone(exported.steps[11].pose), removed: [], extra: { preserve: true } }, null, 3) + '\n';
const officialRaw = '\n ' + JSON.stringify(source, null, 2) + '\n';
const edits = createTransitionEdits(source);
edits.interpolation = 'linear';
edits.points = [{ id: 'curve-ui-existing-K', segment: 2, at: .5,
  name: '保留已存 K', pose: structuredClone(source.steps[3].pose) }];
const base = process.env.FOOT_CURVE_TEST_URL || 'http://127.0.0.1:8810/?inspect=1';
const origin = new URL(base).origin;
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.USERPROFILE,
  '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const selectedCase = process.argv.find(arg => arg.startsWith('--case='))?.slice(7);
const checks = [], errors = [], screenshots = [], failures = [], builds = new Set();
let browser, activePage;
await fs.mkdir(output, { recursive: true });
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const curves = frame => frame.transitions.document.footCurves ?? [];
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
function check(name, pass, detail) {
  checks.push({ name, pass: Boolean(pass), ...(detail === undefined ? {} : { detail }) });
  assert.ok(pass, name);
}
const inspect = page => page.evaluate(() => ({
  transitions: window.flareInspector.transitions(), trajectory: window.flareInspector.trajectory(),
  status: window.flareInspector.status(), pose: window.flareInspector.capturePose(),
  formal: window.flareInspector.demonstration(), bones: window.flareInspector.boneRotations(),
}));
const stored = (page, key) => page.evaluate(key => localStorage.getItem(key), key);
const blur = page => page.evaluate(() => document.activeElement?.blur());
async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true' &&
    typeof window.flareInspector?.trajectory === 'function', null, { timeout: 45000 });
  builds.add(await page.evaluate(() => document.querySelector('script[type="module"]').src));
}
async function pageFor(document = edits, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport, acceptDownloads: true });
  const seed = { [PERSONAL_KEY]: personalRaw, [OFFICIAL_KEY]: officialRaw,
    [OFFICIAL_LOOP_UPGRADE_MARKER_KEY]: source.source.revision,
    [TRANSITION_STORAGE_KEY]: JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [document] }) };
  await context.addInitScript(({ origin, seed }) => {
    if (location.origin === origin && !localStorage.getItem('foot-curve-ui-seeded')) {
      for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
      localStorage.setItem('foot-curve-ui-seeded', '1');
    }
  }, { origin, seed });
  const page = await context.newPage();activePage = page;page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push({ type: 'pageerror', message: error.message }));
  page.on('console', message => { if (message.type() === 'error') errors.push({ type: 'console', message: message.text() }); });
  await page.goto(base);await ready(page);return page;
}
async function drawer(page, side, open) {
  const button = page.locator('#toggle-' + side);
  if (await button.getAttribute('aria-expanded') !== String(open)) await button.click();
}
async function reveal(page, selector) {
  await drawer(page, 'details', true);const field = page.locator(selector);
  if (!await field.isVisible()) await field.locator('xpath=ancestor::details[1]').locator('summary').click();
  return field;
}
async function mode(page, name) {
  await drawer(page, 'library', true);await page.locator(`[data-mode="${name}"]`).click();
}
async function settle(page) {
  await page.waitForFunction(() => {
    const state = window.flareInspector.trajectory();
    return Boolean(state.error) || !state.scheduled && (!state.preferences.enabled || state.data);
  });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const frame = await inspect(page);assert.equal(frame.trajectory.error, '');return frame;
}
async function seek(page, time) {
  await page.locator('#transition-global-scrub').evaluate((input, value) => {
    input.value = String(value);input.dispatchEvent(new Event('input', { bubbles: true }));
  }, time);
  await blur(page);return settle(page);
}
async function original(page, index) {
  await page.locator(`[data-transition-fixed="${index}"]`).click();await blur(page);return settle(page);
}
async function enterCurve(page, side) {
  await drawer(page, 'library', false);await drawer(page, 'details', true);
  await page.locator(`[data-foot-curve="${side}"]`).click();await blur(page);return settle(page);
}
async function setPosition(page, position) {
  await drawer(page, 'details', true);
  await page.evaluate(position => {
    for (let index = 0; index < 3; index++) document.querySelector('#transition-pos-' + index).value = String(position[index] * 100);
    document.querySelector('#transition-pos-0').dispatchEvent(new Event('change', { bubbles: true }));
  }, position);
  await blur(page);return settle(page);
}
async function offsetCurve(page, axis = 1, centimetres = 3) {
  const frame = await inspect(page), position = [...frame.status.editor.position];
  position[axis] += centimetres / 100;return setPosition(page, position);
}
async function screenshot(page, name) {
  const file = path.join(output, name);await page.screenshot({ path: file });screenshots.push(file);
}
async function preserved(page, name) {
  const frame = await inspect(page);
  check(name + ': original personal seventeen steps/draft and official raw bytes are unchanged',
    await stored(page, PERSONAL_KEY) === personalRaw && await stored(page, OFFICIAL_KEY) === officialRaw && equal(frame.formal, source));
}
async function axisPoint(page) {
  await drawer(page, 'library', false);await drawer(page, 'details', false);
  const rect = await page.locator('#scene').boundingBox();
  const point = await page.evaluate(() => flareInspector.projectHandle(flareInspector.status().editor.selected));
  assert.ok(point, 'Curve midpoint projects into the canvas');
  const center = { x: rect.x + point.x, y: rect.y + point.y };
  for (const radius of [20, 30, 40, 50, 65, 15]) for (const angle of [-Math.PI / 2, -.2, 0, .2, Math.PI / 2, Math.PI]) {
    const candidate = { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
    await page.mouse.move(candidate.x, candidate.y);
    const axis = (await inspect(page)).status.editor.axis;
    if (['X', 'Y', 'Z'].includes(axis)) return { ...candidate, axis, center };
  }
  throw new Error('No visible translation axis was hittable around the curve midpoint.');
}
async function pointerDrag(page, { distance = 32, cancel = false, noMove = false } = {}) {
  const point = await axisPoint(page);
  await page.mouse.down();
  await page.waitForFunction(() => window.flareInspector.status().editor.dragging);
  const start = await inspect(page);
  if (!noMove) await page.mouse.move(point.x + (point.axis === 'Y' ? 0 : distance),
    point.y + (point.axis === 'Y' ? -distance : 10), { steps: 6 });
  const during = await inspect(page);
  if (cancel) await page.keyboard.press('Escape');
  await page.mouse.up();await blur(page);
  return { point, start, during, end: await settle(page) };
}
async function download(page) {
  await drawer(page, 'details', true);
  const pending = page.waitForEvent('download');await page.locator('#transition-export').click();
  const file = await pending;return JSON.parse(await fs.readFile(await file.path(), 'utf8'));
}
async function importDocument(page, data) {
  await drawer(page, 'details', true);
  await page.locator('#transition-import-file').setInputFiles({ name: 'curve-verification.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await page.waitForFunction(() => document.querySelector('#transition-import-file').value === '');
  return settle(page);
}

async function mainCase() {
  const page = await pageFor();await mode(page, 'transition');await seek(page, .3);
  const initial = await inspect(page), entered = await enterCurve(page, 'left');
  check('Entering at an interior time selects one nonrotatable midpoint and moves to the adjacent span midpoint',
    entered.status.editor.target === 'footCurve' && entered.status.editor.handles.length === 1 &&
    entered.status.editor.selected === 'leftFootCurve' && !entered.status.editor.canRotate &&
    entered.transitions.state.time === .5 && entered.transitions.state.curveEditing.span.startTime === 0 && entered.transitions.state.curveEditing.span.endTime === 1);
  const noMove = await pointerDrag(page, { noMove: true });
  check('A real no-op gizmo gesture creates no saved curve or K', curves(noMove.end).length === 0 && equal(noMove.end.transitions.document.points, edits.points));
  const cancelled = await pointerDrag(page, { cancel: true });
  check('Escape during a real drag restores the bend, saves nothing, and retains curve edit mode',
    difference(cancelled.start.transitions.state.curveEditing.curve.bend, cancelled.end.transitions.state.curveEditing.curve.bend) < 1e-12 &&
    curves(cancelled.end).length === 0 && cancelled.end.status.editor.target === 'footCurve');
  const gesture = await pointerDrag(page);
  check('A real axis drag previews a changed bend without writing a curve before mouseup',
    difference(gesture.start.transitions.state.curveEditing.curve.bend, gesture.during.transitions.state.curveEditing.curve.bend) > 1e-4 && curves(gesture.during).length === 0,
    { axis: gesture.point.axis, changedBend: gesture.during.transitions.state.curveEditing.curve.bend });
  check('Mouseup saves only the foot curve and preserves all original/K anchors', curves(gesture.end).length === 1 &&
    equal(gesture.end.transitions.document.points, initial.transitions.document.points) && equal(gesture.end.formal, initial.formal));
  const first = structuredClone(curves(gesture.end)[0]), committed = await offsetCurve(page, 2, 1);
  check('Numeric midpoint edits update the same curve id without creating K frames', curves(committed).length === 1 &&
    curves(committed)[0].id === first.id && difference(curves(committed)[0].bend, first.bend) > .009 && equal(committed.transitions.document.points, edits.points));
  await page.keyboard.press('k');const keyed = await settle(page);
  check('K in curve mode saves the route without modifying original frames or creating a pose K', equal(curves(keyed), curves(committed)) && equal(keyed.transitions.document.points, edits.points) && equal(keyed.formal, source));
  await drawer(page, 'details', true);await screenshot(page, 'foot-curve-editor-desktop.png');
  const backup = await download(page);
  check('Animation JSON contains the complete curve schema and unchanged original sequence', equal(backup.footCurves, curves(keyed)) && equal(backup.sequence, source));
  await page.locator('#transition-curve-reset').click();const reset = await settle(page);
  check('Reset removes the route and restores the eleven pose handles', curves(reset).length === 0 && reset.status.editor.target === 'pose' && reset.status.editor.handles.length === 11);
  await page.locator('#transition-undo-document').click();const undone = await settle(page);
  check('Animation undo restores the route without losing saved K poses', equal(curves(undone), backup.footCurves) && equal(undone.transitions.document.points, edits.points));
  await enterCurve(page, 'left');const altered = await offsetCurve(page, 0, 1);
  check('Import fixture contains a materially different saved bend before restore', difference(curves(altered)[0].bend, backup.footCurves[0].bend) > .009);
  await page.locator('#transition-curve-return').click();
  const imported = await importDocument(page, backup);
  check('Import restores exact route metadata and anchors', equal(curves(imported), backup.footCurves) && equal(imported.transitions.document.points, backup.points));
  const invalid = structuredClone(backup);invalid.footCurves.push(structuredClone(invalid.footCurves[0]));
  const beforeInvalid = await stored(page, TRANSITION_STORAGE_KEY);await importDocument(page, invalid);
  check('Invalid duplicate-curve import is rejected without changing storage or originals', await stored(page, TRANSITION_STORAGE_KEY) === beforeInvalid && equal((await inspect(page)).formal, source));
  await page.reload();await ready(page);await mode(page, 'transition');await seek(page, .5);
  const refreshed = await inspect(page);
  check('Refresh restores saved routes and exposes fitted targets on the actual trajectory', equal(curves(refreshed), backup.footCurves) && refreshed.trajectory.data.frames.some(frame => frame.curveTargets?.left));
  await original(page, 1);await page.locator('#transition-skip-button').click();await seek(page, .5);
  const skipped = await inspect(page);
  check('Skipping a route endpoint retains inactive curve metadata and rebuilds across enabled anchors', equal(curves(skipped), backup.footCurves) &&
    skipped.transitions.document.skippedSteps.includes(1) && !skipped.trajectory.data.frames.some(frame => frame.curveTargets?.left));
  await original(page, 1);await page.locator('#transition-skip-button').click();const restored = await seek(page, .5);
  check('Restoring the endpoint reactivates the exact stored curve', equal(curves(restored), backup.footCurves) && restored.trajectory.data.frames.some(frame => frame.curveTargets?.left));
  await page.keyboard.press('k');const split = await settle(page), newK = split.transitions.document.points.find(point => point.id !== edits.points[0].id);
  check('Adding a pose K splits adjacency while retaining the old route as inactive', Boolean(newK) && equal(curves(split), backup.footCurves) && !split.trajectory.data.frames.some(frame => frame.curveTargets?.left));
  await page.locator('#transition-skip-button').click();const skippedK = await settle(page);
  check('Skipping the new K rejoins and reactivates the old route without deleting either', skippedK.transitions.document.points.some(point => point.id === newK.id && point.skipped) &&
    equal(curves(skippedK), backup.footCurves) && skippedK.trajectory.data.frames.some(frame => frame.curveTargets?.left));
  await drawer(page, 'library', true);await page.locator(`[data-transition-remove="${newK.id}"]`).click();await settle(page);
  await reveal(page, '#transition-enabled');await page.locator('#transition-enabled').uncheck();const disabled = await settle(page);
  check('Disabling corrections preserves routes, stops their application and disables curve entry', equal(curves(disabled), backup.footCurves) &&
    !disabled.trajectory.data.frames.some(frame => frame.curveTargets) && await page.locator('[data-foot-curve="left"]').isDisabled() && await page.locator('[data-foot-curve="right"]').isDisabled());
  await page.locator('#transition-enabled').check();await settle(page);await enterCurve(page, 'right');const constrained = await offsetCurve(page, 1, 200);
  check('Unreachable self-drawn targets retain actual solid paths and show a faint planned-path comparison',
    constrained.trajectory.curveDeviation > .001 && constrained.trajectory.plannedPathCount > 0 && constrained.trajectory.data.frames.some(frame => frame.curveTargets?.right),
    { deviation: constrained.trajectory.curveDeviation, plannedPaths: constrained.trajectory.plannedPathCount });
  await screenshot(page, 'foot-curve-constrained-desktop.png');await blur(page);await page.keyboard.press('Escape');const exit = await settle(page);
  check('Escape outside a drag restores ordinary pose editing with eleven handles', exit.status.editor.target === 'pose' && exit.status.editor.handles.length === 11 && !exit.transitions.state.curveEditing);
  await preserved(page, 'Desktop route workflows');
}

async function draftCase() {
  const page = await pageFor();await mode(page, 'transition');await seek(page, .25);await drawer(page, 'details', true);
  await page.locator('#transition-handle').selectOption('leftKnee');const position = (await inspect(page)).status.editor.position;
  await setPosition(page, position.map((value, index) => value + (index === 0 ? .02 : 0)));const before = await inspect(page);
  check('Pose adjustment is dirty and captured in a separate pose draft', before.transitions.state.dirty && before.transitions.document.draft?.pose.version === 1);
  await enterCurve(page, 'left');const changed = await offsetCurve(page);
  check('Entering and saving a curve preserves the complete prior pose draft', equal(changed.transitions.document.draft, before.transitions.document.draft) && equal(changed.transitions.document.points, edits.points));
  await page.locator('#transition-curve-return').click();await drawer(page, 'library', true);await page.locator('#transition-return-draft').click();const returned = await settle(page);
  check('Returning to the draft restores the actual edited pose and normal handles', returned.transitions.state.dirty && returned.status.editor.target === 'pose' &&
    difference(returned.pose, before.pose) < 1e-9 && equal(returned.transitions.document.draft, before.transitions.document.draft));
  await preserved(page, 'Draft recovery');
}

async function wrapCase() {
  const document = structuredClone(edits);document.skippedSteps = [0, 8];
  const page = await pageFor(document);await mode(page, 'transition');await seek(page, .2);const entered = await enterCurve(page, 'right');
  check('Skipped closure uses the actual last-to-first enabled pair across the cycle boundary', entered.transitions.state.curveEditing.span.from.id === source.steps[7].id &&
    entered.transitions.state.curveEditing.span.to.id === source.steps[1].id && entered.transitions.state.curveEditing.span.endTime - entered.transitions.state.curveEditing.span.startTime === 3);
  await offsetCurve(page, 1, 2);await page.locator('#transition-preview-scope').selectOption('segment');await page.locator('#transition-global-speed').selectOption('1');
  await page.locator('#transition-global-play').click();
  await page.waitForFunction(() => { const state = flareInspector.transitions().state;return state.previewing && state.time > 8.1; });
  const tail = await inspect(page);
  check('Current curve-span preview traverses 8–9 seconds with the rig following the unwrapped clock', tail.transitions.state.time > 8 &&
    Math.abs(tail.status.motion.time - tail.transitions.state.time % 9) < 1e-9 && !tail.status.editor.enabled);
  await page.locator('#transition-global-play').click();await page.locator('#transition-preview-scope').selectOption('loop');await page.locator('#transition-global-play').click();
  await page.waitForFunction(() => { const state = flareInspector.transitions().state;return state.previewing && state.time > 8.1; }, null, { timeout: 20000 });
  const loop = await inspect(page);
  check('Full-loop preview also traverses the tail while keeping saved routes and pose editor disabled', loop.transitions.state.time > 8 && curves(loop).length === 1 && !loop.status.editor.enabled);
  await page.locator('#transition-global-play').click();await mode(page, 'motion');const exit = await inspect(page);
  check('Leaving animation editing returns the editor target to the real rig and clears guide geometry', exit.status.editor.target === 'pose' && exit.status.editor.handles.length === 11 && !exit.trajectory.data);
  await preserved(page, 'Wrap preview');
}

async function storageCase() {
  const page = await pageFor();await mode(page, 'transition');await seek(page, .3);const originalRaw = await stored(page, TRANSITION_STORAGE_KEY);
  await page.evaluate(key => {
    const set = Storage.prototype.setItem;
    window.footCurveRejectWrites = true;
    Storage.prototype.setItem = function(name, value) {
      if (name === key && window.footCurveRejectWrites) throw new DOMException('Injected verification quota failure', 'QuotaExceededError');
      return set.call(this, name, value);
    };
  }, TRANSITION_STORAGE_KEY);
  await enterCurve(page, 'left');const changed = await offsetCurve(page, 1, 2);
  check('Storage refusal keeps the in-memory curve and original on-disk storage without writing K or source', curves(changed).length === 1 &&
    await stored(page, TRANSITION_STORAGE_KEY) === originalRaw && equal(changed.transitions.document.points, edits.points) && equal(changed.formal, source));
  check('Storage refusal is visible as an export/retry message', /保存失败|保存不可用|导出/.test(await page.locator('#toast').textContent()));
  const backup = await download(page);check('The failed-to-persist curve remains recoverable by animation export', equal(backup.footCurves, curves(changed)));
  await page.evaluate(() => { window.footCurveRejectWrites = false; });await blur(page);await page.keyboard.press('k');const retried = await settle(page);
  check('K retries route persistence without making a pose K', (await stored(page, TRANSITION_STORAGE_KEY)).includes(curves(retried)[0].id) && equal(retried.transitions.document.points, edits.points));
  await preserved(page, 'Storage refusal/retry');
}

async function mobileCase() {
  const page = await pageFor(edits, { width: 430, height: 900 });await mode(page, 'transition');await drawer(page, 'library', false);await drawer(page, 'details', true);
  await seek(page, .3);await enterCurve(page, 'right');await page.locator('#transition-pos-1').scrollIntoViewIfNeeded();
  const field = page.locator('#transition-pos-1');await field.fill(String(Number(await field.inputValue()) + 3));await field.press('Tab');await blur(page);const changed = await settle(page);
  check('Mobile curve controls accept a midpoint adjustment without creating K or changing originals', curves(changed).length === 1 && changed.status.editor.target === 'footCurve' &&
    equal(changed.transitions.document.points, edits.points) && equal(changed.formal, source));
  await screenshot(page, 'foot-curve-editor-mobile.png');await page.locator('#transition-curve-return').scrollIntoViewIfNeeded();await page.locator('#transition-curve-return').click();const returned = await settle(page);
  check('Mobile return button restores all ordinary pose handles', returned.status.editor.target === 'pose' && returned.status.editor.handles.length === 11);
  await preserved(page, 'Mobile midpoint editing');
}

const cases = { main: mainCase, draft: draftCase, wrap: wrapCase, storage: storageCase, mobile: mobileCase };
try {
  if (selectedCase && !cases[selectedCase]) throw new Error('Unknown --case; use main, draft, wrap, storage, or mobile.');
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  for (const [name, run] of Object.entries(cases)) {
    if (selectedCase && name !== selectedCase) continue;
    try { await run(); }
    catch (error) {
      failures.push({ case: name, message: error.message, stack: error.stack,
        state: activePage ? await inspect(activePage).catch(() => null) : null });
      if (activePage) await screenshot(activePage, `foot-curve-ui-${name}-failure.png`).catch(() => {});
    } finally { if (activePage) await activePage.context().close();activePage = null; }
  }
  check('Original source asset and seventeen-step export files are byte-for-byte preserved',
    await fs.readFile(path.join(root, 'public/coach/flare-sequence.json'), 'utf8') === sourceBytes &&
    await fs.readFile(path.join(root, '托马斯/16.json'), 'utf8') === exportBytes);
  check('No browser JavaScript or console errors', errors.length === 0, errors);
} catch (error) { failures.push({ case: 'runner', message: error.message, stack: error.stack }); }
finally {
  await browser?.close();
  const report = { scope: selectedCase ?? 'main/draft/wrap/storage/mobile', builds: [...builds],
    pass: failures.length === 0 && checks.every(check => check.pass), checks, failures, errors, screenshots };
  const file = path.join(output, `foot-curve-ui${selectedCase ? '-' + selectedCase : ''}-verification.json`);
  await fs.writeFile(file, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pass: report.pass, checks: checks.filter(check => check.pass).length,
    total: checks.length, failures: failures.map(({ case: name, message }) => ({ case: name, message })), report: file, screenshots }, null, 2));
  if (!report.pass) process.exitCode = 1;
}
