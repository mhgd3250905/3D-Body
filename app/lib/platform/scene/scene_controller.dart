import 'dart:async';
import 'dart:math' as math;
import 'dart:convert';

import 'package:flutter/foundation.dart';

import 'scene_hub_camera.dart';

typedef SceneCommandSink =
    FutureOr<void> Function(Map<String, Object?> command);

/// Shared state and commands for the bundled Three.js scene.
/// The scene owns the animation clock; Flutter never advances it independently.
class SceneController extends ChangeNotifier {
  SceneController({SceneCommandSink? commandSink}) : _sink = commandSink;

  SceneCommandSink? _sink;
  final Map<String, Map<String, Object?>> _pending = {};
  bool _dispatching = false;
  bool _disposed = false;
  int _connection = 0;
  Map<String, Object?>? _trainingHubCommand;
  double _trainingHubYaw = 0;
  Completer<void>? _trainingFlight;
  VoidCallback? _onTrainingFlightPrepared;
  int _trainingFlightId = 0;

  double _time = 0;
  final _playhead = ValueNotifier<double>(0);
  int _clockRevision = 0;
  double _period = 9;
  double _speed = 0.5;
  bool _playing = false;
  bool _ready = false;
  bool _presented = false;
  static int _nextPresentationRequest = 0;
  int? _presentationRequest;
  int _phase = 9;
  String? _selected;

  /// The platform reclaimed the WebView's content process (iOS memory
  /// pressure). The host may restart the scene without asking the user.
  static const processTerminated = 'scene-process-terminated';

  String? _errorCode;
  int _selectionGeneration = 0;

  double get time => _time;
  ValueListenable<double> get playhead => _playhead;
  double get period => _period;
  double get speed => _speed;
  bool get playing => _playing;
  bool get ready => _ready;

  /// The scene has drawn the requested configuration and committed its frame.
  bool get presented => _presented;
  int get phase => _phase;
  String? get selected => _selected;
  String? get errorCode => _errorCode;

  /// Advances only for an actual scene hit, never a command acknowledgement.
  int get selectionGeneration => _selectionGeneration;
  double get trainingHubYaw => _trainingHubYaw;

  /// Replacing a view never sends its queued commands to the previous view.
  void attachCommandSink(SceneCommandSink sink) {
    if (_disposed) return;
    _connection++;
    _sink = sink;
    final changed = _ready || _presented || _errorCode != null;
    _ready = false;
    _invalidatePresentation();
    _errorCode = null;
    if (changed) notifyListeners();
  }

  void detachCommandSink(SceneCommandSink sink) {
    if (!identical(_sink, sink)) return;
    _connection++;
    _sink = null;
    final changed = _ready || _presented;
    _ready = false;
    _invalidatePresentation();
    if (changed && !_disposed) notifyListeners();
  }

  void setTime(double value) {
    if (!value.isFinite || _disposed) return;
    _time = value.clamp(0, _period).toDouble();
    _playhead.value = _time;
    _playing = false;
    command({'type': 'seek', 'time': _time, 'clockRevision': ++_clockRevision});
    notifyListeners();
  }

  void play() {
    if (_disposed) return;
    _playing = true;
    _selected = null;
    command({'type': 'play', 'clockRevision': ++_clockRevision});
    notifyListeners();
  }

  void pause() {
    if (_disposed) return;
    _playing = false;
    command({'type': 'pause', 'clockRevision': ++_clockRevision});
    notifyListeners();
  }

  void setSpeed(double value) {
    if (![0.25, 0.5, 1.0].contains(value) || _disposed) return;
    _speed = value;
    command({'type': 'speed', 'value': value});
    notifyListeners();
  }

  /// Keep the selected frames together when the live view enters the training
  /// hub or is recovered after a WebView process restart.
  void configureTrainingHub({
    required int phaseSource,
    required double phaseTime,
    required String muscleId,
    required bool showMuscles,
    bool focusMuscle = false,
    bool animate = true,
    bool scrubbing = false,
    bool showCallouts = true,
  }) {
    final muscle = SceneHubCamera.muscle(muscleId, focused: focusMuscle);
    if (_disposed ||
        phaseSource < 9 ||
        phaseSource > 16 ||
        muscle == null ||
        !phaseTime.isFinite) {
      return;
    }
    final configuration = <String, Object?>{
      'type': 'hub_scene',
      'phaseSource': phaseSource,
      'phaseTime': phaseTime,
      'angleYaw': _trainingHubYaw,
      'muscleId': muscleId,
      'showMuscles': showMuscles,
      'focusMuscle': focusMuscle,
      'muscleCamera': muscle,
      'animate': animate,
      'scrubbing': scrubbing,
      'showCallouts': showCallouts,
    };
    _trainingHubCommand = configuration;
    _pending.remove('hub_exit');
    command(configuration);
  }

  void leaveTrainingHub() {
    _trainingHubYaw = 0;
    if (_trainingHubCommand == null) return;
    _trainingHubCommand = null;
    _pending.remove('hub_scene');
    _pending.remove('hub_angle');
    command({'type': 'hub_exit'});
  }

