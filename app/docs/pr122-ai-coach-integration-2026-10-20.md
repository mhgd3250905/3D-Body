# PR122：AI 定制源码合入与版本保存（2026-10-20）

PR [#122](https://github.com/mhgd3250905/3D-Body/pull/122) 已完成三轮复审，并按用户“同意推进合并吧”的授权，于2026-10-20 15:43:09（北京时间）合入 `master`。本批次是源码保存；没有安装或发布 AI 版本。已认可安装版仍为 **L52 / 1.0.9+11 / v42-R17**，其有限用户认可和完整设备QA待验收边界保持。

## 版本与来源

| 身份 | 完整来源与边界 |
| --- | --- |
| 最终复审源 | `298f1fa7818a2960aa6e799a6cd625825dbcb49d` |
| PR目标 / base | `2be8cca34abebb204f3d30b79000eea02015b793` |
| GitHub 合并 | `d8e9a0a6047158687b8be72a6e5f486add95e7f5`；父提交恰为上述目标和审核源 |
| 主目录整合 | `e000a3fe86e64c4fb651049528d4baea3f9180e5`；合并前本地主线 `ca9c133766946ada6959b5d6b397efe8c7e417b7`，保留原有两个PR清理文档提交，无冲突 |
| SDK | ugk_coach **0.1.2**，固定 `26e32557058e582d3f1b2b7f722dfa53c2b16aa6`；intl **0.20.2**，pubspec与lock一致 |
| App配置版本 | `app/pubspec.yaml` 仍为 **1.0.9+11**；没有为源码合并虚设新L号或标签 |
| 已认可安装版 | [L52](l52-plan-skip-2026-10-17.md)，原产品源 `38f57e419df11e42e6d1c7ef7c71478650b588cf`；手机不因源码合并自动变成AI版本 |

本次文档保存由Git实际提交定位，不预填自身SHA。版本身份由[版本台账](version-ledger.md)管理，命令、结果和source state由[验证记录](verification.md#pr122-复审与合入证据绑定2026-10-20)管理，后续设备和缺陷由[实施路线](development-roadmap.md#pr122-ai-定制源码已合入设备-qa-待验收2026-10-20)管理。使用及配置见 [AI说明](ai-coach.md)。

## 已合入的行为与复审修复

中文计划页加入AI定制入口，最多追问一次，可保存到我的计划或进入现有跟练。未配置或网络不可用时使用明确标注的内置预设；取消不生成回落计划或记入对话。AI剂量使用可选的RoutineDose保存，旧计划兼容，编辑、跟练与估时使用保存的剂量。

| 审核项 | 最终结果 |
| --- | --- |
| F122-1：AI组数与训练记录契约 | AI计划将rounds折入sets，最多12组；记录接受对应上限。原4组计划不再被动作库3组上限拒收；保存异常退出saving并显示重试。12组可保存重载、13组拒绝的独立检查通过；实际IO重试旧问题另列下方 |
| F122-2：离线场景识别 | “没有器械/徒手”优先，最近本轮的“在家”可覆盖历史健身房；未说具体器械时沿用A/B居家档，计划页为C则降A |
| F122-3：回落保护部位 | 当前及历史中明确的不适/避让约束写入avoid并按目录cautions剔除动作；全部剔除时仅给说明。第三轮保留“手腕、肩都不舒服”“腰、膝都不舒服”的并列部位，且不把“练肩、手腕不舒服”误判为保护肩 |
| F122-4：远端目录换版 | 每轮开始重算profile范围与App动作/媒体的交集，重建使用同份目录快照的assistant，远端新增但App不可用的ID不能通过范围校验 |
| F122-5：编辑剂量与估时 | 编辑页使用已保存AI剂量及对应估时；改名、重排和重载保持，删除动作时移除其剂量 |
| F122-6：锁文件 | intl恢复0.20.2，强制lock解析通过；SDK固定0.1.2/26e3255 |

保护词识别仍为已描述的关键词规则，不扩大为通用自然语言或医学审核。R17动作、人物模型、51项视频/封面和个人数据本轮未改；动作生产仍在Pose-Hub进行。

## 验证与source state

2026-10-20本会话在E盘隔离副本执行；Flutter3.44.7 / Dart3.12.2。最终源 `298f1fa7818a2960aa6e799a6cd625825dbcb49d` 的AI测试为35/35，独立当前/历史并列部位及边界检查4/4，合计39/39；静态分析无问题，enforce-lockfile成功且锁文件未变。实际命令和范围已写入[验证台账](verification.md#pr122-复审与合入证据绑定2026-10-20)。

第二轮源 `91226d85a73bc8e35e0eea6b63e2af198ed4cc68` 曾执行全量196通过/12失败，与独立master基线165通过/12失败的失败文件及名称完全相同：flow3、iOS横屏8、polish1；第二轮Android debug构建成功，ZIP完整性和教练资产入包通过。第三轮修改了保护部位函数及测试，没有重复全量或APK构建。这些较早结果只属于第二轮源，不记成最终HEAD的全量/构建或设备证明。

第三轮源码到主目录整合仅多三份此前PR清理文档，App代码、配置、测试、资产和工具逐路径相同；本次closeout也仅改Markdown。因此复用最终源39项、静态分析和锁文件验证，不重复产品测试、构建、真机安装或模型API请求。历史SDK0.1.0/0.1.1真实冒烟、PR截图及旧包分别保留原身份，不作为SDK0.1.2或当前设备验收。

## 已知缺口与发布边界

真实storage.write首次失败后，内存已有session；计时页“重试”重建endedAt会因同ID不同内容而冲突，未发生第二次实际写入。该三组动作探针在PR和master均复现，是独立旧问题；本轮异常UI恢复和append前抛错测试通过不代表真实IO失败已经可恢复。后续另批修复，不在文档closeout中改运行代码。

新增AI入口的真实设备流程、训练返回/保存、取消、弱网/鉴权/额度/目录换版、用量持久化及实际令牌配置待验收；L52原有T01–T06、七形象/详情、51媒体、长期后台计时/性能、iOS和14语/无障碍QA继续保留。PR合并、源码保存、测试和APK生成均不等于设备或发布验收。未执行发布、上传、部署、商店操作或新标签。

## 文档收束Preflight

收束scope为PR122源码合入后的版本、配置说明、验证证据和待办对齐。用户在本会话显式调用cockpit-closeout并授权“保存提交push”。阶段一只读完成后才编辑，不以Cockpit可用性作为本地门槛。

基线为合并前主线 `ca9c133766946ada6959b5d6b397efe8c7e417b7`；预检HEAD为 `e000a3fe86e64c4fb651049528d4baea3f9180e5`。`git rev-parse --verify 'HEAD^1^{commit}'` 核对基线，`git merge-base --is-ancestor` 返回0。有限stage delta为11提交、27路径：14运行Dart、2随包目录JSON、2依赖配置、2测试、1同步工具、2Markdown、4已有PR截图。

| 实际检查来源 | current / archive判定与对齐职责 |
| --- | --- |
| 根AGENTS.md、app/AGENTS.md | current项目约定；新增仅源码保存身份，保留L52设备边界 |
| 根README.md、app/README.md | current使用入口；根README文档表指定三份台账，App入口指向AI配置说明 |
| app/docs/version-ledger.md | current版本/源码/安装/发布事实源；新增PR122分账；旧L52、L41身份表明确历史 |
| app/docs/verification.md | current验证及source state事实源；补本阶段命令、日期、结果与复用证明 |
| app/docs/development-roadmap.md | current实施/待验收事实源；新增AI设备QA与继承的IO重试待办，不销旧QA |
| app/docs/ai-coach.md | App入口明确指向的current技术说明，也是本阶段delta文件；SDK/分支/默认配置/命令/测试说明已过时，有限修正；冒烟表归archive/history |
| app/docs/motion-v42.md、app/docs/asset-sources.md | current动作合约/来源入口；早期批次段为history；本阶段无动作/模型/媒体变化，无finding |
| app/docs/l52-plan-skip-2026-10-17.md | 当前安装版的来源；产品源码及测试是此前阶段history，不能证明PR122已安装；本轮不改 |

发现从项目入口及其明确指向的一跳来源开始；没有扫描其他仓库、读取凭据、日志或构建产物。所有本地归属与canonical来源可确定，Preflight无缺失事实。

完整 `git status --porcelain=v1 --untracked-files=all` 为3项tracked unstaged、0 staged、0删除/重命名、27项untracked，输出完整。3项为根README、verification、version-ledger此前20行绿幕补充；27项为Air-Flare视频1、图标候选20、绿幕文档2、绿幕脚本4。它们与阶段前记录的路径及diff哈希一致，全部归为既有用户改动，只保留且排除本次提交；没有读取其文件内容来判断归属。对同一文档仅暂存本轮新增hunk，提交后原3份新增行内容及27项路径哈希必须保持；本轮插入文档段落导致的diff行号变化不算用户内容变化。

确定的alignment findings为：缺PR122版本/合并身份；AI说明仍是分支、SDK0.1.1及旧测试数；默认New API路线与Worker说明冲突；多行命令不可直接复制；验证记录缺source state；实施台账缺新AI及IO重试分账；旧身份标题易与当前混淆。本轮只修这些确定文档问题，不升级依赖、不修运行逻辑、不补记未执行验证。

必要收束验证为：修改行的本地链接/锚点、版本/SHA和source delta、复审事实、Markdown差异格式、明确暂存路径及原有改动排除、完整工作区和HEAD复核。只提交本轮9份Markdown，并按用户授权普通push到origin/master；本地提交与远端确认分开，以实际Git回执为准。平台只作一次非终态progress，不结束或接力会话。
