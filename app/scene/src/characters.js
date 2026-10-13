import * as THREE from 'three';

// Three dressed Flare characters built on the two accepted bodies. They reuse
// the body's own garments and the identical 22-bone rig and v41 clip; only the
// materials change, plus a body zone shader that dresses the bare arms and legs
// as sleeves or tights where a character wears them. No geometry, weights or
// tracks are altered, so every motion check of the base body still holds.
//
// Select with ?character=shadow | chrome | street | robot. Without it the existing
// ?body=training / original coach choice is untouched.

const BASES = {
  coach: './coach/flare-coach-v41-animated.meshopt.glb.gz',
  training: './coach/flare-coach-v41-training-human-collarfix-20261013.glb.gz',
};

// Zones: skin, arm (body surface of the arms), leg (body surface of the legs),
// tee, cuff, shorts, shoe (upper), sole, detail (shoe panels).
export const CHARACTERS = {
  shadow: {
    id: 'shadow', name: '夜影', english: 'Shadow', base: 'training', fx: 'ember',
    note: '深灰压缩长袖与紧身裤，炭黑短袖短裤，余烬橙发带和跑鞋。',
    zones: {
      skin: { color: 0x8c9098, roughness: 0.62 },
      arm: { color: 0x2a2c32, roughness: 0.42, sheen: 0.35 },
      leg: { color: 0x2a2c32, roughness: 0.42, sheen: 0.35 },
      tee: { color: 0x34373e, roughness: 0.7 },
      cuff: { color: 0x3d4048, roughness: 0.6 },
      shorts: { color: 0x1b1c20, roughness: 0.55 },
      shoe: { color: 0xff6a3d, roughness: 0.45 },
      sole: { color: 0xefece6, roughness: 0.6 },
      detail: { color: 0x1d1e22, roughness: 0.5 },
    },
    rim: 0xff8a52,
    accessories: [{ type: 'headband', color: 0xff6a3d }],
  },
  chrome: {
    id: 'chrome', name: '银翼', english: 'Chrome', base: 'training', fx: 'silver',
    note: '抛光银色人台，白色陶瓷感短袖短裤，冰蓝鞋面。',
    zones: {
      skin: { color: 0xd4d8de, roughness: 0.2, metalness: 1, env: 2.6 },
      arm: { color: 0xd4d8de, roughness: 0.2, metalness: 1, env: 2.6 },
      leg: { color: 0xd4d8de, roughness: 0.2, metalness: 1, env: 2.6 },
      tee: { color: 0xf2f3f5, roughness: 0.38, clearcoat: 0.6 },
      cuff: { color: 0xe4e7ec, roughness: 0.4 },
      shorts: { color: 0xe9ebef, roughness: 0.4, clearcoat: 0.5 },
      shoe: { color: 0xf4f6f8, roughness: 0.35 },
      sole: { color: 0x7fe3ff, roughness: 0.4 },
      detail: { color: 0x9aa3ad, roughness: 0.25, metalness: 1, env: 2 },
    },
    rim: 0xcfe2ff,
  },
  street: {
    id: 'street', name: '街头', english: 'Street', base: 'coach', fx: 'street',
    note: '原卡通教练戴黑色针织帽，芥末黄短袖、黑色长运动裤和红白球鞋。',
    zones: {
      tee: { color: 0xe7b528, roughness: 0.78 },
      cuff: { color: 0xcf9f20, roughness: 0.78 },
      shorts: { color: 0x17181c, roughness: 0.75 },
      leg: { color: 0x17181c, roughness: 0.75 },
      shoe: { color: 0xf6f3ec, roughness: 0.5 },
      sole: { color: 0xf6f3ec, roughness: 0.55 },
      detail: { color: 0xe0393e, roughness: 0.45 },
    },
    rim: 0xffd86b,
    accessories: [{ type: 'beanie', color: 0x1c1d22, cuff: 0x1c1d22, stripe: 0xe0393e }],
  },

  robot: {
    id: 'robot', name: '机甲', english: 'Robot', base: 'training', fx: 'cyan',
    note: '浅灰陶瓷装甲板、银色金属头手配枪灰金属四肢，腕口青色光环，深色面罩带一道青色扫描光，鞋底发光。',
    zones: {
      skin: { color: 0xb9bfc8, roughness: 0.26, metalness: 0.85, env: 2.2 },
      arm: { color: 0x3a3f47, roughness: 0.32, metalness: 1, env: 2.2 },
      leg: { color: 0x3a3f47, roughness: 0.32, metalness: 1, env: 2.2 },
      tee: { color: 0xe3e6ea, roughness: 0.3, clearcoat: 0.9 },
      cuff: { color: 0x2a2e35, roughness: 0.3, metalness: 1, env: 2 },
      shorts: { color: 0xdadde2, roughness: 0.3, clearcoat: 0.9 },
      shoe: { color: 0x2c3038, roughness: 0.3, metalness: 1, env: 2 },
      sole: { color: 0x1b6f80, roughness: 0.4, emissive: 0x2fd8f0, glow: 0.8 },
      detail: { color: 0xeef0f3, roughness: 0.3, clearcoat: 0.6 },
    },
    seam: { color: 0x5ff2ff, glow: 2.2 },
    rim: 0x8feaff,
    accessories: [{ type: 'visor', color: 0x0d1016, line: 0x5ff2ff }],
  },
};

