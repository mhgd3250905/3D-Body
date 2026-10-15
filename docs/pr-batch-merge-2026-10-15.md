# 2026-10-15：五项 PR 审核与合并

用户明确授权将#111、#112、#113、#115和#116全部审核合并。五项GitHub状态均已回读为MERGED；主线新增51份训练制作候选和App场景自适应分辨率/性能面板。当前包版本仍L46 / 1.0.3+5，设备仍为此前初验的L46固定分辨率构建；本轮没有新APK、完整Flutter Web构建、真机安装、网站部署或商店更新。

## 审核和合并身份

动作链保持原有目标关系，先将叶端#115合入#113来源，再依次收拢#113/#112，最后由#111合入master；全部动作链进入master后，再合并#116。每次动作都在当前来源和目标SHA再次inspect后执行，用match-head-commit约束来源；未删除来源分支。最终动作树和性能树分别与隔离副本预审树相同。

| PR | 合并前审核head | 合并前GitHub目标head | merge commit | mergedAt（UTC） |
| --- | --- | --- | --- | --- |
| [#115](https://github.com/mhgd3250905/3D-Body/pull/115) | `3ef206740c5c4e45f021d34505fe75db4cc14ce3` | `52a2b3c9c83124e0368a17abacd595ab2939358e` | `bd79bbc2c73d23923789d5a27875821e47142131` | 2026-10-15T14:47:11Z |
| [#113](https://github.com/mhgd3250905/3D-Body/pull/113) | `bd79bbc2c73d23923789d5a27875821e47142131` | `e32dc51d1605714f4b39578e3d644dc36d0cfbc1` | `fcc8fc9bf7356937d53881eddcbd42a4e202527b` | 2026-10-15T14:47:21Z |
| [#112](https://github.com/mhgd3250905/3D-Body/pull/112) | `fcc8fc9bf7356937d53881eddcbd42a4e202527b` | `576fb8b8b3893cb944cfad7c33eb8cc4eee55d20` | `f1c77c8e08a536cb2bd75f7934a9b10294084b49` | 2026-10-15T14:47:34Z |
| [#111](https://github.com/mhgd3250905/3D-Body/pull/111) | `f1c77c8e08a536cb2bd75f7934a9b10294084b49` | `da353b109dced5d5b7cb944b0d925aa994afb1db` | `8050004dacc183ee0c1cb23c7d299daef85a66c6` | 2026-10-15T14:47:43Z |
| [#116](https://github.com/mhgd3250905/3D-Body/pull/116) | `5d01bb3ff59fc1c24530da7772a309fe65a4bbdd` | `8050004dacc183ee0c1cb23c7d299daef85a66c6` | `09610d38a41134cdb21de801e9c3f2bcde526735` | 2026-10-15T14:53:13Z |

初始#111的PR报告baseRefOid为15cb4598e7d19a70c7c58d527728897861bf3f83；当时真实master已是da353b109dced5d5b7cb944b0d925aa994afb1db。初始#116来源ed046fbba3d9342ce6debf031652740b9699b229与L46冲突，按当前master兼容补修，再并入动作链master8050004。动作初始来源及目标详见[动作记录](home-drill-integration-2026-10-15.md)，可携证据见[清单](../app/docs/evidence/pr-batch-20261015/manifest.json)和[实际合并回读](../app/docs/evidence/pr-batch-20261015/merges.json)。各PR原GitHub reviewDecision为空、没有报告CI；本次AI审核结果不冒称已提交GitHub review。

## 查实问题及补修

动作链初版直接改默认主题，破坏training-human-v2固定源；恢复原主题哈希，把完整B风格另存themes/glow-b.json显式选择。51份h-*加入明确规范化哈希清单，纯源校验恢复通过；不跳过固定源检查、不改旧87规格、不伪写新人体验收。B预设字段与原PR方案等价，旧主题CPU合成样例逐字节保持；无背凳共面闪烁修复保留。新增--pr参数默认兼容，非法/非有限数值缺少校验为保留的低优先级健壮性问题，未当作现有默认路径回归。

#116保留R12全部资产/七形象/非线性时钟/详情与启动剪影，解决原打包JS及verify脚本/文档冲突后重建场景为index-CTFzChFx.js。另修正>=250ms前台卡顿样本全部被丢弃、最慢设备无法降档的问题：保留夹紧慢样本，并补250/600ms回归。没有变更R12动作参数。

## 验证与实际限制

动作源检查通过138规格、51新候选哈希、13固定人体来源；111/112的30项7230姿态描述符与helper240帧、113/115的21项247轨道/椅子几何/CPU合成对照通过。详见[纯源结果](../app/docs/evidence/pr-batch-20261015/source-contract.json)及两个审核报告。原PR作者的渲染与QA描述保留来源身份；本轮没有回读全部外部新成片或逐帧QA，不将51新规格算成App已接入或全部QA通过。App51视频、23ready/28待核对、原94冻结素材不变。

#116历史v33/v38/v41与R12无损资产、七形象/541阶段帧/详情同帧/减弱动态、画质和自适应逻辑检查通过；独立真实tick/render隔离检查9项通过。[浏览器18项](../app/docs/evidence/pr-batch-20261015/perf-browser.json)通过且page errors为0，包括播放/拖动阴影复用、停稳清晰、详情交换返回、三档画质、隐藏停绘、adaptive=0、HUD及减弱动态。三场景对L46截图遮除主动开启的HUD后，最大通道平均RGB绝对误差0.000342（0–255尺度），不宣称逐像素一致。

前期软件GPU浏览器固定等待/惯性取样曾失败，保留本地原回执；改为条件等待完整DPR且无glide后相关检查通过，没有据取样错误改生产代码。DPR机制和相对像素/阴影计数不代表真机帧率、温度或续航提升。HUD FPS为最近1秒渲染数，p50/p95保留最近240个连续渲染tick间隔，暂停/后台后历史不清空；draw calls/triangles为主色彩pass统计，不是完整GPU计时。

离线场景bundle已重建，根npm run build通过且49个dist文件与本轮前预览逐字节一致；旧dist另存本机output/pr-batch-20261015/root-dist-before。完整Flutter Web/APK、设备及长期性能仍未重验，不将源码合并后的场景当作手机已更新。主目录原有绿幕三段、Air-Flare、图标等独立改动继续排除并保留；Play P01/Apple S4、个人数据及原网页编辑器保持。
