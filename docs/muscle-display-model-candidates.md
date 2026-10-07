# 肌群浮层人体：现成网格重新选型

核查日期：2026-10-07。用户认为当前解剖体表改造的人体不够精致、光滑，要求寻找类似健身 App 的成熟人体模型。目标是肌群浮层中的完整人体参考，不替换已验收的 Snow 托马斯动作人物，不调整姿态或轨迹。预算保持为零。

以下是选型时的历史记录。同日后续已采用官方 Realistic male，完成深蓝短裤、低细节人偶脸与肌群功能区域，并接入默认浮窗；Adam 未下载。当前事实、最终 GLB 与复现以 [anatomy-assets.md](anatomy-assets.md)、[friendly-coach.md](friendly-coach.md) 和 [项目交接](handoff-2026-10-07.md) 为准，不把下文“尚未适配”的阶段描述当作当前状态。

## 实际核查范围

查原作者或官方来源，区分现成完整人体网格、需要继续建模的底模、只用于参考的商品渲染。许可允许免费产品使用是必要条件；图片漂亮不等于已经取得可用模型。

### 外观优先候选：rreallCakes 的 Adam

- [原作者 FREE Human Basemesh Pack](https://www.artstation.com/marketplace/p/3N1q5/free-human-basemesh-pack)提供 Adam 男性与 Adona 女性。已实际查看作者男性四视图：完整头、手足，健壮但完整的皮肤表面，清楚的胸肩、腹背与腿部轮廓，有内裤；比当前 atlas 体表更接近参考图 A。源图是作者模型预览，不是本项目的新模型或生成图。
- 商品当前为免费 Extended Commercial License，作者明确允许商用，禁止原模型在素材市场单独转卖；[ArtStation 官方协议](https://www.artstation.com/marketplace-product-eula)列出用于作品中的修改与分发范围。不是 CC0，应保留本商品的许可记录，不把原文件作为公共模型下载包再分发。
- 作者称约 10k 四边面；文件列表真实列出 `Adam.blend`（93 MB）、`Adam_lowres.obj`（52 MB）、`Adam_highres.obj`（76 MB）、`Adam.ztl`（12 MB）。三维文件尚未取得，拓扑数量、UV、骨骼以及 GLB 实际效果均不能视为已实测。
- 仍需运动短裤、面部简化、材质及高亮色区的产品适配。它没有声明独立医学肌肉层，不可声称与 BodyParts3D 自动精确配准。

### Blender 官方 Human Base Meshes v1.4.1

- [官方 Demo Files](https://www.blender.org/download/demo-files/)当前直接列出 Human Base Meshes v1.4.1、49 MB、CC0、Blender 4.2 LTS+。网页于本次在浏览器实际打开核对，证据为 `output/model-candidates-20261007/blender-official-page.png`。
- [CC0 许可](https://creativecommons.org/publicdomain/zero/1.0/)允许复制、修改、分发及商业使用。无需采购、订阅或生成服务。
- 原始完整 ZIP 与解包 `.blend` 已在 `assets/blender-studio-source/`，来源见 [SOURCE.md](../assets/blender-studio-source/SOURCE.md)。本次不覆盖源文件。
- `GEO-body_male_realistic` 是既有完整男性网格，10,582 个基础顶点、10,590 个面，含原作者 Multires；同组有原配眼睛。`GEO-body_male_stylized` 为完整卡通男性网格，12,502 顶点、12,500 面，亦有原配眼睛。
- 两者不是医学肌群模型，也没有本次核查到的动作骨骼或蒙皮权重。静态浮层人体不依赖动作绑定，显示身体部位可用；真实 BodyParts3D 肌肉不能自动精确配准到这套人物上。后续高亮必须明确是该身体上的肌群区域示意。

本次独立实物验证保存在 `output/model-candidates-20261007/`，没有改正式场景的引用：

- `realistic-front.png`、`realistic-threequarter.png`：直接从原模型真实渲染，上半身与完整头部。白色预览材质；使用原作者已有 Multires，未塑形。Stylized 对比图表明其比例偏年轻，原低模平面感也较明显。
- `blender-male-realistic-preview.glb`：原作者 L3 细分，完整身体与源双眼，3 网格，1,357,056 三角面，41,238,840 bytes。高精度候选较重，不作为未经优化的正式网页默认资产。
- `blender-male-realistic-l1-preview.glb`：原作者 L1 细分，保留完整头手脚及双眼，3 网格，86,856 三角面，3,293,540 bytes。Three.js 实际读取通过；无骨架或动画。这是轻量候选，尚未核对浏览器最终布光外观。
- `blender-human-base-review.json`：原源 ZIP / blend 前后 SHA256 一致、原网格未改、两种细分 GLB 真实加载检查及范围说明。

原裸体底模的图片以镜头裁切避开私密部位，候选 GLB 保留完整源身体。运动短裤尚未制作，不能称为已完成的服装人体。本次正式三份动作资料的 SHA256 与之前验收值一致。

### 其他已实际看到的免费候选

| 原作者来源 | 许可核查 | 本次实物判断 |
| --- | --- | --- |
| [Redninjamp：Stylized Male Base Mesh – Quad & Tri Topology](https://sketchfab.com/3d-models/stylized-male-base-mesh-quad-tri-topology-2a6ce1dafe37471ea2b3d7aeef043af6) | 页面 CC BY 4.0。作者文字称可商用、无需署名，但本项目按明确 CC BY 保留署名 | 实际 3D 预览是光滑健壮无脸白模，两种拓扑版本均缺膝下部分，不能作为完整人体首选；未下载文件 |
| [Yusuf Epik：FREE Low Poly Male Body Base Mesh](https://www.artstation.com/marketplace/p/ryNN7/free-low-poly-male-body-base-mesh) | 作者明确 CC0；平台免费 Extended Commercial，提供 FBX/OBJ，RAR 5.3 MB | 实际作者预览为明显棱角化低多边形完整人体，不能直接满足用户此次的精致光滑要求；未下载文件 |
| [ART_LOLL：Muscular mMan](https://sketchfab.com/3d-models/muscular-mman-f61451f603ca4e79b70608df69ed4b1c) | 作者页面 CC BY 4.0，有免费下载入口 | 实际 3D 预览有绿色短裤和完整卡通身体，肌肉及面部比较夸张；未取得文件，不以宣传中的 clean topology 代替实际网格验真 |

Redninjamp 与 Yusuf 官方页面截图在 `output/model-candidates-20261007/`。筛选没有购买或申请账号，没有修改当前应用引用或正式动作资料。

## 采用边界

### 备选：MPFB / MakeHuman

[官方创建文档](https://static.makehumancommunity.org/mpfb/docs/characters/creating.html)实际展示成熟连续男性网格，可调整 Muscle、Weight、Proportions 等体型参数。根 Agent 本次在官网打开肌肉男性原图，截图为 `output/model-candidates-20261007/mpfb-official-example.png`；示例使用最大 Muscle 与 Weight，体型明显过于壮硕，不能直接当作参考图 A 的同款成品。

[MPFB 官方许可](https://github.com/makehumancommunity/mpfb2/blob/master/LICENSE.md)将程序许可与 CC0 人体资产分开。核心网格与输出的 CC0 范围可用于产品，第三方服装、贴图等附加资产仍应逐项核对。这是基于成熟人体网格的角色工具，并非已下载即穿好短裤的成品教练；本次未安装插件或生成新人物。

外观最接近参考 A 的免费作者候选是 Adam；已经本地取得、许可最开放且可以立即验证实际文件的候选是 Blender 官方 Realistic male。按自然轮廓、细分后光滑和静态 GLB 可读性继续比较。运动短裤、面部简化和肌群区域高亮仍属于后续适配工作，不能把底模称作已经完成的产品人物。

完整的专业解剖套装、人体平台和付费教练人物的旧核查见 [ready-made-models.md](ready-made-models.md) 和 [skin-first-anatomy-options.md](skin-first-anatomy-options.md)。本轮零预算下不作为采购建议，不沿用旧价格作为当前报价。
