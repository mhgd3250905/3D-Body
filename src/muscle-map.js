// Fitness-app style muscle map drawn on the smooth mannequin body (derived
// from the CC0 Blender Studio base mesh). Each muscle is a soft panel; panels
// meet in gentle, shallow valleys with a short colour feather instead of hard
// groove lines, so the body stays clean and refined up close. Everything is computed per PIXEL from the surface position
// (an anisotropic-ellipsoid Voronoi), so edges stay smooth at any zoom and on
// any phone — no realistic sculpted muscle geometry, no jagged mesh borders.
// It shows WHERE a muscle group sits, not how hard it works (not EMG).
// Units: metres, feet y=0, up +Y, front +Z, body's left +X. Mirrored in |x|.
// The body must be rendered in its own model space (rotate the camera, not
// the mesh), because panels are looked up from model-space positions.
import * as THREE from 'three';

// [id, name, family, centre, radius, tiltZ (rad, + leans top outward), tiltX (rad), flags]
// family: panels of one family are split by a fine inner line, not a groove.
// flags: m = mirror seam is a groove (midline), a = abdominal segments,
//        k = plain blocker (head, hands, feet, joints stay unmarked),
//        c = legacy flag from the dressed body (hip panels under the shorts).
const RAW = [
  // skin (plain, never highlighted): head, hands, feet, knees, elbows
  ['skinHead', '', 'skin', [.000, 1.600, .010], [.105, .125, .125], 0, 0, 'k'],
  ['skinHand', '', 'skin', [.400, .780, .090], [.065, .105, .090], .35, 0, 'k'],
  ['skinFoot', '', 'skin', [.170, .030, .030], [.080, .085, .150], 0, 0, 'k'],
  ['skinKnee', '', 'skin', [.135, .470, .030], [.060, .040, .070], .05, 0, 'k'],
  ['skinShin', '', 'skin', [.128, .300, .010], [.026, .150, .030], -.05, 0, 'k'],
  ['neck', '胸锁乳突肌', 'neck', [.030, 1.470, .055], [.024, .065, .040], .25, -.45, ''],
  ['trapUpper', '斜方肌上部', 'trap', [.075, 1.430, -.030], [.100, .075, .075], -.30, .10, 'm'],
  ['deltFront', '三角肌前束', 'delt', [.180, 1.340, .050], [.048, .085, .048], .25, 0, ''],
  ['deltSide', '三角肌中束', 'delt', [.215, 1.330, .000], [.048, .090, .060], .30, 0, ''],
  ['deltRear', '三角肌后束', 'delt', [.180, 1.340, -.060], [.048, .085, .048], .25, 0, ''],
  ['pec', '胸大肌', 'pec', [.080, 1.290, .120], [.105, .080, .075], .10, 0, 'm'],
  ['biceps', '肱二头肌', 'biceps', [.245, 1.190, .035], [.040, .110, .045], .36, 0, ''],
  ['triceps', '肱三头肌', 'triceps', [.258, 1.200, -.045], [.045, .130, .050], .36, 0, ''],
  ['forearmFlex', '前臂屈肌群', 'forearm', [.335, .980, .050], [.040, .110, .040], .37, 0, ''],
  ['forearmExt', '前臂伸肌群', 'forearm', [.350, .980, .000], [.040, .110, .045], .37, 0, ''],
  ['serratus', '前锯肌', 'serratus', [.135, 1.180, .075], [.040, .060, .050], -.15, 0, ''],
  ['abs', '腹直肌', 'abs', [.036, 1.030, .140], [.048, .215, .060], 0, 0, 'ma'],
  ['oblique', '腹外斜肌', 'oblique', [.132, 1.020, .060], [.050, .120, .080], .08, 0, ''],
  ['infraspinatus', '冈下肌（肩袖）', 'infra', [.110, 1.290, -.095], [.055, .055, .045], 0, 0, ''],
  ['scapular', '菱形肌 / 斜方肌中下部', 'trap', [.040, 1.250, -.100], [.050, .130, .045], 0, 0, 'm'],
  ['lats', '背阔肌', 'lats', [.125, 1.130, -.065], [.070, .130, .070], -.15, 0, ''],
  ['erectors', '竖脊肌', 'erectors', [.035, .990, -.075], [.040, .130, .045], 0, 0, 'm'],
  ['gluteMed', '臀中肌', 'gluteMed', [.150, .910, -.030], [.055, .060, .065], 0, 0, 'c'],
  ['glutes', '臀大肌', 'glutes', [.085, .830, -.085], [.100, .090, .070], 0, 0, 'mc'],
  ['hipFlexor', '髂腰肌 / 阔筋膜张肌', 'hipFlexor', [.120, .870, .080], [.055, .065, .050], 0, 0, 'c'],
  ['quadRect', '股直肌', 'quads', [.105, .650, .100], [.045, .160, .050], .05, 0, 'c'],
  ['quadLat', '股外侧肌', 'quads', [.165, .640, .068], [.045, .160, .055], .05, 0, 'c'],
  ['quadMed', '股内侧肌', 'quads', [.085, .520, .075], [.040, .080, .045], .02, 0, ''],
  ['adductors', '内收肌群', 'adductors', [.050, .670, .010], [.045, .140, .060], .05, 0, 'c'],
  ['hamLat', '股二头肌', 'ham', [.162, .620, -.042], [.045, .170, .050], .04, 0, 'c'],
  ['hamMed', '半腱肌 / 半膜肌', 'ham', [.085, .620, -.055], [.045, .170, .050], .04, 0, 'c'],
  ['tibialis', '胫骨前肌', 'tibialis', [.178, .320, -.010], [.026, .120, .032], 0, 0, ''],
  ['calfMed', '腓肠肌内侧头', 'calf', [.130, .350, -.085], [.040, .100, .045], 0, 0, ''],
  ['calfLat', '腓肠肌外侧头', 'calf', [.180, .350, -.080], [.040, .100, .045], 0, 0, ''],
];
// Muscle ellipsoids are inflated so neighbours meet (the Voronoi decides the
// borders); skin blockers keep joints, head, hands and feet plain.
const INFLATE = 1.4;
export const MUSCLES = RAW.map(([id, name, family, centre, radius, tz, tx, flags], index) => {
  const skin = flags.includes('k');
  return { id, name, family, centre, radius: skin ? radius : radius.map(r => r * INFLATE), tz, tx, skin, mid: flags.includes('m'), abs: flags.includes('a'), cloth: flags.includes('c'), index };
});
export const MUSCLE_BY_ID = Object.fromEntries(MUSCLES.map(m => [m.id, m]));
const FAMILIES = ['skin', ...new Set(MUSCLES.map(m => m.family).filter(f => f !== 'skin'))];
const N = MUSCLES.length;

