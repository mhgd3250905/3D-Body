import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../data/catalog.dart';

/// Converts existing saved routines and single-drill entry points without
/// inventing repetitions for a distance/manual prescription. A manual set uses
/// the SDK's ordinary self-paced completion, with its original wording visible.
uc.TrainingPlan trainingPlanFromDrills({
  required String title,
  required List<Drill> drills,
  String? id,
}) {
  if (drills.isEmpty) throw ArgumentError.value(drills, 'drills', 'Empty plan');
  return uc.TrainingPlan(
    id: id ?? 'practice-${DateTime.now().microsecondsSinceEpoch}',
    source: 'template',
    title: title,
    goal: 'flare',
    scene: drills.first.tier == 'C' ? 'gym' : 'home',
    level: 1,
    targetMinutes:
        ((10 +
                    drills.fold<int>(0, (total, drill) {
                      final d = drill.dose;
                      final work = d.mode == DoseMode.time
                          ? d.min
                          : d.min.clamp(1, 1000000) * 3;
                      return total +
                          d.sets * d.blocksPerSet * work +
                          (d.sets - 1) * d.restSec +
                          15;
                    })) /
                60)
            .ceil(),
    blocks: [
      uc.PlanBlock(
        id: 'practice',
        name: title,
        type: uc.BlockType.main,
        items: [
          for (final drill in drills)
            uc.PlanItem(
              exerciseId: drill.id,
              mode: drill.dose.mode == DoseMode.time
                  ? uc.DoseMode.time
                  : uc.DoseMode.reps,
              sets: drill.dose.sets,
              reps: drill.dose.mode == DoseMode.time
                  ? null
                  : drill.dose.min.clamp(1, 1000000),
              workSeconds: drill.dose.mode == DoseMode.time
                  ? drill.dose.min
                  : null,
              perSide: drill.dose.perSide,
              restSeconds: drill.dose.restSec,
              note: drill.prescription,
            ),
        ],
      ),
    ],
  );
}

/// Reject the whole plan before entering TrainerPlayer: its drillOf callback
/// deliberately skips unknown ids, which would otherwise hide missing actions.
void validateTrainingPlan(uc.TrainingPlan plan, Catalog catalog) {
  if (plan.items.isEmpty) throw const FormatException('Empty training plan');
  final unknown = plan.exerciseIds
      .where((id) => catalog.drillById(id) == null)
      .toList();
  if (unknown.isNotEmpty) throw UnknownTrainingDrills(unknown);
  for (final block in plan.blocks) {
    if (block.rounds < 1 || block.restBetweenRoundsSeconds < 0) {
      throw const FormatException('Invalid block dose');
    }
    for (final item in block.items) {
      final amount = item.mode == uc.DoseMode.time
          ? item.workSeconds
          : item.reps;
      if (item.sets < 1 ||
          amount == null ||
          amount < 1 ||
          item.restSeconds < 0) {
        throw FormatException('Invalid dose: ${item.exerciseId}');
      }
    }
  }
}

class UnknownTrainingDrills implements Exception {
  UnknownTrainingDrills(Iterable<String> ids) : ids = List.unmodifiable(ids);
  final List<String> ids;
}

/// The SDK circuit sequence represents a complete multi-segment set exactly:
/// Y → T → W, then the next set, with the original rest between complete sets.
/// Segment transitions and side order remain the SDK's own behavior.
uc.TrainingPlan expandSegmentedTrainingPlan(
  uc.TrainingPlan plan,
  Catalog catalog,
) {
  validateTrainingPlan(plan, catalog);
  final blocks = <uc.PlanBlock>[];
  List<uc.PlanItem> segments(uc.PlanItem item) {
    final drill = catalog.drillById(item.exerciseId)!;
    return [
      for (final label in drill.dose.blockLabels)
        uc.PlanItem(
          exerciseId: item.exerciseId,
          mode: item.mode,
          sets: 1,
          reps: item.reps,
          workSeconds: item.workSeconds,
          perSide: item.perSide,
          restSeconds: item.restSeconds,
          note: [
            label,
            if (item.note?.isNotEmpty ?? false) item.note!,
          ].join('\n'),
          replacedFrom: item.replacedFrom,
        ),
    ];
  }

  for (final block in plan.blocks) {
    // Idempotent for a prepared plan passed back through an entry point.
    if (block.id.startsWith('flare-segments:') ||
        block.id.startsWith('flare-segment-circuit:')) {
      blocks.add(block);
      continue;
    }
    if (!block.items.any(
      (item) => catalog.drillById(item.exerciseId)!.dose.blockLabels.length > 1,
    )) {
      blocks.add(block);
      continue;
    }
    if (block.type == uc.BlockType.circuit && block.rounds > 1) {
      blocks.add(
        uc.PlanBlock(
          id: 'flare-segment-circuit:${block.id}',
          name: block.name,
          type: block.type,
          rounds: block.rounds,
          restBetweenRoundsSeconds: block.restBetweenRoundsSeconds,
          items: [
            for (final item in block.items)
              if (catalog.drillById(item.exerciseId)!.dose.blockLabels.length >
                  1)
                ...segments(item)
              else
                item,
          ],
        ),
      );
      continue;
    }
    var pending = <uc.PlanItem>[];
    void flush() {
      if (pending.isEmpty) return;
      blocks.add(
        uc.PlanBlock(
          id: '${block.id}:${blocks.length}',
          name: block.name,
          type: block.type,
          items: List.unmodifiable(pending),
        ),
      );
      pending = [];
    }

    for (final (index, item) in block.items.indexed) {
      final drill = catalog.drillById(item.exerciseId)!;
      if (drill.dose.blockLabels.length == 1) {
        pending.add(item);
        continue;
      }
      flush();
      blocks.add(
        uc.PlanBlock(
          id: 'flare-segments:${block.id}:$index',
          name: drill.name,
          type: uc.BlockType.circuit,
          rounds: item.sets,
          restBetweenRoundsSeconds: item.restSeconds,
          items: segments(item),
        ),
      );
    }
    flush();
  }
  return plan.copyWith(blocks: blocks);
}
