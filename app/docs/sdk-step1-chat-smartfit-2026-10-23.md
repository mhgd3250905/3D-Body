# 第 1 步补充：SmartFit 对话结构对齐

用户在 SDK 基础检查点 `c8a023d` 后补充：第 1 步直接对齐 SmartFit 的 AI 对话结构及交互，`ask_user` 另外实现为可复用组件；第 2 步才调整 FlareLab 品牌视觉。此补充仍在 `codex/flarelab-sdk-agent-trainer` 分支完成，内测包另存 **1.0.10+13**，原 +12 包保留。未经用户同意不合入或推送，第 2 步尚未开始。

## 参考与边界

参考仓库 `mhgd3250905/Sport-Helper`，本机 `E:/AII-3D/3D-Sport-AI/Sport-Helper-media-cache`，当前 HEAD `5faba74ba22edbefc7d2e69ffba5a50ffcc2ad57`。主要参考 `lib/ui/chat/chat_home_page.dart`、`chat_widgets.dart`、`plan_card.dart`、`action_card.dart`。这些均为 App 自绘界面，SDK 提供 Agent 和校验后的计划/动作数据。本次没有复制或修改 SDK 源码。

SmartFit 工作区另有未提交的固定玻璃实验，本次保持其文件不变；列表材质依据已保存的静态卡片方案。FlareLab 沿用现有浅深主题与橙色强调，不复制 SmartFit 的薄荷/青绿色。列表卡片不使用 `BackdropFilter`，不在视频或 3D 上叠加模糊。

## 结构与交互对照

| 部分 | 对齐要求 | FlareLab 保留边界 |
| --- | --- | --- |
| 消息 | 左右限宽气泡、稳定身份、按项重绘隔离 | 原对话返回、取消与恢复机制 |
| 输入与建议 | 固定底部横滑建议、胶囊输入、输入状态决定发送可用性 | 场景建议仍指向托马斯训练，不扩大动作范围 |
| 计划 | 默认紧凑媒体卡、原位展开、单一开始入口、展开后可保存 | 使用 SDK 校验计划，仍保存到“我的计划” |
| 动作 | 有封面、名称、说明的推荐卡 | 只展示 App 已有动作和视频，原详情入口 |
| 加载 | 轻量活动提示、真实 Agent 工具阶段、取消 | 不用模拟进度冒充实际工具执行 |
| `ask_user` | 与助理气泡一致，文字、单选、多选及自由输入 | 仅显示 `send()` 返回已提交的问题，busy 时禁止重答 |

## 可复用提问组件

`lib/ui/coach_question_bubble.dart` 仅依赖 Flutter 和 `ugk_coach` 的公开问题类型，通过参数接收语义颜色、提示文案及回答回调，不依赖 FlareLab 路由、存储或品牌主题。SmartFit 可复用组件后传入自身参数；会话、取消与 SDK 提问预算由宿主管理。

## 截图来源

SmartFit 对照采用 2026-10-23 已保存的真实 `SmartFitApp` / `PlanCard` widget 渲染图，逻辑视口 390×844、DPR 3，**不是手机截图，也不是本轮重新运行 SmartFit**。图片与参考仓库 HEAD 中的字节一致，出处及 SHA 见 [来源记录](evidence/sdk-step1-chat-20261023/reference-source.json)。这种渲染图不能用于原生 Raster 性能判断。

FlareLab 对照使用本轮实际 Flutter Web 构建，同逻辑视口分别检查浅深主题。用于稳定视觉对照的 SDK 工具响应样例与真实 AI 请求验证分别记录，避免把固定样例称为新一轮真实模型结果。

## 验证与内测包

本轮对话专项 **54/54 通过**：`ai_coach_test.dart`、`ai_coach_review2_test.dart`、`coach_question_bubble_test.dart`。覆盖原在线/离线/安全/多轮/取消路径，追加紧凑卡折叠展开与唯一开始按钮、动作卡详情跳转、追加消息后计划展开状态、busy→取消保留多选、320px/2 倍字号长标题、SDK 合法 12 码点中文与 emoji 选项完整换行、单/多选提交顺序及禁用行为。全工程 `flutter analyze --no-pub` 无问题。

实现使用消息对象身份及 `findChildIndexCallback` 保留反向列表中的状态；计划封面随标题内容自然增高，展开按钮有独立区域；选项标签明确允许换行。本对话页不再使用与反向列表布局冲突的旧滚动边缘装饰，全局组件未改。消息逐项 `RepaintBoundary`，列表卡片为静态半透明底、描边与轻阴影，AI 页及提问组件无 `BackdropFilter`；固定输入栏本轮采用静态胶囊，不把它宣称为已实现原生液态玻璃。

实际 Chromium Web 已验证：多选提问选择两项后生成计划、紧凑计划浅深切换、展开及保存、文字提问自由回答后继续生成计划、动作推荐进入原“俯撑肩胛前伸”详情及视频入口。App 控制台错误和警告均为 0。本轮截图使用固定工具响应，基础真实 AI 请求已在 +12 检查点完成。

- [浅色并排图](evidence/sdk-step1-chat-20261023/comparison-light.png) / [深色并排图](evidence/sdk-step1-chat-20261023/comparison-dark.png)
- [选项提问](evidence/sdk-step1-chat-20261023/ask-choice-light.png) / [文字提问](evidence/sdk-step1-chat-20261023/ask-text-dark.png) / [计划展开](evidence/sdk-step1-chat-20261023/expanded-dark.png) / [动作推荐](evidence/sdk-step1-chat-20261023/actions-dark.png)
- [验证摘要](evidence/sdk-step1-chat-20261023/verification-summary.json)、[测试尾段与命令元数据](evidence/sdk-step1-chat-20261023/coach-tests.log)、[全工程分析](evidence/sdk-step1-chat-20261023/analyze.log)。测试日志保存的是工具返回尾段，未冒称完整 stdout。

Web 与 Android release arm64 构建成功。最新内测包：`output/releases/Flare-SDK-step1-chat-1.0.10+13-20261023-arm64.apk`，100,484,534 字节；SHA256 `be956e2a21cf92cc650accbe82d2cc8fe3897c48360bb74a35e2a12829522b34`。v2/v3 签名、16 KiB zipalign 通过，与 L52 / +12 同开发证书；514 份随包资源与 +12 字节一致，AOT 已验证包含新对话组件。包与 +12 大小相同来自打包对齐，实际 AOT 哈希不同。详见 [包回执](evidence/sdk-step1-chat-20261023/apk-verification.json)。旧包保持。

未连接 Android 设备，未安装此包、未做 iOS 构建或原生 Raster 性能测量；不将 Web 截图当作真机验收。第 2 步前后 profile 性能比较仍待该阶段执行。内测 AI 配置由用户指定本机文件提供，配置不进入 Git；包仅供内测。

基础 SDK 接入、媒体来源、93 项测试、真实 AI 与训练验证及 5 项 SDK 待完善见 [第 1 步基础记录](sdk-step1-2026-10-23.md)。新增 UI 不沿用旧截图作为本轮验收。
