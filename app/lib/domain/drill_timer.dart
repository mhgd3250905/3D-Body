import 'dose.dart';

enum TimerPhase {
  ready,
  countdown,
  work,
  paused,
  rest,
  nextSide,
  finished,
  abandoned,
}

class TimerSnapshot {
  const TimerSnapshot({
    required this.phase,
    required this.set,
    required this.sets,
    required this.side,
    required this.blockLabel,
    required this.remainingMs,
    required this.elapsedMs,
    required this.reps,
    required this.target,
    required this.completedSets,
    required this.activeWorkMs,
  });
  final TimerPhase phase;
  final int set;
  final int sets;
  final String? side;
  final String blockLabel;
  final int remainingMs;
  final int elapsedMs;
  final int reps;
  final int target;
  final int completedSets;
  final int activeWorkMs;
}

int Function() _monotonicClock() {
  final stopwatch = Stopwatch()..start();
  return () => stopwatch.elapsedMilliseconds;
}

/// A monotonic, manually driven training state machine. No interval counts are
/// accumulated and no transition spends overshoot time on a future exercise.
/// Call [suspendForBackground] when the app loses focus; resuming is deliberate.
class DrillTimer {
  DrillTimer(
    this.dose, {
    int? target,
    int Function()? now,
    this.maxUnattendedGapMs = 5000,
  }) : target = target ?? dose.min,
       _now = now ?? _monotonicClock() {
    if (this.target < dose.min ||
        this.target > dose.max ||
        maxUnattendedGapMs < 1) {
      throw ArgumentError('Target must stay within the displayed dose');
    }
    _side = dose.perSide ? 'left' : null;
    _lastTick = _readNow();
  }

  final Dose dose;
  final int target;
  final int maxUnattendedGapMs;
  final int Function() _now;
  TimerPhase _phase = TimerPhase.ready;
  TimerPhase _pausedFrom = TimerPhase.work;
  int _set = 1;
  String? _side;
  int _blockIndex = 0;
  int _blockStart = 0;
  int _blockDuration = 0;
  int _pausedAt = 0;
  int _terminalAt = 0;
  int _lastClock = 0;
  int _lastTick = 0;
  int _reps = 0;
  int _completedSets = 0;
  int _activeWorkMs = 0;

  int _readNow() {
    final current = _now();
    if (current > _lastClock) _lastClock = current;
    return _lastClock;
  }

  int _elapsed(int now) {
    if (_phase == TimerPhase.ready || _phase == TimerPhase.nextSide) return 0;
    final time = _phase == TimerPhase.paused
        ? _pausedAt
        : (_phase == TimerPhase.finished || _phase == TimerPhase.abandoned)
        ? _terminalAt
        : now;
    final elapsed = (time - _blockStart).clamp(0, 1 << 53);
    return _blockDuration > 0 ? elapsed.clamp(0, _blockDuration) : elapsed;
  }

  TimerSnapshot get snapshot {
    final elapsed = _elapsed(_readNow());
    final working =
        _phase == TimerPhase.work ||
        (_phase == TimerPhase.paused && _pausedFrom == TimerPhase.work);
    return TimerSnapshot(
      phase: _phase,
      set: _set,
      sets: dose.sets,
      side: _side,
      blockLabel: dose.blockLabels[_blockIndex],
      remainingMs: _blockDuration > 0
          ? (_blockDuration - elapsed).clamp(0, _blockDuration)
          : 0,
      elapsedMs: elapsed,
      reps: _reps,
      target: target,
      completedSets: _completedSets,
      activeWorkMs: _activeWorkMs + (working ? elapsed : 0),
    );
  }

  void _enter(TimerPhase phase, int now, [int duration = 0]) {
    _phase = phase;
    _blockStart = now;
    _blockDuration = duration;
    _lastTick = now;
    if (phase == TimerPhase.finished || phase == TimerPhase.abandoned) {
      _terminalAt = now;
    }
  }

