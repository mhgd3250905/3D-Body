# R17 独立运动学审计

从仓库根目录运行，使用项目已有 Node.js / Three.js 依赖。只读实际 GLB；每次报告写到新建的 `output/r17-<脚本>-<UTC时间>`，也可用 `--out output/<新目录>` 指定。拒绝复用已有报告目录，不改冻结批次或 App。

`verify-r17.mjs` 默认对照 R16 和最终 `output/flare-v42-r17-20261017` 两个人体，各采样10001相位，检查：

- 起手0–8%右肘、50–58%左肘，以及R16原落手93.7–99.8%左肘、43.7–49.8%右肘。
- 支撑腕、肩颈相对躯干、臂段长度和修改区外骨姿态保持。
- 0/1循环位置与旋转闭合，LoopRepeat与显式相位LoopOnce一致。

```
node tools/motion-v42-r17/audit/verify-r17.mjs
node tools/motion-v42-r17/audit/verify-r17.mjs --candidate output/flare-v42-r17-20261017 --check-paths
```

`--candidate`可指定另一个待查批次。`--check-paths`只校验输入存在并输出哈希，不创建目录、不重跑数值采样。GLB文件须命名为 `flare-training-v42-candidate.glb` 与 `flare-coach-v42-candidate.glb`。

`audit-loop.mjs`用于详细诊断：比较R14、R15、R16及candidate，在循环95–100%→0–5%以0.01%步长采样，记录肘角、位置、旋转和首尾双侧速度，并输出CSV。默认candidate同样为最终R17。

```
node tools/motion-v42-r17/audit/audit-loop.mjs --candidate output/flare-v42-r17-20261017
```

`audit-source.mjs`保留根因复现：固定调用R16制作源与R14输入，比较R16实际GLB及乱序拖动；默认candidate为R16，请勿把R17与R16制作源的差别当作烘焙错误。

```
node tools/motion-v42-r17/audit/audit-source.mjs
```

这组脚本复核C0位置/旋转闭合，并量化首尾速度差；**不宣称C1速度连续**。当前R17右肘首尾速度差约0.04644m/s，修复目标是消除起手约13°的额外压弯。蒙皮表面接地/穿透由独立surface检查覆盖，这里不作动力学或完整视觉验收。

原诊断与trial01报告保留在 `output/r17-loop-audit-20261017`。移入本目录只调整入口路径、参数和报告输出位置；原已通过数值不重复计次。
