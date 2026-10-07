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
  spineEl:env('SEL',-25),    // hips above shoulder by this slope (negative = shoulder lower than hips)
  open:env('OPEN',-45),       // chest turned from facing the floor toward the free side
  kickF:env('KF',45),kickA:env('KA',60),   // kick leg (pelvis frame): folded toward the free-side ear
  lowF:env('LF',50),lowA:env('LA',30),     // sweep leg: back and low
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
  p.pelvis=motion.applyPose(p).pelvis.slice(); // bake the straight-arm lift so legs are solved from the real hips
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
// v13 (user: front hips too low, height drops sharply from side to front):
// rotate the front key about the shoulder line so hips rise; hands stay planted.
function liftHipsSide(p,y){for(let it=0;it<8;it++){motion.applyPose(p);const sh=bone('rightUpperArm'),hc=bone('leftThigh').add(bone('rightThigh')).multiplyScalar(.5);
  const r=hc.clone().sub(sh),flat=new THREE.Vector3(r.x,0,r.z);if(Math.abs(hc.y-y)<.004)return;
  const axis=new THREE.Vector3().crossVectors(flat.normalize(),Y).normalize(),cur=Math.asin(r.y/r.length()),want=Math.asin(THREE.MathUtils.clamp((y-sh.y)/r.length(),-.98,.98));
  let q=new THREE.Quaternion().setFromAxisAngle(axis,-(want-cur));if((r.clone().applyQuaternion(q).y>r.y)!==(want>cur))q.invert();
  const rp=a=>V(a).sub(sh).applyQuaternion(q).add(sh).toArray(),rq=a=>q.clone().multiply(new THREE.Quaternion(...a)).toArray();
  p.pelvis=rp(p.pelvis);p.bodyQuaternion=rq(p.bodyQuaternion);if(p.pelvisQuaternion)p.pelvisQuaternion=rq(p.pelvisQuaternion);
  for(const sd of ['left','right']){for(const k of ['ankle','kneePole'])p.limbs[sd][k]=rp(p.limbs[sd][k]);if(p.limbs[sd].footQuaternion)p.limbs[sd].footQuaternion=rq(p.limbs[sd].footQuaternion);}
  for(const k of ['wrist','elbowPole'])p.limbs.left[k]=rp(p.limbs.left[k]);if(p.limbs.left.handQuaternion)p.limbs.left.handQuaternion=rq(p.limbs.left.handQuaternion);}}
function liftFront(p,y){for(let it=0;it<8;it++){motion.applyPose(p);const sh=bone('leftUpperArm').add(bone('rightUpperArm')).multiplyScalar(.5),hc=bone('leftThigh').add(bone('rightThigh')).multiplyScalar(.5);
  const r=hc.clone().sub(sh),flat=new THREE.Vector3(r.x,0,r.z);if(Math.abs(hc.y-y)<.004)return hc.y;
  const axis=new THREE.Vector3().crossVectors(flat.normalize(),Y).normalize(),cur=Math.asin(r.y/r.length()),want=Math.asin(THREE.MathUtils.clamp((y-sh.y)/r.length(),-.98,.98));
  let q=new THREE.Quaternion().setFromAxisAngle(axis,-(want-cur));if((r.clone().applyQuaternion(q).y>r.y)!==(want>cur))q.invert();
  const rp=a=>V(a).sub(sh).applyQuaternion(q).add(sh).toArray(),rq=a=>q.clone().multiply(new THREE.Quaternion(...a)).toArray();
  p.pelvis=rp(p.pelvis);p.bodyQuaternion=rq(p.bodyQuaternion);if(p.pelvisQuaternion)p.pelvisQuaternion=rq(p.pelvisQuaternion);
  for(const sd of ['left','right']){for(const k of ['ankle','kneePole'])p.limbs[sd][k]=rp(p.limbs[sd][k]);if(p.limbs[sd].footQuaternion)p.limbs[sd].footQuaternion=rq(p.limbs[sd].footQuaternion);}}
  return null;}
const hipY=()=>bone('leftThigh').add(bone('rightThigh')).multiplyScalar(.5).y;
{motion.applyPose(S(4));const h0=hipY();liftFront(S(4),env('Y13',.60));motion.applyPose(S(4));console.log('front hip',h0.toFixed(2),'->',hipY().toFixed(2));}
for(const i of [3]){motion.applyPose(S(i));const h0=hipY();liftHipsSide(S(i),env('Y12H',h0+.06));motion.applyPose(S(i));console.log('pass hip',h0.toFixed(2),'->',hipY().toFixed(2));}
steps[5].pose=mirrorPose(S(3));
// v13: every floor-contact arm straight (runtime lift in coach-motion handles the
// vertical; a two-hand key also needs the hips centred so neither arm is short).
const elbows=p=>{motion.applyPose(p);return ['left','right'].filter(s=>p.limbs[s].wrist[1]<.07).map(s=>{const a=bone(s+'UpperArm'),e=bone(s+'Forearm'),w=bone(s+'Hand');return deg(a.clone().sub(e).angleTo(w.clone().sub(e)));});};
for(const i of [0,4]){const p=S(i),base=p.pelvis.slice(),shift=(dx,dz)=>{const q=JSON.parse(JSON.stringify(p));q.pelvis=[base[0]+dx,base[1],base[2]+dz];for(const sd of ['left','right'])for(const k of ['ankle','kneePole']){q.limbs[sd][k][0]+=dx;q.limbs[sd][k][2]+=dz;}return q;};
  let best=null;for(let dx=-.08;dx<=.081;dx+=.01)for(let dz=-.08;dz<=.081;dz+=.01){const q=shift(dx,dz),m=Math.min(...elbows(q)),c=m-Math.hypot(dx,dz)*20;if(!best||c>best.c)best={c,m,q,dx,dz};}
  console.log('key',9+i,'centre shift',best.dx.toFixed(2),best.dz.toFixed(2),'min elbow',best.m.toFixed(0));steps[i].pose=best.q;}
