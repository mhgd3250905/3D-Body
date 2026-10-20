# AI 定制（AI 训练助理试验田）

2026-10-20 · 分支 `feat/ai-coach` · 依赖 [ugk_coach](https://github.com/mhgd3250905/ugk-3d-pose-sdk) 0.1.1（`ab2da7d`）

托马斯训练助手是三 App 共用 AI 训练助理 SDK 的第一个接入方。用户在计划页点「AI 定制」，用一句话描述需求，助理最多追问一次，然后给出一张计划卡（动作缩略图 / 名称 / 剂量 / 估算时长），可以「保存到我的计划」或「开始训练」。

## 用户路径

1. 计划页（底部「计划」）顶部的「AI 定制」卡片。只在中文界面显示（模型和目录文案都是中文）；未配置 key 时卡片带「未配置」标记。
2. 对话页：首次进入显示一句免责说明（「知道了」后不再显示）；空状态给三个示例。
3. 发送后显示分步进度（理解需求 → 挑动作配剂量 → 核对范围剂量安全）、已用秒数和「通常 30–40 秒」，可随时「停止」（HTTP 真正中止、不回落、不记进对话，原话回到输入框）。
4. 结果：
   - `ask`：一句追问 + 选项按钮。助理最多追问一次，第二轮 App 会在本轮条件里要求直接出计划。
   - `plan`：计划卡。AI 计划带「AI 定制」标记；回落时带「预设方案」标记并写明原因。
   - `reply`：纯文字（如红旗情况建议就医）。
5. 「开始训练」直接进入现有跟练（PlanRunPage → 计时 / 计次页），结束后回到对话；「保存到我的计划」后出现在计划页「我的计划」。

截图：`docs/ai-coach/1-plans-entry-light.png`、`2-thinking-dark.png`、`3-plan-card-light.png`、`4-preset-unconfigured-dark.png`（组件测试渲染）。

## 计划怎么变成 App 的计划

| TrainingPlan v1 | App |
|---|---|
| `blocks[].items[]` 按顺序 | 一串不重复的动作，依次跟练（App 的成套训练模型） |
| `rounds` | 折进组数：`sets × rounds`（最多 12 组） |
| 同一动作出现多次 | 并进第一次出现的组数，剂量以第一次为准 |
| `mode / reps / workSeconds / perSide / restSeconds` | `RoutineDose`，保存在 routine 的可选字段 `doses`；跟练计时 / 计次按它走，Y-T-W、腕屈伸这类多段动作保留分段 |
| `source=template`（预设方案） | 不存 `doses`，沿用动作库原处方 |
| `title` | routine 名（截到 24 个字） |

`routines[].doses` / `routines[].source` 都是可选字段：旧数据照常读，手动编辑计划时删掉的动作连同剂量一起删掉。

## 动作范围

- 目录：`assets/coach/catalog.json` = SDK 内 Pose-Hub 目录快照（0.1.0）里 `apps` 含 `flarelab` 的 51 个动作；profile：`assets/coach/flarelab.json`。升级 SDK 时用同一提交的 SDK 仓库重跑 `python3 tools/coach/sync_coach_assets.py <sdk 路径>`。
- 运行时范围 = profile 白名单 ∩ App 里真有这个动作且媒体清单有示范视频的 id。不在交集里的 id 写进 `profile.select.exclude`，提示词目录表和校验器同时排除（校验报 `E_SCOPE`，触发重写）。目前交集完整（51/51），此时系统提示词与 SDK 评测金样逐字节一致（已核对）。
- 目录远端更新：配了 `UGK_COACH_CATALOG_URL`（manifest.json 地址）时启动后后台检查一次，SDK 校验大小 / sha256 / 版本后才切换，失败保持随包目录。目前只存内存（下次启动重新检查）；远端发布位置待定。

## 配置与运行

令牌绝不进代码或仓库，从 `--dart-define` 读取。默认连自建 **UGK AI 中转站**（New API，`https://ai.uuugk.win/v1`）：DeepSeek 等上游 key 只放在中转站，App 用中转站后台给它单独发的令牌（可设额度、随时吊销；换便宜的上游只在后台改渠道，App 不用发版）。

```bash
flutter run \
  --dart-define=UGK_COACH_API_KEY=<中转站令牌>                # 必填；不填 = 未配置，只给预设方案
  --dart-define=UGK_COACH_BASE_URL=https://ai.uuugk.win/v1   # 可选，默认即此（UGK 中转站）
  --dart-define=UGK_COACH_MODEL=deepseek-v4.1-flash-1017       # 可选，默认即此
  --dart-define=UGK_COACH_CATALOG_URL=https://…/manifest.json  # 可选，目录远端更新
```

模型参数用 SDK 预设 `LlmConfig.deepSeekOpenCsg`（max_tokens 6000、单次超时 90 秒、JSON 模式）。推理模型一次约 30–45 秒（冒烟 38.7 s / 42.6 s）。

### 中转站

- 中转站：New API 自托管在 VPS，经 Cloudflare Tunnel 暴露为 `https://ai.uuugk.win`，后台管理渠道（上游 key）、令牌、额度与用量。
- 每个 App 一把独立令牌；令牌泄露时在后台吊销重发即可，上游 key 不受影响。
- 模型名保持 `deepseek-v4.1-flash-1017`；之后要换上游，在中转站做模型映射，并先跑 SDK `eval/` 的 24 条评测达标再切。
- `UGK_COACH_RELAY_TOKEN`（X-App-Token 方式）保留给自写 Worker 用，接 New API 不需要。

## 回落与安全

- 断网 / 超时 / 限流 / 鉴权 / 服务端错误 / 输出截断：不重写，直接回落；输出两次校验都不合格（首次 + 带错误重写 1 次）：回落。
- 回落 = 从现有 6 个成套训练里按关键词挑最接近的一个（热身 / 支撑 / 核心 / 腿 / 侧撑 / 全链，没命中用托马斯全链），场景按话里的「健身房 / 哑铃…」或计划页当前选择；回复第一句写明原因并说明「这是 App 内置的预设方案，不是 AI 定制」，卡片带「预设方案」标记。
- 未配置 key：不调模型，直接走同一回落。
- 安全：AI 路径沿用 SDK 内核的红旗规则（剧痛、刺痛、麻木 / 放射痛、明显肿胀、刚受伤、术后、孕期产后、头晕胸闷 → 不出计划、建议就医；一般不适 → 写进 avoid 并避开相关动作）。离线 / 未配置时 App 用同口径关键词判断，命中就只回复就医建议、不给预设计划。每张计划卡末尾固定一句「训练中出现疼痛、麻木或头晕，立即停止」。首次使用显示免责说明。

## 用量记录

每次模型调用一条 SDK `UsageRecord`，追加到 `<应用支持目录>/coach/usage.jsonl`（Web 只记内存）。设置 → 其他 →「AI 定制用量」显示本机累计调用次数和输入 / 输出 token。SDK 不内置单价，花费待开哥给出 OpenCSG 单价后再加。

## 代码位置

- `lib/coach/coach_config.dart`：dart-define 配置
- `lib/coach/coach_service.dart`：SDK 装配、范围交集、追问一次、回落、免责标记
- `lib/coach/template_fallback.dart`：预设回落与离线红旗判断
- `lib/coach/plan_mapping.dart`：TrainingPlan → 计划卡行 / routine
- `lib/coach/usage_store.dart`（+ `usage_file_io.dart` / `usage_file_stub.dart`）：JSONL 记账
- `lib/ui/ai_coach_page.dart`：对话页、计划卡、进度
- `lib/domain/training_plan.dart`：`RoutineDose`、`TrainingRoutine.doses/source`
- `test/ui/ai_coach_test.dart`：15 个测试（SDK `FakeLlmClient`，不打真实网络）

## 真实冒烟（2026-10-20，经 OpenCSG，沙盒代理注入 key）

用 App 随包的 profile + 目录快照、SDK 原样编排，各 1 次计费调用：

| | 内核 v1（SDK 0.1.0） | 内核 v2（SDK 0.1.1） |
|---|---|---|
| 输入 | 在家 20 分钟，想练托马斯的支撑臂和侧撑，手腕有点不舒服 | 健身房 30 分钟，练托马斯的核心压缩和腿 |
| 结果 | 首轮通过 | 首轮通过 |
| prompt / 缓存命中 | 5267 / 5120 | 5359 / 5120 |
| completion / 推理 | 3947 / 3225 | 4282 / 3547 |
| 耗时 | 38.7 s | 42.6 s |
| 计划 | 8 个动作，估算 19.2 分钟（目标 20），avoid=手腕，去掉了手腕承重动作 | 12 个动作（forearms-A 出现两次，App 并为一项），估算 25.7 分钟（目标 30） |

两次的动作全部在 App 内、有视频。
