// Render the BAKED glb (not the runtime) in a neutral three.js viewer to PNG frames,
// using only GLTFLoader + AnimationMixer — the proof that the clip plays on its own.
// usage: node tools/bake/render-preview.mjs --glb <file.glb> --dir <frames dir> [--fps 30] [--from 0] [--to N] [--size 720]
// then:  ffmpeg -framerate 30 -i <dir>/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 23 preview.mp4
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const arg = (name, fallback) => { const i = process.argv.indexOf('--' + name); return i >= 0 ? process.argv[i + 1] : fallback; };
const root = path.resolve(new URL('../..', import.meta.url).pathname);
const VER = arg('ver', process.env.BAKE_VER || 'v41');
const glb = path.resolve(arg('glb', path.join(root, `tools/bake/out/flare-coach-${VER}-animated.glb`)));
const dir = path.resolve(arg('dir', path.join(root, 'tools/bake/out/frames')));
const fps = Number(arg('fps', 30)), size = Number(arg('size', 720));
fs.mkdirSync(dir, { recursive: true });
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#e9ebee;overflow:hidden;font:14px system-ui,sans-serif}
#l{position:fixed;left:14px;top:12px;color:#444}#t{position:fixed;right:14px;top:12px;color:#444;font-variant-numeric:tabular-nums}</style>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script></head><body>
<div id="l">flare-coach-${VER}-animated.glb · AnimationMixer · clip flare_${VER}_loop</div><div id="t"></div>
<script type="module">
import * as THREE from 'three';import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const S=${size};const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(S,S);renderer.setPixelRatio(1);document.body.appendChild(renderer.domElement);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene();scene.background=new THREE.Color('#e9ebee');const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(),0.04).texture;
const sun=new THREE.DirectionalLight('#ffffff',1.6);sun.position.set(2,4,3);scene.add(sun);scene.add(new THREE.HemisphereLight('#ffffff','#9aa0a6',0.6));
const floor=new THREE.Mesh(new THREE.CircleGeometry(2.2,64),new THREE.MeshStandardMaterial({color:'#d6d9dd',roughness:1}));floor.rotation.x=-Math.PI/2;scene.add(floor);
const grid=new THREE.GridHelper(4,20,'#b9bdc2','#c9ccd0');grid.position.y=0.001;scene.add(grid);
const camera=new THREE.PerspectiveCamera(34,1,0.05,50);camera.position.set(3.0,1.55,3.9);camera.lookAt(0,0.68,0);
const gltf=await new GLTFLoader().loadAsync('/model.glb');scene.add(gltf.scene);
const clip=gltf.animations.find(a=>a.name===`flare_${VER}_loop`);const mixer=new THREE.AnimationMixer(gltf.scene);mixer.clipAction(clip).play();
window.duration=clip.duration;window.go=t=>{mixer.setTime(t);document.getElementById('t').textContent=t.toFixed(2)+' / '+clip.duration.toFixed(2)+' s  (1×)';renderer.render(scene,camera);};
window.go(0);document.documentElement.dataset.ready='1';
</script></body></html>`;
const server = http.createServer((q, s) => {
  const u = decodeURIComponent(new URL(q.url, 'http://x').pathname);
  if (u === '/') { s.writeHead(200, { 'Content-Type': 'text/html' }); s.end(html); return; }
  const f = u === '/model.glb' ? glb : u.startsWith('/three/') ? path.join(root, 'node_modules', u.slice(1)) : null;
  if (!f || !fs.existsSync(f)) { s.writeHead(404); s.end(); return; }
  s.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); fs.createReadStream(f).pipe(s);
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: size, height: size } });
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(`http://127.0.0.1:${server.address().port}/`);
await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 120000 });
const duration = await page.evaluate(() => window.duration), total = Math.round(duration * fps);
const from = Number(arg('from', 0)), to = Math.min(total, Number(arg('to', total)));
for (let i = from; i < to; i++) {
  const file = path.join(dir, `f${String(i).padStart(4, '0')}.png`); if (fs.existsSync(file)) continue;
  await page.evaluate(t => window.go(t), i * duration / total);
  await page.screenshot({ path: file });
}
console.log(`frames ${from}-${to} of ${total} (duration ${duration.toFixed(4)} s)`, errs.length ? errs : '');
await browser.close(); server.close();
