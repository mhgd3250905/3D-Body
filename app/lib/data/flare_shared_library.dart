// Flare scope, theme and library presentation; SDK owns catalogue semantics,
// media, details and training entry. Browsing requests display artwork only.
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../ui/theme.dart';
import '../ui/components.dart';
import '../ui/flare_action_artwork.dart';
import '../ui/page_kit.dart';
import '../ui/public_library_filter.dart';
import '../trainer/trainer_audio.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/trainer_voice.dart';
import '../trainer/training_plan_adapter.dart';
import 'catalog.dart' as flare;
import 'flare_drill_resolver.dart';
import 'flare_action_scope.dart';
import 'flare_public_catalog.dart';
import 'flare_public_media.dart';
import 'flare_v5_drill.dart';

/// The verified public definitions shared by Coach, library and player.
class FlareShared {
  FlareShared._({
    required this.pack,
    required this.catalog,
    required this.rhythms,
    required this.scope,
  }) : library = _libraryConfig(scope, 'zh');

  static trainer.TrainingLibraryConfig _libraryConfig(
    coach.CoachActionScopeManifest scope,
    String languageTag, {
    trainer.TrainingLibraryActionText? Function(String)? displayText,
  }) => trainer.TrainingLibraryConfig(
    scopeManifest: scope,
    brand: 'Flare',
    // SF-style defaults: strength first; no start button in details.
    categoryOrder: const ['力量', '拉伸放松'],
    strings: trainer.TrainingLibraryStrings.forLanguage(languageTag),
    displayText: displayText,
  );

  /// Set at startup (main.dart); tests may install their own.
  static FlareShared? current;

  final coach.PoseHubAppTestCatalog pack;

  /// Coach catalog projected from the public definitions (execution cycle).
  final coach.Catalog catalog;
  final Map<String, trainer.Rhythm> rhythms;
  final coach.CoachActionScopeManifest scope;
  final trainer.TrainingLibraryConfig library;

  /// SDK library strings and action details for the current app locale.
  trainer.TrainingLibraryConfig libraryFor(
    BuildContext context, {
    String? planActionId,
  }) {
    final locale = Localizations.localeOf(context);
    // Authored routines can inspect their extra actions outside the general
    // library and Coach action allowlist.
    final detailScope =
        planActionId != null &&
            (planActionId == flareWarmupPushupId ||
                flareSupplementalActionIds.contains(planActionId)) &&
            catalog[planActionId] != null
        ? coach.CoachActionScopeManifest.fromCatalogBytes(
            appId: flareAppId,
            catalogBytes: utf8.encode(jsonEncode(catalog.toJson())),
            allowedActionIds: [planActionId],
          )
        : scope;
    return _libraryConfig(
      detailScope,
      locale.toLanguageTag(),
      displayText: locale.languageCode == 'en' ? _englishActionText : null,
    );
  }

  trainer.TrainingLibraryActionText? _englishActionText(String id) {
    final action = pack.tryGet(id);
    if (action == null) return null;
    final raw = action.raw;
    final name = raw['nameEn'];
    final contraindications = _textRows(raw['contraindications']) ?? const [];
    return trainer.TrainingLibraryActionText(
      name: name is String && name.trim().isNotEmpty ? name : null,
      cues: _textRows(raw['cuesEn']),
      cautions: [
        ...?_textRows(raw['cautionsEn'] ?? raw['cautions']),
        for (final area in contraindications)
          if (_englishCautionAreas[area] case final String english)
            'Avoid this move if you have $english problems.'
          else
            area,
      ],
    );
  }

  static List<String>? _textRows(Object? value) =>
      value is List ? value.whereType<String>().toList() : null;

  // r2-v11 supplies English cues and cautions, but its contraindication tags
  // are Chinese. Keep the meaning of each tag, including any unknown one.
  static const _englishCautionAreas = {
    '肩': 'shoulder',
    '腰': 'lower back',
    '手腕': 'wrist',
    '膝': 'knee',
    '髋': 'hip',
    '大腿内侧': 'inner thigh',
    '颈': 'neck',
  };

