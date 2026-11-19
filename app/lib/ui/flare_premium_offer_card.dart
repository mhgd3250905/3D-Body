import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'theme.dart';

const _offerGold = Color(0xFFE9CFA3);
const _buttonGold = Color(0xFFE2B676);
const _offerRadius = Radius.circular(FlarePremiumOfferCard.topRadius);
const _offerCorners = BorderRadius.only(
  topLeft: _offerRadius,
  topRight: _offerRadius,
);

class FlarePremiumOfferCard extends StatelessWidget {
  static const topRadius = 28.0;

  const FlarePremiumOfferCard({
    super.key,
    required this.badge,
    required this.title,
    required this.highlight,
    required this.description,
    required this.benefits,
    required this.benefitIcons,
    required this.buttonLabel,
    required this.footer,
    required this.safeBottom,
    required this.glow,
    required this.sheenEnabled,
    required this.onSubscribe,
  });

  final String badge;
  final String title;
  final String highlight;
  final String description;
  final List<String> benefits;
  final List<IconData> benefitIcons;
  final String buttonLabel;
  final String footer;
  final double safeBottom;
  final Animation<double> glow;
  final ValueListenable<bool> sheenEnabled;
  final VoidCallback onSubscribe;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    key: const ValueKey('premium-preview-card'),
    decoration: BoxDecoration(
      borderRadius: _offerCorners,
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(
            alpha: Theme.of(context).brightness == Brightness.dark ? .60 : .28,
          ),
          blurRadius: 36,
          offset: const Offset(0, -6),
        ),
      ],
    ),
    child: ClipRRect(
      borderRadius: _offerCorners,
      child: CustomPaint(
        painter: _OfferSurface(glow),
        child: Padding(
          padding: EdgeInsets.fromLTRB(24, 24, 24, safeBottom + 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Align(
                alignment: AlignmentDirectional.centerStart,
                child: _OfferBadge(badge),
              ),
              const SizedBox(height: 14),
              _OfferTitle(title: title, highlight: highlight),
              const SizedBox(height: 6),
              Text(
                description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: FlareType.rowSubtitle.copyWith(
                  color: Colors.white.withValues(alpha: .58),
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 16),
              _OfferBenefits(benefits: benefits, icons: benefitIcons),
              const SizedBox(height: 18),
              _OfferButton(
                label: buttonLabel,
                sheenEnabled: sheenEnabled,
                onPressed: onSubscribe,
              ),
              const SizedBox(height: 12),
              Text(
                footer,
                textAlign: TextAlign.center,
                style: FlareType.navSubtitle.copyWith(
                  color: Colors.white.withValues(alpha: .40),
                  fontSize: 11.5,
                ),
              ),
            ],
          ),
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
    canvas.drawRect(
      bounds,
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF17151A), Color(0xFF0E0D10)],
        ).createShader(bounds),
    );
    const glowColor = Color(0xFFF2C48D);
    canvas.save();
    canvas.translate(size.width / 2, 0);
    canvas.scale(size.width * .35, size.height / 2);
    canvas.drawCircle(
      Offset.zero,
      1,
      Paint()
        ..shader = ui.Gradient.radial(Offset.zero, 1, [
          glowColor.withValues(alpha: .16 * glow.value.clamp(0, 1)),
          glowColor.withValues(alpha: 0),
        ]),
    );
    canvas.restore();

    final gloss = Rect.fromLTWH(0, 0, size.width, size.height * .40);
    canvas.drawRect(
      gloss,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.white.withValues(alpha: .055), Colors.transparent],
        ).createShader(gloss),
    );

    final radius = _offerRadius.x;
    final hairline = Path()
      ..moveTo(.5, radius)
      ..arcToPoint(Offset(radius, .5), radius: Radius.circular(radius - .5))
      ..lineTo(size.width - radius, .5)
      ..arcToPoint(
        Offset(size.width - .5, radius),
        radius: Radius.circular(radius - .5),
      );
    canvas.drawPath(
      hairline,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1
        ..shader = ui.Gradient.linear(Offset.zero, Offset(size.width, 0), [
          const Color(0xFFEED3A6).withValues(alpha: .60),
          Colors.white.withValues(alpha: .07),
        ]),
    );
  }

  @override
  bool shouldRepaint(_OfferSurface oldDelegate) => oldDelegate.glow != glow;
}

class _OfferBadge extends StatelessWidget {
  const _OfferBadge(this.label);

  final String label;
  static const _ink = Color(0xFFEED6AE);

