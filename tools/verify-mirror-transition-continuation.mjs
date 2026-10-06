import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { mirrorTransitionContinuation } from '../src/mirror-transition-continuation.js';
import { mirrorPose } from '../src/pose-mirror.js';
import { OFFICIAL_FLARE_SEQUENCE, samePose } from '../src/official-poses.js';
import { createTransitionEdits, transitionOptions, validateTransitionEdits } from '../src/transition-edits.js';
import { createFlareSequence } from '../src/flare-sequence.js';
import { evaluateSegmentArc, evaluateSegmentOrbit } from '../src/segment-guides.js';
import { evaluateFootCurve } from '../src/foot-curves.js';

// Only explicit exported data is read. No browser, localStorage, persistence,
// source asset changes, or live bone animation is involved in this module test.
const root = fileURLToPath(new URL('../', import.meta.url));
const backupPath = path.resolve(process.argv[2] ?? path.join(root, '托马斯/备份/2026-10-06T09-18-09-009Z-镜像补全前/完整动画-镜像前.json'));
const backupBytes = await fs.readFile(backupPath), exported = JSON.parse(backupBytes);
const { sequence: actualSequence, ...actualDocument } = exported;
const clone = value => structuredClone(value);
const reflect = value => [-value[0], value[1], value[2]];
const hash = value => createHash('sha256').update(value).digest('hex');
const checks = [];
const check = (name, run) => {
  try { const detail = run();checks.push({ name, pass: true, ...(detail === undefined ? {} : { detail }) }); }
  catch (error) { checks.push({ name, pass: false, error: error.message, stack: error.stack }); }
};
const freeze = value => {
  if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }
  return value;
};
const ref = (sequence, index) => ({ kind: 'step', id: sequence.steps[index].id });
const pointRef = id => ({ kind: 'point', id });
const guide = (sequence, id, from, to, extras = {}) => ({ id, from: ref(sequence, from), to: ref(sequence, to), timing: 'linear', ...extras });
const curve = (sequence, id, from, to, extras = {}) => ({ id, from: ref(sequence, from), to: ref(sequence, to), side: 'left', bend: [.12, .2, -.08], ...extras });
const symmetricFixture = () => {
  const sequence = clone(OFFICIAL_FLARE_SEQUENCE), pose = clone(sequence.steps[0].pose);
  pose.pelvis[0] = 0;pose.bodyQuaternion = [0, 0, 0, 1];
  delete pose.pelvisQuaternion;delete pose.torsoQuaternion;
  pose.limbs.right = mirrorPose(pose).limbs.right;
  sequence.steps[0].pose = pose;sequence.steps[8].pose = clone(pose);
  sequence.steps[5].pose = mirrorPose(sequence.steps[3].pose);
  return { sequence, document: createTransitionEdits(sequence) };
};
const richFixture = () => {
  const { sequence, document } = symmetricFixture();
  sequence.label = { untouched: 'sequence metadata' };
  sequence.steps[2].pose.authored = { memo: 'opaque pose metadata' };
  for (const [index, side] of ['left', 'right'].entries()) Object.assign(sequence.steps[2].pose.limbs[side], {
    elbowTwist: .2 + index, kneeTwist: -.3 - index, upperArmTwist: .4 + index,
    thighTwist: -.5 - index, custom: { from: side },
  });
  const doc = createTransitionEdits(sequence);Object.assign(doc, {
    custom: { source: 'preserve', vector: [1, 2, 3] }, skippedSteps: [],
    draft: { segment: 6, at: .51, pose: clone(sequence.steps[6].pose), custom: 'draft stays unchanged' },
    points: [
      ...[0, 1, 2].map(segment => ({ id: `source-${segment}`, segment, at: [.2, .42, .8][segment], pose: clone(sequence.steps[segment + 1].pose), name: `左手 ${segment}`, custom: { segment } })),
      { id: 'protected-point', segment: 4, at: .3, pose: clone(sequence.steps[4].pose) },
      ...[5, 6, 7].map(segment => ({ id: `old-target-${segment}`, segment, at: .6, pose: clone(sequence.steps[segment].pose) })),
    ],
    footCurves: [
      curve(sequence, 'curve-source', 0, 1, { to: pointRef('source-0'), custom: { tag: 'curve' } }),
      curve(sequence, 'curve-target', 5, 6),
      curve(sequence, 'curve-protected', 4, 5),
      curve(sequence, 'curve-wrap', 8, 1),
      curve(sequence, 'curve-dangling', 0, 1, { to: pointRef('lost-source') }),
    ],
    segmentGuides: [
      guide(sequence, 'guide-source', 1, 2, {
        from: { ...ref(sequence, 1), label: 'saved ref metadata' }, custom: { tag: 'guide' },
        bends: { pelvis: [.1, .2, .3], leftAnkle: [.3, .4, .5], custom: { value: 7 } },
        bendAngles: { leftKnee: .7, rightElbow: -.8, custom: 'angle metadata' },
        smoothPaths: { leftWrist: { bend: [.2, .1, -.3], memo: 'smooth metadata' }, custom: { value: 8 } },
        orbitPaths: { rightAnkle: { center: [.2, -.4, .8], normal: [.3, .4, .7], arc: 'long', memo: 'orbit metadata' }, custom: { value: 9 } },
      }),
      guide(sequence, 'guide-dormant', 0, 2),
      guide(sequence, 'guide-target', 5, 6),
      guide(sequence, 'guide-protected', 3, 4),
      guide(sequence, 'guide-last-completed', 4, 5),
      guide(sequence, 'guide-wrap', 8, 1),
      guide(sequence, 'guide-cross', 4, 6),
      guide(sequence, 'guide-dangling', 0, 1, { to: pointRef('lost-guide') }),
    ],
  });
  return { sequence, document: doc };
};
const fullHalfFixture = () => {
  const { sequence, document } = richFixture(), pose = clone(sequence.steps[4].pose);
  pose.pelvis[0] = 0;pose.bodyQuaternion = [0, 0, 0, 1];
  delete pose.pelvisQuaternion;delete pose.torsoQuaternion;
  pose.limbs.right = mirrorPose(pose).limbs.right;sequence.steps[4].pose = pose;
  // An existing edited 14 must be replaced only in the explicit full-half mode.
  sequence.steps[5].pose.pelvis[1] += .14;
  document.base = createTransitionEdits(sequence).base;
  document.points.push({ id: 'source-3', segment: 3, at: .37, pose: clone(sequence.steps[3].pose), name: '左手 3', custom: { segment: 3 } });
  document.footCurves.push(curve(sequence, 'curve-source-3', 3, 4, { to: pointRef('source-3'), custom: 'latest 12→13 curve' }));
  const controls = clone(document.segmentGuides.find(entry => entry.id === 'guide-source'));
  const terminal = document.segmentGuides.findIndex(entry => entry.id === 'guide-protected');
  document.segmentGuides[terminal] = { ...controls, id: 'guide-source-3', from: ref(sequence, 3), to: ref(sequence, 4), custom: 'latest 12→13 route' };
  return { sequence, document };
};

