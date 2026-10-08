import * as THREE from 'three';
import * as MM from './legacy/muscle-map.js';
import { GROUPS, phaseAt } from './phase.js';
import { loadOfflineGlb } from './assets.js';

// Two views of the supplied mature CC0 mannequin. This remains a static
// teaching reference: phase colors follow Snow's clock, not its skeleton.
// Both views share the main WebGL context and one copy of the model.
export async function createPhaseMap(player, onSelect) {
  const { scene: model } = await loadOfflineGlb('./anatomy/mannequin-reference.meshopt.glb.gz');
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#1f1f24'); scene.add(model);
  scene.add(new THREE.HemisphereLight(0xeaf2ff, 0x34333d, 2));
  const key = new THREE.DirectionalLight(0xfff2e4, 3); key.position.set(-2, 3, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe7ecff, 2); fill.position.set(2, 2, -3); scene.add(fill);
  const uniforms = MM.createMuscleUniforms(); uniforms.mmMulti.value = 1; uniforms.mmReveal.value = 1; uniforms.mmTime.value = 0.654;
  uniforms.mmBase.value.set('#727b8b'); uniforms.mmSkin.value.set('#565f70'); uniforms.mmGroove.value.set('#2b3343');
  const meshes = [], materials = new Set();
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    for (const material of [].concat(mesh.material)) material.dispose();
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0 });
    MM.applyMuscleMap(material, uniforms); mesh.material = material; meshes.push(mesh); materials.add(material);
  });
  model.updateMatrixWorld(true);
  const cameras = [1, -1].map(sign => {
    const camera = new THREE.PerspectiveCamera(26, 0.5, 0.02, 20);
    camera.position.set(0, 0.845, sign * 4.0); camera.lookAt(0, 0.845, 0); camera.updateMatrixWorld(true); return camera;
  });
  const panel = document.createElement('aside'); panel.className = 'phase-map'; panel.setAttribute('aria-label', '随动作阶段同步的肌群正面和背面定位图');
  panel.innerHTML = '<header><i></i><span>同步发力</span></header><div class="phase-map-view"><span>正面</span><span>背面</span></div><div class="phase-map-legend"></div>';
  player.container.append(panel);
  const view = panel.querySelector('.phase-map-view'), legend = panel.querySelector('.phase-map-legend');
  // Keep one WebGL context. A tiny 2D crop puts the already-rendered views
  // inside the glass card, above its background and within its rounded clip.
  const thumbnail = document.createElement('canvas'); thumbnail.setAttribute('aria-hidden', 'true'); view.prepend(thumbnail);
  const thumbnailContext = thumbnail.getContext('2d');
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), local = new THREE.Vector3();
  let source = null, hidden = false, legendItems = [];
  const shortNames = { 'hip-abductors': '臀中肌', abs: '腹直肌', 'rotator-cuff': '肩袖', forearms: '前臂', scapular: '肩胛肌群', adductors: '内收肌' };
  function select(event) {
    const r = view.getBoundingClientRect(), half = r.width / 2;
    const side = event.clientX - r.left < half ? 0 : 1;
    ndc.set((event.clientX - r.left - half * side) / half * 2 - 1, -(event.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, cameras[side]);
    const phase = phaseAt(player.time);
    for (const hit of ray.intersectObjects(meshes)) {
      const muscle = MM.muscleAt(hit.object.worldToLocal(local.copy(hit.point)), 1.69); if (!muscle) continue;
      const candidates = Object.entries(MM.GROUP_MUSCLES).filter(([id, definition]) => GROUPS[id] && definition.muscles.includes(muscle.id)).map(([id]) => id);
      const groupId = candidates.find(id => phase.items.some(item => item.groupId === id && (item.side === 'both' || item.side === muscle.side))) ?? candidates[0];
      if (groupId) { onSelect(groupId); return; }
    }
  }
  view.addEventListener('click', select);
  function render() {
    if (hidden) return;
    const phase = phaseAt(player.time);
    if (phase.source !== source) {
      source = phase.source; const selected = [];
      for (const item of phase.items) {
        const group = MM.resolveGroup(item.groupId); if (!group) continue;
        for (const muscle of group.muscles) selected.push({ muscle, side: item.side, colour: item.colour,
          level: group.deep && item.level === 'primary' ? 'deep' : item.level, dim: item.level === 'primary' ? 0 : 0.5 });
      }
      MM.setMuscleSelection(uniforms, selected);
      // Three concise real groups: one per support/core/legs role. For phase
      // 11 these are exactly h1's 三角肌、腹斜肌、臀中肌. Other phases follow data.
      legendItems = ['support', 'core', 'legs'].map(section => phase.items.find(item => GROUPS[item.groupId].section === section && item.level === 'primary')
        ?? phase.items.find(item => GROUPS[item.groupId].section === section)).filter(Boolean);
      legend.replaceChildren();
      for (const item of legendItems) {
        const button = document.createElement('button'); button.type = 'button';
        button.dataset.groupId = item.groupId; button.setAttribute('aria-label', '查看' + item.label);
        const dot = document.createElement('i'); dot.style.background = item.colour;
        button.append(dot, shortNames[item.groupId] ?? item.label); button.addEventListener('click', () => onSelect(item.groupId)); legend.append(button);
      }
    }
    const r = view.getBoundingClientRect(), s = player.container.getBoundingClientRect(), half = r.width / 2, y = s.height - (r.bottom - s.top);
    const renderer = player.renderer; scene.environment = player.scene.environment;
    renderer.setScissorTest(true);
    for (let i = 0; i < 2; i++) {
      cameras[i].aspect = half / r.height; cameras[i].updateProjectionMatrix();
      const x = r.left - s.left + half * i;
      renderer.setScissor(x, y, half, r.height); renderer.setViewport(x, y, half, r.height); renderer.render(scene, cameras[i]);
    }
    const ratio = renderer.getPixelRatio(), outputWidth = Math.round(r.width * ratio), outputHeight = Math.round(r.height * ratio);
    if (thumbnail.width !== outputWidth || thumbnail.height !== outputHeight) { thumbnail.width = outputWidth; thumbnail.height = outputHeight; }
    thumbnailContext.drawImage(renderer.domElement, (r.left - s.left) * ratio, (r.top - s.top) * ratio, r.width * ratio, r.height * ratio, 0, 0, outputWidth, outputHeight);
    renderer.setScissorTest(false); renderer.setViewport(0, 0, s.width, s.height); renderer.setClearColor(0x101116, 0);
  }
  function setHidden(value) { hidden = value; panel.hidden = value; player.dirty = true; }
  function releaseGpu() { for (const mesh of meshes) mesh.geometry.dispose(); for (const material of materials) material.dispose(); }
  return { render, setHidden, releaseGpu, getState: () => ({ phase: source, hidden, views: ['front', 'back'], legend: legendItems.map(item => ({ groupId: item.groupId, label: shortNames[item.groupId] ?? item.label })), referencePose: 'static CC0 mannequin' }),
    dispose() { releaseGpu(); view.removeEventListener('click', select); panel.remove(); } };
}
