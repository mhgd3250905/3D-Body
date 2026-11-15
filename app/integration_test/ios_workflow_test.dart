// Run on a simulator created for Flare. This exercises the real bootstrap,
// SDK trainer entry and SharedPreferences plugin; it temporarily replaces only this app's
// learning key and restores its previous value after the test.
import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/main.dart' as app;
import 'package:flare/platform/scene/scene_view_native.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/trainer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;
import 'package:webview_flutter/webview_flutter.dart';

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

  testWidgets('first launch, appearance, shared library and native player', (
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
    final start = find.widgetWithText(FilledButton, '开始').hitTestable();
    await _until(
      tester,
      () => start.evaluate().isNotEmpty,
      'first-launch splash to reveal the Start button',
      timeout: const Duration(seconds: 60),
    );
    await tester.tap(start);
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

    final systemReduceMotion =
        binding.platformDispatcher.accessibilityFeatures.reduceMotion;
    final appDisableAnimations = MediaQuery.disableAnimationsOf(
      tester.element(find.byType(FlareShell)),
    );
    final webView = tester.widget<WebViewWidget>(find.byType(WebViewWidget));
    final rawDiagnostics = await webView.platform.params.controller
        .runJavaScriptReturningResult('''JSON.stringify({
          reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
          origin: location.origin,
          resourceCount: performance.getEntriesByType('resource').length,
          externalOrigins: Array.from(new Set(
            performance.getEntriesByType('resource')
              .map(entry => new URL(entry.name, location.href))
              .filter(url => ['http:', 'https:'].includes(url.protocol) &&
                url.origin !== location.origin)
              .map(url => url.origin)
          ))
        })''');
    dynamic decoded = jsonDecode(rawDiagnostics.toString());
    if (decoded is String) decoded = jsonDecode(decoded);
    final diagnostics = (decoded as Map).cast<String, dynamic>();
    expect(Uri.parse(diagnostics['origin'] as String).host, '127.0.0.1');
    expect(diagnostics['resourceCount'], greaterThan(0));
    expect(diagnostics['externalOrigins'], isEmpty);
    if (const bool.fromEnvironment('FLARE_EXPECT_REDUCED_MOTION')) {
      expect(
        systemReduceMotion,
        true,
        reason: 'enable iOS Reduce Motion first',
      );
      expect(appDisableAnimations, true);
      expect(diagnostics['reduceMotion'], true);
    }

    await tester.pumpAndSettle();
    const menuKey = ValueKey('home-menu-chip');
    await tester.tap(find.byKey(menuKey));
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
    final settingsBar = find.widgetWithText(FlareNavBar, '设置').last;
    await tester.tap(
      find.descendant(
        of: settingsBar,
        matching: find.byIcon(FlareNavBar.backIcon),
      ),
    );
    await tester.pumpAndSettle();
    expect(['light', 'dark'], contains(screenshotTheme));
    expect(await store.updateSettings(themeMode: screenshotTheme), true);
    await tester.pumpAndSettle();
    scene.setTime(2.375);
    await tester.pump(const Duration(milliseconds: 500));
    await screenshot(tester, '01-home-$screenshotTheme');
    await tester.tap(find.byKey(menuKey));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FlareListRow, '训练'));
    await tester.pumpAndSettle();
    expect(find.byType(FlareSharedLibraryPage), findsOneWidget);
    await screenshot(tester, '04-library-$screenshotTheme');
    final drill = find.byType(DrillCard).first;
    await tester.ensureVisible(drill);
    await tester.tap(drill);
    await _until(
      tester,
      () => find.byType(sdk.TrainingLibraryDetail).evaluate().isNotEmpty,
      'shared action detail',
    );
    await tester.pumpAndSettle();
    await screenshot(tester, '05-drill-$screenshotTheme');
    Navigator.of(tester.element(find.byType(sdk.TrainingLibraryDetail))).pop();
    await tester.pumpAndSettle();
    final library = find.byType(FlareSharedLibraryPage);
    tester.widget<FlareSharedLibraryPage>(library).onBack!();
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(menuKey));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FlareListRow, '计划'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('居家').hitTestable().last);
    await tester.pumpAndSettle();
    final preset = find.byKey(const ValueKey('preset-core'));
    await tester.ensureVisible(preset);
    await tester.tap(preset);
    await tester.pumpAndSettle();
    final startTraining = find.byKey(const ValueKey('plan-start'));
    await tester.ensureVisible(startTraining);
    await tester.tap(startTraining);
    await _until(
      tester,
      () => find.byKey(const ValueKey('player-v1-dock')).evaluate().isNotEmpty,
      'Player V1 controls',
      timeout: const Duration(seconds: 60),
    );
    expect(find.byType(FlareTrainingPage), findsOneWidget);
    await screenshot(tester, '06-trainer-$screenshotTheme');
    await tester.tap(find.byKey(const ValueKey('pause')));
    final feedback = find.byType(sdk.TrainerRestFeedbackPanel);
    await _until(
      tester,
      () => feedback.evaluate().isNotEmpty,
      'rest feedback after the first set',
      timeout: const Duration(seconds: 90),
    );
    final comfortable = find
        .byKey(const ValueKey('player-v1-rest-comfortable'))
        .hitTestable();
    await _until(
      tester,
      () => comfortable.evaluate().isNotEmpty,
      'rest feedback controls to become visible',
    );
    await tester.tap(comfortable);
    await tester.pump();
    expect(
      tester.widget<sdk.TrainerRestFeedbackPanel>(feedback).selected,
      sdk.TrainerRestFeedbackChoice.comfortable,
    );
    await screenshot(tester, '07-rest-feedback-$screenshotTheme');
    Navigator.of(tester.element(find.byType(FlareTrainingPage))).pop();
    await tester.pumpAndSettle();

    await preferences.reload();
    final restored = LearningStore(catalog: shell.catalog);
    addTearDown(restored.dispose);
    await restored.initialize();
    expect(restored.storageError, isNull);
    expect(restored.safetyAccepted, true);
    expect(restored.settings.themeMode, screenshotTheme);
    expect(tester.takeException(), isNull);
    final report = {
      'firstLaunchSafetyOk': true,
      'darkAndLightThemesOk': true,
      'nativePreferencesRoundTripOk': true,
      'systemReduceMotion': systemReduceMotion,
      'appDisableAnimations': appDisableAnimations,
      'webReduceMotion': diagnostics['reduceMotion'],
      'sceneResourceCount': diagnostics['resourceCount'],
      'externalSceneResourceOrigins': diagnostics['externalOrigins'],
      'sceneOriginIsLoopback': true,
    };
    final screenshots = binding.reportData?['screenshots'];
    binding.reportData = {...report, 'screenshots': ?screenshots};
    debugPrint('FLARE_IOS_WORKFLOW_REPORT ${jsonEncode(report)}');
  });
}
