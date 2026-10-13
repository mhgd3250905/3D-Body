# Flare 版本管理台账

## 2026-10-13 L44 形象切换与媒体升级

本轮按用户追加要求补修PR #109并升级本地App。补修保存为 `63d22d755d6b82568be5b2589a9c3bef1cdc771e`，普通push到原来源分支；GitHub于北京时间22:45:58按该固定head合并为 `f338b46a066419d99516a076a712a9ebc7107e99`。主目录master从 `4e7aaed3e1996758e39ea6e12fc1a571d6f5ab18` 安全fast-forward至合并提交，未reset/clean或删除来源分支。领口来源、修订与完整证据见 [L44记录](pr109-l44-upgrade-2026-10-13.md)。下方素材收口、L43及初次PR109试用记录均保留历史阶段范围。

主目录 `app/build/web` 的443文件与已验证候选逐项SHA一致；两个通用APK输出均为下表L44哈希，旧Web/通用APK完整保留在 `output/playwright/pr109-upgrade-20261013/build-before/`。原21项用户未跟踪文件前后SHA全部一致，主目录产品源码与验证候选无差异；合并后HEAD/origin/master/GitHub实际ref一致。同步回读见 `output/playwright/pr109-upgrade-20261013/main-sync-check.json`。此后回执文档提交的自身SHA由Git实际历史定位，不在提交内预填。

| 身份 | 当前事实 |
| --- | --- |
| 本地交付 | L44 / 1.0.1+2 / v41，App内保存卡通教练或训练人台；旧数据默认卡通教练 |
| 训练人台 | 原PR保留，加载collarfix-20261013派生；仅领口COLOR_0与原制作源肩颈内收恢复，22骨/44轨保持 |
| App媒体选版 | 现有51项映射至training-human-v2-library-footfix-20261013；51 MP4＋51封面，23ready/28review，旧媒体另存 |
| APK | output/releases/Flare-L44-PR109-20261013-arm64.apk，75,827,258字节，SHA256 `8771c82364bd92ee664c4888db67d5ae7309d4f54013cbb5f74d9afc55f420ef` |
| 包与签名 | dev.mhgd.flare / versionName1.0.1 / code2，API24+、target36，沿用Android Debug证书；开发签名本地包 |
| Android安装 | 22:24:07保留数据安装，首次安装时间及数据目录inode保持；形象切换同帧8.5秒、冷启动所选人体与限定视频抽查通过 |
| Web与保留 | 离线Web已构建；原L43/初次PR109 APK、旧媒体、94冻结包、根dist编辑器、个人数据、P01/S4保持。未上传商店或部署网站 |

本轮未把28项素材提示、51项全原生视频、长期性能/计时、iOS或用户最终观感验收标为完成。APK code2之后，原code1包不能通过普通 `adb install -r` 直接降级；切回原形象使用App设置，不卸载数据。

## 2026-10-13 素材制作阶段收口

用户已明确认可瑞士球背伸鞋向修正版，并要求版本整理、保存提交及普通push；这条视觉认可限定于该修正版，不扩大为94项全部身体QA或App设备验收。阶段基线为`b842aa49d85b52332700a1210b9227c6ceaa5dcb`，收口前实现为`a636b705432414dc3bf329372167e8116370dcd0`，两者之间35路径A25/M10。当前checkout为主目录master，本轮文档收口另形成后续Git保存点，其SHA以提交历史和远端实读为准，不在同一提交里填写自身SHA。

| 身份 | 当前事实与权威来源 |
| --- | --- |
| 人体外观 | `training-human-v2`，已认可外观2.0.0；制作入口补丁2.0.1，13份固定源见模型清单，不增人体外观版本 |
| 原整批制作 | `1bd9a3748b436e7c602e5e3600fcbe66aded4a64`，保存回执`0105e75c7d879c54802e2f13dc644ba0b81a90ea`；94项/23,454帧/781.8秒，原生产、2项构图派生和首次便携包全部保留 |
| 鞋向修订 | `a636b705432414dc3bf329372167e8116370dcd0`，普通push后实读origin/master一致；修订规格结合原求解值/腕目标重放，不以spec单独冒称完整复现 |
| 当前素材选版 | `erectors-B-footfix-20261013`；`output/training-human-v2-library-footfix-20261013`，1930文件，1929条SHA/1776条相对链接回读通过；清单SHA`0c2555721a738ca7e3e120f18dd7c7bbf95ca2321873822f30c5f9e72a98fd43` |
| 内容状态 | 当前仍94项，每项1080母版/720手机版/540封面；56ready/38review，无失败或制作中。38是保存的数值/求解提示，不写成全QA通过；quadriceps-A新增接触边界提示保持原阈值 |
| App安装身份 | L43 / 1.0.0+1 / v41 / 原51视频；没有新APK/IPA、视频替换、远程发布或网站部署 |

本次处置与文档职责如下，未新增第二套版本系统：

| 路径 | 类别与处置 |
| --- | --- |
| README.md、AGENTS.md | 当前入口：记录鞋修已认可、当前选版与原包保留边界 |
| docs/training-human-v2.md | 当前契约：区分外观2.0.0与入口2.0.1；限定早期“未制作全片”的历史语境 |
| docs/training-media-library-2026-10-13.md、docs/erectors-B-footfix-2026-10-13.md | 制作/复现：区分原94冻结批次与后续鞋修选版，保留原始参数、特殊重放规则和限制 |
| tools/drill-anim/README.md | 工具入口：补当前鞋修规格及原目标表依赖，不修改冻结源、模板或成片 |
| app/docs/verification.md | 验证事实：记录本次包/模型/链接回读和必需检查；原解码、数值提示与手机尺寸实证保留 |
| app/docs/development-roadmap.md | 未完成项：本轮制作和鞋向验看完成；后续逐项选版、38提示核对及App/设备验收继续待安排 |
| app/docs/version-ledger.md | 版本边界：保存本表、阶段范围、Git实现与当前素材身份 |
| 各output原批次、便携包及package生成源 | 历史/生成内容：原样保留；不手改包内索引或SHA，不重写历史验收 |

本阶段目标是独立素材制作与当前选版保存；代码/媒体完整性符合此边界，身体QA的原有38项review继续作为未完成验收记录。后续接手先读README→本台账→verification/development-roadmap，再读人体标准与鞋修记录。原21项未跟踪的Air-Flare及图标候选不属于本阶段，保留且不暂存；个人正式动作/草稿、旧编辑器/原导出、历史模型和E盘制作现场不清理，3D-Wrist不触碰。媒体仍是本机E盘素材，Git只保存源码/固定规格/文档；本次不声称新增云盘或远端视频备份。没有新tag、App版本号或发布。

2026-10-13素材追加瑞士球背伸鞋向修正版，用户已明确认可；完整94项当前选用包为`output/training-human-v2-library-footfix-20261013`（1930文件，包清单SHA`0c2555721a738ca7e3e120f18dd7c7bbf95ca2321873822f30c5f9e72a98fd43`）。只选用该项新母版/手机版/封面，旧版与其它93项媒体及检查证据保留；人体标准、App L43/v41/51视频保持。制作/保真/鞋墙接触/完整解码与手机尺寸实播见[修正记录](../../docs/erectors-B-footfix-2026-10-13.md)。

更新于2026-10-13，当前本地交付为 **L43 上下半屏**，版本仍为 `1.0.0+1`，默认动作仍为v41。Play P01 AAB保留，不能按相同版本号判断内容相同。当前软件验证及限制见 [verification.md](verification.md)，实施/待验收见 [development-roadmap.md](development-roadmap.md)。路径相对于根项目 `E:\AII-3D\3D-Body`。

## 2026-10-13 原94项冻结素材与首次便携包（历史基线）

便携素材包已实际保存于 `output/training-human-v2-library-portable-20261013`：94母版＋94手机视频＋94封面及参数/证据，共1911文件。1910条SHA独立回读一致，1784条相对资源链接有效；包清单SHA256为 `64693fb473d7eeb461fa99199fa4547e22ca85d9f9831b8ce3988fb4f0135ddd`。手机版合计29,463,976字节，母版78,818,853字节。完整PNG与制作现场仍另存生产目录，未作为App资源或Git媒体上传。最终390×844浏览器实际播放与包回读证据见验证记录。

本轮制作代码、94项固定来源、人体入口补丁与文档共30路径保存为 `1bd9a3748b436e7c602e5e3600fcbe66aded4a64`，基线为 `b842aa49d85b52332700a1210b9227c6ceaa5dcb`。已普通push至origin/master，随后实际读取远端refs/heads/master与该提交一致；没有强推或新的App发布。视频和完整制作现场保存在上述E盘目录，不随此代码提交上传。此条是该保存点的后续回执，回执自身Git身份见提交历史。

用户明确要求本会话把所有既有演示另存重渲素材；94个冻结版本已全部成片，共23,454帧／781.8秒，组成60正式＋8办公室＋8久坐＋12托马斯（含左侧）＋5实际早期示范＋1正式Flare v41。第1项停止、Air-Flare用户原片及静态图标不纳入。母版1080²、手机版720²、封面540²，30fps H.264/yuv420p。制作流程83ready/11review_required；最终独立审计56ready/38review_required、failed/pending均0，成片完成不代表全部QA通过。具体来源、断点与验证范围见[统一素材库](../../docs/training-media-library-2026-10-13.md)。

人体清单当前制作入口补丁为2.0.1，修复旧sideplank-v7入口未启用profile；外观仍为已验收2.0.0。生产目录 `output/training-human-v2-library-final-20261013` 的 `audit-final/manifest.json` 和 `directory-manifest.json` 保存最终审计及当时完整目录快照，早期audit保留；94项独立整循环关节对照通过，骨矩阵逐帧最大差0来自producer记录。所选188个视频完整解码，审计另解码原2项构图的4个留存视频，共192个。托马斯2/10恒定构图派生位于 `output/training-human-v2-library-framing-20261013`，原动作/运镜/QA与成片保留，派生不另计动作。新增身体提示仅quadriceps-A的6/240帧4.02mm接触估计，超过4mm标准最多0.02mm，保持待核对。便携包与回读身份、代码保存回执见上文。本任务不是新App包，L43/v41/原51视频与个人数据保持。

## 2026-10-13 人体标准与托马斯版本整理

用户已观看第三轮预览并验收肩颈优化，指定 `training-human-v2` / `2.0.0` 为后续新训练动作、旧动作优化及安排重渲的统一人体标准。完整身份固定为原Snow派生GLB、灰色头、服装/骨架、肩颈权重与加载/求解管线的13份源SHA，见[人体标准](../../docs/training-human-v2.md)和[清单](../../tools/drill-anim/models/training-human-v2.json)。这不是新的App包编号，不创建L44，手机仍为L43 / 1.0.0+1 / v41 / 51视频。

本轮基线与原远端master为 `6fbf7a7050322ce2d138ed97a8745a06fac2b8cd`。主目录保持同一checkout，将隔离分支 `codex/thomas-reference-optimization` 的以下5个保存点快进吸收至 `4ef555624b95e1b39d6221efefa7d6bd7f692ba3`，28路径A23/M5，没有改写历史。近期14项PR合并收据与Git双亲/祖先再次一致，保留下一节原收据。

