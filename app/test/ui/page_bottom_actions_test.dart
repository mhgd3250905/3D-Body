import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/sdk_plan_editor_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage;

const _phone = Size(390, 640);
const _gestureInset = 34.0;

Future<void> _show(
  WidgetTester tester,
  Brightness brightness,
  Widget page,
) async {
  tester.view.physicalSize = _phone;
  tester.view.devicePixelRatio = 1;
  tester.view.padding = const FakeViewPadding(bottom: _gestureInset);
  tester.view.viewPadding = const FakeViewPadding(bottom: _gestureInset);
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    MaterialApp(
      theme: flareTheme(brightness),
      locale: const Locale('zh'),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      builder: (context, child) {
        FlareColors.use(Theme.of(context).brightness);
        return child!;
      },
      home: Scaffold(body: SafeArea(top: false, child: page)),
    ),
  );
  await tester.pumpAndSettle();
}

Finder _verticalScroll(Finder scope) => find
    .descendant(
      of: scope,
      matching: find.byWidgetPredicate(
        (widget) =>
            widget is Scrollable && widget.axisDirection == AxisDirection.down,
      ),
    )
    .first;

Future<void> _expectFooter(
  WidgetTester tester, {
  required Finder scope,
  required Finder lastItem,
  required Color background,
}) async {
  final scrollable = _verticalScroll(scope);
  await tester.scrollUntilVisible(lastItem, 220, scrollable: scrollable);
  await tester.pumpAndSettle();
  final position = tester.state<ScrollableState>(scrollable).position;
  expect(position.maxScrollExtent, greaterThan(0));
  position.jumpTo(position.maxScrollExtent);
  await tester.pumpAndSettle();

  final footer = find.descendant(
    of: scope,
    matching: find.byType(FlareBottomAction),
  );
  final footerChildren = <Widget>[];
  tester
      .element(footer)
      .visitChildElements((element) => footerChildren.add(element.widget));
  expect(
    footerChildren.single,
    isA<ColoredBox>().having((box) => box.color, 'color', background),
  );
  final footerRect = tester.getRect(footer);
  final viewport = tester.getRect(scrollable);
  final lastRect = tester.getRect(lastItem);
  expect(footerRect.top, closeTo(viewport.bottom, 0.01));
  expect(footerRect.bottom, closeTo(_phone.height - _gestureInset, 0.01));
  expect(lastRect.top, greaterThanOrEqualTo(viewport.top));
  expect(footerRect.top - lastRect.bottom, closeTo(24, 0.01));
  expect(lastItem.hitTestable(), findsOneWidget);
  expect(tester.takeException(), isNull);
}

