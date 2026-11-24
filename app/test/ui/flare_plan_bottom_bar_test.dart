import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/flare_plan_detail_page.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage, phoneSize;

void main() {
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final brightness in Brightness.values) {
    for (final angle in [true, false]) {
      final kind = angle ? 'angle' : 'muscle';
      testWidgets(
        'the $kind plan last row clears its solid footer in $brightness',
        (tester) async {
          await phoneSize(tester);
          const gestureInset = 34.0;
          tester.view.padding = const FakeViewPadding(bottom: gestureInset);
          tester.view.viewPadding = const FakeViewPadding(bottom: gestureInset);
          addTearDown(tester.view.resetPadding);
          addTearDown(tester.view.resetViewPadding);
          FlareColors.use(brightness);

          final catalog = loadCatalogFixture(includeFlarePlans: true);
          final store = LearningStore(
            catalog: catalog,
            storage: MemoryStateStorage(),
          );
          addTearDown(store.dispose);
          await store.initialize();
          final plans = angle
              ? catalog.plansForAngle(11)
              : catalog.plansForMuscle('deltoids');
          final plan = plans.firstWhere((item) => item.tier == 1);
          var startCount = 0;
          var warmupCount = 0;
          await tester.pumpWidget(
            MaterialApp(
              theme: flareTheme(brightness),
              localizationsDelegates: AppLocalizations.localizationsDelegates,
              supportedLocales: AppLocalizations.supportedLocales,
              home: FlarePlanDetailPage(
                title: 'Plan detail',
                phase: angle ? catalog.phaseBySource(11) : null,
                plans: plans,
                selectedTier: plan.tier,
                catalog: catalog,
                store: store,
                onTierChanged: (_) {},
                onMuscle: (_) {},
                onDrill: (_) {},
                onBack: () {},
                onStart: (selected) {
                  expect(selected, same(plan));
                  startCount++;
                },
                onOpenWarmup: angle ? () => warmupCount++ : null,
              ),
            ),
          );
          await tester.pumpAndSettle();

          final nav = tester.widget<FlareScrollNav>(
            find.byType(FlareScrollNav),
          );
          final frame = nav.child as Column;
          expect(frame.children.first, isA<Expanded>());
          final footer = find.byWidget(frame.children.last);
          final footerSurface = find
              .descendant(of: footer, matching: find.byType(ColoredBox))
              .first;
          final footerRect = tester.getRect(footer);
          expect(tester.getRect(footerSurface), footerRect);
          final footerColor = tester.widget<ColoredBox>(footerSurface).color;
          expect(footerColor, FlareColors.background);
          expect(footerColor.a, 1);

          final viewport = find.byWidgetPredicate(
            (widget) =>
                widget is ListView && widget.scrollDirection == Axis.vertical,
          );
          final list = tester.widget<ListView>(viewport);
          final verticalScroll = find
              .descendant(of: viewport, matching: find.byType(Scrollable))
              .first;
          final last = plan.items.last.drillForScene(store.settings.tier);
          final lastRow = find.byKey(
            ValueKey('flare-plan-item-${plan.items.length - 1}-$last'),
          );
          if (lastRow.evaluate().isEmpty) {
            await tester.scrollUntilVisible(
              lastRow,
              180,
              scrollable: verticalScroll,
            );
          }
          final position = list.controller!.position;
          expect(position.maxScrollExtent, greaterThan(0));
          position.jumpTo(position.maxScrollExtent);
          await tester.pumpAndSettle();

          final lastRect = tester.getRect(lastRow);
          final listRect = tester.getRect(viewport);
          expect(listRect.bottom, footerRect.top);
          expect(lastRect.top, greaterThan(listRect.top));
          expect(footerRect.top - lastRect.bottom, closeTo(24, .01));
          expect(lastRow.hitTestable(), findsOneWidget);

          final start = find.byKey(const ValueKey('flare-plan-start'));
          expect(
            footerRect.bottom - tester.getRect(start).bottom,
            gestureInset + 12,
          );
          expect(start.hitTestable(), findsOneWidget);
          await tester.tap(start);
          expect(startCount, 1);
          final warmup = find.byType(FlarePlanWarmupLink);
          if (angle) {
            expect(warmup.hitTestable(), findsOneWidget);
            await tester.tap(warmup);
            expect(warmupCount, 1);
          } else {
            expect(warmup, findsNothing);
            expect(footerRect.top, tester.getTopLeft(start).dy);
          }
          await tester.pumpAndSettle();
          expect(tester.takeException(), isNull);
        },
      );
    }
  }
}
