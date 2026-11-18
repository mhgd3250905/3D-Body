import { Vector3 } from 'three';

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

export function createBodyHulls(meshes, hair) {
  const surfaces = meshes.slice();
  hair.traverse(object => {
    if (object.isMesh && !object.userData.__outline) surfaces.push(object);
  });
  const samples = surfaces.map(mesh => [mesh, extremeVertices(mesh)]);
  return () => samples.map(([mesh, indices]) =>
    indices.map(i => mesh.getVertexPosition(i, new Vector3()).applyMatrix4(mesh.matrixWorld)));
}
