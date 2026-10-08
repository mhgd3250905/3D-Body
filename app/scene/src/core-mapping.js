import * as THREE from 'three';
import calibration from './core-calibration.json' with { type: 'json' };

export const CORE_BONES = new Set(calibration.limits.coreBones);

// Only atlas coordinates change. Measured waist slices correct the narrow
// Snow torso before its source regions are evaluated, without editing skin,
// bones or the reference mannequin's authored teaching map.
export function createCoreMapping(joints) {
  const hip = new THREE.Vector3().fromArray(joints.leftHip).add(new THREE.Vector3().fromArray(joints.rightHip)).multiplyScalar(0.5);
  const shoulder = new THREE.Vector3().fromArray(joints.shoulderCenter);
  const targetHip = calibration.canonicalAnchors.targetHip;
  const targetShoulder = calibration.canonicalAnchors.targetShoulder;
  const rows = calibration.rows.filter((row, index) => calibration.measurements[index].accepted)
    .map(row => [row[1], row[3] / row[2]]);
  rows.push([targetShoulder[1], calibration.canonicalAnchors.targetLeftShoulder[0] / Math.abs(joints.leftShoulder[0])]);
  return (point, out) => {
    const t = THREE.MathUtils.clamp((point.y - hip.y) / (shoulder.y - hip.y), 0, 1);
    const y = point.y + THREE.MathUtils.lerp(targetHip[1] - hip.y, targetShoulder[1] - shoulder.y, t);
    let scale = rows[0][1];
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i - 1], b = rows[i];
      scale = THREE.MathUtils.lerp(a[1], b[1], THREE.MathUtils.clamp((y - a[0]) / (b[0] - a[0]), 0, 1));
      if (y <= b[0]) break;
    }
    return out.set(point.x * scale, y,
      point.z + THREE.MathUtils.lerp(targetHip[2] - hip.z, targetShoulder[2] - shoulder.z, t));
  };
}
