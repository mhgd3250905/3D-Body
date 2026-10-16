// Independent read-only sampling of the actual candidate GLBs against frozen R14.
// Usage: node tools/motion-v42-r15/verify-candidate.mjs --dir output/<new-batch>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const root = fileURLToPath(new URL('../../', import.meta.url));
const baselineDir = path.join(root, 'output/flare-v42-r14-20261016');
if (process.argv.length !== 4 || process.argv[2] !== '--dir') throw new Error('Usage: node tools/motion-v42-r15/verify-candidate.mjs --dir output/<new-batch>');
const candidateDir = path.resolve(root, process.argv[3]);
if (path.dirname(candidateDir) !== path.join(root, 'output') || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(path.basename(candidateDir))) throw new Error('--dir must be a direct child of this project output directory');
if (candidateDir === baselineDir || fs.lstatSync(candidateDir).isSymbolicLink()) throw new Error('Cannot write a review into frozen R14 or a symlink');
const reviewDir = path.join(candidateDir, 'review');
if (fs.existsSync(reviewDir) && fs.lstatSync(reviewDir).isSymbolicLink()) throw new Error('Review directory must not be a symlink');
const N = 1080, FLOOR = -.014, NEAR_Y = .011, PENETRATION_TOLERANCE = .001, CLOSE_HAND_LEG = .07;
const sides = ['left', 'right'];
const majorNames = ['pelvis', 'torso', 'neck', 'head', ...sides.flatMap(s => ['UpperArm', 'Forearm', 'Hand', 'Thigh', 'Shin', 'Foot'].map(x => s + x))];
const physicalSpans = sides.flatMap(s => [['UpperArm', 'Forearm'], ['Forearm', 'Hand'], ['Thigh', 'Shin'], ['Shin', 'Foot']].map(([a, b]) => [s + a, s + b]));
const rig = JSON.parse(fs.readFileSync(path.join(root, 'app/scene/source/coach/coach-v41-rig.json'), 'utf8'));
const V = a => new T.Vector3(...a), Q = a => new T.Quaternion(...a).normalize(), deg = T.MathUtils.radToDeg;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const distance = (a, b) => V(a).distanceTo(V(b));
const range = values => ({ min: Math.min(...values), max: Math.max(...values) });
const wrapDegrees = value => ((value + 180) % 360 + 360) % 360 - 180;
const peak = () => ({ value: 0, phase: 0 });
function updatePeak(result, value, phase, detail) { if (value > result.value) Object.assign(result, { value, phase, detail }); }
function pointSegmentDistance(point, a, b) {
  const direction = V(b).sub(V(a)), length2 = direction.lengthSq();
  const t = length2 ? T.MathUtils.clamp(V(point).sub(V(a)).dot(direction) / length2, 0, 1) : 0;
  return V(point).distanceTo(V(a).addScaledVector(direction, t));
}
function cyclicRuns(rows, predicate, duration) {
  const unique = rows.slice(0, -1), bits = unique.map(predicate), count = bits.length;
  if (!bits.some(Boolean)) return [];
  const origin = bits.every(Boolean) ? 0 : (bits.findIndex(v => !v) + 1) % count;
  const result = []; let current = null;
  for (let k = 0; k < count; k++) {
    const index = (origin + k) % count;
    if (bits[index]) {
      current ??= { indices: [], wraps: false };
      if (current.indices.length && index < current.indices.at(-1)) current.wraps = true;
      current.indices.push(index);
    } else if (current) { result.push(current); current = null; }
  }
  if (current) result.push(current);
  return result.map(run => ({ ...run, startPhase: run.indices[0] / N, lastPhase: run.indices.at(-1) / N,
    sampleCount: run.indices.length, approximateDurationSeconds: run.indices.length / N * duration }));
}
function fingerprint(meshes) {
  return meshes.map(mesh => ({ name: mesh.name, attributes: Object.fromEntries(Object.entries(mesh.geometry.attributes).map(([name, a]) => [name, { count: a.count, itemSize: a.itemSize, normalized: a.normalized, sha256: hash(Buffer.from(a.array.buffer, a.array.byteOffset, a.array.byteLength)) }])),
    indices: mesh.geometry.index ? hash(Buffer.from(mesh.geometry.index.array.buffer, mesh.geometry.index.array.byteOffset, mesh.geometry.index.array.byteLength)) : null,
    materials: (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(m => ({ name: m.name, color: m.color?.toArray(), metalness: m.metalness, roughness: m.roughness, opacity: m.opacity })) }));
}

async function sample(file, label) {
  const bytes = fs.readFileSync(file), gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  if (gltf.animations.length !== 1 || !(gltf.animations[0].duration > 0)) throw new Error(`${label}: expected one positive-duration animation`);
  const bones = new Map(), meshes = [], scene = gltf.scene, clip = gltf.animations[0], point = new T.Vector3();
  scene.traverse(o => { if (o.isBone) bones.set(o.name, o); if (o.isSkinnedMesh) meshes.push(o); });
  for (const name of majorNames) if (!bones.has(name)) throw new Error(`${label}: missing bone ${name}`);
  scene.updateMatrixWorld(true); for (const mesh of meshes) mesh.skeleton.update();
  const restScale = new Map([...bones].map(([name, bone]) => [name, bone.getWorldScale(new T.Vector3())]));
  const selection = Object.fromEntries(sides.map(side => [side, { hand: [], palm: [], shoe: [], elbow: [] }]));
  for (const mesh of meshes) {
    const { position, skinIndex, skinWeight } = mesh.geometry.attributes;
    if (!position || !skinIndex || !skinWeight) throw new Error(`${label}: missing skin attributes on ${mesh.name}`);
    const shoe = /^Coach_(Sneakers|Soles|Shoe_Details)(?:_|$)/.test(mesh.name);
    for (let index = 0; index < position.count; index++) {
      const weights = Object.fromEntries(sides.map(s => [s, { hand: 0, foot: 0, arm: 0 }]));
      for (let k = 0; k < 4; k++) {
        const name = mesh.skeleton.bones[skinIndex.getComponent(index, k)]?.name, weight = skinWeight.getComponent(index, k);
        for (const side of sides) {
          if (name === side + 'Hand') weights[side].hand += weight;
          if (name === side + 'Foot') weights[side].foot += weight;
          if (['UpperArm', 'Forearm', 'Hand'].some(suffix => name === side + suffix)) weights[side].arm += weight;
        }
      }
      mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld);
      for (const side of sides) {
        const reference = { mesh, index, rest: point.clone() };
        if (weights[side].hand > .7) selection[side].hand.push(reference);
        if (shoe && weights[side].foot > .7) selection[side].shoe.push(reference);
        if (weights[side].arm > .5 && point.distanceTo(bones.get(side + 'Forearm').getWorldPosition(new T.Vector3())) < .08) selection[side].elbow.push(reference);
      }
    }
  }
  for (const side of sides) {
    const sign = side === 'left' ? 1 : -1, wrist = V(rig.landmarks[side + 'Wrist']);
    const finger = new T.Vector3(sign * .98253144, .05483374, .17783482).normalize();
    const normal = new T.Vector3(sign * .06068526, -.99777448, -.02762938);
    normal.addScaledVector(finger, -normal.dot(finger)).normalize();
    const hand = selection[side].hand, length = Math.max(...hand.map(v => v.rest.clone().sub(wrist).dot(finger)));
    const central = hand.filter(v => { const along = v.rest.clone().sub(wrist).dot(finger); return along >= length * .15 && along <= length * .55; });
    const depth = Math.max(...central.map(v => v.rest.clone().sub(wrist).dot(normal)));
    selection[side].palm = central.filter(v => v.rest.clone().sub(wrist).dot(normal) >= depth - .004);
    for (const [key, refs] of Object.entries(selection[side])) if (!refs.length) throw new Error(`${label}: empty ${side} ${key} skin selection`);
  }
  const surface = refs => {
    let minY = Infinity; const center = new T.Vector3();
    for (const { mesh, index } of refs) { mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld); minY = Math.min(minY, point.y); center.add(point); }
    return { minY, centroid: center.divideScalar(refs.length).toArray() };
  };
  const mixer = new T.AnimationMixer(scene), action = mixer.clipAction(clip);
  action.setLoop(T.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  const rows = [], seamPosition = peak(), seamRotation = peak(); let nonFiniteTransforms = 0, maxScaleDelta = 0;
  for (let i = 0; i <= N; i++) {
    action.enabled = true; action.paused = false; mixer.setTime(i / N * clip.duration);
    scene.updateMatrixWorld(true); for (const mesh of meshes) mesh.skeleton.update();
    const transforms = Object.fromEntries([...bones].map(([name, bone]) => {
      if (!bone.matrixWorld.elements.every(Number.isFinite)) nonFiniteTransforms++;
      maxScaleDelta = Math.max(maxScaleDelta, bone.getWorldScale(new T.Vector3()).distanceTo(restScale.get(name)));
      return [name, { p: bone.getWorldPosition(new T.Vector3()).toArray(), q: bone.getWorldQuaternion(new T.Quaternion()).normalize().toArray() }];
    }));
    const bonePositions = Object.fromEntries(majorNames.map(name => [name, transforms[name].p]));
    const surfaces = Object.fromEntries(sides.map(side => [side, Object.fromEntries(Object.entries(selection[side]).map(([key, refs]) => [key, surface(refs)]))]));
    const hipAxis = V(bonePositions.leftThigh).sub(V(bonePositions.rightThigh)), shoulderAxis = V(bonePositions.leftUpperArm).sub(V(bonePositions.rightUpperArm));
    const shoulders = V(bonePositions.leftUpperArm).add(V(bonePositions.rightUpperArm)).multiplyScalar(.5), pelvis = V(bonePositions.pelvis);
    const torso = { hipAxis: hipAxis.toArray(), shoulderAxis: shoulderAxis.toArray(), axisAngleDegrees: deg(hipAxis.angleTo(shoulderAxis)),
      signedHorizontalAxisDifferenceDegrees: wrapDegrees(deg(Math.atan2(shoulderAxis.z, shoulderAxis.x) - Math.atan2(hipAxis.z, hipAxis.x))),
      shoulderMidpointMinusPelvisYMetres: shoulders.y - pelvis.y, torsoOriginMinusPelvisYMetres: bonePositions.torso[1] - pelvis.y,
      shoulderMidpointOffsetFromPelvis: shoulders.sub(pelvis).toArray() };
    const torsoInverse = Q(transforms.torso.q).invert(), torsoOrigin = V(bonePositions.torso);
    const torsoLocalPositions = Object.fromEntries(['leftUpperArm', 'rightUpperArm', 'neck', 'head'].map(name => [name, V(bonePositions[name]).sub(torsoOrigin).applyQuaternion(torsoInverse).toArray()]));
    const torsoRigid = { torsoLocalPositions, shoulderWidthMetres: distance(bonePositions.leftUpperArm, bonePositions.rightUpperArm),
      shoulderToHeadMetres: Object.fromEntries(sides.map(side => [side, distance(bonePositions[side + 'UpperArm'], bonePositions.head)])) };
    const elbows = Object.fromEntries(sides.map(side => {
      const shoulder = V(bonePositions[side + 'UpperArm']), elbow = V(bonePositions[side + 'Forearm']), wrist = V(bonePositions[side + 'Hand']);
      const axis = wrist.clone().sub(shoulder).normalize(), offset = elbow.clone().sub(shoulder);
      const bendHeight = offset.addScaledVector(axis, -offset.dot(axis)).length();
      return [side, { angleDegrees: deg(shoulder.clone().sub(elbow).angleTo(wrist.clone().sub(elbow))), bendHeightMetres: bendHeight }];
    }));
    const handLeg = {};
    for (const hand of sides) for (const leg of sides) for (const segment of ['Thigh', 'Shin']) {
      const a = bonePositions[leg + segment], b = bonePositions[leg + (segment === 'Thigh' ? 'Shin' : 'Foot')];
      handLeg[`${hand}Hand-${leg}${segment}`] = { wristToSegmentMetres: pointSegmentDistance(bonePositions[hand + 'Hand'], a, b), palmPatchCentroidToSegmentMetres: pointSegmentDistance(surfaces[hand].palm.centroid, a, b) };
    }
    rows.push({ phase: i / N, time: i / N * clip.duration, bonePositions, rotations: Object.fromEntries([...bones.keys()].map(name => [name, transforms[name].q])),
      spans: Object.fromEntries(physicalSpans.map(([a, b]) => [`${a}->${b}`, distance(bonePositions[a], bonePositions[b])])), surfaces, torso, torsoRigid, elbows, handLeg });
    if (i === 0) rows[0].allBonePositions = Object.fromEntries([...bones.keys()].map(name => [name, transforms[name].p]));
    if (i === N) for (const [name, transform] of Object.entries(transforms)) {
      updatePeak(seamPosition, distance(rows[0].allBonePositions[name], transform.p), 1, name);
      updatePeak(seamRotation, deg(Q(rows[0].rotations[name]).angleTo(Q(transform.q))), 1, name);
    }
  }
  mixer.stopAllAction(); mixer.uncacheRoot(scene);
  const unique = rows.slice(0, -1), contact = {};
  for (const side of sides) {
    contact[side] = cyclicRuns(rows, r => r.surfaces[side].palm.minY <= NEAR_Y && r.surfaces[side].palm.minY >= FLOOR - PENETRATION_TOLERANCE, clip.duration).map(run => {
      const first = rows[run.indices[0]], patch = first.surfaces[side].palm.centroid, wrist = first.bonePositions[side + 'Hand'];
      const sampled = run.indices.map(index => rows[index]);
      return { ...run, palmPatchHorizontalExcursionMetres: Math.max(...sampled.map(r => Math.hypot(r.surfaces[side].palm.centroid[0] - patch[0], r.surfaces[side].palm.centroid[2] - patch[2]))),
        palmPatchWorld3dExcursionMetres: Math.max(...sampled.map(r => distance(r.surfaces[side].palm.centroid, patch))),
        wristHorizontalExcursionMetres: Math.max(...sampled.map(r => Math.hypot(r.bonePositions[side + 'Hand'][0] - wrist[0], r.bonePositions[side + 'Hand'][2] - wrist[2]))),
        palmMinY: range(sampled.map(r => r.surfaces[side].palm.minY)), indices: undefined };
    });
  }
  const near = r => sides.every(side => r.surfaces[side].palm.minY <= NEAR_Y && r.surfaces[side].palm.minY >= FLOOR - PENETRATION_TOLERANCE);
  contact.bothPalmsNear = cyclicRuns(rows, near, clip.duration).map(({ indices, ...rest }) => rest);
  const surfaceExtents = Object.fromEntries(sides.map(side => [side, Object.fromEntries(['hand', 'palm', 'shoe', 'elbow'].map(key => {
    const values = unique.map(r => r.surfaces[side][key].minY), minimum = Math.min(...values);
    return [key, { ...range(values), minimumPhase: values.indexOf(minimum) / N, clearanceAboveRenderedFloorMetres: minimum - FLOOR,
      samplesBelowWorldZero: values.filter(value => value < 0).length, samplesBelowRenderedFloorByOver1mm: values.filter(value => value < FLOOR - PENETRATION_TOLERANCE).length }];
  }))]));
  const handLegMinima = Object.fromEntries(Object.keys(rows[0].handLeg).map(key => [key, Object.fromEntries(Object.keys(rows[0].handLeg[key]).map(metric => {
    const values = unique.map(row => row.handLeg[key][metric]), minimum = Math.min(...values);
    return [metric, { metres: minimum, phase: values.indexOf(minimum) / N }];
  }))]));
  // Sample both sides of the loop, and compare speeds per cycle as well as per second.
  const handoffDistance = phase => Math.min(phase, Math.abs(phase - .5), 1 - phase);
  const kinematics = {}, dt = clip.duration / N;
  const monitored = ['pelvis', 'torso', 'head', ...sides.flatMap(side => ['UpperArm', 'Forearm', 'Hand'].map(part => side + part))];
  for (const name of monitored) {
    const globalStep = peak(), handoffStep = peak(), nearStraightElbowStep = peak();
    const side = name.startsWith('left') ? 'left' : name.startsWith('right') ? 'right' : null;
    for (let i = 1; i <= N; i++) {
      const value = distance(rows[i].bonePositions[name], rows[i - 1].bonePositions[name]), phase = i / N;
      const detail = { previousPhase: (i - 1) / N, currentPhase: phase, metresPerSecond: value / dt, metresPerNormalizedCycle: value * N };
      updatePeak(globalStep, value, phase, detail);
      if (handoffDistance(phase) <= .10) updatePeak(handoffStep, value, phase, detail);
      if (side && name.endsWith('Forearm') && Math.min(rows[i].elbows[side].bendHeightMetres, rows[i - 1].elbows[side].bendHeightMetres) <= .005) {
        updatePeak(nearStraightElbowStep, value, phase, { ...detail, elbow: rows[i].elbows[side], previousElbow: rows[i - 1].elbows[side] });
      }
    }
    const incoming = V(rows[N].bonePositions[name]).sub(V(rows[N - 1].bonePositions[name]));
    const outgoing = V(rows[1].bonePositions[name]).sub(V(rows[0].bonePositions[name]));
    kinematics[name] = { globalAdjacentStepMetres: globalStep, handoffAdjacentStepMetres: handoffStep,
      nearStraightElbowAdjacentStepMetres: nearStraightElbowStep, seamAdjacentStepVectorDifferenceMetres: outgoing.distanceTo(incoming),
      seamOneSidedVelocityDifferenceMetresPerSecond: outgoing.distanceTo(incoming) / dt };
  }
  const result = { file, sha256: hash(bytes), bytes: bytes.length, durationSeconds: clip.duration, bones: bones.size, tracks: clip.tracks.length,
    nonFiniteTransforms, maxWorldScaleDelta: maxScaleDelta, seamPositionMetres: seamPosition, seamRotationDegrees: seamRotation,
    geometryFingerprint: fingerprint(meshes), skinSelectionCounts: Object.fromEntries(sides.map(side => [side, Object.fromEntries(Object.entries(selection[side]).map(([key, refs]) => [key, refs.length]))])),
    physicalSpanRanges: Object.fromEntries(physicalSpans.map(([a, b]) => { const key = `${a}->${b}`, extent = range(unique.map(r => r.spans[key])); return [key, { ...extent, withinCycleRangeMetres: extent.max - extent.min }]; })),
    torsoAtQuarterAndThreeQuarter: [.25, .75].map(phase => ({ phase, ...rows[Math.round(phase * N)].torso })),
    torsoExtents: Object.fromEntries(['axisAngleDegrees', 'signedHorizontalAxisDifferenceDegrees', 'shoulderMidpointMinusPelvisYMetres', 'torsoOriginMinusPelvisYMetres'].map(key => [key, range(unique.map(r => r.torso[key]))])),
    surfaces: surfaceExtents, geometricNearContact: contact, handLegMinima, kinematics,
    elbowRanges: Object.fromEntries(sides.map(side => [side, { angleDegrees: range(unique.map(row => row.elbows[side].angleDegrees)), bendHeightMetres: range(unique.map(row => row.elbows[side].bendHeightMetres)) }])) };
  console.log(JSON.stringify({ sampled: label, seconds: clip.duration, frames: rows.length, palms: result.skinSelectionCounts, floorClearance: Object.fromEntries(sides.map(side => [side, Object.fromEntries(Object.entries(surfaceExtents[side]).map(([key, value]) => [key, value.clearanceAboveRenderedFloorMetres]))])) }));
  return { result, rows };
}

