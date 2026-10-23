# App 验证记录

## Liquid Glass 页面铺开：网页验证（2026-10-24）

基线 `21bddc2` 加本轮未提交 UI / 测试增量，源码汇总指纹 `2eed3d06a283e713df63bfa605d03d6b06b9c3d5b61b5db8616c6bdc7852afa3`：10 份定向 Widget 测试 109 通过、静态分析无问题，正式 App 与隔离预览均成功构建离线 Web。13 页 / 状态共 26 张浅深截图已检查，浏览器搜索、多选、视频、进入 SDK 播放器、主题切换、备份反馈和同帧返回通过；采图窗口无页面错误、警告或资源失败。[命令、证据与限制](liquid-glass-rollout-2026-10-24.md#本轮验证)。原生材质 / 光学 / 性能与完整设备矩阵保持待验；未安装手机，未合入或推送。

## SDK 0.2.0 定向验证（2026-10-23）

自动计次、segments 单父项统计、三项新控件和完整计划兼容的定向测试通过，静态分析无问题，详见[本轮证据与范围](sdk-trainer-020-2026-10-23.md#验证范围)。用户已缩小测试范围并授权先合入，未做锁屏/来电等完整设备细项。

## 整计划 TrainerPlayer 验证（2026-10-23）

本次整页播放器、14 语、计划保真、幂等结果及宿主路由验证见[独立记录](sdk-whole-plan-player-2026-10-23.md#验证)。8 项横屏溢出已与 master 同条件复现；原 3 项历史 flow 失败的主线对照证据也已保存。本次没有新播放器真机验收，不复用 +13 的设备观察冒称通过。

## SDK 第 1 步追加对话结构（2026-10-23）

SmartFit 结构对齐、独立提问组件、实际新 UI 回归、浅深来源标注截图及 +13 内测包检查另见 [补充验证](sdk-step1-chat-smartfit-2026-10-23.md)。旧 +12 真实 AI 与计时证据仍绑定原检查点，视觉对照固定响应样例不算新一轮模型验证。

## SDK 第 1 步（2026-10-23）

本批次测试、真实 Agent 多轮请求、固定目录/媒体哈希及内测包证据集中在 [SDK 第 1 步记录](sdk-step1-2026-10-23.md)。本轮未连接 Android 设备，未作 iOS 构建；设备安装、语音中断/长期后台和完整 QA 不因本地构建通过而自动标记通过。

## PR122 复审与合入证据绑定（2026-10-20）

最终复审源为 `298f1fa7818a2960aa6e799a6cd625825dbcb49d`，目标基线 `2be8cca34abebb204f3d30b79000eea02015b793`；2026-10-20 15:43:09（北京时间）经用户同意合为 `d8e9a0a6047158687b8be72a6e5f486add95e7f5`，本地主线整合为 `e000a3fe86e64c4fb651049528d4baea3f9180e5`。三轮修复、范围及已知缺口见 [PR122 版本记录](pr122-ai-coach-integration-2026-10-20.md)。

| 执行时间 / source state | 本会话实际命令与结果 | 适用性 |
| --- | --- | --- |
| 2026-10-20 / 最终源 `298f1fa7818a2960aa6e799a6cd625825dbcb49d` | 在隔离 `app` 执行 `flutter test --no-pub --concurrency=1 --reporter expanded test/ui/ai_coach_test.dart test/ui/ai_coach_review2_test.dart E:/AII-3D/3D-Body/output/pr122-r3-review-20261020/independent_enumeration_test.dart`；39/39：35项 AI 回归、4项独立反例/边界 | 原3条当前/历史并列部位反例已修；独立探针在本机 output 保存，不作为随包测试 |
| 同上 | `flutter analyze --no-pub`：No issues found；`PUB_HOSTED_URL=https://pub.flutter-io.cn flutter pub get --enforce-lockfile`：成功，锁文件未改；`git diff --check 91226d8 298f1fa`：通过 | Flutter 3.44.7 / Dart 3.12.2；SDK0.1.2/26e3255，intl0.20.2 |
| 2026-10-20 / 第二轮源 `91226d85a73bc8e35e0eea6b63e2af198ed4cc68`；对照 `2be8cca34abebb204f3d30b79000eea02015b793` | 各自在隔离 `app` 执行 `flutter test --no-pub --concurrency=1 --reporter json`；196通过/12失败 vs 165通过/12失败，失败文件与名称完全相同（flow3、iOS横屏8、polish1） | 历史对照；第三轮后未重跑全量，不能写成最终HEAD全量通过 |
| 2026-10-20 / 第二轮源 `91226d85a73bc8e35e0eea6b63e2af198ed4cc68` | `flutter build apk --debug --target-platform android-arm64 --no-pub --dart-define-from-file=<本地私有配置>` 成功，exit0；APK ZIP及教练目录入包检查通过 | 仅第二轮 debug 构建，未安装/上传；第三轮和本次文档收束未重新构建，不作为新源码安装或设备证据 |

证据复用证明：`git diff --name-status 298f1fa7818a2960aa6e799a6cd625825dbcb49d e000a3fe86e64c4fb651049528d4baea3f9180e5` 只有 `app/docs/development-roadmap.md`、`docs/pose-hub-migration-2026-10-17.md`、`docs/pr-cleanup-2026-10-18.md` 三份此前清理文档；App运行代码、资产、测试、pubspec及教练同步工具逐路径 diff 为空。未提交的既有3份改动及本次对齐也仅为文档，故复用最终源39项、静态分析和锁文件验证，不重复扩大测试。

本次 closeout Preflight 基线为合并前主线 `ca9c133766946ada6959b5d6b397efe8c7e417b7`，预检HEAD为 `e000a3fe86e64c4fb651049528d4baea3f9180e5`；完整归属、canonical分类和必要文档检查见[阶段记录](pr122-ai-coach-integration-2026-10-20.md#文档收束preflight)。真实IO首次写入失败后的重试冲突在master和PR均复现，仍单列待办；本轮不调用真实模型 API，不读取密钥、不以历史冒烟或截图证明最终源。

## Pose-Hub 迁移边界（2026-10-17）

动作生产已迁至 Pose-Hub `2a1b5ef7cd47cc375eea7c10f14f290e2f6ee4ee`；后续仅消费其发布版本，现有51媒体及 L52 / 1.0.9+11 / v42-R17 保存身份保持。本次清理不新增素材、设备或历史QA验收；迁移来源、保留范围及发布后接入计划见[迁移记录](../../docs/pose-hub-migration-2026-10-17.md)。下方历史验证、旧源码路径和绿幕补充继续保留原时点事实，清理检查以本次实际执行结果为准。

本次实测：根网页及 `app/scene` 构建、场景全套 `npm run verify` 均在清理前后通过；1363个受保护非Markdown文件（含51MP4/51JPG）哈希一致。Flutter 全套前后均165通过/12失败，失败名称逐项一致：3条flow、1条polish、8条已有iOS横屏布局失败；不同于交接预估的4失败。清理后静态分析无问题，5项迁移路径测试通过，根网页和App scene浏览器显示正常（独立场景仅favicon 404）。[实际范围与限制](../../docs/pose-hub-migration-2026-10-17.md#本次清理实测)及[失败清单](../../docs/evidence/pose-hub-migration-20261017/verification-summary.json)保留；未重新渲染或做真机验收。

## L52 计划跳过修订（2026-10-17）

2026-10-17，用户确认“很好 验证通过”，并说明本次初步测试结束，授权保存提交及台账对齐。**当前保存版本为 L52 / 1.0.9+11 / v42-R17，本次初步用户测试通过；后续App改动以L52另建批次。** 跳过按顺序前进，末项后结束本轮，完成与跳过分列；12项相关测试、静态分析及Web/真机四次连续跳过检查通过。完整原生交互、长期QA、iOS及设备矩阵仍待验收。R17动作、L50认可记录、旧包/媒体与个人数据保留。见[L52记录](l52-plan-skip-2026-10-17.md)；下方L51及更早内容为历史阶段。

## L52 阶段收束证据绑定（2026-10-17）

阶段基线为恢复会话时已记录起点 `6f694c0dad991d281f84f68d50cf05ab05dab932`，无单独ref；通过 `git rev-parse --verify <SHA>^{commit}` 及祖先关系核对。收束前HEAD为 `344d2c519c43a638ddc9ea63586dcc2ae21b0866`，相对基线为10提交、69路径：23文档/证据、6运行代码、28本地化、2配置、10测试。范围为PR117计划整合、缺陷修复、L51/L52构建安装与本次有限用户认可；原3D动作、素材、用户原有改动及发布不在此次收束修改范围。

当前canonical实际核对：根 `AGENTS.md`、`README.md`、`app/AGENTS.md`、`app/README.md`；版本事实 `app/docs/version-ledger.md`；验证事实本文；待验收 `app/docs/development-roadmap.md`；本地数据说明 `app/docs/privacy-local.md`；动作契约 `app/docs/motion-v42.md`；当前批次 `app/docs/l52-plan-skip-2026-10-17.md`。历史来源为 `app/docs/l51-plans-test-2026-10-17.md`、`app/docs/pr117-plans-integration-2026-10-17.md`，其源码阶段未安装、旧包及旧验证均保留原时点事实。

产品source state为 `38f57e419df11e42e6d1c7ef7c71478650b588cf`。本会话2026-10-17执行的12项测试、静态分析、本地化生成、dist/离线Web/APK构建、签名/16KiB及安装检查，其完整命令、结果与有限真机/Web观察见[L52已有验证](l52-plan-skip-2026-10-17.md#已有验证)。源码到收束前HEAD仅1提交、14路径（8文本及6精选证据），运行代码、配置、测试和资产未变；本次收束也只修改11份文档，因此复用已有受影响验证，不重跑构建、安装或全量QA。PR117的41项历史测试绑定 `bc2b148`，不记为L52完整复测。

完整工作区Preflight为3项tracked unstaged、0 staged、0删除/重命名、27项untracked；均有阶段前归属记录。原README加2行、本文加10行、版本台账加8行的绿幕内容及27项用户文件保留，采用明确路径及分离暂存排除它们。收束必要检查为文档事实/链接一致性、`git diff --check`、暂存差异范围、source state与完整Git状态复核；实际结果以本次提交及会话回执为准，不替代产品QA。

本次收束检查通过：11份文档的变更范围、45个修改行中本地链接目标、版本号与既有标签、源码后14路径差异、完整Git状态及差异格式均已核对。文档语义另经独立只读复核；无待处理的确定对齐问题。

## 历史：L51 原生安装核对（2026-10-17）

L51 / 1.0.8+10 / v42-R17 ARM64构建、同开发证书与16KiB对齐、420项自有资源保持检查通过；从L50保留数据安装Success，首次安装时间保持，设备base.apk与具名包SHA一致。原生首页/计划页显示通过，1201行当前PID日志样本未匹配异常；用户完整测试及长期QA待反馈。命令、证据和限制见[L51记录](l51-plans-test-2026-10-17.md)。41项软件回归来自bc2b148功能源，a603c82仅递增版本。

## PR117 计划页合入验证（2026-10-17）

本轮实际命令、环境及范围见[PR117记录](pr117-plans-integration-2026-10-17.md)：40 项定向测试与1项计划流程通过，静态分析无问题，dist/离线Web构建和390×844浏览器流程通过。4 项旧测试失败已与基线核对，原生/长期QA仍待验证；未生成新APK或更新手机，不把源码验证扩写为设备验收。

2026-10-17，用户确认“OK 测试通过 做好版本保存”。**L50 / 1.0.7+9 / v42-R17 已通过本次用户测试，作为当前认可版本保存；后续优化以R17为基线另建批次。** 旧冻结证据中的“待用户复核”保留其历史状态；完整设备矩阵、长期性能及此前未执行的QA不因本次反馈自动补记为通过。验收身份与冻结资产见[本次保存记录](l50-r17-acceptance-2026-10-17.md)。

## L50 / R17 收束证据绑定（2026-10-17）

实现源为 `b151b8d39440a126cf0a24d101e2b559bf460e3b`，用户认可记录为 `65c28b4a26b1438e7ece7787d45ca6385623c447`。二者之间12个路径全部为文档；本次亦仅对齐文档，运行源码、配置和资产没有变化。下列证据来自2026-10-17本会话实施工具回执及[L50交付记录](l50-motion-v42-r17-2026-10-17.md)，执行工作树随后保存为上述实现源；本次不声称重新构建或重新完成设备QA。

| 命令与工作目录 | 已执行结果 / source state |
| --- | --- |
| 根目录 `npm run build`；app/scene 中 `npm run build`、`npm run verify` | 成功；绑定上述实现源，后续仅文档变化 |
| app 中 `flutter analyze` | 无问题；同一实现源 |
| app 中 `flutter test test/ui/startup_splash_test.dart` | 3项通过；同一实现源 |
| app 中 `flutter build web --no-web-resources-cdn` | 成功；同一实现源 |
| app 中 `flutter build apk --release --target-platform android-arm64` | 成功；同一实现源 |

本次必要检查为文档差异检查、变更链接存在性、版本配置与当前指向一致性、完整Git状态及原有改动保留核对。既有GLB、包与设备观察保持原记录范围；未重读日志/构建产物，不将其扩写为新测试。

## R17 / L50验证（2026-10-17）

两人体实际GLB各10001相位检查了起手、落手回归及循环播放；另各1081相位核对骨长、蒙皮接地。右支撑肘起手保持176.74°–177.00°，两段支撑腕和修改区外骨位置保持；循环位置闭合，但不声称C1速度连续。App七形象×181姿态、14构图案例、网页30项、Flutter启动3项和静态分析通过；离线Web/ARM64已构建、同签名更新。原生首页显示通过，用户R17本次测试已通过；完整七形象/详情与长时性能仍待验收。详见[L50证据与边界](l50-motion-v42-r17-2026-10-17.md)。

## L49 / R16 定点修复与更新（2026-10-17）

实际GLB复现R15在96.67%左肘弯到161.3045°；R16在93.7%–99.8%保持176.8941°–177.0002°。两人体各10001相位独立肘复核、各1081相位蒙皮接地采样、七形象181姿势/同帧返回/特效及14构图、网页27项检查通过。Flutter启动3测试、analyze、场景和根网页构建/验证、离线Web与APK构建通过；416项APK/Web源文件一致。手机从L48同签名保留数据安装L49成功，远端APK哈希一致，首次安装时间保持，原生首屏显示通过。具体范围和未完成的原生全量/长期验收见[L49记录](l49-motion-v42-r16-2026-10-17.md)，不将原R15认可扩大为R16用户验收。

## 独立动作 R15 认可与保存（2026-10-17）

R15最终两GLB与通过独立检查的trial04逐字节一致，两人体各1081个实际相位包含烘焙中点；肩颈连接、肢段长度、换手连续性及掌/鞋/肘接地采样未见新增硬阻断。随机拖动与顺序采样一致，循环位置缝为0；有限浏览器对照已核对两人体、侧撑和换手阶段。用户现已认可本轮独立动作观感并要求保存，见[版本及证据](../../docs/flare-v42-r15-release-2026-10-17.md)。旧报告的待验收状态保留为历史，以新认可清单说明当前身份。腿部专项对比按用户要求取消；本次不增加动力学、连续全身无碰撞、App构建或设备验收结论。

## 2026-10-16 独立动作 R14 认可

两人体各1081姿态的平面、骨长、循环和接地检查已完成，用户认可R14为目前最好的最新优化版本。数值与浏览器范围、原报告历史状态及限制见[动作记录](../../docs/flare-v42-r14-release-2026-10-16.md)。这是独立预览认可；未重建或安装新App，当前L47/R12的设备验收范围保持。

## L47 自适应场景打包与真机安装（2026-10-15 23:16）

离线Flutter Web与ARM64 APK构建完成；包名/1.0.4/code6/API24+/target36及原开发签名核对通过，408项打包源文件匹配、436项源asset保持。`adb install -r` 从L46更新Success，首次安装时间不变，已装APK远端SHA与本地具名包一致；冷启动Status ok/COLD 426ms，原生首页R12与原深色主题正常、HUD默认隐藏。426ms仅是Activity耗时，未测得真机FPS/温度/续航改善，也未逐项提取比对私有个人记录。

本轮未修改已审核性能JS；软件机制、9项tick/render和18项浏览器检查沿用下方PR合并阶段的同源代码证据，不计为本轮重新运行。用户已测试使用L47，并要求保存本版；L46的“初步OK”只保留此前动作展示身份。完整事实见[L47记录](l47-performance-2026-10-15.md)，精选证据见[清单](evidence/l47-20261015/manifest.json)、[包核对](evidence/l47-20261015/package.json)、[安装回执](evidence/l47-20261015/installation.json)和[原生首页](evidence/l47-20261015/native-home.png)。

## 历史合并阶段：五项PR验证（2026-10-15）

138规格源校验、13固定人体来源、51新增规格哈希、30项7230描述符与21项247轨道及CPU兼容检查通过；#116历史/R12/画质与自适应回归、9项独立帧循环检查及18项浏览器检查通过，page errors0。完整范围、早期软件GPU取样失败与条件等待复测、HUD口径及[精选证据](evidence/pr-batch-20261015/manifest.json)见[合并记录](../../docs/pr-batch-merge-2026-10-15.md)。该合并阶段未重建完整Flutter Web/APK或重新上机；其后L47实际构建安装见上方，不把L46用户初验扩大为新性能版本验收。

## PR116 原分支自适应分辨率验证（2026-10-15，L45/v41历史基准，待真机）

`npm run verify` 通过（含新增 `tools/verify-adaptive-resolution.mjs`），`npm run build` 只更换JS包。沙箱 Chromium/SwiftShader、360×640@2x，只比较相对量：主页t=2.2静止、详情动作、详情肌肉三张截图与master构建SSIM均为1.00000（master自对比同为1.00000）；拖动过程每帧颜色像素921,600→518,400（−43.75%），阴影pass 63→0（相机-only帧复用阴影贴图），颜色+阴影像素×pass −73%；播放中颜色−43.75%、含阴影−20.5%。拖动中低清帧与master对比SSIM 0.988（门槛0.97）。`?adaptive=0` 实测为旧路径（固定2.0、无缓冲重分配、逐帧阴影）。SwiftShader约600ms/帧，绝对FPS和降档触发不可代表手机；未构建Flutter/APK、未真机验证。

## L46 真机安装与首轮显示（2026-10-15 21:34）

同签名原APK已备份，`adb install -r` 返回Success；系统回读name1.0.3/code5，原首次安装时间不变。冷启动Activity返回ok，原生首页实截图显示R12，样本进程日志未见FATAL/Flutter异常；证据 `output/l46-device-20261015/installation.json` 和 `home-first.png`。用户随后反馈“我测试初步OK”，记为有限动作展示初验；设备随后离线，未宣称完成原生详情/七形象全量/长期性能或私有个人记录逐项验证。本条覆盖下方构建阶段尚未安装的当时状态，当时手机安装L46，现状已由顶部L47记录覆盖。

## L46 / v42-R12 展示接入（2026-10-15）

已纳入Git的精选证据见[证据清单](evidence/l46-20261015/manifest.json)、[软件构建摘要](evidence/l46-20261015/software-summary.json)、[App浏览器核对](evidence/l46-20261015/app-browser.json)、[网页核对](evidence/l46-20261015/web-browser.json)、[真机安装回执](evidence/l46-20261015/device-install.json)及[用户初验记录](evidence/l46-20261015/acceptance.json)。[真机首页](evidence/l46-20261015/native-home.png)、[浏览器详情](evidence/l46-20261015/app-detail.png)和[网页手机布局](evidence/l46-20261015/web-mobile.png)各保留原观察范围。完整output、构建备份、安装前旧APK和具名L46 APK留本机，不承诺fresh clone中存在；新环境按[motion-v42](motion-v42.md)重建。 软件摘要绑定原构建时产品代码/资产SHA，本次仅对齐文档并新增便携证据，没有重跑或累加已通过的软件测试。

验证源为 PR #114 合并点 `887d6e3` 上的本轮 L46 工作区，动作身份仍绑定 `fc91c7f` 和 R12 两份冻结 GLB SHA；没有改写原动作制作源。两人体源与运行压缩版的网格属性、三角形、材质、蒙皮、逆绑定及44轨时间/值核对一致；两端时钟文件一致。检查入口为 `app/scene/tools/verify-v42-assets.mjs`。

`verify-v42-integration.mjs` 通过7形象×181姿态、541阶段帧、24精确阶段边界、4速度及子段循环、同帧详情/交换/返回、材质恢复与减弱动态FX淡出；时钟往返最大误差 `3.55e-15`。`verify-v42-framing.mjs` 通过7形象×两舞台高度×181姿态并含刚性头饰；v41/v38回归保持。场景 build/verify、Flutter定向30项加启动3项、analyze、离线Web及ARM64 APK构建通过。

网页最终 `node tools/verify-web-v42.mjs --dist` 46项通过、运行错误0；包括181同时间×22骨App/Web矩阵误差0、全身构图、个人旧选择原字节保留、独立备份失败保护、采用及撤销、原编辑器、K/路线隔离和辅助预览。独立审查发现的非线性子段循环跨边界余量问题已补修，片段域取模及真实浏览器animate回归通过。证据为 `output/web-v42-integration/verification.json` 及桌面/手机截图。

APK132项打包资产与当前源逐一SHA一致；191项旧素材、39项冻结动作依赖/证据、27项原用户独立文件逐项SHA保持。构建时3份原有脏文档仅增加L46段落，其原正文已独立回读保持；本次保存另对齐当前/历史措辞，原绿幕段保持；回执 `output/v42-app-l46-20261015/apk-and-preservation.json`、`doc-preservation.json`。完整App最终串行浏览器核对七形象设置保存/同帧、赛博银冷启动、实际详情和小卡交换/返回同帧及播放暂停通过，错误/失败请求0；证据 `output/playwright/l46-v42-20261015/app-verification.json`。并行软件GPU检查曾一次泛化场景加载失败，保留失败截图，串行复查通过；不冒称定位或修复了原生图形问题，范围见[L46记录](l46-motion-v42-2026-10-15.md)。

构建阶段无Android连接、L46未安装属于当时事实，现由上方真机安装和用户有限初验记录覆盖。软件及有限初验不替代长期温度/性能/计时、iOS或全设备验收。51视频23ready/28待核对、原商店包及历史L44证据保持。旧验证JSON保留原时间/哈希与installed:false；本次文档对齐不改写旧构建证据，当前安装以独立installation.json为准。

## 历史阶段：Flare v42 / R12 独立动作认可与分支交付（2026-10-15）

用户已认可R12当前无明显动作问题。数值与播放检查绑定`fc91c7f`生成的两个GLB SHA，见[冻结清单](../../tools/motion-v42/releases/v42-r12.json)和[动作版本记录](../../docs/flare-v42-release-2026-10-15.md)。两人体结构检查通过，双侧对应换手、肘角/掌姿保持及24局部表面姿态已检查；右躯干轴仍有约0.357mm回外和继承的末端微回弹，原报告保留。

本次整理仅补复现入口、防覆盖、历史参照缺失处理和版本证据；通过新批次重建的GLB哈希确认动作未变。原网页兼容构建另存于output；R12对照预览由本地静态服务加载源码和GLB。上述不等于App构建、安装或新的设备验收，L45/v41及原QA待办保持。

## L45 当前软件验证（2026-10-14）

当前本地构建L45 / 1.0.2+4。28项受影响Flutter测试通过，字体补修后控件4项再通过，flutter analyze无问题；场景build/verify、真实模型FX调度回归、离线Web和APK构建通过。完整App最终7形象选择、URL/保存值一致、2.375秒同帧返回及赛博银冷启动恢复通过，浏览器错误0；减少动态效果下进入详情的FX最终level0。124项APK场景/51视频/51封面逐项SHA一致。

已按固定5f31d18合并为2d46065并同步主目录。443个Web文件与候选SHA一致、两处通用APK与具名包一致、21项用户文件SHA保持；旧构建已另存，产品源无差异。同步证据绑定2d46065/候选5f31d18，后续文档回执不改写其HEAD。

证据、命令、固定head/base与失败→修复路径见[L45记录](pr110-l45-characters-2026-10-14.md)。当前无连接手机，L45未安装，不把旧L44安装或本次浏览器检查写成新版真机验收。独立选择控件德国320px/2倍字号通过不代表完整App语言/大字号流程。

下方L44验证保留原时间、对象与范围。

<a id="l45-证据绑定与文档收口2026-10-14"></a>

## L45 证据绑定与文档收口（2026-10-14）

本次由用户显式调用cockpit-closeout并授权保存、提交、普通push。只读Preflight基线为原L44主线检查点 `f731881fe84c58189f9d6736286f0124a216a2df`，不是任意最近提交；确认它是收口前HEAD `18e7254ed68d57dc4640aa22849947456eded7bb` 的祖先。阶段为6提交/56路径：新增8、修改47、重命名1，包含PR110原三提交、补修5f31d18、合并2d46065及交付回执18e7254。收束scope仅为该阶段行为/来源/版本/构建与安装/PR状态/验证台账；产品源、配置和资产不再修改。

Preflight完整status为tracked/staged/unstaged/deleted/renamed均0、untracked21：Air-Flare原视频1、用户图标PNG12、JSON8，与本轮开始前记录一致，全部保留不暂存。只用路径、类型、数量核对归属，不读用户素材、凭据、原始日志、浏览器profile或构建字节，不扫描兄弟仓库。阶段二新增修改均为本Agent明确修正的文档。

从根/App AGENTS和README的一跳声明识别如下来源；类别由入口职责确定，历史内容不冒充当前canonical。

| 实际核对路径 | 类别与判定 | 核对主题及本次处置 |
| --- | --- | --- |
| README.md、AGENTS.md、app/README.md、app/AGENTS.md | current入口/约定，内含历史阶段 | 当前七形象、L45预览/包与手机L44安装分开；明确播放FX/暂停教学层，保留原历史身份 |
| CONTRIBUTING.md | current协作入口，根README直接指定 | 修正旧“当前手机L43”；当前构建L45，已知安装L44、未发布 |
| app/docs/version-ledger.md | current版本/包/安装/PR保存身份 | 固定head/base、补修/合并/回执、code4与APK身份；补本次基线/scope/保存规则 |
| app/docs/verification.md、app/docs/pr110-l45-characters-2026-10-14.md | current验证事实及专题证据 | 命令、source state、复用范围与待验收，原L44真机证据保留其原对象 |
| app/docs/development-roadmap.md | current实施/待验收 | #106已关闭，M0/M1/M7及包入口为L45，安装/设备/QA不销项 |
| app/docs/asset-sources.md、app/docs/drill-media-2026-10-11.md | current来源/51选版；L44是仍沿用的来源基线 | 新角色为材质/刚性头饰派生，旧51媒体QA保持；四个跨项目历史引用不访问 |
| app/docs/motion-v41.md、app/scene/README.md | current动作及场景接口 | 七角色共用22骨/44轨；详情交换保留画布，设置角色更换重建并恢复同帧 |
| docs/fx-and-characters-2026-10-14.md | current阶段技术记录，原作者渲染段为archive/history | 五角色表、当前App设置、性能未验收；原三角色软件渲染不扩为L45验收 |
| docs/integration-pr-audit-2026-10-12.md | archive/history，本页明确截至6fbf7a7/10-12 | 原#106 Draft及10-13本地优化是原日期事实；当前Closed以L45台账为准，旧合并收据不改写 |

受影响源码事实另核对pubspec、actorBodies、URI配置、角色选择与FX tick。产品验证源为 `5f31d18a643c6b141cf0f832e155aa5b766d2d02`；到18e7254只有motion-v41、L45专题、verification、version-ledger四篇文档（15新增/3删除），产品源码/测试/模型/媒体均相同。本次也只改文档，原构建与浏览器证据可按原范围复用，不写成收口HEAD重新构建。

| 验证/观察与命令 | 实际执行来源/时间与source state | 结果及本次适用性 |
| --- | --- | --- |
| flutter test --no-pub test/ui/actor_choice_test.dart test/ui/scene_process_recovery_test.dart test/ui/internationalization_test.dart test/domain/learning_store_test.dart test/platform/scene_variant_test.dart --reporter compact | 2026-10-14本会话Preflight，主目录18e7254完整产品状态；控制台9秒+28 All tests passed | 28项通过，已覆盖最终字体修复；不累加先前4项为32项，未跑全量测试 |
| flutter analyze --no-pub | 原L45实现阶段本会话，最终字体修复后的工作树，其产品源随后保存为5f31d18 | No issues；后续仅文档，保持适用，不冒称本次重新分析 |
| npm run build；npm run verify；node tools/verify-fx-scheduling.mjs（cwd app/scene） | 原L45实现阶段本会话，修复后的JS源保存为5f31d18；后续字体修复不改变JS | 构建及历史/v41/质量/FX检查通过；真实GLB调度回归覆盖最终JS，不代表新增头饰全姿态或设备QA |
| flutter build web --no-web-resources-cdn --no-pub；flutter build apk --release --target-platform android-arm64 --no-pub | 原L45实现阶段最终字体修复后、本会话5f31d18产品树 | Web/APK通过；原包e490ee68哈希和签名记录沿用，本次不读包、不重新生成 |
| 完整App浏览器选择7角色、保存/2.375秒同帧、赛博银冷启动；减少动态详情FX检查 | 原L45实现阶段最终候选，5f31d18产品树；同会话实际工具返回及L45专题记录 | 7项一致、错误0、FX level0；软件/Intel OpenGL证据，不当作手机或全部语言验收 |
| verify-apk.py、aapt badging、apksigner verify --print-certs | 原L45实现阶段同会话，5f31d18产品树的具名APK | 22场景+51视频+51封面124哈希一致，1.0.2/code4、原开发证书；本次不重新读取构建字节 |
| main-sync-check.json（原同步事实） | 合并后2d46065/候选5f31d18，原2026-10-14同步时记录 | 443 Web文件、两处APK及21用户文件SHA保持；只复用当时观察，不改写JSON为18e7254或本次保存点 |
| gh pr view 110 / 106 --json 指定状态字段 | 本次Preflight实际只读GitHub返回 | #110 MERGED/head5f31d18/merge2d46065，#106 CLOSED/head3d204、closedAt02:31:03Z；关闭不冒称合并 |

本次必要文档检查为有限14来源的431个本地链接/35个锚点、预期当前事实、产品源与5f31d18无差异、git diff --check及完整status，失败0；独立只读复核确认当前过期finding清零。旧warm-ivory锚点已保留兼容；四个基线已存在的3D-Pose历史引用只记录不访问、不宣称验证目标。详细Preflight与对齐结果保存在 `output/stage-closeout-l45-20261014/`。收口提交以 `docs: close out L45 character delivery and verification` 定位，不在同一提交预填自身SHA；正常push，不创建tag、新包或结束Cockpit会话。

## L44 形象切换与媒体升级验证（2026-10-13）

历史本轮交付为L44 / 1.0.1+2，详细固定审核对象、领口来源、哈希及实际命令结果见 [L44记录](pr109-l44-upgrade-2026-10-13.md)。215项领口派生断言、270帧对照与17肌群详情/交换/返回通过；Flutter分析、偏好迁移/恢复/服务/国际化/媒体定向回归通过；102媒体完整解码，离线Web及ARM64 APK构建/逐项打包哈希通过。真机保留数据安装、两形象同帧切换、冷启动保存和限定视频点播/暂停/互斥通过。新版媒体完整性不等于28项源QA提示销项，真机抽查不代表51项原生或长期设备验收。

补修 `63d22d7` 已固定head合并为 `f338b46`，主目录安全fast-forward。实际回读：443个Web文件与候选SHA一致、通用APK与具名包哈希一致、原21项用户文件SHA保持、主目录产品代码与验证候选无差异、HEAD/origin/master/远端master一致；证据为 `output/playwright/pr109-upgrade-20261013/main-sync-check.json`。实际Chrome逐项点播51视频的首帧/时间推进/暂停保持通过，错误0；领口另存复现的source/gzip SHA与交付相同。23条新增/修改文档链接存在，git diff --check通过。旧Web/APK已另存，P01/S4和根dist不改。

下方94项素材生产、L43与其他历史验证保持原对象和范围，不把过去的“不更新App”当作本轮新授权的限制。

<a id="l44-证据绑定与文档收口2026-10-13"></a>

## L44 证据绑定与文档收口（2026-10-13）

本次是用户显式要求的cockpit-closeout，原阶段基线 `4e7aaed3e1996758e39ea6e12fc1a571d6f5ab18` 已验证为收口前HEAD `441dfa681c4bbf14c9ac3037d48bca086e93b558` 的祖先。只读Preflight先完整列出阶段6提交/178路径和工作区21项用户文件，逐项归属清楚后才修改。没有读取凭据、原始日志、浏览器profile、构建产物或用户未跟踪素材内容，也没有检查其他仓库。

产品验证绑定到保存于 `63d22d755d6b82568be5b2589a9c3bef1cdc771e` 的L44候选产品树。实际 `git diff --name-status 63d22d755d6b82568be5b2589a9c3bef1cdc771e..441dfa681c4bbf14c9ac3037d48bca086e93b558` 只有pr109-l44-upgrade、verification、version-ledger三篇文档（8新增/2删除）；当前产品源码、模型、媒体、测试与候选相同。本次收口也只改已核对文档，因此以下原阶段验证在其原范围内有效，不能写成当前HEAD重新测试/构建。

以下时间均为2026-10-13北京时间。JSON回执多数未内嵌执行时间、命令或commit；“来源时间”取既有文件最后写入时间，只作为回执来源。实际命令/结果来自本会话可信工具输出，并以保存的产品树和有限delta补足绑定。证据目录B为 `output/playwright/pr109-upgrade-20261013/`。

| 检查与实际命令 | 原结果、来源与适用范围 |
| --- | --- |
| `flutter analyze --no-pub`（候选app目录） | 本会话实际执行exit0、No issues；L44保存前源码，未在本次文档收口重跑 |
| `flutter test test/ui/scene_process_recovery_test.dart test/domain/learning_store_test.dart test/data/drill_media_test.dart` | 本会话18项通过；随后最终 `flutter test --no-pub test/ui/scene_process_recovery_test.dart` 5项通过，涵盖质量重发与同帧恢复；对应63d产品树 |
| `npm run build`、`npm run verify`（候选app/scene） | 实际exit0；既有verify只覆盖原v41基线，新人体另见下两行，不借旧证据认证新表面 |
| `node tools/flare-body-swap/verify-collarfix.mjs --pipeline-root E:/AII-3D/3D-Body --url http://127.0.0.1:8892 --report E:/AII-3D/3D-Body/output/playwright/pr109-upgrade-20261013/collar/collarfix-verification.json`（候选根目录） | 215断言通过，270帧关节/骨矩阵差0、shader/返回材质保持；B/collar/collarfix-verification.json来源22:20:42 |
| `node output/playwright/pr109-upgrade-20261013/browser/browser-audit.mjs`（主目录） | 394×853 / DPR3.25场景8891，270帧差0、17详情/交换/同帧返回通过、错误0；B/browser/browser-audit.json来源22:21:58，实际读取候选场景 |
| `python app/tools/import-training-human-v2-media.py --source E:/AII-3D/3D-Body/output/training-human-v2-library-footfix-20261013 --report-dir E:/AII-3D/3D-Body/output/playwright/pr109-upgrade-20261013/media`（候选根目录） | exit0，51匹配/0未匹配；51视频+51封面完整解码、格式/时长/哈希/103备份核对通过；B/media/media-upgrade-report.json来源22:18:54。ffmpeg/ffprobe为当时PATH工具，未在本次重新导入 |
| `node output/playwright/pr109-upgrade-20261013/browser/media-playback-check.mjs`（主目录） | 实际Chrome51项首帧/推进/暂停保持pass、错误0；B/browser/media-playback-check.json来源22:42:11；不是51项Android完整验收 |
| `node tools/flare-body-swap/derive-collarfix.mjs --pipeline-root E:/AII-3D/3D-Body --out E:/AII-3D/3D-Body/output/playwright/pr109-upgrade-20261013/collar/reproduction/flare-collarfix.glb --report E:/AII-3D/3D-Body/output/playwright/pr109-upgrade-20261013/collar/reproduction/derivation.json`（候选根目录，APP_URL=8869） | 独立另存复现，source/gzip SHA均与L44交付相同；来源22:42:54；本次未再次写派生 |
| `flutter build web --no-web-resources-cdn --no-wasm-dry-run`、`flutter build apk --release --target-platform android-arm64`（候选app） | 本会话均实际成功；B/apk-check.json来源22:23:42保存指定包75,827,258字节/SHA8771c823…420ef、102媒体与模型打包哈希。包回执是指定文件内容观察，不冒称收口HEAD重新构建 |
| `adb -s QSG6Q8IFDMDELVGQ install -r E:/AII-3D/3D-Body/output/releases/Flare-L44-PR109-20261013-arm64.apk` | 原安装观察22:24:07成功、版本1.0.1/code2，数据保持；原冷启动424ms和8.5秒同帧切换、限定视频互斥/暂停证据保留，未在本次再操作手机 |
| `python output/playwright/pr109-upgrade-20261013/verify-main-sync.py`（主目录） | 原回执B/main-sync-check.json显式绑定完整441dfa6 HEAD/origin，443Web无差、产品源差为空、21用户项无变化，来源22:48:47；这是同步观察，不是新的测试/构建 |

本次Preflight实际执行 `git rev-parse --show-toplevel`、基线verify/ancestor、stage log/diff、`git status --porcelain=v1 --untracked-files=all`、`gh pr view 109 --repo mhgd3250905/3D-Body --json state,headRefOid,mergeCommit,mergedAt`、`git ls-remote origin refs/heads/master`：仓库E:/AII-3D/3D-Body，master跟踪origin/master，本地/远端441dfa6一致，PR109 MERGED且固定合并head63d22d7。完整状态只有21项阶段前用户文件（1MP4/12PNG/8元数据JSON），tracked/staged/unstaged/deleted/renamed均0；逐条保留且不读取内容。

已实际核对的canonical来源与current/history判定见台账收口段；确定的finding为入口/制作文档的L43历史边界未清楚标注、通用人物表述和路线中的旧媒体状态、验证缺少明确source绑定。对应修正仅限文档。保存的Preflight为 `output/stage-closeout-l44-20261013/preflight.json`；本次实际 `node output/stage-closeout-l44-20261013/check-closeout.mjs` exit0：12篇修改文档、53条本地链接/锚点、版本/QA及21用户路径完整归属通过，产品/frozen路径无改动、remaining finding为0。回执时间23:32:08，保存于同目录alignment-check.json；`git diff --check`通过。随后仅补入本句实际结果数字，不增加链接或改变产品范围，提交前再核对diff和完整状态。不默认运行全量测试或重建dist/App，原QA与设备/发布待办继续保留。

---

# 统一人体素材生产验证（2026-10-13，94项成片完成）

## 素材阶段收口检查（2026-10-13）

本次实际命令`node tools/drill-anim/verify.mjs`与`npm run build`均exit0：原59规格SHA保留、App51约束、75默认源/12专项及13人体源检查通过；dist构建完成，仅保留既有大于500KB的包体积提示。日志另存`output/stage-closeout-media-20261013/source-verify.log`和`build.log`。`node output/stage-closeout-media-20261013/check-docs.mjs`实际核对9份修改文档的17条新增本地链接/阶段锚点通过，`git diff --check`通过；收口仅修改文档，不新增安装、渲染或发布。

范围为基线b842aa4至a636b70的素材生产与选版记录，当前选版footfix-20261013。用户已认可瑞士球背伸鞋修，本次文档收口不改制作代码、模型、轨迹或包内文件。阶段完整性检查`node output/stage-closeout-media-20261013/verify-closeout.mjs`实际通过：13人体源身份、94项/23,454帧、56ready/38review/0failed/0pending、当前包1929条SHA、1776相对链接、鞋修原身体保持及全鞋顶点落地/墙距/方向证明、原手机尺寸实播收据均吻合。新证据另存`output/stage-closeout-media-20261013/integrity-check.json`，不覆盖历史验证收据。

原38项数值/求解提示是已保存素材的review状态，作为本轮选版事实保留，不将其改写为全身体QA通过。本次必需验证是版本、来源、文档与媒体完整性对齐；不重新求解动作、重渲94项或重新认定设备验收。全量解码已由原审计及鞋修独立解码给出，当前媒体SHA相同，不重复解码；Flutter analyze/test、App构建/安装和全量旧编辑器测试不适用，因为没有改App/场景运行源码或平台。既有T02等设备缺口保留独立台账。

用户后续反馈的瑞士球背伸鞋向修订单独保存：240周期帧+2秒静帧共241次非脚骨矩阵与除Toe外关节差均0；3个真实接触求解金样与目标重放差0。每帧17867鞋顶点落地、墙面间隙和鞋尖方向核对通过；双脚漂移0、QA通过、warning/触边0。新1080/720均独立完整CPU解码240帧/8秒；更新版94项包1929条SHA回读与1776相对链接通过。390×844实际播放新手机版readyState4、无错误，原包与App媒体保留。来源、特殊重放配方及证据见[鞋向修正](../../docs/erectors-B-footfix-2026-10-13.md)。

鞋修前首次便携包历史目录为 `output/training-human-v2-library-portable-20261013`，共1911文件；当时独立回读1910条SHA256全部一致，1784个包内相对资源链接存在，无未完成标记。包清单SHA256为 `64693fb473d7eeb461fa99199fa4547e22ca85d9f9831b8ce3988fb4f0135ddd`，SHA列表自身为 `4f9dc078939c21fac8a77bd76bfb504f99af34cae401542a7c3f2579901d3ba6`。证据见 `output/rerender-planning-20261013/final-portable-verification.json`；原包保留不修改，当前选用footfix包见鞋修记录。

鞋修前历史画廊 `http://127.0.0.1:8873/index.html` 在390×844视口实际播放托马斯2/10、椅子臀推和Flare正式循环，四项均720×720、readyState4、paused=false、error=null，时长24/10/8/9秒，文档宽390无横向溢出。包内相对视频与母版/封面链接正常，临时视口和搜索已恢复。实证见 `output/playwright/training-human-v2-library-final-ui-20261013/ui-check.json` 与 `phone-playback.png`；当前画廊8874另有鞋修实播证据，这些均为浏览器尺寸检查，不代表App已换片或真机安装。

生产目录 `output/training-human-v2-library-final-20261013`，94/94项已成片，共23,454帧／781.8秒，组成60正式＋8办公室＋8久坐＋12托马斯＋5早期示范＋1Flare。人体入口2.0.1保持2.0.0外观，原模型来源13份SHA与制作代码由每个worker核对。producer最终83ready/11review_required；最终独立审计56ready/38review_required、failed/pending均0，检查范围不同，不能混用或称94项QA全通过。来源清单及边界见[统一素材库](../../docs/training-media-library-2026-10-13.md)。

最终证据在 `audit-final/manifest.json` 与 `audit-final/directory-manifest.json`，早期audit不覆盖。94项旧/新关节逐帧独立整循环比对全部通过，全部骨矩阵逐帧最大差0为producer保存的制作记录，独立审计不重渲骨架。所选188个1080/720 H.264视频完整CPU解码通过，原2项构图的4个视频同时留证和解码，实际共192个；封面、尺寸/帧数/时长及所引用输入/QA/指标/媒体哈希记录在审计中。目录清单是生成时完整快照，raw/合成PNG清点字节，不宣称逐一重新计算PNG哈希。

身体QA独立归因是1项新增、9项继承、84项无身体标记。38项review还包含求解警告等原限制；原泛用QA和review均保留。新增项quadriceps-A完整240帧左手新体表接触估计234帧3.96mm、6帧4.02mm，原6个对应值3.19mm，超过默认4mm最多0.02mm。独立逐帧关节/接触质心差0、无穿模和新求解警告；K6片区径向估计不等于精确三角面距离，保持失败QA、不放宽阈值、不修改冻结姿态。最坏帧/原始数值及来源见 `output/rerender-planning-20261013/quadriceps-contact-triage.md` 和JSON。

托马斯2/10构图派生单独保存于 `output/training-human-v2-library-framing-20261013`；原2160主/高亮raw全身完整，只按整周期轮廓作一个恒定二维变换，不重新求解或改变运镜路径。720＋300编码帧加2静帧共1022次检查，边缘触碰0，1080画布最低边距58/59px；两组主/手机版完整解码通过，原raw/媒体/QA保留。最终audit选择派生媒体并保留原producer审计，不将构图通过升级为身体QA通过。证据为派生 `delivery-manifest.json`、各项 `source-evidence.json` 与 `framing-proof.json`。

已完成制作前必要检查：`node tools/drill-anim/verify.mjs`通过（原59SHA保留、75默认源＋12专项、13人体源、App51约束）；`npm run build`成功（仅保留既有包体积提示）。冻结生产代码独立审计、断点/缺失副本/哈希与帧索引负例见 `output/rerender-planning-20261013/batch-review.md` 和 `batch-library-audit-notes.md`。分段合成抽查10帧与原合成逐字节一致；真实侧撑完整240帧加静帧的15,183个关节坐标对照最大差0，骨矩阵每帧制作对照最大差0。两种H.264视频独立完整解码通过；手机样片头、手、鞋完整。

素材画廊于390×844逻辑视口实际打开播放720视频：readyState=4、videoWidth/Height=720、duration=8、paused=false、error=null，文档宽375≤视口390。点击时加载媒体、依原封面时间取姿态后播放；初版播放器仅等待canplay但preload=none未主动加载的问题已修正，原H.264成品没有改动。临时视口已恢复，批量制作代码保持冻结。该网页检查不冒称App已经替换视频或手机安装验证。

Flare适配器270帧原GLB骨架与原/新人体手脚实际对照最大差0，原相机全周期投影保留约80%占比、不裁切；原阶段文件SHA实读验证。它复用烘焙世界矩阵，不执行IK，无法恢复原求解器当时的警告，不能把空警告冒称原求解已全通过。历史5示范按原运行时播放，不用相似动作替代。生产对所有新、旧人体保存完整指标及QA，独立审计分别核验关节记录与制作骨矩阵证据；继承警告和新问题分别记录。素材生成不构成App替换、手机安装或用户新动作验收。

# 人体标准与托马斯版本整理验证（2026-10-13）

## 事实、基线与范围

用户观看第三轮预览后明确认可肩颈，要求后续新动作及旧动作优化以修复人体为标准，并授权文档/台账版本整理、保存提交和普通push。执行目录保持 `E:/AII-3D/3D-Body` / master。Preflight HEAD、origin/master与独立ls-remote均为 `6fbf7a7050322ce2d138ed97a8745a06fac2b8cd`；tracked/staged为0，原21项未跟踪用户文件与既有清单完全一致，未读取或暂存其内容。

隔离分支4ef5556以6fb为祖先，master到该head为5提交、28路径（A23/M5），已通过 `git merge --ff-only codex/thomas-reference-optimization` 保存至主目录，历史不改写。包括原12spec接入、四个优化保存点、显式肩部求解选项和完整人体配置；没有新增姿态调整。14项原PR合并SHA逐条检查第一父目标、第二父来源和祖先关系均一致。`gh pr view 106 --repo mhgd3250905/3D-Body --json state,isDraft,headRefOid,baseRefName,url`仍返回OPEN/DRAFT/原3d204源/master目标；本地优化快进不是GitHub PR合并。

实际记录范围：根/App README和AGENTS、CONTRIBUTING、制作工具入口/约定、人体清单/说明、第三轮记录、原整合审核、版本台账、待办及本文件。将“等待肩颈验收/尚未优化”修正为10-13已验收，原PR收据和此前各轮失败/警告保持历史原意。75项原库与额外12份专项分开（总87）；停止项1不计作通过，当前为2–12＋左侧镜像12个预览。制作源校验新增固定12项/3helper SHA及13份人体源SHA检查，原59/办公室8/久坐8和App51约束全部保留。

## 本轮命令与证据绑定

| 命令 / 证据 | source state、结果及边界 |
| --- | --- |
| `node tools/drill-anim/verify.mjs` | 主目录4ef5556加本轮校验补丁；87源/75原库/12专项（1停止）、原59哈希/办公室8/久坐8/App51、13人体源和3helper SHA及脚本/JSON检查通过。人体清单只追加用户验收元数据，运行时13份源与已验收4ef相同 |
| `node tools/verify-web-motion-v41.mjs --source E:/AII-3D/3D-Body-worktrees/motion-v41-source` | 主目录181采样与原PR3/v41运行源对照通过，默认轨迹差0、关节源差0、时钟差0；手动编辑/个人旧动画迁移与草稿保留通过。该检查保留自身暂停重放容差记录，不宣称每项误差都为0 |
| `npm run build` | 主目录真实dist构建通过，1629模块，原有大chunk提示；编辑器运行依赖继续离线，本次未覆盖任何个人localStorage |
| `node tools/verify-web-app-v41.mjs` | 主目录540帧/22骨与App默认v41对照通过，最大骨位置误差0.000533mm、时钟往返误差0；只涵盖默认打包循环，不扩展到个人动画或原生性能 |
| `E:/AII-3D/3D-Pose/hark-4080-venv/Scripts/python.exe tools/drill-anim/test_portability.py` | 7项通过，含实际Node导入、路径和清理边界；临时输出只在既有E盘工具配置内 |
| `node output/stage-closeout-20261013/main-model-smoke.mjs` | 使用主目录实际boot和8849预览，两姿态浏览器检查通过：6启用training-human-v2，切2恢复legacy-v7；pageerror 0。PNG及实际指标在同目录，不重渲已验收成片 |
| 10-12完整渲染与独立模型审核 | 六项新700px/5fps完整260帧＋复用320帧、12代表姿态、四栏播放/慢放/逐帧/手机桌面与Range读取；来源13SHA和专项规格与主目录一致，按[第三轮完整证据](../../docs/thomas-app-model-v3-2026-10-12.md)复用，不写成本轮重新渲染580帧。用户10-13验收补充视觉结果 |

证据保存在 `output/stage-closeout-20261013/`，媒体原证据在 `output/playwright/thomas-app-model-v3-20261012/`。`output/stage-closeout-20261013/final-doc-check.py` 验证新增本地文件/锚点、人体版本字段、源码固定哈希与有限delta；`git diff --check`及暂存检查必须通过后才能提交，实际提交由 `chore: close out accepted training human baseline` 定位，推送结果只在版本台账维护。

文档最终检查新增46处本地文件/锚点全部存在，17路径仅为15份Markdown、人体验收元数据JSON及制作源校验脚本。`git diff --check`与暂存检查通过后提交05fa9d2；普通push及远端SHA核对结果见版本台账。实际预览生成源也追加10-13验收标记并重新生成页面，11动作/12变体/四栏/JavaScript与媒体路径自检通过；原builder/index另存历史副本，所有媒体字节保持，未重新编码。当前外观已通过的记录和原通用QA警告同时显示。

## 限制、保留与下一步

本节版本整理阶段没有未决文档冲突或必需检查失败。App/Dart、App场景、媒体51原文件、包版本和iOS工程该阶段delta为空，因此Flutter分析/测试、App/场景重构建和设备安装不适用；官网/独立网页站/归档源也未变，不重复其构建与全解码。HD全片和旧动作批量重渲不属于该整理阶段，当时没有执行；随后用户明确授权的94项素材生产见本文件首节，不把新结果回填为先前已执行。原预览的通用QA警告不改成通过。Mac/Xcode/iPhone、40px横屏字号缺口、长期计时和原8成片归档继续列为待办，不借人体验收或素材成片销项。Play/Apple/网站未重新上传或部署，未新增包编号/标签或删除历史分支。

原21项用户文件、GLB/个人导出/草稿/备份、旧预览及L43/P01/S4包保持。下一次先读[版本台账](version-ledger.md)、[实施路线](development-roadmap.md)、[人体标准](../../docs/training-human-v2.md)及工具AGENTS；训练新动作及后续旧动作优化显式采用training-human-v2，并新增对应版本和输出。已有51视频不自动覆盖，E:/AII-3D/3D-Wrist禁止触碰。Cockpit仅登记非终态进度，不自动结束或接力。

---

# 主线整合文档收束（2026-10-12）

本节是截至6fbf7a7的历史收束范围。其“#106待优化/未下载/不合入”是当时事实，当前以顶部10-13验收和保存记录为准；原验证命令及限制保留。

## Preflight：来源、范围与完整状态

用户明确要求版本整理、台账/文档对齐并保存、commit、普通push，之后再安排#106。仓库边界经 `git rev-parse --show-toplevel` 确认是 `E:/AII-3D/3D-Body`。收束scope为本轮网站/制作源/iOS/媒体归档整合的当前文档、版本与发布记录；不改产品代码、配置、包版本、模型/媒体字节，不制作新安装包，不优化/渲染/合并#106，不删除历史分支，不跨仓库。

baseline采用初次工具整合记录明确的L43本地起点 `3a8955d14157a0ee8406cf640e00f40d68b4ae9f`（SHA本身为可核对引用）。`git rev-parse --verify <baseline>^{commit}` 与 `git merge-base --is-ancestor <baseline> HEAD` 成功。Preflight HEAD为master `51cd3d229acf5442e95b3bb491a36adeee3421fc`；普通push之前该SHA已与origin/master和GitHub master一致。

`git log --first-parent <baseline>..HEAD` 为22次主线提交；`git rev-list --count <baseline>..HEAD` 为385个可达提交，包含并入分支的原历史，不描述为本轮新编写385次。`git diff --name-status <baseline>..HEAD` 完整有限delta为430条路径记录，A403/M27，无D/R；类别为根README1、app46、docs9、tools204、webapp20、website150。`src/`、`public/`、`app/scene/`、`app/assets/data/`、`app/assets/scene/`、`app/assets/drill_media/`、`app/assets/l10n/` 差异为空；App源码/工程补修与已安装APK身份分别记录。

发现顺序是根/App适用AGENTS与根README入口，再沿与本阶段相关的明确来源一跳检查；没有扫描全仓或其他项目。实际检查如下：

| 路径 | current / archive判定、主题与核对结果 |
| --- | --- |
| `AGENTS.md`、`app/AGENTS.md`、`README.md`、`app/README.md` | current入口与合约；L43已安装、零预算/v41/14语/51视频及用户素材保留，源码整合没有新安装身份 |
| `app/docs/version-ledger.md` | current版本/源码检查点/安装/发布台账；补录本轮合并与文档保存点；L38–L43旧收束及2026-10-10 Mac S4段落标明历史 |
| `app/docs/verification.md` | current验证/source state；本节是本轮证据，后续L38–L43及S4章节保留各自旧源和时间，不与本轮次数相加 |
| `app/docs/development-roadmap.md` | current实施/待验收台账；补#106待安排、原8成片待上传、iOS原生/横屏和历史分支保留；T01–T06不自动销项 |
| `app/docs/motion-v41.md` | current动作/重放/同帧/来源合约；相关runtime与资产delta为空，无finding，不修改 |
| `docs/integration-pr-audit-2026-10-12.md` | current本轮来源、PR合并收据和审核范围；#94–#105/#107/#108已合，#8已覆盖，#106 Draft；与三份台账划分职责 |
| `docs/drill-anim-integration-2026-10-12.md` | archive/history：截至1f87cc6的首次纳入；59源与#8待处理是当时事实，补范围提示，历史备份/验证不删除 |
| `tools/drill-anim/README.md` | current工具入口；更新75默认制作源＝59原＋8办公室＋8久坐，五项归档独立，#106不计入，App51选版不替换 |
| `website/flarelab/README.md`、`webapp/README.md` | current组件说明，实际只核对本阶段相关段落；官网/独立网页站为不同入口，网页站静态训练卡/中文深色功能差异明确，本轮未重新部署 |
| `app/docs/ios-main-integration-audit-2026-10-12.md` | current本轮iOS审核入口，内含过程/历史证据；补最终来源8196ce6和#107合并状态，保留累计50项范围与原生未验限制 |

完整 `git status --porcelain=v1 --untracked-files=all` 初检与只读复查一致，未截断：tracked/staged/unstaged/deleted/renamed均0、untracked21。全部为阶段前明确记录的用户资源，只按路径/类别核对归属，不读内容：`Air-Flare/air-flare-demo.mp4` 1项；`app/assets/brand/` 12PNG/8imagegen元数据。具体21路径与下方L38–L43完整状态清单一致；保留、不暂存。阶段二新增内容全部属于本Agent确定的8份Markdown对齐，不清理或覆盖用户资源。

## 验证命令、时间与source state

| 命令 / 来源 | source state与结果、复用边界 |
| --- | --- |
| `node tools/drill-anim/verify.mjs` | 2026-10-12 17:20北京时间，本次Preflight HEAD `51cd3d229acf5442e95b3bb491a36adeee3421fc`、tracked改动0执行；75项/原59哈希/办公室8/久坐8/App51 ID通过 |
| `node tools/drill-anim/revisions/hark-4080-v1/verify.mjs` | 同时间和HEAD执行；64文件/5动作核验通过，`full_rerender:false`、原QA保留，不能写成新版全渲染通过 |
| 根目录 `npm ci`、`npm run build`、`node tools/drill-anim/verify.mjs` | 本会话#108合并后已在 `0f0698cd9498b02f0d9d160a3266de05b6b23dbe` 执行并通过，原有大chunk提示保留；该SHA到Preflight HEAD只改README和整合审核Markdown，因此源码/依赖/构建输入不变，可复用，不重复构建 |
| App `flutter analyze --no-pub` 与定向Flutter范围 | 来源为本会话iOS试合并/补修回执及iOS审核中的完整命令，累计50项独立范围，不是一次全量suite；最后受影响复测 `flutter test --no-pub --concurrency=1 test/ui/scene_process_recovery_test.dart` 4项通过，补修保存点 `878c3ebaecdfd9d5f2aac56a1c18a295417e0d84`。最终来源8196ce6及该补修SHA到Preflight HEAD的 `app/` delta均为空，旧证据仅按已覆盖范围复用；完整命令保留 `--exclude-tags landscape` 限定 |

文档对齐后 `git diff --check` 通过，新增20处本地文件链接/锚点无缺失，改动路径严格为上表中确定修正的8份Markdown，非Markdown差异为空；`app/pubspec.yaml`仍为1.0.0+1，完整状态复查仍保留原21项用户资源。必要检查与文档改动成比例，不重复全量Flutter、媒体渲染、Mac或设备流程。构建产物和历史日志不作为当前源码的额外证明，也没有读取秘密、凭据或浏览器profile。

## Alignment结果与边界

确定finding均已对齐：台账缺少本轮源码保存点；工具入口仍只列59；早期#8待处理与当前合并状态未区分；验证入口未集中说明75/归档与iOS证据绑定；待办漏列原8媒体归档和#106等待安排；根“网页未部署”未区分原编辑器与新增网站。当前来源分别记录身份、证据与待办，整合审核只保存PR收据；历史章节和旧包不删除。

剩余产品工作是明确的待办，不是文档对齐失败：#106动作方向及优化待用户新安排；mhgd原8成片待上传；iOS Mac/Xcode/签名/iPhone/Apple新包与844×390/2倍字号40px溢出待处理；设计/备份分支保留。sk新目录已读取总览JPG＋12GIF清单、名称无缺项，本轮没有下载或完成云盘媒体的画面审核。源数量、解码或QA布尔均不扩大为教练/医学/真机验收。

保存点通过Git提交 `docs: close out master integration ledger and verification` 定位，不预填自身SHA。用户已明确授权普通push；提交后核对本地HEAD、origin/master和远程master，原21项用户未跟踪资源继续保留。Cockpit仅可在本地收束成功后登记一次非终态检查点，不结束会话或自动接力。

---

以下保留此前L38–L43文档收束及各版本验证历史，不能代替本轮源码整合或新安装验收。

# L38–L43文档收束验证（2026-10-12）

## Preflight与scope

baseline为L37 `8c8ea19d89c5a64a7b226e5239379cd974107c8c`（已记录的用户保存点，L38由此开始）；以 `git rev-parse --verify <sha>^{commit}` 核对有效，`git merge-base --is-ancestor <baseline> HEAD` 成功。HEAD `6afb6fdea8fb35099d24364c6b252f3f052d93eb`，分支master；repo root经 `git rev-parse --show-toplevel` 确认为 `E:/AII-3D/3D-Body`。`git log --oneline <baseline>..HEAD` 与 `git diff --name-status <baseline>..HEAD` 为7提交/142路径记录（M40/A100/D1/R1）。

scope为L38–L43的当前文档/配置说明/版本/发布与安装观察对齐，不修改产品代码、翻译/模型/媒体字节、版本号、构建包、根dist/编辑器、原导出或个人数据，不跨仓库。源码、生成翻译/场景及配置delta由以下canonical明确映射，历史设计不作为当前要求。

| 实际检查来源 | current/archive判定与核对主题 |
| --- | --- |
| `README.md`、`AGENTS.md`、`app/README.md`、`app/AGENTS.md` | current入口/工作约定；旧L41/L36、重复版本段落已对齐L43 |
| `app/docs/version-ledger.md` | current版本/安装/发布唯一台账；L38–L42分段与L43原交付观察保留实际时间及范围 |
| `app/docs/verification.md` | current验证/source state；旧版本章节为archive/history，本次16项不与旧次数相加 |
| `app/docs/development-roadmap.md` | current M0–M7/T01–T06；9:8/11:7为被L43覆盖的历史，用户自行设备验收仍待完成 |
| `app/docs/motion-v41.md` | current烘焙/同帧/原着装合约；动作未改，v38保留历史 |
| `app/docs/localization.md`、`compact-labels.md` | current 14语/270界面/591内容/17短名/RTL/稳定ID；L38/L39旧测试仅历史 |
| `app/docs/asset-sources.md` | current许可/字体来源；3字体大小/哈希与tracked源/OFL相符；output字体清单注明本机留档 |
| `app/docs/privacy-local.md` | current本地数据；补settings.language/system/旧记录迁移与训练视频封面 |
| `app/docs/drill-media-2026-10-11.md` | current媒体交付入口；L30–L37/当时未安装未提交为archive，不代替当前L43 |
| `app/scene/README.md` | current 3D接口入口；旧v38/裸肤study/旧比例与密度正文划为archive，补当前v41/L43/localization/viewport |

发现顺序为适用根/App AGENTS→README入口→明确声明的一跳来源。只按本阶段主题检查，未递归扫描其他项目或历史文档；未读取secrets/profile/日志/构建产物。语言/字体/配置只读核对由GPT-6 Luna max协作完成，root整合裁决。

## 完整状态与归属

`git status --porcelain=v1 --untracked-files=all` 完整初检与复查输出一致，未截断：tracked/staged/unstaged/deleted/renamed均0，untracked21。阶段前已明确归属用户且保留：

- `Air-Flare/air-flare-demo.mp4`。
- `app/assets/brand/icon-flare-angle2-a.png`、`icon-flare-angle2-c.png`、`icon-flare-angle2.imagegen.json`。
- `app/assets/brand/icon-flare-draw-a.png`、`icon-flare-draw-b.png`、`icon-flare-draw-c.png`、`icon-flare-draw-d.png`、`icon-flare-draws.imagegen.json`。
- `app/assets/brand/icon-flare-model-v3.png`/`.imagegen.json`、`icon-flare-model-v4-cute.png`/`.imagegen.json`。
- `app/assets/brand/icon-flare-v2.png`/`.imagegen.json`、`icon-flare-v5-animation.png`/`.imagegen.json`、`icon-flare-v6-user-pose.png`/`.imagegen.json`、`icon-flare-v7-pose-corrected.png`/`.imagegen.json`。

以上按路径/类别核对，不读取内容，不清理或暂存。统计1视频/12PNG/8元数据。Alignment新增变更仅本Agent已确定的文档修正；明确路径暂存、非空本地提交，未reset/stash/checkout/clean/tag/push。

## 验证与source state

2026-10-12 01:20（北京时间），在app目录执行：

```powershell
flutter analyze --no-pub
flutter test --no-pub --concurrency=1 test/ui/compact_localization_test.dart test/ui/internationalization_test.dart test/ui/muscle_library_flow_test.dart test/data/catalog_localization_test.dart
```

分析No issues found；16项通过（compact1、internationalization3、muscle flow7、catalog5）。包含真实字体14语两尺寸、RTL/搜索/旧设置迁移、51训练ID/剂量和多语检索、L42连续排版与阅读位置、L43两模型半屏/固定舞台/同帧返回。source state为完整HEAD `6afb6fdea8fb35099d24364c6b252f3f052d93eb`、tracked工作树无差异；之后仅修改上述文档，产品/测试/配置源无变化，证据适用于文档收束检查点。不是全量suite或母语/医学审核。

L43的Web/ARM64构建、中文394浏览器、签名/资产核对与00:30:46安装观察沿用下方原记录及本会话实际工具结果。`0606a58..6afb6fd` 产品差异仅app_shell.dart半屏补丁，与构建时工作树一致；其后没有产品变化。`e084268..6afb6fd` 场景源码/生成物delta为空，L40场景证据保留原范围。本次不重新读取构建产物/本机日志，不把文件存在当作当前构建或设备验收；不重复构建、安装或浏览器手势。iOS/生产发布/原生验收在scope外；无需改根dist，未执行全量Flutter或场景构建。

Alignment后用Python按12份明确路径检查本地Markdown引用，334处链接均存在；断言当前App说明无L41/L36、路线下一步无安装L38、场景当前v41与密度1/3/4且旧v38段落已归档。`git diff --name-only`仅这12份Markdown，产品/测试/配置差异为空；`git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol diff --check`通过，随后完整状态与暂存检查再次核对。收束仅修正文档，当前交付仍L43，具名APK/Play P01/原数据保留；下一步按development-roadmap的T01/T02/T06由用户验收，禁止默认触碰素材/原编辑器/个人动画或发布。保存点由版本台账和 `docs: close out L38-L43 app delivery records` 提交定位。

---

# L43上下半屏验证（2026-10-12）

源基线0606a58，检查点以 `feat(app): balance L43 muscle detail halves` 定位。只调整详情上下Expanded为1:1及送scene的bottomInset为可用舞台高度50%；顶部栏、共享WebView/清晰度、scene资源和媒体保持。动作/站立共用分区，默认相机自动按上半区取景，站立自由旋转/缩放、动作旋转禁缩放/平移及同帧返回保持。L42文字字号/宽度/内边距/阅读位置连续性与无图标保持。

全项目analyze无问题，11项定向回归通过：compact_localization_test 1项（14语×两尺寸×实际字体）；internationalization_test 3项；muscle_library_flow_test 7项。新增320×700/390×844检查上下区域各占stage高度50%且相邻、motion/muscles交换的分区/舞台/selectionGeneration/time/paused保持、两模型知识展开不改分区、返回时间与舞台保持。空间够时既有知识回归检查全文直接可见，确有溢出才拖动；24倍长文的连续展开/关闭检查保留。测试由GPT-6 Luna max更新、root整合，不重复全量suite。

Web/ARM64 release成功，原Debug签名和aapt2包名/版本通过。[4资产源/Web/APK](../../output/drill-media-20261012/L43-package-check.json)一致；L42/P01哈希保持，本轮不改scene或训练资产。

Chrome394×853/DPR3.25中文实景，两模型camera.viewInset及target均372.5px，iframe高745px，区域严格1:1；站立默认头/两脚完整，双侧腹斜肌保持。缩放相机距离缩短、拖动相机方向变化，切回动作恢复原机位/暂停时刻；返回首页time6.052980132450331保持，首页insetTarget恢复102。各模式buffer1182×2235/密度3保持，footer(x20,y785,w354,h56)不变；console error/warn=0。[实景](screenshots/2026-10-12-L43/README.md)及[记录](../../output/drill-media-20261012/L43-browser-ui-check.json)。浏览器手势不代替原生双指/性能验收。

00:30:46保留数据安装，firstInstallTime2026-10-08 17:53:04保持；启动Status ok/UNKNOWN(0)/Wait3014ms，不声称冷启动性能。[回执](../../output/drill-media-20261012/L43-device-install.json)。用户自行验收，未手机UI操作；iOS/原生手势/设备矩阵及T01–T06待验收，未push/发布。原dist/编辑器/个人数据与候选素材保留。

---

# 历史：L42连续展开验证（2026-10-12）

源基线5df32a3（L41），本地检查点以 `feat(app): refine L42 continuous knowledge expansion` 定位。共享卡片/文本样式：14px/1.55、相同宽度/10px横向与4px纵向padding/边框/圆角/背景，去掉右侧图标。预览字形在阅读层显示时隐藏；矩形和阴影动画，收起在实际末帧交还文字滚动位置，340ms/240ms仍尊重reduce motion。文字/上方外部点击收起；极长内容无条拖动，底部固定区域和场景不变。

全项目analyze无问题，3测试文件合计9项通过：compact_localization_test 1项（14语言×320/390两尺寸×实际打包字体，有溢出时展开有界和按钮固定）；internationalization_test 3项；muscle_library_flow_test 5项。后者检查320/390展开100ms、收起100ms和结束的Text/RenderParagraph样式、TextScaler、段落宽高与相对padding一致；无Icon；预览scroll offset传入reader、继续阅读后关闭传回、重开/外部关闭保留位置。原超长全文/自然全文0滚动/换组销毁/固定控件与暂停帧检查保持。测试由GPT-6 Luna max更新、root整合；同子集复跑不累加。

离线Web/ARM64 release成功，原Debug签名通过。[4资产源/Web/APK核对](../../output/drill-media-20261012/L42-package-check.json)一致，L41和P01哈希保持；场景与训练媒体未变，不重复全量Flutter/场景测试。

Chrome394×853/DPR3.25中文实景：卡片宽346px保持，预览49.72px与展开120px，文字换行一致，右侧无图标。点击文字和上方外部关闭有效；footer(x20,y785,w354,h56)、iframe(x0,y108,w394,h745)、phase15/time6.052980132450331/quality medium在展开/关闭后完全相同，console error/warn=0。[截图](screenshots/2026-10-12-L42/README.md)及[记录](../../output/drill-media-20261012/L42-browser-ui-check.json)。实景范围为中文394，14语覆盖为组件回归。

00:17:33通过adb install -r保留数据安装手机；firstInstallTime保持2026-10-08 17:53:04，启动Status ok/UNKNOWN(0)/Wait3014ms，不能视为冷启动性能。[安装回执](../../output/drill-media-20261012/L42-device-install.json)。用户自行验收，未操作手机UI；原生视觉/手势/读屏、iOS与T01–T06待验收。未push/发布，根dist/个人数据/候选资源保持。

---

# 历史：L41知识展开阅读验证（2026-10-11）

基线e084268（L40），以 `feat(app): add L41 expandable muscle knowledge` 检查点定位。详细说明预览不显示Scrollbar/桌面自动滚动条；溢出点击OverlayPortal在原底边向上展开，340ms/收起240ms并尊重reduce motion。使用14px/1.6全文、已有14语more/close语义，内容长度计算含边框/舍入余量；长于屏幕时展开卡独立无条滚动。读完点全文、关闭图标或上方外部收起；协同卡/footer与3D舞台不参与位移，换肌群销毁旧层。

全项目flutter analyze --no-pub无问题。3个测试文件共9项通过：compact_localization_test（1项包含14语言×两尺寸×真实4字体/短名及有溢出全文展开有界与固定按钮）、internationalization_test（3项RTL/知识及训练布局）、muscle_library_flow_test（5项原3项与新增320/390展开）。新增测试覆盖中间动画、底边对齐/顶部有界、24倍超长fixture全文及滚动、自然源文案reader maxScrollExtent=0、关闭按钮/外部关闭/换肌群销毁、舞台/卡片/footer/时间不变。换肌群允许原compact逻辑切换按钮48/56高度，仅底边固定。定向测试由GPT-6 Luna max与root整合；同子集复跑不累加。

离线Web/ARM64 release构建成功，原Debug签名验证通过。[包核对](../../output/drill-media-20261011/L41-package-check.json)4资产源/Web/APK一致，L40/P01保持；本轮不改场景/媒体，不重复无关场景或全量Flutter测试。

Chrome394×853/DPR3.25最终GUI：臀中肌预览无条，点击展开全部两段文字，关闭回到预览。展开前后footer(x20,y785,w354,h56)、iframe(x0,y108,w394,h745)、phase15/time6.052980132450331/quality medium完全相同。console error/warn为0。[实景](screenshots/2026-10-11-L41/README.md)及[浏览器记录](../../output/drill-media-20261011/L41-browser-ui-check.json)。14语完整页面人工、原生文字交互仍需用户验收。

23:50:59通过adb install -r保留数据安装，firstInstallTime2026-10-08 17:53:04保持；启动Status ok/Wait3016ms/LaunchState UNKNOWN(0)，不将其记作冷启动性能。[回执](../../output/drill-media-20261011/L41-device-install.json)。按用户要求不操作手机UI；iOS、原生读屏/手势与T01–T06保留待验收。未push/商店发布，根dist、个人数据与候选资源保留。

---

# 历史：L40高密度3D清晰度验证（2026-10-11）

源基线51b1e02（L39已安装记录），检查点以 `feat(app): sharpen L40 high-density rendering` 定位。只改场景渲染密度、质量别名、标签纹理滤波与只读诊断；不修改动作人物、机位、材质、几何、Flutter布局或媒体。默认medium/均衡DPR最多3、high最多4、low/省电最多1。标签4×CanvasTexture不生成mipmaps、minFilter LinearFilter。画质改变才重分配buffer，首页/详情/站立切换保持同一密度。

`node tools/verify-render-quality.mjs` 通过宿主别名、3.25设备默认/高清、省电、非高密度、极端/非法值；已纳入npm run verify。scene build和v33/v38/v41契约通过136选择案例，12缩略图机位/density/输出转换/材质身份/失败恢复/资源所有权通过。只改JS场景，不重复无关Flutter全量测试。

离线Web与ARM64 release构建成功，原Debug证书验证通过。[包核对](../../output/drill-media-20261011/L40-package-check.json)4项场景/媒体清单源/Web/APK一致，L39及Play P01旧哈希保持。入口index-C6GykFmW.js / index-D1CmUuBK.css，包身份见版本台账。

真实Chrome为394×853、DPR3.25（对应所连1280×2772、520dpi手机）。拥有的浏览器临时路由旧L39 bundle作对照，未改稳定服务/用户标签页。相同phase15、time6.052980132450331及camera，旧591×1117/1.5密度，新1182×2235/3；两维翻倍、总像素约4倍。三个13px完整标签均4倍纹理、mipmaps=false；图像边缘与字体对照见[实景](screenshots/2026-10-11-L40/README.md)。实际UI切换省电/高清/均衡分别确认1/3.25/3密度，buffer394×745/1280×2421/1182×2235，等待bridge异步应用后读取。

三个视图：主页动作与详情动作均完整身体；站立默认头/双脚完整、双侧当前区域保持。滚轮、鼠标拖动旋转及CDP两个触点模拟放大有效，相机距离缩短、方向变化，buffer1182×2235/密度3/暂停时刻保持；切回动作恢复原相机与帧。浏览器记录见[L40-render](../../output/drill-media-20261011/L40-browser-render-check.json)和[three-model](../../output/drill-media-20261011/L40-three-model-check.json)。console error/warn均0。默认完整身体与主动放大看局部是不同验证范围。

23:22:18保留数据覆盖安装成功，firstInstallTime仍2026-10-08 17:53:04；启动指令Status ok/COLD428ms。用户自行验收，未操作手机UI，浏览器手势不代替原生双指/拖动或视觉验收。[安装回执](../../output/drill-media-20261011/L40-device-install.json)。更多像素会增加GPU成本，原生FPS/温度/电量、T01–T06/iOS仍待验收，未push/发布。用户候选资源、根dist和个人数据保持。

---

# 历史：L39多语言紧凑标签验证（2026-10-11）

源基线为master `2648cb8d260777805d1cf70cb56c411af5c8b654`，本地检查点以 `feat(app): refine L39 compact localized labels` 定位。14×17准确短名已接入Flutter及3D；完整名称、训练结构与原数据保持。短屏提示避让，阶段名允许两行；首页transport为72px并同步场景inset，详情短屏9:8分区与正常11:7保持同一iframe舞台。简介测量换行后采用紧凑布局以保护知识区，文字块独立滚动。

`flutter analyze --no-pub` 无问题。`flutter test --no-pub --concurrency=1 test/ui/compact_localization_test.dart test/ui/internationalization_test.dart test/ui/muscle_library_flow_test.dart test/data/catalog_localization_test.dart` 12项通过。紧凑布局测试加载4个实际离线字体，在14语言×320×700/390×844检查17标签150px内无省略、8阶段名两行可见、提示两行及界内、最宽肌群CTA/完整语义、标题和知识视口至少40px。数据回归检查全部训练14语短名/全名均可搜索，ID、剂量保持；知识/协同卡独立滚动与固定footer通过。同范围复跑不累加。

资源结构14×270 ARB、14×591内容和14×17短名键/非空/唯一/占位符/数字序列检查通过；4字体联合cmap覆盖238短名。[资源记录](../../output/drill-media-20261011/L39-resource-check.json)。scene build/verify的v33/v38/v41历史契约136案例通过，本轮短名不改变22骨/44轨/540帧。场景入口 `index-rojuNpVy.js` / `index-D1CmUuBK.css`。

离线Web和ARM64 release构建成功，原Debug证书验证通过。[包核对](../../output/drill-media-20261011/L39-package-check.json)36资源源/Web/APK完全一致，旧L38/P01哈希保持。具名APK字节/哈希见版本台账。

真实Chrome GUI：英语390的phase11标签/图例完整显示Gluteus medius，13px；详情CTA为Train Gluteus medius，知识视口70.22px，滚动前后footer、iframe及暂停时刻固定，跳训练搜索框视觉预填短名且得到对应居家1项。俄语与阿语320标签/图例完整、13px，提示与同步卡避让；阿语RTL保持。[最终截图](screenshots/2026-10-11-L39/README.md)与[报告](../../output/drill-media-20261011/L39-browser-ui-check.json)区分软件28组合回归和限定实景，不声称14语言全部页面人工验收。

构建时L39未安装；用户随后连接手机，23:04:32通过adb install -r保留数据更新成功，firstInstallTime保持2026-10-08 17:53:04。启动指令Status ok、COLD 350ms；不操作手机UI，用户自行验收。安装与启动不扩大为功能验收，[安装回执](../../output/drill-media-20261011/L39-device-install.json)。iOS构建、原生14语/读屏、母语审核、长期计时和T01–T06继续待验收；未全量suite/push/商店发布。原视频、根dist/编辑器、个人数据与用户候选素材保留。

---

# 历史：L38离线国际化验证（2026-10-11）

source base为master L37本地提交 `8c8ea19d89c5a64a7b226e5239379cd974107c8c`；本阶段以 `feat(app): add L38 offline internationalization` 本地提交定位，未push或发布。14语言界面/目录/知识/课程、系统与手动语言、原数据迁移、3D字体/标签/读屏文字和RTL已接入。L37肌群固定标题/作用、独立知识滚动、协同卡/footer及双侧人台保持。

在app目录运行 `flutter analyze --no-pub`，结果No issues found。`python tools/verify-localization.py` 核对14×270界面及14×591内容的键、非空、元数据、占位符及剂量数字顺序，failures为空；资源检查4字体联合cmap对全部翻译字符无缺字。该检查不证明母语表达、真实字体形塑或医疗准确性。

`flutter test --no-pub --concurrency=1 test/data/catalog_localization_test.dart test/ui/internationalization_test.dart test/domain/learning_store_test.dart test/platform/scene_asset_router_test.dart test/ui/muscle_library_flow_test.dart test/platform/scene_asset_server_test.dart` 共33项通过：全资源/locale解析/旧设置与记录保留/51训练结构及多语言搜索、Arabic RTL及时间轴拖动、320×700与390×844英文布局、学习存储、字体白名单与媒体Range、肌群知识/卡片独立滚动与搜索返回、loopback服务。重复子集不累加。另跑分段按钮tap/drag/semantics焦点测试通过。新增Arabic 390×844肌群知识视口≥40px及知识滚动时协同卡/footer固定回归通过；翻译较长的小屏使用紧凑卡片，保证独立知识区可读，中文原布局保持。

辅助执行历史 `polish_round2_test.dart` 时，旧训练详情测试仍要求hero y=0、滚动出现磨砂栏，与L32已采用的固定顶部标题设计冲突（当前y=70）；该项失败，源L37同一旧断言已存在，本轮未改训练详情布局。分段控件及相关国际化回归通过；不声称全量suite通过。

scene `npm run build`、`npm run verify` 通过v33/v38/v41 CPU/源码契约，540帧/22骨/44轨、136组选择案例通过。该检查不等于GPU渲染/真机验收。当前场景入口 `index-akXJ7oGi.js` / `index-DLlJ_85v.css`。

离线Web `flutter build web --no-web-resources-cdn --no-pub` 和 `flutter build apk --release --target-platform android-arm64 --no-pub` 构建成功，原Debug证书签名验证通过；包身份见版本台账。一次Android重构建因本机JVM原生内存不足中止，将Gradle最大堆降为2G、worker限2后重试成功；只调整构建资源，不影响运行时。包核对22项内容/字体/场景及未改媒体清单的源/Web/APK字节一致，4字体均在FontManifest声明，旧L37/P01哈希保持。

Chrome实际GUI通过14语言设置选择/本地标题更新；英语及阿拉伯语刷新后偏好保留；Arabic 390训练搜索本地肌群得到对应1项，详情标题/剂量/说明本地化且返回按钮在右，内容两列保持。韩文、天城文、阿拉伯文和繁中/日文设置截图已核对。390阿语最终知识视口84px、协同卡54px与footer底832px在844px屏内；双行作用的最低40px独立回归通过。3D实际字体加载、标签语言及小屏证据见 [浏览器记录](../../output/drill-media-20261011/L38-browser-ui-check.json)。[5张最终实景](screenshots/2026-10-11-L38/README.md)随源码保存；不扩展为14语言全部页面人工验收。

Android `supportsRtl` 已配置；iOS Info.plist声明14语言，plist解析通过，Windows未执行iOS构建。语言选择由App自己的本地设置管理，未接入Android/iOS系统“单独App语言”同步接口。训练原视频及媒体清单字节保持。翻译由GPT-6 Luna max完成并经英语交叉审阅，未经过母语者/医疗人员审核；后续手机已连接并保留数据覆盖安装L38，安装与冷启动指令通过；用户随后明确自行验收，已停止真机交互。语言、视频、肌群详情及T01–T06/原生读屏仍待用户验收，不将安装成功扩大为功能验收。安装回执见 [device-install](../../output/drill-media-20261011/L38-device-install.json)。用户Air-Flare、图标候选、根dist/原编辑器/个人数据及Play P01保留。

---

# 历史：L37肌群知识与双侧人台验证（2026-10-11）

source state仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。首页Flare斜体字标、青绿细线/点与中文小副标保持44px header；详情标题/一句作用固定，17组原审核知识分两段放入独立ScrollBar滚动区，作用亮半粗、知识12.5常规。协同卡/footer固定，切肌群重置滚动，长标题36px FittedBox；320×700紧凑卡片/48px按钮修复54px溢出。直立人台全图/小图双侧当前群组，演员/首页同步图保留阶段侧别。

分析无问题，13项定向测试通过（原12项与320短屏修复1项，390/552复跑属同范围、不相加）。552组件测试所选阶段/作用行数可容纳知识，不要求无意义滚动；下述552真实浏览器phase12具有不同作用行数，已实际滚动，两者不混同。scene构建与v33/v38/v41验证136案例通过。离线Web/ARM64 release最终构建与原Debug签名通过，[包核对](../../output/drill-media-20261011/L37-package-check.json)场景index/JS/CSS及未改媒体清单4项源/Web/APK一致，通用/具名APK相同、旧L36/P01哈希保持，身份见 [版本台账](version-ledger.md)。当前场景入口 `index-BuYy9_Wa.js` / `index-DLlJ_85v.css`。

[限定CPU检查](../../output/drill-media-20261011/L37-bilateral-check.json)直接执行phase-map选择函数与真实MM模块：phase14左/phase10右肱三头肌在人台detail均选择both、focusSide0，演员state仍+1/−1，首页priority子集保留阶段侧别；full/mini共用phaseMap.scene。不含顶点/GPU/shader模拟，不当作视觉通过。

[真实GUI](../../output/drill-media-20261011/L37-browser-ui-check.json)390 phase15已核对人台双臂粉色、演员单侧蓝色，知识scroll0→20、固定区域与736px舞台保持；552 phase12肱三头肌scroll0→17，知识viewport/协同卡矩形、801px舞台与暂停时刻2.650467789970562严格不变。552深浅主题截图通过；320真实紧凑布局无溢出、按钮正常。标题/作用/footer固定与切肌群重置另由定向组件测试覆盖。console错误/警告均0，最终390人台截图为当前淡边框版本。

L37构建时未安装/提交/push/发布；其后已按用户要求保存本地提交8c8ea19，手机此前只装L29原型。原生媒体/iOS/长期训练未验收，Play P01、旧包、根目录dist与个人文件保留；L36精简/L35搜索与L31媒体证据仍按各自范围使用。

---

# 历史：L36界面精简与常驻搜索验证（2026-10-11）

source state仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。包含L35常驻搜索全部行为，详情去阶段/暂停小字、拖动旋转提示与协助发力小标题；header高度、舞台、底部卡片/footer保持。首页单行“Flare · 托马斯助手”、headingHeight44，phase-map宽180/视图高124（短高128/96）；front/back视觉文字移除，可访问标签保留两面含义。

全项目分析无问题，flow10、library4、muscle3共17项定向测试通过。scene `npm run build`与`npm run verify`的v33/v38/v41检查通过，输出 `index-C1A1p886.js` / `index-DLlJ_85v.css`。离线Web与ARM64 release构建、原Debug证书签名和aapt2 `dev.mhgd.flare` / `1.0.0+1`通过；具名/通用APK相同，身份见 [版本台账](version-ledger.md)，旧L35/L34包保留。原媒体未改，历史资产证据沿用自身范围。

[真实移动Chrome](../../output/drill-media-20261011/L36-browser-ui-check.json)通过：390首页标题正确、phaseCard180×182、view高124、两面视觉文字0、舞台736；髋屈肌详情阶段/暂停/协助标题与旋转提示元素均无，全身截图已核对。三角肌预填后改肩袖肌群得到rotator-cuff-A，训练详情返回保留编辑词，切居家得到rotator-cuff-B；552清空后支撑/B多项两列，滚动使首卡y240→196而搜索框矩形20/70/520/62严格不变。console错误/警告均0；独立CLI浏览器已关闭，用户IAB保留。

[包核对](../../output/drill-media-20261011/L36-package-check.json)通过：场景index/JS/CSS及未改媒体清单4项源/Web/APK一致，新具名/通用包相同，旧L35/L34哈希保持。此核对只覆盖包身份与上述资产一致性。L36未安装/提交/push/发布，原生媒体/前后台/快速切换、iOS与长期训练待验收；Play P01、根目录dist、个人文件与计划存储保留。

---

# 历史：L35常驻搜索与肌群名称预填验证（2026-10-11）

source state仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。搜索框固定在训练标题下方常驻，移除顶栏搜索/关闭开关与独立肌群chip。详情练习入口预填group.label，按query+section+tier检索，无隐藏groupId；编辑词/框内clear立即更新，切tier保留词，训练详情返回保留已编辑词，普通更多入口空query。有词时隐藏无关Today展示，不改store.todayIds。L34卡片/footer对齐、首页/模型保持。

全项目分析无问题，flow10、library4、muscle3共17项定向测试通过。离线Flutter Web与ARM64 release开发APK构建、原Debug证书签名及aapt2包身份通过；版本仍1.0.0+1，包字节/哈希见 [版本台账](version-ledger.md)，旧L34具名包原哈希保留。当时未改scene/原媒体，不重复相应验证。独立浏览器验收尚未完成即继续L36，当前搜索浏览器结论见L36记录。

L35未安装/提交/push/发布，手机此前仅安装L29原型；原生媒体/前后台/快速切换、iOS与长期训练未验收。Play P01、根目录dist、个人文件与本地训练计划保留。

---

# 历史：L34协助发力下对齐验证（2026-10-11）

source state仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。本轮只调整app_shell布局：协助发力标题与完整横滑卡片移出上方标题/一句作用的Expanded纵向滚动区，作为固定底部block放在练习按钮上方，间距22px；支撑/主力/左右小字保持去除。标题作用在上，剩余空间留中间；精准训练、暂停时刻/模型与首页舞台保持。

全项目分析无问题，`muscle_library_flow_test.dart`3项定向回归通过：卡区在footer上方12–28px且不属于标题纵向scroll，横滑前后卡片/footer坐标保持。历史L33独立30项证据保留自身范围，不与本次3项重复相加。离线Flutter Web与ARM64 release开发APK构建通过，原Debug证书及aapt2 `dev.mhgd.flare`、versionCode 1/versionName 1.0.0核对通过；[L34包身份](../../output/drill-media-20261011/L34-package-check.json)中具名/通用相同，旧L33包保留原哈希，完整身份见 [版本台账](version-ledger.md)。

[真实浏览器](../../output/drill-media-20261011/L34-browser-ui-check.json)通过：三角肌390宽卡片y=680–748、footer770–826，552宽卡片745–813、footer835–891，gap均22px；横滑400px前后两者矩形不变，上方元信息缺席。阶段12暂停3.3秒，390/552舞台736/801px保持，console错误0。无新的场景/原媒体变动，不扩大场景或资产审计；L33媒体证据仅用于原字节未改部分。L34未安装/提交/push/发布，手机此前只装L29原型；原生媒体、iOS与长期计时未验收，Play P01、根目录dist及个人文件保留。

---

# 历史：L33肌群详情与精准训练验证（2026-10-11）

source state仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。肌群详情下半区使用色条标题、阶段why一句作用、全量协同肌群160px银色卡横滑及固定底部练习按钮；核心/主力/双侧小字和长知识/深层说明从该面板移除。按钮直接进入exact-group训练列表，显示“清除肌群筛选”可访问标签；场景/部位/搜索按AND筛选，场景保留group，清标签保留section，全部或冲突section清group并同步Shell，训练详情返回不复活已清除group。返回肌群保留selected/time/model。

全项目 `flutter analyze --no-pub`无问题。flow10项与timer/motion/library filters/muscle widgets/新增3项对应的20项共独立30项通过；此前flow10+新增3是其中子集，不重复相加。离线Flutter Web与ARM64 release开发APK已构建、原开发证书验证通过，版本仍1.0.0+1，具名/通用包身份只在 [版本台账](version-ledger.md) 维护。本轮未修改场景/原媒体，不重复scene验证；L31/L32的相关素材与原行为证据保留。

Chrome实际 [L33浏览器核对](../../output/drill-media-20261011/L33-browser-ui-check.json)通过：390×844髋屈肌A/B/C各1项正确，清标签后保留核心C档4项，过滤卡片播放/暂停与训练详情返回保持过滤；返回原8.4秒、群组及736px舞台，固定按钮底边826px。552×909舞台801px、按钮底边891px；协同卡横滑400px前后footer矩形严格相同，两尺寸console错误0。[L33源/Web/APK核对](../../output/drill-media-20261011/L33-delivery-check.json)全通过，aapt2实际确认dev.mhgd.flare、versionCode 1/versionName 1.0.0，原Debug证书验证通过。手机此前只安装L29原型，L33未安装；原生51项媒体/前后台/快速切换、长期计时及iOS未验收。旧L32/L31/L30、Play P01、根目录dist和个人文件保留，未提交、push或发布。

---

# 历史：L32联合筛选与子页标题验证（2026-10-11）

当前source state为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。训练第一行全部部位/支撑/核心/腿部、第二行无器械/居家/健身房，部位与A/B/C按AND筛选并叠加搜索；切换一维保留另一维，今日训练独立。共享PageHeader与训练详情固定顶部标题、肌群详情/计时实际标题均居中，左右44px留位；路径/课程/测评/记录/设置/关于与系统许可页同步，首页样式及3D舞台尺寸保持。

`flutter analyze --no-pub`无问题。既有flow/timer/motion20项与新增联合筛选/标题4项共24项通过；此前两文件15项是同一子集，不重复相加。共享及训练详情标题允许两行，肌群/计时固定顶栏单行省略；等宽两侧留位避免偏移，肌群标题框按原两行文字缩放高度保留stage尺寸；计时顶栏保持48px，组/侧/子动作副标题保留。L31手机两列、实际首帧/封面姿态与51项媒体保持；本轮没有scene/媒体资产改动，因此不重复场景构建/验证，历史L30/L31证据仍按其范围使用。

离线Flutter Web与ARM64 release开发APK构建/签名完成，版本1.0.0+1，包身份见 [版本台账](version-ledger.md)。390×844实际浏览器已确认标题中心x=195、顶部y=15.5，部位按钮y=66、场景y=114；核心+居家→无器械切换保持部位并更新训练结果。[子页浏览器核对](../../output/drill-media-20261011/L32-browser-ui-check.json)通过训练、设置、关于、记录、路径、自评、课程、训练详情、计时与肌群标题居中；半程土耳其长标题两行完整显示，肌群进出iframe高度同为736px，console错误/警告为0。552宽度标题中心x=276。[最终源/Web/APK核对](../../output/drill-media-20261011/L32-delivery-check.json)通过，102项媒体与播放器/清单、v41/图标/银色图保持，旧L31具名包哈希保持。L32未安装真机，原生51项媒体/前后台/快速切换、长期训练与iOS待验收；旧L31/L30、Play P01、根目录dist及个人文件保留，未提交、push或发布。

---

# 历史：L31卡片首帧与手机两列验证（2026-10-11）

当前source state仍为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。L31修复点播时撤封面过早、封面与0秒动作姿态不一致及手机列数；视频/封面原字节不改，L30原互斥、详情/计时与循环不计次行为保留。包身份见 [版本台账](version-ledger.md)，交付与素材限制见 [训练视频交付](drill-media-2026-10-11.md)。

手机短边<600或列表宽≤700固定两列（横屏同限），桌面自适应；媒体网格取消Pressable缩放。上层封面保留到播放器实际呈现首帧，再120ms淡出，减少动态时即时。48项封面对应1秒，`deltoids-B`、`hip-abductors-B`、`rotator-cuff-B`三项对应2秒；媒体清单/runtime/URL以 `poster_time_seconds`传入，metadata先seek、等待seeked才ready，不提前播放0秒。首帧事件使用requestVideoFrameCallback，旧WebView回退playing后双requestAnimationFrame与current-data检查；暂停/隐藏/销毁取消尚未完成的首帧监听和播放队列，恢复不自动播放。

`flutter analyze --no-pub`无问题；数据、controller、UI flow、timer pause四个受影响测试文件25项通过，其中controller8项。JS实际代码的VM时序检查通过：[L31播放器时序记录](../../output/drill-media-20261011/L31-player-sequence-check.json)绑定代码SHA，1/2秒流程均为seek→ready→对应时刻play→first-frame，含取消/迟到、恢复、无首帧误报及旧WebView回退。真实浏览器 [51项媒体检查](../../output/drill-media-20261011/L31-browser-media-check.json)51/51通过初始封面seek、实际首帧及暂停；这不认证源姿态或代替原生验收。

离线Flutter Web与ARM64 release开发APK构建/签名完成，版本仍1.0.0+1，具名/通用包身份归入台账。[布局与封面检查](../../output/drill-media-20261011/L31-browser-layout-and-cover.json)通过390×844、552×909与844×390横屏两列；人为延迟player/MP4加载时真实Flutter封面仍保持，截图人工确认，实际首帧后播放。单播放器互斥、暂停后hasFrame=true且当前帧稳定，console error/warn均0。[L31最终交付核对](../../output/drill-media-20261011/L31-delivery-check.json)通过：102项视频/封面原资产保持，3个player文件和清单在源/Web/APK一致，旧L30具名包保留原哈希。L31未安装真机，51项Android原生播放、前后台/快速切换、长期训练与iOS待验收；未提交、push或发布。旧L28、Play P01、根目录dist与个人数据保留。

---

# 历史：L30训练动作卡片验证（2026-10-11）

当前source state为master HEAD `96e1db00a6f1544d11ee12cc3502974034aace93`加未提交工作树。本轮交付为51项离线训练视频与静态帧卡片，版本仍1.0.0+1；包身份、字节、哈希与开发签名只在 [版本台账](version-ledger.md) 维护。详细接入、素材限制见 [训练视频交付](drill-media-2026-10-11.md)、[媒体清单](../assets/data/drill-media-manifest.json) 与 [署名](../assets/licenses/Drill-media-ATTRIBUTION.md)。未提交、未push或发布，L28及更早证据保留在下方历史章节。

`flutter analyze --no-pub` 无问题，受影响范围的 `flutter test --no-pub` 定向36项通过。51项视频逐文件SHA与来源一致，51项完整ffmpeg解码通过；此检查只证明媒体完整性，不重新认证源动作姿态或消除原QA限制。所有训练展示已使用视频静态帧；`deltoids-B`文案改为半程土耳其起立至高桥，原ID、剂量、历史记录引用保持。

浏览器逐视频检查51/51通过：播放、暂停、禁用、恢复后不自动播放及无视频时间轴/控制底栏，见 [逐视频记录](../../output/drill-media-20261011/browser-media-check.json)。[App流程记录](../../output/drill-media-20261011/browser-flow-check.json)通过列表互斥与再点暂停、详情手动播放、进入计时释放旧媒体、计时页播放不误暂停训练、训练暂停停视频、视频循环不自动计次及人工计次记录。计时/计次页默认显示可收起示范，训练时钟仍由DrillTimer拥有。

曾在训练页隐藏iframe时因stage尺寸为0触发 `RangeError: A positive viewport is required`。`scene/src/main.js`现于refreshHotspots检测宽/高≤0并清空callouts返回；不改动画或取景算法。`node tools/verify-billboard-clearance.mjs`、`npm run build` 与 `npm run verify`（在app/scene）通过，v41仍540帧、22骨、44轨道及136选择案例。生成场景为 `index-Z1C3-Jvt.js` / `index-1IjNUedj.css`。

`flutter build web --no-pub --no-web-resources-cdn` 与 `flutter build apk --release --no-pub --target-platform android-arm64`通过。Native loopback与App Web预览均支持MP4/JPEG、GET/HEAD和单Range的206/416，保留路径边界；独立8998端口的九组请求通过，临时服务已结束，见 [预览服务检查](../../output/drill-media-20261011/preview-server-check.json)。[最终交付核对](../../output/drill-media-20261011/final-delivery-check.json)全通过：具名/通用L30 APK一致，51项视频与封面在源/APK/Web逐项一致，旧L28与Play P01保留原哈希。

最终L30离线Web在390×844实际浏览器烟雾通过：示范画面完整、185.67px；列表互斥、换分类释放媒体，详情/列表/计时切换无视频控制底栏。计时实际自然从3秒准备进入15秒工作再进入休息，视频播放不中断训练，训练暂停停示范并释放；深浅主题点播均通过，返回首页仅保留原scene；隐藏scene后console error/warn均0，见[最终烟雾记录](../../output/drill-media-20261011/browser-final-smoke.json)。此短流程不替代T01长期或原生前后台验收。

手机此前仅保留数据安装L29旧控件原型，冷启动Status ok、849ms；没有完成51项原生视频验收。手机现已被取走，L30尚未安装。Android原生全部播放/切换/前后台、长期训练、性能/温度/内存及iOS仍待验证；软件与浏览器结果不扩大为设备或商店验收。Play P01、旧L28、根目录dist和个人数据保留。

---

# 历史：L28文档收束与推送预检（2026-10-11）

用户显式调用cockpit-closeout，要求台账管理、文档对齐、保存提交及push。Preflight全程只读通过后才编辑。范围是L28图标来源、版本/安装身份、当前入口、待验收及Git发布记录；不修改运行代码、模型、生产资源、包、签名或个人数据。当前产品保存点是下方L28，后续收束提交完整SHA由Git定位。

| Preflight字段 | 实际结果与source state |
| --- | --- |
| baseline / 依据 | L26 `632fdb673d50908083e9fb43440886f2e2ac5684`，ref `632fdb6`；上轮已明确保存点，也是L28直接父提交；`git rev-parse --verify`及`git merge-base --is-ancestor`通过 |
| HEAD / stage delta | `3f0fda327a5e5716b89ba297447612148b542199`；相同基线下1提交/49路径，M43/A6；34生产图标、1背景XML、2选定原图/提示词、1导出清单、1工具、9入口/来源/许可/台账文档、1真机裁图 |
| 仓库及授权 | `git rev-parse --show-toplevel`为E:/AII-3D/3D-Body；当前master。用户授权正常push；12:48远端master为812d948，祖先核对通过，远端无L28标签 |
| canonical发现 | 从根/App AGENTS及README明确入口一跳发现asset-sources、version-ledger、verification、development-roadmap、motion-v41。当前段落分别管理来源/图标、版本/包/发布、证据、M0–M7与T01–T05、动作合约；各自历史段落及旧v38/PR记录为archive，不能代替当前L28 |
| 完整状态与归属 | `git status --porcelain=v1 --untracked-files=all`完整21项，无截断；tracked/staged/unstaged/deleted/renamed均0。用户视频Air-Flare/air-flare-demo.mp4为阶段前用户素材1项；app/assets/brand下PNG12与JSON8为本Agent的未选图标/抽卡历史20项，全部保留不提交、不读用户视频内容 |
| 必要核对 | 12:48在上述完整HEAD运行一次性Node文档检查：9个入口/canonical文件169个本地Markdown链接均存在；逐图Get-FileHash与icon-manifest一致共34项，选定原图SHA一致，全部生产输出已入Git；git diff --check通过 |
| 旧证据适用性 | L26到HEAD的app/lib、app/scene、app/test、app/test_web、app/assets/scene、app/assets/muscles、加载/首页图、pubspec与根src/public/tools有限路径差异为0。L26的软件/动作证据可用于未改部分，L28图标构建/51项交付及12:19真机观察对应提交前同一生产资源工作树；34源哈希与HEAD一致，提交前只有新增追溯文件/裁图及文档。真机观察只证明对应已安装包，不冒充全设备验收 |
| 确定alignment findings | 路线仍写L28未提交；台账缺L26/L28完整SHA，Web身份写L26；历史标签/通用包/PR7说明沿用当前措辞；本次push授权、观察及完整Preflight尚未独立记账 |

本次实际检查的current路径为 `AGENTS.md`、`README.md`、`app/AGENTS.md`、`app/README.md`、`app/docs/asset-sources.md`、`app/docs/version-ledger.md`、`app/docs/verification.md`、`app/docs/development-roadmap.md`、`app/docs/motion-v41.md`。补充核对既有Snow署名、pubspec资产白名单、Android图标引用/背景、iOS Contents及Web manifest/index：均与选定图标清单对应；未改Snow署名或生产配置。动作/人物主题映射motion-v41，平台图标/来源映射asset-sources，Git/包映射version-ledger，观察与source state映射verification，验收边界映射roadmap；没有扩大到旧编辑器或其他项目。

原图与34导出的逐图SHA、上轮构建命令和设备观察在下方L28段保留。34项哈希及有限产品delta证明已有证据继续适用于本次仅文档修改；本轮不读build产物/凭据/设备日志，不重建或重装。Alignment仅修正上述确定问题，提交前后再核对同一21项保留文件、有限文档delta、本地链接及空白。远端实际结果只在成功push后记录；Git上传不等于Play发布，T01–T05保持原状态。

Alignment已修正所有确定finding，保存为 `f89db3fa3fa227071b0dfccafa2d6778a65a4413`。保存前一次性Node检查实际通过：170个本地链接；此前verification正文归一换行后与3f0fda3逐字相同；delta严格限定version-ledger、verification、development-roadmap三份文档；完整状态为本Agent文档3项加原21项保留文件，git diff与暂存diff的空白检查均通过。提交后有限排除这三份文档的 `git diff --quiet 3f0fda3 HEAD` 为0，HEAD核对为f89db3f，原产品证据继续适用。

12:52正常atomic push退出0，L26/L28、f89db3f收束文档及原L28标签同时推送成功；独立ls-remote核对master及标签解引用SHA与本地相同，完整结果只在version-ledger维护。提交后完整状态恢复为同一21项未跟踪文件。本段和台账中的实际回执是后续仅文档补记；保存前按相同链接/空白/有限delta和完整状态规则复检，不重复产品构建或设备验证，也不把Git推送算作商店发布。

---

# 历史：L28青绿色运动服图标交付（2026-10-11）

用户选择新角度B。选定原图经尺寸导出及平台裁切留边，34项PNG尺寸/不透明要求/哈希通过；Android 5密度普通与adaptive前景的10项编译后像素，与源PNG逐项一致。圆形/iOS圆角/Android adaptive/Web maskable预览为 `output/imagegen/flare-logo-20261011/adopted-teal/crop-preview.png`。原图、全提示词、来源及SHA在 `assets/brand/icon-flare-angle2-b.imagegen.json` 与 `icon-manifest.json`，复现为 `node app/tools/export-brand-icons.mjs --sharp-root <existing sharp package>`。

用户确认后建立本地L28版本检查点 `app-l28-20261011`。本次版本整理仅补充选定素材来源、[桌面图标实景裁图](screenshots/2026-10-11/L28-home-icon.png)及Git身份文档；生产图标与既有L28构建内容相同，APK源文件与具名副本SHA仍为 `c836a597ce7297dd09fb3c3e967595b6f26f31fbbde22b426651e5e37927624b`，Play P01哈希保持。保存前核对导出清单34项文件SHA及源图SHA、检查Git暂存范围和 `git diff --check`，不重复构建或扩大验收。

`flutter build web --no-pub --no-web-resources-cdn --no-wasm-dry-run` 成功；`flutter build apk --release --no-pub --target-platform android-arm64` 成功，进程环境继续采用既有低内存Gradle参数。首次构建后补入本轮图标署名文本，重建Web/APK，再用既有开发证书签名；图标母版与署名在源/APK/Web逐字节一致。`apksigner verify --print-certs` 通过，开发证书SHA仍为 `3761270a4764157f0e389014a9e5b800b05403bfddce0f4f7f8c039f6a53bdc7`。包字节/哈希及当前身份只在 [版本台账](version-ledger.md) 维护。

交付核对共51项通过；与替换前L26 APK比较的41项场景、17银色图、加载与首页图片保持逐字节相同。实际HTTP读取Web7项图标/署名资产，与构建文件一致，favicon引用正确；430×932浏览器启动截图已保存，pageerror为0。检查报告为 `output/releases/L28-teal-logo-delivery.json` 与 `output/imagegen/flare-logo-20261011/adopted-teal/web-check.json`。

`adb install -r --no-streaming` 于12:07:18（北京时间）成功，未卸载或清除数据；初次 `am start -W` 返回Status ok，进程18394，按PID抽样的AndroidRuntime/chromium错误日志为空。初次设备PIN锁屏，未输入或绕过凭据。用户随后解锁，12:19补验系统应用信息与桌面：青绿B图标已生效，人物、两鞋及橙色轨迹完整未裁切。桌面XML中Flare节点bounds为 `[339,570][640,896]`；force-stop后点击该节点中心冷启动，App进入原3D首页与同步人台，进程18954，按PID错误日志为空。实景证据为 `output/imagegen/flare-logo-20261011/adopted-teal/device-unlocked-appinfo.png`、`device-home-icon.png` 与 `device-launch.png`，记录 `output/releases/L28-teal-logo-device-check.json`。iOS仅完成12个被引用PNG的资源同步及尺寸/alpha检查，Windows未构建iOS。此次只改图标与署名，不运行Dart/场景全量测试；模型/功能既有证据继续按对应source state使用，不扩大为T01/T02完整验收。Play P01 AAB哈希保持。

---

# 历史：L26版本整理与接力检查点（2026-10-11）

范围冻结为PR7交付基线 `812d948b49616d8edce20fd7ec46d70129e0fa27` 之后的App界面迭代：L06–L26加载/启动预热与剪影、高清全身小卡、柔边高亮、重点肌群一致性、3D卡片/圆点/细线及17银色图文条目。代码、生产资源、复现工具、已有定向测试及当前入口文档纳入本地检查点；不纳入 `Air-Flare/` 用户素材、个人数据、原导出、根编辑器、`build/`、`dist/`、`output/` 或签名材料。未改版号、标签、Play包或远端。完整checkpoint SHA由Git和本轮临时交接回执定位，不在提交中预填自身SHA。

本次重新检查：8个受影响Dart文件 `flutter analyze --no-pub` 无问题；`flutter test --no-pub` 执行scene_controller、startup_splash、startup_prewarm、scene_reveal、muscle_widgets和flow_regressions六文件，30项通过。`app/scene` 的 `npm run build` / `npm run verify` 通过；重建场景仍为 `index-DBRgBX7q.js` / `index-1IjNUedj.css`。`verify-billboard-clearance.mjs`、`verify-presentation.mjs`、`verify-thumbnail.mjs`、`verify-motion-focus.mjs`、`verify-hotspot-depth.mjs` 五项定向检查通过。v41证据重新生成仅三个末位浮点变化，不改变结论或生产包。

本次资产核对69项通过，具名/通用L26 APK、17张银色图片、摄影源哈希及场景HTML/JS/CSS在源目录、APK与离线Web一致，Play P01保持；报告 `output/releases/20261011-closeout-artifacts.json`。加载剪影的两张WebP已打包，`flare-loading.json` 是源目录制作元数据，按现有pubspec不打入运行包；授权和原GLB哈希齐全。入口文档103个本地链接存在。

初次暂存检查识别到制作JSON的CRLF和生成包内第三方GLSL字符串尾空格。为保留已验收包的字节，`app/.gitattributes` 仅对这两类产物设置CR识别/生成字符串尾空检查范围，普通源码空白检查保持；另对清单绑定的两个摄影shader源保留原字节，避免跨平台换行改变SHA。四份摄影源的暂存字节与当前文件、原L26清单一致，复查 `git diff --check` 与暂存检查均通过。没有为了空白检查修改模型、图片或生成包。

本次未重复构建Flutter APK/Web：当前L26已完成构建、安装、恢复银色及逐文件身份核对，本次只对齐文档并保存已经验证的产品；既有GPU截图/实际点击、旋转与拖动证据继续适用。未运行根编辑器全量历史检查，因为根源码未改变；没有另跑Flutter全量测试，按受影响范围执行六文件。T01长期计时、T02完整角度/设备性能/iOS、T03–T05内容和发布仍未完整验收。`callout-layout.js`、`sample()`/`sampleFixed()`及对应旧检查保留历史，当前3D卡片使用 `sampleFacing` 和 `billboard-clearance`；旧布局检查不替代当前路径的证据。

---

# 肌群条目银色金属摄影（2026-10-11，L26，用户确认采用）

L26按用户授权尝试钛银色金属人台与原色珐琅教学选区，仅改变截图专用物理材质、环境反射与细微拉丝，运行时人台和图文组件保持。17张透明512×512图片共592,628字节，素材清单为 `muscle-photography-v3-titanium`；拍摄记录保留在 `output/playwright/2026-10-11-muscle-thumbnails-metallic/`。

离线Web及ARM64 release APK构建成功。具名APK `Flare-v41-metal-muscle-image-items-20261011-arm64.apk` 为45,615,269字节，SHA-256 `b1c83d7ccadcabbbaa60bf7fa1b145176ce72abdc161f83b31e40dae54a0ca98`，已用原开发证书保留数据覆盖安装并冷启动到所连手机，进程17949存在、抽样日志错误0。APK内17张图逐项SHA-256与 `metallic/render-report.json` 相同，共592,628字节；运行与复核证据为 `output/releases/L26-runtime-check.json`。

用户先反馈金属质感不满意并要求试作黄色橡胶，随后查看手机银色截图，明确确认“这个银色可以 就这个了”。最终采用L26银色肌群图文条目；该确认只覆盖银色肌群图片与条目外观，不扩展为全App或其他T02验收。源图片和清单从原L26 APK恢复，通用APK与具名包相同，手机保持L26。离线Web重新构建回银色，17张图片逐项SHA-256与所选版本一致，Play P01保持；最终记录为 `output/releases/L26-silver-selection.json`。

截图工具也精确恢复为L26：摄影JS逐字节匹配原清单源哈希，三张代表肌群重拍的WebP及1024PNG与原银色图逐字节相同；证据为 `output/playwright/2026-10-11-muscle-thumbnails-metallic/final-confirmation/verification.json`。复验后未改源模型、运行时材质或卡片逻辑。

---

# 历史试作：黄色橡胶肌群摄影（2026-10-11，L27，未安装）

L27生成17张透明512×512黄色橡胶图片，共464,032字节，试作清单为 `muscle-photography-v4-yellow-rubber`；联系表与拍摄记录保留在 `output/playwright/2026-10-11-muscle-thumbnails-rubber/`。试作APK/Web构建完成，但未安装手机，不记为真机验收。用户最终确认L26银色后停止采用黄色；L25米白和L27黄色试作资料保留。

---

# 历史：肌群缩略图米白哑光材质（2026-10-11，L25，用户要求再调整质感）

按用户当时要求，仅将截图专用人台改为暖米白哑光，并调整柔光；运行时人台、原网格、功能分区、颜色、镜头和图文组件保持。17张透明512×512 WebP共420,314字节，当时清单为 `muscle-photography-v2-ivory`，历史副本在 `output/playwright/2026-10-11-muscle-thumbnails-ivory/render-report.json`；摄影来源见 [资产说明](asset-sources.md)。

17张图片的尺寸、RGBA透明、抗锯齿边缘及全部SHA-256复验通过；原GLB、分区、原色与相机和L24一致，1024渲染轮廓的alpha逐像素相同。实际米白联系表已查看，证据为 `output/playwright/2026-10-11-muscle-thumbnails-ivory/verification.json`、`render-report.json` 和 `muscle-contact-sheet.png`。本轮仅更新静态摄影资产，复用L24已通过的3项组件检查及原手机完整流程检查，不将素材检查当作真机观感验收。

L25离线Web及ARM64 release APK已构建成功，使用原开发证书保留数据覆盖安装并冷启动到所连手机，进程17477存在、抽样日志错误0。APK内17张图逐项哈希与源文件相同，共420,314字节；具名包与通用APK一致。交付和运行证据为 `output/releases/L25-ivory-muscle-image-items-delivery.json`、`L25-runtime-check.json`。场景继续使用L23的 `index-DBRgBX7q.js` / `index-1IjNUedj.css`。

用户体验后反馈米白质感仍不足，并授权尝试金属材质；L25的视觉方案由L26摄影替换，不记为视觉验收通过。最终包身份以版本台账为准。

---

# 历史：肌群条目模型摄影与图文入口（2026-10-11，L24，摄影外观由L25调整）

按用户要求，指定肌群的点击条目采用实际人台渲染缩略图：本阶段主力、展开后的其他参与肌群及详情协同肌群使用统一图文组件，聚合展开入口显示最多3张小图。17张透明512×512 WebP共404,596字节，按肌群分别取景并保持原功能分区颜色；来源、镜头、哈希与复现工具见 [资产说明](asset-sources.md) 和 `assets/muscles/manifest.json`。图片是体表教学位置示意，不代表精确内部解剖。

新组件3项widget检查通过：肌群条目/紧凑卡保持对应点击动作、320px宽与2倍系统文字不溢出、深浅主题共用图片且名称不重复朗读。既有 `phone safety → phase muscle → drill → local pain record → same paused frame` 流程1项通过，保留训练、疼痛记录和返回原暂停帧。受影响的两个Dart文件静态分析通过，离线Flutter Web和ARM64 release APK构建成功。

离线Web已更新到L24，场景继续使用L23的 `index-DBRgBX7q.js` / `index-1IjNUedj.css`，没有因静态缩略图重做动作或卡片空间逻辑。实际浏览器已查看第10阶段主力列表、展开后的次要肌群及详情协同卡片截图，点击臀中肌条目及三角肌协同卡均进入对应详情并保留1.2秒暂停帧；浏览器错误0。截图在 `output/playwright/2026-10-11-muscle-items/`。

L24已用原开发证书保留数据覆盖安装并冷启动到所连手机，进程16708存在、启动抽样日志无Flutter/JS/着色器异常。APK内17张图逐项哈希与源文件相同，共404,596字节；场景JS也核对相同，具名包与通用APK一致。交付和运行检查见 `output/releases/L24-muscle-image-items-delivery.json`、`L24-runtime-check.json`，Play P01哈希保持。真机布局、清晰度与观感待用户验收；当前包身份以版本台账为准。

---

# 历史：卡片地面与可见区域保护（2026-10-11，L23，场景修复保留在L24）

用户确认平滑表现改善，但发现一个角度只剩橙色引导线。检查发现卡片没有最低世界高度保护，可能被写深度的阴影地面挡住；目标布局有效也不保证平滑中间帧仍在可见区域。L23检查卡片完整最低角点，至少高于地面0.03m，并将目标和实际动画矩形约束到宿主可见舞台内。保留投影深度、以完整canvas尺寸换算NDC，再回推世界位置；修正后更新引导线。L22双侧选择、同侧卡片、身体避让和连续位置过渡保持。

场景build/verify、ARM64 release与签名通过。32视图96卡的目标身体/UI/屏幕避让、96/96圆点命中、同侧/单侧约束与6次双侧切换回归通过。实际鼠标水平、垂直连续拖动54帧、162张卡均保持3项、opacity=1、完整卡片在可见范围及最低角点不穿地面；报告`output/playwright/2026-10-11-guided-cards/visible-clearance-result.json`和`drag-visible-result.json`。这些检查不代替用户对所示角度的手机验收。

L23已保留数据覆盖安装并冷启动，进程存在、启动抽样日志无Flutter/JS/着色器异常。场景`index-DBRgBX7q.js` / `index-1IjNUedj.css`，包内JS哈希与源构建一致，具名包/通用APK相同；离线Web仍L06，Play未重建。包身份见版本台账L23。

---

# 历史：平滑换侧、双侧选择与身体避让（2026-10-11，L22，可见区域由L23补修）

本轮按用户连续反馈更新：圆点始终可见、可点，同色3D卡片移到身体外围，1.25px细引导线带轻白描边，从卡片边缘外连接到圆点边缘。双侧肌群通过`sampleFacing`优先选择当前可见/较近侧并保留侧别滞后；单侧约束保持。卡片按发力点相对画面身体中心的左右位置放在对应侧，12px死区避免反复换侧。19局部身体凸包用于检查完整卡片矩形，与手、鞋、头和躯体留8px空隙，屏幕/UI/相邻卡优先避让；候选包含窄边缘处的上下空位。按最新用户要求允许随镜头更新位置，覆盖L19严格固定世界偏移的要求。

用户发现拖动时淡入闪切，L22取消透明度切换，改为连续世界位置插值，65ms响应时间常数，停止拖动后继续收敛到目标；首次/seek/新姿态直接定位。引导线跟实际位置，布局互避使用目标位置，避免卡片互相追逐。圆点始终不透明，卡片仍正对镜头并保留真实深度测试，过渡中允许身体自然遮挡。

场景build/verify、ARM64 release及相同开发签名通过。`verify-billboard-clearance.mjs`手脚/局部凸包/SAT/边界/UI/卡片间距检查通过；实际模型双侧三角肌left→right→left及6次单侧约束检查通过。浏览器32视图共96张卡的目标矩形均满足身体/UI/屏幕/卡片间隙，圆点96/96命中对应肌群，卡片均在发力点对应侧，观察到6次实际身体侧别切换；播放收起/暂停恢复通过。70帧旋转检查中卡片opacity始终1，55个连续中间位置样本、最大单帧世界位移0.0771m，停止后收敛完成；实际点击左侧三角肌卡上报deltoids及原time=2。报告`output/playwright/2026-10-11-guided-cards/smooth-clearance-result.json`、`smooth-result.json`、`smooth-click.json`；GPU截图已查看，无场景错误事件。目标布局通过不等于任意缩放或全部过渡帧绝不覆盖身体，真机观感交用户验收。

L20远距细线包、L21动态同侧初版及L22平滑补修包均保留具名APK。L22已保留数据覆盖安装并冷启动，运行进程存在、抽样日志无Flutter/JS/着色器异常。场景`index-_IXUxXK9.js` / `index-1IjNUedj.css`，包内JS哈希核对通过、具名包与通用APK一致；Play P01哈希保持，离线Web仍L06。当前包身份见版本台账L22。

---

# 历史：肌群附近的真实3D卡片（2026-10-11，L19，位置/遮挡规则由L20–L22调整）

按用户要求将DOM卡片改为场景内Sprite：固定在真实肌群表面采样点附近，沿外法线偏移，正面始终朝镜头。旋转不改位置、不换身体侧、不做屏幕避让；动作姿态变化则跟随同一表面三角形。卡片和圆点参与人物深度测试，手臂/身体可遮挡全部或部分像素；卡片遮挡处的点击会交给前景人物。保留最多3项肌群及人体图一致性、同色底和单行名称，世界尺寸固定，由透视自然影响屏幕大小。进入详情或播放时收起，按帧绘制前更新，避免一帧滞后。

`verify-hotspot-fixed.mjs`通过144次旋转位置/法线不变、8次姿态跟随，旋转额外蒙皮读取0；原depth、presentation、detail-transition检查通过。场景build/verify和ARM64 release通过。浏览器32视图均保持卡片世界位置/candidateKey不变及优先肌群一致，75个卡片中心命中本卡、16个被人物挡住，另5个中心命中更近卡片；播放/详情隐藏、暂停恢复通过。实际点击腹斜肌上报obliques及原time=2。GPU截图已查看，臀中肌卡片被前景腿局部遮挡。报告`output/playwright/2026-10-11-world-cards/result.json`、截图`world-cards.png`；无场景错误事件，真机观感由用户验收。

L19已用相同开发证书保留数据覆盖安装并冷启动，进程存在、抽样日志无Flutter/JS/着色器异常。场景`index-DAy3D6oK.js` / `index-1IjNUedj.css`，包内JS与源构建哈希一致，具名包与通用包一致。离线Web仍L06，Play未重建；包身份见版本台账L19。

---

# 历史：优先肌群与人体图统一（2026-10-11，L18，卡片空间表现由L19替代）

按用户最新反馈，将暂停托马斯圆点/卡片与左下人体图统一使用`phaseEmphasisItems`。沿用人体图的支撑、核心、腿部各取一个优先肌群、优先primary的规则，最多3项；当前8阶段均为3项。保留L17圆点和同色单行卡片样式，不再展开全部主力肌群。

场景build/verify、ARM64 release构建及同开发证书签名通过。浏览器8阶段×4镜头32组合中，动作圆点、名称卡与人体图图例的肌群ID和颜色均一致，数量均为3；播放收起/暂停恢复通过，无场景错误事件。报告`output/playwright/2026-10-11-priority-markers/result.json`；不重复未改布局/点击逻辑的全量检查。L18已保留数据覆盖安装并冷启动，进程存在，抽样日志未见Flutter/JS/着色器异常。场景`index-CZ8cC2PA.js` / `index-1IjNUedj.css`，包内JS哈希核对通过。具名包、通用包一致，真机观感交用户验收；离线Web仍L06，Play包未重建。身份见版本台账L18。

---

# 历史：全部主力肌群圆点与同色卡片（2026-10-11，L17，数量由L18精简）

按用户最新要求简化为彩色圆点和附近的单行名称卡。暂停主舞台读取当前阶段全部 primary 肌群（4～5项），不再只取3项教学示例；卡片底色与圆点使用同一原始肌群颜色，自动选择可读的深/浅文字。去掉气泡尾巴、远近缩放、变暗与虚化，视觉卡高30px、点击区44px。布局优先保留全部名称并就近安排，人物避让为软约束，卡片彼此、圆点和控件仍严格避让；小人参考图仍保留原3项教学示例。播放收起，暂停恢复。

场景build/verify、ARM64 release构建及同开发证书签名通过。布局定向检查覆盖4～6点、320/390手机、横屏、边缘UI和16帧旋转，原模式回归通过。浏览器8阶段×4镜头共33视图均完整显示对应4～5个主力圆点和卡片，颜色一致、无缩放/虚化、播放收起/暂停恢复通过；真实点击卡片和圆点均上报triceps及原暂停time=0。报告`output/playwright/2026-10-11-primary-markers/result.json`。无场景错误事件，预览仅favicon 404；未截图/录屏，真机观感交用户验收。

L17已保留数据覆盖安装并冷启动，进程存在，抽样日志未见Flutter/JS/着色器异常。场景`index-gFMzQHzA.js` / `index-1IjNUedj.css`，包内JS哈希与源构建一致，具名包与通用APK一致。离线Web仍L06、Play P01哈希保持；安装证据`output/releases/L17-primary-markers-delivery.json`，包身份见版本台账L17。

---

# 历史：近身气泡与轻微景深（2026-10-11，L16，视觉方案由L17替代）

按用户要求移除长连线，卡片采用7px短尖角，优先左尾、必要时换到安全一侧并朝向对应肌群；气泡显示时收起原身体圆点，无近处安全位置则保留小圆点入口。布局限制尾尖与肌群的距离不超过80px，并避开人物、底部控件、其他卡片和短尾。连续小幅转动沿用安全位置；必须跨身体换边时在新位置淡入140ms，不从人物上方滑过。保留L15近亮远暗/近大远小，远半段加入最高0.55px轻微虚化、160ms过渡，44px点击区不缩小。

人物避让改为19个局部包络并集，按完整三角形的主导骨分组、包含各顶点全部骨影响，不把肢体之间一概封成全身凸包。`verify-body-hulls.mjs`通过真实v41的3个姿态、633,180个顶点与996,618个完整三角形覆盖检查；9投影视角释放旧单凸包误占区域21.2%–51.8%。局部包络600点按姿态缓存，旋转不重读稠密网格，动作/材质/几何及缓存失效检查通过。`verify-callout-layout.mjs`通过短尾/近距/空隙/换边/退让、16帧微动及12帧旋转用例，原默认模式检查保留通过。

场景build/verify、ARM64 release、同开发证书签名与包内JS哈希通过。最小浏览器检查覆盖8阶段×4镜头32视图、70张实际气泡，尾尖距均≤80px（均值56.02px），轻微虚化上限0.55px；真实拖动旋转没有误选，气泡真实点击保持原暂停帧，深浅主题/短尾/点击区检查通过。报告`output/playwright/2026-10-11-bubble-cards/browser-smoke-report.json`；未截图/录屏，预览仅favicon 404，无场景错误事件。这些技术检查不代替用户的真机观感验收。

L16已保留数据覆盖安装并冷启动，进程存在、启动抽样日志未见Flutter/JS/着色器异常。场景`index-Dwm4FTPC.js` / `index-CQU6bP00.css`，具名包与通用APK相同，本地Web仍L06，Play P01哈希保持；身份见版本台账L16。

---

# 历史：卡片按距离连续变色和缩放（2026-10-11，L15，连线由L16气泡替代）

用户认为L14的遮挡符号不直观，改为距离越远卡片越小、底色越暗，越近越大、越亮。移除旋转/详情图标、虚线和空心点的视觉状态；连续距离统一控制底色、缩放、阴影及引线强度，遮挡不再额外压暗或缩小。卡片保持不透明、无模糊、单行名称，基准36px高/13px文字，最多缩小至84%；透明点击区保持44px。大小、颜色和阴影使用160ms过渡，包括表面采样换点时从当前显示值平滑接续。深浅主题各自使用近亮远暗的底色范围，人物避让和原表面定位保持。

场景`npm run build`/`npm run verify`、ARM64 release及签名通过。最小浏览器检查覆盖深浅主题×4阶段×正背镜头共16视图，32组远近比较均符合越远越小越暗；3张卡的实际渲染值均经过连续中间状态，44px点击区、无字幕/图标、无文字模糊和实际点击同帧选择通过。报告`output/playwright/2026-10-11-distance-cards/browser-smoke-report.json`，未截图/录屏；预览仅favicon 404，无场景错误事件。L15已保留数据覆盖安装并冷启动，进程存在、启动抽样日志未见Flutter/JS/着色器异常；手机观感交用户验收。

场景`index-DX6eU9j0.js` / `index-BujHBhzo.css`已核对打包JS哈希，具名包与通用APK相同。本地Web仍L06，Play P01哈希保持；包身份见版本台账L15。

---

# 历史：单行肌群卡片与远近提示（2026-10-11，L14，视觉映射由L15调整）

按用户反馈去掉左右侧/教学作用小字，卡片仅保留肌群名称、小色点和图标。视觉卡高34px，透明点击区仍44px；只缩放内部卡片，原人物轮廓/控件避让继续使用稳定边界。肌群相对人物中心的镜头深度控制轻微大小、透明度和阴影差异，文字不加模糊。当前视角确实背向或被身体遮挡时，才使用虚线、空心锚点与旋转图标；转到可见位置后恢复实线与普通详情图标。两种状态均可点进详情。

锚点从原v41人物的教学分区表面三角形采样，避免内部关节或内层衣物被误判为遮挡；由不参与显示的3,144顶点/5,987三角形代理判断其他身体部位遮挡。姿态变化才更新代理，暂停旋转复用缓存，不改原网格、材质、骨骼或动画。远近与遮挡分别计算，不因肌群属于深层就一律提示被遮住；这些仍是教学位置提示，不代表精确解剖配准。

`verify-hotspot-depth.mjs`通过34组左右覆盖、192姿态/视角、4例原始全网格射线交叉检查，以及镜头距离不改变身体相对远近、旋转不重新蒙皮的检查。`npm run build`、`npm run verify`及`verify-callout-layout.mjs`通过。最小浏览器检查覆盖8阶段×正背2镜头，共16视图48张卡，24可见/24遮挡及14次随镜头切换的遮挡变化；单行尺寸、实虚线、旋转图标、主题、播放收起和暂停恢复通过，遮挡卡真实点击仍上报原暂停帧。报告为本机`output/playwright/2026-10-11-depth-labels/browser-smoke-report.json`，未截图/录屏；预览仅favicon.ico 404，无场景错误事件。

ARM64 release、相同开发证书签名、包内场景哈希核对通过；L14已保留数据覆盖安装并冷启动到所连Android，运行进程存在，启动后抽样日志未见Flutter/JS/着色器异常。场景`index-mDhXT4sr.js` / `index-DmFQePfJ.css`，具名包与通用包相同；本地Web仍L06，Play P01哈希保持。真机观感与性能交用户验收，包身份见版本台账L14。

---

# 历史：暂停肌群标签与空间避让（2026-10-11，L13，卡片表现由L14调整）

暂停圆点升级为较小身体锚点、细引线与朝向镜头的文字卡片，列出肌群名、左右侧及教学作用；点卡片沿用原`select`桥接打开详情。标签按首页肌群图相同的支撑/核心/腿部三项重点选择，播放、详情、隐藏或图形错误时收起。位置采用真实3D锚点投影，字形保持屏幕朝向，近似等距左右侧与布局均保留滞后，减少镜头微移时换边；首次出现仅淡入，减少动态效果时关闭动效。

避让范围由原模型骨影响包围盒投影凸包计算，包含衣物、头发、手指和鞋；标签与人物、彼此、实际肌群小卡和宿主底部按钮保持间隔，引线同样避开UI。没有合适空位时省略文字卡，保留可见小锚点；被UI遮住或超出视口的锚点一并隐藏，不强行覆盖动作。布局在实际场景/肌群卡渲染后更新，不新增持续动画循环或GPU读回。

`verify-callout-layout.mjs`通过窄屏、高举腿、双手支撑、横屏、满屏退让、引线跨UI及80帧微移稳定性检查。真实v41检查8阶段×4镜头×3尺寸共96场景，2,533,632次网格投影均在160个影响包围点凸包内（越界0px），读取不改姿态；可见标签引线跨UI为0。390×650及430×740共64场景均3卡，320×480中5场景3卡、20场景2卡、7场景1卡。证据在本机`output/callouts-20261011/body-envelope-report.json`。

`npm run build`及`npm run verify`通过，包含当前v41的540帧/136组选择。Playwright最小浏览器检查通过真实标签点击、同帧选择、详情返回后再点、播放/暂停与隐藏恢复、转镜头时锚点跟随/文字正立及深浅主题；报告`output/playwright/2026-10-11-callouts/browser-smoke-report.json`，未截图或录屏。ARM64 release与签名通过，L13保留数据覆盖安装并冷启动到所连Android；真机观感由用户验收。场景`index-BgD6BfTg.js` / `index-D3WpewDc.css`；本地Web仍L06，Play包未更新，包身份见版本台账L13。

---

# 动作人物高亮边缘（2026-10-11，L12，修复保留在L13）

用户反馈短裤上的黄色肌群高亮凹凸、边缘粗糙。原实现先按顶点标记选区，再沿邻接网格平均五次；短裤局部边长相差约23倍，轮廓和柔边宽度受三角形布局影响。现在动作人物在片元阶段按连续参考坐标计算选区，统一柔边并按像素覆盖抗锯齿；同组选区取并集，不保留内部接缝。参考区域、左右选择、裆部/手部保护、原衣物材质和动作保持；CPU权重仅用于推荐机位，不再作为显示遮罩。

`verify-motion-focus.mjs`通过：8,193个连续边界采样中843个不同柔边值，最大相邻差0.001781；组内并集、左右/空选区、26个区域的78个内部点及原材质保留通过。`verify-v41.mjs`的136组肌群/阶段、136个机位、裆/手泄漏0通过；`verify-thumbnail.mjs`的12组全身构图与代理材质/色彩链检查通过。真实WebGL 2技术校验加载原Snow，7组选择绘制、6个程序编译/链接通过，错误0；436个CPU/GPU遮罩样本（含168个柔边样本）最大差0.001995。报告在本机`output/motion-focus-20261011/gpu-report.json`；这是桌面着色检查，不代表手机性能或界面验收。

场景与ARM64 release构建、APK签名校验通过。L12已用相同开发证书保留数据覆盖安装并冷启动到所连Android真机，观感直接交用户验收。场景使用`index-m0zK3hKO.js` / `index-BzaUuKbO.css`，包含L06–L11全部修复；本地Web仍L06，Play包未更新。包字节/哈希见版本台账L12。

---

# 启动预加载与真实动作剪影（2026-10-11，L11，修复保留在L12）

用户要求把模型准备合并到splash，并用现有Flare人物的真实动作剪影替换图标动画。启动页现在覆盖整个App，实际同一个WebView在下方加载并完成人物与肌群图首帧；收到匹配的`presented`后，内容淡出120ms、背景揭开220ms，进入首页。没有固定最短等待，也不等待剪影播完。首次引导仍需明确确认，模型预热后暂停、进入时复用；普通页面返回不会重播全屏启动页。重试、图形恢复及首次主题背景一并衔接，恢复配置时显式恢复绘制可见性。

剪影由当前未压缩v41 GLB经Three.js r170/AnimationMixer直接离线拍摄，斜前方−30°、俯视28°，固定全身机位；循环起点平移到单手展开姿态，未修改动作、原模型或材质。透明纯白WebP在Flutter中按主题染为橙色：384×384、216帧、24fps、9秒循环，824,972字节；静态首帧3,924字节，用于减少动态效果及错误状态。全部帧解码、透明边界/无裁切检查通过，已检查实际素材联系表。来源、哈希及复现命令见`assets/brand/flare-loading.json`，脚本在`tools/render-flare-loading.mjs`及`tools/encode-flare-loading.py`，Snow署名随包保留。

`flutter analyze --no-pub`通过；启动遮挡/撤销/重试、同view预热与图形恢复、既有详情/页面流程共18项定向组件检查通过。本轮同时更新L10小卡尺寸的旧断言，并修正首次进入被误当作页面转场的问题。ARM64 release构建及签名校验通过，L11已保留数据覆盖安装并冷启动到所连Android真机。按用户要求直接交界面验收，未运行App UI自动化或额外录屏；素材拍摄不是App观感验收。L06–L10修复继续包含；本地Web仍L06，Play P01 AAB哈希不变，包身份见版本台账L11。

---

# 详情小卡片清晰度与全身构图（2026-10-11，L10，修复保留在L11）

用户对比首页和详情截图，反馈详情肌群小卡模糊且脚部缺失。详情此前直接按主舞台medium的1.5倍像素密度绘制，首页则有独立2–3倍MSAA缩略图；同时详情按整张108px卡片构图，底部22px标题覆盖了脚部。

详情现在复用首页的密度策略，在同一WebGL上下文中生成独立高清缓存；卡片加高到136px，标题与约74×102px图像区分开，镜头按完整包围盒8角投影留边。交换后的动作小卡也采用相同方式，原材质的色彩输出、选区和共享资源保持；缓存随选区、姿态、方向、尺寸/质量及环境失效，入场缩放不触发逐帧GPU读回。Flutter点击范围同步更新。

`verify-thumbnail.mjs`的12组全身构图及材质/色彩注入/异常恢复检查、既有`verify-detail-transitions.mjs`和`verify-presentation.mjs`通过；场景及ARM64 release构建、APK签名校验通过。L10已保留数据覆盖安装并启动，按用户要求直接交真机界面验收；这些软件检查不代替清晰度和观感验收。包身份见版本台账L10，Web产物仍为L06，Play包未更新。

---

# 加载首帧与底部闪动修复（2026-10-11，L09，修复保留在L10）

用户在L08反馈加载提示消失后先出现空舞台/空小卡片，底部背景也会闪动。原`ready`只表示资源及桥接可用，Flutter却立即揭开遮挡，后续才异步发送主题、底部留白和播放位置；加载遮挡使用纯色，与全屏渐变不一致。

现在配置结束后单独请求`present`，场景确认人物及小卡片实际绘制、镜头/主题稳定，再经过两个浏览器帧返回匹配请求编号的`presented`与最终状态。中间状态不再使底栏跳回默认时间/阶段，空小卡片在绘制完成前不露出。加载标志先淡出120ms，背景保持不透明，再用220ms揭幕；遮挡按正式全屏渐变的相同坐标绘制。旧回执、重连、图形恢复和暂停时的重绘均已处理，复用视图保留呈现状态。

`flutter analyze --no-pub`无问题，控制器/揭幕时序/既有流程共22项定向测试通过；`verify-presentation.mjs`、`verify-detail-transitions.mjs`、场景build/verify及ARM64 release构建通过。L09使用相同开发证书保留数据覆盖安装，冷启动成功；APK包含本次场景JS/CSS，抽样进程日志未发现Flutter、JS或Shader启动错误。按用户要求直接交真机界面验收，未额外录屏或执行浏览器UI验收。具名包见版本台账L09；Web产物暂仍为L06，Play包未更新。

---

# 首页重点肌群表现（2026-10-11，L08，表现保留在L09）

用户反馈同步发力小人看起来全身都在用力。原因是图例只列支撑/核心/腿部各1项，小人却给阶段内全部主辅肌群着色。首页现在使用与图例相同的3项教学重点，其他部位改为中性灰、降低分区线对比；重点区域通过中心亮、边缘略暗的局部明暗变化提示收紧。变化跟随原动作时刻，暂停时冻结，减少动态效果时保持固定；不是测量的肌肉力量或肌电数值。

每个阶段缓存两组图，再用Canvas 2D混合，没有引入每帧GPU像素读回。进入详情关闭首页表现开关，保留原选区、左右、深层斜线及动作人物材质。Node语法检查、三种材质ShaderLib组装/参数注入、场景build/verify、ARM64 release构建及APK签名校验通过。L08已保留数据覆盖安装并启动到所连手机；依用户要求直接交界面验收，未额外做截图或自动UI回归。Web产物暂仍为L06。

---

# 历史：加载页到人物的切换修复（2026-10-11，L07，后续由L09补修）

用户已确认 L06 不再出现双图标，但加载提示淡出时人物仍提前透出。当前 L07 在整个场景上增加不透明主题背景，加载完成时同步移除遮挡和提示，取消两者交叉淡出。`dart format`、`git diff --check`、ARM64 release 构建及 APK 签名校验通过，已保留数据覆盖安装并冷启动到所连真机。按用户要求，本次直接交给用户做界面验收，不额外录屏或运行浏览器/界面回归；尚不宣称观感已验收。APK 身份见版本台账 L07；本地 Web 暂仍为下述 L06。

---

# 真机启动加载重叠修复（2026-10-11，L06）

基于 `812d948b49616d8edce20fd7ec46d70129e0fa27` 的当前工作区修复，尚未提交。用户反馈冷启动时两个橙色加载图标和两行提示叠加：Flutter 的 `SceneLoading` 与内嵌场景的 HTML loader 同时显示，位置与动画时钟不同。场景现在在首屏通过已有 `FlareHost` / iframe 判断由宿主显示状态，禁用内层加载/错误 UI 与隐藏动画循环；Flutter 继续负责加载、错误和重试。独立打开场景仍保留原提示。

- `app/scene` 的 `npm run build`、`npm run verify` 通过；Flutter ARM64 release APK、离线 Web 构建通过。Dart 仅更新注释，没有扩大运行全量测试。
- 真实 Chromium 定向验证 3/3 通过：阻塞模型加载时，独立页面保留 loader；iframe 与模拟原生 bridge 从状态节点插入起即隐藏内层提示，额外 loader 动画请求为 0。强制加载失败仍向宿主发出错误，独立页仍显示重试；无未捕获 JS 错误。证据在 `output/playwright/2026-10-11-loading/verification-summary.json`。
- 已连接 Xiaomi `2602BRT18C` / Android 16，使用相同开发证书覆盖安装 L06，保留 App 数据。录制一次实际冷启动，加载阶段仅一个图标和一行「正在载入 3D 动作」，随后正常显示并播放人物；启动后 App 位于前台，采集的 AndroidRuntime / Flutter 错误日志为空。录屏及帧图在 `output/device-run/2026-10-11/loading-fix-cold-start.mp4`、`loading-fix-single.png`、`loading-fix-ready.png`。
- 生成场景 HTML、Web 打包 HTML、APK 内 HTML 的 SHA-256 均为 `c34440ec260827bd670d690258a5086f7bbb966669176453290b55cad74aa7f1`。当前包见版本台账 L06；原 PR7 具名包保留，Play P01 AAB 哈希未变。

这次验证仅覆盖所连真机启动和加载显示；T01 长期计时、完整 T02 性能/手势与 iOS 验收继续待办。

---

# PR7审核修复与交付（2026-10-09，已合并）

固定舞台/viewport方案已在最新master目标上补修连续投影、拖动中断、稳定canvas缓冲区、系统返回顺序与场景重载；Flutter分析及44项定向测试、场景/镜头/构图验证、离线Web/开发APK构建通过。真实浏览器进出详情保持390×736画布和2.0秒。用户明确授权后最终审核源b991aa3已普通push，18:00:53（北京时间）合并为e42df21，完整tree相同；相对已验证产品d1c3886的产品目录差异0。

主目录Web的282份文件与已验证隔离构建的文件集合及逐文件SHA-256相同，具名PR7/candidate/通用APK字节与哈希相同，旧PR6 Web/APK已备份，Play旧AAB哈希保持。同步复核复用已通过的软件验证，没有重复构建或扩大测试。具体源码、命令、截图与设备限制见 [PR7审核](pr7-audit-2026-10-09.md)，当前L05包与Git/发布身份见 [版本台账](version-ledger.md)；T01/T02仍待真机验收。

主目录8820同步冒烟通过首次安全确认/v41载入，暂停2.0秒/第11步三角肌进入详情并返回同帧同相机；首页/详情/返回画布buffer均390×736，console为0 error/0 warn。本机实景与数据见 `output/releases/PR7-main-delivery.png`、`PR7-main-delivery-check.json`。

---

# 历史验证：PR6审核修复与交付（2026-10-09，已合并）

修复产品源 `4bc81b830f45279fbaa6631a269a590112f6ae96`，tree `3d35127c3fcb2ff13c2c56af1ce376a82901d840`；原PR源2b87db5、真实目标f1d526a。`flutter analyze --no-pub`无问题，`flutter test --no-pub --concurrency=1 test/ui test/data/muscle_knowledge_test.dart` 36项通过；快速镜头/同帧回归与v41 540帧/136案例通过；离线Web、开发APK构建成功，场景HTML/JS/CSS与两种包逐字节相同。实际手机尺寸浏览器验证、5项审核补修及未验证范围见 [PR6审核](pr6-audit-2026-10-09.md)。

用户明确授权“推进合并吧”后，17:05:14（北京时间）合并为 `aa3c726a66594c23cf66a1b4a7938366ea73dede`；与最终审核源 `d5c11e46bfdfd1c3e7dc87e71ffa851be3f9c843` 完整tree同为 `213951ce7a2879366fafc4fe998db1b38354c365`。主目录快进同步，Web/APK复制自已验证隔离构建；当前包 `output/releases/Flare-v41-PR6-20261009-arm64.apk`，44,114,581字节，SHA-256 `cb14cc10fc40f288fd692b7202e496dd644141390a32ef22577319593925ad7b`，开发签名。旧Web/APK保存在 `output/releases/before-pr6-20261009/`；Play AAB哈希保持原值，未上传。最终交付文档只更新状态，不改变已验证产品内容。

以下PR5/PR3是历史已合并检查点，PR6作者69项自报位于末尾，不能替代本机36项定向验证。

交付复核：主目录Web的282个来源文件与隔离构建逐文件SHA-256相同；9份交付文档111本地链接存在，`git diff --check`通过，合并后的产品目录与4bc81b8差异为0。实际刷新8820后进入穿衣详情和三场景弹层，三张训练卡显示完整，当前tab日志0 error/0 warn；主目录交付实景保存在本机 `output/releases/PR6-main-delivery.png`。这次只核对同步与交付，没有重复已通过的软件测试，真机范围仍按PR6审核限制。

---

# 历史验证：PR #5 / #3 顺序整合（2026-10-09）

已按用户“一条龙推进”的安排，先审核修复并合并PR #5，再合并PR #3。#5合并 `3fcf859b44f8b1b45736f5faaa8fff3cb82512ec`；#3合并 `f44f5922f8aaba76bbc82adfd6c618b4a06ce706`。每次执行前核对源/真实目标，GitHub均确认MERGED；最终产品树 `107d301bf6fa5edc83d27c06f1d10ffeed83ebb5` 与已验证隔离副本一致。无CI或已有review，本次AI结论与已执行合并分别记录，未提交GitHub review/评论。

| 检查 | 实际结果 |
| --- | --- |
| 查实修复 | PR5快速交换详情保存中间机位、减少动态效果时主题控制器销毁异常；另修复主分支已有Web计时`1 << 53`编译为0。PR3全屏肌群快捷键穿透，现隔离背景快捷键、约束焦点并正确释放交错窗口的背景锁 |
| Flutter | analyze无问题；受影响UI/计时/桥接共47项，43项首轮通过、主题4项修复后通过；计时修复后12项领域/UI复测通过。真实dart2js产物另通过倒数、暂停、左右、休息、完成、大时钟起点及实际单调时钟 |
| 动作与场景 | 场景构建/verify通过；v41 540帧22骨44轨道及136肌群/阶段案例通过，代理裆/手泄漏0。快速进入/重置/切群组交换及同帧/首页机位回归通过；网页/App540帧对照骨差最大0.000533mm，时钟往返差0 |
| 网页/个人数据 | 根Vite双入口构建通过；当前v41专用检查181采样及个人正式选择/草稿/K/路线/备份失败通过。旧official-poses脚本两边均23失败、报告相同，保留为历史测试契约待更新，不宣称该旧脚本通过 |
| 浏览器 | 独立8855/8856，390×844及网页桌面布局：原穿衣详情/高亮、同帧交换返回、主题设置、训练退出确认/保存通过。修复后实际倒数进入12秒工作并换到右侧；全屏Space/H/斜线保持后台暂停，按钮Space激活/Tab/同帧关闭与交错重开通过，原编辑器/JSON入口保留；控制台0 error/0 warn |
| 构建与APK | 离线Flutter Web成功；`flutter build apk --release --no-pub --target-platform android-arm64`成功（123秒）。开发签名APK44,046,265字节，SHA-256 `00bddde38ab954068f85428e398a0de83f5e336f82cc09403e9f3a863468da86`，apksigner验证通过；包名dev.mhgd.flare，1.0.0+1，API24+ |
| 主项目交付 | 原项目master快进，已验证dist/Web/APK同步回主目录。新APK具名 `output/releases/Flare-v41-PR5-PR3-20261009-arm64.apk`；旧dist/Web/APK另存 `output/releases/before-pr5-pr3-20261009/`。用户Air-Flare素材保留；已送审AAB哈希仍 `9483f16054440cc7f76826f46f06befb3d141a6a0f6f2cb9dcaedb741e1d2119` |

详见 [PR #5审核](pr5-audit-2026-10-09.md)、[PR #3审核](pr3-audit-2026-10-09.md) 和 [实际截图](screenshots/2026-10-09-pr5-pr3/README.md)。本轮未上传新Play包；长期前后台计时、触感/iOS手势、真机性能/温度/内存及教练审核继续待真实证据。默认动作、脸/服装、历史资产与个人浏览器数据保留。生成JS的Three.js shader来源空白单独注明，不把它当作手写源码空白检查失败。

---

## 2026-10-09 版本台账文档收束

用户显式要求建立版本管理台账，调用cockpit-closeout，并保存、提交、push。本轮先完成只读Preflight，再执行文档对齐；不新增产品功能或改版号，不读取凭据、日志或构建产物，不重新构建或上传。新 [version-ledger.md](version-ledger.md) 是版本/安装包/发布观察的当前来源；[development-roadmap.md](development-roadmap.md) 继续拥有M0–M7与T01–T05验收状态。

### Preflight与改动归属

| 字段 | 已核对事实 |
| --- | --- |
| 仓库边界与分支 | `git rev-parse --show-toplevel` 为 `E:/AII-3D/3D-Body`；`master`，origin为 `https://github.com/mhgd3250905/3D-Body.git` |
| baseline / 依据 | 完整 `f87881ca29588b983f8c96126cbed4e8a514009a`，可核对ref `f87881c`；上一轮接力恢复后、整合PR5前的已记录起点。`git rev-parse --verify <ref>^{commit}` 成功，`git merge-base --is-ancestor <baseline> HEAD` 为0 |
| Preflight HEAD | `1b94e9614dc5d1c035ecb056554c7e11015b0b07`，上轮交付文档保存点；不是任意选取的历史提交 |
| stage delta | `git log --first-parent <baseline>..HEAD` 为PR5合并、PR3合并、交付文档3提交；包含来源分支历史时 `git rev-list --count` 为76。`git diff --name-status --no-renames` 共149路径：M46/A101/D2；13文档、38截图、19 App运行源码、9 App检查、30网页源码/入口、5生成场景、12资产/历史备份、23工具 |
| 收束scope | PR5→PR3整合后的代码行为、当前版本、交付物与验证记录的文档对齐；按用户要求新建版本台账。代码、配置、模型、包、个人数据及历史导出不改，Play外部状态不在线刷新 |
| 完整工作区初检 | `git status --porcelain=v1 --untracked-files=all` 完整输出：tracked/staged/unstaged/deleted/renamed均0；untracked只有 `Air-Flare/air-flare-demo.mp4` 1项，属于阶段前已记录的用户素材；不读内容、不提交、不清理 |
| 本轮改动归属 | 9份文档：8 tracked修改与1新增 `app/docs/version-ledger.md`，均为本Agent确定性对齐；用户素材仍1项。没有其他改动 |

### Canonical discovery与核对结果

从根/App AGENTS与README的明确入口沿一跳发现当前来源，不扫描全仓、不以历史候选替代当前合约。实际读取与核对如下；PR审核文档作为上轮验证证据读取，不扩大canonical发现范围。

| 实际路径 | current / archive判定与对应主题 | 核对及对齐结果 |
| --- | --- | --- |
| `AGENTS.md`、`README.md`、`app/AGENTS.md`、`app/README.md` | current，目录约定与使用/接手入口 | 统一指向版本台账和实施/待验收来源；根README更新PR3默认界面，把旧蓝色/发力提示/有短裤浮窗说明标为保留入口与历史；区分应用预览和已部署隐私Worker |
| `app/docs/development-roadmap.md` | current，M0–M7/T01–T05；末尾e27→b20段为archive/history | M0旧版号修正为1.0.0+1；补PR5/PR3，迁出版本/包/Play记录至新台账；旧收束边界保留为历史，新增本轮边界 |
| `app/docs/verification.md` | 顶部current；PR4、v41接入、v38及PR5作者自报段为archive/history | 保留历史测试事实，明确作者52/59/68项与本机定向回归不可混同；新增source state和本轮文档验证 |
| `app/docs/motion-v41.md`、`app/docs/asset-sources.md` | current合约/来源；其v38与白膜段为archive/history | v41固定来源、烘焙/网页分工、穿衣详情与个人备份一致；未修改这些文件 |
| `docs/friendly-coach.md`、`docs/anatomy-assets.md` | current人物/解剖来源；旧浮窗、早期v4–v21/制作数字为archive/history | 补当前网页加载的mannequin-reference身份和CC0派生范围；保留旧fitness-reference与BodyParts3D出处，旧数字不冒充当前几何验收 |
| `public/coach/ATTRIBUTION.md` | current Snow署名/修改范围 | v41蒙皮、原20可编辑关节、原导出保留说明一致；未修改 |

实际加载路径另只读核对 `src/muscle-viewer.js`、`src/muscle-sync.js` 与 `public/anatomy/mannequin-reference.json`，两模块均加载mannequin-reference；本次只复用上轮GLB核对，不读取模型。App版本/包名用非敏感源配置核对，不读取key.properties或密钥。

### 复用证据与source state

下表命令是2026-10-09上一轮本机CLI/浏览器的实际证据，本次没有重跑。PR5源 `4e434c29add93b9cf0a992090ba4dfc270b7f1d1` 与实际合并 `3fcf859b44f8b1b45736f5faaa8fff3cb82512ec` 的完整tree均 `eb853c24c5ea58b754753afd591c2ee3b5616c47`；最终PR3源 `53d788bf3bf8817907453234136e6f1bb90f04a7` 与合并 `f44f5922f8aaba76bbc82adfd6c618b4a06ce706` 的完整tree均 `107d301bf6fa5edc83d27c06f1d10ffeed83ebb5`。树身份已用Git本地重新核对。

| 证据 / 命令与当时结果 | 对应source state / 当前适用性 |
| --- | --- |
| App `flutter analyze --no-pub`；`flutter test --no-pub --concurrency=1 test/ui test/domain/drill_timer_test.dart test/platform/scene_controller_test.dart`，47项受影响检查在主题4项修复复测后通过；真实dart2js `dart compile js -O4 test_web/drill_timer_runtime_check.dart -o build/timer-web.js`，再 `node -e "globalThis.self = globalThis; require('./build/timer-web.js')"` 通过 | PR5修复后的隔离工作树保存为4e434c2；最终PR3没有改变这些App代码/测试/配置，限定路径Git比较为0。12项计时领域/UI额外复测作为上轮补充，不合并成全量次数 |
| `node app/scene/tools/verify-detail-transitions.mjs`；在 `app/scene` 执行 `npm run build`、`npm run verify`，通过快速交换机位/同帧、v41 540帧/22骨/44轨道及136案例 | PR5已验证场景；PR3与此场景内容相同；最终产品树适用 |
| 根 `npm run build`；`node tools/verify-web-motion-v41.mjs --source E:/AII-3D/3D-Body-worktrees/motion-v41-source`；`node tools/verify-web-app-v41.mjs`，双入口构建、181采样/个人迁移和540帧对照通过 | 最终PR3隔离工作树/上述107d产品树；骨差0.000533mm、时钟差0。旧 `node tools/verify-official-poses.mjs` 两边同为5通过/23失败，按旧契约基线记录，不写通过 |
| App `flutter build web --no-pub --no-web-resources-cdn --no-wasm-dry-run`；`flutter build apk --release --no-pub --target-platform android-arm64`，成功；apksigner验证开发签名，L01字节/哈希见版本台账 | 最终PR3产品树；构建时环境与签名材料另在本机，不能称Git树单独包含安装包或密钥 |
| 8855/8856浏览器实际操作：App同帧/主题/训练倒数及退出保存，网页全屏键盘/焦点/交错窗口、编辑器JSON入口通过；截图见本轮索引 | 上述实际离线构建的外部观察；不是Android/iOS设备、长期计时或45fps证据 |
| Play `flutter build appbundle --release`、上传与送审页面观察 | 源 `92e459f54b620c6d72d2a920521e3e3a72b785e9` 加本机签名材料；只证明先前P01及当时状态，不可用作当前产品/审核结论 |

证据适用性的本次只读证明：`git diff --stat f44f592..1b94e96` 只有8份文档；`git diff --quiet f44f592 HEAD -- app/lib app/scene app/assets app/test app/test_web app/pubspec.yaml app/pubspec.lock app/android src public tools index.html muscle-viewer.html vite.config.js package.json package-lock.json` 为0。本轮9份变更也全部是文档。上一轮产品测试/构建仍适用；完整HEAD tree包含文档变化，不能说它仍等于107d产品检查点的完整tree。

### Agent-reported alignment与本轮必要验证

已处理finding：独立版本来源缺失、M0旧版本号、PR4旧包仍标当前/旧通用路径、遗漏Play/PR5/PR3/1b94检查点、PR4旧收束边界未标历史、Play状态时间限定、旧网页显示/人台身份，以及作者自报与本机证据混同。已确定finding清零；T01–T05及23项旧脚本基线失败继续如实保留。

必要验证为在根目录通过Node stdin执行一次性文档检查（不纳入产品测试）：限定9份改动文档的本地Markdown链接/锚点、版本/哈希/字节/SHA与原记录对应、提交/ref/tree身份、上轮验证到当前产品路径差异、保留历史验证正文、工作区路径及归属；另执行 `git diff --check` 与完整status复检。首轮实际结果：108个本地链接、12个锚点、19个Git对象身份、4组包字节/哈希一致；历史验证正文除明确archive注记外不变，产品路径差异0，PR5到最终App路径差异0，状态为9份Agent文档及1项用户素材。入口微调后的对应复检也通过：仍为108链接/12锚点，`git diff --check`通过、产品差异0、HEAD未变；完整status仍是上述9份文档与1项用户素材。证据绑定为Preflight HEAD上上述9份文档的工作树，随后以实际提交SHA定位。没有运行Flutter、3D或构建全量检查。

---

# Google Play 封闭测试送审记录（2026-10-09）

按用户显式授权（"直接帮我做、按推荐选择、不用问"）完成Play Console接入。closeout基线 `1519c4dd70cf6b658c5fa4ac5445343645ab057c`（接力记录的阶段基线），阶段提交 `92e459f`（release签名配置+`1.0.0+1`）与 `6e99c05`（T05台账初记）。上传密钥 `keys/flare-upload.jks` 与 `app/android/key.properties` 均gitignored，仅E盘本机保存；无密钥环境构建自动回退debug签名，行为不变。

| 检查 | 实际结果 |
| --- | --- |
| AAB构建 | `flutter build appbundle --release` EXIT=0（2026-10-09本会话）；产物77,816,786字节，SHA-256 `9483f16054440cc7f76826f46f06befb3d141a6a0f6f2cb9dcaedb741e1d2119`。前两次失败为Kotlin DSL写法与密钥相对路径，修正后成功；失败不算通过 |
| 签名与版本 | 构建时工作树即 `92e459f` 提交内容（pubspec `1.0.0+1`、gradle读取key.properties）；validateSigningRelease通过。Play Console显示版本1(1.0.0)、目标SDK 36、API 24+，优化后新安装33.9MB |
| 静态分析 | `flutter analyze --no-pub` 无问题（closeout时复验，见下） |
| Play接入 | 应用 `dev.mhgd.flare` 创建；11/11设置清单完成（隐私政策Worker、内容分级全年龄/PEGI 3、数据安全零收集、受众13+、类别健康与健身、无广告、广告ID"否"、健康声明"活动和健身"、登录/政府/金融声明）；商品详情zh-CN含7张475×844(9:16)截图、512图标、1024×500置顶大图 |
| 送审状态 | 封闭测试Alpha轨道：AAB+178国家+测试者邮箱列表"Flare Closed Testers"（含mhgd3250905@gmail.com）；发布概览15项更改已送审，页面显示"正在审核中"（Google称通常7天内）。预检曾阻塞于"广告ID声明不完整"，如实补报"否"后通过 |

Play页面状态是送审时外部观察，不替代审核结论。真机安装/性能仍为T02、长期前台计时仍为T01；生产发布被平台锁定为"≥12名测试者连续14天后申请正式版权限"，测试加入链接 `https://play.google.com/apps/testing/dev.mhgd.flare`。隐私政策 `https://flare-privacy.294851575.workers.dev` 部署于Cloudflare Workers（源码在根项目 `output/store/flare-privacy-worker/`，本机资源）；商店素材在 `output/store/`。本轮closeout必要验证：3份修改文档本地链接/事实字段检查、`git diff --check`、`flutter analyze --no-pub`；未重跑产品测试与3D验证（产品代码有限delta仅build.gradle.kts/pubspec，且analyze通过）。

---

# 历史验证：PR #4 浅色训练图与最终 App（2026-10-09）

先保存并正常推送v41提交 `e27f4cd8ff7b6848de50da2377e76cb00542dabb`，再按用户授权审核合并PR #4。固定源 `3b25f13075dcf4aa0bec918cdbf2947c5a8bb8a3`、目标 `e27f4cd8ff7b6848de50da2377e76cb00542dabb`、PR报告基准 `8537146d9168fdc95a86da802d7dabeeba64fbb4`；结束前查询源未变化。GitHub没有CI记录或现有review，本次AI审核未发现阻塞项，未提交GitHub review。实际合并 `bb94d849099d6a2985aa72c00373ce17d81a9993`（2026-10-09 09:47北京时间），原项目已快进；其tree `cbf81746bca8eb4146c0f99b7b3744db02cb89cf` 与已验证隔离副本完全相同。

| 检查 | 实际结果 |
| --- | --- |
| 浅色资源 | 51训练ID、102张WebP全部Pillow解码成功，1024×1024及512×512正确，无缺少/多余/串图，共1,188,470字节；同名缩略对大图缩放的最大单通道RMS为2.085/255 |
| 图像审核 | 实际逐对查看全部51套深浅图，并放大hamstrings-A、obliques-C，无新增严重动作或器械错误。前者高亮稍延伸臀部、后者器械浅银色仍保留为示意差异 |
| 代码 | 训练卡、列表、详情均选用主题图；light子目录明确打包；Theme依赖重建正常，无遗漏的训练图消费点 |
| Flutter | `flutter analyze --no-pub` 无问题（4.9秒）；`flutter test --no-pub --concurrency=1 test/domain/catalog_dose_test.dart test/ui/flow_regressions_test.dart` 13项通过，覆盖资产/剂量和主题/交互。首次命令误引用不存在的theme_test文件，修正为现有flow后整组通过；首次失败不算通过 |
| 离线Web | `flutter build web --release --no-pub --no-web-resources-cdn --no-wasm-dry-run` 成功（25.7秒） |
| Android | `flutter build apk --release --no-pub --target-platform android-arm64` 首次daemon异常退出；进程环境 `GRADLE_OPTS=-Dorg.gradle.jvmargs=-Xmx2G -Dorg.gradle.workers.max=2 -Dorg.gradle.daemon=false` 重试成功（23.7秒），产品配置未改。ARM64 APK44,045,329字节，SHA-256 `4040188f0c6dfad56e77afb7b99e6878bfefc51e0103e875ef66df5efeb7bfe5`，本地开发签名 |
| 包内核对 | 从实际APK ZIP及Web读取102张浅图、v41烘焙模型和场景入口，均与源逐字节相等；v41场景/动作未变，不重复其已通过的540帧验收 |
| 浏览器 | E盘隔离8854预览以390×844查看浅色库/详情/今日训练，再切回深色原图；0 error / 0 warn。仅写隔离数据，没有清理8820个人数据 |

实景与资源、图像、APK/Web检查见 [证据索引](screenshots/2026-10-09-pr4/README.md)。最终安装包为 `app/build/app/outputs/flutter-apk/app-release.apk`，具名副本为 `output/releases/Flare-v41-light-20261009-arm64.apk`；合并前v41包独立保留为 `output/releases/Flare-v41-before-pr4-20261009-arm64.apk`。原项目8820预览已更新。全部副本、缓存、证据和构建在E盘；真机安装和性能、长期训练倒数及源动作重放/脚部高度限制仍未验收，不能因本次图像变更称作已解决。

---

## 证据source state与本次文档收束

上述PR4测试/构建执行于e27与固定源3b25的已合并隔离工作树；之后保存为 `afb4e294b524ab4627604b30fa3f71ec6a51d44c`。其tree与实际GitHub合并 `bb94d849099d6a2985aa72c00373ce17d81a9993` 均为 `cbf81746bca8eb4146c0f99b7b3744db02cb89cf`，`git diff --quiet afb4e29 bb94d84` 为0。隔离提交本身不是主分支祖先，用树相同证明内容一致，不混同提交身份。

| 证据 | 命令/结果与当时来源 | 对当前运行内容的适用性 |
| --- | --- | --- |
| PR4静态分析/13测试 | 上表完整命令，2026-10-09本会话实际CLI通过；source为上述tree | bb94到 `b20bd33c4635c8d8a9c59990e2587036afc197e8` 仅文档/截图/证据；`git diff --quiet afb4e29 b20bd33 -- app/lib app/assets app/pubspec.yaml app/pubspec.lock app/android` 为0 |
| PR4 Web/APK、图像/浏览器 | 上表构建与实际审计，2026-10-09；同tree；截图是浏览器观察，不是设备性能证明 | 同上，产品/配置未变，44,045,329字节是最终包；不复用旧5c579包作为最终包 |
| v41动作/两端/构图 | 下方v41历史节中的 `node app/tools/verify-v41.mjs`、`node tools/verify-web-app-v41.mjs`、`node app/scene/tools/verify-framing.mjs`；2026-10-09 e27保存点实际通过 | `git diff --quiet e27f4cd b20bd33 -- src public/coach app/scene app/assets/scene app/tools` 为0，540帧证据适用；本轮没有重新执行它 |
| 49项Flutter | 下方PR2历史节的全量命令和当时实际通过记录 | PR4不是全量重跑，不冒称最终Dart全量49项重新通过 |

本次closeout基线 `e27f4cd8ff7b6848de50da2377e76cb00542dabb` 是用户PR4前保存点，已核对为Preflight HEAD `b20bd33c4635c8d8a9c59990e2587036afc197e8` 祖先；delta为3提交/124路径：102浅图、14截图/证据、4当前文档、2UI、1配置、1测试。完整初检tracked改动0、untracked用户素材 `Air-Flare/air-flare-demo.mp4` 1项，保留不读内容、不提交。

2026-10-09本次实际运行一次性 `E:\Apps\nodejs\node.exe -e` 文档检查：限定7份修改文档，解析本地Markdown链接并核对Git tracked来源，97个链接通过；台账提交/版本/包字节与哈希字段一致；v41历史验证正文与Preflight HEAD归一换行后逐字相等；产品源码/配置、日期交接和截图的 `git diff --quiet HEAD -- <限定路径>` 为0。`git diff --check` 通过；完整复检为上述7份本Agent文档修改与同一1项用户素材，无新增未解释项。证据对应 `b20bd33` 上本次仅文档的工作树；没有运行或读取build/APK/日志，也没有全仓扫描或重复产品测试。

实际检查的当前canonical为根/app的AGENTS与README，以及 `development-roadmap.md`、`asset-sources.md`、`motion-v41.md`、本文件；v38及2026-10-08 App/2026-10-07网页交接仅作历史背景。对齐范围仅这些当前入口/台账中已确定的版本/外观/记录矛盾；历史交接、截图、代码、模型与配置不改。必要验证为7个修改文档的本地链接、事实字段/证据SHA/遗留当前措辞、历史块不变与完整工作区归属、`git diff --check`；产品代码/配置有限delta为0，故本次文档变更不重新构建或跑Flutter/3D全量。文档检查与Git提交后实际SHA以本次收束回执为准，不预填自身提交。

---

# 历史验证：网页 / App v41接入（2026-10-09）

PR #2 已合并，合并提交 `8537146d9168fdc95a86da802d7dabeeba64fbb4`。随后按用户要求从 PR #3 固定来源 `53d72b412840a942fefc818836b68ad2a2d7e0d1` 同步动作、领口蒙皮和时钟；保留网页编辑器与 PR #2 的 App 界面。结束前重新查询：PR #3 仍 OPEN，来源 SHA 与目标 SHA 均未变化，GitHub 没有 CI 或已提交审核结论。本轮是动作适配，没有整体合入 PR #3 的网页首页重构。

| 必要检查 | 实际结果 |
| --- | --- |
| Flutter 逻辑 | PR #2 整合时静态分析无问题，49项测试通过；v41仅修改场景与资源，Dart未再改动 |
| 网页默认与编辑 | `node tools/verify-web-motion-v41.mjs --source E:/AII-3D/3D-Body-worktrees/motion-v41-source` 通过181采样：实际轨迹、来源关节和节奏差均0；进入编辑器不移动暂停姿态，个人正式动画/草稿/K/路线与备份失败分支通过 |
| App v41 | `node app/tools/verify-v41.mjs` 通过540帧、22骨、44轨道、模型属性与动画无损、24帧间采样及136肌群/阶段案例；首尾差0，裆部/手部高亮泄漏0 |
| 两端对照 | `node tools/verify-web-app-v41.mjs` 用实际网页运行代码对照App烘焙播放器，540帧骨位置最大差0.000533毫米，归一化旋转角最大差8.27e-7弧度，时钟往返差0 |
| 构图与历史 | 当前390×650构图181姿态检查通过；v33历史来源与v38历史烘焙校验通过，旧资产和原始导出未覆盖 |
| 场景与网页 | Vite构建成功。App场景入口 `index-Cj6AsPsh.js`，20文件共11,451,267字节；根网页入口 `index-BavKgVfi.js` |
| 离线包 | Flutter Web release成功（54.5秒），不使用CDN；ARM64 APK成功（100.5秒），42,836,141字节，SHA-256 `5c579985b1ed6b7db3ba988400bd2a3d88065e102f2cf83f12d883b6f430a9c7`，本地开发签名 |
| 实际浏览器 | 独立8852 App和8853网页均停在第11阶段2.0秒；App详情穿衣柔边高亮、固定机位、直立人台互换及返回保持同帧；网页原姿势编辑器可进入，JSON导入/导出入口保留；两端控制台0 error / 0 warn |

实际浏览器截图见 [本轮截图索引](screenshots/2026-10-09-v41/README.md)。测试使用独立端口，没有清理8820/8810的个人浏览器数据。所有项目工作副本、资源、构建和本轮缓存位于E盘；曾因C盘空间不足中断的构建不算验证成功，相关可恢复输出已迁到E盘，之后在E盘成功重建。主目录可直接使用已验证的 `dist`、`app/build/web` 和 `app/build/app/outputs/flutter-apk/app-release.apk`。

范围限制：源v41平滑帧直接捕获后序列化再应用仍有历史约4.06厘米关节偏差，进入编辑器本身不触发这一跳变；源脚部最低约−8.66毫米未擅自改高。真机安装、≥45fps、温度/内存及训练倒数的长期前台验收仍未完成。详情与来源合约见 [motion-v41.md](motion-v41.md)。下方全部为此前独立检查点。

---

# 历史：PR #2 与 v38 整合（2026-10-09）

用户确认采用全页面精简、深浅主题、穿衣代理高亮与固定动作机位；本地 v38 烘焙动画保留。下列两份记录分别描述此前独立检查点，整合后的当前验证在本节更新。

本次整合检查：`flutter analyze --no-pub` 无问题；`flutter test --no-pub --concurrency=1` 49 项通过，新增暂停单位/阶段/圆环、延长休息、待确认过关条件及跨午夜周统计回归。Vite 构建成功，当前场景入口 `index-DMNK6zsR.js`；历史 v33 来源检查与当前 v38 的 540 帧/44 轨道无损、时钟和 136 组穿衣代理选择均通过，裆部/手部泄漏 0，不挂接历史白膜。离线 Flutter Web 构建成功（33.1秒）。

实际浏览器在独立8852预览核对三角肌详情、原衣服柔边高亮、固定机位、模型交换、进入训练、暂停倒数显示“3 秒 · 准备 · 已暂停”，控制台0 error/0 warn。实际截图留于本机 `output/pr-2-audit/integrated-detail.jpg` 与 `fixed-pause.jpg`，此前问题截图未覆盖。浏览器训练使用独立预览数据，未更改8820的个人数据。计时状态机的真实前台长期倒数、原生设备性能和安装仍未完成验收；此次不把旧“停在3秒”的现象标记为已解决。暂未重建安卓包，最终动作同步后统一生成。

# 深色 / 浅色主题（2026-10-09）

- 设置 → 外观 → 主题：跟随系统（默认）/ 深色 / 浅色，存入本地设置 `themeMode`；旧数据无此字段时按跟随系统读取。
- 色板集中在 `lib/ui/theme.dart` 的 `FlarePalette.dark / .light`；`FlareColors` 读取当前色板，MaterialApp builder 按解析后的亮度切换，页面依赖 Theme，切换时不重建 3D 视图。
- 3D 场景收到 `{type: theme}` 命令，只换页面外壳（加载层、小卡底色、阶段小人体卡、热点描边）；托马斯、灯光与材质两套主题完全一致。
- 验证：`flutter analyze` 无问题；`flutter test --no-pub` 43/43 通过（新增主题切换持久化+场景命令、旧设置兼容两项）；`flutter build web` 成功；场景 `npm run build`、`npm run verify` 通过。
- 截图：`screenshots/2026-10-09/light/`（18 张浅色），深色在同目录上一级。
- 浅色训练图：`assets/drills/light/` 51 张配套图，浅色主题下训练库、今日训练、训练详情都换用；`catalog_dose_test` 会断言每张都存在且是 WebP。

---

# 本轮验证记录（2026-10-09 全页面精简重构）

依据设计稿逐页实现，计划见 [redesign-plan-2026-10-09.md](redesign-plan-2026-10-09.md)，截图见 `screenshots/2026-10-09/`（18 张，Flutter 组件渲染 + 真实 FlareSans 字体；3D 区域由 Node 软光栅用真实模型/动作/分区渲染后合成，沙箱浏览器 WebGL 不可用）。

| 检查 | 结果 |
| --- | --- |
| Flutter 静态分析 | `flutter analyze` 无问题 |
| Flutter 测试 | `flutter test --no-pub` 41/41 全部通过（含此前陈旧文案断言，已随新流程更新） |
| Flutter Web | `flutter build web --release --no-pub --no-web-resources-cdn --no-wasm-dry-run` 成功 |
| 场景构建 | `npm run build` 成功，17 文件 5,748,428 字节 |
| 场景校验 | `npm run verify` 通过：136 组合（17 肌群 × 8 阶段）首页选择保持原材质 identity；详情仅覆盖层为原材质克隆代理，脸/发/手/鞋不染色；可见性、姿态、时间不变；还原后 identity 恢复；裆部禁区与手部泄漏均为 0；136 个固定机位方向均不低于水平仰视 |
| 视觉验收 | `flutter test --no-pub test_screens/shots_test.dart` 生成全部页面截图并人工逐页审阅 |

未覆盖：真实 WebGL 下的高亮着色器编译与观感（沙箱无可用 GPU 浏览器），需在真机/桌面浏览器复看详情页；计时“倒数停在 3 秒”最可能是后台/截图节流触发 5 秒无人值守冻结（转为“已暂停”），新计时页把暂停状态显示为“已暂停”并给出“继续”主按钮，仍需真机前台复测。

---

# 本轮验证记录

## 以下为接入 v38 时的历史记录

# 验证记录

## 2026-10-09：v38 动画与米白哑光详情模特

本轮按用户最新要求采用推荐的 `flare_v38_loop` 烘焙 GLB。首页穿衣，指定肌群详情恢复暖米白哑光、无衣、无五官的同源模特，只显示当前群组浅红柔边；直立人台保留精细分区线。来源与时钟接口见 [v38 接入说明](motion-v38.md)，实际画面见 [新版截图](screenshots/2026-10-09-v38/README.md)。下方2026-10-08记录是旧检查点事实，不代表新版本。

| 必要检查 | 本次实际结果 |
| --- | --- |
| 来源与编码 | 新 GLB 7,989,316字节，无量化/减面/动画重采样，meshopt+gzip 2,609,745字节。独立 v38 清单记录源与派生哈希；21份 v33 基线未覆盖 |
| 当前动作 | `node ../tools/verify-v38.mjs` 通过：540帧、22骨、44轨道，3,349,896个模型属性值、106,920个动画值及逆绑定无损；与 v38 运行时对照骨误差最大0.001397毫米、身体每97顶点采样最大0.001653毫米，教学锚点最大0.52427毫米。时钟正反转换差0；540阶段数据同步；17组×8阶段=136次详情/原服装恢复检查通过 |
| 详情绑定 | 只对保留的20骨派生身体/头部准备腰部辅助权重，再绑定到演员已有22骨；烘焙演员不重复安装辅助骨、不运行IK。保留源逆绑定及网格偏移，82,144个皮肤样本检查通过 |
| 当前构图 | `node tools/verify-framing.mjs` 通过：390×650、181姿态、每8顶点抽样；padding由0.72改0.75，最小投影[3.81,52.17]、最大[361.15,374.79]。已修复新版左侧脚约4px截断 |
| 历史基线 | `node ../tools/verify-scene.mjs` 通过并明确 `historical-v33-source-and-runtime-parity`：21文件、181旧姿态/时钟保持；不冒充 v38。工具同时核对当前离线包18文件约8.56MB |
| Flutter | `flutter analyze --no-pub` 无问题（5.6秒）。恢复 ARB 深层高亮文案并 `flutter gen-l10n` 后，桥接与UI回归14项全部通过；首次测试指出此前取消高亮时残留的文案与预期不符，已按本次恢复功能修正 |
| 构建 | Vite成功，入口 `index-qDcAYCLr.js`；最终离线Web成功（26.7秒），ARM64 APK成功（35.6秒）。APK 40,175,277字节，SHA-256 `84b4b61a323b507c70af156de2a11c5d62e0bddcce64b2517d79f038aeec49d4`；本地开发签名 |
| 浏览器 | 最终8820构建实际操作阶段11定位、0.5倍速度、单段循环数圈/恢复整圈、390与320尺寸交换、画布拖动、正背/复位、进入训练再返回。暂停2.0秒/腹斜肌保持，衣物与白膜按页面恢复；离屏停止渲染、返回恢复。0 error/0 warn；保存3张实际代表PNG与诊断记录 |

独立检查发现 AnimationMixer 缓存会使 `reset()` 后返回同一时刻不写入姿态，已通过先停止绑定再重新激活修复，用冻结姿态检查验证。浏览器使用实际UI，诊断仅只读；没有开始训练、创建记录或清理浏览器数据。

自动证据在 `scene/tools/evidence/v38-verify.json`、`framing-v38.json`。旧资产、可编辑白膜 `.blend`、根目录编辑器、个人导出、`Air-Flare/` 与2026-10-08检查点/截图均保留。训练倒数现象、Android/iOS真机、45fps及17×8人工命中率仍待验收，本轮不冒称完成。

## 2026-10-08：历史检查点

2026-10-08。本记录对应当前Flutter App：极简首页、双模型详情、直立肌群细线，以及最终取消托马斯白膜和动作高亮的版本。包内历史测试和根目录旧网页的验证不代替本轮结果。视觉验收见仓库根 [design-qa.md](../../design-qa.md)，14张代表截图见 [索引](screenshots/2026-10-08/README.md)。

## 本地检查与构建

| 检查 | 实际结果与范围 |
| --- | --- |
| Flutter静态分析 | 本轮 `flutter analyze --no-pub` 无问题（4.5秒）；ARB源更新后由 `flutter gen-l10n` 生成文案 |
| Flutter测试 | 本轮 `flutter test --no-pub --concurrency=1 test/platform/scene_controller_test.dart test/ui/flow_regressions_test.dart` 的14项全部通过；覆盖桥接、同帧交换/返回、320/390布局、生命周期、自评与计次保存。嵌入真实3D并非组件测试中创建，不用它替代实际浏览器；36项全量为此前结果，未重复 |
| Flutter Web | 最终 `flutter build web --release --no-pub --no-web-resources-cdn --no-wasm-dry-run` 成功（补齐许可后增量3.1秒；此前文案构建32.2秒）；无白膜入口，深层位置提示切换直立人台，渲染资源及场景许可随包提供 |
| Android ARM64 | 最终 `flutter build apk --release --no-pub --target-platform android-arm64` 成功（增量8.9秒），文件37,570,351字节（Flutter输出35.8MB），23:12:42 +08:00生成；本地开发签名，非商店发布验收 |
| 场景构建 | 本轮Vite成功，17个运行文件共5,744,966字节；入口JS `index-CrYsLGvO.js`。只加载原Snow和静态人台；历史study gzip虽随旧资产保留，不加载或挂接，无CDN |
| 动作与模型校验 | 最终 `node tools/verify-scene.mjs` 成功：21个源文件哈希一致，181姿态关节/时钟差0；17组×8阶段=136次选择和恢复，原衣服/面孔可见且材质对象identity始终相同，正式场景没有study挂接 |
| 相对区域坐标 | `npm run verify:muscles` 已通过12个真实皮肤采样、9个阶段、4362条核心边及源哈希检查。工具使用历史完整皮肤核对相对坐标；当前动作仅用校准坐标点击命中，不作着色；非人体精确配准 |
| 默认循环构图 | 上一轮 `node tools/verify-framing.mjs` 成功；只加载原coach，390×650场景、181姿态、每8顶点抽样。本次保持同一原coach/机位，无几何或构图改动，因此不重复全循环抽样，实际浏览器确认当前模型和详情 |
| 原网页 | 上一轮根目录 `npm run build` 成功并生成 `dist`；本次未修改原网页，未重复构建，原始动作导出保留 |

最终安卓试用包：`app/build/app/outputs/flutter-apk/app-release.apk`。SHA-256：`059e58d7d0fc42ec5479433532632b4a25be4dde5af35a65aab94ce50149649d`。APK和build留本地，新机器按记录重新构建；此前 `app-debug.apk` 不是当前交付包。

收口核对通过11份当前文档的112个本地链接，以及14张原始PNG的字节/SHA-256（共412,289字节）。生成场景17文件与最终Flutter Web复制件逐字节一致，许可源与生成件一致。首次发现遗漏 `assets/scene/licenses/`，已在pubspec补齐并重建，最终核对通过。`git diff --check` 通过；未修改的原网页和全量历史测试不适用于本次冻结范围，未重跑。

第一次最终Web构建曾因PowerShell宿主内存异常中止；改用系统Windows PowerShell重新执行后成功。先前Wasm干运行已成功，本次最终构建跳过重复干运行。最终构建成功是包生成证据，不代表原生3D或真机性能已通过。

## 动作和资产

直接生成证据为 `app/scene/tools/evidence/model-verify.json`：`referenceAvailable: true`，每0.05秒与包内v33原版对照，共181姿态，关节/四元数/节奏/子步骤时钟差均为0。正式runtime为原Snow的211,060顶点、332,206三角形，`runtimeStudyAttached:false`，136次选择期间原服饰、面孔和材料identity保持；历史白膜部件仅在独立模型中核对压缩和绑定。直腿最小176.234°，支撑肘最小178.288°，自由肘最小179.926°，循环骨长浮点差约3.89×10⁻¹⁶ m。

最终无损检查对照原Snow、人台、派生身体与空白头，共4,893,246个模型属性值；58,948个三角形仅有等价循环索引旋转。原Snow从7,508,016字节压缩为2,390,231字节，人台从1,338,688字节压缩为863,833字节。新身体为41,813顶点/58,552三角形，GLB 3,368,980字节压缩为1,236,931字节；空白头为16,669顶点/33,144三角形，GLB 938,188字节压缩为382,447字节。两块皮肤各有原20骨并使用各自逆绑定矩阵。原Snow21份基线保持，身体局部雕修和头部重网格属于用户授权的派生制作；之后的运行时压缩未再减面或量化。不能据此宣称移动端帧率改善。哈希和命令见 `model-optimization.json` 与 `study-body-optimization.json`。

默认固定机位的投影抽样边界为x=7.410–369.330、y=54.827–357.334，落在390×650场景内。该结果见 `framing-verify.json`；它说明已检查的181个姿态和每8顶点抽样不越界。实际浏览器同时确认了全循环和小屏人物构图。机位保持固定，用户开始旋转后保留手动镜头；默认状态窗口缩放会重新取景。

`browser-check.json` 保留的是早期390×380宿主检查，`home-contract-check.json` 保留的是早期接口检查；它们不是最终首页截图或全部M2人工命中表。

## 浏览器直接验证

本轮最终实际浏览器证据见截图索引及 `screenshots/2026-10-08/browser-check.json`。阶段11/2.0秒/腹直肌默认穿衣无着色，点击小卡片交换直立正背参考并切回、实际拖拽后同帧与选区保持，`visible:true/running:true`，study部件数量0。直立只当前浅红选区，其他颜色收起。最终日志0 error/0 warn。14张代表图已逐张检查尺寸并打开联系表；独立8821预览用于首启和样例记录，不清用户8820数据，临时视口已恢复。

本次计时准备截图不是实时计时闭环验收。独立IAB留档时曾观察倒数停留3秒，未归因；一次等待“完成1次”按钮未出现，不把这一过程写为浏览器计时通过。该项已进入M3优先复测，须先核对真实前台浏览器与真机，再决定是否需修实现。本轮冻结版本的动作显示/源码不变量及相关自动检查均通过；没有扩大到全M0–M7或再次重跑全部训练流程。

以下暖米白与白膜记录仅为此前历史证据，当前不再展示该模式。

最新用户反馈亮白陶瓷看不清，已仅调整底色和反光为柔和暖米白哑光。`output/design-qa/20261008/warm-matte-ceramic/compare-stage.png` 对照相同视口/相机/阶段11/2.0秒/三角肌右侧的真实场景，已打开；旧页面下方滚动状态不同，只比较同一3D区域。正背实际检查曲面明暗和高亮，控制台0 error/0 warn；最终场景校验、Web与ARM64构建通过，无Dart或交互逻辑修改，未重复全量交互/组件测试。

以下为上一轮 `output/design-qa/20261008/garment-free-study/` 的陶瓷白膜。代理直接在最终Web构建检查无五官面孔、肚脐移除、局部中性裆部、衣服隐藏、颈胸连接、白色釉层与可读高亮。阶段11/2.0秒/腹斜肌的正背视角、真实画布拖动及320×700交换两次均保持渲染和同帧；播放恢复所有原服装、眼口、眉、头发并隐藏新皮肤。阶段14/5.0秒的另一侧支撑也实际检查。最终0 error/0 warn，证据为 `browser-check-final.json` 的 `final-ceramic-*`。

`compare-ceramic-full.png`、`compare-ceramic-model.png`、`compare-ceramic-detail.png` 和 `compare-neutral-detail.png` 均由实际同输入截图组成并打开检查。该轮底色是非金属亮白物理材质，使用现有离线RoomEnvironment和柔和釉层；不会改变直立人体细线。完整无五官头可见于 `final-ceramic-home-window.png`。以下保留较早细线和交互检查的事实，最新白膜亮度与哑光程度以本轮暖米白证据为准。

最新细线证据为 `output/design-qa/20261008/fine-muscle-lines/`。正面优化前后均在390×844、密度1截图/密度2场景、阶段11/2.0秒/三角肌右侧/同一相机捕获；完整和局部对照已实际打开。实际检查正面、背面、画布滚轮放大、首页正背小图、白膜小卡片及320×700模型交换。线条改为光照与显示编码后的细灰描边，保持原分区、法线与网格；跨边界梯度连续性修正没有增加新区域。没有新增顶部控件。

本轮浏览器重新发现SceneView的第二个生命周期监听仍会在iframe拖动后发送 `visibility:false`。现在SceneView只保留平台视图，AppShell统一控制导航/原生生命周期，Web播放器控制document visibility。`fine-muscle-lines/browser-check.json` 的修正前步骤注明 `before-duplicate-observer-removal`；最终以 `final-build-*` 为准：拖动后真实机位与画面变化且渲染持续，模型两次交换和320小屏交换保持2.0秒/三角肌；进入训练时 `visible:false/running:false`，返回详情再回首页恢复渲染且同帧。没有开始训练或新增完成记录。最终控制台0 error/0 warn。

以下是此前双模型/首页验证记录，未改动范围保持有效；过淡边线与不完整的生命周期修复结论以上方最新记录为准。默认大画面为托马斯白膜，小卡片为直立肌群人体；整块86×108小卡片是唯一模型切换入口，没有顶部segment。白膜没有额外肌群沟槽、边界或深层斜线；直立人体保留细分界线。两种模式均真实渲染，源数据和原网格没有替换。

曾实际复现“文字切了、模型不更新”：拖动3D后，宿主将仍可见的场景置为 `visible:false/running:false`。现在Web场景按自身document visibility停启，Flutter导航仍关闭离屏场景；原生生命周期继续管理后台停止。小卡片在宿主层接收点击并恢复可见渲染，场景内按钮保留直接预览回退。最终重走同一拖动路径后，`visible:true/running:true`，模型与视角都实际变化；两次交换及返回首页始终为阶段11、2.0秒、三角肌。证据为 `output/design-qa/20261008/dual-model/browser-check-final.json`。此前包含故障的 `browser-check.json` 仅作为修复过程记录。

此前截图为同目录 `detail-motion.png`、`detail-muscles.png`、`models-final.png`；同输入视觉对照 `compare-request.png` 已实际打开检查。320×700的两种模型也实际操作并截图。最新直立人体边线和生命周期验证使用上方 `fine-muscle-lines` 证据。每次实现后的首次交互复核由代理完成，不交给用户代测。

使用Codex内置浏览器打开 `http://127.0.0.1:8820/`，检查最终构建；390×844与320×700均实际截图。完整原稿和实现同输入对照见 `output/design-qa/20261008/compare-final.png`，小控件局部对照见 `compare-controls.png`，最终画面为 `home-final.jpg` 与 `home-small.jpg`。手机系统框与状态栏不作为App内容复制。

已直接操作首次安全确认、更多菜单、阶段11定位到2.0秒、键盘Tab进入时间轴及右键增至2.1秒并暂停、真实人物三角肌热点、对应训练、计时倒数/暂停/退出及历史记录。退出未完成训练不会记为完成；从训练经详情返回保持2.1秒和肌群选择，没有因场景状态回报再次打开详情；重新播放才清除选择。时间轴拖动、按刻度定位与完整训练保存另有界面测试覆盖。

首页没有常驻底部导航、速度/镜头排、肌群标签排；底部仅播放控件与细时间轴。普通指针可以点击顶部更多，之前Material Slider的空白语义覆盖层已通过自定义时间轴移除。保留可访问语义，键盘能操作时间轴。390→640→390以及返回窗口默认尺寸后，默认机位重新取景，未再出现窗口变化后的过大裁切。320×700的小人体、提示和播放控件未发生遮挡。

最后一次浏览器控制台检查：error=0、warn=0。最终页面和场景文档均来自同一 `127.0.0.1:8820`；浏览器资源树没有返回完整请求清单，因此不把它当作所有请求均离线的证据。构建检查确认本地字体、模型、JS和Flutter渲染资源已打包；尚未执行真机飞行模式或浏览器完全断网复测。

## 原生验证限制

Android软件渲染模拟器能够安装此前调试包并显示欢迎页。进入3D后，CDP/服务记录确认本地场景模块与两份gzip模型已加载，但没有得到有效人物渲染或ready确认。两次模拟器尝试均发生 `qemu-system-x86_64-headless.exe` 的Windows崩溃（0xc0000005），因此原生3D冒烟检查未通过，不推断原因，也不以Web结果代替。

证据保留在 `output/playwright/flare-app-20261008/native-software-cdp.json` 与 `native-emulator-crash.txt`。其中旧 `native-home-ui.xml` 在读取失败后保留欢迎页内容，不作为首页或ready证据。尚无Android真机、iOS构建/运行或平台读屏的通过记录。

## 后续门槛

按 [实施路线](development-roadmap.md) 先完成Android真机启动、本地3D、前后台与飞行模式检查，再取得手机帧率、冷启动、内存/发热、特写延迟，以及17肌群×8阶段的人工点选表。≥45fps、命中率≥95%、iOS、VoiceOver/TalkBack和大字体均尚未验收。原生常亮/声音/触感/休息通知、课程与自评阈值审核、完整数据导出恢复、正式标识/签名及商店发布继续留在各里程碑，不能标记为已完成。

后续只按受影响范围复测：Dart修改运行分析和相关测试；场景修改先构建/校验再核对App实际画面。必要检查通过后停止扩大测试。

## 历史：PR5作者自报的动效与过渡（2026-10-09）

以下三节为PR5来源提交随附的历史自报验证，环境与source state不同于本轮本机整合审核；52/59/68项和作者截图不合并成当前HEAD的全量通过证明。本轮实际回归、构建与浏览器证据以本文顶部及本次source state表为准。

- `lib/ui/motion.dart`：统一动效。`FlareStage` 让壳层的状态式导航也有过渡：更深的页面从右侧推入，原页面左移并变暗；返回时反过来；计时页作为模态从底部升起；同级页面交叉淡入。两侧页面都按 key 保持挂载，状态不会丢。空页面（3D 舞台）不接收触摸。`FadeSlideIn` 负责错落入场，`Pressable` 负责按下缩放，系统开启“减弱动态效果”时全部直接切换。
- 应用位置：训练库网格按筛选错落入场；卡片和主按钮按下有回弹；筛选胶囊颜色渐变；底部弹层用统一曲线，肌群弹层展开时平滑长高；Disclosure 展开更顺；首页与肌群详情的标题交叉淡入，详情文字随镜头浮现；计时数字滚动切换，圆环和颜色补间过渡，当前组指示条变宽。主题去掉水波纹，改为轻微高亮；关于页改用 Cupertino 过渡。
- 场景：`player.glideTo` 让镜头在打开、切换、关闭肌群详情以及舞台尺寸变化时平滑移动（easeInOutCubic，640ms），用户一拖动就中断；切换托马斯和人台时画布淡入；minimap 浮现。同样遵循 prefers-reduced-motion。
- 验证：`dart analyze lib test test_screens` 无问题；`flutter test --no-pub` 52/52 通过（新增 `test/ui/motion_test.dart`：推入、返回、模态、状态保留、减弱动态效果；`flow_regressions_test` 在计时模态落定后再点击）；`shots_test` 7/7 通过，静止画面与之前一致；`flutter build web --release` 成功；`scene npm run build && npm run verify` 通过。
- 待真机：iOS WebView 上的推入帧率、镜头滑动的观感。

## 2026-10-09 交互打磨（PR #5）

- 摸排表：`docs/interaction-audit-2026-10-09.md`（33 项：P0 2、P1 14、P2 17；已修 27，保留 4，待真机 2）。
- 提交：`d9625e0` 左缘滑动返回 / 触感词汇 / 图片淡入 / 时间轴刻度；`b7e904b` 计时中途关闭先确认、计时触感、完成收尾；`5947c1f` 全局按下态、防双开弹层、3D 载入占位与失败态、等宽数字；`e8c6258` 滚动细线、弹性滚动、学习路径折叠、训练库撤销与搜索、训练详情固定页头；其后文档与截图提交。
- `dart analyze lib test test_screens`：无问题。
- `flutter test --no-pub`：59/59 通过（原 52 + 新 7：`motion_test` 左缘返回跟手/回弹、非边缘不触发；`timer_pause_ui_test` 中途关闭会暂停并询问、未开始直接退出；`interaction_polish_test` 双击「更多」只开一个弹层、速度在弹层内生效、训练库左缘滑回舞台）。`path_progress_regression_test` 的未训练周点颜色断言随设计改为 `track`。
- `test_screens/shots_test.dart` 深浅两套 9/9 通过，新增 19 计时确认、20 计时完成、21 3D 载入占位；精选与前后对照：`docs/screenshots/2026-10-09-polish/`（`contact-sheet-before-after.png`）。
- `flutter build web --release --no-pub --no-web-resources-cdn` 成功（编译 63.1 秒，沙箱 Linux）。
- 场景（`scene/`）本轮未改动，未重跑 `npm run build/verify`；托马斯原服装、固定机位规则不受影响（载入占位使用原装托马斯渲染图）。
- 限制：触感强度、左缘返回与 WebView 手势的配合、动效帧率、3D 载入占位时长均需 iOS/Android 真机确认；屏幕常亮与提示音未做（需原生能力，留 M3）。

## 2026-10-09 第二轮打磨（PR #5，北京时间约 12:00–13:10）

- 摸排表：`docs/interaction-audit-2026-10-09.md`「第二轮摸排」一节（18 项：已修 14，保留 2，待真机 2；上轮保留的 A1、S1 本轮已修）。
- 提交：`e903033` 整屏主题淡化（`ThemeCrossFade` / `ThemeFadeWindow`，场景 CSS 与小地图同步）、统一动效 token、计时完成描线对勾；`ea47c7c` iOS 分段控件、自评分级选择、训练详情出血大图与收起导航条、状态栏样式、对比度、图标统一、语义标题、存储错误提示；其后一提交为空态统一与本文档、截图。
- `dart analyze lib test test_screens`：无问题。
- `flutter test --no-pub`（已去除代理变量）：68/68 通过（上轮 59 + 新 9：`theme_fade_test` 4 项——淡化过程与透明度曲线、淡化中再切从当前画面接续、3D 窗口留窗与下层补底、减弱动态效果瞬切；`polish_round2_test` 5 项——分段控件点选 / 拖动松手提交 / 互斥语义、训练详情出血与磨砂导航条、320×640 字号 ×1.3 深浅两套 5 个页面无溢出、空记录单句语义）。`flow_regressions_test` 的外观切换用例改为断言整屏淡化与场景 `duration`，自评用例改为分段选择，「更多」弹层用例改为 `FlareSegmented`。
- `test_screens/shots_test.dart` 深浅两套各 11/11 通过（新增 iPhone 安全区、22a/b/c 主题切换前 / 半程 / 后、23 空记录）。改前截图用 `polish-pass` 标签在独立 worktree 以同一脚本重拍。精选与对照：`docs/screenshots/2026-10-09-polish-r2/`（`contact-sheet-before-after.png`）。逐张目检：无文字截断、溢出或同色贴底；半程截图确为两帧均匀交叉。
- 场景：`cd scene && npm run build && npm run verify` 两次（主题过渡、浅色外壳对比度）均通过；`scene/tools/evidence/v41-verify.json` 浮点噪声已 `git checkout` 还原。托马斯原服装、脸与材质未动，托马斯姿态详情固定机位未动；未接触正式循环、阶段 1 快照、导出与个人数据，未新增任何肌电数据。
- `flutter build web --release --no-pub --no-web-resources-cdn` 成功（编译 63.7 秒，沙箱 Linux）。沙箱无浏览器，未在 Web 运行时实测淡化。
- 每次提交前还原 `analysis_options.yaml`、`pubspec.lock`（沙箱 pub 缓存重建后 `flutter pub get` 会改写二者），未提交 `build/`。
- 限制 / 待真机：`toImageSync` 截帧在 Web(CanvasKit)、iOS WKWebView、Android 平台视图下的实际表现与帧耗时（失败会回退瞬切）；状态栏图标颜色；分段控件拖动与系统边缘手势配合；上轮遗留的触感、帧率、屏幕常亮。


## 2026-10-09 真机反馈修复（device-feedback）
- `dart analyze lib test test_screens`：无问题
- `flutter test --no-pub`：69/69 通过（新增肌群知识文案测试；流程测试改为先选训练场景）
- 截图 shots_test 深浅各 11/11 通过（新增 08b-train-scene）
- `npm run build && npm run verify` 通过；`node tools/verify-detail-transitions.mjs` 通过（新增弧线过渡断言）
- 加载动画分帧以 @napi-rs/canvas 离屏渲染核对（沙箱无 Chromium）
- 台账：docs/device-feedback-2026-10-09.md


## 保留的 iOS 独立分支验证历史（未替代 L43 验证）

2026-10-12 iOS/L43整合在Windows执行Dart分析及49项定向范围，14语与JSON/plist/源码一致性检查通过；原有短横屏详情缺口仍可复现。初次阶段宽度回归已修复，13项布局/14语范围复测通过。当前来源、命令、历史基线对照及Mac/iPhone未执行限制见 [本轮iOS整合审核](ios-main-integration-audit-2026-10-12.md)。

随后独立审查补修首次后台挂载边界：可播放状态从当前lifecycleState初始化，新增paused时首次mount→ready仍无play/hidden测试，原3项恢复加新增1项全部通过（累计范围50项），未重复全49项；具体测试机制和命令见本轮审核末节。

# iOS v1 本地验证（2026-10-10）

专用分支 `ios/main` 基于 PR #8，当前产品源 `7ffa5e6c1d06ef78ee7ff537a3b18b3389793726`，S4 `1.0.0 (3)`；关于页旧开发版本及过期授权提示已清理，署名和许可保留。10 项相关 UI 测试、analyze、归档/导出、严格验签、证书/描述文件及 Apple 验证通过；249 份运行资源与四份隐私清单和 S3 一致，28 种源码图标的字形齐全。同源 Debug Simulator Build 3 关于页原生复查通过，偏好保留；它不等于签名 IPA 或真机执行。精确 S4 IPA 获授权后已上传，上传后哈希不变，Apple 处理为 VALID / APP_STORE_ELIGIBLE；商店草稿重新加载为 Build 3，原单账号内部组的 S4 为 IN_BETA_TESTING、自动分发关闭，S2 历史构建保留。初始截图、系统减弱动效与 S2/S3 历史证据分别保留，未重跑整套原生流程。

iPhone 13 生产入口人工验证了 30 次详情往返、3 组左右各 20 秒训练完成、实际后台 94.3 秒暂停及冷重启记录保留；同一调试进程持续 24 分 18 秒。加载层保存点 `3a85bd9` 在 Pro 模拟器两次实际 WebContent 中断恢复/重试通过（1422ms，33 次状态确认）；平台恢复代码随后未改变。最终产品另通过系统 Reduce Motion 开启时的真实首启/主题/详情/计时/原生存储验证，Flutter 与 WKWebView 均读取到该偏好，加载图标静止。该场景加载窗口记录 5 个资源、外部来源为零，不是完整抓包或飞行模式验收。最终未签名 arm64 Archive C03 绑定 `83f0920`，215,768,913 字节；本机 `candidate/candidate-manifest-r3.json` 记录身份与校验。

用户授权注册、签名与普通推送后，Apple 门户和 App Store Connect 的 `dev.mhgd.flare` 已核对。随后用户批准精确 S1 上传与商店草稿保存；S1 被 Apple 上传前验证以生成脚本未签名（90035）拒绝，未上传。修复后 S2 为 `dev.mhgd.flare / 1.0.0 (1)`，50,642,770 字节，SHA-256 `87d58c73f058ab6ef5f4fd4030af4b602bea65c93971c69db9978774cd40129f`；严格验签、描述文件/证书、三个 arm64 执行文件和四份隐私清单通过，Apple 验证退出 0。商店版本、中文文案、分类、支持/隐私网址和 10 张截图已保存，服务器截图状态全部 COMPLETE、顺序/校验和一致；用户另行批准 S2 精确文件后已通过 `altool --upload-package` 上传，退出 0；按回执查询 Apple Build 1 为 VALID。随后按单独授权创建“Flare iOS v1”内部组，关闭自动分发，仅添加指定的一名现有团队账号及 S2 构建；重新加载后构建“正在测试”、账号“已邀请”，60 字测试说明与本地草稿一致。本机 `testflight-internal-s2-20261010.json`、`candidate/candidate-manifest-s2.json` 及 `app-store-draft-saved-20261010.json` 留证。

新增授权的 S2 商店绑定、无需登录、审核说明、复用版权与联系人、手动发布、免费/全部 175 个地区供应以及关闭 Mac/Vision Pro 商店供应已保存；服务端确认 175 个地区价格均为零、供应全开、预购关闭，两项平台供应标志均为 false。用户已确认训练图与品牌图发布权。公开隐私页的本地存储、备份和 iOS 删除措辞已按单独授权[完成修订](privacy-policy-ios-v1-draft.md)：现有 Worker 的生产模块与批准的 3,060 字节补丁一致，公开 HTTP 200 的 HTML 哈希与完整预览一致，既有联系段落及配置保留。

这些是本机软件/模拟器、静态验包及 Apple 平台状态证据；锁屏返回因 Simulator 持续黑屏未完成，邀请接受与真实 TestFlight 安装尚未确认；用户要求等其回来连接 iPhone 后继续，真机手势/性能/触感、飞行模式、旧 iOS、最终合规及 App Review 仍待验证或授权。具体命令、缺陷回归、设备、截图与候选身份见 [iOS 验证记录](ios-verification-2026-10-10.md)，任务逐项结果见 [iOS 执行台账](ios-plan-2026-10-09.md)，商店保存事实与最终门禁见 [商店材料](ios-app-store-v1.md)。原网页和 Play 包保留；以下为原 Android/Web 交付及历史验证。

---
