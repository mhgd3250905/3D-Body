import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { getTrajectoryAnchors, resolveTrajectoryRange } from '../src/trajectory-range.js';
import { anchorKey } from '../src/foot-curves.js';

const sourceURL = new URL('../public/coach/flare-sequence.json', import.meta.url), sourceBytes = await fs.readFile(sourceURL, 'utf8');
const source = JSON.parse(sourceBytes), originalSource = structuredClone(source), checks = [], failures = [];
let assertions = 0;
const clone = value => structuredClone(value), hash = value => createHash('sha256').update(value).digest('hex');
const key = index => anchorKey({ kind: 'step', id: source.steps[index].id });
const pointKey = id => anchorKey({ kind: 'point', id });
const document = { enabled: true, skippedSteps: [1], points: [
  { id: 'range-early-K', segment: 0, at: .25, name: '开始抬脚' },
  { id: 'range-middle-K', segment: 1, at: .6, name: '弯向确认', skipped: true },
  { id: 'range-wrap-K', segment: 8, at: .5, name: '循环末端' },
] }, originalDocument = clone(document);
const anchors = getTrajectoryAnchors(source, document);
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label);assertions++; }
function ok(value, label) { assert.ok(value, label);assertions++; }
function rejects(action, label) { assert.throws(action, label);assertions++; }
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function range(fromKey, toKey, values = anchors, period = source.period) { return resolveTrajectoryRange(values, { fromKey, toKey }, period); }
function noPoses(value) {
  if (value && typeof value === 'object') { ok(!Object.hasOwn(value, 'pose'), 'Observation metadata retained a pose');for (const child of Object.values(value)) noPoses(child); }
}
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }return value; }

