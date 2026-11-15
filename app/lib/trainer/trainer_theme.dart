import 'package:flutter/material.dart';
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

import '../ui/theme.dart';

sdk.TrainerTheme trainerTheme(BuildContext context) {
  final theme = Theme.of(context);
  final dark = theme.brightness == Brightness.dark;
  final p = dark ? FlarePalette.dark : FlarePalette.light;

  final tint = Color.lerp(p.surface, p.accent, dark ? .16 : .09)!;
  final accentText = dark
      ? p.accentInk
      : Color.lerp(p.accentInk, p.onAccent, .18)!;
  final caution = dark ? p.warning : Color.lerp(p.warning, p.onAccent, .16)!;
  final danger = dark ? p.danger : Color.lerp(p.danger, p.onAccent, .22)!;

  // The selected rest card draws a white check over the semantic color.
  final feedbackPositive = Color.lerp(
    dark ? Color.lerp(p.success, p.onAccent, .24)! : p.success,
    p.accent,
    .24,
  )!;
  final feedbackNeutral = dark
      ? Color.lerp(p.warning, p.onAccent, .36)!
      : p.warning;
  final feedbackNegative = dark ? Color.lerp(p.danger, p.accent, .16)! : danger;

  return sdk.TrainerTheme(
    brightness: theme.brightness,
    usePlayerV1: true,
    background: p.background,
    surface: p.surface,
    surfaceHigh: p.raised,
    border: p.line,
    shadow: p.shadow,
    track: p.track,
    ringKnob: Color.lerp(p.accent, Colors.white, .65)!,
    accent: p.accent,
    accentSubtle: tint,
    accentText: accentText,
    onAccent: p.onAccent,
    pausedColor: p.accent,
    onPaused: p.onAccent,
    cardSurface: p.surface,
    cardBorder: p.line,
    primaryForeground: p.onAccent,
    text: p.text,
    muted: p.muted,
    faint: p.dim,
    caution: caution,
    danger: danger,
    mediaStage: Colors.transparent,
    fontFamily: theme.textTheme.bodyMedium?.fontFamily,
    stageTop: Color.lerp(p.stage.first, p.accent, dark ? .08 : .06)!,
    stageBottom: p.stage.last,
    glow: p.accent,
    accentDeep: Color.lerp(p.accent, p.onAccent, .36)!,
    tint: tint,
    good: accentText,
    goodBg: tint,
    card: p.surface,
    sub: p.muted,
    cautionBg: Color.lerp(p.surface, caution, .10)!,
    dangerBg: Color.lerp(p.surface, danger, .10)!,
    feedbackPositive: feedbackPositive,
    feedbackNeutral: feedbackNeutral,
    feedbackNegative: feedbackNegative,
    feedbackText: p.text,
    ctrl: Color.lerp(p.control, p.accent, dark ? .08 : .06)!,
    heroTop: Color.lerp(p.onAccent, p.accent, dark ? .18 : .49)!,
    heroBottom: Color.lerp(p.onAccent, p.accent, dark ? .40 : .71)!,
  );
}
