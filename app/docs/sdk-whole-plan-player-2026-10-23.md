# FlareLab 整计划 TrainerPlayer 接入

2026-10-23，按开哥确认的摸排方案实施。分支 `codex/flarelab-sdk-agent-trainer`，承接 `6ef69744f8cfaa3d1310ca7c83eda9c1342e5941`。SDK 仍固定 `b8f5b82bcf6f4075480fa6fb2382acea4c44b9c0`（coach 0.4.0 / trainer 0.1.7）。本次只完成现版 SDK 能承载的整计划接入；SDK 新功能、最终内测 APK 和真机验收另行推进。

## 功能对照与实现边界

| 原实现 | 本次实现 | 保留 / 变化 |
| --- | --- | --- |
| `TrainingTimerPage`、逐动作 `PlanRunPage`、App `_PlanRun` 导航 | 所有单动作、预设、我的计划、AI 计划入口均一次推入 `FlareTrainingPage`，内部直接使用 SDK `TrainerPlayer` | App 不再绘制训练控制页或维护训练时钟；旧页面仅留作历史回归夹具，没有生产路由 |
| AI 块拍平、重复 ID 合并、轮数乘进组数 | `TrainingRoutine.sdkPlan` 通过 `PlanCodec` 完整存取，`CoachPlanMapper` 只映射展示 | 保留块、重复项、轮数、轮间休息、剂量、备注与来源；旧记录无法还原此前已丢失的轮次，仍按旧数据读取 |
| 平面计划编辑器 | 完整计划独立编辑器 | 可改名、块内重排、增删项；已有剂量/轮数/轮间休息不变。坏计划解码拒绝部分成功，避免静默丢项后覆盖存档 |
| 手点计次、手动换侧、固定左先行、统一 selfPacedReps | SDK 默认编排、侧别和 `rhythmsFromCatalog` | App 不再注入手动计数/侧别策略；当前 b8 对无节奏动作仍显示 SDK“完成本组”，须等 SDK 缺省节奏发布后消除 |
| 一组多段本地计时 | 临时转换为独立 SDK 计划项 | Y→T→W 完整顺序后再下一组；保留原组间休息。独立项之间使用 SDK 默认 15 秒过渡，结果也按独立项统计；新版 segments 发布后替换此临时转换 |
| App 训练视频 | SDK `mediaBuilder` 接 `DrillMediaCard` | 自动循环、暂停/恢复、仅画面镜像；切入训练先暂停被遮盖页面的视频，仍保持全局单视频 |
| 自定义训练页颜色和文案 | 公开 `TrainerTheme` / `TrainerStrings` | Flare 深浅配色、14 语文字；SDK 源码和缓存均未修改 |
| 单动作 `TrainingSession` 保存 | SDK `SessionResult` 完整归档，同时生成旧历史兼容行 | 以 sessionId 幂等，失败重试/并发不重复；同 ID 异内容拒绝。未知字段保留到备份；未到达项不伪造旧记录，不在 App 修 SDK 统计 |
| 中文语音、其它语言提示音 | 中英文共享口令和数字；其它语言提示音 | 英文 91 段离线生成，中文 85 段保留，5 个提示音；不含动作专属讲解。声音遵循设置及 SDK 调度 |

目录仍为已接入的 Pose-Hub 0.3.0 / `36e1bb678047a3d5613a553a05be37dac8d9046b` 固定快照，FlareLab 51 项。当前 SDK 可读到 2 项目录节奏；8 项默认计时，其余 41 项计次没有节奏。无目录素材的计划整份拒绝开练，不静默少练。

## 验证

原始日志在 `output/sdk-player-audit-20261023/`。

- `player-tests.log`：31 项通过。实际 `TrainerPlayer` 两项计时动作自动衔接并一次保存、SDK 保存重试保持同 sessionId、b8 无节奏回落，以及 14 语 × 深浅主题在 390×844 / 1.5 倍字体下的准备页布局。测试注入静音输出，不作为真实音频或后台证据。
- `host-flow-tests.log`：39 项通过。AI 对话/ask_user、完整计划保存及开练、旧计划兼容、结构化循环计划路由与备份。
- `regression-tests.log`：53 项通过、8 项失败。通过项包含计划转换 5、14 语文案 1、语音 5、音频所有权 2、结果存储 12、完整计划/编辑 8、竖屏宿主页 12、媒体控制 8；8 个失败均是旧肌群详情页横屏溢出，发生在进入训练前。
- `master-landscape-tests.log`：隔离主线 `89bc7e8a96570648756b4face0f4f32069b59890` 同样 8 个横屏用例失败，位置/现象一致。本次没有修改该布局。
- `flow-final-tests.log`：20 项通过、3 项历史失败；包括预设整计划路由与旧夹具、AI 保护约束回归。与上面三个批次合计 **143 项通过、11 项已在主线复现的历史失败**，没有把这些失败过滤掉或计为通过。
- 此前要求确认的另 3 项历史 flow 失败，已在同一 master 快照复现：旧“暂停后可点选肌群”文案断言、iframe focus=false、重复“跟随系统”；证据在 `output/sdk-step1-device-20261023/master-regressions/`。不把主线失败算本次全部通过。
- `analyze-final.log`：静态分析无问题。`python app/tools/trainer/import_voice.py --check` 核验 182 个文件通过，中文/旧音频未覆盖。
- 首次批量执行曾遇 Dart VM 内存不足及测试间 asset Future 缓存跨 fake-async 区；修复测试隔离并分批重跑后，以上日志为最终结果，早期失败日志保留。
- `web-build-final.log`：离线 Web release 构建成功，输出 `output/sdk-player-preview-20261023/web`，未覆盖旧 Web/发布包。Windows 首次使用相对 output 路径导致 shader 编译目标失败，改用绝对路径后通过，源码未因此改变。
- Playwright 实际网页检查：预设热身整套一次进入 `/training`；示范视频 readyState=4 / 720 像素且自动播放；暂停后 video.paused=true、继续后 false；跳过直接进入 Y 段并显示 SDK 15 秒过渡；结束并保存返回计划详情，持久化一个 SDK session、两条已到达项的未完成兼容记录，未到达项没有伪造记录，退出后视频元素释放。截图 `player-zh-light.png`、`player-ytw-light.png`，保存摘要 `browser-result.json`。这次使用隔离的本地端口存储，不触及手机个人数据；语音日志出现 SDK 延迟口令丢弃/慢加载提示，未将网页听音或节奏自然度记为验收。

## 安装与待 SDK 项

源码包版本为 `1.0.10+14`；手机仍是此前已安装 `1.0.10+13`，本次没有安装新包，没有锁屏操作。+13 的设备观察不计为新播放器的验收。本次查询 SDK 远端 main 仍是 b8f5b82，未使用 SDK 侧未提交工作树。

SDK 新版 main 合入后，固定到该提交，再接 segments、次数默认自动节奏、休息 +15 秒、提前完成与声音开关，并验证两项统计修复。届时还须核对目录中的距离/自主完成处方如何表达，不能把临时 reps=1 自动节奏解释成完成距离动作。

之后构建独立内测 APK，验收整计划、语音、后台、记录和覆盖安装；真机通过并经开哥同意才合入 master、推送，再开展第 2 步视觉方案。本次没有合并、推送或启动视觉铺开。

英文语音来源、生成与许可边界见 `app/tools/trainer_voice/README.md` 及 `assets/trainer_voice/source-manifest.json`；自然度与真实设备听音仍待验收。
