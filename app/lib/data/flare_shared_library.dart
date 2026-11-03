// Flare scope, theme and business callbacks; the SDK owns browsing, details,
// media and training entry. Nothing here caches, prefetches or masks media.
import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../ui/theme.dart';
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

/// The SDK action library embedded in Flare's shell tab.
class FlareSharedLibraryPage extends StatelessWidget {
  const FlareSharedLibraryPage({super.key});
  @override
  Widget build(BuildContext context) => trainer.TrainingLibraryPage(
    config: FlareShared.current!.libraryFor(context),
    mediaPolicy: FlarePublicMedia.current!,
    theme: FlareShared.theme(context),
    embedded: true,
  );
}