  /// Also starts the next side or next named movement after the user is ready.
  void start() {
    if (_phase == TimerPhase.ready || _phase == TimerPhase.nextSide) {
      _enter(TimerPhase.countdown, _readNow(), 3000);
    }
  }

  void _startWork(int now) {
    _reps = 0;
    _enter(
      TimerPhase.work,
      now,
      dose.mode == DoseMode.time ? target * 1000 : 0,
    );
  }

  void _afterWork(int now) {
    _activeWorkMs += _elapsed(now);
    if (dose.perSide && _side == 'left') {
      _side = 'right';
      _enter(TimerPhase.nextSide, now);
      return;
    }
    if (_blockIndex + 1 < dose.blockLabels.length) {
      _blockIndex++;
      _side = dose.perSide ? 'left' : null;
      _enter(TimerPhase.nextSide, now);
      return;
    }
    _completedSets++;
    if (_set >= dose.sets) {
      _enter(TimerPhase.finished, now);
    } else {
      _enter(TimerPhase.rest, now, dose.restSec * 1000);
    }
  }

  void _nextSet(int now) {
    _set++;
    _side = dose.perSide ? 'left' : null;
    _blockIndex = 0;
    _enter(TimerPhase.countdown, now, 3000);
  }

  /// Tick advances at most one boundary. A stalled foreground poll pauses at
  /// the last observed instant instead of granting unattended exercise credit.
  void tick() {
    final now = _readNow();
    if ((_phase == TimerPhase.work || _phase == TimerPhase.countdown) &&
        now - _lastTick > maxUnattendedGapMs) {
      _freeze(_lastTick);
      _lastTick = now;
      return;
    }
    _lastTick = now;
    if (_phase == TimerPhase.countdown && _elapsed(now) >= _blockDuration) {
      _startWork(now);
    } else if (_phase == TimerPhase.work &&
        dose.mode == DoseMode.time &&
        _elapsed(now) >= _blockDuration) {
      _afterWork(now);
    } else if (_phase == TimerPhase.rest && _elapsed(now) >= _blockDuration) {
      _nextSet(now);
    }
  }

  void _freeze(int now) {
    _pausedFrom = _phase;
    _pausedAt = now;
    _phase = TimerPhase.paused;
  }

  void pause() {
    if (_phase == TimerPhase.work ||
        _phase == TimerPhase.rest ||
        _phase == TimerPhase.countdown) {
      final now = _readNow();
      final stalled =
          _phase != TimerPhase.rest && now - _lastTick > maxUnattendedGapMs;
      _freeze(stalled ? _lastTick : now);
    }
  }

  void suspendForBackground() => pause();

  void resume() {
    if (_phase != TimerPhase.paused) return;
    final now = _readNow();
    _blockStart += now - _pausedAt;
    _phase = _pausedFrom;
    _lastTick = now;
  }

  void rep() {
    tick();
    if (_phase == TimerPhase.work && dose.mode == DoseMode.reps) {
      _reps++;
      if (_reps >= target) _afterWork(_readNow());
    }
  }

  /// For manual prescriptions or a user-confirmed earlier end of a work block.
  /// When a dose is per-side, this confirms this side, not both sides at once.
  void completeSet() {
    tick();
    if (_phase == TimerPhase.work) _afterWork(_readNow());
  }

  void skipRest() {
    if (_phase == TimerPhase.rest) _nextSet(_readNow());
  }

  void addRest([int seconds = 15]) {
    if (_phase == TimerPhase.rest && seconds > 0) {
      _blockDuration += seconds * 1000;
    }
  }

  void abandon() {
    if (_phase == TimerPhase.finished || _phase == TimerPhase.abandoned) return;
    final now = _readNow();
    if (_phase == TimerPhase.work ||
        (_phase == TimerPhase.paused && _pausedFrom == TimerPhase.work)) {
      final stalled =
          _phase == TimerPhase.work && now - _lastTick > maxUnattendedGapMs;
      _activeWorkMs += _elapsed(stalled ? _lastTick : now);
    }
    _enter(TimerPhase.abandoned, now);
  }
}
