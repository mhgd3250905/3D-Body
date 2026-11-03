// UI polish r1 baseline screenshots (not goldens, not part of CI).
// Every Thomas-owned page at 393×852 @2x, dark and light, plus a 1.5× text
// scale pass. Written only when THOMAS_SHOTS=<dir> is set, e.g.
//
//   THOMAS_SHOTS=/tmp/thomas flutter test --no-pub \
//     test_screens/thomas_ui_shots_test.dart
//
// Output: <dir>/<dark|light|dark-x1.5>/<name>.png. SDK-owned pages (the
// ugk_trainer player, ugk_coach_ui chat parts inside AI 定制) are only shown
// where a Thomas page hosts them.
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/flare_coach_chat.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/sdk_plan_editor_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach_chat/ugk_coach_chat.dart' show CoachGatewayBinding;

import '../test/domain/fixtures.dart';
import '../test/ui/coach_agent_fixtures.dart';
import '../test/ui/sdk_plan_preservation_test.dart' show structuredPlan;

class _Memory implements LocalStateStorage {
  final values = <String, String>{};
  @override
  Future<String?> read(String key) async => values[key];
  @override
  Future<void> write(String key, String value) async => values[key] = value;
}

final _out = Platform.environment['THOMAS_SHOTS'];
final _boundary = GlobalKey();

