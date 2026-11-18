import { MathUtils, Vector3 } from 'three';
import reference from './legacy-framing.json' with { type: 'json' };

// These inputs come from the original R17 actor at cf654dde. They keep its
// camera fit independent of the shape and pose of the replacement model.
export const legacyLoopBounds = {
  min: reference.loop.slice(0, 3),
  max: reference.loop.slice(3),
};

function sample(rows, time) {
  const { times } = reference;
  let lower = 0;
  let upper = times.length - 1;
  while (upper - lower > 1) {
    const middle = (lower + upper) >> 1;
    if (times[middle] <= time) lower = middle;
    else upper = middle;
  }
  const a = rows[lower];
  const b = rows[upper];
  if (!a || !b) return a ?? b ?? null;
  const fraction = MathUtils.clamp((time - times[lower]) / (times[upper] - times[lower]), 0, 1);
  return a.map((component, i) => MathUtils.lerp(component, b[i], fraction));
}

export function legacyPoseBounds(time) {
  const bounds = sample(reference.poses, time);
  return { min: bounds.slice(0, 3), max: bounds.slice(3) };
}

export function legacyFocusDirection(time, groupId) {
  const rows = reference.directions[groupId];
  const direction = rows && sample(rows, time);
  return direction ? new Vector3(...direction).normalize() : null;
}
