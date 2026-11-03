// Plan cards and plan rows must show the real drill poster, never the
// placeholder icon. Regression: master eb3b6e8 removed
// assets/drill_media/<id>.jpg but DrillPoster still pointed there.
import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _Memory implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

Widget _app(Widget home) => MaterialApp(
  theme: flareTheme(Brightness.light),
  locale: const Locale('zh'),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  home: Scaffold(body: SafeArea(child: home)),
);

/// Asset names of every Image under a DrillPoster.
List<String> _posterAssets(WidgetTester tester) => [
  for (final image in tester.widgetList<Image>(
    find.descendant(
      of: find.byType(DrillPoster),
      matching: find.byType(Image),
    ),
  ))
    (image.image as AssetImage).assetName,
];

Future<void> _expectBundled(WidgetTester tester, List<String> assets) async {
  expect(assets, isNotEmpty);
  for (final a in assets) {
    expect(a, startsWith('assets/public_posters/'));
    final data = await tester.runAsync(() => rootBundle.load(a));
    expect(data!.lengthInBytes, greaterThan(0), reason: a);
  }
}

void main() {
  final catalog = loadCatalogFixture();

  test('every catalog drill resolves to a bundled poster', () async {
    TestWidgetsFlutterBinding.ensureInitialized();
    for (final d in catalog.drills) {
      final a = drillPosterAsset(d);
      expect(a, 'assets/public_posters/${d.id}.webp');
      expect((await rootBundle.load(a)).lengthInBytes, greaterThan(0));
    }
  });

  testWidgets('plan cards show drill posters', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final s = LearningStore(catalog: catalog, storage: _Memory());
    await s.initialize();
    await s.acknowledgeSafety();
    addTearDown(s.dispose);
    await tester.pumpWidget(
      _app(
        PlansPage(
          catalog: catalog,
          store: s,
          onPreset: (_) {},
          onRoutine: (_) {},
          onNewRoutine: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    await _expectBundled(tester, _posterAssets(tester));
  });

  testWidgets('plan detail rows show drill posters', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final warmup = PresetPlan.all.firstWhere((p) => p.id == 'warmup');
    final drills = warmup.drills(catalog, 'C');
    await tester.pumpWidget(
      _app(
        PlanDetailPage(
          title: '托马斯练前热身',
          drills: drills,
          onBack: () {},
          onStart: () {},
          onDrill: (_) {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    final assets = _posterAssets(tester);
    expect(assets.length, drills.length);
    await _expectBundled(tester, assets);
  });
}
