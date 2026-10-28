# UI：参考大水杯 R27 风格重做主要界面（2026-10-28）

分支 `ui/r27-style-redesign`，基于 `origin/master`。只改 App 自有界面的主题、表面、圆角、配色和动效节奏；路由、Keys、回调、数据、14 语文案、SDK、R17 场景、51 训练媒体和 `tools/drill-anim` / 动作 spec 均未改动。

## 设计要点

1. **轻量控制表面替代 Liquid Glass**：移除 `liquid_glass_widgets`。`FlareControlGlass`（`lib/ui/app_glass.dart`）按水杯 `HomeControlGlass` 的做法，只画本地三段渐变 + 0.6 发丝边 + 一道轻阴影（日 .08 / 夜 .16，blur 9，y 3），不采样背景、不模糊、不折射，在 3D 舞台、视频和滚动列表上开销一致；高对比模式改为近不透明表面。Flare 浅色舞台本身是浅纸色，日间三段透明度相应提高到 .74/.52/.64，避免控件“消失”。原 `FlareGlassBar` / `FlareGlassIconButton` / `FlareStaticSurface` / `FlareActionBar` 类名和调用点保持，只换实现。
2. **珊瑚强调色**：业务强调色改为 R27 珊瑚，日 `#D95636`（文字/细线用 `#B8461F`，对纸色背景 4.85:1）、夜 `#FFA184`；填充上的文字用深墨色（日 4.6:1、夜 9.1:1）。用于播放钮、筛选选中态、编号、主操作、更多菜单图标底；主文字/次文字对齐 R27（日 `#1C1C1E/#48484A`，夜 `#F2F2F7/#D1D1D6`）。首页斜体 Flare 字标与青绿细线保留为品牌个性。
3. **圆角层级 24/28/20/16/12**：`FlareRadius` 统一：底部菜单上圆角与页面主卡（动作示范）24；固定操作栏 28；分组、内容卡、训练卡 20；单条列表项与知识卡 16；小标签/缩略图/图标底 12。
4. **杂志式启动页**：左对齐大号斜体 `Flare 托马斯` 标题、`FLARE` 眉题 + 自绘发丝线（900ms easeInOutCubic 画出，随后珊瑚短线沿线移动最多 5 次）、托马斯剪影居中、页脚三栏索引（动作 / 肌群图 / 训练，复用已有 14 语文案）；手机高度铺满成封面，矮屏滚动。减少动画时直接显示完整静态线。
5. **节奏统一到 R27**：底部菜单开合 260ms（easeOutCubic / easeInCubic），列表/卡片错峰 300ms、间隔 65ms、最多 6 组、easeOutCubic；训练库只给首屏 6 张卡做入场，滚动懒构建出来的卡直接出现，不在滑动中“弹出”。所有时长继续经 `FlareMotion.of` 在减少动画时归零。

## 动效清单

| 动作 | 时长 / 曲线 |
| --- | --- |
| 底部菜单（更多、计划、加入计划等全部 `sheetStyle`）开 | 260ms easeOutCubic |
| 底部菜单关 | 260ms easeInCubic |
| 训练库首屏卡片、计划动作行、更多菜单行 | 单项 300ms easeOutCubic，间隔 65ms，最多 6 组（≤325ms 延迟） |
| 启动发丝线 | 画出 900ms easeInOutCubic；珊瑚短线移动 1800ms easeInOutCubic × 最多 5 次 |
| 启动封面淡出（保留原逻辑） | 340ms：文字 0–120ms 淡出，背景 easeInOut 溶解 |
| 圆形控件按压 | 缩至 .94，按下 110ms / 回弹 320ms（原 `Pressable`） |
| 新增常量（供后续面板使用） | `FlareMotion.panel` 350ms easeInOutCubic、`FlareMotion.swap` 300ms easeInOutCubic |
| 页面推入、主题溶解、详情展开 | 保持原实现（Cupertino 页面转场、360ms 主题、340/240ms 展开） |

## 性能做法

- 无 `BackdropFilter`、无着色器、无第三方玻璃库；表面只用 `DecoratedBox` 渐变 + 单层阴影。
- 固定控制栏 `FlareGlassBar`、动作示范卡、训练卡、列表行各自包 `RepaintBoundary`，视频播放 / 列表滚动不重绘外层。
- 启动发丝线单独 `RepaintBoundary` + `CustomPainter(repaint: controller)`，只重绘 8px 高的线；有限次数循环，长加载停在静态线上，不留常驻 ticker。
- 入场动画完成后直接返回子组件（无残留 `Opacity`）；懒构建卡片不做延时入场。

## 改动文件

- `lib/ui/app_glass.dart`：`FlareRadius`、`FlareControlGlass`，四个原组件改为 R27 表面；去掉 Liquid Glass 初始化与主题。
- `lib/ui/theme.dart`：深浅两套色板的强调色、文字色、发丝线与底部菜单圆角 24、按钮圆角 16。
- `lib/ui/motion.dart`：sheet 260ms、`enter` 300ms、`staggerStepMs` 65 / `staggerGroups` 6、`panel` / `swap` 常量；`FadeSlideIn` 支持曲线参数，默认 easeOutCubic、偏移 10。
- `lib/ui/startup_splash.dart`：杂志式启动封面与 `StartupRule`。
- `lib/ui/components.dart`：训练卡 / 列表行用静态表面装饰（带轻阴影），圆角改为层级值。
- `lib/ui/content_pages.dart`：筛选选中态珊瑚；训练库首屏错峰；动作详情示范改为 24dp 主卡、要点编号珊瑚底。
- `lib/ui/plans_page.dart`：圆角层级、筛选选中态珊瑚。
- `lib/ui/app_shell.dart`：播放钮珊瑚、更多菜单行错峰与珊瑚图标底、知识卡 16dp。
- `lib/main.dart`、`pubspec.yaml`、`pubspec.lock`：移除 `liquid_glass_widgets`（lock 只删该条目）。

## 未改范围

- 3D 场景 bundle（`assets/scene`，首页“肌群图”小卡与肌群标签在 WebView 内）未重建，外观沿用；如需统一圆角 / 配色需在根 `src/` 改后重新构建场景并按既有包核对流程更新哈希。
- SDK 播放器 / 编辑器（`ugk_coach_ui` 等）界面不在本次范围。
- 训练计时页、AI 定制页、设置页只继承新的色板、圆角和表面，没有单独重排。