  void rotateTrainingHubAngle(double radians) {
    if (_disposed || !radians.isFinite || radians == 0) return;
    // Buffer rotation while the shared renderer is still flying into the hub.
    _trainingHubYaw = (_trainingHubYaw + radians) % (2 * math.pi);
    final hub = _trainingHubCommand;
    if (hub == null) return;
    final configuration = {...hub, 'angleYaw': _trainingHubYaw};
    _trainingHubCommand = configuration;
    if (_pending.containsKey('hub_scene')) {
      _pending['hub_scene'] = Map<String, Object?>.unmodifiable({
        ..._pending['hub_scene']!,
        'angleYaw': _trainingHubYaw,
      });
      // A queued configuration already carries the latest angle.
      _pending.remove('hub_angle');
      return;
    }
    command({'type': 'hub_angle', 'yaw': _trainingHubYaw});
  }

  Future<void> flyTrainingActor({
    required double time,
    required double top,
    required double height,
    required Duration duration,
    bool returning = false,
    double yaw = 0,
    VoidCallback? onPrepared,
  }) {
    _trainingFlight?.complete();
    final flight = _trainingFlight = Completer<void>();
    _onTrainingFlightPrepared = onPrepared;
    command({
      'type': 'hub_flight',
      'id': ++_trainingFlightId,
      'time': time,
      'top': top,
      'height': height,
      'duration': duration.inMilliseconds,
      'returning': returning,
      'yaw': yaw,
    });
    return flight.future;
  }

  void resumeTrainingFlight() => command({'type': 'hub_flight_resume'});

  void rotateTrainingFlight(double yaw) {
    if (!yaw.isFinite || _trainingFlightId == 0) return;
    command({'type': 'hub_flight_angle', 'yaw': yaw});
  }

  Future<void> reverseTrainingFlight() {
    _trainingFlight?.complete();
    final flight = _trainingFlight = Completer<void>();
    _onTrainingFlightPrepared = null;
    command({'type': 'hub_flight_reverse', 'id': ++_trainingFlightId});
    return flight.future;
  }

  void finishTrainingFlight() {
    _trainingFlight?.complete();
    _trainingFlight = null;
    _onTrainingFlightPrepared = null;
    command({'type': 'hub_flight', 'id': 0});
  }

  void setCamera(String view) => command({'type': 'camera', 'view': view});
  void reset() => command({'type': 'reset'});

  /// Bottom px of the 3D view covered by host chrome. The scene frames into
  /// the part above it and eases the change with its camera.
  void setViewInset(double bottom, {bool animate = true}) {
    if (_disposed) return;
    command({'type': 'viewport', 'bottom': bottom, 'animate': animate});
  }

  void setLoop(double? start, double? end) =>
      command({'type': 'loop', 'start': start, 'end': end});

  void setVisible(bool visible) {
    if (_disposed) return;
    if (!visible) _playing = false;
    command({'type': 'visibility', 'visible': visible});
    notifyListeners();
  }

  void setQuality(String quality) =>
      command({'type': 'quality', 'value': quality});

  /// Presentation strings only; the scene clock, selection and camera persist.
  void setLocalization(Map<String, Object?> value) =>
      command({'type': 'localization', ...value});

  /// Request a first frame after the preceding settings have reached the view.
  /// IDs are unique across controllers, so a retired view cannot unveil a new one.
  void requestPresentation() {
    if (_disposed) return;
    _presentationRequest = ++_nextPresentationRequest;
    final changed = _presented;
    _presented = false;
    command({'type': 'present', 'requestId': _presentationRequest});
    if (changed) notifyListeners();
  }

  /// Platform adapters use this only when replacing the controller while
  /// retaining the very same already-presented native view or iframe.
  void retainPresentedView() {
    if (_disposed || !_ready || _presented || _errorCode != null) return;
    _presented = true;
    notifyListeners();
  }

  void _invalidatePresentation() {
    _presented = false;
    _presentationRequest = null;
    _pending.remove('present');
  }

  /// Page chrome appearance inside the scene: 'dark' or 'light'.
  /// Switches the scene's chrome to [value] ('dark' or 'light'). A non-zero
  /// [duration] cross-fades it in CSS, in step with the app's dissolve.
  void setTheme(String value, {Duration duration = Duration.zero}) => command({
    'type': 'theme',
    'value': value,
    if (duration > Duration.zero) 'duration': duration.inMilliseconds,
  });

  /// Before GLB readiness (or while a native call is in flight), retain only
  /// the latest command for each setting and preserve their intended order.
  void command(Map<String, Object?> value) {
    if (_disposed) return;
    final type = value['type'];
    if (type is! String || type.isEmpty) {
      throw ArgumentError.value(value, 'value', 'Scene command needs a type.');
    }
    final key = switch (type) {
      'play' || 'pause' => 'playback',
      _ => type,
    };
    _pending.remove(key);
    _pending[key] = Map<String, Object?>.unmodifiable(value);
    unawaited(_flush());
  }