// App groups (movement-surface-regions ids + a few common extras) -> map
// panels. `deep` groups lie under the panel shown, so they are drawn hatched.
export const GROUP_MUSCLES = {
  deltoids: { label: '三角肌', muscles: ['deltFront', 'deltSide', 'deltRear'] },
  'rotator-cuff': { label: '肩袖肌群', muscles: ['infraspinatus'], deep: true },
  triceps: { label: '肱三头肌', muscles: ['triceps'] },
  serratus: { label: '前锯肌', muscles: ['serratus'] },
  scapular: { label: '肩胛稳定肌群', muscles: ['scapular'] },
  obliques: { label: '腹斜肌', muscles: ['oblique'] },
  erectors: { label: '竖脊肌', muscles: ['erectors'] },
  'hip-flexors': { label: '髋屈肌', muscles: ['hipFlexor'], deep: true },
  quadriceps: { label: '股四头肌', muscles: ['quadRect', 'quadLat', 'quadMed'] },
  glutes: { label: '臀肌', muscles: ['glutes', 'gluteMed'] },
  'glute-max': { label: '臀大肌', muscles: ['glutes'] },
  'hip-abductors': { label: '臀中肌 · 髋外展', muscles: ['gluteMed'] },
  'hip-rotators': { label: '髋外旋肌群', muscles: ['glutes'], deep: true },
  adductors: { label: '内收肌群', muscles: ['adductors'] },
  hamstrings: { label: '腘绳肌', muscles: ['hamLat', 'hamMed'] },
  // extras for the standalone page / future cards
  chest: { label: '胸大肌', muscles: ['pec'] }, pectorals: { label: '胸肌', muscles: ['pec'] }, abs: { label: '腹直肌', muscles: ['abs'] },
  biceps: { label: '肱二头肌', muscles: ['biceps'] }, forearms: { label: '前臂肌群', muscles: ['forearmFlex', 'forearmExt'] },
  traps: { label: '斜方肌', muscles: ['trapUpper', 'scapular'] }, lats: { label: '背阔肌', muscles: ['lats'] },
  calves: { label: '小腿三头肌', muscles: ['calfMed', 'calfLat'] }, tibialis: { label: '胫骨前肌', muscles: ['tibialis'] },
  neck: { label: '颈部肌群', muscles: ['neck'] },
};
/** Resolve a group id (or a raw panel id) to { label, muscles, deep }. */
export function resolveGroup(id) {
  if (GROUP_MUSCLES[id]) return GROUP_MUSCLES[id];
  const m = MUSCLE_BY_ID[id];return m ? { label: m.name, muscles: [m.id] } : null;
}

