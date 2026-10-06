import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { createTransitionEdits, TRANSITION_STORAGE_KEY } from '../src/transition-edits.js';
import { createFlareSequence } from '../src/flare-sequence.js';
import { OFFICIAL_LOOP_UPGRADE_MARKER_KEY } from '../src/official-poses.js';
import { TRAJECTORY_JOINTS } from '../src/trajectory-guide.js';

// Each case uses a fresh context in an independent Chrome. Never attach to the
// user's browser, import their storage or write the canonical source assets.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/playwright');
const sourcePath = path.join(root, 'public/coach/flare-sequence.json');
const personalPath = path.join(root, '托马斯/16.json');
const sourceBytes = await fs.readFile(sourcePath, 'utf8');
const personalBytes = await fs.readFile(personalPath, 'utf8');
const source = JSON.parse(sourceBytes), originalPersonal = JSON.parse(personalBytes);
const PERSONAL = 'flare-pose-library-v1', OFFICIAL = 'flare-demonstration-v1';
const BACKUP = 'flare-demonstration-backup-v1';
const personalRaw = '\n  ' + JSON.stringify({ ...originalPersonal,
  draft: structuredClone(originalPersonal.steps[11].pose),
  extra: { preserveRaw: true }, removed: [] }, null, 3) + '\n';
const officialRaw = '\n ' + JSON.stringify(source, null, 2) + '\n';
const baseline = createFlareSequence(source.steps, { period: source.period });
const seedEdits = createTransitionEdits(source);
seedEdits.interpolation = 'linear';
seedEdits.points = [.4, 1.5].map((time, index) => ({
  id: `trajectory-pose-K-${index}`, name: `已有 K ${time.toFixed(2)}`,
  segment: Math.floor(time), at: time % 1, pose: baseline.sample(time),
}));
seedEdits.draft = { segment: 3, at: .37, name: '保留旧姿态草稿', pose: baseline.sample(3.37) };
const transitionRaw = '\n' + JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [seedEdits] }, null, 2) + '\n';
const base = process.env.TRAJECTORY_POSE_TEST_URL || 'http://127.0.0.1:8810/?inspect=1';
const origin = new URL(base).origin;
const require = createRequire(import.meta.url);
const runtime = path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = require(path.join(runtime, 'playwright'));
const checks = [], errors = [], cases = [], screenshots = [], measurements = {};
const wantedCase = process.argv.find(arg => arg.startsWith('--case='))?.slice(7);
const caseNames = wantedCase ? wantedCase.split(',') : ['main', 'k', 'wrap', 'mobile'];
assert.ok(caseNames.every(name => ['main', 'k', 'wrap', 'mobile'].includes(name)), 'Unknown --case');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const key = (kind, id) => JSON.stringify([kind, id]);
const stepKey = index => key('step', source.steps[index].id);
const pointKey = index => key('point', seedEdits.points[index].id);
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));
function difference(a, b) {
  if (typeof a === 'number' || typeof b === 'number') return typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) : Infinity;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Object.keys(a).length !== Object.keys(b).length) return Infinity;
    return Math.max(0, ...Object.keys(a).map(name => difference(a[name], b[name])));
  }
  return a === b ? 0 : Infinity;
}
function check(name, condition, detail) {
  checks.push({ case: currentCase, name, pass: Boolean(condition), ...(detail === undefined ? {} : { detail }) });
  assert.ok(condition, name);
}
const inspect = page => page.evaluate(() => ({
  status: window.flareInspector.status(), metrics: window.flareInspector.rigMetrics(),
  pose: window.flareInspector.capturePose(), trajectory: window.flareInspector.trajectory(),
  formal: window.flareInspector.demonstration(), transitions: window.flareInspector.transitions(),
  bones: window.flareInspector.boneRotations(), personal: window.flareInspector.poseLibrary(),
}));
const stored = (page, name) => page.evaluate(name => localStorage.getItem(name), name);
const blur = page => page.evaluate(() => document.activeElement?.blur());
const paint = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
let browser, activePage, currentCase, failure;
await fs.mkdir(output, { recursive: true });

