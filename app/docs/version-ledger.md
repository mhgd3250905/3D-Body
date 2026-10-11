# Flare 版本管理台账

更新于 2026-10-11。当前开发内容已按 **PR #5 → PR #3 → PR #6 → PR #7** 顺序合并，并在当前工作区修复加载衔接、肌群表现、详情小卡与动作人物高亮边缘，加入启动预加载、真实动作剪影和暂停肌群标签，已安装到所连手机。App 包版本仍为 **1.0.0+1**，网页/App 默认动作仍为 **v41**。主目录与本地新版 APK 已包含这些后续修复，已上传 Google Play 的 AAB 没有包含它们。两者版本号相同，不能据此判断内容相同。

本文件是代码检查点、版本、安装包及发布观察的当前台账。实施与待验收项由 [development-roadmap.md](development-roadmap.md) 维护；测试命令、source state 与限制由 [verification.md](verification.md) 维护；动作来源与播放合约由 [motion-v41.md](motion-v41.md) 维护。下文路径均相对于根项目 `E:\AII-3D\3D-Body`。

## 2026-10-11 L28：采用青绿色运动服 Flare 图标 B

用户选定新角度 B。当前源资源、通用/具名开发 APK 与离线 Flutter Web 已换用该图标，保留 L26 功能与银色肌群条目。34张品牌、Android、iOS和Web图标由同一选定原图导出；iOS仅同步资源，未进行Xcode构建。姿态来自用户的项目模型截图，imagegen调整图标人物、服装和光影；运行时人物、原服装、v41动画及加载剪影保持。

L28具名包 `output/releases/Flare-v41-teal-logo-20261011-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk` 相同，46,151,845字节，SHA-256 `c836a597ce7297dd09fb3c3e967595b6f26f31fbbde22b426651e5e37927624b`。使用既有 Android Debug 开发证书，包名/版本仍 `dev.mhgd.flare` / `1.0.0+1`；于12:07:18（北京时间）以 `adb install -r --no-streaming` 保留数据覆盖安装成功，初次启动Status ok、进程18394，定向错误日志为空。初次核对时手机PIN锁屏；用户随后解锁，于12:19补验桌面与应用信息页：青绿图标已生效，人物和两鞋完整未裁切。经桌面图标冷启动，原3D首页和同步人台正常显示，进程18954、按PID错误日志为空；该核对不扩大为完整设备或性能验收。

51项资源/包核对通过，41项既有场景、银色肌群图、加载/首页图片在新旧APK间逐字节一致；Web 7项HTTP资产与构建文件相同，浏览器加载无pageerror。图标与署名在源/APK/Web一致；记录 `output/releases/L28-teal-logo-delivery.json`，来源与导出见 [asset-sources.md](asset-sources.md)。旧图标/平台资源及通用L26包均独立备份。

用户确认真机效果并要求版本管理后，L28代码保存点以本地标签 `app-l28-20261011` 定位，完整提交SHA由 `git rev-parse app-l28-20261011^{commit}` 查询，不在提交正文预填自身SHA。基线为L26提交 `632fdb673d50908083e9fb43440886f2e2ac5684`；保存34张生产图标、选定B原图与完整提示词、导出工具、署名、当前入口及验证文档，以及[真机桌面图标裁图](screenshots/2026-10-11/L28-home-icon.png)。用户于12:19补验后回复“可以了”，该确认适用于本次图标效果。未push、上传或部署；APK、完整本机检查报告、未选候选及原图参考继续留在E盘，Air-Flare用户素材不纳入提交。

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
| Git 分支 | `master`，远端 `origin` 为 `mhgd3250905/3D-Body` | L26/L28均为本地检查点，未push；本地origin/master引用仍为812d948，本轮未联网刷新，不推断实时远端状态 |
| 当前本地产品检查点 | 本地标签 `app-l28-20261011`，父提交为L26 `632fdb673d50908083e9fb43440886f2e2ac5684` | 当前源/APK/Web为L28；完整SHA由Git解析标签，不是新的商店发布版本 |
| 历史PR7合并检查点 | `e42df21dbf4be273939ad9377d6f883ea9e75c95` | 与最终审核源b991aa3完整tree同为 `649b9f77189ec4830519825a1d730f54a638e088`；PR7阶段已验证产品源d1c3886之后仅文档/截图 |
| 上一轮主分支交付保存点 | `96cd9b125c52aeaada7dab0872258e67d662030d` | PR6交付文档保存并push；本轮PR7真实目标。当前交付状态文档单独保存，不在提交内预填自身SHA |
| App 包版本 / Android 包名 | `1.0.0+1` / `dev.mhgd.flare` | `app/pubspec.yaml` 与 Android 源配置；`0.1.0+1` 仅属 Play 接入前历史版本 |
| 动作内容版本 | `v41` | 固定来源 `53d72b412840a942fefc818836b68ad2a2d7e0d1`；本轮没有另改动作、脸或衣物。v41 不等于 App 第 41 个发布版本 |
| 当前本地试用包 | 下表 L28，开发签名 APK | 保留数据安装成功，桌面/应用信息图标完整，桌面冷启动与原3D首页已实景核对；L26银色条目认可继续有效。`--release` 为优化构建，使用相同开发证书 |
| Play 已上传包 | 下表 P01，上传密钥签名 AAB | 构建源 `92e459f54b620c6d72d2a920521e3e3a72b785e9`；是先前送审包，不等于本地最新产品 |
| 验收状态 | 定向软件验证通过；T01–T05 按路线继续 | 不把 APK 生成、文档提交或 Cockpit 检查点记成真机、教练或商店验收 |

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

