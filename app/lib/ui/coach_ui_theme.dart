import 'package:flutter/material.dart';
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;

import 'app_glass.dart';
import 'theme.dart';

/// Product tokens and control faces only. The SDK owns conversation/card layout.
cui.CoachUiStyle flareCoachUiStyle(BuildContext context) {
  final theme = Theme.of(context);
  final p = theme.brightness == Brightness.dark
      ? FlarePalette.dark
      : FlarePalette.light;
  final base = cui.CoachUiTypography.fromTheme(theme);
  return cui.CoachUiStyle(
    colors: cui.CoachUiColors(
      brightness: p.brightness,
      text: p.text,
      muted: p.secondary,
      faint: p.dim,
      surface: p.surface,
      thumb: p.raised,
      accent: p.accent,
      accentText: p.accentInk,
      accentSoft: p.accent.withValues(alpha: .16),
      onAccent: p.onAccent,
      userBubble: p.raised,
      assistantBubble: p.surface,
      stage: cui.CoachMediaPalette(
        mediaStage: p.raised,
        onStage: p.text,
        onStageMuted: p.secondary,
      ),
      emphasis: p.accent,
      onEmphasis: p.onAccent,
      onMedia: Colors.white,
      mediaScrim: Colors.black.withValues(alpha: .55),
      landingHighlight: p.text,
    ),
    typography: cui.CoachUiTypography(
      body: base.body.copyWith(color: p.text, fontSize: 16, height: 1.5),
      callout: base.callout.copyWith(color: p.text, fontSize: 14),
      label: base.label.copyWith(color: p.secondary),
      caption: base.caption.copyWith(color: p.secondary, height: 1.4),
      greeting: base.greeting.copyWith(
        color: p.text,
        fontSize: 22,
        fontWeight: FontWeight.w700,
      ),
    ),
    strings: cui.CoachUiStrings(
      expand: '展开',
      collapse: '收起',
      expandDetails: '展开详情',
      collapseDetails: '收起详情',
      save: '保存',
      saved: '已保存',
      start: '开始训练',
      cancel: '停止',
      preparing: '正在理解你的需求…',
      progressHint: '正在查阅动作库并核对训练条件',
      answerHint: '在这里输入你的回答',
      submitAnswer: '确认回答',
      multipleHint: '可以多选，选好后确认',
      planDetails: (title) => '计划详情：$title',
      timeLabel: (at, now) =>
          '${at.hour.toString().padLeft(2, '0')}:${at.minute.toString().padLeft(2, '0')}',
    ),
    builders: cui.CoachUiBuilders(
      // Scrolling content keeps a static material, with no blur/shader layer.
      surface: (_, surface) => SizedBox(
        width: surface.width,
        child: FlareStaticSurface(
          radius: surface.radius,
          padding: surface.padding ?? EdgeInsets.zero,
          child: surface.child,
        ),
      ),
      startButton: (_, control) => IconButton.filled(
        key: const ValueKey('coach-start'),
        tooltip: '开始训练',
        onPressed: control.onTap,
        style: IconButton.styleFrom(
          backgroundColor: p.accent,
          foregroundColor: p.onAccent,
          minimumSize: const Size(48, 48),
        ),
        icon: const Icon(Icons.play_arrow_rounded, size: 27),
      ),
    ),
  );
}
