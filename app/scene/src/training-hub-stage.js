import * as THREE from 'three';
import { GROUPS, phaseTicks } from './phase.js';
import { createHubTransitions } from './training-hub-transitions.js';

const noPhase = { items: [] };
const angleSources = new Set(phaseTicks.map(tick => tick.phase));
const transparent = new THREE.Color(0);

function placeCamera(camera, shot, aspect, scale) {
  camera.position.setFromSpherical(shot.orbit).add(shot.target);
  camera.lookAt(shot.target);
  camera.aspect = aspect;
  camera.fov = shot.fov;
  camera.zoom = scale;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}

// Follow the camera preset unless a limb would be cropped by a narrow stage
// or an intermediate R17 pose. The existing bone envelope covers the actor
// without skinning its full vertex buffer on each animation frame.
export function fitHubAngle(camera, target, envelope) {
  if (!envelope?.length) return;
  const view = new THREE.Vector3().subVectors(camera.position, target).normalize();
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
  const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
  const vertical = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.zoom * .97;
  const horizontal = vertical * camera.aspect;
  const point = new THREE.Vector3();
  let distance = camera.position.distanceTo(target);
  for (const vertex of envelope) {
    point.subVectors(vertex, target);
    distance = Math.max(distance, point.dot(view) + Math.max(
      Math.abs(point.dot(right)) / horizontal,
      Math.abs(point.dot(up)) / vertical,
      camera.near * 2,
    ));
  }
  camera.position.copy(target).addScaledVector(view, distance);
  camera.updateMatrixWorld(true);
}

function snapshot(camera, target) {
  if (!target) return null;
  const offset = new THREE.Vector3().subVectors(camera.position, target);
  return { target: target.clone(), orbit: new THREE.Spherical().setFromVector3(offset), fov: camera.fov };
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

export function createTrainingHub(player, phaseMap) {
  const transitions = createHubTransitions(player.period);
  const r = player.renderer;
  const angleCamera = new THREE.PerspectiveCamera(32, 1, .02, 40);
  const muscleCamera = new THREE.PerspectiveCamera(26, 1, .02, 20);
  const materials = new Map();
  const size = new THREE.Vector2();
  const clearColor = new THREE.Color();
  let target = null, angleTarget = null, muscleTarget = null;
  let lastGroup = null;
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

  function configure(input, now) {
    if (!angleSources.has(input.phaseSource) || !Object.prototype.hasOwnProperty.call(GROUPS, input.muscleId)) return false;
    if (!transitions.configure(input, now, snapshot(angleCamera, angleTarget))) return false;
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
    const frame = transitions.frame;
    const width = player.container.clientWidth, height = player.container.clientHeight;
    if (!frame || !(width > 0 && height > 0)) return false;
    const aspect = width / height;
    angleTarget = frame.angle.target;
    muscleTarget = frame.muscle.target;
    placeCamera(angleCamera, frame.angle, aspect, frame.angleScale);
    if (!frame.scrubbing) fitHubAngle(angleCamera, angleTarget, player.motion.getBodyEnvelope());
    placeCamera(muscleCamera, frame.muscle, aspect, frame.muscleScale);
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
      angleScale: frame.angleScale,
      muscleScale: frame.muscleScale,
      angle: { position: angleCamera.position.toArray(), target: angleTarget?.toArray(), fov: angleCamera.fov },
      muscle: { position: muscleCamera.position.toArray(), target: muscleTarget?.toArray(), fov: muscleCamera.fov },
    };
  }

  return { configure, tick, render, releaseGpu, getState };
}
