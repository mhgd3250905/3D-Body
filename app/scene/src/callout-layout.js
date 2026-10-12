// Screen-space labels tethered to projected 3D anchors. Keep this independent of
// DOM/Three.js so the same visibility rules apply while the camera is moving.
const SAFE = 10;
const BODY_GAP = 10;
const LABEL_GAP = 8;
const OBSTACLE_GAP = 6;
const MAX_CANDIDATES = 48;
const BEAM_SIZE = 32;
const EPSILON = 1e-5;
const SCORE = Symbol('layoutScore');
const BUBBLE_REACH = 80;
const TAIL_LENGTH = 7;
const TAIL_HALF_WIDTH = 5;
// The 44px hit target contains a vertically centred 36px card. Keep a side
// tail clear of that inner card's rounded corners as well as the outer target.
const TAIL_INSET = 15;

const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const finite = (value) => Number.isFinite(value);
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function convexHull(points) {
  const sorted = points.filter((p) => p && finite(p.x) && finite(p.y))
    .map((p) => ({ x: p.x, y: p.y })).sort((a, b) => a.x - b.x || a.y - b.y);
  const unique = sorted.filter((p, i) => i === 0 || p.x !== sorted[i - 1].x || p.y !== sorted[i - 1].y);
  if (unique.length < 3) return unique;
  const half = (list) => {
    const result = [];
    for (const p of list) {
      while (result.length > 1 && cross(result.at(-2), result.at(-1), p) <= 0) result.pop();
      result.push(p);
    }
    return result;
  };
  return half(unique).slice(0, -1).concat(half([...unique].reverse()).slice(0, -1));
}

function expand(rect, gap) {
  return { left: rect.left - gap, top: rect.top - gap, width: rect.width + gap * 2, height: rect.height + gap * 2 };
}

function rectsOverlap(a, b) {
  return a.left < b.left + b.width + EPSILON && a.left + a.width > b.left - EPSILON &&
    a.top < b.top + b.height + EPSILON && a.top + a.height > b.top - EPSILON;
}

function pointInRect(p, rect) {
  return p.x >= rect.left - EPSILON && p.x <= rect.left + rect.width + EPSILON &&
    p.y >= rect.top - EPSILON && p.y <= rect.top + rect.height + EPSILON;
}

// Slab clipping also handles zero-length and axis-aligned leader lines.
function lineInRect(a, b, rect) {
  let start = 0, end = 1;
  for (const [origin, delta, low, high] of [
    [a.x, b.x - a.x, rect.left, rect.left + rect.width],
    [a.y, b.y - a.y, rect.top, rect.top + rect.height],
  ]) {
    if (Math.abs(delta) < EPSILON) {
      if (origin < low || origin > high) return false;
    } else {
      const t0 = (low - origin) / delta, t1 = (high - origin) / delta;
      start = Math.max(start, Math.min(t0, t1));
      end = Math.min(end, Math.max(t0, t1));
      if (start > end) return false;
    }
  }
  return true;
}

function prepareHull(hull) {
  const axes = [];
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length];
    const nx = b.y - a.y, ny = a.x - b.x;
    let low = Infinity, high = -Infinity;
    for (const p of hull) {
      const projected = p.x * nx + p.y * ny;
      low = Math.min(low, projected); high = Math.max(high, projected);
    }
    axes.push({ nx, ny, low, high });
  }
  return { hull, axes, left: Math.min(...hull.map((p) => p.x)), right: Math.max(...hull.map((p) => p.x)),
    top: Math.min(...hull.map((p) => p.y)), bottom: Math.max(...hull.map((p) => p.y)) };
}

function overlapsHull(rect, shape) {
  const { hull, axes } = shape;
  if (!hull.length) return false;
  if (hull.length === 1) return pointInRect(hull[0], rect);
  if (hull.length === 2) return lineInRect(hull[0], hull[1], rect);
  if (rect.left + rect.width < shape.left - EPSILON || rect.left > shape.right + EPSILON ||
    rect.top + rect.height < shape.top - EPSILON || rect.top > shape.bottom + EPSILON) return false;
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  for (const axis of axes) {
    const projected = cx * axis.nx + cy * axis.ny;
    const radius = Math.abs(axis.nx) * rect.width / 2 + Math.abs(axis.ny) * rect.height / 2;
    if (axis.high < projected - radius - EPSILON || projected + radius < axis.low - EPSILON) return false;
  }
  return true;
}

