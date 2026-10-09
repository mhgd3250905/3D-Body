import 'dart:async';
import 'package:flutter/material.dart';
import '../control/learning_store.dart';
import '../domain/catalog_models.dart';
import '../domain/dose.dart';
import '../domain/drill_timer.dart';
import 'components.dart';
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
      setState(() {});
      if (_timer.snapshot.phase == TimerPhase.finished &&
          !_saved &&
          !_saving &&
          !_saveFailed) {
        unawaited(_persist());
      }
    });
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
      TimerPhase.nextSide => (s.start, () => setState(_timer.start)),
      TimerPhase.work when dose.mode == DoseMode.reps => (
        s.completeRep,
        () => setState(_timer.rep),
      ),
      TimerPhase.work => (s.completeSet, () => setState(_timer.completeSet)),
      TimerPhase.rest => (s.skipRest, () => setState(_timer.skipRest)),
      TimerPhase.paused => (s.resume, () => setState(_timer.resume)),
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
        if (!didPop) unawaited(_exit());
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
                        onPressed: _saving ? null : () => unawaited(_exit()),
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
                      child: Semantics(
                        key: const ValueKey('training-progress'),
                        value: '${(progress.clamp(0.0, 1.0) * 100).round()}%',
                        child: CustomPaint(
                          painter: _RingPainter(
                            progress.clamp(0.0, 1.0).toDouble(),
                            ringColor,
                          ),
                          child: Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  value,
                                  style: TextStyle(
                                    fontSize: 76,
                                    height: 1.05,
                                    fontWeight: FontWeight.w700,
                                    fontFeatures: [
                                      FontFeature.tabularFigures(),
                                    ],
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
                    ),
                  ),
                  SizedBox(height: 28),
                  Text(
                    widget.drill.name,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                  ),
                  if (widget.drill.cues.isNotEmpty) ...[
                    SizedBox(height: 8),
                    Text(
                      widget.drill.cues.first,
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
                        Container(
                          width: 22,
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
                        onPressed: () => setState(() => _timer.addRest()),
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
                  if (canPause) ...[
                    RoundIconButton(
                      icon: Icons.pause_rounded,
                      tooltip: s.pause,
                      diameter: 56,
                      onPressed: () => setState(_timer.pause),
                    ),
                    SizedBox(width: 12),
                  ],
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
