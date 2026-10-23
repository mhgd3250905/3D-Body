import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/l10n/languages.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/trainer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/ugk_trainer.dart' as sdk;

import '../domain/fixtures.dart';

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
                          plan: _plan(reps: reps),
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

  testWidgets(
    'b8 keeps its self-paced fallback until SDK automatic pacing is available',
    (tester) async {
      final store = await _open(tester, reps: true);
      await _advance(tester, 30);
      expect(find.byKey(const ValueKey('complete-set-button')), findsOneWidget);
      expect(store.trainerSessions, isEmpty);
      final player = tester.widget<sdk.TrainerPlayer>(
        find.byType(sdk.TrainerPlayer),
      );
      expect(player.rhythms.containsKey('glute-max-A'), isTrue);
      expect(player.rhythms.containsKey('chest-A'), isFalse);
      await tester.tap(find.byKey(const ValueKey('complete-set-button')));
      await tester.pump();
      await tester.pump();
      expect(store.trainerSessions.single.full, isTrue);
      await tester.pumpWidget(const SizedBox());
      await tester.pump();
    },
  );

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
