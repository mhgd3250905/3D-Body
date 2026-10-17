# PR #117 计划页合入与修复（2026-10-17）

用户在审核后明确授权合并并修复。PR #117 源为 `8938181d0dff19d432ee561786d62398ad1377f0`，PR 报告基准 `179d971c69abd01f58af7989b0a497dd81f93265`，合并前远端 master 为 `d3e66e80e6b524483613598dbbe2ea148b7b0a98`。在隔离副本将该源合入本地 L50/R17 的 `6f694c0dad991d281f84f68d50cf05ab05dab932`，无冲突合并提交 `223d46fee296579ad8958c7409534e9aa9c02035`；修复提交以 Git 实际记录为准。

本轮是源码与离线预览更新，没有生成新 APK 或更新手机。已认可安装版仍为 **L50 / 1.0.7+9 / v42-R17**；安装版本号与冻结标签保持，不将本轮预览冒称新的已验收安装包。R17 动作、七形象、51 视频、个人旧进度、原网页编辑器与冻结资产均保持。

## 合入行为

首页左上角和更多菜单进入「计划」。提供 6 套训练方向和无器械/居家/健身房场景，以及可命名、排序、复用的个人计划；可逐项开始、跳过和结束。原课程、自评、关卡与今日清单的数据和 Store 接口保留，旧界面由计划替代。完整设计来源见 [PR 原说明](plans-redesign-2026-10-16.md)。

## 审核修复

- 跳过最后一个未完成动作会停留在该动作，继续允许开始；只有所有动作实际完成才显示整套完成，完成后仍可点选动作重练。覆盖单动作、其余动作已完成和整套完成后重练三种情况。
- 「复制本地备份」增加 `routines`，保留计划 ID、名称与有序动作 ID。当前仍没有 App 内备份导入入口，不把导出扩大为完整迁移验收。
- 计划名称输入、截断、领域校验统一按 24 个可见字符处理，完整保留 emoji、组合音标和家庭 ZWJ 字符。`characters` 显式引用既有 1.4.1，不升级依赖。

## 实际验证

验证环境为本机 Windows / Flutter 3.44.7 / Dart 3.12.2。命令在隔离副本 `E:/AII-3D/3D-Body-worktrees/pr117-audit-20261017` 内执行。

| 验证 | 结果 |
| --- | --- |
| `flutter analyze --no-pub`（app） | 无问题 |
| `flutter test --no-pub test/domain/learning_store_test.dart test/domain/training_routine_name_test.dart test/ui/plans_test.dart test/ui/plan_regressions_test.dart test/ui/timer_pause_ui_test.dart test/ui/library_filters_and_header_test.dart test/ui/internationalization_test.dart --reporter expanded`（app） | 40 项通过 |
| `flutter test --no-pub test/ui/flow_regressions_test.dart --plain-name 'plans: preset' --reporter expanded`（app） | 1 项通过；计划进入、计时未完成退出、保存、编辑、删除撤销 |
| `npm ci`、`npm run build`（根目录） | dist 构建成功；既有体积提示保留 |
| `flutter build web --no-web-resources-cdn`（app） | 成功，离线资源随包构建 |
| 390×844 实际浏览器 | R17 首屏、计划列表、新建/选动作、23 英文字母加 emoji 保存、单动作跳过后仍为 0/1 且可开始均通过；控制台 error 为 0 |
| `git diff --check` | 通过 |

浏览器截图在主目录 `output/playwright/pr117-20261017/`：`plans.png`、`skip-not-complete.png`；测试与构建日志留在隔离副本 app 的 `pr117-fixed-tests.log`、`pr117-plan-flow.log`、`pr117-web-build.log`。输出目录和构建产物受忽略规则管理，不保证 fresh clone 可得。

审核前的广域定向测试有 4 项失败（appearance、inactive iframe、phone safety、drill picture）。已在 PR 基线 `179d971` 独立复跑，4 项名称和断言原因完全一致，不作为 PR117 新回归；本轮未修复这些既有测试问题。Android/iOS 真机、全部计划剂量和长期计时仍待验证。原未提交的绿幕文档、Air-Flare 和图标候选不纳入本轮提交。
