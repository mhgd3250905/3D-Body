// Match the host's names while preserving the existing scene API names.
// Dense phone screens need a near-native buffer even at the default setting;
// the explicit battery mode remains available for inexpensive rendering.
const PRESETS = {
  low: { maxRatio: 1, shadows: false },
  medium: { maxRatio: 3, shadows: true },
  high: { maxRatio: 4, shadows: true },
};

export function renderQuality(value, deviceRatio = 1) {
  const name = ({ battery: 'low', balanced: 'medium' })[value] ?? value;
  const quality = Object.hasOwn(PRESETS, name) ? name : 'medium';
  const preset = PRESETS[quality];
  const density = Number.isFinite(deviceRatio) && deviceRatio > 0 ? deviceRatio : 1;
  return { name: quality, shadows: preset.shadows, pixelRatio: Math.min(density, preset.maxRatio) };
}
