import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createFlareSequence } from '../src/flare-sequence.js';
import { segmentGuideMatches, segmentGuideWeight, evaluateSegmentArc, evaluateSegmentOrbit, validateSegmentGuides } from '../src/segment-guides.js';
import { createTransitionEdits, validateTransitionEdits, rebaseTransitionEdits, transitionOptions,
  saveTransitionEdits, loadTransitionEdits, saveOfficialFrameEdits, TRANSITION_STORAGE_KEY } from '../src/transition-edits.js';
import { mirrorPose } from '../src/pose-mirror.js';

const sourceURL = new URL('../public/coach/flare-sequence.json', import.meta.url);
const sourceBytes = await fs.readFile(sourceURL, 'utf8'), source = JSON.parse(sourceBytes);
const clone = value => structuredClone(value), smooth = value => value * value * (3 - 2 * value);
const hash = value => createHash('sha256').update(value).digest('hex');
const ref = index => ({ kind: 'step', id: source.steps[index].id });
const pointRef = point => ({ kind: 'point', id: point.id });
const guide = (id, from, to, timing = 'linear') => ({ id, from, to, timing,
  bends: { pelvis: [.03, .09, -.02], leftAnkle: [.08, .16, -.04] }, bendAngles: { leftKnee: .24 }, note: { retain: true } });
const firstGuide = guide('segment-first', ref(0), ref(1));
const k = { id: 'segment-K', segment: 0, at: .37, pose: clone(source.steps[1].pose), name: 'existing saved K' };
k.pose.pelvis[0] += .04;k.pose.bodyQuaternion = k.pose.bodyQuaternion.map(value => -2 * value);
const checks = [], failures = [];
let assertions = 0, legacySamples = 0;
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label);assertions++; }
function close(actual, expected, label, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);assertions++;
}
function near(actual, expected, label) {
  if (typeof expected === 'number') { close(actual, expected, label);return; }
  if (expected && typeof expected === 'object') {
    equal(Object.keys(actual), Object.keys(expected), label + ' fields');
    for (const key of Object.keys(expected)) near(actual[key], expected[key], label + '.' + key);
  } else equal(actual, expected, label);
}
function throws(action, label) { assert.throws(action, label);assertions++; }
function freeze(value) {
  if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }
  return value;
}
function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)), removeItem: key => data.delete(key), data };
}
function mapGuide(pose, { guide: selected, blend }) {
  const next = clone(pose), weight = segmentGuideWeight(blend);
  for (const [joint, bend] of Object.entries(selected.bends ?? {})) {
    const target = joint === 'pelvis' ? next.pelvis : next.limbs[joint.startsWith('left') ? 'left' : 'right'][joint.endsWith('Ankle') ? 'ankle' : 'wrist'];
    for (let index = 0; index < 3; index++) target[index] += bend[index] * weight;
  }
  return next;
}
// Captured immediately before adding segmentGuides to the production sampler.
// This fixture includes full poses, old query APIs, K boundaries, skips, wrap,
// foot curves, mapTransition, and both legacy timing modes.
const legacyHash = 'e686b2b321705e6a704d920a954dfce6dadb94bac6b5d8ca01cfb8cd2e4fa498';
function legacyFixture() {
  const points = [
    { id: 'segment-legacy-K', segment: 0, at: .37, pose: clone(source.steps[1].pose) },
    { id: 'segment-wrap-K', segment: 8, at: .53, pose: clone(source.steps[6].pose) },
  ];
  points[0].pose.torsoQuaternion = [0, Math.sin(.08), 0, Math.cos(.08)];
  points[1].pose.limbs.left.kneeTwist = .17;
  const curves = [{ id: 'segment-legacy-foot', side: 'left', from: ref(2), to: ref(3), bend: [.1, .2, -.05] }];
  const results = [];
  for (const interpolation of ['linear', 'smooth']) for (const [name, options] of [
    ['plain', {}], ['K', { corrections: points }], ['skip', { corrections: points, skippedSteps: [1, 2] }],
    ['wrap', { corrections: points, skippedSteps: [0, 8] }], ['curves', { footCurves: curves }],
    ['mapped', { corrections: points, mapTransition: (pose, { blend }) => { pose.pelvis[0] += .025 * blend;return pose; } }],
  ]) {
    const settings = { period: source.period, interpolation, ...options };
    const sequence = createFlareSequence(source.steps, settings);
    const explicit = createFlareSequence(source.steps, { ...settings, segmentGuides: [],
      mapGuidedTransition: () => { throw new Error('An empty guide list must not call the guided mapper.'); } });
    const times = [...Array.from({ length: 101 }, (_, index) => -2.75 + index * .143), 0, 1, 8, 9, .37, 8.53, .37 - 1e-10, .37 + 1e-10];
    results.push({ name: interpolation + '-' + name, results: times.map(time => {
      const pose = sequence.sample(time);
      equal(explicit.sample(time), pose, 'Explicit empty guide list preserves complete old sampling');legacySamples++;
      equal(explicit.spanAt(time), sequence.spanAt(time), 'Empty guide span');
      equal(explicit.guideAt(time), null, 'Empty guide query');
      return { time, pose, span: sequence.spanAt(time), step: sequence.stepAt(time), transition: sequence.transitionAt(time) };
    }) });
  }
  return results;
}

