import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart' show CupertinoPageTransitionsBuilder;

/// One complete set of colour tokens. Dark is the original graphite stage;
/// light is a warm paper stage with the same orange accent, tuned so text,
/// hairlines and the 3D figure keep the same hierarchy.
class FlarePalette {
  const FlarePalette({
    required this.brightness,
    required this.background,
    required this.surface,
    required this.raised,
    required this.accent,
    required this.accentInk,
    required this.onAccent,
    required this.muted,
    required this.success,
    required this.warning,
    required this.text,
    required this.secondary,
    required this.dim,
    required this.hairline,
    required this.control,
    required this.controlBorder,
    required this.controlIcon,
    required this.solid,
    required this.onSolid,
    required this.pill,
    required this.sheet,
    required this.popup,
    required this.track,
    required this.stage,
    required this.body,
    required this.navigation,
    required this.navigationIndicator,
    required this.disabled,
    required this.onDisabled,
    required this.selectedSegment,
    required this.dragHandle,
    required this.snack,
    required this.segmentTrack,
    required this.segmentThumb,
    required this.line,
    required this.faint,
    required this.danger,
    required this.mediaBackdrop,
    required this.switchOff,
    required this.shadow,
  });

  final Brightness brightness;
  final Color background;
  final Color surface;
  final Color raised;
  final Color accent;

  /// Accent as text or a thin glyph on the page (AA contrast); [accent] is
  /// for fills.
  final Color accentInk;
  final Color onAccent;
  final Color muted;
  final Color success;
  final Color warning;
  final Color text;
  final Color secondary;
  final Color dim;
  final Color hairline;
  final Color control;
  final Color controlBorder;
  final Color controlIcon;

  /// High-contrast round control (the play button).
  final Color solid;
  final Color onSolid;
  final Color pill;
  final Color sheet;
  final Color popup;

  /// Progress ring and timeline tracks.
  final Color track;

  /// Radial stage gradient, centre to edge.
  final List<Color> stage;
  final Color body;
  final Color navigation;
  final Color navigationIndicator;
  final Color disabled;
  final Color onDisabled;
  final Color selectedSegment;
  final Color dragHandle;
  final Color snack;

  /// iOS-style segmented control: recessed track and the sliding thumb.
  final Color segmentTrack;
  final Color segmentThumb;

  // HipLab semantic roles (docs/ui-hiplab-adoption-plan.md). Thomas keeps
  // its own neutrals and orange; these fill the roles the HipLab kit names
  // that the Flare palette did not have yet.

  /// Solid hairline stroke (cards, dialogs, the light-theme disc edge).
  final Color line;

  /// Tertiary information (meta, placeholder). Not a body-text colour.
  final Color faint;

  /// Destructive actions and error text, tuned per theme.
  final Color danger;

  /// What sits behind a drill render so letterboxing matches the art.
  final Color mediaBackdrop;

  /// iOS switch track when off.
  final Color switchOff;

  /// Card contact shadow; only the light theme shows it.
  final Color shadow;

  bool get isDark => brightness == Brightness.dark;

  static const dark = FlarePalette(
    brightness: Brightness.dark,
    background: Color(0xff08080a),
    surface: Color(0xff17171b),
    raised: Color(0xff202026),
    accent: Color(0xffff6a3d),
    accentInk: Color(0xffff6a3d),
    onAccent: Color(0xff1d0a03),
    muted: Color(0xffa6a6b2),
    success: Color(0xff30d158),
    warning: Color(0xffffc233),
    text: Color(0xfff2f2f5),
    secondary: Color(0xffc9c9d1),
    dim: Color(0xff80808a),
    hairline: Color(0x14ffffff),
    control: Color(0xff18181c),
    controlBorder: Color(0xff38383f),
    controlIcon: Color(0xffebebef),
    solid: Color(0xffffffff),
    onSolid: Color(0xff111113),
    pill: Color(0xff1c1c21),
    sheet: Color(0xff141417),
    popup: Color(0xff1f1f24),
    track: Color(0xff26262c),
    stage: [Color(0xff2b2b31), Color(0xff151518), Color(0xff08080a)],
    body: Color(0xffd8d8df),
    navigation: Color(0xff0f0f12),
    navigationIndicator: Color(0xff492419),
    disabled: Color(0xff2a2a30),
    onDisabled: Color(0xff6c6c75),
    selectedSegment: Color(0xff2e2e35),
    dragHandle: Color(0xff4a4a52),
    snack: Color(0xff26262c),
    segmentTrack: Color(0xff1c1c21),
    segmentThumb: Color(0xff3a3a42),
    line: Color(0xff2a2a30),
    faint: Color(0xff5e5e67),
    danger: Color(0xffef5a5a),
    mediaBackdrop: Color(0xff101013),
    switchOff: Color(0xff39393d),
    shadow: Color(0x66000000),
  );

