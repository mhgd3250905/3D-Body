import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { BodyViewer } from '../src/viewer.js';
import {
  OFFICIAL_FLARE_SEQUENCE, MOTION_V41_UPGRADE_BACKUP_KEY, MOTION_V41_SELECTION_BACKUP_KEY,
  resolveOfficialSequence, previousOfficialSequence, saveV41DefaultSequence,
  updateOfficialFrame,
} from '../src/official-poses.js';
import { createTransitionEdits, loadTransitionEdits, saveTransitionEdits, transitionOptions } from '../src/transition-edits.js';

globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, value) { Object.assign(this, value); } };
globalThis.location ??= { search: '' };
const root = fileURLToPath(new URL('..', import.meta.url));
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const rigData = read('public/coach/coach-rig.json');
const oldDefault = read('public/coach/flare-sequence-before-web-v41.json');
const clone = value => structuredClone(value);
async function modelAt(file) {
  const bytes = fs.readFileSync(file);
  return (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene;
}
const model = await modelAt(path.join(root, 'public/coach/flare-coach.glb'));
const motion = createCoachMotion({ model, rigData });
motion.setSequence(OFFICIAL_FLARE_SEQUENCE.steps, { period: OFFICIAL_FLARE_SEQUENCE.period });
const maximumJointDifference = (a, b) => Math.max(...Object.keys(a).map(name =>
  new THREE.Vector3().fromArray(a[name]).distanceTo(new THREE.Vector3().fromArray(b[name]))));
const checkFinite = metrics => {
  for (const joint of Object.values(metrics.joints)) assert.ok(joint.every(Number.isFinite));
  for (const [bone, length] of Object.entries(metrics.segmentLengths)) {
    assert.ok(Math.abs(length - metrics.expectedLengths[bone]) < 1e-6, `${bone} changed length`);
  }
};

// An ordinary trajectory request, including unchanged editor options, must sample
// the exact live waveform without moving the skeleton or changing the paused time.
motion.update(2.3);
const paused = motion.getMetrics();
const options = transitionOptions(createTransitionEdits(OFFICIAL_FLARE_SEQUENCE));
const frames = motion.sampleTrajectory({ ...options, startTime: 0, endTime: 9, samples: 181 }).frames;
assert.equal(motion.getMetrics().time, paused.time);
assert.deepEqual(motion.getMetrics().joints, paused.joints);
let maximumTrajectoryDifference = 0;
let trajectoryDifferenceAt = null;
for (const frame of frames) {
  motion.update(frame.time);
  const actual = motion.getMetrics();
  checkFinite(actual);
  const difference = maximumJointDifference(actual.joints, frame.joints);
  if (difference > maximumTrajectoryDifference) {
    maximumTrajectoryDifference = difference;
    const joint = Object.keys(actual.joints).reduce((worst, name) =>
      new THREE.Vector3().fromArray(actual.joints[name]).distanceTo(new THREE.Vector3().fromArray(frame.joints[name])) >
      new THREE.Vector3().fromArray(actual.joints[worst]).distanceTo(new THREE.Vector3().fromArray(frame.joints[worst])) ? name : worst);
    trajectoryDifferenceAt = { time: frame.time, joint, actual: actual.joints[joint], sampled: frame.joints[joint] };
  }
}
assert.ok(maximumTrajectoryDifference < 1e-7, `Trajectory drift: ${maximumTrajectoryDifference} ${JSON.stringify(trajectoryDifferenceAt)}`);

// Entering manual mode leaves the paused v41 frame on screen. A saved manual
// pose can bend its free arm, and editing must not force it to full extension.
motion.update(.45);
const beforeManual = motion.getMetrics().joints;
motion.applyPose(JSON.parse(JSON.stringify(motion.capturePose())));
const pausedFrameReplayDifference = maximumJointDifference(beforeManual, motion.getMetrics().joints);
// The source's playback-only shoulder give/body smoothing is not fully stored in
// version 1 poses. Do not worsen its existing 4.063 cm direct replay limitation.
assert.ok(pausedFrameReplayDifference < .041, `Paused frame replay regressed: ${pausedFrameReplayDifference}`);
motion.update(.45);
motion.enterManualMode();
assert.equal(motion.getMetrics().mode, 'manual');
assert.deepEqual(motion.getMetrics().joints, beforeManual);
motion.reset();
const draft = clone(motion.capturePose());
const shoulder = new THREE.Vector3().fromArray(motion.getMetrics().joints.leftShoulder);
draft.limbs.left.handLocked = false;
draft.limbs.left.wrist = shoulder.clone().add(new THREE.Vector3(.08, -.12, .2)).toArray();
draft.limbs.left.elbowPole = shoulder.clone().add(new THREE.Vector3(.15, -.2, 0)).toArray();
motion.applyPose(draft);
const bent = motion.getMetrics();
checkFinite(bent);
assert.ok(new THREE.Vector3().fromArray(bent.joints.leftWrist).distanceTo(shoulder) < .3, 'Manual arm was forced straight');
const serializedDraft = JSON.parse(JSON.stringify(motion.capturePose()));
motion.applyPose(serializedDraft);
assert.ok(maximumJointDifference(bent.joints, motion.getMetrics().joints) < 1e-7, 'Saved manual draft changed on replay');
const manualHandle = motion.getEditableHandles().find(handle => handle.id === 'leftElbow');
motion.editHandle('leftElbow', { quaternion: new THREE.Quaternion().fromArray(manualHandle.quaternion)
  .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), .1)).toArray() });
