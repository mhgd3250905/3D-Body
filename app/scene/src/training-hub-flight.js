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
  const { clientHeight: height, clientWidth: width } = player.container;
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
  if (Number.isFinite(input.yaw)) destOrbit.theta += input.yaw;
  const rotation = THREE.MathUtils.euclideanModulo(destOrbit.theta - startOrbit.theta + Math.PI, Math.PI * 2) - Math.PI;
  const sourceTangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const sourceX = camera.view?.enabled ? camera.view.offsetX : 0;
  const sourceY = camera.view?.enabled ? camera.view.offsetY : 0;
  const projection = hubFlightProjection(player.baseFov, height, input.top, input.height);
  const target = new THREE.Vector3(), orbit = new THREE.Spherical();
  const homeTime = player.time;
  const period = player.period;
  const path = THREE.MathUtils.euclideanModulo(input.time - homeTime + period / 2, period) - period / 2;
  const duration = Math.max(1, input.duration);
  const lerp = THREE.MathUtils.lerp;
  const returning = input.returning === true;
  let holding = returning, prepared = false;
  let start = null, landed = false, reported = false;
  let poseTime = homeTime, positionInHub = 0;
  const hubTop = Math.max(0, input.top);
  const hubBottomInset = Math.max(0, height - input.top - input.height);

  return {
    camera,
    returning,
    landingTime: input.time,
    landingBottomInset: Math.max(32, height - input.top - input.height + 32),
    get poseTime() { return poseTime; },
    get topInset() { return positionInHub * hubTop; },
    get bottomInset() { return lerp(player.viewInset ?? 0, hubBottomInset, positionInHub); },
    get holding() { return holding; },
    get landed() { return landed; },
    resume() { holding = false; },
    sample(now) {
      if (landed || (holding && prepared)) return false;
      if (!holding) start ??= now;
      const elapsed = holding ? 0 : Math.min(1, (now - start) / duration);
      const progress = returning ? 1 - elapsed : elapsed;
      const t = easeHub(progress);
      positionInHub = t;
      target.copy(startTarget).lerp(destTarget, t);
      orbit.set(
        lerp(startOrbit.radius, destOrbit.radius, t),
        lerp(startOrbit.phi, destOrbit.phi, t),
        startOrbit.theta + rotation * t,
      );
      camera.position.setFromSpherical(orbit).add(target);
      camera.lookAt(target);
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(lerp(sourceTangent, projection.tangent, t)));
      camera.setViewOffset(width, height, lerp(sourceX, projection.x, t), lerp(sourceY, projection.y, t), width, height);
      camera.updateMatrixWorld(true);
      poseTime = t === 0 || path === 0 ? homeTime : t === 1 ? input.time
        : THREE.MathUtils.euclideanModulo(homeTime + path * t, period);
      player.motion.update(poseTime);
      landed = elapsed === 1;
      return true;
    },
    rendered() {
      if (holding && !prepared) {
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
