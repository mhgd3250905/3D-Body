import 'package:flare/control/learning_store.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart'
    show MemoryStateStorage, testApp, phoneSize, labeledControl;

void main() {
  final catalog = loadCatalogFixture();

  Future<(LearningStore, SceneController)> home(WidgetTester tester) async {
    await phoneSize(tester);
    final store = LearningStore(
      catalog: catalog,
      storage: MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    final scene = SceneController(commandSink: (_) {});
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    await tester.pumpWidget(
      testApp(
        FlareShell(
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
      'period': 9,
      'time': 2.0,
      'phase': {'source': 11},
    });
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'time': 2.0,
      'playing': false,
      'phase': {'source': 11},
    });
    await tester.pumpAndSettle();
    return (store, scene);
  }

  testWidgets('a double tap on More opens exactly one sheet', (tester) async {
    await home(tester);
    // Both taps land before the sheet route exists.
    final more = tester.getCenter(labeledControl('更多'));
    await tester.tapAt(more);
    await tester.tapAt(more);
    await tester.pumpAndSettle();
    expect(find.byType(BottomSheet), findsOneWidget);
  });

  testWidgets('speed changes in place and the sheet stays open', (
    tester,
  ) async {
    final (store, scene) = await home(tester);
    await tester.tap(labeledControl('更多'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('1×'));
    await tester.pumpAndSettle();
    expect(find.byType(BottomSheet), findsOneWidget);
    expect(scene.speed, 1.0);
    expect(store.settings.speed, 1.0);
  });

  testWidgets('edge swipe goes back from the library to the stage', (
    tester,
  ) async {
    await home(tester);
    await tester.tap(labeledControl('更多'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(ListTile, '训练'));
    await tester.pumpAndSettle();
    expect(find.byType(LibraryPage), findsOneWidget);
    final gesture = await tester.startGesture(const Offset(4, 400));
    for (var i = 0; i < 12; i++) {
      await gesture.moveBy(const Offset(24, 0));
      await tester.pump(const Duration(milliseconds: 16));
    }
    await gesture.up();
    await tester.pumpAndSettle();
    expect(find.byType(LibraryPage), findsNothing);
    expect(labeledControl('更多'), findsOneWidget);
  });
}
