import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createBakedMotion } from './baked-motion.js';
import { loadOfflineGlb } from './assets.js';

export const CAMERA_PRESETS = {
  standard: new THREE.Vector3(0.18, 0.38, 1), front: new THREE.Vector3(0, 0.15, 1),
  side: new THREE.Vector3(1, 0.2, 0), back: new THREE.Vector3(0, 0.15, -1),
};
const QUALITY = { low: { ratio: 1, shadows: false }, medium: { ratio: 1.5, shadows: true }, high: { ratio: 2, shadows: true } };

export class FlarePlayer {
  constructor(container, callbacks = {}) {
    this.container = container; this.callbacks = callbacks;
    this.scene = new THREE.Scene(); this.camera = new THREE.PerspectiveCamera(32, 1, 0.02, 40); this.baseFov = 32;
    // The canvas always fills the whole stage; the host covers its bottom
    // `viewInset` px with chrome (transport or the detail panel). The view is
    // framed into the visible part above it, so entering or leaving detail is
    // a camera move, never a WebView resize.
    this.viewInset = 0; this.viewInsetTarget = 0;
    this.time = 0; this.period = 9; this.playing = false; this.speed = 0.5; this.loopRange = null;
    this.visible = true; this.disposed = false; this.contextLost = false; this.dirty = true;
    this.framingMode = 'main';
    this.loopBounds = new THREE.Box3(); this.stageProps = [];
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x101116, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.setAttribute('aria-label', '托马斯全旋 3D 动画，可拖动旋转与双指缩放');
    container.prepend(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    Object.assign(this.controls, { enableDamping: true, dampingFactor: 0.13, enablePan: false, minDistance: 0.45, maxDistance: 7, minPolarAngle: 0.12, maxPolarAngle: Math.PI * 0.9 });
    this.onControlsChange = () => { this.dirty = true; };
    this.controls.addEventListener('change', this.onControlsChange);
    this.autoFrame = true;
    this.controls.addEventListener('start', () => { this.autoFrame = false; this.glide = null; });
    this.glide = null;
    this.scene.add(new THREE.HemisphereLight(0xf6f2ea, 0x3c3a3e, 2));
    this.keyLight = new THREE.DirectionalLight(0xffead2, 3.7); this.keyLight.position.set(-2.5, 4, 4); this.scene.add(this.keyLight);
    const rim = new THREE.DirectionalLight(0xf0f2ff, 2.2); rim.position.set(2, 2, -3); this.scene.add(rim);
    const fill = new THREE.DirectionalLight(0xe2e2ea, 0.8); fill.position.set(4, 0.7, 2); this.scene.add(fill);
    this.createEnvironment(); this.scene.environmentIntensity = 0.32;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.keyLight.shadow.mapSize.set(1024, 1024); this.keyLight.shadow.bias = -0.0004; this.keyLight.shadow.normalBias = 0.02; this.keyLight.shadow.radius = 6;
    Object.assign(this.keyLight.shadow.camera, { left: -1.9, right: 1.9, top: 1.9, bottom: -1.9, near: 1, far: 12 });
    this.keyLight.shadow.camera.updateProjectionMatrix();
    this.shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.28 }));
    this.shadowCatcher.rotation.x = -Math.PI / 2; this.shadowCatcher.position.y = -0.006; this.shadowCatcher.receiveShadow = true;
    this.floor = litFloor(); this.stageProps.push(this.shadowCatcher, this.floor); this.scene.add(...this.stageProps);
    this.setQuality('medium');
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(container); this.resize();
    this.onVisibility = () => {
      if (document.hidden) { this.playing = false; this.stop(); callbacks.onTime?.(this.time); }
      else if (this.visible) { this.dirty = true; this.start(); }
    };
    this.onContextLost = event => {
      event.preventDefault(); this.contextLost = true; this.playing = false; this.stop();
      // Three.js keeps disposal listeners on CPU resources. Release their old
      // GL bindings while loss is active; the arrays/materials remain reusable
      // and the restored renderer uploads them to its fresh resource cache.
      disposeTree(this.scene);
      this.keyLight.shadow.map?.dispose(); this.keyLight.shadow.map = null;
      // Release the environment's old context handles while the context is
      // lost. After restore, build a new PMREM rather than deleting stale GPU
      // handles in the new context.
      this.scene.environment = null; this.environment?.dispose(); this.environment = null;
      callbacks.onContext?.(false); callbacks.onTime?.(this.time);
    };
    this.onContextRestored = () => {
      this.contextLost = false; this.createEnvironment(); this.dirty = true; this.resize(); this.start(); callbacks.onContext?.(true);
    };
    document.addEventListener('visibilitychange', this.onVisibility);
    this.renderer.domElement.addEventListener('webglcontextlost', this.onContextLost);
    this.renderer.domElement.addEventListener('webglcontextrestored', this.onContextRestored);
  }

  createEnvironment() {
    this.environment?.dispose();
    const pmrem = new THREE.PMREMGenerator(this.renderer), room = new RoomEnvironment();
    this.environment = pmrem.fromScene(room, 0.04); this.scene.environment = this.environment.texture;
    room.dispose(); pmrem.dispose();
  }

  async load() {
    // Relative URLs work under Flutter asset paths, localhost and Android's WebView origin.
    const [gltf, rig] = await Promise.all([
      loadOfflineGlb('./coach/flare-coach-v41-animated.meshopt.glb.gz'),
      fetch(new URL('./coach/coach-v41-rig.json', document.baseURI)).then(response => {
        if (!response.ok) throw new Error('rig_load_failed'); return response.json();
      }),
    ]);
    if (this.disposed) { disposeTree(gltf.scene); return; }
    this.coach = gltf.scene;
    // The actor already contains the baked waist helpers. Playback uses the
    // supplied tracks without a second IK pass; historical study assets remain
    // available on disk and are not loaded or attached to the current actor.
    this.motion = createBakedMotion(gltf, rig);
    this.coach.traverse(object => { if (object.isMesh) object.castShadow = this.renderer.shadowMap.enabled; });
    this.scene.add(this.coach); this.period = this.motion.getMetrics().period;
    for (let i = 0; i < 18; i++) {
      this.motion.update(i * this.period / 18); const bounds = this.motion.getMetrics().bounds;
      this.loopBounds.union(new THREE.Box3(new THREE.Vector3().fromArray(bounds.min), new THREE.Vector3().fromArray(bounds.max)));
    }
    this.loopBounds.expandByScalar(rig.height * 0.045);
    this.setTime(0); this.resetView(); this.start();
  }

  start() {
    if (this.running || this.disposed || this.contextLost || !this.visible || document.hidden) return;
    this.running = true; this.last = performance.now(); this.renderer.setAnimationLoop(now => this.tick(now));
  }
  stop() { this.running = false; this.renderer.setAnimationLoop(null); }
  tick(now) {
    const delta = Math.min(Math.max((now - this.last) / 1000, 0), 0.06); this.last = now;
    if (this.motion && this.playing) {
      this.time = this.motion.clock.advance(this.time, delta, this.speed, this.loopRange);
      this.motion.update(this.time); this.callbacks.onTime?.(this.time); this.dirty = true;
    }
    this.stepGlide(now);
    this.controls.update();
    if (this.dirty) { this.render(); this.dirty = false; this.callbacks.onRender?.(); }
  }
  render() {
    const r = this.renderer, inset = Math.round(this.viewInset), height = this.container.clientHeight;
    if (inset > 0 && inset < height) {
      // Nothing is drawn under the host's chrome: clear all, draw above it.
      r.setScissorTest(false); r.clear();
      r.setScissor(0, inset, this.container.clientWidth, height - inset); r.setScissorTest(true);
      r.render(this.displayScene ?? this.scene, this.camera); r.setScissorTest(false);
    } else r.render(this.displayScene ?? this.scene, this.camera);
  }
  /** Bottom px of the stage hidden under host chrome. A running glide carries
   * the change; otherwise it eases on its own (reduced motion: at once). */
  setViewInset(px, animate = true) {
    const value = Math.max(0, Number(px) || 0);
    if (Math.abs(value - this.viewInsetTarget) < 0.5 && Math.abs(value - this.viewInset) < 0.5 && !this.glide) return;
    this.viewInsetTarget = value;
    this.updateFramingTarget();
    if (animate && this.projectionGlide) {
      this.projectionGlide.toInset = value;
      this.projectionGlide.toBias = { ...this.viewBiasTarget };
      return;
    }
    if (animate && this.running && Math.abs(value - this.viewInset) > 0.5) {
      this.glideTo(this.camera.position.clone(), this.controls.target.clone(), 420);
    } else { this.projectionGlide = null; this.viewInset = value; this.viewBias = { ...this.viewBiasTarget }; this.applyProjection(); }
    this.dirty = true;
  }
  setTime(time) {
    this.time = THREE.MathUtils.clamp(time, 0, this.period);
    this.motion?.update(this.time); this.coach?.updateMatrixWorld(true); this.dirty = true;
    this.callbacks.onTime?.(this.time);
  }
  pacingRate(time) { return (this.motion.clock.toSequence(Math.min(this.motion.clock.toWall(time) + 0.001, this.motion.clock.duration)) - time) / 0.001; }
  paceStep(delta) { return this.motion.clock.advance(this.time, delta, this.speed, this.loopRange) - this.time; }
  getMetrics() { return this.motion?.getMetrics() ?? null; }
  setDisplayScene(scene = null) { this.displayScene = scene; this.dirty = true; }
  setVisible(visible) {
    this.visible = !!visible;
    if (this.visible && !document.hidden) { this.dirty = true; this.start(); }
    else { this.playing = false; this.stop(); this.callbacks.onTime?.(this.time); }
  }
  setQuality(value) {
    this.quality = value in QUALITY ? value : 'medium'; const quality = QUALITY[this.quality];
    this.updatePixelRatio();
    this.renderer.shadowMap.enabled = quality.shadows; this.keyLight.castShadow = quality.shadows;
    this.shadowCatcher.visible = quality.shadows;
    this.coach?.traverse(object => { if (object.isMesh) object.castShadow = quality.shadows; });
    this.dirty = true; this.resize();
  }
  updatePixelRatio() {
    // The quality setting owns resolution. Changing detail mode must not
    // reallocate the canvas buffer midway through a camera transition.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY[this.quality].ratio));
  }
  resize() {
    const width = this.container.clientWidth, height = this.container.clientHeight;
    if (!(width > 0 && height > 0)) return;
    const changed = this.lastSize !== `${width}x${height}`;
    this.lastSize = `${width}x${height}`;
    this.updateFramingTarget();
    this.applyProjection();
    if (changed) this.renderer.setSize(width, height);
    if (changed && this.autoFrame && this.motion) this.resetView();
    if (changed && this.framingMode === 'detail') this.callbacks.onResize?.();
    this.dirty = true;
  }
  /** Visible stage height for an inset (the part above the host's chrome). */
  visibleHeight(inset = this.viewInset) { return Math.max(1, this.container.clientHeight - inset); }
  updateFramingTarget() {
    const width = this.container.clientWidth, visible = this.visibleHeight(this.viewInsetTarget);
    const fullStage = this.framingMode === 'main' && width <= 600 && visible >= 500;
    this.insetLeft = this.framingMode === 'detail' || fullStage ? 0 : visible <= 320 ? 48 : 64;
    this.viewBiasTarget = { x: fullStage ? 10 / 390 : -this.insetLeft / (2 * Math.max(1, width)),
      y: fullStage ? 0.5 - 187 / 650 : 0 };
    this.viewBias ??= { ...this.viewBiasTarget };
  }
  applyProjection() {
    const width = this.container.clientWidth, height = this.container.clientHeight;
    if (!(width > 0 && height > 0)) return;
    const visible = this.visibleHeight();
    // The visible part keeps the base field of view; the canvas below it is
    // the same lens extended, so framing matches a stage of that height.
    this.camera.aspect = width / height;
    this.camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(this.baseFov / 2)) * height / visible));
    if (!this.viewBias) this.updateFramingTarget();
    // h1 embeds the 650px stage at global y108. Lift the visual composition
    // 40px from the first pass. Only 10px of the static reference's horizontal
    // shift is retained for v38; its slightly wider envelope is fitted below.
    this.offsetY = visible * this.viewBias.y + (height - visible) / 2;
    this.offsetX = width * this.viewBias.x;
    this.camera.setViewOffset(width, height, this.offsetX, this.offsetY, width, height);
    this.camera.updateProjectionMatrix();
  }
  setFramingMode(value) { this.framingMode = value; this.resize(); }
  resetView(direction = CAMERA_PRESETS.standard) {
    this.autoFrame = true;
    const fullStage = this.container.clientWidth <= 600 && this.visibleHeight(this.viewInsetTarget) >= 500;
    this.fitBounds(this.loopBounds, direction, fullStage ? 0.75 : this.container.clientWidth <= 600 ? 0.78 : 0.74);
  }
  setCameraView(position, target) {
    this.glide = null; this.projectionGlide = null;
    // A quick model switch must not carry an unfinished orbit into the next
    // model's camera. Flush its damping before installing the saved view.
    const damping = this.controls.enableDamping;
    this.controls.enableDamping = false; this.controls.update(); this.controls.enableDamping = damping;
    this.controls.target.copy(target); this.camera.position.copy(position);
    this.viewInset = this.viewInsetTarget;
    this.updateFramingTarget(); this.viewBias = { ...this.viewBiasTarget }; this.applyProjection();
    this.controls.update(); this.dirty = true;
  }
  /** Ease the camera to a view instead of cutting to it (detail open/close).
   * The camera orbits the subject: the target moves in a straight line, the
   * offset from it travels on a sphere (shortest azimuth, never over the top)
   * and the distance eases geometrically. A straight position lerp would cut
   * through or past the body when the two views face opposite sides, which
   * reads as a sudden zoom-in and a flip. Longer turns get a little more time. */
  glideTo(position, target, ms = null) {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.running || reduce || ms === 0) { this.setCameraView(position, target); return; }
    const damping = this.controls.enableDamping;
    this.controls.enableDamping = false; this.controls.update(); this.controls.enableDamping = damping;
    const fromT = this.controls.target.clone(), toT = target.clone();
    const from = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(fromT));
    const to = new THREE.Spherical().setFromVector3(position.clone().sub(toT));
    let dTheta = to.theta - from.theta;
    dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
    const turn = Math.abs(dTheta) + Math.abs(to.phi - from.phi);
    const duration = ms ?? Math.round(Math.min(900, 560 + turn * 110));
    this.updateFramingTarget();
    this.glide = { fromP: this.camera.position.clone(), fromT, toP: position.clone(), toT,
      from, dTheta, to, start: performance.now(), ms: duration, fromInset: this.viewInset, toInset: this.viewInsetTarget,
      fromBias: { ...this.viewBias }, toBias: { ...this.viewBiasTarget } };
    // Pointer orbiting interrupts only the camera. The host's panel still
    // settles into place, so its inset and projection must finish separately.
    this.projectionGlide = this.glide;
    this.dirty = true;
  }
  stepGlide(now) {
    const projection = this.projectionGlide;
    if (projection) {
      const k = THREE.MathUtils.clamp((now - projection.start) / projection.ms, 0, 1);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.viewInset = projection.fromInset + (projection.toInset - projection.fromInset) * e;
      this.viewBias = { x: THREE.MathUtils.lerp(projection.fromBias.x, projection.toBias.x, e),
        y: THREE.MathUtils.lerp(projection.fromBias.y, projection.toBias.y, e) };
      if (k >= 1) { this.viewInset = projection.toInset; this.viewBias = { ...projection.toBias }; this.projectionGlide = null; }
      this.applyProjection(); this.dirty = true;
    }
    const g = this.glide; if (!g) return;
    const raw = (now - g.start) / g.ms, k = raw >= 1 - 1e-9 ? 1 : Math.max(0, raw);
    // Ease-in-out cubic: a soft start, a settled landing.
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    if (k >= 1) {
      this.controls.target.copy(g.toT); this.camera.position.copy(g.toP); this.glide = null;
    } else {
      this.controls.target.lerpVectors(g.fromT, g.toT, e);
      const radius = Math.max(1e-4, g.from.radius) * Math.pow(Math.max(1e-4, g.to.radius) / Math.max(1e-4, g.from.radius), e);
      const phi = THREE.MathUtils.clamp(g.from.phi + (g.to.phi - g.from.phi) * e, 0.05, Math.PI - 0.05);
      const offset = new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, phi, g.from.theta + g.dTheta * e));
      this.camera.position.copy(this.controls.target).add(offset);
    }
    this.camera.lookAt(this.controls.target);
    this.dirty = true;
  }
  fitBounds(box, direction, padding = 1, glide = false) {
    if (box.isEmpty()) return;
    const dir = direction.clone().normalize(), center = box.getCenter(new THREE.Vector3());
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
    const up = new THREE.Vector3().crossVectors(dir, right).normalize();
    // Fit the box into the visible part the view will have once settled.
    const tan = Math.tan(THREE.MathUtils.degToRad(this.baseFov / 2));
    const aspect = this.container.clientWidth / this.visibleHeight(this.viewInsetTarget);
    const horizontal = tan * aspect * Math.max(0.4, (this.container.clientWidth - (this.insetLeft || 0)) / this.container.clientWidth);
    let distance = 0.6;
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
      const offset = new THREE.Vector3(x, y, z).sub(center), depth = offset.dot(dir);
      distance = Math.max(distance, depth + Math.abs(offset.dot(up)) / tan, depth + Math.abs(offset.dot(right)) / horizontal);
    }
    const position = center.clone().addScaledVector(dir, distance * padding);
    if (glide) this.glideTo(position, center); else this.setCameraView(position, center);
  }
  project(point) {
    const v = point.clone().project(this.camera), rect = this.renderer.domElement.getBoundingClientRect();
    return { x: (v.x + 1) * 0.5 * rect.width, y: (1 - v.y) * 0.5 * rect.height, behind: v.z > 1 || v.z < -1 };
  }
  dispose() {
    if (this.disposed) return; this.disposed = true; this.stop();
    this.resizeObserver.disconnect(); document.removeEventListener('visibilitychange', this.onVisibility);
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this.onContextRestored);
    this.controls.removeEventListener('change', this.onControlsChange); this.controls.dispose();
    this.motion?.dispose();
    disposeTree(this.scene); this.environment?.dispose(); this.renderer.dispose(); this.renderer.domElement.remove();
  }
}

function litFloor() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256; const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,.055)'); gradient.addColorStop(0.45, 'rgba(255,255,255,.018)'); gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient; context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.014; floor.renderOrder = -1; return floor;
}

function disposeTree(root) {
  const geometries = new Set(), materials = new Set(), textures = new Set(), skeletons = new Set();
  root.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.skeleton) skeletons.add(object.skeleton);
    for (const material of object.material ? [].concat(object.material) : []) {
      materials.add(material); for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  for (const value of [...geometries, ...materials, ...textures, ...skeletons]) value.dispose();
}
