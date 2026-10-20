# iOS 获批核对与发布准备（2026-10-20）

Apple审核完成通知及App Store Connect实时页面均已确认，尚未执行手动发布。浏览器占用已按用户授权解除；当前页面停在“发布此版本”按钮前，等待精确候选的最终公开发布确认。

## 本次已核对

- Apple通知时间为北京时间2026-10-20 08:12:29，标题为“Review of your Flare 托马斯 (iOS) submission is complete.”；正文列明获批App Version 1.0.0 for iOS，可分发。邮件通过已连接Gmail只读检索/读取，不保存原始邮件、个人信息或邮件头。
- 通知的submission ID与本机10-11脱敏正式提审回执一致。该次冻结候选为S4 / 1.0.0（3）/ `dev.mhgd.flare`，产品源 `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`；不是TestFlight Build7或本地Build12。
- 原IPA未重新构建：50,089,798字节，SHA-256 `8cf1ec14b009dce4120edde85574ac732d2445128767bb41bd0d848c11b9493f`。本次执行技能的`verify_ipa.sh`通过：Bundle/版本/Build匹配、严格深度验签、arm64、get-task-allow=false、4份隐私清单语法通过。
- 技能preflight以实际`app/`项目目录运行通过；工作副本干净、Xcode26.6、签名身份存在。无新增构建、证书/profile下载或IPA上传；当前本地Build12的功能验证不能替代获批S4身份。
- 指定Playwright MCP两次`browser_tabs`均报`Browser is already in use`，目录为`/Users/shengkai/.local/share/ugk-browser/chrome-profile`。未删除锁文件、复制profile/Cookie或关闭占用进程。现有桌面Chrome备用连接不能读取该自动化实例的App Store Connect会话。

## 浏览器恢复与实时复核（北京时间08:48–08:50）

用户明确授权“操作关闭接手”后，仅向确认使用指定profile的Chrome主进程发送SIGTERM，保留profile内容，不删除锁文件/登录态，不结束其它Chrome或MCP服务。Playwright MCP重连成功，初始标签为about:blank；打开既定App后原登录态自动恢复，无需输入凭据。已核对登录账号与目标App正确，账号私密信息不写入台账。

- 目标App：Flare 托马斯 / ASC6821186142，版本1.0.0，构建表明确关联Build3 / 1.0.0。
- 状态：**等待开发者发布（Pending Developer Release）**；“手动发布此版本”仍选中，“发布此版本”按钮可用，未点击。
- 价格：当前175个国家或地区的价格表逐行读取，175行全部为零，中国大陆为¥0.00；未变更价格。
- 供应：摘要显示“175个可用”，明细包含中国大陆；Mac“提供此App”和Vision Pro供应复选框均未选中。此处记录Apple当前配置，不替代各地区最终公开下载复核或补记ICP资料结论。
- 页面未显示新增发布阻挡；没有保存元数据、变更账户声明、地区、价格或商店候选。

## 待完成

1. 用户确认发布精确S4 / 1.0.0（3），按当前免费/175地区配置公开发布。
2. 执行一次“发布此版本”及确认后，回读Apple状态、记录时间，再核对公开商店可见性；不得将发布请求当作已经公开可下载。

用户本次请求为“app好像ios审核通过了 帮我推进发布”。本次已推进只读核对和本地发布准备；没有执行Apple写入、手动发布、远端Git操作或后台自动化。旧验收限制继续见[正式提审记录](ios-app-review-submission-2026-10-11.md)。免费/175地区已在本次实时页面复核；最终公开供应仍以发布后的商店结果为准。

Apple官方流程：[手动发布版本](https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/select-an-app-store-version-release-option/)；获批手动发布版本需处于Pending Developer Release，正式发布后商店传播可能需要最多24小时。