checkFinite(motion.getMetrics());
motion.update(.45);
assert.ok(maximumJointDifference(beforeManual, motion.getMetrics().joints) < 1e-7, 'Returning from manual mode changed v41 playback');

// An authored K frame and explicit linear interpolation disable v41's spline
// and paced clock; replacing the sequence clears the cached pacing table.
const correctionPose = clone(serializedDraft);
const edited = updateOfficialFrame(OFFICIAL_FLARE_SEQUENCE, 2, correctionPose);
motion.setSequence(edited.steps, { period: 9, corrections: [{ id: 'user-k', segment: 0, at: .5, pose: correctionPose }] });
assert.equal(motion.isSmoothLoopActive(), false);
motion.update(.5);
checkFinite(motion.getMetrics());
const kFrame = motion.sampleTrajectory({ startTime: .5, endTime: .5, samples: 2 }).frames[0];
assert.ok(maximumJointDifference(kFrame.joints, motion.getMetrics().joints) < 1e-7);
const viewer = Object.create(BodyViewer.prototype);
Object.assign(viewer, { motion, coach: model, time: .5, speed: .5, mode: 'motion',
  pacing: [99], rigData, dirty: false });
assert.equal(viewer.pacingRate(.5), 1);
assert.equal(viewer.paceStep(.04), .02);
viewer.setSequence(OFFICIAL_FLARE_SEQUENCE, { preserveView: true });
assert.equal(viewer.pacing, null);
assert.equal(motion.isSmoothLoopActive(), true);
motion.setSequence(OFFICIAL_FLARE_SEQUENCE.steps, { period: 9, interpolation: 'linear' });
assert.equal(motion.isSmoothLoopActive(), false);
assert.equal(viewer.pacingRate(.5), 1);
motion.setSequence(OFFICIAL_FLARE_SEQUENCE.steps, { period: 9 });
viewer.pacing = [99];
viewer.pacingRevision = motion.getSequenceRevision();
motion.setSequence(OFFICIAL_FLARE_SEQUENCE.steps, { period: 9 });
viewer.pacingRate(.5);
assert.equal(viewer.pacingRevision, motion.getSequenceRevision());
assert.equal(viewer.pacing.length, 240, 'A direct editor sequence change kept the old pacing table');

