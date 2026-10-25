import 'dart:async';

import 'package:flare/coach/plan_mapping.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/drill_media.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/drill_media/media_controller.dart';
import 'package:flare/platform/drill_media/media_view.dart';
import 'package:flare/ui/drill_media.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';
import 'sdk_plan_preservation_test.dart' show segmentedPlan;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    await DrillMedia.load();
  });
  final catalog = loadCatalogFixture();
  final drills = [
    catalog.drillById('scapular-A')!,
    catalog.drillById('triceps-A')!,
  ];

  Future<void> show(
    WidgetTester tester, {
    Size size = const Size(390, 844),
    double scale = 1,
    Brightness brightness = Brightness.light,
    uc.TrainingPlan? plan,
    List<Drill>? shown,
    VoidCallback? onStart,
    VoidCallback? onSave,
    ValueChanged<Drill>? onDrill,
  }) async {
    tester.view.physicalSize = size;
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    addTearDown(() => FlareColors.use(Brightness.dark));
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(brightness),
        locale: const Locale('zh'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        builder: (context, child) {
          FlareColors.use(brightness);
          return MediaQuery(
            data: MediaQuery.of(
              context,
            ).copyWith(textScaler: TextScaler.linear(scale)),
            child: child!,
          );
        },
        home: Scaffold(
          body: SafeArea(
            bottom: false,
            child: PlanDetailPage(
              title: '托马斯支撑与肩胛控制训练',
              line: '按原顺序逐项练习，先看动作要点，再前往完整训练。',
              drills: shown ?? drills,
              catalog: catalog,
              sdkPlan: plan,
              onBack: () {},
              onStart: onStart ?? () {},
              onSaveAsMine: onSave,
              onDrill: onDrill ?? (_) {},
            ),
          ),
        ),
      ),
    );
    // FutureBuilder subscribes after mounting; let the cached asset Future's
    // real-zone callbacks complete before flushing the widget test's frames.
    await tester.runAsync(DrillMedia.load);
    await tester.pumpAndSettle();
  }

  Finder key(String value) => find.byKey(ValueKey(value));
  final article = key('plan-article');
  final start = key('plan-start');

  for (final (size, scale, brightness) in [
    (const Size(320, 700), 1.0, Brightness.light),
    (const Size(390, 844), 1.0, Brightness.dark),
  ]) {
    testWidgets('article wraps at $size / $scale with a fixed readable CTA', (
      tester,
    ) async {
      var saves = 0;
      Drill? opened;
      await show(
        tester,
        size: size,
        scale: scale,
        brightness: brightness,
        onSave: () => saves++,
        onDrill: (drill) => opened = drill,
      );
      final title = tester.widget<Text>(key('plan-article-title'));
      expect(title.data, '托马斯支撑与肩胛控制训练');
      expect(title.maxLines, isNull);
      expect(find.text('按原顺序逐项练习，先看动作要点，再前往完整训练。'), findsOneWidget);
      expect(find.byType(DrillMediaCard), findsWidgets);
      expect(
        tester
            .widgetList<DrillMediaCard>(find.byType(DrillMediaCard))
            .every((card) => !card.autoPlay),
        isTrue,
      );
      final actionRect = tester.getRect(start);
      expect(actionRect.right, lessThanOrEqualTo(size.width - 15));
      expect(actionRect.bottom, lessThanOrEqualTo(size.height - 11));
      await tester.ensureVisible(key('plan-row-scapular-A'));
      await tester.pumpAndSettle();
      await tester.tap(key('plan-row-scapular-A'));
      expect(opened?.id, 'scapular-A');
      await tester.drag(article, const Offset(0, -5000));
      await tester.pumpAndSettle();
      await tester.ensureVisible(key('plan-save-as-mine'));
      await tester.pumpAndSettle();
      final scroll = tester.state<ScrollableState>(
        find.descendant(of: article, matching: find.byType(Scrollable)).first,
      );
      scroll.position.jumpTo(scroll.position.maxScrollExtent);
      await tester.pumpAndSettle();
      expect(tester.getRect(start), actionRect);
      expect(
        tester.getRect(key('plan-save-as-mine')).bottom,
        lessThanOrEqualTo(actionRect.top - 8),
      );
      await tester.tap(key('plan-save-as-mine'));
      expect(saves, 1);
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    });
  }

  testWidgets('article retains block rounds and each segment media and dose', (
    tester,
  ) async {
    final raw = segmentedPlan().toJson();
    final items = ((raw['blocks'] as List).single as Map)['items'] as List;
    final segments = (items.first as Map)['segments'] as List;
    (segments[1] as Map)['exerciseId'] = 'abs-A';
    final plan = const uc.PlanCodec().decode(raw);
    final before = plan.toJson();
    final entries = CoachPlanMapper(catalog).entries(plan);
    uc.TrainingPlan? handedOff;
    await show(
      tester,
      plan: plan,
      shown: [
        for (final item in plan.items) catalog.drillById(item.exerciseId)!,
      ],
      onStart: () => handedOff = plan,
    );
    final dose = tester.widget<Text>(key('plan-article-dose-0'));
    expect(dose.data, entries.first.doseText);
    expect(dose.data, contains('Y'));
    expect(dose.data, contains('T'));
    expect(dose.data, contains('W'));
    expect(dose.data, contains('停留 2 秒'));
    expect(
      tester.widget<Text>(key('plan-article-section-0')).data,
      contains('3'),
    );
    expect(
      tester
          .widgetList<DrillMediaCard>(find.byType(DrillMediaCard))
          .map((card) => card.drillId),
      containsAllInOrder(['scapular-A', 'abs-A', 'forearms-A']),
    );
    await tester.tap(start);
    await tester.pumpAndSettle();
    expect(handedOff!.toJson(), before);
    expect(plan.toJson(), before);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets(
    'scrolling a manual preview out stops it without starting another',
    (tester) async {
      await show(tester);
      final first = key('plan-article-media-0:parent');
      await tester.ensureVisible(first);
      await tester.pumpAndSettle();
      expect(tester.widget<DrillMediaCard>(first).active, isTrue);
      expect(tester.widget<DrillMediaCard>(first).autoPlay, isFalse);
      expect(find.byType(DrillMediaPlatformView), findsNothing);
      final mediaFuture = tester
          .widget<FutureBuilder<Map<String, DrillMedia>>>(
            find.descendant(
              of: first,
              matching: find.byType(FutureBuilder<Map<String, DrillMedia>>),
            ),
          )
          .future!;
      final media = await tester.runAsync(() => mediaFuture);
      expect(media, contains('scapular-A'));
      await tester.pumpAndSettle();
      DrillMediaController? openedController;
      State<DrillMediaPlatformView>? openedView;
      bool? requestedPlayback;
      await tester.tap(first);
      // Observe the real App view at its first frame, before the Windows test
      // host reports that it cannot decode an Android/iOS WebView video.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final view = find.descendant(
          of: first,
          matching: find.byType(DrillMediaPlatformView),
        );
        if (view.evaluate().length == 1) {
          openedController = tester
              .widget<DrillMediaPlatformView>(view)
              .controller;
          requestedPlayback = openedController!.wantsPlay;
          openedView = tester.state(view);
        }
      });
      await tester.pump();
      expect(openedController, isNotNull);
      expect(requestedPlayback, isTrue);
      expect(openedView!.mounted, isTrue);
      expect(find.byType(DrillMediaPlatformView), findsOneWidget);
      await tester.drag(article, const Offset(0, -900));
      await tester.pumpAndSettle();
      if (first.evaluate().isNotEmpty) {
        expect(tester.widget<DrillMediaCard>(first).active, isFalse);
      }
      expect(openedView!.mounted, isFalse);
      expect(
        () => openedController!.addListener(() {}),
        throwsFlutterError,
        reason: 'The off-screen preview controller must be disposed',
      );
      expect(find.byType(DrillMediaPlatformView), findsNothing);
      expect(
        tester
            .widgetList<DrillMediaCard>(find.byType(DrillMediaCard))
            .every((card) => !card.autoPlay),
        isTrue,
      );
      await tester.scrollUntilVisible(
        first,
        -350,
        scrollable: find
            .descendant(of: article, matching: find.byType(Scrollable))
            .first,
      );
      await tester.pumpAndSettle();
      expect(tester.widget<DrillMediaCard>(first).active, isTrue);
      expect(find.byType(DrillMediaPlatformView), findsNothing);
      expect(
        find.descendant(
          of: first,
          matching: find.byIcon(Icons.play_arrow_rounded),
        ),
        findsOneWidget,
        reason: 'Returning shows the still frame and requires another tap',
      );
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets('training waits for preview disposal and its async callback', (
    tester,
  ) async {
    final training = Completer<void>();
    var starts = 0;
    var released = 0;
    await show(
      tester,
      onStart: () async {
        starts++;
        await training.future;
      },
    );
    final demo = key('plan-article-media-0:parent');
    await tester.ensureVisible(demo);
    await tester.pumpAndSettle();
    DrillPlaybackCoordinator.shared.claim(Object(), () => released++);
    await tester.tap(start);
    // The callback cannot run before the frame that deactivates previews.
    expect(starts, 0);
    expect(released, 1);
    await tester.pump();
    expect(starts, 1);
    expect(tester.widget<FilledButton>(start).onPressed, isNull);
    expect(tester.widget<DrillMediaCard>(demo).active, isFalse);
    expect(FlarePageActivity.of(tester.element(demo)), isFalse);
    await tester.pump(const Duration(seconds: 1));
    expect(tester.widget<FilledButton>(start).onPressed, isNull);
    expect(FlarePageActivity.of(tester.element(demo)), isFalse);
    training.complete();
    await tester.pumpAndSettle();
    expect(tester.widget<FilledButton>(start).onPressed, isNotNull);
    expect(FlarePageActivity.of(tester.element(demo)), isTrue);
    expect(starts, 1);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('unavailable plan never displays a partial article or starts', (
    tester,
  ) async {
    var starts = 0;
    final plan = uc.TrainingPlan(
      id: 'unavailable',
      source: 'ai',
      title: 'Unavailable',
      goal: 'strength',
      scene: 'home',
      level: 1,
      targetMinutes: 5,
      blocks: const [
        uc.PlanBlock(
          id: 'block',
          name: 'Main',
          type: uc.BlockType.main,
          items: [
            uc.PlanItem(
              exerciseId: 'unknown-media',
              mode: uc.DoseMode.time,
              sets: 1,
              workSeconds: 20,
              perSide: false,
              restSeconds: 20,
            ),
          ],
        ),
      ],
    );
    await show(tester, plan: plan, onStart: () => starts++);
    expect(find.byType(DrillMediaCard), findsNothing);
    expect(tester.widget<FilledButton>(start).onPressed, isNull);
    expect(starts, 0);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });
}
