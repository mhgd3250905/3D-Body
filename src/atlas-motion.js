import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Animation pivots measured from the actual optimized BodyParts3D surfaces.
// The anatomy vertices remain unchanged; all animation matrices are rigid.
const LANDMARKS = {
  pelvis: [-0.000014257, 0.889518662, -0.021105250],
  torso: [-0.000359724, 1.394295644, -0.025401269],
  neck: [-0.000648850, 1.456386200, -0.044350850],
  head: [-0.000566950, 1.549931200, -0.035880000],
  leftShoulder: [0.159616246, 1.394403492, -0.025393758],
  leftElbow: [0.208854504, 1.119891226, -0.032062050],
  leftWrist: [0.251132000, 0.888700700, 0.015400250],
  leftHip: [0.087150760, 0.889517472, -0.021093951],
  leftKnee: [0.072426798, 0.466107696, -0.018745149],
  leftAnkle: [0.069522349, 0.076612590, -0.024839150],
  rightShoulder: [-0.160335694, 1.394187796, -0.025408780],
  rightElbow: [-0.209233001, 1.119901240, -0.032266649],
  rightWrist: [-0.251011498, 0.888615200, 0.015330250],
  rightHip: [-0.087179275, 0.889519852, -0.021116548],
  rightKnee: [-0.072328148, 0.466180697, -0.018943500],
  rightAnkle: [-0.069627099, 0.076648085, -0.024919900],
};
const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, 1);
const UNIT_SCALE = new THREE.Vector3(1, 1, 1);
const clamp = THREE.MathUtils.clamp;
const smooth = THREE.MathUtils.smoothstep;
const point = values => new THREE.Vector3().fromArray(values);

function armIK(start, target, upper, lower, pole) {
  const delta = target.clone().sub(start);
  const distance = clamp(delta.length(), Math.abs(upper - lower) + 0.00001, upper + lower - 0.00001);
  const direction = delta.normalize();
  const along = (upper * upper - lower * lower + distance * distance) / (2 * distance);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  const bend = pole.clone().sub(start);
  bend.addScaledVector(direction, -bend.dot(direction));
  if (bend.lengthSq() < 1e-10) bend.copy(FORWARD).addScaledVector(direction, -direction.z);
  bend.normalize();
  return { elbow: start.clone().addScaledVector(direction, along).addScaledVector(bend, height), wrist: start.clone().addScaledVector(direction, distance) };
}

function rotationFor(restDirection, targetDirection, bodyRotation) {
  const from = restDirection.clone().normalize().applyQuaternion(bodyRotation);
  const to = targetDirection.clone().normalize();
  return new THREE.Quaternion().setFromUnitVectors(from, to).multiply(bodyRotation);
}

function flightFor(angle, side) {
  const start = side === 'right' ? 0.30 : Math.PI + 0.30;
  const end = side === 'right' ? Math.PI - 0.30 : Math.PI * 2 - 0.30;
  if (angle <= start || angle >= end) return 0;
  const value = Math.sin(Math.PI * (angle - start) / (end - start)) ** 2;
  return value < 0.0001 ? 0 : value;
}

function capBounds(box, matrix, target) {
  if (box.isEmpty()) return;
  const vertex = new THREE.Vector3();
  for (let corner = 0; corner < 8; corner++) {
    vertex.set(corner & 1 ? box.max.x : box.min.x, corner & 2 ? box.max.y : box.min.y, corner & 4 ? box.max.z : box.min.z).applyMatrix4(matrix);
    target.expandByPoint(vertex);
  }
}

