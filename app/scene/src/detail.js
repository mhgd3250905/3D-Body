import * as THREE from 'three';
import { GROUPS } from './phase.js';
import { resolveGroup, MUSCLE_BY_ID } from './legacy/muscle-map.js';
import { CAMERA_PRESETS } from './player.js';
import { mixColor, themeSettling } from './theme.js';

export function createDetailView(player, phaseMap, onModelChange, focusDirection = () => null) {
  let saved = null, selected = null, model = 'motion', views = {};
  const miniCamera = new THREE.PerspectiveCamera(32, 1, 0.02, 40);
  const mini = document.createElement('button'); mini.className = 'minimap'; mini.hidden = true;
  // Embedded hosts place their accessible tap target over this same card.
  // The DOM button remains a fallback for a direct scene preview.
  if (window.parent !== window || window.FlareHost) { mini.tabIndex = -1; mini.setAttribute('aria-hidden', 'true'); }
  mini.innerHTML = '<span>肌群图</span>'; player.container.append(mini);
  const snapshot = () => ({ position: player.camera.position.clone(), target: player.controls.target.clone() });
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
    // The athlete is shown only from a curated angle: no orbit, no zoom.
    // The upright reference keeps free rotation for anatomy study.
    const locked = !!selected && model === 'motion';
    player.controls.enabled = !locked; player.controls.enableZoom = !locked;
  }
  function fadeIn() {
    // Swapping athlete <-> reference model dissolves in instead of cutting.
    const canvas = player.renderer.domElement;
    canvas.classList.remove('model-swap'); void canvas.offsetWidth; canvas.classList.add('model-swap');
  }
  function showScene() {
    lockCamera(); phaseMap.refreshEnvironment(); player.setDisplayScene(model === 'muscles' ? phaseMap.scene : null);
    mini.querySelector('span').textContent = model === 'motion' ? '肌群图' : '动作';
    mini.setAttribute('aria-label', model === 'motion' ? '切换到全身肌群模型' : '切换到托马斯动作');
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
    if (!selected || mini.hidden) return;
    const rect = mini.getBoundingClientRect(), stage = player.container.getBoundingClientRect();
    if (!(rect.width > 0 && rect.height > 0)) return;
    const width = rect.width, height = rect.height, x = rect.left - stage.left, y = stage.height - (rect.bottom - stage.top);
    const alternate = model === 'motion' ? 'muscles' : 'motion';
    const b = player.getMetrics().bounds;
    const box = alternate === 'muscles' ? phaseMap.getFullBounds() : new THREE.Box3(new THREE.Vector3().fromArray(b.min), new THREE.Vector3().fromArray(b.max));
    const center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    const direction = alternate === 'muscles' ? muscleDirection(selected) : (views.motion ? views.motion.position.clone().sub(views.motion.target) : motionDirection());
    miniCamera.aspect = width / height; miniCamera.updateProjectionMatrix();
    const vertical = Math.tan(THREE.MathUtils.degToRad(16)), distance = Math.max(size.y / 2 / vertical, size.x / 2 / (vertical * miniCamera.aspect)) + size.z;
    miniCamera.position.copy(center).addScaledVector(direction.normalize(), distance * 1.12); miniCamera.lookAt(center);
    phaseMap.refreshEnvironment();
    const renderer = player.renderer, previous = { viewport: renderer.getViewport(new THREE.Vector4()), scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest(), color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha() };
    try {
      renderer.setScissorTest(true); renderer.setScissor(x, y, width, height); renderer.setViewport(x, y, width, height);
      renderer.setClearColor(mixColor(0x171922, 0xeceae5), 1); if (themeSettling()) player.dirty = true; renderer.render(alternate === 'muscles' ? phaseMap.scene : player.scene, miniCamera);
    } finally {
      renderer.setViewport(previous.viewport); renderer.setScissor(previous.scissor); renderer.setScissorTest(previous.scissorTest); renderer.setClearColor(previous.color, previous.alpha);
    }
  }
  return { open, close, toggle, setModel, reset, refit, renderMini, mini, getModel: () => model,
    dispose() { close(); mini.remove(); } };
}
