import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';

const root = new URL('../', import.meta.url), output = new URL('../output/periodic-analysis/', import.meta.url);
const sourceUrl = new URL('public/coach/flare-sequence.json', root);
const sourceBytes = await fs.readFile(sourceUrl, 'utf8'), source = JSON.parse(sourceBytes), original = structuredClone(source);
const glbBytes = await fs.readFile(new URL('public/coach/flare-coach.glb', root));
const rigBytes = await fs.readFile(new URL('public/coach/coach-rig.json', root), 'utf8'), rigData = JSON.parse(rigBytes);
const period = 9, intervals = 720, frameInterval = period / intervals;
const epsilons = [1e-3, 1e-4, 1e-5];
const tolerances = {
  lengthMetres: 1e-6, shoeFloorMetres: .006 - 1e-6, supportPositionMetres: 1e-6,
  supportRotationRadians: 1e-5, deterministicPose: 1e-8, closurePositionMetres: 1e-8,
  closureRotationRadians: 1e-7, seamVelocityMetresPerSecond: .001,
  seamAngularVelocityRadiansPerSecond: .01, frameRotationDegrees: 15,
};
const sides = ['left', 'right'], checks = [], failures = [], samples = [];
const summary = {
  maximumLengthError: 0, minimumShoeHeight: Infinity, maximumSupportWristDrift: 0,
  maximumSupportPalmDrift: 0, maximumSupportHandRotation: 0,
  maximumFramePositionStep: 0, maximumFrameRotationDegrees: 0, peakRotation: null,
  supportCounts: {}, stanceWindows: [], warnings: [], deterministicQueries: [], seamProbes: [],
};
const check = (name, action) => {
  try { action();checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false });failures.push({ name, message: error.message, stack: error.stack }); }
};
const sha256 = value => createHash('sha256').update(value).digest('hex');
const vector = array => new THREE.Vector3().fromArray(array);
const quaternion = array => new THREE.Quaternion().fromArray(array).normalize();
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
const { scene: model } = await new GLTFLoader().parseAsync(glbBytes.buffer.slice(glbBytes.byteOffset, glbBytes.byteOffset + glbBytes.byteLength), '');
const motion = createCoachMotion({ model, rigData });
const bones = [];
model.traverse(object => { if (object.isBone) bones.push(object); });

