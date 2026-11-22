import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/motion_controls.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/theme_fade.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';

class MemoryStateStorage implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

Widget testApp(Widget home) => MaterialApp(
  theme: flareTheme(),
  locale: const Locale('zh'),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  home: home,
);

Future<void> phoneSize(WidgetTester tester) async {
  tester.view.physicalSize = const Size(390, 844);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
}

Future<void> tapVisible(WidgetTester tester, Finder finder) async {
  if (finder.evaluate().isEmpty) {
    await tester.scrollUntilVisible(
      finder,
      350,
      scrollable: find.byType(Scrollable).last,
    );
  }
  await tester.ensureVisible(finder);
  await tester.pump();
  await tester.tap(finder);
  await tester.pump();
}

void assertNoFlutterError(WidgetTester tester) {
  expect(
    tester.takeException(),
    isNull,
    reason: 'Core phone flow must not overflow or throw',
  );
}

// Composite Material buttons expose the same semantics through a parent
// annotation and their child container; target the outer advertised control.
Finder labeledControl(String label) =>
    find.bySemanticsLabel(RegExp('^${RegExp.escape(label)}')).first;

Future<void> openPlansFromHome(WidgetTester tester) async {
  final strings = tester.element(find.byType(FlareShell)).strings;
  await tester.tap(labeledControl(strings.more));
  await tester.pumpAndSettle();
  await tester.tap(find.widgetWithText(FlareListRow, strings.plans));
  await tester.pumpAndSettle();
}

void assertLeanHome(WidgetTester tester) {
  expect(find.bySemanticsLabel('Flare · 托马斯助手'), findsOneWidget);
  expect(find.text('FLARE · 托马斯全旋'), findsNothing);
  expect(find.text('完整循环 · 8 个阶段'), findsNothing);
  expect(find.byType(NavigationBar), findsNothing);
  expect(find.byType(Slider), findsNothing);
  expect(find.byType(ActionChip), findsNothing);
  expect(find.byType(FlareSegmented<String>), findsNothing);
  expect(find.text('动作白膜'), findsNothing);
  expect(find.text('肌群模型'), findsNothing);
  expect(find.byKey(const ValueKey('detail-card')), findsNothing);
  expect(find.byType(MotionTimeline), findsOneWidget);
  final scene = find.byWidgetPredicate(
    (widget) =>
        widget is SizedBox &&
        widget.key is GlobalKey &&
        widget.child is ColoredBox,
  );
  expect(scene, findsOneWidget);
  expect(
    tester.getSize(scene).height,
    greaterThan(550),
    reason:
        'The phone scene must retain the space recovered from persistent tool rows',
  );
  expect(
    tester.getSize(find.byType(MotionTimeline)).height,
    lessThanOrEqualTo(56),
  );
}

/// Route probe only. Real SDK player/result behavior has dedicated tests.
class TrainingRouteProbe extends StatelessWidget {
  const TrainingRouteProbe(this.plan, {super.key});
  final uc.TrainingPlan plan;
  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: TextButton(
        key: const ValueKey('training-probe-close'),
        onPressed: () => Navigator.of(context).pop(),
        child: const Text('Close training'),
      ),
    ),
  );
}

/// The App loads SDK voice/media metadata before pushing the training route.
/// Pumping only the fake clock cannot complete rootBundle's real asset IO.
Future<void> waitForTrainingRoute(WidgetTester tester, {Finder? route}) async {
  final target = route ?? find.byType(TrainingRouteProbe);
  for (var attempt = 0; attempt < 100 && target.evaluate().isEmpty; attempt++) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 10)),
    );
    await tester.pump(const Duration(milliseconds: 100));
  }
  if (route == null) await tester.pumpAndSettle();
  expect(
    target,
    findsOneWidget,
    reason: 'Training route must open after its bounded asset IO wait',
  );
}