function compare(baseline, candidate, kind) {
  const b = baseline.result, c = candidate.result, blocking = [], review = [];
  const block = (issue, detail) => blocking.push({ issue, ...detail }), note = (issue, detail) => review.push({ issue, ...detail });
  if (c.nonFiniteTransforms) block('non-finite transforms', { count: c.nonFiniteTransforms });
  if (c.maxWorldScaleDelta > b.maxWorldScaleDelta + .00001) block('new animated scale deviation', { baseline: b.maxWorldScaleDelta, candidate: c.maxWorldScaleDelta });
  if (c.seamPositionMetres.value > Math.max(.00001, b.seamPositionMetres.value + .00001)) block('position seam > baseline + 0.01mm', { baseline: b.seamPositionMetres, candidate: c.seamPositionMetres });
  if (c.seamRotationDegrees.value > Math.max(.01, b.seamRotationDegrees.value + .01)) block('rotation seam > baseline + 0.01 degree', { baseline: b.seamRotationDegrees, candidate: c.seamRotationDegrees });
  if (JSON.stringify(b.geometryFingerprint) !== JSON.stringify(c.geometryFingerprint)) block('geometry/skin/material fingerprint differs from R14', {});
  const rigidConsistency = { torsoLocalPositionDeltaMetres: Object.fromEntries(['leftUpperArm', 'rightUpperArm', 'neck', 'head'].map(name => [name, peak()])),
    shoulderWidthDeltaMetres: peak(), shoulderToHeadDistanceDeltaMetres: Object.fromEntries(sides.map(side => [side, peak()])),
    pelvisWorldDisplacementFromR14Metres: peak(), torsoWorldDisplacementFromR14Metres: peak() };
  for (let i = 0; i <= N; i++) {
    const before = baseline.rows[i], after = candidate.rows[i], phase = i / N;
    for (const name of Object.keys(rigidConsistency.torsoLocalPositionDeltaMetres)) updatePeak(rigidConsistency.torsoLocalPositionDeltaMetres[name],
      distance(before.torsoRigid.torsoLocalPositions[name], after.torsoRigid.torsoLocalPositions[name]), phase);
    updatePeak(rigidConsistency.shoulderWidthDeltaMetres, Math.abs(before.torsoRigid.shoulderWidthMetres - after.torsoRigid.shoulderWidthMetres), phase);
    for (const side of sides) updatePeak(rigidConsistency.shoulderToHeadDistanceDeltaMetres[side], Math.abs(before.torsoRigid.shoulderToHeadMetres[side] - after.torsoRigid.shoulderToHeadMetres[side]), phase);
    updatePeak(rigidConsistency.pelvisWorldDisplacementFromR14Metres, distance(before.bonePositions.pelvis, after.bonePositions.pelvis), phase);
    updatePeak(rigidConsistency.torsoWorldDisplacementFromR14Metres, distance(before.bonePositions.torso, after.bonePositions.torso), phase);
  }
  for (const [name, metric] of Object.entries(rigidConsistency.torsoLocalPositionDeltaMetres)) {
    if (metric.value > .001) block('torso-local shoulder/head attachment differs from R14 by >1mm', { name, maximum: metric, caution: 'Whole-body rigid tilt/translation is removed; this comparison assumes the original torso/head phase is preserved.' });
  }
  if (rigidConsistency.shoulderWidthDeltaMetres.value > .001) block('shoulder width differs from R14 by >1mm', { maximum: rigidConsistency.shoulderWidthDeltaMetres });
  for (const [side, metric] of Object.entries(rigidConsistency.shoulderToHeadDistanceDeltaMetres)) if (metric.value > .001) block('shoulder-to-head distance differs from R14 by >1mm', { side, maximum: metric });
  for (const name of Object.keys(c.kinematics)) {
    // Changed timing intentionally changes velocity. Only large new arm/body jumps get review flags.
    for (const metric of ['handoffAdjacentStepMetres', 'nearStraightElbowAdjacentStepMetres']) {
      const before = b.kinematics[name][metric], after = c.kinematics[name][metric];
      if (after.value > Math.max(before.value * 2, before.value + .01)) note('large new adjacent arm/body displacement near handoff or elbow extension', { name, metric, baseline: before, candidate: after, caution: 'Screening tolerance: >2x baseline and >10mm extra per1/1080-cycle interval. Not a biomechanics speed limit or automatic collision.' });
    }
    const before = b.kinematics[name].seamAdjacentStepVectorDifferenceMetres, after = c.kinematics[name].seamAdjacentStepVectorDifferenceMetres;
    if (after > Math.max(before * 2, before + .01)) note('large new one-sided loop velocity mismatch', { name, baselineStepDifferenceMetres: before, candidateStepDifferenceMetres: after });
  }
  for (const [name, span] of Object.entries(c.physicalSpanRanges)) {
    const prior = b.physicalSpanRanges[name];
    if (span.withinCycleRangeMetres > prior.withinCycleRangeMetres + .001) block('physical limb span range increased >1mm', { name, baseline: prior, candidate: span });
    if (Math.abs(span.min - prior.min) > .001 || Math.abs(span.max - prior.max) > .001) note('physical limb span extrema changed >1mm', { name, baseline: prior, candidate: span });
  }
  const newBelowFloorAtSamePhase = {};
  for (const side of sides) for (const key of ['hand', 'palm', 'shoe', 'elbow']) {
    const before = b.surfaces[side][key], after = c.surfaces[side][key];
    if (after.min < FLOOR - PENETRATION_TOLERANCE && after.min < before.min - PENETRATION_TOLERANCE) block('new/deeper skin penetration of rendered stage by >1mm', { side, region: key, baseline: before, candidate: after });
    const runs = cyclicRuns(candidate.rows, (row, index) => row.surfaces[side][key].minY < FLOOR - PENETRATION_TOLERANCE && baseline.rows[index].surfaces[side][key].minY >= FLOOR - PENETRATION_TOLERANCE, c.durationSeconds);
    newBelowFloorAtSamePhase[`${side}-${key}`] = runs.map(({ indices, ...rest }) => rest);
  }
  const maxDrift = (result, side) => Math.max(0, ...result.geometricNearContact[side].filter(run => run.sampleCount >= 3).map(run => run.palmPatchHorizontalExcursionMetres));
  for (const side of sides) if (maxDrift(c, side) > maxDrift(b, side) + .01) note('geometric near-contact palm patch excursion increases >1cm', { side, baselineMetres: maxDrift(b, side), candidateMetres: maxDrift(c, side), caution: 'Patch pivot/rock can move the centroid; this is not proof of sliding.' });
  for (const [key, metrics] of Object.entries(c.handLegMinima)) for (const [metric, minimum] of Object.entries(metrics)) {
    if (minimum.metres < CLOSE_HAND_LEG) note('hand/leg broad-phase near approach requires mesh/visual inspection', { key, metric, baseline: b.handLegMinima[key][metric], candidate: minimum, thresholdMetres: CLOSE_HAND_LEG, caution: 'Distance to a bone segment is not surface separation or proof of intersection.' });
  }
  const phaseTorsoDifference = c.torsoAtQuarterAndThreeQuarter.map((row, index) => ({ phase: row.phase,
    axisAngleDeltaDegrees: row.axisAngleDegrees - b.torsoAtQuarterAndThreeQuarter[index].axisAngleDegrees,
    shoulderMidpointLiftDeltaMetres: row.shoulderMidpointMinusPelvisYMetres - b.torsoAtQuarterAndThreeQuarter[index].shoulderMidpointMinusPelvisYMetres,
    torsoOriginLiftDeltaMetres: row.torsoOriginMinusPelvisYMetres - b.torsoAtQuarterAndThreeQuarter[index].torsoOriginMinusPelvisYMetres }));
  return { kind, baseline: b, candidate: c, durationRatio: c.durationSeconds / b.durationSeconds, phaseTorsoDifference, rigidConsistency,
    samePhaseNewStageCrossingRuns: newBelowFloorAtSamePhase, blocking, review,
    verdict: blocking.length ? 'blocking-structural-or-skin-regression' : review.length ? 'measured-checks-clear-with-review-items' : 'measured-checks-clear' };
}

