// Authoring-only material and image passes for the upright mannequin samples.
// The original functional shader still determines the model-space regions.
import * as THREE from 'three';
import { FLARE_GROUPS } from '../src/legacy/flare-muscle-groups.js';
import { MUSCLES, resolveGroup } from '../src/legacy/muscle-map.js';
import { addMannequinBoundary, mannequinOutlineWidth, mannequinToonLighting } from '../src/mannequin-toon.js';

const groupByPanel = new Uint8Array(MUSCLES.length);
const panelById = new Map(MUSCLES.map(({ id, index }) => [id, index]));
for (const [i, { groupId }] of FLARE_GROUPS.entries()) {
  for (const panel of resolveGroup(groupId).muscles) {
    groupByPanel[panelById.get(panel)] = i + 1;
  }
}

const light = new THREE.Vector3(-0.45, 0.75, 0.55).normalize();
const base = new THREE.Color('#aebdcd');
const shade = new THREE.Color('#7c8ca3');

export function installToonPreview(shader, maskMode, highlights, toon) {
  shader.uniforms.photoMask = maskMode;
  shader.uniforms.photoToonLight = { value: light };
  shader.uniforms.photoToonBase = { value: base };
  shader.uniforms.photoToonShade = { value: shade };
  shader.uniforms.photoHighlights = { value: highlights };
  const production = toon === 'muscle-toon-v1';
  let source = (production ? mannequinToonLighting : '') + `
uniform bool photoMask;
uniform vec3 photoToonLight, photoToonBase, photoToonShade;
uniform vec4 photoHighlights[2];
float photoDepthHatch;
float photoHighlight(vec4 bounds) {
  // The references are rectangles in 512px photo space. Their small
  // elliptical patches are clipped to the live selected-region coverage.
  vec2 p = vec2(gl_FragCoord.x, 1024.0 - gl_FragCoord.y) * 0.5;
  vec2 d = p - bounds.xy;
  d = mat2(0.94, 0.342, -0.342, 0.94) * d;
  float radius = length(d / bounds.zw);
  float edge = max(fwidth(radius), 1e-4);
  return 1.0 - smoothstep(1.0 - edge, 1.0 + edge, radius);
}
` + shader.fragmentShader;
  if (production) source = addMannequinBoundary(source);
  const hatch = /float hatch = mix\(smoothstep[^;]+;/;
  if (!hatch.test(source)) throw new Error('The original hatch expression was not found');
  source = source.replace(hatch, '$&\n          photoDepthHatch = hatch;');
  const finalChunk = '#include <dithering_fragment>';
  if (!source.includes(finalChunk)) throw new Error('The photography output was not found');
  // Reuse the toon-r6 half-space, derivative antialiasing and key direction.
  // Bypass PBR output for the sample. The existing deep hatch remains the
  // sole line pattern inside any group.
  const lighting = toon ? `
    if (!photoMask) {
      ${production ? `
      float selection = clamp(abs(mmSelV), 0.0, 1.0) * mmShown * mmIsMuscle * mmPanelCoverage;
      if (mmSelV < 0.0) selection *= mix(0.26, 1.0, photoDepthHatch);
      float hardHighlight = photoHighlights[0].x < 0.0
        ? mannequinHardHighlight(mannequinLight(normal, vMmPos), mmS1)
        : max(photoHighlight(photoHighlights[0]), photoHighlight(photoHighlights[1]));
      vec3 colour = mannequinToonColour(normal, vMmPos, mmPc, selection, hardHighlight);
      colour = inkMannequinBoundary(colour, mmPc, selection);
      gl_FragColor = sRGBTransferOETF(vec4(colour, 1.0));
      ` : `
      float nDotL = dot(normal, photoToonLight);
      // Keep the original head silhouette and suppress face-like marks that
      // a hard ramp can bring out in the source mesh's minor surface relief.
      float face = smoothstep(1.44, 1.49, vMmPos.y) * smoothstep(0.00, 0.05, vMmPos.z);
      nDotL = mix(nDotL, 0.7, face);
      float rampAA = max(fwidth(nDotL), 1e-4);
      float lit = smoothstep(0.10 - rampAA, 0.10 + rampAA, nDotL);
      vec3 neutral = mix(photoToonShade, photoToonBase, lit);
      vec3 selectedColour = mix(mmPc * 0.55, mmPc, lit);
      float hardHighlight = max(photoHighlight(photoHighlights[0]), photoHighlight(photoHighlights[1]));
      selectedColour = mix(selectedColour, mix(mmPc, vec3(1.0), 0.24), hardHighlight);
      float selection = clamp(abs(mmSelV), 0.0, 1.0) * mmShown * mmIsMuscle * mmPanelCoverage;
      if (mmSelV < 0.0) selection *= mix(0.26, 1.0, photoDepthHatch);
      gl_FragColor = sRGBTransferOETF(vec4(mix(neutral, selectedColour, selection), 1.0));
      `}
    }
  ` : '';
  shader.fragmentShader = source.replace(finalChunk, finalChunk + lighting + `
    if (photoMask) {
      // Byte-exact ID, selection coverage, and the original deep hatch.
      // Disable MSAA in this diagnostic target and write after conversion.
      float panel = mmIsMuscle >= 0.5 && mmS1 > 0.0 ? 1.0 + mmIdx : 255.0;
      float coverage = clamp(abs(mmSelV), 0.0, 1.0) * mmShown * mmIsMuscle * mmPanelCoverage;
      gl_FragColor = vec4(panel / 255.0, coverage,
                         mmSelV < 0.0 ? photoDepthHatch * coverage : 0.0, 1.0);
    }
  `);
}

function canvasAt(size) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  return canvas;
}

