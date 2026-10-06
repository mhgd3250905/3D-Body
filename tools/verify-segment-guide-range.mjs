import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { planSegmentGuideRange, buildSegmentGuideDraft } from '../src/segment-guide-range.js';
import { createTransitionEdits, validateTransitionEdits } from '../src/transition-edits.js';
import { segmentGuideMatches } from '../src/segment-guides.js';

const sourceURL = new URL('../public/coach/flare-sequence.json', import.meta.url);
const sourceBytes = await fs.readFile(sourceURL, 'utf8'), source = JSON.parse(sourceBytes);
const clone = value => structuredClone(value), hash = value => createHash('sha256').update(value).digest('hex');
const checks = [], failures = [];let assertions = 0;
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label);assertions++; }
function ok(actual, label) { assert.ok(actual, label);assertions++; }
function rejects(action, match) { assert.throws(action, match);assertions++; }
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }return value; }
function noPoses(value) {
  if (value && typeof value === 'object') { ok(!Object.hasOwn(value, 'pose'));for (const child of Object.values(value)) noPoses(child); }
}
const ref = index => ({ kind: 'step', id: source.steps[index].id });
const pointRef = id => ({ kind: 'point', id });
const plain = createTransitionEdits(source);
const points = [
  { id: 'segment-early-K', segment: 0, at: .25, name: '开始抬脚', pose: clone(source.steps[0].pose) },
  { id: 'segment-middle-K', segment: 1, at: .6, name: '弯向确认', pose: clone(source.steps[1].pose) },
  { id: 'segment-wrap-K', segment: 8, at: .5, name: '循环末端', pose: clone(source.steps[8].pose) },
];
const document = { ...plain, points, draft: { segment: 3, at: .3, name: '未保存草稿', pose: clone(source.steps[3].pose) },
  footCurves: [{ id: 'retained-foot', side: 'left', from: ref(4), to: ref(5), bend: [.02, .03, -.01] }],
  view: { allJoints: true, nested: ['保留', 1] }, skippedSteps: [] };
const original = clone({ source, document });
const plan = (startTime, endTime, edits = document, sequence = source) => planSegmentGuideRange(sequence, edits, { startTime, endTime });
const pairIds = range => range.spans.map(span => [span.from.id, span.to.id]);
const times = range => range.anchors.map(anchor => anchor.time);
const draft = (edits = document, range = { startTime: 0, endTime: 2 }, options = {}) => buildSegmentGuideDraft(source, edits, range,
  { createId: (_, index) => `new-guide-${index}`, ...options });

check('09→10 and 09→11 split at every original saved boundary, keeping the two 09 identities', () => {
  const adjacent = plan(0, 1, plain);equal(adjacent.spans.length, 1);equal(pairIds(adjacent), [[source.steps[0].id, source.steps[1].id]]);
  const wide = plan(0, 2, plain);equal(times(wide), [0, 1, 2]);equal(pairIds(wide), [[source.steps[0].id, source.steps[1].id], [source.steps[1].id, source.steps[2].id]]);
  equal(wide.spans.map(span => span.label), ['原第 09 步 → 原第 10 步', '原第 10 步 → 原第 11 步']);
  const closure = plan(8, 9, plain);equal(closure.spans.length, 1);equal(closure.spans[0].from, ref(8));equal(closure.spans[0].to, ref(0));
  ok(closure.spans[0].from.id !== closure.spans[0].to.id);equal(times(closure), [8, 9]);equal(closure.anchors.map(anchor => anchor.clock), [8, 0]);
});

check('Wide original ranges and K→K selections keep all enabled internal K and original poses as boundaries', () => {
  const wide = plan(0, 2);equal(times(wide), [0, .25, 1, 1.6, 2]);equal(wide.spans.length, 4);
  equal(pairIds(wide), [[source.steps[0].id, points[0].id], [points[0].id, source.steps[1].id], [source.steps[1].id, points[1].id], [points[1].id, source.steps[2].id]]);
  const kToK = plan(.25, 1.6);equal(times(kToK), [.25, 1, 1.6]);equal(kToK.spans[0].from, pointRef(points[0].id));equal(kToK.spans.at(-1).to, pointRef(points[1].id));
  equal(kToK.spans.map(span => span.label), ['K 帧 · 开始抬脚 → 原第 10 步', '原第 10 步 → K 帧 · 弯向确认']);
});

check('Forward wrap and previous-cycle times preserve ordered adjacent spans, including the 8→9 hold', () => {
  const wrap = plan(7, 11);equal(times(wrap), [7, 8, 8.5, 9, 9.25, 10, 10.6, 11]);equal(wrap.spans.length, 7);
  equal(wrap.anchors.map(anchor => anchor.cycle), [0, 0, 0, 1, 1, 1, 1, 1]);
  for (const span of wrap.spans) ok(span.endTime > span.startTime);
  const previous = plan(-2, 2);equal(times(previous), [-2, -1, -.5, 0, .25, 1, 1.6, 2]);
  equal(previous.anchors.map(anchor => anchor.clock), [7, 8, 8.5, 0, .25, 1, 1.6, 2]);
  equal(plan(-1, 0, plain).spans[0], { from: ref(8), to: ref(0), startTime: -1, endTime: 0, label: '原第 09 步 → 原第 09 步' });
  const full = plan(0, 9, plain);equal(full.spans.length, 9);equal(full.spans.at(-1).from, ref(8));equal(full.spans.at(-1).to, ref(0));
});

