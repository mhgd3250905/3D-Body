# SDK 0.2.9 与 App 体验测试分支

本地测试分支 `codex/sdk-029-phone-feedback`，起点为已获准合入推送的 `master 4f091acf7e557f125ef3527470f53485066ecb3c`。本轮未合入或推送，未修改 `release/1.0` 或 HipLab。按用户最后补充，仅使用 Web，正常字体验证；没有构建 APK、使用 ADB 或安装手机，既有手机数据与 +16 安装身份保持。

## SDK 固定版本

三个 tag 均已用 `git merge-base --is-ancestor` 确认属于当时 SDK main `e6dd32d90d0533aecf595f17f002701c0bec7d7a` 的历史。`pubspec.yaml` 使用远端 Git tag，锁文件记录以下解引用后的提交；没有本机路径依赖、缓存补丁或 SDK 源码修改。

| 包 | 正式 tag | resolved-ref |
| --- | --- | --- |
| coach | `ugk_coach-v0.5.0` | `d7e0b8fa3afc514fe3a53427cfddb8f7b24c984f` |
| trainer | `ugk_trainer-v0.2.9` | `953be22414f23128af879dc62686db200db34265` |
| coach_ui | `ugk_coach_ui-v0.1.3` | `159dadf058ef47f701e36a496668265f9fd3fc0d` |

`flutter pub get` 及 `flutter pub get --enforce-lockfile` 均通过。coach 保持原 tag，另外两个包升级；未发现需要替换业务 API 的编译破坏性变化。

## 移植与取舍

