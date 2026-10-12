import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _MemoryStorage implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

void main() {
  testWidgets('welcome prewarms, recovers and reuses the same scene on entry', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final catalog = loadCatalogFixture();
    final store = LearningStore(catalog: catalog, storage: _MemoryStorage());
    await store.initialize();
    final commands = <Map<String, Object?>>[];
    final scene = SceneController(commandSink: commands.add);
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(Brightness.light),
        locale: const Locale('zh'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: FlareShell(
          catalog: catalog,
          store: store,
          sceneController: scene,
          startupCovered: true,
        ),
      ),
    );
    await tester.pump();
    final view = find.byType(SceneView, skipOffstage: false);
    final originalElement = tester.element(view);
    expect(find.byType(WelcomePage), findsOneWidget);
    expect(find.byType(SceneView), findsOneWidget);
    expect(store.safetyAccepted, isFalse);

    // The desktop test host has no native WebView. Supply its real bridge
    // messages while checking the shell's visibility/presentation contract.
    Future<void> present() async {
      scene.receiveEvent({'source': 'flare-scene', 'type': 'ready'});
      await tester.pump();
      final request = commands.lastWhere((c) => c['type'] == 'present');
      final visibility = commands.lastWhere((c) => c['type'] == 'visibility');
      expect(visibility['visible'], isTrue);
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'presented',
        'requestId': request['requestId'],
        'playing': false,
      });
      await tester.pump();
      expect(scene.presented, isTrue);
      expect(scene.playing, isFalse);
      expect(
        commands.lastWhere((c) => c['type'] == 'visibility')['visible'],
        isFalse,
      );
    }

    await present();
    expect(find.byType(SceneView), findsNothing);
    expect(tester.element(view), same(originalElement));
    expect(store.safetyAccepted, isFalse);
    scene.reportError('graphics_context_lost');
    await tester.pump();
    expect(find.byType(SceneView), findsOneWidget);
    await present();
    expect(store.safetyAccepted, isFalse);

    final requestCount = commands.where((c) => c['type'] == 'present').length;
    await tester.widget<WelcomePage>(find.byType(WelcomePage)).onEnter(false);
    await tester.pumpAndSettle();
    expect(find.byType(WelcomePage), findsNothing);
    expect(find.byType(SceneView), findsOneWidget);
    expect(tester.element(view), same(originalElement));
    expect(scene.playing, isTrue);
    expect(store.safetyAccepted, isTrue);
    expect(commands.where((c) => c['type'] == 'present').length, requestCount);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });
}
