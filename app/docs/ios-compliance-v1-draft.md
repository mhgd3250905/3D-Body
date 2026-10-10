# iOS v1 合规问卷复核草稿

2026-10-10：以下为本机准备的填写提案，尚未保存或发布 Apple 最终声明。产品源固定为 `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`，候选 S4 为 `dev.mhgd.flare / 1.0.0 (3)`；IPA 50,089,798 字节，SHA-256 `8cf1ec14b009dce4120edde85574ac732d2445128767bb41bd0d848c11b9493f`。Apple 当前实际交付仍是 S2 Build 1；精确 S4 上传、草稿绑定及内部组更新已请求授权，待用户回复。

通过指定 Playwright 配置只读打开了本 App 的年龄、内容版权、医疗设备及数据收集对话框，四个初始表单均未选中任何答案，随后取消或关闭，没有点击保存、完成或发布。年龄问卷的前八个功能字段来自实际第 1 步；其余类别按 [Apple 当前分类定义](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/)准备，后续以实际表单为准。

## 年龄分级提案

| 字段 | 拟填写 | 实现与内容依据 |
|---|---|---|
| 家长控制 | 否 | 没有监护人限制儿童内容的控件；安全确认不是家长控制 |
| 年龄保证 | 否 | 没有年龄验证、年龄估计或 Declared Age Range API |
| 不受限的网页访问 | 否 | 3D WebView 的导航被限定为本机资产服务的相同 scheme/host/port，无通用浏览器 |
| 用户生成内容 | 否 | 训练与自评仅本机保存，没有向其他用户广泛分发的功能 |
| 社交媒体 | 否 | 没有动态、关注、评论或内容传播 |
| 禁止未满 13 周岁的用户使用社交媒体 | 否 | 没有社交媒体功能，也没有该年龄限制机制 |
| 信息和聊天 | 否 | 没有用户之间的通信 |
| 广告 | 否 | 没有广告展示或广告 SDK |
| 亵渎或粗俗幽默 | 无 | 当前教学、训练及安全文案未见对应内容 |
| 恐怖或恐惧主题 | 无 | 人物、动作与训练内容用于健身教学 |
| 使用或提及烟、酒或毒品 | 无 | 当前内容未见对应主题 |
| 医疗或治疗信息 | 无 | 不作诊断；剂量注明教学建议、非医疗处方，疼痛操作为停止训练和记录 |
| 健康或健身主题 | 是 | 51 项训练、剂量、动作学习及安全提醒属于运动建议 |
| 成人或暗示性主题 | 无 | 当前产品未见成人情节或暗示性内容 |
| 色情或裸露内容 | 拟无，发行者复核完整画面 | 现有原生截图中的人物为着装运动人物或中性教学人台，无性行为、明确性器官或成人内容 |
| 露骨的色情或裸露内容 | 无 | 当前产品未见对应内容 |
| 卡通或幻想暴力 | 无 | 动作学习与肌群位置示意不包含攻击或冲突 |
| 现实暴力 | 无 | 当前产品未见对应内容 |
| 长时间露骨或施虐的现实暴力 | 无 | 当前产品未见对应内容 |
| 枪支或其他武器 | 无 | 当前训练内容未见武器 |
| 模拟赌博 | 无 | 没有下注或模拟赌博 |
| 竞赛 | 无 | 课程关卡与本人自评不提供用户之间的排名、奖励或竞赛 |
| 赌博 | 否 | 没有真钱或可兑换真钱的下注 |
| 战利品箱 | 否 | 没有付费随机物品 |
| 年龄类别与覆盖 | 不适用 | 不申请 Made for Kids；当前没有自定义 EULA 最低年龄要求 |
| 年龄适用性网址 | 留空 | 当前没有专门说明年龄适用性的已发布网址 |

“健康或健身主题”根据运动功能填写为“是”，不是把所有内容频率均填为“无”。最终评级由 Apple 按答案、地区及系统版本计算，本草稿不填写最终年龄数字。参见 [设置年龄分级](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/)。

实现依据：[本机资产服务](../lib/platform/scene/scene_asset_server.dart)、[原生 WebView 导航边界](../lib/platform/scene/scene_view_native.dart)、[本地数据](privacy-local.md)、[训练内容](../assets/data/drills.json)及 [ARB 安全文案](../lib/l10n/app_zh.arb)。画面复核使用保留的真实商店截图，不把其早期 source state 说成 S4 重新取证；S4 的模型、图像与场景资源没有变化，具体比较见 [验证记录](ios-verification-2026-10-10.md)。

## 内容版权提案

拟选实际表单中的“是，它包含、显示或会访问第三方内容，并且我拥有相应内容的必要版权”。App 包含 Snow、Human Base Meshes、字体及第三方软件，来源、许可与修改署名见 [资产来源](asset-sources.md)和随包 `assets/licenses/`。训练图和品牌图的发布权来自用户 2026-10-10 明确确认。

