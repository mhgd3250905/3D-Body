import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/engine.dart' as sdk;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart'
    show PoseHubPlanSnapshot;

import '../data/catalog.dart';
import '../domain/training_plan.dart';
import '../domain/training_session.dart';
import 'training_plan_adapter.dart';

/// What the Plans page can truthfully show and, when identified, continue.
/// The SDK owns work and result recording. A follow-up is a new SDK session
/// containing the unfinished actions in their original order.
class FlarePlanResume {
  const FlarePlanResume._({
    required this.title,
    required this.completed,
    required this.total,
    required this.endedAt,
    this.phaseSource,
    this.groupId,
    this.tier,
    this.sceneTier,
    this.authoredPlan,
    this.snapshotId,
    this.planSnapshot,
    this.skipStrengthening = false,
    this.routine,
    this._sourceId,
    this._sessionId,
    this._exerciseIds = const [],
    this._remaining = const [],
  });

  final String title;
  final int completed;
  final int total;
  final DateTime endedAt;
  final int? phaseSource;
  final String? groupId;
  final int? tier;
  final String? sceneTier;
  final FlarePlan? authoredPlan;
  final String? snapshotId;
  final PoseHubPlanSnapshot? planSnapshot;
  final bool skipStrengthening;
  final TrainingRoutine? routine;
  final String? _sourceId;
  final String? _sessionId;
  final List<List<String>> _exerciseIds;
  final List<List<int>> _remaining;

  bool get canContinue => _remaining.any((block) => block.isNotEmpty);

  /// Keep the captured scene, mirrored phase and plan snapshot in the SDK's
  /// persisted [sdk.SessionResult.planId].
  static uc.TrainingPlan recordAuthored(
    uc.TrainingPlan plan, {
    required String sceneTier,
    int? phaseSource,
    String? snapshotId,
  }) {
    final planKey =
        '${Uri.encodeComponent(plan.id)}:$sceneTier:'
        '${phaseSource ?? 0}';
    return plan.copyWith(
      id: snapshotId == null
          ? 'flare-plan-v1:$planKey'
          : 'flare-plan-v2:$planKey:$snapshotId',
    );
  }

  static FlarePlanResume? resolve({
    required Catalog catalog,
    required Iterable<sdk.SessionResult> sessions,
    required Iterable<TrainingRoutine> routines,
    Iterable<TrainingSession> legacySessions = const [],
    String preferredSceneTier = 'A',
    PoseHubPlanSnapshot? restoredSnapshot,
  }) {
    final results = {for (final result in sessions) result.sessionId: result};
    sdk.SessionResult? latest;
    for (final result in results.values) {
      if ((result.completedExercises > 0 || result.workSeconds > 0) &&
          (latest == null || !result.endedAt.isBefore(latest.endedAt))) {
        latest = result;
      }
    }

    TrainingSession? legacy;
    for (final entry in legacySessions) {
      if (entry.id.startsWith('sdk:') ||
          (!entry.completed && entry.activeSeconds == 0) ||
          (latest != null && !entry.endedAt.isAfter(latest.endedAt)) ||
          catalog.drillById(entry.drillId) == null) {
        continue;
      }
      if (legacy == null || !entry.endedAt.isBefore(legacy.endedAt)) {
        legacy = entry;
      }
    }
    if (legacy != null) {
      final drill = catalog.drillById(legacy.drillId)!;
      return FlarePlanResume._(
        title: drill.name,
        completed: legacy.completed ? 1 : 0,
        total: 1,
        endedAt: legacy.endedAt,
        groupId: drill.groupId,
      );
    }
    if (latest == null) return null;

    final recordedTitle = latest.planTitle.trim();
    final drill = catalog.drillById(latest.items.firstOrNull?.exerciseId ?? '');
    final title = recordedTitle.isNotEmpty ? recordedTitle : drill?.name;
    if (title == null || title.isEmpty) return null;
    final chain = _sessionChain(latest, results);
    final identity = chain == null
        ? null
        : _PlanIdentity.parse(chain.last.planId);
    final summary = FlarePlanResume._(
      title: title,
      completed: latest.completedExercises,
      total: latest.totalExercises,
      endedAt: latest.endedAt,
      groupId: drill?.groupId,
      snapshotId: identity?.snapshotId,
    );

    if (chain == null || identity == null) return summary;
    final pinnedSnapshot =
        identity.snapshotId != null &&
            restoredSnapshot?.id == identity.snapshotId &&
            restoredSnapshot?.app == 'flare'
        ? restoredSnapshot
        : null;
    if (identity.snapshotId != null && pinnedSnapshot == null) return summary;
    final target = _resolveTarget(
      identity: identity,
      origin: chain.last,
      catalog: catalog,
      routines: routines,
      preferredSceneTier: preferredSceneTier,
      pinnedSnapshot: pinnedSnapshot,
    );
    if (target == null) return summary;

    final remaining = [
      for (final block in target.exerciseIds)
        List<int>.generate(block.length, (index) => index),
    ];
    for (final result in chain.reversed) {
      if (!_applyResult(result, target.exerciseIds, remaining)) return summary;
    }
    final total = target.exerciseIds.fold(
      0,
      (sum, items) => sum + items.length,
    );
    final unfinished = remaining.fold(0, (sum, items) => sum + items.length);
    return FlarePlanResume._(
      title: title,
      completed: total - unfinished,
      total: total,
      endedAt: latest.endedAt,
      phaseSource: target.phaseSource,
      groupId: target.authoredPlan?.groupId,
      tier: target.authoredPlan?.tier ?? target.routine?.sdkPlan?.level,
      sceneTier: target.sceneTier,
      authoredPlan: target.authoredPlan,
      snapshotId: identity.snapshotId,
      planSnapshot: pinnedSnapshot,
      skipStrengthening: target.skipStrengthening,
      routine: target.routine,
      sourceId: identity.sourceId,
      sessionId: latest.sessionId,
      exerciseIds: target.exerciseIds,
      remaining: remaining,
    );
  }

