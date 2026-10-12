import 'package:flutter_test/flutter_test.dart';

import '../../integration_test/support/observed_scene_controller.dart';

void main() {
  const frame = 2.375;
  const ack = <Object?, Object?>{
    'source': 'flare-scene',
    'type': 'state',
    'ready': true,
    'errorCode': null,
    'playing': false,
    'time': frame,
    'selected': 'triceps',
    'detail': true,
    'detailModel': 'motion',
  };

  test('local commands and rejected events cannot confirm a scene frame', () {
    final scene = ObservedSceneController();
    addTearDown(scene.dispose);
    scene.setTime(frame);
    scene.setDetail('triceps');
    expect(scene.detail, 'triceps');
    expect(scene.stateRevision, 0);
    expect(
      scene.confirmsPausedFrame(after: 0, detail: 'triceps', time: frame),
      false,
    );
    scene.receiveEvent({...ack, 'source': 'untrusted'});
    expect(scene.stateRevision, 0);
    scene.receiveEvent({...ack, 'type': 'ready'});
    expect(scene.stateRevision, 0);
  });

  test(
    'requires a newer complete state with the same paused frame and model',
    () {
      final scene = ObservedSceneController();
      addTearDown(scene.dispose);
      scene.receiveMessage('''{"source":"flare-scene","type":"state",
      "ready":true,"errorCode":null,"playing":false,"time":2.375,
      "selected":"triceps","detail":true,"detailModel":"motion"}''');
      expect(
        scene.confirmsPausedFrame(after: 0, detail: 'triceps', time: frame),
        true,
      );
      expect(
        scene.confirmsPausedFrame(after: 1, detail: 'triceps', time: frame),
        false,
      );
      expect(
        scene.confirmsPausedFrame(
          after: 0,
          detail: 'triceps',
          time: frame,
          model: 'muscles',
        ),
        false,
      );
      for (final invalid in [
        {...ack, 'time': 4.0},
        {...ack, 'playing': true},
        {...ack, 'errorCode': 'webgl-lost'},
        {...ack, 'selected': 'biceps'},
        {...ack, 'detail': false},
        {...ack, 'ready': false},
      ]) {
        scene.receiveEvent(invalid);
        expect(
          scene.confirmsPausedFrame(after: 0, detail: 'triceps', time: frame),
          false,
        );
      }
      scene.receiveEvent({...ack, 'detailModel': 'muscles'});
      expect(
        scene.confirmsPausedFrame(
          after: 0,
          detail: 'triceps',
          time: frame,
          model: 'muscles',
        ),
        true,
      );
      scene.receiveEvent({...ack, 'selected': null, 'detail': false});
      expect(
        scene.confirmsPausedFrame(after: 0, detail: null, time: frame),
        true,
      );
      // Closing detail keeps the selected group highlighted in the loop.
      scene.receiveEvent({...ack, 'detail': false});
      expect(
        scene.confirmsPausedFrame(after: 0, detail: null, time: frame),
        false,
      );
      expect(
        scene.confirmsPausedFrame(
          after: 0,
          detail: null,
          time: frame,
          retainedSelection: 'triceps',
        ),
        true,
      );
    },
  );
}