async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.ready === 'true' &&
    typeof window.flareInspector?.projectTrajectoryPoint === 'function', null, { timeout: 45000 });
}
async function pageFor(mobile = false) {
  const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
    hasTouch: mobile, acceptDownloads: true });
  await context.addInitScript(({ origin, seed }) => {
    if (location.origin === origin && !localStorage.getItem('trajectory-pose-ui-seeded')) {
      for (const [name, value] of Object.entries(seed)) localStorage.setItem(name, value);
      localStorage.setItem('trajectory-pose-ui-seeded', '1');
    }
  }, { origin, seed: { [PERSONAL]: personalRaw, [OFFICIAL]: officialRaw,
    [TRANSITION_STORAGE_KEY]: transitionRaw, [OFFICIAL_LOOP_UPGRADE_MARKER_KEY]: source.source.revision } });
  const page = await context.newPage();activePage = page;page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push({ case: currentCase, type: 'pageerror', message: error.message }));
  page.on('console', message => { if (message.type() === 'error') errors.push({ case: currentCase, type: 'console', message: message.text() }); });
  await page.goto(base);await ready(page);
  const build = await page.locator('script[src]').evaluateAll(elements => elements.map(element => new URL(element.src).pathname.split('/').at(-1)));
  cases.push({ name: currentCase, build, mobile });
  console.log(JSON.stringify({ case: currentCase, build }));
  await mode(page);await drawer(page, 'library', false);await drawer(page, 'details', true);
  await settle(page);return page;
}
async function drawer(page, side, open) {
  const button = page.locator('#toggle-' + side);
  if (await button.getAttribute('aria-expanded') !== String(open)) await button.click();
  await paint(page);
}
async function mode(page) {
  await drawer(page, 'library', true);await page.locator('button[data-mode="transition"]').click();
}
async function settle(page) {
  await page.waitForFunction(() => {
    const state = window.flareInspector.trajectory();
    return !state.scheduled && (state.error || state.data || !state.preferences.enabled);
  });
  await paint(page);const frame = await inspect(page);assert.equal(frame.trajectory.error, '');return frame;
}
async function seek(page, time) {
  await page.locator('#transition-global-scrub').evaluate((input, value) => {
    input.value = String(value);input.dispatchEvent(new Event('input', { bubbles: true }));
  }, time);
  await blur(page);return settle(page);
}
async function range(page, from, to) {
  await drawer(page, 'details', true);
  // Select the end first to avoid a transient equal-start selection.
  await page.locator('#trajectory-to').selectOption(to);await page.locator('#trajectory-from').selectOption(from);
  return settle(page);
}
async function focus(page, joint) {
  await drawer(page, 'details', true);await page.locator('#trajectory-allJoints').check();
  await page.locator('#trajectory-joint').selectOption(joint);return settle(page);
}
async function clickPoint(page, joint, time) {
  await focus(page, joint);await drawer(page, 'details', false);await paint(page);
  const projected = await page.evaluate(({ joint, time }) => window.flareInspector.projectTrajectoryPoint(joint, time), { joint, time });
  const rect = await page.locator('#scene canvas').boundingBox();
  assert.ok(projected && projected.x >= 0 && projected.x <= rect.width && projected.y >= 0 && projected.y <= rect.height, 'Sample projects inside canvas');
  await page.mouse.click(rect.x + projected.x, rect.y + projected.y);await settle(page);
  await drawer(page, 'details', true);return { projected, frame: await settle(page) };
}
async function begin(page, anchor) {
  await drawer(page, 'details', true);await page.locator('#trajectory-pose-frame').selectOption(anchor);
  await page.locator('#trajectory-pose-begin').click();return settle(page);
}
async function numeric(page, axis, delta) {
  await drawer(page, 'details', true);
  const field = page.locator('#transition-pos-' + axis);
  await field.fill(String(Number(await field.inputValue()) + delta));await field.press('Tab');await blur(page);return settle(page);
}
async function cancel(page) {
  await blur(page);await page.keyboard.press('Escape');return settle(page);
}
async function saveK(page) {
  await blur(page);await page.keyboard.press('k');return settle(page);
}
async function capture(page, name) {
  await paint(page);const filename = path.join(output, `trajectory-pose-${name}.png`);
  await page.screenshot({ path: filename });screenshots.push(filename);
}
async function preserveRaw(page, label, official = true, edits = true) {
  check(label, await stored(page, PERSONAL) === personalRaw && (!official || await stored(page, OFFICIAL) === officialRaw) &&
    (!edits || await stored(page, TRANSITION_STORAGE_KEY) === transitionRaw));
}
function assertRig(frame) {
  for (const [name, length] of Object.entries(frame.metrics.segmentLengths)) {
    assert.ok(Math.abs(length - frame.metrics.expectedLengths[name]) < 1e-7, `${name}: fixed bone length`);
  }
  for (const position of Object.values(frame.metrics.joints)) assert.ok(position.every(Number.isFinite));
  if (frame.pose.groundLock) assert.ok(frame.metrics.minFootHeight >= .006 - 1e-6, 'Foot passed through ground');
}
function pathFrame(data, time) { return data.frames.find(sample => Math.abs(sample.time - time) <= 1e-8); }
function actualMatches(frame) {
  const sample = pathFrame(frame.trajectory.data, frame.transitions.state.poseTrajectoryEditing?.time ?? frame.status.time);
  return Boolean(sample) && Math.max(...TRAJECTORY_JOINTS.map(({ joint }) => distance(sample.joints[joint], frame.metrics.joints[joint]))) < 1e-7;
}
async function dragY(page) {
  await drawer(page, 'details', false);await paint(page);
  const rect = await page.locator('#scene canvas').boundingBox();
  const handle = await page.evaluate(() => window.flareInspector.projectHandle('trajectoryPosePoint'));
  let start;
  for (const offset of [18, 24, 30, 38, 46, 54, 62]) {
    await page.mouse.move(rect.x + handle.x, rect.y + handle.y - offset);await paint(page);
    if ((await inspect(page)).status.editor.axis === 'Y') { start = { x: rect.x + handle.x, y: rect.y + handle.y - offset };break; }
  }
  assert.ok(start, 'Trajectory Y axis is pickable');const before = await inspect(page);
  await page.mouse.down();assert.equal((await inspect(page)).status.editor.dragging, true);
  await page.mouse.move(start.x, start.y - 12, { steps: 4 });await page.mouse.up();
  const after = await settle(page);await drawer(page, 'details', true);return { before, after };
}
async function samplePreview(page, scope, count = 12) {
  await page.locator('#transition-preview-scope').selectOption(scope);
  await page.locator('#transition-global-speed').selectOption('1');await page.locator('#transition-global-play').click();
  const clocks = [];
  for (let index = 0; index < count; index++) { await page.waitForTimeout(120);clocks.push((await inspect(page)).transitions.state.time); }
  await page.locator('#transition-global-play').click();await settle(page);return clocks;
}

