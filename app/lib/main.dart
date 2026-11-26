import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_coach_ui/ugk_coach_ui.dart'
    show PoseHubDisplayUpdateDialogHost;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;
import 'control/learning_store.dart';
import 'control/flare_membership.dart';
import 'data/catalog.dart';
import 'data/content_translations.dart';
import 'data/flare_public_catalog.dart';
import 'data/flare_public_media.dart';
import 'data/flare_shared_library.dart';
import 'data/flare_v5_drill.dart';
import 'data/posehub_catalog_updates.dart';
import 'l10n/app_localizations.dart';
import 'l10n/languages.dart';
import 'platform/scene/scene_controller.dart';
import 'platform/flare_revenuecat.dart';
import 'ui/app_shell.dart';
import 'ui/app_glass.dart';
import 'ui/components.dart';
import 'ui/motion.dart';
import 'ui/startup_splash.dart';
import 'ui/theme.dart';
import 'ui/theme_fade.dart';

SemanticsHandle? _webSemantics;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeFlareGlass();
  final catalogUpdates = await PoseHubCatalogUpdates.start();
  LicenseRegistry.addLicense(() async* {
    for (final entry in [
      ('Snow Rig', 'Snow-ATTRIBUTION.md'),
      ('训练动作示范', 'Drill-media-ATTRIBUTION.md'),
      ('Human Base Meshes', 'Anatomy-ATTRIBUTION.md'),
      ('Three.js', 'three-MIT.txt'),
      ('meshoptimizer', 'meshoptimizer-MIT.txt'),
      ('fflate', 'fflate-MIT.txt'),
      ('Noto Sans SC', 'NotoSansSC-OFL.txt'),
      ('Noto Sans Korean', 'NotoSansKR-OFL.txt'),
      ('Noto Sans Arabic', 'NotoSansArabic-OFL.txt'),
      ('Noto Sans Devanagari', 'NotoSansDevanagari-OFL.txt'),
    ]) {
      yield LicenseEntryWithLineBreaks([
        entry.$1,
      ], await rootBundle.loadString('assets/licenses/${entry.$2}'));
    }
  });
  if (kIsWeb) _webSemantics = SemanticsBinding.instance.ensureSemantics();
  runApp(FlareBootstrap(catalogUpdates: catalogUpdates));
}

Widget _mediaScope(Widget child) => switch (FlarePublicMedia.current) {
  final policy? => sdk.TrainingMediaPolicyScope(policy: policy, child: child),
  null => child,
};

class FlareBootstrap extends StatefulWidget {
  const FlareBootstrap({super.key, this.catalogUpdates});

  final PoseHubCatalogUpdates? catalogUpdates;

  @override
  State<FlareBootstrap> createState() => _FlareBootstrapState();
}

class _FlareBootstrapState extends State<FlareBootstrap> {
  late final FlareMembership? _membership = switch ((
    kIsWeb,
    defaultTargetPlatform,
  )) {
    (false, TargetPlatform.android) => FlareMembership(
      FlareRevenueCat(
        const String.fromEnvironment('FLARE_REVENUECAT_ANDROID_KEY'),
      ),
      offerStorage: SharedPreferencesLocalStateStorage(),
    ),
    (false, TargetPlatform.iOS) => FlareMembership(
      FlareRevenueCat(const String.fromEnvironment('FLARE_REVENUECAT_IOS_KEY')),
      offerStorage: SharedPreferencesLocalStateStorage(),
    ),
    _ => null,
  };
  late Future<(Catalog, LearningStore)> _loading;
  LearningStore? _store;
  String _themeMode = 'system';
  String _language = 'system';
  ContentTranslations? _content;
  final _localizedCatalogs = <String, Catalog>{};
  final _scene = SceneController();
  bool _launchComplete = false;
  int _sceneRevision = 0;
  bool _scenePresented = false;
  String? _sceneError;
  StreamSubscription<coach.PoseHubAppTestCatalog>? _catalogChanges;
  StreamSubscription<sdk.PoseHubPlanSnapshot>? _planChanges;
  int _catalogGeneration = 0;
  FlareShared? _publishedShared;
  Catalog? _publishedCatalog;
  // A player already on the Navigator keeps its original catalog and policy.
  final _ownedMedia = <sdk.TrainingMediaPolicy>[];

  Future<(Catalog, LearningStore)> _load() async {
    final pack = loadFlarePublicCatalog(
      verifiedCache: widget.catalogUpdates?.updater.store,
    );
    final values = await Future.wait<Object>([
      Catalog.load(),
      ContentTranslations.load(),
      pack,
    ]);
    final activeCatalog = values[2] as coach.PoseHubAppTestCatalog;
    final original = values[0] as Catalog;
    final catalog = original.withPlanSnapshot(
      await _activePlansFor(activeCatalog),
    );
    final shared = await FlareShared.load(activeCatalog: activeCatalog);
    sdk.TrainingMediaPolicy? policy;
    try {
      policy = await _publicMediaFor(activeCatalog);
    } on Object catch (error) {
      debugPrint('PoseHub training media unavailable: $error');
    }
    if (mounted) {
      setState(() => _publishCatalog(shared, policy, catalog));
    } else {
      policy?.repository.dispose();
    }
    _content = values[1] as ContentTranslations;
    _localizedCatalogs.clear();
    final store = LearningStore(catalog: catalog);
    await store.initialize();
    _store?.removeListener(_storeChanged);
    _store = store..addListener(_storeChanged);
    if (mounted) _storeChanged();
    return (catalog, store);
  }

