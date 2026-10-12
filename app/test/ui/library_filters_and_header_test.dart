import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage, testApp;

void _viewport(WidgetTester tester, Size size) {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
}

void _expectCenteredTitle(
  WidgetTester tester,
  String title,
  double viewportWidth,
) {
  final titleFinder = find.descendant(
    of: find.byType(PageHeader),
    matching: find.text(title),
  );
  expect(titleFinder, findsOneWidget);
  expect(
    tester.getCenter(titleFinder).dx,
    closeTo(viewportWidth / 2, .5),
    reason: 'The title must center on the page, including asymmetric actions',
  );
  expect(
    tester.getRect(titleFinder).top,
    lessThan(52),
    reason: 'The title belongs in the top navigation row',
  );
}

Future<void> _tapLabel(WidgetTester tester, String label) async {
  final finder = find.text(label);
  expect(finder, findsOneWidget);
  if (finder.hitTestable().evaluate().isEmpty) {
    await tester.ensureVisible(finder);
    await tester.pumpAndSettle();
  }
  await tester.tap(finder);
  await tester.pumpAndSettle();
  expect(tester.takeException(), isNull);
}

void _expectResults(
  WidgetTester tester,
  Catalog catalog, {
  required String tier,
  String? section,
  Set<String>? exactIds,
}) {
  final cards = tester.widgetList<DrillCard>(find.byType(DrillCard)).toList();
  final grid = tester.widget<SliverGrid>(find.byType(SliverGrid));
  if (exactIds != null && exactIds.isEmpty) {
    expect(cards, isEmpty);
    expect(grid.delegate.estimatedChildCount, 0);
    return;
  }
  expect(cards, isNotEmpty);
  for (final card in cards) {
    expect(card.drill.tier, tier);
    if (section != null) {
      expect(catalog.groupById(card.drill.groupId)!.section, section);
    }
    if (exactIds != null) expect(exactIds, contains(card.drill.id));
  }
  if (exactIds != null) {
    expect(grid.delegate.estimatedChildCount, exactIds.length);
    expect(cards.map((card) => card.drill.id).toSet(), exactIds);
  }
}

void main() {
  final catalog = loadCatalogFixture();
  for (final size in [const Size(390, 844), const Size(552, 909)]) {
    testWidgets(
      'top header centers a title with only a right action at $size',
      (tester) async {
        _viewport(tester, size);
        await tester.pumpWidget(
          testApp(
            Scaffold(
              body: PageHeader(
                title: '训练',
                action: RoundIconButton(
                  icon: Icons.search_rounded,
                  tooltip: '搜索',
                  onPressed: () {},
                ),
              ),
            ),
          ),
        );
        _expectCenteredTitle(tester, '训练', size.width);
        expect(
          tester.getCenter(find.byType(RoundIconButton)).dy,
          closeTo(tester.getCenter(find.text('训练')).dy, .5),
        );
        expect(tester.takeException(), isNull);
      },
    );

    testWidgets(
      'body and setting filters remain combined with search at $size',
      (tester) async {
        _viewport(tester, size);
        final store = LearningStore(
          catalog: catalog,
          storage: MemoryStateStorage(),
        );
        await store.initialize();
        await store.updateSettings(tier: 'A');
        await store.addToToday('chest-A');
        addTearDown(store.dispose);
        await tester.pumpWidget(
          testApp(
            Scaffold(
              body: AnimatedBuilder(
                animation: store,
                builder: (context, _) => LibraryPage(
                  catalog: catalog,
                  store: store,
                  onBack: () {},
                  onDrill: (_) {},
                  onRemove: (_) {},
                ),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        _expectCenteredTitle(tester, '训练', size.width);
        expect(find.byType(TextField), findsOneWidget);
        expect(
          tester.widget<PageHeader>(find.byType(PageHeader)).action,
          isNull,
        );
        expect(find.byTooltip('搜索'), findsNothing);
        expect(
          find.byKey(const ValueKey('library-group-filter')),
          findsNothing,
        );
        expect(
          tester.getRect(find.byType(TextField)).top,
          greaterThanOrEqualTo(tester.getRect(find.byType(PageHeader)).bottom),
        );
        expect(find.text('今日训练'), findsOneWidget);
        expect(
          tester.getRect(find.text('核心')).top,
          lessThan(tester.getRect(find.text('居家')).top),
          reason: 'Body categories precede the second-row training settings',
        );

        await _tapLabel(tester, '核心');
        await _tapLabel(tester, '居家');
        _expectResults(tester, catalog, tier: 'B', section: 'core');
        expect(store.settings.tier, 'B');

        await _tapLabel(tester, '无器械');
        _expectResults(tester, catalog, tier: 'A', section: 'core');
        await _tapLabel(tester, '腿部');
        _expectResults(tester, catalog, tier: 'A', section: 'legs');
        await _tapLabel(tester, '全部部位');
        _expectResults(tester, catalog, tier: 'A');
        expect(
          tester
              .widget<SliverGrid>(find.byType(SliverGrid))
              .delegate
              .estimatedChildCount,
          17,
        );
        final searchRect = tester.getRect(find.byType(TextField));
        await tester.drag(find.byType(CustomScrollView), const Offset(0, -260));
        await tester.pumpAndSettle();
        expect(
          Scrollable.of(
            tester.element(find.byType(SliverGrid)),
          ).position.pixels,
          greaterThan(0),
        );
        expect(tester.getRect(find.byType(TextField)), searchRect);
        expect(find.byType(TextField).hitTestable(), findsOneWidget);
        expect(
          find.ancestor(
            of: find.byType(TextField),
            matching: find.byType(CustomScrollView),
          ),
          findsNothing,
        );
        await tester.drag(find.byType(CustomScrollView), const Offset(0, 500));
        await tester.pumpAndSettle();

        await _tapLabel(tester, '腿部');
        await tester.enterText(find.byType(TextField), '硬拉');
        await tester.pumpAndSettle();
        expect(find.text('今日训练'), findsNothing);
        expect(find.byType(DrillTile), findsNothing);
        expect(store.todayIds, ['chest-A']);
        _expectResults(
          tester,
          catalog,
          tier: 'A',
          section: 'legs',
          exactIds: {'hamstrings-A'},
        );

        await _tapLabel(tester, '居家');
        _expectResults(
          tester,
          catalog,
          tier: 'B',
          section: 'legs',
          exactIds: {},
        );
        expect(
          tester
              .widget<EditableText>(find.byType(EditableText))
              .controller
              .text,
          '硬拉',
        );
        await tester.enterText(find.byType(TextField), '弯举');
        await tester.pumpAndSettle();
        _expectResults(
          tester,
          catalog,
          tier: 'B',
          section: 'legs',
          exactIds: {'hamstrings-B'},
        );
        await _tapLabel(tester, '核心');
        _expectResults(
          tester,
          catalog,
          tier: 'B',
          section: 'core',
          exactIds: {},
        );
        expect(find.text('今日训练'), findsNothing);
        expect(find.byType(DrillTile), findsNothing);
        expect(store.todayIds, ['chest-A']);
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
      },
    );
  }
}
