import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createThumbnailRenderer, fitThumbnailCamera, thumbnailDensity } from '../src/thumbnail.js';

assert.equal(thumbnailDensity('medium', 3), 3);
assert.equal(thumbnailDensity('medium', 1), 2);
assert.equal(thumbnailDensity('high', 4), 3);
assert.equal(thumbnailDensity('low', 3), 1);

// Both standing anatomy and wide/inverted action bounds must fit inside the
// actual image area, even when viewed obliquely; captions live outside it.
let fits = 0;
for (const [min, max] of [
  [[-.5, 0, -.2], [.5, 1.69, .2]],
  [[-1.4, -.03, -.8], [1.3, 1.3, .9]],
  [[-.7, 0, -1.2], [.6, 1.9, 1.1]],
]) for (const dir of [[0, .1, 1], [0, .1, -1], [1, .2, .2], [-.7, .6, -.8]]) {
  const box = new THREE.Box3(new THREE.Vector3(...min), new THREE.Vector3(...max));
  const camera = new THREE.PerspectiveCamera(32, 1, .02, 40);
  fitThumbnailCamera(camera, box, new THREE.Vector3(...dir), 74, 102);
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
    const projected = new THREE.Vector3(x, y, z).project(camera);
    assert.ok(Math.abs(projected.x) < .95 && Math.abs(projected.y) < .95 && Math.abs(projected.z) < 1,
      'head, hands and feet all stay inside the image with breathing room');
  }
  fits++;
}

globalThis.ImageData = class { constructor(data, width, height) { Object.assign(this, { data, width, height }); } };
let painted = null, fail = false, encoded = false, clone = null;
const canvas = { width: 1, height: 1, getContext: () => ({ putImageData: image => { painted = image; } }) };
const scene = new THREE.Scene(), source = new THREE.MeshStandardMaterial();
const shared = { value: .7 }, sourceDensity = { value: 1.5 };
source.onBeforeCompile = shader => { shader.uniforms.selection = shared; shader.uniforms.mmStrokeDensity = sourceDensity; };
source.customProgramCacheKey = () => 'source-selection';
const original = [source, source], mesh = new THREE.Mesh(new THREE.BoxGeometry(), original); scene.add(mesh);
const previous = { target: null, viewport: new THREE.Vector4(3, 4, 390, 740), scissor: new THREE.Vector4(0, 86, 390, 654),
  scissorTest: true, color: new THREE.Color('#101116'), alpha: .25 };
const active = { ...previous, viewport: previous.viewport.clone(), scissor: previous.scissor.clone(), color: previous.color.clone() };
const renderer = {
  capabilities: { maxSamples: 4 }, autoClear: false,
  getRenderTarget: () => active.target, setRenderTarget: value => { active.target = value; },
  getViewport: out => out.copy(active.viewport), setViewport: value => active.viewport.copy(value),
  getScissor: out => out.copy(active.scissor), setScissor: value => active.scissor.copy(value),
  getScissorTest: () => active.scissorTest, setScissorTest: value => { active.scissorTest = value; },
  getClearColor: out => out.copy(active.color), getClearAlpha: () => active.alpha,
  setClearColor: (color, alpha) => { active.color.set(color); active.alpha = alpha; },
  render() {
    assert.equal(active.target.width, 148); assert.equal(active.target.height, 204);
    if (encoded) { assert.equal(mesh.material, original); return; }
    assert.notEqual(mesh.material[0], source);
    if (clone) assert.equal(mesh.material[0], clone, 'unchanged materials reuse the thumbnail shader');
    clone = mesh.material[0];
    const shader = { uniforms: {}, fragmentShader: THREE.ShaderLib.standard.fragmentShader };
    clone.onBeforeCompile(shader, renderer);
    assert.equal(shader.uniforms.selection, shared, 'live selected-region uniforms keep their identity');
    assert.equal(shader.uniforms.mmStrokeDensity.value, 2);
    assert.equal(sourceDensity.value, 1.5, 'the stage line density is unchanged');
    assert.ok(shader.fragmentShader.includes('ACESFilmicToneMapping(gl_FragColor.rgb)'));
    assert.ok(shader.fragmentShader.includes('gl_FragColor = sRGBTransferOETF(gl_FragColor)'));
    assert.notEqual(clone.customProgramCacheKey(), source.customProgramCacheKey());
  },
  readRenderTargetPixels(_target, _x, _y, _width, _height, pixels) {
    if (fail) throw new Error('readback interrupted');
    pixels.fill(255);
  },
};
const thumbnail = createThumbnailRenderer(renderer, canvas), camera = new THREE.PerspectiveCamera();
function restored() {
  assert.equal(mesh.material, original, 'including array identity, the main model materials are restored');
  assert.deepEqual(active, previous, 'target, viewport, scissor and clear state are restored');
  assert.equal(renderer.autoClear, false);
}
thumbnail.render(scene, camera, 74, 102, 2); restored();
assert.equal(painted.width, 148); assert.equal(painted.height, 204);
thumbnail.render(scene, camera, 74, 102, 2); restored();
const previousImage = painted;
fail = true;
assert.throws(() => thumbnail.render(scene, camera, 74, 102, 2), /readback interrupted/); restored();
assert.equal(painted, previousImage, 'a failed replacement leaves the cached image intact');
fail = false; encoded = true;
thumbnail.render(scene, camera, 74, 102, 2, true); restored();
let sourceDisposed = false, cloneDisposed = false;
source.addEventListener('dispose', () => { sourceDisposed = true; });
clone.addEventListener('dispose', () => { cloneDisposed = true; });
thumbnail.dispose();
assert.equal(sourceDisposed, false); assert.equal(cloneDisposed, true);
console.log(`Thumbnail checks passed: ${fits} full-body fits, density, output conversion, material identity, failure recovery and resource ownership.`);
