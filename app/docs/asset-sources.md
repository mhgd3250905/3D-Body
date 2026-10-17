# 资产来源与复现

2026-10-17迁移说明：动作制作、渲染与人物模型工具已归 Pose-Hub；下文来源、制作命令及批次证据保留历史事实，后续修改按[迁移边界](../../docs/pose-hub-migration-2026-10-17.md)到 Pose-Hub 另建版本。FlareLab 场景/模型消费副本与现有51媒体保留。

## L50 R17循环起手修复（2026-10-17）

沿用既有Snow两人体与许可，继承R16制作源，在5.5%–8%平滑接入游离臂微调，消除循环初始支撑肘被压弯；镜像半周期同样处理。原R16落手修复、人体外观和修改区外动作保持。两人体来源与无损meshopt/gzip见[R17接入清单](../scene/tools/v42-r17-source-manifest.json)，剪影来自同一实际GLB；R16/R15及旧素材保持。

## L49 R16 支撑肘修复（2026-10-17）

沿用既有Snow同源两人体与许可，无新增外部人体或收费资产。R16从R15制作源码另建批次，仅使自由臂时序微调在落手前平滑退出；两人体来源SHA、无损meshopt/gzip和教学阶段见[接入清单](../scene/tools/v42-r16-source-manifest.json)。R15/R12资产与剪影保留，当时R16剪影由同一实际GLB离线渲染。缺陷及数值证据见[修复记录](../../docs/flare-v42-r16-fix-2026-10-17.md)。

## L46 已认可 R12 动作（2026-10-15）

沿用下方两种既有 Snow 同源人体与许可，仅在新命名资产中接入 PR #114 的冻结 R12 动画；无外部新人体、购买或收费生成。来源提交 `fc91c7f`，两份原 GLB 与冻结 SHA 完全一致，运行版无损 meshopt/gzip，七形象复用原对应底模。启动剪影另存同源 R12 渲染，旧 v41 剪影与模型保持。原始身份、完整复现和校验见[展示合约](motion-v42.md)及[接入清单](../scene/tools/v42-r12-source-manifest.json)，构建和设备边界见[L46记录](l46-motion-v42-2026-10-15.md)。

## L45 五种可选风格（2026-10-14）

夜影/银翼/机甲/赛博银使用既有Snow同源collarfix训练人台；街头使用原卡通教练。新增为材质/服装着色与程序生成刚性头饰，身体网格/权重/22骨/44轨和原授权保持，无外部人体、收费资产或生成服务。App另保留原卡通教练/训练人台共七选项；独立解剖参考和51媒体均保持原来源。保存、验证和设备边界见[L45记录](pr110-l45-characters-2026-10-14.md)。

## L44 人物与训练媒体来源基线（2026-10-13，L45沿用）

原卡通教练和原PR训练人台资产继续保留。App保存的训练人台选项加载Snow同源的collarfix-20261013派生，修正旧导出着色并恢复training-human-v2已有的肩颈内收；22骨/44轨v41与材质来源保持，无新模型许可或收费资产。source/gzip输入输出SHA及验证见 [L44记录](pr109-l44-upgrade-2026-10-13.md)。独立解剖人台及Snow/Human Base Meshes/Three.js署名保留。

51项正式训练视频与封面现选自已保存的training-human-v2-library-footfix-20261013，含瑞士球背伸鞋向修正。原媒体另存且Git基线保留，manifest同时记录旧媒体、新来源和原QA；选中素材23ready/28review，不冒称所有姿态通过。当前署名见assets/licenses/Drill-media-ATTRIBUTION.md，下方旧阶段来源保持历史。

2026-10-12 整合保留 iOS S4 的来源说明：2026-10-10 用户在 iOS 发布流程确认训练图与品牌图具备发布权，该记录来自 `ios/main` 历史文档。本轮不新增法律核验，也不改变模型、软件及当前51项训练视频各自的来源与许可证；关于页继续保留 Snow / Human Base Meshes / Three.js 署名。

历史v41默认动作采用PR #3固定提交 `53d72b412840a942fefc818836b68ad2a2d7e0d1` 的v41网格/运行时，独立清单为 `scene/tools/v41-source-manifest.json`，复现见 [v41同步](motion-v41.md)。当前穿衣详情代理高亮，不加载历史白膜；下方旧制作包、v38和白膜记录保留历史，不覆盖当前合约。

