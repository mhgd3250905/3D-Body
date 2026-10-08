import 'package:flutter/material.dart';

abstract final class FlareColors {
  static const background = Color(0xff08080a);
  static const surface = Color(0xff17171b);
  static const raised = Color(0xff202026);
  static const accent = Color(0xffff6a3d);
  static const muted = Color(0xffa6a6b2);
  static const success = Color(0xff30d158);
}

ThemeData flareTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: FlareColors.accent,
    brightness: Brightness.dark,
    primary: FlareColors.accent,
    surface: FlareColors.surface,
  );
  return ThemeData(
    colorScheme: scheme,
    brightness: Brightness.dark,
    fontFamily: 'FlareSans',
    scaffoldBackgroundColor: FlareColors.background,
    useMaterial3: true,
    appBarTheme: const AppBarTheme(
      backgroundColor: FlareColors.background,
      surfaceTintColor: Colors.transparent,
      centerTitle: false,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(48, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        foregroundColor: const Color(0xff1d0a03),
        textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(48, 48),
        side: const BorderSide(color: Color(0xff393940)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        foregroundColor: Colors.white,
      ),
    ),
    iconButtonTheme: IconButtonThemeData(
      style: IconButton.styleFrom(minimumSize: const Size(48, 48)),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: FlareColors.surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
    ),
    chipTheme: ChipThemeData(
      side: const BorderSide(color: Color(0xff33333c)),
      backgroundColor: FlareColors.surface,
      selectedColor: FlareColors.accent.withValues(alpha: .2),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      labelStyle: const TextStyle(fontSize: 12, color: Colors.white),
      secondaryLabelStyle: const TextStyle(fontSize: 12, color: Colors.white),
    ),
    navigationBarTheme: const NavigationBarThemeData(
      backgroundColor: Color(0xff0f0f12),
      surfaceTintColor: Colors.transparent,
      indicatorColor: Color(0xff492419),
      height: 72,
    ),
    sliderTheme: const SliderThemeData(
      trackHeight: 3,
      thumbShape: RoundSliderThumbShape(enabledThumbRadius: 7),
    ),
    dividerColor: const Color(0xff2b2b33),
  );
}
