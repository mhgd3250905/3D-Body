import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import DATA from './flare-data.json';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const EMBER = new THREE.Color('#ff6a3d');
const root = document.documentElement;
const isMobile = () => innerWidth < 820;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const PH_EN = ['Rear support', 'First transfer', 'First side support', 'First leg pass', 'Front support', 'Second transfer', 'Second side support', 'Second leg pass'];
const DUR = DATA.dur;

/* ---------------- loader UI ---------------- */
const loaderEl = $('#loader');
const loaderPct = $('#loader-pct');
const loaderBar = $('#loader-bar');
let shownPct = 0, targetPct = 4;
(function tickLoader() {
  shownPct += (targetPct - shownPct) * 0.12;
  if (loaderPct) loaderPct.textContent = String(Math.round(shownPct)).padStart(3, '0');
  if (loaderBar) loaderBar.style.transform = `scaleX(${shownPct / 100})`;
  if (!root.classList.contains('is-loaded')) requestAnimationFrame(tickLoader);
})();
function revealPage(mode) {
  targetPct = 100;
  setTimeout(() => {
    root.classList.add('is-loaded');
    root.classList.add(mode === 'gl' ? 'has-gl' : 'no-gl');
  }, mode === 'gl' ? 450 : 200);
}
const safety = setTimeout(() => { if (!root.classList.contains('is-loaded')) revealPage('fallback'); }, 15000);

/* ---------------- generic UI (works without WebGL) ---------------- */
// reveal on view
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
$$('[data-reveal]').forEach((el) => io.observe(el));
// count-up figures
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, to = +el.dataset.count, t0 = performance.now();
  const step = (now) => { const k = clamp((now - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}), { threshold: 0.4 });
$$('[data-count]').forEach((el) => cio.observe(el));
// nav state
const nav = $('#nav');

/* ---------------- section geometry ---------------- */
const secHero = $('#hero'), secPhases = $('#phases'), secMuscle = $('#muscle'), secRules = $('#rules'), secAfter = $('#loop');
function pinProgress(el) {
  const r = el.getBoundingClientRect();
  const span = r.height - innerHeight;
  return span <= 0 ? clamp(-r.top / innerHeight) : clamp(-r.top / span);
}
function topOf(el) { return el.getBoundingClientRect().top; }

/* phase UI */
const phaseNum = $('#ph-num'), phaseZh = $('#ph-zh'), phaseEn = $('#ph-en'), phaseDetail = $('#ph-detail'), phaseCap = $('#ph-cap');
const phaseTicks = $$('#ph-rail .tick');
const phaseFill = $('#ph-fill');
let lastPhase = -1;
function setPhaseText(i) {
  if (i === lastPhase) return; lastPhase = i;
  const p = DATA.phases[i];
  const box = $('#ph-text');
  box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap');
  phaseNum.textContent = String(i + 1).padStart(2, '0');
  phaseZh.textContent = p.name; phaseEn.textContent = PH_EN[i]; phaseDetail.textContent = p.detail; phaseCap.textContent = p.cap;
  phaseTicks.forEach((t, k) => t.classList.toggle('on', k === i));
}
function phaseAt(t) {
  const f = Math.min(DATA.n - 1, Math.max(0, Math.round((t / DUR) * (DATA.n - 1))));
  return DATA.states[DATA.frames[f]];
}

/* muscle legend */
const legendItems = {};
$$('#legend [data-g]').forEach((el) => { legendItems[el.dataset.g] = el; });
const musPhase = $('#mus-phase'), musPhaseEn = $('#mus-phase-en'), musSupport = $('#mus-support');
let lastMusState = null;
function setMuscleUI(st) {
  if (st === lastMusState) return; lastMusState = st;
  const prim = new Set(st[2].map((g) => DATA.groups[g[0]].id));
  const sec = new Set(st[3].map((g) => DATA.groups[g[0]].id));
  for (const id in legendItems) {
    legendItems[id].classList.toggle('p', prim.has(id));
    legendItems[id].classList.toggle('s', !prim.has(id) && sec.has(id));
  }
  musPhase.textContent = `${String(st[0] + 1).padStart(2, '0')} · ${DATA.phases[st[0]].name}`;
  musPhaseEn.textContent = PH_EN[st[0]];
  musSupport.textContent = st[1] === 'both' ? '双手支撑 · Both hands' : st[1] === 'left' ? '左手支撑 · Left hand' : '右手支撑 · Right hand';
}

