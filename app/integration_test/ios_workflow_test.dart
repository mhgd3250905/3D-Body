// Run on a simulator created for Flare. This exercises the real bootstrap,
// timer and SharedPreferences plugin; it temporarily replaces only this app's
// learning key and restores its previous value after the test.
import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/main.dart' as app;
import 'package:flare/platform/scene/scene_view_native.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/timer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> _until(
  WidgetTester tester,
  bool Function() done,
  String what, {
  Duration timeout = const Duration(seconds: 15),
}) async {
  final end = DateTime.now().add(timeout);
  while (!done()) {
    if (DateTime.now().isAfter(end)) fail('Timed out waiting for $what');
    await tester.pump(const Duration(milliseconds: 100));
  }
}

List<String> _timerCounts() => find
    .descendant(
      of: find.byType(TrainingTimerPage),
      matching: find.byWidgetPredicate(
        (widget) =>
            widget is Text && RegExp(r'^\d+$').hasMatch(widget.data ?? ''),
      ),
    )
    .evaluate()
    .map((element) => (element.widget as Text).data!)
    .toList();

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  const screenshotTheme = String.fromEnvironment(
    'FLARE_SCREENSHOT_THEME',
    defaultValue: 'light',
  );
  Future<void> screenshot(WidgetTester tester, String name) async {
    if (!const bool.fromEnvironment('FLARE_CAPTURE_SCREENSHOTS')) return;
    await tester.pump(const Duration(milliseconds: 900));
    await binding.takeScreenshot(name);
  }

  testWidgets('first launch, appearance, timer and native local records', (
    tester,
  ) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.reload();
    final previous = preferences.getString(LearningStore.storageKey);
    addTearDown(() async {
      await tester.pumpWidget(const SizedBox());
      if (previous == null) {
        await preferences.remove(LearningStore.storageKey);
      } else {
        await preferences.setString(LearningStore.storageKey, previous);
      }
    });
    expect(await preferences.remove(LearningStore.storageKey), true);
    app.main();
    await _until(
      tester,
      () => find.byType(WelcomePage).evaluate().isNotEmpty,
      'first-launch page',
    );
    await tester.tap(find.text('开始'));
    await tester.pumpAndSettle();
    expect(find.text('三件事'), findsOneWidget);
    await tester.tap(find.text('我知道了'));
    await _until(
      tester,
      () => find.byType(ScenePlatformView).evaluate().isNotEmpty,
      'native stage',
    );
    final shell = tester.widget<FlareShell>(find.byType(FlareShell));
    final store = shell.store;
    expect(store.safetyAccepted, true);
    final scene = tester
        .widget<ScenePlatformView>(find.byType(ScenePlatformView))
        .controller;
    await _until(
      tester,
      () => scene.ready || scene.errorCode != null,
      'native scene ready',
      timeout: const Duration(seconds: 45),
    );
    expect(scene.errorCode, isNull);

    await tester.pumpAndSettle();
    await tester.tap(find.byIcon(Icons.more_horiz_rounded));
    await tester.pumpAndSettle();
    await tester.tap(find.text('设置'));
    await tester.pumpAndSettle();
    for (final (label, mode, brightness) in [
      ('深色', 'dark', Brightness.dark),
      ('浅色', 'light', Brightness.light),
    ]) {
      await tester.tap(find.text(label));
      await tester.pumpAndSettle();
      expect(store.settings.themeMode, mode);
      expect(
        Theme.of(tester.element(find.byType(FlareShell))).brightness,
        brightness,
      );
    }
    await tester.tap(find.byIcon(Icons.arrow_back_ios_new_rounded));
    await tester.pumpAndSettle();
    expect(['light', 'dark'], contains(screenshotTheme));
    expect(await store.updateSettings(themeMode: screenshotTheme), true);
    await tester.pumpAndSettle();
    scene.setTime(2.375);
    await tester.pump(const Duration(milliseconds: 500));
    await screenshot(tester, '01-home-$screenshotTheme');
    await tester.tap(find.text('点选肌群查看详解'));
    await tester.pumpAndSettle();
    final group = shell.catalog.groups.firstWhere(
      (group) => find.text(group.label).evaluate().isNotEmpty,
    );
    await tester.tap(find.text(group.label).last);
    await tester.pumpAndSettle();
    await screenshot(tester, '02-motion-detail-$screenshotTheme');
    await tester.tap(find.byKey(const ValueKey('detail-card')));
    await tester.pumpAndSettle();
    await screenshot(tester, '03-muscle-detail-$screenshotTheme');
    await tester.tap(find.byKey(const ValueKey('train-group')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('scene-A')));
    await tester.pumpAndSettle();
    await screenshot(tester, '04-drill-$screenshotTheme');
    final addToday = find.byTooltip('加入今日训练');
    await tester.ensureVisible(addToday);
    await tester.tap(addToday);
    final startTraining = find.text('开始训练');
    await tester.ensureVisible(startTraining);
    await tester.tap(startTraining);
    await tester.pumpAndSettle();
    final drill = tester
        .widget<TrainingTimerPage>(find.byType(TrainingTimerPage))
        .drill;
    expect(store.todayIds, contains(drill.id));
    await screenshot(tester, '05-timer-$screenshotTheme');
    await tester.tap(find.text('开始'));
    await _until(
      tester,
      () => find.textContaining('练习中').evaluate().isNotEmpty,
      'real countdown reaches work',
    );
    await tester.pump(const Duration(seconds: 2));
    await tester.tap(find.byTooltip('暂停'));
    await tester.pumpAndSettle();
    expect(find.textContaining('已暂停'), findsWidgets);
    final pausedCounts = _timerCounts();
    expect(pausedCounts, isNotEmpty);
    await tester.pump(const Duration(seconds: 2));
    expect(_timerCounts(), pausedCounts);
    await tester.tap(find.text('继续'));
    await tester.pump(const Duration(milliseconds: 600));
    await tester.tap(find.byIcon(Icons.close_rounded));
    await tester.pumpAndSettle();
    expect(find.text('结束这次练习？'), findsOneWidget);
    await tester.tap(find.text('结束并保存'));
    await _until(
      tester,
      () => find.byType(TrainingTimerPage).evaluate().isEmpty,
      'timer closes after native save',
    );
    expect(store.sessions, hasLength(1));
    final session = store.sessions.single;
    expect(session.completed, false);
    expect(session.pain, false);
    expect(session.activeSeconds, greaterThanOrEqualTo(1));
    expect(store.completedTodayIds, isEmpty);
    expect(store.completedLessonIds, isEmpty);

    await preferences.reload();
    final restored = LearningStore(catalog: shell.catalog);
    addTearDown(restored.dispose);
    await restored.initialize();
    expect(restored.storageError, isNull);
    expect(restored.safetyAccepted, true);
    expect(restored.settings.themeMode, screenshotTheme);
    expect(restored.todayIds, contains(drill.id));
    expect(restored.sessions.single.toJson(), session.toJson());
    expect(tester.takeException(), isNull);
    final report = {
      'firstLaunchSafetyOk': true,
      'darkAndLightThemesOk': true,
      'realCountdownAndPauseOk': true,
      'abandonedRecordIsNotCompletion': true,
      'nativePreferencesRoundTripOk': true,
      'activeSeconds': session.activeSeconds,
    };
    final screenshots = binding.reportData?['screenshots'];
    binding.reportData = {...report, 'screenshots': ?screenshots};
    debugPrint('FLARE_IOS_WORKFLOW_REPORT ${jsonEncode(report)}');
  });
}
