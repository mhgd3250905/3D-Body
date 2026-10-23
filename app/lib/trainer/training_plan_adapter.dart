import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/ugk_trainer.dart' as sdk;

import '../data/catalog.dart';

// Exact contracts in pinned Pose-Hub 0.3.0 (93d8f52), for synchronous legacy
// callers. Prefer sourceCatalog when loaded. forearms-C's 30 seconds is the
// catalog's published approximation (review=doubt), not a distance conversion.
const _manualDefaults = <String, uc.Dose>{
  'forearms-A': uc.Dose(
    mode: uc.DoseMode.reps,
    sets: 2,
    reps: 10,
    restSeconds: 15,
  ),
  'forearms-C': uc.Dose(
    mode: uc.DoseMode.time,
    sets: 3,
    seconds: 30,
    restSeconds: 45,
  ),
};

/// Known manual prescriptions consume published defaults; unknown ones fail.
/// A placeholder repetition must never become an automatically completed set.
uc.TrainingPlan trainingPlanFromDrills({
  required String title,
  required List<Drill> drills,
  String? id,
  uc.Catalog? sourceCatalog,
}) {
  if (drills.isEmpty) throw ArgumentError.value(drills, 'drills', 'Empty plan');
  final items = <uc.PlanItem>[];
  for (final drill in drills) {
    final d = drill.dose;
    if (d.mode == DoseMode.manual) {
      if (!_manualDefaults.containsKey(drill.id)) {
        throw FormatException(
          'Manual dose needs an authored plan: ${drill.id}',
        );
      }
      final published = sourceCatalog?[drill.id];
      if (sourceCatalog != null && published == null) {
        throw UnknownTrainingDrills([drill.id]);
      }
      final dose = published?.defaultDose ?? _manualDefaults[drill.id]!;
      items.add(
        uc.PlanItem(
          exerciseId: drill.id,
          mode: dose.mode,
          sets: dose.sets,
          reps: dose.reps,
          workSeconds: dose.seconds,
          perSide: published?.unilateral ?? d.perSide,
          restSeconds: dose.restSeconds,
          note: drill.prescription,
        ),
      );
    } else {
      items.add(
        uc.PlanItem(
          exerciseId: drill.id,
          mode: d.mode == DoseMode.time ? uc.DoseMode.time : uc.DoseMode.reps,
          sets: d.sets,
          reps: d.mode == DoseMode.reps ? d.min : null,
          workSeconds: d.mode == DoseMode.time ? d.min : null,
          perSide: d.perSide,
          restSeconds: d.restSec,
          note: drill.prescription,
        ),
      );
    }
  }
  final plan = uc.TrainingPlan(
    id: id ?? 'practice-${DateTime.now().microsecondsSinceEpoch}',
    source: 'template',
    title: title,
    goal: 'flare',
    scene: drills.first.tier == 'C' ? 'gym' : 'home',
    level: 1,
    targetMinutes: 1,
    blocks: [
      uc.PlanBlock(
        id: 'practice',
        name: title,
        type: uc.BlockType.main,
        items: items,
      ),
    ],
  );
  final estimatePlan = plan.copyWith(
    blocks: [
      uc.PlanBlock(
        id: 'practice',
        name: title,
        type: uc.BlockType.main,
        items: [
          for (final (index, item) in items.indexed)
            _withSegments(item, drills[index], const [
              '手指朝前',
              '手指朝侧',
              '手指朝后',
              '手背撑地',
            ]),
        ],
      ),
    ],
  );
  final estimate = sdk.SessionBuilder(
    rhythms: sourceCatalog == null
        ? const {}
        : sdk.rhythmsFromCatalog(sourceCatalog),
  ).planSeconds(estimatePlan);
  return plan.copyWith(
    targetMinutes: ((estimate + 10) / 60).ceil().clamp(1, 1000000),
  );
}

