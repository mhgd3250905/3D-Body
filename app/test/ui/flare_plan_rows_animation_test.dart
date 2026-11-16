import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/flare_plan_detail_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

class _MemoryStorage implements LocalStateStorage {
  String? value;

  @override
  Future<String?> read(String key) async => value;

  @override
  Future<void> write(String key, String value) async => this.value = value;
}

FlarePlan _plan(int tier, List<String> drills) => FlarePlan.fromJson({
  'id': 'test-tier-$tier',
  'kind': 'muscle',
  'target': 'deltoids',
  'tier': tier,
  'items': [
    for (final drill in drills)
      {'drill': drill, 'sets': 1, 'reps': 4, 'restSeconds': 0},
  ],
});

Finder _row(int index, String id) =>
    find.byKey(ValueKey('flare-plan-item-$index-$id'));

Finder _tier(String label) => find.descendant(
  of: find.byKey(const ValueKey('flare-plan-tier')),
  matching: find.text(label),
);

Finder _resizingList() => find.descendant(
  of: find.byType(FlarePlanDetailPage),
  matching: find.byType(AnimatedSize),
);

double _rowOpacity(WidgetTester tester, Finder row) {
  final opacities = tester.widgetList<Opacity>(
    find.ancestor(of: row, matching: find.byType(Opacity)),
  );
  return opacities.fold(1.0, (total, opacity) => total * opacity.opacity);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late Catalog catalog;

  setUpAll(() async => catalog = await Catalog.load());

  Future<void> mountDetail(
    WidgetTester tester, {
    bool reducedMotion = false,
  }) async {
    tester.view.physicalSize = const Size(480, 1200);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final store = LearningStore(catalog: catalog, storage: _MemoryStorage());
    await store.initialize();
    addTearDown(store.dispose);
    final plans = [
      _plan(1, ['deltoids-A', 'deltoids-B']),
      _plan(2, ['deltoids-C']),
      _plan(3, ['triceps-A', 'forearms-A', 'erectors-B', 'deltoids-A']),
    ];
    var tier = 1;
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(),
        locale: const Locale('zh'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Builder(
          builder: (context) => MediaQuery(
            data: MediaQuery.of(
              context,
            ).copyWith(disableAnimations: reducedMotion),
            child: StatefulBuilder(
              builder: (_, setState) => FlarePlanDetailPage(
                title: '三角肌',
                plans: plans,
                selectedTier: tier,
                catalog: catalog,
                store: store,
                onTierChanged: (value) => setState(() => tier = value),
                onMuscle: (_) {},
                onDrill: (_) {},
                onBack: () {},
                onStart: (_) {},
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('exits before staggering the rows for the latest tier', (
    tester,
  ) async {
    await mountDetail(tester);
    final original = _row(0, 'deltoids-A');
    final superseded = _row(0, 'deltoids-C');
    final latestFirst = _row(0, 'triceps-A');
    final latestSecond = _row(1, 'forearms-A');
    final initialHeight = tester.getSize(_resizingList()).height;
    final initialTop = tester.getTopLeft(original).dy;

    await tester.tap(_tier('中级'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 60));
    expect(_rowOpacity(tester, original), allOf(greaterThan(0), lessThan(1)));
    expect(tester.getTopLeft(original).dy, lessThan(initialTop));
    expect(superseded, findsNothing);

    await tester.tap(_tier('高级'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 59));
    expect(original, findsOneWidget);
    expect(superseded, findsNothing);
    expect(latestFirst, findsNothing);

    await tester.pump(const Duration(milliseconds: 2));
    expect(original, findsNothing);
    expect(superseded, findsNothing);
    expect(latestFirst, findsOneWidget);
    expect(_rowOpacity(tester, latestFirst), 0);
    expect(tester.getSize(_resizingList()).height, initialHeight);

    await tester.pump(const Duration(milliseconds: 20));
    expect(_rowOpacity(tester, latestFirst), greaterThan(0));
    expect(_rowOpacity(tester, latestSecond), 0);
    final movingHeight = tester.getSize(_resizingList()).height;
    expect(movingHeight, greaterThan(initialHeight));

    await tester.pump(const Duration(milliseconds: 30));
    expect(_rowOpacity(tester, latestSecond), greaterThan(0));
    expect(
      _rowOpacity(tester, latestFirst),
      greaterThan(_rowOpacity(tester, latestSecond)),
    );

    await tester.pumpAndSettle();
    expect(_rowOpacity(tester, latestFirst), 1);
    expect(_rowOpacity(tester, latestSecond), 1);
    expect(tester.getSize(_resizingList()).height, greaterThan(movingHeight));
    expect(tester.takeException(), isNull);
  });

  testWidgets('reduced motion swaps once without fades or resizing', (
    tester,
  ) async {
    await mountDetail(tester, reducedMotion: true);

    await tester.tap(_tier('中级'));
    await tester.pump();

    final newRow = _row(0, 'deltoids-C');
    expect(_row(0, 'deltoids-A'), findsNothing);
    expect(newRow, findsOneWidget);
    expect(_rowOpacity(tester, newRow), 1);
    expect(_resizingList(), findsNothing);
    expect(tester.takeException(), isNull);
  });
}