class Storage {
  constructor(entries = {}, reject = null) { this.values = new Map(Object.entries(entries)); this.reject = reject; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { if (key === this.reject) throw new Error('Storage rejected'); this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}
const sequenceKey = 'flare-demonstration-v1', transitionsKey = 'flare-transition-library-v1';
const oldRaw = JSON.stringify(oldDefault, null, 2), personalRaw = '{"steps":["personal"],"draft":"keep byte for byte"}';
const storage = new Storage({ [sequenceKey]: oldRaw, 'flare-pose-library-v1': personalRaw });
const oldEdits = createTransitionEdits(oldDefault);
oldEdits.draft = { segment: 0, at: .3, pose: clone(oldDefault.steps[0].pose), name: 'Unpublished draft' };
saveTransitionEdits(oldEdits, oldDefault, storage);
const editsRaw = storage.getItem(transitionsKey);
assert.deepEqual(resolveOfficialSequence(storage), OFFICIAL_FLARE_SEQUENCE);
const backup = JSON.parse(storage.getItem(MOTION_V41_UPGRADE_BACKUP_KEY));
assert.equal(backup.storage[sequenceKey], oldRaw);
assert.equal(backup.storage[transitionsKey], editsRaw);
assert.equal(storage.getItem('flare-pose-library-v1'), personalRaw);
assert.equal(storage.getItem(transitionsKey), editsRaw);
assert.deepEqual(loadTransitionEdits(oldDefault, storage).draft, oldEdits.draft);
assert.deepEqual(previousOfficialSequence(storage), oldDefault);
assert.deepEqual(resolveOfficialSequence(storage), OFFICIAL_FLARE_SEQUENCE);

const personal = updateOfficialFrame(oldDefault, 2, correctionPose);
const personalSequenceRaw = JSON.stringify(personal);
const custom = new Storage({ [sequenceKey]: personalSequenceRaw, [transitionsKey]: editsRaw, 'flare-pose-library-v1': personalRaw });
assert.deepEqual(resolveOfficialSequence(custom), personal, 'Published personal animation was replaced');
assert.equal(custom.getItem(sequenceKey), personalSequenceRaw);
assert.deepEqual(saveV41DefaultSequence(custom), OFFICIAL_FLARE_SEQUENCE);
assert.deepEqual(previousOfficialSequence(custom), personal);
const selectionBackup = JSON.parse(custom.getItem(MOTION_V41_SELECTION_BACKUP_KEY)).entries.at(-1);
assert.equal(selectionBackup.storage[sequenceKey], personalSequenceRaw);
assert.equal(selectionBackup.storage[transitionsKey], editsRaw);
assert.equal(custom.getItem('flare-pose-library-v1'), personalRaw);
assert.equal(custom.getItem(transitionsKey), editsRaw);

// Personal timing/routes must survive even when every key pose is unchanged.
for (const change of [{ interpolation: 'linear' }, { footCurves: [{ id: 'personal-route' }] }]) {
  const sameKeysPersonal = { ...clone(oldDefault), ...change };
  const sameKeysRaw = JSON.stringify(sameKeysPersonal);
  const sameKeysStorage = new Storage({ [sequenceKey]: sameKeysRaw });
  assert.deepEqual(resolveOfficialSequence(sameKeysStorage), sameKeysPersonal);
  assert.equal(sameKeysStorage.getItem(sequenceKey), sameKeysRaw);
}

for (const rejectionKey of [MOTION_V41_UPGRADE_BACKUP_KEY, sequenceKey]) {
  const rejected = new Storage({ [sequenceKey]: oldRaw }, rejectionKey);
  assert.deepEqual(resolveOfficialSequence(rejected), oldDefault);
  assert.equal(rejected.getItem(sequenceKey), oldRaw);
}
const rejectedSelection = new Storage({ [sequenceKey]: personalSequenceRaw }, MOTION_V41_SELECTION_BACKUP_KEY);
assert.throws(() => saveV41DefaultSequence(rejectedSelection));
assert.equal(rejectedSelection.getItem(sequenceKey), personalSequenceRaw);

// Optional independent oracle: compare against the unmodified PR #3 runtime.
const sourceIndex = process.argv.indexOf('--source');
let maximumSourceDifference = null;
let maximumClockRateDifference = null;
if (sourceIndex >= 0) {
  const sourceRoot = path.resolve(process.argv[sourceIndex + 1]);
  // The read-only source worktree need not install another node_modules tree.
  const { registerHooks } = await import('node:module');
  const threeURL = import.meta.resolve('three');
  const hook = registerHooks({ resolve(specifier, context, nextResolve) {
    return specifier === 'three' || specifier.startsWith('three/addons/')
      ? { url: specifier === 'three' ? threeURL : new URL('../examples/jsm/' + specifier.slice('three/addons/'.length), threeURL).href, shortCircuit: true }
      : nextResolve(specifier, context);
  } });
  const sourceRuntime = await import(pathToFileURL(path.join(sourceRoot, 'src/coach-motion.js')));
  const { BodyViewer: SourceViewer } = await import(pathToFileURL(path.join(sourceRoot, 'src/viewer.js')));
  hook.deregister();
  const sourceModel = await modelAt(path.join(sourceRoot, 'public/coach/flare-coach.glb'));
  const sourceRig = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'public/coach/coach-rig.json'), 'utf8'));
  const reference = sourceRuntime.createCoachMotion({ model: sourceModel, rigData: sourceRig });
  maximumSourceDifference = 0;
  for (const frame of frames) {
    motion.update(frame.time); reference.update(frame.time);
    maximumSourceDifference = Math.max(maximumSourceDifference, maximumJointDifference(motion.getMetrics().joints, reference.getMetrics().joints));
    for (const name of rigData.bones.map(bone => bone.name)) {
      const a = model.getObjectByName(name).quaternion, b = sourceModel.getObjectByName(name).quaternion;
      assert.ok(1 - Math.abs(a.dot(b)) < 1e-7, `${name} diverged from source rotation`);
    }
  }
  assert.ok(maximumSourceDifference < 1e-7, `Default source drift: ${maximumSourceDifference}`);
  const sourceViewer = Object.create(SourceViewer.prototype);
  Object.assign(sourceViewer, { motion: reference, coach: sourceModel, time: 0, speed: .5 });
  Object.assign(viewer, { time: 0, pacing: null });
  maximumClockRateDifference = 0;
  for (const frame of frames) {
    maximumClockRateDifference = Math.max(maximumClockRateDifference,
      Math.abs(viewer.pacingRate(frame.time) - sourceViewer.pacingRate(frame.time)));
  }
  assert.ok(maximumClockRateDifference < 1e-10, `Default clock drift: ${maximumClockRateDifference}`);
}
console.log(JSON.stringify({ ok: true, samples: frames.length, maximumTrajectoryDifference, maximumSourceDifference, maximumClockRateDifference, pausedFrameReplayDifference,
  manualEditor: true, keyframeFallback: true, migrationPreservesPersonalAndDrafts: true }, null, 2));
