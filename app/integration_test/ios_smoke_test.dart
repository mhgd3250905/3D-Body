// Device / simulator smoke test for the native 3D stage (iOS first, Android
// works the same way). Not part of `flutter test`: run it on a Mac with
//
//   flutter test integration_test/ios_smoke_test.dart -d <device-or-simulator>
//
// It boots the real WKWebView + 127.0.0.1 asset server, waits for the scene,
// checks native state acknowledgements, same-frame detail/model restoration
// and retry after errors. FLARE_VERIFY_OS_RECOVERY=true waits for the host to
// interrupt this simulator's WebContent process at the two printed markers.
import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
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

  testWidgets('3D stage boots, opens and closes a detail without errors', (
    tester,
  ) async {
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
      () => scene.confirmsPausedFrame(
        after: revision,
        detail: null,
        time: pausedTime,
      ),
      timeout: const Duration(seconds: 5),
      what: 'seek acknowledged by the real scene',
    );
    await tester.pumpAndSettle(const Duration(milliseconds: 100));
    await tester.tap(find.text('点选肌群查看详解'));
    await tester.pumpAndSettle(const Duration(milliseconds: 100));
    final group = catalog.groups.firstWhere(
      (g) => find.text(g.label).evaluate().isNotEmpty,
    );
    revision = scene.stateRevision;
    await tester.tap(find.text(group.label).last);
    await _until(
      tester,
      () => scene.confirmsPausedFrame(
        after: revision,
        detail: group.id,
        time: pausedTime,
      ),
      timeout: const Duration(seconds: 5),
      what: 'detail ${group.id}',
    );
    await tester.pump(const Duration(milliseconds: 1200));
    expect(scene.errorCode, isNull, reason: 'error after opening detail');

    // Swap the motion and muscle models without advancing the paused frame.
    revision = scene.stateRevision;
    await tester.tap(find.byKey(const ValueKey('detail-card')));
    await _until(
      tester,
      () => scene.confirmsPausedFrame(
        after: revision,
        detail: group.id,
        time: pausedTime,
        model: 'muscles',
      ),
      timeout: const Duration(seconds: 5),
      what: 'muscle model acknowledged at the same frame',
    );

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
          scene.confirmsPausedFrame(
            after: revision,
            detail: group.id,
            time: pausedTime,
            model: 'muscles',
          ),
      timeout: const Duration(seconds: 90),
      what: 'replacement WebView restores muscle model and paused frame',
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
          scene.confirmsPausedFrame(
            after: revision,
            detail: group.id,
            time: pausedTime,
            model: 'muscles',
          ),
      timeout: const Duration(seconds: 45),
      what: 'explicit retry restores muscle model and paused frame',
      diagnostics: () =>
          'ready events: ${scene.readyRevision}; '
          'error: ${scene.errorCode}; state: ${scene.lastState}',
    );
    revision = scene.stateRevision;
    await tester.tap(find.byIcon(Icons.arrow_back_ios_new_rounded));
    await _until(
      tester,
      () => scene.confirmsPausedFrame(
        after: revision,
        detail: null,
        time: pausedTime,
        retainedSelection: group.id,
      ),
      timeout: const Duration(seconds: 5),
      what: 'back to the loop',
      diagnostics: () => 'error: ${scene.errorCode}; state: ${scene.lastState}',
    );
    await tester.pump(const Duration(milliseconds: 1200));
    expect(scene.errorCode, isNull, reason: 'error after closing detail');

    final report = Map<String, Object?>.from(binding.reportData ?? {});
    report['openCloseOk'] = true;
    report['modelSwapOk'] = true;
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
  });
}
