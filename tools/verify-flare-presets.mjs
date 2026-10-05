import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createFlareRig } from '../src/flare-rig.js';
import { createFlarePosePresets } from '../src/pose-presets.js';
import { mirrorPose, mirrorText } from '../src/pose-mirror.js';
import { OFFICIAL_FLARE_SEQUENCE } from '../src/official-poses.js';

const clone=value=>structuredClone(value), SIDES=['left','right'], TOLERANCE=1e-6;
const sourceBytes=fs.readFileSync(new URL('../托马斯/5.json',import.meta.url));
const authored=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''));
const bundle=JSON.parse(fs.readFileSync(new URL('../public/coach/flare-sequence.json',import.meta.url),'utf8'));
const sourceNumbers=[1,2,3,4,5,4,3,2,1];
const ids=['flare-front-open','flare-right-transfer','flare-right-high-v','flare-front-pass','flare-rear-open','flare-left-pass','flare-left-high-v','flare-left-transfer','flare-front-reconnect'];
const phases=['front','sideA','sideA','sideA','rear','sideB','sideB','sideB','front'];
assert.equal(authored.steps.length,5);
assert.deepEqual(OFFICIAL_FLARE_SEQUENCE,bundle);
assert.equal(bundle.format,'flare-demonstration');assert.equal(bundle.version,1);assert.equal(bundle.period,9);
assert.deepEqual(bundle.steps.map(step=>step.id),ids);assert.deepEqual(bundle.steps.map(step=>step.phase),phases);
assert.equal(bundle.source.file,'托马斯/5.json');assert.equal(bundle.source.exportedAt,authored.exportedAt);
assert.deepEqual(bundle.source.firstFiveIds,authored.steps.map(step=>step.id));
for(let index=0;index<9;index++){
  const source=authored.steps[sourceNumbers[index]-1],step=bundle.steps[index];
  assert.deepEqual(step.pose,index<5?source.pose:mirrorPose(source.pose),`Step ${index+1}: saved source pose changed`);
  assert.equal(step.name,index<5?source.name:mirrorText(source.name));assert.equal(step.sourceStepId,source.id);
  assert.equal(step.mirrored,index>=5);if(index>=5)assert.equal(step.mirrorSourceNumber,sourceNumbers[index]);
}

globalThis.createImageBitmap??=async()=>({width:1,height:1,close(){}});
globalThis.ProgressEvent??=class{constructor(type,value){Object.assign(this,value);}};
const data=fs.readFileSync(new URL('../public/coach/flare-coach.glb',import.meta.url));
const {scene:model}=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
const rigData=JSON.parse(fs.readFileSync(new URL('../public/coach/coach-rig.json',import.meta.url),'utf8'));
const motion=createCoachMotion({model,driver:createFlareRig(),rigData});
const vector=value=>new THREE.Vector3().fromArray(value);
const degrees=value=>THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(value,-1,1)));
const before=motion.capturePose(),bundleBefore=clone(bundle),presets=createFlarePosePresets(motion);
assert.equal(motion.getMetrics().mode,'standing');assert.deepEqual(motion.capturePose(),before);
assert.equal(presets.length,9);assert.equal(new Set(presets.map(item=>item.id)).size,9);
presets.forEach((item,index)=>assert.deepEqual(item.pose,bundle.steps[index].pose));

