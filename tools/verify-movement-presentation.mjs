import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createFlareRig } from '../src/flare-rig.js';
import { createMovementPanel, resolveTeachingSegment } from '../src/movement-panel.js';
import { resolveMovementPoseAnnotations } from '../src/movement-lessons.js';
import { transitionOptions } from '../src/transition-edits.js';

// Real Snow bones and accepted motion; card/guide renderers are recording
// doubles. These checks do not render DOM or WebGL and are not visual evidence.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, fields) { this.type = type; Object.assign(this, fields); } };
const readJSON = path => fs.readFile(new URL(path, import.meta.url), 'utf8').then(JSON.parse);
const [bytes, rigData, accepted] = await Promise.all([
  fs.readFile(new URL('../public/coach/flare-coach.glb', import.meta.url)),
  readJSON('../public/coach/coach-rig.json'),
  readJSON('../托马斯/阶段1-可用动画-2026-10-06.json'),
]);
const { scene: model } = await new GLTFLoader().parseAsync(
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const motion = createCoachMotion({ model, driver: createFlareRig(), rigData });
const sequence = {
  ...structuredClone(accepted.sequence), ...transitionOptions(accepted),
  draft: { name: 'Preserved personal draft', pose: structuredClone(accepted.sequence.steps[2].pose) },
};
const inputBytes = JSON.stringify(sequence), acceptedBytes = JSON.stringify(accepted);
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);Object.freeze(value);
  }
  return value;
}
deepFreeze(sequence);deepFreeze(accepted);
motion.setSequence(sequence.steps, sequence);
motion.update(2.35);

const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 1280 / 720, .02, 40);
scene.add(model);camera.position.set(.45, 1.36, 3.8);camera.lookAt(0, .8, 0);camera.updateMatrixWorld(true);
let latestMetrics = null, sampleCalls = 0, controllerSetTimeCalls = 0, changed = 0;
const originalMetrics = motion.getMetrics, originalSample = motion.sampleTrajectory;
motion.getMetrics = () => (latestMetrics = originalMetrics());
motion.sampleTrajectory = options => {
  const before = JSON.stringify(motion.capturePose()), joints = originalMetrics().joints;
  const data = originalSample(options);sampleCalls++;
  assert.equal(JSON.stringify(motion.capturePose()), before, 'Teaching sampling changed the live pose');
  assert.deepEqual(originalMetrics().joints, joints, 'Teaching sampling moved a live joint');
  assert.ok(data.frames.every(frame => Object.values(frame.joints).every(point => point.every(Number.isFinite))));
  return data;
};
const guide = {
  visible: false, data: null, annotation: null, focus: null,
  setData(data) { this.data = data; },
  setAnnotations(annotation) { this.annotation = structuredClone(annotation); },
  setVisible(options) { this.visible = typeof options === 'boolean' ? options : options.enabled; },
  setFocus(group) { this.focus = group; },
  setCueDirections(updates) { this.directions = structuredClone(updates); },
};
const viewport = { getBoundingClientRect: () => ({ width: 1280, height: 720 }) };
const viewer = {
  scene, coach: model, camera, motion, movementGuide: guide,
  time: 2.35, speed: .37, playing: true, dirty: false,
  controls: { target: new THREE.Vector3(.08, .82, -.1), enableDamping: true },
  playbackRange: { startTime: 0, endTime: sequence.period },
  setTime(value) { controllerSetTimeCalls++;this.time = value;motion.update(value); },
  setPlaybackRange(value) { this.playbackRange = value ? { startTime: value.startTime, endTime: value.endTime } : null; },
};
let cardOptions, fakeCards;
const trainingRequests = [];
function cardsFactory(options) {
  cardOptions = options;
  fakeCards = {
    enabled: false, annotation: null, playing: null, lastUpdate: null, size: null, disposed: false,
    setEnabled(enabled) { this.enabled = enabled; },
    setAnnotations(annotation) { this.annotation = annotation ? structuredClone(annotation) : null; },
    setPlaying(playing) { this.playing = playing; },
    resize(width, height) { this.size = [width, height]; },
    update(time, metrics) { this.lastUpdate = { time, metrics, camera: options.camera }; },
    needsRender() { return this.enabled && !this.disposed; },
    getStatus() { return { enabled: this.enabled, playing: this.playing, disposed: this.disposed }; },
    dispose() { this.disposed = true;this.enabled = false; },
  };
  return fakeCards;
}
function playbackState() {
  return {
    time: viewer.time, speed: viewer.speed, playing: viewer.playing,
    playbackRange: structuredClone(viewer.playbackRange),
    cameraPosition: camera.position.toArray(), cameraQuaternion: camera.quaternion.toArray(),
    cameraProjection: camera.projectionMatrix.toArray(), target: viewer.controls.target.toArray(),
    damping: viewer.controls.enableDamping, pose: motion.capturePose(), joints: originalMetrics().joints,
  };
}
function drive(time) { viewer.time = time;motion.update(time); }
function assertPassive(before, label) {
  assert.deepEqual(playbackState(), before, label);
  assert.equal(viewer.camera, camera, 'Controller replaced the camera');
  assert.equal(controllerSetTimeCalls, 0, 'Controller called setTime during a passive presentation action');
  assert.equal(JSON.stringify(sequence), inputBytes, 'Animation or draft input changed');
  assert.equal(JSON.stringify(accepted), acceptedBytes, 'Accepted snapshot changed');
}
let checks = 0, failures = [];
function check(name, verify) {
  try { verify();checks++;console.log(`OK ${name}`); }
  catch (error) { failures.push({ name, error });console.error(`FAIL ${name}: ${error.message}`); }
}
const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
let storageWrites = 0;
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem: () => null,
  setItem() { storageWrites++;throw new Error('Presentation tried to persist data'); },
  removeItem() { storageWrites++;throw new Error('Presentation tried to delete data'); },
  clear() { storageWrites++;throw new Error('Presentation tried to clear data'); },
} });
const beforeConstruction = playbackState();
const panel = createMovementPanel({ viewer, viewport, cardsFactory, refreshIcons() {}, onChanged() { changed++; },
  onTrain(proposal, annotation, slot) { trainingRequests.push({ proposal, annotation, slot }); } });