  @override
  Widget build(BuildContext context) => Container(
    height: 22,
    padding: const EdgeInsets.symmetric(horizontal: 8),
    decoration: BoxDecoration(
      color: _offerGold.withValues(alpha: .11),
      border: Border.all(color: _offerGold.withValues(alpha: .50)),
      borderRadius: BorderRadius.circular(11),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.workspace_premium_rounded, size: 13, color: _ink),
        const SizedBox(width: 5),
        Flexible(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: FlareType.navSubtitle.copyWith(
              color: _ink,
              fontSize: 10.5,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.4,
            ),
          ),
        ),
      ],
    ),
  );
}

class _OfferTitle extends StatelessWidget {
  const _OfferTitle({required this.title, required this.highlight});

  final String title;
  final String highlight;

  static final _style = FlareType.navTitle.copyWith(
    color: Colors.white,
    fontSize: 22,
    fontWeight: FontWeight.w800,
    letterSpacing: -.2,
  );
  static const _gradient = LinearGradient(
    colors: [Color(0xFFFBE9C8), Color(0xFFD9A55E)],
  );

  @override
  Widget build(BuildContext context) {
    final start = title.indexOf(highlight);
    if (highlight.isEmpty || start < 0) {
      return Semantics(header: true, child: Text(title, style: _style));
    }
    final end = start + highlight.length;
    TextSpan span({required Color rest, required Color keyword}) {
      final surrounding = TextStyle(color: rest);
      return TextSpan(
        children: [
          TextSpan(text: title.substring(0, start), style: surrounding),
          TextSpan(
            text: highlight,
            style: TextStyle(color: keyword),
          ),
          TextSpan(text: title.substring(end), style: surrounding),
        ],
      );
    }

    return Semantics(
      header: true,
      label: title,
      excludeSemantics: true,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final defaults = DefaultTextStyle.of(context);
          final textDirection = Directionality.of(context);
          final textScaler = MediaQuery.textScalerOf(context);
          final locale = Localizations.maybeLocaleOf(context);
          final keywordLayer = TextSpan(
            style: defaults.style.merge(_style),
            children: [span(rest: Colors.transparent, keyword: Colors.white)],
          );
          // Both layers wrap the same paragraph. The mask uses only the
          // keyword's glyphs and takes its bounds from that wrapped layout.
          final painter = TextPainter(
            text: keywordLayer,
            textDirection: textDirection,
            textScaler: textScaler,
            textHeightBehavior: defaults.textHeightBehavior,
            locale: locale,
          )..layout(maxWidth: constraints.maxWidth);
          final boxes = painter.getBoxesForSelection(
            TextSelection(baseOffset: start, extentOffset: end),
          );
          painter.dispose();
          if (boxes.isEmpty) return Text(title, style: _style);
          final keywordBounds = boxes
              .map((box) => box.toRect())
              .reduce((bounds, next) => bounds.expandToInclude(next));
          return Stack(
            children: [
              Text.rich(
                span(rest: Colors.white, keyword: Colors.transparent),
                style: _style,
                textAlign: TextAlign.start,
              ),
              Positioned.fill(
                child: ShaderMask(
                  blendMode: BlendMode.srcIn,
                  shaderCallback: (_) => _gradient.createShader(keywordBounds),
                  child: RichText(
                    text: keywordLayer,
                    textDirection: textDirection,
                    textScaler: textScaler,
                    textHeightBehavior: defaults.textHeightBehavior,
                    locale: locale,
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _OfferBenefits extends StatelessWidget {
  const _OfferBenefits({required this.benefits, required this.icons});

  final List<String> benefits;
  final List<IconData> icons;

  @override
  Widget build(BuildContext context) {
    final line = Colors.white.withValues(alpha: .08);
    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: .035),
        border: Border.all(color: line),
        borderRadius: BorderRadius.circular(16),
      ),
      child: SizedBox(
        height: 86,
        child: Row(
          children: [
            for (var index = 0; index < benefits.length; index++) ...[
              if (index != 0)
                SizedBox(width: 1, height: 46, child: ColoredBox(color: line)),
              Expanded(
                child: _OfferBenefit(
                  label: benefits[index],
                  icon: icons[index],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _OfferBenefit extends StatelessWidget {
  const _OfferBenefit({required this.label, required this.icon});

  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 4),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: _offerGold.withValues(alpha: .09),
            border: Border.all(color: _offerGold.withValues(alpha: .24)),
            shape: BoxShape.circle,
          ),
          child: Center(child: Icon(icon, size: 18, color: _offerGold)),
        ),
        const SizedBox(height: 9),
        Flexible(
          child: Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: FlareType.navSubtitle.copyWith(
              color: Colors.white.withValues(alpha: .85),
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    ),
  );
}

class _OfferButton extends StatefulWidget {
  const _OfferButton({
    required this.label,
    required this.sheenEnabled,
    required this.onPressed,
  });

  final String label;
  final ValueListenable<bool> sheenEnabled;
  final VoidCallback onPressed;

  @override
  State<_OfferButton> createState() => _OfferButtonState();
}

class _OfferButtonState extends State<_OfferButton>
    with SingleTickerProviderStateMixin {
  static const _radius = BorderRadius.all(Radius.circular(27));
  static const _ink = Color(0xFF1E160B);
  late final _sheen = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  );
  final _buttonStates = WidgetStatesController();
  Timer? _repeat;
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _buttonStates.addListener(_updatePressed);
    widget.sheenEnabled.addListener(_updateSheen);
    _updateSheen();
  }

  @override
  void didUpdateWidget(covariant _OfferButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.sheenEnabled != widget.sheenEnabled) {
      oldWidget.sheenEnabled.removeListener(_updateSheen);
      widget.sheenEnabled.addListener(_updateSheen);
      _updateSheen();
    }
  }

  void _updatePressed() {
    final pressed = _buttonStates.value.contains(WidgetState.pressed);
    if (_pressed != pressed) setState(() => _pressed = pressed);
  }

  void _updateSheen() {
    _repeat?.cancel();
    _repeat = null;
    if (!widget.sheenEnabled.value) {
      _sheen.reset();
      return;
    }
    _sheen.forward(from: 0);
    _repeat = Timer.periodic(const Duration(seconds: 4), (_) {
      _sheen.forward(from: 0);
    });
  }

  @override
  void dispose() {
    widget.sheenEnabled.removeListener(_updateSheen);
    _repeat?.cancel();
    _sheen.dispose();
    _buttonStates.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final labelStyle = FlareType.primaryButton.copyWith(
      color: _ink,
      fontSize: 16,
      fontWeight: FontWeight.w800,
    );
    return AnimatedScale(
      scale: _pressed && !MediaQuery.disableAnimationsOf(context) ? .97 : 1,
      duration: const Duration(milliseconds: 100),
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: _radius,
          boxShadow: [
            BoxShadow(
              color: _buttonGold.withValues(alpha: .28),
              blurRadius: 18,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: _radius,
          child: SizedBox(
            height: 54,
            child: Stack(
              fit: StackFit.expand,
              children: [
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Color(0xFFF8E6C4), _buttonGold],
                    ),
                  ),
                ),
                IgnorePointer(
                  child: RepaintBoundary(
                    child: AnimatedBuilder(
                      animation: _sheen,
                      builder: (context, _) =>
                          CustomPaint(painter: _OfferSheen(_sheen.value)),
                    ),
                  ),
                ),
                FilledButton(
                  key: const ValueKey('premium-preview-subscribe'),
                  statesController: _buttonStates,
                  onPressed: widget.onPressed,
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    foregroundColor: _ink,
                    surfaceTintColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    elevation: 0,
                    minimumSize: Size.zero,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    shape: const RoundedRectangleBorder(borderRadius: _radius),
                    textStyle: labelStyle,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          widget.label,
                          style: labelStyle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Icon(Icons.arrow_forward_rounded, size: 18),
                    ],
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
  _OfferSheen(this.progress);

  final double progress;
  static const _angle = 20 * math.pi / 180;
  static const _halfWidth = 20.0;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress > 0 && progress < 1) {
      final sin = math.sin(_angle);
      final cos = math.cos(_angle);
      final halfStripe = Offset(cos, sin) * _halfWidth;
      // At either end the full angled band clears the button's bounds.
      final outside = (size.height / 2 * sin + _halfWidth) / cos;
      final x = ui.lerpDouble(
        -outside,
        size.width + outside,
        Curves.easeInOut.transform(progress),
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
              Colors.white.withValues(alpha: .36),
              Colors.white.withValues(alpha: 0),
            ],
            const [0, .5, 1],
          ),
      );
    }
    canvas.drawLine(
      const Offset(27, .5),
      Offset(size.width - 27, .5),
      Paint()..color = Colors.white.withValues(alpha: .65),
    );
  }

  @override
  bool shouldRepaint(_OfferSheen oldDelegate) =>
      oldDelegate.progress != progress;
}
