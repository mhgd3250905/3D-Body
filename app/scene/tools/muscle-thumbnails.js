// Authoring-only camera photography of the same CC0 teaching mannequin and
// muscle panels used by the App. The production scene never loads this module.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as MM from '../src/legacy/muscle-map.js';
import { FLARE_GROUPS } from '../src/legacy/flare-muscle-groups.js';
import { applyFunctionalSurface, setFunctionalFocus } from '../src/muscle-material.js';
import { captureMasks, inkToon, installToonPreview, makeComparison } from './muscle-toon-preview.js';

// Each crop contains its complete selected region plus familiar adjacent
// anatomy. Frontal groups use a slight three-quarter turn; posterior groups
// face the camera from behind. Both authored sides retain the same highlight.
const VIEWS = {
  deltoids:       { azimuth: 32, elevation: 7, target: [0, 1.30, 0], span: .81, description: 'front three-quarter shoulders and upper torso' },
  'rotator-cuff': { azimuth: 165, elevation: 7, target: [0, 1.29, 0], span: .70, description: 'back three-quarter shoulder blades; deep region hatched' },
  triceps:       { azimuth: 155, elevation: 6, target: [0, 1.21, 0], span: .87, description: 'back three-quarter complete upper arms and torso' },
  forearms:      { azimuth: 20, elevation: 6, target: [0, 1.00, 0], span: 1.02, description: 'front three-quarter forearms, hands and elbow context' },
  serratus:      { azimuth: 48, elevation: 6, target: [.02, 1.17, .015], span: .73, description: 'front three-quarter ribs and shoulder girdle' },
  scapular:      { azimuth: 170, elevation: 8, target: [0, 1.29, -.02], span: .72, description: 'back shoulder blades and neck context' },
  chest:         { azimuth: 18, elevation: 7, target: [0, 1.30, .035], span: .76, description: 'front three-quarter chest and shoulders' },
  lats:          { azimuth: 155, elevation: 6, target: [0, 1.15, -.02], span: .78, description: 'back three-quarter lower shoulder blades and waist' },
  abs:           { azimuth: 16, elevation: 5, target: [0, 1.04, .035], span: .76, description: 'front abdominal wall, lower ribs and pelvis context' },
  obliques:      { azimuth: 38, elevation: 5, target: [0, 1.08, .015], span: .75, description: 'front three-quarter side waist, ribs and pelvis' },
  erectors:      { azimuth: 165, elevation: 4, target: [0, 1.04, -.025], span: .75, description: 'back lumbar spine with upper back and pelvis context' },
  'hip-flexors': { azimuth: 24, elevation: 6, target: [0, .90, .03], span: .73, description: 'front three-quarter pelvis and upper thigh; deep region hatched' },
  'glute-max':   { azimuth: 158, elevation: 7, target: [0, .89, -.03], span: .70, description: 'back three-quarter pelvis, waist and upper thighs' },
  'hip-abductors': { azimuth: 135, elevation: 6, target: [0, .94, -.01], span: .70, description: 'back three-quarter lateral hip and waist' },
  adductors:     { azimuth: 14, elevation: 4, target: [0, .67, .01], span: .76, description: 'front medial thighs with pelvis and knees' },
  quadriceps:    { azimuth: 19, elevation: 4, target: [0, .64, .025], span: .88, description: 'front complete thigh panels with pelvis and knees' },
  hamstrings:    { azimuth: 165, elevation: 5, target: [0, .64, -.025], span: .88, description: 'back complete thigh panels with hips and knees' },
};

