# R16 支撑肘修复对照页

本页状态为待用户复核；左侧 R15 原版，右侧 R16 修复，默认暂停于 96.7%，提供 93.7% / 96.7% / 99.8% 快捷阶段。两种人体、播放相位和视角联动；浏览器读取两侧 GLB 时核验实际字节哈希。R15 原预览页及冻结资产保留。

部署目录：`E:/AII-MotionLab/reference-viewer-20261017/r16-preview`，本地入口 `http://127.0.0.1:8877/r16-preview/`。本目录保存页面和发布工具源码，`vendor/` 沿用 R15 页的本地 Three.js 文件，不使用 CDN；原参考视频复制到新页，默认折叠。

`assets/r15-training.glb` 和 `r15-coach.glb` 来自冻结 `output/flare-v42-r15-20261017`，哈希见 `manifest.json`。在上述部署目录运行 `publish-candidate.ps1` 将 `output/flare-v42-r16-20261017` 两人体复制为 `assets/r16-*`，生成待复核 `candidate-manifest.json`。发布前可用 `-CheckOnly`。发布器限定本地目录并核验 R15 基线，不修改制作源或 App。

App 启动剪影另由 `app/tools/render-flare-loading.mjs` 和 `encode-flare-loading.py` 读取最终 R16 卡通 GLB 生成，复现命令及哈希见 `app/assets/brand/flare-loading-v42-r16.json`。离线渲染输出位于 `output/flare-loading-v42-r16-20261017/three`，包括 32 帧透明图和接触表；不以该素材核验替代 App 或用户验收。
