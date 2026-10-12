# FlareLab · 托马斯训练助手 官网

产品展示官网，线上地址：**https://flare.uuugk.win/**（备用：https://flarelab.294851575.workers.dev）

- 中文名：托马斯训练助手；英文名：FlareLab — Thomas Flare Trainer
- 目标：介绍 App、招募内测（报名邮箱 mhgd3250905@gmail.com / 294851575@qq.com，iOS TestFlight、Android Google Play 内部测试）
- 托管：Cloudflare Worker `flarelab`（账号 36f7672020cfc6c515e198c5786d99da），自定义域名 `flare.uuugk.win`；主域名 `uuugk.win` 另有用途，未改动

## 页面结构

| # | 板块 | 内容 |
|---|---|---|
| 0 | 首屏 | 实时 WebGL：Snow 教练在打光舞台上循环 v41 托马斯（橙色轮廓光、投影、地面圆环、火星粒子、手脚拖尾），可拖动旋转；右下角实时阶段 |
| 01 | 八个阶段 | 滚动驱动：动画逐帧推进、镜头环绕约 300°，超大阶段编号 + 中英阶段名 + 8 段进度条 |
| 02 | 发力同步 | 身体切换 X 光材质，沿用 App 的阶段→肌群数据（17 块肌群，支撑/核心/腿部，按支撑手区分左右），主要发力亮橙、协同较暗 |
| 03 | 硬性标准 | 身体上实时标注膝角 / 支撑肘角；直腿 ≥176°、折髋 ≥50°、支撑臂伸直、节奏均匀；整圈膝角曲线 |
| 04 | 学习闭环 | 看 → 懂 → 练 → 测（v1.1）→ 解锁 |
| 05 | 产品界面 | 4 台悬浮手机截图，视差滚动（设计稿） |
| 06 | 训练库 | 51 个训练 A/B/C 三档走马灯 |
| 07 | 数字 | 8 / 17 / 51 / 40+ 计数动画 |
| 08–10 | 适用人群 / FAQ / 报名内测 | mailto 预填主题“托马斯训练助手 内测报名” |

加载时 000→100 计数；WebGL 不可用或 15 秒未加载完成时自动降级为循环动图。手机（390×844）单独排版。

## 目录

```
website/flarelab/
  src/           main.js（Three.js 场景、滚动叙事、肌群发光、角度标注）、index.tpl.html、flare-data.json（阶段/肌群数据）、drills.json、img/
  coach.glb      压缩后的教练模型（7.5MB → 725KB：去掉口腔牙齿、网格简化 45%、meshopt + 量化）
  build.py       生成 dist/：渲染模板、esbuild 打包、字体子集化、拷贝资源
  deploy.py      把 dist/ 打成单个模块化 Worker（资源作为二进制模块内嵌）并上传
  dist/          当前线上版本的构建产物
  shots/         线上截图（桌面 1440×900、手机 390×844）
```

## 构建与部署

```bash
npm ci                                   # 仓库根目录，提供 three 与 esbuild
python website/flarelab/build.py            # 默认复用 src/fonts/ 内已入库的当前字体子集，Windows/Linux 均可
FONTS_DIR=/path/to/fonts python3 website/flarelab/build.py   # 可选重新子集化：原始三种字体 + fonttools、brotli
CLOUDFLARE_API_TOKEN=xxx python3 website/flarelab/deploy.py  # 需 Workers Scripts:Edit
```

默认构建不需要下载字体、创建软链接或全局 esbuild；根目录锁定的 Vite 依赖提供 esbuild。`src/fonts/` 的四个字体输入与原线上版本一致，许可全文在 `src/fonts/licenses/`。调整显示文字时应通过 `FONTS_DIR` 重新生成所需字形，并更新这里的字体输入。

- 免费版 Worker 上限约 3MB（gzip），当前 65 个文件、原始 2.29MB、gzip ≈ 1.56MB。
- 不用 Pages / Workers Assets：现有 token 没有 Pages 权限，且 assets 上传流程在 Hark 环境中会被注入的 token 覆盖。
- 全部自托管（无 Google Fonts / CDN），方便国内访问；字体按页面用字子集化，合计约 220KB。

## 推进记录（2026-10-12）

1. 08:49 确认 App 还没有官网；定名：中文“托马斯训练助手”，英文 FlareLab（Thomas Flare Trainer）。
2. 08:51–09:17 第一版：Hark 默认版式的双语落地页（暗色潮流风），部署到 workers.dev。
3. 09:54 用户反馈“够用但很丑，要艺术化、有设计感、充分利用 3D”。
4. 10:35 第二版（本目录）：实时 3D + 滚动叙事 + X 光肌群 + 实时角度标注，替换上线；桌面与手机截图逐张检查。
5. 11:08 绑定自定义域名 flare.uuugk.win（HTTPS 自动签发），用户确认效果“很好”。

## 已知不足 / 后续

- 截图在软件渲染下完成，尚未在真 GPU / 真手机上测帧率；低端安卓可能需要降阴影和像素比。
- 肌群发光按骨骼蒙皮权重分区，比 App 的精细解剖网格粗（解剖数据 20MB 放不进 Worker）。
- 折髋按“躯干线与大腿夹角”计算；双手支撑时支撑肘取弯曲较大的一侧——数值满足规则，但口径可能与 App 内部算法不同。
- 面部网格简化，特写略粗。
- 资源文件名无版本号：图片/字体/模型缓存 1 天，HTML/JS 缓存 5 分钟。