  void _publishCatalog(
    FlareShared shared,
    sdk.TrainingMediaPolicy? policy,
    Catalog catalog,
  ) {
    FlareShared.current = _publishedShared = shared;
    FlarePublicMedia.current = policy;
    _publishedCatalog = catalog;
    if (policy != null) _ownedMedia.add(policy);
    if (!flareChannelTrace) return;
    final pack = sdk.poseHubPackVersionOf(shared.pack);
    debugPrint(
      'FlareChannel catalog=$pack snapshot=${catalog.planSnapshot?.id ?? 'legacy'}',
    );
    final mediaBase = sdk.PoseHubActionLibrary.mediaBaseUriFor(shared.pack);
    for (final id in flareSupplementalActionIds) {
      final media = shared.pack.tryGet(id);
      final definition = shared.catalog[id];
      if (media == null || definition == null) continue;
      debugPrint(
        'FlareChannel action ${jsonEncode({'id': id, 'url': media.video.resolve(mediaBase).toString(), 'sha256': media.video.sha256, 'purpose': definition.purpose, 'cues': definition.cues['zh']})}',
      );
    }
  }

  Future<sdk.PoseHubPlanSnapshot?> _activePlansFor(
    coach.PoseHubAppTestCatalog pack,
  ) {
    final updates = widget.catalogUpdates;
    final version = sdk.poseHubPackVersionOf(pack);
    return updates == null
        ? loadCompatibleFlareBundledPlanSnapshot(version)
        : updates.planSnapshotFor(version);
  }

  Future<sdk.PoseHubPlanSnapshot?> _restorePlanSnapshot(String id) async {
    final stored = await widget.catalogUpdates?.restorePlanSnapshot(id);
    if (stored != null) return stored;
    final bundled = await loadFlareBundledPlanSnapshot();
    return bundled?.id == id ? bundled : null;
  }

  Future<sdk.TrainingMediaPolicy> _publicMediaFor(
    coach.PoseHubAppTestCatalog pack,
  ) => FlarePublicMedia.load(
    activeCatalog: pack,
    rootDirectory: widget.catalogUpdates?.assetRootDirectory,
  );

  Future<void> _applyContentUpdate() async {
    final generation = ++_catalogGeneration;
    sdk.TrainingMediaPolicy? pending;
    try {
      final (initialCatalog, _) = await _loading;
      if (!mounted || generation != _catalogGeneration) return;
      final pack = await loadFlarePublicCatalog(
        verifiedCache: widget.catalogUpdates?.updater.store,
      );
      final snapshot = await _activePlansFor(pack);
      if (!mounted || generation != _catalogGeneration) return;
      final catalog = initialCatalog.withPlanSnapshot(snapshot);
      final currentPack = _publishedShared?.pack;
      if (currentPack != null &&
          sdk.poseHubPackVersionOf(currentPack) ==
              sdk.poseHubPackVersionOf(pack)) {
        if (_publishedCatalog?.planSnapshot?.id != snapshot?.id) {
          setState(() {
            _localizedCatalogs.clear();
            _publishedCatalog = catalog;
          });
        }
        return;
      }
      final shared = await FlareShared.load(activeCatalog: pack);
      final policy = pending = await _publicMediaFor(pack);
      if (!mounted || generation != _catalogGeneration) return;
      setState(() {
        _localizedCatalogs.clear();
        _publishCatalog(shared, policy, catalog);
      });
      pending = null;
    } on Object catch (error) {
      debugPrint('PoseHub catalog could not be applied to Flare: $error');
    } finally {
      pending?.repository.dispose();
    }
  }

  void _storeChanged() {
    final mode = _store?.settings.themeMode ?? 'system';
    final language = _store?.settings.language ?? 'system';
    if ((mode != _themeMode || language != _language) && mounted) {
      setState(() {
        _themeMode = mode;
        _language = language;
      });
    }
  }

