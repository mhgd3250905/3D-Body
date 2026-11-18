import 'package:flutter/foundation.dart';
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
    this.onSettle,
    this.connectedNodes = false,
    this.playhead,
  });

  final Catalog catalog;
  final double time;
  final int phase;
  final ValueChanged<double> onSeek;

  /// Lets a host snap a tap, keyboard step, or completed scrub to a pose.
  final ValueChanged<double>? onSettle;
  final bool connectedNodes;

  /// Rendered scene time. Keeps the playhead moving without rebuilding the
  /// enclosing scene or transport for each frame.
  final ValueListenable<double>? playhead;

  @override
  State<MotionTimeline> createState() => _MotionTimelineState();
}

class _MotionTimelineState extends State<MotionTimeline> {
  double? _scrubTime;
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

  double _stepTime(double delta) {
    if (widget.onSettle == null) {
      final time = widget.playhead?.value ?? widget.time;
      return (time + delta).clamp(0, widget.catalog.period).toDouble();
    }
    final phases = widget.catalog.phases;
    if (delta == double.negativeInfinity) {
      return widget.catalog.phaseTime(phases.first.source);
    }
    if (delta == double.infinity) {
      return widget.catalog.phaseTime(phases.last.source);
    }
    final index = phases.indexWhere((phase) => phase.source == widget.phase);
    final next = (index + delta.sign.toInt()).clamp(0, phases.length - 1);
    return widget.catalog.phaseTime(phases[next].source);
  }

  void _step(double delta) {
    (widget.onSettle ?? widget.onSeek)(_stepTime(delta));
  }

  void _preview(double time) {
    _scrubTime = time;
    widget.onSeek(time);
  }

  void _finishDrag() {
    _setDragging(false);
    final time = _scrubTime;
    _scrubTime = null;
    if (time != null) widget.onSettle?.call(time);
  }

