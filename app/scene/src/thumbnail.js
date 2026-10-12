import * as THREE from 'three';

// Keep small diagrams crisp independently of the large stage's GPU budget.
export const thumbnailDensity = (quality, ratio = globalThis.devicePixelRatio || 1) =>
  quality === 'low' ? 1 : Math.min(3, Math.max(2, ratio));

// Fit all eight bounds corners in the image area, excluding the card caption.
export function fitThumbnailCamera(camera, box, direction, width, height, padding = 1.08) {
  const center = box.getCenter(new THREE.Vector3()), dir = direction.clone().normalize();
  const right = new THREE.Vector3().crossVectors(camera.up, dir).normalize();
  const up = new THREE.Vector3().crossVectors(dir, right).normalize();
  camera.aspect = width / height;
  const vertical = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), horizontal = vertical * camera.aspect;
  let distance = 0.1;
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
    const corner = new THREE.Vector3(x, y, z).sub(center);
    distance = Math.max(distance, corner.dot(dir) + Math.max(Math.abs(corner.dot(right)) / horizontal, Math.abs(corner.dot(up)) / vertical));
  }
  camera.position.copy(center).addScaledVector(dir, distance * padding);
  camera.lookAt(center); camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
}

export function createThumbnailRenderer(renderer, canvas) {
  let target = null;
  const strokeDensity = { value: 1 };
  const materials = new Map();
  function outputMaterial(source) {
    if (materials.has(source)) return materials.get(source);
    const material = source.clone(), compile = source.onBeforeCompile;
    material.onBeforeRender = (...args) => source.onBeforeRender(...args);
    material.onBeforeCompile = (shader, activeRenderer) => {
      compile.call(source, shader, activeRenderer);
      if (shader.uniforms.mmStrokeDensity) shader.uniforms.mmStrokeDensity = strokeDensity;
      // A normal r170 render target disables output conversion. The actor's
      // original materials need the same ACES + sRGB output as the stage.
      // Already-encoded teaching materials must never be encoded twice.
      if (!shader.fragmentShader.includes('#include <colorspace_fragment>')) return;
      if (source.toneMapped) {
        shader.fragmentShader = '#ifndef TONE_MAPPING\n' + THREE.ShaderChunk.tonemapping_pars_fragment + '\n#endif\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <tonemapping_fragment>',
          '#include <tonemapping_fragment>\n#ifndef TONE_MAPPING\n gl_FragColor.rgb = ACESFilmicToneMapping(gl_FragColor.rgb);\n#endif');
      }
      shader.fragmentShader = shader.fragmentShader.replace('#include <colorspace_fragment>', 'gl_FragColor = sRGBTransferOETF(gl_FragColor);');
    };
    material.customProgramCacheKey = () => source.customProgramCacheKey() + '-thumbnail-output-v1';
    materials.set(source, material); return material;
  }
  function render(scene, camera, width, height, density, encodedOutput = false) {
    strokeDensity.value = density;
    const pixelWidth = Math.ceil(width * density), pixelHeight = Math.ceil(height * density);
    if (!target) target = new THREE.WebGLRenderTarget(pixelWidth, pixelHeight, { samples: Math.min(4, renderer.capabilities.maxSamples), stencilBuffer: false });
    else target.setSize(pixelWidth, pixelHeight);
    const previous = { target: renderer.getRenderTarget(), viewport: renderer.getViewport(new THREE.Vector4()), scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest(), color: renderer.getClearColor(new THREE.Color()), alpha: renderer.getClearAlpha(), autoClear: renderer.autoClear };
    const replaced = [];
    const pixels = new Uint8Array(pixelWidth * pixelHeight * 4), flipped = new Uint8ClampedArray(pixels.length);
    try {
      if (!encodedOutput) scene.traverse(object => {
        if (!object.isMesh) return;
        const original = object.material;
        replaced.push([object, original]);
        object.material = Array.isArray(original) ? original.map(outputMaterial) : outputMaterial(original);
      });
      renderer.autoClear = true; renderer.setClearColor(0x000000, 0); renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.readRenderTargetPixels(target, 0, 0, pixelWidth, pixelHeight, pixels);
      for (let y = 0; y < pixelHeight; y++) for (let x = 0; x < pixelWidth; x++) {
        const from = ((pixelHeight - 1 - y) * pixelWidth + x) * 4, to = (y * pixelWidth + x) * 4, alpha = pixels[from + 3];
        const scale = alpha ? 255 / alpha : 0;
        flipped[to] = Math.min(255, pixels[from] * scale); flipped[to + 1] = Math.min(255, pixels[from + 1] * scale);
        flipped[to + 2] = Math.min(255, pixels[from + 2] * scale); flipped[to + 3] = alpha;
      }
      // Update the visible image only after its replacement is complete.
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) { canvas.width = pixelWidth; canvas.height = pixelHeight; }
      canvas.getContext('2d').putImageData(new ImageData(flipped, pixelWidth, pixelHeight), 0, 0);
    } finally {
      for (const [object, original] of replaced) object.material = original;
      renderer.setRenderTarget(previous.target); renderer.setViewport(previous.viewport); renderer.setScissor(previous.scissor);
      renderer.setScissorTest(previous.scissorTest); renderer.setClearColor(previous.color, previous.alpha); renderer.autoClear = previous.autoClear;
    }
  }
  function dispose() {
    target?.dispose(); target = null;
    for (const material of materials.values()) material.dispose();
    materials.clear(); // Textures and geometry still belong to the live models.
  }
  return { render, dispose };
}
