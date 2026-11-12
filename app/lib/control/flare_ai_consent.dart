import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// App-level consent for sending a conversation to a third-party model.
class FlareAiConsent extends ChangeNotifier {
  static const key = 'flare_ai_consent_v1';
  static const timestampKey = '${key}_at';

  bool _granted = false;
  bool get granted => _granted;

  Future<void>? _initialRead;
  Future<void> _writes = Future<void>.value();
  int _revision = 0;
  bool _disposed = false;

  Future<bool> read() async {
    await (_initialRead ??= _load());
    return granted;
  }

  Future<void> _load() async {
    try {
      final preferences = await SharedPreferences.getInstance();
      if (_revision != 0) return;
      final timestamp = preferences.getString(timestampKey);
      _setGranted(
        preferences.getBool(key) == true &&
            timestamp != null &&
            DateTime.tryParse(timestamp) != null,
      );
    } on Object {
      // Storage errors leave the network gate closed.
    }
  }

  Future<void> grant() {
    final revision = ++_revision;
    return _enqueue(() async {
      final preferences = await SharedPreferences.getInstance();
      final savedTimestamp = await preferences.setString(
        timestampKey,
        DateTime.now().toUtc().toIso8601String(),
      );
      if (!savedTimestamp || !await preferences.setBool(key, true)) {
        throw StateError('Could not save AI data sharing consent.');
      }
      if (revision == _revision) _setGranted(true);
    });
  }

  Future<void> withdraw() {
    ++_revision;
    _setGranted(false);
    return _enqueue(() async {
      final preferences = await SharedPreferences.getInstance();
      final clearedGrant = await preferences.remove(key);
      final clearedTimestamp = await preferences.remove(timestampKey);
      if (!clearedGrant || !clearedTimestamp) {
        throw StateError('Could not clear AI data sharing consent.');
      }
    });
  }

  Future<void> _enqueue(Future<void> Function() write) {
    final operation = _writes.then((_) => write());
    _writes = operation.then<void>(
      (_) {},
      onError: (Object _, StackTrace _) {},
    );
    return operation;
  }

  void _setGranted(bool value) {
    if (_disposed || _granted == value) return;
    _granted = value;
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _granted = false;
    super.dispose();
  }
}
