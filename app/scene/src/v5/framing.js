import { MathUtils, Vector3 } from 'three';

// Keep the extremal vertices in several directions around each bone at rest.
// Their posed positions include the shoe, wrist and head beyond the joints.
const directions = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ...[-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x, y, z]))),
];

function extremeVertices(mesh) {
  const { position, skinIndex, skinWeight } = mesh.geometry.attributes;
  const groups = new Map();
  for (let i = 0; i < position.count; i++) {
    let dominant = 0;
    if (skinWeight) {
      for (let k = 1; k < 4; k++) {
        if (skinWeight.getComponent(i, k) > skinWeight.getComponent(i, dominant)) dominant = k;
      }
    }
    const joint = skinIndex?.getComponent(i, dominant) ?? 0;
    if (!groups.has(joint)) groups.set(joint, directions.map(() => ({ value: -Infinity, index: 0 })));
    const extremes = groups.get(joint);
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    for (let j = 0; j < directions.length; j++) {
      const [dx, dy, dz] = directions[j];
      const score = x * dx + y * dy + z * dz;
      const extreme = extremes[j];
      if (score > extreme.value) {
        extreme.value = score;
        extreme.index = i;
      }
    }
  }
  return [...new Set([...groups.values()].flatMap(group => group.map(extreme => extreme.index)))];
}

export function createFraming(meshes, hair, baseFov) {
  const surfaces = meshes.slice();
  hair.traverse(object => {
    if (object.isMesh && !object.userData.__outline) surfaces.push(object);
  });
  const samples = surfaces.map(mesh => [mesh, extremeVertices(mesh)]);
  const point = new Vector3();
  const baseTangent = Math.tan(MathUtils.degToRad(baseFov) / 2);

  function fit(camera, width, height) {
    camera.clearViewOffset();
    camera.aspect = 1;
    camera.fov = baseFov;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);

    let left = Infinity, right = -Infinity, bottom = Infinity, top = -Infinity;
    for (const [mesh, indices] of samples) {
      for (const i of indices) {
        mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld).project(camera);
        left = Math.min(left, point.x);
        right = Math.max(right, point.x);
        bottom = Math.min(bottom, point.y);
        top = Math.max(top, point.y);
      }
    }

    const halfSize = Math.min(width, height) / 2;
    // Reserve room for the outline and for the portion of the ground FX
    // just outside the body. Wide poses are constrained by the viewport width.
    const spanX = right - left + 0.065;
    const spanY = top - bottom + 0.045;
    const scale = Math.min((0.94 * width) / (spanX * halfSize), (0.55 * height) / (spanY * halfSize), 2.15);
    const focalPixels = halfSize * scale;
    camera.fov = MathUtils.radToDeg(2 * Math.atan((baseTangent * height) / (2 * focalPixels)));
    camera.setViewOffset(width, height, (left + right) * focalPixels / 2, -(bottom + top) * focalPixels / 2, width, height);
  }
  fit.getBodyHulls = () => samples.map(([mesh, indices]) =>
    indices.map(i => mesh.getVertexPosition(i, new Vector3()).applyMatrix4(mesh.matrixWorld)));
  return fit;
}
