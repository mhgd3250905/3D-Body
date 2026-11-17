import 'package:flare/control/learning_store.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart' show FlareSegmented;
import 'package:flare/ui/flare_training_hub_page.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
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

  testWidgets('the single left menu opens one sheet with all entries', (
    tester,
  ) async {
    await home(tester);
    expect(find.byIcon(Icons.menu_rounded), findsOneWidget);
    expect(find.byIcon(Icons.more_horiz_rounded), findsNothing);
    expect(
      tester.getCenter(find.byKey(const ValueKey('home-menu-chip'))).dx,
      lessThan(390 / 2),
    );
    expect(
      tester.getCenter(find.byKey(const ValueKey('home'))).dx,
      closeTo(390 / 2, .5),
    );
    // Both taps land before the sheet route exists.
    final more = tester.getCenter(labeledControl('更多'));
    await tester.tapAt(more);
    await tester.tapAt(more);
    await tester.pumpAndSettle();
    final sheet = find.byType(BottomSheet);
    expect(sheet, findsOneWidget);
    expect(
      find.descendant(of: sheet, matching: find.byType(FlareNavBar)),
      findsNothing,
    );
    final handle = find.byKey(const ValueKey('more-drag-handle'));
    final firstRow = find.byKey(const ValueKey('more-library'));
    expect(
      tester.getTopLeft(firstRow).dy - tester.getBottomLeft(handle).dy,
      closeTo(12, .1),
    );
    expect(find.byType(PlansPage), findsNothing);
    for (final label in ['训练', '计划', '记录', '设置']) {
      expect(find.widgetWithText(FlareListRow, label), findsOneWidget);
    }
    await tester.tap(find.widgetWithText(FlareListRow, '计划'));
    await tester.pumpAndSettle();
    expect(find.byType(PlansPage), findsOneWidget);
  });

  testWidgets('speed changes in place and the sheet stays open', (
    tester,
  ) async {
    final (store, scene) = await home(tester);
    await tester.tap(labeledControl('更多'));
    await tester.pumpAndSettle();
    final card = find.byKey(const ValueKey('more-playback-speed'));
    final icon = find.descendant(of: card, matching: find.byType(FlareRowIcon));
    final control = find.byType(FlareSegmented<double>);
    expect(tester.getTopLeft(control).dx, tester.getTopLeft(icon).dx);
    expect(
      tester.getTopRight(card).dx - tester.getTopRight(control).dx,
      FlareGeometry.rowSideInset,
    );
    final first = tester.getCenter(find.text('0.25×')).dx;
    final second = tester.getCenter(find.text('0.5×')).dx;
    final third = tester.getCenter(find.text('1×')).dx;
    expect(second - first, closeTo(third - second, .1));
    await tester.tap(find.text('1×'));
    await tester.pumpAndSettle();
    expect(find.byType(BottomSheet), findsOneWidget);
    expect(scene.speed, 1.0);
    expect(store.settings.speed, 1.0);
    await tester.drag(
      find.byKey(const ValueKey('more-drag-handle')),
      const Offset(0, 260),
    );
    await tester.pumpAndSettle();
    expect(find.byType(BottomSheet), findsNothing);
    await tester.tap(labeledControl('更多'));
    await tester.pumpAndSettle();
    await tester.tapAt(const Offset(195, 60));
    await tester.pumpAndSettle();
    expect(find.byType(BottomSheet), findsNothing);
  });

  testWidgets('edge swipe goes back from the training hub to the stage', (
    tester,
  ) async {
    await home(tester);
    await tester.tap(labeledControl('更多'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FlareListRow, '训练'));
    await tester.pumpAndSettle();
    expect(find.byType(FlareTrainingHubPage), findsOneWidget);
    final gesture = await tester.startGesture(const Offset(4, 400));
    for (var i = 0; i < 12; i++) {
      await gesture.moveBy(const Offset(24, 0));
      await tester.pump(const Duration(milliseconds: 16));
    }
    await gesture.up();
    await tester.pumpAndSettle();
    expect(find.byType(FlareTrainingHubPage), findsNothing);
    expect(labeledControl('更多'), findsOneWidget);
  });
}