  Set<String> get allowedActionIds => scope.allowedActionIds;

  coach.TrainingPlan authoredPlan(
    flare.FlarePlan plan,
    flare.Catalog presentation,
    String scene, {
    String? title,
    bool skipStrengthening = false,
    List<String>? wristDirections,
    ({String clockwise, String counterclockwise}) circleDirections = const (
      clockwise: '顺时针',
      counterclockwise: '逆时针',
    ),
  }) => trainingPlanFromFlarePlan(
    plan: plan,
    title: title ?? plan.id,
    sceneTier: scene,
    catalog: presentation,
    sourceCatalog: catalog,
    rhythms: rhythms,
    skipStrengthening: skipStrengthening,
    wristDirections: wristDirections ?? const ['手指朝前', '手指朝侧', '手指朝后', '手背撑地'],
    circleDirections: circleDirections,
  );

  int? authoredPlanMinutes(
    flare.FlarePlan plan,
    flare.Catalog presentation,
    String scene,
  ) {
    try {
      return authoredPlan(plan, presentation, scene).targetMinutes;
    } on UnknownTrainingDrills {
      return null;
    }
  }

  Set<String> authoredPlanEquipment(flare.FlarePlan plan, String scene) => {
    if (!plan.isSupplemental)
      for (final item in plan.items)
        for (final tool
            in catalog[item.drillForScene(scene)]?.equipment ??
                const <String>[])
          switch ((item.drillForScene(scene), tool, scene)) {
            ('forearms-B', 'bench', 'B') => 'chair',
            ('rotator-cuff-B', 'block', _) => 'clamp-pad',
            _ => tool,
          },
  };

  static Future<FlareShared> load({
    AssetBundle? bundle,
    coach.PoseHubAppTestCatalog? activeCatalog,
  }) async {
    final pack = activeCatalog ?? await loadFlarePublicCatalog(bundle: bundle);
    final rhythms = flarePublicRhythms(pack);
    final catalog = flareCoachCatalogFromPublic(pack, rhythms: rhythms);
    return FlareShared._(
      pack: pack,
      catalog: catalog,
      rhythms: rhythms,
      scope: flareActionScope(catalog),
    );
  }

  /// One execution configuration for Coach timing and the player.
  trainer.SessionBuilder sessionBuilder() => trainer.SessionBuilder(
    rhythms: rhythms,
    known: (id) => catalog[id] != null,
    // Estimate allowance per side switch (SDK v0.6.0, user 2026-11-03).
    sideSwitchMarginSeconds:
        trainer.SessionBuilder.recommendedSideSwitchMarginSeconds,
  );

  /// Display name in the current language, falling back to Chinese.
  String? nameOf(String id, String language) {
    final drill = catalog[id];
    if (drill == null) return null;
    return drill.name.of(language);
  }

  static trainer.TrainerTheme theme(BuildContext context) {
    final p = Theme.of(context).brightness == Brightness.dark
        ? FlarePalette.dark
        : FlarePalette.light;
    return trainer.TrainerTheme(
      brightness: p.brightness,
      background: p.background,
      surface: p.surface,
      surfaceHigh: p.raised,
      border: p.hairline,
      shadow: Colors.black.withValues(
        alpha: p.brightness == Brightness.dark ? .4 : .08,
      ),
      track: p.track,
      ringKnob: p.raised,
      accent: p.accent,
      accentSubtle: p.accent.withValues(alpha: .14),
      accentText: p.accentInk,
      onAccent: p.onAccent,
      text: p.text,
      muted: p.secondary,
      faint: p.dim,
      caution: p.warning,
      danger: const Color(0xFFE5484D),
      mediaStage: p.raised,
      fontFamily: Theme.of(context).textTheme.bodyMedium?.fontFamily,
    );
  }

