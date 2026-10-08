# 资产来源与复现

App 的导入基线来自用户提供的 `E:\AII-Remote\flare-app-info.zip`。本地解压副本位于仓库 `.reference/flare-app-info-20261008/unpacked/flare-app-package/`，该副本保留原文件。以下“包内路径”均相对于这一目录。白膜展示的后续派生复用项目已保留的同源 Snow 原始 Blender 文件，没有下载或更换作者资产。

## 不可变基线

| 文件/范围 | 实测记录 |
| --- | --- |
| 原 ZIP | 415,030,007 字节；SHA-256 `c833bb34deab674814fdf44dda3fdce29279fec6caa8cdd6d9a11654e3a7d791` |
| 实施计划 PDF | SHA-256 `80507b2aed6cd0b0b4e0ca74b5c4f9ba33ff5ec8586b0425b9b3dee33ae91903`；外层与 `09_实施计划/实施计划.pdf` 相同 |
| 解压包 | 913 个文件，含索引与清单；`00_START_HERE/MANIFEST.tsv` 记录其余911个文件的大小与哈希 |
| 动作版本 | 包标明 `design/muscle-sync@43da6c8`，动作 v33，提交 `b7602c8`；来源仍为原步骤09–16再接回09 |

App 引用 v33 的独立副本。根目录原网页、`托马斯/` 导出、历史序列、个人步骤与 `Air-Flare/` 不因导入而更新。包内历史 README/署名说明的旧布局或旧动作记录不能覆盖当前 App 的实施规范。

## 采用范围

| App 文件 | 包内来源与说明 |
| --- | --- |
| `scene/src/legacy/*.js` | `08_源代码/3D-Body-design-muscle-sync/src/` 中12个动作/肌群模块；原样复制，逐文件哈希见 `scene/tools/source-manifest.json` |
| `scene/src/public/coach/` 与场景动作资产 | `05_动作与3D资产/sequence/`、`models/coach-rig.json`；保留 JS 相对导入路径和 v33 序列 |
| Snow 教练原网格 | `05_动作与3D资产/models/flare-coach.glb`，7,508,016字节；源 SHA-256 `ea6a8739aeb6d8b68a5ac4f50c6094bfec30c61b8612cb317cea4745172c14ff` |
| `assets/data/phase-muscles.json` | `06_肌群数据/phase-muscles.json`；17肌群、8阶段、左右与教学说明 |
| `assets/data/drills.json`、Schema | `07_训练库/` 原内容，51训练；原字段不改，App 按来源清单找到本地 WebP |
| `assets/data/course-stages.json` | `09_实施计划/code/src/features/path/stages.ts` 派生；原 TS 另保留为 `stages-source.ts`，课程与阈值标注草稿；运行时免费且采用人工自评 |
| `assets/drills/*.webp` | `07_训练库/img/` 的51张 PNG，每张本地转码为1024/512两尺寸、quality82；原图保留，图像源/输出哈希见 `assets/data/source-manifest.json` |
| `assets/brand/icon.png` | `10_品牌与商店/app-icon/icon-master-1024.png` 的本地副本 |
| `assets/fonts/FlareSans.ttf` | Google Fonts官方Noto Sans SC原字体的本地副本，字节不修改，仅文件名/Flutter族别名变化；OFL文本保留于 `assets/licenses/NotoSansSC-OFL.txt`；不依赖远程字体 |

内容导入可用 `assets/data/import_content.py` 在本地复现，需要 Python/Pillow；它只读源包，生成 App 数据和图像副本。3D 构建按 [scene/README.md](../scene/README.md) 执行。[原模型压缩记录](../scene/tools/model-optimization.json) 已记录源/输出哈希：正常着装 Snow 从7,508,016字节压缩至2,390,231字节，人台从1,338,688至863,833字节，采用meshopt与gzip；未减面、未量化、未合并网格。这两个原模型的3,572,742个属性值保持一致，三角形允许等价的循环顶点排序。白膜派生的制作与压缩范围另见下文，不能把其 Blender 局部改网格说成原网格完全不变。当前没有已验收的移动LOD。

