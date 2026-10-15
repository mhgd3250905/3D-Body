# L47：自适应场景分辨率真机交付

2026-10-15，用户授权把已合并PR #116的性能优化打包安装到真机。当前交付 **L47 / 1.0.4+6 / v42-R12** 已从L46同签名保留数据更新，离线Flutter Web同步构建。原生首页R12、原深色主题正常，HUD默认隐藏；**用户已测试使用L47，并要求保存本版**。L46的“我测试初步OK”保留为此前动作展示的有限初验，不移作L47性能验收。

用户安装后表示“我已经测试使用了 APP”，并要求整理台账和文档、保存本版，见[用户反馈](evidence/l47-20261015/user-feedback.json)。这里只记录已测试使用及保存授权；用户未逐项提供FPS、温度、续航或完整设备QA结果。安装与核对JSON保留安装时的原始观察，其中pending仅指收到该反馈前的历史状态。

## 版本保存与独立动作归档

本版保存标识为 `app-l47-v1.0.4-build6`，对应本次版本提交；恢复时核对本文APK哈希，保留具名包和安装前L46备份。该标签保存源码/版本与文档，不等于商店发布或全部设备QA通过。

新增51项动作已按用户安排独立保存到E盘，含303份制作源文件、51项索引、人体/许可依赖、主题及恢复指南，完整ZIP实际解包回读通过。所查本地路径未找到对应成片/封面/逐帧QA，逐项标为待取回；不将作者报告扩大为本次媒体验收。完整归档入口、哈希及后续顺序见[本地保存与规划](../../docs/home-drills-51-plan-2026-10-15.md)。归档不自动替换当前App51视频，也不随普通Git push上传大包。

## 本轮内容与保留范围

来源为主线 `e521969311188b296262b3384f8b30d667d61fc1`，本轮产品修改仅为 `app/pubspec.yaml` 提高包版本；已审核场景JS未改。场景bundle仍为 `index-CTFzChFx.js`。首页和肌群详情默认启用自适应密度：播放、旋转/惯性及详情相机移动时使用运动密度上限并按前台帧间隔调档，静止约250ms后恢复原画质密度；仅视角移动且姿态、灯光和舞台未变时复用阴影。性能面板默认关闭，具体参数和计数口径见[场景说明](../scene/README.md)。

R12七形象、22骨/44轨/541帧、1.35秒循环、0–9非线性教学时钟、同帧详情/交换返回、特效和启动剪影保持，[动作合约](motion-v42.md)不变。#111/#112/#113/#115的51份新规格仍是独立制作源，尚未接入App训练列表；原51视频与封面、23ready/28待核对、R1–R12冻结批次、原编辑器和个人数据保持。Play P01、Apple S4及旧具名包保留，本轮没有商店或网站发布。

## 包与构建

离线Flutter Web及ARM64 APK构建完成。具名本地试用包为 `output/releases/Flare-L47-adaptive-v42-R12-20261015-arm64.apk`，81,080,911字节，SHA256 `f1f01c622ff4ae7d1b09c7487650432f7690a826b51de1dd37f585725bfce313`。包名 `dev.mhgd.flare`，versionName `1.0.4`、versionCode `6`，minSdk24、targetSdk36。

本地开发证书SHA256 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`，与更新前已装L46一致；16KiB对齐检查通过。APK及离线Web各408项源文件逐项匹配，436项源asset保持。包证据见[package.json](evidence/l47-20261015/package.json)与[本轮核对](evidence/l47-20261015/verification.json)。旧离线Web另存本轮 `output/l47-performance-20261015/build-before/app-web/`；两个旧通用APK原哈希均与保留的 `output/releases/Flare-L46-v42-R12-20261015-arm64.apk` 一致，安装前旧APK又独立备份至本轮 `installed-L46-before.apk`。

## 安装与原生观察

用户连接且解锁的2602BRT18C / Android16设备已用 `adb install -r` 从L46（1.0.3+5）更新为L47（1.0.4+6），返回Success。系统回读版本正确，首次安装时间前后均为2026-10-08 17:53:04，更新时间为2026-10-15 23:16:58；已装APK的远端SHA256与具名本地包一致。没有卸载或清数据；私有个人记录未提取逐项比对，不把保留数据安装扩大为全量内容验证。

冷启动Status ok、LaunchState COLD、Activity TotalTime 426ms，前台Activity为本App。该耗时仅表示Activity启动，不代表3D首帧完成、FPS或响应性能提升。[原生首页截图](evidence/l47-20261015/native-home.png)显示R12、原深色主题及默认无HUD；当前App进程限定日志未匹配到fatal或场景错误，不等于全设备/长期日志无错误。本轮未完成原生详情/七形象/长期计时与全媒体验证。安装证据见[installation.json](evidence/l47-20261015/installation.json)。

## 软件证据与验收边界

本轮没有改动已验证的性能JS，沿用[PR合并阶段](../../docs/pr-batch-merge-2026-10-15.md)同源代码证据：历史及R12资产、七形象/541阶段帧、详情同帧/减弱动态、画质与自适应控制器（含250/600ms慢帧）回归；9项真实tick/render隔离检查及18项浏览器检查通过，page errors为0。这些检查不是本轮重新运行，不重复统计；[原软件证据清单](evidence/pr-batch-20261015/manifest.json)保留其来源与限制。

现有DPR机制和软件GPU相对像素/阴影计数不能证明真机FPS、温度、内存或续航改善。HUD FPS为最近1秒主舞台实际渲染数，p50/p95保留最近240个连续渲染tick历史，draw calls/triangles只计主色彩pass。用户已测试使用L47并要求保存本版；原生详情/全部形象、51项视频、长期性能与计时、iOS及完整设备/素材QA继续按[待验收台账](development-roadmap.md)推进。

本轮精选证据见[manifest.json](evidence/l47-20261015/manifest.json)。完整构建日志、旧APK、具名新APK与构建备份留在本机 `output/l47-performance-20261015/` 和 `output/releases/`；不承诺fresh clone中存在这些忽略文件。新环境按[动作合约](motion-v42.md)和App运行说明重建。
