# HipLab UI 分层验收（2026-11-07）

本批仅处理 Draft PR #129 → #130 → #131；不合入 master，不操作 iOS / PR #127，不改 SDK 或 Pose-Hub。作者 mhgd3250905 <mhgd3250905@gmail.com>。源码保持 1.0.12+21、SDK f7b8a8e；真机检查使用独立 debug 构建号，不是正式内测/发布版本。主目录、历史包、stash、设备数据保留。

## r1 / #129

验收源为 29eb410 加本分支按钮修复。禁用的主、次按钮原先仍按压缩放；现已保持静止，按住期间切为禁用也立即复位。保留灰色禁用、填充无描边次按钮、FlareSans、橙色品牌与删除计划撤销提示条。

Flutter 3.44.7 / Dart 3.12.2，E 盘隔离副本及临时目录。`flutter pub get` 成功，最终 `pub get --enforce-lockfile` 后 lock 与 PR 原文件一致。`flutter analyze` 无问题。未过滤全量 `flutter test --concurrency=1 --reporter json`：**337 通过 / 4 失败 / 1 默认 live 跳过，退出 1**。新增 12 项按钮测试全部通过，覆盖浅深色、en/de 长标签、正常按压释放、禁用及减少动画。

4 项失败均为已有 SDK player `ar/hi × light/dark at 1.5x has no layout errors`，未删测试、放宽断言或改 SDK，不能写成全量全绿。

Android 17 / API 37 实机：同证书 `adb install -r` 从实际 vc2021 更新到 **debug vc2023**。原有 1 个计划和记录仍可见，不声称逐文件核对全部数据。已检查 en/de 设置页浅深色、德语新计划灰色禁用保存按钮、系统三项动画设 0 后打开动作选择面板；随后三项恢复原值 1.0。新计划未保存，原计划未删除/改写。软件测试中的按压/减少动画结论与有限真机观察分列；视频同帧与返回胶囊归 r2/r3。

本地证据在本批 E 盘隔离副本 `output/ui-acceptance-20261107/`：`r1-final-analyze.log`、`r1-final-tests.jsonl`、`r1-buttons.log`、`r1-en-light-settings.png`、`r1-en-dark-settings.png`、`r1-de-light-settings.png`、`r1-de-dark-settings.png`、`r1-de-new-plan.png`、`r1-de-reduced-picker.png`，均未入库。早期 `r1-start` 的 UI tree 与 `r1-settings-initial` 截图因读取/转场时机不可靠被排除。

## r2 / #130

在 r2 向下合入已验证的 r1 修复（merge ce59ae3，未动 master）。修复两条真实跳动路径：设置→关于原先绕过 FlareStage；手势返回原先在松手后才固定胶囊。关于现进入原 shell 的下一层，设置滚动位置保留；手势从开始到取消回弹/提交返回均固定唯一胶囊，回到无胶囊页时仍随页面移动，不强加给 SDK 页面。

`flutter pub get` / analyze 成功，lock 未变。全量 `flutter test --concurrency=1 --reporter json`：**345 通过 / 同 4 项已有 SDK 字体失败 / 1 默认 live 跳过，退出 1**；包含 8 项新导航回归。此后另加的 14 项控件交互测试单独运行全过，最终 analyze 无问题。没有发现需要修改的旧导航高度/分组标题/列表断言，未改旧测试期待来掩盖代码问题。

14 项控件测试覆盖开关点按、Space/Enter、浅深与减少动画；分段点按/拖动与 en/de 长文案；确认框 barrier=null、取消=false、确认=true。开关、确认框尚无宿主页面调用，证据属于组件测试；不虚构真机页面入口，也未添加本任务没有要求的开关禁用 API。删除计划仍用撤销条。

同一实机同签名保留数据更新 **debug vc2024**，en/de 浅深设置页均回读截图未见裁切。设置→关于→返回的普通往返录屏抽帧中胶囊保持在同一轨道，转场中唯一性及坐标由组件回归补充；实机还执行关于页手势返回，以及系统三项动画设 0 后进入关于并系统返回，回到原设置滚动位置。随后系统三项动画恢复 1.0。未改写/删除计划及记录。

r2 测试/构建日志在 `hiplab-r2-nav-20261107/output/ui-acceptance-20261107/`；实机截图和 `r2-nav.mp4` 在 r1 隔离副本 `hiplab-ui-acceptance-20261107/output/ui-acceptance-20261107/`。录屏为约 2.09 秒有效帧（静止时不持续产帧），不是 5 秒性能测量；`r2-home.png` 是启动动画帧，排除为验收截图。正式 SDK 动作库的媒体行为不由这些导航结论推定。