App内容与设计基线来自用户提供的 `E:\AII-Remote\flare-app-info.zip`，原件保留于仓库 `.reference/flare-app-info-20261008/unpacked/flare-app-package/`。下表原包路径相对于此目录。2026-10-09曾接入v38烘焙包与同源米白详情模特，当时记录见 [v38历史](motion-v38.md)；当前统一为R17与穿衣详情，不加载历史白膜派生。

## 当前 App 图标：青绿色运动服 Flare 人物（2026-10-11，用户选定 B）

用户明确选择新角度 B 的青绿色运动服人物。图标制作以当前 v41 人物的实际渲染起步，最终以用户提供的新角度截图 `output/imagegen/flare-logo-20261011/user-pose-angle-2.png` 为姿态与镜头基准，经内置 imagegen 二次处理角色面孔、青绿色运动服、光影及橙色旋转轨迹。它是用于品牌图标的 AI 图像处理派生；交互场景中的人物、原服装、网格、v41 动画、启动剪影与 L26 银色肌群条目保持。

选定原图 [icon-flare-angle2-b.png](../assets/brand/icon-flare-angle2-b.png) 为1254×1254，SHA-256 `3728021f0dcc87c8f6d20e39d7aa74d1055afd960802e6dda16824c78bd280ad`；当前品牌母版 [icon.png](../assets/brand/icon.png) 为1024×1024不透明 PNG，SHA-256 `4efb4ce324c70e63cfc0612450b5a16b403b94033723b15e367702ee9e834d8d`。选定B的[完整提示词与来源记录](../assets/brand/icon-flare-angle2-b.imagegen.json)随L28进入Git；A/B/C完整抽卡记录 `app/assets/brand/icon-flare-angle2.imagegen.json`、未选候选图及此前设计保留在本机。

[export-brand-icons.mjs](../tools/export-brand-icons.mjs) 将选定原图导出为34张 Android、iOS、Flutter Web 及品牌/商店图标；[icon-manifest.json](../assets/brand/icon-manifest.json) 保存尺寸、构图占比、字节与逐图 SHA-256。Android adaptive 前景与 Web maskable 采用留边构图，普通图标与 iOS 使用对应平台尺寸，品牌母版保持完整方图。此前 `icon.png` 来自原品牌包 `10_品牌与商店/app-icon/icon-master-1024.png`，原件与替换前的平台图标保留在 `output/imagegen/flare-logo-20261011/adopted-teal/before/`。

原人物署名 **Snow Rig © Blender Foundation | studio.blender.org** 与 CC BY 4.0 来源保留于 [Snow-ATTRIBUTION.md](../assets/licenses/Snow-ATTRIBUTION.md)。本段记录用户选定的设计与资源同步；构建、安装与设备验证以版本台账和验证记录为准。

## 肌群条目银色金属摄影（2026-10-11，L26，用户确认采用）

用户反馈L25米白质感仍不足，授权尝试金属。L26的17张透明512×512 WebP共592,628字节，采用钛银色金属人台和保留原色的珐琅教学选区；模型、原分区、左右与逐组镜头沿用L24/L25，仅更改离线截图的材质、反射和光照，运行时人台保持。L26安装后用户先反馈不满意并要求试作黄色橡胶，随后看手机银色截图明确确认“这个银色可以 就这个了”；当前选用L26银色肌群图文条目外观。该确认仅覆盖此处肌群图片与条目，不扩大为全App或其他T02验收。

截图使用物理材质与本地工作室环境反射，基础色 `#b8bdc5`、金属度0.88、粗糙度0.28；细微拉丝以0.025幅度改变表面粗糙度，按像素覆盖抑制不可分辨纹理，不修改原网格或法线。肌群区域使用原色、金属度0.10和粗糙度0.44，保持颜色清晰；透明背景、1024渲染后缩小为512的流程保持。

当前摄影清单采用L26的 `muscle-photography-v3-titanium`，保存尺寸、材质/光照、镜头、输出字节与SHA-256及工具源哈希，历史副本见仓库 `output/playwright/2026-10-11-muscle-thumbnails-metallic/render-report.json`。复现使用 [render-muscle-thumbnails.mjs](../tools/render-muscle-thumbnails.mjs) 和 [muscle-thumbnails.js](../scene/tools/muscle-thumbnails.js)；L26原始1024图、联系表和报告保留在同一目录。L24/L25素材报告和具名交付包保留作历史。

