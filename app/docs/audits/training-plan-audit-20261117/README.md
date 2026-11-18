# Flare 训练计划审核 · 2026-11-17

本目录提交当前 72 套训练计划的审核、处方调整草案与执行核算证据，供 mhgd 逐项复核。**本 PR 为文档与证据提交，尚未应用任何训练处方修改。**

审核基线为 [`feat/flare-plans-full @ b461a0d`](https://github.com/mhgd3250905/3D-Body/commit/b461a0d887737a73d7aeda50b3fcb4ee53323c75)。PR 以 `feat/flare-plans-full` 为目标分支；原功能分支尚未合入 master，本次不推进合并或发布。

## 阅读入口

| 内容 | 入口 |
|---|---|
| 结论、剂量原则与新增动作候选 | [审核总评](audit-overview.md) |
| 8 个角度、21 套处方逐项建议 | [角度计划](angle-audit.md) |
| 17 个肌群、51 套处方逐项建议 | [肌群计划](muscle-audit.md) |
| 确认问题、待核对侧别与 216 份场景排程 | [执行审计](execution-audit.md) |
| 合并阅读版 | [完整 Markdown](training-plan-audit.md)；[离线 HTML](training-plan-audit.html)，下载后浏览器打开 |
| 新增动作候选 | [CSV 清单](missing-action-candidates.csv)：8 类候选，另 1 项腕伸演示需先核对排重 |
| 原始计划展开 | [72 套计划及替换](plans-expanded.md) |

## 请 mhgd 重点核对

1. **先裁决事实。** 3 条静态支撑沿用动态次数、5 条徒手残留专用器材已由源码与排程确认。侧别疑点单独标记 `review`，不能把全部元数据冲突当成错误。SDK 已对左右一对的交替动作去重；腕部 60 秒为四手位各 15 秒的定时动态练习，不是视频停止。
2. **再评估编排。** 各级主任务是否清楚，初级承重总量是否适合入口用户，高级是否重复堆叠技巧，建议组次/休息/进阶是否可执行。请分别标注保留、调整或拒绝及理由。
3. **判断可用替换。** 同肌群不等于训练目标相同；卷腕→弯举、内旋抗阻→拉伸、动态举腿→静态空心体等，不能直接继承旧模式与剂量。
4. **核对缺项。** 优先移重卸手、胸朝上后撑扫腿、辅助分段衔接；确认现有库有无同规格后，再决定 Pose-Hub 新增制作。腕伸候选尚不能认定缺失，须先看现有卷腕演示。

请在 PR 回报“接受项 / 需修订项 / 待补证据项”，本轮先做审核，不直接替换处方或安排媒体制作。

## 数据与验证口径

- 72 套计划 = 21 套角度 + 51 套肌群；角度 15 使用 11 的镜像方案，覆盖 8 个角度。
- 417 条原始处方、150 个不同主动作 ID；产品授权目录范围为 248 项。
- 72×3 场景 = 216 份 SDK 基础排程，已在审核基线使用实际适配器导出；不是 216 次真机训练。预计时间不含用户暂停、学习与额外语音等待。
- 研究依据链接在对应正文旁。具体处方属于待试训建议，不是已经验证的托马斯训练效果或临床结论。
- 报告生成检查核对 72 个计划 ID 覆盖、248 个动作、216 条时长记录、9 行候选清单；本次文档提交不需要重新构建 App。

证据文件：[动作语义快照](catalog-extract.json)、[解析提取](execution-extract.json)、[问题与待核对项](execution-issues.csv)、[SDK 解析结果](duration-sdk.json)、[时长对照](duration-comparison.csv)。这些都是审核时点的快照，不替代产品目录或权威处方。

## 报告再生成

需要 Python 3 与 `Markdown` 包。从仓库根目录执行：

```powershell
python app/docs/audits/training-plan-audit-20261117/build_report.py
```

脚本从本目录的四份审核正文与快照生成 HTML、合并 Markdown 和新增动作 CSV，并与当前仓库计划核对覆盖范围。源码计划改变后，必须重新审核，不能只重跑生成器来宣称结论仍适用。

## SDK 排程复核

[导出脚本存档](execution_audit_test.dart.txt) 使用基线的 `Catalog`、`trainingPlanFromFlarePlan` 与固定 SDK `SessionBuilder`。归档时仅将输出路径改成可配置位置，训练解析逻辑保持。准备好该基线的 Flutter 与 `flutter pub get` 依赖后，在 `app` 目录执行：

```powershell
New-Item -ItemType Directory -Force .dart_tool | Out-Null
Copy-Item docs/audits/training-plan-audit-20261117/execution_audit_test.dart.txt .dart_tool/training_plan_audit_test.dart
flutter test .dart_tool/training_plan_audit_test.dart --reporter expanded
```

结果写入 `.dart_tool/training-plan-audit-duration.json`，不会覆盖本目录证据。此命令是复核入口；本次提交只运行报告生成与数据一致性检查，不重复安装依赖或把之前的导出测试记为本次新跑的真机测试。