  static const light = FlarePalette(
    brightness: Brightness.light,
    background: Color(0xfff5f4f1),
    surface: Color(0xffffffff),
    raised: Color(0xffefeee9),
    accent: Color(0xfff2602f),
    accentInk: Color(0xffc94e1c),
    onAccent: Color(0xff2a0d02),
    muted: Color(0xff5f5f69),
    success: Color(0xff188540),
    warning: Color(0xff9c6512),
    text: Color(0xff16161a),
    secondary: Color(0xff4b4b54),
    dim: Color(0xff74747d),
    hairline: Color(0x14000000),
    control: Color(0xffffffff),
    controlBorder: Color(0xffdedcd6),
    controlIcon: Color(0xff2a2a30),
    solid: Color(0xff16161a),
    onSolid: Color(0xffffffff),
    pill: Color(0xffffffff),
    sheet: Color(0xfffbfaf8),
    popup: Color(0xffffffff),
    track: Color(0xffe6e4de),
    stage: [Color(0xfff8f7f4), Color(0xffedebe6), Color(0xffe1dfd8)],
    body: Color(0xff33333a),
    navigation: Color(0xffffffff),
    navigationIndicator: Color(0xffffe2d6),
    disabled: Color(0xffe6e4de),
    onDisabled: Color(0xffa3a3ab),
    selectedSegment: Color(0xff16161a),
    dragHandle: Color(0xffcfcdc6),
    snack: Color(0xff26262c),
    segmentTrack: Color(0xffe8e6e1),
    segmentThumb: Color(0xffffffff),
    line: Color(0xffe1dfd9),
    faint: Color(0xff9a9aa2),
    danger: Color(0xffd43f3f),
    mediaBackdrop: Color(0xffefefef),
    switchOff: Color(0xffe9e9ea),
    shadow: Color(0x121d1a16),
  );
}

/// Active palette. MaterialApp's builder sets it from the resolved theme
/// brightness before any page builds, and pages depend on Theme so a switch
/// repaints everything without recreating state (the 3D view stays alive).
abstract final class FlareColors {
  static FlarePalette palette = FlarePalette.dark;
  static void use(Brightness brightness) => palette =
      brightness == Brightness.light ? FlarePalette.light : FlarePalette.dark;

  static Color get background => palette.background;
  static Color get surface => palette.surface;
  static Color get raised => palette.raised;
  static Color get accent => palette.accent;
  static Color get accentInk => palette.accentInk;
  static Color get onAccent => palette.onAccent;
  static Color get muted => palette.muted;
  static Color get success => palette.success;
  static Color get warning => palette.warning;

  static bool get isDark => palette.isDark;

  /// Destructive actions (delete) and error text.
  static Color get danger => palette.danger;

  // HipLab role names, mapped onto the Thomas palette.
  static Color get surfaceHigh => palette.raised;
  static Color get line => palette.line;
  static Color get faint => palette.faint;

  /// Accent as text on the page; [accent] stays the fill colour.
  static Color get accentText => palette.accentInk;
  static Color get mediaBackdrop => palette.mediaBackdrop;
  static Color get switchOff => palette.switchOff;

  /// Medium-emphasis button fill: inset track on light, a raised white
  /// wash on dark (near-black on near-black would not read).
  static Color get secondaryFill =>
      palette.isDark ? const Color(0x1affffff) : palette.track;

  /// Primary fill while held: the accent dipped 10 % toward black.
  static Color get accentPressed =>
      Color.lerp(palette.accent, const Color(0xff000000), .10)!;

