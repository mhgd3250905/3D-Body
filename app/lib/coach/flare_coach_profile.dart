import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_coach_chat/ugk_coach_chat.dart';
import 'package:ugk_coach_ui/ugk_coach_ui.dart'
    show CoachExercise, CoachMediaPalette;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../data/flare_action_scope.dart';
import '../data/flare_public_media.dart';
import '../data/flare_shared_library.dart';
import '../ui/theme.dart';

/// Flare product configuration only. Conversation, admission, fitting and
/// safety stay in the SDK; no local intent parsing or fallback is installed.
const flareCoachProfile = coach.CoachProfile(
  id: flareAppId,
  appName: '托马斯训练助手（FlareLab）',
  promptVersion: 'chat-sdk-shared-1',
  focus:
      '以托马斯全旋（Flare）专项体能为主：承重肩与支撑臂、核心压缩与转体、'
      '髋外展与腿部控制。\n'
      '可参考 App 的 6 个方向组合：热身（前臂/肩胛/前锯肌/肩袖）、支撑（三角肌/肱三头肌/'
      '前锯肌/胸大肌/背阔肌）、核心（腹直肌/髋屈肌/腹斜肌/竖脊肌）、腿（臀大肌/髋外展/'
      '内收/腘绳/股四头）、侧撑（三角肌/肩袖/腹斜肌/髋外展）、全旋链。\n'
      '只使用 App 已授权且训练说明完整的公共动作；在家优先徒手和家用器械，健身房可用器械。\n'
      '撑地类动作多，主训前安排手腕和肩胛热身（如 forearms-A、serratus-A、scapular-A）。',
  rules: [
    '语气：像 breaking 教练：简短、直接、给信心，可以用“支撑臂”“压缩”“侧撑”这类托马斯术语，不说空话。',
    '越界请求由 SDK 范围规则说明或给出库内相关动作建议；不能把名单外或训练说明待补的动作加入计划，'
        '也不作医疗诊断或康复处方。',
  ],
  select: coach.DrillSelector(ids: flareAuthorizedActionIds),
  scenes: {
    'home': coach.SceneRule(
      label: '居家',
      assumedEquipment: {'mat', 'chair', 'wall', 'block'},
      acceptDrillScenes: {'home'},
    ),
    'gym': coach.SceneRule(
      label: '健身房',
      allEquipment: true,
      acceptDrillScenes: {'gym', 'home'},
    ),
  },
  goals: ['warmup', 'strength', 'core', 'fullbody'],
  limits: coach.PlanLimits(minutes: coach.IntRange(5, 60)),
  ambientEquipment: {
    'home': {'equip.mat', 'equip.wall', 'equip.chair'},
    'gym': {'equip.mat', 'equip.wall', 'equip.chair'},
  },
  ambientEquipmentUnknown: {'equip.wall', 'equip.mat'},
);

/// Flare's CoachAppProfile: brand, strings, scope and shared media/library.
CoachAppProfile flareCoachAppProfile({
  required FlareShared shared,
  required coach.PlanExecutionTimingCallback executionTiming,
}) => CoachAppProfile(
  appId: flareAppId,
  revision: 'chat-sdk-shared-1',
  scopeManifest: shared.scope,
  library: shared.library,
  mediaPolicy: FlarePublicMedia.current,
  coachProfile: flareCoachProfile,
  conversationPolicy: coach.CoachScopeConversationPolicy(
    specialty: 'Flare 专注托马斯全旋专项体能：支撑臂、核心压缩、髋外展与腿部控制。',
    suggestions: const ['在家练 20 分钟托马斯支撑', '撑地前的手腕和肩胛热身', '练侧撑和核心压缩'],
  ),
  executionTiming: executionTiming,
  strings: const CoachChatStrings(
    invitation: '今天想练托马斯哪一环？',
    returningInvitation: '欢迎回来，今天想练哪一环？',
    inputHint: '说说想练什么、在哪儿、有多久…',
    libraryLabel: '动作库',
    defaultSuggestions: [
      '在家练 20 分钟托马斯支撑',
      '撑地前的手腕和肩胛热身',
      '练侧撑和核心压缩',
      '健身房练腿和髋外展',
    ],
    safetyIntro:
        '你好，我是托马斯训练助手。\n告诉我想练哪一环、在哪儿、有多少时间，'
        '我帮你安排能直接跟练的训练。',
  ),
  visual: flareCoachChatVisuals(shared),
);

/// Brand roles and public posters only; the SDK owns chat layout and media.
CoachChatVisuals flareCoachChatVisuals(FlareShared shared) => CoachChatVisuals(
  light: flareCoachChatPalette(FlarePalette.light),
  dark: flareCoachChatPalette(FlarePalette.dark),
  fontFamily: 'FlareSans',
  exerciseFor: (id, brightness) {
    final drill = shared.catalog[id];
    final poster = FlarePublicMedia.current?.posterAssetFor(id);
    final action = FlarePublicMedia.current?.actionFor(id);
    if (!shared.allowedActionIds.contains(id) ||
        drill == null ||
        poster == null) {
      return null;
    }
    final p = brightness == Brightness.dark
        ? FlarePalette.dark
        : FlarePalette.light;
    return CoachExercise(
      id: id,
      name: drill.name.of('zh'),
      poster: poster,
      categoryLabel: action == null
          ? drill.category
          : trainer.PoseHubActionFacets.type(action),
      levelLabel: coach.levelZh(drill.level),
      cues: drill.cues['zh'] ?? const [],
      stage: CoachMediaPalette(
        mediaStage: p.raised,
        onStage: p.text,
        onStageMuted: p.secondary,
      ),
    );
  },
  preloadPoster: (context, id) async {
    final poster = FlarePublicMedia.current?.posterAssetFor(id);
    if (poster != null) {
      await trainer.TrainingPosterImages.prepareAsset(context, poster);
    }
  },
);

CoachChatPalette flareCoachChatPalette(FlarePalette p) {
  final dark = p.brightness == Brightness.dark;
  return CoachChatPalette(
    brightness: p.brightness,
    skyTop: p.background,
    skyBottom: p.background,
    dust: p.accent.withValues(alpha: dark ? .2 : .12),
    background: p.background,
    surfaceLow: p.track,
    surface: p.surface,
    surfaceHigh: p.raised,
    line: p.hairline,
    accent: p.accent,
    accentText: p.accentInk,
    onAccent: p.onAccent,
    emphasis: p.accent,
    emphasisText: p.accentInk,
    onEmphasis: p.onAccent,
    text: p.text,
    muted: p.secondary,
    faint: p.dim,
    caution: p.warning,
    danger: const Color(0xFFE5484D),
    mediaStage: p.raised,
    onStage: p.text,
    onStageMuted: p.secondary,
    thumb: p.raised,
    scrim: Colors.black.withValues(alpha: .55),
    track: p.track,
    userBubble: p.raised,
    assistantBubble: p.surface,
    shadow: Colors.black.withValues(alpha: dark ? .4 : .08),
  );
}
