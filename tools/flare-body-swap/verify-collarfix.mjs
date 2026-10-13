// Verify the narrow collar derivative and the actual App shader integration.
// node tools/flare-body-swap/verify-collarfix.mjs --pipeline-root ROOT --url URL --report REPORT
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {fileURLToPath,pathToFileURL} from 'node:url';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2),opt=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const pipeline=path.resolve(opt('--pipeline-root',REPO)),url=opt('--url','http://127.0.0.1:8892');
const reportPath=path.resolve(opt('--report','collarfix-verification.json'));
const require=createRequire(path.join(REPO,'app/scene/package.json'));
const {NodeIO}=await import(pathToFileURL(require.resolve('@gltf-transform/core')).href);
const {ALL_EXTENSIONS}=await import(pathToFileURL(require.resolve('@gltf-transform/extensions')).href);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),prefix=path.join(REPO,'app/scene/source/coach');
const A=await io.read(path.join(prefix,'flare-coach-v41-training-human-animated.glb'));
const B=await io.read(path.join(prefix,'flare-coach-v41-training-human-collarfix-20261013.glb'));
const assertions=[],check=(name,pass,detail)=>assertions.push({name,pass,detail});
const equal=(a,b)=>a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
const changes=[];
for(const node of A.getRoot().listNodes()){
 const target=B.getRoot().listNodes().find(n=>n.getName()===node.getName());
 check('node TRS '+node.getName(),!!target&&equal(node.getTranslation(),target.getTranslation())&&equal(node.getRotation(),target.getRotation())&&equal(node.getScale(),target.getScale()));
 check('node children '+node.getName(),JSON.stringify(node.listChildren().map(n=>n.getName()))===JSON.stringify(target.listChildren().map(n=>n.getName())));
 if(node.getSkin()){
  check('skin joints '+node.getName(),JSON.stringify(node.getSkin().listJoints().map(n=>n.getName()))===JSON.stringify(target.getSkin().listJoints().map(n=>n.getName())));
  check('skin inverse bind matrices '+node.getName(),equal(node.getSkin().getInverseBindMatrices().getArray(),target.getSkin().getInverseBindMatrices().getArray()));
 }
 if(!node.getMesh())continue;
 const old=node.getMesh().listPrimitives(),next=target.getMesh().listPrimitives();check('primitive count '+node.getName(),old.length===next.length);
 for(let k=0;k<old.length;k++){
  check('indices '+node.getName(),equal(old[k].getIndices().getArray(),next[k].getIndices().getArray()));
  for(const semantic of old[k].listSemantics()){
   const same=equal(old[k].getAttribute(semantic).getArray(),next[k].getAttribute(semantic).getArray());
   if(!same)changes.push({mesh:node.getName(),attribute:semantic});
   check('attribute '+node.getName()+'.'+semantic,same||(node.getName()==='Mesh001'&&semantic==='COLOR_0'));
  }
  for(const semantic of next[k].listSemantics().filter(s=>!old[k].getAttribute(s)))check('added attribute '+node.getName()+'.'+semantic,semantic==='_SINK'&&['Coach_Body','Mesh001'].includes(node.getName()));
  const m=old[k].getMaterial(),n=next[k].getMaterial();
  check('material '+node.getName(),m.getName()===n.getName()&&m.getDoubleSided()===n.getDoubleSided()&&equal(m.getBaseColorFactor(),n.getBaseColorFactor())&&m.getRoughnessFactor()===n.getRoughnessFactor()&&m.getMetallicFactor()===n.getMetallicFactor());
 }
}
const ca=A.getRoot().listAnimations()[0],cb=B.getRoot().listAnimations()[0];check('44 channels',ca.listChannels().length===44&&cb.listChannels().length===44);
for(const channel of ca.listChannels()){
 const next=cb.listChannels().find(c=>c.getTargetNode().getName()===channel.getTargetNode().getName()&&c.getTargetPath()===channel.getTargetPath());
 check('track '+channel.getTargetNode().getName()+'.'+channel.getTargetPath(),!!next&&next.getSampler().getInterpolation()===channel.getSampler().getInterpolation()&&equal(channel.getSampler().getInput().getArray(),next.getSampler().getInput().getArray())&&equal(channel.getSampler().getOutput().getArray(),next.getSampler().getOutput().getArray()));
}
check('only native neck colour changed',changes.length===1&&changes[0].mesh==='Mesh001'&&changes[0].attribute==='COLOR_0',changes);
const {config}=await import(pathToFileURL(path.join(pipeline,'tools/drill-anim/lib/config.mjs')).href),C=config();
if(C.playwright_browsers_path)process.env.PLAYWRIGHT_BROWSERS_PATH=C.playwright_browsers_path;
const {chromium}=await import(pathToFileURL(C.playwright_module).href);
const b=await chromium.launch({args:C.chromium_args});let browser;const errors=[];
try {
 const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto(url+'/?body=training');await p.waitForFunction(()=>window.__flareScene,null,{timeout:170000});
 browser=await p.evaluate(async()=>{
  const {loadOfflineGlb}=await import('/src/assets.js');
  const {createBakedMotion}=await import('/src/baked-motion.js');
  const {applyTrainingClothSink}=await import('/src/player.js');
  const {buildMmRest,createSurfaceSelection}=await import('/src/mapped-mesh.js');
  const rig=await(await fetch('./coach/coach-v41-rig.json')).json();
  const a=await loadOfflineGlb('./coach/flare-coach-v41-training-human-animated.glb.gz'),b=await loadOfflineGlb('./coach/flare-coach-v41-training-human-collarfix-20261013.glb.gz');
  const ma=createBakedMotion(a,rig),mb=createBakedMotion(b,rig);let jointDelta=0,boneDelta=0;
  const bones=model=>{const m=new Map();model.traverse(n=>{if(n.isBone)m.set(n.name,n);});return m;};const ba=bones(a.scene),bb=bones(b.scene);
  for(let f=0;f<270;f++){
   ma.update(f/30);mb.update(f/30);const ja=ma.getMetrics().joints,jb=mb.getMetrics().joints;
   for(const n of Object.keys(ja))for(let k=0;k<3;k++)jointDelta=Math.max(jointDelta,Math.abs(ja[n][k]-jb[n][k]));
   for(const [n,bone]of ba)for(let k=0;k<16;k++)boneDelta=Math.max(boneDelta,Math.abs(bone.matrixWorld.elements[k]-bb.get(n).matrixWorld.elements[k]));
  }
  applyTrainingClothSink(b.scene);const skinned=buildMmRest(mb,b.scene),surface=createSurfaceSelection(skinned);
  const compile=material=>{const shader={uniforms:{},vertexShader:'#include <begin_vertex>\n#include <skinning_vertex>',fragmentShader:'void main() {\n#include <color_fragment>\n#include <emissivemap_fragment>\n}'};material.onBeforeCompile(shader);return shader.vertexShader;};
  const body=b.scene.getObjectByName('Coach_Body'),neck=b.scene.getObjectByName('Mesh001'),head=b.scene.getObjectByName('Toon_Mannequin_Head_v5');
  const original=body.material,neckMaterial=neck.material,headMaterial=head.material;
  const originalHook=compile(body.material);surface.show('deltoids',[],true);const focusHook=compile(body.material);
  const exclusion=neck.material===neckMaterial&&head.material===headMaterial;surface.restore();
  const restored=body.material===original;
  ma.dispose();mb.dispose();surface.dispose();
  return {frames:270,jointParityMaxMm:jointDelta*1000,boneMatrixMaxDelta:boneDelta,loadedSinkAttributes:skinned.filter(m=>m.geometry.hasAttribute('_sink')).map(m=>m.name),
   originalHookSink:originalHook.includes('transformed -= normalize(objectNormal) * trainingClothSink;'),
   focusHookSink:focusHook.includes('transformed -= normalize(objectNormal) * trainingClothSink;'),
   focusHookMmRest:focusHook.includes('vFocusRest = mmRest;'),faceAndHeadMaterialUnchanged:exclusion,originalMaterialRestored:restored};
 });
 // Compile and render both the regular actor and its real detail focus proxy.
 await p.screenshot({path:path.join(path.dirname(reportPath),'collarfix-home.png')});
 await p.evaluate(()=>flareBridge.command({type:'detail',groupId:'deltoids'}));await p.waitForTimeout(1000);
 await p.screenshot({path:path.join(path.dirname(reportPath),'collarfix-detail.png')});
 await p.evaluate(()=>flareBridge.command({type:'detail',groupId:null}));await p.waitForTimeout(400);
} finally {await b.close();}
check('270 frame joint parity',browser.jointParityMaxMm===0,browser.jointParityMaxMm);
check('270 frame bone matrix parity',browser.boneMatrixMaxDelta===0,browser.boneMatrixMaxDelta);
check('shader sink retained by detail focus proxy',browser.originalHookSink&&browser.focusHookSink&&browser.focusHookMmRest,browser);
check('face excluded and material restored',browser.faceAndHeadMaterialUnchanged&&browser.originalMaterialRestored);
check('no App scene / shader errors',errors.length===0,errors);
const report={pass:assertions.every(c=>c.pass),assertions,browser,errors};fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,assertions:assertions.length,failures:assertions.filter(x=>!x.pass),browser,errors},null,2));process.exit(report.pass?0:1);