function leaderCrosses(a, b) {
  const ax = a.edgeX - a.x, ay = a.edgeY - a.y;
  const bx = b.edgeX - b.x, by = b.edgeY - b.y;
  const determinant = ax * by - ay * bx;
  if (Math.abs(determinant) < EPSILON) return false;
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = (dx * by - dy * bx) / determinant;
  const u = (dx * ay - dy * ax) / determinant;
  // Shared/nearby muscle anchors are allowed to fan out from one small area.
  return t > 0 && t < 1 && u > 0 && u < 1 &&
    t * Math.hypot(ax, ay) > 12 && u * Math.hypot(bx, by) > 12;
}

function normalizeObstacle(rect) {
  const left = rect?.left ?? rect?.x, top = rect?.top ?? rect?.y;
  return [left, top, rect?.width, rect?.height].every(finite) && rect.width > 0 && rect.height > 0
    ? { left, top, width: rect.width, height: rect.height } : null;
}

function candidatesFor(anchor, context, previous) {
  const { width, height, hull, hullShape, obstacles, anchors, centre } = context;
  const w = anchor.width, h = anchor.height;
  const right = width - SAFE - w, bottom = height - SAFE - h;
  if (right < SAFE || bottom < SAFE) return [];
  const candidates = [], seen = new Set();
  const prior = previous && finite(previous.left) && finite(previous.top) ? previous : null;
  const priorCentre = prior && { x: prior.left + w / 2, y: prior.top + h / 2 };
  const anchorMove = prior && finite(prior.x) && finite(prior.y) ? distance(anchor, prior) : Infinity;
  const outwardX = anchor.x - centre.x, outwardY = anchor.y - centre.y;
  const outwardLength = Math.hypot(outwardX, outwardY);

  function add(left, top) {
    left = clamp(left, SAFE, right); top = clamp(top, SAFE, bottom);
    const key = `${Math.round(left * 2)},${Math.round(top * 2)}`;
    if (seen.has(key)) return;
    seen.add(key);
    const rect = { left, top, width: w, height: h };
    if (overlapsHull(expand(rect, BODY_GAP), hullShape) || obstacles.some((box) => rectsOverlap(expand(rect, OBSTACLE_GAP), box)) ||
      anchors.some((point) => pointInRect(point, expand(rect, 12)))) return;
    const edgeX = clamp(anchor.x, left, left + w), edgeY = clamp(anchor.y, top, top + h);
    if (obstacles.some((box) => lineInRect(anchor, { x: edgeX, y: edgeY }, expand(box, 3)))) return;
    const dx = left + w / 2 - anchor.x, dy = top + h / 2 - anchor.y;
    const radius = Math.hypot(dx, dy);
    const outward = outwardLength > 12 ? (dx * outwardX + dy * outwardY) / (radius * outwardLength) : 0;
    let score = Math.hypot(edgeX - anchor.x, edgeY - anchor.y) + (1 - outward) * 18 + Math.max(0, dy / radius) * 20;
    // A camera nudge may move the tether without making a label jump to the
    // other side. Safety is checked first, so hysteresis can never cover Snow.
    if (priorCentre && anchorMove < 80) {
      score += Math.min(120, Math.max(0, distance({ x: left + w / 2, y: top + h / 2 }, priorCentre) - 2) * 1.18);
    }
    candidates.push({ ...anchor, ...rect, edgeX, edgeY, [SCORE]: score });
  }

  if (prior) {
    add(prior.left, prior.top);
    if (finite(prior.x) && finite(prior.y)) add(prior.left + anchor.x - prior.x, prior.top + anchor.y - prior.y);
  }
  // Place a horizontal card just outside supporting planes of the body hull.
  // The expanded rectangle is conservative even around high, diagonal legs.
  for (let i = 0; i < 24; i++) {
    const angle = i * Math.PI / 12 - Math.PI / 2;
    const nx = Math.cos(angle), ny = Math.sin(angle);
    let support = -Infinity;
    for (const p of hull) support = Math.max(support, p.x * nx + p.y * ny);
    const extent = Math.abs(nx) * (w / 2 + BODY_GAP) + Math.abs(ny) * (h / 2 + BODY_GAP);
    const tangent = Math.max(42 + Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2,
      support - anchor.x * nx - anchor.y * ny + extent + 1);
    for (const extra of [0, 18, 44]) {
      add(anchor.x + nx * (tangent + extra) - w / 2, anchor.y + ny * (tangent + extra) - h / 2);
    }
  }
  const xSlots = [SAFE, right, clamp(anchor.x - w / 2, SAFE, right)];
  const ySlots = [SAFE, bottom, clamp(anchor.y - h / 2, SAFE, bottom)];
  for (let x = SAFE; x <= right; x += w + LABEL_GAP + 1) xSlots.push(x);
  for (let x = right; x >= SAFE; x -= w + LABEL_GAP + 1) xSlots.push(x);
  for (let y = SAFE; y <= bottom; y += h + LABEL_GAP + 1) ySlots.push(y);
  for (const x of xSlots) for (const y of ySlots) add(x, y);
  for (const box of obstacles) {
    for (const x of [box.left - w - OBSTACLE_GAP - 1, box.left + box.width + OBSTACLE_GAP + 1]) {
      add(x, anchor.y - h / 2); add(x, box.top); add(x, box.top + box.height - h);
    }
    for (const y of [box.top - h - OBSTACLE_GAP - 1, box.top + box.height + OBSTACLE_GAP + 1]) add(anchor.x - w / 2, y);
  }
  candidates.sort((a, b) => a[SCORE] - b[SCORE] || a.top - b.top || a.left - b.left);
  // Keep alternatives spread out; near-identical positions are less useful
  // than a few positions on every free side when placing the other two labels.
  const diverse = [];
  for (const candidate of candidates) {
    if (diverse.every((other) => Math.hypot(candidate.left - other.left, candidate.top - other.top) >= 11)) diverse.push(candidate);
    if (diverse.length === MAX_CANDIDATES) break;
  }
  return diverse;
}

