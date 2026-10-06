import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createFlareSequence } from '../src/flare-sequence.js';
import { anchorIdentity, anchorKey, sameAnchor, footCurveMatches, evaluateFootCurve, validateFootCurves } from '../src/foot-curves.js';

const sourceURL = new URL('../public/coach/flare-sequence.json', import.meta.url);
const sourceBytes = await fs.readFile(sourceURL, 'utf8'), source = JSON.parse(sourceBytes), original = structuredClone(source);
const checks = [], failures = [], sides = ['left', 'right'];
let assertions = 0, curvedSamples = 0, legacySamples = 0, maximumPositionError = 0;
const hash = value => createHash('sha256').update(value).digest('hex');
const clone = value => structuredClone(value), smooth = x => x * x * (3 - 2 * x);
const ref = (index, steps = source.steps) => ({ kind: 'step', id: steps[index].id });
const pointRef = point => ({ kind: 'point', id: point.id });
const curve = (id, side, from, to, bend = [.12, .24, -.08]) => ({ id, side, from, to, bend });
const timeAt = (coordinate, period = source.period) => coordinate / source.steps.length * period;
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label);assertions++; }
function close(actual, expected, label, tolerance = 1e-11) {
  const error = Math.abs(actual - expected);maximumPositionError = Math.max(maximumPositionError, error);
  assert.ok(error <= tolerance, `${label}: ${actual} vs ${expected}`);assertions++;
}
function position(actual, expected, label) { for (let index = 0; index < 3; index++) close(actual[index], expected[index], label); }
function formula(start, end, bend, blend) { return start.map((value, index) => value * (1 - blend) + end[index] * blend + 4 * blend * (1 - blend) * bend[index]); }
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }return value; }
function onlyAnkleChanged(actual, baseline, side, expected) {
  position(actual.limbs[side].ankle, expected, 'Curved ankle');const remaining = clone(actual);remaining.limbs[side].ankle = clone(baseline.limbs[side].ankle);
  equal(remaining, baseline, 'All non-curve pose fields stay unchanged');curvedSamples++;
}

// This hash was captured before adding foot-curves.js or editing the sampler.
// It covers both timings, near-original K, skipping, wrap, K-only, single-anchor
// and mapping cases. It checks complete poses and old public grid APIs exactly.
const legacyHash = '80126311bc7584a71ae138f08f684710de4f64f384a0df7dbc3557908745b1fe';
const legacyEngineHash = 'c484e702d4ee72d12f3e2338e9e3c6e21ab3a310513d7034b58e0ab4c8be4085';
function legacyFixture() {
  const steps = clone(source.steps), corrections = [
    { id: 'compat-K', segment: 1, at: .37, pose: clone(steps[2].pose) },
    { id: 'compat-wrap-K', segment: 8, at: .61, pose: clone(steps[7].pose) },
    { id: 'compat-near-K', segment: 0, at: 1e-10, pose: clone(steps[1].pose) },
  ];
  for (const [index, point] of corrections.entries()) {
    point.pose.pelvis[0] += .03 * (index + 1);
    point.pose.pelvisQuaternion = [0, Math.sin((index + 1) * .17), 0, Math.cos((index + 1) * .17)];
    point.pose.torsoQuaternion = [Math.sin((index + 1) * .09), 0, 0, Math.cos((index + 1) * .09)];
    point.pose.limbs.left.kneeTwist = .18 * (index + 1);point.pose.bodyQuaternion = point.pose.bodyQuaternion.map(value => -3 * value);
  }
  const cases = [];
  for (const interpolation of ['linear', 'smooth']) for (const [name, options] of [
    ['plain', {}], ['K', { corrections }], ['skip', { corrections, skippedSteps: [2, 3] }], ['wrap', { corrections, skippedSteps: [0, 8] }],
    ['K-only', { corrections, skippedSteps: steps.map((_, index) => index) }], ['one', { skippedSteps: steps.map((_, index) => index).filter(index => index !== 4) }],
    ['mapped', { corrections, mapTransition: (pose, { blend }) => { pose.pelvis[2] += .03 * blend;pose.limbs.right.ankle[1] += .2 * blend;return pose; } }],
  ]) cases.push({ name: interpolation + '-' + name, options: { period: 17.3, interpolation, ...options } });
  const coordinates = [...Array.from({ length: 145 }, (_, index) => -9 + index * .1875), ...steps.map((_, index) => index),
    ...corrections.flatMap(point => [point.segment + point.at, point.segment + point.at - 1e-11, point.segment + point.at + 1e-11])];
  return { steps, cases, coordinates };
}
const k = { id: 'curve-K', segment: 0, at: .37, pose: clone(source.steps[1].pose) };
k.pose.limbs.left.ankle[1] += .18;k.pose.bodyQuaternion = k.pose.bodyQuaternion.map(value => -2 * value);
const leftCurve = curve('left-first', 'left', ref(0), ref(1));

