// FlareLab website v2 — hero 3D coach.
// The hero shows a still poster first; the live WebGL coach replaces it once
// coach.glb has loaded and the first frame rendered. Slow networks, Save-Data,
// reduced motion or missing WebGL keep the still (and the animated loop on
// devices that can't do WebGL but can play an animated WebP).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import DATA from './flare-data.json';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const EN = root.lang.startsWith('en');
const PH_EN = ['Rear support', 'First transfer', 'First side support', 'First leg pass', 'Front support', 'Second transfer', 'Second side support', 'Second leg pass'];
const DUR = DATA.dur;
const phaseName = (i) => (EN ? PH_EN[i] : DATA.phases[i].name);

/* ---------- generic UI ---------- */
const nav = $('#nav');
const onScroll = () => nav && nav.classList.toggle('solid', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
$$('[data-reveal]').forEach((el) => io.observe(el));

/* ---------- decide whether to go live ---------- */
function useLoop() { const i = $('.loopimg'); if (i && !i.src) { i.onload = () => stageEl.classList.add('loop'); i.src = i.dataset.src; } }
const stageEl = $('#hero-stage');
const canvas = $('#gl');
const live = $('#hero-live');
const conn = navigator.connection || {};
const slowNet = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function webglOK() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}
const forceStill = /[?&]still\b/.test(location.search);
if (stageEl && canvas) {
  if (forceStill || slowNet || reduce || !webglOK()) {
    if (!forceStill && !reduce && !webglOK()) useLoop(); // animated WebP loop
  } else {
    const go = () => { try { initGL(); } catch (e) { console.error(e); } };
    if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 300);
  }
}