[PR5 审核与回归](pr5-audit-2026-10-09.md)、[PR3 审核与回归](pr3-audit-2026-10-09.md) 保留源/目标、修复、实际操作及合并树证据。两项 PR 的 AI 审核、GitHub 实际合并与作者自报测试分别记录，不合并成“全仓全量通过”。本次版本台账提交的完整 SHA 由 Git 与 closeout 回执定位；不创建标签或空提交。

## 安装包与本地预览

当前为L28；通用/具名包身份见上方L28记录。离线Web稳定预览为 `http://127.0.0.1:8820/`。下面L26及更早包的构建、进程与验收均为保留历史证据，不覆盖当前安装身份。

L26具名包与通用APK一致；场景使用 `index-DBRgBX7q.js` / `index-1IjNUedj.css`，APK内JS与源构建SHA-256均为`80a439211f0f4d12582dab1d8b8fd40b15d5f065aebde77b70cbf0b09822f3f8`。17张银色肌群图片逐项核对包内哈希与摄影报告相同，共592,628字节，并按用户最终选择从同一APK恢复到源资产；L24图文/点击证据保留。手机进程17949及启动日志抽样无异常；没有安装黄色试作。交付/运行/选择记录为 `output/releases/L26-metal-muscle-image-items-delivery.json`、`L26-runtime-check.json`、`L26-silver-selection.json`。原L05–L25具名包与试作报告保留，Play包保持。

历史L07增加 Flutter 加载遮挡并取消交叉淡出，沿用 L06 的开发证书覆盖安装；当时具名包与通用 APK 一致，Web产物仍为L06，以下L06/L05核对不代表L07界面验收。

L06 从当前主目录构建，使用与手机原安装相同的开发证书重新签名后覆盖安装；证书 SHA-256 为 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。具名包与通用 APK 字节/哈希一致；APK 内场景 HTML 与本次场景/Web 构建一致。当前离线 Web 也包含加载修复，下面 L05 的同步核对属于 10-09 交付事实。

L05沿用本机PR7审核已绑定source state的构建与签名证据，交付时重新核对主目录具名PR7/candidate/通用APK的字节/哈希相同，并核对282份Web文件的集合及逐文件SHA-256一致；P01核对原哈希保持相同。交付同步没有重建、上传或部署。证据保存在本机 `output/releases/PR7-delivery-check.json`。`build/`、`dist/`、`output/` 被 Git 忽略，仅 E 盘本机保存；远端代码不包含这些包，换机器需按来源构建。

