# AI 定制（AI 训练助理试验田）

## 当前使用与配置

Flare 在计划页和会员权益页接入同一套 SDK 教练对话。`CoachChatController` 与 `CoachChatPage` 管理聊天、问题、建议与计划卡。宿主负责会员入口、生命周期、动作范围、训练回调和本机持久化，使用 `CoachChatAgentMode.qaV2` 及随包 `aiTags`。会员可从对话发起训练或保存计划。

AI 与动作库共享 r2-v11 的 248 项授权范围。封面和缩略图随包提供，视频按需下载。公共目录的更新频道默认为 `stable`，已验证的更新在下次启动生效。见 [资产来源](asset-sources.md) 和 [验证记录](verification.md)。

原生版本通过 `FLARE_REVENUECAT_ANDROID_KEY` 或 `FLARE_REVENUECAT_IOS_KEY` 配置 RevenueCat 匿名身份，通过 `FLARE_AI_GATEWAY_URL` 指定会员 AI 网关。构建时用本机配置传入这些值。网关校验会员权益，并返回会员、每日额度与频率限制结果。配置和用户数据的范围见 [本地数据说明](privacy-local.md)。

主要入口为 `lib/coach/flare_coach_chat.dart`、`lib/ui/flare_coach_chat_page.dart` 与 `lib/coach/membership_gateway.dart`。SDK 依赖与发布包身份见 [版本台账](version-ledger.md)。

## 历史接入

早期直连配置、51 项范围和一次追问设计属于旧实现。保留 [PR122 整合记录](pr122-ai-coach-integration-2026-10-20.md)、[Agent 迁移第一步](sdk-step1-2026-10-23.md) 与 [旧对话控制器记录](coach-conversation-controller-2026-10-24.md) 供追溯。

## 历史真实冒烟（2026-10-20，SDK 0.1.0/0.1.1，经 OpenCSG）

当时用 App 随包的 profile + 目录快照、SDK 原样编排，各 1 次计费调用；本轮没有重跑，不证明 SDK 0.1.2 或合入主线后的真实服务验收：

| | 内核 v1（SDK 0.1.0） | 内核 v2（SDK 0.1.1） |
|---|---|---|
| 输入 | 在家 20 分钟，想练托马斯的支撑臂和侧撑，手腕有点不舒服 | 健身房 30 分钟，练托马斯的核心压缩和腿 |
| 结果 | 首轮通过 | 首轮通过 |
| prompt / 缓存命中 | 5267 / 5120 | 5359 / 5120 |
| completion / 推理 | 3947 / 3225 | 4282 / 3547 |
| 耗时 | 38.7 s | 42.6 s |
| 计划 | 8 个动作，估算 19.2 分钟（目标 20），avoid=手腕，去掉了手腕承重动作 | 12 个动作（forearms-A 出现两次，App 并为一项），估算 25.7 分钟（目标 30） |

两次的动作全部在 App 内、有视频。
