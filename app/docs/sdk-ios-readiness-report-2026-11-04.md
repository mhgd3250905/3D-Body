# 给 UGK SDK 团队：Flare iOS 接入缺口与交付要求

日期：2026-11-04。请在 SDK 侧补齐 iOS 支持后交付固定版本，Flare 继续消费共享实现，不在 App 内复制播放器或修改 pub cache。此报告供用户转发，本会话没有向 SDK 团队发送消息、修改 SDK、推送或发布。

## 结论

**当前固定 SDK 的公共透明示范视频后端只有 Android，Flare iOS 无法与 Android 达到示范播放功能一致。** 这属于平台实现缺失，不能通过给 App 加权限、打开后台音频、修改媒体 URL 或只更新 iOS 工程解决。

当前 `TrainingActionMedia` 在 iOS 会保留随包 WebP 封面；播放器界面和训练时钟可能仍能使用，但这不等于示范视频已播放。请求优先补齐 iOS 视频后端，并给出可复核的 iOS 构建与实际视频验收证据。

## 固定输入

| 项目 | 本次来源 |
| --- | --- |
| Flare 远程主线 | `mhgd3250905/3D-Body`，`a2af14a`（2026-11-04拉取）；产品检查点`7eaccf7cf87cf7468b9df838680dab9edf515d27` |
| SDK 仓库 | `mhgd3250905/ugk-3d-pose-sdk` |
| 固定 SDK commit | `693cbc02cdf284163409868e117e438515c6a8d8`，发行标签`ugk_trainer-v0.6.0` |
| 宿主四包 | `ugk_coach`、`ugk_trainer_runtime`、`ugk_coach_ui`、`ugk_coach_chat`，同一commit；以pubspec/lock为准 |
| Flare 训练范围 | 211个授权动作；WebP封面随包，视频按需下载缓存，不再使用旧51个本地MP4的播放链路 |
| 素材资格 | 当前公共包`ready-test-unreviewed`、`releaseEligible=false`；支持iOS解码不等于素材完成QA或允许上架 |
| Flare iOS 基线 | iOS15.0；本轮Flutter3.44.7 / Dart3.12.2 / Xcode26.6；App源码版本1.0.10+15 |

## P0：iOS 公共透明视频后端缺失

以下证据全部来自上述固定commit，属于源码静态确认；本机没有完成本批真实iOS视频运行验证。