  /// Reuse the original action definitions, doses, and safety metadata.
  /// The caller rebuilds the authored plan using [sceneTier] or loads the
  /// saved routine. A changed exercise order cannot be resumed by position.
  uc.TrainingPlan? continueFrom(
    uc.TrainingPlan original, {
    Map<String, sdk.Rhythm> rhythms = const {},
  }) {
    if (!canContinue ||
        (original.id != _sourceId && original.id != routine?.id) ||
        original.blocks.length != _exerciseIds.length) {
      return null;
    }
    final blocks = <uc.PlanBlock>[];
    for (final (index, block) in original.blocks.indexed) {
      final expected = _exerciseIds[index];
      if (block.items.length != expected.length ||
          block.items.indexed.any(
            (item) => item.$2.exerciseId != expected[item.$1],
          )) {
        return null;
      }
      final keep = _remaining[index];
      if (keep.isEmpty) continue;
      blocks.add(
        uc.PlanBlock(
          id: block.id,
          name: block.name,
          type: block.type,
          rounds: block.rounds,
          restBetweenRoundsSeconds: block.restBetweenRoundsSeconds,
          items: [for (final itemIndex in keep) block.items[itemIndex]],
        ),
      );
    }
    final resumeKey =
        '${Uri.encodeComponent(_sourceId!)}:${Uri.encodeComponent(_sessionId!)}';
    final followUp = original.copyWith(
      id: snapshotId == null
          ? 'flare-resume-v1:$resumeKey'
          : 'flare-resume-v2:$resumeKey:$snapshotId',
      blocks: blocks,
    );
    final authored = authoredPlan;
    final builder = authored != null && authored.kind == FlarePlanKind.cooldown
        ? FlareCooldownSessionBuilder(
            strengtheningRestSeconds: authored.strengtheningRestSeconds,
            stretchPostures: authored.stretchPosturesForScene(sceneTier ?? 'A'),
            rhythms: rhythms,
          )
        : sdk.SessionBuilder(rhythms: rhythms);
    final seconds = builder.planSeconds(followUp);
    return followUp.copyWith(
      targetMinutes: (seconds / 60).ceil().clamp(1, 1000000),
    );
  }
}

