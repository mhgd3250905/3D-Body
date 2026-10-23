import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../data/catalog.dart';
import '../domain/training_plan.dart';
import '../trainer/training_plan_adapter.dart';

/// 为什么用了预设方案（给用户看的一句话）。
enum PresetReason {
  notConfigured('AI 还没配置'),
  offline('网络不可用'),
  timeout('AI 响应超时'),
  invalid('AI 暂未排出合格的计划'),
  unavailable('AI 暂时不可用');

  const PresetReason(this.zh);
  final String zh;

  static PresetReason of(uc.FallbackReason r) => switch (r) {
    uc.FallbackReason.offline => offline,
    uc.FallbackReason.timeout => timeout,
    uc.FallbackReason.invalidOutput => invalid,
    _ => unavailable,
  };
}

/// 离线回落：从 App 现有 6 个成套训练里按关键词挑最接近的一个，原样作为预设方案。
/// 沿用目录处方；旧手动处方使用已发布的默认剂量，与普通开练入口一致。
class TemplateFallback {
  TemplateFallback(this.catalog, {this.cautionsOf, this.equipmentOf});
  final Catalog catalog;
  final List<String> Function(String id)? equipmentOf;

  /// 动作会加重哪些部位（SDK 目录 cautions 词表：手腕/肩/腰/膝/颈/髋/大腿内侧）。
  /// 用于按用户说过的保护约束剔除预设里的动作；null = 不剔除。
  final List<String> Function(String id)? cautionsOf;

  /// 与计划页一致的中文名。
  static const titles = {
    'warmup': '热身激活',
    'support': '肩臂支撑',
    'core': '核心折叠',
    'legs': '腿部绕环',
    'side': '侧撑换手',
    'flare': '托马斯全链',
  };

  static final _keywords = <String, RegExp>{
    'warmup': RegExp(r'热身|激活|手腕|腕|肩胛|前锯|前臂|准备'),
    'support': RegExp(r'支撑|撑地|手臂|三头|胸|背阔|推|承重|三角肌'),
    'core': RegExp(r'核心|腹|压缩|折叠|腰背|竖脊|卷腹|髋屈|屈髋'),
    'legs': RegExp(r'腿|臀|绕环|内收|腘绳|股四头|下肢|开腿|劈叉'),
    'side': RegExp(r'侧撑|换手|侧面|腹斜|肩袖|单臂|单手'),
    'flare': RegExp(r'全旋|托马斯|flare|整套|综合|全身|全面', caseSensitive: false),
  };

  /// 红旗情况（与 SDK 内核第 2 条同口径）：不出计划，建议先就医。
  static final _redFlags = RegExp(
    r'剧痛|刺痛|麻木|放射痛|肿胀|肿了|刚受伤|刚扭|骨折|术后|手术后|做了手术|怀孕|孕期|产后|胸闷|胸痛|头晕|晕倒',
  );

  static const redFlagReply =
      '你提到的情况（如剧痛、刺痛、麻木、肿胀、刚受伤、术后、孕期产后、头晕胸闷）'
      '不适合现在训练。建议先就医或咨询医生/康复师，确认可以恢复训练后再来找我排计划。';

  static bool isRedFlag(String text) => _redFlags.hasMatch(text);

  /// 本轮或之前提过的红旗情况（手术、受伤……）整段对话都有效。
  static bool anyRedFlag(String text, List<String> history) =>
      isRedFlag(text) || history.any(isRedFlag);

  /// 对话里用户说过的话（回落时带上，保留先前的禁忌和场景约束）。
  static List<String> userTexts(uc.CoachConversation c) => [
    for (final t in c.turns)
      if (t.isUser) t.text,
  ];

