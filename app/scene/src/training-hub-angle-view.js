import * as THREE from 'three';
import angleBounds from './training-hub-angle-bounds.json' with { type: 'json' };
import { resolveHubAngleCamera } from './training-hub-angle-fit.js';

export function hubViewport(top, height, canvasHeight, clipTop, clipBottom) {
  if (!Number.isFinite(top) || !Number.isFinite(height) || height <= 0) {
    top = 0;
    height = canvasHeight;
  }
  return {
    top, height,
    clipTop: Number.isFinite(clipTop) ? Math.max(top, clipTop) : top,
    clipBottom: Number.isFinite(clipBottom) ? Math.min(top + height, clipBottom) : top + height,
  };
}

export function createHubAngleView(fov, referenceDirection) {
  const camera = new THREE.PerspectiveCamera(fov, 1, .02, 40);
  const target = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  let fit, fitKey, shotKey;

  function frame(width, canvasHeight, viewport, yaw) {
    const nextFitKey = width + ':' + viewport.height;
    if (fitKey !== nextFitKey) {
      fit = resolveHubAngleCamera(angleBounds, { referenceDirection, fov, aspect: width / viewport.height });
      target.fromArray(fit.target);
      fitKey = nextFitKey;
    }
    const nextShotKey = [fitKey, canvasHeight, viewport.top, yaw].join(':');
    if (shotKey !== nextShotKey) {
      direction.copy(fit.direction).applyAxisAngle(up, yaw);
      camera.position.copy(target).addScaledVector(direction, fit.distance);
      camera.lookAt(target);
      // Keep the hub lens and map its viewport onto the fixed canvas.
      camera.setViewOffset(width, viewport.height, 0, -viewport.top, width, canvasHeight);
      camera.updateMatrixWorld(true);
      shotKey = nextShotKey;
    }
  }

  return { camera, target, frame, get distance() { return fit?.distance; } };
}
