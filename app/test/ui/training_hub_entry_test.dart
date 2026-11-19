import 'dart:async';

import 'package:flare/control/learning_store.dart';
import 'package:flare/platform/scene/scene.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/flare_training_hub_page.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/motion_controls.dart';
import 'package:flare/ui/page_kit.dart' show FlareBackChip;
import 'package:flare/ui/plans_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart'
    show MemoryStateStorage, openPlansFromHome, phoneSize, testApp;

void main() {
  const actorStage = ValueKey('hub-stage-gesture');
  const fallback = ValueKey('hub-stage-loading-frame');
  final catalog = loadCatalogFixture();

  testWidgets('home controls share the hub slide and follow an edge swipe', (
    tester,
  ) async {
    await phoneSize(tester);
    final store = LearningStore(
      catalog: catalog,
      storage: MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    addTearDown(store.dispose);
    await tester.pumpWidget(
      testApp(FlareShell(catalog: catalog, store: store, enableScene: false)),
    );
    await tester.pumpAndSettle();

    final header = find.byKey(const ValueKey('home-menu-chip'));
    final button = find.byKey(const ValueKey('home-go-to-training'));
    final timeline = find.descendant(
      of: find.byKey(const ValueKey('transport')),
      matching: find.byType(MotionTimeline),
    );
    final hub = find.byType(FlareTrainingHubPage);
    final headerHome = tester.getTopLeft(header);
    final buttonHome = tester.getTopLeft(button);
    final timelineHome = tester.getTopLeft(timeline);
    final buttonElement = tester.element(button);

    double alpha(FlareHomeChromePart part) => tester
        .widget<Opacity>(
          find
              .descendant(
                of: find.byWidgetPredicate(
                  (widget) => widget is FlareHomeChrome && widget.part == part,
                ),
                matching: find.byType(Opacity),
              )
              .first,
        )
        .opacity;

    await tester.tap(button);
    await tester.pump();
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 40));
    final entered = 1 - tester.getTopLeft(hub).dx / 390;
    expect(entered, inExclusiveRange(.12, .6));
    expect(tester.element(button), same(buttonElement));
    expect(tester.getTopLeft(header).dx, headerHome.dx);
    expect(
      tester.getTopLeft(header).dy,
      closeTo(headerHome.dy - 8 * entered, .01),
    );
    expect(
      tester.getTopLeft(button).dx,
      closeTo(
        buttonHome.dx - 390 * .9 * const Interval(.06, 1).transform(entered),
        .01,
      ),
    );
    expect(
      tester.getTopLeft(timeline).dx,
      closeTo(
        timelineHome.dx - 390 * .9 * const Interval(.12, 1).transform(entered),
        .01,
      ),
    );
    expect(
      alpha(FlareHomeChromePart.header),
      closeTo(1 - const Interval(0, .6).transform(entered), .001),
    );
    await tester.pumpAndSettle();
    expect(button, findsNothing);
    expect(
      tester.element(
        find.byKey(const ValueKey('home-go-to-training'), skipOffstage: false),
      ),
      same(buttonElement),
    );

    final swipe = await tester.startGesture(const Offset(3, 310));
    await swipe.moveBy(const Offset(24, 0));
    await swipe.moveBy(const Offset(260, 0));
    await tester.pump();
    final returned = tester.getTopLeft(hub).dx / 390;
    expect(returned, inExclusiveRange(.55, .95));
    expect(tester.element(button), same(buttonElement));
    expect(
      tester.getTopLeft(header).dy,
      closeTo(headerHome.dy - 8 * (1 - returned), .01),
    );
    expect(
      tester.getTopLeft(timeline).dx,
      closeTo(timelineHome.dx - 390 * .9 * (1 - returned), .01),
    );
    expect(
      tester.getTopLeft(button).dx,
      closeTo(
        buttonHome.dx -
            390 * .9 * (1 - const Interval(.12, 1).transform(returned)),
        .01,
      ),
    );
    expect(
      alpha(FlareHomeChromePart.timeline),
      closeTo(const Interval(.4, 1).transform(returned), .001),
    );
    final dragPosition = tester.getTopLeft(button);
    await swipe.up();
    await tester.pump();
    expect(tester.getTopLeft(button), dragPosition);
    await tester.pumpAndSettle();
    expect(hub, findsNothing);
    expect(tester.element(button), same(buttonElement));
    expect(tester.getTopLeft(button), buttonHome);
    expect(tester.getTopLeft(header), headerHome);
    expect(tester.getTopLeft(timeline), timelineHome);
  });

  testWidgets('the hub retains the live angle while entering and returning', (
    tester,
  ) async {
    await phoneSize(tester);
    tester.view.physicalSize = const Size(390, 620);
    const safeArea = FakeViewPadding(top: 54, bottom: 34);
    tester.view.padding = safeArea;
    tester.view.viewPadding = safeArea;
    addTearDown(tester.view.resetPadding);
    addTearDown(tester.view.resetViewPadding);
    final store = LearningStore(
      catalog: catalog,
      storage: MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    final commands = <Map<String, Object?>>[];
    final scene = SceneController(commandSink: commands.add);
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    await tester.pumpWidget(
      testApp(
        FlareShell(catalog: catalog, store: store, sceneController: scene),
      ),
    );
    expect(find.byType(SceneLoading), findsOneWidget);
    scene.receiveEvent({'source': 'flare-scene', 'type': 'ready', 'period': 9});
    await tester.pumpAndSettle();
    final presentation = commands.lastWhere(
      (command) => command['type'] == 'present',
    );
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'presented',
      'requestId': presentation['requestId'],
      'time': 2,
      'phase': 11,
    });
    await tester.pumpAndSettle();

    final home = find.byWidgetPredicate(
      (widget) => widget is SceneView && widget.controller == scene,
    );
    final mountedHome = tester.element(home);
    final homeFrame = tester.getRect(home);
    void expectFixedCanvas() {
      expect(tester.element(home), same(mountedHome));
      expect(tester.getRect(home), homeFrame);
    }

    await tester.tap(find.byKey(const ValueKey('home-go-to-training')));
    await tester.pump();
    expect(find.byKey(actorStage), findsOneWidget);
    expect(find.byKey(fallback), findsNothing);
    expect(find.byType(SceneView), findsOneWidget);
    expectFixedCanvas();
    final entry = commands.lastWhere(
      (command) => command['type'] == 'hub_flight',
    );
    expect(entry['duration'], 650);

    // The controls are still sliding in, but the retained actor already
    // covers the destination's steady hit region.
    await tester.dragFrom(const Offset(195, 230), const Offset(92, 0));
    await tester.pump(const Duration(milliseconds: 32));
    final entryProgress =
        1 - tester.getTopLeft(find.byType(FlareTrainingHubPage)).dx / 390;
    final cardPose = commands.lastWhere(
      (command) => command['type'] == 'home_chrome',
    );
    expect(cardPose['x'], closeTo(-390 * .9 * entryProgress, .01));
    expect(
      cardPose['opacity'],
      closeTo(1 - const Interval(0, .6).transform(entryProgress), .001),
    );
    final hub = tester.state<FlareTrainingHubPageState>(
      find.byType(FlareTrainingHubPage),
    );
    expect(hub.angleYaw, isNot(0));
    expect(
      commands.lastWhere(
        (command) => command['type'] == 'hub_flight_angle',
      )['yaw'],
      hub.angleYaw,
    );

    await tester.binding.handlePopRoute();
    await tester.pump();
    final reverse = commands.lastWhere(
      (command) => command['type'] == 'hub_flight_reverse',
    );
    expect(reverse['id'], isNot(entry['id']));
    expectFixedCanvas();
    expect(
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'hub_flight_done',
        'id': entry['id'],
      }),
      isFalse,
      reason: 'The retired entry frame cannot present over the return',
    );
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'hub_flight_done',
      'id': reverse['id'],
    });
    await tester.pumpAndSettle();
    expect(find.byType(FlareTrainingHubPage), findsNothing);
    expectFixedCanvas();

    // Finish a second entry and hold the hub's presentation response while
    // the home stage is still mounted behind it.
    await tester.tap(find.byKey(const ValueKey('home-go-to-training')));
    await tester.pump();
    final secondEntry = commands.lastWhere(
      (command) => command['type'] == 'hub_flight',
    );
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'hub_flight_done',
      'id': secondEntry['id'],
    });
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 650));
    final hubConfig = commands.lastWhere(
      (command) => command['type'] == 'hub_scene',
    );
    expect(hubConfig['viewportTop'], secondEntry['top']);
    expect(hubConfig['viewportHeight'], secondEntry['height']);
    expect(hubConfig['viewportClipTop'], secondEntry['clipTop']);
    expect(hubConfig['viewportClipBottom'], secondEntry['clipBottom']);
    expect(hubConfig['viewportClipBottom'], isA<double>());
    expect(
      commands.map((command) => command['type']),
      isNot(contains('hub_capture')),
    );
    final hubPresentation = commands.lastWhere(
      (command) => command['type'] == 'present',
    );
    expect(hubPresentation['requestId'], isNot(presentation['requestId']));
    expect(scene.presented, isFalse);
    expectFixedCanvas();
    expect(find.byKey(fallback), findsNothing);
    expect(find.byType(SceneLoading), findsNothing);
    expect(find.byKey(const ValueKey('scene-cover-opacity')), findsNothing);

    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'presented',
      'requestId': hubPresentation['requestId'],
      'time': 2,
      'phase': 11,
    });
    await tester.pumpAndSettle();
    expectFixedCanvas();
    expect(find.byKey(fallback), findsNothing);
    expect(find.byType(SceneLoading), findsNothing);

    final hubPage = tester.widget<FlareTrainingHubPage>(
      find.byType(FlareTrainingHubPage),
    );
    expect(hubPage.interactionLocked, isFalse);
    final scroll = tester.state<ScrollableState>(
      find.ancestor(
        of: find.byKey(actorStage),
        matching: find.byType(Scrollable),
      ),
    );
    scroll.position.jumpTo(18);
    await tester.pumpAndSettle();
    final scrolled = commands.lastWhere(
      (command) => command['type'] == 'hub_viewport',
    );
    expect(scrolled['viewportTop'], (hubConfig['viewportTop']! as double) - 18);
    expect(scrolled['viewportHeight'], hubConfig['viewportHeight']);
    expect(scrolled['viewportClipBottom'], hubConfig['viewportClipBottom']);
    expectFixedCanvas();
    scroll.position.jumpTo(0);
    await tester.pumpAndSettle();

    final returnCommands = commands.length;
    hubPage.onBack();
    await tester.pump();
    final returning = commands.lastWhere(
      (command) => command['type'] == 'hub_flight',
    );
    expect(returning['returning'], isTrue);
    expect(returning['top'], hubConfig['viewportTop']);
    expect(returning['height'], hubConfig['viewportHeight']);
    expect(
      commands.skip(returnCommands).map((value) => value['type']),
      isNot(contains('hub_capture')),
    );
    expect(
      commands.skip(returnCommands).map((value) => value['type']),
      isNot(contains('hub_exit')),
    );
    expect(find.byKey(fallback), findsNothing);
    expectFixedCanvas();
    expect(
      tester
          .widget<FlareTrainingHubPage>(find.byType(FlareTrainingHubPage))
          .mountScene,
      isTrue,
    );

    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'hub_flight_ready',
      'id': returning['id'],
    });
    await tester.pump();
    expectFixedCanvas();
    expect(find.byKey(fallback), findsNothing);
    expect(
      tester
          .widget<FlareTrainingHubPage>(find.byType(FlareTrainingHubPage))
          .leaving,
      isTrue,
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 120));
    final returnProgress =
        tester.getTopLeft(find.byType(FlareTrainingHubPage)).dx / 390;
    final returningCardPose = commands.lastWhere(
      (command) => command['type'] == 'home_chrome',
    );
    expect(returnProgress, inExclusiveRange(.4, 1));
    expect(
      returningCardPose['x'],
      closeTo(
        -390 * .9 * (1 - const Interval(.06, 1).transform(returnProgress)),
        .01,
      ),
    );
    expect(
      returningCardPose['opacity'],
      closeTo(const Interval(.4, 1).transform(returnProgress), .001),
    );
    expectFixedCanvas();

    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'hub_flight_done',
      'id': returning['id'],
    });
    await tester.pumpAndSettle();
    expect(find.byType(FlareTrainingHubPage), findsNothing);
    expectFixedCanvas();
    expect(tester.takeException(), isNull);
  });

  testWidgets('the hub keeps its pre-rendered pose without a live source', (
    tester,
  ) async {
    await phoneSize(tester);
    await tester.pumpWidget(
      testApp(
        Scaffold(
          body: FlareTrainingHubPage(
            catalog: catalog,
            actorBody: 'original',
            quality: 'balanced',
            enableScene: true,
            initialTime: 2,
            mountScene: false,
            visible: true,
            onBack: () {},
            onAngle: (_) {},
            onMuscle: (_) {},
          ),
        ),
      ),
    );
    expect(find.byKey(fallback), findsOneWidget);
    expect(find.byType(SceneView), findsNothing);
    expect(tester.takeException(), isNull);
  });

  for (final reducedMotion in [false, true]) {
    testWidgets(
      'the Plans hub only reveals its scene after the route and frame are ready '
      '(${reducedMotion ? 'reduced motion' : 'animated'})',
      (tester) async {
        await phoneSize(tester);
        final store = LearningStore(
          catalog: catalog,
          storage: MemoryStateStorage(),
        );
        await store.initialize();
        await store.acknowledgeSafety();
        final commands = <Map<String, Object?>>[];
        Completer<void>? bridgeGate;
        final scene = SceneController(
          commandSink: (command) async {
            commands.add(command);
            await bridgeGate?.future;
          },
        );
        addTearDown(store.dispose);
        addTearDown(scene.dispose);

        await tester.pumpWidget(
          testApp(
            Builder(
              builder: (context) => MediaQuery(
                data: MediaQuery.of(
                  context,
                ).copyWith(disableAnimations: reducedMotion),
                child: FlareShell(
                  catalog: catalog,
                  store: store,
                  sceneController: scene,
                ),
              ),
            ),
          ),
        );
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'ready',
          'period': 9,
        });
        await tester.pumpAndSettle();

        void presentLatestFrame() {
          final presentation = commands.lastWhere(
            (command) => command['type'] == 'present',
          );
          expect(
            scene.receiveEvent({
              'source': 'flare-scene',
              'type': 'presented',
              'requestId': presentation['requestId'],
              'time': 2,
              'phase': 11,
            }),
            isTrue,
          );
        }

        presentLatestFrame();
        await tester.pumpAndSettle();
        final canvas = find.byType(SceneView);
        final retainedCanvas = find.byType(SceneView, skipOffstage: false);
        final home = tester.element(canvas);
        final bounds = tester.getRect(canvas);
        bool showsScene(Map<String, Object?> command) =>
            command['type'] == 'visibility' && command['visible'] == true;

        await openPlansFromHome(tester);
        final plans = find.byType(PlansPage);
        final hub = find.byType(FlareTrainingHubPage);
        final curtain = find.byKey(const ValueKey('hub-scene-reveal'));
        double? hubBackgroundOpacity() => tester
            .element(hub)
            .findAncestorWidgetOfExactType<Material>()
            ?.color
            ?.a;
        for (final (link, muscles) in [
          ('plan-all-angles', false),
          ('plan-all-muscles', true),
        ]) {
          final target = find.byKey(ValueKey(link));
          await tester.scrollUntilVisible(
            target,
            250,
            scrollable: find.descendant(
              of: plans,
              matching: find.byWidgetPredicate(
                (widget) =>
                    widget is Scrollable &&
                    widget.axisDirection == AxisDirection.down,
              ),
            ),
          );
          await tester.pumpAndSettle();
          expect(canvas, findsNothing);

          commands.clear();
          await tester.tap(target);
          await tester.pump();
          if (!reducedMotion) {
            await tester.pump(const Duration(milliseconds: 80));
            expect(tester.getTopLeft(hub).dx, greaterThan(0));
            expect(hubBackgroundOpacity(), 1);
            expect(canvas, findsNothing);
            expect(commands.any(showsScene), isFalse);
            expect(
              commands.map((command) => command['type']),
              isNot(contains('hub_scene')),
            );
          }

          await tester.pumpAndSettle();
          final configuration = commands.singleWhere(
            (command) => command['type'] == 'hub_scene',
          );
          expect(configuration['showMuscles'], muscles);
          expect(scene.presented, isFalse);
          final present = commands.indexWhere(
            (command) => command['type'] == 'present',
          );
          expect(present, greaterThan(commands.indexOf(configuration)));
          expect(commands.indexWhere(showsScene), greaterThan(present));
          expect(tester.element(retainedCanvas), same(home));
          expect(tester.widget<AnimatedOpacity>(curtain).opacity, 1);

          presentLatestFrame();
          if (!reducedMotion) {
            await tester.pump();
            await tester.pump();
            expect(tester.widget<AnimatedOpacity>(curtain).opacity, 0);
            await tester.pump(const Duration(milliseconds: 60));
            final fade = tester.widget<FadeTransition>(
              find.descendant(
                of: curtain,
                matching: find.byType(FadeTransition),
              ),
            );
            expect(fade.opacity.value, allOf(greaterThan(0), lessThan(1)));
          }
          await tester.pumpAndSettle();
          expect(hubBackgroundOpacity(), 0);
          expect(tester.element(canvas), same(home));
          expect(tester.widget<SceneView>(canvas).concealed, isFalse);
          expect(tester.getRect(canvas), bounds);

          // A native bridge call can still be pending when the back chip is
          // pressed. This makes the route queue visibility and exit together.
          bridgeGate = Completer<void>();
          scene.setQuality('balanced');
          final returnStart = commands.length;
          await tester.tap(find.byType(FlareBackChip));
          await tester.pump();
          if (!reducedMotion) {
            await tester.pump(const Duration(milliseconds: 80));
            expect(hub, findsOneWidget);
            expect(hubBackgroundOpacity(), 1);
            expect(canvas, findsNothing);
          }
          bridgeGate.complete();
          bridgeGate = null;
          await tester.pumpAndSettle();
          expect(hub, findsNothing);
          expect(plans, findsOneWidget);
          expect(canvas, findsNothing);
          expect(tester.element(retainedCanvas), same(home));
          final returnCommands = commands.skip(returnStart).toList();
          final hide = returnCommands.indexWhere(
            (command) =>
                command['type'] == 'visibility' && command['visible'] == false,
          );
          final exit = returnCommands.indexWhere(
            (command) => command['type'] == 'hub_exit',
          );
          expect(hide, isNonNegative);
          expect(exit, greaterThan(hide));
          expect(returnCommands.any(showsScene), isFalse);
          expect(
            commands.any(
              (command) => (command['type'] as String).startsWith('hub_flight'),
            ),
            isFalse,
          );
        }
        expect(tester.takeException(), isNull);
      },
    );
  }
}
