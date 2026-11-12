# Flare Android 正式版权限申请与数据安全填表稿

应用为「Flare 托马斯全旋-3D 动作分解」（`dev.mhgd.flare`）。会员与 AI 声明以已投放内部测试的 `1.0.14+34`（`55b7d70`）为基线，封闭测试依据 Alpha 的实际记录。[+34 源码](https://github.com/mhgd3250905/3D-Body/commit/55b7d707fabfaf41c277d6d224e10a5105657231)

## 正式版权限问卷

### 封闭式测试

**招募难易程度**

如必须选择，建议选页面的中性档。已知 Alpha 通过指定 Google 群组限定参与资格，已满足连续参与门槛，现有记录没有提供招募所需人力或耗时。

**测试者的参与情况**

> 我们于 2026 年 10 月 9 日在 Alpha 轨道发布 `1.0.0-closed-test-1`，通过指定 Google 群组限定参与资格，由测试者从 Google Play 自行加入。控制台确认至少 12 位测试者连续加入至少 14 天。预期用户会反复查看全旋分解、浏览动作并跟练；我们没有逐人的使用记录，无法确认每项功能的覆盖或使用频率。会员与 AI 同意功能另走内部测试。

**收集方式及收到的反馈**

> 封闭式测试配置了反馈邮箱，也允许测试者通过 Google Play 提交私下反馈。封闭测试期间未收到测试者书面反馈。我们在独立内部测试中复查了会员购买与恢复入口，后续完善了购买进度、会员状态和首次使用 AI 前的数据共享告知。

### 应用及受众

**目标受众**

> 学习或练习托马斯全旋的街舞爱好者，包括希望分阶段理解手部支撑、重心与腿部路线的初学者，以及需要按计划练习相关力量和活动度的舞者。

**应用价值**

> 用可旋转和分段查看的 3D 演示拆解托马斯全旋，说明各阶段的关联肌群。动作库提供 248 项相关练习，用户可查找动作、按计划跟练并在设备上查看训练记录。

**首年预计安装量**

选择页面最低档。如页面显示「0–10,000」，选该档。

### 正式版发布准备

**测试后做了哪些改进**

> 封闭式测试没有收到书面反馈。后续内部测试与自动化回归中，我们复查了会员购买和恢复入口，完善了购买进度与续订状态展示，并在 1.0.14+34 增加了首次使用 AI 前的数据共享同意及撤回。拒绝或撤回后，应用停止发送 AI 请求。

**如何判断已具备申请条件**

> Google Play 已确认 Alpha 达到封闭测试门槛。1.0.14+34 通过静态分析及 19 项定向测试，覆盖会员门禁、AI 同意、撤回和网关拦截，并已投放内部测试。我们以这些结果申请正式版权限，公开发布前继续完成设备验收和素材审核。

现有设备证据涵盖 +32 会员期间与续订状态，以及 +30 年付测试购买。+34 的真机、重装恢复和实际 AI 额度尚待验证。当前 Pose-Hub 素材目录仍为 `releaseEligible=false`。[版本与验证台账](../../app/docs/version-ledger.md) · [官方申请指引](https://support.google.com/googleplay/android-developer/answer/14151465?hl=zh-Hans)

## 数据安全表

「是否收集或分享须申报的用户数据」选「是」。「收集的用户数据是否在传输中加密」选「是」。应用使用匿名订阅标识，没有注册入口。删除请求使用公开隐私政策上的联系邮箱，确认支持方能够实际处理其负责的数据后，按控制台所问范围申报删除机制。公开政策：[Flare 隐私政策](https://flare-privacy.294851575.workers.dev/)

| Play 数据类型 | 收集 | 分享 | 用户可选择 | 临时处理 | 用途 |
| --- | --- | --- | --- | --- | --- |
| 财务信息 → 交易记录（购买记录） | 是 | 否 | 否 | 否 | 应用功能、分析 |
| 设备 ID 或其他 ID → 设备 ID 或其他 ID | 是 | 否 | 否 | 否 | 应用功能、分析、欺诈防范、安全和法规遵从 |
| 信息 → 其他应用内消息 | 是 | 是 | 是 | 否 | 应用功能 |
| 健康与健身 → 健康信息 | 是 | 是 | 是 | 否 | 应用功能 |
| 健康与健身 → 健身信息 | 是 | 是 | 是 | 否 | 应用功能 |
| 应用活动 → 应用互动 | 是 | 否 | 是 | 否 | 应用功能、欺诈防范、安全和法规遵从 |

购买记录涵盖商店凭证、购买商品、购买日期、有效期、试用或续订状态。Google Play 直接处理支付卡资料。RevenueCat 匿名应用标识用于权益查询、恢复和订阅统计，启动时即可能使用。AI 网关还使用 IP 和派生键防滥用。购买记录、标识符和计数的「分享：否」基于支付与订阅服务及 Cloudflare 受托处理，网关不会把原始匿名标识或客户端 IP 转发给模型服务。[RevenueCat 指引](https://www.revenuecat.com/docs/platform-resources/google-platform-resources/google-plays-data-safety) · [Flare 订阅集成](https://github.com/mhgd3250905/3D-Body/blob/55b7d707fabfaf41c277d6d224e10a5105657231/app/lib/platform/flare_revenuecat.dart) · [网关转发与计数](https://github.com/mhgd3250905/ugk-ai-gateway/blob/006e5eaedbfb913f9552bef2c7fa0f9a52838163/src/index.ts)

应用内消息含用户输入和相关上下文。健身信息含对话中的训练目标、器材与练习背景。健康信息单独申报，覆盖对话中提供的疼痛、不适、伤病或安全追问答复，这些症状属于 Play 定义的健康信息。三类内容都可能随请求发往第三方模型服务商，当前使用 DeepSeek 模型。基础训练、自测和本机训练记录独立运行，设备内保存的数据无需作为上传数据申报。+34 可不启用 AI，并支持撤回同意。[Google Play 数据类型说明](https://support.google.com/googleplay/android-developer/answer/10787469?hl=zh-Hans) · [Flare AI 同意文案](https://github.com/mhgd3250905/3D-Body/blob/55b7d707fabfaf41c277d6d224e10a5105657231/app/lib/l10n/app_zh.arb#L240-L254) · [固定 SDK 的安全追问规则](https://github.com/mhgd3250905/ugk-3d-pose-sdk/blob/7cd1c4392dc4114729f8f4301d3df2848524e6a3/lib/src/qa_v2/coach_qa_sop.md)

应用互动涵盖网关保存的请求计数、窗口和派生键，用于每日额度及 IP 限流。计数写入 Durable Objects。模型服务端的请求留存未核实，按「非临时处理」申报。[网关计数存储](https://github.com/mhgd3250905/ugk-ai-gateway/blob/006e5eaedbfb913f9552bef2c7fa0f9a52838163/src/counter.ts) · [HipLab 已定稿的填表口径](https://github.com/mhgd3250905/HipLab/blob/b52a79d7a6e20c6f347e33d6f446a045055f2ccf/.github/play-data-safety-membership.md)
