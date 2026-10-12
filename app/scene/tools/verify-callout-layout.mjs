import assert from 'node:assert/strict';
import { layoutCallouts } from '../src/callout-layout.js';

// Independent geometric assertions use segment intersections and containment,
// not the separating-axis implementation in the production layout module.
const orient = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const corners = (r, gap = 0) => [
  { x: r.left - gap, y: r.top - gap },
  { x: r.left + r.width + gap, y: r.top - gap },
  { x: r.left + r.width + gap, y: r.top + r.height + gap },
  { x: r.left - gap, y: r.top + r.height + gap },
];
const onSegment = (p, a, b) => Math.abs(orient(a, b, p)) < 1e-5 &&
  p.x >= Math.min(a.x, b.x) - 1e-5 && p.x <= Math.max(a.x, b.x) + 1e-5 &&
  p.y >= Math.min(a.y, b.y) - 1e-5 && p.y <= Math.max(a.y, b.y) + 1e-5;
function intersects(a, b, c, d) {
  return (orient(a, b, c) * orient(a, b, d) < 0 && orient(c, d, a) * orient(c, d, b) < 0) ||
    onSegment(a, c, d) || onSegment(b, c, d) || onSegment(c, a, b) || onSegment(d, a, b);
}
function inside(p, polygon) {
  let positive = false, negative = false;
  for (let i = 0; i < polygon.length; i++) {
    const signed = orient(polygon[i], polygon[(i + 1) % polygon.length], p);
    positive ||= signed > 1e-5; negative ||= signed < -1e-5;
  }
  return !(positive && negative);
}
function polygonsOverlap(a, b) {
  if (a.some((p) => inside(p, b)) || b.some((p) => inside(p, a))) return true;
  return a.some((p, i) => b.some((q, j) => intersects(p, a[(i + 1) % a.length], q, b[(j + 1) % b.length])));
}
function lineOverlapsBox(a, b, box) {
  const polygon = corners(box);
  return inside(a, polygon) || inside(b, polygon) || polygon.some((p, i) => intersects(a, b, p, polygon[(i + 1) % polygon.length]));
}
const anchor = (groupId, x, y, width = 123, height = 44) => ({ groupId, x, y, width, height, color: '#44aacc', score: 'original-data' });
const points = (pairs) => pairs.map(([x, y]) => ({ x, y }));

function safe(result, scene) {
  for (const card of result) {
    const source = scene.anchors.find((a) => a.groupId === card.groupId);
    assert.equal(card.x, source.x); assert.equal(card.y, source.y);
    assert.equal(card.width, source.width); assert.equal(card.height, source.height);
    assert.equal(card.color, source.color); assert.equal(card.score, 'original-data');
    assert.ok(card.left >= 10 && card.top >= 10, `${card.groupId}: top/left safe margin`);
    assert.ok(card.left + card.width <= scene.width - 10 + 1e-5, `${card.groupId}: right safe margin`);
    assert.ok(card.top + card.height <= scene.height - 10 + 1e-5, `${card.groupId}: bottom safe margin`);
    assert.ok(!polygonsOverlap(corners(card, 10), scene.hull), `${card.groupId}: person/10px buffer overlap`);
    for (const obstacle of scene.obstacles ?? []) {
      assert.ok(!polygonsOverlap(corners(card), corners(obstacle)), `${card.groupId}: UI overlap`);
      assert.ok(!lineOverlapsBox(card, { x: card.edgeX, y: card.edgeY }, obstacle), `${card.groupId}: leader/UI overlap`);
    }
    const onEdge = Math.abs(card.edgeX - card.left) < 1e-5 || Math.abs(card.edgeX - card.left - card.width) < 1e-5 ||
      Math.abs(card.edgeY - card.top) < 1e-5 || Math.abs(card.edgeY - card.top - card.height) < 1e-5;
    assert.ok(onEdge && inside({ x: card.edgeX, y: card.edgeY }, corners(card)), `${card.groupId}: leader ends on border`);
    for (const other of result) {
      if (other === card) continue;
      assert.ok(!polygonsOverlap(corners(card, 4), corners(other, 4)), 'labels maintain an 8px gap');
      assert.ok(!lineOverlapsBox(card, { x: card.edgeX, y: card.edgeY }, other), 'leader never crosses another label');
    }
  }
}