let actual, maximumMirrorMathError = 0;
check('Actual export is valid, applicable, and produces only the intended four route copies', () => {
  actual = mirrorTransitionContinuation(actualSequence, actualDocument);
  assert.equal(actual.canApply, true);assert.deepEqual(actual.updatedIndices, [6, 7]);
  assert.deepEqual(actual.counts, { pointsAdded: 0, pointsReplaced: 0, footCurvesAdded: 0, footCurvesReplaced: 0, segmentGuidesAdded: 4, segmentGuidesReplaced: 0 });
  assert.equal(actual.document.segmentGuides.length, 9);
  assert.equal(actual.document.points.length, 0);
  assert.deepEqual(actual.document.footCurves, actualDocument.footCurves);
  validateTransitionEdits(actual.document, actual.sequence);
  return { counts: actual.counts, boundaries: actual.boundaries, warnings: actual.warnings };
});
check('Actual completed original frames, all five source routes, and 13→14 playback remain exact', () => {
  for (const index of [0, 1, 2, 3, 4, 5, 8]) assert.deepEqual(actual.sequence.steps[index], actualSequence.steps[index]);
  for (const saved of actualDocument.segmentGuides) assert.deepEqual(actual.document.segmentGuides.find(entry => entry.id === saved.id), saved);
  const before = createFlareSequence(actualSequence.steps, { period: 9, ...transitionOptions(actualDocument) });
  const after = createFlareSequence(actual.sequence.steps, { period: 9, ...transitionOptions(actual.document) });
  for (let index = 0; index <= 160; index++) assert.deepEqual(after.sample(index * 5 / 160), before.sample(index * 5 / 160));
  return { sampledTimes: 161, range: [0, 5], scope: 'Pure sequence poses; root separately verifies actual Snow rig.' };
});
check('Actual asymmetric 14 and closing 09 are retained and reported without inventing K frames', () => {
  assert.equal(actual.boundaries.every(boundary => !boundary.exact), true);
  assert.equal(actual.boundaries.every(boundary => boundary.maximumControlPointDistance > .2), true);
  assert.equal(actual.unresolved.length, 0);
  assert.ok(actual.warnings.some(message => message.includes('14')));
  assert.ok(actual.warnings.some(message => message.includes('09') || message.includes('9')));
  assert.ok(actual.warnings.some(message => message.includes('历史脚路线')));
});
check('The operation owns all outputs, preserves a complete backup, and never mutates frozen inputs', () => {
  const input = richFixture(), original = clone(input);freeze(input.sequence);freeze(input.document);
  const result = mirrorTransitionContinuation(input.sequence, input.document);
  assert.deepEqual(input, original);assert.deepEqual(result.backup, { ...original.document, sequence: original.sequence });
  result.sequence.steps[0].pose.pelvis[1] += 1;result.document.custom.vector[0] += 1;
  assert.deepEqual(input, original);assert.deepEqual(result.backup, { ...original.document, sequence: original.sequence });
});
check('Only original 15/16 poses change; sequence/step metadata and every other frame are preserved', () => {
  const { sequence, document } = richFixture(), result = mirrorTransitionContinuation(sequence, document);
  assert.equal(result.canApply, true);
  for (const index of [0, 1, 2, 3, 4, 5, 8]) assert.deepEqual(result.sequence.steps[index], sequence.steps[index]);
  for (const [target, source] of [[6, 2], [7, 1]]) {
    const { pose: beforePose, ...before } = sequence.steps[target], { pose, ...after } = result.sequence.steps[target];
    assert.deepEqual(after, before);assert.equal(samePose(pose, { ...clone(sequence.steps[source].pose), ...mirrorPose(sequence.steps[source].pose),
      limbs: { ...clone(sequence.steps[source].pose.limbs), left: { ...clone(sequence.steps[source].pose.limbs.right), ...mirrorPose(sequence.steps[source].pose).limbs.left },
        right: { ...clone(sequence.steps[source].pose.limbs.left), ...mirrorPose(sequence.steps[source].pose).limbs.right } } }), true);
  }
  assert.deepEqual(result.sequence.label, sequence.label);
});
check('K frames reverse their segment and time, mirror current twist fields, and retain metadata', () => {
  const { sequence, document } = richFixture(), result = mirrorTransitionContinuation(sequence, document);
  assert.equal(result.counts.pointsAdded, 3);assert.equal(result.counts.pointsReplaced, 3);
  for (const source of document.points.filter(point => point.segment <= 2)) {
    const target = result.document.points.find(point => point.id === `mirror-point-${source.id}`);
    assert.equal(target.segment, 7 - source.segment);assert.equal(target.at, 1 - source.at);
    assert.deepEqual(target.custom, source.custom);assert.equal(target.name, source.name.replace('左', '右'));
    const expected = mirrorPose(source.pose);
    for (const side of ['left', 'right']) for (const key of ['wrist', 'elbowPole', 'ankle', 'kneePole', 'handQuaternion', 'footQuaternion', 'elbowTwist', 'kneeTwist', 'upperArmTwist', 'thighTwist']) {
      if (Object.hasOwn(expected.limbs[side], key)) assert.deepEqual(target.pose.limbs[side][key], expected.limbs[side][key]);
    }
  }
  assert.deepEqual(result.document.points.find(point => point.id === 'protected-point'), document.points.find(point => point.id === 'protected-point'));
  assert.ok(!result.document.points.some(point => point.id.startsWith('old-target-')));
});
check('Guide and old foot-curve references reverse to the mapped steps/K with fresh IDs', () => {
  const { sequence, document } = richFixture(), result = mirrorTransitionContinuation(sequence, document);
  const mirroredCurve = result.document.footCurves.find(entry => entry.id === 'mirror-curve-curve-source');
  assert.deepEqual(mirroredCurve.from, pointRef('mirror-point-source-0'));assert.deepEqual(mirroredCurve.to, ref(sequence, 8));
  assert.equal(mirroredCurve.side, 'right');assert.deepEqual(mirroredCurve.bend, [-.12, .2, -.08]);
  const mirroredGuide = result.document.segmentGuides.find(entry => entry.id === 'mirror-guide-guide-source');
  assert.deepEqual(mirroredGuide.from, ref(sequence, 6));
  assert.deepEqual(mirroredGuide.to, { ...ref(sequence, 7), label: 'saved ref metadata' });
  const dormant = result.document.segmentGuides.find(entry => entry.id === 'mirror-guide-guide-dormant');
  assert.deepEqual(dormant.from, ref(sequence, 6));assert.deepEqual(dormant.to, ref(sequence, 8));
});
check('Bends, knee/elbow angles, smooth arcs, orbit centers/normals, and opaque controls mirror correctly', () => {
  const { sequence, document } = richFixture(), result = mirrorTransitionContinuation(sequence, document);
  const target = result.document.segmentGuides.find(entry => entry.id === 'mirror-guide-guide-source');
  assert.deepEqual(target.bends, { custom: { value: 7 }, pelvis: [-.1, .2, .3], rightAnkle: [-.3, .4, .5] });
  assert.deepEqual(target.bendAngles, { custom: 'angle metadata', rightKnee: -.7, leftElbow: .8 });
  assert.deepEqual(target.smoothPaths, { custom: { value: 8 }, rightWrist: { bend: [-.2, .1, -.3], memo: 'smooth metadata' } });
  assert.deepEqual(target.orbitPaths, { custom: { value: 9 }, leftAnkle: { center: [-.2, -.4, .8], normal: [-.3, .4, .7], arc: 'long', memo: 'orbit metadata' } });
  assert.deepEqual(target.custom, { tag: 'guide' });
});
check('Completed routes, wrapping/cross-boundary profiles, and dangling historical references stay intact', () => {
  const { sequence, document } = richFixture(), result = mirrorTransitionContinuation(sequence, document);
  for (const id of ['guide-protected', 'guide-last-completed', 'guide-wrap', 'guide-cross', 'guide-dangling']) {
    assert.deepEqual(result.document.segmentGuides.find(entry => entry.id === id), document.segmentGuides.find(entry => entry.id === id));
    assert.ok(!result.document.segmentGuides.some(entry => entry.id === `mirror-guide-${id}`));
  }
  for (const id of ['curve-protected', 'curve-wrap', 'curve-dangling']) assert.deepEqual(result.document.footCurves.find(entry => entry.id === id), document.footCurves.find(entry => entry.id === id));
  assert.ok(!result.document.segmentGuides.some(entry => entry.id === 'guide-target'));
  assert.ok(!result.document.footCurves.some(entry => entry.id === 'curve-target'));
});
check('Point IDs cannot collide with any existing step, point, guide, or curve, including replaced IDs', () => {
  const { sequence, document } = richFixture();
  document.points.find(point => point.id === 'old-target-5').id = 'mirror-point-source-0';
  document.segmentGuides.find(entry => entry.id === 'guide-target').id = 'mirror-guide-guide-source';
  document.footCurves.find(entry => entry.id === 'curve-target').id = 'mirror-curve-curve-source';
  const result = mirrorTransitionContinuation(sequence, document);
  assert.ok(result.document.points.some(entry => entry.id === 'mirror-point-source-0-1'));
  assert.ok(result.document.segmentGuides.some(entry => entry.id === 'mirror-guide-guide-source-1'));
  assert.ok(result.document.footCurves.some(entry => entry.id === 'mirror-curve-curve-source-1'));
});
check('Draft, disabled state, skipped K, and top-level metadata survive; inactive boundary K warns only', () => {
  const { sequence, document } = richFixture();document.enabled = false;
  document.points[0].skipped = true;sequence.steps[5].pose.pelvis[1] += .1;
  document.base = createTransitionEdits(sequence).base;
  const result = mirrorTransitionContinuation(sequence, document);
  assert.equal(result.canApply, true);assert.equal(result.document.enabled, false);
  assert.deepEqual(result.document.draft, document.draft);assert.deepEqual(result.document.custom, document.custom);
  assert.equal(result.document.points.find(point => point.id === 'mirror-point-source-0').skipped, true);
  assert.ok(result.warnings.some(message => message.includes('镜像 K')));
});
check('An asymmetric protected boundary with an active mirrored K is unresolved without retargeting data', () => {
  const { sequence, document } = richFixture();sequence.steps[5].pose.pelvis[1] += .1;
  document.base = createTransitionEdits(sequence).base;
  const result = mirrorTransitionContinuation(sequence, document);
  assert.equal(result.canApply, false);assert.ok(result.unresolved.some(item => item.kind === 'keyframe-boundary' && item.targetStepNumber === 14));
  assert.deepEqual(result.sequence.steps[5], sequence.steps[5]);
  const source = document.points.find(point => point.segment === 2), target = result.document.points.find(point => point.id === `mirror-point-${source.id}`);
  assert.deepEqual(target.pose, mirrorPose(source.pose));
});
check('Skipped 10/11 mirror to skipped 16/15 while other skip states remain intact', () => {
  const { sequence, document } = symmetricFixture();document.skippedSteps = [1, 4, 6];
  const result = mirrorTransitionContinuation(sequence, document);
  assert.deepEqual(result.document.skippedSteps, [1, 4, 7]);
});
check('Skipped 14 or either 09 boundary rejects atomically; a skipped source12 reports unresolved', () => {
  for (const index of [0, 5, 8]) {
    const input = symmetricFixture();input.document.skippedSteps = [index];const before = clone(input);
    assert.throws(() => mirrorTransitionContinuation(input.sequence, input.document), /09|14/);assert.deepEqual(input, before);
  }
  const input = symmetricFixture();input.document.skippedSteps = [3];
  const result = mirrorTransitionContinuation(input.sequence, input.document);
  assert.equal(result.canApply, false);assert.ok(result.unresolved.some(item => item.kind === 'skipped-source-boundary'));
});
check('Invalid identity/base and resulting profile/point limits reject without changing inputs', () => {
  const badNumber = symmetricFixture();badNumber.sequence.steps[1].sourceStepNumber = 999;
  assert.throws(() => mirrorTransitionContinuation(badNumber.sequence, badNumber.document), /编号/);
  const badBase = symmetricFixture();badBase.document.base.steps[1].pose.pelvis[1] += .2;
  assert.throws(() => mirrorTransitionContinuation(badBase.sequence, badBase.document), /另一组/);
  const overflow = symmetricFixture();overflow.document.segmentGuides = [guide(overflow.sequence, 'eligible', 0, 1),
    ...Array.from({ length: 199 }, (_, index) => guide(overflow.sequence, `dormant-${index}`, 3, 4, { to: pointRef(`missing-${index}`) }))];
  const before = clone(overflow);assert.throws(() => mirrorTransitionContinuation(overflow.sequence, overflow.document), /200/);assert.deepEqual(overflow, before);
  const manyPoints = symmetricFixture();manyPoints.document.points = Array.from({ length: 200 }, (_, index) => ({ id: `p-${index}`, segment: 0, at: (index + 1) / 201, pose: clone(manyPoints.sequence.steps[1].pose) }));
  const pointsBefore = clone(manyPoints);assert.throws(() => mirrorTransitionContinuation(manyPoints.sequence, manyPoints.document), /200/);assert.deepEqual(manyPoints, pointsBefore);
});
check('A degenerate orbit without its saved normal is unresolved, while a stationary short arc needs none', () => {
  const input = symmetricFixture();input.sequence.steps[0].pose.pelvis = [-1, 1, 0];input.sequence.steps[1].pose.pelvis = [1, 1, 0];
  input.sequence.steps[8].pose = clone(input.sequence.steps[0].pose);input.document = createTransitionEdits(input.sequence);
  input.document.segmentGuides = [guide(input.sequence, 'degenerate', 0, 1, { orbitPaths: { pelvis: { center: [0, 1, 0], arc: 'short' } } })];
  const result = mirrorTransitionContinuation(input.sequence, input.document);
  assert.equal(result.canApply, false);assert.ok(result.unresolved.some(item => item.kind === 'orbit-plane'));
  input.document.segmentGuides[0].orbitPaths.pelvis.normal = [0, 0, 1];
  assert.equal(mirrorTransitionContinuation(input.sequence, input.document).canApply, true);
  const stationary = symmetricFixture();stationary.sequence.steps[1].pose.pelvis = clone(stationary.sequence.steps[0].pose.pelvis);
  stationary.document = createTransitionEdits(stationary.sequence);
  stationary.document.segmentGuides = [guide(stationary.sequence, 'stationary', 0, 1, { orbitPaths: { pelvis: { center: [3, 2, 1] } } })];
  assert.equal(mirrorTransitionContinuation(stationary.sequence, stationary.document).canApply, true);
});
check('Explicit circle normals preserve mirror plus reversed time for short/long/opposite/closed/radial arcs', () => {
  const cases = [
    { a: [1, 0, 0], b: [0, 2, 0], center: [0, 0, 0], normal: [0, 0, 1] },
    { a: [1, 0, 0], b: [-2, 0, 0], center: [0, 0, 0], normal: [0, 0, 1] },
    { a: [.3, .2, .7], b: [.3, .2, .7], center: [-.1, .6, .2], normal: [.4, .3, 1] },
    { a: [1, 0, 0], b: [2, 0, 0], center: [0, 0, 0], normal: [0, 1, 0] },
  ];
  for (const fixture of cases) for (const arc of ['short', 'long']) for (const progress of [0, .07, .25, .5, .8, 1]) {
    const original = evaluateSegmentOrbit(fixture.a, fixture.b, { center: fixture.center, normal: fixture.normal, arc }, 1 - progress);
    const mirrored = evaluateSegmentOrbit(reflect(fixture.b), reflect(fixture.a), { center: reflect(fixture.center), normal: reflect(fixture.normal), arc }, progress);
    const error = Math.hypot(...reflect(original).map((value, index) => value - mirrored[index]));
    maximumMirrorMathError = Math.max(maximumMirrorMathError, error);assert.ok(error < 1e-12);
  }
  const a = [.2, .3, -.8], b = [-.5, .7, .2], bend = [.12, .15, -.07];
  for (const evaluate of [evaluateSegmentArc, evaluateFootCurve]) for (const progress of [0, .13, .5, .71, 1]) {
    const original = reflect(evaluate(a, b, bend, 1 - progress)), mirrored = evaluate(reflect(b), reflect(a), reflect(bend), progress);
    assert.ok(Math.hypot(...original.map((value, index) => value - mirrored[index])) < 1e-12);
  }
  return { orbitCases: 48, maximumMirrorMathError };
});
check('The actual source backup remains byte-for-byte unchanged, and output validation/rebase is compatible', () => {
  assert.deepEqual(actualSequence, exported.sequence);
  const { sequence, ...document } = exported;assert.deepEqual(actualDocument, document);
  const expectedBase = createTransitionEdits(actual.sequence).base;
  assert.deepEqual(actual.document.base, expectedBase);
  if (path.basename(backupPath) === '完整动画-镜像前.json') assert.equal(hash(backupBytes), '5491d0ea0c057131b6ba6fc8bc839417e07b815626beef005559182f6a4134b1');
});
check('Explicit full-half mode mirrors source09→13 onto13→09 and updates 14/15/16 from latest 12/11/10', () => {
  const result = mirrorTransitionContinuation(actualSequence, actualDocument, { includeFrame14: true });
  assert.equal(result.canApply, true);assert.deepEqual(result.updatedIndices, [5, 6, 7]);assert.deepEqual(result.targetSegments, [4, 5, 6, 7]);
  assert.equal(result.counts.segmentGuidesAdded, 5);assert.equal(result.document.segmentGuides.length, 10);
  for (const index of [0, 1, 2, 3, 4, 8]) assert.deepEqual(result.sequence.steps[index], actualSequence.steps[index]);
  for (const [target, source] of [[5, 3], [6, 2], [7, 1]]) assert.deepEqual(result.sequence.steps[target].pose, mirrorPose(actualSequence.steps[source].pose));
  const sourceGuide = actualDocument.segmentGuides.find(entry => entry.from.id === actualSequence.steps[3].id && entry.to.id === actualSequence.steps[4].id);
  const terminal = result.document.segmentGuides.find(entry => entry.id === `mirror-guide-${sourceGuide.id}`);
  assert.deepEqual(terminal.from, ref(actualSequence, 4));assert.deepEqual(terminal.to, ref(actualSequence, 5));
  assert.deepEqual(result.document.footCurves, actualDocument.footCurves);
  return { boundaries: result.boundaries, counts: result.counts, warnings: result.warnings };
});
check('Full-half output retains latest completed09→13 playback, closing09, metadata, draft, and old backup exactly', () => {
  const input = fullHalfFixture(), original = clone(input);freeze(input.sequence);freeze(input.document);
  const result = mirrorTransitionContinuation(input.sequence, input.document, { includeFrame14: true });
  assert.equal(result.canApply, true);assert.deepEqual(input, original);
  assert.deepEqual(result.backup, { ...original.document, sequence: original.sequence });
  assert.deepEqual(result.document.draft, input.document.draft);assert.deepEqual(result.document.custom, input.document.custom);
  assert.deepEqual(result.sequence.label, input.sequence.label);
  for (const index of [0, 1, 2, 3, 4, 8]) assert.deepEqual(result.sequence.steps[index], input.sequence.steps[index]);
  const before = createFlareSequence(input.sequence.steps, { period: 9, ...transitionOptions(input.document) });
  const after = createFlareSequence(result.sequence.steps, { period: 9, ...transitionOptions(result.document) });
  for (let index = 0; index <= 128; index++) assert.deepEqual(after.sample(index * 4 / 128), before.sample(index * 4 / 128));
  for (const point of input.document.points.filter(point => point.segment < 4)) assert.deepEqual(result.document.points.find(next => next.id === point.id), point);
  for (const id of ['guide-source', 'guide-source-3', 'guide-dormant']) assert.deepEqual(result.document.segmentGuides.find(entry => entry.id === id), input.document.segmentGuides.find(entry => entry.id === id));
});
check('Full-half K3 maps to K4 and source12→13 controls mirror onto13→14, replacing only the target half', () => {
  const { sequence, document } = fullHalfFixture(), result = mirrorTransitionContinuation(sequence, document, { includeFrame14: true });
  assert.equal(result.counts.pointsAdded, 4);assert.equal(result.counts.pointsReplaced, 4);
  const point = result.document.points.find(entry => entry.id === 'mirror-point-source-3');
  assert.equal(point.segment, 4);assert.equal(point.at, .63);assert.deepEqual(point.pose, mirrorPose(document.points.find(entry => entry.id === 'source-3').pose));
  const route = result.document.segmentGuides.find(entry => entry.id === 'mirror-guide-guide-source-3');
  assert.deepEqual(route.from, ref(sequence, 4));assert.deepEqual(route.to, ref(sequence, 5));
  assert.deepEqual(route.bends.rightAnkle, [-.3, .4, .5]);assert.equal(route.bendAngles.rightKnee, -.7);
  assert.deepEqual(route.smoothPaths.rightWrist.bend, [-.2, .1, -.3]);assert.deepEqual(route.orbitPaths.leftAnkle.normal, [-.3, .4, .7]);
  assert.equal(route.custom, 'latest 12→13 route');
  const foot = result.document.footCurves.find(entry => entry.id === 'mirror-curve-curve-source-3');
  assert.deepEqual(foot.from, pointRef('mirror-point-source-3'));assert.deepEqual(foot.to, ref(sequence, 5));assert.equal(foot.side, 'right');
  assert.ok(!result.document.segmentGuides.some(entry => ['guide-last-completed', 'guide-target', 'guide-cross'].includes(entry.id)));
  assert.ok(!result.document.footCurves.some(entry => ['curve-protected', 'curve-target'].includes(entry.id)));
  assert.deepEqual(result.document.segmentGuides.find(entry => entry.id === 'guide-wrap'), document.segmentGuides.find(entry => entry.id === 'guide-wrap'));
});
check('Full-half skip state mirrors 10/11/12 to16/15/14 and rejects skipped13/09 atomically', () => {
  const input = fullHalfFixture();input.document.skippedSteps = [1, 3, 6];
  const result = mirrorTransitionContinuation(input.sequence, input.document, { includeFrame14: true });
  assert.equal(result.canApply, true);assert.deepEqual(result.document.skippedSteps, [1, 3, 5, 7]);
  for (const index of [0, 4, 8]) {
    const denied = fullHalfFixture();denied.document.skippedSteps = [index];const original = clone(denied);
    assert.throws(() => mirrorTransitionContinuation(denied.sequence, denied.document, { includeFrame14: true }), /09|13/);
    assert.deepEqual(denied, original);
  }
});
check('Full-half asymmetric13 plus active boundary K is unresolved; protected13 and K spatial values are untouched', () => {
  const input = fullHalfFixture();input.sequence.steps[4].pose.pelvis[0] = .1;input.document.base = createTransitionEdits(input.sequence).base;
  const original = clone(input), result = mirrorTransitionContinuation(input.sequence, input.document, { includeFrame14: true });
  assert.equal(result.canApply, false);assert.ok(result.unresolved.some(item => item.kind === 'keyframe-boundary' && item.targetStepNumber === 13 && item.targetSegment === 4));
  assert.deepEqual(input, original);assert.deepEqual(result.sequence.steps[4], input.sequence.steps[4]);
  assert.deepEqual(result.document.points.find(entry => entry.id === 'mirror-point-source-3').pose, mirrorPose(input.document.points.find(entry => entry.id === 'source-3').pose));
});
check('Default and explicit false remain equivalent; full-half rejects invalid options and rebases all changed original poses', () => {
  const input = fullHalfFixture();
  assert.deepEqual(mirrorTransitionContinuation(input.sequence, input.document), mirrorTransitionContinuation(input.sequence, input.document, { includeFrame14: false }));
  assert.throws(() => mirrorTransitionContinuation(input.sequence, input.document, { includeFrame14: 'true' }), /true|false/);
  const result = mirrorTransitionContinuation(input.sequence, input.document, { includeFrame14: true });
  assert.deepEqual(result.document.base, createTransitionEdits(result.sequence).base);validateTransitionEdits(result.document, result.sequence);
});

const currentBytes = await fs.readFile(backupPath);
checks.push({ name: 'Input bytes are unchanged after every check', pass: Buffer.compare(backupBytes, currentBytes) === 0 });
const report = { pass: checks.every(check => check.pass), checkedAt: new Date().toISOString(), backupPath, backupSha256: hash(backupBytes),
  checks, maximumMirrorMathError,
  scope: 'Pure mirror continuation data module: default three-segment and explicit includeFrame14 full-half modes, actual saved export, protected prefix, K mapping, complete backup, directed/dormant routes, twists and metadata, skip/limit failures, mirrored orbit plane math. Actual Snow/constraints/browser persistence are verified separately.' };
const reportPath = path.join(root, 'output/mirror-continuation/module-verification.json');
await fs.mkdir(path.dirname(reportPath), { recursive: true });await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ pass: report.pass, checks: checks.length, passed: checks.filter(check => check.pass).length, reportPath,
  failures: checks.filter(check => !check.pass).map(check => ({ name: check.name, error: check.error })) }, null, 2));
if (!report.pass) process.exitCode = 1;
