import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

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
          // The SDK definition owns per-side; the prescription text only
          // suggests it (r2-v1 made forearms-B unilateral).
          perSide: sourceCatalog?[drill.id]?.unilateral ?? d.perSide,
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

// Keep 12 warm-up moves close to nine minutes at their authored doses.
const flareWarmupTransitionSeconds = 5;

/// Resolve the authored drill and dose for the chosen scene before scheduling.
uc.TrainingPlan trainingPlanFromFlarePlan({
  required FlarePlan plan,
  required String title,
  required String sceneTier,
  required Catalog catalog,
  required uc.Catalog sourceCatalog,
  Map<String, sdk.Rhythm> rhythms = const {},
  bool skipStrengthening = false,
  List<String> wristDirections = const ['手指朝前', '手指朝侧', '手指朝后', '手背撑地'],
  ({String clockwise, String counterclockwise}) circleDirections = const (
    clockwise: '顺时针',
    counterclockwise: '逆时针',
  ),
}) {
  if (wristDirections.length != 4) {
    throw ArgumentError('Four wrist directions required');
  }
  final authoredItems = skipStrengthening ? plan.items : plan.allItems;
  final trainingMedia = <String, String>{
    for (final item in authoredItems)
      ...item.trainingMediaIdsForScene(sceneTier),
  };
  final unknown = trainingMedia.values
      .where((id) => sourceCatalog[id] == null)
      .toSet();
  if (unknown.isNotEmpty) throw UnknownTrainingDrills(unknown);

  final items = <uc.PlanItem>[];
  for (final authored in authoredItems) {
    final mediaId = authored.drillForScene(sceneTier);
    final id = authored.trainingDrillForScene(sceneTier);
    final dose = authored.doseForScene(sceneTier);
    final workSeconds = dose.seconds;
    final item = uc.PlanItem(
      exerciseId: id,
      mode: workSeconds == null ? uc.DoseMode.reps : uc.DoseMode.time,
      sets: dose.sets,
      reps: dose.reps,
      workSeconds: workSeconds,
      perSide: dose.perSide,
      restSeconds: dose.restSeconds,
      replacedFrom: mediaId == authored.drill ? null : authored.drill,
    );
    if (dose.bothCircleDirections) {
      items.add(
        item.copyWith(
          segments: [
            uc.PlanSegment(
              id: 'clockwise',
              exerciseId: id,
              label: circleDirections.clockwise,
              mode: item.mode,
              reps: item.reps,
            ),
            uc.PlanSegment(
              id: 'counterclockwise',
              exerciseId: id,
              label: circleDirections.counterclockwise,
              mode: item.mode,
              reps: item.reps,
            ),
          ],
        ),
      );
      continue;
    }
    if (dose.movement == FlarePlanMovement.alternatingHipSwitch) {
      // The source pose is held. Schedule both directions per count for this
      // authored 90/90 switch while continuing to use its published media.
      items.add(
        item.copyWith(
          segments: [
            uc.PlanSegment(
              id: 'hip-switches',
              exerciseId: id,
              mode: item.mode,
              reps: item.reps,
              rhythm: const {
                'kind': 'rep_alternate',
                'repUnit': 'left+right',
                'phases': 'go=2s; hold=1s',
              },
            ),
          ],
        ),
      );
      continue;
    }
    final explicitSegments = _authoredDoseSegments(
      authored,
      dose,
      item,
      sceneTier,
    );
    if (explicitSegments.isNotEmpty) {
      items.add(item.copyWith(segments: explicitSegments));
      continue;
    }

    // A counted catalog rhythm can stretch a time budget to fit its default
    // reps. These prescribed holds use elapsed time, including substitutions
    // whose catalog entries normally count reps.
    final usesTimedHold =
        workSeconds != null &&
        (rhythms[id]?.counted == true ||
            sourceCatalog[id]?.defaultDose.mode == uc.DoseMode.reps);
    final drill = catalog.drillById(id);
    final segmented = drill == null
        ? item
        : _withSegments(
            item,
            drill,
            wristDirections,
            splitWorkSeconds: true,
            forceTimedHold: usesTimedHold,
            wristRockPositions:
                dose.movement == FlarePlanMovement.threeWayWristRocks ? 3 : 4,
          );
    items.add(
      usesTimedHold && segmented.segments.isEmpty
          ? item.copyWith(
              segments: [
                uc.PlanSegment(
                  id: 'timed-dose',
                  exerciseId: id,
                  mode: item.mode,
                  workSeconds: workSeconds,
                  rhythm: const {'kind': 'hold'},
                ),
              ],
            )
          : segmented,
    );
  }

  final strengtheningCount = skipStrengthening
      ? 0
      : plan.strengtheningItems.length;
  final isCooldown = plan.kind == FlarePlanKind.cooldown;
  final result = uc.TrainingPlan(
    id: plan.id,
    source: 'template',
    templateId: plan.id,
    title: title,
    goal: 'flare',
    scene: sceneTier == 'C' ? 'gym' : 'home',
    level: plan.tier,
    targetMinutes: 1,
    blocks: [
      if (strengtheningCount > 0)
        uc.PlanBlock(
          id: 'strengthening',
          name: title,
          type: uc.BlockType.circuit,
          rounds: plan.strengtheningRounds,
          restBetweenRoundsSeconds: plan.strengtheningRoundRestSeconds,
          items: items.take(strengtheningCount).toList(),
        ),
      uc.PlanBlock(
        id: isCooldown ? 'stretching' : plan.id,
        name: title,
        type: isCooldown ? uc.BlockType.cooldown : uc.BlockType.main,
        items: items.skip(strengtheningCount).toList(),
      ),
    ],
  );
  validateTrainingPlan(result, catalog, known: trainingMedia.containsKey);
  final builder = isCooldown
      ? FlareCooldownSessionBuilder(
          strengtheningRestSeconds: plan.strengtheningRestSeconds,
          stretchPostures: plan.stretchPosturesForScene(sceneTier),
          rhythms: rhythms,
        )
      : sdk.SessionBuilder(
          rhythms: rhythms,
          transitionSeconds: plan.kind == FlarePlanKind.warmup
              ? flareWarmupTransitionSeconds
              : 15,
        );
  final estimate = builder.planSeconds(result);
  return result.copyWith(
    targetMinutes: (estimate / 60).ceil().clamp(1, 1000000),
  );
}

