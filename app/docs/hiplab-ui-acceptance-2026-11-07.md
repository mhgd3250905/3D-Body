# HipLab UI 分层验收（2026-11-07）

本批仅处理 Draft PR #129 → #130 → #131；不合入 master，不操作 iOS / PR #127，不改 SDK 或 Pose-Hub。作者 mhgd3250905 <mhgd3250905@gmail.com>。源码保持 1.0.12+21、SDK f7b8a8e；真机检查使用独立 debug 构建号，不是正式内测/发布版本。主目录、历史包、stash、设备数据保留。

## r1 / #129

验收源为 29eb410 加本分支按钮修复。禁用的主、次按钮原先仍按压缩放；现已保持静止，按住期间切为禁用也立即复位。保留灰色禁用、填充无描边次按钮、FlareSans、橙色品牌与删除计划撤销提示条。

Flutter 3.44.7 / Dart 3.12.2，E 盘隔离副本及临时目录。`flutter pub get` 成功，最终 `pub get --enforce-lockfile` 后 lock 与 PR 原文件一致。`flutter analyze` 无问题。未过滤全量 `flutter test --concurrency=1 --reporter json`：**337 通过 / 4 失败 / 1 默认 live 跳过，退出 1**。新增 12 项按钮测试全部通过，覆盖浅深色、en/de 长标签、正常按压释放、禁用及减少动画。

4 项失败均为已有 SDK player `ar/hi × light/dark at 1.5x has no layout errors`，未删测试、放宽断言或改 SDK，不能写成全量全绿。

Android 17 / API 37 实机：同证书 `adb install -r` 从实际 vc2021 更新到 **debug vc2023**。原有 1 个计划和记录仍可见，不声称逐文件核对全部数据。已检查 en/de 设置页浅深色、德语新计划灰色禁用保存按钮、系统三项动画设 0 后打开动作选择面板；随后三项恢复原值 1.0。新计划未保存，原计划未删除/改写。软件测试中的按压/减少动画结论与有限真机观察分列；视频同帧与返回胶囊归 r2/r3。

本地证据在本批 E 盘隔离副本 `output/ui-acceptance-20261107/`：`r1-final-analyze.log`、`r1-final-tests.jsonl`、`r1-buttons.log`、`r1-en-light-settings.png`、`r1-en-dark-settings.png`、`r1-de-light-settings.png`、`r1-de-dark-settings.png`、`r1-de-new-plan.png`、`r1-de-reduced-picker.png`，均未入库。早期 `r1-start` 的 UI tree 与 `r1-settings-initial` 截图因读取/转场时机不可靠被排除。
