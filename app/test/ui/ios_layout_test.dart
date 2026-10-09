import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/timer_page.dart';
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
  final catalog = loadCatalogFixture();
  for (final (name, size, top, bottom, side) in [
    ('SE3', const Size(375, 667), 20.0, 0.0, 0.0),
    ('iPhone13', const Size(390, 844), 47.0, 34.0, 0.0),
    ('ProMax', const Size(440, 956), 62.0, 34.0, 0.0),
    ('SE3 landscape', const Size(667, 375), 0.0, 0.0, 0.0),
    ('iPhone13 landscape', const Size(844, 390), 0.0, 21.0, 47.0),
  ]) {
    for (final brightness in Brightness.values) {
      for (final scale in [1.0, 2.0]) {
        testWidgets('$name ${brightness.name} text $scale core pages fit', (
          tester,
        ) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1;
          tester.view.padding = FakeViewPadding(
            top: top,
            bottom: bottom,
            left: side,
            right: side,
          );
          tester.view.viewPadding = FakeViewPadding(
            top: top,
            bottom: bottom,
            left: side,
            right: side,
          );
          addTearDown(tester.view.resetPhysicalSize);
          addTearDown(tester.view.resetDevicePixelRatio);
          addTearDown(tester.view.resetPadding);
          addTearDown(tester.view.resetViewPadding);
          final store = LearningStore(
            catalog: catalog,
            storage: _MemoryStorage(),
          );
          await store.initialize();
          await store.acknowledgeSafety();
          final scene = SceneController();
          addTearDown(store.dispose);
          addTearDown(scene.dispose);
          await tester.pumpWidget(
            MaterialApp(
              theme: flareTheme(
                brightness,
              ).copyWith(platform: TargetPlatform.iOS),
              locale: const Locale('zh'),
              localizationsDelegates: AppLocalizations.localizationsDelegates,
              supportedLocales: AppLocalizations.supportedLocales,
              builder: (context, child) {
                FlareColors.use(brightness);
                return MediaQuery(
                  data: MediaQuery.of(
                    context,
                  ).copyWith(textScaler: TextScaler.linear(scale)),
                  child: child!,
                );
              },
              home: FlareShell(
                catalog: catalog,
                store: store,
                sceneController: scene,
                enableScene: false,
              ),
            ),
          );
          scene.receiveEvent({
            'source': 'flare-scene',
            'type': 'ready',
            'time': 0,
          });
          scene.receiveEvent({
            'source': 'flare-scene',
            'type': 'state',
            'time': 2.375,
            'playing': false,
            'phase': 11,
          });
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull, reason: 'home');
          scene.receiveEvent({
            'source': 'flare-scene',
            'type': 'select',
            'time': 2.375,
            'groupId': 'obliques',
          });
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull, reason: 'muscle detail');
          final train = find.byKey(const ValueKey('train-group'));
          expect(train, findsOneWidget);
          expect(
            tester.getRect(train).bottom,
            lessThanOrEqualTo(size.height - bottom),
          );
          await tester.tap(train);
          await tester.pumpAndSettle();
          expect(
            tester.takeException(),
            isNull,
            reason: 'training scene choices',
          );
          await tester.tap(find.byKey(const ValueKey('scene-A')));
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull, reason: 'drill detail');
          final start = find.text('开始训练');
          await tester.ensureVisible(start);
          await tester.tap(start);
          await tester.pumpAndSettle();
          expect(find.byType(TrainingTimerPage), findsOneWidget);
          expect(tester.takeException(), isNull, reason: 'timer ready');
          await tester.pumpWidget(const SizedBox());
        });
      }
    }
  }
}
