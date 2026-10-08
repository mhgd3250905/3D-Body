import * as THREE from 'three';
import { GROUPS } from './phase.js';

export function createDetailView(player) {
  let saved = null, selected = null, showFull = false;
  const miniCamera = new THREE.PerspectiveCamera(32, 1, 0.02, 40);
  const mini = document.createElement('button'); mini.className = 'minimap'; mini.hidden = true;
  mini.setAttribute('aria-label', '切换全身或局部视图'); mini.innerHTML = '<span>全身定位 ↗</span>';
  player.container.append(mini);

  function fit(groupId, phase) {
    const group = GROUPS[groupId], J = player.getMetrics().joints;
    const item = phase.items.find(value => value.groupId === groupId);
    const side = item?.side === 'left' || item?.side === 'right' ? item.side : phase.support === 'both' ? (player.camera.position.x > 0 ? 'left' : 'right') : phase.support;
    const names = group.section === 'support'
      ? [side + 'Shoulder', side + 'Elbow', side + 'Palm', 'head', 'rightHip', 'leftHip', other(side) + 'Shoulder']
      : group.section === 'core' ? ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'pelvis', 'head']
        : ['leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 'pelvis'];
    const box = new THREE.Box3(); for (const name of names) if (J[name]) box.expandByPoint(new THREE.Vector3().fromArray(J[name]));
    box.expandByScalar(group.section === 'support' ? 0.10 : 0.12);
    const direction = player.camera.position.clone().sub(player.controls.target);
    player.fitBounds(box, direction, 1.02);
  }
  function open(groupId, phase) {
    if (!saved) saved = { position: player.camera.position.clone(), target: player.controls.target.clone(), framingMode: player.framingMode };
    player.setFramingMode('detail');
    selected = groupId; showFull = false; mini.hidden = false; fit(groupId, phase);
  }
  function close() {
    if (saved) {
      player.setFramingMode(saved.framingMode);
      player.camera.position.copy(saved.position); player.controls.target.copy(saved.target); player.controls.update();
      saved = null; player.dirty = true;
    }
    selected = null; mini.hidden = true;
  }
  function toggle(phase) {
    if (!selected) return;
    showFull = !showFull;
    if (showFull) {
      const b = player.getMetrics().bounds, box = new THREE.Box3(new THREE.Vector3().fromArray(b.min), new THREE.Vector3().fromArray(b.max));
      player.fitBounds(box.expandByScalar(0.04), player.camera.position.clone().sub(player.controls.target), 0.88);
    } else fit(selected, phase);
    mini.querySelector('span').textContent = showFull ? '返回局部 ↗' : '全身定位 ↗';
  }
  function renderMini() {
    if (!selected || mini.hidden) return;
    const rect = mini.getBoundingClientRect(), stage = player.container.getBoundingClientRect();
    const width = rect.width, height = rect.height, x = rect.left - stage.left, y = stage.height - (rect.bottom - stage.top);
    const bounds = player.getMetrics().bounds;
    const box = new THREE.Box3(new THREE.Vector3().fromArray(bounds.min), new THREE.Vector3().fromArray(bounds.max));
    const center = box.getCenter(new THREE.Vector3()), radius = box.getSize(new THREE.Vector3()).length() / 2;
    const direction = player.camera.position.clone().sub(player.controls.target).normalize();
    miniCamera.aspect = width / height; miniCamera.updateProjectionMatrix();
    miniCamera.position.copy(center).addScaledVector(direction, radius / Math.sin(THREE.MathUtils.degToRad(16)) * 1.05); miniCamera.lookAt(center);
    const renderer = player.renderer;
    renderer.setScissorTest(true); renderer.setScissor(x, y, width, height); renderer.setViewport(x, y, width, height);
    renderer.setClearColor(0x171922, 1); renderer.render(player.scene, miniCamera);
    renderer.setScissorTest(false); renderer.setViewport(0, 0, stage.width, stage.height); renderer.setClearColor(0x101116, 0);
  }
  return { open, close, toggle, renderMini, mini, dispose() { close(); mini.remove(); } };
}
const other = side => side === 'left' ? 'right' : 'left';
