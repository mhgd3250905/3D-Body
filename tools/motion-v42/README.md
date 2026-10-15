# Flare R11 · 屈伸连续衔接

本轮按用户反馈，保留R10前段转运与后段直臂接撑，将中间屈肘到伸直的运动分配到更长的有效过渡时间。两侧一起处理，47.2%/95%的近直标准和总周期保持。Astra实现和独立审查；具体结果与边界见 [R11记录](../../docs/flare-v42-r11-2026-10-15.md)。App保持L45/v41。

在仓库根目录使用已有依赖运行：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r11-20261015/flare-training-v42-candidate.glb --baseline output/flare-v42-r10-20261015/flare-training-v42-candidate.glb --out output/flare-v42-r11-20261015/geometry-training
python -m http.server 8875 --bind 127.0.0.1
```

8875若已服务本项目，直接复用。打开 `http://127.0.0.1:8875/output/flare-v42-r11-20261015/index.html`。默认左R10、右R11，可切首版R1、v41和两种人体；支持同阶段旋转、慢放、连贯播放、手腕路线和43%/90%过渡定位。1.35秒一圈为设计节奏，默认2.7秒慢放。

`bake.mjs`写入R11独立输出目录；重做前先将需要保留的R11成品另存。`coordinated-transfer.mjs`保留R8制作逻辑，后续接撑调整另行后处理。原R1–R10输出、当前App和编辑器不被替换。

结构审计核对循环、骨长、接地及实际掌鞋蒙皮；独立审查检查有效伸展时长、速度分布、前后保护区、目标时刻已近直及两侧肘路。数值连续不等于观感自然，需结合实际播放采样。有限表面采样和截图不能证明连续全身无碰撞、完整人体动力学或观感已验收。最终文件身份见 [R11收据](evidence/delivery-r11.json)。历史代码、文档和收据保留。

人物源于Blender Foundation Snow，保留CC BY 4.0署名与许可，页面不依赖CDN。
