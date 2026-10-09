# iOS v1 本地验证（2026-10-10）

开发分支为 `ios/main`，来自 PR #8 的 `ad72f1cc481080072526be918e48748dbec20794`。初始产品为 `63e45e875183bbea344c8b66063dba56e154df08`，加载层保存点为 `3a85bd95b40408aba2723511c2b6dc98606165a2`，最终系统减弱动效修复为 `83f0920ea9e5d613526b89cb2c1768f304d84700`；后续文档提交不改变产品内容。保留 v41 动作、原模型和网页编辑器，未替换 Google Play 的已送审包。

当前结果是模拟器验证和未签名 Release 归档；尚无已签名 IPA、TestFlight 或正式 App Review 记录。用户要求先完成无需真机的工作，再连接 iPhone。真机性能、触感、离线网络证据和 iOS 15 兼容性仍需设备验证。

## 修复与回归

| 问题 | 修改与实际证据 |
|---|---|
| 新 WKWebView 的初始状态覆盖尚未完成的详情模型恢复 | `SceneController` 接收旧状态时保留排队的 `detail_model`；明确播放、定位和退出详情才取消。修前回归测试失败，修后通过；实际进程中断后恢复肌群人台及 2.375 秒暂停帧 |
| 小屏与大字布局溢出 | 首页时间文本可收缩，计时页标题可换行；20 组尺寸/方向/主题/文字比例组合通过 |
| 构建脚本还原用户配置 | 删除自动 `git checkout`，保留依赖失败和无效命令时的改动；支持独立 Flutter SDK、明确设备 ID，拒绝签名占位配置。生产构建明确使用 `lib/main.dart` |
| 启动图仍是 Flutter 透明模板 | 复用现有品牌图，居中限制为 120pt；最终 Archive 没有模板启动图警告，未重新生成品牌素材 |
| 浅色主题冷启动时加载层露出深色舞台 | `AppShell` 在场景未就绪时以当前主题覆盖整个舞台，就绪后淡出；减弱动态效果时直接切换。加载层保存点的冷启动原帧、UI 回归及实际 WebContent 中断恢复通过 |
| iOS 系统减弱动效已开启，Flutter 加载图标仍旋转 | 本机 Flutter SDK 将 iOS `AccessibilityFeatures.reduceMotion` 与 Android `disableAnimations` 分开提供。应用现在在入口合并为继承动效偏好，并监听系统变更；首段加载也复用品牌加载图。修前两项回归失败、修后通过；真实系统标志和正式入口静止加载录像通过 |
| 零时长页面/尺寸动画在原生流程中触发构建或布局重入 | 页面完成回调只在实际动画结束时触发，零时长分支在帧后回调一次；四处尺寸过渡在零时长时直接布局。修前导航回归与原生流程失败，修后原生详情/模型/计时/保存通过；保留失败日志 |

## 工具链

- 独立 Flutter 3.47.6 / Dart 3.13.5；原 SDK 保留。
- Xcode 26.6（17F113）；iPhoneOS SDK 26.5.1（23F81a）。
- Apple 官方 iOS 26.5 Simulator Runtime（23F73），已验证签名。
- 本机 SDK 默认匹配的 runtime build 不可用；通过 `xcrun simctl runtime match set iphoneos26.5 23F73` 指向已安装的官方 runtime 后成功构建。没有修改 SDK 文件。
- 测试只使用本任务建立的 Flare 模拟器，不删除或重置用户设备。取证完成后仅删除本任务的 SE3/Pro/Pro Max 临时设备，保留 iPhone 13 和最终生产入口供本机审阅；历史设备/日志记录保留。

## 软件与原生流程

| 检查 | 结果与范围 |
|---|---|
| `bash tools/ios/build.sh check` / 最终定向回归 | 初始产品的全套 96 项单元/组件测试通过；3a85bd9 的 57 项 UI 复测保留。最终 analyze 无问题，`flutter test --no-pub --concurrency=1 test/ui` 全部 60 项通过，包含三项修前失败的系统动效/回调回归。没有把定向复测记成全套重新执行 |
| `node tools/ios/test-build-tools.mjs`、`bash -n`、`git diff --check` | 通过；假 SDK 回归验证配置保留、显式入口/SDK/设备及占位签名拒绝，不使用 Apple 凭据 |
| 布局 | SE3、iPhone 13、Pro Max 竖屏，以及 SE3/iPhone 13 横屏；深浅主题 × 1x/2x 文字，共 20 组。验证首页、详情、训练选择/详情、计时及安全区；这是组件布局证据 |
| 首启与本地数据 | 实际 `lib/main.dart` Bootstrap、安全确认、原生 WKWebView、深浅主题、倒数进入工作、暂停/继续、退出保存、原生 SharedPreferences 重读通过。未完成记录不虚报训练/课程完成 |
| 原生流程设备 | SE3、iPhone 13、iPhone 17 Pro、iPhone 17 Pro Max，均为 iOS 26.5 模拟器；两种主题都通过，不代表真机性能 |
| 最终系统动效 / 场景资源 | iPhone 13 实际开启 Reduce Motion，`FLARE_EXPECT_REDUCED_MOTION=true` 原生流程通过：系统 `reduceMotion`、Flutter `disableAnimations`、WKWebView `prefers-reduced-motion` 均为真。当前场景加载窗口有 5 个资源，外部 HTTP(S) 来源为零，origin 为 127.0.0.1；不是全程流量或飞行模式证据 |

