# Flare Anatomy Studio

用友善卡通运动人物理解 Flare（托马斯全旋），把支撑、移重、转体与摆腿连接到辅助训练。人物由本机 Blender 基于官方免费 Snow 模型制作，详细肌群来自真实 BodyParts3D。参考用户提供的 [human-atlas](https://github.com/ashemag/human-atlas)。本阶段资产与工具费用为 0 元。

## 打开

双击 `start.cmd`，浏览器打开 **http://127.0.0.1:8810/**。保持启动窗口开启，Ctrl+C 停止服务。已构建的网页、三维模型和运行依赖全部在本地，使用时不需要安装 npm 依赖或访问外网，只需 Node.js。

也可以在当前目录运行 `npm start`。端口被占用时，运行 `node tools/server.mjs --port 8811` 并打开对应地址。请通过本地服务打开，不要直接双击 `dist/index.html`。

## 使用

三维场景铺满窗口，左侧“步骤”栏和右侧“调整”栏可以独立开关，H 或右上角眼睛按钮同时收起／恢复两栏；全屏按钮可进入浏览器全屏。手机上一次显示一侧，载入姿势后自动收起侧栏，留出完整画布。所有模式、步骤、数值调整和训练说明都放在侧栏中。

默认进入“动作分解”，暂停显示你保存的原第 09 步后双撑。“肌群探索”提供 8 个 Flare 功能肌群，选择后显示对应的真实局部网格，右侧提供肌肉功能及相关练习。拖动空白处旋转、滚轮缩放，点击局部网格查看独立解剖名称。“完整人物”返回卡通人物，正面／背面／侧面按钮调整视角。Snow 与解剖参考的比例不同，局部解剖以单独细节视图呈现，不宣称两者精确配准。

动作分解和姿势编辑共用正前方略俯视的推荐机位，按整组动作确定视距。切换步骤、播放或暂停保持镜头；手动旋转和缩放也会保留，点“复位镜头”恢复推荐机位。界面主色为蓝色。

人物穿浅灰色上衣和哑光黑色短裤，柔和的布料反光减弱裤裆褶皱的明暗，保留已有姿势和服装轮廓。

“动作分解”使用你确认的完整循环 **9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 9**，最后一帧与第一帧是同一个原第 09 步。左侧显示各姿势的原步骤编号；拖动 9 秒慢放时间轴或用空格播放／暂停。四类支撑入口依次为后双撑、第一侧单手、前双撑、第二侧单手。“辅助训练”提供从掌根承重、主动推地、左右移重到分段全旋的 8 类练习。右上角“保存视图”将当前三维画面保存为 PNG。

“姿势编辑”与“动作分解”共用这组正式循环，数据来自 `托马斯/16.json`，关键帧的位置、手脚朝向与支撑状态保持保存值。刷新时升级旧正式展示，并独立备份旧版，保留个人动作和草稿。展开右侧“手脚朝向与动作要点”，可查看说明和相关训练；支撑手的左右指人物本人，步骤中的左侧／右侧按用户确认的阶段命名。

点选身体圆点，再拖动彩色轴或旋转环；右侧提供厘米和角度微调、固定左右手、脚不穿地及撤销。摆好后命名并“保存新步骤”，在左侧“我的托马斯步骤”载入、更新或调整顺序。正式展示与自己的步骤单独保存。个人库至少有 16 步时，点“用于正式展示”同步原第 9–16 步并接回原第 9 步；仅有完整九步时也支持按列表发布。“撤销展示替换”恢复此前展示。草稿和步骤自动保存在当前浏览器，导出 JSON 可备份，导入 JSON 可恢复；保存视图会隐藏编辑控制点并将人物居中。详细用法见 `docs/pose-editor.md`。训练卡会说明针对的动作问题，并区分教练示范、解剖教材和原始研究；优选根据功能匹配，未声称比较证明“最好”。

膝盖和肘部支持直接旋转，带动小腿或前臂；独立“腰部”控制点可弯腰、扭腰和侧弯。旋转固定手一侧的肘部前，先取消对应手固定。旧姿势继续原样显示，新的腰部和关节角度可随步骤保存、撤销及镜像。

“动画编辑”可自己 K 两步之间的中间帧：拖画布下方时间轴，调整身体后按 K 保存；← / → 逐帧查看，空格预览，可循环当前段或整圈。右侧顶部可选择“线性 · 匀速”或“平滑 · 缓入缓出”，只需摆好关键帧，中间画面自动生成。每次 K 保存或更新都会重新生成这帧到前后相邻关键姿态的过渡，提示显示影响范围。白色菱形是原节点，蓝色菱形是新增帧。中间帧和补帧方式自动用于播放，刷新后保留，支持删除、撤销和独立 JSON 备份；个人步骤与原草稿保留。“四肢过渡路线”默认“沿关键姿态 · 推荐”，按保存帧实际膝肘弯向连接，脚和非支撑手在运动髋肩周围过渡；路线与补帧速度分别设置，仍可切回原直线对照。详细用法见 [docs/animation-editor.md](docs/animation-editor.md)。

热点颜色代表功能关联，没有标注肌电激活百分比。源解剖参考未包含腹直肌、腹内斜肌、腹横肌、背阔肌与腰方肌的独立网格；它们仍可能参与动作。模型范围不等同于肌肉重要性排序。

“补齐另一侧”保留为此前前撑起始五步方案的兼容工具：手动使用时按列表第 4、3、2、1 步的镜像追加为第 6–9 步，交换左右手脚、完整朝向和支撑状态，保留原来的五步及当前草稿。这与当前采用原第 9–16 步的正式循环是两种入口；旧五步模板不会一律自动补齐。镜像可以继续编辑，也可以撤销这次补齐，载入镜像仍保持统一推荐镜头。

## 编辑与构建

`src/main.js` 管理界面与交互，`src/data.js` 保存中文肌群和训练内容，`src/viewer.js` 管理 Three.js 场景，`src/coach-motion.js` 驱动卡通人物的保存姿势及手动编辑，`src/flare-sequence.js` 在关键姿势之间插值，`src/official-poses.js` 管理正式展示与备份，`src/pose-editor.js` 管理三维控制点，`src/pose-panel.js` 管理数值调整和步骤保存。动画编辑界面与独立存储分别在 `src/transition-panel.js`、`src/transition-edits.js`，四肢路径计算在 `src/limb-arc.js`。`public/coach/` 保存运动人物 GLB、真实关节点、正式九步 `flare-sequence.json` 与署名，`public/anatomy/` 保存独立肌骨数据与署名。修改后运行：

```powershell
npm ci
npm run build
```

开发预览可运行 `npm run dev`。开发服务器同样使用 8810，请先关闭正式服务或指定另一个端口。

当前正式循环的轻量检查命令如下，检查保存值、循环闭合、采用与迁移逻辑，不启动浏览器：

```powershell
node tools/verify-saved-loop-ui.mjs --module-only
```

可选的针对性浏览器检查、前置条件与历史测试的适用范围见 `docs/pose-editor.md`。旧检查脚本包含早期五步、旧 ID、旧时间轴或旧存储键的固定断言，不能作为当前版本通过证据。

## 当前文档与历史记录

下面是当前版本的事实来源。人物与解剖分开查阅，研究说明的公开副本与源文档同步维护。

| 主题 | 当前来源 |
| --- | --- |
| 人物、免费许可与 Blender 复现 | [docs/friendly-coach.md](docs/friendly-coach.md)、[public/coach/ATTRIBUTION.md](public/coach/ATTRIBUTION.md) |
| 解剖来源、覆盖范围与二进制校验 | [docs/anatomy-assets.md](docs/anatomy-assets.md)、[public/anatomy/manifest.json](public/anatomy/manifest.json) |
| 编辑控制点、保存、镜像与检查入口 | [docs/pose-editor.md](docs/pose-editor.md) |
| 动画 K 帧、时间轴、过渡备份与路径 | [docs/animation-editor.md](docs/animation-editor.md) |
| 原第 9–16 步正式循环、来源与迁移 | [docs/flare-pose-presets.md](docs/flare-pose-presets.md)、[public/coach/flare-sequence.json](public/coach/flare-sequence.json)；用户导出源为 `托马斯/16.json` |
| 肌群功能、训练依据与证据范围 | [docs/flare-research.md](docs/flare-research.md)；[public/research.md](public/research.md) 是内容一致的离线公开副本 |

[docs/anatomy-landmarks.md](docs/anatomy-landmarks.md) 保留此前 BodyParts3D 自动绑定试验；[docs/ready-made-models.md](docs/ready-made-models.md)、[docs/rigged-model-options.md](docs/rigged-model-options.md)、[docs/skin-first-anatomy-options.md](docs/skin-first-anatomy-options.md) 保留此前资产选型。它们不是当前展示方案，价格与外部平台信息仅代表当时核查记录，本项目没有采购。

可编辑 Blender 场景在 `assets/coach/flare-coach.blend`，原始 Snow 场景在 `assets/blender-studio-source/`，此前渲染在 `output/blender/coach-preview.png`。Git 保存当前代码、运行资产、文档与 `托马斯/` 的 17 个顶层 JSON 导出；生成的 `dist/`、`output/`、下载素材、Blender 场景、缓存和 `托马斯/备份/` 留在本地且被忽略，不包含在 Git 提交中。原始素材和备份没有删除或重建。

卡通人物：**Snow Rig © Blender Foundation | studio.blender.org**，CC BY 4.0，本项目已修改服饰、材质、表情与网页骨架。BodyParts3D 数据：**BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.** human-atlas 应用代码为 MIT；Three.js 与 Lucide 的许可分别保留在 `licenses/`。本项目未发布或部署远程站点。
