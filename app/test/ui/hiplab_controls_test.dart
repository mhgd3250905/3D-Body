import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'flow_regressions_test.dart' show phoneSize;

// FlareSwitch and showFlareConfirmDialog have no host-page call sites yet.
// These tests validate their public component behavior, not device flows.
Widget _app(
  Widget child, {
  bool reduced = false,
  Brightness brightness = Brightness.light,
  String language = 'en',
}) => MaterialApp(
  locale: Locale(language),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
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
    body: Center(child: SizedBox(width: 300, child: child)),
  ),
);

void main() {
  setUpAll(() async {
    await (FontLoader(
      'FlareSans',
    )..addFont(rootBundle.load('assets/fonts/FlareSans.ttf'))).load();
  });
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final brightness in Brightness.values) {
    for (final reduced in [false, true]) {
      testWidgets('switch tap and keyboard update once $brightness/$reduced', (
        tester,
      ) async {
        await phoneSize(tester);
        var value = false;
        final changes = <bool>[];
        await tester.pumpWidget(
          _app(
            StatefulBuilder(
              builder: (context, setState) => Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  FlareSwitch(
                    value: value,
                    semanticLabel: 'Training reminders',
                    onChanged: (next) => setState(() {
                      value = next;
                      changes.add(next);
                    }),
                  ),
                  Text('reminders:$value'),
                ],
              ),
            ),
            brightness: brightness,
            reduced: reduced,
          ),
        );
        final knob = find.descendant(
          of: find.byType(FlareSwitch),
          matching: find.byWidgetPredicate(
            (widget) =>
                widget is Container &&
                widget.decoration is BoxDecoration &&
                (widget.decoration! as BoxDecoration).shape == BoxShape.circle,
          ),
        );
        final start = tester.getCenter(knob);
        expect(find.bySemanticsLabel('Training reminders'), findsOneWidget);
        await tester.tap(find.byType(FlareSwitch));
        await tester.pump();
        expect(find.text('reminders:true'), findsOneWidget);
        if (reduced) {
          expect(tester.getCenter(knob).dx, greaterThan(start.dx));
          final settled = tester.getCenter(knob);
          await tester.pump(const Duration(milliseconds: 80));
          expect(tester.getCenter(knob), settled);
        }
        await tester.pumpAndSettle();
        expect(tester.getCenter(knob).dx, greaterThan(start.dx));
        await tester.tap(find.byType(FlareSwitch));
        await tester.pumpAndSettle();
        expect(find.text('reminders:false'), findsOneWidget);
        expect(tester.getCenter(knob), start);

        final gesture = find.descendant(
          of: find.byType(FlareSwitch),
          matching: find.byType(GestureDetector),
        );
        Focus.of(tester.element(gesture)).requestFocus();
        await tester.pump();
        await tester.sendKeyEvent(LogicalKeyboardKey.space);
        await tester.pumpAndSettle();
        expect(find.text('reminders:true'), findsOneWidget);
        await tester.sendKeyEvent(LogicalKeyboardKey.enter);
        await tester.pumpAndSettle();
        expect(find.text('reminders:false'), findsOneWidget);
        expect(changes, [true, false, true, false]);
        expect(tester.takeException(), isNull);
      });
    }
  }

  for (final language in ['en', 'de']) {
    for (final reduced in [false, true]) {
      testWidgets(
        'settings segments tap, drag, and fit long $language labels reduced=$reduced',
        (tester) async {
          await phoneSize(tester);
          var selected = 'system';
          var longLabels = false;
          late StateSetter update;
          final changes = <String>[];
          final short = language == 'de'
              ? const ['System', 'Dunkel', 'Hell']
              : const ['System', 'Dark', 'Light'];
          final long = language == 'de'
              ? const [
                  'Systemeinstellung verwenden',
                  'Dunkles Erscheinungsbild verwenden',
                  'Helles Erscheinungsbild verwenden',
                ]
              : const [
                  'Use the system appearance',
                  'Use the dark appearance',
                  'Use the light appearance',
                ];
          await tester.pumpWidget(
            _app(
              StatefulBuilder(
                builder: (context, setState) {
                  update = setState;
                  final labels = longLabels ? long : short;
                  return Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      FlareSegmented<String>(
                        height: 32,
                        radius: 9,
                        inset: 2,
                        ios: true,
                        expand: true,
                        segments: [
                          ('system', labels[0]),
                          ('dark', labels[1]),
                          ('light', labels[2]),
                        ],
                        selected: selected,
                        onChanged: (next) => setState(() {
                          selected = next;
                          changes.add(next);
                        }),
                      ),
                      Text('appearance:$selected'),
                    ],
                  );
                },
              ),
              language: language,
              brightness: language == 'de' ? Brightness.dark : Brightness.light,
              reduced: reduced,
            ),
          );
          expect(
            tester.getSize(find.byType(FlareSegmented<String>)).height,
            32,
          );
          await tester.tap(find.text(short[1]));
          await tester.pumpAndSettle();
          expect(find.text('appearance:dark'), findsOneWidget);
          final from = tester.getCenter(find.text(short[1]));
          final to = tester.getCenter(find.text(short[0]));
          await tester.dragFrom(from, to - from);
          await tester.pumpAndSettle();
          expect(find.text('appearance:system'), findsOneWidget);

          update(() => longLabels = true);
          await tester.pumpAndSettle();
          // Narrow settings offer full-width choices instead of unreadable text.
          expect(
            find.byKey(const ValueKey('flare-segmented-stacked')),
            findsOneWidget,
          );
          await tester.tap(find.text(long[2]));
          await tester.pumpAndSettle();
          expect(find.text('appearance:light'), findsOneWidget);
          expect(changes, ['dark', 'system', 'light']);
          expect(tester.takeException(), isNull);
        },
      );
    }

    for (final dismissal in ['barrier', 'cancel', 'confirm']) {
      testWidgets(
        'long $language confirmation resolves correctly through $dismissal',
        (tester) async {
          await phoneSize(tester);
          final title = language == 'de'
              ? 'Diesen ausführlichen Trainingsplan wirklich dauerhaft entfernen?'
              : 'Permanently remove this detailed training plan?';
          final paragraph = language == 'de'
              ? 'Alle gespeicherten Übungen und persönlichen Einstellungen sind vor dem Fortfahren sorgfältig zu prüfen. '
              : 'Review every saved exercise and personal setting carefully before continuing with this action. ';
          final cancel = language == 'de'
              ? 'Trainingsplan behalten'
              : 'Keep the training plan';
          final confirm = language == 'de'
              ? 'Dauerhaft entfernen'
              : 'Remove permanently';
          var resolved = false;
          bool? result;
          await tester.pumpWidget(
            _app(
              StatefulBuilder(
                builder: (context, setState) => TextButton(
                  onPressed: () async {
                    final answer = await showFlareConfirmDialog(
                      context,
                      title: title,
                      message: List.filled(24, paragraph).join('\n\n'),
                      cancelLabel: cancel,
                      confirmLabel: confirm,
                      destructive: true,
                    );
                    setState(() {
                      resolved = true;
                      result = answer;
                    });
                  },
                  child: const Text('Open confirmation'),
                ),
              ),
              language: language,
              brightness: language == 'de' ? Brightness.dark : Brightness.light,
              reduced: language == 'de',
            ),
          );
          await tester.tap(find.text('Open confirmation'));
          await tester.pumpAndSettle();
          expect(resolved, isFalse);
          expect(find.text(title), findsOneWidget);
          final scroll = find.byType(SingleChildScrollView);
          await tester.fling(scroll, const Offset(0, -900), 1800);
          await tester.pumpAndSettle();
          final position = tester
              .state<ScrollableState>(
                find.descendant(of: scroll, matching: find.byType(Scrollable)),
              )
              .position;
          expect(position.pixels, greaterThan(0));
          // Scrolling a long message keeps both actions available.
          expect(find.text(cancel).hitTestable(), findsOneWidget);
          expect(find.text(confirm).hitTestable(), findsOneWidget);
          expect(tester.takeException(), isNull);
          if (dismissal == 'barrier') {
            await tester.tapAt(const Offset(8, 8));
          } else {
            await tester.tap(
              find.text(dismissal == 'cancel' ? cancel : confirm),
            );
          }
          await tester.pumpAndSettle();
          expect(resolved, isTrue);
          expect(
            result,
            dismissal == 'barrier' ? isNull : dismissal == 'confirm',
          );
          expect(find.text(title), findsNothing);
          expect(tester.takeException(), isNull);
        },
      );
    }
  }
}
