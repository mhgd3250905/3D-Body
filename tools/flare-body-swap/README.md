# 托马斯动画换人体实验（2026-10-13，本地分支，未发布）

用户希望用健身动作模块已验收的训练人体 `training-human-v2`（无脸灰色人台头、肩颈蒙皮修复）替换托马斯动画里的 Snow 有脸教练。本目录是这次尝试的可复现工具与结论。默认App外观不变，只有加 `?body=training` 才换人体。

## 结论

- 两套人体共用同一副 22 骨骼、同一份 Snow 派生网格，所以不需要重定向骨骼或改比例。v41 动作原样复用：直接播放已批准的 `flare_v41_loop` 烘焙片段（44 轨），不重跑 IK、不重新烘焙。
- `app/scene/source/coach/flare-coach-v41-training-human-animated.glb`：训练人体加上 v41 片段，可直接放入App。`verify-glb.mjs` 已核对：骨骼名、层级、静止 TRS 与原 v41 GLB 一致；44 轨的关键帧时间和数值逐项相同（差值 0）；眼睛、眉毛、头发、牙齿、舌头都已移除。
- App 场景加 `?body=training` 后载入 `public/coach/flare-coach-v41-training-human-animated.glb.gz`。浏览器实测：载入无报错；同一时间点新旧人体的关节点差值为 0 mm；网格从 22 个减为 9 个，顶点从 211,060 减为 143,650。

## 工具

| 文件 | 作用 |
| --- | --- |
| `render.mjs` | `--mode new`：用 drill-anim 的流程（toon 着色、无脸头、肩颈修复、v41 适配器）逐帧渲染，并输出每帧指标。`--mode old`：在网页舞台上把同一片段的骨骼世界矩阵套到原教练身上，用于同帧对比。 |
| `export-glb.mjs` | 导出 App 可用的 GLB。toon 着色器不能直接带进 App，所以把它的逐顶点服装权重按 drill 主题色烘成 COLOR_0，材质用哑光 MeshStandardMaterial；骨骼按原 GLB 的 T 姿态静止 TRS 导出。 |
| `verify-glb.mjs` | 新旧 GLB 的骨骼与动画一致性检查。需在 `app/scene` 下运行，以便用到它的 node_modules。 |
| `shoot-app.mjs` | 在手机视口 390×844 下给真实 App 场景截图，新旧人体在同一 seek 时间各截一张，并比较关节差值。 |
| `rules.py` | 根据 `render.mjs --mode new` 输出的每帧指标，检查托马斯规则。 |

```bash
# 需先启动根目录 Vite（drill-anim config.json 的 app_url），App 场景另起 Vite（app/scene）
node tools/flare-body-swap/render.mjs --mode new --out OUT --size 1080 --from 0 --to 270
python3 tools/drill-anim/lib/comp.py OUT OUT/spec.json OUT/theme.json OUT/c   # 合成为 drill 画风
node tools/flare-body-swap/export-glb.mjs app/scene/source/coach/flare-coach-v41-training-human-animated.glb
(cd app/scene && node ../../tools/flare-body-swap/verify-glb.mjs)
node tools/flare-body-swap/shoot-app.mjs http://127.0.0.1:8852/ OUT_APP 0,1.2,2.4,4.2,6.3,8.1
python3 tools/flare-body-swap/rules.py OUT/met-0-269.json rules-check.json
```

## 规则检查（v41 全周期 270 帧，训练人体）

- 腿伸直：膝角最小 176.2°。
- 不穿模：drill 引擎胶囊自碰撞检查 0 帧重叠，最差间隙 49.1 mm。两腿骨轴最近 159 mm，手臂与腿最近 189 mm。手部网格穿插检测最小 2.2 mm。
- 手掌贴地：真正撑地的帧共 277 个手帧，掌心离地 5.7–11.7 mm，手腕 31–37 mm。阶段表里另有 57 个手帧标为“双手支撑”，实际是 v39 的快速离地或落地途中，这是阶段表本身粒度较粗，与换人体无关。
- 髋带腿、节奏、支撑点：骨骼数据与 v41 完全相同，所以沿用 v41 已有的结论。
- 主画面干净：换人体没有加任何箭头、圆环或轨迹线。

