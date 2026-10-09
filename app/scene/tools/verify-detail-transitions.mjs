import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createDetailView } from '../src/detail.js';
import { FlarePlayer } from '../src/player.js';

// Exercise the real detail and camera code without a GPU or a DOM renderer.
// The host's synchronous swap commands can arrive during any camera glide.
globalThis.window = {};
window.parent = window;
globalThis.document = {
  createElement: () => ({
    setAttribute() {},
    querySelector: () => ({}),
    remove() {},
  }),
};

function harness() {
  const homePosition = new THREE.Vector3(5, 1, 0);
  const homeTarget = new THREE.Vector3(0, .5, 0);
  let direction = new THREE.Vector3(.18, .38, 1);
  const player = {
    camera: new THREE.PerspectiveCamera(32, 1, .02, 40),
    controls: { target: homeTarget.clone(), enableDamping: false, update() {} },
    container: { clientWidth: 390, clientHeight: 340, append() {} },
    renderer: { domElement: { classList: { add() {}, remove() {} }, offsetWidth: 390 } },
    running: true, autoFrame: true, framingMode: 'main', time: 2.375,
    getMetrics: () => ({ bounds: { min: [-1, 0, -1], max: [1, 1, 1] } }),
    setFramingMode(value) { this.framingMode = value; },
    setDisplayScene(value) { this.displayScene = value; },
  };
  for (const method of ['setCameraView', 'glideTo', 'stepGlide', 'fitBounds']) {
    player[method] = FlarePlayer.prototype[method];
  }
  player.camera.position.copy(homePosition);
  const phaseMap = {
    scene: {}, setDetail() {}, refreshEnvironment() {}, restorePhase() {},
    getFullBounds: () => new THREE.Box3(
      new THREE.Vector3(-.5, 0, -.3), new THREE.Vector3(.5, 2, .3),
    ),
  };
  const detail = createDetailView(player, phaseMap, null, () => direction.clone());
  return { player, detail, homePosition, homeTarget, setDirection: value => { direction = value; } };
}

function view(player) {
  return { position: player.camera.position.clone(), target: player.controls.target.clone() };
}

function destination(player) {
  assert.ok(player.glide, 'operation starts a camera glide');
  return { position: player.glide.toP.clone(), target: player.glide.toT.clone() };
}

function expectView(player, expected, label) {
  assert.ok(player.camera.position.distanceTo(expected.position) < 1e-9, `${label}: position`);
  assert.ok(player.controls.target.distanceTo(expected.target) < 1e-9, `${label}: target`);
}

function finishGlide(player) {
  player.stepGlide(player.glide.start + player.glide.ms);
  assert.equal(player.glide, null);
}

function interruptedRoundTrip(player, detail, label) {
  const expected = destination(player);
  player.stepGlide(player.glide.start + 100);
  assert.ok(player.camera.position.distanceTo(expected.position) > .001, 'swap really interrupts a glide');
  const time = player.time;
  detail.setModel('muscles', {});
  detail.setModel('motion', {});
  expectView(player, expected, label);
  assert.equal(player.glide, null, 'return installs the final locked camera');
  assert.equal(player.controls.enabled, true, 'athlete view can be turned');
  assert.equal(player.controls.enableZoom, false, 'athlete view never zooms');
  assert.equal(player.controls.enablePan, false, 'athlete view never pans');
  assert.equal(player.time, time, 'model round trip preserves the animation frame');
}

{
  const { player, detail, homePosition, homeTarget } = harness();
  detail.open('triceps', {});
  interruptedRoundTrip(player, detail, 'opening detail');
  detail.close();
  assert.equal(player.framingMode, 'main');
  assert.equal(player.autoFrame, true);
  finishGlide(player);
  expectView(player, { position: homePosition, target: homeTarget }, 'return home');
}

{
  const { player, detail, setDirection } = harness();
  detail.open('triceps', {});
  finishGlide(player);
  setDirection(new THREE.Vector3(-1, .3, .5));
  detail.reset({});
  interruptedRoundTrip(player, detail, 'resetting detail');
  setDirection(new THREE.Vector3(1, .2, -.5));
  detail.open('quadriceps', {});
  interruptedRoundTrip(player, detail, 'changing muscle group');
}

{
  const { player, detail } = harness();
  detail.open('triceps', {});
  finishGlide(player);
  const athlete = view(player);
  detail.setModel('muscles', {});
  const reference = { position: new THREE.Vector3(1.5, 1.2, -3), target: new THREE.Vector3(0, .9, 0) };
  player.setCameraView(reference.position, reference.target);
  detail.setModel('motion', {});
  expectView(player, athlete, 'settled athlete view');
  detail.setModel('muscles', {});
  expectView(player, reference, 'user rotated reference view');
}

{
  const { player, detail, homePosition, homeTarget } = harness();
  detail.open('triceps', {});
  finishGlide(player);
  detail.close();
  player.stepGlide(player.glide.start + 100);
  detail.open('quadriceps', {});
  finishGlide(player);
  detail.close();
  finishGlide(player);
  expectView(player, { position: homePosition, target: homeTarget }, 'reopening during return home');
}

{
  // Opposite-side views: the glide orbits around the subject instead of
  // cutting past it (no sudden zoom-in, no flip over the top).
  const { player } = harness();
  const target = new THREE.Vector3(0, .5, 0);
  player.setCameraView(new THREE.Vector3(-4, 1.2, -.4), target);
  const toP = new THREE.Vector3(3.2, 1.6, .6);
  player.glideTo(toP, target);
  const fromR = 4.0, toR = toP.clone().sub(target).length();
  let minR = Infinity, maxStep = 0, last = player.camera.position.clone();
  for (let i = 1; i <= 120; i++) {
    player.stepGlide(player.glide ? player.glide.start + player.glide.ms * i / 120 : 0);
    const offset = player.camera.position.clone().sub(player.controls.target);
    minR = Math.min(minR, offset.length()); maxStep = Math.max(maxStep, player.camera.position.distanceTo(last));
    assert.ok(offset.y > 0, 'glide never dips under the subject');
    last = player.camera.position.clone();
    if (!player.glide) break;
  }
  assert.ok(minR > Math.min(fromR, toR) * 0.97, `glide keeps its distance (min ${minR.toFixed(3)})`);
  assert.ok(maxStep < 0.35, `glide has no jumps (max step ${maxStep.toFixed(3)})`);
  assert.ok(player.camera.position.distanceTo(toP) < 1e-9, 'glide lands exactly');
}

console.log('Detail transitions verified: orbiting glide (no cut-through), interrupted opening/reset/group changes, saved views, same frame, and home return.');
