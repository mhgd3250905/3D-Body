// The actor renderer owns the only WebGL context. The poster is a CPU-backed
// snapshot of the standing camera while the same renderer is still on screen.
export function createStandingView(player, releaseGpu) {
  const canvas = player.renderer.domElement;
  const poster = document.createElement('canvas');
  poster.className = 'standing-stage-layer';
  poster.setAttribute('aria-hidden', 'true');
  const preview = poster.getContext('2d', { willReadFrequently: true });
  let active = false, ready = false, live = false;
  let idle = null, frame = null;
  let mounts = 0, releases = 0, draws = 0, cause = null;
  let openedAt = 0, posterMs = null, liveMs = null;

  function cancelStart() {
    if (idle !== null) {
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    }
    if (frame !== null) cancelAnimationFrame(frame);
    idle = frame = null;
  }

  function start(reason) {
    if (!active || ready || frame !== null) return;
    cancelStart();
    // Request the live draw from the next frame so the cover gets a paint
    // opportunity even when a touch arrives before the idle callback.
    frame = requestAnimationFrame(() => {
      frame = null;
      if (!active) return;
      ready = true; cause = reason; mounts++;
      player.requestRedraw();
    });
  }

  function wake() { start('input'); }

  function scheduleIdle() {
    if (!active || ready || idle !== null || frame !== null) return;
    if (typeof window.requestIdleCallback === 'function') {
      idle = window.requestIdleCallback(() => { idle = null; start('idle'); }, { timeout: 350 });
    } else idle = setTimeout(() => { idle = null; start('idle'); }, 180);
  }

  function show(paintPoster) {
    if (active) return;
    openedAt = performance.now();
    liveMs = cause = null;
    paintPoster(preview);
    posterMs = performance.now() - openedAt;
    active = true;
    poster.hidden = false;
    canvas.after(poster);
    canvas.classList.add('standing-stage-input');
    canvas.addEventListener('pointerdown', wake, { capture: true, passive: true });
    canvas.addEventListener('wheel', wake, { capture: true, passive: true });
    scheduleIdle();
  }

  function render(draw) {
    if (!ready || player.contextLost) return false;
    const rendered = draw();
    if (!rendered) return false;
    draws++;
    if (!live) {
      liveMs ??= performance.now() - openedAt;
      live = true;
      canvas.classList.remove('standing-stage-input');
      poster.hidden = true;
      poster.width = poster.height = 1;
    }
    return true;
  }

  function close() {
    if (!active) return;
    active = false;
    cancelStart();
    releaseGpu();
    releases++;
    ready = live = false;
    canvas.removeEventListener('pointerdown', wake, true);
    canvas.removeEventListener('wheel', wake, true);
    canvas.classList.remove('standing-stage-input');
    poster.remove(); poster.width = poster.height = 1;
  }

  return { show, render, close,
    getState: () => ({ active, live, mounts, releases, draws, cause, posterMs, liveMs,
      geometries: active && ready ? player.renderer.info.memory.geometries : 0,
      textures: active && ready ? player.renderer.info.memory.textures : 0,
      bufferSize: live ? [canvas.width, canvas.height] : null }) };
}