const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-'), report = {
  format: 'r15-independent-actual-glb-v1', createdAt: new Date().toISOString(), samplesIncludingRepeatedEndpoint: N + 1,
  baselineDirectory: baselineDir, candidateDirectory: candidateDir, renderedFloorYMetres: FLOOR, geometricNearPalmUpperYMetres: NEAR_Y,
  definitions: {
    bones: 'All loaded actual GLB bone transforms and actual SkinnedMesh.getVertexPosition world vertices; no authored controller samples are used.',
    physicalSpans: 'Only eight anatomical limb spans: UpperArm->Forearm, Forearm->Hand, Thigh->Shin, Shin->Foot on each side. Parallel bones and spine helper origins are deliberately excluded from length tests.',
    palm: 'Fixed actual hand skin patch using >0.7 Hand weight, central15%-55% hand length along source Snow finger axis, deepest4mm palmar surface. Exactly the prior audit definition.',
    elbow: 'Fixed rest vertices with summed arm weights>0.5 and within8cm of the Forearm world origin; deformed every sample.',
    shoe: 'Actual Coach_Sneakers/Soles/Shoe_Details meshes with >0.7 corresponding Foot weight.',
    nearPalm: 'Patch minY is between rendered floor minus1mm and authored contact layer0.006m plus0.005m. Pure geometry; no contact forces, load, COM or handLocked states inferred.',
    stability: 'World-space excursion of one fixed skinned palmar patch centroid and wrist origin per cyclic geometric near-contact run. Pivot/rock can move a patch centroid, so excursion is not itself proof of sliding.',
    torso: 'Hip and shoulder axes are left-minus-right actual Thigh/UpperArm origins. Axis separation is unsigned3D angle; horizontal difference is signed X/Z projected yaw. Chest lift is shoulder midpoint/torso-origin Y minus pelvis Y, not a biomechanical chest angle.',
    attachment: 'Torso-local offsets = inverse(actual torso world quaternion) * (actual shoulder/neck/head world origin minus actual torso world origin), compared at the same normalized phase. This removes intended rigid tilt/translation. Shoulder width and shoulder-to-head distances are independent rigid invariants.',
    bodyShift: 'Reported pelvis/torso displacement from R14 is total world-position change, including intended rigid wrist-pivot tilt and any reach translation. It is not the isolated authoring contactTranslation control value.',
    step: 'Adjacent actual GLB samples separated by1/1080 normalized cycle; report displacement, actual-second velocity and normalized-cycle velocity. Handoff screening windows are within10% of phase0/.5; near-straight elbow subset has elbow-to-shoulder/wrist-line height<=5mm. No leg-speed flag is applied.',
    collision: 'Wrist and actual palm-patch centroid to thigh/shin bone segments are broad-phase distances only. <7cm requests further mesh/visual review; it does not prove a mesh collision.',
    threshold: 'Engineering regression tolerances: seam0.01mm/0.01deg, extra physical span range1mm, new/deeper stage penetration1mm, extra near-contact patch excursion1cm. Not human performance standards.',
  },
  limitations: ['1081 discrete samples include baked keyframe midpoints but are not a continuous-time collision proof.', 'Only documented hand/palm/shoe/elbow skin selections are checked; full body collision and cloth intersections are not certified.', 'Same normalized phase can represent a different event after retiming; phase-local differences are not automatically regressions.', 'No mass/force model or realism score. Numeric clearance does not replace visual review or user acceptance.', 'Source assets, frozen R14 and candidate GLBs are read-only; only new review reports are written.'], assets: [],
};
fs.mkdirSync(reviewDir, { recursive: true });
for (const kind of ['training', 'coach']) {
  const filename = `flare-${kind}-v42-candidate.glb`, baseline = await sample(path.join(baselineDir, filename), `${kind}-R14`), candidate = await sample(path.join(candidateDir, filename), `${kind}-candidate`);
  const result = compare(baseline, candidate, kind), sampleName = `independent-${kind}-samples-${stamp}.json`;
  fs.writeFileSync(path.join(reviewDir, sampleName), JSON.stringify({ baseline: baseline.rows, candidate: candidate.rows }) + '\n', { flag: 'wx' });
  report.assets.push({ ...result, samplesFile: sampleName });
  console.log(JSON.stringify({ kind, verdict: result.verdict, blocking: result.blocking, review: result.review, torsoDifference: result.phaseTorsoDifference }));
}
report.verdict = report.assets.some(asset => asset.blocking.length) ? 'BLOCKING' : report.assets.some(asset => asset.review.length) ? 'REVIEW' : 'MEASURED_CHECKS_CLEAR';
const output = path.join(reviewDir, `independent-actual-glb-${stamp}.json`);
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ report: output, verdict: report.verdict }));
if (report.verdict === 'BLOCKING') process.exitCode = 1;
