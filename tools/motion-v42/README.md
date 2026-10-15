# Flare v42 动作候选 · 第二轮轻回手修订

这是一份独立的动作优化研究版。当前 App 的 L45/v41、网页默认动作、个人编辑数据和训练视频继续使用原资产。

首版加入小幅胸髋分工、独立头颈跟随和腾空手臂回收。第二轮按用户“手臂弯曲刻意”的反馈，将回收幅度从21%降至3.5%，减少肘部外摆，并改为按每只手的离地/落地窗口连续轻收放。脚踝轨迹与低位支撑掌继承冻结 v41，通过手动双骨求解保持肢段长度。不是动作捕捉或动力学模拟。

在仓库根目录运行（已有根目录与 `app/scene` 的依赖即可，不联网加载模型）：

```powershell
node tools/motion-v42/bake.mjs
node tools/motion-v42/audit-candidate.mjs
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r2-20261015/flare-training-v42-candidate.glb --baseline app/scene/source/coach/flare-coach-v41-training-human-collarfix-20261013.glb --out output/flare-v42-r2-20261015/training-audit
python -m http.server 8875 --bind 127.0.0.1
```

若 8875 已有本项目服务，直接复用。浏览器打开 `http://127.0.0.1:8875/output/flare-v42-r2-20261015/index.html`。

预览默认左边是保留的首版 v42，右边是第二轮修订，也可将左侧切回 v41。两边使用对应的动作阶段、相同人物、相同相机与周期时长。若本地没有首版输出，则自动使用 v41 对照。候选 clip 为人工设计的 1.35 秒一圈，预览默认放慢到 2.7 秒；该时长不是从真人视频精确测得。

`bake.mjs` 只向 `output/flare-v42-r2-20261015` 写入两种人物的候选 GLB、预览和制作清单，首版 `output/flare-v42-20261015` 保留。它在既有两种已验收人物的副本中替换动画，读回检查几何、蒙皮属性、材质与骨变换，并保留输入文件哈希。`natural-motion.mjs` 不安装到现有 App 或编辑器。

`audit-candidate.mjs` 直接采样成品 GLB 的实际骨矩阵与蒙皮顶点，比较循环、骨长、掌鞋离地、胸髋/头颈/肘角与速度变化；接触按几何判定，不把 `handLocked` 当成真实受力。通过这些检查不等于真人技术、全时刻碰撞或设备验收。

当前制作与验收见 [第二轮记录](../../docs/flare-v42-r2-2026-10-15.md)，历史见 [首版记录](../../docs/flare-v42-candidate-2026-10-15.md)。人物源于 Blender Foundation Snow，保留项目原 CC BY 4.0 署名与许可。
