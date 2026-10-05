import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Inspect the exported file itself. This script never modifies the asset.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modelPath = path.join(root, 'public/coach/flare-coach.glb');
const rigPath = path.join(root, 'public/coach/coach-rig.json');
const reportPath = path.join(root, 'output/coach-asset-verification.json');
const report = {
  checkedAt: new Date().toISOString(),
  model: 'public/coach/flare-coach.glb',
  rig: 'public/coach/coach-rig.json',
  reference: 'https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html',
  checks: [], errors: [], warnings: [],
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const check = (name, condition, details = {}) => {
  report.checks.push({ name, passed: Boolean(condition), ...details });
  if (!condition) report.errors.push(name);
};
const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const multiply = (a, b) => {
  const result = new Array(16).fill(0);
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      for (let k = 0; k < 4; k++) result[column * 4 + row] += a[k * 4 + row] * b[column * 4 + k];
    }
  }
  return result;
};
function nodeMatrix(node) {
  if (node.matrix) return node.matrix;
  const [x, y, z, w] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];
  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  return [
    (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y + z * w) * sx, 2 * (x * z - y * w) * sx, 0,
    2 * (x * y - z * w) * sy, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z + x * w) * sy, 0,
    2 * (x * z + y * w) * sz, 2 * (y * z - x * w) * sz, (1 - 2 * (x * x + y * y)) * sz, 0,
    tx, ty, tz, 1,
  ];
}

