import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { transitionOptions, validateTransitionEdits } from '../src/transition-edits.js';
import { mirrorPose } from '../src/pose-mirror.js';

// Explicit exported animation files only. This tool never reads browser storage
// or changes the export, source model, original assets or live viewer.
const args = process.argv.slice(2), [beforePath, afterPath] = args;
if (!beforePath || !afterPath) throw new Error('Usage: node tools/verify-mirror-animation-rig.mjs BEFORE.json AFTER.json');
const includeFrame14 = args.includes('--include-frame14'), targetStart = includeFrame14 ? 4 : 5;
const outputIndex = args.indexOf('--output'), outputOverride = outputIndex < 0 ? null : args[outputIndex + 1];
if (outputIndex >= 0 && !outputOverride) throw new Error('--output requires a report path');
const beforeBytes = await fs.readFile(beforePath), afterBytes = await fs.readFile(afterPath);
const before = JSON.parse(beforeBytes), after = JSON.parse(afterBytes);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const clone = value => structuredClone(value);
const checks = [], warnings = [];
const check = (name, pass, detail) => { checks.push({ name, pass: Boolean(pass), detail });assert.ok(pass, name); };
const vector = values => new THREE.Vector3().fromArray(values);
const rotation = values => new THREE.Quaternion().fromArray(values).normalize();
const protectedIndices = [...Array.from({ length: targetStart + 1 }, (_, index) => index), 8];
let failure, metrics = {};
try {
  const beforeDocument = validateTransitionEdits(before, before.sequence), afterDocument = validateTransitionEdits(after, after.sequence);
  check('All previously completed frames and the closing 09 retain their exact saved values',
    protectedIndices.every(index => JSON.stringify(before.sequence.steps[index]) === JSON.stringify(after.sequence.steps[index])));
  const mirroredIndices = includeFrame14 ? [5, 6, 7] : [6, 7];
  check('New opposite-side poses reflect the latest user source frames, including support and rotations',
    mirroredIndices.every(index => isDeepStrictEqual(after.sequence.steps[index].pose, mirrorPose(before.sequence.steps[8 - index].pose))));
  const times = new Map(before.sequence.steps.map((step, index) => ['step:' + step.id, index]));
  for (const point of beforeDocument.points) times.set('point:' + point.id, point.segment + point.at);
  const replacedRoute = entry => {
    const start = times.get(entry.from.kind + ':' + entry.from.id), finish = times.get(entry.to.kind + ':' + entry.to.id);
    if (start === undefined || finish === undefined) return false;
    const end = finish > start ? finish : finish + before.sequence.steps.length;
    return start >= targetStart && end <= 8;
  };
  check('Every previously saved route, K and draft outside the replaced suffix is preserved',
    beforeDocument.segmentGuides.filter(guide => !replacedRoute(guide)).every(guide => afterDocument.segmentGuides.some(next => JSON.stringify(next) === JSON.stringify(guide))) &&
    JSON.stringify(beforeDocument.points.filter(point => point.segment < targetStart || point.segment > 7)) === JSON.stringify(afterDocument.points.filter(point => point.segment < targetStart || point.segment > 7)) &&
    JSON.stringify(beforeDocument.draft) === JSON.stringify(afterDocument.draft) &&
    beforeDocument.footCurves.filter(curve => !replacedRoute(curve)).every(curve => afterDocument.footCurves.some(next => JSON.stringify(next) === JSON.stringify(curve))));
  const sourceModel = await fs.readFile(new URL('../public/coach/flare-coach.glb', import.meta.url));
  globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
  globalThis.ProgressEvent ??= class { constructor(type, values) { this.type = type;Object.assign(this, values); } };
  const { scene: model } = await new GLTFLoader().parseAsync(sourceModel.buffer.slice(sourceModel.byteOffset, sourceModel.byteOffset + sourceModel.byteLength), '');
  const rigData = JSON.parse(await fs.readFile(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
  const motion = createCoachMotion({ model, rigData });
  const install = animation => motion.setSequence(animation.sequence.steps, { period: animation.sequence.period, ...transitionOptions(animation) });
  const snapshot = () => motion.sampleTrajectory({ startTime: 0, endTime: targetStart, samples: targetStart * 32 + 1, includeBoneRotations: true });
  install(before);const savedFrames = snapshot();
  install(after);const continuedFrames = snapshot();
  check('Actual Snow playback across the completed source segments is exactly unchanged', JSON.stringify(savedFrames) === JSON.stringify(continuedFrames), { samples: savedFrames.frames.length, range: [0, targetStart] });
  const savedTimes = [targetStart, 5, 6, 7, 8, ...afterDocument.points.filter(point => point.segment >= targetStart && point.segment <= 7).map(point => point.segment + point.at)];
  const actualFrames = motion.sampleTrajectory({ startTime: targetStart, endTime: 8, samples: (8 - targetStart) * 64 + 1, includeTimes: savedTimes, includeBoneRotations: true }).frames;
  let maximumBoneLengthError = 0, maximumSupportDrift = 0, minimumFootHeight = Infinity, maximumReplayError = 0, maximumFrameRotation = 0, worstRotation;
  const relativeRotations = [];
  for (const frame of actualFrames) {
    motion.update(frame.time);const current = motion.getMetrics();
    for (const [joint, expected] of Object.entries(frame.joints)) maximumReplayError = Math.max(maximumReplayError, vector(current.joints[joint]).distanceTo(vector(expected)));
    for (const [key, length] of Object.entries(current.segmentLengths)) maximumBoneLengthError = Math.max(maximumBoneLengthError, Math.abs(length - current.expectedLengths[key]));
    for (const value of Object.values(current.supportDrift)) if (value !== null) maximumSupportDrift = Math.max(maximumSupportDrift, value);
    if (current.groundLock) minimumFootHeight = Math.min(minimumFootHeight, current.minFootHeight);
    if (frame.diagnostics?.warnings?.length) warnings.push({ time: frame.time, warnings: frame.diagnostics.warnings, goalErrors: frame.diagnostics.goalErrors });
  }
  for (let index = 1; index < actualFrames.length; index++) {
    const previous = actualFrames[index - 1], current = actualFrames[index];
    for (const [bone, quaternion] of Object.entries(current.boneRotations)) {
      const angle = rotation(quaternion).angleTo(rotation(previous.boneRotations[bone]));
      if (angle > maximumFrameRotation) { maximumFrameRotation = angle;worstRotation = { bone, from: previous.time, to: current.time, degrees: THREE.MathUtils.radToDeg(angle) }; }
    }
  }
  for (const time of [...new Set(savedTimes)]) {
    const exact = motion.sampleTrajectory({ startTime: time, endTime: time, samples: 2, includeBoneRotations: true }).frames[0];
    let maximum = 0;
    for (const nearTime of [time - 1e-6, time + 1e-6]) {
      const nearby = motion.sampleTrajectory({ startTime: nearTime, endTime: nearTime, samples: 2, includeBoneRotations: true }).frames[0];
      for (const [bone, values] of Object.entries(exact.boneRotations)) maximum = Math.max(maximum, rotation(values).angleTo(rotation(nearby.boneRotations[bone])));
    }
    relativeRotations.push({ time, maximumAngleRadians: maximum });
  }
  metrics = { actualSamples: actualFrames.length, maximumBoneLengthError, maximumSupportDrift, minimumFootHeight, maximumReplayError, maximumFrameRotation, worstRotation, endpointContinuity: relativeRotations };
  check('Mirrored playback and pure trajectory sampling agree', maximumReplayError < 1e-9, maximumReplayError);
  check('Actual bone lengths, fixed hands and ground constraints remain valid', maximumBoneLengthError < 1e-9 && maximumSupportDrift < 1e-7 && minimumFootHeight >= .006 - 1e-7, metrics);
  check('Saved boundaries do not introduce abrupt rotation discontinuities', relativeRotations.every(result => result.maximumAngleRadians < .02), relativeRotations);
  check('The completed side has no half-turn jump between adjacent 1/64-second samples', maximumFrameRotation < Math.PI / 2, worstRotation);
  check('Both input exports stay byte-for-byte unchanged', Buffer.compare(beforeBytes, await fs.readFile(beforePath)) === 0 && Buffer.compare(afterBytes, await fs.readFile(afterPath)) === 0);
} catch (error) { failure = { message: error.message, stack: error.stack }; }
const output = outputOverride ? path.resolve(outputOverride) : new URL('../output/mirror-continuation/actual-rig-verification.json', import.meta.url);
const report = { pass: !failure, checkedAt: new Date().toISOString(), beforePath: path.resolve(beforePath), afterPath: path.resolve(afterPath), beforeSha256: hash(beforeBytes), afterSha256: hash(afterBytes), checks, metrics, warnings, failure,
  scope: `User-exported saved animation, actual local Snow GLB and runtime rig; preserves completed 0–${targetStart} s playback and checks remaining ${targetStart}–8 s continuity, constraints and pure playback agreement. No claim of physical perfection or universal collision-free animation.` };
await fs.mkdir(outputOverride ? path.dirname(output) : new URL('.', output), { recursive: true });await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ pass: report.pass, passed: checks.filter(item => item.pass).length, total: checks.length, metrics, warningSamples: warnings.length, failure, report: outputOverride ? output : output.pathname }, null, 2));
if (!report.pass) process.exitCode = 1;
