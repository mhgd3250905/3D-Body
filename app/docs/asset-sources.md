# 资产来源与复现

当前默认动作采用PR #3固定提交 `53d72b412840a942fefc818836b68ad2a2d7e0d1` 的v41网格/运行时，独立清单为 `scene/tools/v41-source-manifest.json`，复现见 [v41同步](motion-v41.md)。当前穿衣详情代理高亮，不加载历史白膜；下方旧制作包、v38和白膜记录保留历史，不覆盖当前合约。

App内容与设计基线来自用户提供的 `E:\AII-Remote\flare-app-info.zip`，原件保留于仓库 `.reference/flare-app-info-20261008/unpacked/flare-app-package/`。下表原包路径相对于此目录。2026-10-09曾接入v38烘焙包与同源米白详情模特，当时记录见 [v38历史](motion-v38.md)；当前统一为v41与穿衣详情，不加载历史白膜派生。

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

v33及后续v38清单、源文件保留为独立历史基线；当前来源为 `scene/tools/v41-source-manifest.json`。网页/App默认一起采用v41，`托马斯/` 原导出、个人正式动画/步骤/草稿与 `Air-Flare/` 不被覆盖。包内旧布局/动作说明不覆盖当前合约。

## 采用范围

| App 文件 | 包内来源与说明 |
| --- | --- |
| `scene/src/legacy/*.js` | `08_源代码/3D-Body-design-muscle-sync/src/` 中12个动作/肌群模块；原样复制，逐文件哈希见 `scene/tools/source-manifest.json` |
| `scene/src/public/coach/` 与原场景动作资产 | `05_动作与3D资产/sequence/`、`models/coach-rig.json`；保留v33序列基线，当时后续采用v38，当前另用独立v41烘焙片段 |
| Snow 教练原网格 | `05_动作与3D资产/models/flare-coach.glb`，7,508,016字节；源 SHA-256 `ea6a8739aeb6d8b68a5ac4f50c6094bfec30c61b8612cb317cea4745172c14ff` |
| `assets/data/phase-muscles.json` | `06_肌群数据/phase-muscles.json`；17肌群、8阶段、左右与教学说明 |
| `assets/data/drills.json`、Schema | `07_训练库/` 原内容，51训练；原字段不改，App 按来源清单找到本地 WebP |
| `assets/data/course-stages.json` | `09_实施计划/code/src/features/path/stages.ts` 派生；原 TS 另保留为 `stages-source.ts`，课程与阈值标注草稿；运行时免费且采用人工自评 |
| `assets/drills/*.webp` | `07_训练库/img/` 的51张 PNG，每张本地转码为1024/512两尺寸、quality82；原图保留，图像源/输出哈希见 `assets/data/source-manifest.json` |
| `assets/brand/icon.png` | `10_品牌与商店/app-icon/icon-master-1024.png` 的本地副本 |
| `assets/fonts/FlareSans.ttf` | Google Fonts官方Noto Sans SC原字体的本地副本，字节不修改，仅文件名/Flutter族别名变化；OFL文本保留于 `assets/licenses/NotoSansSC-OFL.txt`；不依赖远程字体 |

内容导入可用 `assets/data/import_content.py` 在本地复现，需要 Python/Pillow；它只读源包，生成 App 数据和图像副本。3D 构建按 [scene/README.md](../scene/README.md) 执行。[原模型压缩记录](../scene/tools/model-optimization.json) 已记录源/输出哈希：正常着装 Snow 从7,508,016字节压缩至2,390,231字节，人台从1,338,688至863,833字节，采用meshopt与gzip；未减面、未量化、未合并网格。这两个原模型的3,572,742个属性值保持一致，三角形允许等价的循环顶点排序。白膜派生的制作与压缩范围另见下文，不能把其 Blender 局部改网格说成原网格完全不变。当前没有已验收的移动LOD。

