import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/motion_controls.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/theme_fade.dart';
import 'package:flare/ui/timer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

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

void assertLeanHome(WidgetTester tester) {
  expect(find.byType(NavigationBar), findsNothing);
  expect(find.byType(Slider), findsNothing);
  expect(find.byType(ActionChip), findsNothing);
  expect(find.byType(FlareSegmented<String>), findsNothing);
  expect(find.text('动作白膜'), findsNothing);
  expect(find.text('肌群模型'), findsNothing);
  expect(find.byKey(const ValueKey('detail-card')), findsNothing);
  expect(find.byType(MotionTimeline), findsOneWidget);
  final scene = find.byWidgetPredicate(
    (widget) => widget is ColoredBox && widget.color == FlareColors.background,
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

void main() {
  final catalog = loadCatalogFixture();

  testWidgets(
    'phone safety → phase muscle → drill → local pain record → same paused frame',
    (tester) async {
      await phoneSize(tester);
      final semantics = tester.ensureSemantics();
      try {
        final storage = MemoryStateStorage();
        final store = LearningStore(catalog: catalog, storage: storage);
        await store.initialize();
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
        final enter = find.widgetWithText(FilledButton, '开始');
        expect(enter, findsOneWidget);
        expect(store.safetyAccepted, isFalse);
        assertNoFlutterError(tester);

        // Start shows the three-rule safety card once; dismissing it does not
        // accept, only the explicit acknowledgement does.
        await tester.tap(enter);
        await tester.pumpAndSettle();
        expect(find.text('三件事'), findsOneWidget);
        expect(store.safetyAccepted, isFalse);
        assertNoFlutterError(tester);
        await tester.tap(find.widgetWithText(FilledButton, '我知道了'));
        await tester.pumpAndSettle();
        expect(store.safetyAccepted, isTrue);
        expect(find.byType(WelcomePage), findsNothing);
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'ready',
          'period': 9,
          'time': 0,
          'phase': {'source': 9},
        });
        await tester.pump();
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'state',
          'time': 2.0,
          'playing': true,
          'phase': {'source': 11},
        });
        await tester.pumpAndSettle();
        expect(find.text('第一侧支撑'), findsOneWidget);
        expect(find.text('2.0 / 9.0 s'), findsOneWidget);
        assertLeanHome(tester);
        assertNoFlutterError(tester);

        await tester.tap(labeledControl('暂停后可点选肌群'));
        await tester.pumpAndSettle();
        expect(scene.playing, isFalse);
        expect(scene.time, 2.0);
        // More keeps only the four entries and speed.
        await tester.tap(labeledControl('更多'));
        await tester.pumpAndSettle();
        for (final label in ['训练', '学习路径', '记录', '设置']) {
          expect(find.widgetWithText(ListTile, label), findsOneWidget);
        }
        expect(find.byType(FlareSegmented<double>), findsOneWidget);
        expect(find.byType(ActionChip), findsNothing);
        assertNoFlutterError(tester);
        await tester.tapAt(const Offset(195, 40));
        await tester.pumpAndSettle();
        expect(scene.playing, isFalse);
        expect(scene.time, 2.0);
        assertLeanHome(tester);
        await tester.tap(labeledControl('点选肌群查看详解'));
        await tester.pumpAndSettle();
        // The picker leads with this moment's primary groups only.
        expect(find.text('第一侧支撑'), findsWidgets);
        expect(find.textContaining('其他参与'), findsOneWidget);
        await tester.tap(find.text('三角肌').last);
        await tester.pumpAndSettle();
        expect(find.text('暂停于 2.0 秒'), findsOneWidget);
        expect(find.text('正面'), findsNothing);
        expect(find.text('背面'), findsNothing);
        expect(find.byType(DrillTile), findsNothing);
        expect(scene.time, 2.0);
        expect(scene.playing, isFalse);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.detailModel, 'motion');
        expect(find.byKey(const ValueKey('detail-model')), findsNothing);
        expect(find.text('动作白膜'), findsNothing);
        expect(find.text('肌群模型'), findsNothing);
        expect(
          find.text(catalog.phaseBySource(11)!.muscle('deltoids')!.why!),
          findsOneWidget,
        );

        // The whole visible card is the only model switch.
        final generation = scene.selectionGeneration;
        await tester.tap(find.byKey(const ValueKey('detail-card')));
        await tester.pumpAndSettle();
        expect(commands.lastWhere((value) => value['type'] == 'detail_model'), {
          'type': 'detail_model',
          'value': 'muscles',
        });
        expect(commands.lastWhere((value) => value['type'] == 'visibility'), {
          'type': 'visibility',
          'visible': true,
        });
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'state',
          'time': 2.0,
          'playing': false,
          'selected': 'deltoids',
          'detail': true,
          'detailModel': 'muscles',
        });
        await tester.pumpAndSettle();
        expect(scene.detailModel, 'muscles');
        expect(scene.time, 2.0);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.playing, isFalse);
        expect(scene.selectionGeneration, generation);
        expect(
          find.text(catalog.phaseBySource(11)!.muscle('deltoids')!.why!),
          findsOneWidget,
        );
        await tester.tap(find.byKey(const ValueKey('detail-card')));
        await tester.pumpAndSettle();
        expect(commands.lastWhere((value) => value['type'] == 'detail_model'), {
          'type': 'detail_model',
          'value': 'motion',
        });
        // The scene acknowledgement is not another muscle hit.
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'state',
          'time': 2.0,
          'playing': false,
          'selected': 'deltoids',
          'detail': true,
          'detailModel': 'motion',
        });
        await tester.pumpAndSettle();
        expect(scene.selectionGeneration, generation);
        expect(scene.detailModel, 'motion');
        expect(find.byKey(const ValueKey('detail-model')), findsNothing);
        expect(
          find.text(catalog.phaseBySource(11)!.muscle('deltoids')!.why!),
          findsOneWidget,
        );
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'state',
          'time': 2.0,
          'playing': false,
          'selected': 'deltoids',
          'detail': true,
          'detailModel': 'muscles',
        });
        await tester.pumpAndSettle();

        expect(find.widgetWithText(FilledButton, '练三角肌'), findsOneWidget);
        await tester.tap(find.byKey(const ValueKey('train-group')));
        await tester.pumpAndSettle();
        // Training first asks for a scene: no equipment, home, or gym.
        expect(find.text('选一个训练场景'), findsOneWidget);
        expect(find.byKey(const ValueKey('scene-A')), findsOneWidget);
        expect(find.byKey(const ValueKey('scene-B')), findsOneWidget);
        expect(find.byKey(const ValueKey('scene-C')), findsOneWidget);
        // System back cancels the choice without navigating away from the
        // paused detail; reopening must release the one-sheet guard.
        await tester.binding.handlePopRoute();
        await tester.pumpAndSettle();
        expect(find.text('选一个训练场景'), findsNothing);
        expect(find.byType(DrillDetailPage), findsNothing);
        expect(scene.time, 2.0);
        expect(scene.detailModel, 'muscles');

        for (final (tier, label) in [('B', '居家'), ('C', '健身房')]) {
          await tester.tap(find.byKey(const ValueKey('train-group')));
          await tester.pumpAndSettle();
          final option = tester.getSemantics(labeledControl(label));
          expect(
            option.getSemanticsData().hasAction(SemanticsAction.tap),
            isTrue,
          );
          // Activate the advertised accessibility node, not the InkWell.
          option.owner!.performAction(option.id, SemanticsAction.tap);
          await tester.pumpAndSettle();
          expect(
            tester
                .widget<DrillDetailPage>(find.byType(DrillDetailPage))
                .drill
                .id,
            'deltoids-$tier',
          );
          expect(scene.time, 2.0);
          expect(scene.detailModel, 'muscles');
          await tester.tap(find.byTooltip('返回'));
          await tester.pumpAndSettle();
          expect(find.byType(DrillDetailPage), findsNothing);
          expect(scene.detail, 'deltoids');
          expect(scene.playing, isFalse);
          assertNoFlutterError(tester);
        }
        await tester.tap(find.byKey(const ValueKey('train-group')));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('scene-A')));
        await tester.pumpAndSettle();
        final detail = tester.widget<DrillDetailPage>(
          find.byType(DrillDetailPage),
        );
        expect(detail.drill.id, 'deltoids-A');
        expect(scene.time, 2.0);
        expect(scene.selected, 'deltoids');
        expect(scene.detailModel, 'muscles');
        assertNoFlutterError(tester);

        await tester.tap(find.byTooltip('加入今日训练'));
        await tester.pumpAndSettle();
        expect(store.todayIds, ['deltoids-A']);
        await tapVisible(tester, find.widgetWithText(FilledButton, '开始训练'));
        // The timer rises as a modal sheet; let it land before touching it.
        await tester.pump(const Duration(milliseconds: 500));
        expect(find.byType(TrainingTimerPage), findsOneWidget);
        expect(
          tester
              .widget<TrainingTimerPage>(find.byType(TrainingTimerPage))
              .drill
              .id,
          'deltoids-A',
        );
        assertNoFlutterError(tester);

        await tapVisible(tester, find.text('不适，停止练习'));
        await tester.pump(const Duration(milliseconds: 150));
        expect(store.sessions, hasLength(1));
        expect(store.sessions.single.drillId, 'deltoids-A');
        expect(store.sessions.single.pain, isTrue);
        expect(store.sessions.single.completed, isFalse);
        expect(find.text('已保存在本机'), findsOneWidget);
        await tapVisible(tester, find.widgetWithText(FilledButton, '完成'));
        await tester.pumpAndSettle();
        await tester.tap(find.byTooltip('返回'));
        await tester.pumpAndSettle();
        expect(find.byType(DrillDetailPage), findsNothing);
        expect(scene.selected, 'deltoids');
        expect(scene.detail, 'deltoids');
        expect(scene.detailModel, 'muscles');
        expect(find.byKey(const ValueKey('detail-model')), findsNothing);
        expect(scene.time, 2.0);
        expect(scene.playing, isFalse);
        expect(store.lastTime, 2.0);
        assertNoFlutterError(tester);

        await tester.tap(labeledControl('返回同一帧'));
        await tester.pumpAndSettle();
        expect(scene.time, 2.0);
        expect(scene.playing, isFalse);
        expect(scene.detail, isNull);
        expect(scene.detailModel, 'motion');
        expect(scene.selected, 'deltoids');
        assertLeanHome(tester);
        expect(find.text('2.0 / 9.0 s'), findsOneWidget);
        // An old state acknowledgement is not a new user selection.
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'state',
          'time': 2.0,
          'playing': false,
          'selected': 'deltoids',
          'detail': false,
        });
        await tester.pumpAndSettle();
        expect(scene.detail, isNull);
        assertLeanHome(tester);
        // A later real hotspot for the retained muscle must still open.
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'select',
          'time': 2.0,
          'groupId': 'deltoids',
        });
        await tester.pumpAndSettle();
        expect(scene.detail, 'deltoids');
        expect(scene.detailModel, 'motion');
        await tester.tap(labeledControl('返回同一帧'));
        await tester.pumpAndSettle();
        expect(scene.detail, isNull);
        expect(scene.selected, 'deltoids');
        await tester.tap(labeledControl('播放'));
        await tester.pumpAndSettle();
        expect(scene.selected, isNull);
        expect(scene.playing, isTrue);
        expect(scene.time, 2.0);
        await tester.tap(labeledControl('更多'));
        await tester.pumpAndSettle();
        await tester.tap(find.widgetWithText(ListTile, '记录'));
        await tester.pumpAndSettle();
        expect(find.text('记录了不适'), findsOneWidget);
        expect(
          find.text(catalog.drillById('deltoids-A')!.name),
          findsOneWidget,
        );
        final restored = LearningStore(catalog: catalog, storage: storage);
        await restored.initialize();
        expect(restored.sessions, hasLength(1));
        expect(restored.todayIds, ['deltoids-A']);
        expect(restored.sessions.single.pain, isTrue);
        restored.dispose();
        assertNoFlutterError(tester);
        await tester.pumpWidget(const SizedBox());
      } finally {
        semantics.dispose();
      }
    },
  );

  testWidgets(
    'thumbnail model state updates deep location note without adding model buttons',
    (tester) async {
      await phoneSize(tester);
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
      final scene = SceneController();
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
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'ready',
        'time': 2.0,
        'period': 9.0,
        'phase': {'source': 11},
      });
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'select',
        'time': 2.0,
        'groupId': 'rotator-cuff',
      });
      await tester.pumpAndSettle();

      for (final size in const [Size(390, 844), Size(320, 700)]) {
        tester.view.physicalSize = size;
        await tester.pumpAndSettle();
        expect(find.byKey(const ValueKey('detail-model')), findsNothing);
        expect(find.text('动作白膜'), findsNothing);
        expect(find.text('肌群模型'), findsNothing);
        expect(
          tester.getSize(find.byKey(const ValueKey('detail-card'))),
          const Size(86, 108),
        );
        expect(scene.detailModel, 'motion');
        expect(find.text('深层肌群 · 颜色示意所在部位'), findsOneWidget);
        expect(find.text('深层肌群 · 斜线示意所在部位'), findsNothing);
        assertNoFlutterError(tester);
      }
      final generation = scene.selectionGeneration;
      expect(find.byKey(const ValueKey('train-group')), findsOneWidget);
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'time': 2.0,
        'playing': false,
        'selected': 'rotator-cuff',
        'detail': true,
        'detailModel': 'muscles',
      });
      await tester.pumpAndSettle();
      expect(scene.detailModel, 'muscles');
      expect(scene.detail, 'rotator-cuff');
      expect(scene.selected, 'rotator-cuff');
      expect(scene.time, 2.0);
      expect(scene.selectionGeneration, generation);
      expect(find.text('深层肌群 · 斜线示意所在部位'), findsOneWidget);
      expect(find.text('深层肌群 · 颜色示意所在部位'), findsNothing);
      expect(find.byKey(const ValueKey('detail-model')), findsNothing);
      expect(find.byKey(const ValueKey('train-group')), findsOneWidget);
      assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets(
    'inactive iframe focus keeps detail visible while hidden stops it and resumed restores paused',
    (tester) async {
      await phoneSize(tester);
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      addTearDown(
        () => tester.binding.handleAppLifecycleStateChanged(
          AppLifecycleState.resumed,
        ),
      );
      final store = LearningStore(
        catalog: catalog,
        storage: MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
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
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'ready',
        'time': 0.0,
        'period': 9.0,
        'phase': {'source': 11},
      });
      await tester.pumpAndSettle();
      expect(scene.playing, isTrue);
      // Moving focus to the embedded scene must pause without hiding it.
      commands.clear();
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.inactive);
      await tester.pump();
      expect(scene.playing, isFalse);
      expect(scene.time, 2.375);
      expect(commands, contains(equals({'type': 'pause'})));
      expect(
        commands.where((command) => command['type'] == 'visibility'),
        isEmpty,
      );
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'select',
        'time': 2.375,
        'groupId': 'triceps',
      });
      await tester.pumpAndSettle();
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'state',
        'time': 2.375,
        'playing': false,
        'selected': 'triceps',
        'detail': true,
        'detailModel': 'muscles',
      });
      await tester.pumpAndSettle();
      expect(scene.detail, 'triceps');
      expect(scene.detailModel, 'muscles');
      expect(
        commands.where(
          (command) =>
              command['type'] == 'visibility' && command['visible'] == false,
        ),
        isEmpty,
      );
      await tester.pump(const Duration(seconds: 2));
      expect(scene.time, 2.375);
      expect(store.lastTime, 2.375);
      assertNoFlutterError(tester);

      for (final state in const [
        AppLifecycleState.hidden,
        AppLifecycleState.paused,
        AppLifecycleState.detached,
      ]) {
        commands.clear();
        tester.binding.handleAppLifecycleStateChanged(state);
        await tester.pump();
        expect(commands.last, {'type': 'visibility', 'visible': false});
        expect(scene.playing, isFalse);
        expect(scene.time, 2.375);
        expect(scene.detail, 'triceps');
        expect(scene.detailModel, 'muscles');
      }
      commands.clear();
      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pumpAndSettle();
      expect(commands.last, {'type': 'visibility', 'visible': true});
      expect(scene.playing, isFalse);
      expect(scene.time, 2.375);
      expect(scene.selected, 'triceps');
      expect(scene.detail, 'triceps');
      expect(scene.detailModel, 'muscles');
      expect(find.byKey(const ValueKey('detail-model')), findsNothing);
      assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
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

        await tester.tap(labeledControl('路径'));
        await tester.pumpAndSettle();
        expect(find.byType(PathPage), findsOneWidget);
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
        scene.play();
        await tester.pump();
        await tester.dragFrom(
          Offset(bounds.left + bounds.width * .25, bounds.center.dy),
          Offset(bounds.width * .5, 0),
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

  testWidgets(
    'expert self-assessment uses five original items and exact dips counts',
    (tester) async {
      await phoneSize(tester);
      final storage = MemoryStateStorage();
      final store = LearningStore(catalog: catalog, storage: storage);
      await store.initialize();
      addTearDown(store.dispose);
      Map<String, int>? saved;
      await tester.pumpWidget(
        testApp(
          Scaffold(
            body: SafeArea(
              child: AssessmentPage(
                initialGrades: {
                  for (final id in LearningStore.assessmentIds) id: 2,
                },
                onSave: (grades) async {
                  saved = grades;
                  await store.recordAssessment(grades);
                },
                onSkip: () async {},
                onBack: () {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      // Five four-step selectors with short labels; the full wording of the
      // chosen step sits under each and is what a screen reader hears.
      expect(find.byType(FlareSegmented<int>), findsNWidgets(5));
      await tester.scrollUntilVisible(find.text('13+'), 200);
      await tester.pumpAndSettle();
      for (final label in ['0–3', '4–7', '8–12', '13+']) {
        expect(find.text(label), findsOneWidget);
      }
      expect(find.text('4–7 次 · 基础'), findsOneWidget);
      expect(find.bySemanticsLabel('8–12 次 · 良好'), findsOneWidget);
      await tester.tap(find.text('8–12'));
      await tester.pumpAndSettle();
      expect(find.text('8–12 次 · 良好'), findsOneWidget);
      expect(find.text('4–7 次 · 基础'), findsNothing);
      await tapVisible(tester, find.widgetWithText(FilledButton, '保存自评起点'));
      await tester.pumpAndSettle();
      expect(saved!.keys.toSet(), {
        'wrist',
        'pike',
        'straddle',
        'dips',
        'lsit',
      });
      expect(saved!['dips'], 3);
      expect(store.assessmentGrades, saved);
      expect(store.startStage, 2);
      final restored = LearningStore(catalog: catalog, storage: storage);
      await restored.initialize();
      expect(restored.assessmentGrades['dips'], 3);
      expect(
        restored.assessmentGrades.keys.toSet(),
        LearningStore.assessmentIds,
      );
      restored.dispose();
      assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets(
    'real rep drill completes three sets and saves only one completed local record',
    (tester) async {
      await phoneSize(tester);
      final storage = MemoryStateStorage();
      final store = LearningStore(catalog: catalog, storage: storage);
      await store.initialize();
      final drill = catalog.drillById('triceps-A')!;
      var closed = false;
      addTearDown(store.dispose);
      await tester.pumpWidget(
        testApp(
          Scaffold(
            body: SafeArea(
              child: TrainingTimerPage(
                drill: drill,
                store: store,
                onClose: () => closed = true,
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      await tapVisible(tester, find.widgetWithText(FilledButton, '开始'));
      for (var set = 1; set <= 3; set++) {
        // Stopwatch intentionally uses real monotonic time, unlike WidgetTester's
        // fake Timer clock. Wait one bounded countdown, then drive the UI poll.
        await tester.runAsync(() async {
          await Future<void>.delayed(const Duration(milliseconds: 3100));
        });
        await tester.pump(const Duration(milliseconds: 150));
        expect(find.text('第 $set 组 / 共 3 组'), findsOneWidget);
        for (var rep = 0; rep < drill.dose.min; rep++) {
          await tapVisible(tester, find.widgetWithText(FilledButton, '完成 1 次'));
        }
        await tester.pump(const Duration(milliseconds: 150));
        assertNoFlutterError(tester);
        if (set < 3) {
          expect(find.text('秒 · 组间休息'), findsOneWidget);
          await tapVisible(tester, find.text('结束休息'));
        }
      }
      await tester.pump(const Duration(milliseconds: 150));
      expect(store.sessions, hasLength(1));
      expect(store.sessions.single.drillId, 'triceps-A');
      expect(store.sessions.single.completedSets, 3);
      expect(store.sessions.single.completed, isTrue);
      expect(store.sessions.single.pain, isFalse);
      expect(find.text('已保存在本机'), findsOneWidget);
      await tester.pump(const Duration(milliseconds: 450));
      expect(
        store.sessions,
        hasLength(1),
        reason: 'Periodic finish polls must not append another session',
      );
      await tapVisible(tester, find.widgetWithText(FilledButton, '完成'));
      expect(closed, isTrue);
      final restored = LearningStore(catalog: catalog, storage: storage);
      await restored.initialize();
      expect(restored.sessions.single.completedSets, 3);
      restored.dispose();
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
    await tester.tap(find.widgetWithText(ListTile, '设置'));
    await tester.pumpAndSettle();
    expect(find.text('跟随系统'), findsOneWidget);
    await tester.tap(find.text('浅色'));
    await tester.pumpAndSettle();
    expect(store.settings.themeMode, 'light');
    expect(FlareColors.palette.isDark, isFalse);
    // The system was already light: the first appearance is applied as is.
    expect(commands.lastWhere((value) => value['type'] == 'theme'), {
      'type': 'theme',
      'value': 'light',
    });
    assertNoFlutterError(tester);
    await tester.tap(find.text('深色'));
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