steps[8].pose=JSON.parse(JSON.stringify(S(0)));
// v16 (user: the LOW leg must whip round faster than the hips — its sweep throws
// centrifugal force that helps the hips carry the body). Phase-lead the low leg:
// at each key its WORLD direction (legs ride the pelvis frame, so a pelvis-frame lead does nothing) is taken from a little later in its own
// path (keys 10-12 right leg, 14-16 left leg), so it sweeps fast, then waits.
if(process.env.SWEEP!=='0'){
  const LEAD=(process.env.LEAD??'.2,.5,.25').split(',').map(Number),LEAD2=(process.env.LEAD2??'0,0,.15').split(',').map(Number);
  const local=[];for(let i=0;i<9;i++){const p=S(i);motion.applyPose(p);const iq=new THREE.Quaternion(...(p.pelvisQuaternion??p.bodyQuaternion)).invert();
    local[i]={};for(const sd of ['left','right'])local[i][sd]=V(p.limbs[sd].ankle).sub(bone(sd+'Thigh')).normalize();}
  // azimuth-only lead: the leg keeps its own elevation (fold/height unchanged) and
  // swings ahead about the vertical by a fraction of its travel to the next key
  const azOf=v=>Math.atan2(v.x,v.z);
  const at=(sd,tau,i)=>{const a=Math.floor(tau),f=tau-a,v=local[i][sd].clone();
    const az0=azOf(local[a][sd]),az1=azOf(local[a+1]?.[sd]??local[a][sd]);let dz=az1-az0;while(dz>Math.PI)dz-=2*Math.PI;while(dz<-Math.PI)dz+=2*Math.PI;
    const target=az0+dz*f,cur=azOf(v);let rot=target-cur;while(rot>Math.PI)rot-=2*Math.PI;while(rot<-Math.PI)rot+=2*Math.PI;
    return v.applyAxisAngle(Y,rot);};
  for(const [base,sd] of [[0,'right'],[4,'left']])for(let j=1;j<=3;j++){const i=base+j,p=S(i),q=new THREE.Quaternion(...(p.pelvisQuaternion??p.bodyQuaternion));
    motion.applyPose(p);setLeg(p,sd,at(sd,i+(base?LEAD2:LEAD)[j-1],i));fixEnds(p);}
}
// bake the runtime straight-arm lift into every key (pelvis + leg targets move together)
for(let i=0;i<8;i++){const p=S(i),e=motion.applyPose(p),dy=e.pelvis[1]-p.pelvis[1];if(dy>1e-4){p.pelvis[1]+=dy;for(const sd of ['left','right'])for(const k of ['ankle','kneePole'])p.limbs[sd][k][1]+=dy;console.log('baked lift key',9+i,dy.toFixed(3));}}
// straight legs from the real (solved) hip joints after every move above
for(let i=0;i<8;i++){const p=S(i);motion.applyPose(p);const L=legLen()*.9995;for(const sd of ['left','right']){const h=bone(sd+'Thigh'),a=V(p.limbs[sd].ankle),na=h.clone().add(a.clone().sub(h).setLength(L)),d=na.clone().sub(a);
  p.limbs[sd].ankle=na.toArray();p.limbs[sd].kneePole=V(p.limbs[sd].kneePole).add(d).toArray();}}
steps[8].pose=JSON.parse(JSON.stringify(S(0)));
{const p=S(1);motion.applyPose(p);const hc=bone('leftThigh').add(bone('rightThigh')).multiplyScalar(.5),sc=bone('leftUpperArm').add(bone('rightUpperArm')).multiplyScalar(.5),down=hc.clone().sub(sc).normalize();
 const a=bone('leftFoot').sub(bone('leftThigh')).normalize(),b=bone('rightFoot').sub(bone('rightThigh')).normalize(),n=a.clone().cross(b).normalize();
 console.log('K10FOLD outOfLegPlane',Math.abs(90-deg(down.angleTo(n))).toFixed(0),'L',deg(down.angleTo(a)).toFixed(0),'R',deg(down.angleTo(b)).toFixed(0),'ankY',bone('leftFoot').y.toFixed(2),bone('rightFoot').y.toFixed(2),'head',bone('head').y.toFixed(2),'pel',p.pelvis[1].toFixed(2));}
report(steps,'flare keys v12');
if(process.argv.includes('--write')){doc.revision={...doc.revision,name:'v12 斜后方换手：肩顶起+踢腿上提',v12:['依据用户本人托马斯视频：第10/16步支撑臂竖直、肩顶在手正上方，头不再贴地','胸口向空手一侧打开，空手离地','空手侧腿已经向上踢（提向同侧耳），另一条腿向后低扫，剪刀发力带髋'],prevV11:doc.revision.name};
  fs.writeFileSync(new URL('../../public/coach/flare-sequence.json',import.meta.url),JSON.stringify(doc,null,2)+'\n');}
