# 资产来源与复现

唯一导入来源是用户提供的 `E:\AII-Remote\flare-app-info.zip`。本地解压副本位于仓库 `.reference/flare-app-info-20261008/unpacked/flare-app-package/`，该副本保留原文件。以下“包内路径”均相对于这一目录。

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

内容导入可用 `assets/data/import_content.py` 在本地复现，需要 Python/Pillow；它只读源包，生成 App 数据和图像副本。3D 构建按 `scene/README.md` 执行。`scene/tools/model-optimization.json` 已记录源/输出哈希：Snow从7,508,016字节压缩至2,390,231字节，人台从1,338,688至863,833字节，采用meshopt与gzip；未减面、未量化、未合并网格。3,572,742个属性值保持一致，三角形允许等价的循环顶点排序，原顶点、骨骼、蒙皮与动作保留。当前没有已验收的移动LOD。

正背小图使用包内成熟CC0 Human Base Meshes人台，与主人物共用一个WebGL渲染上下文。每个视图独立渲染到高密度MSAA目标，转换为正确的显示色彩后存入2D呈现副本，按阶段/尺寸缓存；普通质量的小图至少2倍采样，低质量保持1倍。相同人台复用于详情的大画面或小卡片，没有复制模型或新建WebGL上下文。原肌群区域、命中数据、网格和法线保留，精细化只调整体表教学边界的宽度/明暗与抗锯齿；动作白膜不显示这些边界或肌群斜线。Snow、Three.js、meshoptimizer、fflate与Noto许可随包保存并在设置中可查看。fflate许可来自[作者仓库](https://github.com/101arrowz/fflate/blob/master/LICENSE)，meshoptimizer来自[对应版本](https://github.com/zeux/meshoptimizer/blob/v0.22/LICENSE.md)。

## 署名与范围

Snow Rig © Blender Foundation | studio.blender.org，CC BY 4.0，已修改。原作者成熟人体表面与绑定是本人物的基础，App 内与商店素材应保留署名和修改说明。Human Base Meshes 来源为 CC0；BodyParts3D **数据**为 CC BY 4.0，human-atlas **应用代码**为 MIT，二者许可不同。完整来源说明在 `assets/licenses/Snow-ATTRIBUTION.md`、`Anatomy-ATTRIBUTION.md`，软件许可证也保留在该目录。

当前 App 的肌群面板是体表功能位置示意，没有载入真实 BodyParts3D 图集。不得把 shader 色区称作精确内部解剖；源缺少腹直肌、腹横肌、背阔肌等独立结构时，不能借其他肌肉冒充。Snow、人台和真实解剖不宣称精确配准。

训练图与图标由用户提供的包记为 `generate_image` 生成。本次仅离线转码、缩略和复用，未调用生成服务；包内没有完整的生成服务商业使用证据，公开发布前需补来源条款记录。`forearms-A`、`adductors-B`、`quadriceps-A` 的已知姿势瑕疵继续标记，所有训练图均为示意图，以文字要点为准。包中商店截图来自设计稿，不能当作当前 App 的真实截图；`v1.1` AI 截图不用于当前开发版。
