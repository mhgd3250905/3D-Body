# Flutter offline Flare scene

2026-10-17迁移说明：动作制作、渲染与人物模型工具已归 Pose-Hub；下文来源、制作命令及批次证据保留历史事实，后续修改按[迁移边界](../../docs/pose-hub-migration-2026-10-17.md)到 Pose-Hub 另建版本。FlareLab 场景/模型消费副本与现有51媒体保留。

2026-10-17，用户确认“OK 测试通过 做好版本保存”。**L50 / 1.0.7+9 / v42-R17 已通过本次用户测试，作为当前认可版本保存；后续优化以R17为基线另建批次。** 交付时的待复核状态已由本次确认更新；完整设备矩阵、长期性能及此前未执行的QA不因本次反馈自动补记为通过。验收身份与冻结资产见[本次保存记录](../docs/l50-r17-acceptance-2026-10-17.md)。

2026-10-17，当前交付为 **L50 / 1.0.7+9 / v42-R17**。已修复循环开始后约2.97%右支撑肘短暂回弯，另一半起手同步修复；原R16落手修复、支撑腕和修改区外动作保持。首页、详情、七形象、网页默认及启动剪影同步R17，Android已从L49同签名保留数据更新，首屏显示通过。R17已通过本次用户测试；完整设备矩阵、长期性能及此前未执行的QA仍按台账待验收。R15/R16与旧包、51媒体及个人数据保留；下方L49及更早段落为历史记录。接入和设备事实见[L50记录](../docs/l50-motion-v42-r17-2026-10-17.md)。

历史交付：2026-10-17，**L49 / 1.0.6+8 / v42-R16**。按用户要求将R15接入App后，已另存修复93.7%–99.8%左支撑肘回弯及另一侧同源问题；首页、肌群详情、七形象、网页默认与启动剪影同步R16。手机已从L48同签名保留数据更新，首屏显示通过；用户对R16的观感、完整原生详情/七形象及长期QA仍待验收。原已认可R15、R14、旧包、51媒体和个人数据保留，后续改动另建批次。接入、包与设备事实见[L49记录](../docs/l49-motion-v42-r16-2026-10-17.md)。此前“独立动作不接入App”的阶段边界已由用户此次替换授权覆盖。

历史交付为 **L47 / 1.0.4+6 / v42-R12**：App七形象与网页默认展示采用用户已认可的22骨/44轨/541帧R12，AnimationMixer播放1.35秒循环，0–9教学时间由独立时钟双向映射，默认0.5倍一圈2.7秒。详情/交换返回同帧、精确教学阶段、短段轨迹特效与同源启动剪影保持。当前合约和复现见[motion-v42.md](../docs/motion-v42.md)，当前性能包已同签名保留数据安装，用户已测试使用L47，并要求保存本版；构建/设备事实见[L47记录](../docs/l47-performance-2026-10-15.md)，L46动作初验保留历史。下方v41及L45内容作为历史来源保留；原资产/源码镜像不可重写。

历史运行时为v41烘焙Snow与AnimationMixer；其固定来源、22骨/44轨/540帧和旧序列域映射保留于[motion-v41.md](../docs/motion-v41.md)。`src/legacy`、v33/v38、裸肤study派生与旧优化记录保留历史，不能作为当前展示或验证结果。

`npm ci` 后执行 `npm run build`，Vite只写入 `../assets/scene/`。Flutter Web使用同源iframe，Android/iOS使用loopback来源读取同一包；模型/字体/翻译均离线，无CDN。运行资产与许可证见[asset-sources.md](../docs/asset-sources.md)，构建及实景证据见[verification.md](../docs/verification.md)。

## 当前动作舞台（L50 / R17，保留既有布局）

首页和动作详情使用设置选择的七种形象，既有身体保持并统一播放R17；新风格只更改材质并增加头饰。详情只高亮当前群组，脸/头发/手/鞋不着色。动作详情可旋转，禁缩放/平移；站立人台可旋转/缩放，当前群组两侧同时高亮。86×136小卡交换模型且保留各自机位、同一选择与暂停时刻。

详情与首页间及详情大小模型交换保持同一WebView/画布，宿主发送 `viewport.bottom` 遮挡量；详情在顶部栏下上下各50%，相机按上半区完整取景，下半区由Flutter显示介绍/协同卡/footer。首页inset仍按transport计算。默认均衡密度上限3、高清4、省电1，均不超过设备DPR；详情模型交换不重建画布。设置更换角色则重建场景并恢复当前暂停帧、配置及详情状态。标签4倍纹理关闭mipmap二次模糊。首页同步图通常宽180/模型高124，短舞台宽128/高96；不显示正面/背面视觉文字，可访问含义保留。

