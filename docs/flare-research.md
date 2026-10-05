# Flare：动作难题、发力肌群与专项训练

研究整理日期：2026-10-04；当前应用说明对齐于 2026-10-05，未重新开展外部研究。这里的 Flare 指 breaking 的地面开腿全旋（托马斯），不是 Airflare。训练优先解决掌根承重、主动推地、左右移重与回撑、直腿压缩、主动开髋和接圈。所有练习可在地面用自重开始，无需购买器械。

目前没有证据能证明下面某个练习或整套方案对所有人“最好”。这里的优选依据是**功能与动作难题匹配直接、可降阶、可以接回真实动作**。肌群关联主要是解剖与任务推断；颜色不代表实测肌电百分比。

## 可以直接用于界面的说明

Flare 需要手掌与上肢承重、肩带主动推地、肩与骨盆移重、双腿开立扫圈相互配合。缺哪个环节，就先练能解决那个环节的降阶动作。更大开度、更高踢腿或更快拍地，不能单独替代换手与摆髋的时机。

“针对哪个动作问题”使用 `addresses`，“关键提示”使用 `keyCue`。每个肌群与训练卡保留 `sources:[{label,url,kind}]`，其中 `coach` 是教练本人教程，`anatomy` 是解剖教材，`study` 是原始研究。这些链接用于追溯依据，不表示该研究已经验证本卡片的训练疗效。

## 八个肌群与具体动作难题

以下是界面功能分组，不能当成 Flare 肌电排名。肌肉的解剖作用与此处的动作关联应分开理解。

| id | 解剖重点 | 要解决的动作问题 | 优先练习 |
| --- | --- | --- | --- |
| shoulders | 三角肌、肩袖 | 单手移重塌肩；后方回撑接不住 | 左右移重轻手、后撑抬腿回撑 |
| scapular | 前锯肌、斜方肌（含下束） | 肘还直着，胸廓与髋却向地面掉 | 直臂肩胛推地、移重后保持支撑 |
| arms | 肱三头肌、前臂屈伸肌、手部肌 | 掌根承重不适；伸肘、控腕与落手失控 | 掌根前侧移重、轻手触点、受控回撑 |
| chest | 胸大肌、胸小肌 | 前撑转侧撑时，上臂与胸廓方向配合不好 | 脚辅助移重、侧撑转髋 |
| core | 腹斜肌、竖脊肌及其他躯干肌 | 肩与骨盆卡住；换手掉髋或靠塌腰甩身 | 脚辅助侧撑转髋、压缩抬腿、分段连接 |
| hipFlexors | 髂腰肌、股直肌；股四头肌协助伸膝 | 前方过腿擦地；只能屈膝缩腿 | 坐姿直腿压缩、后撑单腿抬起 |
| glutes | 臀大、中、小肌与髋旋转肌 | 离地后合腿；后方扫腿时骨盆跟不上 | 主动开腿、分段扫弧、肩髋转动 |
| adductors | 髋内收肌；腘绳肌为后侧独立子区 | 被动开度大但开合失控；扫腿回收时屈膝 | 主动开合、直腿压缩、脚辅助扫弧 |