// Actual footwear vertices, not bounding boxes, joints or the old driver.
const samples=[];
model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return;
  const indices=mesh.geometry.getAttribute('skinIndex'),weights=mesh.geometry.getAttribute('skinWeight');
  const shoe=/Coach_(Sneakers|Soles|Shoe_Details)/.test(mesh.name);
  for(let index=0;index<indices.count;index++){
    const groups=new Set();
    for(let component=0;component<4;component++){
      const name=mesh.skeleton.bones[indices.getComponent(index,component)]?.name;
      if(weights.getComponent(index,component)>.70&&(/Hand$/.test(name)||(shoe&&/Foot$/.test(name))))groups.add(name);
    }
    if(groups.size)samples.push({mesh,index,groups:[...groups]});
  }
});
for(const name of ['leftHand','rightHand','leftFoot','rightFoot'])assert.ok(samples.some(sample=>sample.groups.includes(name)),`${name}: missing real mesh samples`);
function actualMinimumY(){
  const minimum={leftHand:Infinity,rightHand:Infinity,leftFoot:Infinity,rightFoot:Infinity};
  const inverse=model.matrixWorld.clone().invert(),p=new THREE.Vector3();
  for(const {mesh,index,groups} of samples){
    mesh.getVertexPosition(index,p).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);
    for(const name of groups)minimum[name]=Math.min(minimum[name],p.y);
  }
  assert.ok(Object.values(minimum).every(Number.isFinite));return minimum;
}
function poseError(actual,expected,label){
  let maximum=0;
  const position=(a,b,key)=>{
    const difference=vector(a).distanceTo(vector(b));maximum=Math.max(maximum,difference);
    assert.ok(difference<=TOLERANCE,`${label}: ${key} changed by ${difference} m`);
  };
  const rotation=(a,b,key)=>{
    const first=new THREE.Quaternion().fromArray(a).normalize().toArray(),second=new THREE.Quaternion().fromArray(b).normalize().toArray();
    const difference=Math.min(Math.hypot(...first.map((v,i)=>v-second[i])),Math.hypot(...first.map((v,i)=>v+second[i])));
    maximum=Math.max(maximum,difference);assert.ok(difference<=TOLERANCE,`${label}: ${key} direction changed by ${difference}`);
  };
  position(actual.pelvis,expected.pelvis,'pelvis');rotation(actual.bodyQuaternion,expected.bodyQuaternion,'bodyQuaternion');
  assert.equal(actual.groundLock,expected.groundLock);
  for(const side of SIDES){
    for(const key of ['wrist','elbowPole','ankle','kneePole'])position(actual.limbs[side][key],expected.limbs[side][key],`${side}.${key}`);
    for(const key of ['handQuaternion','footQuaternion'])rotation(actual.limbs[side][key],expected.limbs[side][key],`${side}.${key}`);
    assert.equal(actual.limbs[side].handLocked,expected.limbs[side].handLocked);
  }
  return maximum;
}
function invariants(metrics,label){
  assert.deepEqual(metrics.warnings,[],`${label}: source pose was constrained`);
  let error=0;
  for(const [name,length] of Object.entries(metrics.segmentLengths)){
    assert.ok(Number.isFinite(metrics.expectedLengths[name]),`${name}: expected length missing`);
    error=Math.max(error,Math.abs(length-metrics.expectedLengths[name]));
  }
  assert.ok(error<=TOLERANCE,`${label}: real bone length changed`);
  assert.ok(Object.values(metrics.supportDrift).every(value=>value===null||value<=TOLERANCE),`${label}: locked hand drift`);
  return error;
}

