import assert from 'node:assert/strict';
import { createAdaptiveResolution, motionLadder, adaptiveEnabled, percentile } from '../src/adaptive-resolution.js';

// Ladders: moving cap per preset, never above the settled density, floor 1.
assert.deepEqual(motionLadder(3, 'medium'), [1.5, 1.25, 1]);
assert.deepEqual(motionLadder(3.25, 'high'), [2, 1.75, 1.5, 1.25, 1]);
assert.deepEqual(motionLadder(1, 'low'), [1]);
assert.deepEqual(motionLadder(1.25, 'medium'), [1.25, 1]);
assert.deepEqual(motionLadder(0.75, 'medium'), [0.75]);
assert.equal(adaptiveEnabled(''), true);
assert.equal(adaptiveEnabled('?adaptive=0'), false);
assert.equal(adaptiveEnabled('?perf=1&adaptive=1'), true);
assert.equal(percentile([10, 20, 30, 40], 0.5), 20);
assert.equal(percentile([], 0.95), 0);

// Moving frames drop to the cap; still for settleMs restores full density once.
const a = createAdaptiveResolution();
assert.equal(a.configure(3, 'medium'), 3);
let t = 0, changes = 0;
const frame = (moving, dt = 16) => { t += dt; const r = a.update(t, moving, dt); if (r.changed) changes++; return r; };
assert.deepEqual(frame(true), { ratio: 1.5, changed: true, settled: false });
for (let i = 0; i < 100; i++) assert.equal(frame(true).ratio, 1.5);
assert.equal(changes, 1, 'no reallocation while moving at steady frame rate');
assert.equal(frame(false, 100).ratio, 1.5, 'holds the moving density inside the settle window');
const settle = frame(false, 200);
assert.deepEqual(settle, { ratio: 3, changed: true, settled: true });
for (let i = 0; i < 20; i++) assert.equal(frame(false).changed, false);

// Sustained jank steps down one rung at most once per hold period; fast frames recover.
frame(true);
for (let i = 0; i < 31; i++) frame(true, 40);
assert.equal(a.rung, 1); assert.equal(a.ratio, 1.25);
for (let i = 0; i < 20; i++) frame(true, 40);
assert.equal(a.rung, 1, 'hysteresis: no second step inside holdMs');
for (let i = 0; i < 40; i++) frame(true, 40);
assert.equal(a.rung, 2); assert.equal(a.ratio, 1);
for (let i = 0; i < 200; i++) frame(true, 40);
assert.equal(a.rung, 2, 'floor holds');
for (let i = 0; i < 200; i++) frame(true, 16);
assert.equal(a.rung, 0, 'recovers when frames are fast'); assert.equal(a.ratio, 1.5);
// Middling frames (between recover and degrade thresholds) stay put.
const before = a.rung; for (let i = 0; i < 200; i++) frame(true, 21); assert.equal(a.rung, before);

// Quality change keeps a valid rung; disabled controller is the old fixed density.
a.configure(1, 'low'); assert.equal(a.rung, 0);
const off = createAdaptiveResolution({ enabled: false });
off.configure(3, 'medium');
for (let i = 0; i < 50; i++) assert.deepEqual(off.update(i * 16, true, 16), { ratio: 3, changed: false, settled: false });

// Foreground stalls at/above the sampling cap still cause degradation.
for (const interval of [250, 600]) {
  const slow = createAdaptiveResolution(); slow.configure(3, 'medium');
  for (let i = 0; i <= 61; i++) slow.update(i * interval, true, interval);
  assert.equal(slow.ratio, 1, `${interval}ms stalls must reach the floor`);
  assert.equal(slow.update(62 * interval, false, interval).ratio, 3, 'pause still restores full density');
}

console.log('Adaptive resolution passed: moving caps, settle restore, hysteresis, recovery, severe stalls, ?adaptive=0.');
