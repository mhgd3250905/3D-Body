// Signed elbow-plane comparison of actual baked GLBs. No animation/source changes.
// --mode preserve checks a pole-only change; diagnose records R1/R2 direction changes.
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
  candidate: path.join(root, 'output/flare-v42-r3-20261015/flare-coach-v42-candidate.glb'),
  out: path.join(root, 'output/flare-v42-r3-20261015/agent-elbow/r3-vs-r1-coach'),
  intervals: 540, mode: 'preserve', minBend: .005, airborneY: .056,
};
const numeric = new Set(['intervals', 'minBend', 'airborneY']);
const keys = new Map([['--reference', 'reference'], ['--candidate', 'candidate'], ['--out', 'out'], ['--intervals', 'intervals'], ['--mode', 'mode'], ['--min-bend', 'minBend'], ['--airborne-y', 'airborneY']]);
for (let i = 2; i < process.argv.length; i++) {
  const key = keys.get(process.argv[i]), value = process.argv[++i];
  if (!key || value === undefined) throw new Error('Expected a named argument and its value');
  args[key] = numeric.has(key) ? Number(value) : ['reference', 'candidate', 'out'].includes(key) ? path.resolve(value) : value;
}
if (!Number.isInteger(args.intervals) || args.intervals < 24 || args.intervals > 3600) throw new Error('Invalid intervals');
if (!['preserve', 'diagnose'].includes(args.mode)) throw new Error('mode must be preserve or diagnose');
for (const key of ['reference', 'candidate']) if (!fs.existsSync(args[key])) throw new Error(`${key} not found: ${args[key]}`);
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const rig = JSON.parse(fs.readFileSync(path.join(root, 'app/scene/source/coach/coach-v41-rig.json'), 'utf8'));
const V = a => new THREE.Vector3(...a), degrees = x => x * 180 / Math.PI;
const sides = ['left', 'right'], down = new THREE.Vector3(0, -1, 0);
const range = a => a.length ? { min: Math.min(...a), max: Math.max(...a) } : null;
const max = a => a.length ? Math.max(...a) : 0;
const delta = (a, b) => V(a).distanceTo(V(b));
const angle = (s, e, w) => degrees(V(s).sub(V(e)).angleTo(V(w).sub(V(e))));
function runs(rows, predicate) {
  const out = []; let run = null;
  for (let i = 0; i < rows.length - 1; i++) {
    if (predicate(rows[i])) { run ??= { firstFrame: i, lastFrame: i }; run.lastFrame = i; }
    else if (run) { out.push(run); run = null; }
  }
  if (run) out.push(run);
  return out.map(r => ({ ...r, firstPhase: rows[r.firstFrame].phase, lastPhase: rows[r.lastFrame].phase, samples: r.lastFrame - r.firstFrame + 1 }));
}
async function sample(file) {
  const bytes = fs.readFileSync(file), sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const raw = bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes;
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
  const model = gltf.scene, clip = [...gltf.animations].sort((a, b) => b.tracks.length - a.tracks.length)[0];
  if (!clip || clip.duration <= 0) throw new Error('Missing animation');
  model.updateMatrixWorld(true);
  const bones = new Map(), meshes = [];
  model.traverse(o => { if (o.isBone) bones.set(o.name, o); if (o.isSkinnedMesh) { meshes.push(o); o.skeleton.update(); } });
  for (const side of sides) for (const name of ['UpperArm', 'Forearm', 'Hand']) if (!bones.has(side + name)) throw new Error('Missing bone ' + side + name);
  const rest = new Map([...bones].map(([n, b]) => [n, b.matrixWorld.clone().invert()]));
  const landmarks = Object.fromEntries(Object.entries(rig.landmarks).map(([name, p]) => [name, { point: V(p), bone: ['pelvis', 'torso', 'neck', 'head'].includes(name) ? name : name.replace(/Shoulder$/, 'UpperArm').replace(/Elbow$/, 'Forearm').replace(/Wrist$/, 'Hand').replace(/Hip$/, 'Thigh').replace(/Knee$/, 'Shin').replace(/Ankle$/, 'Foot') }]));
  landmarks.shoulderCenter = landmarks.torso;
  landmarks.waist = { point: V(rig.landmarks.pelvis).lerp(V(rig.landmarks.torso), .3), bone: 'pelvis' };
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
    if (!hand[side].length) throw new Error('No actual hand vertices for ' + side);
    const sign = side === 'left' ? 1 : -1, wrist = V(rig.landmarks[side + 'Wrist']);
    const finger = new THREE.Vector3(sign * .98253144, .05483374, .17783482).normalize(), normal = new THREE.Vector3(sign * .06068526, -.99777448, -.02762938);
    normal.addScaledVector(finger, -normal.dot(finger)).normalize();
    const length = max(hand[side].map(r => r.rest.clone().sub(wrist).dot(finger)));
    const thickness = max(hand[side].map(r => r.rest.clone().sub(wrist).dot(normal)));
    landmarks[side + 'Palm'] = { point: wrist.clone().addScaledVector(finger, THREE.MathUtils.clamp(length * .3, .04, .075)).addScaledVector(normal, thickness), bone: side + 'Hand' };
    const central = hand[side].filter(r => { const d = r.rest.clone().sub(wrist).dot(finger); return d >= length * .15 && d <= length * .55; });
    const depth = max(central.map(r => r.rest.clone().sub(wrist).dot(normal)));
    palm[side] = central.filter(r => r.rest.clone().sub(wrist).dot(normal) >= depth - .004);
    const footRest = bones.get(side + 'Foot').quaternion.clone();
    landmarks[side + 'Toe'] = { point: V(rig.landmarks[side + 'Ankle']).add(new THREE.Vector3(0, 0, .18).applyQuaternion(footRest)), bone: side + 'Foot' };
  }
  const mixer = new THREE.AnimationMixer(model), action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  const rows = [], measure = refs => { let minY = Infinity; const centroid = new THREE.Vector3(); for (const r of refs) { r.mesh.getVertexPosition(r.index, point).applyMatrix4(r.mesh.matrixWorld); minY = Math.min(minY, point.y); centroid.add(point); } return { minY, centroid: centroid.divideScalar(refs.length).toArray() }; };
  for (let i = 0; i <= args.intervals; i++) {
    const phase = i / args.intervals, time = phase * clip.duration;
    action.enabled = true; action.paused = false; mixer.setTime(time); model.updateMatrixWorld(true); for (const m of meshes) m.skeleton.update();
    const positions = Object.fromEntries([...bones].map(([n, b]) => [n, b.getWorldPosition(point).toArray()]));
    const deltas = new Map([...bones].map(([n, b]) => [n, b.matrixWorld.clone().multiply(rest.get(n))]));
    const joints = Object.fromEntries(Object.entries(landmarks).map(([n, l]) => [n, l.point.clone().applyMatrix4(deltas.get(l.bone)).toArray()]));
    const arms = {};
    for (const side of sides) {
      const shoulder = positions[side + 'UpperArm'], elbow = positions[side + 'Forearm'], wrist = positions[side + 'Hand'];
      const axis = V(wrist).sub(V(shoulder)).normalize(), offset = V(elbow).sub(V(shoulder));
      const projection = offset.dot(axis), bend = offset.clone().addScaledVector(axis, -projection);
      arms[side] = { shoulder, elbow, wrist, shoulderWristDistance: delta(shoulder, wrist), upperLength: delta(shoulder, elbow), lowerLength: delta(elbow, wrist), elbowAngleDegrees: angle(shoulder, elbow, wrist), axis: axis.toArray(), bend: bend.toArray(), bendRadius: bend.length(), bendUnit: bend.clone().normalize().toArray(), hand: measure(hand[side]), palm: measure(palm[side]) };
    }
    rows.push({ frame: i, phase, time, positions, joints, arms });
  }
  mixer.stopAllAction(); mixer.uncacheRoot(model);
  return { asset: { path: file, sha256, bytes: bytes.length, clip: clip.name, duration: clip.duration }, rows };
}
const reference = await sample(args.reference), candidate = await sample(args.candidate);
const rows = [], summaries = {}, flags = [];
for (let i = 0; i <= args.intervals; i++) {
  const r = reference.rows[i], c = candidate.rows[i], row = { frame: i, phase: r.phase, referenceTime: r.time, candidateTime: c.time, sides: {} };
  for (const side of sides) {
    const a = r.arms[side], b = c.arms[side], ra = V(a.axis), ca = V(b.axis), rb = V(a.bendUnit), cb = V(b.bendUnit);
    const axisAngle = degrees(ra.angleTo(ca)), aligned = cb.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(ca, ra)).normalize();
    const directDot = rb.dot(cb), alignedDot = rb.dot(aligned);
    const reliable = a.bendRadius >= args.minBend && b.bendRadius >= args.minBend && axisAngle < 170;
    const bothAirborne = a.hand.minY > args.airborneY && b.hand.minY > args.airborneY;
    row.sides[side] = { reliable, bothAirborne, eligible: reliable && bothAirborne, directDot, axisAlignedDot: alignedDot,
      signedRotationAboutReferenceAxisDegrees: degrees(Math.atan2(ra.dot(rb.clone().cross(aligned)), alignedDot)), axisAngleDegrees: axisAngle,
      referenceBendRadius: a.bendRadius, candidateBendRadius: b.bendRadius, referenceBendWorldDownMetres: V(a.bend).dot(down), candidateBendWorldDownMetres: V(b.bend).dot(down),
      elbowWorldYChangeMetres: b.elbow[1] - a.elbow[1], elbowDisplacementMetres: delta(a.elbow, b.elbow),
      shoulderDisplacementMetres: delta(a.shoulder, b.shoulder), wristDisplacementMetres: delta(a.wrist, b.wrist), shoulderWristDistanceChangeMetres: b.shoulderWristDistance - a.shoulderWristDistance,
      elbowAngleChangeDegrees: b.elbowAngleDegrees - a.elbowAngleDegrees, referenceElbowAngleDegrees: a.elbowAngleDegrees, candidateElbowAngleDegrees: b.elbowAngleDegrees,
      referenceHandMinY: a.hand.minY, candidateHandMinY: b.hand.minY, palmCentroidDisplacementMetres: delta(a.palm.centroid, b.palm.centroid),
      referenceNearContact: a.palm.minY <= .011, candidateNearContact: b.palm.minY <= .011 };
  }
  rows.push(row);
}
const core = { maxNonElbowLandmarkDisplacementMetres: 0, worstLandmark: null, worstFrame: null, maxNonForearmBoneOriginDisplacementMetres: 0, worstBone: null };
for (let i = 0; i <= args.intervals; i++) {
  for (const name of Object.keys(reference.rows[i].joints)) if (!['leftElbow', 'rightElbow'].includes(name)) {
    const d = delta(reference.rows[i].joints[name], candidate.rows[i].joints[name]);
    if (d > core.maxNonElbowLandmarkDisplacementMetres) Object.assign(core, { maxNonElbowLandmarkDisplacementMetres: d, worstLandmark: name, worstFrame: i });
  }
  for (const name of Object.keys(reference.rows[i].positions)) if (!['leftForearm', 'rightForearm'].includes(name)) {
    const d = delta(reference.rows[i].positions[name], candidate.rows[i].positions[name]);
    if (d > core.maxNonForearmBoneOriginDisplacementMetres) Object.assign(core, { maxNonForearmBoneOriginDisplacementMetres: d, worstBone: name });
  }
}
for (const side of sides) {
  const all = rows.slice(0, -1).map(r => r.sides[side]), eligible = all.filter(r => r.eligible), contact = all.filter(r => r.referenceNearContact);
  const summary = {
    eligibleAirborneSamples: eligible.length, excludedNearStraightOrAxisAmbiguousSamples: all.filter(r => !r.reliable).length,
    directDot: range(eligible.map(r => r.directDot)), axisAlignedDot: range(eligible.map(r => r.axisAlignedDot)), signedRotationDegrees: range(eligible.map(r => r.signedRotationAboutReferenceAxisDegrees)),
    directOppositeSamples: eligible.filter(r => r.directDot < 0).length, axisAlignedOppositeSamples: eligible.filter(r => r.axisAlignedDot < 0).length,
    directOppositeRanges: runs(rows, r => r.sides[side].eligible && r.sides[side].directDot < 0), alignedOppositeRanges: runs(rows, r => r.sides[side].eligible && r.sides[side].axisAlignedDot < 0),
    elbowAngleReferenceDegrees: range(eligible.map(r => r.referenceElbowAngleDegrees)), elbowAngleCandidateDegrees: range(eligible.map(r => r.candidateElbowAngleDegrees)),
    maxAbsElbowAngleChangeDegrees: max(all.map(r => Math.abs(r.elbowAngleChangeDegrees))), maxElbowDisplacementMetres: max(all.map(r => r.elbowDisplacementMetres)), elbowWorldYChangeMetres: range(all.map(r => r.elbowWorldYChangeMetres)),
    maxShoulderDisplacementMetres: max(all.map(r => r.shoulderDisplacementMetres)), maxWristDisplacementMetres: max(all.map(r => r.wristDisplacementMetres)), maxAbsShoulderWristDistanceChangeMetres: max(all.map(r => Math.abs(r.shoulderWristDistanceChangeMetres))),
    referenceContactSamples: contact.length, changedContactClassificationSamples: all.filter(r => r.referenceNearContact !== r.candidateNearContact).length,
    maxContactPalmCentroidDisplacementMetres: max(contact.map(r => r.palmCentroidDisplacementMetres)), maxContactElbowDisplacementMetres: max(contact.map(r => r.elbowDisplacementMetres)),
    worstDirectionSamples: rows.slice(0, -1).filter(r => r.sides[side].eligible).sort((a, b) => a.sides[side].axisAlignedDot - b.sides[side].axisAlignedDot).slice(0, 5).map(r => ({ frame: r.frame, phase: r.phase, ...r.sides[side] })),
  };
  summaries[side] = summary;
  if (summary.axisAlignedOppositeSamples) flags.push({ side, issue: 'opposite-bend-halfspace', samples: summary.axisAlignedOppositeSamples });
  if (args.mode === 'preserve') {
    if (summary.maxWristDisplacementMetres > .001 || summary.maxShoulderDisplacementMetres > .001) flags.push({ side, issue: 'shoulder-or-wrist-trajectory-change-over-1mm' });
    if (summary.maxAbsShoulderWristDistanceChangeMetres > .001) flags.push({ side, issue: 'shoulder-wrist-distance-change-over-1mm' });
    if (summary.maxAbsElbowAngleChangeDegrees > .1) flags.push({ side, issue: 'elbow-angle-change-over-0.1deg' });
    if (summary.maxContactPalmCentroidDisplacementMetres > .001 || summary.changedContactClassificationSamples) flags.push({ side, issue: 'contact-changed' });
  }
}
if (args.mode === 'preserve' && core.maxNonElbowLandmarkDisplacementMetres > .001) flags.push({ issue: 'non-elbow-landmark-change-over-1mm' });
const report = {
  format: 'flare-elbow-direction-audit-v1', generatedAt: new Date().toISOString(), mode: args.mode,
  reference: reference.asset, candidate: candidate.asset, intervals: args.intervals, samplesIncludingEnd: rows.length,
  verdict: flags.length ? 'direction-or-preservation-review-required' : args.mode === 'preserve' ? 'same-halfspace-and-pole-only-preservation-clear' : 'no-opposite-halfspace-in-eligible-samples',
  definitions: {
    positions: 'Actual UpperArm/Forearm/Hand bone world origins give shoulder/elbow/wrist. Additional rig landmarks are independently transported by each actual bone world * rest inverse.',
    bend: 'u=normalize(wrist-shoulder); b=(elbow-shoulder)-u*dot(elbow-shoulder,u). A signed comparison uses normalized b, not only unsigned elbow angle.',
    directDot: 'Dot of the two world-space normalized bend vectors at equal normalized phase. Negative means opposite world bending directions.',
    axisAlignedDot: 'Candidate bend is minimally rotated from candidate shoulder-wrist axis to the reference axis before dot/cross. This distinguishes changed arm aim from a changed bending halfspace. Negative means opposite halfspace in the common arm plane.',
    signedRotation: 'atan2(referenceAxis dot cross(referenceBend, alignedCandidateBend), dot). Its sign follows the reference shoulder-to-wrist right-hand convention.',
    reliable: `Both bend radii >=${args.minBend}m and arm-axis difference <170deg. Near-straight arms do not define a robust bending direction.`,
    airborne: `Both actual skinned hand minima >${args.airborneY}m. No handLocked/phase-label support inference.`,
    contact: 'Actual fixed central palmar vertex patch, same15%-55% hand-length/4mm palmar-depth definition as existing audit, minY<=0.011m.',
    preserveTolerances: '1mm shoulder/wrist/non-elbow landmark displacement and shoulder-wrist length;0.1deg elbow-angle difference. These are engineering comparison bounds, not human biomechanics standards.',
  },
  limitations: ['Equal normalized phase is valid only for these same1.35s candidate timing maps; no cross-source motion registration is inferred.', 'This is directional/trajectory validation only, not complete self-collision or force/clinical analysis.', 'All previous assets and audit scripts remain unchanged.'],
  corePreservation: core, sides: summaries, flags,
};
fs.mkdirSync(args.out, { recursive: true });
fs.writeFileSync(path.join(args.out, 'direction-summary.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(args.out, 'direction-samples.json'), JSON.stringify(rows) + '\n');
console.log(JSON.stringify({ verdict: report.verdict, report: path.join(args.out, 'direction-summary.json'), referenceSha256: reference.asset.sha256, candidateSha256: candidate.asset.sha256, corePreservation: core, sides: Object.fromEntries(sides.map(s => [s, { ...summaries[s], worstDirectionSamples: undefined }])), flags }, null, 2));