class _PlanIdentity {
  const _PlanIdentity(
    this.sourceId, {
    this.parentId,
    this.sceneTier,
    this.phaseSource,
    this.snapshotId,
  });

  final String sourceId;
  final String? parentId;
  final String? sceneTier;
  final int? phaseSource;
  final String? snapshotId;
  static final _snapshotIdPattern = RegExp(r'^[0-9a-f]{64}$');

  static _PlanIdentity parse(String id) {
    final parts = id.split(':');
    try {
      if (parts.length == 3 && parts[0] == 'flare-resume-v1') {
        return _PlanIdentity(
          Uri.decodeComponent(parts[1]),
          parentId: Uri.decodeComponent(parts[2]),
        );
      }
      if (parts.length == 4 &&
          parts[0] == 'flare-resume-v2' &&
          _snapshotIdPattern.hasMatch(parts[3])) {
        return _PlanIdentity(
          Uri.decodeComponent(parts[1]),
          parentId: Uri.decodeComponent(parts[2]),
          snapshotId: parts[3],
        );
      }
      if (parts.length == 4 &&
          parts[0] == 'flare-plan-v1' &&
          const ['A', 'B', 'C'].contains(parts[2])) {
        return _PlanIdentity(
          Uri.decodeComponent(parts[1]),
          sceneTier: parts[2],
          phaseSource: int.tryParse(parts[3]),
        );
      }
      if (parts.length == 5 &&
          parts[0] == 'flare-plan-v2' &&
          const ['A', 'B', 'C'].contains(parts[2]) &&
          _snapshotIdPattern.hasMatch(parts[4])) {
        return _PlanIdentity(
          Uri.decodeComponent(parts[1]),
          sceneTier: parts[2],
          phaseSource: int.tryParse(parts[3]),
          snapshotId: parts[4],
        );
      }
    } on ArgumentError {
      // A malformed imported ID cannot start a continuation chain.
    } on FormatException {
      // Invalid UTF-8 in an imported escape sequence is also unsupported.
    }
    return _PlanIdentity(id);
  }
}

List<sdk.SessionResult>? _sessionChain(
  sdk.SessionResult latest,
  Map<String, sdk.SessionResult> results,
) {
  final chain = <sdk.SessionResult>[];
  final seen = <String>{};
  final latestIdentity = _PlanIdentity.parse(latest.planId);
  var current = latest;
  while (seen.add(current.sessionId)) {
    chain.add(current);
    final identity = _PlanIdentity.parse(current.planId);
    if (identity.sourceId != latestIdentity.sourceId ||
        identity.snapshotId != latestIdentity.snapshotId) {
      return null;
    }
    final parentId = identity.parentId;
    if (parentId == null) return chain;
    final parent = results[parentId];
    if (parent == null || parent.endedAt.isAfter(current.startedAt)) {
      return null;
    }
    current = parent;
  }
  return null;
}

typedef _Target = ({
  List<List<String>> exerciseIds,
  FlarePlan? authoredPlan,
  TrainingRoutine? routine,
  int? phaseSource,
  String? sceneTier,
  bool skipStrengthening,
});