void validateTrainingPlan(uc.TrainingPlan plan, Catalog catalog) {
  if (plan.items.isEmpty) throw const FormatException('Empty training plan');
  final unknown = plan.exerciseIds
      .where((id) => catalog.drillById(id) == null)
      .toList();
  if (unknown.isNotEmpty) throw UnknownTrainingDrills(unknown);
  bool validDose(uc.DoseMode mode, int? reps, int? seconds) {
    final amount = mode == uc.DoseMode.reps ? reps : seconds;
    return amount != null && amount > 0;
  }

  for (final block in plan.blocks) {
    if (block.rounds < 1 || block.restBetweenRoundsSeconds < 0) {
      throw const FormatException('Invalid block dose');
    }
    for (final item in block.items) {
      if (item.sets < 1 ||
          item.restSeconds < 0 ||
          (item.segments.isEmpty &&
              !validDose(item.mode, item.reps, item.workSeconds))) {
        throw FormatException('Invalid dose: ${item.exerciseId}');
      }
      final ids = <String>{};
      for (final segment in item.segments) {
        if (segment.id.isEmpty ||
            !ids.add(segment.id) ||
            !validDose(segment.mode, segment.reps, segment.workSeconds) ||
            (segment.holdSeconds != null && segment.holdSeconds! <= 0)) {
          throw FormatException(
            'Invalid segment: ${item.exerciseId}/${segment.id}',
          );
        }
      }
    }
  }
}

class UnknownTrainingDrills implements Exception {
  UnknownTrainingDrills(Iterable<String> ids) : ids = List.unmodifiable(ids);
  final List<String> ids;
}

/// Card estimates include the same composite segments as the player, using
/// SDK default rhythms. Missing-media plans stay readable but cannot start.
double estimateTrainingPlanSeconds(uc.TrainingPlan plan, Catalog? catalog) {
  final builder = sdk.SessionBuilder();
  if (catalog == null ||
      plan.exerciseIds.any((id) => catalog.drillById(id) == null)) {
    return builder.planSeconds(plan);
  }
  return builder.planSeconds(expandSegmentedTrainingPlan(plan, catalog));
}

/// SDK 0.2 owns segment identity, per-set order and completion accounting.
/// Reuse existing composite demonstrations, not invented segment-specific media.
/// Explicit segments and their chosen material ids are preserved unchanged.
uc.TrainingPlan expandSegmentedTrainingPlan(
  uc.TrainingPlan plan,
  Catalog catalog, {
  List<String> wristDirections = const ['手指朝前', '手指朝侧', '手指朝后', '手背撑地'],
}) {
  validateTrainingPlan(plan, catalog);
  if (wristDirections.length != 4) {
    throw ArgumentError('Four wrist directions required');
  }
  return plan.copyWith(
    blocks: [
      for (final block in plan.blocks)
        uc.PlanBlock(
          id: block.id,
          name: block.name,
          type: block.type,
          rounds: block.rounds,
          restBetweenRoundsSeconds: block.restBetweenRoundsSeconds,
          items: [
            for (final item in block.items)
              _withSegments(
                item,
                catalog.drillById(item.exerciseId)!,
                wristDirections,
              ),
          ],
        ),
    ],
  );
}

uc.PlanItem _withSegments(
  uc.PlanItem item,
  Drill drill,
  List<String> wristDirections,
) {
  if (item.segments.isNotEmpty) return item;
  final labels = switch (item.exerciseId) {
    'forearms-A' => wristDirections,
    'scapular-A' => const ['Y', 'T', 'W'],
    'forearms-B' => drill.dose.blockLabels,
    _ => const <String>[],
  };
  if (labels.length <= 1) return item;
  final ids = switch (item.exerciseId) {
    'forearms-A' => const [
      'fingers-forward',
      'fingers-sideways',
      'fingers-backward',
      'back-of-hand',
    ],
    'scapular-A' => const ['y', 't', 'w'],
    _ => const ['wrist-flexion', 'wrist-extension'],
  };
  return item.copyWith(
    segments: [
      for (final (index, label) in labels.indexed)
        uc.PlanSegment(
          id: ids[index],
          exerciseId: item.exerciseId,
          label: label,
          mode: item.mode,
          reps: item.reps,
          workSeconds: item.workSeconds,
        ),
    ],
  );
}