肩带、伸肘与前臂/手部的功能依据见 [OpenStax 11.5](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs)。主动推地并不等于把肩全程向下压；肩胛需随手臂与胸廓的关系调整。Pontillo 等在一般上肢承重任务中记录了前锯肌、上下斜方肌、肩袖、三角肌、胸大肌和肱三头肌，能支持肩带协同参与，不能建立地面 Flare 排名。[原始研究摘要](https://pubmed.ncbi.nlm.nih.gov/21522206/)

腹斜肌参与旋转与侧向控制，竖脊肌控制脊柱伸展及躯干位置；这些功能支持肩髋协调的教学推断。[OpenStax 11.4](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax)、[OpenStax 11.3](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back)

髂腰肌参与屈髋，股直肌协助屈髋与伸膝；臀肌、内收肌与腘绳肌是不同功能群。内收肌不能被写成“负责外展”，腘绳肌也不能被标成内收肌。主动开合、伸膝与扫腿的结合属于练习设计，不是教材给出的 Flare 专项处方。[OpenStax 11.6](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs)

**当前资产缺少腹直肌、腹内斜肌、腹横肌、背阔肌和腰方肌独立网格；它们仍参与躯干或肩部控制。** 这是源资产覆盖范围的限制，不能用其他肌肉冒充缺少的网格，也不能把未显示理解为不重要。股四头肌其余结构可直接点选，协助保持伸膝和长腿形态。

## 八个训练卡：按卡住的位置选择

下表与 `src/data.js` 的 8 个既有 ID 一致。练习顺序是学习路径参考，实际选择由当前难题决定；不会要求练满固定次数或周数。

| 顺序 / id | 练习 | 具体任务与降阶 | 进阶时观察什么 |
| --- | --- | --- | --- |
| 1 / wristLoad | 掌根承重 · 前侧移重 | 双手、双膝着地，做小幅前后和左右移重；调整手指方向前先卸载 | 掌根舒适，肘腕受控，再加位移与掌上重量 |
| 2 / scapPush | 直臂推地 · 肩胛短停 | 跪姿前撑，肘直，肩胛前伸推地、短停、受控返回 | 能维持支撑空间，再进入脚辅助前撑和移重 |
| 3 / supportShift | 左右移重 · 轻手触点 | 脚或膝留地；先移重，空手变轻、离地、轻触原落点 | 两侧卸载与回撑都平稳，再接转髋 |
| 4 / rearSupport | 后撑抬腿 · 换手回撑 | 双脚辅助后撑，单腿伸长抬起；再练踢起—换腿—落脚 | 肩后伸舒适、髋有空间，落手受控，再接后半圈 |
| 5 / trunkControl | 脚辅助侧撑转髋 | 前撑→侧撑→前撑，脚分担重量，胸廓与骨盆协调转动 | 双侧转入、回撑和转回都顺畅，再接扫腿 |
| 6 / compression | 坐姿直腿压缩抬腿 | 舒适开腿，单腿小幅主动抬起、放下；随后双腿 | 膝伸展、躯干受控，不靠猛后仰或屈膝甩腿 |
| 7 / hipControl | 主动开腿 · 分段扫腿 | 主动开合可用侧卧降阶；再以手和一脚辅助，另一长腿扫小弧 | 可控制开合与两侧扫弧，再扩大弧度、减少帮助 |
| 8 / flareSegments | 分段半圈 · 接入下一圈 | 脚辅助前→侧→后，再后→另一侧→前；单独练卡住的落手 | 单圈移重、过腿、回撑都受控，再从前撑接下一圈 |

练习 1–7 是针对动作需求的辅助设计，练习 8 将能力接回技能。科学研究没有直接比较这 8 项的 Flare 学习效果。跪姿、脚辅助、主动抬腿和分段方法的选择，来自可减小承重、保留动作路径与控制难度的教学判断。

VincaniTV 的本人教程包含高低腿交替、脚辅助后侧练习及半圈连接，适合对照专项顺序；Chiki Skills 提供另一套分步地面 Flare 示范及英文字幕。请把教练示范作为动作参考，不把其个人角度推广成所有人的标准。[VincaniTV 地面 Flare 教程](https://www.youtube.com/watch?v=Sz5rd22PCSI)、[Chiki Skills 分步教程](https://www.youtube.com/watch?v=2fFBaFV9Ugk)

## 手指、膝与脚尖：给摆腿留空间

手掌是移动身体的支点，手指朝向应配合旋向、落手阶段、肩腕范围与教练采用的方法。前向、侧向或外后向都不应被硬编码成每个阶段相同的 90° 角。先在低负荷下摆好掌面，再练移重；不要在掌根承重时硬拧腕。VincaniTV 约 0:50–1:00 的入势直接示范转外与外侧落掌，不能把这一个入势当作全圈两手通用角度。[原作者示范](https://www.youtube.com/watch?v=Sz5rd22PCSI)

扫腿尽量保持长腿路径，由髋的开合与旋转带动膝和脚尖协调转向。膝伸展与踝绷脚是两件事：练体操式线条可以选择绷脚；本项目的 breaking 示意允许较自然的延长脚型，不要求全程极端跖屈。VincaniTV 的画面也没有全程使用同一极端绷脚姿态。不能靠只扭脚尖制造髋外展，也不把脚尖固定朝天当成全圈标准。[髋、膝与踝的解剖功能](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs)、[原作者示范](https://www.youtube.com/watch?v=Sz5rd22PCSI)

VincaniTV 的可对照时间点（区间为教学检视定位，并非动作测量）：

| 时间 | 原教程关注点 | 对应练习 / 模型约束 |
| --- | --- | --- |
| 0:50–1:00 | 手指转外、左手向身体外侧落掌 | 先确认旋向与入势；掌面接地，手指方向不统一硬锁 |
| 1:10 左右 | 单手支撑下的高低腿 | 两腿保留长腿形态与明显高度差；不把角度写成标准值 |
| 1:24–1:40 | 上腿下扫、另一腿上抬，换到右手 | 先移重、再离手；扫腿与另一手回撑衔接 |
| 1:47–2:33 | 脚辅助后侧 kick–switch–down | rearSupport：踢起、换腿、落脚，再接后半圈 |
| 3:05–3:35 | 前半圈与后半圈分练 | flareSegments：先找卡住的换手与过腿段 |
| 3:36–3:49 | 用髋部运动连接旋回 | trunkControl / flareSegments：肩与骨盆配合，不只猛踢腿 |

上述时间点是在研究阶段由主 Agent 查看原作者页面、画面与公开字幕核对的记录；此次文档对齐未重查视频。教程中的左右手、模型的支撑手和关节名称均指人物本人。正式步骤的“左侧 / 右侧”沿用用户确认的阶段命名，不能据此推断哪只手支撑；应查看保存的手固定状态与动作说明。视频观察不是逐关节角度采样。

## 四阶段与模型的证据边界

当前正式展示以用户保存的原第 09 步后双撑开始，依次经过第一侧单手、原第 13 步前双撑、第二侧单手，再回到原第 09 步。它保留这四类支撑；前后半圈分练有助于找到换手问题，完整 Flare 仍然是连续的摆腿和移重，不需在每一步停成静态姿势。

Prassas 等（2009）用两位熟练体操运动员的地面与鞍马视频分析支撑时序，四类支撑的时间并不相等。样本不能确定所有 breakers 的固定时长，也不是肌电或训练干预研究。[完整原始论文](https://ojs.ub.uni-konstanz.de/cpa/article/view/3328/3128)

Pontillo 等（2007）在 15 位健康参与者的一般上肢承重任务中测肌电和掌上压力中心变化。软垫使保持稳定更困难，却没有使肩肌活动整体提高。这不能推出购买不稳定器械更利于 Flare，也不能验证本项目的具体练习疗效。[原始研究摘要](https://pubmed.ncbi.nlm.nih.gov/21522206/)

当前正式循环来自 `托马斯/16.json`，按原步骤 **9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 9** 放置九个关键姿势，首尾为同一个原第 09 步，教学慢放周期为 9 秒。保存姿态、关键帧间插值、髋高与手足角度都是可编辑的教学选择，来源与迁移规则见 `docs/flare-pose-presets.md`。八个功能肌群和八类训练保持不变；它们的数量与姿势锚点数量无关。人物是 Snow，局部解剖参考是 BodyParts3D，二者不做虚假配准；动画没有实测全身肌电，也没有动态地面反力或关节力计算。

## 本轮保留的 8 个来源

1. **VincaniTV / Vince Horiuchi**（2011-12-09），*Learn How To Flare | Power Move Basics | Beginner Breaking Tutorial*。作者本人地面 Flare 示范；可对照入势、腿部交替、脚辅助后侧、半圈与摆髋。[原始视频](https://www.youtube.com/watch?v=Sz5rd22PCSI)
2. **Chiki Skills**（2020-04-03），*How to Flare Easily | How to Flare*。作者本人分步地面 Flare 教程，提供英文字幕；作为另一教学路径，不作为最佳疗效证据。[原始视频](https://www.youtube.com/watch?v=2fFBaFV9Ugk)
3. **Pontillo, M., Orishimo, K. F., Kremenic, I. J., McHugh, M. P., Mullaney, M. J., & Tyler, T. F.**（2007）。*Shoulder musculature activity and stabilization during upper extremity weight-bearing activities.* North American Journal of Sports Physical Therapy, 2(2), 90–96。读取原作者摘要；15 位健康参与者的一般承重实验，不是 Flare。[PubMed 原始摘要与全文入口](https://pubmed.ncbi.nlm.nih.gov/21522206/)
4. **Prassas, S., Ariel, G., & Tsarouhas, E.**（2009）。*Temporal characteristics of Thomas flairs on the pommel and floor.* ISBS，第 27 届会议。完整原始论文，2 位运动员，支撑时序与器械比较。[原始 PDF](https://ojs.ub.uni-konstanz.de/cpa/article/view/3328/3128)
5. **OpenStax, Anatomy and Physiology 2e，11.5**。肩带、上肢与手部肌肉的解剖功能。[教材原页](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs)
6. **OpenStax，同书 11.4**。腹壁及躯干肌的解剖功能。[教材原页](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax)
7. **OpenStax，同书 11.3**。背部与脊柱肌的解剖功能。[教材原页](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back)
8. **OpenStax，同书 11.6**。髋、腿与足部肌肉的解剖功能。[教材原页](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs)

正文用自己的语言整理事实与教学推断，不复制教材图表、论文全文或教练字幕。网页内容在本地可离线阅读；来源链接由用户主动打开。练习出现掌根、肩或腹股沟疼痛时停止并调整。

## 数据接口与验收

`src/data.js` 保留 `muscleGroups`、`exercises`、`phases`、`groupById`、`exerciseById`，以及原 8 个肌群和 8 个练习 ID。`researchSources` 是上述 8 条来源的扁平列表。`phases` 的功能索引仍为前撑、第一侧、后撑、第二侧，供肌群关联使用；当前时间分别为 4、2、0、6 秒，展示入口按时间排序，从后撑开始，不按功能索引推断播放顺序。

每个 group / exercise 提供 `addresses:string`、`keyCue:string` 与 `sources:Array<{label:string,url:string,kind:'coach'|'anatomy'|'study'}>`。`description`、`roles`、`steps`、`progression`、`cue`、`assetGroups` 与 `extraMatch` 继续供界面使用。肌群缺网格说明保留原句。

界面不应写“最强肌群”“练满必会”“全程手指 90°”“统一脚尖朝向”，也不展示由功能推断生成的肌电百分比。`docs/flare-research.md` 与离线公开副本 `public/research.md` 内容一致。
