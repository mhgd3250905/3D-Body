import * as THREE from 'three';
import { FLARE_GROUPS } from './legacy/flare-muscle-groups.js';
import { MUSCLES, resolveGroup } from './legacy/muscle-map.js';

const panelIndices = new Map(MUSCLES.map(({ id, index }) => [id, index]));
export const mannequinPanelGroups = new Uint8Array(MUSCLES.length);
for (const [index, { groupId }] of FLARE_GROUPS.entries()) {
  for (const panel of resolveGroup(groupId).muscles) {
    mannequinPanelGroups[panelIndices.get(panel)] = index + 1;
  }
}

const shade = new THREE.Color('#95a6ba');
const base = new THREE.Color('#aebdcd');
const boundaryInk = new THREE.Color('#515a67');
const light = new THREE.Vector3(-0.45, 0.75, 0.55).normalize();
const vec3 = ({ x, y, z, r, g, b }) =>
  `vec3(${[x ?? r, y ?? g, z ?? b].map(channel => channel.toFixed(8)).join(', ')})`;

export const mannequinOutlineWidth = 1.2;

export const mannequinToonLighting = /* glsl */`
float mannequinLight(vec3 n, vec3 p) {
  float light = dot(normalize(n), ${vec3(light)});
  // Do not reveal the featureless mannequin's minor facial relief in ink.
  float face = smoothstep(1.44, 1.49, p.y) * smoothstep(0.00, 0.05, p.z);
  return mix(light, 0.7, face);
}
float mannequinHardHighlight(float light, float panelScore) {
  float band = 0.74 * light + 0.26 * panelScore;
  float aa = max(fwidth(band), 1e-4);
  return smoothstep(0.82 - aa, 0.82 + aa, band);
}
vec3 mannequinToonColour(vec3 n, vec3 p, vec3 colour, float selection, float hardHighlight) {
  float light = mannequinLight(n, p);
  float aa = max(fwidth(light), 1e-4);
  // The approved style's first revision used +0.10 and #7c8ca3.
  // Shift the ramp, as well as lifting the dark tone, to shrink the shadows.
  float lit = smoothstep(-0.10 - aa, -0.10 + aa, light);
  vec3 neutral = mix(${vec3(shade)}, ${vec3(base)}, lit);
  vec3 selected = mix(colour * 0.55, colour, lit);
  selected = mix(selected, mix(colour, vec3(1.0), 0.24), hardHighlight);
  return mix(neutral, selected, selection);
}
`;

export function addMannequinBoundary(source) {
  const coverage = 'mmPanelCoverage = smoothstep(0.0, 0.9, px);';
  if (!source.includes(coverage)) throw new Error('mannequin_toon_boundary_missing');
  return /* glsl */`
const int mannequinGroups[${mannequinPanelGroups.length}] = int[${mannequinPanelGroups.length}](${mannequinPanelGroups.join(', ')});
float mannequinBoundary;
vec3 inkMannequinBoundary(vec3 colour, vec3 accent, float selection) {
  vec3 ink = mix(${vec3(boundaryInk)}, accent * 0.55, step(0.15, selection));
  return mix(colour, ink, 0.56 * mannequinBoundary);
}
` + source.replace(coverage, coverage + /* glsl */`
       // Ink the published group boundary using the score's screen derivative.
       float edge = 1.0 - smoothstep(0.38 * mmStrokeDensity - 0.5,
                                    0.38 * mmStrokeDensity + 0.5, max(0.0, px));
       int a = b1 > 0.0 ? mannequinGroups[i1] : 0;
       int b = b2 > 0.0 ? mannequinGroups[i2] : 0;
       mannequinBoundary = a != b ? edge : 0.0;`);
}

