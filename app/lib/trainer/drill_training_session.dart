import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer/engine.dart' as trainer;

import '../domain/dose.dart';
import '../domain/drill_timer.dart' show TimerPhase, TimerSnapshot;

/// FlareLab's dose/interaction adapter. The SDK owns phase advancement and
/// work visits; the app keeps manual taps and the established left-first,
/// user-confirmed segment changes. No video or animation clock drives training.
class DrillTrainingSession {
  DrillTrainingSession(
    this.dose, {
    required String drillId,
    required String title,
    required this.now,
    this.maxUnattendedGapMs = 5000,
  }) {
    final items = [
      for (final label in dose.blockLabels)
        coach.PlanItem(
          exerciseId: drillId,
          mode: dose.mode == DoseMode.time
              ? coach.DoseMode.time
              : coach.DoseMode.reps,
          sets: dose.sets,
          reps: dose.mode == DoseMode.time ? null : dose.min.clamp(1, 1000000),
          workSeconds: dose.mode == DoseMode.time ? dose.min : null,
          perSide: dose.perSide,
          restSeconds: dose.restSec,
          note: [label, dose.raw].where((s) => s.isNotEmpty).join(' · '),
        ),
    ];
    plan = coach.TrainingPlan(
      id: 'practice-$drillId',
      source: 'template',
      title: title,
      goal: 'flare',
      scene: 'home',
      level: 1,
      targetMinutes:
          ((dose.sets *
                          dose.blocksPerSet *
                          (3 +
                              (dose.mode == DoseMode.time
                                  ? dose.min
                                  : dose.min.clamp(1, 1000000) * 3)) +
                      (dose.sets - 1) * dose.restSec) /
                  60)
              .ceil()
              .clamp(1, 1000000),
      blocks: [
        coach.PlanBlock(
          id: drillId,
          name: title,
          type: coach.BlockType.main,
          items: items,
        ),
      ],
      notes: [dose.raw],
    );
    final phases = <trainer.SessionPhase>[];
    for (var set = 1; set <= dose.sets; set++) {
      for (var block = 0; block < items.length; block++) {
        final sides = dose.perSide
            ? <trainer.Side?>[trainer.Side.left, trainer.Side.right]
            : <trainer.Side?>[null];
        for (final side in sides) {
          trainer.SessionPhase phase(
            trainer.PhaseKind kind,
            double seconds, {
            bool selfPaced = false,
          }) => trainer.SessionPhase(
            kind: kind,
            seconds: seconds,
            exerciseId: drillId,
            item: items[block],
            // Distinct segments must not share the SDK completion identity.
            itemIndex: block,
            itemInBlock: block,
            blockIndex: 0,
            blockName: dose.blockLabels[block],
            set: set,
            sets: dose.sets,
            side: side,
            reps: dose.mode == DoseMode.reps ? dose.min : null,
            selfPaced: selfPaced,
            rhythm: dose.mode == DoseMode.time
                ? trainer.Rhythm.timedHold
                : trainer.Rhythm.selfPacedReps,
          );
          if (block > 0 || side == trainer.Side.right) {
            // A public self-paced phase waits until the user is ready. It
            // deliberately has no automatic switch countdown or work credit.
            phases.add(phase(trainer.PhaseKind.switchSide, 0, selfPaced: true));
          }
          phases.add(phase(trainer.PhaseKind.prep, 3));
          phases.add(
            phase(
              trainer.PhaseKind.work,
              dose.mode == DoseMode.time ? dose.min.toDouble() : 0,
              selfPaced: dose.mode != DoseMode.time,
            ),
          );
        }
      }
      if (set < dose.sets) {
        final previous = phases.last;
        phases.add(
          _copy(
            previous,
            kind: trainer.PhaseKind.rest,
            seconds: dose.restSec.toDouble(),
            selfPaced: false,
            set: set + 1,
          ),
        );
      }
    }
    phases.add(
      trainer.SessionPhase(
        kind: trainer.PhaseKind.done,
        seconds: 0,
        itemIndex: items.length,
      ),
    );
    engine = trainer.SessionEngine(phases);
    _runner = trainer.SessionRunner(
      engine,
      _FlareSessionScript(source: trainer.DrillPackVoiceSource.empty),
    );
    _lastClock = now();
  }

