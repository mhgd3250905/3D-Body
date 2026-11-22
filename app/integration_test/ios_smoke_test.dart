// Device / simulator smoke test for the native 3D stage (iOS first, Android
// works the same way). Not part of `flutter test`: run it on a Mac with
//
//   flutter test integration_test/ios_smoke_test.dart -d <device-or-simulator>
//
// It boots the real WKWebView + 127.0.0.1 asset server, waits for the scene,
// checks native state acknowledgements, same-frame muscle-plan navigation
// and retry after errors. FLARE_VERIFY_OS_RECOVERY=true waits for the host to
// interrupt this simulator's WebContent process at the two printed markers.
import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'support/observed_scene_controller.dart';

class _MemoryStorage implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

Future<void> _until(
  WidgetTester tester,
  bool Function() done, {
  required Duration timeout,
  required String what,
  String Function()? diagnostics,
}) async {
  final end = DateTime.now().add(timeout);
  while (!done()) {
    if (DateTime.now().isAfter(end)) {
      fail('Timed out waiting for $what. ${diagnostics?.call() ?? ''}');
    }
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  const verifyProcessKill = bool.fromEnvironment('FLARE_VERIFY_OS_RECOVERY');

  testWidgets(
    '3D stage retains the paused frame while a muscle plan covers it',
    (tester) async {
      final catalog = await Catalog.load();
      final store = LearningStore(catalog: catalog, storage: _MemoryStorage());
      addTearDown(store.dispose);
      await store.initialize();
      await store.acknowledgeSafety();
      final scene = ObservedSceneController();
      addTearDown(scene.dispose);

      final boot = Stopwatch()..start();
      await tester.pumpWidget(
        MaterialApp(
          debugShowCheckedModeBanner: false,
          theme: flareTheme(),
          locale: const Locale('zh'),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
          ),
        ),
      );
      await _until(
        tester,
        () => scene.lastState?['ready'] == true || scene.errorCode != null,
        timeout: const Duration(seconds: 45),
        what: 'scene ready',
      );
      expect(scene.errorCode, isNull, reason: 'scene failed to start');
      boot.stop();
      binding.reportData = {'sceneReadyMs': boot.elapsedMilliseconds};

      // Require actual clock movement in WKWebView, then seek a known paused
      // frame. Flutter's local controller values alone cannot pass these checks.
      final playingRevision = scene.stateRevision;
      final initialTime = scene.time;
      await _until(
        tester,
        () =>
            scene.stateRevision > playingRevision &&
            scene.lastState?['playing'] == true &&
            (scene.time - initialTime).abs() > .1,
        timeout: const Duration(seconds: 10),
        what: 'clock advancing in the real scene',
      );
      const pausedTime = 2.375;
      var revision = scene.stateRevision;
      scene.setTime(pausedTime);
      await _until(
        tester,
        () => scene.confirmsPausedFrame(after: revision, time: pausedTime),
        timeout: const Duration(seconds: 5),
        what: 'seek acknowledged by the real scene',
      );
      await tester.pumpAndSettle(const Duration(milliseconds: 100));
      // Exercise the accepted native scene event at the host bridge boundary.
      // Verify both ends of the journey using the real WebView's state events.
      final originalReadyRevision = scene.readyRevision;
      const groupId = 'triceps';
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'select',
        'groupId': groupId,
        'time': pausedTime,
      });
      await tester.pumpAndSettle(const Duration(milliseconds: 100));
      final plan = find.byType(FlarePlanDetailPage);
      expect(
        tester.widget<FlarePlanDetailPage>(plan).plans.first.groupId,
        groupId,
      );
      revision = scene.stateRevision;
      await tester.binding.handlePopRoute();
      await _until(
        tester,
        () => scene.confirmsPausedFrame(after: revision, time: pausedTime),
        timeout: const Duration(seconds: 5),
        what: 'home resumes its paused frame after closing the muscle plan',
      );
      await tester.pumpAndSettle(const Duration(milliseconds: 100));
      expect(plan, findsNothing);
      expect(scene.readyRevision, originalReadyRevision);
      expect(scene.errorCode, isNull);

      // Inject the platform error at the native host boundary. The replacement
      // is a real WKWebView, not a mocked scene. Actual OS memory pressure is a
      // separate device check; this verifies reconstruction and restoration.
      var readyRevision = scene.readyRevision;
      revision = scene.stateRevision;
      if (verifyProcessKill) {
        debugPrint('FLARE_RECOVERY_READY_FOR_FIRST_KILL');
      } else {
        scene.reportError(SceneController.processTerminated);
      }
      await _until(
        tester,
        () =>
            scene.readyRevision > readyRevision &&
            scene.confirmsPausedFrame(after: revision, time: pausedTime),
        timeout: const Duration(seconds: 90),
        what: 'replacement WebView restores the paused home frame',
        diagnostics: () =>
            'ready events: ${scene.readyRevision}; '
            'error: ${scene.errorCode}; state: ${scene.lastState}',
      );
      readyRevision = scene.readyRevision;
      if (verifyProcessKill) {
        debugPrint('FLARE_RECOVERY_READY_FOR_SECOND_KILL');
        await _until(
          tester,
          () => scene.errorCode == SceneController.processTerminated,
          timeout: const Duration(seconds: 90),
          what: 'a second real WebContent termination',
        );
      } else {
        scene.reportError(SceneController.processTerminated);
      }
      await tester.pump(const Duration(milliseconds: 1200));
      expect(
        scene.readyRevision,
        readyRevision,
        reason: 'a second termination within a minute must await retry',
      );
      expect(find.byKey(const ValueKey('scene-error')), findsOneWidget);
      revision = scene.stateRevision;
      await tester.tap(find.text('重试'));
      await _until(
        tester,
        () =>
            scene.readyRevision > readyRevision &&
            scene.confirmsPausedFrame(after: revision, time: pausedTime),
        timeout: const Duration(seconds: 45),
        what: 'explicit retry restores the paused home frame',
        diagnostics: () =>
            'ready events: ${scene.readyRevision}; '
            'error: ${scene.errorCode}; state: ${scene.lastState}',
      );
      expect(scene.errorCode, isNull, reason: 'error after retry');

      final report = Map<String, Object?>.from(binding.reportData ?? {});
      report['openCloseOk'] = true;
      report['sameHomeWebViewAfterPlan'] = true;
      report['replacementWebViewRestoresFrame'] = true;
      report['repeatedTerminationWaitsForRetry'] = true;
      report['recoveryTrigger'] = verifyProcessKill
          ? 'simulator-webcontent-process-kill'
          : 'injected-host-error';
      report['pausedFrame'] = pausedTime;
      report['sceneStateAcknowledgements'] = scene.stateRevision;
      binding.reportData = report;
      debugPrint('FLARE_IOS_SMOKE_REPORT ${jsonEncode(report)}');
      await tester.pumpWidget(const SizedBox());
    },
  );
}
