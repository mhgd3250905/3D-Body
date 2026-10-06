import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createSegmentGuideEditor, segmentGuideMarkup } from '../src/segment-guide-editor.js';
import { createTransitionEdits } from '../src/transition-edits.js';
import { planSegmentGuideRange } from '../src/segment-guide-range.js';
import { segmentGuideMatches } from '../src/segment-guides.js';

// This is an editor contract harness, not a skeletal/trajectory calculation
// check. The backend supplies fixed actual coordinates and explicit midpoint
// targets, including deliberately constrained and fixed orbit targets for
// marker tests. It does not reproduce circular interpolation or IK.
// It owns no browser, DOM window, persistent storage or live user animation.
const clone = value => structuredClone(value), hash = value => createHash('sha256').update(value).digest('hex');
const sourceURL = new URL('../public/coach/flare-sequence.json', import.meta.url);
const editorURL = new URL('../src/segment-guide-editor.js', import.meta.url);
const sourceBytes = await fs.readFile(sourceURL, 'utf8'), source = JSON.parse(sourceBytes);
const editorBytes = await fs.readFile(editorURL, 'utf8');
const checks = [], failures = [];let assertions = 0;
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label);assertions++; }
function ok(actual, label) { assert.ok(actual, label);assertions++; }
function near(actual, expected, label) { assert.ok(Math.abs(actual - expected) < 1e-12, label);assertions++; }
function nearVector(actual, expected, label) { equal(actual.length, expected.length);for (let axis = 0; axis < expected.length; axis++) near(actual[axis], expected[axis], label); }
function throws(action, match) { assert.throws(action, match);assertions++; }
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }return value; }
function check(name, action) {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
}
const ref = index => ({ kind: 'step', id: source.steps[index].id });
const pointRef = id => ({ kind: 'point', id });
const point = (id, segment, at, poseIndex = segment, extra = {}) =>
  ({ id, segment, at, name: id, pose: clone(source.steps[poseIndex].pose), ...extra });
const fixture = () => ({ ...createTransitionEdits(source), points: [point('first-K', 0, .3), point('second-K', 0, .7)],
  draft: { segment: 4, at: .4, name: '未保存草稿', pose: clone(source.steps[4].pose) },
  footCurves: [{ id: 'retained-foot-curve', side: 'left', from: ref(4), to: ref(5), bend: [.01, .02, .03] }],
  skippedSteps: [], personal: { label: '保留', values: [1, { nested: true }] } });
const plain = () => createTransitionEdits(source);
const positions = freeze({ pelvis: [0, 1, 0], leftAnkle: [-.3, .1, 0], rightAnkle: [.3, .1, 0], leftWrist: [-.2, .4, 0], rightWrist: [.2, .4, 0] });
const endpointPositions = freeze([
  { pelvis: [-.4, .9, -.2], leftAnkle: [-.7, 0, -.1], rightAnkle: [-.1, .2, .1], leftWrist: [-.3, .3, .1], rightWrist: [.1, .5, -.1] },
  { pelvis: [.4, 1.1, .2], leftAnkle: [.1, .2, .1], rightAnkle: [.7, 0, -.1], leftWrist: [-.1, .5, -.1], rightWrist: [.3, .3, .1] },
]);
const orbitMidpointOffsets = freeze({ short: [.13, .07, -.05], long: [-.09, .17, .06] });
globalThis.document = { activeElement: null };
Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Editor test must not touch persistent storage'); } });

class Element {
  constructor(id) { this.id = id;this.value = '';this.checked = false;this.hidden = false;this.disabled = false;this.innerHTML = '';this.textContent = '';this.listeners = new Map(); }
  addEventListener(type, listener) { const list = this.listeners.get(type) ?? [];list.push(listener);this.listeners.set(type, list); }
  emit(type, value) { if (value !== undefined) this.value = String(value);for (const listener of this.listeners.get(type) ?? []) listener({ target: this }); }
}

