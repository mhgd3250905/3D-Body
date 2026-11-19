import 'package:flutter/material.dart';

import 'theme.dart';

RadialGradient flarePlanArtGradient(FlarePalette palette) => RadialGradient(
  center: const Alignment(.4, -.4),
  radius: 1.2,
  colors: [palette.raised, palette.background],
  stops: const [0, .7],
);

class FlarePlanGlow extends StatelessWidget {
  const FlarePlanGlow({super.key, required this.diameter});

  final double diameter;

  @override
  Widget build(BuildContext context) {
    final palette = FlareColors.palette;
    return Container(
      width: diameter,
      height: diameter,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            palette.accent.withValues(alpha: palette.isDark ? .22 : .16),
            palette.accent.withValues(alpha: 0),
          ],
          stops: const [0, .65],
        ),
      ),
    );
  }
}

class FlarePlanMuscleFade extends StatelessWidget {
  const FlarePlanMuscleFade({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) => ShaderMask(
    blendMode: BlendMode.dstIn,
    shaderCallback: (bounds) => const LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [Colors.black, Colors.transparent],
      stops: [.65, 1],
    ).createShader(bounds),
    child: child,
  );
}

class FlarePlanKicker extends StatelessWidget {
  const FlarePlanKicker({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final palette = FlareColors.palette;
    return Row(
      children: [
        DecoratedBox(
          decoration: BoxDecoration(
            color: palette.accent,
            borderRadius: BorderRadius.circular(1),
          ),
          child: const SizedBox(width: 14, height: 2),
        ),
        const SizedBox(width: 8),
        Flexible(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            alignment: AlignmentDirectional.centerStart,
            child: Text(
              label,
              maxLines: 1,
              style: TextStyle(
                color: palette.accentInk,
                fontSize: 11,
                fontWeight: FontWeight.w600,
                letterSpacing: 2,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class FlarePlanSectionHeading extends StatelessWidget {
  const FlarePlanSectionHeading({super.key, required this.title, this.hint});

  final String title;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    final palette = FlareColors.palette;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.baseline,
      textBaseline: TextBaseline.alphabetic,
      children: [
        Expanded(
          child: Semantics(
            header: true,
            child: Text(
              title,
              style: TextStyle(
                color: palette.text,
                fontSize: 18,
                fontWeight: FontWeight.w700,
                letterSpacing: -.2,
              ),
            ),
          ),
        ),
        if (hint case final text?) ...[
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              textAlign: TextAlign.end,
              style: TextStyle(color: palette.dim, fontSize: 12),
            ),
          ),
        ],
      ],
    );
  }
}