const scenes = [
  {
    name: '390 portrait / three body anchors', width: 390, height: 650,
    hull: points([[42, 320], [155, 145], [202, 190], [326, 292], [340, 370], [236, 410], [68, 415]]),
    anchors: [anchor('shoulder', 282, 310), anchor('core', 203, 266), anchor('hip', 139, 301)],
    obstacles: [{ left: 10, top: 465, width: 125, height: 150 }, { left: 172, top: 572, width: 208, height: 78 }],
  },
  {
    name: '320 portrait / raised leg', width: 320, height: 550,
    hull: points([[20, 278], [108, 115], [150, 85], [189, 189], [296, 274], [278, 355], [91, 368]]),
    anchors: [anchor('shoulder', 255, 287), anchor('core', 164, 237), anchor('hip', 120, 260)],
    obstacles: [{ left: 10, top: 414, width: 106, height: 126 }, { left: 177, top: 496, width: 133, height: 44 }],
  },
  {
    name: '390 portrait / two hands on floor', width: 390, height: 640,
    hull: points([[34, 251], [169, 135], [320, 201], [359, 299], [317, 400], [107, 410]]),
    anchors: [anchor('left-arm', 172, 313), anchor('right-arm', 290, 324), anchor('hip', 208, 216)],
    obstacles: [{ left: 10, top: 472, width: 125, height: 148 }, { left: 172, top: 562, width: 208, height: 78 }],
  },
  {
    name: 'landscape / surrounding space', width: 740, height: 330,
    hull: points([[178, 225], [250, 36], [451, 53], [585, 199], [391, 281]]),
    anchors: [anchor('shoulder', 456, 174), anchor('core', 353, 136), anchor('hip', 280, 164)],
    obstacles: [{ left: 520, top: 250, width: 208, height: 78 }],
  },
];

const results = [];
for (const scene of scenes) {
  const source = structuredClone(scene);
  const start = performance.now();
  const result = layoutCallouts(scene);
  const elapsed = performance.now() - start;
  assert.equal(result.length, 3, `${scene.name}: all three must fit`);
  assert.deepEqual(scene, source, 'layout never mutates inputs');
  assert.deepEqual(layoutCallouts(scene), result, 'deterministic for same inputs');
  safe(result, scene);
  results.push({ scene: scene.name, count: result.length, ms: +elapsed.toFixed(2) });

  // Sub-pixel camera drift should update anchors/leader ends without swapping
  // the card to another side. Repeat enough frames to catch accumulating drift.
  let previous = result;
  for (let frame = 1; frame <= 20; frame++) {
    const delta = frame * .12;
    const next = {
      ...scene,
      anchors: scene.anchors.map((a) => ({ ...a, x: a.x + delta, y: a.y + delta * .4 })),
      hull: scene.hull.map((p) => ({ x: p.x + delta, y: p.y + delta * .4 })), previous,
    };
    const current = layoutCallouts(next);
    assert.equal(current.length, 3, `${scene.name}: keep three after camera nudge`);
    safe(current, next);
    for (const card of current) {
      const old = previous.find((p) => p.groupId === card.groupId);
      assert.ok(Math.hypot(card.left - old.left, card.top - old.top) < 14, `${scene.name}: no camera-nudge jump`);
    }
    previous = current;
  }
}

const filled = { width: 320, height: 480, hull: points([[-10, -10], [330, -10], [330, 490], [-10, 490]]), anchors: scenes[1].anchors };
assert.equal(layoutCallouts(filled).length, 0, 'zoomed model fills viewport: omit labels instead of covering it');
const blocked = { ...scenes[0], obstacles: [{ left: 0, top: 0, width: 390, height: 650 }] };
assert.equal(layoutCallouts(blocked).length, 0, 'no label above a full-stage UI obstacle');
const tooSmall = { ...scenes[0], width: 110 };
assert.equal(layoutCallouts(tooSmall).length, 0, 'a card wider than the safe viewport is omitted');
const stale = { ...scenes[0], previous: scenes[0].anchors.map((a) => ({ ...a, left: a.x - 30, top: a.y - 10 })) };
const recovered = layoutCallouts(stale);
assert.equal(recovered.length, 3); safe(recovered, stale);
assert.deepEqual(layoutCallouts(), []);
assert.deepEqual(layoutCallouts({ width: NaN, height: 600 }), []);
const unordered = { ...scenes[0], hull: [...scenes[0].hull].reverse().concat([{ x: 190, y: 290 }, scenes[0].hull[0]]) };
assert.deepEqual(layoutCallouts(unordered), layoutCallouts(scenes[0]), 'unordered, duplicated/interior projected points give the same hull');
const strip = {
  width: 320, height: 480, hull: points([[130, 190], [170, 190], [170, 230], [130, 230]]),
  anchors: [anchor('shoulder', 150, 210)], obstacles: [{ left: 0, top: 280, width: 320, height: 60 }],
  previous: [{ ...anchor('shoulder', 150, 210), left: 100, top: 350 }],
};
const aboveStrip = layoutCallouts(strip);
assert.equal(aboveStrip.length, 1); safe(aboveStrip, strip);
assert.ok(aboveStrip[0].top + aboveStrip[0].height < 280, 'a previously safe card cannot send a leader through bottom UI');
assert.equal(layoutCallouts({ ...strip, anchors: [anchor('hidden-shoulder', 150, 300)] }).length, 0, 'UI-covered anchor cannot produce a floating card');

