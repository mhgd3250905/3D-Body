# Flare 版本管理台账

更新于 2026-10-09。当前开发内容已按 **PR #5 → PR #3 → PR #6** 顺序合并；App 包版本仍为 **1.0.0+1**，网页/App 默认动作仍为 **v41**。主目录与本地新版 APK 已包含三项 PR，已上传 Google Play 的 AAB 没有包含这些后续修复。两者版本号相同，不能据此判断内容相同。

本文件是代码检查点、版本、安装包及发布观察的当前台账。实施与待验收项由 [development-roadmap.md](development-roadmap.md) 维护；测试命令、source state 与限制由 [verification.md](verification.md) 维护；动作来源与播放合约由 [motion-v41.md](motion-v41.md) 维护。下文路径均相对于根项目 `E:\AII-3D\3D-Body`。

## PR6审核修复与交付（已合并）

原来源 `2b87db57a9589ba0fe92d6a0710506a36295d49c`，真实目标 `f1d526aba2fbfc7bebe10131e07d530beb1327b6`；隔离修复产品保存为 `4bc81b830f45279fbaa6631a269a590112f6ae96`，tree `3d35127c3fcb2ff13c2c56af1ce376a82901d840`。最终审核源 `d5c11e46bfdfd1c3e7dc87e71ffa851be3f9c843`，用户授权后17:05:14合并为 `aa3c726a66594c23cf66a1b4a7938366ea73dede`；两者完整tree同为 `213951ce7a2879366fafc4fe998db1b38354c365`。产品目录相对4bc81b8差异为0。App仍1.0.0+1/动作v41；当前主目录包为L04，Play P01保持。新机位交互、训练场景、知识与加载见 [PR6审核](pr6-audit-2026-10-09.md)。

隔离候选APK保留在 `E:/AII-3D/3D-Body-worktrees/pr-6-audit/output/releases/Flare-v41-PR6-candidate-20261009-arm64.apk`，同一包已同步到主目录L04及通用APK路径；字节/哈希均核对相等。隔离Web预览8858、直接场景8857是审核入口，主目录稳定App入口8820。末尾交付文档保存不改变已验证产品内容；文档提交完整SHA由Git定位。

## 当前身份

| 维度 | 当前值 | 判定依据与边界 |
| --- | --- | --- |
| Git 分支 | `master`，远端 `origin` 为 `mhgd3250905/3D-Body` | 本轮普通提交与 push；最新文档提交用 `git rev-parse HEAD` / `git log -1` 定位，不在提交内预填自身 SHA |
| 已交付产品检查点 | `aa3c726a66594c23cf66a1b4a7938366ea73dede` | PR6合并；与最终审核源d5c11e4完整tree同为 `213951ce7a2879366fafc4fe998db1b38354c365`；已验证产品源4bc81b8之后仅文档/截图 |
| 上一轮版本台账文档保存点 | `f1d526aba2fbfc7bebe10131e07d530beb1327b6` | PR5/PR3版本台账收束并push；本轮PR6真实目标。当前交付状态文档单独保存，不在提交内预填自身SHA |
| App 包版本 / Android 包名 | `1.0.0+1` / `dev.mhgd.flare` | `app/pubspec.yaml` 与 Android 源配置；`0.1.0+1` 仅属 Play 接入前历史版本 |
| 动作内容版本 | `v41` | 固定来源 `53d72b412840a942fefc818836b68ad2a2d7e0d1`；本轮没有另改动作、脸或衣物。v41 不等于 App 第 41 个发布版本 |
| 当前本地试用包 | 下表 L04，开发签名 APK | 用于真机验证；`--release` 表示优化构建，本次签名核对结果仍是开发签名 |
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

[PR5 审核与回归](pr5-audit-2026-10-09.md)、[PR3 审核与回归](pr3-audit-2026-10-09.md) 保留源/目标、修复、实际操作及合并树证据。两项 PR 的 AI 审核、GitHub 实际合并与作者自报测试分别记录，不合并成“全仓全量通过”。本次版本台账提交的完整 SHA 由 Git 与 closeout 回执定位；不创建标签或空提交。

## 安装包与本地预览

L04沿用本机PR6审核已绑定source state的构建与签名证据，交付时重新核对两份主目录APK的字节/哈希，并复制核对Web文件；P01核对原哈希保持相同。没有重建、上传或部署。`build/`、`dist/`、`output/` 被 Git 忽略，仅 E 盘本机保存；远端代码不包含这些包，换机器需按来源构建。

