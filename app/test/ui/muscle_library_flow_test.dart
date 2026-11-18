import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart'
    show MemoryStateStorage, testApp, labeledControl, assertNoFlutterError;

Future<(LearningStore, SceneController)> _pausedHome(
  WidgetTester tester,
  Catalog catalog,
) async {
  final store = LearningStore(catalog: catalog, storage: MemoryStateStorage());
  await store.initialize();
  await store.acknowledgeSafety();
  await store.setLastTime(2.375);
  final scene = SceneController();
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
    'time': 2.375,
    'period': 9.0,
    'phase': {'source': 11},
  });
  scene.setTime(2.375);
  await tester.pumpAndSettle();
  return (store, scene);
}

void main() {
  final catalog = loadCatalogFixture();
  testWidgets(
    'muscle search keeps context and logs reopen the unfiltered fallback library',
    (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final (_, scene) = await _pausedHome(tester, catalog);
      Future<void> openLibraryFromRecords() async {
        await tester.tap(labeledControl('更多'));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('more-progress')));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('records-start')));
        await tester.pumpAndSettle();
      }

      await openLibraryFromRecords();
      await tester.enterText(find.byType(TextField), '三角肌');
      final support = find.byKey(
        const ValueKey('drill-filter-section-support'),
      );
      await tester.ensureVisible(support);
      await tester.tap(support);
      await tester.pumpAndSettle();
      expect(find.byType(LibraryPage), findsOneWidget);
      expect(find.byType(DrillDetailPage), findsNothing);
      expect(find.text('选一个训练场景'), findsNothing);
      expect(find.byKey(const ValueKey('library-group-filter')), findsNothing);
      expect(
        tester.widget<EditableText>(find.byType(EditableText)).controller.text,
        '三角肌',
      );
      expect(
        tester.widget<DrillCard>(find.byType(DrillCard)).drill.id,
        'deltoids-A',
      );
      final homeTier = find.byKey(const ValueKey('drill-filter-tier-B'));
      await tester.ensureVisible(homeTier);
      await tester.tap(homeTier);
      await tester.pumpAndSettle();
      expect(
        tester.widget<DrillCard>(find.byType(DrillCard)).drill.id,
        'deltoids-B',
      );
      await tester.enterText(find.byType(TextField), '肩袖肌群');
      await tester.pumpAndSettle();
      expect(
        tester.widget<DrillCard>(find.byType(DrillCard)).drill.id,
        'rotator-cuff-B',
      );
      await tester.tap(find.text(catalog.drillById('rotator-cuff-B')!.name));
      await tester.pumpAndSettle();
      expect(
        tester.widget<DrillDetailPage>(find.byType(DrillDetailPage)).drill.id,
        'rotator-cuff-B',
      );
      await tester.tap(find.byTooltip('返回'));
      await tester.pumpAndSettle();
      expect(find.byType(LibraryPage), findsOneWidget);
      expect(
        tester.widget<EditableText>(find.byType(EditableText)).controller.text,
        '肩袖肌群',
      );
      expect(
        tester.widget<DrillCard>(find.byType(DrillCard)).drill.id,
        'rotator-cuff-B',
      );
      expect(find.byTooltip('清空搜索'), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('library-clear-search')));
      await tester.pumpAndSettle();
      expect(
        tester.widget<EditableText>(find.byType(EditableText)).controller.text,
        isEmpty,
      );
      await tester.ensureVisible(support);
      await tester.tap(support);
      await tester.pumpAndSettle();
      expect(
        tester.widget<SliverCardRows>(find.byType(SliverCardRows)).itemCount,
        8,
      );
      for (final card in tester.widgetList<DrillCard>(find.byType(DrillCard))) {
        expect(card.drill.tier, 'B');
        expect(catalog.groupById(card.drill.groupId)!.section, 'support');
      }
      // One shared filter row: scroll the chip into view before tapping.
      await tester.ensureVisible(find.text('全部部位'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('全部部位'));
      await tester.pumpAndSettle();
      expect(
        tester.widget<SliverCardRows>(find.byType(SliverCardRows)).itemCount,
        18,
      );
      await tester.enterText(find.byType(TextField), '三角肌');
      await tester.pumpAndSettle();
      await tester.tap(find.byTooltip('返回'));
      await tester.pumpAndSettle();
      expect(find.byType(LibraryPage), findsNothing);
      expect(scene.time, 2.375);
      expect(scene.playing, isFalse);
      await openLibraryFromRecords();
      expect(
        tester.widget<LibraryPage>(find.byType(LibraryPage)).initialGroup,
        isNull,
      );
      expect(
        tester.widget<EditableText>(find.byType(EditableText)).controller.text,
        isEmpty,
      );
      expect(find.byKey(const ValueKey('library-group-filter')), findsNothing);
      expect(
        tester.widget<SliverCardRows>(find.byType(SliverCardRows)).itemCount,
        18,
      );
      expect(scene.time, 2.375);
      expect(scene.playing, isFalse);
      assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    },
  );
}