  /// Soft elevation for content cards: none on dark (strokes carry the
  /// shape), a faint two-layer contact shadow on light. Settings groups,
  /// the back capsule and buttons never take it.
  static List<BoxShadow>? get cardShadow => palette.isDark
      ? null
      : [
          BoxShadow(
            color: palette.shadow,
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
          const BoxShadow(
            color: Color(0x08000000),
            blurRadius: 2,
            offset: Offset(0, 1),
          ),
        ];
  static Color get text => palette.text;
  static Color get secondary => palette.secondary;
  static Color get dim => palette.dim;
  static Color get hairline => palette.hairline;
  static Color get control => palette.control;
  static Color get controlBorder => palette.controlBorder;
  static Color get controlIcon => palette.controlIcon;
  static Color get solid => palette.solid;
  static Color get onSolid => palette.onSolid;
  static Color get pill => palette.pill;
  static Color get popup => palette.popup;
  static Color get track => palette.track;
  static List<Color> get stage => palette.stage;
  static Color get body => palette.body;
}

/// Bundled FlareSans with per-script fallbacks for the 14 UI languages.
const flareFontFamily = 'FlareSans';
const flareFontFallback = <String>[
  'NotoSansKR',
  'NotoSansArabic',
  'NotoSansDevanagari',
];

/// Text roles from the HipLab geometry table. Colour is left to the caller
/// (or the default text colour) so a role reads right on any surface.
abstract final class FlareType {
  static const TextStyle _base = TextStyle(
    fontFamily: flareFontFamily,
    fontFamilyFallback: flareFontFallback,
  );

  /// Top bar title 17/w600 and its 12 subtitle.
  static final TextStyle navTitle = _base.copyWith(
    fontSize: 17,
    fontWeight: FontWeight.w600,
  );
  static final TextStyle navSubtitle = _base.copyWith(fontSize: 12);

  /// Settings row: title 17/w400, subtitle 13, trailing meta 14.
  static final TextStyle rowTitle = _base.copyWith(
    fontSize: 17,
    fontWeight: FontWeight.w400,
  );
  static final TextStyle rowSubtitle = _base.copyWith(fontSize: 13);
  static final TextStyle rowMeta = _base.copyWith(fontSize: 14);

  /// Primary 17/w600 and secondary 17/w500 button labels.
  static final TextStyle primaryButton = _base.copyWith(
    fontSize: 17,
    fontWeight: FontWeight.w600,
  );
  static final TextStyle secondaryButton = _base.copyWith(
    fontSize: 17,
    fontWeight: FontWeight.w500,
  );