  /// SDK action details with the host's localized presentation.
  static Future<void> openDetail(
    BuildContext context,
    String id, {
    bool soundEnabled = true,
  }) async {
    final shared = current;
    final policy = FlarePublicMedia.of(context);
    if (shared == null || policy == null) return;
    final resolvedTheme = theme(context);
    await trainer.TrainingLibraryDetails.open(
      context,
      actionId: id,
      config: shared.libraryFor(context, planActionId: id),
      mediaPolicy: policy,
      theme: resolvedTheme.copyWith(mediaStage: Colors.transparent),
      onStart: soundEnabled && !flareSupplementalActionIds.contains(id)
          ? (actionId) async {
              final action = policy.actionFor(actionId);
              if (action == null) return;
              final language = Localizations.localeOf(context).languageCode;
              final source = await trainer.withPoseHubCatalogVoice(
                await loadTrainerVoiceSource(
                  language: language,
                  leftFirst: false,
                ),
                catalog: policy.catalog,
              );
              if (!context.mounted) return;
              trainer.TrainerVoice? voice;
              await trainer.TrainerLauncher.open<void>(
                context,
                firstPosterAsset: policy.posterAssetFor(actionId),
                planActionIds: [actionId],
                mediaPolicy: policy,
                theme: resolvedTheme,
                builder: (_) => trainer.PoseHubSinglePracticePage(
                  action: action,
                  mediaBaseUri: policy.repository.mediaBaseUri,
                  theme: resolvedTheme,
                  voice: voice ??= trainer.TrainerVoice(
                    source: source,
                    output: trainerAudio.acquire(),
                    settings: trainer.VoiceSettings(language: language),
                  ),
                ),
              );
            }
          : null,
    );
  }
}

/// App presentation over exactly the SDK-scoped actions, using the shared
/// posters and SDK details. The old local-library fallback stays separate.
class FlareSharedLibraryPage extends StatefulWidget {
  const FlareSharedLibraryPage({
    super.key,
    this.onBack,
    this.initialMuscle,
    this.presentationCatalog,
    this.onOpenStraightLegFlare,
    this.soundEnabled = true,
  });
  final VoidCallback? onBack;
  final String? initialMuscle;
  final flare.Catalog? presentationCatalog;
  final ValueChanged<flare.Drill>? onOpenStraightLegFlare;
  final bool soundEnabled;
  @override
  State<FlareSharedLibraryPage> createState() => _FlareSharedLibraryPageState();
}

class _FlareSharedLibraryPageState extends State<FlareSharedLibraryPage> {
  late trainer.TrainingLibraryFilter _filter = trainer.TrainingLibraryFilter(
    muscle: widget.initialMuscle,
  );
  final _search = TextEditingController();
  final _cardHeights = <Object, double>{};
  Object? _textMetricsKey;

  @override
  void didUpdateWidget(FlareSharedLibraryPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialMuscle != widget.initialMuscle) {
      _search.clear();
      _filter = trainer.TrainingLibraryFilter(muscle: widget.initialMuscle);
    }
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  String _label(String value) {
    final group = widget.presentationCatalog?.groupById(value);
    if (group != null) return group.shortLabel;
    final source = trainer.poseHubMuscleLabels[value] ?? value;
    return widget.presentationCatalog?.translate(source) ?? source;
  }

  bool _showsStraightLegFlare(
    trainer.TrainingLibraryFilter filter,
    String title,
  ) {
    if (widget.onOpenStraightLegFlare == null) return false;
    const all = trainer.TrainingLibraryFilter.all;
    final terms = filter.query.toLowerCase().trim().split(RegExp(r'\s+'));
    final names = '$title $flareV5Name $flareV5NameEn Thomas'.toLowerCase();
    return terms.every(names.contains) &&
        (filter.equipment == all || filter.equipment == '徒手') &&
        (filter.bodyPart == all || filter.bodyPart == '全身') &&
        (filter.type == all || filter.type == '其他') &&
        (filter.level == null || filter.level == flareV5Drill.difficulty) &&
        filter.side != trainer.TrainingLibrarySide.unilateral &&
        (filter.muscle == null || filter.muscle == flareV5Drill.groupId);
  }

