import 'package:flutter/material.dart';
import 'package:ugk_trainer/ugk_trainer.dart' as sdk;

import '../ui/theme.dart';

sdk.TrainerTheme trainerTheme(BuildContext context) {
  final dark = Theme.of(context).brightness == Brightness.dark;
  final p = dark ? FlarePalette.dark : FlarePalette.light;
  return (dark ? sdk.TrainerTheme.dark : sdk.TrainerTheme.light).copyWith(
    background: p.background,
    surface: p.surface,
    surfaceHigh: p.raised,
    accent: p.accent,
    accentText: p.accentInk,
    onAccent: p.onAccent,
    pausedColor: p.accent,
    onPaused: p.onAccent,
    text: p.text,
    muted: p.muted,
    fontFamily: Theme.of(context).textTheme.bodyMedium?.fontFamily,
  );
}
