# R12 candidate 01 — enlarged bilateral visual review

2026-10-15. Training SHA-256 independently checked: `188767d3219851b1faa751d81c4dce029c3d9fb7b693d5ad627ce646c469c2c8`. Runtime sources were verified as left R11 and right R12. Review only; no production source or motion file was changed.

## Conclusion

In the enlarged sampled sequence, the corrected right wrist/forearm does not read as a separate little outward flick before continuing down. The correction is visually small and leaves the overall accepted movement recognizably the same. No new shoulder jump, forearm flip or palm turn discontinuity was observed. This is consistent with a narrow local correction, without asserting that screenshots independently measure the reported millimeter reduction.

The corresponding left .36–.42 sequence was also checked. The two panels retain the same visible movement and I did not observe an equivalent outward-return gesture requiring a mirrored change. Later right .90/.95 poses remain visually aligned with the accepted R11 result. No new focused visual blocker is raised.

## Diagnostic photography and playback

Independent browser only. Both cameras retained the recommended view position/target but used FOV 18 degrees instead of the page's default 34, giving a closer rendered view of the arm/shoulder. This is a diagnostic camera change in that temporary page's memory, not a production edit. The full-body composition is consequently clipped in some frames; the arm region under inspection remains visible. Later side/back camera positions were selected with the same FOV.

Actual running-playback recommended-view samples used diagnostic 70 seconds/circle. Right phases: .830714, .836846, .843046, .850853, .855854, .861746, .867056, .872337, .877446, .881590, .886543, .892433. Left phases: .360419, .366499, .373056, .377554, .384304, .389721, .395733, .400829, .407210, .412629, .418114, .424471. No manual seeks occurred between samples within either window. Render counters advanced through both sequences.

Additional enlarged side/back stills at .395, .848, .86, .88, .90 and .95 were taken after two render frames. The left sequence and representative right frames were reopened at full screenshot size; the shoulder/forearm region was also inspected in the side/back stills.

## Observations

The right-hand screen position still moves sideways as the torso turns and the arm opens. That is not itself evidence that the local unwanted excursion remains: screen movement combines the entire pose and camera projection. Across the close sequence I do not see a detached lateral jab followed by an obvious corrective return. The apparent difference between R11 and R12 is subtle, so the local-coordinate audit provides stronger evidence of its magnitude than these pixels.

Both shoulders retain coherent contours in the inspected views; the correction has not visibly traded the small wrist issue for a shoulder distortion. Palm orientation develops continuously rather than showing a new snap. On the left, forearm opening and the hand's approach continue without a visibly separate outward detour. There is no visual basis here to request an automatic symmetric edit.

The supplied audit's reduction from 6.53 mm to .357 mm and preserved opening/contact paths are not independently measured by this reviewer. This report deliberately separates that numeric evidence from the actual visual observation.

## Artifacts and limitations

All reviewer artifacts are in `output/playwright/flare-v42-r12-reference-20261015/`: `c01-zoom.png`, `c01-zoom-live-0.83-*.png`, `c01-zoom-live-0.36-*.png`, `c01-{side,back}-*.png`, `zoom.js`, `c01-live.js`, `c01-check.js`. Prior `r11-*` diagnostic files remain distinct.

Training body only was independently viewed. Slow sampled playback cannot establish perfect fluent-speed smoothness or absence of every very short event. The new correction is small enough that complete elimination should not be claimed from pixels alone; use the independent local-coordinate audit plus user observation. No new human-reference browsing or exact human movement measurement was performed.