  final Dose dose;
  final int Function() now;
  final int maxUnattendedGapMs;
  late final coach.TrainingPlan plan;
  late final trainer.SessionEngine engine;
  late trainer.SessionRunner _runner;
  void Function(List<trainer.FiredCue>, double)? onCues;
  int _lastClock = 0;
  double _time = 0;
  bool _started = false;
  bool _paused = false;
  int _reps = 0;
  double _restElapsed = 0;
  double? _restDuration;

  double get activeSeconds => _time;
  double get expectedSeconds => engine.phases.fold(
    0,
    (n, p) =>
        n + (p.isWork && p.selfPaced ? dose.min.clamp(1, 1000) * 3 : p.seconds),
  );

  void configureVoice(trainer.VoiceSource source, String language) {
    _runner = trainer.SessionRunner(
      engine,
      _FlareSessionScript(source: source, lang: language),
    );
  }

  TimerPhase get _phase {
    if (!_started) return TimerPhase.ready;
    if (engine.done) {
      return engine.endedEarly ? TimerPhase.abandoned : TimerPhase.finished;
    }
    return switch (engine.phase.kind) {
      trainer.PhaseKind.prep => TimerPhase.countdown,
      trainer.PhaseKind.work => TimerPhase.work,
      trainer.PhaseKind.switchSide => TimerPhase.nextSide,
      trainer.PhaseKind.rest || trainer.PhaseKind.roundRest => TimerPhase.rest,
      trainer.PhaseKind.done => TimerPhase.finished,
    };
  }

  TimerSnapshot get snapshot {
    final phase = _phase;
    final current = engine.done ? engine.initialWorkPhases.last : engine.phase;
    final completed = <(int, int, trainer.Side?)>{
      for (final v in engine.visits)
        if (v.phase.isWork &&
            (v.exit == trainer.PhaseExit.natural ||
                v.exit == trainer.PhaseExit.completed))
          (v.phase.set, v.phase.itemInBlock, v.phase.side),
    };
    var completedSets = 0;
    for (var set = 1; set <= dose.sets; set++) {
      final required = engine.initialWorkPhases.where((p) => p.set == set);
      if (required.every(
        (p) => completed.contains((p.set, p.itemInBlock, p.side)),
      )) {
        completedSets++;
      }
    }
    final elapsed =
        engine.elapsedIn(_time) + (phase == TimerPhase.rest ? _restElapsed : 0);
    final duration = phase == TimerPhase.rest
        ? _restDuration ?? current.seconds
        : current.seconds;
    final work =
        engine.visits
            .where((v) => v.phase.isWork)
            .fold(0.0, (sum, v) => sum + v.seconds) +
        (!engine.done && current.isWork ? engine.elapsedIn(_time) : 0);
    return TimerSnapshot(
      phase: _paused ? TimerPhase.paused : phase,
      pausedFrom: _paused ? phase : null,
      durationMs: (duration * 1000).round(),
      // SDK rest metadata names the upcoming set for spoken ordinal cues.
      // FlareLab's header retains the just-completed set until prep begins.
      set: phase == TimerPhase.rest ? current.set - 1 : current.set,
      sets: dose.sets,
      side: current.side?.name,
      blockLabel: current.blockName,
      remainingMs: !_started || engine.done || current.selfPaced
          ? 0
          : (engine.remainingIn(_time) * 1000).round(),
      elapsedMs: (elapsed * 1000).round(),
      reps: _reps,
      target: dose.min,
      completedSets: completedSets,
      activeWorkMs: (work * 1000).round(),
    );
  }

  void _emit(List<trainer.FiredCue> cues) => onCues?.call(cues, _time);

  void _changed(int generation) {
    if (engine.generation != generation) {
      _reps = 0;
      _restElapsed = 0;
      _restDuration = null;
    }
  }

  /// The SDK consumes monotonic active time. Preserve FlareLab's deliberate
  /// resume after a foreground stall and never spend overshoot on a new set.
  void tick() {
    final raw = now();
    final delta = (raw - _lastClock).clamp(0, 9007199254740991);
    if (raw > _lastClock) _lastClock = raw;
    if (!_started || _paused || engine.done || _phase == TimerPhase.nextSide) {
      return;
    }
    if (delta > maxUnattendedGapMs && _phase != TimerPhase.rest) {
      _paused = true;
      return;
    }
    final generation = engine.generation;
    final proposed = ((_time * 1000).round() + delta) / 1000;
    final boundary = engine.phaseStart + engine.phase.seconds;
    final reachedBoundary = !engine.phase.selfPaced && proposed >= boundary;
    _time = engine.phase.selfPaced ? proposed : proposed.clamp(_time, boundary);
    // SDK compares (t - phaseStart) >= seconds. At a fractional boundary,
    // e.g. 6.001 - 3.001, floating-point subtraction can fall just below 3.
    // Nudge only the update probe; keep recorded active time exactly capped
    // so no overshoot is credited to the following exercise.
    _emit(_runner.update(reachedBoundary ? boundary + 1e-9 : _time));
    _changed(generation);
  }

