// v12 post-pass on top of rekey-flare.mjs (v11 fold). Rebuilds the rear-diagonal
// TRANSFER keys 10 / 16 from the user's own flare video (2026-10-07):
//   - support arm straight and vertical, shoulder pushed up over the hand (head no
//     longer dives to the floor);
//   - chest opens toward the free-hand side as that hand leaves the floor;
//   - the free-side (kick) leg is already driving UP toward the same-side ear,
//     the other leg sweeps back and LOW — the scissor that lifts hips/lower back;
//   - trunk and legs stay folded (bboy, not gymnastics).
//   node tools/rekey/rekey-flare.mjs --write && node tools/rekey/v12-transfer.mjs --write
import fs from 'node:fs';
import * as THREE from 'three';
import {load,report,mirrorPose,motion} from './lib.mjs';
const V=a=>new THREE.Vector3(...a),rad=THREE.MathUtils.degToRad,deg=THREE.MathUtils.radToDeg,Y=new THREE.Vector3(0,1,0);
const env=(k,d)=>+(process.env[k]??d);
const doc=load('public/coach/flare-sequence.json'),steps=doc.steps,S=i=>steps[i].pose;
const bone=n=>motion.group.getObjectByName(n).getWorldPosition(new THREE.Vector3());
const T={ // key 10, right hand planted, left = free / kick side. Azimuths: atan2(x,z), +x = body's left.
  spineAz:env('SAZ',-20),   // direction hips -> support shoulder, seen from above (points from the hips toward the hand)
  spineEl:env('SEL',-10),    // hips above shoulder by this slope (negative = shoulder lower than hips)
  open:env('OPEN',-45),       // chest turned from facing the floor toward the free side
  kickF:env('KF',0),kickA:env('KA',60),   // kick leg (pelvis frame): folded toward the free-side ear
  lowF:env('LF',10),lowA:env('LA',30),     // sweep leg: back and low
  shoulderUp:env('SHU',.46), // support shoulder height above the wrist (straight vertical arm)
};
function dirAzEl(az,el){az=rad(az);el=rad(el);return new THREE.Vector3(Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el));}
function setLeg(p,sd,dir){const hips=hipJ(),reach=legLen()*.9995,h=hips[sd],l=p.limbs[sd];
  const side=new THREE.Vector3().crossVectors(dir,Y);if(side.lengthSq()<1e-4)side.set(1,0,0);
  const pole=new THREE.Vector3().crossVectors(side.normalize(),dir).normalize(); // bend plane facing "up"
  l.ankle=h.clone().addScaledVector(dir,reach).toArray();l.kneePole=h.clone().addScaledVector(dir,reach*.5).addScaledVector(pole,.3).toArray();}
const hipJ=()=>({left:bone('leftThigh'),right:bone('rightThigh')});
const legLen=()=>bone('leftThigh').distanceTo(bone('leftShin'))+bone('leftShin').distanceTo(bone('leftFoot'));
function bodyQ(spine,front){const y=spine.clone().normalize(),z=front.clone().addScaledVector(y,-front.dot(y)).normalize(),x=y.clone().cross(z);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z));}
function build(p){
  const wr=V(p.limbs.right.wrist),spine=dirAzEl(T.spineAz,T.spineEl).multiplyScalar(-1).negate(); // hips -> shoulder
  // front: start facing the floor, rotate about the spine toward the free (+x local) side by `open`
  const down=new THREE.Vector3(0,-1,0).addScaledVector(spine,spine.y).normalize();
  const front=down.clone().applyAxisAngle(spine.clone().normalize(),-rad(T.open));
  const q=bodyQ(spine,front);p.bodyQuaternion=q.toArray();p.pelvisQuaternion=q.toArray();
  const target=wr.clone().add(new THREE.Vector3(0,T.shoulderUp,0));
  for(let it=0;it<6;it++){const e=motion.applyPose(p);p.pelvis=e.pelvis.slice();motion.applyPose(p);const sh=bone('rightUpperArm');p.pelvis=V(p.pelvis).add(target.clone().sub(sh)).toArray();}
  motion.applyPose(p);
  const legDir=(F,A,sign)=>new THREE.Vector3(0,-Math.cos(rad(F)),Math.sin(rad(F))).multiplyScalar(Math.cos(rad(A))).add(new THREE.Vector3(sign*Math.sin(rad(A)),0,0)).normalize().applyQuaternion(q);
  setLeg(p,'left',legDir(T.kickF,T.kickA,1));setLeg(p,'right',legDir(T.lowF,T.lowA,-1));
  // free hand: just peeled off the floor (video: it stays low until the legs come round)
  motion.applyPose(p);const ls=bone('leftUpperArm'),side=V(p.limbs.left.wrist).sub(V(p.limbs.right.wrist)).setY(0).normalize(),
    out=side.multiplyScalar(env('FHS',.30)).add(new THREE.Vector3(0,-env('FHD',.32),0)).addScaledVector(dirAzEl(T.spineAz,0),-.12);
  p.limbs.left.wrist=ls.clone().add(out.setLength(.45)).toArray();p.limbs.left.elbowPole=ls.clone().add(out.setLength(.22)).addScaledVector(spine,-.2).toArray();
}
function diag(p,label){const e=motion.applyPose(p);const head=bone('head'),sh=bone('rightUpperArm'),wr=V(e.limbs.right.wrist);
  const pq=new THREE.Quaternion(...(p.pelvisQuaternion??p.bodyQuaternion)).invert(),spineUp=new THREE.Vector3(0,1,0).applyQuaternion(new THREE.Quaternion(...p.bodyQuaternion));
  const legs={};for(const sd of ['left','right']){const d=V(e.limbs[sd].ankle).sub(bone(sd+'Thigh')).normalize(),l=d.clone().applyQuaternion(pq);
    legs[sd]={flex:+deg(Math.atan2(l.z,-l.y)).toFixed(0),abd:+deg(Math.asin((sd==='left'?1:-1)*l.x)).toFixed(0),ankY:+e.limbs[sd].ankle[1].toFixed(2),fold:+(180-deg(d.angleTo(spineUp))).toFixed(0)};}
  console.log(label,{headY:+head.y.toFixed(2),pelY:+e.pelvis[1].toFixed(2),shoulderOverHand:+Math.hypot(sh.x-wr.x,sh.z-wr.z).toFixed(2),armLen:+sh.distanceTo(wr).toFixed(2)},JSON.stringify(legs));}
const rad0=rad;
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

for(const i of [0,1,2])diag(S(i),'before k'+(9+i));
{const keep=S(1).limbs.right.handQuaternion.slice();build(S(1));fixEnds(S(1));S(1).limbs.right.handQuaternion=keep;}diag(S(1),'after  k10');
steps[7].pose=mirrorPose(S(1));
report(steps,'flare keys v12');
if(process.argv.includes('--write')){doc.revision={...doc.revision,name:'v12 斜后方换手：肩顶起+踢腿上提',v12:['依据用户本人托马斯视频：第10/16步支撑臂竖直、肩顶在手正上方，头不再贴地','胸口向空手一侧打开，空手离地','空手侧腿已经向上踢（提向同侧耳），另一条腿向后低扫，剪刀发力带髋'],prevV11:doc.revision.name};
  fs.writeFileSync(new URL('../../public/coach/flare-sequence.json',import.meta.url),JSON.stringify(doc,null,2)+'\n');}
