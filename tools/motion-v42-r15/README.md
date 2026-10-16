# R15 · 已认可的胸髋与手臂优化

2026-10-17，用户确认“现在已经很好了”，要求做好R15版本管理。R15成为最新已认可的独立动作，标签 `motion-v42-r15`；后续在R15基础上另建批次。App保持 L47 / v42-R12，R14与旧资产保留。用户取消了新增腿部专项对比，不将该项记为完成。

已认可批次：`output/flare-v42-r15-20261017`，两人体、22 骨、44 轨、541 姿态、1.35 秒一圈。预览：[R14 / R15 同相位对比](http://127.0.0.1:8877/r15-preview/)。当前身份见[版本记录](../../docs/flare-v42-r15-release-2026-10-17.md)与[冻结清单](releases/v42-r15.json)，原制作分析及验证边界见 [R15 预览记录](../../docs/flare-v42-r15-preview-2026-10-17.md)。

## 制作

在本项目根目录、已安装的 Node 依赖环境运行：

```powershell
node tools/motion-v42-r15/bake.mjs --out output/flare-v42-r15-next-review
node tools/motion-v42-r15/verify-candidate.mjs --dir output/flare-v42-r15-next-review
```

必须使用新批次目录；baker 拒绝覆盖已烘焙批次，先核对两份冻结 R14 GLB 的 SHA-256。输入还包括 R14 时钟、恢复数据及 v41 原始骨架。模型来源与许可沿用 Snow / Blender Foundation CC BY 4.0；网格、蒙皮和材质逐项核对保持。

`reference-motion.mjs` 从冻结 GLB 采样，源采样场景与输出场景分开。侧撑整体绕支撑腕倾转，掌面保持原锚点；小腿不另外弯曲，鞋底间隙不足时整腿绕髋抬起。手臂轻微重定时，肩点始终附着躯干；双臂可达性通过有上限的身体微移和保长两骨求解处理。换手前后恢复原时间映射导数，避免近伸直肘的快速屈曲。

`contactOverlapPhase` 仅为原始映射参数，最终另受 `contactTimingBlendPhase` 平滑；不能把它解释为实际双撑时长。最终版没有追求视频中较长的双撑停留，接地窗口接近 R14。

验证器读取真正导出的两份 GLB，各取 1081 个相位，包括烘焙帧中点。检查循环缝、实体肢段长度、肩/颈/头相对躯干刚性、换手连续性、掌/鞋/肘蒙皮接地及手腿广相距离。几何近地和距离筛查不能证明受力、动力学或连续全身无碰撞。

## 本机预览

服务根为 `E:\AII-MotionLab\reference-viewer-20261017`，启动入口 `E:\AII-MotionLab\tools\launch-reference-viewer.ps1`，仅监听 `127.0.0.1:8877`。全部依赖本地加载。

发布新候选到隔离预览副本：

```powershell
& 'E:\AII-MotionLab\reference-viewer-20261017\r15-preview\publish-candidate.ps1' -SourceBatch 'E:\AII-3D\3D-Body\output\flare-v42-r15-next-review'
```

页面左侧冻结 R14，右侧候选；可切两人体、同步旋转、相位、慢放与蓝衣参考查看节奏。蓝衣视频按同侧支撑镜像，未做精确机位或三维配准。1.133 秒选项仅改变观看速度，GLB 保持 1.35 秒。

trial01–04 保留探索记录；本次已认可批次与通过检查的trial04两GLB字节一致。旧报告中的待验收字样是当时事实，以新增认可清单说明当前身份；中间试稿不作为选版。

## 版本校验与备份

```powershell
node tools/motion-v42-r15/verify-release.mjs
```

校验当前两GLB、必要输入、制作源及精选证据。`--dir output/<新批次>` 可核对另存复现的两GLB是否与已认可资产一致。不得覆盖已认可的输出目录、制作源或清单；新制作放新版本目录。

本地备份为 `output/releases/Flare-v42-R15-accepted-20261017.zip`，同名 `.receipt.json` 记录ZIP和逐成员回读结果及Git身份。保存脚本 `archive-release.py` 只创建新ZIP，拒绝覆盖。包含独立预览及必要R14输入，不包含Node/Python运行环境；烘焙仍依赖同标签仓库与已安装依赖。大资产和ZIP留E盘，Git保存制作源、页面、身份与精选证据。