void main() {
  final catalog = loadCatalogFixture(includeFlarePlans: true);
  final drills = catalog.drills
      .where((drill) => drill.dose.mode != DoseMode.manual)
      .take(12)
      .toList();
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final brightness in Brightness.values) {
    testWidgets(
      'custom plan footer stays below the full last drill in ${brightness.name}',
      (tester) async {
        var started = 0;
        Drill? opened;
        await _show(
          tester,
          brightness,
          PlanDetailPage(
            title: 'Plan',
            drills: drills,
            catalog: catalog,
            onOpenWarmup: () {},
            onBack: () {},
            onStart: () => started++,
            onDrill: (drill) => opened = drill,
          ),
        );
        final last = find.byKey(ValueKey('plan-row-${drills.last.id}'));
        await _expectFooter(
          tester,
          scope: find.byType(FlareNavPage),
          lastItem: last,
          background: FlareColors.background,
        );
        await tester.tap(last);
        expect(opened, drills.last);
        await tester.tap(find.byKey(const ValueKey('plan-start')));
        expect(started, 1);
      },
    );

    testWidgets(
      'drill footer stays below the expanded final section in ${brightness.name}',
      (tester) async {
        var started = 0;
        var added = 0;
        final drill = drills.first;
        await _show(
          tester,
          brightness,
          DrillDetailPage(
            drill: drill,
            onBack: () {},
            onStart: () => started++,
            onAddToPlan: () => added++,
          ),
        );
        final scope = find.byType(FlareNavPage);
        final disclosure = find.byType(Disclosure);
        await tester.scrollUntilVisible(
          disclosure,
          160,
          scrollable: _verticalScroll(scope),
        );
        await tester.pumpAndSettle();
        expect(disclosure.hitTestable(), findsOneWidget);
        await tester.tap(disclosure);
        await tester.pumpAndSettle();
        final strings = AppLocalizations.of(tester.element(scope));
        expect(find.text(strings.safety), findsOneWidget);
        await _expectFooter(
          tester,
          scope: scope,
          lastItem: disclosure,
          background: FlareColors.background,
        );
        await tester.tap(find.byKey(const ValueKey('drill-add-to-plan')));
        await tester.tap(
          find.descendant(
            of: find.byType(FlareBottomAction),
            matching: find.byType(PrimaryAction),
          ),
        );
        expect(added, 1);
        expect(started, 1);
      },
    );

    testWidgets(
      'routine editor footer stays below the last row in ${brightness.name}',
      (tester) async {
        final store = LearningStore(
          catalog: catalog,
          storage: MemoryStateStorage(),
        );
        addTearDown(store.dispose);
        await store.initialize();
        final ids = drills.map((drill) => drill.id).toList();
        TrainingRoutine? saved;
        await _show(
          tester,
          brightness,
          RoutineEditorPage(
            catalog: catalog,
            store: store,
            seedDrillIds: ids,
            onBack: () {},
            onSaved: (routine) => saved = routine,
          ),
        );
        await _expectFooter(
          tester,
          scope: find.byType(FlareNavPage),
          lastItem: find.byKey(const ValueKey('routine-add')),
          background: FlareColors.background,
        );
        await tester.tap(find.byKey(const ValueKey('routine-save')));
        await tester.pumpAndSettle();
        expect(saved?.drillIds, ids);
        await tester.pump(const Duration(milliseconds: 120));
      },
    );

    testWidgets('drill picker footer matches the sheet in ${brightness.name}', (
      tester,
    ) async {
      List<String>? picked;
      await _show(
        tester,
        brightness,
        Builder(
          builder: (context) => TextButton(
            onPressed: () async {
              picked = await showDrillPicker(
                context,
                catalog: catalog,
                initialTier: 'A',
              );
            },
            child: const Text('Open picker'),
          ),
        ),
      );
      await tester.tap(find.text('Open picker'));
      await tester.pumpAndSettle();
      final last = catalog
          .searchDrills('', tier: 'A', includeStraightLegFlare: true)
          .last;
      final lastCard = find.byKey(ValueKey('pick-${last.id}'));
      await _expectFooter(
        tester,
        scope: find.byType(BottomSheet),
        lastItem: lastCard,
        background: FlareColors.palette.sheet,
      );
      await tester.tap(lastCard);
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('picker-done')));
      await tester.pumpAndSettle();
      expect(picked, [last.id]);
    });

    testWidgets(
      'SDK plan editor footer stays below the final block in ${brightness.name}',
      (tester) async {
        final plan = trainingPlanFromDrills(title: 'SDK plan', drills: drills);
        uc.TrainingPlan? saved;
        await _show(
          tester,
          brightness,
          SdkPlanEditorPage(
            plan: plan,
            catalog: catalog,
            onBack: () {},
            onSaved: (value) async {
              saved = value;
              return true;
            },
          ),
        );
        await _expectFooter(
          tester,
          scope: find.byType(FlareNavPage),
          lastItem: find.byKey(
            ValueKey('sdk-plan-add-${plan.blocks.length - 1}'),
          ),
          background: FlareColors.background,
        );
        await tester.tap(find.byKey(const ValueKey('sdk-plan-save')));
        await tester.pumpAndSettle();
        expect(saved?.toJson(), plan.toJson());
      },
    );
  }
}
