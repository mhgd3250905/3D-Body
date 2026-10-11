import './style.css';
import { FlarePlayer, CAMERA_PRESETS } from './player.js';
import { phaseAt, phaseTicks, GROUPS } from './phase.js';
import { createHotspotCallouts } from './hotspot-callouts.js';
import { createHotspotDepth } from './hotspot-depth.js';
import { buildMmRest, createHitTester, createSurfaceSelection } from './mapped-mesh.js';
import { createDetailView } from './detail.js';
import { isCoveredActorPart, isOriginalActorHeadPart } from './study-body.js';
import { createPhaseMap } from './phase-map.js';
import { applyTheme, themeSettling } from './theme.js';
import { createPresentationGate } from './presentation.js';
import { sceneStrings, setSceneStrings } from './localization.js';

const stage = document.querySelector('#stage'), status = document.querySelector('#status');
const statusText = document.querySelector('#status-text'), retry = document.querySelector('#retry');
const hotspotLayer = document.querySelector('#hotspots');
let player, hitTester, surface, detailView, phaseMap, ready = false, selected = null, detailed = false, hotspots = [], errorCode = null;
let viewInset = 0, pending = [], pointerDown = null, lastState = 0, callouts;
const hosted = document.documentElement.dataset.hosted === 'true';
let presented = false, statusTimer = null;
const presentation = createPresentationGate({
  canPresent: () => ready && !errorCode && player.visible && !document.hidden && !player.contextLost && !player.disposed && !player.dirty
    && stage.clientWidth > 0 && stage.clientHeight > 0 && !player.glide && !player.projectionGlide && !themeSettling(),
  requestRender: () => { if (player) { player.dirty = true; player.start(); } },
  onPresented: requestId => {
    presented = true;
    // Include the final clock/selection in the acknowledgement, so the host
    // unveils the stage and updates its transport as one coherent state.
    if (hosted) post({ ...state(), type: 'presented', requestId });
    dismissStatus(); emitState(true);
  },
});

// Android WebView ignores user-select on long-press in some builds: stop the
// selection and the system callout at the source as well.
for (const type of ['contextmenu', 'selectstart', 'dragstart']) document.addEventListener(type, event => event.preventDefault());