_Target? _resolveTarget({
  required _PlanIdentity identity,
  required sdk.SessionResult origin,
  required Catalog catalog,
  required Iterable<TrainingRoutine> routines,
  required String preferredSceneTier,
  required PoseHubPlanSnapshot? pinnedSnapshot,
}) {
  final authored = pinnedSnapshot == null
      ? catalog.bundledSupplementalPlanById(identity.sourceId) ??
            [
              ...catalog.flarePlanAngles.expand(catalog.plansForAngle),
              ...catalog.flarePlanMuscles.expand(catalog.plansForMuscle),
            ].where((plan) => plan.id == identity.sourceId).firstOrNull
      : _planInSnapshot(pinnedSnapshot, identity.sourceId);
  if (authored != null) {
    final scenes = authored.isSupplemental
        ? const ['A']
        : identity.sceneTier != null
        ? [identity.sceneTier!]
        : {
            if (const ['A', 'B', 'C'].contains(preferredSceneTier))
              preferredSceneTier,
            'A',
            'B',
            'C',
          };
    final candidates = [
      for (final scene in scenes) ...[
        (scene, false),
        if (authored.kind == FlarePlanKind.cooldown) (scene, true),
      ],
    ];
    // Prefer the recorded movement itself over a historical substitution
    // reference when older logs cannot name the scene directly.
    for (final allowAliases in [false, true]) {
      for (final (scene, skipStrengthening) in candidates) {
        final groups = [
          if (!skipStrengthening && authored.strengtheningItems.isNotEmpty)
            authored.strengtheningItems,
          authored.items,
        ];
        final ids = [
          for (final group in groups)
            [for (final item in group) item.trainingDrillForScene(scene)],
        ];
        final indexes = [
          for (final group in groups)
            List<int>.generate(group.length, (index) => index),
        ];
        if (!_applyResult(origin, ids, indexes, allowAliases: allowAliases)) {
          continue;
        }
        final phases = [
          if (authored.phaseSource case final int source) source,
          ...authored.mirrors,
        ];
        final phaseSource = phases.contains(identity.phaseSource)
            ? identity.phaseSource
            : phases
                      .where(
                        (source) =>
                            catalog.phaseBySource(source)?.name ==
                            origin.planTitle,
                      )
                      .firstOrNull ??
                  authored.phaseSource;
        return (
          exerciseIds: ids,
          authoredPlan: authored,
          routine: null,
          phaseSource: phaseSource,
          sceneTier: scene,
          skipStrengthening: skipStrengthening,
        );
      }
    }
    return null;
  }
  if (pinnedSnapshot != null) return null;

  final matches = routines
      .where((routine) => routine.id == identity.sourceId)
      .toList();
  final beforeStableIds = routines
      .where((routine) => routine.sdkPlan?.id == identity.sourceId)
      .toList();
  final routine = matches.length == 1
      ? matches.single
      : (matches.isEmpty && beforeStableIds.length == 1
            ? beforeStableIds.single
            : null);
  if (routine == null) return null;
  final ids =
      routine.sdkPlan?.blocks
          .map((block) => block.items.map((item) => item.exerciseId).toList())
          .toList() ??
      [routine.drills(catalog).map((drill) => drill.id).toList()];
  return (
    exerciseIds: ids,
    authoredPlan: null,
    routine: routine,
    phaseSource: null,
    sceneTier: null,
    skipStrengthening: false,
  );
}

FlarePlan? _planInSnapshot(PoseHubPlanSnapshot snapshot, String id) {
  try {
    return Catalog.readSupplementalPlans(
      snapshot,
    ).where((plan) => plan.id == id).firstOrNull;
  } on FormatException {
    return null;
  } on TypeError {
    return null;
  }
}

/// Apply only per-action completions. Partial sets or a partially completed
/// side keep the complete action available, so its prescribed dose is intact.
bool _applyResult(
  sdk.SessionResult result,
  List<List<String>> expected,
  List<List<int>> remaining, {
  bool allowAliases = true,
}) {
  final itemResults = {
    for (final item in result.items) (item.blockIndex, item.itemInBlock): item,
  };
  final activeBlocks = remaining.indexed
      .where((block) => block.$2.isNotEmpty)
      .toList();
  final expectedItems = activeBlocks.fold(
    0,
    (sum, block) => sum + block.$2.length,
  );
  if (itemResults.length != expectedItems ||
      itemResults.length != result.items.length) {
    return false;
  }
  for (final (blockIndex, (originalIndex, actionIndexes))
      in activeBlocks.indexed) {
    final unfinished = <int>[];
    for (final (itemIndex, originalItemIndex) in actionIndexes.indexed) {
      final item = itemResults[(blockIndex, itemIndex)];
      final id = expected[originalIndex][originalItemIndex];
      if (item == null ||
          (item.exerciseId != id &&
              (!allowAliases || item.replacedFrom != id))) {
        return false;
      }
      if (item.status != sdk.ItemStatus.completed) {
        unfinished.add(originalItemIndex);
      }
    }
    remaining[originalIndex] = unfinished;
  }
  return true;
}
