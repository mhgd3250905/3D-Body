// Flare v41 body-swap renderer (experiment, 2026-10-13).
// Renders the SAME baked Flare v41 clip (app/scene/source/coach/flare-coach-v41-animated.glb,
// AnimationMixer world matrices, no IK / pacing / rebake) on two bodies:
//   --mode new : the accepted drill-anim training human (training-human-v2: Snow-derived mesh,
//                grey faceless mannequin head, shoulder/collar skin fix, drill toon theme)
//   --mode old : the current web coach (Snow with face) in the web app's own stage/lighting
// node tools/flare-body-swap/render.mjs --mode new|old --out <dir> [--size 720] [--pr 1] [--no-crotch-smooth]
//      [--frames 0,27,66] | [--from 0 --to 270]
// Needs the root Vite dev server (APP_URL) and tools/drill-anim/config.json (Playwright paths).
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url)),REPO=path.resolve(HERE,'../..'),DA=path.join(REPO,'tools/drill-anim');
const A=process.argv.slice(2),opt=(k,d)=>{const i=A.indexOf(k);return i<0?d:A[i+1];};
const mode=opt('--mode','new'),out=path.resolve(opt('--out','out')),SZ=+opt('--size',720),PR=+opt('--pr',1);
fs.mkdirSync(out,{recursive:true});
const spec=JSON.parse(fs.readFileSync(path.join(DA,'batches/training-human-v2-20261013/specs/flare-v41-loop.json'),'utf8'));
spec.size=SZ;spec.highlight={groups:[],side:'both',pulseBase:1};
const FPS=30,N=spec.encodingFrames;
const frames=opt('--frames')?opt('--frames').split(',').map(Number):Array.from({length:(+opt('--to',N))-(+opt('--from',0))},(_,i)=>i+(+opt('--from',0)));
const t0=Date.now(),log=(...a)=>console.log(((Date.now()-t0)/1000).toFixed(1)+'s',...a);

// Rule metrics computed from the posed rig (identical in both modes: only the surface differs).
const METRICS=`(()=>{const v=flareInspector.viewer,J=v.motion.getMetrics().joints,V=a=>a,sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],len=a=>Math.hypot(...a),
 ang=(a,b,c)=>{const u=sub(a,b),w=sub(c,b);return Math.acos(Math.max(-1,Math.min(1,(u[0]*w[0]+u[1]*w[1]+u[2]*w[2])/len(u)/len(w))))*180/Math.PI;},
 segd=(p1,q1,p2,q2)=>{let best=9;for(let i=0;i<=20;i++){const s=i/20,a=[p1[0]+(q1[0]-p1[0])*s,p1[1]+(q1[1]-p1[1])*s,p1[2]+(q1[2]-p1[2])*s];for(let k=0;k<=20;k++){const t=k/20,b=[p2[0]+(q2[0]-p2[0])*t,p2[1]+(q2[1]-p2[1])*t,p2[2]+(q2[2]-p2[2])*t];best=Math.min(best,len(sub(a,b)));}}return best;};
 const r={};for(const s of ['left','right']){r[s+'Knee']=ang(J[s+'Hip'],J[s+'Knee'],J[s+'Ankle']);r[s+'Elbow']=ang(J[s+'Shoulder'],J[s+'Elbow'],J[s+'Wrist']);r[s+'PalmY']=J[s+'Palm'][1];r[s+'WristY']=J[s+'Wrist'][1];}
 r.legLeg=Math.min(segd(J.leftHip,J.leftKnee,J.rightHip,J.rightKnee),segd(J.leftKnee,J.leftAnkle,J.rightKnee,J.rightAnkle),segd(J.leftHip,J.leftKnee,J.rightKnee,J.rightAnkle),segd(J.leftKnee,J.leftAnkle,J.rightHip,J.rightKnee));
 let armLeg=9;for(const a of ['left','right'])for(const l of ['left','right'])for(const [p,q] of [[J[a+'Shoulder'],J[a+'Elbow']],[J[a+'Elbow'],J[a+'Wrist']]])for(const [m,n] of [[J[l+'Hip'],J[l+'Knee']],[J[l+'Knee'],J[l+'Ankle']]])armLeg=Math.min(armLeg,segd(p,q,m,n));
 r.armLeg=armLeg;r.pelvisY=J.pelvis[1];r.J=J;return r;})()`;

