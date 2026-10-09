import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flare/ui/motion.dart';

class _Counter extends StatefulWidget {
  const _Counter();
  @override
  State<_Counter> createState() => _CounterState();
}

class _CounterState extends State<_Counter> {
  int taps = 0;
  @override
  Widget build(BuildContext context) => Center(
    child: TextButton(
      onPressed: () => setState(() => taps++),
      child: Text('taps $taps'),
    ),
  );
}

Widget _host(
  Object key,
  int depth,
  Widget? child, {
  bool modal = false,
  bool reduce = false,
}) => MaterialApp(
  home: Stack(
    children: [
      // Stands in for the 3D stage under an empty page.
      Align(
        alignment: Alignment.topLeft,
        child: TextButton(onPressed: () {}, child: const Text('stage')),
      ),
      Positioned.fill(
        child: Builder(
          builder: (context) => MediaQuery(
            data: MediaQuery.of(context).copyWith(disableAnimations: reduce),
            child: FlareStage(
              pageKey: key,
              depth: depth,
              modal: modal,
              child: child,
            ),
          ),
        ),
      ),
    ],
  ),
);

void main() {
  testWidgets('push slides the new page in and it keeps its state', (
    tester,
  ) async {
    await tester.pumpWidget(_host('home', 0, null));
    // The empty home page lets touches through to the stage.
    await tester.tap(find.text('stage'));

    await tester.pumpWidget(_host('a', 1, const _Counter()));
    await tester.pump(const Duration(milliseconds: 60));
    final start = tester.getTopLeft(find.byType(_Counter)).dx;
    expect(start, greaterThan(100));
    await tester.pumpAndSettle();
    expect(tester.getTopLeft(find.byType(_Counter)).dx, 0);

    await tester.tap(find.text('taps 0'));
    await tester.pump();
    expect(find.text('taps 1'), findsOneWidget);

    // A deeper page slides over; the first keeps its state underneath.
    await tester.pumpWidget(_host('b', 2, const Text('deeper')));
    await tester.pump(const Duration(milliseconds: 60));
    expect(find.text('taps 1'), findsOneWidget);
    await tester.pumpAndSettle();
    expect(find.text('taps 1'), findsNothing);

    // Popping back slides the deeper page off to the right.
    await tester.pumpWidget(_host('a', 1, const _Counter()));
    await tester.pump(const Duration(milliseconds: 60));
    expect(tester.getTopLeft(find.text('deeper')).dx, greaterThan(0));
    await tester.pumpAndSettle();
    expect(find.text('deeper'), findsNothing);
  });

  testWidgets('a modal page rises from the bottom', (tester) async {
    await tester.pumpWidget(_host('a', 1, const Text('page')));
    await tester.pumpWidget(
      _host('timer', 9, const Text('timer'), modal: true),
    );
    await tester.pump(const Duration(milliseconds: 60));
    expect(tester.getTopLeft(find.text('timer')).dy, greaterThan(100));
    await tester.pumpAndSettle();
    expect(find.text('page'), findsNothing);
  });

  testWidgets('reduced motion switches pages at once', (tester) async {
    Widget reduced(Object key, int depth, Widget child) =>
        _host(key, depth, child, reduce: true);
    await tester.pumpWidget(reduced('a', 1, const Text('one')));
    await tester.pumpWidget(reduced('b', 2, const Text('two')));
    await tester.pump();
    expect(find.text('one'), findsNothing);
    expect(tester.getTopLeft(find.text('two')).dx, lessThan(400));
  });
}