/* parallax + fallback scroll */
const parEls = $$('[data-par]');
function onScrollUI() {
  const vh = innerHeight;
  parEls.forEach((el) => { const r = el.getBoundingClientRect(); el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(4)); });
  if (root.classList.contains('no-gl')) {
    const pP = pinProgress(secPhases), pM = pinProgress(secMuscle);
    const i = Math.min(7, Math.floor(pP * 8)); setPhaseText(i); if (phaseFill) phaseFill.style.transform = `scaleX(${pP})`;
    setMuscleUI(DATA.states[Math.min(7, Math.floor(pM * 8))]);
  }
  if (nav) nav.classList.toggle('scrolled', scrollY > 40);
}
addEventListener('scroll', onScrollUI, { passive: true }); addEventListener('resize', onScrollUI);
setTimeout(onScrollUI, 50);
setPhaseText(0); setMuscleUI(DATA.states[1]);

/* ---------------- WebGL ---------------- */
function webglOK() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}

if (!webglOK() || /[?&]nogl\b/.test(location.search)) {
  clearTimeout(safety); revealPage('fallback');
} else {
  try { initGL(); } catch (e) { console.error(e); clearTimeout(safety); revealPage('fallback'); }
}

function initGL() {
  const canvas = $('#gl');
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

  // lights
  scene.add(new THREE.HemisphereLight(0x8d96a8, 0x0a0a0c, 0.55));
  const key = new THREE.SpotLight(0xfff1e6, 5.2, 0, 0.42, 0.85, 0);
  key.position.set(1.2, 6.5, 2.4); key.target.position.set(0, 0.4, 0);
  key.castShadow = true; key.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048);
  key.shadow.camera.near = 2; key.shadow.camera.far = 12; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 5;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xff6a3d, 5.5); rim.position.set(-3.2, 2.4, -3.6); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xff8a5c, 1.6); rim2.position.set(3.5, 1.2, -2.5); scene.add(rim2);
  const fill = new THREE.DirectionalLight(0xc8d2e6, 0.55); fill.position.set(2.5, 1.5, 4); scene.add(fill);

  // floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ color: 0x0c0c0f }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.62, color: 0x000000 }));
  shadowPlane.rotation.x = -Math.PI / 2; shadowPlane.position.y = 0.004; shadowPlane.receiveShadow = true; shadowPlane.renderOrder = 3; scene.add(shadowPlane);
  const stageU = { uTime: { value: 0 }, uC: { value: EMBER.clone() }, uA: { value: 1 } };
  const stage = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: stageU,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec2 vUv;uniform float uTime;uniform vec3 uC;uniform float uA;
      void main(){vec2 p=(vUv-.5)*9.;float r=length(p);float a=atan(p.y,p.x);
      float glow=exp(-r*r*.35)*.07;vec3 pool=vec3(.42,.36,.34)*exp(-r*r*.22)*.30;
      float ring=smoothstep(.016,0.,abs(r-1.55))*.75;
      float ring2=smoothstep(.01,0.,abs(r-2.25))*.22*(step(.5,fract(a*24./6.2831+uTime*.05)));
      float ticks=smoothstep(.012,0.,abs(r-1.72))*step(.86,fract(a*48./6.2831))*.5;
      float sweep=pow(max(0.,cos(a-uTime*.6)),24.)*smoothstep(1.9,1.2,r)*smoothstep(.2,1.4,r)*.08;
      vec3 c=uC*(glow+ring+ring2+ticks+sweep)+pool;
      gl_FragColor=vec4(c*uA,1.);}`,
  }));
  stage.rotation.x = -Math.PI / 2; stage.position.y = 0.003; stage.renderOrder = 2; scene.add(stage);

  // ember particles
  const PN = isMobile() ? 260 : 520;
  const pg = new THREE.BufferGeometry();
  const pp = new Float32Array(PN * 3), ps = new Float32Array(PN);
  for (let i = 0; i < PN; i++) {
    const r = 0.6 + Math.random() * 4.2, a = Math.random() * Math.PI * 2;
    pp.set([Math.cos(a) * r, Math.random() * 3.2, Math.sin(a) * r], i * 3); ps[i] = Math.random();
  }
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('seed', new THREE.BufferAttribute(ps, 1));
  const partU = { uTime: { value: 0 }, uPx: { value: 1 }, uA: { value: 1 } };
  const parts = new THREE.Points(pg, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: partU,
    vertexShader: `attribute float seed;uniform float uTime;uniform float uPx;varying float vA;
      void main(){vec3 p=position;p.y=mod(p.y+uTime*(.05+seed*.09),3.2);p.x+=sin(uTime*.3+seed*20.)*.15;p.z+=cos(uTime*.25+seed*14.)*.15;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      vA=smoothstep(0.,.5,p.y)*smoothstep(3.2,2.2,p.y)*(.25+.75*fract(seed*7.3));
      gl_PointSize=uPx*(1.2+seed*2.6)*(4./-mv.z);}`,
    fragmentShader: `uniform float uA;varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(vec3(1.,.47,.26)*a*vA*uA,1.);}`,
  }));
  scene.add(parts);

  // trails (precomputed after load)
  const TRAIL = 70;
  const trailU = { uA: { value: 1 } };
  const trailMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: trailU,
    vertexShader: 'attribute float age;varying float vAge;void main(){vAge=age;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float uA;varying float vAge;void main(){float a=pow(1.-vAge,1.6);gl_FragColor=vec4(vec3(1.,.42,.24)*a*uA*1.4,1.);}',
  });
  const trails = [];
  for (let k = 0; k < 4; k++) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    const age = new Float32Array(TRAIL); for (let i = 0; i < TRAIL; i++) age[i] = i / (TRAIL - 1);
    g.setAttribute('age', new THREE.BufferAttribute(age, 1));
    const l = new THREE.Line(g, trailMat); l.frustumCulled = false; l.visible = false; scene.add(l); trails.push(l);
  }

  // state
  let coach = null, mixer = null, action = null, bones = {};
  const glowMats = [];
  const jointGlow = new Float32Array(22), jointTarget = new Float32Array(22);
  let JOINTS = [];
  const SAMPLES = 360; let table = null; // per sample: positions of tracked joints
  const TRACK = ['leftFoot', 'rightFoot', 'leftHand', 'rightHand', 'pelvis', 'neck', 'leftThigh', 'rightThigh', 'leftShin', 'rightShin', 'leftUpperArm', 'rightUpperArm', 'leftForearm', 'rightForearm'];
  let angles = null; // per sample: [kneeL,kneeR,elbowL,elbowR,hipL,hipR]

  function patchMaterial(mat) {
    const m = mat.clone();
    m.userData.u = { uX: { value: 0 }, uJ: { value: jointGlow }, uEmber: { value: new THREE.Color('#ff6a3d') }, uT: { value: 0 } };
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, m.userData.u);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uJ[22];varying float vGlow;varying float vWy;')
        .replace('#include <skinning_vertex>', `#include <skinning_vertex>
          vGlow = uJ[int(skinIndex.x)]*skinWeight.x + uJ[int(skinIndex.y)]*skinWeight.y + uJ[int(skinIndex.z)]*skinWeight.z + uJ[int(skinIndex.w)]*skinWeight.w;`)
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vWy = (modelMatrix * vec4(transformed,1.0)).y;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uX;uniform vec3 uEmber;uniform float uT;varying float vGlow;varying float vWy;')
        .replace('#include <opaque_fragment>', `#include <opaque_fragment>
          if(uX>0.001){
            vec3 nn=normalize(normal);vec3 vv=normalize(vViewPosition);
            float fres=pow(1.0-abs(dot(nn,vv)),2.0);
            float g=clamp(vGlow,0.0,1.2);
            float lam=0.5+0.5*dot(nn,normalize(vec3(0.3,0.8,0.5)));
            vec3 xr=vec3(0.018,0.019,0.023)+vec3(0.05,0.052,0.06)*lam+fres*vec3(0.34,0.36,0.42)*0.75;
            xr+=uEmber*g*(0.5+1.4*fres)*1.5+vec3(1.0,0.8,0.6)*g*g*fres*0.25;
            float scan=smoothstep(0.06,0.0,abs(fract(vWy*0.7-uT*0.35)-0.5))*0.18;
            xr+=vec3(1.0,0.55,0.35)*scan*fres;
            gl_FragColor.rgb=mix(gl_FragColor.rgb,xr,uX);
          }`);
    };
    m.customProgramCacheKey = () => 'flx';
    glowMats.push(m);
    return m;
  }

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load('coach.glb', (gltf) => {
    coach = gltf.scene;
    coach.traverse((o) => {
      if (o.isSkinnedMesh || o.isMesh) {
        o.frustumCulled = false; o.castShadow = true; o.receiveShadow = true;
        o.material = patchMaterial(o.material);
        if (o.isSkinnedMesh && !JOINTS.length) JOINTS = o.skeleton.bones.map((b) => b.name);
      }
      if (o.isBone) bones[o.name] = o;
    });
    scene.add(coach);
    mixer = new THREE.AnimationMixer(coach);
    const clip = gltf.animations[0];
    action = mixer.clipAction(clip); action.setLoop(THREE.LoopRepeat, Infinity); action.play();
    // precompute joint table
    table = new Float32Array(SAMPLES * TRACK.length * 3);
    angles = new Float32Array(SAMPLES * 6);
    const v = new THREE.Vector3(), tmp = {};
    for (let s = 0; s < SAMPLES; s++) {
      action.time = (s / SAMPLES) * DUR; mixer.update(0); coach.updateMatrixWorld(true);
      TRACK.forEach((n, k) => { bones[n].getWorldPosition(v); table.set([v.x, v.y, v.z], (s * TRACK.length + k) * 3); tmp[n] = v.clone(); });
      const ang = (a, b, c) => THREE.MathUtils.radToDeg(a.clone().sub(b).angleTo(c.clone().sub(b)));
      angles[s * 6 + 0] = ang(tmp.leftThigh, tmp.leftShin, tmp.leftFoot);
      angles[s * 6 + 1] = ang(tmp.rightThigh, tmp.rightShin, tmp.rightFoot);
      angles[s * 6 + 2] = ang(tmp.leftUpperArm, tmp.leftForearm, tmp.leftHand);
      angles[s * 6 + 3] = ang(tmp.rightUpperArm, tmp.rightForearm, tmp.rightHand);
      // hip fold: flexion of thigh relative to trunk line (0 = straight body)
      const trunk = tmp.neck.clone().sub(tmp.pelvis).normalize();
      const fl = (th, kn) => 180 - THREE.MathUtils.radToDeg(trunk.angleTo(kn.clone().sub(th)));
      angles[s * 6 + 4] = fl(tmp.leftThigh, tmp.leftShin);
      angles[s * 6 + 5] = fl(tmp.rightThigh, tmp.rightShin);
    }
    window.__flare = { angles, SAMPLES };
    buildSpark();
    action.time = 1.4; mixer.update(0);
    trails.forEach((t) => (t.visible = true));
    clearTimeout(safety);
    // warm up shaders
    renderer.compile(scene, camera);
    revealPage('gl');
    root.dataset.ready = 'true';
  }, (e) => { if (e.total) targetPct = 6 + 88 * (e.loaded / e.total); else targetPct = Math.min(90, targetPct + 6); },
  (err) => { console.error(err); clearTimeout(safety); revealPage('fallback'); });

  /* muscle → joint glow */
  const GROUP_J = {
    'deltoids': [['S:Scapula', 0.55], ['S:UpperArm', 1]], 'rotator-cuff': [['S:Scapula', 1], ['S:UpperArm', 0.45]], 'triceps': [['S:UpperArm', 1], ['S:Forearm', 0.2]],
    'forearms': [['S:Forearm', 1], ['S:Hand', 0.7]], 'serratus': [['torso', 0.55], ['S:Scapula', 0.5]], 'scapular': [['S:Scapula', 0.8], ['torso', 0.4]],
    'chest': [['torso', 0.75], ['S:Scapula', 0.3]], 'lats': [['torso', 0.5], ['spineUpper', 0.65]], 'abs': [['spineLower', 1], ['spineUpper', 0.6]],
    'obliques': [['spineLower', 0.9], ['spineUpper', 0.6], ['pelvis', 0.25]], 'erectors': [['spineLower', 0.8], ['spineUpper', 0.6], ['torso', 0.2]],
    'hip-flexors': [['pelvis', 0.6], ['S:Thigh', 0.55]], 'glute-max': [['pelvis', 1], ['S:Thigh', 0.3]], 'hip-abductors': [['pelvis', 0.8], ['S:Thigh', 0.35]],
    'adductors': [['S:Thigh', 0.8]], 'quadriceps': [['S:Thigh', 1], ['S:Patella', 0.8]], 'hamstrings': [['S:Thigh', 0.9]],
  };
  function setGlowTargets(st, amount) {
    jointTarget.fill(0);
    const apply = (list, k) => list.forEach(([gi, side]) => {
      const id = DATA.groups[gi].id; const sides = side === 'both' ? ['left', 'right'] : [side];
      (GROUP_J[id] || []).forEach(([jn, w]) => {
        const names = jn.startsWith('S:') ? sides.map((s) => s + jn.slice(2)) : [jn];
        names.forEach((n) => { const j = JOINTS.indexOf(n); if (j >= 0) jointTarget[j] = Math.max(jointTarget[j], w * k * amount); });
      });
    });
    apply(st[3], 0.3); apply(st[2], 1);
  }

  /* knee sparkline */
  function buildSpark() {
    const svg = $('#spark'); if (!svg) return;
    const W = 300, H = 70, lo = 170, hi = 181;
    let d = '';
    for (let s = 0; s < SAMPLES; s += 2) {
      const k = Math.min(angles[s * 6], angles[s * 6 + 1]);
      const x = (s / SAMPLES) * W, y = H - ((k - lo) / (hi - lo)) * H;
      d += (s ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    $('#spark-path').setAttribute('d', d);
    const ty = H - ((176 - lo) / (hi - lo)) * H;
    const th = $('#spark-th'); th.setAttribute('y1', ty); th.setAttribute('y2', ty);
    let mn = 999; for (let s = 0; s < SAMPLES; s++) mn = Math.min(mn, angles[s * 6], angles[s * 6 + 1]);
    $('#spark-min').textContent = mn.toFixed(1) + '°';
    let hp = 0; for (let s = 0; s < SAMPLES; s++) hp = Math.max(hp, angles[s * 6 + 4], angles[s * 6 + 5]);
    $('#hip-peak').textContent = hp.toFixed(1) + '°';
  }

  /* sizing */
  let W = 0, H = 0;
  function resize() {
    W = innerWidth; H = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile() ? 1.6 : 1.5));
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    partU.uPx.value = renderer.getPixelRatio() * (isMobile() ? 1.3 : 1.6);
  }
  addEventListener('resize', resize); resize();

  /* drag to rotate */
  let yawUser = 0, yawVel = 0, dragging = false, lastX = 0, startX = 0, startY = 0, decided = false, horizontal = false;
  const dragZones = $$('[data-drag]');
  dragZones.forEach((z) => {
    z.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a,button,summary')) return;
      dragging = true; decided = false; horizontal = e.pointerType === 'mouse'; lastX = startX = e.clientX; startY = e.clientY; yawVel = 0;
      root.classList.add('dragging');
    });
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (!decided && e.pointerType !== 'mouse') {
      const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
      if (dx + dy > 8) { decided = true; horizontal = dx > dy; if (!horizontal) { dragging = false; root.classList.remove('dragging'); return; } }
      else return;
    }
    const dx = e.clientX - lastX; lastX = e.clientX;
    yawVel = dx * 0.006; yawUser += yawVel;
  });
  const endDrag = () => { dragging = false; root.classList.remove('dragging'); };
  addEventListener('pointerup', endDrag); addEventListener('pointercancel', endDrag);

  /* annotations */
  const svgA = $('#annot');
  const A = {
    kL: $('#a-kl'), kR: $('#a-kr'), el: $('#a-el'), hip: $('#a-hip'),
    tkL: $('#t-kl'), tkR: $('#t-kr'), tel: $('#t-el'), thip: $('#t-hip'),
  };
  const liveKnee = $('#live-knee'), liveElbow = $('#live-elbow'), liveHip = $('#live-hip'), livePhase = $('#live-phase'), sparkDot = $('#spark-dot'), rhythmHead = $('#rhythm-head');
  const heroLive = $('#hero-live');
  const pv = new THREE.Vector3();
  function proj(p) { pv.copy(p).project(camera); return [(pv.x * 0.5 + 0.5) * W, (-pv.y * 0.5 + 0.5) * H]; }
  function sampleJoint(t, name) {
    const k = TRACK.indexOf(name); const f = ((t / DUR) % 1 + 1) % 1 * SAMPLES; const i0 = Math.floor(f) % SAMPLES, i1 = (i0 + 1) % SAMPLES, w = f - Math.floor(f);
    const a = (i0 * TRACK.length + k) * 3, b = (i1 * TRACK.length + k) * 3;
    return new THREE.Vector3(lerp(table[a], table[b], w), lerp(table[a + 1], table[b + 1], w), lerp(table[a + 2], table[b + 2], w));
  }
  function sampleAngle(t, j) { const f = ((t / DUR) % 1 + 1) % 1 * SAMPLES; const i0 = Math.floor(f) % SAMPLES, i1 = (i0 + 1) % SAMPLES, w = f - Math.floor(f); return lerp(angles[i0 * 6 + j], angles[i1 * 6 + j], w); }
  function polyArc(svgPath, label, a, b, c, txt) {
    const P = proj(a), Q = proj(b), R = proj(c);
    const v1 = [P[0] - Q[0], P[1] - Q[1]], v2 = [R[0] - Q[0], R[1] - Q[1]];
    const n1 = Math.hypot(...v1) || 1, n2 = Math.hypot(...v2) || 1, rr = Math.min(26, n1 * 0.4, n2 * 0.4);
    const s1 = [Q[0] + v1[0] / n1 * rr, Q[1] + v1[1] / n1 * rr], s2 = [Q[0] + v2[0] / n2 * rr, Q[1] + v2[1] / n2 * rr];
    const cross = v1[0] * v2[1] - v1[1] * v2[0];
    svgPath.setAttribute('d', `M${Q[0].toFixed(1)} ${(Q[1]-2.5).toFixed(1)}a2.5 2.5 0 1 0 .01 0M${P[0].toFixed(1)} ${P[1].toFixed(1)}L${Q[0].toFixed(1)} ${Q[1].toFixed(1)}L${R[0].toFixed(1)} ${R[1].toFixed(1)}M${s1[0].toFixed(1)} ${s1[1].toFixed(1)}A${rr} ${rr} 0 0 ${cross > 0 ? 1 : 0} ${s2[0].toFixed(1)} ${s2[1].toFixed(1)}`);
    const bis = [-(v1[0] / n1 + v2[0] / n2), -(v1[1] / n1 + v2[1] / n2)]; const bn = Math.hypot(...bis) || 1;
    const lx = Q[0] + bis[0] / bn * 58, ly = Q[1] + bis[1] / bn * 58 + 4; label.setAttribute('x', lx.toFixed(1)); label.setAttribute('y', ly.toFixed(1)); label.setAttribute('text-anchor', bis[0] < 0 ? 'end' : 'start');
    label.textContent = txt;
  }

  /* scene state */
  const S = { az: 0.75, el: 0.2, dist: 4.6, ty: 0.62, film: 0, xray: 0, stageA: 1, trailA: 1, partA: 1, annot: 0, alpha: 1 };
  let clockT = 1.4, prevNow = performance.now(), scrubT = 0, wasScrub = false, autoAz = 0;
  const camTarget = new THREE.Vector3();

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - prevNow) / 1000); prevNow = now;
    const mob = isMobile();
    // scroll → targets
    const vh = innerHeight;
    const pP = pinProgress(secPhases), pM = pinProgress(secMuscle), pR = pinProgress(secRules);
    const tPh = topOf(secPhases), tMu = topOf(secMuscle), tRu = topOf(secRules), tAf = topOf(secAfter);
    let T = { az: 0.75, el: 0.2, dist: mob ? 6.4 : 4.55, ty: mob ? 0.8 : 0.6, film: mob ? 0 : -5.0, xray: 0, stageA: 1, trailA: 1, partA: 1, annot: 0 };
    let mode = 'play', speed = 0.5, scene_ = 'hero', allowDrag = true;
    if (tPh < vh * 0.5) {
      scene_ = 'phases'; mode = 'scrub'; allowDrag = false;
      T = { az: 0.75 + pP * Math.PI * 1.7, el: 0.16 + Math.sin(pP * Math.PI) * 0.22, dist: mob ? 6.2 : 4.6, ty: mob ? 0.95 : 0.6, film: mob ? 0 : -4.8, xray: 0, stageA: 1, trailA: 1, partA: 0.8, annot: 0 };
      scrubT = clamp(pP * 1.08 - 0.04) * DUR * 0.9999;
    }
    if (tMu < vh * 0.5) {
      scene_ = 'muscle'; mode = 'play'; speed = 0.32; allowDrag = true;
      T = { az: 2.1 + pM * 1.2, el: 0.14, dist: mob ? 6.3 : 4.3, ty: mob ? 0.42 : 0.6, film: mob ? 0 : 5.4, xray: 1, stageA: 0.45, trailA: 0.15, partA: 0.35, annot: 0 };
    }
    if (tRu < vh * 0.5) {
      scene_ = 'rules'; mode = 'play'; speed = 0.22; allowDrag = true;
      T = { az: 0.35 + pR * 0.5, el: 0.1, dist: mob ? 7.3 : 4.4, ty: mob ? 0.3 : 0.58, film: mob ? 0 : -5.6, xray: 0, stageA: 0.7, trailA: 0.25, partA: 0.4, annot: 1 };
    }
    // fade out after rules
    const alpha = clamp(tAf / (vh * 0.6));
    canvas.style.opacity = alpha.toFixed(3);
    root.style.setProperty('--stage-a', alpha.toFixed(3));
    if (nav) nav.classList.toggle('solid', tPh < 0 && alpha < 0.5);
    root.dataset.scene = scene_;
    if (!allowDrag) yawUser *= 0.92;
    if (!dragging) { yawUser += yawVel; yawVel *= 0.93; }
    if (alpha <= 0.001 && !dragging) return;

    const k = 1 - Math.pow(0.0025, dt);
    for (const n in T) S[n] = lerp(S[n], T[n], n === 'xray' || n === 'annot' ? 1 - Math.pow(0.02, dt) : k);

    // time
    if (mixer) {
      if (mode === 'scrub') {
        let d = scrubT - clockT; if (!wasScrub) { d = ((d % DUR) + DUR * 1.5) % DUR - DUR * 0.5; }
        clockT += d * (1 - Math.pow(0.0008, dt)); wasScrub = true;
      } else {
        clockT += dt * speed * (reduce ? 0.5 : 1); wasScrub = false;
      }
      const t = ((clockT % DUR) + DUR) % DUR;
      action.time = t; mixer.update(0);

      const st = phaseAt(t);
      if (scene_ === 'phases') { setPhaseText(st[0]); if (phaseFill) phaseFill.style.transform = `scaleX(${t / DUR})`; }
      if (heroLive) heroLive.textContent = `${String(st[0] + 1).padStart(2, '0')}/08 · ${DATA.phases[st[0]].name}`;
      setGlowTargets(st, clamp(S.xray * 1.2));
      if (scene_ === 'muscle') setMuscleUI(st);
      for (let j = 0; j < 22; j++) jointGlow[j] = lerp(jointGlow[j], jointTarget[j], 1 - Math.pow(0.004, dt));

      // trails
      const span = 0.9;
      ['leftFoot', 'rightFoot', 'leftHand', 'rightHand'].forEach((n, ti) => {
        const arr = trails[ti].geometry.attributes.position.array;
        for (let i = 0; i < TRAIL; i++) { const p = sampleJoint(t - (i / (TRAIL - 1)) * span * (ti > 1 ? 0.6 : 1), n); arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; }
        trails[ti].geometry.attributes.position.needsUpdate = true;
      });

      // camera
      autoAz += dt * (scene_ === 'hero' ? 0.06 : 0);
      const az = S.az + yawUser + autoAz, el = S.el;
      camTarget.set(0, S.ty, 0);
      camera.position.set(Math.sin(az) * Math.cos(el) * S.dist, S.ty + Math.sin(el) * S.dist, Math.cos(az) * Math.cos(el) * S.dist);
      camera.lookAt(camTarget);
      camera.filmOffset = S.film; camera.updateProjectionMatrix();

      // annotations & live readouts
      if (S.annot > 0.02) {
        svgA.style.opacity = (S.annot * alpha).toFixed(3);
        const J = (n) => sampleJoint(t, n);
        const kL = sampleAngle(t, 0), kR = sampleAngle(t, 1), eL = sampleAngle(t, 2), eR = sampleAngle(t, 3), hL = sampleAngle(t, 4), hR = sampleAngle(t, 5);
        polyArc(A.kL, A.tkL, J('leftThigh'), J('leftShin'), J('leftFoot'), kL.toFixed(1) + '°');
        polyArc(A.kR, A.tkR, J('rightThigh'), J('rightShin'), J('rightFoot'), kR.toFixed(1) + '°');
        const sup = st[1] === 'left' ? 'left' : st[1] === 'right' ? 'right' : (eL < eR ? 'left' : 'right');
        const eS = sup === 'left' ? eL : eR;
        polyArc(A.el, A.tel, J(sup + 'UpperArm'), J(sup + 'Forearm'), J(sup + 'Hand'), eS.toFixed(1) + '°');
        const hipSide = hL > hR ? 'left' : 'right';
        A.hip.setAttribute('d', ''); A.thip.textContent = '';
        liveKnee.textContent = Math.min(kL, kR).toFixed(1) + '°';
        liveElbow.textContent = eS.toFixed(1) + '°';
        liveHip.textContent = Math.max(hL, hR).toFixed(1) + '°';
        livePhase.textContent = `${String(st[0] + 1).padStart(2, '0')} ${DATA.phases[st[0]].name}`;
        sparkDot.setAttribute('cx', ((t / DUR) * 300).toFixed(1)); sparkDot.setAttribute('cy', (70 - ((Math.min(kL, kR) - 170) / 11) * 70).toFixed(1));
        rhythmHead.style.left = ((t / DUR) * 100).toFixed(2) + '%';
      } else svgA.style.opacity = 0;
    }

    // materials / fx
    glowMats.forEach((m) => { m.userData.u.uX.value = S.xray; m.userData.u.uT.value = now / 1000; });
    stageU.uTime.value = now / 1000; stageU.uA.value = S.stageA;
    partU.uTime.value = now / 1000; partU.uA.value = S.partA;
    trailU.uA.value = S.trailA;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