function compatible(candidate, placed) {
  const end = { x: candidate.edgeX, y: candidate.edgeY };
  for (const other of placed) {
    if (rectsOverlap(expand(candidate, LABEL_GAP / 2), expand(other, LABEL_GAP / 2)) ||
      lineInRect(candidate, end, expand(other, 3)) ||
      lineInRect(other, { x: other.edgeX, y: other.edgeY }, expand(candidate, 3))) return false;
  }
  return true;
}

function movePrevious(anchors, context, previous) {
  const placed = [];
  for (let index = 0; index < anchors.length; index++) {
    const anchor = anchors[index];
    const old = anchor.groupId == null ? previous[index] : previous.find((p) => p.groupId === anchor.groupId);
    if (!old || ![old.left, old.top, old.x, old.y].every(finite) ||
      old.width !== anchor.width || old.height !== anchor.height || distance(anchor, old) > 6) return null;
    const right = context.width - SAFE - anchor.width, bottom = context.height - SAFE - anchor.height;
    if (right < SAFE || bottom < SAFE) return null;
    const left = clamp(old.left + anchor.x - old.x, SAFE, right);
    const top = clamp(old.top + anchor.y - old.y, SAFE, bottom);
    const card = { ...anchor, left, top, edgeX: clamp(anchor.x, left, left + anchor.width), edgeY: clamp(anchor.y, top, top + anchor.height) };
    if (overlapsHull(expand(card, BODY_GAP), context.hullShape) ||
      context.obstacles.some((box) => rectsOverlap(expand(card, OBSTACLE_GAP), box)) ||
      context.obstacles.some((box) => lineInRect(card, { x: card.edgeX, y: card.edgeY }, expand(box, 3))) ||
      anchors.some((point) => pointInRect(point, expand(card, 12))) ||
      Math.hypot(card.edgeX - card.x, card.edgeY - card.y) > 220 ||
      !compatible(card, placed) || placed.some((other) => leaderCrosses(card, other))) return null;
    placed.push(card);
  }
  return placed;
}

const TAIL_NORMAL = {
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
  top: { x: 0, y: -1 }, bottom: { x: 0, y: 1 },
};

function bubbleTail(anchor, rect) {
  const localX = anchor.x - rect.left, localY = anchor.y - rect.top;
  const verticalInset = Math.min(TAIL_INSET, rect.height / 2);
  const horizontalInset = Math.min(TAIL_INSET, rect.width / 2);
  // The small triangle is axis-aligned. A side is valid only if its tip really
  // points at this anchor, rather than toward a rounded corner or another limb.
  if (localY >= verticalInset - EPSILON && localY <= rect.height - verticalInset + EPSILON) {
    if (localX < 0) return { tailSide: 'left', tailX: 0, tailY: clamp(localY, verticalInset, rect.height - verticalInset) };
    if (localX > rect.width) return { tailSide: 'right', tailX: rect.width, tailY: clamp(localY, verticalInset, rect.height - verticalInset) };
  }
  if (localX >= horizontalInset - EPSILON && localX <= rect.width - horizontalInset + EPSILON) {
    if (localY < 0) return { tailSide: 'top', tailX: clamp(localX, horizontalInset, rect.width - horizontalInset), tailY: 0 };
    if (localY > rect.height) return { tailSide: 'bottom', tailX: clamp(localX, horizontalInset, rect.width - horizontalInset), tailY: rect.height };
  }
  return null;
}