List<uc.PlanSegment> _authoredDoseSegments(
  FlarePlanItem authored,
  FlarePlanDose dose,
  uc.PlanItem item,
  String scene,
) {
  if (authored.secondaryStretchTrainingIdForScene(scene)
      case final secondary?) {
    final seconds = dose.seconds!;
    final firstPositionSeconds = (seconds + 1) ~/ 2;
    return [
      uc.PlanSegment(
        id: 'wrist-flexed',
        exerciseId: item.exerciseId,
        label: '手背朝前',
        mode: uc.DoseMode.time,
        workSeconds: firstPositionSeconds,
        rhythm: const {'kind': 'hold'},
      ),
      uc.PlanSegment(
        id: 'wrist-extended',
        exerciseId: secondary,
        label: '掌心朝前',
        mode: uc.DoseMode.time,
        workSeconds: seconds - firstPositionSeconds,
        rhythm: const {'kind': 'hold'},
      ),
    ];
  }
  final workSegments = [
    for (final segment in dose.workSegments)
      uc.PlanSegment(
        id: segment.id,
        exerciseId: item.exerciseId,
        label: segment.label,
        mode: segment.reps == null ? uc.DoseMode.time : uc.DoseMode.reps,
        reps: segment.reps,
        workSeconds: segment.seconds,
        rhythm: segment.seconds != null
            ? const {'kind': 'hold'}
            : segment.rhythm,
      ),
  ];
  if (authored.pnfTrainingIdForScene(scene) case final pnf?) {
    return [
      if (workSegments.isEmpty)
        uc.PlanSegment(
          id: 'stretch-hold',
          exerciseId: item.exerciseId,
          mode: uc.DoseMode.time,
          workSeconds: dose.seconds,
          rhythm: const {'kind': 'hold'},
        )
      else
        ...workSegments,
      uc.PlanSegment(
        id: 'pnf-press',
        exerciseId: pnf,
        label: 'PNF',
        mode: uc.DoseMode.time,
        workSeconds: dose.pnfSeconds,
        rhythm: const {'kind': 'hold'},
      ),
    ];
  }
  if (workSegments.isNotEmpty) return workSegments;
  if (dose.repPositions.isNotEmpty) {
    return [
      for (final (index, label) in dose.repPositions.indexed)
        uc.PlanSegment(
          id: label.toLowerCase(),
          exerciseId: item.exerciseId,
          label: label,
          mode: uc.DoseMode.reps,
          reps: dose.reps,
          holdSeconds: index == dose.repPositions.length - 1
              ? dose.lastPositionHoldSeconds ?? dose.holdSeconds
              : dose.holdSeconds,
        ),
    ];
  }
  if (dose.holdSeconds == null && dose.rhythm == null) return const [];
  return [
    uc.PlanSegment(
      id: dose.holdSeconds == null ? 'authored-tempo' : 'peak-hold',
      exerciseId: item.exerciseId,
      mode: item.mode,
      reps: item.reps,
      holdSeconds: dose.holdSeconds,
      rhythm: dose.rhythm,
    ),
  ];
}