function initGL() {
  const mob = () => innerWidth < 820;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x08080a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x08080a, 7, 17);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);

  scene.add(new THREE.HemisphereLight(0x8d96a8, 0x0a0a0c, 0.55));
  const key = new THREE.SpotLight(0xfff1e6, 5.2, 0, 0.42, 0.85, 0);
  key.position.set(1.2, 6.5, 2.4); key.target.position.set(0, 0.4, 0);
  key.castShadow = true; const sm = mob() ? 1024 : 2048; key.shadow.mapSize.set(sm, sm);
  key.shadow.camera.near = 2; key.shadow.camera.far = 12; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 5;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xff6a3d, 5.5); rim.position.set(-3.2, 2.4, -3.6); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xff8a5c, 1.6); rim2.position.set(3.5, 1.2, -2.5); scene.add(rim2);
  const fill = new THREE.DirectionalLight(0xc8d2e6, 0.55); fill.position.set(2.5, 1.5, 4); scene.add(fill);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ color: 0x0c0c0f }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.62, color: 0x000000 }));
  shadowPlane.rotation.x = -Math.PI / 2; shadowPlane.position.y = 0.004; shadowPlane.receiveShadow = true; shadowPlane.renderOrder = 3; scene.add(shadowPlane);
  const stageU = { uTime: { value: 0 }, uC: { value: new THREE.Color('#ff6a3d') } };
  const stage = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: stageU,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec2 vUv;uniform float uTime;uniform vec3 uC;
      void main(){vec2 p=(vUv-.5)*9.;float r=length(p);float a=atan(p.y,p.x);
      float glow=exp(-r*r*.35)*.07;vec3 pool=vec3(.42,.36,.34)*exp(-r*r*.22)*.30;
      float ring=smoothstep(.016,0.,abs(r-1.55))*.75;
      float ring2=smoothstep(.01,0.,abs(r-2.25))*.22*(step(.5,fract(a*24./6.2831+uTime*.05)));
      float ticks=smoothstep(.012,0.,abs(r-1.72))*step(.86,fract(a*48./6.2831))*.5;
      float sweep=pow(max(0.,cos(a-uTime*.6)),24.)*smoothstep(1.9,1.2,r)*smoothstep(.2,1.4,r)*.08;
      gl_FragColor=vec4(uC*(glow+ring+ring2+ticks+sweep)+pool,1.);}`,
  }));
  stage.rotation.x = -Math.PI / 2; stage.position.y = 0.003; stage.renderOrder = 2; scene.add(stage);

  // ember particles
  const PN = mob() ? 220 : 440;
  const pg = new THREE.BufferGeometry();
  const pp = new Float32Array(PN * 3), ps = new Float32Array(PN);
  for (let i = 0; i < PN; i++) { const r = 0.6 + Math.random() * 4.2, a = Math.random() * Math.PI * 2; pp.set([Math.cos(a) * r, Math.random() * 3.2, Math.sin(a) * r], i * 3); ps[i] = Math.random(); }
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('seed', new THREE.BufferAttribute(ps, 1));
  const partU = { uTime: { value: 0 }, uPx: { value: 1 } };
  scene.add(new THREE.Points(pg, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: partU,
    vertexShader: `attribute float seed;uniform float uTime;uniform float uPx;varying float vA;
      void main(){vec3 p=position;p.y=mod(p.y+uTime*(.05+seed*.09),3.2);p.x+=sin(uTime*.3+seed*20.)*.15;p.z+=cos(uTime*.25+seed*14.)*.15;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      vA=smoothstep(0.,.5,p.y)*smoothstep(3.2,2.2,p.y)*(.25+.75*fract(seed*7.3));
      gl_PointSize=uPx*(1.2+seed*2.6)*(4./-mv.z);}`,
    fragmentShader: 'varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(vec3(1.,.47,.26)*a*vA,1.);}',
  })));

  // hand/foot trails
  const TRAIL = 70, TRACK = ['leftFoot', 'rightFoot', 'leftHand', 'rightHand'], SAMPLES = 360;
  const trailMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float age;varying float vAge;void main(){vAge=age;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying float vAge;void main(){float a=pow(1.-vAge,1.6);gl_FragColor=vec4(vec3(1.,.42,.24)*a*1.4,1.);}',
  });
  const trails = TRACK.map(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    const age = new Float32Array(TRAIL); for (let i = 0; i < TRAIL; i++) age[i] = i / (TRAIL - 1);
    g.setAttribute('age', new THREE.BufferAttribute(age, 1));
    const l = new THREE.Line(g, trailMat); l.frustumCulled = false; l.visible = false; scene.add(l); return l;
  });

  let mixer = null, action = null, table = null, ready = false;
  const bones = {};
  const giveUp = setTimeout(() => { if (!ready) { useLoop(); } }, 15000);
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load('/coach.glb', (gltf) => {
    const coach = gltf.scene;
    coach.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.castShadow = true; o.receiveShadow = true; } if (o.isBone) bones[o.name] = o; });
    scene.add(coach);
    mixer = new THREE.AnimationMixer(coach);
    action = mixer.clipAction(gltf.animations[0]); action.setLoop(THREE.LoopRepeat, Infinity); action.play();
    table = new Float32Array(SAMPLES * TRACK.length * 3);
    const v = new THREE.Vector3();
    for (let s = 0; s < SAMPLES; s++) {
      action.time = (s / SAMPLES) * DUR; mixer.update(0); coach.updateMatrixWorld(true);
      TRACK.forEach((n, k) => { bones[n].getWorldPosition(v); table.set([v.x, v.y, v.z], (s * TRACK.length + k) * 3); });
    }
    trails.forEach((t) => (t.visible = true));
    renderer.compile(scene, camera);
    ready = true; clearTimeout(giveUp);
    requestAnimationFrame(() => requestAnimationFrame(() => { stageEl.classList.add('live'); root.dataset.ready = 'true'; }));
  }, undefined, (err) => { console.error(err); clearTimeout(giveUp); useLoop(); });

  const sampleJoint = (t, k, out) => {
    const f = ((t / DUR) % 1 + 1) % 1 * SAMPLES; const i0 = Math.floor(f) % SAMPLES, i1 = (i0 + 1) % SAMPLES, w = f - Math.floor(f);
    const a = (i0 * TRACK.length + k) * 3, b = (i1 * TRACK.length + k) * 3;
    return out.set(table[a] + (table[b] - table[a]) * w, table[a + 1] + (table[b + 1] - table[a + 1]) * w, table[a + 2] + (table[b + 2] - table[a + 2]) * w);
  };

  let W = 0, H = 0;
  function resize() {
    const r = stageEl.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio, mob() ? 1.6 : 1.5));
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    partU.uPx.value = renderer.getPixelRatio() * (mob() ? 1.3 : 1.6);
  }
  addEventListener('resize', resize); resize();

  // drag to rotate (horizontal only, so vertical swipes still scroll on phones)
  let yawUser = 0, yawVel = 0, dragging = false, lastX = 0, sx = 0, sy = 0, decided = false;
  stageEl.addEventListener('pointerdown', (e) => { if (e.target.closest('a,button')) return; dragging = true; decided = e.pointerType === 'mouse'; lastX = sx = e.clientX; sy = e.clientY; yawVel = 0; });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (!decided) { const dx = Math.abs(e.clientX - sx), dy = Math.abs(e.clientY - sy); if (dx + dy < 8) return; decided = true; if (dy > dx) { dragging = false; return; } }
    const dx = e.clientX - lastX; lastX = e.clientX; yawVel = dx * 0.006; yawUser += yawVel;
  });
  const end = () => { dragging = false; }; addEventListener('pointerup', end); addEventListener('pointercancel', end);

  // render only while the hero is on screen
  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(stageEl);

  let clockT = 1.4, prev = performance.now(), autoAz = 0, lastPh = -1;
  const tmp = new THREE.Vector3();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - prev) / 1000); prev = now;
    if (!visible || document.hidden) return;
    if (!dragging) { yawUser += yawVel; yawVel *= 0.93; }
    const m = mob();
    if (mixer) {
      clockT += dt * 0.5;
      const t = ((clockT % DUR) + DUR) % DUR;
      action.time = t; mixer.update(0);
      const f = Math.min(DATA.n - 1, Math.round((t / DUR) * (DATA.n - 1)));
      const ph = DATA.states[DATA.frames[f]][0];
      if (live && ph !== lastPh) { lastPh = ph; live.textContent = `${String(ph + 1).padStart(2, '0')}/08 · ${phaseName(ph)}`; }
      TRACK.forEach((n, ti) => {
        const arr = trails[ti].geometry.attributes.position.array;
        for (let i = 0; i < TRAIL; i++) { sampleJoint(t - (i / (TRAIL - 1)) * 0.9 * (ti > 1 ? 0.6 : 1), ti, tmp); arr[i * 3] = tmp.x; arr[i * 3 + 1] = tmp.y; arr[i * 3 + 2] = tmp.z; }
        trails[ti].geometry.attributes.position.needsUpdate = true;
      });
    }
    autoAz += dt * 0.06;
    const az = 0.75 + yawUser + autoAz, el = 0.2, dist = m ? 5.6 : 4.9, ty = m ? 0.75 : 0.6;
    camera.position.set(Math.sin(az) * Math.cos(el) * dist, ty + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(0, ty, 0);
    camera.filmOffset = m ? 0 : -6.2; camera.updateProjectionMatrix();
    stageU.uTime.value = now / 1000; partU.uTime.value = now / 1000;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
