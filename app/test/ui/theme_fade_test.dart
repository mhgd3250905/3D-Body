import 'package:flare/ui/motion.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/theme_fade.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class _Swatch extends StatefulWidget {
  const _Swatch();
  @override
  State<_Swatch> createState() => _SwatchState();
}

class _SwatchState extends State<_Swatch> {
  int taps = 0;
  @override
  Widget build(BuildContext context) {
    Theme.of(context);
    return ColoredBox(
      color: FlareColors.background,
      child: Stack(
        children: [
          const Positioned(
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            child: ThemeFadeWindow(),
          ),
          Center(
            child: TextButton(
              onPressed: () => setState(() => taps++),
              child: Text('taps $taps'),
            ),
          ),
        ],
      ),
    );
  }
}

Widget _app(ThemeMode mode, {bool reduce = false}) => MaterialApp(
  theme: flareTheme(Brightness.light),
  darkTheme: flareTheme(Brightness.dark),
  themeMode: mode,
  themeAnimationDuration: Duration.zero,
  builder: (context, child) {
    final brightness = Theme.of(context).brightness;
    FlareColors.use(brightness);
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(disableAnimations: reduce),
      child: ThemeCrossFade(brightness: brightness, child: child!),
    );
  },
  home: const _Swatch(),
);

ThemeCrossFadeState _fade(WidgetTester tester) =>
    tester.state<ThemeCrossFadeState>(find.byType(ThemeCrossFade));

void main() {
  tearDown(() => FlareColors.use(Brightness.dark));

  testWidgets('appearance switch dissolves the old frame over the new one', (
    tester,
  ) async {
    await tester.pumpWidget(_app(ThemeMode.dark));
    await tester.tap(find.text('taps 0'));
    await tester.pump();
    expect(_fade(tester).fading, isFalse);

    await tester.pumpWidget(_app(ThemeMode.light));
    // The new palette is in place at once: no frame mixes tokens.
    expect(FlareColors.palette.isDark, isFalse);
    final swatch = tester.widget<ColoredBox>(
      find
          .descendant(
            of: find.byType(_Swatch),
            matching: find.byType(ColoredBox),
          )
          .first,
    );
    expect(swatch.color, FlarePalette.light.background);
    // ...and the old frame lies over it, fully opaque, then fades.
    expect(_fade(tester).fading, isTrue);
    expect(find.byKey(const ValueKey('theme-cross-fade')), findsOneWidget);
    expect(_fade(tester).oldOpacity, closeTo(1, .01));
    await tester.pump(FlareMotion.theme ~/ 2);
    expect(_fade(tester).oldOpacity, inExclusiveRange(.3, .7));
    // The overlay never takes touches; state below survives the switch.
    await tester.tap(find.text('taps 1'));
    await tester.pump();
    expect(find.text('taps 2'), findsOneWidget);
    await tester.pump(FlareMotion.theme);
    expect(_fade(tester).fading, isFalse);
    expect(find.byKey(const ValueKey('theme-cross-fade')), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('a switch mid-dissolve restarts from the screen as shown', (
    tester,
  ) async {
    await tester.pumpWidget(_app(ThemeMode.dark));
    await tester.pumpWidget(_app(ThemeMode.light));
    await tester.pump(FlareMotion.theme ~/ 3);
    await tester.pumpWidget(_app(ThemeMode.dark));
    expect(FlareColors.palette.isDark, isTrue);
    expect(_fade(tester).oldOpacity, closeTo(1, .01));
    await tester.pumpAndSettle();
    expect(_fade(tester).fading, isFalse);
    expect(tester.takeException(), isNull);
  });

  testWidgets('the live 3D window is left open and backed underneath', (
    tester,
  ) async {
    await tester.pumpWidget(_app(ThemeMode.dark));
    await tester.pumpWidget(_app(ThemeMode.light));
    final window = find.descendant(
      of: find.byType(ThemeFadeWindow),
      matching: find.byType(CustomPaint),
    );
    expect(window, findsOneWidget);
    await tester.pumpAndSettle();
    expect(window, findsNothing);
  });

  testWidgets('reduced motion switches instantly', (tester) async {
    await tester.pumpWidget(_app(ThemeMode.dark, reduce: true));
    await tester.pumpWidget(_app(ThemeMode.light, reduce: true));
    expect(FlareColors.palette.isDark, isFalse);
    expect(_fade(tester).fading, isFalse);
    expect(find.byKey(const ValueKey('theme-cross-fade')), findsNothing);
  });
}