async function mainCase() {
  const page = await pageFor();let frame = await range(page, stepKey(0), stepKey(1));
  check('09 to 10 can be selected as an explicit observation window', frame.trajectory.data.startTime === 0 &&
    frame.trajectory.data.endTime === 1 && pathFrame(frame.trajectory.data, .4));
  frame = await range(page, stepKey(0), stepKey(2));
  check('09 to 11 retains intermediate original 10 and authored K samples', frame.trajectory.data.startTime === 0 &&
    frame.trajectory.data.endTime === 2 && [0, .4, 1, 1.5, 2].every(time => pathFrame(frame.trajectory.data, time)) &&
    frame.transitions.document.points.length === 2);
  await focus(page, 'all');frame = await seek(page, 1);
  check('All 21 actual coordinate channels match the displayed real rig at original 10', frame.trajectory.jointIds.length === 21 &&
    Object.keys(pathFrame(frame.trajectory.data, 1).joints).length === 21 && actualMatches(frame));
  check('Reference labels identify waist, palm and toe correctly', (await page.locator('#trajectory-joint').textContent()).includes('脚尖参考点') &&
    (await page.locator('#trajectory-joint').textContent()).includes('手掌接触点') && (await page.locator('#trajectory-joint').textContent()).includes('腰部控制点'));
  await preserveRaw(page, 'Observation and range changes preserve exact original storage bytes');
  const clocks = await samplePreview(page, 'segment');
  check('Selected-range preview traverses beyond the first segment while staying within 0 to 2', clocks.every(time => time >= 0 && time < 2) && Math.max(...clocks) > 1, { clocks });
  const loop = await samplePreview(page, 'loop', 22);
  check('Full loop preview is independent of the selected inspection range', loop.every(time => time >= 0 && time < 9) && Math.max(...loop) > 2, { clocks: loop });
  const clicked = await clickPoint(page, 'leftAnkle', .25);frame = clicked.frame;
  check('A real trajectory pixel click locates its actual sample time', frame.transitions.state.trajectoryProbe?.joint === 'leftAnkle' &&
    Math.abs(frame.transitions.state.trajectoryProbe.time - clicked.projected.time) < 1e-8 && Math.abs(frame.status.time - clicked.projected.time) < 1e-8);
  const before = structuredClone(frame), baselineData = structuredClone(frame.trajectory.data);
  frame = await begin(page, stepKey(0));
  check('Inverse editing binds the clicked sample and existing 09 anchor', frame.status.editor.target === 'trajectoryPose' &&
    frame.transitions.state.poseTrajectoryEditing.anchor.id === source.steps[0].id && frame.transitions.state.poseTrajectoryEditing.time === clicked.projected.time);
  const drag = await dragY(page);frame = drag.after;
  check('Actual pixel Y drag previews a real pose correction without orbiting', frame.transitions.state.poseTrajectoryEditing.pending &&
    distance(frame.metrics.joints.leftAnkle, drag.before.metrics.joints.leftAnkle) > 1e-5 && difference(frame.status.camera, drag.before.status.camera) < 1e-8,
  { moved: distance(frame.metrics.joints.leftAnkle, drag.before.metrics.joints.leftAnkle), error: frame.transitions.state.poseTrajectoryEditing.error,
    cameraBefore: drag.before.status.camera, cameraAfter: frame.status.camera, targetBefore: drag.before.status.target, targetAfter: frame.status.target });
  assertRig(frame);check('Candidate trajectory samples match the actual posed rig', actualMatches(frame));
  check('Inverse preview has gray saved-animation baseline', frame.trajectory.baselinePathCount > 0 &&
    difference(frame.trajectory.data.baselineFrames, baselineData.frames) < 1e-7 && frame.trajectory.pending);
  const previewJoints = structuredClone(frame.metrics.joints);
  await page.locator('#trajectory-baseline').uncheck();frame = await settle(page);
  check('Original-route comparison can be hidden without changing candidate pose or trajectory', frame.trajectory.baselinePathCount === 0 &&
    Boolean(frame.trajectory.data.baselineFrames) && difference(frame.metrics.joints, previewJoints) < 1e-7);
  await page.locator('#trajectory-baseline').check();frame = await settle(page);
  check('Original-route comparison restores gray baseline for the selected joint', frame.trajectory.baselinePathCount > 0 &&
    difference(frame.metrics.joints, previewJoints) < 1e-7);
  check('Inverse preview leaves source, saved Ks and old pose draft untouched', equal(frame.formal, before.formal) &&
    equal(frame.transitions.document, before.transitions.document));await preserveRaw(page, 'Drag and mouse release do not write animation storage');
  await capture(page, 'inverse-drag-preview');
  await blur(page);await page.keyboard.press('Control+z');frame = await settle(page);
  check('Ctrl Z removes only the inverse preview', !frame.transitions.state.poseTrajectoryEditing.pending &&
    !frame.trajectory.data.baselineFrames && difference(frame.metrics.joints, before.metrics.joints) < 1e-7);
  frame = await numeric(page, 1, 2);
  check('Centimetre input generates a new reversible correction preview', frame.transitions.state.poseTrajectoryEditing.pending &&
    frame.transitions.state.poseTrajectoryEditing.error < frame.transitions.state.poseTrajectoryEditing.initialError && actualMatches(frame));
  frame = await cancel(page);
  check('Escape cancels the preview and restores saved rig and pose editor', !frame.transitions.state.poseTrajectoryEditing && frame.status.editor.target === 'pose' &&
    difference(frame.metrics.joints, before.metrics.joints) < 1e-7);await preserveRaw(page, 'Numeric preview and cancellation preserve exact storage');
  await begin(page, stepKey(0));frame = await numeric(page, 1, 2000);
  const unreachable = frame.transitions.state.poseTrajectoryEditing;
  check('Unreachable target reports measured remaining distance', unreachable.error > 1 &&
    Math.abs(distance(unreachable.goal, unreachable.position) - unreachable.error) < 1e-7 &&
    (await page.locator('#trajectory-pose-note').textContent()).includes((unreachable.error * 100).toFixed(1) + ' cm'), { error: unreachable.error });
  assertRig(frame);await cancel(page);await preserveRaw(page, 'Unreachable trial cannot write library storage');
  await begin(page, stepKey(0));frame = await numeric(page, 1, 2);const candidate = structuredClone(frame);
  assert.ok(candidate.transitions.state.poseTrajectoryEditing.pending);frame = await saveK(page);
  const savedFormal = structuredClone(frame.formal), savedDocument = structuredClone(frame.transitions.document), savedData = structuredClone(frame.trajectory.data);
  check('K applies the preview to an existing original frame and exits inverse mode', !frame.transitions.state.poseTrajectoryEditing && frame.status.editor.target === 'pose' &&
    frame.formal.steps.length === source.steps.length && frame.transitions.document.points.length === seedEdits.points.length);
  check('Updating original 09 synchronizes both loop endpoints and preserves every other frame', equal(frame.formal.steps[0].pose, frame.formal.steps[8].pose) &&
    !equal(frame.formal.steps[0].pose, source.steps[0].pose) && source.steps.slice(1, 8).every((step, index) => equal(step, frame.formal.steps[index + 1])));
  check('Saved Ks, transition draft and personal raw 17 frame library are preserved', equal(frame.transitions.document.points, seedEdits.points) &&
    equal(frame.transitions.document.draft, seedEdits.draft) && await stored(page, PERSONAL) === personalRaw && JSON.parse(await stored(page, PERSONAL)).steps.length === 17);
  check('Saved actual result equals candidate preview and removes gray baseline', difference(frame.metrics.joints, candidate.metrics.joints) < 1e-7 &&
    !frame.trajectory.data.baselineFrames && frame.trajectory.baselinePathCount === 0);
  check('Original update creates an exact prior-animation backup', await stored(page, BACKUP) === officialRaw);
  const downloadReady = page.waitForEvent('download');await page.locator('#transition-export').click();
  const item = await downloadReady, exportFile = path.join(output, 'trajectory-pose-animation-backup.json');await item.saveAs(exportFile);
  const exported = JSON.parse(await fs.readFile(exportFile, 'utf8'));
  check('Backup contains corrected originals, existing Ks and preserved old draft', equal(exported.sequence, savedFormal) &&
    equal(exported.points, savedDocument.points) && equal(exported.draft, seedEdits.draft));
  await page.reload();await ready(page);await mode(page);await drawer(page, 'library', false);await range(page, stepKey(0), stepKey(2));frame = await seek(page, clicked.projected.time);
  check('Reload binds persisted source and transition edits to the same actual playback', equal(frame.formal, savedFormal) && equal(frame.transitions.document, savedDocument) &&
    difference(frame.trajectory.data.frames, savedData.frames) < 1e-7 && await stored(page, PERSONAL) === personalRaw);
  await page.locator('#transition-undo-document').click();frame = await settle(page);
  check('Animation undo after reload restores original endpoint poses', equal(frame.formal.steps, source.steps) && await stored(page, PERSONAL) === personalRaw);
  await page.locator('#transition-import-file').setInputFiles(exportFile);frame = await settle(page);
  check('Import restores the concrete corrected animation backup', equal(frame.formal, savedFormal) && equal(frame.transitions.document.points, savedDocument.points) &&
    equal(frame.transitions.document.draft, seedEdits.draft) && await stored(page, PERSONAL) === personalRaw);
  await capture(page, 'saved-and-restored');await page.context().close();
}

