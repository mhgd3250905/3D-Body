import { Vector3 } from 'three';

// These are the guide's FlarePlayer clock rules, copied from BodyViewer.
// Only the clock changes; the package's v33 poses and motion core are untouched.
export function computePacing(coach, motion, savedTime = 0) {
  const nodes = ['pelvis', 'leftHand', 'rightHand', 'leftFoot', 'rightFoot']
    .map(name => coach.getObjectByName(name)).filter(Boolean);
  if (nodes.length < 3) return null;
  const period = motion.getMetrics().period, bins = 240, points = [], v = new Vector3();
  for (let i = 0; i <= bins; i++) {
    motion.update(i * period / bins); coach.updateMatrixWorld(true);
    points.push(nodes.map(node => node.getWorldPosition(v).clone()));
  }
  motion.update(savedTime); coach.updateMatrixWorld(true);
  const scaleAt = t => motion.getLoopTimeScale?.(t) ?? 1;
  const speed = [];
  for (let i = 0; i < bins; i++) {
    let d = 0;
    for (let j = 0; j < nodes.length; j++) d += points[i][j].distanceTo(points[i + 1][j]);
    speed.push(d * scaleAt((i + 0.5) * period / bins));
  }
  const smooth = speed.map((_, i) => {
    let sum = 0, weight = 0;
    for (let k = -4; k <= 4; k++) { const w = 5 - Math.abs(k); sum += speed[(i + k + bins) % bins] * w; weight += w; }
    return sum / weight;
  });
  const mean = smooth.reduce((a, b) => a + b, 0) / bins;
  if (!(mean > 0)) return null;
  const raw = smooth.map(value => value < mean * 0.02 ? 25 : Math.min(25, Math.max(0.35, Math.pow(mean / value, 0.8))));
  const cycle = raw.reduce((a, rate, i) => a + 1 / (rate * scaleAt((i + 0.5) * period / bins)), 0) / bins;
  // Keep doubles, as in BodyViewer; no table quantization drift.
  return raw.map(rate => rate * cycle);
}

export function pacingRate(table, motion, time, period = 9) {
  if (!table) return 1;
  const bins = table.length, x = ((time % period + period) % period) / period * bins;
  const i = Math.floor(x) % bins, f = x - Math.floor(x);
  return (table[i] * (1 - f) + table[(i + 1) % bins] * f) * (motion.getLoopTimeScale?.(time) ?? 1);
}

export function paceStep(table, motion, time, delta, speed, period = 9) {
  const sub = 8, step = delta * speed / sub; let advance = 0;
  for (let i = 0; i < sub; i++) advance += step * pacingRate(table, motion, time + advance, period);
  return advance;
}