function bubbleSafe(result, scene) {
  const body = scene.bodyHulls ?? [scene.hull];
  for (const card of result) {
    assert.ok(['left', 'right', 'top', 'bottom'].includes(card.tailSide), 'bubble has a valid facing edge');
    assert.equal(card.x, scene.anchors.find((a) => a.groupId === card.groupId).x);
    assert.equal(card.y, scene.anchors.find((a) => a.groupId === card.groupId).y);
    assert.equal(card.height, 44, 'bubble keeps the 44px card');
    assert.equal(card.score, 'original-data', 'original metadata is preserved');
    const base = { x: card.left + card.tailX, y: card.top + card.tailY };
    const normal = { left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1] }[card.tailSide];
    const tip = { x: base.x + normal[0] * 7, y: base.y + normal[1] * 7 };
    assert.ok(Math.hypot(tip.x - card.x, tip.y - card.y) <= 80 + 1e-5, 'bubble stays within 80px of its muscle');
    assert.ok(Math.abs(orient(base, tip, card)) < 1e-4 &&
      (card.x - base.x) * normal[0] + (card.y - base.y) * normal[1] > 7, 'tail aims exactly at its own anchor');
    assert.ok(card.left >= 10 && card.top >= 10 && card.left + card.width <= scene.width - 10 && card.top + card.height <= scene.height - 10);
    const horizontal = normal[0] !== 0;
    const triangle = horizontal
      ? [{ x: base.x, y: base.y - 5 }, tip, { x: base.x, y: base.y + 5 }]
      : [{ x: base.x - 5, y: base.y }, tip, { x: base.x + 5, y: base.y }];
    for (const p of triangle) assert.ok(p.x >= 10 && p.x <= scene.width - 10 && p.y >= 10 && p.y <= scene.height - 10, 'tail stays on screen');
    for (const polygon of body) {
      assert.ok(!polygonsOverlap(corners(card, 10), polygon), 'bubble respects each body part plus 10px');
      assert.ok(!polygonsOverlap(triangle, polygon), 'small tail does not cover the body');
    }
    for (const box of scene.obstacles ?? []) {
      assert.ok(!polygonsOverlap(corners(card), corners(box)) && !polygonsOverlap(triangle, corners(box)), 'bubble and small tail avoid UI');
    }
    for (const other of result) if (other !== card) {
      assert.ok(!polygonsOverlap(corners(card, 4), corners(other, 4)), 'bubble cards remain separated');
      assert.ok(!polygonsOverlap(triangle, corners(other)), 'small tail does not cover another card');
    }
  }
}

