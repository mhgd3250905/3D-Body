# Flare R7 · 首版基础上的换手调整

本轮以用户更认可的R1为基底，由Astra重新核对需求与制作游离臂候选：上臂适度靠身、避腿时腕稍向头部收、连续展开接下一支撑。具体实现、检查和限制见 [R7记录](../../docs/flare-v42-r7-2026-10-15.md)。原App仍为L45/v41。

在仓库根目录运行，使用已有根目录及 `app/scene` 依赖：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r7-20261015/flare-training-v42-candidate.glb --baseline output/flare-v42-20261015/flare-training-v42-candidate.glb --out output/flare-v42-r7-20261015/geometry-training
node tools/motion-v42/audit-compact-recovery.mjs
python -m http.server 8875 --bind 127.0.0.1
```

8875若已有本项目服务，直接复用。打开 `http://127.0.0.1:8875/output/flare-v42-r7-20261015/index.html`。默认左侧R1、右侧R7，可切换R6和v41、训练人台和卡通教练。支持同步旋转、同阶段拖动、慢放、连贯播放和可开关的手腕路线。候选clip为人工设计的1.35秒一圈，默认2.7秒慢放；该时长不是真人视频测量值。

`bake.mjs` 只写入R7独立输出目录的两个人体GLB、预览、制作清单和采样；原App资产及R1–R6目录保留。它读取原人物副本并替换动画，核对网格、蒙皮、材质、骨变换与输入哈希。`natural-motion.mjs` 和 `r1-arm-refinement.mjs` 是离线制作代码，没有接入当前App或原编辑器。`compact-recovery.mjs` 保留为历史实现，R7不再调用。

结构审计检查循环、骨长、实际掌鞋离地及181姿态全身蒙皮。换手审计比较R1与当前成品的身体保持、接触、腕路、弯曲方向和指定相位三角面。数值检查不能替代自然度验看，也不能证明连续全身无碰撞、人体动力学或用户已认可。各历史审计脚本保留原研究用途。

最终身份见 [R7收据](evidence/delivery-r7.json)，历史R1–R6证据仍在 `evidence/`。人物源于Blender Foundation Snow，保留原CC BY 4.0署名与许可。所有页面资源在本地，不依赖CDN。
