// v35 (user after v34: "侧面、前面或许要整体下降一个高度级别，现在看起来都有点像低一点的 airflare 了"):
// the side supports and the front should both come down about one whole height level, with the
// legs circling closer to horizontal (a flare, not a low airflare).
// Post-pass on flare-sequence-before-v35.json (= v34). Per key, in this order (chest roll runs right
// after the trunk swing):
//   1. trunk swing: the pelvis, trunk, legs (and on a single-arm key the free arm) rotate down about
//      a horizontal line through the SUPPORT shoulder (single support: the line is horizontal and
//      perpendicular to the shoulder->hip direction; double support at the front: the shoulder line,
//      as in v34). The support shoulder, the planted arm, its wrist, elbow pole, hand orientation and
//      floor spot never move, so the v30-v33 plant work is kept.
//   2. leg roll: both legs rotate together (each about its own hip joint) about their bisector, so the
//      high leg comes down and the low leg comes up (the straddle and the pike stay, the V plane tips
//      toward horizontal). Signed: keys 5-7 turn opposite to keys 1-3 (mirrored half).
//   3. bisector lower: both legs swing down together about a horizontal line (each about its own hip),
//      perpendicular to the bisector's heading (the V keeps its shape, its centre line comes down).
//   4. leg drop: both legs swing down about the hip line (v34's leg-only drop).
//   5/6. optional single-leg trims: the high leg lowered / the low leg lifted in its own vertical plane.
//   7. low-ankle floor: if the low ankle ends below this height (cm), the low leg is lifted in its own
//      vertical plane until it reaches it. A hooked foot needs ~23 cm of ankle height to clear the floor;
//      below that the runtime floor guard lifts the ankle and the knee bends, so this keeps legs straight.
//   Knee poles: after the moves every knee pole is rebuilt at the same angle, offset and position along
//   the hip->ankle line that it had in v34, measured against world up (v34 keys 1/2/6/7 keep their knees
//   'up'; rotating the pole with the leg flipped the shin twist mid-segment).
//   8. high-foot hook: the higher leg's foot opens by this angle about its ankle hinge (keeps the
//      in-between hook inside 75-98 deg where the high leg now travels a longer arc between keys).
//   9. low-foot hook: the same for the lower leg's foot (negative closes it).
//   10. chest roll (single-arm keys, applied right after the trunk swing): the whole body except the
//      planted arm rolls about the support-shoulder -> hip line, so the free shoulder and free arm come
//      down toward the floor (the chest turns from a vertical side plank toward the floor); the hips stay
//      on the line, so their height does not change.
// Keys 0 and 8 (back) are left untouched.
//
// usage: node tools/rekey/v35-lower-level.mjs [spec]
//   spec: "key:trunk/roll/bis/drop/hi/lo/ankleMinCm/hook/hookLow/chest,..." in degrees (DEF below is the committed v35)
import fs from 'node:fs';
import * as THREE from 'three';
import { motion } from './lib.mjs';
const R = new URL('../../', import.meta.url).pathname;
const DEF = '1:10/10/0/0/0/12/27/-2/-3,2:18/-40/0/0/0/0/27/6/-2/20,3:14,4:14/0/0/2,5:14,6:18/-30/0/0/14/-4/27/4/-6/10,7:6/0/0/4/20/0/27';
const SPEC = Object.fromEntries((process.argv[2] ?? DEF).split(',').filter(Boolean).map(p => { const [k, v] = p.split(':'); return [+k, v.split('/').map(Number)]; }));
const d = JSON.parse(fs.readFileSync(R + 'public/coach/flare-sequence-before-v35.json', 'utf8'));
const g = motion.group, W = n => g.getObjectByName(n).getWorldPosition(new THREE.Vector3());
const V = a => new THREE.Vector3(...a), Q = a => new THREE.Quaternion(...a);
const r6 = x => Math.round(x * 1e6) / 1e6;
const SIDES = ['left', 'right'];
// rotation about (pivot, axis) by |deg|, sign chosen so probe(pose) goes down
function rotator(pivot, axis, deg, probePoint) {
  const t = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(Math.abs(deg)));
  const moved = probePoint.clone().sub(pivot).applyQuaternion(t).add(pivot);
  const sgn = (moved.y < probePoint.y) === (deg >= 0) ? 1 : -1;
  const q = new THREE.Quaternion().setFromAxisAngle(axis, sgn * THREE.MathUtils.degToRad(Math.abs(deg)));
  return { P: a => V(a).sub(pivot).applyQuaternion(q).add(pivot).toArray().map(r6), O: a => q.clone().multiply(Q(a)).normalize().toArray().map(r6) };
}
function moveLegs(pose, { P, O }) {
  for (const s of SIDES) { const L = pose.limbs[s]; L.ankle = P(L.ankle); if (L.kneePole) L.kneePole = P(L.kneePole); L.footQuaternion = O(L.footQuaternion); }
}
function moveBody(pose, rot, freeSides) {
  pose.pelvis = rot.P(pose.pelvis);
  for (const k of ['bodyQuaternion', 'pelvisQuaternion', 'torsoQuaternion']) if (pose[k]) pose[k] = rot.O(pose[k]);
  moveLegs(pose, rot);
  for (const s of freeSides) { const L = pose.limbs[s]; L.wrist = rot.P(L.wrist); if (L.elbowPole) L.elbowPole = rot.P(L.elbowPole); L.handQuaternion = rot.O(L.handQuaternion); }
}
// rotate both legs by the same rotation, each about its own hip joint (directions turn exactly by q,
// leg lengths and the shin-foot hook are kept)
function turnLegs(pose, axis, deg, probe, signed = false) {
  const hips = Object.fromEntries(SIDES.map(s => [s, W(s + 'Thigh')]));
  let q;
  if (signed) q = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(deg));
  else {
    const t = new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(Math.abs(deg)));
    const ps = probe.side, a = V(pose.limbs[ps].ankle), m = a.clone().sub(hips[ps]).applyQuaternion(t).add(hips[ps]);
    const sgn = (m.y < a.y) === (deg >= 0) ? 1 : -1;
    q = new THREE.Quaternion().setFromAxisAngle(axis, sgn * THREE.MathUtils.degToRad(Math.abs(deg)));
  }
  for (const s of SIDES) {
    const L = pose.limbs[s], h = hips[s], P = x => V(x).sub(h).applyQuaternion(q).add(h).toArray().map(r6);
    L.ankle = P(L.ankle); if (L.kneePole) L.kneePole = P(L.kneePole); L.footQuaternion = q.clone().multiply(Q(L.footQuaternion)).normalize().toArray().map(r6);
  }
}
function poleFrame(pose, s) {
  const h = W(s + 'Thigh'), an = V(pose.limbs[s].ankle), ax = an.clone().sub(h).normalize();
  const up = new THREE.Vector3(0, 1, 0); up.addScaledVector(ax, -up.dot(ax)).normalize();
  return { h, an, ax, up, side: ax.clone().cross(up) };
}
const sample = pose => { motion.applyPose(pose); g.updateMatrixWorld(true); };
const legSwing = (pose, s, deg) => {
  // one leg about its own hip joint, in its vertical plane; +deg lowers it, -deg raises it
  const hip = W(s + 'Thigh'), L = pose.limbs[s], dir = V(L.ankle).sub(hip); dir.y = 0;
  const rot = rotator(hip, new THREE.Vector3(0, 1, 0).cross(dir).normalize(), deg, V(L.ankle));
  L.ankle = rot.P(L.ankle); if (L.kneePole) L.kneePole = rot.P(L.kneePole); L.footQuaternion = rot.O(L.footQuaternion);
};
for (const [k, [trunk, roll = 0, bis = 0, drop = 0, hi = 0, lo = 0, ankleMin = 0, hook = 0, hookLow = 0, chest = 0]] of Object.entries(SPEC)) {
  const pose = d.steps[k].pose;
  sample(pose);
  const pole0 = Object.fromEntries(SIDES.map(s => {
    const F = poleFrame(pose, s), off = V(pose.limbs[s].kneePole).sub(F.h), t = off.dot(F.ax) / F.h.distanceTo(F.an);
    off.addScaledVector(F.ax, -off.dot(F.ax));
    return [s, { t, x: off.dot(F.up), y: off.dot(F.side) }];
  }));
  const planted = SIDES.filter(s => pose.limbs[s].handLocked), free = SIDES.filter(s => !pose.limbs[s].handLocked);
  if (trunk) {
    sample(pose);
    const hip = W('leftThigh').add(W('rightThigh')).multiplyScalar(0.5);
    let pivot, axis;
    if (planted.length === 1) {
      pivot = W(planted[0] + 'UpperArm');
      const h = hip.clone().sub(pivot); h.y = 0;
      axis = new THREE.Vector3(0, 1, 0).cross(h).normalize();
    } else {
      const sl = W('leftUpperArm'), sr = W('rightUpperArm');
      pivot = sl.clone().add(sr).multiplyScalar(0.5); axis = sr.clone().sub(sl).normalize();
    }
    moveBody(pose, rotator(pivot, axis, trunk, hip), free);
  }
  if (chest && planted.length === 1) {
    sample(pose);
    const pivot = W(planted[0] + 'UpperArm'), hip = W('leftThigh').add(W('rightThigh')).multiplyScalar(0.5);
    moveBody(pose, rotator(pivot, hip.clone().sub(pivot).normalize(), chest, W(free[0] + 'UpperArm')), free);
  }
  const legDirs = () => { const hl = W('leftThigh'), hr = W('rightThigh'); return { hc: hl.clone().add(hr).multiplyScalar(0.5), al: W('leftFoot'), ar: W('rightFoot'), bis: W('leftFoot').sub(hl).normalize().add(W('rightFoot').sub(hr).normalize()).normalize() }; };
  if (roll) {
    // explicit handedness: +roll turns the legs right-handed about the bisector;
    // keys 5-7 are the mirrored half of the loop, so their roll turns the other way
    sample(pose); const { bis: ax } = legDirs();
    turnLegs(pose, ax, (+k >= 5 ? -1 : 1) * roll, null, true);
  }
  if (bis) { sample(pose); const { bis: b } = legDirs(); const h = b.clone(); h.y = 0; turnLegs(pose, new THREE.Vector3(0, 1, 0).cross(h).normalize(), bis, { side: pose.limbs.left.ankle[1] > pose.limbs.right.ankle[1] ? 'left' : 'right' }); }
  const high = pose.limbs.left.ankle[1] > pose.limbs.right.ankle[1] ? 'left' : 'right', low = high === 'left' ? 'right' : 'left';
  if (hi) { sample(pose); legSwing(pose, high, hi); }
  if (lo) { sample(pose); legSwing(pose, low, -lo); }
  if (drop) {
    sample(pose);
    const hl = W('leftThigh'), hr = W('rightThigh');
    turnLegs(pose, hr.clone().sub(hl).normalize(), drop, { side: pose.limbs.left.ankle[1] > pose.limbs.right.ankle[1] ? 'left' : 'right' });
  }
  if (ankleMin) {
    const lowSide = pose.limbs.left.ankle[1] < pose.limbs.right.ankle[1] ? 'left' : 'right', y = ankleMin / 100;
    if (pose.limbs[lowSide].ankle[1] < y) {
      sample(pose);
      const hip = W(lowSide + 'Thigh'), a = V(pose.limbs[lowSide].ankle), r = a.distanceTo(hip), flat = a.clone().sub(hip); flat.y = 0;
      const now = Math.asin((a.y - hip.y) / r), want = Math.asin(Math.max(-1, (y - hip.y) / r));
      legSwing(pose, lowSide, -THREE.MathUtils.radToDeg(want - now));
    }
  }
  for (const [which, deg] of [['high', hook], ['low', hookLow]]) {
    if (!deg) continue;
    sample(pose);
    const hiSide = pose.limbs.left.ankle[1] > pose.limbs.right.ankle[1] ? 'left' : 'right';
    const s = which === 'high' ? hiSide : (hiSide === 'left' ? 'right' : 'left'), L = pose.limbs[s];
    const shin = W(s + 'Shin').sub(V(L.ankle)).normalize(), toe = new THREE.Vector3(0, 0, 1).applyQuaternion(Q(L.footQuaternion));
    const q = new THREE.Quaternion().setFromAxisAngle(shin.clone().cross(toe).normalize(), THREE.MathUtils.degToRad(deg));
    L.footQuaternion = q.multiply(Q(L.footQuaternion)).normalize().toArray().map(r6);
  }
  sample(pose);
  for (const s of SIDES) {
    const F = poleFrame(pose, s), o = pole0[s];
    pose.limbs[s].kneePole = F.h.clone().addScaledVector(F.ax, o.t * F.h.distanceTo(F.an)).addScaledVector(F.up, o.x).addScaledVector(F.side, o.y).toArray().map(r6);
  }
}
fs.writeFileSync(R + 'public/coach/flare-sequence.json', JSON.stringify(d, null, 2));
console.log('v35 lower level:', JSON.stringify(SPEC));