export function createAtlasMotion({ parts, skinParts = [], driver, materials }) {
  if (!parts?.length || !driver?.getMetrics) throw new Error('Anatomy meshes and a movement driver are required.');
  const group = new THREE.Group();
  group.name = 'BodyParts3D articulated anatomy';
  group.userData.source = 'BodyParts3D 4.0';
  group.userData.automaticallyBound = true;
  const rest = Object.fromEntries(Object.entries(LANDMARKS).map(([name, values]) => [name, point(values)]));
  const byName = new Map(parts.map(mesh => [mesh.userData.part.name.toLowerCase(), mesh.userData.part]));
  const boundsCenter = name => {
    const part = byName.get(name.toLowerCase());
    return part ? point(part.bounds[0]).add(point(part.bounds[1])).multiplyScalar(0.5) : null;
  };
  const sideNames = ['left', 'right'];
  const limb = {};
  for (const side of sideNames) {
    const palm = boundsCenter(`${side} third metacarpal bone`) ?? rest[`${side}Wrist`].clone().add(new THREE.Vector3(0, -0.060, 0));
    const tip = boundsCenter(`Distal phalanx of ${side} middle finger`) ?? palm.clone().add(new THREE.Vector3(0, -0.09, 0));
    const finger = tip.clone().sub(palm).normalize();
    const normal = FORWARD.clone().addScaledVector(finger, -finger.z).normalize();
    const width = new THREE.Vector3().crossVectors(finger, normal).normalize();
    const restHandFrame = new THREE.Matrix4().makeBasis(width, finger, normal);
    const targetFinger = new THREE.Vector3(0, 0, -1), targetNormal = new THREE.Vector3(0, -1, 0);
    const targetWidth = new THREE.Vector3().crossVectors(targetFinger, targetNormal);
    const targetHandFrame = new THREE.Matrix4().makeBasis(targetWidth, targetFinger, targetNormal);
    const supportRotation = new THREE.Quaternion().setFromRotationMatrix(targetHandFrame.multiply(restHandFrame.clone().invert()));
    const footCenter = boundsCenter(`${side} third metatarsal bone`) ?? rest[`${side}Ankle`].clone().add(FORWARD.clone().multiplyScalar(0.09));
    const footDirection = footCenter.clone().sub(rest[`${side}Ankle`]);
    limb[side] = {
      upperArm: rest[`${side}Shoulder`].distanceTo(rest[`${side}Elbow`]),
      forearm: rest[`${side}Elbow`].distanceTo(rest[`${side}Wrist`]),
      thigh: rest[`${side}Hip`].distanceTo(rest[`${side}Knee`]),
      shin: rest[`${side}Knee`].distanceTo(rest[`${side}Ankle`]),
      palm, finger, normal, supportRotation,
      footYaw: Math.atan2(footDirection.x, footDirection.z),
      handLow: Infinity, anchor: new THREE.Vector3(side === 'left' ? 0.21 : -0.21, 0.04, 0),
      flight: 0, support: true,
    };
  }

  const descriptors = [];
  const index = {};
  function addBone(name, pivot) {
    const bone = new THREE.Bone();
    bone.name = name;
    bone.position.copy(pivot);
    group.add(bone);
    index[name] = descriptors.length;
    descriptors.push({ name, bone, rest: pivot.clone(), target: pivot.clone(), rotation: new THREE.Quaternion(), matrix: new THREE.Matrix4(), bounds: new THREE.Box3(), footBounds: new THREE.Box3() });
  }
  addBone('pelvis', rest.pelvis);
  addBone('torso', rest.torso);
  addBone('neck', rest.neck);
  addBone('head', rest.head);
  for (const side of sideNames) {
    addBone(`${side}Scapula`, rest[`${side}Shoulder`]);
    addBone(`${side}UpperArm`, rest[`${side}Shoulder`]);
    addBone(`${side}Forearm`, rest[`${side}Elbow`]);
    addBone(`${side}Hand`, rest[`${side}Wrist`]);
    addBone(`${side}Thigh`, rest[`${side}Hip`]);
    addBone(`${side}Patella`, rest[`${side}Knee`]);
    addBone(`${side}Shin`, rest[`${side}Knee`]);
    addBone(`${side}Foot`, rest[`${side}Ankle`]);
  }
  group.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(descriptors.map(item => item.bone), descriptors.map(item => item.bone.matrixWorld.clone().invert()));

  const segmentRest = {};
  for (const side of sideNames) {
    for (const [name, a, b] of [['upperArm', 'Shoulder', 'Elbow'], ['forearm', 'Elbow', 'Wrist'], ['thigh', 'Hip', 'Knee'], ['shin', 'Knee', 'Ankle']]) {
      const start = rest[side + a], direction = rest[side + b].clone().sub(start);
      segmentRest[side + name] = { start, direction, denominator: direction.lengthSq() };
    }
  }
  function station(vertex, side, segment) {
    const value = segmentRest[side + segment];
    return ((vertex.x - value.start.x) * value.direction.x + (vertex.y - value.start.y) * value.direction.y + (vertex.z - value.start.z) * value.direction.z) / value.denominator;
  }
  function sideFor(part) {
    if (part.side === 'left' || /\bleft\b/i.test(part.name)) return 'left';
    if (part.side === 'right' || /\bright\b/i.test(part.name)) return 'right';
    return (part.bounds[0][0] + part.bounds[1][0]) / 2 >= 0 ? 'left' : 'right';
  }
  const handNames = /metacarpal|finger|thumb|scaphoid|lunate|triquetral|pisiform|trapezium|trapezoid|capitate|hamate|of .* hand|pollicis brevis|adductor pollicis|opponens pollicis/;
  const footNames = /metatarsal|toe|calcaneus|talus|cuneiform|cuboid|navicular|of .* foot|hallucis brevis|adductor hallucis|abductor hallucis|flexor digitorum brevis|flexor accessorius/;
  function classification(part) {
    const name = part.name.toLowerCase();
    const side = sideFor(part);
    const midY = (part.bounds[0][1] + part.bounds[1][1]) / 2;
    if (part.system === 'skeletal') {
      if (/humerus/.test(name)) return { kind: 'rigid', bone: side + 'UpperArm', side };
      if (/radius|ulna/.test(name)) return { kind: 'rigid', bone: side + 'Forearm', side };
      if (/femur/.test(name)) return { kind: 'rigid', bone: side + 'Thigh', side };
      if (/tibia|fibula/.test(name)) return { kind: 'rigid', bone: side + 'Shin', side };
      if (/patella/.test(name)) return { kind: 'rigid', bone: side + 'Patella', side };
      if (handNames.test(name)) return { kind: 'rigid', bone: side + 'Hand', side };
      if (footNames.test(name) || midY < 0.12) return { kind: 'rigid', bone: side + 'Foot', side };
      if (/hip bone|sacrum/.test(name)) return { kind: 'rigid', bone: 'pelvis', side };
      if (/scapula|clavicle/.test(name)) return { kind: 'rigid', bone: side + 'Scapula', side };
      if (/atlas$|axis$|cervical|hyoid/.test(name)) return { kind: 'rigid', bone: 'neck', side };
      if (midY > 1.49) return { kind: 'rigid', bone: 'head', side };
      return { kind: 'rigid', bone: 'torso', side };
    }
    if (handNames.test(name) && !/longus|extensor pollicis/.test(name)) return { kind: 'rigid', bone: side + 'Hand', side };
    if (footNames.test(name) || midY < 0.115) return { kind: 'rigid', bone: side + 'Foot', side };
    if (/psoas|iliacus|gluteus/.test(name)) return { kind: 'hip', side };
    if (/pectoralis/.test(name)) return { kind: 'pectoral', side };
    if (/subscapularis|supraspinatus|infraspinatus|teres (major|minor)/.test(name)) return { kind: 'cuff', side };
    if (/trapezius|rhomboid|levator scapulae|serratus anterior/.test(name)) return { kind: 'scapular', side };
    if (/deltoid|triceps|biceps brachii|brachialis|coracobrachialis|anconeus/.test(name)) return { kind: 'upperArm', side };
    if (/carpi|pronator|supinator|brachioradialis|digitorum (superficialis|profundus)|pollicis longus|extensor pollicis|extensor digitorum$|extensor digiti minimi$|extensor indicis|palmaris longus/.test(name)) return { kind: 'forearm', side };
    if (/gastrocnemius|soleus|tibialis|fibularis|plantaris|popliteus|digitorum longus|hallucis longus/.test(name)) return { kind: 'shin', side };
    if (/adductor (brevis|longus|magnus|minimus)|gracilis|pectineus|rectus femoris|vastus|biceps femoris|semitendinosus|semimembranosus|sartorius|tensor fasciae|gemellus|piriformis|obturator|quadratus femoris/.test(name)) return { kind: 'thigh', side };
    if (midY > 1.52) return { kind: 'rigid', bone: 'head', side };
    if (midY > 1.44) return { kind: 'rigid', bone: 'neck', side };
    if (midY < 1.02) return { kind: 'rigid', bone: 'pelvis', side };
    return { kind: 'rigid', bone: 'torso', side };
  }

  function weightsFor(vertex, rule) {
    const side = rule.side;
    if (rule.kind === 'rigid') return [[index[rule.bone], 1]];
    if (rule.kind === 'hip') {
      const thigh = smooth(rest[side + 'Hip'].y + 0.040 - vertex.y, 0, 0.120) * 0.94;
      return [[index.pelvis, 1 - thigh], [index[side + 'Thigh'], thigh]];
    }
    if (rule.kind === 'pectoral' || rule.kind === 'cuff' || rule.kind === 'scapular') {
      const upper = smooth(Math.abs(vertex.x), rule.kind === 'pectoral' ? 0.110 : 0.145, rule.kind === 'pectoral' ? 0.185 : 0.195) * (rule.kind === 'scapular' ? 0.16 : 0.90);
      return [[index[rule.kind === 'pectoral' ? 'torso' : side + 'Scapula'], 1 - upper], [index[side + 'UpperArm'], upper]];
    }
    if (rule.kind === 'upperArm') {
      const t = station(vertex, side, 'upperArm');
      const torso = (1 - smooth(t, -0.04, 0.18)) * 0.82;
      const forearm = smooth(t, 0.85, 1.11) * 0.82;
      return [[index[side + 'Scapula'], torso], [index[side + 'UpperArm'], 1 - torso - forearm], [index[side + 'Forearm'], forearm]];
    }
    if (rule.kind === 'forearm') {
      const t = station(vertex, side, 'forearm');
      const upper = (1 - smooth(t, -0.04, 0.14)) * 0.34;
      const hand = smooth(t, 0.76, 1.015);
      return [[index[side + 'UpperArm'], upper], [index[side + 'Forearm'], 1 - upper - hand], [index[side + 'Hand'], hand]];
    }
    if (rule.kind === 'thigh') {
      const t = station(vertex, side, 'thigh');
      const pelvis = (1 - smooth(t, -0.045, 0.18)) * 0.87;
      const shin = smooth(t, 0.84, 1.12) * 0.82;
      return [[index.pelvis, pelvis], [index[side + 'Thigh'], 1 - pelvis - shin], [index[side + 'Shin'], shin]];
    }
    const t = station(vertex, side, 'shin');
    const thigh = (1 - smooth(t, -0.03, 0.13)) * 0.32;
    const foot = smooth(t, 0.80, 1.025);
    return [[index[side + 'Thigh'], thigh], [index[side + 'Shin'], 1 - thigh - foot], [index[side + 'Foot'], foot]];
  }

  // The source Skin is one connected body surface, so it cannot inherit a
  // whole-mesh anatomical rule. Compare each vertex against the rest body and
  // same-side limb capsules, then blend along the actual source segment axes.
  // All torso pivots share the same body transform; the body/limb transition
  // remains continuous even where the source surface joins at an armpit/groin.
  function capsuleScore(vertex, start, end, radiusStart, radiusEnd) {
    const dx = end.x - start.x, dy = end.y - start.y, dz = end.z - start.z;
    const t = clamp(((vertex.x - start.x) * dx + (vertex.y - start.y) * dy + (vertex.z - start.z) * dz) / (dx * dx + dy * dy + dz * dz), 0, 1);
    const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, t);
    return Math.hypot(vertex.x - start.x - dx * t, vertex.y - start.y - dy * t, vertex.z - start.z - dz * t) / radius;
  }
  function surfaceWeightsFor(vertex) {
    const side = vertex.x >= 0 ? 'left' : 'right';
    const shoulder = rest[side + 'Shoulder'], elbow = rest[side + 'Elbow'], wrist = rest[side + 'Wrist'];
    const hip = rest[side + 'Hip'], knee = rest[side + 'Knee'], ankle = rest[side + 'Ankle'];
    const axisY = clamp(vertex.y, rest.pelvis.y, rest.neck.y);
    const centerZ = THREE.MathUtils.lerp(rest.pelvis.z, rest.neck.z, (axisY - rest.pelvis.y) / (rest.neck.y - rest.pelvis.y));
    const chest = smooth(vertex.y, 1.06, 1.29) * (1 - smooth(vertex.y, 1.40, 1.49));
    const width = 0.132 + chest * 0.030;
    const bodyScore = Math.hypot(vertex.x / width, (vertex.y - axisY) / 0.145, (vertex.z - centerZ) / 0.110);

    const handEnd = limb[side].palm.clone().addScaledVector(limb[side].finger, 0.115);
    const armScore = Math.min(
      capsuleScore(vertex, shoulder, elbow, 0.072, 0.047),
      capsuleScore(vertex, elbow, wrist, 0.047, 0.031),
      capsuleScore(vertex, wrist, handEnd, 0.032, 0.026),
    );
    const armRegion = smooth(vertex.y, 0.695, 0.735) * (1 - smooth(vertex.y, 1.465, 1.505));
    const armInfluence = smooth(bodyScore - armScore, -0.30, 0.50) * armRegion;
    if (armInfluence > 0.000001) {
      const upperT = station(vertex, side, 'upperArm');
      const foreT = station(vertex, side, 'forearm');
      const shoulderBody = (1 - smooth(upperT, -0.06, 0.20)) * 0.86;
      const fore = smooth(upperT, 0.83, 1.16);
      const hand = smooth(foreT, 0.78, 1.04);
      const mobile = armInfluence * (1 - shoulderBody);
      return [
        [index.torso, 1 - mobile],
        [index[side + 'UpperArm'], mobile * (1 - fore)],
        [index[side + 'Forearm'], mobile * fore * (1 - hand)],
        [index[side + 'Hand'], mobile * fore * hand],
      ];
    }

    const legScore = Math.min(
      capsuleScore(vertex, hip, knee, 0.082, 0.055),
      capsuleScore(vertex, knee, ankle, 0.055, 0.034),
    );
    const legRegion = 1 - smooth(vertex.y, 0.89, 1.005);
    const legInfluence = THREE.MathUtils.lerp(1, smooth(bodyScore - legScore, -0.25, 0.50), smooth(vertex.y, 0.70, 0.83)) * legRegion;
    if (legInfluence > 0.000001) {
      const thighT = station(vertex, side, 'thigh');
      const shinT = station(vertex, side, 'shin');
      const pelvisWeight = (1 - smooth(thighT, -0.05, 0.20)) * 0.92;
      const shin = smooth(thighT, 0.84, 1.12);
      const foot = smooth(shinT, 0.80, 1.04);
      const mobile = legInfluence * (1 - pelvisWeight);
      return [
        [index.pelvis, 1 - mobile],
        [index[side + 'Thigh'], mobile * (1 - shin)],
        [index[side + 'Shin'], mobile * shin * (1 - foot)],
        [index[side + 'Foot'], mobile * shin * foot],
      ];
    }
    return [[index[vertex.y > 1.52 ? 'head' : vertex.y > 1.44 ? 'neck' : vertex.y < 1.02 ? 'pelvis' : 'torso'], 1]];
  }

  const batches = new Map();
  const vector = new THREE.Vector3();
  let weightedVertices = 0, rigidBoneVertices = 0, surfaceVertices = 0;
  const sourceEntries = [...parts.map(source => [source, false]), ...skinParts.map(source => [source, true])];
  for (const [source, surface] of sourceEntries) {
    const part = source.userData.part;
    const rule = surface ? null : classification(part);
    const geometry = source.geometry.clone();
    for (const name of Object.keys(geometry.attributes)) if (!['position', 'normal'].includes(name)) geometry.deleteAttribute(name);
    const positions = geometry.getAttribute('position');
    const skinIndices = new Uint16Array(positions.count * 4);
    const skinWeights = new Float32Array(positions.count * 4);
    for (let vertexIndex = 0; vertexIndex < positions.count; vertexIndex++) {
      vector.fromBufferAttribute(positions, vertexIndex);
      const weights = (surface ? surfaceWeightsFor(vector) : weightsFor(vector, rule)).filter(([, weight]) => weight > 0.000001);
      const sum = weights.reduce((total, [, weight]) => total + weight, 0);
      if (!(sum > 0)) throw new Error(`Invalid weights for ${part.id}`);
      for (let weightIndex = 0; weightIndex < weights.length; weightIndex++) {
        const [boneIndex, weight] = weights[weightIndex];
        skinIndices[vertexIndex * 4 + weightIndex] = boneIndex;
        skinWeights[vertexIndex * 4 + weightIndex] = weight / sum;
        descriptors[boneIndex].bounds.expandByPoint(vector);
        if (vector.y < 0.14 && /Shin|Foot/.test(descriptors[boneIndex].name)) descriptors[boneIndex].footBounds.expandByPoint(vector);
      }
      const handWeight = surface ? weights.find(([boneIndex]) => /Hand$/.test(descriptors[boneIndex].name)) : null;
      if ((!surface && rule.kind === 'rigid' && /Hand$/.test(rule.bone)) || (handWeight && handWeight[1] > 0.90)) {
        const side = surface ? descriptors[handWeight[0]].name.startsWith('left') ? 'left' : 'right' : rule.side;
        const offset = vector.clone().sub(limb[side].palm).applyQuaternion(limb[side].supportRotation);
        limb[side].handLow = Math.min(limb[side].handLow, offset.y);
      }
    }
    if (surface) surfaceVertices += positions.count;
    else weightedVertices += positions.count;
    if (part.system === 'skeletal') rigidBoneVertices += positions.count;
    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
    const key = surface ? 'skin' : part.system === 'skeletal' ? 'bones' : part.hotspot || 'other-muscles';
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(geometry);
  }
  const meshes = [], skinMeshes = [];
  const skinMaterial = skinParts.length ? materials.skin ?? new THREE.MeshPhysicalMaterial({ color: 0xc8a48c, roughness: 0.58, metalness: 0, clearcoat: 0.08 }) : null;
  for (const [key, geometries] of batches) {
    const geometry = mergeGeometries(geometries, false);
    if (!geometry) throw new Error(`Could not assemble animated anatomy: ${key}`);
    const mesh = new THREE.SkinnedMesh(geometry, key === 'skin' ? skinMaterial : key === 'bones' ? materials.bone : materials.muscle);
    mesh.name = `BodyParts3D ${key}`;
    mesh.userData.batch = key;
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.bind(skeleton, new THREE.Matrix4());
    group.add(mesh);
    if (key === 'skin') skinMeshes.push(mesh);
    else meshes.push(mesh);
    for (const value of geometries) value.dispose();
  }
  for (const side of sideNames) limb[side].anchor.y = Math.max(0.04, 0.008 - limb[side].handLow);

  const bodyRotation = new THREE.Quaternion();
  const bodyX = new THREE.Vector3(), bodyY = new THREE.Vector3(), bodyZ = new THREE.Vector3();
  const pelvis = new THREE.Vector3();
  const targets = {};
  let time = 0, selected = null, layer = skinMeshes.length ? 'skin' : 'combined', minimumFootHeight = Infinity, boundsDirty = true;
  const posedBounds = new THREE.Box3();
  const bodyTarget = sourcePoint => sourcePoint.clone().sub(rest.pelvis).applyQuaternion(bodyRotation).add(pelvis);
  function poseBone(name, target, rotation) {
    const value = descriptors[index[name]];
    value.target.copy(target);
    value.rotation.copy(rotation);
    value.bone.position.copy(target);
    value.bone.quaternion.copy(rotation);
    value.matrix.compose(target, rotation, UNIT_SCALE).multiply(new THREE.Matrix4().makeTranslation(-value.rest.x, -value.rest.y, -value.rest.z));
  }
  function footFloor(side) {
    const box = new THREE.Box3();
    for (const suffix of ['Shin', 'Foot']) {
      const value = descriptors[index[side + suffix]];
      capBounds(value.footBounds, value.matrix, box);
    }
    return box.isEmpty() ? 0.02 : box.min.y;
  }

  function update(inputTime = 0) {
    time = ((Number.isFinite(inputTime) ? inputTime : 0) % 8 + 8) % 8;
    driver.update(time);
    const motion = driver.getMetrics();
    const angle = motion.angle;
    bodyY.copy(point(motion.joints.shoulderCenter)).sub(point(motion.joints.pelvis)).normalize();
    bodyZ.copy(point(motion.chestForward)).normalize();
    bodyX.crossVectors(bodyY, bodyZ).normalize();
    bodyZ.crossVectors(bodyX, bodyY).normalize();
    bodyRotation.setFromRotationMatrix(new THREE.Matrix4().makeBasis(bodyX, bodyY, bodyZ));
    pelvis.copy(point(motion.joints.pelvis));
    pelvis.x *= 0.86;
    pelvis.z *= 0.86;

    for (const side of sideNames) {
      const value = limb[side], sign = side === 'left' ? 1 : -1;
      value.flight = flightFor(angle, side);
      value.support = value.flight === 0;
      const palm = value.anchor.clone().add(new THREE.Vector3(sign * 0.092 * value.flight, 0.37 * value.flight, -0.060 * value.flight));
      const handRotation = value.supportRotation.clone().slerp(bodyRotation, value.flight);
      const wrist = rest[side + 'Wrist'].clone().sub(value.palm).applyQuaternion(handRotation).add(palm);
      targets[side] = { palm, wrist, handRotation };
    }
    // Solve reach using the real source lengths, with a continuous release of
    // the departing palm constraint. Hands remain exactly fixed in support.
    let lower = 0;
    for (const side of sideNames) {
      const contact = 1 - smooth(limb[side].flight, 0, 0.16);
      if (!contact) continue;
      const shoulder = bodyTarget(rest[side + 'Shoulder']);
      const wrist = targets[side].wrist;
      const reach = limb[side].upperArm + limb[side].forearm - 0.002;
      const horizontal = (shoulder.x - wrist.x) ** 2 + (shoulder.z - wrist.z) ** 2;
      const allowableY = wrist.y + Math.sqrt(Math.max(0.001, reach * reach - horizontal));
      lower = Math.max(lower, (shoulder.y - allowableY) * contact);
    }
    pelvis.y -= Math.max(0, lower);
    for (const name of ['pelvis', 'torso', 'neck', 'head']) poseBone(name, bodyTarget(rest[name]), bodyRotation);

    for (const side of sideNames) {
      const value = limb[side], sign = side === 'left' ? 1 : -1;
      const target = targets[side];
      const shoulder = bodyTarget(rest[side + 'Shoulder']);
      const pole = shoulder.clone().addScaledVector(bodyX, sign * 0.21).addScaledVector(bodyZ, 0.16);
      const solution = armIK(shoulder, target.wrist, value.upperArm, value.forearm, pole);
      const correction = solution.wrist.clone().sub(target.wrist);
      if (value.support && correction.length() > 0.0001) throw new Error('Anatomy support arm exceeded its source length.');
      target.palm.add(correction);
      target.wrist.copy(solution.wrist);
      target.shoulder = shoulder;
      target.elbow = solution.elbow;
      const upperRotation = rotationFor(rest[side + 'Elbow'].clone().sub(rest[side + 'Shoulder']), solution.elbow.clone().sub(shoulder), bodyRotation);
      const foreRotation = rotationFor(rest[side + 'Wrist'].clone().sub(rest[side + 'Elbow']), solution.wrist.clone().sub(solution.elbow), bodyRotation);
      poseBone(side + 'Scapula', shoulder, bodyRotation);
      poseBone(side + 'UpperArm', shoulder, upperRotation);
      poseBone(side + 'Forearm', solution.elbow, foreRotation);
      poseBone(side + 'Hand', solution.wrist, target.handRotation);

      const hip = bodyTarget(rest[side + 'Hip']);
      const driverDirection = point(motion.joints[side + 'Ankle']).sub(point(motion.joints[side + 'Hip'])).normalize();
      const driverThigh = point(motion.joints[side + 'Knee']).sub(point(motion.joints[side + 'Hip'])).normalize();
      const driverShin = point(motion.joints[side + 'Ankle']).sub(point(motion.joints[side + 'Knee'])).normalize();
      const halfFlex = Math.acos(clamp(driverThigh.dot(driverShin), -1, 1)) / 2;
      // Preserve the driver's circle, with roughly 63 degrees opening per leg.
      const yaw = angle + sign * 1.10;
      // The driver was drawn with a simplified pelvis. Keep each real femur on
      // its own side while sweeping front/back, rather than sending both femora
      // through one another at the rear keyframe. A rounded reflection avoids
      // a velocity cusp where a foot travels almost straight forward/back.
      const outward = sign * Math.sqrt(Math.sin(yaw) ** 2 + 0.10 ** 2);
      const forward = Math.cos(yaw);
      const horizontalLength = Math.hypot(outward, forward);
      const footYaw = Math.atan2(outward, forward);
      let pitch = Math.max(driverDirection.y, (0.080 - hip.y) / ((value.thigh + value.shin) * Math.cos(halfFlex)));
      for (let attempt = 0; attempt < 5; attempt++) {
        pitch = clamp(pitch, -0.72, 0.72);
        const planar = Math.sqrt(1 - pitch * pitch);
        const direction = new THREE.Vector3(outward / horizontalLength * planar, pitch, forward / horizontalLength * planar);
        const bend = UP.clone().addScaledVector(direction, -direction.y).normalize();
        const thighDirection = direction.clone().multiplyScalar(Math.cos(halfFlex)).addScaledVector(bend, Math.sin(halfFlex));
        const shinDirection = direction.clone().multiplyScalar(Math.cos(halfFlex)).addScaledVector(bend, -Math.sin(halfFlex));
        const knee = hip.clone().addScaledVector(thighDirection, value.thigh);
        const ankle = knee.clone().addScaledVector(shinDirection, value.shin);
        const thighRotation = rotationFor(rest[side + 'Knee'].clone().sub(rest[side + 'Hip']), knee.clone().sub(hip), bodyRotation);
        const shinRotation = rotationFor(rest[side + 'Ankle'].clone().sub(rest[side + 'Knee']), ankle.clone().sub(knee), bodyRotation);
        const footRotation = new THREE.Quaternion().setFromAxisAngle(UP, footYaw - value.footYaw);
        poseBone(side + 'Thigh', hip, thighRotation);
        poseBone(side + 'Patella', knee, thighRotation.clone().slerp(shinRotation, 0.52));
        poseBone(side + 'Shin', knee, shinRotation);
        poseBone(side + 'Foot', ankle, footRotation);
        target.hip = hip;
        target.knee = knee;
        target.ankle = ankle;
        const floor = footFloor(side);
        if (floor >= 0.008) break;
        pitch += (0.010 - floor) / ((value.thigh + value.shin) * 0.70);
      }
    }
    minimumFootHeight = Math.min(footFloor('left'), footFloor('right'));
    group.updateMatrixWorld(true);
    skeleton.update();
    boundsDirty = true;
  }

  function appearance() {
    for (const mesh of skinMeshes) mesh.visible = layer === 'skin' || layer === 'reveal';
    for (const mesh of meshes) {
      const bones = mesh.userData.batch === 'bones';
      const selectedMuscle = mesh.userData.batch === selected;
      mesh.visible = bones
        ? layer === 'bones' || layer === 'combined' || (layer === 'reveal' && Boolean(selected))
        : layer === 'muscles' || layer === 'combined' || (layer === 'reveal' && selectedMuscle);
      mesh.material = bones ? layer === 'reveal' ? materials.ghost ?? materials.bone : materials.bone : selectedMuscle ? materials.active : materials.muscle;
    }
  }
  function setHighlight(groupId) { selected = groupId; appearance(); }
  function setLayer(value) { layer = value; appearance(); }
  function getMetrics() {
    if (boundsDirty) {
      posedBounds.makeEmpty();
      for (const value of descriptors) capBounds(value.bounds, value.matrix, posedBounds);
      boundsDirty = false;
    }
    const joints = { pelvis: pelvis.toArray(), shoulderCenter: bodyTarget(rest.torso).toArray() };
    const supportHands = [], supportDrift = {};
    const segmentLengths = { torso: pelvis.distanceTo(bodyTarget(rest.torso)) };
    const expectedLengths = { torso: rest.pelvis.distanceTo(rest.torso) };
    for (const side of sideNames) {
      const target = targets[side], value = limb[side];
      for (const suffix of ['shoulder', 'elbow', 'wrist', 'palm', 'hip', 'knee', 'ankle']) joints[side + suffix[0].toUpperCase() + suffix.slice(1)] = target[suffix].toArray();
      if (value.support) supportHands.push(side);
      supportDrift[side] = value.support ? target.palm.distanceTo(value.anchor) : null;
      segmentLengths[side + 'UpperArm'] = target.shoulder.distanceTo(target.elbow);
      segmentLengths[side + 'Forearm'] = target.elbow.distanceTo(target.wrist);
      segmentLengths[side + 'Thigh'] = target.hip.distanceTo(target.knee);
      segmentLengths[side + 'Shin'] = target.knee.distanceTo(target.ankle);
      expectedLengths[side + 'UpperArm'] = value.upperArm;
      expectedLengths[side + 'Forearm'] = value.forearm;
      expectedLengths[side + 'Thigh'] = value.thigh;
      expectedLengths[side + 'Shin'] = value.shin;
    }
    return {
      time, period: 8, source: 'BodyParts3D 4.0', automaticallyBound: true, illustrative: true,
      surfaceVertices,
      supportHands, supportDrift, segmentLengths, expectedLengths, joints,
      minFootHeight: minimumFootHeight, chestForward: bodyZ.toArray(), bounds: [posedBounds.min.toArray(), posedBounds.max.toArray()],
      skinning: { bones: descriptors.length, batches: meshes.length + skinMeshes.length, weightedVertices, surfaceVertices, rigidBoneVertices, originalMeshes: parts.length, surfaceMeshes: skinParts.length },
      supportAnchors: Object.fromEntries(sideNames.map(side => [side, limb[side].anchor.toArray()])),
    };
  }

  update(0);
  appearance();
  return { group, skinMeshes, update, setHighlight, setLayer, getMetrics };
}
