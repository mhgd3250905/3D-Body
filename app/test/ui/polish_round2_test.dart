import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _Memory implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

Widget _app(Widget home, {double scale = 1, Brightness? brightness}) =>
    MaterialApp(
      theme: flareTheme(brightness ?? Brightness.dark),
      locale: const Locale('zh'),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      builder: (context, child) {
        FlareColors.use(Theme.of(context).brightness);
        return MediaQuery(
          data: MediaQuery.of(
            context,
          ).copyWith(textScaler: TextScaler.linear(scale)),
          child: child!,
        );
      },
      home: Scaffold(body: home),
    );

void _size(WidgetTester tester, Size size, {double top = 0}) {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1;
  tester.view.padding = FakeViewPadding(top: top, bottom: top > 0 ? 34 : 0);
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPadding);
}

void main() {
  final catalog = loadCatalogFixture();
  tearDown(() => FlareColors.use(Brightness.dark));

  testWidgets('segmented control: tap, drag across, semantics', (tester) async {
    var value = 'b';
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) => Center(
            child: FlareSegmented<String>(
              segments: const [('a', '甲'), ('b', '乙'), ('c', '丙')],
              semanticLabels: const ['第一项', '第二项', '第三项'],
              selected: value,
              onChanged: (v) => setState(() => value = v),
            ),
          ),
        ),
      ),
    );
    final handle = tester.ensureSemantics();
    expect(
      tester.getSemantics(find.bySemanticsLabel('第二项')),
      isSemantics(
        label: '第二项',
        isButton: true,
        isSelected: true,
        isInMutuallyExclusiveGroup: true,
        hasTapAction: true,
        hasSelectedState: true,
        hasEnabledState: false,
      ),
    );
    await tester.tap(find.text('丙'));
    await tester.pumpAndSettle();
    expect(value, 'c');
    // Drag the thumb from the last segment back to the first.
    final box = tester.getRect(find.byType(FlareSegmented<String>));
    final gesture = await tester.startGesture(
      box.centerRight - const Offset(8, 0),
    );
    await gesture.moveBy(const Offset(-20, 0));
    await tester.pump();
    await gesture.moveTo(box.centerLeft + const Offset(8, 0));
    await tester.pump();
    expect(value, 'c', reason: 'commits on release, like UISegmentedControl');
    await gesture.up();
    await tester.pumpAndSettle();
    expect(value, 'a');
    handle.dispose();
  });

  testWidgets('drill page: picture under the status bar, bar forms on scroll', (
    tester,
  ) async {
    _size(tester, const Size(390, 844), top: 47);
    final drill = catalog.drills.first;
    await tester.pumpWidget(
      _app(
        DrillDetailPage(
          drill: drill,
          group: catalog.groupById(drill.groupId),
          onBack: () {},
          onStart: () {},
          onAdd: () {},
          added: false,
        ),
      ),
    );
    await tester.pumpAndSettle();
    // The hero starts at the very top, behind the status bar ...
    expect(tester.getTopLeft(find.byType(AspectRatio).first).dy, 0);
    // ... while the back button sits below it.
    expect(tester.getTopLeft(find.byType(RoundIconButton).first).dy, 47 + 8);
    expect(find.byType(BackdropFilter), findsNothing);
    await tester.tap(find.text('更多要点、常见错误与安全'));
    await tester.pumpAndSettle();
    await tester.drag(find.byType(ListView), const Offset(0, -600));
    await tester.pumpAndSettle();
    expect(find.byType(BackdropFilter), findsOneWidget);
    // The compact title has faded in once the large one scrolled away.
    final titles = find.text(drill.name);
    expect(titles, findsNWidgets(2));
    expect(tester.takeException(), isNull);
  });

  for (final brightness in Brightness.values) {
    testWidgets('small phone + large text: key pages do not overflow '
        '(${brightness.name})', (tester) async {
      _size(tester, const Size(320, 640), top: 20);
      final store = LearningStore(catalog: catalog, storage: _Memory());
      await store.initialize();
      await store.acknowledgeSafety();
      addTearDown(store.dispose);
      final drill = catalog.drills.first;
      final pages = <Widget>[
        AssessmentPage(
          initialGrades: const {},
          onSave: (_) async {},
          onSkip: () async {},
          onBack: () {},
        ),
        DrillDetailPage(
          drill: drill,
          group: catalog.groupById(drill.groupId),
          onBack: () {},
          onStart: () {},
          onAdd: () {},
          added: true,
        ),
        PathPage(
          catalog: catalog,
          store: store,
          onLesson: (_) {},
          onGate: (_, _) {},
          onAssessment: () {},
          onBack: () {},
        ),
        ProgressPage(
          catalog: catalog,
          store: store,
          onDrill: (_) {},
          onBack: () {},
        ),
        LibraryPage(
          catalog: catalog,
          store: store,
          onDrill: (_) {},
          onRemove: (_) {},
          onBack: () {},
        ),
      ];
      for (final page in pages) {
        await tester.pumpWidget(
          _app(SafeArea(child: page), scale: 1.3, brightness: brightness),
        );
        await tester.pumpAndSettle();
        expect(
          tester.takeException(),
          isNull,
          reason: '${page.runtimeType} overflowed at 320 pt, text ×1.3',
        );
      }
      await tester.pumpWidget(const SizedBox());
    });
  }

  testWidgets('empty history reads as one quiet sentence', (tester) async {
    final store = LearningStore(catalog: catalog, storage: _Memory());
    await store.initialize();
    addTearDown(store.dispose);
    await tester.pumpWidget(
      _app(
        ProgressPage(
          catalog: catalog,
          store: store,
          onDrill: (_) {},
          onBack: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byType(EmptyNote), findsOneWidget);
    expect(find.bySemanticsLabel('完成一次计时训练，记录会留在这里'), findsOneWidget);
  });
}
