import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:webview_flutter/webview_flutter.dart';

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
  bool Function() done,
  String what,
) async {
  final end = DateTime.now().add(const Duration(seconds: 45));
  while (!done()) {
    if (DateTime.now().isAfter(end)) fail('Timed out waiting for $what');
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('native scene keeps V5 with an older saved actor preference', (
    tester,
  ) async {
    final catalog = await Catalog.load();
    final storage = _MemoryStorage();
    final store = LearningStore(catalog: catalog, storage: storage);
    final scene = ObservedSceneController();
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    await store.initialize();
    await store.acknowledgeSafety();
    await store.updateSettings(actorBody: 'training');
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
    await _until(tester, () => scene.presented, 'V5 actor rendered');
    final revision = scene.stateRevision;
    const pausedTime = 2.375;
    scene.setTime(pausedTime);
    await _until(
      tester,
      () => scene.confirmsPausedFrame(after: revision, time: pausedTime),
      'V5 scene acknowledged the paused frame',
    );
    final web = tester.widget<WebViewWidget>(find.byType(WebViewWidget));
    final raw = await web.platform.params.controller
        .runJavaScriptReturningResult('''JSON.stringify({
          actor:new URLSearchParams(location.search).get('actor'),
          body:new URLSearchParams(location.search).get('body'),
          resources:performance.getEntriesByType('resource').map(x=>x.name)
        })''');
    var decoded = jsonDecode(raw.toString());
    if (decoded is String) decoded = jsonDecode(decoded);
    final diagnostics = Map<String, dynamic>.from(decoded as Map);
    final resources = (diagnostics['resources'] as List).cast<String>();
    expect(diagnostics['actor'], 'flare-v5');
    expect(diagnostics['body'], isNull);
    expect(
      resources.any((url) => url.endsWith('coach-v3r3-wristfix.glb')),
      isTrue,
    );
    expect(scene.errorCode, isNull);
    final restored = LearningStore(catalog: catalog, storage: storage);
    addTearDown(restored.dispose);
    await restored.initialize();
    expect(restored.settings.actorBody, 'training');
    await tester.pumpWidget(const SizedBox());
  });
}
