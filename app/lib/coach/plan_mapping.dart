import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../data/catalog.dart';
import '../domain/training_plan.dart';

/// 计划卡上的一行，也是保存 / 跟练用的一个动作。
class CoachPlanEntry {
  const CoachPlanEntry({
    required this.drill,
    required this.blockName,
    required this.doseText,
    this.dose,
  });

  /// App 动作（AI 计划已套上计划自己的剂量）。
  final Drill drill;
  final String blockName;
  final String doseText;

  /// AI 计划给的剂量；预设方案为 null（沿用动作库处方）。
  final RoutineDose? dose;
}

/// TrainingPlan v1 → App 的计划 / routine。
///
/// - App 的成套训练是一串不重复的动作、依次跟练，所以：块按顺序拍平；
///   `rounds` 折算进组数（sets × rounds，最多 12 组）；同一动作再次出现时并进第一次的组数。
/// - AI 计划的剂量保存在 routine.doses 里，跟练计时 / 计次按它走；
///   预设方案（source=template）沿用动作库原处方。
/// - App 里没有的动作跳过（校验阶段已按「profile 范围 ∩ App 实际资产」排除，正常不会出现）。
class CoachPlanMapper {
  const CoachPlanMapper(this.catalog);
  final Catalog catalog;

  static const maxSets = 12;

  List<CoachPlanEntry> entries(uc.TrainingPlan plan) {
    final template = plan.source == 'template';
    final order = <String>[];
    final doses = <String, RoutineDose>{};
    final blocks = <String, String>{};
    for (final block in plan.blocks) {
      for (final item in block.items) {
        final drill = catalog.drillById(item.exerciseId);
        if (drill == null) continue;
        final sets = item.sets * (block.rounds < 1 ? 1 : block.rounds);
        final existing = doses[drill.id];
        if (existing != null) {
          doses[drill.id] = RoutineDose(
            sets: (existing.sets + sets).clamp(1, maxSets),
            mode: existing.mode,
            target: existing.target,
            perSide: existing.perSide,
            restSec: existing.restSec,
          );
          continue;
        }
        if (order.length >= TrainingRoutine.maxDrills) continue;
        order.add(drill.id);
        blocks[drill.id] = block.name.isEmpty ? block.type.zh : block.name;
        final time = item.mode == uc.DoseMode.time;
        doses[drill.id] = RoutineDose(
          sets: sets.clamp(1, maxSets),
          mode: time ? DoseMode.time : DoseMode.reps,
          target: (time ? item.workSeconds : item.reps) ?? drill.dose.min,
          perSide: item.perSide,
          restSec: item.restSeconds,
        );
      }
    }
    return [
      for (final id in order)
        if (catalog.drillById(id) case final Drill drill)
          if (template)
            CoachPlanEntry(
              drill: drill,
              blockName: blocks[id]!,
              doseText: drill.prescription,
            )
          else
            CoachPlanEntry(
              drill: drill.withDose(doses[id]!.apply(drill.dose)),
              blockName: blocks[id]!,
              doseText: doses[id]!.text,
              dose: doses[id],
            ),
    ];
  }

  /// 保存成「我的计划」时的名字（不超过 24 个字）。
  static String routineName(uc.TrainingPlan plan) {
    final title = plan.title.trim().isEmpty ? 'AI 定制计划' : plan.title.trim();
    return TrainingRoutine.truncateName(title);
  }
}
