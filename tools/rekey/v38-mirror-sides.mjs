// v38 (user after v37): "我只看右侧，感觉是挺不错的 ... 托马斯的左右理论上其实是互为镜像的，换个方向它们就一样了".
// The side the user approved is side 1 (key 2 / phase 11, right-hand support, labelled 右手支撑 in the muscle-sync
// subline). Side 2 (key 6 / phase 15, left-hand support) is rebuilt as the mirror image of side 1.
// Post-pass on flare-sequence-before-v38.json (= v37). Keys 0-4 (back, side 1, front) are byte-identical to v37.
//
// Mirror map. The floor spots are left (0.215, 0, 0) and right (-0.215, 0, 0.10): since v33 the right spot sits 0.10 z ahead,
// so no reflection through the rotation axis keeps both the rotation pathway and the spots. Each single-support phase hangs
// off its own spot, so side 2 is side 1 reflected across x = 0 (src/pose-mirror.js mirrorPose: positions (-x, y, z),
// rotations (x, -y, -z, w), left/right limbs swapped) and then shifted -0.10 z; that carries the right spot exactly onto
// the left spot and leaves the body's path around the circle where v37 had it (v37 key 6 hips sit at G(key 2) within 1 cm).
// Time runs backwards in the mirror (a mirror image alone would spin the other way), so key k mirrors key 8-k:
//   key 5 <- key 3, key 6 <- key 2, key 7 <- key 1.
// The left hand stays planted (its spot, palm and lock are the mirror of the right's at keys 1-3, which equal v37's).
//
// Spec per target key "k:w/keepFree": w = blend weight toward the mirror (1 = exact mirror; positions lerp, quaternions slerp),
// keepFree = 1 keeps v37's free RIGHT arm (wrist, elbow pole, hand orientation, twists). Key 7's right arm is the late-plant
// approach to the back (v24-v33 work; mirroring the side-1 lift-off there is what made the hand plunge in v23), so it is kept.
// usage: node tools/rekey/v38-mirror-sides.mjs [spec] [outfile]
import fs from 'node:fs';
import * as THREE from 'three';
import { mirrorPose } from './lib.mjs';
const R = new URL('../../', import.meta.url).pathname;
const DEF = '5:1/0,6:1/0,7:1/1';
const SPEC = Object.fromEntries((process.argv[2] ?? DEF).split(',').filter(Boolean).map(p => { const [k, v] = p.split(':'); return [+k, v.split('/').map(Number)]; }));
const OUT = process.argv[3] ?? R + 'public/coach/flare-sequence.json';
const d = JSON.parse(fs.readFileSync(R + 'public/coach/flare-sequence-before-v38.json', 'utf8'));
const r6 = x => Math.round(x * 1e6) / 1e6;
const SHIFT = [0, 0, -0.10]; // right spot (-0.215, 0, 0.10) -> left spot (0.215, 0, 0) after the x reflection
const POINTS = ['wrist', 'elbowPole', 'ankle', 'kneePole'], ROTS = ['handQuaternion', 'footQuaternion'];
const shift = p => p.map((x, i) => r6(x + SHIFT[i]));
const lerp = (a, b, w) => a.map((x, i) => r6(x + (b[i] - x) * w));
const slerp = (a, b, w) => { const q = new THREE.Quaternion(...a), t = new THREE.Quaternion(...b); return q.slerp(t, w).normalize().toArray().map(r6); };
const FREE_ARM = ['wrist', 'elbowPole', 'handQuaternion', 'elbowTwist', 'upperArmTwist', 'handLocked'];
for (const [k, [w = 1, keepFree = 0]] of Object.entries(SPEC)) {
  const src = d.steps[8 - k].pose, cur = d.steps[k].pose, m = mirrorPose(src);
  m.pelvis = shift(m.pelvis);
  for (const s of ['left', 'right']) for (const key of POINTS) m.limbs[s][key] = shift(m.limbs[s][key]);
  const next = structuredClone(cur);
  next.pelvis = lerp(cur.pelvis, m.pelvis, w);
  for (const q of ['bodyQuaternion', 'torsoQuaternion', 'pelvisQuaternion']) if (cur[q] && m[q]) next[q] = slerp(cur[q], m[q], w);
  for (const s of ['left', 'right']) {
    const L = next.limbs[s], M = m.limbs[s];
    for (const key of POINTS) L[key] = lerp(cur.limbs[s][key], M[key], w);
    for (const key of ROTS) L[key] = slerp(cur.limbs[s][key], M[key], w);
    for (const key of ['elbowTwist', 'kneeTwist', 'upperArmTwist', 'thighTwist']) if (key in M || key in L) L[key] = r6((L[key] ?? 0) + ((M[key] ?? 0) - (L[key] ?? 0)) * w);
    L.handLocked = M.handLocked;
  }
  if (keepFree) for (const key of FREE_ARM) if (key in cur.limbs.right) next.limbs.right[key] = structuredClone(cur.limbs.right[key]);
  d.steps[k].pose = next;
}
fs.writeFileSync(OUT, JSON.stringify(d, null, 2));
console.log('v38 mirror sides:', JSON.stringify(SPEC), '->', OUT);
