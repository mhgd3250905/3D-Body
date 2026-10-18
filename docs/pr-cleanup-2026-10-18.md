# 3D-Body PR 收口与 FlareLab QA 分账（2026-10-18）

本会话后续范围为 FlareLab。HipLab App 在独立仓库维护，动作修订与生产工具归属 Pose-Hub。本次处理旧 PR 的归属及记录，App、动作和媒体保持。

## 仓库 PR 收口：已清零

初次核对时仅剩草稿 #120；2026-10-18 19:49（北京时间）确认 Pose-Hub PR #7 已合入后，已按此前授权留言关闭 #120。随后重新查询 GitHub 开放 PR，结果为0。**“3D-Body 开放 PR 清零”已完成**；这是仓库管理收口，L52 设备 QA 继续按下节管理。

| PR | 本次处置 | 后续条件 |
| --- | --- | --- |
| [#118 HipLab 变体](https://github.com/mhgd3250905/3D-Body/pull/118) | 已按用户指定正文留言“已由独立仓库 HipLab 取代（main 5c7dc8e），关闭不合并”，关闭，`mergedAt=null` | 不审、不合；`feat/hiplab-flavor` 分支保留，远端仍为 `a83a0f4cde202f10ed9ddcaa5d3da519c6fc280e` |
| [#120 高清制作线](https://github.com/mhgd3250905/3D-Body/pull/120) | 已留言 Pose-Hub PR #7 链接并关闭，`mergedAt=null`，原草稿标识保持 | 源分支 `codex/hiplab-hd-20261017` 保留，远端仍为 `f8b5138fb377ec8cda464cfb08186fd696ca7921`；未合入 3D-Body |
| [#121 动作修订](https://github.com/mhgd3250905/3D-Body/pull/121) | 此前已关闭且未合并，指向 [Pose-Hub#1](https://github.com/mhgd3250905/3D-Pose-Hub/pull/1) | 保留历史记录 |

#118 的本次[关闭留言回执](https://github.com/mhgd3250905/3D-Body/pull/118#issuecomment-6248192131)与远端状态已核对。独立 HipLab 的用户指定基线为 `main 5c7dc8e`、`0.3.4+9`，已超出旧 #118 的功能范围；提交 [`5c7dc8e93dd577de0e2d46d2ab4da41e9a5a7148`](https://github.com/mhgd3250905/HipLab/commit/5c7dc8e93dd577de0e2d46d2ab4da41e9a5a7148)存在性已核对，本次未审计其功能或重新验证版本。

此前交接中的 `h-knee-hug-r2`、`h-supine-twist-r2`、`s-seated-fold-r3` 已在 Pose-Hub main。高清生产工具随后由 [Pose-Hub PR #7](https://github.com/mhgd3250905/3D-Pose-Hub/pull/7) 从 #120 的固定源提交 `f8b5138fb377ec8cda464cfb08186fd696ca7921` 迁入 `drill-anim/tools/hd/`。本次实际读取 PR 状态、文件清单与正文，核对 `state=MERGED`、合并提交 `cb38fd5e4125c4dd094670d979273a23918a0717`，且与当时远端 main 相同，满足关闭 #120 的前置条件。该迁移保留已有三项修订；生产验证由 Pose-Hub 负责，本会话未重跑或计入 FlareLab 验收。

#120 已留言“已迁入 Pose-Hub（PR #7，合入 main cb38fd5e4125c4dd094670d979273a23918a0717）”，附上 PR #7 链接。[留言回执](https://github.com/mhgd3250905/3D-Body/pull/120#issuecomment-6249562542)及关闭状态已回读确认：`state=CLOSED`、`isDraft=true`、`mergedAt=null`。远端源分支存在性已核对；开放 PR 查询为0。原入口文档2026-10-17“迁移等待用户决定”的阶段描述由本条后续事实更新，不再作为待办。

## FlareLab L52 设备 QA：独立保持待验收

保存身份仍为 **L52 / 1.0.9+11 / v42-R17**。用户本次初步测试通过，完整验收以 [实施路线](../app/docs/development-roadmap.md)、[L52记录](../app/docs/l52-plan-skip-2026-10-17.md)及[验证记录](../app/docs/verification.md)为准。

- 原生训练完整流程、51项视频首帧/播放、前后台和快速切换、七形象/详情与同帧返回，仍需完整设备证据。
- 长期计时、暂停/恢复、后台与锁屏、性能/帧率/内存/温度/续航，仍待验收。
- iOS 编译、签名、WKWebView 恢复及真机、14语原生/大字号/读屏和完整设备矩阵，仍待验收。
- 消费端素材 QA 保留23ready/28待核对；动作生产修订在 Pose-Hub 处理，发布后按锁定版本接入。数据闭环、内容人工审核和正式发布继续按原 T03–T06 管理。

迁移清理的 Flutter 前后对照均为165通过、相同12失败（3条flow、1条polish、8条既有iOS横屏布局失败）；本次没有新增设备验收或全套测试通过证据。本次只检查文档、链接和 GitHub 状态，未运行 App 测试、构建或安装新包。