  /// 关键词得分最高的方向；都没命中用「托马斯全链」。
  /// [history] = 同一对话里之前用户说过的话：本轮命中算 2 分、之前的算 1 分，
  /// 这样「想练核心」→「10分钟」不会忘了方向。
  static String pickPreset(String text, {List<String> history = const []}) {
    var best = 'flare';
    var bestScore = 0;
    for (final entry in _keywords.entries) {
      var score = entry.value.allMatches(text).length * 2;
      for (final h in history) {
        score += entry.value.allMatches(h).length;
      }
      if (score > bestScore) {
        best = entry.key;
        bestScore = score;
      }
    }
    return best;
  }

  /// 场景档位：说了健身房 → C，说了器械 → B，否则用计划页当前选择。
  /// [history] 里之前提过的场景照样有效（最近一次说的为准）。
  static String pickTier(
    String text,
    String fallbackTier, {
    List<String> history = const [],
  }) {
    for (final t in [text, ...history.reversed]) {
      final tier = _sceneTier(t, fallbackTier);
      if (tier != null) return tier;
    }
    return fallbackTier;
  }

  /// 场景只看最近一句说了场景的话。否定器械要先于泛词「器械」判断；
  /// 只说「在家」（没提器械）＝不在健身房：沿用计划页的居家档位，计划页是健身房时用徒手。
  static String? _sceneTier(String text, String fallbackTier) {
    if (RegExp(
      r'徒手|(没有|没|无|不用|不要|不需要)(任何)?(器械|器材|装备|工具)|什么都没有|空手',
    ).hasMatch(text)) {
      return 'A';
    }
    if (RegExp(r'健身房|器械区|gym', caseSensitive: false).hasMatch(text)) {
      return 'C';
    }
    if (RegExp(r'哑铃|弹力带|壶铃|器械|拉力带|瑞士球|泡沫轴').hasMatch(text)) return 'B';
    if (RegExp(r'在家|家里|居家|宿舍|酒店|房间里').hasMatch(text)) {
      return fallbackTier == 'C' ? 'A' : fallbackTier;
    }
    return null;
  }

  /// cautions 词表部位 → 用户口语。
  static final _parts = <String, RegExp>{
    '手腕': RegExp(r'手腕|腕'),
    '肩': RegExp(r'肩(?!胛)'),
    '腰': RegExp(r'腰|下背'),
    '膝': RegExp(r'膝'),
    '颈': RegExp(r'颈|脖子'),
    '髋': RegExp(r'髋'),
    '大腿内侧': RegExp(r'大腿内侧|内收肌'),
  };
  static final _protect = RegExp(
    r'不舒服|不适|疼|痛|酸|伤|别|不要|不能|避免|避开|不想|怕|保护|有问题|不好',
  );

  /// 并列部位之间的连接词 / 修饰（去掉部位后只剩这些＝这一段只是部位列举）。
  static final _partFiller = RegExp(r'以及|还有|和|与|跟|及|或|部|的|左|右|两边|两侧|双|侧|\s');

  static Set<String> _partsIn(String s) => {
    for (final e in _parts.entries)
      if (e.value.hasMatch(s)) e.key,
  };

  /// 用户（本轮或之前）明确要保护的部位：同一分句里既提到部位又提到不适 / 避让。
  /// 例：「手腕不舒服，别安排手腕承重」→ {手腕}。整段对话都有效。
  /// 顿号并列共享同一个不适谓词：「手腕、肩都不舒服」→ {手腕, 肩}；
  /// 只有纯部位列举的段才继承后面的不适（「练肩、手腕不舒服」只保护手腕）。
  static Set<String> protectedParts(String text, List<String> history) {
    final out = <String>{};
    for (final t in [...history, text]) {
      for (final clause in t.split(RegExp(r'[，,。.；;！!？?\n]'))) {
        final pending = <String>{};
        for (final seg in clause.split('、')) {
          final parts = _partsIn(seg);
          if (_protect.hasMatch(seg)) {
            out
              ..addAll(pending)
              ..addAll(parts);
            pending.clear();
          } else if (parts.isNotEmpty && _isBarePartList(seg)) {
            pending.addAll(parts);
          } else {
            pending.clear();
          }
        }
      }
    }
    return out;
  }

