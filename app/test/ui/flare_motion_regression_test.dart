import 'dart:async';

import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/motion_controls.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage, phoneSize;

void main() {
  for (final brightness in Brightness.values) {
    testWidgets(
      'scrubbing saves once without rebuilding the shell ($brightness)',
      (tester) async {
        await phoneSize(tester);
        final catalog = loadCatalogFixture(includeFlarePlans: true);
        final storage = _CountStorage();
        final store = LearningStore(catalog: catalog, storage: storage);
        await store.initialize();
        await store.acknowledgeSafety();
        final scene = SceneController(commandSink: (_) {});
        addTearDown(store.dispose);
        addTearDown(scene.dispose);
        final oldHook = debugOnRebuildDirtyWidget;
        var shellBuilds = 0;
        debugOnRebuildDirtyWidget = (element, builtOnce) {
          if (element.widget is FlareShell) shellBuilds++;
        };
        addTearDown(() => debugOnRebuildDirtyWidget = oldHook);
        await tester.pumpWidget(
          MaterialApp(
            theme: flareTheme(brightness),
            locale: const Locale('zh'),
            localizationsDelegates: AppLocalizations.localizationsDelegates,
            supportedLocales: AppLocalizations.supportedLocales,
            home: FlareShell(
              catalog: catalog,
              store: store,
              sceneController: scene,
              enableScene: false,
            ),
          ),
        );
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'ready',
          'period': 9,
        });
        await tester.pumpAndSettle();
        final timeline = tester.getRect(find.byType(MotionTimeline));
        final drag = await tester.startGesture(
          Offset(timeline.left + 2, timeline.center.dy),
        );
        await drag.moveBy(const Offset(24, 0));
        await tester.pump(const Duration(milliseconds: 16));
        final initialBuilds = shellBuilds;
        final initialWrites = storage.writes;
        for (var index = 0; index < catalog.phases.length; index++) {
          final phase = catalog.phases[index].source;
          await drag.moveTo(
            Offset(
              timeline.left +
                  timeline.width * (index + .5) / catalog.phases.length,
              timeline.center.dy,
            ),
          );
          scene.receiveEvent({
            'source': 'flare-scene',
            'type': 'state',
            'phase': phase,
            'playing': false,
          });
          await tester.pump(const Duration(milliseconds: 16));
          expect(
            tester.widget<MotionTimeline>(find.byType(MotionTimeline)).phase,
            phase,
          );
        }
        final duringBuilds = shellBuilds - initialBuilds;
        final duringWrites = storage.writes - initialWrites;
        await drag.up();
        await tester.pumpAndSettle();
        final writes = storage.writes - initialWrites;
        debugPrint(
          'scrub profile $brightness: [$duringBuilds, $duringWrites, $writes]',
        );
        expect([duringBuilds, duringWrites, writes], [0, 0, 1]);
        expect(store.lastTime, scene.time);
      },
    );

    testWidgets('entrance waits for Navigator to finish ($brightness)', (
      tester,
    ) async {
      final probe = _ProbeCounts();
      final content = _ContentProbe(counts: probe);
      final target = find.byWidget(content);
      await tester.pumpWidget(
        MaterialApp(theme: flareTheme(brightness), home: const Scaffold()),
      );
      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      final route = PageRouteBuilder<void>(
        pageBuilder: (_, _, _) => FadeSlideIn(child: content),
        transitionDuration: const Duration(milliseconds: 300),
      );
      unawaited(navigator.push(route));
      await tester.pump();
      await tester.pump();
      final initialY = tester.getTopLeft(target).dy;
      await tester.pump(const Duration(milliseconds: 180));
      expect(route.animation!.status, AnimationStatus.forward);
      expect(tester.getTopLeft(target).dy, initialY);
      await tester.pumpAndSettle();
      expect(tester.getTopLeft(target).dy, 0);
      expect([probe.mounts, probe.builds, probe.paints], [1, 1, 1]);
    });

    testWidgets(
      'entrance waits for the route and retains its content ($brightness)',
      (tester) async {
        final active = ValueNotifier(false);
        addTearDown(active.dispose);
        final probe = _ProbeCounts();
        final content = _ContentProbe(counts: probe);
        final contentFinder = find.byWidget(content);
        await tester.pumpWidget(
          MaterialApp(
            theme: flareTheme(brightness),
            home: Scaffold(
              body: ValueListenableBuilder(
                valueListenable: active,
                builder: (context, show, _) => FlareStage(
                  pageKey: show ? 'details' : 'home',
                  depth: show ? 1 : 0,
                  child: show
                      ? FadeSlideIn(
                          delay: const Duration(milliseconds: 64),
                          child: content,
                        )
                      : const SizedBox.expand(),
                ),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        active.value = true;
        await tester.pump();
        final initialY = tester.getTopLeft(contentFinder).dy;
        var overlapFrames = 0;
        for (var frame = 1; frame <= 49; frame++) {
          await tester.pump(const Duration(milliseconds: 16));
          if (frame < 25 &&
              tester.getTopLeft(contentFinder).dy < initialY - .001) {
            overlapFrames++;
          }
        }
        await tester.pumpAndSettle();
        final metrics = <int>[
          overlapFrames,
          probe.mounts,
          probe.builds,
          probe.paints,
        ];
        debugPrint('entrance profile $brightness: $metrics');
        expect(metrics, [0, 1, 1, 1]);
        expect(tester.getTopLeft(contentFinder).dy, 0);
      },
    );
  }
}

class _CountStorage extends MemoryStateStorage {
  int writes = 0;

  @override
  Future<void> write(String key, String value) async {
    writes++;
    await super.write(key, value);
  }
}

class _ProbeCounts {
  int mounts = 0;
  int builds = 0;
  int paints = 0;
}

class _ContentProbe extends StatefulWidget {
  const _ContentProbe({required this.counts});

  final _ProbeCounts counts;

  @override
  State<_ContentProbe> createState() => _ContentProbeState();
}

class _ContentProbeState extends State<_ContentProbe> {
  @override
  void initState() {
    super.initState();
    widget.counts.mounts++;
  }

  @override
  Widget build(BuildContext context) {
    widget.counts.builds++;
    return CustomPaint(
      painter: _PaintProbe(widget.counts),
      child: const SizedBox.expand(),
    );
  }
}

class _PaintProbe extends CustomPainter {
  const _PaintProbe(this.counts);

  final _ProbeCounts counts;

  @override
  void paint(Canvas canvas, Size size) {
    counts.paints++;
    canvas.drawRect(Offset.zero & size, Paint()..color = Colors.orange);
  }

  @override
  bool shouldRepaint(_PaintProbe oldDelegate) => false;
}
