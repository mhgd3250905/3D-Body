// Authoring-only camera photography of the same CC0 teaching mannequin and
// muscle panels used by the App. The production scene never loads this module.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as MM from '../src/legacy/muscle-map.js';
import { FLARE_GROUPS } from '../src/legacy/flare-muscle-groups.js';
import { applyFunctionalSurface, setFunctionalFocus } from '../src/muscle-material.js';

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

window.musclePhotography = (async () => {
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
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    for (const material of [].concat(mesh.material)) material.dispose();
    const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .28, metalness: .88, clearcoat: .12, clearcoatRoughness: .24 });
    applyFunctionalSurface(material, uniforms, { density: strokeDensity });
    const functionalCompile = material.onBeforeCompile;
    material.onBeforeCompile = (shader, renderer) => {
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
    material.customProgramCacheKey = () => functionalKey() + '-photography-titanium-v3';
    mesh.material = material; mesh.frustumCulled = false; meshes.push(mesh); materials.add(material);
  });
  model.updateMatrixWorld(true);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .02, 20);
  const captures = [];
  const output = document.createElement('canvas'); output.width = output.height = 512;
  const outputContext = output.getContext('2d'); outputContext.imageSmoothingQuality = 'high';
  const toBase64 = dataUrl => dataUrl.slice(dataUrl.indexOf(',') + 1);
  function capture(groupId) {
    const group = FLARE_GROUPS.find(group => group.groupId === groupId), selection = MM.resolveGroup(groupId), settings = VIEWS[groupId];
    if (!group || !selection || !settings) throw new Error('Unknown muscle photography group: ' + groupId);
    MM.setMuscleSelection(uniforms, selection.muscles.map(muscle => ({ muscle, side: 'both', colour: group.colour, level: selection.deep ? 'deep' : 'primary', dim: 0 })));
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
    renderer.render(scene, camera);
    outputContext.clearRect(0, 0, 512, 512); outputContext.drawImage(renderer.domElement, 0, 0, 512, 512);
    const webp = output.toDataURL('image/webp', .96);
    if (!webp.startsWith('data:image/webp;')) throw new Error('The capture browser has no WebP encoder.');
    captures.push({ groupId, label: group.label, colour: group.colour, webp });
    return { webp: toBase64(webp), png: toBase64(renderer.domElement.toDataURL('image/png')), camera: { ...settings, position: camera.position.toArray(), target: target.toArray(), projection: 'orthographic' }, label: group.label, colour: group.colour, panels: selection.muscles, deepRegion: !!selection.deep };
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
    groups: FLARE_GROUPS.map(group => group.groupId), capture, contactSheet,
    info: { threeRevision: THREE.REVISION, width: 512, height: 512, renderWidth: 1024, renderHeight: 1024, alpha: true, meshCount: meshes.length, vertices: meshes.reduce((sum, mesh) => sum + mesh.geometry.attributes.position.count, 0), toneMapping: 'ACESFilmic', exposure: renderer.toneMappingExposure, material: 'brushed titanium silver with original-colour enamel teaching regions', baseColour: '#b8bdc5', grooveColour: '#747c87', roughness: .28, metalness: .88, clearcoat: .12, clearcoatRoughness: .24, enamel: { metalness: .1, roughness: .44 }, brush: { roughnessAmplitude: .025, cyclesPerMetre: 2100 / (2 * Math.PI), antialias: 'fwidth footprint' }, lights: { environment: 1, hemisphere: .35, key: 1.4, fill: .45, edge: .6 }, background: 'transparent' },
    dispose() { for (const mesh of meshes) mesh.geometry.dispose(); for (const material of materials) material.dispose(); environmentMap.dispose(); environment.dispose(); pmrem.dispose(); renderer.dispose(); },
  };
})();
