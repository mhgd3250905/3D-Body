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

  testWidgets('skipping the only drill keeps the plan unfinished', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();

    final store = await open(tester);
    await tester.tap(helpers.labeledControl('计划'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Audit routine'));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('plan-start')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('run-skip')));
    await tester.pumpAndSettle();
    final run = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
    expect(run.done, isEmpty);
    expect(store.sessions, isEmpty);
    expect(find.text('完成 0 / 1 个动作'), findsOneWidget);
    expect(find.text('这一套练完了'), findsNothing);
    expect(run.complete, isFalse);
    expect(run.index, 0);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    semantics.dispose();
  });

  testWidgets('skipping the final unfinished drill still allows training it', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    try {
      final store = await open(tester, ids: ['abs-A', 'triceps-A']);
      await tester.tap(helpers.labeledControl('计划'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Audit routine'));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('plan-start')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('run-start')));
      for (var i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 200));
      }
      // The timer completion callback must advance only completed steps.
      final timer = tester.widget<TrainingTimerPage>(
        find.byType(TrainingTimerPage),
      );
      final endedAt = DateTime.now().toUtc();
      await store.logSession(
        TrainingSession(
          id: 'plan-step-completed',
          drillId: 'abs-A',
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
      await tester.tap(find.byKey(const ValueKey('run-skip')));
      await tester.pumpAndSettle();
      final run = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(run.done, {0});
      expect(run.index, 1);
      expect(run.complete, isFalse);
      expect(find.text('这一套练完了'), findsNothing);
      expect(find.byKey(const ValueKey('run-start')), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('run-start')));
      for (var i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 200));
      }
      final secondTimer = tester.widget<TrainingTimerPage>(
        find.byType(TrainingTimerPage),
      );
      final secondEnd = DateTime.now().toUtc();
      await store.logSession(
        TrainingSession(
          id: 'plan-step-2-completed',
          drillId: 'triceps-A',
          startedAt: secondEnd.subtract(const Duration(seconds: 60)),
          endedAt: secondEnd,
          activeSeconds: 60,
          completedSets: secondTimer.drill.dose.sets,
          plannedSets: secondTimer.drill.dose.sets,
          pain: false,
          completed: true,
        ),
      );
      secondTimer.onClose();
      await tester.pumpAndSettle();
      expect(find.text('这一套练完了'), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('run-row-0')));
      await tester.pumpAndSettle();
      final repeat = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(repeat.done, {0, 1});
      expect(repeat.index, 0);
      expect(repeat.complete, isFalse);
      expect(find.text('这一套练完了'), findsNothing);
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    } finally {
      semantics.dispose();
    }
  });

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
