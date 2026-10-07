import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createMovementGuide } from '../src/movement-guide.js';
import { resolveMovementLesson, resolveMovementPoseAnnotations } from '../src/movement-lessons.js';
import { transitionOptions } from '../src/transition-edits.js';

globalThis.createImageBitmap ??= async () => ({width:1,height:1,close(){}});
globalThis.ProgressEvent ??= class {constructor(type, fields){this.type=type;Object.assign(this,fields);}};
const read = path => fs.readFileSync(new URL(path, import.meta.url));
const snapshot = JSON.parse(read('../托马斯/阶段1-可用动画-2026-10-06.json'));
const sequence = {...snapshot.sequence,...transitionOptions(snapshot)};
const snapshotBefore = JSON.stringify(snapshot);
const bytes = read('../public/coach/flare-coach.glb');
const {scene:model} = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const scene = new THREE.Scene();scene.add(model);
const motion = createCoachMotion({model,rigData:JSON.parse(read('../public/coach/coach-rig.json'))});
motion.setSequence(sequence.steps,sequence);
const range = resolveMovementLesson(sequence);
assert.ok(range);
motion.update(range.startTime+.4*range.duration);
const beforePose = motion.capturePose();
const data = motion.sampleTrajectory({...range,samples:48});
assert.deepEqual(motion.capturePose(),beforePose,'Sampling must not move the live pose');
assert.equal(JSON.stringify(snapshot),snapshotBefore,'Teaching must preserve the accepted snapshot');
console.log('OK Accepted animation and live pose remain unchanged by sampling');

let maxJointError = 0;
for(const index of [0,12,24,36,47]){
  const sample = data.frames[index];motion.update(sample.time);
  const live = motion.getMetrics();
  for(const [joint,position] of Object.entries(sample.joints)){
    const error = new THREE.Vector3().fromArray(position).distanceTo(new THREE.Vector3().fromArray(live.joints[joint]));
    maxJointError = Math.max(maxJointError,error);assert.ok(error<1e-8,`${joint} must follow the actual saved skeleton`);
  }
}
console.log(`OK Sampled paths agree with playback skeleton (max error ${maxJointError})`);

const originals=[];
model.traverse(mesh=>{if(mesh.isMesh)originals.push({mesh,material:mesh.material,geometry:mesh.geometry});});
const guide=createMovementGuide({scene,model});
guide.setData(data);guide.setVisible({enabled:true});
motion.update(range.startTime+.45*range.duration);
const guidePose=motion.capturePose();
for(const group of ['shoulders','scapular','arms','core','hipFlexors']){
  guide.setFocus(group);guide.update(motion.getMetrics().time,motion.getMetrics());
  assert.equal(guide.getStatus().pathCount,2);
  assert.ok(guide.getStatus().surfaceInstalled);
  assert.deepEqual(motion.capturePose(),guidePose);
  for(const entry of originals)assert.equal(entry.mesh.geometry,entry.geometry,'Surface marks cannot replace geometry');
}
assert.equal(guide.getStatus().forceMagnitude,false);
assert.equal(guide.getStatus().measuredActivation,false);
console.log('OK Five functional regions preserve the pose and actual Snow mesh');
for (let index=0;index<sequence.steps.length;index++) {
  const profile=resolveMovementPoseAnnotations(sequence,index);
  if(!profile)continue;
  motion.update(profile.time);const pose=motion.capturePose(),metrics=motion.getMetrics();
  guide.setData({startTime:profile.time,endTime:profile.time,frames:[{time:profile.time,joints:metrics.joints}]});
  guide.setAnnotations({regions:profile.regions,cues:profile.cues});guide.setFocus(null);
  guide.update(profile.time,metrics);
  const status=guide.getStatus();
  assert.equal(status.regionCount,profile.regions.length);
  assert.equal(status.colouredRegionCount,profile.regions.length,'All current regions must be visible together');
  assert.deepEqual(status.supportHands,profile.supportHands,'Push arrows follow actual locked hands');
  assert.equal(status.cueCount,0,'Palm arrows must not be duplicated');
  assert.equal(status.pathCount,0,'Static annotations do not require a path');
  guide.setFocus('core');guide.update(profile.time,metrics);
  assert.equal(guide.getStatus().colouredRegionCount,profile.regions.length,'Selecting a region preserves all other marks');
  assert.deepEqual(motion.capturePose(),pose,'Annotations cannot move a saved pose');
}
assert.equal(JSON.stringify(snapshot),snapshotBefore);
console.log('OK All original key poses show simultaneous regions and actual support hands without changing poses');
guide.setVisible({enabled:false});
for(const entry of originals)assert.equal(entry.mesh.material,entry.material,'Turning the guide off must restore materials');
guide.dispose();
assert.equal(guide.getStatus().disposed,true);
assert.equal(scene.getObjectByName('movement-teaching-guide'),undefined);
console.log('OK Closing and disposing restores the original materials');
console.log('Movement sample: 5 focused integration checks passed.');
