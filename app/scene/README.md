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
| `quality` | `value`: low, medium, high | Pixel ratio 1/1.5/2; low disables shadow |
| `visibility` | `visible` boolean | Hidden pauses and stops GPU rendering |

`ready` includes `period`, `time`, `phase` (integer source step 9–16) and phase
ticks. `state` includes `time`, `period`, `playing`, `speed`, `phase`, `selected`
(nullable group ID), `detail`, `loop`, `quality`, `ready`, and `errorCode`.
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
one 2D thumbnail inside the card; this fixes glass-background occlusion and
rounded clipping without creating another WebGL context or duplicating a model.

This composition follows the package's exact `03_设计稿/v2_核心流程/h1-home.png`
and HTML measurements. The package's `03_设计稿/README.md` explicitly says not
to implement the dotted leg paths pictured in h1/h2, so no paths are drawn.
The floor glow and contact shadow are subdued; the actual v33 motion and
authored mature Snow mesh remain unchanged. `detail(null)` returns to the
same paused time and retains the selected group; `select(null)` is the explicit
clear command and `play` also clears selection.

While paused, primary muscle anchors are tappable with 44 CSS px targets;
the current skinned surface is also raycastable. The detail camera reuses the
same mesh and pose. Its small scissored view shows the same whole body without
a second WebGL context; tapping it switches full/close framing. Colors and
hatched deep locations are approximate functional teaching panels. They are
neither anatomical geometry nor muscle activation measurements.

## Verification and provenance

Run `npm run verify` for source/asset hashes, 181 poses sampled every 0.05 s
against the supplied package's motion, clock parity against the original
`BodyViewer` methods, 0.01 s knee/elbow measurements, phase support, and offline
bundle checks. It also compares all 3,572,742 decoded geometry attribute values
for both models and checks that triangle vertices, winding and face order are
preserved. Original Snow licensing is in `public/coach/ATTRIBUTION-coach.md`;
CC0 mannequin provenance is in `public/anatomy/mannequin-reference.json` and
`ATTRIBUTION.md`; Three.js, meshoptimizer and fflate licenses are in
`public/licenses`. No generated replacement body, fee or mesh simplification
is involved.

`npm run optimize:model` uses pinned glTF Transform 4.2.1 and meshoptimizer
0.22.0, adds EXT_meshopt_compression without running quantize/reorder/simplify,
and applies gzip level 9. The package's original GLBs remain under `source`.
The runtime ships only `coach/flare-coach.meshopt.glb.gz` (2,390,231 bytes) and
`anatomy/mannequin-reference.meshopt.glb.gz` (863,833 bytes); the complete scene
bundle is about 4.1 MB. `tools/model-optimization.json` records exact sizes,
hashes and commands. The local fflate 0.8.3 decoder handles gzip before the
bundled Three.js MeshoptDecoder reads the GLB, including older WebViews without
DecompressionStream. Compression reduces package bytes; the original 332,206
coach triangles and 74,274 mannequin triangles remain, so this does not claim
a low-end-device frame rate improvement or a completed LOD pass.

The compression API and optional preprocessing follow the
[official glTF Transform extension documentation](https://gltf-transform.dev/modules/extensions/classes/EXTMeshoptCompression).

`window.__flareScene` provides metrics, state, hotspots, camera, phase ticks and
clock samples for focused browser verification. It exposes no scene objects.
