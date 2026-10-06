import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  OFFICIAL_LOOP_UPGRADE_BACKUP_KEY, OFFICIAL_LOOP_UPGRADE_MARKER_KEY, validSequence,
} from '../src/official-poses.js';
import {
  TRANSITION_STORAGE_KEY, createTransitionEdits, compatibleTransitionEdits,
  loadTransitionEdits, saveTransitionEdits, rebaseTransitionEdits, saveOfficialFrameEdits,
} from '../src/transition-edits.js';

const sourceUrl = new URL('../public/coach/flare-sequence.json', import.meta.url);
const sourceBytes = await fs.readFile(sourceUrl, 'utf8'), source = JSON.parse(sourceBytes);
const personalBytes = await fs.readFile(new URL('../托马斯/16.json', import.meta.url), 'utf8');
const officialKey = 'flare-demonstration-v1', backupKey = 'flare-demonstration-backup-v1';
const personalKey = 'flare-pose-library-v1';
const tracked = [officialKey, backupKey, OFFICIAL_LOOP_UPGRADE_MARKER_KEY, OFFICIAL_LOOP_UPGRADE_BACKUP_KEY, TRANSITION_STORAGE_KEY, personalKey];
const clone = value => structuredClone(value);
const checks = [], faultCases = [];
const check = (name, action) => { action();checks.push({ name, pass: true }); };

function memory(initial = {}, fault) {
  const values = new Map(Object.entries(initial));
  let applied = 0, writes = 0;
  const mutate = (action, key, value) => {
    writes++;
    const normal = () => action === 'setItem' ? values.set(key, String(value)) : values.delete(key);
    if (applied && fault?.blockRestoreKey === key) throw new Error('Simulated recovery write failure.');
    if (fault?.key !== key || (fault.action ?? 'setItem') !== action || applied) { normal();return; }
    applied++;
    if (fault.behavior === 'throw') throw new Error('Simulated quota failure.');
    if (fault.behavior === 'ignore') return;
    if (fault.behavior === 'corrupt') { values.set(key, 'Simulated incomplete write.');return; }
    normal();throw new Error('Simulated failure after a write.');
  };
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => mutate('setItem', key, value),
    removeItem: key => mutate('removeItem', key),
    get applied() { return applied; }, get writes() { return writes; }, values,
  };
}
const snapshot = storage => new Map(tracked.map(key => [key, storage.getItem(key)]));
const restored = (storage, before) => {
  for (const [key, raw] of before) assert.equal(storage.getItem(key), raw, `${key} did not recover its original bytes`);
};

const document = createTransitionEdits(source);
document.enabled = false;document.legPath = 'linear';document.interpolation = 'linear';
document.points = [
  { id: 'retained-k-a', segment: 0, at: .3, name: 'K A', pose: clone(source.steps[0].pose) },
  { id: 'retained-k-b', segment: 3, at: .7, name: 'K B', pose: clone(source.steps[4].pose) },
];
document.draft = { segment: 2, at: 0, name: 'Unsaved original-frame edit', pose: clone(source.steps[2].pose) };
document.extra = { preserved: 'metadata' };
const nextSequence = clone(source);nextSequence.steps[2].pose.pelvis[0] += .04;
const originalSequence = clone(source), originalDocument = clone(document), originalNext = clone(nextSequence);
let nextDocument;

check('Rebasing changes only the formal pose base and retains all K frames, settings and draft', () => {
  nextDocument = rebaseTransitionEdits(document, source, nextSequence);
  assert.equal(compatibleTransitionEdits(nextDocument, nextSequence), true);
  const oldPayload = clone(document), newPayload = clone(nextDocument);delete oldPayload.base;delete newPayload.base;
  assert.deepEqual(newPayload, oldPayload);
  assert.deepEqual(source, originalSequence);assert.deepEqual(document, originalDocument);assert.deepEqual(nextSequence, originalNext);
});
check('Rebased results do not alias saved frames, draft or either sequence', () => {
  const rebased = rebaseTransitionEdits(document, source, nextSequence);
  rebased.points[0].pose.pelvis[0] = 999;rebased.draft.pose.pelvis[0] = 999;rebased.base.steps[0].pose.pelvis[0] = 999;
  assert.deepEqual(document, originalDocument);assert.deepEqual(source, originalSequence);assert.deepEqual(nextSequence, originalNext);
});
check('Changed IDs, reordered nodes, changed period or length and invalid old documents are rejected', () => {
  for (const modify of [
    value => { value.steps[2].id += '-different'; },
    value => { [value.steps[1], value.steps[2]] = [value.steps[2], value.steps[1]]; },
    value => { value.period = 8; }, value => { value.steps.pop(); },
    value => { value.steps[2].pose.bodyQuaternion = [0, 0, 0, 0]; },
  ]) {
    const invalid = clone(nextSequence);modify(invalid);
    assert.throws(() => rebaseTransitionEdits(document, source, invalid));
  }
  const wrongBase = clone(source);wrongBase.steps[2].pose.pelvis[0] += .1;
  assert.throws(() => rebaseTransitionEdits(document, wrongBase, nextSequence));
  const invalidDocument = clone(document);invalidDocument.points[1].pose.version = 2;
  assert.throws(() => rebaseTransitionEdits(invalidDocument, source, nextSequence));
});
check('Legacy documents retain smooth timing when rebased without rewriting their input', () => {
  const legacy = clone(document);delete legacy.interpolation;
  const rebased = rebaseTransitionEdits(legacy, source, nextSequence);
  assert.equal(rebased.interpolation, 'smooth');assert.equal(Object.hasOwn(legacy, 'interpolation'), false);
  assert.deepEqual(rebased.points, legacy.points);assert.deepEqual(rebased.draft, legacy.draft);
});

