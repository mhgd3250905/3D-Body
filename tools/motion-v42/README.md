# Flare v42 动作候选 · 贴身换手

第五轮以用户较认可的首版 `bccd764` 为底，重做游离手臂的回收、前后转移和接撑路线。手进入肋侧通道，绕过躯干后送向下一落点；保留首版身体、腿路、支撑点及接触时间。原App仍为L45/v41，个人编辑数据和训练视频保持。

在仓库根目录运行，使用已有根目录与 `app/scene` 依赖，所有网页资源来自本地：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r5-20261015/flare-training-v42-candidate.glb --baseline output/flare-v42-20261015/flare-training-v42-candidate.glb --out output/flare-v42-r5-20261015/geometry-final-training
node tools/motion-v42/audit-compact-recovery.mjs
python -m http.server 8875 --bind 127.0.0.1
```

8875若已有本项目服务，直接复用。打开 `http://127.0.0.1:8875/output/flare-v42-r5-20261015/index.html`。默认左侧首版、右侧贴身换手，支持v41对照、两种人物、同步旋转、阶段拖动、慢放和可开关的手腕轨迹线。没有首版输出时左侧自动回退v41。候选clip为人工设计的1.35秒一圈，预览默认放慢到2.7秒；时长不是真人视频测量值。

`bake.mjs` 只向 `output/flare-v42-r5-20261015` 写入两种人物的候选GLB、预览、制作清单和路线采样。它在既有人物副本中替换动画，读回核对网格、蒙皮、材质、骨变换与输入哈希。原资产与各轮历史目录保留。`natural-motion.mjs` 和 `compact-recovery.mjs` 是离线制作代码，没有安装到现有App或编辑器。

`audit-candidate.mjs` 检查成品GLB的循环、骨长、掌鞋离地及181姿态蒙皮。`audit-compact-recovery.mjs` 比较R1和当前成品的躯干局部腕路、弯曲侧、身体/支撑保持、持续接近落点的时刻及路线速度，并检查选定相位手与头/躯干/腿的三角面。它们不证明真人技术、连续全身无碰撞或动力学正确。完整命令参数与采样边界见脚本和输出JSON。

当前记录见 [R5贴身换手](../../docs/flare-v42-r5-2026-10-15.md)，可保存的身份摘要见 [第五轮收据](evidence/delivery-r5.json)。`audit-elbow-direction.mjs` 与 `audit-shoulder-recovery.mjs` 保留对应历史候选的核对用途。人物源于Blender Foundation Snow，保留项目原CC BY 4.0署名与许可。
