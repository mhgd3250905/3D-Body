# Flare iOS 界面对齐交接（2026-11-17）

本轮 Flutter 源码在 `feat/flare-plans-full`。界面提交依次为走查 r1 `cd36126`、计划页和续练 `539278d`、界面 r2 `674d440`、常驻渐隐 `e6eda44`、共用顶栏 `2fc5b9d`、路由转场 `caf06aa`。本轮 Android 测试包目标为 1.0.15（arm64 vc2054），共享构建号为 54。iOS 的 `CFBundleVersion` 由 `FLUTTER_BUILD_NUMBER` 注入，iOS 签名构建按自己的发布台账确定构建号和验收状态。

## 共用标准

1. **顶栏**从屏幕 y=0 覆盖系统安全区、44 pt 控制行及 24 pt 渐隐段。有副标题时标题区使用 52 pt，返回键仍锚在 44 pt 控制轨。遮罩常驻，用页面底色、13 点采样和 60%／.86 拐点向透明过渡，顶部按钮保留统一的半透明材质。首项留出顶栏 inset，滚动视口延伸至遮罩下方。实现见 [page_kit.dart](../lib/ui/page_kit.dart)、[app_glass.dart](../lib/ui/app_glass.dart)、[theme.dart](../lib/ui/theme.dart)。出处为 HipLab `docs/ui-design-standard.md` §1.1–1.3、`docs/ui-kit/02-navigation.md` §2、§3.1，以及 [Flare 验证台账的「首页菜单胶囊与计划页浮动顶栏」和「计划页与训练详情顶部渐隐」](verification.md)。`18aaf79` 的滚动实色底板是历史方案，当前以 `e6eda44` 的渐隐为准。
2. **整页转场**进入 400 ms、返回 340 ms，从右侧进入、向右退出。进入为 `Cubic(.2, 0, 0, 1)`，退出位移使用 `Curves.fastOutSlowIn`。下层页面左移最多 28%，压暗上限浅色 .14、深色 .32。前后两页都有返回键时只固定一枚，标题、遮罩和正文跟随页面。从首页这类无返回键页面进入时，返回键随目标页滑入。左缘手势跟手并露出上一页，取消后恢复当前页。减少动态效果时直接切换至终态，保留返回手势。实现见 [motion.dart](../lib/ui/motion.dart)、[app_shell.dart](../lib/ui/app_shell.dart)。出处为 HipLab `docs/ui-design-standard.md` §1.5、`docs/ui-kit/02-navigation.md` §4–5，以及 [Flare 的「顶栏与整页转场对齐」](verification.md)。

## 按页面对齐

表内文件相对 `app/`。共用顶栏和整页转场均按上节规范；单页的业务规则及布局以对应提交和验证记录为准。

