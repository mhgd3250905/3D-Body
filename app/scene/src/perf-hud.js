import { percentile } from './adaptive-resolution.js';

// ?perf=1 diagnostics overlay. Off by default; reads counters the player
// already keeps and redraws 4 times a second, never per frame.
export function perfEnabled(search = '') {
  return new URLSearchParams(search).get('perf') === '1';
}

export function perfSnapshot(player) {
  const perf = player.perf, canvas = player.renderer.domElement, now = performance.now();
  const fps = perf.renderTimes.filter(time => now - time <= 1000).length;
  return {
    fps, p50: percentile(perf.intervals, 0.5), p95: percentile(perf.intervals, 0.95),
    calls: perf.calls, triangles: perf.triangles,
    pixelRatio: player.renderer.getPixelRatio(), fullPixelRatio: player.fullPixelRatio ?? player.renderer.getPixelRatio(),
    devicePixelRatio: window.devicePixelRatio, canvas: [canvas.width, canvas.height], canvasPixels: canvas.width * canvas.height,
    adaptive: player.adaptive.enabled, rung: player.adaptive.rung, moving: player.adaptive.moving,
    renders: perf.renders, colorPixels: perf.colorPixels, shadowPasses: perf.shadowPasses, shadowPixels: perf.shadowPixels,
    skippedShadows: perf.skippedShadows, resizes: perf.resizes, quality: player.quality,
  };
}

export function createPerfHud(player, parent = document.body) {
  const element = document.createElement('pre');
  element.className = 'perf-hud'; element.setAttribute('aria-hidden', 'true');
  Object.assign(element.style, {
    position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 4px)', left: '4px', zIndex: 50, margin: 0,
    padding: '4px 6px', font: '10px/1.35 ui-monospace, Menlo, monospace', color: '#d8ffe9', background: 'rgba(0,0,0,.62)',
    borderRadius: '4px', pointerEvents: 'none', whiteSpace: 'pre',
  });
  parent.append(element);
  const draw = () => {
    const s = perfSnapshot(player);
    element.textContent = [
      `FPS ${s.fps}  p50 ${s.p50.toFixed(1)}ms  p95 ${s.p95.toFixed(1)}ms`,
      `calls ${s.calls}  tris ${s.triangles.toLocaleString('en-US')}`,
      `DPR ${s.pixelRatio.toFixed(2)} / ${s.fullPixelRatio.toFixed(2)} (dev ${s.devicePixelRatio.toFixed(2)}) ${s.quality}`,
      `canvas ${s.canvas[0]}×${s.canvas[1]} = ${(s.canvasPixels / 1e6).toFixed(2)}MP`,
      `adaptive ${s.adaptive ? `on rung ${s.rung}${s.moving ? ' moving' : ''}` : 'off'}  resizes ${s.resizes}`,
      `shadow ${s.shadowPasses} pass / ${s.skippedShadows} reused`,
    ].join('\n');
  };
  draw(); const timer = setInterval(draw, 250);
  return { element, dispose() { clearInterval(timer); element.remove(); } };
}
