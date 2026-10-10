# iOS v1 本地验证（2026-10-10）

开发分支为 `ios/main`，来自 PR #8 的 `ad72f1cc481080072526be918e48748dbec20794`。初始产品 `63e45e875183bbea344c8b66063dba56e154df08`，加载层 `3a85bd95b40408aba2723511c2b6dc98606165a2`，系统减弱动效修复 `83f0920ea9e5d613526b89cb2c1768f304d84700`；S2 产品源 `a4ef59fdf8e6d6c9dd005aba55debbb80ab667a9` 仅收窄资产打包以排除生成源码，原运行 JSON、v41、模型和页面代码保留。各原生证据仍绑定其实际源；未替换 Google Play 已送审包。

Apple 当前仍为 S2 Build 1，已处理为 VALID、绑定商店草稿并进入指定单账号内部组，自动分发关闭；已授权的商店信息、免费/全部 175 个地区供应、手动发布及关闭 Mac/Vision Pro 商店供应已保存，素材发布权由用户确认。最新本地 S4 源 `7ffa5e6`、`1.0.0 (3)` 清理关于页两处过期文案，10 项相关 UI 测试、analyze、签名验包与 Apple 验证通过，未上传。Build 3 调试版已升级至自建模拟器，本地偏好未变，同源调试版关于页文字、署名、布局和图标原生复查通过。公开隐私政策[修订草稿](privacy-policy-ios-v1-draft.md)已准备；现有 Worker 源码及部署元数据已备份，精确修订通过语法和六种本地 handler 核查，未发布。真机、最终合规与正式 App Review 待完成，按用户要求先完成无需真机的工作。

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

未签名检查点 Archive C03 成功（32.9 秒），产品源 `83f0920ea9e5d613526b89cb2c1768f304d84700`；`1.0.0` / Build `1` / `dev.mhgd.flare`，最低 iOS 15.0，仅 iPhone，竖屏与左右横屏。主可执行文件、App.framework 和 Flutter.framework 均为 arm64。C03 主 App 没有签名或 embedded provisioning profile，Flutter 当时跳过 IPA 导出，不能将 C03 作为上传包。

归档内四份有效隐私清单均声明不追踪、不收集数据：App 的 UserDefaults 理由 CA92.1，SharedPreferences 的 UserDefaults 理由 1C8F.1，Flutter 的 FileTimestamp 理由 0A2A.1/C617.1 与 SystemBootTime 理由 35F9.1；WKWebView 资源清单没有访问 API 声明。S1/S2 签名包均已复核这些清单，真机流量继续待验。

C03 独立保存到 `IOS_EVIDENCE_DIR/candidate/Flare-1.0.0-build1-unsigned-r3.xcarchive`，215,768,913 字节、305 个普通文件；`candidate-manifest-r3.json` 记录源提交、身份、归档文件/字节数、三个可执行文件 SHA-256 与四份清单。C01/C02/C03 归档及各自 manifest 保留作历史证据；当时没有 IPA。

### 历史：用户授权后的签名候选 S1

用户明确批准注册 `dev.mhgd.flare`、创建“Flare 托马斯”（简体中文，SKU `flare-ios-v1`）、按需配置签名并本地导出、普通推送分支；上传与提审另行确认。`ios/main@cb6aabb` 已普通推送，`git ls-remote` 返回相同 SHA。生产目录与产品源 `83f0920` 相同，本轮只记录发布事实，没有修改生产源码。

使用工程 `Runner.xcworkspace` / `Runner` / `Release` / `generic/platform=iOS` 归档，明确 `FLUTTER_TARGET=lib/main.dart`、本机 Team、自动签名及已授权的 `-allowProvisioningUpdates`；`xcodebuild -exportArchive` 使用本机权限 0600 的导出配置，`method=app-store-connect`、`destination=export`，关闭自动修改版本/Build。归档和导出均成功；原始日志及配置只保留在本机私密目录，不输出或提交账号/Team/证书身份。

