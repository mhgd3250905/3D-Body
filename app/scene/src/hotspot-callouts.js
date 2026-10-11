import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { computeHotspots } from './hotspots.js';
import { createBillboardClearance } from './billboard-clearance.js';
import { sceneFont } from './localization.js';

// Cards live outside the muscle surface and remain camera-facing. Dots and
// their fine guides remain visible through the actor; cards keep natural depth.
export function createHotspotCallouts(player, layer, onSelect, { hosted = false, depthSampler = null } = {}) {
  const records = new Map(), raycaster = new THREE.Raycaster();
  const root = new THREE.Group(); root.name = 'MuscleBillboards'; player.scene.add(root);
  let anchors = [], moveFrame = null;
  function texture(name, colour, dot = false) {
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    const ratio = 4, height = dot ? 24 : 30;
    ctx.font = `600 13px ${sceneFont}`;
    // Use the curated short name intact. Scale only as a fallback for font
    // metrics that differ on a device; never truncate the muscle identity.
    const measured = ctx.measureText(name).width;
    const fontSize = Math.min(13, 13 * 150 / Math.max(150, measured));
    ctx.font = `600 ${fontSize}px ${sceneFont}`;
    const width = dot ? 24 : Math.ceil(ctx.measureText(name).width + 20);
    canvas.width = width * ratio; canvas.height = height * ratio; ctx.scale(ratio, ratio);
    ctx.fillStyle = colour;
    if (dot) {
      ctx.beginPath(); ctx.arc(12, 12, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
    } else {
      ctx.beginPath(); ctx.roundRect(0, 0, width, height, 8); ctx.fill();
      const rgb = colour.slice(1).match(/../g).map(v => parseInt(v, 16) / 255);
      const linear = rgb.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
      const l = linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
      ctx.fillStyle = 1.05 / (l + .05) >= (l + .05) / .06 ? '#ffffff' : '#17191f';
      ctx.font = `600 ${fontSize}px ${sceneFont}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(name, width / 2, height / 2 + .5);
    }
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
    // The 4x text canvas already carries smooth glyph edges. Avoid a second
    // mipmap blur when a small billboard is sampled near phone pixel density.
    map.generateMipmaps = false; map.minFilter = THREE.LinearFilter;
    map.anisotropy = Math.min(4, player.renderer.capabilities.getMaxAnisotropy());
    const material = new THREE.SpriteMaterial({ map, transparent: true, depthTest: true, depthWrite: false, alphaTest: .02, toneMapped: false });
    const sprite = new THREE.Sprite(material), worldHeight = dot ? .07 : .15;
    if (dot) { material.depthTest = false; sprite.renderOrder = 20; }
    else sprite.renderOrder = 10;
    sprite.scale.set(worldHeight * width / height, worldHeight, 1);
    sprite.userData.dot = dot; sprite.userData.label = name; sprite.userData.fontSize = fontSize; root.add(sprite);
    return sprite;
  }
  function guide(colour) {
    const geometry = new LineGeometry(); geometry.setPositions([0, 0, 0, 0, 0, 0]);
    const halo = new Line2(geometry, new LineMaterial({ color: '#ffffff', linewidth: 3, transparent: true,
      opacity: .48, depthTest: false, depthWrite: false, toneMapped: false }));
    const stroke = new Line2(geometry, new LineMaterial({ color: colour, linewidth: 1.25, transparent: true,
      opacity: .85, depthTest: false, depthWrite: false, toneMapped: false }));
    halo.renderOrder = 4; stroke.renderOrder = 5;
    halo.frustumCulled = stroke.frustumCulled = false; root.add(halo, stroke);
    return { geometry, halo, stroke };
  }
  function remove(record) {
    for (const sprite of [record.card, record.dot]) {
      root.remove(sprite); sprite.material.map.dispose(); sprite.material.dispose();
    }
    root.remove(record.guide.halo, record.guide.stroke); record.guide.geometry.dispose();
    record.guide.halo.material.dispose(); record.guide.stroke.material.dispose();
  }
  function clear() {
    if (moveFrame != null) cancelAnimationFrame(moveFrame); moveFrame = null;
    for (const record of records.values()) remove(record); records.clear(); anchors = [];
  }
  function update(items) {
    anchors = computeHotspots(player, items, anchors, depthSampler);
    const active = new Set(anchors.map(p => p.groupId));
    for (const [id, record] of records) if (!active.has(id)) { remove(record); records.delete(id); }
    const joints = player.getMetrics().joints;
    const cameraRight = new THREE.Vector3().setFromMatrixColumn(player.camera.matrixWorld, 0);
    const cameraUp = new THREE.Vector3().setFromMatrixColumn(player.camera.matrixWorld, 1);
    const centreX = player.project(new THREE.Vector3().fromArray(joints.pelvis)).x;
    const viewWidth = player.container.clientWidth;
    const canvasHeight = player.container.clientHeight;
    const viewHeight = player.visibleHeight(Math.max(player.viewInset, player.viewInsetTarget));
    let clearance;
    const placed = [];
    function cardRect(position, scale) {
      const corners = [-1, 1].flatMap(x => [-1, 1].map(y => player.project(position.clone()
        .addScaledVector(cameraRight, x * scale.x / 2).addScaledVector(cameraUp, y * scale.y / 2))));
      const left = Math.min(...corners.map(p => p.x)), top = Math.min(...corners.map(p => p.y));
      return { left, top, width: Math.max(...corners.map(p => p.x)) - left, height: Math.max(...corners.map(p => p.y)) - top };
    }
    function floorHeight(scale) {
      return .03 + Math.abs(cameraRight.y) * scale.x / 2 + Math.abs(cameraUp.y) * scale.y / 2;
    }
    function keepVisible(position, scale) {
      for (let pass = 0; pass < 2; pass++) {
        position.y = Math.max(position.y, floorHeight(scale));
        const rect = cardRect(position, scale);
        const dx = rect.left < 8 ? 8 - rect.left : rect.left + rect.width > viewWidth - 8 ? viewWidth - 8 - rect.left - rect.width : 0;
        const dy = rect.top < 8 ? 8 - rect.top : rect.top + rect.height > viewHeight - 8 ? viewHeight - 8 - rect.top - rect.height : 0;
        if (dx || dy) {
          const ndc = position.clone().project(player.camera);
          ndc.x += 2 * dx / viewWidth; ndc.y -= 2 * dy / canvasHeight;
          position.copy(ndc.unproject(player.camera));
        }
      }
    }
    function getClearance() {
      if (clearance) return clearance;
      const rect = player.container.getBoundingClientRect(), obstacles = [];
      const map = player.container.querySelector('.phase-map:not([hidden])')?.getBoundingClientRect();
      if (map) obstacles.push({ left: map.left - rect.left, top: map.top - rect.top, width: map.width, height: map.height });
      const height = player.visibleHeight(Math.max(player.viewInset, player.viewInsetTarget));
      if (hosted) obstacles.push({ left: Math.max(0, rect.width - 208), top: height - (rect.width < 380 ? 288 : 78), width: 208, height: 78 });
      clearance = createBillboardClearance(player.motion.getBodyHulls().map(hull => hull.map(p => player.project(p))),
        { width: rect.width, height, obstacles, gap: 8 });
      return clearance;
    }
    for (const [index, point] of anchors.entries()) {
      let record = records.get(point.groupId);
      if (!record) {
        record = { card: texture(point.name, point.colour), dot: texture('', point.colour, true), guide: guide(point.colour) };
        record.card.userData.groupId = record.dot.userData.groupId = point.groupId;
        records.set(point.groupId, record);
      }
      const surface = new THREE.Vector3().fromArray(point.world), normal = new THREE.Vector3().fromArray(point.normal);
      record.dot.position.copy(surface).addScaledVector(normal, .014);
      // Follow the currently visible body side. The small dead band prevents
      // a central muscle from repeatedly swapping labels across the athlete.
      const dx = point.x - centreX;
      const screenSide = dx < -12 ? -1 : dx > 12 ? 1 : record.screenSide ?? (index === 0 ? -1 : 1);
      const changedSide = record.screenSide != null && (record.screenSide !== screenSide || record.bodySide !== point.side);
      record.screenSide = screenSide; record.bodySide = point.side;
      const evaluate = getClearance(), baseLift = index === 0 ? .02 : index === 1 ? .16 : .20;
      const positionAt = slot => {
        const position = surface.clone().addScaledVector(normal, .08)
          .addScaledVector(cameraRight, screenSide * slot.reach).addScaledVector(cameraUp, slot.lift);
        position.y = Math.max(position.y, floorHeight(record.card.scale));
        return position;
      };
      let slot = record.slot, position = slot && positionAt(slot), score = position && evaluate.score(cardRect(position, record.card.scale), placed);
      if (!slot || changedSide || score !== 0) {
        let best = null;
        for (const reach of [.18, .30, .42, .54, .66, .80, .96, 1.15]) {
          for (const lift of [baseLift, baseLift + .18, baseLift - .18, baseLift + .36, baseLift - .36, baseLift + .54, baseLift - .54,
            baseLift + .72, baseLift - .72, baseLift + .90, baseLift - .90, baseLift + 1.08, baseLift - 1.08]) {
            const trial = { reach, lift }, candidate = positionAt(trial), rect = cardRect(candidate, record.card.scale);
            const cost = evaluate.score(rect, placed), distance = Math.max(.42, reach) + Math.abs(lift - baseLift) * .4;
            if (!best || cost < best.cost || (cost === best.cost && distance < best.distance)) best = { slot: trial, position: candidate, cost, distance };
          }
        }
        slot = best.slot; position = best.position; score = best.cost;
      }
      keepVisible(position, record.card.scale);
      record.slot = slot; record.clearanceScore = score;
      const now = performance.now(), dt = Math.min(.05, Math.max(0, (now - (record.lastMove ?? now)) / 1000));
      const immediate = record.poseTime !== player.time || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (immediate) record.card.position.copy(position);
      else record.card.position.lerp(position, 1 - Math.exp(-dt / .065));
      keepVisible(record.card.position, record.card.scale);
      record.lastMove = now; record.poseTime = player.time;
      const moving = record.card.position.distanceToSquared(position) > .001 ** 2;
      if (!moving) record.card.position.copy(position);
      // Continue the tail of a camera-driven movement while paused. Re-target
      // from the current position; do not restart a tween or fade its name.
      if (moving && moveFrame == null) moveFrame = requestAnimationFrame(() => { moveFrame = null; player.dirty = true; player.start(); });
      // Plan the other labels against settled slots, not this frame's moving
      // cards, to avoid a cycle of labels chasing each other's animation.
      placed.push(cardRect(position, record.card.scale));
      record.card.updateMatrixWorld(); record.dot.updateMatrixWorld();
      // Use the actual perspective direction to reach the card border, rather
      // than the closest 3D point (which can put a diagonal guide in its text).
      const projected = player.project(record.card.position);
      const dotProjected = player.project(record.dot.position);
      const rightProjected = player.project(record.card.position.clone().add(cameraRight));
      const upProjected = player.project(record.card.position.clone().add(cameraUp));
      const halfWidth = record.card.scale.x / 2, halfHeight = record.card.scale.y / 2;
      const x = (dotProjected.x - projected.x) / (rightProjected.x - projected.x);
      const y = (projected.y - dotProjected.y) / (projected.y - upProjected.y);
      const direction = cameraRight.clone().multiplyScalar(x).addScaledVector(cameraUp, y);
      const edge = Math.min(halfWidth / Math.max(Math.abs(x), 1e-8), halfHeight / Math.max(Math.abs(y), 1e-8));
      const end = record.card.position.clone().addScaledVector(direction, edge).addScaledVector(direction.clone().normalize(), .009);
      const start = record.dot.position.clone();
      const length = start.distanceTo(end);
      if (length > .03) start.lerp(end, Math.min(1, .032 / length));
      record.guide.geometry.setPositions([...start.toArray(), ...end.toArray()]);
      for (const line of [record.guide.halo, record.guide.stroke]) {
        line.visible = Math.abs(x) > halfWidth || Math.abs(y) > halfHeight;
        line.material.resolution.set(player.container.clientWidth, player.container.clientHeight);
      }
      point.callout = { ...projected, world: record.card.position.toArray(), width: record.card.scale.x, height: record.card.scale.y,
        depthTest: record.card.material.depthTest, dotDepthTest: record.dot.material.depthTest, billboard: true,
        label: record.card.userData.label, fontSize: record.card.userData.fontSize,
        textureSize: [record.card.material.map.image.width, record.card.material.map.image.height],
        mipmaps: record.card.material.map.generateMipmaps,
        clearanceScore: record.clearanceScore,
        screenSide,
        moving, targetWorld: position.toArray(), opacity: record.card.material.opacity,
        minWorldY: record.card.position.y - floorHeight(record.card.scale) + .03,
        rect: cardRect(record.card.position, record.card.scale), viewWidth, viewHeight,
        guide: { start: start.toArray(), end: end.toArray(), width: record.guide.stroke.material.linewidth,
          visible: record.guide.stroke.visible, colour: point.colour } };
    }
    return anchors.map(p => ({ ...p }));
  }
  function pick(clientX, clientY) {
    if (!records.size) return null;
    const rect = player.renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((clientX - rect.left) / rect.width * 2 - 1, 1 - (clientY - rect.top) / rect.height * 2), player.camera);
    const hits = raycaster.intersectObjects([...records.values()].flatMap(r => [r.card, r.dot]), false).filter(hit => {
      const uv = hit.uv, sprite = hit.object;
      if (!uv) return false;
      if (sprite.material.opacity < .5) return false;
      if (sprite.userData.dot) return Math.hypot(uv.x - .5, uv.y - .5) <= 10 / 24;
      const image = sprite.material.map.image, x = uv.x * image.width, y = uv.y * image.height, r = 32;
      return Math.hypot(Math.max(r - x, 0, x - (image.width - r)), Math.max(r - y, 0, y - (image.height - r))) <= r;
    });
    if (!hits.length) return null;
    // Dots draw above the actor and therefore also receive taps through it.
    const dot = hits.find(hit => hit.object.userData.dot);
    if (dot) return { groupId: dot.object.userData.groupId };
    // A hidden card must not steal a tap from the foreground arm.
    const body = raycaster.intersectObject(player.coach, true).find(value => {
      for (let node = value.object; node; node = node.parent) if (!node.visible) return false;
      return true;
    });
    const card = hits.find(hit => !body || body.distance >= hit.distance - .002);
    return card ? { groupId: card.object.userData.groupId } : null;
  }
  return { update, clear, pick, dispose() { clear(); root.removeFromParent(); depthSampler?.dispose?.(); } };
}
