# Flare R9 · 提前伸肘接撑

本轮保持用户已认可的R8肩、躯干和上臂轨迹，只提前换位后的前臂伸展，并检查落掌前的轻微回摆。Astra实现和独立审查；具体结果与边界见 [R9记录](../../docs/flare-v42-r9-2026-10-15.md)。App保持L45/v41。

在仓库根目录使用已有依赖运行：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r9-20261015/flare-training-v42-candidate.glb --baseline output/flare-v42-r8-20261015/flare-training-v42-candidate.glb --out output/flare-v42-r9-20261015/geometry-training
python -m http.server 8875 --bind 127.0.0.1
```

8875若已服务本项目，直接复用。打开 `http://127.0.0.1:8875/output/flare-v42-r9-20261015/index.html`。默认左R8、右R9，可切首版R1、v41和两种人体；支持同阶段旋转、慢放、连贯播放、手腕路线和用户截图附近的39.1%/84.3%定位。1.35秒一圈为设计节奏，默认2.7秒慢放。

`bake.mjs`写入R9独立输出目录；重做前先将需要保留的R9成品另存。`coordinated-transfer.mjs`保留R8制作逻辑，`reach-preparation.mjs`在其后单独处理前臂。原R1–R8输出、当前App和编辑器不被替换。

结构审计核对循环、骨长、接地及实际掌鞋蒙皮；独立审查逐姿态检查上臂完整变换/肘位置保持、伸肘时间、手姿回摆与腕速变化。有限表面采样和截图不能证明连续全身无碰撞、完整人体动力学或观感已验收。最终文件身份见 [R9收据](evidence/delivery-r9.json)。历史代码、文档和收据保留。

人物源于Blender Foundation Snow，保留CC BY 4.0署名与许可，页面不依赖CDN。
