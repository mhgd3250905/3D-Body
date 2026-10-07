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
const A=Number(process.env.ABD??36);
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
// Round, full hip orbit (top view): rear keys sit on the ellipse the side/front keys
// already trace, so behind the hands the hips swing out in one full arc instead of
// ducking in at 9. Ellipse centre (0, CZ), semi-axes AX (sideways) and AZ (front/back).
const CZ=-.05,AX=+(process.env.AX??.44),AZ=+(process.env.AZ??.27);
const onOrbit=(p,deg,support=null)=>{const th=rad(deg),pel=V(motion.applyPose(p).pelvis);
  const target=new THREE.Vector3(AX*Math.sin(th),pel.y,CZ+AZ*Math.cos(th));p.pelvis=target.toArray();
  if(!support)return;
  // single support: re-aim the torso so the support shoulder sits over the hand from the new hip spot
  for(let it=0;it<4;it++){motion.applyPose(p);const sh=bone(support+'UpperArm').sub(V(p.pelvis)),wr=V(p.limbs[support].wrist);
    const want=wr.clone().add(new THREE.Vector3(0,.455,0)).sub(target);
    const r=new THREE.Quaternion().setFromUnitVectors(sh.clone().normalize(),want.clone().normalize());
    p.bodyQuaternion=r.clone().multiply(new THREE.Quaternion(...p.bodyQuaternion)).toArray();
    if(p.pelvisQuaternion)p.pelvisQuaternion=r.clone().multiply(new THREE.Quaternion(...p.pelvisQuaternion)).toArray();
    // keep the shoulder-hand distance reachable by sliding the hips along the torso line
    const slide=want.length()-sh.length();p.pelvis=target.clone().addScaledVector(want.normalize(),slide).toArray();}};
onOrbit(S(1),+(process.env.TH10??135),'right');strad(S(1),{az:135,elev:+(process.env.E10??14),F:'auto',A,minY:.30});
// Bboy flare: from the transfer through side support, shoulders + hips + core push the
// lower body UP early (hips well above the support shoulder), so the rear can be driven.
// Rotate the whole key (body, hips, legs, free arm) about the support shoulder, keeping
// the support hand planted, until the hip centre reaches `y`.
function liftHips(p,y,side='right'){
  for(let it=0;it<6;it++){motion.applyPose(p);const sh=bone(side+'UpperArm'),hc=bone('leftThigh').add(bone('rightThigh')).multiplyScalar(.5);
    const r=hc.clone().sub(sh),flat=new THREE.Vector3(r.x,0,r.z);if(Math.abs(hc.y-y)<.005||flat.length()<.05)return;
    const axis=new THREE.Vector3().crossVectors(flat.clone().normalize(),Y).normalize(); // rotating +ang about axis raises the hips
    const cur=Math.asin(THREE.MathUtils.clamp(r.y/r.length(),-1,1)),want=Math.asin(THREE.MathUtils.clamp((y-sh.y)/r.length(),-.98,.98));
    const q=new THREE.Quaternion().setFromAxisAngle(axis,-(want-cur));
    const test=r.clone().applyQuaternion(q);const qq=test.y>r.y===(want>cur)?q:q.clone().invert();
    const rp=a=>V(a).sub(sh).applyQuaternion(qq).add(sh).toArray(),rq=a=>qq.clone().multiply(new THREE.Quaternion(...a)).toArray();
    p.pelvis=rp(p.pelvis);p.bodyQuaternion=rq(p.bodyQuaternion);if(p.pelvisQuaternion)p.pelvisQuaternion=rq(p.pelvisQuaternion);
    const free=side==='right'?'left':'right';
    for(const sd of ['left','right'])for(const k of ['ankle','kneePole'])p.limbs[sd][k]=rp(p.limbs[sd][k]);
    for(const k of ['wrist','elbowPole'])p.limbs[free][k]=rp(p.limbs[free][k]);
    for(const sd of ['left','right'])if(p.limbs[sd].footQuaternion)p.limbs[sd].footQuaternion=rq(p.limbs[sd].footQuaternion);
    if(p.limbs[free].handQuaternion)p.limbs[free].handQuaternion=rq(p.limbs[free].handQuaternion);}}