function difference(a, b) {
  if (typeof a === 'number' || typeof b === 'number') return typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) : Infinity;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Object.keys(a).length !== Object.keys(b).length) return Infinity;
    return Math.max(0, ...Object.keys(a).map(key => difference(a[key], b[key])));
  }
  return a === b ? 0 : Infinity;
}
function rotationLog(from, to) {
  // Spatial SO(3) increment. Equivalent quaternion signs cannot make a seam.
  const delta = quaternion(to).multiply(quaternion(from).invert()).normalize();
  if (delta.w < 0) delta.set(-delta.x, -delta.y, -delta.z, -delta.w);
  const sine = Math.hypot(delta.x, delta.y, delta.z);
  const scale = sine < 1e-15 ? 2 : 2 * Math.atan2(sine, delta.w) / sine;
  return new THREE.Vector3(delta.x, delta.y, delta.z).multiplyScalar(scale);
}
function snapshot(time) {
  motion.update(time);
  const metrics = motion.getMetrics();
  return { time, pose: motion.capturePose(), metrics,
    rotations: Object.fromEntries(bones.map(bone => [bone.name, bone.getWorldQuaternion(new THREE.Quaternion()).toArray()])),
  };
}
function changes(a, b) {
  const positions = Object.fromEntries(Object.keys(a.metrics.joints).map(name => [name, vector(a.metrics.joints[name]).distanceTo(vector(b.metrics.joints[name]))]));
  const rotations = Object.fromEntries(Object.keys(a.rotations).map(name => [name, rotationLog(a.rotations[name], b.rotations[name]).length()]));
  return { maximumPosition: Math.max(...Object.values(positions)), maximumRotation: Math.max(...Object.values(rotations)), positions, rotations };
}
function verifyFrame(sample, record = true) {
  const { metrics, time } = sample;
  assert.equal(metrics.motionModel, 'periodic', `Mathematical mode missing at ${time} s`);
  assert.ok(Number.isFinite(metrics.periodic?.phase), `Periodic phase is not finite at ${time} s`);
  assert.deepEqual([...metrics.periodic.supportHands].sort(), [...metrics.supportHands].sort(), `Support metadata differs at ${time} s`);
  for (const array of [...Object.values(metrics.joints), ...Object.values(sample.rotations)]) assert.ok(array.every(Number.isFinite), `Non-finite rig value at ${time} s`);
  for (const [name, length] of Object.entries(metrics.segmentLengths)) {
    const error = Math.abs(length - metrics.expectedLengths[name]);
    summary.maximumLengthError = Math.max(summary.maximumLengthError, error);
    assert.ok(error <= tolerances.lengthMetres, `${name} length error ${error} m at ${time} s`);
  }
  assert.ok(Number.isFinite(metrics.minFootHeight), `Shoe height is not finite at ${time} s`);
  summary.minimumShoeHeight = Math.min(summary.minimumShoeHeight, metrics.minFootHeight);
  assert.ok(metrics.minFootHeight >= tolerances.shoeFloorMetres, `Shoe floor ${metrics.minFootHeight} m at ${time} s`);
  for (const side of sides) {
    assert.equal(metrics.supports[side], sample.pose.limbs[side].handLocked);
    assert.equal(metrics.supportHands.includes(side), metrics.supports[side]);
  }
  if (record) {
    const count = metrics.supportHands.length;summary.supportCounts[count] = (summary.supportCounts[count] ?? 0) + 1;
    if (metrics.warnings.length && summary.warnings.length < 20) summary.warnings.push({ time, messages: metrics.warnings });
  }
}
function measureSeam(time, label) {
  const exact = snapshot(time);
  return { time, label, probes: epsilons.map(epsilon => {
    const left = snapshot(time - epsilon), right = snapshot(time + epsilon), leftDelta = changes(left, exact), rightDelta = changes(exact, right);
    const positionVelocities = Object.fromEntries(Object.keys(exact.metrics.joints).map(name => {
      const incoming = vector(exact.metrics.joints[name]).sub(vector(left.metrics.joints[name])).divideScalar(epsilon);
      const outgoing = vector(right.metrics.joints[name]).sub(vector(exact.metrics.joints[name])).divideScalar(epsilon);
      return [name, { incoming: incoming.toArray(), outgoing: outgoing.toArray(), difference: incoming.distanceTo(outgoing) }];
    }));
    const angularVelocities = Object.fromEntries(Object.keys(exact.rotations).map(name => {
      const incoming = rotationLog(left.rotations[name], exact.rotations[name]).divideScalar(epsilon);
      const outgoing = rotationLog(exact.rotations[name], right.rotations[name]).divideScalar(epsilon);
      return [name, { incoming: incoming.toArray(), outgoing: outgoing.toArray(), difference: incoming.distanceTo(outgoing) }];
    }));
    return { epsilon, maximumPositionGap: Math.max(leftDelta.maximumPosition, rightDelta.maximumPosition),
      maximumRotationGapRadians: Math.max(leftDelta.maximumRotation, rightDelta.maximumRotation),
      maximumVelocityDifference: Math.max(...Object.values(positionVelocities).map(value => value.difference)),
      maximumAngularVelocityDifference: Math.max(...Object.values(angularVelocities).map(value => value.difference)),
      positionVelocities, angularVelocities };
  }) };
}

