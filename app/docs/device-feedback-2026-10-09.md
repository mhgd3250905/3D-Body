# 真机反馈（2026-10-09，Android 真机）

| # | 页面 | 现象 | 初判 | 状态 |
|---|------|------|------|------|
| 1 | 详情 3D 舞台（同步发力卡片） | 长按文字弹出系统“复制/全选/网页搜索/分享”菜单，文字被选中高亮 | WebView 内 HTML 文字可选：缺 `user-select:none`、`-webkit-touch-callout:none` | 已修 |
| 2 | 详情 3D 舞台（肌群标记点） | 点击标记点出现蓝色方框 | WebView 默认点按高亮：缺 `-webkit-tap-highlight-color: transparent`，并检查 focus outline | 已修 |
| 3 | 暂停→点触摸点→肌群详情 | 镜头过渡时先猛地放大、像翻身，再缩小（首页侧面撑地→详情正面镜头） | player.glideTo 对相机位置做直线插值：起止两侧相对时路径穿过模型附近，距离骤减、朝向翻转。改为绕目标球面插值（方向 slerp、距离单独缓动），角度过大时限速或改淡入 | 已修 |
| 4 | 肌群详情·托马斯动作视图 | 设计变更（用户已确认）：动作视图允许触摸各方向旋转，禁止缩放远近；直立人台不变 | detail.js lockCamera 改为 enableRotate=true、enableZoom=false、enablePan=false，“固定视角”标签改文案；同步改 verify-detail-transitions 断言与文档显示契约 | 已做 |
| 5 | 肌群详情·训练入口 | 设计变更（用户确认）：点“练XX”后先选场景：无器械 / 居家 / 健身房，再进入对应训练动作页 | drills.json 每个肌群已有 A 徒手 / B 家用器械 / C 健身房 三档（各 17 条），新增场景选择弹层或页，接入 FlareStage `_route()` | 已做 |
| 6 | 肌群详情·标题下空白 | 设计变更（用户建议）：标题下方用小字讲该肌群在托马斯中的作用与基础知识 | 现有 group.role 一句；为 17 个肌群补 2–3 句知识文案（作用、哪一相最吃力、常见薄弱表现），不写肌电百分比 | 已做 |
| 7 | 启动加载 | 设计变更（用户建议）：打开 App 时 3D 模型加载的转圈太粗糙，改为 canvas 矢量绘制的 logo 加载动画 | 场景 index.html 内联 canvas 动画（首帧即显示，不等 bundle），Flutter 侧占位同款 | 已做 |

截图：device-feedback-2026-10-09/

## 计划（按步推进，每步一个提交 + tag + bundle 备份）
1. S1 WebView 触控卫生：#1 #2（style.css 全局 user-select/touch-callout/tap-highlight/outline）
2. S2 镜头：#3 弧线过渡 + #4 动作视图可转不可缩
3. S3 训练场景：#5 三场景选择
4. S4 知识文案：#6 17 个肌群知识小字（交用户审）
5. S5 加载动画：#7 canvas logo
6. 验证（analyze/test/scene verify/截图）→ 文档 → 推送 → 新 PR
基线：已快进到 origin/master f1d526a（PR #5、#3 已合并）。

## 结果（2026-10-09）
| 步 | 提交 | tag |
|---|---|---|
| S1+S2 WebView 触控卫生、弧线镜头、动作视图可转不可缩 | c721414 | fb-s1-s2 |
| S3 三场景训练选择 | 1a17a29 | fb-s3 |
| S4 17 个肌群知识小字（lib/data/muscle_knowledge.dart，待用户审） | 1e9775e | fb-s4 |
| S5 canvas 矢量加载动画（场景 index.html 内联 + Flutter FlareLoaderMark 同款） | cfca539 | fb-s5 |

实现要点：
- #1/#2 style.css 全局 `user-select:none`、`-webkit-touch-callout:none`、`-webkit-tap-highlight-color:transparent`；main.js 拦截 contextmenu/selectstart/dragstart。
- #3 player.glideTo：目标直线移动，相机偏移用球坐标插值（方位角走最短弧、极角线性、距离几何缓动），时长随转角 560–900ms；verify-detail-transitions 新增“反侧机位不穿模、无跳变、精确落点”断言。
- #4 detail.js：动作视图 enableRotate、禁 zoom/pan；人台保留缩放；角标改“拖动旋转”。
- #5 点“练XX”弹出 无器械 / 居家 / 健身房（对应 A/B/C），设置里的常用档位描边标记。
- #6 文案放在“一起发力”下方，13pt 次级色；单测保证 17 组齐全、无百分比/肌电字样。
- #7 首帧即显示（不等 1.3MB bundle），就绪后 320ms 淡出；reduced motion 静止帧；Flutter 占位同几何同节奏。

截图：screenshots/2026-10-09-device-feedback/（深浅各 3 张 + loader-frames.png 动画分帧）。
待真机：Android WebView 长按是否完全无菜单、弧线过渡观感与帧率、加载动画帧率。

## 本机审核补充（PR6候选）

作者上表记录不替代本机验证；已补训练卡片辅助技术点击动作、加载淡出CSS、减少动态效果后的主题重绘、键盘焦点提示，以及肌群知识的功能/观察措辞。当前显示契约已同步；实际检查、包及未验证范围见 [PR6审核](pr6-audit-2026-10-09.md)。尚未推送/合并，不创建或操作上表作者tag。
