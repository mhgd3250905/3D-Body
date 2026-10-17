# v42：App 与网页动作展示

## 当前：L49 / v42-R16（2026-10-17）

用户明确要求将已认可R15用于App，首次接入为L48 / 1.0.5+7；随后指出93.7%–99.8%左支撑肘回弯。现用定点修复R16，L49 / 1.0.6+8已同签名保留数据安装。七形象的首页/详情、网页新默认和32帧启动剪影统一R16，22骨/44轨/541姿态、1.35秒及0–9非线性教学时钟保持。当前来源为[清单](../scene/tools/v42-r16-source-manifest.json)，复现用 `node app/scene/tools/integrate-v42-r16.mjs --from output/flare-v42-r16-20261017`，资产核对用 `node app/scene/tools/verify-v42-r16-assets.mjs`，制作入口见[R16工具](../../tools/motion-v42-r16/README.md)。

网页原保存R12、R15按各自真实GLB和时钟播放；新默认为R16，显式“采用v42 R16默认动作”先独立备份并保留撤销和个人K库。App只烘焙播放，不运行实时IK。教学阶段是功能关联，换手阶段不代表全段实测双手承重。原51视频、个人数据、R12/R15原资产和历史批次保持。当前验证与限制见[L49记录](l49-motion-v42-r16-2026-10-17.md)；下方R12内容保留为历史接入记录。

2026-10-15，用户在确认 R12 动作并合并 PR #114 后，明确授权将它更新到 App。动作展示首次接入身份为 **L46 / 1.0.3+5 / v42-R12**；当前性能交付为 **L47 / 1.0.4+6 / v42-R12**，已保留数据安装，用户已测试使用L47，并要求保存本版，见[L47记录](l47-performance-2026-10-15.md)。动作合约保持。本记录覆盖原 v41 合约中默认动作版本的描述；原 v41 来源、制作镜像、资产、个人动作和编辑器保留。

## 动作与资产

采用 [R12 冻结清单](../../tools/motion-v42/releases/v42-r12.json)，动作来源 `fc91c7f4cf95b77db4f0d79c74ad865bedcc6f96`，PR #114 合并为 `887d6e3`。两个人体仍是既有卡通教练和领口修复训练人台，22 骨、44 轨、541 帧、1.35 秒循环，保留历史 clip 名 `flare_v42_candidate_loop`。

教练 GLB SHA256 为 `3bc56bdca613368149107ea2211f93402baf52ae14b093932f6025d17ddacf0d`，训练人台为 `188767d3219851b1faa751d81c4dce029c3d9fb7b693d5ad627ce646c469c2c8`。运行版仅无损 meshopt 编码及 gzip，网格、材质、蒙皮、逆绑定与动画时间/值逐项核对；来源见 [接入清单](../scene/tools/v42-r12-source-manifest.json)。

App 七种已保存形象复用对应 R12 底模。首页、肌群动作详情及交换/返回共用 AnimationMixer 状态，不再运行源 IK 或节奏积分。站立肌群人台和现有 51 项训练视频保持；本次不重制视频。

## 时间与肌群阶段

Flutter bridge、课程和既有记录保留 0–9 的教学序列域。`scene/src/v42-clock.json` 将此序列域双向映射到 R12 的 1.35 秒片段；映射来自已认可制作批次的 `baselineSequenceTimes`，不能以均匀 0–9 插值或沿用 v41 的帧下标代替。

播放速度只作用一次，1 倍一圈为 1.35 秒，默认 0.5 倍为 2.7 秒。定位、单段循环、后台暂停、角色切换及详情返回仍保存教学时间。原 v41/v38 片段显式选择各自历史时钟，不受新默认影响。

R12 每个制作帧按其原序列时刻重新采样教学阶段和肌群侧别。关键姿势仍为原 9–16 步；教学阶段按相邻关键姿势中点切换，v42 在这些边界精确裁决，避免帧取整造成提前或延后显示。功能色区仍表示教学关联，不是肌电数值或精确解剖配准。

拖尾和掌撑波纹由 R12 片段重新采样；时间窗按循环比例缩短，保持原先短段轨迹的范围。暂停、进入详情、选择肌群与减弱动态效果下的淡出保持。新启动剪影直接渲染同一教练 R12，32 帧透明 WebP、1350ms 循环；旧 v41 剪影另存保留。

## 网页与个人动作

网页内置默认展示使用相同教练 R12 GLB 和相同非线性时钟。原编辑器和可编辑关键姿势继续保留。已有正式选择不会自动替换；用户可使用“采用 v42 默认动作”，独立备份成功并回读后才切换，原正式选择、撤销槽、姿势库、路线和草稿保留。切换支持撤销；个人编辑过的动画不冒称与 R12 烘焙片段一致。

## 复现与验证

先按根项目与 `app/scene` 锁文件安装依赖，然后在项目根目录使用新的批次名：

```powershell
node tools/motion-v42/bake.mjs --out output/flare-v42-app-rebuild
node app/scene/tools/integrate-v42-r12.mjs --from output/flare-v42-app-rebuild
node app/scene/tools/verify-v42-assets.mjs
node app/scene/tools/verify-v42-integration.mjs
node app/scene/tools/verify-v42-framing.mjs
npm --prefix app/scene run build
npm --prefix app/scene run verify
npm run build
```

集成入口仅接受冻结 SHA 的 R12；写入已有 v42 目标时仅允许完全相同的字节，禁止重写不同身份。旧 R1–R12 输出、v41/v38、原网页编辑器与用户素材不清理。Flutter 离线 Web、APK 与实际浏览器结果见 [L46 交付](l46-motion-v42-2026-10-15.md)。L46随后已在Android真机同签名保留数据安装，用户反馈“我测试初步OK”。该有限初验不等于完整原生详情/七形象、长期性能或全设备验收。
