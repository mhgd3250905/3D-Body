# App51 独立绿幕素材 · 2026-10-14

用户确认需要将当前 App 使用的动作视频另存为绿幕版本，以便在剪辑或其他场景中去除背景。本批次仅制作独立素材，不替换 App 视频，不调整 App 版本、安装或发布状态。原媒体、94项冻结包、动作参数与个人文件保留。

## 交付与使用

目录：`E:/AII-3D/3D-Body/output/app51-greenscreen-20261014/`。打开其中 `index.html` 可离线预览、按名称或ID筛选、下载视频；整个目录可以一起搬移。高清版在 `media/master/`，便携版在 `media/mobile/`，无损PNG封面在 `media/posters/`。

范围是 App 当前实际选用的51项训练视频，共12,696帧、423.2秒，均为30fps。高清版1080×1080，H.264/yuv420p、CRF14；便携版720×720，H.264/yuv420p、CRF16。两个版本带faststart且保持原时长、动作速度及构图。封面从原App封面时刻对应的周期帧提取；瑞士球背伸采用App的1秒，而非素材包2秒封面。

背景为纯绿 `#00FF00`。在剪辑软件中选择色度抠像/绿幕去除，从空白绿色区域取色，开启“去绿色溢色 / Despill”，再检查人物边缘、手指、器械细线及青蓝肌群高亮。独立实际抠像对照中，不开启去溢色时暗底能看见少量绿色细边；这来自绿底抗锯齿和MP4色度采样，不应通过大幅扩大抠像阈值来削掉人物。MP4采用常规兼容编码，有色度采样和压缩，解码颜色允许轻微偏差，不能将每个解码像素宣称为精确RGB(0,255,0)，也不承诺无任何边缘损失。必要器械、瑜伽垫、球和支撑墙保留，这些前景不会随绿幕一起消失；本批次不另外制作仅人物版本。

## 来源与派生规则

源App清单：`app/assets/data/drill-media-manifest.json`，冻结版本来源为当前L44选用素材、L45继续沿用。50项来自 `output/training-human-v2-library-final-20261013/jobs/<id>/frames/m-????.png`；瑞士球背伸必须来自 `output/training-human-v2-erectors-B-footfix-20261013/frames/`，保留已认可鞋向及墙位置修正。

透明原始主渲染帧均为2160×2160 RGBA，包含当前已验收training-human-v2人物、原帧肌群高亮与所需道具。使用各项冻结 `composite/place.json` 的相同缩放及舍入位置，将straight-alpha前景合成到绿底。没有重新求解动作、更新骨架、改变相机、调整人物服装或用旧下载视频做自动分割。

省去原后期背景渐变、暖光、地面接触阴影、外围橙色光晕及外部高亮bloom；人物表面原渲染颜色和高亮保留。灰色服饰与青蓝高亮沿用原样，不因绿幕改变人体标准。原 `comp.py` 的带mask贴图会再次衰减alpha，本批次使用FFmpeg straight-alpha overlay，避免二次alpha导致黑边；这属于新的合成配方，不改原冻结制作代码。

`plan.json` 绑定源App清单SHA、起始源码提交与本批次配方。每项 `jobs/<id>/source.json` 记录原视频SHA、spec/theme/place/met-cycle/result哈希及逐帧主渲染PNG SHA；对应 `result.json` 保存输出探测、完整解码和SHA。`delivery-manifest.json` 汇总实际完成项；`SHA256SUMS.txt` 与 `package-manifest.json` 保存便携目录文件身份。

## 验证边界

实际51项均已完成，两种尺寸共102视频全部完整解码、规格与SHA检查通过。独立5项抽查为 `abs-A`、`erectors-B`、`forearms-A`、`obliques-C`、`rotator-cuff-C`：10个视频再次完整解码，各取首帧/封面时刻/中点/末帧比较。远离轮廓的透明背景区绿纯度100%，前景内区色差约1–2/255；实测源PNG为straight alpha，编码边缘比双alpha模型更符合单次alpha，高亮和器材细线保持。去溢色白/暗底对照另存，不宣称102视频逐帧视觉抠像验收。原始RGBA仅作为只读输入，本批次未运行3D求解。

