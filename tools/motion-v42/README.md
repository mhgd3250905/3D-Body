# Flare R8 · 整臂换位与下压接撑

本轮按用户最新反馈，重做游离臂的运动组织：肩带着弯臂一起换位，运输中肘角近似稳定，小臂和手掌提前对齐，再下压接撑。Astra负责实现与独立审查。当前为人工设计候选，真人对照、实际成品检查与限制见 [R8记录](../../docs/flare-v42-r8-2026-10-15.md)。App保持L45/v41。

在仓库根目录运行，使用已有根目录及 `app/scene` 依赖：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r8-20261015/flare-training-v42-candidate.glb --baseline output/flare-v42-20261015/flare-training-v42-candidate.glb --out output/flare-v42-r8-20261015/geometry-training
python -m http.server 8875 --bind 127.0.0.1
```

8875若已有本项目服务，直接复用。打开 `http://127.0.0.1:8875/output/flare-v42-r8-20261015/index.html`。默认左侧R7、右侧R8，可切换R1和v41、训练人台和卡通教练。支持同步旋转、同阶段拖动、慢放、连贯播放及可开关的手腕路线。候选clip为人工设计的1.35秒一圈，默认2.7秒慢放；该时长不是真人视频测量值。

`bake.mjs` 写入R8独立目录的两个人体GLB、预览、制作清单和采样。原App资产及R1–R7目录保留；复现前先将已有R8成品另存，避免覆盖需要保留的试验。制作器核对网格、蒙皮、材质、骨变换与输入哈希。`natural-motion.mjs` 与 `coordinated-transfer.mjs` 是离线制作代码。此前的 `r1-arm-refinement.mjs`、`compact-recovery.mjs` 保留为历史实现。

结构审计检查循环、骨长、掌鞋离地及181姿态全身蒙皮。R8独立审核额外检查运输期间的上下臂共转、掌面预对齐和落掌连续性，不能仅用肘角或旧版弯曲半空间判定真实。所有检查均有采样边界，不能证明连续全身无碰撞、人体动力学或用户已认可。历史审计脚本保留其原研究用途。

最终身份见 [R8收据](evidence/delivery-r8.json)，R1–R7证据仍在 `evidence/`。人物源于Blender Foundation Snow，保留原CC BY 4.0署名与许可。页面资源在本地，不依赖CDN。
