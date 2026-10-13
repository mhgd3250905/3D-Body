// Export the training-human-v2 body (faceless grey mannequin head + collar/shoulder skin fix,
// Snow-derived mesh and the SAME 22-bone rig) together with the baked Flare v41 clip as an
// App-ready GLB: a drop-in candidate for app/scene's flare-coach-v41-animated GLB.
// The drill toon shader is not portable, so its per-vertex garment weights are baked into
// COLOR_0 with the drill theme colours on a matte MeshStandardMaterial.
// node tools/flare-body-swap/export-glb.mjs <out.glb> [--no-crotch-smooth]
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url)),REPO=path.resolve(HERE,'../..'),DA=path.join(REPO,'tools/drill-anim');
const out=path.resolve(process.argv.slice(2).find(a=>!a.startsWith('--'))||'flare-coach-v41-training-human-animated.glb');
const spec=JSON.parse(fs.readFileSync(path.join(DA,'batches/training-human-v2-20261013/specs/flare-v41-loop.json'),'utf8'));
const {config,loadTheme}=await import(pathToFileURL(path.join(DA,'lib/config.mjs')).href);const C=config();
if(C.ld_library_path)process.env.LD_LIBRARY_PATH=C.ld_library_path;
const {boot}=await import(pathToFileURL(path.join(DA,'lib/boot.mjs')).href);
const theme=loadTheme();const {b,p}=await boot({size:512,pr:1,theme,bakeHands:[]});
// crotch-smooth mannequin pelvis (2026-10-13): shorts crotch weights diffused + front panel flattened + folds smoothed.
// Mesh-only; bones, rest TRS and the v41 clip are untouched. --no-crotch-smooth exports the previous body.
let crotchReport=null;
if(!process.argv.includes('--no-crotch-smooth')){await p.addScriptTag({content:fs.readFileSync(path.join(HERE,'crotch-smooth.js'),'utf8')});crotchReport=await p.evaluate(()=>__applyCrotchSmooth());}
const res=await p.evaluate(async ([s,th])=>{
  const src=await (await fetch('/src/viewer.js')).text(),ver=src.match(/three\.js\?v=(\w+)/)[1];
  const T=await import('/node_modules/.vite/deps/three.js?v='+ver);
  const {GLTFLoader}=await import(src.match(/\/node_modules\/\.vite\/deps\/three_addons_loaders_GLTFLoader__js\.js\?v=\w+/)[0]);
  // three's raw example module keeps a bare 'three' import here: point it at the app's own Three build.
  const ex=(await (await fetch('/node_modules/three/examples/jsm/exporters/GLTFExporter.js')).text()).replace(/from 'three'/g,`from '${location.origin}/node_modules/.vite/deps/three.js?v=${ver}'`);
  const {GLTFExporter}=await import(URL.createObjectURL(new Blob([ex],{type:'text/javascript'})));
  const v=flareInspector.viewer;v.playing=false;v.motion.reset();
  __drill.selectModelProfile(s);                       // training-human-v2 collar/shoulder weights on
  v.coach.updateMatrixWorld(true);
  const col=k=>new T.Color(th[k].base);const BASE=[col('skin'),col('top'),col('bottom'),col('shoes')];
  const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x);};
  const hcut=side=>{const F=v.coach.getObjectByName(side+'Forearm').getWorldPosition(new T.Vector3()),H=v.coach.getObjectByName(side+'Hand').getWorldPosition(new T.Vector3());return [H,H.clone().sub(F).normalize()];};
  const HL=hcut('left'),HR=hcut('right');
  const report=[];const keep=[];
  v.coach.traverse(o=>{if(!o.isSkinnedMesh)return;let vis=o.visible;for(let a=o.parent;a;a=a.parent)if(!a.visible)vis=false;if(!vis)return;keep.push(o);});
  for(const o of keep){
    // pull the toon material's per-vertex garment texture out of its compile hook
    const sh={uniforms:{},vertexShader:'',fragmentShader:''};try{o.material.onBeforeCompile(sh);}catch(e){}
    const vt=sh.uniforms.uVT?.value?.image?.data,vr=sh.uniforms.uVR?.value?.image?.data;
    const g=o.geometry,n=g.attributes.position.count,c=new Float32Array(n*3);
    const isBody=o.name==='Coach_Body',isSkin=o.name==='Mesh001',isHead=/Mannequin_Head/.test(o.name);
    for(let i=0;i<n;i++){
      let W=[1,0,0,0];
      if(vt&&!isHead){const r=Math.max(vt[i*4],0),gg=Math.max(vt[i*4+1],0),bb=Math.max(vt[i*4+2],0);W=[r,gg,bb,Math.max(0,1-r-gg-bb)];}
      const rx=vr?vr[i*4]:0,ry=vr?vr[i*4+1]:9,rz=vr?vr[i*4+2]:0;
      if(isBody&&vr){const arm=vt[i*4+3]>0.5;const L=rx>0;const [Hp,Ha]=L?HL:HR;
        const cut=(0.17-ry>0)||(arm&&((rx-Hp.x)*Ha.x+(ry-Hp.y)*Ha.y+(rz-Hp.z)*Ha.z-0.001>0));if(cut)W=[1,0,0,0];}
      if(isSkin&&vr){const hx=rx,hz=rz-0.006,rr=Math.hypot(hx,hz),fz=Math.max(0,hz/Math.max(rr,1e-4));
        const fy=ry-(1.452-0.030*fz*fz-0.006*Math.max(0,-hz/Math.max(rr,1e-4)));const f=Math.max(Math.min(fy,0.5*(0.125-rr)),ry-1.47);W=f>0?[1,0,0,0]:[0,1,0,0];}
      const cv=new T.Color(0,0,0);for(let k=0;k<4;k++)if(W[k]>0)cv.add(BASE[k].clone().multiplyScalar(W[k]));
      if(isHead&&vt){const cav=Math.max(-vt[i*4+1],0);cv.multiplyScalar(1-cav);}
      c.set([cv.r,cv.g,cv.b],i*3);}
    // keep only standard attributes (toon helpers would export as custom _ATTRIBUTES)
    for(const k of Object.keys(g.attributes))if(!['position','normal','uv','skinIndex','skinWeight'].includes(k))g.deleteAttribute(k);
    g.setAttribute('color',new T.BufferAttribute(c,3));
    o.material=new T.MeshStandardMaterial({vertexColors:true,roughness:0.78,metalness:0,name:isHead?'TrainingHuman_Head':'TrainingHuman_'+o.name});
    report.push({mesh:o.name,verts:n,garmentTexture:!!vt});
  }
  // drop hidden face parts and any non-skinned helpers (lines, guides) from the export
  const drop=[];v.coach.traverse(o=>{if((o.isMesh&&!keep.includes(o))||o.isLine||o.isPoints||o.isSprite)drop.push(o);});for(const o of drop)o.parent.remove(o);
  const gl=await new GLTFLoader().loadAsync(s.bakedClipPath);const clip=gl.animations.find(a=>a.name===s.bakedClipName);
  // Export the bones in the baked GLB's own rest (T-pose bind) TRS, not the web viewer's
  // standing pose, so the App's rig landmarks (coach-v41-rig.json) map exactly as before.
  const restSrc=new Map();gl.scene.traverse(o=>{if(o.isBone)restSrc.set(o.name,o);});
  let bones=0;v.coach.traverse(o=>{if(!o.isBone)return;bones++;const r=restSrc.get(o.name);if(!r)throw new Error('bone missing in baked GLB: '+o.name);
    o.matrixAutoUpdate=true;o.matrixWorldAutoUpdate=true;o.position.copy(r.position);o.quaternion.copy(r.quaternion);o.scale.copy(r.scale);});
  v.coach.updateMatrixWorld(true);
  const glb=await new GLTFExporter().parseAsync(v.coach,{binary:true,animations:[clip],onlyVisible:true});
  const u8=new Uint8Array(glb);let bin='';for(let i=0;i<u8.length;i+=0x8000)bin+=String.fromCharCode(...u8.subarray(i,i+0x8000));
  return {b64:btoa(bin),report,bones,tracks:clip.tracks.length,dropped:drop.map(o=>o.name)};
},[spec,theme]);
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,Buffer.from(res.b64,'base64'));
delete res.b64;res.crotchSmooth=crotchReport&&{...crotchReport,params:undefined};console.log(JSON.stringify(res,null,1));console.log('wrote',out,fs.statSync(out).size);
await b.close();