const originals = {
  [officialKey]: '\n  ' + JSON.stringify(source, null, 3) + '\n',
  [backupKey]: '\n {"previous":"preserve original backup bytes on failure"}\n',
  [OFFICIAL_LOOP_UPGRADE_MARKER_KEY]: 'older marker bytes',
  [OFFICIAL_LOOP_UPGRADE_BACKUP_KEY]: '\n  independent original upgrade backup bytes  \n',
  [TRANSITION_STORAGE_KEY]: '\n ' + JSON.stringify({ format: 'flare-transition-library', version: 1, entries: [document] }, null, 2) + '\n',
  [personalKey]: personalBytes,
};
const successStorage = memory(originals);
check('Official and transition sequences persist together while preserving the old base and personal bytes', () => {
  assert.deepEqual(saveOfficialFrameEdits(nextSequence, nextDocument, successStorage), nextDocument);
  assert.deepEqual(JSON.parse(successStorage.getItem(officialKey)), nextSequence);
  assert.equal(successStorage.getItem(backupKey), originals[officialKey]);
  assert.equal(successStorage.getItem(OFFICIAL_LOOP_UPGRADE_MARKER_KEY), source.source.revision);
  assert.equal(successStorage.getItem(OFFICIAL_LOOP_UPGRADE_BACKUP_KEY), originals[OFFICIAL_LOOP_UPGRADE_BACKUP_KEY]);
  assert.equal(successStorage.getItem(personalKey), personalBytes);
  assert.deepEqual(loadTransitionEdits(source, successStorage), document);
  assert.deepEqual(loadTransitionEdits(nextSequence, successStorage), nextDocument);
  assert.equal(JSON.parse(successStorage.getItem(TRANSITION_STORAGE_KEY)).entries.length, 2);
});
check('Invalid requests and unreadable old transition data cannot write either library', () => {
  for (const invalid of [null, { ...nextDocument, enabled: 1 }, document]) {
    const storage = memory(originals), before = snapshot(storage);
    assert.throws(() => saveOfficialFrameEdits(nextSequence, invalid, storage));
    restored(storage, before);assert.equal(storage.writes, 0);
  }
  const badSequence = clone(nextSequence);badSequence.steps[2].pose.version = 2;
  const storage = memory(originals), before = snapshot(storage);
  assert.throws(() => saveOfficialFrameEdits(badSequence, nextDocument, storage));
  assert.throws(() => saveOfficialFrameEdits(nextSequence, nextDocument, storage, { restore: 'yes' }));
  restored(storage, before);assert.equal(storage.writes, 0);
  for (const raw of ['{broken JSON', '{"format":"other","version":1,"entries":[]}']) {
    const unreadable = memory({ ...originals, [TRANSITION_STORAGE_KEY]: raw }), saved = snapshot(unreadable);
    assert.throws(() => saveOfficialFrameEdits(nextSequence, nextDocument, unreadable));
    restored(unreadable, saved);assert.equal(unreadable.writes, 0);
  }
});
check('All official or transition throw, silent and partial write failures restore original raw keys', () => {
  for (const key of [OFFICIAL_LOOP_UPGRADE_MARKER_KEY, backupKey, officialKey, TRANSITION_STORAGE_KEY]) {
    for (const behavior of ['throw', 'ignore', 'corrupt', 'throw-after']) {
      const storage = memory(originals, { key, behavior }), before = snapshot(storage);
      assert.throws(() => saveOfficialFrameEdits(nextSequence, nextDocument, storage), /已恢复/);
      assert.equal(storage.applied, 1);restored(storage, before);
      faultCases.push({ action: 'save', key, behavior, pass: true });
    }
  }
});
check('Failure with initially missing keys removes newly created official, backup, marker and transition entries', () => {
  const storage = memory({ [personalKey]: personalBytes }, { key: TRANSITION_STORAGE_KEY, behavior: 'throw-after' }), before = snapshot(storage);
  assert.throws(() => saveOfficialFrameEdits(nextSequence, nextDocument, storage), /已恢复/);
  restored(storage, before);assert.equal(storage.values.size, 1);
});
check('Unavailable storage and failed initial reads never start a transaction', () => {
  assert.throws(() => saveOfficialFrameEdits(nextSequence, nextDocument, null));
  const storage = memory(originals), before = snapshot(storage), ordinaryGet = storage.getItem;
  storage.getItem = key => { if (key === OFFICIAL_LOOP_UPGRADE_MARKER_KEY) throw new Error('Simulated read access failure.');return ordinaryGet(key); };
  assert.throws(() => saveOfficialFrameEdits(nextSequence, nextDocument, storage));
  storage.getItem = ordinaryGet;restored(storage, before);assert.equal(storage.writes, 0);
});

