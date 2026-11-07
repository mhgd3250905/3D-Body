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
