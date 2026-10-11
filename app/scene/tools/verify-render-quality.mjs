import assert from 'node:assert/strict';
import { renderQuality } from '../src/render-quality.js';

// The connected 1280px / 520dpi phone exposes about 3.25 physical pixels per
// logical pixel. Defaults must not upscale a 1.5x buffer to that density.
assert.deepEqual(renderQuality('balanced', 3.25), { name: 'medium', shadows: true, pixelRatio: 3 });
assert.equal(renderQuality('medium', 3.25).pixelRatio, 3);
assert.equal(renderQuality('high', 3.25).pixelRatio, 3.25);
assert.deepEqual(renderQuality('battery', 3.25), { name: 'low', shadows: false, pixelRatio: 1 });
assert.equal(renderQuality('low', 3.25).pixelRatio, 1);
for (const density of [1, 1.5, 2, 3]) {
  assert.equal(renderQuality('balanced', density).pixelRatio, density);
}
assert.equal(renderQuality('high', 8).pixelRatio, 4);
for (const density of [undefined, NaN, Infinity, 0, -1]) {
  assert.equal(renderQuality('unknown', density).pixelRatio, 1);
}
assert.equal(renderQuality('constructor', 3.25).name, 'medium');
console.log('Render quality passed: near-native defaults, host aliases, battery mode, density caps and invalid input.');