function tailTip(card) {
  const normal = TAIL_NORMAL[card.tailSide];
  return { x: card.left + card.tailX + normal.x * TAIL_LENGTH, y: card.top + card.tailY + normal.y * TAIL_LENGTH };
}

function tailBox(card) {
  const x = card.left + card.tailX, y = card.top + card.tailY;
  const tip = tailTip(card);
  const horizontal = card.tailSide === 'left' || card.tailSide === 'right';
  return horizontal
    ? { left: Math.min(x, tip.x) - 2, top: y - TAIL_HALF_WIDTH - 2, width: TAIL_LENGTH + 4, height: TAIL_HALF_WIDTH * 2 + 4 }
    : { left: x - TAIL_HALF_WIDTH - 2, top: Math.min(y, tip.y) - 2, width: TAIL_HALF_WIDTH * 2 + 4, height: TAIL_LENGTH + 4 };
}

function bubbleAt(anchor, left, top, context) {
  const right = context.width - SAFE - anchor.width, bottom = context.height - SAFE - anchor.height;
  if (right < SAFE || bottom < SAFE) return null;
  const rect = { left: clamp(left, SAFE, right), top: clamp(top, SAFE, bottom), width: anchor.width, height: anchor.height };
  const tail = bubbleTail(anchor, rect);
  if (!tail) return null;
  const card = { ...anchor, ...rect, ...tail, edgeX: rect.left + tail.tailX, edgeY: rect.top + tail.tailY };
  const tip = tailTip(card), tipDistance = distance(anchor, tip);
  if (tipDistance > BUBBLE_REACH || distance(anchor, { x: card.edgeX, y: card.edgeY }) < TAIL_LENGTH + 4) return null;
  const smallTail = tailBox(card);
  if (smallTail.left < SAFE || smallTail.top < SAFE ||
    smallTail.left + smallTail.width > context.width - SAFE || smallTail.top + smallTail.height > context.height - SAFE ||
    context.shapes.some((shape) => overlapsHull(expand(card, BODY_GAP), shape) || overlapsHull(smallTail, shape)) ||
    context.obstacles.some((box) => rectsOverlap(expand(card, OBSTACLE_GAP), box) || rectsOverlap(expand(smallTail, OBSTACLE_GAP), box)) ||
    context.anchors.some((point) => pointInRect(point, expand(card, 12)))) return null;
  return card;
}

function bubblesCompatible(card, placed) {
  const smallTail = tailBox(card);
  return placed.every((other) => {
    const otherTail = tailBox(other);
    return !rectsOverlap(expand(card, LABEL_GAP / 2), expand(other, LABEL_GAP / 2)) &&
      !rectsOverlap(smallTail, expand(other, 3)) && !rectsOverlap(otherTail, expand(card, 3)) && !rectsOverlap(smallTail, otherTail);
  });
}

