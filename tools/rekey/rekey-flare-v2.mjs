import fs from 'node:fs';
import * as THREE from 'three';
import {load,report,mirrorPose,motion} from './lib.mjs';
const doc=load('public/coach/flare-sequence-before-rekey-2026-10-07.json');
const steps=structuredClone(doc.steps);
const Y=new THREE.Vector3(0,1,0);
const V=a=>new THREE.Vector3(...a);
function azimuth(p){const L=p.limbs;return Math.atan2((L.left.ankle[0]+L.right.ankle[0])/2-p.pelvis[0],(L.left.ankle[2]+L.right.ankle[2])/2-p.pelvis[2]);}
function yawLegs(p,targetDeg){
  const d=THREE.MathUtils.degToRad(targetDeg)-azimuth(p),q=new THREE.Quaternion().setFromAxisAngle(Y,Math.atan2(Math.sin(d),Math.cos(d))),c=V(p.pelvis);
  for(const s of ['left','right']){const l=p.limbs[s];
    for(const k of ['ankle','kneePole'])l[k]=V(l[k]).sub(c).applyQuaternion(q).add(c).toArray();
    l.footQuaternion=q.clone().multiply(new THREE.Quaternion(...l.footQuaternion)).toArray();}
}
function widen(p,target){const a=V(p.limbs.left.ankle),b=V(p.limbs.right.ankle),m=a.clone().add(b).multiplyScalar(.5),h=a.clone().sub(b);const len=h.length();if(len>=target)return;h.multiplyScalar(target/len/2);
  const na=m.clone().add(h),nb=m.clone().sub(h);for(const[s,n,o]of[['left',na,a],['right',nb,b]]){const l=p.limbs[s];const dl=n.clone().sub(o);l.ankle=n.toArray();l.kneePole=V(l.kneePole).add(dl.multiplyScalar(.5)).toArray();}}
function spreadV(p,deg,reach=.74){const c=V(p.pelvis),a=V(p.limbs.left.ankle),b=V(p.limbs.right.ankle);
  const u=a.clone().add(b).multiplyScalar(.5).sub(c).normalize(),w=a.clone().sub(b);w.addScaledVector(u,-w.dot(u)).normalize();
  const h=THREE.MathUtils.degToRad(deg/2);
  for(const[s,sign,o]of[['left',1,a],['right',-1,b]]){const l=p.limbs[s];const n=c.clone().addScaledVector(u,reach*Math.cos(h)).addScaledVector(w,sign*reach*Math.sin(h));const knee=c.clone().lerp(n,.5);l.kneePole=V(l.kneePole).add(knee.clone().sub(c.clone().lerp(o,.5))).toArray();l.ankle=n.toArray();}}
function vPlane(p,deg,elev,minY,reach=.79){const c=V(p.pelvis),a=V(p.limbs.left.ankle),b=V(p.limbs.right.ankle);
  const az=azimuth(p),e=THREE.MathUtils.degToRad(elev),h=THREE.MathUtils.degToRad(deg/2);
  const u=new THREE.Vector3(Math.sin(az)*Math.cos(e),Math.sin(e),Math.cos(az)*Math.cos(e));
  let wh=new THREE.Vector3(Math.cos(az),0,-Math.sin(az));if(wh.dot(a.clone().sub(b))<0)wh.negate();
  const up=Y.clone().addScaledVector(u,-u.y).normalize();
  const sinT=Math.min(Math.sin(1.2),Math.max(0,(reach*Math.cos(h)*u.y+c.y-minY)/(reach*Math.sin(h)))),t=Math.asin(sinT);
  const w=wh.clone().multiplyScalar(Math.cos(t)).addScaledVector(up,Math.sin(t));
  for(const[s,sign,o]of[['left',1,a],['right',-1,b]]){const l=p.limbs[s];const n=c.clone().addScaledVector(u,reach*Math.cos(h)).addScaledVector(w,sign*reach*Math.sin(h));
    const knee=c.clone().lerp(n,.5),mid=c.clone().lerp(o,.5);l.kneePole=V(l.kneePole).add(knee.sub(mid)).toArray();l.ankle=n.toArray();}
  return THREE.MathUtils.radToDeg(t);}
function lift(p,side,minY){const l=p.limbs[side];if(l.ankle[1]<minY){const d=minY-l.ankle[1];l.ankle[1]=minY;l.kneePole[1]+=d*.5;}}
function pelvisY(p,y){const d=y-p.pelvis[1];p.pelvis[1]=y;}
function freeHand(p,side,y){const l=p.limbs[side];if(l.wrist[1]>y){const d=l.wrist[1]-y;l.wrist[1]=y;l.elbowPole[1]-=d*.5;}}
const S=i=>steps[i].pose;
function settle(p){const e=motion.applyPose(p);p.pelvis=e.pelvis.slice();}
// 10 / 11 / 12 (left hand free, right leg low); 14–16 are rebuilt as their mirrors
yawLegs(S(1),132);pelvisY(S(1),.72);settle(S(1));console.log('tilt10',vPlane(S(1),100,12,.36));lift(S(1),'right',.30);freeHand(S(1),'left',.50);
yawLegs(S(2),88);pelvisY(S(2),.62);settle(S(2));console.log('tilt11',vPlane(S(2),100,18,.32));lift(S(2),'right',.32);freeHand(S(2),'left',.58);
yawLegs(S(3),42);pelvisY(S(3),.57);settle(S(3));console.log('tilt12',vPlane(S(3),104,10,.34));lift(S(3),'right',.34);
S(4).pelvis=[0,.49,.46];S(4).bodyQuaternion=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),THREE.MathUtils.degToRad(-84)).toArray();
// Hips turn against the chest while one hand supports (torso no longer a rigid plank).
const HIP=Number(process.env.HIP_TWIST??-20);
const hipTwist=(p,deg)=>{p.pelvisQuaternion=new THREE.Quaternion(...p.bodyQuaternion).multiply(new THREE.Quaternion().setFromAxisAngle(Y,THREE.MathUtils.degToRad(deg))).toArray();};
hipTwist(S(1),HIP*.6);hipTwist(S(2),HIP);hipTwist(S(3),HIP*.6);
for(const [src,dst] of [[1,7],[2,6],[3,5]])steps[dst].pose=mirrorPose(steps[src].pose);
const after=report(steps,'rekey v2');
fs.writeFileSync(new URL('./steps-v2.json',import.meta.url),JSON.stringify(steps));
if(process.argv.includes('--write')){const R=new URL('../../public/coach/flare-sequence.json',import.meta.url);const d=JSON.parse(fs.readFileSync(R,'utf8'));d.steps.forEach((x,i)=>{x.pose=steps[i].pose;});fs.writeFileSync(R,JSON.stringify(d,null,2)+'\n');}
