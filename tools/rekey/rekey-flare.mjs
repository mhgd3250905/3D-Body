// Flare key poses v3, regenerated from the untouched original
// (public/coach/flare-sequence-before-rekey-2026-10-07.json).
//   node tools/rekey/rekey-flare.mjs          report only
//   node tools/rekey/rekey-flare.mjs --write  write public/coach/flare-sequence.json
// Rules: legs fully straight (ankle at full hip→ankle length from the real hip
// joint), leg orbit never reverses (10 moved to 135°; 11/12 keep the original azimuths so the leg clears before the free hand re-plants; pacing evens the speed), lower foot clears the floor, the
// user's own hand placement is kept, 14–16 are mirrors of 10–12.
import fs from 'node:fs';
import * as THREE from 'three';
import {load,report,mirrorPose,motion} from './lib.mjs';
const doc=load('public/coach/flare-sequence-before-rekey-2026-10-07.json');
const steps=structuredClone(doc.steps);
const Y=new THREE.Vector3(0,1,0),V=a=>new THREE.Vector3(...a),rad=THREE.MathUtils.degToRad;
const bone=n=>motion.group.getObjectByName(n).getWorldPosition(new THREE.Vector3());
const S=i=>steps[i].pose;
const azimuth=p=>{const L=p.limbs;return Math.atan2((L.left.ankle[0]+L.right.ankle[0])/2-p.pelvis[0],(L.left.ankle[2]+L.right.ankle[2])/2-p.pelvis[2]);};
function yawLegs(p,deg){const d=rad(deg)-azimuth(p),q=new THREE.Quaternion().setFromAxisAngle(Y,Math.atan2(Math.sin(d),Math.cos(d))),c=V(p.pelvis);
  for(const s of ['left','right']){const l=p.limbs[s];for(const k of ['ankle','kneePole'])l[k]=V(l[k]).sub(c).applyQuaternion(q).add(c).toArray();
    l.footQuaternion=q.clone().multiply(new THREE.Quaternion(...l.footQuaternion)).toArray();}}
const hipTwist=(p,deg)=>{p.pelvisQuaternion=new THREE.Quaternion(...p.bodyQuaternion).multiply(new THREE.Quaternion().setFromAxisAngle(Y,rad(deg))).toArray();};
function settle(p){const e=motion.applyPose(p);p.pelvis=e.pelvis.slice();motion.applyPose(p);return {left:bone('leftThigh'),right:bone('rightThigh'),length:bone('leftThigh').distanceTo(bone('leftShin'))+bone('leftShin').distanceTo(bone('leftFoot'))};}
// Straight legs in a V of `deg`, centred on the current orbit azimuth, raised by
// `elev`, and tilted just enough that the lower ankle stays above `minY`.
function straightV(p,deg,elev,minY){
  const hips=settle(p),reach=hips.length*.9995,c=hips.left.clone().add(hips.right).multiplyScalar(.5);
  const a=V(p.limbs.left.ankle),b=V(p.limbs.right.ankle),az=azimuth(p),e=rad(elev),h=rad(deg/2);
  const u=new THREE.Vector3(Math.sin(az)*Math.cos(e),Math.sin(e),Math.cos(az)*Math.cos(e));
  const wh=new THREE.Vector3(Math.cos(az),0,-Math.sin(az));if(wh.dot(a.clone().sub(b))<0)wh.negate();
  const up=Y.clone().addScaledVector(u,-u.y).normalize();
  const t=Math.asin(Math.min(Math.sin(1.2),Math.max(0,(reach*Math.cos(h)*u.y+c.y-minY)/(reach*Math.sin(h)))));
  const w=wh.clone().multiplyScalar(Math.cos(t)).addScaledVector(up,Math.sin(t));
  for(const [s,sign] of [['left',1],['right',-1]]){const l=p.limbs[s],dir=u.clone().multiplyScalar(Math.cos(h)).addScaledVector(w,sign*Math.sin(h)).normalize();
    const ankle=hips[s].clone().addScaledVector(dir,reach);
    // knee pole: in front of the knee, away from the body centre (keeps the bend plane stable even though the leg is straight)
    const knee=hips[s].clone().addScaledVector(dir,reach*.5),out=w.clone().multiplyScalar(sign).addScaledVector(dir,-w.dot(dir)*sign).normalize();
    l.ankle=ankle.toArray();l.kneePole=knee.addScaledVector(out,.25).toArray();}
  return THREE.MathUtils.radToDeg(t);
}
// Keep a key's own leg directions but extend each leg to full length from its real hip.
function straighten(p){const hips=settle(p),reach=hips.length*.9995;for(const s of ['left','right']){const l=p.limbs[s],dir=V(l.ankle).sub(hips[s]).normalize();
  const old=V(l.ankle),ankle=hips[s].clone().addScaledVector(dir,reach);l.ankle=ankle.toArray();l.kneePole=V(l.kneePole).add(ankle.sub(old).multiplyScalar(.5)).toArray();}}
const HIP=Number(process.env.HIP_TWIST??-20);
const plan=[ // [index, orbit azimuth, pelvis height request, V angle, V elevation, min ankle height, hip twist share]
  [1,132,.72,100,12,.34,.6],
  [2, 96,.62,100,18,.30,1],
  [3, 15,.57,104,10,.32,.6],  // keep the original timing: the leg has passed before the free hand re-plants
];
for(const [i,az,py,deg,elev,minY,tw] of plan){const p=S(i);yawLegs(p,az);p.pelvis[1]=py;hipTwist(p,HIP*tw);straightV(p,deg,elev,minY);}
// Step 12: the free hand comes down while the leg sweeps past; move it 15 cm further
// away from the legs (horizontally, opposite the leg direction) so it clears the thigh.
{const p=S(3),az=azimuth(p),away=new THREE.Vector3(-Math.sin(az),0,-Math.cos(az)).multiplyScalar(.15),l=p.limbs.left;
 l.wrist=V(l.wrist).add(away).toArray();l.elbowPole=V(l.elbowPole).add(away).toArray();}
S(4).pelvis=[0,.49,.46];S(4).bodyQuaternion=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),rad(-84)).toArray();
straighten(S(4));straighten(S(0));steps[8].pose=structuredClone(S(0));
for(const [src,dst] of [[1,7],[2,6],[3,5]])steps[dst].pose=mirrorPose(steps[src].pose);
report(steps,'flare keys v3');
if(process.argv.includes('--write')){const R=new URL('../../public/coach/flare-sequence.json',import.meta.url);const d=JSON.parse(fs.readFileSync(R,'utf8'));d.steps.forEach((x,i)=>{x.pose=steps[i].pose;});
  d.revision={name:'v3 直腿匀速环绕',date:'2026-10-07',basedOn:'flare-sequence-before-rekey-2026-10-07.json',script:'tools/rekey/rekey-flare.mjs',
    changes:['双腿整圈伸直（按真实髋—踝全长）','第10/16步腿方位改到±135°，消除10→11、16→15倒转；11/12保持原方位，让腿先过、手再落','下方脚踝离地≥0.30 m','手的摆放保留原稿；第12/14步空手向远离腿的方向移15 cm，避开扫过的大腿','前双撑躯干后仰84°','单撑髋部相对胸口转20°'],mirrors:'14–16 由 10–12 镜像生成'};
  fs.writeFileSync(R,JSON.stringify(d,null,2)+'\n');}