function bubbleCandidates(anchor, context, previous) {
  const candidates = [], seen = new Set();
  const prior = previous && finite(previous.left) && finite(previous.top) ? previous : null;
  const closePrior = prior && finite(prior.x) && finite(prior.y) && distance(anchor, prior) < 30;
  function add(left, top) {
    const key = `${Math.round(left * 2)},${Math.round(top * 2)}`;
    if (seen.has(key)) return;
    seen.add(key);
    const card = bubbleAt(anchor, left, top, context);
    if (!card) return;
    const preferredSide = { left: 0, bottom: 9, right: 12, top: 14 }[card.tailSide];
    let score = distance(anchor, tailTip(card)) * 1.1 + preferredSide;
    if (closePrior) score += Math.min(90, Math.max(0, Math.hypot(card.left - prior.left, card.top - prior.top) - 2) * 1.2);
    candidates.push({ ...card, [SCORE]: score });
  }
  if (prior) {
    add(prior.left, prior.top);
    if (closePrior) add(prior.left + anchor.x - prior.x, prior.top + anchor.y - prior.y);
  }
  const topSlots = [anchor.y - anchor.height / 2, anchor.y - TAIL_INSET, anchor.y - anchor.height + TAIL_INSET];
  const leftSlots = [anchor.x - anchor.width / 2, anchor.x - TAIL_INSET, anchor.x - anchor.width + TAIL_INSET];
  const rightOf = [], leftOf = [], below = [], above = [];
  for (const gap of [13, 20, 30, 44, 60, 76, BUBBLE_REACH + TAIL_LENGTH]) {
    rightOf.push(anchor.x + gap); leftOf.push(anchor.x - gap - anchor.width);
    below.push(anchor.y + gap); above.push(anchor.y - gap - anchor.height);
  }
  // Nearby local edges also supply exact fits. The union intentionally leaves
  // real gaps between raised arms/legs available, unlike one whole-body hull.
  const edges = context.shapes.map((shape) => ({ left: shape.left, right: shape.right, top: shape.top, bottom: shape.bottom, gap: BODY_GAP + 1 }))
    .concat(context.obstacles.map((box) => ({ left: box.left, right: box.left + box.width, top: box.top, bottom: box.top + box.height, gap: OBSTACLE_GAP + 1 })));
  for (const edge of edges) {
    rightOf.push(edge.right + edge.gap); leftOf.push(edge.left - edge.gap - anchor.width);
    below.push(edge.bottom + edge.gap); above.push(edge.top - edge.gap - anchor.height);
    const beforeY = edge.top - edge.gap - anchor.height, afterY = edge.bottom + edge.gap;
    const beforeX = edge.left - edge.gap - anchor.width, afterX = edge.right + edge.gap;
    if (beforeY <= anchor.y - TAIL_INSET && beforeY >= anchor.y - anchor.height + TAIL_INSET) topSlots.push(beforeY);
    if (afterY <= anchor.y - TAIL_INSET && afterY >= anchor.y - anchor.height + TAIL_INSET) topSlots.push(afterY);
    if (beforeX <= anchor.x - TAIL_INSET && beforeX >= anchor.x - anchor.width + TAIL_INSET) leftSlots.push(beforeX);
    if (afterX <= anchor.x - TAIL_INSET && afterX >= anchor.x - anchor.width + TAIL_INSET) leftSlots.push(afterX);
  }
  for (const left of rightOf.concat(leftOf)) for (const top of topSlots) add(left, top);
  for (const top of above.concat(below)) for (const left of leftSlots) add(left, top);
  candidates.sort((a, b) => a[SCORE] - b[SCORE] || a.top - b.top || a.left - b.left);
  const diverse = [];
  for (const card of candidates) {
    if (diverse.every((other) => Math.hypot(card.left - other.left, card.top - other.top) >= 7)) diverse.push(card);
    if (diverse.length === 36) break;
  }
  return diverse;
}

function layoutBubbles({ anchors, hull, bodyHulls, width, height, obstacles, previous }) {
  const boxes = obstacles.map(normalizeObstacle).filter(Boolean);
  const valid = anchors.slice(0, 3).filter((a) => a && [a.x, a.y, a.width, a.height].every(finite) && a.width > 0 && a.height > 0 &&
    !boxes.some((box) => pointInRect(a, expand(box, 3))));
  if (!valid.length) return [];
  const polygons = (Array.isArray(bodyHulls) ? bodyHulls : [hull]).map(convexHull).filter((polygon) => polygon.length);
  const context = { width, height, anchors: valid, shapes: polygons.map(prepareHull), obstacles: boxes };
  const moved = [];
  for (let index = 0; index < valid.length; index++) {
    const anchor = valid[index];
    const old = anchor.groupId == null ? previous[index] : previous.find((p) => p.groupId === anchor.groupId);
    if (!old || ![old.left, old.top, old.x, old.y].every(finite) || old.width !== anchor.width || old.height !== anchor.height || distance(anchor, old) > 6) break;
    const card = bubbleAt(anchor, old.left + anchor.x - old.x, old.top + anchor.y - old.y, context);
    if (!card || !bubblesCompatible(card, moved)) break;
    moved.push(card);
  }
  if (moved.length === valid.length) return moved;
  const entries = valid.map((anchor, index) => {
    const prior = anchor.groupId == null ? previous[index] : previous.find((p) => p.groupId === anchor.groupId);
    return { index, candidates: bubbleCandidates(anchor, context, prior) };
  }).sort((a, b) => a.candidates.length - b.candidates.length || a.index - b.index);
  let beam = [{ placed: [], indexes: [], score: 0 }];
  for (const entry of entries) {
    const buckets = Array.from({ length: 4 }, () => []);
    for (const state of beam) {
      buckets[state.placed.length].push(state);
      for (const card of entry.candidates) {
        if (bubblesCompatible(card, state.placed)) buckets[state.placed.length + 1].push({
          placed: [...state.placed, card], indexes: [...state.indexes, entry.index], score: state.score + card[SCORE],
        });
      }
    }
    beam = buckets.flatMap((bucket) => bucket.sort((a, b) => a.score - b.score).slice(0, BEAM_SIZE));
  }
  beam.sort((a, b) => b.placed.length - a.placed.length || a.score - b.score);
  const best = beam[0];
  return best.placed.map((placed, index) => ({ placed, index: best.indexes[index] })).sort((a, b) => a.index - b.index).map(({ placed }) => {
    const { [SCORE]: score, ...result } = placed;
    return result;
  });
}