check('Skipped originals and K frames are excluded internally and rejected as editable boundaries', () => {
  const edits = { ...clone(document), skippedSteps: [1] };edits.points[0].skipped = true;
  equal(times(plan(0, 2, edits)), [0, 1.6, 2]);equal(plan(0, 2, edits).spans[0].from, ref(0));equal(plan(0, 2, edits).spans[0].to, pointRef(points[1].id));
  rejects(() => plan(1, 2, edits), /起点.*启用.*关键帧/u);rejects(() => plan(0, .25, edits), /终点.*启用.*关键帧/u);
  const off = { ...clone(document), enabled: false };
  equal(times(plan(0, 2, off)), [0, 1, 2]);rejects(() => plan(.25, 1, off), /起点.*启用/u);
  rejects(() => draft(off), /先启用/u);equal(off.enabled, false);equal(off.points, document.points);
});

check('One active identity cannot form a self-loop, but two distinct active identities can close a whole cycle', () => {
  const one = { ...clone(plain), skippedSteps: [1, 2, 3, 4, 5, 6, 7, 8] };
  rejects(() => plan(0, 9, one), /两个不同.*启用/u);
  const two = { ...clone(plain), skippedSteps: [1, 2, 3, 4, 5, 6, 7] };
  const range = plan(0, 9, two);equal(times(range), [0, 8, 9]);equal(range.spans.length, 2);
  for (const span of range.spans) ok(span.from.id !== span.to.id);
});

check('Metadata planning never reads poses, drafts, guides or unrelated sequence fields', () => {
  const trap = () => { throw new Error('Unexpected data access'); };
  const sequence = { period: source.period, steps: source.steps.map(step => ({ id: step.id, sourceStepNumber: step.sourceStepNumber })) };
  const edits = { enabled: true, points: points.map(({ id, segment, at, name }) => ({ id, segment, at, name })) };
  for (const step of sequence.steps) Object.defineProperty(step, 'pose', { get: trap });
  for (const point of edits.points) Object.defineProperty(point, 'pose', { get: trap });
  for (const field of ['draft', 'segmentGuides', 'unknown']) Object.defineProperty(edits, field, { get: trap });
  Object.defineProperty(sequence, 'source', { get: trap });
  const range = plan(0, 2, edits, sequence);equal(times(range), [0, .25, 1, 1.6, 2]);noPoses(range);
});

check('Draft creation changes only guide records and preserves every pose, point, curve, draft and unknown field', () => {
  const input = freeze(clone(document)), sequence = freeze(clone(source));
  const created = buildSegmentGuideDraft(sequence, input, { startTime: 0, endTime: 2 }, { createId: (_, index) => `new-guide-${index}` });
  equal(created.createdIds, ['new-guide-0', 'new-guide-1', 'new-guide-2', 'new-guide-3']);equal(created.document.segmentGuides.length, 4);
  equal(created.document.points, document.points);equal(created.document.base, document.base);equal(created.document.draft, document.draft);
  equal(created.document.footCurves, document.footCurves);equal(created.document.skippedSteps, document.skippedSteps);equal(created.document.view, document.view);
  const { segmentGuides, ...retained } = created.document;equal(retained, document);
  for (const [index, guide] of segmentGuides.entries()) {
    equal(guide.id, created.createdIds[index]);equal(guide.timing, 'linear');equal(guide.bends, {});equal(guide.bendAngles, {});ok(segmentGuideMatches(guide, created.spans[index]));
  }
  equal(validateTransitionEdits(created.document, source), created.document);
  created.document.points[0].pose.pelvis[0] += .1;created.document.draft.name = 'changed';created.document.view.nested.push('changed');
  equal(input, document);equal(sequence, source);
});

check('Existing scoped and dormant guides retain exact timing, controls, identity and metadata; reverse pairs are distinct', () => {
  const range = plan(0, 2);
  const existing = { id: 'existing-scoped', from: range.spans[0].from, to: range.spans[0].to, timing: 'smooth',
    bends: { rightAnkle: [.1, .05, -.1], custom: { keep: true } }, bendAngles: { rightKnee: -.4 }, metadata: ['keep', { version: 1 }] };
  const dormant = { id: 'existing-dormant', from: pointRef('removed-K'), to: ref(6), timing: 'smooth', bends: {}, note: 'Do not remove' };
  const reverse = { id: 'existing-reverse', from: range.spans[0].to, to: range.spans[0].from, timing: 'smooth' };
  const edits = { ...clone(document), segmentGuides: [existing, dormant, reverse] }, before = clone(edits);
  const created = draft(edits);equal(created.document.segmentGuides.slice(0, 3), before.segmentGuides);
  equal(created.document.segmentGuides.length, 6);equal(created.createdIds, ['new-guide-1', 'new-guide-2', 'new-guide-3']);
  equal(created.document.segmentGuides[0].timing, 'smooth');equal(created.document.segmentGuides[0].bends, existing.bends);
  const repeated = draft(created.document);equal(repeated.document, created.document);equal(repeated.createdIds, []);
  equal(edits, before);
});

