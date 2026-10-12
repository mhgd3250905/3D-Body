// Upright muscle mannequin: the app's CC0 reference body with its per-pixel
// functional muscle panels (app/scene/src/legacy/muscle-map.js + muscle-material.js,
// imported unchanged). mode 'full' = rotatable explorer; 'mini' = front/back
// thumbnail synced to the current phase (like the app's 同步肌群 minimap).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as MM from '../../app/scene/src/legacy/muscle-map.js';
import { applyFunctionalSurface, setFunctionalFocus } from '../../app/scene/src/muscle-material.js';

let glbPromise = null;
async function loadBody(url) {
  glbPromise ??= (async () => {
    const res = await fetch(url); if (!res.ok) throw new Error('mannequin_load_failed');
    let buf = await res.arrayBuffer(); const b = new Uint8Array(buf);
    if (b[0] === 0x1f && b[1] === 0x8b) {
      if (!('DecompressionStream' in window)) throw new Error('no_decompression');
      buf = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    }
    return buf;
  })();
  const buf = await glbPromise;
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buf.slice(0), '/');
}

export function createMannequin(host, { mode = 'full', groups, onPick, onReady, url = '/mannequin.glb.gz' } = {}) {
  const canvas = document.createElement('canvas'); canvas.className = 'gl'; host.prepend(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xeaf2ff, 0x2a2930, 1.7));
  const key = new THREE.DirectionalLight(0xfff2e4, 2.6); key.position.set(-2, 3, 4); scene.add(key);
  const back = new THREE.DirectionalLight(0xe7ecff, 1.8); back.position.set(2, 2, -3); scene.add(back);
  const rim = new THREE.DirectionalLight(0xff6a3d, mode === 'full' ? 1.6 : 0.8); rim.position.set(-3, 1.5, -2.5); scene.add(rim);
  const U = MM.createMuscleUniforms();
  U.mmMulti.value = 1; U.mmReveal.value = 1; U.mmTime.value = 0.654;
  U.mmBase.value.set('#7d8796'); U.mmSkin.value.set('#6f7886'); U.mmGroove.value.set('#4a5262');
  U.mmFocusSide = { value: 0 }; U.mmFocusColour = { value: new THREE.Color('#ff7a4f') }; U.mmFocusInk = { value: new THREE.Color('#b0553a') };
  const colourOf = Object.fromEntries(groups.map((g) => [g.id, g.colour]));
  const meshes = []; let model = null;
  const api = { ready: false, selected: null, side: 'both' };
  const camF = new THREE.PerspectiveCamera(26, 0.5, 0.02, 20), camB = camF.clone();
  const orbit = { az: 0, azT: 0, el: 0.05, dist: mode === 'full' ? 4.6 : 4.1 };
  let dirty = true;

  loadBody(url).then(({ scene: m }) => {
    model = m; scene.add(model);
    model.traverse((o) => {
      if (!o.isMesh) return;
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, metalness: 0 });
      applyFunctionalSurface(mat, U, {}); o.material = mat; meshes.push(o);
    });
    model.updateMatrixWorld(true);
    api.ready = true; apply(); onReady && onReady();
  }).catch((e) => { console.error(e); host.classList.add('gl-failed'); });

  let phaseSel = null;
  function apply() {
    const items = [];
    const push = (gid, level, side, dim = 0) => (MM.resolveGroup(gid)?.muscles || []).forEach((mu) => items.push({ muscle: mu, level: MM.resolveGroup(gid).deep && level !== 'secondary' ? 'deep' : level, side, colour: colourOf[gid] || '#ff6a3d', dim }));
    if (mode === 'mini' && phaseSel) {
      phaseSel.secondary.forEach(([g, s]) => push(g, 'secondary', s));
      phaseSel.primary.forEach(([g, s]) => push(g, 'primary', s));
    } else if (mode === 'full') {
      groups.forEach((g) => { if (g.id !== api.selected) push(g.id, 'secondary', 'both', api.selected ? 0.75 : 0.15); });
      if (api.selected) push(api.selected, 'primary', api.side);
    }
    MM.setMuscleSelection(U, items);
    if (api.selected && mode === 'full') setFunctionalFocus(U, MM.resolveGroup(api.selected)?.muscles || [], api.side); else setFunctionalFocus(U, [], 'both');
    dirty = true;
  }

  // input (full mode)
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), local = new THREE.Vector3();
  let drag = null, moved = 0;
  if (mode === 'full') {
    canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX }; moved = 0; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - drag.x; drag.x = e.clientX; moved += Math.abs(dx); orbit.azT -= dx * 0.01; dirty = true; });
    canvas.addEventListener('pointerup', (e) => { const was = drag; drag = null; if (was && moved < 6) pickAt(e, camF, canvas.getBoundingClientRect()); });
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); orbit.dist = Math.min(7, Math.max(2.2, orbit.dist * (1 + Math.sign(e.deltaY) * 0.08))); dirty = true; }, { passive: false });
  } else {
    canvas.addEventListener('click', (e) => {
      const r = canvas.getBoundingClientRect(), half = r.width / 2, s = e.clientX - r.left < half ? 0 : 1;
      pickAt(e, s ? camB : camF, { left: r.left + half * s, top: r.top, width: half, height: r.height });
    });
  }
  function pickAt(e, camera, r) {
    if (!api.ready) return;
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    for (const hit of ray.intersectObjects(meshes)) {
      const mu = MM.muscleAt(hit.object.worldToLocal(local.copy(hit.point)), 1.69); if (!mu) continue;
      const cands = groups.filter((g) => (MM.resolveGroup(g.id)?.muscles || []).includes(mu.id)).map((g) => g.id);
      let gid = cands[0];
      if (phaseSel) gid = cands.find((c) => phaseSel.primary.some((x) => x[0] === c)) || cands.find((c) => phaseSel.secondary.some((x) => x[0] === c)) || gid;
      if (gid) { onPick && onPick(gid, mu); return; }
    }
    onPick && onPick(null);
  }

  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h, false); dirty = true;
  }
  new ResizeObserver(resize).observe(host); resize();
  let alive = true;
  function frame() {
    if (!alive) return; requestAnimationFrame(frame);
    if (!api.ready || document.hidden || !host.offsetParent) return;
    orbit.az += (orbit.azT - orbit.az) * 0.14;
    if (Math.abs(orbit.azT - orbit.az) > 0.0005) dirty = true;
    if (!dirty) return; dirty = false;
    const w = host.clientWidth, h = host.clientHeight;
    if (mode === 'full') {
      camF.aspect = w / h; camF.fov = w / h < 0.7 ? 34 : 26; camF.updateProjectionMatrix();
      camF.position.set(Math.sin(orbit.az) * orbit.dist, 0.86 + orbit.el * orbit.dist, Math.cos(orbit.az) * orbit.dist); camF.lookAt(0, 0.86, 0);
      renderer.setScissorTest(false); renderer.setViewport(0, 0, w, h); renderer.render(scene, camF);
    } else {
      [camF, camB].forEach((c, i) => {
        c.aspect = (w / 2) / h; c.fov = 28; c.updateProjectionMatrix();
        c.position.set(0, 0.85, i ? -orbit.dist : orbit.dist); c.lookAt(0, 0.85, 0);
        renderer.setScissorTest(true); renderer.setScissor(i * w / 2, 0, w / 2, h); renderer.setViewport(i * w / 2, 0, w / 2, h);
        renderer.render(scene, c);
      });
    }
  }
  requestAnimationFrame(frame);
  Object.assign(api, {
    select(gid, side = 'both') { api.selected = gid; api.side = side; apply(); },
    setPhase(st) { phaseSel = st; if (mode === 'mini') apply(); },
    setView(v) { const t = v === 'back' ? Math.PI : v === 'side' ? Math.PI / 2 : 0; let d = t - orbit.azT; d = ((d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; orbit.azT += d; if (v === 'reset') orbit.dist = 4.6; dirty = true; },
    get az() { return orbit.azT; },
    dispose() { alive = false; renderer.dispose(); },
  });
  return api;
}