function rotateLocal(m, x, y, z) {
  let dx = x - m.centre[0], dy = y - m.centre[1], dz = z - m.centre[2];
  const cz = Math.cos(m.tz), sz = Math.sin(m.tz);[dx, dy] = [dx * cz + dy * sz, dy * cz - dx * sz];
  const cx = Math.cos(m.tx), sx = Math.sin(m.tx);[dy, dz] = [dy * cx + dz * sx, dz * cx - dy * sx];
  return [dx, dy, dz];
}
// CPU twin of the shader scoring (picking, focus, label anchors).
export function muscleAt(point, height = 1.69) {
  const s = 1.69 / height, x = Math.abs(point.x) * s, y = point.y * s, z = point.z * s;
  let best = -1, second = -1, id = null;
  for (const m of MUSCLES) {
    const [dx, dy, dz] = rotateLocal(m, x, y, z);
    const score = 1 - Math.hypot(dx / m.radius[0], dy / m.radius[1], dz / m.radius[2]);
    if (score > best) { second = best;best = score;id = m.id; } else if (score > second) second = score;
  }
  return best > 0.02 && !MUSCLE_BY_ID[id].skin ? { id, name: MUSCLE_BY_ID[id].name, side: point.x >= 0 ? 'left' : 'right', score: best, margin: best - Math.max(second, 0) } : null;
}

/** Uniforms shared by every body material. Per panel, mmState = (sel, side,
 * focus, dim): sel 0 none, 1 primary, .6 secondary, -1 deep (hatched); side 1
 * left only, -1 right only, 0 both; dim 0..1 fades a highlight toward the
 * plain body. mmCol is the panel's colour (one accent, or one per group in
 * multi-colour mode). Packed to stay well under phone uniform limits. */