| ID / 状态 | 来源、用途与根项目路径 | 字节 / SHA-256 |
| --- | --- | --- |
| L28 当前青绿色Flare图标 APK | L26功能/银色条目加用户选定B图标；`output/releases/Flare-v41-teal-logo-20261011-arm64.apk`，与通用APK相同。Android Debug开发签名、1.0.0+1、arm64；12:07:18保留数据安装，12:19桌面/应用信息图标与桌面启动实景核对通过 | 46,151,845；`c836a597ce7297dd09fb3c3e967595b6f26f31fbbde22b426651e5e37927624b` |
| L26 历史银色肌群图文 APK | 钛银金属/细拉丝与原色肌群，17图片；当时已保留数据安装并冷启动，用户接受银色条目外观；`output/releases/Flare-v41-metal-muscle-image-items-20261011-arm64.apk`。Android Debug开发签名、1.0.0+1、arm64；通用路径已由L28更新，银色条目在L28保持 | 45,615,269；`b1c83d7ccadcabbbaa60bf7fa1b145176ce72abdc161f83b31e40dae54a0ca98` |
| L25 历史米白肌群图文 APK | 截图专用米白哑光/柔光，17图片；用户反馈质感不足，最终采用L26；`output/releases/Flare-v41-ivory-muscle-image-items-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径由L26更新 | 45,443,237；`0e5e9ce330143f62904bc3cadf4d1e8d2c897f3f8bf5840c5116882c3a255e3c` |
| L24 历史肌群图文条目 APK | 17张灰色人台渲染图用于主力/次要/详情协同肌群条目；图文入口保留，摄影材质由L25调整；`output/releases/Flare-v41-muscle-image-items-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径由L25更新 | 45,426,853；`c3f67e3236284bfa3baed458a0d6024f84342b3c5fdca2b548603264331f7a1b` |
| L23 历史可见平滑卡片 APK | L22基础上保护完整卡片不穿地面、不出宿主可见舞台；场景修复保留在L24；`output/releases/Flare-v41-visible-smooth-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径由L24更新 | 45,011,424；`52cbb97123ebaec10096e6bc08248c4f2f6c2ca7a18f2eeec067206164e30750` |
| L22 历史平滑卡片 APK | 取消淡入闪切，连续世界位置插值；圆点和细线、同侧卡片、双侧选择及身体避让保留；由L23补充边界保护；`output/releases/Flare-v41-smooth-adaptive-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径当前与L26相同 | 45,011,424；`4d7c0ef74d5b484b2f7aef21d87289c4283ba75537d47d3d3fc708cc7b010b9a` |
| L21 历史同侧卡片 APK | 旋转挑选方便展示侧，同侧卡片和身体避让初版；由L22改为连续位置动画；`output/releases/Flare-v41-adaptive-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径当前与L26相同 | 45,011,424；`4e517f888d68b1e8b011e1fa5a6d2228f3f2686b2c9e9de6f1da83dbddef993b` |
| L20 历史远距细线 APK | 圆点关闭身体深度遮挡，卡片移远并加入同色细引导线；后续L21–L23进一步修复；`output/releases/Flare-v41-guided-muscle-cards-20261011-arm64.apk`保留。Android Debug开发签名、1.0.0+1、arm64；通用路径当前与L26相同 | 45,011,424；`ef3f3cf5b0cc5fe9e4b24d284fd7aa3e82f1a5217cb91b76747d111af16b81d3` |
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

当前网页静态交付在 `dist/`，保留PR3结果，网页主入口 `main-CIbWtwFq.js`；Flutter Web在 `app/build/web/`，已离线构建L26银色版，场景入口 `index-DBRgBX7q.js` / `index-1IjNUedj.css`。稳定本地入口为App `http://127.0.0.1:8820/`、网页 `http://127.0.0.1:8810/`，服务须运行。8855/8856是先前审核预览，8857/8858为PR6隔离审核入口，8860为PR7隔离预览。PR7更新前Web/APK备份在 `output/releases/before-pr7-20261009/`，PR6更新前备份在 `output/releases/before-pr6-20261009/`，更早dist/Web/APK备份在 `output/releases/before-pr5-pr3-20261009/`；没有清理旧资产、个人数据或Air-Flare。

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

此前PR5/PR3收束Preflight见 [版本台账收束记录](verification.md#2026-10-09-版本台账文档收束)，历史PR6交付见 [PR6审核](pr6-audit-2026-10-09.md)，当前交付见 [PR7审核](pr7-audit-2026-10-09.md)。本轮用户授权后已push并合并；不改版号、不重传Play包、不部署、不结束Cockpit session。
