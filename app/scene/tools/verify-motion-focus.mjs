import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createMotionFocusField, MOTION_FOCUS_GLSL } from '../src/motion-focus.js';
import { MUSCLES, MUSCLE_BY_ID, muscleAt } from '../src/legacy/muscle-map.js';
import { createSurfaceSelection } from '../src/mapped-mesh.js';

const field = createMotionFocusField();
const panel = id => MUSCLE_BY_ID[id].index;
const point = (x, y, z) => new THREE.Vector3(x, y, z);
const select = (ids, side = 0) => field.setSelection(ids.map(panel), side);
const coverage = p => {
  const value = field.coverageAt(p);
  assert.ok(Number.isFinite(value) && value >= 0 && value <= 1, 'coverage is a finite unit value');
  return value;
};

select([]);
assert.equal(coverage(point(.14, .83, -.09)), 0, 'empty selection never paints');

// This one smooth, exterior glute boundary crosses arbitrary points between
// source vertices. A binary atlas lookup, even at a finer mesh resolution,
// cannot satisfy both the many distinct fractional samples and small steps.
select(['glutes']);
let previous = coverage(point(.14, .83, -.09)), fractional = 0, maximumStep = 0;
const distinct = new Set();
assert.ok(previous > .999, 'the glute interior retains its colour');
for (let i = 1; i <= 8192; i++) {
  const value = coverage(point(.14 + .15 * i / 8192, .83, -.09));
  maximumStep = Math.max(maximumStep, Math.abs(value - previous));
  assert.ok(value <= previous + 1e-9, 'this exterior transition has no contour ripples');
  if (value > 0 && value < 1) { fractional++; distinct.add(value.toFixed(7)); }
  previous = value;
}
assert.equal(previous, 0, 'the outer garment stays uncoloured');
assert.ok(fractional > 100 && distinct.size > 100, 'the boundary is a continuous field, not vertex labels');
assert.ok(maximumStep < .01, 'subpixel-size atlas steps cannot become binary jumps');

// These two neighbouring quadriceps panels change their atlas winner along
// the segment. Selecting the whole group must erase that internal seam.
select(['quadRect', 'quadLat', 'quadMed']);
const unionWinners = new Set();
for (let i = 0; i <= 240; i++) {
  const p = point(.12 + .05 * i / 240, .65, .09);
  const hit = muscleAt(p);
  assert.ok(hit && ['quadRect', 'quadLat'].includes(hit.id));
  unionWinners.add(hit.id);
  assert.ok(coverage(p) > .999, 'neighbouring selected panels have no inner dark seam');
}
assert.equal(unionWinners.size, 2, 'the union check actually crosses a panel border');

// Separate left/right choices still use one mirrored field and retain the
// existing groin/hand teaching guards even where the atlas itself is muscle.
const left = point(.14, .83, -.09), right = point(-.14, .83, -.09);
select(['glutes']);
assert.equal(coverage(left), coverage(right));
select(['glutes'], 1);
assert.ok(coverage(left) > .999); assert.equal(coverage(right), 0);
select(['glutes'], -1);
assert.equal(coverage(left), 0); assert.ok(coverage(right) > .999);
const groin = point(0, .79, .02), hand = point(.37, .87, .05);
assert.equal(muscleAt(groin)?.id, 'adductors', 'groin probe exercises the extra adductor lobe');
assert.equal(muscleAt(hand)?.id, 'forearmFlex', 'hand probe exercises the guard, not just a skin blocker');
select(['adductors']); assert.equal(coverage(groin), 0);
select(['forearmFlex', 'forearmExt']); assert.equal(coverage(hand), 0);
select(MUSCLES.filter(m => !m.skin).map(m => m.id));
for (const p of [point(0, 1.6, .01), point(.4, .78, .09), point(.17, .03, .03), point(10, 10, 10)]) {
  assert.equal(coverage(p), 0, 'skin blockers and exterior space remain uncoloured');
}

// Independent CPU picking defines which region a well-inside point belongs
// to. Check many regions, including the custom rectus outline, without
// duplicating the shader's scoring equations in this test.
let interiorChecks = 0;
const checkedPanels = new Set();
for (const x of [.035, .085, .14, .19, .245, .3]) {
  for (const y of [.3, .5, .65, .83, 1.03, 1.15, 1.3, 1.4]) {
    for (const z of [-.1, -.05, .02, .075, .14]) {
      if (x < .12 && y > .66 && y < .96) continue;
      const p = point(x, y, z), hit = muscleAt(p);
      if (!hit || hit.margin < .2 || hit.score < .2) continue;
      select([hit.id]); assert.ok(coverage(p) > .999, `winning interior ${hit.id} is highlighted`);
      const other = hit.id === 'abs' ? 'glutes' : 'abs';
      select([other]); assert.equal(coverage(p), 0, `unselected interior ${hit.id} keeps its original material`);
      interiorChecks++; checkedPanels.add(hit.id);
    }
  }
}
assert.ok(interiorChecks > 35 && checkedPanels.size > 10);
assert.ok(checkedPanels.has('abs'), 'custom rectus shape is included');

