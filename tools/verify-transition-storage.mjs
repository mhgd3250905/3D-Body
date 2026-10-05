import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  TRANSITION_STORAGE_KEY, compatibleTransitionEdits, createTransitionEdits,
  validateTransitionEdits, loadTransitionEdits, saveTransitionEdits, transitionOptions,
} from '../src/transition-edits.js';

const sourceUrl = new URL('../public/coach/flare-sequence.json', import.meta.url);
const sourceBytes = await fs.readFile(sourceUrl, 'utf8');
const source = JSON.parse(sourceBytes), originalSource = structuredClone(source);
const output = new URL('../output/playwright/', import.meta.url);
const checks = [];
function check(name, action) {
  action();checks.push({ name, pass: true });
}
function memory(initial = {}, behavior = 'normal') {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem(key, value) {
      if (behavior === 'throw') throw new Error('Simulated quota exceeded.');
      if (behavior !== 'ignore') values.set(key, String(value));
    },
    values,
  };
}
const originals = {
  'flare-pose-library-v1': '\n {"version":1,"steps":[{"id":"personal-original"}],"draft":{"preserve":"all bytes"}}\n',
  'flare-demonstration-v1': '\n  ' + JSON.stringify(source, null, 3) + '\n',
  'flare-demonstration-backup-v1': 'original previous display bytes',
};
const storage = memory(originals);
const untouched = () => {
  for (const [key, value] of Object.entries(originals)) assert.equal(storage.getItem(key), value, `${key} changed`);
  assert.deepEqual(source, originalSource);
};
const document = createTransitionEdits(source);
document.points = [
  { id: 'storage-test-a', segment: 0, at: .25, name: 'K frame A', pose: structuredClone(source.steps[0].pose) },
  { id: 'storage-test-b', segment: 0, at: .75, name: 'K frame B', pose: structuredClone(source.steps[1].pose) },
];
document.draft = { segment: 2, at: .4, name: 'Unsaved frame', pose: structuredClone(source.steps[2].pose) };

