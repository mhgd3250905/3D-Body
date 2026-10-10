# iOS v1 商店提交材料

当前已完成本机验证、Apple App 创建及商店草稿保存。用户批准精确 S1 上传后，Apple 上传前验证因包内生成脚本未签名（90035）拒绝；修复后的 S2 通过签名验包和 Apple 验证，用户另外批准精确新文件后已上传，Apple 处理状态 VALID。本文的版本、描述、关键词、副标题、分类、支持/隐私网址及首批 10 张原生截图已保存到平台；审核说明、最终合规等其余内容继续保留草稿。`ios/main` 基于 PR #8，Android、网页、v41 动作与原素材保留。

## 应用信息草稿

| 字段 | 候选值 |
|---|---|
| 名称 | Flare 托马斯 |
| 副标题 | 离线3D动作学习与肌群训练 |
| 主语言 | 简体中文（zh-Hans） |
| 平台 | iOS；iPhone；最低 iOS 15.0 |
| Bundle ID | dev.mhgd.flare；用户授权后已注册，并在 Developer 门户/Apple App 中核对 |
| SKU | flare-ios-v1；已创建并核对，主要语言为简体中文 |
| 版本 / 首次构建号 | S2 1.0.0 / 1；商店草稿已按授权由 1.0 改为 1.0.0；S2 已上传并完成 Apple 处理 |
| 主要分类 | 健康健美 |
| 次要分类 | 教育 |
| 关键词 | 托马斯,全旋,Flare,街舞,体能,肌群,动作分解,离线训练,训练计时 |
| 隐私政策 | https://flare-privacy.294851575.workers.dev/；已用指定 Playwright 配置读取 |
| 技术支持候选 | https://flare-privacy.294851575.workers.dev/；现有页面含应用信息和联系方法。https://github.com/mhgd3250905/3D-Body/issues 亦已打开，可作为项目反馈入口 |
| 价格与发布方式 | 免费；建议审核通过后手动发布，最终由用户复核 |

### 描述

用 3D 动作理解托马斯全旋的每个阶段，再安排适合自己的练习。

Flare 将一个动作循环分成 8 个阶段。你可以播放、暂停、调整速度或拖动进度，查看当前姿态和参与肌群；进入详情后，可旋转人物，并在动作人物与直立肌群人台之间交换视图。

- 3D 动作与肌群说明：帮助理解支撑、摆腿和身体控制，颜色表示教学位置与功能关联。
- 训练库：按徒手、居家和健身房场景选择练习，查看要点、常见错误与安全提醒。
- 跟练计时：准备、工作、休息与完成；切到后台后暂停，回到前台可手动继续。
- 学习路径与本地记录：记录自己的训练和自评，逐步安排练习。
- 离线使用：模型、训练图和内容随安装包提供，无需账号；设置和记录保存在本机。
- 深浅主题：支持深色、浅色与跟随系统。

动作与肌群色区是教学示意，自评和练习记录不会自动证明技能达标。内容不能替代教练现场指导或医疗建议；出现疼痛、不适或疲劳时应停止练习。

### 首版更新说明

首个 iOS 版本：离线 3D 托马斯动作、肌群详情、训练库与计时、学习路径、本地记录及深浅主题。

## 给 App Review 的说明草稿

本应用无需注册或登录，没有广告、内购或订阅。首次启动点击“开始”，阅读安全说明并点击“我知道了”即可使用全部功能。

首页展示安装包内的 3D 动作。暂停后点击“点选肌群查看详解”，选择肌群进入详情；点左下方的小人台卡片可交换动作人物与肌群人台，返回后仍保持同一暂停帧。详情底部可选择徒手、居家或健身房训练；训练内容、计时、记录和学习路径由 Flutter 原生界面提供。

3D 渲染使用 WKWebView。`127.0.0.1` 是设备内临时端口的本地资产服务，仅加载安装包内的模型与脚本，不访问外部站点或上传用户数据。应用不申请相机、麦克风、位置或 HealthKit 权限。

Apple 开发者账号、Team、签名材料与审核联系信息只保留在本机或 App Store Connect，不写入 Git。本文没有填写个人联系信息。

## 隐私与年龄分级核对

