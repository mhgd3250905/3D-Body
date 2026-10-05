# 现成完整皮肤 + 解剖资产核查

> 历史选型记录：以下商品与平台信息仅代表 2026-10-04 的核查，未在本次文档对齐中重新查询，不是当前采购或实现建议。本项目之后确定零预算，采用免费 Snow 与独立解剖视图；当前方案见 [friendly-coach.md](friendly-coach.md)。

核查日期：2026-10-04。范围：现成人体资产和交互平台；未购买、未联系商家、未改应用代码。

目前最接近“完整皮肤默认展示、选中后解剖、整套可摆动作”的可购买本地资产是 Plasticboy Blender Rigged V9。较高医学精度的专业方案是 Zygote 整套及另购 rig。BioDigital 则是在线 Viewer / SDK 平台，不是可下载 GLB 的替代品。三者均未提供可直接套用的 Flare 动画。

## 1. Plasticboy — 完整皮肤与全部解剖系统已绑定的本地套装

- [BLENDER RIGGED Complete Male Anatomy PACK V9 2025](https://plasticboyanatomy.com/collections/rigged-human-anatomy-3d-models/products/blender-rigged-complete-male-anatomy-pack-v9-2024)：核查当日官网 US$899；男女整套 US$1,799。官网声明适配 Blender 3.1+，800 多个独立医学命名对象，皮肤、肌肉、骨骼等所有系统整合并绑定。另有 Maya / 3ds Max 版。
- 肉眼查看了[官方完整皮肤原图（No Genitals）](https://plasticboyanatomy.com/cdn/shop/files/Plasticboy-Male-Skin-System-Front-No-Genitals_1024x1024@2x.jpg?v=1741699149)：有头发、自然肤色、正常健壮比例和连续完整外观；该预览未穿运动短裤。
- [FAQ](https://plasticboyanatomy.com/pages/faq) 说明 rig 是支持简单姿态的 basic rig；V9 不含呼吸、心跳功能。其解剖定位为入门讲解，制作未受医学专家指导，不应包装成临床级精度。官网允许申请测试 sample。
- [授权](https://plasticboyanatomy.com/pages/license)：永久 royalty-free，明确包含软件、web、移动应用使用；不允许用户提取、分发独立模型，raw 文件许可限单一地理地点。不要把资产放进公开源码仓库。
- Three.js 接入属于技术可行性推断：已有 Blender 原生文件可转换 GLB，但商店没有承诺即用 GLB。需用 sample 验证导出后的蒙皮、每块肌肉分离、纹理与关节极端姿态；Flare 需制作或重定向动作，原 rig 和新动作是不同交付项。

## 2. Zygote — 更专业、价格需询价的本地解剖资产

- [3D Male Anatomy Collection](https://www.zygote.com/poly-models/3d-human-collections/3d-male-anatomy-collection)：有 skin、muscular、skeletal 等配准系统；官网列可下载 Max / OBJ / Cinema 4D / Maya，支持 WebGL、VR/AR 和游戏引擎。完整收藏价格为销售询价，男性 rig 是另购 Maya 选项，纹理也可能需升级。
- [肌肉系统](https://www.zygote.com/poly-models/3d-male-systems/3d-male-muscular-system) 明确每块肌肉单独分组，含深层肌肉。单买肌肉 US$6,560，原始系统页标记未绑定；不能把该价格当整套 rig 套装价格。
- [皮肤系统](https://www.zygote.com/poly-models/3d-male-systems/3d-male-integumentary-system) 单买 US$690。肉眼查看的[官方皮肤图](https://www.zygote.com/assets/img/products/poly-models/v360/3d-male-integumentary-system-00.jpg) 有自然肤色、毛孔与正常比例，面孔中性，适合友善外观参考。
- [官方 rig 视频](https://www.youtube.com/watch?v=VqC52ZxYDi4) 展示皮肤与内部解剖的人体动作。它与免费 ZygoteBody 在线查看器、未绑定单系统产品是不同商品。
- [官网授权说明](https://www.zygote.com/terms) 指定使用随产品或合同附带的许可；公开网站可分发模型的具体条款需要计入销售报价。不是 CC 模型。转成 GLB 的路线与 Flare 极端动作兼容性尚未获得样本实测。

## 3. BioDigital — 已有皮肤/解剖交互的在线平台

- [官方 Business 计划](https://pricing.biodigital.com/business.html) 包含完整男女解剖、Human Studio、Web API 和移动 SDK；Startup / Premium / Enterprise 均销售询价，无公开美元固定价。
- [发布说明](https://support.biodigital.com/hc/en-us/articles/225773768-Publish-a-3D-model) 明确“export”是将内容包装为 Human Viewer 的 iframe 或链接，限 Schools / Business 方案。它没有承诺可下载 GLB 并放入本地 Three.js 场景。
- [官方视频演示](https://support.biodigital.com/hc/en-us/articles/4941460265367-Video-How-to-use-3D-models-for-patient-education) 在 03:10 示范隐藏/淡出、03:19 显露内部、03:28 更改皮肤色调与透明度。此视频针对带 Point of Care 附加项的特定 Business 方案，不能把其中全部功能宣称为免费基础权限。
- 可用于完整外观到局部解剖的现成平台体验；要给外层 Flare 页面调用解剖选择，需其 Viewer API 与相应授权。不能默认其人体能由本项目直接摆成 Flare。

## 已核实的排除项与免费基线

### AVRcontent Animated Full Human Body Anatomy

[原作者 Sketchfab 互动预览](https://sketchfab.com/3d-models/animated-full-human-body-anatomy-9b0b079953b840bc9a13f524b60041e4) 已在 Edge 实际加载查看。Static Pose 会还原为连续完整皮肤、深灰短裤的健壮男性；Take 001 是系统拆开/还原的演示动画，肉眼未看到运动姿态。

More model information 面板明确显示：Rigged geometries: No、Morph geometries: 12、Animations: 1；所以不能凭 Animated 或 All parts detachable 将其列为现成全身骨骼绑定人体。完整肌群是否逐块独立命名也未获证实。

[同作者 Fab 商品](https://www.fab.com/listings/2a0d65fb-c7b5-4446-8fdd-80e5cbed47e0?lang=en) 的真实 UI 已核实 Personal 和 Professional 均 US$199.99、不含税，Standard License，格式 FBX / GLB / glTF / USDZ；页面最后更新 2024-10-09。购买文件未取得，不能断言商品 FBX 与预览文件每项属性完全一致。[Fab 标准许可](https://www.fab.com/eula) 允许嵌入项目商用，不允许独立转售或免费分发资产。

### Z-Anatomy

[官方 Blender 开放模型](https://github.com/Z-Anatomy/Models-of-human-anatomy) 与[公开 FBX 系统](https://github.com/LluisV/Z-Anatomy/tree/PC-Version/Resources/Models/FBX) 可本地取得，CC BY-SA 4.0。有独立肌肉、骨骼以及 Regions of human body 表面分区；尚未核实一套自然贴图、连续完整皮肤与共用动作 rig。不要为满足新的外观要求再次自行造皮肤或自动绑定身体。
