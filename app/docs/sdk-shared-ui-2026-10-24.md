# SDK 共用聊天与训练接入候选（历史）

此文保留 `e8ae7b5` 与旧 tag 的当时验证结果。后续用户提供的 `3302d62` 修复版已在新一轮接入；当前结果见[修复版主线接入](sdk-shared-ui-r2-2026-10-24.md)。下文的待审、两项失败及编码适配均为历史阶段。

本轮在 `codex/sdk-coach-ui-integration` 实现，基线为 `master` 的 `debf6a9b157d26ebc5bc21cbf370a5488e146339`。仓库默认分支实际名为 `master`；用户所说的主线按此执行，不新建或改名为 `main`。当时为待审候选，未合入、未推送、未安装手机；SDK 与 `release/1.0` 均未修改。

## 正式 tag

| 包 | pubspec.yaml ref | pubspec.lock resolved-ref |
| --- | --- | --- |
| ugk_coach 0.4.1 | `ugk_coach-v0.4.1` | `88da65ab4e7d6753ab548d779f4168f023dbf9f8` |
| ugk_trainer 0.2.1 | `ugk_trainer-v0.2.1` | `f0ea0647586913b205fc6dbb75fc9f97cedc55ce` |
| ugk_coach_ui 0.1.0 | `ugk_coach_ui-v0.1.0` | `f0ea0647586913b205fc6dbb75fc9f97cedc55ce` |

依赖没有使用 main、本地 path 或 dependency_overrides；未升级其它包。接口依据用户指定的 [README](https://github.com/mhgd3250905/ugk-3d-pose-sdk/blob/28388f030b36ab47cc4f92fc1e6d62610a51358e/packages/ugk_coach_ui/README.md) 与上述正式 tag 的源码。没有读取或复制 SmartFit 的实现。

## App 适配

聊天列表、普通气泡、文字/选择澄清气泡、套路卡及进入动画使用 SDK 的 `CoachChatList`、`CoachMessageBubble`、`CoachQuestionBubble`、`CoachPlanCard` 等组件。原自有澄清布局已移除，保留的文件只负责 DTO 映射。`CoachUiTheme` 注入 Flare 语义颜色、FlareSans、中文文案和现有静态表面/开始按钮；卡片核心布局仍由 SDK 实现。

App 保持 `CoachService` 的同一个 `CoachAgent`：只在 `await agent.send` 返回后启用已通过门禁的问题；问题正文不重复渲染成普通气泡。单选传原选项，多选按原顺序整理；发送前立即关闭旧问题并保存用户气泡。取消、新对话、销毁或重新打开历史时不复活旧问题。进度事件不直接变成待答任务。

目录仍为本 App profile 白名单与实际动作、媒体的交集。Agent 的 coach 门禁先于呈现映射，App 在创建套路 DTO 前再次运行 `PlanValidator`；素材名称和路径仅从 App 的可信目录解析。保存和开练始终使用原始已准入的 `TrainingPlan`，不把 UI DTO 当执行计划，不拍平循环、单侧或 segments。保存等待持久化成功后才标记已保存，失败可重试且不重复创建同一计划。

已有聊天入口保留在中文计划页；没有 Key/中转令牌时计划入口和设置 AI 用量均隐藏，空白凭据也视为未配置。编译检查没有注入 Key，也没有新增入口。手机原内测 `1.0.11+16 / R17` 与已认可 L52 的验收边界保持；本轮源码 pubspec 仍为 `1.0.10+15`，构建验证不代表安装了这个版本。

训练已统一走 `FlareTrainingPage → TrainerPlayer`。trainer 0.2.1 仅修复了正式 coach tag 依赖，没有要求 App 变更训练引擎。新增实际 Shell 路由测试覆盖选择单动作或已保存完整套路、真实 SDK 播放器完成、结果持久化重载与返回。

## 验证与证据

证据目录为 `output/sdk-coach-ui-20261024/`，最终命令、计数及产物写入该目录的 `verification.json`。不把下列未完成/失败项计入通过：

- `trainer-tests.log`：86 项训练相关测试通过，含两条新增真实 Shell/TrainerPlayer 完整链路。
- `host-regressions.log`：29 项通过，含分段计划、历史处方、保存失败、无 Key 入口隐藏。
- `chat-tests.log`：36 项通过、2 项失败；含同 Agent 澄清、保存失败重试/去重、历史禁用和门禁。两项失败仅为 SDK 320px / 2 倍字浅深溢出。三组共 151 项通过、2 项失败。
- `analyze.log`：全项目 `flutter analyze --no-pub` 无问题；`pub-locked.log`：正式 tag 锁文件强制复核通过。
- `web-build.log`：正式 `flutter build web --no-pub --no-web-resources-cdn` 通过。
- `apk-build-pub.log`：`flutter build apk --release --target-platform android-arm64` 通过；无 AI Key，未安装。当前验证 APK 为 101,769,867 字节，SHA256 `dc978255ac2064811391a4616b37b84a14936257fc07378db246aede0dff466a`。早期使用 `--no-pub` 的 Android 构建因先前测试生成的 dev 插件注册文件失败；最终保留 release 的 Pub/平台注册阶段重新生成后通过，未手改 Java 注册文件。
- `preview-build-final.log`：单独的纯内存 fake client 预览编译通过，不访问真实 AI 接口、不写个人数据。首次相对输出路径导致 shader 写入失败，改为 E 盘绝对输出路径后通过。该预览不属于正式 App 入口或交付包。启动本地浏览器预览服务被自动审批以 `blocked by policy` 拒绝，所以没有执行浏览器交互/截图核对，不计为通过。

本机中文 Windows 的 Pub 用系统编码解析 `git show ...:pubspec.yaml`，误将中文 description 后的版本行并入描述，从而把包读成 0.0.0。只在本机忽略的 output 目录提供临时 Git 元数据编码适配，随后由 Pub 正常解析并写锁文件；没有改 SDK、Git 对象、tag、缓存内的 SDK 源码或使用依赖覆盖。分析、测试与 Web 编译使用 `--no-pub`；锁文件复核及 Android release 的 Pub 阶段使用同一环境适配。普通 UTF-8 环境无需此本机适配。

## 需要 SDK 修复，阻止当前候选合入

在 320px 宽、2 倍字体下展开套路卡，浅/深主题都可复现 SDK `_MoveRow` 右溢出。`packages/ugk_coach_ui/lib/src/plan_card.dart` 的剂量 `Text(item.doseText())` 没有受限宽度/换行容器，行高又固定，无法完整承载循环、分段摘要和较大字体。回归测试保留完整剂量，没有缩字、截断、捕获后吞掉错误或复制 SDK 卡片实现。

SDK 需求：在共用卡片内修正剂量受限宽度、换行和自适应行高，并同步展开/收起、媒体及飞行动画的布局测量；覆盖中文长剂量、循环/segments、320px 和 2 倍字体浅深主题。请 SDK 发布修复版正式 tag，并由用户确认 App 后续采用的 tag。当前三个指定 tag 保持不变，不移动或重打旧 tag。

因此当前候选不能标记为“全部测试通过”，也不执行合入和推送。原生媒体、语音/后台中断、长期计时及设备矩阵不属于本轮已完成的 Widget/编译验证。
