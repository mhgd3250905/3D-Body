import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { applyToon } from './toon-r6.js';
import { applyFx } from './fx.js';
import { createBodyHulls } from './framing.js';
import { createV5Pose } from './pose.js';

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

async function loadMotion(name) {
  const response = await fetch(asset(name));
  if (!response.ok) throw Error('V5 motion load failed: ' + name);
  return response.json();
}

function disposeActor(root) {
  const resources = new Set();
  root.removeFromParent();
  root.traverse(object => {
    if (object.geometry) resources.add(object.geometry);
    if (object.material) {
      for (const material of [].concat(object.material)) resources.add(material);
    }
    if (object.skeleton) resources.add(object.skeleton);
  });
  for (const resource of resources) resource.dispose();
}

// The host scene owns its camera, floor, lighting and frame loop.
export async function loadFlareV5(renderer, { scene }) {
  const [gltf, anim, wrists] = await Promise.all([
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(asset('coach-v3r3-wristfix.glb')),
    loadMotion('flare-arm8legs-v3r3.json'),
    loadMotion('flare-arm8legs-v3r3.wrist-helpers.json'),
  ]);
  const root = gltf.scene, bones = {}, skinned = [];
  let fx;
  try {
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
    const neutralPelvis = bones.pelvis.position.clone();

    const toon = applyToon({ root, bones, skinned, renderer });
    await toon.hairReady;
    const hair = bones.head.getObjectByName('hair-spiky');
    if (!hair) throw Error('V5 hair unavailable');
    // Align the supplied rig to the legacy stage envelope once. The common
    // ground height and all of the host camera parameters stay intact.
    root.scale.multiplyScalar(0.93);
    root.position.x += 0.002;
    root.position.z += 0.027;
    scene.add(root);
    root.updateMatrixWorld(true);

    const shadowCasters = [...skinned];
    hair.traverse(object => {
      if (object.isMesh && !object.userData.__outline) shadowCasters.push(object);
    });
    const skeletons = [...new Set(skinned.map(mesh => mesh.skeleton))];
    const pose = createV5Pose(bones, anim, wrists);
    const world = new THREE.Vector3();
    const getBodyHulls = createBodyHulls(skinned, hair);
    let frame = -1;
    let displayedFx = false;

    function updateSkinning() {
      root.updateMatrixWorld(true);
      for (const skeleton of skeletons) skeleton.update();
    }
    function setProgress(progress) {
      const sampledFrame = (((progress % 1) + 1) % 1) * anim.count;
      if (frame === sampledFrame) return;
      frame = sampledFrame;
      pose.apply(frame);
      updateSkinning();
    }
    setProgress(0);
    // The original host shadow receiver still owns the ground. Reuse the
    // V5 trail, particles and contact rings without layering a second shadow.
    fx = applyFx({
      scene, root, bones, skinned, renderer, anim, jointIds: pose.mainNames,
      getFrame: () => displayedFx ? frame : null,
      getFrames: () => anim.frames,
      params: { shadow: false },
    });

    return {
      period: anim.count / anim.fps,
      fps: anim.fps, root, skinned, scene, getBodyHulls, setProgress,
      setFxEnabled(enabled) { displayedFx = enabled; },
      setShadowsEnabled(enabled) {
        for (const object of shadowCasters) object.castShadow = enabled;
      },
      resetPose() {
        frame = -1;
        for (const bone of Object.values(bones)) bone.quaternion.identity();
        bones.pelvis.position.copy(neutralPelvis);
        updateSkinning();
      },
      joint(name, local = null) {
        const bone = bones[name];
        if (local) return bone.localToWorld(world.fromArray(local)).toArray();
        return bone.getWorldPosition(world).toArray();
      },
      dispose() {
        fx.dispose();
        disposeActor(root);
      },
    };
  } catch (error) {
    fx?.dispose();
    disposeActor(root);
    throw error;
  }
}
