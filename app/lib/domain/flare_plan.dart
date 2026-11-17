enum FlarePlanKind { angle, muscle }

/// A curated stage or muscle plan with a fixed difficulty and authored doses.
class FlarePlan {
  FlarePlan._({
    required this.id,
    required this.kind,
    required this.target,
    required List<int> mirrors,
    required this.tier,
    required List<FlarePlanItem> items,
  }) : mirrors = List.unmodifiable(mirrors),
       items = List.unmodifiable(items);

  final String id;
  final FlarePlanKind kind;

  /// Phase source for angle plans, muscle group ID for muscle plans.
  final Object target;
  int? get phaseSource => kind == FlarePlanKind.angle ? target as int : null;
  String? get groupId => kind == FlarePlanKind.muscle ? target as String : null;
  final List<int> mirrors;
  final int tier;
  final List<FlarePlanItem> items;

  factory FlarePlan.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final kind = switch (json['kind']) {
      'angle' => FlarePlanKind.angle,
      'muscle' => FlarePlanKind.muscle,
      _ => throw const FormatException('Unknown Flare plan kind'),
    };
    final target = json['target'];
    final mirrors = json['mirrors'] ?? const [];
    final tier = json['tier'];
    final items = json['items'];
    if (id is! String ||
        id.isEmpty ||
        (kind == FlarePlanKind.angle && target is! int) ||
        (kind == FlarePlanKind.muscle &&
            (target is! String || target.isEmpty)) ||
        mirrors is! List ||
        mirrors.any((value) => value is! int) ||
        (kind == FlarePlanKind.muscle && mirrors.isNotEmpty) ||
        tier is! int ||
        tier < 1 ||
        tier > 3 ||
        items is! List ||
        items.isEmpty) {
      throw FormatException('Invalid Flare plan: $id');
    }
    return FlarePlan._(
      id: id,
      kind: kind,
      target: target as Object,
      mirrors: mirrors.cast<int>(),
      tier: tier,
      items: [
        for (final item in items)
          FlarePlanItem.fromJson(Map<String, dynamic>.from(item as Map)),
      ],
    );
  }
}

/// An authored exercise and its optional scene-specific substitutions.
class FlarePlanItem {
  const FlarePlanItem._({
    required this.drill,
    required this.dose,
    this.bodyweight,
    this.bodyweightDose,
    this.home,
    this.homeDose,
  });

  final String drill;
  final FlarePlanDose dose;
  final String? bodyweight;
  final FlarePlanDose? bodyweightDose;
  final String? home;
  final FlarePlanDose? homeDose;

  int get sets => dose.sets;
  int? get reps => dose.reps;
  int? get seconds => dose.seconds;
  int get restSeconds => dose.restSeconds;
  bool get perSide => dose.perSide;

  String drillForScene(String tier) => switch (tier) {
    'A' => bodyweight ?? drill,
    'B' => home ?? drill,
    _ => drill,
  };

  FlarePlanDose doseForScene(String tier) => switch (tier) {
    'A' => bodyweightDose ?? dose,
    'B' => homeDose ?? dose,
    _ => dose,
  };

  factory FlarePlanItem.fromJson(Map<String, dynamic> json) {
    final drill = json['drill'];
    if (drill is! String || drill.isEmpty) {
      throw FormatException('Invalid Flare plan item: $drill');
    }

    String? substitution(String key) {
      final value = json[key];
      if (value == null || (value is String && value.isNotEmpty)) {
        return value as String?;
      }
      throw FormatException('Invalid $key for Flare plan item: $drill');
    }

    FlarePlanDose? override(String key) {
      final value = json[key];
      if (value == null) return null;
      if (value is! Map<String, dynamic>) {
        throw FormatException('Invalid $key for Flare plan item: $drill');
      }
      return FlarePlanDose._fromJson(value, '$drill/$key');
    }

    return FlarePlanItem._(
      drill: drill,
      dose: FlarePlanDose._fromJson(json, drill),
      bodyweight: substitution('bodyweight'),
      bodyweightDose: override('bodyweightDose'),
      home: substitution('home'),
      homeDose: override('homeDose'),
    );
  }
}

/// A complete dose, independent of the drill's catalog defaults.
class FlarePlanDose {
  const FlarePlanDose._({
    required this.sets,
    this.reps,
    this.seconds,
    required this.restSeconds,
    required this.perSide,
  });

  final int sets;
  final int? reps;
  final int? seconds;
  final int restSeconds;
  final bool perSide;

  factory FlarePlanDose._fromJson(Map<String, dynamic> json, String label) {
    final sets = json['sets'];
    final reps = json['reps'];
    final seconds = json['seconds'];
    final restSeconds = json['restSeconds'];
    final perSide = json['perSide'] ?? false;
    if (sets is! int ||
        sets < 1 ||
        (reps == null) == (seconds == null) ||
        (reps != null && (reps is! int || reps < 1)) ||
        (seconds != null && (seconds is! int || seconds < 1)) ||
        restSeconds is! int ||
        restSeconds < 0 ||
        perSide is! bool) {
      throw FormatException('Invalid Flare plan dose: $label');
    }
    return FlarePlanDose._(
      sets: sets,
      reps: reps as int?,
      seconds: seconds as int?,
      restSeconds: restSeconds,
      perSide: perSide,
    );
  }
}
