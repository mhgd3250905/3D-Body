// Offline source-accurate silhouette capture. No app UI or source files are changed.
// Example (Windows cache paths are supplied by the caller, not project dependencies):
// node app/tools/render-flare-loading.mjs --playwright-root E:/DevCaches/npm/_npx/9833c18b2d85bc59/node_modules/playwright --browser E:/DevCaches/playwright/chromium-1140/chrome-win/chrome.exe --preview
// Repeat without --preview, then python app/tools/encode-flare-loading.py.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const value = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const preview = args.includes('--preview');
const output = path.resolve(value('--output', path.join(root, 'output/flare-loading-20261011/three')));
if (!output.startsWith(root + path.sep)) throw new Error('Output must remain inside the project.');
fs.mkdirSync(output, { recursive: true });
const size = Number(value('--size', 384));
const fps = Number(value('--fps', 24));
const azimuth = Number(value('--azimuth', -30));
const elevation = Number(value('--elevation', 28));
const startPhase = Number(value('--start-phase', .25));
const source = path.resolve(value('--source', path.join(root, 'app/scene/source/coach/flare-coach-v41-animated.glb')));
if (!source.startsWith(root + path.sep)) throw new Error('Source must remain inside the project.');
const animation = value('--animation', 'flare_v41_loop');
const duration = Number(value('--duration', JSON.parse(fs.readFileSync(path.join(root, 'app/scene/src/v41-clock.json'), 'utf8')).frameTimes.at(-1)));
if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(fps) || fps <= 0) throw new Error('Duration and fps must be positive.');
const count = Math.round(duration * fps);
// Explicit new-version duration keeps the encoded loop synchronized; the legacy
// default retains its original rounded-frame playback time for reproduction.
const imageDuration = args.includes('--duration') ? duration : count / fps;
const config = { size, fps, azimuth, elevation, startPhase, duration, count, animation };