14语短名/读屏和本地字体由 `localization` 命令更新，保持动画时间且不镜像3D人物；功能色区是教学位置提示，不是肌电或解剖精确配准。知识卡片的连续展开由Flutter负责，不改变scene尺寸。当前检查点/安装包见[version-ledger.md](../docs/version-ledger.md)。

## 动效装饰与五个角色（2026-10-14，分支 flare/fx-and-characters）

播放时脚尖拖出两条细的渐变光带（余烬橙→玫红→青），带少量随轨迹飘散的光点，手掌撑地时地面泛起一圈柔光涟漪。L45原实现由v41烘焙片段预计算；L46曾改为从R12重采样并按循环比例缩短时间窗；当前从R17片段采样并沿用同一机制，任意速度、seek和分段循环都与动作同帧；暂停、选中肌群、详情时淡出，不改变人物、材质或动作。`?character=shadow|chrome|street|robot|cyber` 选择五个角色（夜影/银翼/街头/机甲/赛博银），只换材质并加刚性头饰，骨骼/蒙皮/44轨不变；不带参数时保持原 `?body=` 行为。详见 [docs/fx-and-characters-2026-10-14.md](../../docs/fx-and-characters-2026-10-14.md)。

## 自适应分辨率与性能面板（2026-10-15，分支 perf/home-adaptive-dpr）

画面在动（播放、拖动旋转含惯性、详情相机滑动）时绘制密度降到 `min(画质密度, 运动上限)`：省电1、均衡1.5、高清2；全部静止约250ms后补一帧原画质密度，静止恢复原画质密度；限定截图近似一致的测量边界见[合并记录](../../docs/pr-batch-merge-2026-10-15.md)，不宣称逐像素相同。运动中每30帧统计一次帧间隔p95，>25ms降一档（步长0.25，最低1），<18ms回升一档，两次切档至少间隔1s，缓冲只在切档时重分配。只有相机在动时（姿态、灯光、舞台未变）沿用上一张阴影贴图，不重画阴影pass。`?adaptive=0` 恢复固定密度和逐帧阴影。`?perf=1` 在左上角显示 FPS、p50/p95帧间隔、draw calls、三角面、当前/满档 pixelRatio、canvas像素与阴影pass/复用计数，默认关闭；`window.__flareScene.getPerf()` 返回同一组计数。纯逻辑测试 `node tools/verify-adaptive-resolution.mjs` 已并入 `npm run verify`。

性能面板口径：FPS统计最近1秒主舞台实际绘制次数；p50/p95保留最近240个连续渲染tick的历史间隔，暂停或后台后仍可能显示旧样本。calls/triangles只取主舞台颜色pass；canvas与累计颜色/阴影像素是绘制规模计数，不含缩略图等全部工作，也不是GPU耗时、能耗或真机帧率提升证据。前台单帧卡顿达到或超过250ms时按250ms纳入降档样本；恢复可见后的首帧不用于运动性能判断。

## Flutter bridge

Native: `window.flareBridge.command(mapOrJsonString)`. The `FlareHost` JavaScript
channel receives JSON strings. Web: parent iframe sends
`{source: 'flare-host', command: map}` with the same origin. Outbound events have
`source: 'flare-scene'`; iframe messages target the same origin.

| Command `type` | Fields | Result |
| --- | --- | --- |
| `play`, `pause` | none | Start or freeze; play clears detail/selection |
| `seek` | `time` seconds | Freeze at 0–9, exit detail and segment loop |
| `speed` | `value`: 0.25, 0.5, 1 | Baked animation clock multiplier, applied once |
| `loop` | `start`, `end` seconds; null clears | Repeat the interval; 16 is 7–9 |
| `reset` | none | Restore camera; preserve time, selection, loop and playback |
| `camera` | `view`: front, back, side, standard | Change camera without changing time |
| `select` | `groupId` or null | Pause and select the functional teaching group |
| `detail` | `groupId` or null | Same paused full-body pose; null restores main camera and preserves selection |
| `detail_model` | `value`: motion, muscles | Swap the active detail model; retain the same group and paused time |
| `quality` | `value`: low, medium, high; battery/balanced aliases | Shared pixel ratio caps 1/3/4, capped by device DPR; low disables shadows |
| `fx` | `value` boolean | Motion decoration (toe ribbons, motes, hand-plant ripples) on/off; on by default, `?fx=0` starts off |
| `visibility` | `visible` boolean | Hidden pauses and stops GPU rendering |
| `viewport` | `bottom` px, `animate` boolean | Host bottom chrome; detail uses half the available stage height, without resizing the canvas |
| `localization` | `groups`, `shortGroups`, `locale`, `rtl`, localized strings | Update labels/accessibility and choose local font by locale; keep model orientation and time |