1. [`packages/ugk_trainer_runtime/pubspec.yaml:40`](https://github.com/mhgd3250905/ugk-3d-pose-sdk/blob/693cbc02cdf284163409868e117e438515c6a8d8/packages/ugk_trainer_runtime/pubspec.yaml#L40)：`flutter.plugin.platforms`只注册Android `UgkTrainerPlugin`，没有iOS插件声明或iOS原生后端。
2. [`lib/src/media/packed_alpha_platform.dart:30`](https://github.com/mhgd3250905/ugk-3d-pose-sdk/blob/693cbc02cdf284163409868e117e438515c6a8d8/packages/ugk_trainer_runtime/lib/src/media/packed_alpha_platform.dart#L30)：`MethodChannelPackedAlphaPlatform.isSupported`明确要求`defaultTargetPlatform == TargetPlatform.android`，iOS必为false。
3. [`lib/src/media/training_action_media.dart:128`](https://github.com/mhgd3250905/ugk-3d-pose-sdk/blob/693cbc02cdf284163409868e117e438515c6a8d8/packages/ugk_trainer_runtime/lib/src/media/training_action_media.dart#L128)：`_reload()`在`!UgkPackedAlphaVideo.isSupported`时提前返回，不建立视频解码器。`build()`仍绘制WebP封面；不支持平台也不显示正在下载/失败的状态，这容易被误认为只是静止画面。
4. Flutter训练页消费`TrainingActionMedia`，旧App `TrainingTimerPage`、WKWebView MP4控制器及旧媒体已在主线移除。恢复旧页面、使用`debugPlatform`冒充支持、在App里实现另一套播放器都不属于正确修复。

### 建议由 SDK 完成

- 补齐正式iOS原生注册、Swift Package集成及项目需要的CocoaPods分发方式，兼容宿主iOS15基线；同时更新真实平台能力判断，不能只把布尔值改为true。
- 为现有RGB/alpha打包MP4实现iOS解码及透明合成。可采用AVFoundation + FlutterTexture或SDK认可的等价方案；复用现有`PackedAlphaPlatform` / `PackedAlphaUriPlatform`公开契约、方法/事件通道及媒体缓存，避免新增宿主专用接口。
- 正确处理创建、首帧、播放/暂停、seek、循环、active、单次位置查询、帧捕获以及异步销毁；保持事件身份、过期请求隔离与cache pin释放约定。位置须来自视频解码器，不得用训练时间猜测。
- 同时验证随包资源和已校验缓存文件URI；继续沿用现有URI验证、目录SHA与大小校验，不放宽网络/文件路径限制。
- 核对iOS Metal/Impeller的shader filter及Texture色彩/alpha方向。浅深主题不能出现黑底、上下半画面错位、预乘alpha边缘或首帧遮罩闪现。
- 对不支持或初始化失败的真实环境给出明确、可访问的状态；poster降级可以保留，不能作为视频功能通过。

## P1：同批观察到的 SDK 布局问题

Flare当前训练页与主线同源，未修改SDK。执行`app/test/ui/trainer_player_integration_test.dart`复现以下4项；对应测试文件和`FlareTrainingPage`均与`origin/master`逐字一致，不降低断言或跳过来凑全绿。

| 用例 | 实际结果 |
| --- | --- |
| `SDK player ar light/dark at 1.5x has no layout errors` | 两项底部RenderFlex溢出约0.963px |
| `SDK player hi light/dark at 1.5x has no layout errors` | 两项底部RenderFlex溢出2px |

同批1.0倍字号各语言通过。建议SDK在保持文字可读性的前提下修复，并保留原字号、浅深主题和溢出断言；不把此项扩大为已完成全部无障碍验收。

## 请 SDK 交付的验收证据

- 可消费的正式tag + 完整commit；相关包版本与lock解析一致。说明iOS最低系统、Flutter/Impeller要求以及所需Info.plist配置。
- iOS生产入口实际编译通过，插件注册/资源/shader路径完整；至少一台真机上的真实公共MP4首帧解码、时间推进、暂停/继续、seek、循环、镜像、浅深主题和返回释放证据。
- 缓存首次下载、命中后断网播放、缺失/损坏重下、失败重试，以及快速切动作/退出时销毁和旧事件隔离；不能只给截图或静态poster。
- 训练时钟与视频循环独立，不用视频次数计训练次数。覆盖单动作、整计划、segments、左右换侧、跳过/提前结束/保存重试；保留完整结果及幂等身份。
- 屏幕常亮、系统锁屏/前后台、音频中断/恢复、声音开关及退出后释放分别验收，明确哪些状态继续、哪些暂停；不得由宿主猜测或另写一套与SDK冲突的保活逻辑。
- Android原路径回归通过；修复上述4项布局失败，或明确提供未修清单。不要改动动作内容、R17/七形象或媒体QA标签来掩盖平台问题。

## Flare 当前已做及环境边界

- 已把既有iOS分支的29项本地提交rebase至当前主线，保留原生恢复、减弱动态效果、图标和历史发布记录；同步共享聊天/库/详情/计划/记录/训练入口。
- 已移除旧App主动释放idle timer的observer/写入路径，避免覆盖SDK `wakelock_plus` 的持有状态；仅保留原生只读回读接口供集成验证。
- iOS集成测试入口已迁移到共享SDK路径，并区分“封面解码”与“真实视频播放”；静态分析通过。此次147项定向检查通过，另有上表4项布局失败；不是全绿交付。
- 本机Simulator runtime已不存在。Simulator Debug和设备Release无签名构建均被Xcode以`iOS 26.5 is not installed` / 无可用destination阻止，未进入应用编译阶段。**这是本机独立环境问题，不作为SDK编译错误证据**；本次没有真实iOS执行、安装或Apple发布。

收到SDK修复后的固定版本与证据后，Flare再更新依赖pin、运行原生集成和真机验证；此次没有私自修改SDK或引入App侧替代视频实现。
