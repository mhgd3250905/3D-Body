// v37 (user after v36, authoritative correction): at the SIDES (T2 = side 1 / phase 11, T6 = side 2 / phase 15) the real
// flare power pose is a wide split: the UPPER leg lifts as high as it can, up toward the head ("贴近头部", figuratively),
// while the LOWER leg reaches far out close to the floor and sweeps the big outer circle (v36). The earlier "keep the
// high leg low or it reads as an airflare" assumption is dropped: the airflare look came from the hips being high, and
// v35/v36 hips stay exactly where the user approved them.
// Post-pass on flare-sequence-before-v37.json (= v36). Only the legs (ankles, knee poles, foot orientations) move;
// pelvis, trunk, head, arms, hands and floor spots are byte-identical to v36, so hip heights and the plant work stay exact.
// Per key, in order:
//   1. hiAim (deg) / lean (deg): the HIGH leg turns about its hip along the great circle from its current direction toward
//      the target direction T = world-up leaned by `lean` deg toward the head (the horizontal part of hip->shoulders),
//      by at most hiAim deg (stops at T). The foot and the knee pole turn with the leg (same quaternion), so the knee
//      bend direction stays fixed relative to the leg and nothing is rebuilt in a world-up frame (which degenerates when
//      a leg points nearly straight up).
//   2. hiPole (deg): the high knee pole then turns about the hip->ankle line (spreads a bend-direction change).
//   3. hiHook / loHook (deg): the high / low foot opens (+) or closes (-) about its ankle hinge (hook 75-98 in between).
//   4. loYaw (deg): the low leg turns about the vertical through its hip, + = foot farther from the rotation axis.
//   5. loPole (deg): the low knee pole turns about its hip->ankle line.
//   tilt (deg, 8th value): the target T also tips about the head direction (sideways, toward the body's front/back), which
//      keeps the high leg clear of the raised free arm.
// The amounts at keys 1/3/5/7 are partial, so the high leg ramps up into each side and back down toward the front,
// and the front (key 4) keeps its v34-v36 fold.
// usage: node tools/rekey/v37-side-split.mjs [spec] [outfile]
//   spec "key:hiAim/lean/hiPole/hiHook/loHook/loYaw/loPole/tilt,..." (DEF = committed v37)
import fs from 'node:fs';
import * as THREE from 'three';
import { motion } from './lib.mjs';
const R = new URL('../../', import.meta.url).pathname;
const DEF = '1:20/5,2:50/-5,3:12/5,5:12/5,6:60/0/0/0/0/0/0/15,7:10/5';
const SPEC = Object.fromEntries((process.argv[2] ?? DEF).split(',').filter(Boolean).map(p => { const [k, v] = p.split(':'); return [+k, v.split('/').map(Number)]; }));
const OUT = process.argv[3] ?? R + 'public/coach/flare-sequence.json';
const d = JSON.parse(fs.readFileSync(R + 'public/coach/flare-sequence-before-v37.json', 'utf8'));
const g = motion.group, W = n => g.getObjectByName(n).getWorldPosition(new THREE.Vector3());
const V = a => new THREE.Vector3(...a), Q = a => new THREE.Quaternion(...a);
const r6 = x => Math.round(x * 1e6) / 1e6;
const AXIS = new THREE.Vector3(0, 0, 0.05); // rotation axis: vertical line midway between the floor spots
const radius = p => Math.hypot(p.x - AXIS.x, p.z - AXIS.z);
const UP = new THREE.Vector3(0, 1, 0);
const sample = pose => { motion.applyPose(pose); g.updateMatrixWorld(true); };
const qa = (axis, deg) => new THREE.Quaternion().setFromAxisAngle(axis.clone().normalize(), THREE.MathUtils.degToRad(deg));
const turn = (pose, s, q, hip) => {
  const L = pose.limbs[s], P = x => V(x).sub(hip).applyQuaternion(q).add(hip).toArray().map(r6);
  L.ankle = P(L.ankle); if (L.kneePole) L.kneePole = P(L.kneePole);
  L.footQuaternion = q.clone().multiply(Q(L.footQuaternion)).normalize().toArray().map(r6);
};
const spinPole = (pose, s, deg) => {
  sample(pose);
  const h = W(s + 'Thigh'), ax = V(pose.limbs[s].ankle).sub(h).normalize();
  pose.limbs[s].kneePole = V(pose.limbs[s].kneePole).sub(h).applyQuaternion(qa(ax, deg)).add(h).toArray().map(r6);
};
const hook = (pose, s, deg) => {
  sample(pose);
  const L = pose.limbs[s], shin = W(s + 'Shin').sub(V(L.ankle)).normalize(), toe = new THREE.Vector3(0, 0, 1).applyQuaternion(Q(L.footQuaternion));
  L.footQuaternion = qa(shin.clone().cross(toe), deg).multiply(Q(L.footQuaternion)).normalize().toArray().map(r6);
};
for (const [k, [hiAim = 0, lean = 0, hiPole = 0, hiHook = 0, loHook = 0, loYaw = 0, loPole = 0, tilt = 0]] of Object.entries(SPEC)) {
  const pose = d.steps[k].pose;
  const low = pose.limbs.left.ankle[1] < pose.limbs.right.ankle[1] ? 'left' : 'right', high = low === 'left' ? 'right' : 'left';
  if (hiAim) {
    sample(pose);
    const hip = W(high + 'Thigh'), hc = W('leftThigh').add(W('rightThigh')).multiplyScalar(0.5);
    const sc = W('leftUpperArm').add(W('rightUpperArm')).multiplyScalar(0.5), head = sc.sub(hc).setY(0).normalize();
    const T = UP.clone().applyAxisAngle(UP.clone().cross(head).normalize(), THREE.MathUtils.degToRad(lean))
      .applyAxisAngle(head, THREE.MathUtils.degToRad(tilt));
    const u = V(pose.limbs[high].ankle).sub(hip).normalize(), ang = THREE.MathUtils.radToDeg(u.angleTo(T));
    if (ang > 1e-3) turn(pose, high, qa(u.clone().cross(T), Math.min(hiAim, ang)), hip);
  }
  if (hiPole) spinPole(pose, high, hiPole);
  if (loYaw) {
    sample(pose);
    const hip = W(low + 'Thigh'), a = V(pose.limbs[low].ankle), r = deg => radius(a.clone().sub(hip).applyQuaternion(qa(UP, deg)).add(hip));
    turn(pose, low, qa(UP, r(loYaw) >= r(-loYaw) ? loYaw : -loYaw), hip);
  }
  if (loPole) spinPole(pose, low, loPole);
  if (hiHook) hook(pose, high, hiHook);
  if (loHook) hook(pose, low, loHook);
}
fs.writeFileSync(OUT, JSON.stringify(d, null, 2));
console.log('v37 side split:', JSON.stringify(SPEC), '->', OUT);
