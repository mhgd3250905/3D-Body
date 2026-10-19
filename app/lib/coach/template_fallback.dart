import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../data/catalog.dart';
import '../domain/training_plan.dart';

/// 为什么用了预设方案（给用户看的一句话）。
enum PresetReason {
  notConfigured('AI 还没配置'),
  offline('网络不可用'),
  timeout('AI 响应超时'),
  invalid('AI 两次都没排出合格的计划'),
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
/// 不生成新内容，也不改剂量（沿用动作库里的处方）。
class TemplateFallback {
  TemplateFallback(this.catalog);
  final Catalog catalog;

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

  /// 关键词得分最高的方向；都没命中用「托马斯全链」。
  static String pickPreset(String text) {
    var best = 'flare';
    var bestScore = 0;
    for (final entry in _keywords.entries) {
      final score = entry.value.allMatches(text).length;
      if (score > bestScore) {
        best = entry.key;
        bestScore = score;
      }
    }
    return best;
  }

  /// 场景档位：说了健身房 → C，说了器械 → B，否则用计划页当前选择。
  static String pickTier(String text, String fallbackTier) {
    if (RegExp(r'健身房|器械区|gym', caseSensitive: false).hasMatch(text)) {
      return 'C';
    }
    if (RegExp(r'哑铃|弹力带|壶铃|器械|拉力带|瑞士球|泡沫轴').hasMatch(text)) return 'B';
    if (RegExp(r'徒手|没有器械|无器械|什么都没有').hasMatch(text)) return 'A';
    return fallbackTier;
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
  }) {
    if (isRedFlag(text)) return const uc.CoachReply.text(redFlagReply);
    final presetId = pickPreset(text);
    final useTier = pickTier(text, tier);
    final plan = build(presetId, useTier);
    final title = titles[presetId]!;
    return uc.CoachReply.plan(
      '${reason.zh}，先给你 App 内置的预设方案「$title」'
      '（${tierLabel(useTier)}版），不是 AI 定制。',
      plan,
    );
  }

  /// 预设方案转成 TrainingPlan v1（source=template），剂量取动作库默认处方。
  uc.TrainingPlan build(String presetId, String tier) {
    final preset = PresetPlan.byId(presetId) ?? PresetPlan.all.last;
    final drills = preset.drills(catalog, tier);
    return uc.TrainingPlan(
      id: 'template-${preset.id}-$tier',
      source: 'template',
      templateId: preset.id,
      title: '预设方案 · ${titles[preset.id]}',
      summary: '计划页「${titles[preset.id]}」的${tierLabel(tier)}版',
      goal: preset.id == 'warmup' ? 'warmup' : 'strength',
      scene: tier == 'C' ? 'gym' : 'home',
      level: 1,
      targetMinutes: estimateMinutes(drills),
      blocks: [
        uc.PlanBlock(
          id: 'b1',
          name: titles[preset.id]!,
          type: preset.id == 'warmup' ? uc.BlockType.warmup : uc.BlockType.main,
          items: [
            for (final drill in drills)
              uc.PlanItem(
                exerciseId: drill.id,
                mode: drill.dose.mode.name == 'time'
                    ? uc.DoseMode.time
                    : uc.DoseMode.reps,
                sets: drill.dose.sets,
                reps: drill.dose.mode.name == 'time' ? null : drill.dose.min,
                workSeconds: drill.dose.mode.name == 'time'
                    ? drill.dose.min
                    : null,
                perSide: drill.dose.perSide,
                restSeconds: drill.dose.restSec,
              ),
          ],
        ),
      ],
      safetyNotes: const ['训练中出现疼痛、麻木或头晕，立即停止。'],
    );
  }
}
