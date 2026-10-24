# 迁移候选与 63d3318 基线的全量失败对照

2026-10-24。功能待审提交 `78a8a65a7af8c00dafa7fcd6211e69a07aab852d`；后续交审记录提交不改变已验证源码与测试。基线为 `63d3318e257e2331a4af1f9f9f5cada40d0d357b`，两边均运行 `flutter test --no-pub --reporter expanded`。

| 版本 | 通过 | 失败 | 原有 opt-in 跳过 |
| --- | ---: | ---: | ---: |
| 63d3318 基线 | 333 | 26 | 1 |
| 迁移候选 | 335 | 26 | 1 |

**26 项失败名称与测试文件完全一致，新增失败 0。** 四份失败测试与基线 Git blob 相同，没有删除、跳过或放宽。迁移相关用例补跑 **155/155 通过、0 失败、0 跳过**，静态分析无问题；锁文件强制检查通过。完整日志哈希和源码指纹见同目录 `verification.json`。

| 序号 | 测试文件（app/test/ 下） | 完整测试名 | 基线 | 候选 | 对照 |
| ---: | --- | --- | --- | --- | --- |
| 1 | `ui/compact_localization_test.dart` | compact muscle labels, home hint, and detail actions fit across locales and phone sizes | 失败 | 失败 | 相同 |
| 2 | `ui/flow_regressions_test.dart` | appearance switch persists, repaints and tells the scene | 失败 | 失败 | 相同 |
| 3 | `ui/flow_regressions_test.dart` | inactive iframe focus keeps detail visible while hidden stops it and resumed restores paused | 失败 | 失败 | 相同 |
| 4 | `ui/flow_regressions_test.dart` | phone safety → phase muscle → drill → SDK plan route → same paused frame | 失败 | 失败 | 相同 |
| 5 | `ui/flow_regressions_test.dart` | plans: preset → complete SDK plan route → return, save as mine, edit and delete with undo | 失败 | 失败 | 相同 |
| 6 | `ui/ios_layout_test.dart` | ProMax dark text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 7 | `ui/ios_layout_test.dart` | ProMax dark text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 8 | `ui/ios_layout_test.dart` | ProMax light text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 9 | `ui/ios_layout_test.dart` | ProMax light text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 10 | `ui/ios_layout_test.dart` | SE3 dark text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 11 | `ui/ios_layout_test.dart` | SE3 dark text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 12 | `ui/ios_layout_test.dart` | SE3 landscape dark text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 13 | `ui/ios_layout_test.dart` | SE3 landscape dark text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 14 | `ui/ios_layout_test.dart` | SE3 landscape light text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 15 | `ui/ios_layout_test.dart` | SE3 landscape light text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 16 | `ui/ios_layout_test.dart` | SE3 light text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 17 | `ui/ios_layout_test.dart` | SE3 light text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 18 | `ui/ios_layout_test.dart` | iPhone13 dark text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 19 | `ui/ios_layout_test.dart` | iPhone13 dark text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 20 | `ui/ios_layout_test.dart` | iPhone13 landscape dark text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 21 | `ui/ios_layout_test.dart` | iPhone13 landscape dark text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 22 | `ui/ios_layout_test.dart` | iPhone13 landscape light text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 23 | `ui/ios_layout_test.dart` | iPhone13 landscape light text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 24 | `ui/ios_layout_test.dart` | iPhone13 light text 1.0 core pages fit | 失败 | 失败 | 相同 |
| 25 | `ui/ios_layout_test.dart` | iPhone13 light text 2.0 core pages fit | 失败 | 失败 | 相同 |
| 26 | `ui/polish_round2_test.dart` | drill page: picture under the status bar, bar forms on scroll | 失败 | 失败 | 相同 |

本轮按用户追加标准交审：失败集合与基线完全一致、无新增失败、迁移相关用例全过、分析无问题。此标准满足不代表已获合入同意；候选尚未合入/推送。

迁移经开哥同意合入后，再另开分支处理这 26 项：真实横屏/多语等产品问题修代码，陈旧测试按当前正确行为更新，目标全量全绿并单独交审。该后续分支尚未开始，不混入本候选；HipLab 与 release/1.0 保持。