## r3 / #131（验收尚未通过）

向下合入 r2 修复（merge 1164b13）。App 自有 DrillMediaCard 保持同一媒体节点，通过 paused 暂停；补接 shell 页面活动、路由、TickerMode 和前后台，自动播放也归入唯一播放协调器。原 owner/held 只限制逻辑卡片数，旧解码器异步销毁期间仍可能创建第三个；现经 SDK 公开 repository 接口排队，等待 SDK 在实际 native disposal 完成后释放 pin，再准入新解码器。下载、校验、封面与解码仍归 SDK，未修改其源码/固定版本。

`flutter pub get` 成功、lock 未变；移除新测试中一个无用 import 后最终 analyze 无问题。未过滤全量 `flutter test --concurrency=1 --reporter json`：**365 通过 / 同 4 项 SDK 字体失败 / 1 默认 live 跳过，退出 1**。包含全部 r1/r2 回归及新增 6 项媒体回归：同一 native surface 暂停/继续不 seek/重建、第三个等待真实异步释放、取消和幂等释放、创建中退场仍占槽、离页释放无构建异常、多 autoplay 仅一个播放者。测试 native 是可控替身，其峰值断言不等同真机性能或全 App 解码器实测。

**阻止整体验收的缺口**：正式动作库 `FlareSharedLibraryPage` 和 `FlareShared.openDetail` 仍使用 SDK TrainingLibraryDetail；它暂停时把 playing 设为 false，SDK 销毁解码器并回封面。r3 原补丁及本轮 App 自有卡片修复均未覆盖该入口。已在同一固定 SDK 的 vc2024 真机基线，哥萨克蹲播放至下蹲时暂停，观察跳回站立封面（`r3-sdk-detail-poster.png` / `r3-sdk-playing-baseline.png` / `r3-sdk-paused-baseline.png`）。该 SDK 详情的英文 Works/Caution 窄列还出现单词换行，不能把正式库长文案列为完全通过。

两槽排队只保证经过 DrillDecoderRepository 的 App 自有卡片；SDK 正式详情/训练播放器没有经过该逐卡包装，不能声称全 App 严格最多两个。用户禁止改 SDK，本轮不修改它，也不临时替换正式 SDK 详情。后续需另行决定 SDK 修复，或独立审阅使用公开 TrainingLibraryBrowser 回调接入 App 详情的方案；该方案会改变宿主边界，尚未实施。SDK native 释放失败时池保守保留占位，后续卡可能等待，不能把失败当释放成功。

### r3 最终真机与包回读

同签名保留数据更新至 **debug vc2025 / 1.0.12**。预设热身→App 自有详情：英文浅色 Y-T-W、德语深色手腕摆动均暂停在当前姿态，间隔截图的媒体区域像素完全一致，继续后画面推进；与封面姿态不同。英文浅色还检查系统减少动画后的暂停与返回。原计划仍为 1 个，没有保存测试新计划、开始训练或新增记录。

最终 vc2025 的正式 SDK 动作库再次复现哥萨克蹲暂停返回站立封面，和基线一致；`r3-final-sdk-poster/playing/paused.png` 保留证据。App 自有详情通过不能覆盖此失败。没有做真机全局解码器峰值计数或长期内存/性能测量。

最终安装 APK 回拉 SHA-256 与本机检查包一致：`a8791f60d5a33cc351d81e4bbe9003910377347b75b9ae0687bea5d4ea02c5af`，167,643,067 字节，证书 SHA-256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。包在 r3 工作树 `output/ui-acceptance-20261107/r3-debug-vc2025.apk`，未上传/入库；它是调试验收包，不是 release 交付或新版本发布。首次构建内存不足后用单 worker/1 GiB heap 的临时本机参数构建，原 Gradle 文件已恢复，不提交这些环境参数。

已恢复原简体中文、浅色、0.25×、均衡画质、卡通教练；系统三项动画回读均为原值 1.0。重开 App 后回首页。r3 日志在 r3 工作树 `output/ui-acceptance-20261107/`，截图、像素比较和设备包回读在 r1 工作树同名输出目录；私人定义文件、原始本机日志和 APK 均不入库。没有调用真实 AI/支付服务，也不把本次 UI 检查补记为此前 +22 的动作/AI/离线验收。
