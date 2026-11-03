# iOS 共享 SDK 主线对齐（2026-11-04）

已在既有`ios/main`工作副本完成主线对齐及App侧必要适配；共享视频仍有SDK平台缺口，iOS原生编译与运行也受本机Xcode组件缺失阻止。本轮不作为iOS功能完整验收或商店候选交付。

## 来源与保留

- 远端默认分支仍为`master`。本次从`2be8cca`拉取到 **`a2af14a7899fc27c01f619233c8df6c68e535dd0`**，包含62项Git提交；产品检查点`7eaccf7cf87cf7468b9df838680dab9edf515d27`。
- 主目录`/Users/shengkai/3D-Flare`已安全快进到该主线，起点由`codex/master-before-sdk-sync-20261104`保留。
- iOS工作副本`/Users/shengkai/.codex/worktrees/pr8-audit/3D-Flare`，原点 **`e093ea82e16e6b5017f7905a30b9ce99a289e9de`** 由`codex/ios-before-sdk-rebase-20261104`保留。两边开始均干净，没有stash、reset、clean或覆盖用户改动。
- `git rebase --onto origin/master 2be8cca ios/main`重放29项iOS本地提交，完成点`1025072e98987b15d13b4452602aca6761e3369e`。历史S4、Build5–7、L52/Build11–12与10-20发布证据保留原source/date，不改写为本轮验证。
- 本轮适配产品源 **`550e3cd7fc37134e8baf0979135eb9e8f723aa85`**；后续仅文档/精选证据提交。当前App源码版本 **1.0.10+15 / R17**，与主线一致；Android内测通过构建参数覆盖的1.0.12/2017不是本轮iOS版本。

## 带入的功能与 iOS 处理

主线已含共享SDK AI聊天、动作库/详情/公共媒体、整计划训练、完整结果保存、统一页面控件、计划/记录/里程碑、14语文字与Liquid Glass改造。四个共享包继续固定`693cbc02cdf284163409868e117e438515c6a8d8`，没有升级SDK或其它依赖；常规`pub get`曾因本机registry差异改写锁文件及jni补丁号，已恢复后按原registry执行`--enforce-lockfile`成功，最终pubspec/lock与主线逐字一致。

主线已具有等效的模型失焦可见性、横屏内容滚动及新布局测试；冲突保留较新的主线实现，不恢复已移除的`TrainingTimerPage`、`PlanRunPage`或旧WKWebView媒体控制器。移除重放产生的不可达旧布局块后，`app_shell.dart`与当前主线逐字一致。

训练的屏幕常亮和音频由SDK接管，App旧`willResignActive`主动释放idle timer及`setKeepAwake`写入已移除，避免与SDK引用计数相互覆盖。保留`isKeepAwake`原生只读回读；这是检查接口，不是另一套播放器/保活控制。新SDK持有行为以其本身为准，不将旧Build12“暂停即释放”的验收直接复用。

iOS工作流测试已改用共享库、真实本地计划保存和SDK训练路由，覆盖倒数/手动暂停/部分保存/原生回读的待执行入口。媒体测试已改用共享公共媒体，区分随包WebP解码、真实视频首帧/推进/暂停，以及平台不支持时poster降级；不能再把旧51个离线MP4验收当当前视频验收。

## SDK 需要处理

固定SDK插件只注册Android，`MethodChannelPackedAlphaPlatform.isSupported`也只接受Android；iOS在`TrainingActionMedia._reload()`提前返回，只显示WebP封面。按用户最新要求，仅整理[可直接转发的SDK报告](sdk-ios-readiness-report-2026-11-04.md)，不修改SDK仓库或pub cache，不在App里绕过共享实现。

当前211授权动作、219条公共交付定义、142条语义定义分别计数；公共包仍`releaseEligible=false`，首次视频使用需网络。媒体/许可证、R17与七形象、原编辑器和个人数据保持主线当前边界，不因平台接入增加素材QA或发布结论。

## 实际验证

Flutter3.44.7 / Dart3.12.2 / Xcode26.6。完整结构化结果见[精选报告](evidence/ios-sdk-20261104/verification.json)，临时日志在`/tmp/flare-ios-20261104-*.log`，不承诺随fresh clone提供。

| 范围 | 本次结果 |
| --- | --- |
| 原registry `flutter pub get --enforce-lockfile` | 通过，最终锁文件未变；四SDK包仍固定693cbc0 |
| `flutter analyze --no-pub` | 最终无问题；最初旧媒体集成测试的6个失效引用和1个未用import已随迁移修正 |
| SDK会话/存储、`test/trainer`、完整计划保留、真实SDK Widget播放器、场景恢复、iOS减弱动效、形象测试 | **137通过 / 4失败**；失败为SDK ar/hi各浅深1.5倍字号底部溢出，保留断言，详见SDK报告。相关播放器和测试与主线同源，不宣称全绿或全部原生通过 |
| `ios_layout_test.dart --name 'text 1.0 core pages fit'` | **10项通过**；常规字号深浅及iOS竖/横屏，未跑完整大字号矩阵 |
| Info.plist / PrivacyInfo.xcprivacy / `git diff --check` | 通过；主线后台audio配置保留，不新增无关权限 |
| 根`npm run build` | dist成功，保留既有chunk体积提示 |
| `flutter build web --no-pub --no-web-resources-cdn --output=/tmp/flare-ios-20261104-web` | 正式入口及SDK Dart编译成功，无私有AI配置或凭据注入；不是iOS原生编译证据 |
| Simulator Debug / 设备Release无签名构建 | 两次均被Xcode“iOS26.5未安装/无可用destination”阻止，**未进入应用编译阶段**；simctl runtimes和runtime disk images均为0 |
| 原生集成 / 真机 | 本批未执行；未安装或操作用户设备，不把已更新测试入口写作已运行通过 |
| 浏览器 | 指定Playwright MCP的browser_tabs因profile被另实例占用失败；未关闭其它会话。临时预览服务随后停止，本轮无人工浏览器验看结论 |

定向命令：`flutter test --no-pub --concurrency=1 test/domain/sdk_training_session_test.dart test/domain/trainer_session_store_test.dart test/trainer test/ui/sdk_plan_preservation_test.dart test/ui/trainer_player_integration_test.dart test/ui/scene_process_recovery_test.dart test/ui/ios_motion_preference_test.dart test/ui/actor_choice_test.dart --reporter expanded`；另执行上表10项iOS常规布局。

## 后续

先由SDK团队交付iOS透明视频支持的固定版本及验收证据；本机另需恢复Xcode对应的iOS平台/Simulator runtime，之后才能运行原生集成并安排真机验证。当前不自动下载大型runtime，不修改SDK、升级依赖、签名/上传、TestFlight/App Store写入、push或PR；此前已发布S4与当前开发源码分开。
