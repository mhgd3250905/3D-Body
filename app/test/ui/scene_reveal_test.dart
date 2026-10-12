import 'package:flare/ui/app_shell.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _app({
  bool enabled = true,
  bool presented = false,
  bool reduced = false,
  Widget? error,
}) => MaterialApp(
  home: MediaQuery(
    data: MediaQueryData(disableAnimations: reduced),
    child: SceneRevealLayer(
      enabled: enabled,
      presented: presented,
      bottomInset: 86,
      backdrop: const ColoredBox(color: Colors.white),
      loading: const Text('loading'),
      error: error,
    ),
  ),
);

double _opacity(WidgetTester tester, String key) =>
    tester.widget<Opacity>(find.byKey(ValueKey(key))).opacity;

void main() {
  testWidgets('startup cover reveals without a second scene animation', (
    tester,
  ) async {
    await tester.pumpWidget(_app(enabled: false));
    await tester.pumpWidget(_app(enabled: false, presented: true));
    await tester.pumpWidget(_app(presented: true));
    expect(find.text('loading'), findsNothing);
    expect(find.byKey(const ValueKey('scene-cover-opacity')), findsNothing);
  });

  testWidgets('mark leaves before the opaque cover reveals the first frame', (
    tester,
  ) async {
    await tester.pumpWidget(_app());
    await tester.pump(const Duration(seconds: 2));
    expect(_opacity(tester, 'scene-mark-opacity'), 1);
    expect(_opacity(tester, 'scene-cover-opacity'), 1);

    await tester.pumpWidget(_app(presented: true));
    await tester.pump(const Duration(milliseconds: 60));
    expect(_opacity(tester, 'scene-mark-opacity'), inExclusiveRange(0, 1));
    expect(_opacity(tester, 'scene-cover-opacity'), 1);
    await tester.pump(const Duration(milliseconds: 60));
    expect(find.text('loading'), findsNothing);
    expect(_opacity(tester, 'scene-cover-opacity'), 1);
    await tester.pump(const Duration(milliseconds: 110));
    expect(_opacity(tester, 'scene-cover-opacity'), closeTo(.5, .01));
    expect(find.text('loading'), findsNothing);
    await tester.pump(const Duration(milliseconds: 111));
    expect(find.byKey(const ValueKey('scene-ready')), findsOneWidget);
    expect(find.byKey(const ValueKey('scene-cover-opacity')), findsNothing);
  });

  testWidgets('a failed or replaced scene restores an opaque loading cover', (
    tester,
  ) async {
    await tester.pumpWidget(_app(presented: true));
    await tester.pumpWidget(_app(error: const Text('retry')));
    expect(_opacity(tester, 'scene-cover-opacity'), 1);
    expect(find.text('retry'), findsOneWidget);
    expect(find.text('loading'), findsNothing);
    await tester.pumpWidget(_app());
    expect(_opacity(tester, 'scene-cover-opacity'), 1);
    expect(find.text('loading'), findsOneWidget);
    await tester.pumpWidget(_app(presented: true));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('scene-ready')), findsOneWidget);
  });

  testWidgets('reduced motion reveals a presented frame immediately', (
    tester,
  ) async {
    await tester.pumpWidget(_app(reduced: true));
    await tester.pumpWidget(_app(presented: true, reduced: true));
    expect(find.byKey(const ValueKey('scene-ready')), findsOneWidget);
    expect(find.text('loading'), findsNothing);
  });
}