const {config}=await import(pathToFileURL(path.join(DA,'lib/config.mjs')).href);const C=config();
if(C.ld_library_path)process.env.LD_LIBRARY_PATH=C.ld_library_path+(process.env.LD_LIBRARY_PATH?':'+process.env.LD_LIBRARY_PATH:'');
let b,p;
if(mode==='new'){
  const {loadTheme}=await import(pathToFileURL(path.join(DA,'lib/config.mjs')).href);
  const theme=loadTheme();fs.writeFileSync(path.join(out,'theme.json'),JSON.stringify(theme));fs.writeFileSync(path.join(out,'spec.json'),JSON.stringify(spec));
  // stage.mjs: drill page + v41 adapter + crotch-smooth mannequin pelvis (default on since 2026-10-13; --no-crotch-smooth for the previous body)
  const {bootFlare}=await import('./stage.mjs');const crotch=!A.includes('--no-crotch-smooth');
  let info,crotchReport;({b,p,info,crotchReport}=await bootFlare({size:SZ,pr:PR,spec,crotch}));log('boot+install',JSON.stringify(info).slice(0,160));
  log('crotch-smooth',crotch?JSON.stringify(crotchReport).slice(0,300):'off');
  await p.evaluate(([s,SZ])=>{__setHighlight(s.highlight);__toonUni.uSinkK.value=1;__drill.setupCamera(s,SZ);},[spec,SZ]);
  for(let k=0;k<3;k++){await p.evaluate(([s,SZ])=>{__drill.frame(s,0,0,null,{size:SZ,full:false});return 1;},[spec,SZ]);await p.waitForTimeout(300);}
  const met=[];
  for(const f of [-1,...frames]){const t=f<0?0:f/FPS;
    const r=await p.evaluate(([s,t,f,o])=>__drill.frame(s,t,f,null,o),[spec,t,f,{full:true,size:SZ}]);
    const nm=f<0?'still':String(f).padStart(4,'0');
    fs.writeFileSync(`${out}/m-${nm}.png`,Buffer.from(r.main.split(',')[1],'base64'));fs.writeFileSync(`${out}/g-${nm}.png`,Buffer.from(r.glow.split(',')[1],'base64'));
    const rule=await p.evaluate(METRICS);
    const profile=await p.evaluate(()=>window.__trainingCollarReport?.profileId);const crotchFold=await p.evaluate(()=>__crotchFoldMetric());
    met.push({f,t,...r.M,rule,profile,crotchFold,crotchSmooth:crotch});if(f%30===0)log('frame',f);}
  fs.writeFileSync(`${out}/met-${frames[0]}-${frames[frames.length-1]}.json`,JSON.stringify(met));
}else{
  if(C.playwright_browsers_path)process.env.PLAYWRIGHT_BROWSERS_PATH=C.playwright_browsers_path;
  const {chromium}=await import(pathToFileURL(C.playwright_module).href);
  b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  p=await b.newPage({viewport:{width:SZ,height:SZ},deviceScaleFactor:PR});
  p.on('pageerror',e=>console.log('pageerror',e.message));
  await p.goto(C.app_url+'/?inspect');await p.waitForFunction(()=>document.documentElement.dataset.ready==='true',null,{timeout:170000});log('boot');
  await p.addStyleTag({content:`body *{visibility:hidden!important} canvas{visibility:visible!important} .msync-canvas{visibility:hidden!important}`});
  await p.evaluate(async ([s,SZ])=>{
    const src=await (await fetch('/src/viewer.js')).text(),ver=src.match(/three\.js\?v=(\w+)/)[1];
    const T=await import('/node_modules/.vite/deps/three.js?v='+ver);const {GLTFLoader}=await import(src.match(/\/node_modules\/\.vite\/deps\/three_addons_loaders_GLTFLoader__js\.js\?v=\w+/)[0]);
    const v=flareInspector.viewer;v.playing=false;v.motion.reset();
    v.movementGuide?.setVisible?.(false);v.trajectoryGuide?.setVisible?.(false);
    // SwiftShader draws the stage floor/shadow catcher with heavy banding; show the coach alone on the
    // app's graphite stage colour so only the body differs from the new render.
    v.scene.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh)o.visible=false;if(o.isLine||o.isPoints||o.isSprite)o.visible=false;});
    v.scene.background=new T.Color('#17181b');
    const g=await new GLTFLoader().loadAsync(s.bakedClipPath),model=g.scene,clip=g.animations.find(c=>c.name===s.bakedClipName);
    const mixer=new T.AnimationMixer(model),act=mixer.clipAction(clip);act.play();
    const src2=new Map(),dst=new Map();model.traverse(o=>{if(o.isBone)src2.set(o.name,o)});v.coach.traverse(o=>{if(o.isBone)dst.set(o.name,o)});
    const names=[...src2.keys()].filter(n=>dst.has(n));
    v.resize=()=>{};v.renderer.setSize(SZ,SZ);
    const c=s.camera,cam=new T.OrthographicCamera(-c.span/2,c.span/2,c.span/2,-c.span/2,.01,30);cam.position.fromArray(c.position);cam.lookAt(new T.Vector3(...c.target));cam.updateProjectionMatrix();
    v.camera=cam;if(v.controls){v.controls.object=cam;v.controls.target.fromArray(c.target);v.controls.enabled=false;}
    window.__oldPose=t=>{mixer.setTime(Math.min(((t%s.originalPeriodSeconds)+s.originalPeriodSeconds)%s.originalPeriodSeconds,clip.duration));model.updateMatrixWorld(true);
      for(const n of names){const a=src2.get(n),d=dst.get(n);d.matrixAutoUpdate=false;d.matrixWorldAutoUpdate=false;d.matrix.copy(d.parent.matrixWorld).invert().multiply(a.matrixWorld);d.matrix.decompose(d.position,d.quaternion,d.scale);d.matrixWorld.copy(a.matrixWorld);}
      v.coach.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update()});v.renderer.render(v.scene,cam);return names.length;};
    window.__oldPose(0);
  },[spec,SZ]);
  for(const f of frames){await p.evaluate(t=>__oldPose(t),f/FPS);await p.waitForTimeout(50);const data=await p.evaluate(t=>{__oldPose(t);return flareInspector.viewer.renderer.domElement.toDataURL('image/png');},f/FPS);
    fs.writeFileSync(`${out}/old-${String(f).padStart(4,'0')}.png`,Buffer.from(data.split(',')[1],'base64'));log('old frame',f);}
}
await b.close();log('done',frames.length);
