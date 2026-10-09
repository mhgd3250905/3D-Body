// v36 (user after v35: "髋部高度调整好多了。但是 T2 和 T6，也就是两个侧面的时候，下方的腿要向外伸展，完成一个在外圈扫荡更快的
// 效果——这是托马斯在侧面时需要下方腿离心扫荡提供离心力的原理之一"): at both sides the LOW leg reaches outward, away from
// the rotation axis, and sweeps a wider outer circle instead of tucking forward/under the body.
// Post-pass on flare-sequence-before-v36.json (= v35). Only the two legs (ankles, knee poles, foot orientations) move;
// pelvis, trunk, head, arms, hands and floor spots are untouched, so hip heights and the plant work stay exact.
// Per key, in order:
//   1. roll: both legs rotate together (each about its own hip joint) about their bisector by |roll| deg, in the sense
//      that carries the LOW foot farther from the rotation axis (the vertical line between the two floor spots).
//      The V angle and the pike (trunk vs bisector) are kept exactly; the V plane turns so the low leg is the outer one.
//   2. lowYaw: the low leg alone turns about the vertical through its hip, + = foot farther from the axis.
//   3. lowOpen: the low leg alone turns away from the high leg in the plane of the two legs (+ widens the V).
//   4. hiOpen: the high leg alone turns away from the low leg in the plane of the two legs (+ widens the V).
//   4b. hiYaw: the high leg alone turns about the vertical through its hip, + = high foot nearer the axis (forward).
//   4c. hiHook / loHook: the high / low foot opens (+) or closes (-) about its ankle hinge (in-between hook stays 75-98).
//   4d. hiLift: the high leg turns in its own vertical plane about its hip, + raises it.
//   4e. hiPole: the high knee pole turns about the hip->ankle line by this angle after the rebuild below.
//   5. ankleMin (cm): the low leg is lifted in its own vertical plane until its ankle is at least this high
//      (a hooked foot needs ~23-27 cm of ankle height or the runtime floor guard bends the knee).
//   Knee poles are rebuilt at the same angle/offset/position along hip->ankle (against world up) that they had before.
// usage: node tools/rekey/v36-low-leg-sweep.mjs [spec] [outfile]
//   spec "key:roll/lowYaw/lowOpen/hiOpen/ankleMinCm/hiYaw/hiHook/loHook/hiLift/hiPole,..." (DEF = committed v36)
import fs from 'node:fs';
import * as THREE from 'three';
import { motion } from './lib.mjs';
const R = new URL('../../', import.meta.url).pathname;
const DEF = '1:0/0/0/0/30/0/0/-5,2:0/60/0/0/0/42/14/-3/6/60,6:0/40/0/0/0/59/14/-3/2/-45,7:0/0/0/0/30/0/4';
const SPEC = Object.fromEntries((process.argv[2] ?? DEF).split(',').filter(Boolean).map(p => { const [k, v] = p.split(':'); return [+k, v.split('/').map(Number)]; }));
const OUT = process.argv[3] ?? R + 'public/coach/flare-sequence.json';
const d = JSON.parse(fs.readFileSync(R + 'public/coach/flare-sequence-before-v36.json', 'utf8'));
const g = motion.group, W = n => g.getObjectByName(n).getWorldPosition(new THREE.Vector3());
const V = a => new THREE.Vector3(...a), Q = a => new THREE.Quaternion(...a);
const r6 = x => Math.round(x * 1e6) / 1e6;
const SIDES = ['left', 'right'];
const AXIS = new THREE.Vector3(0, 0, 0.05); // rotation axis: vertical line midway between the floor spots (+-0.215, 0 / 0.1)
const radius = p => Math.hypot(p.x - AXIS.x, p.z - AXIS.z);
const sample = pose => { motion.applyPose(pose); g.updateMatrixWorld(true); };
const turn = (pose, s, q, hip) => {
  const L = pose.limbs[s], P = x => V(x).sub(hip).applyQuaternion(q).add(hip).toArray().map(r6);
  L.ankle = P(L.ankle); if (L.kneePole) L.kneePole = P(L.kneePole);
  L.footQuaternion = q.clone().multiply(Q(L.footQuaternion)).normalize().toArray().map(r6);
};
const qa = (axis, deg) => new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), THREE.MathUtils.degToRad(deg));
// signed so that the low ankle ends farther from the axis for +deg
function outward(pose, low, hip, axis, deg) {
  const a = V(pose.limbs[low].ankle), m = q => a.clone().sub(hip).applyQuaternion(q).add(hip);
  const sgn = radius(m(qa(axis, Math.abs(deg)))) >= radius(m(qa(axis, -Math.abs(deg)))) ? 1 : -1;
  return qa(axis, sgn * Math.sign(deg) * Math.abs(deg));
}
function poleFrame(pose, s) {
  const h = W(s + 'Thigh'), an = V(pose.limbs[s].ankle), ax = an.clone().sub(h).normalize();
  const up = new THREE.Vector3(0, 1, 0); up.addScaledVector(ax, -up.dot(ax)).normalize();
  return { h, an, ax, up, side: ax.clone().cross(up) };
}
for (const [k, [roll = 0, lowYaw = 0, lowOpen = 0, hiOpen = 0, ankleMin = 0, hiYaw = 0, hiHook = 0, loHook = 0, hiLift = 0, hiPole = 0]] of Object.entries(SPEC)) {
  const pose = d.steps[k].pose;
  sample(pose);
  const pole0 = Object.fromEntries(SIDES.map(s => {
    const F = poleFrame(pose, s), off = V(pose.limbs[s].kneePole).sub(F.h), t = off.dot(F.ax) / F.h.distanceTo(F.an);
    off.addScaledVector(F.ax, -off.dot(F.ax));
    return [s, { t, x: off.dot(F.up), y: off.dot(F.side) }];
  }));
  const low = pose.limbs.left.ankle[1] < pose.limbs.right.ankle[1] ? 'left' : 'right', high = low === 'left' ? 'right' : 'left';
  const hips = () => ({ [low]: W(low + 'Thigh'), [high]: W(high + 'Thigh') });
  const dirs = () => { const h = hips(); return { h, l: V(pose.limbs[low].ankle).sub(h[low]).normalize(), u: V(pose.limbs[high].ankle).sub(h[high]).normalize() }; };
  if (roll) {
    sample(pose); const { h, l, u } = dirs(), bis = l.clone().add(u).normalize();
    const q = outward(pose, low, h[low], bis, roll);
    for (const s of SIDES) turn(pose, s, q, h[s]);
  }
  if (lowYaw) { sample(pose); const { h } = dirs(); turn(pose, low, outward(pose, low, h[low], new THREE.Vector3(0, 1, 0), lowYaw), h[low]); }
  if (lowOpen) { sample(pose); const { h, l, u } = dirs(); turn(pose, low, qa(u.clone().cross(l), lowOpen), h[low]); }
  if (hiOpen) { sample(pose); const { h, l, u } = dirs(); turn(pose, high, qa(l.clone().cross(u), hiOpen), h[high]); }
  if (hiYaw) {
    // high leg about the vertical through its hip, + = high foot nearer the rotation axis (it swings forward/inward
    // ahead of the low leg, so the low leg becomes the outer one and the V keeps its width)
    sample(pose); const { h } = dirs(), up = new THREE.Vector3(0, 1, 0), a = V(pose.limbs[high].ankle);
    const rad = deg => radius(a.clone().sub(h[high]).applyQuaternion(qa(up, deg)).add(h[high]));
    turn(pose, high, qa(up, rad(hiYaw) <= rad(-hiYaw) ? hiYaw : -hiYaw), h[high]);
  }
  if (ankleMin && pose.limbs[low].ankle[1] < ankleMin / 100) {
    sample(pose);
    const hip = W(low + 'Thigh'), a = V(pose.limbs[low].ankle), r = a.distanceTo(hip), flat = a.clone().sub(hip); flat.y = 0;
    const now = Math.asin((a.y - hip.y) / r), want = Math.asin(Math.max(-1, (ankleMin / 100 - hip.y) / r));
    const ax = new THREE.Vector3(0, 1, 0).cross(flat), deg = THREE.MathUtils.radToDeg(want - now);
    const up = q => a.clone().sub(hip).applyQuaternion(q).add(hip).y;
    turn(pose, low, up(qa(ax, deg)) >= up(qa(ax, -deg)) ? qa(ax, deg) : qa(ax, -deg), hip);
  }
  if (hiLift) {
    // high leg in its own vertical plane about its hip, + raises it
    sample(pose); const { h } = dirs(), a = V(pose.limbs[high].ankle), flat = a.clone().sub(h[high]).setY(0), ax = new THREE.Vector3(0, 1, 0).cross(flat);
    const y = q => a.clone().sub(h[high]).applyQuaternion(q).add(h[high]).y;
    turn(pose, high, y(qa(ax, hiLift)) >= y(qa(ax, -hiLift)) === hiLift > 0 ? qa(ax, Math.abs(hiLift)) : qa(ax, -Math.abs(hiLift)), h[high]);
  }
  for (const [side, deg] of [[high, hiHook], [low, loHook]]) {
    // open (+) / close (-) a foot about its ankle hinge: keeps the in-between hook inside 75-98 deg where the legs
    // now turn through a larger azimuth between keys
    if (!deg) continue;
    sample(pose);
    const L = pose.limbs[side], shin = W(side + 'Shin').sub(V(L.ankle)).normalize(), toe = new THREE.Vector3(0, 0, 1).applyQuaternion(Q(L.footQuaternion));
    L.footQuaternion = qa(shin.clone().cross(toe), deg).multiply(Q(L.footQuaternion)).normalize().toArray().map(r6);
  }
  sample(pose);
  for (const s of SIDES) {
    const F = poleFrame(pose, s), o = { ...pole0[s] };
    if (s === high && hiPole) {
      // turn the high knee's bend direction about the hip->ankle line (deg, + toward the leg frame's side axis),
      // so the bend direction spreads its change over both neighbouring segments instead of snapping mid-segment
      const r = Math.hypot(o.x, o.y), a = Math.atan2(o.y, o.x) + THREE.MathUtils.degToRad(hiPole);
      o.x = r * Math.cos(a); o.y = r * Math.sin(a);
    }
    pose.limbs[s].kneePole = F.h.clone().addScaledVector(F.ax, o.t * F.h.distanceTo(F.an)).addScaledVector(F.up, o.x).addScaledVector(F.side, o.y).toArray().map(r6);
  }
}
fs.writeFileSync(OUT, JSON.stringify(d, null, 2));
console.log('v36 low-leg sweep:', JSON.stringify(SPEC), '->', OUT);