人台继续来自Human Base Meshes v1.4.1 / `GEO-body_male_realistic`既有派生，许可CC0-1.0，来源见 [解剖资产说明](../../docs/anatomy-assets.md)。反光、选区色和深层斜线只用于展示体表功能位置，不代表内部肌肉几何、肌电或与Snow精确配准。图片路径和L24图文组件保持。

## 历史试作：肌群条目黄色橡胶摄影（2026-10-11，L27，未安装）

用户曾要求试作黄色橡胶，截图专用人台采用暖金黄色哑光橡胶，原色肌群区域保留。L27试作的17张透明512×512 WebP共464,032字节，沿用原CC0人台、网格、功能分区、左右与逐组镜头；只调整离线摄影材质、微纹理和柔光，运行时人台及图文组件保持。

摄影基础色 `#c99418`、粗糙度0.90、金属度0、清漆0；细小随机颗粒以0.015幅度改变粗糙度，并按像素覆盖抑制不可分辨纹理。原色教学区域粗糙度0.68，不改肌群颜色；柔和工作室光保持橡胶的漫反射和轮廓阴影。仍先渲染1024透明图，再缩小成512 WebP，不修改原网格或法线。

L27试作摄影清单为 `muscle-photography-v4-yellow-rubber`，保存实际尺寸、字节、镜头、材质/光照与源/输出SHA-256。拍摄时使用 [render-muscle-thumbnails.mjs](../tools/render-muscle-thumbnails.mjs) 和 [muscle-thumbnails.js](../scene/tools/muscle-thumbnails.js)；原始1024图、联系表和报告保留在仓库 `output/playwright/2026-10-11-muscle-thumbnails-rubber/`，此前灰色、米白和金属报告与具名包保留。当前摄影工具恢复银色参数，黄色试作参数以该目录的 `render-report.json` 为准。

来源继续为Human Base Meshes v1.4.1 / `GEO-body_male_realistic`既有派生，许可CC0-1.0，见 [解剖资产说明](../../docs/anatomy-assets.md)。黄色材质是展示风格；肌群色区和深层斜线表示体表功能位置，不代表内部肌肉几何、肌电或与Snow精确配准。图片路径保持 `assets/muscles/{groupId}.webp`。

L27只生成图片并触发APK/Web构建，未安装到手机。用户之后查看手机银色截图，明确确认“这个银色可以 就这个了”；当前采用L26银色条目摄影，黄色仅保留试作记录。

## 历史：肌群条目米白哑光摄影（2026-10-11，L25，摄影外观由L26调整）

按用户要求将截图专用人台调整为暖米白哑光特写。L25的17张透明512×512 WebP共420,314字节，仍读取同一个CC0人台、沿用L24逐组镜头、原肌群分区与颜色；只调整摄影材质和柔光，不改变运行时人台。材质基础色 `#d8d0be`、粗糙度0.88、金属度0，柔和主光和补光保留人体轮廓；截图专用shader保留米白色，正式场景的灰阶转换保持。

L25摄影清单当时为 `muscle-photography-v2-ivory`，记录实际尺寸、透明背景、镜头、输出字节与SHA-256，以及材质/光照和源文件哈希，历史副本见仓库 `output/playwright/2026-10-11-muscle-thumbnails-ivory/render-report.json`。复现仍用 [render-muscle-thumbnails.mjs](../tools/render-muscle-thumbnails.mjs) 与 [muscle-thumbnails.js](../scene/tools/muscle-thumbnails.js)；L25原始1024图、联系表和报告保留在同一目录，L24输出目录保留作历史。

来源继续为Human Base Meshes v1.4.1 / `GEO-body_male_realistic`既有派生，许可CC0-1.0。米白材质仅改善展示，肌群着色和深层斜线继续表示体表功能位置，不代表内部真实肌肉几何或与Snow精确配准；来源与限制见 [解剖资产说明](../../docs/anatomy-assets.md)。图文入口沿用L24组件，图片路径保持 `assets/muscles/{groupId}.webp`。

## 历史：肌群条目模型摄影（2026-10-11，L24，摄影外观由L25调整）