| 检查 | S1 已核对结果 |
|---|---|
| 身份 | `dev.mhgd.flare / 1.0.0 (1)`，源 `83f0920`，最低 iOS 15.0，仅 iPhone |
| 分发 IPA | `IOS_EVIDENCE_DIR/candidate/Flare-1.0.0-build1-app-store-S1.ipa`，50,095,200 字节 |
| SHA-256 | `cd280f67d66858f4f15570a426a048ab1a77e88ce9db7e0218b369ae6e8c861c` |
| 签名 | `verify_ipa.sh` 与 `codesign --verify --deep --strict` 通过，Apple Distribution 证书；提取叶证书与 embedded profile 中的证书一致 |
| 描述文件 | 明确 App Store 分发，Bundle ID 与授权 Team 匹配；无设备白名单/企业全设备属性；`get-task-allow=false`、`beta-reports-active=true`，未过期 |
| 架构与资源 | Runner、App.framework、Flutter.framework 三个可执行文件均 arm64；251 份 Flutter 资源的文件集合与逐文件 SHA-256 均与 C03 相同 |
| 隐私 | 四份清单均有效、不追踪、不收集；访问 API 理由与 C03 保持一致，真机实际流量待验 |
| 本机证据 | `signed-ipa-s1-verification.log`、`candidate/candidate-manifest-s1.json`、`authorized-release-step-20261010.json` |

