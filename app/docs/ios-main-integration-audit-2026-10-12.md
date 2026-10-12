# iOS 源码与 L43 主线整合审核（2026-10-12）

完成状态：本文件下文保留试合并/补修过程的实际验证范围。最终来源 `8196ce6d3179053827fad56b91469b3088fce242` 已经PR #107合入master `685f3ec41e16f6869124de35fbaa2b5c0eeddbec`；PR #8在GitHub已标为MERGED。后续主线没有改变这里验证的App源码树，50项累计定向范围仍按下文边界复用；没有新Mac/iPhone/Apple验收。当前版本与待办以 [版本台账](version-ledger.md#2026-10-12-主线整合源码检查点)、[实施路线](development-roadmap.md#主线整合后待安排事项2026-10-12) 为准。

用户授权将 `ios/main` 与最新 master 整合、解决冲突并提交 PR。工作副本为 `E:\AII-3D\3D-Body-worktrees\ios-main-integration`，分支 `codex/ios-main-integration`；原主目录、原 PR8 审核副本和用户改动未修改。源为 `6997bb53836e0a2ab06aa7cb0a97f4779f037c18`，首轮主线为 `1f87cc6180532857c1b53dba4c9898915a9aa49a`，随后无冲突纳入 `80298ceccf58c958e557e1b45c44ddaf1ae2c6b6`。整合保存点分别为 `b85769d`、`8e6284e`；最终修复保存点由 Git 定位，不预填自身 SHA。

## 冲突与取舍

首轮25项冲突涉及当前文档、11个小尺寸图标、Info.plist、ARB及生成文件、main/app_shell/content_pages/timer_page/pubspec。以 L43 的页面、启动预加载、14语、当前青绿图标和51项可点播视频为产品底座；再接入 iOS 工程、WKWebView 配置/恢复、系统 Reduce Motion、观测型集成测试和历史 Mac/Apple 证据。旧的三场景弹层和旧启动占位没有覆盖 L43。

公共版本保持 `1.0.0+1`，现有 Android 安装和 Play 包未改变。Apple 已上传的 S4 `1.0.0 (3)` 及其文件哈希是历史事实，不能当作本次整合构建；下一次 IPA 需明确 `IOS_BUILD_NUMBER` 大于3，当前脚本可传4并通过 `--build-number` 覆盖，仅作用于该次构建。此次没有 Mac 构建、签名、上传、商店字段写入或设备安装。

保留 master 的全部 AppIcon 尺寸和青绿1024源图；iOS 原生 LaunchImage 同步同一青绿源，Flutter 的真实 v41 启动剪影不变。Info.plist 保留14语言声明、原本地网络配置，加入 iOS 的状态栏/全屏/出口加密声明，工程最低iOS15、仅iPhone不变。PrivacyInfo 随 Runner 打包，声明不追踪/不收集及本App UserDefaults 的 CA92.1 理由。实际最终IPA隐私汇总和签名仍需 Mac 复核。

`assets/data` 改为显式列出全部运行JSON（含 L43 `drill-media-manifest.json`），避免历史未签名 `.py` / `.ts` 制作源进入iOS包；14语翻译、字体、51视频与旧图片、v41场景仍打包。相对 `80298ce`，`app/assets/scene`、`app/scene/src`、`app/assets/drill_media`、`app/assets/l10n`、训练JSON、品牌图和AppIcon目录无差异。pubspec.lock仅新增 integration_test 必需的SDK/传递依赖，没有共同包版本倒退。生成翻译由 ARB 再生成，相对L43只有简中关于页的旧开发版/待授权文案及对应模板注释改变；其他语言和短名保持。

## 补修

