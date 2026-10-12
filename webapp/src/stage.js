// Motion stage: Snow coach (v41 Thomas flare, meshopt-compressed coach.glb from
// the marketing site), orbit camera, phase-synced X-ray muscle glow, picking.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import DATA from './flare-data.json';

export const DUR = DATA.dur;
export const SEG = DATA.seg; // [phase, start, end]
export function phaseStart(i) { return SEG.find((s) => s[0] === i)[1]; }
export function stateAt(t) {
  const f = Math.min(DATA.n - 1, Math.max(0, Math.round((((t % DUR) + DUR) % DUR / DUR) * (DATA.n - 1))));
  const st = DATA.states[DATA.frames[f]];
  return { phase: st[0], support: st[1], primary: st[2].map(([g, s]) => [DATA.groups[g].id, s]), secondary: st[3].map(([g, s]) => [DATA.groups[g].id, s]) };
}
const GROUP_J = {
  deltoids: [['S:Scapula', 0.55], ['S:UpperArm', 1]], 'rotator-cuff': [['S:Scapula', 1], ['S:UpperArm', 0.45]], triceps: [['S:UpperArm', 1], ['S:Forearm', 0.2]],
  forearms: [['S:Forearm', 1], ['S:Hand', 0.7]], serratus: [['torso', 0.55], ['S:Scapula', 0.5]], scapular: [['S:Scapula', 0.8], ['torso', 0.4]],
  chest: [['torso', 0.75], ['S:Scapula', 0.3]], lats: [['torso', 0.5], ['spineUpper', 0.65]], abs: [['spineLower', 1], ['spineUpper', 0.6]],
  obliques: [['spineLower', 0.9], ['spineUpper', 0.6], ['pelvis', 0.25]], erectors: [['spineLower', 0.8], ['spineUpper', 0.6], ['torso', 0.2]],
  'hip-flexors': [['pelvis', 0.6], ['S:Thigh', 0.55]], 'glute-max': [['pelvis', 1], ['S:Thigh', 0.3]], 'hip-abductors': [['pelvis', 0.8], ['S:Thigh', 0.35]],
  adductors: [['S:Thigh', 0.8]], quadriceps: [['S:Thigh', 1], ['S:Patella', 0.8]], hamstrings: [['S:Thigh', 0.9]],
};
// joint -> groups a click on that body part may mean (current phase decides)
const PICK = {
  UpperArm: ['deltoids', 'triceps', 'rotator-cuff'], Forearm: ['forearms', 'triceps'], Hand: ['forearms'], Scapula: ['deltoids', 'rotator-cuff', 'scapular', 'serratus'],
  torso: ['chest', 'serratus', 'lats', 'scapular'], spineUpper: ['lats', 'abs', 'erectors', 'obliques'], spineLower: ['abs', 'obliques', 'erectors'],
  pelvis: ['glute-max', 'hip-abductors', 'hip-flexors', 'obliques'], Thigh: ['quadriceps', 'hamstrings', 'adductors', 'hip-flexors'], Patella: ['quadriceps'], Shin: ['quadriceps'],
};
export const VIEWS = { front: [0, 0.16], side: [Math.PI / 2, 0.14], back: [Math.PI, 0.16], reset: [0.75, 0.2] };

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

