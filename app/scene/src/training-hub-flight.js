import * as THREE from 'three';
import { createHubAngleView, hubViewport } from './training-hub-angle-view.js';
import { easeHub } from './training-hub-transitions.js';

// Convert the lens and view offset to the full canvas for interpolation.
// Exact endpoints copy their cameras, including the projection matrices.
function canvasProjection(camera, width, height) {
  const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.zoom;
  const view = camera.view?.enabled ? camera.view : null;
  const fullHeight = view?.fullHeight ?? height;
  return {
    tangent: tangent * height / fullHeight,
    x: (view?.offsetX ?? 0) + (width - (view?.fullWidth ?? width)) / 2,
    y: (view?.offsetY ?? 0) + (height - fullHeight) / 2,
  };
}

export function createHubFlight(player, input, referenceDirection, onLanded, onPrepared) {
  const { clientHeight: height, clientWidth: width } = player.container;
  if (!(height > 0 && width > 0 && input.height > 0) ||
      ![input.height, input.top, input.time, input.duration].every(Number.isFinite)) return null;

  const homeCamera = player.camera.clone();
  const camera = homeCamera.clone();
  const startTarget = player.controls.target.clone();
  const startOrbit = new THREE.Spherical().setFromVector3(homeCamera.position.clone().sub(startTarget));
  const source = canvasProjection(homeCamera, width, height);
  const angleView = createHubAngleView(player.baseFov, referenceDirection);
  const returnFrame = input.returning ? player.trainingHub?.getActorFrame() : null;
  const shotViewport = returnFrame?.viewport ?? input;
  const viewport = hubViewport(shotViewport.top, shotViewport.height, height, shotViewport.clipTop, shotViewport.clipBottom);
  const hubCamera = returnFrame?.camera ?? angleView.camera;
  const hubTarget = returnFrame?.target ?? angleView.target;
  const target = new THREE.Vector3(), orbit = new THREE.Spherical(), hubOrbit = new THREE.Spherical();
  const homeTime = player.time;
  const hubTime = returnFrame?.time ?? input.time;
  const period = player.period;
  const path = THREE.MathUtils.euclideanModulo(hubTime - homeTime + period / 2, period) - period / 2;
  const lerp = THREE.MathUtils.lerp;
  const homeTop = player.viewTop ?? 0;
  const homeBottom = player.viewInset ?? 0;
  const hubBottom = Math.max(0, height - viewport.clipBottom);
  let yaw = Number.isFinite(input.yaw) ? input.yaw : 0;
  let duration = Math.max(0, input.duration);
  let returning = input.returning === true;
  let from = returning ? 1 : 0, to = returning ? 0 : 1, progress = from;
  let departureFrames = 0, landingFrames = 0;
  let start = null, landed = false, reported = false;
  let angleDirty = false;
  let poseTime = homeTime, positionInHub = from;

  return {
    camera, angleView, viewport,
    pixelRatio: input.pixelRatio,
    get returning() { return returning; },
    get poseTime() { return poseTime; },
    get topInset() { return Math.max(0, lerp(homeTop, viewport.clipTop, positionInHub)); },
    get bottomInset() { return lerp(homeBottom, hubBottom, positionInHub); },
    get landed() { return landed; },
    setAngleYaw(value) {
      if (returning || !Number.isFinite(value) || yaw === value) return false;
      yaw = value;
      angleDirty = true;
      return true;
    },
    reverse(onReturned) {
      if (returning) return false;
      returning = true;
      from = progress;
      to = 0;
      duration *= progress;
      start = null;
      landed = reported = false;
      landingFrames = 0;
      onLanded = onReturned;
      return true;
    },
    sample(now) {
      if (landed && !angleDirty) return landingFrames < 2;
      angleDirty = false;
      const holdingDeparture = input.returning && departureFrames < 2;
      if (start == null || holdingDeparture) start = now;
      // Keep the last hub shot while Flutter reveals the return flight.
      const elapsed = holdingDeparture ? 0 : duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      progress = lerp(from, to, elapsed);
      const t = easeHub(progress);
      positionInHub = t;
      if (!returnFrame) angleView.frame(width, height, viewport, yaw);
      if (t === 0 || t === 1) {
        camera.copy(t === 0 ? homeCamera : hubCamera);
      } else {
        target.copy(startTarget).lerp(hubTarget, t);
        hubOrbit.setFromVector3(hubCamera.position.clone().sub(hubTarget));
        const rotation = THREE.MathUtils.euclideanModulo(hubOrbit.theta - startOrbit.theta + Math.PI, Math.PI * 2) - Math.PI;
        orbit.set(lerp(startOrbit.radius, hubOrbit.radius, t), lerp(startOrbit.phi, hubOrbit.phi, t), startOrbit.theta + rotation * t);
        camera.position.setFromSpherical(orbit).add(target);
        camera.lookAt(target);
        const projection = canvasProjection(hubCamera, width, height);
        camera.zoom = 1;
        camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(lerp(source.tangent, projection.tangent, t)));
        camera.setViewOffset(width, height, lerp(source.x, projection.x, t), lerp(source.y, projection.y, t), width, height);
      }
      camera.updateMatrixWorld(true);
      poseTime = t === 0 ? homeTime : t === 1 ? hubTime : path === 0 ? homeTime
        : THREE.MathUtils.euclideanModulo(homeTime + path * t, period);
      player.motion.update(poseTime);
      landed = elapsed === 1;
      return true;
    },
    rendered() {
      if (input.returning && departureFrames < 2 && ++departureFrames === 1) onPrepared?.();
      if (!landed || reported || ++landingFrames < 2) return;
      reported = true;
      onLanded();
    },
    restore() {
      if (!player.trainingHub) player.motion.update(player.time);
    },
  };
}
