# FlareLab 动作生产迁至 Pose-Hub（2026-10-17）

FlareLab 后续动作媒体只消费 [3D-Pose-Hub](https://github.com/mhgd3250905/3D-Pose-Hub) 已发布的固定版本。动作姿态、脚向、高亮、渲染与人物模型工具在 Pose-Hub 修改；本仓库负责网页、Flutter App、媒体接入与消费端验证。当前 App 保存身份仍为 L52 / 1.0.9+11 / v42-R17，不因源码清理提高版本或扩大验收范围。

## 迁移来源与路径

固定迁移提交为 [`2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee`](https://github.com/mhgd3250905/3D-Pose-Hub/commit/2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee)，标签 `v0.1.0-import`。根据 [MIGRATION.md](https://github.com/mhgd3250905/3D-Pose-Hub/blob/2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee/MIGRATION.md)，来源 checkout 是 3D-Body `66067a6475e6be85bf0daa6f167da1c124e4f1eb`；最后触及迁移路径的提交为 `ae81d96f271a18129abbf6afc7064cfd9dd1d8c3`，映射到 Pose-Hub 导入提交 `9d1c6072ae47bf6d92adc6871bb2fb48e4d19e89`。两者对应的458个文件 blob 相同；迁移保留了440个相关提交的历史。

| 原 3D-Body 路径 | Pose-Hub 路径 | 本仓库处置 |
| --- | --- | --- |
| `tools/drill-anim/` | `drill-anim/` | 移除已跟踪工具，原位置仅留迁移 README；用户未跟踪内容保留 |
| `tools/blender/`、`tools/mannequin/`、`tools/cloth/`、`tools/face/` | 同名 `tools/` 子目录 | 核对调用后移除已迁工具；来源文档链接到固定迁移提交 |
| 根 `index.html`、所需 `src/`、`public/coach/`、`public/anatomy/` | 渲染副本在 `runtime/` | 原路径全部保留，网页及 App 接入工具仍依赖它们 |
| `app/`、`tools/motion-v42*`、`tools/bake`、`tools/rekey`、`tools/verify*.mjs` | 未迁 | 原样保留 |

逐文件对照见 [path-map.tsv](https://github.com/mhgd3250905/3D-Pose-Hub/blob/2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee/docs/migration/path-map.tsv)，历史提交对照见 [commit-map.txt](https://github.com/mhgd3250905/3D-Pose-Hub/blob/2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee/docs/migration/commit-map.txt)。旧 SHA 仍指向 3D-Body 的历史提交；不能在新仓库直接按旧 SHA 查找。

迁移方记录的验收为 main 159 spec、修复分支166 spec、13个固定模型源 SHA 不变，以及 deltoids-A / h-9090-liftoff 同帧逐像素一致（SSIM 1.000）。这些是上述迁移提交的已有证据，本次清理没有重新执行该渲染验收。

## 保留边界与旧冻结约定

本次用户明确授权清理已迁走的生产工具，覆盖 [AGENTS.md](../AGENTS.md) 中旧阶段原句“已冻结的page/lib/src和spec及历史批次不可覆盖；新制作代码或人体版本另建批次。”对本仓库工具副本必须继续保留的限制。旧冻结资产、原始成片、参数、SHA、QA 与验收事实仍由 Git 历史、Pose-Hub 导入及本地原输出保留；本次不覆盖或重制任何历史批次。

[统一素材库历史记录](training-media-library-2026-10-13.md) 原句“运行中的冻结源和制作代码不得修改。”以及“制作代码或人体版本改变时使用新的批次目录，不能覆盖先前产物。”继续约束历史批次复现。迁移不允许在 Pose-Hub 续跑旧冻结批次：生产代码与路径变化会触发冻结检查，新生产须另建目录。

`tools/flare-body-swap` 和根 `reframe-library.mjs` 保留为兼容入口，通过 `POSE_HUB_DIR` 指向独立 Pose-Hub checkout，并使用其新目录布局；它们用于现有 FlareLab 派生/历史复现。新动作或姿态、脚向、高亮、渲染、人体改动仍到 Pose-Hub。没有授权将这两个工具整体迁走。

根网页、`app/scene`、`app/tools/verify-v41.mjs` 和 `app/scene/tools/integrate-v42-*` 继续使用本仓库的场景及模型，因此根场景副本不能删除。人物模型以后只在 Pose-Hub 修改并升模型版本，例如 `training-human-v3`；同步产出回 `public/coach/` 等消费路径时，在本仓库记录模型版本和 Pose-Hub commit。

PR [3D-Body#121](https://github.com/mhgd3250905/3D-Body/pull/121) 的工作已迁到 [3D-Pose-Hub#1](https://github.com/mhgd3250905/3D-Pose-Hub/pull/1)；旧 PR 按用户要求留言并关闭，不合并。PR #120 的 `tools/hiplab-render` 不在 master，本次不合入，也不代用户决定迁移。

## 第一版媒体发布后再接入

当前 `app/assets/drill_media/` 的51个 id 对应720²视频与540²封面，来源记录继续使用 `app/assets/data/drill-media-manifest.json`；发布前保持原文件和导入器，暂不创建空版本锁或运行同步。

发布后按 [consumers.md 第4节](https://github.com/mhgd3250905/3D-Pose-Hub/blob/2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee/docs/consumers.md#4-flarelab3d-body-app) 另开 FlareLab PR：

1. 从届时选定的 Pose-Hub commit 复制 `media/tools/sync.py` 到 `app/tools/pose_hub_sync.py`，文件头注明来源 commit。
2. 新增 `app/pose-hub.lock.json`，固定实际发布版本；ids 取 Pose-Hub `drill-anim/data/drills.json` 的51项。targets 分别为 dark/video → `assets/drill_media/{id}.mp4`、dark/poster → `assets/drill_media/{id}.jpg`；分辨率按发布清单显式选择。
3. 依次运行 dry-run、正式同步和 check；每个下载文件按发布清单验证大小与 SHA256。脚本的 `dest` 相对锁文件所在目录。
4. 如文件名、分辨率或媒体元数据变化，同一 PR 同步修改 `drill-media-manifest.json` 及使用它的 Dart 代码，再将 `import-drill-media.py` 标记弃用。

```powershell
python app/tools/pose_hub_sync.py --lock app/pose-hub.lock.json --dry-run
python app/tools/pose_hub_sync.py --lock app/pose-hub.lock.json
python app/tools/pose_hub_sync.py --lock app/pose-hub.lock.json --check
```

以后新增或修正动作，先在 Pose-Hub 提 issue 或按其 AGENTS.md 建 `drill/<id>` / `fix/<id>-…` 分支和 PR；待其渲染发布新版本后，FlareLab 的媒体升级 PR 只更新锁定版本/ids、同步媒体及必要消费元数据。推送和开 PR 前先取得用户同意。

## 本次清理实测

本地分支 `chore/move-drill-anim-to-pose-hub` 从 `66067a6475e6be85bf0daa6f167da1c124e4f1eb` 建立。删除前341个已跟踪源文件均与迁移映射的 Git blob 一致，固定 Pose-Hub 提交中的目标逐项存在；移除其中340个文件，另将原 README 换成迁移指针。未跟踪的绿幕工具及原忽略的配置/缓存保留，原目录忽略规则移至根 `.gitignore`，不将本地配置带入提交。

根 `index.html`、`src/`、`public/coach`、`public/anatomy`、`app/` 与未迁工具中的1363个受保护非 Markdown 文件，清理前后 SHA256 全部一致，包含现有51个MP4和51个JPG。署名 Markdown 仅更新复现工具链接；JSON、GLB 内嵌的原工具名和 `optimize-study-body` 中的旧复现说明为历史来源记录，没有可执行的本地调用。`git grep tools/drill-anim` 的剩余命中为迁移说明/保留本地配置的忽略规则或历史文档、历史证据；运行代码已无旧目录依赖。原3份文档20行绿幕改动与27项未跟踪文件继续保留，不纳入本次保存。

| 检查 | 清理前 | 清理后 |
| --- | --- | --- |
| 根 `npm run build` | 通过 | 通过 |
| `app/scene` 的 `npm run build`、`npm run verify`（含 v41、R12/R15/R16/R17 资产、集成及渲染质量检查） | 通过 | 通过 |
| `cd app; flutter test --reporter expanded` | 165通过 / 12失败 | 165通过 / 相同12失败 |
| `cd app; flutter analyze` | 未另跑 | 通过，无问题 |
| `node --test tools/flare-body-swap/pose-hub-paths.test.mjs` | 新增适配检查 | 5项通过 |

实测失败名称逐项完全一致：交接预期的3条 `flow_regressions_test`、1条 `polish_round2_test`，以及清理前即存在的8条 `ios_layout_test`（SE3 / iPhone13 横屏、深浅色、1.0 / 2.0 字号的布局溢出）。本次不修无关 App 问题，也不将这些失败写成通过。

浏览器核对根网页人物及原编辑界面显示正常，控制台无错误；App scene 人物、同步肌群显示正常，`ready=true`、`errorCode=null`、WebGL context 未丢失，唯一请求错误为独立场景原有的 `favicon.ico` 404。独立代码复核未发现外部路径、固定 v41 输入桥接或 exporter 模块加载的确定回归。适配器测试使用隔离 fixture；只读布局核对的本机 Pose-Hub checkout 为 `1aabde3f0d4e832d744f267796b4848dc0593b3c`，不能将其视作在 `2a1b5ef` 上重新运行完整生产验收。本次未执行完整渲染/GLB导出、未构建新APK、未安装真机或发布媒体。

可随仓库审阅的[验证摘要](evidence/pose-hub-migration-20261017/verification-summary.json)记录失败名称与哈希核对；完整本机日志、移除清单、前后哈希与截图位于 `output/pose-hub-migration-20261017/`（忽略目录，fresh clone 不自带）。[旧 PR #121 已留言并关闭](https://github.com/mhgd3250905/3D-Body/pull/121#issuecomment-6235736455)，`mergedAt=null`。推送与新 PR 创建仍等待用户同意。