// The production material adapter must evaluate interpolated atlas position
// in the fragment shader. focusW remains CPU data for the camera only; it
// must never become a displayed, topology-dependent mask again.
function geometry() {
  const value = new THREE.BufferGeometry();
  value.setAttribute('position', new THREE.Float32BufferAttribute([.13, .82, -.09, .17, .84, -.09, .14, .86, -.08], 3));
  value.setAttribute('mmRest', value.attributes.position.clone());
  value.setAttribute('normal', new THREE.Float32BufferAttribute([0, 0, -1, 0, 0, -1, 0, 0, -1], 3));
  value.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1], 2));
  value.setIndex([0, 1, 2]);
  return value;
}
const original = new THREE.MeshPhysicalMaterial({ color: '#141820', roughness: .79, metalness: .04 });
original.map = new THREE.Texture(); original.normalMap = new THREE.Texture();
const authored = { value: 7 };
original.onBeforeCompile = shader => { shader.uniforms.authoredSentinel = authored; shader.fragmentShader = '// authoredSentinel\n' + shader.fragmentShader; };
const shorts = new THREE.Mesh(geometry(), original); shorts.name = 'Coach_Training_Shorts';
const tee = new THREE.Mesh(geometry(), [original, original]); tee.name = 'Coach_Training_Tee';
const face = new THREE.Mesh(geometry(), original); face.name = 'Coach_Face';
const meshes = [shorts, tee, face];
const saved = meshes.map(mesh => ({ material: mesh.material, visible: mesh.visible,
  attributes: Object.fromEntries(Object.entries(mesh.geometry.attributes).map(([name, a]) => [name, [...a.array]])),
  index: [...mesh.geometry.index.array] }));
const surface = createSurfaceSelection(meshes);
surface.show('glute-max', [], true);
const shaders = [];
for (const mesh of [shorts, tee]) for (const material of [].concat(mesh.material)) {
  assert.ok(surface.isProxy(material)); assert.equal(material.type, original.type);
  for (const key of ['roughness', 'metalness', 'map', 'normalMap', 'opacity', 'side']) assert.equal(material[key], original[key]);
  assert.deepEqual(material.color.toArray(), original.color.toArray());
  const shader = { uniforms: {}, vertexShader: THREE.ShaderLib.physical.vertexShader, fragmentShader: THREE.ShaderLib.physical.fragmentShader };
  material.onBeforeCompile(shader, {});
  assert.equal(shader.uniforms.authoredSentinel, authored, 'the original shader extension survives');
  assert.match(shader.vertexShader, /attribute\s+vec3\s+mmRest\b/);
  assert.match(shader.fragmentShader, /flareFocusCoverage\s*\(/);
  assert.doesNotMatch(shader.vertexShader + shader.fragmentShader, /\bvFocusW\b|attribute\s+float\s+focusW\b/);
  assert.ok(shader.fragmentShader.includes(MOTION_FOCUS_GLSL), 'the real proxy uses the shared continuous field');
  shaders.push(shader);
}
assert.equal(face.material, original, 'the face never receives a proxy');
const sharedFieldKeys = Object.keys(shaders[0].uniforms).filter(key => key !== 'authoredSentinel');
assert.ok(sharedFieldKeys.length >= 3);
for (const shader of shaders.slice(1)) for (const key of sharedFieldKeys) {
  assert.equal(shader.uniforms[key], shaders[0].uniforms[key], 'garment primitives share the same field and selection');
}
surface.restore();
for (const [i, mesh] of meshes.entries()) {
  assert.equal(mesh.material, saved[i].material); assert.equal(mesh.visible, saved[i].visible);
  for (const [name, array] of Object.entries(saved[i].attributes)) assert.deepEqual([...mesh.geometry.attributes[name].array], array);
  assert.deepEqual([...mesh.geometry.index.array], saved[i].index);
}
surface.dispose();
console.log(JSON.stringify({ status: 'passed', continuousBoundarySamples: 8193, fractionalSamples: fractional,
  distinctFractionalSamples: distinct.size, maximumCoverageStep: maximumStep, unionPanels: [...unionWinners],
  interiorChecks, interiorPanels: checkedPanels.size, skinAndSideGuards: true,
  sharedFragmentField: true, originalMaterialsAndGeometryPreserved: true }, null, 2));