`ready` includes `period`, `time`, `phase` (integer source step 9–16) and phase
ticks. `state` includes `time`, `period`, `playing`, `speed`, `phase`, `selected`
(nullable group ID), `detail`, `detailModel` (motion or muscles), `loop`, `quality`, `fx`, `character`, `ready`, `presented`, and `errorCode`.
Commands emit state immediately; animation state is throttled to 10 Hz.
Hotspot/mesh taps emit `select` with `groupId` and `time`; the host opens its
detail UI and sends the `detail` command. `error` includes `code` and
`errorCode`. A recoverable GPU context loss pauses and shows recovery status.

Muscle IDs: `deltoids`, `rotator-cuff`, `triceps`, `forearms`, `serratus`,
`scapular`, `chest`, `lats`, `abs`, `obliques`, `erectors`, `hip-flexors`,
`glute-max`, `hip-abductors`, `adductors`, `quadriceps`, `hamstrings`.

## 历史：v38/v33显示、study派生和原包优化

以下保留当时的原始设计与复现说明，已由上方v42-R17/L50展示契约覆盖；其中“current”仅指记录当时。不要据此切换默认模型、恢复旧比例/标签或声称当前验证通过。

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
with 0.75 padding for the wider v38 envelope. A larger 53 px left shift measured at the static reference's
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
The floor glow and contact shadow are subdued; v38 retains the authored mature
Snow geometry and original home outfit. `detail(null)` returns to the
same paused time and retains the selected group; `select(null)` is the explicit
clear command and `play` also clears selection.

While paused, primary muscle anchors are tappable with 44 CSS px targets;
the current skinned surface is also raycastable. Detail opens with the same
Thomas/Snow pose as the warm ivory matte study mannequin in the large view
and the upright muscle mannequin in the small
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

`muscle-material.js` adapts the functional shader without changing its source
region definitions or scoring algorithm. The home action actor retains its
original tee, shorts, face and material object identities, without surface
highlights. In a specific muscle detail, the attached same-source study body
and featureless head replace the visible clothes/clipped skin/facial parts.
The study material is warm ivory and matte. Only the selected group is shown
in pale red with a feathered edge; no other phase colors, anatomical panel
strokes, hatch patterns or hard contours appear on the action mannequin.
Leaving detail restores the original home outfit and face. The large action
view, small upright reference and click-to-swap card layout remain.
The upright mannequin retains fine screen-bounded panel strokes and antialiased deep
locations, with no extra normal relief. Diagram ink is composited after ACES
and sRGB encoding so bright lighting and focus emission cannot wash it out.
Stable adjacent-panel pairs use signed screen derivatives to keep fine curves
continuous; candidate changes/triple junctions fall back to the source gradient.
Midline derivatives use signed X. The reference mannequin's region scores and
hit tests remain unchanged.
The upright mannequin keeps those original fine panel divisions and also
marks only the current selected group in pale red with a gentle outer shadow;
other phase color fills are hidden in a specific muscle detail. The
unselected home front/back map retains the ordinary phase teaching colors.
Selection emphasizes existing functional regions; a deep region is still a
teaching location, not an actual internal anatomical boundary. Source region
definitions and scoring, action and the original deform rig are preserved;
the action surface uses calibrated teaching coordinates for approximate hit
testing and the selected study-region tint, as described below. The user
explicitly restored this study view on 2026-10-09, superseding the
2026-10-08 all-clothed checkpoint without modifying that checkpoint.
The wrapper has no second lifecycle observer: the app shell is the single
owner of navigation/native visibility, and Web document visibility belongs to
the player. Colors are approximate functional
teaching panels, not anatomical geometry or muscle activation measurements.

### 历史：Relative core teaching-map calibration

`tools/calibrate-muscle-map.mjs` measures trustworthy core cross sections by
intersecting the original body triangles with planes. `src/core-calibration.json`
records source hashes, original bone anchor pairs, and accepted/rejected slices.
Upper measurements polluted by arm connections or open sections are rejected
and blend back toward the real hip/shoulder bone anchors. `src/core-mapping.js`
corrects Snow's narrower waist relative to the static reference, rather than
projecting the same absolute region width onto both bodies.

