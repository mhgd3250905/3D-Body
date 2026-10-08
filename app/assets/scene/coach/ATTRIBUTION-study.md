# Flare Snow white muscle study derivative

**Snow Rig © Blender Foundation | studio.blender.org**

Source: [Snow, Blender Studio](https://studio.blender.org/characters/snow/).
License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).

Modified locally for the selected-muscle warm ivory matte-ceramic study display. This derivative
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

The normal clothed coach and face remain unchanged. Runtime selection shows
the study body/head, and clearing selection or playing restores the normal
actor. The study parts use the existing named deform bones with their own
source inverse bind matrices and bind matrices; the supplied v33 action and
timing are preserved. Functional colors are teaching locations, not internal
anatomical geometry or muscle activation measurements. The independent CC0
upright mannequin is not part of this Snow derivative.

The selected runtime surface uses a soft nonmetallic warm ivory matte-ceramic
base with subdued glaze reflection and readable functional highlight colors. It reuses the
project's offline `RoomEnvironment` without additional downloaded materials.
The normal clothed actor and the upright mannequin retain their own materials.
This runtime presentation is separate from the editable Blender skin/head
derivative.

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
