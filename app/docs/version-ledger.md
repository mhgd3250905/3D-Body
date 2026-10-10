# Flare 版本管理台账

更新于 2026-10-10。Android/Web 开发内容已按 **PR #5 → PR #3 → PR #6 → PR #7** 顺序合并；App 包版本仍为 **1.0.0+1**，网页/App 默认动作仍为 **v41**。主目录与本地新版 APK 已包含这些后续修复，已上传 Google Play 的 AAB 没有包含它们。iOS 独立分支 `ios/main` 基于 PR #8，最新产品提交与本地归档见下节。同一版本号不能据此判断包内容相同。

本文件是代码检查点、版本、安装包及发布观察的当前台账。实施与待验收项由 [development-roadmap.md](development-roadmap.md) 维护；测试命令、source state 与限制由 [verification.md](verification.md) 维护；动作来源与播放合约由 [motion-v41.md](motion-v41.md) 维护。iOS 路径按本机证据目录记录；下文原 Android/Web 路径相对于 `E:\AII-3D\3D-Body`，保留历史交付事实。

## iOS v1 候选（本机，2026-10-10）

| 字段 | 已核对结果 |
|---|---|
| 分支 / 基线 | `ios/main` / PR #8 `ad72f1cc481080072526be918e48748dbec20794`；用户授权后首次普通 push `cb6aabbcca4689ea5b66611db92943c8f6dbed49`，远端已核对；主目录 master 与原网页服务保留 |
| Apple 当前产品源 | `a4ef59fdf8e6d6c9dd005aba55debbb80ab667a9`；S2 收窄数据资产打包，排除仓库的 Python/TypeScript 生成源码；已上传、内部测试并绑定商店草稿 |
| 最新本地产品源 | `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`；S4 继承旧版本文案补修，清理已过期的素材授权提示并递增 Build 为 3，署名和许可保留；尚未上传 |
| 应用身份 | `dev.mhgd.flare`，营销版本 `1.0.0`；Apple 当前 S2 Build 1，最新本地 S4 Build 3；Flare 托马斯，最低 iOS 15.0，仅 iPhone，竖屏及左右横屏 |
| C01 历史本机归档 | 源 `63e45e8`；215,767,270 字节、305 个普通文件，arm64；本机 `~/ios-release-artifacts/flare-v1-20261009/candidate/Flare-1.0.0-build1-unsigned.xcarchive` 与 `candidate-manifest.json` 保留 |
| C02 历史本机归档 | 源 `3a85bd9`；215,767,406 字节、305 个普通文件，arm64；本机 `~/ios-release-artifacts/flare-v1-20261009/candidate/Flare-1.0.0-build1-unsigned-r2.xcarchive` 与 `candidate-manifest-r2.json` 保留 |
| C03 未签名检查点 | 源 `83f0920`；`UNSIGNED_ARCHIVE_LOCAL_VALIDATED`；215,768,913 字节、305 个普通文件，arm64；本机 `~/ios-release-artifacts/flare-v1-20261009/candidate/Flare-1.0.0-build1-unsigned-r3.xcarchive` 保留 |
| S1 历史分发候选 | 源 `83f0920`；本机静态验包通过，但 Apple 上传前验证因 `assets/data/import_content.py` 未签名报 90035，未上传；50,095,200 字节，SHA-256 `cd280f67d66858f4f15570a426a048ab1a77e88ce9db7e0218b369ae6e8c861c`，原 IPA 与清单保留 |
| S2 当前 Apple 分发候选 | 源 `a4ef59f`，Apple Distribution；50,642,770 字节，SHA-256 `87d58c73f058ab6ef5f4fd4030af4b602bea65c93971c69db9978774cd40129f`；本机 `candidate/Flare-1.0.0-build1-app-store-S2.ipa`，Apple 上传前验证退出 0；用户分别授权精确上传与内部测试，已处理为 VALID，当前 `INTERNAL_TESTING` |
| S3 历史本地候选 | 源 `b81026a`，`1.0.0 (2)`，Apple Distribution；50,089,766 字节，SHA-256 `e6d4a856302df2a30a5498ccfa0a0cd2bf08540c8f1f7376ce788fd04a0d09ba`；本机 `candidate/Flare-1.0.0-build2-app-store-S3.ipa`；10 项相关 UI 测试、analyze、签名与 Apple 验证通过，已被本地 S4 取代，未上传/分发 |
| S4 最新本地候选 | 源 `7ffa5e6`，`1.0.0 (3)`，Apple Distribution；50,089,798 字节，SHA-256 `8cf1ec14b009dce4120edde85574ac732d2445128767bb41bd0d848c11b9493f`；本机 `candidate/Flare-1.0.0-build3-app-store-S4.ipa`；10 项 UI 测试、analyze、严格验签和 Apple 验证通过，249 份资源及四份隐私清单与 S3 相同。`VALIDATED_AWAITING_NATIVE_ABOUT_AND_EXACT_UPLOAD_AUTHORIZATION`；Mac 解锁后复查关于页，再申请本文件授权 |
| 候选核查 | S2 严格深度验签、三个 arm64 执行文件、描述文件/实际证书/授权 Team、`get-task-allow=false` 及四份隐私清单通过；Flutter 资源 249 份，排除两个生成源码，245 份与 S1 哈希一致，资产清单与生成 MaterialIcons 字体变化。本机 `candidate-manifest-s2.json`、`s2-signing-checks.json` 与 `s2-asset-comparison.json` 留证 |
| S3 补充核查 | 同样的签名、证书/描述文件绑定、三个 arm64 执行文件与隐私检查通过；四份隐私清单与 S2 字节一致，249 份 Flutter 资源中 248 份哈希相同，仅 MaterialIcons 改为构建生成子集，源码 28 种图标所需字形全部存在；本机 S3 manifest、signing/asset/icon/Apple validation 记录留证 |
| 截图 | 四种 iPhone 模拟器、两主题、五页面，共 40 张；来自 `63e45e8` 就绪页面，后续加载与系统动效修复另以原生流程/录像核对，默认动效下的就绪页面素材继续复用；PNG 原件/无透明 JPEG及本机 `screenshot-manifest.json` 不入 Git |
| Apple 状态 | [Flare 托马斯 App](https://appstoreconnect.apple.com/apps/6821186142/distribution/info) 为 `1.0.0`、准备提交；文案/分类/网址和 10 张截图已保存，截图全部 COMPLETE。S2 VALID、APP_STORE_ELIGIBLE，已绑定商店草稿和内部组“Flare iOS v1”；组内仅 1 名指定账号及 1 个 S2 构建，自动分发关闭、构建“正在测试”、账号“已邀请”。新增授权的审核信息、版权/联系人、手动发布、免费/全部 175 个地区供应均已保存，Mac/Vision Pro 商店供应关闭；S4 尚未上传，未正式提审 |
| 验收边界 | 初始 96 项、`83f0920` 的 60 项相关 UI/原生减弱动效流程、S2 的 6 项内容测试及 S3/S4 各 10 项相关 UI 测试分别留证；S2/S3/S4 analyze、签名与 Apple 验证通过，未重跑全套原生流程。素材发布权已由用户确认；S4 调试版已升级并保留原偏好，关于页界面复查待解锁；公开隐私页修订、内部邀请接受/安装、真机与最终合规/审核继续待完成 |

详细命令和设备证据见 [iOS 验证](ios-verification-2026-10-10.md)，逐项结果见 [iOS 执行台账](ios-plan-2026-10-09.md)，可审阅的描述、隐私与截图说明见 [商店材料](ios-app-store-v1.md)。注册、签名、App 创建、普通 push、精确 S2 上传/内部测试及新增商店字段保存分别来自用户明确授权；S1 验证失败后未上传。S4 精确上传/内测更新、公开隐私页更新、外部测试、最终合规与正式提审继续按对应授权推进。文档保存点由 `git log` 定位，不预填自身 SHA。以下保留 Android/Web 交付台账。

## PR7审核修复与交付（已合并）

已验证产品保存点 `d1c38860bdb64cf342b7ba221886cd085f2e52ae`，整合真实目标 `96cd9b125c52aeaada7dab0872258e67d662030d` 并解决冲突；详情连续投影、拖动中断、稳定画布、返回/重载已补修并完成定向验证。最终审核源 `b991aa316745fed22348df286938deccf218aea0` 已普通push到dev/hark；用户明确授权后于18:00:53（北京时间）合并为 `e42df21dbf4be273939ad9377d6f883ea9e75c95`。两者完整tree同为 `649b9f77189ec4830519825a1d730f54a638e088`，相对d1c3886产品目录差异0。主目录master快进并同步已验证Web/APK，当前包L05；初次candidate具名包保留，P01保持。审核、验证与真机限制见 [PR7审核](pr7-audit-2026-10-09.md)。

## 历史：PR6审核修复与交付（已合并）

原来源 `2b87db57a9589ba0fe92d6a0710506a36295d49c`，真实目标 `f1d526aba2fbfc7bebe10131e07d530beb1327b6`；隔离修复产品保存为 `4bc81b830f45279fbaa6631a269a590112f6ae96`，tree `3d35127c3fcb2ff13c2c56af1ce376a82901d840`。最终审核源 `d5c11e46bfdfd1c3e7dc87e71ffa851be3f9c843`，用户授权后17:05:14合并为 `aa3c726a66594c23cf66a1b4a7938366ea73dede`；两者完整tree同为 `213951ce7a2879366fafc4fe998db1b38354c365`。产品目录相对4bc81b8差异为0。App仍1.0.0+1/动作v41；当时主目录包为L04，Play P01保持。新机位交互、训练场景、知识与加载见 [PR6审核](pr6-audit-2026-10-09.md)。

隔离候选APK保留在 `E:/AII-3D/3D-Body-worktrees/pr-6-audit/output/releases/Flare-v41-PR6-candidate-20261009-arm64.apk`，同一包已同步到主目录L04及通用APK路径；字节/哈希均核对相等。隔离Web预览8858、直接场景8857是审核入口，主目录稳定App入口8820。末尾交付文档保存不改变已验证产品内容；文档提交完整SHA由Git定位。

## 当前身份

| 维度 | 当前值 | 判定依据与边界 |
| --- | --- | --- |
| Git 分支 | `master`，远端 `origin` 为 `mhgd3250905/3D-Body` | 本轮普通提交与 push；最新文档提交用 `git rev-parse HEAD` / `git log -1` 定位，不在提交内预填自身 SHA |
| 已交付产品检查点 | `e42df21dbf4be273939ad9377d6f883ea9e75c95` | PR7合并；与最终审核源b991aa3完整tree同为 `649b9f77189ec4830519825a1d730f54a638e088`；已验证产品源d1c3886之后仅文档/截图 |
| 上一轮主分支交付保存点 | `96cd9b125c52aeaada7dab0872258e67d662030d` | PR6交付文档保存并push；本轮PR7真实目标。当前交付状态文档单独保存，不在提交内预填自身SHA |
| Android 既有包版本 / 包名 | `1.0.0+1` / `dev.mhgd.flare` | 原主目录源配置及既有 Android/Play 交付；iOS 专用分支的新 Build 2 不改变此前包；`0.1.0+1` 仅属 Play 接入前历史版本 |
| 动作内容版本 | `v41` | 固定来源 `53d72b412840a942fefc818836b68ad2a2d7e0d1`；本轮没有另改动作、脸或衣物。v41 不等于 App 第 41 个发布版本 |
| 当前本地试用包 | 下表 L05，开发签名 APK | 用于真机验证；`--release` 表示优化构建，本次签名核对结果仍是开发签名 |
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

L05沿用本机PR7审核已绑定source state的构建与签名证据，交付时重新核对主目录具名PR7/candidate/通用APK的字节/哈希相同，并核对282份Web文件的集合及逐文件SHA-256一致；P01核对原哈希保持相同。交付同步没有重建、上传或部署。证据保存在本机 `output/releases/PR7-delivery-check.json`。`build/`、`dist/`、`output/` 被 Git 忽略，仅 E 盘本机保存；远端代码不包含这些包，换机器需按来源构建。

| ID / 状态 | 来源、用途与根项目路径 | 字节 / SHA-256 |
| --- | --- | --- |
| L05 当前本地 PR7 APK | 已验证产品源d1c3886，后续文档/合并不改变产品；`output/releases/Flare-v41-PR7-20261009-arm64.apk`、`output/releases/Flare-v41-PR7-candidate-20261009-arm64.apk` 与通用 `app/build/app/outputs/flutter-apk/app-release.apk` 相同。Android Debug开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,115,257；`b87e654235683ea639e55031471217b7057e687a4ba79a5c34c85346ec1d51f6` |
| L04 历史 PR6 APK | 已验证产品源4bc81b8；`output/releases/Flare-v41-PR6-20261009-arm64.apk` 保留，原通用APK另备份在 `output/releases/before-pr7-20261009/app-release.apk`。开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,114,581；`cb14cc10fc40f288fd692b7202e496dd644141390a32ef22577319593925ad7b` |
| L01 历史 PR5+PR3 APK | 已验证 tree `107d301bf6fa5edc83d27c06f1d10ffeed83ebb5`；`output/releases/Flare-v41-PR5-PR3-20261009-arm64.apk` 保留。通用路径已依次被L04/L05更新；另备份在 `output/releases/before-pr6-20261009/app-release.apk`。开发签名、`1.0.0+1`；Flutter目标arm64，插件含其ABI | 44,046,265；`00bddde38ab954068f85428e398a0de83f5e336f82cc09403e9f3a863468da86` |
| L02 历史 v41+PR4 APK | 已验证 tree `cbf81746bca8eb4146c0f99b7b3744db02cb89cf`；具名副本 `output/releases/Flare-v41-light-20261009-arm64.apk`。开发签名、当时 `0.1.0+1`；原通用路径后来被 L01 更新，不能再用通用路径定位旧包 | 44,045,329；`4040188f0c6dfad56e77afb7b99e6878bfefc51e0103e875ef66df5efeb7bfe5` |
| L03 历史 v41、PR4 前 APK | e27 保存点；`output/releases/Flare-v41-before-pr4-20261009-arm64.apk`。开发签名、当时 `0.1.0+1` | 42,836,141；`5c579985b1ed6b7db3ba988400bd2a3d88065e102f2cf83f12d883b6f430a9c7` |
| P01 已上传 Play 封闭测试 AAB | 构建源 `92e459f54b620c6d72d2a920521e3e3a72b785e9` 加本机 gitignored 签名材料；`app/build/app/outputs/bundle/release/app-release.aab`。上传密钥签名、`1.0.0+1`；本轮未替换或重传 | 77,816,786；`9483f16054440cc7f76826f46f06befb3d141a6a0f6f2cb9dcaedb741e1d2119` |

当前网页静态交付在 `dist/`，保留PR3结果，网页主入口 `main-CIbWtwFq.js`；Flutter Web在 `app/build/web/`，已同步PR7已验证构建，场景入口 `index-VERqU8U3.js` / `index-DTq4Fm3g.css`。稳定本地入口为App `http://127.0.0.1:8820/`、网页 `http://127.0.0.1:8810/`，服务须运行。8855/8856是先前审核预览，8857/8858为PR6隔离审核入口，8860为PR7隔离预览。PR7更新前Web/APK备份在 `output/releases/before-pr7-20261009/`，PR6更新前备份在 `output/releases/before-pr6-20261009/`，更早dist/Web/APK备份在 `output/releases/before-pr5-pr3-20261009/`；没有清理旧资产、个人数据或Air-Flare。

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
