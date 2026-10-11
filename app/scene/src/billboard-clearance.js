// Score a projected 3D card against each local body part separately. Keeping
// the local convex hulls separate preserves usable space between limbs.
const EPSILON = 1e-6;
const HARD_PENALTY = 1_000_000;
const BODY_LIMIT = HARD_PENALTY / 10;
const finite = Number.isFinite;
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

function convexHull(points) {
  const sorted = (points ?? []).filter(p => p && finite(p.x) && finite(p.y))
    .map(p => ({ x: p.x, y: p.y })).sort((a, b) => a.x - b.x || a.y - b.y);
  const unique = sorted.filter((p, i) => i === 0 || p.x !== sorted[i - 1].x || p.y !== sorted[i - 1].y);
  if (unique.length < 3) return unique;
  const half = list => {
    const result = [];
    for (const p of list) {
      while (result.length > 1 && cross(result.at(-2), result.at(-1), p) <= 0) result.pop();
      result.push(p);
    }
    return result;
  };
  return half(unique).slice(0, -1).concat(half([...unique].reverse()).slice(0, -1));
}

function prepare(points) {
  const hull = convexHull(points);
  if (!hull.length) return null;
  const normals = [{ x: 1, y: 0 }, { x: 0, y: 1 }];
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (length <= EPSILON) continue;
    const normal = { x: (b.y - a.y) / length, y: (a.x - b.x) / length };
    if (!normals.some(other => Math.abs(other.x * normal.y - other.y * normal.x) < EPSILON)) normals.push(normal);
  }
  return normals.map(({ x, y }) => {
    let low = Infinity, high = -Infinity;
    for (const p of hull) {
      const projected = p.x * x + p.y * y;
      low = Math.min(low, projected); high = Math.max(high, projected);
    }
    return { x, y, low, high };
  });
}

function normalizeRect(rect) {
  const left = rect?.left ?? rect?.x, top = rect?.top ?? rect?.y;
  const width = rect?.width, height = rect?.height;
  return [left, top, width, height].every(finite) && width > 0 && height > 0
    ? { left, top, width, height } : null;
}

function expand(rect, gap) {
  return { left: rect.left - gap, top: rect.top - gap, width: rect.width + gap * 2, height: rect.height + gap * 2 };
}

// SAT separation on both rectangle axes and every convex polygon edge normal.
// The returned distance is the smallest translation needed to clear a hull;
// the formula also works for a point or a degenerate line inside the card.
function hullPenetration(rect, axes) {
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  let depth = Infinity;
  for (const { x, y, low, high } of axes) {
    const centre = cx * x + cy * y;
    const radius = Math.abs(x) * rect.width / 2 + Math.abs(y) * rect.height / 2;
    const rectLow = centre - radius, rectHigh = centre + radius;
    if (rectHigh <= low + EPSILON || high <= rectLow + EPSILON) return 0;
    depth = Math.min(depth, rectHigh - low, high - rectLow);
  }
  return depth;
}

function rectPenetration(a, b) {
  const dx = Math.min(a.left + a.width - b.left, b.left + b.width - a.left);
  const dy = Math.min(a.top + a.height - b.top, b.top + b.height - a.top);
  return dx > EPSILON && dy > EPSILON ? Math.min(dx, dy) : 0;
}

/**
 * @param {Array<Array<{x:number,y:number}>>} hulls Unsorted projected points per body part.
 * @returns {{score: (rect:object, placed?:Array<object>) => number, isClear: (rect:object, placed?:Array<object>) => boolean}}
 * A score of zero means the card has the requested gap from every body part,
 * the viewport edges, UI obstacles and previously placed cards. Boundary/UI/
 * card collisions outweigh all body collisions combined, so an unavoidable
 * body overlap cannot drive a card offscreen or onto another control.
 */
export function createBillboardClearance(hulls, { width, height, obstacles = [], gap = 8 }) {
  if (!finite(width) || !finite(height) || width <= 0 || height <= 0) throw new RangeError('A positive viewport is required');
  if (!finite(gap) || gap < 0) throw new RangeError('Clearance gap must be nonnegative');
  const bodies = (hulls ?? []).map(prepare).filter(Boolean);
  const ui = obstacles.map(normalizeRect).filter(Boolean);

  function score(input, placed = []) {
    const rect = normalizeRect(input);
    if (!rect) return Infinity;
    const padded = expand(rect, gap);
    const violations = [gap - rect.left, gap - rect.top,
      rect.left + rect.width + gap - width, rect.top + rect.height + gap - height];
    let hard = 0;
    for (const distance of violations) if (distance > EPSILON) hard += HARD_PENALTY + distance * distance;
    for (const obstacle of ui) {
      const depth = rectPenetration(padded, obstacle);
      if (depth > 0) hard += HARD_PENALTY + depth * depth;
    }
    for (const item of placed) {
      const other = normalizeRect(item);
      if (!other) continue;
      const depth = rectPenetration(padded, other);
      if (depth > 0) hard += HARD_PENALTY + depth * depth;
    }
    let body = 0;
    for (const axes of bodies) {
      const depth = hullPenetration(padded, axes);
      if (depth > 0) body += 100 + depth * depth;
    }
    return hard + Math.min(BODY_LIMIT, body);
  }
  return { score, isClear: (rect, placed = []) => score(rect, placed) === 0 };
}
