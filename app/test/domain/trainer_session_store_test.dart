import 'dart:async';
import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/engine.dart' as sdk;

import 'fixtures.dart';
import 'learning_store_test.dart' show MemoryStorage;

final _start = DateTime.utc(2026, 10, 23, 12);

sdk.ItemResult _item(
  int index, {
  sdk.ItemStatus status = sdk.ItemStatus.completed,
  String exercise = 'abs-A',
  int completed = 1,
  int planned = 1,
  double seconds = 12,
}) => sdk.ItemResult(
  exerciseId: exercise,
  blockIndex: 0,
  itemInBlock: index,
  plannedSets: planned,
  completedSets: completed,
  activeSeconds: seconds,
  status: status,
  plannedSideSets: const {'left': 1, 'right': 1},
  completedSideSets: {'left': completed, 'right': completed},
);

sdk.SessionResult _result({
  String id = 's:test/one',
  List<sdk.ItemResult>? items,
  String title = 'Full plan',
  bool endedEarly = false,
}) => sdk.SessionResult(
  sessionId: id,
  planId: 'plan-1',
  planTitle: title,
  startedAt: _start,
  endedAt: _start.add(const Duration(minutes: 2)),
  activeSeconds: 35,
  endedEarly: endedEarly,
  completedExercises: 1,
  totalExercises: 3,
  items:
      items ??
      [
        _item(0),
        _item(1, status: sdk.ItemStatus.partial, completed: 0, seconds: 5),
        _item(2, status: sdk.ItemStatus.notReached, completed: 0, seconds: 0),
      ],
  discomfort: const [
    sdk.DiscomfortEvent(
      at: 20,
      exerciseId: 'abs-A',
      action: sdk.DiscomfortAction.end,
      blockIndex: 0,
      itemInBlock: 1,
      set: 1,
      side: sdk.Side.right,
      note: 'user reported pain',
    ),
  ],
);

uc.TrainingPlan _plan() => uc.TrainingPlan(
  id: 'circuit',
  source: 'ai',
  title: '完整循环计划',
  goal: 'flare',
  scene: 'home',
  level: 1,
  targetMinutes: 15,
  blocks: const [
    uc.PlanBlock(
      id: 'repeat',
      name: 'Circuit',
      type: uc.BlockType.circuit,
      rounds: 3,
      restBetweenRoundsSeconds: 45,
      items: [
        uc.PlanItem(
          exerciseId: 'abs-A',
          mode: uc.DoseMode.time,
          sets: 1,
          workSeconds: 20,
          perSide: false,
          restSeconds: 10,
        ),
        uc.PlanItem(
          exerciseId: 'abs-A',
          mode: uc.DoseMode.time,
          sets: 1,
          workSeconds: 30,
          perSide: false,
          restSeconds: 15,
        ),
      ],
    ),
    uc.PlanBlock(
      id: 'cool',
      name: 'Cool',
      type: uc.BlockType.cooldown,
      items: [
        uc.PlanItem(
          exerciseId: 'triceps-A',
          mode: uc.DoseMode.reps,
          sets: 1,
          reps: 8,
          perSide: false,
          restSeconds: 20,
        ),
      ],
    ),
  ],
);

uc.TrainingPlan _oneItemPlan(uc.PlanItem item) => _plan().copyWith(
  blocks: [
    uc.PlanBlock(
      id: 'main',
      name: 'Main',
      type: uc.BlockType.main,
      items: [item],
    ),
  ],
);

uc.PlanItem _segmentedItem({int sets = 1, bool perSide = false}) => uc.PlanItem(
  exerciseId: 'scapular-A',
  mode: uc.DoseMode.time,
  sets: sets,
  perSide: perSide,
  restSeconds: 0,
  segments: const [
    uc.PlanSegment(
      id: 'y',
      exerciseId: 'scapular-A',
      label: 'Y',
      mode: uc.DoseMode.time,
      workSeconds: 10,
    ),
    uc.PlanSegment(
      id: 't',
      exerciseId: 'triceps-A',
      label: 'T',
      mode: uc.DoseMode.time,
      workSeconds: 10,
    ),
    uc.PlanSegment(
      id: 'w',
      exerciseId: 'deltoids-A',
      label: 'W',
      mode: uc.DoseMode.time,
      workSeconds: 10,
    ),
  ],
);

