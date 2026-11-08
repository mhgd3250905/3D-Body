// Flare scope, theme and library presentation; SDK owns catalogue semantics,
// media, details and training entry. Browsing only requests bundled posters.
import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../ui/theme.dart';
import '../ui/components.dart';
import '../ui/page_kit.dart';
import '../ui/public_library_filter.dart';
import '../trainer/trainer_strings.dart';
import 'catalog.dart' as flare;
import 'flare_drill_resolver.dart';
import 'flare_action_scope.dart';
import 'flare_public_catalog.dart';
import 'flare_public_media.dart';

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
    String languageTag,
  ) => trainer.TrainingLibraryConfig(
    scopeManifest: scope,
    brand: 'Flare',
    // SF-style defaults: strength first; no start button in details.
    categoryOrder: const ['力量', '拉伸放松'],
    strings: trainer.TrainingLibraryStrings.forLanguage(languageTag),
  );

  /// Set at startup (main.dart); tests may install their own.
  static FlareShared? current;

  final coach.PoseHubAppTestCatalog pack;

  /// Coach catalog projected from the public definitions (execution cycle).
  final coach.Catalog catalog;
  final Map<String, trainer.Rhythm> rhythms;
  final coach.CoachActionScopeManifest scope;
  final trainer.TrainingLibraryConfig library;

  /// [library] with SDK library strings for the current app locale.
  trainer.TrainingLibraryConfig libraryFor(BuildContext context) =>
      _libraryConfig(scope, Localizations.localeOf(context).toLanguageTag());

  Set<String> get allowedActionIds => scope.allowedActionIds;

  static Future<FlareShared> load({AssetBundle? bundle}) async {
    final pack = await loadFlarePublicCatalog(bundle: bundle);
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

  /// SDK action details; no App detail page, cache or overlay.
  static Future<void> openDetail(BuildContext context, String id) async {
    final shared = current;
    final policy = FlarePublicMedia.current;
    if (shared == null || policy == null) return;
    await trainer.TrainingLibraryDetails.open(
      context,
      actionId: id,
      config: shared.libraryFor(context),
      mediaPolicy: policy,
      theme: theme(context),
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
  });
  final VoidCallback? onBack;
  final String? initialMuscle;
  final flare.Catalog? presentationCatalog;
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

  @override
  Widget build(BuildContext context) {
    final shared = FlareShared.current!;
    final policy = FlarePublicMedia.current!;
    final config = shared.libraryFor(context);
    final s = context.strings;
    final language = Localizations.localeOf(context).toLanguageTag();
    final all = config.actions(policy.catalog).toList(growable: false);
    final shown = all
        .where(
          (action) => trainer.PoseHubActionFacets.matchesFilter(
            action,
            _filter,
            extraNames: config.searchNames?.call(action.id) ?? const [],
          ),
        )
        .toList(growable: false);
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
    String doseFor(String id) {
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
                final id = shown[index].id;
                final title = shared.catalog[id]!.name.of(language);
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
                final action = shown[index];
                final definition = shared.catalog[action.id]!;
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
                  title: definition.name.of(language),
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
                  artwork: LayoutBuilder(
                    builder: (context, box) => trainer.TrainerPoster(
                      key: ValueKey('library-poster-${action.id}'),
                      asset: policy.posterAssetFor(action.id)!,
                      bundle: trainer.TrainerExperienceScope.maybeOf(
                        context,
                      )?.bundle,
                      decodeWidth:
                          (box.maxWidth *
                                  MediaQuery.devicePixelRatioOf(context))
                              .ceil(),
                      stageColor: FlareColors.mediaBackdrop,
                    ),
                  ),
                  onTap: () => FlareShared.openDetail(context, action.id),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
