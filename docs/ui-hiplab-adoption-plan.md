# 托马斯 App 套用 HipLab UI 规范：计划

来源（只读）：mhgd3250905/HipLab main `54471ae`，`docs/ui-design-standard.md`（唯一数值来源）与 `docs/ui-kit/` 01–05 章。
目标：本仓库 `app/`（基线 master `6a2d816`，1.0.12+21）。

## 原则

- 保留托马斯橙色品牌与原有中性色（3D 舞台、烘焙媒体按这套底色调过）；把 HipLab 的语义角色（surfaceHigh、line、faint、accentText、danger、mediaBackdrop、switchOff、cardShadow）映射到 `FlarePalette`/`FlareColors`，浅色深色成对给值。
- 只搬结构、几何、材质、动效与细节；不搬 HipLab 业务、动作数据、SDK 媒体素材和 Hip* 命名。
- 命名映射：`HipColors` → `FlareColors`，`HipMotion` → `FlareMotion`，`HipPressable` → `FlarePressable`，`HipPressedScope` → `FlarePressedScope`，`HipPrimaryButton` → `PrimaryAction`，`HipSecondaryButton` → `FlareSecondaryButton`。
- 「不要复活的历史方案」（ui-kit/05）一律不用：不另造第二个返回圆钮、不给设置分组加小标题/投影、不让媒体在图片/截图/第二播放器之间交接、不在关闭时 seek 回首帧、减少动画时不留透明遮挡层。
- SDK 包、Pose-Hub、SDK 自带页面不改，只在 App 侧适配。

## 页面清单

| 页面 / 层 | 文件 | 批次 |
|---|---|---|
| 主题、字体、颜色、动效 token | `ui/theme.dart`、`ui/motion.dart` | r1 |
| 按压、主/次按钮 | `ui/motion.dart`、`ui/components.dart`、`ui/page_kit.dart` | r1 |
| 首页（3D 舞台、肌肉详情、头部玻璃按钮） | `ui/app_shell.dart`、`ui/app_glass.dart` | r2 |
| 动作库（含共享库页、筛选面板） | `ui/content_pages.dart`、`ui/drill_filter.dart` | r2 |
| 计划列表 / 计划详情 / 计划编辑 | `ui/plans_page.dart`、`ui/content_pages.dart`、`ui/sdk_plan_editor_page.dart` | r2 |
| 记录页 | `ui/content_pages.dart` | r2 |
| 设置页（分组、行、开关、分段、滑块） | `ui/app_shell.dart` `_settingsPage` | r2 |
| 底部面板、确认框、安全提示 | `ui/content_pages.dart`、`ui/app_shell.dart` | r2 |
| 页面路由（FlareStage、MaterialPageRoute 推入） | `ui/motion.dart`、`ui/app_shell.dart` | r2 |
| AI 教练页、训练播放页（SDK 页面外壳） | `ui/flare_coach_chat_page.dart`、`ui/trainer_page.dart` | r2（仅外壳） |
| 动作卡、动作详情媒体、计划海报 | `ui/components.dart`、`ui/drill_media.dart`、`ui/plans_page.dart` | r3 |
| 启动页 | `ui/startup_splash.dart` | r1（重试按钮随主题） |

## 批次

- **r1 `codex/ui-hiplab-r1`**：语义 token、`FlareType` 字级、`FlareGeometry` 几何、按压 100/180ms ·.97、`FlarePressable`/`FlarePressedScope`、主按钮 50/14/17w600（按下暗 10%，禁用 surfaceHigh + muted）、次按钮 50/14/17w500 填充无描边；动效 token（page 400/340、container 500/420、segment 380、toggle 200）先定义，r2/r3 接入。主题与语言宿主沿用现有 `MaterialApp.builder`（已在解析后的主题下切 palette 和状态栏）。
- **r2 `codex/ui-hiplab-r2`**：顶栏 44/52 + 24 渐隐、唯一返回胶囊（44×44，固定在 safeTop 下控制轨道，胶囊与玻璃分层，BackdropFilter 配真实 ClipRect）；content 型路由与 `pinLeading`；设置分组圆角 10、行 52/60、图标槽 30、文字起点 58、分隔线 0.5、组间 28；开关 51×31（热区 51×44）、分段 32/9/2、滑块轨道 4/滑块 26、确认框 ≤320/14。
- **r3 `codex/ui-hiplab-r3`**：卡片与视频媒体动效：同一媒体节点展开/收回，关闭暂停当前帧不回首帧；冷牌锁封面，真实首帧与换面分离；有界相邻预备；减少动画直接落终态。

## 风险

1. **测试**：沙箱只跑 `flutter analyze`。部分 widget 测试按 `FilledButton` 文字查找按钮，r1 保留 `FilledButton` 作为主按钮底层以免破坏；尺寸/时长断言需在本机 `flutter test` 确认。
2. **3D 舞台与路由**：`FlareStage` 同时承载常驻 3D WebView；r2 改路由时不得重建 scene 或换 Navigator key。
3. **SDK 页面**：教练聊天、训练播放、共享动作库由 SDK 绘制，只改 App 侧外壳与传入的视觉参数。
4. **14 种语言**：按钮统一 `FittedBox.scaleDown`；行标题允许两行；阿拉伯语 RTL 用 directional 几何。
5. **品牌取舍**：HipLab 禁用态是中性灰；托马斯原先是橙色淡底。按规范改为中性（r1），如需保留橙色淡底可单独回调。
6. **Flutter 版本**：沙箱用 3.47.6 跑 analyze（lock 注释称 3.44.7/3.47.x 均可解析），未提交 lock 变更。

## 验证

- 每批：`flutter analyze` 无问题；`python3 tools/ui_token_scan.py` 扫硬编码颜色/字体/圆角并抽查。
- 本机：`cd app && flutter pub get && flutter analyze && flutter test`，再真机看浅/深色、减少动画、阿拉伯语与德语长文案。
