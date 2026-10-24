import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/app_glass.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/drill_media.dart';
import 'package:flare/ui/plans_page.dart';
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

  testWidgets(
    'drill page: fixed header and action stay outside scrolling content',
    (tester) async {
      _size(tester, const Size(390, 844), top: 47);
      final drill = catalog.drills.first;
      var starts = 0;
      var backs = 0;
      await tester.pumpWidget(
        _app(
          SafeArea(
            bottom: false,
            child: DrillDetailPage(
              drill: drill,
              group: catalog.groupById(drill.groupId),
              onBack: () => backs++,
              onStart: () => starts++,
              onAddToPlan: () {},
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final header = find.byType(PageHeader);
      final actions = find.byType(FlareActionBar);
      final list = find.byType(ListView);
      final back = find.byTooltip('返回');
      final start = find.widgetWithText(FilledButton, '开始训练');
      expect(header, findsOneWidget);
      expect(actions, findsOneWidget);
      expect(find.text(drill.name), findsOneWidget);
      final headerBefore = tester.getRect(header);
      final actionsBefore = tester.getRect(actions);
      expect(tester.getTopLeft(back).dy, greaterThanOrEqualTo(47));
      expect(
        tester.getTopLeft(find.byType(DrillMediaCard)).dy,
        greaterThanOrEqualTo(headerBefore.bottom),
      );
      expect(tester.getRect(list).bottom, lessThanOrEqualTo(actionsBefore.top));
      expect(
        find.descendant(of: list, matching: find.byType(FlareGlassBar)),
        findsNothing,
        reason: 'Scrolling media and text retain static content surfaces',
      );
      final disclosure = find.text('更多要点、常见错误与安全');
      await tester.ensureVisible(disclosure);
      await tester.pumpAndSettle();
      await tester.tap(disclosure);
      await tester.pumpAndSettle();
      await tester.drag(list, const Offset(0, -600));
      await tester.pumpAndSettle();
      final scroll = tester.state<ScrollableState>(
        find.descendant(of: list, matching: find.byType(Scrollable)),
      );
      expect(scroll.position.pixels, greaterThan(0));
      expect(tester.getRect(header), headerBefore);
      expect(tester.getRect(actions), actionsBefore);
      expect(find.text(drill.name), findsOneWidget);
      expect(start.hitTestable(), findsOneWidget);
      expect(back.hitTestable(), findsOneWidget);
      await tester.tap(start);
      await tester.tap(back);
      await tester.pumpAndSettle();
      expect(starts, 1);
      expect(backs, 1);
      expect(tester.takeException(), isNull);
    },
  );

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
        DrillDetailPage(
          drill: drill,
          group: catalog.groupById(drill.groupId),
          onBack: () {},
          onStart: () {},
          onAddToPlan: () {},
        ),
        PlansPage(
          catalog: catalog,
          store: store,
          onPreset: (_) {},
          onRoutine: (_) {},
          onNewRoutine: () {},
          onBack: () {},
        ),
        PlanDetailPage(
          title: '托马斯全链',
          line: '一次练到托马斯的主力肌群',
          drills: PresetPlan.all.last.drills(catalog, 'A'),
          store: store,
          onBack: () {},
          onStart: () {},
          onDrill: (_) {},
          onSaveAsMine: () {},
        ),
        RoutineEditorPage(
          catalog: catalog,
          store: store,
          seedDrillIds: const ['abs-A', 'deltoids-A'],
          onBack: () {},
          onSaved: (_) {},
        ),
        PlanRunPage(
          title: '托马斯全链',
          drills: PresetPlan.all.last.drills(catalog, 'A'),
          done: const {0},
          index: 1,
          onStart: () {},
          onSelect: (_) {},
          onSkip: () {},
          onFinish: () {},
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