const LIFT=[[1,+(process.env.Y10??.80),135],[2,+(process.env.Y11??.82),96],[3,+(process.env.Y12??.68),15]];
// v8 (user): at the rear diagonals a bboy folds the legs in a Y toward the trunk
// (hip flexion), not body and legs in one plane. Per-key pike, referenced to the
// user's own hand keys (≈75° / 37° / 46°) but not copied.
const PIKE={1:+(process.env.P10??62),2:+(process.env.P11??34),3:+(process.env.P12??40)};
// v9 (user: the legs must swing actively, not ride the hips). Real flare: with the
// right hand planted, the LEFT leg (free-hand side) is driven up toward the left
// ear — that drive lifts the hips — while the RIGHT leg swoops low under it and
// around to the front (scissor). Per-key hip flexion [kick leg, swoop leg] and
// abduction; the mean keeps the v8 Y pike. v10 (user): at the side the TOP leg is
// lifted toward the same-side ear / back of the head (big abduction, little
// flexion) and that upward drive raises hips + lower back. 14–16 mirror it (right leg kicks).
const SCISSOR=process.env.SCISSOR==='0'?null:{
  1:{F:{left:+(process.env.K10??84),right:+(process.env.S10??40)},A:{left:34,right:26}},
  2:{F:{left:+(process.env.K11??15),right:+(process.env.S11??-4)},A:{left:+(process.env.KA11??85),right:+(process.env.SA11??20)}},
  3:{F:{left:+(process.env.K12??40),right:+(process.env.S12??22)},A:{left:+(process.env.KA12??62),right:28}}};
// v7, bboy first principles: the support shoulder pushes the whole trunk block up
// (lower back + back + hips together) and rotates it; the pelvis does NOT twist away
// from the chest. Legs: straight, a moderate straddle (bboy, not gymnastics), hanging
// off the pelvis along the trunk line with a light pike.
const BF=+(process.env.BF??18),BA=+(process.env.BA??30);
function stradBody(p,F=BF,Ab=BA){
  // F / Ab: a number (both legs) or {left,right} per leg — v9 scissor: the leg on
  // the free-hand side kicks up toward its ear while the other swoops low under.
  const per=(v,sd)=>typeof v==='object'?v[sd]:v;
  p.pelvisQuaternion=p.bodyQuaternion.slice();
  const q=new THREE.Quaternion(...p.bodyQuaternion),hips=settle(p),reach=hips.length*.9995;
  const w=new THREE.Vector3(1,0,0).applyQuaternion(q),fwd=new THREE.Vector3(0,0,1).applyQuaternion(q);
  for(const [sd,sign] of [['left',1],['right',-1]]){const l=p.limbs[sd],Fs=per(F,sd),As=per(Ab,sd);
    const u=new THREE.Vector3(0,-Math.cos(rad(Fs)),Math.sin(rad(Fs))).applyQuaternion(q);
    const dir=u.clone().multiplyScalar(Math.cos(rad(As))).addScaledVector(w,sign*Math.sin(rad(As))).normalize();
    const ankle=hips[sd].clone().addScaledVector(dir,reach),knee=hips[sd].clone().addScaledVector(dir,reach*.5).addScaledVector(fwd,.3);
    l.ankle=ankle.toArray();l.kneePole=knee.toArray();}
}
const lowAnkle=p=>Math.min(p.limbs.left.ankle[1],p.limbs.right.ankle[1]);
if(process.env.BBOY!=='0')for(const [i,y0] of LIFT){let y=y0;const p=S(i);if(SCISSOR)stradBody(p,SCISSOR[i].F,SCISSOR[i].A);else stradBody(p,PIKE[i]);liftHips(p,y);
  // still too low? push the trunk block higher rather than spreading or twisting
  for(let k=0;k<12&&lowAnkle(p)<.24;k++){y+=.02;liftHips(p,y);} p.__lift=y;}
else for(const [i,y,az] of LIFT){liftHips(S(i),y);strad(S(i),{az,F:'auto',A,minY:.30});liftHips(S(i),y);}
for(const [i,g] of [[1,+(process.env.G10??.46)],[2,+(process.env.G11??.42)],[3,.36]])clearFreeArm(S(i),'left',g);
S(4).pelvis=[0,.49,.46];S(4).bodyQuaternion=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),rad(-84)).toArray();
strad(S(4),{F:'auto',A,minY:.3});onOrbit(S(0),180);strad(S(0),{elev:+(process.env.E9??-40),F:"auto",A,minY:+(process.env.Y9??.36)});steps[8].pose=structuredClone(S(0));
// v8 (user): shoes and hands must point the right way all the way round.
// Feet: placed relative to the SHIN (not a stale world rotation from the original
// key): toes pointed PF degrees along the straight leg, no sickling, no roll.
// Planted hand: it does not spin on the floor, so its rotation is held for the whole
// plant (9 -> 13 right hand; 13 -> 9 left hand by mirror). Free hand: wrist neutral,
// fingers continuing the forearm.
const PF=+(process.env.PF??55);
motion.reset();const WQ=n=>motion.group.getObjectByName(n).getWorldQuaternion(new THREE.Quaternion());
const REST={};for(const sd of ['left','right'])for(const b of ['Shin','Foot','Forearm','Hand'])REST[sd+b]=WQ(sd+b);
const rel=n=>WQ(n).multiply(REST[n].clone().invert());
function fixEnds(p){for(let it=0;it<2;it++){motion.applyPose(p);
  for(const sd of ['left','right']){const l=p.limbs[sd];
    l.footQuaternion=rel(sd+'Shin').multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),rad(PF))).normalize().toArray();
    if(!l.handLocked)l.handQuaternion=freeHand(sd);}}}
