# CoachConversationController 接入候选（2026-10-24）

基线为 Flare `master` 的 `63d3318e257e2331a4af1f9f9f5cada40d0d357b`，候选分支为 `codex/coach-conversation-controller`。尚未合入或推送；全量测试有 26 项基线失败，未满足合入条件。HipLab 与 `release/1.0` 未修改。

## 正式依赖

| 包 | 固定 tag | lock 中的提交 |
| --- | --- | --- |
| ugk_coach | ugk_coach-v0.5.0 | d7e0b8fa3afc514fe3a53427cfddb8f7b24c984f |
| ugk_trainer | ugk_trainer-v0.2.3 | d7e0b8fa3afc514fe3a53427cfddb8f7b24c984f |
| ugk_coach_ui | ugk_coach_ui-v0.1.1 | 3302d6235a39e2c2b4b51fa196cc32b37c31b54c |

按 SDK 的 [controller 接入说明](https://github.com/mhgd3250905/ugk-3d-pose-sdk/blob/d7e0b8fa3afc514fe3a53427cfddb8f7b24c984f/docs/coach-conversation-controller.md) 实现，远端 tag 已核对，正常远端解析后 `flutter pub get --enforce-lockfile` 通过。没有本地路径依赖、编码适配或 SDK 源码改动；锁文件仅升级 coach/trainer 两项。

## 替换范围

删除 `CoachAnswer`、`CoachMessage` 和旧 `CoachConversation` 账本；删除 `AiCoachSession` 的可变消息列表、回答序号、待答身份、已答集合、选择校验/排序、自管 `CancelToken` 与发送/取消后手工追加消息。删除 `CoachService.ask`、`_record`、直接 Agent send/reset、上下文回滚代码及 `TemplateFallback.userTexts(CoachConversation)`。失效的旧类型注入和状态断言已迁移，重复的 SDK 内部问题预算测试已删除。

App 只创建一个 Agent/controller；页面直接呈现 SDK 不可变消息，按钮使用 `canAnswer`、`questionAnswered` 和 `answeredChoices`。文字/选择回答、取消、新对话、恢复和销毁委托 controller；历史计划/动作重新过 App 门禁后恢复。关页期间完成的问题也通过 SDK 失效，重开不恢复交互资格。

`AiCoachSession` 名称保留为呈现薄层，仅持有进度/耗时、单个等待输入气泡、取消输入恢复、App 状态文案和计划保存状态。保存使用 SDK 消息 ID。已加载时直接进入 SDK 同步提交锁，双提交不覆盖首份输入；迟到轮次不能清掉新一轮呈现。

Key、HTTP client、接口、白名单/profile、媒体交集、器械/场景/保护部位上下文和既有安全/预设规则继续属于 App。新对话复用同 Agent，并刷新可信目录快照。已有红旗安全命令保留本地提示且禁止联网，历史交由 controller；没有新增回落实现。无 Key 仍隐藏全部 AI 入口。CoachRoutine 映射、持久化、训练前门禁及完整 TrainerPlayer 启动保持，布局/主题组件和训练素材未改。

## 验证与阻塞

Flutter 3.47.8 / Dart 3.13.7，最终静态分析无问题。App 全量 `flutter test --no-pub --reporter expanded`：**335 通过、26 失败、1 跳过**。跳过项为原有显式 opt-in 的真实 AI smoke；本轮不传 Key、不调用真实模型。

迁移相关测试覆盖同 Agent 多轮、SDK 选择排序与 App 上下文、同步双提交、取消立即重发和迟到回复、关页期间完成、恢复历史只读、正文/问题同显、无 Key 隐藏、保存重试与完整计划开练。

独立临时工作树检出未修改的 `63d3318`，强制锁文件解析后执行相同全量命令：**333 通过、相同 26 项失败、同一项跳过**。候选/基线失败名单逐项相同，新增失败为 0；没有删除、跳过或放宽这些失败断言。

26 项均来自本轮未改的四份测试：`flow_regressions_test.dart` 4 项、`ios_layout_test.dart` 20 项、`compact_localization_test.dart` 1 项、`polish_round2_test.dart` 1 项。只读排查发现 16 项旧测试接线问题（旧选择器、重复标签、资产 IO 等待、旧详情结构断言），以及 8 项横屏详情溢出、1 项多语阶段名截断、1 项 inactive 场景可见性问题。修复会超出本轮会话迁移范围，需另定范围；在此之前不满足“全量通过后合入”条件。

完整失败名单、命令、日志哈希与源指纹见[公开证据](evidence/coach-controller-20261024/verification.json)。本机原始日志在 `output/coach-controller-20261024/`；基线工作树仅用于对照，验证结束后移除。

本轮未做浏览器、Android release 或真机验证，没有安装/发布新包。源码版本仍 `1.0.10+15`，既有手机 `1.0.11+16 / R17`、L52 有限认可和长期设备 QA 的边界保持。下一步审阅迁移候选并确定基线失败处理范围，合入和推送仍需开哥同意。
