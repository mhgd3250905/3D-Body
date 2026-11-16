import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { createMuscleUniforms } from '../src/legacy/muscle-map.js';
import { applyFunctionalSurface } from '../src/muscle-material.js';
import { createHubTransitions } from '../src/training-hub-transitions.js';

const angleCamera = { yaw: -.22, distance: 6.48, targetHeight: .71, fov: 32 };
const secondAngle = { ...angleCamera, yaw: -.48 };
const front = { position: [0, 1.155, 3.4], target: [0, 1.155, 0], fov: 26 };
const back = { ...front, position: [0, 1.155, -3.4] };
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
  assert.ok(before.angle.orbit.theta < angleCamera.yaw && before.angle.orbit.theta > secondAngle.yaw);
  assert.equal(before.angle.fov, angleCamera.fov);
  assert.equal(before.angle.orbit.radius, angleCamera.distance);
  assert.deepEqual(before.angle.target.toArray(), [0, angleCamera.targetHeight, 0]);
  hub.configure(base, 200);
  assert.equal(hub.frame.time, before.time);
  assert.ok(shot(hub.frame.angle).distanceTo(shot(before.angle)) < 1e-10);

  for (let i = 0; i < 5; i++) hub.configure(i % 2 === 0 ? toward : base, 210 + 80 * i);
  hub.sample(530 + 599);
  assert.notEqual(hub.frame.time, 6);
  hub.sample(530 + 600);
  assert.equal(hub.frame.time, 6);
  assert.ok(hub.frame.angle.orbit.theta > secondAngle.yaw);
  hub.sample(530 + 700);
  assert.equal(hub.frame.targetPhase, 15);
  assert.equal(hub.frame.angle.fov, angleCamera.fov);
  assert.equal(hub.frame.angle.orbit.theta, secondAngle.yaw);
  assert.equal(hub.moving, false);
});

test('scrub previews supplied time immediately and holds the actual camera before snapping', () => {
  const hub = createHubTransitions(9);
  hub.configure(base, 0);
  hub.configure(toward, 50);
  hub.sample(200);
  hub.configure({ ...base, phaseTime: 2.73, scrubbing: true }, 201);
  const realCamera = hub.frame.angle;
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
  assert.equal(hub.frame.angle.orbit.theta, secondAngle.yaw);
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
  assert.equal(hub.frame.angle.orbit.theta, angleCamera.yaw);
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

test('a standing focus retargets orbit, translation, dolly and crop from the live camera', () => {
  const hub = createHubTransitions(9);
  hub.configure(muscle, 0);
  const lowerCloseUp = { position: [0, .60, -4.6], target: [0, .60, 0], fov: 26, cutoff: -.065 };
  hub.configure({ ...posterior, muscleCamera: lowerCloseUp }, 10);
  hub.sample(360);
  const before = hub.frame.muscle;
  assert.ok(Math.abs(shot(before).x - 4) < .001);
  assert.ok(Math.abs(before.target.y - (.60 + 1.155) * .5) < .001);
  assert.ok(before.cutoff < .62 && before.cutoff > -.065);

  const shoulder = { position: [0, 1.32, 4], target: [0, 1.32, 0], fov: 26, cutoff: -.065 };
  hub.configure({ ...muscle, muscleCamera: shoulder }, 360);
  assert.ok(shot(hub.frame.muscle).distanceTo(shot(before)) < 1e-10);
  assert.equal(hub.frame.muscle.cutoff, before.cutoff);
  hub.sample(1059);
  assert.ok(hub.moving);
  hub.sample(1060);
  assert.ok(shot(hub.frame.muscle).distanceTo(new THREE.Vector3(...shoulder.position)) < 1e-10);
  assert.equal(hub.frame.muscle.cutoff, -.065);
});

test('standing shader feathers the upper-thigh crop without adding emission', () => {
  const uniforms = { ...createMuscleUniforms(), mmHubBottom: { value: .62 }, mmHubFraming: { value: 1 } };
  const material = new THREE.MeshStandardMaterial();
  applyFunctionalSurface(material, uniforms, { thumbnail: true });
  const shader = { ...THREE.ShaderLib.standard, uniforms: {} };
  material.onBeforeCompile(shader);
  assert.match(shader.fragmentShader, /gl_FragColor\.a \*= smoothstep\(mmHubBottom, mmHubBottom \+ 0\.065/);
  assert.match(shader.fragmentShader, /else if \(mmHubFraming < 0\.5\) \{\s+totalEmissiveRadiance/);
  assert.match(shader.fragmentShader, /if \(mmHubFraming < 0\.5 && mmHomeEmphasis < 0\.5\)/);
});