const REVIEWS = [
  { id: '01-chest', title: '胸大肌 · 正面', groups: ['chest'], camera: VIEWS.chest, highlights: [[189, 239, 24, 10]] },
  { id: '02-glute-max', title: '臀大肌 · 背面', groups: ['glute-max'], camera: VIEWS['glute-max'], highlights: [[203, 291, 24, 10]] },
  {
    id: '03-lats-obliques', title: '背阔肌 + 腹斜肌 · 侧面', groups: ['lats', 'obliques'],
    camera: { azimuth: 107, elevation: 5, target: [0, 1.13, -.01], span: .79, description: 'side waist and lower shoulder blades' },
    highlights: [[271, 227, 10, 24], [225, 347, 7, 12]],
  },
  { id: '04-rotator-cuff', title: '肩袖 · 深层分区', groups: ['rotator-cuff'], camera: VIEWS['rotator-cuff'], highlights: [[190, 243, 15, 8]] },
];

window.musclePhotography = (async () => {
  const params = new URLSearchParams(location.search);
  const toonV1 = params.has('toon-v1');
  const reviewMode = toonV1 || params.has('toon-review');
  const maskMode = { value: false };
  const highlights = [new THREE.Vector4(), new THREE.Vector4()];
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(2); renderer.setSize(512, 512, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.06;
  document.body.append(renderer.domElement);
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('/model.glb');
  const model = gltf.scene, scene = new THREE.Scene(); scene.add(model);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const environmentMap = pmrem.fromScene(environment, .04); scene.environment = environmentMap.texture;
  scene.environmentIntensity = 1.0;
  const hemi = new THREE.HemisphereLight(0xf4f6ff, 0x484a50, .35); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfffaf3, 1.4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe7edff, .45); scene.add(fill);
  const edge = new THREE.DirectionalLight(0xfffdf6, .60); scene.add(edge);
  const uniforms = MM.createMuscleUniforms();
  uniforms.mmMulti.value = 1; uniforms.mmReveal.value = 1; uniforms.mmTime.value = .654;
  uniforms.mmBase.value.set('#b8bdc5'); uniforms.mmSkin.value.copy(uniforms.mmBase.value);
  uniforms.mmGroove.value.set('#747c87');
  uniforms.mmHomeEmphasis = { value: 1 }; uniforms.mmEffort = { value: .18 };
  const strokeDensity = { value: 2 }, materials = new Set(), meshes = [];
  const sampleMaterials = [];
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    for (const material of [].concat(mesh.material)) material.dispose();
    const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .28, metalness: .88, clearcoat: .12, clearcoatRoughness: .24 });
    applyFunctionalSurface(material, uniforms, { density: strokeDensity });
    const functionalCompile = material.onBeforeCompile;
    const titaniumCompile = (shader, renderer) => {
      functionalCompile(shader, renderer);
      // The live miniature intentionally desaturates its body for teaching.
      // Photography preserves its material swatch. Only this authoring
      // material changes; region geometry, scoring and normals stay exact.
      const grayscale = 'vec3 homeBase = vec3(dot(base, vec3(0.2126, 0.7152, 0.0722)));';
      if (!shader.fragmentShader.includes(grayscale)) throw new Error('photography_metal_shader_source_mismatch');
      shader.fragmentShader = shader.fragmentShader.replace(grayscale, 'vec3 homeBase = base;');
      // Brushing varies microsurface roughness only, leaving the supplied
      // smooth normals intact. Screen footprint suppresses unresolved grain.
      const roughnessChunk = '#include <roughnessmap_fragment>';
      const metalnessChunk = '#include <metalnessmap_fragment>';
      if (!shader.fragmentShader.includes(roughnessChunk) || !shader.fragmentShader.includes(metalnessChunk)) throw new Error('photography_physical_shader_source_mismatch');
      shader.fragmentShader = shader.fragmentShader.replace(roughnessChunk, roughnessChunk + `
        float brushPhase = vMmPos.y * 2100.0 + sin(vMmPos.x * 950.0 + vMmPos.z * 180.0) * 0.65;
        float brushFootprint = fwidth(brushPhase);
        float brushGrain = sin(brushPhase) * (1.0 - smoothstep(1.5, 4.5, brushFootprint));
        roughnessFactor = clamp(roughnessFactor + brushGrain * 0.025, 0.20, 0.38);
      `);
      // The coloured teaching region is an enamel inset. Its lower metalness
      // keeps the source hue legible under the bright metallic reflections.
      shader.fragmentShader = shader.fragmentShader.replace(metalnessChunk, metalnessChunk + `
        float enamelCoverage = clamp(abs(mmSelV), 0.0, 1.0) * mmShown * mmPanelCoverage;
        metalnessFactor = mix(metalnessFactor, 0.10, enamelCoverage);
        roughnessFactor = mix(roughnessFactor, 0.44, enamelCoverage);
      `);
    };
    const functionalKey = material.customProgramCacheKey;
    material.onBeforeCompile = titaniumCompile;
    material.customProgramCacheKey = () => functionalKey() + '-photography-titanium-v3';
    if (reviewMode) {
      material.onBeforeCompile = (shader, renderer) => {
        titaniumCompile(shader, renderer);
        installToonPreview(shader, maskMode, highlights, false);
      };
      material.customProgramCacheKey = () => functionalKey() + '-photography-titanium-audit';
      function makeToon(style) {
        const toon = material.clone();
        toon.onBeforeRender = material.onBeforeRender;
        toon.onBeforeCompile = (shader, renderer) => {
          titaniumCompile(shader, renderer);
          installToonPreview(shader, maskMode, highlights, style);
        };
        toon.customProgramCacheKey = () => functionalKey() + '-photo-' + style;
        materials.add(toon);
        return toon;
      }
      const preview = makeToon(true);
      const latest = toonV1 ? makeToon('muscle-toon-v1') : preview;
      sampleMaterials.push({ mesh, material, preview, latest });
    }
    mesh.material = material; mesh.frustumCulled = false; meshes.push(mesh); materials.add(material);
  });
  model.updateMatrixWorld(true);
  function useToon(enabled) {
    for (const { mesh, material, preview, latest } of sampleMaterials) {
      mesh.material = enabled === 'preview' ? preview : enabled ? latest : material;
    }
  }
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .02, 20);
  const captures = [];
  const output = document.createElement('canvas'); output.width = output.height = 512;
  const outputContext = output.getContext('2d'); outputContext.imageSmoothingQuality = 'high';
  const toBase64 = dataUrl => dataUrl.slice(dataUrl.indexOf(',') + 1);
  function prepare(groupIds, settings) {
    const selections = groupIds.map(groupId => {
      const group = FLARE_GROUPS.find(group => group.groupId === groupId), selection = MM.resolveGroup(groupId);
      if (!group || !selection || !settings) throw new Error('Unknown muscle photography group: ' + groupId);
      return { group, selection };
    });
    MM.setMuscleSelection(uniforms, selections.flatMap(({ group, selection }) =>
      selection.muscles.map(muscle => ({ muscle, side: 'both', colour: group.colour, level: selection.deep ? 'deep' : 'primary', dim: 0 }))));
    setFunctionalFocus(uniforms, []);
    const azimuth = THREE.MathUtils.degToRad(settings.azimuth), elevation = THREE.MathUtils.degToRad(settings.elevation);
    const direction = new THREE.Vector3(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation));
    const target = new THREE.Vector3(...settings.target), right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), direction).normalize();
    const up = new THREE.Vector3().crossVectors(direction, right).normalize();
    camera.position.copy(target).addScaledVector(direction, 4); camera.lookAt(target);
    camera.left = camera.bottom = -settings.span / 2; camera.right = camera.top = settings.span / 2;
    camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
    // A broad studio key follows the chosen photographing direction so the
    // back views receive the same polished lighting as the front views.
    key.position.copy(target).addScaledVector(direction, 3).addScaledVector(right, -2).addScaledVector(up, 3);
    fill.position.copy(target).addScaledVector(direction, 2).addScaledVector(right, 3).addScaledVector(up, .6);
    edge.position.copy(target).addScaledVector(direction, -2).addScaledVector(right, 1).addScaledVector(up, 2);
    for (const light of [key, fill, edge]) { light.target.position.copy(target); scene.add(light.target); }
    return {
      selections,
      cameraInfo: { ...settings, position: camera.position.toArray(), target: target.toArray(), projection: 'orthographic' },
    };
  }
  function capture(groupId) {
    const { selections: [{ group, selection }], cameraInfo } = prepare([groupId], VIEWS[groupId]);
    renderer.render(scene, camera);
    outputContext.clearRect(0, 0, 512, 512); outputContext.drawImage(renderer.domElement, 0, 0, 512, 512);
    const webp = output.toDataURL('image/webp', .96);
    if (!webp.startsWith('data:image/webp;')) throw new Error('The capture browser has no WebP encoder.');
    captures.push({ groupId, label: group.label, colour: group.colour, webp });
    return { webp: toBase64(webp), png: toBase64(renderer.domElement.toDataURL('image/png')), camera: cameraInfo, label: group.label, colour: group.colour, panels: selection.muscles, deepRegion: !!selection.deep };
  }
  function thumbnailBounds(canvas) {
    const alpha = canvas.getContext('2d').getImageData(0, 0, 512, 512).data;
    let left = 512, top = 512, right = 0, bottom = 0;
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        if (!alpha[(y * 512 + x) * 4 + 3]) continue;
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x + 1);
        bottom = Math.max(bottom, y + 1);
      }
    }
    return { left, top, right, bottom };
  }
  function photo512(source = renderer.domElement) {
    const result = document.createElement('canvas');
    result.width = result.height = 512;
    const context = result.getContext('2d');
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, 512, 512);
    return result;
  }
  function thumbnailCrop(entry) {
    if (entry.crop) return entry.crop;
    if (entry.width === 512 && entry.height === 512) return { x: 0, y: 0, width: 512, height: 512 };
    const { left, top } = thumbnailBounds(photo512());
    const x = Math.max(0, left - 5), y = Math.max(0, top - 5);
    if (left === 512 || x + entry.width > 512 || y + entry.height > 512) {
      throw new Error('Invalid legacy thumbnail crop for ' + entry.groupId);
    }
    return { x, y, width: entry.width, height: entry.height };
  }
  function setHighlights(rectangles) {
    for (const [index, highlight] of highlights.entries()) {
      highlight.set(...(rectangles[index] ?? [-100, -100, 1, 1]));
    }
  }
  function captureToon(entry) {
    if (!toonV1) throw new Error('Production thumbnails require toon-v1 mode');
    const { selections: [{ group, selection }], cameraInfo } = prepare([entry.groupId], entry.camera);
    useToon(false);
    renderer.render(scene, camera);
    const crop = thumbnailCrop(entry);
    const dimensions = renderer.domElement.width;
    const { mask, stats } = captureMasks(renderer, scene, camera, maskMode, useToon, dimensions);
    if (!stats.groups[entry.groupId] || !stats.selectedPixels || (selection.deep && !stats.hatchPixels)) {
      throw new Error('Missing selected region or depth hatch: ' + entry.groupId);
    }
    const sample = REVIEWS.find(({ groups, camera }) => groups.length === 1 &&
      groups[0] === entry.groupId && camera.span === entry.camera.span);
    setHighlights(sample?.highlights ?? []);
    useToon(true);
    renderer.render(scene, camera);
    const art = photo512(inkToon(renderer, mask));
    useToon(false);
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    canvas.getContext('2d').drawImage(art, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    const webp = canvas.toDataURL('image/webp', .96);
    if (!webp.startsWith('data:image/webp;')) throw new Error('The capture browser has no WebP encoder.');
    return { webp: toBase64(webp), camera: cameraInfo, crop, label: group.label, colour: group.colour,
      panels: selection.muscles, deepRegion: !!selection.deep, mask: stats };
  }
  function compare(id) {
    if (!reviewMode) throw new Error('Comparison requires toon-review mode');
    const shot = REVIEWS.find(entry => entry.id === id);
    if (!shot) throw new Error('Unknown muscle sample: ' + id);
    const { cameraInfo, selections } = prepare(shot.groups, shot.camera);
    useToon(false);
    renderer.render(scene, camera);
    const before = photo512();
    const pixels = captureMasks(renderer, scene, camera, maskMode, useToon, renderer.domElement.width);
    setHighlights(shot.highlights);
    let approved = null;
    if (toonV1) {
      useToon('preview');
      renderer.render(scene, camera);
      approved = inkToon(renderer, pixels.mask, { legacy: true });
    }
    useToon(true);
    renderer.render(scene, camera);
    const after = inkToon(renderer, pixels.mask, { legacy: !toonV1 });
    useToon(false);
    const image = makeComparison(before, after, shot.title, selections.some(({ selection }) => selection.deep), approved);
    return {
      png: toBase64(image.toDataURL('image/png')), width: image.width, height: image.height,
      camera: cameraInfo, groups: shot.groups, mask: pixels.stats,
    };
  }
  function audit(groupId) {
    if (!reviewMode) throw new Error('Mask audit requires toon-review mode');
    const { cameraInfo } = prepare([groupId], VIEWS[groupId]);
    return { groupId, camera: cameraInfo, ...captureMasks(renderer, scene, camera, maskMode, useToon, 512).stats };
  }
  async function contactSheet({ cell = 180, columns = 5 } = {}) {
    const caption = 36;
    const canvas = document.createElement('canvas'); canvas.width = cell * columns; canvas.height = (cell + caption) * Math.ceil(captures.length / columns);
    const context = canvas.getContext('2d'); context.fillStyle = '#f5f3f1'; context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < captures.length; i++) {
      const item = captures[i], x = i % columns * cell, y = Math.floor(i / columns) * (cell + caption);
      const image = new Image(); image.src = item.webp; await image.decode();
      context.drawImage(image, x + 4, y + 4, cell - 8, cell - 8);
      context.fillStyle = '#1d2024'; context.font = '12px sans-serif'; context.textAlign = 'center'; context.fillText(item.label, x + cell / 2, y + cell + 12);
      context.fillStyle = '#737680'; context.font = '10px sans-serif'; context.fillText(item.groupId, x + cell / 2, y + cell + 27);
    }
    return toBase64(canvas.toDataURL('image/png'));
  }
  return {
    groups: FLARE_GROUPS.map(group => group.groupId),
    palette: Object.fromEntries(FLARE_GROUPS.map(group => [group.groupId, group.colour])),
    reviews: REVIEWS.map(review => review.id), capture, captureToon, contactSheet, compare, audit,
    info: { threeRevision: THREE.REVISION, width: 512, height: 512, renderWidth: 1024, renderHeight: 1024, alpha: true, meshCount: meshes.length, vertices: meshes.reduce((sum, mesh) => sum + mesh.geometry.attributes.position.count, 0), toneMapping: 'ACESFilmic', exposure: renderer.toneMappingExposure, material: 'brushed titanium silver with original-colour enamel teaching regions', baseColour: '#b8bdc5', grooveColour: '#747c87', roughness: .28, metalness: .88, clearcoat: .12, clearcoatRoughness: .24, enamel: { metalness: .1, roughness: .44 }, brush: { roughnessAmplitude: .025, cyclesPerMetre: 2100 / (2 * Math.PI), antialias: 'fwidth footprint' }, lights: { environment: 1, hemisphere: .35, key: 1.4, fill: .45, edge: .6 }, background: 'transparent' },
    dispose() { for (const mesh of meshes) mesh.geometry.dispose(); for (const material of materials) material.dispose(); environmentMap.dispose(); environment.dispose(); pmrem.dispose(); renderer.dispose(); },
  };
})();
