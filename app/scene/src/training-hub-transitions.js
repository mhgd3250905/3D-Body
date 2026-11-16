import * as THREE from 'three';

export const hubDuration = { pose: 600, camera: 700, highlight: 300, mode: 280 };
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;

export function easeHub(t) {
  return t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function readCamera(raw) {
  if (!raw || ![raw.position, raw.target].every(value =>
    Array.isArray(value) && value.length === 3 && value.every(Number.isFinite)) ||
    !Number.isFinite(raw.fov) || raw.fov < 10 || raw.fov > 70) return null;
  const target = new THREE.Vector3(...raw.target);
  const offset = new THREE.Vector3(...raw.position).sub(target);
  return offset.length() > .1 ? { target, orbit: new THREE.Spherical().setFromVector3(offset), fov: raw.fov } : null;
}

function around(from, to, loop) {
  const delta = to - from;
  if (delta > loop / 2) return delta - loop;
  if (delta < -loop / 2) return delta + loop;
  return delta;
}

function mixCamera(from, to, t) {
  const a = from.orbit, b = to.orbit;
  return {
    target: from.target.clone().lerp(to.target, t),
    orbit: new THREE.Spherical(lerp(a.radius, b.radius, t), lerp(a.phi, b.phi, t),
      a.theta + around(a.theta, b.theta, Math.PI * 2) * t),
    fov: lerp(from.fov, to.fov, t),
  };
}

function sameCamera(a, b) {
  return a.target.equals(b.target) && a.orbit.radius === b.orbit.radius &&
    a.orbit.phi === b.orbit.phi && a.orbit.theta === b.orbit.theta && a.fov === b.fov;
}

function mixGroups(from, to, t) {
  const result = new Map([...from].map(([id, weight]) => [id, weight * (1 - t)]));
  for (const [id, weight] of to) result.set(id, (result.get(id) ?? 0) + weight * t);
  return result;
}

function makeTrack(value, interpolate, duration) {
  let current = value, motion = null;
  return {
    get value() { return current; },
    get moving() { return motion !== null; },
    sample(now) {
      if (!motion) return false;
      const { from, to, start } = motion;
      const t = clamp((now - start) / duration, 0, 1);
      current = t === 1 ? to : interpolate(from, to, easeHub(t));
      if (t === 1) motion = null;
      return true;
    },
    set(to, now, animate) {
      if (animate) motion = { from: current, to, start: now };
      else { motion = null; current = to; }
    },
  };
}

export function createHubTransitions(period) {
  let tracks, config, scrubbing = false;

  function sample(now) {
    if (!tracks) return false;
    let changed = false;
    for (const track of Object.values(tracks)) changed = track.sample(now) || changed;
    return changed;
  }

  function configure(input, now, currentAngleCamera) {
    const angle = readCamera(input.angleCamera), muscle = readCamera(input.muscleCamera);
    if (!angle || !muscle || !Number.isFinite(input.phaseTime)) return false;
    const time = clamp(input.phaseTime, 0, period), mode = input.showMuscles === true ? 1 : 0;
    const groups = new Map([[input.muscleId, 1]]);
    const next = { angle, muscle, time, mode, muscleId: input.muscleId, phase: input.phaseSource };
    const animate = input.animate !== false;
    if (!tracks) {
      tracks = {
        pose: makeTrack(time, (from, to, t) => THREE.MathUtils.euclideanModulo(from + around(from, to, period) * t, period), hubDuration.pose),
        angle: makeTrack(angle, mixCamera, hubDuration.camera),
        muscle: makeTrack(muscle, mixCamera, hubDuration.camera),
        groups: makeTrack(groups, mixGroups, hubDuration.highlight),
        mode: makeTrack(mode, lerp, hubDuration.mode),
        angleScale: makeTrack(1, lerp, hubDuration.mode),
        muscleScale: makeTrack(1, lerp, hubDuration.mode),
      };
    } else {
      sample(now);
      if (input.scrubbing === true) {
        tracks.pose.set(time, now, false);
        if (!scrubbing) tracks.angle.set(currentAngleCamera ?? tracks.angle.value, now, false);
      } else {
        if (scrubbing || config.time !== time) tracks.pose.set(time, now, animate && tracks.pose.value !== time);
        if (scrubbing || !sameCamera(config.angle, angle)) tracks.angle.set(angle, now, animate);
      }
      if (!sameCamera(config.muscle, muscle)) tracks.muscle.set(muscle, now, animate);
      if (config.muscleId !== next.muscleId) tracks.groups.set(groups, now, animate);
      if (config.mode !== mode) {
        const incoming = mode ? tracks.muscleScale : tracks.angleScale;
        if (animate && (mode ? tracks.mode.value === 0 : tracks.mode.value === 1)) incoming.set(.96, now, false);
        incoming.set(1, now, animate);
        tracks.mode.set(mode, now, animate);
      }
    }
    scrubbing = input.scrubbing === true;
    config = next;
    return true;
  }

  return {
    configure,
    sample,
    get moving() { return !!tracks && Object.values(tracks).some(track => track.moving); },
    get frame() {
      return tracks && {
        time: tracks.pose.value,
        angle: tracks.angle.value,
        muscle: tracks.muscle.value,
        groups: tracks.groups.value,
        mode: tracks.mode.value,
        angleScale: tracks.angleScale.value,
        muscleScale: tracks.muscleScale.value,
        targetPhase: config.phase,
        targetMuscle: config.muscleId,
        targetMode: config.mode,
        scrubbing,
      };
    },
  };
}
