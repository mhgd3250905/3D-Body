import 'dart:convert';
import 'dart:ui' as ui;

import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/row_icons.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _app(
  Widget child, {
  Brightness brightness = Brightness.light,
  bool highContrast = false,
}) => MaterialApp(
  locale: const Locale('en'),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  theme: flareTheme(brightness),
  themeAnimationDuration: Duration.zero,
  builder: (context, child) {
    FlareColors.use(Theme.of(context).brightness);
    return MediaQuery(
      data: MediaQuery.of(context).copyWith(highContrast: highContrast),
      child: child!,
    );
  },
  home: Scaffold(body: Center(child: child)),
);

Future<Uint8List> _raster(FlareRowEmblemPainter painter) async {
  final recorder = ui.PictureRecorder();
  final canvas = Canvas(recorder)..scale(2);
  painter.paint(canvas, const Size(30, 30));
  final picture = recorder.endRecording();
  final image = await picture.toImage(60, 60);
  try {
    final data = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
    return Uint8List.fromList(data!.buffer.asUint8List());
  } finally {
    image.dispose();
    picture.dispose();
  }
}

FlareRowEmblemPainter _visiblePainter(WidgetTester tester) => tester
    .widgetList<CustomPaint>(
      find.descendant(
        of: find.byType(FlareRowEmblem),
        matching: find.byType(CustomPaint),
      ),
    )
    .map((paint) => paint.painter)
    .whereType<FlareRowEmblemPainter>()
    .single;

