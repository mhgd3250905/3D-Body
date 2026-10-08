import 'dart:async';
import 'package:flutter/material.dart';
import '../control/learning_store.dart';
import '../domain/catalog_models.dart';
import '../domain/dose.dart';
import '../domain/drill_timer.dart';
import 'components.dart';
import 'content_pages.dart';
import 'theme.dart';

class TrainingTimerPage extends StatefulWidget {
  const TrainingTimerPage({
    super.key,
    required this.drill,
    required this.store,
    required this.onClose,
  });
  final Drill drill;
  final LearningStore store;
  final VoidCallback onClose;
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
      now: () => _clock.elapsedMilliseconds,
    );
    WidgetsBinding.instance.addObserver(this);
    _ticker = Timer.periodic(const Duration(milliseconds: 150), (_) {
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
    final finished =
        snap.phase == TimerPhase.finished || snap.phase == TimerPhase.abandoned;
    final title = switch (snap.phase) {
      TimerPhase.ready => s.timerReady,
      TimerPhase.countdown => s.countdown,
      TimerPhase.work => s.work,
      TimerPhase.rest => s.rest,
      TimerPhase.paused => s.paused,
      TimerPhase.nextSide => s.switchSide,
      TimerPhase.finished => s.finished,
      TimerPhase.abandoned => s.abandoned,
    };
    final timeMode = widget.drill.dose.mode == DoseMode.time;
    final clockPhase =
        snap.phase == TimerPhase.countdown || snap.phase == TimerPhase.rest;
    final value = finished
        ? '✓'
        : timeMode || clockPhase
        ? ((snap.remainingMs + 999) ~/ 1000).toString()
        : snap.reps.toString();
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) unawaited(_exit());
      },
      child: Column(
        children: [
          PageHeader(
            title: title,
            onBack: _saving ? null : () => unawaited(_exit()),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
              children: [
                Text(
                  widget.drill.name,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  s.setsLabel(snap.set, snap.sets) +
                      (snap.side == null
                          ? ''
                          : ' · ${snap.side == 'left' ? s.leftSide : s.rightSide}'),
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: FlareColors.muted),
                ),
                if (snap.blockLabel.isNotEmpty)
                  Text(
                    snap.blockLabel,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: FlareColors.accent),
                  ),
                const SizedBox(height: 26),
                Center(
                  child: SizedBox(
                    width: 230,
                    height: 230,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox.expand(
                          child: CircularProgressIndicator(
                            value: finished
                                ? 1
                                : timeMode && snap.phase == TimerPhase.work
                                ? (1 - snap.remainingMs / (snap.target * 1000))
                                      .clamp(0, 1)
                                : widget.drill.dose.mode == DoseMode.reps &&
                                      snap.phase == TimerPhase.work
                                ? (snap.reps / snap.target).clamp(0, 1)
                                : 0,
                            backgroundColor: FlareColors.raised,
                            strokeWidth: 5,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              value,
                              style: const TextStyle(
                                fontSize: 72,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            Text(
                              title,
                              style: const TextStyle(color: FlareColors.muted),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                if (widget.drill.dose.mode == DoseMode.manual)
                  BodyText(s.manualMode),
                if (_pain)
                  SurfaceCard(
                    child: BodyText(s.painMessage, color: Colors.amber),
                  ),
                if (_saving) Text(s.saving, textAlign: TextAlign.center),
                if (_saved)
                  Text(
                    s.saved,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: FlareColors.success),
                  ),
                if (_saveFailed) ...[
                  BodyText(s.saveFailed),
                  OutlinedButton(onPressed: _persist, child: Text(s.retry)),
                ],
                const SizedBox(height: 14),
                if (snap.phase == TimerPhase.ready ||
                    snap.phase == TimerPhase.nextSide)
                  FilledButton(
                    onPressed: () => setState(_timer.start),
                    child: Text(s.start),
                  ),
                if (snap.phase == TimerPhase.work &&
                    widget.drill.dose.mode == DoseMode.reps)
                  FilledButton(
                    onPressed: () => setState(_timer.rep),
                    child: Text(s.completeRep),
                  ),
                if (snap.phase == TimerPhase.work &&
                    widget.drill.dose.mode == DoseMode.manual)
                  FilledButton(
                    onPressed: () => setState(_timer.completeSet),
                    child: Text(s.completeSet),
                  ),
                if (snap.phase == TimerPhase.work &&
                    widget.drill.dose.mode != DoseMode.manual)
                  TextButton(
                    onPressed: () => setState(_timer.completeSet),
                    child: Text(s.completeSet),
                  ),
                if (snap.phase == TimerPhase.paused)
                  FilledButton(
                    onPressed: () => setState(_timer.resume),
                    child: Text(s.resume),
                  ),
                if ([
                  TimerPhase.work,
                  TimerPhase.countdown,
                  TimerPhase.rest,
                ].contains(snap.phase))
                  OutlinedButton(
                    onPressed: () => setState(_timer.pause),
                    child: Text(s.pause),
                  ),
                if (snap.phase == TimerPhase.rest)
                  Row(
                    children: [
                      Expanded(
                        child: TextButton(
                          onPressed: () => setState(_timer.skipRest),
                          child: Text(s.skipRest),
                        ),
                      ),
                      Expanded(
                        child: TextButton(
                          onPressed: () => setState(() => _timer.addRest()),
                          child: Text(s.addRest),
                        ),
                      ),
                    ],
                  ),
                if (finished)
                  FilledButton(
                    onPressed: _saving || _saveFailed ? null : widget.onClose,
                    child: Text(s.done),
                  ),
                if (!finished)
                  TextButton.icon(
                    onPressed: () {
                      setState(() {
                        _pain = true;
                        _timer.abandon();
                      });
                      unawaited(_persist());
                    },
                    icon: const Icon(
                      Icons.stop_circle_outlined,
                      color: Colors.amber,
                    ),
                    label: Text(
                      s.painStop,
                      style: const TextStyle(color: Colors.amber),
                    ),
                  ),
                const SizedBox(height: 18),
                BodyText(s.backgroundPause, color: FlareColors.muted),
                const SizedBox(height: 12),
                for (final cue in widget.drill.cues) BodyText('• $cue'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
