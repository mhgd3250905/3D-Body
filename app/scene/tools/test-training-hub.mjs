import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { createMuscleUniforms } from '../src/legacy/muscle-map.js';
import { applyFunctionalSurface } from '../src/muscle-material.js';
import { CAMERA_PRESETS, FlarePlayer } from '../src/player.js';
import { fitHubAngle, resolveHubAngleCamera } from '../src/training-hub-angle-fit.js';
import { createHubAngleView } from '../src/training-hub-angle-view.js';
import { createHubFlight } from '../src/training-hub-flight.js';
import { createHubTransitions } from '../src/training-hub-transitions.js';
import angleBounds from '../src/training-hub-angle-bounds.json' with { type: 'json' };

const front = { position: [0, 1.155, 3.4], target: [0, 1.155, 0], fov: 26 };
const back = { ...front, position: [0, 1.155, -3.4] };
const base = { phaseSource: 9, phaseTime: 0, muscleId: 'deltoids', muscleCamera: front, showMuscles: false };
const toward = { ...base, phaseSource: 15, phaseTime: 6 };
const muscle = { ...base, showMuscles: true };
const posterior = { ...muscle, muscleId: 'triceps', muscleCamera: back };

function shot(camera) { return new THREE.Vector3().setFromSpherical(camera.orbit).add(camera.target); }

const boxCenter = new THREE.Vector3(.14, .76, -.18);
const box = new THREE.Box3().setFromCenterAndSize(boxCenter, new THREE.Vector3(2.4, 1.3, 1.4));
const fitBounds = { min: box.min.toArray(), max: box.max.toArray() };
const boxCorners = [box.min.x, box.max.x].flatMap(x => [box.min.y, box.max.y]
  .flatMap(y => [box.min.z, box.max.z].map(z => new THREE.Vector3(x, y, z))));

test('the full motion fits the tightest 4% margin along the elevated home direction', () => {
  const direction = CAMERA_PRESETS.standard;
  const normalized = direction.clone().normalize();
  const fov = 32;
  const distances = [320 / 398, 430 / 374, 1600 / 400].map(aspect => {
    const { target, distance } = fitHubAngle(fitBounds, { direction, fov, aspect });
    const center = new THREE.Vector3(...target);
    assert.ok(center.distanceTo(boxCenter) < 1e-10);
    const camera = new THREE.PerspectiveCamera(fov, aspect, .02, 40);
    camera.position.copy(center).addScaledVector(normalized, distance);
    camera.lookAt(center);
    camera.updateMatrixWorld();
    assert.ok(camera.getWorldDirection(new THREE.Vector3()).negate().distanceTo(normalized) < 1e-10);
    const largest = Math.max(...boxCorners.map(corner => {
      const { x, y, z } = corner.clone().project(camera);
      assert.ok(z > -1 && z < 1);
      return Math.max(Math.abs(x), Math.abs(y));
    }));
    assert.ok(Math.abs(largest - .92) < 1e-9, 'largest projection: ' + largest);
    return distance;
  });
  assert.ok(distances[0] > distances[1] && distances[1] > distances[2]);
  assert.ok(normalized.y > 0);
});

test('the angle camera stays level and moves to two thirds of the previous distance', () => {
  const referenceDirection = CAMERA_PRESETS.standard;
  const oldDirection = referenceDirection.clone();
  const fov = 32;
  for (const aspect of [320 / 398, 390 / 374, 430 / 366]) {
    const previous = fitHubAngle(fitBounds, { direction: referenceDirection, fov, aspect });
    const { target, direction, distance } = resolveHubAngleCamera(fitBounds, {
      referenceDirection, fov, aspect,
    });
    assert.deepEqual(target, previous.target);
    assert.equal(direction.y, 0);
    assert.ok(direction.distanceTo(oldDirection.clone().setY(0).normalize()) < 1e-10);
    assert.ok(Math.abs(distance * 1.5 - previous.distance) < 1e-10);
  }
  assert.deepEqual(referenceDirection.toArray(), oldDirection.toArray());
});