| ID / 状态 | 来源、用途与根项目路径 | 字节 / SHA-256 |
| --- | --- | --- |
| L04 当前本地 PR6 APK | 已验证产品源4bc81b8，后续文档/合并不改变产品；`output/releases/Flare-v41-PR6-20261009-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk` 相同。开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,114,581；`cb14cc10fc40f288fd692b7202e496dd644141390a32ef22577319593925ad7b` |
| L01 历史 PR5+PR3 APK | 已验证 tree `107d301bf6fa5edc83d27c06f1d10ffeed83ebb5`；`output/releases/Flare-v41-PR5-PR3-20261009-arm64.apk` 保留。通用路径已被L04更新；另备份在 `output/releases/before-pr6-20261009/app-release.apk`。开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,046,265；`00bddde38ab954068f85428e398a0de83f5e336f82cc09403e9f3a863468da86` |
| L02 历史 v41+PR4 APK | 已验证 tree `cbf81746bca8eb4146c0f99b7b3744db02cb89cf`；具名副本 `output/releases/Flare-v41-light-20261009-arm64.apk`。开发签名、当时 `0.1.0+1`；原通用路径后来被 L01 更新，不能再用通用路径定位旧包 | 44,045,329；`4040188f0c6dfad56e77afb7b99e6878bfefc51e0103e875ef66df5efeb7bfe5` |
| L03 历史 v41、PR4 前 APK | e27 保存点；`output/releases/Flare-v41-before-pr4-20261009-arm64.apk`。开发签名、当时 `0.1.0+1` | 42,836,141；`5c579985b1ed6b7db3ba988400bd2a3d88065e102f2cf83f12d883b6f430a9c7` |
| P01 已上传 Play 封闭测试 AAB | 构建源 `92e459f54b620c6d72d2a920521e3e3a72b785e9` 加本机 gitignored 签名材料；`app/build/app/outputs/bundle/release/app-release.aab`。上传密钥签名、`1.0.0+1`；本轮未替换或重传 | 77,816,786；`9483f16054440cc7f76826f46f06befb3d141a6a0f6f2cb9dcaedb741e1d2119` |

当前网页静态交付在 `dist/`，保留PR3结果，网页主入口 `main-CIbWtwFq.js`；Flutter Web在 `app/build/web/`，已同步PR6已验证构建，场景入口 `index-BNrG0E-k.js` / `index-Dy82c42l.css`。稳定本地入口为App `http://127.0.0.1:8820/`、网页 `http://127.0.0.1:8810/`，服务须运行。8855/8856是先前审核预览，8857/8858为PR6隔离审核入口。PR6更新前Web/APK备份在 `output/releases/before-pr6-20261009/`，更早dist/Web/APK备份在 `output/releases/before-pr5-pr3-20261009/`；没有清理旧资产、个人数据或Air-Flare。

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
| 当前本地修复与送审包差异 | P01构建在PR5/PR3/PR6整合前，不含Web计时、详情交换/旋转、训练场景、知识、加载等后续修复 | 后续另行构建并核对新versionCode、签名、哈希与上传授权；当前保持P01 |

## 验收与后续记账规则

T01 长期计时、T02 Android 真机/iOS 性能与手势、T03 内容/数据、T04 动作及图片限制、T05 商店审核，唯一待验收状态见 [实施路线](development-roadmap.md#待验收台账与下一轮顺序)。本轮 Web 计时修复有实际 dart2js 与浏览器证据，仍不代替长期前后台设备验收。旧 `verify-official-poses.mjs` 两边同有 23 项基线失败，当前 v41 定向检查通过；不写成所有历史检查均通过。

以后记录一项版本成果时，同时填写日期、包版本/动作版本、完整源 SHA（或明确工作树状态）、必要时 tree、验证命令及适用范围、包路径/字节/哈希/实际签名、Git 保存与外部发布状态。通用输出路径会被下一次构建更新，历史包用具名副本和哈希定位。文档提交可复用前一次产品证据，但须证明有限 delta 不影响被验证内容；构建成功、提交、push、送审与正式验收分别记账。

此前PR5/PR3收束Preflight见 [版本台账收束记录](verification.md#2026-10-09-版本台账文档收束)，当前交付见 [PR6审核](pr6-audit-2026-10-09.md)。本轮用户授权后已push并合并；不改版号、不重传Play包、不部署、不结束Cockpit session。
