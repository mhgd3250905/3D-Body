# FlareLab 网页版 · 托马斯训练助手 Web App

线上：**https://flare-app.uuugk.win/**（备用 https://flarelab-app.294851575.workers.dev/）· 官网 https://flare.uuugk.win/（未改动）

这是与 Flutter App（`app/`，dev.mhgd.flare）共用动作、训练与课程数据的独立网页实现，按桌面网页布局（1280–1920 宽为主，平板/手机自动适配）。当前网页训练卡使用静态示意图，未接入 L43 的 51 项视频点播、14 语离线内容、浅色主题与振动反馈；本次整合不改变 L43 App 的既有实现。原线上地址保留，仓库构建/浏览器验证不等于重新发布或全设备验收。

## 功能（与 App 对应）

| App | 网页版 |
|---|---|
| 首页 3D 动作：播放/暂停、慢放、八阶段时间轴、单段循环、镜头 | 「动作」页：中央大 3D 舞台（v41 托马斯，Snow 教练），底部阶段时间轴可点选/跳转，0.25/0.5/0.75/1× 速度，循环当前阶段，正/侧/背/复位镜头，拖动旋转、滚轮缩放；X 光「肌群高亮」按阶段点亮主力/协同 |
| 暂停后点人物 / 小图选肌群 → 同一帧肌群详情 | 点 3D 身体（射线拾取 → 骨骼 → 肌群，按当前阶段消歧）或左下「同步发力」正/背面人台小图，右侧检查器显示：作用、本阶段做什么（主力/协同、左右侧）、发力阶段、A/B/C 针对性训练；选中肌群在动作模型上发光 |
| 直立肌群人台 | 「肌群」页：App 同款 CC0 人台 + 逐像素肌群面板着色器（直接复用 `app/scene/src/legacy/muscle-map.js`、`muscle-material.js`），可旋转、点选，17 肌群按部位列表 |
| 训练库 51 项（搜索、A/B/C、部位） | 「训练库」：可筛选网格（搜索、档位、部位、肌群）+ 右侧详情抽屉（示意图、组次、器械、计时方式、要点、常见错误、安全、同肌群其他档位） |
| 计时/计次（DrillTimer） | 全屏计时：逐行移植 `drill_timer.dart` 状态机（倒数、计时/计次/手动、每侧、Y-T-W/腕屈腕伸分块、组间休息、+15 秒、结束休息、暂停、切后台自动暂停、不适停止、结束确认），提示音（WebAudio） |
| 今日训练 | 「今日」：加入/移出（可撤销）、完成状态、本课练习一键加入 |
| 学习路径 18 课 + 阶段自评 + 入门自评 | 「路径」：6 阶段步进器、课程卡（相关阶段可跳到 3D、练习可打开详情）、标记已练、阶段自评（自行确认；原 AI 门槛按 App 改为自行回顾）、入门自评 5 项 → 起点阶段（同 App 算法） |
| 记录 | 「记录」：训练次数/分钟/已练课程/连续天数、本周天数与目标、近 18 周热力图、最近记录（未完成/不适标记） |
| 设置、安全须知、关于/来源 | 「设置」：默认档位、每周目标、提示音、默认速度、画面质量、X 光开关；导出（复制/下载）、**导入**备份、清除；安全三件事、教学说明、许可 |
| 首次进入欢迎 + 安全三件事 | 同样的欢迎页 → 三件事 → 可选入门自评 |

快捷键：空格 播放/暂停 · ←/→ 阶段 · 1–4 速度 · L 循环 · X 高亮 · F/S/B/R 镜头 · Esc 取消选择/关闭 · / 搜索 · G+1–7 切页 · ? 帮助；计时中 空格=完成 1 次/继续，Enter=本组完成。

本地数据：localStorage 键 `flare.learning.v1`，结构与 App 一致（version 1、settings、today、sessions、completedLessonIds、gateReports、assessmentGrades、startStage），另加 `web` 字段存网页专属设置。