`assets/muscles/{groupId}.webp` 为17张实际模型渲染图，透明背景、512×512，共404,596字节。读取当前打包的 `scene/public/anatomy/mannequin-reference.meshopt.glb.gz`，逐个肌群使用原功能分区和原色高亮，分别选择能看清肩臂、躯干或髋腿的正面/背面三分之四取景。Three.js r170先以1024×1024离线渲染，再缩小为512×512 WebP；没有生成或替换人体网格。

[摄影清单](../assets/muscles/manifest.json)保存模型与输出SHA-256、17个ID、镜头位置、取景范围、原分区、深层标记及工具源哈希。复现入口为 [render-muscle-thumbnails.mjs](../tools/render-muscle-thumbnails.mjs)，拍摄场景为 [muscle-thumbnails.js](../scene/tools/muscle-thumbnails.js) 与同目录HTML；原始1024图、联系表和渲染报告保留在仓库 `output/playwright/2026-10-11-muscle-thumbnails/`。这些制作工具不进入App场景运行时。

人台来自Blender Studio与社区贡献者的 Human Base Meshes v1.4.1 / `GEO-body_male_realistic`，采用既有项目派生，许可CC0-1.0；来源见 [解剖资产说明](../../docs/anatomy-assets.md)。图片表示体表功能位置，深层肌群沿用斜线代理，不是独立内部肌肉几何、肌电或与Snow的精确解剖配准。透明图由Flutter缩略图组件配合主题和肌群淡色底展示，主力、其他参与及协同肌群入口共用同一图片；原训练图继续保留。

## 不可变基线

| 文件/范围 | 实测记录 |
| --- | --- |
| 原 ZIP | 415,030,007 字节；SHA-256 `c833bb34deab674814fdf44dda3fdce29279fec6caa8cdd6d9a11654e3a7d791` |
| 实施计划 PDF | SHA-256 `80507b2aed6cd0b0b4e0ca74b5c4f9ba33ff5ec8586b0425b9b3dee33ae91903`；外层与 `09_实施计划/实施计划.pdf` 相同 |
| 解压包 | 913 个文件，含索引与清单；`00_START_HERE/MANIFEST.tsv` 记录其余911个文件的大小与哈希 |
| 动作版本 | 包标明 `design/muscle-sync@43da6c8`，动作 v33，提交 `b7602c8`；来源仍为原步骤09–16再接回09 |

v33/v38/v41清单、源文件保留为独立历史基线；当前来源为 `scene/tools/v42-r17-source-manifest.json`。网页/App新默认一起采用R17；R12/R15/R16来源和已有网页选择继续保留各自历史身份，`托马斯/` 原导出、个人正式动画/步骤/草稿与 `Air-Flare/` 不被覆盖。包内旧布局/动作说明不覆盖当前合约。

## 采用范围

| App 文件 | 包内来源与说明 |
| --- | --- |
| `scene/src/legacy/*.js` | `08_源代码/3D-Body-design-muscle-sync/src/` 中12个动作/肌群模块；原样复制，逐文件哈希见 `scene/tools/source-manifest.json` |
| `scene/src/public/coach/` 与原场景动作资产 | `05_动作与3D资产/sequence/`、`models/coach-rig.json`；保留v33序列基线，当时后续采用v38，当前另用独立R17烘焙片段，v33/v38/v41来源保留历史 |
| Snow 教练原网格 | `05_动作与3D资产/models/flare-coach.glb`，7,508,016字节；源 SHA-256 `ea6a8739aeb6d8b68a5ac4f50c6094bfec30c61b8612cb317cea4745172c14ff` |
| `assets/data/phase-muscles.json` | `06_肌群数据/phase-muscles.json`；17肌群、8阶段、左右与教学说明 |
| `assets/data/drills.json`、Schema | `07_训练库/` 原内容，51训练；原字段不改，App 按来源清单找到本地 WebP |
| `assets/data/course-stages.json` | `09_实施计划/code/src/features/path/stages.ts` 派生；原 TS 另保留为 `stages-source.ts`，课程与阈值标注草稿；运行时免费且采用人工自评 |
| `assets/drills/*.webp` | `07_训练库/img/` 的51张 PNG，每张本地转码为1024/512两尺寸、quality82；原图保留，图像源/输出哈希见 `assets/data/source-manifest.json` |
| `assets/brand/icon.png` | 当前为用户选定的青绿色运动服 Flare 图标 B 的1024不透明派生；制作、原图与导出清单见上方当前图标段落。此前为 `10_品牌与商店/app-icon/icon-master-1024.png` 的本地副本，原件和替换前资源保留 |
| `assets/fonts/FlareSans.ttf` | Google Fonts官方Noto Sans SC原字体的本地副本，字节不修改，仅文件名/Flutter族别名变化；OFL文本保留于 `assets/licenses/NotoSansSC-OFL.txt`；不依赖远程字体 |

