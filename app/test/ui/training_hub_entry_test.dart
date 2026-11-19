import 'package:flare/control/learning_store.dart';
import 'package:flare/platform/scene/scene.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/flare_training_hub_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage, phoneSize, testApp;

void main() {
  const actorStage = ValueKey('hub-stage-gesture');
  const fallback = ValueKey('hub-stage-loading-frame');
  final catalog = loadCatalogFixture();

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
}