这一提案包含发行者的权利确认，不能用“模型免费”代替许可核对；也不能选“不包含第三方内容”。[Apple 内容版权要求](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information)以所有供应地区所需权利为准，最终选项须由发行者复核授权后保存。

## 受监管医疗设备提案

当前 App 属于“健康健美”分类，供应地区包含美国、英国及 EU/EEA，因此需要完成此声明。实际对话框询问“你的 App 是否在任何国家或地区属于受监管的医疗设备？”，当前无选中答案。要求依据为 [Apple 医疗设备声明说明](https://developer.apple.com/help/app-store-connect/manage-app-information/declare-regulated-medical-device-status)。

基于当前产品用途，拟选“否”：它用于离线动作学习与训练记录，不提供疾病诊断、疾病监测或治疗，不连接医疗硬件，疼痛标记是用户主动停止练习的记录。这是填写提案，尚未代发行者作正式声明；若发行者的实际医疗用途或认证事实不同，应在保存前修正。

## App Privacy 提案与真机门禁

实际起始问题为“你或你的第三方合作伙伴是否会从此 App 中收集数据？”，拟选“否，我们不会从此 App 中收集数据”。此提案目前依赖源码、SDK/归档核查及本地资源证据，最终保存和发布仍须等待精确获准候选的 TestFlight 真机流程与流量核验。

| 数据或路径 | 当前实现 | 最终复核 |
|---|---|---|
| 设置、安全确认、今日训练、会话、课程、关卡和自评 | `flare.learning.v1`，SharedPreferences 存于当前设备 | 使用测试记录检查训练、保存与冷启动期间的实际流量 |
| 疼痛标记 | 用户主动记录到本机会话；不作诊断 | 确认没有向开发者或第三方上传该字段 |
| 3D、图像、字体与运行数据 | 安装包资源，经设备内 127.0.0.1 加载 | 检查完整流程中的外部目的地，并验证飞行模式核心流程 |
| 复制本地备份 | 用户点击后复制 JSON 到系统剪贴板，没有 App 备份服务器 | 使用测试数据；剪贴板或用户自行保存的副本由用户与系统管理 |
| 第三方代码与系统服务 | 当前未初始化广告、分析或远程记录 SDK；四份隐私清单已核查 | 结合实际最终 Release 路径检查；仅凭清单空数组不能完成声明 |

Apple 区分只在设备上处理的数据和可由开发者或合作方访问的设备外传输；WebView 也需要纳入实际数据流核对。参见 [App Privacy 官方定义](https://developer.apple.com/app-store/app-privacy-details/)。公开政策的精确修订见 [政策草稿](privacy-policy-ios-v1-draft.md)，已准备但未获准部署。本轮未保存数据收集答案、未发布隐私标签。

## 账户与地区的当前事实

| 项目 | 2026-10-10 平台只读观察 | 后续处理 |
|---|---|---|
| EU DSA | 当前 App 页面显示开发者已表明不是此 App 的交易商，并提供开始处理合规要求的入口 | 沿用的是现有平台状态；交易者身份仍由发行者根据实际经营事实复核，本轮未改账户或 App 声明 |
| 中国大陆 App 备案 | 页面显示 ICP 说明及“设置”入口，未见已保存号 | 备案适用性和本 App 的有效资料待核对；不复用其他 App 或网站号，也不因选中供应地区就认定已满足许可要求 |
| 免费及地区选择 | 已授权保存免费和 175 个地区供应 | 这是供应设置；实际可上架地区还受最终评级及适用许可状态约束 |
| 数字商品与服务问卷 | 当前已加载的 App 信息页未显示此区域或入口 | [Apple 说明](https://developer.apple.com/help/app-store-connect/manage-app-information/complete-the-digital-goods-and-services-questionnaire)规定未出现该问卷时无需操作；本轮未填支付选项或接受新协议 |

DSA 自评与联系方式要求见 [Apple DSA 说明](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/)。中国大陆条件性许可要求见 [App 信息](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information)及其链接的[工信部 App 备案通知](https://www.miit.gov.cn/zwgk/zcwj/wjfb/tz/art/2023/art_920db564162e4312916a01bed6540ad8.html)。目前没有取得本 App 的备案资料或豁免证据，不把空字段直接推断成所有 App 都必填，也不将其记作已通过。

## 最终操作边界

先完成已请求的精确 S4 上传与内部测试更新、公开政策更新；按用户要求完成无需真机的准备后，再安排真实 TestFlight 安装与设备证据。最终年龄、内容版权、医疗设备及 App Privacy 声明由发行者复核并另行授权；正式 App Review 与手动公开发布继续分别确认。S4、公开政策及最终声明当前均未执行相应平台写入。
