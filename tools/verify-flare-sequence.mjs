import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createFlareSequence} from '../src/flare-sequence.js';
import {mirrorPose} from '../src/pose-mirror.js';
import {createCoachMotion} from '../src/coach-motion.js';
import {createFlareRig} from '../src/flare-rig.js';

const document=JSON.parse(fs.readFileSync(new URL('../public/coach/flare-sequence.json',import.meta.url),'utf8'));
const original=JSON.stringify(document.steps);
const sequence=createFlareSequence(document.steps,{period:document.period});
assert.equal(document.version,1);assert.equal(sequence.steps.length,9);assert.equal(sequence.period,9);
assert.deepEqual(sequence.keyframes,{front:0,sideA:2,rear:4,sideB:6,frontRepeat:8});
const SIDES=['left','right'],POINTS=['wrist','elbowPole','ankle','kneePole'],ROTATIONS=['handQuaternion','footQuaternion'];
let checks=0;
const equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const close=(a,b,message,tolerance=1e-10)=>{assert.ok(Math.abs(a-b)<=tolerance,message+': '+a+' vs '+b);checks++;};
function finite(value){
 if(typeof value==='number')assert.ok(Number.isFinite(value));
 if(value&&typeof value==='object')for(const child of Object.values(value))finite(child);
}
function rotationDistance(a,b){
 const qa=new THREE.Quaternion().fromArray(a).normalize(),qb=new THREE.Quaternion().fromArray(b).normalize();
 return qa.angleTo(qb);
}
function poseDistance(a,b){
 let maximum=0;
 const compare=(x,y)=>{if(typeof x==='number'&&typeof y==='number')maximum=Math.max(maximum,Math.abs(x-y));else if(x&&y&&typeof x==='object'&&typeof y==='object')for(const key of Object.keys(x))compare(x[key],y[key]);};
 compare(a,b);return maximum;
}
for(let index=0;index<9;index++){
 equal(JSON.stringify(sequence.sample(index)),JSON.stringify(document.steps[index].pose),'Saved integer pose changed');
 equal(sequence.stepAt(index),index,'Wrong integer step index');
 equal(JSON.stringify(sequence.sample(index+9)),JSON.stringify(document.steps[index].pose),'Loop anchor changed');
}
equal(JSON.stringify(sequence.sample(9)),JSON.stringify(document.steps[0].pose));
equal(JSON.stringify(sequence.sample(-1)),JSON.stringify(document.steps[8].pose));
equal(sequence.stepAt(-9),0);
equal(sequence.stepAt(8.75),0);
const doublePeriod=createFlareSequence(document.steps,{period:18});
for(let index=0;index<9;index++)equal(JSON.stringify(doublePeriod.sample(index*2)),JSON.stringify(document.steps[index].pose));

const exposed=sequence.steps[0].pose.pelvis[0];sequence.steps[0].pose.pelvis[0]=100;
equal(sequence.sample(0).pelvis[0],exposed,'Exported steps mutated private sequence');
const sample=sequence.sample(.3),unchanged=sequence.sample(.3);sample.pelvis[0]=100;sample.limbs.left.wrist[1]=100;
equal(sequence.sample(.3),unchanged,'Sample aliases internal state');
const mutable=structuredClone(document.steps),independent=createFlareSequence(mutable);mutable[0].pose.limbs.right.ankle[2]=100;
equal(independent.sample(0),document.steps[0].pose,'Input aliases private sequence');

const signSteps=structuredClone(document.steps.slice(0,2));
signSteps[0].pose.bodyQuaternion=[0,0,0,2];signSteps[1].pose.bodyQuaternion=[0,0,0,-3];
for(const side of SIDES)for(const key of ROTATIONS){signSteps[0].pose.limbs[side][key]=[0,0,0,2];signSteps[1].pose.limbs[side][key]=[0,0,0,-3];}
signSteps[0].pose.groundLock=false;signSteps[1].pose.groundLock=true;
const signSequence=createFlareSequence(signSteps);
equal(JSON.stringify(signSequence.sample(0)),JSON.stringify(signSteps[0].pose),'Non-unit anchor normalized');
equal(JSON.stringify(signSequence.sample(1)),JSON.stringify(signSteps[1].pose),'Negative anchor sign changed');
for(const time of [.01,.5,.99,1.5]){
 const pose=signSequence.sample(time);close(rotationDistance(pose.bodyQuaternion,[0,0,0,1]),0,'Antipodal quaternions took long path');
 for(const side of SIDES)for(const key of ROTATIONS)close(rotationDistance(pose.limbs[side][key],[0,0,0,1]),0,'Hand/foot antipodal interpolation failed');
}
equal(signSequence.sample(.5).groundLock,false);equal(signSequence.sample(1.5).groundLock,true);
const lockSteps=structuredClone(document.steps.slice(0,2));
for(const side of SIDES)lockSteps[0].pose.limbs[side].handLocked=true;
lockSteps[1].pose.limbs.left.handLocked=false;lockSteps[1].pose.limbs.right.handLocked=true;
const lockSequence=createFlareSequence(lockSteps);
equal([lockSequence.sample(0).limbs.left.handLocked,lockSequence.sample(0).limbs.right.handLocked],[true,true]);
equal([lockSequence.sample(.5).limbs.left.handLocked,lockSequence.sample(.5).limbs.right.handLocked],[false,true]);
for(const step of lockSteps)for(const side of SIDES)step.pose.limbs[side].handLocked=false;
const flight=createFlareSequence(lockSteps);
equal([flight.sample(.5).limbs.left.handLocked,flight.sample(.5).limbs.right.handLocked],[false,false]);