export function createMuscleUniforms() {
  return {
    mmC: { value: MUSCLES.map(m => new THREE.Vector3(...m.centre)) },
    mmR: { value: MUSCLES.map(m => new THREE.Vector3(...m.radius)) },
    mmT: { value: MUSCLES.map(m => new THREE.Vector4(Math.cos(m.tz), Math.sin(m.tz), Math.cos(m.tx), Math.sin(m.tx))) },
    mmF: { value: MUSCLES.map(m => new THREE.Vector4(FAMILIES.indexOf(m.family), m.mid ? 1 : 0, m.abs ? 1 : 0, m.cloth ? 1 : 0)) },
    mmState: { value: MUSCLES.map(() => new THREE.Vector4(0, 0, 0, 0)) }, mmCol: { value: MUSCLES.map(() => new THREE.Color('#ff5a36')) }, mmMulti: { value: 0 },
    mmScale: { value: 1 }, mmTime: { value: 0 }, mmReveal: { value: 1 }, mmDebug: { value: 0 },
    mmAccent: { value: new THREE.Color('#ff5a36') }, mmAccent2: { value: new THREE.Color('#ffae5c') },
    // one clean matte mannequin tone everywhere (no separate skin/clothing tones)
    mmBase: { value: new THREE.Color('#9aa3b0') }, mmSkin: { value: new THREE.Color('#9aa3b0') }, mmGroove: { value: new THREE.Color('#56607a') },
  };
}

