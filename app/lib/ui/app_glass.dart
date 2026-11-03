import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

import 'motion.dart';
import 'theme.dart';

Future<void> initializeFlareGlass() => LiquidGlassWidgets.initialize(
  enablePerformanceMonitor: false,
  warmUpMode: GlassWarmUpMode.auto,
);

/// Only App-owned controls opt into this material. Navigator, SDK routes and
/// the global Material theme keep their existing contracts.
class FlareGlassScope extends StatelessWidget {
  const FlareGlassScope({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => GlassTheme(
    data: GlassThemeData(
      brightness: Theme.of(context).brightness,
      light: GlassThemeVariant.light.copyWith(
        quality: GlassQuality.premium,
        settings: GlassThemeVariant.light.settings?.copyWith(
          glassColor: const Color(0x1ff5f4f1),
        ),
      ),
      dark: GlassThemeVariant.dark.copyWith(
        quality: GlassQuality.premium,
        settings: GlassThemeVariant.dark.settings?.copyWith(
          glassColor: const Color(0x14ffffff),
        ),
      ),
    ),
    child: child,
  );
}

/// HipLab's home-dock glass (hiplab feat/ui-r2-pages, lib/hip/ui/hip_glass.dart
/// `HipGlass(blur: true, sigma: 20)`; 开哥 2026-11-03 asked the transport to
/// match that translucency). Flat levels only: one BackdropFilter + a low
/// flat white fill, a 0.5pt hairline rim, a tiny soft shadow.
abstract final class FlareHipGlass {
  /// Base fill. Over blur the fill is thinner (the blur carries the frost).
  static Color fill({
    required bool dark,
    bool high = false,
    bool blur = true,
  }) => Colors.white.withValues(
    alpha: high
        ? (dark ? .22 : .96)
        : dark
        ? (blur ? .10 : .06)
        : (blur ? .55 : .72),
  );

  static Color rim({required bool dark, bool high = false}) {
    final a = high ? .6 : .18;
    return dark
        ? Colors.white.withValues(alpha: a)
        : (high
              ? FlareColors.palette.dim
              : Colors.black.withValues(alpha: a * .4));
  }

  static double rimWidth({bool high = false}) => high ? 1 : .5;

  /// Dark keeps HipLab's soft lift. Light has no drop shadow (开哥
  /// 2026-11-03: the shadow under light buttons reads cheap); depth there
  /// is the hairline rim plus the fill only.
  static List<BoxShadow> shadow({required bool dark}) => dark
      ? const [
          BoxShadow(
            color: Color(0x2e000000),
            blurRadius: 16,
            offset: Offset(0, 4),
          ),
        ]
      : const [];

  /// Blur plus HipLab's slight saturation lift (1.35; light ×1.04).
  static ui.ImageFilter filter(double sigma, {required bool dark}) {
    const s = 1.35;
    const r = .2126 * (1 - s), g = .7152 * (1 - s), b = .0722 * (1 - s);
    final k = dark ? 1.0 : 1.04;
    return ui.ImageFilter.compose(
      outer: ui.ImageFilter.blur(
        sigmaX: sigma,
        sigmaY: sigma,
        tileMode: TileMode.mirror,
      ),
      inner: ui.ColorFilter.matrix([
        (r + s) * k, g * k, b * k, 0, 0, //
        r * k, (g + s) * k, b * k, 0, 0, //
        r * k, g * k, (b + s) * k, 0, 0, //
        0, 0, 0, 1, 0,
      ]),
    );
  }
}

/// One HipLab glass surface: own layer, ClipRRect, at most one
/// BackdropFilter (only when [blur]; never in high contrast).
class FlareHipGlassSurface extends StatelessWidget {
  const FlareHipGlassSurface({
    super.key,
    required this.child,
    this.radius = 16,
    this.blur = true,
    this.sigma = 20,
    this.padding = EdgeInsets.zero,
  });
  final Widget child;
  final double radius;
  final bool blur;
  final double sigma;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final high = MediaQuery.maybeHighContrastOf(context) ?? false;
    final rr = BorderRadius.circular(radius);
    Widget body = DecoratedBox(
      decoration: BoxDecoration(
        color: FlareHipGlass.fill(dark: dark, high: high, blur: blur),
      ),
      position: DecorationPosition.background,
      child: DecoratedBox(
        position: DecorationPosition.foreground,
        decoration: BoxDecoration(
          borderRadius: rr,
          border: Border.all(
            color: FlareHipGlass.rim(dark: dark, high: high),
            width: FlareHipGlass.rimWidth(high: high),
          ),
        ),
        child: Padding(padding: padding, child: child),
      ),
    );
    if (blur && !high) {
      body = BackdropFilter(
        filter: FlareHipGlass.filter(sigma, dark: dark),
        child: body,
      );
    }
    return RepaintBoundary(
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: rr,
          boxShadow: FlareHipGlass.shadow(dark: dark),
        ),
        child: ClipRRect(borderRadius: rr, child: body),
      ),
    );
  }
}

/// Fixed control surface (the home transport). HipLab dock glass, one
/// BackdropFilter per bar.
class FlareGlassBar extends StatelessWidget {
  const FlareGlassBar({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(12),
    this.radius = 16,
  });
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;

  @override
  Widget build(BuildContext context) =>
      FlareHipGlassSurface(radius: radius, padding: padding, child: child);
}

/// Home top-bar button: a 40pt rounded square (r12) of HipLab glass without
/// blur (plain page behind it, so no sampling — HipLab's rule), inside a
/// 48pt tap target.
class FlareGlassSquareButton extends StatelessWidget {
  const FlareGlassSquareButton({
    super.key,
    required this.icon,
    required this.label,
    required this.onPressed,
  });
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => Tooltip(
    message: label,
    child: Semantics(
      label: label,
      button: true,
      enabled: onPressed != null,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onPressed,
        child: Pressable(
          scale: .94,
          child: SizedBox.square(
            dimension: 48,
            child: Center(
              child: SizedBox.square(
                dimension: 40,
                child: FlareHipGlassSurface(
                  radius: 12,
                  blur: false,
                  child: Center(
                    child: ExcludeSemantics(
                      child: Icon(icon, size: 20, color: FlareColors.text),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
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
  Widget build(BuildContext context) => FlareGlassScope(
    child: Tooltip(
      message: label,
      child: GlassIconButton(
        useOwnLayer: true,
        icon: Icon(icon, color: FlareColors.text),
        size: diameter,
        iconSize: 20,
        semanticLabel: label,
        onPressed: onPressed,
      ),
    ),
  );
}

/// Stable content material: no blur, shader, Opacity or offscreen saveLayer.
class FlareStaticSurface extends StatelessWidget {
  const FlareStaticSurface({
    super.key,
    required this.child,
    this.padding = EdgeInsets.zero,
    this.radius = 16,
    this.color,
  });
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;
  final Color? color;

  static Color colorOf(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark
      ? const Color(0xea18181c)
      : const Color(0xeeffffff);

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: color ?? colorOf(context),
        borderRadius: BorderRadius.circular(radius),
        // Light: hairline rim + fill, no drop shadow (开哥 2026-11-03).
        border: Border.all(
          color: dark ? const Color(0x18ffffff) : const Color(0x0f000000),
          width: dark ? .75 : .5,
        ),
        boxShadow: dark
            ? const [
                BoxShadow(
                  color: Color(0x1f000000),
                  offset: Offset(0, 5),
                  blurRadius: 16,
                  spreadRadius: -8,
                ),
              ]
            : null,
      ),
      child: Padding(padding: padding, child: child),
    );
  }
}
