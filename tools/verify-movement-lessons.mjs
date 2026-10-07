import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { MOVEMENT_LESSON, resolveMovementLesson, resolveMovementPoseAnnotations } from '../src/movement-lessons.js';
import { groupById } from '../src/data.js';
import { TRAJECTORY_JOINTS } from '../src/trajectory-guide.js';

const read = path => fs.readFile(new URL(path, import.meta.url), 'utf8').then(JSON.parse);
const [bundled, snapshot, atlas] = await Promise.all([
  read('../public/coach/flare-sequence.json'),
  read('../托马斯/阶段1-可用动画-2026-10-06.json'),
  read('../public/anatomy/manifest.json'),
]);
let checks = 0;
function check(label, run) { run(); checks++; console.log(`OK ${label}`); }
const step = (number, id = `source-${number}`) => ({ id, sourceStepNumber: number });
const metadataSequence = numbers => ({ period: 12, steps: numbers.map((number, index) => step(number, `frame-${index}`)) });
const current = { ...snapshot.sequence, skippedSteps: snapshot.skippedSteps ?? [],
  corrections: snapshot.points, segmentGuides: snapshot.segmentGuides };

check('Current bundle and accepted snapshot resolve their own original IDs', () => {
  for (const sequence of [bundled, current]) {
    const before = JSON.stringify(sequence), resolved = resolveMovementLesson(sequence);
    assert.equal(resolved.fromStepId, sequence.steps[0].id);
    assert.equal(resolved.toStepId, sequence.steps[1].id);
    assert.equal(resolved.startTime, 0);
    assert.equal(resolved.endTime, sequence.period / sequence.steps.length);
    assert.equal(JSON.stringify(sequence), before);
  }
});

check('Timeline position and period determine time without fixed 0/1 assumptions', () => {
  const shifted = metadataSequence([8, 9, 10, 11]);
  const resolved = resolveMovementLesson(shifted);
  assert.equal(resolved.startTime, 3);
  assert.equal(resolved.endTime, 6);
  shifted.period = 4;
  assert.equal(resolveMovementLesson(shifted).startTime, 1);
  assert.equal(resolveMovementLesson(shifted).endTime, 2);
});

check('Skipped endpoints hide the lesson while unrelated skips preserve it', () => {
  assert.equal(resolveMovementLesson({ ...current, skippedSteps: [0, current.steps.length - 1] }), null);
  assert.equal(resolveMovementLesson({ ...current, skippedSteps: [1] }), null);
  assert.ok(resolveMovementLesson({ ...current, skippedSteps: [3] }));
  for (const field of ['skipped', 'disabled', 'enabled', 'active']) {
    const sequence = structuredClone(bundled);
    sequence.steps[1][field] = ['enabled', 'active'].includes(field) ? false : true;
    assert.equal(resolveMovementLesson(sequence), null);
  }
});

check('Missing, nonadjacent and ambiguous source pairs cannot show another segment', () => {
  for (const numbers of [[8, 10, 11], [9, 11, 12], [9, 11, 10, 12], [9, 10, 9, 10]]) {
    assert.equal(resolveMovementLesson(metadataSequence(numbers)), null);
  }
  const namesOnly = metadataSequence([9, 10]);
  namesOnly.steps.forEach((frame, index) => {
    delete frame.sourceStepNumber;
    frame.name = index ? '原第 10 步' : '原第 09 步';
    frame.id = index ? 'flare-saved-10-left-transfer' : 'flare-saved-09-rear';
  });
  assert.equal(resolveMovementLesson(namesOnly), null);
});

check('Compatible explicit source metadata works; contradictory metadata is rejected', () => {
  const nested = { period: 6, steps: [{ id: 'a', source: { stepNumber: '09' } },
    { id: 'b', source: { stepNumber: 10 } }] };
  assert.ok(resolveMovementLesson(nested));
  const indexed = { period: 6, source: { stepNumbers: [9, 10] }, steps: [{ id: 'a' }, { id: 'b' }] };
  assert.ok(resolveMovementLesson(indexed));
  nested.steps[1].sourceStepNumber = 11;
  assert.equal(resolveMovementLesson(nested), null);
});

check('Changed support contacts cannot retain the right-hand coaching cue', () => {
  const wrongHand = structuredClone(bundled);
  wrongHand.steps[1].pose.limbs.left.handLocked = true;
  wrongHand.steps[1].pose.limbs.right.handLocked = false;
  assert.equal(resolveMovementLesson(wrongHand), null);
  const noDoubleSupport = structuredClone(bundled);
  noDoubleSupport.steps[0].pose.limbs.left.handLocked = false;
  assert.equal(resolveMovementLesson(noDoubleSupport), null);
});

check('Continuous cycle boundary returns an explicit unfolded range', () => {
  const wrapped = resolveMovementLesson(metadataSequence([10, 11, 9]));
  assert.equal(wrapped.wraps, true);
  assert.equal(wrapped.startTime, 8);
  assert.equal(wrapped.endTime, 12);
  assert.equal(wrapped.fromIndex, 2);
  assert.equal(wrapped.toIndex, 0);
});

check('Invalid timing, identity and skip metadata fail closed', () => {
  for (const period of [0, -1, Infinity, NaN, '9']) assert.equal(resolveMovementLesson({ ...bundled, period }), null);
  for (const skippedSteps of [[-1], [99], [1, 1], ['1'], '1']) {
    assert.equal(resolveMovementLesson({ ...bundled, skippedSteps }), null);
  }
  const noId = structuredClone(bundled);
  delete noId.steps[1].id;
  assert.equal(resolveMovementLesson(noId), null);
  assert.equal(resolveMovementLesson(null), null);
});