| 页面 | 本轮改动与对齐点 | 涉及文件 |
| --- | --- | --- |
| 首页、更多菜单、3D 肌群详情 | 首页左上菜单胶囊及更多菜单统一宿主顶栏。「前往训练」直达时间轴当前角度的初级计划，返回保留角度。3D 肌群详情返回同一帧，首页与训练汇总间延续实时 3D 交接。 | `lib/ui/app_shell.dart`、`lib/ui/muscle_widgets.dart`、`lib/ui/scene_localization.dart`、`lib/l10n/*.arb` |
| 训练汇总（角度／肌群） | 角度与肌群分段沿原样式居中，返回键与分段共用导航行。保留 8 个角度、17 个肌群入口。r1 修正腿部肌群取景及各入口短名一致性，按当前可见舞台检查头顶留白和触控，5 个腿部肌群的几何校验最小头顶留白为舞台高度的 6%。计划与汇总之间走整页转场。 | `lib/ui/flare_training_hub_page.dart`、`scene/src/training-hub-stage.js`、`scene/src/phase-map.js`、`scene/src/hotspots.js`、`assets/scene/`、`assets/l10n/muscle_short_zh*.json` |
| 计划首页 | 保留「我的计划」，新增最近训练卡、托马斯难点角度、补短板肌群和各自的全部入口；已可从汇总与详情开练，旧成套训练入口下线。最近训练的能识别计划可按原场景、原镜像方向、原动作次序与剂量续练，无法定位原计划的旧记录只展示回顾。摆姿与肌群装饰使用随包资产，检查头部、底部对齐和「继续」按钮避让。 | `lib/ui/plans_page.dart`、`lib/ui/app_shell.dart`、`lib/trainer/flare_plan_resume.dart`、`assets/angles/phase-*.png`、`assets/plan_resume_muscles/`、`pubspec.yaml` |
| 角度计划、肌群计划详情 | 共用常驻渐隐顶栏。角度页将可横滑的发力肌群移到难度选择上方，点胶囊进入相应肌群详情，390 × 844 首屏可见训练内容和首个完整动作。徒手替换徽标放在剂量行，动作名独立成行。滚到底最后一条和固定开始按钮之间留 24 逻辑像素，保留点按。计划按 `flare-plans.json` 的场景替换消除重复动作，angle 15 继续复用 11 的方案。 | `lib/ui/flare_plan_detail_page.dart`、`lib/ui/flare_plan_visuals.dart`、`lib/ui/app_shell.dart`、`assets/data/flare-plans.json` |
| 个人计划详情、普通及 SDK 格式计划编辑 | 个人计划详情和两种编辑页进入同一顶栏。保留新建、编辑、训练和已有会员校验，iOS 点验编辑返回后仍在相应计划。 | `lib/ui/plans_page.dart`、`lib/ui/sdk_plan_editor_page.dart`、`lib/ui/app_shell.dart` |
| 公共动作库、备用动作库、Flare 动作详情、训练记录 | 使用共用常驻渐隐，滚动经过同一顶部控制轨。公共动作图文仍是 SDK 底部弹层。 | `lib/data/flare_shared_library.dart`、`lib/ui/content_pages.dart` |
| 设置、关于、会员及训练载入与错误 | 宿主统一顶栏和返回布局，会员退出沿用原回调。开源许可保留 Flutter 框架页。 | `lib/ui/app_shell.dart`、`lib/ui/flare_membership_page.dart`、`lib/ui/trainer_page.dart` |
| 训练中、休息、结果 | 加载进入固定 Trainer SDK。休息顶部仍显示刚完成的动作和休息时长，独立卡片显示下一动作及剂量。部分完成将进度放入主标题第二行，保留 SDK 计划名副标题并隐藏遗留提示；零完成自动返回，保存失败可以重试，避免重复退出或保存。 | `lib/ui/trainer_page.dart`、`lib/trainer/trainer_strings.dart`、`lib/trainer/flare_plan_resume.dart` |

完整宿主页及不适用页面见[顶部导航清单](navigation-inventory-2026-11-17.md)，训练界面细则见[验证台账的走查 r1、计划页改版和界面 r2](verification.md)，卡片资源来源见[最近训练卡肌群摄影](asset-sources.md#最近训练卡肌群摄影2026-11-17)。

## iOS 跟进检查

- 优先使用分支的共用 Flutter 组件、路由、计划数据、翻译和随包素材。固定 Trainer SDK 自行管理训练中／休息的退出确认与记录保存，现有公开接口没有顶栏插槽；结果页由底部「完成／再练一次」退出。保留 iOS 原生工程、签名配置及系统安全区策略，原生视图内的训练行为按同版本 SDK 点验。
- 在 iPhone 上同时验浅色、深色、首屏与滚动状态。抽查首页→当前角度初级计划→返回、计划→汇总、计划→角度详情→肌群详情及反向退出。在转场中间帧验证一枚返回键、下层视差、状态恢复。测试左缘拖动完成与取消，再开启系统减少动态效果重跑。
- 在小屏与大字号下核对标题、首条动作、固定开始按钮及底部安全区；验证最近训练卡的无记录、可续练、仅回顾、重复续练，以及休息、全完成、部分完成、零完成与保存失败重试。
- 已有证据为 Flare 77 项转场及相关回归测试、静态分析、离线 Web 构建和 Chrome 390 × 844 双向转场抽样；计划改版与 r2 的全量结果为 446 通过、1 跳过。这里的 iPhone 布局测试是组件矩阵，iPhone 真机的边缘手势、系统减少动态效果、WKWebView 交接和 IPA 签名仍待 iOS 侧验证。