try {
  check('Construction, saved-sequence attachment and motion entry preserve playback and camera', () => {
    assertPassive(beforeConstruction, 'Construction changed playback');
    assert.equal(cardOptions.scene, scene);assert.equal(cardOptions.model, model);
    assert.equal(cardOptions.camera, camera);assert.equal(cardOptions.container, viewport);
    const before = playbackState();panel.setSequence(sequence);panel.setMode('motion');
    assertPassive(before, 'Attaching teaching cards changed playback');
    assert.ok(panel.active && fakeCards.enabled && guide.visible);
    assert.ok(sampleCalls > 0, 'Controller did not sample the real animation');
  });

  check('Disabling and re-enabling cards preserve the running frame, speed and original timeline', () => {
    const before = playbackState();panel.toggle();
    assert.ok(!panel.active && !fakeCards.enabled && !guide.visible);
    assert.equal(panel.needsRender(), false);assertPassive(before, 'Disabling presentation changed playback');
    panel.toggle();assert.ok(panel.active && fakeCards.enabled && guide.visible);
    assertPassive(before, 'Enabling presentation changed playback');
  });

  check('Mode round trips restore visible cards without resetting the same pose or contact state', () => {
    const before = playbackState();
    for (const mode of ['anatomy', 'training', 'pose', 'transition']) {
      panel.setMode(mode);assert.ok(!panel.active && !fakeCards.enabled && !guide.visible);
      panel.setMode('motion');assert.ok(panel.active && fakeCards.enabled && guide.visible,
        `${mode} -> motion left cards or regions hidden`);
      assertPassive(before, `Round trip from ${mode} changed playback`);
    }
  });

  check('Replacement, unsupported-node suppression and periodic suppression do not edit playback', () => {
    const before = playbackState(), currentIndex = originalMetrics().demonstration.index;
    panel.setSequence(deepFreeze(structuredClone(sequence)));assertPassive(before, 'Replacing sequence changed playback');
    panel.setSequence(deepFreeze({ ...sequence, skippedSteps: [currentIndex] }));
    assert.equal(panel.getState().annotation, null);assert.ok(!fakeCards.enabled && !guide.visible);
    assertPassive(before, 'Suppressing a skipped original changed playback');
    panel.setSequence(deepFreeze({ ...sequence, motionModel: 'periodic' }));
    assert.ok(!panel.active && !fakeCards.enabled && !guide.visible);assertPassive(before, 'Periodic suppression changed playback');
    panel.setSequence(sequence);assert.ok(panel.active && fakeCards.enabled && guide.visible);
    assertPassive(before, 'Restoring saved presentation changed playback');
  });

  check('Actual cycle contacts drive shoulder/arm regions and card wording, including between-keyframe changes', () => {
    const states = new Set();let changedContactFrames = 0, frames = 0;
    for (let cycle = 0; cycle < 2; cycle++) for (let eighth = 0; eighth < sequence.period * 8; eighth++) {
      drive(eighth / 8);const before = playbackState(), metrics = originalMetrics();
      panel.update(viewer.time);assertPassive(before, 'Dynamic annotations altered a playing pose');
      const annotation = fakeCards.annotation, support = [...metrics.supportHands].sort();
      assert.ok(annotation, `No teaching profile at ${viewer.time}`);
      assert.deepEqual([...annotation.supportHands].sort(), support);
      assert.deepEqual(panel.getState().annotation.supportHands, metrics.supportHands);
      for (const kind of ['shoulder', 'upperArm', 'scapular']) {
        assert.deepEqual(annotation.regions.filter(region => region.kind === kind).map(region => region.side).sort(), support);
        assert.deepEqual(guide.annotation.regions.filter(region => region.kind === kind).map(region => region.side).sort(), support);
      }
      const shoulderArm = annotation.audienceLabels.find(label => label.id === 'shoulder-arm-support');
      assert.ok(shoulderArm, 'Audience support card is missing');
      if (support.length === 2) assert.ok(shoulderArm.role.startsWith('双手'));
      else if (support.length === 1) assert.ok(shoulderArm.role.startsWith(support[0] === 'left' ? '左手' : '右手'));
      else assert.equal(shoulderArm.anchors.length, 0);
      assert.deepEqual(shoulderArm.anchors.filter(anchor => anchor.endsWith('Shoulder')).sort(), support.map(side => side + 'Shoulder').sort());
      const original = resolveMovementPoseAnnotations(sequence, metrics.demonstration.index);
      if (original && JSON.stringify(original.supportHands) !== JSON.stringify(metrics.supportHands)) changedContactFrames++;
      states.add(support.join(','));frames++;
    }
    assert.ok(states.has('left') && states.has('right') && states.has('left,right'), 'Accepted loop did not exercise all support types');
    assert.ok(changedContactFrames > 0, 'No live-vs-saved contact transition was checked');
    console.log(`   ${frames} live frames; ${states.size} support types; ${changedContactFrames} between-node contact differences`);
  });

  check('Render updates reuse the main camera and latest live joint metrics', () => {
    drive(4.36);panel.update(viewer.time);const before = playbackState();panel.renderFrame();
    assert.equal(fakeCards.lastUpdate.camera, camera);
    assert.equal(fakeCards.lastUpdate.time, viewer.time);
    assert.equal(fakeCards.lastUpdate.metrics, latestMetrics, 'Card renderer did not receive the freshly read live metrics');
    assert.deepEqual(fakeCards.lastUpdate.metrics.joints, originalMetrics().joints);
    assert.deepEqual(fakeCards.size, [1280, 720]);assert.equal(fakeCards.playing, viewer.playing);
    assert.ok(panel.needsRender());assertPassive(before, 'Rendering cards changed playback');
    cardOptions.onHover('arms');assert.equal(guide.focus, 'arms');assertPassive(before, 'Hovering a card changed playback');
  });

  check('Only explicit play controls change playing, without moving the frame or camera even at the loop boundary', () => {
    for (const time of [.43, sequence.period]) {
      drive(time);viewer.playing = false;panel.update(viewer.time);
      const before = playbackState();panel.togglePlay();
      assert.equal(viewer.playing, true);assertPassive({ ...before, playing: true }, 'Playing a card jumped the frame');
      cardOptions.onTogglePlay();assert.equal(viewer.playing, false);assertPassive(before, 'Pausing a card changed playback');
    }
    panel.setMode('anatomy');const before = playbackState();panel.togglePlay();
    assertPassive(before, 'Play control changed a non-motion mode');panel.setMode('motion');
  });

  check('Training recommendations and preview suspension preserve the observing position', () => {
    drive(3.35);panel.update(viewer.time);const before = playbackState();
    for (const slot of ['shoulder-arm-support', 'core-coordination', 'hip-leg-swing']) {
      const proposal = panel.getTraining(slot);assert.ok(proposal.primary.animationId);
      cardOptions.onTrain(slot);assert.equal(trainingRequests.at(-1).slot, slot);
      assert.equal(trainingRequests.at(-1).proposal.primary.id, proposal.primary.id);
      assertPassive(before, 'A training request itself changed playback');
    }
    panel.setSuspended(true);assert.ok(!panel.active && !guide.visible && !fakeCards.enabled);
    assertPassive(before, 'Suspending annotations altered the observing position');
    panel.setSuspended(false);assert.ok(panel.active && guide.visible && fakeCards.enabled);
    assertPassive(before, 'Returning annotations altered the observing position');
  });

  check('Live swing directions follow the accepted K/routes and disappear during the closing hold', () => {
    const seen = [];
    for (const time of [.24, 1.7, 3.4, 5.7, 7.8, 8.8]) {
      drive(time);panel.update(time);const before = playbackState();panel.renderFrame();
      assert.equal(guide.directions.length, 2);
      for (const cue of guide.directions) assert.ok(cue.direction.every(Number.isFinite));
      seen.push(guide.directions.map(cue => cue.enabled));assertPassive(before, 'Direction calculation moved the rig');
    }
    assert.ok(seen.slice(0, -1).some(flags => flags.some(Boolean)), 'All moving arrows were suppressed');
    assert.ok(seen.at(-1).every(value => !value), 'Closing held pose still shows a swing arrow');
  });

  check('Explicit segment loops respect skipped originals and map closing 09 to opening 09 -> 10', () => {
    const start = resolveMovementPoseAnnotations(sequence, 0);
    const close = resolveMovementPoseAnnotations(sequence, sequence.steps.length - 1);
    assert.deepEqual(resolveTeachingSegment(sequence, close), resolveTeachingSegment(sequence, start));
    const skipped = { ...sequence, skippedSteps: [1] };
    assert.equal(resolveTeachingSegment(skipped, start).endTime, 2);
    drive(sequence.period - .2);panel.update(viewer.time);viewer.playing = false;
    const before = playbackState();panel.loopSegment();
    assert.equal(viewer.time, 0);assert.equal(viewer.playing, true);
    assert.deepEqual(viewer.playbackRange, { startTime: 0, endTime: 1 });
    assert.equal(viewer.speed, before.speed);assert.deepEqual(camera.position.toArray(), before.cameraPosition);
    assert.deepEqual(camera.quaternion.toArray(), before.cameraQuaternion);assert.equal(JSON.stringify(sequence), inputBytes);
    controllerSetTimeCalls = 0;const playing = playbackState();panel.clearLoop();
    assertPassive({ ...playing, playbackRange: null }, 'Clearing the segment loop sought or reframed');
  });

  check('Disposal hides the presentation and inputs/drafts remain untouched without storage writes', () => {
    const before = playbackState();panel.dispose();
    assert.ok(fakeCards.disposed && !fakeCards.enabled && !guide.visible);
    assertPassive(before, 'Disposing cards changed playback');
    assert.equal(storageWrites, 0);assert.ok(changed > 0);
  });
} finally {
  if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
  else delete globalThis.localStorage;
}
if (failures.length) {
  console.error(`Movement presentation: ${checks} checks passed, ${failures.length} failed.`);
  process.exitCode = 1;
} else console.log(`Movement presentation: ${checks} focused checks passed; controller-only, no visual/browser verification.`);
