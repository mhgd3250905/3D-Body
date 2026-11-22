import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
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

Widget _app(Widget home) => MaterialApp(
  theme: flareTheme(Brightness.dark),
  locale: const Locale('zh'),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  home: Scaffold(body: SafeArea(child: home)),
);

void _phone(WidgetTester tester) {
  tester.view.physicalSize = const Size(390, 844);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
}

void main() {
  final catalog = loadCatalogFixture(includeFlarePlans: true);

  Future<LearningStore> store() async {
    final s = LearningStore(catalog: catalog, storage: _Memory());
    await s.initialize();
    await s.acknowledgeSafety();
    return s;
  }

  testWidgets('plans shows authored angles and muscles before any training', (
    tester,
  ) async {
    _phone(tester);
    final s = await store();
    addTearDown(s.dispose);
    int? openedAngle;
    String? openedMuscle;
    var created = 0;
    await tester.pumpWidget(
      _app(
        AnimatedBuilder(
          animation: s,
          builder: (_, _) => PlansPage(
            catalog: catalog,
            store: s,
            onOpenAngle: (phase) => openedAngle = phase.source,
            onOpenMuscle: (group) => openedMuscle = group.id,
            onAllAngles: () {},
            onAllMuscles: () {},
            onContinue: () {},
            onRoutine: (_) {},
            onNewRoutine: () => created++,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('成套训练'), findsNothing);
    expect(find.byKey(const ValueKey('plan-last-session')), findsNothing);
    expect(find.text('把常练的动作组合起来'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('plan-new')));
    expect(created, 1);
    await tester.tap(find.byKey(const ValueKey('plan-angle-11')));
    expect(openedAngle, 11);
    final muscle = find.byKey(const ValueKey('plan-muscle-deltoids'));
    final pageScroll = find.byWidgetPredicate(
      (widget) =>
          widget is Scrollable && widget.axisDirection == AxisDirection.down,
    );
    await tester.scrollUntilVisible(muscle, 250, scrollable: pageScroll);
    await tester.tap(muscle);
    expect(openedMuscle, 'deltoids');
    expect(s.settings.tier, 'A');
    expect(tester.takeException(), isNull);
  });

  testWidgets('editor picks drills in tap order, removes, and saves', (
    tester,
  ) async {
    _phone(tester);
    final s = await store();
    addTearDown(s.dispose);
    TrainingRoutine? saved;
    await tester.pumpWidget(
      _app(
        RoutineEditorPage(
          catalog: catalog,
          store: s,
          seedDrillIds: const ['forearms-A'],
          onBack: () {},
          onSaved: (routine) => saved = routine,
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const ValueKey('routine-name')), '周三');
    await tester.tap(find.byKey(const ValueKey('routine-add')));
    await tester.pumpAndSettle();
    // Already in the set: shown, but not selectable twice.
    Future<void> pick(String id) async {
      await tester.enterText(
        find.byKey(const ValueKey('picker-search')),
        catalog.drillById(id)!.name,
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(ValueKey('pick-$id')));
    }

    await pick('forearms-A');
    await pick('abs-A');
    await pick('deltoids-A');
    await tester.pump();
    expect(find.text('已选 2 个'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('picker-done')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('edit-abs-A')), findsOneWidget);
    await tester.tap(
      find.descendant(
        of: find.byKey(const ValueKey('edit-forearms-A')),
        matching: find.byTooltip('移出计划'),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('routine-save')));
    await tester.pumpAndSettle();
    expect(saved?.name, '周三');
    expect(s.routines.single.drillIds, ['abs-A', 'deltoids-A']);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    await tester.pump(const Duration(seconds: 1));
  });
}