/// Use fixed repositioning and side-change times for the cooldown plans.
class FlareCooldownSessionBuilder extends sdk.SessionBuilder {
  FlareCooldownSessionBuilder({
    required int strengtheningRestSeconds,
    this.stretchPostures = const {},
    super.rhythms,
    super.known,
    super.prepSeconds,
    super.switchSecondsFor,
    super.prepSecondsFor,
    super.voiceGuideFor,
    super.guideSideSwitchSecondsFor,
  }) : super(transitionSeconds: strengtheningRestSeconds);

  final Map<String, FlareStretchPosture> stretchPostures;

  @override
  double workSeconds(uc.PlanItem item, [sdk.Rhythm? rhythm]) {
    final effective = rhythm ?? rhythmOf(item);
    if (item.mode == uc.DoseMode.reps &&
        effective.counted &&
        !effective.derived) {
      // Keep the authored cadence, including any hold or lowering phase.
      // The SDK normally rounds a set up and distributes the extra time.
      return effective.lead +
          (item.reps ?? effective.defaultReps ?? 1) * effective.cycleFor();
    }
    return super.workSeconds(item, effective);
  }

  @override
  List<sdk.SessionPhase> phases(uc.TrainingPlan plan) =>
      _cooldownPhases(plan, super.phases(plan)).toList();

  @override
  double planSeconds(uc.TrainingPlan plan, {double? sideSwitchMargin}) {
    // Use the same SDK scheduling without its prep callback, which calls
    // planSeconds to size the welcome voice line.
    final estimateBuilder = prepSecondsFor == null
        ? this
        : FlareCooldownSessionBuilder(
            strengtheningRestSeconds: transitionSeconds,
            stretchPostures: stretchPostures,
            rhythms: rhythms,
            known: known,
            voiceGuideFor: voiceGuideFor,
          );
    return estimateBuilder
        .phases(plan)
        .where((phase) => phase.kind != sdk.PhaseKind.prep)
        .fold(0.0, (sum, phase) => sum + phase.seconds);
  }

