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
    find.descendant(of: find.byType(DrillPoster), matching: find.byType(Image)),
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
  final catalog = loadCatalogFixture(includeFlarePlans: true);

  test('every catalog drill resolves to a bundled poster', () async {
    TestWidgetsFlutterBinding.ensureInitialized();
    for (final d in catalog.drills) {
      final a = drillPosterAsset(d);
      expect(a, 'assets/public_posters/${d.id}.webp');
      expect((await rootBundle.load(a)).lengthInBytes, greaterThan(0));
    }
  });

  testWidgets('plans show bundled angle art and custom drill posters', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final s = LearningStore(catalog: catalog, storage: _Memory());
    await s.initialize();
    await s.acknowledgeSafety();
    await s.createRoutine('我的训练', const ['abs-A']);
    addTearDown(s.dispose);
    await tester.pumpWidget(
      _app(
        PlansPage(
          catalog: catalog,
          store: s,
          onOpenAngle: (_) {},
          onOpenMuscle: (_) {},
          onAllAngles: () {},
          onAllMuscles: () {},
          onContinue: () {},
          onRoutine: (_) {},
          onNewRoutine: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    await _expectBundled(tester, _posterAssets(tester));
    final angle = find.byKey(const ValueKey('plan-angle-11'));
    final image = tester.widget<Image>(
      find.descendant(of: angle, matching: find.byType(Image)).first,
    );
    final provider = image.image;
    final asset =
        (provider is ResizeImage ? provider.imageProvider : provider)
            as AssetImage;
    expect(asset.assetName, 'assets/angles/phase-11.webp');
    final data = await tester.runAsync(() => rootBundle.load(asset.assetName));
    expect(data!.lengthInBytes, greaterThan(0));
  });

  testWidgets('plan detail rows show drill posters', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final drills = [
      catalog.drillById('forearms-A')!,
      catalog.drillById('abs-A')!,
    ];
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