  static bool _isBarePartList(String seg) {
    var rest = seg;
    for (final re in _parts.values) {
      rest = rest.replaceAll(re, '');
    }
    return rest.replaceAll(_partFiller, '').isEmpty;
  }

  static String tierLabel(String tier) => switch (tier) {
    'B' => '居家器械',
    'C' => '健身房',
    _ => '徒手',
  };

  uc.CoachReply reply(
    String text, {
    required PresetReason reason,
    required String tier,
    List<String> history = const [],
  }) {
    if (anyRedFlag(text, history)) {
      return const uc.CoachReply.text(redFlagReply);
    }
    final presetId = pickPreset(text, history: history);
    final useTier = pickTier(text, tier, history: history);
    final avoid = cautionsOf == null
        ? const <String>{}
        : protectedParts(text, history);
    final plan = build(presetId, useTier, avoid: avoid);
    final title = titles[presetId]!;
    final parts = avoid.join('、');
    if (plan == null) {
      return uc.CoachReply.text(
        '${reason.zh}。App 内置的预设方案「$title」（${tierLabel(useTier)}版）'
        '里的动作都会加重$parts负担，按你说的要保护$parts，这次不给可开练的预设方案。'
        '等网络恢复再让 AI 按你的情况排，或换个不涉及$parts的练习方向。',
      );
    }
    final removed =
        PresetPlan.byId(presetId)!.drills(catalog, useTier).length -
        plan.exerciseIds.length;
    return uc.CoachReply.plan(
      '${reason.zh}，先给你 App 内置的预设方案「$title」'
      '（${tierLabel(useTier)}版），不是 AI 定制。'
      '${removed > 0 ? '按你说的保护$parts，已去掉 $removed 个会加重$parts负担的动作。' : ''}',
      plan,
    );
  }

  /// 预设方案转成 TrainingPlan v1（source=template），剂量取动作库默认处方。
  /// [avoid] 里的部位：剔除 cautions 含这些部位的动作；全被剔除时返回 null。
  uc.TrainingPlan? build(
    String presetId,
    String tier, {
    Set<String> avoid = const {},
  }) {
    final preset = PresetPlan.byId(presetId) ?? PresetPlan.all.last;
    final drills = [
      for (final d in preset.drills(catalog, tier))
        if (avoid.isEmpty ||
            !(cautionsOf?.call(d.id) ?? const []).any(avoid.contains))
          d,
    ];
    if (drills.isEmpty) return null;
    final defaults = trainingPlanFromDrills(
      title: titles[preset.id]!,
      drills: drills,
    );
    final minutes = (estimateTrainingPlanSeconds(defaults, catalog) / 60)
        .ceil();
    return uc.TrainingPlan(
      id: 'template-${preset.id}-$tier',
      source: 'template',
      templateId: preset.id,
      title: '预设方案 · ${titles[preset.id]}',
      summary: '计划页「${titles[preset.id]}」的${tierLabel(tier)}版，预计 $minutes 分钟',
      goal: preset.id == 'warmup' ? 'warmup' : 'strength',
      scene: tier == 'C' ? 'gym' : 'home',
      equipment: {for (final d in drills) ...?equipmentOf?.call(d.id)}.toList(),
      level: 1,
      // The profile accepts a 5–60 minute budget. Safety filtering can leave
      // a shorter routine; keep its actual dose and display its estimate.
      targetMinutes: minutes.clamp(5, 60),
      blocks: [
        uc.PlanBlock(
          id: 'b1',
          name: titles[preset.id]!,
          type: preset.id == 'warmup' ? uc.BlockType.warmup : uc.BlockType.main,
          items: defaults.items.toList(),
        ),
      ],
      avoid: avoid,
      safetyNotes: const ['训练中出现疼痛、麻木或头晕，立即停止。'],
    );
  }
}
