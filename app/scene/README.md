# Flutter offline Flare scene

This Vite bundle renders the supplied v33 Snow rig and movement without loading
the BodyParts3D atlas or any CDN. `npm ci && npm run build` writes only the
generated files under `../assets/scene/`. Flutter web loads
`assets/assets/scene/index.html`; native hosts load the same bundle with a local
origin. Every runtime model URL is relative to `index.html`.

The 12 modules in `src/legacy` are byte-for-byte copies from
`08_源代码/3D-Body-design-muscle-sync/src`. Their JSON dependencies are in
`src/public/coach` to preserve the original import paths. The bundled official
sequence is the package's v33, with source steps 09–16 then 09; it does not read
or modify the old web app's local pose library.

## Flutter bridge

Native: `window.flareBridge.command(mapOrJsonString)`. The `FlareHost` JavaScript
channel receives JSON strings. Web: parent iframe sends
`{source: 'flare-host', command: map}` with the same origin. Outbound events have
`source: 'flare-scene'`; iframe messages target the same origin.

| Command `type` | Fields | Result |
| --- | --- | --- |
| `play`, `pause` | none | Start or freeze; play clears detail/selection |
| `seek` | `time` seconds | Freeze at 0–9, exit detail and segment loop |
| `speed` | `value`: 0.25, 0.5, 1 | Paced clock multiplier |
| `loop` | `start`, `end` seconds; null clears | Repeat the interval; 16 is 7–9 |
| `reset` | none | Restore camera; preserve time, selection, loop and playback |
| `camera` | `view`: front, back, side, standard | Change camera without changing time |
| `select` | `groupId` or null | Pause and color a functional surface region |
| `detail` | `groupId` or null | Same paused pose, close camera; null restores main camera and preserves selection |
| `detail_model` | `value`: motion, muscles | Swap the active detail model; retain the same group and paused time |
| `quality` | `value`: low, medium, high | Home pixel ratio caps 1/1.5/2; medium/high detail uses at least 2; low disables shadow |
| `visibility` | `visible` boolean | Hidden pauses and stops GPU rendering |

`ready` includes `period`, `time`, `phase` (integer source step 9–16) and phase
ticks. `state` includes `time`, `period`, `playing`, `speed`, `phase`, `selected`
(nullable group ID), `detail`, `detailModel` (motion or muscles), `loop`, `quality`, `ready`, and `errorCode`.
Commands emit state immediately; animation state is throttled to 10 Hz.
Hotspot/mesh taps emit `select` with `groupId` and `time`; the host opens its
detail UI and sends the `detail` command. `error` includes `code` and
`errorCode`. A recoverable GPU context loss pauses and shows recovery status.

Muscle IDs: `deltoids`, `rotator-cuff`, `triceps`, `forearms`, `serratus`,
`scapular`, `chest`, `lats`, `abs`, `obliques`, `erectors`, `hip-flexors`,
`glute-max`, `hip-abductors`, `adductors`, `quadriceps`, `hamstrings`.

While playing the athlete has its original materials and no labels, circles or
arrows on the actor. The lower-left panel shows the supplied CC0 static mannequin
from front and back, with functional colors sampled from the same current phase;
tapping its actual surface pauses Snow at the current time and emits `select`.
Both views share one mannequin and the main WebGL context. This reference has
its own neutral pose and is not claimed to match Snow anatomically. The h1 home
layout uses a 148 px map, 14 px from the left and 18 px above the stage bottom,
with “同步发力”, front/back labels, and three concise actual phase muscle names.
It shows no duplicate phase, time, or playback hint. At scene heights below
320 px the map shrinks to 108 px. In the home stage (390 × 650, at app y108),
the composition is lifted 40 px from the first pass and shifted left 10 px,
with 0.72 padding. A larger 53 px left shift measured at the static reference's
t=2 frame would crop the real loop's wider phases, so the camera keeps a fixed
safe envelope rather than following the actor. `node tools/verify-framing.mjs`
checks projected skinned vertices across 181 sequence samples; no moving camera
or per-phase zoom is applied. The smaller embedded detail viewport retains
separate framing.
The scene is transparent so the host can draw one continuous graphite stage
behind the header, model and footer. Native WebViews should use a transparent
background when that shared background is supplied by Flutter. The HTML uses
`color-scheme: normal` to avoid the browser inserting an opaque dark iframe
canvas. The tiny front/back views are copied from the existing renderer into
one 2D thumbnail inside the card. Each view uses a complete MSAA render target
at independent 2–3× density (1× in low quality), with explicit ACES/sRGB output
and coverage-alpha correction. Results are cached per phase, size, quality and
exposure; there is no per-frame GPU readback. This fixes glass-background
occlusion and rounded clipping without another WebGL context or another model.

