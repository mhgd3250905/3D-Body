import 'dart:async';

import 'package:ugk_trainer/ugk_trainer.dart';

/// One app-scoped audio output, as required by the SDK. Old training routes
/// cannot deactivate the audio session owned by a newer route. Lifecycle
/// operations are serialized, including a slow OS audio-session shutdown.
final trainerAudio = TrainerAudioPool();

class TrainerAudioPool {
  TrainerAudioPool({VoiceOutput Function()? create})
    : _create = create ?? JustAudioVoiceOutput.new;

  final VoiceOutput Function() _create;
  VoiceOutput? _output;
  int _owner = 0;
  Future<void> _lifecycle = Future<void>.value();

  VoiceOutput _getOutput() => _output ??= _create();

  TrainerAudioLease acquire() {
    _getOutput();
    final hadOwner = _owner > 0;
    final lease = TrainerAudioLease._(this, ++_owner);
    if (hadOwner) {
      // Claiming a ready screen also silences its predecessor, even if the
      // old route's deferred dispose has not run yet. Begin joins this queue.
      unawaited(_run(_owner, (out) => out.end()).catchError((Object _) {}));
    }
    return lease;
  }

  Future<void> _run(int owner, Future<void> Function(VoiceOutput) action) {
    final next = _lifecycle.then((_) async {
      if (owner == _owner) await action(_getOutput());
    });
    // A platform failure must not poison later sessions' lifecycle queue.
    _lifecycle = next.catchError((Object _) {});
    return next;
  }
}

class TrainerAudioLease implements VoiceOutput, InterruptibleVoiceOutput {
  TrainerAudioLease._(this._pool, this._owner);
  final TrainerAudioPool _pool;
  final int _owner;
  bool get _current => _owner == _pool._owner;

  @override
  Future<void> begin() => _pool._run(_owner, (out) => out.begin());
  @override
  Future<void> end() => _pool._run(_owner, (out) => out.end());
  @override
  Future<void> reactivate() => _pool._run(_owner, (out) async {
    if (out is InterruptibleVoiceOutput) {
      await (out as InterruptibleVoiceOutput).reactivate();
    } else {
      await out.begin();
    }
  });

  Future<void> _play(Future<void> Function(VoiceOutput) action) async {
    await _pool._lifecycle;
    if (_current) await action(_pool._getOutput());
  }

  @override
  Future<void> speak(List<String> assets) => _play((out) => out.speak(assets));
  @override
  Future<void> chime(String asset) => _play((out) => out.chime(asset));
  @override
  Future<void> stopSpeech() => _play((out) => out.stopSpeech());
  @override
  set volume(double value) {
    if (_current) _pool._getOutput().volume = value;
  }

  @override
  Stream<AudioInterruption> get interruptions {
    final output = _pool._getOutput();
    return output is InterruptibleVoiceOutput
        ? (output as InterruptibleVoiceOutput).interruptions.where(
            (_) => _current,
          )
        : const Stream<AudioInterruption>.empty();
  }
}
