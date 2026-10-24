# 26 项基线失败的修复对照

从已合入并推送的 `master 4b5f70dbdaf37fbec961822870fb4eedc29196dd` 建立 `codex/fix-baseline-tests`。最终全量 **361 通过、0 失败、1 项原有 opt-in 跳过**，测试总数仍为 362；原 26 项均在最终 JSON 中逐项查到唯一成功结果，未以总体数量替代对应结果。

唯一测试改名是详情页当前正确布局描述，表中保留旧名/新名对照；没有删测试或新增 skip。源码指纹和原始日志哈希见 [verification.json](verification.json)。此修复候选尚未合入/推送。

| 序号 | 文件 | 原失败测试名 | 当前测试名 | 修复前 | 修复后 | 处理 |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `app/test/ui/compact_localization_test.dart` | compact muscle labels, home hint, and detail actions fit across locales and phone sizes | 同名 | 失败 | 通过 | 阶段名完整两行，时间计数移位 |
| 2 | `app/test/ui/flow_regressions_test.dart` | appearance switch persists, repaints and tells the scene | 同名 | 失败 | 通过 | 定位主题专属分段控件 |
| 3 | `app/test/ui/flow_regressions_test.dart` | inactive iframe focus keeps detail visible while hidden stops it and resumed restores paused | 同名 | 失败 | 通过 | 区分可见与活跃，inactive 保留画布 |
| 4 | `app/test/ui/flow_regressions_test.dart` | phone safety → phase muscle → drill → SDK plan route → same paused frame | 同名 | 失败 | 通过 | 更新定位/路由等待，验证无结果不伪造记录 |
| 5 | `app/test/ui/flow_regressions_test.dart` | plans: preset → complete SDK plan route → return, save as mine, edit and delete with undo | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 6 | `app/test/ui/ios_layout_test.dart` | ProMax dark text 1.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 7 | `app/test/ui/ios_layout_test.dart` | ProMax dark text 2.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 8 | `app/test/ui/ios_layout_test.dart` | ProMax light text 1.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 9 | `app/test/ui/ios_layout_test.dart` | ProMax light text 2.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 10 | `app/test/ui/ios_layout_test.dart` | SE3 dark text 1.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 11 | `app/test/ui/ios_layout_test.dart` | SE3 dark text 2.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 12 | `app/test/ui/ios_layout_test.dart` | SE3 landscape dark text 1.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 13 | `app/test/ui/ios_layout_test.dart` | SE3 landscape dark text 2.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 14 | `app/test/ui/ios_layout_test.dart` | SE3 landscape light text 1.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 15 | `app/test/ui/ios_layout_test.dart` | SE3 landscape light text 2.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 16 | `app/test/ui/ios_layout_test.dart` | SE3 light text 1.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 17 | `app/test/ui/ios_layout_test.dart` | SE3 light text 2.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 18 | `app/test/ui/ios_layout_test.dart` | iPhone13 dark text 1.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 19 | `app/test/ui/ios_layout_test.dart` | iPhone13 dark text 2.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 20 | `app/test/ui/ios_layout_test.dart` | iPhone13 landscape dark text 1.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 21 | `app/test/ui/ios_layout_test.dart` | iPhone13 landscape dark text 2.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 22 | `app/test/ui/ios_layout_test.dart` | iPhone13 landscape light text 1.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 23 | `app/test/ui/ios_layout_test.dart` | iPhone13 landscape light text 2.0 core pages fit | 同名 | 失败 | 通过 | 短高详情滚动、动作卡可见后点击、等待路由资产 IO |
| 24 | `app/test/ui/ios_layout_test.dart` | iPhone13 light text 1.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 25 | `app/test/ui/ios_layout_test.dart` | iPhone13 light text 2.0 core pages fit | 同名 | 失败 | 通过 | 有界等待路由资产 IO |
| 26 | `app/test/ui/polish_round2_test.dart` | drill page: picture under the status bar, bar forms on scroll | drill page: fixed header and action stay outside scrolling content | 失败 | 通过 | 按固定标题/底栏与独立滚动内容验证 |