check('Original nine frames and saved K metadata are sorted, distinct and independent of their poses', () => {
  equal(anchors.length, 12);equal(anchors.filter(anchor => anchor.kind === 'step').length, 9);equal(anchors.filter(anchor => anchor.kind === 'point').length, 3);
  equal(anchors.map(anchor => anchor.time), [0, .25, 1, 1.6, 2, 3, 4, 5, 6, 7, 8, 8.5]);
  const first = anchors.find(anchor => anchor.key === key(0)), last = anchors.find(anchor => anchor.key === key(8));
  ok(first.key !== last.key);ok(first.label.includes('09') && first.label.includes('起点'));ok(last.label.includes('09') && last.label.includes('末帧'));
  equal([first.time, last.time], [0, 8]);noPoses(anchors);
  const sameId = clone(document);sameId.points[0].id = source.steps[0].id;
  const mixed = getTrajectoryAnchors(source, sameId);equal(mixed.length, 12);ok(mixed[0].key !== mixed[1].key, 'Step/K kinds lost their independent identity');
});
check('09→10 and freely selected 09→11 preserve every intermediate saved original/K time', () => {
  const adjacent = range(key(0), key(1));equal([adjacent.startTime, adjacent.endTime, adjacent.wraps], [0, 1, false]);equal(adjacent.includeTimes, [0, .25, 1]);
  const wide = range(key(0), key(2));equal([wide.startTime, wide.endTime, wide.wraps], [0, 2, false]);equal(wide.includeTimes, [0, .25, 1, 1.6, 2]);
  equal(wide.from.key, key(0));equal(wide.to.key, key(2));equal(wide.to.time, wide.endTime);equal(wide.to.clock, 2);noPoses(wide);
});
check('Skipped originals and skipped/disabled K remain selectable observation boundaries', () => {
  const skipped = anchors.find(anchor => anchor.key === key(1)), point = anchors.find(anchor => anchor.key === pointKey('range-middle-K'));
  equal([skipped.skipped, skipped.disabled, skipped.active], [true, false, false]);ok(skipped.label.includes('已跳过'));
  equal([point.skipped, point.disabled, point.active], [true, false, false]);
  equal(range(key(1), key(2)).includeTimes, [1, 1.6, 2]);equal(range(point.key, key(2)).includeTimes, [1.6, 2]);
  const off = getTrajectoryAnchors(source, { ...document, enabled: false });
  for (const anchor of off.filter(anchor => anchor.kind === 'point')) { equal(anchor.disabled, true);equal(anchor.active, false);ok(anchor.label.includes('已停用')); }
  equal(off.find(anchor => anchor.key === key(0)).active, true);equal(off.find(anchor => anchor.key === key(0)).disabled, false);
  equal(range(key(0), key(2), off).includeTimes, [0, .25, 1, 1.6, 2]);
});
check('Reverse chronological choices unfold forward across one cycle, including both distinct 09 nodes and wrap K', () => {
  const wrapped = range(key(7), key(2));equal([wrapped.startTime, wrapped.endTime, wrapped.wraps], [7, 11, true]);
  equal(wrapped.includeTimes, [7, 8, 8.5, 9, 9.25, 10, 10.6, 11]);equal([wrapped.from.clock, wrapped.from.time, wrapped.to.clock, wrapped.to.time], [7, 7, 2, 11]);
  const closure = range(key(8), key(0));equal([closure.startTime, closure.endTime, closure.wraps], [8, 9, true]);equal(closure.includeTimes, [8, 8.5, 9]);
  const firstToLast = range(key(0), key(8));equal([firstToLast.startTime, firstToLast.endTime, firstToLast.wraps], [0, 8, false]);
  equal(firstToLast.includeTimes, [0, .25, 1, 1.6, 2, 3, 4, 5, 6, 7, 8]);
  const kWrap = range(pointKey('range-wrap-K'), pointKey('range-early-K'));equal(kWrap.includeTimes, [8.5, 9, 9.25]);equal(kWrap.to.time, 9.25);
});
check('Period scaling, unsorted metadata and duplicate clock times keep includeTimes ordered and exact', () => {
  const scaled = getTrajectoryAnchors({ ...source, period: 18 }, document), selected = range(key(7), key(1), scaled, 18);
  equal([selected.startTime, selected.endTime, selected.wraps], [14, 20, true]);equal(selected.includeTimes, [14, 16, 17, 18, 18.5, 20]);
  const reversed = [...anchors].reverse();equal(range(key(7), key(2), reversed), range(key(7), key(2)));
  const secondAtSameTime = { ...clone(anchors[0]), kind: 'point', id: 'same-clock', key: pointKey('same-clock'), label: '同一时刻的另一身份' };
  const sameClock = range(key(0), secondAtSameTime.key, [...anchors, secondAtSameTime]);
  equal([sameClock.startTime, sameClock.endTime, sameClock.wraps], [0, 9, true]);equal(sameClock.includeTimes.filter(time => time === 0).length, 1);equal(sameClock.includeTimes.at(-1), 9);
});
check('Pose getters, drafts and unrelated metadata are never accessed or returned', () => {
  const pose = { get pose() { throw new Error('Pose must not be read'); } };
  const metadataSequence = { period: 9, steps: source.steps.map(step => ({ id: step.id, sourceStepNumber: step.sourceStepNumber })) };
  for (const step of metadataSequence.steps) Object.defineProperty(step, 'pose', Object.getOwnPropertyDescriptor(pose, 'pose'));
  const metadataDocument = { enabled: true, points: document.points.map(point => ({ ...point })) };
  for (const point of metadataDocument.points) Object.defineProperty(point, 'pose', Object.getOwnPropertyDescriptor(pose, 'pose'));
  Object.defineProperty(metadataDocument, 'draft', { get() { throw new Error('Draft must not be read'); } });
  const safe = getTrajectoryAnchors(metadataSequence, metadataDocument);equal(safe.length, 12);noPoses(safe);
  const external = safe.map(anchor => ({ ...anchor }));for (const anchor of external) Object.defineProperty(anchor, 'pose', Object.getOwnPropertyDescriptor(pose, 'pose'));
  const selected = range(key(0), key(2), external);noPoses(selected);equal(selected.includeTimes, [0, .25, 1, 1.6, 2]);
});
check('Anchor keys survive pose/name/status updates, and callers cannot mutate source or selected metadata', () => {
  const before = clone({ source, document }), changed = clone(source), changedDocument = clone(document);
  changed.steps[2].pose.pelvis[0] += .1;changedDocument.points[0].name = 'New name';changedDocument.enabled = false;
  const after = getTrajectoryAnchors(changed, changedDocument);equal(after.map(anchor => anchor.key), anchors.map(anchor => anchor.key));
  const input = freeze(clone(anchors)), selection = freeze({ fromKey: key(0), toKey: key(2) }), selected = resolveTrajectoryRange(input, selection, source.period);
  selected.from.label = 'changed';selected.to.time = 999;selected.includeTimes.push(999);equal(input, anchors);equal(selection, { fromKey: key(0), toKey: key(2) });
  const data = getTrajectoryAnchors(freeze(clone(source)), freeze(clone(document)));data[0].label = 'changed';equal({ source, document }, before);
});
check('Same/missing selections and malformed consumed metadata fail without changing inputs', () => {
  rejects(() => range(key(0), key(0)));rejects(() => range(key(0), 'removed-key'));
  for (const invalidPeriod of [0, -9, NaN, Infinity, '9']) rejects(() => resolveTrajectoryRange(anchors, { fromKey: key(0), toKey: key(1) }, invalidPeriod));
  for (const selection of [null, {}, [], { fromKey: 0, toKey: key(1) }]) rejects(() => resolveTrajectoryRange(anchors, selection, source.period));
  rejects(() => resolveTrajectoryRange([], { fromKey: key(0), toKey: key(1) }, source.period));
  rejects(() => range(key(0), key(1), [anchors[0], clone(anchors[0])]));
  for (const field of [{ time: -1 }, { time: 9 }, { time: NaN }, { key: 'wrong' }, { active: 'yes' }]) {
    const invalid = clone(anchors);Object.assign(invalid[0], field);rejects(() => range(key(0), key(1), invalid));
  }
  const badSequence = clone(source);badSequence.steps[1].id = badSequence.steps[0].id;rejects(() => getTrajectoryAnchors(badSequence, document));
  for (const patch of [{ skippedSteps: [1, 1] }, { skippedSteps: [9] }, { skippedSteps: null }, { enabled: 'yes' }, { points: null }, { points: [{}] }, { points: [{ ...document.points[0], at: 0 }] },
    { points: [{ ...document.points[0], at: 1 }] }, { points: [{ ...document.points[0], skipped: 'yes' }] }, { points: [document.points[0], document.points[0]] }]) {
    rejects(() => getTrajectoryAnchors(source, { ...document, ...patch }));
  }
  equal(source, originalSource);equal(document, originalDocument);
});
equal(await fs.readFile(sourceURL, 'utf8'), sourceBytes, 'Formal source bytes changed');
const report = { pass: failures.length === 0, passed: checks.filter(check => check.pass).length, total: checks.length, assertions, checks, failures,
  sourceSha256: hash(sourceBytes), moduleSha256: hash(await fs.readFile(new URL('../src/trajectory-range.js', import.meta.url))),
  scope: 'Pure observation metadata and forward range resolution only: all saved original/K times are retained, skipped/disabled boundaries are selectable, first/last 09 identities remain distinct, cross-cycle includeTimes are unfolded, and no pose/draft or animation state is read or modified.' };
const output = new URL('../output/playwright/trajectory-range-verification.json', import.meta.url);await fs.mkdir(new URL('.', output), { recursive: true });await fs.writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, assertions, failures, report: output.pathname }, null, 2));if (!report.pass) process.exitCode = 1;
