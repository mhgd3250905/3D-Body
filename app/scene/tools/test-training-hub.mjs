import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { createMuscleUniforms } from '../src/legacy/muscle-map.js';
import { applyFunctionalSurface } from '../src/muscle-material.js';
import { fitHubAngle } from '../src/training-hub-angle-fit.js';
import { createHubTransitions } from '../src/training-hub-transitions.js';

const angleCamera = { yaw: -.22, distance: 4.75, target: [.14, .76, -.18], fov: 32 };
const secondAngle = { ...angleCamera, yaw: -.48 };
const front = { position: [0, 1.155, 3.4], target: [0, 1.155, 0], fov: 26 };
const back = { ...front, position: [0, 1.155, -3.4] };
const base = { phaseSource: 9, phaseTime: 0, angleCamera, muscleId: 'deltoids', muscleCamera: front, showMuscles: false };
const toward = { ...base, phaseSource: 15, phaseTime: 6, angleCamera: secondAngle };
const muscle = { ...base, showMuscles: true };
const posterior = { ...muscle, muscleId: 'triceps', muscleCamera: back };

function shot(camera) { return new THREE.Vector3().setFromSpherical(camera.orbit).add(camera.target); }

function assertFixedAngle(camera, distance = angleCamera.distance) {
  assert.deepEqual(camera.target.toArray(), angleCamera.target);
  assert.equal(camera.fov, angleCamera.fov);
  assert.equal(camera.orbit.radius, distance);
  const position = shot(camera);
  assert.ok(Math.abs(position.y - angleCamera.target[1]) < 1e-10);
  assert.ok(Math.abs(Math.hypot(position.x - angleCamera.target[0], position.z - angleCamera.target[2]) - distance) < 1e-10);
}

const boxCenter = new THREE.Vector3(...angleCamera.target);
const box = new THREE.Box3().setFromCenterAndSize(boxCenter, new THREE.Vector3(2.4, 1.3, 1.4));
const fitBounds = { min: box.min.toArray(), max: box.max.toArray() };
const boxCorners = [box.min.x, box.max.x].flatMap(x => [box.min.y, box.max.y]
  .flatMap(y => [box.min.z, box.max.z].map(z => new THREE.Vector3(x, y, z))));

function maxBoxProjection(camera, center, distance, yaw) {
  camera.position.set(Math.sin(yaw) * distance, 0, Math.cos(yaw) * distance).add(center);
  camera.lookAt(center);
  camera.updateMatrixWorld();
  return Math.max(...boxCorners.map(corner => {
    const { x, y, z } = corner.clone().project(camera);
    assert.ok(z > -1 && z < 1);
    return Math.max(Math.abs(x), Math.abs(y));
  }));
}

test('all eight stage yaws fit the motion box at the tightest shared 4% margin', () => {
  const yaws = [-.22, .34, .22, .48, -.14, -.34, -.24, -.48];
  const fov = angleCamera.fov;
  const distances = [320 / 398, 430 / 374, 1600 / 400].map(aspect => {
    const { target, distance } = fitHubAngle(fitBounds, { yaws, fov, aspect });
    const center = new THREE.Vector3(...target);
    assert.ok(center.distanceTo(boxCenter) < 1e-10);
    const camera = new THREE.PerspectiveCamera(fov, aspect, .02, 40);
    const projections = yaws.map(yaw => maxBoxProjection(camera, center, distance, yaw));
    const largest = Math.max(...projections);
    assert.ok(Math.abs(largest - .92) < 1e-9, `largest projection: ${largest}`);
    return distance;
  });
  assert.ok(distances[0] > distances[1] && distances[1] > distances[2]);
});

test('the fit uses phase yaws even when the orbit between two poses has a wider projection', () => {
  const yaws = [-.48, .15, .12, -.08, .06, -.1, -.14, .48];
  const fov = angleCamera.fov, aspect = 320 / 398;
  const { target, distance } = fitHubAngle(fitBounds, { yaws, fov, aspect });
  const camera = new THREE.PerspectiveCamera(fov, aspect, .02, 40);
  const center = new THREE.Vector3(...target);
  assert.ok(Math.abs(Math.max(...yaws.map(yaw => maxBoxProjection(camera, center, distance, yaw))) - .92) < 1e-9);
  assert.ok(maxBoxProjection(camera, center, distance, -.32) > .925);
});

test('phase retargeting preserves the current pose and camera and any latest destination wins', () => {
  const hub = createHubTransitions(9);
  assert.equal(hub.configure(base, 0), true);
  assertFixedAngle(hub.frame.angle);
  assert.equal(hub.configure(toward, 50), true);
  hub.sample(200);
  const before = hub.frame;
  assert.ok(before.time > 0 && before.time < 9);
  assert.ok(before.angle.orbit.theta < angleCamera.yaw && before.angle.orbit.theta > secondAngle.yaw);
  assertFixedAngle(before.angle);
  hub.configure(base, 200);
  assert.equal(hub.frame.time, before.time);
  assert.ok(shot(hub.frame.angle).distanceTo(shot(before.angle)) < 1e-10);

  for (let i = 0; i < 5; i++) {
    assert.equal(hub.configure(i % 2 === 0 ? toward : base, 210 + 80 * i), true);
    assertFixedAngle(hub.frame.angle);
  }
  hub.sample(530 + 599);
  assert.notEqual(hub.frame.time, 6);
  hub.sample(530 + 600);
  assert.equal(hub.frame.time, 6);
  assert.ok(hub.frame.angle.orbit.theta > secondAngle.yaw);
  hub.sample(530 + 700);
  assert.equal(hub.frame.targetPhase, 15);
  assertFixedAngle(hub.frame.angle);
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
  assertFixedAngle(realCamera);
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
  assertFixedAngle(hub.frame.angle);
});

test('resizing refits the orbit without restarting its active phase transition', () => {
  const hub = createHubTransitions(9);
  assert.equal(hub.configure(base, 0), true);
  assert.equal(hub.configure(toward, 50), true);
  hub.sample(250);
  const before = hub.frame;
  const distance = 5.4;
  hub.resizeAngle(distance);
  assert.equal(hub.frame.time, before.time);
  assert.equal(hub.frame.angle.orbit.theta, before.angle.orbit.theta);
  assertFixedAngle(hub.frame.angle, distance);
  assert.equal(hub.configure({ ...toward, angleCamera: { ...secondAngle, distance } }, 250), true);
  hub.sample(650);
  assert.equal(hub.frame.time, 6);
  assert.ok(hub.frame.angle.orbit.theta > secondAngle.yaw);
  assertFixedAngle(hub.frame.angle, distance);
  hub.sample(750);
  assert.equal(hub.frame.angle.orbit.theta, secondAngle.yaw);
  assertFixedAngle(hub.frame.angle, distance);
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