async function kCase() {
  const page = await pageFor();await range(page, stepKey(0), stepKey(2));
  const clicked = await clickPoint(page, 'leftAnkle', .4), before = clicked.frame;
  let frame = await begin(page, pointKey(0));frame = await numeric(page, 1, 2);const preview = structuredClone(frame);
  check('Inverse K preview targets the existing blue point ID', frame.transitions.state.poseTrajectoryEditing.anchor.kind === 'point' &&
    frame.transitions.state.poseTrajectoryEditing.anchor.id === seedEdits.points[0].id && frame.transitions.state.poseTrajectoryEditing.pending);
  check('K preview baseline and real joints are consistent', frame.trajectory.baselinePathCount > 0 && actualMatches(frame));
  await preserveRaw(page, 'Blue K preview keeps raw storage and old originals unchanged');
  frame = await saveK(page);
  check('Applying blue K updates its pose without adding or retiming a point', frame.transitions.document.points.length === seedEdits.points.length &&
    frame.transitions.document.points[0].id === seedEdits.points[0].id && frame.transitions.document.points[0].segment === 0 && frame.transitions.document.points[0].at === .4 &&
    !equal(frame.transitions.document.points[0].pose, seedEdits.points[0].pose) && equal(frame.transitions.document.points[1], seedEdits.points[1]));
  check('Blue K correction preserves every original and both old drafts', equal(frame.formal, source) && equal(frame.transitions.document.draft, seedEdits.draft) &&
    await stored(page, OFFICIAL) === officialRaw && await stored(page, PERSONAL) === personalRaw);
  check('Both neighboring intervals are regenerated from the updated K', distance(pathFrame(before.trajectory.data, .25).joints.leftAnkle,
    pathFrame(frame.trajectory.data, .25).joints.leftAnkle) > 1e-6 && distance(pathFrame(before.trajectory.data, .75).joints.leftAnkle,
    pathFrame(frame.trajectory.data, .75).joints.leftAnkle) > 1e-6);
  check('Saved K actual pose matches inverse preview', difference(frame.metrics.joints, preview.metrics.joints) < 1e-7);assertRig(frame);
  const saved = structuredClone(frame.transitions.document);
  await page.reload();await ready(page);await mode(page);await drawer(page, 'library', false);await range(page, stepKey(0), stepKey(2));frame = await seek(page, .4);
  check('Reload preserves updated K ID, time, draft and actual posed joints', equal(frame.transitions.document, saved) && actualMatches(frame));
  await clickPoint(page, 'leftAnkle', .4);await begin(page, pointKey(0));await numeric(page, 1, 1);await saveK(page);
  await page.locator('#transition-undo-document').click();frame = await settle(page);
  check('Animation undo restores the preceding K revision', equal(frame.transitions.document, saved) && equal(frame.formal, source));
  await capture(page, 'blue-K-saved');await page.context().close();
}

