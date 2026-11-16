import * as THREE from 'three';
import { GROUPS, phaseTicks } from './phase.js';
import angleBounds from './training-hub-angle-bounds.json' with { type: 'json' };
import { fitHubAngle } from './training-hub-angle-fit.js';
import { createHubTransitions } from './training-hub-transitions.js';

const noPhase = { items: [] };
const angleSources = new Set(phaseTicks.map(tick => tick.phase));
const transparent = new THREE.Color(0);
export const hubMuscleCutoff = .62;
const standingStageHeight = 400;
const angleStageHeight = 452;
const maximumMuscleZoom = 1.35;
const maximumFocusSpan = .25;

function placeCamera(camera, shot, aspect, scale) {
  camera.position.setFromSpherical(shot.orbit).add(shot.target);
  camera.lookAt(shot.target);
  camera.aspect = aspect;
  camera.fov = shot.fov;
  camera.zoom = scale;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}

export function getHubMuscleFrame(scene, bounds) {
  const silhouette = [], vertex = new THREE.Vector3();
  scene.traverse(mesh => {
    if (!mesh.isMesh) return;
    const position = mesh.geometry.attributes.position;
    for (let index = 0; index < position.count; index++) {
      vertex.fromBufferAttribute(position, index).applyMatrix4(mesh.matrixWorld);
      if (vertex.y >= bounds.max.y - .065 || (vertex.y >= hubMuscleCutoff && vertex.y <= hubMuscleCutoff + .02)) {
        silhouette.push(vertex.clone());
      }
    }
  });
  return { bounds, silhouette };
}

export function fitHubMuscle(camera, { bounds, silhouette }, height) {
  // Set vertical size from the full stage, including its controls. Reduce
  // further only when required by the lateral margins of a narrow screen.
  const point = new THREE.Vector3();
  let horizontal = 0;
  for (const x of [bounds.min.x, bounds.max.x]) for (const y of [hubMuscleCutoff, bounds.max.y]) {
    for (const z of [bounds.min.z, bounds.max.z]) {
      point.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
      horizontal = Math.max(horizontal, Math.abs(point.x / point.z));
    }
  }
  let top = 0, bottom = 0;
  for (const vertex of silhouette) {
    point.copy(vertex).applyMatrix4(camera.matrixWorldInverse);
    const y = -point.y / point.z;
    top = Math.max(top, y);
    bottom = Math.max(bottom, -y);
  }
  const vertical = (top + bottom) * .5;
  const tangent = Math.max(horizontal / (.70 * camera.aspect), vertical * height / (.70 * standingStageHeight),
    top / .985, bottom / .985);
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(tangent));
  camera.updateProjectionMatrix();
}

export function resolveHubMuscleCamera(camera, frame, raw, width, height, focused) {
  if (!raw || ![raw.position, raw.target].every(value =>
    Array.isArray(value) && value.length === 3 && value.every(Number.isFinite)) ||
    !(width > 0 && height > 0) || !Number.isFinite(raw.overviewHeight)) return null;
  const overviewDistance = Math.abs(raw.position[2]);
  if (overviewDistance <= .1) return null;
  camera.position.set(0, raw.overviewHeight, overviewDistance);
  camera.lookAt(0, raw.overviewHeight, 0);
  camera.aspect = width / height;
  camera.zoom = 1;
  camera.updateMatrixWorld(true);
  fitHubMuscle(camera, frame, height);
  if (!focused) return { ...raw, fov: camera.fov, cutoff: hubMuscleCutoff };

  const region = raw.region;
  if (!Array.isArray(region) || region.length !== 3 || !region.every(value => Number.isFinite(value) && value > 0)) return null;
  const [halfWidth, halfHeight, nearest] = region;
  const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const { min, max } = frame.bounds;
  const nearestProfile = Math.hypot(Math.max(Math.abs(min.x), Math.abs(max.x)), Math.max(Math.abs(min.z), Math.abs(max.z)));
  // Enforce magnification in projected space, including surfaces nearer to
  // the lens than the pivot. The silhouette bound covers every orbit yaw.
  const zoomLimit = nearestProfile + (overviewDistance - nearestProfile) / maximumMuscleZoom;
  const silhouetteLimit = nearestProfile * Math.hypot(1, 1 / (.94 * tangent * width / height));
  const regionLimit = nearest + Math.max(halfWidth, halfHeight) * height /
    (maximumFocusSpan * Math.min(width, standingStageHeight) * tangent);
  const distance = Math.max(zoomLimit, silhouetteLimit, regionLimit);
  return { ...raw, position: [0, raw.target[1], Math.sign(raw.position[2]) * distance],
    fov: camera.fov, cutoff: -.065 };
}

