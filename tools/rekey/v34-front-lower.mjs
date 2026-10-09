// v34 (user, phone screenshot at the front single-hand support): the lower body is too
// high at the front, hips about level with the shoulders and both legs pointing steeply up.
// Post-pass on flare-sequence-before-v34.json (= v33): around the front (keys 3, 4, 5) the
// hips and legs swing down about the shoulder line, so both shoulders stay exactly where
// they were. The arms, hands, floor spots and the v30-v33 hand-plant work are untouched
// (wrists, elbow poles and hand orientations are not modified); only the pelvis, the trunk
// orientation, the ankles, knee poles and feet rotate. An optional extra drop swings the
// legs alone further down about the hip joints (wider V, closer to horizontal).
//
// usage: node tools/rekey/v34-front-lower.mjs [trunk] [legs]
//   trunk : "key:deg" list, rigid hip+leg swing about the shoulder line (default below)
//   legs  : "key:deg" list, extra leg-only swing about the hip line
import fs from 'node:fs';
import * as THREE from 'three';
import { motion } from './lib.mjs';
const R = new URL('../../', import.meta.url).pathname;
const parse = (s, def) => Object.fromEntries((s ?? def).split(',').filter(Boolean).map(p => p.split(':').map(Number)));
const TRUNK = parse(process.argv[2], '3:6,4:12,5:6'), LEGS = parse(process.argv[3], '3:3,4:7');
const d = JSON.parse(fs.readFileSync(R + 'public/coach/flare-sequence-before-v34.json', 'utf8'));
const g = motion.group, W = n => g.getObjectByName(n).getWorldPosition(new THREE.Vector3());
const V = a => new THREE.Vector3(...a), Q = a => new THREE.Quaternion(...a);
const r6 = x => Math.round(x * 1e6) / 1e6;
// rotate every body/leg field of `pose` about the line (pivot, axis) by `deg`, sign chosen so the hips (or, leg-only, the feet) go down
function swing(pose, pivot, axis, deg, fields) {
  const test = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(Math.abs(deg)));
  // probe: the pelvis for a body swing, the mid-ankle for a leg-only swing
  const probe = fields.body ? V(pose.pelvis) : V(pose.limbs.left.ankle).add(V(pose.limbs.right.ankle)).multiplyScalar(0.5);
  const moved = probe.clone().sub(pivot).applyQuaternion(test).add(pivot);
  const sgn = (moved.y < probe.y) === (deg >= 0) ? 1 : -1;
  const q = new THREE.Quaternion().setFromAxisAngle(axis, sgn * THREE.MathUtils.degToRad(Math.abs(deg)));
  const P = a => V(a).sub(pivot).applyQuaternion(q).add(pivot).toArray().map(r6);
  const O = a => q.clone().multiply(Q(a)).normalize().toArray().map(r6);
  if (fields.body) { pose.pelvis = P(pose.pelvis); for (const k of ['bodyQuaternion', 'pelvisQuaternion', 'torsoQuaternion']) if (pose[k]) pose[k] = O(pose[k]); }
  for (const s of ['left', 'right']) { const L = pose.limbs[s]; L.ankle = P(L.ankle); if (L.kneePole) L.kneePole = P(L.kneePole); L.footQuaternion = O(L.footQuaternion); }
}
const keys = [...new Set([...Object.keys(TRUNK), ...Object.keys(LEGS)].map(Number))];
for (const k of keys) {
  const pose = d.steps[k].pose;
  motion.applyPose(pose); g.updateMatrixWorld(true);
  const sl = W('leftUpperArm'), sr = W('rightUpperArm');
  if (TRUNK[k]) swing(pose, sl.clone().add(sr).multiplyScalar(0.5), sr.clone().sub(sl).normalize(), TRUNK[k], { body: true });
  if (LEGS[k]) {
    motion.applyPose(pose); g.updateMatrixWorld(true);
    const hl = W('leftThigh'), hr = W('rightThigh');
    swing(pose, hl.clone().add(hr).multiplyScalar(0.5), hr.clone().sub(hl).normalize(), LEGS[k], { body: false });
  }
}
// the loop's repeat key mirrors key 0, untouched
fs.writeFileSync(R + 'public/coach/flare-sequence.json', JSON.stringify(d, null, 2));
console.log('v34 front lower: trunk', TRUNK, 'legs', LEGS);
