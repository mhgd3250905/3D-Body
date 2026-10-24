import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;

import '../data/catalog.dart';
import '../trainer/training_plan_adapter.dart';
import 'plan_mapping.dart';

/// Display-only mapping AFTER coach admission. SDK UI DTOs never execute/save
/// a plan; App callbacks retain the original admitted TrainingPlan.
class FlareCoachUiMapper {
  const FlareCoachUiMapper(this.catalog, {required this.trustedIds});
  final Catalog catalog;
  final Set<String> trustedIds;

  cui.CoachExerciseLibrary library(cui.CoachMediaPalette stage) =>
      cui.CoachExerciseLibrary([
        for (final drill in catalog.drills)
          if (trustedIds.contains(drill.id))
            cui.CoachExercise(
              id: drill.id,
              name: drill.name,
              poster: 'assets/drill_media/${drill.id}.jpg',
              stage: stage,
              categoryLabel: drill.tierLabel,
              cues: drill.cues,
            ),
      ]);

  cui.CoachRoutine routine(
    uc.TrainingPlan plan, {
    required String resultId,
    required bool preset,
  }) {
    if (plan.exerciseIds.any((id) => !trustedIds.contains(id))) {
      throw StateError('计划动作不在本 App 可信白名单内');
    }
    final entries = CoachPlanMapper(catalog).entries(plan);
    if (entries.isEmpty) throw StateError('计划没有可用动作');
    final seconds = estimateTrainingPlanSeconds(plan, catalog);
    return cui.CoachRoutine(
      id: 'coach-plan-$resultId',
      title: plan.title,
      durationLabel: '约 ${(seconds / 60).ceil()} 分钟',
      gearLabel: entries.map((e) => e.drill.equipment).toSet().join('、'),
      levelLabel: entries.map((e) => e.drill.tierLabel).toSet().join('、'),
      metaLabel: preset ? '预设方案 · App 内置成套训练' : 'AI 定制',
      adjustmentsLabel: [
        if (plan.summary.isNotEmpty) plan.summary,
        ...plan.notes,
        ...plan.safetyNotes,
      ].join('\n'),
      items: [
        for (final entry in entries)
          cui.CoachRoutineItem(
            exerciseId: entry.drill.id,
            dose: entry.doseText,
            detailDose: '${entry.blockName}\n${entry.doseText}',
          ),
      ],
    );
  }
}
