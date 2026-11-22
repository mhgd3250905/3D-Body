# 项目约定

先读 [README](README.md)。Flutter 改动还适用 [app/AGENTS.md](app/AGENTS.md)。当前源码与安装包以[版本台账](app/docs/version-ledger.md)为准，验证证据与未完成的验收分别查阅[验证记录](app/docs/verification.md)和[待验收台账](app/docs/development-roadmap.md)。

## 开发与交付

- 只读和可逆工作直接推进，验证按改动范围执行。独立子任务可以并行，由主 Agent 整合。如涉及网页运行或交互，构建 `dist` 并在浏览器核对受影响流程。使用时须离线可用，禁止引入 CDN。
- 副本、资产和构建输出放 E 盘。保留原始导出、个人草稿与备份、已认可的旧包和冻结资产。保留原网页编辑器、Air-Flare 和图标候选，不改 `E:\AII-3D\3D-Wrist` 已验收模型。
- 推送、开 PR 或操作真机须有用户授权。不可逆外部发布先交可审阅结果，再取得最终授权。

## 网页与资产

- 姿势编辑见 [编辑说明](docs/pose-editor.md)。原可编辑正式循环来自 `托马斯/16.json` 的第 9–16 步再接回第 9 步，入口见 [正式姿态说明](docs/flare-pose-presets.md) 和 [序列](public/coach/flare-sequence.json)。根目录网页内置 R17。个人保存的正式动画切换前须独立备份，保留撤销和原有草稿。
- 动作制作、人物源和渲染工具的归属见 [Pose-Hub 迁移记录](docs/pose-hub-migration-2026-10-17.md)。Flare 消费有出处的固定产物，接入时记录来源提交并验证受影响的网页和 App 入口。人体制作标准见 [training-human-v2](docs/training-human-v2.md)，已冻结的制作源和旧媒体保留。
- 零预算。使用许可明确的免费成熟人体网格，保留自然轮廓，禁止把球体、圆柱等拼接人体用于正式场景。需要本地做模型时，保存可编辑 Blender 文件、实际渲染和可用 GLB，并以图像验收。
- 保留 [Snow](docs/friendly-coach.md)、[BodyParts3D](docs/anatomy-assets.md) 等原始署名、网格、名称与左右。缺失结构如实标注。肌群颜色表示功能关联，避免将其解释为实测肌电或精确解剖配准。

历史版本的功能、素材和验收边界见[版本台账](app/docs/version-ledger.md)中的逐批记录。
