import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { OFFICIAL_FLARE_SEQUENCE as bundled, samePose } from '../src/official-poses.js';
import { createTransitionEdits, compatibleTransitionEdits, rebaseTransitionEdits } from '../src/transition-edits.js';
import { getOfficialRecoveryFrames, restoreOfficialFrames } from '../src/official-frame-recovery.js';

const clone = value => structuredClone(value), checks = [];
const check = (name, action) => { action();checks.push(name); };
function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze);Object.freeze(value); }
  return value;
}
const backupUrl = new URL('../托马斯/9.json', import.meta.url), sourceUrl = new URL('../public/coach/flare-sequence.json', import.meta.url);
const backupBytes = await fs.readFile(backupUrl, 'utf8'), sourceBytes = await fs.readFile(sourceUrl, 'utf8');
const backup = freeze(JSON.parse(backupBytes)), current = clone(bundled);
for (const index of [0, 1, 2, 3, 8]) current.steps[index].pose.pelvis[0] += .01 + index * .001;
current.title = 'Current animation — retain';
current.pointer = { zoom: .9, picked: current.steps[3].id };
for (const step of current.steps) step.custom = { pointer: [1, 2], keep: 'original metadata' };
const edits = createTransitionEdits(current);
edits.enabled = false;edits.interpolation = 'linear';edits.legPath = 'linear';
edits.points = [
  { id: 'keep-k-a', name: 'Existing K A', segment: 0, at: .25, pose: clone(current.steps[0].pose), pointer: { x: .3, y: .4 } },
  { id: 'keep-k-b', name: 'Existing K B', segment: 2, at: .7, pose: clone(current.steps[2].pose), skipped: true },
];
edits.footCurves = [
  { id: 'keep-curve-a', side: 'left', from: { kind: 'step', id: current.steps[0].id },
    to: { kind: 'point', id: 'keep-k-a' }, bend: [.01, .03, -.02], custom: { keep: true } },
  { id: 'keep-curve-b', side: 'right', from: { kind: 'step', id: current.steps[2].id },
    to: { kind: 'step', id: current.steps[3].id }, bend: [.01, -.01, .02] },
];
edits.skippedSteps = [0, 3, 4, 8];
edits.draft = { segment: 2, at: .1, name: 'Retain unsaved pose', pose: clone(current.steps[2].pose) };
edits.extra = { pointer: { fromKey: 'keep-k-a', toKey: 'keep-k-b' } };
freeze(current);freeze(edits);
const currentBefore = clone(current), editsBefore = clone(edits), backupBefore = clone(backup), bundledBefore = clone(bundled);
const metadata = step => Object.fromEntries(Object.entries(step).filter(([key]) => key !== 'pose'));

check('Real 9.json is a 13-step pose library; exact source IDs expose 09, 10 and 11', () => {
  assert.equal(backup.format, 'flare-pose-library');assert.equal(backup.steps.length, 13);
  const choices = getOfficialRecoveryFrames(current, backup);
  assert.equal(choices.length, 9);
  for (const [index, backupIndex] of [[0, 8], [1, 9], [2, 10], [8, 8]]) {
    assert.equal(choices[index].available, true);assert.equal(choices[index].backupIndex, backupIndex);
    assert.deepEqual(choices[index].pose, backup.steps[backupIndex].pose);
  }
  assert.deepEqual(choices[0].linkedIndices, [0, 8]);assert.deepEqual(choices[8].linkedIndices, [0, 8]);
  assert.equal(choices[5].available, false);assert.match(choices[5].reason, /没有/);
});

