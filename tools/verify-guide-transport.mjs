import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { clampGuideTime, unfoldGuideClock, guideTransportMarkers } from '../src/transition-transport.js';
import { getTrajectoryAnchors } from '../src/trajectory-range.js';
import { anchorKey } from '../src/foot-curves.js';
import { createTransitionEdits, transitionOptions, TRANSITION_STORAGE_KEY } from '../src/transition-edits.js';
import { createFlareSequence } from '../src/flare-sequence.js';
import { createTransitionPanel } from '../src/transition-panel.js';
import { TRAJECTORY_JOINTS } from '../src/trajectory-guide.js';

const clone = value => structuredClone(value), hash = value => createHash('sha256').update(value).digest('hex');
const sourceURL = new URL('../public/coach/flare-sequence.json', import.meta.url), sourceBytes = await fs.readFile(sourceURL, 'utf8');
const source = JSON.parse(sourceBytes), helperURL = new URL('../src/transition-transport.js', import.meta.url), panelURL = new URL('../src/transition-panel.js', import.meta.url);
const helperBytes = await fs.readFile(helperURL, 'utf8'), panelBytes = await fs.readFile(panelURL, 'utf8');
const checks = [], failures = [];let assertions = 0;
function equal(actual, expected, label) { assert.deepEqual(actual, expected, label);assertions++; }
function ok(actual, label) { assert.ok(actual, label);assertions++; }
function near(actual, expected, label) { assert.ok(Math.abs(actual - expected) < 1e-10, label ?? `${actual} != ${expected}`);assertions++; }
function throws(action, match) { assert.throws(action, match);assertions++; }
function check(name, action) { try { action();checks.push({ name, pass: true }); } catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); } }
function freeze(value) { if (value && typeof value === 'object') { Object.freeze(value);for (const child of Object.values(value)) freeze(child); }return value; }
const stepKey = index => anchorKey({ kind: 'step', id: source.steps[index].id });
const pointKey = id => anchorKey({ kind: 'point', id });
const point = (id, segment, at, extra = {}) => ({ id, segment, at, name: id, pose: clone(source.steps[segment].pose), ...extra });
const fixture = () => ({ ...createTransitionEdits(source), points: [point('early-K', 0, .3), point('middle-K', 1, .3), point('tail-K', 8, .5)],
  draft: { segment: 4, at: .3, name: '保留草稿', pose: clone(source.steps[4].pose) }, unknown: { preserve: [1, 'unchanged'] } });

check('Raw slider and frame-step times clamp to the selected interval without wrapping an overshoot', () => {
  const range = freeze({ startTime: 1, endTime: 2 });equal(clampGuideTime(-100, range), 1);equal(clampGuideTime(100, range), 2);
  equal(clampGuideTime(1.375, range), 1.375);equal(clampGuideTime(1, range), 1);equal(clampGuideTime(2, range), 2);
  equal(clampGuideTime(0, { startTime: 7, endTime: 9 }), 7);equal(clampGuideTime(11, { startTime: 7, endTime: 9 }), 9);
  equal(clampGuideTime(.3000000001, { startTime: .3000000001, endTime: 1 }), .3000000001);equal(range, { startTime: 1, endTime: 2 });
});

check('Legacy source clocks unfold into the selected cycle while direct slider input remains a separate operation', () => {
  equal(unfoldGuideClock(0, { startTime: 7, endTime: 9 }, 9), 9);equal(unfoldGuideClock(2, { startTime: 7, endTime: 11 }, 9), 11);
  equal(unfoldGuideClock(.5, { startTime: 7, endTime: 11 }, 9), 9.5);equal(unfoldGuideClock(8, { startTime: 0, endTime: 1 }, 9), 1);
  equal(unfoldGuideClock(9.5, { startTime: 7, endTime: 11 }, 9), 9.5);equal(unfoldGuideClock(25, { startTime: 7, endTime: 11 }, 9), 7);
  equal(unfoldGuideClock(18, { startTime: 0, endTime: 9 }, 9), 9);equal(unfoldGuideClock(9, { startTime: 0, endTime: 9 }, 9), 9);
  equal(unfoldGuideClock(8, { startTime: -2, endTime: 0 }, 9), -1);equal(unfoldGuideClock(4, { startTime: 14, endTime: 22 }, 18), 22);
  equal(clampGuideTime(.5, { startTime: 7, endTime: 11 }), 7);
});

