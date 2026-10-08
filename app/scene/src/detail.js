import * as THREE from 'three';
import { GROUPS } from './phase.js';
import { resolveGroup, MUSCLE_BY_ID } from './legacy/muscle-map.js';
import { CAMERA_PRESETS } from './player.js';

export function createDetailView(player, phaseMap, onModelChange) {
  let saved = null, selected = null, model = 'motion', views = {};
  const miniCamera = new THREE.PerspectiveCamera(32, 1, 0.02, 40);
  const mini = document.createElement('button'); mini.className = 'minimap'; mini.hidden = true;
  // Embedded hosts place their accessible tap target over this same card.
  // The DOM button remains a fallback for a direct scene preview.
  if (window.parent !== window || window.FlareHost) { mini.tabIndex = -1; mini.setAttribute('aria-hidden', 'true'); }
  mini.innerHTML = '<span>查看肌群 ↗</span>'; player.container.append(mini);
  const snapshot = () => ({ position: player.camera.position.clone(), target: player.controls.target.clone() });
  const restore = view => player.setCameraView(view.position, view.target);

  function muscleDirection(groupId) {
    const centres = (resolveGroup(groupId)?.muscles ?? []).map(id => MUSCLE_BY_ID[id]?.centre).filter(Boolean);
    const back = centres.length && centres.reduce((sum, p) => sum + p[2], 0) / centres.length < -0.01;
    return new THREE.Vector3(0, 0.10, back ? -1 : 1);
  }
  function motionBounds(phase) {
    const group = GROUPS[selected], J = player.getMetrics().joints;
    const item = phase.items.find(value => value.groupId === selected);
    const side = item?.side === 'left' || item?.side === 'right' ? item.side : phase.support === 'both' ? (player.camera.position.x > 0 ? 'left' : 'right') : phase.support;
    const names = group.section === 'support'
      ? [side + 'Shoulder', side + 'Elbow', side + 'Palm', 'head', 'rightHip', 'leftHip', other(side) + 'Shoulder']
      : group.section === 'core' ? ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'pelvis', 'head']
        : ['leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 'pelvis'];
    const box = new THREE.Box3(); for (const name of names) if (J[name]) box.expandByPoint(new THREE.Vector3().fromArray(J[name]));
    return box.expandByScalar(group.section === 'support' ? 0.10 : 0.12);
  }
  function fit(phase, direction = null) {
    if (!selected) return;
    const box = model === 'muscles' ? phaseMap.getFullBounds().expandByScalar(0.035) : motionBounds(phase);
    const dir = direction ?? (model === 'muscles' ? muscleDirection(selected) : player.camera.position.clone().sub(player.controls.target));
    player.fitBounds(box, dir, 1.08); player.autoFrame = false;
  }
  function showScene() {
    phaseMap.refreshEnvironment(); player.setDisplayScene(model === 'muscles' ? phaseMap.scene : null);
    mini.querySelector('span').textContent = model === 'motion' ? '查看肌群 ↗' : '查看动作 ↗';
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
    if (entering || changed) { views = {}; fit(phase); }
  }
  function setModel(value, phase) {
    if (!selected || !['motion', 'muscles'].includes(value) || value === model) return false;
    views[model] = snapshot(); model = value; showScene();
    if (views[model]) restore(views[model]); else fit(phase);
    player.autoFrame = false; player.dirty = true; return true;
  }
  function close() {
    player.setDisplayScene(null); phaseMap.restorePhase();
    if (saved) {
      const home = saved; saved = null;
      player.autoFrame = false; player.setFramingMode(home.framingMode); restore(home); player.autoFrame = home.autoFrame;
    }
    selected = null; model = 'motion'; views = {}; mini.hidden = true;
  }
  function reset(phase, direction = null) {
    if (!selected) return;
    views = {}; fit(phase, direction ?? (model === 'muscles' ? muscleDirection(selected) : CAMERA_PRESETS.standard));
  }
  function refit(phase) {
    if (!selected) return;
    const direction = player.camera.position.clone().sub(player.controls.target);
    views = {}; fit(phase, direction);
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
    const direction = alternate === 'muscles' ? muscleDirection(selected) : (views.motion ? views.motion.position.clone().sub(views.motion.target) : CAMERA_PRESETS.standard.clone());
    miniCamera.aspect = width / height; miniCamera.updateProjectionMatrix();
    const vertical = Math.tan(THREE.MathUtils.degToRad(16)), distance = Math.max(size.y / 2 / vertical, size.x / 2 / (vertical * miniCamera.aspect)) + size.z;
    miniCamera.position.copy(center).addScaledVector(direction.normalize(), distance * 1.12); miniCamera.lookAt(center);
    phaseMap.refreshEnvironment();
    const renderer = player.renderer, previous = { viewport: renderer.getViewport(new THREE.Vector4()), scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest(), color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha() };
    try {
      renderer.setScissorTest(true); renderer.setScissor(x, y, width, height); renderer.setViewport(x, y, width, height);
      renderer.setClearColor(0x171922, 1); renderer.render(alternate === 'muscles' ? phaseMap.scene : player.scene, miniCamera);
    } finally {
      renderer.setViewport(previous.viewport); renderer.setScissor(previous.scissor); renderer.setScissorTest(previous.scissorTest); renderer.setClearColor(previous.color, previous.alpha);
    }
  }
  return { open, close, toggle, setModel, reset, refit, renderMini, mini, getModel: () => model,
    dispose() { close(); mini.remove(); } };
}
const other = side => side === 'left' ? 'right' : 'left';
