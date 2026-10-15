# Flare TestFlight 新构建与安装恢复验证（2026-10-15）

按用户交接，仅推进Flare新构建上传、原内部测试分发及消费者实际下载安装；未授权正式App Review或公开发布。当前已完成构建、验包、单次上传和原内部组分发，Apple为 **VALID / IN_BETA_TESTING**；实际手机安装尚待后续验证，不能据此写成本App安装已恢复。

## 项目与固定候选

| 项目 | 已核对事实 |
| --- | --- |
| App / Bundle / ASC | Flare 托马斯 / `dev.mhgd.flare` / `6821186142` |
| worktree / 分支 | `/Users/shengkai/.codex/worktrees/pr8-audit/3D-Flare` / `ios/main`；原工作区干净，主目录未修改 |
| 产品源 | `9e7125b559c4a8f0de3f93f8f1e19ccf882997f3`；生产实现为`0e6185f`的L44，原Build5/6安装与历史候选保留 |
| 新候选 | `1.0.1 (7)`；用iOS CLI构建号override7，公共pubspec的Build6保持 |
| IPA | 81,875,246字节 / SHA-256 `7fabf23ec2c521825cf1705d6843ef4434f1815b4f142886c8392f4b22613005` |
| 签名 | App Store分发，实际证书属于描述文件且同Team，Team与当前ASC目标一致，profile未过期，无设备清单或企业标记，get-task-allow=false / beta-reports-active=true |
| 架构 / 隐私 / 资产 | Runner/App/Flutter均arm64；4份隐私清单可解析；51视频和51封面逐项哈希与验证过的源一致 |
| 验证 | 10-15 analyze无问题、154项相关测试通过；4项真实WKWebView集成保持10-13同生产源结果；严格IPA验包及Apple在线校验退出0 |
| 上传 | 仅一次 `altool --upload-package` 调用，退出0；平台上传时间北京时间 **2026-10-15 08:04:06** |
| Delivery | `cecd0bce-6ecf-4369-9c21-8f290c92132a`，平台App内1.0.1(7)上传记录与回执一致；已COMPLETE，构建VALID、expired=false、usesNonExemptEncryption=false；处理无错误/警告 |
| 原内部组 | “Flare iOS v1”，内部组、非自动分发，1名已ACCEPTED测试员；精确Build7已关联并回读IN_BETA_TESTING，未删除/重邀或创建外部组 |
| 手机更新前 | iPhone16 Pro / iOS26.5，已安装开发签名1.0.1(6)，原偏好已私密备份；TestFlight显示Flare旧1.0.0(3)待安装，不将按钮存在当作安装通过 |

## 检查与操作记录

- 目标App、Bundle、ASC记录及现有签名Team在当前登录页面/API回读一致。平台旧1.0.0(3)/Build1均VALID、expired=false，原内部组仍在测试；这是10-15重读，不沿用10-11过期观察，也不证明旧包消费者安装已恢复。
- 指定Playwright Chrome配置初始被占用，未自行杀进程或另开配置。用户随后明确授权“你可以关闭后自己使用”，据此仅向匹配专用配置的单一Chrome主进程发送TERM，再经原Playwright MCP接入。登录过期后由用户本人登录，未读取Cookie/Token/storage，未代输密码/MFA。
- 使用本App现有缓存签名、Flare发布配置和既有上传凭据；未注册/下载证书/profile、未传allowProvisioningUpdates。准备Release配置、Xcode实际归档、导出App Store IPA并验包；未改业务逻辑或重新建立App记录。
- 在线校验和上传均出现Apple HTTP500状态更新错误，工具在同次进程中重试后均退出0。未增号、重传或以错误日志冒称根因；完整脱敏边界与原始日志仅保留私密目录。
- 上传前后IPA哈希相同。新候选只用于TestFlight，未绑定/更换已送审S4商店版本、取消审核、提交正式审核或公开发布，也未push。
- 镜像曾实际显示TestFlight列表与Flare旧Build3；随后连接中断，重试显示“未找到iPhone”，已请本人将手机放近Mac、解锁一次再锁屏。此为镜像连接前提，尚未执行新包消费者安装。

私密产物、回执、偏好、签名和UI截图位于 `/Users/shengkai/ios-release-artifacts/flare-testflight-recovery-20261015`；候选manifest绑定source/version/build/hash。真实账号、设备标识、API凭据、用户记录不进Git。Wrist的安装通过仅作交接背景，不外推为Flare已恢复。

## 内部分发回读与手机待验

Apple于10-15处理完成；在精确1.0.1(7)页面保存简体中文测试说明（233字符，含明确Build7身份），选择原“Flare iOS v1”内部组并点击添加一次。页面显示群组(1)/内部/测试员1；服务端回读Build7为VALID、expired=false、usesNonExemptEncryption=false、IN_BETA_TESTING，betaBuildLocalizations与准备文本逐字相同。未填写新的合规答案，既有构建自身的非豁免加密标志为false。外部状态仍READY_FOR_BETA_SUBMISSION，未提交外部Beta或正式审核。

镜像再次尝试仍未找到手机；用户随后明确回复“手机不在了 我来远程测试”，故改由本人远程进行消费者验证，不继续等待Mac镜像连接。当前尚无新包安装结果，不能写“Flare本次TestFlight安装恢复”。下一步由本人在实际手机TestFlight确认Flare托马斯1.0.1(7)，完成下载/安装→打开→首次测试说明/首页，并报告实际版本、安装及启动结果；按本人报告记录，不能冒称Agent独立观察。发生新失败时保留错误，不无差别增号重传。长期设备/完整功能矩阵与既有28项素材QA提示保持原待办。
