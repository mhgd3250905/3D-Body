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

/// A plan's dose is independent of the drill's default and survives substitution.
class FlarePlanItem {
  const FlarePlanItem._({
    required this.drill,
    required this.sets,
    this.reps,
    this.seconds,
    required this.restSeconds,
    required this.perSide,
    this.bodyweight,
  });

  final String drill;
  final int sets;
  final int? reps;
  final int? seconds;
  final int restSeconds;
  final bool perSide;
  final String? bodyweight;

  String drillForScene(String tier) =>
      tier == 'A' ? bodyweight ?? drill : drill;

  factory FlarePlanItem.fromJson(Map<String, dynamic> json) {
    final drill = json['drill'];
    final sets = json['sets'];
    final reps = json['reps'];
    final seconds = json['seconds'];
    final restSeconds = json['restSeconds'];
    final perSide = json['perSide'] ?? false;
    final bodyweight = json['bodyweight'];
    if (drill is! String ||
        drill.isEmpty ||
        sets is! int ||
        sets < 1 ||
        (reps == null) == (seconds == null) ||
        (reps != null && (reps is! int || reps < 1)) ||
        (seconds != null && (seconds is! int || seconds < 1)) ||
        restSeconds is! int ||
        restSeconds < 0 ||
        perSide is! bool ||
        (bodyweight != null && (bodyweight is! String || bodyweight.isEmpty))) {
      throw FormatException('Invalid Flare plan item: $drill');
    }
    return FlarePlanItem._(
      drill: drill,
      sets: sets,
      reps: reps as int?,
      seconds: seconds as int?,
      restSeconds: restSeconds,
      perSide: perSide,
      bodyweight: bodyweight as String?,
    );
  }
}