- 保留 iOS 源已完成的脚本安全修复：build/doctor 不再执行 Git 还原，指定SDK和设备，签名模板继续拒绝直接导出。环境自检分别要求 Xcode26及iPhoneOS SDK26，最低设备系统仍iOS15；依据 [Apple 自2026-04-28起的上传要求](https://developer.apple.com/news/upcoming-requirements/?id=02032026a)。
- 原生进程终止后恢复暂停；后台就绪不自动播放、不恢复可见绘制，回前台仍等待手动播放。单独保存详情模型，防止新页面的初始motion状态丢掉已选muscles；同帧恢复2.375秒经过回归。
- 共用尺寸过渡在系统减弱动态效果下直接布局；保留 L43 启动层并接入 iOS Reduce Motion。旧测试按当前常驻搜索/训练列表进入，卡片点名称打开详情，避免点画面触发视频播放。
- SE3竖屏2倍字号：仅收紧compact内边距/卡片间距，动作要点仍两行，知识区字体和上下半分保持。计时环内完整数字/单位按可用环面积缩放。时间标签限定最大宽度并按需缩放，普通字号保持固有宽度，避免抢走14语阶段标题的两行空间。

## 验证与未完成范围

Windows本机 `flutter analyze --no-pub` 无问题。定向范围共49项：controller与观测状态、启动预热、减弱动态效果、过渡、3项进程恢复、12项竖屏矩阵、当前训练筛选/标题、计时暂停和国际化/14语紧凑布局。初次检查发现时间标签分配宽度导致一项14语回归，修复后13项布局/14语范围再次通过；其余36项在同轮通过。日志在 `output/ios-audit/targeted-tests.log`、`locale-layout-recheck.log`，命令如下：

```powershell
cd app
flutter analyze --no-pub
flutter test --no-pub --concurrency=1 test/platform/scene_controller_test.dart test/platform/observed_scene_controller_test.dart test/ui/scene_process_recovery_test.dart test/ui/startup_prewarm_test.dart test/ui/ios_motion_preference_test.dart test/ui/motion_test.dart test/ui/ios_layout_test.dart test/ui/library_filters_and_header_test.dart test/ui/timer_pause_ui_test.dart test/ui/internationalization_test.dart test/ui/compact_localization_test.dart --exclude-tags landscape
flutter test --no-pub --concurrency=1 test/ui/compact_localization_test.dart test/ui/ios_layout_test.dart --exclude-tags landscape
```

`python app/tools/verify-localization.py`核对14语、270个UI键、591个内容键，failures为空。Info/Privacy/ExportOptions可解析，Info声明14语；两份Bash脚本语法和脚本测试源码的Node语法通过。安全脚本的Mac模拟fixture运行未在Windows执行，不宣称该运行已通过。

短横屏缺口保留真实失败断言，未skip：iPhone13 844×390、2倍字号，L43基线副本 `ios-layout-baseline`（`1f87cc6`）详情溢出44px；整合后同条件仍40px。证据为 `output/ios-audit/baseline-landscape.log` 和 `integration-landscape.log`。以 `flutter test --no-pub --plain-name 'iPhone13 landscape dark text 2.0 core pages fit' test/ui/ios_layout_test.dart`可复现。默认build.sh check的全量测试会报告该已知缺口，本轮仅声明上述比例验证通过，不声明全量测试通过。用户认可的上下半与完整卡片不为使旧测试变绿而改变，后续T02单独处理。

Mac/Xcode编译、签名、实际WKWebView/系统进程回收、iPhone触摸/性能、横屏和Apple重新验包仍待验证；2026-10-10的S4报告保留其实际旧源身份，不迁移为本次成功证据。根目录 npm ci/build/verify 及合并后主目录交付由本次主 Agent 负责执行和登记。

## 独立复核后的首次后台挂载补修

独立审查补充了异步bootstrap已在后台才首次挂载FlareShell的边界：此时观察器没有接收到此前的paused事件，固定初值true会误判前台。现从 `WidgetsBinding.instance.lifecycleState` 初始化可播放状态；只有resumed或尚未知状态null视为活跃。

新增“首次在paused状态挂载→ready”回归，断言没有play命令、visibility=false、同2.375秒。暂停的测试Binding不会安排普通帧，因此测试显式强制挂载帧，在恢复前完成上述断言。`flutter test --no-pub --concurrency=1 test/ui/scene_process_recovery_test.dart` 的原3项加新增1项全部通过；仅复测这一受影响范围，未重复全部49项。累计验证范围增加为50项，这次检查仍不等于实际iOS生命周期/进程回收验收。
