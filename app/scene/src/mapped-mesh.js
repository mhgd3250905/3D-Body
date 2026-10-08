import * as THREE from 'three';
import * as MM from './legacy/muscle-map.js';
import { GROUPS } from './phase.js';
import { CORE_BONES, createCoreMapping } from './core-mapping.js';
import { applyFunctionalSurface, setFunctionalFocus } from './muscle-material.js';
import { isCoveredActorPart, isOriginalActorHeadPart } from './study-body.js';

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
  const joints = motion.getMetrics().joints, mappings = {}, mapCore = createCoreMapping(joints);
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
        const bone = bones[indices.getComponent(k)]?.name, map = mappings[bone];
        if (map) mapped.copy(tmp).sub(map.P0).applyQuaternion(map.rotation).multiplyScalar(map.scale).add(map.Q0);
        else if (CORE_BONES.has(bone)) mapCore(tmp, mapped);
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
  const originals = new Map(skinned.map(mesh => [mesh, { material: mesh.material, visible: mesh.visible }]));
  const uniforms = MM.createMuscleUniforms(), mapped = new Map();
  uniforms.mmMulti.value = 1; uniforms.mmReveal.value = 1; uniforms.mmTime.value = 0.654;
  for (const mesh of skinned) {
    // Render the retained same-source neutral mannequin only in detail. Home
    // and playback restore the exact original garment and face materials.
    const material = new THREE.MeshPhysicalMaterial({ color: '#d3c7ad', roughness: 0.82, metalness: 0,
      clearcoat: 0.02, clearcoatRoughness: 0.72, specularIntensity: 0.35, ior: 1.46 });
    if (mesh.userData.studySkin) applyFunctionalSurface(material, uniforms, { posed: true });
    mapped.set(mesh, material);
  }
  function restore() { for (const [mesh, saved] of originals) { mesh.material = saved.material; mesh.visible = saved.visible; } }
  function show(groupId, items, detail = false) {
    if (!groupId || !detail) { restore(); return; }
    const group = MM.resolveGroup(groupId), side = items.find(item => item.groupId === groupId)?.side ?? 'both';
    MM.setMuscleSelection(uniforms, (group?.muscles ?? []).map(muscle => ({ muscle, side,
      colour: '#e58b90', level: group.deep ? 'deep' : 'primary', dim: 0 })));
    setFunctionalFocus(uniforms, group?.muscles ?? [], side);
    for (const [mesh, material] of mapped) {
      mesh.material = material;
      if (mesh.userData.studySkin || mesh.userData.studyHead) mesh.visible = true;
      else if (isCoveredActorPart(mesh) || isOriginalActorHeadPart(mesh)) mesh.visible = false;
    }
  }
  return { show, restore, getState: () => ({ selectedPanels: uniforms.mmState.value.map((value, index) => value.z ? index : -1).filter(index => index >= 0),
    side: uniforms.mmFocusSide?.value ?? 0, colour: '#e58b90', base: '#d3c7ad' }),
    releaseGpu() { for (const material of new Set([...originals.values()].flatMap(value => [].concat(value.material)))) material.dispose(); for (const material of mapped.values()) material.dispose(); },
    dispose() { restore(); for (const material of mapped.values()) material.dispose(); } };
}
