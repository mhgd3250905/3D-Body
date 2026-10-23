# FlareLab 共用 SDK 编排与播放摸排

后续实施：开哥已确认整计划 + TrainerPlayer 方案，现版 SDK 接入见[实施记录](sdk-whole-plan-player-2026-10-23.md)。下文保留摸排时的原始状态及证据。

2026-10-23。本次只核对接入与 SDK 能力、生成复现证据；未继续修改业务代码、安装 APK、操作手机、合并或推送。由开哥将本报告转给 SDK 侧决定方案，尚未向 SDK 线程发消息。

## 最新目标与结论

三个 App 共用 `ugk_coach` / `ugk_trainer`：完整训练计划交给 SDK，由 SDK 编排阶段、播放训练界面、按节奏播报和推进、产出结果；App 负责品牌主题、文字、素材绑定、业务入口和本地存储兼容。

开哥最新明确：**计数以 SDK 为准，用户不必每次点击或反复确认，以语音播报引导训练。** 此要求覆盖前面“保留手点计次”的接入要求。逐次点击、手动换侧、固定左侧先行不再作为必须要求 SDK 补齐的接口。不预先要求 SDK 增加控制器或复制 Flare 的旧控件，具体方案由 SDK 侧决定。

SDK 已具备完整 `TrainerPlayer` 和整计划编排能力，SmartFit 已按此方式接入。FlareLab 目前只接入单动作 SDK 引擎、语音和保活，仍保留自己的训练页面及逐动作流程；这部分接入尚未达到目标，属于 App 后续应调整的范围。

## 核对基线

- FlareLab：`codex/flarelab-sdk-agent-trainer`，提交 `6ef69744f8cfaa3d1310ca7c83eda9c1342e5941`；工作区另有此前英文语音与通知修订，均保留。手机仍为此前安装的 `1.0.10+13`。
- SDK：`b8f5b82bcf6f4075480fa6fb2382acea4c44b9c0`，`ugk_coach 0.4.0` / `ugk_trainer 0.1.7`。实际加载缓存及相关源码已核对固定提交，未修改 SDK 或缓存。
- 当前 App 动作目录：Pose-Hub `0.3.0`，来源提交 `36e1bb678047a3d5613a553a05be37dac8d9046b`，51 个 FlareLab 动作。数量结论针对这份固定快照，不推断上游其它分支的状态。
- SmartFit 参考：`E:/AII-3D/3D-Sport-AI/Sport-Helper-media-cache/lib/ui/player_page.dart`。

## SDK 已有能力与 App 接入责任

| 范围 | SDK 已有能力 | FlareLab 当前状态 / 应由 App 做的调整 |
| --- | --- | --- |
| 统一计划 | `TrainingPlan` 保留块、动作、剂量、循环轮次、轮间休息 | 目前转成旧 `TrainingRoutine` 后拍平，后续须保留完整计划语义 |
| 连续训练 | `SessionBuilder` 将整计划生成准备、工作、换侧、休息、轮间休息、结束阶段 | 目前每次只把一个动作送入 `DrillTrainingSession`，动作之间仍由 App 导航串联 |
| 共用界面 | `TrainerPlayer` 已包含示范舞台、进度、暂停、上一项、跳过、结束与保存反馈 | 目前 `TrainingTimerPage` 仍绘制旧界面；应改用 SDK 整页 |
| 自动节奏与语音 | `Rhythm`、`SessionScript`、`SessionRunner` 支持按节奏计数、计时、换侧和休息播报 | 当前适配把次数动作统一设为 `selfPacedReps`，未消费目录已有节奏 |
| 主题、语言、素材 | `TrainerTheme`、`TrainerStrings`、`drillOf`、`mediaBuilder` | 可通过公开接口接入 Flare 配色、现有 14 语文字及 `DrillMediaCard`；无需改 SDK UI 源码 |
| 结果与保存 | `SessionResult`、固定 `sessionId`、保存失败重试、`onFinished` | App 需兼容旧记录格式并做幂等保存，SDK 负责结果语义；下方有两项实测统计缺陷 |

一个明确的 App 映射问题：原计划为循环 `A → B`，共 3 轮，每轮休息 60 秒。SDK 能编排 `A → B → A → B → A → B` 并保留轮休；当前 `CoachPlanMapper` 把轮数乘入组数，变为 `A 连做 3 组 → B 连做 3 组`，没有保存轮间休息。该映射在 PR122 已存在，本轮未改，不归为 SDK 缺陷。此例是源码构造对照，不冒称真机已经收到并执行过这份 AI 计划。

App 定位：`lib/coach/plan_mapping.dart:24–67`、`lib/ui/ai_coach_page.dart:267–270,467–485`、`lib/ui/app_shell.dart:736–751`、`lib/ui/timer_page.dart:85`、`lib/trainer/drill_training_session.dart:18–139`。SmartFit 的 `player_page.dart:77` 直接使用 `TrainerPlayer(plan: trainerPlan(plan))`，`domain/session.dart:13` 用 `PlanCodec` 保留整计划。

## 请 SDK 侧决定的能力边界

### 1. 没有节奏资料的次数动作如何自动引导

当前固定目录共有 **51 项：8 项默认计时，43 项默认计次**。43 项计次动作中只有 `glute-max-A`、`hip-flexors-A` 带有效节奏；其余 **41 项** 缺少 `rhythm` 和可用视频 `repSeconds`，按 SDK 默认会落入 `selfPaced`。