  /// Settings segmented control: 13, the selected segment w600.
  static final TextStyle segment = _base.copyWith(fontSize: 13);
}

/// Control geometry from the HipLab standard (logical px).
abstract final class FlareGeometry {
  static const double buttonHeight = 50;
  static const double buttonRadius = 14;
  static const double groupRadius = 10;
  static const double groupGap = 28;
  static const double rowMinHeight = 52;
  static const double rowMinHeightWithSubtitle = 60;
  static const double rowIconSlot = 30;
  static const double rowTextStart = 58;
  static const double hairline = .5;
  static const double navRow = 44;
  static const double navRowWithSubtitle = 52;
  static const double navFade = 24;
  static const double hitTarget = 44;
  static const double dialogMaxWidth = 320;
  static const double dialogRadius = 14;
}

ThemeMode themeModeOf(String value) => switch (value) {
  'light' => ThemeMode.light,
  'dark' => ThemeMode.dark,
  _ => ThemeMode.system,
};

ThemeData flareTheme([Brightness brightness = Brightness.dark]) {
  final p = brightness == Brightness.light
      ? FlarePalette.light
      : FlarePalette.dark;
  final scheme = ColorScheme.fromSeed(
    seedColor: p.accent,
    brightness: brightness,
    primary: p.accent,
    onPrimary: p.onAccent,
    surface: p.surface,
    onSurface: p.text,
  );
  return ThemeData(
    colorScheme: scheme,
    brightness: brightness,
    fontFamily: flareFontFamily,
    fontFamilyFallback: flareFontFallback,
    scaffoldBackgroundColor: p.background,
    canvasColor: p.background,
    useMaterial3: true,
    // Quiet, iOS-like touch feedback: a soft highlight instead of a ripple
    // spreading across cards; cards add their own press-scale.
    splashFactory: NoSplash.splashFactory,
    highlightColor: p.text.withValues(alpha: .06),
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.linux: CupertinoPageTransitionsBuilder(),
        TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
      },
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: p.background,
      surfaceTintColor: Colors.transparent,
      centerTitle: true,
    ),
    // HipLab buttons: flat 50 / radius 14, no elevation or glow; a held
    // primary dips 10 % toward black, a held secondary toward surfaceHigh.
    filledButtonTheme: FilledButtonThemeData(
      style: ButtonStyle(
        minimumSize: const WidgetStatePropertyAll(
          Size(48, FlareGeometry.buttonHeight),
        ),
        elevation: const WidgetStatePropertyAll(0),
        shape: const WidgetStatePropertyAll(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(FlareGeometry.buttonRadius),
            ),
          ),
        ),
        backgroundColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.disabled)
              ? p.raised
              : states.contains(WidgetState.pressed)
              ? Color.lerp(p.accent, const Color(0xff000000), .10)
              : p.accent,
        ),
        foregroundColor: WidgetStateProperty.resolveWith(
          (states) =>
              states.contains(WidgetState.disabled) ? p.muted : p.onAccent,
        ),
        overlayColor: const WidgetStatePropertyAll(Colors.transparent),
        textStyle: WidgetStatePropertyAll(FlareType.primaryButton),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      // Medium emphasis is a fill, not an outline (HipLab secondary).
      style: ButtonStyle(
        minimumSize: const WidgetStatePropertyAll(
          Size(48, FlareGeometry.buttonHeight),
        ),
        padding: const WidgetStatePropertyAll(
          EdgeInsets.symmetric(horizontal: 16),
        ),
        side: const WidgetStatePropertyAll(BorderSide.none),
        shape: const WidgetStatePropertyAll(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(FlareGeometry.buttonRadius),
            ),
          ),
        ),
        backgroundColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.pressed)
              ? p.raised
              : p.isDark
              ? const Color(0x1affffff)
              : p.track,
        ),
        foregroundColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.disabled) ? p.muted : p.text,
        ),
        overlayColor: const WidgetStatePropertyAll(Colors.transparent),
        textStyle: WidgetStatePropertyAll(FlareType.secondaryButton),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(foregroundColor: p.accentInk),
    ),
    iconButtonTheme: IconButtonThemeData(
      style: IconButton.styleFrom(minimumSize: const Size(48, 48)),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: p.surface,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: p.isDark
            ? BorderSide.none
            : BorderSide(color: p.controlBorder, width: .6),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: p.isDark
            ? BorderSide.none
            : BorderSide(color: p.controlBorder, width: .6),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      side: BorderSide(color: p.dim, width: 1.2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
    ),
    chipTheme: ChipThemeData(
      side: BorderSide(color: p.controlBorder),
      backgroundColor: p.surface,
      selectedColor: p.accent.withValues(alpha: .2),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      labelStyle: TextStyle(
        fontFamily: flareFontFamily,
        fontFamilyFallback: flareFontFallback,
        fontSize: 12,
        color: p.text,
      ),
      secondaryLabelStyle: TextStyle(
        fontFamily: flareFontFamily,
        fontFamilyFallback: flareFontFallback,
        fontSize: 12,
        color: p.text,
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: p.navigation,
      surfaceTintColor: Colors.transparent,
      indicatorColor: p.navigationIndicator,
      height: 72,
    ),
    sliderTheme: const SliderThemeData(
      trackHeight: 3,
      thumbShape: RoundSliderThumbShape(enabledThumbRadius: 7),
    ),
    dividerColor: p.hairline,
    dividerTheme: DividerThemeData(color: p.hairline, space: 1, thickness: .6),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: p.sheet,
      surfaceTintColor: Colors.transparent,
      showDragHandle: true,
      dragHandleColor: p.dragHandle,
      dragHandleSize: const Size(36, 4),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
    ),
    popupMenuTheme: PopupMenuThemeData(
      color: p.popup,
      surfaceTintColor: Colors.transparent,
    ),
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      backgroundColor: p.snack,
      contentTextStyle: const TextStyle(color: Color(0xfff2f2f5), fontSize: 14),
    ),
    segmentedButtonTheme: SegmentedButtonThemeData(
      style: SegmentedButton.styleFrom(
        backgroundColor: p.surface,
        selectedBackgroundColor: p.selectedSegment,
        selectedForegroundColor: p.isDark ? p.text : p.onSolid,
        foregroundColor: p.dim,
        side: BorderSide(color: p.hairline),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
    listTileTheme: ListTileThemeData(textColor: p.text, iconColor: p.text),
  );
}

/// iOS-style scrolling everywhere: bouncing edges instead of Android's glow,
/// so lists feel the same on every phone.
class FlareScrollBehavior extends MaterialScrollBehavior {
  const FlareScrollBehavior();
  @override
  ScrollPhysics getScrollPhysics(BuildContext context) =>
      const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics());
  @override
  Widget buildOverscrollIndicator(
    BuildContext context,
    Widget child,
    ScrollableDetails details,
  ) => child;
}
