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

  testWidgets('the hub can buffer a drag and return before mounting its view', (
    tester,
  ) async {
    await phoneSize(tester);
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
    await tester.tap(find.byKey(const ValueKey('home-go-to-training')));
    await tester.pump();
    expect(find.byKey(actorStage), findsOneWidget);
    expect(find.byKey(fallback), findsNothing);
    expect(find.byType(SceneView), findsOneWidget);
    expect(tester.element(home), same(mountedHome));
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
    expect(tester.element(home), same(mountedHome));
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
    expect(tester.element(home), same(mountedHome));
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

  testWidgets('a live-entry hub never shows the yaw-0 loading still', (
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
            liveEntry: true,
            visible: true,
            onBack: () {},
            onAngle: (_) {},
            onMuscle: (_) {},
          ),
        ),
      ),
    );
    expect(find.byKey(fallback), findsNothing);
    expect(tester.takeException(), isNull);
  });
}