const torso = points([[100, 140], [140, 140], [140, 350], [100, 350]]);
const bubbleScene = {
  mode: 'bubble', width: 420, height: 440, hull: torso,
  anchors: [anchor('shoulder', 138, 180), anchor('core', 138, 248), anchor('hip', 138, 316)],
};
const bubbles = layoutCallouts(bubbleScene);
assert.equal(bubbles.length, 3); bubbleSafe(bubbles, bubbleScene);
assert.ok(bubbles.every((card) => card.tailSide === 'left'), 'prefer left-hand speech tails when there is room');
let bubblePrevious = bubbles;
for (let i = 1; i <= 16; i++) {
  const dx = i * .16, dy = Math.sin(i * .1) * .4;
  const next = {
    ...bubbleScene, previous: bubblePrevious,
    hull: torso.map((p) => ({ x: p.x + dx, y: p.y + dy })),
    anchors: bubbleScene.anchors.map((a) => ({ ...a, x: a.x + dx, y: a.y + dy })),
  };
  const current = layoutCallouts(next);
  assert.equal(current.length, 3); bubbleSafe(current, next);
  current.forEach((card, index) => {
    assert.equal(card.tailSide, bubblePrevious[index].tailSide, 'camera nudges preserve tail side');
    assert.ok(Math.hypot(card.left - bubblePrevious[index].left, card.top - bubblePrevious[index].top) < 2, 'camera nudges never jump bubbles');
  });
  bubblePrevious = current;
}
let rotatedPrevious = bubbles;
for (let frame = 1; frame <= 12; frame++) {
  const angle = frame * .0018;
  const rotate = (p) => ({ ...p, x: 120 + (p.x - 120) * Math.cos(angle) - (p.y - 245) * Math.sin(angle),
    y: 245 + (p.x - 120) * Math.sin(angle) + (p.y - 245) * Math.cos(angle) });
  const next = { ...bubbleScene, hull: torso.map(rotate), anchors: bubbleScene.anchors.map(rotate), previous: rotatedPrevious };
  const current = layoutCallouts(next);
  assert.equal(current.length, 3); bubbleSafe(current, next);
  current.forEach((card, index) => {
    assert.equal(card.tailSide, rotatedPrevious[index].tailSide, 'small orbit rotation preserves the bubble side');
    assert.ok(Math.hypot(card.left - rotatedPrevious[index].left, card.top - rotatedPrevious[index].top) < 12, 'rotation avoids the model without a large label jump');
  });
  rotatedPrevious = current;
}
const gapScene = {
  mode: 'bubble', width: 420, height: 430, anchors: [anchor('inner-arm', 133, 215, 100)],
  hull: points([[60, 100], [350, 100], [350, 320], [60, 320]]),
  bodyHulls: [points([[60, 100], [135, 100], [135, 320], [60, 320]]), points([[295, 100], [350, 100], [350, 320], [295, 320]])],
};
const inGap = layoutCallouts(gapScene);
assert.equal(inGap.length, 1); bubbleSafe(inGap, gapScene);
assert.ok(polygonsOverlap(corners(inGap[0]), gapScene.hull), 'use real empty space between limbs inside the whole-body hull');
assert.equal(layoutCallouts({ ...gapScene, bodyHulls: undefined }).length, 0, 'without local silhouettes, do not invent body gaps or move a card far away');
const blockedRight = {
  mode: 'bubble', width: 420, height: 360, anchors: [anchor('side-change', 138, 180, 100)],
  hull: points([[100, 130], [140, 130], [140, 230], [100, 230]]),
  obstacles: [{ left: 160, top: 125, width: 250, height: 100 }],
};
const changedSide = layoutCallouts(blockedRight);
assert.equal(changedSide.length, 1); bubbleSafe(changedSide, blockedRight);
assert.notEqual(changedSide[0].tailSide, 'left', 'move the tail to a truthful free side when the right side is occupied');
const noNearSpace = {
  mode: 'bubble', width: 400, height: 440, anchors: [anchor('core', 200, 220, 100)],
  hull: points([[50, 50], [350, 50], [350, 360], [50, 360]]),
};
assert.equal(layoutCallouts(noNearSpace).length, 0, 'no nearby safe space: omit rather than float far from the muscle');
const invisibleLine = {
  mode: 'bubble', width: 420, height: 400, anchors: [anchor('short-tail', 100, 200, 100)],
  hull: points([[85, 185], [110, 185], [110, 215], [85, 215]]),
  obstacles: [{ left: 0, top: 0, width: 420, height: 150 }, { left: 0, top: 250, width: 420, height: 150 }, { left: 120, top: 195, width: 6, height: 10 }],
};
const onlyTail = layoutCallouts(invisibleLine);
assert.equal(onlyTail.length, 1); bubbleSafe(onlyTail, invisibleLine);
assert.ok(lineOverlapsBox(onlyTail[0], { x: onlyTail[0].edgeX, y: onlyTail[0].edgeY }, invisibleLine.obstacles[2]), 'an invisible long connector must not restrict a short-tail bubble');
const unsafeBubblePrior = { ...bubbleScene, previous: bubbles.map((card) => ({ ...card, left: 103, top: card.y - 20 })) };
const repositionedBubbles = layoutCallouts(unsafeBubblePrior);
assert.equal(repositionedBubbles.length, 3); bubbleSafe(repositionedBubbles, unsafeBubblePrior);

