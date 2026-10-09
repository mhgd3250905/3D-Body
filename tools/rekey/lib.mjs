import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const R=new URL('../../',import.meta.url).pathname;
const {createFlareSequence}=await import(R+'src/flare-sequence.js');
const {createCoachMotion}=await import(R+'src/coach-motion.js');
const {createFlareRig}=await import(R+'src/flare-rig.js');
export const {mirrorPose}=await import(R+'src/pose-mirror.js');
globalThis.createImageBitmap ??= async()=>({width:1,height:1,close(){}});
globalThis.ProgressEvent ??= class {constructor(t,v){Object.assign(this,v);}};
const data=fs.readFileSync(R+'public/coach/flare-coach.glb');
const {scene:model}=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');
const rigData=JSON.parse(fs.readFileSync(R+'public/coach/coach-rig.json','utf8'));
export const motion=createCoachMotion({model,driver:createFlareRig(),rigData});
export const load=f=>JSON.parse(fs.readFileSync(R+f,'utf8'));
export function report(steps,label){
  const seq=createFlareSequence(steps,{period:steps.length});
  const keys=[];
  for(let i=0;i<steps.length-1;i++){const e=motion.applyPose(steps[i].pose),m=motion.getMetrics();
    const L=e.limbs, mid=[0,1,2].map(k=>(L.left.ankle[k]+L.right.ankle[k])/2-e.pelvis[k]);
    keys.push({k:steps[i].id.slice(12,26),pelY:+e.pelvis[1].toFixed(2),ankY:[+L.left.ankle[1].toFixed(2),+L.right.ankle[1].toFixed(2)],wrY:[+L.left.wrist[1].toFixed(2),+L.right.wrist[1].toFixed(2)],az:+(Math.atan2(mid[0],mid[2])*180/Math.PI).toFixed(0),spread:+Math.hypot(...[0,1,2].map(k=>L.left.ankle[k]-L.right.ankle[k])).toFixed(2),warn:m.warnings.length});}
  let minAnk=9,pelMin=9,pelMax=0;
  for(let i=0;i<360;i++){const e=motion.applyPose(seq.sample(i*(steps.length-1)/360));minAnk=Math.min(minAnk,e.limbs.left.ankle[1],e.limbs.right.ankle[1]);pelMin=Math.min(pelMin,e.pelvis[1]);pelMax=Math.max(pelMax,e.pelvis[1]);}
  console.log('==',label);console.table(keys);console.log('loop minAnkleY',minAnk.toFixed(3),'pelvis range',pelMin.toFixed(2),pelMax.toFixed(2));
  return keys;
}