SmartFit 参考源为只读仓库 [Sport-Helper，固定 5efb3e0](https://github.com/mhgd3250905/Sport-Helper/tree/5efb3e0ba8dfe418f4b5ea0ce87e9e04f9b3e594)，主要依据 [手机反馈后续](https://github.com/mhgd3250905/Sport-Helper/blob/5efb3e0ba8dfe418f4b5ea0ce87e9e04f9b3e594/docs/phone-feedback-followup-2026-10-24.md) 和 [首批手机反馈](https://github.com/mhgd3250905/Sport-Helper/blob/5efb3e0ba8dfe418f4b5ea0ce87e9e04f9b3e594/docs/phone-feedback-batch1-2026-10-24.md)。借鉴体验设计，在 Flare 既有组件上实现；未整文件复制 SmartFit 页面、品牌或资产。结束时源仓库 HEAD 相同且工作区干净。

| 参考体验 | Flare 本轮处理 |
| --- | --- |
| 文章式训练图文 | 预置、我的计划、AI 计划共用详情页改为连续文章：标题、动作数/时长、说明、原分块/轮次、编号动作、剂量、视频、要点与安全提示。保留原计划对象、分段媒体、保存/编辑和进入动作详情能力。 |
| 稳定的开练入口 | 右下固定按钮沿用 Flare 的本地化“开始训练”，末尾按按钮实测高度留白；正常字体窄屏、横屏和深浅主题可用。 |
| 图文视频与训练交接 | 详情手动播放，单个预览；滚出可见区域释放，返回仍静态。进入 SDK 训练前停预览，并等待一个释放帧；不自动滚动到视频。 |
| SDK 手机训练反馈 | 删除旧 App `mediaBuilder` 接线，向 `TrainerDrill.media` 映射原 51 项普通 MP4/JPG，直接使用 SDK 默认媒体、切换/目标封面及首帧保护。暂停按钮颜色通过公开主题注入 Flare 强调色；接下来提示及“不舒服”使用 SDK 原布局。 |
| 聊天沉浸布局 | 聊天视口延伸到状态栏，初始内容用 SDK `topInset` 留出头部，`fadeTop:false`；固定标题/返回/新对话及底部输入保留安全区。Android 显式启用 edge-to-edge。深浅主题均验证真实状态栏区域气泡像素。 |
| 目录与素材更新 | 不移植 SmartFit 的新动作库、全目录审核/替换策略、透明素材或双主题重制媒体。Flare 原白名单/profile、动作目录、R17 与 51 项视频和封面均未改。SDK 包本身具备的透明能力不在 App 配置或素材中启用。 |
| AI 会话与入口 | 保留 `CoachConversationController`、App Key/API、门禁、映射、历史和训练启动职责；没有 Key 的所有入口继续隐藏，不增加入口或密钥。 |

文章懒列表暴露了 App 公共 `ScrollEdge` 的布局阶段刷新问题。本轮最小修复为：布局通知只合并最新指标，帧结束再更新边线；正常滚动仍即时更新。没有以移除边线或吞掉异常规避。

## 26 项旧失败与本轮验证

26 项旧失败已在起点 `4f091ac` 中修复，并非仍待修复。本轮保留那些横屏、阶段文案、多语和旧测试接线修正；此前独立修复的全量结果为 361 通过、0 失败、1 项原 opt-in 跳过，见 [原修复及逐项对照](baseline-fixes-2026-10-24.md)。

本轮仅跑 13 份受影响测试文件，正常字体共 **135 通过、0 失败、0 跳过**。覆盖文章、聊天/问题/无 Key 入口、默认 SDK 媒体/训练完成与保存、完整计划、训练计时、原横屏/多语及媒体控制。遵从用户追加要求，保留旧测试定义，通过名称过滤不运行 iOS 2 倍字体及 1.3 倍大字专用用例；trainer 的 14 语 × 深浅矩阵改为正常字体，覆盖及布局断言保留。原 26 项中正常字体对应的 16 项本轮逐项通过，10 项 2 倍字体不再复跑。没有跑全量或 live AI。

新增测试 fixture 在真实异步区预载媒体清单，避免跨 widget test fake-async 区缓存 Future；聊天 fixture 由真实 Shell 管理服务销毁，移除冗余 teardown 等待。没有为测试增加生产兜底或放宽断言。最终分析、构建、测试、指纹与逐项结果见 [verification.json](evidence/sdk-029-phone-feedback-20261025/verification.json)。

Web 使用正式 App release 构建和隔离浏览器数据。复核手机宽度浅色、320px 深色、横屏、末尾不被按钮遮挡、手动视频、开始 SDK 训练、暂停及结束返回；无 Key 计划页没有 AI 入口。浏览器控制台没有 error 或 warning。聊天真实像素通过注入测试服务验证，没有线上模型请求。本轮 Web 及 widget 验证不代替原生设备 QA。

| Web 证据 | 截图 |
| --- | --- |
| 390px 浅色文章 | [查看](evidence/sdk-029-phone-feedback-20261025/article-light-390.png) |
| 320px 深色文章 | [查看](evidence/sdk-029-phone-feedback-20261025/article-dark-320.png) |
| 深色文章末尾 | [查看](evidence/sdk-029-phone-feedback-20261025/article-end-dark-320.png) |
| 深色横屏文章 | [查看](evidence/sdk-029-phone-feedback-20261025/article-dark-landscape.png) |
| SDK 默认训练媒体及暂停按钮 | [查看](evidence/sdk-029-phone-feedback-20261025/trainer-paused-light.png) |

## SDK 备注

正常字体范围未发现需要 SDK 新能力的问题。用户收窄字体范围前，曾观察到印尼语 1.5 倍字体、390×844 下，SDK 训练页浅/深各一项右溢 20px；已记录原始失败，不改 SDK、不缩字绕过，按用户最后要求不再扩展该验证，也不作为本轮交付阻碍。静态分析指向 SDK 顶部提示行与非弹性“不舒服”标签的宽度竞争，原错误日志没有保留具体 RenderFlex 行，故该行位仅为推断。

源码版本仍 `1.0.10+15`，无新发布；下一步由用户审阅测试分支和 Web 体验后另行安排。
