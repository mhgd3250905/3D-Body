import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';

const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=fileURLToPath(new URL('../',import.meta.url)),label=process.argv[2]||'after',out=path.join(root,'output/mesh-repair');
await fs.mkdir(out,{recursive:true});
// Reapply the captured pre-repair poses so the after view checks existing
// saved coordinates, rather than comparing newly generated templates.
const baseline=label==='after'?JSON.parse(await fs.readFile(path.join(out,'web-before-poses.json'),'utf8')):[];
const server=await createServer({root,configFile:false,cacheDir:'node_modules/.vite-mesh-repair',logLevel:'error',server:{host:'127.0.0.1',port:8876,strictPort:true,hmr:false}});
await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const html=`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#1b231a;color:#e4eadb;font:16px Arial,'Microsoft YaHei',sans-serif}h1{font-size:22px;margin:0 0 16px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{border:1px solid #506141;background:#232d20;border-radius:8px;overflow:hidden}.card img{display:block;width:100%}.card h2{font-size:14px;margin:12px 14px 16px}</style><h1>真实模型 · 裤裆、脚踝、手腕变形检查</h1><div class="grid" id="grid"></div><script type="module">
import * as THREE from '/node_modules/three/build/three.module.js';
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {createCoachMotion} from '/src/coach-motion.js';
import {createFlareRig} from '/src/flare-rig.js';
import {createFlarePosePresets} from '/src/pose-presets.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x232d20);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(640,540);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const camera=new THREE.OrthographicCamera(-.3,.3,.253,-.253,.005,15);
scene.add(new THREE.HemisphereLight(0xf4f1df,0x687158,2));const key=new THREE.DirectionalLight(0xffead2,3.3);key.position.set(-2.5,4,4);scene.add(key);const fill=new THREE.DirectionalLight(0xddeefa,1.4);fill.position.set(2,-1,-3);scene.add(fill);
const grid=new THREE.GridHelper(4,40,0x789763,0x657857);grid.position.y=-.013;grid.material.transparent=true;grid.material.opacity=.15;scene.add(grid);
const [{scene:model},rigData]=await Promise.all([new GLTFLoader().loadAsync('/coach/flare-coach.glb'),fetch('/coach/coach-rig.json').then(r=>r.json())]);scene.add(model);
const motion=createCoachMotion({model,driver:createFlareRig(),rigData}),presets=createFlarePosePresets(motion),pictures=[],poses=[];
const baseline=${JSON.stringify(baseline)};
function applyPose(index,pose){motion.applyPose(baseline[index]?.pose??pose);}
const v=a=>new THREE.Vector3().fromArray(a);
function frame(title,target,direction,scale){camera.left=-scale/2;camera.right=scale/2;camera.top=scale*540/640/2;camera.bottom=-camera.top;camera.updateProjectionMatrix();camera.position.copy(direction.clone().normalize().multiplyScalar(2).add(target));camera.up.set(0,1,0);camera.lookAt(target);renderer.render(scene,camera);const src=renderer.domElement.toDataURL('image/png');pictures.push({title,src});const card=document.createElement('div');card.className='card';const img=document.createElement('img');img.src=src;card.append(img);const heading=document.createElement('h2');heading.textContent=title;card.append(heading);document.querySelector('#grid').append(card);poses.push({title,pose:motion.capturePose()});}
applyPose(0,presets[0].pose);let m=motion.getMetrics(),q=new THREE.Quaternion().fromArray(m.bodyQuaternion),y=new THREE.Vector3(0,1,0).applyQuaternion(q),front=new THREE.Vector3(0,0,1).applyQuaternion(q);
frame('前双撑开腿 · 裤裆底面',v(m.joints.pelvis).addScaledVector(y,-.09),y.clone().negate().addScaledVector(front,-.15),.56);
motion.reset();if(baseline[1])applyPose(1,baseline[1].pose);m=motion.getMetrics();frame('站姿 · 鞋口与脚踝',v(m.joints.leftAnkle).add(new THREE.Vector3(0,.07,.025)),new THREE.Vector3(1,.24,1.5),.48);
applyPose(2,presets[2].pose);m=motion.getMetrics();frame('右手单撑 · 手腕衔接',v(m.joints.rightWrist).lerp(v(m.joints.rightPalm),.45).add(new THREE.Vector3(0,.025,0)),new THREE.Vector3(.4,.15,1),.42);
applyPose(3,presets[4].pose);m=motion.getMetrics();q.fromArray(m.bodyQuaternion);y.set(0,1,0).applyQuaternion(q);front.set(0,0,1).applyQuaternion(q);frame('后双撑开腿 · 裤裆底面',v(m.joints.pelvis).addScaledVector(y,-.09),y.clone().negate().addScaledVector(front,-.25),.56);
motion.applyPose(presets[2].pose);const pose=motion.capturePose();const ankleQ=new THREE.Quaternion().fromArray(pose.limbs.left.footQuaternion);ankleQ.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),THREE.MathUtils.degToRad(25)));pose.limbs.left.footQuaternion=ankleQ.toArray();applyPose(4,pose);m=motion.getMetrics();q.fromArray(motion.capturePose().limbs.left.footQuaternion);const footUp=new THREE.Vector3(0,1,0).applyQuaternion(q),footFront=new THREE.Vector3(0,0,1).applyQuaternion(q);frame('脚踝旋转 +25° · 鞋口衔接',v(m.joints.leftAnkle).addScaledVector(footUp,.06),footUp.clone().multiplyScalar(.45).addScaledVector(footFront,1).add(new THREE.Vector3(.45,0,0)),.48);
applyPose(5,presets[6].pose);m=motion.getMetrics();frame('左手单撑 · 手腕衔接',v(m.joints.leftWrist).lerp(v(m.joints.leftPalm),.45).add(new THREE.Vector3(0,.025,0)),new THREE.Vector3(-.4,.15,1),.42);
window.meshRepairPreview={ready:true,pictures,poses};
</script>`;
try{
 const page=await browser.newPage({viewport:{width:1800,height:1120},deviceScaleFactor:1});const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/mesh-repair-review',route=>route.fulfill({contentType:'text/html',body:html}));await page.goto('http://127.0.0.1:8876/mesh-repair-review');await page.waitForFunction(()=>window.meshRepairPreview?.ready,{timeout:60000});
 if(errors.length)throw new Error(errors.join('\n'));await page.screenshot({path:path.join(out,'web-'+label+'.png'),fullPage:true});
 const {pictures,poses}=await page.evaluate(()=>window.meshRepairPreview);
 let maximumReplayedPoseChange=0;
 function compare(a,b){if(typeof a==='number'&&typeof b==='number')maximumReplayedPoseChange=Math.max(maximumReplayedPoseChange,Math.abs(a-b));else if(a&&b&&typeof a==='object'&&typeof b==='object')for(const key of Object.keys(a))compare(a[key],b[key]);}
 for(let index=0;index<baseline.length;index++)compare(baseline[index].pose,poses[index].pose);
 if(maximumReplayedPoseChange>1e-5)throw new Error('Existing captured poses changed by '+maximumReplayedPoseChange);
 for(let index=0;index<pictures.length;index++)await fs.writeFile(path.join(out,'web-'+label+'-'+(index+1)+'.png'),Buffer.from(pictures[index].src.split(',')[1],'base64'));
 await fs.writeFile(path.join(out,'web-'+label+'-poses.json'),JSON.stringify(poses,null,2));
 const report={images:pictures.length,errors,existingPosesReplayed:baseline.length,maximumReplayedPoseChange,montage:path.join(out,'web-'+label+'.png')};
 await fs.writeFile(path.join(out,'web-'+label+'-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();await server.close();}