function post(event) {
  const message = { source: 'flare-scene', ...event };
  if (window.FlareHost?.postMessage) window.FlareHost.postMessage(JSON.stringify(message));
  else if (window.parent !== window) {
    // Flutter web uses a same-origin asset iframe. A top-level preview has no host.
    window.parent.postMessage(message, window.location.origin);
  }
}
function state() {
  return { type: 'state', time: player?.time ?? 0, period: player?.period ?? 9, playing: player?.playing ?? false,
    speed: player?.speed ?? 0.5, phase: phaseAt(player?.time ?? 0).source, selected, detail: detailed,
    loop: player?.loopRange ? { start: player.loopRange[0], end: player.loopRange[1] } : null,
    detailModel: detailed ? detailView?.getModel() ?? 'motion' : 'motion',
    quality: player?.quality ?? 'medium', ready, presented, errorCode };
}
function emitState(force = false) {
  // Intermediate viewport/theme/seek acknowledgements must not flash the
  // transport back to the scene's defaults while the host is restoring it.
  if (!ready || !presented || presentation.pending) return;
  const now = performance.now(); if (!force && now - lastState < 100) return;
  lastState = now; post(state());
}
function showError(code, recoverable = false) {
  callouts?.clear(); hotspots = [];
  presented = false; presentation.cancel(); clearTimeout(statusTimer);
  errorCode = code; status.classList.remove('leaving'); status.hidden = false; status.dataset.error = 'true';
  statusText.textContent = sceneStrings.sceneFailed ?? (recoverable ? '三维画面暂时中断，正在等待图形恢复。也可重新载入。' : '三维动作暂时无法载入，请重新载入。');
  retry.hidden = false; post({ type: 'error', code, errorCode: code }); emitState(true);
}
function dismissStatus() {
  clearTimeout(statusTimer);
  delete status.dataset.error; retry.hidden = true;
  if (hosted) { status.hidden = true; return; }
  // The standalone preview uses the same two-stage reveal as Flutter:
  // retire the mark against an opaque cover, then reveal the finished frame.
  status.classList.add('leaving');
  statusTimer = setTimeout(() => {
    if (presented && !errorCode) status.hidden = true;
    status.classList.remove('leaving');
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 340);
}
function refreshHotspots(rendered = false) {
  if (!ready || player.playing || detailed || !player.visible || document.hidden || player.contextLost || errorCode
      || stage.clientWidth <= 0 || stage.clientHeight <= 0) {
    hotspots = []; callouts?.clear(); return;
  }
  if (rendered) hotspots = callouts?.update(phaseAt(player.time).items, selected) ?? [];
}
function closeDetail() {
  detailView?.close(); detailed = false;
  surface?.restore();
  phaseMap?.setHidden(false);
  for (const prop of player?.stageProps ?? []) prop.visible = prop === player.shadowCatcher ? player.renderer.shadowMap.enabled : true;
}
function setSelected(groupId, detail = detailed) {
  player.playing = false;
  if (!groupId) {
    closeDetail(); selected = null; surface.restore();
  } else {
    selected = groupId; detailed = !!detail; const phase = phaseAt(player.time);
    surface.show(selected, phase.items, detailed);
    if (detailed) {
      detailView.open(selected, phase);
      phaseMap?.setHidden(true);
      for (const prop of player.stageProps) prop.visible = false;
    }
  }
  player.dirty = true; refreshHotspots(); emitState(true);
}
function selectFromTap(groupId) {
  if (!ready || player.playing) return;
  setSelected(groupId); post({ type: 'select', groupId, time: player.time });
}
function selectFromMap(groupId) {
  if (!ready) return;
  setSelected(groupId); post({ type: 'select', groupId, time: player.time });
}
function command(value) {
  let input = value;
  if (typeof input === 'string') { try { input = JSON.parse(input); } catch { post({ type: 'error', code: 'invalid_command', errorCode: 'invalid_command' }); return; } }
  if (!input || typeof input !== 'object' || typeof input.type !== 'string') return;
  if (input.type !== 'present') presentation.invalidate();
  if (input.type === 'theme') {
    // Appearance only: page chrome and the miniature's backdrop. The athlete,
    // lighting and materials are identical in both themes.
    // An optional duration (ms) dissolves the chrome in step with the app.
    if (applyTheme(input.value, input.duration) && player) player.dirty = true;
    return;
  }
  if (input.type === 'viewport') {
    // The host's chrome covers the bottom `bottom` px of the stage. DOM
    // overlays sit above it; the camera eases its framing into what is left.
    const bottom = Math.max(0, Number(input.bottom) || 0);
    viewInset = bottom; stage.style.setProperty('--inset-bottom', `${bottom}px`);
    player?.setViewInset(bottom, ready && input.animate !== false);
    return;
  }
  if (!ready) { pending.push(input); if (pending.length > 32) pending.shift(); return; }
  switch (input.type) {
    case 'localization': {
      for (const [id, label] of Object.entries(input.groups ?? {})) {
        if (GROUPS[id] && typeof label === 'string') GROUPS[id].label = label;
      }
      setSceneStrings(input).then(() => {
        callouts?.clear();
        if (player) { player.dirty = true; player.start(); }
      }).catch(() => post({ type: 'localization_font_error', code: 'font_load_failed' }));
      stage.setAttribute('aria-label', input.sceneAccessibility ?? 'Flare 3D');
      player.renderer.domElement.setAttribute('aria-label', input.sceneAccessibility ?? 'Flare 3D');
      hotspotLayer.setAttribute('aria-label', input.mapAccessibility ?? 'Muscles');
      document.title = input.sceneAccessibility ?? 'Flare';
      retry.textContent = input.retry ?? 'Retry';
      if (errorCode) statusText.textContent = input.sceneFailed ?? 'Unable to load';
      phaseMap?.setLocalization(); detailView?.updateLocalization(); callouts?.clear();
      break;
    }
    case 'present':
      if (!Number.isSafeInteger(input.requestId) || input.requestId <= 0) return;
      presentation.request(input.requestId); return;
    case 'play':
      closeDetail(); selected = null; surface.restore();
      if (player.time >= player.period) player.setTime(0);
      player.playing = player.visible && !document.hidden && !player.contextLost;
      player.start(); break;
    case 'pause': player.playing = false; break;
    case 'seek': {
      const time = Number(input.time); if (!Number.isFinite(time)) return;
      closeDetail(); selected = null; surface.restore(); player.playing = false; player.loopRange = null; player.setTime(time); break;
    }
    case 'speed': if ([0.25, 0.5, 1].includes(Number(input.value))) player.speed = Number(input.value); break;
    case 'loop': {
      if (input.start == null || input.end == null) player.loopRange = null;
      else {
        const start = Number(input.start), end = Number(input.end);
        if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end > player.period || end - start <= 0.001) return;
        player.loopRange = [start, end];
        if (player.time < start || player.time >= end) player.setTime(start);
      }
      break;
    }
    case 'reset':
      if (detailed && selected) detailView.reset(phaseAt(player.time)); else player.resetView(); break;
    case 'camera': {
      if (!CAMERA_PRESETS[input.view]) return;
      if (detailed && selected) detailView.reset(phaseAt(player.time), CAMERA_PRESETS[input.view]);
      else player.resetView(CAMERA_PRESETS[input.view]); break;
    }
    case 'select': if (input.groupId == null || GROUPS[input.groupId]) setSelected(input.groupId ?? null); else return; break;
    case 'detail':
      if (input.groupId == null) {
        closeDetail();
        if (selected) surface.show(selected, phaseAt(player.time).items, false); else surface.restore();
      } else if (GROUPS[input.groupId]) setSelected(input.groupId, true);
      else return;
      break;
    case 'detail_model':
      if (!detailed || !['motion', 'muscles'].includes(input.value)) return;
      detailView.setModel(input.value, phaseAt(player.time)); break;
    case 'quality': player.setQuality(input.value); break;
    case 'visibility': player.setVisible(input.visible); break;
    default: return;
  }
  player.dirty = true; refreshHotspots(); emitState(true);
}

