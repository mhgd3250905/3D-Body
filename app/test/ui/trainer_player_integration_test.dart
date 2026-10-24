import 'package:flare/control/learning_store.dart';
import 'package:flare/domain/dose.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/l10n/languages.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/trainer_page.dart';
import 'package:flare/ui/drill_media.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/ugk_trainer.dart' as sdk;

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' as flow;

class _Storage implements LocalStateStorage {
  String? value;
  bool failNext = false;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async {
    if (failNext) {
      failNext = false;
      throw StateError('test write failure');
    }
    this.value = value;
  }
}

uc.TrainingPlan _plan({bool reps = false}) => uc.TrainingPlan(
  id: 'player-integration',
  source: 'template',
  title: 'Integration',
  goal: 'flare',
  scene: 'home',
  level: 1,
  targetMinutes: 1,
  blocks: [
    uc.PlanBlock(
      id: 'main',
      name: 'Main',
      type: uc.BlockType.main,
      items: [
        const uc.PlanItem(
          exerciseId: 'abs-A',
          mode: uc.DoseMode.time,
          sets: 1,
          workSeconds: 1,
          perSide: false,
          restSeconds: 0,
        ),
        uc.PlanItem(
          exerciseId: 'chest-A',
          mode: reps ? uc.DoseMode.reps : uc.DoseMode.time,
          sets: 1,
          reps: reps ? 2 : null,
          workSeconds: reps ? null : 1,
          perSide: false,
          restSeconds: 0,
        ),
      ],
    ),
  ],
);

Future<void> _advance(WidgetTester tester, int seconds) async {
  for (var n = 0; n < seconds * 10; n++) {
    await tester.pump(const Duration(milliseconds: 100));
  }
}

Future<LearningStore> _open(
  WidgetTester tester, {
  String language = 'zh',
  bool dark = false,
  bool reps = false,
  uc.TrainingPlan? sdkPlan,
  _Storage? storage,
  List<sdk.SessionResult>? popped,
  double textScale = 1,
}) async {
  tester.view.physicalSize = const Size(390, 844);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  final store = LearningStore(
    catalog: loadCatalogFixture(),
    storage: storage ?? _Storage(),
  );
  await store.initialize();
  addTearDown(store.dispose);
  await tester.pumpWidget(
    MaterialApp(
      theme: flareTheme(Brightness.light),
      darkTheme: flareTheme(Brightness.dark),
      themeMode: dark ? ThemeMode.dark : ThemeMode.light,
      locale: localeForLanguage(language),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(
          context,
        ).copyWith(textScaler: TextScaler.linear(textScale)),
        child: child!,
      ),
      home: Builder(
        builder: (context) => Scaffold(
          body: Center(
            child: TextButton(
              key: const ValueKey('open-player'),
              onPressed: () async {
                final result = await Navigator.of(context)
                    .push<sdk.SessionResult>(
                      MaterialPageRoute(
                        builder: (_) => FlareTrainingPage(
                          plan: sdkPlan ?? _plan(reps: reps),
                          catalog: store.catalog,
                          store: store,
                          voiceOutput: sdk.MutedVoiceOutput(),
                          keepAlive: false,
                        ),
                      ),
                    );
                if (result != null) popped?.add(result);
              },
              child: const Text('open'),
            ),
          ),
        ),
      ),
    ),
  );
  await tester.tap(find.byKey(const ValueKey('open-player')));
  for (
    var i = 0;
    i < 30 && find.byType(sdk.TrainerPlayer).evaluate().isEmpty;
    i++
  ) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 10)),
    );
    await tester.pump(const Duration(milliseconds: 100));
  }
  expect(find.byType(sdk.TrainerPlayer), findsOneWidget);
  await tester.pump(const Duration(milliseconds: 400));
  return store;
}

