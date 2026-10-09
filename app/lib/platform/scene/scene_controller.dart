import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';

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

  double _time = 0;
  double _period = 9;
  double _speed = 0.5;
  bool _playing = false;
  bool _ready = false;
  int _phase = 9;
  String? _selected;
  String? _detail;
  String _detailModel = 'motion';

  /// The platform reclaimed the WebView's content process (iOS memory
  /// pressure). The host may restart the scene without asking the user.
  static const processTerminated = 'scene-process-terminated';

  String? _errorCode;
  int _selectionGeneration = 0;

  double get time => _time;
  double get period => _period;
  double get speed => _speed;
  bool get playing => _playing;
  bool get ready => _ready;
  int get phase => _phase;
  String? get selected => _selected;
  String? get detail => _detail;
  String get detailModel => _detailModel;
  String? get errorCode => _errorCode;

  /// Advances only for an actual scene hit, never a command acknowledgement.
  int get selectionGeneration => _selectionGeneration;

  /// Replacing a view never sends its queued commands to the previous view.
  void attachCommandSink(SceneCommandSink sink) {
    if (_disposed) return;
    _connection++;
    _sink = sink;
    final changed = _ready || _errorCode != null;
    _ready = false;
    _errorCode = null;
    if (changed) notifyListeners();
  }

  void detachCommandSink(SceneCommandSink sink) {
    if (!identical(_sink, sink)) return;
    _connection++;
    _sink = null;
    final changed = _ready;
    _ready = false;
    if (changed && !_disposed) notifyListeners();
  }

  void setTime(double value) {
    if (!value.isFinite || _disposed) return;
    _time = value.clamp(0, _period).toDouble();
    _playing = false;
    _detail = null;
    _resetDetailModel();
    command({'type': 'seek', 'time': _time});
    notifyListeners();
  }

  void play() {
    if (_disposed) return;
    _playing = true;
    _selected = null;
    _detail = null;
    _resetDetailModel();
    command({'type': 'play'});
    notifyListeners();
  }

  void pause() {
    if (_disposed) return;
    _playing = false;
    command({'type': 'pause'});
    notifyListeners();
  }

  void setSpeed(double value) {
    if (![0.25, 0.5, 1.0].contains(value) || _disposed) return;
    _speed = value;
    command({'type': 'speed', 'value': value});
    notifyListeners();
  }

  void setCamera(String view) => command({'type': 'camera', 'view': view});
  void reset() => command({'type': 'reset'});

  void select(String? groupId) {
    if (_disposed) return;
    _selected = groupId;
    _playing = false;
    command({'type': 'select', 'groupId': groupId});
    notifyListeners();
  }

  /// Bottom px of the 3D view covered by host chrome. The scene frames into
  /// the part above it and eases the change with its camera.
  void setViewInset(double bottom, {bool animate = true}) {
    if (_disposed) return;
    command({'type': 'viewport', 'bottom': bottom, 'animate': animate});
  }

  void setDetail(String? groupId) {
    if (_disposed) return;
    if (_detail == null || groupId == null) _resetDetailModel();
    _detail = groupId;
    _playing = false;
    if (groupId != null) _selected = groupId;
    command({'type': 'detail', 'groupId': groupId});
    notifyListeners();
  }

  /// Both detail models observe the same paused source frame and muscle group.
  void setDetailModel(String value) {
    if (_disposed ||
        _detail == null ||
        !_detailModels.contains(value) ||
        _detailModel == value) {
      return;
    }
    _detailModel = value;
    _playing = false;
    command({'type': 'detail_model', 'value': value});
    notifyListeners();
  }

  static const _detailModels = {'motion', 'muscles'};

  void _resetDetailModel({bool discardQueuedCommand = true}) {
    _detailModel = 'motion';
    if (discardQueuedCommand) _pending.remove('detail_model');
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
    if (!const {'ready', 'state', 'select', 'error'}.contains(type)) {
      return false;
    }
    if (type == 'error') {
      reportError('${event['errorCode'] ?? event['code'] ?? 'scene-error'}');
      return true;
    }
    final period = event['period'];
    if (period is num && period.isFinite && period > 0) {
      _period = period.toDouble();
    }
    final time = event['time'];
    if (time is num && time.isFinite) {
      _time = time.clamp(0, _period).toDouble();
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
      _selectionGeneration++;
      _selected = _groupId(event['groupId']);
      _playing = false;
    } else if (event.containsKey('selected')) {
      _selected = _groupId(event['selected']);
    }
    if (event.containsKey('detail')) {
      final detail = event['detail'];
      _detail = detail is bool ? (detail ? _selected : null) : _groupId(detail);
    }
    if (_detail == null || _playing) {
      // The scene may acknowledge its initial/previous state while a newer
      // native command is still in flight. Only an explicit host action such
      // as play, seek or closing detail can cancel a queued model choice.
      _resetDetailModel(discardQueuedCommand: false);
    } else if (_detailModels.contains(event['detailModel'])) {
      _detailModel = event['detailModel'] as String;
    }
    if (type == 'ready') {
      _ready = true;
      _errorCode = null;
    } else {
      if (event['ready'] is bool) _ready = event['ready'] as bool;
      if (event.containsKey('errorCode')) {
        final error = event['errorCode'];
        _errorCode = error is String ? error : null;
      }
    }
    notifyListeners();
    if (_ready) unawaited(_flush());
    return true;
  }

  static String? _groupId(Object? value) {
    if (value is String) return value;
    if (value is Map && value['groupId'] is String) {
      return value['groupId'] as String;
    }
    return null;
  }

  void reportError(String code) {
    if (_disposed) return;
    _ready = false;
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
    super.dispose();
  }
}