check('Missing storage creates an enabled arc document without writing original keys', () => {
  const fresh = loadTransitionEdits(source, storage);
  assert.equal(fresh.enabled, true);assert.equal(fresh.legPath, 'arc');assert.deepEqual(fresh.points, []);
  assert.equal(fresh.interpolation, 'smooth');
  assert.equal(storage.getItem(TRANSITION_STORAGE_KEY), null);untouched();
});
check('Saved frames and a separate temporary pose survive a storage round trip', () => {
  assert.deepEqual(saveTransitionEdits(document, source, storage), document);
  assert.deepEqual(loadTransitionEdits(source, storage), document);untouched();
});
check('Inputs, loaded documents and playback options cannot alias stored frame poses', () => {
  const before = storage.getItem(TRANSITION_STORAGE_KEY);
  const loaded = loadTransitionEdits(source, storage), options = transitionOptions(loaded);
  loaded.points[0].pose.pelvis[0] = 999;options.corrections[0].pose.pelvis[0] = 999;
  assert.equal(storage.getItem(TRANSITION_STORAGE_KEY), before);
  assert.deepEqual(loadTransitionEdits(source, storage), document);untouched();
});
check('Disabling playback preserves every frame and draft across reload', () => {
  const disabled = { ...structuredClone(document), enabled: false };
  saveTransitionEdits(disabled, source, storage);
  const reloaded = loadTransitionEdits(source, storage);
  assert.deepEqual(reloaded, disabled);
  assert.deepEqual(transitionOptions(reloaded), { corrections: [], legPath: 'linear', interpolation: 'smooth' });
  saveTransitionEdits(document, source, storage);untouched();
});
check('Old transition documents retain smooth playback without rewriting their raw saved data', () => {
  const legacy = structuredClone(document);delete legacy.interpolation;
  const raw = '\n ' + JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [legacy] }, null, 2) + '\n';
  const oldStorage = memory({ [TRANSITION_STORAGE_KEY]: raw, ...originals });
  assert.deepEqual(loadTransitionEdits(source, oldStorage), { ...legacy, interpolation: 'smooth' });
  assert.deepEqual(validateTransitionEdits(legacy, source), { ...legacy, interpolation: 'smooth' });
  assert.equal(transitionOptions(legacy).interpolation, 'smooth');
  assert.equal(Object.hasOwn(legacy, 'interpolation'), false);
  assert.equal(oldStorage.getItem(TRANSITION_STORAGE_KEY), raw);untouched();
});
check('Linear interpolation persists independently of the leg route and disabling retains the choice', () => {
  const linear = { ...structuredClone(document), interpolation: 'linear' };
  saveTransitionEdits(linear, source, storage);
  assert.deepEqual(loadTransitionEdits(source, storage), linear);
  assert.deepEqual(transitionOptions(linear), { corrections: linear.points, legPath: 'arc', interpolation: 'linear' });
  linear.legPath = 'linear';saveTransitionEdits(linear, source, storage);
  assert.deepEqual(transitionOptions(loadTransitionEdits(source, storage)), { corrections: linear.points, legPath: 'linear', interpolation: 'linear' });
  linear.enabled = false;saveTransitionEdits(linear, source, storage);
  assert.equal(loadTransitionEdits(source, storage).interpolation, 'linear');
  assert.deepEqual(transitionOptions(loadTransitionEdits(source, storage)), { corrections: [], legPath: 'linear', interpolation: 'smooth' });
  saveTransitionEdits(document, source, storage);untouched();
});
check('Each formal pose baseline gets a separate entry and its prior corrections stay available', () => {
  const alternate = structuredClone(source);alternate.steps[2].pose.pelvis[0] += .01;
  const other = createTransitionEdits(alternate);other.legPath = 'linear';
  saveTransitionEdits(other, alternate, storage);
  assert.equal(JSON.parse(storage.getItem(TRANSITION_STORAGE_KEY)).entries.length, 2);
  assert.deepEqual(loadTransitionEdits(source, storage), document);
  assert.deepEqual(loadTransitionEdits(alternate, storage), other);untouched();
});
check('Names and metadata do not misidentify unchanged anchors, but changed poses do', () => {
  const renamed = structuredClone(source);renamed.title = 'Renamed';renamed.steps[0].name = 'Renamed anchor';
  assert.equal(compatibleTransitionEdits(document, renamed), true);
  const changed = structuredClone(source);changed.steps[0].pose.pelvis[0] += .01;
  assert.equal(compatibleTransitionEdits(document, changed), false);
  assert.throws(() => validateTransitionEdits(document, changed));untouched();
});
const invalid = [
  { ...document, format: 'other' }, { ...document, version: 2 }, { ...document, enabled: 1 },
  { ...document, legPath: 'unknown' }, { ...document, points: new Array(201).fill(document.points[0]) },
  ...['unknown', null, 1, undefined].map(interpolation => ({ ...document, interpolation })),
];
for (const modify of [
  value => { value.points[1].id = value.points[0].id; },
  value => { value.points[1].at = value.points[0].at + 1e-9; },
  value => { value.points[1].segment = source.steps.length; },
  value => { value.points[1].at = 1; },
  value => { value.points[1].pose.bodyQuaternion = [0, 0, 0, 0]; },
  value => { value.points[1].pose.limbs.left.kneeTwist = Infinity; },
  value => { value.points[1].name = 3; },
  value => { value.points[1].name = 'x'.repeat(81); },
  value => { value.draft.segment = -1; },
  value => { value.draft.at = NaN; },
  value => { value.draft.pose.version = 2; },
  value => { value.draft.pose.limbs.right.handLocked = 'true'; },
]) {
  const value = structuredClone(document);modify(value);invalid.push(value);
}
check('Invalid imports are rejected as a whole without partially replacing saved data', () => {
  const before = storage.getItem(TRANSITION_STORAGE_KEY);
  for (const value of invalid) {
    assert.throws(() => saveTransitionEdits(value, source, storage));
    assert.equal(storage.getItem(TRANSITION_STORAGE_KEY), before);untouched();
  }
});
check('Unreadable existing libraries retain their original raw bytes', () => {
  for (const raw of ['{broken JSON', '{"format":"other","version":1,"entries":[]}']) {
    const unreadable = memory({ [TRANSITION_STORAGE_KEY]: raw, ...originals });
    assert.throws(() => loadTransitionEdits(source, unreadable));
    assert.throws(() => saveTransitionEdits(document, source, unreadable));
    assert.equal(unreadable.getItem(TRANSITION_STORAGE_KEY), raw);
    for (const [key, value] of Object.entries(originals)) assert.equal(unreadable.getItem(key), value);
  }
});
check('Quota failures, silent failures and unavailable storage report failure without changing originals', () => {
  assert.throws(() => saveTransitionEdits(document, source, null));
  for (const behavior of ['throw', 'ignore']) {
    const blocked = memory(originals, behavior);
    assert.throws(() => saveTransitionEdits(document, source, blocked));
    assert.equal(blocked.getItem(TRANSITION_STORAGE_KEY), null);
    for (const [key, value] of Object.entries(originals)) assert.equal(blocked.getItem(key), value);
  }
});
check('The formal JSON and all in-memory source anchors remain unchanged', () => { untouched(); });
assert.equal(await fs.readFile(sourceUrl, 'utf8'), sourceBytes);
await fs.mkdir(output, { recursive: true });
const report = { pass: true, checks, invalidImportCases: invalid.length, scope: 'Transition-only storage, exact original-key preservation, baseline isolation and complete import rejection.' };
const reportUrl = new URL('transition-storage-verification.json', output);
await fs.writeFile(reportUrl, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: true, checks: checks.length, invalidImportCases: invalid.length, report: reportUrl.pathname }, null, 2));
