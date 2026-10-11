# L26版本整理与接力检查点（2026-10-11）

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

场景build/verify、ARM64 release构建及同开发证书签名通过。布局定向检查覆盖4～6点、320/390手机、横屏、边缘UI和16帧旋转，原模式回归通过。浏览器8阶段×4镜头共32视图均完整显示对应4～5个主力圆点和卡片，颜色一致、无缩放/虚化、播放收起/暂停恢复通过；真实点击卡片和圆点均上报triceps及原暂停time=0。报告`output/playwright/2026-10-11-primary-markers/result.json`。无场景错误事件，预览仅favicon 404；未截图/录屏，真机观感交用户验收。

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
