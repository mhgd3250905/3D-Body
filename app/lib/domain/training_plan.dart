import 'package:characters/characters.dart';

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

/// A plan's own target for one drill (sets × reps or seconds), kept with a
/// saved set when it came from somewhere other than the drill's default, such
/// as an AI-made plan. Absent means the drill's own prescription applies.
class RoutineDose {
  const RoutineDose({
    required this.sets,
    required this.mode,
    required this.target,
    required this.perSide,
    required this.restSec,
  });

  /// Upper bound for a plan's own set count (AI plans fold rounds into sets).
  /// Training records accept the same bound, so a saved plan can always be
  /// finished and logged.
  static const maxSets = 12;

  final int sets;

  /// Only [DoseMode.time] or [DoseMode.reps].
  final DoseMode mode;

  /// Seconds for time, repetitions for reps.
  final int target;
  final bool perSide;
  final int restSec;

  bool get valid =>
      sets >= 1 &&
      sets <= maxSets &&
      mode != DoseMode.manual &&
      target >= 1 &&
      target <= (mode == DoseMode.time ? 600 : 100) &&
      restSec >= 0 &&
      restSec <= 600;

  /// Chinese prescription in the library's own style: "3 组 × 每侧 12 次".
  String get text {
    final side = perSide ? '每侧 ' : '';
    final unit = mode == DoseMode.time ? '秒' : '次';
    return '$sets 组 × $side$target $unit';
  }

  /// Applies this target to [base]; multi-movement sets (Y-T-W, wrist
  /// flexion + extension) keep their movements.
  Dose apply(Dose base) => Dose(
    sets: sets,
    perSide: perSide,
    mode: mode,
    min: target,
    max: target,
    restSec: restSec,
    raw: text,
    blockLabels: base.blockLabels,
  );

  Map<String, dynamic> toJson() => {
    'sets': sets,
    'mode': mode.name,
    'target': target,
    'perSide': perSide,
    'restSec': restSec,
  };

  static RoutineDose? tryParse(Object? json) {
    if (json is! Map) return null;
    final mode = switch (json['mode']) {
      'time' => DoseMode.time,
      'reps' => DoseMode.reps,
      _ => null,
    };
    final sets = json['sets'], target = json['target'], rest = json['restSec'];
    if (mode == null || sets is! int || target is! int || rest is! int) {
      return null;
    }
    final dose = RoutineDose(
      sets: sets,
      mode: mode,
      target: target,
      perSide: json['perSide'] == true,
      restSec: rest,
    );
    return dose.valid ? dose : null;
  }
}

/// A set the user put together and named, kept on this device.
class TrainingRoutine {
  TrainingRoutine({
    required this.id,
    required this.name,
    required List<String> drillIds,
    Map<String, RoutineDose> doses = const {},
    this.source,
  }) : drillIds = List.unmodifiable(drillIds),
       doses = Map.unmodifiable({
         for (final entry in doses.entries)
           if (drillIds.contains(entry.key) && entry.value.valid)
             entry.key: entry.value,
       });

  final String id;
  final String name;
  final List<String> drillIds;

  /// Per-drill targets that replace the drill's default (only for drills in
  /// this set). Sets built by hand have none.
  final Map<String, RoutineDose> doses;

  /// Where the set came from when not built by hand: 'ai' or 'template'.
  final String? source;

  static const maxName = 24;
  static const maxDrills = 20;

  /// Uses the same visible-character limit as the editor's TextField.
  static String truncateName(String name) =>
      name.characters.take(maxName).toString();

  bool get valid =>
      id.isNotEmpty &&
      name.trim().isNotEmpty &&
      name.characters.length <= maxName &&
      drillIds.isNotEmpty &&
      drillIds.length <= maxDrills &&
      drillIds.toSet().length == drillIds.length;

  /// Drills in order, with this set's own targets applied.
  List<Drill> drills(Catalog catalog) => [
    for (final id in drillIds)
      if (catalog.drillById(id) case final Drill drill)
        switch (doses[id]) {
          final RoutineDose dose => drill.withDose(dose.apply(drill.dose)),
          null => drill,
        },
  ];

  /// Removed drills drop their targets with them.
  TrainingRoutine copyWith({String? name, List<String>? drillIds}) =>
      TrainingRoutine(
        id: id,
        name: name ?? this.name,
        drillIds: drillIds ?? this.drillIds,
        doses: doses,
        source: source,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'drillIds': drillIds,
    if (doses.isNotEmpty)
      'doses': {
        for (final entry in doses.entries) entry.key: entry.value.toJson(),
      },
    'source': ?source,
  };

  factory TrainingRoutine.fromJson(Map<String, dynamic> json) {
    final rawDoses = json['doses'];
    return TrainingRoutine(
      id: json['id'] as String,
      name: json['name'] as String,
      drillIds: (json['drillIds'] as List).cast<String>(),
      doses: {
        if (rawDoses is Map)
          for (final entry in rawDoses.entries)
            if (RoutineDose.tryParse(entry.value) case final RoutineDose dose)
              '${entry.key}': dose,
      },
      source: json['source'] as String?,
    );
  }
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
