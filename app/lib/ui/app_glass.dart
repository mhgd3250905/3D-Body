import 'package:flutter/material.dart';

import 'motion.dart';
import 'theme.dart';

/// Corner radii, one step per layer (R27 hierarchy). Larger containers carry
/// larger radii so nested surfaces read as concentric.
abstract final class FlareRadius {
  /// Bottom sheets (top corners) and the main card of a page.
  static const double sheet = 24;
  static const double card = 24;

  /// Large framed panels (settings, more).
  static const double panel = 28;

  /// Grouped rows, content cards and summaries.
  static const double group = 20;

  /// Single list entries.
  static const double item = 16;

  /// Small tags, thumbnails and value chips.
  static const double tag = 12;
}

/// The App's light control material. It paints a local three-stop gradient,
/// a hairline edge and one soft shadow; it never samples, blurs or refracts
/// what is behind it, so it costs the same over the live 3D stage, video or
/// a scrolling list. High contrast swaps to an almost opaque surface.
class FlareControlGlass extends StatelessWidget {
  const FlareControlGlass({
    super.key,
    required this.child,
    this.shape = const RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(FlareRadius.tag)),
    ),
    this.highlighted = false,
  });

  final Widget child;
  final ShapeBorder shape;

  /// Lifts the top stop slightly (a selected or pressed control).
  final bool highlighted;

  static ShapeDecoration decoration(
    BuildContext context, {
    required ShapeBorder shape,
    bool highlighted = false,
  }) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final highContrast = MediaQuery.maybeHighContrastOf(context) ?? false;
    final top = highContrast ? .96 : (dark ? .2 : .74);
    final middle = highContrast ? .9 : (dark ? .09 : .52);
    final bottom = highContrast ? .94 : (dark ? .14 : .64);
    final tint = dark
        ? (highContrast ? const Color(0xff25262b) : const Color(0xffdfe3ea))
        : Colors.white;
    final lift = highlighted && !highContrast ? .1 : 0.0;
    final edge = dark ? const Color(0x1effffff) : const Color(0x99ffffff);
    return ShapeDecoration(
      shape: _withSide(shape, BorderSide(color: edge, width: .6)),
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        stops: const [0, .52, 1],
        colors: [
          tint.withValues(alpha: (top + lift).clamp(0, 1)),
          tint.withValues(alpha: middle),
          tint.withValues(alpha: bottom),
        ],
      ),
      shadows: [
        BoxShadow(
          color: Colors.black.withValues(alpha: dark ? .16 : .08),
          offset: const Offset(0, 3),
          blurRadius: 9,
          spreadRadius: -2,
        ),
      ],
    );
  }

  static ShapeBorder _withSide(ShapeBorder shape, BorderSide side) =>
      switch (shape) {
        RoundedRectangleBorder(:final borderRadius) => RoundedRectangleBorder(
          borderRadius: borderRadius,
          side: side,
        ),
        StadiumBorder() => StadiumBorder(side: side),
        CircleBorder() => CircleBorder(side: side),
        _ => shape,
      };

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: decoration(context, shape: shape, highlighted: highlighted),
    child: Material(
      type: MaterialType.transparency,
      shape: shape,
      clipBehavior: Clip.antiAlias,
      child: child,
    ),
  );
}

/// Fixed control surface (the home transport, fixed action bars).
class FlareGlassBar extends StatelessWidget {
  const FlareGlassBar({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(8),
    this.radius = FlareRadius.card,
  });
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;

  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: FlareControlGlass(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius),
      ),
      child: Padding(padding: padding, child: child),
    ),
  );
}

class FlareGlassIconButton extends StatelessWidget {
  const FlareGlassIconButton({
    super.key,
    required this.icon,
    required this.label,
    required this.onPressed,
    this.diameter = 44,
  });
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final double diameter;

  @override
  Widget build(BuildContext context) => Tooltip(
    message: label,
    child: Semantics(
      button: true,
      enabled: onPressed != null,
      label: label,
      excludeSemantics: true,
      child: Pressable(
        scale: .94,
        child: SizedBox.square(
          dimension: diameter,
          child: FlareControlGlass(
            shape: const CircleBorder(),
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: onPressed,
              child: Center(
                child: Icon(
                  icon,
                  size: 20,
                  color: onPressed == null
                      ? FlareColors.dim
                      : FlareColors.controlIcon,
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

/// Stable content material: no blur, shader, Opacity or offscreen saveLayer.
/// A near-opaque card with the same diagonal light and soft shadow as the
/// control material, so lists and the stage share one language.
class FlareStaticSurface extends StatelessWidget {
  const FlareStaticSurface({
    super.key,
    required this.child,
    this.padding = EdgeInsets.zero,
    this.radius = FlareRadius.group,
    this.color,
  });
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;
  final Color? color;

  static Color colorOf(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark
      ? const Color(0xea18181c)
      : const Color(0xf5ffffff);

  static BoxDecoration decoration(
    BuildContext context, {
    double radius = FlareRadius.group,
    Color? color,
  }) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final base = color ?? colorOf(context);
    return BoxDecoration(
      color: base,
      gradient: color != null
          ? null
          : LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              stops: const [0, .52, 1],
              colors: dark
                  ? const [
                      Color(0xea1d1d22),
                      Color(0xea18181c),
                      Color(0xea1a1a1f),
                    ]
                  : const [
                      Color(0xfcffffff),
                      Color(0xf5ffffff),
                      Color(0xf8ffffff),
                    ],
            ),
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(
        color: dark ? const Color(0x14ffffff) : const Color(0xb3ffffff),
        width: .6,
      ),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(alpha: dark ? .16 : .06),
          offset: const Offset(0, 3),
          blurRadius: 9,
          spreadRadius: -2,
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: decoration(context, radius: radius, color: color),
    child: Padding(padding: padding, child: child),
  );
}

/// Fixed actions stay outside media and scrollable content. Material Scaffold
/// still owns keyboard insets and SnackBars; SDK routes do not use this bar.
class FlareActionBar extends StatelessWidget {
  const FlareActionBar({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
    child: FlareGlassBar(
      padding: const EdgeInsets.all(6),
      radius: FlareRadius.panel,
      child: child,
    ),
  );
}
