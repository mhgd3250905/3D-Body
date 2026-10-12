import * as THREE from 'three';
import clockData from './v41-clock.json' with { type: 'json' };
import historicalClockData from './v38-clock.json' with { type: 'json' };

// The host retains its authored 0–9 sequence domain. Only this boundary maps
// it to the already-paced animation clip; no second pacing/IK pass is applied.
export function createBakedClock(data = clockData) {
  const { frameTimes: wall, sequenceTime: sequence } = data;
  function map(value, from, to) {
    value = THREE.MathUtils.clamp(value, from[0], from.at(-1));
    let lo = 0, hi = from.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (from[mid] <= value) lo = mid; else hi = mid; }
    return THREE.MathUtils.lerp(to[lo], to[hi], (value - from[lo]) / (from[hi] - from[lo]));
  }
  const toWall = time => map(time, sequence, wall), toSequence = time => map(time, wall, sequence);
  function advance(time, delta, speed, range = null) {
    const [a, b] = range ?? [0, sequence.at(-1)], start = toWall(a), end = toWall(b);
    const next = start + ((toWall(time) - start + delta * speed) % (end - start) + end - start) % (end - start);
    return toSequence(next);
  }
  return { toWall, toSequence, advance, duration: wall.at(-1), period: sequence.at(-1) };
}

