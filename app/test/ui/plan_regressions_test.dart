import 'dart:convert';
import 'package:flare/control/learning_store.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/engine.dart' as sdk;
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
    uc.TrainingPlan? sdkPlan,
    Widget Function(uc.TrainingPlan)? trainingPageBuilder,
  }) async {
    await helpers.phoneSize(tester);
    final store = LearningStore(
      catalog: catalog,
      storage: helpers.MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    await store.createRoutine('Audit routine', ids, sdkPlan: sdkPlan);
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
          trainingPageBuilder: trainingPageBuilder,
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

  Widget route(uc.TrainingPlan plan) => Builder(
    builder: (context) => Scaffold(
      key: const ValueKey('sdk-plan-route'),
      body: Column(
        children: [
          Text(plan.title),
          TextButton(
            key: const ValueKey('sdk-route-close'),
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Return from SDK'),
          ),
        ],
      ),
    ),
  );

  testWidgets(
    'all routine actions enter one SDK route; return does not replay',
    (tester) async {
      final semantics = tester.ensureSemantics();
      final received = <uc.TrainingPlan>[];
      try {
        final store = await open(
          tester,
          ids: ['abs-A', 'triceps-A', 'deltoids-A', 'forearms-A'],
          trainingPageBuilder: (plan) {
            received.add(plan);
            return route(plan);
          },
        );
        await startPlan(tester);
        expect(received, hasLength(1));
        expect(
          received.single.blocks
              .expand((b) => b.items)
              .map((i) => i.exerciseId),
          ['abs-A', 'triceps-A', 'deltoids-A', 'forearms-A'],
        );
        expect(find.byKey(const ValueKey('sdk-plan-route')), findsOneWidget);
        expect(store.sessions, isEmpty);
        await tester.tap(find.byKey(const ValueKey('sdk-route-close')));
        await tester.pumpAndSettle();
        expect(find.byKey(const ValueKey('sdk-plan-route')), findsNothing);
        expect(find.byKey(const ValueKey('plan-start')), findsOneWidget);
        expect(received, hasLength(1));
        await tester.pump(const Duration(seconds: 1));
        expect(received, hasLength(1));
        await tester.tap(find.byKey(const ValueKey('plan-start')));
        await tester.pumpAndSettle();
        expect(received, hasLength(2));
        expect(received.last.blocks.expand((b) => b.items), hasLength(4));
        await tester.tap(find.byKey(const ValueKey('sdk-route-close')));
        await tester.pumpAndSettle();
        expect(store.sessions, isEmpty); // Returning never invents completion.
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
      } finally {
        semantics.dispose();
      }
    },
  );

  testWidgets(
    'saved SDK circuit enters route with all rounds repeated items and rests intact',
    (tester) async {
      final semantics = tester.ensureSemantics();
      final plan = uc.TrainingPlan(
        id: 'whole-circuit',
        source: 'ai',
        title: 'Structured',
        goal: 'flare',
        scene: 'home',
        level: 1,
        targetMinutes: 10,
        blocks: const [
          uc.PlanBlock(
            id: 'rounds',
            name: 'Rounds',
            type: uc.BlockType.circuit,
            rounds: 3,
            restBetweenRoundsSeconds: 47,
            items: [
              uc.PlanItem(
                exerciseId: 'abs-A',
                mode: uc.DoseMode.time,
                sets: 1,
                workSeconds: 20,
                perSide: false,
                restSeconds: 11,
              ),
              uc.PlanItem(
                exerciseId: 'abs-A',
                mode: uc.DoseMode.time,
                sets: 1,
                workSeconds: 30,
                perSide: false,
                restSeconds: 13,
              ),
            ],
          ),
        ],
      );
      uc.TrainingPlan? received;
      try {
        await open(
          tester,
          sdkPlan: plan,
          trainingPageBuilder: (value) {
            received = value;
            return route(value);
          },
        );
        await startPlan(tester);
        expect(received!.toJson(), plan.toJson());
        await tester.tap(find.byKey(const ValueKey('sdk-route-close')));
        await tester.pumpAndSettle();
        expect(find.byKey(const ValueKey('plan-start')), findsOneWidget);
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
    final start = DateTime.utc(2026, 10, 23, 12);
    final result = sdk.SessionResult(
      sessionId: 'backup-session',
      planId: 'backup-plan',
      planTitle: 'Backup training',
      startedAt: start,
      endedAt: start.add(const Duration(minutes: 1)),
      activeSeconds: 20,
      endedEarly: false,
      completedExercises: 1,
      totalExercises: 1,
      items: const [
        sdk.ItemResult(
          exerciseId: 'abs-A',
          blockIndex: 0,
          itemInBlock: 0,
          plannedSets: 1,
          completedSets: 1,
          activeSeconds: 20,
          status: sdk.ItemStatus.completed,
        ),
      ],
    );
    await store.saveTrainerSession(result);
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
    expect(backup['trainerSessions'], [result.toJson()]);
    expect(backup['sessions'], [store.sessions.single.toJson()]);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    semantics.dispose();
  });
}
