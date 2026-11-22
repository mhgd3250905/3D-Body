import * as THREE from 'three';
import * as MM from './legacy/muscle-map.js';
import { GROUPS, phaseAt, phaseTicks, phaseEmphasisItems } from './phase.js';
import { loadOfflineGlb } from './assets.js';
import { applyFunctionalSurface, setFunctionalFocus } from './muscle-material.js';
import { applyMannequinToon, createMannequinOutlineMaterial } from './mannequin-toon.js';
import { thumbnailDensity } from './thumbnail.js';
import { sceneStrings, groupLabel } from './localization.js';

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
  uniforms.mmHubBottom = { value: 0 };
  uniforms.mmHubFraming = { value: 0 };
  const strokeDensity = { value: 2 };
  const meshes = [], materials = new Set();
  const outlineMaterial = createMannequinOutlineMaterial(uniforms, strokeDensity);
  materials.add(outlineMaterial);
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    for (const material of [].concat(mesh.material)) material.dispose();
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0 });
    applyFunctionalSurface(material, uniforms, { thumbnail: true, density: strokeDensity });
    applyMannequinToon(material);
    mesh.material = material; meshes.push(mesh); materials.add(material);
  });
  for (const mesh of meshes) {
    const outline = new THREE.Mesh(mesh.geometry, outlineMaterial);
    outline.userData.mannequinOutline = true;
    // Crop blending uses the same gate as the body. Paint ink beneath it.
    outline.renderOrder = -1;
    outline.raycast = () => {};
    mesh.add(outline);
  }
  model.updateMatrixWorld(true);
  const cameras = [1, -1].map(sign => {
    const camera = new THREE.PerspectiveCamera(26, 0.5, 0.02, 20);
    camera.position.set(0, 0.845, sign * 4.0); camera.lookAt(0, 0.845, 0); camera.updateMatrixWorld(true); return camera;
  });
  const motion = document.createElement('div'); motion.className = 'phase-map-motion';
  const shadow = document.createElement('div'); shadow.className = 'phase-map-shadow'; shadow.setAttribute('aria-hidden', 'true');
  const panel = document.createElement('aside'); panel.className = 'phase-map'; panel.setAttribute('aria-label', '随动作阶段同步的肌群正面和背面定位图');
  // Keep its layout measurable without exposing an empty card during GLB or
  // shader initialization. Reveal only after the cached canvas is composed.
  motion.style.visibility = 'hidden';
  panel.innerHTML = '<header><i></i><span>同步发力</span></header><div class="phase-map-view"></div>';
  const legends = document.createElement('div');
  legends.style.position = 'relative';
  panel.append(legends);
  motion.append(shadow, panel);
  player.container.append(motion);
  const view = panel.querySelector('.phase-map-view');
  function newCanvas() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;opacity:0;visibility:hidden';
    return canvas;
  }
  // Both the continuously rendered fallback and the atlas use the same
  // renderer and two endpoint rasters, including matching alpha blending.
  const thumbnail = newCanvas();
  view.append(thumbnail);
  const thumbnailContext = thumbnail.getContext('2d');
  const effortFrames = [document.createElement('canvas'), document.createElement('canvas')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), local = new THREE.Vector3();
  let source = null, hidden = false, legendItems = [], target = null, renderCount = 0, focus = null;
  let rasterKey = null, rasterEnvironment = null;
  let paintKey = null, paintEffort = 0;
  const snapshots = new Map(), legendLayers = new Map();
  const ticks = phaseTicks.map(tick => ({ ...tick, picture: phaseAt(tick.time) }));
  const capacity = 24 * 1024 * 1024;
  let snapshotContext = { theme: document.documentElement.dataset.theme ?? 'dark', language: '', dataVersion: '', day: '' };
  let cacheShape = null, legendShape = null, completeTheme = null;
  let snapshotFrame = null, scheduleEnabled = false, snapshotSingleTheme = false;
  let activeCanvas = null, activeLegend = null, shownPhase = null;
  let underCanvas = null, underLegend = null;
  let livePaints = 0, snapshotBuilt = 0, snapshotHits = 0, legendBuilds = 0;
  let observedTime = NaN, interactionUntil = 0;
  const transitions = new WeakMap();
  const retired = new WeakSet();
  let chromeMotion = null;
  let viewSize = null;
  const viewObserver = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (viewSize?.width === width && viewSize.height === height) return;
    viewSize = { width, height };
    if (!hidden) player.requestRedraw();
  });
  viewObserver.observe(view);
  const fullBounds = new THREE.Box3().setFromObject(model);
  const shortNames = { 'hip-abductors': '臀中肌', abs: '腹直肌', 'rotator-cuff': '肩袖', forearms: '前臂', scapular: '中下斜方 · 菱形', adductors: '内收肌' };
  function pickSurface(x, y, camera, rect, phase = phaseAt(player.time)) {
    ndc.set((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1);
    ray.setFromCamera(ndc, camera);
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
    const hit = pickSurface(event.clientX, event.clientY, cameras[side],
      { left: r.left + half * side, top: r.top, width: half, height: r.height },
      shownPhase ?? phaseAt(player.time));
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
      for (const muscle of group.muscles) selected.push({ muscle, side: groupId ? 'both' : item.side, colour: item.colour,
        level: group.deep && item.level === 'primary' ? 'deep' : item.level,
        dim: groupId ? item.groupId === groupId ? 0 : 0.85 : item.level === 'primary' ? 0 : 0.5 });
    }
    MM.setMuscleSelection(uniforms, selected);
    uniforms.mmHomeEmphasis.value = groupId ? 0 : 1;
    uniforms.mmEffort.value = 0;
    // The standing reference teaches the whole paired group; the motion
    // figure and the home phase map retain their phase-specific side.
    setFunctionalFocus(uniforms, groupId ? MM.resolveGroup(groupId)?.muscles ?? [] : [], groupId ? 'both' : undefined);
  }
  function setDetail(groupId, phase) { focus = groupId; applySelection(phase, groupId); refreshEnvironment(); }
  function setHubCrop(bottom) {
    uniforms.mmHubBottom.value = bottom;
    if (uniforms.mmHubFraming.value === 1) return;
    uniforms.mmHubFraming.value = 1;
    for (const mesh of meshes) {
      mesh.material.transparent = true;
      mesh.material.needsUpdate = true;
    }
  }
  function clearHubCrop() {
    if (uniforms.mmHubFraming.value === 0) return;
    uniforms.mmHubFraming.value = 0;
    for (const mesh of meshes) {
      mesh.material.transparent = false;
      mesh.material.needsUpdate = true;
    }
  }
  function restorePhase() { focus = null; setFunctionalFocus(uniforms, []); }
  function refreshEnvironment() { scene.environment = player.scene.environment; }
  function withThumbnailDensity(density, render) {
    const previous = strokeDensity.value; strokeDensity.value = density;
    try { return render(); } finally { strokeDensity.value = previous; }
  }
  function legendFor(phase) {
    if (!legendLayers.has(phase.source)) {
      const items = emphasisItems(phase);
      const layer = document.createElement('div');
      layer.className = 'phase-map-legend';
      layer.style.cssText = 'position:absolute;top:0;left:0;right:0;opacity:0;pointer-events:none';
      layer.inert = true;
      layer.setAttribute('aria-hidden', 'true');
      for (const item of items) {
        const name = groupLabel(item.groupId, shortNames[item.groupId] ?? item.label);
        const button = document.createElement('button'); button.type = 'button';
        button.dataset.groupId = item.groupId; button.setAttribute('aria-label', sceneStrings.viewLabels?.[item.groupId] ?? '查看' + name);
        const dot = document.createElement('i'); dot.style.background = item.colour;
        const text = document.createElement('span');
        text.textContent = name;
        button.title = name;
        button.append(dot, text); button.addEventListener('click', () => onSelect(item.groupId)); layer.append(button);
      }
      legends.append(layer);
      const height = layer.getBoundingClientRect().height + (parseFloat(getComputedStyle(layer).marginTop) || 0);
      legendLayers.set(phase.source, { layer, items, height });
      legendBuilds++;
    }
    return legendLayers.get(phase.source);
  }

  function dimensions() {
    // The cached raster uses layout size, unaffected by the route transform.
    const r = viewSize?.width > 0 && viewSize.height > 0 ? viewSize : view.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return null;
    const renderer = player.renderer, density = thumbnailDensity(player.quality);
    const width = Math.ceil(r.width / 2 * density), height = Math.ceil(r.height * density);
    const dpr = window.devicePixelRatio || 1;
    const bytes = width * 2 * height * 4;
    return {
      width, height, ratio: r.width / 2 / r.height, stroke: width / (r.width / 2), bytes,
      legendKey: r.width + ':' + r.height,
      plannedBytes: Math.max(bytes, Math.ceil(r.width * dpr) * Math.ceil(r.height * dpr) * 4),
      key: [width, height, r.width, r.height, player.quality, renderer.toneMappingExposure,
        player.scene.environment?.uuid ?? '', dpr, reducedMotion.matches].join(':'),
    };
  }

  function ensureRasters(phase, size) {
    const renderer = player.renderer, { width, height } = size;
    const key = phase.source + ':' + size.key;
    if (key !== rasterKey || rasterEnvironment !== player.scene.environment) {
      applySelection(phase);
      strokeDensity.value = size.stroke;
      scene.environment = player.scene.environment;
      if (!target) target = new THREE.WebGLRenderTarget(width, height, { samples: Math.min(4, renderer.capabilities.maxSamples), stencilBuffer: false });
      else target.setSize(width, height);
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
            cameras[i].aspect = size.ratio; cameras[i].updateProjectionMatrix();
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
        rasterKey = key;
        rasterEnvironment = scene.environment;
      } finally {
        uniforms.mmEffort.value = 0;
        renderer.setRenderTarget(previous.target); renderer.setViewport(previous.viewport); renderer.setScissor(previous.scissor);
        renderer.setScissorTest(previous.scissorTest); renderer.setClearColor(previous.color, previous.alpha); renderer.autoClear = previous.autoClear;
      }
    }
  }

  function effortAt(time, phase) {
    const start = phaseTicks.find(tick => tick.phase === phase.source)?.time ?? 0;
    const end = phaseTicks.find(tick => tick.time > start)?.time ?? player.period;
    const progress = THREE.MathUtils.clamp((time - start) / Math.max(0.001, end - start), 0, 1);
    const effort = reducedMotion.matches ? .75 : .25 + .75 * Math.sin(Math.PI * progress) ** 2;
    return Math.round(effort * 24) / 24;
  }

  function paint(context, effort) {
    // The old weighted composition is preserved for static tick parity.
    context.globalCompositeOperation = 'copy'; context.globalAlpha = 1 - effort;
    context.drawImage(effortFrames[0], 0, 0);
    context.globalCompositeOperation = 'lighter'; context.globalAlpha = effort;
    context.drawImage(effortFrames[1], 0, 0);
    context.globalCompositeOperation = 'source-over'; context.globalAlpha = 1;
  }

  function retire(layer) {
    if (layer === activeCanvas || layer === activeLegend || layer === underCanvas || layer === underLegend ||
        transitions.has(layer)) retired.add(layer);
    else layer.remove();
  }

  function retireSnapshots(predicate = () => true) {
    for (const [key, snapshot] of snapshots) if (predicate(snapshot)) {
      snapshots.delete(key);
      completeTheme = null;
      retire(snapshot.canvas);
    }
  }

  function clearLegends() {
    for (const { layer } of legendLayers.values()) retire(layer);
    legendLayers.clear();
  }

  function fade(layer, from, to, smooth, finished) {
    const previous = transitions.get(layer);
    if (previous) {
      previous.cancel();
      transitions.delete(layer);
    }
    layer.style.opacity = to;
    if (!smooth || typeof layer.animate !== 'function') { finished?.(); return; }
    const animation = layer.animate([{ opacity: from }, { opacity: to }], { duration: 120, easing: 'ease-in-out' });
    transitions.set(layer, animation);
    animation.finished.then(() => {
      if (transitions.get(layer) !== animation) return;
      transitions.delete(layer);
      finished?.();
    }, () => {});
  }

  function deactivate(layer, isLegend) {
    layer.removeAttribute('data-phase-layer-visible');
    if (isLegend) {
      layer.style.pointerEvents = 'none';
      layer.inert = true;
      layer.setAttribute('aria-hidden', 'true');
    }
  }

  function hideLayer(layer, isLegend) {
    deactivate(layer, isLegend);
    fade(layer, 0, 0, false);
    if (!isLegend) layer.style.visibility = 'hidden';
    if (retired.has(layer)) layer.remove();
  }

  function showLayer(next, previous, isLegend = false, smooth = true) {
    if (next === previous) return;
    const held = isLegend ? underLegend : underCanvas;
    let under = held ?? previous;
    if (held && previous) hideLayer(previous, isLegend);
    if (under === next) under = null;

    // Keep one fully painted layer underneath while the new bitmap fades
    // over it. If a scrub selects again before it completes, the same
    // underneath image survives until the next selection is opaque.
    if (under) {
      deactivate(under, isLegend);
      under.style.zIndex = '1';
    }
    if (isLegend) underLegend = under;
    else underCanvas = under;

    next.style.visibility = 'visible';
    next.style.zIndex = '2';
    next.setAttribute('data-phase-layer-visible', '');
    if (isLegend) {
      next.style.pointerEvents = '';
      next.inert = false;
      next.removeAttribute('aria-hidden');
    }
    fade(next, 0, 1, !!under && smooth && !reducedMotion.matches, () => {
      if (!under) return;
      hideLayer(under, isLegend);
      if (isLegend) underLegend = null;
      else underCanvas = null;
    });
  }

  function present(canvas, phase, effort, smooth = true) {
    const { layer, items, height } = legendFor(phase);
    showLayer(canvas, activeCanvas, false, smooth);
    if (layer !== activeLegend) {
      legends.style.height = height + 'px';
      showLayer(layer, activeLegend, true, smooth);
    }
    activeCanvas = canvas;
    activeLegend = layer;
    shownPhase = phase;
    source = phase.source;
    legendItems = items;
    paintEffort = effort;
    motion.style.visibility = '';
  }

  function updateCacheShape(size) {
    if (legendShape !== size.legendKey) {
      legendShape = size.legendKey;
      clearLegends();
    }
    if (cacheShape === size.key) return;
    cacheShape = size.key;
    retireSnapshots();
    snapshotSingleTheme = size.plannedBytes * ticks.length * 2 > capacity;
  }

  function cacheKey(phaseId) {
    const { theme, language, dataVersion, day } = snapshotContext;
    return JSON.stringify([phaseId, theme, language, dataVersion, day]);
  }

  function currentTicks() {
    const index = Math.max(0, ticks.findIndex(tick => tick.phase === phaseAt(player.time).source));
    const order = [ticks[index]];
    for (let offset = 1; order.length < ticks.length; offset++) {
      order.push(ticks[(index + offset) % ticks.length]);
      if (order.length === ticks.length) break;
      order.push(ticks[(index - offset + ticks.length) % ticks.length]);
    }
    return order;
  }

  function nextTick(size) {
    if (completeTheme === snapshotContext.theme) return null;
    const order = currentTicks();
    const count = Math.min(order.length, Math.floor(capacity / size.plannedBytes));
    const allowed = order.slice(0, count);
    const keys = new Set(allowed.map(tick => cacheKey(tick.phase)));
    if (snapshotSingleTheme) retireSnapshots(snapshot =>
      snapshot.theme !== snapshotContext.theme || !keys.has(snapshot.key));
    const next = allowed.find(tick => !snapshots.has(cacheKey(tick.phase)));
    if (!next && count === ticks.length) completeTheme = snapshotContext.theme;
    return next;
  }

  function refreshInteraction() {
    if (observedTime !== player.time) {
      if (!player.playing && Number.isFinite(observedTime)) interactionUntil = performance.now() + 110;
      observedTime = player.time;
    }
  }

  function canWarm() {
    return scheduleEnabled && !hidden && chromeMotion === null && player.visible &&
      !document.hidden && !player.hubFlight && !player.trainingHub && !player.contextLost;
  }

  function cancelSnapshotFrame() {
    if (snapshotFrame !== null) cancelAnimationFrame(snapshotFrame);
    snapshotFrame = null;
  }

  function queueSnapshots(size = null) {
    if (!canWarm() || snapshotFrame !== null) return;
    size ??= dimensions();
    if (!size) return;
    updateCacheShape(size);
    if (!nextTick(size)) return;
    snapshotFrame = requestAnimationFrame(frame => {
      snapshotFrame = null;
      if (!canWarm()) return;
      refreshInteraction();
      if (performance.now() < interactionUntil || performance.now() - frame > 6 ||
          player.cameraMoved || player.cameraOnly || player.glide || player.projectionGlide) {
        queueSnapshots();
        return;
      }
      const size = dimensions();
      if (!size) return;
      updateCacheShape(size);
      const tick = nextTick(size);
      if (!tick) return;
      const key = cacheKey(tick.phase);
      const canvas = newCanvas();
      canvas.width = size.width * 2;
      canvas.height = size.height;
      const context = canvas.getContext('2d');
      if (!context) return; // Retain the live card if a bitmap can't be allocated.
      ensureRasters(tick.picture, size);
      const effort = effortAt(tick.time, tick.picture);
      paint(context, effort);
      canvas.dataset.phaseSnapshot = String(tick.phase);
      view.append(canvas);
      legendFor(tick.picture);
      snapshots.set(key, { key, stage: tick.phase, theme: snapshotContext.theme,
        bytes: size.bytes, phase: tick.picture, effort, canvas });
      snapshotBuilt++;
      if (phaseAt(player.time).source === tick.phase) present(canvas, tick.picture, effort);
      queueSnapshots();
    });
  }

  function setSnapshotSchedulingEnabled(enabled) {
    scheduleEnabled = enabled === true;
    if (scheduleEnabled) queueSnapshots();
    else cancelSnapshotFrame();
  }

  function setSnapshotContext(context) {
    const next = { ...snapshotContext };
    for (const key of Object.keys(next)) if (context[key] !== undefined) next[key] = String(context[key]);
    const changed = Object.keys(next).filter(key => next[key] !== snapshotContext[key]);
    if (!changed.length) return;
    snapshotContext = next;
    if (changed.some(key => key !== 'theme')) {
      retireSnapshots();
      if (changed.includes('language')) clearLegends();
    } else if (snapshotSingleTheme) retireSnapshots(snapshot => snapshot.theme !== next.theme);
    player.requestRedraw();
    queueSnapshots();
  }

  function render() {
    if (hidden) return false;
    if (chromeMotion !== null && activeCanvas !== null) return true;
    const size = dimensions();
    if (!size) return false;
    updateCacheShape(size);
    refreshInteraction();
    const phase = phaseAt(player.time);
    const snapshot = snapshots.get(cacheKey(phase.source));
    if (snapshot) {
      if (activeCanvas !== snapshot.canvas) {
        snapshotHits++;
        present(snapshot.canvas, snapshot.phase, snapshot.effort);
      }
    } else {
      ensureRasters(phase, size);
      const effort = effortAt(player.time, phase);
      const nextPaintKey = rasterKey + ':' + effort;
      if (nextPaintKey !== paintKey) {
        if (thumbnail.width !== size.width * 2 || thumbnail.height !== size.height) {
          thumbnail.width = size.width * 2; thumbnail.height = size.height;
        }
        paint(thumbnailContext, effort);
        paintKey = nextPaintKey;
        livePaints++;
      }
      present(thumbnail, phase, effort, activeCanvas !== thumbnail);
    }
    queueSnapshots(size);
    return true;
  }

  function syncVisibility() {
    motion.hidden = chromeMotion === null && hidden;
    motion.inert = hidden || chromeMotion !== null;
  }
  function setHidden(value) {
    if (hidden === value) return;
    hidden = value;
    syncVisibility();
    if (value) cancelSnapshotFrame();
    player.dirty = true;
  }
  function setChromeMotion(value) {
    const wasMoving = chromeMotion !== null;
    if (value === null && !wasMoving) return;
    chromeMotion = value;
    if (wasMoving !== (value !== null)) syncVisibility();
    if (value !== null) cancelSnapshotFrame();
    motion.style.transform = value === null ? '' : `translate3d(${value.x}px, 0, 0)`;
    const opacity = value === null ? '' : value.opacity;
    panel.style.opacity = opacity;
    shadow.style.opacity = opacity;
    if (value === null && !hidden) player.requestRedraw();
  }
  function setLocalization() {
    panel.querySelector('header span').textContent = sceneStrings.syncEffort ?? '同步发力';
    panel.setAttribute('aria-label', sceneStrings.mapAccessibility ?? 'Muscles');
    clearLegends();
    retireSnapshots();
    player.dirty = true;
  }
  // The CPU-side rasters survive GPU release and can be shown on return.
  function releaseThumbnailGpu() { target?.dispose(); target = null; }
  function releaseGpu() {
    releaseThumbnailGpu();
    for (const mesh of meshes) mesh.geometry.dispose();
    for (const material of materials) material.dispose();
  }
  return { render, setHidden, setChromeMotion, setLocalization, setSnapshotContext, setSnapshotSchedulingEnabled,
    releaseGpu, releaseThumbnailGpu, scene, setDetail, setHubCrop, clearHubCrop, restorePhase,
    refreshEnvironment, withThumbnailDensity, pickSurface, getFullBounds: () => fullBounds.clone(),
    getState: () => ({ phase: source, hidden, focus, views: ['front', 'back'],
      legend: legendItems.map(item => ({ groupId: item.groupId, label: groupLabel(item.groupId, shortNames[item.groupId] ?? item.label) })),
      referencePose: 'static CC0 mannequin',
      resolution: [(activeCanvas ?? thumbnail).width, (activeCanvas ?? thumbnail).height],
      renderCount, samples: target?.samples ?? 0, emphasis: paintEffort,
      snapshotCount: snapshots.size,
      snapshotReadyTicks: ticks.filter(tick => snapshots.has(cacheKey(tick.phase))).map(tick => tick.phase),
      snapshotBytes: [...snapshots.values()].reduce((sum, item) => sum + item.bytes, 0),
      snapshotSingleTheme, snapshotBuilt, snapshotHits, livePaints, legendBuilds,
      displayed: activeCanvas === thumbnail ? 'live' : activeCanvas ? 'snapshot' : null,
    }),
    dispose() {
      cancelSnapshotFrame();
      viewObserver.disconnect(); releaseGpu(); view.removeEventListener('click', select); motion.remove();
    } };
}
