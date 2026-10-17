import { phaseTimeline, samplePhase, supportLabel } from './legacy/flare-phase-muscles.js';
import { FLARE_GROUPS } from './legacy/flare-muscle-groups.js';
import { OFFICIAL_FLARE_SEQUENCE } from './legacy/official-poses.js';
import bakedPhases from './v38-phases.json' with { type: 'json' };
import currentPhases from './v42-r16-phases.json' with { type: 'json' };
import v41Phases from './v41-phases.json' with { type: 'json' };
import v41Clock from './v41-clock.json' with { type: 'json' };
import historicalClock from './v38-clock.json' with { type: 'json' };
import { createBakedClock } from './baked-motion.js';

export const GROUPS = Object.fromEntries(FLARE_GROUPS.map(group => [group.groupId, group]));
// Both the paused actor and reference body show the same priority group from
// each teaching section, up to three. Prefer primary over secondary groups.
export function phaseEmphasisItems(items) {
  return ['support', 'core', 'legs'].map(section => items.find(item => GROUPS[item.groupId]?.section === section && item.level === 'primary')
    ?? items.find(item => GROUPS[item.groupId]?.section === section)).filter(Boolean);
}
export const timeline = phaseTimeline(OFFICIAL_FLARE_SEQUENCE, { smooth: true });
export function createPhaseSampler(phases, clock) {
  // Authored keys mark pose centres. Teaching phases change halfway between
  // them, including the final two-segment wrap. Resolve v42's boundaries in
  // sequence time so rounding to a baked frame never switches a label early.
  // The stored frame supplies all group/side/support semantics unchanged.
  const exactTimeline = phases.version?.startsWith('v42') ? { period: clock.period,
    keys: phases.keys.map(key => ({ ...key, time: key.sequenceTime, phase: { id: key.phaseId } })) } : null;
  const phaseFrames = new Map();
  if (exactTimeline) for (const frame of phases.frames) if (!phaseFrames.has(frame.phaseId)) phaseFrames.set(frame.phaseId, frame);
return function sample(time) {
  const last = phases.frames.length - 1;
  let frame = phases.frames[Math.min(last, Math.max(0, Math.round(clock.toWall(time) / clock.duration * last)))];
  const exact = exactTimeline && samplePhase(exactTimeline, Math.min(clock.period, Math.max(0, time))).current.phase.id;
  if (exact && frame.phaseId !== exact) frame = phaseFrames.get(exact);
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
export const phaseAtV41 = createPhaseSampler(v41Phases, createBakedClock(v41Clock));
export const phaseAtV38 = createPhaseSampler(bakedPhases, createBakedClock(historicalClock));
export const phaseTicksV38 = bakedPhases.keys.map(key => ({ phase: key.source, time: key.sequenceTime }));
export const phaseTicksV41 = v41Phases.keys.map(key => ({ phase: key.source, time: key.sequenceTime }));
export const phaseTicks = currentPhases.keys.map(key => ({ phase: key.source, time: key.sequenceTime }));
