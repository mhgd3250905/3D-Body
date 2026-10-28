import 'package:flutter/material.dart';

import 'components.dart';
import 'flare_silhouette.dart';
import 'motion.dart';
import 'theme.dart';

/// Shared by the full-screen startup cover and the live scene beneath it.
RadialGradient flareStageGradient() => RadialGradient(
  center: const Alignment(0, -.2),
  radius: 1.05,
  colors: FlareColors.stage,
  stops: const [0, .52, 1],
);

/// Keeps the first app frame covered until data and the scene are presented.
/// The host retains this state across startup; after revealing once it stays
/// out of the way when pages or the underlying WebView subsequently change.
class FlareStartupSplash extends StatefulWidget {
  const FlareStartupSplash({
    super.key,
    required this.ready,
    required this.onRetry,
    required this.onRevealed,
    this.error,
  });

  final bool ready;

  /// A localized message supplied by the host, never a platform error code.
  final String? error;
  final VoidCallback onRetry;
  final VoidCallback onRevealed;

  @override
  State<FlareStartupSplash> createState() => _FlareStartupSplashState();
}

class _FlareStartupSplashState extends State<FlareStartupSplash>
    with SingleTickerProviderStateMixin {
  static const _contentEnd = 120 / 340;
  bool _completed = false;
  bool _notified = false;
  late final AnimationController _reveal = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 340),
  )..addStatusListener(_statusChanged);

  void _statusChanged(AnimationStatus status) {
    if (status != AnimationStatus.completed || _completed) return;
    // The controller also invalidates AnimatedBuilder in this frame. Latch
    // before that rebuild and notify the host after paint, including when
    // reduced motion completes synchronously during an ancestor's build.
    _completed = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || _notified) return;
      _notified = true;
      widget.onRevealed();
    });
  }

  void _syncReadiness() {
    if (_completed) return;
    if (!widget.ready || widget.error != null) {
      _reveal.stop();
      _reveal.value = 0;
      return;
    }
    if (FlareMotion.reduced(context)) {
      _reveal.value = 1;
    } else if (!_reveal.isAnimating) {
      _reveal.forward();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncReadiness();
  }

  @override
  void didUpdateWidget(FlareStartupSplash oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncReadiness();
  }

  @override
  void dispose() {
    _reveal.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _reveal,
    builder: (context, _) {
      if (_completed) {
        return const SizedBox.shrink(key: ValueKey('startup-revealed'));
      }
      final progress = _reveal.value;
      final contentOpacity = progress >= _contentEnd - .000001
          ? 0.0
          : 1 -
                Curves.easeOut.transform(
                  (progress / _contentEnd).clamp(0.0, 1.0),
                );
      final coverOpacity =
          1 -
          FlareMotion.dissolve.transform(
            ((progress - _contentEnd) / (1 - _contentEnd)).clamp(0.0, 1.0),
          );
      return BlockSemantics(
        child: Material(
          type: MaterialType.transparency,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Keep the live platform view drawing underneath, while none of
              // its controls or the hidden homepage can receive startup taps.
              const ModalBarrier(dismissible: false, color: Colors.transparent),
              IgnorePointer(
                child: Opacity(
                  key: const ValueKey('startup-cover-opacity'),
                  opacity: coverOpacity,
                  child: DecoratedBox(
                    decoration: BoxDecoration(gradient: flareStageGradient()),
                  ),
                ),
              ),
              if (contentOpacity > 0)
                Opacity(
                  key: const ValueKey('startup-content-opacity'),
                  opacity: contentOpacity,
                  child: SafeArea(
                    child: LayoutBuilder(
                      builder: (context, box) {
                        // Phone-height covers fill the page like a print
                        // cover: masthead at the top, index at the foot.
                        final fill = box.maxHeight >= 600;
                        final body = Center(
                          child: ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 440),
                            child: Padding(
                              padding: const EdgeInsets.fromLTRB(
                                28,
                                24,
                                28,
                                32,
                              ),
                              child: _content(
                                context,
                                box.maxHeight,
                                fill: fill,
                              ),
                            ),
                          ),
                        );
                        return fill
                            ? SizedBox(height: box.maxHeight, child: body)
                            : SingleChildScrollView(
                                child: ConstrainedBox(
                                  constraints: BoxConstraints(
                                    minHeight: box.maxHeight,
                                  ),
                                  child: body,
                                ),
                              );
                      },
                    ),
                  ),
                ),
            ],
          ),
        ),
      );
    },
  );

  /// Magazine cover (R27 startup language): a left-aligned wordmark, a ruled
  /// eyebrow whose hairline draws itself, the athlete's silhouette and a
  /// three-column index of what the App holds.
  Widget _content(BuildContext context, double height, {bool fill = false}) {
    final s = context.strings;
    final error = widget.error;
    final compact = height < 600;
    final column = <(String, String)>[
      ('01', s.watch),
      ('02', s.muscleMap),
      ('03', s.library),
    ];
    return Semantics(
      container: true,
      liveRegion: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: fill ? MainAxisSize.max : MainAxisSize.min,
        children: [
          ExcludeSemantics(
            child: Row(
              children: [
                Text(
                  s.brandEyebrow,
                  style: TextStyle(
                    color: FlareColors.accentInk,
                    fontSize: 11,
                    height: 1.2,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 2.4,
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(child: StartupRule()),
                const SizedBox(width: 12),
                Text(
                  '3D',
                  style: TextStyle(
                    color: FlareColors.dim,
                    fontSize: 11,
                    height: 1.2,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
          if (fill)
            const Spacer(flex: 2)
          else
            SizedBox(height: compact ? 18 : 30),
          Text(
            s.appName,
            style: TextStyle(
              color: FlareColors.text,
              fontSize: compact ? 38 : 46,
              height: 1.04,
              fontWeight: FontWeight.w800,
              fontStyle: FontStyle.italic,
              letterSpacing: -.6,
            ),
          ),
          const SizedBox(height: 8),
          ExcludeSemantics(
            child: Text(
              s.welcomeHeadline,
              style: TextStyle(
                color: FlareColors.secondary,
                fontSize: 15,
                height: 1.4,
                fontWeight: FontWeight.w400,
                letterSpacing: .4,
              ),
            ),
          ),
          if (fill)
            const Spacer(flex: 2)
          else
            SizedBox(height: compact ? 12 : 36),
          Center(
            child: ExcludeSemantics(
              child: FlareLoadingSilhouette(
                animate: error == null,
                size: compact ? 150 : 196,
              ),
            ),
          ),
          if (fill)
            const Spacer(flex: 3)
          else
            SizedBox(height: compact ? 12 : 36),
          Divider(height: 1, thickness: .6, color: FlareColors.hairline),
          const SizedBox(height: 14),
          ExcludeSemantics(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (final (index, label) in column)
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          index,
                          style: TextStyle(
                            color: FlareColors.dim,
                            fontSize: 10,
                            height: 1.3,
                            letterSpacing: 1.2,
                            fontFeatures: const [FontFeature.tabularFigures()],
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: FlareColors.secondary,
                            fontSize: 12,
                            height: 1.35,
                            fontWeight: FontWeight.w500,
                            letterSpacing: .3,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 22),
          Text(
            error ?? s.sceneLoading,
            style: TextStyle(color: FlareColors.dim, fontSize: 12, height: 1.6),
          ),
          if (error != null) ...[
            const SizedBox(height: 14),
            OutlinedButton(onPressed: widget.onRetry, child: Text(s.retry)),
          ],
        ],
      ),
    );
  }
}

/// The cover's hairline: it draws in from the start once (900ms
/// easeInOutCubic), then a short accent segment travels along it a few times
/// while the scene loads. Reduced motion shows the finished line without the segment.
/// Painted in its own layer so the travelling segment repaints nothing else.
class StartupRule extends StatefulWidget {
  const StartupRule({super.key});

  @override
  State<StartupRule> createState() => _StartupRuleState();
}

class _StartupRuleState extends State<StartupRule>
    with SingleTickerProviderStateMixin {
  static const _drawMs = 900;
  static const _travelMs = 1800;
  late final AnimationController _clock = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: _drawMs + _travelMs),
  );
  bool _reduced = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final reduced = FlareMotion.reduced(context);
    if (reduced == _reduced && (_clock.isAnimating || reduced)) return;
    _reduced = reduced;
    if (reduced) {
      _clock.stop();
      _clock.value = 1;
    } else {
      _clock.forward(from: 0).whenCompleteOrCancel(_loop);
    }
  }

  int _loops = 0;

  void _loop() {
    // A finite number of passes: a long load settles on the drawn line, and
    // tests that settle animations never wait on an endless ticker.
    if (!mounted || _reduced || ++_loops > 5) return;
    // Repeat only the travelling part; the line stays drawn.
    _clock
        .forward(from: _drawMs / (_drawMs + _travelMs))
        .whenCompleteOrCancel(_loop);
  }

  @override
  void dispose() {
    _clock.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: SizedBox(
      height: 8,
      child: CustomPaint(
        painter: _RulePainter(
          clock: _clock,
          drawEnd: _drawMs / (_drawMs + _travelMs),
          reduced: _reduced,
          line: FlareColors.text.withValues(alpha: .22),
          accent: FlareColors.accent,
        ),
      ),
    ),
  );
}

class _RulePainter extends CustomPainter {
  _RulePainter({
    required this.clock,
    required this.drawEnd,
    required this.reduced,
    required this.line,
    required this.accent,
  }) : super(repaint: clock);

  final Animation<double> clock;
  final double drawEnd;
  final bool reduced;
  final Color line;
  final Color accent;

  @override
  void paint(Canvas canvas, Size size) {
    final y = size.height / 2;
    final t = clock.value;
    final drawn = reduced
        ? 1.0
        : Curves.easeInOutCubic.transform((t / drawEnd).clamp(0.0, 1.0));
    final paint = Paint()
      ..color = line
      ..strokeWidth = .8;
    canvas.drawLine(Offset(0, y), Offset(size.width * drawn, y), paint);
    if (reduced || t < drawEnd) return;
    final travel = Curves.easeInOutCubic.transform(
      ((t - drawEnd) / (1 - drawEnd)).clamp(0.0, 1.0),
    );
    final segment = size.width * .18;
    final start = (size.width + segment) * travel - segment;
    canvas.drawLine(
      Offset(start.clamp(0, size.width), y),
      Offset((start + segment).clamp(0, size.width), y),
      paint
        ..color = accent
        ..strokeWidth = 1.4,
    );
  }

  @override
  bool shouldRepaint(_RulePainter old) =>
      old.reduced != reduced || old.line != line || old.accent != accent;
}
