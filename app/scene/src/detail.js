import * as THREE from 'three';
import { GROUPS } from './phase.js';
import { resolveGroup, MUSCLE_BY_ID } from './legacy/muscle-map.js';
import { CAMERA_PRESETS } from './player.js';
import { createThumbnailRenderer, fitThumbnailCamera, thumbnailDensity } from './thumbnail.js';
import { sceneStrings } from './localization.js';

export function createDetailView(player, phaseMap, onModelChange, focusDirection = () => null) {
  let saved = null, selected = null, model = 'motion', views = {};
  const miniCamera = new THREE.PerspectiveCamera(32, 1, 0.02, 40);
  const mini = document.createElement('button'); mini.className = 'minimap'; mini.hidden = true;
  // Embedded hosts place their accessible tap target over this same card.
  // The DOM button remains a fallback for a direct scene preview.
  if (window.parent !== window || window.FlareHost) { mini.tabIndex = -1; mini.setAttribute('aria-hidden', 'true'); }
  mini.innerHTML = '<span>肌群图</span>'; player.container.append(mini);
  const miniImage = document.createElement('canvas'); miniImage.setAttribute('aria-hidden', 'true'); mini.append(miniImage);
  const thumbnail = createThumbnailRenderer(player.renderer, miniImage);
  let thumbnailKey = null, thumbnailEnvironment = null;
  // A model swap can arrive before the detail camera finishes gliding. Save
  // its destination so returning to the locked athlete view cannot strand
  // it at a partly framed angle. Idle/orbit views still save their exact view.
  const snapshot = () => ({
    position: (player.glide?.toP ?? player.camera.position).clone(),
    target: (player.glide?.toT ?? player.controls.target).clone(),
  });
  const restore = (view, glide = false) => glide ? player.glideTo(view.position, view.target) : player.setCameraView(view.position, view.target);

  function muscleDirection(groupId) {
    const centres = (resolveGroup(groupId)?.muscles ?? []).map(id => MUSCLE_BY_ID[id]?.centre).filter(Boolean);
    const back = centres.length && centres.reduce((sum, p) => sum + p[2], 0) / centres.length < -0.01;
    return new THREE.Vector3(0, 0.10, back ? -1 : 1);
  }
  function motionDirection() {
    // Curated angle: face the tinted surface in this exact pose, from a gentle
    // elevation, never from below. Falls back to the standard three-quarter.
    return focusDirection() ?? CAMERA_PRESETS.standard.clone();
  }
  function fullMotionBounds() {
    const b = player.getMetrics().bounds;
    return new THREE.Box3(new THREE.Vector3().fromArray(b.min), new THREE.Vector3().fromArray(b.max)).expandByScalar(0.04);
  }
  function fit(phase, direction = null, glide = false) {
    if (!selected) return;
    // Both views always frame the whole body; no partial close-ups.
    const box = model === 'muscles' ? phaseMap.getFullBounds().expandByScalar(0.035) : fullMotionBounds();
    const dir = direction ?? (model === 'muscles' ? muscleDirection(selected) : motionDirection());
    player.fitBounds(box, dir, model === 'muscles' ? 1.08 : 1.04, glide); player.autoFrame = false;
  }
  function lockCamera() {
    // The athlete opens on a curated angle and may be turned in any
    // direction, but never zoomed or panned: the whole body stays framed.
    // The upright reference keeps free rotation and zoom for anatomy study.
    const athlete = !!selected && model === 'motion';
    player.controls.enabled = true; player.controls.enableRotate = true;
    player.controls.enableZoom = !athlete; player.controls.enablePan = false;
  }
  function fadeIn() {
    // Swapping athlete <-> reference model dissolves in instead of cutting.
    const canvas = player.renderer.domElement;
    canvas.classList.remove('model-swap'); void canvas.offsetWidth; canvas.classList.add('model-swap');
  }
  function showScene() {
    thumbnailKey = null;
    lockCamera(); phaseMap.refreshEnvironment(); player.setDisplayScene(model === 'muscles' ? phaseMap.scene : null);
    updateLocalization();
  }
  function updateLocalization() {
    mini.querySelector('span').textContent = model === 'motion' ? sceneStrings.muscleMap ?? '肌群图' : sceneStrings.motion ?? '动作';
    mini.setAttribute('aria-label', model === 'motion' ? sceneStrings.switchToMuscles ?? 'Muscles' : sceneStrings.switchToMotion ?? 'Motion');
  }
  function open(groupId, phase) {
    const entering = !saved, changed = selected !== groupId;
    if (entering) {
      saved = { ...snapshot(), framingMode: player.framingMode, autoFrame: player.autoFrame };
      model = 'motion'; views = {};
    }
    player.autoFrame = false; player.setFramingMode('detail');
    selected = groupId; mini.hidden = false; phaseMap.setDetail(groupId, phase); showScene();
    // Opening or moving to another muscle glides the camera there.
    if (entering || changed) { views = {}; fit(phase, null, true); }
  }
  function setModel(value, phase) {
    if (!selected || !['motion', 'muscles'].includes(value) || value === model) return false;
    views[model] = snapshot(); model = value; showScene(); fadeIn();
    if (views[model]) restore(views[model]); else fit(phase);
    player.autoFrame = false; player.dirty = true; return true;
  }
  function close() {
    player.setDisplayScene(null); phaseMap.restorePhase();
    if (saved) {
      const home = saved; saved = null;
      player.autoFrame = false; player.setFramingMode(home.framingMode); restore(home, true); player.autoFrame = home.autoFrame;
    }
    selected = null; model = 'motion'; views = {}; mini.hidden = true; lockCamera();
  }
  function reset(phase, direction = null) {
    if (!selected) return;
    views = {}; fit(phase, model === 'motion' ? null : direction ?? muscleDirection(selected), true);
  }
  function refit(phase) {
    if (!selected) return;
    const direction = model === 'motion' ? null : player.camera.position.clone().sub(player.controls.target);
    // A resize (the stage growing for detail) re-frames smoothly.
    views = {}; fit(phase, direction, true);
  }
  function toggle(phase) {
    // A visible pointer action can refocus an embedded view after host blur.
    player.setVisible(true);
    if (setModel(model === 'motion' ? 'muscles' : 'motion', phase)) onModelChange?.(model);
  }
  function renderMini() {
    if (!selected || mini.hidden) return false;
    // Layout dimensions exclude the entrance animation's scale. A moving
    // card reuses its sharp bitmap instead of doing GPU readbacks each frame.
    const width = miniImage.clientWidth, height = miniImage.clientHeight;
    if (!(width > 0 && height > 0)) return false;
    const alternate = model === 'motion' ? 'muscles' : 'motion';
    const direction = alternate === 'muscles' ? muscleDirection(selected) : (views.motion ? views.motion.position.clone().sub(views.motion.target) : motionDirection());
    const density = thumbnailDensity(player.quality);
    const key = [alternate, selected, player.time, width, height, density, player.quality, player.renderer.toneMappingExposure, ...direction.toArray()].join(':');
    if (key === thumbnailKey && thumbnailEnvironment === player.scene.environment) return true;
    const box = alternate === 'muscles' ? phaseMap.getFullBounds() : fullMotionBounds();
    fitThumbnailCamera(miniCamera, box, direction, width, height);
    phaseMap.refreshEnvironment();
    phaseMap.withThumbnailDensity(density, () => thumbnail.render(alternate === 'muscles' ? phaseMap.scene : player.scene, miniCamera, width, height, density, alternate === 'muscles'));
    thumbnailKey = key; thumbnailEnvironment = player.scene.environment;
    return true;
  }
  function releaseGpu() { thumbnail.dispose(); thumbnailKey = null; thumbnailEnvironment = null; }
  return { open, close, toggle, setModel, reset, refit, renderMini, releaseGpu, updateLocalization, mini, getModel: () => model,
    dispose() { close(); releaseGpu(); mini.remove(); } };
}
