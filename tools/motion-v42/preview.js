import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const root = new URL('../../', import.meta.url);
const asset = name => new URL(name, root).href;
const output = 'output/flare-v42-20261015/';
const status = document.querySelector('#status'), play = document.querySelector('#play');
const slider = document.querySelector('#phase'), pct = document.querySelector('#pct');
const state = { ready: false, playing: false, phase: .25, duration: 2.7, body: 'training', frames: 0 };
const panels = [];
const loader = new GLTFLoader();
let syncing = false;
for (const id of ['old', 'new']) {
  const element = document.getElementById(id), scene = new THREE.Scene();
  scene.background = new THREE.Color('#fafcfb');
  const camera = new THREE.PerspectiveCamera(34, 1, .01, 50);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15; renderer.outputColorSpace = THREE.SRGBColorSpace;
  element.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight('#ffffff', '#819b93', 2.4));
  const key = new THREE.DirectionalLight('#fff5e7', 3.2); key.position.set(2.5, 5, 3);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -2.2, right: 2.2, top: 2.2, bottom: -2.2, near: .1, far: 12 });
  key.shadow.bias = -.00015; key.shadow.normalBias = .008; scene.add(key);
  const fill = new THREE.DirectionalLight('#e0f3ff', 1.7); fill.position.set(-3, 2, -3); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#f4f8f6', roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.014; floor.receiveShadow = true; scene.add(floor);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false; controls.enableZoom = false; controls.enablePan = false;
  controls.minPolarAngle = .1; controls.maxPolarAngle = Math.PI * .48;
  const panel = { scene, camera, renderer, controls, entries: {}, element };
  controls.addEventListener('change', () => {
    if (syncing) return; syncing = true;
    for (const other of panels) if (other !== panel) {
      other.camera.position.copy(camera.position); other.controls.target.copy(controls.target); other.controls.update();
    }
    syncing = false;
  });
  new ResizeObserver(() => {
    const width = element.clientWidth, height = element.clientHeight;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
  }).observe(element);
  panels.push(panel);
}
function setView(view) {
  const positions = { standard: [3.3, 2.35, 4.1], front: [0, 1.75, 5.1], side: [5.1, 1.75, 0], back: [0, 1.75, -5.1] };
  syncing = true;
  for (const p of panels) {
    p.controls.target.set(0, .8, 0);
    p.camera.position.fromArray(positions[view]).sub(p.controls.target).multiplyScalar(.83).add(p.controls.target);
    p.controls.update();
  }
  syncing = false;
}
setView('standard');
const [clock, baselineClock] = await Promise.all([
  fetch(asset(output + 'comparison-clock.json')).then(r => r.json()),
  fetch(asset('app/scene/src/v41-clock.json')).then(r => r.json()),
]);
const sample = (xs, ys, x) => {
  let low = 0, high = xs.length - 1;
  while (high - low > 1) { const mid = (low + high) >> 1; if (xs[mid] > x) high = mid; else low = mid; }
  const f = THREE.MathUtils.clamp((x - xs[low]) / (xs[high] - xs[low]), 0, 1);
  return THREE.MathUtils.lerp(ys[low], ys[high], f);
};
function seek(phase) {
  state.phase = phase;
  const raw = sample(clock.phases, clock.baselineSequenceTimes, phase);
  const oldTime = sample(baselineClock.sequenceTime, baselineClock.frameTimes, raw);
  for (let i = 0; i < panels.length; i++) {
    const p = panels[i];
    for (const [kind, entry] of Object.entries(p.entries)) {
      entry.model.visible = kind === state.body;
      if (!entry.model.visible) continue;
      entry.action.enabled = true; entry.action.paused = false;
      entry.mixer.setTime(i === 0 ? oldTime : phase * entry.clip.duration);
      entry.model.updateMatrixWorld(true);
    }
  }
  slider.value = phase * 100; pct.textContent = (phase * 100).toFixed(1) + '%';
}
try {
  await Promise.all(panels.flatMap((panel, i) => ['training', 'coach'].map(async kind => {
    const source = i === 0 ? `app/scene/source/coach/${kind === 'training' ? 'flare-coach-v41-training-human-collarfix-20261013.glb' : 'flare-coach-v41-animated.glb'}` : `${output}flare-${kind}-v42-candidate.glb`;
    const gltf = await loader.loadAsync(asset(source));
    gltf.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
    const clip = gltf.animations[0], mixer = new THREE.AnimationMixer(gltf.scene), action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
    panel.entries[kind] = { model: gltf.scene, mixer, clip, action }; panel.scene.add(gltf.scene);
  })));
  state.ready = true; play.disabled = false; status.textContent = '已加载 · 两边同步阶段与视角'; seek(state.phase);
} catch (error) { status.textContent = '加载失败：' + error.message; console.error(error); }
function setPlaying(value) { state.playing = value; play.textContent = value ? '暂停对照' : '播放对照'; }
play.onclick = () => setPlaying(!state.playing);
document.getElementById('reset').onclick = () => { setPlaying(false); seek(0); };
slider.oninput = () => { setPlaying(false); seek(Number(slider.value) / 100); };
document.getElementById('duration').onchange = e => state.duration = Number(e.target.value);
document.getElementById('view').onchange = e => setView(e.target.value);
document.getElementById('body').onchange = e => { state.body = e.target.value; seek(state.phase); };
let last = performance.now();
function render(now) {
  const dt = Math.min((now - last) / 1000, .08); last = now;
  if (state.ready && state.playing) seek((state.phase + dt / state.duration) % 1);
  panels.forEach(p => p.renderer.render(p.scene, p.camera)); state.frames++;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
window.__v42 = { state, seek: phase => { setPlaying(false); seek(phase); }, setView, setPlaying, panels,
  snapshot: () => ({ ...state, cameras: panels.map(p => p.camera.position.toArray()),
    current: panels.map(p => ({ clip: p.entries[state.body]?.clip.name, time: p.entries[state.body]?.action.time })) }) };
