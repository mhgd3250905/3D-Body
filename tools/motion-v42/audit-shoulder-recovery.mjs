// Signed, geometry-based R1 shoulder-recovery comparison. Read-only inputs.
// node tools/motion-v42/audit-shoulder-recovery.mjs --candidate path --reference path --out directory
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const args = {
  reference: path.join(root, 'output/flare-v42-20261015/flare-coach-v42-candidate.glb'),
  candidate: path.join(root, 'output/flare-v42-r4-20261015/flare-coach-v42-candidate.glb'),
  out: path.join(root, 'output/flare-v42-r4-20261015/agent-shoulder/coach'), intervals: 540,
};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i].slice(2), value = process.argv[++i];
  if (!Object.hasOwn(args, key) || value === undefined) throw new Error('Unknown/missing named argument');
  args[key] = key === 'intervals' ? Number(value) : path.resolve(value);
}
if (!Number.isInteger(args.intervals) || args.intervals < 24 || args.intervals > 3600) throw new Error('Invalid intervals');
for (const key of ['reference', 'candidate']) if (!fs.existsSync(args[key])) throw new Error(`${key} missing: ${args[key]}`);
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const rig = JSON.parse(fs.readFileSync(path.join(root, 'app/scene/source/coach/coach-v41-rig.json'), 'utf8'));
const sides = ['left', 'right'], V = a => new THREE.Vector3(...a), Q = a => new THREE.Quaternion(...a).normalize(), deg = x => x * 180 / Math.PI;
const dist = (a, b) => V(a).distanceTo(V(b)), max = a => a.length ? Math.max(...a) : 0, range = a => a.length ? { min: Math.min(...a), max: Math.max(...a) } : null;
const stats = a => { if (!a.length) return null; const b = [...a].sort((x, y) => x - y); return { ...range(a), median: b[Math.round((b.length - 1) * .5)], mean: a.reduce((s, v) => s + v, 0) / a.length }; };
const armNames = sides.flatMap(s => ['UpperArm', 'Forearm', 'Hand'].map(n => s + n));
const nearY = .011, airborneY = .056, minBend = .005;
function runs(rows, predicate) {
  const result = []; let run = null;
  for (let i = 0; i < rows.length - 1; i++) {
    if (predicate(rows[i])) { run ??= { firstFrame: i, lastFrame: i }; run.lastFrame = i; }
    else if (run) { result.push(run); run = null; }
  }
  if (run) result.push(run);
  return result.map(r => ({ ...r, firstPhase: r.firstFrame / args.intervals, lastPhase: r.lastFrame / args.intervals, samples: r.lastFrame - r.firstFrame + 1 }));
}
function bend(s, e, w) {
  const axis = V(w).sub(V(s)).normalize(), b = V(e).sub(V(s));
  b.addScaledVector(axis, -b.dot(axis));
  return { axis, radius: b.length(), direction: b.normalize() };
}
async function sample(file) {
  const bytes = fs.readFileSync(file), sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const raw = bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes;
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
  const model = gltf.scene, clip = [...gltf.animations].sort((a, b) => b.tracks.length - a.tracks.length)[0];
  if (!clip || clip.duration <= 0) throw new Error('No animation clip');
  model.updateMatrixWorld(true);
  const bones = new Map(), meshes = [];
  model.traverse(o => { if (o.isBone) bones.set(o.name, o); if (o.isSkinnedMesh) { meshes.push(o); o.skeleton.update(); } });
  const rest = new Map([...bones].map(([n, b]) => [n, b.matrixWorld.clone().invert()]));
  const landmarks = Object.fromEntries(Object.entries(rig.landmarks).map(([name, p]) => [name, { point: V(p), bone: ['pelvis', 'torso', 'neck', 'head'].includes(name) ? name : name.replace(/Shoulder$/, 'UpperArm').replace(/Elbow$/, 'Forearm').replace(/Wrist$/, 'Hand').replace(/Hip$/, 'Thigh').replace(/Knee$/, 'Shin').replace(/Ankle$/, 'Foot') }]));
  const hand = { left: [], right: [] }, palm = { left: [], right: [] }, point = new THREE.Vector3();
  for (const mesh of meshes) {
    const { position, skinIndex, skinWeight } = mesh.geometry.attributes;
    for (let i = 0; i < position.count; i++) for (const side of sides) {
      let weight = 0;
      for (let k = 0; k < 4; k++) if (mesh.skeleton.bones[skinIndex.getComponent(i, k)]?.name === side + 'Hand') weight += skinWeight.getComponent(i, k);
      if (weight > .7) { mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld); hand[side].push({ mesh, index: i, rest: point.clone() }); }
    }
  }
  for (const side of sides) {
    if (!hand[side].length) throw new Error('No hand mesh selection: ' + side);
    const wrist = V(rig.landmarks[side + 'Wrist']), sign = side === 'left' ? 1 : -1;
    const finger = new THREE.Vector3(sign * .98253144, .05483374, .17783482).normalize(), normal = new THREE.Vector3(sign * .06068526, -.99777448, -.02762938);
    normal.addScaledVector(finger, -normal.dot(finger)).normalize();
    const length = max(hand[side].map(v => v.rest.clone().sub(wrist).dot(finger)));
    const middle = hand[side].filter(v => { const d = v.rest.clone().sub(wrist).dot(finger); return d >= length * .15 && d <= length * .55; });
    const depth = max(middle.map(v => v.rest.clone().sub(wrist).dot(normal)));
    palm[side] = middle.filter(v => v.rest.clone().sub(wrist).dot(normal) >= depth - .004);
    if (!palm[side].length) throw new Error('Empty palm patch');
  }
  const measure = refs => { const center = new THREE.Vector3(); let minY = Infinity; for (const { mesh, index } of refs) { mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld); minY = Math.min(minY, point.y); center.add(point); } return { minY, centroid: center.divideScalar(refs.length).toArray() }; };
  const mixer = new THREE.AnimationMixer(model), action = mixer.clipAction(clip); action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  const rows = []; let nonFiniteMatrices = 0;
  for (let i = 0; i <= args.intervals; i++) {
    const phase = i / args.intervals, time = phase * clip.duration;
    action.enabled = true; action.paused = false; mixer.setTime(time); model.updateMatrixWorld(true); for (const m of meshes) m.skeleton.update();
    const positions = {}, rotations = {}, matrices = {}, deltas = new Map();
    for (const [name, bone] of bones) {
      if (!bone.matrixWorld.elements.every(Number.isFinite)) nonFiniteMatrices++;
      positions[name] = bone.getWorldPosition(point).toArray(); rotations[name] = bone.getWorldQuaternion(new THREE.Quaternion()).normalize().toArray();
      matrices[name] = [...bone.matrixWorld.elements]; deltas.set(name, bone.matrixWorld.clone().multiply(rest.get(name)));
    }
    const joints = Object.fromEntries(Object.entries(landmarks).map(([n, l]) => [n, l.point.clone().applyMatrix4(deltas.get(l.bone)).toArray()]));
    const arms = {};
    for (const side of sides) {
      const s = positions[side + 'UpperArm'], e = positions[side + 'Forearm'], w = positions[side + 'Hand'], hip = positions[side + 'Thigh'];
      const upper = V(e).sub(V(s)), bodyDown = V(hip).sub(V(s));
      arms[side] = { shoulder: s, elbow: e, wrist: w, hip, upperDirection: upper.clone().normalize().toArray(), bodyDown: bodyDown.normalize().toArray(),
        shoulderOpeningDegrees: deg(upper.angleTo(bodyDown)), elbowAngleDegrees: deg(V(s).sub(V(e)).angleTo(V(w).sub(V(e)))),
        upperLength: dist(s, e), lowerLength: dist(e, w), shoulderWristLength: dist(s, w), hand: measure(hand[side]), palm: measure(palm[side]) };
    }
    rows.push({ frame: i, phase, time, positions, rotations, matrices, joints, arms });
  }
  const seam = { matrixMax: 0, bonePositionMaxMetres: 0, boneRotationMaxDegrees: 0 };
  for (const name of bones.keys()) {
    seam.matrixMax = Math.max(seam.matrixMax, ...rows[0].matrices[name].map((v, i) => Math.abs(v - rows.at(-1).matrices[name][i])));
    seam.bonePositionMaxMetres = Math.max(seam.bonePositionMaxMetres, dist(rows[0].positions[name], rows.at(-1).positions[name]));
    seam.boneRotationMaxDegrees = Math.max(seam.boneRotationMaxDegrees, deg(Q(rows[0].rotations[name]).angleTo(Q(rows.at(-1).rotations[name]))));
  }
  mixer.stopAllAction(); mixer.uncacheRoot(model);
  return { asset: { path: file, sha256, bytes: bytes.length, duration: clip.duration, clip: clip.name }, nonFiniteMatrices, seam, rows };
}
const reference = await sample(args.reference), candidate = await sample(args.candidate), rows = [], summaries = {}, flags = [];
const fixed = { maxNonArmBoneMatrixComponentChange: 0, maxNonArmBoneOriginChangeMetres: 0, maxNonArmBoneRotationChangeDegrees: 0, maxNonArmLandmarkChangeMetres: 0, worstBone: null, worstLandmark: null };
for (let i = 0; i <= args.intervals; i++) {
  const r = reference.rows[i], c = candidate.rows[i], row = { frame: i, phase: r.phase, sides: {} };
  for (const name of Object.keys(r.positions)) if (!armNames.includes(name)) {
    const d = dist(r.positions[name], c.positions[name]);
    if (d > fixed.maxNonArmBoneOriginChangeMetres) { fixed.maxNonArmBoneOriginChangeMetres = d; fixed.worstBone = name; }
    fixed.maxNonArmBoneMatrixComponentChange = Math.max(fixed.maxNonArmBoneMatrixComponentChange, ...r.matrices[name].map((v, k) => Math.abs(v - c.matrices[name][k])));
    fixed.maxNonArmBoneRotationChangeDegrees = Math.max(fixed.maxNonArmBoneRotationChangeDegrees, deg(Q(r.rotations[name]).angleTo(Q(c.rotations[name]))));
  }
  for (const name of Object.keys(r.joints)) if (!/Elbow$|Wrist$/.test(name)) {
    const d = dist(r.joints[name], c.joints[name]);
    if (d > fixed.maxNonArmLandmarkChangeMetres) { fixed.maxNonArmLandmarkChangeMetres = d; fixed.worstLandmark = name; }
  }
  for (const side of sides) {
    const a = r.arms[side], b = c.arms[side], q = new THREE.Quaternion().setFromUnitVectors(V(a.upperDirection), V(b.upperDirection)).normalize(), inverse = q.clone().invert();
    const undo = p => V(p).sub(V(b.shoulder)).applyQuaternion(inverse).add(V(a.shoulder));
    const undoneE = undo(b.elbow), undoneW = undo(b.wrist), rb = bend(a.shoulder, a.elbow, a.wrist), cb = bend(a.shoulder, undoneE.toArray(), undoneW.toArray());
    const align = new THREE.Quaternion().setFromUnitVectors(cb.axis, rb.axis), aligned = cb.direction.clone().applyQuaternion(align).normalize();
    const reliable = rb.radius >= minBend && cb.radius >= minBend, airborne = a.hand.minY > airborneY && b.hand.minY > airborneY;
    const orientationResidual = Object.fromEntries(['UpperArm', 'Forearm', 'Hand'].map(n => [n, deg(q.clone().multiply(Q(r.rotations[side + n])).normalize().angleTo(Q(c.rotations[side + n])))]));
    row.sides[side] = {
      eligible: reliable && airborne, reliable, airborne, referenceShoulderOpeningDegrees: a.shoulderOpeningDegrees, candidateShoulderOpeningDegrees: b.shoulderOpeningDegrees,
      shoulderOpeningReductionDegrees: a.shoulderOpeningDegrees - b.shoulderOpeningDegrees, inferredMinimalShoulderRotationDegrees: deg(q.angleTo(new THREE.Quaternion())),
      shoulderDisplacementMetres: dist(a.shoulder, b.shoulder), elbowDisplacementMetres: dist(a.elbow, b.elbow), wristDisplacementMetres: dist(a.wrist, b.wrist),
      elbowYChangeMetres: b.elbow[1] - a.elbow[1], wristYChangeMetres: b.wrist[1] - a.wrist[1], elbowAngleChangeDegrees: b.elbowAngleDegrees - a.elbowAngleDegrees,
      upperLengthChangeMetres: b.upperLength - a.upperLength, lowerLengthChangeMetres: b.lowerLength - a.lowerLength, shoulderWristLengthChangeMetres: b.shoulderWristLength - a.shoulderWristLength,
      inverseShoulderRotationElbowResidualMetres: undoneE.distanceTo(V(a.elbow)), inverseShoulderRotationWristResidualMetres: undoneW.distanceTo(V(a.wrist)),
      inverseShoulderRotationBendDot: rb.direction.dot(cb.direction), inverseThenAxisAlignedBendDot: rb.direction.dot(aligned),
      signedResidualBendRotationDegrees: deg(Math.atan2(rb.axis.dot(rb.direction.clone().cross(aligned)), rb.direction.dot(aligned))),
      armBoneOrientationResidualDegrees: orientationResidual,
      referenceNearContact: a.palm.minY <= nearY, candidateNearContact: b.palm.minY <= nearY,
      palmCentroidChangeMetres: dist(a.palm.centroid, b.palm.centroid), palmMinYChangeMetres: b.palm.minY - a.palm.minY,
      referenceHandMinY: a.hand.minY, candidateHandMinY: b.hand.minY,
    };
  }
  rows.push(row);
}
for (const side of sides) {
  const all = rows.slice(0, -1).map(r => r.sides[side]), airborne = all.filter(r => r.airborne), eligible = all.filter(r => r.eligible), contact = all.filter(r => r.referenceNearContact);
  const summary = {
    airborneSamples: airborne.length, eligibleBendSamples: eligible.length,
    shoulderOpeningReferenceDegrees: range(airborne.map(r => r.referenceShoulderOpeningDegrees)), shoulderOpeningCandidateDegrees: range(airborne.map(r => r.candidateShoulderOpeningDegrees)),
    shoulderOpeningReductionDegrees: stats(airborne.map(r => r.shoulderOpeningReductionDegrees)), maxInferredShoulderRotationDegrees: max(all.map(r => r.inferredMinimalShoulderRotationDegrees)),
    maxShoulderDisplacementMetres: max(all.map(r => r.shoulderDisplacementMetres)), maxElbowDisplacementMetres: max(all.map(r => r.elbowDisplacementMetres)), maxWristDisplacementMetres: max(all.map(r => r.wristDisplacementMetres)),
    elbowYChangeMetres: range(all.map(r => r.elbowYChangeMetres)), wristYChangeMetres: range(all.map(r => r.wristYChangeMetres)),
    maxAbsoluteElbowAngleChangeDegrees: max(all.map(r => Math.abs(r.elbowAngleChangeDegrees))),
    maxAbsoluteUpperLengthChangeMetres: max(all.map(r => Math.abs(r.upperLengthChangeMetres))), maxAbsoluteLowerLengthChangeMetres: max(all.map(r => Math.abs(r.lowerLengthChangeMetres))), maxAbsoluteShoulderWristLengthChangeMetres: max(all.map(r => Math.abs(r.shoulderWristLengthChangeMetres))),
    maxInverseRotationElbowResidualMetres: max(all.map(r => r.inverseShoulderRotationElbowResidualMetres)), maxInverseRotationWristResidualMetres: max(all.map(r => r.inverseShoulderRotationWristResidualMetres)),
    inverseRotationBendDot: range(eligible.map(r => r.inverseShoulderRotationBendDot)), inverseThenAxisAlignedBendDot: range(eligible.map(r => r.inverseThenAxisAlignedBendDot)),
    oppositeBendSamples: eligible.filter(r => r.inverseThenAxisAlignedBendDot < 0).length, signedResidualBendRotationDegrees: range(eligible.map(r => r.signedResidualBendRotationDegrees)),
    maxArmBoneOrientationResidualDegrees: Object.fromEntries(['UpperArm', 'Forearm', 'Hand'].map(n => [n, max(all.map(r => r.armBoneOrientationResidualDegrees[n]))])),
    referenceContactSamples: contact.length, contactClassificationChanges: all.filter(r => r.referenceNearContact !== r.candidateNearContact).length,
    maxContactPalmCentroidChangeMetres: max(contact.map(r => r.palmCentroidChangeMetres)), maxContactElbowChangeMetres: max(contact.map(r => r.elbowDisplacementMetres)), maxContactWristChangeMetres: max(contact.map(r => r.wristDisplacementMetres)),
    referenceContactRanges: runs(rows, r => r.sides[side].referenceNearContact), candidateContactRanges: runs(rows, r => r.sides[side].candidateNearContact),
    largestReductionSamples: rows.slice(0, -1).filter(r => r.sides[side].airborne).sort((a, b) => b.sides[side].shoulderOpeningReductionDegrees - a.sides[side].shoulderOpeningReductionDegrees).slice(0, 3).map(r => ({ frame: r.frame, phase: r.phase, ...r.sides[side] })),
  };
  summaries[side] = summary;
  if (summary.oppositeBendSamples) flags.push({ side, issue: 'opposite-bend-halfspace-after-undoing-shoulder-rotation' });
  if (summary.maxShoulderDisplacementMetres > .001) flags.push({ side, issue: 'shoulder-moves-over-1mm' });
  if (summary.maxInverseRotationWristResidualMetres > .001 || summary.maxInverseRotationElbowResidualMetres > .001) flags.push({ side, issue: 'arm-is-not-rigid-under-minimal-shoulder-rotation-at-1mm-tolerance' });
  if (summary.maxAbsoluteElbowAngleChangeDegrees > .1) flags.push({ side, issue: 'elbow-angle-changes-over-0.1deg' });
  if (Math.max(summary.maxAbsoluteUpperLengthChangeMetres, summary.maxAbsoluteLowerLengthChangeMetres, summary.maxAbsoluteShoulderWristLengthChangeMetres) > .001) flags.push({ side, issue: 'arm-span-changes-over-1mm' });
  if (summary.contactClassificationChanges || summary.maxContactPalmCentroidChangeMetres > .001 || summary.maxContactWristChangeMetres > .001) flags.push({ side, issue: 'reference-contact-or-landing-window-changed' });
  if (summary.shoulderOpeningReductionDegrees?.min < -.1) flags.push({ side, issue: 'some-airborne-shoulder-openings-increase-over-0.1deg' });
  if (summary.maxArmBoneOrientationResidualDegrees.Hand > .1) flags.push({ side, issue: 'hand-orientation-does-not-follow-inferred-rigid-shoulder-rotation-within-0.1deg' });
}
if (candidate.nonFiniteMatrices) flags.push({ issue: 'non-finite-bone-matrices' });
if (candidate.seam.bonePositionMaxMetres > .001 || candidate.seam.boneRotationMaxDegrees > .01) flags.push({ issue: 'candidate-loop-seam' });
if (fixed.maxNonArmBoneOriginChangeMetres > .001 || fixed.maxNonArmLandmarkChangeMetres > .001 || fixed.maxNonArmBoneRotationChangeDegrees > .01) flags.push({ issue: 'body-or-non-arm-bones-change' });
const report = {
  format: 'flare-shoulder-recovery-audit-v1', generatedAt: new Date().toISOString(), reference: reference.asset, candidate: candidate.asset,
  intervals: args.intervals, samplesIncludingEnd: rows.length, verdict: flags.length ? 'shoulder-recovery-review-needed' : 'shoulder-only-rigid-recovery-preservation-clear',
  definitions: {
    openingAngle: 'Unsigned 3D angle between actual Shoulder→Elbow upper-arm vector and same-side Shoulder→Hip body-down vector. A positive reduction means the arm moves toward that body-down axis. No ideal real-athlete angle is asserted.',
    shoulderRotation: 'Minimal quaternion rotating reference Shoulder→Elbow direction onto candidate direction. Its fit uses no wrist or bend vector. Applying its inverse to candidate wrist/elbow tests rigid-arm preservation independently of unsigned elbow angle.',
    bendDirection: 'Project elbow away from the Shoulder→Wrist axis. Compare normalized reference/candidate bend after undoing inferred shoulder rotation; also minimally align the remaining wrist axis before signed dot/cross. Negative dot means opposite bend halfspace.',
    directionEligibility: 'Both actual hand-skin minima >0.056m and both projected bend radii >=0.005m. Near-straight arms do not determine a robust plane.',
    positions: 'Actual bone world origins (UpperArm shoulder, Forearm elbow, Hand wrist, Thigh hip). Rig landmarks are separately transported by bone world*rest-inverse matrices. All quaternion angle comparisons normalize first.',
    surfaces: 'All actual hand vertices with >0.7 Hand influence, plus fixed central palmar patch (15%-55% finger length and4mm palmar depth), skinned at every sampled phase. Palm minY<=0.011m defines near-contact; this is not force or handLocked.',
    preservation: 'Non-arm bones exclude only UpperArm/Forearm/Hand on each side; Scapula, head/spine/pelvis/legs remain in the fixed-body check. Shoulder landmarks stay checked.',
    orientationResidual: 'Actual bone world rotation compared with inferred shoulder quaternion times reference rotation. Upper-arm/forearm residuals expose skin twist even when point trajectories look rigid; hand residual is a preservation check.',
    tolerances: 'Engineering comparisons only:1mm positions/spans,0.1deg elbow/hand orientation,0.01deg fixed-body rotation/seam. Not biomechanical standards.',
  },
  limitations: ['Equal normalized phase assumes these candidates retain the R1 timing map.', 'This focused audit does not re-run all-body floor/self-collision, forces or visual acceptance.', 'Bend direction is excluded near straightness; raw samples retain all measurements.'],
  finite: { referenceNonFiniteMatrices: reference.nonFiniteMatrices, candidateNonFiniteMatrices: candidate.nonFiniteMatrices },
  seam: { reference: reference.seam, candidate: candidate.seam }, fixedBody: fixed, sides: summaries, flags,
};
fs.mkdirSync(args.out, { recursive: true });
fs.writeFileSync(path.join(args.out, 'shoulder-summary.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(args.out, 'shoulder-samples.json'), JSON.stringify(rows) + '\n');
console.log(JSON.stringify({ verdict: report.verdict, report: path.join(args.out, 'shoulder-summary.json'), candidateSha256: candidate.asset.sha256, fixedBody: fixed,
  sides: Object.fromEntries(sides.map(s => [s, { ...summaries[s], largestReductionSamples: undefined }])), flags }, null, 2));
