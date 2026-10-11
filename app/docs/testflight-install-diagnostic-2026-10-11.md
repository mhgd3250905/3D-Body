# S4 TestFlight 安装诊断（2026-10-11）

已在真机复现安装失败：Apple 的 TestFlight 安装数据请求返回 HTTP 404，失败发生在安装发起响应阶段，Flare 尚未安装或执行。当前优先排查测试分发、账号与构建关联，具体后台根因尚未确认。

## 精确身份和设备

- 分支 `ios/main`；产品源 `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`。
- Flare 托马斯，Apple ID `6821186142`，Bundle ID `dev.mhgd.flare`。
- 冻结候选 S4：`1.0.0 (3)`；IPA 50,089,798 字节。
- IPA SHA-256：`8cf1ec14b009dce4120edde85574ac732d2445128767bb41bd0d848c11b9493f`。
- 已连接 iPhone 16 Pro / iOS 26.5；本机查询 TestFlight 为 4.4.0，用户早先的 3.3 报告已纠正。
- 用户授权使用已有 iPhone 镜像连接；实际界面显示 `1.0.0 (3) · 90天`，点击安装后提示“所请求的 App 不可用或不存在”。
- 安装尝试后，`devicectl device info apps --bundle-id dev.mhgd.flare` 精确查询结果为 0 个已安装 App。

## 直接捕获的安装响应

北京时间 2026-10-11 08:59:33 发起，08:59:35 返回。以下 URL 使用脱敏占位符。

```text
bundleID=dev.mhgd.flare version=1.0.0 (3)
https://testflight.apple.com/v2/accounts/<redacted>/apps/6821186142/builds/<redacted>/install
response code=404
FAILED: TFBundleInstallation for dev.mhgd.flare
serverFailureReason=Error Downloading Install Data
previousPhaseDescription=ProcessingInstallInitiateResponse
phase=Failed
userFailureReason=所请求的 App 不可用或者不存在。
```

随后 `/install/status` 返回 200，只表示失败结果上报请求成功。`TFError` 中的 `serverCode=200` 也不是安装数据请求的 HTTP 状态。AppleMediaServices 的 AMSErrorDomain 204 不能单独作为根因；其中 `clientIDDomains` 缺失日志明确说明没有功能影响。`buildGroup=(null)` 不能单独证明后台未配置内部测试组。

设备名、设备标识、邮箱、账号 URL 段、构建内部标识、凭据和完整日志不写入 Git。采集在进程内存中筛选并脱敏输出，未保存完整原始日志；采集已停止，最终查询确认运行中的 `idevicesyslog` 数为 0。

## 核查日期与结论边界

2026-10-10 平台只读核查确认：会员及 Free/Paid Apps 协议有效，无待接受协议提示；原指定账号为 Account Holder / Admin，测试员 ACCEPTED；内部组仅该账号，自动分发关闭；S4 VALID、未过期、IN_BETA_TESTING，最低 iOS 15.0，支持 iPhone；草稿绑定 Build 3，正式审核未提交。

2026-10-11 指定 Playwright profile 报告已被占用，未能刷新这些平台记录；没有换 profile、重置 Chrome 或读取会话凭据。今日真机界面和安装日志为新的直接证据，后台状态仍标记为前一日核查。

目前只有一台手机和一个测试账号，媒体与购买项目账号一致来自用户确认。历史测试列表的 Water Box 与手腕训练助手均显示“已移除 Build”，不能作为有效构建对照。用户解释此前曾因持续失败反复排查，旧构建过期记录不独立作为 Apple 后台自动失效的证据。

Flare 的代码和本机资产服务尚未运行，故此失败不来自运行期间的 3D、计时或本地数据逻辑。安装资格、构建分发关联或 Apple 后台的哪项异常仍需平台确认，不能据此证明开发者账号所有 TestFlight 安装路径均失效。

Apple 论坛有[相同 404 的开发者报告](https://developer.apple.com/forums/thread/849154)，该报告另有外部测试提交返回 `ENTITY_UNPROCESSABLE.BETA_CONTRACT_MISSING`。本账号尚未取得该错误，Beta Contract 仅是调查线索；未提交外部 Beta Review 进行探测。

## Apple 支持说明草稿（未发送）

**主题：有效内部 TestFlight 构建安装接口返回 HTTP 404，请核查测试分发关联**

内部测试员可在 TestFlight 看到 Flare 托马斯 `1.0.0 (3)`，显示剩余 90 天，但点击安装提示“所请求的 App 不可用或不存在”。

App Apple ID：`6821186142`；Bundle ID：`dev.mhgd.flare`。设备为 iPhone 16 Pro / iOS 26.5，TestFlight 4.4.0。直接复现时间为 2026-10-11 08:59:33–08:59:35（UTC+08:00；UTC 00:59:33–00:59:35）。

设备日志显示该 App 的 `/v2/accounts/<redacted>/apps/6821186142/builds/<redacted>/install` 返回 HTTP 404，原因 `Error Downloading Install Data`，前一阶段为 `ProcessingInstallInitiateResponse`。App 未安装完成或启动；失败结果上报接口返回 200。

2026-10-10 核查：构建 VALID、未过期、IN_BETA_TESTING；已加入内部组；测试员 ACCEPTED；会员及 Free/Paid Apps 协议有效，无待接受协议提示。同一测试员报告本开发者账号其他 App 曾有相同提示，尚未用其他手机、测试账号复现，影响范围未确定。

请由 App Store Connect / TestFlight 团队核查此 App、开发者账号与内部测试员之间的安装分发关联，并检查 Beta Contract 是否完整且正确关联。论坛有相同 404 与 Beta Contract 异常同时出现的报告，但本账号未取得 `BETA_CONTRACT_MISSING`，请根据后台记录确认实际原因。

以上仅为脱敏草稿，未联系 [Apple 开发者支持](https://developer.apple.com/contact/)，未向第三方发送日志或附件。发送需用户单独授权；若需要私人账号资料或完整诊断附件，另行核对范围。

## 发布门禁

先恢复精确 S4 的 TestFlight 安装，再按 [iOS 执行台账](ios-plan-2026-10-09.md)完成真机首启、3D/手势、计时与记录、前后台/锁屏、离线和隐私网络检查。安装失败不记作这些功能失败或通过。

取得设备证据和发行者最终合规确认前，候选不是 DEVICE_VERIFIED 或 SUBMISSION_READY。本次没有更改产品、签名、构建编号、测试组或测试员，没有重传 IPA、提交外部测试或正式审核。