async function wrapCase() {
  const page = await pageFor();let frame = await range(page, stepKey(7), stepKey(1));
  check('16 to 10 unfolds actual playback to 7 through 10 seconds', frame.trajectory.data.startTime === 7 && frame.trajectory.data.endTime === 10 &&
    [7, 8, 9, 9.4, 10].every(time => pathFrame(frame.trajectory.data, time)) && (await page.locator('#trajectory-range').textContent()).includes('跨循环'));
  await focus(page, 'leftAnkle');const clicked = await clickPoint(page, 'leftAnkle', 9.4);frame = clicked.frame;
  check('Cross-loop click retains unwrapped sample time and displays its modulo pose', Math.abs(frame.transitions.state.trajectoryProbe.time - 9.4) < 1e-8 &&
    Math.abs(frame.status.time - .4) < 1e-8 && distance(pathFrame(frame.trajectory.data, 9.4).joints.leftAnkle, frame.metrics.joints.leftAnkle) < 1e-7);
  await drawer(page, 'details', false);const cameraBefore = (await inspect(page)).status.camera;
  const canvas = await page.locator('#scene canvas').boundingBox();
  await page.mouse.move(canvas.x + canvas.width * .25, canvas.y + canvas.height * .25, { steps: 4 });await paint(page);
  check('Cross-loop trajectory click releases orbit gesture before further hover', difference((await inspect(page)).status.camera, cameraBefore) < 1e-8);
  await drawer(page, 'details', true);
  frame = await begin(page, pointKey(0));check('Cross-loop inverse editing uses the active K in that interval', frame.transitions.state.poseTrajectoryEditing.time === 9.4 &&
    frame.transitions.state.poseTrajectoryEditing.anchor.id === seedEdits.points[0].id);
  frame = await numeric(page, 1, 1);check('Cross-loop candidate and saved baseline share identical times and shape', frame.transitions.state.poseTrajectoryEditing.pending &&
    equal(frame.trajectory.data.frames.map(sample => sample.time), frame.trajectory.data.baselineFrames.map(sample => sample.time)) && actualMatches(frame));
  await cancel(page);await preserveRaw(page, 'Cross-loop preview cancellation preserves all raw animation storage');
  const clocks = await samplePreview(page, 'segment');
  check('Selected cross-loop preview stays in the unfolded range', clocks.every(time => time >= 7 && time < 10) && Math.max(...clocks) > 8, { clocks });
  await capture(page, 'cross-loop-range');await page.context().close();
}

