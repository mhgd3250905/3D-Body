// Adaptive render resolution for the home/detail stage.
//
// While the picture moves (playback, orbit drag/damping, camera glides) a
// lower drawing-buffer density is hard to see but cuts fragment work by the
// square of the ratio. Once everything has been still for `settleMs`, the
// quality setting's full density returns for one sharp frame.
//
// Under sustained jank (p95 frame interval above `degradeMs` over a window of
// moving frames) the moving density steps down one rung; a fast window steps
// it back up. Every change is rate-limited (`holdMs`) so the canvas buffer is
// never reallocated frame after frame. Pure logic: no DOM, testable in Node.

// Moving density cap per quality preset (never above the settled density).
export const MOTION_CAPS = { low: 1, medium: 1.5, high: 2 };

export const ADAPTIVE_DEFAULTS = Object.freeze({
  settleMs: 250, window: 30, degradeMs: 25, recoverMs: 18, holdMs: 1000, step: 0.25, floor: 1, maxInterval: 250,
});

export function adaptiveEnabled(search = '') {
  return new URLSearchParams(search).get('adaptive') !== '0';
}

export function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1))];
}

/** Ladder of moving densities from the quality's cap down to the floor. */
export function motionLadder(fullRatio, quality, options = ADAPTIVE_DEFAULTS) {
  const cap = Math.min(fullRatio, MOTION_CAPS[quality] ?? MOTION_CAPS.medium);
  const floor = Math.min(cap, options.floor);
  const ladder = [round(cap)];
  for (let value = cap - options.step; value > floor + 1e-6; value -= options.step) ladder.push(round(value));
  if (ladder[ladder.length - 1] !== round(floor)) ladder.push(round(floor));
  return ladder;
}

export function createAdaptiveResolution({ enabled = true, ...overrides } = {}) {
  const options = { ...ADAPTIVE_DEFAULTS, ...overrides };
  let full = 1, quality = 'medium', ladder = [1], rung = 0, current = 1;
  let lastMotion = -Infinity, lastChange = -Infinity, wasMoving = false, samples = [];

  function target(moving) { return moving ? ladder[rung] : full; }
  return {
    get enabled() { return enabled; },
    get ratio() { return current; },
    get rung() { return rung; },
    get ladder() { return [...ladder]; },
    /** Quality or device density changed: rebuild the ladder, keep the rung. */
    configure(fullRatio, qualityName) {
      full = round(fullRatio); quality = qualityName;
      ladder = motionLadder(full, quality, options); rung = Math.min(rung, ladder.length - 1);
      current = enabled && wasMoving ? ladder[rung] : full;
      return current;
    },
    /**
     * Called once per animation frame. `moving` is true when this frame shows
     * motion; `interval` is the ms since the previous frame. Returns the
     * density this frame should be drawn at, and whether it changed.
     */
    update(now, moving, interval) {
      if (!enabled) { const changed = current !== full; current = full; return { ratio: current, changed, settled: false }; }
      if (moving) {
        // The first frame after a still period has a meaningless interval.
        if (wasMoving && interval > 0 && interval < options.maxInterval) samples.push(interval);
        lastMotion = now; wasMoving = true;
        if (samples.length >= options.window) {
          const p95 = percentile(samples, 0.95); samples = [];
          if (now - lastChange >= options.holdMs) {
            if (p95 > options.degradeMs && rung < ladder.length - 1) { rung++; lastChange = now; }
            else if (p95 < options.recoverMs && rung > 0) { rung--; lastChange = now; }
          }
        }
      } else if (wasMoving && now - lastMotion >= options.settleMs) { wasMoving = false; samples = []; }
      const next = target(wasMoving);
      const changed = next !== current;
      const settled = changed && !wasMoving;
      current = next;
      return { ratio: current, changed, settled };
    },
    /** True while a lower moving density is held (still within settleMs). */
    get moving() { return wasMoving; },
  };
}

function round(value) { return Math.round(value * 1000) / 1000; }
