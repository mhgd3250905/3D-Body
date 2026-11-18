import * as THREE from 'three';
import angleBounds from './training-hub-angle-bounds.json' with { type: 'json' };
import { resolveHubAngleCamera } from './training-hub-angle-fit.js';
import { easeHub } from './training-hub-transitions.js';

// Express the smaller destination viewport in the original canvas's pixels.
// Both cameras then project the landing pose onto the same screen coordinates.
export function hubFlightProjection(fov, height, destinationTop, destinationHeight) {
  const tangent = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  return {
    tangent: tangent * height / destinationHeight,
    x: 0,
    y: (height - destinationHeight) / 2 - destinationTop,
  };
}

export function createHubFlight(player, input, referenceDirection, onLanded, onPrepared) {
  const { clientHeight: currentHeight, clientWidth: width } = player.container;
  const returningInHub = input.returning === true && Number.isFinite(input.homeHeight) && input.homeHeight > 0;
  const height = returningInHub ? input.homeHeight : currentHeight;
  if (!(height > 0 && width > 0 && input.height > 0) ||
      ![input.height, input.top, input.time, input.duration].every(Number.isFinite)) return null;

  const camera = player.camera.clone();
  const startTarget = player.controls.target.clone();
  const startOrbit = new THREE.Spherical().setFromVector3(camera.position.clone().sub(startTarget));
  const dest = resolveHubAngleCamera(angleBounds, {
    referenceDirection, fov: player.baseFov, aspect: width / input.height,
  });
  const destTarget = new THREE.Vector3(...dest.target);
  const destOrbit = new THREE.Spherical().setFromVector3(dest.direction.clone().multiplyScalar(dest.distance));
  let yaw = Number.isFinite(input.yaw) ? input.yaw : 0;
  const homeVisible = Math.max(1, height - (player.viewInset ?? 0));
  const sourceTangent = returningInHub
    ? Math.tan(THREE.MathUtils.degToRad(player.baseFov / 2)) * height / homeVisible
    : Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const sourceX = camera.view?.enabled ? camera.view.offsetX : 0;
  const sourceY = returningInHub ? homeVisible * (player.viewBias?.y ?? 0) + (height - homeVisible) / 2
    : camera.view?.enabled ? camera.view.offsetY : 0;
  const projection = hubFlightProjection(player.baseFov, height, input.top, input.height);
  const target = new THREE.Vector3(), orbit = new THREE.Spherical();
  const homeTime = player.time;
  const period = player.period;
  const path = THREE.MathUtils.euclideanModulo(input.time - homeTime + period / 2, period) - period / 2;
  const lerp = THREE.MathUtils.lerp;
  let duration = Math.max(0, input.duration);
  let returning = input.returning === true;
  let from = returning ? 1 : 0, to = returning ? 0 : 1, progress = from;
  let prepared = false;
  let start = null, landed = false, reported = false;
  let angleDirty = false;
  let poseTime = homeTime, positionInHub = 0;
  const hubTop = Math.max(0, input.top);
  const hubBottomInset = Math.max(0, height - input.top - input.height);
  const viewportTop = () => returningInHub &&
    Math.abs(player.container.clientHeight - input.height) < Math.abs(player.container.clientHeight - height) ? input.top : 0;

  return {
    camera,
    pixelRatio: input.pixelRatio,
    get returning() { return returning; },
    landingTime: input.time,
    destinationTop: input.top,
    destinationHeight: input.height,
    get poseTime() { return poseTime; },
    get viewportTop() { return viewportTop(); },
    get topInset() { return Math.max(0, positionInHub * hubTop - viewportTop()); },
    get bottomInset() {
      return Math.max(0, viewportTop() + player.container.clientHeight - height +
        lerp(player.viewInset ?? 0, hubBottomInset, positionInHub));
    },
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
      onLanded = onReturned;
      return true;
    },
    sample(now) {
      if (landed && !angleDirty) return false;
      angleDirty = false;
      start ??= now;
      const elapsed = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      progress = lerp(from, to, elapsed);
      const t = easeHub(progress);
      positionInHub = t;
      target.copy(startTarget).lerp(destTarget, t);
      const rotation = THREE.MathUtils.euclideanModulo(destOrbit.theta + yaw - startOrbit.theta + Math.PI, Math.PI * 2) - Math.PI;
      orbit.set(
        lerp(startOrbit.radius, destOrbit.radius, t),
        lerp(startOrbit.phi, destOrbit.phi, t),
        startOrbit.theta + rotation * t,
      );
      camera.position.setFromSpherical(orbit).add(target);
      camera.lookAt(target);
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(lerp(sourceTangent, projection.tangent, t)));
      camera.setViewOffset(width, height, lerp(sourceX, projection.x, t),
        lerp(sourceY, projection.y, t) + viewportTop(), width, player.container.clientHeight);
      camera.updateMatrixWorld(true);
      poseTime = t === 0 || path === 0 ? homeTime : t === 1 ? input.time
        : THREE.MathUtils.euclideanModulo(homeTime + path * t, period);
      player.motion.update(poseTime);
      landed = elapsed === 1;
      return true;
    },
    rendered() {
      if (input.returning && !prepared) {
        prepared = true;
        onPrepared?.();
      }
      if (!landed || reported) return;
      reported = true;
      onLanded();
    },
    restore() {
      player.motion.update(player.time);
    },
  };
}
