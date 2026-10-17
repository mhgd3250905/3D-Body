import * as THREE from 'three';

// Restrained motion decoration for the playing Flare: two thin iridescent
// ribbons trace the toes' orbit, and each hand plant leaves a soft ring on the
// floor. Everything is precomputed from the baked clip, so trails are exact at
// any speed, after a seek and inside a segment loop, and nothing touches the
// athlete, its materials or the animation. Paused, selected and detail views
// fade the decoration out so the teaching layer stays clean.

const SAMPLES = 720;          // per loop, uniform in wall time
const TRAIL_SECONDS = 0.95;   // clip wall time covered by a ribbon
const SEGMENTS = 56;
const RIPPLE_SECONDS = 0.9;

const ribbonVertex = /* glsl */`
  attribute float aAge; attribute float aSide; attribute float aSpeed;
  varying float vAge; varying float vSide; varying float vSpeed;
  void main() { vAge = aAge; vSide = aSide; vSpeed = aSpeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const ribbonFragment = /* glsl */`
  uniform float uOpacity; uniform vec3 uHead; uniform vec3 uMid; uniform vec3 uTail;
  varying float vAge; varying float vSide; varying float vSpeed;
  void main() {
    // Colour drifts head -> mid -> tail along the ribbon (ember, rose, cyan by default).
    vec3 c = vAge < 0.5 ? mix(uHead, uMid, vAge * 2.0) : mix(uMid, uTail, vAge * 2.0 - 1.0);
    float edge = 1.0 - smoothstep(0.35, 1.0, abs(vSide));     // soft edges across the width
    float fade = pow(1.0 - vAge, 1.15) * smoothstep(0.0, 0.04, vAge + 0.02);
    float core = smoothstep(0.55, 0.0, abs(vSide)) * (0.9 - 0.6 * vAge);
    float a = uOpacity * fade * edge * clamp(vSpeed, 0.0, 1.0);
    gl_FragColor = vec4(c * 1.25 + vec3(core * 0.55), a);
    #include <colorspace_fragment>
  }`;
const rippleFragment = /* glsl */`
  uniform float uOpacity; uniform float uProgress; uniform vec3 uColor; varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;                 // 0 centre .. 1 edge of the quad
    float ring = uProgress * 0.92 + 0.06;
    float w = 0.05 + 0.05 * uProgress;
    float band = exp(-pow((r - ring) / w, 2.0));
    float glow = exp(-pow(r / max(ring, 0.05), 2.0) * 3.0) * 0.18 * (1.0 - uProgress);
    float a = uOpacity * (band * 0.85 + glow) * pow(1.0 - uProgress, 1.4);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }`;

export const FX_PALETTES = {
  ember: { head: 0xff7a3d, mid: 0xff4f8b, tail: 0x45d6ff, ripple: 0xff8a52 },
  cyan: { head: 0x5ff2ff, mid: 0x7b8cff, tail: 0xc86bff, ripple: 0x6ff0ff },
  silver: { head: 0xffffff, mid: 0xa9c8ff, tail: 0xffb38a, ripple: 0xdfe8ff },
  neon: { head: 0xff2bd6, mid: 0x7a5cff, tail: 0x22f0ff, ripple: 0xff4fe0 },
  street: { head: 0xffd23f, mid: 0xff5a5f, tail: 0x9b6bff, ripple: 0xffd86b },
};

export function createFlareFx(player, { palette = 'ember', enabled = true } = {}) {
  const motion = player.motion, coach = player.coach, clock = motion.clock;
  // Keep the accepted short trail (roughly one tenth of a turn) when the
  // R16 clip completes a turn in 1.35s instead of v41's roughly nine seconds.
  const windowScale = motion.getMetrics().motionRevision === 'v42' ? clock.duration / 8.991662288 : 1;
  const trailSeconds = TRAIL_SECONDS * windowScale, rippleSeconds = RIPPLE_SECONDS * windowScale;
  const root = new THREE.Group(); root.name = 'FlareFx'; root.renderOrder = 2;
  player.scene.add(root);

  // ---- precompute toe and palm paths over one loop -------------------------
  const toeIndex = side => {
    const mesh = findMesh(coach, /Sneakers/) ?? findMesh(coach, /Soles/);
    if (!mesh) return null;
    const bone = coach.getObjectByName(side + 'Foot'), origin = bone.getWorldPosition(new THREE.Vector3());
    const { skinIndex, skinWeight } = mesh.geometry.attributes, p = new THREE.Vector3();
    let best = -1, far = -1;
    for (let i = 0; i < skinIndex.count; i++) {
      let w = 0; for (let k = 0; k < 4; k++) if (mesh.skeleton.bones[skinIndex.getComponent(i, k)] === bone) w += skinWeight.getComponent(i, k);
      if (w < 0.95) continue;
      mesh.getVertexPosition(i, p).applyMatrix4(mesh.matrixWorld);
      const d = p.distanceTo(origin); if (d > far) { far = d; best = i; }
    }
    return { mesh, index: best };
  };
  const saved = player.time;
  motion.update(0); coach.updateMatrixWorld(true);
  const toes = { left: toeIndex('left'), right: toeIndex('right') };
  const hands = { left: coach.getObjectByName('leftHand'), right: coach.getObjectByName('rightHand') };
  const paths = { left: new Float32Array(SAMPLES * 3), right: new Float32Array(SAMPLES * 3) };
  const palm = { left: new Float32Array(SAMPLES * 3), right: new Float32Array(SAMPLES * 3) };
  const p = new THREE.Vector3();
  for (let s = 0; s < SAMPLES; s++) {
    motion.update(clock.toSequence(s / SAMPLES * clock.duration)); coach.updateMatrixWorld(true);
    for (const side of ['left', 'right']) {
      const toe = toes[side];
      if (toe && toe.index >= 0) toe.mesh.getVertexPosition(toe.index, p).applyMatrix4(toe.mesh.matrixWorld);
      else coach.getObjectByName(side + 'Foot').getWorldPosition(p);
      p.toArray(paths[side], s * 3);
      hands[side].getWorldPosition(p).toArray(palm[side], s * 3);
    }
  }
  player.setTime(saved);

  // Speed (m/s of clip wall time), normalised, so near-still moments do not draw.
  const speed = {};
  for (const side of ['left', 'right']) {
    const v = new Float32Array(SAMPLES), a = paths[side], dt = clock.duration / SAMPLES;
    for (let s = 0; s < SAMPLES; s++) {
      const n = (s + 1) % SAMPLES;
      v[s] = Math.hypot(a[n * 3] - a[s * 3], a[n * 3 + 1] - a[s * 3 + 1], a[n * 3 + 2] - a[s * 3 + 2]) / dt;
    }
    const sorted = [...v].sort((x, y) => x - y), ref = sorted[Math.floor(SAMPLES * 0.8)] || 1;
    speed[side] = v.map(x => Math.min(1, x / ref));
  }

  // Hand plants: the palm drops within 2.5 cm of its lowest height.
  const plants = [];
  for (const side of ['left', 'right']) {
    const y = s => palm[side][s * 3 + 1];
    let low = Infinity; for (let s = 0; s < SAMPLES; s++) low = Math.min(low, y(s));
    const down = s => y(s) < low + 0.025;
    for (let s = 0; s < SAMPLES; s++) if (down(s) && !down((s - 1 + SAMPLES) % SAMPLES)) {
      // ring at where the hand settles a little after first contact
      const k = (s + 6) % SAMPLES;
      plants.push({ side, wall: s / SAMPLES * clock.duration, x: palm[side][k * 3], z: palm[side][k * 3 + 2] });
    }
  }

  // ---- ribbons --------------------------------------------------------------
  const colors = FX_PALETTES[palette] ?? FX_PALETTES.ember;
  const ribbonMaterial = new THREE.ShaderMaterial({
    vertexShader: ribbonVertex, fragmentShader: ribbonFragment, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uOpacity: { value: 0 }, uHead: { value: new THREE.Color(colors.head) },
      uMid: { value: new THREE.Color(colors.mid) }, uTail: { value: new THREE.Color(colors.tail) } },
  });
  const ribbons = ['left', 'right'].map(side => {
    const count = (SEGMENTS + 1) * 2, geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3).setUsage(THREE.DynamicDrawUsage));
    const age = new Float32Array(count), across = new Float32Array(count);
    for (let i = 0; i <= SEGMENTS; i++) { age[i * 2] = age[i * 2 + 1] = i / SEGMENTS; across[i * 2] = -1; across[i * 2 + 1] = 1; }
    geometry.setAttribute('aAge', new THREE.BufferAttribute(age, 1));
    geometry.setAttribute('aSide', new THREE.BufferAttribute(across, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(new Float32Array(count), 1).setUsage(THREE.DynamicDrawUsage));
    const index = [];
    for (let i = 0; i < SEGMENTS; i++) { const a = i * 2; index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    geometry.setIndex(index);
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.6, 0), 3);
    const mesh = new THREE.Mesh(geometry, ribbonMaterial); mesh.frustumCulled = false; mesh.renderOrder = 3;
    root.add(mesh); return { side, mesh, geometry };
  });

  // ---- sparkles: a few motes shed from each toe, drifting out and fading ----
  const MOTES = 18;
  const moteMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uOpacity: { value: 0 }, uScale: { value: 400 }, uHead: ribbonMaterial.uniforms.uHead, uTail: ribbonMaterial.uniforms.uTail },
    vertexShader: `attribute float aAge; attribute float aSize; uniform float uScale; varying float vAge;
      void main(){ vAge = aAge; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * (1.0 - 0.6 * aAge) * uScale / max(0.1, -mv.z); }`,
    fragmentShader: `uniform float uOpacity; uniform vec3 uHead; uniform vec3 uTail; varying float vAge;
      void main(){ vec2 q = gl_PointCoord - 0.5; float d = length(q) * 2.0; if (d > 1.0) discard;
        float a = uOpacity * pow(1.0 - vAge, 2.0) * exp(-d * d * 4.0);
        gl_FragColor = vec4(mix(uHead, uTail, vAge) * 1.4 + 0.25, a);
        #include <colorspace_fragment>
      }`,
  });
  const motes = ['left', 'right'].map((side, sideIndex) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MOTES * 3), 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('aAge', new THREE.BufferAttribute(new Float32Array(MOTES), 1).setUsage(THREE.DynamicDrawUsage));
    const size = new Float32Array(MOTES), seed = [];
    for (let j = 0; j < MOTES; j++) {
      const h = fract(Math.sin((j + 1) * 12.9898 + sideIndex * 78.233) * 43758.5453);
      size[j] = 0.010 + 0.012 * h;
      seed.push(new THREE.Vector3(fract(h * 7.13) - 0.5, fract(h * 3.71) - 0.2, fract(h * 5.29) - 0.5).normalize());
    }
    geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    const mesh = new THREE.Points(geometry, moteMaterial); mesh.frustumCulled = false; mesh.renderOrder = 4;
    root.add(mesh); return { side, mesh, geometry, seed };
  });

  // ---- floor ripples ----------------------------------------------------------
  const ripples = Array.from({ length: 4 }, () => {
    const material = new THREE.ShaderMaterial({
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: rippleFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uOpacity: { value: 0 }, uProgress: { value: 0 }, uColor: { value: new THREE.Color(colors.ripple) } },
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), material);
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = -0.004; mesh.visible = false; mesh.renderOrder = 1;
    root.add(mesh); return mesh;
  });

  // ---- per-frame --------------------------------------------------------------
  let on = !!enabled, level = 0, lastNow = performance.now(), hold = false;
  const sample = (array, wall, out) => {
    const f = ((wall / clock.duration) % 1 + 1) % 1 * SAMPLES, i = Math.floor(f), j = (i + 1) % SAMPLES, t = f - i;
    return out.set(array[i * 3] + (array[j * 3] - array[i * 3]) * t, array[i * 3 + 1] + (array[j * 3 + 1] - array[i * 3 + 1]) * t,
      array[i * 3 + 2] + (array[j * 3 + 2] - array[i * 3 + 2]) * t);
  };
  const sampleScalar = (array, wall) => {
    const f = ((wall / clock.duration) % 1 + 1) % 1 * SAMPLES, i = Math.floor(f), j = (i + 1) % SAMPLES, t = f - i;
    return array[i] + (array[j] - array[i]) * t;
  };
  const points = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  const tangent = new THREE.Vector3(), view = new THREE.Vector3(), across = new THREE.Vector3();

  function update(now = performance.now(), allowed = true) {
    const dt = Math.min(0.1, Math.max(0, (now - lastNow) / 1000)); lastNow = now;
    const want = on && (hold || (allowed && player.playing)) ? 1 : 0;
    if (hold && on) level = 1;
    const prev = level;
    level += (want - level) * Math.min(1, dt * (want ? 5 : 7));
    if (Math.abs(want - level) < 0.004) level = want;
    if (level !== prev && level !== want) player.dirty = true;     // keep drawing while fading
    root.visible = level > 0.001;
    if (!root.visible) return;

    const wall = clock.toWall(player.time);
    const loopStart = player.loopRange ? clock.toWall(player.loopRange[0]) : -Infinity;
    const span = Math.min(trailSeconds, Math.max(0, wall - loopStart));
    ribbonMaterial.uniforms.uOpacity.value = 1.0 * level;
    const camera = player.camera;
    for (const ribbon of ribbons) {
      const position = ribbon.geometry.attributes.position, speedAttr = ribbon.geometry.attributes.aSpeed;
      for (let i = 0; i <= SEGMENTS; i++) sample(paths[ribbon.side], wall - span * i / SEGMENTS, points[i]);
      for (let i = 0; i <= SEGMENTS; i++) {
        const a = points[Math.max(0, i - 1)], b = points[Math.min(SEGMENTS, i + 1)];
        tangent.subVectors(a, b); if (tangent.lengthSq() < 1e-10) tangent.set(1, 0, 0);
        view.subVectors(camera.position, points[i]);
        across.crossVectors(tangent, view).normalize();
        const age = i / SEGMENTS, width = 0.024 * (1 - age * 0.75);
        position.setXYZ(i * 2, points[i].x - across.x * width, points[i].y - across.y * width, points[i].z - across.z * width);
        position.setXYZ(i * 2 + 1, points[i].x + across.x * width, points[i].y + across.y * width, points[i].z + across.z * width);
        const v = sampleScalar(speed[ribbon.side], wall - span * age);
        speedAttr.setX(i * 2, v); speedAttr.setX(i * 2 + 1, v);
      }
      position.needsUpdate = true; speedAttr.needsUpdate = true;
    }

    // Motes ride the toe path with staggered ages, drifting outward as they age.
    moteMaterial.uniforms.uOpacity.value = 0.9 * level;
    moteMaterial.uniforms.uScale.value = player.renderer.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    const MOTE_LIFE = 0.8, moteSpan = Math.min(MOTE_LIFE, Math.max(0, wall - loopStart));
    for (const m of motes) {
      const position = m.geometry.attributes.position, ageAttr = m.geometry.attributes.aAge;
      for (let j = 0; j < MOTES; j++) {
        // Each mote is born at a fixed phase of a repeating cycle, so a frame is reproducible.
        const age = fract(wall / MOTE_LIFE + j / MOTES), born = wall - age * MOTE_LIFE;
        const visible = age * MOTE_LIFE <= moteSpan;
        sample(paths[m.side], born, p);
        const drift = 0.05 * age + 0.02 * age * age, k = sampleScalar(speed[m.side], born);
        position.setXYZ(j, p.x + m.seed[j].x * drift, p.y + m.seed[j].y * drift + 0.015 * age, p.z + m.seed[j].z * drift);
        ageAttr.setX(j, visible && k > 0.35 ? age : 1);
      }
      position.needsUpdate = true; ageAttr.needsUpdate = true;
    }

    // Ripples: recent hand plants inside the motion's clip-time window.
    let used = 0;
    for (const plant of plants) {
      let age = wall - plant.wall; if (age < 0) age += clock.duration;
      if (age > rippleSeconds || (player.loopRange && wall - age < loopStart) || used >= ripples.length) continue;
      const mesh = ripples[used++]; mesh.visible = true; mesh.position.x = plant.x; mesh.position.z = plant.z;
      mesh.material.uniforms.uProgress.value = age / rippleSeconds; mesh.material.uniforms.uOpacity.value = 0.75 * level;
    }
    for (let i = used; i < ripples.length; i++) ripples[i].visible = false;
  }

  function setEnabled(value) { on = !!value; player.dirty = true; player.start(); }
  function setPalette(name) {
    const c = FX_PALETTES[name]; if (!c) return;
    ribbonMaterial.uniforms.uHead.value.set(c.head); ribbonMaterial.uniforms.uMid.value.set(c.mid); ribbonMaterial.uniforms.uTail.value.set(c.tail);
    for (const r of ripples) r.material.uniforms.uColor.value.set(c.ripple);
    player.dirty = true;
  }
  function dispose() {
    root.removeFromParent();
    for (const r of ribbons) r.geometry.dispose(); ribbonMaterial.dispose();
    for (const m of motes) m.geometry.dispose(); moteMaterial.dispose();
    for (const r of ripples) { r.geometry.dispose(); r.material.dispose(); }
  }
  // Diagnostics/capture only: draw the decoration for a paused frame.
  function setHold(value) { hold = !!value; player.dirty = true; }
  return { update, setEnabled, setHold, setPalette, dispose, root, get enabled() { return on; }, get level() { return level; },
    getState: () => ({ enabled: on, level, plants: plants.length, toeVertex: { left: toes.left?.index ?? -1, right: toes.right?.index ?? -1 } }) };
}

function fract(x) { return x - Math.floor(x); }

function findMesh(root, pattern) {
  let found = null;
  root.traverse(object => { if (!found && object.isSkinnedMesh && pattern.test(object.name)) found = object; });
  return found;
}