void main() {
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final dark in [false, true]) {
    for (final highContrast in [false, true]) {
      testWidgets(
        'every role is visible and distinguishable dark=$dark contrast=$highContrast',
        (tester) async {
          final drawings = await tester.runAsync(() async {
            final result = <FlareRowSymbol, Uint8List>{};
            for (final symbol in FlareRowSymbol.values) {
              result[symbol] = await _raster(
                FlareRowEmblemPainter(
                  symbol: symbol,
                  dark: dark,
                  highContrast: highContrast,
                ),
              );
            }
            return result;
          });
          expect(drawings, isNotNull);
          expect(drawings!.length, 13);
          for (final entry in drawings.entries) {
            var paintedPixels = 0;
            for (var i = 3; i < entry.value.length; i += 4) {
              if (entry.value[i] > 16) paintedPixels++;
            }
            expect(
              paintedPixels,
              greaterThan(100),
              reason: '${entry.key.name} must remain readable at row size',
            );
          }
          expect(
            drawings.values.map(base64Encode).toSet().length,
            drawings.length,
            reason: 'Different menu meanings must not share one placeholder',
          );
        },
      );
    }
  }

  for (final brightness in Brightness.values) {
    for (final highContrast in [false, true]) {
      testWidgets(
        'row artwork stays 30pt and static $brightness contrast=$highContrast',
        (tester) async {
          await tester.pumpWidget(
            _app(
              Wrap(
                spacing: 8,
                children: [
                  for (final symbol in FlareRowSymbol.values)
                    FlareRowEmblem(symbol: symbol),
                ],
              ),
              brightness: brightness,
              highContrast: highContrast,
            ),
          );
          await tester.pumpAndSettle();
          final emblems = find.byType(FlareRowEmblem);
          expect(emblems, findsNWidgets(13));
          for (final element in emblems.evaluate()) {
            expect(
              tester.getSize(find.byWidget(element.widget)),
              const Size(30, 30),
            );
          }
          final painters = tester
              .widgetList<CustomPaint>(
                find.descendant(
                  of: emblems,
                  matching: find.byType(CustomPaint),
                ),
              )
              .map((paint) => paint.painter)
              .whereType<FlareRowEmblemPainter>();
          expect(painters.length, 13);
          for (final painter in painters) {
            expect(painter.dark, brightness == Brightness.dark);
            expect(painter.highContrast, highContrast);
          }
          for (final type in [
            Image,
            Texture,
            BackdropFilter,
            AnimatedBuilder,
          ]) {
            expect(
              find.descendant(of: emblems, matching: find.byType(type)),
              findsNothing,
            );
          }
          expect(tester.binding.transientCallbackCount, 0);
          await tester.pump(const Duration(seconds: 2));
          expect(tester.binding.transientCallbackCount, 0);
          expect(tester.takeException(), isNull);
        },
      );
    }
  }

  testWidgets(
    'artwork belongs to the row action and adds no button semantics',
    (tester) async {
      final semantics = tester.ensureSemantics();
      try {
        var opens = 0;
        await tester.pumpWidget(
          _app(
            SizedBox(
              width: 340,
              child: FlareListGroup(
                children: [
                  FlareListRow(
                    title: 'Training',
                    leading: const FlareRowEmblem(
                      symbol: FlareRowSymbol.training,
                    ),
                    onTap: () => opens++,
                  ),
                ],
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        expect(find.bySemanticsLabel('Training'), findsOneWidget);
        final rowNode = tester.getSemantics(find.bySemanticsLabel('Training'));
        expect(rowNode.getSemanticsData().flagsCollection.isButton, isTrue);
        expect(
          rowNode.getSemanticsData().hasAction(ui.SemanticsAction.tap),
          isTrue,
        );
        expect(
          find.descendant(
            of: find.byType(FlareRowEmblem),
            matching: find.byWidgetPredicate(
              (widget) =>
                  widget is Semantics && widget.properties.button == true,
            ),
          ),
          findsNothing,
        );

        await tester.tap(find.byType(FlareRowEmblem));
        await tester.pumpAndSettle();
        expect(opens, 1);
        await tester.tap(find.text('Training'));
        await tester.pumpAndSettle();
        expect(opens, 2);
        final gesture = find.descendant(
          of: find.byType(FlareListRow),
          matching: find.byType(GestureDetector),
        );
        Focus.of(tester.element(gesture)).requestFocus();
        await tester.pump();
        await tester.sendKeyEvent(LogicalKeyboardKey.enter);
        await tester.pumpAndSettle();
        expect(opens, 3);
        await tester.sendKeyEvent(LogicalKeyboardKey.space);
        await tester.pumpAndSettle();
        expect(opens, 4);
      } finally {
        semantics.dispose();
      }
    },
  );

  testWidgets(
    'changing theme preserves the open content state and repaints icons',
    (tester) async {
      final brightness = ValueNotifier(Brightness.light);
      addTearDown(brightness.dispose);
      final probeKey = GlobalKey<_ThemeProbeState>();
      await tester.pumpWidget(
        ValueListenableBuilder<Brightness>(
          valueListenable: brightness,
          builder: (context, value, _) =>
              _app(_ThemeProbe(key: probeKey), brightness: value),
        ),
      );
      await tester.pumpAndSettle();
      final retainedState = probeKey.currentState!;
      retainedState.increment();
      await tester.pump();
      final light = _visiblePainter(tester);
      expect(light.dark, isFalse);
      brightness.value = Brightness.dark;
      await tester.pumpAndSettle();
      expect(probeKey.currentState, same(retainedState));
      expect(find.text('retained:1'), findsOneWidget);
      final dark = _visiblePainter(tester);
      expect(dark.dark, isTrue);
      final pixels = await tester.runAsync(
        () async => [await _raster(light), await _raster(dark)],
      );
      expect(base64Encode(pixels![0]), isNot(base64Encode(pixels[1])));
      expect(tester.takeException(), isNull);
    },
  );
}

class _ThemeProbe extends StatefulWidget {
  const _ThemeProbe({super.key});

  @override
  State<_ThemeProbe> createState() => _ThemeProbeState();
}

class _ThemeProbeState extends State<_ThemeProbe> {
  int count = 0;

  void increment() => setState(() => count++);

  @override
  Widget build(BuildContext context) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      const FlareRowEmblem(symbol: FlareRowSymbol.settings),
      Text('retained:$count'),
    ],
  );
}
