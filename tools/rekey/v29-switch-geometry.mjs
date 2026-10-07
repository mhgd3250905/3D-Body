// v29 post-pass (user's standard for a perfect flare: during a hand switch no other
// body part changes height). At the back hand switch (key 0 / key 8) both support
// arms leaned ~74 deg because the shoulders sat ~13 cm in front of the hands, so the
// body height had a V over the hand-over. This pass slides the whole key-0 body
// (pelvis, legs, poles; hands stay on their spots) horizontally until both shoulders
// sit over their hands, then bakes the straight-arm lift. The front switch (key 4)
// already has both shoulders over the hands (87 deg) and is left as is.
// Reads public/coach/flare-sequence-before-v29.json (the v28 keys, kept as the original).
//   node tools/rekey/v29-switch-geometry.mjs          report only
//   node tools/rekey/v29-switch-geometry.mjs --write  write public/coach/flare-sequence.json
import fs from 'node:fs';
import * as THREE from 'three';
import {load,motion} from './lib.mjs';
const doc=load('public/coach/flare-sequence-before-v29.json'),steps=doc.steps,S=i=>steps[i].pose;
const bone=n=>motion.group.getObjectByName(n).getWorldPosition(new THREE.Vector3());
const SIDES=['left','right'];
function shift(p,dx,dy,dz){
  p.pelvis=[p.pelvis[0]+dx,p.pelvis[1]+dy,p.pelvis[2]+dz];
  for(const sd of SIDES){const l=p.limbs[sd];for(const k of ['ankle','kneePole'])l[k]=[l[k][0]+dx,l[k][1]+dy,l[k][2]+dz];
    if(!l.handLocked){l.wrist=[l.wrist[0]+dx,l.wrist[1]+dy,l.wrist[2]+dz];}
    l.elbowPole=[l.elbowPole[0]+dx,l.elbowPole[1]+dy,l.elbowPole[2]+dz];}
}
function armInfo(p){motion.applyPose(p);return SIDES.map(sd=>{const s=bone(sd+'UpperArm'),w=bone(sd+'Hand'),e=bone(sd+'Forearm'),d=s.clone().sub(w);
  return {sd,s,w,off:new THREE.Vector2(w.x-s.x,w.z-s.z),el:THREE.MathUtils.radToDeg(Math.atan2(d.y,Math.hypot(d.x,d.z))),elbow:THREE.MathUtils.radToDeg(s.clone().sub(e).angleTo(w.clone().sub(e)))};});}
// rigid turn of the whole body (not the planted hands) about an axis through the pelvis
function turn(p,axis,ang,about){const q=new THREE.Quaternion().setFromAxisAngle(axis,ang),c=about?about.clone():new THREE.Vector3(...p.pelvis);
  if(about)p.pelvis=new THREE.Vector3(...p.pelvis).sub(c).applyQuaternion(q).add(c).toArray();
  for(const k of ['bodyQuaternion','pelvisQuaternion','torsoQuaternion'])if(p[k]&&k!=='torsoQuaternion')p[k]=q.clone().multiply(new THREE.Quaternion(...p[k])).toArray();
  for(const sd of SIDES){const l=p.limbs[sd];for(const k of ['ankle','kneePole','elbowPole'].concat(l.handLocked?[]:['wrist']))l[k]=new THREE.Vector3(...l[k]).sub(c).applyQuaternion(q).add(c).toArray();
    l.footQuaternion=q.clone().multiply(new THREE.Quaternion(...l.footQuaternion)).toArray();if(!l.handLocked)l.handQuaternion=q.clone().multiply(new THREE.Quaternion(...l.handQuaternion)).toArray();}
}
const fmt=a=>a.map(x=>`${x.sd} el ${x.el.toFixed(1)} off ${(x.off.length()*100).toFixed(1)}cm elbow ${x.elbow.toFixed(1)} sh.y ${(x.s.y*100).toFixed(3)} len ${(x.s.distanceTo(x.w)*100).toFixed(3)}`).join(' | ');
const XZ=(process.env.V29_KEYS??'0').split(',').map(Number);
for(const i of XZ){const p=S(i);console.log('key',i,'before',fmt(armInfo(p)),'pelvis',p.pelvis.map(v=>v.toFixed(3)).join(','));
  // shoulders over hands: mean horizontal hand-shoulder offset, a few passes (the lift and projection move the body a little)
  for(let it=0;it<30;it++){let a=armInfo(p);
    // level the shoulders (tiny roll) so both straight arms reach the same floor
    const len=x=>x.s.distanceTo(x.w),dyS=len(a[0])-len(a[1]),mid=a[0].s.clone().add(a[1].s).multiplyScalar(.5),ax=new THREE.Vector3(mid.x-p.pelvis[0],0,mid.z-p.pelvis[2]).normalize();
    if(Math.abs(dyS)>1e-5){const before=dyS;turn(p,ax,1e-3);a=armInfo(p);const rate=(len(a[0])-len(a[1])-before)/1e-3;turn(p,ax,-before/rate-1e-3);a=armInfo(p);}
    const m=a.reduce((v,x)=>v.add(x.off),new THREE.Vector2()).multiplyScalar(1/a.length);if(m.length()<2e-4&&Math.abs(a[0].s.distanceTo(a[0].w)-a[1].s.distanceTo(a[1].w))<2e-5)break;shift(p,m.x,0,m.y);}
  // the switch is the top of the back half (no dip into the hand-over): pitch the
  // whole body about the shoulder line so the hips rise by RAISE (shoulders, arms
  // and hands do not move)
  const RAISE=+(process.env.V29_RAISE??0);
  if(RAISE&&i===0){for(let it=0;it<20;it++){const a=armInfo(p),mid=a[0].s.clone().add(a[1].s).multiplyScalar(.5),ax=a[0].s.clone().sub(a[1].s).normalize();
      const y0=motion.applyPose(p).pelvis[1];if(it===0)p.__target=y0+RAISE;const err=p.__target-y0;if(Math.abs(err)<2e-5)break;
      turn(p,ax,1e-3,mid);const y1=motion.applyPose(p).pelvis[1];turn(p,ax,err/((y1-y0)/1e-3)-1e-3,mid);}
    delete p.__target;console.log('key',i,'raised',fmt(armInfo(p)));}
  // bake the runtime straight-arm lift (pelvis + leg targets move together)
  const e=motion.applyPose(p),dy=e.pelvis[1]-p.pelvis[1];if(Math.abs(dy)>1e-5){p.pelvis[1]+=dy;for(const sd of SIDES)for(const k of ['ankle','kneePole'])p.limbs[sd][k][1]+=dy;}
  console.log('key',i,'after ',fmt(armInfo(p)),'pelvis',p.pelvis.map(v=>v.toFixed(3)).join(','),'lift',dy.toFixed(3));
}
steps[8].pose=structuredClone(S(0));
if(process.argv.includes('--write')){doc.revision={...doc.revision,v29:'换手时身体不升不降：后方换手（第0/8键）身体平移使双肩位于双手正上方，双臂接近竖直'};
  fs.writeFileSync(new URL('../../public/coach/flare-sequence.json',import.meta.url),JSON.stringify(doc,null,2)+'\n');console.log('written');}