check('Range markers include internal originals and saved K with relative percentages and saved skipped states', () => {
  const doc = fixture();doc.skippedSteps = [2];doc.points[1].skipped = true;
  const anchors = getTrajectoryAnchors(source, doc), markers = guideTransportMarkers(anchors, { startTime: 0, endTime: 2 }, 9);
  equal(markers.map(marker => marker.time), [0, .3, 1, 1.3, 2]);equal(markers.map(marker => marker.percent), [0, 15, 50, 65, 100]);
  equal(markers[3].skipped, true);equal(markers[3].active, false);equal(markers[4].skipped, true);equal(markers[4].index, 2);
  equal(markers[1].id, 'early-K');equal(markers[1].segment, 0);equal(markers[1].at, .3);
  const disabled = guideTransportMarkers(getTrajectoryAnchors(source, { ...doc, enabled: false }), { startTime: 0, endTime: 2 }, 9);
  equal(disabled.find(marker => marker.id === 'early-K').disabled, true);equal(disabled.find(marker => marker.id === 'early-K').active, false);
});

check('Wrap markers preserve the last 09, tail K, next-cycle first 09 and later originals at their true unfolded positions', () => {
  const anchors = getTrajectoryAnchors(source, fixture());
  const narrow = guideTransportMarkers(anchors, { startTime: 7, endTime: 9 }, 9);
  equal(narrow.map(marker => marker.time), [7, 8, 8.5, 9]);equal(narrow.map(marker => marker.percent), [0, 50, 75, 100]);
  equal(narrow[1].key, stepKey(8));equal(narrow[3].key, stepKey(0));ok(narrow[1].id !== narrow[3].id);
  equal(narrow[2].id, 'tail-K');equal(narrow[2].segment, 8);equal(narrow[3].clock, 0);equal(narrow[3].cycle, 1);
  const wide = guideTransportMarkers(anchors, { startTime: 7, endTime: 11 }, 9);equal(wide.map(marker => marker.time), [7, 8, 8.5, 9, 9.3, 10, 10.3, 11]);
  const previous = guideTransportMarkers(anchors, { startTime: -2, endTime: 1 }, 9);equal(previous.map(marker => marker.time), [-2, -1, -.5, 0, .3, 1]);
  const full = guideTransportMarkers(anchors, { startTime: 0, endTime: 9 }, 9);equal(full.filter(marker => marker.key === stepKey(0)).map(marker => marker.time), [0, 9]);
});

check('EPS-level boundary handling keeps a K only 1e-10 from an original and exact fractional K endpoints', () => {
  const doc = createTransitionEdits(source);doc.points = [point('near-original', 0, 1e-10), point('exact-start', 0, .3000000001), point('near-end', 0, .9999999999)];
  const anchors = getTrajectoryAnchors(source, doc), all = guideTransportMarkers(anchors, { startTime: 0, endTime: 1 }, 9);
  equal(all.map(marker => marker.time), [0, 1e-10, .3000000001, .9999999999, 1]);ok(all[1].percent > 0);ok(all[3].percent < 100);
  const exact = guideTransportMarkers(anchors, { startTime: .3000000001, endTime: 1 }, 9);equal(exact[0].id, 'exact-start');equal(exact[0].time, .3000000001);equal(exact[0].percent, 0);
  const scaled = guideTransportMarkers(getTrajectoryAnchors({ ...source, period: 18 }, doc), { startTime: 0, endTime: 2 }, 18);
  equal(scaled.map(marker => marker.percent), all.map(marker => marker.percent));
});

