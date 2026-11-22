const framingLimit = 1 - 2 * .04;

// Fit the entire motion box for a reference viewing direction.
export function fitHubAngle({ min, max }, { direction, fov, aspect }) {
  const target = min.map((value, axis) => (value + max[axis]) / 2);
  const vertical = Math.tan(fov * Math.PI / 360) * framingLimit;
  const horizontal = vertical * aspect;
  const outward = direction.clone().normalize();
  const right = outward.clone().set(outward.z, 0, -outward.x).normalize();
  const up = outward.clone().cross(right);
  const corner = outward.clone();
  let distance = 0;
  for (const x of [min[0], max[0]]) {
    for (const y of [min[1], max[1]]) {
      for (const z of [min[2], max[2]]) {
        corner.set(x - target[0], y - target[1], z - target[2]);
        const requiredDepth = Math.max(Math.abs(corner.dot(right)) / horizontal,
          Math.abs(corner.dot(up)) / vertical, .02);
        distance = Math.max(distance, corner.dot(outward) + requiredDepth);
      }
    }
  }
  return { target, distance };
}

export function resolveHubAngleCamera(bounds, { referenceDirection, fov, aspect }) {
  const { target, distance } = fitHubAngle(bounds, { direction: referenceDirection, fov, aspect });
  const direction = referenceDirection.clone().setY(0).normalize();
  return { target, direction, distance: distance / 1.5 };
}
