# 现成人物模型选型

> 历史选型记录：这轮比较发生在用户确定零预算、采用免费 Snow 之前。下列建议、价格和平台信息仅代表 2026-10-04 的核查，未在本次文档对齐中重新查询；本项目没有采购。当前采用方案、免费许可与复现见 [friendly-coach.md](friendly-coach.md)。

核查日期：2026-10-04。该轮选型时用户已否决自行改造的体表展示，只查具体成品资产、实际预览、格式和授权；没有购买、下载付费文件或替换应用模型。价格均为查询当日页面标价，未计税费。

## 优先比较的三款

| 模型 | 外观与价格 | 交付与功能 | 本项目适配 |
| --- | --- | --- | --- |
| [ThreeDee Fitness Man](https://www.threedee.design/products/3d-models/fitness-man/) | 友善卡通健身教练，黑运动服；US$88 | Blender / FBX / GLB / OBJ，身体和面部 rig，预设健身姿态 | 适合默认人体和动作演示；产品没有承诺独立解剖肌群 |
| [Hisenberg Wrestler Male – Rigged](https://www.cgtrader.com/3d-models/character/man/wrestler-male-rigged) | 写实通用运动员，红黑连体服和摔跤鞋；US$14.27 | 页面标注 rig、PBR、22,886 面，FBX / GLB / Blender | 外观完整、可用骨骼摆动作；不含内部解剖肌群 |
| [Plasticboy Blender Rigged Complete Male Anatomy V9](https://plasticboyanatomy.com/collections/rigged-human-anatomy-3d-models/products/blender-rigged-complete-male-anatomy-pack-v9-2024) | 自然人体皮肤，有头发与无生殖器外观版本；US$899 | Blender 3.1+，800 多个独立医学命名对象，官网声明皮肤、肌肉、骨骼等系统整合并绑定 | 最接近同一人体局部显露肌群；需导出 GLB，并验证极端姿态的蒙皮 |

以上商品信息均来自作者或销售页面，不等于已测试购买文件。没有查到这三款附送 Flare 动作；身体 rig 与现成 Flare 动画是两件事。

### 官方视觉预览

- [ThreeDee 外观](https://www.threedee.design/assets/images/Fitness-cartoon-man/first.webp)
- [Wrestler 原作者渲染图](https://img-new.cgtrader.com/items/7409190/47b2fa70a3/wrestler-male-rigged-3d-model-47b2fa70a3.webp)
- [Plasticboy 完整皮肤](https://plasticboyanatomy.com/cdn/shop/files/Plasticboy-Male-Skin-System-Front-No-Genitals_1024x1024@2x.jpg?v=1741699149)

## 授权与取舍

[ThreeDee 许可](https://www.threedee.design/license/)允许个人与商业项目、修改，禁止独立原文件再分发。Wrestler 商品页标记 Royalty Free License (no AI)。[Plasticboy 许可](https://plasticboyanatomy.com/pages/license)列明软件、web、app 用途，并限制独立资产提取、分发和 raw 文件使用地点。将付费原资产放入公开源码仓库不属于这些商品的一般授权。

Plasticboy 的 [FAQ](https://plasticboyanatomy.com/pages/faq)说明是基础姿态 rig，并可申请测试 sample；它不是承诺任意高难运动变形的成品动作库。其原图使用渲染时细分，浏览器质量需要针对实际导出文件确认。

完整皮肤、独立解剖系统、骨骼共用和成品外观都来自同一个专业套装，是同体局部解剖最稳妥的起点。若选 ThreeDee 或 Wrestler，先用成品人物展示动作，肌群细节使用独立局部视图；不要宣称两个不同来源的身体可以自动精确叠合。

## 其他已核实候选

[ThreeDee Cartoon Sports Gym Fitness Man](https://www.threedee.design/products/3d-models/cartoon-sports-gym-fitness-man/)官网 US$62，提供 rigged GLB / FBX / Blender、37+ 姿态和健身器材，卡通肌肉体型比 Fitness Man 更夸张。未选作首要外观。

[3DDisco Strong Muscular Male](https://superhivemarket.com/products/strong-muscular-male-body-base-mesh-animated-and-rigged-3d-model-20k-polygons)官网 US$18、Royalty Free，明确 GLB 包含 rig 和六条动作（包括俯卧撑、深蹲）。实际预览是灰色裸基模，仍需要外观整理，优先级低于成品穿衣人物。

[Playflow Fitness Character Male](https://sketchfab.com/3d-models/fitness-character-male-f7f6c2b64b3c4395a66ac1665ef44441)实际预览为肤色、蓝短裤、运动鞋的人体；作者标记 rig，但当前没有下载或购买入口，且有未答复的下载询问。只作为视觉参考，不能称为已取得可用资产。

免费项核查：[Summer Beach Style Muscular Man](https://sketchfab.com/3d-models/summer-beach-style-muscular-man-19f84587d2f742788f22ad1f23c0628c)为 CC BY 4.0，FBX / GLB，但模型信息明确没有 rig；[Basic Human Male](https://sketchfab.com/3d-models/basic-human-male-598d1d1866df48f999fabadb017429d1)虽带 rig、CC BY 4.0，但无贴图、无 UV、无五官，是人偶式底模，外观不符合此次目标。免费并不足以证明成品质量与运动适配。

AVRcontent、Zygote、BioDigital 和 Z-Anatomy 的更完整分层/平台核查见 [skin-first-anatomy-options.md](skin-first-anatomy-options.md)。尤其 AVRcontent 的拆层演示使用 morph，当前 Sketchfab 信息明确 Rigged geometries: No，不能因标题 Animated 就当作现成动作人体。
