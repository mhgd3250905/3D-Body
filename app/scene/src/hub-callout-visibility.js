// Keep the outgoing phase's labels until they finish fading. A retarget or
// interrupted fade still waits for the latest pose and yaw to settle.
export function createHubCalloutVisibility() {
  let displayed = null, fade = null, opacity = 0;

  function clear() {
    displayed = fade = null;
    opacity = 0;
  }

  function sample(now) {
    if (!fade) return;
    const elapsed = Math.max(0, now - fade.start);
    const progress = Math.min(1, elapsed / fade.duration);
    opacity = fade.from + (fade.to - fade.from) * progress;
    if (progress === 1) fade = null;
  }

  function update(frame, now, animate = true) {
    if (frame.showMuscles || frame.scrubbing) {
      clear();
      return null;
    }
    sample(now);
    if (frame.moving) {
      if (!animate || opacity === 0) {
        clear();
        return null;
      }
      if (fade?.to !== 0) fade = { from: opacity, to: 0, start: now, duration: 120 };
    } else if (!displayed || displayed.time !== frame.time || displayed.phase !== frame.phase || fade?.to === 0) {
      displayed = { phase: frame.phase, time: frame.time };
      opacity = animate ? 0 : 1;
      fade = animate ? { from: 0, to: 1, start: now, duration: 200 } : null;
    } else if (!animate && fade) {
      opacity = fade.to;
      fade = null;
    }
    return displayed && { ...displayed, opacity, redrawing: fade !== null };
  }

  return { clear, update };
}
