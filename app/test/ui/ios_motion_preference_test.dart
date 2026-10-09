import 'package:flare/main.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/loader_mark.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

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

Future<void> _openLoader(WidgetTester tester) async {
  await tester.pumpWidget(const FlareBootstrap());
  await tester.pumpAndSettle();
  final welcome = tester.element(find.byType(WelcomePage));
  Navigator.of(welcome).push<void>(
    MaterialPageRoute<void>(
      builder: (context) =>
          const Scaffold(body: Center(child: FlareLoaderMark())),
    ),
  );
  await tester.pump();
  await tester.pump(const Duration(seconds: 1));
}

void main() {
  setUp(() {
    rootBundle.clear();
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('iOS reduceMotion alone stops the app loading mark', (
    tester,
  ) async {
    final platform = tester.binding.platformDispatcher;
    addTearDown(platform.clearAccessibilityFeaturesTestValue);
    // iOS uses this bit, independently of Android's disableAnimations.
    platform.accessibilityFeaturesTestValue = const FakeAccessibilityFeatures(
      reduceMotion: true,
    );
    await _openLoader(tester);
    final still = _painter(tester).t;
    await tester.pump(const Duration(seconds: 2));
    expect(_painter(tester).t, still);
    expect(tester.binding.transientCallbackCount, 0);
    await tester.pumpWidget(const SizedBox.shrink());
    expect(tester.takeException(), isNull);
  });

  testWidgets('live iOS motion changes stop and resume the existing loader', (
    tester,
  ) async {
    final platform = tester.binding.platformDispatcher;
    addTearDown(platform.clearAccessibilityFeaturesTestValue);
    platform.accessibilityFeaturesTestValue = const FakeAccessibilityFeatures();
    await _openLoader(tester);
    final loader = tester.element(find.byType(FlareLoaderMark));
    final moving = _painter(tester).t;
    await tester.pump(const Duration(milliseconds: 400));
    expect(_painter(tester).t, greaterThan(moving));

    platform.accessibilityFeaturesTestValue = const FakeAccessibilityFeatures(
      reduceMotion: true,
    );
    await tester.pump();
    final still = _painter(tester).t;
    await tester.pump(const Duration(seconds: 2));
    expect(_painter(tester).t, still);
    expect(tester.element(find.byType(FlareLoaderMark)), same(loader));

    platform.accessibilityFeaturesTestValue = const FakeAccessibilityFeatures();
    await tester.pump();
    final resumed = _painter(tester).t;
    await tester.pump(const Duration(milliseconds: 400));
    expect(_painter(tester).t, greaterThan(resumed));
    await tester.pumpWidget(const SizedBox.shrink());
    expect(tester.binding.transientCallbackCount, 0);
    expect(tester.takeException(), isNull);
  });
}
