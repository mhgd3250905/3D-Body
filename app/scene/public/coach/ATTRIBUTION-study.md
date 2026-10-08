# Historical Flare Snow white muscle study derivative

**Snow Rig © Blender Foundation | studio.blender.org**

Source: [Snow, Blender Studio](https://studio.blender.org/characters/snow/).
License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).

This white study derivative is retained as a historical editable asset. The
current app does not load or attach its body/head GLBs. Thomas now keeps the
original tee, shorts, face and material identities at every viewing angle,
without any muscle color overlay. The default large
action view, small upright reference and card swap remain.

Previously modified locally for a selected-muscle warm ivory matte-ceramic display. This derivative
uses the same mature Snow skin, original prepared hand and foot surfaces,
footwear and compact 20-bone deformation rig as the project's clothed coach.
The skin beneath the tee and shorts is restored instead of exposing the
clothed export's trimmed skin. The navel and central front groin are locally
smoothed. The head is sculpted from the same authored face, bare skull, ears
and neck into a soft featureless mannequin: facial relief is removed, openings
are closed, and the source surfaces are locally voxel welded, smoothed and
decimated. Separate eyes, brows, hair, teeth, gums and tongue are excluded from
the study display. Neck surfaces and weights are prepared to meet the body.
No geometric primitive body or replacement head asset is used.

The normal clothed coach and face remained unchanged. The historical study
display selected its separate body/head and restored the normal actor on
clearing selection or playback. Its parts reused the existing deform bones with their own
source inverse bind matrices and bind matrices; the supplied v33 action and
timing are preserved. Functional colors are teaching locations, not internal
anatomical geometry or muscle activation measurements. The independent CC0
upright mannequin is not part of this Snow derivative.

The current clothed actor retains its original materials and shows the same
paused action frame without muscle highlights, outlines or patterns. The
historical Thomas soft-edge overlay shader prototype is retained as source
but is not used by the current display. Only the upright muscle reference
shows the current group in pale red in a specific detail; other phase color
fills are hidden there. The unselected
home front/back map retains the original phase teaching colors. The independent
upright mannequin keeps its original fine divisions and marks selection in
pale red with a gentle outer shadow. Source region definitions, scoring,
action and the original deform bones remain unchanged. Deep regions remain
teaching locations rather than actual internal anatomy.

The action surface's relative teaching coordinates are calibrated from actual
triangle cross sections and the existing hip/shoulder anchors to accommodate
Snow's narrower waist. The current Thomas display uses these approximate
`mmRest` teaching coordinates only for click hit testing, not surface coloring.
Only core-weighted coordinates change. Geometry, normals,
neck/head and the original bones are retained, and body thickness is not
scaled. The static reference retains its original map and hit testing. This
is relative surface placement, not exact anatomical registration or separate
real muscle geometry. Reproduce and check through `npm run calibrate:muscles`
and `npm run verify:muscles` in `app/scene`; metadata is in
`app/scene/src/core-calibration.json`.
The offline `RoomEnvironment` is retained without additional downloads. The
historical white ceramic material and edited bare skin/head are not used by
the current display. The upright mannequin retains its own materials.

Retained original source at the repository root:
`assets/blender-studio-source/snow-rig-v4/Snow/snow_v4.2.blend`.
Editable derivative: `assets/coach/flare-coach-study.blend`.
Reproduction: `tools/blender/build_coach_study.py` and its local helpers, then
`npm run optimize:study` in `app/scene`.
The body/head gzip GLBs are lossless encodings of the completed Blender
exports; this compression does not undo or conceal the deliberate sculpting,
remeshing and head decimation. Exact file records are in
`app/scene/tools/study-body-optimization.json`.

Made locally in Blender using retained free source assets. No purchases,
subscriptions, paid plugins or paid generation services.