export function createBakedMotion(gltf, rig, clock = null) {
  const model = gltf.scene, clip = gltf.animations.find(value => value.name === 'flare_v41_loop')
    ?? gltf.animations.find(value => value.name === 'flare_v38_loop');
  if (!clip || clip.tracks.length !== 44) throw new Error('baked_clip_missing');
  const revision = clip.name === 'flare_v41_loop' ? 'v41' : 'v38';
  clock ??= createBakedClock(revision === 'v41' ? clockData : historicalClockData);
  model.updateMatrixWorld(true);
  const bones = new Map(), rest = new Map(), meshes = [], boxes = new Map();
  model.traverse(object => {
    if (object.isBone) {
      bones.set(object.name, object); rest.set(object.name, { position: object.position.clone(), quaternion: object.quaternion.clone(),
        scale: object.scale.clone(), inverse: object.matrixWorld.clone().invert() }); boxes.set(object.name, new THREE.Box3());
    }
    if (object.isSkinnedMesh) { object.frustumCulled = false; meshes.push(object); }
  });
  if (bones.size !== 22) throw new Error('baked_rig_mismatch');
  const point = new THREE.Vector3(), boneIds = new Map([...bones.keys()].map((name, index) => [name, index]));
  const localBoxes = new Map();
  for (const mesh of meshes) {
    mesh.skeleton.update();
    const { skinIndex, skinWeight, position } = mesh.geometry.attributes;
    const membership = triangleBoneGroups(mesh, boneIds);
    for (let i = 0; i < position.count; i++) {
      mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld);
      for (let k = 0; k < 4; k++) if (skinWeight.getComponent(i, k) > 1e-7)
        boxes.get(mesh.skeleton.bones[skinIndex.getComponent(i, k)].name).expandByPoint(point);
      let mask = membership[i];
      while (mask) {
        const bit = mask & -mask, group = 31 - Math.clz32(bit); mask ^= bit;
        if (!localBoxes.has(group)) localBoxes.set(group, new Map());
        const influences = localBoxes.get(group);
        for (let k = 0; k < 4; k++) {
          if (skinWeight.getComponent(i, k) <= 0) continue;
          const name = mesh.skeleton.bones[skinIndex.getComponent(i, k)].name;
          if (!influences.has(name)) influences.set(name, new THREE.Box3());
          influences.get(name).expandByPoint(point);
        }
      }
    }
  }
  const landmarks = Object.fromEntries(Object.entries(rig.landmarks).map(([name, value]) => [name, { point: new THREE.Vector3(...value),
    bone: name === 'torso' ? 'torso' : name === 'pelvis' || name === 'head' || name === 'neck' ? name
      : name.replace(/Shoulder$/, 'UpperArm').replace(/Elbow$/, 'Forearm').replace(/Wrist$/, 'Hand')
        .replace(/Hip$/, 'Thigh').replace(/Knee$/, 'Shin').replace(/Ankle$/, 'Foot') }]));
  landmarks.shoulderCenter = landmarks.torso;
  landmarks.waist = { point: landmarks.pelvis.point.clone().lerp(landmarks.torso.point, 0.3), bone: 'pelvis' };
  for (const side of ['left', 'right']) {
    const sign = side === 'left' ? 1 : -1, wrist = landmarks[side + 'Wrist'].point;
    const finger = new THREE.Vector3(sign * 0.98253144, 0.05483374, 0.17783482).normalize();
    const normal = new THREE.Vector3(sign * 0.06068526, -0.99777448, -0.02762938);
    normal.addScaledVector(finger, -normal.dot(finger)).normalize();
    let thickness = -Infinity, length = 0.16;
    // Measure the same mature hand surface used by the supplied runtime.
    for (const mesh of meshes.filter(mesh => !mesh.userData.studySkin && !mesh.userData.studyHead)) {
      const { skinIndex, skinWeight, position } = mesh.geometry.attributes;
      for (let i = 0; i < position.count; i++) for (let k = 0; k < 4; k++)
        if (mesh.skeleton.bones[skinIndex.getComponent(i, k)]?.name === side + 'Hand' && skinWeight.getComponent(i, k) > 0.7) {
          mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld).sub(wrist);
          thickness = Math.max(thickness, point.dot(normal)); length = Math.max(length, point.dot(finger));
        }
    }
    landmarks[side + 'Palm'] = { point: wrist.clone().addScaledVector(finger, THREE.MathUtils.clamp(length * 0.3, 0.040, 0.075))
      .addScaledVector(normal, Number.isFinite(thickness) ? thickness : 0.025), bone: side + 'Hand' };
    // Runtime toe is an ankle-local forward point, independent of foot bind orientation.
    const footRest = rest.get(side + 'Foot'), bindRotation = footRest.quaternion.clone();
    landmarks[side + 'Toe'] = { point: landmarks[side + 'Ankle'].point.clone().add(new THREE.Vector3(0, 0, 0.18).applyQuaternion(bindRotation)), bone: side + 'Foot' };
  }
  const mixer = new THREE.AnimationMixer(model), action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  let time = 0, bounds = null, envelope = null, bodyHulls = null;
  // Each skinned vertex is a weighted combination of points inside these
  // bone influence boxes. Their projected convex hull conservatively covers
  // the complete clothed actor, including fingers, hair and shoes. Callouts
  // can avoid it without skinning 211k vertices on every camera orbit.
  const envelopeSources = [...boxes].flatMap(([name, box]) => box.isEmpty() ? [] :
    [box.min.x, box.max.x].flatMap(x => [box.min.y, box.max.y].flatMap(y =>
      [box.min.z, box.max.z].map(z => ({ name, point: new THREE.Vector3(x, y, z) })))));
  // Assign complete triangles to a dominant-bone region. For each region,
  // include a separate box for *every* bone influencing any of its vertices.
  // A skinned vertex is a non-negative weighted combination of transformed
  // box points, so it lies in this region's convex hull; its complete triangle
  // does too. A union of ordinary per-bone boxes would miss those blended
  // faces. Local hulls keep the gaps between spread limbs available to labels.
  const localSources = [...localBoxes.values()].map(influences => [...influences].flatMap(([name, box]) =>
    [box.min.x, box.max.x].flatMap(x => [box.min.y, box.max.y].flatMap(y =>
      [box.min.z, box.max.z].map(z => ({ name, point: new THREE.Vector3(x, y, z) }))))));
  function getBodyEnvelope() {
    if (!envelope) {
      const deltas = new Map([...bones].map(([name, bone]) => [name, bone.matrixWorld.clone().multiply(rest.get(name).inverse)]));
      envelope = envelopeSources.map(({ name, point }) => point.clone().applyMatrix4(deltas.get(name)));
    }
    return envelope;
  }
  function getBodyHulls() {
    if (!bodyHulls) {
      const deltas = new Map([...bones].map(([name, bone]) => [name, bone.matrixWorld.clone().multiply(rest.get(name).inverse)]));
      bodyHulls = localSources.map(sources => sources.map(({ name, point }) => point.clone().applyMatrix4(deltas.get(name))));
    }
    return bodyHulls;
  }
  function reset() {
    // Deactivate PropertyMixer bindings before installing a bind pose. Merely
    // editing bones leaves cached track values unchanged, so seeking back to
    // exactly the same frame would otherwise fail to write the animated pose.
    action.stop();
    for (const [name, bone] of bones) { const source = rest.get(name); bone.position.copy(source.position); bone.quaternion.copy(source.quaternion); bone.scale.copy(source.scale); }
    time = 0; bounds = null; envelope = null; bodyHulls = null; model.updateMatrixWorld(true); for (const mesh of meshes) mesh.skeleton.update();
  }
  function update(value) {
    time = THREE.MathUtils.clamp(value, 0, clock.period);
    action.enabled = true; action.paused = false; action.play(); mixer.setTime(clock.toWall(time));
    model.updateMatrixWorld(true); for (const mesh of meshes) mesh.skeleton.update(); bounds = null; envelope = null; bodyHulls = null;
  }
  function getMetrics() {
    const deltas = new Map([...bones].map(([name, bone]) => [name, bone.matrixWorld.clone().multiply(rest.get(name).inverse)]));
    const joints = Object.fromEntries(Object.entries(landmarks).map(([name, value]) => [name, value.point.clone().applyMatrix4(deltas.get(value.bone)).toArray()]));
    if (!bounds) {
      const union = new THREE.Box3(); for (const [name, box] of boxes) if (!box.isEmpty()) union.union(box.clone().applyMatrix4(deltas.get(name)));
      bounds = { min: union.min.toArray(), max: union.max.toArray() };
    }
    return { time, period: clock.period, joints, bounds, neutralHeight: rig.height, source: rig.source, license: rig.license,
      motionRevision: revision, playback: 'AnimationMixer', clip: clip.name, wallTime: clock.toWall(time), clipDuration: clip.duration,
      skinning: { bones: bones.size, batches: meshes.length, authoredWeights: true } };
  }
  return { reset, update, getMetrics, getBodyEnvelope, getBodyHulls, clock, dispose() { mixer.stopAllAction(); mixer.uncacheRoot(model); } };
}

