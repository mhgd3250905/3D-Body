import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/motion_controls.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show testApp;

void main() {
  testWidgets('rendered playhead crosses the segment gap continuously', (
    tester,
  ) async {
    final catalog = loadCatalogFixture();
    final scene = SceneController(commandSink: (_) {});
    addTearDown(scene.dispose);
    scene.receiveEvent({'source': 'flare-scene', 'type': 'ready'});
    scene.play();
    await tester.pumpWidget(
      testApp(
        Center(
          child: SizedBox(
            width: 348,
            child: MotionTimeline(
              catalog: catalog,
              time: scene.time,
              phase: scene.phase,
              playhead: scene.playhead,
              onSeek: scene.setTime,
            ),
          ),
        ),
      ),
    );
    final timeline = find.byType(MotionTimeline);
    final thumb = find.byKey(const ValueKey('motion-timeline-thumb'));
    double thumbX() =>
        tester.getCenter(thumb).dx - tester.getRect(timeline).left;
    List<double> fill() => tester
        .widgetList<LinearProgressIndicator>(
          find.descendant(
            of: timeline,
            matching: find.byType(LinearProgressIndicator),
          ),
        )
        .map((indicator) => indicator.value!)
        .take(2)
        .toList();
    double clockTime(double x) {
      // At this width a segment is 40 px. The next tick is 44 px away.
      return catalog.phaseTime(9) +
          (catalog.phaseTime(10) - catalog.phaseTime(9)) * ((x - 20) / 44);
    }

    Future<void> showFrame(double x, int revision) async {
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'playhead',
        'clockRevision': revision,
        'time': clockTime(x),
      });
      await tester.pump(const Duration(milliseconds: 16));
    }

    for (final x in [38.0, 40.0, 42.0, 44.0, 46.0]) {
      await showFrame(x, 1);
      expect(thumbX(), closeTo(x, .001));
      expect(fill()[0], closeTo((x / 40).clamp(0, 1), .001));
      expect(fill()[1], closeTo(((x - 44) / 40).clamp(0, 1), .001));
    }

    scene.pause();
    // Both messages were queued by the WebView before it handled Pause.
    expect(
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'clockRevision': 1,
        'time': clockTime(47),
        'playing': true,
      }),
      isFalse,
    );
    await showFrame(48, 1);
    expect(scene.playing, isFalse);
    expect(thumbX(), closeTo(46, .001));
    scene.play();
    // A late pause acknowledgement cannot rewind the resumed clock.
    expect(
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'clockRevision': 2,
        'time': clockTime(45),
        'playing': false,
      }),
      isFalse,
    );
    await showFrame(45, 1);
    expect(scene.playing, isTrue);
    expect(thumbX(), closeTo(46, .001));
    await showFrame(48, 3);
    expect(thumbX(), closeTo(48, .001));
    await tester.pumpWidget(const SizedBox.shrink());
  });

  testWidgets('phase number and name share a 180 ms crossfade', (tester) async {
    Future<void> showPhase(int phase, String name) => tester.pumpWidget(
      testApp(
        Center(
          child: SizedBox(
            width: 300,
            child: MotionPhaseLabel(phase: phase, child: Text('$phase $name')),
          ),
        ),
      ),
    );

    await showPhase(14, '换手');
    await showPhase(15, '第二侧支撑');
    final old = find.text('14 换手');
    final current = find.text('15 第二侧支撑');
    double opacity(Finder label) => tester
        .widget<FadeTransition>(
          find.ancestor(of: label, matching: find.byType(FadeTransition)).first,
        )
        .opacity
        .value;

    await tester.pump(const Duration(milliseconds: 90));
    expect(opacity(old), closeTo(.5, .01));
    expect(opacity(current), closeTo(.5, .01));
    await tester.pump(const Duration(milliseconds: 90));
    expect(opacity(current), closeTo(1, .001));
    if (old.evaluate().isNotEmpty) expect(opacity(old), closeTo(0, .001));
    await tester.pumpAndSettle(const Duration(milliseconds: 1));
    expect(old, findsNothing);
    expect(opacity(current), 1);
  });
}
