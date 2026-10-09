# Flare 托马斯 · Flutter App

2026-10-09 PR #7已审核补修并合并：进出肌群详情保持固定3D舞台和画布缓冲区，构图连续过渡；拖动中断、系统返回与场景重载同步已补修。合并检查点e42df21、当前试用APK/本地Web见 [版本台账](docs/version-ledger.md)，软件/浏览器证据及真机限制见 [PR7审核](docs/pr7-audit-2026-10-09.md)。

历史：2026-10-09 PR #6已审核修复并合并：按用户真机反馈，详情动作视图改为允许旋转、禁止缩放/平移，覆盖此前固定机位要求；三场景训练选择、肌群知识及矢量加载已接入并补充审核修复。当时主目录、离线Web与开发签名试用APK已同步为PR6版；证据见 docs/pr6-audit-2026-10-09.md。

历史：2026-10-09 PR #5交互动效及三项审核修复已合并；随后合并PR #3网页肌群界面，App仍播放原v41烘焙动作。Web计时的32位移位上限问题已修复，真实浏览器倒数可进入工作/换侧；长期前后台及真机验收仍待完成。该阶段试用APK为根项目 `output/releases/Flare-v41-PR5-PR3-20261009-arm64.apk`，44,046,265字节；后续PR6包 `output/releases/Flare-v41-PR6-20261009-arm64.apk`，44,114,581字节，开发签名，保留历史。当前包身份归入 [版本台账](docs/version-ledger.md)；已上传Play的AAB保持原文件。详见 [本轮验证](docs/verification.md)。

2026-10-09此前PR #4阶段已合入51套1024/512浅色训练图，原深色图保留。该阶段历史APK用具名 `output/releases/Flare-v41-light-20261009-arm64.apk` 定位；通用 `build/app/outputs/flutter-apk/app-release.apk` 用于当前本地交付，内容以版本台账及哈希判定。同日Play接入将版本升为 `1.0.0+1`（提交 `92e459f`），上传密钥签名AAB已上传封闭测试轨道并送审；本轮未替换。历史包及当时发布观察见 [版本台账](docs/version-ledger.md)，证据见 [verification.md](docs/verification.md)。

当前默认为与网页同步的 **v41 烘焙动作**，原服装/面孔、PR #2精简界面和深浅主题保留。当前合约与复现入口为 [motion-v41.md](docs/motion-v41.md)，版本/交付与发布观察归入 [版本管理台账](docs/version-ledger.md)，实施及待验收项归入 [实施路线](docs/development-roadmap.md)。v38和米白无衣模特记录保留为历史。

2026-10-09当前体验：PR #2的精简页面与跟随系统/深色/浅色主题，v41烘焙动画；详情使用原穿衣人物的当前群组柔边代理高亮和推荐全身取景，可旋转但禁止缩放和平移，直立人台可旋转，小卡片交换与同帧返回保持。PR #4浅色训练图随主题选用，原深色图保留。后续动作优化同步网页/App；历史无衣模特和对应截图保留。

本目录是按用户提供的Flare制作包推进的跨平台App。Flutter管理页面、训练和本地记录，本地Three.js AnimationMixer播放成熟Snow及v41烘焙动作。当前是可本机验证的开发版，已覆盖M0–M3的实现与M4课程草稿；完整里程碑、真机性能和商店发布尚未验收，不能因构建成功标记为完成。

原有网页编辑器继续在仓库根目录运行。这里使用独立的代码与资产副本，原导出、个人草稿、`Air-Flare/` 和根目录网页数据保留。

## 运行

在 `E:\AII-3D\3D-Body\app` 执行：

```powershell
flutter pub get
flutter run -d chrome
```

浏览器数据按浏览器与网址保存；需要稳定预览地址时可加 `--web-port 8840`。依赖首次安装需要网络，安装后的 App 内容随包提供。

当前本机预览使用 `http://127.0.0.1:8820/`，也可在项目根目录双击 `start-flutter.cmd`。ARM64 安卓试用包在 `build/app/outputs/flutter-apk/app-release.apk`：采用优化编译与本地开发签名，用于手机验证。模拟器调试包另保留为同目录 `app-debug.apk`。Google Play 封闭测试使用 `build/app/outputs/bundle/release/app-release.aab`（`1.0.0+1`，release上传密钥签名），已上传Play并送审；Play显示其优化后新安装约33.9MB。

