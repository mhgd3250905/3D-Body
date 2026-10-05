import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';
import {prepareWristStage,getWristCases,out,root} from './inspect-coach-wrist.mjs';

const stage=process.argv[2]||'after';
await prepareWristStage(stage);
const fixtures=await getWristCases();
const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const server=await createServer({root,configFile:false,cacheDir:'output/hand-natural/.vite',logLevel:'error',server:{host:'127.0.0.1',port:8878,strictPort:true,hmr:false}});
await server.listen();
const html=`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:18px;background:#202820;color:#edf0df;font:16px Arial,'Microsoft YaHei',sans-serif}h1{font-size:20px;margin:0 0 12px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{border:1px solid #667759;border-radius:6px;background:#293327;overflow:hidden}.card img{display:block;width:100%}.card p{margin:10px 12px 12px;font-size:14px}</style><h1>自然手掌与弯腕 · ${stage} · 同一组对照姿势</h1><div class="grid" id="grid"></div><script type="module">
import * as THREE from '/node_modules/three/build/three.module.js';
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {createCoachMotion} from '/src/coach-motion.js';
import {createFlareRig} from '/src/flare-rig.js';
const fixtures=${JSON.stringify(fixtures)};
const scene=new THREE.Scene();scene.background=new THREE.Color(0x293327);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(600,480);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const camera=new THREE.OrthographicCamera(-.22,.22,.176,-.176,.005,15);
scene.add(new THREE.HemisphereLight(0xfff1dc,0x59624f,2));const key=new THREE.DirectionalLight(0xffecd8,3);key.position.set(-3,4,4);scene.add(key);const fill=new THREE.DirectionalLight(0xdaedff,1.6);fill.position.set(3,1,-2);scene.add(fill);
const grid=new THREE.GridHelper(4,40,0x74816b,0x67755d);grid.position.y=-.02;grid.material.opacity=.18;grid.material.transparent=true;scene.add(grid);
const [{scene:model},rigData]=await Promise.all([new GLTFLoader().loadAsync('/output/hand-natural/${stage}.glb'),fetch('/output/hand-natural/${stage}-rig.json').then(r=>r.json())]);scene.add(model);
const motion=createCoachMotion({model,driver:createFlareRig(),rigData}),pictures=[],effectivePoses=[];
const point=a=>new THREE.Vector3().fromArray(a);
function render(title,id,target,direction,up,scale){camera.left=-scale/2;camera.right=scale/2;camera.top=scale*.8/2;camera.bottom=-camera.top;camera.updateProjectionMatrix();camera.position.copy(direction.clone().normalize().multiplyScalar(2).add(target));camera.up.copy(up);camera.lookAt(target);renderer.render(scene,camera);const src=renderer.domElement.toDataURL('image/png');pictures.push({title,id,src});const card=document.createElement('div');card.className='card';const img=document.createElement('img');img.src=src;const p=document.createElement('p');p.textContent=title;card.append(img,p);document.querySelector('#grid').append(card);}
for(const fixture of fixtures.cases){
 const effective=motion.applyPose(fixture.pose);effectivePoses.push({id:fixture.id,pose:effective});
 const sign=fixture.side==='left'?1:-1,q=new THREE.Quaternion().fromArray(fixture.pose.limbs[fixture.side].handQuaternion),wrist=point(effective.limbs[fixture.side].wrist);
 const finger=new THREE.Vector3(sign*.98253144,.05483374,.17783482).applyQuaternion(q).normalize(),normal=new THREE.Vector3(sign*.06068526,-.99777448,-.02762938).applyQuaternion(q).normalize();
 const width=finger.clone().cross(normal).normalize(),target=wrist.clone().addScaledVector(finger,.085).addScaledVector(normal,-.005);
 if(fixture.id.endsWith('raised')){
  render(fixture.title+' · 掌心',fixture.id+'-palm',target,normal,finger,.40);
  render(fixture.title+' · 斜侧',fixture.id+'-oblique',target,normal.clone().multiplyScalar(.65).addScaledVector(width,.75).addScaledVector(finger,-.2),finger,.40);
  render(fixture.title+' · 手背',fixture.id+'-back',target,normal.clone().negate(),finger,.40);
 }else{
  render(fixture.title+' · 侧面',fixture.id+'-side',target,width.clone().addScaledVector(normal,-.12),new THREE.Vector3(0,1,0),.38);
  if(fixture.id.endsWith('support90'))render(fixture.title+' · 斜侧',fixture.id+'-oblique',target,width.clone().multiplyScalar(.7).addScaledVector(normal,-.32).addScaledVector(finger,-.35),new THREE.Vector3(0,1,0),.38);
 }
}
window.wristReview={ready:true,pictures,effectivePoses};
</script>`;
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1800,height:1000},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/coach-wrist-review',route=>route.fulfill({contentType:'text/html',body:html}));
 await page.goto('http://127.0.0.1:8878/coach-wrist-review');
 await page.waitForFunction(()=>window.wristReview?.ready,{timeout:60000});
 if(errors.length)throw Error(errors.join('\n'));
 await page.screenshot({path:path.join(out,'web-'+stage+'.png'),fullPage:true});
 const {pictures,effectivePoses}=await page.evaluate(()=>window.wristReview);
 for(const picture of pictures)await fs.writeFile(path.join(out,stage+'-'+picture.id+'.png'),Buffer.from(picture.src.split(',')[1],'base64'));
 let maxReplayedPoseDifference=0;
 const compare=(a,b)=>{if(typeof a==='number'&&typeof b==='number')maxReplayedPoseDifference=Math.max(maxReplayedPoseDifference,Math.abs(a-b));else if(a&&b&&typeof a==='object'&&typeof b==='object')for(const key of Object.keys(a))compare(a[key],b[key]);};
 for(const replay of effectivePoses)compare(fixtures.cases.find(c=>c.id===replay.id).pose,replay.pose);
 const report={stage,images:pictures.length,errors,maxReplayedPoseDifference,fixturesSource:'Independent comparison fixtures, not user saved steps',montage:path.join(out,'web-'+stage+'.png')};
 await fs.writeFile(path.join(out,stage+'-render.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(stage==='after'){
  const comparison=[];
  for(const label of ['before','after'])for(const id of ['right-support90-side','right-raised-oblique']){
   const bytes=await fs.readFile(path.join(out,label+'-'+id+'.png'));
   comparison.push({label:label==='before'?'调整前':'调整后',view:id.includes('support')?'撑地手腕侧面':'抬手掌面斜侧',src:'data:image/png;base64,'+bytes.toString('base64')});
  }
  await page.setViewportSize({width:1280,height:1060});
  await page.setContent('<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:18px;background:#202820;color:#edf0df;font:16px Arial,"Microsoft YaHei",sans-serif}h1{font-size:20px;margin:0 0 14px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.card{border:1px solid #667759;border-radius:6px;overflow:hidden;background:#293327}.card p{margin:10px 12px;font-size:16px}.card img{display:block;width:100%}</style><h1>相同姿势与镜头 · 手腕和掌形调整</h1><div class="grid">'+comparison.map(c=>'<div class="card"><p>'+c.label+' · '+c.view+'</p><img src="'+c.src+'"></div>').join('')+'</div>');
  await page.screenshot({path:path.join(out,'comparison.png'),fullPage:true});
 }
}finally{await browser?.close();await server.close();}
