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
  };

  test('local commands and rejected events cannot confirm a scene frame', () {
    final scene = ObservedSceneController();
    addTearDown(scene.dispose);
    scene.setTime(frame);
    expect(scene.stateRevision, 0);
    expect(scene.confirmsPausedFrame(after: 0, time: frame), false);
    scene.receiveEvent({...ack, 'source': 'untrusted'});
    scene.receiveEvent({...ack, 'type': 'ready'});
    expect(scene.stateRevision, 0);
  });

  test('requires a newer complete state at the same paused frame', () {
    final scene = ObservedSceneController();
    addTearDown(scene.dispose);
    scene.receiveMessage('''{"source":"flare-scene","type":"state",
      "ready":true,"errorCode":null,"playing":false,"time":2.375}''');
    expect(scene.confirmsPausedFrame(after: 0, time: frame), true);
    expect(scene.confirmsPausedFrame(after: 1, time: frame), false);
    for (final invalid in [
      {...ack, 'time': 4.0},
      {...ack, 'playing': true},
      {...ack, 'errorCode': 'webgl-lost'},
      {...ack, 'ready': false},
    ]) {
      scene.receiveEvent(invalid);
      expect(scene.confirmsPausedFrame(after: 0, time: frame), false);
    }
    scene.receiveEvent(ack);
    expect(scene.confirmsPausedFrame(after: 0, time: frame), true);
  });
}