| 保存点 | 范围与身份 |
| --- | --- |
| `8b1fdc0` | 从PR106固定3d204原源接入12份spec；GitHub原PR仍OPEN/DRAFT |
| `c4d527d` | 按用户原素材修正髋/胸/支点及镜像，第一轮历史 |
| `0f2b8f2` | 按逐项反馈恢复已认可姿态，第一轮修复历史 |
| `e4201a6` | 第二轮直指/高亮/前方往返运镜/适度宽腿；肩颈被后续取代 |
| `4ef5556` | 第三轮肩颈修复与training-human-v2人体基准；10-13用户已验收 |

本节版本整理阶段原库75份＋独立托马斯12份＝87份spec；第1项停止，2–12加5左侧镜像为12个已验收预览。六项新profile预览700px/5fps共260帧，其他六变体复用原320帧；原视频/参数及全部历史输出保留。该整理阶段未制作高清全片；随后明确授权的94项重渲结果见上节。App正式选版/媒体替换仍另行安排，当前51项媒体未替换。

版本整理检查点为 `05fa9d22039abdfb35d5669917e749766bb27a3f`（`chore: close out accepted training human baseline`）。用户明确授权的普通 `git push origin master` 已成功，主线从6fbf7a7推进至该SHA；2026-10-13T00:18:41+08:00独立核对本地HEAD、origin/master及ls-remote的master完全相同，回执保存于 `output/stage-closeout-20261013/push-receipt.json`。其后仅补本台账实际回执，以 `docs: record training baseline push receipt` 定位，不改变人体/动作源；最终tip以Git master与远端一致性核对为准。证据/命令与跳过边界见[本次验证](verification.md#人体标准与托马斯版本整理验证2026-10-13)，下一步见[待安排台账](development-roadmap.md)。原21项用户未跟踪素材、旧GLB/导出/备份、网站现状与原包保留，不删除分支或发布新包。

## 2026-10-12 主线整合源码检查点

以下为截至6fbf7a7的历史收束事实；本节当时的“#106未纳主线/待确认”已由上节10-13的本地优化保存及用户验收取代，原GitHub PR状态与本地优化保存分别记录。

本轮将已审核制作源、两个网站和iOS工程整合到 `master`。以下是源码保存点，手机仍安装原L43；主线已含后续iOS恢复/布局补修，不把相同 `1.0.0+1` 写成手机已经更新，也不创建L44。Play P01和Apple S4 Build 3保留原包身份，未重新安装、上传或发布。

| 来源 / 范围 | 合入master的保存点 |
| --- | --- |
| feature/drill-anim 原制作工具 | `7666e82ac88ab74a37c7f40e5f72ad3d7bd46cbf`；Windows补修 `8a75ff30a9b2d6b8fcb684746555eab90aa4832a` |
| #94 官网 / #95 独立网页站 | `c522438e1507524047595cf2c5ef422fc12e9c50` / `e3385c69a7c44b53eb3f2748ad95da045f058499` |
| #96 办公椅 / #97–#104 八项办公室动作 | `80298ceccf58c958e557e1b45c44ddaf1ae2c6b6` / 最后一项 `6b704f34fd3bc51784ea52d4e1669f3742bfbe71` |
| ios/main 经 #107 整合 | `685f3ec41e16f6869124de35fbaa2b5c0eeddbec`；最终来源 `8196ce6d3179053827fad56b91469b3088fce242` |
| #105 八项久坐强化 | `b6b56efdb40938cef4bdff7d8d16291b8e40a495`；最终来源 `8fb8a6bff8d27b0f77c221d8f9f36af028e56b1f` |
| #108 五项最终修订归档 | `0f0698cd9498b02f0d9d160a3266de05b6b23dbe`；来源 `f0d53e9260c9b374cf86861c8309a115acb670df` |
| 整合收据 / sk新预览链接记录 | `7ffaa1e51d303963a5c858c815f0016c898d3f4c` / `51cd3d229acf5442e95b3bb491a36adeee3421fc` |

每个PR的固定来源、执行前目标及合并SHA见 [整合审核](../../docs/integration-pr-audit-2026-10-12.md)。PR #8 的 `ad72f1cc481080072526be918e48748dbec20794` 已被ios来源包含，GitHub在#107合并时将其标为MERGED；不再列为独立待合任务。上述完成项普通push，未删除design/backup等历史分支。

当前制作源75项（59原参数＋8办公室＋8久坐）；#108的五项是独立历史修订归档，不计入默认75项。App正式选版51项及v41保持，#106的12项仍Draft、未纳入主线。#108保留原QA和警告，不把归档核验写成当前引擎的新全量渲染。

媒体归档：原正式60项及历史素材已有[工具整合备份](https://drive.google.com/drive/folders/16ErhrmGbJMner-h0g9Tv7XNWJYoC1tXR)与[v1.0.0备份](https://drive.google.com/drive/folders/1nRi_L9WrysQzOt-zT9rZTlTO3Xx6uI4w)；鸟狗/游泳两项修复成片另在[新归档](https://drive.google.com/drive/folders/1fVkqMCuHn5AyurG1UrmOBbo-Vupf9L21)，ZIP回读SHA一致。mhgd来源机器的原8项成片仍待上传；[sk目录](https://drive.google.com/drive/folders/11HIEesP7B7sQ-67ED1OlQRdVhOJJLiuQ)已读到总览＋12GIF，只核对清单，未把预览当作成片验收。

本次文档收束基线为已记录的L43整合起点 `3a8955d14157a0ee8406cf640e00f40d68b4ae9f`，Preflight HEAD `51cd3d229acf5442e95b3bb491a36adeee3421fc`。收束提交以 `docs: close out master integration ledger and verification` 定位，不预填自身SHA；只对齐文档，不变更版本号、产品代码、资产、原包或#106姿态。验证及source state见 [本次收束验证](verification.md#主线整合文档收束2026-10-12)，剩余事项见 [实施路线](development-roadmap.md#主线整合后待安排事项2026-10-12)。

## 历史：2026-10-12 L38–L43 文档收束

当前功能/安装包仍为L43，本次只整理文档，不创建L44、不改包版本或产品代码。基线为用户要求先保存的L37 `8c8ea19d89c5a64a7b226e5239379cd974107c8c`；Preflight HEAD `6afb6fdea8fb35099d24364c6b252f3f052d93eb`（master），基线是祖先。阶段差异7提交/142路径记录（M40/A100/D1/R1），对应国际化/短名、渲染清晰度、知识展开和半屏详情；原L37视频/搜索/银色条目及个人资产保留。

| 阶段 | 已保存源码/记录 SHA | 成果 |
| --- | --- | --- |
| L38 | `2648cb8d260777805d1cf70cb56c411af5c8b654` | 14语离线国际化/字体/持久化 |
| L39 | `501d09977a67a47ce140be261cbcb27be9e9f94d` | 17肌群准确短名与窄屏显示 |
| L39安装记录 | `51b1e02028e32dd7264aaf65fa664228dae9594a` | 保留数据安装观察 |
| L40 | `e084268f6bf7dfc1d917cad8e410d5cb0ad7ce63` | 高密度3D与标签清晰度 |
| L41 | `5df32a3a2e3e15e975d134fc863d92897583cd15` | 无滚动条知识展开 |
| L42 | `0606a586dfa21f8204427a550432273ead36b702` | 同排版连续展开、阅读位置保持、去图标 |
| L43 | `6afb6fdea8fb35099d24364c6b252f3f052d93eb` | 两种详情模型上下1:1分区 |

本地文档收束检查点以 `docs: close out L38-L43 app delivery records` 定位。纠正App README的当前L41/运行L36、scene README的当前v38/裸肤study/旧密度，路线旧分区与安装下一步；入口合并重复版本说明，媒体说明明确历史范围，本地数据补语言偏好，字体清单明确本机留档。历史包/验证不改写成当前验收。

初检tracked/staged/unstaged为0；21项未跟踪内容归属已在阶段前记录：`Air-Flare/air-flare-demo.mp4` 1项、`app/assets/brand/` 12张PNG与8份imagegen元数据，不读取内容、不暂存。新改动全部为本Agent本轮文档修正，提交后保留这21项用户文件。完整Preflight、canonical映射、验证命令/source state与边界见[本次验证](verification.md#l38l43文档收束验证2026-10-12)。本轮分析/16定向测试通过，不重复构建/安装、不push/tag/发布，不结束Cockpit会话。

## 2026-10-12 L43：肌群详情上下半屏

顶部栏下可用内容改为上下1:1，覆盖动作与站立两种详情模型。Flutter上下Expanded与scene viewport遮挡均使用50%，共享画布不缩放重建；相机按上半区完整取景，默认模型显示高度缩小，下半区介绍空间增加。站立缩放/旋转、动作旋转禁缩放/平移、同帧交换/返回和L42连续知识展开保持。内容能放下时直接显示全文，无须展开。

源基线 `0606a586dfa21f8204427a550432273ead36b702`，本地检查点以 `feat(app): balance L43 muscle detail halves` 定位。具名包 `output/releases/Flare-v41-half-detail-L43-20261012-arm64.apk` 与通用APK一致，96,747,542字节，SHA-256 `b6b8ddd84b3a5efd54f63d8b66211228a84dfd0ac23a8b38c0621d514ee1703b`。包名dev.mhgd.flare/版本1.0.0+1/原Debug签名保持。Web/ARM64 release成功，[4资产核对](../../output/drill-media-20261012/L43-package-check.json)一致，L42/P01保留；未push/发布。

分析无问题，11项定向测试通过；新增320/390两尺寸两模型半屏、知识展开不改分区与同帧返回回归。14语两尺寸布局通过。[中文394实景](screenshots/2026-10-12-L43/README.md)与[记录](../../output/drill-media-20261012/L43-browser-ui-check.json)核对两模型inset372.5/舞台745，各半；站立缩放/拖动旋转有效，切回动作及返回首页暂停时刻保持，画布1182×2235/密度3不变；console错误/警告0。00:30:46保留数据安装，firstInstallTime保持；启动Status ok/UNKNOWN(0)/Wait3014ms，[安装回执](../../output/drill-media-20261012/L43-device-install.json)。用户自行手机验收，未操作手机UI。

## 历史：2026-10-12 L42：知识卡片连续展开

用户要求修正L41展开时字体与换行变化。预览与阅读层共享卡片构造、14px/1.55文字样式、10px/4px内边距、0.5px边框和12px圆角，文字宽度一致；原预览在阅读层显示时隐藏，避免字形叠加。仅卡片矩形/阴影渐变，340ms展开/240ms收起遵循减少动态；收起以实际末帧交还滚动位置，阅读位置双向保留。右侧两个图标移除，点文字/上方外部关闭和多語语义保留。3D舞台、协同卡和练习按钮固定。

源基线 `5df32a3a2e3e15e975d134fc863d92897583cd15`；本地检查点以 `feat(app): refine L42 continuous knowledge expansion` 定位。具名包 `output/releases/Flare-v41-continuous-knowledge-L42-20261012-arm64.apk` 与通用APK一致，96,747,542字节，SHA-256 `754090e2aefae0f14c1e4e925c0657c4069f0165a04a02c22246ad6dedd01d60`。包名dev.mhgd.flare/版本1.0.0+1/原Debug证书保持。Web/ARM64 release成功，[4资产核对](../../output/drill-media-20261012/L42-package-check.json)通过，L41/P01保持；未push/发布。

分析无问题、9项定向测试通过；实际字体14语两尺寸展开边界及固定按钮、320/390中间动画排版/阅读位置连续性及无图标通过。[中文394实景](screenshots/2026-10-12-L42/README.md)与[浏览器记录](../../output/drill-media-20261012/L42-browser-ui-check.json)确认文字宽度不变、外部关闭和footer/舞台/暂停时刻保持，console错误/警告0。00:17:33保留数据安装，firstInstallTime保持2026-10-08 17:53:04；启动Status ok/Wait3014ms/LaunchState UNKNOWN(0)。[安装回执](../../output/drill-media-20261012/L42-device-install.json)。按用户要求不操作手机UI，用户自行验收。

## 历史：2026-10-11 L41：知识卡片展开阅读

去掉肌群详细说明的常驻滚动条和桌面自动滚动条。实际溢出时点预览，从原卡片底边向上动画展开全文，展开340ms、收起240ms，遵循减少动态设置；文字、收起按钮或上方外部点击收起。展开全文14px/1.6行高，常规内容无需滚动，极长内容在卡内无条拖动。协同卡/练习按钮/iframe与暂停帧不改变，切肌群销毁旧阅读层。已有多语more/close用于语义与关闭，不引入新未翻译文案；L40三个视图清晰度保持。

源基线 `e084268f6bf7dfc1d917cad8e410d5cb0ad7ce63`，以 `feat(app): add L41 expandable muscle knowledge` 本地检查点定位。具名包 `output/releases/Flare-v41-expand-knowledge-L41-20261011-arm64.apk` 与通用APK一致，96,747,542字节，SHA-256 `3bff78ac35dd20cee52b80efa7525b30577ed0bb510dee90485f09d05b872bbf`。原Debug证书/包名dev.mhgd.flare/版本1.0.0+1保持；Web/ARM64 release成功，[4资产源/Web/APK核对](../../output/drill-media-20261011/L41-package-check.json)通过，L40/P01保留。未push/发布。

分析无问题、9项定向回归通过，其中14语言两尺寸真实字体下展开有界/固定按钮检查，320/390展开中间动画/超长全文/自然全文0滚动/关闭/外部关闭/换肌群、固定舞台和暂停帧通过。[最终实景](screenshots/2026-10-11-L41/README.md)及[浏览器记录](../../output/drill-media-20261011/L41-browser-ui-check.json)保留限定中文394实景，console错误/警告0。23:50:59保留数据安装，firstInstallTime保持，启动Status ok/Wait3016ms/LaunchState UNKNOWN；不声称冷启动速度。[安装回执](../../output/drill-media-20261011/L41-device-install.json)。用户自行验收，不操作手机UI。

## 历史：2026-10-11 L40：高密度屏幕清晰度

均衡渲染DPR上限由1.5提升为3，高清2提升为4，省电保持1；修正Flutter的battery/balanced名称映射为scene low/medium。标签4倍纹理保留，关闭多级缩小滤波造成的二次模糊；实际DPR仍不超过屏幕密度。三个3D视图共享同一画布：首页动作、详情动作与站立肌群模型。默认全身尺寸保持，站立缩放/拖动旋转保留，动作详情旋转/禁止缩放和平移保持。此轮没有修改人物、动画、机位/几何或训练媒体。

源基线 `51b1e02028e32dd7264aaf65fa664228dae9594a`，本地检查点以 `feat(app): sharpen L40 high-density rendering` 定位；未push/发布。具名包 `output/releases/Flare-v41-crisp-render-L40-20261011-arm64.apk` 与通用APK一致，96,747,542字节，SHA-256 `12b53b916f992b5905a1045bb6c80d785d27e519b1aae95271d7c7da3eb5f822`；包名/版本仍dev.mhgd.flare / 1.0.0+1，原Debug证书保持。离线Web与ARM64 release成功，[4资源源/Web/APK核对](../../output/drill-media-20261011/L40-package-check.json)通过，L39/P01原哈希保持。

Chrome DPR3.25、394×853同一暂停时刻/机位对照：画布591×1117→1182×2235；省电394×745、高清1280×2421，三个视图/缩放后均衡密度3保持。标签完整，站立默认全身、滚轮/双指放大/拖动旋转及切回原动作视角通过，console错误/警告0。密度单测、12缩略图机位/资源测试和scene v33/v38/v41契约通过。[实景](screenshots/2026-10-11-L40/README.md)与边界见验证记录。

23:22:18通过adb install -r保留数据安装手机，firstInstallTime保持2026-10-08 17:53:04；启动Status ok、COLD 428ms。[安装回执](../../output/drill-media-20261011/L40-device-install.json)。用户自行验收；未手机UI测试，不将浏览器手势与安装成功算作原生视觉/性能验收。像素数提升会增加GPU负担，真机FPS/温度/耗电仍待验收。

## 历史：2026-10-11 L39：多语言紧凑标签

在L38基线 `2648cb8d260777805d1cf70cb56c411af5c8b654` 上补齐14×17肌群短名。以常用准确称呼缩短窄标签，例如 Gluteus medius、Triceps、Traps & rhomboids；完整肌群名与组成仍在知识、搜索和无障碍保留。首页提示文字缩短并避让同步卡，阶段名最多两行，详情短屏为知识区保留至少40px。CTA使用短名完整显示，跳训练预填短名，完整名称仍可搜索。阿语两项术语及印尼语肩胛组合语义同时校正。规则见[compact-labels](compact-labels.md)。

本地检查点以 `feat(app): refine L39 compact localized labels` 定位，无push/标签/发布。具名开发包 `output/releases/Flare-v41-compact-labels-L39-20261011-arm64.apk` 与通用APK一致：96,747,542字节，SHA-256 `bdd84b36447102e3cc0a7c198bef41197bc3155f357c209df2bba58232c66511`。包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`；原Debug证书SHA-256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。Web/ARM64 release构建通过，[包核对](../../output/drill-media-20261011/L39-package-check.json)36项资源源/Web/APK一致，旧L38及Play P01哈希保持。

分析无问题，12项定向回归通过，其中真实打包字体下14语言×320/390两宽度×17短名及8阶段名布局通过；结构/字体覆盖检查通过。[实景截图](screenshots/2026-10-11-L39/README.md)与[浏览器报告](../../output/drill-media-20261011/L39-browser-ui-check.json)保留英文390详情/CTA/独立滚动和俄语/阿语320实景。构建时手机未连接；随后23:04:32保留数据覆盖安装L39成功，firstInstallTime仍为2026-10-08 17:53:04；启动Status ok、TotalTime 350ms。用户自行验收，不将安装/启动记为功能验收。[安装回执](../../output/drill-media-20261011/L39-device-install.json)。

## 历史：2026-10-11 L38：离线国际化

L38 国际化支持简体/繁体中文、英语、西班牙语、葡萄牙语、法语、德语、意大利语、俄语、日语、韩语、阿拉伯语、印地语及印尼语。默认跟随系统，未支持语言回退英语；设置→语言可手动切换并持久化。270项界面文案与591项内容映射离线打包，覆盖17肌群、8阶段、51训练及6阶段18课；ID、训练剂量和已有记录保持。阿拉伯语RTL与韩文/阿拉伯文/天城文字体已接入，3D标签和读屏文字同步；长分段按钮文字缩放适配。

L37 已先保存为本地 master 提交 `8c8ea19d89c5a64a7b226e5239379cd974107c8c`（`feat(app): save L37 action media and muscle detail checkpoint`）。L38 在该基线上实现，本阶段本地检查点以 `feat(app): add L38 offline internationalization` 提交定位；未推送或发布。用户的 Air-Flare 和20项图标候选文件未纳入检查点，原文件保留。

具名包 `output/releases/Flare-v41-international-L38-20261011-arm64.apk` 构建时与通用APK一致，96,737,945字节，SHA-256 `0f71c0d2f86a93ba6d3cdaad24fa6ddd56dec6a07563cbd7ebc3e60f87ec983e`。包名/版本为 `dev.mhgd.flare` / `1.0.0+1`，原Debug证书SHA-256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。离线Web与ARM64 release构建通过；[包核对](../../output/drill-media-20261011/L38-package-check.json)22项内容/字体/场景及未改媒体清单源/Web/APK字节一致，4字体均在两端FontManifest声明。旧L37及Play P01原哈希保持。

全项目分析无问题，33项定向回归通过，scene构建及v33/v38/v41验证136案例通过。[资源检查](../../output/drill-media-20261011/L38-resource-check.json)14语言270界面/591内容键、占位符、数字token及字体字符覆盖通过。[浏览器记录](../../output/drill-media-20261011/L38-browser-ui-check.json)和边界见验证记录。翻译由GPT-6 Luna max完成，未经过母语者或医疗人员审核。L38已保留数据覆盖安装真机，用户自行验收、未iOS构建、未生产签名/商店提交。

2026-10-11后续：手机2602BRT18C连接后，`adb install -r` 成功，firstInstallTime仍为2026-10-08 17:53:04；冷启动指令Status ok、TotalTime 566ms。用户明确改为自行验收，已停止真机交互；不将安装/启动记作14语、视频、详情或长期计时验收。记录见 [安装回执](../../output/drill-media-20261011/L38-device-install.json)。

## 历史：2026-10-11 L37：肌群知识与双侧人台

首页Flare斜体字标配青绿细线/点及中文小副标，header仍44。详情标题与一句阶段作用固定，中间独立圆角柔背景知识区滚动；沿用17组已审核文字分两段，作用更亮半粗、知识12.5常规，切肌群回到滚动顶部。协同卡/footer固定，长标题用36px FittedBox，320×700采用紧凑卡片/48px按钮修复54px溢出。详情直立人台全图/小图均展示当前肌群双侧，动作演员与首页同步图仍按阶段左右侧。

构建当时源为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加工作树；该阶段现已保存为本地提交 `8c8ea19`。具名包 `output/releases/Flare-v41-muscle-knowledge-L37-20261011-arm64.apk`与通用APK相同，89,838,331字节，SHA-256 `6331414c1f073ed98c42f92e34a5079ee6fc191d32de771ea37559063dc8de00`。Web/ARM64 release构建及原Debug签名通过，包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`，证书SHA-256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。[包核对](../../output/drill-media-20261011/L37-package-check.json)4项源/Web/APK一致，旧L36与Play P01哈希保持。

分析无问题，13项定向测试及scene构建/v33、v38、v41验证136案例通过。[真实GUI](../../output/drill-media-20261011/L37-browser-ui-check.json)390人台肱三头肌双臂粉色、演员单侧蓝色；390/552知识滚动20/17px时固定区域、736/801px舞台与暂停时刻保持，552深浅主题及320紧凑布局无溢出通过，console错误/警告0。CPU双侧检查不扩大为视觉验收，证据与边界见 [verification.md](verification.md)。L37构建时未安装/提交/push/发布；其后按用户要求保存本地提交8c8ea19，原生媒体/iOS/长期训练待验收；旧包、根目录dist与个人文件保留。

## 历史：2026-10-11 L36：界面精简与常驻搜索

包含L35常驻搜索、肌群名称预填与词/部位/场景联合检索。肌群详情去掉顶部阶段/暂停小字、拖动旋转提示及协助发力小标题，原header高度、舞台、底部卡片与按钮保持。首页标题为单行“Flare · 托马斯助手”，headingHeight仍44；同步phase-map卡宽180、视图高124（短高128/96），移除front/back视觉文字，保留两面含义的可访问标签。

源仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。具名包 `output/releases/Flare-v41-lean-ui-L36-20261011-arm64.apk`与通用APK相同，89,772,795字节，SHA-256 `baac6c30a04be5e06404a265018e5b009ea8035896036716e463bd12620aea22`。Web/ARM64 release构建、原Debug签名及aapt2 `dev.mhgd.flare` / `1.0.0+1`通过；证书SHA-256仍 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。旧L35/L34具名包保留。

全项目分析无问题，17项定向测试及scene构建/v33、v38、v41验证通过。[真实浏览器](../../output/drill-media-20261011/L36-browser-ui-check.json)390首页/详情精简、搜索预填/编辑/详情返回/场景切换及552清空/滚动常驻通过，console错误/警告均0。[包核对](../../output/drill-media-20261011/L36-package-check.json)场景入口/JS/CSS与未改媒体清单4项源/Web/APK一致，新具名/通用包相同，旧L35/L34哈希保持。验证边界见 [verification.md](verification.md)。L36未安装/提交/push/发布，原生媒体/iOS/长期训练待验收；Play P01、根目录dist与个人文件保留。

## 历史：2026-10-11 L35：常驻搜索与肌群名称预填

训练搜索框固定在标题下方常驻，去掉顶栏搜索/关闭开关与独立肌群标签。详情练习跳转预填肌群名称，按搜索词+部位+场景正常联合检索，不再保留隐藏groupId限制。编辑词或框内清除立即更新结果，切场景保留词，训练详情返回保留已编辑词，普通更多入口使用空词。有搜索词时不显示无关今日训练条目，store.todayIds保留；首页/模型与L34底部卡片/按钮布局保持。

源仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树，未提交、push或发布。具名包 `output/releases/Flare-v41-persistent-search-L35-20261011-arm64.apk`与通用APK已同步，89,772,795字节，SHA-256 `329e42b8898195e456a16ad5ceef1a0afff133047c277dc1810b652baa482c1e`。Web与ARM64 release构建、原Debug签名及aapt2 `dev.mhgd.flare` / `1.0.0+1`通过；证书SHA-256仍 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。旧L34具名包保留原哈希。

全项目分析无问题，flow10+library4+muscle3共17项定向测试通过。L35独立浏览器验收尚未完成即继续L36，当前搜索浏览器结论见L36记录。L35未安装真机；旧包、Play P01、根目录dist与个人文件保留。

## 历史：2026-10-11 L34：协助发力卡片下对齐

协助发力整区移出标题/一句作用的纵向滚动区，固定在练习按钮上方，与按钮间距22px；标题和作用在上，中间保留弹性空间。协同卡片仍完整横滑，练习按钮固定，支撑/主力/左右等上方小字保持去除。精准训练、同帧返回与原媒体保持。

源仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树，未提交、push或发布。具名包 `output/releases/Flare-v41-muscle-footer-L34-20261011-arm64.apk`与通用APK已同步，89,903,867字节，SHA-256 `792ce4ae63ec097c2adfcb7226ee28a6e51267a1764c276525afea96b0e8d721`。包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`；原Android Debug证书验证通过，SHA-256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。[L34包核对](../../output/drill-media-20261011/L34-package-check.json)通过，旧L33具名包保留原哈希。

分析无问题，3项针对卡区位置/横滑/返回的测试通过，历史30项保持自身范围、不相加。[实际浏览器](../../output/drill-media-20261011/L34-browser-ui-check.json)390/552宽卡片与footer间距均22px，横滑400px前后两者矩形一致；阶段12、暂停3.3秒及736/801px舞台保持，console错误0。L34未安装真机，原生媒体/iOS/长期训练待验收；旧包、Play P01、根目录dist与个人文件保留。媒体未改，L33资产证据只在原字节保持范围沿用。

## 历史：2026-10-11 L33：肌群详情与对应训练直达

肌群详情下半区去掉核心/主力/双侧小字及长知识/深层说明；肌群色条标题下保留当前阶段的一句作用，再展示完整协同肌群160px银色卡片横滑。练习按钮固定在独立滚动区域下方，直接进入该肌群精准训练列表，不再先弹场景选择。列表显示可清除肌群标签，场景/部位/搜索按AND筛选；切场景保留肌群，清标签保留部位，全部或冲突部位取消肌群。列表返回肌群保持选择、暂停时刻与模型。

源仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树，未提交、push或发布。具名包 `output/releases/Flare-v41-muscle-training-L33-20261011-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk`已同步，89,903,867字节，SHA-256 `21aa23ed9d52fab0a716f8d0364df834cc51ba898495b67a91184f393d03ad41`。包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`；Android Debug开发证书SHA-256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`验证通过。

全项目分析无问题，独立30项定向测试通过。[实际浏览器核对](../../output/drill-media-20261011/L33-browser-ui-check.json)与[最终包核对](../../output/drill-media-20261011/L33-delivery-check.json)全通过：390/552两尺寸精准筛选、卡片播放/暂停与同帧返回，协同卡横滑400px前后footer矩形相同，console错误0。aapt2确认 `dev.mhgd.flare`、versionCode 1/versionName 1.0.0，证书为原Debug。L33未安装真机，手机此前仅安装L29原型；iOS、51项原生媒体与长期训练仍待验收。旧L32/L31/L30、Play P01、根目录dist与个人文件保留，详细证据见 [verification.md](verification.md)。

## 历史：2026-10-11 L32：部位/场景联合筛选与子页居中标题

训练第一行直接提供全部部位/支撑/核心/腿部，第二行无器械/居家/健身房对应A/B/C，两维按AND筛选并叠加搜索，切换任一维保留另一维，今日训练独立保留。子页标题顶部居中，左右44px均衡留位；覆盖训练、路径、课程、测评、记录、设置与关于，系统许可页也居中。训练详情用固定顶部实际训练名，移除滚动大标题/磨砂叠条；肌群详情与计时页显示居中实际标题，阶段/暂停及组/侧/子动作信息保留，首页样式保持。

当前源仍为master `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树，未提交、push或发布。具名包 `output/releases/Flare-v41-body-scene-filters-L32-20261011-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk`一致，89,838,331字节，SHA-256 `7ddcc1ad44ac39cb16968931ef3c72279ac5e32281d98f8823bb389703ed5353`。包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`，Android Debug开发证书SHA-256仍 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。L32未安装真机，旧L31/L30及Play P01保留。

分析无问题，flow/timer/motion原20项与新增联合筛选/标题4项共24项通过；同子集的15项回归不重复相加。390×844浏览器已确认标题居中、两行筛选及核心+居家→无器械联合过滤。[子页浏览器核对](../../output/drill-media-20261011/L32-browser-ui-check.json)与[最终源/Web/APK核对](../../output/drill-media-20261011/L32-delivery-check.json)均通过；验证边界见 [verification.md](verification.md)。本轮未改场景/媒体资源，不重复场景验证；根目录dist与个人文件保留。

## 历史：2026-10-11 L31：训练卡片首帧与手机两列修复

手机短边<600或训练列表宽≤700时固定两列，手机横屏同样限制；桌面保留自适应。网格媒体取消Pressable缩放。点击后封面保留到实际首帧呈现，再用120ms淡出；减少动态时即时切换。素材封面对应48项1秒及 `deltoids-B`、`hip-abductors-B`、`rotator-cuff-B` 三项2秒，清单新增 `poster_time_seconds`，播放器先定位到该时刻、等seeked才ready，从封面相同姿态开始播放。视频/封面原字节保留。

当前源仍为master `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树，未创建L31提交/标签、未push或发布。具名包 `output/releases/Flare-v41-action-cards-L31-20261011-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk`相同，89,903,867字节，SHA-256 `1cae056b3ac59853ea4fa6916632d8e872d92a58797e3c681d9ba0d4362a0b62`。包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`，Android Debug开发证书SHA-256仍 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。

分析、定向25项测试、JS首帧/seek时序及51/51真实浏览器首帧检查通过；390×844、552×909与844×390横屏均两列，延迟加载期间封面保持、首帧后播放、单播放器互斥及暂停帧稳定通过，console error/warn均0，详见 [verification.md](verification.md)。[L31最终包核对](../../output/drill-media-20261011/L31-delivery-check.json)通过：102项原视频/封面保持，播放器3文件与清单在源/Web/APK一致，旧L30具名包保持。L31未安装真机，原生51项媒体与iOS仍待验收；旧L28、Play P01、根目录dist与个人数据保留。

## 历史：2026-10-11 L30：训练动作卡片

训练库、今日训练、课程与A/B/C选择中的图片统一换成51个视频的静态帧；点画面播放，再点暂停，全局只保留一个训练媒体。详情去掉视频时间轴与控制底栏，计时/计次页默认显示可收起示范，演示循环不自动计次。`deltoids-B`改名“半程土耳其起立（至高桥）”，原ID与剂量保留。来源、已知限制及接入见 [训练视频交付](drill-media-2026-10-11.md)、[媒体清单](../assets/data/drill-media-manifest.json) 和 [署名](../assets/licenses/Drill-media-ATTRIBUTION.md)。

当前源为master `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树，本轮未创建L30提交/标签、未push或发布。具名包 `output/releases/Flare-v41-action-cards-L30-20261011-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk` 相同，89,903,867字节，SHA-256 `e397f6b210bf700def573da63fabeceec1057d5ecc180f5d99256864111ca9ca`。包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`；Android Debug开发证书SHA-256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`，不是生产上传签名。

手机此前仅保留数据安装过L29旧控件原型，冷启动Status ok、849ms；未完成51项原生视频验收。手机现已被取走，L30未安装。浏览器51项媒体与互斥/详情/计次联动通过；定向36项测试、分析、场景验证及构建后烟雾证据见 [verification.md](verification.md)。[最终包核对](../../output/drill-media-20261011/final-delivery-check.json)全通过，51项视频/静态帧与源、APK、Web一致，旧L28及Play P01哈希保持；不扩大为真机验收。青绿图标、银色条目、根目录dist与个人数据保留。

## 历史：2026-10-11 L28：采用青绿色运动服 Flare 图标 B

用户选定新角度 B。当前源资源、通用/具名开发 APK 与离线 Flutter Web 已换用该图标，保留 L26 功能与银色肌群条目。34张品牌、Android、iOS和Web图标由同一选定原图导出；iOS仅同步资源，未进行Xcode构建。姿态来自用户的项目模型截图，imagegen调整图标人物、服装和光影；运行时人物、原服装、v41动画及加载剪影保持。

L28具名包 `output/releases/Flare-v41-teal-logo-20261011-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk` 相同，46,151,845字节，SHA-256 `c836a597ce7297dd09fb3c3e967595b6f26f31fbbde22b426651e5e37927624b`。使用既有 Android Debug 开发证书，包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`；于12:07:18（北京时间）以 `adb install -r --no-streaming` 保留数据覆盖安装成功，初次启动Status ok、进程18394，定向错误日志为空。初次核对时手机PIN锁屏；用户随后解锁，于12:19补验桌面与应用信息页：青绿图标已生效，人物和两鞋完整未裁切。经桌面图标冷启动，原3D首页和同步人台正常显示，进程18954、按PID错误日志为空；该核对不扩大为完整设备或性能验收。

51项资源/包核对通过，41项既有场景、银色肌群图、加载/首页图片在新旧APK间逐字节一致；Web 7项HTTP资产与构建文件相同，浏览器加载无pageerror。图标与署名在源/APK/Web一致；记录 `output/releases/L28-teal-logo-delivery.json`，来源与导出见 [asset-sources.md](asset-sources.md)。旧图标/平台资源及通用L26包均独立备份。

用户确认真机效果并要求版本管理后，L28代码保存为 `3f0fda327a5e5716b89ba297447612148b542199`，标签 `app-l28-20261011` 指向同一提交。基线为L26提交 `632fdb673d50908083e9fb43440886f2e2ac5684`；保存34张生产图标、选定B原图与完整提示词、导出工具、署名、当前入口及验证文档，以及[真机桌面图标裁图](screenshots/2026-10-11/L28-home-icon.png)。用户于12:19补验后回复“可以了”，该确认适用于本次图标效果。初次保存仅在本地，随后用户明确授权文档收束及push；本次远端结果独立记在下方Git推送记录，不混同为商店发布。APK、完整本机检查报告、未选候选及原图参考继续留在E盘，Air-Flare用户素材不纳入提交。

Play P01 AAB仍为77,816,786字节，SHA-256 `9483f16054440cc7f76826f46f06befb3d141a6a0f6f2cb9dcaedb741e1d2119`，未替换。根目录dist原编辑器及个人数据保留。

## 历史：2026-10-11 L06–L26真机界面迭代

用户最终明确选择手机截图中的L26银色版：17张钛银金属人台摄影用于主力、其他参与及详情协同肌群条目，已接受此项外观。手机保持已安装的L26，源缩略图/清单及通用APK均恢复并核对为同一银色版；离线Flutter Web已同步回L26。L23卡片空间/平滑表现保持。本阶段代码、资源与入口文档归入10-11本地版本检查点，历史具名包保留。黄色L27仅作试制并构建，未安装到手机，其素材报告保留，不作为当前选择。

阶段基线 `812d948b49616d8edce20fd7ec46d70129e0fa27`；按用户版本整理要求，在master保存本地检查点，完整SHA由Git日志及临时交接回执定位，尚未push。L06统一由Flutter显示加载/错误/重试，用户确认双层图标消失；L07增加遮挡，L08调整首页3项重点肌群及局部收紧明暗。用户随后反馈空白首帧和底部闪动，L09补修。后续启动剪影、小卡、高亮与卡片/图文迭代的实际检查见 [验证记录](verification.md)；旧包、黄色试作和Play P01保留。

## 历史：PR7审核修复与交付（已合并）

已验证产品保存点 `d1c38860bdb64cf342b7ba221886cd085f2e52ae`，整合真实目标 `96cd9b125c52aeaada7dab0872258e67d662030d` 并解决冲突；详情连续投影、拖动中断、稳定画布、返回/重载已补修并完成定向验证。最终审核源 `b991aa316745fed22348df286938deccf218aea0` 已普通push到dev/hark；用户明确授权后于18:00:53（北京时间）合并为 `e42df21dbf4be273939ad9377d6f883ea9e75c95`。两者完整tree同为 `649b9f77189ec4830519825a1d730f54a638e088`，相对d1c3886产品目录差异0。主目录master快进并同步已验证Web/APK，当前包L05；初次candidate具名包保留，P01保持。审核、验证与真机限制见 [PR7审核](pr7-audit-2026-10-09.md)。

## 历史：PR6审核修复与交付（已合并）

原来源 `2b87db57a9589ba0fe92d6a0710506a36295d49c`，真实目标 `f1d526aba2fbfc7bebe10131e07d530beb1327b6`；隔离修复产品保存为 `4bc81b830f45279fbaa6631a269a590112f6ae96`，tree `3d35127c3fcb2ff13c2c56af1ce376a82901d840`。最终审核源 `d5c11e46bfdfd1c3e7dc87e71ffa851be3f9c843`，用户授权后17:05:14合并为 `aa3c726a66594c23cf66a1b4a7938366ea73dede`；两者完整tree同为 `213951ce7a2879366fafc4fe998db1b38354c365`。产品目录相对4bc81b8差异为0。App仍1.0.0+1/动作v41；当时主目录包为L04，Play P01保持。新机位交互、训练场景、知识与加载见 [PR6审核](pr6-audit-2026-10-09.md)。

隔离候选APK保留在 `E:/AII-3D/3D-Body-worktrees/pr-6-audit/output/releases/Flare-v41-PR6-candidate-20261009-arm64.apk`，同一包已同步到主目录L04及通用APK路径；字节/哈希均核对相等。隔离Web预览8858、直接场景8857是审核入口，主目录稳定App入口8820。末尾交付文档保存不改变已验证产品内容；文档提交完整SHA由Git定位。

## 当前身份

| 维度 | 当前值 | 判定依据与边界 |
| --- | --- | --- |
| Git 分支 / 源基线 | `master`；L40基线 `e084268f6bf7dfc1d917cad8e410d5cb0ad7ce63`；L41以本地提交 `feat(app): add L41 expandable muscle knowledge` 定位 | 本轮未push；下方12:52的L26/L28推送属于历史回执 |
| 当前本地产品 | L41展开阅读，无新增标签 | 无可见滚动条/原位动画全文；L40高清视图、14语/媒体保持 |
| 历史PR7合并检查点 | `e42df21dbf4be273939ad9377d6f883ea9e75c95` | 与最终审核源b991aa3完整tree同为 `649b9f77189ec4830519825a1d730f54a638e088`；PR7阶段已验证产品源d1c3886之后仅文档/截图 |
| 上一轮主分支交付保存点 | `96cd9b125c52aeaada7dab0872258e67d662030d` | PR6交付文档保存并push；本轮PR7真实目标。当前交付状态文档单独保存，不在提交内预填自身SHA |
| App 包版本 / Android 包名 | `1.0.0+1` / `dev.mhgd.flare` | `app/pubspec.yaml` 与 Android 源配置；`0.1.0+1` 仅属 Play 接入前历史版本 |
| 动作内容版本 | `v41` | 固定来源 `53d72b412840a942fefc818836b68ad2a2d7e0d1`；本轮没有另改动作、脸或衣物。v41 不等于 App 第 41 个发布版本 |
| 当前本地试用包 | 上方 L41，开发签名 APK | L41已保留数据覆盖安装并启动，用户自行验收。L28图标与L26银色条目认可属于历史范围 |
| Play 已上传包 | 下表 P01，上传密钥签名 AAB | 构建源 `92e459f54b620c6d72d2a920521e3e3a72b785e9`；是先前送审包，不等于本地最新产品 |
| 验收状态 | 定向软件验证通过；T01–T06 按路线继续 | 不把 APK 生成、文档提交或 Cockpit 检查点记成真机、教练或商店验收 |

## 代码与文档检查点

以下为已核对的 Git 提交事实，时间为北京时间。历史检查点保留原内容，不覆盖当前交付。

| 时间 / 检查点 | 完整提交 | 内容与状态 |
| --- | --- | --- |
| 10-09 09:04，PR2 合并 | `8537146d9168fdc95a86da802d7dabeeba64fbb4` | 全页面精简、深浅主题、穿衣详情及暂停/过关/跨午夜修正；历史整合 |
| 10-09 09:31，v41 保存 | `e27f4cd8ff7b6848de50da2377e76cb00542dabb` | 默认动作同步网页/App；保留原编辑器、个人正式选择、K、路线及备份 |
| 10-09 09:47，PR4 合并 | `bb94d849099d6a2985aa72c00373ce17d81a9993` | 51 套浅色训练图；源 `3b25f13075dcf4aa0bec918cdbf2947c5a8bb8a3`；历史包 L02 |
| 10-09 09:50，PR4 证据保存 | `b20bd33c4635c8d8a9c59990e2587036afc197e8` | PR4 文档与实景保存；产品内容同 PR4 合并，不是当前最新包 |
| 10-09 12:25，Play 包版本 | `92e459f54b620c6d72d2a920521e3e3a72b785e9` | 包版本升为 `1.0.0+1`，签名配置；AAB P01 的构建源，tree `513713c6e11227928d38759b03b45a7c751b8b2b` |
| 10-09 12:25，送审台账 | `6e99c05ed04fb426d84d88acd1f881ecc7c07ab5` | Play 封闭测试送审的当时记录 |
| 10-09 13:08，本轮接力基线 | `f87881ca29588b983f8c96126cbed4e8a514009a` | 已有 Play 文档对齐；#5/#3 整合前的主分支起点 |
| 10-09 13:24，PR5 审核修复源 | `4e434c29add93b9cf0a992090ba4dfc270b7f1d1` | 动效/交互；修复快速交换详情机位、主题销毁异常及原主分支 Web 倒数停 3 秒 |
| 10-09 13:35，PR5 合并 | `3fcf859b44f8b1b45736f5faaa8fff3cb82512ec` | GitHub 已 MERGED；完整 tree 与上述修复源同为 `eb853c24c5ea58b754753afd591c2ee3b5616c47` |
| 10-09 13:36，PR3 最终审核源 | `53d788bf3bf8817907453234136e6f1bb90f04a7` | 在已合并 PR5 基线上整合网页界面；修复全屏肌群键盘穿透、焦点与交错关闭背景锁 |
| 10-09 13:36，PR3 合并 | `f44f5922f8aaba76bbc82adfd6c618b4a06ce706` | GitHub 已 MERGED；与审核源完整 tree 相同，历史产品检查点 |
| 10-09 13:40，交付记录 | `1b94e9614dc5d1c035ecb056554c7e11015b0b07` | 主目录已同步并 push；仅文档，产品内容同 PR3 合并 |
| 10-09，版本台账收束 | `f1d526aba2fbfc7bebe10131e07d530beb1327b6` | PR5/PR3文档对齐并push，不改变当时产品 |
| 10-09，PR6审核修复 | `4bc81b830f45279fbaa6631a269a590112f6ae96` | 5项补修；定向36项测试、场景/v41、离线Web及APK构建通过 |
| 10-09，PR6最终审核源 | `d5c11e46bfdfd1c3e7dc87e71ffa851be3f9c843` | 修复源后仅12项文档/截图；普通push到dev/hark |
| 10-09 17:05，PR6合并 | `aa3c726a66594c23cf66a1b4a7938366ea73dede` | MERGED，完整tree与最终审核源相同；主目录快进同步及L04交付 |
| 10-09，PR6交付文档 | `96cd9b125c52aeaada7dab0872258e67d662030d` | PR6主目录交付状态保存并push；本轮PR7真实目标 |
| 10-09，PR7审核修复 | `d1c38860bdb64cf342b7ba221886cd085f2e52ae` | 固定舞台补修5项问题，分析/44项定向测试、场景/镜头/构图、离线Web/开发APK及实际浏览器通过 |
| 10-09，PR7最终审核源 | `b991aa316745fed22348df286938deccf218aea0` | 已验证产品后仅文档/截图；普通push到dev/hark |
| 10-09 18:00:53，PR7合并 | `e42df21dbf4be273939ad9377d6f883ea9e75c95` | MERGED，完整tree与最终审核源相同；主目录快进及L05/Web同步 |
| 10-11，L26界面保存点 | `632fdb673d50908083e9fb43440886f2e2ac5684` | 87路径；启动/肌群/卡片/银色图文迭代，定向软件与资产核对，详见验证记录 |
| 10-11，L28青绿图标保存点 | `3f0fda327a5e5716b89ba297447612148b542199` | 49路径；图标原图、34项导出、工具/来源/台账及真机裁图，标签app-l28-20261011 |
| 10-11 12:52，L28文档收束 | `f89db3fa3fa227071b0dfccafa2d6778a65a4413` | 3份文档修正；170个本地链接/既有验证正文及有限产品delta检查通过；普通push到master并远端核对成功 |
| 10-11，L37版本保存 | `8c8ea19d89c5a64a7b226e5239379cd974107c8c` | 用户要求先保存已有工作；L29–L37动作媒体/肌群界面与文档，本地master，未push |
| 10-11，L38国际化保存 | `2648cb8d260777805d1cf70cb56c411af5c8b654` | 14语言、字体、目录/3D文案、偏好及33项定向回归；本地保存，未push/发布 |

| 10-11，L39紧凑标签保存 | 以本地Git主题 `feat(app): refine L39 compact localized labels` 定位 | 14×17短名、窄屏布局、12定向回归/实景与包证据；未push/发布 |

| 10-11，L40高清渲染保存 | 以本地Git主题 `feat(app): sharpen L40 high-density rendering` 定位 | 画布密度与标签、三个视图/站立缩放手势；本地保存/安装，用户验收，未push |

| 10-11，L41展开阅读保存 | 本地Git主题 `feat(app): add L41 expandable muscle knowledge` | 无条全文动画、9定向测试/限定GUI及安装；未push/发布 |

[PR5 审核与回归](pr5-audit-2026-10-09.md)、[PR3 审核与回归](pr3-audit-2026-10-09.md) 保留源/目标、修复、实际操作及合并树证据。两项 PR 的 AI 审核、GitHub 实际合并与作者自报测试分别记录，不合并成“全仓全量通过”。10-09历史台账收束没有创建标签或空提交；10-11既有L28标签单独指向已保存的图标版本，本次closeout不另建标签。

## 安装包与本地预览

当前为L41；通用/具名包身份见上方L41记录，已保留数据安装并启动，用户自行验收。离线Web稳定预览为 `http://127.0.0.1:8820/`。下面L37及更早包的构建、进程与验收均为保留历史证据，不覆盖L38安装或原生播放验收。

L26具名包与通用APK一致；场景使用 `index-DBRgBX7q.js` / `index-1IjNUedj.css`，APK内JS与源构建SHA-256均为`80a439211f0f4d12582dab1d8b8fd40b15d5f065aebde77b70cbf0b09822f3f8`。17张银色肌群图片逐项核对包内哈希与摄影报告相同，共592,628字节，并按用户最终选择从同一APK恢复到源资产；L24图文/点击证据保留。手机进程17949及启动日志抽样无异常；没有安装黄色试作。交付/运行/选择记录为 `output/releases/L26-metal-muscle-image-items-delivery.json`、`L26-runtime-check.json`、`L26-silver-selection.json`。原L05–L25具名包与试作报告保留，Play包保持。

历史L07增加 Flutter 加载遮挡并取消交叉淡出，沿用 L06 的开发证书覆盖安装；当时具名包与通用 APK 一致，Web产物仍为L06，以下L06/L05核对不代表L07界面验收。

L06 从当前主目录构建，使用与手机原安装相同的开发证书重新签名后覆盖安装；证书 SHA-256 为 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。具名包与通用 APK 字节/哈希一致；APK 内场景 HTML 与本次场景/Web 构建一致。当前离线 Web 也包含加载修复，下面 L05 的同步核对属于 10-09 交付事实。

L05沿用本机PR7审核已绑定source state的构建与签名证据，交付时重新核对主目录具名PR7/candidate/通用APK的字节/哈希相同，并核对282份Web文件的集合及逐文件SHA-256一致；P01核对原哈希保持相同。交付同步没有重建、上传或部署。证据保存在本机 `output/releases/PR7-delivery-check.json`。`build/`、`dist/`、`output/` 被 Git 忽略，仅 E 盘本机保存；远端代码不包含这些包，换机器需按来源构建。

| ID / 状态 | 来源、用途与根项目路径 | 字节 / SHA-256 |
| --- | --- | --- |
| L41 当前展开阅读 APK | L40基线e084268加本轮源码；`output/releases/Flare-v41-expand-knowledge-L41-20261011-arm64.apk`，通用APK相同；原Debug开发签名1.0.0+1，23:50:59保留数据安装，待用户验收 | 96,747,542；`3bff78ac35dd20cee52b80efa7525b30577ed0bb510dee90485f09d05b872bbf` |
| L40 历史高清渲染 APK | L39基线51b1e02加本轮源码；`output/releases/Flare-v41-crisp-render-L40-20261011-arm64.apk`，与通用APK相同，原Debug开发签名、1.0.0+1；23:22:18保留数据安装，待用户验收 | 96,747,542；`12b53b916f992b5905a1045bb6c80d785d27e519b1aae95271d7c7da3eb5f822` |
| L39 历史紧凑标签 APK | L38基线2648cb8加本轮源码；`output/releases/Flare-v41-compact-labels-L39-20261011-arm64.apk`，与通用APK相同；原Debug开发签名、1.0.0+1、arm64；23:04:32保留数据安装，启动350ms，待用户验收 | 96,747,542；`bdd84b36447102e3cc0a7c198bef41197bc3155f357c209df2bba58232c66511` |
| L38 历史国际化 APK | 本地2648cb8；`output/releases/Flare-v41-international-L38-20261011-arm64.apk`；已保留数据安装、用户自行验收 | 96,737,945；`0f71c0d2f86a93ba6d3cdaad24fa6ddd56dec6a07563cbd7ebc3e60f87ec983e` |
| L37 历史肌群知识 APK | HEAD 96e1db0加未提交工作树；`output/releases/Flare-v41-muscle-knowledge-L37-20261011-arm64.apk`，通用APK相同。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,838,331；`6331414c1f073ed98c42f92e34a5079ee6fc191d32de771ea37559063dc8de00` |
| L36 历史界面精简 APK | HEAD 96e1db0加当时工作树；`output/releases/Flare-v41-lean-ui-L36-20261011-arm64.apk`保留，通用路径现为L37。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,772,795；`baac6c30a04be5e06404a265018e5b009ea8035896036716e463bd12620aea22` |
| L35 历史常驻搜索 APK | HEAD 96e1db0加当时工作树；`output/releases/Flare-v41-persistent-search-L35-20261011-arm64.apk`保留，通用路径现为L37。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,772,795；`329e42b8898195e456a16ad5ceef1a0afff133047c277dc1810b652baa482c1e` |
| L34 历史协助发力下对齐 APK | HEAD 96e1db0加当时工作树；`output/releases/Flare-v41-muscle-footer-L34-20261011-arm64.apk`保留，通用路径现为L37。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,903,867；`792ce4ae63ec097c2adfcb7226ee28a6e51267a1764c276525afea96b0e8d721` |
| L33 历史肌群详情/训练直达 APK | HEAD 96e1db0加当时工作树；`output/releases/Flare-v41-muscle-training-L33-20261011-arm64.apk`保留，通用路径现为L34。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,903,867；`21aa23ed9d52fab0a716f8d0364df834cc51ba898495b67a91184f393d03ad41` |
| L32 历史部位/场景筛选与标题 APK | HEAD 96e1db0加当时工作树；`output/releases/Flare-v41-body-scene-filters-L32-20261011-arm64.apk`保留，通用路径现为L33。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,838,331；`7ddcc1ad44ac39cb16968931ef3c72279ac5e32281d98f8823bb389703ed5353` |
| L31 历史训练卡片首帧/两列 APK | HEAD 96e1db0加当时工作树；`output/releases/Flare-v41-action-cards-L31-20261011-arm64.apk`保留，通用路径现为L32。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,903,867；`1cae056b3ac59853ea4fa6916632d8e872d92a58797e3c681d9ba0d4362a0b62` |
| L30 历史训练动作卡片 APK | HEAD 96e1db0加当时工作树；`output/releases/Flare-v41-action-cards-L30-20261011-arm64.apk`保留，通用路径现为L31。Android Debug开发签名、1.0.0+1、arm64；未安装手机 | 89,903,867；`e397f6b210bf700def573da63fabeceec1057d5ecc180f5d99256864111ca9ca` |
| L28 历史青绿色Flare图标 APK | L26功能/银色条目加用户选定B图标；`output/releases/Flare-v41-teal-logo-20261011-arm64.apk`，当时与通用APK相同，通用路径现为L30。Android Debug开发签名、1.0.0+1、arm64；12:07:18保留数据安装，12:19桌面/应用信息图标与桌面启动实景核对通过 | 46,151,845；`c836a597ce7297dd09fb3c3e967595b6f26f31fbbde22b426651e5e37927624b` |
| L26 历史银色肌群图文 APK | 钛银金属/细拉丝与原色肌群，17图片；当时已保留数据安装并冷启动，用户接受银色条目外观；`output/releases/Flare-v41-metal-muscle-image-items-20261011-arm64.apk`。Android Debug开发签名、1.0.0+1、arm64；通用路径已由L28更新，银色条目在L28保持 | 45,615,269；`b1c83d7ccadcabbbaa60bf7fa1b145176ce72abdc161f83b31e40dae54a0ca98` |
| L25 历史米白肌群图文 APK | 截图专用米白哑光/柔光，17图片；用户反馈质感不足，最终采用L26；`output/releases/Flare-v41-ivory-muscle-image-items-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径由L26更新 | 45,443,237；`0e5e9ce330143f62904bc3cadf4d1e8d2c897f3f8bf5840c5116882c3a255e3c` |
| L24 历史肌群图文条目 APK | 17张灰色人台渲染图用于主力/次要/详情协同肌群条目；图文入口保留，摄影材质由L25调整；`output/releases/Flare-v41-muscle-image-items-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径由L25更新 | 45,426,853；`c3f67e3236284bfa3baed458a0d6024f84342b3c5fdca2b548603264331f7a1b` |
| L23 历史可见平滑卡片 APK | L22基础上保护完整卡片不穿地面、不出宿主可见舞台；场景修复保留在L24；`output/releases/Flare-v41-visible-smooth-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径由L24更新 | 45,011,424；`52cbb97123ebaec10096e6bc08248c4f2f6c2ca7a18f2eeec067206164e30750` |
| L22 历史平滑卡片 APK | 取消淡入闪切，连续世界位置插值；圆点和细线、同侧卡片、双侧选择及身体避让保留；由L23补充边界保护；`output/releases/Flare-v41-smooth-adaptive-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；当前通用路径为L28 | 45,011,424；`4d7c0ef74d5b484b2f7aef21d87289c4283ba75537d47d3d3fc708cc7b010b9a` |
| L21 历史同侧卡片 APK | 旋转挑选方便展示侧，同侧卡片和身体避让初版；由L22改为连续位置动画；`output/releases/Flare-v41-adaptive-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；当前通用路径为L28 | 45,011,424；`4e517f888d68b1e8b011e1fa5a6d2228f3f2686b2c9e9de6f1da83dbddef993b` |
| L20 历史远距细线 APK | 圆点关闭身体深度遮挡，卡片移远并加入同色细引导线；后续L21–L23进一步修复；`output/releases/Flare-v41-guided-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；当前通用路径为L28 | 45,011,424；`ef3f3cf5b0cc5fe9e4b24d284fd7aa3e82f1a5217cb91b76747d111af16b81d3` |
| L19 历史3D卡片 APK | 固定表面附近的3D卡片、自然深度；`output/releases/Flare-v41-world-muscle-cards-20261011-arm64.apk`保留，通用路径由L23更新。Android Debug开发签名、1.0.0+1、arm64；固定偏移规则由用户后续要求覆盖 | 45,003,232；`1b24ebef1af7925f5b847fdadb8ac956bc412acf6e178c7945612314fd087523` |
| L18 历史优先肌群 APK | 最多3项与人体图统一；`output/releases/Flare-v41-priority-muscle-markers-20261011-arm64.apk`保留，通用路径由L19更新。Android Debug开发签名、1.0.0+1、arm64；屏幕布局由L19真实3D卡片替代 | 45,007,328；`c71fdbf581b8b998a9ed4e2e8a979a93860924d6eb050a84a20be8f2530b0f42` |
| L17 历史主力圆点 APK | 812d948基线加此前修复，暂停展示全部主力肌群圆点及附近同色名称卡；`output/releases/Flare-v41-primary-muscle-markers-20261011-arm64.apk`保留，通用路径由L18更新。Android Debug开发签名、`1.0.0+1`、arm64；数量由L18精简 | 45,007,328；`8aef66f503e597b3499cf9397353265e6239b9cecfb33a43c1f2cdff42ebf293` |
| L16 历史近身气泡 APK | 812d948基线加L06–L15，短尖角气泡、局部身体避让与轻微景深；`output/releases/Flare-v41-close-bubble-cards-20261011-arm64.apk`保留，通用路径由L17更新。Android Debug开发签名、`1.0.0+1`、arm64；气泡及距离视觉效果由L17替代 | 45,007,328；`e3605e44fd31c95403e8b72f2fa2d922eed5a66b3d05d32d2c74741edf12b2ec` |
| L15 历史距离明暗 APK | 812d948基线加L06–L14，卡片按距离连续变色和缩放；`output/releases/Flare-v41-distance-tone-cards-20261011-arm64.apk`保留，通用路径由L16更新。Android Debug开发签名、`1.0.0+1`、arm64；距离明暗保留在L16，连线按用户要求替换为短尾气泡 | 45,007,328；`fc5d7a19e4d80a8f4f66508ee89a330a1129c8ee8140e63c4e9009693e607807` |
| L14 历史深度标签 APK | 812d948基线加L06–L13及单行肌群卡片/真实表面远近与遮挡提示；`output/releases/Flare-v41-depth-muscle-labels-20261011-arm64.apk`保留，通用路径由L15更新。Android Debug开发签名、`1.0.0+1`、arm64；表面定位保留在L15，视觉反馈按用户要求调整 | 45,007,328；`2277839faf3a741d28aae4c553f3931d20927b85ab5b70adeace6897551285a5` |
| L13 历史空间标签 APK | 812d948基线加L06–L12及暂停肌群标签/空间避让；`output/releases/Flare-v41-camera-facing-labels-20261011-arm64.apk`保留，通用路径由L14更新。Android Debug开发签名、`1.0.0+1`、arm64；空间避让保留在L14，卡片按用户反馈精简 | 45,003,232；`cbd5a043c85c94c804a637fcd8e75f3fdc2a4a91be0f1740c227d056a0fc58bd` |
| L12 历史平滑高亮 APK | 812d948基线加L06–L11及动作人物逐像素肌群柔边；`output/releases/Flare-v41-smooth-muscle-highlight-20261011-arm64.apk`保留，通用路径由L13更新。Android Debug开发签名、`1.0.0+1`、arm64；修复包含在L13中 | 44,999,136；`e4a5f33d877999f2d8645a1bebea696a3e80fbfa7f1ff5d695e5c0bde8ccbc3f` |
| L11 历史剪影启动 APK | 812d948基线加L06–L10及启动预加载/真实动作剪影；`output/releases/Flare-v41-silhouette-startup-20261011-arm64.apk`保留，通用路径由L12更新。Android Debug开发签名、`1.0.0+1`、arm64；修复包含在L12中 | 44,995,040；`86c735bb321ce179a6849327a79f2a9e2253881610d7c1e509c58494276abe38` |
| L10 历史高清全身小卡 APK | 812d948基线加L06–L09及详情小卡高清/全身构图修复；`output/releases/Flare-v41-sharp-fullbody-mini-20261011-arm64.apk`保留，通用路径由L11更新。Android Debug开发签名、`1.0.0+1`、arm64；修复包含在L11中 | 44,167,444；`e7b148ca3dc0f7994f8d0be71b68cae9e5c84f829c1ac61a54e6f30aa01ca0d3` |
| L09 历史首帧过渡 APK | 812d948基线加L06–L08及真实首帧/渐变揭幕修复；`output/releases/Flare-v41-smooth-reveal-20261011-arm64.apk` 保留，通用路径由L10更新。Android Debug开发签名、`1.0.0+1`、arm64；修复包含在L10中 | 44,167,444；`0888d70014170801dfbe21c4d608f638f72a8a511b6faa6987518b19df3ed442` |
| L08 历史肌群表现 APK | 812d948基线加加载修复及首页肌群表现；`output/releases/Flare-v41-muscle-emphasis-20261011-arm64.apk` 保留，通用路径由L09更新。Android Debug开发签名、`1.0.0+1`、arm64；肌群表现包含在L09中 | 44,167,444；`35a85bca6f3a1c0585df5afc57df74a11caeafc24212f11defb2d8c592c1e4b4` |
| L07 历史加载切换 APK | 812d948基线加双层加载/遮挡修复；`output/releases/Flare-v41-loading-transition-20261011-arm64.apk` 保留，通用路径由L08更新。Android Debug开发签名、`1.0.0+1`、arm64；加载切换修改包含在L08中 | 44,163,348；`ae032c55fabd874ac969626a059c9441933d853c94d009bc93e61a76bc23452a` |
| L06 历史加载修复 APK | 812d948 基线加双层加载修复；`output/releases/Flare-v41-loading-fix-20261011-arm64.apk` 保留，通用路径已由L07更新。Android Debug开发签名、`1.0.0+1`、arm64；用户已确认双图标消失，另反馈过渡需补修 | 44,163,348；`850b12f249fcc4dfce635fc8942354aca83ea409a87fc53cfaf5daf2ae2c9cfa` |
| L05 历史 PR7 APK | 已验证产品源d1c3886，后续文档/合并不改变产品；`output/releases/Flare-v41-PR7-20261009-arm64.apk`、`output/releases/Flare-v41-PR7-candidate-20261009-arm64.apk` 保留。通用路径已由L06更新。Android Debug开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,115,257；`b87e654235683ea639e55031471217b7057e687a4ba79a5c34c85346ec1d51f6` |
| L04 历史 PR6 APK | 已验证产品源4bc81b8；`output/releases/Flare-v41-PR6-20261009-arm64.apk` 保留，原通用APK另备份在 `output/releases/before-pr7-20261009/app-release.apk`。开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,114,581；`cb14cc10fc40f288fd692b7202e496dd644141390a32ef22577319593925ad7b` |
| L01 历史 PR5+PR3 APK | 已验证 tree `107d301bf6fa5edc83d27c06f1d10ffeed83ebb5`；`output/releases/Flare-v41-PR5-PR3-20261009-arm64.apk` 保留。通用路径已依次被L04/L05更新；另备份在 `output/releases/before-pr6-20261009/app-release.apk`。开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,046,265；`00bddde38ab954068f85428e398a0de83f5e336f82cc09403e9f3a863468da86` |
| L02 历史 v41+PR4 APK | 已验证 tree `cbf81746bca8eb4146c0f99b7b3744db02cb89cf`；具名副本 `output/releases/Flare-v41-light-20261009-arm64.apk`。开发签名、当时 `0.1.0+1`；原通用路径后来被 L01 更新，不能再用通用路径定位旧包 | 44,045,329；`4040188f0c6dfad56e77afb7b99e6878bfefc51e0103e875ef66df5efeb7bfe5` |
| L03 历史 v41、PR4 前 APK | e27 保存点；`output/releases/Flare-v41-before-pr4-20261009-arm64.apk`。开发签名、当时 `0.1.0+1` | 42,836,141；`5c579985b1ed6b7db3ba988400bd2a3d88065e102f2cf83f12d883b6f430a9c7` |
| P01 已上传 Play 封闭测试 AAB | 构建源 `92e459f54b620c6d72d2a920521e3e3a72b785e9` 加本机 gitignored 签名材料；`app/build/app/outputs/bundle/release/app-release.aab`。上传密钥签名、`1.0.0+1`；本轮未替换或重传 | 77,816,786；`9483f16054440cc7f76826f46f06befb3d141a6a0f6f2cb9dcaedb741e1d2119` |

当前网页静态交付在 `dist/`，保留PR3结果，网页主入口 `main-CIbWtwFq.js`；Flutter Web在 `app/build/web/`，当前为L41展开阅读（保留L40高清渲染、多语言与双侧人台），保留L36精简/L35搜索及L34卡片/footer布局、L32联合筛选/标题、L31训练首帧/手机两列、L28青绿图标与L26银色条目，场景入口为 `index-C6GykFmW.js` / `index-D1CmUuBK.css`。稳定本地入口为App `http://127.0.0.1:8820/`、网页 `http://127.0.0.1:8810/`，服务须运行；App预览服务已补视频MIME与Range响应。8855/8856是先前审核预览，8857/8858为PR6隔离审核入口，8860为PR7隔离预览。PR7更新前Web/APK备份在 `output/releases/before-pr7-20261009/`，PR6更新前备份在 `output/releases/before-pr6-20261009/`，更早dist/Web/APK备份在 `output/releases/before-pr5-pr3-20261009/`；没有清理旧资产、个人数据或Air-Flare。

## Play 发布观察

以下沿用 2026-10-09 送审时的 [外部观察记录](verification.md)，本次文档收束没有访问 Play Console，不推断审核已通过、测试已开始或生产权限已开放。

| 项目 | 最后已记录事实 | 下一项证据 |
| --- | --- | --- |
| 应用与轨道 | `dev.mhgd.flare`「Flare托马斯全旋-3D动作分解」；Alpha 封闭测试上传 P01，178 国家/地区，测试者列表 Flare Closed Testers | 审核结果及测试分发状态 |
| 签名 | 当时上传密钥签名已验证；Play App Signing 随首个 AAB 注册。本机签名材料被 Git 忽略，缺材料时源配置回退 debug | 每个新包都实际核对签名，不能只看 `--release` 或文件名 |
| 送审 | 发布概览 15 项更改已送审，页面当时显示“正在审核中” | 新的带时间平台观察；没有新观察就保留“送审时”限定 |
| 商品与声明 | 当时完成 11 项应用内容声明、zh-CN 详情、7 张 475×844 截图、512 图标及 1024×500 大图；素材在 `output/store/` | 来源条款、真实设备截图及 T05 其余验收 |
| 隐私政策 | Worker `https://flare-privacy.294851575.workers.dev` 已在送审阶段部署；App/网页预览没有远程部署 | 隐私事实有变更时核对；本轮不部署 |
| 当时生产门槛 | 页面要求 ≥12 名测试者选择加入连续 14 天后申请正式版权限；加入地址 `https://play.google.com/apps/testing/dev.mhgd.flare` | 测试人数/时长及权限申请结果，后续操作时重新核对平台要求 |
| 当前本地修复与送审包差异 | P01构建在PR5/PR3/PR6/PR7整合前，不含Web计时、详情交换/旋转/连续构图、训练场景、知识、加载等后续修复 | 后续另行构建并核对新versionCode、签名、哈希与上传授权；当前保持P01 |

## 验收与后续记账规则

T01 长期计时、T02 Android 真机/iOS 性能与手势、T03 内容/数据、T04 动作及图片限制、T05 商店审核，唯一待验收状态见 [实施路线](development-roadmap.md#待验收台账与下一轮顺序)。本轮 Web 计时修复有实际 dart2js 与浏览器证据，仍不代替长期前后台设备验收。旧 `verify-official-poses.mjs` 两边同有 23 项基线失败，当前 v41 定向检查通过；不写成所有历史检查均通过。

以后记录一项版本成果时，同时填写日期、包版本/动作版本、完整源 SHA（或明确工作树状态）、必要时 tree、验证命令及适用范围、包路径/字节/哈希/实际签名、Git 保存与外部发布状态。通用输出路径会被下一次构建更新，历史包用具名副本和哈希定位。文档提交可复用前一次产品证据，但须证明有限 delta 不影响被验证内容；构建成功、提交、push、送审与正式验收分别记账。

此前PR5/PR3收束Preflight见 [版本台账收束记录](verification.md#2026-10-09-版本台账文档收束)，历史PR6交付见 [PR6审核](pr6-audit-2026-10-09.md)，历史PR7整合见 [PR7审核](pr7-audit-2026-10-09.md)。当前L28交付及10-11文档收束见本文开头与 [验证记录](verification.md)。本次仅保存文档并按明确授权正常push，不另行合并、不改版号、不重传Play包、不部署、不结束Cockpit session。

## 2026-10-11 Git推送记录

预检时间12:48（北京时间）：git ls-remote返回远端master为 `812d948b49616d8edce20fd7ec46d70129e0fa27`，本地为master，origin对应 `https://github.com/mhgd3250905/3D-Body.git`。远端提交是本地HEAD祖先，待推送的既有版本为L26和L28；远端当时无 `app-l28-20261011`。用户已明确授权push，该预检单独保留，实际结果如下。

12:52实际执行 `git push --atomic origin HEAD:refs/heads/master refs/tags/app-l28-20261011:refs/tags/app-l28-20261011`，退出0：master从812d948正常快进至 `f89db3fa3fa227071b0dfccafa2d6778a65a4413`，同时新增原有L28标签，没有force或合并。随后 `git ls-remote` 独立核对远端master为同一完整SHA；标签对象为 `79d8d7d196a7a1c3cb3e9e141d86b02204f02139`，解引用提交为 `3f0fda327a5e5716b89ba297447612148b542199`。L26/L28及源资源已进入远端；APK、构建目录、签名及21项未跟踪用户/候选文件没有上传。

本段实际回执与验证补记另行保存为仅文档提交并普通push；该提交不预填自身SHA，由Git与最终远端核对定位。上传代码和标签不改变L28安装包、Play P01送审状态或T01–T05验收边界。

---

## 历史：iOS v1 候选（Mac，2026-10-10）

以下保留独立iOS分支的Mac产物及Apple状态历史。本轮2026-10-12已与L43和master80298ce整合，公共版本仍1.0.0+1，没有替换或重新上传S4包；代码取舍/验证及原生待验见 [整合审核](ios-main-integration-audit-2026-10-12.md)。本节中的本地候选指当时Mac产物，不是本轮Windows工作副本的构建。

| 字段 | 已核对结果 |
|---|---|
| 分支 / 基线 | `ios/main` / PR #8 `ad72f1cc481080072526be918e48748dbec20794`；用户授权后首次普通 push `cb6aabbcca4689ea5b66611db92943c8f6dbed49`，远端已核对；主目录 master 与原网页服务保留 |
| Apple 当前产品源 | `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`；S4 清理关于页旧版本和过期授权提示，完整署名保留；已上传、内部测试并绑定商店草稿 |
| 最新本地产品源 | 同为 `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`，Build 3；后续仅维护验证/发布文档，不重导出或改变获准 IPA |
| 应用身份 | `dev.mhgd.flare`，营销版本 `1.0.0`；当前 S4 Build 3，S2 Build 1 保留历史；Flare 托马斯，最低 iOS 15.0，仅 iPhone，竖屏及左右横屏 |
| C01 历史本机归档 | 源 `63e45e8`；215,767,270 字节、305 个普通文件，arm64；本机 `~/ios-release-artifacts/flare-v1-20261009/candidate/Flare-1.0.0-build1-unsigned.xcarchive` 与 `candidate-manifest.json` 保留 |
| C02 历史本机归档 | 源 `3a85bd9`；215,767,406 字节、305 个普通文件，arm64；本机 `~/ios-release-artifacts/flare-v1-20261009/candidate/Flare-1.0.0-build1-unsigned-r2.xcarchive` 与 `candidate-manifest-r2.json` 保留 |
| C03 未签名检查点 | 源 `83f0920`；`UNSIGNED_ARCHIVE_LOCAL_VALIDATED`；215,768,913 字节、305 个普通文件，arm64；本机 `~/ios-release-artifacts/flare-v1-20261009/candidate/Flare-1.0.0-build1-unsigned-r3.xcarchive` 保留 |
| S1 历史分发候选 | 源 `83f0920`；本机静态验包通过，但 Apple 上传前验证因 `assets/data/import_content.py` 未签名报 90035，未上传；50,095,200 字节，SHA-256 `cd280f67d66858f4f15570a426a048ab1a77e88ce9db7e0218b369ae6e8c861c`，原 IPA 与清单保留 |
| S2 历史 Apple 分发候选 | 源 `a4ef59f`，Apple Distribution；50,642,770 字节，SHA-256 `87d58c73f058ab6ef5f4fd4030af4b602bea65c93971c69db9978774cd40129f`；本机 `candidate/Flare-1.0.0-build1-app-store-S2.ipa`，Apple 上传前验证退出 0；用户分别授权精确上传与内部测试，已处理为 VALID，作为历史构建保留在内部组 |
| S3 历史本地候选 | 源 `b81026a`，`1.0.0 (2)`，Apple Distribution；50,089,766 字节，SHA-256 `e6d4a856302df2a30a5498ccfa0a0cd2bf08540c8f1f7376ce788fd04a0d09ba`；本机 `candidate/Flare-1.0.0-build2-app-store-S3.ipa`；10 项相关 UI 测试、analyze、签名与 Apple 验证通过，已被本地 S4 取代，未上传/分发 |
| S4 当前 Apple 候选 | 源 `7ffa5e6`，`1.0.0 (3)`，Apple Distribution；50,089,798 字节，SHA-256 `8cf1ec14b009dce4120edde85574ac732d2445128767bb41bd0d848c11b9493f`；本机 `candidate/Flare-1.0.0-build3-app-store-S4.ipa`；10 项 UI 测试、analyze、严格验签、Apple 验证和同源调试版关于页复查通过。用户精确授权后原文件上传，上传后哈希不变，已处理为 VALID / APP_STORE_ELIGIBLE；当前内部测试及商店草稿均使用 Build 3，真机待验 |
| 候选核查 | S2 严格深度验签、三个 arm64 执行文件、描述文件/实际证书/授权 Team、`get-task-allow=false` 及四份隐私清单通过；Flutter 资源 249 份，排除两个生成源码，245 份与 S1 哈希一致，资产清单与生成 MaterialIcons 字体变化。本机 `candidate-manifest-s2.json`、`s2-signing-checks.json` 与 `s2-asset-comparison.json` 留证 |
| S3 补充核查 | 同样的签名、证书/描述文件绑定、三个 arm64 执行文件与隐私检查通过；四份隐私清单与 S2 字节一致，249 份 Flutter 资源中 248 份哈希相同，仅 MaterialIcons 改为构建生成子集，源码 28 种图标所需字形全部存在；本机 S3 manifest、signing/asset/icon/Apple validation 记录留证 |
| 截图 | 四种 iPhone 模拟器、两主题、五页面，共 40 张；来自 `63e45e8` 就绪页面，后续加载与系统动效修复另以原生流程/录像核对，默认动效下的就绪页面素材继续复用；PNG 原件/无透明 JPEG及本机 `screenshot-manifest.json` 不入 Git |
| Apple 状态 | [Flare 托马斯 App](https://appstoreconnect.apple.com/apps/6821186142/distribution/info) 为 `1.0.0`、准备提交；既有文案/分类/网址、10 张 COMPLETE 截图和审核/供应配置保留。S4 VALID、APP_STORE_ELIGIBLE，草稿重新加载仍绑定 Build 3；原内部组“Flare iOS v1”仅 1 名指定账号，保留 S2 与 S4 两个构建，自动分发关闭、S4 正在测试、账号已邀请。构建通知允许，邮件送达及真实安装未确认；正式提审未执行 |
| 验收边界 | 初始 96 项、83f0920 的 60 项相关 UI/原生减弱动效、S2 的 6 项内容测试及 S3/S4 各 10 项相关 UI 测试分别留证；S2/S3/S4 analyze、签名与 Apple 验证通过，未重跑全套原生流程。S4 同源调试版关于页复查通过、偏好保留；公开政策修订已部署。用户要求等其回来连接 iPhone 后继续内部邀请接受/安装、真机、最终合规及审核 |
| 公开隐私页 | 现有 [flare-privacy](https://flare-privacy.294851575.workers.dev/) 已按单独授权更新为 2026-10-10 文案；生产模块 3,060 字节、SHA-256 `efa675a77737fc1380426a3721de65567e5ad9d77128759b102c02697c4721f0`，公开 HTML 2,805 字节、SHA-256 `1ddfc8ca7bb23d70d92dcb2098aac6181cf58c1b10ba832bc3c8b0e2180c9306`，均与批准文件一致；联系段落及现有配置保留 |
| 合规复核草稿 | [26 个年龄字段及版权/隐私/医疗设备提案](ios-compliance-v1-draft.md)已在本机准备；四类实际对话框只读核对后关闭，未保存或发布。补入健康健美分类所需的受监管医疗设备声明；现有 App 页面为非交易商状态，ICP 未见已保存号，最终声明和适用地区许可仍待复核 |

详细命令和设备证据见 [iOS 验证](ios-verification-2026-10-10.md)，逐项结果见 [iOS 执行台账](ios-plan-2026-10-09.md)，可审阅的描述、隐私与截图说明见 [商店材料](ios-app-store-v1.md)。注册、签名、App 创建、普通 push、精确 S2 上传/内部测试及新增商店字段保存分别来自用户明确授权；S1 验证失败后未上传。S4 精确上传/草稿绑定/原单账号内测更新及现有公开隐私页更新已分别获得授权并完成；外部测试、最终合规、正式提审与公开发布继续按对应授权推进。文档保存点由 `git log` 定位，不预填自身 SHA。以下保留 Android/Web 交付台账。