  Iterable<sdk.SessionPhase> _cooldownPhases(
    uc.TrainingPlan plan,
    List<sdk.SessionPhase> phases,
  ) sync* {
    bool isStretch(sdk.SessionPhase phase) =>
        phase.blockIndex >= 0 &&
        plan.blocks[phase.blockIndex].type == uc.BlockType.cooldown;
    final active = <sdk.SessionPhase>[];
    sdk.SessionPhase? previousWork;
    for (final phase in phases) {
      if (phase.isWork) previousWork = phase;
      if (phase.kind == sdk.PhaseKind.switchSide) {
        // Voice callbacks can never widen a side switch.
        active.add(phase.withSeconds(5));
      } else if (phase.kind == sdk.PhaseKind.rest) {
        final next = phase.nextItem;
        // A set within one exercise advances directly.
        if (next == null) continue;
        final fromPosture = stretchPostures[phase.doneExerciseId];
        final sameStretchPosture =
            previousWork != null &&
            isStretch(previousWork) &&
            isStretch(phase) &&
            fromPosture != null &&
            fromPosture == stretchPostures[next.exerciseId];
        active.add(sameStretchPosture ? phase.withSeconds(5) : phase);
      } else {
        active.add(phase);
      }
    }
    for (var i = 0; i < active.length; i++) {
      final first = active[i];
      if (i + 2 < active.length &&
          first.isWork &&
          first.side == sdk.Side.right &&
          first.segment?.rhythm?['startingSide'] == 'left') {
        final switchSide = active[i + 1];
        final leftWork = active[i + 2];
        if (switchSide.kind == sdk.PhaseKind.switchSide &&
            leftWork.isWork &&
            leftWork.side == sdk.Side.left &&
            leftWork.itemIndex == first.itemIndex &&
            leftWork.segmentId == first.segmentId &&
            leftWork.set == first.set) {
          // An authored single-side segment may use the left-side demo first.
          // The SDK builds right-first phases for all segmented side changes.
          yield leftWork;
          yield sdk.SessionPhase(
            kind: sdk.PhaseKind.switchSide,
            seconds: switchSide.seconds,
            exerciseId: switchSide.exerciseId,
            item: switchSide.item,
            itemIndex: switchSide.itemIndex,
            blockIndex: switchSide.blockIndex,
            itemInBlock: switchSide.itemInBlock,
            set: switchSide.set,
            sets: switchSide.sets,
            round: switchSide.round,
            rounds: switchSide.rounds,
            side: sdk.Side.right,
            blockName: switchSide.blockName,
            rhythm: switchSide.rhythm,
            segmentId: switchSide.segmentId,
            segment: switchSide.segment,
            afterGuidedSet: switchSide.afterGuidedSet,
          );
          yield first;
          i += 2;
          continue;
        }
      }
      if (i + 5 < active.length &&
          first.isWork &&
          first.side == sdk.Side.right &&
          isStretch(first) &&
          (first.item?.segments.length == 2)) {
        final phases = active.sublist(i, i + 6);
        if (phases.every(
              (phase) =>
                  phase.itemIndex == first.itemIndex && phase.set == first.set,
            ) &&
            phases[1].kind == sdk.PhaseKind.switchSide &&
            phases[2].isWork &&
            phases[3].isWork &&
            phases[4].kind == sdk.PhaseKind.switchSide &&
            phases[5].isWork) {
          // The SDK schedules both sides of each segment. Finish both parts
          // on the right before moving to the left once.
          for (final index in [0, 3, 1, 2, 5]) {
            yield phases[index];
          }
          i += 5;
          continue;
        }
      }
      yield first;
    }
  }
}

/// [known] admits the shared public scope in addition to Flare's own drills.
void validateTrainingPlan(
  uc.TrainingPlan plan,
  Catalog catalog, {
  bool Function(String id)? known,
}) {
  if (plan.items.isEmpty) throw const FormatException('Empty training plan');
  final unknown = plan.exerciseIds
      .where((id) => catalog.drillById(id) == null && known?.call(id) != true)
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
  if (catalog == null) return builder.planSeconds(plan);
  try {
    return builder.planSeconds(
      expandSegmentedTrainingPlan(plan, catalog, known: (_) => true),
    );
  } on Object {
    return builder.planSeconds(plan);
  }
}

/// SDK 0.2 owns segment identity, per-set order and completion accounting.
/// Reuse existing composite demonstrations, not invented segment-specific media.
/// Explicit segments and their chosen material ids are preserved unchanged.
uc.TrainingPlan expandSegmentedTrainingPlan(
  uc.TrainingPlan plan,
  Catalog catalog, {
  List<String> wristDirections = const ['手指朝前', '手指朝侧', '手指朝后', '手背撑地'],
  bool Function(String id)? known,
}) {
  validateTrainingPlan(plan, catalog, known: known);
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
              // Shared public actions keep their SDK-authored item unchanged.
              if (catalog.drillById(item.exerciseId) case final Drill drill)
                _withSegments(item, drill, wristDirections)
              else
                item,
          ],
        ),
    ],
  );
}

uc.PlanItem _withSegments(
  uc.PlanItem item,
  Drill drill,
  List<String> wristDirections, {
  bool splitWorkSeconds = false,
  bool forceTimedHold = false,
  int wristRockPositions = 4,
}) {
  if (item.segments.isNotEmpty) return item;
  final labels = switch (item.exerciseId) {
    'forearms-A' => wristDirections.take(wristRockPositions).toList(),
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
  final seconds = item.workSeconds;
  // Keep the authored total work budget when breaking a hold into positions.
  if (splitWorkSeconds && seconds != null && seconds < labels.length) {
    return item;
  }
  return item.copyWith(
    segments: [
      for (final (index, label) in labels.indexed)
        uc.PlanSegment(
          id: ids[index],
          exerciseId: item.exerciseId,
          label: label,
          mode: item.mode,
          reps: item.reps,
          workSeconds: splitWorkSeconds && seconds != null
              ? seconds ~/ labels.length +
                    (index < seconds % labels.length ? 1 : 0)
              : seconds,
          rhythm: forceTimedHold ? const {'kind': 'hold'} : null,
        ),
    ],
  );
}
