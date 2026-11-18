import { Box3, Vector3 } from 'three';
import { createBakedClock } from '../baked-motion.js';

// The lesson retains the saved 0–9 clock and its eight angle markers. Match
// the V5 transfer and support keyframes without changing stored positions.
const phaseFrames = [0, 20, 41, 62, 81, 101, 121, 142];

export function createV5TeachingMotion(stage) {
  const clock = createBakedClock({
    frameTimes: [...phaseFrames.map(frame => frame / stage.fps), stage.period],
    sequenceTime: [0, 1, 2, 3, 4, 5, 6, 7, 9],
  });
  const landmarks = {
    pelvis: ['pelvis'], torso: ['torso'], shoulderCenter: ['torso'],
    neck: ['neck'], head: ['head'],
  };
  for (const side of ['left', 'right']) {
    const sign = side === 'left' ? 1 : -1;
    Object.assign(landmarks, {
      [side + 'Shoulder']: [side + 'UpperArm'], [side + 'Elbow']: [side + 'Forearm'],
      [side + 'Wrist']: [side + 'Hand'], [side + 'Palm']: [side + 'Hand', [sign * .06, -.01, 0]],
      [side + 'Hip']: [side + 'Thigh'], [side + 'Knee']: [side + 'Shin'],
      [side + 'Ankle']: [side + 'Foot'], [side + 'Toe']: [side + 'Foot', [0, -.035, .16]],
    });
  }
  const bounds = new Box3();
  let time = 0, hulls, metrics;
  function clearMeasurements() { hulls = metrics = null; }
  function getBodyHulls() { return hulls ??= stage.getBodyHulls(); }
  function getMetrics() {
    if (metrics) return metrics;
    bounds.makeEmpty();
    for (const hull of getBodyHulls()) for (const point of hull) bounds.expandByPoint(point);
    const joints = Object.fromEntries(Object.entries(landmarks).map(([name, args]) => [name, stage.joint(...args)]));
    joints.waist = new Vector3().fromArray(joints.pelvis).lerp(new Vector3().fromArray(joints.torso), .3).toArray();
    return metrics = {
      time, period: clock.period, joints, bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
      neutralHeight: 1.69, motionVersion: 'flare-v5', wallTime: clock.toWall(time), clipDuration: stage.period,
    };
  }
  return {
    clock, getMetrics, getBodyHulls,
    reset() { stage.resetPose(); clearMeasurements(); },
    update(value) {
      time = value;
      stage.setProgress(clock.toWall(time) / stage.period);
      clearMeasurements();
    },
    dispose() { stage.dispose(); },
  };
}
