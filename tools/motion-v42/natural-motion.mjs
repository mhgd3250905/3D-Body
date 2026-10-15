import * as THREE from 'three';
import { createCoachMotion } from '../../src/coach-motion.js';
import { createCoachMotion as createV41Motion } from '../../app/scene/source/v41-runtime/src/coach-motion.js';
import { OFFICIAL_FLARE_SEQUENCE } from '../../app/scene/source/v41-runtime/src/official-poses.js';
import { createTransitionEdits, transitionOptions } from '../../app/scene/source/v41-runtime/src/transition-edits.js';
import clockData from '../../app/scene/src/v41-clock.json' with { type: 'json' };

const TAU = 2 * Math.PI;
const SIDES = ['left', 'right'];
const V = value => new THREE.Vector3().fromArray(value);
const Q = value => new THREE.Quaternion().fromArray(value);
const wrap = value => ((value % 1) + 1) % 1;
const smooth = value => { const x = THREE.MathUtils.clamp(value, 0, 1); return x * x * x * (10 + x * (-15 + 6 * x)); };
const radians = THREE.MathUtils.degToRad;

export const NATURAL_FLARE_DEFAULTS = Object.freeze({
  revision: 'v42-candidate-3-elbow-only',
  cycleSeconds: 1.35,
  sampleCount: 540,
  torsoTwistDegrees: 9,
  torsoFlexDegrees: 4,
  torsoSideDegrees: 2.5,
  headYawDegrees: 7,
  headPitchDegrees: 4,
  headCounterRollDegrees: 5,
  armRecovery: 0.21,
  armPoleBlend: 0.72,
  elbowLoweringDegrees: 8,
  elbowLoweringMaxMm: 15,
  releaseHeight: 0.035,
  fullRecoveryHeight: 0.20,
  rhythmAmount: 0.012,
});

function clockAtPhase(phase) {
  const index = wrap(phase) * (clockData.sequenceTime.length - 1);
  const lo = Math.floor(index), fraction = index - lo;
  return THREE.MathUtils.lerp(clockData.sequenceTime[lo], clockData.sequenceTime[lo + 1], fraction);
}

// Periodic cubic interpolation supplies one shared derivative at every knot,
// including the loop boundary. Quaternion signs are aligned before interpolation.
function cubic(values, fraction, quaternion = false) {
  const [a, b, c, d] = values.map(value => [...value]);
  if (quaternion) for (const value of [a, c, d]) {
    if (value.reduce((sum, component, i) => sum + component * b[i], 0) < 0) for (let i = 0; i < value.length; i++) value[i] *= -1;
  }
  const t = fraction, t2 = t * t, t3 = t2 * t;
  const value = b.map((component, i) => 0.5 * ((2 * component) + (-a[i] + c[i]) * t
    + (2 * a[i] - 5 * component + 4 * c[i] - d[i]) * t2 + (-a[i] + 3 * component - 3 * c[i] + d[i]) * t3));
  return quaternion ? Q(value).normalize().toArray() : value;
}

/**
 * Hand-authored v42 research candidate, not motion capture or a dynamics solver.
 * Both input scenes must be separate, unposed 20-bone Snow models. This module
 * installs each runtime once, preserving the frozen v41 source and all defaults.
 * updatePhase accepts cyclic normalized phase; cycleSeconds only labels playback.
 */
