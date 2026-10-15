import * as THREE from 'three';

const SIDES = ['left', 'right'];
const V = a => new THREE.Vector3().fromArray(a);
const Q = a => new THREE.Quaternion().fromArray(a);
const wrap = p => ((p % 1) + 1) % 1;
const smooth = value => { const x = THREE.MathUtils.clamp(value, 0, 1); return x * x * x * (10 + x * (-15 + 6 * x)); };
const DEFAULTS = Object.freeze({
  contactHeight: 0.011,
  sideOffset: 0.14,
  downOffset: 0.22,
  frontOffset: 0.14,
  enterUntil: 0.22,
  leaveFrom: 0.95,
  sweepFrom: 0.08,
  sweepUntil: 0.56,
  prepareFrom: 0.48,
  prepareUntil: 0.76,
  landingHover: 0.085,
  hoverDownFrom: 0.68,
  trunkRadiusX: 0.33,
  trunkRadiusZ: 0.27,
  approachReachRatio: 0.96,
  poleTuckDegrees: 20,
});

/** A stateless, body-side hand transfer authored over the retained R1 motion.
 * It edits only wrist, pole and hand orientation, never shoulders or support.
 * baselineSamples must be uniform cyclic { pose, joints } v41 samples.
 */
export function createCompactRecovery({ rigData, baselineSamples, parameters = {} }) {
  if (!rigData?.landmarks || !Array.isArray(baselineSamples) || baselineSamples.length < 32) throw new Error('Compact recovery requires rig landmarks and uniform baseline samples.');
  const settings = { ...DEFAULTS, ...parameters };
  for (const [key, value] of Object.entries(settings)) if (!Number.isFinite(value)) throw new Error(`Invalid compact recovery parameter: ${key}`);
  if (!(settings.enterUntil > 0 && settings.enterUntil < settings.leaveFrom && settings.leaveFrom < 1
    && settings.sweepFrom < settings.sweepUntil && settings.prepareFrom < settings.prepareUntil
    && settings.prepareUntil <= settings.leaveFrom && settings.approachReachRatio > 0.5 && settings.approachReachRatio < 1
    && settings.poleTuckDegrees >= 0 && settings.poleTuckDegrees <= 35)) throw new Error('Invalid compact recovery timing or reach bounds.');
  const rest = Object.fromEntries(Object.entries(rigData.landmarks).map(([name, value]) => [name, V(value)]));
  const waist = rest.pelvis.clone().lerp(rest.torso, 0.30);
  const lengths = Object.fromEntries(SIDES.map(side => [side, {
    upper: rest[side + 'Shoulder'].distanceTo(rest[side + 'Elbow']),
    lower: rest[side + 'Elbow'].distanceTo(rest[side + 'Wrist']),
  }]));
  const shoulderAt = (side, pose, upper, offset = [0, 0, 0]) => waist.clone().sub(rest.pelvis).applyQuaternion(Q(pose.bodyQuaternion))
    .add(rest[side + 'Shoulder'].clone().sub(waist).applyQuaternion(upper)).add(V(pose.pelvis)).add(V(offset));
  const n = baselineSamples.length;
  const boundary = (index, fraction, side) => {
    const a = baselineSamples[index % n].pose, b = baselineSamples[(index + 1) % n].pose;
    const wrist = V(a.limbs[side].wrist).lerp(V(b.limbs[side].wrist), fraction);
    const hand = Q(a.limbs[side].handQuaternion).slerp(Q(b.limbs[side].handQuaternion), fraction);
    const upper = Q(a.bodyQuaternion).multiply(Q(a.torsoQuaternion ?? [0, 0, 0, 1]));
    const relative = wrist.clone().sub(shoulderAt(side, a, upper)).applyQuaternion(upper.clone().invert());
    return { wrist: wrist.toArray(), handQuaternion: hand.toArray(), relative: relative.toArray() };
  };
  const windows = Object.fromEntries(SIDES.map(side => {
    const heights = baselineSamples.map(s => s.joints[side + 'Palm'][1]), result = [];
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      if (heights[i] > settings.contactHeight || heights[next] <= settings.contactHeight) continue;
      const f = (settings.contactHeight - heights[i]) / (heights[next] - heights[i]);
      const start = (i + f) / n;
      let j = i + 1;
      while (j < i + n && heights[(j + 1) % n] > settings.contactHeight) j++;
      const endFraction = (settings.contactHeight - heights[j % n]) / (heights[(j + 1) % n] - heights[j % n]);
      const end = (j + endFraction) / n;
      const release = boundary(i, f, side), landing = boundary(j, endFraction, side);
      result.push({ start: wrap(start), span: end - start, release, landing,
        frontSign: Math.sign(release.relative[2]) || (side === 'left' ? 1 : -1) });
    }
    if (!result.length) throw new Error(`No cyclic release window found for ${side}.`);
    return [side, result];
  }));
  let latest = {};

  // Smooth min supplies a C1 reach cap without a hard clamp at sphere entry.
  function reachableTarget(shoulder, target, maximum) {
    const ray = target.clone().sub(shoulder), distance = ray.length(), width = 0.02;
    if (distance < 1e-9) return target.clone();
    const h = Math.max(width - Math.abs(distance - maximum), 0) / width;
    const radius = Math.min(distance, maximum) - h * h * width * 0.25;
    return shoulder.clone().addScaledVector(ray, radius / distance);
  }

  function shellRadius(radius, y) {
    const vertical = smooth((y + 0.55) / 0.12) * (1 - smooth((y - 0.02) / 0.12));
    const width = 0.06, h = Math.max(width - Math.abs(radius - 1), 0) / width;
    const outer = Math.max(radius, 1) + h * h * width * 0.25;
    return THREE.MathUtils.lerp(radius, outer, vertical);
  }

  // Interpolate the angle around the torso, rather than pushing a chord out
  // after it crosses the center. This distributes the turn through the whole
  // preparation interval and cannot amplify a near-zero chord radius.
  function preparationArc(start, end, amount, center, upper, outgoingSign) {
    const inverse = upper.clone().invert();
    const a = start.clone().sub(center).applyQuaternion(inverse);
    const b = end.clone().sub(center).applyQuaternion(inverse);
    const angle = point => {
      let theta = Math.atan2(point.z / settings.trunkRadiusZ, point.x / settings.trunkRadiusX);
      if (outgoingSign < 0 && theta > 0) theta -= Math.PI * 2;
      if (outgoingSign > 0 && theta < 0) theta += Math.PI * 2;
      return theta;
    };
    const theta = THREE.MathUtils.lerp(angle(a), angle(b), amount);
    const ar = shellRadius(Math.hypot(a.x / settings.trunkRadiusX, a.z / settings.trunkRadiusZ), a.y);
    const br = shellRadius(Math.hypot(b.x / settings.trunkRadiusX, b.z / settings.trunkRadiusZ), b.y);
    const y = THREE.MathUtils.lerp(a.y, b.y, amount);
    const radius = shellRadius(THREE.MathUtils.lerp(ar, br, amount), y);
    return new THREE.Vector3(settings.trunkRadiusX * radius * Math.cos(theta), y,
      settings.trunkRadiusZ * radius * Math.sin(theta)).applyQuaternion(upper).add(center);
  }

  function alterPose({ pose, shoulderOffsets, sourcePhase, upper }) {
    if (!Number.isFinite(sourcePhase) || !upper?.isQuaternion) throw new Error('Compact recovery needs finite sourcePhase and upper quaternion.');
    latest = {};
    for (const side of SIDES) {
      const matching = windows[side].map(window => ({ window, u: wrap(sourcePhase - window.start) / window.span })).find(({ u }) => u < 1);
      const limb = pose.limbs[side];
      if (!matching || limb.handLocked) { latest[side] = { stage: 'support', influence: 0 }; continue; }
      const { window, u } = matching;
      const influence = smooth(u / settings.enterUntil) * (1 - smooth((u - settings.leaveFrom) / (1 - settings.leaveFrom)));
      if (influence === 0) { latest[side] = { stage: 'contact-transition', influence: 0, u }; continue; }
      const sign = side === 'left' ? 1 : -1;
      const shoulder = shoulderAt(side, pose, upper, shoulderOffsets?.[side]);
      const chestCenter = shoulderAt('left', pose, upper, shoulderOffsets?.left)
        .add(shoulderAt('right', pose, upper, shoulderOffsets?.right)).multiplyScalar(0.5);
      const oldWrist = V(limb.wrist), oldPole = V(limb.elbowPole), oldHand = Q(limb.handQuaternion);
      const sweep = smooth((u - settings.sweepFrom) / (settings.sweepUntil - settings.sweepFrom));
      const z = window.frontSign * settings.frontOffset * (1 - 2 * sweep);
      const sideRoute = new THREE.Vector3(sign * settings.sideOffset, -settings.downOffset, z).applyQuaternion(upper).add(shoulder);
      const prepare = smooth((u - settings.prepareFrom) / (settings.prepareUntil - settings.prepareFrom));
      const hover = settings.landingHover * (1 - smooth((u - settings.hoverDownFrom) / (1 - settings.hoverDownFrom)));
      const arrival = V(window.landing.wrist).add(new THREE.Vector3(0, hover, 0));
      const reach = (lengths[side].upper + lengths[side].lower) * settings.approachReachRatio;
      const prepareRoute = reachableTarget(shoulder, arrival, reach);
      const route = reachableTarget(shoulder, preparationArc(sideRoute, prepareRoute, prepare, chestCenter, upper, -window.frontSign), reach);
      const wrist = oldWrist.clone().lerp(route, influence);
      const oldAxis = oldWrist.clone().sub(shoulder).normalize(), nextAxis = wrist.clone().sub(shoulder).normalize();
      const transport = new THREE.Quaternion().setFromUnitVectors(oldAxis, nextAxis);
      const oldBend = oldPole.clone().sub(shoulder).addScaledVector(oldAxis, -oldPole.clone().sub(shoulder).dot(oldAxis));
      if (oldBend.lengthSq() < 1e-10 || oldAxis.dot(nextAxis) < -0.95) {
        // Keep the accepted pose rather than inventing an unstable bend plane.
        latest[side] = { stage: 'unchanged-degenerate-reference', u, influence: 0 }; continue;
      }
      const referenceBend = oldBend.clone().normalize().applyQuaternion(transport).normalize();
      const bend = referenceBend.clone();
      // A small steering within R1's transported half-space brings the elbow
      // toward the rib-side lane without recreating R2's reversed bend branch.
      const preferred = new THREE.Vector3(sign * 0.035, -0.20, z * 0.25).applyQuaternion(upper);
      preferred.addScaledVector(nextAxis, -preferred.dot(nextAxis));
      let tuckAngle = 0;
      if (preferred.lengthSq() > 1e-10) {
        preferred.normalize();
        const cross = new THREE.Vector3().crossVectors(bend, preferred), angle = bend.angleTo(preferred);
        if (cross.lengthSq() > 1e-8 && angle < Math.PI - 0.03) {
          tuckAngle = THREE.MathUtils.degToRad(settings.poleTuckDegrees) * influence * Math.sin(angle);
          bend.applyAxisAngle(cross.normalize(), tuckAngle).normalize();
        }
      }
      const hand = oldHand.clone().slerp(transport.clone().multiply(oldHand), influence);
      hand.slerp(Q(window.landing.handQuaternion), influence * prepare);
      limb.wrist = wrist.toArray();
      limb.elbowPole = shoulder.clone().addScaledVector(bend, 0.5).toArray();
      limb.handQuaternion = hand.normalize().toArray();
      latest[side] = { u, stage: prepare > 0.99 ? 'ready-to-land' : prepare > 0 ? 'reach-landing' : sweep > 0.99 ? 'beside-body' : 'side-transfer',
        influence, sweep, prepare, tuckDegrees: THREE.MathUtils.radToDeg(tuckAngle),
        wristDisplacement: wrist.distanceTo(oldWrist), sourceWrist: oldWrist.toArray(), routeWrist: wrist.toArray(),
        localWristFromShoulder: wrist.clone().sub(shoulder).applyQuaternion(upper.clone().invert()).toArray(),
        transportedBendDot: bend.dot(referenceBend) };
    }
    return structuredClone(latest);
  }

  return { alterPose, describe: () => ({ parameters: { ...settings }, windows: structuredClone(windows), latest: structuredClone(latest),
    scope: 'Authored side transfer and early landing preparation; no body/leg/support edits and no motion-capture claim.' }) };
}
