import * as THREE from 'three';
import * as MM from './legacy/muscle-map.js';
import { GROUPS, phaseAt, phaseTicks, phaseEmphasisItems } from './phase.js';
import { loadOfflineGlb } from './assets.js';
import { applyFunctionalSurface, setFunctionalFocus } from './muscle-material.js';
import { thumbnailDensity } from './thumbnail.js';

// Two views of the supplied mature CC0 mannequin. This remains a static
// teaching reference: phase colors follow Snow's clock, not its skeleton.
// Both views share the main WebGL context and one copy of the model.
export async function createPhaseMap(player, onSelect) {
  const { scene: model } = await loadOfflineGlb('./anatomy/mannequin-reference.meshopt.glb.gz');
  const scene = new THREE.Scene(); scene.add(model);
  scene.add(new THREE.HemisphereLight(0xeaf2ff, 0x34333d, 2));
  const key = new THREE.DirectionalLight(0xfff2e4, 3); key.position.set(-2, 3, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe7ecff, 2); fill.position.set(2, 2, -3); scene.add(fill);
  const uniforms = MM.createMuscleUniforms(); uniforms.mmMulti.value = 1; uniforms.mmReveal.value = 1; uniforms.mmTime.value = 0.654;
  uniforms.mmBase.value.set('#818b99'); uniforms.mmSkin.value.copy(uniforms.mmBase.value); uniforms.mmGroove.value.set('#596273');
  uniforms.mmHomeEmphasis = { value: 1 }; uniforms.mmEffort = { value: 0 };
  const strokeDensity = { value: 2 };
  const meshes = [], materials = new Set();
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    for (const material of [].concat(mesh.material)) material.dispose();
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0 });
    applyFunctionalSurface(material, uniforms, { thumbnail: true, density: strokeDensity }); mesh.material = material; meshes.push(mesh); materials.add(material);
  });
  model.updateMatrixWorld(true);
  const cameras = [1, -1].map(sign => {
    const camera = new THREE.PerspectiveCamera(26, 0.5, 0.02, 20);
    camera.position.set(0, 0.845, sign * 4.0); camera.lookAt(0, 0.845, 0); camera.updateMatrixWorld(true); return camera;
  });
  const panel = document.createElement('aside'); panel.className = 'phase-map'; panel.setAttribute('aria-label', '随动作阶段同步的肌群正面和背面定位图');
  // Keep its layout measurable without exposing an empty card during GLB or
  // shader initialization. Reveal only after the cached canvas is composed.
  panel.style.visibility = 'hidden';
  panel.innerHTML = '<header><i></i><span>同步发力</span></header><div class="phase-map-view"><span>正面</span><span>背面</span></div><div class="phase-map-legend"></div>';
  player.container.append(panel);
  const view = panel.querySelector('.phase-map-view'), legend = panel.querySelector('.phase-map-legend');
  // Keep one WebGL context. Render each view to a complete small MSAA target
  // at independent density. Cache two local-emphasis endpoints per phase;
  // their 2D blend follows the action without GPU readbacks every frame.
  const thumbnail = document.createElement('canvas'); thumbnail.setAttribute('aria-hidden', 'true'); view.prepend(thumbnail);
  const thumbnailContext = thumbnail.getContext('2d');
  const effortFrames = [document.createElement('canvas'), document.createElement('canvas')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), local = new THREE.Vector3();
  let source = null, hidden = false, legendItems = [], target = null, renderKey = null, renderCount = 0, focus = null;
  let paintKey = null, paintEffort = 0;
  const fullBounds = new THREE.Box3().setFromObject(model);
  const shortNames = { 'hip-abductors': '臀中肌', abs: '腹直肌', 'rotator-cuff': '肩袖', forearms: '前臂', scapular: '肩胛肌群', adductors: '内收肌' };
  function pickSurface(x, y, camera, rect) {
    ndc.set((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const phase = phaseAt(player.time);
    for (const hit of ray.intersectObjects(meshes)) {
      const muscle = MM.muscleAt(hit.object.worldToLocal(local.copy(hit.point)), 1.69); if (!muscle) continue;
      const candidates = Object.entries(MM.GROUP_MUSCLES).filter(([id, definition]) => GROUPS[id] && definition.muscles.includes(muscle.id)).map(([id]) => id);
      const groupId = candidates.find(id => phase.items.some(item => item.groupId === id && (item.side === 'both' || item.side === muscle.side))) ?? candidates[0];
      if (groupId) return { groupId, side: muscle.side, panelId: muscle.id };
    }
    return null;
  }
  function select(event) {
    const r = view.getBoundingClientRect(), half = r.width / 2;
    const side = event.clientX - r.left < half ? 0 : 1;
    const hit = pickSurface(event.clientX, event.clientY, cameras[side], { left: r.left + half * side, top: r.top, width: half, height: r.height });
    if (hit) onSelect(hit.groupId);
  }
  view.addEventListener('click', select);
  function emphasisItems(phase) {
    return phaseEmphasisItems(phase.items);
  }
  function applySelection(phase, groupId = null) {
    const items = groupId ? [...phase.items] : emphasisItems(phase), selected = [];
    if (groupId && !items.some(item => item.groupId === groupId)) items.push({ groupId, side: 'both', level: 'primary', colour: GROUPS[groupId].colour });
    for (const item of items) {
      if (groupId && item.groupId !== groupId) continue;
      const group = MM.resolveGroup(item.groupId); if (!group) continue;
      for (const muscle of group.muscles) selected.push({ muscle, side: item.side, colour: item.colour,
        level: group.deep && item.level === 'primary' ? 'deep' : item.level,
        dim: groupId ? item.groupId === groupId ? 0 : 0.85 : item.level === 'primary' ? 0 : 0.5 });
    }
    MM.setMuscleSelection(uniforms, selected);
    uniforms.mmHomeEmphasis.value = groupId ? 0 : 1;
    uniforms.mmEffort.value = 0;
    setFunctionalFocus(uniforms, groupId ? MM.resolveGroup(groupId)?.muscles ?? [] : [], items.find(item => item.groupId === groupId)?.side);
  }
  function setDetail(groupId, phase) { focus = groupId; applySelection(phase, groupId); renderKey = null; refreshEnvironment(); }
  function restorePhase() { focus = null; source = null; renderKey = null; setFunctionalFocus(uniforms, []); }
  function refreshEnvironment() { scene.environment = player.scene.environment; }
  function withThumbnailDensity(density, render) {
    const previous = strokeDensity.value; strokeDensity.value = density;
    try { return render(); } finally { strokeDensity.value = previous; }
  }
  function render() {
    if (hidden) return false;
    const phase = phaseAt(player.time);
    if (phase.source !== source) {
      source = phase.source; applySelection(phase);
      // The colored regions and legend describe exactly the same three
      // teaching priorities, instead of also lighting every secondary group.
      legendItems = emphasisItems(phase);
      legend.replaceChildren();
      for (const item of legendItems) {
        const button = document.createElement('button'); button.type = 'button';
        button.dataset.groupId = item.groupId; button.setAttribute('aria-label', '查看' + item.label);
        const dot = document.createElement('i'); dot.style.background = item.colour;
        button.append(dot, shortNames[item.groupId] ?? item.label); button.addEventListener('click', () => onSelect(item.groupId)); legend.append(button);
      }
    }
    const r = view.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return false;
    const renderer = player.renderer, density = thumbnailDensity(player.quality);
    const width = Math.ceil(r.width / 2 * density), height = Math.ceil(r.height * density);
    strokeDensity.value = width / (r.width / 2);
    const key = [phase.source, width, height, player.quality, renderer.toneMappingExposure].join(':');
    if (key !== renderKey || scene.environment !== player.scene.environment) {
      scene.environment = player.scene.environment;
      if (!target) target = new THREE.WebGLRenderTarget(width, height, { samples: Math.min(4, renderer.capabilities.maxSamples), stencilBuffer: false });
      else target.setSize(width, height);
      if (thumbnail.width !== width * 2 || thumbnail.height !== height) { thumbnail.width = width * 2; thumbnail.height = height; }
      const previous = { target: renderer.getRenderTarget(), viewport: renderer.getViewport(new THREE.Vector4()), scissor: renderer.getScissor(new THREE.Vector4()),
        scissorTest: renderer.getScissorTest(), color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha(), autoClear: renderer.autoClear };
      const pixels = new Uint8Array(width * height * 4), flipped = new Uint8ClampedArray(pixels.length);
      try {
        renderer.autoClear = true; renderer.setClearColor(0x000000, 0);
        for (let effort = 0; effort < effortFrames.length; effort++) {
          const frame = effortFrames[effort];
          frame.width = width * 2; frame.height = height;
          const context = frame.getContext('2d');
          uniforms.mmEffort.value = effort;
          for (let i = 0; i < 2; i++) {
            cameras[i].aspect = r.width / 2 / r.height; cameras[i].updateProjectionMatrix();
            // Render targets use physical pixels independently of stage DPR.
            renderer.setRenderTarget(target); renderer.render(scene, cameras[i]);
            renderer.readRenderTargetPixels(target, 0, 0, width, height, pixels);
            for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
              const from = ((height - 1 - y) * width + x) * 4, to = (y * width + x) * 4, alpha = pixels[from + 3];
              // ImageData expects straight alpha; undo MSAA premultiplication.
              const scale = alpha ? 255 / alpha : 0;
              flipped[to] = Math.min(255, pixels[from] * scale); flipped[to + 1] = Math.min(255, pixels[from + 1] * scale);
              flipped[to + 2] = Math.min(255, pixels[from + 2] * scale); flipped[to + 3] = alpha;
            }
            context.putImageData(new ImageData(flipped, width, height), i * width, 0);
          }
          renderCount++;
        }
        renderKey = key; paintKey = null;
      } finally {
        uniforms.mmEffort.value = 0;
        renderer.setRenderTarget(previous.target); renderer.setViewport(previous.viewport); renderer.setScissor(previous.scissor);
        renderer.setScissorTest(previous.scissorTest); renderer.setClearColor(previous.color, previous.alpha); renderer.autoClear = previous.autoClear;
      }
    }
    // This is visual emphasis, not a force estimate. Derive it only from the
    // existing animation position so seeking, slow motion and pause agree.
    const start = phaseTicks.find(tick => tick.phase === phase.source)?.time ?? 0;
    const end = phaseTicks.find(tick => tick.time > start)?.time ?? player.period;
    const progress = THREE.MathUtils.clamp((player.time - start) / Math.max(0.001, end - start), 0, 1);
    const effort = reducedMotion.matches ? 0.75 : 0.25 + 0.75 * Math.sin(Math.PI * progress) ** 2;
    const step = Math.round(effort * 24);
    const nextPaintKey = `${renderKey}:${step}`;
    if (nextPaintKey === paintKey) return true;
    paintEffort = step / 24;
    // Weighted additive composition preserves antialiased edge coverage.
    thumbnailContext.globalCompositeOperation = 'copy'; thumbnailContext.globalAlpha = 1 - paintEffort;
    thumbnailContext.drawImage(effortFrames[0], 0, 0);
    thumbnailContext.globalCompositeOperation = 'lighter'; thumbnailContext.globalAlpha = paintEffort;
    thumbnailContext.drawImage(effortFrames[1], 0, 0);
    thumbnailContext.globalCompositeOperation = 'source-over'; thumbnailContext.globalAlpha = 1;
    paintKey = nextPaintKey;
    panel.style.visibility = '';
    return true;
  }
  function setHidden(value) { hidden = value; panel.hidden = value; player.dirty = true; }
  function releaseGpu() { target?.dispose(); target = null; renderKey = null; for (const mesh of meshes) mesh.geometry.dispose(); for (const material of materials) material.dispose(); }
  return { render, setHidden, releaseGpu, scene, setDetail, restorePhase, refreshEnvironment, withThumbnailDensity, pickSurface, getFullBounds: () => fullBounds.clone(),
    getState: () => ({ phase: source, hidden, focus, views: ['front', 'back'], legend: legendItems.map(item => ({ groupId: item.groupId, label: shortNames[item.groupId] ?? item.label })), referencePose: 'static CC0 mannequin',
    resolution: [thumbnail.width, thumbnail.height], renderCount, samples: target?.samples ?? 0, emphasis: paintEffort }),
    dispose() { releaseGpu(); view.removeEventListener('click', select); panel.remove(); } };
}
