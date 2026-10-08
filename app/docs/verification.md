# 本轮验证记录

2026-10-08。本记录对应当前Flutter App、极简首页及用户确认的双模型详情。包内历史测试和根目录旧网页的验证不代替本轮结果。视觉验收见仓库根 [design-qa.md](../../design-qa.md)。

## 本地检查与构建

| 检查 | 实际结果与范围 |
| --- | --- |
| Flutter静态分析 | 最终双模型/生命周期改动后 `flutter analyze --no-pub` 无问题 |
| Flutter测试 | 此前完整36项通过；本轮 `flutter test --no-pub --concurrency=1 test/platform/scene_controller_test.dart test/ui/flow_regressions_test.dart` 的14项全部通过，包含实际点击小卡片、同帧/选区/训练返回、320/390布局及生命周期回归 |
| Flutter Web | `flutter build web --release --no-pub --no-web-resources-cdn --no-wasm-dry-run` 成功；最终构建包含相机随窗口尺寸重新取景修复，渲染资源随包提供 |
| Android ARM64 | `flutter build apk --release --no-pub --target-platform android-arm64` 成功，最终文件35,942,742字节（Flutter输出34.3MB），20:30:43生成；采用本地开发签名，未作为商店发布包验收 |
| 场景构建 | `app/scene` 的 `npm run build` 成功，14个运行文件共4,112,683字节；无CDN依赖 |
| 动作与模型校验 | `npm run verify` 成功，实际找到源参照；21个源文件哈希一致，181个姿态对照结果见下文 |
| 默认循环构图 | `node tools/verify-framing.mjs` 成功；390×650场景、每0.05秒一个姿态，每8个蒙皮顶点取样，不是遍历每个顶点 |
| 原网页 | 根目录 `npm run build` 成功并生成 `dist`；原网页代码与原始动作导出保留 |

最终安卓试用包：`app/build/app/outputs/flutter-apk/app-release.apk`。SHA-256：`96c3406de3934a13cf37a64b9439f4c0eef51bd97461f5b33b9fc094afc8fc6b`。此前的 `app-debug.apk` 是模拟器检查产物，不是当前交付包。

第一次最终Web构建曾因PowerShell宿主内存异常中止；改用系统Windows PowerShell重新执行后成功。先前Wasm干运行已成功，本次最终构建跳过重复干运行。最终构建成功是包生成证据，不代表原生3D或真机性能已通过。

## 动作和资产

直接生成证据为 `app/scene/tools/evidence/model-verify.json`：`referenceAvailable: true`，每0.05秒与包内v33原版对照，共181个姿态，关节最大差0 mm，四元数最大角差约5.96×10⁻⁸ rad，播放节奏与子步骤时钟差均为0。直腿最小176.234°，支撑肘最小178.288°，自由肘最小179.926°，循环骨长最大浮点差约3.89×10⁻¹⁶ m。

无损检查对照了3,572,742个模型属性值，保留顶点、蒙皮、骨骼与三角形绕序；44,792个三角形仅有等价循环索引旋转。Snow从7,508,016字节压缩为2,390,231字节，人台从1,338,688字节压缩为863,833字节。未减面或量化，不能据此宣称移动端帧率改善。源/输出哈希及复现命令见 `app/scene/tools/model-optimization.json`。

默认固定机位的投影抽样边界为x=7.410–369.330、y=54.827–357.334，落在390×650场景内。该结果见 `framing-verify.json`；它说明已检查的181个姿态和每8顶点抽样不越界。实际浏览器同时确认了全循环和小屏人物构图。机位保持固定，用户开始旋转后保留手动镜头；默认状态窗口缩放会重新取景。

`browser-check.json` 保留的是早期390×380宿主检查，`home-contract-check.json` 保留的是早期接口检查；它们不是最终首页截图或全部M2人工命中表。

## 浏览器直接验证

本轮双模型详情由代理亲自在同一Codex内置浏览器操作。默认大画面为托马斯白膜，小卡片为直立肌群人体；整块86×108小卡片是唯一模型切换入口，没有顶部segment。白膜没有额外肌群沟槽、边界或深层斜线；直立人体保留细分界线。两种模式均真实渲染，源数据和原网格没有替换。

曾实际复现“文字切了、模型不更新”：拖动3D后，宿主将仍可见的场景置为 `visible:false/running:false`。现在Web场景按自身document visibility停启，Flutter导航仍关闭离屏场景；原生生命周期继续管理后台停止。小卡片在宿主层接收点击并恢复可见渲染，场景内按钮保留直接预览回退。最终重走同一拖动路径后，`visible:true/running:true`，模型与视角都实际变化；两次交换及返回首页始终为阶段11、2.0秒、三角肌。证据为 `output/design-qa/20261008/dual-model/browser-check-final.json`。此前包含故障的 `browser-check.json` 仅作为修复过程记录。

当前最终截图为同目录 `detail-motion.png`、`detail-muscles.png`、`models-final.png`；同输入视觉对照 `compare-request.png` 已实际打开检查。320×700的两种模型也实际操作并截图。旋转后交换、从肌群模型进入对应训练再返回均保持时刻/肌群/模型；本轮未为检查新增训练完成记录。最终控制台0 error、0 warn。每次实现后的首次交互复核由代理完成，不交给用户代测。

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
