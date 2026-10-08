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
        {'type': 'seek', 'time': 3.0},
        {'type': 'pause'},
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
        {'type': 'seek', 'time': 1.0},
      ]);
      blocked.complete();
      await Future<void>.delayed(Duration.zero);
      expect(sent, [
        {'type': 'seek', 'time': 1.0},
        {'type': 'seek', 'time': 3.0},
      ]);
    },
  );

  test(
    'scene events parse source step/selection and reject unrelated data',
    () {
      final controller = SceneController();
      addTearDown(controller.dispose);
      expect(controller.receiveMessage('malformed JSON'), isFalse);
      expect(controller.receiveEvent({'type': 'ready'}), isFalse);
      expect(controller.ready, isFalse);
      controller.receiveEvent(_ready);
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'time': 6.0,
        'phase': 15,
        'playing': false,
        'selected': 'deltoids',
      'detail': true,
      });
      expect(controller.time, 6);
      expect(controller.phase, 15);
      expect(controller.selected, 'deltoids');
      expect(controller.detail, 'deltoids');
      controller.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'selected': null,
      'detail': false,
      });
      expect(controller.selected, isNull);
      expect(controller.detail, isNull);
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
