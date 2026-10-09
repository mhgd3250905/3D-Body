import './style.css';
import { FlarePlayer, CAMERA_PRESETS } from './player.js';
import { phaseAt, phaseTicks, GROUPS } from './phase.js';
import { computeHotspots } from './hotspots.js';
import { buildMmRest, createHitTester, createSurfaceSelection } from './mapped-mesh.js';
import { createDetailView } from './detail.js';
import { isCoveredActorPart, isOriginalActorHeadPart } from './study-body.js';
import { createPhaseMap } from './phase-map.js';
import { applyTheme } from './theme.js';

const stage = document.querySelector('#stage'), status = document.querySelector('#status');
const statusText = document.querySelector('#status-text'), retry = document.querySelector('#retry');
const hotspotLayer = document.querySelector('#hotspots'), detailNote = document.querySelector('#detail-note');
let player, hitTester, surface, detailView, phaseMap, ready = false, selected = null, detailed = false, hotspots = [], errorCode = null;
let pending = [], pointerDown = null, lastState = 0, hotspotButtons = new Map();

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
    quality: player?.quality ?? 'medium', ready, errorCode };
}
function emitState(force = false) {
  if (!ready) return;
  const now = performance.now(); if (!force && now - lastState < 100) return;
  lastState = now; post(state());
}
function showError(code, recoverable = false) {
  errorCode = code; status.classList.remove('leaving'); status.hidden = false; status.dataset.error = 'true';
  statusText.textContent = recoverable ? '三维画面暂时中断，正在等待图形恢复。也可重新载入。' : '三维动作暂时无法载入，请重新载入。';
  retry.hidden = false; post({ type: 'error', code, errorCode: code }); emitState(true);
}
function refreshHotspots() {
  if (!ready || player.playing || detailed) {
    hotspots = []; hotspotLayer.replaceChildren(); hotspotButtons.clear(); return;
  }
  hotspots = computeHotspots(player, phaseAt(player.time).items);
  const active = new Set();
  for (const hotspot of hotspots) {
    active.add(hotspot.groupId);
    let button = hotspotButtons.get(hotspot.groupId);
    if (!button) {
      button = document.createElement('button'); button.className = 'hotspot'; button.type = 'button';
      button.dataset.groupId = hotspot.groupId; button.setAttribute('aria-label', '查看' + hotspot.label); button.title = hotspot.label;
      button.addEventListener('click', () => selectFromTap(hotspot.groupId));
      hotspotLayer.append(button); hotspotButtons.set(hotspot.groupId, button);
    }
    button.style.left = hotspot.x + 'px'; button.style.top = hotspot.y + 'px'; button.style.setProperty('--accent', hotspot.colour);
    button.dataset.selected = String(hotspot.groupId === selected);
  }
  for (const [id, button] of hotspotButtons) if (!active.has(id)) { button.remove(); hotspotButtons.delete(id); }
}
function closeDetail() {
  detailView?.close(); detailed = false; detailNote.hidden = true;
  surface?.restore();
  phaseMap?.setHidden(false);
  for (const prop of player?.stageProps ?? []) prop.visible = prop === player.shadowCatcher ? player.renderer.shadowMap.enabled : true;
}
function updateDetailNote() {
  detailNote.textContent = detailView?.getModel() === 'muscles' ? '拖动旋转 · 双指缩放' : '拖动旋转';
}
function setSelected(groupId, detail = detailed) {
  player.playing = false;
  if (!groupId) {
    closeDetail(); selected = null; surface.restore();
  } else {
    selected = groupId; detailed = !!detail; const phase = phaseAt(player.time);
    surface.show(selected, phase.items, detailed);
    if (detailed) {
      detailView.open(selected, phase); detailNote.hidden = false; updateDetailNote();
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
  if (input.type === 'theme') {
    // Appearance only: page chrome and the miniature's backdrop. The athlete,
    // lighting and materials are identical in both themes.
    // An optional duration (ms) dissolves the chrome in step with the app.
    if (applyTheme(input.value, input.duration) && player) player.dirty = true;
    return;
  }
  if (!ready) { pending.push(input); if (pending.length > 32) pending.shift(); return; }
  switch (input.type) {
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
      detailView.setModel(input.value, phaseAt(player.time)); updateDetailNote(); break;
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
      onTime: () => emitState(),
      onRender: () => { refreshHotspots(); if (detailed) detailView?.renderMini(); else phaseMap?.render(); },
      onResize: () => { if (detailed) detailView?.refit(phaseAt(player.time)); },
      onContext: restored => {
        if (restored) { phaseMap?.refreshEnvironment(); errorCode = null; status.hidden = true; emitState(true); }
        else { surface?.releaseGpu(); phaseMap?.releaseGpu(); showError('graphics_context_lost', true); }
      },
    });
    await Promise.all([player.load(), createPhaseMap(player, selectFromMap).then(map => { phaseMap = map; })]);
    player.resetView();
    const skinned = buildMmRest(player.motion, player.coach);
    hitTester = createHitTester(player, skinned); surface = createSurfaceSelection(skinned);
    detailView = createDetailView(player, phaseMap, () => { updateDetailNote(); player.dirty = true; emitState(true); }, () => surface.focusDirection());
    detailView.mini.addEventListener('click', () => detailView.toggle(phaseAt(player.time)));
    const canvas = player.renderer.domElement;
    canvas.addEventListener('pointerdown', event => { pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() }; });
    canvas.addEventListener('pointercancel', () => { pointerDown = null; });
    canvas.addEventListener('pointerup', event => {
      const down = pointerDown; pointerDown = null;
      if (!down || player.playing || performance.now() - down.time > 550 || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) return;
      const hit = detailed && detailView.getModel() === 'muscles'
        ? phaseMap.pickSurface(event.clientX, event.clientY, player.camera, canvas.getBoundingClientRect())
        : hitTester.pick(event.clientX, event.clientY, phaseAt(player.time).items);
      if (hit) selectFromTap(hit.groupId);
    });
    ready = true; player.dirty = true;
    // The loading mark dissolves into the first frame instead of cutting.
    status.classList.add('leaving');
    setTimeout(() => { if (ready && !errorCode) status.hidden = true; status.classList.remove('leaving'); }, 340);
    const geometryStats = skinned.reduce((stats, mesh) => ({ meshes: stats.meshes + 1, vertices: stats.vertices + mesh.geometry.attributes.position.count,
      triangles: stats.triangles + (mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count) / 3 }), { meshes: 0, vertices: 0, triangles: 0 });
    // Diagnostics return data copies, not scene objects. The playback bridge is
    // also used by reproducible parity and browser checks.
    window.__flareScene = Object.freeze({
      getMetrics: () => player.getMetrics(), getState: state, getHotspots: () => hotspots.map(point => ({ ...point })),
      hitTest: (x, y) => hitTester.pick(x, y, phaseAt(player.time).items),
      getPhaseMap: () => phaseMap?.getState(),
      getSelectionSurface: () => surface?.getState(),
      getActorSurface: () => skinned.filter(mesh => mesh.userData.studySkin || mesh.userData.studyHead || isCoveredActorPart(mesh) || isOriginalActorHeadPart(mesh))
        .map(mesh => ({ name: mesh.name, part: mesh.parent.name, visible: mesh.visible, studySkin: !!mesh.userData.studySkin, studyHead: !!mesh.userData.studyHead })),
      getRenderState: () => ({ visible: player.visible, running: player.running, dirty: player.dirty, contextLost: player.contextLost,
        frame: player.renderer.info.render.frame, calls: player.renderer.info.render.calls, triangles: player.renderer.info.render.triangles,
        pixelRatio: player.renderer.getPixelRatio(), framingMode: player.framingMode,
        bufferSize: [player.renderer.domElement.width, player.renderer.domElement.height] }),
      getCamera: () => ({ position: player.camera.position.toArray(), target: player.controls.target.toArray(), aspect: player.camera.aspect }),
      setTime: time => command({ type: 'seek', time }), phaseAt, phaseTicks, pacingRate: time => player.pacingRate(time),
      geometryStats: { ...geometryStats },
    });
    post({ type: 'ready', period: player.period, time: player.time, phase: phaseAt(player.time).source, phases: phaseTicks });
    const queued = pending; pending = []; for (const input of queued) command(input);
    emitState(true);
  } catch (error) { player?.stop(); showError(error?.message === 'rig_load_failed' ? 'rig_load_failed' : 'scene_load_failed'); }
}
function dispose() {
  ready = false; pending = []; window.removeEventListener('message', receive);
  detailView?.dispose(); surface?.dispose(); phaseMap?.dispose(); player?.dispose();
}
window.addEventListener('pagehide', event => { if (event.persisted) player?.setVisible(false); else dispose(); });
window.addEventListener('pageshow', event => { if (event.persisted) player?.setVisible(true); });
boot();
