import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _Storage implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

void main() {
  for (final mode in ['background', 'foreground paused', 'detail muscles']) {
    testWidgets('WebContent recovery preserves $mode and paused frame', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final catalog = loadCatalogFixture();
      final store = LearningStore(catalog: catalog, storage: _Storage());
      await store.initialize();
      await store.acknowledgeSafety();
      await store.setLastTime(2.375);
      final commands = <Map<String, Object?>>[];
      final scene = SceneController(commandSink: commands.add);
      addTearDown(store.dispose);
      addTearDown(scene.dispose);
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
            enableScene: false,
          ),
        ),
      );
      scene.receiveEvent({'source': 'flare-scene', 'type': 'ready'});
      await tester.pumpAndSettle();
      expect(scene.playing, isTrue);
      scene.setTime(2.375);
      if (mode == 'detail muscles') {
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'select',
          'groupId': 'deltoids',
          'time': 2.375,
        });
        await tester.pumpAndSettle();
        scene.setDetailModel('muscles');
      }
      if (mode == 'background') {
        tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
      }
      scene.reportError(SceneController.processTerminated);
      await tester.pump();
      commands.clear();
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'ready',
        'time': 0,
        'playing': false,
        'detail': null,
        'detailModel': 'motion',
      });
      await tester.pumpAndSettle();
      expect(scene.playing, isFalse);
      expect(commands.where((c) => c['type'] == 'play'), isEmpty);
      expect(
        commands.lastWhere((c) => c['type'] == 'visibility')['visible'],
        mode != 'background',
      );
      if (mode == 'detail muscles') {
        expect(scene.detail, 'deltoids');
        expect(scene.detailModel, 'muscles');
      }
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pumpAndSettle();
      expect(scene.playing, isFalse);
      expect(scene.time, closeTo(2.375, .001));
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox.shrink());
    });
  }
}
