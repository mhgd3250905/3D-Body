# Flare R12 · 右前臂局部回外修正

本轮修正用户指出的84.8%附近右小臂短促回外，仅让右臂83%～88%的向落点对准稍早配合伸肘。R11较长的屈伸过渡、47.2%/95%近直标准和总周期保持。左侧按自身换手时序检查，没有同类外摆，保持原路线。Astra实现和独立审查；具体结果与边界见 [R12记录](../../docs/flare-v42-r12-2026-10-15.md)。App保持L45/v41。

在仓库根目录使用已有依赖运行：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r12-20261015/flare-training-v42-candidate.glb --baseline output/flare-v42-r11-20261015/flare-training-v42-candidate.glb --out output/flare-v42-r12-20261015/geometry-training
python -m http.server 8875 --bind 127.0.0.1
```

8875若已服务本项目，直接复用。打开 `http://127.0.0.1:8875/output/flare-v42-r12-20261015/index.html`。默认左R11、右R12，停在84.8%；可回到82%播放，或将滑块调至36%～42%检查另一侧。可切首版R1、v41和两种人体，支持同阶段旋转、慢放、连贯播放与手腕路线。1.35秒一圈为设计节奏，默认2.7秒慢放。

`bake.mjs`写入R12独立输出目录；重做前先将需要保留的R12成品另存。`coordinated-transfer.mjs`保留R8制作逻辑，后续接撑调整另行后处理。原R1–R11输出、当前App和编辑器保持。

结构审计核对循环、骨长、接地及实际掌鞋蒙皮；独立审查对两侧对应阶段检查身体局部外摆，并核对保护区、肘角和掌朝向。右肩轴回外已消除，躯干轴仍有约0.357mm残余，详见记录。数值连续不等于观感自然，需结合实际播放采样。有限表面采样和截图不能证明连续全身无碰撞、完整人体动力学或观感已验收。最终文件身份见 [R12收据](evidence/delivery-r12.json)。历史代码、文档和收据保留。

人物源于Blender Foundation Snow，保留CC BY 4.0署名与许可，页面不依赖CDN。
