// Appearance of the scene's chrome (page backdrop panels, minimap card).
// The athlete, lighting and materials never change with the theme.
//
// A switch from the app can carry a duration so the chrome dissolves in step
// with the app's whole-screen cross-fade: CSS transitions read --theme-fade,
// and the minimap's WebGL clear colour follows lightness() frame by frame.
const state = { from: 0, to: 0, start: 0, duration: 0 };
const reduced = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const ease = t => (t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2); // easeInOut, as in Flutter

export function lightness(now = performance.now()) {
  if (!state.duration) return state.to;
  const t = Math.min(1, Math.max(0, (now - state.start) / state.duration));
  return state.from + (state.to - state.from) * ease(t);
}

export function themeSettling(now = performance.now()) {
  return state.duration > 0 && now - state.start < state.duration;
}

export function applyTheme(value, duration = 0) {
  if (!['dark', 'light'].includes(value)) return false;
  const root = document.documentElement;
  const now = performance.now();
  const ms = reduced() ? 0 : Math.max(0, Math.min(1000, Number(duration) || 0));
  state.from = lightness(now); state.to = value === 'light' ? 1 : 0; state.start = now; state.duration = ms;
  root.style.setProperty('--theme-fade', `${ms}ms`);
  root.dataset.theme = value;
  return true;
}

export function mixColor(dark, light, k = lightness()) {
  const channel = shift => Math.round(((dark >> shift) & 255) * (1 - k) + ((light >> shift) & 255) * k);
  return (channel(16) << 16) | (channel(8) << 8) | channel(0);
}
