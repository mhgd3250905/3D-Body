import 'package:flare/ui/drill_media.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'flow_regressions_test.dart' show phoneSize, testApp;

void main() {
  for (final brightness in Brightness.values) {
    testWidgets('only changed demonstration cards rebuild in $brightness', (
      tester,
    ) async {
      await phoneSize(tester);
      final coordinator = DrillPlaybackCoordinator.shared;
      FlareColors.use(brightness);
      addTearDown(() => FlareColors.use(Brightness.dark));
      await tester.pumpWidget(
        testApp(
          Theme(
            data: flareTheme(brightness),
            child: Scaffold(
              body: Column(
                children: [
                  for (var i = 0; i < 3; i++)
                    Row(
                      children: [
                        SizedBox.square(
                          dimension: 72,
                          child: DrillMediaCard(
                            key: ValueKey('media-$i'),
                            drillId: 'forearms-A',
                          ),
                        ),
                        for (var j = 0; j < 2; j++)
                          SizedBox.square(
                            dimension: 60,
                            child: DrillMediaCard(
                              key: ValueKey('thumbnail-$i-$j'),
                              drillId: 'forearms-A',
                              thumbnail: true,
                              active: false,
                            ),
                          ),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final cards = [
        for (var i = 0; i < 3; i++)
          tester.state(find.byKey(ValueKey('media-$i'))),
      ];
      final rebuilt = <Key?>[];
      final previousHook = debugOnRebuildDirtyWidget;
      debugOnRebuildDirtyWidget = (element, alreadyBuilt) {
        previousHook?.call(element, alreadyBuilt);
        if (element.widget is DrillMediaCard) {
          rebuilt.add(element.widget.key);
        }
      };
      final counts = <int>[];
      try {
        for (final card in cards) {
          rebuilt.clear();
          coordinator.play(card);
          await tester.pump();
          counts.add(rebuilt.length);
        }
        rebuilt.clear();
        coordinator.pauseAll();
        await tester.pump();
        counts.add(rebuilt.length);
        expect(coordinator.owner, isNull);
        expect(coordinator.held, same(cards.last));
      } finally {
        debugOnRebuildDirtyWidget = previousHook;
        await tester.pumpWidget(const SizedBox());
      }
      expect(counts, [
        1,
        2,
        3,
        2,
      ], reason: 'Play, switch, evict one held card, and pause');
    });
  }
}
