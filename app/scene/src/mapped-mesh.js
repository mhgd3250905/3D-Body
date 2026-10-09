import * as THREE from 'three';
import * as MM from './legacy/muscle-map.js';
import { GROUPS } from './phase.js';
import { CORE_BONES, createCoreMapping } from './core-mapping.js';
import { isCoveredActorPart } from './study-body.js';

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

// Teaching-frame guards (metres, 1.69 m reference body). Hip flexors and
// adductors fade out at the groin, and hands never carry a tint; the upright
// reference shows the complete regions.
function surfaceGuard(x, y) {
  const ax = Math.abs(x);
  const across = 1 - THREE.MathUtils.smoothstep(ax, 0.07, 0.12);
  const along = THREE.MathUtils.smoothstep(y, 0.66, 0.72) * (1 - THREE.MathUtils.smoothstep(y, 0.90, 0.96));
  const hand = THREE.MathUtils.smoothstep(ax, 0.33, 0.36) * (1 - THREE.MathUtils.smoothstep(y, 0.88, 0.92));
  return (1 - across * along) * (1 - hand);
}

const FOCUS_CHUNK = `{ float flareW = smoothstep(0.12, 0.75, vFocusW);
  float flareDark = 1.0 - smoothstep(0.02, 0.25, dot(diffuseColor.rgb, vec3(0.333)));
  flareFocusGlow = focusTint * flareW * mix(0.06, 0.30, flareDark);
  diffuseColor.rgb = mix(diffuseColor.rgb, focusTint, flareW * mix(0.78, 0.62, flareDark)); }`;

function focusMaterial(material, tint) {
  // A detail-only proxy: same type, maps and authored values as the
  // original; only the shader adds a soft group-coloured tint.
  const copy = material.clone(), compile = material.onBeforeCompile;
  copy.userData = { ...material.userData, flareFocusProxyOf: material.uuid };
  copy.onBeforeCompile = (shader, renderer) => {
    compile?.call(copy, shader, renderer); shader.uniforms.focusTint = tint;
    shader.vertexShader = 'attribute float focusW;\nvarying float vFocusW;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvFocusW = focusW;');
    let fragment = 'uniform vec3 focusTint;\nvarying float vFocusW;\n' + shader.fragmentShader;
    fragment = fragment.replace('void main() {', 'void main() {\nvec3 flareFocusGlow = vec3(0.0);');
    fragment = fragment.replace('#include <color_fragment>', '#include <color_fragment>\n' + FOCUS_CHUNK);
    fragment = fragment.includes('#include <emissivemap_fragment>')
      ? fragment.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += flareFocusGlow;')
      : fragment;
    shader.fragmentShader = fragment;
  };
  copy.customProgramCacheKey = () => 'flare-motion-focus-v3-' + (material.customProgramCacheKey?.() ?? '') + material.type;
  return copy;
}