- 当前源码没有账号、分析、广告或远程数据上传；本地设置与训练记录通过 `shared_preferences` 保存。S2 签名包的四份隐私清单均可解析、不追踪、不收集数据；App 的 UserDefaults 理由 CA92.1、插件的 1C8F.1，以及 Flutter 的 FileTimestamp/SystemBootTime 理由已复核。最终 App Privacy 还要结合真机网络证据，详见 [验包核查](ios-verification-2026-10-10.md)。
- 年龄分级按实际健身教学内容填写 Apple 问卷，包含健康/健身主题；最终评级由 Apple 计算，不预设 4+，不选择 Made for Kids。
- 训练图和品牌图在现有来源文档中仍标有发布前授权核对事项；最终提审前由素材提供者确认发布权。已保留 Snow、Human Base Meshes、Three.js 等署名和许可入口。

## 截图与候选包

已取得四种 iPhone 模拟器 × 深浅主题 × 五页面的 40 张真实原生截图，包含实际 WKWebView 3D。保留 PNG 原件和无透明 JPEG；未缩放或合成，不使用关闭 3D 的组件测试截图作为商店素材。本机为 `~/ios-release-artifacts/flare-v1-20261009/screenshots/`，`screenshot-manifest.json` 记录逐张尺寸与哈希，不入 Git。截图来自初始产品 `63e45e8` 的就绪页面；后续加载与系统减弱动效修复另以原生流程/录像核对，默认动效下的就绪页面素材继续复用，没有重拍全部截图。

按 [Apple 当前截图规格](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/) 准备中尺寸灵动岛 iPhone 的 1206×2622 截图；另提供 Pro Max 的 1320×2868 截图。格式为无透明通道的 JPEG；最终以提交界面的要求复核。

用户授权后已在当前中尺寸灵动岛 iPhone 槽位保存 10 张 `screenshots/pro/` 的 1206×2622 原图，浅色五页面后接深色五页面。重新加载页面为 `10/10`，服务器截图集 `APP_IPHONE_61` 中十张均为 `COMPLETE`、无错误，文件名顺序、大小和原始文件校验和一致。本机 `app-store-screenshot-server-evidence.json` 记录核对结果，`app-store-draft-saved-20261010.json` 记录已保存字段。图片没有缩放或合成，40 张 PNG/JPEG 与原始 manifest 保留。名称 9 / 30、副标题 13 / 30、关键词 36 / 100 字符，按 [Apple 产品页说明](https://developer.apple.com/app-store/product-page/) 预检；描述、关键词、副标题、两项分类、支持/隐私网址和版本均经重新加载或重开编辑框核对。

当前候选 S2 源为 `a4ef59fdf8e6d6c9dd005aba55debbb80ab667a9`，身份 `dev.mhgd.flare / 1.0.0 (1)`；本机 `candidate/Flare-1.0.0-build1-app-store-S2.ipa` 为 50,642,770 字节，SHA-256 `87d58c73f058ab6ef5f4fd4030af4b602bea65c93971c69db9978774cd40129f`。严格深度验签、明确的分发描述文件/实际证书、三个 arm64 执行文件及四份隐私清单通过；Apple `altool --validate-app` 退出 0。S1 的静态验包曾通过，但被 Apple 以 `assets/data/import_content.py` 未签名报 90035 拒绝，因此未上传。S2 仅修改资产声明，排除该 Python 文件与 `stages-source.ts`，两份源码仍保留在仓库；249 份 Flutter 资源中 245 份与 S1 哈希相同，其余为资产清单和重建的 MaterialIcons 字体。旧 S1/C01–C03 与证据继续保留。

创建 App 时 Apple 提示访问设置保存失败，但确认 App 已创建、所有团队用户可访问，与所选“完全访问权限”一致。当前 [Flare 托马斯 Apple App](https://appstoreconnect.apple.com/apps/6821186142/distribution/info) 为商店版本 `1.0.0`、准备提交；授权范围内的商店字段和截图已保存。S2 哈希与原授权 S1 不同，用户另外明确批准后已上传；Apple Build 1 为 VALID，TestFlight 页面为准备提交、尚未分发。TestFlight 分发、最终合规声明、正式审核与发布分别确认，真机与素材发布权等门禁继续保留。

先完成无需真机的验证，再由用户连接 iPhone。构建、上传处理、TestFlight 可安装和正式 App Review 是不同状态，逐项登记在 [iOS 执行台账](ios-plan-2026-10-09.md) 与 [版本台账](version-ledger.md) 中。账号、签名和联系信息不写入 Git。

参考：[Flutter iOS 发布流程](https://docs.flutter.dev/deployment/ios)、[Apple 年龄分级问卷](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/)。
