const turn = 2 * Math.PI;
const framingLimit = 1 - 2 * .04;

function maximumOverArc(sin, cos, start, end) {
  const peak = Math.atan2(sin, cos);
  const firstPeak = peak + turn * Math.ceil((start - peak) / turn);
  return firstPeak <= end ? Math.hypot(sin, cos) : Math.max(
    sin * Math.sin(start) + cos * Math.cos(start),
    sin * Math.sin(end) + cos * Math.cos(end),
  );
}

// A single radius for the whole yaw arc. Each corner must fit the horizontal
// and vertical perspective limits at both endpoints and every angle between.
export function fitHubAngle({ min, max }, { minimumYaw, maximumYaw, fov, aspect }) {
  const target = min.map((value, axis) => (value + max[axis]) / 2);
  const vertical = Math.tan(fov * Math.PI / 360) * framingLimit;
  const horizontal = vertical * aspect;
  let distance = 0;
  const arcMaximum = (sin, cos) => maximumOverArc(sin, cos, minimumYaw, maximumYaw);
  for (const x of [min[0] - target[0], max[0] - target[0]]) {
    for (const z of [min[2] - target[2], max[2] - target[2]]) {
      // Depth = radius - outward component. Use both signs of the right
      // component to fit the left and right edges without shifting the pivot.
      distance = Math.max(distance,
        arcMaximum(x - z / horizontal, z + x / horizontal),
        arcMaximum(x + z / horizontal, z - x / horizontal),
        arcMaximum(x, z) + (max[1] - target[1]) / vertical,
        arcMaximum(x, z) + .02,
      );
    }
  }
  return { target, distance };
}
