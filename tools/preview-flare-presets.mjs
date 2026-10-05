import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/playwright');
await fs.mkdir(output, { recursive: true });
const server = await createServer({ root, configFile: false, cacheDir: 'node_modules/.vite-presets-preview', logLevel: 'error', server: { host: '127.0.0.1', port: 8874, strictPort: true, hmr: false } });
await server.listen();
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const html = `<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><style>
*{box-sizing:border-box}body{margin:0;background:#1b231a;color:#e4eadb;font-family:Arial,'Microsoft YaHei',sans-serif;padding:28px}h1{font-size:30px;margin:0 0 8px}p{color:#b6c4ab;margin:0 0 24px;font-size:17px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.card{border:1px solid #3c4933;background:#232d20;border-radius:12px;overflow:hidden}.card img{width:100%;display:block}.card h2{font-size:18px;line-height:1.4;margin:14px 18px 4px}.card p{font-size:13px;line-height:1.6;margin:0 18px 16px}.featured{border-color:#bad18d}#detail{margin-top:24px;display:none}#detail img{width:1080px;max-width:100%}
</style><h1>托马斯全旋 · 八个可编辑关键姿势</h1><p>第 3 / 7 步按用户高 V 侧撑参考摆姿；左右指人物本人。</p><div class="grid" id="grid"></div><div id="detail"></div><script type="module">
import * as THREE from '/node_modules/three/build/three.module.js';
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {createCoachMotion} from '/src/coach-motion.js';
import {createFlareRig} from '/src/flare-rig.js';
import {createFlarePosePresets} from '/src/pose-presets.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x232d20);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1080,760);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const camera=new THREE.PerspectiveCamera(34,1080/760,.02,30);camera.position.set(2.4,1.25,3.6);camera.lookAt(0,.54,0);
scene.add(new THREE.HemisphereLight(0xf4f1df,0x566247,2));const key=new THREE.DirectionalLight(0xffead2,3.7);key.position.set(-2.5,4,4);scene.add(key);const rim=new THREE.DirectionalLight(0xd9f8ba,2);rim.position.set(2,2,-3);scene.add(rim);const fill=new THREE.DirectionalLight(0xcdd9f0,.8);fill.position.set(4,.7,2);scene.add(fill);
const grid=new THREE.GridHelper(4,40,0x789763,0x657857);grid.position.y=-.013;grid.material.transparent=true;grid.material.opacity=.18;scene.add(grid);
const [{scene:model},rigData]=await Promise.all([new GLTFLoader().loadAsync('/coach/flare-coach.glb'),fetch('/coach/coach-rig.json').then(r=>r.json())]);scene.add(model);
const motion=createCoachMotion({model,driver:createFlareRig(),rigData});const presets=createFlarePosePresets(motion);const pictures=[];
for(let i=0;i<presets.length;i++){const p=presets[i];motion.applyPose(p.pose);const target=new THREE.Vector3(0,.56,0);camera.position.copy(new THREE.Vector3().fromArray(p.viewDirection).normalize().multiplyScalar(3.8).add(target));camera.lookAt(target);renderer.render(scene,camera);const url=renderer.domElement.toDataURL('image/png');pictures.push(url);const card=document.createElement('article');card.className='card'+(i===2||i===6?' featured':'');const img=document.createElement('img');img.src=url;card.append(img);const title=document.createElement('h2');title.textContent=String(i+1).padStart(2,'0')+' '+p.name;card.append(title);const text=document.createElement('p');text.textContent=p.summary;card.append(text);document.querySelector('#grid').append(card);}
const detail=document.querySelector('#detail');detail.innerHTML='<h2>右手单撑 · 高 V 开腿</h2><img src="'+pictures[2]+'"/>';window.presetPreview={ready:true,images:pictures.length};
</script></html>`;
try {
  const page = await browser.newPage({ viewport: { width: 2240, height: 1260 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/flare-preset-review', route => route.fulfill({ contentType: 'text/html', body: html }));
  await page.goto('http://127.0.0.1:8874/flare-preset-review');
  await page.waitForFunction(() => window.presetPreview?.ready, { timeout: 60000 });
  if (errors.length) throw new Error(errors.join('\n'));
  await page.screenshot({ path: path.join(output, 'flare-presets-eight.png'), fullPage: true });
  await page.evaluate(() => { document.querySelector('#grid').style.display = 'none'; document.querySelector('#detail').style.display = 'block'; });
  await page.locator('#detail').screenshot({ path: path.join(output, 'flare-preset-right-high-v.png') });
  console.log(JSON.stringify({ images: 8, errors, montage: path.join(output, 'flare-presets-eight.png'), reference: path.join(output, 'flare-preset-right-high-v.png') }, null, 2));
} finally { await browser.close(); await server.close(); }