function markersCompatible(card, placed) {
  return placed.every((other) => !rectsOverlap(expand(card, LABEL_GAP / 2), expand(other, LABEL_GAP / 2)));
}

function markerAt(anchor, left, top, context) {
  const right = context.width - SAFE - anchor.width, bottom = context.height - SAFE - anchor.height;
  if (right < SAFE || bottom < SAFE) return null;
  const rect = { left: clamp(left, SAFE, right), top: clamp(top, SAFE, bottom), width: anchor.width, height: anchor.height };
  if (context.obstacles.some((box) => rectsOverlap(expand(rect, OBSTACLE_GAP), box)) || context.anchors.some((point) => {
    const radius = finite(point.radius) ? Math.max(0, point.radius) : 12;
    return Math.hypot(point.x - clamp(point.x, rect.left, rect.left + rect.width),
      point.y - clamp(point.y, rect.top, rect.top + rect.height)) <= radius + EPSILON;
  })) return null;
  return { ...anchor, ...rect, edgeX: clamp(anchor.x, rect.left, rect.left + rect.width), edgeY: clamp(anchor.y, rect.top, rect.top + rect.height) };
}

function markerBodyCost(card, shapes) {
  // Clothing is a soft preference in marker mode. Sample the visible 32px
  // surface rather than rejecting the whole 44px hit target at a body edge.
  let occupied = 0;
  for (const fx of [.12, .5, .88]) for (const fy of [.18, .5, .82]) {
    const x = card.left + card.width * fx, y = card.top + card.height * fy;
    if (shapes.some((shape) => {
      if (x < shape.left || x > shape.right || y < shape.top || y > shape.bottom) return false;
      return shape.axes.every((axis) => {
        const projected = x * axis.nx + y * axis.ny;
        return projected >= axis.low - EPSILON && projected <= axis.high + EPSILON;
      });
    })) occupied++;
  }
  return occupied * 4;
}