const DEFAULTS = {
  coach: { id: 'coach', name: '卡通教练', base: 'coach', fx: 'ember' },
  training: { id: 'training', name: '训练人台', base: 'training', fx: 'ember' },
};

export function characterFromLocation(search = '') {
  const params = new URLSearchParams(search);
  const chosen = CHARACTERS[params.get('character')];
  if (chosen) return chosen;
  return params.get('body') === 'training' ? DEFAULTS.training : DEFAULTS.coach;
}
export const characterAsset = character => BASES[character.base] ?? BASES.coach;

function zoneOf(name) {
  if (/Sneakers/.test(name)) return 'shoe';
  if (/Soles/.test(name)) return 'sole';
  if (/Shoe_Details/.test(name)) return 'detail';
  if (/Shorts/.test(name)) return 'shorts';
  if (/Mesh005_1$/.test(name)) return 'cuff';
  if (/Mesh005$/.test(name)) return 'tee';
  if (/Coach_Body$/.test(name)) return 'body';
  return null;
}

function material(base, spec) {
  const physical = spec.clearcoat || spec.sheen;
  const m = new (physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial)({
    color: spec.color, roughness: spec.roughness ?? 0.6, metalness: spec.metalness ?? 0,
    envMapIntensity: spec.env ?? 1, side: base?.side ?? THREE.FrontSide,
  });
  if (physical) { m.clearcoat = spec.clearcoat ?? 0; m.clearcoatRoughness = 0.25; if (spec.sheen) { m.sheen = spec.sheen; m.sheenRoughness = 0.5; m.sheenColor = new THREE.Color(0xffffff); } }
  if (spec.emissive) { m.emissive = new THREE.Color(spec.emissive); m.emissiveIntensity = spec.glow ?? 1; }
  m.name = `character:${spec.color.toString(16)}`;
  return m;
}

