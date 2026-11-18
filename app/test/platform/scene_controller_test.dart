import 'dart:async';

import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flutter_test/flutter_test.dart';

const _ready = {
  'source': 'flare-scene',
  'type': 'ready',
  'period': 9,
  'time': 2,
  'phase': {'source': 11},
};

void main() {
  test(
    'training hub sends the latest complete selection and restores it',
    () async {
      final sent = <Map<String, Object?>>[];
      final controller = SceneController(commandSink: sent.add);
      addTearDown(controller.dispose);
      controller.configureTrainingHub(
        phaseSource: 9,
        phaseTime: 2.73,
        muscleId: 'deltoids',
        showMuscles: false,
        scrubbing: true,
      );
      controller.rotateTrainingHubAngle(0.25);
      controller.configureTrainingHub(
        phaseSource: 15,
        phaseTime: 6,
        muscleId: 'triceps',
        showMuscles: true,
        focusMuscle: true,
      );
      controller.rotateTrainingHubAngle(0.5);
      controller.requestPresentation();
      controller.receiveEvent(_ready);
      await Future<void>.delayed(Duration.zero);

      expect(sent.map((value) => value['type']), ['hub_scene', 'present']);
      final selected = sent.first;
      expect(selected['phaseSource'], 15);
      expect(selected['phaseTime'], 6);
      expect(selected['angleYaw'], 0.75);
      expect(selected['showMuscles'], isTrue);
      expect(selected['focusMuscle'], isTrue);
      expect(selected['scrubbing'], isFalse);
      expect(selected['muscleId'], 'triceps');
      final muscleCamera = selected['muscleCamera']! as Map<String, Object?>;
      expect((muscleCamera['position']! as List<double>).last, lessThan(0));
      expect(muscleCamera['target'], [0, 1.176, 0]);
      expect(muscleCamera['region'], [.339, .143, .091]);
      expect(selected.containsKey('angleCamera'), isFalse);

      sent.clear();
      controller.rotateTrainingHubAngle(0.25);
      await Future<void>.delayed(Duration.zero);
      expect(sent, [
        {'type': 'hub_angle', 'yaw': 1.0},
      ]);

      sent.clear();
      controller.reportError(SceneController.processTerminated);
      controller.requestPresentation();
      controller.receiveEvent(_ready);
      await Future<void>.delayed(Duration.zero);

      expect(sent.map((value) => value['type']), ['hub_scene', 'present']);
      expect(sent.first, {...selected, 'animate': false, 'angleYaw': 1.0});
    },
  );

  test('bridge readiness waits for the matching presented frame', () async {
    final sent = <Map<String, Object?>>[];
    final controller = SceneController(commandSink: sent.add);
    addTearDown(controller.dispose);
    controller.receiveEvent(_ready);
    expect(controller.ready, isTrue);
    expect(controller.presented, isFalse);
    controller.setTheme('light');
    controller.setViewInset(86, animate: false);
    controller.setTime(2.375);
    controller.requestPresentation();
    await Future<void>.delayed(Duration.zero);
    expect(sent.map((c) => c['type']), [
      'theme',
      'viewport',
      'seek',
      'present',
    ]);
    final first = sent.last['requestId'] as int;
    controller.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'time': 0,
      'phase': 9,
      'playing': false,
    });
    expect(controller.time, 2.375);
    expect(controller.phase, 11);
    expect(
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'presented',
        'requestId': first - 1,
      }),
      isFalse,
    );
    expect(controller.presented, isFalse);
    var notifications = 0;
    controller.addListener(() => notifications++);
    expect(
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'presented',
        'requestId': first,
        'time': 2.5,
        'phase': 12,
        'playing': true,
      }),
      isTrue,
    );
    expect(controller.presented, isTrue);
    expect(controller.time, 2.5);
    expect(controller.phase, 12);
    expect(controller.playing, isTrue);
    expect(notifications, 1);

    controller.requestPresentation();
    await Future<void>.delayed(Duration.zero);
    final next = sent.last['requestId'] as int;
    expect(next, greaterThan(first));
    expect(controller.presented, isFalse);
    expect(
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'presented',
        'requestId': first,
      }),
      isFalse,
    );
    controller.reportError('graphics_context_lost');
    expect(
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'presented',
        'requestId': next,
      }),
      isFalse,
    );
    controller.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'ready': true,
      'errorCode': null,
    });
    expect(controller.ready, isTrue);
    expect(controller.presented, isFalse);
    controller.requestPresentation();
    await Future<void>.delayed(Duration.zero);
    final recovered = sent.last['requestId'];
    controller.receiveEvent({
      'source': 'flare-scene',
      'type': 'presented',
      'requestId': recovered,
    });
    expect(controller.presented, isTrue);
  });

  test(
    'replacing a connection rejects the old presentation acknowledgement',
    () async {
      final sent = <Map<String, Object?>>[];
      final controller = SceneController();
      addTearDown(controller.dispose);
      final SceneCommandSink firstSink = sent.add;
      controller.attachCommandSink(firstSink);
      controller.receiveEvent(_ready);
      controller.requestPresentation();
      await Future<void>.delayed(Duration.zero);
      final oldId = sent.last['requestId'];
      controller.detachCommandSink(firstSink);
      expect(controller.presented, isFalse);
      controller.attachCommandSink((command) => sent.add(command));
      controller.receiveEvent(_ready);
      expect(
        controller.receiveEvent({
          'source': 'flare-scene',
          'type': 'presented',
          'requestId': oldId,
        }),
        isFalse,
      );
      expect(controller.presented, isFalse);
      controller.requestPresentation();
      await Future<void>.delayed(Duration.zero);
      final newId = sent.last['requestId'];
      expect(newId, isNot(oldId));
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'presented',
        'requestId': newId,
      });
      expect(controller.presented, isTrue);
    },
  );

  test(
    'commands wait for actual readiness and keep latest desired values',
    () async {
      final sent = <Map<String, Object?>>[];
      final controller = SceneController(commandSink: sent.add);
      addTearDown(controller.dispose);

      controller.setTime(1);
      controller.play();
      controller.setTime(3);
      controller.pause();
      controller.setSpeed(0.25);
      controller.setSpeed(1);
      expect(sent, isEmpty);

      expect(controller.receiveEvent(_ready), isTrue);
      await Future<void>.delayed(Duration.zero);
      expect(sent, [
        {'type': 'seek', 'time': 3.0, 'clockRevision': 3},
        {'type': 'pause', 'clockRevision': 4},
        {'type': 'speed', 'value': 1.0},
      ]);
      expect(controller.phase, 11);
      expect(controller.ready, isTrue);
    },
  );

  test(
    'an in-flight native command does not replay every intermediate scrub',
    () async {
      final blocked = Completer<void>();
      final sent = <Map<String, Object?>>[];
      final controller = SceneController(
        commandSink: (command) async {
          sent.add(command);
          if (sent.length == 1) await blocked.future;
        },
      );
      addTearDown(controller.dispose);
      controller.receiveEvent(_ready);
      controller.setTime(1);
      controller.setTime(2);
      controller.setTime(3);
      expect(sent, [
        {'type': 'seek', 'time': 1.0, 'clockRevision': 1},
      ]);
      blocked.complete();
      await Future<void>.delayed(Duration.zero);
      expect(sent, [
        {'type': 'seek', 'time': 1.0, 'clockRevision': 1},
        {'type': 'seek', 'time': 3.0, 'clockRevision': 3},
      ]);
    },
  );

  test(
    'muscle hit preserves its group through ordinary scene acknowledgements',
    () {
      final controller = SceneController();
      addTearDown(controller.dispose);
      expect(controller.receiveMessage('malformed JSON'), isFalse);
      expect(controller.receiveEvent({'type': 'ready'}), isFalse);
      expect(controller.ready, isFalse);
      controller.receiveEvent(_ready);
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'select',
        'time': 6.0,
        'phase': 15,
        'playing': false,
        'groupId': 'deltoids',
      });
      expect(controller.time, 6);
      expect(controller.phase, 15);
      expect(controller.selected, 'deltoids');
      expect(controller.selectionGeneration, 1);
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'selected': null,
        'time': 6.0,
        'playing': false,
      });
      expect(controller.selected, 'deltoids');
      expect(controller.selectionGeneration, 1);
      controller.play();
      expect(controller.selected, isNull);
    },
  );

  test(
    'background visibility pauses without resetting or resuming the clock',
    () async {
      final sent = <Map<String, Object?>>[];
      final controller = SceneController(commandSink: sent.add);
      addTearDown(controller.dispose);
      controller.receiveEvent(_ready);
      controller.play();
      controller.pause();
      controller.setVisible(false);
      controller.setVisible(true);
      await Future<void>.delayed(Duration.zero);
      expect(controller.playing, isFalse);
      expect(controller.time, 2);
      expect(sent.last, {'type': 'visibility', 'visible': true});
      expect(sent.where((value) => value['type'] == 'play').length, 1);
    },
  );
}