check('All old arithmetic, raw poses and grid APIs match 14 frozen pre-change configurations', () => {
  const fixture = legacyFixture(), results = [];
  for (const test of fixture.cases) {
    const sequence = createFlareSequence(fixture.steps, test.options), explicit = createFlareSequence(fixture.steps, { ...test.options, footCurves: [] });
    const samples = fixture.coordinates.map(coordinate => {
      const time = coordinate / fixture.steps.length * test.options.period, pose = sequence.sample(time);
      equal(explicit.sample(time), pose, 'Explicit empty curves preserve old sampling');legacySamples++;
      return { time, pose, step: sequence.stepAt(time), transition: sequence.transitionAt(time) };
    });
    results.push({ name: test.name, period: sequence.period, keyframes: sequence.keyframes, samples });
  }
  equal(hash(JSON.stringify(results)), legacyHash, 'No-curve outputs changed from their frozen baseline');
});
check('Curve helpers encode directed identities and the actual midpoint displacement', () => {
  const from = { ...ref(0), pose: source.steps[0].pose, time: 0 }, to = { ...ref(1), time: 1 };
  equal(anchorIdentity(from), ref(0));equal(sameAnchor(from, ref(0)), true);equal(sameAnchor(from, { kind: 'point', id: from.id }), false);
  assert.notEqual(anchorKey({ kind: 'point', id: 'step:a' }), anchorKey({ kind: 'step', id: 'point:a' }));assertions++;
  equal(footCurveMatches(leftCurve, { from, to }, 'left'), true);equal(footCurveMatches(leftCurve, { from: to, to: from }, 'left'), false);
  equal(footCurveMatches(leftCurve, { from, to }, 'right'), false);
  const a = freeze([-0, .3, -.4]), b = freeze([.7, .8, .9]), bend = freeze([.2, -.3, .4]);
  equal(evaluateFootCurve(a, b, bend, 0), a);equal(evaluateFootCurve(a, b, bend, 1), b);
  for (const blend of [.13, .5, .84]) position(evaluateFootCurve(a, b, bend, blend), formula(a, b, bend, blend), 'Quadratic curve');
  position(evaluateFootCurve(a, b, bend, .5), a.map((value, index) => (value + b[index]) / 2 + bend[index]), 'Real midpoint');
});
check('Both timing modes curve only the selected foot after interpolation and retain all exact saved anchors', () => {
  for (const interpolation of ['linear', 'smooth']) {
    const base = createFlareSequence(source.steps, { period: source.period, interpolation });
    const sequence = createFlareSequence(source.steps, { period: source.period, interpolation, footCurves: [leftCurve] });
    for (const progress of [.125, .25, .5, .8]) {
      const blend = interpolation === 'linear' ? progress : smooth(progress), time = timeAt(progress);
      onlyAnkleChanged(sequence.sample(time), base.sample(time), 'left', formula(source.steps[0].pose.limbs.left.ankle, source.steps[1].pose.limbs.left.ankle, leftCurve.bend, blend));
      close(sequence.spanAt(time).blend, blend, 'Queried timing blend');close(sequence.curveAt(time, 'left').span.blend, blend, 'Curve timing blend');
    }
    for (let index = 0; index < source.steps.length; index++) for (const cycle of [-2, 0, 3]) equal(sequence.sample(timeAt(index) + cycle * source.period), source.steps[index].pose, 'Original raw anchor');
    for (const time of [1.5, 4.25, 8.4]) { equal(sequence.sample(time), base.sample(time), 'Remote segment');equal(sequence.curveAt(time, 'left'), null); }
    equal(sequence.curveAt(.5, 'right'), null);equal(sequence.steps, source.steps);equal(sequence.keyframes, base.keyframes);
  }
});
check('mapTransition runs first and curve endpoints use isolated resolved IK values without mutating their source', () => {
  const callbackPoses = [], mappingPoses = [], offset = [.021, -.016, .033];let endpointCalls = 0, mappingCalls = 0;
  const sequence = createFlareSequence(freeze(clone(source.steps)), { period: source.period, interpolation: 'linear', footCurves: freeze([clone(leftCurve)]),
    mapTransition(pose, { start, end, blend }) {
      mappingCalls++;mappingPoses.push({ start: clone(start), end: clone(end), blend });start.pelvis[0] = 888;end.limbs.left.ankle[0] = 999;
      pose.limbs.left.ankle = [3, 4, 5];pose.limbs.right.ankle[1] += .04;return pose;
    },
    resolveFootEndpoint(pose, side) {
      endpointCalls++;callbackPoses.push({ pose: clone(pose), side });const actual = pose.limbs[side].ankle.map((value, index) => value + offset[index]);
      pose.pelvis[0] = 777;pose.limbs[side].ankle[0] = 666;return actual;
    },
  });
  for (const time of [0, 1, 4, 9]) equal(sequence.sample(time), source.steps[(time % 9 + 9) % 9].pose, 'Raw anchor bypasses all callbacks');
  equal(endpointCalls, 0);equal(mappingCalls, 0);
  const actual = sequence.sample(.25), a = source.steps[0].pose.limbs.left.ankle.map((value, index) => value + offset[index]);
  const b = source.steps[1].pose.limbs.left.ankle.map((value, index) => value + offset[index]);
  position(actual.limbs.left.ankle, formula(a, b, leftCurve.bend, .25), 'Resolved endpoints override both raw targets and map output');
  const baseline = createFlareSequence(source.steps, { interpolation: 'linear' }).sample(.25);
  close(actual.limbs.right.ankle[1], baseline.limbs.right.ankle[1] + .04, 'Uncurved foot retains mapping');
  equal(endpointCalls, 2);equal(mappingCalls, 1);equal(callbackPoses[0], { pose: source.steps[0].pose, side: 'left' });equal(callbackPoses[1], { pose: source.steps[1].pose, side: 'left' });
  equal(mappingPoses[0].start, source.steps[0].pose);equal(mappingPoses[0].end, source.steps[1].pose);equal(sequence.steps, source.steps);
  position(sequence.curveAt(.25, 'left').position, actual.limbs.left.ankle, 'Reported desired target uses the same resolved endpoints');
});
check('Exact span preference, boundary curve fallback and public deep copies preserve identities and source values', () => {
  const sequence = createFlareSequence(source.steps, { footCurves: [leftCurve] }), next = sequence.spanAt(1), previous = sequence.spanAt(1, { prefer: 'previous' });
  equal(anchorIdentity(next.from), ref(1));equal(anchorIdentity(next.to), ref(2));equal(next.blend, 0);equal([next.startTime, next.endTime], [1, 2]);
  equal(anchorIdentity(previous.from), ref(0));equal(anchorIdentity(previous.to), ref(1));equal(previous.blend, 1);equal([previous.startTime, previous.endTime], [0, 1]);
  equal(next.from.pose, source.steps[1].pose);equal(next.from.time, next.startTime);equal(next.to.time, next.endTime);
  const boundary = sequence.curveAt(1, 'left');equal(boundary.curve, leftCurve);equal(boundary.span.blend, 1);equal(boundary.position, source.steps[1].pose.limbs.left.ankle);
  const originalCurve = clone(leftCurve);next.from.pose.pelvis[0] = 999;next.from.id = 'changed';boundary.curve.bend[1] = 999;boundary.position[0] = 999;
  const input = [clone(originalCurve)], isolated = createFlareSequence(source.steps, { footCurves: input });input[0].bend[1] = 999;isolated.steps[0].pose.limbs.left.ankle[0] = 999;
  equal(isolated.sample(0), source.steps[0].pose);equal(isolated.curveAt(.5, 'left').curve, originalCurve);equal(sequence.sample(1), source.steps[1].pose);
});
check('A new K splits an existing curve into inactive data and active per-K curves keep global smooth timing', () => {
  const first = curve('before-K', 'left', ref(0), pointRef(k)), second = curve('after-K', 'left', pointRef(k), ref(1), [-.08, .13, .05]);
  for (const interpolation of ['linear', 'smooth']) {
    const options = { period: source.period, corrections: [k], interpolation }, base = createFlareSequence(source.steps, options);
    const dormant = createFlareSequence(source.steps, { ...options, footCurves: [leftCurve] });
    const active = createFlareSequence(source.steps, { ...options, footCurves: [leftCurve, first, second] });
    for (const progress of [.2, .65, .9]) { equal(dormant.sample(progress), base.sample(progress), 'Old curve cannot cross an inserted K');equal(dormant.curveAt(progress, 'left'), null); }
    for (const [progress, start, end, selected, left, right] of [[.25, source.steps[0].pose, k.pose, first, 0, k.at], [.75, k.pose, source.steps[1].pose, second, k.at, 1]]) {
      const blend = interpolation === 'linear' ? (progress - left) / (right - left) : (smooth(progress) - smooth(left)) / (smooth(right) - smooth(left));
      onlyAnkleChanged(active.sample(progress), base.sample(progress), 'left', formula(start.limbs.left.ankle, end.limbs.left.ankle, selected.bend, blend));
      close(active.spanAt(progress).blend, blend, 'Global K timing');equal(active.curveAt(progress, 'left').curve.id, selected.id);
    }
    equal(active.sample(k.at), k.pose, 'Raw non-unit quaternion K is preserved');equal(anchorIdentity(active.spanAt(k.at).from), pointRef(k));
    equal(anchorIdentity(active.spanAt(k.at, { prefer: 'previous' }).to), pointRef(k));
    const disabled = createFlareSequence(source.steps, { footCurves: [first, second] });equal(disabled.curveAt(.2, 'left'), null);equal(disabled.sample(.2), createFlareSequence(source.steps).sample(.2));
  }
});
check('Skipped endpoints deactivate old curves, while enabled neighboring originals and K define longer spans', () => {
  const skippedSteps = [1, 2], long = curve('long-skip', 'left', ref(0), ref(3));
  const middle = { ...clone(k), id: 'skip-middle-K', segment: 1, at: .4 };
  for (const interpolation of ['linear', 'smooth']) {
    const options = { period: source.period, interpolation, skippedSteps }, base = createFlareSequence(source.steps, options);
    const active = createFlareSequence(source.steps, { ...options, footCurves: [leftCurve, long] });
    for (const coordinate of [.5, 1, 2, 2.8]) {
      const fraction = coordinate / 3, blend = interpolation === 'linear' ? fraction : smooth(fraction);
      onlyAnkleChanged(active.sample(coordinate), base.sample(coordinate), 'left', formula(source.steps[0].pose.limbs.left.ankle, source.steps[3].pose.limbs.left.ankle, long.bend, blend));
      const span = active.spanAt(coordinate);equal(anchorIdentity(span.from), ref(0));equal(anchorIdentity(span.to), ref(3));close(span.blend, blend, 'Long-span timing');
      equal(active.curveAt(coordinate, 'left').curve.id, long.id);
    }
    const withK = createFlareSequence(source.steps, { ...options, corrections: [middle], footCurves: [long] });
    const withKBase = createFlareSequence(source.steps, { ...options, corrections: [middle] });
    for (const coordinate of [.5, 1.8, 2.7]) equal(withK.sample(coordinate), withKBase.sample(coordinate), 'K bounds a longer curve');
    const ending = curve('skip-K-to-original', 'right', pointRef(middle), ref(3));
    const curveK = createFlareSequence(source.steps, { ...options, corrections: [middle], footCurves: [ending] });
    const progress = 2, left = (middle.segment + middle.at) / 3, fraction = progress / 3;
    const blend = interpolation === 'linear' ? (progress - 1.4) / 1.6 : (smooth(fraction) - smooth(left)) / (1 - smooth(left));
    onlyAnkleChanged(curveK.sample(progress), withKBase.sample(progress), 'right', formula(middle.pose.limbs.right.ankle, source.steps[3].pose.limbs.right.ankle, ending.bend, blend));
    equal(curveK.sample(1.4), middle.pose);equal(curveK.sample(3), source.steps[3].pose);
    equal(active.sample(4.2), base.sample(4.2), 'Remote span remains unchanged');
  }
});
check('Circular spans unfold correctly at negative times, repeat across cycles and retain independent closure IDs', () => {
  const wrapping = curve('wrap-skipped-09', 'left', ref(7), ref(1)), skippedSteps = [0, 8];
  for (const interpolation of ['linear', 'smooth']) {
    const base = createFlareSequence(source.steps, { skippedSteps, interpolation });
    const sequence = createFlareSequence(source.steps, { skippedSteps, interpolation, footCurves: [wrapping] });
    for (const time of [-18.5, -.5, 8.5, 17.5]) {
      const span = sequence.spanAt(time);equal(anchorIdentity(span.from), ref(7));equal(anchorIdentity(span.to), ref(1));close(span.startTime, time - 1.5, 'Unfolded wrap start');close(span.endTime, time + 1.5, 'Unfolded wrap end');close(span.blend, .5, 'Wrap midpoint');
      onlyAnkleChanged(sequence.sample(time), base.sample(time), 'left', formula(source.steps[7].pose.limbs.left.ankle, source.steps[1].pose.limbs.left.ankle, wrapping.bend, .5));
    }
    equal(sequence.sample(0), sequence.sample(source.period), 'Curved cycle closes');
    const atFirst = sequence.spanAt(1, { prefer: 'previous' });equal([atFirst.startTime, atFirst.endTime], [-2, 1]);
  }
  const closure = curve('same-pose-distinct-09', 'left', ref(8), ref(0));
  const sequence = createFlareSequence(source.steps, { footCurves: [closure] });
  equal([sequence.spanAt(8).startTime, sequence.spanAt(8).endTime], [8, 9]);equal([sequence.spanAt(0, { prefer: 'previous' }).startTime, sequence.spanAt(0, { prefer: 'previous' }).endTime], [-1, 0]);
  position(sequence.sample(8.5).limbs.left.ankle, formula(source.steps[8].pose.limbs.left.ankle, source.steps[0].pose.limbs.left.ankle, closure.bend, .5), 'Distinct closure frames allow a deliberate curve');
  equal(sequence.sample(8), source.steps[8].pose);equal(sequence.sample(9), source.steps[0].pose);
  equal(sequence.curveAt(0, 'left').curve.id, closure.id);equal(sequence.curveAt(0, 'left').span.blend, 1);
});
check('Directed curves do not collide when two active original anchors define opposite halves of the loop', () => {
  const skippedSteps = source.steps.map((_, index) => index).filter(index => index !== 1 && index !== 7);
  const forward = curve('two-forward', 'left', ref(1), ref(7)), backward = curve('two-backward', 'left', ref(7), ref(1), [.02, -.05, .19]);
  const sequence = createFlareSequence(source.steps, { skippedSteps, footCurves: [forward, backward] });
  equal(sequence.curveAt(4, 'left').curve.id, forward.id);equal(sequence.curveAt(8.5, 'left').curve.id, backward.id);
  position(sequence.sample(4).limbs.left.ankle, formula(source.steps[1].pose.limbs.left.ankle, source.steps[7].pose.limbs.left.ankle, forward.bend, .5), 'Forward pair');
  position(sequence.sample(8.5).limbs.left.ankle, formula(source.steps[7].pose.limbs.left.ankle, source.steps[1].pose.limbs.left.ankle, backward.bend, .5), 'Reverse wrap pair');
});
check('Only-K loops retain local smooth timing, raw endpoints and inactive single-anchor behavior', () => {
  const all = source.steps.map((_, index) => index), early = { ...clone(k), id: 'only-early', segment: 1, at: .2 }, late = { ...clone(k), id: 'only-late', segment: 5, at: .4 };
  late.pose.limbs.left.ankle[0] += .2;
  const selected = curve('only-K-path', 'left', pointRef(early), pointRef(late));
  for (const interpolation of ['linear', 'smooth']) {
    const options = { skippedSteps: all, corrections: [late, early], interpolation }, baseline = createFlareSequence(source.steps, options);
    const sequence = createFlareSequence(source.steps, { ...options, footCurves: [selected] });
    for (const fraction of [.25, .5, .8]) {
      const time = 1.2 + 4.2 * fraction, blend = interpolation === 'linear' ? fraction : smooth(fraction);
      onlyAnkleChanged(sequence.sample(time), baseline.sample(time), 'left', formula(early.pose.limbs.left.ankle, late.pose.limbs.left.ankle, selected.bend, blend));
      const span = sequence.spanAt(time);close(span.startTime, 1.2, 'Only-K start');close(span.endTime, 5.4, 'Only-K end');close(span.blend, blend, 'Only-K local timing');
    }
    equal(sequence.sample(1.2), early.pose);equal(sequence.sample(5.4), late.pose);equal(sequence.curveAt(7.5, 'left'), null);
  }
  let callbacks = 0;
  const single = createFlareSequence(source.steps, { skippedSteps: all, corrections: [early], footCurves: [selected], resolveFootEndpoint() { callbacks++;throw new Error('Single anchor must bypass endpoint resolution'); } });
  for (const time of [-12, 0, 1.2, 4, 9]) { equal(single.sample(time), early.pose);equal(single.curveAt(time, 'left'), null); }
  equal(callbacks, 0);const span = single.spanAt(1.2);equal(span.from.id, span.to.id);close(span.endTime - span.startTime, source.period, 'Single-anchor cycle span');
  const old = createFlareSequence([{ pose: clone(source.steps[0].pose) }]);equal(old.spanAt(0).from.id, 'step-0');equal(old.steps, [{ pose: source.steps[0].pose }]);
});
check('Very-near-original K spans retain their tiny duration and match the existing precision-aware interpolation', () => {
  const near = { ...clone(k), id: 'tiny-K', at: 1e-12 }, selected = curve('tiny-path', 'left', ref(0), pointRef(near));
  for (const interpolation of ['linear', 'smooth']) {
    const baseline = createFlareSequence(source.steps, { corrections: [near], interpolation });
    const sequence = createFlareSequence(source.steps, { corrections: [near], interpolation, footCurves: [selected] });
    const next = sequence.spanAt(0);equal(next.endTime, near.at);assert.ok(next.endTime > next.startTime);assertions++;
    const previous = sequence.spanAt(near.at, { prefer: 'previous' });equal(previous.startTime, 0);equal(previous.endTime, near.at);equal(previous.blend, 1);
    const time = near.at * .25, blend = interpolation === 'linear' ? .25 : smooth(time) / smooth(near.at);
    onlyAnkleChanged(sequence.sample(time), baseline.sample(time), 'left', formula(source.steps[0].pose.limbs.left.ankle, near.pose.limbs.left.ankle, selected.bend, blend));
    close(sequence.spanAt(time).blend, blend, 'Tiny correction time');equal(sequence.sample(near.at), near.pose);
  }
});
check('Missing point references remain inactive, and left/right curves sharing a pair remain independent', () => {
  const missing = curve('missing-point', 'left', { kind: 'point', id: 'deleted-K' }, ref(1));
  equal(validateFootCurves([missing]), [missing]);const dormant = createFlareSequence(source.steps, { footCurves: [missing] });
  equal(dormant.sample(.5), createFlareSequence(source.steps).sample(.5));equal(dormant.curveAt(.5, 'left'), null);
  const right = curve('right-first', 'right', ref(0), ref(1), [-.1, .18, .15]);
  const both = createFlareSequence(source.steps, { footCurves: [leftCurve, right] });
  for (const [side, selected] of [['left', leftCurve], ['right', right]]) {
    position(both.sample(.5).limbs[side].ankle, formula(source.steps[0].pose.limbs[side].ankle, source.steps[1].pose.limbs[side].ankle, selected.bend, .5), 'Each side has its own route');
    equal(both.curveAt(.5, side).curve.id, selected.id);
  }
});
check('Malformed curves, duplicate ids/pairs, excessive arrays and bad callbacks are rejected without partial input changes', () => {
  const invalid = [null, {}, 'curve', [null], [{}]];
  for (const [key, values] of Object.entries({ id: ['', ' ', 4], side: ['centre', null], from: [null, {}, [], { kind: 'pose', id: 'a' }, { kind: 'step', id: '' }],
    to: [clone(ref(0))], bend: [null, [], [0, 1], [0, 1, 2, 3], [0, NaN, 0], [0, Infinity, 0], ['0', 0, 0], [0, 10000.01, 0], [0, -10000.01, 0], new Array(3)] })) {
    for (const value of values) invalid.push([{ ...clone(leftCurve), [key]: value }]);
  }
  invalid.push([clone(leftCurve), { ...clone(leftCurve), side: 'right' }]);
  invalid.push([clone(leftCurve), { ...clone(leftCurve), id: 'duplicate-pair' }]);
  const maximum = Array.from({ length: 200 }, (_, index) => curve('max-' + index, 'left', { kind: 'point', id: 'from-' + index }, { kind: 'point', id: 'to-' + index }, [10000, -10000, 0]));
  equal(validateFootCurves(maximum), maximum);invalid.push([...maximum, { ...clone(leftCurve), id: 'extra' }]);
  for (const input of invalid) {
    const before = clone(input);assert.throws(() => validateFootCurves(input));assert.throws(() => createFlareSequence(source.steps, { footCurves: input }));assertions += 2;equal(input, before, 'Rejected curve data is not partially edited');
  }
  for (const callback of [null, 4, {}, []]) { assert.throws(() => createFlareSequence(source.steps, { resolveFootEndpoint: callback }));assertions++; }
  for (const result of [undefined, null, [], [0, 0], [0, NaN, 0], [0, 0, Infinity]]) {
    const sequence = createFlareSequence(source.steps, { footCurves: [leftCurve], resolveFootEndpoint: () => result });assert.throws(() => sequence.sample(.5));assertions++;equal(sequence.sample(0), source.steps[0].pose);
  }
  for (const blend of [-.1, 1.1, NaN, Infinity, null]) { assert.throws(() => evaluateFootCurve([0, 0, 0], [1, 1, 1], [0, 0, 0], blend));assertions++; }
  const sequence = createFlareSequence(source.steps);
  for (const time of [NaN, Infinity, null]) { assert.throws(() => sequence.spanAt(time));assert.throws(() => sequence.curveAt(time, 'left'));assertions += 2; }
  for (const options of [null, [], { prefer: 'nearest' }, { prefer: null }]) { assert.throws(() => sequence.spanAt(0, options));assertions++; }
  assert.throws(() => sequence.curveAt(0, 'centre'));assertions++;
});