function markerSafe(result, scene) {
  for (const card of result) {
    const original = scene.anchors.find((point) => point.groupId === card.groupId);
    assert.equal(card.x, original.x); assert.equal(card.y, original.y);
    assert.equal(card.score, 'original-data'); assert.equal(card.height, 44);
    assert.equal(card.tailSide, undefined, 'marker cards have no speech tail');
    assert.ok(card.left >= 10 && card.top >= 10 && card.left + card.width <= scene.width - 10 + 1e-5 && card.top + card.height <= scene.height - 10 + 1e-5);
    for (const obstacle of scene.obstacles ?? []) assert.ok(!polygonsOverlap(corners(card), corners(obstacle)), 'marker card avoids UI');
    for (const point of scene.anchors) {
      const dx = Math.max(card.left - point.x, 0, point.x - card.left - card.width);
      const dy = Math.max(card.top - point.y, 0, point.y - card.top - card.height);
      assert.ok(Math.hypot(dx, dy) > (point.radius ?? 12), 'marker card avoids every coloured circle');
    }
    for (const other of result) if (other !== card) assert.ok(!polygonsOverlap(corners(card, 4), corners(other, 4)), '44px card targets have an 8px gap');
  }
}
const markerScenarios = [
  {
    mode: 'markers', name: '390 portrait / five primary muscles', width: 390, height: 630,
    anchors: [[225, 275], [170, 330], [240, 350], [135, 350], [195, 285]].map(([x, y], i) => anchor(`primary-${i}`, x, y, 82)),
    hull: points([[45, 180], [240, 145], [338, 322], [265, 437], [85, 410]]),
    obstacles: [{ left: 0, top: 0, width: 390, height: 70 }, { left: 10, top: 468, width: 124, height: 150 }, { left: 172, top: 552, width: 208, height: 78 }],
  },
  {
    mode: 'markers', name: '320 portrait / four primary muscles', width: 320, height: 500,
    anchors: [[180, 195], [145, 228], [190, 248], [110, 250]].map(([x, y], i) => anchor(`primary-${i}`, x, y, 80)),
    hull: points([[50, 135], [275, 135], [275, 370], [50, 370]]),
    obstacles: [{ left: 0, top: 0, width: 320, height: 60 }, { left: 10, top: 370, width: 100, height: 120 }, { left: 180, top: 435, width: 130, height: 55 }],
  },
  {
    mode: 'markers', name: '390 portrait / six muscles and soft body coverage', width: 390, height: 600,
    anchors: [[180, 220], [206, 240], [230, 265], [155, 263], [175, 290], [221, 310]].map(([x, y], i) => anchor(`primary-${i}`, x, y, 80)),
    hull: points([[0, 0], [390, 0], [390, 600], [0, 600]]),
    obstacles: [{ left: 0, top: 0, width: 390, height: 70 }, { left: 10, top: 450, width: 125, height: 140 }, { left: 172, top: 522, width: 208, height: 78 }],
  },
  {
    mode: 'markers', name: 'landscape / six primary muscles', width: 740, height: 330,
    anchors: [[280, 190], [340, 170], [400, 190], [450, 155], [520, 195], [365, 220]].map(([x, y], i) => anchor(`primary-${i}`, x, y, 88)),
    hull: points([[178, 225], [250, 36], [451, 53], [585, 199], [391, 281]]),
    obstacles: [{ left: 10, top: 220, width: 125, height: 100 }, { left: 532, top: 252, width: 208, height: 78 }],
  },
  {
    mode: 'markers', name: '320 portrait / edge anchors and bottom UI', width: 320, height: 460,
    anchors: [[26, 110], [300, 115], [160, 260], [160, 345]].map(([x, y], i) => anchor(`primary-${i}`, x, y, 80)),
    hull: points([[20, 90], [305, 90], [270, 360], [100, 370]]),
    obstacles: [{ left: 0, top: 0, width: 320, height: 60 }, { left: 0, top: 380, width: 120, height: 80 }, { left: 190, top: 400, width: 130, height: 60 }],
  },
];
const markerResults = [];
for (const scene of markerScenarios) {
  const snapshot = structuredClone(scene), start = performance.now();
  const placed = layoutCallouts(scene), elapsed = performance.now() - start;
  assert.equal(placed.length, scene.anchors.length, `${scene.name}: retain all primary names`);
  assert.deepEqual(scene, snapshot, 'markers layout leaves source points untouched');
  markerSafe(placed, scene);
  markerResults.push({ name: scene.name, count: placed.length, ms: +elapsed.toFixed(2) });
}
let markerPrevious = layoutCallouts(markerScenarios[0]);
for (let frame = 1; frame <= 16; frame++) {
  const angle = frame * .0014;
  const rotate = (p) => ({ ...p, x: 195 + (p.x - 195) * Math.cos(angle) - (p.y - 300) * Math.sin(angle),
    y: 300 + (p.x - 195) * Math.sin(angle) + (p.y - 300) * Math.cos(angle) });
  const next = { ...markerScenarios[0], hull: markerScenarios[0].hull.map(rotate), anchors: markerScenarios[0].anchors.map(rotate), previous: markerPrevious };
  const current = layoutCallouts(next);
  assert.equal(current.length, 5); markerSafe(current, next);
  for (const card of current) {
    const old = markerPrevious.find((point) => point.groupId === card.groupId);
    assert.ok(Math.hypot(card.left - old.left, card.top - old.top) < 14, 'small orbit movement keeps primary labels stable');
  }
  markerPrevious = current;
}
const distantFallback = {
  mode: 'markers', width: 390, height: 500, anchors: [anchor('still-labelled', 200, 200, 80)],
  hull: points([[0, 0], [390, 0], [390, 500], [0, 500]]),
  obstacles: [{ left: 0, top: 0, width: 390, height: 100 }, { left: 0, top: 100, width: 185, height: 250 }, { left: 215, top: 100, width: 175, height: 250 }],
};
const farMarker = layoutCallouts(distantFallback);
assert.equal(farMarker.length, 1); markerSafe(farMarker, distantFallback);
assert.ok(Math.hypot(farMarker[0].edgeX - 200, farMarker[0].edgeY - 200) > 80, 'markers have no old 80px suppression limit');
const localMarkerBodies = { ...markerScenarios[0], bodyHulls: [
  points([[135, 240], [230, 240], [230, 340], [135, 340]]),
  points([[190, 305], [295, 330], [275, 370], [170, 345]]),
] };
const localMarkers = layoutCallouts(localMarkerBodies);
assert.equal(localMarkers.length, 5); markerSafe(localMarkers, localMarkerBodies);
assert.equal(layoutCallouts({ ...markerScenarios[0], obstacles: [{ left: 0, top: 0, width: 390, height: 630 }] }).length, 0, 'only impossible UI coverage suppresses all marker names');

