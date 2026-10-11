import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/muscle_knowledge.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/muscle_widgets.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
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
        if (introductionExtent > 0) {
          await tester.drag(detailContent, const Offset(0, -250));
          await tester.pumpAndSettle();
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

  for (final size in [const Size(320, 700), const Size(390, 844)]) {
    testWidgets(
      'knowledge preview expands, scrolls without a visible scrollbar, and closes at $size',
      (tester) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);

        final sourceText = muscleKnowledge['deltoids']!;
        final veryLongText = List.filled(24, sourceText).join(' ');
        final expectedText = veryLongText.replaceFirstMapped(
          RegExp(r'[。.!؟।]'),
          (match) => '${match[0]}\n\n',
        );
        final longCatalog = catalog.localized({sourceText: veryLongText});
        final (_, scene) = await _pausedMuscle(tester, longCatalog);

        final preview = find.byKey(const ValueKey('muscle-knowledge-toggle'));
        final collapsedText = find.byKey(const ValueKey('muscle-knowledge'));
        final assist = find.byKey(const ValueKey('muscle-assist-cards'));
        final footer = find.byKey(const ValueKey('train-group'));
        final stage = find.byWidgetPredicate(
          (widget) =>
              widget is ColoredBox && widget.color == FlareColors.background,
        );
        expect(preview, findsOneWidget);
        expect(collapsedText, findsOneWidget);
        expect(assist, findsOneWidget);
        expect(footer, findsOneWidget);
        final collapsedValue = _textValue(tester, collapsedText);
        expect(collapsedValue, expectedText);
        final collapsedPosition = Scrollable.of(
          tester.element(collapsedText),
        ).position;
        expect(collapsedPosition.maxScrollExtent, greaterThan(0));
        _expectNoVisibleKnowledgeScrollbar(tester, collapsedText);
        await tester.drag(
          find.byKey(const ValueKey('muscle-detail-content')),
          const Offset(0, -90),
        );
        await tester.pumpAndSettle();
        expect(collapsedPosition.pixels, greaterThan(0));
        final initialPreviewOffset = collapsedPosition.pixels;

        final beforePreview = tester.getRect(preview);
        final beforePreviewText = tester.getRect(collapsedText);
        final previewLayout = _paragraphSnapshot(tester, collapsedText);
        final beforeAssist = tester.getRect(assist);
        final beforeFooter = tester.getRect(footer);
        final beforeStage = tester.getRect(stage);
        final headerBottom = tester
            .getRect(find.byKey(const ValueKey('muscle-detail-title')))
            .bottom;

        await tester.tap(preview);
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 100));

        final expanded = find.byKey(
          const ValueKey('muscle-knowledge-expanded-card'),
        );
        final expandedText = find.byKey(
          const ValueKey('muscle-knowledge-expanded'),
        );
        expect(expanded, findsOneWidget);
        expect(expandedText, findsOneWidget);
        final duringRect = tester.getRect(expanded);
        expect(
          duringRect.height,
          greaterThan(beforePreview.height),
          reason: 'The card must already be growing at the animation midpoint.',
        );
        expect(
          find.byKey(const ValueKey('muscle-knowledge-close')),
          findsNothing,
        );
        expect(
          find.descendant(
            of: preview,
            matching: find.byIcon(Icons.unfold_more_rounded),
          ),
          findsNothing,
        );
        expect(
          find.descendant(
            of: expanded,
            matching: find.byIcon(Icons.unfold_less_rounded),
          ),
          findsNothing,
        );
        _expectParagraphLayoutMatches(
          _paragraphSnapshot(tester, expandedText),
          previewLayout,
        );
        expect(
          Scrollable.of(tester.element(expandedText)).position.pixels,
          closeTo(initialPreviewOffset, .1),
          reason: 'The reader inherits the preview scroll position.',
        );
        final duringText = tester.getRect(expandedText);
        expect(
          duringText.left - duringRect.left,
          closeTo(beforePreviewText.left - beforePreview.left, .1),
        );
        expect(
          duringText.top - duringRect.top,
          closeTo(beforePreviewText.top - beforePreview.top, .1),
        );
        expect(tester.getRect(assist), beforeAssist);
        expect(tester.getRect(footer), beforeFooter);
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);

        await tester.pumpAndSettle();
        final expandedRect = tester.getRect(expanded);
        expect(expandedRect.top, lessThan(duringRect.top));
        expect(expandedRect.bottom, closeTo(beforePreview.bottom, 1));
        expect(expandedRect.top, greaterThanOrEqualTo(headerBottom));
        expect(expandedRect.left, greaterThanOrEqualTo(0));
        expect(expandedRect.right, lessThanOrEqualTo(size.width));
        expect(expandedRect.height, greaterThan(duringRect.height));
        expect(_textValue(tester, expandedText), expectedText);
        _expectParagraphLayoutMatches(
          _paragraphSnapshot(tester, expandedText),
          previewLayout,
        );
        _expectNoVisibleKnowledgeScrollbar(tester, expandedText);
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);

        final expandedPosition = Scrollable.of(
          tester.element(expandedText),
        ).position;
        expect(expandedPosition.maxScrollExtent, greaterThan(0));
        await tester.drag(
          find.byKey(const ValueKey('muscle-knowledge-reader')),
          const Offset(0, -260),
        );
        await tester.pumpAndSettle();
        expect(expandedPosition.pixels, greaterThan(0));
        expect(expandedPosition.pixels, greaterThan(initialPreviewOffset));
        final expandedOffset = expandedPosition.pixels;
        _expectParagraphLayoutMatches(
          _paragraphSnapshot(tester, expandedText),
          previewLayout,
        );
        _expectNoVisibleKnowledgeScrollbar(tester, expandedText);

        expect(tester.getRect(assist), beforeAssist);
        expect(tester.getRect(footer), beforeFooter);
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);

        final readerToggle = find.byKey(
          const ValueKey('muscle-knowledge-reader-toggle'),
        );
        expect(readerToggle, findsOneWidget);
        await tester.tap(readerToggle);
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 100));
        expect(expanded, findsOneWidget);
        final collapsingRect = tester.getRect(expanded);
        expect(collapsingRect.height, greaterThan(beforePreview.height));
        expect(collapsingRect.height, lessThan(expandedRect.height));
        _expectParagraphLayoutMatches(
          _paragraphSnapshot(tester, expandedText),
          previewLayout,
        );
        expect(tester.getRect(assist), beforeAssist);
        expect(tester.getRect(footer), beforeFooter);
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);

        await tester.pumpAndSettle();
        expect(expanded, findsNothing);
        expect(preview, findsOneWidget);
        expect(
          collapsedPosition.pixels,
          closeTo(expandedOffset, .1),
          reason: 'The preview inherits the reader scroll position on close.',
        );
        expect(tester.getRect(assist), beforeAssist);
        expect(tester.getRect(footer), beforeFooter);
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);

        await tester.tap(preview);
        await tester.pumpAndSettle();
        expect(expanded, findsOneWidget);
        expect(
          Scrollable.of(tester.element(expandedText)).position.pixels,
          closeTo(expandedOffset, .1),
          reason: 'Reopening preserves the latest reader position.',
        );
        await tester.tapAt(const Offset(2, 2));
        await tester.pumpAndSettle();
        expect(
          expanded,
          findsNothing,
          reason: 'An outside tap should collapse the overlay.',
        );
        expect(collapsedPosition.pixels, closeTo(expandedOffset, .1));
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);

        await tester.tap(preview);
        await tester.pumpAndSettle();
        expect(expanded, findsOneWidget);
        final nextGroup = catalog.synergists(
          catalog.phaseBySource(11)!,
          'deltoids',
          limit: 99,
        )[2];
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'select',
          'time': 2.375,
          'groupId': nextGroup.id,
        });
        await tester.pumpAndSettle();
        expect(expanded, findsNothing);
        expect(
          find.byKey(const ValueKey('muscle-knowledge-toggle')),
          findsOneWidget,
        );
        expect(scene.time, 2.375);
        expect(scene.selected, nextGroup.id);
        expect(scene.detail, nextGroup.id);
        expect(scene.playing, isFalse);
        expectMuscleKnowledge(tester, nextGroup.id);
        final naturalText = muscleKnowledge[nextGroup.id]!.replaceFirstMapped(
          RegExp(r'[。.!؟।]'),
          (match) => '${match[0]}\n\n',
        );
        final naturalPreviewPosition = Scrollable.of(
          tester.element(find.byKey(const ValueKey('muscle-knowledge'))),
        ).position;
        if (naturalPreviewPosition.maxScrollExtent > 0) {
          await tester.tap(preview);
          await tester.pumpAndSettle();
          expect(expanded, findsOneWidget);
          expect(_textValue(tester, expandedText), naturalText);
          final naturalPosition = Scrollable.of(
            tester.element(expandedText),
          ).position;
          expect(
            naturalPosition.maxScrollExtent,
            closeTo(0, .5),
            reason:
                'A normal teaching note should fit fully in its reader card.',
          );
          await tester.tap(
            find.byKey(const ValueKey('muscle-knowledge-reader-toggle')),
          );
          await tester.pumpAndSettle();
        }
        expect(
          tester.getRect(footer).bottom,
          beforeFooter.bottom,
          reason: 'The practice action stays anchored to the same bottom edge.',
        );
        expect(tester.getRect(stage), beforeStage);
        assertNoFlutterError(tester);
        await tester.pumpWidget(const SizedBox());
      },
    );
  }

  for (final size in [const Size(320, 700), const Size(390, 844)]) {
    testWidgets(
      'muscle detail keeps a half-height stage and panel through swaps at $size',
      (tester) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);

        final sourceText = muscleKnowledge['deltoids']!;
        final expandedSource = List.filled(8, sourceText).join(' ');
        final expectedExpanded = expandedSource.replaceFirstMapped(
          RegExp(r'[。.!؟।]'),
          (match) => '${match[0]}\n\n',
        );
        final expandedCatalog = catalog.localized({sourceText: expandedSource});
        final (_, scene) = await _pausedMuscle(tester, expandedCatalog);
        final stage = find.byWidgetPredicate(
          (widget) =>
              widget is ColoredBox && widget.color == FlareColors.background,
        );
        final beforeStage = tester.getRect(stage);
        final beforeHalves = _detailHalves(tester);
        _expectHalfHeightRegions(beforeHalves, beforeStage);
        expect(scene.detailModel, 'motion');
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);

        final preview = find.byKey(const ValueKey('muscle-knowledge-toggle'));
        final expandedCard = find.byKey(
          const ValueKey('muscle-knowledge-expanded-card'),
        );
        final expandedText = find.byKey(
          const ValueKey('muscle-knowledge-expanded'),
        );
        await tester.tap(preview);
        await tester.pumpAndSettle();
        expect(expandedCard, findsOneWidget);
        expect(_textValue(tester, expandedText), expectedExpanded);
        _expectHalfHeightRegions(_detailHalves(tester), beforeStage);
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);

        await tester.tap(
          find.byKey(const ValueKey('muscle-knowledge-reader-toggle')),
        );
        await tester.pumpAndSettle();
        expect(expandedCard, findsNothing);
        _expectHalfHeightRegions(_detailHalves(tester), beforeStage);

        final generation = scene.selectionGeneration;
        await tester.tap(find.byKey(const ValueKey('detail-card')));
        await tester.pumpAndSettle();
        expect(scene.detailModel, 'muscles');
        expect(scene.selectionGeneration, generation);
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);
        expect(tester.getRect(stage), beforeStage);
        _expectHalfHeightRegions(_detailHalves(tester), beforeStage);

        await tester.tap(preview);
        await tester.pumpAndSettle();
        expect(expandedCard, findsOneWidget);
        expect(_textValue(tester, expandedText), expectedExpanded);
        _expectHalfHeightRegions(_detailHalves(tester), beforeStage);
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);

        await tester.tap(
          find.byKey(const ValueKey('muscle-knowledge-reader-toggle')),
        );
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('detail-card')));
        await tester.pumpAndSettle();
        expect(scene.detailModel, 'motion');
        expect(scene.selectionGeneration, generation);
        _expectHalfHeightRegions(_detailHalves(tester), beforeStage);
        expect(tester.getRect(stage), beforeStage);
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);

        await tester.tap(labeledControl('返回同一帧'));
        await tester.pumpAndSettle();
        expect(scene.detail, isNull);
        expect(scene.detailModel, 'motion');
        expect(scene.selectionGeneration, generation);
        expect(scene.time, 2.375);
        expect(scene.selected, 'deltoids');
        expect(scene.playing, isFalse);
        expect(tester.getRect(stage), beforeStage);
        assertNoFlutterError(tester);
        await tester.pumpWidget(const SizedBox());
      },
    );
  }
}

