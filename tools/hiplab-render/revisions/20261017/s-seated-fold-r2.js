// HipLab contact-path revision r2; retain frozen source, r1 and original QA.
// The 6 mm medial shift in r1 reduced the f31/f197 hem gap from 2.05/2.04
// to <=1.66 mm but still missed the original 1.5 mm contact limit.
// Move the same left-palm slide 12 mm medially, staying on its own leg's
// upper surface. Keep the right hand and all body, timing/camera and QA
// parameters unchanged. Upright wrist-reach warnings remain observable.
import source from '../../../drill-anim/specs/s-seated-fold.js';

const pose = structuredClone(source.pose);
pose.base.hands.left.palmAt[0] -= 0.012;
pose.deltas.hand.hands.left.palmAt[0] -= 0.012;
export default { ...source, pose };
