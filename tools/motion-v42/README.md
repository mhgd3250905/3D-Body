# Flare v42 / R12 · 已认可动作版本

2026-10-15用户认可R12当前没有明显动作问题。当前制作链、12轮历史、版本标签与边界见[动作版本记录](../../docs/flare-v42-release-2026-10-15.md)，固定身份见[冻结清单](releases/v42-r12.json)。App仍L45/v41，独立动作尚未接入默认播放。

## 新拉取分支后复现

在项目根目录运行。已用Node.js 24.15.0 / npm 11.8.0验证；根目录和`app/scene`均有锁文件，需要各装一次依赖。安装需要下载包，此后制作/预览使用本地资源，没有CDN。

```powershell
npm ci
npm --prefix app/scene ci
node tools/motion-v42/bake.mjs --out output/flare-v42-r12-review
node tools/motion-v42/verify-release.mjs --dir output/flare-v42-r12-review
node tools/motion-v42/verify-lateral-transition.mjs output/flare-v42-r12-review/flare-training-v42-candidate.glb
python -m http.server 8875 --bind 127.0.0.1
```

8875若已服务本项目，直接复用。打开`http://127.0.0.1:8875/output/flare-v42-r12-review/index.html`。默认停在84.8%，可从82%播放，36%～42%为另一侧对应阶段。支持两人体、同阶段旋转、四档节奏与手腕路线；1.35秒是设计周期，默认2.7秒慢放。

`--out`仅允许项目`output/`的直接子目录。已有GLB或制作清单的批次会拒绝覆盖，重复复现须换新批次名。省略参数时使用原R12目录，在当前作者工作区会因成品已存在而拒绝覆盖。原R1–R12成品不重写。

R11、R1历史参考分别检查；缺失项禁用且不请求，仍可与已跟踪的v41比较。只有本机存在对应历史GLB时才能选它；历史收据中的output路径不表示这些大文件已加入Git。原验收对照保留在`output/flare-v42-r12-20261015/`。

## 实际GLB审计

以下完整结构命令明确以v41为基线，不依赖历史output；报告保存到刚创建的新批次。包括循环、骨长、接地及实际掌鞋蒙皮，不等于完整动力学证明。

```powershell
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r12-review/flare-coach-v42-candidate.glb --baseline app/scene/source/coach/flare-coach-v41-animated.glb --out output/flare-v42-r12-review/geometry-coach
node tools/motion-v42/audit-candidate.mjs output/flare-v42-r12-review/flare-training-v42-candidate.glb --baseline app/scene/source/coach/flare-coach-v41-training-human-collarfix-20261013.glb --out output/flare-v42-r12-review/geometry-training
```

无参数审计默认原R12教练；若无R11教练，则明确回退已跟踪v41教练。自行指定其他体型时应配套指定`--baseline`，日志和报告记录实际路径。显式指定但不存在的基线会报错。已有报告应保留，使用新的`--out`保存复核结果。

侧向检查以实际GLB对右82%～88%和左36%～42%各采241点，检查两个身体局部外侧轴；可加`--baseline output/flare-v42-r11-20261015/flare-training-v42-candidate.glb`对照。R12右躯干轴残余约0.357mm已披露，阈值是版本回归界限，不是人体运动标准。

## 保存与限制

版本验证器只读比较两个GLB的字节数及SHA；新批次已确认与`fc91c7f`认可版完全相同。Git内附[r12-evidence](releases/r12-evidence/)关键审查、结构报告和截图；[原R12收据](evidence/delivery-r12.json)保留首次交付时的历史状态。

原网页兼容构建可用`npm run build -- --outDir output/<新的检查目录>/dist`，该dist不是R12预览的独立打包。离线预览须保留仓库、安装好的本地依赖及生成批次，通过本地HTTP服务加载。

历史`audit-compact-recovery`、`audit-elbow-direction`、`audit-shoulder-recovery`及早期helper仅用于旧实验，不应作为当前默认流程裸跑。有限表面采样和截图不证明连续全身无碰撞或全设备表现。人物来自Blender Foundation Snow，原CC BY 4.0署名与许可保持。
