import assert from 'node:assert/strict';
import test from 'node:test';
import { createHubCalloutVisibility } from '../src/hub-callout-visibility.js';

const frame = (phase = 11, extra = {}) => ({
  phase, time: phase - 9, moving: false, scrubbing: false, showMuscles: false, ...extra,
});

test('outgoing labels fade for 120 ms and incoming labels wait for pose and yaw', () => {
  const labels = createHubCalloutVisibility();
  assert.equal(labels.update(frame(), 0, false).opacity, 1);
  const moving = frame(12, { moving: true });
  assert.equal(labels.update(moving, 1).phase, 11);
  assert.equal(labels.update(moving, 61).opacity, .5);
  assert.equal(labels.update(moving, 121), null);
  assert.equal(labels.update(moving, 699), null);
  assert.deepEqual(labels.update(frame(12), 701), { phase: 12, time: 3, opacity: 0, redrawing: true });
  assert.equal(labels.update(frame(12), 801).opacity, .5);
  assert.deepEqual(labels.update(frame(12), 901), { phase: 12, time: 3, opacity: 1, redrawing: false });
});

test('scrubbing and muscle mode clear immediately, only the last selected phase returns', () => {
  const labels = createHubCalloutVisibility();
  assert.equal(labels.update(frame(), 0, false).opacity, 1);
  assert.equal(labels.update(frame(12, { scrubbing: true }), 20), null);
  assert.equal(labels.update(frame(13, { moving: true }), 41), null);
  assert.equal(labels.update(frame(15, { moving: true }), 61), null);
  assert.equal(labels.update(frame(15), 761).phase, 15);
  assert.equal(labels.update(frame(15, { showMuscles: true }), 800), null);
  assert.equal(labels.update(frame(15), 1100, false).opacity, 1);
});

test('retargeting during fade-in starts from the visible opacity', () => {
  const labels = createHubCalloutVisibility();
  labels.update(frame(), 0);
  const moving = frame(10, { moving: true });
  assert.equal(labels.update(moving, 100).opacity, .5);
  assert.equal(labels.update(moving, 160).opacity, .25);
  assert.equal(labels.update(moving, 220), null);
  assert.equal(labels.update(frame(10), 801).phase, 10);
});
