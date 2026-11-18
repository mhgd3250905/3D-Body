import './style.css';
import { FlarePlayer, CAMERA_PRESETS } from './player.js';
import { phaseAt, phaseTicks, GROUPS } from './phase.js';
import { createHotspotCallouts } from './hotspot-callouts.js';
import { createHubFlight } from './training-hub-flight.js';
import { createHotspotDepth } from './hotspot-depth.js';
import { createHubCalloutVisibility } from './hub-callout-visibility.js';
import { buildMmRest, createHitTester } from './mapped-mesh.js';
import { isCoveredActorPart, isOriginalActorHeadPart } from './study-body.js';
import { createPhaseMap } from './phase-map.js';
import { applyTheme, themeSettling } from './theme.js';
import { createPresentationGate } from './presentation.js';
import { sceneStrings, setSceneStrings } from './localization.js';
import { createFlareFx } from './fx.js';
import { characterFromLocation } from './characters.js';
import { createPerfHud, perfEnabled, perfSnapshot } from './perf-hud.js';
import { createTrainingHub } from './training-hub-stage.js';

const stage = document.querySelector('#stage'), status = document.querySelector('#status');
const statusText = document.querySelector('#status-text'), retry = document.querySelector('#retry');
const hotspotLayer = document.querySelector('#hotspots');
let player, hitTester, phaseMap, ready = false, hotspots = [], errorCode = null;
let viewInset = 0, pending = [], pointerDown = null, lastState = 0, callouts, fx = null, previewing = false, perfHud = null;
let clockRevision = 0;
const character = characterFromLocation(location.search);
const options = new URLSearchParams(location.search);
const v5 = options.get('actor') === 'flare-v5';
const media = v5 && options.get('embed') === 'media';
let v5Fx = options.get('fx') !== '0';
const hosted = document.documentElement.dataset.hosted === 'true';
let presented = false, statusTimer = null;
const hubCallouts = createHubCalloutVisibility();
let hubCalloutFrame = null, animateHubCallouts = true;
let showHubCallouts = true;
let homeCalloutRevealAt = null;
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
  return { type: 'state', clockRevision, time: player?.time ?? 0, period: player?.period ?? 9, playing: player?.playing ?? false,
    speed: player?.speed ?? 0.5, phase: phaseAt(player?.time ?? 0).source,
    loop: player?.loopRange ? { start: player.loopRange[0], end: player.loopRange[1] } : null,
    quality: player?.quality ?? 'medium', fx: v5 ? v5Fx : fx?.enabled ?? false,
    character: v5 ? 'flare-v5' : character.id, ready, presented, errorCode };
}
function emitState(force = false) {
  // Intermediate viewport/theme/seek acknowledgements must not flash the
  // transport back to the scene's defaults while the host is restoring it.
  if (!ready || !presented || presentation.pending) return;
  const now = performance.now(); if (!force && now - lastState < 100) return;
  lastState = now; post(state());
}
function showError(code, recoverable = false) {
  clearHotspots();
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
function clearHotspots() {
  callouts?.clear(); hotspots = [];
  hubCallouts.clear(); hubCalloutFrame = null;
}
function refreshHotspots(rendered = false) {
  if (media) return;
  if (!ready || previewing || player.playing || player.hubFlight || !player.visible || document.hidden || player.contextLost || errorCode
      || stage.clientWidth <= 0 || stage.clientHeight <= 0) {
    clearHotspots(); return;
  }
  if (rendered && !player.trainingHub) {
    let opacity = 1;
    if (homeCalloutRevealAt !== null) {
      opacity = Math.min(1, (performance.now() - homeCalloutRevealAt) / 200);
      if (opacity < 1) player.requestRedraw(); else homeCalloutRevealAt = null;
    }
    hotspots = callouts?.update(phaseAt(player.time).items, { opacity }) ?? [];
  }
}
function renderHubCallouts(frame) {
  if (!showHubCallouts) return;
  hubCalloutFrame = hubCallouts.update(frame, performance.now(), animateHubCallouts &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!hubCalloutFrame) {
    if (hotspots.length) callouts?.clear();
    hotspots = [];
    return;
  }
  if (hubCalloutFrame.redrawing) player.requestRedraw();
  hotspots = callouts?.update(phaseAt(hubCalloutFrame.time).items, {
    camera: frame.camera, opacity: hubCalloutFrame.opacity, reservedBottom: 32, homeOverlays: false,
  }) ?? [];
}
function openMusclePlan(groupId, pause = false) {
  if (!ready || !GROUPS[groupId] || player.trainingHub || player.hubFlight || (player.playing && !pause)) return;
  player.playing = false;
  post({ type: 'select', groupId, time: player.time });
}
function command(value) {
  let input = value;
  if (typeof input === 'string') { try { input = JSON.parse(input); } catch { post({ type: 'error', code: 'invalid_command', errorCode: 'invalid_command' }); return; } }
  if (!input || typeof input !== 'object' || typeof input.type !== 'string') return;
  if (media && ['hub_scene', 'hub_exit', 'hub_flight', 'hub_flight_resume', 'hub_flight_reverse', 'hub_flight_angle', 'hub_angle'].includes(input.type)) return;
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
      phaseMap?.setLocalization(); callouts?.clear();
      break;
    }
    case 'present':
      if (!Number.isSafeInteger(input.requestId) || input.requestId <= 0) return;
      presentation.request(input.requestId); return;
    case 'hub_scene': {
      const hub = player.trainingHub ?? createTrainingHub(player, phaseMap, renderHubCallouts);
      if (!hub.configure(input, performance.now())) {
        if (!player.trainingHub) hub.releaseGpu();
        return;
      }
      animateHubCallouts = input.animate !== false;
      showHubCallouts = input.showCallouts !== false;
      if (!showHubCallouts) clearHotspots();
      if (!player.trainingHub) {
        clearHotspots();
        player.trainingHub = hub;
        player.playing = false;
        player.loopRange = null;
        player.autoFrame = false;
        player.glide = player.projectionGlide = null;
        player.controls.enabled = false;
        player.setDemandFrames(true);
        phaseMap.setHidden(true);
        if (fx) { fx.setEnabled(false); fx.root.visible = false; }
        player.v5?.setFxEnabled(false);
      }
      break;
    }
    case 'hub_exit':
      if (!player.trainingHub) return;
      player.trainingHub.releaseGpu();
      player.trainingHub = null;
      phaseMap.releaseGpu();
      phaseMap.setHidden(false);
      phaseMap.restorePhase();
      phaseMap.clearHubCrop();
      clearHotspots();
      player.controls.enabled = true;
      for (const prop of player.stageProps) prop.visible = prop !== player.shadowCatcher || player.renderer.shadowMap.enabled;
      if (fx) { fx.setEnabled(true); fx.root.visible = true; }
      player.setDemandFrames(false);
      break;
    case 'hub_flight': {
      const returned = player.hubFlight?.returning && player.hubFlight.landed;
      player.hubFlight?.restore();
      player.hubFlight = null;
      homeCalloutRevealAt = input.id === 0 && returned ? performance.now() : null;
      if (input.id > 0) {
        player.playing = false;
        if (fx) fx.root.visible = false;
        player.v5?.setFxEnabled(false);
        clearHotspots();
        player.hubFlight = createHubFlight(player, input, CAMERA_PRESETS.standard,
          () => {
            player.stop();
            post({ type: 'hub_flight_done', id: input.id });
          }, () => {
            const flight = player.hubFlight;
            // As for scene presentation, let the platform view composite
            // the held frame before the host exposes it for the return.
            requestAnimationFrame(() => requestAnimationFrame(() => {
              if (player.hubFlight !== flight || !flight.holding) return;
              player.stop();
              post({ type: 'hub_flight_ready', id: input.id });
            }));
          });
        if (!player.hubFlight) post({ type: 'hub_flight_done', id: input.id });
      }
      phaseMap?.setHidden(!!player.trainingHub || !!player.hubFlight);
      player.start();
      break;
    }
    case 'hub_flight_resume':
      player.hubFlight?.resume();
      player.start();
      break;
    case 'hub_flight_reverse': {
      const done = () => post({ type: 'hub_flight_done', id: input.id });
      if (!player.hubFlight?.reverse(done)) done();
      else player.start();
      break;
    }
    case 'hub_flight_angle':
      if (player.hubFlight?.setAngleYaw(input.yaw)) player.start();
      return;
    case 'hub_angle':
      player.trainingHub?.setAngleYaw(input.yaw);
      return;
    case 'play':
      if (Number.isSafeInteger(input.clockRevision)) clockRevision = input.clockRevision;
      if (player.time >= player.period) player.setTime(0);
      player.playing = player.visible && !document.hidden && !player.contextLost;
      player.start(); break;
    case 'pause':
      if (Number.isSafeInteger(input.clockRevision)) clockRevision = input.clockRevision;
      player.playing = false; break;
    case 'seek': {
      const time = Number(input.time); if (!Number.isFinite(time)) return;
      if (Number.isSafeInteger(input.clockRevision)) clockRevision = input.clockRevision;
      player.playing = false; player.loopRange = null; player.setTime(time); break;
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
    case 'reset': player.resetView(); break;
    case 'camera': {
      if (!CAMERA_PRESETS[input.view]) return;
      player.resetView(CAMERA_PRESETS[input.view]); break;
    }
    case 'quality': player.setQuality(input.value); break;
    case 'fx':
      if (typeof input.value !== 'boolean') return;
      fx?.setEnabled(input.value); v5Fx = input.value; break;
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
    player = new FlarePlayer(stage, { character, v5,
      onTime: () => { if (document.hidden) refreshHotspots(); emitState(); },
      onBeforeRender: () => {
        if (player.hubFlight) {
          const flight = player.hubFlight;
          if (flight.landed && !flight.returning) {
            // The sharp landing frame owns its labels while the hub prepares.
            hotspots = callouts?.update(phaseAt(flight.landingTime).items, {
              camera: flight.camera, reservedBottom: flight.landingBottomInset, homeOverlays: false,
            }) ?? [];
          }
          return;
        }
        fx?.update(performance.now(), true);
        player.v5?.setFxEnabled(v5Fx && (previewing || player.playing));
        refreshHotspots(true);
      },
      onRender: hubCompleted => {
        if (player.hubFlight) return;
        const complete = player.trainingHub ? hubCompleted : phaseMap?.render();
        if (hosted && !media && ready && presented && !presentation.pending && player.playing
            && !player.trainingHub) {
          post({ type: 'playhead', clockRevision, time: player.time, phase: phaseAt(player.time).source });
        }
        presentation.rendered(media || complete === true);
      },
      onResize: () => presentation.invalidate(),
      onContext: restored => {
        if (restored) {
          phaseMap?.refreshEnvironment(); errorCode = null; delete status.dataset.error; retry.hidden = true;
          // The host replays its saved configuration before requesting a new
          // frame; ordinary state events remain suppressed until that frame.
          post({ type: 'ready', period: player.period });
          if (!hosted) presentation.request(0);
        }
        else { player.trainingHub?.releaseGpu(); phaseMap?.releaseGpu(); showError('graphics_context_lost', true); }
      },
    });
    player.setViewInset(viewInset, false);
    if (perfEnabled(location.search)) perfHud = createPerfHud(player);
    if (v5) {
      const context = player.renderer.getContext();
      if ('drawingBufferColorSpace' in context) context.drawingBufferColorSpace = 'srgb';
    }
    await Promise.all([player.load(), media ? null : createPhaseMap(player, groupId => openMusclePlan(groupId, true)).then(map => { phaseMap = map; })]);
    player.resetView();
    if (!v5) fx = createFlareFx(player, { palette: character.fx, enabled: options.get('fx') !== '0' });
    const skinned = media ? player.v5.skinned : configureTeaching();

    ready = true; player.dirty = true;
    const geometryStats = skinned.reduce((stats, mesh) => ({ meshes: stats.meshes + 1, vertices: stats.vertices + mesh.geometry.attributes.position.count,
      triangles: stats.triangles + (mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count) / 3 }), { meshes: 0, vertices: 0, triangles: 0 });
    // Diagnostics return data copies, not scene objects. The playback bridge is
    // also used by reproducible parity and browser checks.
    // Close-up inspection camera for offline checks (not used by the host).
    window.__flareDebugCam = (joint, distance, view) => {
      const point = new player.camera.position.constructor(...player.getMetrics().joints[joint]);
      const dir = new player.camera.position.constructor(...view).normalize();
      player.autoFrame = false; player.setCameraView(point.clone().addScaledVector(dir, distance), point);
    };
    window.__flareScene = Object.freeze({
      getMetrics: () => player.getMetrics(), getState: state, getHotspots: () => hotspots.map(point => ({ ...point })),
      hitTest: (x, y) => hitTester?.pick(x, y, phaseAt(player.time).items) ?? null,
      hitTestCallout: (x, y) => callouts?.pick(x, y) ?? null,
      getPhaseMap: () => phaseMap?.getState(), getFx: () => fx?.getState() ?? null,
      wallToTime: wall => player.motion.clock.toSequence(wall), wallDuration: () => player.motion.clock.duration,
      previewFx: (time, hold = true) => { previewing = hold; command({ type: 'seek', time }); fx?.setHold(hold); player.dirty = true; },
      getActorSurface: () => skinned.filter(mesh => mesh.userData.studySkin || mesh.userData.studyHead || isCoveredActorPart(mesh) || isOriginalActorHeadPart(mesh))
        .map(mesh => ({ name: mesh.name, part: mesh.parent.name, visible: mesh.visible, studySkin: !!mesh.userData.studySkin, studyHead: !!mesh.userData.studyHead })),
      getRenderState: () => {
        const renderer = player.renderer;
        return { visible: player.visible, running: player.running, dirty: player.dirty, contextLost: player.contextLost,
          frame: renderer.info.render.frame, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
          pixelRatio: renderer.getPixelRatio(), devicePixelRatio: window.devicePixelRatio,
          framingMode: player.framingMode, ticks: player.perf.ticks,
          bufferSize: [renderer.domElement.width, renderer.domElement.height] };
      },
      getCamera: () => ({ position: player.camera.position.toArray(), target: player.controls.target.toArray(), aspect: player.camera.aspect,
        projectionMatrix: player.camera.projectionMatrix.toArray(), fov: player.camera.fov,
        viewInset: player.viewInset, viewInsetTarget: player.viewInsetTarget, offsetX: player.offsetX, offsetY: player.offsetY,
        gliding: !!player.glide || !!player.projectionGlide }),
      getTrainingHub: () => player.trainingHub?.getState() ?? null,
      getStandingView: () => player.trainingHub?.getStandingView() ?? null,
      getTrainingFlight: () => player.hubFlight && {
        position: player.hubFlight.camera.position.toArray(), landed: player.hubFlight.landed,
      },
      getHubCalloutState: () => hubCalloutFrame && { ...hubCalloutFrame },
      getPerf: () => perfSnapshot(player),
      setTime: time => command({ type: 'seek', time }), phaseAt, phaseTicks, pacingRate: time => player.pacingRate(time),
      geometryStats: { ...geometryStats },
    });
    post({ type: 'ready', period: player.period, time: player.time, phase: phaseAt(player.time).source, phases: phaseTicks });
    const queued = pending; pending = []; for (const input of queued) command(input);
    if (!hosted) presentation.request(0);
    emitState(true);
  } catch (error) { console.error(error); player?.stop(); showError(error?.message === 'rig_load_failed' ? 'rig_load_failed' : 'scene_load_failed'); }
}
function configureTeaching() {
  const skinned = buildMmRest(player.motion, player.coach);
  callouts = createHotspotCallouts(player, hotspotLayer, openMusclePlan, { hosted, depthSampler: createHotspotDepth(player, skinned) });
  hitTester = createHitTester(player, skinned);
  const canvas = player.renderer.domElement;
  canvas.addEventListener('pointerdown', event => { pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() }; });
  canvas.addEventListener('pointercancel', () => { pointerDown = null; });
  canvas.addEventListener('pointerup', event => {
    const down = pointerDown; pointerDown = null;
    if (!down || player.trainingHub || player.playing || performance.now() - down.time > 550 || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) return;
    const hit = callouts?.pick(event.clientX, event.clientY) || hitTester.pick(event.clientX, event.clientY, phaseAt(player.time).items);
    if (hit) openMusclePlan(hit.groupId);
  });
  return skinned;
}
function dispose() {
  presentation.cancel(); clearTimeout(statusTimer); presented = false;
  ready = false; pending = []; window.removeEventListener('message', receive);
  perfHud?.dispose(); fx?.dispose(); callouts?.dispose(); phaseMap?.dispose(); player?.dispose();
}
window.addEventListener('pagehide', event => { if (event.persisted) player?.setVisible(false); else dispose(); });
window.addEventListener('pageshow', event => { if (event.persisted) player?.setVisible(true); });
boot();
