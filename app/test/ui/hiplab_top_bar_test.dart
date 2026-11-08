import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage, phoneSize;

Widget _app(
  Widget child, {
  double safeTop = 47,
  bool reduced = false,
  bool highContrast = false,
  String language = 'en',
  Brightness brightness = Brightness.light,
}) => MaterialApp(
  locale: Locale(language),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  theme: flareTheme(brightness),
  themeAnimationDuration: Duration.zero,
  builder: (context, child) {
    FlareColors.use(Theme.of(context).brightness);
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(
        padding: EdgeInsets.only(top: safeTop),
        disableAnimations: reduced,
        highContrast: highContrast,
      ),
      child: child!,
    );
  },
  home: Scaffold(body: child),
);

Widget _scrollingPage({bool subtitle = false, VoidCallback? onBack}) => Builder(
  builder: (context) => FlareNavPage(
    title: 'Plans',
    subtitle: subtitle ? 'A detailed training plan' : null,
    onBack: onBack ?? () {},
    body: ListView.builder(
      padding: EdgeInsets.only(
        top: flareNavInset(context, hasSubtitle: subtitle) + 12,
      ),
      itemCount: 40,
      itemBuilder: (context, index) => SizedBox(
        key: ValueKey('row-$index'),
        height: 64,
        child: Text('Training row $index'),
      ),
    ),
  ),
);

void main() {
  setUpAll(() async {
    await (FontLoader(
      'FlareSans',
    )..addFont(rootBundle.load('assets/fonts/FlareSans.ttf'))).load();
  });
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final safeTop in [0.0, 47.0]) {
    for (final subtitle in [false, true]) {
      testWidgets(
        'top bar overlays a scrolling viewport safe=$safeTop subtitle=$subtitle',
        (tester) async {
          await phoneSize(tester);
          var backs = 0;
          await tester.pumpWidget(
            _app(
              _scrollingPage(subtitle: subtitle, onBack: () => backs++),
              safeTop: safeTop,
              reduced: subtitle,
            ),
          );
          final band = safeTop + (subtitle ? 52 : 44) + 24;
          final nav = find.byType(FlareNavBar);
          expect(tester.getRect(nav).top, 0);
          expect(tester.getRect(nav).height, band);
          expect(tester.getTopLeft(find.byType(Viewport)).dy, 0);
          expect(
            tester.getTopLeft(find.byKey(const ValueKey('row-0'))).dy,
            band + 12,
          );
          final rail = tester.getRect(find.byType(FlareBackChip));
          expect(rail.topLeft, Offset(16, safeTop));
          await tester.drag(find.byType(ListView), const Offset(0, -220));
          await tester.pumpAndSettle();
          expect(
            tester.getTopLeft(find.byKey(const ValueKey('row-2'))).dy,
            lessThan(band),
            reason:
                'Rows must pass behind the material rather than stop below it',
          );
          expect(tester.getRect(find.byType(FlareBackChip)), rail);

          final position = tester
              .state<ScrollableState>(find.byType(Scrollable))
              .position;
          final before = position.pixels;
          // The glass and centered title pass gestures through to the list.
          await tester.dragFrom(
            Offset(195, safeTop + 22),
            const Offset(0, -50),
          );
          await tester.pumpAndSettle();
          expect(position.pixels, greaterThan(before));
          expect(tester.getRect(find.byType(FlareBackChip)), rail);
          await tester.tap(find.byType(FlareBackChip));
          await tester.pumpAndSettle();
          expect(backs, 1);
          expect(tester.takeException(), isNull);
        },
      );
    }
  }

  for (final highContrast in [false, true]) {
    testWidgets(
      'navigation blur samples only its band highContrast=$highContrast',
      (tester) async {
        await phoneSize(tester);
        await tester.pumpWidget(
          _app(_scrollingPage(), highContrast: highContrast),
        );
        final nav = find.byType(FlareNavBar);
        final clips = find.descendant(of: nav, matching: find.byType(ClipRect));
        expect(clips, findsOneWidget);
        expect(tester.getRect(clips), tester.getRect(nav));
        expect(
          find.descendant(of: clips, matching: find.byType(BackdropFilter)),
          highContrast ? findsNothing : findsNWidgets(3),
        );
        await tester.drag(find.byType(ListView), const Offset(0, -120));
        await tester.pumpAndSettle();
        expect(tester.getRect(clips), tester.getRect(nav));
        expect(tester.takeException(), isNull);
      },
    );
  }

  for (final language in ['en', 'de']) {
    for (final brightness in Brightness.values) {
      testWidgets(
        'Plans top remains readable and usable $language/$brightness',
        (tester) async {
          await phoneSize(tester);
          final catalog = loadCatalogFixture();
          final store = LearningStore(
            catalog: catalog,
            storage: MemoryStateStorage(),
          );
          await store.initialize();
          await store.acknowledgeSafety();
          addTearDown(store.dispose);
          var created = 0;
          var backs = 0;
          PresetPlan? opened;
          await tester.pumpWidget(
            _app(
              AnimatedBuilder(
                animation: store,
                builder: (context, _) => PlansPage(
                  catalog: catalog,
                  store: store,
                  onBack: () => backs++,
                  onNewRoutine: () => created++,
                  onRoutine: (_) {},
                  onPreset: (preset) => opened = preset,
                ),
              ),
              language: language,
              brightness: brightness,
              reduced: brightness == Brightness.dark,
            ),
          );
          await tester.pumpAndSettle();
          final s = AppLocalizations.of(tester.element(find.byType(PlansPage)));
          final bar = tester.getRect(find.byType(FlareNavBar));
          expect(bar.top, 0);
          expect(tester.getTopLeft(find.byType(Viewport)).dy, 0);
          expect(find.text(s.plansMine).hitTestable(), findsOneWidget);
          expect(
            find.byKey(const ValueKey('plan-new')).hitTestable(),
            findsOneWidget,
          );
          expect(
            tester.getTopLeft(find.text(s.plansMine)).dy,
            greaterThanOrEqualTo(bar.bottom),
          );
          await tester.tap(find.byKey(const ValueKey('plan-new')));
          await tester.pumpAndSettle();
          expect(created, 1);
          await tester.tap(find.text(s.sceneGym));
          await tester.pumpAndSettle();
          expect(store.settings.tier, 'C');
          final warmup = find.byKey(const ValueKey('preset-warmup'));
          await tester.ensureVisible(warmup);
          await tester.pumpAndSettle();
          await tester.tap(warmup);
          await tester.pumpAndSettle();
          expect(opened?.id, 'warmup');
          expect(
            opened!
                .drills(catalog, store.settings.tier)
                .every((d) => d.tier == 'C'),
            isTrue,
          );
          final rail = tester.getRect(find.byType(FlareBackChip));
          await tester.drag(
            find.byType(CustomScrollView),
            const Offset(0, -180),
          );
          await tester.pumpAndSettle();
          expect(tester.getRect(find.byType(FlareBackChip)), rail);
          await tester.tap(find.byType(FlareBackChip));
          await tester.pumpAndSettle();
          expect(backs, 1);
          expect(tester.takeException(), isNull);
          await tester.pumpWidget(const SizedBox());
        },
      );
    }
  }
}
