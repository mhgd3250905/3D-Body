# 肌群紧凑标签

`assets/l10n/muscle_short_<locale>.json` 为 14 种语言提供紧凑显示名，键使用 `phase-muscles.json` 中稳定的 `groupId`。这些值只供空间有限的标签和按钮使用，不替换源数据中的完整肌群名称。完整名称继续用于说明文字、搜索索引和无障碍语义；原有肌群 ID、训练剂量、目标肌群与个人记录均不因短名变化。

短名采用各语言常见的肌肉名或肌群名。必要时保留组合中的两类肌肉，避免把定位组缩成一个无关的动作词。下表以英文映射举例说明取舍；其他 locale 使用各自准确、自然的对应词。

| `groupId` | 英文短名 | 取短依据 |
| --- | --- | --- |
| `deltoids` | Deltoids | 常用肌群称呼覆盖三角肌各束，不在窄标签里罗列前、中、后束。 |
| `rotator-cuff` | Rotator cuff | 通用肩袖肌群名称；完整说明仍交代示意位置和未单独绘制的肌肉。 |
| `triceps` | Triceps | 通用肱三头肌称呼，无需附加更长的 *brachii*。 |
| `forearms` | Forearms | 显示前臂区域；完整名称保留腕屈肌与腕伸肌的具体信息。 |
| `serratus` | Serratus anterior | 保留“前锯肌”的完整常用解剖名，以免与其他锯肌混淆。 |
| `scapular` | Traps & rhomboids | 明确保留斜方肌与菱形肌两部分；完整名称进一步限定斜方肌中下部。 |
| `chest` | Pecs | 常见胸肌简称；完整名称指出此处是胸大肌。 |
| `lats` | Lats | 常见背阔肌简称，辨识度高且适合窄标签。 |
| `abs` | Abs | 常见腹肌统称；完整名称说明面板为腹直肌，并提及深层腹横肌。 |
| `obliques` | Obliques | 以常用腹斜肌群名显示；详细说明继续区分腹外斜肌与深层腹内斜肌。 |
| `erectors` | Erector spinae | 使用竖脊肌群的常用名称，不将其误写成单一腰部肌肉。 |
| `hip-flexors` | Hip flexors | 使用髋屈肌群统称；完整说明保留深层髂腰肌及合并示意信息。 |
| `glute-max` | Gluteus maximus | 保留“大臀肌”的区别，避免与臀中肌短名混淆。 |
| `hip-abductors` | Gluteus medius | 短名标识此处实际显示的臀中肌，而不是重复写动作“髋外展”。 |
| `adductors` | Adductors | 通用内收肌群名；详细说明保留合并示意的具体肌肉。 |
| `quadriceps` | Quads | 常用股四头肌简称，不逐一列出股直肌及股外侧、股内侧肌。 |
| `hamstrings` | Hamstrings | 常用腘绳肌群名，不缩成其中单独一块肌肉。 |

14 个文件中的每个 locale 都含上述 17 个 ID，且同一语言内没有重复短名。`trainGroup` 等 ARB 按钮文案仍使用原有 `{name}` 占位符；本映射不增删 ARB key。

## 显示验证

L39在14语言×320×700/390×844加载真实离线字体核对17短名、8阶段、提示、标题和CTA；完整名称和短名均可检索。英文390详情与俄语/阿语320真实网页截图见[实景记录](screenshots/2026-10-11-L39/README.md)，测试/构建与原生边界见[verification.md](verification.md)。