check('All 12 pre-change configurations retain the exact frozen no-guide sampling and query hash', () => {
  equal(hash(JSON.stringify(legacyFixture())), legacyHash, 'No-guide sampling changed');
});
check('Guide identity, weight, bounds, metadata and deep copies are validated', () => {
  const inputs = freeze([clone(firstGuide)]), validated = validateSegmentGuides(inputs, source);
  equal(validated, inputs);validated[0].bends.leftAnkle[0] = 8;validated[0].note.retain = false;
  equal(inputs[0], firstGuide, 'Validation returns isolated copies');
  equal(segmentGuideMatches(firstGuide, { from: { ...ref(0), pose: source.steps[0].pose }, to: ref(1) }), true);
  equal(segmentGuideMatches(firstGuide, { from: ref(1), to: ref(0) }), false);
  equal(segmentGuideMatches(firstGuide, { from: { kind: 'point', id: ref(0).id }, to: ref(1) }), false);
  equal(segmentGuideMatches(firstGuide, null), false);
  equal(segmentGuideWeight(0), 0);equal(segmentGuideWeight(1), 0);equal(segmentGuideWeight(.5), 1);
  for (const value of [.01, .17, .49, .83, .99]) {
    close(segmentGuideWeight(value), 16 * value ** 2 * (1 - value) ** 2, 'Quartic envelope');
    close(segmentGuideWeight(value), segmentGuideWeight(1 - value), 'Symmetric envelope');
  }
  assert.ok(segmentGuideWeight(1e-6) / 1e-6 < 2e-5, 'Endpoint derivative vanishes');assertions++;
  for (const value of [-.01, 1.01, NaN, Infinity, '0.5']) throws(() => segmentGuideWeight(value));
  const invalid = [null, {}, { ...firstGuide, id: '' }, { ...firstGuide, timing: 'fast' }, { ...firstGuide, from: firstGuide.to },
    { ...firstGuide, from: { kind: 'step', id: 'not-current' } }, { ...firstGuide, to: { kind: 'unknown', id: 'invalid' } },
    { ...firstGuide, bends: [] }, { ...firstGuide, bends: { pelvis: [0, 0] } },
    { ...firstGuide, bends: { leftWrist: [0, Infinity, 0] } }, { ...firstGuide, bends: { rightAnkle: [10.00001, 0, 0] } },
    { ...firstGuide, bendAngles: [] }, { ...firstGuide, bendAngles: { rightElbow: 2 * Math.PI + 1e-8 } },
    { ...firstGuide, bendAngles: { leftKnee: '0' } }];
  for (const item of invalid) throws(() => validateSegmentGuides([item], source));
  throws(() => validateSegmentGuides(null, source));
  throws(() => validateSegmentGuides(Array.from({ length: 201 }, (_, index) => ({ ...firstGuide, id: 'overflow-' + index })), source));
  throws(() => validateSegmentGuides([firstGuide, { ...firstGuide, id: 'duplicate-pair' }], source));
  throws(() => validateSegmentGuides([firstGuide, { ...firstGuide, from: ref(1), to: ref(2) }], source));
  equal(validateSegmentGuides([{ ...firstGuide, bends: { pelvis: [-10, 0, 10] }, bendAngles: { leftKnee: -2 * Math.PI, rightElbow: 2 * Math.PI } }], source).length, 1);
  equal(validateSegmentGuides([{ ...firstGuide, to: { kind: 'point', id: 'missing-but-retained-K' } }], source).length, 1);
});
check('A guide overrides only its adjacent span timing, and public queries use the same blend', () => {
  for (const globalTiming of ['linear', 'smooth']) for (const spanTiming of ['linear', 'smooth']) {
    const selected = { ...firstGuide, timing: spanTiming };
    const guided = createFlareSequence(source.steps, { period: source.period, interpolation: globalTiming, segmentGuides: [selected] });
    const expected = createFlareSequence(source.steps, { period: source.period, interpolation: spanTiming });
    const baseline = createFlareSequence(source.steps, { period: source.period, interpolation: globalTiming });
    for (const time of [.1, .25, .6, .91]) {
      equal(guided.sample(time), expected.sample(time), 'Guide controls timing even without a rig callback');
      const queried = guided.guideAt(time);equal(queried.guide, selected);
      close(queried.span.blend, spanTiming === 'linear' ? time : smooth(time), 'Guided query timing');
      equal(guided.spanAt(time), queried.span, 'Span and guide query agree');
    }
    for (const time of [1.15, 3.63, 8.25]) equal(guided.sample(time), baseline.sample(time), 'Other spans retain global interpolation');
  }
});
check('Mapping order is old mapping, foot curve, then guided mapper with isolated saved inputs', () => {
  const calls = [], foot = { id: 'ordered-foot', side: 'left', from: ref(0), to: ref(1), bend: [.01, .02, .03] };
  let observed, finalPose;
  const values = freeze([clone(firstGuide)]), sequence = createFlareSequence(freeze(clone(source.steps)), {
    period: source.period, interpolation: 'smooth', segmentGuides: values, footCurves: [foot],
    mapTransition(pose, context) { calls.push('old');pose.pelvis[0] += .01;context.start.pelvis[0] = 111;return pose; },
    resolveFootEndpoint(pose, side) { calls.push('foot');return pose.limbs[side].ankle.map((value, index) => value + (index === 1 ? .025 : 0)); },
    mapGuidedTransition(pose, context) {
      calls.push('guide');observed = clone({ pose, context });
      context.start.pelvis[0] = 222;context.end.pelvis[0] = 333;context.guide.bends.pelvis[0] = 9;
      context.span.from.pose.pelvis[0] = 444;
      finalPose = clone(pose);finalPose.pelvis[2] += .05;return finalPose;
    },
  });
  const pose = sequence.sample(.25);equal(calls, ['old', 'foot', 'foot', 'guide']);
  equal(pose, finalPose);assert.strictEqual(pose, finalPose, 'Fresh owned guided pose retains transient identity');assertions++;
  equal(observed.context.start, source.steps[0].pose);equal(observed.context.end, source.steps[1].pose);
  equal(observed.context.time, .25);equal(observed.context.guide, firstGuide);equal(observed.context.blend, .25);
  const start = source.steps[0].pose.limbs.left.ankle, end = source.steps[1].pose.limbs.left.ankle;
  for (let index = 0; index < 3; index++) close(observed.pose.limbs.left.ankle[index],
    start[index] * .75 + end[index] * .25 + 4 * .25 * .75 * foot.bend[index] + (index === 1 ? .025 : 0), 'Foot override precedes guided mapping');
  equal(sequence.steps, source.steps);equal(values[0], firstGuide);equal(sequence.guideAt(.25).guide, firstGuide);
  const queried = sequence.guideAt(.25);queried.guide.bends.pelvis[0] = 9;queried.span.to.pose.pelvis[0] = 999;
  equal(sequence.guideAt(.25).guide, firstGuide);equal(sequence.sample(1), source.steps[1].pose);
  throws(() => createFlareSequence(source.steps, { mapGuidedTransition: true }));
  throws(() => createFlareSequence(source.steps, { segmentGuides: [firstGuide], mapGuidedTransition: () => ({}) }).sample(.25));
});
check('All original and K raw anchors bypass mappings, with next and previous queries retaining exact endpoints', () => {
  const before = guide('before-K', ref(0), pointRef(k), 'smooth'), after = guide('after-K', pointRef(k), ref(1));
  let calls = 0;
  const sequence = createFlareSequence(source.steps, { period: source.period, corrections: [k], segmentGuides: [before, after],
    mapGuidedTransition: (pose, context) => { calls++;return mapGuide(pose, context); } });
  for (const cycle of [-2, 0, 3]) {
    for (let index = 0; index < source.steps.length; index++) equal(sequence.sample(index + cycle * source.period), source.steps[index].pose, 'Exact original retains raw fields');
    equal(sequence.sample(k.at + cycle * source.period), k.pose, 'Exact K retains its non-unit signed quaternion');
  }
  equal(calls, 0, 'Exact anchors never invoke guided mapping');
  equal(sequence.guideAt(k.at).guide.id, after.id);equal(sequence.guideAt(k.at, { prefer: 'previous' }).guide.id, before.id);
  equal(sequence.guideAt(k.at, 'previous').span.blend, 1);equal(sequence.guideAt(k.at, 'next').span.blend, 0);
  throws(() => sequence.guideAt(.25, { prefer: 'invalid' }));throws(() => sequence.guideAt(.25, []));
  for (const [time, start, end, selected] of [[.185, 0, k.at, before], [.685, k.at, 1, after]]) {
    close(sequence.guideAt(time).span.blend, selected.timing === 'linear' ? (time - start) / (end - start) : smooth((time - start) / (end - start)), 'Guide timing resets to its own active pair');
  }
});
check('Inserted K and missing references keep routes dormant without crossing a saved interior pose', () => {
  const missing = guide('missing', { kind: 'point', id: 'removed-K' }, ref(1));
  const baseline = createFlareSequence(source.steps, { period: source.period, corrections: [k] });
  const sequence = createFlareSequence(source.steps, { period: source.period, corrections: [k], segmentGuides: [firstGuide, missing],
    mapGuidedTransition: () => { throw new Error('Dormant guide must not apply.'); } });
  for (const time of [.12, .37, .55, .9, 2]) {
    equal(sequence.sample(time), baseline.sample(time), 'Existing K takes priority over broad old route');equal(sequence.guideAt(time), null);
  }
  const restored = createFlareSequence(source.steps, { period: source.period, segmentGuides: [firstGuide], mapGuidedTransition: mapGuide });
  equal(restored.guideAt(.5).guide, firstGuide, 'Route reactivates when the same pair becomes adjacent again');
});
check('Skipped originals use active neighboring pairs and guided local timing without changing saved steps', () => {
  const long = guide('skip-long', ref(0), ref(3), 'smooth'), skippedSteps = [1, 2];
  const sequence = createFlareSequence(source.steps, { period: source.period, skippedSteps, interpolation: 'linear', segmentGuides: [firstGuide, long], mapGuidedTransition: mapGuide });
  const baseline = createFlareSequence(source.steps, { period: source.period, skippedSteps, interpolation: 'smooth' });
  for (const time of [.4, 1, 2, 2.8]) {
    const queried = sequence.guideAt(time);equal(queried.guide, long);close(queried.span.blend, smooth(time / 3), 'Long skipped span local timing');
    const expected = mapGuide(baseline.sample(time), { guide: long, blend: smooth(time / 3) });equal(sequence.sample(time), expected);
  }
  equal(sequence.steps, source.steps);equal(sequence.sample(3), source.steps[3].pose);
  const disabledEndpoint = createFlareSequence(source.steps, { period: source.period, skippedSteps, segmentGuides: [firstGuide] });
  equal(disabledEndpoint.guideAt(1.5), null);
});
check('Directed wrap, negative times, K-only and single-anchor sampling retain deterministic behavior', () => {
  const wrap = guide('wrap-route', ref(7), ref(1)), skippedSteps = [0, 8];
  const sequence = createFlareSequence(source.steps, { period: source.period, skippedSteps, segmentGuides: [wrap], mapGuidedTransition: mapGuide });
  for (const time of [-1.7, -.5, .5, 7.3, 8.5, 9.5, 17.5]) {
    const queried = sequence.guideAt(time);equal(queried.guide, wrap);
    const progress = (time - queried.span.startTime) / (queried.span.endTime - queried.span.startTime);
    close(queried.span.blend, progress, 'Unfolded wrap timing');near(sequence.sample(time), sequence.sample(time + source.period), 'Loop repeats within input-time arithmetic precision');
  }
  const only = createFlareSequence(source.steps, { period: source.period, skippedSteps: source.steps.map((_, index) => index), corrections: [k], segmentGuides: [firstGuide] });
  for (const time of [0, .2, 4, -1]) { equal(only.sample(time), k.pose);equal(only.guideAt(time), null); }
  const second = { ...clone(k), id: 'only-second-K', segment: 5, at: .4 };
  const kGuide = guide('only-K-pair', pointRef(k), pointRef(second), 'smooth');
  const kOnly = createFlareSequence(source.steps, { period: source.period, skippedSteps: source.steps.map((_, index) => index), corrections: [k, second], segmentGuides: [kGuide] });
  close(kOnly.guideAt(2).span.blend, smooth((2 - .37) / (5.4 - .37)), 'K-only local blend');
});
check('Sample results do not depend on query order and caller mutations never change saved inputs', () => {
  const original = clone(source), entries = [clone(firstGuide)], sequence = createFlareSequence(source.steps, {
    period: source.period, segmentGuides: entries, mapGuidedTransition: mapGuide });
  const times = [.05, .17, .29, .51, .73, .92, 1, 2, 8.8], forward = times.map(time => sequence.sample(time));
  entries[0].bends.leftAnkle[0] = 9;
  for (const index of [8, 2, 5, 0, 7, 1, 6, 4, 3]) equal(sequence.sample(times[index]), forward[index], 'Random-order pure replay');
  const altered = sequence.sample(.5);altered.pelvis[0] = 999;
  equal(sequence.sample(.5), mapGuide(createFlareSequence(source.steps, { period: source.period, interpolation: 'linear' }).sample(.5), { guide: firstGuide, blend: .5 }));
  equal(source, original, 'Input sequence retained');
});
check('Transition schema, disabled options, storage round trips and rebase preserve guides and all other data', () => {
  const document = createTransitionEdits(source);
  document.points = [clone(k)];document.segmentGuides = [guide('document-before-K', ref(0), pointRef(k))];
  document.footCurves = [{ id: 'document-foot', side: 'right', from: pointRef(k), to: ref(1), bend: [0, .1, 0] }];
  document.skippedSteps = [4];document.draft = { segment: 3, at: .2, pose: clone(source.steps[3].pose), name: 'Keep original draft' };
  const original = clone(document), validated = validateTransitionEdits(freeze(clone(document)), source);
  equal(validated, original);equal(transitionOptions(validated).segmentGuides, document.segmentGuides);
  equal(Object.hasOwn(transitionOptions({ ...document, enabled: false }), 'segmentGuides'), false, 'Disabled routes are preserved but not sampled');
  const legacy = createTransitionEdits(source);equal(Object.hasOwn(validateTransitionEdits(legacy, source), 'segmentGuides'), false, 'No implicit new field in old document');
  equal(validateTransitionEdits({ ...legacy, segmentGuides: [] }, source).segmentGuides, []);
  throws(() => validateTransitionEdits({ ...document, segmentGuides: [{ ...firstGuide, from: { kind: 'step', id: 'other-sequence' } }] }, source));
  const storage = memoryStorage();saveTransitionEdits(document, source, storage);equal(loadTransitionEdits(source, storage), document, 'Storage retains current optional fields');
  equal(JSON.parse(JSON.stringify(document)).segmentGuides, document.segmentGuides, 'JSON backup round trip');
  const next = clone(source);next.steps[2].pose.pelvis[0] += .015;
  const rebased = rebaseTransitionEdits(document, source, next);equal(rebased.segmentGuides, document.segmentGuides);
  const unchanged = clone(rebased);unchanged.base = clone(document.base);equal(unchanged, original, 'Only document base changes');
  const saved = saveOfficialFrameEdits(next, rebased, storage);equal(saved, rebased);
  equal(loadTransitionEdits(source, storage), document, 'Previous source-specific transition entry retained');
  equal(loadTransitionEdits(next, storage), rebased, 'New source entry contains the same guides and draft');
  equal(document, original, 'Persistence does not mutate input');
  const before = clone([...storage.data]), failing = {
    getItem: storage.getItem, removeItem: storage.removeItem,
    setItem(key, value) { if (key === TRANSITION_STORAGE_KEY) throw new Error('Simulated transition save failure');storage.setItem(key, value); },
  };
  const failedNext = clone(next);failedNext.steps[3].pose.pelvis[0] += .01;
  throws(() => saveOfficialFrameEdits(failedNext, rebaseTransitionEdits(rebased, next, failedNext), failing));
  equal([...storage.data], before, 'Failed guided save restores both official and transition records');
});
check('Optional upper-arm and thigh twists interpolate and mirror without adding fields to old poses', () => {
  const steps = clone(source.steps), a = steps[0].pose, b = steps[1].pose;
  a.limbs.left.upperArmTwist = .2;b.limbs.left.upperArmTwist = .6;
  a.limbs.right.thighTwist = Math.PI - .1;b.limbs.right.thighTwist = -Math.PI + .1;
  const sequence = createFlareSequence(steps, { period: source.period, interpolation: 'linear' });
  close(sequence.sample(.25).limbs.left.upperArmTwist, .3, 'Upper-arm twist interpolates');
  close(sequence.sample(.5).limbs.right.thighTwist, Math.PI, 'Thigh twist uses shortest signed arc');
  const mirrored = mirrorPose(a);equal(mirrored.limbs.right.upperArmTwist, -.2);equal(mirrored.limbs.left.thighTwist, -(Math.PI - .1));
  equal(mirrorPose(mirrored), a, 'New twist fields survive double reflection');
  const old = createFlareSequence(source.steps, { period: source.period }).sample(.4);
  for (const side of ['left', 'right']) for (const key of ['upperArmTwist', 'thighTwist']) equal(Object.hasOwn(old.limbs[side], key), false, 'Optional twists do not appear in old poses');
  for (const key of ['upperArmTwist', 'thighTwist']) {
    const invalid = clone(source.steps);invalid[0].pose.limbs.left[key] = NaN;throws(() => createFlareSequence(invalid));
  }
});

