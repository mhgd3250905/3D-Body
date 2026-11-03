// Run on a simulator created for Flare. This exercises the real bootstrap,
// SDK trainer entry and SharedPreferences plugin; it temporarily replaces only this app's
// learning key and restores its previous value after the test.
import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/main.dart' as app;
import 'package:flare/platform/scene/scene_view_native.dart';
import 'package:flare/platform/training_display.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/trainer_page.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
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

  testWidgets('SDK library, plan, timer and native local records', (
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
      () =>
          find.byType(WelcomePage).evaluate().isNotEmpty &&
          find
              .byKey(const ValueKey('startup-revealed'))
              .evaluate()
              .isNotEmpty &&
          find.text('开始').hitTestable().evaluate().isNotEmpty,
      'first-launch page with the prewarmed scene revealed',
      timeout: const Duration(seconds: 45),
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
    await tester.tap(find.text('点选肌群'));
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
    expect(find.byType(sdk.TrainingLibraryPage), findsOneWidget);
    expect(FlareShared.current!.allowedActionIds, hasLength(211));
    await screenshot(tester, '04-shared-library-$screenshotTheme');

    // Seed a short plan through the real native store, then launch it through
    // the production plan route. No API token or live AI request is required.
    final plan = uc.TrainingPlan(
      id: 'ios-native-sdk',
      source: 'template',
      title: 'iOS SDK 验证',
      goal: 'strength',
      scene: 'home',
      level: 1,
      targetMinutes: 1,
      blocks: const [
        uc.PlanBlock(
          id: 'native',
          name: 'Main',
          type: uc.BlockType.main,
          items: [
            uc.PlanItem(
              exerciseId: 'abs-A',
              mode: uc.DoseMode.time,
              sets: 1,
              workSeconds: 30,
              perSide: false,
              restSeconds: 0,
            ),
          ],
        ),
      ],
    );
    final routine = await store.createRoutine(plan.title, const [
      'abs-A',
    ], sdkPlan: plan);
    expect(routine, isNotNull);
    await tester.tap(find.text('计划').last);
    await tester.pumpAndSettle();
    final savedPlan = find.byKey(ValueKey('routine-${routine!.id}'));
    await tester.ensureVisible(savedPlan);
    await tester.tap(savedPlan);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('plan-start')));
    await _until(
      tester,
      () => find.byType(sdk.TrainerPlayer).evaluate().isNotEmpty,
      'shared SDK player',
      timeout: const Duration(seconds: 45),
    );
    expect(find.byType(FlareTrainingPage), findsOneWidget);
    await _until(
      tester,
      () => find
          .byKey(const ValueKey('pause'))
          .hitTestable()
          .evaluate()
          .isNotEmpty,
      'SDK training starts',
      timeout: const Duration(seconds: 45),
    );
    await tester.pump(const Duration(seconds: 12));
    expect(
      await TrainingDisplay.channel.invokeMethod<bool>('isKeepAwake'),
      true,
    );
    await tester.tap(find.byKey(const ValueKey('pause')));
    await tester.pump(const Duration(milliseconds: 300));
    String counter() => find
        .descendant(
          of: find.byKey(const ValueKey('counter')),
          matching: find.byType(Text),
        )
        .evaluate()
        .map((element) => (element.widget as Text).data)
        .join('|');
    final pausedCount = counter();
    expect(pausedCount, isNotEmpty);
    await tester.pump(const Duration(seconds: 2));
    expect(counter(), pausedCount);
    await screenshot(tester, '05-sdk-paused-$screenshotTheme');
    await tester.tap(find.byKey(const ValueKey('pause')));
    await tester.pump(const Duration(seconds: 1));
    await tester.tap(find.byKey(const ValueKey('close')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('close-confirm')));
    await _until(
      tester,
      () => find.byType(FlareTrainingPage).evaluate().isEmpty,
      'SDK save and close',
      timeout: const Duration(seconds: 30),
    );
    expect(store.trainerSessions, hasLength(1));
    final session = store.trainerSessions.single;
    expect(session.activeSeconds, greaterThan(0));
    expect(store.sessions.every((row) => !row.completed), isTrue);
    expect(
      await TrainingDisplay.channel.invokeMethod<bool>('isKeepAwake'),
      false,
    );

    await preferences.reload();
    final restored = LearningStore(catalog: shell.catalog);
    addTearDown(restored.dispose);
    await restored.initialize();
    expect(restored.storageError, isNull);
    expect(restored.safetyAccepted, true);
    expect(restored.settings.themeMode, screenshotTheme);
    expect(restored.routines.single.toJson(), store.routines.single.toJson());
    expect(restored.trainerSessions.single.toJson(), session.toJson());
    expect(tester.takeException(), isNull);
    final report = {
      'firstLaunchSafetyOk': true,
      'darkAndLightThemesOk': true,
      'nativePreferencesRoundTripOk': true,
      'sharedLibraryScope': 211,
      'nativePlanPersistenceOk': true,
      'sdkCountdownPauseAndPartialSaveOk': true,
      'sdkScreenAwakeReleasedOnExit': true,
      'nativeVideoBackendSupported': sdk.UgkPackedAlphaVideo.isSupported,
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