void main() {
  setUp(() {
    // Cached futures must not leak from one test's fake async zone to the next.
    rootBundle.clear();
  });
  tearDown(() {
    PaintingBinding.instance.imageCache.clear();
    PaintingBinding.instance.imageCache.clearLiveImages();
  });

  for (final singleDrill in [false, true]) {
    testWidgets(
      '${singleDrill ? 'selected drill' : 'saved circuit'} in the App shell completes in the SDK and returns',
      (tester) async {
        final semantics = tester.ensureSemantics();
        try {
          await flow.phoneSize(tester);
          final storage = _Storage();
          final catalog = loadCatalogFixture();
          final store = LearningStore(catalog: catalog, storage: storage);
          await store.initialize();
          await store.acknowledgeSafety();
          addTearDown(store.dispose);
          final plan = _plan().copyWith(
            blocks: [
              uc.PlanBlock(
                id: 'selected-circuit',
                name: 'Circuit',
                type: uc.BlockType.circuit,
                rounds: 2,
                restBetweenRoundsSeconds: 1,
                items: _plan().items.toList(),
              ),
            ],
          );
          final routine = await store.createRoutine(
            'Selected routine',
            const ['abs-A'],
            sdkPlan: singleDrill ? null : plan,
            doses: const {
              'abs-A': RoutineDose(
                sets: 1,
                mode: DoseMode.time,
                target: 1,
                perSide: false,
                restSec: 0,
              ),
            },
          );
          final scene = SceneController(commandSink: (_) {});
          addTearDown(scene.dispose);
          final received = <uc.TrainingPlan>[];
          await tester.pumpWidget(
            flow.testApp(
              FlareShell(
                catalog: catalog,
                store: store,
                sceneController: scene,
                enableScene: false,
                trainingPageBuilder: (value) {
                  received.add(value);
                  return FlareTrainingPage(
                    plan: value,
                    catalog: catalog,
                    store: store,
                    voiceOutput: sdk.MutedVoiceOutput(),
                    keepAlive: false,
                  );
                },
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
          await tester.tap(flow.labeledControl('计划'));
          await tester.pumpAndSettle();
          await tester.tap(find.byKey(ValueKey('routine-${routine!.id}')));
          await tester.pumpAndSettle();
          if (singleDrill) {
            await tester.tap(find.byKey(const ValueKey('plan-row-abs-A')));
            await tester.pumpAndSettle();
            final context = tester.element(find.byType(DrillDetailPage));
            await tester.tap(
              find.text(AppLocalizations.of(context).startTimer),
            );
          } else {
            await tester.tap(find.byKey(const ValueKey('plan-start')));
          }
          for (
            var i = 0;
            i < 50 && find.byType(sdk.TrainerPlayer).evaluate().isEmpty;
            i++
          ) {
            await tester.runAsync(
              () => Future<void>.delayed(const Duration(milliseconds: 10)),
            );
            await tester.pump(const Duration(milliseconds: 100));
          }
          expect(received, hasLength(1));
          expect(find.byType(sdk.TrainerPlayer), findsOneWidget);
          if (singleDrill) {
            expect(received.single.items.single.exerciseId, 'abs-A');
            expect(received.single.items.single.workSeconds, 1);
          } else {
            expect(received.single.toJson(), plan.toJson());
          }
          final player = tester.widget<sdk.TrainerPlayer>(
            find.byType(sdk.TrainerPlayer),
          );
          await _advance(
            tester,
            // SDK estimates exclude the lead-in; advance its public prep too.
            sdk.SessionBuilder().planSeconds(received.single).ceil() +
                player.prepSeconds +
                2,
          );
          expect(find.byKey(const ValueKey('finish')), findsOneWidget);
          expect(store.trainerSessions, hasLength(1));
          final result = store.trainerSessions.single;
          expect(result.full, isTrue);
          expect(result.items, hasLength(singleDrill ? 1 : 2));
          expect(
            result.items.map((item) => item.completedSets),
            singleDrill ? [1] : [2, 2],
          );
          expect(store.sessions.every((row) => row.completed), isTrue);
          final restored = LearningStore(catalog: catalog, storage: storage);
          await restored.initialize();
          expect(restored.trainerSessions.single.toJson(), result.toJson());
          expect(restored.sessions, hasLength(singleDrill ? 1 : 2));
          restored.dispose();
          await tester.tap(find.byKey(const ValueKey('finish')));
          await tester.pumpAndSettle();
          expect(find.byType(FlareTrainingPage), findsNothing);
          expect(received, hasLength(1));
          expect(store.trainerSessions.single.sessionId, result.sessionId);
          expect(tester.takeException(), isNull);
          await tester.pumpWidget(const SizedBox());
        } finally {
          semantics.dispose();
        }
      },
    );
  }

  testWidgets('one SDK route plays both items, persists once, returns once', (
    tester,
  ) async {
    final popped = <sdk.SessionResult>[];
    final store = await _open(tester, popped: popped);
    await _advance(tester, 28);
    expect(find.byKey(const ValueKey('finish')), findsOneWidget);
    expect(store.trainerSessions, hasLength(1));
    expect(store.trainerSessions.single.full, isTrue);
    expect(store.sessions.map((row) => row.drillId), ['abs-A', 'chest-A']);
    expect(store.sessions.every((row) => row.completed), isTrue);
    await tester.tap(find.byKey(const ValueKey('finish')));
    await tester.pumpAndSettle();
    expect(popped.single.sessionId, store.trainerSessions.single.sessionId);
    expect(find.byType(FlareTrainingPage), findsNothing);
    expect(store.sessions, hasLength(2));
  });

  testWidgets(
    'SDK save retry retains the same session without duplicate history',
    (tester) async {
      final storage = _Storage();
      final store = await _open(tester, storage: storage);
      storage.failNext = true;
      await _advance(tester, 28);
      expect(find.byKey(const ValueKey('save-retry')), findsOneWidget);
      final id = store.trainerSessions.single.sessionId;
      await tester.tap(find.byKey(const ValueKey('save-retry')));
      await tester.pump();
      await tester.pump();
      expect(find.byKey(const ValueKey('save-retry')), findsNothing);
      expect(store.trainerSessions.single.sessionId, id);
      expect(store.sessions, hasLength(2));
      final restored = LearningStore(catalog: store.catalog, storage: storage);
      await restored.initialize();
      expect(restored.trainerSessions.single.sessionId, id);
      expect(restored.sessions, hasLength(2));
      restored.dispose();
      await tester.pumpWidget(const SizedBox());
      await tester.pump();
    },
  );

  testWidgets('0.2 counts repetitions automatically using catalog defaults', (
    tester,
  ) async {
    final store = await _open(tester, reps: true);
    await _advance(tester, 28);
    expect(find.byKey(const ValueKey('complete-set-button')), findsNothing);
    expect(store.trainerSessions, isEmpty);
    final player = tester.widget<sdk.TrainerPlayer>(
      find.byType(sdk.TrainerPlayer),
    );
    expect(player.rhythms.containsKey('glute-max-A'), isTrue);
    expect(player.rhythms['chest-A']!.selfPaced, isFalse);
    await _advance(tester, 7);
    expect(store.trainerSessions.single.full, isTrue);
    await tester.pumpWidget(const SizedBox());
    await tester.pump();
  });

  testWidgets(
    'optional SDK controls extend rest, complete timer and toggle sound',
    (tester) async {
      final base = _plan();
      final plan = base.copyWith(
        blocks: [
          uc.PlanBlock(
            id: 'main',
            name: 'Main',
            type: uc.BlockType.main,
            items: [
              base.items.first.copyWith(workSeconds: 30),
              base.items.last,
            ],
          ),
        ],
      );
      final store = await _open(tester, sdkPlan: plan);
      final player = tester.widget<sdk.TrainerPlayer>(
        find.byType(sdk.TrainerPlayer),
      );
      expect(player.showExtendRest, isTrue);
      expect(player.showCompleteTimedPhase, isTrue);
      expect(player.showSoundToggle, isTrue);
      expect(player.showSkipSegment, isFalse);
      await tester.tap(find.byKey(const ValueKey('sound-toggle')));
      await tester.pump();
      expect(find.byTooltip(player.strings.soundOn), findsOneWidget);
      await _advance(tester, 11);
      await tester.tap(find.byKey(const ValueKey('complete-timed-phase')));
      await tester.pump();
      expect(find.byKey(const ValueKey('extend-rest')), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('extend-rest')));
      await _advance(tester, 16);
      expect(find.byKey(const ValueKey('extend-rest')), findsOneWidget);
      expect(store.trainerSessions, isEmpty);
      await _advance(tester, 16);
      expect(store.trainerSessions.single.full, isTrue);
      expect(store.sessions, hasLength(2));
      await tester.pumpWidget(const SizedBox());
      await tester.pump();
    },
  );

  testWidgets('segments use their own media but persist one parent result', (
    tester,
  ) async {
    final parent = uc.PlanItem(
      exerciseId: 'scapular-A',
      mode: uc.DoseMode.reps,
      sets: 1,
      perSide: false,
      restSeconds: 0,
      segments: const [
        uc.PlanSegment(
          id: 'a',
          exerciseId: 'abs-A',
          mode: uc.DoseMode.time,
          workSeconds: 3,
          label: 'Segment A',
        ),
        uc.PlanSegment(
          id: 'b',
          exerciseId: 'chest-A',
          mode: uc.DoseMode.time,
          workSeconds: 3,
          label: 'Segment B',
        ),
      ],
    );
    final plan = _plan().copyWith(
      blocks: [
        uc.PlanBlock(
          id: 'main',
          name: 'Main',
          type: uc.BlockType.main,
          items: [parent],
        ),
      ],
    );
    final store = await _open(tester, sdkPlan: plan);
    await _advance(tester, 11);
    expect(
      tester
          .widgetList<DrillMediaCard>(find.byType(DrillMediaCard))
          .map((card) => card.drillId),
      contains('abs-A'),
    );
    await _advance(tester, 3);
    expect(
      tester
          .widgetList<DrillMediaCard>(find.byType(DrillMediaCard))
          .map((card) => card.drillId),
      contains('chest-A'),
    );
    expect(store.trainerSessions, isEmpty);
    await _advance(tester, 4);
    expect(store.trainerSessions.single.items, hasLength(1));
    expect(store.trainerSessions.single.items.single.completedSets, 1);
    expect(store.sessions.single.drillId, 'scapular-A');
    await tester.pumpWidget(const SizedBox());
    await tester.pump();
  });

  for (final language in languageNames.keys) {
    for (final dark in [false, true]) {
      testWidgets(
        'SDK player $language ${dark ? 'dark' : 'light'} at 1.5x has no layout errors',
        (tester) async {
          await _open(tester, language: language, dark: dark, textScale: 1.5);
          final player = tester.widget<sdk.TrainerPlayer>(
            find.byType(sdk.TrainerPlayer),
          );
          expect(player.strings.pause, isNotEmpty);
          expect(
            player.voice!.settings.language,
            language == 'zh_Hant' ? 'zh' : language,
          );
          expect(find.byKey(const ValueKey('pause')), findsOneWidget);
          expect(tester.takeException(), isNull);
          await tester.pumpWidget(const SizedBox());
          await tester.pump();
          expect(tester.takeException(), isNull);
        },
      );
    }
  }
}
