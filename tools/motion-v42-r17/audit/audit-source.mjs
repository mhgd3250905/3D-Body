// Read-only direct authoring sampler / actual baked GLB comparison at exact keys.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as T from 'three';
import {loadGlb,readJson,names} from '../../../app/scene/tools/bake-v41-node.mjs';
import {createReferenceMotion} from '../../../tools/motion-v42-r16/reference-motion.mjs';
import {root,auditArguments,assetPaths,checkInputs} from './cli.mjs';
const args=auditArguments('audit-source','output/flare-v42-r16-20261017'),out=args.out;
checkInputs(args,[...assetPaths(args.candidate),...assetPaths('output/flare-v42-r14-20261016'),'app/scene/source/coach/flare-coach-v41-base.glb','app/scene/source/coach/coach-v41-rig.json','output/flare-v42-r14-20261016/recovery-samples.json','output/flare-v42-r14-20261016/comparison-clock.json','tools/motion-v42-r16/reference-motion.mjs']);
const source=await loadGlb('../../output/flare-v42-r14-20261016/flare-training-v42-candidate.glb');
const model=(await loadGlb('../../output/flare-v42-r14-20261016/flare-training-v42-candidate.glb')).scene;
const baseline=(await loadGlb('source/coach/flare-coach-v41-base.glb')).scene;
const recovery=JSON.parse(fs.readFileSync(path.join(root,'output/flare-v42-r14-20261016/recovery-samples.json'),'utf8'));
const clock=JSON.parse(fs.readFileSync(path.join(root,'output/flare-v42-r14-20261016/comparison-clock.json'),'utf8'));
const motion=createReferenceMotion({model,sourceModel:source.scene,baselineModel:baseline,rigData:readJson('source/coach/coach-v41-rig.json'),clip:source.animations[0],clock,palmAnchors:{left:recovery[0].joints.leftPalm,right:recovery[0].joints.rightPalm}});
const target=await loadGlb('../../'+path.relative(root,path.join(root,args.candidate,'flare-training-v42-candidate.glb')).replaceAll('\\','/'));
const mixer=new T.AnimationMixer(target.scene),clip=target.animations[0],action=mixer.clipAction(clip);action.setLoop(T.LoopOnce,1);action.clampWhenFinished=true;action.play();
const rows=[];const indices=[513,520,530,539,540,0,1,3,5,10,15,16,20,25,30,40,45,270,271,275,276,280,285,290,300,540,0,16];
const references=new Map();let arbitrarySeekPositionMm=0,arbitrarySeekRotationDegrees=0;
for(const i of indices){const phase=i/540;motion.updatePhase(phase);model.updateMatrixWorld(true);action.enabled=true;action.paused=false;mixer.setTime(phase*clip.duration);target.scene.updateMatrixWorld(true);let positionMm=0,rotationDegrees=0;const transforms={};
 for(const n of names){const a=model.getObjectByName(n),b=target.scene.getObjectByName(n),pa=a.getWorldPosition(new T.Vector3()),qa=a.getWorldQuaternion(new T.Quaternion()).normalize();positionMm=Math.max(positionMm,pa.distanceTo(b.getWorldPosition(new T.Vector3()))*1000);rotationDegrees=Math.max(rotationDegrees,T.MathUtils.radToDeg(qa.angleTo(b.getWorldQuaternion(new T.Quaternion()).normalize())));transforms[n]={p:pa.toArray(),q:qa.toArray()};}
 if(references.has(i)){const previous=references.get(i);for(const n of names){arbitrarySeekPositionMm=Math.max(arbitrarySeekPositionMm,new T.Vector3(...transforms[n].p).distanceTo(new T.Vector3(...previous[n].p))*1000);arbitrarySeekRotationDegrees=Math.max(arbitrarySeekRotationDegrees,T.MathUtils.radToDeg(new T.Quaternion(...transforms[n].q).angleTo(new T.Quaternion(...previous[n].q))))}}
 references.set(i,transforms);rows.push({i,phase,positionMm,rotationDegrees,metrics:motion.getMetrics()});
}
const report={generated:new Date().toISOString(),method:'Frozen R14 input / exact current R16 authoring sampler evaluated in scrambled phase order; actual R16 GLB evaluated via AnimationMixer at the corresponding 540-sample key phases.',maxBakedVsSourcePositionMm:Math.max(...rows.map(r=>r.positionMm)),maxBakedVsSourceRotationDegrees:Math.max(...rows.map(r=>r.rotationDegrees)),arbitrarySeekPositionMm,arbitrarySeekRotationDegrees,rows};
fs.writeFileSync(path.join(out,'source-vs-glb.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,rows:undefined},null,2));