export function createSurfaceSelection(skinned) {
  // Home selection never changes the athlete's appearance. Detail only: a
  // soft functional tint painted over the athlete's own clothes and skin.
  // Face, hair, hands and shoes are never tinted, no garment is hidden and the
  // mesh, rig, motion and visibility are unchanged. Restore returns the
  // original material objects.
  const originals = new Map(skinned.map(mesh => [mesh, mesh.material]));
  const painted = new Map(), point = new THREE.Vector3(), tint = { value: new THREE.Color('#ff6a3d') };
  let active = false, selectedGroup = null, selectedPanels = [], selectedSide = 0;
  for (const mesh of skinned) {
    if (!isCoveredActorPart(mesh)) continue;
    const geometry = mesh.geometry, rest = geometry.getAttribute('mmRest'), count = rest.count;
    const panel = new Int16Array(count).fill(-1), side = new Int8Array(count), guard = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      point.fromBufferAttribute(rest, i); guard[i] = surfaceGuard(point.x, point.y);
      const hit = MM.muscleAt(point, 1.69);
      if (hit) { panel[i] = MM.MUSCLES.indexOf(MM.MUSCLE_BY_ID[hit.id]); side[i] = hit.side === 'left' ? 1 : -1; }
    }
    // Vertex neighbours via the index buffer, welded across UV seams by position.
    const key = new Map(), weld = new Int32Array(count), pos = geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const k = Math.round(pos.getX(i) * 2e3) + ',' + Math.round(pos.getY(i) * 2e3) + ',' + Math.round(pos.getZ(i) * 2e3);
      if (!key.has(k)) key.set(k, i); weld[i] = key.get(k);
    }
    const index = geometry.index.array, edges = new Int32Array(index.length * 2);
    for (let t = 0, e = 0; t < index.length; t += 3) for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) { edges[e++] = weld[index[t + a]]; edges[e++] = weld[index[t + b]]; }
    const attribute = new THREE.BufferAttribute(new Float32Array(count), 1); geometry.setAttribute('focusW', attribute);
    const material = Array.isArray(mesh.material) ? mesh.material.map(m => focusMaterial(m, tint)) : focusMaterial(mesh.material, tint);
    painted.set(mesh, { panel, side, guard, edges, weld, attribute, material });
  }
  function show(groupId, items, detail = false) {
    restore(); if (!groupId || !detail || !GROUPS[groupId]) return;
    // The highlight wears the group's own colour, matching the home map and legend.
    tint.value.set(GROUPS[groupId].colour ?? '#ff6a3d');
    const panels = new Set((MM.resolveGroup(groupId)?.muscles ?? []).map(id => MM.MUSCLES.indexOf(MM.MUSCLE_BY_ID[id])));
    const item = items.find(value => value.groupId === groupId), wanted = item?.side === 'left' ? 1 : item?.side === 'right' ? -1 : 0;
    selectedGroup = groupId; selectedPanels = [...panels].sort((a, b) => a - b); selectedSide = wanted;
    for (const [mesh, data] of painted) {
      const { panel, side, guard, edges, weld, attribute } = data, count = panel.length;
      let w = new Float32Array(count);
      for (let i = 0; i < count; i++) w[i] = panels.has(panel[i]) && (!wanted || side[i] === wanted) ? 1 : 0;
      // Feather along the surface: neighbour-averaging passes on welded vertices.
      const sum = new Float32Array(count), n = new Float32Array(count);
      for (let pass = 0; pass < 5; pass++) {
        sum.fill(0); n.fill(0);
        for (let e = 0; e < edges.length; e += 2) { const a = edges[e], b = edges[e + 1]; sum[a] += w[b]; n[a]++; sum[b] += w[a]; n[b]++; }
        const next = new Float32Array(count);
        for (let i = 0; i < count; i++) next[i] = n[i] ? (w[i] + sum[i]) / (1 + n[i]) : w[i];
        w = next;
      }
      for (let i = 0; i < count; i++) attribute.array[i] = w[weld[i]] * guard[i];
      attribute.needsUpdate = true; mesh.material = data.material;
    }
    active = true;
  }
  // Camera direction facing the tinted surface in the current pose: area- and
  // weight-averaged posed normals, lifted to a gentle elevation and never
  // looking up from below. Null when nothing is tinted.
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), ab = new THREE.Vector3(), ac = new THREE.Vector3();
  function focusDirection() {
    if (!active) return null;
    const sum = new THREE.Vector3(); let total = 0;
    for (const [mesh, data] of painted) {
      const weights = data.attribute.array, index = mesh.geometry.index.array; mesh.skeleton.update();
      for (let t = 0; t < index.length; t += 3) {
        const w = (weights[index[t]] + weights[index[t + 1]] + weights[index[t + 2]]) / 3; if (w < 0.1) continue;
        mesh.getVertexPosition(index[t], a).applyMatrix4(mesh.matrixWorld);
        mesh.getVertexPosition(index[t + 1], b).applyMatrix4(mesh.matrixWorld);
        mesh.getVertexPosition(index[t + 2], c).applyMatrix4(mesh.matrixWorld);
        ab.subVectors(b, a); ac.subVectors(c, a); sum.addScaledVector(ab.cross(ac), w * 0.5); total += w;
      }
    }
    if (!total || sum.lengthSq() < 1e-12) return null;
    const d = sum.normalize(); d.y = Math.max(0.12, Math.min(0.55, d.y + 0.15));
    return d.normalize();
  }
  function restore() {
    for (const [mesh, material] of originals) mesh.material = material;
    active = false; selectedGroup = null; selectedPanels = []; selectedSide = 0;
  }
  const proxies = () => [...painted.values()].flatMap(data => [].concat(data.material));
  return { show, restore, focusDirection, isProxy: material => proxies().includes(material),
    getState: () => ({ active, groupId: selectedGroup, selectedPanels: [...selectedPanels], side: selectedSide,
      colour: '#' + tint.value.getHexString(), appearance: 'original-outfit-detail-proxy' }),
    releaseGpu() { for (const material of new Set([...originals.values()].flat())) material.dispose(); for (const m of proxies()) m.dispose(); },
    dispose() { restore(); for (const m of proxies()) m.dispose(); } };
}