  @override
  Widget build(BuildContext context) {
    final shared = FlareShared.current!;
    final policy = FlarePublicMedia.of(context)!;
    final config = shared.libraryFor(context);
    final s = context.strings;
    final language = Localizations.localeOf(context).toLanguageTag();
    final all = config.actions(policy.catalog).toList(growable: false);
    bool showsStraightLegFlare(trainer.TrainingLibraryFilter filter) =>
        _showsStraightLegFlare(filter, s.flareStraightLegs);
    final shown = <(String, coach.PoseHubPackAction?)>[
      if (showsStraightLegFlare(_filter)) (flareV5DrillId, null),
      for (final action in all)
        if (trainer.PoseHubActionFacets.matchesFilter(
          action,
          _filter,
          extraNames: config.searchNames?.call(action.id) ?? const [],
        ))
          (action.id, action),
    ];
    final strings = trainerStrings(s);
    final textMetricsKey = (
      Localizations.localeOf(context),
      MediaQuery.textScalerOf(context),
      MediaQuery.boldTextOf(context),
      MediaQuery.maybeLineHeightScaleFactorOverrideOf(context),
      MediaQuery.maybeLetterSpacingOverrideOf(context),
      MediaQuery.maybeWordSpacingOverrideOf(context),
      Directionality.of(context),
      DefaultTextStyle.of(context).style,
      DefaultTextStyle.of(context).textAlign,
      DefaultTextStyle.of(context).softWrap,
      DefaultTextStyle.of(context).overflow,
      DefaultTextStyle.of(context).maxLines,
      DefaultTextStyle.of(context).textWidthBasis,
      DefaultTextStyle.of(context).textHeightBehavior,
      DefaultTextHeightBehavior.maybeOf(context),
    );
    if (_textMetricsKey != textMetricsKey) {
      _cardHeights.clear();
      _textMetricsKey = textMetricsKey;
    }
    String titleFor(String id) => id == flareV5DrillId
        ? s.flareStraightLegs
        : shared.catalog[id]!.name.of(language);
    Widget posterFor(String id) => LayoutBuilder(
      builder: (context, box) {
        final asset = policy.posterAssetFor(id);
        final fallback = asset == null
            ? const SizedBox.expand()
            : trainer.TrainerPoster(
                key: ValueKey('library-poster-$id'),
                asset: asset,
                bundle: trainer.TrainerExperienceScope.maybeOf(context)?.bundle,
                decodeWidth:
                    (box.maxWidth * MediaQuery.devicePixelRatioOf(context))
                        .ceil(),
                stageColor: FlareColors.mediaBackdrop,
              );
        return id == flareV5DrillId
            ? fallback
            : FlareActionArtwork(actionId: id, fallback: fallback);
      },
    );
    String doseFor(String id) {
      if (id == flareV5DrillId) {
        return s.libraryDose(flareV5Drill.dose.sets, s.countLabel(1));
      }
      final definition = shared.catalog[id]!;
      final dose = definition.defaultDose;
      final reps = dose.mode == coach.DoseMode.reps;
      return s.libraryDose(
        dose.sets,
        strings.dose(
          reps: reps,
          amount: (reps ? dose.reps : dose.seconds) ?? 0,
          perSide: definition.unilateral,
        ),
      );
    }

    return FlareNavPage(
      title: config.strings.title,
      blurBackdrop: false,
      onBack: widget.onBack ?? () => Navigator.maybePop(context),
      body: CustomScrollView(
        key: const PageStorageKey('public-library-scroll'),
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        slivers: [
          SliverPadding(
            padding: EdgeInsets.fromLTRB(
              FlareGeometry.pageInset,
              flareNavInset(context) + FlareGeometry.libraryTop,
              FlareGeometry.pageInset,
              FlareGeometry.libraryCardInset,
            ),
            sliver: SliverList.list(
              children: [
                PublicLibraryFilter(
                  actions: all,
                  filter: _filter,
                  controller: _search,
                  strings: config.strings,
                  label: _label,
                  includesHostDrill: showsStraightLegFlare,
                  onChanged: (value) => setState(() => _filter = value),
                ),
                const SizedBox(height: FlareGeometry.libraryFieldGap),
                Text(
                  s.planDrillCount(shown.length),
                  key: const ValueKey('actions-count'),
                  style: FlareType.rowSubtitle.copyWith(
                    color: FlareColors.muted,
                  ),
                ),
                if (shown.isEmpty) ...[
                  EmptyNote(
                    icon: Icons.search_off_rounded,
                    text: config.strings.emptyTitle,
                  ),
                  TextButton(
                    onPressed: () => setState(() {
                      _search.clear();
                      _filter = const trainer.TrainingLibraryFilter();
                    }),
                    child: Text(config.strings.clearFilters),
                  ),
                ],
              ],
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(
              FlareGeometry.pageInset,
              0,
              FlareGeometry.pageInset,
              FlareGeometry.libraryBottom,
            ),
            sliver: SliverCardRows(
              itemCount: shown.length,
              itemHeightBuilder: (context, width, index) {
                final id = shown[index].$1;
                final title = titleFor(id);
                final subtitle = doseFor(id);
                return _cardHeights.putIfAbsent(
                  (id, width, title, subtitle),
                  () => DrillCard.measureLibraryHeight(
                    context,
                    width: width,
                    title: title,
                    subtitle: subtitle,
                  ),
                );
              },
              itemBuilder: (context, index) {
                final (id, action) = shown[index];
                if (action == null) {
                  final drill =
                      widget.presentationCatalog?.straightLegFlare ??
                      flareV5Drill;
                  return DrillCard(
                    key: const ValueKey('public-action-$flareV5DrillId'),
                    drill: drill,
                    libraryPresentation: true,
                    title: titleFor(id),
                    subtitle: doseFor(id),
                    groupLabel: _label('全身'),
                    color: FlareColors.accent,
                    artwork: posterFor(id),
                    onTap: () => widget.onOpenStraightLegFlare!(drill),
                  );
                }
                final drill = sharedDisplayDrill(shared.catalog, action.id)!;
                final muscles =
                    (action.raw['muscleGroups'] as List?)
                        ?.whereType<String>()
                        .toList() ??
                    const <String>[];
                final badge =
                    _filter.muscle != null && muscles.contains(_filter.muscle)
                    ? _filter.muscle!
                    : muscles.firstOrNull;
                final group = badge == null
                    ? null
                    : widget.presentationCatalog?.groupById(badge);
                final dose = doseFor(action.id);
                return DrillCard(
                  key: ValueKey('public-action-${action.id}'),
                  drill: drill,
                  libraryPresentation: true,
                  title: titleFor(id),
                  subtitle: dose,
                  groupLabel: badge == null
                      ? _label(
                          trainer.PoseHubActionFacets.bodyParts(
                                action,
                              ).firstOrNull ??
                              '',
                        )
                      : _filter.muscle != null
                      ? _label(badge)
                      : _label(
                          trainer.PoseHubActionFacets.bodyParts(
                                action,
                              ).firstOrNull ??
                              badge,
                        ),
                  color: group == null
                      ? FlareColors.accent
                      : Color(group.colorValue),
                  artwork: posterFor(id),
                  onTap: () => FlareShared.openDetail(
                    context,
                    action.id,
                    soundEnabled: widget.soundEnabled,
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