test('hub entry starts at the home shot and lands at the same pixels as the hub camera', () => {
  const width = 390, height = 690, destinationTop = -30, destinationHeight = 374;
  const home = new THREE.PerspectiveCamera(39, width / height, .02, 40);
  const target = new THREE.Vector3(0, .8, 0);
  home.position.set(1, 3, 5);
  home.lookAt(target);
  home.setViewOffset(width, height, 10, 148, width, height);
  home.updateMatrixWorld(true);
  const times = [];
  let landings = 0;
  const player = {
    container: { clientHeight: height, clientWidth: width },
    camera: home, controls: { target }, time: 0, period: 9, baseFov: 32,
    motion: { update: time => times.push(time) },
    shadowCatcher: { material: { opacity: .28 } },
  };
  const flight = createHubFlight(player, {
    top: destinationTop, height: destinationHeight, time: 2.7, duration: 650,
  }, CAMERA_PRESETS.standard, () => landings++);
  flight.sample(0);
  for (const point of boxCorners) {
    assert.ok(point.clone().project(home).distanceTo(point.clone().project(flight.camera)) < 1e-10);
  }
  flight.sample(325);
  assert.ok(times.at(-1) > 0 && times.at(-1) < 2.7);
  assert.equal(landings, 0);
  flight.sample(650);
  const fit = resolveHubAngleCamera(angleBounds, {
    referenceDirection: CAMERA_PRESETS.standard, fov: 32, aspect: width / destinationHeight,
  });
  const landing = new THREE.PerspectiveCamera(32, width / destinationHeight, .02, 40);
  landing.position.fromArray(fit.target).addScaledVector(fit.direction, fit.distance);
  landing.lookAt(new THREE.Vector3(...fit.target));
  landing.updateMatrixWorld(true);
  for (const point of boxCorners) {
    const a = point.clone().project(flight.camera);
    const b = point.clone().project(landing);
    assert.ok(Math.abs(a.x - b.x) < 1e-10);
    assert.ok(Math.abs((1 - a.y) * height / 2 - (destinationTop + (1 - b.y) * destinationHeight / 2)) < 1e-8);
  }
  assert.equal(times.at(-1), 2.7);
  assert.equal(landings, 0);
  flight.rendered();
  flight.rendered();
  assert.equal(landings, 1);
  flight.restore();
  assert.equal(times.at(-1), 0);
  assert.equal(player.shadowCatcher.material.opacity, .28);

  let prepared = 0;
  const actualTime = 2.85;
  const actualView = createHubAngleView(32, CAMERA_PRESETS.standard);
  const viewport = { top: destinationTop, height: destinationHeight };
  actualView.frame(width, height, viewport, -1.2);
  actualView.camera.setViewOffset(width, destinationHeight, 3, -destinationTop, width, height);
  player.trainingHub = {
    getActorFrame: () => ({ camera: actualView.camera, target: actualView.target, time: actualTime, viewport }),
  };
  // Settling the flight while the hub owns the actor must not reapply home time.
  times.push(actualTime);
  flight.restore();
  assert.equal(times.at(-1), actualTime);

  // The return must trust the rendered camera and pose instead of recalculating
  // the shot from a possibly queued host yaw/time command.
  const back = createHubFlight(player, {
    top: destinationTop, height: destinationHeight, time: 2.7,
    duration: 650, returning: true, yaw: 0,
  }, CAMERA_PRESETS.standard, () => landings++, () => prepared++);
  back.sample(0);
  assert.deepEqual(back.camera.matrixWorld.elements, actualView.camera.matrixWorld.elements);
  assert.deepEqual(back.camera.projectionMatrix.elements, actualView.camera.projectionMatrix.elements);
  assert.equal(times.at(-1), actualTime);
  back.rendered();
  assert.equal(prepared, 1);
  assert.equal(back.sample(16), true, 'draw the exact departure pose again');
  assert.deepEqual(back.camera.projectionMatrix.elements, actualView.camera.projectionMatrix.elements);
  assert.equal(times.at(-1), actualTime);
  back.rendered();
  assert.equal(prepared, 1);
  assert.equal(back.sample(250), true);
  assert.ok(times.at(-1) < actualTime);
  back.sample(666);
  assert.equal(times.at(-1), 0);
  for (const point of boxCorners) {
    assert.ok(point.clone().project(home).distanceTo(point.clone().project(back.camera)) < 1e-10);
  }
  back.rendered();
  assert.equal(landings, 1);
  assert.equal(back.sample(682), true);
  back.rendered();
  assert.equal(landings, 2);
});

test('an early Back reverses from the visible frame without a pose or camera jump', () => {
  const width = 390, height = 690;
  const home = new THREE.PerspectiveCamera(39, width / height, .02, 40);
  const target = new THREE.Vector3(0, .8, 0);
  home.position.set(1, 3, 5);
  home.lookAt(target);
  home.updateMatrixWorld(true);
  const poses = [], completed = [];
  const player = {
    container: { clientHeight: height, clientWidth: width },
    camera: home, controls: { target }, time: 0, period: 9, baseFov: 32,
    motion: { update: time => poses.push(time) },
  };
  const flight = createHubFlight(player, {
    top: 20, height: 374, time: 2.7, duration: 650,
  }, CAMERA_PRESETS.standard, () => completed.push('entry'));
  flight.sample(0);
  assert.ok(flight.setAngleYaw(.7), 'the retained actor can respond before the hub boots');
  flight.sample(325);
  const before = flight.camera.matrixWorld.clone();
  const pose = poses.at(-1);

  assert.ok(flight.reverse(() => completed.push('return')));
  assert.equal(flight.setAngleYaw(1), false, 'the return keeps its last visible angle');
  assert.ok(flight.sample(340));
  assert.deepEqual(flight.camera.matrixWorld.elements, before.elements);
  assert.equal(poses.at(-1), pose);
  assert.deepEqual(completed, []);
  assert.ok(flight.sample(665));
  assert.equal(poses.at(-1), 0);
  assert.ok(flight.camera.position.distanceTo(home.position) < 1e-10);
  flight.rendered();
  assert.deepEqual(completed, []);
  assert.ok(flight.sample(681));
  flight.rendered();
  assert.deepEqual(completed, ['return']);
});