// free hand: fingers continue the forearm, palm turned toward the floor as far as the arm allows
function frameQ(a,b){const x=a.clone().normalize(),z=x.clone().cross(b).normalize(),y=z.clone().cross(x);return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z));}
function freeHand(sd){const sg=sd==='left'?1:-1,F0=new THREE.Vector3(sg*.98253144,.05483374,.17783482).normalize(),N0=new THREE.Vector3(sg*.06068526,-.99777448,-.02762938);
  const f=bone(sd+'Hand').sub(bone(sd+'Forearm')).normalize(),n=new THREE.Vector3(0,-1,0).addScaledVector(f,f.y);
  if(n.lengthSq()<.04)n.set(0,0,-1).addScaledVector(f,-f.z);
  return frameQ(f,n.normalize()).multiply(frameQ(F0,N0).invert()).normalize().toArray();}
const PLANT=S(0).limbs.right.handQuaternion.slice();
for(let i=0;i<5;i++){S(i).limbs.right.handQuaternion=PLANT.slice();fixEnds(S(i));}
// left hand at 9 and 13 = mirror of the right hand there (both keys are self-symmetric)
for(const i of [0,4]){const m=mirrorPose(S(i));S(i).limbs.left.handQuaternion=m.limbs.left.handQuaternion;}
steps[8].pose=structuredClone(S(0));
for(const [src,dst] of [[1,7],[2,6],[3,5]])steps[dst].pose=mirrorPose(steps[src].pose);
report(steps,'flare keys v10');console.log('lift',steps.slice(1,4).map(x=>x.pose.__lift));for(const x of steps)delete x.pose.__lift;console.log('hip flexion per key',steps.slice(0,8).map(x=>x.pose.__flex));
for(const x of steps)delete x.pose.__flex;
{const Q=steps.map(x=>new THREE.Quaternion(...(x.pose.pelvisQuaternion??x.pose.bodyQuaternion))),B=steps.map(x=>new THREE.Quaternion(...x.pose.bodyQuaternion)),D=180/Math.PI;
 console.log('SUMMARY twist',Q.slice(0,8).map((q,i)=>(q.angleTo(B[i])*D).toFixed(0)).join(' '),'| pelvis steps',Q.slice(0,8).map((q,i)=>(q.angleTo(Q[i+1])*D).toFixed(0)).join(' '));}
if(process.argv.includes('--write')){const R=new URL('../../public/coach/flare-sequence.json',import.meta.url);const d=JSON.parse(fs.readFileSync(R,'utf8'));d.steps.forEach((x,i)=>{x.pose=steps[i].pose;});
  d.revision={name:'v10 侧面上方腿提向同侧耳后',v10:['第11步上方腿（空手侧）以外展约85°、屈髋约15°提向同侧耳后/后脑勺方向，脚踝高约1.65 m；第12步外展62°屈髋40°','向上发力带髋：第11/12步髋高 0.74→0.82、0.60→0.68 m','15/14步镜像'],prevV9:'v9 腿部主动剪刀摆动',v9:['单撑阶段空手一侧的腿主动踢向同侧耳朵（屈髋约74–84°），另一条腿从下方低扫绕到前面（屈髋约-4–40°），形成剪刀；平均屈髋保留v8的Y字','14–16镜像：换手后右腿上踢、左腿低扫'],prevV8:'v8 斜后方Y字屈髋+脚尖手掌朝向',v8:['第10/16步双腿Y字向躯干屈髋约62°，侧撑约34°，换腿约40°（参考原稿手K姿态）','脚掌按小腿方向重算：全程绷脚约55°，不内翻不外翻','支撑手整段不在地面转动（9→13 右手、13→9 左手方向固定），空手腕部自然伸直'],prev:'v7 肩顶躯干整体推起',date:'2026-10-07',basedOn:'flare-sequence-before-rekey-2026-10-07.json',script:'tools/rekey/rekey-flare.mjs',
    changes:['髋部带动双腿：腿在髋部坐标里保持分腿（屈髋由后撑约60°渐变到前撑约12°，外展约55°），髋部随腿转动并在单撑时抬高','双腿整圈伸直（按真实髋—踝全长）','第10/16步腿方位改到±135°，消除10→11、16→15倒转；11/12保持原方位，让腿先过、手再落','下方脚踝离地≥0.30 m','手的摆放保留原稿；第12/14步空手向远离腿的方向移15 cm，避开扫过的大腿','前双撑躯干后仰84°','单撑髋部相对胸口转20°'],mirrors:'14–16 由 10–12 镜像生成'};
  fs.writeFileSync(R,JSON.stringify(d,null,2)+'\n');}