const timingScene = scenes[0];
let timedPrevious = layoutCallouts(timingScene);
const timings = [];
for (let i = 0; i < 100; i++) {
  const dx = Math.sin(i * .08) * 2, dy = Math.cos(i * .08) * 2;
  const moving = {
    ...timingScene, previous: timedPrevious,
    hull: timingScene.hull.map((p) => ({ x: p.x + dx, y: p.y + dy })),
    anchors: timingScene.anchors.map((a) => ({ ...a, x: a.x + dx, y: a.y + dy })),
  };
  const start = performance.now();
  timedPrevious = layoutCallouts(moving);
  timings.push(performance.now() - start);
  assert.equal(timedPrevious.length, 3); safe(timedPrevious, moving);
}
timings.sort((a, b) => a - b);
console.log(JSON.stringify({
  ok: true, scenes: results, stableFrames: scenes.length * 20,
  bubbles: { closeCards: bubbles.length, stableFrames: 16, rotationFrames: 12, limbGap: true, truthfulTails: true, remoteCardsOmitted: true, invisibleLeadersIgnored: true },
  markers: { scenarios: markerResults, rotationFrames: 16, allPrimaryLabels: true, noDistanceSuppression: true },
  cameraMove100: { totalMs: +timings.reduce((sum, t) => sum + t, 0).toFixed(2), medianMs: +timings[50].toFixed(3), p95Ms: +timings[95].toFixed(3), maxMs: +timings[99].toFixed(3) },
  protected: ['body + 10px', 'viewport + 10px', 'UI labels and leader lines', 'UI-covered anchors', 'other labels and leaders', 'unsafe previous layout'],
}, null, 2));
