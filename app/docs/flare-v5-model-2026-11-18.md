# 托马斯（双腿伸直）V5

素材来自 [3D-Pose-Hub 的 V5 交付包](https://github.com/mhgd3250905/3D-Pose-Hub/blob/639cc5d58a29cc69352f972222bc68e58406e68b/handoff/flare-v5-2026-11-18.zip)，ZIP 的 MD5 为 `109bbf2136d7990ac5479d9c59fe3a0b`，包内 19 项校验通过。模型、发型和动作 JSON 按原字节收录在 `app/scene/public/v5/`。Three.js 使用项目已有的 0.170.0。

首页的「托马斯（双腿伸直）」打开独立实时 3D 舞台。每帧应用动作的主骨姿势，渲染前由 `wristfix-r2.js` 驱动 16 根辅助骨，再应用 toon-r6 和 FX。源动画为 162 帧、120 fps，0.5× 时一圈 2.7 秒。原首页 R17、角度训练和 Trainer SDK 仍沿用原入口及资源。

Chrome 以 390×844 从 App 首页进入，验证实际播放跨过循环接缝、暂停跳帧以及返回首页。第 40、92 帧截图已随飞书回复 `om_x100b60e5975a74a0cebbaf7c58f0c34` 发送。场景回归、15 项定向 Flutter 测试及改动范围静态分析通过。截图待验收，vc2059 Android 签名包及原生设备测试待进行。