### WKWebView 与恢复

使用接受到的原生 `state` 确认帧、选择、详情及模型，不能把本地命令后的乐观状态或 `ready` 当作恢复完成。

| 设备 / 触发方式 | sceneReadyMs | 状态确认数 | 结果 |
|---|---:|---:|---|
| Pro Max / 注入 host error | 4535 | 33 | 播放时钟推进、暂停 2.375 秒、详情、模型交换、恢复、连续错误后手动重试、返回同帧通过 |
| SE3 / 注入 host error | 3780 | 33 | 同上，通过 |
| Pro / 初始产品，实际模拟器 WebContent 进程中断 | 2726 | 32 | 两次实际中断通过：第一次自动重建并恢复肌群人台/同帧；一分钟内第二次出现错误卡，重试后恢复 |
| Pro / 加载层保存点 3a85bd9，实际进程中断 | 1422 | 33 | 加载层补修后的两次实际中断复测通过；恢复肌群人台和 2.375 秒帧，连续中断后错误卡/重试通过。最终系统动效补修未改平台恢复或场景代码，未重复本项 |

实际中断由宿主在测试打印的两个标记处触发：核对只有一个本任务模拟器启动、Flare 正在该设备运行，再核对进程可执行路径属于 `/CoreSimulator/Volumes/iOS_23F73/`，每次只中断唯一匹配的 WebContent 进程。Mac 浏览器 WebContent 不在目标中。测试开关为 `--dart-define=FLARE_VERIFY_OS_RECOVERY=true`；默认测试仍用错误注入。

该证据证明真实终止回调与恢复分支，不证明真机内存压力、恢复时延上限或长时间稳定性。各次启动上下文不同，sceneReadyMs 不用于性能比较。初次人工触发因没有在 90 秒内中断而超时；最终复测的第一次宿主尝试因路径包含空格触发保护性停止，没有中断任何进程。改为保留完整路径的精确匹配后复测通过；失败日志保留，没有计为通过。

## 正式入口人工检查

在 iPhone 13 模拟器安装以 `lib/main.dart` 构建的应用后，使用原生 Simulator 操作：

- 正在播放时按 Home，实际后台至少 41.6 秒，回来显示同一 2.9 秒暂停帧和正常 3D。
- 模型长按 1.6 秒没有弹出复制或网页上下文菜单。
- 详情往返 30 次，每次返回同一 7.2 秒暂停帧，未出现场景错误卡。
- 跟随系统深浅切换，App 主题和状态栏图标颜色对应。
- 计时工作阶段实际后台 94.3 秒，回来保持暂停 6 秒，多次观察稳定；点击继续后倒数推进。
- 实际完成直臂侧平板支撑 3 组，每组左右各 20 秒，完整倒数、换侧和休息后保存，没有提前完成或跳休息。终止并冷重启 App 后，完成 3/3 的记录和训练日保留，安全确认不重复出现。
- 同一调试进程持续 1458 秒（24 分 18 秒），期间完成上述 30 次详情往返和 3 组训练。这是模拟器进程存活证据，不是 fps、温度或真机稳定性验收。
- 实际锁屏 411.3 秒后 Simulator 持续黑屏，唤醒/返回尝试未恢复可操作界面；保留证据后仅重启本任务设备，App 与数据恢复。锁屏返回未完成，不据此判定 App 故障，需真机复验。

手势仍需真机核对连续拖动、双指缩放/平移限制、边缘返回和命中手感；本轮不将宿主鼠标拖动直接记为全部触摸验收通过。

最终 `83f0920` 使用实际 `lib/main.dart` Debug 构建（17.4 秒）再次安装：系统动效开启时首启、安全确认与真实 3D 加载通过，`system-reduced-motion-fixed-cold-iphone13.mp4` 和原帧显示加载标记静止。系统开关之后恢复原来的关闭状态，`system-reduced-motion-final-restored.png` 留证；保留该生产入口供本机审阅。原生 integration_test 会重新安装测试 App，本轮恢复生产入口后重新出现首启；测试内恢复学习键不作为跨安装用户数据保留保证，仅在本任务隔离模拟器运行。

## 截图