## 结构

```
webapp/
  src/core.js        数据目录（直接 import app/assets/data/*.json）、parseDose、DrillTimer、Store（移植自 app/lib）
  src/stage.js       3D 动作舞台（three r170、meshopt coach.glb、X 光/发光着色、拾取、相机）
  src/mannequin.js   肌群人台（full 探索 / mini 正背面小图），复用 app/scene 的肌群着色器
  src/main.js        UI：路由、各页面、检查器、抽屉、计时器、引导、快捷键
  src/index.tpl.html 页面骨架 + 全部 CSS（桌面 / ≤1280 / ≤1024 / ≤760 断点）
  src/flare-data.json  coach.glb 动画的逐帧阶段/肌群表（来自官网构建）
  coach.glb          压缩教练模型 725KB（与官网相同）
  build.py / deploy.py / qa.mjs
```

## 构建与部署

```bash
npm ci                     # 仓库根目录（three 0.170 + esbuild，或在 webapp/node_modules 软链）
pip install pillow         # 默认构建仅需 Pillow，字体输入已入库
python webapp/build.py      # Windows/Linux；根目录锁定依赖提供 esbuild
node webapp/test-core.mjs   # 导入校验及拒绝损坏备份后原数据保留
FONTS_DIR=/path/to/fonts python3 webapp/build.py   # 可选重新子集化（需 fonttools、brotli 和原字体）
CLOUDFLARE_API_TOKEN=xxx python3 webapp/deploy.py  # Worker `flarelab-app` + 自定义域名 flare-app.uuugk.win
```

`src/fonts/` 是离线构建输入，许可全文在其 `licenses/` 中。中文 400/700 子集从本仓库已有 `app/assets/fonts/FlareSans.ttf`（Noto Sans SC）生成；Anton 和 JetBrains Mono 子集沿用官网相同的已提交文件。默认构建无需下载字体或建立软链接；更新页面/数据中显示文字时需重新生成中文子集。损坏备份会在修改当前内存及持久化记录之前整体拒绝，不产生部分导入。

- 单个模块化 Worker，资源作为二进制模块内嵌（无 Pages / Workers Assets）。当前 61 个文件，原始 3.04MB，gzip ≈ 2.2MB（免费版上限约 3MB）。
- 全部自托管：字体按全站用字子集化（Noto Sans SC 400/700 各 ~115KB），无 CDN / Google Fonts。
- deploy.py 只允许 `flare-*.uuugk.win` 主机名，不会碰主域名或官网 Worker。
- QA：`BASE=http://127.0.0.1:8855/ node webapp/qa.mjs`（Playwright + swiftshader，1440×900 / 1920×1080 / 390×844；先独立启动 webapp/dist 的静态服务器）。使用宿主已有 Playwright 时可把 `PLAYWRIGHT_MODULE` 设为其 `index.mjs` 绝对路径，截图写入本仓库忽略的 `output/webapp-qa/`。上述环境变量在 PowerShell 通过 `$env:变量名='值'` 设置。

## 已知不足

- 动作模型上的肌群发光按骨骼蒙皮权重分区（与官网一致），比 App 详情页的“柔边代理高亮”粗；精确分区在「肌群」人台上。
- 3D 拾取在同一骨骼上有多个肌群时按当前阶段主力优先，可能与用户想点的不一致；右侧列表可直接选。
- 网页版固定深色主题（App 有浅色/跟随系统）；训练图只用深色版 512px。
- 截图在软件渲染（swiftshader）下完成，未在真 GPU / 真手机测帧率；两个 WebGL 画布（舞台 + 小图）在低端设备上可选「省电」。
- 资源文件名无版本号：HTML/JS 缓存 5 分钟，模型/图片/字体缓存 1 天。
- 振动反馈（haptics）网页不提供；App 的相机 AI 本来就未实现（App 与网页均为自行确认），因此无需摄像头功能。
