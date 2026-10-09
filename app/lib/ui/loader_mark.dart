import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'motion.dart';
import 'theme.dart';

/// The vector loading mark: the app icon's athlete in a one-hand flare, legs
/// sweeping a wide V while an open orbit ring turns. Drawn with the same
/// geometry and timing as the scene's canvas loader (app/scene/index.html),
/// so the Flutter placeholder hands over to the WebView without a jump.
class FlareLoaderMark extends StatefulWidget {
  const FlareLoaderMark({super.key, this.size = 132});
  final double size;
  @override
  State<FlareLoaderMark> createState() => _FlareLoaderMarkState();
}

class _FlareLoaderMarkState extends State<FlareLoaderMark>
    with SingleTickerProviderStateMixin {
  late final AnimationController _clock = AnimationController(
    vsync: this,
    // One long cycle; the painter reads seconds from it.
    duration: const Duration(seconds: 600),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (FlareMotion.reduced(context)) {
      _clock.stop();
      _clock.value = 1.2 / 600;
    } else if (!_clock.isAnimating) {
      _clock.repeat();
    }
  }

  @override
  void dispose() {
    _clock.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: widget.size,
    child: AnimatedBuilder(
      animation: _clock,
      builder: (context, _) {
        final t = _clock.value * 600;
        final intro = _ease((t / .6).clamp(0, 1).toDouble());
        return Opacity(
          opacity: FlareMotion.reduced(context) ? 1 : intro,
          child: Transform.scale(
            scale: FlareMotion.reduced(context) ? 1 : .94 + .06 * intro,
            child: CustomPaint(
              painter: FlareLoaderPainter(
                t: t,
                accent: FlareColors.accent,
                light: !FlareColors.palette.isDark,
              ),
            ),
          ),
        );
      },
    ),
  );
}

double _ease(double x) =>
    x < .5 ? 4 * x * x * x : 1 - math.pow(-2 * x + 2, 3) / 2;

class FlareLoaderPainter extends CustomPainter {
  FlareLoaderPainter({
    required this.t,
    required this.accent,
    required this.light,
  });
  final double t;
  final Color accent;
  final bool light;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 132);
    final fill = Paint()
      ..color = accent
      ..isAntiAlias = true;
    const cx = 66.0, cy = 64.0, r = 50.0;

    // Floor glow: a soft ellipse under the support hand.
    canvas.save();
    canvas.translate(cx, 114);
    canvas.scale(1, .28);
    canvas.drawCircle(
      Offset.zero,
      36,
      Paint()
        ..shader = RadialGradient(
          colors: [
            accent.withValues(alpha: light ? .26 : .34),
            accent.withValues(alpha: 0),
          ],
        ).createShader(Rect.fromCircle(center: Offset.zero, radius: 36)),
    );
    canvas.restore();

    // Orbit: a long and a short open arc with a soft surge each lap.
    const lap = 1.9;
    final k = (t % lap) / lap;
    final spin = ((t / lap).floorToDouble() + _ease(k)) * math.pi;
    final breath = .5 + .5 * math.sin(t * 2.2);
    final rect = Rect.fromCircle(center: const Offset(cx, cy), radius: r);
    final ring = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..color = accent.withValues(alpha: .95)
      ..strokeWidth = 2.4;
    final start1 = spin - 2.1 - .25 * breath, end1 = spin + 1.05;
    canvas.drawArc(rect, start1, end1 - start1, false, ring);
    final start2 = spin + 1.55, end2 = spin + 2.35 + .2 * breath;
    canvas.drawArc(
      rect,
      start2,
      end2 - start2,
      false,
      ring
        ..color = accent.withValues(alpha: .55)
        ..strokeWidth = 1.6,
    );
    canvas.drawCircle(
      Offset(cx + r * math.cos(end1), cy + r * math.sin(end1)),
      2.6,
      fill,
    );

    // Athlete, as in the app icon.
    const hand = Offset(65, 112),
        shoulder = Offset(63, 79),
        hip = Offset(75, 53),
        head = Offset(50.5, 79.5);
    final swing = math.sin(t * 2.6) * .30;
    final spread = .80 + .05 * math.sin(t * 5.2);
    final base = -math.pi / 2 + .1 + swing;
    const legLength = 37.0;
    Offset at(Offset o, double angle, double length) =>
        o + Offset(math.cos(angle), math.sin(angle)) * length;
    Path dot(Offset c, double radius) =>
        Path()..addOval(Rect.fromCircle(center: c, radius: radius));
    final parts = <Path>[
      _limb(hand, shoulder, 2.6, 3.4),
      _limb(shoulder, hip, 6.6, 5.4),
      _limb(shoulder, Offset(46 + 2.5 * math.sin(t * 2.6), 57), 2.8, 1.9),
      _limb(hip, at(hip, base - spread, legLength), 4.6, 2.2),
      _limb(hip, at(hip, base + spread, legLength), 4.6, 2.2),
      dot(at(hip, base - spread, legLength + 1.5), 2.9),
      dot(at(hip, base + spread, legLength + 1.5), 2.9),
      _limb(hand + const Offset(-7, .4), hand + const Offset(5, .4), 1.6, 1.6),
      _limb(const Offset(56, 79), shoulder, 2.4, 3),
      dot(head, 6.4),
    ];
    // Opaque paint per part; the widget fades the mark as one layer.
    for (final part in parts) {
      canvas.drawPath(part, fill);
    }
    canvas.restore();
  }

  /// A tapered limb: radius [ra] at [a], [rb] at [b], rounded both ends.
  static Path _limb(Offset a, Offset b, double ra, double rb) {
    final d = (b - a).distance == 0 ? 1.0 : (b - a).distance;
    final angle = math.atan2(b.dy - a.dy, b.dx - a.dx);
    final tilt = math.asin(((ra - rb) / d).clamp(-1.0, 1.0));
    final path = Path()
      ..addArc(
        Rect.fromCircle(center: a, radius: ra),
        angle + math.pi / 2 + tilt,
        math.pi - 2 * tilt,
      )
      ..arcTo(
        Rect.fromCircle(center: b, radius: rb),
        angle - math.pi / 2 - tilt,
        math.pi + 2 * tilt,
        false,
      )
      ..close();
    return path;
  }

  @override
  bool shouldRepaint(FlareLoaderPainter old) =>
      old.t != t || old.accent != accent || old.light != light;
}