export function createStage(host, opts = {}) {
  const canvas = document.createElement('canvas'); canvas.className = 'gl'; host.prepend(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x0a0a0c, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x0a0a0c, 7, 17);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);
  scene.add(new THREE.HemisphereLight(0x8d96a8, 0x0a0a0c, 0.6));
  const key = new THREE.SpotLight(0xfff1e6, 5.2, 0, 0.42, 0.85, 0);
  key.position.set(1.2, 6.5, 2.4); key.target.position.set(0, 0.4, 0); key.castShadow = true; key.shadow.mapSize.set(1536, 1536);
  key.shadow.camera.near = 2; key.shadow.camera.far = 12; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 5;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xff6a3d, 5); rim.position.set(-3.2, 2.4, -3.6); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xff8a5c, 1.4); rim2.position.set(3.5, 1.2, -2.5); scene.add(rim2);
  const fill = new THREE.DirectionalLight(0xc8d2e6, 0.7); fill.position.set(2.5, 1.5, 4); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ color: 0x0d0d10 })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.6 }));
  shadowPlane.rotation.x = -Math.PI / 2; shadowPlane.position.y = 0.004; shadowPlane.receiveShadow = true; shadowPlane.renderOrder = 3; scene.add(shadowPlane);
  const stageU = { uTime: { value: 0 }, uC: { value: new THREE.Color('#ff6a3d') } };
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: stageU,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec2 vUv;uniform float uTime;uniform vec3 uC;
      void main(){vec2 p=(vUv-.5)*9.;float r=length(p);float a=atan(p.y,p.x);
      float glow=exp(-r*r*.35)*.06;vec3 pool=vec3(.42,.36,.34)*exp(-r*r*.22)*.28;
      float ring=smoothstep(.016,0.,abs(r-1.55))*.6;
      float ticks=smoothstep(.012,0.,abs(r-1.72))*step(.86,fract(a*48./6.2831))*.45;
      float sweep=pow(max(0.,cos(a-uTime*.6)),24.)*smoothstep(1.9,1.2,r)*smoothstep(.2,1.4,r)*.06;
      gl_FragColor=vec4(uC*(glow+ring+ticks+sweep)+pool,1.);}`,
  }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.003; ring.renderOrder = 2; scene.add(ring);
  // embers
  const PN = 300, pg = new THREE.BufferGeometry(), pp = new Float32Array(PN * 3), ps = new Float32Array(PN);
  for (let i = 0; i < PN; i++) { const r = 0.8 + Math.random() * 4, a = Math.random() * 6.283; pp.set([Math.cos(a) * r, Math.random() * 3.2, Math.sin(a) * r], i * 3); ps[i] = Math.random(); }
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('seed', new THREE.BufferAttribute(ps, 1));
  const partU = { uTime: { value: 0 }, uPx: { value: 1.5 } };
  scene.add(new THREE.Points(pg, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: partU,
    vertexShader: `attribute float seed;uniform float uTime;uniform float uPx;varying float vA;
      void main(){vec3 p=position;p.y=mod(p.y+uTime*(.05+seed*.08),3.2);p.x+=sin(uTime*.3+seed*20.)*.15;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vA=smoothstep(0.,.5,p.y)*smoothstep(3.2,2.2,p.y)*(.2+.6*fract(seed*7.3));
      gl_PointSize=uPx*(1.2+seed*2.4)*(4./-mv.z);}`,
    fragmentShader: 'varying float vA;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(vec3(1.,.47,.26)*smoothstep(.5,0.,d)*vA,1.);}',
  })));

  const jointGlow = new Float32Array(32), jointTarget = new Float32Array(32);
  const glowMats = []; let JOINTS = [];
  const U = { uX: { value: 1 }, uJ: { value: jointGlow }, uEmber: { value: new THREE.Color('#ff6a3d') }, uT: { value: 0 } };
  function patch(mat) {
    const m = mat.clone();
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uJ[32];varying float vGlow;varying float vWy;')
        .replace('#include <skinning_vertex>', `#include <skinning_vertex>
          vGlow = uJ[int(skinIndex.x)]*skinWeight.x + uJ[int(skinIndex.y)]*skinWeight.y + uJ[int(skinIndex.z)]*skinWeight.z + uJ[int(skinIndex.w)]*skinWeight.w;`)
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vWy = (modelMatrix * vec4(transformed,1.0)).y;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uX;uniform vec3 uEmber;uniform float uT;varying float vGlow;varying float vWy;')
        .replace('#include <opaque_fragment>', `#include <opaque_fragment>
          float g=clamp(vGlow,0.0,1.2);
          vec3 nn=normalize(normal);vec3 vv=normalize(vViewPosition);float fres=pow(1.0-abs(dot(nn,vv)),2.0);
          if(uX>0.001){
            float lam=0.5+0.5*dot(nn,normalize(vec3(0.3,0.8,0.5)));
            vec3 xr=vec3(0.02,0.021,0.026)+vec3(0.055,0.058,0.066)*lam+fres*vec3(0.34,0.36,0.42)*0.75;
            xr+=uEmber*g*(0.5+1.4*fres)*1.5+vec3(1.0,0.8,0.6)*g*g*fres*0.25;
            float scan=smoothstep(0.06,0.0,abs(fract(vWy*0.7-uT*0.35)-0.5))*0.16;
            xr+=vec3(1.0,0.55,0.35)*scan*fres;
            gl_FragColor.rgb=mix(gl_FragColor.rgb,xr,uX);
          }
          float gk=smoothstep(0.05,0.75,g)*(1.0-uX);gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb*0.18+uEmber*(1.1+1.6*fres),gk*0.92);`);
    };
    m.customProgramCacheKey = () => 'flx-app';
    glowMats.push(m); return m;
  }

  const api = { ready: false, playing: true, speed: opts.speed ?? 0.5, loop: false, xray: opts.xray ?? true, selected: null, time: opts.time ?? 1.4, phase: -1 };
  let coach = null, mixer = null, action = null; const bones = {}; const skinned = [];
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(opts.url || '/coach.glb', (gltf) => {
    coach = gltf.scene;
    coach.traverse((o) => {
      if (o.isMesh) { o.frustumCulled = false; o.castShadow = true; o.receiveShadow = true; o.material = patch(o.material); }
      if (o.isSkinnedMesh) { skinned.push(o); if (!JOINTS.length) JOINTS = o.skeleton.bones.map((b) => b.name); }
      if (o.isBone) bones[o.name] = o;
    });
    scene.add(coach);
    mixer = new THREE.AnimationMixer(coach);
    action = mixer.clipAction(gltf.animations[0]); action.setLoop(THREE.LoopRepeat, Infinity); action.play();
    action.time = api.time; mixer.update(0);
    renderer.compile(scene, camera);
    api.ready = true; opts.onReady && opts.onReady();
  }, (e) => opts.onProgress && e.total && opts.onProgress(e.loaded / e.total), (err) => { console.error(err); opts.onError && opts.onError(err); });

  function setTargets(st) {
    jointTarget.fill(0);
    const sideOf = (s) => (s === 'support' ? (st.support === 'both' ? 'both' : st.support) : s === 'free' ? (st.support === 'left' ? 'right' : st.support === 'right' ? 'left' : 'both') : s);
    const add = (gid, side, k) => {
      const sides = side === 'both' ? ['left', 'right'] : [side];
      (GROUP_J[gid] || []).forEach(([jn, w]) => {
        const names = jn.startsWith('S:') ? sides.map((s) => s + jn.slice(2)) : [jn];
        names.forEach((n) => { const j = JOINTS.indexOf(n); if (j >= 0) jointTarget[j] = Math.max(jointTarget[j], w * k); });
      });
    };
    if (api.selected) {
      const p = st.primary.find((x) => x[0] === api.selected) || st.secondary.find((x) => x[0] === api.selected);
      add(api.selected, p ? sideOf(p[1]) : 'both', 1);
    } else if (api.xray) {
      st.secondary.forEach(([g, s]) => add(g, s, 0.3)); st.primary.forEach(([g, s]) => add(g, s, 1));
    }
  }

  /* camera + input */
  const cam = { az: VIEWS.reset[0], el: VIEWS.reset[1], dist: 5.1, ty: 0.62 }, camT = { ...cam };
  let drag = null, moved = 0;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; moved = 0; canvas.setPointerCapture(e.pointerId); host.classList.add('dragging'); });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY }; moved += Math.abs(dx) + Math.abs(dy);
    camT.az -= dx * 0.008; camT.el = Math.min(1.1, Math.max(-0.05, camT.el + dy * 0.005));
  });
  canvas.addEventListener('pointerup', (e) => { host.classList.remove('dragging'); const was = drag; drag = null; if (was && moved < 6) pick(e); });
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); camT.dist = Math.min(8, Math.max(2.4, camT.dist * (1 + Math.sign(e.deltaY) * 0.08))); }, { passive: false });

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(e) {
    if (!coach) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(skinned, false)[0];
    if (!hit) { opts.onPick && opts.onPick(null); return; }
    const g = hit.object.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, acc = {};
    [hit.face.a, hit.face.b, hit.face.c].forEach((v) => { for (let k = 0; k < 4; k++) { const j = si.getComponent(v, k), w = sw.getComponent(v, k); acc[j] = (acc[j] || 0) + w; } });
    const j = +Object.entries(acc).sort((a, b) => b[1] - a[1])[0][0];
    const name = JOINTS[j] || '';
    const part = Object.keys(PICK).find((k) => name === k || name.endsWith(k));
    if (!part) { opts.onPick && opts.onPick(null); return; }
    const st = stateAt(api.time), cands = PICK[part];
    const gid = cands.find((c) => st.primary.some((x) => x[0] === c)) || cands.find((c) => st.secondary.some((x) => x[0] === c)) || cands[0];
    opts.onPick && opts.onPick(gid);
  }

  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    const q = api.quality || 'balanced';
    renderer.setPixelRatio(Math.min(devicePixelRatio, q === 'battery' ? 1 : q === 'high' ? 2 : 1.5));
    renderer.shadowMap.enabled = q !== 'battery';
    renderer.setSize(w, h, false); camera.aspect = w / h;
    cam.fov = w / h < 0.9 ? 34 : 30; camera.fov = cam.fov; camera.updateProjectionMatrix();
    partU.uPx.value = renderer.getPixelRatio() * 1.5;
  }
  new ResizeObserver(resize).observe(host); resize();

  let prev = performance.now(), alive = true;
  function frame(now) {
    if (!alive) return; requestAnimationFrame(frame);
    if (document.hidden || !host.offsetParent) { prev = now; return; }
    const dt = Math.min(0.1, (now - prev) / 1000); prev = now;
    const k = 1 - Math.pow(0.002, dt);
    for (const n in camT) cam[n] += (camT[n] - cam[n]) * k;
    if (mixer) {
      if (api.playing) {
        api.time += dt * api.speed;
        if (api.loop && api.loopSeg) { const [a, b] = api.loopSeg; if (api.time > b || api.time < a) api.time = a; }
        api.time = ((api.time % DUR) + DUR) % DUR;
      }
      action.time = api.time; mixer.update(0);
      const st = stateAt(api.time);
      if (st.phase !== api.phase) { api.phase = st.phase; opts.onPhase && opts.onPhase(st); }
      setTargets(st);
      for (let j = 0; j < 32; j++) jointGlow[j] += (jointTarget[j] - jointGlow[j]) * (1 - Math.pow(0.003, dt));
      opts.onTime && opts.onTime(api.time);
    }
    U.uX.value += ((api.xray && !api.selected ? 1 : 0) - U.uX.value) * (1 - Math.pow(0.02, dt));
    U.uT.value = now / 1000; stageU.uTime.value = now / 1000; partU.uTime.value = now / 1000;
    const tilt = Math.max(-0.05, cam.el);
    camera.position.set(Math.sin(cam.az) * Math.cos(tilt) * cam.dist, cam.ty + Math.sin(tilt) * cam.dist, Math.cos(cam.az) * Math.cos(tilt) * cam.dist);
    camera.lookAt(0, cam.ty, 0);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  Object.assign(api, {
    play() { api.playing = true; opts.onPlay && opts.onPlay(true); },
    pause() { api.playing = false; opts.onPlay && opts.onPlay(false); },
    toggle() { api.playing ? api.pause() : api.play(); },
    setSpeed(s) { api.speed = s; },
    setTime(t) { api.time = ((t % DUR) + DUR) % DUR; if (api.loop) api.setLoop(true); },
    seekPhase(i) { i = ((i % 8) + 8) % 8; const s = SEG.find((x) => x[0] === i); api.time = s[1] + 0.02; if (api.loop) api.loopSeg = [s[1], s[2]]; },
    setLoop(on) { api.loop = on; const s = SEG.find((x) => x[0] === stateAt(api.time).phase && api.time >= x[1] - 0.001 && api.time <= x[2] + 0.02) || SEG.find((x) => x[0] === stateAt(api.time).phase); api.loopSeg = on ? [s[1], s[2]] : null; },
    setView(v) { const [az, el] = VIEWS[v] || VIEWS.reset; let d = az - camT.az; d = ((d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; camT.az += d; camT.el = el; if (v === 'reset') camT.dist = 5.1; },
    setXray(on) { api.xray = on; },
    select(gid) { api.selected = gid; },
    setQuality(q) { api.quality = q; resize(); },
    dispose() { alive = false; renderer.dispose(); },
    state() { return { time: api.time, playing: api.playing, speed: api.speed, phase: api.phase, az: camT.az, dist: camT.dist, selected: api.selected }; },
  });
  return api;
}
