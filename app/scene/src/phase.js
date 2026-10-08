import { phaseTimeline, samplePhase, phaseItems, supportLabel } from './legacy/flare-phase-muscles.js';
import { FLARE_GROUPS } from './legacy/flare-muscle-groups.js';
import { OFFICIAL_FLARE_SEQUENCE } from './legacy/official-poses.js';

export const GROUPS = Object.fromEntries(FLARE_GROUPS.map(group => [group.groupId, group]));
export const timeline = phaseTimeline(OFFICIAL_FLARE_SEQUENCE, { smooth: true });
export function phaseAt(time) {
  const sampled = samplePhase(timeline, time, 0.16), key = sampled.current;
  return {
    source: key.phase.source, id: key.phase.id, name: key.phase.name,
    caption: key.phase.caption, support: key.support, supportText: supportLabel(key.support),
    items: phaseItems(key.phase, key.support).map(item => ({ ...item, colour: GROUPS[item.groupId].colour, label: GROUPS[item.groupId].label })),
  };
}
export const phaseTicks = timeline.keys.map(key => ({ phase: key.phase.source, time: key.time }));