// Both entry points accept the exact same map. Commands received while assets
// load are replayed after ready. No remote URLs or arbitrary code are accepted.
window.flareBridge = Object.freeze({ command });
function receive(event) {
  if (event.source !== window.parent || event.origin !== window.location.origin || event.data?.source !== 'flare-host') return;
  command(event.data.command);
}
window.addEventListener('message', receive);
retry.addEventListener('click', () => window.location.reload());

async function boot() {
  try {
    player = new FlarePlayer(stage, {
      onTime: () => { if (document.hidden) refreshHotspots(); emitState(); },
      onBeforeRender: () => refreshHotspots(true),
      onRender: () => {
        const complete = detailed ? detailView?.renderMini() : phaseMap?.render();
        presentation.rendered(complete === true);
      },
      onResize: () => { presentation.invalidate(); if (detailed) detailView?.refit(phaseAt(player.time)); },
      onContext: restored => {
        if (restored) {
          phaseMap?.refreshEnvironment(); errorCode = null; delete status.dataset.error; retry.hidden = true;
          // The host replays its saved configuration before requesting a new
          // frame; ordinary state events remain suppressed until that frame.
          post({ type: 'ready', period: player.period });
          if (!hosted) presentation.request(0);
        }
        else { surface?.releaseGpu(); phaseMap?.releaseGpu(); detailView?.releaseGpu(); showError('graphics_context_lost', true); }
      },
    });
    player.setViewInset(viewInset, false);
    await Promise.all([player.load(), createPhaseMap(player, selectFromMap).then(map => { phaseMap = map; })]);
    player.resetView();
    const skinned = buildMmRest(player.motion, player.coach);
    callouts = createHotspotCallouts(player, hotspotLayer, selectFromTap, { hosted, depthSampler: createHotspotDepth(player, skinned) });
    hitTester = createHitTester(player, skinned); surface = createSurfaceSelection(skinned);
    detailView = createDetailView(player, phaseMap, () => { player.dirty = true; emitState(true); }, () => surface.focusDirection());
    detailView.mini.addEventListener('click', () => detailView.toggle(phaseAt(player.time)));
    const canvas = player.renderer.domElement;
    canvas.addEventListener('pointerdown', event => { pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() }; });
    canvas.addEventListener('pointercancel', () => { pointerDown = null; });
    canvas.addEventListener('pointerup', event => {
      const down = pointerDown; pointerDown = null;
      if (!down || player.playing || performance.now() - down.time > 550 || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) return;
      const hit = (!detailed && callouts?.pick(event.clientX, event.clientY)) || (detailed && detailView.getModel() === 'muscles'
        ? phaseMap.pickSurface(event.clientX, event.clientY, player.camera, canvas.getBoundingClientRect())
        : hitTester.pick(event.clientX, event.clientY, phaseAt(player.time).items));
      if (hit) selectFromTap(hit.groupId);
    });
    ready = true; player.dirty = true;
    const geometryStats = skinned.reduce((stats, mesh) => ({ meshes: stats.meshes + 1, vertices: stats.vertices + mesh.geometry.attributes.position.count,
      triangles: stats.triangles + (mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count) / 3 }), { meshes: 0, vertices: 0, triangles: 0 });
    // Diagnostics return data copies, not scene objects. The playback bridge is
    // also used by reproducible parity and browser checks.
    window.__flareScene = Object.freeze({
      getMetrics: () => player.getMetrics(), getState: state, getHotspots: () => hotspots.map(point => ({ ...point })),
      hitTest: (x, y) => hitTester.pick(x, y, phaseAt(player.time).items),
      hitTestCallout: (x, y) => callouts?.pick(x, y) ?? null,
      getPhaseMap: () => phaseMap?.getState(),
      getSelectionSurface: () => surface?.getState(),
      getActorSurface: () => skinned.filter(mesh => mesh.userData.studySkin || mesh.userData.studyHead || isCoveredActorPart(mesh) || isOriginalActorHeadPart(mesh))
        .map(mesh => ({ name: mesh.name, part: mesh.parent.name, visible: mesh.visible, studySkin: !!mesh.userData.studySkin, studyHead: !!mesh.userData.studyHead })),
      getRenderState: () => ({ visible: player.visible, running: player.running, dirty: player.dirty, contextLost: player.contextLost,
        frame: player.renderer.info.render.frame, calls: player.renderer.info.render.calls, triangles: player.renderer.info.render.triangles,
        pixelRatio: player.renderer.getPixelRatio(), framingMode: player.framingMode,
        bufferSize: [player.renderer.domElement.width, player.renderer.domElement.height] }),
      getCamera: () => ({ position: player.camera.position.toArray(), target: player.controls.target.toArray(), aspect: player.camera.aspect,
        projectionMatrix: player.camera.projectionMatrix.toArray(), fov: player.camera.fov,
        viewInset: player.viewInset, viewInsetTarget: player.viewInsetTarget, offsetX: player.offsetX, offsetY: player.offsetY,
        gliding: !!player.glide || !!player.projectionGlide }),
      setTime: time => command({ type: 'seek', time }), phaseAt, phaseTicks, pacingRate: time => player.pacingRate(time),
      geometryStats: { ...geometryStats },
    });
    post({ type: 'ready', period: player.period, time: player.time, phase: phaseAt(player.time).source, phases: phaseTicks });
    const queued = pending; pending = []; for (const input of queued) command(input);
    if (!hosted) presentation.request(0);
    emitState(true);
  } catch (error) { player?.stop(); showError(error?.message === 'rig_load_failed' ? 'rig_load_failed' : 'scene_load_failed'); }
}
function dispose() {
  presentation.cancel(); clearTimeout(statusTimer); presented = false;
  ready = false; pending = []; window.removeEventListener('message', receive);
  callouts?.dispose(); detailView?.dispose(); surface?.dispose(); phaseMap?.dispose(); player?.dispose();
}
window.addEventListener('pagehide', event => { if (event.persisted) player?.setVisible(false); else dispose(); });
window.addEventListener('pageshow', event => { if (event.persisted) player?.setVisible(true); });
boot();