// Body surface: classify each vertex by its dominant bone, then cut sleeves at
// the wrist with a plane distance interpolated per pixel (crisp, no stair-step).
function dressBody(mesh, zones, seam = null) {
  const { skinIndex, skinWeight, position } = mesh.geometry.attributes, bones = mesh.skeleton.bones;
  const n = position.count, zone = new Float32Array(n * 3), wrist = new Float32Array(n);
  const p = new THREE.Vector3();
  const cut = side => {
    const fore = bones.find(b => b.name === side + 'Forearm'), hand = bones.find(b => b.name === side + 'Hand');
    const h = hand.getWorldPosition(new THREE.Vector3()), f = fore.getWorldPosition(new THREE.Vector3());
    return { point: h, axis: h.clone().sub(f).normalize() };
  };
  const cuts = { left: cut('left'), right: cut('right') };
  for (let i = 0; i < n; i++) {
    let best = -1, name = '';
    for (let k = 0; k < 4; k++) { const w = skinWeight.getComponent(i, k); if (w > best) { best = w; name = bones[skinIndex.getComponent(i, k)]?.name ?? ''; } }
    mesh.getVertexPosition(i, p).applyMatrix4(mesh.matrixWorld);
    const leg = /Thigh|Shin|Foot|Patella/.test(name), arm = /UpperArm|Forearm|Hand|Scapula/.test(name);
    const head = /head|neck/.test(name) && p.y > 1.43;
    zone[i * 3] = leg ? 0 : arm ? 1 : head ? 0 : 1;   // arm/torso
    zone[i * 3 + 1] = leg ? 1 : 0;                       // leg
    zone[i * 3 + 2] = head ? 1 : 0;                      // skin
    const c = cuts[p.x >= 0 ? 'left' : 'right'];
    wrist[i] = /Hand|Forearm/.test(name) ? p.clone().sub(c.point).dot(c.axis) + 0.004 : -1;
  }
  mesh.geometry.setAttribute('characterZone', new THREE.BufferAttribute(zone, 3));
  mesh.geometry.setAttribute('characterWrist', new THREE.BufferAttribute(wrist, 1));
  const skin = zones.skin, arm = zones.arm ?? skin, leg = zones.leg ?? skin;
  const m = skin ? material(mesh.material, skin) : mesh.material.clone();
  const skinColor = m.color.clone(), skinRough = m.roughness, skinMetal = m.metalness;
  const u = {
    uZoneColor: { value: [skinColor, new THREE.Color((arm ?? {}).color ?? skinColor), new THREE.Color((leg ?? {}).color ?? skinColor)] },
    uSeam: { value: new THREE.Color(seam?.color ?? 0x000000).multiplyScalar(seam ? (seam.glow ?? 1) : 0) },
    uZoneRM: { value: [new THREE.Vector2(skinRough, skinMetal), new THREE.Vector2(arm?.roughness ?? skinRough, arm?.metalness ?? skinMetal),
      new THREE.Vector2(leg?.roughness ?? skinRough, leg?.metalness ?? skinMetal)] },
  };
  m.color.set(0xffffff); m.roughness = 1; m.metalness = 1;
  m.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = 'attribute vec3 characterZone; attribute float characterWrist; varying vec3 vCharZone; varying float vCharWrist;\n'
      + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvCharZone = characterZone; vCharWrist = characterWrist;');
    shader.fragmentShader = 'uniform vec3 uZoneColor[3]; uniform vec3 uSeam; uniform vec2 uZoneRM[3]; varying vec3 vCharZone; varying float vCharWrist;\n'
      + 'vec3 charW(){ float aa = max(fwidth(vCharWrist), 1e-5); float hand = smoothstep(-aa, aa, vCharWrist);\n'
      + '  vec3 w = clamp(vCharZone, 0.0, 1.0); float s = w.x + w.y + w.z + 1e-4; w /= s;\n'
      + '  return mix(vec3(w.z, w.x, w.y), vec3(1.0, 0.0, 0.0), hand); }\n'
      + shader.fragmentShader
        .replace('#include <map_fragment>', '#include <map_fragment>\n vec3 cw = charW(); diffuseColor.rgb *= uZoneColor[0]*cw.x + uZoneColor[1]*cw.y + uZoneColor[2]*cw.z;')
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = dot(cw, vec3(uZoneRM[0].x, uZoneRM[1].x, uZoneRM[2].x));')
        .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n metalnessFactor = dot(cw, vec3(uZoneRM[0].y, uZoneRM[1].y, uZoneRM[2].y));')
        // Optional glowing seam ring just above the wrist cut (robot).
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n if (vCharWrist > -0.5) { float d = abs(vCharWrist + 0.012); float aw = max(fwidth(vCharWrist), 1e-5); totalEmissiveRadiance += uSeam * (1.0 - smoothstep(0.003, 0.003 + aw, d)); }');
  };
  m.customProgramCacheKey = () => 'flare-character-body-v2';
  if (arm?.env || skin?.env) m.envMapIntensity = Math.max(arm?.env ?? 1, skin?.env ?? 1);
  mesh.material = m;
}

export function applyCharacter(model, character) {
  if (!character?.zones) return;
  const zones = character.zones;
  model.updateMatrixWorld(true);
  model.traverse(mesh => {
    if (!mesh.isSkinnedMesh) return;
    const name = mesh.name, zone = zoneOf(name);
    const isSkin = /Mesh001$|Head/.test(name) && !/Mesh004/.test(name);
    if (zone === 'body') { dressBody(mesh, zones, character.seam); return; }
    if (zone && zones[zone]) { mesh.material = material(mesh.material, zones[zone]); return; }
    if (isSkin && zones.skin) mesh.material = material(mesh.material, zones.skin);
  });
  for (const accessory of character.accessories ?? []) addAccessory(model, accessory);
  model.userData.character = character.id;
}