const GLSL_HEAD = `
#define MM_N ${N}
uniform vec3 mmC[MM_N]; uniform vec3 mmR[MM_N]; uniform vec4 mmT[MM_N]; uniform vec4 mmF[MM_N];
uniform vec4 mmState[MM_N]; uniform vec3 mmCol[MM_N]; uniform float mmMulti;
uniform float mmScale; uniform float mmTime; uniform float mmReveal; uniform float mmDebug;
uniform vec3 mmAccent; uniform vec3 mmAccent2; uniform vec3 mmBase; uniform vec3 mmSkin; uniform vec3 mmGroove;
varying vec3 vMmPos;
// results of mmEval(): blended surface colour and emissive glow (no normal
// perturbation: the mannequin geometry carries the shape, so no faceting or
// derivative sparkles at panel borders up close)
vec3 mmColour; vec3 mmGlow; float mmFront;
vec3 mmHue(float i){ return 0.55 + 0.45 * cos(6.2831 * (i * 0.137 + vec3(0.0, 0.33, 0.67))); }
float mmHatch(){
  float hA = max(fwidth(vMmPos.y) * 140.0, 0.02);
  return smoothstep(0.5 - hA, 0.5 + hA, abs(fract((vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0) - 0.5) * 2.0);
}
// Colour + glow of one panel (i < 0: plain mannequin surface between panels).
vec3 mmPanel(int i, float s, float sd, float shown, float hatch, out vec3 glow){
  glow = vec3(0.0);
  if (i < 0 || mmF[i].x < 0.5) return mmBase;
  vec4 st = mmState[i];
  float on = (st.y == 0.0 || st.y == sd) ? 1.0 : 0.0;
  float sel = st.x * on, focus = st.z * on, dim = st.w;
  float primary = step(0.9, sel), secondary = step(0.3, sel) * (1.0 - primary), deep = step(sel, -0.5);
  float anySel = primary + secondary + deep;
  vec3 pc = mmCol[i]; float core = smoothstep(0.0, 0.6, s);
  vec3 hot = mmMulti > 0.5 ? pc * mix(0.80, 0.90, core) : mix(mmAccent2, pc, 0.55 + 0.45 * core);
  vec3 col = mmBase;
  col = mix(col, hot, primary * shown);
  col = mix(col, mix(mmBase, pc, 0.52), secondary * shown);
  col = mix(col, mix(mmBase, pc, 0.80), deep * shown * mix(0.18, 1.0, hatch));
  col = mix(col, mix(mmBase, col, 0.10), dim * anySel * shown);
  if (mmDebug > 0.5) col = mmHue(float(i));
  float pulse = 0.5 + 0.5 * sin(mmTime * 2.4);
  float lit = (step(0.3, sel) + deep * 0.6) * shown * (1.0 - 0.85 * dim);
  glow = pc * lit * (0.10 + 0.08 * pulse + 0.40 * focus * pulse);
  return col;
}
// Panels come from an anisotropic-ellipsoid Voronoi evaluated per pixel. The
// two best panels are cross-faded across their border (no hard seam, no
// groove line): a short colour feather plus a wide, very shallow tonal valley
// that follows the panel shapes like a soft muscle edge.
void mmEval(){
  vec3 p = vec3(abs(vMmPos.x), vMmPos.y, vMmPos.z) * mmScale; float sd = vMmPos.x >= 0.0 ? 1.0 : -1.0;
  // best three panels; the plain surface competes as panel -1 with score 0
  float b1 = 0.0, b2 = -9.0, b3 = -9.0, b4 = -9.0; int i1 = -1, i2 = -1, i3 = -1; float best = -9.0;
  for (int i = 0; i < MM_N; i++) {
    vec3 d = p - mmC[i]; vec4 t = mmT[i];
    d.xy = vec2(d.x * t.x + d.y * t.y, d.y * t.x - d.x * t.y);
    d.yz = vec2(d.y * t.z + d.z * t.w, d.z * t.z - d.y * t.w);
    float s = 1.0 - length(d / mmR[i]); best = max(best, s);
    if (s > b1) { b4 = b3; b3 = b2; i3 = i2; b2 = b1; i2 = i1; b1 = s; i1 = i; }
    else if (s > b2) { b4 = b3; b3 = b2; i3 = i2; b2 = s; i2 = i; }
    else if (s > b3) { b4 = b3; b3 = s; i3 = i; }
    else b4 = max(b4, s);
  }
  // reveal: highlighted panels fill from their centre outwards
  float revealT = 1.32 - 1.38 * mmReveal;
  float shown = smoothstep(revealT - 0.05, revealT + 0.01, best / 0.85 + 0.12);
  float hatch = mmHatch();
  vec3 g1, g2, g3;
  vec3 c1 = mmPanel(i1, b1, sd, shown, hatch, g1);
  vec3 c2 = mmPanel(i2, max(b2, 0.0), sd, shown, hatch, g2);
  vec3 c3 = mmPanel(i3, max(b3, 0.0), sd, shown, hatch, g3);
  // Everything is cross-faded symmetrically by score gaps, so it stays
  // continuous wherever the ranking changes: 50/50 on a border, a panel's own
  // colour ~5 mm inside it, a three-way blend at junctions.
  float g12 = b1 - b2, g13 = b1 - b3;
  float fw = 0.09;
  // the third panel fades out before a fourth could replace it (continuity)
  float k3 = smoothstep(0.0, 0.06, b3 - b4);
  float w2 = 1.0 - smoothstep(0.0, fw, g12), w3 = (1.0 - smoothstep(0.0, fw, g13)) * k3;
  float wsum = 1.0 + w2 + w3;
  mmColour = (c1 + w2 * c2 + w3 * c3) / wsum; mmGlow = (g1 + w2 * g2 + w3 * g3) / wsum;
  // a wide, shallow valley where two muscle panels meet (fainter inside a family)
  float f1 = i1 >= 0 ? mmF[i1].x : 0.0, f2 = i2 >= 0 ? mmF[i2].x : 0.0, f3 = i3 >= 0 ? mmF[i3].x : 0.0;
  float a12 = (f1 > 0.5 && f2 > 0.5) ? (f1 == f2 ? 0.35 : 1.0) : 0.0;
  float a13 = (f1 > 0.5 && f3 > 0.5) ? (f1 == f3 ? 0.35 : 1.0) : 0.0;
  // the pair's strength is cross-faded where the second and third panels swap
  float amp = mix(a13, a12, 0.5 + 0.5 * smoothstep(0.0, 0.06, b2 - b3));
  float valley = amp * (1.0 - smoothstep(0.0, 0.32, g12));
  // midline (linea alba, spine) and abdominal segments: equally soft, faded
  // out toward the panel border so nothing jumps where the ranking changes
  float inside = smoothstep(0.0, 0.12, g12);
  float mid = i1 >= 0 ? mmF[i1].y : 0.0, abSeg = i1 >= 0 ? mmF[i1].z : 0.0;
  valley = max(valley, (1.0 - smoothstep(0.0, 0.018, abs(vMmPos.x) * mmScale)) * 0.7 * mid * inside);
  if (abSeg > 0.5) {
    float yy = (p.y - 0.985) / 0.068; float fy = abs(fract(yy) - 0.5) * 0.068;
    float seg = (1.0 - smoothstep(0.0, 0.011, fy)) * smoothstep(-0.2, 0.2, yy) * smoothstep(3.2, 2.8, yy);
    valley = max(valley, seg * 0.40 * inside);
  }
  mmColour *= 1.0 - 0.07 * valley;
  mmColour = mix(mmColour, mmColour * mmGroove / max(mmBase, vec3(0.05)), 0.10 * valley);
  float selTop = i1 >= 0 ? step(0.3, abs(mmState[i1].x)) : 0.0;
  mmFront = smoothstep(0.0, 0.08, b1) * (1.0 - smoothstep(0.0, 0.10, abs(b1 / 0.85 + 0.12 - revealT))) * step(mmReveal, 0.985) * selTop;
}`;

