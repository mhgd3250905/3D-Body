# 2000 · 姿势/动画编辑

同一个编辑器的 2000 模式，预载 Pose-Hub 2000 r7 的关键帧（站立起势 → 右手撑地抡腿 → 分腿倒立 → 叠手并腿旋转 → 原路落地）。

## 打开

- 本地：`npm run dev:2000`（或 `npm run dev` 后打开 `http://127.0.0.1:8810/?move=2000`）。
- 独立构建：`npm run build:2000` 输出 `dist-2000/`，不带参数也直接进入 2000；`?move=flare` 回到托马斯。
- 默认 `npm run build` / 托马斯页面不受影响。

## 数据隔离

2000 模式下页面读写的所有本地存储都加 `b2000:` 前缀（`src/move-2000.js`），托马斯的个人步骤、草稿、K 帧和正式展示不会被读取或改写。

## 用法

与托马斯编辑器相同：动作分解看播放；“姿势编辑”拖控制点、固定手、保存步骤；“动画编辑”点白色菱形改原关键帧（K / 更新原关键帧），在两帧之间 K 中间帧；“导出动画 JSON”带出全部关键帧与 K 帧。

- 关键帧时间等距（每帧约 0.123 s，整段 4.81 s），最后一帧与第一帧同为站立，循环处是一次停顿。
- 旋转段每帧身体转角 ≤ 80°，插值不会反向。
- 2000 模式关闭托马斯专用的平滑循环修正、数学轨迹试验、v41/v42 切换和教学节点；播放走编辑器本身的逐帧插值。

## 回到 Pose-Hub

`tools/move-2000/from_editor.py <导出.json> public/coach/coach-rig.json <keys.json>`：把动画 JSON（含 K 帧）、正式展示或步骤库转换成 Pose-Hub 通道（pelvis、pelvisQ、spine、Wrist、Elbow、Ankle、Knee、Toe/Sole、Fing/Palm、Locked），世界坐标，旋转角已烘焙（th = 0），腿长换回 r7 骨架。

`tools/move-2000/to_editor.py` 从 Pose-Hub 逐帧结果（npz）重新生成 `public/coach/move-2000-sequence.json`。
