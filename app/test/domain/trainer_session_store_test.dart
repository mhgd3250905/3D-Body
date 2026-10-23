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
  completedSideSets: const {'left': 1, 'right': 0},
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
    'SDK completion inconsistencies remain unchanged, not repaired in App',
    () async {
      final store = await open(MemoryStorage());
      final result = _result(items: [_item(0)], endedEarly: true);
      await store.saveTrainerSession(result);
      expect(store.trainerSessions.single.toJson(), result.toJson());
      expect(store.trainerSessions.single.full, isFalse);
      expect(store.sessions.single.completed, isTrue);
      expect(store.sessions.single.completedSets, 1);
      expect(
        store.trainerSessions.single.items.single.completedSideSets['right'],
        0,
      );
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