Only the `mmRest` teaching coordinates blended by the existing pelvis, torso,
spineLower and spineUpper skin weights change. Hip/shoulder anchors provide
continuous small vertical and front/back offsets; body thickness is not
scaled. Geometry, normals, neck/head mapping, bones and action timing remain
unchanged by the teaching-coordinate calibration. The action hit tester and
detail study tint use calibrated `mmRest`; the static reference retains its
original region definitions and hit testing. This provides approximate click
locations on clothing and a soft selected region on the study surface,
without creating independent muscle meshes or claiming exact anatomical registration. From
`app/scene`, reproduce and check with:

```powershell
npm run calibrate:muscles
npm run verify:muscles
```

<a id="warm-ivory-matte-study-derivative"></a>

### 历史：Warm ivory matte study derivative

The user restored the study display for specific muscle detail on 2026-10-09.
Its bare body, featureless head and warm ivory matte material reuse the retained
editable assets. Home playback keeps the original clothing, face and materials;
detail uses the study mannequin and only the selected pale-red soft region.
No source files, historical renders or editing derivatives are deleted.

The historical derivative reuses the retained Snow source, not a new download
or replacement rig. It restores skin beneath the tee and shorts, locally
smooths the navel and central front groin, and sculpts a blank head from Snow's
own face, bare skull, ears and neck through voxel welding, smoothing and
decimation in Blender. Neck surfaces and weights were prepared to join the
body; footwear and prepared source hands/feet were retained. No geometric
primitive body or replacement head was used. The normal clothed actor was
preserved throughout.

`study-body.js` adapts the retained 20-bone body/head to the v38 baked actor's
named bones and existing spine helpers. Each part's own inverse binds, bind
matrix and mesh offset must remain correct; the baked actor's exported first
pose is not a replacement for those source inverse binds. Body waist weights
must follow the existing helper deformation without installing helpers twice.
Study display hides the clipped skin, tee, shorts and facial parts by authored
glTF ancestry, restoring them on exit. The 12 legacy modules and 21 original
import baseline files remain preserved; the upright CC0 reference is independent.

To reproduce the retained derivative, use the original source and the
existing clothed coach.
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
```

The outputs are `coach/flare-coach-study-body.meshopt.glb.gz` and
`coach/flare-coach-study-head.meshopt.glb.gz`, used for current detail display.
The full editing GLB and `.blend` are not bundled.
[Study optimization metadata](tools/study-body-optimization.json)
records exact source/output sizes and hashes;
[study attribution](public/coach/ATTRIBUTION-study.md) records the license and
modifications. Meshopt/gzip compression preserves the completed Blender GLB's
decoded attributes and triangles. This lossless runtime encoding is separate
from the deliberate Blender sculpting, head remeshing and decimation: the
study derivative is not claimed to retain the original Snow head topology.
No model, plugin or paid generation service was purchased.

### 历史：Verification and provenance

Run `npm run verify` for current source/asset hashes, animation and clock
mapping, study binding/display invariants and offline bundle checks. Source
and runtime model comparison must preserve decoded attributes, triangle
vertices/winding, and baked animation tracks. The v33 181-pose clock parity
and original 136-selection all-clothed results describe the previous checkpoint;
they cannot prove v38 integration. Current exact commands, counts, screenshots
and results are recorded in [verification.md](../docs/verification.md). The
package's own bake report and the independent pre-integration 540-frame
comparison are separate evidence, as explained in
[motion-v38.md](../docs/motion-v38.md). Do not infer Android/iOS or real-time
training timer acceptance from desktop model or widget checks.
Original Snow licensing is in `public/coach/ATTRIBUTION-coach.md`;
CC0 mannequin provenance is in `public/anatomy/mannequin-reference.json` and
`ATTRIBUTION.md`; Three.js, meshoptimizer and fflate licenses are in
`public/licenses`. The local study derivative's changes and licensing are
documented separately above.

`npm run optimize:model` uses pinned glTF Transform 4.2.1 and meshoptimizer
0.22.0, adds EXT_meshopt_compression without running quantize/reorder/simplify,
and applies gzip level 9. The package's original GLBs remain under `source`.
The historical v33 normal actor remains `coach/flare-coach.meshopt.glb.gz`
(2,390,231 bytes); current playback uses the v38 animated encoded GLB above.
The upright reference uses
`anatomy/mannequin-reference.meshopt.glb.gz` (863,833 bytes).
`tools/model-optimization.json` records their exact sizes, hashes and commands;
the study body/head source and encoded parts are recorded in `tools/study-body-optimization.json`.
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