重新核对指定 Playwright Chrome profile 时 Apple 网页登录已过期，由用户在页面完成登录；Developer 门户随后确认已有 `dev.mhgd.flare`。App Store Connect 已创建并核对 [Flare 托马斯](https://appstoreconnect.apple.com/apps/6821186142/distribution/info)，名称、Bundle ID、简体中文与 SKU 均匹配。Apple 创建时提示访问设置保存失败，但确认 App 已创建且所有团队用户可访问，与所选完全访问一致；未重复点击创建或修改其他团队权限。Apple 初始化的商店版本为 `1.0`、准备提交；后续按具体授权调整为候选版本并保存文案/截图。

S1 静态核查通过后，用户另外授权精确该文件上传与商店草稿保存。Apple 上传前验证返回 90035，指出 `Runner.app/Frameworks/App.framework/flutter_assets/assets/data/import_content.py` 是未签名代码；没有执行 S1 上传，旧包及原始验证日志保留。

上传前预检曾将首批选图由 Pro Max 更正为当前必需中尺寸 iPhone 的十张 Pro 原图（1206×2622）。用户批准后已保存版本 `1.0.0`、中文描述/关键词/副标题、健康健美/教育分类和支持/隐私网址；重新加载或重开编辑框核对一致。十张截图在平台为 `10/10`，服务器状态全部 `COMPLETE`、无错误，原始大小/校验和及浅色五页后深色五页的顺序一致。证据为 `app-store-draft-saved-20261010.json` 和 `app-store-screenshot-server-evidence.json`，不是 IPA 上传或正式合规声明。
### 修复 Apple 上传前验证后的候选 S2

`a4ef59f` 只将 `pubspec.yaml` 的整目录数据资产改为六个明确 JSON，仓库内的 `import_content.py` 和 `stages-source.ts` 原件保留。运行所需四个 JSON、模型/图像及页面源码未改；执行 `flutter test --no-pub test/domain/catalog_dose_test.dart test/data/muscle_knowledge_test.dart --reporter expanded`，6 项通过。清理该工作副本的可再生构建缓存后 `flutter pub get`、`flutter analyze --no-pub` 通过；相同 workspace/scheme 的 Release 归档及 App Store 导出成功，没有重新配置账号或创建证书。

| 检查 | S2 结果 |
|---|---|
| 精确源 / 身份 | `a4ef59fdf8e6d6c9dd005aba55debbb80ab667a9`；`dev.mhgd.flare / 1.0.0 (1)` |
| 本机 IPA | `candidate/Flare-1.0.0-build1-app-store-S2.ipa`；50,642,770 字节 |
| SHA-256 | `87d58c73f058ab6ef5f4fd4030af4b602bea65c93971c69db9978774cd40129f` |
| 验签 / 分发 | 严格深度验签通过；同一 App Store 描述文件未过期，实际签名证书与描述文件及授权 Team 匹配，`get-task-allow=false`、无设备清单/企业标记 |
| 架构 / 隐私 | Runner、App.framework、Flutter.framework 均 arm64；四份隐私清单可解析、无追踪/收集声明且逐文件字节与 S1 相同 |
| 资源差异 | S1 的 251 份改为 249 份，排除两份生成源码，无新增资源；245 份文件哈希不变。AssetManifest.bin 随资产列表更新；清理重建后的 MaterialIcons 字体从 5,136 至 1,645,184 字节，图标源与应用代码未改 |
| Apple 上传前验证 | 使用当前账号现有发布凭据，`xcrun altool --validate-app -f <S2> -t ios … --output-format json` 退出 0，返回无验证错误 |
| 状态 / 边界 | `INTERNAL_TESTING`；S2 上传并处理为 VALID 后，用户另行授权内部组与指定单账号邀请，构建“正在测试”；没有确认实际安装、重跑全套模拟器流程或完成真机/正式提审 |

本机 `candidate-manifest-s2.json`、`s2-signing-checks.json`、`s2-asset-comparison.json`、`signed-ipa-s2-verification.log` 留存结果；包含账号/签名元数据的原始归档、导出和 Apple 日志只在权限受限私密目录。S1 上传授权绑定旧哈希，S2 不沿用；S2 上传与内部测试分别取得授权，外部测试、最终合规、提审和公开发布继续分别确认。

### S2 上传与 Apple 处理

用户明确回复“允许上传这份 S2”后，重新核对源、身份、50,642,770 字节及 SHA-256 一致；当时 TestFlight 页面无构建版本。使用本机现有发布凭据执行 `xcrun altool --upload-package <精确 S2> … --output-format json --show-progress`，工具退出 0，Apple 回执无上传错误。原 IPA 未重新打包或导出，上传后哈希保持；S1 未上传。

按成功回执查询 `altool --build-status --delivery-id <私密回执标识> … --output-format json`，退出 0，`build-status=VALID`、`import-status=VALID`、`is-on-app-store-connect=true`、`build-audience-type=APP_STORE_ELIGIBLE`。Apple 显示上传日期为 2026/10/10 10:13:23（本机时间），最低 iOS 15.0，`uses-non-exempt-encryption=false`；该值来自已上传构建，不是本轮手动提交的最终合规声明。指定 Playwright 配置重新加载后，版本 1.0.0 的构建版本 1 显示“准备提交”，邀请/安装等列为未开始。

本机 `app-store-upload-s2.json`、`candidate/upload-attempt-s2.json` 及更新后的 `candidate-manifest-s2.json` 绑定授权、精确文件和处理结果；凭据、交付回执及原始日志仅在权限受限目录。上述“准备提交”是上传处理完成时的历史状态，之后按单独授权进入以下内部测试状态。

### S2 内部测试配置

用户明确选择内部测试方案，并指定一个测试账号；邮箱中的全角域名句号规范化后，仅保存在本机私密文件。使用指定 Playwright profile 核对该账号已是当前团队的可选内部测试员，没有新增团队用户或更改职能。

创建“Flare iOS v1”内部组时，先取消默认勾选的自动分发，再点击创建；添加已处理的 S2 `1.0.0 (1)`，在测试员选择器中只勾选指定的一名账号并添加。重新加载后群组为 **1 名测试员、1 个构建版本**，构建为“正在测试”、账号为“已邀请”，设置仍显示“手动分发 Xcode 构建版本”。60 字测试说明已保存并重新加载核对。2026-10-10 10:37–10:40（本机时间）留证；S2 的 50,642,770 字节及原 SHA-256 再次核对不变。

本机 `authorized-testflight-internal-s2-20261010.json`、`testflight-internal-s2-20261010.json` 与更新后的 `testflight-internal-plan-s2.json` 记录授权与平台状态；测试员身份和原始页面只在权限受限私密目录。Apple 的“已邀请”不证明邮件已到达、邀请已接受或真机已安装；未开外部组、公开链接、外部 Beta Review 或正式 App Review。后续设备验收须绑定最新获准、实际已上传并分发的候选；当前 S3 尚未上传，不能把 S2 配置状态记作 S3 已就绪。

### 已授权的剩余商店草稿

用户同意推荐的草稿方案、明确首发“免费，全部可售地区”，并确认深浅训练图与品牌图发布权后，保存了 S2 绑定、无需登录、292 字审核说明、复用本账号已发布 App 的版权和四项审核联系人、审核通过后手动发布。重新加载后联系人、版权与审核说明均比对一致；个人信息只存 Apple 页面与本机权限受限目录。

Apple 服务端响应中，174 个自动地区价格与 1 个基准价格的 `customerPrice` 均为零；175 个供应地区的 `available=true`、`preOrderEnabled=false`，将来新增地区供应开启。Mac 与 Vision Pro 两项公开商店供应标志均为 false。商店版本仍为准备提交；年龄、Content Rights、App Privacy 最终问卷和 App Review 尚未提交。本机 `app-store-remaining-draft-s2-20261010.json` 与原预检记录关联留证，不含私人联系信息。

### 关于页文案补修后的本地候选 S3

实际关于页使用 `aboutBody`；其旧“本地开发版 0.1.0”前缀与正式 `1.0.0` 不一致。通过 ARB 源删除此前缀并运行 `flutter gen-l10n`，不另加版本读取依赖；已上传 Build 1 不复用，`pubspec.yaml` 递增为 `1.0.0+2`。同一源提交保存了公开隐私页修订草稿，未修改实际存储、数据流、模型、图像或场景实现。

| 检查 | S3 结果 |
|---|---|
| 产品源 / 身份 | `b81026afad35e808cf0acb30714874f06b5b44dd`；`dev.mhgd.flare / 1.0.0 (2)` |
| 软件检查 | `flutter analyze --no-pub` 退出 0；`flutter test --no-pub test/ui/flow_regressions_test.dart --reporter expanded` 10 项通过；生成翻译及 Release config-only 成功 |
| Archive / export | Runner workspace/scheme、Release、generic iOS 归档与 App Store 导出成功；复用已有签名资源，本次不带 `-allowProvisioningUpdates`；导出禁止自动改变版本/Build |
| IPA | `candidate/Flare-1.0.0-build2-app-store-S3.ipa`；50,089,766 字节；SHA-256 `e6d4a856302df2a30a5498ccfa0a0cd2bf08540c8f1f7376ce788fd04a0d09ba` |
| 签名 / 执行文件 | zsh Skill 验包退出 0，严格深度验签通过；描述文件、实际签名证书、授权 Team 和应用标识匹配，未过期、App Store 分发、`get-task-allow=false`；Runner/App/Flutter 三个执行文件均只含 arm64 |
| 资源 / 隐私 | 249 份 Flutter 资源中 248 份与 S2 哈希相同；模型、训练图、场景及运行数据全部不变，两个生成源码继续排除；四份隐私清单与 S2 字节一致并可解析 |
| 生成字体 | S2 带完整 MaterialIcons 字体 1,645,184 字节，S3 为 5,136 字节子集，含 35 个字符映射；源码引用的 28 种 Icons 常量在当前 Flutter SDK 与 IPA 字体 cmap 中全部匹配，无缺失字形 |
| Apple 验证 | 使用已授权本机现有发布凭据运行 `altool --validate-app`，退出 0，无验证错误；未执行上传 |
| 状态 / 限制 | 历史 S3 验证通过；因过期授权提示补修被本地 S4 取代，未上传/分发；没有重新运行全套原生模拟器流程或完成真机验收 |

本机 `candidate-manifest-s3.json`、`s3-signing-checks.json`、`s3-asset-comparison.json`、`s3-icon-glyph-coverage.json` 与 `apple-validation-s3.json` 绑定上述结果；原始日志只在私密目录。S3 未上传；发现素材授权旧提示后，当前推荐候选改为下述 S4。旧 S3 请求不能作为 S4 授权；最终设备与合规声明须对应实际获准的最终 Build。

### 原生关于页核对与本地候选 S4

在自建 iPhone 13 模拟器的原已安装 Build 1 关于页，实际观察到旧“本地开发版 0.1.0”及“发布前需补齐授权核对”。前者已在 S3 删除；后者在 S3 的 `creditsBody` 中仍存在，与用户已确认素材发布权的事实不符。S4 仅从 ARB 清理该过期提示，将来源表述为应用发行者提供；Snow CC BY 4.0、Human Base Meshes CC0、Three.js MIT 及教学示意限制均保留。生成翻译由工具更新，Build 递增为 3。

| 检查 | S4 结果 |
|---|---|
| 产品源 / 身份 | `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`；`dev.mhgd.flare / 1.0.0 (3)` |
| 软件 | `flutter gen-l10n`、`flutter analyze --no-pub`、10 项 `flow_regressions_test` 均成功，diff check 通过 |
| 签名候选 | Runner Release Archive 与 App Store export 成功，复用已有资源，未使用 `-allowProvisioningUpdates`，导出不自动改版本/Build |
| IPA | `candidate/Flare-1.0.0-build3-app-store-S4.ipa`；50,089,798 字节；SHA-256 `8cf1ec14b009dce4120edde85574ac732d2445128767bb41bd0d848c11b9493f` |
| 静态核查 | zsh 严格验包退出 0；App Store 描述文件未过期、实际证书/授权 Team/标识匹配、get-task-allow=false、beta-reports-active=true；三个执行文件只含 arm64 |
| 资源 / 隐私 | 249 份资源与 S3 的集合及逐文件 SHA-256 全部一致；四份有效隐私清单字节一致；28 种源码图标的所需字形均存在 |
| Apple 验证 | 现有本机发布凭据，`altool --validate-app` 退出 0，无错误；没有上传 |
| 本机原生准备 | 正式 `lib/main.dart` 的 Debug Simulator Build 3 构建、安装和启动成功；升级前后既有偏好文件哈希相同，无数据重置。该调试版不是签名 App Store IPA |
| 界面门禁 | 用户手动解锁后，在同源 Debug Build 3 中实际进入设置 → 关于 Flare；旧版本文字及过期授权提示均消失，完整署名和教学/草稿限制保留；布局、返回/备份/许可图标正常。上下段原生截图留证，未点击复制备份或把此检查当作签名 IPA/真机执行 |
| 原生截图 | 本机发布证据目录的 `native-about-s4-top.png` 与 `native-about-s4-bottom.png`；Simulator 保存的原图，身份已核对为 dev.mhgd.flare / 1.0.0 (3)，不入 Git |
| 状态 | `VALIDATED_AWAITING_EXACT_UPLOAD_AUTHORIZATION`；原生关于页复查通过，精确 S4 上传/草稿绑定/内部组更新授权已请求并待回复；未上传、未内测更新、未真机验收或提审 |

本机 `candidate-manifest-s4.json`、`s4-signing-checks.json`、`s4-asset-comparison.json`、`s4-icon-glyph-coverage.json`、`apple-validation-s4.json` 与 `native-about-s4-build.json` 留证。S2 是当前 Apple 交付，S3 是保留的历史本地候选；所有旧文件与原授权边界保留。

### 公开隐私页现有源码与精确修订准备

2026-10-10 通过用户指定的 Playwright 配置恢复访问现有 `flare-privacy`，读取生产 `index.js`、部署元数据、空路由与空绑定列表，并保存私密备份。原模块 SHA-256 为 `91ac729876aaa1765d8fdb2908498b718fd0e13f0fe4cc707f330ce2f8aa12f2`；解码后的 HTML 与当前公开 HTTP 200 响应字节一致，早期 DOM 基线仅有标签间空白差异。联系方式未进入 Git。

[政策草稿](privacy-policy-ios-v1-draft.md)对应的精确补丁只替换 HTML 文案、标题与日期，原 fetch handler、响应头、样式、联系段落及现有服务配置保留；3,060 字节，SHA-256 `efa675a77737fc1380426a3721de65567e5ad9d77128759b102c02697c4721f0`。`node --input-type=module --check` 退出 0；原/新模块在两条路径 × GET/HEAD/POST 的六种本地调用中，状态与响应头一致、新响应与预览 HTML 完全相同，不发送网络请求。尚未公开部署，需单独授权；最终 App Privacy 仍待精确候选真机流量及发行者确认。