正背小图使用包内成熟CC0 Human Base Meshes人台，与主人物共用一个WebGL渲染上下文。每个视图独立渲染到高密度MSAA目标，转换为正确的显示色彩后存入2D呈现副本，按阶段/尺寸缓存；普通质量的小图至少2倍采样，低质量保持1倍。相同人台复用于详情的大画面或小卡片，没有复制模型或新建WebGL上下文。人台原肌群区域、命中数据、网格和法线保留，精细化只调整体表教学边界的宽度/明暗与抗锯齿；首页着装动作人物保留原材质，不显示肌群色区。当前详情在原衣物/皮肤上只显示本群组柔边代理，不加载历史米白模特。Snow、Three.js、meshoptimizer、fflate与Noto许可随包保存并在设置中可查看。fflate许可来自[作者仓库](https://github.com/101arrowz/fflate/blob/master/LICENSE)，meshoptimizer来自[对应版本](https://github.com/zeux/meshoptimizer/blob/v0.22/LICENSE.md)。

## 署名与范围

直立人台的肌群精细化修改 `scene/src/muscle-material.js` 的表现适配：原分区的细灰描边放到显示色彩转换后，采用有边界保护的屏幕导数做抗锯齿，保留人台的原网格、法线、区域与命中数据。没有画入新解剖结构；动作模特的柔边只表示近似位置，不产生新的真实肌肉网格。该细线阶段的历史视觉证据保留在仓库 `output/design-qa/20261008/fine-muscle-lines/`，不充当新版动作播放验收。

## 历史：v38接入时的模型分工

以下两段保留当时约定，不代表当前v41穿衣详情。当前合约见 [motion-v41.md](motion-v41.md)。

按2026-10-09最新明确要求，采用包内 v38 烘焙角色动画，用 AnimationMixer 播放已有22骨/44轨道，不再次执行 IK、安装腰骨或叠加 paced clock。首页保留原上衣、短裤、面孔与原材质；指定肌群详情恢复暖米白哑光、无衣、无五官模特，仅显示当前群组浅红柔边位置，不画肌肉纹路或硬轮廓，不叠加其他阶段色。模特复用同源派生皮肤/头部，与新版演员共享动作骨骼；绑定与腰部权重适配必须按新版检查，不能把此前20骨记录当作22骨适配已通过的证据。

默认布局仍是大动作画面、小直立人台，点击卡片交换；首页未选中的同步小图保持原阶段功能色。直立 CC0 人台显示当前群组的浅红选区与轻柔外缘淡影，保留精细分区边线和原展示材质，指定肌群详情中其余阶段色收起，没有改该人台网格或加动作绑定。源分区定义和评分算法保留；深层区域仍表示教学位置，不是真实内部解剖边界。离开详情恢复着装与原面孔，保留暂停时刻和选择。

[calibrate-muscle-map.mjs](../scene/tools/calibrate-muscle-map.mjs) 使用原三角面的平面交线测量动作身体与静态参考身体的可信核心截面，生成 [core-calibration.json](../scene/src/core-calibration.json)；其中保存模型来源哈希、骨锚配对和截面接受/拒绝记录。被手臂连接污染或存在开断的上端测量不采用，向真实髋/肩骨锚连续回退。[core-mapping.js](../scene/src/core-mapping.js) 按 `pelvis`、`torso`、`spineLower`、`spineUpper` 的蒙皮权重混合修正 `mmRest` 教学坐标：校准 Snow 较窄腰部相对于直立人台的横向比例，并以髋/肩原点作连续纵向和前后小偏移。不缩放身体厚度，不改源分区、法线或动作时刻；静态人台的分区和命中保留原定义。该坐标用于近似点击位置和详情模特柔边教学色区，不是独立真实肌肉网格或精确解剖配准。复现与定向检查命令为 `npm run calibrate:muscles`、`npm run verify:muscles`；旧版完整皮肤采样结果需与新版适配验证区分。

## 历史：曾恢复采用的同源哑光模特

以下保留当时制作、采用与压缩事实。当前正式场景不加载或挂接这些部件，可编辑副本、历史渲染和工具保留。

此前制作的白膜副本还原了衣物下的同源完整皮肤，局部平顺肚脐与裆部，并采用无五官头部和暖米白哑光材质。用户于2026-10-08取消展示并形成历史检查点，随后在2026-10-09明确要求恢复这一外观用于指定肌群详情。当前重新采用 `flare-coach-study-body` 与 `flare-coach-study-head`，首页仍显示原衣物和原脸；源文件、可编辑副本、历史渲染和压缩产物均保留，没有删除或重置。

历史源文件是仓库 `assets/blender-studio-source/snow-rig-v4/Snow/snow_v4.2.blend`，制作时读取现有 `assets/coach/flare-coach.blend` 的20骨静态骨架与已准备的手足。脚本 [build_coach_study.py](../../tools/blender/build_coach_study.py) 与同目录 `sculpt_coach_study.py` 在副本上恢复皮肤、处理腹部和裆部、衔接颈部，并从同源面部、头皮、耳和颈制作无五官头部。头部使用局部体素重建、平滑和减面；不是球体或其他程序化体块拼接的人头。制作保留原 `.blend`、正常着装模型、动作源文件和个人草稿，没有重新制作动作骨架。

可编辑派生保存为仓库 `assets/coach/flare-coach-study.blend`，完整编辑导出是 `scene/source/coach/flare-coach-study.glb`，实际 Blender 渲染与制作报告在 `output/coach-study-20261008/`。部件输出是 `coach/flare-coach-study-body.meshopt.glb.gz` 和 `coach/flare-coach-study-head.meshopt.glb.gz`。源部件各含20骨，新版适配借用动作人物同名骨并处理已烘焙腰部辅助骨与权重，保留部件逆绑定矩阵、绑定矩阵和 glTF 网格坐标偏移；原 v33 动作/资产导入基线没有被修改。

复现工具 `npm run optimize:study` 对完成的两个部件 GLB 做无损 meshopt 编码和 gzip，没有再次量化或减面。**无损指相对 Blender 已制作的派生 GLB**，不表示其头部与原 Snow 拓扑相同。[白膜压缩记录](../scene/tools/study-body-optimization.json) 保存具体大小、哈希与源部件记录；[白膜署名](../scene/public/coach/ATTRIBUTION-study.md) 说明同源修改与 CC BY 4.0。制作复现命令见 [场景说明](../scene/README.md#warm-ivory-matte-study-derivative)。本次资产、工具和服务费用为0元。

Snow Rig © Blender Foundation | studio.blender.org，CC BY 4.0，已修改。原作者成熟人体表面与绑定是本人物的基础，App 内与商店素材应保留署名和修改说明。Human Base Meshes 来源为 CC0；BodyParts3D **数据**为 CC BY 4.0，human-atlas **应用代码**为 MIT，二者许可不同。完整来源说明在 `assets/licenses/Snow-ATTRIBUTION.md`、`Anatomy-ATTRIBUTION.md`，软件许可证也保留在该目录。

当前 App 的肌群面板是体表功能位置示意，没有载入真实 BodyParts3D 图集。不得把 shader 色区称作精确内部解剖；源缺少腹直肌、腹横肌、背阔肌等独立结构时，不能借其他肌肉冒充。Snow、人台和真实解剖不宣称精确配准。

原深色图与图标在用户提供的包中记为 `generate_image` 生成；原包导入阶段仅离线转码/缩略。浅图作者的生成来源另列下节，本轮审核/整合未调用生成服务。原包缺完整商业使用条款记录，公开发布前仍需补齐。`forearms-A`、`adductors-B`、`quadriceps-A` 的原姿势瑕疵保留，训练图以文字要点为准；包中设计稿与v1.1 AI截图不当作当前App实景。

## 浅色训练图（2026-10-09）

PR #4已合并，源 `3b25f13075dcf4aa0bec918cdbf2947c5a8bb8a3`，合并 `bb94d849099d6a2985aa72c00373ce17d81a9993`。`assets/drills/light/*.webp` 为51套/102文件，1024/512尺寸、quality82，共1,188,470字节。作者说明以深色图为参考，用Hark `generate_image` 编辑为暖白背景、去除橙色轮廓光；本轮只审核复用，未调用生成服务。

`drillArt()`随主题在训练库、今日训练和详情选图，深色原图保留。102图解码/尺寸/ID/缩略对应及51对审阅通过；hamstrings-A高亮稍延伸臀部、obliques-C器械浅银色两项差异仍在，不声称逐像素保持原图。文件哈希与检查见 [资源记录](screenshots/2026-10-09-pr4/resource-check.json)，实际验证统一归入 [verification.md](verification.md)。
