# Liquid Glass 页面铺开：网页评审批次

2026-10-24，按用户“继续推进、先核对中断改动、先看网页、手机稍后、暂不合入推送”的安排完成本轮 App 自有页面改造。首轮计划 / AI 样稿方向已经用户确认；本轮新增页面的视觉验收等待用户反馈。

分支 `codex/flarelab-liquid-glass-preview`；基线 HEAD `21bddc20cbd87fd0c75bfe37f02873011b133e85`，本轮增量未提交、未合入或推送。源码 / 测试文件清单和逐文件 SHA-256 见[证据清单](screenshots/2026-10-24-glass-rollout/evidence.json)，汇总指纹 `2eed3d06a283e713df63bfa605d03d6b06b9c3d5b61b5db8616c6bdc7852afa3`。不能只用旧 HEAD 代表本轮代码。

## 核对与实现

恢复时只有 `components.dart` 存在 UI 未提交改动，内容为部分静态表面和分组行调整；此前三个子任务的页面改动没有落盘。本轮单线程继续，保留原有 README / 台账中的绿幕增量、Air-Flare、图标候选和其它无关文件。

- 首页两侧固定控制、共用页面返回 / 编辑按钮、动作时间控制和固定底部操作使用 `liquid_glass_widgets` 1.14.0 公共组件及局部 `GlassTheme`。
- 训练库 / 计划子页的卡片、分组列表、记录、更多 / 设置及肌群知识说明采用静态内容表面；滚动卡片不叠加折射或模糊。深色底面按现有次级字色的合成对比调整，两种模式的卡片小字建模对比均达到 4.5:1。
- 训练库与多选器采用懒加载的自然高度卡片行，媒体为 4:3。手机常规宽度最多两列，窄屏 / 大字号单列；动作标题与剂量自然换行，不做媒体按压缩放。多选顺序、排除已加入项、计划编辑和排序保持。
- `PageHeader` 允许长标题自然增高；操作保留原 Keys / 回调 / 路由。继续使用 Material Scaffold 处理通知和键盘；没有更换全局 Material 主题。
- SDK Player / Editor、SDK 源码、锁定 commit、R17 模型、51 视频及其它素材保持。本轮没有重制场景、训练内容或媒体。

## 评审入口与画面

