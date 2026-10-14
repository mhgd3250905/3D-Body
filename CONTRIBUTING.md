# 开发与 PR 协作

仓库公开于 [mhgd3250905/3D-Body](https://github.com/mhgd3250905/3D-Body)。外部开发者请 Fork，在自己的分支完成修改，再向本仓库的 **`master`** 提交 PR。一个 PR 聚焦一个明确问题，便于审阅和验证。

先读 [README](README.md)、[项目约定](AGENTS.md) 和 [版本台账](app/docs/version-ledger.md)，核对当前交付及本地检查点；实际验证见 [verification.md](app/docs/verification.md)，实施和待验收项见 [development-roadmap.md](app/docs/development-roadmap.md)。

继续Flutter App读 [App说明](app/README.md)、[App约定](app/AGENTS.md)、[v41合约](app/docs/motion-v41.md) 与 [资产来源](app/docs/asset-sources.md)。当前源码与本地构建为L45 / 1.0.2+4，App设置提供七种可保存形象及播放特效；手机最后已知安装为L44，L45尚未安装。14语、51视频、上下半屏详情及连续知识展开保持；启动预加载/真实剪影/首帧衔接、高清全身小卡、穿衣详情柔边高亮、最多3重点及圆点细线的选侧/避让/平滑/边界保护保持。17张银色模型图用于肌群条目，用户已认可该项外观；真机七形象观感、长期计时、全设备与其余3D仍按T01/T02待验收。

双击 `start-flutter.cmd` 使用8820离线App预览，具体构建身份见版本台账；以下8810命令用于保留的根目录原网页编辑器。托马斯动作人物保留原服装和面孔，指定肌群详情显示当前群组柔边代理高亮，独立直立人台保留分区与选区；现行行为以v41合约和当前验证为准。Play P01保持，当前本地APK/Web与同版本号的旧AAB不能混同。

[2026-10-07网页交接](docs/handoff-2026-10-07.md)、[2026-10-08 App交接](app/docs/handoff-2026-10-08.md) 和 [当时截图](app/docs/screenshots/2026-10-08/README.md) 保留历史，不作为当前动作、外观或交付依据。

## 本地运行

克隆自己的 Fork，在项目目录使用 Node.js `^20.19.0 || >=22.12.0`；当前验证版本为 24.15.0。

```powershell
npm ci
npm run build
npm start
```

打开 `http://127.0.0.1:8810/`。开发预览可用 `npm run dev`；若已有服务占用 8810，请指定其他端口。生成的 `dist`、`node_modules` 与本地输出不提交。

新浏览器没有原用户的本地存储，默认使用内置v41。需要恢复阶段1历史个人动画时，可在“动画编辑”中导入 [阶段1可用动画](托马斯/阶段1-可用动画-2026-10-06.json)；已有个人修改须先导出完整备份。历史恢复步骤与哈希见10-07交接，当前默认动作来源见v41合约。

## 开发边界

- 保留原第 9–16 步再接回 9 的正式循环、原导出和阶段1快照。姿态、K 帧、轨迹或存储格式的修改应有明确任务依据，不能为调整肌群界面而改动它们。
- 以现有动画为核心入口，默认完整人物与柔和功能提示，选中后查看局部肌群。后续新训练动作与旧动作优化采用已验收的[training-human-v2](docs/training-human-v2.md)，规格与验证见[制作工具](tools/drill-anim/README.md)。旧选版和历史媒体保留，按具体任务另存新版本。
- 预算为零，运行须离线可用，不引入 CDN。新增资产先确认免费许可、保留来源和署名；人物与解剖模型的约束见 [资产来源](docs/anatomy-assets.md) 与 [人物复现](docs/friendly-coach.md)。不使用球、柱、椭圆体拼接动作人体。
- Snow 动作人物、静态健身人物和 BodyParts3D 解剖参考分别处理。保留真实肌群名称与左右，不用其他肌肉冒充缺失结构，不编造肌电百分比或声称模型精确配准。
- 不清理、重置或覆盖个人数据，不修改兄弟项目 `E:\AII-3D\3D-Wrist`。

## 验证与 PR 内容

检查与改动范围一致，不默认执行全部历史测试。前端修改后构建，并在浏览器确认受影响的模型、布局或交互；视觉修改附实际页面截图。当前Flutter/场景的受影响检查按 [App约定](app/AGENTS.md) 和 [验证记录](app/docs/verification.md) 执行。以下为根目录旧网页的针对性检查入口，适用范围先核对编辑文档：

```powershell
node tools/verify-movement-reference.mjs
node tools/verify-saved-loop-ui.mjs --module-only
npm run build
```

旧脚本可能包含早期五步、旧 ID 或旧存储键的固定断言，适用范围先查交接和编辑文档。纯文档修改核对内容、链接和 Git diff 即可。

PR 描述写清解决的问题、实际变化、验证结果及剩余限制。若改资产，注明来源、许可和复现方式；若改教学内容，同步对应 `docs/` 文档和 `public/` 离线副本。保留 `public/anatomy/`、`public/coach/` 与 `licenses/` 中适用的署名和许可。
