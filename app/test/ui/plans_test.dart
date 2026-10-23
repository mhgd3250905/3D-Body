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
  final catalog = loadCatalogFixture();

  Future<LearningStore> store() async {
    final s = LearningStore(catalog: catalog, storage: _Memory());
    await s.initialize();
    await s.acknowledgeSafety();
    return s;
  }

  testWidgets('scene switch turns every preset into that scene', (
    tester,
  ) async {
    _phone(tester);
    final s = await store();
    addTearDown(s.dispose);
    PresetPlan? opened;
    var created = 0;
    await tester.pumpWidget(
      _app(
        AnimatedBuilder(
          animation: s,
          builder: (_, _) => PlansPage(
            catalog: catalog,
            store: s,
            onPreset: (preset) => opened = preset,
            onRoutine: (_) {},
            onNewRoutine: () => created++,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('成套训练'), findsOneWidget);
    await tester.tap(find.text('健身房'));
    await tester.pumpAndSettle();
    expect(s.settings.tier, 'C');
    await tester.tap(find.byKey(const ValueKey('preset-warmup')));
    expect(opened?.id, 'warmup');
    expect(
      opened!.drills(catalog, s.settings.tier).every((d) => d.tier == 'C'),
      isTrue,
    );
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('plan-new')),
      300,
    );
    await tester.tap(find.byKey(const ValueKey('plan-new')));
    expect(created, 1);
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

  testWidgets('run hub shows progress, next drill, and a finished state', (
    tester,
  ) async {
    _phone(tester);
    final drills = PresetPlan.all.first.drills(catalog, 'A');
    var started = 0, skipped = 0;
    await tester.pumpWidget(
      _app(
        PlanRunPage(
          title: '热身激活',
          drills: drills,
          done: const {0},
          index: 1,
          onStart: () => started++,
          onSelect: (_) {},
          onSkip: () => skipped++,
          onFinish: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('完成 1 / 4 个动作'), findsOneWidget);
    expect(find.text('第 2 / 4 个'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('run-start')));
    await tester.tap(find.byKey(const ValueKey('run-skip')));
    expect((started, skipped), (1, 1));
    await tester.pumpWidget(
      _app(
        PlanRunPage(
          title: '热身激活',
          drills: drills,
          done: const {0, 1, 2, 3},
          index: 4,
          onStart: () {},
          onSelect: (_) {},
          onSkip: () {},
          onFinish: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('这一套练完了'), findsOneWidget);
    expect(find.byKey(const ValueKey('run-skip')), findsNothing);
    expect(tester.takeException(), isNull);
  });
}
