# 现成带骨骼人体模型：取得方式、许可与验真

> 历史选型记录：以下是 2026-10-04 对替代模型的比较与当时的验真记录，不是当前采用结论，未在本次文档对齐中重新验证外部文件或许可。当前动作人物采用官方免费 Snow，详细解剖独立展示；制作、免费许可与复现见 [friendly-coach.md](friendly-coach.md)。

核查日期：2026-10-04。目标是替换由程序基础几何拼成的人体，使用完整、连续的既有网格；肌肉解剖层仍需真实解剖资产。

## 当时的选择结论

**现成完整人体动作替代模型以 Xbot 最容易接入；许可最清楚开放的选择是 CesiumMan。** 两者均确实带蒙皮与运动骨骼，GLB 可直接由 Three.js 的 GLTFLoader 加载。Xbot 的 67 个 joints 更适合双手支撑、手腕与手指控制；CesiumMan 只有 19 个 joints。

**当时建议肌群动作页采用真实 BodyParts3D 网格绑定骨骼。** 下面三项是当时核查的已建模、已蒙皮完整人形角色，但都没有可单独选取的解剖肌肉层。不能把皮肤或衣服上的区域当成独立肌肉实体，也不能称它们为医学解剖模型。

## 三个已验证的选项

| 模型 | 可取得的模型文件 | 文件与真正 rig 的核查 | 许可与使用边界 | 对本项目的适合程度 |
| --- | --- | --- | --- | --- |
| Xbot | Three.js 官方示例的 [Xbot.glb](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Xbot.glb) | 2,930,032 bytes；2 个网格，1 个 skin，67 joints；2 个 primitive 均含 JOINTS_0 / WEIGHTS_0。骨骼有 mixamorig:Hips、Spine、LeftArm、LeftForeArm 等。带 7 个动画。 | Mixamo 素材，Adobe 官方允许用于个人、商业与非营利创作。应嵌入项目，不作为 raw 模型/动作包再分发。不能把 Three.js 的 MIT 写成这个素材本身的许可。 | 最实用的现成动作备用模型；连续人体轮廓与细骨骼。外观为人形 mannequin，缺独立肌肉层。 |
| CesiumMan | Khronos 官方样例的 [CesiumMan.glb](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF-Binary/CesiumMan.glb) | 438,044 bytes；1 个网格，1 个 skin，19 joints；primitive 含 JOINTS_0 / WEIGHTS_0。带 1 个动画。 | 官方明确 CC BY 4.0，作者 Cesium。模型上的 Cesium 标志另有商标条款，模型许可不授予标志的其他使用权。可移除标志纹理，并保留模型署名与修改说明。 | 文件极小、直接开源取得和骨骼驱动很可靠；骨骼较简单，紧身服外观，肌肉展示不足。 |
| Soldier | Three.js 官方示例的 [Soldier.glb](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb) | 2,160,468 bytes；2 个网格，2 个 skins（49 与 2 joints）；2 个 primitive 均有蒙皮属性；带 Idle、Run、TPose、Walk。主要 rig 是 Mixamo 命名。 | 官方示例明确来自 Mixamo；沿用 Adobe 的创作使用许可及 raw 文件再分发限制，不能仅标“MIT 模型”。 | 完整角色和动画已可直接加载，适合作骨骼/动画兼容检查。服装、装备妨碍肌肉观察，作为动作主角不如 Xbot 或真实解剖网格。 |

上述 GLB 均通过公开直链读取，无需 API key、服务购买或登录才能获得文件。本次只读取约 5.3 MB 的模型数据到内存检查 GLB 2.0 JSON，没有下载大型全套资产。

## 直接证据与署名

Three.js 的 [Soldier 骨骼混合动画示例](https://threejs.org/examples/webgl_animation_skinning_blending.html)明确标注模型来自 Mixamo；[官方源码](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_animation_skinning_blending.html)直接加载 Soldier.glb，创建 SkeletonHelper 与 AnimationMixer。

Three.js 的 [Xbot 累加骨骼动画示例](https://threejs.org/examples/webgl_animation_skinning_additive_blending.html)也明确标注 Mixamo 来源；[官方源码](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_animation_skinning_additive_blending.html)直接加载 Xbot.glb 并播放其骨骼动画。

Adobe 的 [Mixamo 官方 FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)说明角色与动画可免费用于个人、商业与非营利创作。[Adobe 社区的许可 FAQ](https://community.adobe.com/questions-696/mixamo-faq-licensing-royalties-ownership-eula-and-tos-589400?lang=en)进一步列出嵌入创作与 raw 文件分发的区别。若未来将应用发布为开源仓库或素材下载站，应重新核对 raw GLB 随源代码分发的安排；本地创作与嵌入用途不等于公开模型包。

CesiumMan 的 [官方 README](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CesiumMan/README.md)列出 GLB 下载、skin/animation 及 CC BY 4.0。其 [glTF 源 JSON](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf)明确包含 skin、骨骼层级、蒙皮属性与关节动画。[Cesium 标志条款](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/LICENSES/LicenseRef-LegalMark-Cesium.txt)需要与模型版权许可分别处理。

CesiumMan 可采用署名：`Cesium Man © 2017 Cesium, CC BY 4.0. Modified for this project.` 改了贴图或动画时列出相应修改。

## 没有冒充现成 rig 的相关资产

- [Blender Human Base Meshes](https://developer.blender.org/docs/release_notes/3.6/asset_bundles/)是高质量 CC0 基础人体网格；官方描述包括作为 rigging 的基础。此次没有核查到可直接驱动整个人体的已完成运动绑定，不能仅凭“Skeleton”网格名称认定已有动画 armature。
- [Z-Anatomy 官方解剖模型](https://github.com/Z-Anatomy/Models-of-human-anatomy)是最适合真实肌肉解剖的数据来源之一，CC BY-SA 4.0；当前源说明没有证实现成全身运动 rig。骨骼器官的网格与用于动画的骨骼绑定属于不同结构。
- MB-Lab 的[官方骨骼文档](https://github.com/animate1978/MB-Lab-docs/blob/master/docs/pose.rst)说明人体角色有统一 rig，能用 Blender 导出；但[官方许可](https://mb-lab-docs.readthedocs.io/en/latest/license.html)把数据库与派生模型放在 AGPL 3 下，不能误报为 CC0。因此没有把它作为当前最直接的替代。
- 第三方“Z-Anatomy rigged skeleton”商品页仅称提供已绑定的骨骼，没有完整肌肉系统，原作者链和分发权也不够清楚，此次没有以它作为已确认的全身肌肉模型。

## 集成要点

保留实际资产的连续蒙皮网格，直接驱动已有骨骼；展示人体动作时使用 GLTFLoader、SkinnedMesh 和 AnimationMixer。手工构造运动骨架不等于手工拼人体外观，只要最终变形的是既有真实网格。极端开髋、肩后伸与手支撑姿势仍需检查蒙皮扭曲和地面穿透。动作模型没有自带 Flare 动画时，应标为自行编排的教学示意。
