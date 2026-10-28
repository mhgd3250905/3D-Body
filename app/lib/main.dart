import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'control/learning_store.dart';
import 'data/catalog.dart';
import 'data/content_translations.dart';
import 'l10n/app_localizations.dart';
import 'l10n/languages.dart';
import 'platform/scene/scene_controller.dart';
import 'ui/app_shell.dart';
import 'ui/components.dart';
import 'ui/motion.dart';
import 'ui/startup_splash.dart';
import 'ui/theme.dart';
import 'ui/theme_fade.dart';

SemanticsHandle? _webSemantics;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
  runApp(const FlareBootstrap());
}

class FlareBootstrap extends StatefulWidget {
  const FlareBootstrap({super.key});
  @override
  State<FlareBootstrap> createState() => _FlareBootstrapState();
}

class _FlareBootstrapState extends State<FlareBootstrap> {
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

  Future<(Catalog, LearningStore)> _load() async {
    final values = await Future.wait<Object>([
      Catalog.load(),
      ContentTranslations.load(),
    ]);
    final catalog = values[0] as Catalog;
    _content = values[1] as ContentTranslations;
    _localizedCatalogs.clear();
    final store = LearningStore(catalog: catalog);
    await store.initialize();
    _store?.removeListener(_storeChanged);
    _store = store..addListener(_storeChanged);
    if (mounted) _storeChanged();
    return (catalog, store);
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
    _scene.addListener(_sceneChanged);
    _loading = _load();
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
          child: ThemeCrossFade(brightness: brightness, child: child!),
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
                () => data.$1.localized({
                  ..._content!.forLanguage(language),
                  '自行回顾 09–11：后撑、移重与侧撑是否连贯': s.reviewFirstPhases,
                  '自行回顾整圈：换手、开腿与节奏是否连贯': s.reviewFullLoop,
                  '腕屈': s.wristFlexion,
                  '腕伸': s.wristExtension,
                }, shortLabels: _content!.shortLabelsFor(language)),
              );
        // Keep one splash State while data loads and the actual, full-sized
        // WebView draws beneath it. Revealing it never recreates the scene.
        return Stack(
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
                        sceneController: _scene,
                        sceneRevision: _sceneRevision,
                        startupCovered: !_launchComplete,
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
      },
    ),
  );

  @override
  void dispose() {
    _store?.removeListener(_storeChanged);
    _scene.removeListener(_sceneChanged);
    _scene.dispose();
    _webSemantics?.dispose();
    super.dispose();
  }
}