const laterDocument = clone(nextDocument);
laterDocument.points.push({ id: 'new-k-after-original-update', segment: 5, at: .5, name: 'Later K', pose: clone(source.steps[5].pose) });
saveTransitionEdits(laterDocument, nextSequence, successStorage);
const restoredDocument = rebaseTransitionEdits(laterDocument, nextSequence, source);
const restoreOriginals = Object.fromEntries(successStorage.values);
check('Restoring the old original frame keeps later K frames and clears the official undo backup', () => {
  const storage = memory(restoreOriginals);
  assert.deepEqual(saveOfficialFrameEdits(source, restoredDocument, storage, { restore: true }), restoredDocument);
  assert.deepEqual(JSON.parse(storage.getItem(officialKey)), source);assert.equal(storage.getItem(backupKey), null);
  assert.deepEqual(loadTransitionEdits(source, storage), restoredDocument);
  assert.deepEqual(loadTransitionEdits(nextSequence, storage), laterDocument);
  assert.equal(storage.getItem(personalKey), personalBytes);
  assert.equal(storage.getItem(OFFICIAL_LOOP_UPGRADE_BACKUP_KEY), originals[OFFICIAL_LOOP_UPGRADE_BACKUP_KEY]);
});
check('Restore failures recover the deleted backup and all original official and transition bytes', () => {
  for (const [action, key] of [['setItem', officialKey], ['removeItem', backupKey], ['setItem', TRANSITION_STORAGE_KEY]]) {
    for (const behavior of ['throw', 'ignore', 'corrupt', 'throw-after']) {
      const storage = memory(restoreOriginals, { action, key, behavior }), before = snapshot(storage);
      assert.throws(() => saveOfficialFrameEdits(source, restoredDocument, storage, { restore: true }), /已恢复/);
      assert.equal(storage.applied, 1);restored(storage, before);
      faultCases.push({ action: 'restore', key, behavior, pass: true });
    }
  }
});
check('A storage device that also blocks recovery reports an incomplete rollback and restores other keys', () => {
  const storage = memory(originals, { key: TRANSITION_STORAGE_KEY, behavior: 'throw', blockRestoreKey: officialKey });
  const before = snapshot(storage);
  assert.throws(() => saveOfficialFrameEdits(nextSequence, nextDocument, storage), error => {
    assert.match(error.message, /拒绝恢复/);
    assert.deepEqual(error.cause.rollbackFailures.map(failure => failure.key), [officialKey]);return true;
  });
  assert.deepEqual(JSON.parse(storage.getItem(officialKey)), nextSequence);
  for (const [key, raw] of before) if (key !== officialKey) assert.equal(storage.getItem(key), raw);
});
check('The formal asset, personal export and input objects remain unchanged', () => {
  assert.equal(validSequence(source), true);assert.equal(validSequence(nextSequence), true);
  assert.deepEqual(source, originalSequence);assert.deepEqual(document, originalDocument);assert.deepEqual(nextSequence, originalNext);
});
assert.equal(await fs.readFile(sourceUrl, 'utf8'), sourceBytes);
assert.equal(await fs.readFile(new URL('../托马斯/16.json', import.meta.url), 'utf8'), personalBytes);
const report = { pass: true, checks, faultCases, originalAnchors: source.steps.length,
  scope: 'Pure storage tests: same-node rebasing, exact K/settings/draft retention, two-library official save and restore, raw rollback and personal-library preservation. Persistent recovery rejection is explicitly reported, never treated as success.' };
const reportUrl = new URL('../output/playwright/official-frame-storage-verification.json', import.meta.url);
await fs.mkdir(new URL('./', reportUrl), { recursive: true });
await fs.writeFile(reportUrl, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: true, checks: checks.length, faultCases: faultCases.length, originalAnchors: report.originalAnchors, report: reportUrl.pathname }, null, 2));
