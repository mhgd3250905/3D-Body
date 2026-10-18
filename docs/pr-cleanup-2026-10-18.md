# 3D-Body PR 收口与 FlareLab QA 分账（2026-10-18）

本会话后续范围为 FlareLab。HipLab App 在独立仓库维护，动作修订与生产工具归属 Pose-Hub。本次处理旧 PR 的归属及记录，App、动作和媒体保持。

## 仓库 PR 收口：尚未清零

本次 GitHub 实查：3D-Body 当前仅剩1个开放 PR，即草稿 #120。**“3D-Body 开放 PR 清零”仍为待完成项**。

| PR | 本次处置 | 后续条件 |
| --- | --- | --- |
| [#118 HipLab 变体](https://github.com/mhgd3250905/3D-Body/pull/118) | 已按用户指定正文留言“已由独立仓库 HipLab 取代（main 5c7dc8e），关闭不合并”，关闭，`mergedAt=null` | 不审、不合；`feat/hiplab-flavor` 分支保留，远端仍为 `a83a0f4cde202f10ed9ddcaa5d3da519c6fc280e` |
| [#120 高清制作线](https://github.com/mhgd3250905/3D-Body/pull/120) | 保持 `OPEN`、`isDraft=true`，未留言、未合并、未关闭或删除分支 | 等 Pose-Hub 的生产工具迁移 PR 开出，取得明确链接后，在 #120 留言该链接并关闭，不合入 3D-Body |
| [#121 动作修订](https://github.com/mhgd3250905/3D-Body/pull/121) | 此前已关闭且未合并，指向 [Pose-Hub#1](https://github.com/mhgd3250905/3D-Pose-Hub/pull/1) | 保留历史记录 |

#118 的本次[关闭留言回执](https://github.com/mhgd3250905/3D-Body/pull/118#issuecomment-6248192131)与远端状态已核对。独立 HipLab 的用户指定基线为 `main 5c7dc8e`、`0.3.4+9`，已超出旧 #118 的功能范围；提交 [`5c7dc8e93dd577de0e2d46d2ab4da41e9a5a7148`](https://github.com/mhgd3250905/HipLab/commit/5c7dc8e93dd577de0e2d46d2ab4da41e9a5a7148)存在性已核对，本次未审计其功能或重新验证版本。

按本次主线交接，#120 的动作修订已在 Pose-Hub main，名称为 `h-knee-hug-r2`、`h-supine-twist-r2`、`s-seated-fold-r3`；`tools/hiplab-render` 生产工具尚未迁移。生产工具迁移 PR 是关闭 #120 的前置条件，由 Pose-Hub 侧处理。

后续关闭 #120 时，先核对迁移 PR 的真实链接与覆盖范围，再留言并关闭；重新查询全部开放 PR，只有查询结果确实为0，才将“开放 PR 清零”记为完成。清零单列为仓库管理结果，设备 QA 按下节管理。

## FlareLab L52 设备 QA：独立保持待验收

保存身份仍为 **L52 / 1.0.9+11 / v42-R17**。用户本次初步测试通过，完整验收以 [实施路线](../app/docs/development-roadmap.md)、[L52记录](../app/docs/l52-plan-skip-2026-10-17.md)及[验证记录](../app/docs/verification.md)为准。

- 原生训练完整流程、51项视频首帧/播放、前后台和快速切换、七形象/详情与同帧返回，仍需完整设备证据。
- 长期计时、暂停/恢复、后台与锁屏、性能/帧率/内存/温度/续航，仍待验收。
- iOS 编译、签名、WKWebView 恢复及真机、14语原生/大字号/读屏和完整设备矩阵，仍待验收。
- 消费端素材 QA 保留23ready/28待核对；动作生产修订在 Pose-Hub 处理，发布后按锁定版本接入。数据闭环、内容人工审核和正式发布继续按原 T03–T06 管理。

迁移清理的 Flutter 前后对照均为165通过、相同12失败（3条flow、1条polish、8条既有iOS横屏布局失败）；本次没有新增设备验收或全套测试通过证据。本次只检查文档、链接和 GitHub 状态，未运行 App 测试、构建或安装新包。