const results=[];
for(const [index,item] of presets.entries()){
  assert.ok(item.technique?.hands&&item.technique?.feet&&item.technique?.body&&item.technique?.cue);
  assert.ok(item.technique.sourceUrls.length&&item.technique.sourceUrls.every(url=>/^https:\/\//.test(url)));
  motion.applyPose(item.pose);
  const metrics=motion.getMetrics();assert.equal(metrics.mode,'manual');assert.deepEqual(metrics.supportHands,item.supportHands);
  const maximumLengthError=invariants(metrics,item.id),maximumApplyPoseError=poseError(motion.capturePose(),item.pose,item.id);
  const minimum=actualMinimumY();assert.ok(Math.min(minimum.leftFoot,minimum.rightFoot)>=-TOLERANCE,`${item.id}: actual shoe crossed floor`);
  const kneeFlexDegrees={},legDirection=side=>vector(metrics.joints[side+'Ankle']).sub(vector(metrics.joints[side+'Hip'])).normalize();
  for(const side of SIDES){
    const thigh=vector(metrics.joints[side+'Knee']).sub(vector(metrics.joints[side+'Hip'])).normalize();
    const shin=vector(metrics.joints[side+'Ankle']).sub(vector(metrics.joints[side+'Knee'])).normalize();
    kneeFlexDegrees[side]=degrees(thigh.dot(shin));
  }
  // Preserve user wrist heights. Never force the historical 6 mm convention.
  const authoredWristY=Object.fromEntries(SIDES.map(side=>[side,item.pose.limbs[side].wrist[1]]));
  motion.update(index);const playbackMetrics=motion.getMetrics();
  assert.equal(playbackMetrics.mode,'flare');assert.equal(playbackMetrics.time,index);
  invariants(playbackMetrics,`${item.id}: integer playback`);
  const maximumPlaybackPoseError=poseError(motion.capturePose(),item.pose,`${item.id}: integer playback`),playbackMinimum=actualMinimumY();
  for(const side of item.supportHands){
    assert.ok(Math.abs(playbackMetrics.joints[side+'Wrist'][1]-authoredWristY[side])<=TOLERANCE);
    assert.ok(Math.abs(playbackMinimum[side+'Hand']-minimum[side+'Hand'])<=TOLERANCE,`${item.id}: playback changed source hand mesh height`);
  }
  assert.ok(Math.min(playbackMinimum.leftFoot,playbackMinimum.rightFoot)>=-TOLERANCE);
  const bodyY=new THREE.Vector3(0,1,0).applyQuaternion(new THREE.Quaternion().fromArray(metrics.bodyQuaternion));
  results.push({number:index+1,id:item.id,name:item.name,phase:item.phase,sourceNumber:sourceNumbers[index],mirrored:item.mirrored,
    supports:item.supportHands,authoredWristY,bodyTiltDegrees:degrees(bodyY.y),averageHipHeight:(metrics.joints.leftHip[1]+metrics.joints.rightHip[1])/2,
    openingDegrees:degrees(legDirection('left').dot(legDirection('right'))),kneeFlexDegrees,
    ankleHeights:{left:metrics.joints.leftAnkle[1],right:metrics.joints.rightAnkle[1]},actualMinimumY:minimum,playbackMinimumY:playbackMinimum,
    maximumLengthError,maximumApplyPoseError,maximumPlaybackPoseError,supportDrift:metrics.supportDrift});
}
const statePreservation=[];
for(const mode of ['standing','manual','flare']){
  if(mode==='standing')motion.reset();else if(mode==='manual')motion.applyPose(presets[2].pose);else motion.update(1.35);
  const current=motion.capturePose(),metrics=motion.getMetrics(),returned=createFlarePosePresets(motion);
  assert.deepEqual(motion.capturePose(),current,`${mode}: template creation changed live pose`);
  assert.equal(motion.getMetrics().mode,metrics.mode);assert.equal(motion.getMetrics().time,metrics.time);
  returned[0].pose.limbs.left.ankle[0]+=2;returned[0].name='修改返回对象';returned[0].technique.sourceUrls.push('https://example.invalid/mutated');
  assert.deepEqual(createFlarePosePresets(motion)[0],presets[0]);statePreservation.push({mode,poseUnchanged:true,timeUnchanged:true});
}
assert.deepEqual(OFFICIAL_FLARE_SEQUENCE,bundleBefore);
const output=new URL('../output/pose-presets/',import.meta.url);fs.mkdirSync(output,{recursive:true});
const report={pass:true,sourceFile:'托马斯/5.json',sourceExportedAt:authored.exportedAt,sourceSHA256:crypto.createHash('sha256').update(sourceBytes).digest('hex'),
  sourcePosesPreserved:true,mirrorOrder:[4,3,2,1],integerPlaybackMatchesSource:true,character:rigData.source,bones:motion.getMetrics().skinning.bones,
  vertices:motion.getMetrics().skinning.weightedVertices,units:'meters / observed degrees',tolerance:TOLERANCE,angleConstraints:false,
  fixedSupportHeightConstraint:false,statePreservation,poses:results};
fs.writeFileSync(new URL('verification.json',output),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:true,poses:results.length,maximumLengthError:Math.max(...results.map(value=>value.maximumLengthError)),
  maximumPlaybackPoseError:Math.max(...results.map(value=>value.maximumPlaybackPoseError)),minimumShoeY:Math.min(...results.flatMap(value=>[value.actualMinimumY.leftFoot,value.actualMinimumY.rightFoot])),
  sourcePosesPreserved:true,fixedAngleConstraints:false},null,2));