check('An older UI plan is re-planned around newly saved keys instead of replacing their hard boundary', () => {
  const stale = plan(0, 2, plain), edits = clone(document);
  const oldGuide = { id: 'earlier-wide-pair', from: ref(0), to: ref(1), timing: 'smooth', bends: { pelvis: [0, .1, 0] } };
  edits.segmentGuides = [oldGuide];
  const created = draft(edits, stale);equal(times(created), [0, .25, 1, 1.6, 2]);equal(created.spans.length, 4);
  equal(created.document.segmentGuides[0], oldGuide);equal(created.document.segmentGuides.length, 5);
  ok(!created.spans.some(span => segmentGuideMatches(oldGuide, span)), 'Old wide guide bypassed a newly saved K frame');
});

check('Default ids are independent, requested timing applies only to new guides, and period scaling is supported', () => {
  const first = buildSegmentGuideDraft(source, plain, { startTime: 0, endTime: 1 });
  const second = buildSegmentGuideDraft(source, plain, { startTime: 0, endTime: 1 });
  ok(first.createdIds[0] !== second.createdIds[0]);ok(/^segment-guide-/u.test(first.createdIds[0]));
  const smooth = draft(document, { startTime: .25, endTime: 1.6 }, { timing: 'smooth' });
  equal(smooth.document.segmentGuides.map(guide => guide.timing), ['smooth', 'smooth']);
  const scaled = { ...clone(source), period: 18 };
  const range = plan(14, 22, document, scaled);equal(times(range), [14, 16, 17, 18, 18.5, 20, 21.2, 22]);
  equal(range.spans[0].from, ref(7));equal(range.spans.at(-1).to, ref(2));
});

check('Invalid ranges, duplicate time/guide identities and storage limits fail without mutating inputs', () => {
  for (const range of [null, [], {}, { startTime: '0', endTime: 1 }, { startTime: 0, endTime: NaN }, { startTime: -Infinity, endTime: 1 },
    { startTime: 0, endTime: 0 }, { startTime: 2, endTime: 1 }, { startTime: 0, endTime: 10 }, { startTime: 1e100, endTime: 1e100 + 1 }]) {
    rejects(() => planSegmentGuideRange(source, document, range));
  }
  rejects(() => plan(.1, 1), /起点.*启用/u);rejects(() => plan(0, .9), /终点.*启用/u);
  const duplicateTime = clone(document);duplicateTime.points.push({ ...clone(points[0]), id: 'other-at-same-time' });
  rejects(() => plan(0, 2, duplicateTime), /时间顺序/u);rejects(() => plan(.25, 1, duplicateTime), /多个启用/u);
  rejects(() => draft(document, { startTime: 0, endTime: 2 }, { timing: 'random' }));
  rejects(() => draft(document, { startTime: 0, endTime: 2 }, { createId: 'bad' }));
  rejects(() => draft(document, { startTime: 0, endTime: 2 }, { createId: () => 'same-id' }), /独立/u);
  rejects(() => draft(document, { startTime: 0, endTime: 1 }, { createId: () => '' }), /非空/u);
  const existing = { id: 'duplicate-guide', from: ref(4), to: ref(5), timing: 'linear' };
  rejects(() => draft({ ...clone(document), segmentGuides: [existing, { ...clone(existing), id: 'second-id' }] }), /重复指定/u);
  const capacity = { ...clone(document), segmentGuides: Array.from({ length: 200 }, (_, index) =>
    ({ id: `capacity-${index}`, from: pointRef(`missing-from-${index}`), to: pointRef(`missing-to-${index}`), timing: 'linear' })) };
  rejects(() => draft(capacity), /200/u);equal(capacity.segmentGuides.length, 200);
  equal({ source, document }, original);
});

equal(await fs.readFile(sourceURL, 'utf8'), sourceBytes, 'Formal sequence source bytes changed');
const report = { pass: failures.length === 0, passed: checks.filter(check => check.pass).length, total: checks.length, assertions, checks, failures,
  sourceSha256: hash(sourceBytes), moduleSha256: hash(await fs.readFile(new URL('../src/segment-guide-range.js', import.meta.url))),
  scope: 'Pure adjacent enabled-anchor planning and reversible document preparation only; preserves original/K poses, guides, curves, draft and unknown metadata, supports wrap/negative times, and rejects disabled/ambiguous boundaries without creating frames.' };
const output = new URL('../output/playwright/segment-guide-range-verification.json', import.meta.url);
await fs.mkdir(new URL('.', output), { recursive: true });await fs.writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, assertions, failures, report: output.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
