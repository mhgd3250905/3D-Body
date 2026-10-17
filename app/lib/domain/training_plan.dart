import '../data/catalog.dart';

/// A ready-made set for one training direction. It names muscle groups, not
/// drills: every group has exactly one drill per scene (A bodyweight,
/// B home equipment, C gym), so one preset yields three complete variants.
class PresetPlan {
  const PresetPlan(this.id, this.groupIds);
  final String id;
  final List<String> groupIds;

  /// The six directions, ordered from warm-up to the full flare chain.
  static const all = [
    PresetPlan('warmup', ['forearms', 'scapular', 'serratus', 'rotator-cuff']),
    PresetPlan('support', ['deltoids', 'triceps', 'serratus', 'chest', 'lats']),
    PresetPlan('core', ['abs', 'hip-flexors', 'obliques', 'erectors']),
    PresetPlan('legs', [
      'glute-max',
      'hip-abductors',
      'adductors',
      'hamstrings',
      'quadriceps',
    ]),
    PresetPlan('side', [
      'deltoids',
      'rotator-cuff',
      'obliques',
      'hip-abductors',
    ]),
    PresetPlan('flare', [
      'deltoids',
      'triceps',
      'abs',
      'obliques',
      'glute-max',
      'hip-abductors',
    ]),
  ];

  static PresetPlan? byId(String id) {
    for (final plan in all) {
      if (plan.id == id) return plan;
    }
    return null;
  }

  /// Drills for one scene, in the preset's order. Groups missing from the
  /// catalog are skipped rather than failing the whole set.
  List<Drill> drills(Catalog catalog, String tier) => [
    for (final group in groupIds)
      if (catalog.drillById('$group-$tier') case final Drill drill) drill,
  ];
}

/// A set the user put together and named, kept on this device.
class TrainingRoutine {
  TrainingRoutine({
    required this.id,
    required this.name,
    required List<String> drillIds,
  }) : drillIds = List.unmodifiable(drillIds);

  final String id;
  final String name;
  final List<String> drillIds;

  static const maxName = 24;
  static const maxDrills = 20;

  bool get valid =>
      id.isNotEmpty &&
      name.trim().isNotEmpty &&
      name.length <= maxName &&
      drillIds.isNotEmpty &&
      drillIds.length <= maxDrills &&
      drillIds.toSet().length == drillIds.length;

  List<Drill> drills(Catalog catalog) => [
    for (final id in drillIds)
      if (catalog.drillById(id) case final Drill drill) drill,
  ];

  TrainingRoutine copyWith({String? name, List<String>? drillIds}) =>
      TrainingRoutine(
        id: id,
        name: name ?? this.name,
        drillIds: drillIds ?? this.drillIds,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'drillIds': drillIds,
  };

  factory TrainingRoutine.fromJson(Map<String, dynamic> json) =>
      TrainingRoutine(
        id: json['id'] as String,
        name: json['name'] as String,
        drillIds: (json['drillIds'] as List).cast<String>(),
      );
}

/// A rough length for a set, for planning only: work time from the dose's
/// lower target (about 3 s a repetition), its rest between sets, and a short
/// change-over between drills. Never shown as a measurement.
int estimateMinutes(Iterable<Drill> drills) {
  var seconds = 0;
  for (final drill in drills) {
    seconds += drillSeconds(drill.dose) + 30;
  }
  return (seconds / 60).round().clamp(1, 999);
}

int drillSeconds(Dose dose) {
  final blocks = dose.blocksPerSet;
  final work = switch (dose.mode) {
    DoseMode.time => dose.min * blocks,
    DoseMode.reps => dose.min * 3 * blocks,
    DoseMode.manual => 60,
  };
  return dose.sets * work + (dose.sets - 1) * dose.restSec;
}
