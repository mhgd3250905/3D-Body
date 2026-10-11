import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/muscle_widgets.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart'
    show
        MemoryStateStorage,
        testApp,
        labeledControl,
        assertNoFlutterError,
        expectMuscleKnowledge;

Future<(LearningStore, SceneController)> _pausedMuscle(
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
  scene.receiveEvent({
    'source': 'flare-scene',
    'type': 'select',
    'time': 2.375,
    'groupId': 'deltoids',
  });
  await tester.pumpAndSettle();
  return (store, scene);
}

void main() {
  final catalog = loadCatalogFixture();
  for (final size in [const Size(390, 844), const Size(552, 909)]) {
    testWidgets(
      'knowledge and assist cards scroll independently around fixed detail controls at $size',
      (tester) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);
        final (_, scene) = await _pausedMuscle(tester, catalog);
        final phase = catalog.phaseBySource(11)!;
        final why = find.text(phase.muscle('deltoids')!.why!);
        expect(why, findsOneWidget);
        expectMuscleKnowledge(tester, 'deltoids');
        expect(find.text('协助发力'), findsNothing);
        expect(find.textContaining('暂停于'), findsNothing);
        expect(find.text('11 · 第一侧支撑'), findsNothing);
        expect(
          find.byWidgetPredicate(
            (widget) =>
                widget is Text &&
                RegExp(r'^(支撑|核心|腿部) · (主力|协同) · ').hasMatch(widget.data ?? ''),
          ),
          findsNothing,
        );
        final together = catalog.synergists(phase, 'deltoids', limit: 99);
        expect(
          tester
              .widgetList<MuscleAssistCard>(find.byType(MuscleAssistCard))
              .map((card) => card.group.id)
              .toList(),
          together.map((group) => group.id).toList(),
        );
        final photographedIds = tester
            .widgetList<MuscleThumbnail>(find.byType(MuscleThumbnail))
            .map((thumbnail) => thumbnail.group.id)
            .toSet();
        expect(photographedIds, containsAll(together.map((group) => group.id)));

        final footer = find.byKey(const ValueKey('train-group'));
        final beforeFooter = tester.getRect(footer);
        final stage = find.byWidgetPredicate(
          (widget) =>
              widget is ColoredBox && widget.color == FlareColors.background,
        );
        final beforeStage = tester.getRect(stage);
        expect(
          find.ancestor(
            of: footer,
            matching: find.byType(SingleChildScrollView),
          ),
          findsNothing,
        );
        final scroll = find.byKey(const ValueKey('muscle-assist-cards'));
        final beforeCards = tester.getRect(scroll);
        final title = find.byKey(const ValueKey('muscle-panel-title'));
        final beforeTitle = tester.getRect(title);
        final beforeRole = tester.getRect(why);
        final knowledge = find.byKey(const ValueKey('muscle-knowledge'));
        final detailContent = find.byKey(
          const ValueKey('muscle-detail-content'),
        );
        final introductionPosition = Scrollable.of(
          tester.element(knowledge),
        ).position;
        final introductionExtent = introductionPosition.maxScrollExtent;
        if (size.width == 390) {
          expect(introductionExtent, greaterThan(0));
        }
        await tester.drag(detailContent, const Offset(0, -250));
        await tester.pumpAndSettle();
        if (introductionExtent > 0) {
          expect(
            introductionPosition.pixels,
            greaterThan(0),
            reason: 'Overflowing introduction copy must scroll independently',
          );
        } else {
          expect(introductionPosition.pixels, 0);
          expect(
            tester.getSize(knowledge).height,
            lessThanOrEqualTo(introductionPosition.viewportDimension),
            reason: 'Copy that needs no scroll must be completely visible',
          );
        }
        expect(tester.getRect(title), beforeTitle);
        expect(tester.getRect(why), beforeRole);
        expect(tester.getRect(scroll), beforeCards);
        expect(tester.getRect(footer), beforeFooter);
        expect(tester.getRect(stage), beforeStage);
        expect(
          beforeFooter.top - beforeCards.bottom,
          inInclusiveRange(12, 28),
          reason: 'Assist cards stay directly above the fixed training button',
        );
        expect(
          find.ancestor(
            of: scroll,
            matching: find.byKey(const ValueKey('muscle-detail-content')),
          ),
          findsNothing,
        );
        await tester.drag(scroll, const Offset(-300, 0));
        await tester.pumpAndSettle();
        expect(
          Scrollable.of(
            tester.element(find.byType(MuscleAssistCard).first),
          ).position.pixels,
          greaterThan(0),
          reason: 'The collaborative cards must actually scroll in this check',
        );
        expect(tester.getRect(footer), beforeFooter);
        expect(tester.getRect(scroll), beforeCards);
        expect(tester.getRect(stage), beforeStage);
        expect(footer.hitTestable(), findsOneWidget);
        expect(beforeFooter.bottom, lessThanOrEqualTo(size.height));
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);
        final nextGroup = together[2];
        final nextCard = find.byWidgetPredicate(
          (widget) =>
              widget is MuscleAssistCard && widget.group.id == nextGroup.id,
        );
        await tester.ensureVisible(nextCard);
        await tester.pumpAndSettle();
        await tester.tap(nextCard);
        await tester.pumpAndSettle();
        expect(scene.detail, nextGroup.id);
        expectMuscleKnowledge(tester, nextGroup.id);
        expect(
          Scrollable.of(
            tester.element(find.byKey(const ValueKey('muscle-knowledge'))),
          ).position.pixels,
          0,
          reason: 'Changing the muscle starts its introduction at the top',
        );
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);
        for (final group in catalog.groups) {
          scene.receiveEvent({
            'source': 'flare-scene',
            'type': 'select',
            'time': 2.375,
            'groupId': group.id,
          });
          await tester.pumpAndSettle();
          expect(scene.detail, group.id);
          expectMuscleKnowledge(tester, group.id);
          expect(
            tester
                .getSize(find.byKey(const ValueKey('muscle-detail-content')))
                .height,
            greaterThan(0),
            reason:
                '${group.id} must retain a usable introduction viewport at $size',
          );
          expect(tester.getRect(stage), beforeStage);
          expect(scene.time, 2.375);
          assertNoFlutterError(tester);
        }
        assertNoFlutterError(tester);
        await tester.pumpWidget(const SizedBox());
      },
    );
  }

  testWidgets(
    'editing and clearing muscle search keeps context and More opens all groups',
    (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final (_, scene) = await _pausedMuscle(tester, catalog);
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'time': 2.375,
        'playing': false,
        'selected': 'deltoids',
        'detail': true,
        'detailModel': 'muscles',
      });
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('train-group')));
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
      await tester.tap(find.text('居家'));
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
      expect(
        tester
            .widget<SliverGrid>(find.byType(SliverGrid))
            .delegate
            .estimatedChildCount,
        8,
      );
      for (final card in tester.widgetList<DrillCard>(find.byType(DrillCard))) {
        expect(card.drill.tier, 'B');
        expect(catalog.groupById(card.drill.groupId)!.section, 'support');
      }
      await tester.tap(find.text('全部部位'));
      await tester.pumpAndSettle();
      expect(
        tester
            .widget<SliverGrid>(find.byType(SliverGrid))
            .delegate
            .estimatedChildCount,
        17,
      );
      await tester.tap(find.byTooltip('返回'));
      await tester.pumpAndSettle();
      expect(find.byType(LibraryPage), findsNothing);
      expect(scene.time, 2.375);
      expect(scene.selected, 'deltoids');
      expect(scene.detail, 'deltoids');
      expect(scene.detailModel, 'muscles');
      expect(scene.playing, isFalse);
      await tester.tap(labeledControl('返回同一帧'));
      await tester.pumpAndSettle();
      await tester.tap(labeledControl('更多'));
      await tester.pumpAndSettle();
      await tester.tap(find.widgetWithText(ListTile, '训练'));
      await tester.pumpAndSettle();
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
        tester
            .widget<SliverGrid>(find.byType(SliverGrid))
            .delegate
            .estimatedChildCount,
        17,
      );
      expect(scene.time, 2.375);
      expect(scene.playing, isFalse);
      assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    },
  );
}