void main() {
  final catalog = loadCatalogFixture();

  testWidgets(
    'home muscle hits enter a single muscle plan and return to the same paused stage',
    (tester) async {
      await phoneSize(tester);
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      addTearDown(
        () => tester.binding.handleAppLifecycleStateChanged(
          AppLifecycleState.resumed,
        ),
      );
      tester.view.padding = const FakeViewPadding(bottom: 34);
      tester.view.viewPadding = const FakeViewPadding(bottom: 34);
      addTearDown(tester.view.resetPadding);
      addTearDown(tester.view.resetViewPadding);
      final planned = loadCatalogFixture(includeFlarePlans: true);
      final store = LearningStore(
        catalog: planned,
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
      final commands = <Map<String, Object?>>[];
      final scene = SceneController(commandSink: commands.add);
      addTearDown(store.dispose);
      addTearDown(scene.dispose);
      await tester.pumpWidget(
        testApp(
          FlareShell(
            catalog: planned,
            store: store,
            sceneController: scene,
            enableScene: false,
          ),
        ),
      );
      scene.receiveEvent({'source': 'flare-scene', 'type': 'ready'});
      await tester.pumpAndSettle();

      const time = 2.375;
      scene.setTime(time);
      scene.play();
      await tester.pumpAndSettle();
      commands.clear();
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.inactive);
      await tester.pump();
      expect(scene.playing, isFalse);
      expect(scene.time, time);
      expect(commands.any((command) => command['type'] == 'pause'), isTrue);
      expect(
        commands.where((command) => command['type'] == 'visibility'),
        isEmpty,
      );
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pumpAndSettle();
      final home = find.byType(MotionTimeline, skipOffstage: false);
      final timeline = tester.element(home);
      final geometry = tester.getRect(home);
      commands.clear();

      // Both the body label and the phase map emit a home muscle hit.
      for (final (group, via) in [('triceps', 'label'), ('deltoids', 'map')]) {
        final hit = {
          'source': 'flare-scene',
          'type': 'select',
          'groupId': group,
          'time': time,
          'phase': {'source': 11},
          'via': via,
        };
        scene.receiveEvent(hit);
        scene.receiveEvent(hit); // A fast double tap must not stack two plans.
        await tester.pumpAndSettle();

        final plan = find.byType(FlarePlanDetailPage);
        expect(plan, findsOneWidget);
        expect(
          tester.widget<FlarePlanDetailPage>(plan).plans.first.groupId,
          group,
        );
        expect(find.byKey(const ValueKey('muscle-panel-title')), findsNothing);
        expect(identical(tester.element(home), timeline), isTrue);
        expect(tester.getRect(home), geometry);
        expect(scene.time, time);
        expect(scene.playing, isFalse);
        expect(
          commands.lastWhere(
            (command) => command['type'] == 'visibility',
          )['visible'],
          isFalse,
        );

        await tester.binding.handlePopRoute();
        await tester.pumpAndSettle();
        expect(plan, findsNothing);
        expect(identical(tester.element(home), timeline), isTrue);
        expect(tester.getRect(home), geometry);
        expect(scene.time, time);
        expect(scene.playing, isFalse);
        expect(
          commands.lastWhere(
            (command) => command['type'] == 'visibility',
          )['visible'],
          isTrue,
        );
      }
      expect(
        commands.where(
          (command) => !{'visibility', 'pause'}.contains(command['type']),
        ),
        isEmpty,
        reason:
            'The home player must not seek, reframe, reset or present anew.',
      );
      assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets(
    'plans: create a custom set, train, return, edit and delete with undo',
    (tester) async {
      await phoneSize(tester);
      final semantics = tester.ensureSemantics();
      try {
        final store = LearningStore(
          catalog: catalog,
          storage: MemoryStateStorage(),
        );
        await store.initialize();
        await store.acknowledgeSafety();
        final scene = SceneController(commandSink: (_) {});
        addTearDown(store.dispose);
        addTearDown(scene.dispose);
        await tester.pumpWidget(
          testApp(
            FlareShell(
              catalog: catalog,
              store: store,
              sceneController: scene,
              enableScene: false,
              trainingPageBuilder: (plan) => TrainingRouteProbe(plan),
            ),
          ),
        );
        await tester.pumpAndSettle();
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'ready',
          'time': 0.0,
          'period': 9.0,
          'phase': {'source': 9},
        });
        await tester.pumpAndSettle();
        await openPlansFromHome(tester);
        expect(find.byType(PlansPage), findsOneWidget);
        await tester.tap(find.byKey(const ValueKey('plan-new')));
        await tester.pumpAndSettle();
        expect(find.byType(RoutineEditorPage), findsOneWidget);
        await tester.enterText(
          find.byKey(const ValueKey('routine-name')),
          '我的核心',
        );
        await tester.tap(find.byKey(const ValueKey('routine-add')));
        await tester.pumpAndSettle();
        await tester.enterText(
          find.byKey(const ValueKey('picker-search')),
          catalog.drillById('abs-A')!.name,
        );
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('pick-abs-A')));
        await tester.pump();
        await tester.tap(find.byKey(const ValueKey('picker-done')));
        await tester.pumpAndSettle();
        await tapVisible(tester, find.byKey(const ValueKey('routine-save')));
        await tester.pumpAndSettle();
        expect(store.routines.single.name, '我的核心');
        expect(store.routines.single.drillIds, ['abs-A']);
        final detail = tester.widget<PlanDetailPage>(
          find.byType(PlanDetailPage),
        );
        expect(detail.title, '我的核心');
        expect(detail.onEdit, isNotNull);

        await tapVisible(tester, find.byKey(const ValueKey('plan-start')));
        await waitForTrainingRoute(tester);
        final delivered = tester
            .widget<TrainingRouteProbe>(find.byType(TrainingRouteProbe))
            .plan;
        expect(
          delivered.items.map((item) => item.exerciseId),
          detail.drills.map((drill) => drill.id),
        );
        expect(delivered.items.first.sets, detail.drills.first.dose.sets);
        await tester.tap(find.byKey(const ValueKey('training-probe-close')));
        await tester.pumpAndSettle();
        expect(find.byType(TrainingRouteProbe), findsNothing);
        expect(find.byType(PlanDetailPage), findsOneWidget);
        expect(store.sessions, isEmpty);
        assertNoFlutterError(tester);

        await tester.tap(find.byKey(const ValueKey('plan-edit')));
        await tester.pumpAndSettle();
        await tapVisible(tester, find.byKey(const ValueKey('routine-delete')));
        await tester.pumpAndSettle();
        expect(store.routines, isEmpty);
        expect(find.byType(PlansPage), findsOneWidget);
        await tester.tap(find.text('撤销'));
        await tester.pumpAndSettle();
        expect(store.routines.single.name, '我的核心');
        expect(find.text('我的核心'), findsWidgets);
        assertNoFlutterError(tester);
        await tester.pumpWidget(const SizedBox());
      } finally {
        semantics.dispose();
      }
    },
  );

  testWidgets(
    'compact home keeps navigation discoverable and timeline drag/keyboard seek paused',
    (tester) async {
      await phoneSize(tester);
      final semantics = tester.ensureSemantics();
      try {
        final store = LearningStore(
          catalog: catalog,
          storage: MemoryStateStorage(),
        );
        await store.initialize();
        await store.acknowledgeSafety();
        await store.setLastTime(2);
        final commands = <Map<String, Object?>>[];
        final scene = SceneController(commandSink: commands.add);
        addTearDown(store.dispose);
        addTearDown(scene.dispose);
        await tester.pumpWidget(
          testApp(
            FlareShell(
              catalog: catalog,
              store: store,
              sceneController: scene,
              enableScene: false,
            ),
          ),
        );
        await tester.pumpAndSettle();
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'ready',
          'time': 0.0,
          'period': 9.0,
          'phase': {'source': 9},
        });
        await tester.pumpAndSettle();
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'state',
          'time': 2.0,
          'playing': true,
          'phase': {'source': 11},
        });
        await tester.pumpAndSettle();
        assertLeanHome(tester);

        await openPlansFromHome(tester);
        expect(find.byType(PlansPage), findsOneWidget);
        expect(scene.playing, isFalse);
        expect(scene.time, 2.0);
        await tester.tap(find.byTooltip('返回'));
        await tester.pumpAndSettle();
        assertLeanHome(tester);

        // Reach the public timeline through actual keyboard traversal, rather
        // than programmatically focusing a private implementation field.
        var timelineFocused = false;
        for (var step = 0; step < 12 && !timelineFocused; step++) {
          await tester.sendKeyEvent(LogicalKeyboardKey.tab);
          await tester.pump();
          final focusContext = FocusManager.instance.primaryFocus?.context;
          timelineFocused =
              focusContext != null &&
              (focusContext.widget is MotionTimeline ||
                  focusContext
                          .findAncestorWidgetOfExactType<MotionTimeline>() !=
                      null);
        }
        expect(
          timelineFocused,
          isTrue,
          reason: 'Timeline must be keyboard reachable',
        );
        scene.play();
        await tester.pump();
        await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
        await tester.pumpAndSettle();
        expect(scene.time, closeTo(2.1, 0.0001));
        expect(scene.playing, isFalse);
        expect(store.lastTime, closeTo(2.1, 0.0001));
        await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
        await tester.pumpAndSettle();
        expect(scene.time, closeTo(2.0, 0.0001));

        final timeline = find.byType(MotionTimeline);
        final bounds = tester.getRect(timeline);
        double tickX(String number) => tester
            .getCenter(
              find.descendant(of: timeline, matching: find.text(number)),
            )
            .dx;
        final startX = bounds.left + bounds.width * .25;
        final midpointX = (tickX('14') + tickX('15')) / 2;
        scene.play();
        await tester.pump();
        await tester.dragFrom(
          Offset(startX, bounds.center.dy),
          Offset(midpointX - startX, 0),
        );
        await tester.pumpAndSettle();
        final between14And15 =
            (catalog.phaseTime(14) + catalog.phaseTime(15)) / 2;
        expect(scene.time, closeTo(between14And15, 0.0001));
        expect(scene.playing, isFalse);
        expect(
          commands.lastWhere((command) => command['type'] == 'seek')['time'],
          closeTo(between14And15, 0.0001),
        );

        // The printed source tick is a pose landmark, not a uniform time label.
        // Clicking its actual position must select that exact catalog pose time.
        scene.play();
        await tester.pump();
        await tester.tap(
          find.descendant(of: timeline, matching: find.text('11')),
        );
        await tester.pumpAndSettle();
        expect(scene.time, closeTo(catalog.phaseTime(11), 0.0001));
        expect(scene.playing, isFalse);
        expect(store.lastTime, closeTo(catalog.phaseTime(11), 0.0001));
        expect(
          commands.lastWhere((command) => command['type'] == 'seek')['time'],
          closeTo(catalog.phaseTime(11), 0.0001),
        );
        assertLeanHome(tester);
        assertNoFlutterError(tester);
        await tester.pumpWidget(const SizedBox());
      } finally {
        semantics.dispose();
      }
    },
  );

  testWidgets(
    'first scene ready applies speed without overwriting saved paused time',
    (tester) async {
      await phoneSize(tester);
      final storage = MemoryStateStorage();
      final store = LearningStore(catalog: catalog, storage: storage);
      await store.initialize();
      await store.acknowledgeSafety();
      await store.updateSettings(speed: 0.25);
      await store.setLastTime(2.375);
      final commands = <Map<String, Object?>>[];
      final scene = SceneController(commandSink: commands.add);
      addTearDown(scene.dispose);
      addTearDown(store.dispose);
      await tester.pumpWidget(
        testApp(
          FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
          ),
        ),
      );
      await tester.pumpAndSettle();
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'ready',
        'time': 0.0,
        'period': 9.0,
        'phase': {'source': 9},
      });
      await tester.pumpAndSettle();
      expect(scene.time, 2.375);
      expect(scene.speed, 0.25);
      expect(store.lastTime, 2.375);
      expect(
        commands
            .where((command) => command['type'] == 'seek')
            .map((command) => command['time']),
        [2.375],
      );
      expect((jsonDecode(storage.value!) as Map)['lastTime'], 2.375);
      assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets('appearance switch persists, repaints and tells the scene', (
    tester,
  ) async {
    await phoneSize(tester);
    final storage = MemoryStateStorage();
    final store = LearningStore(catalog: catalog, storage: storage);
    await store.initialize();
    await store.acknowledgeSafety();
    expect(store.settings.themeMode, 'system');
    final commands = <Map<String, Object?>>[];
    final scene = SceneController(commandSink: commands.add);
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    addTearDown(() => FlareColors.use(Brightness.dark));
    await tester.pumpWidget(
      ListenableBuilder(
        listenable: store,
        builder: (context, _) => MaterialApp(
          theme: flareTheme(Brightness.light),
          darkTheme: flareTheme(Brightness.dark),
          themeMode: themeModeOf(store.settings.themeMode),
          themeAnimationDuration: Duration.zero,
          locale: const Locale('zh'),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          builder: (context, child) {
            final brightness = Theme.of(context).brightness;
            FlareColors.use(brightness);
            return ThemeCrossFade(brightness: brightness, child: child!);
          },
          home: FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
          ),
        ),
      ),
    );
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'ready',
      'period': 9,
      'time': 2.0,
      'phase': {'source': 11},
    });
    await tester.pumpAndSettle();
    await tester.tap(labeledControl('更多'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FlareListRow, '设置'));
    await tester.pumpAndSettle();
    final appearance = find.byWidgetPredicate(
      (widget) =>
          widget is FlareSegmented<String> &&
          widget.segments.map((segment) => segment.$1).join(',') ==
              'system,dark,light',
    );
    expect(appearance, findsOneWidget);
    expect(
      find.descendant(of: appearance, matching: find.text('跟随系统')),
      findsOneWidget,
    );
    await tester.tap(
      find.descendant(of: appearance, matching: find.text('浅色')),
    );
    await tester.pumpAndSettle();
    expect(store.settings.themeMode, 'light');
    expect(FlareColors.palette.isDark, isFalse);
    // The system was already light: the first appearance is applied as is.
    expect(commands.lastWhere((value) => value['type'] == 'theme'), {
      'type': 'theme',
      'value': 'light',
    });
    assertNoFlutterError(tester);
    await tester.tap(
      find.descendant(of: appearance, matching: find.text('深色')),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 16));
    // The whole screen dissolves from the old (light) appearance.
    expect(
      tester.state<ThemeCrossFadeState>(find.byType(ThemeCrossFade)).fading,
      isTrue,
    );
    await tester.pumpAndSettle();
    expect(
      tester.state<ThemeCrossFadeState>(find.byType(ThemeCrossFade)).fading,
      isFalse,
    );
    expect(FlareColors.palette.isDark, isTrue);
    // Switches after the first carry the dissolve duration for the scene's
    // CSS, in step with the app's cross-fade.
    expect(commands.lastWhere((value) => value['type'] == 'theme'), {
      'type': 'theme',
      'value': 'dark',
      'duration': FlareMotion.theme.inMilliseconds,
    });
    final restored = LearningStore(catalog: catalog, storage: storage);
    await restored.initialize();
    expect(restored.settings.themeMode, 'dark');
    restored.dispose();
    await tester.pumpWidget(const SizedBox());
  });
}
