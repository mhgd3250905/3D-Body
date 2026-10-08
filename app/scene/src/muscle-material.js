import * as THREE from 'three';
import { applyMuscleMap } from './legacy/muscle-map.js';

// The imported shader defines functional regions and hit testing. Adapt only
// their presentation here; retain the supplied geometry, normals and source.
export function applyFunctionalSurface(material, uniforms, { posed = false, thumbnail = false, density = null } = {}) {
  applyMuscleMap(material, uniforms);
  const compile = material.onBeforeCompile;
  const strokeDensity = density ?? { value: 1 };
  material.onBeforeRender = renderer => {
    // The same mannequin is also rendered directly in detail and its preview.
    // Only an offscreen thumbnail target uses the caller's separate density.
    if (!density || renderer.getRenderTarget() === null) strokeDensity.value = renderer.getPixelRatio();
  };
  material.onBeforeCompile = (shader, renderer) => {
    compile(shader, renderer);
    shader.uniforms.mmStrokeDensity = strokeDensity;
    if (posed) shader.vertexShader = 'attribute vec3 mmRest;\n' + shader.vertexShader.replace('vMmPos = transformed;', 'vMmPos = mmRest;');
    shader.fragmentShader = 'uniform float mmStrokeDensity;\nfloat mmPanelCoverage;\n' + shader.fragmentShader;
    const replace = (from, to) => {
      if (!shader.fragmentShader.includes(from)) throw new Error('functional_shader_source_mismatch');
      shader.fragmentShader = shader.fragmentShader.replace(from, to);
    };
    // Preserve the original smooth normals completely. Even a zero dH leaves
    // a redundant normalisation by a screen-space determinant at creases.
    const relief = /#include <normal_fragment_maps>\s*\{\s*float h = mmEdge \* mmIsMuscle;[\s\S]*?normal = normalize\(abs\(fDet\) \* normal - grad\);\s*\}/;
    if (!relief.test(shader.fragmentShader)) throw new Error('functional_relief_source_mismatch');
    shader.fragmentShader = shader.fragmentShader.replace(relief, '#include <normal_fragment_maps>');
    // The winning-score gap is absolute on either side of a panel border.
    // Restore its sign just for derivatives so a quad crossing that border
    // cannot cancel its gradient and leave alternating gaps in a fine curve.
    replace('float gap = b1 - s2; float g = length(vec2(dFdx(gap), dFdy(gap))) + 1e-6;',
      `float gap = b1 - s2;
       float signedGap = gap * (i1 < i2 ? 1.0 : -1.0);
       float pairKey = float(min(i1, i2) * MM_N + max(i1, i2));
       float pairChange = abs(dFdx(pairKey)) + abs(dFdy(pairKey));
       float signedGradient = length(vec2(dFdx(signedGap), dFdy(signedGap)));
       float originalGradient = length(vec2(dFdx(gap), dFdy(gap)));
       float g = mix(signedGradient, originalGradient, step(0.5, pairChange)) + 1e-6;`);
    replace('float ax = abs(vMmPos.x) * mmScale; float ag = length(vec2(dFdx(ax), dFdy(ax))) + 1e-7;',
      'float signedX = vMmPos.x * mmScale; float ax = abs(signedX); float ag = length(vec2(dFdx(signedX), dFdy(signedX))) + 1e-7;');
    // Fine diagram strokes have bounded screen widths. They must not become
    // wide dark channels as a user zooms closer to the mathematical panels.
    replace('float wpx = max((sameFamily ? 0.008 : 0.022) / g, sameFamily ? 0.6 : 1.05);',
      'float wpx = clamp((sameFamily ? 0.008 : 0.022) / g, (sameFamily ? 0.18 : 0.28) * mmStrokeDensity, (sameFamily ? 0.35 : 0.55) * mmStrokeDensity);');
    replace('float mw = max((mmF[i1].z > 0.5 ? mix(0.0015, 0.0024, smoothstep(0.95, 1.05, p.y)) : 0.0022) / ag, 0.7);',
      'float mw = clamp((mmF[i1].z > 0.5 ? mix(0.0015, 0.0024, smoothstep(0.95, 1.05, p.y)) : 0.0022) / ag, 0.20 * mmStrokeDensity, 0.45 * mmStrokeDensity);');
    replace('float lw = max(0.0015 / yg, 0.6);', 'float lw = clamp(0.0015 / yg, 0.18 * mmStrokeDensity, 0.40 * mmStrokeDensity);');
    replace('float px = gap / g;', 'float px = gap / g; mmPanelCoverage = smoothstep(0.0, 0.9, px);');
    replace('float sh = mmShown * mmIsMuscle;', 'float sh = mmShown * mmIsMuscle * mmPanelCoverage;');
    replace('mmBase * mix(0.80, 1.04, mmEdge)', 'mmBase * mix(0.985, 1.015, mmEdge)');
    replace('mix(0.74, 1.0, mmEdge)', 'mix(0.96, 1.0, mmEdge)');
    replace('mix(0.78, 1.0, mmEdge)', 'mix(0.96, 1.0, mmEdge)');
    replace('mix(0.85, 1.0, mmEdge)', 'mix(0.97, 1.0, mmEdge)');
    // Ink belongs to the diagram, not the physical material. Lighting and
    // ACES otherwise wash it out on the bright mannequin and selected panels.
    replace('col = mix(col, mmGroove, mmGrooveV * mix(0.40, 0.82, mmIsMuscle));', '');
    replace('* (1.0 - mmGrooveV) * mmShown;', '* mmShown;');
    replace('lit *= 1.0 - 0.85 * mmDimV;', 'lit *= (1.0 - 0.85 * mmDimV) * mmPanelCoverage;');
    replace('float hA = max(fwidth(vMmPos.y) * 140.0, 0.02);\n          float hatch = smoothstep(0.5 - hA, 0.5 + hA, abs(fract((vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0) - 0.5) * 2.0);',
      'float stripe = (vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0;\n          float footprint = fwidth(stripe);\n          float hA = max(footprint, 0.02);\n          float hatch = mix(smoothstep(0.5 - hA, 0.5 + hA, abs(fract(stripe) - 0.5) * 2.0), 0.5, smoothstep(0.3, 0.8, footprint));');
    if (posed) {
      // The action actor is a plain white study model with color fills only.
      // Fine anatomical strokes belong exclusively to the supplied mannequin.
      replace('vec3 base = mix(mmSkin, mmBase * mix(0.985, 1.015, mmEdge), mmIsMuscle);', 'vec3 base = mmBase;');
      replace('float sh = mmShown * mmIsMuscle * mmPanelCoverage;', 'float sh = mmShown * mmIsMuscle;');
      replace('float hatch = mix(smoothstep(0.5 - hA, 0.5 + hA, abs(fract(stripe) - 0.5) * 2.0), 0.5, smoothstep(0.3, 0.8, footprint));', 'float hatch = 1.0;');
      replace('lit *= (1.0 - 0.85 * mmDimV) * mmPanelCoverage;', 'lit *= 1.0 - 0.85 * mmDimV;');
      shader.fragmentShader = shader.fragmentShader.replace(/vec3 hot = mmMulti > 0\.5[\s\S]*?mix\(0\.96, 1\.0, mmEdge\);/, 'vec3 hot = pc;');
      replace('mix(mmBase, pc, 0.52) * mix(0.97, 1.0, mmEdge)', 'mix(mmBase, pc, 0.52)');
    }
    if (thumbnail) {
      // r170 disables tone mapping and outputs linear RGB for ordinary render
      // targets. This RGBA8 target is read into an sRGB ImageData, so encode
      // it explicitly once using the same official ACES/exposure as the stage.
      // r170 uploads the renderer's live exposure for this active uniform.
      shader.fragmentShader = '#ifndef TONE_MAPPING\n' + THREE.ShaderChunk.tonemapping_pars_fragment + '\n#endif\n' + shader.fragmentShader;
      replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n#ifndef TONE_MAPPING\n gl_FragColor.rgb = ACESFilmicToneMapping(gl_FragColor.rgb);\n#endif');
      replace('#include <colorspace_fragment>', 'gl_FragColor = sRGBTransferOETF(gl_FragColor);');
    }
    if (!posed) {
      // Composite fine, antialiased region curves in display space, after the
      // same tone mapping/encoding for the stage and cached thumbnail. Ink
      // uses the existing groove swatch converted from Three's linear Color;
      // skin blockers keep the face, hands and feet free of diagram seams.
      const output = thumbnail ? 'gl_FragColor = sRGBTransferOETF(gl_FragColor);' : '#include <colorspace_fragment>';
      replace(output, output + '\n{\n vec3 ink = sRGBTransferOETF(vec4(mmGroove, 1.0)).rgb;\n float coverage = clamp(mmGrooveV * mmIsMuscle * 0.68, 0.0, 1.0);\n gl_FragColor.rgb = mix(gl_FragColor.rgb, min(gl_FragColor.rgb, ink), coverage);\n}');
    }
  };
  material.customProgramCacheKey = () => 'flare-functional-surface-v5-' + Number(posed) + '-' + Number(thumbnail);
  material.needsUpdate = true;
}