function harness(document = fixture(), bounds = { startTime: 0, endTime: 1 }) {
  let saved = freeze(clone(document)), editor, target = null, selected = 'pelvis', handles = [];
  const sequence = freeze(clone(source)), original = clone(saved), sourceOriginal = clone(sequence);
  const elements = new Map([...segmentGuideMarkup.matchAll(/\bid="([^"]+)"/gu)].map(match => [match[1], new Element(match[1])]));
  const element = id => {
    const value = elements.get(id.replace(/^#/u, ''));
    if (!value) throw new Error(`Unknown test UI element ${id}`);
    return value;
  };
  const state = { previews: [], applyPayloads: [], notifications: [], seeks: [], requests: [], cancels: [], before: 0,
    failPreview: 0, failSample: 0, applyResult: true, playing: false };
  const basicHandles = () => Object.entries(positions).map(([id, position]) => ({ id, position: [...position], quaternion: [0, 0, 0, 1], canRotate: false }));
  const poseEditor = {
    getState() { const handle = handles.find(value => value.id === selected);return { selected, position: handle ? [...handle.position] : null,
      label: handle?.label ?? '', handles: clone(handles), target: target?.kind ?? 'pose' }; },
    refresh() { handles = target ? target.getEditableHandles() : basicHandles();if (!handles.some(value => value.id === selected)) selected = null;return this.getState(); },
    setTarget(next) { target = next;selected = null;this.refresh();selected = handles.find(value => value.id === 'pelvis')?.id ?? handles[0]?.id ?? null;this.refresh(); },
    select(id) { if (handles.some(value => value.id === id)) selected = id;this.refresh(); },
    setTransformMode() {},
  };
  const motion = {
    group: {},
    sampleTrajectory(options) {
      state.requests.push({ startTime: options.startTime, endTime: options.endTime, samples: options.samples,
        corrections: clone(options.corrections), includeTimes: clone(options.includeTimes ?? []), guides: clone(options.segmentGuides) });
      if (state.failSample) { state.failSample--;throw new Error('Temporary sample failure'); }
      if (options.samples === 2 && options.endTime > options.startTime) {
        return { startTime: options.startTime, endTime: options.endTime, frames: [
          { time: options.startTime, joints: clone(endpointPositions[0]) },
          { time: options.endTime, joints: clone(endpointPositions[1]) },
        ] };
      }
      const time = (options.startTime + options.endTime) / 2;
      const span = editor.range()?.spans.find(value => time >= value.startTime && time <= value.endTime);
      const guide = options.segmentGuides.find(value => segmentGuideMatches(value, span));
      const joints = clone(positions), guideTargets = {};
      if (guide) for (const [joint, position] of Object.entries(positions)) {
        if (guide.orbitPaths?.[joint]) {
          guideTargets[joint] = position.map((value, axis) => value + orbitMidpointOffsets[guide.orbitPaths[joint].arc][axis]);
          continue;
        }
        const bend = guide.smoothPaths?.[joint]?.bend ?? guide.bends?.[joint];
        guideTargets[joint] = position.map((value, axis) => value + (bend?.[axis] ?? 0));
      }
      return { startTime: options.startTime, endTime: options.endTime, frames: [{ time, joints, guideTargets }] };
    },
  };
  poseEditor.refresh();
  editor = createSegmentGuideEditor({ viewer: { motion, poseEditor }, panel: { querySelector: element },
    getSequence: () => sequence, getDocument: () => saved, getRange: () => planSegmentGuideRange(sequence, saved, bounds),
    beforeBegin() { state.before++; },
    onPreview(value) { state.previews.push(clone(value));if (state.failPreview) { state.failPreview--;throw new Error('Temporary preview failure'); } },
    onApply(value) { state.applyPayloads.push(clone(value));if (state.applyResult === false) return false;saved = freeze(clone(value));return true; },
    onCancel(value) { state.cancels.push(clone(value)); }, onSeek(value) { state.seeks.push(value); },
    notify(value) { state.notifications.push(value); }, isPlaying: () => state.playing,
  });
  editor.bind();
  return { editor, element, state, poseEditor, sequence, original, sourceOriginal,
    saved: () => saved, target: () => target,
    begin({ skip = false } = {}) { element('segment-guide-skip-k').checked = skip;editor.begin(); },
    currentGuide() { const current = editor.state();return current.guides.find(value => segmentGuideMatches(value, current.spans[current.selected])); },
    assertUnchanged() { equal(saved, original);equal(sequence, sourceOriginal); },
  };
}

check('Begin keeps two existing K poses and exposes three independently selectable spans without saving', () => {
  const h = harness();h.begin();
  equal(h.editor.state().spans.length, 3);equal(h.editor.range().anchors.map(value => value.time), [0, .3, .7, 1]);
  equal(h.editor.document().points, h.original.points);equal(h.editor.document().draft, h.original.draft);
  equal(h.editor.document().footCurves, h.original.footCurves);equal(h.editor.document().personal, h.original.personal);
  equal(h.state.applyPayloads.length, 0);equal(h.state.before, 1);ok(h.editor.active());
  ok(h.element('segment-guide-edit').hidden === false);ok(h.element('segment-guide-skip-k').disabled);
  h.element('segment-guide-span').emit('change', 1);equal(h.editor.state().selected, 1);near(h.state.seeks.at(-1), .5);
  h.assertUnchanged();h.editor.cancel();equal(h.editor.active(), false);equal(h.poseEditor.getState().target, 'pose');h.assertUnchanged();
});

check('Skip choice previews one span and retains every K identity, position, name and pose; cancel restores saved data', () => {
  const h = harness();h.begin({ skip: true });
  equal(h.editor.state().spans.length, 1);equal(h.editor.range().anchors.map(value => value.time), [0, 1]);
  equal(h.editor.document().points, h.original.points.map(value => ({ ...value, skipped: true })));
  equal(h.editor.document().base, h.original.base);equal(h.editor.document().draft, h.original.draft);
  const previewRequest = h.state.requests.find(value => value.startTime === 0 && value.endTime === 1);
  equal(previewRequest.corrections, []);equal(previewRequest.includeTimes, [0, 1]);
  h.assertUnchanged();h.element('segment-guide-cancel').emit('click');equal(h.editor.active(), false);
  equal(h.state.applyPayloads, []);equal(h.state.cancels, [{ resample: true }]);h.assertUnchanged();
});

check('Skipping intermediate K keeps original 10 as an interior hard anchor in 09→11', () => {
  const doc = fixture();doc.points = [point('before-10', 0, .4), point('after-10', 1, .6)];
  const h = harness(doc, { startTime: 0, endTime: 2 });h.begin({ skip: true });
  equal(h.editor.range().anchors.map(value => value.time), [0, 1, 2]);equal(h.editor.state().spans.length, 2);
  equal(h.editor.state().spans[0].to, ref(1));equal(h.editor.state().spans[1].from, ref(1));
  equal(h.editor.document().skippedSteps, []);equal(h.sequence.steps, source.steps);h.assertUnchanged();
});

check('K endpoint identities remain enabled while only interior K are skipped, including an interior K 1e-10 from an original', () => {
  const doc = plain();doc.points = [point('start-K', 0, .25), point('inside-K', 0, .5), point('end-K', 0, .75), point('outside-K', 1, .2)];
  const h = harness(doc, { startTime: .25, endTime: .75 });h.begin({ skip: true });
  equal(h.editor.state().spans.length, 1);equal(h.editor.state().spans[0].from, pointRef('start-K'));equal(h.editor.state().spans[0].to, pointRef('end-K'));
  equal(h.editor.document().points, h.original.points.map(value => value.id === 'inside-K' ? { ...value, skipped: true } : value));h.assertUnchanged();
  const nearDoc = plain();nearDoc.points = [point('near-original', 0, 1e-10), point('inside', 0, .4), point('end-K', 0, .75)];
  const nearH = harness(nearDoc, { startTime: 0, endTime: .75 });nearH.begin({ skip: true });
  equal(nearH.editor.document().points[0].skipped, true);equal(nearH.editor.document().points[1].skipped, true);
  equal(nearH.editor.document().points[2], nearH.original.points[2]);equal(nearH.editor.state().spans.length, 1);nearH.assertUnchanged();
});

check('Skip choice unfolds wrap K times while preserving both selected K boundaries and the next-cycle original 09', () => {
  const doc = plain();doc.points = [point('wrap-start', 8, .25), point('wrap-middle', 8, .75), point('next-middle', 0, .25), point('wrap-end', 0, .75)];
  const h = harness(doc, { startTime: 8.25, endTime: 9.75 });h.begin({ skip: true });
  equal(h.editor.range().anchors.map(value => value.time), [8.25, 9, 9.75]);equal(h.editor.state().spans.length, 2);
  equal(h.editor.state().spans[0].to, ref(0));equal(h.editor.state().spans[1].from, ref(0));
  equal(h.editor.document().points, h.original.points.map(value => ['wrap-middle', 'next-middle'].includes(value.id) ? { ...value, skipped: true } : value));
  h.editor.cancel({ resample: false });equal(h.state.cancels, [{ resample: false }]);h.assertUnchanged();
});

check('Legal existing guides with omitted control bags enter preview and create bags only when edited', () => {
  const doc = plain();doc.segmentGuides = [{ id: 'minimal-guide', from: ref(0), to: ref(1), timing: 'smooth', metadata: { keep: true } }];
  const h = harness(doc);h.begin();equal(h.currentGuide(), doc.segmentGuides[0]);near(Number(h.element('segment-guide-angle').value), 0);
  h.element('segment-guide-angle').emit('change', 45);near(h.currentGuide().bendAngles.leftKnee, Math.PI / 4);
  equal(h.currentGuide().metadata, { keep: true });equal(h.currentGuide().timing, 'smooth');ok(!Object.hasOwn(h.currentGuide(), 'bends'));
  h.target().editHandle('pelvis', { position: [.04, 1, 0] });equal(h.currentGuide().bends.pelvis, [.04, 0, 0]);
  h.element('segment-guide-neutral').emit('click');equal(h.currentGuide().bends, {});equal(h.currentGuide().bendAngles, {});
  equal(h.currentGuide().metadata, { keep: true });h.assertUnchanged();
});

check('Full 200-guide saved library can remove a selected existing route without adding missing guides or exceeding capacity', () => {
  const doc = plain();doc.segmentGuides = [{ id: 'remove-this', from: ref(0), to: ref(1), timing: 'linear' },
    ...Array.from({ length: 199 }, (_, index) => ({ id: `dormant-${index}`, from: pointRef(`removed-from-${index}`), to: pointRef(`removed-to-${index}`), timing: 'smooth', memo: index }))];
  const h = harness(doc, { startTime: 0, endTime: 2 });ok(!h.element('segment-guide-remove').hidden);
  h.element('segment-guide-remove').emit('click');equal(h.state.applyPayloads.length, 1);
  equal(h.state.applyPayloads[0].segmentGuides, doc.segmentGuides.slice(1));equal(h.state.applyPayloads[0].points, doc.points);
  equal(h.state.notifications.some(value => /200/u.test(value)), false);equal(h.saved().segmentGuides.length, 199);equal(h.editor.active(), false);
});

check('Disabled saved routes can be removed without re-enabling inactive K or creating a preview', () => {
  const doc = plain();doc.enabled = false;doc.points = [point('inactive-K', 0, .5)];doc.segmentGuides = [{ id: 'disabled-route', from: ref(0), to: ref(1), timing: 'linear' }];
  const h = harness(doc);ok(!h.element('segment-guide-remove').hidden);h.element('segment-guide-remove').emit('click');
  equal(h.state.applyPayloads.length, 1);equal(h.state.applyPayloads[0].enabled, false);equal(h.state.applyPayloads[0].points, doc.points);
  equal(h.state.applyPayloads[0].segmentGuides, []);equal(h.editor.active(), false);equal(h.state.previews, []);
});

check('Failed update and failed undo roll back preview state and allow retrying the same undo', () => {
  const h = harness(plain());h.begin();h.element('segment-guide-angle').emit('change', 20);
  const previous = clone(h.editor.document());ok(!h.element('segment-guide-undo').disabled);
  h.state.failPreview = 1;h.element('segment-guide-angle').emit('change', 30);
  equal(h.editor.document(), previous);ok(!h.element('segment-guide-undo').disabled);ok(h.state.notifications.some(value => /Temporary preview failure/u.test(value)));
  h.state.failPreview = 1;throws(() => h.editor.undo(), /Temporary preview failure/u);
  equal(h.editor.document(), previous);ok(!h.element('segment-guide-undo').disabled);
  h.editor.undo();near(h.currentGuide().bendAngles?.leftKnee ?? 0, 0);ok(h.element('segment-guide-undo').disabled);h.assertUnchanged();
});

check('A sample failure rolls back route changes without contaminating later successful previews', () => {
  const h = harness(plain());h.begin();const before = clone(h.editor.document());
  h.state.failSample = 1;h.element('segment-guide-angle').emit('change', 60);
  equal(h.editor.document(), before);ok(h.element('segment-guide-undo').disabled);
  h.element('segment-guide-angle').emit('change', 15);near(h.currentGuide().bendAngles.leftKnee, Math.PI / 12);
  ok(!h.element('segment-guide-undo').disabled);h.assertUnchanged();
});

check('A multi-update drag creates one undo checkpoint, cancelled drag creates none, and markers track target coordinates', () => {
  const h = harness(plain());h.begin();const initial = clone(h.currentGuide()), adapter = h.target();
  const initialSnapshot = adapter.capturePose();h.editor.changed({ phase: 'start' });
  adapter.editHandle('pelvis', { position: [.02, 1, 0] });adapter.editHandle('pelvis', { position: [.05, 1, 0] });
  h.poseEditor.refresh();equal(h.poseEditor.getState().position, [.05, 1, 0]);
  equal(h.editor.data().frames[0].joints.pelvis, [0, 1, 0]);equal(h.editor.data().frames[0].guideTargets.pelvis, [.05, 1, 0]);
  ok(/最大偏差 5\.0 cm/u.test(h.element('segment-guide-note').textContent));
  h.editor.changed({ phase: 'end' });ok(!h.element('segment-guide-undo').disabled);h.editor.undo();equal(h.currentGuide(), initial);
  ok(h.element('segment-guide-undo').disabled);
  h.editor.changed({ phase: 'start' });adapter.editHandle('pelvis', { position: [.1, 1, 0] });adapter.applyPose(initialSnapshot);h.editor.changed({ phase: 'end' });
  equal(h.currentGuide(), initial);ok(h.element('segment-guide-undo').disabled);h.assertUnchanged();
});

check('Shared locked hands are excluded from scene handles and cannot accept route changes', () => {
  const doc = plain(), both = clone(source.steps[0].pose);both.limbs.left.handLocked = true;both.limbs.right.handLocked = true;
  doc.points = [point('locked-hand-K', 0, .5)];doc.points[0].pose = both;
  const h = harness(doc, { startTime: 0, endTime: .5 });h.begin();
  const locked = ['left', 'right'].filter(side => source.steps[0].pose.limbs[side].handLocked);
  for (const side of locked) {
    ok(!h.poseEditor.getState().handles.some(value => value.id === side + 'Wrist'));
    throws(() => h.target().editHandle(side + 'Wrist', { position: [0, 0, 0] }), /固定支撑手/u);
  }
  ok(locked.length > 0);h.assertUnchanged();
});

check('Rejected apply retains editable preview and unchanged saved document; a successful apply commits one complete payload once', () => {
  const h = harness();h.begin({ skip: true });h.element('segment-guide-angle').emit('change', 25);
  const preview = h.editor.document();h.state.applyResult = false;h.editor.apply();
  equal(h.state.applyPayloads.length, 1);equal(h.state.applyPayloads[0], preview);equal(h.editor.document(), preview);
  ok(h.editor.active());equal(h.state.cancels, []);h.assertUnchanged();
  h.state.applyResult = true;h.editor.apply();equal(h.state.applyPayloads.length, 2);equal(h.state.applyPayloads[1], preview);
  equal(h.saved(), preview);equal(h.editor.active(), false);equal(h.state.cancels, [{ resample: true }]);
  h.editor.apply();equal(h.state.applyPayloads.length, 2);
  equal(h.saved().points, h.original.points.map(value => ({ ...value, skipped: true })));equal(h.saved().draft, h.original.draft);
  equal(h.saved().footCurves, h.original.footCurves);equal(h.saved().personal, h.original.personal);equal(h.saved().base, h.original.base);
  equal(h.sequence, h.sourceOriginal);
});

check('Playing disables editing controls and apply does not publish a payload during playback', () => {
  const h = harness(plain());h.begin();h.state.playing = true;h.editor.refresh();h.editor.apply();
  for (const id of ['segment-guide-apply', 'segment-guide-span', 'segment-guide-pos-0', 'segment-guide-angle', 'segment-guide-timing']) ok(h.element(id).disabled);
  equal(h.state.applyPayloads, []);ok(h.editor.active());h.state.playing = false;h.editor.cancel();h.assertUnchanged();
});

function authoredGuide() {
  return { id: 'authored-route', from: ref(0), to: ref(1), timing: 'smooth',
    bends: { leftAnkle: [.04, -.03, -.02], rightAnkle: [.01, .12, .02], pelvis: [.02, 0, 0] },
    bendAngles: { leftKnee: .3 }, metadata: { keep: ['old route', 2] } };
}
function smoothHarness({ withK = false } = {}) {
  const doc = withK ? fixture() : plain();doc.segmentGuides = [authoredGuide(),
    { id: 'outside-route', from: ref(4), to: ref(5), timing: 'linear', smoothPaths: { rightAnkle: { bend: [0, .2, 0] } } }];
  const h = harness(doc);h.begin({ skip: withK });h.element('segment-guide-joint').emit('change', 'leftAnkle');return h;
}

check('Redraw exposes a direct smooth target above the two actual ankle endpoints and preserves other routes and saved poses', () => {
  ok(/id="segment-guide-smooth"[^>]*>重绘平滑弧线/u.test(segmentGuideMarkup));
  ok(/id="segment-guide-original"[^>]*>返回原路线/u.test(segmentGuideMarkup));
  const h = smoothHarness({ withK: true }), before = clone(h.currentGuide()), beforeDocument = clone(h.editor.document());
  ok(h.element('segment-guide-original').hidden);h.element('segment-guide-smooth').emit('click');
  nearVector(h.currentGuide().smoothPaths.leftAnkle.bend, [.04, .08, -.02]);
  nearVector(h.poseEditor.getState().position, [-.26, .18, -.02]);
  equal(h.currentGuide().bends, before.bends);equal(h.currentGuide().bendAngles, before.bendAngles);
  equal(h.currentGuide().id, before.id);equal(h.currentGuide().timing, before.timing);equal(h.currentGuide().metadata, before.metadata);
  equal(Object.keys(h.currentGuide().smoothPaths), ['leftAnkle']);ok(!h.element('segment-guide-original').hidden);
  equal(h.editor.document().points, beforeDocument.points);equal(h.editor.document().draft, beforeDocument.draft);
  equal(h.editor.document().footCurves, beforeDocument.footCurves);equal(h.editor.document().base, beforeDocument.base);
  equal(h.editor.document().segmentGuides[1], beforeDocument.segmentGuides[1]);equal(h.state.applyPayloads, []);
  ok(h.state.requests.some(value => value.samples === 2 && value.startTime === 0 && value.endTime === 1), 'Redraw did not request both actual saved endpoints');
  h.assertUnchanged();
});

check('Smooth numeric and drag adjustments edit only smooth bend, and undo restores both curve mode and midpoint in one gesture', () => {
  const h = smoothHarness(), originalGuide = clone(h.currentGuide());h.element('segment-guide-smooth').emit('click');
  const originalSmooth = clone(h.currentGuide());
  h.element('segment-guide-pos-1').emit('change', 33);near(h.currentGuide().smoothPaths.leftAnkle.bend[1], .23);
  near(h.poseEditor.getState().position[1], .33);equal(h.currentGuide().bends, originalGuide.bends);
  h.editor.undo();equal(h.currentGuide(), originalSmooth);ok(!h.element('segment-guide-original').hidden);
  h.editor.undo();equal(h.currentGuide(), originalGuide);ok(h.element('segment-guide-original').hidden);
  h.element('segment-guide-smooth').emit('click');const dragBefore = clone(h.currentGuide());h.editor.changed({ phase: 'start' });
  h.target().editHandle('leftAnkle', { position: [.1, .25, -.04] });h.target().editHandle('leftAnkle', { position: [.2, .3, -.1] });
  h.poseEditor.refresh();h.editor.changed({ phase: 'end' });
  nearVector(h.currentGuide().smoothPaths.leftAnkle.bend, [.5, .2, -.1]);nearVector(h.poseEditor.getState().position, [.2, .3, -.1]);
  equal(h.currentGuide().bends, originalGuide.bends);h.editor.undo();equal(h.currentGuide(), dragBefore);
  ok(!h.element('segment-guide-original').hidden);h.editor.undo();equal(h.currentGuide(), originalGuide);
  ok(h.element('segment-guide-original').hidden);ok(h.element('segment-guide-undo').disabled);h.assertUnchanged();
});

check('Return original removes only the selected smooth path, restores its retained old offset and can be undone', () => {
  const doc = plain(), guide = authoredGuide();guide.smoothPaths = { leftAnkle: { bend: [.1, .2, .3] }, rightAnkle: { bend: [.02, .1, -.03] } };
  doc.segmentGuides = [guide];const h = harness(doc);h.begin();
  ok(h.element('segment-guide-original').hidden, 'Pelvis has no smooth path');
  h.element('segment-guide-joint').emit('change', 'leftAnkle');ok(!h.element('segment-guide-original').hidden);
  h.element('segment-guide-original').emit('click');
  ok(!Object.hasOwn(h.currentGuide().smoothPaths ?? {}, 'leftAnkle'));equal(h.currentGuide().smoothPaths.rightAnkle, guide.smoothPaths.rightAnkle);
  equal(h.currentGuide().bends, guide.bends);nearVector(h.poseEditor.getState().position, [-.26, .07, -.02]);
  ok(h.element('segment-guide-original').hidden);h.editor.undo();equal(h.currentGuide(), guide);ok(!h.element('segment-guide-original').hidden);
  h.element('segment-guide-joint').emit('change', 'rightAnkle');ok(!h.element('segment-guide-original').hidden);h.assertUnchanged();
});

check('Neutral clears the selected span smooth modes along with its route controls, retaining outside records and undoing exactly', () => {
  const h = smoothHarness();h.element('segment-guide-smooth').emit('click');h.element('segment-guide-joint').emit('change', 'pelvis');
  h.element('segment-guide-smooth').emit('click');nearVector(h.currentGuide().smoothPaths.pelvis.bend, [.02, .02, 0]);
  const before = clone(h.currentGuide()), outside = clone(h.editor.document().segmentGuides[1]);
  h.element('segment-guide-neutral').emit('click');equal(Object.keys(h.currentGuide().smoothPaths ?? {}), []);
  equal(h.currentGuide().bends, {});equal(h.currentGuide().bendAngles, {});ok(h.element('segment-guide-original').hidden);
  equal(h.editor.document().segmentGuides[1], outside);h.editor.undo();equal(h.currentGuide(), before);h.assertUnchanged();
});

check('Higher authored arc is retained when redrawing instead of being flattened to the minimum foot lift', () => {
  const doc = plain(), guide = authoredGuide();guide.bends.leftAnkle = [.05, .2, .01];doc.segmentGuides = [guide];
  const h = harness(doc);h.begin();h.element('segment-guide-joint').emit('change', 'leftAnkle');h.element('segment-guide-smooth').emit('click');
  nearVector(h.currentGuide().smoothPaths.leftAnkle.bend, [.05, .2, .01]);near(h.poseEditor.getState().position[1], .3);
  equal(h.currentGuide().bends, guide.bends);h.assertUnchanged();
  const withMetadata = plain(), storedGuide = authoredGuide();
  storedGuide.smoothPaths = { leftAnkle: { bend: [.1, .2, .3], note: '保留原有路径说明', extra: { version: 2 } } };
  withMetadata.segmentGuides = [storedGuide];const metadataH = harness(withMetadata);metadataH.begin();
  metadataH.element('segment-guide-joint').emit('change', 'leftAnkle');metadataH.element('segment-guide-smooth').emit('click');
  equal(metadataH.currentGuide().smoothPaths.leftAnkle.note, storedGuide.smoothPaths.leftAnkle.note);
  equal(metadataH.currentGuide().smoothPaths.leftAnkle.extra, storedGuide.smoothPaths.leftAnkle.extra);
  metadataH.element('segment-guide-pos-0').emit('change', -10);near(metadataH.currentGuide().smoothPaths.leftAnkle.bend[0], .2);
  equal(metadataH.currentGuide().smoothPaths.leftAnkle.extra, storedGuide.smoothPaths.leftAnkle.extra);metadataH.assertUnchanged();
});

check('Failed redraw and undo remain reversible, without losing original/smooth mode or the checkpoint needed to retry', () => {
  const h = smoothHarness(), before = clone(h.currentGuide());h.state.failPreview = 1;h.element('segment-guide-smooth').emit('click');
  equal(h.currentGuide(), before);ok(h.element('segment-guide-original').hidden);ok(h.element('segment-guide-undo').disabled);
  h.element('segment-guide-smooth').emit('click');const initialSmooth = clone(h.currentGuide());h.element('segment-guide-pos-1').emit('change', 30);
  const edited = clone(h.currentGuide());h.state.failPreview = 1;throws(() => h.editor.undo(), /Temporary preview failure/u);
  equal(h.currentGuide(), edited);ok(!h.element('segment-guide-original').hidden);ok(!h.element('segment-guide-undo').disabled);
  h.editor.undo();equal(h.currentGuide(), initialSmooth);h.editor.undo();equal(h.currentGuide(), before);
  ok(h.element('segment-guide-original').hidden);h.assertUnchanged();
});

check('Smooth preview cancel and rejected apply preserve the saved library; accepted apply publishes one full independent payload', () => {
  const h = smoothHarness({ withK: true });h.element('segment-guide-smooth').emit('click');h.element('segment-guide-pos-0').emit('change', -15);
  const preview = clone(h.editor.document());h.state.applyResult = false;h.editor.apply();
  equal(h.state.applyPayloads, [preview]);equal(h.editor.document(), preview);ok(h.editor.active());h.assertUnchanged();
  h.editor.cancel();equal(h.editor.active(), false);h.assertUnchanged();
  const savedH = smoothHarness({ withK: true });savedH.element('segment-guide-smooth').emit('click');
  const committed = clone(savedH.editor.document());savedH.editor.apply();savedH.editor.apply();
  equal(savedH.state.applyPayloads, [committed]);equal(savedH.saved(), committed);equal(savedH.editor.active(), false);
  equal(savedH.saved().points, savedH.original.points.map(value => ({ ...value, skipped: true })));
  equal(savedH.saved().segmentGuides[0].bends, savedH.original.segmentGuides[0].bends);
  equal(savedH.saved().segmentGuides[1], savedH.original.segmentGuides[1]);equal(savedH.saved().draft, savedH.original.draft);
  equal(savedH.saved().footCurves, savedH.original.footCurves);equal(savedH.sequence, savedH.sourceOriginal);
});

check('Redrawing an existing smooth route at the 200-record limit adds no record and still allows cancel then removal', () => {
  const doc = plain();doc.segmentGuides = [authoredGuide(), ...Array.from({ length: 199 }, (_, index) =>
    ({ id: `smooth-dormant-${index}`, from: pointRef(`old-from-${index}`), to: pointRef(`old-to-${index}`), timing: 'linear' }))];
  const h = harness(doc);h.begin();h.element('segment-guide-joint').emit('change', 'leftAnkle');h.element('segment-guide-smooth').emit('click');
  equal(h.editor.document().segmentGuides.length, 200);near(h.currentGuide().smoothPaths.leftAnkle.bend[1], .08);
  equal(h.currentGuide().id, doc.segmentGuides[0].id);h.assertUnchanged();h.editor.cancel();h.assertUnchanged();
  h.element('segment-guide-remove').emit('click');equal(h.state.applyPayloads.length, 1);
  equal(h.state.applyPayloads[0].segmentGuides, doc.segmentGuides.slice(1));equal(h.saved().segmentGuides.length, 199);
});

function authoredOrbitPath(center = [.05, .45, -.1]) {
  return { center: [...center], arc: 'short', normal: [0, 1, 0], note: '保留旋转路径说明', custom: { version: 3 } };
}
function orbitDocument({ withK = false, stored = false } = {}) {
  const doc = withK ? fixture() : plain(), guide = authoredGuide();
  guide.smoothPaths = { leftAnkle: { bend: [.04, .12, -.02], note: '旧自由弧线保留' }, rightAnkle: { bend: [.02, .15, .01] } };
  if (stored) guide.orbitPaths = { leftAnkle: authoredOrbitPath(), rightAnkle: authoredOrbitPath([.3, .4, .1]) };
  doc.segmentGuides = [guide, { id: 'outside-orbit-route', from: ref(4), to: ref(5), timing: 'linear',
    orbitPaths: { rightAnkle: authoredOrbitPath([.4, .5, .2]) }, metadata: { outside: true } }];
  return doc;
}
function orbitHarness(options) {
  const h = harness(orbitDocument(options));h.begin({ skip: options?.withK === true });h.element('segment-guide-joint').emit('change', 'leftAnkle');return h;
}

check('Enabling rotation center creates an equal-radius initial center and presents that center instead of the sampled midpoint', () => {
  ok(/id="segment-guide-orbit"[^>]*>使用旋转中心/u.test(segmentGuideMarkup));
  const h = orbitHarness({ withK: true }), before = clone(h.currentGuide()), beforeDocument = clone(h.editor.document());
  h.element('segment-guide-orbit').emit('click');const path = h.currentGuide().orbitPaths.leftAnkle;
  equal(path.arc, 'short');equal(path.center.length, 3);ok(path.center.every(Number.isFinite));
  equal(path.normal.length, 3);ok(path.normal.every(Number.isFinite));ok(Math.hypot(...path.normal) > 1e-8);
  const radius = endpoint => Math.hypot(...endpoint.leftAnkle.map((value, axis) => value - path.center[axis]));
  near(radius(endpointPositions[0]), radius(endpointPositions[1]), 'Initial rotation center has different distances to its two saved endpoints');
  nearVector(h.poseEditor.getState().position, path.center);ok(h.poseEditor.getState().label.includes('旋转中心'));
  ok(!h.element('segment-guide-orbit-controls').hidden);equal(h.element('segment-guide-orbit-arc').value, 'short');
  ok(h.element('segment-guide-position-label').textContent.includes('旋转中心'));
  ok(JSON.stringify(h.poseEditor.getState().position) !== JSON.stringify(h.editor.data().frames[0].guideTargets.leftAnkle), 'Center marker was replaced by the trajectory midpoint');
  equal(h.currentGuide().bends, before.bends);equal(h.currentGuide().smoothPaths, before.smoothPaths);equal(h.currentGuide().bendAngles, before.bendAngles);
  equal(h.currentGuide().id, before.id);equal(h.currentGuide().metadata, before.metadata);equal(h.currentGuide().timing, before.timing);
  equal(h.editor.document().segmentGuides[1], beforeDocument.segmentGuides[1]);equal(h.editor.document().points, beforeDocument.points);
  equal(h.editor.document().draft, beforeDocument.draft);equal(h.editor.document().footCurves, beforeDocument.footCurves);
  equal(h.state.applyPayloads, []);h.assertUnchanged();
});

check('Center numeric inputs and a multi-update drag change only center coordinates and preserve orbit hints and retained routes', () => {
  const h = orbitHarness({ stored: true }), before = clone(h.currentGuide());
  nearVector(h.poseEditor.getState().position, before.orbitPaths.leftAnkle.center);ok(h.poseEditor.getState().label.includes('旋转中心'));
  h.element('segment-guide-pos-0').emit('change', 15);nearVector(h.currentGuide().orbitPaths.leftAnkle.center, [.15, .45, -.1]);
  nearVector(h.poseEditor.getState().position, [.15, .45, -.1]);equal(h.currentGuide().orbitPaths.leftAnkle.normal, before.orbitPaths.leftAnkle.normal);
  equal(h.currentGuide().orbitPaths.leftAnkle.custom, before.orbitPaths.leftAnkle.custom);equal(h.currentGuide().orbitPaths.leftAnkle.note, before.orbitPaths.leftAnkle.note);
  const dragBefore = clone(h.currentGuide());h.editor.changed({ phase: 'start' });
  h.target().editHandle('leftAnkle', { position: [.18, .48, -.2] });h.target().editHandle('leftAnkle', { position: [.22, .5, -.3] });
  h.poseEditor.refresh();h.editor.changed({ phase: 'end' });nearVector(h.poseEditor.getState().position, [.22, .5, -.3]);
  nearVector(h.currentGuide().orbitPaths.leftAnkle.center, [.22, .5, -.3]);equal(h.currentGuide().orbitPaths.rightAnkle, before.orbitPaths.rightAnkle);
  equal(h.currentGuide().smoothPaths, before.smoothPaths);equal(h.currentGuide().bends, before.bends);equal(h.currentGuide().bendAngles, before.bendAngles);
  h.editor.undo();equal(h.currentGuide(), dragBefore);h.editor.undo();equal(h.currentGuide(), before);ok(h.element('segment-guide-undo').disabled);
  h.element('segment-guide-joint').emit('change', 'pelvis');ok(!h.poseEditor.getState().label.includes('旋转中心'));
  nearVector(h.poseEditor.getState().position, [.02, 1, 0]);ok(h.element('segment-guide-orbit-controls').hidden);h.assertUnchanged();
});

check('Short/long selection changes only the selected orbit and is independently undoable without moving its center', () => {
  const h = orbitHarness({ stored: true }), before = clone(h.currentGuide()), shortTarget = clone(h.editor.data().frames[0].guideTargets.leftAnkle);
  h.element('segment-guide-orbit-arc').emit('change', 'long');equal(h.currentGuide().orbitPaths.leftAnkle.arc, 'long');
  equal(h.element('segment-guide-orbit-arc').value, 'long');nearVector(h.poseEditor.getState().position, before.orbitPaths.leftAnkle.center);
  equal(h.currentGuide().orbitPaths.leftAnkle.center, before.orbitPaths.leftAnkle.center);equal(h.currentGuide().orbitPaths.leftAnkle.normal, before.orbitPaths.leftAnkle.normal);
  equal(h.currentGuide().orbitPaths.leftAnkle.custom, before.orbitPaths.leftAnkle.custom);equal(h.currentGuide().orbitPaths.rightAnkle, before.orbitPaths.rightAnkle);
  equal(h.currentGuide().smoothPaths, before.smoothPaths);equal(h.currentGuide().bends, before.bends);
  ok(JSON.stringify(h.editor.data().frames[0].guideTargets.leftAnkle) !== JSON.stringify(shortTarget), 'Preview did not receive the selected long arc');
  h.editor.undo();equal(h.currentGuide(), before);equal(h.element('segment-guide-orbit-arc').value, 'short');h.assertUnchanged();
});

check('Smooth redraw exits only the selected orbit and restores free midpoint editing while one undo restores the center mode', () => {
  const h = orbitHarness({ stored: true }), before = clone(h.currentGuide());h.element('segment-guide-smooth').emit('click');
  ok(!Object.hasOwn(h.currentGuide().orbitPaths ?? {}, 'leftAnkle'));equal(h.currentGuide().orbitPaths.rightAnkle, before.orbitPaths.rightAnkle);
  nearVector(h.currentGuide().smoothPaths.leftAnkle.bend, [.13, .08, -.05]);equal(h.currentGuide().smoothPaths.leftAnkle.note, before.smoothPaths.leftAnkle.note);
  nearVector(h.poseEditor.getState().position, [-.17, .18, -.05]);ok(!h.poseEditor.getState().label.includes('旋转中心'));
  ok(h.element('segment-guide-orbit-controls').hidden);ok(h.element('segment-guide-position-label').textContent.includes('路线控制点'));
  equal(h.currentGuide().bends, before.bends);equal(h.currentGuide().smoothPaths.rightAnkle, before.smoothPaths.rightAnkle);
  h.element('segment-guide-pos-1').emit('change', 32);near(h.currentGuide().smoothPaths.leftAnkle.bend[1], .22);
  h.editor.undo();h.editor.undo();equal(h.currentGuide(), before);nearVector(h.poseEditor.getState().position, before.orbitPaths.leftAnkle.center);
  ok(h.poseEditor.getState().label.includes('旋转中心'));ok(!h.element('segment-guide-orbit-controls').hidden);h.assertUnchanged();
});

check('Return original deletes the selected orbit and smooth path together, while neutral clears all modes only in that span', () => {
  const h = orbitHarness({ stored: true }), before = clone(h.currentGuide()), outside = clone(h.editor.document().segmentGuides[1]);
  h.element('segment-guide-original').emit('click');ok(!Object.hasOwn(h.currentGuide().orbitPaths ?? {}, 'leftAnkle'));
  ok(!Object.hasOwn(h.currentGuide().smoothPaths ?? {}, 'leftAnkle'));equal(h.currentGuide().orbitPaths.rightAnkle, before.orbitPaths.rightAnkle);
  equal(h.currentGuide().smoothPaths.rightAnkle, before.smoothPaths.rightAnkle);equal(h.currentGuide().bends, before.bends);
  nearVector(h.poseEditor.getState().position, [-.26, .07, -.02]);ok(h.element('segment-guide-original').hidden);h.editor.undo();equal(h.currentGuide(), before);
  h.element('segment-guide-neutral').emit('click');equal(Object.keys(h.currentGuide().orbitPaths ?? {}), []);
  equal(Object.keys(h.currentGuide().smoothPaths ?? {}), []);equal(h.currentGuide().bends, {});equal(h.currentGuide().bendAngles, {});
  equal(h.editor.document().segmentGuides[1], outside);ok(h.element('segment-guide-orbit-controls').hidden);h.editor.undo();equal(h.currentGuide(), before);
  nearVector(h.poseEditor.getState().position, before.orbitPaths.leftAnkle.center);h.assertUnchanged();
});

check('Failed center enable, center edit and center undo roll back cleanly and retain a checkpoint for retry', () => {
  const h = orbitHarness(), before = clone(h.currentGuide());h.state.failPreview = 1;h.element('segment-guide-orbit').emit('click');
  equal(h.currentGuide(), before);ok(h.element('segment-guide-orbit-controls').hidden);ok(h.element('segment-guide-undo').disabled);
  h.element('segment-guide-orbit').emit('click');const centered = clone(h.currentGuide());h.state.failSample = 1;h.element('segment-guide-pos-0').emit('change', 15);
  equal(h.currentGuide(), centered);nearVector(h.poseEditor.getState().position, centered.orbitPaths.leftAnkle.center);
  h.element('segment-guide-pos-0').emit('change', 15);const edited = clone(h.currentGuide());h.state.failPreview = 1;
  throws(() => h.editor.undo(), /Temporary preview failure/u);equal(h.currentGuide(), edited);ok(!h.element('segment-guide-undo').disabled);
  h.editor.undo();equal(h.currentGuide(), centered);h.editor.undo();equal(h.currentGuide(), before);
  ok(h.element('segment-guide-orbit-controls').hidden);ok(!h.poseEditor.getState().label.includes('旋转中心'));h.assertUnchanged();
});

check('Center cancel and rejected apply preserve saved K poses and curves, while success publishes the complete center route once', () => {
  const h = orbitHarness({ withK: true });h.element('segment-guide-orbit').emit('click');h.element('segment-guide-pos-0').emit('change', 15);
  h.element('segment-guide-orbit-arc').emit('change', 'long');const preview = clone(h.editor.document());h.state.applyResult = false;h.editor.apply();
  equal(h.state.applyPayloads, [preview]);equal(h.editor.document(), preview);ok(h.editor.active());h.assertUnchanged();
  h.editor.cancel();equal(h.editor.active(), false);h.assertUnchanged();
  const savedH = orbitHarness({ withK: true });savedH.element('segment-guide-orbit').emit('click');const payload = clone(savedH.editor.document());
  savedH.editor.apply();savedH.editor.apply();equal(savedH.state.applyPayloads, [payload]);equal(savedH.saved(), payload);equal(savedH.editor.active(), false);
  equal(savedH.saved().points, savedH.original.points.map(value => ({ ...value, skipped: true })));
  equal(savedH.saved().draft, savedH.original.draft);equal(savedH.saved().footCurves, savedH.original.footCurves);
  equal(savedH.saved().segmentGuides[0].bends, savedH.original.segmentGuides[0].bends);equal(savedH.saved().segmentGuides[0].smoothPaths, savedH.original.segmentGuides[0].smoothPaths);
  equal(savedH.saved().segmentGuides[1], savedH.original.segmentGuides[1]);equal(savedH.sequence, savedH.sourceOriginal);
});

check('Center mode respects the 200-record limit without adding records and keeps its controls disabled during playback', () => {
  const doc = orbitDocument();doc.segmentGuides = [doc.segmentGuides[0], ...Array.from({ length: 199 }, (_, index) =>
    ({ id: `orbit-dormant-${index}`, from: pointRef(`old-orbit-from-${index}`), to: pointRef(`old-orbit-to-${index}`), timing: 'linear' }))];
  const h = harness(doc);h.begin();h.element('segment-guide-joint').emit('change', 'leftAnkle');h.element('segment-guide-orbit').emit('click');
  equal(h.editor.document().segmentGuides.length, 200);ok(Boolean(h.currentGuide().orbitPaths.leftAnkle));h.assertUnchanged();
  h.state.playing = true;h.editor.refresh();for (const id of ['segment-guide-orbit', 'segment-guide-orbit-arc', 'segment-guide-pos-0', 'segment-guide-smooth', 'segment-guide-original']) ok(h.element(id).disabled);
  h.editor.apply();equal(h.state.applyPayloads, []);h.state.playing = false;h.editor.cancel();h.assertUnchanged();
  h.element('segment-guide-remove').emit('click');equal(h.state.applyPayloads.length, 1);equal(h.state.applyPayloads[0].segmentGuides, doc.segmentGuides.slice(1));
});

equal(await fs.readFile(sourceURL, 'utf8'), sourceBytes, 'Formal source bytes changed');
const editorAfter = await fs.readFile(editorURL, 'utf8');
const report = { pass: failures.length === 0, passed: checks.filter(check => check.pass).length, total: checks.length, assertions, checks, failures,
  sourceSha256: hash(sourceBytes), editorSha256: hash(editorBytes), editorChangedDuringRun: editorAfter !== editorBytes,
  toolSha256: hash(await fs.readFile(new URL(import.meta.url))),
  scope: 'Isolated DOM/motion/poseEditor contract harness only: no browser or user storage. Retains K, skip, original-boundary and smooth-arc regressions; adds rotation-center enable, equal-radius initialization, center markers/numeric/drag, short/long selection, mode return/undo, failure/cancel/apply and capacity preservation. Fixed mock endpoints and orbit midpoint targets do not validate skeletal motion, circular interpolation, arc physics, browser layout or parent-panel lifecycle.' };
const output = new URL('../output/playwright/segment-guide-editor-verification.json', import.meta.url);
await fs.mkdir(new URL('.', output), { recursive: true });await fs.writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, assertions, editorChangedDuringRun: report.editorChangedDuringRun, failures, report: output.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