typedef _DetailHalves = ({Rect upper, Rect lower});

_DetailHalves _detailHalves(WidgetTester tester) {
  final upperRegion = find
      .ancestor(
        of: find.byKey(const ValueKey('detail-card')),
        matching: find.byType(Stack),
      )
      .first;
  final lowerRegion = find
      .ancestor(
        of: find.byKey(const ValueKey('train-group')),
        matching: find.byType(Column),
      )
      .first;
  return (
    upper: tester.getRect(upperRegion),
    lower: tester.getRect(lowerRegion),
  );
}

void _expectHalfHeightRegions(_DetailHalves halves, Rect stage) {
  expect(halves.upper.top, closeTo(stage.top, 1));
  expect(halves.upper.height, closeTo(stage.height / 2, 1));
  expect(halves.upper.bottom, closeTo(halves.lower.top, 1));
  expect(halves.lower.height, closeTo(stage.height / 2, 1));
  expect(halves.lower.bottom, closeTo(stage.bottom, 1));
}

String _textValue(WidgetTester tester, Finder finder) {
  final text = tester.widget<Text>(finder);
  return text.data ?? text.textSpan?.toPlainText() ?? '';
}

typedef _ParagraphLayout = ({
  TextStyle? widgetStyle,
  TextStyle? renderedStyle,
  TextScaler textScaler,
  double width,
  double height,
});

_ParagraphLayout _paragraphSnapshot(WidgetTester tester, Finder finder) {
  final text = tester.widget<Text>(finder);
  final paragraph = tester.renderObject<RenderParagraph>(finder);
  return (
    widgetStyle: text.style,
    renderedStyle: paragraph.text.style,
    textScaler: MediaQuery.textScalerOf(tester.element(finder)),
    width: paragraph.size.width,
    height: paragraph.size.height,
  );
}

void _expectParagraphLayoutMatches(
  _ParagraphLayout actual,
  _ParagraphLayout expected,
) {
  expect(actual.widgetStyle, expected.widgetStyle);
  expect(actual.renderedStyle, expected.renderedStyle);
  expect(actual.textScaler, expected.textScaler);
  expect(actual.width, expected.width);
  expect(actual.height, expected.height);
}

void _expectNoVisibleKnowledgeScrollbar(WidgetTester tester, Finder target) {
  final bars = tester.widgetList<Scrollbar>(
    find.ancestor(of: target, matching: find.byType(Scrollbar)),
  );
  expect(
    bars.where((bar) => bar.thumbVisibility == true),
    isEmpty,
    reason: 'Knowledge scrolls without a persistent visible scrollbar.',
  );
}
