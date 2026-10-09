# 深色 / 浅色主题（2026-10-09）

- 设置 → 外观 → 主题：跟随系统（默认）/ 深色 / 浅色，存入本地设置 `themeMode`；旧数据无此字段时按跟随系统读取。
- 色板集中在 `lib/ui/theme.dart` 的 `FlarePalette.dark / .light`；`FlareColors` 读取当前色板，MaterialApp builder 按解析后的亮度切换，页面依赖 Theme，切换时不重建 3D 视图。
- 3D 场景收到 `{type: theme}` 命令，只换页面外壳（加载层、小卡底色、阶段小人体卡、热点描边）；托马斯、灯光与材质两套主题完全一致。
- 验证：`flutter analyze` 无问题；`flutter test --no-pub` 43/43 通过（新增主题切换持久化+场景命令、旧设置兼容两项）；`flutter build web` 成功；场景 `npm run build`、`npm run verify` 通过。
- 截图：`screenshots/2026-10-09/light/`（18 张浅色），深色在同目录上一级。

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
