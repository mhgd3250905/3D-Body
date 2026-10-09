import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'control/learning_store.dart';
import 'data/catalog.dart';
import 'l10n/app_localizations.dart';
import 'ui/app_shell.dart';
import 'ui/components.dart';
import 'ui/loader_mark.dart';
import 'ui/motion.dart';
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

  @override
  void initState() {
    super.initState();
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
    locale: const Locale('zh'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: FutureBuilder<(Catalog, LearningStore)>(
      future: _loading,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          final (catalog, store) = snapshot.data!;
          return FlareShell(catalog: catalog, store: store);
        }
        return Scaffold(
          body: Center(
            child: snapshot.hasError
                ? Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(context.strings.storageReadFailed),
                      const SizedBox(height: 16),
                      FilledButton(
                        onPressed: () => setState(() => _loading = _load()),
                        child: Text(context.strings.retry),
                      ),
                    ],
                  )
                : const FlareLoaderMark(),
          ),
        );
      },
    ),
  );

  @override
  void dispose() {
    _store?.removeListener(_storeChanged);
    _webSemantics?.dispose();
    super.dispose();
  }
}
