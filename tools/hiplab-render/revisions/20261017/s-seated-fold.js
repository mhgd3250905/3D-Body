// Versioned HipLab contact-path revision; frozen source and QA stay intact.
// Original 240-frame QA: the left palm crosses the one-sided shorts hem at
// f31/f197, where the K=6 radial contact reading jumps to 2.05/2.04 mm.
// Keep the slow thigh-to-shin slide, but move the left palm 6 mm medially
// onto the top of its own leg throughout the loop. This changes the surface
// sampling path instead of relaxing the 1.5 mm contact limit or excluding
// clothing/body layers. The right palm, torso/legs, timing and camera stay
// identical. Full-frame QA must validate this candidate before production.
// The original 63 upright wrist-reach warnings are a separate historical
// condition; this minimal contact revision does not hide or suppress them.
import source from '../../../drill-anim/specs/s-seated-fold.js';

const pose = structuredClone(source.pose);
const medialShift = 0.006;
pose.base.hands.left.palmAt[0] -= medialShift;
// Pose deltas contain endpoint values, so shift both endpoints equally.
pose.deltas.hand.hands.left.palmAt[0] -= medialShift;

export default { ...source, pose };
