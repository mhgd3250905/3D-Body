const framingLimit = 1 - 2 * .04;

// Use the tightest single radius that fits the motion box at every stage yaw.
export function fitHubAngle({ min, max }, { yaws, fov, aspect }) {
  const target = min.map((value, axis) => (value + max[axis]) / 2);
  const vertical = Math.tan(fov * Math.PI / 360) * framingLimit;
  const horizontal = vertical * aspect;
  const halfHeight = max[1] - target[1];
  let distance = 0;
  for (const yaw of yaws) {
    const sin = Math.sin(yaw), cos = Math.cos(yaw);
    for (const x of [min[0] - target[0], max[0] - target[0]]) {
      for (const z of [min[2] - target[2], max[2] - target[2]]) {
        // Depth is the orbit radius minus the corner's outward component.
        const outward = x * sin + z * cos;
        const across = Math.abs(x * cos - z * sin);
        const requiredDepth = Math.max(across / horizontal, halfHeight / vertical, .02);
        distance = Math.max(distance, outward + requiredDepth);
      }
    }
  }
  return { target, distance };
}
