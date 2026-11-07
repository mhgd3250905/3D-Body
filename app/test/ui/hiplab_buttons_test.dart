import 'package:flare/ui/components.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _app(
  Widget child, {
  Brightness brightness = Brightness.light,
  bool reduced = false,
}) => MaterialApp(
  theme: flareTheme(brightness),
  themeAnimationDuration: Duration.zero,
  builder: (context, child) {
    FlareColors.use(Theme.of(context).brightness);
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(disableAnimations: reduced),
      child: child!,
    );
  },
  home: Scaffold(
    body: Center(child: SizedBox(width: 240, child: child)),
  ),
);

Rect _paintedRect(WidgetTester tester, Finder finder) {
  final box = tester.renderObject<RenderBox>(finder);
  return Rect.fromPoints(
    box.localToGlobal(Offset.zero),
    box.localToGlobal(Offset(box.size.width, box.size.height)),
  );
}

Widget _button(bool secondary, VoidCallback? onPressed, {String? label}) =>
    secondary
    ? FlareSecondaryButton(label: label ?? 'Add to plan', onPressed: onPressed)
    : PrimaryAction(label: label ?? 'Start training', onPressed: onPressed);

Finder _materialButton(bool secondary) =>
    find.byType(secondary ? OutlinedButton : FilledButton);

void main() {
  setUpAll(() async {
    await (FontLoader(
      'FlareSans',
    )..addFont(rootBundle.load('assets/fonts/FlareSans.ttf'))).load();
  });
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final secondary in [false, true]) {
    final kind = secondary ? 'secondary' : 'primary';

    testWidgets('disabled $kind stays still and cannot activate', (
      tester,
    ) async {
      var activations = 0;
      var enabled = true;
      late StateSetter rebuild;
      await tester.pumpWidget(
        _app(
          StatefulBuilder(
            builder: (context, setState) {
              rebuild = setState;
              return _button(secondary, enabled ? () => activations++ : null);
            },
          ),
        ),
      );
      final button = _materialButton(secondary);
      final original = _paintedRect(tester, button);
      // Disable while held as well as exercising a fresh disabled press.
      final held = await tester.startGesture(tester.getCenter(button));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 150));
      expect(_paintedRect(tester, button).width, lessThan(original.width));
      rebuild(() => enabled = false);
      await tester.pumpAndSettle();
      expect(_paintedRect(tester, button), original);
      expect(
        tester
            .widget<FlarePressedScope>(find.byType(FlarePressedScope))
            .pressed,
        isFalse,
      );
      await held.up();
      await tester.pumpAndSettle();
      final disabledPress = await tester.startGesture(tester.getCenter(button));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 150));
      expect(_paintedRect(tester, button), original);
      expect(
        tester
            .widget<FlarePressedScope>(find.byType(FlarePressedScope))
            .pressed,
        isFalse,
      );
      await disabledPress.up();
      await tester.pumpAndSettle();
      expect(activations, 0);
    });

    for (final reduced in [false, true]) {
      testWidgets('$kind press and release respect reduced motion $reduced', (
        tester,
      ) async {
        var activations = 0;
        await tester.pumpWidget(
          _app(_button(secondary, () => activations++), reduced: reduced),
        );
        final button = _materialButton(secondary);
        final original = _paintedRect(tester, button);
        final held = await tester.startGesture(tester.getCenter(button));
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 150));
        expect(
          _paintedRect(tester, button).width,
          closeTo(original.width * (reduced ? 1 : .97), .01),
        );
        expect(
          tester
              .widget<FlarePressedScope>(find.byType(FlarePressedScope))
              .pressed,
          isTrue,
        );
        await held.up();
        await tester.pumpAndSettle();
        expect(_paintedRect(tester, button), original);
        expect(activations, 1);
      });
    }
  }

  for (final brightness in Brightness.values) {
    testWidgets('button appearance stays consistent in $brightness', (
      tester,
    ) async {
      await tester.pumpWidget(
        _app(
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _button(false, () {}),
              const SizedBox(height: 12),
              _button(true, () {}),
              const SizedBox(height: 12),
              const PrimaryAction(label: 'Disabled', onPressed: null),
            ],
          ),
          brightness: brightness,
        ),
      );
      final palette = brightness == Brightness.dark
          ? FlarePalette.dark
          : FlarePalette.light;
      for (final secondary in [false, true]) {
        final button = _materialButton(secondary).first;
        final surface = tester.widget<Material>(
          find.descendant(of: button, matching: find.byType(Material)).first,
        );
        expect(tester.getSize(button).height, 50);
        expect(
          (surface.shape! as RoundedRectangleBorder).borderRadius,
          BorderRadius.circular(14),
        );
        expect(
          surface.color,
          secondary ? FlareColors.secondaryFill : palette.accent,
        );
        if (secondary) {
          expect(
            (surface.shape! as RoundedRectangleBorder).side,
            BorderSide.none,
          );
        }
        final text = find.descendant(of: button, matching: find.byType(Text));
        final style = DefaultTextStyle.of(tester.element(text)).style;
        expect(style.fontFamily, 'FlareSans');
        expect(style.fontSize, 17);
        expect(style.fontWeight, secondary ? FontWeight.w500 : FontWeight.w600);
      }
      final disabled = find.widgetWithText(FilledButton, 'Disabled');
      expect(
        tester
            .widget<Material>(
              find
                  .descendant(of: disabled, matching: find.byType(Material))
                  .first,
            )
            .color,
        palette.raised,
      );
    });

    for (final language in ['en', 'de']) {
      testWidgets(
        'long $language labels remain inside both buttons in $brightness',
        (tester) async {
          final primary = language == 'de'
              ? 'Mit diesem Trainingsplan fortfahren'
              : 'Continue with this training plan';
          final secondary = language == 'de'
              ? 'Zu meinem Trainingsplan hinzufügen'
              : 'Add to my existing training plan';
          await tester.pumpWidget(
            _app(
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _button(false, () {}, label: primary),
                  const SizedBox(height: 12),
                  _button(true, () {}, label: secondary),
                ],
              ),
              brightness: brightness,
            ),
          );
          for (final label in [primary, secondary]) {
            final text = _paintedRect(tester, find.text(label));
            final button = _paintedRect(
              tester,
              _materialButton(label == secondary),
            );
            expect(text.left, greaterThanOrEqualTo(button.left));
            expect(text.right, lessThanOrEqualTo(button.right));
            expect(text.top, greaterThanOrEqualTo(button.top));
            expect(text.bottom, lessThanOrEqualTo(button.bottom));
          }
          expect(tester.takeException(), isNull);
        },
      );
    }
  }
}
