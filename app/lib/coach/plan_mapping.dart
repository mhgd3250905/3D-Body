import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../data/catalog.dart';
import '../domain/training_plan.dart';

/// A display row for one plan item. Execution always receives the whole plan.
class CoachPlanEntry {
  const CoachPlanEntry({
    required this.drill,
    required this.blockIndex,
    required this.block,
    required this.item,
    required this.doseText,
    required this.dose,
  });

  final Drill drill;
  final int blockIndex;
  final uc.PlanBlock block;
  final uc.PlanItem item;
  final String doseText;

  /// Per-item display compatibility only, never a flattened execution recipe.
  final RoutineDose dose;

  String get blockName {
    final name = block.name.isEmpty ? block.type.zh : block.name;
    if (block.type == uc.BlockType.circuit && block.rounds > 1) {
      return '$name · ${block.rounds} 轮 · 轮间休息 ${block.restBetweenRoundsSeconds} 秒';
    }
    return name;
  }
}

/// Resolves media for display without merging repeated items, multiplying
/// rounds or changing the SDK plan. Missing actions reject the entire display
/// mapping; the caller must show an unavailable state instead of a partial plan.
class CoachPlanMapper {
  const CoachPlanMapper(this.catalog);
  final Catalog catalog;

  Set<String> missingIds(uc.TrainingPlan plan) => {
    for (final id in plan.exerciseIds)
      if (catalog.drillById(id) == null) id,
  };

  List<CoachPlanEntry> entries(uc.TrainingPlan plan) {
    final missing = missingIds(plan);
    if (missing.isNotEmpty) {
      throw StateError('计划动作不可用：${missing.join('、')}');
    }
    return [
      for (final (bi, block) in plan.blocks.indexed)
        for (final item in block.items) _entry(bi, block, item),
    ];
  }

  CoachPlanEntry _entry(int bi, uc.PlanBlock block, uc.PlanItem item) {
    final drill = catalog.drillById(item.exerciseId)!;
    final time = item.mode == uc.DoseMode.time;
    final circuit = block.type == uc.BlockType.circuit && block.rounds > 1;
    final dose = RoutineDose(
      sets: item.sets,
      mode: time ? DoseMode.time : DoseMode.reps,
      target: (time ? item.workSeconds : item.reps)!,
      perSide: item.perSide,
      restSec: item.restSeconds,
    );
    final side = item.perSide ? '每侧 ' : '';
    final amount = '${dose.target} ${time ? '秒' : '次'}';
    return CoachPlanEntry(
      drill: drill,
      blockIndex: bi,
      block: block,
      item: item,
      dose: dose,
      doseText: circuit ? '每轮 1 组 × $side$amount' : dose.text,
    );
  }

  static String routineName(uc.TrainingPlan plan) {
    final title = plan.title.trim().isEmpty ? 'AI 定制计划' : plan.title.trim();
    return TrainingRoutine.truncateName(title);
  }
}