  void start() {
    if (!_started) {
      _started = true;
      _lastClock = now();
      _emit(_runner.update(_time));
    } else if (_phase == TimerPhase.nextSide && !_paused) {
      _lastClock = now();
      final generation = engine.generation;
      _emit(_runner.completeSet(_time));
      _changed(generation);
    }
  }

  void pause() {
    if (!_started || engine.done || _phase == TimerPhase.nextSide || _paused) {
      return;
    }
    tick();
    if (!engine.done) _paused = true;
  }

  void suspendForBackground() => pause();
  void resume() {
    if (!_paused) return;
    _lastClock = now();
    _paused = false;
  }

  void rep() {
    tick();
    if (_paused || _phase != TimerPhase.work || dose.mode != DoseMode.reps) {
      return;
    }
    _reps++;
    if (_reps >= dose.min) completeSet();
  }

  /// SDK only completes self-paced work. Convert just the remainder through
  /// its public replacement API, keeping the spent work visit and identity.
  /// This adapter can be removed when SDK exposes completeTimedSet directly.
  void completeSet() {
    tick();
    if (_paused || _phase != TimerPhase.work) return;
    final generation = engine.generation;
    if (!engine.phase.selfPaced) {
      final replacement = _copy(engine.phase, seconds: 0, selfPaced: true);
      _runner.restartWith([
        replacement,
        ...engine.phases.skip(engine.index + 1),
      ], _time);
    }
    _emit(_runner.completeSet(_time));
    _changed(generation);
  }

  void skipRest() {
    tick();
    if (_paused || _phase != TimerPhase.rest) return;
    // Finish only the current rest, retaining the following 3-second prep.
    final generation = engine.generation;
    final rest = _copy(engine.phase, seconds: 0);
    _runner.restartWith(
      [rest, ...engine.phases.skip(engine.index + 1)],
      _time,
      withRest: true,
    );
    _emit(_runner.update(_time));
    _changed(generation);
  }

  void addRest([int seconds = 15]) {
    tick();
    if (_paused || _phase != TimerPhase.rest || seconds <= 0) return;
    final p = engine.phase;
    _restDuration = (_restDuration ?? p.seconds) + seconds;
    _restElapsed += engine.elapsedIn(_time);
    final rest = _copy(p, seconds: engine.remainingIn(_time) + seconds);
    _runner.restartWith(
      [rest, ...engine.phases.skip(engine.index + 1)],
      _time,
      withRest: true,
    );
    _emit(_runner.update(_time));
  }

  void abandon() {
    if (engine.done) return;
    tick();
    _runner.finish(_time);
    _paused = false;
    _started = true;
  }

  static trainer.SessionPhase _copy(
    trainer.SessionPhase p, {
    trainer.PhaseKind? kind,
    double? seconds,
    bool? selfPaced,
    int? set,
  }) => trainer.SessionPhase(
    kind: kind ?? p.kind,
    seconds: seconds ?? p.seconds,
    exerciseId: p.exerciseId,
    item: p.item,
    itemIndex: p.itemIndex,
    itemInBlock: p.itemInBlock,
    blockIndex: p.blockIndex,
    blockName: p.blockName,
    set: set ?? p.set,
    sets: p.sets,
    side: p.side,
    reps: p.reps,
    rhythm: p.rhythm,
    selfPaced: selfPaced ?? p.selfPaced,
  );
}

/// A bilateral multi-segment dose (Y → T → W) changes segments, not sides.
/// The SDK's switchSide default assumes a left switch when side is absent.
class _FlareSessionScript extends trainer.SessionScript {
  _FlareSessionScript({required super.source, super.lang});

  @override
  List<trainer.VoiceCue> cues(
    trainer.SessionPhase p, {
    required double planSeconds,
    bool bySkip = false,
  }) {
    if (p.kind == trainer.PhaseKind.switchSide && p.side == null) {
      return [
        if (source.has('chime.end', lang: lang))
          trainer.VoiceCue(0, ['chime.end'], trainer.CuePriority.call),
      ];
    }
    return super.cues(p, planSeconds: planSeconds, bySkip: bySkip);
  }
}
