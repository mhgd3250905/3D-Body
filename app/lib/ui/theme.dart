import 'package:flutter/material.dart';

abstract final class FlareColors {
  static const background = Color(0xff08080a);
  static const surface = Color(0xff17171b);
  static const raised = Color(0xff202026);
  static const accent = Color(0xffff6a3d);
  static const muted = Color(0xffa6a6b2);
  static const success = Color(0xff30d158);
  static const text = Color(0xfff2f2f5);
  static const secondary = Color(0xffc9c9d1);
  static const dim = Color(0xff74747e);
  static const hairline = Color(0x14ffffff);
  static const control = Color(0xff18181c);
  static const controlBorder = Color(0xff38383f);
  static const onAccent = Color(0xff1d0a03);
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
        minimumSize: const Size(48, 54),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        foregroundColor: FlareColors.onAccent,
        disabledBackgroundColor: const Color(0xff2a2a30),
        disabledForegroundColor: const Color(0xff6c6c75),
        textStyle: const TextStyle(
          fontFamily: 'FlareSans',
          fontSize: 16,
          fontWeight: FontWeight.w700,
          letterSpacing: .5,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(48, 48),
        side: const BorderSide(color: FlareColors.controlBorder, width: .6),
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
    dividerColor: FlareColors.hairline,
    dividerTheme: const DividerThemeData(
      color: FlareColors.hairline,
      space: 1,
      thickness: .6,
    ),
    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: Color(0xff141417),
      surfaceTintColor: Colors.transparent,
      showDragHandle: true,
      dragHandleColor: Color(0xff4a4a52),
      dragHandleSize: Size(36, 4),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
    ),
    snackBarTheme: const SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      backgroundColor: Color(0xff26262c),
      contentTextStyle: TextStyle(color: FlareColors.text, fontSize: 14),
    ),
    segmentedButtonTheme: SegmentedButtonThemeData(
      style: SegmentedButton.styleFrom(
        backgroundColor: FlareColors.surface,
        selectedBackgroundColor: const Color(0xff2e2e35),
        selectedForegroundColor: FlareColors.text,
        foregroundColor: FlareColors.dim,
        side: const BorderSide(color: FlareColors.hairline),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
  );
}