// Three's regular framebuffer tone-maps and converts to sRGB. Its offscreen
// targets skip both, so preserve the same display color before composition.
function captureMaterial(source) {
  const converted = source.clone();
  converted.onBeforeRender = (...args) => source.onBeforeRender(...args);
  converted.onBeforeCompile = (shader, renderer) => {
    source.onBeforeCompile(shader, renderer);
    if (!shader.fragmentShader.includes('#include <colorspace_fragment>')) return;
    if (source.toneMapped) {
      shader.fragmentShader = '#ifndef TONE_MAPPING\n' + THREE.ShaderChunk.tonemapping_pars_fragment + '\n#endif\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <tonemapping_fragment>',
        '#include <tonemapping_fragment>\n#ifndef TONE_MAPPING\n gl_FragColor.rgb = ACESFilmicToneMapping(gl_FragColor.rgb);\n#endif');
    }
    shader.fragmentShader = shader.fragmentShader.replace('#include <colorspace_fragment>', 'gl_FragColor = sRGBTransferOETF(gl_FragColor);');
  };
  converted.customProgramCacheKey = () => source.customProgramCacheKey() + '-hub-output';
  return converted;
}

export function createTrainingHub(player, phaseMap, onAngleFrame) {
  const transitions = createHubTransitions(player.period);
  const r = player.renderer;
  const angleCamera = new THREE.PerspectiveCamera(32, 1, .02, 40);
  const muscleCamera = new THREE.PerspectiveCamera(26, 1, .02, 20);
  const muscleFrame = getHubMuscleFrame(phaseMap.scene, phaseMap.getFullBounds());
  const overviewCamera = new THREE.PerspectiveCamera();
  const materials = new Map();
  const size = new THREE.Vector2();
  const clearColor = new THREE.Color();
  let target = null, angleTarget = null, muscleTarget = null;
  let lastGroup = null;
  let lastInput = null, muscleShot = null, muscleShotKey = '';
  let angleFit = null, angleFitKey = '';
  const composite = new THREE.Scene();
  const compositeCamera = new THREE.Camera();
  const material = new THREE.RawShaderMaterial({
    uniforms: { layer: { value: null }, weight: { value: 1 } },
    vertexShader: `
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }
    `,
    fragmentShader: `
      precision mediump float;
      uniform sampler2D layer;
      uniform float weight;
      varying vec2 vUv;
      void main() { gl_FragColor = texture2D(layer, vUv) * weight; }
    `,
    transparent: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    depthTest: false,
    depthWrite: false,
  });
  const plane = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(plane, material);
  quad.frustumCulled = false;
  composite.add(quad);

  function currentMuscleShot(input) {
    const width = player.container.clientWidth || 390;
    const sceneHeight = player.container.clientHeight || angleStageHeight - 54;
    const height = Math.max(120, sceneHeight - (input.showMuscles ? 0 : angleStageHeight - standingStageHeight));
    const key = JSON.stringify([width, height, input.focusMuscle, input.muscleCamera]);
    if (muscleShotKey !== key) {
      muscleShot = resolveHubMuscleCamera(overviewCamera, muscleFrame, input.muscleCamera, width, height, input.focusMuscle === true);
      muscleShotKey = key;
    }
    return muscleShot;
  }

  function currentAngleFit(raw, inMuscleMode) {
    const width = player.container.clientWidth || 390;
    const sceneHeight = player.container.clientHeight;
    const height = sceneHeight > 0
      ? sceneHeight + (inMuscleMode ? angleStageHeight - standingStageHeight : 0)
      : angleStageHeight - 54;
    const key = `${width}:${height}:${raw.fov}:${raw.yaws}`;
    if (key !== angleFitKey) {
      angleFit = fitHubAngle(angleBounds, { ...raw, aspect: width / height });
      angleFitKey = key;
    }
    return angleFit;
  }

  function configure(input, now) {
    if (!angleSources.has(input.phaseSource) || !Object.prototype.hasOwnProperty.call(GROUPS, input.muscleId)) return false;
    const raw = input.angleCamera;
    if (!raw || !Number.isFinite(raw.fov) || raw.fov < 10 || raw.fov > 70 ||
        !Array.isArray(raw.yaws) || raw.yaws.length !== angleSources.size ||
        !raw.yaws.every(Number.isFinite) || !raw.yaws.includes(raw.yaw)) return false;
    const previous = lastInput?.angleCamera;
    if (previous && (previous.fov !== raw.fov || previous.yaws.some((yaw, index) => yaw !== raw.yaws[index]))) return false;
    const fit = currentAngleFit(raw, lastInput?.showMuscles ?? false);
    const angleCamera = { ...fit, yaw: raw.yaw, fov: raw.fov };
    const muscleCamera = currentMuscleShot(input);
    if (!muscleCamera || !Number.isFinite(input.phaseTime)) return false;
    transitions.resizeAngle(fit.distance);
    if (!transitions.configure({ ...input, angleCamera, muscleCamera }, now)) return false;
    lastInput = input;
    if (player.time !== transitions.frame.time) player.setTime(transitions.frame.time);
    player.dirty = true;
    player.start();
    return true;
  }

  function tick(now) {
    if (transitions.sample(now)) {
      const time = transitions.frame.time;
      if (player.time !== time) player.setTime(time);
      player.dirty = true;
    }
    return transitions.moving;
  }

  function select(groupId) {
    if (lastGroup === groupId) return;
    phaseMap.setDetail(groupId, noPhase);
    lastGroup = groupId;
  }

  function draw(layer, capture) {
    if (layer.groupId != null) {
      select(layer.groupId);
      r.render(phaseMap.scene, muscleCamera);
      return;
    }
    if (!capture) {
      r.render(player.scene, angleCamera);
      return;
    }
    const replaced = [];
    const encoded = source => {
      if (!materials.has(source)) materials.set(source, captureMaterial(source));
      return materials.get(source);
    };
    player.coach.traverse(mesh => {
      if (!mesh.isMesh || !mesh.visible) return;
      const original = mesh.material;
      replaced.push([mesh, original]);
      mesh.material = Array.isArray(original) ? original.map(encoded) : encoded(original);
    });
    try { r.render(player.scene, angleCamera); }
    finally { for (const [mesh, original] of replaced) mesh.material = original; }
  }

  function render() {
    const width = player.container.clientWidth, height = player.container.clientHeight;
    if (!lastInput || !(width > 0 && height > 0)) return false;
    const raw = lastInput.angleCamera;
    const fit = currentAngleFit(raw, lastInput.showMuscles);
    transitions.resizeAngle(fit.distance);
    const previous = muscleShot;
    const current = currentMuscleShot(lastInput);
    if (previous !== current) {
      const angleCamera = { ...fit, yaw: raw.yaw, fov: raw.fov };
      transitions.configure({ ...lastInput, angleCamera, muscleCamera: current }, performance.now());
    }
    const frame = transitions.frame;
    const aspect = width / height;
    angleTarget = frame.angle.target;
    muscleTarget = frame.muscle.target;
    placeCamera(angleCamera, frame.angle, aspect, 1);
    onAngleFrame?.({ camera: angleCamera, time: frame.time, phase: frame.targetPhase,
      showMuscles: frame.targetMode === 1, scrubbing: frame.scrubbing, moving: frame.angleMoving });
    placeCamera(muscleCamera, frame.muscle, aspect, frame.muscleScale);
    phaseMap.setHubCrop(frame.muscle.cutoff);
    const layers = [{ weight: 1 - frame.mode }, ...[...frame.groups].map(([groupId, weight]) =>
      ({ groupId, weight: weight * frame.mode }))].filter(({ weight }) => weight > 1 / 255);
    for (const prop of player.stageProps) prop.visible = false;
    if (layers.length === 1) {
      draw(layers[0], false);
      return true;
    }

    r.getDrawingBufferSize(size);
    if (!target) {
      target = new THREE.WebGLRenderTarget(size.x, size.y, { samples: Math.min(2, r.capabilities.maxSamples), stencilBuffer: false });
    } else if (target.width !== size.x || target.height !== size.y) {
      target.setSize(size.x, size.y);
    }
    const clearAlpha = r.getClearAlpha();
    const autoClear = r.autoClear;
    const shadowEnabled = r.shadowMap.enabled;
    r.getClearColor(clearColor);
    try {
      r.shadowMap.enabled = false;
      r.setClearColor(transparent, 0);
      r.setRenderTarget(null);
      r.clear();
      for (const layer of layers) {
        r.autoClear = true;
        r.setRenderTarget(target);
        draw(layer, true);
        r.setRenderTarget(null);
        r.autoClear = false;
        material.uniforms.layer.value = target.texture;
        material.uniforms.weight.value = layer.weight;
        r.render(composite, compositeCamera);
      }
    } finally {
      r.setRenderTarget(null);
      r.setClearColor(clearColor, clearAlpha);
      r.autoClear = autoClear;
      r.shadowMap.enabled = shadowEnabled;
    }
    return true;
  }

  function releaseGpu() {
    target?.dispose();
    target = null;
    lastGroup = null;
    for (const material of materials.values()) material.dispose();
    materials.clear();
    material.dispose();
    plane.dispose();
  }

  function getState() {
    const frame = transitions.frame;
    return frame && {
      time: frame.time,
      phase: frame.targetPhase,
      muscleId: frame.targetMuscle,
      mode: frame.targetMode ? 'muscle' : 'angle',
      muscleOpacity: frame.mode,
      muscleWeights: Object.fromEntries(frame.groups),
      scrubbing: frame.scrubbing,
      moving: transitions.moving,
      angleMoving: frame.angleMoving,
      muscleScale: frame.muscleScale,
      angle: { position: angleCamera.position.toArray(), target: angleTarget?.toArray(), fov: angleCamera.fov,
        yaw: frame.angle.orbit.theta, distance: frame.angle.orbit.radius },
      muscle: { position: muscleCamera.position.toArray(), target: muscleTarget?.toArray(), fov: muscleCamera.fov,
        cutoff: frame.muscle.cutoff, distance: frame.muscle.orbit.radius, focused: lastInput.focusMuscle === true },
    };
  }

  return { configure, tick, render, releaseGpu, getState };
}
