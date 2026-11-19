import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import 'theme.dart';

const _offerOrange = Color(0xFFFF6A3D);
const _offerRadius = Radius.circular(24);

class FlarePremiumOfferCard extends StatelessWidget {
  const FlarePremiumOfferCard({
    super.key,
    required this.badge,
    required this.title,
    required this.description,
    required this.benefits,
    required this.buttonLabel,
    required this.glow,
    required this.sheenEnabled,
    required this.onSubscribe,
  });

  final String badge;
  final String title;
  final String description;
  final List<String> benefits;
  final String buttonLabel;
  final Animation<double> glow;
  final bool sheenEnabled;
  final VoidCallback onSubscribe;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    key: const ValueKey('premium-preview-card'),
    decoration: BoxDecoration(
      borderRadius: const BorderRadius.all(_offerRadius),
      boxShadow: [
        BoxShadow(
          color: _offerOrange.withValues(alpha: .22),
          blurRadius: 40,
          offset: const Offset(0, 14),
        ),
        BoxShadow(
          color: Colors.black.withValues(alpha: .28),
          blurRadius: 24,
          offset: const Offset(0, 8),
        ),
      ],
    ),
    child: CustomPaint(
      painter: _OfferSurface(glow),
      child: Padding(
        padding: const EdgeInsets.all(22),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Align(
              alignment: AlignmentDirectional.centerStart,
              child: _OfferBadge(badge),
            ),
            const SizedBox(height: 14),
            Semantics(
              header: true,
              child: Text(
                title,
                style: const TextStyle(
                  color: Color(0xFFFFF4EC),
                  fontSize: 21,
                  fontWeight: FontWeight.w800,
                  letterSpacing: .2,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: Colors.white.withValues(alpha: .62),
                fontSize: 13.5,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 14,
              runSpacing: 14,
              children: [
                for (final benefit in benefits) _OfferBenefit(benefit),
              ],
            ),
            const SizedBox(height: 20),
            _OfferButton(
              label: buttonLabel,
              sheenEnabled: sheenEnabled,
              onPressed: onSubscribe,
            ),
          ],
        ),
      ),
    ),
  );
}

class _OfferSurface extends CustomPainter {
  _OfferSurface(this.glow) : super(repaint: glow);

  final Animation<double> glow;

  @override
  void paint(Canvas canvas, Size size) {
    final bounds = Offset.zero & size;
    final shape = RRect.fromRectAndRadius(bounds, _offerRadius);
    canvas.drawRRect(
      shape,
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1F1714), Color(0xFF0D0A09)],
        ).createShader(bounds),
    );
    canvas.drawRRect(
      shape,
      Paint()
        ..shader = ui.Gradient.radial(Offset(size.width * .85, 0), 220, [
          _offerOrange.withValues(alpha: .28 * glow.value.clamp(0, 1)),
          _offerOrange.withValues(alpha: 0),
        ]),
    );
    canvas.drawRRect(
      shape.deflate(.5),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1
        ..shader = LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFFFFC08A).withValues(alpha: .70),
            _offerOrange.withValues(alpha: .18),
            Colors.white.withValues(alpha: .06),
          ],
        ).createShader(bounds),
    );
    canvas.drawLine(
      const Offset(24, .5),
      Offset(size.width - 24, .5),
      Paint()..color = Colors.white.withValues(alpha: .14),
    );
  }

  @override
  bool shouldRepaint(_OfferSurface oldDelegate) => oldDelegate.glow != glow;
}

class _OfferBadge extends StatelessWidget {
  const _OfferBadge(this.label);

  final String label;
  static const _ink = Color(0xFF2A1408);

  @override
  Widget build(BuildContext context) => Container(
    height: 24,
    padding: const EdgeInsets.symmetric(horizontal: 10),
    decoration: BoxDecoration(
      gradient: const LinearGradient(
        colors: [Color(0xFFFFD3A1), Color(0xFFFF8A4C)],
      ),
      borderRadius: BorderRadius.circular(12),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.workspace_premium_rounded, size: 14, color: _ink),
        const SizedBox(width: 4),
        Flexible(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: _ink,
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: .8,
            ),
          ),
        ),
      ],
    ),
  );
}

class _OfferBenefit extends StatelessWidget {
  const _OfferBenefit(this.label);

