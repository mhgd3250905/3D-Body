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

2026-10-11 初次连接时，指定 Playwright profile 被占用，未能刷新平台记录。随后用户明确授权接手，浏览器连接已恢复；构建与内部组的今日复查见下节，前一日其他平台记录仍保留原核查日期。

目前只有一台手机和一个测试账号，媒体与购买项目账号一致来自用户确认。历史测试列表的 Water Box 与手腕训练助手均显示“已移除 Build”，不能作为有效构建对照。用户解释此前曾因持续失败反复排查，旧构建过期记录不独立作为 Apple 后台自动失效的证据。

Flare 的代码和本机资产服务尚未运行，故此失败不来自运行期间的 3D、计时或本地数据逻辑。安装资格、构建分发关联或 Apple 后台的哪项异常仍需平台确认，不能据此证明开发者账号所有 TestFlight 安装路径均失效。

Apple 论坛有[相同 404 的开发者报告](https://developer.apple.com/forums/thread/849154)，该报告另有外部测试提交返回 `ENTITY_UNPROCESSABLE.BETA_CONTRACT_MISSING`。本账号尚未取得该错误，Beta Contract 仅是调查线索；未提交外部 Beta Review 进行探测。

## 2026-10-11 恢复浏览器与核对等待窗口

用户提供了此前 Apple 开发者支持的处理回复：要求至少等待 48 小时后上传另一个新构建。邮件接收时间由用户报告为北京时间 2026-10-08 10:32；据此截止时间为 2026-10-10 10:32。

本机上传回执的 `uploadedAt=2026-10-10T06:42:37.531895+00:00` 对应北京时间 14:42:37，S4 上传比截止晚 4 小时 10 分 37 秒；14:44:43 确认处理为 VALID。这证明 S4 上传在所提供邮件的等待窗口之后，但不能据此证明 Apple 后台问题已修复。

用户明确授权接手指定浏览器后，只向该配置对应的 Chrome 主进程发送正常终止信号，保留配置目录与登录资料；本机 Playwright MCP 重新连接同一配置，App Store Connect 登录恢复。今日直接读取平台响应确认 S4 Build 3 为 VALID、未过期、最低 iOS 15.0、IN_BETA_TESTING；原内部组仍为内部组、自动分发关闭，仅一名测试员且状态 ACCEPTED。会员与 Free/Paid Apps 协议的核查日期仍为 2026-10-10，未将其改写为今日复查。

原支持案例的文字留言入口可访问。用户已批准下方 858 字符正文；2026-10-11 填入后，页面显示剩余字符数 -508、要求缩短文字且 Submit 禁用，实际限额为 350 字符。超限原文未点击提交；随后获批的精简稿发送结果见下节。案例编号、私人留言链接与账号信息不写入 Git。

## 原案例补充留言草稿（未发送）

以下精确正文已获用户批准，仅包含脱敏的应用身份、构建/设备信息、时序和错误证据；因表单字符限制尚未提交。

Jasmine，您好：

谢谢此前的调查处理。您在 2026 年 10 月 8 日的回复中要求等待至少 48 小时后上传新构建。邮件于北京时间 10 月 8 日 10:32 收到，等待窗口截止于 10 月 10 日 10:32。

我们已于北京时间 10 月 10 日 14:42:37 成功上传新的 Flare 托马斯 1.0.0 (3)，比截止时间晚 4 小时 10 分 37 秒；14:44:43 确认处理完成。10 月 11 日再次核查，构建仍为 VALID、未过期、IN_BETA_TESTING；内部组只有一名测试员，状态 ACCEPTED，自动分发关闭。

但在 iPhone 16 Pro / iOS 26.5 / TestFlight 4.4.0 上仍无法安装，提示“所请求的 App 不可用或不存在”。App Apple ID：6821186142；Bundle ID：dev.mhgd.flare。

北京时间 2026-10-11 08:59:33–08:59:35 的真机日志显示：
https://testflight.apple.com/v2/accounts/<redacted>/apps/6821186142/builds/<redacted>/install
HTTP 404
serverFailureReason=Error Downloading Install Data
previousPhaseDescription=ProcessingInstallInitiateResponse

App 未安装完成或启动。同一测试员此前也报告本账号其他 App 有相同提示；目前仅一台手机和一个测试账号，影响范围尚未确定。

请继续调查原案例，核查此 App、开发者账号与内部测试员的安装分发关联，并检查 Beta Contract 是否完整且正确关联。论坛中有类似 404 的报告，但我们尚未取得 BETA_CONTRACT_MISSING，具体根因仍需贵团队确认。谢谢。

原文发送授权已取得。网页未设置 HTML maxlength，但应用层在输入后进行字符限额检查；不能以移除 disabled 或绕过网页校验发送超限正文。

## 限额内精简稿（349 字符，已授权并发送成功）

精简稿保留超过 48 小时后的上传时序、今日构建/测试员状态、应用与设备身份、真实安装 404 和根因未定的边界。完整日志与原文保留在上文。用户已明确批准此精确正文，授权继续有效；额外私人账号资料或完整诊断附件另行核对范围。

```text
Jasmine您好：10月8日10:32收到回复，依要求等待48小时后，于10月10日14:42:37上传Flare托马斯1.0.0(3)，处理完成。10月11日仍VALID、未过期、IN_BETA_TESTING，一名ACCEPTED内部测试员。
App ID 6821186142；dev.mhgd.flare。
iPhone16Pro/iOS26.5/TestFlight4.4.0于10月11日08:59:33–35安装仍提示App不可用；/install返回HTTP404，Error Downloading Install Data，App未安装或启动。目前仅一台手机、一个测试账号。以上均北京时间。
请核查安装分发关联及Beta Contract；尚无该项错误证据，根因未确认。谢谢。
```

### 2026-10-11 提交与认证结果

北京时间 11:04:02，核对输入与批准的 349 字符正文完全一致且 Submit 可用后，点击提交一次。结果页面计数为剩余 1 字符。原案例的 `POST /api/v1/uploadTextMsg` 返回 HTTP 401：

```text
status=Unauthorized
code=401
description=Customer is not authorized to use this secure link.
context=LOGIN
```

页面显示 “We can't send your message right now. Please try again later.”，没有发送成功确认。此响应来自支持留言服务，与 TestFlight 安装接口的 404 是两个独立请求，不能把 401 当作安装根因。

重新加载原案例仍显示留言表单，无法仅凭表单可访问确认发送身份有效。按该页面公开前端源码提供的官方原案例登录入口，在同一指定 Playwright 配置中打开 Apple 登录页；实际登录框要求 Email or Phone Number 与 Password。用户随后完成登录并回复“我登录了”。未读取或填入密码、验证码，未清除浏览器登录资料；失败原因未消除前未重复点击或绕过验证。

北京时间 11:06:59，浏览器已从官方登录页返回原案例，确认无登录/验证码提示、精简稿与批准文本完全相同且 Submit 可用后，执行认证恢复后的提交一次。`POST /api/v1/uploadTextMsg` 返回 HTTP 200，`textCommitment=true`、无 `errorMessage`；结果页面明确显示 “Your message has been sent.” 和 “An Advisor will follow up with you.”。这是文本留言提交成功证据；响应的 `uploadSuccess=false` 不表示本次文字发送失败，未上传音频或附件。

已完成原案例的获准补充，不另开案例、不改用其他收件人、不重复留言。此成功只证明留言发送，不证明 Advisor 已阅读、Beta Contract 已确认异常或安装问题已修复。等待 Apple 针对原案例提供处理结果，再按实际回复执行定向验证；不因提交支持消息就重传构建或把 S4 记为真机安装通过。本机脱敏回执只保留时间、请求结果、文本长度/哈希与候选身份；私人案例编号、链接、账户、认证字段不写入 Git。

## 发布门禁

先恢复精确 S4 的 TestFlight 安装，再按 [iOS 执行台账](ios-plan-2026-10-09.md)完成真机首启、3D/手势、计时与记录、前后台/锁屏、离线和隐私网络检查。安装失败不记作这些功能失败或通过。

取得设备证据和发行者最终合规确认前，候选不是 DEVICE_VERIFIED 或 SUBMISSION_READY。本次没有更改产品、签名、构建编号、测试组或测试员，没有重传 IPA、提交外部测试或正式审核。
