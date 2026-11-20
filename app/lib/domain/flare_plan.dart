enum FlarePlanKind { angle, muscle, warmup, cooldown }

enum FlareStretchPosture { standing, kneeling, seated, supine }

/// A curated plan with authored exercises and doses.
class FlarePlan {
  FlarePlan._({
    required this.id,
    required this.kind,
    required this.target,
    required List<int> mirrors,
    required this.tier,
    this.estimatedMinutes,
    required List<FlarePlanItem> items,
    required List<FlarePlanItem> strengtheningItems,
    required this.strengtheningRounds,
    required this.strengtheningRestSeconds,
    required this.strengtheningRoundRestSeconds,
  }) : mirrors = List.unmodifiable(mirrors),
       items = List.unmodifiable(items),
       strengtheningItems = List.unmodifiable(strengtheningItems);

  final String id;
  final FlarePlanKind kind;

  /// Phase source or muscle group for targeted plans.
  final Object? target;
  int? get phaseSource => kind == FlarePlanKind.angle ? target as int : null;
  String? get groupId => kind == FlarePlanKind.muscle ? target as String : null;
  final List<int> mirrors;
  final int tier;
  final int? estimatedMinutes;
  bool get isSupplemental =>
      kind == FlarePlanKind.warmup || kind == FlarePlanKind.cooldown;
  final List<FlarePlanItem> items;

  final List<FlarePlanItem> strengtheningItems;
  final int strengtheningRounds;
  final int strengtheningRestSeconds;
  final int strengtheningRoundRestSeconds;

  Iterable<FlarePlanItem> get allItems sync* {
    yield* strengtheningItems;
    yield* items;
  }

  /// Use the SDK item ID so reposition times also work after resuming a
  /// partial plan, where block and item indices may change.
  Map<String, FlareStretchPosture> stretchPosturesForScene(String scene) => {
    for (final item in items)
      item.trainingDrillForScene(scene): ?item.posture,
  };

  factory FlarePlan.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final kind = switch (json['kind']) {
      'angle' => FlarePlanKind.angle,
      'muscle' => FlarePlanKind.muscle,
      'warmup' => FlarePlanKind.warmup,
      'cooldown' => FlarePlanKind.cooldown,
      _ => throw const FormatException('Unknown Flare plan kind'),
    };
    final target = json['target'];
    final mirrors = json['mirrors'] ?? const [];
    final supplemental =
        kind == FlarePlanKind.warmup || kind == FlarePlanKind.cooldown;
    final tier = supplemental ? json['tier'] ?? 1 : json['tier'];
    final estimatedMinutes = json['estimatedMinutes'];
    final items = json['items'];
    final strengtheningItems = json['strengtheningItems'] ?? const [];
    final strengtheningRounds = json['strengtheningRounds'] ?? 0;
    final strengtheningRestSeconds = json['strengtheningRestSeconds'] ?? 0;
    final strengtheningRoundRestSeconds =
        json['strengtheningRoundRestSeconds'] ?? 0;
    if (id is! String ||
        id.isEmpty ||
        (kind == FlarePlanKind.angle && target is! int) ||
        (kind == FlarePlanKind.muscle &&
            (target is! String || target.isEmpty)) ||
        mirrors is! List ||
        mirrors.any((value) => value is! int) ||
        (kind != FlarePlanKind.angle && mirrors.isNotEmpty) ||
        (supplemental &&
            (target != null ||
                (kind == FlarePlanKind.warmup && json['tier'] != null) ||
                estimatedMinutes is! int ||
                estimatedMinutes < 1)) ||
        (!supplemental && estimatedMinutes != null) ||
        tier is! int ||
        tier < 1 ||
        tier > 3 ||
        items is! List ||
        items.isEmpty ||
        strengtheningItems is! List ||
        strengtheningRounds is! int ||
        strengtheningRestSeconds is! int ||
        strengtheningRoundRestSeconds is! int ||
        strengtheningRestSeconds < 0 ||
        strengtheningRoundRestSeconds < 0 ||
        (strengtheningItems.isEmpty
            ? strengtheningRounds != 0 ||
                  strengtheningRestSeconds != 0 ||
                  strengtheningRoundRestSeconds != 0
            : kind != FlarePlanKind.cooldown || strengtheningRounds < 2)) {
      throw FormatException('Invalid Flare plan: $id');
    }
    return FlarePlan._(
      id: id,
      kind: kind,
      target: target,
      mirrors: mirrors.cast<int>(),
      tier: tier,
      estimatedMinutes: estimatedMinutes as int?,
      items: [
        for (final item in items)
          FlarePlanItem.fromJson(Map<String, dynamic>.from(item as Map)),
      ],
      strengtheningItems: [
        for (final item in strengtheningItems)
          FlarePlanItem.fromJson(Map<String, dynamic>.from(item as Map)),
      ],
      strengtheningRounds: strengtheningRounds,
      strengtheningRestSeconds: strengtheningRestSeconds,
      strengtheningRoundRestSeconds: strengtheningRoundRestSeconds,
    );
  }
}

