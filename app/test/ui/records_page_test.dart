import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _Memory implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

Widget _app(Widget home, {double scale = 1}) => MaterialApp(
  theme: flareTheme(Brightness.dark),
  locale: const Locale('zh'),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  builder: (context, child) => MediaQuery(
    data: MediaQuery.of(context).copyWith(textScaler: TextScaler.linear(scale)),
    child: child!,
  ),
  home: Scaffold(body: home),
);

void main() {
  final catalog = loadCatalogFixture();
  tearDown(() => FlareColors.use(Brightness.dark));

  test('milestones are dated by the first run that reached them', () {
    DateTime d(int day) => DateTime(2026, 10, day);
    final earned = ProgressPage.earnedDates({
      d(1), d(2), d(3), // 3 reached on Oct 3
      d(10), d(11), d(12), d(13), d(14), d(15), d(16), // 7 on Oct 16
    });
    expect(earned, {3: d(3), 7: d(16)});
    expect(ProgressPage.earnedDates({d(1), d(3), d(5)}), isEmpty);
  });

  testWidgets('records page: real stats, one-time celebration, 1.5× rows', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(393, 852);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final storage = _Memory();
    final store = LearningStore(catalog: catalog, storage: storage);
    await store.initialize();
    addTearDown(store.dispose);
    final now = DateTime.now();
    for (var i = 0; i < 3; i++) {
      final start = DateTime(now.year, now.month, now.day - i, 7).toUtc();
      await store.logSession(
        TrainingSession(
          id: 's$i',
          drillId: 'obliques-A',
          startedAt: start,
          endedAt: start.add(const Duration(minutes: 5)),
          plannedSets: 3,
          completedSets: 3,
          activeSeconds: 120,
          completed: true,
          pain: false,
        ),
      );
    }
    Widget page() => ProgressPage(
      catalog: catalog,
      store: store,
      onBack: () {},
      onDrill: (_) {},
    );
    await tester.pumpWidget(_app(page(), scale: 1.5));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    expect(find.byKey(const ValueKey('records-celebrate')), findsOneWidget);
    expect(store.celebratedStreak, 3);
    expect(find.text('还差 4 天'), findsOneWidget);
    await tester.drag(find.byType(Scrollable).first, const Offset(0, -2000));
    await tester.pumpAndSettle();
    // Status tag and the sets label each stay on one line.
    final tag = tester.getSize(find.text('完成').first);
    expect(tag.height, lessThan(30));
    expect(find.textContaining('第\u00a03\u00a0/\u00a03\u00a0组'), findsWidgets);

    // Persisted: a fresh store from the same storage shows no banner again.
    final reopened = LearningStore(catalog: catalog, storage: storage);
    await reopened.initialize();
    addTearDown(reopened.dispose);
    expect(reopened.celebratedStreak, 3);
    await tester.pumpWidget(const SizedBox());
    await tester.pumpWidget(
      _app(
        ProgressPage(
          catalog: catalog,
          store: reopened,
          onBack: () {},
          onDrill: (_) {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('records-celebrate')), findsNothing);
  });

  testWidgets('picker: added is a dimmed 已加入 tag, a new pick is numbered', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(393, 852);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final store = LearningStore(catalog: catalog, storage: _Memory());
    await store.initialize();
    addTearDown(store.dispose);
    await store.createRoutine('热身', ['obliques-A']);
    await tester.pumpWidget(
      _app(
        RoutineEditorPage(
          catalog: catalog,
          store: store,
          routine: store.routines.first,
          onBack: () {},
          onSaved: (_) {},
          onDeleted: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('routine-add')));
    await tester.pumpAndSettle();
    final search = find.byKey(const ValueKey('picker-search'));
    await tester.enterText(search, catalog.drillById('obliques-A')!.name);
    await tester.pumpAndSettle();
    final added = find.byKey(const ValueKey('pick-obliques-A'));
    expect(
      find.descendant(of: added, matching: find.text('已加入')),
      findsOneWidget,
    );
    // Tapping an already-added drill does nothing.
    await tester.tap(added, warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(find.text('已选 0 个'), findsOneWidget);
    final other = catalog.drills.firstWhere(
      (x) => x.tier == 'A' && x.id != 'obliques-A',
    );
    await tester.enterText(search, other.name);
    await tester.pumpAndSettle();
    final tile = find.byKey(ValueKey('pick-${other.id}'));
    await tester.tap(tile);
    await tester.pumpAndSettle();
    expect(find.descendant(of: tile, matching: find.text('1')), findsOneWidget);
    expect(find.descendant(of: tile, matching: find.text('已加入')), findsNothing);
    expect(find.text('已选 1 个'), findsOneWidget);
  });
}