// Rigid head accessories, shrink-wrapped to the head surface in the bind pose
// and parented to the head bone, so they follow the clip exactly.
function headSamples(model) {
  const points = [], p = new THREE.Vector3();
  model.traverse(mesh => {
    if (!mesh.isSkinnedMesh || !mesh.visible || /Mesh00[45]|Teeth|Gums|Tongue|mouth|Glints|Brows|Coach_Body/i.test(mesh.name)) return;
    const { skinIndex, skinWeight, position } = mesh.geometry.attributes, bones = mesh.skeleton.bones;
    for (let i = 0; i < position.count; i++) {
      let best = -1, name = '';
      for (let k = 0; k < 4; k++) { const w = skinWeight.getComponent(i, k); if (w > best) { best = w; name = bones[skinIndex.getComponent(i, k)]?.name ?? ''; } }
      if (name !== 'head') continue;
      points.push(mesh.getVertexPosition(i, p).applyMatrix4(mesh.matrixWorld).clone());
    }
  });
  return points;
}
const BINS = 64;
// Outer radius of the head around a vertical axis, per angle, near height y.
function contour(points, cx, cz, y, dy) {
  const r = new Float32Array(BINS).fill(-1);
  for (const q of points) {
    if (Math.abs(q.y - y) > dy) continue;
    const a = Math.atan2(q.x - cx, q.z - cz), j = ((Math.round(a / (Math.PI * 2) * BINS) % BINS) + BINS) % BINS;
    r[j] = Math.max(r[j], Math.hypot(q.x - cx, q.z - cz));
  }
  // Fill gaps from neighbours, then smooth twice around the loop.
  for (let pass = 0; pass < BINS && r.some(v => v < 0); pass++)
    for (let j = 0; j < BINS; j++) if (r[j] < 0) { const a = r[(j + BINS - 1) % BINS], b = r[(j + 1) % BINS]; if (a >= 0 || b >= 0) r[j] = Math.max(a, b); }
  for (let pass = 0; pass < 2; pass++) {
    const c = r.slice(); for (let j = 0; j < BINS; j++) r[j] = Math.max(c[j], (c[(j + BINS - 1) % BINS] + 2 * c[j] + c[(j + 1) % BINS]) / 4);
  }
  return r;
}
// A wrapped surface: rows of (height, contour + margin), closed at the top
// with a pole when `pole` is given.
function wrapGeometry(rows, cx, cz, pole = null) {
  const positions = [], uvs = [], index = [];
  rows.forEach((row, k) => {
    for (let j = 0; j <= BINS; j++) {
      const a = j / BINS * Math.PI * 2, r = row.r[j % BINS] + row.margin, y = typeof row.y === 'function' ? row.y(a) : row.y;
      positions.push(cx + Math.sin(a) * r, y, cz + Math.cos(a) * r); uvs.push(j / BINS, k / Math.max(1, rows.length - 1));
    }
  });
  const stride = BINS + 1;
  for (let k = 0; k < rows.length - 1; k++) for (let j = 0; j < BINS; j++) {
    const a = k * stride + j, b = a + 1, c = a + stride, d = c + 1; index.push(a, c, b, b, c, d);
  }
  if (pole) {
    const top = positions.length / 3; positions.push(cx, pole, cz); uvs.push(0.5, 1);
    const last = (rows.length - 1) * stride; for (let j = 0; j < BINS; j++) index.push(last + j, top, last + j + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(index); g.computeVertexNormals(); return g;
}
function knit(color, ribs = 0) {
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
  if (ribs) {
    m.onBeforeCompile = shader => {
      shader.vertexShader = 'varying vec2 vKnitUv;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvKnitUv = uv;');
      shader.fragmentShader = 'varying vec2 vKnitUv;\n' + shader.fragmentShader.replace('#include <color_fragment>',
        `#include <color_fragment>\n float rib = 0.5 + 0.5 * sin(vKnitUv.x * ${ribs.toFixed(1)} * 6.2831); diffuseColor.rgb *= 0.8 + 0.2 * rib;`);
    };
    m.customProgramCacheKey = () => 'flare-knit-' + ribs;
  }
  return m;
}
function addAccessory(model, spec) {
  const head = model.getObjectByName('head'); if (!head) return;
  model.updateMatrixWorld(true);
  const points = headSamples(model); if (points.length < 50) return;
  const top = Math.max(...points.map(q => q.y));
  const near = points.filter(q => q.y > top - 0.06);
  const cx = near.reduce((v, q) => v + q.x, 0) / near.length, cz = near.reduce((v, q) => v + q.z, 0) / near.length;
  const group = new THREE.Group(); group.name = 'CharacterAccessory_' + spec.type;
  const rowsBetween = (y0, y1, n, margin, dy = 0.008) => Array.from({ length: n }, (_, k) => {
    const y = y0 + (y1 - y0) * k / (n - 1); return { y, r: contour(points, cx, cz, y, dy), margin: typeof margin === 'function' ? margin(k / (n - 1)) : margin };
  });
  if (spec.type === 'headband') {
    const y = top - (spec.drop ?? 0.07), h = spec.height ?? 0.03;
    const band = new THREE.Mesh(wrapGeometry(rowsBetween(y - h / 2, y + h / 2, 4, 0.005, 0.012), cx, cz),
      new THREE.MeshStandardMaterial({ color: spec.color, roughness: 0.6, side: THREE.DoubleSide }));
    group.add(band);
  } else if (spec.type === 'beanie') {
    const y0 = top - 0.112, back = 0.028;
    // The crown sits a little lower at the back; rows follow the head up to a soft pole.
    const lift = a => y0 - back * Math.max(0, -Math.cos(a)) ** 1.5;
    const crownRows = Array.from({ length: 14 }, (_, k) => {
      const t = k / 13, yMid = y0 + (top - y0) * (t * 0.94);
      const r = contour(points, cx, cz, yMid, 0.01);
      return { y: a => lift(a) * (1 - t) + yMid * t + (t === 0 ? 0 : 0), r, margin: 0.012 + 0.012 * t };
    });
    const crown = new THREE.Mesh(wrapGeometry(crownRows, cx, cz, top + 0.024), knit(spec.color, 44));
    const cuffRows = [0, 1, 2, 3].map(k => {
      const t = k / 3, r = contour(points, cx, cz, y0 + 0.015 * t, 0.012);
      return { y: a => lift(a) - 0.008 + 0.045 * t, r, margin: 0.02 };
    });
    const cuff = new THREE.Mesh(wrapGeometry(cuffRows, cx, cz), knit(spec.cuff ?? spec.color, 72));
    group.add(crown, cuff);
    if (spec.stripe) {
      const stripeRows = [0, 1].map(k => ({ y: a => lift(a) + 0.012 + 0.009 * k, r: contour(points, cx, cz, y0 + 0.006, 0.012), margin: 0.0205 }));
      group.add(new THREE.Mesh(wrapGeometry(stripeRows, cx, cz), new THREE.MeshStandardMaterial({ color: spec.stripe, roughness: 0.8, side: THREE.DoubleSide })));
    }
  } else if (spec.type === 'visor') {
    // A wraparound dark glass visor across the eyes (front arc only), with a thin glowing scan line.
    const y = top - (spec.drop ?? 0.105), h = spec.height ?? 0.04, span = spec.span ?? 1.35;
    const front = spec.front ?? 0; // bind pose faces +z (nose bump sits at angle 0)
    const arc = (rows, mat) => {
      const g = wrapGeometry(rows, cx, cz), pos = g.attributes.position, keep = [];
      const idx = g.index.array;
      for (let t = 0; t < idx.length; t += 3) {
        let ok = true;
        for (let k = 0; k < 3; k++) { const v = idx[t + k]; const a = Math.atan2(pos.getX(v) - cx, pos.getZ(v) - cz) - front; if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) > span) ok = false; }
        if (ok) keep.push(idx[t], idx[t + 1], idx[t + 2]);
      }
      g.setIndex(keep); return new THREE.Mesh(g, mat);
    };
    group.add(arc(rowsBetween(y - h / 2, y + h / 2, 5, t => 0.007 + 0.004 * Math.sin(t * Math.PI), 0.012),
      new THREE.MeshPhysicalMaterial({ color: spec.color, roughness: 0.08, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.DoubleSide })));
    group.add(arc(rowsBetween(y - 0.0025, y + 0.0025, 2, 0.0135, 0.012),
      new THREE.MeshStandardMaterial({ color: spec.line, emissive: spec.line, emissiveIntensity: 2.4, roughness: 0.4, side: THREE.DoubleSide })));
  }
  // Bind-pose world -> head-bone local.
  group.applyMatrix4(head.matrixWorld.clone().invert());
  group.traverse(object => { if (object.isMesh) { object.castShadow = true; object.userData.characterAccessory = true; } });
  head.add(group);
}