const invalid=structuredClone(document.steps);invalid[0].pose.limbs.left.footQuaternion[2]=NaN;
for(const call of [()=>createFlareSequence([]),()=>createFlareSequence(document.steps,{period:0}),()=>createFlareSequence(document.steps,{period:Infinity}),()=>createFlareSequence(invalid),()=>sequence.sample(NaN),()=>sequence.sample(Infinity),()=>sequence.stepAt(-Infinity)]){assert.throws(call);checks++;}
const zero=structuredClone(document.steps);zero[0].pose.bodyQuaternion=[0,0,0,0];assert.throws(()=>createFlareSequence(zero));checks++;
const single=createFlareSequence([document.steps[0]]);equal(single.sample(12.345),document.steps[0].pose);

const mirrored=createFlareSequence(document.steps.map(step=>({...step,pose:mirrorPose(step.pose)})),{period:9});
let maximumMirrorPositionError=0,maximumContinuityPositionJump=0,maximumContinuityAngleJump=0;
for(let index=0;index<120;index++){
 const time=(index+.5)*9/120,pose=sequence.sample(time),expected=mirrorPose(pose),actual=mirrored.sample(time);
 finite(pose);finite(actual);
 for(let component=0;component<3;component++)maximumMirrorPositionError=Math.max(maximumMirrorPositionError,Math.abs(actual.pelvis[component]-expected.pelvis[component]));
 close(rotationDistance(actual.bodyQuaternion,expected.bodyQuaternion),0,'Mirrored body interpolation',1e-7);
 for(const side of SIDES){
  for(const key of POINTS)for(let component=0;component<3;component++)maximumMirrorPositionError=Math.max(maximumMirrorPositionError,Math.abs(actual.limbs[side][key][component]-expected.limbs[side][key][component]));
  for(const key of ROTATIONS)close(rotationDistance(actual.limbs[side][key],expected.limbs[side][key]),0,'Mirrored hand/foot interpolation',1e-7);
  equal(actual.limbs[side].handLocked,expected.limbs[side].handLocked,'Mirrored support flag');
 }
}
assert.ok(maximumMirrorPositionError<1e-10);checks++;
for(let index=0;index<9;index++){
 const before=sequence.sample(index-1e-5),after=sequence.sample(index+1e-5);
 maximumContinuityPositionJump=Math.max(maximumContinuityPositionJump,...before.pelvis.map((v,i)=>Math.abs(v-after.pelvis[i])));
 maximumContinuityAngleJump=Math.max(maximumContinuityAngleJump,rotationDistance(before.bodyQuaternion,after.bodyQuaternion));
 for(const side of SIDES){
  for(const key of POINTS)maximumContinuityPositionJump=Math.max(maximumContinuityPositionJump,...before.limbs[side][key].map((v,i)=>Math.abs(v-after.limbs[side][key][i])));
  for(const key of ROTATIONS)maximumContinuityAngleJump=Math.max(maximumContinuityAngleJump,rotationDistance(before.limbs[side][key],after.limbs[side][key]));
 }
}
assert.ok(maximumContinuityPositionJump<1e-7);assert.ok(maximumContinuityAngleJump<1e-6);checks+=2;
equal(JSON.stringify(document.steps),original,'Source steps were mutated');