  Future<void> _flush() async {
    if (_dispatching || !_ready || _sink == null || _disposed) return;
    _dispatching = true;
    try {
      while (_ready && _sink != null && _pending.isNotEmpty && !_disposed) {
        final sink = _sink!;
        final connection = _connection;
        final key = _pending.keys.first;
        final value = _pending.remove(key)!;
        try {
          await sink(value);
        } catch (_) {
          if (!_disposed && connection == _connection) {
            _pending.putIfAbsent(key, () => value);
            reportError('command-failed');
          }
          break;
        }
      }
    } finally {
      _dispatching = false;
      if (_ready && _sink != null && _pending.isNotEmpty && !_disposed) {
        unawaited(_flush());
      }
    }
  }

  bool receiveMessage(String message) {
    try {
      final value = jsonDecode(message);
      return value is Map && receiveEvent(value);
    } on FormatException {
      return false;
    }
  }

  /// Called only after the platform host has checked message origin/source.
  bool receiveEvent(Map<Object?, Object?> event) {
    if (_disposed || event['source'] != 'flare-scene') return false;
    final type = event['type'];
    final revision = event['clockRevision'];
    // Native bridge messages already queued before pause, seek, or play can
    // arrive after the tap. A frame from the previous intent must not move
    // the transport or change its playing state while the command is in flight.
    if ((type == 'state' || type == 'playhead') &&
        revision is num &&
        revision != _clockRevision) {
      return false;
    }
    if (type == 'playhead') {
      final time = event['time'];
      if (!_ready ||
          !_playing ||
          _presentationRequest != null ||
          time is! num ||
          !time.isFinite) {
        return false;
      }
      _time = time.clamp(0, _period).toDouble();
      _playhead.value = _time;
      final source = event['phase'];
      if (source is num && source >= 9 && source <= 16 && source != _phase) {
        _phase = source.toInt();
        notifyListeners();
      }
      return true;
    }
    if (type == 'hub_flight_ready') {
      if (event['id'] != _trainingFlightId || _trainingFlight == null) {
        return false;
      }
      final callback = _onTrainingFlightPrepared;
      _onTrainingFlightPrepared = null;
      callback?.call();
      return true;
    }
    if (type == 'hub_flight_done') {
      if (event['id'] != _trainingFlightId || _trainingFlight == null) {
        return false;
      }
      _trainingFlight!.complete();
      _trainingFlight = null;
      return true;
    }
    if (!const {
      'ready',
      'presented',
      'state',
      'select',
      'error',
    }.contains(type)) {
      return false;
    }
    if (type == 'presented') {
      if (!_ready ||
          _errorCode != null ||
          _presentationRequest == null ||
          event['requestId'] != _presentationRequest) {
        return false;
      }
    }
    if (type == 'error') {
      reportError('${event['errorCode'] ?? event['code'] ?? 'scene-error'}');
      return true;
    }
    // Configuration acknowledgements describe intermediate frames. Keep the
    // host chrome stable until the matching presented event supplies its final
    // snapshot; errors and connection readiness still take effect immediately.
    if (type == 'state' &&
        _presentationRequest != null &&
        event['ready'] != false &&
        event['errorCode'] == null) {
      return true;
    }
    final period = event['period'];
    if (period is num && period.isFinite && period > 0) {
      _period = period.toDouble();
    }
    final time = event['time'];
    if (time is num && time.isFinite) {
      _time = time.clamp(0, _period).toDouble();
      _playhead.value = _time;
    }
    if (event['playing'] is bool) _playing = event['playing'] as bool;
    final speed = event['speed'];
    if (speed is num && [0.25, 0.5, 1.0].contains(speed)) {
      _speed = speed.toDouble();
    }
    final phase = event['phase'];
    final source = phase is Map ? phase['source'] : phase;
    if (source is num && source >= 9 && source <= 16) {
      _phase = source.toInt();
    }
    if (type == 'select') {
      final group = event['groupId'];
      if (group is String && group.isNotEmpty) {
        _selectionGeneration++;
        _selected = group;
      }
      _playing = false;
    }
    if (type == 'presented') {
      _presentationRequest = null;
      _presented = true;
    }
    if (type == 'ready') {
      final hub = _trainingHubCommand;
      if (hub != null && !_pending.containsKey('hub_scene')) {
        final presentation = _pending.remove('present');
        _pending['hub_scene'] = {...hub, 'animate': false};
        if (presentation != null) _pending['present'] = presentation;
      }
      _ready = true;
      _errorCode = null;
    } else {
      if (event['ready'] is bool) {
        _ready = event['ready'] as bool;
        if (!_ready) _invalidatePresentation();
      }
      if (event.containsKey('errorCode')) {
        final error = event['errorCode'];
        _errorCode = error is String ? error : null;
      }
    }
    notifyListeners();
    if (_ready) unawaited(_flush());
    return true;
  }

  void reportError(String code) {
    if (_disposed) return;
    _ready = false;
    _invalidatePresentation();
    _playing = false;
    _errorCode = code;
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _connection++;
    _sink = null;
    _pending.clear();
    _playhead.dispose();
    super.dispose();
  }
}