check('Muscle IDs and anchors refer to existing anatomy groups and rig joints', () => {
  const joints = new Set(TRAJECTORY_JOINTS.map(channel => channel.joint));
  for (const group of MOVEMENT_LESSON.groups) {
    assert.ok(groupById[group.id], `Unknown muscle group ${group.id}`);
    assert.ok(joints.has(group.anchor), `Unknown rig joint ${group.anchor}`);
    assert.ok(['left', 'right', 'both'].includes(group.bodySide));
  }
});

check('All accepted original nodes resolve actual supports without changing the animation', () => {
  const before = JSON.stringify(current);
  for (let index = 0; index < current.steps.length; index++) {
    const annotation = resolveMovementPoseAnnotations(current, index), frame = current.steps[index];
    assert.equal(annotation.sourceStepNumber, frame.sourceStepNumber);
    assert.equal(annotation.stepId, frame.id);
    assert.equal(annotation.time, index * current.period / current.steps.length);
    assert.deepEqual(annotation.supportHands, ['left', 'right'].filter(side => frame.pose.limbs[side].handLocked));
    assert.deepEqual(annotation.cues.map(cue => cue.side), annotation.supportHands);
  }
  assert.equal(JSON.stringify(current), before);
});

check('Original 09 highlights both shoulders, upper arms, front hips and thighs; closing 09 reuses it', () => {
  const first = resolveMovementPoseAnnotations(current, 0), last = resolveMovementPoseAnnotations(current, current.steps.length - 1);
  for (const kind of ['shoulder', 'upperArm', 'hipFlexor', 'quad']) {
    assert.deepEqual(first.regions.filter(region => region.kind === kind).map(region => region.side), ['left', 'right']);
  }
  assert.deepEqual(first.labels, last.labels);
  assert.deepEqual(first.regions, last.regions);
  assert.deepEqual(first.cue, last.cue);
  assert.equal(last.time, 8);
  assert.notEqual(last.stepId, first.stepId);
});

check('Changed hand locks drive annotation sides; stage display names never imply a support hand', () => {
  const sequence = structuredClone(current);
  sequence.steps[1].pose.limbs.left.handLocked = true;
  sequence.steps[1].pose.limbs.right.handLocked = false;
  const annotation = resolveMovementPoseAnnotations(sequence, 1);
  assert.deepEqual(annotation.supportHands, ['left']);
  assert.ok(annotation.regions.filter(region => ['shoulder', 'upperArm', 'scapular'].includes(region.kind)).every(region => region.side === 'left'));
  assert.ok(annotation.cue.support.startsWith('左手'));
  sequence.steps[1].pose.limbs.left.handLocked = false;
  const unsupported = resolveMovementPoseAnnotations(sequence, 1);
  assert.deepEqual(unsupported.supportHands, []);
  assert.ok(!unsupported.regions.some(region => region.kind === 'shoulder' || region.kind === 'upperArm'));
});

check('Skipped, disabled, unidentified and incomplete originals have no default annotation entry', () => {
  assert.equal(resolveMovementPoseAnnotations({ ...current, skippedSteps: [0, 8] }, 0), null);
  assert.equal(resolveMovementPoseAnnotations({ ...current, skippedSteps: [0, 8] }, 8), null);
  assert.ok(resolveMovementPoseAnnotations({ ...current, skippedSteps: [0, 8] }, 1));
  const invalid = structuredClone(current);
  invalid.steps[1].enabled = false;
  assert.equal(resolveMovementPoseAnnotations(invalid, 1), null);
  delete invalid.steps[1].enabled;
  delete invalid.steps[1].pose;
  assert.equal(resolveMovementPoseAnnotations(invalid, 1), null);
  const unknown = metadataSequence([9, 10]);
  assert.equal(resolveMovementPoseAnnotations(unknown, 0), null);
  assert.equal(resolveMovementPoseAnnotations(null, 0), null);
  for (const index of [-1, 100, .5, '0']) assert.equal(resolveMovementPoseAnnotations(current, index), null);
});

check('Pose labels use real rig anchors and exact atlas groups, including quadriceps and coverage limits', () => {
  const joints = new Set(TRAJECTORY_JOINTS.map(channel => channel.joint));
  const atlasGroups = new Set(atlas.groups.map(group => group.id));
  for (let index = 0; index < current.steps.length; index++) {
    const annotation = resolveMovementPoseAnnotations(current, index);
    for (const label of annotation.labels) {
      assert.ok(groupById[label.group]);
      assert.ok(joints.has(label.anchor));
      assert.ok(label.anchors.every(anchor => joints.has(anchor)));
      assert.ok(label.anatomyGroups.every(group => atlasGroups.has(group)));
    }
    for (const region of annotation.regions) {
      assert.ok(groupById[region.group]);
      assert.ok(region.anatomyGroups.every(group => atlasGroups.has(group)));
    }
    const quads = annotation.regions.filter(region => region.kind === 'quad');
    assert.ok(quads.every(region => region.anatomyGroups.length === 1 && region.anatomyGroups[0] === 'quadriceps'));
    assert.ok(annotation.labels.find(label => label.id === 'long-legs').muscles.includes('股四头肌'));
    assert.ok(annotation.missingAnatomyNote.includes('背阔肌'));
    assert.ok(annotation.cues.every(cue => joints.has(cue.anchor) && cue.space === 'model' && cue.direction.every(Number.isFinite)));
    assert.deepEqual(annotation.audienceLabels.map(label => label.label), ['肩臂支撑', '核心协调', '髋腿摆动']);
    assert.ok(annotation.audienceLabels.every(label => groupById[label.group] && label.anchors.every(anchor => joints.has(anchor))));
  }
});

console.log(`Movement lesson: ${checks} focused checks passed.`);
