# iOS 主线对齐与训练显示功能（2026-10-19）

本轮将 iOS 分支对齐至当前已拉取主线 **`2be8cca34abebb204f3d30b79000eea02015b793`**，并按既有 M3 路线补齐训练期间防自动锁屏。iOS 本地开发版本为 **1.0.9（12）/ v42-R17**；主线 Android 保存身份仍为 L52 / 1.0.9+11。Build12 尚无本人真机验收，也没有上传 Apple。

## 主线与 rebase 范围

本次 `git fetch origin` 后，远端默认分支仍为 `master`。相对上次 `66067a6` 仅新增一项 Pose-Hub 工具迁移提交，没有新增 App 功能、模型、视频或依赖版本。用户提及的其它功能优化当前不在该远端提交中；本轮按可见主线继续，不擅自合入其它分支或未发布素材。

- 主目录 `/Users/shengkai/3D-Flare` 的 master 从66067a6安全快进到2be8cca，原点由 `codex/master-before-posehub-sync-20261019` 保留。
- 既有 iOS 副本 `/Users/shengkai/.codex/worktrees/pr8-audit/3D-Flare` / `ios/main` 起点7674582且干净；备份 `codex/ios-before-posehub-rebase-20261019` 保留原提交。
- `git rebase --onto origin/master 66067a6475e6be85bf0daa6f167da1c124e4f1eb ios/main` 重放24项本地提交，完成点 `a6b2f8411dfb2fee631f04dfcc84550e388521c8`。冲突均为迁移说明与iOS历史台账，双方事实保留。
- rebase前后 `app/lib`、`app/ios`、运行资产、场景、版本及锁文件排除Markdown后无差异。迁移更新的署名/复现文档链接随主线保留，不将旧测试失败清单冒充当前iOS失败。
- 功能保存点：`9aa5b43bae75e3e1ba14da2ed8a08601934c4be0`。后续文档提交不改变该产品源。现有51媒体与原QA提示保持，不新增Pose-Hub同步器、版本锁或模型版本。

## iOS 防自动锁屏

计时准备倒数、训练和组间休息时，iOS保持屏幕亮起；暂停、等待换侧、失焦、退出确认、结束、放弃及计时页销毁时释放。返回前台后仍保持训练暂停，只有本人继续操作才重新启用。该功能只防系统自动锁屏，不阻止本人锁屏或系统中断。

`TrainingTimerPage` 在计时状态变化、生命周期和销毁时同步 `TrainingDisplay`，仅在目标状态改变时调用原生通道。`AppDelegate.swift`通过当前引擎的messenger注册通道，只有应用处于active时才能启用 `UIApplication.isIdleTimerDisabled`；`willResignActive`通知额外释放，避免只依赖Dart回调。

Android/Web保留既有行为；没有新增生产依赖、权限、后台训练、通知或新设置项。通道缺失/平台不可用时计时仍可使用；真实iOS测试直接回读UIKit属性验证效果，不能仅靠Dart乐观状态通过。

## 本次验证

Flutter3.44.7 / Dart3.12.2 / Xcode26.6；专用iPhone13 / iOS26.5 Simulator。下列检查绑定上述功能源，未默认扩大到所有历史测试。

| 检查 | 本次结果 |
| --- | --- |
| `flutter analyze --no-pub` | 无问题 |
| `flutter test --no-pub --concurrency=1 test/ui/timer_pause_ui_test.dart test/ui/ios_layout_test.dart test/ui/plan_regressions_test.dart test/ui/scene_process_recovery_test.dart test/domain/drill_timer_test.dart --reporter expanded` | **45项通过**；含新增iOS显示状态/焦点/退出/完成回归、20组横竖屏/大字布局及计划、计时、场景恢复 |
| `node --test tools/flare-body-swap/pose-hub-paths.test.mjs` | 5项通过 |
| 根 `npm run build` | dist成功，仅既有chunk体积提示；运行资源与主线保持 |
| `flutter test --no-pub integration_test/ios_workflow_test.dart -d <专用Simulator> --reporter expanded` | 真实WKWebView流程通过；UIKit属性在计时页就绪为false，开始/继续为true，暂停/退出确认/保存退出后均为false；原生首启、安全、主题、计划持久化、真实倒数/暂停及未完成记录回读通过 |

第一次原生编译成功后，复制Simulator应用因磁盘不足失败，尚未进入测试；不记作功能验证失败或通过。按用户此前“本机项目可再生中间产物均可清理”的授权，清理本项目约262MiB Flutter缓存、约204MiB闲置Xcode中间缓存，另清理其它项目6组Flutter/测试缓存约665MiB及本次失败的部分Simulator输出。其它项目Git状态前后摘要一致，源码、资产、签名包、Archive和设备数据均保留。重试后Xcode16.9秒、真实流程22秒通过。

正式入口另执行 `flutter build ios --simulator --debug --no-pub --target=lib/main.dart`，Xcode24.9秒成功；在同一专用Simulator保留数据安装、启动，实读Info.plist为1.0.9 / Build12。147项已打包资源逐项SHA与源匹配（场景30、媒体105、pubspec明确纳入的品牌12）。已查看[正式入口首启截图](evidence/ios-20261019/native-main.png)，人物、文字与开始按钮显示正常；这不增加完整原生交互验收结论。结构化结果见[脱敏报告](evidence/ios-20261019/verification.json)。

临时日志为 `/tmp/flare-ios-20261019-{tests,analyze,posehub-tests,root-build,native-workflow,native-workflow-retry,main-build}.log`。原生流程报告与最终包核对归本目录下的精选证据；临时输出不承诺随fresh clone提供。

## 验收与发布边界

Simulator中的UIKit属性验证不能代替真机等待系统自动锁屏、来电/控制中心、真实OS内存压力、温度/续航或长期计时。旧Build7的本人安装反馈与10-17的Build11原生证据保留原source/date，不改写为Build12真机通过。当前未重新运行完整51媒体或全部语言/读屏矩阵。

正式S4 Build3与内部TestFlight Build7仍是原候选，最近已知Apple状态为10-15的观察，本轮没有在线刷新或修改。备案改名、签名、IPA上传、分发、撤回/换审、公开发布、push与PR均未执行。动作生产继续遵循[Pose-Hub迁移边界](../../docs/pose-hub-migration-2026-10-17.md)。
