import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../data/catalog.dart';
import 'components.dart';
import 'motion.dart';
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
  bool _dragging = false;

  @override
  void didUpdateWidget(MotionTimeline old) {
    super.didUpdateWidget(old);
    // Scrubbing ticks once per pose boundary, like a detent wheel.
    if (_dragging && old.phase != widget.phase) FlareHaptics.selection();
  }

  void _setDragging(bool value) {
    if (_dragging != value) setState(() => _dragging = value);
  }

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
              // 8 equal segments with 4pt gaps; numbers centred under them.
              const gap = 4.0, count = 8;
              final seg = ((width - gap * (count - 1)) / count)
                  .clamp(1, double.infinity)
                  .toDouble();
              double xAt(double f) {
                final pos = (f * count).clamp(0, count).toDouble();
                final i = pos.floor().clamp(0, count - 1);
                return i * (seg + gap) + (pos - i) * seg;
              }

              double fractionAt(double x) {
                final i = (x / (seg + gap)).floor().clamp(0, count - 1);
                final within = ((x - i * (seg + gap)) / seg).clamp(0, 1);
                return (i + within) / count;
              }

              void seek(double x) => widget.onSeek(
                _timeAtFraction(fractionAt(x.clamp(0, width).toDouble())),
              );
              final fraction = _fractionAtTime(value);
              return GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTapDown: (event) => seek(event.localPosition.dx),
                onHorizontalDragStart: (event) {
                  _setDragging(true);
                  seek(event.localPosition.dx);
                },
                onHorizontalDragUpdate: (event) => seek(event.localPosition.dx),
                onHorizontalDragEnd: (_) => _setDragging(false),
                onHorizontalDragCancel: () => _setDragging(false),
                child: SizedBox(
                  height: 32,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Positioned(
                        left: 0,
                        right: 0,
                        top: 9,
                        child: Row(
                          children: [
                            for (var i = 0; i < count; i++) ...[
                              if (i != 0) const SizedBox(width: gap),
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(2),
                                  child: LinearProgressIndicator(
                                    minHeight: 3,
                                    value: (fraction * count - i).clamp(0, 1),
                                    backgroundColor: FlareColors.track,
                                    color: i < fraction * count - 1
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
                        left: xAt(fraction) - 6,
                        top: 4.5,
                        // The thumb swells under the finger while scrubbing.
                        child: AnimatedScale(
                          scale: _dragging ? 1.35 : 1,
                          duration: FlareMotion.of(context, FlareMotion.quick),
                          curve: FlareMotion.settle,
                          child: Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: FlareColors.palette.isDark
                                  ? Colors.white
                                  : FlareColors.surface,
                              border: FlareColors.palette.isDark
                                  ? null
                                  : Border.all(
                                      color: FlareColors.accent,
                                      width: 2,
                                    ),
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
                      ),
                      Positioned(
                        left: 0,
                        right: 0,
                        top: 17,
                        child: Row(
                          children: [
                            for (final (i, phase)
                                in widget.catalog.phases
                                    .take(count)
                                    .indexed) ...[
                              if (i != 0) const SizedBox(width: gap),
                              Expanded(
                                child: Text(
                                  phase.source.toString().padLeft(2, '0'),
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 9.5,
                                    height: 1.2,
                                    fontWeight: FontWeight.w600,
                                    color: phase.source == widget.phase
                                        ? FlareColors.accentInk
                                        : FlareColors.dim,
                                  ),
                                ),
                              ),
                            ],
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