let restored;
check('Restoring 09, 10 and 11 replaces four poses and synchronizes previously unequal 09 ends', () => {
  restored = restoreOfficialFrames(current, edits, backup, [0, 1, 2]);
  assert.deepEqual(restored.restoredIndices, [0, 1, 2, 8]);assert.deepEqual(restored.restoredStepNumbers, [9, 10, 11]);
  for (const [index, backupIndex] of [[0, 8], [1, 9], [2, 10], [8, 8]]) assert.deepEqual(restored.sequence.steps[index].pose, backup.steps[backupIndex].pose);
  assert.equal(samePose(restored.sequence.steps[0].pose, restored.sequence.steps[8].pose), true);
  assert.notEqual(restored.sequence.steps[0].pose, restored.sequence.steps[8].pose);
});
check('Recovery preserves every other pose, ID, number, timing and node metadata', () => {
  for (const index of [3, 4, 5, 6, 7]) assert.deepEqual(restored.sequence.steps[index], current.steps[index]);
  assert.deepEqual(restored.sequence.steps.map(metadata), current.steps.map(metadata));
  const expected = clone(current);for (const index of restored.restoredIndices) expected.steps[index].pose = clone(restored.sequence.steps[index].pose);
  expected.source = { ...expected.source, origin: 'browser-keyframe-edit' };
  assert.deepEqual(restored.sequence, expected);assert.equal(restored.sequence.period, current.period);
});
check('Only the transition base changes; K, curves, skips, settings, pointers and draft remain exact', () => {
  const beforePayload = clone(edits), afterPayload = clone(restored.document);delete beforePayload.base;delete afterPayload.base;
  assert.deepEqual(afterPayload, beforePayload);assert.equal(compatibleTransitionEdits(restored.document, restored.sequence), true);
  assert.equal(compatibleTransitionEdits(edits, current), true);
});
check('Selecting only closing 09 synchronizes its matching source and retains every other pose', () => {
  const result = restoreOfficialFrames(current, edits, backup, [8]);
  assert.deepEqual(result.restoredIndices, [0, 8]);assert.deepEqual(result.sequence.steps[0].pose, backup.steps[8].pose);
  assert.deepEqual(result.sequence.steps[8].pose, backup.steps[8].pose);
  for (let index = 1; index < 8; index++) assert.deepEqual(result.sequence.steps[index], current.steps[index]);
});
check('Formal-loop and complete animation backups resolve exact formal IDs despite duplicate 09 source IDs', () => {
  for (const value of [bundled, { ...createTransitionEdits(bundled), sequence: clone(bundled) }]) {
    const choices = getOfficialRecoveryFrames(current, value);
    assert.equal(choices.every(choice => choice.available), true);
    assert.deepEqual(choices.map(choice => choice.backupIndex), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const result = restoreOfficialFrames(current, edits, value, [0, 1, 2]);
    assert.deepEqual(result.sequence.steps[0].pose, bundled.steps[0].pose);
    assert.deepEqual(result.document.points, edits.points);
  }
});
check('Backup file order and names never determine the restored frame', () => {
  const shuffled = clone(backup);shuffled.steps.reverse();for (const step of shuffled.steps) step.name = 'Misleading frame 09';
  const result = restoreOfficialFrames(current, edits, shuffled, [0, 1, 2]);
  assert.deepEqual(result.sequence, restored.sequence);assert.deepEqual(result.document, restored.document);
  const renamedIds = clone(backup);for (const step of renamedIds.steps) step.id = 'different-' + step.id;
  assert.equal(getOfficialRecoveryFrames(current, renamedIds).some(choice => choice.available), false);
  assert.throws(() => restoreOfficialFrames(current, edits, renamedIds, [0]), /没有/);
});
check('Exact sourceStepId fields can match after library IDs change; duplicate matches stay unavailable', () => {
  const withSources = clone(backup);for (const step of withSources.steps) { step.sourceStepId = step.id;step.id = 'backup-' + step.id; }
  assert.equal(getOfficialRecoveryFrames(current, withSources)[1].available, true);
  assert.deepEqual(restoreOfficialFrames(current, edits, withSources, [1]).sequence.steps[1].pose, backup.steps[9].pose);
  withSources.steps.push({ ...clone(withSources.steps[9]), id: 'second-version' });
  assert.equal(getOfficialRecoveryFrames(current, withSources)[1].available, false);
  assert.throws(() => restoreOfficialFrames(current, edits, withSources, [1]), /重复/);
});
check('Duplicate IDs, contradictory source identities and invalid selected poses cannot recover', () => {
  const duplicate = clone(backup);duplicate.steps.push(clone(duplicate.steps[9]));
  assert.equal(getOfficialRecoveryFrames(current, duplicate)[1].available, false);
  assert.throws(() => restoreOfficialFrames(current, edits, duplicate, [0, 1]), /重复/);
  const contradict = clone(bundled);contradict.steps[1].sourceStepId = current.steps[2].sourceStepId;
  assert.equal(getOfficialRecoveryFrames(current, contradict)[1].available, false);
  assert.throws(() => restoreOfficialFrames(current, edits, contradict, [1]), /不一致|不同原帧/);
  assert.equal(getOfficialRecoveryFrames(current, contradict)[2].available, false);
  const conflictingLibrary = clone(backup);conflictingLibrary.steps[9].sourceStepId = current.steps[2].sourceStepId;
  assert.equal(getOfficialRecoveryFrames(current, conflictingLibrary)[1].available, false);
  assert.throws(() => restoreOfficialFrames(current, edits, conflictingLibrary, [1]), /不同原帧/);
  for (const modify of [pose => { pose.pelvis[0] = NaN; }, pose => { pose.bodyQuaternion = [0, 0, 0, 0]; },
    pose => { pose.limbs.left.handLocked = 'true'; }, pose => { delete pose.limbs.right.ankle; },
    pose => { pose.pelvisQuaternion = [0, 0, 0, 0]; }]) {
    const invalid = clone(backup);modify(invalid.steps[9].pose);const before = clone(invalid);
    assert.equal(getOfficialRecoveryFrames(current, invalid)[1].available, false);
    assert.throws(() => restoreOfficialFrames(current, edits, invalid, [0, 1]), /无效/);
    assert.deepEqual(invalid, before);
  }
});
check('Conflicting backup copies of one source frame are unavailable even when only one end is selected', () => {
  const conflicting = clone(bundled);conflicting.steps[8].pose.pelvis[0] += .1;
  assert.equal(getOfficialRecoveryFrames(current, conflicting)[0].available, false);
  assert.equal(getOfficialRecoveryFrames(current, conflicting)[8].available, false);
  assert.throws(() => restoreOfficialFrames(current, edits, conflicting, [0, 8]), /同一来源帧/);
  assert.throws(() => restoreOfficialFrames(current, edits, conflicting, [0]), /同一来源帧/);
  assert.deepEqual(restoreOfficialFrames(current, edits, conflicting, [1]).sequence.steps[1].pose, bundled.steps[1].pose);
});
check('Missing selections, bad indices, unsupported formats and incomplete backups reject without changes', () => {
  for (const indices of [null, undefined, [], [0, 0], [-1], [9], [.5], ['0'], [NaN], [Infinity]]) {
    assert.throws(() => restoreOfficialFrames(current, edits, backup, indices));
  }
  for (const value of [null, {}, [], { ...backup, version: 2 }, { ...backup, steps: [] },
    { ...backup, steps: new Array(201).fill(backup.steps[0]) }, createTransitionEdits(current),
    { ...createTransitionEdits(current), sequence: { ...bundled, period: 8 } }]) {
    assert.throws(() => getOfficialRecoveryFrames(current, value));
    assert.throws(() => restoreOfficialFrames(current, edits, value, [0]));
  }
  const badSequence = clone(current);badSequence.steps[1].id = badSequence.steps[0].id;
  const badSource = clone(current);badSource.source = [];
  for (const value of [null, badSequence, badSource]) assert.throws(() => getOfficialRecoveryFrames(value, backup));
});
check('Invalid current transition data reject before returning any partial recovery', () => {
  const badEdits = clone(edits);badEdits.base.steps[1].pose.pelvis[0] += 1;
  assert.throws(() => restoreOfficialFrames(current, badEdits, backup, [0, 1, 2]), /另一组/);
  const invalidK = clone(edits);invalidK.points[0].pose.version = 2;
  assert.throws(() => restoreOfficialFrames(current, invalidK, backup, [0, 1, 2]), /无效/);
});
check('Optional fields remain raw; recovery uses no geometric normalization', () => {
  const value = clone(backup), pose = value.steps[9].pose;
  pose.bodyQuaternion = pose.bodyQuaternion.map(number => number * 2);pose.pelvisQuaternion = [.1, .2, 0, .9];
  pose.torsoQuaternion = [0, .1, 0, .95];pose.limbs.left.kneeTwist = .2;pose.limbs.right.elbowTwist = -.3;
  const result = restoreOfficialFrames(current, edits, value, [1]);assert.deepEqual(result.sequence.steps[1].pose, pose);
});
check('Candidates and outputs are independent copies of all frozen arguments', () => {
  const choices = getOfficialRecoveryFrames(current, backup);choices[1].pose.pelvis[0] = 123;
  const result = restoreOfficialFrames(current, edits, backup, [0, 1, 2]);
  result.sequence.steps[0].pose.pelvis[0] = 123;result.sequence.steps[3].custom.pointer[0] = 123;
  result.sequence.source.stepIds[0] = 'changed';result.document.points[0].pose.pelvis[0] = 123;
  assert.notEqual(result.sequence.steps[8].pose.pelvis[0], 123);
  assert.deepEqual(current, currentBefore);assert.deepEqual(edits, editsBefore);assert.deepEqual(backup, backupBefore);
  assert.deepEqual(bundled, bundledBefore);
});
check('Legacy transition defaults can rebase while retaining unknown document fields', () => {
  const legacy = clone(edits);delete legacy.interpolation;
  const result = restoreOfficialFrames(current, legacy, backup, [1]);
  assert.equal(result.document.interpolation, 'smooth');assert.equal(Object.hasOwn(legacy, 'interpolation'), false);
  assert.deepEqual(result.document.extra, legacy.extra);
  assert.deepEqual(result.document, rebaseTransitionEdits(legacy, current, result.sequence));
});
assert.equal(await fs.readFile(backupUrl, 'utf8'), backupBytes);
assert.equal(await fs.readFile(sourceUrl, 'utf8'), sourceBytes);
console.log(JSON.stringify({ pass: true, checks: checks.length, restoredIndices: restored.restoredIndices,
  restoredStepNumbers: restored.restoredStepNumbers,
  scope: 'Pure selective original-frame recovery using real 9.json; no browser, storage, backup or asset writes.' }, null, 2));
