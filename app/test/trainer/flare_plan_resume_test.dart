import 'dart:io';

import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/domain/training_plan.dart';
import 'package:flare/domain/training_session.dart';
import 'package:flare/trainer/flare_plan_resume.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/engine.dart' as sdk;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late Catalog catalog;
  late uc.Catalog source;
  late Map<String, sdk.Rhythm> rhythms;
  setUpAll(() async {
    catalog = await Catalog.load();
    final pack = uc.PoseHubAppTestCatalog.fromBytes(
      File(flarePublicCatalogAsset).readAsBytesSync(),
      semanticCatalogBytes: File(flarePublicSemanticsAsset).readAsBytesSync(),
    );
    rhythms = flarePublicRhythms(pack);
    source = flareCoachCatalogFromPublic(pack, rhythms: rhythms);
  });

  uc.TrainingPlan angle(int phaseSource, int tier, String scene) =>
      trainingPlanFromFlarePlan(
        plan: catalog
            .plansForAngle(phaseSource)
            .singleWhere((plan) => plan.tier == tier),
        title: catalog.phaseBySource(phaseSource)!.name,
        sceneTier: scene,
        catalog: catalog,
        sourceCatalog: source,
        rhythms: rhythms,
      );

  FlarePlanResume? resolve({
    List<sdk.SessionResult> sessions = const [],
    List<TrainingRoutine> routines = const [],
    List<TrainingSession> legacy = const [],
    String preferred = 'A',
  }) => FlarePlanResume.resolve(
    catalog: catalog,
    sessions: sessions,
    routines: routines,
    legacySessions: legacy,
    preferredSceneTier: preferred,
  );

  test('no history and skip-only results have no recent plan', () {
    expect(resolve(), isNull);
    final emptyAttempt = _result(angle(9, 1, 'A'), completed: {});
    expect(resolve(sessions: [emptyAttempt]), isNull);
  });

  test('recent legacy workout is shown without an invented plan', () {
    final ended = DateTime.utc(2026, 11, 17, 13);
    final legacy = TrainingSession(
      id: 'legacy-workout',
      drillId: 'deltoids-A',
      startedAt: ended.subtract(const Duration(minutes: 2)),
      endedAt: ended,
      activeSeconds: 90,
      completedSets: 2,
      plannedSets: 2,
      pain: false,
      completed: true,
    );
    final recent = resolve(
      sessions: [
        _result(angle(9, 1, 'A'), completed: {(0, 0)}),
      ],
      legacy: [legacy],
    )!;
    expect(recent.title, catalog.drillById('deltoids-A')!.name);
    expect((recent.completed, recent.total, recent.endedAt), (1, 1, ended));
    expect(recent.canContinue, isFalse);
  });

  test(
    'an older catalog run recovers its substitution scene from item IDs',
    () {
      final original = angle(11, 2, 'A');
      expect(original.items.any((item) => item.replacedFrom != null), isTrue);
      final recent = resolve(
        sessions: [
          _result(
            original,
            completed: {(0, 0)},
            includeAuthoredReferences: true,
          ),
        ],
        preferred: 'C',
      )!;
      expect(recent.sceneTier, 'A');
      expect(recent.tier, 2);
      expect(recent.phaseSource, 11);
      expect(recent.continueFrom(angle(11, 2, 'C')), isNull);
      expect(
        recent.continueFrom(original)!.items.first,
        same(original.items.elementAt(1)),
      );
    },
  );

  test(
    'a resumed run accumulates position progress only along its own chain',
    () {
      final original = angle(15, 2, 'B');
      final items = original.items.toList();
      final captured = FlarePlanResume.recordAuthored(
        original,
        sceneTier: 'B',
        phaseSource: 15,
      );
      final root = _result(captured, completed: {(0, 0), (0, 2)});
      final first = resolve(sessions: [root])!;
      expect((first.phaseSource, first.sceneTier, first.tier), (15, 'B', 2));
      expect((first.completed, first.total), (2, items.length));
      final continued = first.continueFrom(original, rhythms: rhythms)!;
      expect(continued.items, [items[1], ...items.skip(3)]);
      expect(continued.id, isNot(original.id));
      expect(continued.scene, original.scene);

      final next = _result(continued, attempt: 1, completed: {(0, 0)});
      final second = resolve(sessions: [next, root])!;
      expect(
        (second.completed, second.total, second.phaseSource),
        (3, items.length, 15),
      );
      expect(
        second.continueFrom(original, rhythms: rhythms)!.items,
        items.skip(3),
      );

      final finishPlan = second.continueFrom(original, rhythms: rhythms)!;
      final done = _result(
        finishPlan,
        attempt: 2,
        completed: {
          for (final (index, _) in finishPlan.items.indexed) (0, index),
        },
      );
      final finished = resolve(sessions: [done, root, next])!;
      expect(
        (finished.completed, finished.total),
        (items.length, items.length),
      );
      expect(finished.canContinue, isFalse);
      expect(finished.continueFrom(original), isNull);
      expect(
        resolve(sessions: [next])!.canContinue,
        isFalse,
        reason: 'History has no parent.',
      );
      final restarted = resolve(
        sessions: [
          root,
          next,
          _result(captured, attempt: 3, completed: {(0, 0)}),
        ],
      )!;
      expect(
        restarted.completed,
        1,
        reason: 'A new full run starts a separate chain.',
      );
    },
  );

  test('saved SDK plan can skip a finished block and retain its circuit', () {
    final original = angle(9, 1, 'A');
    final three = original.items.take(3).toList();
    final custom = original.copyWith(
      id: 'previous-sdk-id',
      avoid: {'wrist'},
      notes: ['Keep the saved instructions'],
      safetyNotes: ['Keep the saved safety note'],
      blocks: [
        uc.PlanBlock(
          id: 'warmup',
          name: 'Warm-up',
          type: uc.BlockType.warmup,
          items: [three[0]],
        ),
        uc.PlanBlock(
          id: 'circuit',
          name: 'Circuit',
          type: uc.BlockType.circuit,
          rounds: 2,
          restBetweenRoundsSeconds: 30,
          items: [three[1], three[2]],
        ),
      ],
    );
    final saved = TrainingRoutine(
      id: 'saved:id',
      name: custom.title,
      drillIds: const [],
      sdkPlan: custom,
    );
    final history = _result(custom, completed: {(0, 0)}, partial: (1, 0));
    final resume = resolve(sessions: [history], routines: [saved])!;
    expect(resume.routine, same(saved));
    expect((resume.completed, resume.total), (1, 3));
    final continued = resume.continueFrom(custom.copyWith(id: saved.id))!;
    expect(continued.blocks.single.rounds, 2);
    expect(continued.blocks.single.restBetweenRoundsSeconds, 30);
    expect(continued.items, three.skip(1));
    expect(continued.avoid, custom.avoid);
    expect(continued.notes, custom.notes);
    expect(continued.safetyNotes, custom.safetyNotes);
    final result = _result(continued, attempt: 1, completed: {(0, 0)});
    final second = resolve(sessions: [history, result], routines: [saved])!;
    expect(second.completed, 2);
    expect(second.continueFrom(custom.copyWith(id: saved.id))!.items, [
      three[2],
    ]);
  });
}