安卓模拟器或已连接手机可执行 `flutter devices`，再运行 `flutter run -d <设备ID>`。原生 3D 通过 App 内的 `127.0.0.1` 动态端口读取打包资产，不需要在电脑上运行 Vite。iOS 构建需要在 macOS/Xcode 环境继续验证：步骤、任务与验收见 [docs/ios-plan-2026-10-09.md](docs/ios-plan-2026-10-09.md)，Mac 上先运行 `bash tools/ios/doctor.sh`。Android 标识 `dev.mhgd.flare` 已作为 Google Play 正式包名使用；上传密钥 `keys/flare-upload.jks`（根项目E盘、gitignored）与 Play App Signing 均已注册，正式版发布仍需先满足封闭测试12名测试者14天的平台门槛。

只修改 Dart 页面无需重新制作 3D 包；修改场景代码或模型后，先在 `app/scene` 执行：

```powershell
npm ci
npm run build
```

回到 `app` 后重新运行 Flutter。`assets/scene/` 是场景构建产物，编辑源代码应在 `scene/src/` 完成。制作浏览器验证包使用 `flutter build web --no-web-resources-cdn`，使 Flutter 渲染资源也随包提供；构建后通过本地 HTTP 服务打开，不要直接双击 `build/web/index.html`。

## 当前体验

首页按制作包 v2 的 `h1-home` 还原：顶部路径与更多，主要区域是完整人物，左下同步肌群小图，底部只保留播放/暂停和细时间轴。没有常驻底部导航、速度排、镜头排或肌群标签排；这些功能移入更多或暂停后的点选。详见 [首页视觉基准](docs/home-design.md)。

首次进入先确认安全须知，可选择五项入门自评或进入动作观看。观看页支持慢放、暂停、阶段定位、单段循环与镜头控制；暂停后点人物热点、小图或肌群弹层，进入保持当前姿态的肌群详情。首页与详情均保留原上衣、短裤及面孔，跟随同一v41烘焙动画；详情仅当前群组柔边代理高亮、推荐全身取景，可旋转但禁止缩放和平移，脸、头发、手和鞋不着色，返回恢复原材质对象。

详情默认大动作模特、小直立肌群人台。人台显示当前群组的浅红选区与轻柔外缘淡影，保留原精细分界线，其余阶段色收起。点击小卡片交换两者，再点切回，部位和暂停时刻保持一致，没有顶部模型切换栏；首页未选中的同步小图保持原阶段功能色。动作表面的相对肌群坐标属于教学位置提示，不改变源区域定义，也不宣称精确解剖配准。对应训练仍可选择 A 徒手、B 家用器械或 C 健身房；51 个训练都有示意图、要点、组次与安全说明。计时/计次、今日训练、课程记录和进度存在本机。

全部训练档位按免费开发版提供。课程、入门阈值与关卡是制作包中的教学草稿，阶段记录由本人确认；当前没有相机 AI、订阅、账号或云同步。颜色表示教学重点，深层位置为示意，不能当作肌电、内部解剖边界或能力诊断。三张源训练图的已知姿势瑕疵继续标注。

设置中的“复制本地备份”把部分状态复制为 JSON，需自行保存到文件；当前没有备份导入入口，它还不是完整的迁移方案。

接手先读 [v41合约](docs/motion-v41.md)，再核对 [版本管理台账](docs/version-ledger.md)、[实施路线及待验收项](docs/development-roadmap.md)、[资产来源](docs/asset-sources.md)、[验证记录](docs/verification.md) 和 [本地数据说明](docs/privacy-local.md)。[v38接入记录](docs/motion-v38.md)、[2026-10-08交接](docs/handoff-2026-10-08.md) 与 [当时截图](docs/screenshots/2026-10-08/README.md) 保留历史事实，不能当作当前动作或外观的验收。3D接口和复现细节见 [scene/README.md](scene/README.md)。