## 裆部平滑（2026-10-13 第二轮，用户反馈“张开腿时裆部显得敏感”）

- 只改网格 `Coach_Training_Shorts`（两腿之间唯一的表面；`Coach_Body` 在短裤下本来就是挖空的）。骨骼、静止 TRS、44 轨动画、拓扑、UV、服装颜色都不变；`verify-glb.mjs` 仍是 0 差值。导出的 GLB 与上一版逐属性对比：只有短裤的 POSITION/NORMAL/JOINTS_0/WEIGHTS_0 变化，其余 8 个网格完全相同。
- `crotch-smooth.js`（页面脚本，`render.mjs`、`closeup.mjs`、`export-glb.mjs` 默认都会套用，加 `--no-crotch-smooth` 可还原旧人体）：
  1. 蒙皮权重：原来裆部中缝 95% 跟骨盆、2 cm 外就有约 55% 跟大腿，劈腿时内侧被挤出褶皱、中缝成棱。在裆部椭球区域（半径 15×11.5×19 cm）内沿焊接后的网格做 110 次权重扩散，骨盆到大腿的过渡变宽变平滑。区域只涉及 pelvis / spineLower / leftThigh / rightThigh。
  2. 几何（绑定空间，复位姿态即绑定姿态）：前片中部压回到与两侧胯部同一深度，只保留 6 mm 的自然弧度（最大内收 12.6 mm，内层门襟同步内收，层间距保持）；再做 24 轮带遮罩的 Taubin 平滑去掉裆部的雕刻褶皱；区域内法线重算。
- `closeup.mjs`：裆部特写（视频机位、骨盆正前方、两腿之间偏前 30°、两腿之间正对）。`compare-sheet.py` 拼成改前/改后对比图。
- `rules.py` 新增裆部曲面指标：区域内 4693 个三角形逐帧 CPU 蒙皮，统计翻折（法线反向）和挤扁（面积 < 静止时 35%）的三角形数。

| 270 帧全周期 | 改前 | 改后 |
| --- | --- | --- |
| 膝角最小 | 176.2° | 176.2° |
| 胶囊自碰撞重叠帧 / 最差间隙 | 0 / 49.1 mm | 0 / 49.1 mm |
| 手部网格穿插最小 | 2.2 mm | 2.2 mm |
| 撑地掌心高度 | 5.7 mm 起 | 5.7 mm 起（相同） |
| 裆部翻折三角形（全周期合计） | 37,562 | 28,433（−24%） |
| 裆部挤扁三角形（全周期合计 / 单帧最大） | 29,100 / 171 | 28,328 / 227 |

挤扁的单帧最大值变高：权重扩散后，压缩分摊到更多但更平缓的三角形上，看起来更顺，没有新的折痕。

```bash
node tools/flare-body-swap/closeup.mjs [--before] --out OUT --frames 76,136,190,196 --angles 0 --gaps 30,0 --dist 0.75 --size 560
python3 tools/flare-body-swap/compare-sheet.py OUT crotch-closeup-compare.png
```

## 已知差距

- App 里的服装颜色是烘焙后的顶点色，配 App 自己的光照。drill 视频特有的 ember 描边、暗色背景和 toon 明暗属于离线合成，App 里没有。
- 肌群详情页（详情代理高亮、肌肉面板）在新人体上还没有逐项验收；目前只检查了首页播放、seek 和标签定位。
- 裆部平滑只做在 Flare 这份 GLB 和渲染工具上；drill-anim 的 `training-human-v2` 原始资产本身没有改（它是运行时套用的配置，改它会影响所有已验收的健身动作视频）。
- 根目录的 `verify:motion`、`verify:asset`、`verify:sequence` 在未改动的 master 上就已失败（历史快照或输出文件缺失），与本实验无关。`app/tools/verify-v41.mjs` 和 `tools/drill-anim/verify.mjs` 都通过。
