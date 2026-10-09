import 'package:flare/ui/loader_mark.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _host({required bool reduce}) => MaterialApp(
  home: Builder(
    builder: (context) => MediaQuery(
      data: MediaQuery.of(context).copyWith(disableAnimations: reduce),
      child: const Center(child: FlareLoaderMark()),
    ),
  ),
);

FlareLoaderPainter _painter(WidgetTester tester) =>
    tester
            .widget<CustomPaint>(
              find.byWidgetPredicate(
                (widget) =>
                    widget is CustomPaint &&
                    widget.painter is FlareLoaderPainter,
              ),
            )
            .painter!
        as FlareLoaderPainter;

void main() {
  testWidgets(
    'reduced-motion loader stays still and unmounts without a ticker',
    (tester) async {
      await tester.pumpWidget(_host(reduce: true));
      final still = _painter(tester).t;
      await tester.pump(const Duration(seconds: 2));
      expect(_painter(tester).t, still);
      expect(tester.binding.transientCallbackCount, 0);
      await tester.pumpWidget(const SizedBox.shrink());
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'loader responds to motion preference changes and releases ticker',
    (tester) async {
      await tester.pumpWidget(_host(reduce: false));
      await tester.pump(const Duration(milliseconds: 400));
      expect(_painter(tester).t, greaterThan(0));

      await tester.pumpWidget(_host(reduce: true));
      final still = _painter(tester).t;
      await tester.pump(const Duration(milliseconds: 400));
      expect(_painter(tester).t, still);
      expect(tester.binding.transientCallbackCount, 0);

      await tester.pumpWidget(_host(reduce: false));
      await tester.pump(const Duration(milliseconds: 100));
      expect(_painter(tester).t, greaterThan(still));
      await tester.pumpWidget(const SizedBox.shrink());
      expect(tester.binding.transientCallbackCount, 0);
      expect(tester.takeException(), isNull);
    },
  );
}
