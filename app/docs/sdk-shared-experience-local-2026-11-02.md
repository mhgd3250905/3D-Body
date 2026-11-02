# 共享 SDK 本机验证与内测包（2026-11-02）

分支 `codex/sdk-shared-experience`，接手源 `a672412c47aae3bc3665fb0ca16288d2b969e610`，基础 `master 4f091ac`。四个共享 SDK 包固定 `d4502f35b1503d41cd782aa7fb3780c7f6591ad0`。本轮只推该测试分支，未改 SDK、主线、release 分支、tag、商店或媒体服务。

## 验证与修订

Flutter 3.44.7 / Dart 3.12.2；`flutter pub get` 通过。App 全工程 `flutter analyze` 无问题。首轮全量测试 293 通过、5 失败；修订后全量 `flutter test --no-pub --reporter expanded` 为 **322 通过、4 失败**。

- `e006f8c`：计划保存测试显式声明瑜伽垫上下文，保留完整计划往返与过期修订冲突断言。
- `a15828c`：按共享公共目录验证未审节奏的手动计次；分段媒体验证 SDK poster 路径与真实图片解码，等待时不推进训练时钟；加载生产字体，增加正常字号的 14 语浅深覆盖。

正常字号 28 项全部通过。剩余失败均在共享 SDK 1.5 倍字号：阿拉伯语浅深各底部溢出约 0.963px，印地语浅深各约 2px。保留原断言，不缩字、不修改 SDK。不是全绿交付。

本轮没有删除或跳过用例，已有 2.0 倍用例继续保留。迁移分支在本轮开始前相对 master 已删除的测试文件：`data/drill_media_test.dart`、`platform/drill_media_controller_test.dart`、`ui/ai_coach_test.dart`、`ui/ai_coach_review2_test.dart`、`ui/coach_live_smoke_test.dart`、`ui/coach_question_bubble_test.dart`（均在 `app/test/` 下）。这些属于旧媒体/聊天实现的迁移删除，并非本轮删测试以规避失败。

本机原始日志：`output/shared-sdk-app-analyze-final-20261102.log`、`output/shared-sdk-tests-final-20261102.log`、`output/shared-sdk-build-20261102.log`。一次额外从仓库根运行的分析误扫历史 output 预览，得到 841 项历史诊断；不属于用户要求的 app 分析范围，未据此修改历史文件。

## 包与设备

版本按用户指定为 `1.0.12+17`，arm64 release，使用既有内测签名和既有本机私有配置通过构建参数注入 AI 测试配置。私有配置不提交、不作为 asset 打包，含测试凭据的 APK 只保留本机。

连接设备为红米 `QSG6Q8IFDMDELVGQ`；安装前实测已为旧 SDK029 `1.0.12+17`（不是 +16），首次安装时间 `2026-10-08 17:53:04`。用户追加授权保留数据覆盖安装，并收窄为基本核对，正式使用和视觉细节由用户验收。

APK：`output/releases/Flare-SharedSDK-1.0.12+17-20261102-arm64.apk`。包内 0 MP4、211 张 public_posters WebP，只有 arm64-v8a；签名及 16KiB ZIP 对齐检查通过。默认上传签名与旧安装证书不同，因此用本机既有 Android 内测密钥重签，未修改源码签名配置。

设备安装存在版本号差异：Flutter `--split-per-abi` 自动将构建号 17 偏移为实际 versionCode **2017**，该包已同签名保留数据安装并确认首页 3D 正常、首次安装时间不变。此为执行疏漏，未达到手机实际 versionCode 17 的要求。随后从原始 versionCode 17 的 release 包移除插件附带的非 arm64 库，经 zipalign 和原内测密钥重签，得到上述 versionCode **17** 的 APK。尝试 `install -r -d` 被系统以 `INSTALL_FAILED_VERSION_DOWNGRADE` 拒绝，未卸载或清数据；手机仍为同源码的 **2017**，可供用户使用验收。

包内容、签名、安装及启动事实见本机 `output/shared-sdk-delivery-20261102/receipt.json`；启动截图 `launch.png` 保存在同目录。该记录不能写作手机已安装 versionCode 17。

## SDK 缺口和设备待验

静态核对保留四项 SDK 缺口：CoachChatController 未接 UsageSink；动作库缺初始筛选，肌群入口丢筛选；CoachChatPage 缺返回按钮，只能系统返回；估时未含换侧余量。没有在 App 绕过。

用户已收窄设备检查。断网冷启动、训练库/详情/按需播放及离线 poster、计划入场闪屏、真实 AI 安全确认/生成/保存/各跳转、训练保存重试、深浅主题/语音/语言门禁等完整真机细项均交用户使用验收。单元/组件结果不替代真机证据。
