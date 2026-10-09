import 'dart:async';
import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/domain/assessment.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fixtures.dart';

class MemoryStorage implements LocalStateStorage {
  MemoryStorage({this.value});
  String? value;
  bool failRead = false;
  bool failWrite = false;
  Completer<void>? holdFirstWrite;
  final writes = <String>[];

  @override
  Future<String?> read(String key) async {
    if (failRead) throw StateError('Read unavailable');
    return value;
  }

  @override
  Future<void> write(String key, String value) async {
    if (failWrite) throw StateError('Write unavailable');
    writes.add(value);
    if (writes.length == 1 && holdFirstWrite != null) {
      await holdFirstWrite!.future;
    }
    this.value = value;
  }
}

void main() {
  final catalog = loadCatalogFixture();
  final day = DateTime(2026, 10, 8, 18);

  test('expert assessment IDs and exact dips count boundaries stay intact', () {
    expect(LearningStore.assessmentIds, {
      'wrist',
      'pike',
      'straddle',
      'dips',
      'lsit',
    });
    for (final count in [0, 3]) {
      expect(assessmentGradeForDips(count), 1);
    }
    for (final count in [4, 7]) {
      expect(assessmentGradeForDips(count), 2);
    }
    for (final count in [8, 12]) {
      expect(assessmentGradeForDips(count), 3);
    }
    for (final count in [13, 50]) {
      expect(assessmentGradeForDips(count), 4);
    }
    expect(() => assessmentGradeForDips(-1), throwsArgumentError);
  });

  TrainingSession session({
    String id = 'work-1',
    String drillId = 'deltoids-A',
    int sets = 3,
    bool completed = true,
    bool pain = false,
  }) => TrainingSession(
    id: id,
    drillId: drillId,
    startedAt: day.subtract(const Duration(minutes: 2)),
    endedAt: day,
    activeSeconds: 30,
    completedSets: sets,
    plannedSets: 3,
    pain: pain,
    completed: completed,
  );

  test(
    'settings, last frame, deduplicated dated plan and self-reports restore',
    () async {
      var now = day;
      final storage = MemoryStorage();
      final store = LearningStore(
        catalog: catalog,
        storage: storage,
        now: () => now,
      );
      await Future.wait([store.initialize(), store.initialize()]);
      expect(store.safetyAccepted, isFalse);
      await store.acknowledgeSafety();
      await store.updateSettings(tier: 'B', speed: 0.25, weeklyGoal: 4);
      await store.setLastTime(2.15);
      await store.addToToday('deltoids-A');
      await store.addToToday('deltoids-A');
      await store.addToToday('serratus-A');
      await store.completeLesson('stage-1-lesson-1');
      await store.reportGate('compression20', true);
      expect(store.todayIds, ['deltoids-A', 'serratus-A']);
      final restored = LearningStore(
        catalog: catalog,
        storage: storage,
        now: () => now,
      );
      await restored.initialize();
      expect(restored.safetyAccepted, isTrue);
      expect(restored.settings.tier, 'B');
      expect(restored.settings.speed, 0.25);
      expect(restored.settings.weeklyGoal, 4);
      expect(restored.lastTime, 2.15);
      expect(restored.todayIds, store.todayIds);
      expect(restored.completedLessonIds, contains('stage-1-lesson-1'));
      expect(restored.gateReports['compression20'], isTrue);
      now = DateTime(2026, 10, 9, 1);
      expect(store.todayIds, isEmpty);
      await store.addToToday('forearms-A');
      expect(store.todayIds, ['forearms-A']);
      await store.removeFromToday('forearms-A');
      expect(store.todayIds, isEmpty);
      expect(() => store.updateSettings(speed: 0.8), throwsArgumentError);
      expect(() => store.addToToday('fictional-drill'), throwsArgumentError);
    },
  );

  test(
    'completed and interrupted session saves are idempotent and never pass gates',
    () async {
      final storage = MemoryStorage();
      final store = LearningStore(
        catalog: catalog,
        storage: storage,
        now: () => day,
      );
      await store.initialize();
      await store.logSession(session());
      await store.logSession(session());
      await store.logSession(
        session(id: 'pain-stop', sets: 0, completed: false, pain: true),
      );
      expect(store.sessions, hasLength(2));
      expect(store.sessions.last.pain, isTrue);
      expect(store.completedTodayIds, {'deltoids-A'});
      expect(store.todayActiveSeconds, 60);
      expect(store.completedLessonIds, isEmpty);
      expect(store.gateReports, isEmpty);
      expect(store.streakDays, 1);
      expect(store.weekTrainingDays, 1);
      final restored = LearningStore(
        catalog: catalog,
        storage: storage,
        now: () => day,
      );
      await restored.initialize();
      expect(restored.sessions, hasLength(2));
      expect(restored.sessions.first.startedAt.isUtc, isTrue);
      expect(
        () => store.logSession(session(id: 'work-1', pain: true)),
        throwsArgumentError,
      );
      expect(
        () => store.logSession(session(id: 'invalid', sets: 1)),
        throwsArgumentError,
      );
    },
  );

  test(
    'malformed, partial, unknown-version and invalid-reference data are preserved',
    () async {
      for (final original in [
        '{unfinished',
        '{"version":9}',
        '{"version":1}',
      ]) {
        final storage = MemoryStorage(value: original);
        final store = LearningStore(
          catalog: catalog,
          storage: storage,
          now: () => day,
        );
        await store.initialize();
        expect(store.corruptState, isTrue);
        expect(store.storageError, isNotNull);
        expect(await store.acknowledgeSafety(), isFalse);
        expect(await store.logSession(session()), isFalse);
        expect(await store.retrySave(), isFalse);
        expect(storage.value, original);
        expect(storage.writes, isEmpty);
      }
      final validStorage = MemoryStorage();
      final valid = LearningStore(
        catalog: catalog,
        storage: validStorage,
        now: () => day,
      );
      await valid.initialize();
      await valid.acknowledgeSafety();
      final json = jsonDecode(validStorage.value!) as Map<String, dynamic>;
      json['completedLessonIds'] = ['missing-lesson'];
      final original = jsonEncode(json);
      final storage = MemoryStorage(value: original);
      final store = LearningStore(catalog: catalog, storage: storage);
      await store.initialize();
      expect(store.corruptState, isTrue);
      expect(store.completedLessonIds, isEmpty);
      await store.retrySave();
      expect(storage.value, original);
    },
  );

  test('unread storage cannot be replaced by a default snapshot', () async {
    final storage = MemoryStorage(value: 'existing-data')..failRead = true;
    final store = LearningStore(catalog: catalog, storage: storage);
    await store.initialize();
    expect(store.persistenceBlocked, isTrue);
    expect(store.corruptState, isFalse);
    expect(await store.addToToday('deltoids-A'), isFalse);
    expect(storage.value, 'existing-data');
    expect(storage.writes, isEmpty);
  });

  test(
    'failed writes keep unsaved changes in memory and retry without duplicate rows',
    () async {
      final storage = MemoryStorage()..failWrite = true;
      final store = LearningStore(
        catalog: catalog,
        storage: storage,
        now: () => day,
      );
      await store.initialize();
      expect(await store.logSession(session()), isFalse);
      expect(store.sessions, hasLength(1));
      expect(store.storageError, isNotNull);
      storage.failWrite = false;
      expect(await store.logSession(session()), isTrue);
      expect(store.sessions, hasLength(1));
      expect(store.storageError, isNull);
      final restored = LearningStore(
        catalog: catalog,
        storage: storage,
        now: () => day,
      );
      await restored.initialize();
      expect(restored.sessions, hasLength(1));
    },
  );

  test(
    'serialized saves cannot let an older delayed snapshot erase newer state',
    () async {
      final hold = Completer<void>();
      final storage = MemoryStorage()..holdFirstWrite = hold;
      final store = LearningStore(
        catalog: catalog,
        storage: storage,
        now: () => day,
      );
      await store.initialize();
      final first = store.acknowledgeSafety();
      final second = store.addToToday('deltoids-A');
      final third = store.logSession(session());
      await Future<void>.delayed(Duration.zero);
      expect(storage.writes, hasLength(1));
      hold.complete();
      expect(await Future.wait([first, second, third]), everyElement(isTrue));
      final saved = jsonDecode(storage.value!) as Map;
      expect((saved['today'] as Map)['ids'], ['deltoids-A']);
      expect(saved['sessions'], hasLength(1));
      expect(saved['safetyAccepted'], isTrue);
    },
  );

  test(
    'five self-reported grades place stages 1..3, wrist first, with skip to 1',
    () async {
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStorage(),
        now: () => day,
      );
      await store.initialize();
      Map<String, int> grades(int grade) => {
        for (final id in LearningStore.assessmentIds) id: grade,
      };
      await store.recordAssessment({...grades(4), 'wrist': 1});
      expect(store.startStage, 1);
      await store.recordAssessment(grades(2));
      expect(store.startStage, 2);
      expect(store.isStageUnlocked(2), isTrue);
      expect(store.isStageUnlocked(3), isFalse);
      await store.recordAssessment(grades(4));
      expect(store.startStage, 3);
      expect(store.currentStage, 3);
      await store.skipAssessment();
      expect(store.startStage, 1);
      expect(store.assessmentGrades, isEmpty);
      expect(() => store.recordAssessment({'wrist': 4}), throwsArgumentError);
      expect(() => store.recordAssessment(grades(5)), throwsArgumentError);
    },
  );

  test(
    'course progress needs every lesson plus explicit self-report, never AI score',
    () async {
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStorage(),
        now: () => day,
      );
      await store.initialize();
      final stage = catalog.stages.first;
      for (final lesson in stage.lessons) {
        await store.completeLesson(lesson.id);
      }
      expect(store.isStagePassed(1), isFalse);
      for (final gate in stage.gates) {
        await store.reportGate(gate.id, true);
      }
      expect(store.isStagePassed(1), isTrue);
      expect(store.currentStage, 2);
      expect(store.isStageUnlocked(2), isTrue);
      await store.completeLesson(stage.lessons.first.id, completed: false);
      expect(store.isStagePassed(1), isFalse);
      expect(store.isStageUnlocked(2), isFalse);
      await store.reportGate('ai9to11', true);
      expect(store.gateReports['ai9to11'], isTrue);
      expect(store.isStagePassed(4), isFalse);
    },
  );

  test(
    'read-modify-save retains unknown version-1 root and settings fields',
    () async {
      final storage = MemoryStorage();
      final initial = LearningStore(catalog: catalog, storage: storage);
      await initial.initialize();
      await initial.acknowledgeSafety();
      final saved = jsonDecode(storage.value!) as Map<String, dynamic>;
      saved['customBackupNote'] = 'retain me';
      (saved['settings'] as Map)['futureCameraChoice'] = 'back';
      storage.value = jsonEncode(saved);
      final restored = LearningStore(catalog: catalog, storage: storage);
      await restored.initialize();
      await restored.updateSettings(tier: 'C');
      final updated = jsonDecode(storage.value!) as Map;
      expect(updated['customBackupNote'], 'retain me');
      expect((updated['settings'] as Map)['futureCameraChoice'], 'back');
    },
  );

  test('settings saved before appearance existed follow the device', () {
    final legacy = LearningSettings.fromJson({
      'tier': 'B',
      'speed': 0.5,
      'cues': true,
      'sound': true,
      'haptics': true,
      'weeklyGoal': 3,
    });
    expect(legacy.themeMode, 'system');
    expect(legacy.valid, isTrue);
    expect(legacy.copyWith(themeMode: 'sepia').valid, isFalse);
    expect(legacy.copyWith(themeMode: 'light').toJson()['themeMode'], 'light');
  });
}