390×844实际浏览器通过名称筛选（瑞士球1/51）、清空恢复51项、720视频播放（readyState4/error=null/时长8秒）及互斥播放；文档宽390无横向溢出，最终控制台零错误，资源请求均为本机。截图在 `output/playwright/app51-greenscreen-20261014/phone-gallery.png`，实际页面最终状态另存于批次verification。检查使用仅绑定127.0.0.1的临时服务；CLI禁止file协议，未将该限制写成普通浏览器直接打开失败，双击播放以独立相对路径/内联页面结构提供。

生产工具对每项检查源App视频及当前选版源视频哈希、raw周期帧数及30fps时间点，沿用相同周期帧；两个输出视频均核对尺寸、fps、帧数、时长并完整CPU解码。独立 `verify.py` 从实际编码视频抽样，比较透明区绿底、前景及高亮保持、抗锯齿边缘alpha，并生成去绿后白底和暗底对照。实际检查结果及抽样范围读取目录中的 `verification/` 报告，不把抽样抠像检查写成所有帧视觉验收。

原App51审核状态仍为23项ready、28项待核对。此次绿幕制作、视频完整解码及抠像检查不销项姿态QA，不代表完整设备或全部动作验收。独立素材与App L45安装/发布事实分开。

## Google Drive 备份（2026-10-14）

按用户明确要求，已上传到既有“Hark项目备份 / 3D-Body 动画项目”下的独立[App51_绿幕素材_2026-10-14目录](https://drive.google.com/drive/folders/1lgMm0HM9xg2hrppZIHk9bBOx1tcfFQ3I)。没有改变共享权限，云端元数据回读为非共享。

| 标准ZIP | 云盘文件 | 字节 | SHA256 |
| --- | --- | ---: | --- |
| 1080高清包，51视频 | [App51-Greenscreen-1080-20261014.zip](https://drive.google.com/file/d/1KoiijimUu4tDFI_ixCArZJoGwgyrdDvn/view?usp=drivesdk) | 89,314,842 | `dd7fabf8f633c55a9a2cf7c7a448f24e6c654cae6befa579aa6ce1160e2b2932` |
| 720便携包，51视频 | [App51-Greenscreen-720-20261014.zip](https://drive.google.com/file/d/1SExNnIlTz3kVmey9yvy8Xb-uJXCBpjw0/view?usp=drivesdk) | 38,212,597 | `1c5b5f41fd62764c1846f2873f688816d83d7641d2ca7174f74089aa68a28726` |

两个包均为普通ZIP，各自包含对应尺寸的51视频、51封面、对应的离线预览页、清单与证据，单独解压即可使用；不是需要拼接的分卷压缩文件。视频字节与完整批次逐项一致。打包工具为 `tools/drill-anim/greenscreen-20261014/package_drive.py`，本地分包目录为 `output/app51-greenscreen-drive-20261014/`。

原完整ZIP为120,280,962字节、SHA256 `dd36051147b8fc0d27519a9867465b308bc2fc7eb05baffd368bf1cb0822f47d`，本机保持。上传接口在实际写入前拒绝超过104,857,600字节的文件，所以原完整ZIP没有上传；以上两个标准包是本次实际云端备份。

已回读两文件名称/ID/MIME/父目录/字节大小，并通过连接器取回原始云端文件，下载到 `output/app51-greenscreen-drive-20261014/cloud-readback/`；两包下载大小和SHA256均与上传前一致。核验不依赖“上传成功”提示或仅大小比较。机器记录见[云盘备份回执](app51-greenscreen-drive-backup-2026-10-14.json)，记录不含临时签名下载地址或凭证；云盘链接及校验可用于以后恢复。

## 本机复现

入口在 `tools/drill-anim/greenscreen-20261014/`。运行需本机Node、FFmpeg、带Pillow/numpy的Python，以及上述原始RGBA帧目录；便携媒体目录本身不附全部raw帧，不能宣称异机直接重渲。

```powershell
node tools/drill-anim/greenscreen-20261014/produce.mjs --out output/app51-greenscreen-NEW --workers 2
```

新配方或源清单改变必须另建目录；完成项恢复时核对输出SHA。原有不同内容和部分输出不会自动覆盖，需先诊断后选择新的批次目录。`recipe/` 附本批次生产、独立验证与打包工具；原项目路径仅用于来源追溯，便携播放使用相对路径。
