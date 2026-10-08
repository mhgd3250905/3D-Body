import * as THREE from 'three';
import * as MM from './legacy/muscle-map.js';
import { GROUPS } from './phase.js';

// Adapted from the package's mmRest.ts. The attribute is attached to the
// original Snow vertices. It is a teaching map, not an anatomical registration.
const Q = {
  shoulder: [0.19, 1.36, -0.005], elbow: [0.29, 1.085, -0.005], wrist: [0.365, 0.875, 0.02], palm: [0.39, 0.80, 0.04],
  hip: [0.09, 0.86, 0], knee: [0.12, 0.47, 0], ankle: [0.15, 0.08, -0.02], toe: [0.17, 0.03, 0.13],
};
const SEG = {
  UpperArm: ['Shoulder', 'Elbow', 'shoulder', 'elbow'], Forearm: ['Elbow', 'Wrist', 'elbow', 'wrist'], Hand: ['Wrist', 'Palm', 'wrist', 'palm'],
  Thigh: ['Hip', 'Knee', 'hip', 'knee'], Patella: ['Knee', 'Ankle', 'knee', 'ankle'], Shin: ['Knee', 'Ankle', 'knee', 'ankle'], Foot: ['Ankle', 'Toe', 'ankle', 'toe'],
};

export function buildMmRest(motion, coach) {
  const savedTime = motion.getMetrics().time; motion.reset(); coach.updateMatrixWorld(true);
  const joints = motion.getMetrics().joints, mappings = {};
  const landmark = (name, side) => new THREE.Vector3(side === 'left' ? Q[name][0] : -Q[name][0], Q[name][1], Q[name][2]);
  for (const side of ['left', 'right']) for (const [bone, [a, b, qa, qb]] of Object.entries(SEG)) {
    const P0 = new THREE.Vector3().fromArray(joints[side + a]), P1 = new THREE.Vector3().fromArray(joints[side + b]);
    const Q0 = landmark(qa, side), Q1 = landmark(qb, side);
    mappings[side + bone] = {
      P0, Q0, rotation: new THREE.Quaternion().setFromUnitVectors(P1.clone().sub(P0).normalize(), Q1.clone().sub(Q0).normalize()),
      scale: Q1.distanceTo(Q0) / P1.distanceTo(P0),
    };
  }
  const skinned = [], tmp = new THREE.Vector3(), acc = new THREE.Vector3(), mapped = new THREE.Vector3();
  const indices = new THREE.Vector4(), weights = new THREE.Vector4();
  coach.traverse(mesh => {
    if (!mesh.isSkinnedMesh) return;
    const geometry = mesh.geometry, count = geometry.attributes.position.count, output = new Float32Array(count * 3);
    const si = geometry.attributes.skinIndex, sw = geometry.attributes.skinWeight, bones = mesh.skeleton.bones;
    mesh.skeleton.update();
    for (let i = 0; i < count; i++) {
      mesh.getVertexPosition(i, tmp).applyMatrix4(mesh.matrixWorld);
      indices.fromBufferAttribute(si, i); weights.fromBufferAttribute(sw, i); acc.set(0, 0, 0); let total = 0;
      for (let k = 0; k < 4; k++) {
        const weight = weights.getComponent(k); if (weight <= 0) continue;
        const map = mappings[bones[indices.getComponent(k)]?.name];
        if (map) mapped.copy(tmp).sub(map.P0).applyQuaternion(map.rotation).multiplyScalar(map.scale).add(map.Q0);
        else mapped.copy(tmp);
        acc.addScaledVector(mapped, weight); total += weight;
      }
      acc.multiplyScalar(1 / (total || 1)); acc.toArray(output, i * 3);
    }
    geometry.setAttribute('mmRest', new THREE.BufferAttribute(output, 3)); skinned.push(mesh);
  });
  motion.update(savedTime); coach.updateMatrixWorld(true); return skinned;
}

const PANEL_GROUPS = {};
for (const [groupId, definition] of Object.entries(MM.GROUP_MUSCLES)) {
  if (!GROUPS[groupId]) continue;
  for (const panel of definition.muscles) (PANEL_GROUPS[panel] ??= []).push(groupId);
}

