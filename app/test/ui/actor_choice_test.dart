import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/actor_body_selector.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage;

void main() {
  for (final (locale, width, scale) in [
    (const Locale('zh'), 390.0, 1.0),
    (const Locale('en'), 320.0, 1.0),
    (const Locale('ar'), 390.0, 1.0),
  ]) {
    testWidgets('actor choices fit $locale/$width/$scale and preserve frame', (
      tester,
    ) async {
      tester.view.physicalSize = Size(width, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final semantics = tester.ensureSemantics();
      final store = LearningStore(
        catalog: loadCatalogFixture(),
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
      await store.setLastTime(2.375);
      final scene = SceneController();
      addTearDown(scene.dispose);
      addTearDown(store.dispose);
      await tester.pumpWidget(
        MaterialApp(
          theme: flareTheme(),
          locale: locale,
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          builder: (context, child) => MediaQuery(
            data: MediaQuery.of(
              context,
            ).copyWith(textScaler: TextScaler.linear(scale)),
            child: child!,
          ),
          home: FlareShell(
            catalog: store.catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
          ),
        ),
      );
      scene.receiveEvent({'source': 'flare-scene', 'type': 'ready'});
      await tester.pumpAndSettle();
      scene.setTime(2.375);
      scene.pause();
      final strings = AppLocalizations.of(
        tester.element(find.byType(FlareShell)),
      );
      await tester.tap(find.bySemanticsLabel(strings.more));
      await tester.pumpAndSettle();
      final settings = find.widgetWithText(ListTile, strings.settings);
      await tester.ensureVisible(settings);
      await tester.tap(settings);
      await tester.pumpAndSettle();
      for (final value in LearningSettings.actorBodies) {
        final changed = store.settings.actorBody != value;
        final choice = find.byKey(ValueKey('actor-body-$value'));
        expect(choice, findsOneWidget);
        await tester.ensureVisible(choice);
        await tester.tap(choice);
        await tester.pumpAndSettle();
        if (changed) {
          scene.receiveEvent({
            'source': 'flare-scene',
            'type': 'ready',
            'time': 0,
          });
        }
        await tester.pumpAndSettle();
        expect(store.settings.actorBody, value);
        expect(tester.widget<ChoiceChip>(choice).selected, isTrue);
        expect(scene.time, closeTo(2.375, .001));
        expect(scene.playing, isFalse);
        expect(tester.takeException(), isNull);
      }
      await tester.pumpWidget(const SizedBox.shrink());
      semantics.dispose();
    });
  }

  testWidgets('long translated choices wrap with doubled text at 320px', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    String value = 'original';
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(),
        locale: const Locale('de'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: MediaQuery(
            data: const MediaQueryData(textScaler: TextScaler.linear(2)),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: StatefulBuilder(
                builder: (context, setState) => ActorBodySelector(
                  value: value,
                  onChanged: (next) => setState(() {
                    value = next;
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    for (final id in LearningSettings.actorBodies) {
      final choice = find.byKey(ValueKey('actor-body-$id'));
      await tester.tap(choice);
      await tester.pumpAndSettle();
      expect(value, id);
      expect(tester.takeException(), isNull);
      expect(tester.getRect(choice).right, lessThanOrEqualTo(300));
    }
  });
}
