# 当前验证：PR #4 浅色训练图与最终 App（2026-10-09）

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

## 2026-10-09 动效与过渡

- `lib/ui/motion.dart`：统一动效。`FlareStage` 让壳层的状态式导航也有过渡：更深的页面从右侧推入，原页面左移并变暗；返回时反过来；计时页作为模态从底部升起；同级页面交叉淡入。两侧页面都按 key 保持挂载，状态不会丢。空页面（3D 舞台）不接收触摸。`FadeSlideIn` 负责错落入场，`Pressable` 负责按下缩放，系统开启“减弱动态效果”时全部直接切换。
- 应用位置：训练库网格按筛选错落入场；卡片和主按钮按下有回弹；筛选胶囊颜色渐变；底部弹层用统一曲线，肌群弹层展开时平滑长高；Disclosure 展开更顺；首页与肌群详情的标题交叉淡入，详情文字随镜头浮现；计时数字滚动切换，圆环和颜色补间过渡，当前组指示条变宽。主题去掉水波纹，改为轻微高亮；关于页改用 Cupertino 过渡。
- 场景：`player.glideTo` 让镜头在打开、切换、关闭肌群详情以及舞台尺寸变化时平滑移动（easeInOutCubic，640ms），用户一拖动就中断；切换托马斯和人台时画布淡入；minimap 浮现。同样遵循 prefers-reduced-motion。
- 验证：`dart analyze lib test test_screens` 无问题；`flutter test --no-pub` 52/52 通过（新增 `test/ui/motion_test.dart`：推入、返回、模态、状态保留、减弱动态效果；`flow_regressions_test` 在计时模态落定后再点击）；`shots_test` 7/7 通过，静止画面与之前一致；`flutter build web --release` 成功；`scene npm run build && npm run verify` 通过。
- 待真机：iOS WebView 上的推入帧率、镜头滑动的观感。

## 2026-10-09 交互打磨（PR #5）

- 摸排表：`docs/interaction-audit-2026-10-09.md`（33 项：P0 2、P1 17、P2 14；已修 27，保留 4，待真机 2）。
- 提交：`d9625e0` 左缘滑动返回 / 触感词汇 / 图片淡入 / 时间轴刻度；`b7e904b` 计时中途关闭先确认、计时触感、完成收尾；`5947c1f` 全局按下态、防双开弹层、3D 载入占位与失败态、等宽数字；`e8c6258` 滚动细线、弹性滚动、学习路径折叠、训练库撤销与搜索、训练详情固定页头；其后文档与截图提交。
- `dart analyze lib test test_screens`：无问题。
- `flutter test --no-pub`：59/59 通过（原 52 + 新 7：`motion_test` 左缘返回跟手/回弹、非边缘不触发；`timer_pause_ui_test` 中途关闭会暂停并询问、未开始直接退出；`interaction_polish_test` 双击「更多」只开一个弹层、速度在弹层内生效、训练库左缘滑回舞台）。`path_progress_regression_test` 的未训练周点颜色断言随设计改为 `track`。
- `test_screens/shots_test.dart` 深浅两套 9/9 通过，新增 19 计时确认、20 计时完成、21 3D 载入占位；精选与前后对照：`docs/screenshots/2026-10-09-polish/`（`contact-sheet-before-after.png`）。
- `flutter build web --release --no-pub --no-web-resources-cdn` 成功（编译 63.1 秒，沙箱 Linux）。
- 场景（`scene/`）本轮未改动，未重跑 `npm run build/verify`；托马斯原服装、固定机位规则不受影响（载入占位使用原装托马斯渲染图）。
- 限制：触感强度、左缘返回与 WebView 手势的配合、动效帧率、3D 载入占位时长均需 iOS/Android 真机确认；屏幕常亮与提示音未做（需原生能力，留 M3）。
