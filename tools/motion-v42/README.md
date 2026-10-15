# Flare R10 · 接地前完成伸肘

本轮按用户反馈，把左47.2%及另一侧对应阶段改为已接近伸直，并优化左43%～45%和对侧的肘部衔接。保持自然肩部外观，允许后期整臂协同调整，避免只伸小臂引起临地回抽。Astra实现和独立审查；具体结果与边界见 [R10记录](../../docs/flare-v42-r10-2026-10-15.md)。App保持L45/v41。

在仓库根目录使用已有依赖运行：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r10-20261015/flare-training-v42-candidate.glb --baseline output/flare-v42-r9-20261015/flare-training-v42-candidate.glb --out output/flare-v42-r10-20261015/geometry-training
python -m http.server 8875 --bind 127.0.0.1
```

8875若已服务本项目，直接复用。打开 `http://127.0.0.1:8875/output/flare-v42-r10-20261015/index.html`。默认左R9、右R10，可切首版R1、v41和两种人体；支持同阶段旋转、慢放、连贯播放、手腕路线和47.2%/95%定位。1.35秒一圈为设计节奏，默认2.7秒慢放。

`bake.mjs`写入R10独立输出目录；重做前先将需要保留的R10成品另存。`coordinated-transfer.mjs`保留R8制作逻辑，后续接撑调整另行后处理。原R1–R9输出、当前App和编辑器不被替换。

结构审计核对循环、骨长、接地及实际掌鞋蒙皮；独立审查逐姿态检查目标时刻已近直、之后有无回弯、两侧肘路及手姿变化。上臂微调不再被错误当成失败，肩部自然度仍须实际图像核对。有限表面采样和截图不能证明连续全身无碰撞、完整人体动力学或观感已验收。最终文件身份见 [R10收据](evidence/delivery-r10.json)。历史代码、文档和收据保留。

人物源于Blender Foundation Snow，保留CC BY 4.0署名与许可，页面不依赖CDN。