  final String label;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      const Icon(
        Icons.check_circle_rounded,
        size: 15,
        color: Color(0xFFFFB27A),
      ),
      const SizedBox(width: 4),
      Flexible(
        child: Text(
          label,
          style: TextStyle(
            color: Colors.white.withValues(alpha: .82),
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    ],
  );
}

class _OfferButton extends StatefulWidget {
  const _OfferButton({
    required this.label,
    required this.sheenEnabled,
    required this.onPressed,
  });

  final String label;
  final bool sheenEnabled;
  final VoidCallback onPressed;

  @override
  State<_OfferButton> createState() => _OfferButtonState();
}

class _OfferButtonState extends State<_OfferButton>
    with SingleTickerProviderStateMixin {
  static const _radius = BorderRadius.all(Radius.circular(16));
  late final _sheen = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1100),
  );
  final _buttonStates = WidgetStatesController();
  Timer? _repeat;
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _buttonStates.addListener(_updatePressed);
    _updateSheen();
  }

  @override
  void didUpdateWidget(covariant _OfferButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.sheenEnabled != widget.sheenEnabled) _updateSheen();
  }

  void _updatePressed() {
    final pressed = _buttonStates.value.contains(WidgetState.pressed);
    if (_pressed != pressed) setState(() => _pressed = pressed);
  }

  void _updateSheen() {
    _repeat?.cancel();
    _repeat = null;
    if (!widget.sheenEnabled) {
      _sheen.reset();
      return;
    }
    _sheen.forward(from: 0);
    _repeat = Timer.periodic(const Duration(milliseconds: 3200), (_) {
      _sheen.forward(from: 0);
    });
  }

  @override
  void dispose() {
    _repeat?.cancel();
    _sheen.dispose();
    _buttonStates.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final labelStyle = FlareType.primaryButton.copyWith(
      color: Colors.white,
      fontSize: 16,
      fontWeight: FontWeight.w800,
      shadows: [
        Shadow(
          color: const Color(0xFF8A2A10).withValues(alpha: .30),
          blurRadius: 4,
          offset: const Offset(0, 1),
        ),
      ],
    );
    return AnimatedScale(
      scale: _pressed && !MediaQuery.disableAnimationsOf(context) ? .97 : 1,
      duration: const Duration(milliseconds: 100),
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: _radius,
          boxShadow: [
            BoxShadow(
              color: _offerOrange.withValues(alpha: .35),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: _radius,
          child: SizedBox(
            height: 52,
            child: Stack(
              fit: StackFit.expand,
              children: [
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color(0xFFFFB27A),
                        _offerOrange,
                        Color(0xFFE8452A),
                      ],
                    ),
                  ),
                ),
                IgnorePointer(child: CustomPaint(painter: _OfferSheen(_sheen))),
                FilledButton(
                  key: const ValueKey('premium-preview-subscribe'),
                  statesController: _buttonStates,
                  onPressed: widget.onPressed,
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    foregroundColor: Colors.white,
                    surfaceTintColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    elevation: 0,
                    minimumSize: Size.zero,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    shape: const RoundedRectangleBorder(borderRadius: _radius),
                    textStyle: labelStyle,
                  ),
                  child: Text(
                    widget.label,
                    style: labelStyle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _OfferSheen extends CustomPainter {
  _OfferSheen(this.sweep) : super(repaint: sweep);

  final Animation<double> sweep;
  static const _angle = 20 * math.pi / 180;
  static const _halfWidth = 30.0;

  @override
  void paint(Canvas canvas, Size size) {
    if (sweep.value > 0 && sweep.value < 1) {
      final sin = math.sin(_angle);
      final cos = math.cos(_angle);
      final halfStripe = Offset(-sin, cos) * _halfWidth;
      // At either end the full angled band clears the button's bounds.
      final outside = (size.height / 2 * cos + _halfWidth) / sin;
      final x = ui.lerpDouble(
        -outside,
        size.width + outside,
        Curves.easeInOut.transform(sweep.value),
      )!;
      final center = Offset(x, size.height / 2);
      canvas.drawRect(
        Offset.zero & size,
        Paint()
          ..shader = ui.Gradient.linear(
            center - halfStripe,
            center + halfStripe,
            [
              Colors.white.withValues(alpha: 0),
              Colors.white.withValues(alpha: .22),
              Colors.white.withValues(alpha: 0),
            ],
            const [0, .5, 1],
          ),
      );
    }
    canvas.drawLine(
      const Offset(16, .5),
      Offset(size.width - 16, .5),
      Paint()..color = Colors.white.withValues(alpha: .35),
    );
  }

  @override
  bool shouldRepaint(_OfferSheen oldDelegate) => oldDelegate.sweep != sweep;
}
