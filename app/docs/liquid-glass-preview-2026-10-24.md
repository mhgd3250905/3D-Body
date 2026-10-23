# Flare 界面改版首轮样稿

第 1 步已按用户明确授权合入并推送 `master`：`4b7e7339d9a5c2774edd7133980236485ded45dc`。第 2 步在独立分支 `codex/flarelab-liquid-glass-preview` 继续；本轮只做计划首页与 AI 对话页，等待视觉方向确认后再铺开。

用户最新安排为“先做网页界面对比，手机稍后”。以下均是真实 Flutter Web release 渲染，390×844，同一组隔离内存数据；不是生成图，也不作为原生材质或手机性能验收。

## 设计与边界

- 沿用 Flare 暖橙、暖白及石墨色。橙色集中于发送、开练和少量识别点；没有使用 SmartFit 的薄荷/青绿色。
- 计划页固定标题与场景切换；示范图和说明分开，文字自然换行，窄屏/大字号用单列。AI 入口、我的计划、预设卡为静态半透明面，重卡及图像使用 RepaintBoundary。
- AI 页保持原列表、建议、输入、计划折叠、保存与 ask_user 交互。顶部两个固定按钮及固定输入栏采用公开玻璃组件；消息与计划卡不做模糊。
- `liquid_glass_widgets` 固定 **1.14.0 / MIT**。只通过公共导出、局部 GlassTheme 和独立组件接入；不调用全局 wrap，不改全局 Material Theme、SDK 源码、TrainerTheme 或播放页。仅启动时预热库 shader。
- 首页 3D、视频、训练执行及其余页面未铺开。滚动卡片不使用 BackdropFilter、玻璃 shader 或大面积 Opacity/saveLayer。

本轮使用 [flutter-ios-liquid-glass](C:/Users/29485/.codex/skills/flutter-ios-liquid-glass/SKILL.md)；库 API 已按本机固定版本源码核对，参考 [官方 1.14.0](https://pub.dev/packages/liquid_glass_widgets/versions/1.14.0)。用户指定的列表与媒体性能边界优先于一般玻璃材质建议。

## 前后图

图片与来源：[截图目录](screenshots/2026-10-24-glass-preview/evidence.json)。每一对使用相同主题、视口和演示内容。

| 页面 | 浅色 | 深色 |
| --- | --- | --- |
| 计划页 | [前](screenshots/2026-10-24-glass-preview/before-plans-light.png) / [后](screenshots/2026-10-24-glass-preview/after-plans-light.png) | [前](screenshots/2026-10-24-glass-preview/before-plans-dark.png) / [后](screenshots/2026-10-24-glass-preview/after-plans-dark.png) |
| AI 教练 | [前](screenshots/2026-10-24-glass-preview/before-coach-light.png) / [后](screenshots/2026-10-24-glass-preview/after-coach-light.png) | [前](screenshots/2026-10-24-glass-preview/before-coach-dark.png) / [后](screenshots/2026-10-24-glass-preview/after-coach-dark.png) |

本机切换式对比页：`output/ui-glass-preview-20261023/review/index.html`，预览地址 `http://127.0.0.1:8853/`。正式组件在演示入口中使用固定数据和本地回调，开练/模型请求不作为网页样稿的验证内容。原始构建、临时入口与日志保留在同一 output 目录，未嵌入用户令牌或备份。

## 已执行与待验证

- `analyze-final.log`：无静态分析问题。
- `ui-tests.log`：39 项相关计划/AI Widget 测试通过，包含当前交互、长标题、320 宽 2 倍字号与 360 宽 1.3 倍字号的 AI 布局。
- 改前/改后均成功构建离线 Web，使用本地 CanvasKit，无 CDN。浏览器四种改后状态均显示、没有 page error；展开/收起后输入草稿保留，输入后发送按钮可用。
- 不将这些检查扩大为 14 语全矩阵通过。原生玻璃透出/边缘光学、Android/iOS 截图、滚动页 profile Raster 平均/P99，按用户安排留待手机可用后验证。原生 before profile 诊断包已保存，但未安装或采样。
- UI 样稿仅本地分支保存；未合入或推送，不视作用户已经认可视觉方向。

## 第 1 步内测包补充身份

`output/releases/Flare-SDK020-1.0.10+15-20261023-arm64.apk` 为 `4b7e733` 的 arm64 release 内测包，SHA-256 `a27321cd7b98f6b7a249455d1a54a967b8ed8a93c77d5d74d26395b64b47b182`。按手机既有内测证书重签后 `adb install -r` 成功，版本码确认 15；没有卸载或清数据。原 Gradle 上传证书产物另存私有目录，不作为同签名内测覆盖包。

安装后手机被 SmartFit 会话切至应用信息页，本会话停止争用设备；未把安装成功记为播放器真机交互通过。后续手机仍保留第 1 步 +15，未安装本轮 UI 样稿。