const pureChecks=checks;
globalThis.createImageBitmap ??= async()=>({width:1,height:1,close(){}});
globalThis.ProgressEvent ??= class {constructor(type,value){Object.assign(this,value);}};
const data=fs.readFileSync(new URL('../public/coach/flare-coach.glb',import.meta.url));
const {scene:model}=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
const rigData=JSON.parse(fs.readFileSync(new URL('../public/coach/coach-rig.json',import.meta.url),'utf8'));
const motion=createCoachMotion({model,driver:createFlareRig(),rigData});
const failures=[],warnings=[],samples=[],anchors=[];
let maximumLengthError=0,maximumSupportDrift=0,maximumAnchorAppliedPoseChange=0;
let maximumPelvisCorrection=0,maximumWristCorrection=0,maximumAnkleCorrection=0;
const apply=(time,kind)=>{
 const requested=sequence.sample(time);
 try{
  const effective=motion.applyPose(requested),metrics=motion.getMetrics();finite(effective);finite(metrics);
  let lengthError=0,supportDrift=0;
  for(const [name,length] of Object.entries(metrics.segmentLengths))lengthError=Math.max(lengthError,Math.abs(length-metrics.expectedLengths[name]));
  for(const drift of Object.values(metrics.supportDrift))if(drift!==null)supportDrift=Math.max(supportDrift,drift);
  assert.ok(lengthError<1e-6,'Bone length changed');assert.ok(supportDrift<1e-6,'Locked support drifted');
  const requestedSupports=SIDES.filter(side=>requested.limbs[side].handLocked);equal(metrics.supportHands,requestedSupports,'Runtime changed support flags');equal(effective.groundLock,requested.groundLock);
  maximumLengthError=Math.max(maximumLengthError,lengthError);maximumSupportDrift=Math.max(maximumSupportDrift,supportDrift);
  const appliedPoseChange=poseDistance(requested,effective);
  const distance=(a,b)=>Math.hypot(...a.map((value,index)=>value-b[index]));
  const pelvisCorrection=distance(requested.pelvis,effective.pelvis);
  const wristCorrection=Math.max(...SIDES.map(side=>distance(requested.limbs[side].wrist,effective.limbs[side].wrist)));
  const ankleCorrection=Math.max(...SIDES.map(side=>distance(requested.limbs[side].ankle,effective.limbs[side].ankle)));
  maximumPelvisCorrection=Math.max(maximumPelvisCorrection,pelvisCorrection);
  maximumWristCorrection=Math.max(maximumWristCorrection,wristCorrection);
  maximumAnkleCorrection=Math.max(maximumAnkleCorrection,ankleCorrection);
  if(kind==='anchor')maximumAnchorAppliedPoseChange=Math.max(maximumAnchorAppliedPoseChange,appliedPoseChange);
  if(metrics.warnings.length)warnings.push({time,kind,warnings:metrics.warnings,appliedPoseChange});
  const result={time,stepIndex:sequence.stepAt(time),supportHands:metrics.supportHands,lengthError,supportDrift,appliedPoseChange,pelvisCorrection,wristCorrection,ankleCorrection,minFootHeight:metrics.minFootHeight,warnings:metrics.warnings};
  (kind==='anchor'?anchors:samples).push(result);
 }catch(error){failures.push({time,kind,message:error.message});}
};
for(let index=0;index<9;index++)apply(index,'anchor');
for(let index=0;index<120;index++)apply((index+.5)*9/120,'interpolation');
const report={pass:!failures.length&&maximumAnchorAppliedPoseChange<1e-5,source:'public/coach/flare-sequence.json',sourceKind:'User first five edited poses plus the existing four mirrored continuation poses',pureChecks,runtimeFlagChecks:checks-pureChecks,period:sequence.period,steps:9,anchorPosesByteExact:true,keyframes:sequence.keyframes,maximumMirrorPositionError,maximumContinuityPositionJump,maximumContinuityAngleJump,bones:rigData.bones.length,anchorCount:anchors.length,interpolationCount:samples.length,maximumLengthError,maximumSupportDrift,maximumAnchorAppliedPoseChange,maximumPelvisCorrection,maximumWristCorrection,maximumAnkleCorrection,unreachableCount:failures.length,failures,constrainedSampleCount:warnings.length,warnings,anchors,samples};
const output=new URL('../output/flare-sequence/',import.meta.url);fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(new URL('sequence-module-verification.json',output),JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,pureChecks,runtimeFlagChecks:checks-pureChecks,anchors:anchors.length,interpolations:samples.length,maximumLengthError,maximumSupportDrift,maximumAnchorAppliedPoseChange,maximumPelvisCorrection,maximumWristCorrection,maximumAnkleCorrection,unreachableCount:failures.length,constrainedSampleCount:warnings.length,failures,warnings:warnings.slice(0,6)},null,2));
assert.ok(report.pass,'Sequence runtime failed; inspect output/flare-sequence/sequence-module-verification.json');