  @override
  Widget build(BuildContext context) {
    final period = widget.catalog.period;
    final value = widget.time.clamp(0, period).toDouble();
    final s = context.strings;
    return Semantics(
      slider: true,
      label: s.timeline,
      value: '${value.toStringAsFixed(1)} / ${period.toStringAsFixed(1)} s',
      increasedValue: '${_stepTime(.1).toStringAsFixed(1)} s',
      decreasedValue: '${_stepTime(-.1).toStringAsFixed(1)} s',
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
              final nodes = widget.connectedNodes;
              // 8 equal segments with 4pt gaps; numbers centred under them.
              const gap = 4.0, count = 8;
              final seg = ((width - gap * (count - 1)) / count)
                  .clamp(1, double.infinity)
                  .toDouble();
              final step = seg + gap;
              final lastTick = (count - 1) * step + seg / 2;
              double xAt(double fraction) {
                final position = fraction * count - .5;
                if (position <= count - 1) return seg / 2 + position * step;
                return lastTick + (position - (count - 1)) * seg;
              }

              double fractionAt(double x) {
                if (nodes) {
                  final ratio =
                      ((x - _MotionNodes.endInset) /
                              (width - 2 * _MotionNodes.endInset))
                          .clamp(0, 1);
                  return (.5 + ratio * (count - 1)) / count;
                }
                if (x <= lastTick) return (.5 + (x - seg / 2) / step) / count;
                return (count - .5 + (x - lastTick) / seg) / count;
              }

              double timeAt(double x) =>
                  _timeAtFraction(fractionAt(x.clamp(0, width).toDouble()));
              final settle = widget.onSettle;
              return GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTapDown: settle == null
                    ? (event) => widget.onSeek(timeAt(event.localPosition.dx))
                    : null,
                onTapUp: settle == null
                    ? null
                    : (event) => settle(timeAt(event.localPosition.dx)),
                onHorizontalDragStart: (event) {
                  _setDragging(true);
                  _preview(timeAt(event.localPosition.dx));
                },
                onHorizontalDragUpdate: (event) =>
                    _preview(timeAt(event.localPosition.dx)),
                onHorizontalDragEnd: (_) => _finishDrag(),
                onHorizontalDragCancel: _finishDrag,
                child: nodes
                    ? _MotionNodes(
                        count: count,
                        selected: widget.catalog.phases.indexWhere(
                          (phase) => phase.source == widget.phase,
                        ),
                        focused: _focused,
                        width: width,
                      )
                    : _buildPlayhead(value, (time) {
                        final x = xAt(_fractionAtTime(time));
                        return SizedBox(
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
                                          borderRadius: BorderRadius.circular(
                                            2,
                                          ),
                                          child: LinearProgressIndicator(
                                            minHeight: 3,
                                            value: ((x - i * step) / seg).clamp(
                                              0,
                                              1,
                                            ),
                                            backgroundColor: FlareColors.track,
                                            color: x > i * step + seg
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
                                key: const ValueKey('motion-timeline-thumb'),
                                left: x - 6,
                                top: 4.5,
                                // The thumb swells under the finger while scrubbing.
                                child: AnimatedScale(
                                  scale: _dragging ? 1.35 : 1,
                                  duration: FlareMotion.of(
                                    context,
                                    FlareMotion.quick,
                                  ),
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
                                          phase.source.toString().padLeft(
                                            2,
                                            '0',
                                          ),
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
                        );
                      }),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildPlayhead(double time, Widget Function(double) builder) {
    final playhead = widget.playhead;
    if (playhead == null) return builder(time);
    return ValueListenableBuilder<double>(
      valueListenable: playhead,
      builder: (_, time, _) => builder(time),
    );
  }
}

/// Transition only the pose title, without animating the transport geometry.
class MotionPhaseLabel extends StatelessWidget {
  const MotionPhaseLabel({super.key, required this.phase, required this.child});

  final int phase;
  final Widget child;

  @override
  Widget build(BuildContext context) => AnimatedSwitcher(
    duration: FlareMotion.of(context, const Duration(milliseconds: 180)),
    layoutBuilder: (current, previous) => Stack(
      alignment: AlignmentDirectional.topStart,
      fit: StackFit.passthrough,
      clipBehavior: Clip.none,
      children: [
        for (final label in previous)
          Positioned(
            left: 0,
            right: 0,
            top: 0,
            child: ExcludeSemantics(child: IgnorePointer(child: label)),
          ),
        ?current,
      ],
    ),
    child: KeyedSubtree(key: ValueKey(phase), child: child),
  );
}

class _MotionNodes extends StatelessWidget {
  const _MotionNodes({
    required this.count,
    required this.selected,
    required this.focused,
    required this.width,
  });

  static const endInset = 12.0;
  final int count;
  final int selected;
  final bool focused;
  final double width;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final duration = FlareMotion.reduced(context)
        ? Duration.zero
        : const Duration(milliseconds: 220);
    const curve = Curves.easeOutCubic;
    final lineWidth = width - 2 * endInset;
    final step = lineWidth / (count - 1);
    final pendingLine = p.track;
    final pendingNode = p.isDark ? p.selectedSegment : p.controlBorder;
    return SizedBox(
      height: 52,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            left: endInset,
            right: endInset,
            top: 25,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: pendingLine,
                borderRadius: BorderRadius.circular(1),
              ),
              child: Align(
                alignment: Alignment.centerLeft,
                child: AnimatedContainer(
                  width: selected * step,
                  height: 2,
                  duration: duration,
                  curve: curve,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(1),
                    gradient: LinearGradient(
                      colors: [
                        p.accent.withValues(alpha: .25),
                        p.accent.withValues(alpha: .70),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          for (var index = 0; index < count; index++)
            Positioned(
              left: index * step,
              top: 0,
              bottom: 0,
              width: 24,
              child: Center(
                child: AnimatedContainer(
                  duration: duration,
                  curve: curve,
                  width: index == selected ? 24 : 10,
                  height: index == selected ? 24 : 10,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: index == selected
                        ? p.background
                        : index < selected
                        ? p.accent.withValues(alpha: .60)
                        : pendingNode,
                    border: Border.all(
                      color: p.accent.withValues(
                        alpha: index == selected ? 1 : 0,
                      ),
                      width: index == selected ? 2 : 0,
                    ),
                    boxShadow: index == selected
                        ? [
                            BoxShadow(
                              color: p.accent.withValues(
                                alpha: focused ? .24 : .14,
                              ),
                              spreadRadius: 6,
                            ),
                            BoxShadow(
                              color: p.accent.withValues(alpha: .38),
                              blurRadius: 18,
                            ),
                          ]
                        : const [],
                  ),
                  alignment: Alignment.center,
                  child: index == selected
                      ? DecoratedBox(
                          decoration: BoxDecoration(
                            color: p.accent,
                            shape: BoxShape.circle,
                          ),
                          child: const SizedBox.square(dimension: 10),
                        )
                      : null,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _SeekIntent extends Intent {
  const _SeekIntent(this.delta);
  final double delta;
}