async function mobileCase() {
  const page = await pageFor(true);let frame = await range(page, stepKey(0), stepKey(2));await focus(page, 'leftAnkle');await seek(page, .4);
  for (const selector of ['#trajectory-from', '#trajectory-to', '#trajectory-joint', '#trajectory-pose-frame', '#trajectory-pose-begin']) {
    const control = page.locator(selector);await control.scrollIntoViewIfNeeded();const box = await control.boundingBox();
    check(`Mobile control ${selector} is reachable`, box && box.x >= 0 && box.x + box.width <= 391 && box.y >= 0 && box.y < 844);
  }
  await begin(page, pointKey(0));frame = await numeric(page, 1, 1);
  check('Mobile numeric correction previews with visible apply and cancel controls', frame.transitions.state.poseTrajectoryEditing.pending &&
    await page.locator('#trajectory-pose-apply').isVisible() && await page.locator('#trajectory-pose-cancel').isVisible());
  const baselineControl = page.locator('#trajectory-baseline');await baselineControl.scrollIntoViewIfNeeded();
  const baselineBox = await baselineControl.boundingBox();
  check('Mobile baseline switch fits the drawer and hides comparison independently', baselineBox && baselineBox.x >= 0 && baselineBox.x + baselineBox.width <= 391);
  await baselineControl.uncheck();frame = await settle(page);check('Mobile baseline switch preserves the preview', frame.trajectory.baselinePathCount === 0 && frame.transitions.state.poseTrajectoryEditing.pending);
  await baselineControl.check();await settle(page);
  const apply = page.locator('#trajectory-pose-apply');await apply.scrollIntoViewIfNeeded();await capture(page, 'mobile-preview');await apply.click();frame = await settle(page);
  check('Mobile apply corrects an existing K and preserves personal raw data', !frame.transitions.state.poseTrajectoryEditing &&
    frame.transitions.document.points.length === 2 && await stored(page, PERSONAL) === personalRaw);
  check('Mobile page does not add horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.context().close();
}

try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  const actions = { main: mainCase, k: kCase, wrap: wrapCase, mobile: mobileCase };
  for (const name of caseNames) { currentCase = name;await actions[name](); }
  currentCase = 'final';
  check('Original source animation and personal export files remain byte-identical', hash(await fs.readFile(sourcePath)) === hash(sourceBytes) &&
    hash(await fs.readFile(personalPath)) === hash(personalBytes));
  check('Independent browser cases have no page or console errors', errors.length === 0, errors);
} catch (error) {
  failure = error;console.error(error.stack || error);
  if (activePage && !activePage.isClosed()) {
    try { await capture(activePage, currentCase + '-failure');measurements.failureState = await inspect(activePage);
      measurements.failureToast = await activePage.locator('#toast').textContent(); } catch { /* Preserve original failure. */ }
  }
} finally {
  await browser?.close();
  const report = { pass: !failure, requestedCases: caseNames, cases, checks, errors, measurements, screenshots,
    sourceSha256: hash(sourceBytes), personalSha256: hash(personalBytes), failure: failure?.message ?? null };
  const reportFile = path.join(output, `trajectory-pose-ui-${wantedCase?.replaceAll(',', '-') || 'all'}.json`);
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ pass: report.pass, checks: checks.length, cases, report: reportFile, failure: report.failure }));
  if (failure) process.exitCode = 1;
}
