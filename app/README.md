# Flare 托马斯 · Flutter App

从最新 `origin/master` 开展开发。运行源码、Android 测试包和安装历史见[版本台账](docs/version-ledger.md)，实际核对结果见[验证记录](docs/verification.md)，下一轮真机与 iOS 范围见[待验收台账](docs/development-roadmap.md)。

## 运行

在当前工作树的 `app/` 目录执行：

```powershell
flutter pub get
flutter run -d chrome
```

浏览器数据按浏览器与网址保存；需要稳定预览地址时可加 `--web-port 8840`。依赖首次安装需要网络。3D 场景、公共目录与封面随包提供；训练视频由 SDK 首次按需下载，需要网络，缓存命中后可复用，不能据此宣称全部训练媒体离线可用。

安卓模拟器或已连接手机可执行 `flutter devices`，再运行 `flutter run -d <设备ID>`。原生 3D 通过 App 内的 `127.0.0.1` 动态端口读取随包资产。iOS 构建需要 macOS 和 Xcode。Android application ID 为 `dev.mhgd.flare`。源码声明版本以 `pubspec.yaml` 为准，交付 APK 以实际 versionCode、签名和台账哈希核验。

只修改 Dart 页面无需重新制作 3D 包；修改场景代码或模型后，先在 `app/scene` 执行：

```powershell
npm ci
npm run build
```

回到 `app` 后重新运行 Flutter。`assets/scene/` 是场景构建产物，编辑源代码应在 `scene/src/` 完成。制作浏览器验证包使用 `flutter build web --no-web-resources-cdn`，使 Flutter 渲染资源也随包提供；构建后通过本地 HTTP 服务打开，不要直接双击 `build/web/index.html`。

<a id="ai-coach"></a>

## AI 定制（共享 SDK Chat）

计划页「AI 定制」支持描述需求、多轮补充，以及保存或开始训练。入口仅在中文界面且配置有效时显示。`ugk_coach_chat` 管理会话、卡片与输入区，Flare 负责生命周期、本地持久化和业务回调。宿主通过 `CoachChatAgentMode.qaV2` 和 App 提供的 AI 标签配置 SDK。版本以 `pubspec.lock` 和[版本台账](docs/version-ledger.md)为准。

默认使用 UGK New API 中转站，`UGK_COACH_API_KEY` 承载中转站给本 App 发的独立令牌；令牌保存在本机配置，开发运行使用 `flutter run --dart-define-from-file=coach.local.json`。无有效 Key/relay token 时全部 AI 入口隐藏；`UGK_COACH_RELAY_TOKEN` 仅用于可选的自写 Worker 接口，当前 New API 路线不需要它。配置、剂量与安全边界见 [AI 定制说明](docs/ai-coach.md)。

## 当前体验

首页提供 [V5 托马斯动作](docs/flare-v5-model-2026-11-18.md)、八阶段定位、慢放、暂停和单段循环。由「前往训练」进入角度和肌群页时复用实时 3D 画布，返回时延续当前画面。暂停时的肌群热点或同步定位图条目可直达对应计划。肌群颜色表示教学重点，深层位置是示意。

专项训练覆盖 8 个角度、17 个肌群及 72 套计划，提供初、中、高三档，角度 15 复用角度 11 的计划。可切换徒手、居家和健身房，按计划使用替代动作和对应剂量。启用会员控制器的版本按会员状态开启专项训练。

公共动作库和 AI 授权范围见[资产来源](docs/asset-sources.md)。公共动作封面随包，视频由 SDK 按需下载和缓存。`flare-v5` 是 App 本地演示，随包实时渲染。

个人计划、训练会话和进度保存在本机。旧课程、自评、关卡与今日清单数据及 Store 接口保留。设置的「复制本地备份」可导出部分状态，当前备份不提供导入入口。具体范围见[本地数据说明](docs/privacy-local.md)。

3D 接口见[场景说明](scene/README.md)，旧 [v42/R17](docs/motion-v42.md)、[v41](docs/motion-v41.md) 和 [v38](docs/motion-v38.md) 的 App 接入记录用于追溯旧版。

## iOS 对齐与本机验证

iOS 发布构建使用本机签名配置。既有平台差异、配套工具和原生验证记录见 [iOS SDK 平台差异](docs/sdk-ios-readiness-report-2026-11-04.md)及[验证记录](docs/verification.md)。
