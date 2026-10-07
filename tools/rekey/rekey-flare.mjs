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
// Hip-led straddle: the legs keep a fixed straddle in the PELVIS frame (flexion F,
// abduction A each side) and the pelvis itself turns to carry them around the orbit,
// like a real flare (hips drive the legs; hip angles change smoothly, never cross).
// Bisector direction: orbit azimuth `az` raised by `elev` (null = keep the key's own),
// V plane tilted just enough to keep the lower ankle above minY.
function strad(p,{az=null,elev=null,F,A,minY}){
  if(az!==null)yawLegs(p,az);
  for(let it=0;it<3;it++){
    const hips=settle(p),reach=hips.length*.9995,c=hips.left.clone().add(hips.right).multiplyScalar(.5);
    const a=V(p.limbs.left.ankle),b=V(p.limbs.right.ankle),mid=a.clone().add(b).multiplyScalar(.5).sub(c).normalize();
    const azr=Math.atan2(mid.x,mid.z),e=elev===null?Math.asin(mid.y):rad(elev),h=rad(A);
    const u=new THREE.Vector3(Math.sin(azr)*Math.cos(e),Math.sin(e),Math.cos(azr)*Math.cos(e));
    const wh=new THREE.Vector3(Math.cos(azr),0,-Math.sin(azr));if(wh.dot(a.clone().sub(b))<0)wh.negate();
    const up=Y.clone().addScaledVector(u,-u.y).normalize();
    const tMin=Math.asin(Math.min(1,Math.max(0,(reach*Math.cos(h)*u.y+c.y-minY)/(reach*Math.sin(h)))));
    let t=Math.min(tMin,1.2);
    if(F==='auto'){ // V plane follows the chest's left-right axis (side support: V stands up); floor clearance bounds it
      const bl=new THREE.Vector3(1,0,0).applyQuaternion(new THREE.Quaternion(...p.bodyQuaternion));
      const tb=Math.atan2(bl.dot(up),bl.dot(wh));
      const lowY=tt=>{const ww=wh.clone().multiplyScalar(Math.cos(tt)).addScaledVector(up,Math.sin(tt));
        return c.y+reach*Math.min(...[1,-1].map(sg=>u.clone().multiplyScalar(Math.cos(h)).addScaledVector(ww,sg*Math.sin(h)).y));};
      t=tb;if(lowY(t)<minY){let best=null;for(let k=0;k<=720;k++){const tt=-Math.PI+k*Math.PI/360;if(lowY(tt)>=minY&&(best===null||Math.abs(Math.atan2(Math.sin(tt-tb),Math.cos(tt-tb)))<Math.abs(Math.atan2(Math.sin(best-tb),Math.cos(best-tb)))))best=tt;}if(best!==null)t=best;}}
    const w=wh.clone().multiplyScalar(Math.cos(t)).addScaledVector(up,Math.sin(t)).normalize();
    // pelvis: local spread axis +X -> w, local bisector (0,-cosF,sinF) -> u
    const frame=Fd=>{const bl=new THREE.Vector3(0,-Math.cos(rad(Fd)),Math.sin(rad(Fd))),xl=new THREE.Vector3(1,0,0);
      const Ml=new THREE.Matrix4().makeBasis(xl,bl,xl.clone().cross(bl)),Mw=new THREE.Matrix4().makeBasis(w,u,w.clone().cross(u));
      return new THREE.Quaternion().setFromRotationMatrix(Mw.multiply(Ml.transpose()));};
    // F === 'auto': the hip flexion (within the anatomical range) that keeps the
    // pelvis closest to the chest, so the hips and torso turn as one unit.
    let Fu=F;if(F==='auto'){const body=new THREE.Quaternion(...p.bodyQuaternion);let best=9;
      for(let Fd=FLEX_RANGE[0];Fd<=FLEX_RANGE[1];Fd++){const d=frame(Fd).angleTo(body);if(d<best){best=d;Fu=Fd;}}}
    p.pelvisQuaternion=frame(Fu).toArray();p.__flex=Fu;
    const h2=settle(p);
    for(const [sd,sign] of [['left',1],['right',-1]]){const l=p.limbs[sd],dir=u.clone().multiplyScalar(Math.cos(h)).addScaledVector(w,sign*Math.sin(h)).normalize();
      const ankle=h2[sd].clone().addScaledVector(dir,reach),knee=h2[sd].clone().addScaledVector(dir,reach*.5);
      const fwd=new THREE.Vector3(0,0,1).applyQuaternion(new THREE.Quaternion(...p.pelvisQuaternion));
      l.ankle=ankle.toArray();l.kneePole=knee.addScaledVector(fwd,.3).toArray();}
  }
}
const FLEX_RANGE=[-15,110]; // hip extension 15° .. flexion 110°
const HIP=Number(process.env.HIP_TWIST??-20);
// Hip-led orbit. Rear (9) -> transfer (10) -> single support (11) -> pass (12) -> front (13):
// flexion eases from pike to near-flat, abduction stays wide, hips rise over the support arm.
const A=Number(process.env.ABD??56);
// Turn a WHOLE key (body, hips, legs, free hand) about the vertical line through the
// support hand, so the body orbits with the legs instead of the legs twisting alone.
function yawWhole(p,deg,side='right'){const piv=V(p.limbs[side].wrist).setY(0),q=new THREE.Quaternion().setFromAxisAngle(Y,rad(deg));
  const rp=a=>V(a).sub(piv).applyQuaternion(q).add(piv).toArray(),rq=a=>q.clone().multiply(new THREE.Quaternion(...a)).toArray();
  p.pelvis=rp(p.pelvis);p.bodyQuaternion=rq(p.bodyQuaternion);if(p.pelvisQuaternion)p.pelvisQuaternion=rq(p.pelvisQuaternion);
  for(const sd of ['left','right']){const l=p.limbs[sd];for(const k of ['wrist','elbowPole','ankle','kneePole'])l[k]=rp(l[k]);
    for(const k of ['handQuaternion','footQuaternion'])if(l[k])l[k]=rq(l[k]);}}
