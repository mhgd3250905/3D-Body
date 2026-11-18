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
  const entryFrame = ValueKey('hub-entry-frame');
  const returnFrame = ValueKey('hub-return-frame');
  final catalog = loadCatalogFixture();

  testWidgets('the hub retains the live angle while entering and returning', (
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
    Future<void> deliverFrame(Key key) async {
      await tester.pump();
      final capture = commands.lastWhere(
        (command) => command['type'] == 'hub_capture',
      );
      expect(
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'hub_captured',
          'id': capture['id'],
          'png':
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4'
              'nGNgiPr/HwAEEAJZs1E1mQAAAABJRU5ErkJggg==',
        }),
        isTrue,
      );
      // The engine decodes the PNG on a native worker outside fake time.
      final frame = find.byKey(key);
      for (
        var attempt = 0;
        attempt < 50 && frame.evaluate().isEmpty;
        attempt++
      ) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump();
      }
      expect(frame, findsOneWidget);
    }

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
    await deliverFrame(entryFrame);
    await tester.pump(const Duration(milliseconds: 650));
    final hubPresentation = commands.lastWhere(
      (command) => command['type'] == 'present',
    );
    expect(hubPresentation['requestId'], isNot(presentation['requestId']));
    expect(scene.presented, isFalse);
    expect(tester.element(home), same(mountedHome));
    expect(find.byKey(entryFrame), findsOneWidget);
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
    expect(tester.element(home), same(mountedHome));
    expect(find.byKey(entryFrame), findsNothing);
    expect(find.byKey(fallback), findsNothing);
    expect(find.byType(SceneLoading), findsNothing);

    final hubPage = tester.widget<FlareTrainingHubPage>(
      find.byType(FlareTrainingHubPage),
    );
    expect(hubPage.interactionLocked, isFalse);
    hubPage.onBack();
    await deliverFrame(returnFrame);
    final returning = commands.lastWhere(
      (command) => command['type'] == 'hub_flight',
    );
    expect(returning['returning'], isTrue);
    expect(find.byKey(fallback), findsNothing);
    expect(tester.element(home), same(mountedHome));

    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'hub_flight_ready',
      'id': returning['id'],
    });
    await tester.pump();
    expect(find.byKey(returnFrame), findsNothing);
    expect(find.byKey(fallback), findsNothing);
    expect(commands.last['type'], 'hub_flight_resume');

    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'hub_flight_done',
      'id': returning['id'],
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
}
