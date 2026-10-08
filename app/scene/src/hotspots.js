import { Vector3 } from 'three';

const mid = (a, b) => a.clone().lerp(b, 0.5), lerp = (a, b, t) => a.clone().lerp(b, t);
const other = side => side === 'left' ? 'right' : 'left';
export const ANCHORS = {
  deltoids: (j, s) => lerp(j(s + 'Shoulder'), j(s + 'Elbow'), 0.12),
  'rotator-cuff': (j, s) => lerp(j(s + 'Shoulder'), mid(j('leftShoulder'), j('rightShoulder')), 0.35),
  triceps: (j, s) => lerp(j(s + 'Shoulder'), j(s + 'Elbow'), 0.55),
  forearms: (j, s) => lerp(j(s + 'Elbow'), j(s + 'Wrist'), 0.4),
  serratus: (j, s) => lerp(j(s + 'Shoulder'), j(s + 'Hip'), 0.32),
  scapular: (j, s) => lerp(mid(j('leftShoulder'), j('rightShoulder')), j(s + 'Shoulder'), 0.35),
  chest: (j, s) => lerp(mid(j('leftShoulder'), j('rightShoulder')), j(s + 'Shoulder'), 0.45).add(new Vector3(0, -0.05, 0)),
  lats: (j, s) => lerp(j(s + 'Shoulder'), j(s + 'Hip'), 0.45),
  abs: j => lerp(mid(j('leftShoulder'), j('rightShoulder')), mid(j('leftHip'), j('rightHip')), 0.62),
  obliques: (j, s) => lerp(j(s + 'Shoulder'), j(s + 'Hip'), 0.7),
  erectors: j => lerp(mid(j('leftShoulder'), j('rightShoulder')), mid(j('leftHip'), j('rightHip')), 0.75),
  'hip-flexors': (j, s) => lerp(j(s + 'Hip'), j(s + 'Knee'), 0.08),
  'glute-max': (j, s) => lerp(j(s + 'Hip'), j(other(s) + 'Hip'), 0.2),
  'hip-abductors': (j, s) => lerp(j(s + 'Hip'), j(s + 'Knee'), 0.02),
  adductors: (j, s) => lerp(j(s + 'Hip'), j(s + 'Knee'), 0.35),
  quadriceps: (j, s) => lerp(j(s + 'Hip'), j(s + 'Knee'), 0.55),
  hamstrings: (j, s) => lerp(j(s + 'Hip'), j(s + 'Knee'), 0.6),
};

export function computeHotspots(player, items, minGap = 45) {
  const joints = player.getMetrics().joints, j = name => new Vector3().fromArray(joints[name] ?? joints.pelvis), output = [];
  for (const item of items.filter(value => value.level === 'primary')) {
    const anchor = ANCHORS[item.groupId]; if (!anchor) continue;
    const sides = item.side === 'both' ? ['left', 'right'] : [item.side];
    const candidates = sides.map(side => ({ side, point: anchor(j, side) }));
    candidates.sort((a, b) => a.point.distanceToSquared(player.camera.position) - b.point.distanceToSquared(player.camera.position));
    const candidate = candidates[0], projected = player.project(candidate.point);
    if (projected.behind || projected.x < 12 || projected.y < 12 || projected.x > player.container.clientWidth - 12 || projected.y > player.container.clientHeight - 12) continue;
    if (output.some(hotspot => Math.hypot(hotspot.x - projected.x, hotspot.y - projected.y) < minGap)) continue;
    output.push({ ...projected, groupId: item.groupId, label: item.label, colour: item.colour, side: candidate.side });
  }
  return output;
}
