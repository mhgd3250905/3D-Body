import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart'
    show MemoryStateStorage, openPlansFromHome, phoneSize;

Widget _app(
  Widget child, {
  bool reduced = false,
  String language = 'en',
  double safeBottom = 0,
}) => MaterialApp(
  locale: Locale(language),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  theme: flareTheme(language == 'de' ? Brightness.dark : Brightness.light),
  themeAnimationDuration: Duration.zero,
  builder: (context, child) {
    FlareColors.use(Theme.of(context).brightness);
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(
        padding: EdgeInsets.only(top: 24, bottom: safeBottom),
        disableAnimations: reduced,
      ),
      child: child!,
    );
  },
  home: child,
);

Widget _page(String name, VoidCallback back) => SafeArea(
  bottom: false,
  child: Column(
    children: [
      FlareNavBar(title: name, onBack: back),
      Expanded(child: Center(child: Text('body-$name'))),
    ],
  ),
);

void _expectOneStillChip(WidgetTester tester, Rect expected) {
  expect(find.byType(FlareBackChip), findsOneWidget);
  expect(tester.getRect(find.byType(FlareBackChip)), expected);
}

void main() {
  setUpAll(() async {
    await (FontLoader(
      'FlareSans',
    )..addFont(rootBundle.load('assets/fonts/FlareSans.ttf'))).load();
  });
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final reduced in [false, true]) {
    testWidgets('push and pop keep one fixed back chip, reduced=$reduced', (
      tester,
    ) async {
      await phoneSize(tester);
      var depth = 1;
      late StateSetter update;
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) {
              update = setState;
              return FlareStage(
                pageKey: depth,
                depth: depth,
                backChip: true,
                backChipBuilder: (_) => FlareBackChip(onPressed: () {}),
                child: _page('page-$depth', () {}),
              );
            },
          ),
          reduced: reduced,
        ),
      );
      final rail = tester.getRect(find.byType(FlareBackChip));
      expect(rail.topLeft, const Offset(16, 24));
      for (final target in [2, 1]) {
        update(() => depth = target);
        await tester.pump();
        _expectOneStillChip(tester, rail);
        await tester.pump(const Duration(milliseconds: 80));
        _expectOneStillChip(tester, rail);
        await tester.pumpAndSettle();
        _expectOneStillChip(tester, rail);
      }
      expect(tester.takeException(), isNull);
    });
  }

  testWidgets(
    'edge swipe keeps its chip fixed through cancellation and commit',
    (tester) async {
      await phoneSize(tester);
      var depth = 2;
      var backs = 0;
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) => FlareStage(
              pageKey: depth,
              depth: depth,
              backChip: true,
              pinSwipeBack: depth == 2,
              backChipBuilder: (_) => FlareBackChip(onPressed: () {}),
              onSwipeBack: depth == 2
                  ? () {
                      backs++;
                      setState(() => depth = 1);
                    }
                  : null,
              child: _page('page-$depth', () {}),
            ),
          ),
        ),
      );
      final rail = tester.getRect(find.byType(FlareBackChip));

      final short = await tester.startGesture(const Offset(4, 300));
      await short.moveBy(const Offset(30, 0));
      await short.moveBy(const Offset(45, 0));
      await tester.pump();
      _expectOneStillChip(tester, rail);
      expect(tester.getCenter(find.text('body-page-2')).dx, greaterThan(195));
      // A stationary release has no fling velocity and cancels this short drag.
      await tester.pump(const Duration(milliseconds: 200));
      await short.up();
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 40));
      _expectOneStillChip(tester, rail);
      await tester.pumpAndSettle();
      _expectOneStillChip(tester, rail);
      expect(backs, 0);

      final long = await tester.startGesture(const Offset(4, 300));
      await long.moveBy(const Offset(30, 0));
      for (var i = 0; i < 6; i++) {
        await long.moveBy(const Offset(40, 0));
        await tester.pump(const Duration(milliseconds: 16));
        _expectOneStillChip(tester, rail);
      }
      await long.up();
      await tester.pump();
      _expectOneStillChip(tester, rail);
      await tester.pumpAndSettle();
      _expectOneStillChip(tester, rail);
      expect(backs, 1);
      expect(find.text('body-page-1'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'swipe to a page without a back chip keeps the chip on its page',
    (tester) async {
      await phoneSize(tester);
      await tester.pumpWidget(
        _app(
          FlareStage(
            pageKey: 1,
            depth: 1,
            backChip: true,
            onSwipeBack: () {},
            backChipBuilder: (_) => FlareBackChip(onPressed: () {}),
            child: _page('settings', () {}),
          ),
        ),
      );
      final rail = tester.getRect(find.byType(FlareBackChip));
      final drag = await tester.startGesture(const Offset(4, 300));
      await drag.moveBy(const Offset(30, 0));
      await drag.moveBy(const Offset(45, 0));
      await tester.pump();
      expect(find.byType(FlareBackChip), findsOneWidget);
      expect(
        tester.getRect(find.byType(FlareBackChip)).left,
        greaterThan(rail.left),
      );
      await drag.cancel();
      await tester.pumpAndSettle();
      _expectOneStillChip(tester, rail);
    },
  );

  for (final language in ['en', 'de']) {
    final brightness = language == 'de' ? Brightness.dark : Brightness.light;
    testWidgets('Plans reaches the same bottom as Settings in $brightness', (
      tester,
    ) async {
      await phoneSize(tester);
      tester.view.viewPadding = const FakeViewPadding(bottom: 34);
      addTearDown(tester.view.resetViewPadding);
      final catalog = loadCatalogFixture(includeFlarePlans: true);
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStateStorage(),
      );
      final scene = SceneController(commandSink: (_) {});
      addTearDown(store.dispose);
      addTearDown(scene.dispose);
      await store.initialize();
      await store.acknowledgeSafety();
      await tester.pumpWidget(
        _app(
          FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
          ),
          language: language,
          safeBottom: 34,
        ),
      );
      await tester.pumpAndSettle();
      final strings = AppLocalizations.of(
        tester.element(find.byType(FlareShell)),
      );
      await tester.tap(
        find.bySemanticsLabel(RegExp('^${RegExp.escape(strings.more)}')).first,
      );
      await tester.pumpAndSettle();
      await tester.tap(find.widgetWithText(FlareListRow, strings.settings));
      await tester.pumpAndSettle();

      final settingsList = find.byKey(
        const PageStorageKey('flare-settings-scroll'),
      );
      final settingsPadding = tester.widget<ListView>(settingsList).padding!;
      final settingsBottom = settingsPadding.resolve(TextDirection.ltr).bottom;
      expect(settingsBottom, 24);
      final settingsViewportBottom = tester.getRect(settingsList).bottom;
      await tester.tap(find.byType(FlareBackChip));
      await tester.pumpAndSettle();
      await openPlansFromHome(tester);

      final plansScroll = find.byKey(
        const PageStorageKey<String>('plans-scroll'),
      );
      final plansNav = find.descendant(
        of: find.byType(PlansPage),
        matching: find.byType(FlareScrollNav),
      );
      final scrollView = tester.widget<CustomScrollView>(plansScroll);
      expect(tester.widget<FlareScrollNav>(plansNav).child, same(scrollView));
      expect(tester.getRect(plansScroll).bottom, settingsViewportBottom);

      final scrollable = find.descendant(
        of: plansScroll,
        matching: find.byWidgetPredicate(
          (widget) =>
              widget is Scrollable &&
              widget.axisDirection == AxisDirection.down,
        ),
      );
      final position = tester.state<ScrollableState>(scrollable).position;
      expect(position.maxScrollExtent, greaterThan(0));
      position.jumpTo(position.maxScrollExtent);
      await tester.pumpAndSettle();

      final spacer = (scrollView.slivers.last as SliverToBoxAdapter).child!;
      final spacerRect = tester.getRect(find.byWidget(spacer));
      expect(spacerRect.height, settingsBottom);
      expect(spacerRect.bottom, closeTo(settingsViewportBottom, 0.01));
      expect(tester.takeException(), isNull);
    });
  }

  for (final language in ['en', 'de']) {
    for (final reduced in [false, true]) {
      testWidgets(
        'settings About uses the fixed rail and restores scroll $language/$reduced',
        (tester) async {
          await phoneSize(tester);
          // Use a short viewport so About requires scrolling in both locales.
          tester.view.physicalSize = const Size(390, 640);
          final catalog = loadCatalogFixture();
          final store = LearningStore(
            catalog: catalog,
            storage: MemoryStateStorage(),
          );
          await store.initialize();
          await store.acknowledgeSafety();
          final scene = SceneController(commandSink: (_) {});
          addTearDown(store.dispose);
          addTearDown(scene.dispose);
          await tester.pumpWidget(
            _app(
              FlareShell(
                catalog: catalog,
                store: store,
                sceneController: scene,
                enableScene: false,
              ),
              reduced: reduced,
              language: language,
            ),
          );
          await tester.pumpAndSettle();
          final s = AppLocalizations.of(
            tester.element(find.byType(FlareShell)),
          );
          Future<void> settings() async {
            await tester.tap(
              find.bySemanticsLabel(RegExp('^${RegExp.escape(s.more)}')).first,
            );
            await tester.pumpAndSettle();
            await tester.tap(find.widgetWithText(FlareListRow, s.settings));
            await tester.pumpAndSettle();
          }

          await settings();
          final settingsList = find.byKey(
            const PageStorageKey('flare-settings-scroll'),
          );
          final scrollable = find
              .descendant(of: settingsList, matching: find.byType(Scrollable))
              .first;
          final about = find.widgetWithText(FlareListRow, s.aboutFlare);
          await tester.scrollUntilVisible(about, 180, scrollable: scrollable);
          await tester.pumpAndSettle();
          final offset = tester
              .state<ScrollableState>(scrollable)
              .position
              .pixels;
          expect(offset, greaterThan(0));
          final rail = tester.getRect(find.byType(FlareBackChip));

          await tester.tap(about);
          await tester.pump();
          _expectOneStillChip(tester, rail);
          await tester.pump(const Duration(milliseconds: 80));
          _expectOneStillChip(tester, rail);
          await tester.pumpAndSettle();
          expect(
            tester.widget<FlareStage>(find.byType(FlareStage)).pageKey,
            'about',
          );
          expect(
            tester.state<NavigatorState>(find.byType(Navigator)).canPop(),
            isFalse,
          );

          await tester.tap(find.byType(FlareBackChip));
          await tester.pump();
          _expectOneStillChip(tester, rail);
          await tester.pumpAndSettle();
          expect(
            tester.widget<FlareStage>(find.byType(FlareStage)).pageKey,
            'settings',
          );
          expect(
            tester.state<ScrollableState>(scrollable).position.pixels,
            closeTo(offset, 1),
          );

          // Android/system back follows the same About -> settings -> home stack.
          await tester.tap(about);
          await tester.pumpAndSettle();
          await tester.binding.handlePopRoute();
          await tester.pumpAndSettle();
          expect(
            tester.widget<FlareStage>(find.byType(FlareStage)).pageKey,
            'settings',
          );
          await tester.tap(find.byType(FlareBackChip));
          await tester.pumpAndSettle();
          expect(
            tester.widget<FlareStage>(find.byType(FlareStage)).pageKey,
            'watch',
          );
          await settings();
          expect(
            tester.widget<FlareStage>(find.byType(FlareStage)).pageKey,
            'settings',
          );
          expect(tester.takeException(), isNull);
          await tester.pumpWidget(const SizedBox());
        },
      );
    }
  }
}
