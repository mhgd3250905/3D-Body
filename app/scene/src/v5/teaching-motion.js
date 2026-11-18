import { Box3, Vector3 } from 'three';
import { createBakedClock } from '../baked-motion.js';
import { phaseTicks } from '../phase.js';

// Corresponding V5 poses for the eight authored teaching markers.
const phaseFrames = [0, 20, 41, 62, 81, 101, 121, 142];

export function createV5TeachingMotion(stage) {
  const clock = createBakedClock();
  const wallTimes = [...phaseTicks.map(tick => clock.toWall(tick.time)), clock.duration];
  const progress = [...phaseFrames.map(frame => frame / (stage.period * stage.fps)), 1];
  const intervals = wallTimes.slice(1).map((wall, i) => wall - wallTimes[i]);
  const speeds = intervals.map((span, i) => (progress[i + 1] - progress[i]) / span);
  // Monotone Hermite interpolation aligns the two sets of markers without
  // changing playback cadence abruptly at a marker or at the loop seam.
  const tangents = speeds.map((speed, i) => {
    const previous = (i + speeds.length - 1) % speeds.length;
    const left = intervals[previous], right = intervals[i];
    const w1 = 2 * right + left, w2 = right + 2 * left;
    return (w1 + w2) / (w1 / speeds[previous] + w2 / speed);
  });
  tangents.push(tangents[0]);

  function progressAt(wall) {
    let i = wallTimes.findIndex(time => time > wall) - 1;
    if (i < 0) i = intervals.length - 1;
    const span = intervals[i];
    const u = (wall - wallTimes[i]) / span;
    const u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * progress[i] + (u3 - 2 * u2 + u) * span * tangents[i] +
      (-2 * u3 + 3 * u2) * progress[i + 1] + (u3 - u2) * span * tangents[i + 1];
  }

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
      stage.setProgress(progressAt(clock.toWall(time)));
      clearMeasurements();
    },
    dispose() { stage.dispose(); },
  };
}
