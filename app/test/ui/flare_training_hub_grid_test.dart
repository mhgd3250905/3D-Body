import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/components.dart' show FlareSegmented;
import 'package:flare/ui/flare_training_hub_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show phoneSize, testApp;

void main() {
  for (final brightness in Brightness.values) {
    testWidgets(
      'muscle grid shows its last cell above the action in ${brightness.name}',
      (tester) async {
        await phoneSize(tester);
        tester.view.physicalSize = const Size(390, 710);
        tester.view.padding = const FakeViewPadding(bottom: 34);
        tester.view.viewPadding = tester.view.padding;
        addTearDown(tester.view.resetPadding);
        addTearDown(tester.view.resetViewPadding);
        final previousPalette = FlareColors.palette;
        addTearDown(() => FlareColors.palette = previousPalette);
        FlareColors.use(brightness);
        final catalog = loadCatalogFixture(includeFlarePlans: true);
        String? openedMuscle;
        await tester.pumpWidget(
          testApp(
            Theme(
              data: flareTheme(brightness),
              child: Scaffold(
                body: FlareTrainingHubPage(
                  catalog: catalog,
                  actorBody: 'snow',
                  quality: 'balanced',
                  enableScene: false,
                  initialTime: 0,
                  initialMuscles: true,
                  visible: true,
                  onBack: () {},
                  onAngle: (_) {},
                  onMuscle: (group) => openedMuscle = group.id,
                ),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();

        final grid = find.byKey(const PageStorageKey('support'));
        final scrollable = find.descendant(
          of: grid,
          matching: find.byType(Scrollable),
        );
        ScrollPosition position() =>
            tester.state<ScrollableState>(scrollable).position;
        expect(position().maxScrollExtent, greaterThan(0));
        expect(
          find.ancestor(of: grid, matching: find.byType(ShaderMask)),
          findsNothing,
        );
        position().jumpTo(position().maxScrollExtent);
        await tester.pumpAndSettle();
        final endOffset = position().pixels;

        final group = catalog.groups.lastWhere(
          (group) => group.section == 'support',
        );
        final tile = find.byKey(ValueKey('hub-muscle-${group.id}'));
        final gridRect = tester.getRect(grid);
        final tileRect = tester.getRect(tile);
        expect(tileRect.top, greaterThanOrEqualTo(gridRect.top));
        expect(gridRect.bottom - tileRect.bottom, closeTo(24, .01));
        expect(tile.hitTestable(), findsOneWidget);
        await tester.tap(tile);
        await tester.pumpAndSettle();

        final sections = tester.widget<FlareSegmented<String>>(
          find.byKey(const ValueKey('hub-sections')),
        );
        for (final section in ['core', 'support']) {
          final label = sections.segments
              .firstWhere((segment) => segment.$1 == section)
              .$2;
          await tester.tap(find.bySemanticsLabel(label));
          await tester.pumpAndSettle();
        }
        expect(position().pixels, closeTo(endOffset, .01));
        expect(tile.hitTestable(), findsOneWidget);

        final hub = find.byType(FlareTrainingHubPage);
        final strings = AppLocalizations.of(tester.element(hub));
        final action = find.bySemanticsLabel(
          strings.hubViewNamedPlan(group.shortLabel),
        );
        expect(action.hitTestable(), findsOneWidget);
        expect(tester.getRect(action).top, greaterThan(gridRect.bottom));
        expect(tester.getRect(action).bottom, lessThanOrEqualTo(710 - 34));
        await tester.tap(action);
        await tester.pumpAndSettle();
        expect(openedMuscle, group.id);
        expect(tester.takeException(), isNull);
      },
    );
  }
}