function triangleBoneGroups(mesh, boneIds) {
  const { skinIndex, skinWeight, position } = mesh.geometry.attributes, index = mesh.geometry.index;
  const ids = mesh.skeleton.bones.map(bone => boneIds.get(bone.name));
  const membership = new Uint32Array(position.count), dominant = new Uint8Array(position.count);
  const scores = new Float64Array(boneIds.size);
  for (let i = 0; i < position.count; i++) {
    let weight = -1;
    for (let k = 0; k < 4; k++) if (skinWeight.getComponent(i, k) > weight) {
      weight = skinWeight.getComponent(i, k); dominant[i] = ids[skinIndex.getComponent(i, k)];
    }
  }
  const count = index?.count ?? position.count;
  for (let t = 0; t + 2 < count; t += 3) {
    const a = index ? index.getX(t) : t, b = index ? index.getX(t + 1) : t + 1, c = index ? index.getX(t + 2) : t + 2;
    let group = dominant[a];
    if (group !== dominant[b] || group !== dominant[c]) {
      scores.fill(0);
      for (const vertex of [a, b, c]) for (let k = 0; k < 4; k++) scores[ids[skinIndex.getComponent(vertex, k)]] += skinWeight.getComponent(vertex, k);
      for (let i = 0; i < scores.length; i++) if (scores[i] > scores[group]) group = i;
    }
    const bit = 1 << group; membership[a] |= bit; membership[b] |= bit; membership[c] |= bit;
  }
  return membership;
}
