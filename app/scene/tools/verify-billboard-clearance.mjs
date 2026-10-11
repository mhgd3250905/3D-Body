import assert from 'node:assert/strict';
import { createBillboardClearance } from '../src/billboard-clearance.js';

const rect = (left, top, width = 40, height = 24) => ({ left, top, width, height });
// Deliberately shuffled input: ankle/hand/forearm hulls must not depend on order.
const box = (left, top, width, height) => [
  { x: left + width, y: top + height }, { x: left, y: top },
  { x: left, y: top + height }, { x: left + width, y: top },
];
const clearance = createBillboardClearance([
  box(50, 70, 40, 150), box(200, 70, 40, 150), // separate legs
  box(105, 280, 80, 20), // supporting hand
], { width: 390, height: 700, obstacles: [rect(10, 600, 180, 80)] });

assert.equal(clearance.score(rect(130, 110)), 0, 'A card fits between separate legs');
assert(clearance.score(rect(65, 110)) > 0, 'A card cannot cover a leg');
assert(clearance.score(rect(120, 282)) > 0, 'A card cannot cover a hand');
assert.equal(clearance.score(rect(120, 308)), 0, 'Exactly 8px below the hand satisfies the gap');
assert(clearance.score(rect(120, 307.5)) > 0, 'The gap is enforced near the hand');
assert.equal(clearance.score(rect(8, 8)), 0, 'Exactly 8px from viewport edges is clear');
assert(clearance.score(rect(7, 8)) >= 1_000_000, 'Viewport collision has a hard penalty');
assert(clearance.score(rect(20, 620)) >= 1_000_000, 'UI collision has a hard penalty');
assert(clearance.score(rect(120, 340), [rect(125, 360)]) >= 1_000_000, 'Other cards get a hard penalty');
assert.equal(clearance.isClear(rect(120, 340), [rect(120, 372)]), true, '8px card gap is clear');
assert.equal(clearance.score(rect(40, 330)), 0, 'Unrelated free space remains clear');

const diagonal = createBillboardClearance([[{ x: 100, y: 100 }, { x: 180, y: 100 }, { x: 100, y: 180 }]],
  { width: 390, height: 700, gap: 0 });
assert.equal(diagonal.score(rect(160, 160, 15, 15)), 0, 'SAT frees space outside a diagonal polygon but inside its bounding box');
assert(diagonal.score(rect(112, 112, 15, 15)) > 0, 'SAT detects a diagonal body-part overlap');

const degenerate = createBillboardClearance([
  [{ x: 100, y: 100 }], [{ x: 160, y: 100 }, { x: 160, y: 180 }],
], { width: 390, height: 700 });
assert(degenerate.score(rect(90, 90)) > 0, 'Point hull inside a card remains an obstacle');
assert(degenerate.score(rect(150, 130)) > 0, 'Line hull inside a card remains an obstacle');
assert.equal(degenerate.score(rect(200, 200)), 0, 'Degenerate hulls do not block unrelated space');
assert.equal(clearance.score({ left: NaN, top: 10, width: 40, height: 24 }), Infinity);
assert(clearance.score(rect(65, 110)) < clearance.score(rect(20, 620)), 'Every body collision is cheaper than UI collisions');

console.log('[OK] Billboard clearance: local limbs, hand/foot spacing, SAT, viewport, UI and card gaps');
