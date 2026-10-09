import 'package:flare/platform/scene/scene_controller.dart';

/// Observes acknowledgements from the real scene, independently of the
/// controller's optimistic values set by Flutter commands.
class ObservedSceneController extends SceneController {
  ObservedSceneController({super.commandSink});

  int stateRevision = 0;
  int readyRevision = 0;
  Map<Object?, Object?>? lastState;

  @override
  bool receiveEvent(Map<Object?, Object?> event) {
    final accepted = super.receiveEvent(event);
    if (accepted && event['type'] == 'ready') readyRevision++;
    if (accepted && event['type'] == 'state') {
      stateRevision++;
      lastState = Map.unmodifiable(event);
    }
    return accepted;
  }

  bool confirmsPausedFrame({
    required int after,
    required String? detail,
    required double time,
    String? retainedSelection,
    String model = 'motion',
  }) {
    final state = lastState;
    final actualTime = state?['time'];
    return stateRevision > after &&
        state?['ready'] == true &&
        state?['errorCode'] == null &&
        state?['playing'] == false &&
        state?['selected'] == (detail ?? retainedSelection) &&
        state?['detail'] == (detail != null) &&
        state?['detailModel'] == model &&
        actualTime is num &&
        actualTime.isFinite &&
        (actualTime - time).abs() < .025;
  }
}