check('Transport copies only consumed metadata and cannot mutate saved anchors or read attached poses', () => {
  const input = freeze(getTrajectoryAnchors(source, fixture())), before = clone(input), trap = () => { throw new Error('Unexpected pose access'); };
  const values = input.map(anchor => ({ ...anchor }));for (const anchor of values) {
    Object.defineProperty(anchor, 'pose', { get: trap });Object.defineProperty(anchor, 'unknown', { get: trap });
  }
  const markers = guideTransportMarkers(values, { startTime: 7, endTime: 9 }, 9);ok(markers.every(marker => !Object.hasOwn(marker, 'pose') && !Object.hasOwn(marker, 'unknown')));
  markers[0].label = 'changed';markers[0].time = 100;equal(input, before);
});

check('Malformed transport inputs fail explicitly without looping or converting invalid numbers into valid frames', () => {
  for (const bad of [undefined, null, [], {}, { startTime: 0, endTime: 0 }, { startTime: 2, endTime: 1 }, { startTime: NaN, endTime: 1 }, { startTime: 0, endTime: Infinity }]) throws(() => clampGuideTime(0, bad));
  for (const bad of [NaN, Infinity, -Infinity, '0', null]) { throws(() => clampGuideTime(bad, { startTime: 0, endTime: 1 }));throws(() => unfoldGuideClock(bad, { startTime: 0, endTime: 1 }, 9)); }
  for (const bad of [0, -9, NaN, Infinity, '9']) throws(() => unfoldGuideClock(0, { startTime: 0, endTime: 1 }, bad));
  throws(() => guideTransportMarkers([], { startTime: 0, endTime: 10 }, 9));throws(() => unfoldGuideClock(1e100, { startTime: 0, endTime: 1 }, 9));
  const anchors = getTrajectoryAnchors(source, fixture());throws(() => guideTransportMarkers([anchors[0], anchors[0]], { startTime: 0, endTime: 1 }, 9));
  for (const patch of [{ key: 'bad' }, { time: -1 }, { time: 9 }, { active: 'yes' }, { label: null }]) throws(() => guideTransportMarkers([{ ...anchors[0], ...patch }], { startTime: 0, endTime: 1 }, 9));
});

