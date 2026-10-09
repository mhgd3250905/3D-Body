import { phaseTimeline, supportLabel } from './legacy/flare-phase-muscles.js';
import { FLARE_GROUPS } from './legacy/flare-muscle-groups.js';
import { OFFICIAL_FLARE_SEQUENCE } from './legacy/official-poses.js';
import bakedPhases from './v38-phases.json' with { type: 'json' };
import currentPhases from './v41-phases.json' with { type: 'json' };
import historicalClock from './v38-clock.json' with { type: 'json' };
import { createBakedClock } from './baked-motion.js';

export const GROUPS = Object.fromEntries(FLARE_GROUPS.map(group => [group.groupId, group]));
export const timeline = phaseTimeline(OFFICIAL_FLARE_SEQUENCE, { smooth: true });
export function createPhaseSampler(phases, clock) {
return function sample(time) {
  const last = phases.frames.length - 1;
  const frame = phases.frames[Math.min(last, Math.max(0, Math.round(clock.toWall(time) / clock.duration * last)))];
  const definition = phases.phaseDefs[frame.phaseId];
  return {
    source: frame.phaseSource, id: frame.phaseId, name: definition.name,
    caption: definition.caption, support: frame.support, supportText: supportLabel(frame.support),
    items: ['primary', 'secondary'].flatMap(level => frame[level].map(item => ({ groupId: item.id, side: item.side,
      level, colour: GROUPS[item.id].colour, label: GROUPS[item.id].label }))),
  };
};
}
export const phaseAt = createPhaseSampler(currentPhases, createBakedClock());
export const phaseAtV38 = createPhaseSampler(bakedPhases, createBakedClock(historicalClock));
export const phaseTicksV38 = bakedPhases.keys.map(key => ({ phase: key.source, time: key.sequenceTime }));
export const phaseTicks = currentPhases.keys.map(key => ({ phase: key.source, time: key.sequenceTime }));
