import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'control/learning_store.dart';
import 'data/catalog.dart';
import 'l10n/app_localizations.dart';
import 'platform/scene/scene_controller.dart';
import 'ui/app_shell.dart';
import 'ui/components.dart';
import 'ui/startup_splash.dart';
import 'ui/theme.dart';
import 'ui/theme_fade.dart';

SemanticsHandle? _webSemantics;

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  LicenseRegistry.addLicense(() async* {
    for (final entry in [
      ('Snow Rig', 'Snow-ATTRIBUTION.md'),
      ('Human Base Meshes', 'Anatomy-ATTRIBUTION.md'),
      ('Three.js', 'three-MIT.txt'),
      ('meshoptimizer', 'meshoptimizer-MIT.txt'),
      ('fflate', 'fflate-MIT.txt'),
      ('Noto Sans SC', 'NotoSansSC-OFL.txt'),
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
  final _scene = SceneController();
  bool _launchComplete = false;
  int _sceneRevision = 0;
  bool _scenePresented = false;
  String? _sceneError;

  Future<(Catalog, LearningStore)> _load() async {
    final catalog = await Catalog.load();
    final store = LearningStore(catalog: catalog);
    await store.initialize();
    _store?.removeListener(_storeChanged);
    _store = store..addListener(_storeChanged);
    if (mounted) _storeChanged();
    return (catalog, store);
  }

  void _storeChanged() {
    final mode = _store?.settings.themeMode ?? 'system';
    if (mode != _themeMode && mounted) setState(() => _themeMode = mode);
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
        child: ThemeCrossFade(brightness: brightness, child: child!),
      );
    },
    locale: const Locale('zh'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: FutureBuilder<(Catalog, LearningStore)>(
      future: _loading,
      builder: (context, snapshot) {
        final data = snapshot.data;
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
                        catalog: data.$1,
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