function markerCandidates(anchor, context, previous) {
  const right = context.width - SAFE - anchor.width, bottom = context.height - SAFE - anchor.height;
  if (right < SAFE || bottom < SAFE) return [];
  const candidates = [], seen = new Set();
  const prior = previous && [previous.left, previous.top, previous.x, previous.y].every(finite) ? previous : null;
  function add(left, top) {
    left = clamp(left, SAFE, right); top = clamp(top, SAFE, bottom);
    const key = `${Math.round(left * 2)},${Math.round(top * 2)}`;
    if (seen.has(key)) return;
    seen.add(key);
    const card = markerAt(anchor, left, top, context);
    if (!card) return;
    let score = Math.hypot(card.edgeX - anchor.x, card.edgeY - anchor.y) + markerBodyCost(card, context.shapes);
    // Prefer the familiar point-then-name reading order when distances tie.
    if (card.left + card.width <= anchor.x) score += 3;
    if (prior && distance(anchor, prior) < 40) score += Math.min(100, Math.max(0, Math.hypot(left - prior.left, top - prior.top) - 2) * 1.2);
    candidates.push({ ...card, [SCORE]: score });
  }
  if (prior) {
    add(prior.left, prior.top);
    add(prior.left + anchor.x - prior.x, prior.top + anchor.y - prior.y);
  }
  for (let index = 0; index < 16; index++) {
    const angle = index * Math.PI / 8;
    const nx = Math.cos(angle), ny = Math.sin(angle);
    const extent = Math.abs(nx) * anchor.width / 2 + Math.abs(ny) * anchor.height / 2;
    for (const gap of [13, 24, 40, 62, 90, 130]) {
      add(anchor.x + nx * (extent + gap) - anchor.width / 2, anchor.y + ny * (extent + gap) - anchor.height / 2);
    }
  }
  // Whole-stage fallback slots deliberately have no distance cutoff: retaining
  // all primary muscle names matters more than an arbitrary 80px tether rule.
  const xSlots = [SAFE, right, clamp(anchor.x - anchor.width / 2, SAFE, right)];
  const ySlots = [SAFE, bottom, clamp(anchor.y - anchor.height / 2, SAFE, bottom)];
  for (let x = SAFE; x <= right; x += anchor.width + LABEL_GAP + 1) xSlots.push(x);
  for (let x = right; x >= SAFE; x -= anchor.width + LABEL_GAP + 1) xSlots.push(x);
  for (let y = SAFE; y <= bottom; y += anchor.height + LABEL_GAP + 1) ySlots.push(y);
  for (const x of xSlots) for (const y of ySlots) add(x, y);
  for (const box of context.obstacles) {
    for (const x of [box.left - anchor.width - OBSTACLE_GAP - 1, box.left + box.width + OBSTACLE_GAP + 1]) add(x, anchor.y - anchor.height / 2);
    for (const y of [box.top - anchor.height - OBSTACLE_GAP - 1, box.top + box.height + OBSTACLE_GAP + 1]) add(anchor.x - anchor.width / 2, y);
  }
  candidates.sort((a, b) => a[SCORE] - b[SCORE] || a.top - b.top || a.left - b.left);
  const diverse = [];
  for (const card of candidates) {
    if (diverse.every((other) => Math.hypot(card.left - other.left, card.top - other.top) >= 10)) diverse.push(card);
    if (diverse.length === MAX_CANDIDATES) break;
  }
  return diverse;
}

function layoutMarkers({ anchors, hull, bodyHulls, width, height, obstacles, previous }) {
  const boxes = obstacles.map(normalizeObstacle).filter(Boolean);
  const valid = anchors.filter((a) => a && [a.x, a.y, a.width, a.height].every(finite) && a.width > 0 && a.height > 0 &&
    !boxes.some((box) => pointInRect(a, expand(box, 3))));
  if (!valid.length) return [];
  const polygons = (Array.isArray(bodyHulls) ? bodyHulls : [hull]).map(convexHull).filter((polygon) => polygon.length);
  const context = { width, height, anchors: valid, obstacles: boxes, shapes: polygons.map(prepareHull) };
  const moved = [];
  for (let index = 0; index < valid.length; index++) {
    const anchor = valid[index];
    const old = anchor.groupId == null ? previous[index] : previous.find((p) => p.groupId === anchor.groupId);
    if (!old || ![old.left, old.top, old.x, old.y].every(finite) || old.width !== anchor.width || old.height !== anchor.height || distance(anchor, old) > 6) break;
    const card = markerAt(anchor, old.left + anchor.x - old.x, old.top + anchor.y - old.y, context);
    if (!card || !markersCompatible(card, moved)) break;
    moved.push(card);
  }
  if (moved.length === valid.length) return moved;
  const entries = valid.map((anchor, index) => {
    const prior = anchor.groupId == null ? previous[index] : previous.find((p) => p.groupId === anchor.groupId);
    return { index, candidates: markerCandidates(anchor, context, prior) };
  }).sort((a, b) => a.candidates.length - b.candidates.length || a.index - b.index);
  let beam = [{ placed: [], indexes: [], score: 0 }];
  for (const entry of entries) {
    const buckets = Array.from({ length: valid.length + 1 }, () => []);
    for (const state of beam) {
      buckets[state.placed.length].push(state);
      for (const card of entry.candidates) if (markersCompatible(card, state.placed)) {
        buckets[state.placed.length + 1].push({ placed: [...state.placed, card], indexes: [...state.indexes, entry.index], score: state.score + card[SCORE] });
      }
    }
    const most = buckets.findLastIndex((bucket) => bucket.length);
    // Most alternatives go to full-card layouts. Keep smaller fallbacks too so
    // one impossible edge label cannot displace several other primary names.
    beam = buckets.flatMap((bucket, count) => bucket.sort((a, b) => a.score - b.score).slice(0, count === most ? BEAM_SIZE : 8));
  }
  beam.sort((a, b) => b.placed.length - a.placed.length || a.score - b.score);
  const best = beam[0];
  return best.placed.map((placed, index) => ({ placed, index: best.indexes[index] })).sort((a, b) => a.index - b.index).map(({ placed }) => {
    const { [SCORE]: score, ...result } = placed;
    return result;
  });
}

