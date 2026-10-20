# iOS 获批核对与发布准备（2026-10-20）

Apple审核完成通知已确认，尚未执行手动发布。当前阻塞为指定Playwright浏览器被其它实例占用，无法实时读取App Store Connect版本/Build绑定、供应地区和发布按钮。

## 本次已核对

- Apple通知时间为北京时间2026-10-20 08:12:29，标题为“Review of your Flare 托马斯 (iOS) submission is complete.”；正文列明获批App Version 1.0.0 for iOS，可分发。邮件通过已连接Gmail只读检索/读取，不保存原始邮件、个人信息或邮件头。
- 通知的submission ID与本机10-11脱敏正式提审回执一致。该次冻结候选为S4 / 1.0.0（3）/ `dev.mhgd.flare`，产品源 `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`；不是TestFlight Build7或本地Build12。
- 原IPA未重新构建：50,089,798字节，SHA-256 `8cf1ec14b009dce4120edde85574ac732d2445128767bb41bd0d848c11b9493f`。本次执行技能的`verify_ipa.sh`通过：Bundle/版本/Build匹配、严格深度验签、arm64、get-task-allow=false、4份隐私清单语法通过。
- 技能preflight以实际`app/`项目目录运行通过；工作副本干净、Xcode26.6、签名身份存在。无新增构建、证书/profile下载或IPA上传；当前本地Build12的功能验证不能替代获批S4身份。
- 指定Playwright MCP两次`browser_tabs`均报`Browser is already in use`，目录为`/Users/shengkai/.local/share/ugk-browser/chrome-profile`。未删除锁文件、复制profile/Cookie或关闭占用进程。现有桌面Chrome备用连接不能读取该自动化实例的App Store Connect会话。

## 待完成

1. 释放占用连接后，继续复用指定Playwright持久浏览器，核对当前Apple账号/目标App、版本1.0.0绑定Build3、Pending Developer Release状态、免费/供应地区及账户阻挡。
2. 向用户交付精确候选与实际供应范围，在最终手动发布前确认；执行后回读Apple状态并核对公开商店可见性。
3. 未完成前不将“获批通知”“发布请求已提交”和“公开可下载”混记为同一状态。

用户本次请求为“app好像ios审核通过了 帮我推进发布”。本次已推进只读核对和本地发布准备；没有执行Apple写入、手动发布、远端Git操作或后台自动化。旧验收限制继续见[正式提审记录](ios-app-review-submission-2026-10-11.md)。原免费/175地区是10-11历史配置，本次未实时复核，不将其当作当前最终供应结论。

Apple官方流程：[手动发布版本](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/select-an-app-store-version-release-option/)；获批手动发布版本需处于Pending Developer Release，正式发布后商店传播可能需要最多24小时。