export function applyMuscleMap(material, uniforms) {
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = 'varying vec3 vMmPos;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvMmPos = transformed;');
    shader.fragmentShader = GLSL_HEAD + '\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', 'void main() {\n mmEval();')
      .replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb = mmColour;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        {
          totalEmissiveRadiance += mmGlow + mmColour * mmFront * 0.6;
          float rim = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 3.0);
          totalEmissiveRadiance += vec3(0.50, 0.60, 0.80) * rim * 0.24;
        }`);
  };
  material.customProgramCacheKey = () => 'muscle-map-mannequin-v1';
  material.needsUpdate = true;
}

/** Set which panels are highlighted. items: [{ muscle, level: 'primary'|'secondary'|'deep', side: 'left'|'right'|'both' }] */
export function setMuscleSelection(uniforms, items) {
  const state = uniforms.mmState.value, seen = new Set();for (const v of state) { v.x = 0;v.y = 0;v.w = 0; }
  for (const item of items) {
    const m = MUSCLE_BY_ID[item.muscle];if (!m) continue;const v = state[m.index];
    const level = item.level === 'deep' ? -1 : item.level === 'secondary' ? .6 : 1;
    const rank = value => value === 1 ? 3 : value === -1 ? 2 : value ? 1 : 0;
    if (rank(level) > rank(v.x)) v.x = level;
    const sd = item.side === 'left' ? 1 : item.side === 'right' ? -1 : 0, first = !seen.has(m.index);
    v.y = !first && v.y !== sd ? 0 : sd;seen.add(m.index);
    if (item.colour) uniforms.mmCol.value[m.index].set(item.colour);
    v.w = first ? item.dim ?? 0 : Math.min(v.w, item.dim ?? 0);
  }
}
/** Use one colour for every panel (single-accent mode). */
export function setMuscleColour(uniforms, colour) {
  for (const c of uniforms.mmCol.value) c.set(colour);
}
/** Pulse-highlight a set of panels (ids). */
export function setMuscleFocus(uniforms, ids = []) {
  const state = uniforms.mmState.value;for (const v of state) v.z = 0;
  for (const id of ids) { const m = MUSCLE_BY_ID[id];if (m) state[m.index].z = 1; }
}
/** Panel centre in model space for one side. */
export function muscleCentre(id, side = 'left', height = 1.69) {
  const m = MUSCLE_BY_ID[id];if (!m) return null;const k = height / 1.69;
  return new THREE.Vector3(m.centre[0] * (side === 'right' ? -1 : 1) * k, m.centre[1] * k, m.centre[2] * k);
}
