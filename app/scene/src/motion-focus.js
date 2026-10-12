import { createMuscleUniforms, MUSCLE_BY_ID, MUSCLES } from './legacy/muscle-map.js';

// Share the reference's authored regions (including its extra lobes), while
// evaluating the moving actor's fill at the actual fragment position. Mesh
// tessellation must not determine the width or shape of a selected border.
const source = createMuscleUniforms();
const centres = source.mmC.value, radii = source.mmR.value, rotations = source.mmT.value;
const ABS = MUSCLE_BY_ID.abs.index;
const FEATHER = 0.055;
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function guard(x, y) {
  const ax = Math.abs(x);
  const across = 1 - smooth(.07, .12, ax);
  const along = smooth(.66, .72, y) * (1 - smooth(.90, .96, y));
  const hand = smooth(.33, .36, ax) * (1 - smooth(.88, .92, y));
  return (1 - across * along) * (1 - hand);
}

export function createMotionFocusField() {
  const flags = new Float32Array(MUSCLES.length), side = { value: 0 }, enabled = { value: 0 };
  let selected = false;
  const uniforms = {
    focusC: source.mmC, focusR: source.mmR, focusT: source.mmT,
    focusPanels: { value: flags }, focusSide: side, focusEnabled: enabled,
  };
  function setSelection(panels = [], wantedSide = 0) {
    flags.fill(0);
    for (const panel of panels) if (MUSCLES[panel] && !MUSCLES[panel].skin) flags[panel] = 1;
    selected = flags.some(value => value === 1);
    enabled.value = selected ? 1 : 0;
    side.value = Math.sign(wantedSide);
  }
  // CPU twin is used only to aim the initial camera at the selected surface.
  // The GPU evaluates the continuous field itself, never this vertex sample.
  function coverageAt(point) {
    if (!selected) return 0;
    const keep = guard(point.x, point.y) * (side.value ? smooth(0, .006, point.x * side.value) : 1);
    if (keep === 0) return 0;
    const x = Math.abs(point.x), y = point.y, z = point.z;
    let chosen = -9, other = .02, best = -9, sAbs = -9;
    for (let i = 0; i < centres.length; i++) {
      const c = centres[i], r = radii[i], t = rotations[i];
      const dx = x - c.x, dy = y - c.y, dz = z - c.z;
      const px = dx * t.x + dy * t.y, py = dy * t.x - dx * t.y;
      const qy = py * t.z + dz * t.w, qz = dz * t.z - py * t.w;
      const score = 1 - Math.hypot(px / r.x, qy / r.y, qz / r.z);
      if (c.w === ABS) { sAbs = score; continue; }
      best = Math.max(best, score);
      if (flags[c.w]) chosen = Math.max(chosen, score);
      else other = Math.max(other, score);
    }
    const lower = Math.max(0, Math.min(1, (1.03 - y) / .20));
    const width = .090 - .064 * lower ** 1.6 - .014 * smooth(1.08, 1.22, y);
    const a = width - x, b = y - .832, h = Math.max(.012 - Math.abs(a - b), 0) / .012;
    const inside = Math.min(Math.min(a, b) - h * h * .003, z - .04);
    const top = (sAbs - best) * .1 + 1 - smooth(1.08, 1.13, y);
    const absScore = Math.max(best, 0) + 14 * Math.min(inside, top);
    if (flags[ABS]) chosen = Math.max(chosen, absScore);
    else other = Math.max(other, absScore);
    return smooth(-FEATHER, FEATHER, chosen - other) * keep;
  }
  return { uniforms, setSelection, coverageAt };
}

export const MOTION_FOCUS_GLSL = `
#define FOCUS_NE ${centres.length}
#define FOCUS_N ${MUSCLES.length}
#define FOCUS_ABS ${ABS}
uniform vec4 focusC[FOCUS_NE];
uniform vec3 focusR[FOCUS_NE];
uniform vec4 focusT[FOCUS_NE];
uniform float focusPanels[FOCUS_N];
uniform float focusSide;
uniform float focusEnabled;
float flareFocusCoverage(vec3 rest) {
  vec3 p = vec3(abs(rest.x), rest.y, rest.z);
  float chosen = -9.0, other = 0.02, best = -9.0, sAbs = -9.0;
  for (int i = 0; i < FOCUS_NE; i++) {
    int k = int(focusC[i].w + 0.5);
    vec3 d = p - focusC[i].xyz; vec4 t = focusT[i];
    d.xy = vec2(d.x * t.x + d.y * t.y, d.y * t.x - d.x * t.y);
    d.yz = vec2(d.y * t.z + d.z * t.w, d.z * t.z - d.y * t.w);
    float score = 1.0 - length(d / focusR[i]);
    if (k == FOCUS_ABS) { sAbs = score; continue; }
    best = max(best, score);
    if (focusPanels[k] > 0.5) chosen = max(chosen, score);
    else other = max(other, score);
  }
  float lower = clamp((1.03 - p.y) / 0.20, 0.0, 1.0);
  float width = 0.090 - 0.064 * pow(lower, 1.6) - 0.014 * smoothstep(1.08, 1.22, p.y);
  float a = width - p.x, b = p.y - 0.832;
  float h = max(0.012 - abs(a - b), 0.0) / 0.012;
  float inside = min(min(a, b) - h * h * 0.003, p.z - 0.04);
  float top = (sAbs - best) * 0.1 + 1.0 - smoothstep(1.08, 1.13, p.y);
  float absScore = max(best, 0.0) + 14.0 * min(inside, top);
  if (focusPanels[FOCUS_ABS] > 0.5) chosen = max(chosen, absScore);
  else other = max(other, absScore);
  float margin = chosen - other;
  // A consistent score-space feather plus a pixel footprint avoids both
  // triangle-shaped bands on clothing and aliasing in the tiny action card.
  float feather = max(${FEATHER}, fwidth(margin) * 1.1);
  float coverage = smoothstep(-feather, feather, margin);
  float across = 1.0 - smoothstep(0.07, 0.12, p.x);
  float along = smoothstep(0.66, 0.72, p.y) * (1.0 - smoothstep(0.90, 0.96, p.y));
  float hand = smoothstep(0.33, 0.36, p.x) * (1.0 - smoothstep(0.88, 0.92, p.y));
  coverage *= (1.0 - across * along) * (1.0 - hand);
  float sideCoord = rest.x * focusSide;
  float sideFeather = max(0.006, fwidth(sideCoord) * 1.1);
  if (abs(focusSide) > 0.5) coverage *= smoothstep(0.0, sideFeather, sideCoord);
  return coverage * focusEnabled;
}
`;
