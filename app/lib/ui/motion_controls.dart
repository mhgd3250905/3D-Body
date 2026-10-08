import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../data/catalog.dart';
import 'components.dart';
import 'theme.dart';

/// A compact, accessible scrubber. Its eight segments represent the eight
/// source poses; seeking still uses the scene's real animation time.
class MotionTimeline extends StatefulWidget {
  const MotionTimeline({
    super.key,
    required this.catalog,
    required this.time,
    required this.phase,
    required this.onSeek,
  });

  final Catalog catalog;
  final double time;
  final int phase;
  final ValueChanged<double> onSeek;

  @override
  State<MotionTimeline> createState() => _MotionTimelineState();
}

class _MotionTimelineState extends State<MotionTimeline> {
  bool _focused = false;

  // Pin the real source poses to their printed ticks. Interpolation between
  // ticks uses their original durations; the scene still owns actual time.
  double _fractionAtTime(double time) {
    final phases = widget.catalog.phases;
    final count = phases.length;
    for (var i = 0; i < count - 1; i++) {
      final start = widget.catalog.phaseTime(phases[i].source);
      final end = widget.catalog.phaseTime(phases[i + 1].source);
      if (time <= end) {
        final within = ((time - start) / (end - start)).clamp(0, 1);
        return (i + .5 + within) / count;
      }
    }
    final last = widget.catalog.phaseTime(phases.last.source);
    final within = ((time - last) / (widget.catalog.period - last)).clamp(0, 1);
    return (count - .5 + .5 * within) / count;
  }

  double _timeAtFraction(double fraction) {
    final phases = widget.catalog.phases;
    final count = phases.length;
    final position = (fraction * count - .5).clamp(0, count - .5);
    final index = position.floor().clamp(0, count - 1).toInt();
    final start = widget.catalog.phaseTime(phases[index].source);
    if (index == count - 1) {
      return start + (position - index) * 2 * (widget.catalog.period - start);
    }
    final end = widget.catalog.phaseTime(phases[index + 1].source);
    return start + (position - index) * (end - start);
  }

  void _step(double delta) => widget.onSeek(
    (widget.time + delta).clamp(0, widget.catalog.period).toDouble(),
  );

  @override
  Widget build(BuildContext context) {
    final period = widget.catalog.period;
    final value = widget.time.clamp(0, period).toDouble();
    final s = context.strings;
    return Semantics(
      slider: true,
      label: s.timeline,
      value: '${value.toStringAsFixed(1)} / ${period.toStringAsFixed(1)} s',
      increasedValue: '${(value + .1).clamp(0, period).toStringAsFixed(1)} s',
      decreasedValue: '${(value - .1).clamp(0, period).toStringAsFixed(1)} s',
      onIncrease: () => _step(.1),
      onDecrease: () => _step(-.1),
      child: FocusableActionDetector(
        onShowFocusHighlight: (value) => setState(() => _focused = value),
        shortcuts: const {
          SingleActivator(LogicalKeyboardKey.arrowLeft): _SeekIntent(-.1),
          SingleActivator(LogicalKeyboardKey.arrowRight): _SeekIntent(.1),
          SingleActivator(LogicalKeyboardKey.home): _SeekIntent(
            double.negativeInfinity,
          ),
          SingleActivator(LogicalKeyboardKey.end): _SeekIntent(double.infinity),
        },
        actions: {
          _SeekIntent: CallbackAction<_SeekIntent>(
            onInvoke: (intent) {
              _step(intent.delta);
              return null;
            },
          ),
        },
        child: ExcludeSemantics(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final width = constraints.maxWidth;
              void seek(double x) =>
                  widget.onSeek(_timeAtFraction((x / width).clamp(0, 1)));
              final fraction = _fractionAtTime(value);
              return GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTapDown: (event) => seek(event.localPosition.dx),
                onHorizontalDragStart: (event) => seek(event.localPosition.dx),
                onHorizontalDragUpdate: (event) => seek(event.localPosition.dx),
                child: SizedBox(
                  height: 40,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Positioned(
                        left: 0,
                        right: 0,
                        top: 15,
                        child: Row(
                          children: [
                            for (var i = 0; i < 8; i++) ...[
                              if (i != 0) const SizedBox(width: 3),
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(2),
                                  child: LinearProgressIndicator(
                                    minHeight: 3,
                                    value: (fraction * 8 - i).clamp(0, 1),
                                    backgroundColor: const Color(0xff303035),
                                    color: i < fraction * 8 - 1
                                        ? FlareColors.accent.withValues(
                                            alpha: .55,
                                          )
                                        : FlareColors.accent,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      Positioned(
                        left: (width - 12) * fraction,
                        top: 10.5,
                        child: Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: FlareColors.accent.withValues(
                                  alpha: .35,
                                ),
                                spreadRadius: _focused ? 5 : 3,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        left: 0,
                        right: 0,
                        top: 25,
                        child: Row(
                          children: [
                            for (final phase in widget.catalog.phases)
                              Expanded(
                                child: Text(
                                  phase.source.toString().padLeft(2, '0'),
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 9.5,
                                    height: 1.2,
                                    fontWeight: FontWeight.w600,
                                    color: phase.source == widget.phase
                                        ? const Color(0xffff8a63)
                                        : const Color(0xff63636b),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _SeekIntent extends Intent {
  const _SeekIntent(this.delta);
  final double delta;
}
