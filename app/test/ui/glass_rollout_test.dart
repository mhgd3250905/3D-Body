import 'package:flare/control/learning_store.dart';
import 'package:flare/data/content_translations.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/l10n/languages.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/app_glass.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage;

void main() {
  final source = loadCatalogFixture();
  late ContentTranslations translations;
  setUpAll(() async {
    translations = await ContentTranslations.load();
    for (final name in [
      'FlareSans',
      'NotoSansKR',
      'NotoSansArabic',
      'NotoSansDevanagari',
    ]) {
      await (FontLoader(
        name,
      )..addFont(rootBundle.load('assets/fonts/$name.ttf'))).load();
    }
  });
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final mode in Brightness.values) {
    testWidgets('quiet card metadata keeps readable contrast in $mode', (
      tester,
    ) async {
      FlareColors.use(mode);
      late Color surface;
      await tester.pumpWidget(
        MaterialApp(
          theme: flareTheme(mode),
          home: Builder(
            builder: (context) {
              surface = Color.alphaBlend(
                FlareStaticSurface.colorOf(context),
                FlareColors.background,
              );
              return const SizedBox();
            },
          ),
        ),
      );
      final high =
          FlareColors.dim.computeLuminance() > surface.computeLuminance()
          ? FlareColors.dim.computeLuminance()
          : surface.computeLuminance();
      final low =
          FlareColors.dim.computeLuminance() < surface.computeLuminance()
          ? FlareColors.dim.computeLuminance()
          : surface.computeLuminance();
      expect((high + .05) / (low + .05), greaterThanOrEqualTo(4.5));
    });
  }

  void size(WidgetTester tester, double width) {
    tester.view.physicalSize = Size(width, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
  }

  Widget app(
    Widget child,
    String language,
    Brightness brightness, {
    double scale = 1,
  }) => MaterialApp(
    locale: localeForLanguage(language),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    theme: flareTheme(brightness),
    themeAnimationDuration: Duration.zero,
    builder: (context, child) {
      FlareColors.use(Theme.of(context).brightness);
      return MediaQuery(
        data: MediaQuery.of(
          context,
        ).copyWith(textScaler: TextScaler.linear(scale)),
        child: child!,
      );
    },
    home: Scaffold(body: child),
  );

  for (final language in languageNames.keys) {
    for (final brightness in Brightness.values) {
      testWidgets(
        'library long translations fit and last drill stays reachable: $language/$brightness',
        (tester) async {
          size(tester, 360);
          final catalog = source.localized(
            translations.forLanguage(language),
            shortLabels: translations.shortLabelsFor(language),
          );
          final store = LearningStore(
            catalog: catalog,
            storage: MemoryStateStorage(),
          );
          await store.initialize();
          await store.updateSettings(tier: 'A');
          addTearDown(store.dispose);
          String? opened;
          await tester.pumpWidget(
            app(
              LibraryPage(
                catalog: catalog,
                store: store,
                onDrill: (d) => opened = d.id,
                onBack: () {},
              ),
              language,
              brightness,
              scale: 1.3,
            ),
          );
          await tester.pumpAndSettle();
          final cards = find.byType(DrillCard);
          // At an accessibility size the first card fills the content width.
          expect(tester.getSize(cards.first).width, closeTo(320, .1));
          for (final text
              in find
                  .descendant(of: cards, matching: find.byType(RichText))
                  .evaluate()) {
            expect(
              (text.renderObject! as RenderParagraph).didExceedMaxLines,
              isFalse,
            );
          }
          final last = catalog.searchDrills('', tier: 'A').last;
          await tester.scrollUntilVisible(
            find.text(last.name),
            500,
            scrollable: find
                .descendant(
                  of: find.byType(CustomScrollView),
                  matching: find.byType(Scrollable),
                )
                .first,
          );
          await tester.pumpAndSettle();
          await tester.tap(find.text(last.name));
          expect(opened, last.id);
          expect(tester.takeException(), isNull);
          await tester.pumpWidget(const SizedBox());
        },
      );
    }
  }

  testWidgets(
    'theme changes preserve library state, search, scroll and selected result',
    (tester) async {
      size(tester, 390);
      final store = LearningStore(
        catalog: source,
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.updateSettings(tier: 'A');
      addTearDown(store.dispose);
      final page = LibraryPage(
        key: const ValueKey('library'),
        catalog: source,
        store: store,
        onDrill: (_) {},
      );
      await tester.pumpWidget(app(page, 'zh', Brightness.light));
      await tester.pumpAndSettle();
      final state = tester.state(find.byType(LibraryPage));
      await tester.enterText(
        find.byKey(const ValueKey('library-search')),
        '支撑',
      );
      await tester.pumpAndSettle();
      await tester.drag(find.byType(CustomScrollView), const Offset(0, -160));
      await tester.pumpAndSettle();
      final scroll = Scrollable.of(
        tester.element(find.byType(SliverCardRows)),
      ).position;
      final offset = scroll.pixels;
      final results = tester
          .widgetList<DrillCard>(find.byType(DrillCard))
          .map((c) => c.drill.id)
          .toList();
      expect(results, isNotEmpty);
      for (final mode in [Brightness.dark, Brightness.light]) {
        await tester.pumpWidget(app(page, 'zh', mode));
        await tester.pumpAndSettle();
        expect(
          identical(tester.state(find.byType(LibraryPage)), state),
          isTrue,
        );
        expect(
          tester
              .widget<TextField>(find.byKey(const ValueKey('library-search')))
              .controller!
              .text,
          '支撑',
        );
        expect(scroll.pixels, offset);
        expect(
          tester
              .widgetList<DrillCard>(find.byType(DrillCard))
              .map((c) => c.drill.id),
          results,
        );
        expect(tester.takeException(), isNull);
      }
      await tester.pumpWidget(const SizedBox());
    },
  );
}