  void _sceneChanged() {
    if (!mounted || _launchComplete) return;
    if (_scenePresented == _scene.presented &&
        _sceneError == _scene.errorCode) {
      return;
    }
    _scenePresented = _scene.presented;
    _sceneError = _scene.errorCode;
    // Attaching a replacement platform view notifies synchronously during
    // build. Only startup readiness/error changes need to rebuild this host.
    if (SchedulerBinding.instance.schedulerPhase ==
        SchedulerPhase.persistentCallbacks) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && !_launchComplete) setState(() {});
      });
    } else {
      setState(() {});
    }
  }

  @override
  void initState() {
    super.initState();
    unawaited(_membership?.refresh());
    _scene.addListener(_sceneChanged);
    final updates = widget.catalogUpdates;
    _catalogChanges = updates?.updater.catalogChanges.listen(
      (_) => unawaited(_applyContentUpdate()),
    );
    _planChanges = updates?.updater.planChanges.listen((snapshot) {
      if (snapshot.app == 'flare') unawaited(_applyContentUpdate());
    });
    _loading = _load();
    if (updates != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) unawaited(updates.onAppReady());
      });
    }
  }

  @override
  Widget build(BuildContext context) => MaterialApp(
    onGenerateTitle: (context) => context.strings.appName,
    debugShowCheckedModeBanner: false,
    theme: flareTheme(Brightness.light),
    darkTheme: flareTheme(Brightness.dark),
    themeMode: themeModeOf(_themeMode),
    // Custom tokens switch with the theme in one frame (a colour lerp would
    // mix the two palettes); ThemeCrossFade dissolves the old frame away
    // over the new one instead.
    themeAnimationDuration: Duration.zero,
    // One scroll feel on every platform: iOS rubber-band edges.
    scrollBehavior: const FlareScrollBehavior(),
    builder: (context, child) {
      final brightness = Theme.of(context).brightness;
      FlareColors.use(brightness);
      // No AppBar sets the status bar, so the app does: light icons on the
      // graphite stage, dark ones on paper, edge-to-edge on Android.
      final dark = brightness == Brightness.dark;
      return AnnotatedRegion<SystemUiOverlayStyle>(
        value: (dark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark)
            .copyWith(
              statusBarColor: const Color(0x00000000),
              systemNavigationBarColor: FlareColors.background,
              systemNavigationBarIconBrightness: dark
                  ? Brightness.light
                  : Brightness.dark,
            ),
        child: FlareMotionPreferences(
          child: _mediaScope(
            ThemeCrossFade(brightness: brightness, child: child!),
          ),
        ),
      );
    },
    locale: _language == 'system' ? null : localeForLanguage(_language),
    localeListResolutionCallback: resolveAppLocale,
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: FutureBuilder<(Catalog, LearningStore)>(
      future: _loading,
      builder: (context, snapshot) {
        final data = snapshot.data;
        final s = context.strings;
        final language = languageForLocale(Localizations.localeOf(context));
        final localized = data == null
            ? null
            : _localizedCatalogs.putIfAbsent(
                language,
                () => (_publishedCatalog ?? data.$1).localized({
                  ..._content!.forLanguage(language),
                  '自行回顾 09–11：后撑、移重与侧撑是否连贯': s.reviewFirstPhases,
                  '自行回顾整圈：换手、开腿与节奏是否连贯': s.reviewFullLoop,
                  '腕屈': s.wristFlexion,
                  '腕伸': s.wristExtension,
                  flareV5Name: s.flareStraightLegs,
                  flareV5Prescription: s.libraryDose(1, s.countLabel(1)),
                }, shortLabels: _content!.shortLabelsFor(language)),
              );
        // Keep one splash State while data loads and the actual, full-sized
        // WebView draws beneath it. Revealing it never recreates the scene.
        final home = Stack(
          fit: StackFit.expand,
          children: [
            ExcludeSemantics(
              excluding: !_launchComplete,
              child: IgnorePointer(
                ignoring: !_launchComplete,
                child: data == null
                    ? const SizedBox.expand()
                    : FlareShell(
                        catalog: localized!,
                        store: data.$2,
                        membership: _membership,
                        sceneController: _scene,
                        sceneRevision: _sceneRevision,
                        startupCovered: !_launchComplete,
                        restorePlanSnapshot: _restorePlanSnapshot,
                      ),
              ),
            ),
            FlareStartupSplash(
              ready: snapshot.hasData && _scenePresented,
              error: snapshot.hasError
                  ? context.strings.storageReadFailed
                  : _sceneError != null
                  ? context.strings.sceneFailed
                  : null,
              onRetry: () {
                setState(() {
                  if (snapshot.hasError) {
                    _loading = _load();
                  } else {
                    _sceneRevision++;
                  }
                });
              },
              onRevealed: () {
                if (mounted && !_launchComplete) {
                  setState(() => _launchComplete = true);
                }
              },
            ),
          ],
        );
        final updates = widget.catalogUpdates;
        if (updates == null) return home;
        return PoseHubDisplayUpdateDialogHost(
          progress: updates.updater.displayProgress,
          onRetry: () async {
            await updates.checkNow();
          },
          child: home,
        );
      },
    ),
  );

  @override
  void dispose() {
    unawaited(_catalogChanges?.cancel());
    unawaited(_planChanges?.cancel());
    widget.catalogUpdates?.dispose();
    if (_ownedMedia.contains(FlarePublicMedia.current)) {
      FlarePublicMedia.current = null;
    }
    if (identical(FlareShared.current, _publishedShared)) {
      FlareShared.current = null;
    }
    for (final policy in _ownedMedia) {
      policy.repository.dispose();
    }
    _membership?.dispose();
    _store?.removeListener(_storeChanged);
    _scene.removeListener(_sceneChanged);
    _scene.dispose();
    _webSemantics?.dispose();
    super.dispose();
  }
}