`selfPaced` 的实际语义是播报开始/要点，随后等待用户点“完成本组”；没有逐次自动计数，也不会到目标次数自行结束。SDK 早期设计文件 `docs/trainer-plan.md` 的原句是：“A 托马斯计次动作保留‘自己点完成本组’，计时动作跟倒计时。”这是旧方案与开哥最新自动引导要求的差异，不是 SDK 实现违反了当时方案。

请 SDK 侧确定：由 Pose-Hub 补齐动作节奏，还是提供 SDK 统一的缺省节奏策略，以及哪些动作仍需自主完成。App 消费正式规则，不在各 App 自行猜测每次动作时长。视频循环总时长也不应未经定义直接当作一次动作的时长。

对应源码：`rhythm/rhythm.dart:51–76,245–282`、`voice/session_script.dart:368–399`。这里的自动计数表示按计划节奏引导进度；现有 SDK 不以这些计数证明用户实际做出了对应次数。

### 2. Y/T/W 等复合动作的统一编排表达

Flare 有“一组内包含多个分段”的动作。现有 `sessionBuilder` 可编排多个相位，但工作完成身份只有 `(itemIndex, set, side)`，没有独立的段身份。

实测：将 Y/T/W 编为同一工作身份，Y 完成后跳过 T/W，可能把整项记为完成；拆成三个独立 `PlanItem` 的对照统计正确，但播放器会按三个计划项展示和统计。

请 SDK 决定官方表达方式：独立计划项并提供统一聚合约定，或支持一个动作的一组内多段。不要求在 App 内建立另一套隐藏的完成判定。此项是编排模型边界，不能笼统说 SDK 不支持分段。

### 3. 统一播放策略与可选操作

默认侧别、换侧倒数、准备与休息推进采用 SDK 约定。SDK 已有暂停、上一项、跳过和结束；`skip()` 在休息阶段会进入下一工作段，因此不把“缺少跳过休息”列为问题。

旧 App 的“休息加 15 秒”“计时段提前完成”“训练中声音开关”若要继续提供，应由 SDK 决定作为通用功能还是公开扩展；本次不将它们升级为必须新增接口的阻塞条件。后台/锁屏是继续播报还是暂停、音频中断后如何恢复，也应使用 SDK 明确的统一策略并另行验收，不能沿用 App 旧暂停逻辑后宣称已经验证 SDK 播放器行为。本轮没有继续锁屏测试。

语音接口与语音素材是两层：SDK 可调度已提供的语言素材；Flare 当前已安装 +13 包只有中文口令，其它语言使用提示音。此前工作区新增英文通用口令尚未安装验收。App 14 语文字支持不能等同于 14 语完整口令，动作专属要领与节奏台词仍需统一素材来源。

## 两项已复现的 SDK 结果统计问题

均使用固定版本的公开纯 Dart API，没有操作 SDK 私有状态。

| 场景 | 应有结果 | 实测结果 | 边界 |
| --- | --- | --- | --- |
| 默认两组计划：完成第 1 组，返回重练第 1 组，第 2 组只练一部分后结束 | 完成 1/2 个不同组，单项 partial | 单项记成 2/2 组、completed | 默认 `SessionBuilder` 与公开 `previous()` 即可复现；整场 `full=false` 正确 |
| 公开自定义左先行：左侧完成，右侧只练一部分后结束 | 完成 0 个完整双侧组，单项 partial | 单项记成 1 组、completed | 默认右先行对照正确；整场 `full=false` 正确；不代表要求 Flare 继续强制左先行 |

共同定位：`packages/ugk_trainer/lib/src/result/session_result.dart:312–329` 按完成 visit 累加，其中 `Side.left` 被视为最后侧；未按必需组/侧身份计算完成。整场的 `fullyCompletedExercises` 则会去重，所以出现单项与整场不一致。

建议 SDK 统一结果口径：完成组数按唯一组及全部必需侧别计算；返回重练的时间仍累计，但不顶替尚未完成的不同组。具体修复和回归测试留给 SDK 侧。

补充边界：既有记录还指出精确小数相位结束时间可能因浮点减法差一点而未推进。这是引擎数值比较问题，不据此宣称默认播放器真机会卡死；与当前主要接入问题分开处理。

## 证据与后续

- [6 个最小复现及详细结果](../../output/sdk-player-audit-20261023/README.md)：两项确定缺陷、左右对照、分段共享身份与独立项对照。
- [公开 API 复现脚本](../../output/sdk-player-audit-20261023/reproduce_results.dart)、[原始结果 JSON](../../output/sdk-player-audit-20261023/results.json)、[固定源码与断言回执](../../output/sdk-player-audit-20261023/evidence-summary.json)。脚本正常退出、断言确认成功表示问题被复现，不表示 SDK 无缺陷。
- [目录自动引导核对](../../output/sdk-player-audit-20261023/catalog-guidance.json)：按 SDK 公开解析与节奏选择 API 统计当前 51 项目录。

待 SDK 侧回复上述边界及必要修复后，FlareLab 按正式契约接入完整计划与 `TrainerPlayer`，再继续真机验收。当前不继续旧界面补丁，不合入 `master`、不推送，也不进入第 2 步视觉改版。