check('Direct smooth arcs preserve exact endpoints, their real midpoint, and isolated input values', () => {
  const start = freeze([-0, .3, -.4]), end = freeze([.7, .8, .9]), bend = freeze([.2, -.3, .4]);
  const first = evaluateSegmentArc(start, end, bend, 0), last = evaluateSegmentArc(start, end, bend, 1);
  equal(first, start);equal(last, end);
  assert.notStrictEqual(first, start, 'Start endpoint is an isolated copy');assertions++;
  assert.notStrictEqual(last, end, 'End endpoint is an isolated copy');assertions++;
  equal(Object.is(first[0], -0), true, 'Exact signed-zero endpoint is retained');
  const middle = evaluateSegmentArc(start, end, bend, .5);
  for (let axis = 0; axis < 3; axis++) close(middle[axis], (start[axis] + end[axis]) / 2 + bend[axis], 'Actual arc midpoint offset');
  for (let index = 0; index <= 64; index++) {
    const progress = index / 64, actual = evaluateSegmentArc(start, end, bend, progress);
    for (let axis = 0; axis < 3; axis++) close(actual[axis],
      start[axis] * (1 - progress) + end[axis] * progress + 4 * progress * (1 - progress) * bend[axis], 'Direct two-anchor quadratic');
  }
  const straight = evaluateSegmentArc(start, end, [0, 0, 0], .3);
  for (let axis = 0; axis < 3; axis++) close(straight[axis], .7 * start[axis] + .3 * end[axis], 'Zero bend is a direct chord, not a legacy route');
  first[1] = 999;last[2] = 999;middle[0] = 999;
  equal(start, [-0, .3, -.4]);equal(end, [.7, .8, .9]);equal(bend, [.2, -.3, .4]);
});
check('Smooth arc tangents are continuous and its second differences equal the constant quadratic acceleration', () => {
  const start = [.12, .34, -.56], end = [.78, -.22, .19], bend = [.2, -.3, .4], h = .001;
  const derivative = progress => end.map((value, axis) => value - start[axis] + 4 * (1 - 2 * progress) * bend[axis]);
  for (const progress of [.01, .1, .25, .49, .5, .51, .75, .9, .99]) {
    const left = evaluateSegmentArc(start, end, bend, progress - h), current = evaluateSegmentArc(start, end, bend, progress);
    const right = evaluateSegmentArc(start, end, bend, progress + h), tangent = derivative(progress);
    for (let axis = 0; axis < 3; axis++) {
      close((right[axis] - left[axis]) / (2 * h), tangent[axis], 'Interior tangent follows one continuous derivative', 2e-10);
      close((right[axis] - 2 * current[axis] + left[axis]) / h ** 2, -8 * bend[axis], 'Constant second difference', 3e-9);
    }
  }
  const tangentBefore = derivative(.5 - h), tangentAfter = derivative(.5 + h);
  for (let axis = 0; axis < 3; axis++) close(tangentAfter[axis] - tangentBefore[axis], -16 * h * bend[axis], 'No midpoint tangent branch');
  const first = evaluateSegmentArc(start, end, bend, 0), next = evaluateSegmentArc(start, end, bend, h);
  const previous = evaluateSegmentArc(start, end, bend, 1 - h), last = evaluateSegmentArc(start, end, bend, 1);
  for (let axis = 0; axis < 3; axis++) {
    close((next[axis] - first[axis]) / h, derivative(0)[axis] - 4 * h * bend[axis], 'Finite endpoint tangent', 2e-10);
    close((last[axis] - previous[axis]) / h, derivative(1)[axis] + 4 * h * bend[axis], 'Finite endpoint tangent', 2e-10);
  }
  for (const progress of [0, .25, .5, .75, 1]) equal(evaluateSegmentArc(start, start, [0, 0, 0], progress), start, 'Stationary direct path is finite');
});
check('Smooth-path schema rejects malformed known controls atomically while preserving unknown metadata', () => {
  const selected = { ...clone(firstGuide), smoothPaths: {
    pelvis: { bend: [.1, .2, -.3], label: 'Keep control metadata' },
    leftAnkle: { bend: [-10, 0, 10], future: { mode: 'Keep nested metadata' } },
    customMetadata: { keep: true },
  } };
  const original = clone(selected), copy = validateSegmentGuides(freeze([clone(selected)]), source)[0];
  equal(copy, selected);copy.smoothPaths.pelvis.bend[0] = 8;copy.smoothPaths.leftAnkle.future.mode = 'Changed';
  equal(selected, original, 'Smooth-path validation never mutates its input');
  const badPaths = [null, [], 'curve', { pelvis: null }, { pelvis: [] }, { pelvis: {} }, { leftAnkle: { bend: [0, 0] } },
    { rightAnkle: { bend: [0, 0, '0'] } }, { leftWrist: { bend: [NaN, 0, 0] } },
    { rightWrist: { bend: [0, Infinity, 0] } }, { pelvis: { bend: [10.00000001, 0, 0] } },
    { leftAnkle: { bend: [-10.00000001, 0, 0] } }];
  const badPositions = [[0, 0], [0, 0, undefined], [0, 0, '0'], [0, Infinity, 0], [NaN, 0, 0]];
  for (const value of badPositions) {
    throws(() => evaluateSegmentArc(value, [0, 0, 0], [0, 0, 0], .5));
    throws(() => evaluateSegmentArc([0, 0, 0], value, [0, 0, 0], .5));
  }
  for (const value of [null, [0, 0], [10.00000001, 0, 0], [0, -Infinity, 0]]) throws(() => evaluateSegmentArc([0, 0, 0], [1, 1, 1], value, .5));
  for (const value of [-.01, 1.01, NaN, Infinity, '.5']) throws(() => evaluateSegmentArc([0, 0, 0], [1, 1, 1], [0, 0, 0], value));
  const document = { ...createTransitionEdits(source), segmentGuides: [clone(selected)] }, storage = memoryStorage();
  saveTransitionEdits(document, source, storage);const stored = clone([...storage.data]);
  for (const smoothPaths of badPaths) {
    const invalid = { ...clone(selected), smoothPaths }, before = clone(invalid);
    throws(() => validateSegmentGuides([firstGuide, { ...invalid, id: 'invalid-second', from: ref(1), to: ref(2) }], source));
    equal(invalid, before, 'Whole validation rejects before mutating input');
    throws(() => saveTransitionEdits({ ...document, segmentGuides: [invalid] }, source, storage));
    equal([...storage.data], stored, 'Rejected smooth path leaves stored document untouched');
    throws(() => createFlareSequence(source.steps, { period: source.period, segmentGuides: [invalid] }));
  }
});
check('Smooth paths survive sequence queries, JSON export, storage, source rebase, and empty-field compatibility', () => {
  const selected = { ...clone(firstGuide), smoothPaths: { rightAnkle: { bend: [.11, .22, -.07], note: 'Saved midpoint' } } };
  const document = { ...createTransitionEdits(source), points: [clone(k)],
    segmentGuides: [{ ...selected, to: pointRef(k) }], draft: { segment: 4, at: .33, pose: clone(source.steps[4].pose) } };
  const queriedSequence = createFlareSequence(source.steps, { period: source.period, segmentGuides: [selected] });
  equal(queriedSequence.guideAt(.5).guide, selected, 'Sequence query retains direct paths');
  const exported = JSON.parse(JSON.stringify({ ...document, sequence: source }));
  equal(exported.segmentGuides, document.segmentGuides, 'JSON export includes direct paths and their metadata');
  equal(validateTransitionEdits(exported, source).segmentGuides, document.segmentGuides, 'Exported document remains valid');
  const storage = memoryStorage();saveTransitionEdits(document, source, storage);
  equal(loadTransitionEdits(source, storage), document, 'Direct paths and existing K/draft round trip');
  const changed = clone(source);changed.steps[2].pose.pelvis[0] += .018;
  const rebased = rebaseTransitionEdits(document, source, changed);
  equal(rebased.segmentGuides, document.segmentGuides, 'Rebase keeps direct paths');equal(rebased.points, document.points);equal(rebased.draft, document.draft);
  saveOfficialFrameEdits(changed, rebased, storage);equal(loadTransitionEdits(changed, storage), rebased);
  const options = { period: source.period, segmentGuides: [firstGuide], mapGuidedTransition: mapGuide };
  const before = createFlareSequence(source.steps, options), empty = createFlareSequence(source.steps, {
    ...options, segmentGuides: [{ ...clone(firstGuide), smoothPaths: {} }],
  });
  for (const time of [0, .1, .31, .5, .73, .99, 1, 2, 8.8]) equal(empty.sample(time), before.sample(time), 'Absent/empty smooth-path controls retain existing guide behavior');
  equal(validateSegmentGuides([firstGuide], source)[0], firstGuide, 'Validation never introduces smoothPaths into old records');
});