四种机型 × 两种主题 × 五个页面，共 40 张原生 UIKit 截图，包含实际 WKWebView 3D。五个页面为首页、动作详情、肌群人台、训练详情、计时。每张保留 PNG 原件，并另导出无透明通道 JPEG；没有缩放、拼接或添加宣传文字。截图捕获于初始产品 `63e45e8` 的就绪页面；后续修复加载阶段和系统减弱动效，默认动效下的就绪页面素材继续复用，并补充原生系统动效流程、冷启动录像及历史实际中断验证，没有声称 40 张全部重拍。

| 目录 | 原始像素尺寸 | PNG / JPEG 数 |
|---|---|---:|
| `screenshots/se3/` | 750×1334 | 10 / 10 |
| `screenshots/iphone13/` | 1170×2532 | 10 / 10 |
| `screenshots/pro/` | 1206×2622 | 10 / 10 |
| `screenshots/pro-max/` | 1320×2868 | 10 / 10 |

本机证据根目录记为 `IOS_EVIDENCE_DIR`，本轮实际为 `~/ios-release-artifacts/flare-v1-20261009`。截图、录像、完整原生日志和候选包不入 Git；`screenshot-manifest.json` 包含尺寸、字节数与逐张 SHA-256。原生截图来自 App 视图，组件测试关闭 3D 的布局截图没有用于商店素材。

可复现命令（先启动本任务模拟器；`FLUTTER_BIN` 指向上述独立 SDK）：

```bash
FLUTTER_BIN=/SDK路径/bin/flutter bash tools/ios/build.sh check
node tools/ios/test-build-tools.mjs
"$FLUTTER_BIN" test integration_test/ios_smoke_test.dart --no-pub -d <模拟器ID>
FLARE_IOS_EVIDENCE_DIR="$IOS_EVIDENCE_DIR/screenshots/pro" \
  "$FLUTTER_BIN" drive --no-pub --driver=test_driver/ios_screenshots.dart \
  --target=integration_test/ios_workflow_test.dart \
  --dart-define=FLARE_CAPTURE_SCREENSHOTS=true \
  --dart-define=FLARE_SCREENSHOT_THEME=light -d <模拟器ID>
```

`FLARE_SCREENSHOT_THEME=dark` 获取深色组。测试临时替换该隔离模拟器里 Flare 的学习键，结束时恢复原值；截图通过 driver 接收并写到宿主，测试结束卸载 App 后仍保留。

系统动效复测先在本任务模拟器的“设置 → 辅助功能 → 动态效果”开启减弱动态效果，再执行：

```bash
"$FLUTTER_BIN" test --no-pub \
  --dart-define=FLARE_EXPECT_REDUCED_MOTION=true \
  -d <隔离模拟器ID> integration_test/ios_workflow_test.dart
```

完成后恢复系统开关原值并重新安装 `lib/main.dart` 生产入口。该测试直接读取真实 WKWebView 媒体查询及 Resource Timing，不改场景资产、不代理系统网络。

## Release 候选与发布边界

```bash
"$FLUTTER_BIN" build ipa --release --no-codesign --no-pub --target=lib/main.dart
```

最终 Archive C03 成功（32.9 秒），产品源 `83f0920ea9e5d613526b89cb2c1768f304d84700`；`1.0.0` / Build `1` / `dev.mhgd.flare`，最低 iOS 15.0，仅 iPhone，竖屏与左右横屏。主可执行文件、App.framework 和 Flutter.framework 均为 arm64。主 App 没有签名或 embedded provisioning profile，Flutter 明确跳过 IPA 导出，不能作为上传包。

归档内四份有效隐私清单均声明不追踪、不收集数据：App 的 UserDefaults 理由 CA92.1，SharedPreferences 的 UserDefaults 理由 1C8F.1，Flutter 的 FileTimestamp 理由 0A2A.1/C617.1 与 SystemBootTime 理由 35F9.1；WKWebView 资源清单没有访问 API 声明。最终签名包与真机流量还要复核。

最终候选独立保存到 `IOS_EVIDENCE_DIR/candidate/Flare-1.0.0-build1-unsigned-r3.xcarchive`，215,768,913 字节、305 个普通文件；`candidate-manifest-r3.json` 记录源提交、身份、归档文件/字节数、三个可执行文件 SHA-256 与四份清单。C01/C02 归档及各自 manifest 保留作历史证据。未生成 IPA，所以没有 IPA 哈希。

此前用用户指定的 Playwright Chrome profile 只读核对 Apple 页面时，账号已登录、有其他已发布应用；Identifiers 列表尚无 `dev.mhgd.flare`，App Store Connect 尚无 Flare 条目。本任务未注册标识、创建 App、下载签名、上传、分发或提交审核；操作前再次核对账号和外部状态。提交文案及隐私/年龄/素材权利事项见 [商店材料](ios-app-store-v1.md)，逐项验收见 [执行台账](ios-plan-2026-10-09.md)。