// Small in-memory DOM/RAF adapters execute the real panel event handlers. They
// do not reproduce its seek/clamp/marker logic and do not own browser storage.
const decode = value => String(value ?? '').replace(/&(amp|quot|lt|gt|#39);/gu, (_, code) => ({ amp: '&', quot: '"', lt: '<', gt: '>', '#39': "'" }[code]));
const camel = value => value.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
class Classes {
  constructor(value = '') { this.values = new Set(value.split(/\s+/u).filter(Boolean)); }
  add(...values) { for (const value of values) this.values.add(value); }
  remove(...values) { for (const value of values) this.values.delete(value); }
  contains(value) { return this.values.has(value); }
  toggle(value, force = !this.values.has(value)) { if (force) this.values.add(value);else this.values.delete(value);return Boolean(force); }
}
class Element {
  constructor(tag = 'div', attributes = {}) {
    this.tag = tag;this.attributes = { ...attributes };this.id = attributes.id ?? '';this.dataset = {};
    for (const [name, value] of Object.entries(attributes)) if (name.startsWith('data-')) this.dataset[camel(name.slice(5))] = value;
    this.value = attributes.value ?? '';this.min = attributes.min ?? '';this.max = attributes.max ?? '';this.step = attributes.step ?? '';
    this.hidden = Object.hasOwn(attributes, 'hidden');this.disabled = Object.hasOwn(attributes, 'disabled');this.checked = Object.hasOwn(attributes, 'checked');
    this.classList = new Classes(attributes.class);this.children = [];this.listeners = new Map();this._html = '';this.textContent = '';this.firstChild = { textContent: '' };
    this.style = Object.fromEntries((attributes.style ?? '').split(';').filter(Boolean).map(part => part.split(':').map(value => value.trim())));
  }
  set innerHTML(value) { this._html = String(value);this.children = [];this.textContent = '';this.firstChild = { textContent: '' };parse(this, this._html);if (this.tag === 'select') this.value = (this.options.find(option => Object.hasOwn(option.attributes, 'selected')) ?? this.options[0])?.value ?? ''; }
  get innerHTML() { return this._html; }
  get options() { return this.querySelectorAll('option'); }
  addEventListener(type, listener) { const list = this.listeners.get(type) ?? [];list.push(listener);this.listeners.set(type, list); }
  emit(type, value) { if (value !== undefined) this.value = String(value);for (const listener of this.listeners.get(type) ?? []) listener({ target: this, preventDefault() {}, stopPropagation() {}, stopImmediatePropagation() {} }); }
  click() { if (!this.disabled) this.emit('click'); }
  setAttribute(name, value) { this.attributes[name] = String(value);if (name.startsWith('data-')) this.dataset[camel(name.slice(5))] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  querySelectorAll(selector) { const found = [];for (const child of this.children) { if (matches(child, selector)) found.push(child);found.push(...child.querySelectorAll(selector)); }return found; }
  scrollIntoView() {}
}
function matches(node, selector) {
  const id = selector.match(/#([\w-]+)/u);if (id && node.id !== id[1]) return false;
  const tag = selector.match(/^[a-z][\w-]*/u);if (tag && node.tag !== tag[0]) return false;
  for (const [, name, quoted, plain] of selector.matchAll(/\[([\w-]+)(?:="([^"]*)"|=([^\]]+))?\]/gu)) {
    if (!Object.hasOwn(node.attributes, name)) return false;
    const expected = quoted ?? plain;if (expected !== undefined && node.attributes[name] !== expected.replace(/^'|'$/gu, '')) return false;
  }
  return Boolean(id || tag || selector.startsWith('['));
}
function parse(parent, html) {
  const stack = [parent], voids = new Set(['input', 'br', 'hr', 'img', 'meta', 'link']);let previous = 0;
  for (const match of html.matchAll(/<\/?[a-z][^>]*>/gu)) {
    const text = decode(html.slice(previous, match.index));if (text.trim()) { stack.at(-1).textContent += text;stack.at(-1).firstChild.textContent += text; }
    previous = match.index + match[0].length;
    const close = match[0].startsWith('</'), tag = match[0].match(/^<\/?([\w-]+)/u)[1];
    if (close) { while (stack.length > 1) { const value = stack.pop();if (value.tag === tag) break; }continue; }
    const raw = match[0].slice(tag.length + 1, -1), attributes = {};
    for (const attribute of raw.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu)) attributes[attribute[1]] = decode(attribute[2] ?? attribute[3] ?? attribute[4] ?? '');
    const child = new Element(tag, attributes);stack.at(-1).children.push(child);if (!voids.has(tag) && !match[0].endsWith('/>')) stack.push(child);
  }
  const tail = decode(html.slice(previous));if (tail.trim()) stack.at(-1).textContent += tail;
}

function panelHarness(edits = fixture(), { scope = 'segment' } = {}) {
  const root = new Element(), globals = ['transition-global-scrub', 'transition-global-prev', 'transition-global-next', 'transition-global-play', 'transition-keyframe-button', 'transition-skip-button',
    'transition-global-markers', 'transition-global-label', 'transition-transport', 'transition-transport-help', 'viewer-overline', 'viewer-label', 'viewer-subtitle', 'part-count'];
  root.innerHTML = globals.map(id => id === 'transition-global-scrub' ? `<input id="${id}" type="range" min="0" max="8" step="0.001" value="0"/>` : `<div id="${id}"></div>`).join('') +
    `<select id="transition-preview-scope"><option value="segment">当前段循环</option><option value="loop">整圈循环</option></select><select id="transition-global-speed"><option value="0.25">0.25</option></select><div id="test-panel"></div><div id="test-shelf"></div><canvas id="test-canvas"></canvas>`;
  const dom = { activeElement: null, querySelector: selector => root.querySelector(selector), querySelectorAll: selector => root.querySelectorAll(selector), addEventListener() {} };
  globalThis.document = dom;Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Transport harness must not access user storage'); } });
  const $ = selector => { const element = dom.querySelector(selector);if (!element) throw new Error(`Missing test DOM element ${selector}`);return element; };
  $('#transition-preview-scope').value = scope;
  const frames = new Map();let frameId = 0;globalThis.requestAnimationFrame = callback => { const id = ++frameId;frames.set(id, callback);return id; };globalThis.cancelAnimationFrame = id => frames.delete(id);
  const state = { updates: [], applied: [], notifications: [], writes: [], failWrites: false };
  const library = { format: 'flare-transition-library', version: 1, entries: [clone(edits)], unknown: 'Keep library metadata' };
  const values = new Map([[TRANSITION_STORAGE_KEY, JSON.stringify(library)], ['personal-fixture', '\n untouched personal draft bytes \n']]);
  const before = clone([...values]), store = { getItem: key => values.get(key) ?? null,
    setItem(key, value) { if (state.failWrites) throw new Error('Temporary storage failure');values.set(key, String(value));state.writes.push(key); }, removeItem(key) { values.delete(key);state.writes.push(key); } };
  const sequence = freeze(clone(source));let sampling = createFlareSequence(sequence.steps, { period: sequence.period, ...transitionOptions(edits) });let pose = sampling.sample(.5), target = null, selected = 'pelvis', handles = [], enabled = true;
  const joints = Object.fromEntries(TRAJECTORY_JOINTS.map(({ joint }, index) => [joint, [index * .01, .4, 0]]));
  Object.assign(joints, { pelvis: [0, 1, 0], leftAnkle: [-.3, .1, 0], rightAnkle: [.3, .1, 0], leftWrist: [-.2, .4, 0], rightWrist: [.2, .4, 0] });
  const motion = { group: {},
    capturePose: () => clone(pose), applyPose(value) { pose = clone(value); },
    setSequence(steps, options) { sampling = createFlareSequence(steps, options); },
    update(time) { state.updates.push(time);pose = sampling.sample(time); },
    getEditableHandles: () => ['pelvis', 'leftAnkle', 'rightAnkle', 'leftWrist', 'rightWrist'].map(id => ({ id, label: id, position: [...joints[id]], quaternion: [0, 0, 0, 1], canRotate: false })),
    getFootCurveSpan: (time, options) => sampling.spanAt(time, options), getMetrics: () => ({ warnings: [], joints: clone(joints) }),
    sampleTrajectory(options) { const times = options.startTime === options.endTime ? [options.startTime] : [options.startTime, options.endTime];return { startTime: options.startTime, endTime: options.endTime, frames: times.map(time => ({ time, joints: clone(joints) })) }; },
  };
  const poseEditor = { getState() { const handle = handles.find(value => value.id === selected);return { enabled, selected, handles: clone(handles), position: handle?.position ?? null, quaternion: handle?.quaternion ?? [0, 0, 0, 1], canRotate: false, mode: 'translate', target: target?.kind ?? 'pose', label: handle?.label ?? '' }; },
    refresh() { handles = target ? target.getEditableHandles() : motion.getEditableHandles();if (!handles.some(value => value.id === selected)) selected = handles[0]?.id ?? null;return this.getState(); },
    setEnabled(value) { enabled = value; }, setTarget(value) { target = value;this.refresh(); }, select(id) { if (handles.some(value => value.id === id)) selected = id;this.refresh(); }, setTransformMode() {},
    setValue(value) { if (target) target.editHandle(selected, value);this.refresh(); },
  };
  poseEditor.refresh();
  const viewer = { motion, poseEditor, renderer: { domElement: $('#test-canvas') }, time: .5, playing: false,
    setTime(time) { this.time = time; }, resetView() {}, setTrajectoryData() {}, setTrajectoryVisible() {}, setTrajectoryProgress() {}, clearTrajectory() {}, pickTrajectoryPoint() { return null; } };
  const panel = createTransitionPanel({ viewer, panel: $('#test-panel'), shelf: $('#test-shelf'), sequence, storage: () => store, notify: message => state.notifications.push(message), refreshIcons() {},
    onApply(options) { state.applied.push(clone(options));motion.setSequence(sequence.steps, { period: sequence.period, ...options }); }, onExit() {} });
  panel.enter();
  return { panel, viewer, state, $, values, before,
    begin(fromKey, toKey, { skip = false } = {}) { $('#trajectory-from').value = fromKey;$('#trajectory-to').value = toKey;$('#trajectory-to').emit('change');$('#segment-guide-skip-k').checked = skip;$('#segment-guide-begin').click();ok(Boolean(panel.getState().segmentGuideEditing), 'Guide did not enter preview'); },
    seek(time) { $('#transition-global-scrub').emit('input', time); },
    markers: () => $('#transition-global-markers').querySelectorAll('button'),
    current() { return panel.getState(); }, guides() { return clone(panel.getState().segmentGuideEditing?.guides); },
    adjust(value = 4) { $('#segment-guide-pos-0').emit('change', value); },
    frame(tick) { const pending = [...frames];frames.clear();for (const [, callback] of pending) callback(tick); },
    assertUnchanged() { equal([...values], before);equal(panel.getDocument(), edits);equal(sequence, source);equal(state.writes, []); },
  };
}

if (!process.argv.includes('--module-only')) {
  check('Visible JSON backup includes original frames, K, draft and metadata without modifying animation storage', () => {
    const h = panelHarness();h.$('#transition-json-generate').click();
    const backup = JSON.parse(h.$('#transition-json-text').value);
    equal(backup, { ...fixture(), sequence: source });
    ok(/9 个原帧、3 个 K 帧/u.test(h.$('#transition-json-note').textContent));h.assertUnchanged();
  });

  check('JSON backup refuses unapplied guide previews and malformed imports preserve the edited preview', () => {
    const h = panelHarness();h.begin(stepKey(1), stepKey(2));h.adjust();const guides = h.guides();
    h.$('#transition-json-generate').click();equal(h.$('#transition-json-text').value, '');
    ok(h.state.notifications.at(-1).includes('应用或取消整段预览'));
    h.$('#transition-json-text').value = '{broken';h.$('#transition-json-import').click();
    equal(h.guides(), guides);ok(Boolean(h.current().segmentGuideEditing));h.assertUnchanged();
  });

  check('Pasted animation edits use existing validation and preserve unrelated personal data', () => {
    const h = panelHarness(), imported = fixture();imported.interpolation = 'smooth';
    h.$('#transition-json-text').value = JSON.stringify({ ...imported, sequence: source });h.$('#transition-json-import').click();
    equal(h.panel.getDocument(), imported);equal(h.state.applied.at(-1), transitionOptions(imported));
    equal(h.values.get('personal-fixture'), h.before.find(([key]) => key === 'personal-fixture')[1]);
    ok(h.state.notifications.at(-1).includes('可撤销'));
    const before = h.panel.getDocument();h.$('#transition-json-text').value = JSON.stringify({ ...imported, interpolation: 'invalid', sequence: source });
    h.$('#transition-json-import').click();equal(h.panel.getDocument(), before);
  });

  check('Actual panel limits slider to 10→11 and preserves edited route through out-of-range scrubbing and boundary steps', () => {
    const h = panelHarness();h.begin(stepKey(1), stepKey(2));h.adjust();const guides = h.guides();
    equal(h.$('#transition-global-scrub').min, '1');equal(h.$('#transition-global-scrub').max, '2');equal(h.$('#transition-global-scrub').step, 'any');
    h.seek(-100);equal(h.current().time, 1);equal(h.guides(), guides);ok(h.$('#transition-global-prev').disabled);
    h.panel.stepFrame(-1);equal(h.current().time, 1);equal(h.guides(), guides);
    h.seek(100);equal(h.current().time, 2);equal(h.guides(), guides);ok(h.$('#transition-global-next').disabled);
    h.panel.stepFrame(1);equal(h.current().time, 2);equal(h.guides(), guides);h.assertUnchanged();
  });

  check('Actual scoped markers include 10 and K, use relative positions, and remain the same DOM objects while scrubbing', () => {
    const h = panelHarness();h.begin(stepKey(0), stepKey(2));h.adjust();const guides = h.guides(), markers = h.markers();
    equal(markers.map(marker => Number(marker.dataset.transitionTime)).sort((a, b) => a - b), [0, .3, 1, 1.3, 2]);
    for (const marker of markers) near(Number.parseFloat(marker.style.left), Number(marker.dataset.transitionTime) / 2 * 100);
    h.seek(.9);equal(h.guides(), guides);equal(h.markers().length, markers.length);for (const marker of markers) ok(h.markers().includes(marker), 'Scrubbing rebuilt a marker DOM object');
    const original = markers.find(marker => Number(marker.dataset.transitionTime) === 1 && marker.classList.contains('transition-fixed-key'));original.click();equal(h.current().time, 1);equal(h.guides(), guides);
    const key = markers.find(marker => Number(marker.dataset.transitionTime) === .3 && marker.classList.contains('transition-edited-key'));key.click();equal(h.current().time, .3);equal(h.guides(), guides);h.assertUnchanged();
  });

  check('Actual 7→9 transport reaches the tail hold and tail K, distinguishes the two 09 markers, and pauses without snapping to 8', () => {
    const h = panelHarness();h.begin(stepKey(7), stepKey(0));h.adjust();const guides = h.guides(), markers = h.markers();
    equal(h.$('#transition-global-scrub').min, '7');equal(h.$('#transition-global-scrub').max, '9');
    equal(markers.map(marker => Number(marker.dataset.transitionTime)).sort((a, b) => a - b), [7, 8, 8.5, 9]);
    const last = markers.find(marker => Number(marker.dataset.transitionTime) === 8 && marker.classList.contains('transition-fixed-key')), first = markers.find(marker => Number(marker.dataset.transitionTime) === 9 && marker.classList.contains('transition-fixed-key'));
    last.click();equal(h.current().time, 8);first.click();equal(h.current().time, 9);equal(h.guides(), guides);
    const tail = markers.find(marker => Number(marker.dataset.transitionTime) === 8.5 && marker.classList.contains('transition-edited-key'));tail.click();equal(h.current().time, 8.5);
    equal(h.state.updates.at(-1), 8.5);equal(h.$('#transition-global-scrub').value, '8.5');equal(h.guides(), guides);
    h.$('#transition-global-speed').emit('change', 1);h.panel.togglePreview();h.frame(1000);
    for (let tick = 1080; tick <= 2440; tick += 80) h.frame(tick);
    const beforePause = h.current().time;ok(beforePause > 8 && beforePause < 9, 'Playback did not reach the 8–9 s tail hold');
    h.panel.togglePreview();equal(h.current().time, beforePause, 'Pausing discarded the unfolded time in the tail hold');
    equal(Number(h.$('#transition-global-scrub').value), h.current().time);equal(h.guides(), guides);h.assertUnchanged();
  });

  check('Actual wide wrap navigation unfolds legacy sidebar clocks while raw slider overshoots clamp and frame steps stay in scope', () => {
    const h = panelHarness();h.begin(stepKey(7), stepKey(2));h.adjust();const guides = h.guides();
    equal(h.$('#transition-global-scrub').max, '11');h.seek(9.5);equal(h.current().time, 9.5);equal(h.state.updates.at(-1), 9.5);
    const zero = h.$('#test-shelf').querySelectorAll('[data-transition-segment]').find(button => button.dataset.transitionSegment === '0');zero.click();equal(h.current().time, 9.5);equal(h.guides(), guides);
    h.seek(0);equal(h.current().time, 7);equal(h.guides(), guides);h.seek(100);equal(h.current().time, 11);equal(h.guides(), guides);
    h.seek(9);h.panel.stepFrame(1);near(h.current().time, 9 + 1 / 60);h.panel.stepFrame(-1);near(h.current().time, 9);
    equal(h.guides(), guides);h.assertUnchanged();
  });

  check('An exact fractional K endpoint stays selectable rather than being rounded by slider step or original-node snapping', () => {
    const edits = fixture();edits.points[0].at = .3000000001;const h = panelHarness(edits);h.begin(pointKey('early-K'), stepKey(1));
    const marker = h.markers().find(value => Number(value.dataset.transitionTime) === .3000000001 && value.classList.contains('transition-edited-key'));marker.click();
    equal(h.current().time, .3000000001);equal(h.$('#transition-global-scrub').value, '.3000000001'.replace(/^\./u, '0.'));
    equal(h.$('#transition-global-scrub').step, 'any');h.panel.stepFrame(-1);equal(h.current().time, .3000000001);h.assertUnchanged();
    const nearEdits = fixture();nearEdits.points[0].at = 1e-10;const nearH = panelHarness(nearEdits);nearH.begin(stepKey(0), stepKey(1));
    const nearMarker = nearH.markers().find(value => Number(value.dataset.transitionTime) === 1e-10);nearMarker.click();
    equal(nearH.current().time, 1e-10);ok(Boolean(nearH.current().segmentGuideEditing));nearH.assertUnchanged();
  });

  check('Guide preview forces and disables selected-range scope, and cancel restores global bounds and the earlier scope', () => {
    const h = panelHarness(fixture(), { scope: 'loop' });h.begin(stepKey(1), stepKey(2));h.adjust();
    equal(h.$('#transition-preview-scope').value, 'segment');ok(h.$('#transition-preview-scope').disabled);
    ok(/编辑范围|调整范围|智能调节区间/u.test(h.$('#transition-preview-scope').querySelector('option[value="segment"]').textContent));
    h.$('#segment-guide-cancel').click();equal(h.current().segmentGuideEditing, null);equal(h.$('#transition-global-scrub').min, '0');equal(h.$('#transition-global-scrub').max, '8');
    equal(h.$('#transition-preview-scope').value, 'loop');equal(h.$('#transition-preview-scope').disabled, false);h.assertUnchanged();
  });

  check('A failed apply keeps scoped navigation and the edited route, then success restores global transport with saved route data', () => {
    const h = panelHarness();h.begin(stepKey(7), stepKey(0));h.adjust();const guides = h.guides();h.state.failWrites = true;h.$('#segment-guide-apply').click();
    equal(h.guides(), guides);ok(Boolean(h.current().segmentGuideEditing));equal(h.$('#transition-global-scrub').min, '7');equal(h.$('#transition-global-scrub').max, '9');
    h.seek(8.5);equal(h.current().time, 8.5);equal(h.guides(), guides);h.assertUnchanged();
    h.state.failWrites = false;h.$('#segment-guide-apply').click();equal(h.current().segmentGuideEditing, null);
    equal(h.$('#transition-global-scrub').min, '0');equal(h.$('#transition-global-scrub').max, '8');equal(h.$('#transition-preview-scope').disabled, false);
    equal(h.panel.getDocument().segmentGuides, guides);equal(h.panel.getDocument().points, fixture().points);equal(h.panel.getDocument().draft, fixture().draft);
    equal(h.values.get('personal-fixture'), h.before.find(([key]) => key === 'personal-fixture')[1]);
  });
}

equal(await fs.readFile(sourceURL, 'utf8'), sourceBytes, 'Formal source bytes changed');
const report = { pass: failures.length === 0, passed: checks.filter(check => check.pass).length, total: checks.length, assertions, checks, failures,
  moduleOnly: process.argv.includes('--module-only'), sourceSha256: hash(sourceBytes), helperSha256: hash(helperBytes), panelSha256: hash(panelBytes),
  helperChangedDuringRun: await fs.readFile(helperURL, 'utf8') !== helperBytes, panelChangedDuringRun: await fs.readFile(panelURL, 'utf8') !== panelBytes,
  scope: 'Pure time/marker helpers plus the real transition panel using isolated in-memory DOM, RAF, motion and storage adapters. Verifies scoped slider/step/sidebar/marker navigation, unfolded wrap/hold/K times, data preservation, preview scope, cancel/apply restoration and visible JSON backup/import. No browser, user storage, IK physics or layout validation.' };
const output = new URL(`../output/playwright/guide-transport${report.moduleOnly ? '-module' : ''}-verification.json`, import.meta.url);
await fs.mkdir(new URL('.', output), { recursive: true });await fs.writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: report.passed, total: report.total, assertions, helperChangedDuringRun: report.helperChangedDuringRun, panelChangedDuringRun: report.panelChangedDuringRun, failures, report: output.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
