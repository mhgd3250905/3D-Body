import * as THREE from 'three';

// A separate context lets the anatomy stage release its GPU resources while
// the Thomas stage keeps its existing context, controls and presentation.
export function createStandingView(player, releaseGpu) {
  const input = player.renderer.domElement;
  const poster = document.createElement('canvas');
  poster.className = 'standing-stage-layer';
  poster.setAttribute('aria-hidden', 'true');
  const preview = poster.getContext('2d');
  const size = new THREE.Vector2();
  let active = false, paused = false, failed = false;
  let renderer = null, idle = null, frame = null, secondFrame = null;
  let live = false, mounts = 0, releases = 0, drawCount = 0, cause = null;
  let openedAt = 0, posterMs = null, liveMs = null;
  let paint = null;

  function cancelBoot() {
    if (idle !== null) {
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    }
    if (frame !== null) cancelAnimationFrame(frame);
    if (secondFrame !== null) cancelAnimationFrame(secondFrame);
    idle = frame = secondFrame = null;
  }

  function boot(reason) {
    if (!active || paused || renderer || failed || secondFrame !== null) return;
    cancelBoot();
    frame = requestAnimationFrame(() => {
      frame = null;
      // Allow a static paint before any GL context creation or shader upload.
      secondFrame = requestAnimationFrame(() => {
        secondFrame = null;
        if (!active || paused || renderer) return;
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
          renderer.setClearColor(0x000000, 0);
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.domElement.className = 'standing-stage-layer';
          renderer.domElement.setAttribute('aria-hidden', 'true');
          renderer.domElement.hidden = true;
          renderer.domElement.addEventListener('webglcontextlost', contextLost);
          poster.after(renderer.domElement);
          cause = reason; mounts++;
          player.requestRedraw();
        } catch (error) {
          failed = true;
          console.warn('Unable to prepare the standing anatomy view', error);
        }
      });
    });
  }

  function wake() {
    if (!renderer) { failed = false; boot('input'); }
  }

  function scheduleIdle() {
    if (!active || paused || renderer || idle !== null || frame !== null || secondFrame !== null) return;
    if (typeof window.requestIdleCallback === 'function') {
      idle = window.requestIdleCallback(() => { idle = null; boot('idle'); }, { timeout: 350 });
    } else idle = setTimeout(() => { idle = null; boot('idle'); }, 180);
  }

  function show(paintPoster) {
    if (!active) {
      openedAt = performance.now(); posterMs = liveMs = null; cause = null;
    }
    paint = paintPoster;
    paint(preview);
    // This cover uses the already mounted actor renderer for one exact-camera
    // capture. Its anatomy upload is no longer needed once the bitmap exists.
    if (!renderer) releaseGpu();
    if (active) return;
    posterMs = performance.now() - openedAt;
    active = true; paused = !player.visible || document.hidden; failed = false;
    input.after(poster);
    input.classList.remove('model-swap');
    input.classList.add('standing-stage-input');
    input.addEventListener('pointerdown', wake, { capture: true, passive: true });
    input.addEventListener('wheel', wake, { capture: true, passive: true });
    scheduleIdle();
  }

  function render(scene, camera, bottom) {
    if (!renderer || paused || renderer.getContext().isContextLost()) return false;
    const width = player.container.clientWidth, height = player.container.clientHeight;
    const ratio = player.renderer.getPixelRatio();
    if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
    renderer.getSize(size);
    if (size.x !== width || size.y !== height) renderer.setSize(width, height, false);
    if (!(width > 0 && height > 0)) return false;
    const clipped = bottom > 0 && bottom < height;
    if (clipped) {
      renderer.clear();
      renderer.setScissor(0, bottom, width, height - bottom);
      renderer.setScissorTest(true);
    }
    // The toon shader emits its own fixed tones and never samples the actor's
    // environment texture, which belongs to another GL context.
    const environment = scene.environment;
    scene.environment = null;
    try { renderer.render(scene, camera); }
    finally { scene.environment = environment; if (clipped) renderer.setScissorTest(false); }
    drawCount++;
    if (!live) {
      liveMs ??= performance.now() - openedAt;
      live = true; renderer.domElement.hidden = false; poster.hidden = true;
    }
    return true;
  }

  function retire() {
    cancelBoot();
    if (!renderer) return;
    const old = renderer; renderer = null; live = false;
    old.domElement.removeEventListener('webglcontextlost', contextLost);
    // Release the shared geometry's per-renderer disposal listeners as well
    // as GL buffers. Its decoded CPU data stays reusable for home miniatures.
    releaseGpu();
    old.dispose(); old.forceContextLoss(); old.domElement.remove(); releases++;
    poster.hidden = false;
  }

  function rememberView() {
    if (paint && !player.contextLost) paint(preview);
  }

  function contextLost(event) {
    event.preventDefault();
    rememberView(); retire();
  }

  function setVisible(visible) {
    if (!active || visible === !paused) return;
    paused = !visible;
    if (paused) { if (live) rememberView(); retire(); }
    else scheduleIdle();
  }

  function close() {
    if (!active) return;
    active = false;
    retire();
    input.removeEventListener('pointerdown', wake, true);
    input.removeEventListener('wheel', wake, true);
    input.classList.remove('standing-stage-input');
    poster.remove(); poster.width = poster.height = 1; paint = null;
  }

  return { show, render, setVisible, close, get renderer() { return renderer; },
    getState: () => ({ active, live, mounts, releases, draws: drawCount, cause, posterMs, liveMs,
      geometries: renderer?.info.memory.geometries ?? 0, textures: renderer?.info.memory.textures ?? 0,
      bufferSize: renderer ? [renderer.domElement.width, renderer.domElement.height] : null }) };
}
