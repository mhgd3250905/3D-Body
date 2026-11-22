# Flare 顶栏清单 · 2026-11-17

以 `e6eda44` 为改前基线。几何和渐隐沿用 [验证台账的「首页菜单胶囊与计划页浮动顶栏」](verification.md#首页菜单胶囊与计划页浮动顶栏2026-11-08工作区修改)、其引用的 HipLab 导航规范 §1.1–1.3，以及 [FlareNavBar](../lib/ui/page_kit.dart) 和 [FlareNavigationGlass](../lib/ui/app_glass.dart)。

| 页面 | 归属文件 | 改前是否符合 |
| --- | --- | --- |
| 首页 | `lib/ui/app_shell.dart` · `_watchPage` | 菜单胶囊材质共用，顶栏与渐隐缺失 |
| 更多菜单 | `lib/ui/app_shell.dart` · `_presentMore` | 底部弹层靠手势或点外部关闭，无共享顶部控件 |
| 3D 肌群详情 | `lib/ui/app_shell.dart` · `_watchPage` | 返回用共用材质自行排版，无常驻渐隐 |
| 训练汇总（角度 / 肌群） | `lib/ui/flare_training_hub_page.dart` | 自绘灰圆返回；独立分段控件，无渐隐 |
| 计划 | `lib/ui/plans_page.dart` · `PlansPage` | 已符合 |
| 角度计划 / 肌群计划 | `lib/ui/flare_plan_detail_page.dart` | 已符合 |
| 公共动作库 / 肌群筛选入口 | `lib/data/flare_shared_library.dart` · `FlareSharedLibraryPage` | 已用共用顶栏，仍启用条带模糊 |
| 本地备用动作库、动作详情、训练记录 | `lib/ui/content_pages.dart` · `LibraryPage`、`DrillDetailPage`、`ProgressPage` | 共用返回键，顶栏为固定排版，无渐隐 |
| 个人计划详情、普通编辑 | `lib/ui/plans_page.dart` · `PlanDetailPage`、`RoutineEditorPage` | 共用返回键，无渐隐 |
| SDK 格式计划编辑 | `lib/ui/sdk_plan_editor_page.dart` | 宿主页面，共用返回键，无渐隐 |
| 设置、关于 | `lib/ui/app_shell.dart` · `_settingsPage`、`_aboutPage` | 共用返回键，无渐隐 |
| 会员 / 付费墙 | `lib/ui/flare_membership_page.dart` | 独立关闭按钮，无渐隐 |
| 首启引导及安全确认 | `lib/ui/content_pages.dart` · `WelcomePage`、`showSafetySheet` | 首页无顶部操控，安全确认使用底部动作 |
| 训练载入 / 错误 | `lib/ui/trainer_page.dart` | Flutter AppBar，非 Flare 顶栏 |
| 训练中 / 休息 | 固定 Trainer SDK · `trainer_player_v1.dart`，宿主 `lib/ui/trainer_page.dart` | SDK 私有关闭键，无宿主顶栏插槽 |
| 训练结果 | 固定 Trainer SDK · `trainer_completion.dart` | 底部完成 / 再练，无顶部返回键 |
| 公共动作图文 | 固定 Trainer SDK · `training_library_page.dart`，宿主调用 `lib/data/flare_shared_library.dart` | SDK 图文底部弹层靠拖拽关闭，无顶部返回键 |
| 登录 | 当前宿主路由表 `lib/ui/app_shell.dart`、启动配置 `lib/main.dart` | 当前没有独立登录页 |
| 语言、安全提示、筛选、选动作、加入计划 | `lib/ui/app_shell.dart`、`content_pages.dart`、`drill_filter.dart`、`public_library_filter.dart`、`plans_page.dart` | 底部弹层使用现有取消、关闭或确认机制 |
| 开源许可与许可详情 | `lib/ui/app_shell.dart` · `showLicensePage` | Flutter 框架页，调用接口没有顶栏插槽 |
| AI 教练与内部训练图文 | `lib/ui/flare_coach_chat_page.dart` | 入口当前停用 |

## 本轮实现

上表中有宿主管理顶栏的页面均接入常驻渐隐。更多菜单新增同款返回入口。首页保留同材质菜单胶囊，3D 肌群返回保留「返回同一帧」语义，训练汇总的角度 / 肌群分段沿用原样式并居中对齐返回键。关闭会员页沿用原退出回调。

固定 Trainer SDK 的训练和休息共用私有退出控件，公开的 `TrainerExperienceScope` 只提供进退场控制。统一这两个页面需要 SDK 提供顶栏或退出按钮插槽，以保留退出确认与记录保存。训练结果、公共动作图文与首启引导没有顶部返回控件。

## 验证

- 73 项导航、iPhone 布局、训练记录、动作库、肌群、计划与会员相关测试通过。静态分析和离线 Web 构建通过。
- Chrome 390 × 844 浅色核对首页、更多菜单、训练汇总、3D 肌群详情、动作详情、训练记录、设置和关于。另用测试数据渲染公共与备用动作库、个人计划详情、两个计划编辑页、会员页和训练载入页。15 个页面截图分 4 组交付。
