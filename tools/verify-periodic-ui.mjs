import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createTransitionEdits, TRANSITION_STORAGE_KEY } from '../src/transition-edits.js';
import { createFlareSequence } from '../src/flare-sequence.js';
import { OFFICIAL_LOOP_UPGRADE_MARKER_KEY } from '../src/official-poses.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/periodic-analysis');
await fs.mkdir(output, { recursive: true });
const raw = await fs.readFile(path.join(root, 'public/coach/flare-sequence.json'), 'utf8');
const source = JSON.parse(raw), exported = JSON.parse(await fs.readFile(path.join(root, '托马斯/16.json'), 'utf8'));
const personal = { ...exported, title: 'Preserve my existing draft', draft: structuredClone(exported.steps[11].pose) };
personal.draft.pelvis[0] += .012;
const personalRaw = '\n' + JSON.stringify(personal, null, 2) + '\n';
const officialRaw = '\n' + JSON.stringify(source, null, 3) + '\n';
const sequence = createFlareSequence(source.steps, { period: source.period });
const edits = createTransitionEdits(source);
edits.points = [{ id: 'keep-my-existing-k', name: 'Preserve my K', segment: 2, at: .4, pose: sequence.sample(2.4) }];
edits.points[0].pose.pelvis[0] += .005;
const editsRaw = '\n' + JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [edits] }, null, 2) + '\n';
const keys = ['flare-pose-library-v1', 'flare-demonstration-v1', TRANSITION_STORAGE_KEY];
const seed = { [keys[0]]: personalRaw, [keys[1]]: officialRaw, [keys[2]]: editsRaw, [OFFICIAL_LOOP_UPGRADE_MARKER_KEY]: source.source.revision };
const base = process.env.PERIODIC_TEST_URL || 'http://127.0.0.1:8810/?inspect=1';
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const checks = [], errors = [], captures = [];
const check = (name, condition) => { checks.push({ name, pass: Boolean(condition) });assert.ok(condition, name); };
const stored = page => page.evaluate(keys => Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])), keys);
const status = page => page.evaluate(() => window.flareInspector.status());
const pose = page => page.evaluate(() => window.flareInspector.capturePose());
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const seek = async (page, time) => {
  await page.locator('#timeline').evaluate((input, value) => { input.value = String(value);input.dispatchEvent(new Event('input', { bubbles: true })); }, time);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
};
async function drawer(page, side, open) {
  const button = page.locator('#toggle-' + side);
  if (await button.getAttribute('aria-expanded') !== String(open)) await button.click();
}
let browser, page, failure;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await context.addInitScript(({ origin, seed }) => {
    if (location.origin === origin && !localStorage.getItem('periodic-test-seeded')) {
      for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
      localStorage.setItem('periodic-test-seeded', '1');
    }
  }, { origin: new URL(base).origin, seed });
  page = await context.newPage();page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(base);
  const ready = () => page.waitForFunction(() => document.documentElement.dataset.ready === 'true' && window.flareInspector, null, { timeout: 45000 });
  await ready();await drawer(page, 'details', true);
  check('The saved animation remains the default', (await status(page)).motion.motionModel === 'saved');
  await drawer(page, 'library', true);await page.locator('[data-mode="pose"]').click();
  const resolvedDraft = await pose(page);
  await drawer(page, 'library', true);await page.locator('[data-mode="motion"]').click();await drawer(page, 'details', true);
  await seek(page, 2.4);const savedPose = await pose(page), before = await stored(page), prior = await status(page);
  await page.locator('#motion-model').selectOption('periodic');
  let current = await status(page);
  check('Selecting the trial changes the active generator and retains time and camera', current.motion.motionModel === 'periodic' && current.time === prior.time && equal(current.camera, prior.camera) && equal(current.target, prior.target));
  check('Trial has its own captions and hides original frame choices', await page.locator('#stage-title').textContent() === '托马斯 · 数学轨迹试验' && !await page.locator('#pose-presets').isVisible() && await page.locator('#part-count').textContent() === '连续周期轨迹');
  const phases = [];
  for (const fraction of [0, .25, .5, .75]) {
    await seek(page, fraction * source.period);
    phases.push((await status(page)).motion.periodic.section);
  }
  check('The four actual support phases are displayed in cycle order', equal(phases, ['rear', 'right', 'front', 'left']));
  check('Playback advances the procedural cycle', await (async () => {
    await page.locator('#play-button').click();const first = (await status(page)).time;
    await page.waitForFunction(first => window.flareInspector.status().time > first + .06, first);
    await page.locator('#play-button').click();return !(await status(page)).playing;
  })());
  await page.locator('#compare-saved-animation').click();await seek(page, 2.4);
  check('Returning restores the exact saved animation including its existing K', equal(await pose(page), savedPose) && (await status(page)).motion.motionModel === 'saved');
  check('Switching and playback preserve all pose and transition storage bytes', equal(await stored(page), before));
  await page.locator('#motion-model').selectOption('periodic');
  await drawer(page, 'library', true);await page.locator('[data-mode="pose"]').click();
  check('Entering pose editing returns to the saved source and restores its personal draft', (await status(page)).motion.motionModel === 'saved' && equal(await pose(page), resolvedDraft));
  await drawer(page, 'library', true);await page.locator('[data-mode="motion"]').click();
  await drawer(page, 'details', true);await page.locator('#motion-model').selectOption('periodic');
  await drawer(page, 'library', true);await page.locator('[data-mode="transition"]').click();
  check('Entering animation editing returns to original nodes and existing corrections', (await status(page)).motion.motionModel === 'saved' && (await page.evaluate(() => window.flareInspector.transitions().document.points.length)) === 1);
  await drawer(page, 'library', true);await page.locator('[data-mode="motion"]').click();await drawer(page, 'details', true);
  await page.locator('#motion-model').selectOption('periodic');
  await page.reload();await ready();
  check('Reload retains the saved source, original nodes and existing K without adopting the trial', (await status(page)).motion.motionModel === 'saved' && equal(await stored(page), before) && equal(await page.evaluate(() => window.flareInspector.demonstration()), source));
  await drawer(page, 'details', true);await page.locator('#motion-model').selectOption('periodic');
  await page.screenshot({ path: path.join(output, 'periodic-ui.png') });
  await page.locator('#canvas-focus').click();
  for (let index = 0; index < 16; index++) {
    // Inspector seeking works with the control drawer folded away.
    await page.evaluate(time => window.flareInspector.setTime(time), index * source.period / 16);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const filename = path.join(output, `periodic-frame-${String(index).padStart(2, '0')}.png`);
    await page.locator('#scene').screenshot({ path: filename });captures.push(filename);
  }
  const sheet = await context.newPage();
  const cells = await Promise.all(captures.map(async (filename, index) => `<div><img src="data:image/png;base64,${(await fs.readFile(filename)).toString('base64')}"/><span>${(index * source.period / 16).toFixed(2)} s</span></div>`));
  await sheet.setViewportSize({ width: 1600, height: 1360 });
  await sheet.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#111923;color:#abc1db;font:16px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:4px}div{position:relative;height:336px;overflow:hidden}img{width:100%;height:100%;object-fit:contain}span{position:absolute;left:8px;top:8px;background:#111b;padding:4px}</style>${cells.join('')}`);
  await sheet.screenshot({ path: path.join(output, 'periodic-contact-sheet.png') });await sheet.close();
  await page.setViewportSize({ width: 390, height: 844 });await page.locator('#canvas-focus').click();await drawer(page, 'details', true);
  check('Trial selector and timeline fit the mobile drawer', await page.locator('#motion-model').isVisible() && await page.locator('#timeline').isVisible() && await page.locator('#motion-toolbar').evaluate(element => element.scrollWidth <= element.clientWidth + 1));
  await page.screenshot({ path: path.join(output, 'periodic-mobile.png') });
  // Finish an already-authorized import after leaving the editor and selecting
  // the trial. A late callback must not silently reset the engine's generator.
  await page.setViewportSize({ width: 1366, height: 900 });
  await drawer(page, 'library', true);await page.locator('[data-mode="transition"]').click();await drawer(page, 'details', true);
  await page.evaluate(() => {
    const original = File.prototype.text;
    File.prototype.text = async function () {
      const contents = await original.call(this);
      await new Promise(resolve => { window.resumePeriodicImport = resolve; });
      File.prototype.text = original;return contents;
    };
  });
  await page.locator('#transition-import-file').setInputFiles({ name: 'existing-animation.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(edits)) });
  await page.waitForFunction(() => typeof window.resumePeriodicImport === 'function');
  await drawer(page, 'library', true);await page.locator('[data-mode="motion"]').click();await drawer(page, 'details', true);
  await page.locator('#motion-model').selectOption('periodic');await seek(page, 2.1);const beforeLateImport = await pose(page);
  await page.evaluate(() => window.resumePeriodicImport());
  await page.waitForFunction(() => document.querySelector('#toast').textContent.includes('动画备份已导入'));
  check('A late animation import keeps the trial UI and engine synchronized', (await status(page)).motion.motionModel === 'periodic' && equal(await pose(page), beforeLateImport) && await page.locator('#motion-model').inputValue() === 'periodic');
  check('The served page has no JavaScript errors', errors.length === 0);
  check('Original source JSON on disk remains byte-identical', await fs.readFile(path.join(root, 'public/coach/flare-sequence.json'), 'utf8') === raw);
} catch (error) { failure = error; }
finally {
  const report = { pass: !failure, passed: checks.filter(item => item.pass).length, checks, errors, failure: failure?.stack, captures,
    sourceSha256: createHash('sha256').update(raw).digest('hex'), url: base };
  await fs.writeFile(path.join(output, 'periodic-ui-verification.json'), JSON.stringify(report, null, 2));
  if (failure && page) await page.screenshot({ path: path.join(output, 'periodic-ui-failure.png') }).catch(() => {});
  await browser?.close();
  console.log(JSON.stringify({ pass: report.pass, passed: report.passed, checks: checks.length, errors, failure: failure?.message, output }));
}
if (failure) throw failure;