正背小图使用包内成熟CC0 Human Base Meshes人台，与主人物共用一个WebGL渲染上下文。每个视图独立渲染到高密度MSAA目标，转换为正确的显示色彩后存入2D呈现副本，按阶段/尺寸缓存；普通质量的小图至少2倍采样，低质量保持1倍。相同人台复用于详情的大画面或小卡片，没有复制模型或新建WebGL上下文。原肌群区域、命中数据、网格和法线保留，精细化只调整体表教学边界的宽度/明暗与抗锯齿；动作白膜不显示这些边界或肌群斜线。Snow、Three.js、meshoptimizer、fflate与Noto许可随包保存并在设置中可查看。fflate许可来自[作者仓库](https://github.com/101arrowz/fflate/blob/master/LICENSE)，meshoptimizer来自[对应版本](https://github.com/zeux/meshoptimizer/blob/v0.22/LICENSE.md)。

## 署名与范围

直立人台的肌群精细化修改 `scene/src/muscle-material.js` 的表现适配：原分区的细灰描边放到显示色彩转换后，采用有边界保护的屏幕导数做抗锯齿，保留人台的原网格、法线、区域与命中数据。没有画入新解剖结构；动作白膜排除描边。该细线阶段的视觉证据保留在仓库 `output/design-qa/20261008/fine-muscle-lines/`。

## 同源白膜展示派生

只有选中肌群的动作白膜使用这一派生：还原 Snow 上衣和短裤下的完整源皮肤，局部平顺腹部肚脐与前裆表面，头部改为柔和无五官的人台外观。展示材质采用柔和暖米白（象牙白）哑光陶瓷，保持非金属底色，降低釉面反光并保留自然形体和可读的功能高亮，不显示肌肉边线、条纹或深层斜线。陶瓷反光复用离线 RoomEnvironment，不增加下载或外部纹理。正常观看和播放继续使用原着装 Snow 与原面部；清除选择或播放时恢复。详情中的直立 CC0 人台仍保留精细分区边线和原展示材质，没有改网格或加绑定。

源文件是仓库 `assets/blender-studio-source/snow-rig-v4/Snow/snow_v4.2.blend`，制作时读取现有 `assets/coach/flare-coach.blend` 的20骨静态骨架与已准备的手足。脚本 [build_coach_study.py](../../tools/blender/build_coach_study.py) 与同目录 `sculpt_coach_study.py` 在副本上恢复皮肤、处理腹部和裆部、衔接颈部，并从同源面部、头皮、耳和颈制作无五官头部。头部使用局部体素重建、平滑和减面；不是球体或其他程序化体块拼接的人头。制作保留原 `.blend`、正常着装模型、动作源文件和个人草稿，没有重新制作动作骨架。

可编辑派生保存为仓库 `assets/coach/flare-coach-study.blend`，完整编辑导出是 `scene/source/coach/flare-coach-study.glb`，实际 Blender 渲染与制作报告在 `output/coach-study-20261008/`。运行时白膜仅增加 `coach/flare-coach-study-body.meshopt.glb.gz` 和 `coach/flare-coach-study-head.meshopt.glb.gz` 两个部件，不加载完整派生 GLB 或 `.blend`。`study-body.js` 将两个部件绑定到现有同名20骨，分别保留其源逆绑定矩阵与绑定矩阵；这样也保留各 glTF 网格可能存在的坐标偏移。原 v33 动作时序与21份动作/资产导入基线不由此修改。

`npm run optimize:study` 对完成的两个部件 GLB 做无损 meshopt 编码和 gzip，没有再次量化或减面。**无损指相对 Blender 已制作的派生 GLB**，不表示其头部与原 Snow 拓扑相同。[白膜压缩记录](../scene/tools/study-body-optimization.json) 保存具体大小、哈希与部件记录；[白膜署名](../scene/public/coach/ATTRIBUTION-study.md) 说明同源修改与 CC BY 4.0。复现命令见 [场景说明](../scene/README.md#white-muscle-study-derivative)。本次资产、工具和服务费用为0元。

Snow Rig © Blender Foundation | studio.blender.org，CC BY 4.0，已修改。原作者成熟人体表面与绑定是本人物的基础，App 内与商店素材应保留署名和修改说明。Human Base Meshes 来源为 CC0；BodyParts3D **数据**为 CC BY 4.0，human-atlas **应用代码**为 MIT，二者许可不同。完整来源说明在 `assets/licenses/Snow-ATTRIBUTION.md`、`Anatomy-ATTRIBUTION.md`，软件许可证也保留在该目录。

当前 App 的肌群面板是体表功能位置示意，没有载入真实 BodyParts3D 图集。不得把 shader 色区称作精确内部解剖；源缺少腹直肌、腹横肌、背阔肌等独立结构时，不能借其他肌肉冒充。Snow、人台和真实解剖不宣称精确配准。

训练图与图标由用户提供的包记为 `generate_image` 生成。本次仅离线转码、缩略和复用，未调用生成服务；包内没有完整的生成服务商业使用证据，公开发布前需补来源条款记录。`forearms-A`、`adductors-B`、`quadriceps-A` 的已知姿势瑕疵继续标记，所有训练图均为示意图，以文字要点为准。包中商店截图来自设计稿，不能当作当前 App 的真实截图；`v1.1` AI 截图不用于当前开发版。