try {
  const file = fs.readFileSync(modelPath);
  const rig = JSON.parse(fs.readFileSync(rigPath, 'utf8'));
  report.fileBytes = file.length;
  report.sha256 = crypto.createHash('sha256').update(file).digest('hex');
  assert(file.length >= 20, 'GLB header is truncated');
  assert(file.readUInt32LE(0) === 0x46546c67, 'GLB magic is invalid');
  assert(file.readUInt32LE(4) === 2, 'Expected GLB version 2');
  assert(file.readUInt32LE(8) === file.length, 'GLB declared length differs from actual length');
  const chunks = [];
  let cursor = 12;
  while (cursor < file.length) {
    assert(cursor + 8 <= file.length, 'GLB chunk header is truncated');
    const length = file.readUInt32LE(cursor), type = file.readUInt32LE(cursor + 4);
    assert(length % 4 === 0, 'GLB chunk must be aligned to four bytes');
    assert(cursor + 8 + length <= file.length, 'GLB chunk exceeds file length');
    chunks.push({ type, length, bytes: file.subarray(cursor + 8, cursor + 8 + length) });
    cursor += 8 + length;
  }
  assert(chunks.length === 2 && chunks[0].type === 0x4e4f534a && chunks[1].type === 0x004e4942, 'Expected one JSON chunk followed by one BIN chunk');
  const gltf = JSON.parse(chunks[0].bytes.toString('utf8'));
  const bin = chunks[1].bytes;
  assert(gltf.asset?.version === '2.0', 'Expected glTF asset version 2.0');
  assert(gltf.buffers?.length === 1 && !gltf.buffers[0].uri, 'Expected one embedded binary buffer');
  assert(bin.length >= gltf.buffers[0].byteLength && bin.length - gltf.buffers[0].byteLength <= 3, 'Embedded buffer length differs from its declaration');
  report.generator = gltf.asset.generator;
  report.chunks = chunks.map(({ type, length }) => ({ type: type.toString(16), bytes: length }));
  check('GLB header, chunk order and byte lengths', true);

  const componentInfo = {
    5120: { bytes: 1, read: 'getInt8', signedMax: 127 },
    5121: { bytes: 1, read: 'getUint8', unsignedMax: 255 },
    5122: { bytes: 2, read: 'getInt16', signedMax: 32767 },
    5123: { bytes: 2, read: 'getUint16', unsignedMax: 65535 },
    5125: { bytes: 4, read: 'getUint32', unsignedMax: 4294967295 },
    5126: { bytes: 4, read: 'getFloat32' },
  };
  const typeInfo = { SCALAR: [1, 1], VEC2: [1, 2], VEC3: [1, 3], VEC4: [1, 4], MAT2: [2, 2], MAT3: [3, 3], MAT4: [4, 4] };
  const dataView = new DataView(bin.buffer, bin.byteOffset, bin.byteLength);
  const accessorCache = new Map();
  const decode = index => {
    if (accessorCache.has(index)) return accessorCache.get(index);
    const accessor = gltf.accessors[index];
    assert(accessor, `Missing accessor ${index}`);
    assert(!accessor.sparse, `Accessor ${index} uses sparse data; this asset verifier requires dense export`);
    const view = gltf.bufferViews[accessor.bufferView], component = componentInfo[accessor.componentType];
    const shape = typeInfo[accessor.type];
    assert(view && view.buffer === 0 && component && shape, `Accessor ${index} has unsupported layout`);
    const [columns, rows] = shape;
    const columnBytes = columns > 1 ? Math.ceil(rows * component.bytes / 4) * 4 : rows * component.bytes;
    const elementBytes = columns * columnBytes, stride = view.byteStride ?? elementBytes;
    const localOffset = accessor.byteOffset ?? 0, viewOffset = view.byteOffset ?? 0;
    assert(stride >= elementBytes && stride % component.bytes === 0, `Accessor ${index} has invalid stride`);
    assert(localOffset % component.bytes === 0 && (viewOffset + localOffset) % component.bytes === 0, `Accessor ${index} has invalid component alignment`);
    assert(Number.isInteger(accessor.count) && accessor.count > 0, `Accessor ${index} has invalid element count`);
    assert(localOffset + (accessor.count - 1) * stride + elementBytes <= view.byteLength, `Accessor ${index} exceeds its buffer view`);
    assert(viewOffset + view.byteLength <= gltf.buffers[0].byteLength, `Accessor ${index} exceeds embedded data`);
    const components = columns * rows;
    const values = new Float64Array(accessor.count * components);
    let nonFinite = 0;
    for (let element = 0; element < accessor.count; element++) {
      for (let column = 0; column < columns; column++) for (let row = 0; row < rows; row++) {
        const offset = viewOffset + localOffset + element * stride + column * columnBytes + row * component.bytes;
        let value = dataView[component.read](offset, true);
        if (accessor.normalized) value = component.signedMax ? Math.max(-1, value / component.signedMax) : value / component.unsignedMax;
        if (!Number.isFinite(value)) nonFinite++;
        values[element * components + column * rows + row] = value;
      }
    }
    const decoded = { values, count: accessor.count, components, nonFinite, componentType: accessor.componentType, type: accessor.type };
    accessorCache.set(index, decoded);
    return decoded;
  };
  let nonFinite = 0, scalarValues = 0;
  for (let index = 0; index < gltf.accessors.length; index++) {
    const accessor = decode(index);nonFinite += accessor.nonFinite;scalarValues += accessor.values.length;
  }
  check('All accessor bytes stay in range and values are finite', nonFinite === 0, { accessorCount: gltf.accessors.length, scalarValues, nonFinite });

  const skin = gltf.skins?.[0];
  assert(skin && gltf.skins.length === 1, 'Expected one character skin');
  const jointNames = skin.joints.map(index => gltf.nodes[index]?.name);
  const rigNames = rig.bones.map(bone => bone.name);
  check('Twenty GLB joints exactly match coach-rig.json names and order', jointNames.length === 20 && rig.boneCount === 20 && rigNames.length === 20 && jointNames.every((name, index) => name === rigNames[index]) && new Set(jointNames).size === 20, { jointNames });
  report.jointCount = jointNames.length;

  const parents = new Map(), worldCache = new Map();
  for (let index = 0; index < gltf.nodes.length; index++) for (const child of gltf.nodes[index].children ?? []) {
    assert(!parents.has(child), `Node ${child} has multiple parents`);parents.set(child, index);
  }
  const world = (index, visiting = new Set()) => {
    if (worldCache.has(index)) return worldCache.get(index);
    assert(!visiting.has(index), 'Node hierarchy contains a cycle');visiting.add(index);
    const local = nodeMatrix(gltf.nodes[index]);
    assert(local.length === 16 && local.every(Number.isFinite), `Node ${index} transform is non-finite`);
    const result = parents.has(index) ? multiply(world(parents.get(index), visiting), local) : local;
    visiting.delete(index);worldCache.set(index, result);return result;
  };
  const inverseBinds = decode(skin.inverseBindMatrices);
  assert(inverseBinds.type === 'MAT4' && inverseBinds.count === jointNames.length, 'Inverse-bind matrix count/type differs from skeleton');
  let maxPivotError = 0, maxRestBindError = 0;
  const jointPivots = [];
  for (let joint = 0; joint < jointNames.length; joint++) {
    const matrix = world(skin.joints[joint]), actual = matrix.slice(12, 15), expected = rig.bones[joint].pivot;
    assert(expected?.length === 3 && expected.every(Number.isFinite), `Rig pivot ${jointNames[joint]} is invalid`);
    const pivotError = Math.hypot(...actual.map((value, axis) => value - expected[axis]));
    maxPivotError = Math.max(maxPivotError, pivotError);
    const rest = multiply(matrix, Array.from(inverseBinds.values.subarray(joint * 16, joint * 16 + 16)));
    const bindError = Math.max(...rest.map((value, index) => Math.abs(value - identity()[index])));
    maxRestBindError = Math.max(maxRestBindError, bindError);
    jointPivots.push({ name: jointNames[joint], actual, expected, errorMeters: pivotError, restBindError: bindError });
  }
  check('GLB world joint pivots match rig JSON', maxPivotError <= 1e-5, { maxErrorMeters: maxPivotError });
  check('Inverse binds reproduce identity in exported rest pose', maxRestBindError <= 1e-5, { maxError: maxRestBindError });
  report.jointPivots = jointPivots;

  let vertices = 0, triangles = 0, indexCount = 0, invalidIndices = 0, invalidJointIndices = 0;
  let invalidWeights = 0, maxWeightSumError = 0, badWeightSums = 0, nonUnitNormals = 0;
  let minNormalLength = Infinity, maxNormalLength = -Infinity;
  const primitives = [], materialUse = new Map();
  const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
  for (let meshIndex = 0; meshIndex < gltf.meshes.length; meshIndex++) {
    const mesh = gltf.meshes[meshIndex];
    for (let primitiveIndex = 0; primitiveIndex < mesh.primitives.length; primitiveIndex++) {
      const primitive = mesh.primitives[primitiveIndex];
      assert((primitive.mode ?? 4) === 4, `Mesh ${meshIndex} uses a non-triangle primitive`);
      const position = decode(primitive.attributes.POSITION), normal = decode(primitive.attributes.NORMAL);
      const joints = decode(primitive.attributes.JOINTS_0), weights = decode(primitive.attributes.WEIGHTS_0), indices = decode(primitive.indices);
      assert(position.components === 3 && normal.components === 3 && joints.components === 4 && weights.components === 4, `Mesh ${meshIndex} has invalid attribute types`);
      assert(normal.count === position.count && joints.count === position.count && weights.count === position.count, `Mesh ${meshIndex} has mismatched vertex counts`);
      assert(indices.components === 1 && indices.count % 3 === 0 && [5121, 5123, 5125].includes(indices.componentType), `Mesh ${meshIndex} has invalid triangle indices`);
      assert(!('WEIGHTS_1' in primitive.attributes) && !('JOINTS_1' in primitive.attributes), `Mesh ${meshIndex} exceeds the four-influence binding used by the viewer`);
      let primitiveMaxWeightError = 0, maxIndex = -1;
      for (let vertex = 0; vertex < position.count; vertex++) {
        for (let axis = 0; axis < 3; axis++) { const value = position.values[vertex * 3 + axis];bounds.min[axis] = Math.min(bounds.min[axis], value);bounds.max[axis] = Math.max(bounds.max[axis], value); }
        const normalLength = Math.hypot(...normal.values.subarray(vertex * 3, vertex * 3 + 3));
        minNormalLength = Math.min(minNormalLength, normalLength);maxNormalLength = Math.max(maxNormalLength, normalLength);
        if (Math.abs(normalLength - 1) > 1e-3) nonUnitNormals++;
        let weightSum = 0;
        for (let influence = 0; influence < 4; influence++) {
          const offset = vertex * 4 + influence, joint = joints.values[offset], weight = weights.values[offset];
          if (!Number.isInteger(joint) || joint < 0 || joint >= jointNames.length) invalidJointIndices++;
          if (weight < 0 || weight > 1 || !Number.isFinite(weight)) invalidWeights++;
          weightSum += weight;
        }
        const sumError = Math.abs(weightSum - 1);primitiveMaxWeightError = Math.max(primitiveMaxWeightError, sumError);
        if (sumError > 1e-4) badWeightSums++;
      }
      for (const index of indices.values) { maxIndex = Math.max(maxIndex, index);if (!Number.isInteger(index) || index < 0 || index >= position.count) invalidIndices++; }
      maxWeightSumError = Math.max(maxWeightSumError, primitiveMaxWeightError);
      vertices += position.count;indexCount += indices.count;triangles += indices.count / 3;
      materialUse.set(primitive.material, (materialUse.get(primitive.material) ?? 0) + indices.count / 3);
      primitives.push({ meshIndex, mesh: mesh.name, primitiveIndex, material: gltf.materials[primitive.material]?.name, vertices: position.count, triangles: indices.count / 3, maxIndex, maxWeightSumError: primitiveMaxWeightError });
    }
  }
  check('Triangle indices stay inside each primitive vertex array', invalidIndices === 0, { invalidIndices, indexCount });
  check('All four joint indices stay inside the twenty-joint skeleton', invalidJointIndices === 0, { invalidJointIndices });
  check('All weights are finite, nonnegative and sum to one', invalidWeights === 0 && badWeightSums === 0, { verticesChecked: vertices, influencesPerVertex: 4, tolerance: 1e-4, maxWeightSumError, badWeightSums, invalidWeights });
  check('Exported normals have unit length', nonUnitNormals === 0, { minLength: minNormalLength, maxLength: maxNormalLength, tolerance: 1e-3, nonUnitNormals });
  const meshNodes = gltf.nodes.filter(node => node.mesh !== undefined);
  check('Every mesh instance uses the verified character skin', meshNodes.every(node => node.skin === 0), { meshInstances: meshNodes.length });
  Object.assign(report, { meshCount: gltf.meshes.length, meshInstances: meshNodes.length, primitiveCount: primitives.length, vertexCount: vertices, indexCount, triangles, restPositionBounds: bounds, primitives });

  report.materials = gltf.materials.map((material, index) => ({ index, name: material.name, colorLinear: material.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1], triangles: materialUse.get(index) ?? 0 }));
  const eyeWhite = report.materials.find(material => /eye white|sclera/i.test(material.name));
  const iris = report.materials.find(material => /iris/i.test(material.name));
  const pupil = report.materials.find(material => /pupil/i.test(material.name));
  const eyeMaterials = [eyeWhite, iris, pupil];
  const colorsDiffer = eyeMaterials.every(Boolean) && new Set(eyeMaterials.map(material => JSON.stringify(material.colorLinear))).size === 3;
  check('Eye white, iris and pupil use distinct materials on actual triangles', colorsDiffer && eyeMaterials.every(material => material.triangles > 0), { eyeWhite, iris, pupil });
  report.imageCount = gltf.images?.length ?? 0;
  report.textureCount = gltf.textures?.length ?? 0;
  const resourceUris = [...(gltf.buffers ?? []), ...(gltf.images ?? [])].map(resource => resource.uri).filter(Boolean);
  report.externalResources = resourceUris.filter(uri => !uri.startsWith('data:'));
  report.remoteResources = resourceUris.filter(uri => /^(https?:)?\/\//i.test(uri));
  check('All resources are embedded; no local or remote texture files are required', report.externalResources.length === 0, { imageCount: report.imageCount, textureCount: report.textureCount, externalResources: report.externalResources, remoteResources: report.remoteResources });
} catch (error) {
  report.errors.push(error.message);
}

report.passed = report.errors.length === 0;
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ passed: report.passed, fileBytes: report.fileBytes, meshCount: report.meshCount, primitiveCount: report.primitiveCount, triangles: report.triangles, vertexCount: report.vertexCount, jointCount: report.jointCount, checks: report.checks.length, errors: report.errors, report: reportPath }, null, 2));
process.exitCode = report.passed ? 0 : 1;
