// Shared boot for the Flare v41 training-human renders: drill-anim page + v41 baked-clip adapter,
// optionally with the crotch-smooth mannequin pelvis (crotch-smooth.js) applied to the mesh.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
import {DA,loadConfig,provideFlareInputs} from './pose-hub.mjs';
export {REPO,DA,loadSpec} from './pose-hub.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
export async function bootFlare({size=720,pr=1,spec,crotch=true,crotchOpts={}}){
  const {loadTheme,C}=await loadConfig();
  if(C.ld_library_path)process.env.LD_LIBRARY_PATH=C.ld_library_path+(process.env.LD_LIBRARY_PATH?':'+process.env.LD_LIBRARY_PATH:'');
  const {boot}=await import(pathToFileURL(path.join(DA,'lib/boot.mjs')).href);const theme=loadTheme();
  const {b,p}=await boot({size,pr,theme,bakeHands:[]});
  await provideFlareInputs(p,spec);
  await p.evaluate(async()=>{window.__gltfURL=(await (await fetch('/src/viewer.js')).text()).match(/\/node_modules\/\.vite\/deps\/three_addons_loaders_GLTFLoader__js\.js\?v=\w+/)[0];});
  await p.addScriptTag({content:fs.readFileSync(path.join(DA,'page/flare-v41-demo-adapter.js'),'utf8').replace("import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js')","import(window.__gltfURL)")});
  const info=await p.evaluate(s=>__installFlareV41Demo(s),spec);
  let crotchReport=null;
  await p.addScriptTag({content:fs.readFileSync(path.join(HERE,'crotch-smooth.js'),'utf8')});
  // fold metric baseline at the rest pose (before any smoothing so both modes share one reference)
  await p.evaluate(()=>{const v=flareInspector.viewer;v.motion.reset();v.coach.updateMatrixWorld(true);return __crotchFoldMetric();});
  if(crotch){crotchReport=await p.evaluate(o=>__applyCrotchSmooth(o),crotchOpts);
    await p.evaluate(()=>{const v=flareInspector.viewer;v.motion.reset();v.coach.updateMatrixWorld(true);return __crotchFoldMetric();});}
  return {b,p,theme,info,crotchReport};
}