sdk.SessionResult _recordEngine(
  String id,
  uc.TrainingPlan plan,
  sdk.SessionEngine engine,
  double elapsed,
) => sdk.SessionRecorder(
  plan: plan,
  totalExercises: 1,
  sessionId: id,
  startedAt: DateTime.utc(2020),
).finish(engine, activeSeconds: elapsed);

void main() {
  final catalog = loadCatalogFixture();
  Future<LearningStore> open(MemoryStorage storage) async {
    final store = LearningStore(catalog: catalog, storage: storage);
    await store.initialize();
    addTearDown(store.dispose);
    return store;
  }

  test(
    'full SDK result and legacy item rows persist together, retry is idempotent',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      final old = TrainingSession(
        id: 'old',
        drillId: 'triceps-A',
        startedAt: _start,
        endedAt: _start.add(const Duration(seconds: 30)),
        activeSeconds: 20,
        completedSets: 1,
        plannedSets: 1,
        pain: false,
        completed: true,
      );
      await store.logSession(old);
      final result = _result();
      await store.saveTrainerSession(result);
      await store.saveTrainerSession(result);
      expect(store.trainerSessions.single.toJson(), result.toJson());
      expect(store.sessions, hasLength(3));
      expect(store.sessions.first.toJson(), old.toJson());
      expect(store.sessions[1].id, 'sdk:s%3Atest%2Fone:b0:i0');
      expect(store.sessions[2].id, 'sdk:s%3Atest%2Fone:b0:i1');
      expect(store.sessions[1].pain, isFalse);
      expect(store.sessions[2].pain, isTrue);
      expect(store.sessions[2].completed, isFalse);
      expect(
        store.totalActiveSeconds,
        37,
      ); // work only, no double-counted session total
      final restored = await open(storage);
      expect(restored.persistenceBlocked, isFalse);
      expect(restored.trainerSessions.single.toJson(), result.toJson());
      expect(
        restored.sessions.map((s) => s.toJson()),
        store.sessions.map((s) => s.toJson()),
      );
      await restored.saveTrainerSession(result);
      expect(restored.sessions, hasLength(3));
    },
  );

  test(
    'historical SDK 0.1 result counters are retained without retroactive repair',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      final result = _result(items: [_item(0)], endedEarly: true);
      await store.saveTrainerSession(result);
      final oldState = jsonDecode(storage.value!) as Map<String, dynamic>;
      final oldResult = (oldState['trainerSessions'] as List).single as Map;
      (((oldResult['items'] as List).single as Map)['completedSideSets']
              as Map)['right'] =
          0;
      oldResult['oldSdkNote'] = 'left-first partial counter before 0.2.0';
      storage.value = jsonEncode(oldState);
      final restored = await open(storage);
      expect(restored.trainerSessionJson.single, oldResult);
      expect(restored.trainerSessions.single.full, isFalse);
      expect(restored.sessions.single.completed, isTrue);
      expect(restored.sessions.single.completedSets, 1);
      expect(
        restored.trainerSessions.single.items.single.completedSideSets['right'],
        0,
      );
      await restored.saveTrainerSession(restored.trainerSessions.single);
      expect(restored.sessions, hasLength(1));
      expect((jsonDecode(storage.value!) as Map)['trainerSessions'], [
        oldResult,
      ]);
    },
  );

  test(
    'SDK 0.2 segments persist one parent row and restore same-session idempotently',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      final plan = _oneItemPlan(_segmentedItem(sets: 2));
      await store.createRoutine('分段计划', [], sdkPlan: plan);
      final builder = sdk.SessionBuilder(prepSeconds: 0, transitionSeconds: 0);
      final engine = sdk.SessionEngine(builder.phases(plan))..update(60);
      final result = _recordEngine('segments-full', plan, engine, 60);
      expect(engine.done, isTrue);
      expect(result.full, isTrue);
      expect(result.items, hasLength(1));
      expect(result.items.single.exerciseId, 'scapular-A');
      expect(result.items.single.completedSets, 2);
      await store.saveTrainerSession(result);
      expect(store.sessions, hasLength(1));
      expect(store.sessions.single.drillId, 'scapular-A');
      expect(store.sessions.single.completedSets, 2);
      expect(store.sessions.single.activeSeconds, 60);
      final restored = await open(storage);
      expect(restored.persistenceBlocked, isFalse);
      expect(restored.routines.single.sdkPlan!.toJson(), plan.toJson());
      await restored.saveTrainerSession(result);
      expect(restored.sessions, hasLength(1));
      expect(restored.trainerSessionJson.single, result.toJson());
    },
  );

  test(
    'skipping a segment keeps parent partial instead of completing a set',
    () async {
      final store = await open(MemoryStorage());
      final plan = _oneItemPlan(_segmentedItem());
      final engine = sdk.SessionEngine(
        sdk.SessionBuilder(prepSeconds: 0, transitionSeconds: 0).phases(plan),
      )..update(10);
      expect(engine.phase.segmentId, 't');
      expect(engine.skipSegment(11), isTrue);
      engine.update(21);
      final result = _recordEngine('segments-partial', plan, engine, 21);
      expect(result.full, isFalse);
      expect(result.items.single.status, sdk.ItemStatus.partial);
      expect(result.items.single.completedSets, 0);
      await store.saveTrainerSession(result);
      expect(store.sessions, hasLength(1));
      expect(store.sessions.single.completed, isFalse);
      expect(store.sessions.single.completedSets, 0);
      expect(store.sessions.single.activeSeconds, 21);
    },
  );

  test(
    'all segments on only one side cannot mark the parent completed',
    () async {
      final store = await open(MemoryStorage());
      final plan = _oneItemPlan(_segmentedItem(perSide: true));
      final engine = sdk.SessionEngine(
        sdk.SessionBuilder(
          prepSeconds: 0,
          transitionSeconds: 0,
          switchSideSeconds: 0,
        ).phases(plan),
      );
      engine.update(50);
      engine.finish(52);
      final result = _recordEngine('segments-partial-side', plan, engine, 52);
      expect(result.items.single.completedSideSets, {'right': 1, 'left': 0});
      expect(result.items.single.completedSets, 0);
      expect(result.items.single.status, sdk.ItemStatus.partial);
      expect(result.full, isFalse);
      await store.saveTrainerSession(result);
      expect(store.sessions, hasLength(1));
      expect(store.sessions.single.completed, isFalse);
      expect(store.trainerSessionJson.single, result.toJson());
    },
  );

  test(
    'left-first and right-first partial sides both save zero completed sets',
    () async {
      final store = await open(MemoryStorage());
      const item = uc.PlanItem(
        exerciseId: 'abs-A',
        mode: uc.DoseMode.time,
        sets: 1,
        workSeconds: 10,
        perSide: true,
        restSeconds: 0,
      );
      final plan = _oneItemPlan(item);
      for (final sides in [
        [sdk.Side.left, sdk.Side.right],
        [sdk.Side.right, sdk.Side.left],
      ]) {
        final engine =
            sdk.SessionEngine([
                for (final side in sides)
                  sdk.SessionPhase(
                    kind: sdk.PhaseKind.work,
                    seconds: 10,
                    exerciseId: item.exerciseId,
                    item: item,
                    itemIndex: 0,
                    blockIndex: 0,
                    itemInBlock: 0,
                    set: 1,
                    sets: 1,
                    side: side,
                  ),
                const sdk.SessionPhase(
                  kind: sdk.PhaseKind.done,
                  seconds: 0,
                  itemIndex: 1,
                ),
              ])
              ..update(10)
              ..finish(12);
        final result = _recordEngine(
          'side-${sides.first.name}',
          plan,
          engine,
          12,
        );
        expect(result.items.single.completedSets, 0);
        expect(result.items.single.status, sdk.ItemStatus.partial);
        expect(result.full, isFalse);
        await store.saveTrainerSession(result);
      }
      expect(store.sessions, hasLength(2));
      expect(
        store.sessions.every((row) => !row.completed && row.completedSets == 0),
        isTrue,
      );
    },
  );

  test(
    'repeating a completed set adds work time but cannot replace an uncompleted set',
    () async {
      final store = await open(MemoryStorage());
      final plan = _oneItemPlan(_segmentedItem(sets: 2));
      final engine = sdk.SessionEngine(
        sdk.SessionBuilder(prepSeconds: 0, transitionSeconds: 0).phases(plan),
      );
      engine.update(30); // All segments of set one; set two begins.
      engine.previous(31);
      engine.update(61); // Repeats the same three completed identities.
      engine.finish(62);
      final result = _recordEngine('segments-repeat', plan, engine, 62);
      expect(result.items.single.plannedSets, 2);
      expect(result.items.single.completedSets, 1);
      expect(result.items.single.activeSeconds, 62);
      expect(result.items.single.status, sdk.ItemStatus.partial);
      expect(result.full, isFalse);
      await store.saveTrainerSession(result);
      await store.saveTrainerSession(result);
      expect(store.sessions, hasLength(1));
      expect(store.sessions.single.completedSets, 1);
      expect(store.sessions.single.completed, isFalse);
    },
  );

  test(
    'SDK skip remains incomplete; final item ends the run; replay has its own history',
    () async {
      final store = await open(MemoryStorage());
      final plan = _plan().copyWith(
        blocks: [
          const uc.PlanBlock(
            id: 'main',
            name: 'Main',
            type: uc.BlockType.main,
            items: [
              uc.PlanItem(
                exerciseId: 'abs-A',
                mode: uc.DoseMode.time,
                sets: 1,
                workSeconds: 10,
                perSide: false,
                restSeconds: 0,
              ),
              uc.PlanItem(
                exerciseId: 'triceps-A',
                mode: uc.DoseMode.time,
                sets: 1,
                workSeconds: 10,
                perSide: false,
                restSeconds: 0,
              ),
              uc.PlanItem(
                exerciseId: 'deltoids-A',
                mode: uc.DoseMode.time,
                sets: 1,
                workSeconds: 10,
                perSide: false,
                restSeconds: 0,
              ),
            ],
          ),
        ],
      );
      final builder = sdk.SessionBuilder(prepSeconds: 0, transitionSeconds: 0);
      sdk.SessionResult record(
        String id,
        sdk.SessionEngine engine,
        double seconds,
      ) => sdk.SessionRecorder(
        plan: plan,
        totalExercises: builder.occurrenceCount(plan),
        sessionId: id,
        startedAt: DateTime.utc(2020),
      ).finish(engine, activeSeconds: seconds);
      final first = sdk.SessionEngine(builder.phases(plan));
      first.update(0); // Pass the SDK's zero-length prep before skipping work.
      first.skip(1);
      first.update(11);
      first.skip(12);
      final skipped = record('first-run', first, 12);
      expect(skipped.items.map((item) => item.status), [
        sdk.ItemStatus.skipped,
        sdk.ItemStatus.completed,
        sdk.ItemStatus.skipped,
      ]);
      expect(first.phase.kind, sdk.PhaseKind.done);
      expect(skipped.full, isFalse);
      await store.saveTrainerSession(skipped);
      expect(store.sessions.map((row) => row.completed), [false, true, false]);
      final replay = sdk.SessionEngine(builder.phases(plan))..update(30);
      final completed = record('second-run', replay, 30);
      expect(replay.phase.kind, sdk.PhaseKind.done);
      expect(completed.full, isTrue);
      await store.saveTrainerSession(completed);
      await store.saveTrainerSession(completed);
      expect(store.trainerSessions, hasLength(2));
      expect(store.sessions, hasLength(6));
      expect(store.sessions.map((row) => row.id).toSet(), hasLength(6));
      expect(store.sessions.skip(3).every((row) => row.completed), isTrue);
    },
  );

  test(
    'failed writes throw, retain both views and retry without duplicates',
    () async {
      final storage = MemoryStorage()..failWrite = true;
      final store = await open(storage);
      await expectLater(store.saveTrainerSession(_result()), throwsStateError);
      expect(store.trainerSessions, hasLength(1));
      expect(store.sessions, hasLength(2));
      expect(store.storageError, isNotNull);
      storage.failWrite = false;
      await store.saveTrainerSession(_result());
      expect(store.storageError, isNull);
      expect(
        (jsonDecode(storage.value!) as Map)['trainerSessions'],
        hasLength(1),
      );
      expect(store.sessions, hasLength(2));
    },
  );

  test(
    'unread and corrupt storage never report SDK save success or overwrite disk',
    () async {
      for (final readFails in [true, false]) {
        final storage = MemoryStorage(value: 'original-invalid-data')
          ..failRead = readFails;
        final store = await open(storage);
        expect(store.persistenceBlocked, isTrue);
        await expectLater(
          store.saveTrainerSession(_result()),
          throwsStateError,
        );
        expect(storage.value, 'original-invalid-data');
        expect(storage.writes, isEmpty);
      }
    },
  );

  test(
    'same-ID different result is rejected without mutating either history',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      await store.saveTrainerSession(_result());
      final encoded = storage.value;
      await expectLater(
        store.saveTrainerSession(_result(title: 'Different')),
        throwsArgumentError,
      );
      expect(storage.value, encoded);
      expect(store.trainerSessions.single.planTitle, 'Full plan');
      expect(store.sessions, hasLength(2));
    },
  );

  test(
    'full archive retains unreachable/unknown/incompatible rows without invalid legacy history',
    () async {
      final store = await open(MemoryStorage());
      final result = _result(
        items: [
          _item(0, exercise: 'not-in-app'),
          _item(1, completed: 2, planned: 1),
          _item(2, status: sdk.ItemStatus.notReached, completed: 0, seconds: 0),
        ],
      );
      await store.saveTrainerSession(result);
      expect(store.trainerSessions.single.toJson(), result.toJson());
      expect(store.sessions, isEmpty);
    },
  );

  test(
    'future SDK fields survive restore, reordered retry and raw backup export',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      await store.saveTrainerSession(_result());
      final state = jsonDecode(storage.value!) as Map<String, dynamic>;
      final row =
          (state['trainerSessions'] as List).single as Map<String, dynamic>;
      row['futureSessionField'] = {'version': 2};
      ((row['items'] as List).first as Map)['futureItemField'] = ['keep'];
      state['trainerSessions'] = [
        Map.fromEntries(row.entries.toList().reversed),
      ];
      storage.value = jsonEncode(state);
      final restored = await open(storage);
      expect(restored.persistenceBlocked, isFalse);
      await restored.saveTrainerSession(restored.trainerSessions.single);
      final backup = restored.trainerSessionJson;
      expect(backup.single, row);
      expect(restored.sessions, hasLength(2));
      backup.single['futureSessionField'] = 'mutated export';
      (backup.single['items'] as List).clear();
      expect(restored.trainerSessionJson.single, row);
      expect((jsonDecode(storage.value!) as Map)['trainerSessions'], [row]);
    },
  );

  test(
    'public SDK snapshots cannot mutate archived collection fields',
    () async {
      final store = await open(MemoryStorage());
      await store.saveTrainerSession(_result());
      final copy = store.trainerSessions.single;
      copy.items.clear();
      copy.discomfort.clear();
      expect(store.trainerSessions.single.items, hasLength(3));
      expect(store.trainerSessions.single.discomfort, hasLength(1));
    },
  );

  test(
    'concurrent same-session saves preserve later ordered state changes',
    () async {
      final hold = Completer<void>();
      final storage = MemoryStorage()..holdFirstWrite = hold;
      final store = await open(storage);
      final first = store.saveTrainerSession(_result());
      final second = store.saveTrainerSession(_result());
      final settings = store.updateSettings(sound: false);
      await Future<void>.delayed(Duration.zero);
      hold.complete();
      await Future.wait([first, second, settings]);
      final restored = await open(storage);
      expect(restored.trainerSessions, hasLength(1));
      expect(restored.sessions, hasLength(2));
      expect(restored.settings.sound, isFalse);
    },
  );

  test(
    'older state without SDK field restores old records unchanged',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      await store.acknowledgeSafety();
      final json = jsonDecode(storage.value!) as Map<String, dynamic>;
      json.remove('trainerSessions');
      json['futureBackupNote'] = 'keep me';
      storage.value = jsonEncode(json);
      final restored = await open(storage);
      expect(restored.trainerSessions, isEmpty);
      expect(restored.persistenceBlocked, isFalse);
      await restored.saveTrainerSession(_result());
      expect(
        (jsonDecode(storage.value!) as Map)['futureBackupNote'],
        'keep me',
      );
    },
  );

  test(
    'adding manual forearms-C uses published timed dose, not a placeholder rep',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      final routine = (await store.createRoutine('腕部', [], sdkPlan: _plan()))!;
      expect(await store.addToRoutine(routine.id, 'forearms-C'), isTrue);
      final plan = store.routineById(routine.id)!.sdkPlan!;
      final added = plan.items.singleWhere(
        (item) => item.exerciseId == 'forearms-C',
      );
      expect(added.mode, uc.DoseMode.time);
      expect(added.workSeconds, 30);
      expect(added.reps, isNull);
      expect(added.sets, 3);
      expect(added.restSeconds, 45);
      expect(plan.blocks.first.toJson(), _plan().blocks.first.toJson());
      expect(plan.blocks.last.type, uc.BlockType.cooldown);
      final restored = await open(storage);
      expect(restored.routines.single.sdkPlan!.toJson(), plan.toJson());
    },
  );

  test(
    'an existing segment material may also be added as one independent parent',
    () async {
      final store = await open(MemoryStorage());
      final original = _oneItemPlan(_segmentedItem());
      final routine = (await store.createRoutine('分段', [], sdkPlan: original))!;
      expect(routine.drillIds, contains('triceps-A'));
      expect(
        original.items.any((item) => item.exerciseId == 'triceps-A'),
        isFalse,
      );
      expect(await store.addToRoutine(routine.id, 'triceps-A'), isTrue);
      final added = store.routineById(routine.id)!.sdkPlan!;
      expect(added.items, hasLength(2));
      expect(added.items.first.toJson(), original.items.single.toJson());
      expect(added.items.last.exerciseId, 'triceps-A');
      await store.addToRoutine(routine.id, 'triceps-A');
      expect(store.routineById(routine.id)!.sdkPlan!.toJson(), added.toJson());
    },
  );

  test(
    'structured routine round-trip, rename, edit and add retain full blocks',
    () async {
      final storage = MemoryStorage();
      final store = await open(storage);
      final plan = _plan();
      final routine = (await store.createRoutine('循环', [], sdkPlan: plan))!;
      expect(routine.drillIds, ['abs-A', 'triceps-A']);
      await store.updateRoutine(routine.id, name: '别名');
      expect(store.routineById(routine.id)!.sdkPlan!.toJson(), plan.toJson());
      expect(
        await store.updateRoutine(routine.id, drillIds: ['abs-A']),
        isFalse,
      );
      await store.addToRoutine(routine.id, 'deltoids-A');
      final appended = store.routineById(routine.id)!.sdkPlan!;
      expect(appended.blocks, hasLength(3));
      expect(appended.blocks.first.toJson(), plan.blocks.first.toJson());
      expect(appended.blocks.last.toJson(), plan.blocks.last.toJson());
      expect(appended.blocks[1].items.single.exerciseId, 'deltoids-A');
      expect(appended.blocks.first.rounds, 3);
      await store.addToRoutine(routine.id, 'abs-A');
      expect(store.routineById(routine.id)!.sdkPlan!.blocks, hasLength(3));
      final edited = appended.copyWith(
        blocks: appended.blocks.reversed.toList(),
      );
      await store.updateRoutine(routine.id, sdkPlan: edited);
      final restored = await open(storage);
      expect(restored.routines.single.sdkPlan!.toJson(), edited.toJson());
      expect(restored.routines.single.name, '别名');
    },
  );
}
