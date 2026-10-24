# SDK 共用聊天与训练：修复版主线接入

2026-10-24，按用户追加授权，在待审候选 `e8ae7b5cf8de3ee53f176cca962c674fb669e0e2` 上更新正式 tag。分析、相关测试和一次 Android release 编译全部通过后，直接快进合入并推送 `master`；`release/1.0` 不动。此前候选的两项失败和本机编码问题作为[历史记录](sdk-shared-ui-2026-10-24.md)保留，不改写为当时已通过。

## 固定版本与本机环境

| 包 | 正式 tag | resolved-ref |
| --- | --- | --- |
| ugk_coach 0.4.2 | `ugk_coach-v0.4.2` | `3302d6235a39e2c2b4b51fa196cc32b37c31b54c` |
| ugk_trainer 0.2.2 | `ugk_trainer-v0.2.2` | `3302d6235a39e2c2b4b51fa196cc32b37c31b54c` |
| ugk_coach_ui 0.1.1 | `ugk_coach_ui-v0.1.1` | `3302d6235a39e2c2b4b51fa196cc32b37c31b54c` |

已删除本机临时 `git.cmd` 和 `git_metadata_encoding.py`。Git 直接解析为原生可执行文件，没有临时 PATH 注入或全局 PATH 遗留；普通 `flutter pub get` 从远端解析三个新 tag，随后 `--enforce-lockfile` 复核通过。新 SDK 三份 pubspec 均为 ASCII，无需编码适配、依赖覆盖或 SDK/cache 源码补丁。

本机 Flutter 已更新为 3.47.8 / Dart 3.13.7，其 flutter_localizations 要求 intl ^0.20.3，因此 App 将 intl 精确固定到 0.20.3；锁文件同步 Flutter 要求的 matcher 0.12.20、meta 1.19.0、test_api 0.7.12、vector_math 2.4.3。除此及三个 SDK 包外未额外升级依赖。

## App 行为

沿用候选的 SDK 聊天列表、普通/澄清气泡和套路卡；Flare 的颜色、字体和文案由 `CoachUiTheme` 注入。同一个 `CoachAgent` 继续多轮问答，文字与选择问题的时序、历史禁用、取消/新对话保持。动作只来自本 App 可信白名单/profile，先经 coach 门禁再映射；保存与开练使用完整原始 TrainingPlan，训练仍统一为 `TrainerPlayer`。

没有 Key/中转令牌时所有 AI 入口隐藏。未从 SmartFit 拷代码，未修改 SDK，未为剂量溢出添加 App 侧截断、缩字或替代布局。SDK 0.1.1 在共用卡片内完成宽度约束、长剂量换行与动态行高，并统一动画测量。本轮无需追加 SDK 能力。

## 本轮验证

本机日志目录 `output/sdk-coach-ui-20261024-r2/`，公开源码/日志与产物指纹见 [verification.json](evidence/sdk-shared-ui-20261024-r2/verification.json)。

- 原生 `flutter pub get` 和 `flutter pub get --enforce-lockfile` 成功。
- `flutter analyze --no-pub`：无问题。
- 153 项受影响测试全部通过；原来的 320×740、2 倍字体浅/深两项用例保持原样并通过，没有 skip、捕获后吞掉异常或降低字体/宽度。覆盖同 Agent 多轮、可信门禁、存储重试/幂等、单动作和整套路 TrainerPlayer 完成/持久化/返回。
- `flutter build apk --release --target-platform android-arm64` 执行一次并通过（174.4 秒）；APK 为 102,017,167 字节，SHA256 `2afc42ed6d603a5e2e1d06bf24cf419daf6cdd47c290261fb6716dcef3edfa99`。没有注入 AI Key，也没有安装手机。
- 按用户明确要求，不做浏览器预览复核；没有重复 Web 构建或扩大无关全量测试。

当前 pubspec 仍为 `1.0.10+15`；本次仅编译验证，不安装手机、不发布商店，也不改变手机既有 `1.0.11+16 / R17` 或 L52 的用户验收范围。既有动作、51 媒体、个人数据及 HipLab 保留分支保持。

本轮新版构建工具生成了 `android/.kotlin/` 会话缓存，已仅将此目录加入 Android 的 `.gitignore`，不提交构建缓存。