/// An authored exercise and its optional scene-specific substitutions.
class FlarePlanItem {
  const FlarePlanItem._({
    required this.drill,
    required this.dose,
    this.trainingDrill,
    this.secondaryStretchDrill,
    this.posture,
    this.bodyweight,
    this.bodyweightDose,
    this.home,
    this.homeDose,
    this.voiceCue,
    this.voiceKey,
    this.safetyNote,
    this.displayName,
    this.displayNameEn,
    required this.usesPlaceholderDemo,
  });

  final String drill;
  final FlarePlanDose dose;

  /// Optional training identity when two movements share one demonstration.
  final String? trainingDrill;
  final String? secondaryStretchDrill;
  final FlareStretchPosture? posture;
  final String? bodyweight;
  final FlarePlanDose? bodyweightDose;
  final String? home;
  final FlarePlanDose? homeDose;
  final String? voiceCue;
  final String? voiceKey;
  final String? safetyNote;

  /// An authored movement name for the plan's presentation.
  final String? displayName;
  final String? displayNameEn;
  final bool usesPlaceholderDemo;

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

  String trainingDrillForScene(String tier) {
    final media = drillForScene(tier);
    return media == drill ? trainingDrill ?? media : media;
  }

  String? secondaryStretchTrainingIdForScene(String tier) =>
      secondaryStretchDrill == null
      ? null
      : '${trainingDrillForScene(tier)}-secondary';

  String? pnfTrainingIdForScene(String tier) =>
      doseForScene(tier).pnfSeconds == null
      ? null
      : '${trainingDrillForScene(tier)}-pnf';

  Map<String, String> trainingMediaIdsForScene(String tier) {
    final media = drillForScene(tier);
    return {
      trainingDrillForScene(tier): media,
      ?secondaryStretchTrainingIdForScene(tier): ?secondaryStretchDrill,
      ?pnfTrainingIdForScene(tier): media,
    };
  }

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

    String? optionalText(String key) {
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

    // TODO: Replace temporary demo IDs when their exact demonstrations
    // are available from Pose-Hub, then remove the placeholder flag.
    final demoPending = json['demoPending'] ?? false;
    final displayName = optionalText('displayName');
    final displayNameEn = optionalText('displayNameEn');
    if (demoPending is! bool ||
        (demoPending && displayName == null) ||
        (displayName == null) != (displayNameEn == null)) {
      throw FormatException('Invalid placeholder demonstration: $drill');
    }

    final posture = switch (json['posture']) {
      null => null,
      'standing' => FlareStretchPosture.standing,
      'kneeling' => FlareStretchPosture.kneeling,
      'seated' => FlareStretchPosture.seated,
      'supine' => FlareStretchPosture.supine,
      _ => throw FormatException('Invalid stretch posture: $drill'),
    };

    final dose = FlarePlanDose._fromJson(json, drill);
    final secondary = optionalText('secondaryStretchDrill');
    if (secondary != null && (dose.seconds == null || dose.seconds! < 2)) {
      throw FormatException(
        'A dual stretch needs at least two seconds: $drill',
      );
    }

    return FlarePlanItem._(
      drill: drill,
      dose: dose,
      trainingDrill: optionalText('trainingDrill'),
      secondaryStretchDrill: secondary,
      posture: posture,
      bodyweight: optionalText('bodyweight'),
      bodyweightDose: override('bodyweightDose'),
      home: optionalText('home'),
      homeDose: override('homeDose'),
      voiceCue: optionalText('voiceCue'),
      voiceKey: optionalText('voiceKey'),
      safetyNote: optionalText('safetyNote'),
      displayName: displayName,
      displayNameEn: displayNameEn,
      usesPlaceholderDemo: demoPending,
    );
  }
}

enum FlarePlanMovement {
  bothCircleDirections,
  alternatingHipSwitch,
  threeWayWristRocks,
}

