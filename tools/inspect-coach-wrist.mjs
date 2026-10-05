import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createCoachMotion} from '../src/coach-motion.js';
import {createFlareRig} from '../src/flare-rig.js';

export const root=fileURLToPath(new URL('../',import.meta.url));
export const out=path.join(root,'output/hand-natural');
globalThis.createImageBitmap ??= async()=>({width:1,height:1,close(){}});
globalThis.ProgressEvent ??= class {constructor(type,value){Object.assign(this,value);}};
const vector=value=>new THREE.Vector3().fromArray(value);
const frame=(finger,normal)=>{
 const x=finger.clone().normalize(),y=normal.clone().addScaledVector(x,-normal.dot(x)).normalize(),z=x.clone().cross(y).normalize();
 return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z));
};
export async function prepareWristStage(stage){
 if(!['before','after'].includes(stage))throw Error('Use before or after.');
 await fs.mkdir(out,{recursive:true});
 const glb=path.join(out,stage+'.glb'),rig=path.join(out,stage+'-rig.json');
 if(stage==='before'){
  const backup=path.join(root,'assets/coach/backups/2026-10-05-before-natural-hands');
  await fs.copyFile(path.join(backup,'flare-coach.glb'),glb);
  await fs.copyFile(path.join(backup,'coach-rig.json'),rig);
 }else{
  await fs.copyFile(path.join(root,'public/coach/flare-coach.glb'),glb);
  await fs.copyFile(path.join(root,'public/coach/coach-rig.json'),rig);
 }
 return {glb,rig};
}
export async function loadWristModel(stage){
 const bytes=await fs.readFile(path.join(out,stage+'.glb'));
 const rigData=JSON.parse(await fs.readFile(path.join(out,stage+'-rig.json'),'utf8'));
 const {scene:model}=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 model.updateMatrixWorld(true);
 const originalRotations=new Map(rigData.bones.map(({name})=>[name,model.getObjectByName(name).getWorldQuaternion(new THREE.Quaternion())]));
 const motion=createCoachMotion({model,driver:createFlareRig(),rigData});
 return {model,motion,rigData,originalRotations,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
}
export async function getWristCases(){
 const target=path.join(out,'comparison-poses.json');
 try{const existing=JSON.parse(await fs.readFile(target,'utf8'));if(existing.version===2)return existing;}catch(error){if(error.code!=='ENOENT')throw error;}
 const {motion,model,rigData,originalRotations}=await loadWristModel('before');
 const captured=JSON.parse(await fs.readFile(path.join(root,'output/mesh-repair/web-before-poses.json'),'utf8'));
 const cases=[];
 for(const side of ['right','left']){
  const sign=side==='left'?1:-1,pose=structuredClone(captured[side==='right'?2:5].pose);
  motion.applyPose(pose);
  const ground=motion.getGroundHandPose(side,[sign,0,.16]);
  const metrics=motion.getMetrics(),shoulder=vector(metrics.joints[side+'Shoulder']),wrist=vector(ground.wrist);
  const upper=metrics.segmentLengths[side+'UpperArm'],forearm=metrics.segmentLengths[side+'Forearm'];
  const horizontal=(shoulder.x-wrist.x)**2+(shoulder.z-wrist.z)**2;
  pose.pelvis[1]+=wrist.y+forearm+Math.sqrt(upper*upper-horizontal)-shoulder.y;
  pose.limbs[side].wrist=wrist.toArray();
  pose.limbs[side].elbowPole=wrist.clone().add(new THREE.Vector3(0,forearm,0)).toArray();
  pose.limbs[side].handQuaternion=ground.handQuaternion;
  const effective=motion.applyPose(pose);
  cases.push({id:side+'-support90',side,title:(side==='left'?'左':'右')+'手 · 竖直前臂与撑地掌',pose:effective});
  const bone=model.getObjectByName(side+'Forearm');
  const forearmQ=bone.getWorldQuaternion(new THREE.Quaternion()).multiply(originalRotations.get(side+'Forearm').clone().invert());
  const palmQ=new THREE.Quaternion().fromArray(effective.limbs[side].handQuaternion);
  const half=structuredClone(effective);half.limbs[side].handLocked=false;
  half.limbs[side].handQuaternion=forearmQ.clone().slerp(palmQ,.5).toArray();
  // The 45-degree view is an airborne deformation comparison, not contact.
  half.pelvis[1]+=.22;half.groundLock=false;
  for(const value of Object.values(half.limbs)){
   value.handLocked=false;
   for(const key of ['wrist','elbowPole','ankle','kneePole'])value[key][1]+=.22;
  }
  cases.push({id:side+'-bend45',side,title:(side==='left'?'左':'右')+'手 · 约45°弯腕',pose:motion.applyPose(half)});
 }
 motion.reset();const raised=motion.capturePose();
 const translation=vector(raised.pelvis).sub(vector(rigData.landmarks.pelvis));
 for(const side of ['left','right']){
  raised.limbs[side].wrist=vector(rigData.landmarks[side+'Wrist']).add(translation).toArray();
  raised.limbs[side].elbowPole=vector(rigData.landmarks[side+'Elbow']).add(translation).toArray();
  raised.limbs[side].handQuaternion=[0,0,0,1];raised.limbs[side].handLocked=false;
 }
 const natural=motion.applyPose(raised);
 for(const side of ['right','left'])cases.push({id:side+'-raised',side,title:(side==='left'?'左':'右')+'手 · 自然平举',pose:structuredClone(natural)});
 const report={version:2,source:'Independent comparison fixtures; support fixtures seeded from pre-repair captured comparison poses, not user saved steps. 45-degree examples are lifted 220mm as airborne comparisons.',cases};
 await fs.writeFile(target,JSON.stringify(report,null,2));return report;
}
const depthSummary=values=>{
 values.sort((a,b)=>a-b);const min=values[0],max=values.at(-1);
 return {vertices:values.length,min,max,range:max-min,withinHalfMillimetreOfMaximum:values.filter(value=>max-value<.0005).length};
};
export async function inspectWristStage(stage){
 const {model,motion,rigData,originalRotations,sha256}=await loadWristModel(stage);
 const {cases}=await getWristCases();
 const body=model.getObjectByName('Coach_Body'),g=body.geometry,positions=g.attributes.position,indices=g.attributes.skinIndex,weights=g.attributes.skinWeight;
 const selected={left:[],right:[]},palms={left:[],right:[]};
 for(const side of ['left','right']){
  const wrist=vector(rigData.landmarks[side+'Wrist']),axis=wrist.clone().sub(vector(rigData.landmarks[side+'Elbow'])).normalize(),sign=side==='left'?1:-1;
  const finger=new THREE.Vector3(sign*.98253144,.05483374,.17783482).normalize(),normal=new THREE.Vector3(sign*.06068526,-.99777448,-.02762938).normalize();
  for(let i=0;i<positions.count;i++){
   let hand=0,forearm=0;for(let j=0;j<4;j++){
    const name=body.skeleton.bones[indices.getComponent(i,j)]?.name,value=weights.getComponent(i,j);
    if(name===side+'Hand')hand+=value;if(name===side+'Forearm')forearm+=value;
   }
   if(hand+forearm<.99)continue;
   const rest=vector([positions.getX(i),positions.getY(i),positions.getZ(i)]),offset=rest.clone().sub(wrist),along=offset.dot(axis),palmarAlong=offset.dot(finger),depth=offset.dot(normal);
   if(hand>.05&&forearm>.05&&along>-.085&&along<.040)selected[side].push({i,hand,forearm,along,rest:rest.toArray()});
   if(hand>.70&&palmarAlong>.025&&palmarAlong<.13)palms[side].push(depth);
  }
 }
 const poses=[];
 for(const fixture of cases){
  const effective=motion.applyPose(fixture.pose),side=fixture.side;
  const hand=model.getObjectByName(side+'Hand').getWorldQuaternion(new THREE.Quaternion()).multiply(originalRotations.get(side+'Hand').clone().invert());
  const forearm=model.getObjectByName(side+'Forearm').getWorldQuaternion(new THREE.Quaternion()).multiply(originalRotations.get(side+'Forearm').clone().invert());
  const angle=hand.angleTo(forearm),losses=[];
  for(const v of selected[side]){
   const w=v.hand/(v.hand+v.forearm),determinant=1-2*w*(1-w)*(1-Math.cos(angle));
   const point=vector(v.rest);body.getVertexPosition(v.i,point);body.localToWorld(point);
   losses.push({index:v.i,handWeight:v.hand,forearmWeight:v.forearm,restAlongWrist:v.along,rest:v.rest,actual:point.toArray(),localVolumeRatio:determinant,radialScale:Math.sqrt(Math.max(0,determinant))});
  }
  const count=positions.count;let minimumY=Infinity;
  for(let i=0;i<count;i++){const p=new THREE.Vector3();body.getVertexPosition(i,p);body.localToWorld(p);minimumY=Math.min(minimumY,p.y);}
  losses.sort((a,b)=>a.localVolumeRatio-b.localVolumeRatio);
  poses.push({id:fixture.id,side,title:fixture.title,relativeHandForearmRotationDegrees:THREE.MathUtils.radToDeg(angle),minimumBodyVertexY:minimumY,mixedWristVertices:losses.length,worstLbsLinearPart:losses.slice(0,10),pose:effective});
 }
 const captured=JSON.parse(await fs.readFile(path.join(root,'output/mesh-repair/web-before-poses.json'),'utf8'));
 const capturedComparisonPoses=[];
 for(const [index,fixture] of captured.entries()){
  motion.applyPose(fixture.pose);let minimumBodyVertexY=Infinity;
  for(let i=0;i<positions.count;i++){const p=new THREE.Vector3();body.getVertexPosition(i,p);body.localToWorld(p);minimumBodyVertexY=Math.min(minimumBodyVertexY,p.y);}
  capturedComparisonPoses.push({index,title:fixture.title,supportHands:motion.getMetrics().supportHands,minimumBodyVertexY});
 }
 const report={stage,assetSha256:sha256,skinning:'Actual asset uses ordinary Three.js linear blend skinning. Determinant is the weighted local linear deformation at fixed weights; it is not a full spatially varying tissue-volume measurement.',fixtureSource:'output/hand-natural/comparison-poses.json; no user steps read',capturedComparisonSource:'output/mesh-repair/web-before-poses.json; pre-repair comparison snapshots, not user saved steps',capturedComparisonPoses,boneCount:rigData.bones.length,restPalmDepth:{left:depthSummary(palms.left),right:depthSummary(palms.right)},poses};
 await fs.writeFile(path.join(out,stage+'-inspection.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({stage,boneCount:report.boneCount,palmDepth:report.restPalmDepth,capturedComparisonPoses,poses:poses.map(p=>({id:p.id,angle:p.relativeHandForearmRotationDegrees,minY:p.minimumBodyVertexY,worstRadialScale:p.worstLbsLinearPart[0]?.radialScale,worstLocalVolumeRatio:p.worstLbsLinearPart[0]?.localVolumeRatio}))},null,2));
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const stage=process.argv[2]||'after';await prepareWristStage(stage);await inspectWristStage(stage);
}
