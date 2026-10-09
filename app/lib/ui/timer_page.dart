import 'dart:async';
import 'package:flutter/material.dart';
import '../control/learning_store.dart';
import '../domain/catalog_models.dart';
import '../domain/dose.dart';
import '../domain/drill_timer.dart';
import 'components.dart';
import 'motion.dart';
import 'theme.dart';

class TrainingTimerPage extends StatefulWidget {
  const TrainingTimerPage({
    super.key,
    required this.drill,
    required this.store,
    required this.onClose,
    this.now,
  });
  final Drill drill;
  final LearningStore store;
  final VoidCallback onClose;

  /// Optional monotonic clock for deterministic timer interaction tests.
  @visibleForTesting
  final int Function()? now;
  @override
  State<TrainingTimerPage> createState() => _TrainingTimerPageState();
}

class _TrainingTimerPageState extends State<TrainingTimerPage>
    with WidgetsBindingObserver {
  final Stopwatch _clock = Stopwatch();
  late final DrillTimer _timer;
  late final DateTime _startedAt;
  late final String _sessionId;
  Timer? _ticker;
  bool _pain = false;
  bool _saving = false;
  bool _saved = false;
  bool _saveFailed = false;
  bool _confirming = false;
  TimerPhase? _lastPhase;
  int? _lastCount;
  @override
  void initState() {
    super.initState();
    _startedAt = DateTime.now().toUtc();
    _sessionId = 'practice-${_startedAt.microsecondsSinceEpoch}';
    _clock.start();
    _timer = DrillTimer(
      widget.drill.dose,
      now: widget.now ?? () => _clock.elapsedMilliseconds,
    );
    WidgetsBinding.instance.addObserver(this);
    _ticker = Timer.periodic(Duration(milliseconds: 150), (_) {
      _timer.tick();
      if (!mounted) return;
      _feedback(_timer.snapshot);
      setState(() {});
      if (_timer.snapshot.phase == TimerPhase.finished &&
          !_saved &&
          !_saving &&
          !_saveFailed) {
        unawaited(_persist());
      }
    });
  }

  /// Haptics carry the timer when the phone is on the floor: a tick for each
  /// countdown second and the last three seconds of a timed block, a firm tap
  /// when work starts, a light one for rest, and a success pattern at the end.
  void _feedback(TimerSnapshot snap) {
    final phase = snap.phase;
    final timed =
        phase == TimerPhase.countdown ||
        phase == TimerPhase.rest ||
        (phase == TimerPhase.work && widget.drill.dose.mode == DoseMode.time);
    final count = timed ? (snap.remainingMs + 999) ~/ 1000 : null;
    if (count != null &&
        count != _lastCount &&
        count <= 3 &&
        count > 0 &&
        phase == _lastPhase) {
      FlareHaptics.selection();
    }
    _lastCount = count;
    if (phase == _lastPhase) return;
    final from = _lastPhase;
    _lastPhase = phase;
    if (from == null) return;
    switch (phase) {
      case TimerPhase.countdown:
        if (from != TimerPhase.paused) FlareHaptics.selection();
      case TimerPhase.work when from == TimerPhase.countdown:
        FlareHaptics.heavy();
      case TimerPhase.rest || TimerPhase.nextSide:
        FlareHaptics.medium();
      case TimerPhase.finished:
        FlareHaptics.success();
      default:
        break;
    }
  }

  void _act(VoidCallback action) {
    FlareHaptics.light();
    setState(action);
  }

  bool get _inProgress {
    final phase = _timer.snapshot.phase;
    return phase != TimerPhase.ready &&
        phase != TimerPhase.finished &&
        phase != TimerPhase.abandoned;
  }

  /// Closing mid-session asks first (the clock waits while it asks), so a
  /// stray tap on the corner never ends a workout.
  Future<void> _requestExit() async {
    if (_confirming) return;
    if (!_inProgress) return _exit();
    final running = const [
      TimerPhase.work,
      TimerPhase.countdown,
      TimerPhase.rest,
    ].contains(_timer.snapshot.phase);
    if (running) setState(_timer.pause);
    _confirming = true;
    final s = context.strings;
    final end = await showModalBottomSheet<bool>(
      context: context,
      sheetAnimationStyle: FlareMotion.sheetStyle(context),
      builder: (sheet) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                s.endSessionTitle,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                s.endSessionBody,
                style: TextStyle(
                  fontSize: 14,
                  height: 1.5,
                  color: FlareColors.secondary,
                ),
              ),
              const SizedBox(height: 22),
              PrimaryAction(
                label: s.keepTraining,
                onPressed: () => Navigator.pop(sheet, false),
              ),
              const SizedBox(height: 4),
              SizedBox(
                height: 48,
                child: TextButton(
                  onPressed: () => Navigator.pop(sheet, true),
                  child: Text(
                    s.endSessionConfirm,
                    style: TextStyle(
                      color: FlareColors.warning,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
    _confirming = false;
    if (!mounted) return;
    if (end == true) {
      await _exit();
    } else if (running && _timer.snapshot.phase == TimerPhase.paused) {
      setState(_timer.resume);
    }
  }

  Future<void> _persist() async {
    if (_saving || _saved || _timer.snapshot.phase == TimerPhase.ready) return;
    setState(() => _saving = true);
    final session = TrainingSession.fromTimer(
      id: _sessionId,
      drillId: widget.drill.id,
      startedAt: _startedAt,
      endedAt: DateTime.now().toUtc(),
      snapshot: _timer.snapshot,
      pain: _pain,
    );
    final result = await widget.store.logSession(session);
    if (!mounted) return;
    setState(() {
      _saving = false;
      _saved = result;
      _saveFailed = !result;
    });
  }

  Future<void> _exit() async {
    if (_timer.snapshot.phase != TimerPhase.finished) _timer.abandon();
    await _persist();
    if (mounted && (!_saveFailed || widget.store.persistenceBlocked)) {
      widget.onClose();
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state != AppLifecycleState.resumed) {
      _timer.suspendForBackground();
      if (mounted) setState(() {});
    }
  }

  @override
  void dispose() {
    _ticker?.cancel();
    _clock.stop();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final snap = _timer.snapshot;
    final dose = widget.drill.dose;
    final phase = snap.effectivePhase;
    final finished =
        snap.phase == TimerPhase.finished || snap.phase == TimerPhase.abandoned;
    final phaseTitle = switch (phase) {
      TimerPhase.ready => s.timerReady,
      TimerPhase.countdown => s.countdown,
      TimerPhase.work => s.work,
      TimerPhase.rest => s.rest,
      TimerPhase.paused => s.paused,
      TimerPhase.nextSide => s.switchSide,
      TimerPhase.finished => s.finished,
      TimerPhase.abandoned => s.abandoned,
    };
    final paused = snap.phase == TimerPhase.paused;
    final title = paused ? '$phaseTitle · ${s.paused}' : phaseTitle;
    final timeMode = dose.mode == DoseMode.time;
    final clockPhase =
        phase == TimerPhase.countdown || phase == TimerPhase.rest;
    final waiting =
        snap.phase == TimerPhase.ready || snap.phase == TimerPhase.nextSide;
    final value = finished
        ? '✓'
        : waiting
        ? snap.target.toString()
        : timeMode || clockPhase
        ? ((snap.remainingMs + 999) ~/ 1000).toString()
        : snap.reps.toString();
    final unit = finished
        ? title
        : waiting
        ? '${timeMode ? s.secondsUnit : s.countUnit} · $title'
        : clockPhase || timeMode
        ? '${s.secondsUnit} · $title'
        : dose.mode == DoseMode.reps
        ? '${s.ofReps(snap.target)}${paused ? ' · ${s.paused}' : ''}'
        : title;
    final progress = finished
        ? 1.0
        : clockPhase || timeMode && phase == TimerPhase.work
        ? 1 - snap.remainingMs / snap.durationMs.clamp(1, 1 << 30)
        : dose.mode == DoseMode.reps && phase == TimerPhase.work
        ? snap.reps / snap.target
        : 0.0;
    final ringColor = snap.phase == TimerPhase.rest || paused
        ? FlareColors.secondary
        : finished
        ? FlareColors.success
        : FlareColors.accent;
    final canPause = [
      TimerPhase.work,
      TimerPhase.countdown,
      TimerPhase.rest,
    ].contains(snap.phase);
    final (String, VoidCallback?)? primary = switch (snap.phase) {
      TimerPhase.ready ||
      TimerPhase.nextSide => (s.start, () => _act(_timer.start)),
      TimerPhase.work when dose.mode == DoseMode.reps => (
        s.completeRep,
        () => _act(_timer.rep),
      ),
      TimerPhase.work => (s.completeSet, () => _act(_timer.completeSet)),
      TimerPhase.rest => (s.skipRest, () => _act(_timer.skipRest)),
      TimerPhase.paused => (s.resume, () => _act(_timer.resume)),
      TimerPhase.finished || TimerPhase.abandoned => (
        s.done,
        _saving || _saveFailed ? null : widget.onClose,
      ),
      TimerPhase.countdown => null,
    };
    final side = snap.side == null
        ? null
        : snap.side == 'left'
        ? s.leftSide
        : s.rightSide;
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) unawaited(_requestExit());
      },
      child: ColoredBox(
        color: FlareColors.background,
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: SizedBox(
                height: 48,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: RoundIconButton(
                        icon: Icons.close_rounded,
                        tooltip: s.exitTimer,
                        onPressed: _saving
                            ? null
                            : () => unawaited(_requestExit()),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Eyebrow(s.setOfTotal(snap.set, snap.sets)),
                        if (side != null || snap.blockLabel.isNotEmpty)
                          Text(
                            [
                              if (snap.blockLabel.isNotEmpty) snap.blockLabel,
                              ?side,
                            ].join(' · '),
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.fromLTRB(24, 20, 24, 12),
                children: [
                  Center(
                    child: SizedBox.square(
                      dimension: 248,
                      child: Stack(
                        clipBehavior: Clip.none,
                        fit: StackFit.expand,
                        children: [
                          if (snap.phase == TimerPhase.finished)
                            const _FinishGlow(),
                          Semantics(
                            key: const ValueKey('training-progress'),
                            value:
                                '${(progress.clamp(0.0, 1.0) * 100).round()}%',
                            // The ring glides to each new value and colour
                            // instead of jumping per tick or per rep.
                            child: TweenAnimationBuilder<double>(
                              tween: Tween(
                                end: progress.clamp(0.0, 1.0).toDouble(),
                              ),
                              duration: FlareMotion.of(
                                context,
                                FlareMotion.enter,
                              ),
                              curve: FlareMotion.settle,
                              builder: (context, ringValue, child) =>
                                  TweenAnimationBuilder<Color?>(
                                    tween: ColorTween(end: ringColor),
                                    duration: FlareMotion.of(
                                      context,
                                      FlareMotion.fade,
                                    ),
                                    builder: (context, color, child) =>
                                        CustomPaint(
                                          painter: _RingPainter(
                                            ringValue,
                                            color ?? ringColor,
                                          ),
                                          child: child,
                                        ),
                                    child: child,
                                  ),
                              child: Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    // Each new count rolls up into place.
                                    AnimatedSwitcher(
                                      duration: FlareMotion.of(
                                        context,
                                        FlareMotion.collapse,
                                      ),
                                      switchInCurve: FlareMotion.settle,
                                      switchOutCurve: FlareMotion.exit,
                                      transitionBuilder: (child, animation) {
                                        final incoming =
                                            child.key == ValueKey(value);
                                        return FadeTransition(
                                          opacity: animation,
                                          child: SlideTransition(
                                            position: Tween(
                                              begin: Offset(
                                                0,
                                                incoming ? .32 : -.32,
                                              ),
                                              end: Offset.zero,
                                            ).animate(animation),
                                            child: child,
                                          ),
                                        );
                                      },
                                      child: _CountText(
                                        value,
                                        key: ValueKey(value),
                                        celebrate:
                                            snap.phase == TimerPhase.finished,
                                      ),
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      unit,
                                      style: TextStyle(
                                        color: FlareColors.dim,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 28),
                  Text(
                    widget.drill.name,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                  ),
                  if (snap.phase == TimerPhase.finished ||
                      widget.drill.cues.isNotEmpty) ...[
                    SizedBox(height: 8),
                    Text(
                      snap.phase == TimerPhase.finished
                          ? s.finishedLine(snap.completedSets)
                          : widget.drill.cues.first,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.5,
                        color: FlareColors.secondary,
                      ),
                    ),
                  ],
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      for (var i = 1; i <= snap.sets; i++)
                        AnimatedContainer(
                          duration: FlareMotion.of(context, FlareMotion.fade),
                          curve: FlareMotion.standard,
                          width: i == snap.set && !finished ? 30 : 22,
                          height: 3,
                          margin: EdgeInsets.symmetric(horizontal: 3),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(2),
                            color: i <= snap.completedSets
                                ? FlareColors.accent
                                : i == snap.set && !finished
                                ? FlareColors.accent.withValues(alpha: .45)
                                : FlareColors.controlBorder,
                          ),
                        ),
                    ],
                  ),
                  SizedBox(height: 18),
                  if (dose.mode == DoseMode.manual && !finished)
                    _note(s.manualMode),
                  if (_pain) _note(s.painMessage, color: FlareColors.warning),
                  if (_saving) _note(s.saving),
                  if (_saved) _note(s.saved, color: FlareColors.success),
                  if (_saveFailed) ...[
                    _note(s.saveFailed),
                    Center(
                      child: OutlinedButton(
                        onPressed: _persist,
                        child: Text(s.retry),
                      ),
                    ),
                  ],
                  if (snap.phase == TimerPhase.rest)
                    Center(
                      child: TextButton(
                        onPressed: () => _act(_timer.addRest),
                        child: Text(
                          s.addRest,
                          style: TextStyle(color: FlareColors.secondary),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(20, 4, 20, 4),
              child: Row(
                children: [
                  // The pause button slides in and out instead of making the
                  // primary button jump in width.
                  AnimatedSize(
                    duration: FlareMotion.of(context, FlareMotion.fade),
                    curve: FlareMotion.settle,
                    child: canPause
                        ? Padding(
                            padding: const EdgeInsets.only(right: 12),
                            child: RoundIconButton(
                              icon: Icons.pause_rounded,
                              tooltip: s.pause,
                              diameter: 56,
                              onPressed: () => _act(_timer.pause),
                            ),
                          )
                        : const SizedBox(height: 56),
                  ),
                  Expanded(
                    child: primary == null
                        ? SizedBox(height: 56)
                        : PrimaryAction(
                            label: primary.$1,
                            onPressed: primary.$2,
                          ),
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 44,
              child: finished
                  ? null
                  : TextButton.icon(
                      onPressed: () {
                        FlareHaptics.medium();
                        setState(() {
                          _pain = true;
                          _timer.abandon();
                        });
                        unawaited(_persist());
                      },
                      icon: Icon(
                        Icons.back_hand_outlined,
                        size: 16,
                        color: FlareColors.warning,
                      ),
                      label: Text(
                        s.painStop,
                        style: TextStyle(
                          color: FlareColors.warning,
                          fontSize: 13,
                        ),
                      ),
                    ),
            ),
            SizedBox(height: 6),
          ],
        ),
      ),
    );
  }

  Widget _note(String text, {Color? color}) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Text(
      text,
      textAlign: TextAlign.center,
      style: TextStyle(
        fontSize: 13,
        height: 1.5,
        color: color ?? FlareColors.dim,
      ),
    ),
  );
}

class _RingPainter extends CustomPainter {
  _RingPainter(this.progress, this.color);
  final double progress;
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    final rect = (Offset.zero & size).deflate(6);
    canvas.drawArc(
      rect,
      0,
      6.283185307,
      false,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 6
        ..color = FlareColors.track,
    );
    if (progress <= 0) return;
    canvas.drawArc(
      rect,
      -1.5707963,
      6.283185307 * progress,
      false,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 6
        ..strokeCap = StrokeCap.round
        ..color = color,
    );
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.progress != progress || old.color != color;
}

/// The big count. The finishing check springs in once; numbers stay still.
class _CountText extends StatelessWidget {
  const _CountText(this.value, {super.key, this.celebrate = false});
  final String value;
  final bool celebrate;
  @override
  Widget build(BuildContext context) {
    final text = Text(
      value,
      style: TextStyle(
        fontSize: 76,
        height: 1.05,
        fontWeight: FontWeight.w700,
        color: celebrate ? FlareColors.success : null,
        fontFeatures: const [FontFeature.tabularFigures()],
      ),
    );
    if (!celebrate) return text;
    // The finish is a drawn stroke, not a font glyph: it writes itself in
    // with the ring's weight and round caps, with a small spring.
    return Semantics(
      label: value,
      child: SizedBox(
        width: 84,
        height: 80,
        child: TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: 1),
          duration: FlareMotion.of(context, FlareMotion.celebrate),
          curve: Curves.linear,
          builder: (context, t, _) => Transform.scale(
            scale: .8 + .2 * FlareMotion.spring.transform(t),
            child: CustomPaint(
              painter: _CheckPainter(
                FlareMotion.settle.transform((t / .8).clamp(0, 1)),
                FlareColors.success,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CheckPainter extends CustomPainter {
  _CheckPainter(this.t, this.color);
  final double t;
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    if (t <= 0) return;
    final w = size.width, h = size.height;
    final path = Path()
      ..moveTo(w * .12, h * .54)
      ..lineTo(w * .4, h * .8)
      ..lineTo(w * .9, h * .18);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 9
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..color = color;
    final metric = path.computeMetrics().first;
    canvas.drawPath(metric.extractPath(0, metric.length * t), paint);
  }

  @override
  bool shouldRepaint(_CheckPainter old) => old.t != t || old.color != color;
}

/// One soft ring of light that leaves the finished ring and fades: a quiet
/// "done" instead of confetti.
class _FinishGlow extends StatelessWidget {
  const _FinishGlow();
  @override
  Widget build(BuildContext context) => IgnorePointer(
    child: TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: FlareMotion.of(context, FlareMotion.afterglow),
      curve: FlareMotion.settle,
      builder: (context, t, _) =>
          CustomPaint(painter: _GlowPainter(t, FlareColors.success)),
    ),
  );
}

class _GlowPainter extends CustomPainter {
  _GlowPainter(this.t, this.color);
  final double t;
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    if (t >= 1) return;
    final radius = (size.shortestSide / 2 - 6) * (1 + .14 * t);
    canvas.drawCircle(
      size.center(Offset.zero),
      radius,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 6 * (1 - t) + 1
        ..color = color.withValues(alpha: .45 * (1 - t))
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6),
    );
  }

  @override
  bool shouldRepaint(_GlowPainter old) => old.t != t || old.color != color;
}
