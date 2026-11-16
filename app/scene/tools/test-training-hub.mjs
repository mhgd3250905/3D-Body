import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { fitHubAngle } from '../src/training-hub-stage.js';
import { createHubTransitions } from '../src/training-hub-transitions.js';

const angleCamera = { position: [.398, 1.405, 2.259], target: [-.040, .481, -.173], fov: 32 };
const secondAngle = { position: [.374, 1.878, 3.290], target: [-.178, .712, .221], fov: 30 };
const front = { position: [0, 1.164, 2.520], target: [0, 1.164, 0], fov: 26 };
const back = { position: [0, 1.164, -2.470], target: [0, 1.164, 0], fov: 26 };
const base = { phaseSource: 9, phaseTime: 0, angleCamera, muscleId: 'deltoids', muscleCamera: front, showMuscles: false };
const toward = { ...base, phaseSource: 15, phaseTime: 6, angleCamera: secondAngle };
const muscle = { ...base, showMuscles: true };
const posterior = { ...muscle, muscleId: 'triceps', muscleCamera: back };

function shot(camera) { return new THREE.Vector3().setFromSpherical(camera.orbit).add(camera.target); }

test('phase retargeting preserves the current pose and camera and any latest destination wins', () => {
  const hub = createHubTransitions(9);
  hub.configure(base, 0);
  hub.configure(toward, 50);
  hub.sample(200);
  const before = hub.frame;
  assert.ok(before.time > 0 && before.time < 9);
  assert.ok(before.angle.fov < 32 && before.angle.fov > 30);
  hub.configure(base, 200);
  assert.equal(hub.frame.time, before.time);
  assert.ok(shot(hub.frame.angle).distanceTo(shot(before.angle)) < 1e-10);

  for (let i = 0; i < 5; i++) hub.configure(i % 2 === 0 ? toward : base, 210 + 80 * i);
  hub.sample(530 + 599);
  assert.notEqual(hub.frame.time, 6);
  hub.sample(530 + 600);
  assert.equal(hub.frame.time, 6);
  assert.ok(hub.frame.angle.fov > 30);
  hub.sample(530 + 700);
  assert.equal(hub.frame.targetPhase, 15);
  assert.equal(hub.frame.angle.fov, 30);
  assert.ok(shot(hub.frame.angle).distanceTo(new THREE.Vector3(...secondAngle.position)) < 1e-10);
  assert.equal(hub.moving, false);
});

test('scrub previews supplied time immediately and holds the actual camera before snapping', () => {
  const hub = createHubTransitions(9);
  hub.configure(base, 0);
  hub.configure(toward, 50);
  hub.sample(200);
  const realCamera = { ...hub.frame.angle, orbit: hub.frame.angle.orbit.clone() };
  realCamera.orbit.radius += .16;
  hub.configure({ ...base, phaseTime: 2.73, scrubbing: true }, 201, realCamera);
  assert.equal(hub.frame.time, 2.73);
  hub.sample(300);
  assert.ok(shot(hub.frame.angle).distanceTo(shot(realCamera)) < 1e-10);
  hub.configure({ ...toward, phaseTime: 5.70, scrubbing: true }, 302);
  assert.equal(hub.frame.time, 5.70);
  assert.equal(hub.moving, false);
  hub.configure(toward, 350);
  assert.equal(hub.frame.time, 5.70);
  assert.ok(shot(hub.frame.angle).distanceTo(shot(realCamera)) < 1e-10);
  hub.sample(951);
  assert.equal(hub.frame.time, 6);
  hub.sample(1050);
  assert.ok(shot(hub.frame.angle).distanceTo(new THREE.Vector3(...secondAngle.position)) < 1e-10);
});

test('mode crossfade captures opposing live cameras and retains both after reversal', () => {
  const hub = createHubTransitions(9);
  hub.configure(base, 0);
  hub.configure(muscle, 10);
  assert.equal(hub.frame.muscleScale, .96);
  hub.sample(150);
  assert.equal(hub.frame.mode, .5);
  assert.equal(hub.frame.muscleScale, .98);
  hub.configure(base, 150);
  assert.equal(hub.frame.mode, .5);
  hub.sample(430);
  assert.equal(hub.frame.mode, 0);
  assert.equal(hub.frame.angleScale, 1);
  assert.ok(shot(hub.frame.angle).distanceTo(new THREE.Vector3(...angleCamera.position)) < 1e-10);
  assert.ok(shot(hub.frame.muscle).distanceTo(new THREE.Vector3(...front.position)) < 1e-10);
});

test('posterior camera orbits the standing model while bilateral selection blends over 300 ms', () => {
  const hub = createHubTransitions(9);
  hub.configure(muscle, 0);
  hub.configure(posterior, 10);
  hub.sample(160);
  assert.equal(hub.frame.groups.get('deltoids'), .5);
  assert.equal(hub.frame.groups.get('triceps'), .5);
  hub.sample(310);
  assert.deepEqual([...hub.frame.groups], [['triceps', 1]]);
  hub.sample(360);
  const profile = shot(hub.frame.muscle);
  assert.ok(Math.abs(profile.x) > 2.4 && Math.abs(profile.z) < .01);
  hub.sample(710);
  assert.ok(shot(hub.frame.muscle).distanceTo(new THREE.Vector3(...back.position)) < 1e-10);
});

test('a slender stage recovers the full conservative angle envelope', () => {
  const camera = new THREE.PerspectiveCamera(32, .63, .02, 40);
  const target = new THREE.Vector3(0, .55, 0);
  camera.position.set(.3, 1, 2);
  camera.lookAt(target);
  camera.updateMatrixWorld(true);
  const envelope = [new THREE.Vector3(-1.1, .9, .35), new THREE.Vector3(.5, 1.5, -.25),
    new THREE.Vector3(.6, .15, .55), new THREE.Vector3(-.1, .02, -.1)];
  fitHubAngle(camera, target, envelope);
  for (const point of envelope.map(vertex => vertex.clone().project(camera))) {
    assert.ok(Math.abs(point.x) <= .971 && Math.abs(point.y) <= .971 && Math.abs(point.z) < 1);
  }
});