test('the shared canvas keeps the quality cap in flight and adapts in the hub', () => {
  const stageDensity = FlarePlayer.prototype.stagePixelRatio;
  const player = { fullPixelRatio: 3 };
  assert.equal(stageDensity.call(player, 1.25), 1.25);
  player.hubFlight = { landed: false };
  assert.equal(stageDensity.call(player, 1), 3);
  player.hubFlight.landed = true;
  assert.equal(stageDensity.call(player, 1), 3);
  player.hubFlight = { pixelRatio: 1.25 };
  assert.equal(stageDensity.call(player, 3), 1.25);
  player.hubFlight = null;
  player.trainingHub = {};
  player.stageHandoffFrames = 2;
  player.stageHandoffRatio = 3;
  assert.equal(stageDensity.call(player, 1.25), 3);
  player.stageHandoffFrames--;
  assert.equal(stageDensity.call(player, 1.25), 3);
  player.stageHandoffFrames--;
  assert.equal(stageDensity.call(player, 1.25), 1.25);
});

test('a camera move keeps the same ground projection until the pose changes', () => {
  const scene = {};
  const shadowMap = { enabled: true, autoUpdate: true, needsUpdate: false };
  const drawUpdates = [];
  const player = {
    time: 1.123, scene, renderer: { shadowMap, render: () => drawUpdates.push(shadowMap.autoUpdate) },
    keyLight: { castShadow: true, shadow: { map: {}, mapSize: { x: 1024, y: 1024 } } },
    perf: { shadowPasses: 0, shadowPixels: 0, skippedShadows: 0 },
  };
  const draw = () => FlarePlayer.prototype.renderActor.call(player, scene, {}, true);
  draw();
  player.hubFlight = { poseTime: 1.123 };
  draw();
  player.hubFlight.poseTime = 1.35;
  draw();
  draw();
  assert.deepEqual(drawUpdates, [true, false, true, false]);
  assert.equal(shadowMap.autoUpdate, true);
  assert.equal(player.perf.shadowPasses, 2);
  assert.equal(player.perf.skippedShadows, 2);
});

test('phase retargeting preserves the current pose and the latest destination wins', () => {
  const hub = createHubTransitions(9);
  assert.equal(hub.configure(base, 0), true);
  assert.equal(hub.frame.poseMoving, false);
  assert.equal(hub.configure(toward, 50), true);
  hub.sample(200);
  const time = hub.frame.time;
  assert.ok(time > 0 && time < 9);
  assert.equal(hub.frame.poseMoving, true);
  hub.configure(base, 200);
  assert.equal(hub.frame.time, time);

  for (let i = 0; i < 5; i++) {
    assert.equal(hub.configure(i % 2 === 0 ? toward : base, 210 + 80 * i), true);
  }
  hub.sample(530 + 599);
  assert.notEqual(hub.frame.time, 6);
  assert.equal(hub.frame.poseMoving, true);
  hub.sample(530 + 600);
  assert.equal(hub.frame.time, 6);
  assert.equal(hub.frame.targetPhase, 15);
  assert.equal(hub.frame.poseMoving, false);
  assert.equal(hub.moving, false);
});

test('scrub previews stages 12 and 13 immediately before snapping to the selected pose', () => {
  const hub = createHubTransitions(9);
  hub.configure(base, 0);
  hub.configure(toward, 50);
  hub.sample(200);
  const stage12 = { ...base, phaseSource: 12, phaseTime: 3 };
  const stage13 = { ...base, phaseSource: 13, phaseTime: 4 };
  hub.configure({ ...stage12, phaseTime: 3.12, scrubbing: true }, 201);
  assert.equal(hub.frame.time, 3.12);
  assert.equal(hub.frame.poseMoving, false);
  hub.sample(300);
  assert.equal(hub.frame.time, 3.12);
  hub.configure({ ...stage13, phaseTime: 4.12, scrubbing: true }, 302);
  assert.equal(hub.frame.time, 4.12);
  assert.equal(hub.moving, false);
  hub.configure(stage13, 350);
  assert.equal(hub.frame.time, 4.12);
  hub.sample(950);
  assert.equal(hub.frame.time, 4);
  assert.equal(hub.frame.poseMoving, false);
});

test('the mode crossfade reverses from its current opacity without moving the cameras', () => {
  const hub = createHubTransitions(9);
  hub.configure(base, 0);
  hub.configure(muscle, 10);
  assert.equal(hub.frame.modeMoving, true);
  hub.sample(190);
  assert.equal(hub.frame.mode, .5);
  assert.equal(hub.frame.muscleMoving, false);
  hub.configure(base, 190);
  assert.equal(hub.frame.mode, .5);
  hub.sample(550);
  assert.equal(hub.frame.mode, 0);
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
