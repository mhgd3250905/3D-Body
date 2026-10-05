import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';

const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=fileURLToPath(new URL('../',import.meta.url)),label=process.argv[2]||'after',out=path.join(root,'output/buzzcut');
await fs.mkdir(out,{recursive:true});
const server=await createServer({root,configFile:false,cacheDir:'node_modules/.vite-appearance',logLevel:'error',server:{host:'127.0.0.1',port:8877,strictPort:true,hmr:false}});
await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const html=`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:20px;background:#1b231a;color:#e4eadb;font:16px Arial,'Microsoft YaHei',sans-serif}h1{font-size:20px;margin:0 0 14px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{border:1px solid #506141;background:#232d20;border-radius:8px;overflow:hidden}.card img{display:block;width:100%}.card h2{font-size:14px;margin:10px 12px 12px}</style><h1>人物造型 · 实际网页模型</h1><div class="grid" id="grid"></div><script type="module">
import * as THREE from '/node_modules/three/build/three.module.js';
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {createCoachMotion} from '/src/coach-motion.js';
import {createFlareRig} from '/src/flare-rig.js';
import {createFlarePosePresets} from '/src/pose-presets.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x232d20);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(600,600);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const camera=new THREE.OrthographicCamera(-.3,.3,.3,-.3,.005,15);
scene.add(new THREE.HemisphereLight(0xf4f1df,0x687158,2));const key=new THREE.DirectionalLight(0xffead2,3.3);key.position.set(-2.5,4,4);scene.add(key);const fill=new THREE.DirectionalLight(0xddeefa,1.4);fill.position.set(2,1,-3);scene.add(fill);
const [{scene:model},rigData]=await Promise.all([new GLTFLoader().loadAsync('/coach/flare-coach.glb'),fetch('/coach/coach-rig.json').then(r=>r.json())]);scene.add(model);
const motion=createCoachMotion({model,driver:createFlareRig(),rigData}),presets=createFlarePosePresets(motion),pictures=[];
const v=a=>new THREE.Vector3().fromArray(a);
function frame(title,target,direction,scale){camera.left=-scale/2;camera.right=scale/2;camera.top=scale/2;camera.bottom=-scale/2;camera.updateProjectionMatrix();camera.position.copy(direction.clone().normalize().multiplyScalar(3).add(target));camera.up.set(0,1,0);camera.lookAt(target);renderer.render(scene,camera);const src=renderer.domElement.toDataURL('image/png');pictures.push({title,src});const card=document.createElement('div');card.className='card';const img=document.createElement('img');img.src=src;card.append(img);const heading=document.createElement('h2');heading.textContent=title;card.append(heading);document.querySelector('#grid').append(card);}
motion.reset();let m=motion.getMetrics(),target=v(m.joints.head).add(new THREE.Vector3(0,.055,0));
frame('正面',target,new THREE.Vector3(0,.09,1),.56);
frame('侧面',target,new THREE.Vector3(1,.08,0),.56);
frame('后面',target,new THREE.Vector3(0,.12,-1),.56);
motion.applyPose(presets[2].pose);m=motion.getMetrics();const q=new THREE.Quaternion().fromArray(m.bodyQuaternion);
frame('托马斯 · 右手单撑',v(m.joints.pelvis).lerp(v(m.joints.head),.22),new THREE.Vector3(0,.42,1),2.4);
motion.applyPose(presets[6].pose);m=motion.getMetrics();frame('托马斯 · 左手单撑',v(m.joints.pelvis).lerp(v(m.joints.head),.22),new THREE.Vector3(0,.42,1),2.4);
motion.reset();m=motion.getMetrics();frame('日常站姿',v(m.joints.pelvis).add(new THREE.Vector3(0,.015,0)),new THREE.Vector3(.18,.10,1),2.05);
window.coachAppearance={ready:true,pictures};
</script>`;
try{
 const page=await browser.newPage({viewport:{width:1440,height:1200},deviceScaleFactor:1});const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/coach-appearance-review',route=>route.fulfill({contentType:'text/html',body:html}));await page.goto('http://127.0.0.1:8877/coach-appearance-review');await page.waitForFunction(()=>window.coachAppearance?.ready,{timeout:60000});
 if(errors.length)throw new Error(errors.join('\n'));await page.screenshot({path:path.join(out,'web-'+label+'.png'),fullPage:true});
 const {pictures}=await page.evaluate(()=>window.coachAppearance);
 for(let index=0;index<pictures.length;index++)await fs.writeFile(path.join(out,'web-'+label+'-'+(index+1)+'.png'),Buffer.from(pictures[index].src.split(',')[1],'base64'));
 const report={images:pictures.length,errors,montage:path.join(out,'web-'+label+'.png')};
 await fs.writeFile(path.join(out,'web-'+label+'-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();await server.close();}