const html = `<!doctype html><meta charset="utf-8"><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const config = ${JSON.stringify(config)};
window.loadingCapture = (async () => {
 const gltf = await new GLTFLoader().loadAsync('/source.glb');
 const scene = new THREE.Scene(), model = gltf.scene;
 scene.add(model);
 const meshes = [];
 const white = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});
 model.traverse(mesh => { if(mesh.isMesh && mesh.visible) { meshes.push(mesh); mesh.material = white; mesh.frustumCulled = false; } });
 const mixer = new THREE.AnimationMixer(model);
 const clip = gltf.animations.find(clip=>clip.name===config.animation);
 if(!clip) throw new Error('Expected animation was not found: '+config.animation);
 if(Math.abs(clip.duration-config.duration)>.001) throw new Error('Requested duration differs from source clip duration.');
 mixer.clipAction(clip).play();
 const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(2);
 renderer.setSize(config.size,config.size,false);
 renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace = THREE.SRGBColorSpace;
 renderer.toneMapping = THREE.NoToneMapping;
 document.body.append(renderer.domElement);
 const camera = new THREE.OrthographicCamera(-1,1,1,-1,.01,30);
 const poses = index => {
   mixer.setTime(((index / config.count + config.startPhase) % 1) * config.duration);
   model.updateMatrixWorld(true);
   for(const mesh of meshes) if(mesh.isSkinnedMesh) mesh.skeleton.update();
 };
 const angles = [-30,0,30,60];
 if(!angles.includes(config.azimuth)) angles.push(config.azimuth);
 const views = angles.map(angle => {
   const a=THREE.MathUtils.degToRad(angle), e=THREE.MathUtils.degToRad(config.elevation);
   const view=new THREE.Vector3(Math.sin(a)*Math.cos(e),Math.sin(e),Math.cos(a)*Math.cos(e));
   const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),view).normalize();
   const up=new THREE.Vector3().crossVectors(view,right).normalize();
   return {angle,view,right,up,minX:Infinity,minY:Infinity,minZ:Infinity,maxX:-Infinity,maxY:-Infinity,maxZ:-Infinity};
 });
 const point = new THREE.Vector3();
 for(let frame=0;frame<config.count;frame++) {
   poses(frame);
   for(const mesh of meshes) {
     for(let i=0;i<mesh.geometry.attributes.position.count;i++) {
       mesh.getVertexPosition(i,point).applyMatrix4(mesh.matrixWorld);
       for(const v of views) {
         const x=point.dot(v.right),y=point.dot(v.up),z=point.dot(v.view);
         v.minX=Math.min(v.minX,x);v.maxX=Math.max(v.maxX,x);
         v.minY=Math.min(v.minY,y);v.maxY=Math.max(v.maxY,y);
         v.minZ=Math.min(v.minZ,z);v.maxZ=Math.max(v.maxZ,z);
       }
     }
   }
 }
 const fit = angle => {
   const v=views.find(v=>v.angle===angle);
   if(!v) throw new Error('Unmeasured camera angle');
   const target=new THREE.Vector3().addScaledVector(v.right,(v.minX+v.maxX)/2).addScaledVector(v.up,(v.minY+v.maxY)/2).addScaledVector(v.view,(v.minZ+v.maxZ)/2);
   const span=Math.max(v.maxX-v.minX,v.maxY-v.minY)/.80;
   camera.position.copy(target).addScaledVector(v.view,6);
   camera.left=camera.bottom=-span/2;camera.right=camera.top=span/2;
   camera.lookAt(target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
   return {azimuthDegrees:angle,elevationDegrees:config.elevation,position:camera.position.toArray(),target:target.toArray(),orthographicSpan:span,cycleOccupancy:.80};
 };
 return {
   info:{threeRevision:THREE.REVISION,clipName:clip.name,clipDuration:clip.duration,meshCount:meshes.length,vertexCount:meshes.reduce((n,m)=>n+m.geometry.attributes.position.count,0),renderer:renderer.getContext().getParameter(renderer.getContext().RENDERER)},
   capture:(index,angle) => { const settings=fit(angle);poses(index);renderer.render(scene,camera);return {png:renderer.domElement.toDataURL('image/png').split(',')[1],camera:settings}; },
   dispose:()=>{white.dispose();renderer.dispose();},
 };
})();
</script>`;

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
  if(pathname === '/') { res.setHeader('Content-Type','text/html');res.end(html);return; }
  let file;
  if(pathname === '/source.glb') file=source;
  else if(pathname.startsWith('/three/')) {
    const relative=decodeURIComponent(pathname.slice(7));
    const base=path.join(root,'app/scene/node_modules/three');
    file=path.resolve(base,relative);
    if(!file.startsWith(base+path.sep)) {res.writeHead(403).end();return;}
  } else {res.writeHead(404).end();return;}
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'model/gltf-binary');
  fs.createReadStream(file).pipe(res);
});
const playwrightRoot = value('--playwright-root', process.env.FLARE_PLAYWRIGHT_ROOT);
const { chromium } = playwrightRoot ? await import(pathToFileURL(path.join(playwrightRoot,'index.mjs')).href) : await import('playwright');
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,executablePath:value('--browser',process.env.FLARE_CHROMIUM_BINARY),args:['--use-angle=gl','--ignore-gpu-blocklist']});
  const page=await browser.newPage({viewport:{width:size,height:size}});
  page.on('pageerror',error=>console.error(error));
  await page.goto('http://127.0.0.1:'+server.address().port);
  console.log('Preparing source AnimationMixer and measuring complete-cycle bounds...');
  const info=await page.evaluate(async()=>{window.capture=await window.loadingCapture;return window.capture.info;});
  console.log(JSON.stringify(info));
  const render=async(index,angle,directory)=>{
    const frame=await page.evaluate(({index,angle})=>window.capture.capture(index,angle),{index,angle});
    fs.writeFileSync(path.join(directory,preview?'angle-'+angle+'_frame-'+String(index).padStart(3,'0')+'.png':'frame-'+String(index).padStart(3,'0')+'.png'),Buffer.from(frame.png,'base64'));
    return frame.camera;
  };
  let camera;
  if(preview){
    const directory=path.join(output,'angle-preview');fs.mkdirSync(directory,{recursive:true});
    for(const angle of [-30,0,30,60]) for(const index of [0,count/4,count/2,count*3/4]) await render(Math.floor(index),angle,directory);
  } else {
    const directory=path.join(output,'frames');fs.mkdirSync(directory,{recursive:true});
    for(let index=0;index<count;index++){
      camera=await render(index,azimuth,directory);
      if(index%24===0)console.log('Captured '+index+'/'+count);
    }
    const metadata={source:path.relative(root,source).replaceAll('\\','/'),sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),animation,sourceDurationSeconds:duration,startPhase,renderedFrameCount:count,nominalFps:fps,imageDurationSeconds:imageDuration,width:size,height:size,captureWidth:size*2,captureHeight:size*2,color:'white silhouette; transparent background; runtime tint',renderer:info,camera,attribution:'Snow Rig © Blender Foundation | studio.blender.org, CC BY 4.0; existing project animation',sourceLicense:'https://creativecommons.org/licenses/by/4.0/',changes:'Offline silhouette capture only, using the original AnimationMixer clip with a cyclic start offset. Source GLB, rig and animation unchanged.'};
    fs.writeFileSync(path.join(output,'render-metadata.json'),JSON.stringify(metadata,null,2)+'\n');
  }
  await page.evaluate(()=>window.capture.dispose());
  console.log('Capture complete: '+output);
} finally {
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