/// A complete dose, independent of the drill's catalog defaults.
class FlarePlanDose {
  const FlarePlanDose._({
    required this.sets,
    this.reps,
    this.seconds,
    this.holdSeconds,
    this.pnfSeconds,
    this.recommendedMin,
    this.recommendedMax,
    required this.repPositions,
    this.lastPositionHoldSeconds,
    this.rhythm,
    this.movement,
    required this.restSeconds,
    required this.perSide,
  });

  final int sets;
  final int? reps;
  final int? seconds;
  final int? holdSeconds;
  final int? pnfSeconds;
  final int? recommendedMin;
  final int? recommendedMax;
  final List<String> repPositions;
  final int? lastPositionHoldSeconds;
  final Map<String, dynamic>? rhythm;
  final FlarePlanMovement? movement;
  final int restSeconds;
  final bool perSide;

  bool get bothCircleDirections =>
      movement == FlarePlanMovement.bothCircleDirections;

  factory FlarePlanDose._fromJson(Map<String, dynamic> json, String label) {
    final sets = json['sets'];
    final reps = json['reps'];
    final seconds = json['seconds'];
    final holdSeconds = json['holdSeconds'];
    final pnfSeconds = json['pnfSeconds'];
    final recommendedMin = json['recommendedMin'];
    final recommendedMax = json['recommendedMax'];
    final repPositions = json['repPositions'] ?? const [];
    final lastPositionHoldSeconds = json['lastPositionHoldSeconds'];
    final rhythm = json['rhythm'];
    final amount = reps ?? seconds;
    final movement = switch (json['movement']) {
      null => null,
      'bothCircleDirections' => FlarePlanMovement.bothCircleDirections,
      'alternatingHipSwitch' => FlarePlanMovement.alternatingHipSwitch,
      'threeWayWristRocks' => FlarePlanMovement.threeWayWristRocks,
      _ => throw FormatException('Invalid Flare plan movement: $label'),
    };
    final restSeconds = json['restSeconds'];
    final perSide = json['perSide'] ?? false;
    if (sets is! int ||
        sets < 1 ||
        (reps == null) == (seconds == null) ||
        (reps != null && (reps is! int || reps < 1)) ||
        (seconds != null && (seconds is! int || seconds < 1)) ||
        (holdSeconds != null &&
            (holdSeconds is! int || holdSeconds < 1 || reps == null)) ||
        (pnfSeconds != null &&
            (pnfSeconds is! int || pnfSeconds < 1 || seconds == null)) ||
        ((recommendedMin != null || recommendedMax != null) &&
            (recommendedMin is! int ||
                recommendedMax is! int ||
                recommendedMin < 1 ||
                amount is! int ||
                amount < recommendedMin ||
                amount > recommendedMax)) ||
        repPositions is! List ||
        repPositions.any((value) => value is! String || value.isEmpty) ||
        repPositions.toSet().length != repPositions.length ||
        (repPositions.isNotEmpty && reps == null) ||
        (lastPositionHoldSeconds != null &&
            (lastPositionHoldSeconds is! int ||
                lastPositionHoldSeconds < 1 ||
                repPositions.isEmpty)) ||
        (rhythm != null && (rhythm is! Map<String, dynamic> || reps == null)) ||
        restSeconds is! int ||
        restSeconds < 0 ||
        perSide is! bool ||
        switch (movement) {
          FlarePlanMovement.bothCircleDirections ||
          FlarePlanMovement.alternatingHipSwitch => reps == null || !perSide,
          FlarePlanMovement.threeWayWristRocks =>
            seconds is! int || seconds < 3 || perSide,
          null => false,
        }) {
      throw FormatException('Invalid Flare plan dose: $label');
    }
    return FlarePlanDose._(
      sets: sets,
      reps: reps as int?,
      seconds: seconds as int?,
      holdSeconds: holdSeconds as int?,
      pnfSeconds: pnfSeconds as int?,
      recommendedMin: recommendedMin as int?,
      recommendedMax: recommendedMax as int?,
      repPositions: List.unmodifiable(repPositions.cast<String>()),
      lastPositionHoldSeconds: lastPositionHoldSeconds as int?,
      rhythm: rhythm == null
          ? null
          : Map.unmodifiable(rhythm as Map<String, dynamic>),
      movement: movement,
      restSeconds: restSeconds,
      perSide: perSide,
    );
  }
}
