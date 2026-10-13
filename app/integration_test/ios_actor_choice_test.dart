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
  testWidgets('native actor switch loads the selected asset and retains detail', (
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
    await _until(tester, () => scene.presented, 'original actor rendered');
    scene.setTime(2.375);
    await tester.pumpAndSettle();
    await tester.tap(find.text('点选肌群'));
    await tester.pumpAndSettle();
    final group = catalog.groups.firstWhere(
      (group) => find.text(group.label).evaluate().isNotEmpty,
    );
    await tester.tap(find.text(group.label).last);
    await _until(
      tester,
      () => scene.lastState?['detail'] == true,
      'paused detail acknowledgement',
    );
    await tester.pumpAndSettle();
    for (final body in ['training', 'original']) {
      final readyRevision = scene.readyRevision;
      final stateRevision = scene.stateRevision;
      await store.updateSettings(actorBody: body);
      await _until(
        tester,
        () =>
            scene.readyRevision > readyRevision &&
            scene.presented &&
            scene.confirmsPausedFrame(
              after: stateRevision,
              detail: group.id,
              time: 2.375,
            ),
        '$body actor renders and restores the paused detail',
      );
      expect(scene.errorCode, isNull);
      final web = tester.widget<WebViewWidget>(find.byType(WebViewWidget));
      final raw = await web.platform.params.controller
          .runJavaScriptReturningResult('''JSON.stringify({
            body:new URLSearchParams(location.search).get('body'),
            resources:performance.getEntriesByType('resource').map(x=>x.name)
          })''');
      var decoded = jsonDecode(raw.toString());
      if (decoded is String) decoded = jsonDecode(decoded);
      final diagnostics = Map<String, dynamic>.from(decoded as Map);
      final resources = (diagnostics['resources'] as List).cast<String>();
      final model = body == 'training'
          ? 'flare-coach-v41-training-human-collarfix-20261013.glb.gz'
          : 'flare-coach-v41-animated.meshopt.glb.gz';
      expect(resources.any((url) => url.endsWith(model)), isTrue);
      final restored = LearningStore(catalog: catalog, storage: storage);
      await restored.initialize();
      expect(restored.settings.actorBody, body);
      restored.dispose();
      debugPrint(
        'FLARE_IOS_ACTOR_REPORT ${jsonEncode({'body': body, 'modelLoaded': model, 'pausedTime': scene.time, 'detail': group.id, 'preferenceRestored': true})}',
      );
    }
    await tester.pumpWidget(const SizedBox());
  });
}
