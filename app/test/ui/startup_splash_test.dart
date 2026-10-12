import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/flare_silhouette.dart';
import 'package:flare/ui/startup_splash.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _app({
  bool ready = false,
  bool reduced = false,
  String? error,
  required VoidCallback onRevealed,
  VoidCallback? onRetry,
  VoidCallback? onUnderlyingTap,
}) => MaterialApp(
  theme: flareTheme(Brightness.light),
  locale: const Locale('zh'),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  home: MediaQuery(
    data: MediaQueryData(disableAnimations: reduced),
    child: Stack(
      fit: StackFit.expand,
      children: [
        GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onUnderlyingTap,
          child: const SizedBox.expand(),
        ),
        FlareStartupSplash(
          ready: ready,
          error: error,
          onRetry: onRetry ?? () {},
          onRevealed: onRevealed,
        ),
      ],
    ),
  ),
);

double _opacity(WidgetTester tester, String name) =>
    tester.widget<Opacity>(find.byKey(ValueKey(name))).opacity;

void main() {
  testWidgets(
    'startup waits for presentation, then reveals once in two stages',
    (tester) async {
      var revealed = 0;
      var underlyingTaps = 0;
      Widget app({bool ready = false, String? error}) => _app(
        ready: ready,
        error: error,
        onRevealed: () => revealed++,
        onUnderlyingTap: () => underlyingTaps++,
      );
      await tester.pumpWidget(app());
      await tester.pump(const Duration(seconds: 3));
      expect(find.text('Flare 托马斯'), findsOneWidget);
      expect(_opacity(tester, 'startup-cover-opacity'), 1);
      expect(revealed, 0);
      await tester.tapAt(const Offset(10, 10));
      expect(underlyingTaps, 0);

      await tester.pumpWidget(app(ready: true));
      await tester.pump(const Duration(milliseconds: 60));
      expect(
        _opacity(tester, 'startup-content-opacity'),
        inExclusiveRange(0, 1),
      );
      expect(_opacity(tester, 'startup-cover-opacity'), 1);
      await tester.pump(const Duration(milliseconds: 60));
      expect(find.text('Flare 托马斯'), findsNothing);
      expect(_opacity(tester, 'startup-cover-opacity'), 1);
      await tester.pump(const Duration(milliseconds: 110));
      expect(_opacity(tester, 'startup-cover-opacity'), closeTo(.5, .01));
      expect(revealed, 0);
      await tester.tapAt(const Offset(10, 10));
      expect(underlyingTaps, 0);
      await tester.pump(const Duration(milliseconds: 111));
      expect(find.byKey(const ValueKey('startup-revealed')), findsOneWidget);
      expect(revealed, 1);
      await tester.tapAt(const Offset(10, 10));
      expect(underlyingTaps, 1);

      await tester.pumpWidget(app(error: 'later scene error'));
      await tester.pumpWidget(app(ready: true));
      await tester.pumpAndSettle();
      expect(find.text('Flare 托马斯'), findsNothing);
      expect(find.text('later scene error'), findsNothing);
      expect(revealed, 1);
    },
  );

  testWidgets(
    'readiness loss and errors restore the opaque cover before reveal',
    (tester) async {
      var revealed = 0;
      var retries = 0;
      Widget app({bool ready = false, String? error}) => _app(
        ready: ready,
        error: error,
        onRevealed: () => revealed++,
        onRetry: () => retries++,
      );
      await tester.pumpWidget(app());
      await tester.pumpWidget(app(ready: true));
      await tester.pump(const Duration(milliseconds: 200));
      expect(_opacity(tester, 'startup-cover-opacity'), lessThan(1));
      await tester.pumpWidget(app());
      expect(_opacity(tester, 'startup-cover-opacity'), 1);
      expect(_opacity(tester, 'startup-content-opacity'), 1);
      expect(revealed, 0);

      await tester.pumpWidget(app(ready: true, error: '无法载入动作，请重试'));
      await tester.pump(const Duration(seconds: 1));
      expect(find.text('无法载入动作，请重试'), findsOneWidget);
      expect(
        tester
            .widget<FlareLoadingSilhouette>(find.byType(FlareLoadingSilhouette))
            .animate,
        isFalse,
      );
      expect(_opacity(tester, 'startup-cover-opacity'), 1);
      await tester.tap(find.text('重试'));
      expect(retries, 1);
      expect(revealed, 0);
      await tester.pumpWidget(app(ready: true));
      await tester.pump(const Duration(milliseconds: 341));
      expect(revealed, 1);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'reduced motion reveals as soon as ready without replaying startup',
    (tester) async {
      var revealed = 0;
      await tester.pumpWidget(
        _app(reduced: true, onRevealed: () => revealed++),
      );
      expect(revealed, 0);
      await tester.pumpWidget(
        _app(ready: true, reduced: true, onRevealed: () => revealed++),
      );
      expect(find.byKey(const ValueKey('startup-revealed')), findsOneWidget);
      expect(revealed, 1);
      await tester.pumpWidget(
        _app(reduced: true, onRevealed: () => revealed++),
      );
      expect(find.byType(FlareLoadingSilhouette), findsNothing);
      expect(revealed, 1);
      expect(tester.takeException(), isNull);
    },
  );
}
