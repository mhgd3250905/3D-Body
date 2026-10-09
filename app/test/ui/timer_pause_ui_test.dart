import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/timer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _MemoryStorage implements LocalStateStorage {
  @override
  Future<String?> read(String key) async => null;
  @override
  Future<void> write(String key, String value) async {}
}

class _TimerHarness {
  int now = 0;

  Future<void> open(WidgetTester tester, String drillId) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final catalog = loadCatalogFixture();
    final store = LearningStore(catalog: catalog, storage: _MemoryStorage());
    await store.initialize();
    addTearDown(store.dispose);
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(),
        locale: const Locale('zh'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: SafeArea(
            child: TrainingTimerPage(
              drill: catalog.drillById(drillId)!,
              store: store,
              now: () => now,
              onClose: () {},
            ),
          ),
        ),
      ),
    );
  }

  Future<void> advance(WidgetTester tester, int milliseconds) async {
    // Keep every foreground poll under the unattended-work cutoff.
    for (var left = milliseconds; left > 0;) {
      final step = left.clamp(1, 1000);
      now += step;
      left -= step;
      await tester.pump(const Duration(milliseconds: 150));
    }
  }

  Future<void> tap(WidgetTester tester, String label) async {
    await tester.tap(find.widgetWithText(FilledButton, label));
    await tester.pump();
  }

  Future<void> pause(WidgetTester tester) async {
    await tester.tap(find.byTooltip('暂停'));
    await tester.pump();
  }

  String? progress(WidgetTester tester) => tester
      .widget<Semantics>(find.byKey(const ValueKey('training-progress')))
      .properties
      .value;

  Future<void> dispose(WidgetTester tester) async {
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  }
}

/// The timer ticks forever, so step frames instead of pumpAndSettle.
Future<void> settleSheet(WidgetTester tester) async {
  for (var i = 0; i < 10; i++) {
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  testWidgets('rep countdown pause preserves seconds, status and progress', (
    tester,
  ) async {
    final clock = _TimerHarness();
    await clock.open(tester, 'triceps-A');
    await clock.tap(tester, '开始');
    await clock.advance(tester, 1000);
    expect(find.text('2'), findsOneWidget);
    expect(clock.progress(tester), '33%');
    await clock.pause(tester);
    expect(find.text('秒 · 准备 · 已暂停'), findsOneWidget);
    expect(clock.progress(tester), '33%');
    await clock.advance(tester, 10000);
    expect(find.text('2'), findsOneWidget);
    expect(clock.progress(tester), '33%');
    await clock.tap(tester, '继续');
    await clock.advance(tester, 1000);
    expect(find.text('秒 · 准备'), findsOneWidget);
    expect(find.text('1'), findsOneWidget);
    expect(clock.progress(tester), '67%');
    await clock.dispose(tester);
  });

  testWidgets('rep work and rest retain their own units across pauses', (
    tester,
  ) async {
    final clock = _TimerHarness();
    final target = loadCatalogFixture().drillById('triceps-A')!.dose.min;
    await clock.open(tester, 'triceps-A');
    await clock.tap(tester, '开始');
    await clock.advance(tester, 3000);
    await clock.tap(tester, '完成 1 次');
    await clock.pause(tester);
    expect(find.text('/ $target 次 · 已暂停'), findsOneWidget);
    final repProgress = clock.progress(tester);
    await clock.advance(tester, 10000);
    expect(clock.progress(tester), repProgress);
    await clock.tap(tester, '继续');
    for (var rep = 1; rep < target; rep++) {
      await clock.tap(tester, '完成 1 次');
    }
    await clock.advance(tester, 45000);
    expect(find.text('45'), findsOneWidget);
    expect(clock.progress(tester), '50%');
    await clock.pause(tester);
    expect(find.text('秒 · 组间休息 · 已暂停'), findsOneWidget);
    expect(find.text('/ $target 次 · 已暂停'), findsNothing);
    expect(clock.progress(tester), '50%');
    await clock.advance(tester, 10000);
    expect(find.text('45'), findsOneWidget);
    await clock.tap(tester, '继续');
    await clock.advance(tester, 1000);
    expect(find.text('秒 · 组间休息'), findsOneWidget);
    expect(find.text('44'), findsOneWidget);
    await clock.dispose(tester);
  });

  testWidgets('timed rest pause uses rest duration and includes added rest', (
    tester,
  ) async {
    final clock = _TimerHarness();
    await clock.open(tester, 'triceps-B');
    await clock.tap(tester, '开始');
    await clock.advance(tester, 3000);
    await clock.advance(tester, 5000);
    expect(find.text('10'), findsOneWidget);
    expect(clock.progress(tester), '33%');
    await clock.pause(tester);
    expect(find.text('秒 · 练习中 · 已暂停'), findsOneWidget);
    expect(clock.progress(tester), '33%');
    await clock.advance(tester, 10000);
    await clock.tap(tester, '继续');
    await clock.advance(tester, 10000);
    expect(find.text('秒 · 组间休息'), findsOneWidget);
    await clock.advance(tester, 30000);
    expect(find.text('30'), findsOneWidget);
    expect(clock.progress(tester), '50%');
    await tester.tap(find.text('+15 秒休息'));
    await tester.pump();
    expect(find.text('45'), findsOneWidget);
    expect(clock.progress(tester), '40%');
    await clock.pause(tester);
    expect(find.text('秒 · 组间休息 · 已暂停'), findsOneWidget);
    expect(clock.progress(tester), '40%');
    await clock.advance(tester, 10000);
    expect(find.text('45'), findsOneWidget);
    await clock.tap(tester, '继续');
    await clock.advance(tester, 15000);
    expect(find.text('30'), findsOneWidget);
    expect(clock.progress(tester), '60%');
    await clock.dispose(tester);
  });

  testWidgets('closing mid-session asks first and the clock waits', (
    tester,
  ) async {
    final clock = _TimerHarness();
    await clock.open(tester, 'triceps-A');
    await clock.tap(tester, '开始');
    await clock.advance(tester, 3000);
    await clock.tap(tester, '完成 1 次');
    await tester.tap(find.byTooltip('结束本次练习'));
    await settleSheet(tester);
    expect(find.text('结束这次练习？'), findsOneWidget);
    // The work block is paused while the question is open.
    await clock.advance(tester, 8000);
    expect(find.textContaining('已暂停'), findsOneWidget);
    await tester.tap(find.text('继续练'));
    await settleSheet(tester);
    expect(find.text('结束这次练习？'), findsNothing);
    expect(find.textContaining('已暂停'), findsNothing);
    expect(find.byTooltip('暂停'), findsOneWidget);

    await tester.tap(find.byTooltip('结束本次练习'));
    await settleSheet(tester);
    await tester.tap(find.text('结束并保存'));
    await settleSheet(tester);
    expect(find.text('已保存在本机'), findsOneWidget);
    await clock.dispose(tester);
  });

  testWidgets('closing before starting leaves without asking', (tester) async {
    final clock = _TimerHarness();
    await clock.open(tester, 'triceps-A');
    await tester.tap(find.byTooltip('结束本次练习'));
    await settleSheet(tester);
    expect(find.text('结束这次练习？'), findsNothing);
    await clock.dispose(tester);
  });
}