check('Orbit paths follow exact circular short/long routes or a linearly changing radius about their center', () => {
  const center = freeze([.4, .2, -.3]), start = freeze([1.4, .2, -.3]), end = freeze([.4, 1.2, -.3]);
  const original = clone({ center, start, end });
  for (const arc of ['short', 'long']) {
    const path = freeze({ center, arc, normal: [1, 0, 0], note: 'Natural endpoint plane ignores this nonmatching hint' });
    const angle = arc === 'short' ? Math.PI / 2 : -3 * Math.PI / 2;
    const beginning = evaluateSegmentOrbit(start, end, path, 0), ending = evaluateSegmentOrbit(start, end, path, 1);
    equal(beginning, start);equal(ending, end);
    assert.notStrictEqual(beginning, start);assertions++;assert.notStrictEqual(ending, end);assertions++;
    for (let index = 0; index <= 64; index++) {
      const progress = index / 64, actual = evaluateSegmentOrbit(start, end, path, progress);
      close(Math.hypot(...actual.map((value, axis) => value - center[axis])), 1, 'Equal endpoint radii retain a circle');
      close(actual[0], center[0] + Math.cos(angle * progress), 'Circular X');
      close(actual[1], center[1] + Math.sin(angle * progress), 'Circular Y');close(actual[2], center[2], 'Natural orbit plane');
      equal(actual, evaluateSegmentOrbit(start, end, { center, arc }, progress), 'Nondegenerate normal does not override the actual endpoint plane');
    }
    const shortStart = [.5, 0, 0], longEnd = [0, 1.7, 0];
    for (const progress of [.1, .25, .5, .75, .9]) {
      const point = evaluateSegmentOrbit(shortStart, longEnd, { center: [0, 0, 0], arc }, progress), radius = .5 * (1 - progress) + 1.7 * progress;
      close(Math.hypot(...point), radius, 'Unequal radii interpolate linearly');
      close(point[0], radius * Math.cos(angle * progress), 'Variable-radius X');close(point[1], radius * Math.sin(angle * progress), 'Variable-radius Y');
    }
  }
  equal(evaluateSegmentOrbit(start, end, { center }, .3), evaluateSegmentOrbit(start, end, { center, arc: 'short' }, .3), 'Omitted arc is short');
  equal({ center, start, end }, original, 'Orbit computation leaves its inputs intact');
});
check('Degenerate orbit planes use deterministic normals without NaNs or dependence on playback order', () => {
  const center = [0, 0, 0], a = [1, 0, 0], opposite = [-1, 0, 0];
  for (const arc of ['short', 'long']) {
    const path = { center, arc, normal: [0, 0, 1] }, direction = arc === 'short' ? 1 : -1;
    const middle = evaluateSegmentOrbit(a, opposite, path, .5);
    close(middle[0], 0, 'Antipodal midpoint X');close(middle[1], direction, 'Antipodal normal chooses the half circle');close(middle[2], 0, 'Antipodal midpoint plane');
    equal(evaluateSegmentOrbit(a, opposite, path, 0), a);equal(evaluateSegmentOrbit(a, opposite, path, 1), opposite);
    const times = [.01, .17, .31, .49, .51, .73, .91, .99], forward = times.map(time => evaluateSegmentOrbit(a, opposite, path, time));
    for (const index of [7, 2, 5, 0, 6, 1, 4, 3]) equal(evaluateSegmentOrbit(a, opposite, path, times[index]), forward[index], 'Random-order orbital sampling');
    for (const time of times) {
      equal(evaluateSegmentOrbit(a, opposite, { center, arc, normal: [0, 0, 1e300] }, time), evaluateSegmentOrbit(a, opposite, path, time), 'Very large normal has the same plane');
      equal(evaluateSegmentOrbit(a, opposite, { center, arc, normal: [0, 0, 1e-320] }, time), evaluateSegmentOrbit(a, opposite, path, time), 'Very small nonzero normal has the same plane');
      const fallback = evaluateSegmentOrbit(a, opposite, { center, arc }, time);
      equal(evaluateSegmentOrbit(a, opposite, { center, arc, normal: [1, 0, 0] }, time), fallback, 'Parallel normal uses deterministic perpendicular fallback');
      assert.ok(fallback.every(Number.isFinite));assertions++;close(Math.hypot(...fallback), 1, 'Default plane retains radius');
    }
  }
  const same = [.1234, .5678, -.9101], sameCenter = [.1, -.1, .2];
  for (const progress of [0, .13, .5, .77, 1]) equal(evaluateSegmentOrbit(same, same, { center: sameCenter }, progress), same, 'Same endpoint short arc is exactly stationary');
  const fullLoop = evaluateSegmentOrbit(a, a, { center, arc: 'long', normal: [0, 0, 1] }, .5);
  close(fullLoop[0], -1, 'Same endpoint long arc makes a full circle');close(fullLoop[1], 0, 'Full-circle midpoint');
  for (const progress of [.1, .3, .5, .9]) {
    near(evaluateSegmentOrbit(a, [2, 0, 0], { center }, progress), [1 + progress, 0, 0], 'Same-direction short route changes only radius within arithmetic precision');
    const spiral = evaluateSegmentOrbit(a, [2, 0, 0], { center, arc: 'long', normal: [0, 0, 1] }, progress);
    close(Math.hypot(...spiral), 1 + progress, 'Same-direction long route retains linear radius');
  }
});
check('Near-parallel, near-antipodal, very close and tiny orbit endpoints stay finite and exact at anchors', () => {
  for (const epsilon of [1e-6, 1e-9, 1e-12, 1e-15]) for (const opposite of [false, true]) for (const arc of ['short', 'long']) {
    const start = freeze([1, 0, 0]), end = freeze([opposite ? -Math.cos(epsilon) : Math.cos(epsilon), Math.sin(epsilon), 0]);
    const angle = opposite ? Math.PI - epsilon : epsilon, rotation = arc === 'short' ? angle : angle - 2 * Math.PI;
    const path = freeze({ center: [0, 0, 0], arc, normal: [0, 1, 0] });
    equal(evaluateSegmentOrbit(start, end, path, 0), start);equal(evaluateSegmentOrbit(start, end, path, 1), end);
    for (const progress of [.01, .25, .5, .75, .99]) {
      const value = evaluateSegmentOrbit(start, end, path, progress);
      assert.ok(value.every(Number.isFinite));assertions++;
      close(Math.hypot(...value), 1, 'Near-degenerate radius');close(value[0], Math.cos(rotation * progress), 'Natural near-degenerate X', 2e-15);
      close(value[1], Math.sin(rotation * progress), 'Natural near-degenerate Y', 2e-15);close(value[2], 0, 'Nonzero endpoint cross chooses natural plane');
    }
  }
  for (const scale of [1e-20, 1e-100, 1e-200, 1e-300]) {
    const start = [scale, 0, 0], end = [0, scale, 0], path = { center: [0, 0, 0], normal: [0, 0, 1] };
    equal(evaluateSegmentOrbit(start, end, path, 0), start);equal(evaluateSegmentOrbit(start, end, path, 1), end);
    const middle = evaluateSegmentOrbit(start, end, path, .5);assert.ok(middle.every(Number.isFinite));assertions++;
    close(middle[0] / scale, Math.SQRT1_2, 'Tiny-radius X', 2e-15);close(middle[1] / scale, Math.SQRT1_2, 'Tiny-radius Y', 2e-15);
  }
  const signed = evaluateSegmentOrbit([1, -0, 0], [0, 1, -0], { center: [0, 0, 0] }, 1);
  equal(Object.is(signed[2], -0), true, 'Exact orbit endpoint signed zero is retained');
});
check('Orbit schema strictly validates known fields and rejects bad imports or center collisions without mutating data', () => {
  const selected = { ...clone(firstGuide), orbitPaths: {
    pelvis: { center: [.1, .2, .3], extra: { keep: true } }, leftAnkle: { center: [-10, 0, 10], arc: 'long', normal: [0, 0, 2], label: 'Keep custom label' },
    customMetadata: { note: 'Retained unknown metadata' },
  } };
  const validated = validateSegmentGuides(freeze([clone(selected)]), source);
  equal(validated[0], selected);equal(Object.hasOwn(validated[0].orbitPaths.pelvis, 'arc'), false, 'Default short arc is not inserted into stored records');
  equal(Object.hasOwn(validated[0].orbitPaths.pelvis, 'normal'), false, 'Fallback normal is not inserted into stored records');
  validated[0].orbitPaths.pelvis.center[0] = 9;validated[0].orbitPaths.leftAnkle.label = 'Changed';
  equal(selected.orbitPaths.pelvis.center, [.1, .2, .3]);equal(selected.orbitPaths.leftAnkle.label, 'Keep custom label');
  const badPaths = [null, [], 'circle', { pelvis: null }, { pelvis: [] }, { pelvis: {} }, { pelvis: { center: [0, 0] } },
    { leftAnkle: { center: [0, Infinity, 0] } }, { rightAnkle: { center: [10.00000001, 0, 0] } },
    { leftWrist: { center: [0, 0, 0], arc: 'circle' } }, { rightWrist: { center: [0, 0, 0], arc: undefined } },
    { pelvis: { center: [0, 0, 0], normal: [0, 0, 0] } }, { leftAnkle: { center: [0, 0, 0], normal: [0, NaN, 1] } },
    { rightAnkle: { center: [0, 0, 0], normal: [0, 1] } }, { leftWrist: { center: [0, 0, 0], normal: [1, Infinity, 0] } },
    { rightWrist: { center: [0, 0, 0], normal: ['1', 0, 0] } }];
  const document = { ...createTransitionEdits(source), segmentGuides: [clone(selected)] }, storage = memoryStorage();
  saveTransitionEdits(document, source, storage);const stored = clone([...storage.data]);
  for (const orbitPaths of badPaths) {
    const invalid = { ...clone(selected), orbitPaths }, before = clone(invalid);
    throws(() => validateSegmentGuides([invalid], source));equal(invalid, before, 'Orbit validation never mutates invalid source');
    throws(() => saveTransitionEdits({ ...document, segmentGuides: [invalid] }, source, storage));equal([...storage.data], stored, 'Invalid orbit import is atomic');
    throws(() => createFlareSequence(source.steps, { period: source.period, segmentGuides: [invalid] }));
  }
  for (const progress of [0, .5, 1]) {
    throws(() => evaluateSegmentOrbit([0, 0, 0], [1, 0, 0], { center: [0, 0, 0] }, progress), 'Center colliding with start is refused');
    throws(() => evaluateSegmentOrbit([1, 0, 0], [0, 0, 0], { center: [0, 0, 0] }, progress), 'Center colliding with end is refused');
  }
  for (const path of [null, {}, { center: [0, 0] }, { center: [0, 0, 0], normal: [0, 0, 0] }, { center: [0, 0, 0], arc: 'circle' }]) {
    throws(() => evaluateSegmentOrbit([1, 0, 0], [0, 1, 0], path, .5));
  }
  for (const progress of [-.1, 1.1, NaN, Infinity, '.5']) throws(() => evaluateSegmentOrbit([1, 0, 0], [0, 1, 0], { center: [0, 0, 0] }, progress));
});
check('Orbit records survive query/storage/export/rebase and omitted or empty orbit fields retain existing smooth paths', () => {
  const selected = { ...clone(firstGuide), smoothPaths: { leftAnkle: { bend: [.1, .2, .3], note: 'Keep legacy smooth path' } },
    orbitPaths: { leftAnkle: { center: [.1, .2, -.3], arc: 'long', normal: [0, 1, 0], note: { custom: true } } } };
  const document = { ...createTransitionEdits(source), points: [clone(k)], draft: { segment: 5, at: .33, pose: clone(source.steps[5].pose) },
    segmentGuides: [{ ...selected, to: pointRef(k) }] };
  const queried = createFlareSequence(source.steps, { period: source.period, segmentGuides: [selected] });
  equal(queried.guideAt(.5).guide, selected, 'Sampler query preserves orbital and old smooth records');
  const exported = JSON.parse(JSON.stringify({ ...document, sequence: source }));
  equal(exported.segmentGuides, document.segmentGuides);equal(validateTransitionEdits(exported, source).segmentGuides, document.segmentGuides);
  const storage = memoryStorage();saveTransitionEdits(document, source, storage);equal(loadTransitionEdits(source, storage), document);
  const changed = clone(source);changed.steps[3].pose.pelvis[0] += .012;
  const rebased = rebaseTransitionEdits(document, source, changed);equal(rebased.segmentGuides, document.segmentGuides);
  equal(rebased.points, document.points);equal(rebased.draft, document.draft);
  saveOfficialFrameEdits(changed, rebased, storage);equal(loadTransitionEdits(changed, storage), rebased);equal(loadTransitionEdits(source, storage), document);
  const oldGuide = { ...clone(firstGuide), smoothPaths: { leftAnkle: { bend: [.1, .2, .3] } } };
  const options = { period: source.period, segmentGuides: [oldGuide], mapGuidedTransition: mapGuide };
  const before = createFlareSequence(source.steps, options), empty = createFlareSequence(source.steps, { ...options, segmentGuides: [{ ...oldGuide, orbitPaths: {} }] });
  for (const time of [0, .1, .31, .5, .73, .99, 1, 2, 8.8]) equal(empty.sample(time), before.sample(time), 'Empty orbit paths preserve existing complete guide output');
  equal(validateSegmentGuides([oldGuide], source)[0], oldGuide, 'Validation does not introduce orbital controls in old data');
});

const finalBytes = await fs.readFile(sourceURL, 'utf8');
check('Original source asset bytes remain unchanged', () => equal(finalBytes, sourceBytes));
const report = { passed: failures.length === 0, groups: checks.length, assertions, legacySamples,
  frozenLegacyHash: legacyHash, sourceHash: hash(sourceBytes), checks, failures };
// Preserve the earlier guide/smooth-path reports while recording this round.
const reportURL = new URL('../output/playwright/segment-orbit-guides-verification.json', import.meta.url);
await fs.mkdir(new URL('.', reportURL), { recursive: true });await fs.writeFile(reportURL, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
if (failures.length) process.exitCode = 1;
