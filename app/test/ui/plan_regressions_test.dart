import 'dart:convert';
import 'package:flare/control/learning_store.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/timer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' as helpers;

void main() {
  final catalog = loadCatalogFixture();
  testWidgets('24 visible character names preserve emoji when saved', (
    tester,
  ) async {
    await helpers.phoneSize(tester);
    final store = LearningStore(
      catalog: catalog,
      storage: helpers.MemoryStateStorage(),
    );
    await store.initialize();
    addTearDown(store.dispose);
    TrainingRoutine? saved;
    await tester.pumpWidget(
      helpers.testApp(
        Scaffold(
          body: RoutineEditorPage(
            catalog: catalog,
            store: store,
            seedDrillIds: const ['abs-A'],
            onBack: () {},
            onSaved: (routine) => saved = routine,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    final name = '${List.filled(23, 'a').join()}😀';
    await tester.enterText(find.byKey(const ValueKey('routine-name')), name);
    await tester.tap(find.byKey(const ValueKey('routine-save')));
    await tester.pumpAndSettle();
    expect(saved, isNotNull);
    expect(saved!.name, name);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });
  Future<LearningStore> open(
    WidgetTester tester, {
    List<String> ids = const ['abs-A'],
  }) async {
    await helpers.phoneSize(tester);
    final store = LearningStore(
      catalog: catalog,
      storage: helpers.MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    await store.createRoutine('Audit routine', ids);
    final scene = SceneController(commandSink: (_) {});
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    await tester.pumpWidget(
      helpers.testApp(
        FlareShell(
          catalog: catalog,
          store: store,
          sceneController: scene,
          enableScene: false,
        ),
      ),
    );
    await tester.pumpAndSettle();
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'ready',
      'time': 0.0,
      'period': 9.0,
      'phase': {'source': 9},
    });
    await tester.pumpAndSettle();
    return store;
  }

  Future<void> startPlan(WidgetTester tester) async {
    await tester.tap(helpers.labeledControl('计划'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Audit routine'));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('plan-start')));
    await tester.pumpAndSettle();
  }

  Future<void> completeCurrentDrill(
    WidgetTester tester,
    LearningStore store,
    String sessionId,
  ) async {
    await tester.tap(find.byKey(const ValueKey('run-start')));
    for (var i = 0; i < 6; i++) {
      await tester.pump(const Duration(milliseconds: 200));
    }
    final timer = tester.widget<TrainingTimerPage>(
      find.byType(TrainingTimerPage),
    );
    final endedAt = DateTime.now().toUtc();
    await store.logSession(
      TrainingSession(
        id: sessionId,
        drillId: timer.drill.id,
        startedAt: endedAt.subtract(const Duration(seconds: 60)),
        endedAt: endedAt,
        activeSeconds: 60,
        completedSets: timer.drill.dose.sets,
        plannedSets: timer.drill.dose.sets,
        pain: false,
        completed: true,
      ),
    );
    timer.onClose();
    await tester.pumpAndSettle();
  }

  testWidgets('skipping the only drill ends the round without completing it', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    try {
      final store = await open(tester);
      await startPlan(tester);
      await tester.tap(find.byKey(const ValueKey('run-skip')));
      await tester.pumpAndSettle();
      final run = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(run.done, isEmpty);
      expect(run.skipped, {0});
      expect(run.index, 1);
      expect(run.ended, isTrue);
      expect(run.complete, isFalse);
      expect(store.sessions, isEmpty);
      expect(find.text('完成 0 / 1 个动作'), findsOneWidget);
      expect(find.text('跳过 1 个动作'), findsOneWidget);
      expect(find.text('已跳过'), findsOneWidget);
      expect(find.text('本轮训练已结束'), findsOneWidget);
      expect(find.text('这一套练完了'), findsNothing);
      expect(find.byKey(const ValueKey('run-skip')), findsNothing);
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    } finally {
      semantics.dispose();
    }
  });

  testWidgets('skipping the final unfinished drill still allows training it', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    try {
      final store = await open(tester, ids: ['abs-A', 'triceps-A']);
      await startPlan(tester);
      await completeCurrentDrill(tester, store, 'plan-step-completed');
      await tester.tap(find.byKey(const ValueKey('run-skip')));
      await tester.pumpAndSettle();
      final run = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(run.done, {0});
      expect(run.skipped, {1});
      expect(run.index, 2);
      expect(run.ended, isTrue);
      expect(run.complete, isFalse);
      expect(find.text('本轮训练已结束'), findsOneWidget);
      expect(find.text('这一套练完了'), findsNothing);
      expect(find.text('跳过 1 个动作'), findsOneWidget);
      expect(find.byKey(const ValueKey('run-skip')), findsNothing);
      await helpers.tapVisible(tester, find.byKey(const ValueKey('run-row-1')));
      await tester.pumpAndSettle();
      final retry = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(retry.index, 1);
      expect(retry.ended, isFalse);
      await completeCurrentDrill(tester, store, 'plan-step-2-completed');
      final completed = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(completed.done, {0, 1});
      expect(completed.skipped, isEmpty);
      expect(completed.ended, isTrue);
      expect(completed.complete, isTrue);
      expect(find.text('这一套练完了'), findsOneWidget);
      expect(find.text('本轮训练已结束'), findsNothing);
      await helpers.tapVisible(tester, find.byKey(const ValueKey('run-row-0')));
      await tester.pumpAndSettle();
      final repeat = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(repeat.done, {0, 1});
      expect(repeat.index, 0);
      expect(repeat.ended, isFalse);
      expect(repeat.complete, isFalse);
      expect(find.text('这一套练完了'), findsNothing);
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    } finally {
      semantics.dispose();
    }
  });

  testWidgets(
    'four skipped drills advance in order without wrapping or sessions',
    (tester) async {
      final semantics = tester.ensureSemantics();
      try {
        final store = await open(
          tester,
          ids: ['abs-A', 'triceps-A', 'deltoids-A', 'forearms-A'],
        );
        await startPlan(tester);
        for (var next = 1; next <= 4; next++) {
          await tester.tap(find.byKey(const ValueKey('run-skip')));
          await tester.pumpAndSettle();
          final run = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
          expect(run.index, next);
          expect(run.skipped, Set<int>.from(List.generate(next, (i) => i)));
          expect(run.done, isEmpty);
          expect(run.ended, next == 4);
          expect(run.complete, isFalse);
          expect(store.sessions, isEmpty);
          expect(find.text('这一套练完了'), findsNothing);
        }
        expect(find.text('完成 0 / 4 个动作'), findsOneWidget);
        expect(find.text('跳过 4 个动作'), findsOneWidget);
        expect(find.text('本轮训练已结束'), findsOneWidget);
        expect(find.byKey(const ValueKey('run-skip')), findsNothing);
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
      } finally {
        semantics.dispose();
      }
    },
  );

  testWidgets(
    'completion after a skipped drill advances to the following drill',
    (tester) async {
      final semantics = tester.ensureSemantics();
      try {
        final store = await open(
          tester,
          ids: ['abs-A', 'triceps-A', 'deltoids-A'],
        );
        await startPlan(tester);
        await tester.tap(find.byKey(const ValueKey('run-skip')));
        await tester.pumpAndSettle();
        await completeCurrentDrill(tester, store, 'mixed-step-2-completed');
        final run = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
        expect(run.index, 2);
        expect(run.done, {1});
        expect(run.skipped, {0});
        expect(run.ended, isFalse);
        expect(run.complete, isFalse);
        expect(store.sessions.single.drillId, 'triceps-A');
        expect(find.text('完成 1 / 3 个动作'), findsOneWidget);
        expect(find.text('跳过 1 个动作'), findsOneWidget);
        expect(find.text('第 3 / 3 个'), findsOneWidget);
        expect(find.text('本轮训练已结束'), findsNothing);
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
      } finally {
        semantics.dispose();
      }
    },
  );

  testWidgets('copied backup includes routine identity name and drill order', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();

    String? copied;
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
      SystemChannels.platform,
      (call) async {
        if (call.method == 'Clipboard.setData') {
          copied = (call.arguments as Map)['text'] as String;
        }
        return null;
      },
    );
    addTearDown(
      () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
        SystemChannels.platform,
        null,
      ),
    );
    final store = await open(tester, ids: ['triceps-A', 'abs-A']);
    await tester.tap(helpers.labeledControl('更多'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('设置'));
    await tester.pumpAndSettle();
    await helpers.tapVisible(tester, find.text('关于 Flare'));
    await tester.pumpAndSettle();
    await helpers.tapVisible(tester, find.text('复制本地备份'));
    await tester.pumpAndSettle();
    expect(store.routines.single.name, 'Audit routine');
    final backup = jsonDecode(copied!) as Map<String, dynamic>;
    expect(backup['format'], 'flare.local.backup.v1');
    expect(backup['routines'], [store.routines.single.toJson()]);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    semantics.dispose();
  });
}