This composition follows the package's exact `03_设计稿/v2_核心流程/h1-home.png`
and HTML measurements. The package's `03_设计稿/README.md` explicitly says not
to implement the dotted leg paths pictured in h1/h2, so no paths are drawn.
The floor glow and contact shadow are subdued; the actual v33 motion and
authored mature Snow mesh remain unchanged. `detail(null)` returns to the
same paused time and retains the selected group; `select(null)` is the explicit
clear command and `play` also clears selection.

While paused, primary muscle anchors are tappable with 44 CSS px targets;
the current skinned surface is also raycastable. Detail opens with the same
Thomas/Snow pose in the large view and the upright mannequin in the small
scissored card. Tapping that card exchanges the two models; it then previews
the alternative model. There is no top segmented switch or extra model button.
Each model retains its own camera, and front/back/reset act on the large view.
Exit restores the home camera and paused frame. Switching does not emit a new
muscle hit or change its training content. Both models reuse the existing
WebGL context and original geometry.

The embedded host owns the accessible tap target over the entire 86×108 card;
the DOM card remains available in a direct scene preview. Host taps restore
visible rendering before changing the model. On Web, the scene's document
visibility controls background rendering, so a host lifecycle/focus change
when dragging the iframe cannot stop an on-screen canvas. Flutter navigation
still sends explicit visibility changes for training/settings pages. Native
hosts retain their lifecycle background handling.

`muscle-material.js` adapts the imported functional shader without changing its
source region definitions or hit testing. The muscle-display action actor has
a bright white glazed-ceramic base and functional color fills, with no added muscle strokes,
channels, edge darkening or deep hatching. Its separate study skin and blank
head replace the clothed body and facial parts only while a group is selected.
The upright mannequin retains fine screen-bounded panel strokes and antialiased deep
locations, with no extra normal relief. Diagram ink is composited after ACES
and sRGB encoding so bright lighting and focus emission cannot wash it out.
Stable adjacent-panel pairs use signed screen derivatives to keep fine curves
continuous; candidate changes/triple junctions fall back to the source gradient.
Midline derivatives use signed X. Region scores and hit tests remain unchanged.
The wrapper has no second lifecycle observer: the app shell is the single
owner of navigation/native visibility, and Web document visibility belongs to
the player. Colors are approximate functional
teaching panels, not anatomical geometry or muscle activation measurements.

## White muscle study derivative

The study actor is a derivative of the same retained Snow source, not a new
download or a replacement actor rig. It restores the source skin beneath the
tee and shorts, smooths the navel and central front groin locally, and uses a
soft featureless mannequin head. The head is sculpted from Snow's own face,
bare skull, ears and neck, with voxel welding, smoothing and decimation in
Blender. It is not assembled from spheres or other geometric body primitives.
Neck surfaces and skin weights are prepared to join the existing body. Shoes
and the prepared source hand/foot surfaces are retained. The normal clothed
actor and its face remain intact for unselected viewing and playback.

The selected study display uses a nonmetallic white glazed-ceramic physical
material, with controlled surface roughness and a clearcoat reflection layer.
Functional colors stay on the surface while the ceramic lighting reveals its
shape. It reuses the existing offline `RoomEnvironment`; no downloaded HDR,
texture or new lighting asset is added. This material applies only to the
selected white actor, not to the normal clothed actor or the upright mannequin
with its fine diagram lines. Blender source editing and runtime material
presentation are separate steps; a source render alone is not a browser
visual acceptance result.

