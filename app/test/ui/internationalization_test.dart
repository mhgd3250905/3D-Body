import 'package:flare/control/learning_store.dart';
import 'package:flare/data/content_translations.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/motion_controls.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final source = loadCatalogFixture();
  tearDown(() => FlareColors.use(Brightness.dark));

  testWidgets(
    'Arabic controls use RTL placement while scrub follows finger direction',
    (tester) async {
      _setSize(tester, const Size(390, 844));
      final translations = (await tester.runAsync(
        () => ContentTranslations.load(),
      ))!;
      final catalog = source.localized(translations.forLanguage('ar'));
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
      addTearDown(store.dispose);
      final scene = SceneController();
      addTearDown(scene.dispose);
      final semantics = tester.ensureSemantics();

      await tester.pumpWidget(
        _app(
          locale: const Locale('ar'),
          home: FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
          ),
          scaffold: false,
        ),
      );
      scene.receiveEvent({'source': 'flare-scene', 'type': 'ready'});
      await _pumpTransitions(tester);
      final strings = AppLocalizations.of(
        tester.element(find.byType(FlareShell)),
      );
      expect(
        Directionality.of(tester.element(find.byType(FlareShell))),
        TextDirection.rtl,
      );
      final more = find.bySemanticsLabel(strings.more);
      final path = find.bySemanticsLabel(strings.plans);
      expect(more, findsOneWidget);
      expect(path, findsOneWidget);
      expect(
        tester.getCenter(more).dx,
        lessThan(tester.getCenter(path).dx),
        reason: 'The trailing header action moves to the left in RTL.',
      );
      expect(tester.takeException(), isNull);
      semantics.dispose();

      final seeks = <double>[];
      await tester.pumpWidget(
        _app(
          locale: const Locale('ar'),
          home: Scaffold(
            body: Center(
              child: SizedBox(
                width: 340,
                child: MotionTimeline(
                  catalog: catalog,
                  time: 0,
                  phase: catalog.phases.first.source,
                  onSeek: seeks.add,
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final track = tester.getRect(find.byType(MotionTimeline));
      await tester.dragFrom(
        Offset(track.left + 8, track.center.dy),
        Offset(track.width - 16, 0),
      );
      await tester.pumpAndSettle();
      expect(seeks, isNotEmpty);
      expect(
        seeks.last,
        greaterThan(seeks.first),
        reason:
            'Moving physically from left to right must seek forward in RTL.',
      );
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'Arabic muscle detail retains a useful knowledge viewport and fixed actions at 390x844',
    (tester) async {
      _setSize(tester, const Size(390, 844));
      final translations = (await tester.runAsync(
        () => ContentTranslations.load(),
      ))!;
      final catalog = source.localized(translations.forLanguage('ar'));
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
      await store.setLastTime(2.375);
      final scene = SceneController();
      addTearDown(store.dispose);
      addTearDown(scene.dispose);

      await tester.pumpWidget(
        _app(
          locale: const Locale('ar'),
          home: FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
          ),
          scaffold: false,
        ),
      );
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'ready',
        'time': 2.375,
        'period': 9.0,
        'phase': {'source': 11},
      });
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'select',
        'time': 2.375,
        'groupId': 'deltoids',
      });
      await _pumpTransitions(tester);

      final knowledge = find.byKey(const ValueKey('muscle-knowledge'));
      final knowledgePosition = Scrollable.of(
        tester.element(knowledge),
      ).position;
      expect(
        knowledgePosition.viewportDimension,
        greaterThanOrEqualTo(40),
        reason: 'The Arabic role copy must not squeeze the knowledge viewport.',
      );
      final assist = find.byKey(const ValueKey('muscle-assist-cards'));
      final footer = find.byKey(const ValueKey('train-group'));
      final beforeAssist = tester.getRect(assist);
      final beforeFooter = tester.getRect(footer);
      expect(beforeFooter.top, greaterThan(beforeAssist.bottom));
      expect(beforeFooter.bottom, lessThanOrEqualTo(844));
      expect(footer.hitTestable(), findsOneWidget);

      if (knowledgePosition.maxScrollExtent > 0) {
        await tester.drag(
          find.byKey(const ValueKey('muscle-detail-content')),
          const Offset(0, -180),
        );
        await tester.pumpAndSettle();
        expect(knowledgePosition.pixels, greaterThan(0));
      }
      expect(tester.getRect(assist), beforeAssist);
      expect(tester.getRect(footer), beforeFooter);
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets(
    'library, drill detail, and settings stay usable on phone widths',
    (tester) async {
      final translations = (await tester.runAsync(
        () => ContentTranslations.load(),
      ))!;
      final catalog = source.localized(translations.forLanguage('en'));
      final drill = catalog.drills.first;
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
      addTearDown(store.dispose);

      for (final size in [const Size(320, 700), const Size(390, 844)]) {
        _setSize(tester, size);
        await tester.pumpWidget(
          _app(
            locale: const Locale('en'),
            home: Scaffold(
              body: LibraryPage(
                catalog: catalog,
                store: store,
                onDrill: (_) {},
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        _expectNoFlutterError(tester, 'library at $size');

        await tester.pumpWidget(
          _app(
            locale: const Locale('en'),
            home: Scaffold(
              body: DrillDetailPage(
                drill: drill,
                group: catalog.groupById(drill.groupId),
                onBack: () {},
                onStart: () {},
                onAddToPlan: () {},
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        _expectNoFlutterError(tester, 'drill detail at $size');

        final settingsStore = LearningStore(
          catalog: catalog,
          storage: MemoryStateStorage(),
        );
        await settingsStore.initialize();
        await settingsStore.acknowledgeSafety();
        final scene = SceneController();
        addTearDown(scene.dispose);
        await tester.pumpWidget(
          _app(
            locale: const Locale('en'),
            home: FlareShell(
              catalog: catalog,
              store: settingsStore,
              sceneController: scene,
              enableScene: false,
            ),
            scaffold: false,
          ),
        );
        scene.receiveEvent({'source': 'flare-scene', 'type': 'ready'});
        await _pumpTransitions(tester);
        final strings = AppLocalizations.of(
          tester.element(find.byType(FlareShell)),
        );
        await tester.tap(find.bySemanticsLabel(strings.more));
        await _pumpTransitions(tester);
        final settingsItem = find.text(strings.settings).last;
        expect(settingsItem.hitTestable(), findsOneWidget);
        await tester.tap(settingsItem);
        await _pumpTransitions(tester);
        expect(find.byKey(const ValueKey('language-setting')), findsOneWidget);
        _expectNoFlutterError(tester, 'settings at $size');
        settingsStore.dispose();
      }
    },
  );
}

Widget _app({
  required Widget home,
  required Locale locale,
  bool scaffold = true,
}) => MaterialApp(
  theme: flareTheme(),
  locale: locale,
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  builder: (context, child) {
    FlareColors.use(Theme.of(context).brightness);
    return child!;
  },
  home: scaffold ? Scaffold(body: home) : home,
);

void _setSize(WidgetTester tester, Size size) {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
}

Future<void> _pumpTransitions(WidgetTester tester) async {
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 500));
  await tester.pump();
}

void _expectNoFlutterError(WidgetTester tester, String context) {
  expect(tester.takeException(), isNull, reason: '$context must not overflow');
}