check('Periodic mode exposes finite phase and consistent support metadata on the actual Snow rig', () => {
  motion.setSequence(source.steps, { period, motionModel: 'periodic' });
  const initial = snapshot(0);verifyFrame(initial, false);
  assert.equal(initial.metrics.period, period);assert.equal(bones.length, 20);
});
check('One full periodic cycle preserves fixed bone lengths and shoe clearance with finite values', () => {
  for (let index = 0; index <= intervals; index++) {
    const sample = snapshot(index * frameInterval);samples.push(sample);verifyFrame(sample);
    if (index) {
      const delta = changes(samples[index - 1], sample), degrees = delta.maximumRotation * 180 / Math.PI;
      summary.maximumFramePositionStep = Math.max(summary.maximumFramePositionStep, delta.maximumPosition);
      if (degrees > summary.maximumFrameRotationDegrees) {
        const bone = Object.keys(delta.rotations).reduce((a, b) => delta.rotations[a] > delta.rotations[b] ? a : b);
        summary.maximumFrameRotationDegrees = degrees;summary.peakRotation = { time: sample.time, bone, degrees };
      }
    }
  }
  assert.equal(samples.length, intervals + 1);
});
check('Locked wrists, palm contacts and hand orientations remain fixed throughout each stance window', () => {
  assert.equal(samples.length, intervals + 1);
  for (const side of sides) {
    let anchor = null, window;
    for (const sample of samples) {
      if (!sample.metrics.supports[side]) { anchor = null;continue; }
      if (!anchor) {
        anchor = sample;window = { side, start: sample.time, end: sample.time, maximumWristDrift: 0, maximumPalmDrift: 0, maximumHandRotation: 0 };
        summary.stanceWindows.push(window);
      }
      const wrist = vector(anchor.metrics.joints[side + 'Wrist']).distanceTo(vector(sample.metrics.joints[side + 'Wrist']));
      const palm = vector(anchor.metrics.joints[side + 'Palm']).distanceTo(vector(sample.metrics.joints[side + 'Palm']));
      const rotation = rotationLog(anchor.rotations[side + 'Hand'], sample.rotations[side + 'Hand']).length();
      window.end = sample.time;window.maximumWristDrift = Math.max(window.maximumWristDrift, wrist);
      window.maximumPalmDrift = Math.max(window.maximumPalmDrift, palm);window.maximumHandRotation = Math.max(window.maximumHandRotation, rotation);
      summary.maximumSupportWristDrift = Math.max(summary.maximumSupportWristDrift, wrist);
      summary.maximumSupportPalmDrift = Math.max(summary.maximumSupportPalmDrift, palm);
      summary.maximumSupportHandRotation = Math.max(summary.maximumSupportHandRotation, rotation);
    }
  }
  assert.ok(summary.stanceWindows.length > 0, 'No stance window was generated');
  assert.ok(summary.maximumSupportWristDrift <= tolerances.supportPositionMetres, `Locked wrist drift ${summary.maximumSupportWristDrift} m`);
  assert.ok(summary.maximumSupportPalmDrift <= tolerances.supportPositionMetres, `Locked palm drift ${summary.maximumSupportPalmDrift} m`);
  assert.ok(summary.maximumSupportHandRotation <= tolerances.supportRotationRadians, `Locked hand rotation ${summary.maximumSupportHandRotation} rad`);
});
check('The full-cycle sample has no abrupt bone orientation jump', () => {
  assert.equal(samples.length, intervals + 1);
  assert.ok(summary.maximumFrameRotationDegrees <= tolerances.frameRotationDegrees, `Bone rotation peak ${JSON.stringify(summary.peakRotation)}`);
});
check('Random seeking, reverse playback and repeated queries reproduce the same actual pose', () => {
  const times = [0, .013, period * .137, period * .25, period * .501, period * .751, period - .019];
  const reference = times.map(time => snapshot(time));
  for (const index of [6, 2, 4, 1, 5, 0, 3, 6, 5, 4, 3, 2, 1, 0]) {
    const actual = snapshot(times[index]), expected = reference[index], delta = changes(expected, actual), poseDifference = difference(expected.pose, actual.pose);
    summary.deterministicQueries.push({ time: times[index], poseDifference, maximumPosition: delta.maximumPosition, maximumRotationRadians: delta.maximumRotation });
    assert.ok(poseDifference <= tolerances.deterministicPose, `Pose changed after seeking to ${times[index]} s`);
    assert.ok(delta.maximumPosition <= tolerances.closurePositionMetres);
    assert.ok(delta.maximumRotation <= tolerances.closureRotationRadians);
    assert.equal(actual.metrics.periodic.phase, expected.metrics.periodic.phase);
    assert.deepEqual(actual.metrics.supportHands, expected.metrics.supportHands);
  }
});
check('Zero, one period, negative and repeated cycles close to the same pose and bone orientations', () => {
  const first = snapshot(0);
  for (const time of [period, -period, 2 * period]) {
    const next = snapshot(time), delta = changes(first, next);
    assert.ok(difference(first.pose, next.pose) <= tolerances.deterministicPose, `Pose did not close at ${time} s`);
    assert.ok(delta.maximumPosition <= tolerances.closurePositionMetres);
    assert.ok(delta.maximumRotation <= tolerances.closureRotationRadians);
    assert.deepEqual(next.metrics.supportHands, first.metrics.supportHands);
  }
});
check('The periodic seam joins position and SO(3) angular velocity as epsilon shrinks', () => {
  const seam = measureSeam(0, 'periodic-cycle');summary.seamProbes.push(seam);
  const coarse = seam.probes[0], fine = seam.probes.at(-1);
  assert.ok(fine.maximumVelocityDifference <= tolerances.seamVelocityMetresPerSecond, `Seam velocity mismatch ${fine.maximumVelocityDifference} m/s`);
  assert.ok(fine.maximumAngularVelocityDifference <= tolerances.seamAngularVelocityRadiansPerSecond, `Seam angular velocity mismatch ${fine.maximumAngularVelocityDifference} rad/s`);
  assert.ok(fine.maximumVelocityDifference <= coarse.maximumVelocityDifference * .2 + 1e-5, 'Seam position velocities do not converge');
  assert.ok(fine.maximumAngularVelocityDifference <= coarse.maximumAngularVelocityDifference * .2 + 1e-4, 'Seam angular velocities do not converge');
});
check('Support changes join the actual limb positions and angular velocities without a fixed snap', () => {
  assert.equal(samples.length, intervals + 1);
  const boundaries = [];
  for (const side of sides) {
    for (let index = 1; index < samples.length; index++) {
      if (samples[index - 1].metrics.supports[side] === samples[index].metrics.supports[side]) continue;
      let left = samples[index - 1].time, right = samples[index].time;
      const leftSupport = samples[index - 1].metrics.supports[side];
      for (let pass = 0; pass < 36; pass++) {
        const middle = (left + right) / 2;
        if (snapshot(middle).metrics.supports[side] === leftSupport) left = middle;else right = middle;
      }
      const time = (left + right) / 2;
      if (!boundaries.some(boundary => Math.abs(boundary.time - time) < 1e-7)) boundaries.push({ time, side });
    }
  }
  const seams = boundaries.map(boundary => measureSeam(boundary.time, 'support-' + boundary.side));
  summary.seamProbes.push(...seams);
  for (const seam of seams) {
    const fine = seam.probes.at(-1);
    assert.ok(fine.maximumPositionGap < 1e-4, `Support position snap near ${seam.time} s: ${fine.maximumPositionGap} m`);
    assert.ok(fine.maximumRotationGapRadians < 1e-3, `Support rotation snap near ${seam.time} s: ${fine.maximumRotationGapRadians} rad`);
    assert.ok(fine.maximumVelocityDifference <= tolerances.seamVelocityMetresPerSecond, `Support velocity mismatch near ${seam.time} s: ${fine.maximumVelocityDifference} m/s`);
    assert.ok(fine.maximumAngularVelocityDifference <= tolerances.seamAngularVelocityRadiansPerSecond, `Support angular velocity mismatch near ${seam.time} s: ${fine.maximumAngularVelocityDifference} rad/s`);
  }
});
check('The existing pose API and saved-frame mode still reproduce all original nine poses', () => {
  const direct = source.steps.map(step => { motion.applyPose(step.pose);return { pose: motion.capturePose(), rotations: Object.fromEntries(bones.map(bone => [bone.name, bone.getWorldQuaternion(new THREE.Quaternion()).toArray()])) }; });
  motion.setSequence(source.steps, { period: source.period });
  for (let index = 0; index < source.steps.length; index++) {
    const played = snapshot(index * source.period / source.steps.length);
    assert.ok(difference(played.pose, direct[index].pose) < 1e-8, `Saved frame ${index} changed after leaving mathematical mode`);
    for (const name of Object.keys(played.rotations)) assert.ok(rotationLog(direct[index].rotations[name], played.rotations[name]).length() < 1e-7);
  }
});
check('Original formal poses and their input objects remain untouched', () => { assert.deepEqual(source, original); });
assert.equal(await fs.readFile(sourceUrl, 'utf8'), sourceBytes);
const engineHashes = {};
for (const file of ['src/coach-motion.js', 'src/periodic-flare.js']) {
  try { engineHashes[file] = sha256(await fs.readFile(new URL(file, root), 'utf8')); } catch { engineHashes[file] = null; }
}
const report = {
  pass: failures.length === 0, checks, failures, period, intervals, samples: samples.length, frameInterval, tolerances,
  sourceSha256: sha256(sourceBytes), glbSha256: sha256(glbBytes), rigSha256: sha256(rigBytes), engineHashes, ...summary,
  scope: 'Actual Snow GLB, 20 deform bones and 720 periodic intervals; fixed lengths, shoe floor, temporally fixed support wrists/palms, deterministic seeking, periodic and support-switch C1 probes, and original saved-pose compatibility. Numerical probes do not establish physical balance or absence of body intersections.',
};
await fs.mkdir(output, { recursive: true });
const reportUrl = new URL('periodic-motion-verification.json', output);
await fs.writeFile(reportUrl, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, passed: checks.filter(item => item.pass).length, checks: checks.length, failures,
  samples: samples.length, period, maximumLengthError: summary.maximumLengthError, minimumShoeHeight: summary.minimumShoeHeight,
  maximumSupportWristDrift: summary.maximumSupportWristDrift, maximumSupportPalmDrift: summary.maximumSupportPalmDrift,
  maximumFrameRotationDegrees: summary.maximumFrameRotationDegrees, peakRotation: summary.peakRotation,
  seamProbes: summary.seamProbes.map(seam => ({ time: seam.time, label: seam.label, probes: seam.probes.map(probe => ({ epsilon: probe.epsilon, maximumPositionGap: probe.maximumPositionGap,
    maximumRotationGapRadians: probe.maximumRotationGapRadians, maximumVelocityDifference: probe.maximumVelocityDifference, maximumAngularVelocityDifference: probe.maximumAngularVelocityDifference })) })),
  report: reportUrl.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
