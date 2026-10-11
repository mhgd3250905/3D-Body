# L40三视图及高密度渲染

Chrome 394×853、DPR3.25实景，页面浅色、相同phase15/time6.052980132450331；手机视觉由用户验收。

- [L39旧分辨率](home-before.png) / [L40首页](home-after.png)：相同暂停帧/相机，画布591×1117→1182×2235。
- [详情动作](detail-motion.png)：全身、原肌群/衣服与机位保留，3×密度。
- [详情站立](detail-standing.png)：默认完整头脚、双侧当前肌群，3×密度。
- [站立放大后拖动旋转](detail-standing-drag.png) / [双触点放大](detail-standing-pinch.png)：交互有效且仍高密度；放大查看局部可使头脚超出画面。

首页/详情/站立buffer保持同一尺寸，返回原动作恢复同一机位与暂停时刻。console error/warn为0。浏览器触摸模拟不替代原生手势/FPS/温度验收，安装/启动证据与当前版本见[verification](../../verification.md)。