`study-body.js` attaches the body and head to the existing 20 named deform
bones after checking the rest transforms. Each part keeps its own inverse bind
matrices and bind matrix, including any glTF mesh coordinate offset; it does
not borrow another mesh's inverse binds or start a second motion controller.
The supplied v33 timing, 12 legacy modules and all 21 imported baseline files
are preserved. The existing motion's spine helpers still apply to the study
skin. `mapped-mesh.js` hides the original clipped skin, tee, shorts and facial
parts only for selection, using authored node ancestry to cover multi-material
glTF primitives; restore returns their materials and saved visibility.
The upright CC0 mannequin and its fine panel lines are unchanged.

Reproduce with the retained source and the existing clothed coach present.
From the repository root, use the local Blender installation (adjust its path
if needed):

```powershell
& 'E:\AII\toolchains\blender\4.5.3\blender-4.5.3-windows-x64\blender.exe' --background --factory-startup 'E:\AII-3D\3D-Body\assets\blender-studio-source\snow-rig-v4\Snow\snow_v4.2.blend' --python 'E:\AII-3D\3D-Body\tools\blender\build_coach_study.py'
```

The script uses `prepare_coach_hands.py`, `fix_coach_joints.py`,
`refine_coach_ankles.py` and `sculpt_coach_study.py` beside it. It reads the
original files without replacing them, saves the editable
`assets/coach/flare-coach-study.blend`, and exports the full editing GLB plus
separate body/head GLBs under `app/scene/source/coach/`. Actual Blender front,
back and head renders and `build-report.json` are in
`output/coach-study-20261008/` at the repository root. From `app/scene`, run:

```powershell
npm ci
npm run optimize:study
npm run build
npm run verify
```

The runtime adds only `coach/flare-coach-study-body.meshopt.glb.gz` and
`coach/flare-coach-study-head.meshopt.glb.gz` for the study derivative, alongside
the normal actor and upright reference. The full editing GLB and `.blend`
are not bundled. [Study optimization metadata](tools/study-body-optimization.json)
records exact source/output sizes and hashes;
[study attribution](public/coach/ATTRIBUTION-study.md) records the license and
modifications. Meshopt/gzip compression preserves the completed Blender GLB's
decoded attributes and triangles. This lossless runtime encoding is separate
from the deliberate Blender sculpting, head remeshing and decimation: the
study derivative is not claimed to retain the original Snow head topology.
No model, plugin or paid generation service was purchased.

## Verification and provenance

Run `npm run verify` for source/asset hashes, 181 poses sampled every 0.05 s
against the supplied package's motion, clock parity against the original
`BodyViewer` methods, 0.01 s knee/elbow measurements, phase support, and offline
bundle checks. It compares decoded attributes of each source/runtime model pair
and checks that triangle vertices, winding and face order are preserved; the
normal actor and upright reference account for the original 3,572,742 values.
It also checks study binding and restoration of garment/face visibility.
Original Snow licensing is in `public/coach/ATTRIBUTION-coach.md`;
CC0 mannequin provenance is in `public/anatomy/mannequin-reference.json` and
`ATTRIBUTION.md`; Three.js, meshoptimizer and fflate licenses are in
`public/licenses`. The local study derivative's changes and licensing are
documented separately above.

`npm run optimize:model` uses pinned glTF Transform 4.2.1 and meshoptimizer
0.22.0, adds EXT_meshopt_compression without running quantize/reorder/simplify,
and applies gzip level 9. The package's original GLBs remain under `source`.
The unchanged normal actor uses `coach/flare-coach.meshopt.glb.gz`
(2,390,231 bytes) and the upright reference uses
`anatomy/mannequin-reference.meshopt.glb.gz` (863,833 bytes).
`tools/model-optimization.json` records their exact sizes, hashes and commands;
the added study body/head are recorded in `tools/study-body-optimization.json`.
The local fflate 0.8.3 decoder handles gzip before the
bundled Three.js MeshoptDecoder reads the GLB, including older WebViews without
DecompressionStream. Compression reduces package bytes; the original 332,206
coach triangles and 74,274 mannequin triangles remain, so this does not claim
a low-end-device frame rate improvement or a completed LOD pass.

The compression API and optional preprocessing follow the
[official glTF Transform extension documentation](https://gltf-transform.dev/modules/extensions/classes/EXTMeshoptCompression).

`window.__flareScene` provides metrics, state, hotspots, camera, render state,
phase ticks and clock samples for focused browser verification. It exposes no
scene objects.
