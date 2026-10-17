# Flare v42 / R16 支撑肘修复

R16 是用户反馈 R15 支撑肘回弯后的定点修复，仍待用户复核观感。原 R15 已认可文件和 `motion-v42-r15` 标签保持；R16 的数值检查通过不等于新一轮用户验收。

R15 在右手落地前仍对自由臂提前取样，两臂可达范围求解把上身下移约 6.39 mm，使左支撑肘在 96.67% 弯到 161.30°。另一侧也存在同源问题。R16 仅让自由臂微调在半周期的 39%–42.5% 平滑退回原时序；即全周期 89%–92.5% / 39%–42.5%，落手时不再挤短支撑臂。保留自然 177° 微屈，不强制过伸。

两人体实际 GLB 各 10001 相位独立核对：93.7%–99.8% 左肘为 176.8941°–177.0002°；另一半右肘为 176.9402°–177.00°。问题段支撑腕位置和修改区外骨位置相对 R15 均保持，循环位置缝为 0。另以两人体各 1081 相位检查骨长、肩颈连接与掌/鞋/肘蒙皮接地，未发现新增阻断。报告见 `releases/r16-evidence/`，最终两 GLB 与已检查 trial01 逐字节一致。

## 复现与核对

在根目录及 `app/scene` 安装锁文件依赖，并恢复冻结清单中的 R14 输入；R16 继承 R15 的制作源码，仍从同一冻结 R14 生成，避免重复叠加 R15 修正。

```powershell
node tools/motion-v42-r16/bake.mjs --out output/flare-v42-r16-rebuild-new
node tools/motion-v42-r16/verify-release.mjs --dir output/flare-v42-r16-rebuild-new
node app/scene/tools/integrate-v42-r16.mjs --from output/flare-v42-r16-rebuild-new
node app/scene/tools/verify-v42-r16-assets.mjs
```

烘焙拒绝覆盖已有批次；集成入口仅接受清单中两份精确 SHA。`verify-release.mjs` 只读核对资产、输入和制作/证据身份。新动作默认输出 `output/flare-v42-r16-20261017`；时钟仍为 541 姿态、1.35 秒、0–9 教学域。

[R15 / R16 对照](http://127.0.0.1:8877/r16-preview/) 默认 96.7%，提供 93.7% / 96.7% / 99.8% 快捷定位。左为原 R15，右为 R16；两者按真实文件哈希加载。预览源码在 `preview/`，本机页面带 vendor/资产，原 R15 页面保留。

本地 ZIP 归档与回读收据位于 `output/releases/Flare-v42-R16-support-elbow-fix-20261017.*`。Git 标签 `motion-v42-r16` 定位本轮源码；运行依赖未打入归档，重新制作仍需该 Git 版本与锁定依赖。App 接入与设备事实见 [L49 记录](../../app/docs/l49-motion-v42-r16-2026-10-17.md)。