check('The formal nine poses, corrections and foot-curve inputs remain unchanged', () => {
  equal(source, original);equal(source.steps.length, 9);equal(source.steps[0].pose, source.steps[8].pose);
  const points = freeze([clone(k)]), curves = freeze([curve('frozen-K', 'left', ref(0), pointRef(k))]), steps = freeze(clone(source.steps));
  const saved = clone({ points, curves, steps }), sequence = createFlareSequence(steps, { corrections: points, footCurves: curves });
  sequence.sample(.2);sequence.curveAt(k.at, 'left');sequence.spanAt(0);equal({ points, curves, steps }, saved);
});
equal(await fs.readFile(sourceURL, 'utf8'), sourceBytes, 'Formal source file remains byte-identical');
const report = { pass: failures.length === 0, passed: checks.filter(check => check.pass).length, total: checks.length, assertions, curvedSamples, legacyConfigurations: 14,
  legacySamples, legacyHash, legacyEngineHash, maximumPositionError, checks, failures, sourceSha256: hash(sourceBytes),
  engineSha256: hash(await fs.readFile(new URL('../src/flare-sequence.js', import.meta.url))),
  footCurvesSha256: hash(await fs.readFile(new URL('../src/foot-curves.js', import.meta.url))),
  scope: 'Pure sampling and curve validation. Frozen no-curve compatibility, exact originals/K, chosen timing, active-adjacent boundaries, skipping/wrap, isolated endpoint/mapping callbacks and data preservation. Desired foot targets are not constrained here; actual rig reach/floor and UI are checked separately.' };
const reportURL = new URL('../output/playwright/foot-curves-verification.json', import.meta.url);
await fs.mkdir(new URL('.', reportURL), { recursive: true });await fs.writeFile(reportURL, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, assertions, curvedSamples, legacySamples, maximumPositionError, failures, report: reportURL.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
