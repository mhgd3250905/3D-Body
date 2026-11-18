import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { installWristFix } from './wristfix-r2.js';
import { applyToon } from './toon-r6.js';
import { applyFx } from './fx.js';
import { createFraming } from './framing.js';

const parents = {
  spineLower: 'pelvis', spineUpper: 'spineLower', torso: 'spineUpper',
  neck: 'torso', head: 'neck',
};
for (const side of ['left', 'right']) {
  Object.assign(parents, {
    [side + 'Scapula']: 'torso',
    [side + 'UpperArm']: side + 'Scapula',
    [side + 'Forearm']: side + 'UpperArm',
    [side + 'Hand']: side + 'Forearm',
    [side + 'Thigh']: 'pelvis',
    [side + 'Shin']: side + 'Thigh',
    [side + 'Patella']: side + 'Shin',
    [side + 'Foot']: side + 'Shin',
  });
  for (let i = 1; i <= 6; i++) parents[side + 'ForearmTwist' + i] = side + 'Forearm';
  for (let i = 1; i <= 2; i++) parents[side + 'WristBend' + i] = side + 'Forearm';
}

const asset = name => new URL('./v5/' + name, document.baseURI).href;
const vertical = new THREE.Vector3(0, 1, 0);

export async function loadFlareV5(renderer) {
  const [gltf, anim] = await Promise.all([
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(asset('coach-v3r3-wristfix.glb')),
    fetch(asset('flare-arm8legs-v3r3.json')).then(response => {
      if (!response.ok) throw Error('V5 motion load failed');
      return response.json();
    }),
  ]);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(2, 48).rotateX(-Math.PI / 2));
  scene.add(gltf.scene, floor);
  const root = gltf.scene, bones = {}, skinned = [];
  root.updateMatrixWorld(true);
  root.traverse(object => {
    if (object.isBone) bones[object.name] = object;
    if (object.isSkinnedMesh) {
      if (!object.geometry.getAttribute('_region')) throw Error('V5 mesh has no material regions');
      object.geometry.deleteAttribute('color');
      skinned.push(object);
      object.frustumCulled = false;
    }
  });
  for (const [child, parent] of Object.entries(parents)) {
    if (!bones[child] || !bones[parent]) throw Error('V5 rig missing ' + child);
    bones[parent].attach(bones[child]);
  }
  for (const bone of Object.values(bones)) bone.quaternion.identity();
  root.updateMatrixWorld(true);

  // This WebGL renderer belongs exclusively to V5. The delivered runtime
  // wrapper drives the helpers exactly once before toon and FX rendering.
  const wrist = installWristFix({ bones, renderer });
  const toon = applyToon({ scene, root, bones, skinned, floor, renderer, camera });
  await toon.hairReady;
  const hair = bones.head.getObjectByName('hair-spiky');
  if (!wrist || !hair) throw Error('V5 wrist or hair unavailable');

  const target = new THREE.Vector3().fromArray(anim.cams.v0.t);
  const offset = new THREE.Vector3().fromArray(anim.cams.v0.p).sub(target);
  const joints = Object.keys(anim.frames[0].q);
  const fit = createFraming(skinned, hair, anim.cams.v0.f);
  let index = 0, displayedFx = true;
  function pose(frame) {
    const item = anim.frames[frame];
    for (const name of joints) bones[name].quaternion.fromArray(item.q[name]).normalize();
    bones.pelvis.position.fromArray(item.p);
  }
  pose(index);
  applyFx({
    scene, root, bones, skinned, renderer, anim, jointIds: joints,
    getFrame: () => displayedFx ? index : null,
    getFrames: () => anim.frames,
  });
  const size = new THREE.Vector2();
  return {
    period: anim.count / anim.fps,
    render(progress, { fxEnabled = true, yaw = 0 } = {}) {
      index = Math.min(anim.count - 1, Math.floor(((progress % 1 + 1) % 1) * anim.count));
      displayedFx = fxEnabled;
      pose(index);
      root.updateMatrixWorld(true);
      renderer.getSize(size);
      camera.position.copy(offset).applyAxisAngle(vertical, yaw).add(target);
      camera.lookAt(target);
      fit(camera, Math.max(1, size.x), Math.max(1, size.y));
      renderer.render(scene, camera);
    },
    dispose() {
      const resources = new Set();
      scene.traverse(object => {
        if (object.geometry) resources.add(object.geometry);
        if (object.material) {
          for (const value of [].concat(object.material)) resources.add(value);
        }
        if (object.skeleton) resources.add(object.skeleton);
      });
      for (const resource of resources) resource.dispose();
    },
  };
}