function countMask(before, after) {
  const groupPixels = new Uint32Array(FLARE_GROUPS.length);
  let regionDifferences = 0, selectionDifferences = 0, hatchDifferences = 0;
  let silhouetteDifferences = 0, selectedPixels = 0, hatchPixels = 0;
  for (let i = 0; i < before.length; i += 4) {
    if (before[i] !== after[i]) regionDifferences++;
    if (before[i + 1] !== after[i + 1]) selectionDifferences++;
    if (before[i + 2] !== after[i + 2]) hatchDifferences++;
    if (before[i + 3] !== after[i + 3]) silhouetteDifferences++;
    if (before[i + 1]) selectedPixels++;
    if (before[i + 2]) hatchPixels++;
    const group = groupByPanel[before[i] - 1];
    if (group) groupPixels[group - 1]++;
  }
  return {
    pixels: before.length / 4, regionDifferences, selectionDifferences,
    hatchDifferences, silhouetteDifferences, selectedPixels, hatchPixels,
    groups: Object.fromEntries(FLARE_GROUPS.map(({ groupId }, i) => [groupId, groupPixels[i]])),
  };
}

export function captureMasks(renderer, scene, camera, maskMode, useToon, size) {
  const target = new THREE.WebGLRenderTarget(size, size, { samples: 0 });
  const before = new Uint8Array(size * size * 4), after = new Uint8Array(before.length);
  try {
    renderer.setRenderTarget(target);
    maskMode.value = true;
    useToon(false);
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(target, 0, 0, size, size, before);
    useToon(true);
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(target, 0, 0, size, size, after);
  } finally {
    renderer.setRenderTarget(null);
    maskMode.value = false;
    useToon(false);
    target.dispose();
  }
  const stats = countMask(before, after);
  if (stats.regionDifferences || stats.selectionDifferences ||
      stats.hatchDifferences || stats.silhouetteDifferences) {
    throw new Error('Mannequin mask drift: ' + JSON.stringify(stats));
  }
  return { mask: after, stats };
}

