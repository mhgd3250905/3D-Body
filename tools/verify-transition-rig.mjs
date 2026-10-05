import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { interpolateLegArc } from '../src/limb-arc.js';

// Decode only geometry for this focused offline comparison. Real textures and
// the user's browser storage are untouched; the browser verifies appearance.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, value) { this.type = type; Object.assign(this, value); } };
const bytes = fs.readFileSync(new URL('../public/coach/flare-coach.glb', import.meta.url));
const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const rigData = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
const data = JSON.parse(fs.readFileSync(new URL('../public/coach/flare-sequence.json', import.meta.url), 'utf8'));
const original = structuredClone(data);
const motion = createCoachMotion({ model, rigData });
const vector = values => new THREE.Vector3().fromArray(values);
const sides = ['left', 'right'];
const frameInterval = .005;
const frames = Math.round(data.period / frameInterval);
const anchors = data.steps.map(step => motion.applyPose(step.pose));

function kneeFlexion(metrics, side) {
  const hip = vector(metrics.joints[side + 'Hip']), knee = vector(metrics.joints[side + 'Knee']);
  const ankle = vector(metrics.joints[side + 'Ankle']);
  return 180 - knee.clone().sub(hip).angleTo(knee.clone().sub(ankle)) * 180 / Math.PI;
}

let maximumLengthError = 0, maximumSupportDifference = 0, maximumFreeWristDifference = 0;
function verifyPhysicalLimits(metrics) {
  for (const [name, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[name]);
    maximumLengthError = Math.max(maximumLengthError, error);
    assert.ok(error < 1e-6, `${name} length changed by ${error} m`);
  }
  for (const values of Object.values(metrics.joints)) assert.ok(values.every(Number.isFinite));
  for (const drift of Object.values(metrics.supportDrift)) if (drift !== null) assert.ok(drift < 1e-5);
  if (metrics.groundLock) assert.ok(metrics.minFootHeight >= -.000001, `Shoe crossed the floor: ${metrics.minFootHeight}`);
}

const baseline = [];
function measure(legPath) {
  motion.setSequence(data.steps, { period: data.period, legPath });
  for (let index = 0; index < data.steps.length; index++) {
    motion.update(index * data.period / data.steps.length);
    assert.deepEqual(motion.capturePose(), anchors[index], `Saved anchor ${index} changed with ${legPath}`);
  }
  let previous = null;
  const result = { maxKneeFlexionDegrees: 0, maxKneeStepMetres: 0, maxShinStepDegrees: 0, minimumShoeHeight: Infinity };
  for (let index = 0; index <= frames; index++) {
    motion.update(index * frameInterval);
    const metrics = motion.getMetrics();
    verifyPhysicalLimits(metrics);
    const current = Object.fromEntries(sides.map(side => [side, {
      knee: vector(metrics.joints[side + 'Knee']),
      shin: model.getObjectByName(side + 'Shin').quaternion.clone(),
    }]));
    result.minimumShoeHeight = Math.min(result.minimumShoeHeight, metrics.minFootHeight);
    for (const side of sides) {
      result.maxKneeFlexionDegrees = Math.max(result.maxKneeFlexionDegrees, kneeFlexion(metrics, side));
      if (previous) {
        result.maxKneeStepMetres = Math.max(result.maxKneeStepMetres, current[side].knee.distanceTo(previous[side].knee));
        result.maxShinStepDegrees = Math.max(result.maxShinStepDegrees, current[side].shin.angleTo(previous[side].shin) * 180 / Math.PI);
      }
      if (legPath === 'arc') {
        assert.equal(metrics.supports[side], baseline[index].supports[side], 'Support flags changed');
        const difference = vector(metrics.joints[side + 'Wrist']).distanceTo(vector(baseline[index].wrists[side]));
        if (metrics.supports[side]) {
          maximumSupportDifference = Math.max(maximumSupportDifference, difference);
          assert.ok(difference < 1e-6, 'Supported wrist moved relative to the original interpolation');
        } else maximumFreeWristDifference = Math.max(maximumFreeWristDifference, difference);
      }
    }
    if (legPath === 'linear') baseline.push({
      supports: structuredClone(metrics.supports),
      wrists: Object.fromEntries(sides.map(side => [side, metrics.joints[side + 'Wrist']])),
    });
    previous = current;
  }
  result.examples = [.55, 7.455].map(time => {
    motion.update(time); const metrics = motion.getMetrics();
    return { time, knees: sides.map(side => kneeFlexion(metrics, side)) };
  });
  return result;
}

const linear = measure('linear'), arc = measure('arc');
assert.ok(linear.maxKneeFlexionDegrees > 100, 'Comparison no longer exercises the reported straight-line bending');
assert.ok(arc.maxKneeFlexionDegrees < 15, 'The saved loop still folds its straight legs deeply');
assert.ok(arc.maxKneeStepMetres < linear.maxKneeStepMetres * .7, 'Knee trajectory did not become smoother');
assert.ok(arc.maxShinStepDegrees < linear.maxShinStepDegrees * .85, 'Shin rotation spike did not decrease');

// A saved correction is a true anchor too, including its intentionally bent
// knee. Sampling its exact time must bypass the leg arc mapper.
motion.setSequence(data.steps, { period: data.period, legPath: 'linear' });
motion.update(.42);
const correctionPose = motion.capturePose();
const expectedCorrection = motion.applyPose(correctionPose);
motion.setSequence(data.steps, { period: data.period, legPath: 'arc', corrections: [
  { id: 'verification-midpoint', segment: 0, at: .42, pose: correctionPose },
] });
motion.update(.42);
assert.deepEqual(motion.capturePose(), expectedCorrection, 'A user correction rendered differently from directly loading its saved pose');
for (const time of [.419, .421]) { motion.update(time); verifyPhysicalLimits(motion.getMetrics()); }

// Opposite endpoint directions need a finite, deterministic route around the
// hip; normalized linear vectors would vanish halfway between these poses.
const antipodalStart = structuredClone(data.steps[0].pose), antipodalEnd = structuredClone(antipodalStart);
for (const pose of [antipodalStart, antipodalEnd]) { pose.pelvis = [0, 1, 0]; pose.bodyQuaternion = [0, 0, 0, 1]; }
antipodalStart.limbs.left.ankle = [1, 1, 0]; antipodalStart.limbs.left.kneePole = [.5, 1, .5];
antipodalEnd.limbs.left.ankle = [-1, 1, 0]; antipodalEnd.limbs.left.kneePole = [-.5, 1, .5];
const midpoint = interpolateLegArc({ start: antipodalStart, end: antipodalEnd, current: antipodalStart, side: 'left', hipOffset: [0, 0, 0], blend: .5 });
assert.ok([...midpoint.ankle, ...midpoint.kneePole].every(Number.isFinite));
assert.ok(Math.abs(vector(midpoint.ankle).distanceTo(vector(antipodalStart.pelvis)) - 1) < 1e-8);
assert.deepEqual(data, original, 'Original saved poses changed');
console.log(JSON.stringify({ pass: true, anchorCount: anchors.length, correctionCount: 1, samplesPerPath: frames + 1, frameInterval, maximumLengthError, maximumSupportDifference, maximumFreeWristDifference, linear, arc }, null, 2));