sdk.SessionResult _result(
  uc.TrainingPlan plan, {
  required Set<(int, int)> completed,
  (int, int)? partial,
  int attempt = 0,
  bool includeAuthoredReferences = false,
}) {
  final started = DateTime.utc(2026, 11, 17, 8 + attempt);
  return sdk.SessionResult(
    sessionId: 'session:$attempt',
    planId: plan.id,
    planTitle: plan.title,
    startedAt: started,
    endedAt: started.add(const Duration(minutes: 10)),
    activeSeconds: 30,
    endedEarly: completed.length < plan.items.length,
    completedExercises: completed.length,
    totalExercises: plan.items.length,
    items: [
      for (final (blockIndex, block) in plan.blocks.indexed)
        for (final (itemIndex, item) in block.items.indexed)
          sdk.ItemResult(
            exerciseId: item.exerciseId,
            replacedFrom: includeAuthoredReferences ? item.replacedFrom : null,
            blockIndex: blockIndex,
            itemInBlock: itemIndex,
            plannedSets: item.sets,
            completedSets: completed.contains((blockIndex, itemIndex))
                ? item.sets
                : 0,
            activeSeconds:
                completed.contains((blockIndex, itemIndex)) ||
                    partial == (blockIndex, itemIndex)
                ? 20
                : 0,
            status: completed.contains((blockIndex, itemIndex))
                ? sdk.ItemStatus.completed
                : partial == (blockIndex, itemIndex)
                ? sdk.ItemStatus.partial
                : sdk.ItemStatus.notReached,
          ),
    ],
  );
}
