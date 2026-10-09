import { phaseTimeline, supportLabel } from './legacy/flare-phase-muscles.js';
import { FLARE_GROUPS } from './legacy/flare-muscle-groups.js';
import { OFFICIAL_FLARE_SEQUENCE } from './legacy/official-poses.js';
import bakedPhases from './v38-phases.json' with { type: 'json' };
import { createBakedClock } from './baked-motion.js';

export const GROUPS = Object.fromEntries(FLARE_GROUPS.map(group => [group.groupId, group]));
export const timeline = phaseTimeline(OFFICIAL_FLARE_SEQUENCE, { smooth: true });
const clock = createBakedClock();
export function phaseAt(time) {
  const frame = bakedPhases.frames[Math.min(539, Math.round(clock.toWall(time) / clock.duration * 539))];
  const definition = bakedPhases.phaseDefs[frame.phaseId];
  return {
    source: frame.phaseSource, id: frame.phaseId, name: definition.name,
    caption: definition.caption, support: frame.support, supportText: supportLabel(frame.support),
    items: ['primary', 'secondary'].flatMap(level => frame[level].map(item => ({ groupId: item.id, side: item.side,
      level, colour: GROUPS[item.id].colour, label: GROUPS[item.id].label }))),
  };
}
export const phaseTicks = bakedPhases.keys.map(key => ({ phase: key.source, time: key.sequenceTime }));