// Presentation only. Keep the original selector, anatomical hit-test,
// smooth normals, highlight coverage and deep hatch in the functional shader.
export function applyMannequinToon(material) {
  const compile = material.onBeforeCompile;
  const cacheKey = material.customProgramCacheKey;
  material.onBeforeCompile = (shader, renderer) => {
    compile(shader, renderer);
    let source = addMannequinBoundary(`
float mannequinDepthHatch;
${mannequinToonLighting}
` + shader.fragmentShader);
    const replace = (from, to) => {
      if (!source.includes(from)) throw new Error('mannequin_toon_source_mismatch');
      source = source.replace(from, to);
    };
    const hatch = /float hatch = mix\(smoothstep[^;]+;/.exec(source)?.[0];
    if (!hatch) throw new Error('mannequin_toon_hatch_missing');
    replace(hatch, hatch + '\n          mannequinDepthHatch = hatch;');
    replace('#include <dithering_fragment>', `#include <dithering_fragment>
       // The key is fixed in mannequin space, so rotation and zoom cannot
       // relight the same patch. A soft fill from the back keeps the front and
       // back teaching images legible with the same two hard tone values.
       vec3 n = normalize((vec4(normal, 0.0) * viewMatrix).xyz);
       n.z = abs(n.z);
       float selection = clamp(abs(mmSelV), 0.0, 1.0) * mmShown * mmIsMuscle * mmPanelCoverage;
       if (mmSelV < 0.0) selection *= mix(0.26, 1.0, mannequinDepthHatch);
       float highlight = mannequinHardHighlight(mannequinLight(n, vMmPos), mmS1);
       if (mmHomeEmphasis < 0.5) {
         highlight *= smoothstep(0.005, 0.045, -vMmPos.x);
       }
       vec3 colour = mannequinToonColour(n, vMmPos, mmPc, selection, highlight);
       colour = inkMannequinBoundary(colour, mmPc, selection);
       gl_FragColor.rgb = sRGBTransferOETF(vec4(colour, 1.0)).rgb;`);
    shader.fragmentShader = source;
  };
  material.customProgramCacheKey = () => cacheKey() + '-mannequin-toon-v1-fine-ink';
  material.needsUpdate = true;
}

export function createMannequinOutlineMaterial(uniforms, strokeDensity) {
  const viewport = new THREE.Vector4();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      mmHubFraming: uniforms.mmHubFraming,
      mmHubBottom: uniforms.mmHubBottom,
      ink: { value: new THREE.Color('#2a1d33') },
      offsetPerPixel: { value: new THREE.Vector2() },
      mannequinOutlineWidth: { value: mannequinOutlineWidth },
    },
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    vertexShader: /* glsl */`
      uniform vec2 offsetPerPixel;
      uniform float mannequinOutlineWidth;
      varying float bodyHeight;
      void main() {
        bodyHeight = position.y;
        vec4 eye = modelViewMatrix * vec4(position, 1.0);
        vec4 clip = projectionMatrix * eye;
        vec3 n = normalize(normalMatrix * normal);
        vec4 displaced = projectionMatrix * vec4(eye.xyz + n * 0.01, 1.0);
        vec2 direction = (displaced.xy / displaced.w - clip.xy / clip.w) / offsetPerPixel;
        direction /= max(length(direction), 1e-6);
        // Offset in framebuffer pixels, not metres. Push only depth as in the
        // V5 shell so inner folds stay behind the underlying mannequin.
        vec4 pushed = projectionMatrix * vec4(eye.xyz - vec3(0.0, 0.0, 0.012), 1.0);
        clip.z = pushed.z / pushed.w * clip.w;
        clip.xy += direction * offsetPerPixel * mannequinOutlineWidth * clip.w;
        gl_Position = clip;
      }`,
    fragmentShader: /* glsl */`
      uniform float mmHubFraming, mmHubBottom;
      uniform vec3 ink;
      varying float bodyHeight;
      void main() {
        float alpha = 1.0;
        if (mmHubFraming > 0.5) {
          if (bodyHeight <= mmHubBottom) discard;
          alpha = smoothstep(mmHubBottom, mmHubBottom + 0.065, bodyHeight);
        }
        gl_FragColor = sRGBTransferOETF(vec4(ink, alpha));
      }`,
  });
  material.onBeforeRender = renderer => {
    renderer.getCurrentViewport(viewport);
    const density = renderer.getRenderTarget() ? strokeDensity.value : renderer.getPixelRatio();
    material.uniforms.offsetPerPixel.value.set(
      2 * density / Math.max(1, viewport.z),
      2 * density / Math.max(1, viewport.w),
    );
    // ShaderMaterial may be reused by both views in a pass.
    material.uniformsNeedUpdate = true;
  };
  return material;
}
