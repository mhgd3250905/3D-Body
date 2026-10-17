// Independent actual GLB regression check for R17 takeoff-retime correction.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
globalThis.ProgressEvent??=class{constructor(type,fields){this.type=type;Object.assign(this,fields)}};
globalThis.createImageBitmap??=async()=>({width:1,height:1,close(){}});
import {root,auditArguments,assetPaths,checkInputs} from './cli.mjs';
const args=auditArguments('verify-r17'),out=args.out,candidate=args.candidate;
checkInputs(args,[...assetPaths('output/flare-v42-r16-20261017'),...assetPaths(candidate)]);
const V=a=>new T.Vector3(...a),Q=a=>new T.Quaternion(...a),deg=T.MathUtils.radToDeg,hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const N=10000;
async function sample(dir,kind){
 const file=path.join(root,dir,`flare-${kind}-v42-candidate.glb`),bytes=fs.readFileSync(file),gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const scene=gltf.scene,clip=gltf.animations[0],bones=new Map();scene.traverse(o=>{if(o.isBone)bones.set(o.name,o)});
 const mixer=new T.AnimationMixer(scene),action=mixer.clipAction(clip);action.setLoop(T.LoopOnce,1);action.clampWhenFinished=true;action.play();
 const read=phase=>{scene.updateMatrixWorld(true);const transforms=Object.fromEntries([...bones].map(([n,b])=>[n,{p:b.getWorldPosition(new T.Vector3()).toArray(),q:b.getWorldQuaternion(new T.Quaternion()).normalize().toArray()}])),p=n=>V(transforms[n].p);
  const elbows=Object.fromEntries(['left','right'].map(s=>{const a=p(s+'UpperArm'),b=p(s+'Forearm'),c=p(s+'Hand');return[s,{degrees:deg(a.clone().sub(b).angleTo(c.clone().sub(b))),upperLength:a.distanceTo(b),lowerLength:b.distanceTo(c)}]}));
  const torsoInverse=Q(transforms.torso.q).invert(),torsoOrigin=p('torso'),torsoLocal=Object.fromEntries(['leftUpperArm','rightUpperArm','neck','head'].map(n=>[n,p(n).sub(torsoOrigin).applyQuaternion(torsoInverse).toArray()]));return{phase,transforms,elbows,torsoLocal};};
 const rows=[];for(let i=0;i<=N;i++){action.enabled=true;action.paused=false;mixer.setTime(i/N*clip.duration);rows.push(read(i/N));}
 const repeatDifference={positionMm:0,rotationDegrees:0};action.setLoop(T.LoopRepeat,Infinity);
 for(let i=-500;i<=500;i++){const phase=((i/N)%1+1)%1,index=Math.round(phase*N),old=rows[index];action.enabled=true;action.paused=false;mixer.setTime((1+i/N)*clip.duration);const now=read(phase);for(const n of bones.keys()){repeatDifference.positionMm=Math.max(repeatDifference.positionMm,V(now.transforms[n].p).distanceTo(V(old.transforms[n].p))*1000);repeatDifference.rotationDegrees=Math.max(repeatDifference.rotationDegrees,deg(Q(now.transforms[n].q).angleTo(Q(old.transforms[n].q))))}}
 mixer.stopAllAction();mixer.uncacheRoot(scene);return{file,sha256:hash(bytes),duration:clip.duration,rows,repeatDifference};
}
const data={};for(const [label,dir]of [['r16','output/flare-v42-r16-20261017'],['r17',candidate]])for(const kind of ['training','coach'])data[label+'-'+kind]=await sample(dir,kind);
const peak=()=>({value:0,phase:0,bone:null}),put=(p,v,phase,bone)=>{if(v>p.value)Object.assign(p,{value:v,phase,bone})};
const windows=[['right',0,.08,'takeoffRight'],['left',.5,.58,'takeoffLeft'],['left',.937,.998,'landingLeft'],['right',.437,.498,'landingRight']];
function angles(rows,side,lo,hi){const r=rows.filter(x=>x.phase>=lo&&x.phase<=hi),values=r.map(x=>x.elbows[side].degrees),min=Math.min(...values),max=Math.max(...values);return{side,lo,hi,min,minPhase:r[values.indexOf(min)].phase,max,maxPhase:r[values.indexOf(max)].phase};}
const results={};
for(const kind of ['training','coach']){
 const a=data['r16-'+kind],b=data['r17-'+kind],unmodifiedPosition=peak(),unmodifiedRotation=peak(),supportWrist=peak(),span=peak(),attachment=peak(),landingPosition=peak(),landingRotation=peak(),seamPosition=peak(),seamRotation=peak();
 for(let i=0;i<=N;i++){const x=a.rows[i],y=b.rows[i],p=y.phase,unmodified=p>=.082&&p<=.5||p>=.582,landing=p>=.937&&p<=.998||p>=.437&&p<=.498;
  for(const n of Object.keys(y.transforms)){const dp=V(y.transforms[n].p).distanceTo(V(x.transforms[n].p))*1000,dq=deg(Q(y.transforms[n].q).angleTo(Q(x.transforms[n].q)));if(unmodified){put(unmodifiedPosition,dp,p,n);put(unmodifiedRotation,dq,p,n)}if(landing){put(landingPosition,dp,p,n);put(landingRotation,dq,p,n)}if(i===N){put(seamPosition,V(y.transforms[n].p).distanceTo(V(b.rows[0].transforms[n].p))*1000,p,n);put(seamRotation,deg(Q(y.transforms[n].q).angleTo(Q(b.rows[0].transforms[n].q))),p,n)}}
  for(const s of ['left','right']){if(s==='right'?p<=.08:p>=.5&&p<=.58)put(supportWrist,V(y.transforms[s+'Hand'].p).distanceTo(V(x.transforms[s+'Hand'].p))*1000,p,s+'Hand');for(const l of ['upperLength','lowerLength'])put(span,Math.abs(y.elbows[s][l]-x.elbows[s][l])*1000,p,s+l)}
  for(const n of Object.keys(y.torsoLocal))put(attachment,V(y.torsoLocal[n]).distanceTo(V(x.torsoLocal[n]))*1000,p,n);
 }
 const seam={};for(const n of ['pelvis','torso','rightUpperArm','rightForearm','rightHand','leftUpperArm','leftForearm','leftHand']){seam[n]=Object.fromEntries([['r16',a],['r17',b]].map(([label,asset])=>{const r=asset.rows,p0=V(r[0].transforms[n].p),before=p0.clone().sub(V(r[N-1].transforms[n].p)).multiplyScalar(N/asset.duration),after=V(r[1].transforms[n].p).sub(p0).multiplyScalar(N/asset.duration);return[label,{velocityDiscontinuityMps:after.distanceTo(before),beforeVelocity:before.toArray(),afterVelocity:after.toArray()}]}));}
 results[kind]={r16Hash:a.sha256,r17Hash:b.sha256,windows:Object.fromEntries(windows.map(([s,lo,hi,label])=>[label,{r16:angles(a.rows,s,lo,hi),r17:angles(b.rows,s,lo,hi)}])),peaks:{unmodifiedPositionMm:unmodifiedPosition,unmodifiedRotationDegrees:unmodifiedRotation,supportWristPositionMm:supportWrist,armSpanDifferenceMm:span,torsoLocalShoulderNeckHeadDifferenceMm:attachment,landingPositionMm:landingPosition,landingRotationDegrees:landingRotation,seamPositionMm:seamPosition,seamRotationDegrees:seamRotation},repeatDifference:b.repeatDifference,seam};
}
const report={generated:new Date().toISOString(),candidate,method:'Actual R16 and R17 GLBs, two bodies, 10001 phases each; LoopRepeat independently compared to explicit LoopOnce phases over cyclic ±5%. Unmodified area excludes the baked interpolation frame adjacent to 8%/58%.',results,limits:['Skin surface contact checked separately by parent agent.','Kinematics only, not dynamics.']};
fs.writeFileSync(path.join(out,path.basename(candidate)+'-audit.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,results:Object.fromEntries(Object.entries(results).map(([k,r])=>[k,{...r,seam:undefined}]))},null,2));