export function inkToon(renderer, mask, { legacy = false } = {}) {
  const size = renderer.domElement.width;
  const canvas = canvasAt(size);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(renderer.domElement, 0, 0);
  const pixels = context.getImageData(0, 0, size, size);
  const ids = new Uint8Array(size * size);
  const groups = legacy ? new Uint8Array(ids.length) : null;
  const active = legacy ? new Uint8Array(ids.length) : null;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const at = y * size + x;
      const from = ((size - 1 - y) * size + x) * 4;
      ids[at] = mask[from];
      if (legacy) {
        groups[at] = groupByPanel[mask[from] - 1] || 0;
        active[at] = mask[from + 1] > 96 ? 1 : 0;
      }
    }
  }
  // Rasterize the outer ink at the photo's supersampling density. The
  // original thick style remains available for the approved reference.
  const radius = legacy ? Math.round(size * 0.0048) : mannequinOutlineWidth * renderer.getPixelRatio();
  const reach = Math.ceil(radius + 0.5);
  const offsets = [];
  for (let y = -reach; y <= reach; y++) {
    for (let x = -reach; x <= reach; x++) {
      const distance = Math.hypot(x, y);
      const coverage = legacy ? Number(distance <= radius) : THREE.MathUtils.clamp(radius + 0.5 - distance, 0, 1);
      if (coverage > 0) offsets.push([x, y, Math.round(255 * coverage)]);
    }
  }
  offsets.sort((a, b) => b[2] - a[2]);
  const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const outline = context.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const at = y * size + x, pixel = at * 4;
      if (pixels.data[pixel + 3] < 255) {
        for (const [dx, dy, alpha] of offsets) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || xx >= size || yy < 0 || yy >= size || !ids[yy * size + xx]) continue;
          outline.data.set([42, 29, 51, alpha], pixel);
          break;
        }
      }
      if (!legacy || !ids[at] || !pixels.data[pixel + 3]) continue;
      // Ink lives at the boundary between published groups. A shared group
      // index suppresses internal subpanel changes (e.g. three deltoid lobes).
      // No groove from the legacy abs tendons or cosmetic relief is copied.
      let boundary = false, highlightEdge = false;
      for (const [dx, dy] of neighbours) {
        const xx = x + dx, yy = y + dy, other = yy * size + xx;
        if (xx < 0 || xx >= size || yy < 0 || yy >= size || !ids[other]) continue;
        if (groups[at] === groups[other]) continue;
        boundary = true;
        if (active[at] && !active[other]) highlightEdge = true;
      }
      if (boundary) {
        const channels = [42, 45, 58];
        for (let c = 0; c < 3; c++) {
          const colour = highlightEdge ? pixels.data[pixel + c] * 0.53 : channels[c];
          pixels.data[pixel + c] = 0.23 * pixels.data[pixel + c] + 0.77 * colour;
        }
      }
    }
  }
  context.putImageData(pixels, 0, 0);
  const result = canvasAt(size);
  const destination = result.getContext('2d');
  destination.putImageData(outline, 0, 0);
  destination.drawImage(canvas, 0, 0);
  return result;
}

export function makeComparison(before, after, title, deep, approved = null) {
  const panel = 512, gap = 12, header = 79, footer = deep ? 42 : 20;
  const canvas = canvasAt(1);
  const images = approved ? [before, approved, after] : [before, after];
  const labels = approved
    ? ['原版 · 拉丝钛', '已确认样图 · 原阴影', '浅暗部 · 细描边']
    : ['现版 · 拉丝钛', '新版 · 日漫样图'];
  canvas.width = panel * images.length + gap * (images.length - 1);
  canvas.height = header + panel + footer;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eff2f6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const [index, image] of images.entries()) {
    const x = index * (panel + gap);
    ctx.fillStyle = '#f8f9fb';
    ctx.fillRect(x, header, panel, panel);
    ctx.drawImage(image, x, header, panel, panel);
  }
  ctx.fillStyle = '#202938';
  ctx.font = '700 24px "Microsoft YaHei", sans-serif';
  ctx.fillText(title, 18, 34);
  ctx.font = '600 16px "Microsoft YaHei", sans-serif';
  labels.forEach((label, index) => ctx.fillText(label, index * (panel + gap) + 18, 64));
  if (deep) {
    ctx.font = '15px "Microsoft YaHei", sans-serif';
    ctx.fillText('斜线表示深层肌群', 18, canvas.height - 15);
  }
  return canvas;
}
