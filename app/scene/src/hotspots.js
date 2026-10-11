import { Vector3 } from 'three';
import { phaseEmphasisItems } from './phase.js';

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

const shortNames = { 'hip-abductors': '臀中肌', 'hip-flexors': '髋屈肌群', abs: '腹直肌', 'rotator-cuff': '肩袖肌群', forearms: '前臂肌群', scapular: '肩胛肌群', adductors: '内收肌群' };

export function computeHotspots(player, items, previous = [], depthSampler = null) {
  const joints = player.getMetrics().joints, j = name => new Vector3().fromArray(joints[name] ?? joints.pelvis), output = [];
  // Share the miniature's priority selection so both views name the same groups.
  for (const item of phaseEmphasisItems(items)) {
    const anchor = ANCHORS[item.groupId]; if (!anchor) continue;
    const sides = item.side === 'both' ? ['left', 'right'] : [item.side];
    const candidates = sides.map(side => ({ side, point: anchor(j, side) }));
    candidates.sort((a, b) => a.point.distanceToSquared(player.camera.position) - b.point.distanceToSquared(player.camera.position));
    // Keep the chosen side through small camera movements near the midline.
    // A clearly nearer side can take over; the label still names the group.
    const last = previous.find(value => value.groupId === item.groupId);
    const retained = candidates.find(value => value.side === last?.side);
    const fallback = retained && retained.point.distanceTo(player.camera.position) < candidates[0].point.distanceTo(player.camera.position) + .10 ? retained : candidates[0];
    const sample = depthSampler?.sampleFacing(item.groupId, item.side, last);
    const candidate = sample ?? fallback;
    const projected = player.project(candidate.point);
    output.push({ ...projected, groupId: item.groupId, label: item.label, name: shortNames[item.groupId] ?? item.label,
      colour: item.colour, side: candidate.side, world: candidate.point.toArray(),
      normal: sample?.normal.toArray() ?? [0, 0, 1], candidateKey: sample?.candidateKey,
      depth: sample?.depth ?? 0, far: sample?.far ?? 0, occluded: sample?.occluded ?? false, facing: sample?.facing ?? 1 });
  }
  return output;
}