## L38 国际化字体来源与许可

L38 在现有 `FlareSans.ttf` 外，为韩语、阿拉伯语和天城文界面补入三款 Google Fonts 官方 Noto Sans 字体。字体随 App 本地打包；每款对应的 SIL Open Font License 文本保存在 `assets/licenses/` 并随安装包提供，不依赖 CDN 或运行时下载。文件来源、下载字节数与 SHA-256 完整记录在下表；[L38 字体清单](../../output/drill-media-20261011/L38-font-sources.json)是本机留档，不随Git提交，干净检出应按下表及仓库内字体/OFL副本核对。

| 本地文件 | Google Fonts 官方源文件 | 字节数 / SHA-256 | 许可文本 |
| --- | --- | --- | --- |
| `assets/fonts/NotoSansKR.ttf` | [NotoSansKR[wght].ttf](https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf) | 10,414,588 / `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252` | [OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/OFL.txt)；本地副本 [NotoSansKR-OFL.txt](../assets/licenses/NotoSansKR-OFL.txt) |
| `assets/fonts/NotoSansArabic.ttf` | [NotoSansArabic[wdth,wght].ttf](https://raw.githubusercontent.com/google/fonts/main/ofl/notosansarabic/NotoSansArabic%5Bwdth%2Cwght%5D.ttf) | 844,676 / `63111b5b2e074dd48cc67692e0a2726d86ee94c1c37fe8598257b7b4e87e869e` | [OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/notosansarabic/OFL.txt)；本地副本 [NotoSansArabic-OFL.txt](../assets/licenses/NotoSansArabic-OFL.txt) |
| `assets/fonts/NotoSansDevanagari.ttf` | [NotoSansDevanagari[wdth,wght].ttf](https://raw.githubusercontent.com/google/fonts/main/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf) | 641,944 / `14ec4af41f27482216d1c2229f417ff9b1425e1babb014e57d1d40d03229853e` | [OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/notosansdevanagari/OFL.txt)；本地副本 [NotoSansDevanagari-OFL.txt](../assets/licenses/NotoSansDevanagari-OFL.txt) |

哈希用于将仓库中的本地字体与该次实际下载内容核对。Flutter 和 3D 场景通过各自的本地字体回退显示相应文字；许可文本入口也已注册到 App 的许可证列表。

内容导入可用 `assets/data/import_content.py` 在本地复现，需要 Python/Pillow；它只读源包，生成 App 数据和图像副本。3D 构建按 [scene/README.md](../scene/README.md) 执行。[原模型压缩记录](../scene/tools/model-optimization.json) 已记录源/输出哈希：正常着装 Snow 从7,508,016字节压缩至2,390,231字节，人台从1,338,688至863,833字节，采用meshopt与gzip；未减面、未量化、未合并网格。这两个原模型的3,572,742个属性值保持一致，三角形允许等价的循环顶点排序。白膜派生的制作与压缩范围另见下文，不能把其 Blender 局部改网格说成原网格完全不变。当前没有已验收的移动LOD。

正背小图使用包内成熟CC0 Human Base Meshes人台，与主人物共用一个WebGL渲染上下文。每个视图独立渲染到高密度MSAA目标，转换为正确的显示色彩后存入2D呈现副本，按阶段/尺寸缓存；普通质量的小图至少2倍采样，低质量保持1倍。相同人台复用于详情的大画面或小卡片，没有复制模型或新建WebGL上下文。人台原肌群区域、命中数据、网格和法线保留，精细化只调整体表教学边界的宽度/明暗与抗锯齿；首页着装动作人物保留原材质，不显示肌群色区。当前详情在原衣物/皮肤上只显示本群组柔边代理，不加载历史米白模特。Snow、Three.js、meshoptimizer、fflate与Noto许可随包保存并在设置中可查看。fflate许可来自[作者仓库](https://github.com/101arrowz/fflate/blob/master/LICENSE)，meshoptimizer来自[对应版本](https://github.com/zeux/meshoptimizer/blob/v0.22/LICENSE.md)。

## 署名与范围

直立人台的肌群精细化修改 `scene/src/muscle-material.js` 的表现适配：原分区的细灰描边放到显示色彩转换后，采用有边界保护的屏幕导数做抗锯齿，保留人台的原网格、法线、区域与命中数据。没有画入新解剖结构；动作模特的柔边只表示近似位置，不产生新的真实肌肉网格。该细线阶段的历史视觉证据保留在仓库 `output/design-qa/20261008/fine-muscle-lines/`，不充当新版动作播放验收。

## 历史：v38接入时的模型分工

以下两段保留当时约定，不代表当前R17穿衣详情。当前合约见 [motion-v42.md](motion-v42.md)。

按2026-10-09最新明确要求，采用包内 v38 烘焙角色动画，用 AnimationMixer 播放已有22骨/44轨道，不再次执行 IK、安装腰骨或叠加 paced clock。首页保留原上衣、短裤、面孔与原材质；指定肌群详情恢复暖米白哑光、无衣、无五官模特，仅显示当前群组浅红柔边位置，不画肌肉纹路或硬轮廓，不叠加其他阶段色。模特复用同源派生皮肤/头部，与新版演员共享动作骨骼；绑定与腰部权重适配必须按新版检查，不能把此前20骨记录当作22骨适配已通过的证据。

默认布局仍是大动作画面、小直立人台，点击卡片交换；首页未选中的同步小图保持原阶段功能色。直立 CC0 人台显示当前群组的浅红选区与轻柔外缘淡影，保留精细分区边线和原展示材质，指定肌群详情中其余阶段色收起，没有改该人台网格或加动作绑定。源分区定义和评分算法保留；深层区域仍表示教学位置，不是真实内部解剖边界。离开详情恢复着装与原面孔，保留暂停时刻和选择。

[calibrate-muscle-map.mjs](../scene/tools/calibrate-muscle-map.mjs) 使用原三角面的平面交线测量动作身体与静态参考身体的可信核心截面，生成 [core-calibration.json](../scene/src/core-calibration.json)；其中保存模型来源哈希、骨锚配对和截面接受/拒绝记录。被手臂连接污染或存在开断的上端测量不采用，向真实髋/肩骨锚连续回退。[core-mapping.js](../scene/src/core-mapping.js) 按 `pelvis`、`torso`、`spineLower`、`spineUpper` 的蒙皮权重混合修正 `mmRest` 教学坐标：校准 Snow 较窄腰部相对于直立人台的横向比例，并以髋/肩原点作连续纵向和前后小偏移。不缩放身体厚度，不改源分区、法线或动作时刻；静态人台的分区和命中保留原定义。该坐标用于近似点击位置和详情模特柔边教学色区，不是独立真实肌肉网格或精确解剖配准。复现与定向检查命令为 `npm run calibrate:muscles`、`npm run verify:muscles`；旧版完整皮肤采样结果需与新版适配验证区分。

## 历史：曾恢复采用的同源哑光模特

以下保留当时制作、采用与压缩事实。当前正式场景不加载或挂接这些部件，可编辑副本、历史渲染和工具保留。

此前制作的白膜副本还原了衣物下的同源完整皮肤，局部平顺肚脐与裆部，并采用无五官头部和暖米白哑光材质。用户于2026-10-08取消展示并形成历史检查点，随后在2026-10-09明确要求恢复这一外观用于指定肌群详情。当前重新采用 `flare-coach-study-body` 与 `flare-coach-study-head`，首页仍显示原衣物和原脸；源文件、可编辑副本、历史渲染和压缩产物均保留，没有删除或重置。

历史源文件是仓库 `assets/blender-studio-source/snow-rig-v4/Snow/snow_v4.2.blend`，制作时读取现有 `assets/coach/flare-coach.blend` 的20骨静态骨架与已准备的手足。脚本 [build_coach_study.py](https://github.com/mhgd3250905/3D-Pose-Hub/blob/2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee/tools/blender/build_coach_study.py) 与同目录 `sculpt_coach_study.py` 在副本上恢复皮肤、处理腹部和裆部、衔接颈部，并从同源面部、头皮、耳和颈制作无五官头部。头部使用局部体素重建、平滑和减面；不是球体或其他程序化体块拼接的人头。制作保留原 `.blend`、正常着装模型、动作源文件和个人草稿，没有重新制作动作骨架。

可编辑派生保存为仓库 `assets/coach/flare-coach-study.blend`，完整编辑导出是 `scene/source/coach/flare-coach-study.glb`，实际 Blender 渲染与制作报告在 `output/coach-study-20261008/`。部件输出是 `coach/flare-coach-study-body.meshopt.glb.gz` 和 `coach/flare-coach-study-head.meshopt.glb.gz`。源部件各含20骨，新版适配借用动作人物同名骨并处理已烘焙腰部辅助骨与权重，保留部件逆绑定矩阵、绑定矩阵和 glTF 网格坐标偏移；原 v33 动作/资产导入基线没有被修改。

复现工具 `npm run optimize:study` 对完成的两个部件 GLB 做无损 meshopt 编码和 gzip，没有再次量化或减面。**无损指相对 Blender 已制作的派生 GLB**，不表示其头部与原 Snow 拓扑相同。[白膜压缩记录](../scene/tools/study-body-optimization.json) 保存具体大小、哈希与源部件记录；[白膜署名](../scene/public/coach/ATTRIBUTION-study.md) 说明同源修改与 CC BY 4.0。制作复现命令见 [场景说明](../scene/README.md#warm-ivory-matte-study-derivative)。本次资产、工具和服务费用为0元。

Snow Rig © Blender Foundation | studio.blender.org，CC BY 4.0，已修改。原作者成熟人体表面与绑定是本人物的基础，App 内与商店素材应保留署名和修改说明。Human Base Meshes 来源为 CC0；BodyParts3D **数据**为 CC BY 4.0，human-atlas **应用代码**为 MIT，二者许可不同。完整来源说明在 `assets/licenses/Snow-ATTRIBUTION.md`、`Anatomy-ATTRIBUTION.md`，软件许可证也保留在该目录。

当前 App 的肌群面板是体表功能位置示意，没有载入真实 BodyParts3D 图集。不得把 shader 色区称作精确内部解剖；源缺少腹直肌、腹横肌、背阔肌等独立结构时，不能借其他肌肉冒充。Snow、人台和真实解剖不宣称精确配准。

原深色图与图标在用户提供的包中记为 `generate_image` 生成；原包导入阶段仅离线转码/缩略。浅图作者的生成来源另列下节，本轮审核/整合未调用生成服务。原包缺完整商业使用条款记录，公开发布前仍需补齐。`forearms-A`、`adductors-B`、`quadriceps-A` 的原姿势瑕疵保留，训练图以文字要点为准；包中设计稿与v1.1 AI截图不当作当前App实景。

## 浅色训练图（2026-10-09）

PR #4已合并，源 `3b25f13075dcf4aa0bec918cdbf2947c5a8bb8a3`，合并 `bb94d849099d6a2985aa72c00373ce17d81a9993`。`assets/drills/light/*.webp` 为51套/102文件，1024/512尺寸、quality82，共1,188,470字节。作者说明以深色图为参考，用Hark `generate_image` 编辑为暖白背景、去除橙色轮廓光；本轮只审核复用，未调用生成服务。

`drillArt()`随主题在训练库、今日训练和详情选图，深色原图保留。102图解码/尺寸/ID/缩略对应及51对审阅通过；hamstrings-A高亮稍延伸臀部、obliques-C器械浅银色两项差异仍在，不声称逐像素保持原图。文件哈希与检查见 [资源记录](screenshots/2026-10-09-pr4/resource-check.json)，实际验证统一归入 [verification.md](verification.md)。

## 动作视频与静态帧（2026-10-11）

本节是L31导入时的历史来源追溯。下方四个3D-Pose跨项目链接保留原引用，本次L45文档收束不访问其目标；当前51项选版以本页顶部L44来源基线、媒体交付记录和版本台账为准。

L31封面时刻追溯：源[organize-final-media.py](../../../3D-Pose/hark-4080-work/organize-final-media.py)用FFmpeg `-ss 1`制作原48张封面；[publish-local.py](../../../3D-Pose/hark-4080-revisions/publish-local.py)取30fps的 `c/0060.png`制作三张local封面，即2秒。媒体清单据此保存 `poster_time_seconds`，播放器从该姿态准备并等待实际首帧才揭开Flutter封面；未修改原海报或视频，也不把原视频第0帧记成黑屏。六代表抽帧对比与浏览器51项首帧检查共同核对时刻，实际记录见[验证](verification.md)。

按用户授权，从 `E:\AII-3D\3D-Pose` 的已认可 **v1.0.0** 冻结动作库接入 App 的全部51个训练动作，A/B/C各17个，按原动作ID一一对应。来源入口为该项目的 [交接地图](../../../3D-Pose/交接/README.md) 和 [素材索引](../../../3D-Pose/交接/素材索引.json)，实际读取索引的 `frozen_path`，固定在 `版本归档/v1.0.0/`，不按工作副本修改时间或文件名最高版本推测正式选择。9个拉伸素材本次未导入。

51个原MP4共 **42,955,778字节**，51张原JPEG海报共 **679,938字节**，总计43,635,716字节。资产为 `assets/drill_media/{id}.mp4` 与 `{id}.jpg`，复制后字节不修改、不转码、不重新渲染。视频均为H.264、1080×1080、30fps，每项时长和帧数以 [动作媒体清单](../assets/data/drill-media-manifest.json) 为准；清单的 `actions` 按ID索引，保存动作版本、冻结来源路径、原来源链接、视频/海报大小与SHA-256、原notes、可取得的QA和已知限制。复现入口 [import-drill-media.py](../tools/import-drill-media.py) 读取 App `assets/data/drills.json` 的51个ID与源索引，逐项预检后复制；相同哈希的已有媒体复用，不同哈希拒绝覆盖，目录中的其他文件保留。

导入已核对所有视频和海报的源/目标SHA-256、视频头的格式/尺寸/帧数/时长、JPEG格式，并以FFmpeg串行CPU完整解码51段原视频，全部通过；重复运行导入时102个已有文件全部复用。此处验证范围是媒体完整性和准确选版，不是对源动作姿势、接触或所有QA重新审核。来源记录仍保留：`adductors-B` 为正式屈膝哥本哈根支撑保持版，未采用失败的动态草稿；`hip-abductors-B` 的原引擎pass=true同时保留240帧solver警告；`deltoids-B` 支撑肘皮肤与垫面仍约有10.31mm间隙，不改写为完美接触。

本次51项中采用三项正式本地修订：`deltoids-B`、`hip-abductors-B`、`rotator-cuff-B` 均为 **v3-local**，直接按源索引固定 `_本地修订` 的冻结MP4/海报。`deltoids-B` 在 App 名称与视频范围对齐为“哑铃半程土耳其起立（至高桥）”，不是完整站立起身。其余48项保持索引所选原成片，不用integration旧参数或未通过草稿替换正式媒体。

训练库、今日训练、详情及计时/计次训练入口采用同一动作的原海报作为静态帧，点击可播放原视频，再次点击可暂停，同一时刻最多播放一个动作。深浅主题共用原海报与原视频，不重新着色；海报是冻结动作库随片提供的JPEG，未由 App 重新截帧。此前深色 `assets/drills/*.webp` 与浅色 `assets/drills/light/*.webp` 保留为历史资源，本次训练UI不再引用它们。上节浅色图的主题选图行为因此是历史状态，不代表本次视频/静态帧接入后的训练UI。

这51段是离线预录视频，不是可旋转的训练GLB。源60动作的三维参数仍为自定义时间线/姿态/IK模块，尚未输出逐训练动作的标准GLB AnimationClip；已有可播放的v41 GLB仍只属于托马斯循环。视频里的灰色无五官训练人台、描边、灯光、道具和目标肌群高亮属于源成片表现，本次接入没有改变 App 交互3D人物、原Snow面孔/服装或v41动作。肌群颜色表示训练目标，不表示实测激活百分比。

许可及派生说明随包保存于 [Drill-media-ATTRIBUTION.md](../assets/licenses/Drill-media-ATTRIBUTION.md)：Snow Rig © Blender Foundation / Blender Studio，CC BY 4.0；训练头部参考来自源项目记录的Human Base Meshes，CC0。人物、紧凑变形骨架、灰色人台头、训练材质、高亮与道具等修改沿用源成片并保留来源说明。此次内部跨项目复用经用户授权；源checkout没有统一项目LICENSE，不将上游MIT扩大解释为全部本地引擎或媒体的许可。已有 [Snow署名](../assets/licenses/Snow-ATTRIBUTION.md) 与 [解剖来源说明](../assets/licenses/Anatomy-ATTRIBUTION.md) 继续保留。