void main() {
  if (_out == null || _out!.isEmpty) {
    test('THOMAS_SHOTS not set; screenshots skipped', () {});
    return;
  }
  final catalog = loadCatalogFixture();

  setUpAll(() async {
    for (final name in [
      'FlareSans',
      'NotoSansKR',
      'NotoSansArabic',
      'NotoSansDevanagari',
    ]) {
      await (FontLoader(
        name,
      )..addFont(rootBundle.load('assets/fonts/$name.ttf'))).load();
    }
    final root =
        Platform.environment['FLUTTER_ROOT'] ??
        '/workspace/work/flutter-sdk/sdk/flutter';
    final icons = File(
      '$root/bin/cache/artifacts/material_fonts/MaterialIcons-Regular.otf',
    ).readAsBytesSync();
    await (FontLoader(
      'MaterialIcons',
    )..addFont(Future.value(ByteData.view(icons.buffer)))).load();
  });

  Widget app(Widget home, Brightness brightness) => RepaintBoundary(
    key: _boundary,
    child: MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: flareTheme(brightness),
      themeAnimationDuration: Duration.zero,
      builder: (context, child) {
        FlareColors.use(Theme.of(context).brightness);
        return child!;
      },
      locale: const Locale('zh'),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      home: home,
    ),
  );

  Future<void> shot(WidgetTester tester, String dir, String name) async {
    await tester.pump(const Duration(milliseconds: 400));
    await tester.runAsync(() async {
      for (final element in find.byType(Image).evaluate()) {
        final image = element.widget as Image;
        try {
          await precacheImage(image.image, element);
        } catch (_) {}
      }
    });
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    await tester.runAsync(() async {
      final boundary =
          _boundary.currentContext!.findRenderObject()!
              as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 2);
      final data = await image.toByteData(format: ui.ImageByteFormat.png);
      File('$_out/$dir/$name.png')
        ..createSync(recursive: true)
        ..writeAsBytesSync(data!.buffer.asUint8List());
    });
  }

  Future<void> settle(WidgetTester tester) async {
    for (var i = 0; i < 20; i++) {
      await tester.pump(const Duration(milliseconds: 100));
    }
  }

  Future<LearningStore> setup(
    WidgetTester tester,
    Brightness mode, {
    bool accepted = true,
    bool history = false,
    bool records = false,
    double scale = 1,
  }) async {
    tester.view.physicalSize = const Size(393 * 2, 852 * 2);
    tester.view.devicePixelRatio = 2;
    tester.view.padding = const FakeViewPadding(top: 118, bottom: 68);
    tester.view.viewPadding = const FakeViewPadding(top: 118, bottom: 68);
    tester.platformDispatcher.textScaleFactorTestValue = scale;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    addTearDown(tester.view.reset);
    FlareColors.use(mode);
    final store = LearningStore(catalog: catalog, storage: _Memory());
    await store.initialize();
    if (accepted) await store.acknowledgeSafety();
    await store.updateSettings(
      themeMode: mode == Brightness.dark ? 'dark' : 'light',
    );
    if (history) {
      final now = DateTime.now().toUtc();
      for (final (offset, id, sets, pain) in [
        (0, 'obliques-A', 3, false),
        (1, 'forearms-A', 1, false),
        (2, 'deltoids-A', 2, true),
        (4, 'triceps-A', 3, false),
        (5, 'scapular-A', 3, false),
        (8, 'obliques-A', 3, false),
      ]) {
        final start = now.subtract(Duration(days: offset, minutes: 12));
        final planned = catalog.drillById(id)!.dose.sets;
        final done = sets.clamp(0, planned);
        await store.logSession(
          TrainingSession(
            id: 's$offset',
            drillId: id,
            startedAt: start,
            endedAt: start.add(const Duration(minutes: 8)),
            plannedSets: planned,
            completedSets: done,
            activeSeconds: 240,
            completed: done == planned && !pain,
            pain: pain,
          ),
        );
      }
      await store.createRoutine('赛前热身', [
        'forearms-A',
        'scapular-A',
        'deltoids-A',
      ]);
      await store.createRoutine('支撑臂加强', ['triceps-A', 'obliques-A']);
    }
    if (records) {
      // ~20 training days over five weeks: an 8-day current streak, a few
      // doubles and one pain row, so every records element has real input.
      final now = DateTime.now();
      const ids = ['obliques-A', 'forearms-A', 'deltoids-A', 'triceps-A'];
      var n = 0;
      for (final offset in [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        9,
        10,
        12,
        15,
        16,
        17,
        20,
        23,
        24,
        27,
        30,
        33,
      ]) {
        for (var k = 0; k < (offset % 5 == 0 ? 2 : 1); k++) {
          final id = ids[n % ids.length];
          final planned = catalog.drillById(id)!.dose.sets;
          final pain = n == 3;
          final start = DateTime(
            now.year,
            now.month,
            now.day - offset,
            offset == 0 ? (now.hour > 0 ? now.hour - 1 : 0) : 19,
            k * 20,
          ).toUtc();
          await store.logSession(
            TrainingSession(
              id: 'r$n',
              drillId: id,
              startedAt: start,
              endedAt: start.add(const Duration(minutes: 9)),
              plannedSets: planned,
              completedSets: n % 6 == 2 ? planned - 1 : planned,
              activeSeconds: 300 + 30 * (n % 4),
              completed: n % 6 != 2 && !pain,
              pain: pain,
            ),
          );
          n++;
        }
      }
    }
    addTearDown(store.dispose);
    return store;
  }

  FlareCoachChat coach(LearningStore store) => FlareCoachChat(
    store: store,
    config: const CoachConfig(apiKey: 'test'),
    gateway: CoachGatewayBinding.shared(
      AgentFakeLlmClient([
        {
          'kind': 'ask',
          'text': '今天想练多久？',
          'options': ['10 分钟', '20 分钟', '30 分钟'],
        },
      ]),
    ),
    storage: _Memory(),
  );

  Future<SceneController> shell(
    WidgetTester tester,
    LearningStore store,
    Brightness mode, {
    FlareCoachChat? coachService,
  }) async {
    final scene = SceneController(commandSink: (_) {});
    addTearDown(scene.dispose);
    await tester.pumpWidget(
      app(
        FlareShell(
          catalog: catalog,
          store: store,
          sceneController: scene,
          enableScene: false,
          coach: coachService,
        ),
        mode,
      ),
    );
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'ready',
      'period': 9,
      'time': 2.0,
      'phase': {'source': 11},
    });
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'time': 2.0,
      'playing': false,
      'phase': {'source': 11},
    });
    await settle(tester);
    return scene;
  }

  Future<void> more(WidgetTester tester, [String? entry]) async {
    await tester.tap(find.bySemanticsLabel(RegExp('^更多')).first);
    await settle(tester);
    if (entry != null) {
      await tester.tap(find.widgetWithText(FlareListRow, entry).first);
      await settle(tester);
    }
  }

  Widget page(Widget child) => Scaffold(body: SafeArea(child: child));

  for (final mode in [Brightness.dark, Brightness.light]) {
    final d = mode == Brightness.dark ? 'dark' : 'light';

    testWidgets('$d 01 welcome, 02 safety', (tester) async {
      final store = await setup(tester, mode, accepted: false);
      await shell(tester, store, mode);
      await shot(tester, d, '01-welcome');
      final start = find.byType(FilledButton);
      if (start.evaluate().isNotEmpty) {
        await tester.tap(start.first);
        await settle(tester);
        await shot(tester, d, '02-safety');
      }
    });

    testWidgets('$d 03 home, 04 more, 05 muscles, 06 detail', (tester) async {
      final store = await setup(tester, mode);
      final scene = await shell(tester, store, mode);
      await shot(tester, d, '03-home');
      await more(tester);
      await shot(tester, d, '04-more-sheet');
      await tester.tapAt(const Offset(196, 80));
      await settle(tester);
      final muscles = find.bySemanticsLabel(RegExp('^点选肌群'));
      if (muscles.evaluate().isNotEmpty) {
        await tester.tap(muscles.first);
        await settle(tester);
        await shot(tester, d, '05-muscles-sheet');
        await tester.tapAt(const Offset(196, 80));
        await settle(tester);
      }
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'select',
        'time': 2.0,
        'groupId': 'obliques',
      });
      await settle(tester);
      await shot(tester, d, '06-muscle-detail');
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'time': 2.0,
        'playing': false,
        'selected': 'obliques',
        'detail': true,
        'detailModel': 'muscles',
      });
      await settle(tester);
      await shot(tester, d, '07-muscle-detail-standing');
    });

    testWidgets('$d 08 library, 09 drill detail', (tester) async {
      final store = await setup(tester, mode);
      await shell(tester, store, mode);
      await more(tester, '训练');
      await shot(tester, d, '08-library');
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -900));
      await settle(tester);
      await shot(tester, d, '08b-library-scrolled');
      await tester.pumpWidget(
        app(
          page(
            DrillDetailPage(
              drill: catalog.drillById('obliques-A')!,
              group: catalog.groupById('obliques'),
              onBack: () {},
              onStart: () {},
              onAddToPlan: () {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, '09-drill-detail');
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -700));
      await settle(tester);
      await shot(tester, d, '09b-drill-detail-scrolled');
    });

    testWidgets('$d 10 plans, 11 preset, 12 routine, 13 editor', (
      tester,
    ) async {
      final store = await setup(tester, mode, history: true);
      await shell(tester, store, mode);
      await more(tester, '计划');
      await shot(tester, d, '10-plans');
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -700));
      await settle(tester);
      await shot(tester, d, '10b-plans-scrolled');
      await tester.pumpWidget(
        app(
          page(
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
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, '11-preset-detail');
      final routine = store.routines.first;
      await tester.pumpWidget(
        app(
          page(
            PlanDetailPage(
              title: routine.name,
              drills: routine.drills(catalog),
              onBack: () {},
              onStart: () {},
              onDrill: (_) {},
              onEdit: () {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, '12-routine-detail');
      await tester.pumpWidget(
        app(
          page(
            RoutineEditorPage(
              catalog: catalog,
              store: store,
              routine: routine,
              onBack: () {},
              onSaved: (_) {},
              onDeleted: () {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, '13-routine-editor');
      final add = find.byIcon(Icons.add_rounded);
      if (add.evaluate().isNotEmpty) {
        await tester.tap(add.last);
        await settle(tester);
        await shot(tester, d, '14-drill-picker');
      }
    });

    testWidgets('$d 15 progress, 16 empty', (tester) async {
      final store = await setup(tester, mode, history: true);
      await tester.pumpWidget(
        app(
          page(
            ProgressPage(
              catalog: catalog,
              store: store,
              onBack: () {},
              onDrill: (_) {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, '15-progress');
      final empty = await setup(tester, mode);
      await tester.pumpWidget(
        app(
          page(
            ProgressPage(
              catalog: catalog,
              store: empty,
              onBack: () {},
              onDrill: (_) {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, '16-progress-empty');
    });

    testWidgets('$d 17 settings, 18 about, 19 language', (tester) async {
      final store = await setup(tester, mode);
      await shell(tester, store, mode);
      await more(tester, '设置');
      await shot(tester, d, '17-settings');
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -700));
      await settle(tester);
      await shot(tester, d, '17b-settings-scrolled');
      final language = find.byKey(const ValueKey('language-setting'));
      if (language.evaluate().isNotEmpty) {
        await tester.ensureVisible(language);
        await tester.drag(find.byType(Scrollable).first, const Offset(0, 240));
        await settle(tester);
        await tester.tap(language, warnIfMissed: false);
        await settle(tester);
        await shot(tester, d, '19-language-sheet');
        final sheetNav = find.byType(BottomSheet);
        if (sheetNav.evaluate().isNotEmpty) {
          Navigator.of(tester.element(sheetNav.first)).pop();
          await settle(tester);
        }
      }
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -2000));
      await settle(tester);
      final about = find.text('关于 Flare');
      if (about.evaluate().isNotEmpty) {
        await tester.tap(about.first, warnIfMissed: false);
        await settle(tester);
        await shot(tester, d, '18-about');
      }
    });

    testWidgets('$d 22 ai plan editor', (tester) async {
      await setup(tester, mode);
      await tester.pumpWidget(
        app(
          page(
            SdkPlanEditorPage(
              plan: structuredPlan(),
              catalog: catalog,
              onBack: () {},
              onSaved: (_) async => true,
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, '22-ai-plan-editor');
    });

    testWidgets('$d 20 ai coach', (tester) async {
      final store = await setup(tester, mode);
      final service = coach(store);
      await shell(tester, store, mode, coachService: service);
      await more(tester, '计划');
      final entry = find.byKey(const ValueKey('plan-ai-coach'));
      if (entry.evaluate().isEmpty) return;
      await tester.ensureVisible(entry);
      await tester.tap(entry);
      await settle(tester);
      await shot(tester, d, '20-ai-coach-disclaimer');
      final ok = find.byKey(const ValueKey('coach-disclaimer-ok'));
      if (ok.evaluate().isNotEmpty) {
        await tester.tap(ok);
        await settle(tester);
      }
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 300)),
      );
      await settle(tester);
      await shot(tester, d, '21-ai-coach');
    });
  }

  // 1.5× text scale spot check (dark).
  testWidgets('x1.5 more, library, plans, progress, settings', (tester) async {
    const d = 'dark-x1.5';
    final store = await setup(
      tester,
      Brightness.dark,
      history: true,
      scale: 1.5,
    );
    await shell(tester, store, Brightness.dark);
    await shot(tester, d, '03-home');
    await more(tester);
    await shot(tester, d, '04-more-sheet');
    await tester.tapAt(const Offset(196, 60));
    await settle(tester);
    for (final (entry, name) in [
      ('训练', '08-library'),
      ('计划', '10-plans'),
      ('记录', '15-progress'),
      ('设置', '17-settings'),
    ]) {
      await tester.pumpWidget(const SizedBox());
      await shell(tester, store, Brightness.dark);
      await more(tester, entry);
      await shot(tester, d, name);
    }
  });

  // T3 + T4: shared drill filter, picker states, records achievement page.
  for (final (mode, d, scale) in [
    (Brightness.dark, 'dark', 1.0),
    (Brightness.light, 'light', 1.0),
    (Brightness.dark, 'dark-x1.5', 1.5),
  ]) {
    testWidgets('t3t4 $d library, filter sheet, picker', (tester) async {
      final store = await setup(tester, mode, history: true, scale: scale);
      await tester.pumpWidget(
        app(
          page(
            LibraryPage(
              catalog: catalog,
              store: store,
              onDrill: (_) {},
              onBack: () {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, 't3-library');
      final core = find.byKey(const ValueKey('drill-filter-section-core'));
      if (core.evaluate().isNotEmpty) {
        await tester.ensureVisible(core);
        await settle(tester);
        await tester.tap(core);
        await settle(tester);
        await shot(tester, d, 't3-library-core');
      }
      await tester.tap(find.byKey(const ValueKey('drill-filter-open')));
      await settle(tester);
      await shot(tester, d, 't3-filter-sheet');
      Navigator.of(tester.element(find.byType(BottomSheet).first)).pop();
      await settle(tester);
      final routine = store.routines.first;
      await tester.pumpWidget(
        app(
          page(
            RoutineEditorPage(
              catalog: catalog,
              store: store,
              routine: routine,
              onBack: () {},
              onSaved: (_) {},
              onDeleted: () {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await tester.tap(find.byIcon(Icons.add_rounded).last);
      await settle(tester);
      var picked = 0;
      for (final drill in catalog.drills.where((x) => x.tier == 'A')) {
        if (picked == 2) break;
        if (routine.drillIds.contains(drill.id)) continue;
        final tile = find.byKey(ValueKey('pick-${drill.id}'));
        if (tile.hitTestable().evaluate().isEmpty) continue;
        await tester.tap(tile);
        await settle(tester);
        picked++;
      }
      await shot(tester, d, 't3-picker');
      final scroll = find.descendant(
        of: find.byType(BottomSheet),
        matching: find.byType(Scrollable),
      );
      await tester.drag(scroll.last, const Offset(0, -500));
      await settle(tester);
      await shot(tester, d, 't3-picker-scrolled');
    });

    testWidgets('t3t4 $d records, empty', (tester) async {
      final store = await setup(tester, mode, records: true, scale: scale);
      await tester.pumpWidget(
        app(
          page(
            ProgressPage(
              catalog: catalog,
              store: store,
              onBack: () {},
              onDrill: (_) {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, 't4-records');
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -600));
      await settle(tester);
      await shot(tester, d, 't4-records-scrolled');
      final empty = await setup(tester, mode, scale: scale);
      await tester.pumpWidget(
        app(
          page(
            ProgressPage(
              catalog: catalog,
              store: empty,
              onBack: () {},
              onDrill: (_) {},
              onStart: () {},
            ),
          ),
          mode,
        ),
      );
      await settle(tester);
      await shot(tester, d, 't4-records-empty');
    });
  }
}