本机浅深对照：[http://127.0.0.1:8855/](http://127.0.0.1:8855/)。从页面顶部链接可进入对应主题的[交互预览](http://127.0.0.1:8854/?page=home&theme=light)。更多 / 设置 / 关于从首页原有入口进入。

26 张截图均为实际 Flutter Web release / Chromium / CanvasKit，390×844、1 倍设备像素；已等待字体、图片及入场完成并亲看。首页首次采集曾截到加载剪影，已在模型和转场完成后重拍，不用加载图作为交付效果。

| 页面 | 浅色 | 深色 |
| --- | --- | --- |
| 动作首页 | [查看](screenshots/2026-10-24-glass-rollout/home-light.png) | [查看](screenshots/2026-10-24-glass-rollout/home-dark.png) |
| 肌群详情 | [查看](screenshots/2026-10-24-glass-rollout/muscle-light.png) | [查看](screenshots/2026-10-24-glass-rollout/muscle-dark.png) |
| 更多 | [查看](screenshots/2026-10-24-glass-rollout/more-light.png) | [查看](screenshots/2026-10-24-glass-rollout/more-dark.png) |
| 训练库 | [查看](screenshots/2026-10-24-glass-rollout/library-light.png) | [查看](screenshots/2026-10-24-glass-rollout/library-dark.png) |
| 动作详情 | [查看](screenshots/2026-10-24-glass-rollout/drill-light.png) | [查看](screenshots/2026-10-24-glass-rollout/drill-dark.png) |
| 计划 | [查看](screenshots/2026-10-24-glass-rollout/plans-light.png) | [查看](screenshots/2026-10-24-glass-rollout/plans-dark.png) |
| 计划详情 | [查看](screenshots/2026-10-24-glass-rollout/plan-light.png) | [查看](screenshots/2026-10-24-glass-rollout/plan-dark.png) |
| 计划编辑 | [查看](screenshots/2026-10-24-glass-rollout/editor-light.png) | [查看](screenshots/2026-10-24-glass-rollout/editor-dark.png) |
| 动作选择 | [查看](screenshots/2026-10-24-glass-rollout/picker-light.png) | [查看](screenshots/2026-10-24-glass-rollout/picker-dark.png) |
| 训练记录 | [查看](screenshots/2026-10-24-glass-rollout/progress-light.png) | [查看](screenshots/2026-10-24-glass-rollout/progress-dark.png) |
| 设置 | [查看](screenshots/2026-10-24-glass-rollout/settings-light.png) | [查看](screenshots/2026-10-24-glass-rollout/settings-dark.png) |
| 关于与备份 | [查看](screenshots/2026-10-24-glass-rollout/about-light.png) | [查看](screenshots/2026-10-24-glass-rollout/about-dark.png) |
| AI 定制 | [查看](screenshots/2026-10-24-glass-rollout/coach-light.png) | [查看](screenshots/2026-10-24-glass-rollout/coach-dark.png) |

交互预览使用真实 App 组件、独立内存数据和固定 AI 回答，刷新重置；不含本机私有 AI 配置，也不改用户已有记录。新增 / 编辑 / 开练和媒体均可在隔离数据中操作，不能据此宣称真实模型服务或用户设备已验收。

## 本轮验证

日志和临时入口位于 `output/ui-glass-rollout-20261024/`。

| 检查 | 结果与证据 |
| --- | --- |
| `flutter analyze --no-pub` | 无问题，`analyze-final.log` |
| 10 份受影响 Widget 测试 | **109 通过 / 0 失败**，`ui-tests-verified.log` |
| 正式 App 离线 Web | `flutter build web --no-web-resources-cdn` 成功，`app-build-final.log`；产物 `app/build/web` |
| 隔离交互预览离线 Web | 成功，`preview-build-delivery.log`；产物 `output/ui-glass-rollout-20261024/web` |
| 14 语训练库 | 每语浅深、360 宽 / 1.3 倍字号检查换行、末项可达及点击；共 28 项，不扩大成全页面 / 原生 14 语矩阵 |
| 主题连续性 | 搜索词、结果、State 和滚动位置在浅深切换中保持；原有主题 / 角色及同帧返回测试通过 |
| 浏览器实际操作 | 搜索 / 空态、视频播放暂停、按顺序添加两项、进入 SDK 整计划播放器、主题切换、复制演示备份及 SnackBar、肌群详情与同帧返回通过 |
| 视频实际解码 | iframe 内 video 为 `readyState=4`、播放时间前进，画面尺寸 169×127；没有媒体缩放动画 |
| 采图窗口 | 无 page error / console warning / 资源请求失败；不将此窗口扩大为长期稳定性证明 |

新增 `glass_rollout_test.dart` 覆盖可访问字号、14 语长文、末项可达、主题状态连续性和静态色彩对比。原网格的结构断言更新为自然高度行，搜索与结果数量断言保留；多选测试改为实际搜索后依次选择。`plan_regressions_test` 的整计划启动在未改 UI 的基线也失败，诊断确认是在真实 asset IO 返回前断言；现在等待 SDK 路由出现，保留单次启动和返回不重播的断言，未改播放业务逻辑。

## 保留的待验范围

Android / iOS 原生材质、代表控件背景透出与边缘光学、媒体叠层、profile Raster 平均 / P99、原生大字号 / 读屏 / 系统设置矩阵及长期性能仍待手机阶段。本轮未构建 APK、未安装手机、未合入或推送。包版本保持 1.0.10+15，手机此前 SDK 第 1 步 +15 的安装事实与 L52 的有限用户认可边界不变。