/**
 * Lay out camera-facing labels in stage-local CSS pixels (all markers, up to
 * three in the legacy leader/bubble modes).
 * `hull` may be a convex polygon or an unordered set of projected body points.
 * `obstacles` are { left, top, width, height } (x/y aliases are accepted).
 * `mode: 'bubble'` uses short, 7px tails and an 80px maximum tip/anchor gap.
 * Its optional `bodyHulls` is a union of local body polygons, preserving limb
 * gaps. The fallback is `hull`. `tailX/Y` are local coordinates on the card's
 * `tailSide` edge; the 7px outward triangle points directly at its anchor.
 * `mode: 'markers'` keeps every supplied muscle anchor, uses no tails/lines or
 * distance cutoff, and treats body overlap as a soft preference. UI, marker
 * circles (anchor.radius, default 12px), and other label hit targets stay clear.
 * Pass the last returned array as `previous` while orbiting. Input is immutable.
 * A label is omitted when no safe placement is found; anchors are never moved.
 */
export function layoutCallouts({ anchors = [], hull = [], bodyHulls, width, height, obstacles = [], previous = [], mode } = {}) {
  if (!finite(width) || !finite(height) || width <= SAFE * 2 || height <= SAFE * 2) return [];
  if (mode === 'markers') return layoutMarkers({ anchors, hull, bodyHulls, width, height, obstacles, previous });
  if (mode === 'bubble') return layoutBubbles({ anchors, hull, bodyHulls, width, height, obstacles, previous });
  const visibleObstacles = obstacles.map(normalizeObstacle).filter(Boolean);
  const valid = anchors.slice(0, 3).filter((a) => a && [a.x, a.y, a.width, a.height].every(finite) && a.width > 0 && a.height > 0 &&
    !visibleObstacles.some((box) => pointInRect(a, expand(box, 3))));
  if (!valid.length) return [];
  const polygon = convexHull(hull);
  const centrePoints = polygon.length ? polygon : valid;
  const centre = centrePoints.reduce((sum, p) => ({ x: sum.x + p.x / centrePoints.length, y: sum.y + p.y / centrePoints.length }), { x: 0, y: 0 });
  const context = { width, height, hull: polygon, hullShape: prepareHull(polygon), anchors: valid, obstacles: visibleObstacles, centre };
  // Most orbit frames move an anchor by less than a few pixels. Translate its
  // existing card first, but check every safety constraint against this frame's
  // newly projected body. Expensive placement is needed only at a boundary.
  const moved = movePrevious(valid, context, previous);
  if (moved) return moved;
  const entries = valid.map((anchor, index) => {
    const prior = anchor.groupId == null ? previous[index] : previous.find((p) => p.groupId === anchor.groupId);
    return { index, candidates: candidatesFor(anchor, context, prior) };
  }).sort((a, b) => a.candidates.length - b.candidates.length || a.index - b.index);

  let beam = [{ placed: [], indexes: [], score: 0 }];
  for (const entry of entries) {
    const buckets = Array.from({ length: 4 }, () => []);
    for (const state of beam) {
      buckets[state.placed.length].push(state);
      for (const candidate of entry.candidates) {
        if (!compatible(candidate, state.placed)) continue;
        const crossings = state.placed.filter((other) => leaderCrosses(candidate, other)).length;
        buckets[state.placed.length + 1].push({
          placed: [...state.placed, candidate], indexes: [...state.indexes, entry.index],
          score: state.score + candidate[SCORE] + crossings * 120,
        });
      }
    }
    // Retain each cardinality, including omissions, so a constrained label can
    // never prevent two other labels from using the available space.
    beam = buckets.flatMap((bucket) => bucket.sort((a, b) => a.score - b.score).slice(0, BEAM_SIZE));
  }
  beam.sort((a, b) => b.placed.length - a.placed.length || a.score - b.score);
  const best = beam[0];
  return best.placed.map((placed, i) => ({ placed, index: best.indexes[i] })).sort((a, b) => a.index - b.index).map(({ placed }) => {
    const { [SCORE]: score, ...result } = placed;
    return result;
  });
}
