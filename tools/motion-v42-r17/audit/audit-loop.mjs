// Independent read-only cyclic seam diagnostics of actual motion GLBs.
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
const args=auditArguments('audit-loop'),out=args.out;
const versions=[['r14','output/flare-v42-r14-20261016'],['r15','output/flare-v42-r15-20261017'],['r16','output/flare-v42-r16-20261017'],['candidate',args.candidate]];
checkInputs(args,versions.flatMap(([,dir])=>assetPaths(dir)));
const V=a=>new T.Vector3(...a),Q=a=>new T.Quaternion(...a),deg=T.MathUtils.radToDeg;
const names=['pelvis','torso','neck','head','leftUpperArm','leftForearm','leftHand','rightUpperArm','rightForearm','rightHand'];
const wrap=p=>((p%1)+1)%1,hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function load(dir,kind){const file=path.join(root,dir,`flare-${kind}-v42-candidate.glb`),bytes=fs.readFileSync(file);const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');return{gltf,file,sha256:hash(bytes)}}
function pose(scene,phase){const tr=Object.fromEntries(names.map(n=>{const b=scene.getObjectByName(n);return[n,{p:b.getWorldPosition(new T.Vector3()).toArray(),q:b.getWorldQuaternion(new T.Quaternion()).normalize().toArray()}]}));const elbow=Object.fromEntries(['left','right'].map(s=>{const a=V(tr[s+'UpperArm'].p),b=V(tr[s+'Forearm'].p),c=V(tr[s+'Hand'].p),axis=c.clone().sub(a).normalize(),offset=b.clone().sub(a),bend=offset.clone().addScaledVector(axis,-offset.dot(axis));return[s,{degrees:deg(a.clone().sub(b).angleTo(c.clone().sub(b))),bendHeightMm:bend.length()*1000,bendDirection:bend.normalize().toArray(),reach:a.distanceTo(c),upperLength:a.distanceTo(b),lowerLength:b.distanceTo(c)}]}));return{phase,tr,elbow}}
function quaternionVelocity(a,b,dt){const q=Q(b).multiply(Q(a).invert()).normalize();if(q.w<0)q.set(-q.x,-q.y,-q.z,-q.w);const angle=2*Math.acos(T.MathUtils.clamp(q.w,-1,1)),s=Math.sin(angle/2);return new T.Vector3(q.x,q.y,q.z).multiplyScalar(s<1e-10?2/dt:angle/(s*dt));}
const results={};
for(const [version,dir] of versions)for(const kind of ['training','coach']){
 const {gltf,file,sha256}=await load(dir,kind),scene=gltf.scene,clip=gltf.animations[0],mixer=new T.AnimationMixer(scene),action=mixer.clipAction(clip);action.setLoop(T.LoopOnce,1);action.clampWhenFinished=true;action.play();
 const sample=p=>{action.enabled=true;action.paused=false;mixer.setTime(p*clip.duration);scene.updateMatrixWorld(true);return pose(scene,p)};
 const rows=[];for(let i=-500;i<=500;i++){const p=i/10000;rows.push({...sample(wrap(p)),unwrapped:p})}
 const key=[];for(let i=-28;i<=28;i++)key.push({...sample(wrap(i/540)),unwrapped:i/540});
 const seam={};for(const h of [1/540,.0001,.00001]){const a=sample(1-h),b=sample(0),c=sample(h),end=sample(1),dt=h*clip.duration;seam[h]={bones:Object.fromEntries(names.map(n=>{const v0=V(b.tr[n].p).sub(V(a.tr[n].p)).divideScalar(dt),v1=V(c.tr[n].p).sub(V(b.tr[n].p)).divideScalar(dt),w0=quaternionVelocity(a.tr[n].q,b.tr[n].q,dt),w1=quaternionVelocity(b.tr[n].q,c.tr[n].q,dt);return[n,{closureMm:V(end.tr[n].p).distanceTo(V(b.tr[n].p))*1000,closureDegrees:deg(Q(end.tr[n].q).angleTo(Q(b.tr[n].q))),beforeVelocity:v0.toArray(),afterVelocity:v1.toArray(),velocityDiscontinuityMps:v0.distanceTo(v1),beforeAngularVelocityDegrees:w0.multiplyScalar(180/Math.PI).toArray(),afterAngularVelocityDegrees:w1.multiplyScalar(180/Math.PI).toArray(),angularVelocityDiscontinuityDegrees:w0.distanceTo(w1)}]})),elbows:Object.fromEntries(['left','right'].map(s=>[s,{end:end.elbow[s],start:b.elbow[s],beforeDegreesPerSecond:(b.elbow[s].degrees-a.elbow[s].degrees)/dt,afterDegreesPerSecond:(c.elbow[s].degrees-b.elbow[s].degrees)/dt}]))}}
 const ranges=Object.fromEntries(['left','right'].map(s=>{const pre=rows.filter(r=>r.unwrapped<0),post=rows.filter(r=>r.unwrapped>=0);const range=x=>{const angles=x.map(r=>r.elbow[s].degrees),lo=Math.min(...angles),hi=Math.max(...angles);return{min:lo,minPhase:x[angles.indexOf(lo)].phase,max:hi,maxPhase:x[angles.indexOf(hi)].phase}};return[s,{before:range(pre),after:range(post)}]}));
 const repeatErrors={positionMm:0,rotationDegrees:0};action.setLoop(T.LoopRepeat,Infinity);for(const r of rows){action.enabled=true;action.paused=false;mixer.setTime((1+r.unwrapped)*clip.duration);scene.updateMatrixWorld(true);const actual=pose(scene,wrap(r.unwrapped));for(const n of names){repeatErrors.positionMm=Math.max(repeatErrors.positionMm,V(actual.tr[n].p).distanceTo(V(r.tr[n].p))*1000);repeatErrors.rotationDegrees=Math.max(repeatErrors.rotationDegrees,deg(Q(actual.tr[n].q).angleTo(Q(r.tr[n].q))))}}
 results[version+'-'+kind]={file,sha256,duration:clip.duration,seam,ranges,repeatErrors,key,rows};mixer.stopAllAction();mixer.uncacheRoot(scene);
}
fs.writeFileSync(path.join(out,'actual-loop-diagnostics.json'),JSON.stringify({generated:new Date().toISOString(),method:'Three.js actual GLBs, cyclic +/-5% in 0.01% increments; exact baked frame values and one-sided seam derivatives.',results},null,2)+'\n');
fs.writeFileSync(path.join(out,'angles-around-loop.csv'),'unwrappedPhase,'+Object.keys(results).flatMap(k=>[k+'-left',k+'-right']).join(',')+'\n'+results['r16-training'].rows.map((r,i)=>[r.unwrapped,...Object.keys(results).flatMap(k=>[results[k].rows[i].elbow.left.degrees,results[k].rows[i].elbow.right.degrees])].join(',')).join('\n')+'\n');
console.log(JSON.stringify({output:out,results:Object.fromEntries(Object.entries(results).map(([k,r])=>[k,{sha256:r.sha256,ranges:r.ranges,repeatErrors:r.repeatErrors,rightElbowSeamVelocityDifferenceMps:r.seam[.0001].bones.rightForearm.velocityDiscontinuityMps}]))},null,2));