export function createNaturalFlareMotion({ model, baselineModel, rigData, parameters = {} }) {
  if (model === baselineModel) throw new Error('v42 requires two independent model instances.');
  for (const scene of [model, baselineModel]) {
    if (!scene?.isObject3D) throw new Error('v42 requires loaded model and baselineModel scenes.');
    if (scene.getObjectByName('spineLower') || scene.getObjectByName('spineUpper')) throw new Error('v42 requires an untouched 20-bone model; helpers are installed exactly once.');
  }
  const settings = { ...NATURAL_FLARE_DEFAULTS, ...parameters };
  for (const key of Object.keys(NATURAL_FLARE_DEFAULTS).filter(key => key !== 'revision')) {
    if (!Number.isFinite(settings[key])) throw new Error(`Invalid v42 parameter: ${key}`);
  }
  if (settings.sampleCount < 64 || settings.sampleCount > 2400 || !Number.isInteger(settings.sampleCount)) throw new Error('v42 sampleCount must be an integer from 64 to 2400.');
  if (settings.rhythmAmount < 0 || settings.rhythmAmount >= 1 / (4 * Math.PI)) throw new Error('v42 rhythmAmount must keep phase strictly increasing.');
  if (settings.armRecovery < 0 || settings.armRecovery > 0.35) throw new Error('v42 armRecovery must be between 0 and 0.35.');
  if (settings.elbowLoweringDegrees < 0 || settings.elbowLoweringDegrees > 15) throw new Error('Elbow-only lowering must stay between 0 and 15 degrees.');
  if (settings.elbowLoweringMaxMm < 0 || settings.elbowLoweringMaxMm > 20) throw new Error('Elbow-only movement must stay between 0 and 20 mm.');
  if (settings.fullRecoveryHeight <= settings.releaseHeight) throw new Error('v42 fullRecoveryHeight must exceed releaseHeight.');

  model.updateMatrixWorld(true);
  const restMatrices = new Map(), bones = new Map(), skeletons = new Set();
  model.traverse(object => { if (object.isBone) { bones.set(object.name, object); restMatrices.set(object.name, object.matrixWorld.clone().invert()); } });
  const landmarks = Object.fromEntries(Object.entries(rigData.landmarks).map(([name, value]) => [name, V(value)]));
  const waistRest = landmarks.pelvis.clone().lerp(landmarks.torso, 0.30);
  const base = createV41Motion({ model: baselineModel, rigData });
  const sequence = structuredClone(OFFICIAL_FLARE_SEQUENCE);
  base.setSequence(sequence.steps, { period: sequence.period, ...transitionOptions(createTransitionEdits(sequence)) });
  const target = createCoachMotion({ model, rigData });
  model.traverse(object => { if (object.isSkinnedMesh) skeletons.add(object.skeleton); });
  const samples = [];
  for (let i = 0; i < settings.sampleCount; i++) {
    base.update(clockAtPhase(i / settings.sampleCount));
    const metrics = base.getMetrics();
    samples.push({ pose: base.capturePose(), joints: metrics.joints });
  }

  function sample(phase) {
    const x = wrap(phase) * settings.sampleCount, i = Math.floor(x), t = x - i;
    const nodes = [-1, 0, 1, 2].map(offset => samples[(i + offset + settings.sampleCount) % settings.sampleCount]);
    const interpolate = (get, quaternion = false) => cubic(nodes.map(get), t, quaternion);
    // Retain the accepted actual ankle route. The manual editor's conservative
    // foot influence box can raise a safe shoe by centimetres; shoe clearance
    // must be checked from skinned vertices by the delivery verifier instead.
    const pose = { version: 1, groundLock: false, pelvis: interpolate(n => n.pose.pelvis),
      bodyQuaternion: interpolate(n => n.pose.bodyQuaternion, true),
      pelvisQuaternion: interpolate(n => n.pose.pelvisQuaternion ?? n.pose.bodyQuaternion, true),
      torsoQuaternion: interpolate(n => n.pose.torsoQuaternion ?? [0, 0, 0, 1], true), limbs: {} };
    const joints = {};
    for (const side of SIDES) {
      const limb = { handLocked: false };
      for (const key of ['wrist', 'elbowPole', 'ankle', 'kneePole']) limb[key] = interpolate(n => n.pose.limbs[side][key]);
      for (const key of ['handQuaternion', 'footQuaternion']) limb[key] = interpolate(n => n.pose.limbs[side][key], true);
      pose.limbs[side] = limb;
      for (const part of ['Shoulder', 'Elbow', 'Wrist', 'Palm']) joints[side + part] = interpolate(n => n.joints[side + part]);
    }
    return { pose, joints };
  }

  const upperOffset = (landmark, body, torso) => waistRest.clone().sub(landmarks.pelvis).applyQuaternion(body)
    .add(landmark.clone().sub(waistRest).applyQuaternion(body.clone().multiply(torso)));
  let currentPhase = 0, sourcePhase = 0, last = null;

  function addHeadFollow(upper, theta) {
    const headLocal = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      radians(settings.headPitchDegrees) * Math.sin(theta * 2 - 0.2),
      radians(settings.headYawDegrees) * Math.sin(theta - 0.35),
      -radians(settings.headCounterRollDegrees) * Math.sin(theta), 'YXZ'));
    const neckLocal = new THREE.Quaternion().slerp(headLocal, 0.42);
    const worldUpper = model.getWorldQuaternion(new THREE.Quaternion()).multiply(upper);
    const deltaNeck = worldUpper.clone().multiply(neckLocal).multiply(worldUpper.clone().invert());
    const deltaHead = worldUpper.clone().multiply(headLocal).multiply(worldUpper.clone().invert());
    const neck = bones.get('neck'), head = bones.get('head');
    const pivot = neck.getWorldPosition(new THREE.Vector3());
    for (const [bone, delta, rotatePosition] of [[neck, deltaNeck, false], [head, deltaHead, true]]) {
      const position = bone.getWorldPosition(new THREE.Vector3());
      if (rotatePosition) position.sub(pivot).applyQuaternion(deltaNeck).add(pivot);
      const quaternion = delta.clone().multiply(bone.getWorldQuaternion(new THREE.Quaternion()));
      bone.position.copy(position.applyMatrix4(bone.parent.matrixWorld.clone().invert()));
      bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(quaternion));
      bone.updateMatrix();
    }
    model.updateMatrixWorld(true);
    for (const skeleton of skeletons) skeleton.update();
  }

  function updatePhase(value = 0) {
    if (!Number.isFinite(value)) throw new Error('v42 phase must be finite.');
    currentPhase = wrap(value);
    // Small asymmetric acceleration through the front/back passes; no change
    // to the order of the inherited foot path or support hand transitions.
    sourcePhase = wrap(currentPhase - settings.rhythmAmount * Math.sin(2 * TAU * currentPhase));
    const source = sample(sourcePhase), pose = source.pose;
    const pelvis = V(pose.pelvis), body = Q(pose.bodyQuaternion), previousTorso = Q(pose.torsoQuaternion);
    const theta = TAU * sourcePhase;
    const torsoDelta = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      radians(settings.torsoFlexDegrees) * Math.sin(theta * 2),
      radians(settings.torsoTwistDegrees) * Math.sin(theta),
      radians(settings.torsoSideDegrees) * Math.sin(theta), 'YXZ'));
    const torso = previousTorso.clone().multiply(torsoDelta);
    pose.torsoQuaternion = torso.toArray();
    const upper = body.clone().multiply(torso), previousUpper = body.clone().multiply(previousTorso);
    const rotationDelta = upper.clone().multiply(previousUpper.clone().invert());
    const shoulderOffsets = {}, recovery = {}, flight = {}, requestedAnchors = {}, elbowAdjustment = {};
    for (const side of SIDES) {
      const sign = side === 'left' ? 1 : -1, limb = pose.limbs[side];
      const oldShoulder = V(source.joints[side + 'Shoulder']);
      const oldPalm = V(source.joints[side + 'Palm']);
      const free = smooth((oldPalm.y - settings.releaseHeight) / (settings.fullRecoveryHeight - settings.releaseHeight));
      flight[side] = free;
      // Recovery is an arc, not a held elbow angle: draw in during the side
      // pass, then extend progressively toward the next support. The height
      // envelope still ensures exactly zero edit around palm contact.
      const recoveryAmount = free * (0.4 + 0.6 * Math.sin(theta) ** 2);
      recovery[side] = recoveryAmount;
      const originalUpper = upperOffset(landmarks[side + 'Shoulder'], body, previousTorso).add(pelvis);
      const newUpper = upperOffset(landmarks[side + 'Shoulder'], body, torso).add(pelvis);
      // Preserve the already accepted support shoulder depression and its
      // original reach. Only the airborne shoulder follows the chest change.
      const shoulder = oldShoulder.clone().lerp(newUpper.clone().add(oldShoulder.clone().sub(originalUpper)), free);
      const oldWrist = V(limb.wrist), armRay = oldWrist.clone().sub(oldShoulder);
      const freeRotation = new THREE.Quaternion().slerp(rotationDelta, free);
      const wrist = shoulder.clone().add(armRay.applyQuaternion(freeRotation).multiplyScalar(1 - settings.armRecovery * recoveryAmount));
      // The editing solver reserves 10 micrometres of reach for locked hands,
      // whereas the frozen playback solver can sit closer to full extension.
      // A continuous 0.05 mm shoulder give avoids contact-flag-dependent body
      // projection while leaving the inherited wrist and leg path unchanged.
      const reach = shoulder.distanceTo(wrist);
      if (reach > 1e-8) shoulder.lerp(wrist, 0.00005 * (1 - free) / reach);
      shoulderOffsets[side] = shoulder.clone().sub(newUpper).toArray();
      // At and near floor contact, these are exactly the original wrist and
      // hand orientation; no authored boolean can classify an airborne hand.
      limb.wrist = wrist.toArray();
      limb.handLocked = oldPalm.y < 0.008 && free === 0;
      requestedAnchors[side] = oldPalm.toArray();
      const outward = new THREE.Vector3(sign, -0.25, -0.65).normalize().applyQuaternion(upper);
      const naturalPole = shoulder.clone().addScaledVector(outward, 0.55);
      const oldPole = V(limb.elbowPole).add(shoulder.clone().sub(oldShoulder));
      limb.elbowPole = oldPole.lerp(naturalPole, free * settings.armPoleBlend).toArray();
      // Keep the accepted R1 shoulder, wrist, elbow angle and recovery timing.
      // Move only its bend direction a little toward world down around the
      // shoulder-wrist axis. A tangent step stays in the original hemisphere
      // (dot > 0), avoids atan2 branch changes, and vanishes near contact.
      const axis = wrist.clone().sub(shoulder).normalize();
      const pole = V(limb.elbowPole).sub(shoulder);
      const along = pole.dot(axis), bend = pole.clone().addScaledVector(axis, -along);
      const radius = bend.length();
      if (radius > 1e-8 && free > 0) {
        const direction = bend.clone().divideScalar(radius);
        const down = new THREE.Vector3(0, -1, 0);
        down.addScaledVector(axis, -down.dot(axis));
        const tangent = down.clone().addScaledVector(direction, -down.dot(direction));
        const upperLength = landmarks[side + 'Shoulder'].distanceTo(landmarks[side + 'Elbow']);
        const lowerLength = landmarks[side + 'Elbow'].distanceTo(landmarks[side + 'Wrist']);
        const distance = shoulder.distanceTo(wrist);
        const center = (upperLength ** 2 - lowerLength ** 2 + distance ** 2) / (2 * distance);
        const elbowRadius = Math.sqrt(Math.max(0, upperLength ** 2 - center ** 2));
        const requestedAngle = radians(settings.elbowLoweringDegrees);
        const chordAngle = 2 * Math.asin(Math.min(1, settings.elbowLoweringMaxMm / 1000 / Math.max(2 * elbowRadius, 1e-8)));
        // Smoothly stay below both the angular and displacement limits.
        const limit = requestedAngle * chordAngle / Math.max(Math.hypot(requestedAngle, chordAngle), 1e-8);
        const adjusted = direction.clone().addScaledVector(tangent, Math.tan(limit) * free).normalize();
        if (adjusted.y < direction.y) {
          limb.elbowPole = shoulder.clone().addScaledVector(axis, along).addScaledVector(adjusted, radius).toArray();
          elbowAdjustment[side] = THREE.MathUtils.radToDeg(direction.angleTo(adjusted));
        }
      }
      const handDelta = new THREE.Quaternion().slerp(rotationDelta, free * 0.65);
      limb.handQuaternion = handDelta.multiply(Q(limb.handQuaternion)).normalize().toArray();
    }
    target.applyPose(pose, { playback: false, alignClavicles: false, shoulderOffsets });
    addHeadFollow(upper, theta);
    // Keep the separate old actor on the matching pose for phase comparisons.
    base.update(clockAtPhase(sourcePhase));
    last = { recovery, flight, requestedAnchors, requestedPose: pose, elbowAdjustment };
    return model;
  }

  function getMetrics() {
    const metrics = target.getMetrics();
    const matrices = new Map([...bones].map(([name, bone]) => [name, bone.matrixWorld.clone().multiply(restMatrices.get(name))]));
    // Sample actual transforms, including post-solve head/neck adjustments.
    for (const [name, landmark] of Object.entries(landmarks)) {
      const bone = name === 'torso' ? 'torso' : ['pelvis', 'head', 'neck'].includes(name) ? name
        : name.replace(/Shoulder$/, 'UpperArm').replace(/Elbow$/, 'Forearm').replace(/Wrist$/, 'Hand')
          .replace(/Hip$/, 'Thigh').replace(/Knee$/, 'Shin').replace(/Ankle$/, 'Foot');
      if (matrices.has(bone)) metrics.joints[name] = landmark.clone().applyMatrix4(matrices.get(bone)).toArray();
    }
    metrics.joints.shoulderCenter = [...metrics.joints.torso];
    const deltaQuaternion = name => new THREE.Quaternion().setFromRotationMatrix(matrices.get(name)).normalize();
    const chest = deltaQuaternion('torso'), hip = deltaQuaternion('pelvis'), head = deltaQuaternion('head');
    return { ...metrics, version: settings.revision, phase: currentPhase, sourcePhase,
      time: currentPhase * settings.cycleSeconds, period: settings.cycleSeconds,
      demonstration: { ...metrics.demonstration, source: 'v41 path with authored v42 recovery and torso/head motion' },
      design: { ...last, chestPelvisDegrees: THREE.MathUtils.radToDeg(chest.angleTo(hip)),
        headChestDegrees: THREE.MathUtils.radToDeg(head.angleTo(chest)),
        notMotionCapture: true, notDynamicsValidated: true },
    };
  }

  updatePhase(0);
  return { group: model, baseline: base, updatePhase, getMetrics, capturePose: target.capturePose,
    parameters: Object.freeze({ ...settings }), sourceSequenceTime: () => clockAtPhase(sourcePhase) };
}
