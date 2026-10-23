import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

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

/// Fixed control surface. Never use this in a scrolling row or over 3D/video.
class FlareGlassBar extends StatelessWidget {
  const FlareGlassBar({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(8),
    this.radius = 28,
  });
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;

  @override
  Widget build(BuildContext context) => FlareGlassScope(
    child: GlassContainer(
      useOwnLayer: true,
      shape: LiquidRoundedSuperellipse(borderRadius: radius),
      padding: padding,
      child: child,
    ),
  );
}

class FlareGlassIconButton extends StatelessWidget {
  const FlareGlassIconButton({
    super.key,
    required this.icon,
    required this.label,
    required this.onPressed,
  });
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => FlareGlassScope(
    child: Tooltip(
      message: label,
      child: GlassIconButton(
        useOwnLayer: true,
        icon: Icon(icon, color: FlareColors.text),
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
    this.radius = 22,
  });
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: dark ? const Color(0xea242428) : const Color(0xeeffffff),
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(
          color: dark ? const Color(0x18ffffff) : const Color(0xb3ffffff),
          width: .75,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: dark ? .12 : .035),
            offset: const Offset(0, 5),
            blurRadius: 16,
            spreadRadius: -8,
          ),
        ],
      ),
      child: Padding(padding: padding, child: child),
    );
  }
}