const WHOLE=Number(process.env.WHOLE??1); // share of the 10/16 orbit correction carried by the whole body

const plan=[ // [index, leg azimuth, V elevation, min ankle height]
  [1,135,+(process.env.E10??14),.30],
  [2, 96,+(process.env.E11??38),.26],
  [3, 15,+(process.env.E12??10),.28],
];
for(const [i,az,elev,minY] of plan){const p=S(i);let d=az*Math.PI/180-azimuth(p);d=Math.atan2(Math.sin(d),Math.cos(d));
  if(Math.abs(d)>rad(10))yawWhole(p,THREE.MathUtils.radToDeg(d)*WHOLE);strad(p,{az,elev,F:'auto',A,minY});}
// Step 12: the free hand comes down while the leg sweeps past; move it 15 cm further
// away from the legs (horizontally, opposite the leg direction) so it clears the thigh.
{const p=S(3),az=azimuth(p),away=new THREE.Vector3(-Math.sin(az),0,-Math.cos(az)).multiplyScalar(.15),l=p.limbs.left;
 l.wrist=V(l.wrist).add(away).toArray();l.elbowPole=V(l.elbowPole).add(away).toArray();}
// Free arm must stay clear of the legs (now that the V stands up at side support).
function clearFreeArm(p,side='left',gap=.36){
  for(let it=0;it<6;it++){motion.applyPose(p);const sh=bone(side+'UpperArm'),el=bone(side+'Forearm'),wr=bone(side+'Hand');
    let worst=null;for(const leg of ['left','right']){const a=bone(leg+'Thigh'),b=bone(leg+'Foot'),ab=b.clone().sub(a);
      for(const pt of [el,wr,wr.clone().add(wr.clone().sub(el).normalize().multiplyScalar(.15))]){const k=THREE.MathUtils.clamp(pt.clone().sub(a).dot(ab)/ab.lengthSq(),0,1),cp=a.clone().addScaledVector(ab,k),d=pt.distanceTo(cp);
        if(!worst||d<worst.d)worst={d,away:pt.clone().sub(cp).normalize()};}}
    if(worst.d>=gap)return;
    const l=p.limbs[side],push=worst.away.multiplyScalar(gap-worst.d+.02);l.wrist=V(l.wrist).add(push).toArray();l.elbowPole=V(l.elbowPole).add(push).toArray();}
}
for(const i of [1,2,3])clearFreeArm(S(i));
S(4).pelvis=[0,.49,.46];S(4).bodyQuaternion=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),rad(-84)).toArray();
strad(S(4),{F:'auto',A,minY:.3});strad(S(0),{F:'auto',A,minY:.3});steps[8].pose=structuredClone(S(0));
for(const [src,dst] of [[1,7],[2,6],[3,5]])steps[dst].pose=mirrorPose(steps[src].pose);
report(steps,'flare keys v4');console.log('hip flexion per key',steps.slice(0,8).map(x=>x.pose.__flex));
for(const x of steps)delete x.pose.__flex;
{const Q=steps.map(x=>new THREE.Quaternion(...(x.pose.pelvisQuaternion??x.pose.bodyQuaternion))),B=steps.map(x=>new THREE.Quaternion(...x.pose.bodyQuaternion)),D=180/Math.PI;
 console.log('SUMMARY twist',Q.slice(0,8).map((q,i)=>(q.angleTo(B[i])*D).toFixed(0)).join(' '),'| pelvis steps',Q.slice(0,8).map((q,i)=>(q.angleTo(Q[i+1])*D).toFixed(0)).join(' '));}
if(process.argv.includes('--write')){const R=new URL('../../public/coach/flare-sequence.json',import.meta.url);const d=JSON.parse(fs.readFileSync(R,'utf8'));d.steps.forEach((x,i)=>{x.pose=steps[i].pose;});
  d.revision={name:'v4 髋带腿环绕',date:'2026-10-07',basedOn:'flare-sequence-before-rekey-2026-10-07.json',script:'tools/rekey/rekey-flare.mjs',
    changes:['髋部带动双腿：腿在髋部坐标里保持分腿（屈髋由后撑约60°渐变到前撑约12°，外展约55°），髋部随腿转动并在单撑时抬高','双腿整圈伸直（按真实髋—踝全长）','第10/16步腿方位改到±135°，消除10→11、16→15倒转；11/12保持原方位，让腿先过、手再落','下方脚踝离地≥0.30 m','手的摆放保留原稿；第12/14步空手向远离腿的方向移15 cm，避开扫过的大腿','前双撑躯干后仰84°','单撑髋部相对胸口转20°'],mirrors:'14–16 由 10–12 镜像生成'};
  fs.writeFileSync(R,JSON.stringify(d,null,2)+'\n');}