export function createHitTester(player, skinned) {
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const bary = new THREE.Vector3(), triangle = new THREE.Triangle(), restPoint = new THREE.Vector3(), temp = new THREE.Vector3();
  let preparedTime = null;
  function prepare() {
    player.coach.updateMatrixWorld(true);
    for (const mesh of skinned) { mesh.skeleton.update(); mesh.computeBoundingSphere(); mesh.computeBoundingBox(); }
    preparedTime = player.time;
  }
  function pick(x, y, phaseItems) {
    if (preparedTime !== player.time) prepare();
    const rect = player.renderer.domElement.getBoundingClientRect();
    ndc.set((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1); ray.setFromCamera(ndc, player.camera);
    const hits = ray.intersectObjects(skinned.filter(mesh => mesh.visible), false);
    for (const hit of hits) {
      const mesh = hit.object, face = hit.face, rest = mesh.geometry.getAttribute('mmRest'); if (!face || !rest) continue;
      mesh.getVertexPosition(face.a, a).applyMatrix4(mesh.matrixWorld);
      mesh.getVertexPosition(face.b, b).applyMatrix4(mesh.matrixWorld);
      mesh.getVertexPosition(face.c, c).applyMatrix4(mesh.matrixWorld);
      if (!triangle.set(a, b, c).getBarycoord(hit.point, bary)) continue;
      restPoint.fromBufferAttribute(rest, face.a).multiplyScalar(bary.x);
      restPoint.addScaledVector(temp.fromBufferAttribute(rest, face.b), bary.y).addScaledVector(temp.fromBufferAttribute(rest, face.c), bary.z);
      const muscle = MM.muscleAt(restPoint, 1.69); if (!muscle) continue;
      const candidates = PANEL_GROUPS[muscle.id] ?? [];
      const inPhase = candidates.map(group => phaseItems.find(item => item.groupId === group && (item.side === 'both' || item.side === muscle.side))).find(Boolean);
      const groupId = inPhase?.groupId ?? candidates[0];
      if (groupId) return { groupId, side: muscle.side, panelId: muscle.id, inPhase: !!inPhase };
    }
    return null;
  }
  return { pick, prepare };
}

export function createSurfaceSelection(skinned) {
  const uniforms = MM.createMuscleUniforms(), originals = new Map(), mapped = new Map();
  uniforms.mmMulti.value = 1; uniforms.mmReveal.value = 1; uniforms.mmTime.value = 0.654;
  uniforms.mmBase.value.set('#737b88'); uniforms.mmSkin.value.set('#59606c'); uniforms.mmGroove.value.set('#2b313c');
  for (const mesh of skinned) {
    originals.set(mesh, mesh.material);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.68, metalness: 0 });
    MM.applyMuscleMap(material, uniforms, { clothing: false }); const base = material.onBeforeCompile;
    material.onBeforeCompile = (shader, renderer) => {
      base(shader, renderer);
      shader.vertexShader = 'attribute vec3 mmRest;\n' + shader.vertexShader.replace('vMmPos = transformed;', 'vMmPos = mmRest;');
      // Color panels are a surface cue; avoid introducing a sculpted muscle bulge.
      shader.fragmentShader = shader.fragmentShader.replace('vec2(dFdx(h), dFdy(h)) * 0.004', 'vec2(0.0)');
    };
    material.customProgramCacheKey = () => 'flare-posed-functional-surface-v1'; mapped.set(mesh, material);
  }
  function show(groupId, items, detail = false) {
    if (!groupId) { restore(); return; }
    const phaseItems = [...items];
    if (!phaseItems.some(item => item.groupId === groupId)) phaseItems.push({ groupId, level: 'primary', side: 'both', colour: GROUPS[groupId].colour });
    const selection = [];
    for (const item of phaseItems) {
      if (!detail && item.groupId !== groupId) continue;
      const group = MM.resolveGroup(item.groupId); if (!group) continue;
      for (const muscle of group.muscles) selection.push({ muscle, side: item.side, colour: item.colour,
        level: group.deep && item.level === 'primary' ? 'deep' : item.level,
        dim: item.groupId === groupId ? 0 : item.level === 'primary' ? 0.45 : 0.7 });
    }
    MM.setMuscleSelection(uniforms, selection); MM.setMuscleFocus(uniforms, MM.resolveGroup(groupId)?.muscles ?? []);
    for (const [mesh, material] of mapped) mesh.material = material;
  }
  function restore() { for (const [mesh, material] of originals) mesh.material = material; }
  return { show, restore,
    releaseGpu() { for (const material of new Set([...originals.values()].flat())) material.dispose(); for (const material of mapped.values()) material.dispose(); },
    dispose() { restore(); for (const material of mapped.values()) material.dispose(); } };
}
