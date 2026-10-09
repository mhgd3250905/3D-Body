// Device / simulator smoke test for the native 3D stage (iOS first, Android
// works the same way). Not part of `flutter test`: run it on a Mac with
//
//   flutter test integration_test/ios_smoke_test.dart -d <device-or-simulator>
//
// It boots the real WKWebView + 127.0.0.1 asset server, waits for the scene,
// opens and closes a muscle detail, and fails on any scene error.
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

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
}) async {
  final end = DateTime.now().add(timeout);
  while (!done()) {
    if (DateTime.now().isAfter(end)) fail('Timed out waiting for $what');
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('3D stage boots, opens and closes a detail without errors', (
    tester,
  ) async {
    final catalog = await Catalog.load();
    final store = LearningStore(catalog: catalog, storage: _MemoryStorage());
    await store.initialize();
    await store.acknowledgeSafety();
    final scene = SceneController();
    addTearDown(scene.dispose);

    final boot = Stopwatch()..start();
    await tester.pumpWidget(
      MaterialApp(
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
      () => scene.ready || scene.errorCode != null,
      timeout: const Duration(seconds: 45),
      what: 'scene ready',
    );
    expect(scene.errorCode, isNull, reason: 'scene failed to start');
    boot.stop();
    binding.reportData = {'sceneReadyMs': boot.elapsedMilliseconds};

    // Let the loop play, pause, and open a muscle detail the way a user
    // does: the "pick a muscle" button, then a group from the sheet.
    await tester.pump(const Duration(seconds: 2));
    scene.pause();
    await tester.pumpAndSettle(const Duration(milliseconds: 100));
    await tester.tap(find.text('点选肌群查看详解'));
    await tester.pumpAndSettle(const Duration(milliseconds: 100));
    final group = catalog.groups.firstWhere(
      (g) => find.text(g.label).evaluate().isNotEmpty,
    );
    await tester.tap(find.text(group.label).last);
    await _until(
      tester,
      () => scene.detail == group.id,
      timeout: const Duration(seconds: 5),
      what: 'detail ${group.id}',
    );
    await tester.pump(const Duration(milliseconds: 1200));
    expect(scene.errorCode, isNull, reason: 'error after opening detail');

    await tester.tap(find.byIcon(Icons.arrow_back_ios_new_rounded));
    await _until(
      tester,
      () => scene.detail == null,
      timeout: const Duration(seconds: 5),
      what: 'back to the loop',
    );
    await tester.pump(const Duration(milliseconds: 1200));
    expect(scene.errorCode, isNull, reason: 'error after closing detail');

    final report = Map<String, Object?>.from(binding.reportData ?? {});
    report['openCloseOk'] = true;
    binding.reportData = report;
  });
}
