# Flare Friendly Coach

**Snow Rig © Blender Foundation | studio.blender.org**

Source: [Snow, Blender Studio](https://studio.blender.org/characters/snow/).
License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).

Modified for this project: matte skin and hazel eyes, light grey matte training tee with grey cuffs, plain black matte shorts made from the original trousers, white sneakers, a gentle facial expression, an ordinary dark brown short buzzcut, and a compact 20-bone deformation rig for Three.js. The buzzcut reuses the original continuous scalp surface, with the curls and bun removed and a small outward offset to cover the scalp. Original professional surfaces and body weights were reused. Source file and production rig are preserved in assets/blender-studio-source/snow-rig-v4/Snow/snow_v4.2.blend.

The original closed foot and ankle skin is fitted inside the sneakers, with locally smoothed Shin / Foot weights to keep the collar connected. The original shoe surfaces are retained. Fingers are gently opened using the original finger pivots and weights; the natural palm arch, pads and thickness are retained. A shared palm translation with a short wrist transition preserves the previous contact offset without projecting the skin onto a plane. Forearm / Hand weights blend locally around the wrist joint. Shorts are continuously widened across the midline, with a local pelvis-weight transition at the central gusset. All 20 joint names, order and rest pivots are retained, so saved poses remain editable. Hand and foot directions remain editable.

The current formal demonstration preserves the user's authored poses from 托马斯/16.json in the order 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 9. Its final keyframe repeats the same original step 9. Positions, hand and foot orientations, and support locks retain their saved values. The earlier five-pose export and mirrored 4, 3, 2, 1 continuation belong to the previous demonstration.

A local revision upgrade independently backs up the previous formal demonstration without changing the personal pose library or draft. Personal poses are adopted explicitly through “Use for demonstration”: a library with at least 16 steps matches the formal source step IDs when available, otherwise selects entries 9–16 and repeats entry 9; a complete nine-step library can also be published in list order. A matching personal library is not automatically promoted over the current formal demonstration.

The Flare demonstration replays the user's authored key poses, with interpolated transitions rather than motion capture. BodyParts3D muscles are shown separately as an anatomical reference; they are not anatomically registered inside this cartoon character. See /anatomy/ATTRIBUTION.md for the independent anatomy license.

Made locally in Blender 4.5.3 LTS. No purchased assets, subscriptions, plugins, or paid generation services.

The startup loading silhouette is a transparent, single-colour offline render of this same character and the v41 baked Flare loop. Materials are flattened only in the loading render; the interactive character and animation remain unchanged. See app/tools/render-flare-loading.* and the accompanying asset metadata for reproduction.

On 2026-10-15 the App and bundled web default additionally adopt the user-accepted Flare v42 / R12 motion (source commit fc91c7f4cf95b77db4f0d79c74ad865bedcc6f96). The two existing dressed bodies retain their geometry, materials and weights; only the animation is replaced in separately named assets. The new flare-loading-v42-r12 silhouette renders that same baked R12 clip. The original v41 assets and silhouette remain available as history. Source identity and lossless runtime encoding are recorded in app/scene/tools/v42-r12-source-manifest.json.

The App logo selected on 2026-10-11 is the teal-shirt new-angle B image, app/assets/brand/icon-flare-angle2-b.png. Its production started from an actual render of this project's v41 character. The final pose and camera reference is the user's project-model screenshot, output/imagegen/flare-logo-20261011/user-pose-angle-2.png. The logo is an AI image-processing derivative: imagegen redesigned the illustrated character's face and teal sports clothing and treated its lighting and orange rotational sweep. These image edits do not change the interactive Snow model, its clothing, mesh, v41 animation or startup loading silhouette. The original Snow attribution and CC BY 4.0 source credit above are retained for this model-derived image.

The complete image prompts and candidate sources are preserved in app/assets/brand/icon-flare-angle2.imagegen.json. Platform icon exports are reproduced with app/tools/export-brand-icons.mjs; dimensions and SHA-256 hashes are recorded in app/assets/brand/icon-manifest.json. Earlier logo and platform resources are preserved in output/imagegen/flare-logo-20261011/adopted-teal/before/.
