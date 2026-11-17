import 'dart:convert';
import 'dart:ui' as ui;

import 'package:flare/control/flare_membership.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/trainer/flare_plan_resume.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart' show FlareSegmented;
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/flare_membership_page.dart';
import 'package:flare/ui/flare_training_hub_page.dart';
import 'package:flare/ui/motion.dart' show FlarePressable;
import 'package:flare/ui/motion_controls.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/trainer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

import 'flow_regressions_test.dart' as helpers;

Finder _key(String value) => find.byKey(ValueKey(value));

Finder _hubPlanAction(WidgetTester tester, String name) {
  final strings = AppLocalizations.of(tester.element(_key('training-hub')));
  return find.bySemanticsLabel(strings.hubViewNamedPlan(name));
}

Finder _detailScroll() => find.descendant(
  of: find.byType(FlarePlanDetailPage),
  matching: find.byWidgetPredicate(
    (widget) =>
        widget is Scrollable &&
        axisDirectionToAxis(widget.axisDirection) == Axis.vertical,
  ),
);

Future<void> _revealPlanContent(WidgetTester tester, Finder finder) async {
  if (finder.evaluate().isEmpty) {
    await tester.scrollUntilVisible(finder, 200, scrollable: _detailScroll());
  }
  await Scrollable.ensureVisible(tester.element(finder), alignment: .25);
  await tester.pumpAndSettle();
}

Future<void> _showPlanTop(WidgetTester tester) async {
  final position = tester.state<ScrollableState>(_detailScroll()).position;
  position.jumpTo(position.minScrollExtent);
  await tester.pumpAndSettle();
}

Future<void> _expectScrollNavFade(WidgetTester tester, Finder page) async {
  final mask = find.descendant(
    of: page,
    matching: _key('flare-nav-frost-clip'),
  );
  final backChip = find.descendant(
    of: page,
    matching: find.byType(FlareBackChip),
  );
  final scrollView = find.descendant(
    of: page,
    matching: find.byWidgetPredicate(
      (widget) =>
          widget is Scrollable &&
          axisDirectionToAxis(widget.axisDirection) == Axis.vertical,
    ),
  );
  final scroll = tester.state<ScrollableState>(scrollView).position;
  final safeTop = MediaQuery.viewPaddingOf(tester.element(mask)).top;
  final backRect = tester.getRect(backChip);
  final maskRect = tester.getRect(mask);

  expect(maskRect.top, 0);
  expect(maskRect.height, safeTop + 44 + 24);
  expect(backRect.top, safeTop);
  expect(
    find.descendant(of: mask, matching: find.byType(BackdropFilter)),
    findsNothing,
  );
  await tester.dragFrom(Offset(300, safeTop + 8), const Offset(0, -120));
  await tester.pumpAndSettle();
  expect(scroll.pixels, greaterThan(8));
  expect(tester.getRect(mask), maskRect);
  expect(tester.getRect(backChip), backRect);
  expect(backChip.hitTestable(), findsOneWidget);

  scroll.jumpTo(0);
  await tester.pumpAndSettle();
  expect(tester.getRect(mask), maskRect);
}

Finder _tier(String label) =>
    find.descendant(of: _key('flare-plan-tier'), matching: find.text(label));

Finder _rowText(Finder row, String text) =>
    find.descendant(of: row, matching: find.text(text, findRichText: true));

void _expectPlanMinutes(WidgetTester tester, int minutes) {
  final start = _key('flare-plan-start');
  final strings = AppLocalizations.of(tester.element(start));
  expect(
    find.descendant(
      of: start,
      matching: find.textContaining(
        strings.minutesShort(minutes),
        findRichText: true,
      ),
    ),
    findsWidgets,
  );
}

class _MembershipStore implements MembershipStore {
  DateTime? expiresAt;

  @override
  Future<MembershipSnapshot> refresh() async =>
      MembershipSnapshot('tester', expiresAt);

  @override
  Future<List<MembershipOffer>> offers() async => const [];

  @override
  Future<MembershipSnapshot?> purchase(MembershipTerm term) async => null;

  @override
  Future<MembershipSnapshot> restore() {
    expiresAt = DateTime.now().add(const Duration(days: 1));
    return refresh();
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late Catalog catalog;
  late Catalog pilotCatalog;
  final previousShared = FlareShared.current;
  final previousUpdateStore = PoseHubCatalogUpdates.activeStore;

  setUpAll(() async {
    PoseHubCatalogUpdates.activeStore = null;
    FlareShared.current = await FlareShared.load();
    catalog = await Catalog.load();
    Future<Map<String, dynamic>> loadData(String name) async =>
        jsonDecode(await rootBundle.loadString('assets/data/$name.json'))
            as Map<String, dynamic>;
    final planData = await loadData('flare-plans');
    final pilotPlans = (planData['plans'] as List).where((plan) {
      final target = (plan as Map)['target'];
      return target == 11 || target == 'deltoids';
    }).toList();
    pilotCatalog = Catalog.fromJson(
      phaseMuscles: await loadData('phase-muscles'),
      drillLibrary: await loadData('drills'),
      curriculum: await loadData('course-stages'),
      manifest: await loadData('source-manifest'),
      flarePlans: {'version': 1, 'plans': pilotPlans},
    );
  });

  tearDownAll(() {
    FlareShared.current = previousShared;
    PoseHubCatalogUpdates.activeStore = previousUpdateStore;
  });

  Future<({SceneController scene, LearningStore store})> mountShell(
    WidgetTester tester, {
    FlareMembership? membership,
    bool realPlayer = false,
    Catalog? testCatalog,
  }) async {
    final shellCatalog = testCatalog ?? catalog;
    await helpers.phoneSize(tester);
    final store = LearningStore(
      catalog: shellCatalog,
      storage: helpers.MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    if (realPlayer) await store.updateSettings(sound: false);
    final scene = SceneController(commandSink: (_) {});
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    await tester.pumpWidget(
      helpers.testApp(
        FlareShell(
          catalog: shellCatalog,
          store: store,
          sceneController: scene,
          enableScene: false,
          membership: membership,
          trainingPageBuilder: realPlayer
              ? (plan) => FlareTrainingPage(
                  plan: plan,
                  catalog: shellCatalog,
                  store: store,
                  voiceOutput: sdk.MutedVoiceOutput(),
                  keepAlive: false,
                )
              : helpers.TrainingRouteProbe.new,
        ),
      ),
    );
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'ready',
      'time': 0.0,
      'period': shellCatalog.period,
      'phase': {'source': 9},
    });
    await tester.pumpAndSettle();
    return (scene: scene, store: store);
  }

  Future<void> showPhase(
    WidgetTester tester,
    SceneController scene,
    int source, {
    bool playing = false,
  }) async {
    final time = catalog.phaseKeys
        .firstWhere((key) => key.source == source)
        .time;
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'time': time,
      'playing': playing,
      'phase': {'source': source},
    });
    await tester.pumpAndSettle();
    expect(scene.phase, source);
    expect(scene.playing, playing);
  }

  Future<void> back(WidgetTester tester) async {
    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
  }

  Future<void> openHub(WidgetTester tester) async {
    await tester.tap(_key('home-menu-chip'));
    await tester.pumpAndSettle();
    await tester.tap(_key('more-library'));
    await tester.pumpAndSettle();
    expect(_key('training-hub'), findsOneWidget);
  }

  testWidgets('plans opens both hub modes and returns to the plans page', (
    tester,
  ) async {
    await mountShell(tester);
    await helpers.openPlansFromHome(tester);
    final root = find.byType(PlansPage);
    await _expectScrollNavFade(tester, root);
    final strings = AppLocalizations.of(tester.element(root));
    expect(find.text(strings.plansMine), findsOneWidget);
    expect(find.text(strings.plansReady), findsNothing);
    final hub = find.byType(FlareTrainingHubPage);
    for (final (link, mode) in [
      ('plan-all-angles', 'hub-angle-mode'),
      ('plan-all-muscles', 'hub-muscle-mode'),
    ]) {
      await tester.scrollUntilVisible(
        _key(link),
        250,
        scrollable: find.byWidgetPredicate(
          (widget) =>
              widget is Scrollable &&
              widget.axisDirection == AxisDirection.down,
        ),
      );
      await tester.tap(_key(link));
      await tester.pumpAndSettle();
      expect(hub, findsOneWidget);
      expect(tester.widget<FlarePressable>(_key(mode)).selected, isTrue);
      await back(tester);
      expect(hub, findsNothing);
      expect(root, findsOneWidget);
    }
    helpers.assertNoFlutterError(tester);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('plans continues the recorded angle and scene at the next move', (
    tester,
  ) async {
    final mounted = await mountShell(tester);
    const phaseSource = 15;
    final phase = catalog.phaseBySource(phaseSource)!;
    final authored = catalog
        .plansForAngle(phaseSource)
        .singleWhere((plan) => plan.tier == 2);
    final shared = FlareShared.current!;
    final original = trainingPlanFromFlarePlan(
      plan: authored,
      title: phase.name,
      sceneTier: 'A',
      catalog: catalog,
      sourceCatalog: shared.catalog,
      rhythms: shared.rhythms,
    );
    final recorded = FlarePlanResume.recordAuthored(
      original,
      phaseSource: phaseSource,
      sceneTier: 'A',
    );
    final begin = DateTime.utc(2026, 11, 16, 12);
    await mounted.store.saveTrainerSession(
      sdk.SessionResult(
        sessionId: 'angle-progress',
        planId: recorded.id,
        planTitle: phase.name,
        startedAt: begin,
        endedAt: begin.add(const Duration(minutes: 1)),
        activeSeconds: 60,
        endedEarly: true,
        completedExercises: 1,
        totalExercises: original.items.length,
        items: [
          for (final (index, item) in original.items.indexed)
            sdk.ItemResult(
              exerciseId: item.exerciseId,
              replacedFrom: item.replacedFrom,
              blockIndex: 0,
              itemInBlock: index,
              plannedSets: item.sets,
              completedSets: index == 0 ? item.sets : 0,
              activeSeconds: index == 0 ? 60 : 0,
              status: index == 0
                  ? sdk.ItemStatus.completed
                  : sdk.ItemStatus.notReached,
            ),
        ],
      ),
    );
    await mounted.store.updateSettings(tier: 'C');
    await helpers.openPlansFromHome(tester);
    final art = tester.widget<Image>(
      find.descendant(
        of: _key('plan-last-session'),
        matching: find.byType(Image),
      ),
    );
    expect((art.image as AssetImage).assetName, 'assets/angles/phase-15.png');
    await tester.tap(_key('plan-continue'));
    await helpers.waitForTrainingRoute(tester);
    final delivered = tester
        .widget<helpers.TrainingRouteProbe>(
          find.byType(helpers.TrainingRouteProbe),
        )
        .plan;
    expect(
      delivered.items.map((item) => item.exerciseId),
      original.items.skip(1).map((item) => item.exerciseId),
    );
    expect(delivered.items.first.sets, original.items.elementAt(1).sets);
    expect(mounted.store.settings.tier, 'C');
    await tester.tap(_key('training-probe-close'));
    await tester.pumpAndSettle();
    expect(find.byType(PlansPage), findsOneWidget);
    helpers.assertNoFlutterError(tester);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('training and plan detail cover the page without a dim layer', (
    tester,
  ) async {
    final mounted = await mountShell(tester);
    await showPhase(tester, mounted.scene, 11);
    final hub = _key('training-hub');
    final detail = find.byType(FlarePlanDetailPage);
    final menu = _key('more-library');
    final barrier = find.byType(AnimatedModalBarrier);

    await tester.tap(_key('home-menu-chip'));
    await tester.pumpAndSettle();
    expect(barrier, findsOneWidget);
    await tester.tap(menu);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 60));
    expect(menu, findsNothing);
    expect(barrier, findsNothing);
    expect(tester.getTopLeft(hub).dx, greaterThan(0));
    final homeLayer = find.byKey(const ValueKey<Object>('watch'));
    expect(tester.getTopLeft(homeLayer).dx, 0);
    final homeShade = find.descendant(
      of: homeLayer,
      matching: find.byType(ColoredBox),
    );
    expect(tester.widget<ColoredBox>(homeShade).color, Colors.transparent);
    await tester.pumpAndSettle();

    final button = tester.getRect(_key('hub-view-plan'));
    await tester.tapAt(Offset(button.left + 16, button.center.dy));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 60));
    expect(tester.getTopLeft(detail).dx, greaterThan(0));
    expect(tester.getTopLeft(hub).dx, 0);
    await tester.pumpAndSettle();

    await tester.binding.handlePopRoute();
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 60));
    expect(tester.getTopLeft(detail).dx, greaterThan(0));
    expect(tester.getTopLeft(hub).dx, 0);
    await tester.pumpAndSettle();
    expect(detail, findsNothing);
  });

  testWidgets('the muscle tab accepts an early tap and keeps the canvas size', (
    tester,
  ) async {
    final sceneBounds = GlobalKey();
    Widget hub(bool locked) => helpers.testApp(
      Scaffold(
        body: FlareTrainingHubPage(
          catalog: catalog,
          actorBody: 'original',
          quality: 'balanced',
          enableScene: false,
          initialTime: catalog.phaseTime(9),
          visible: true,
          interactionLocked: locked,
          sceneBoundsKey: sceneBounds,
          onBack: () {},
          onAngle: (_) {},
          onMuscle: (_) {},
        ),
      ),
    );
    await helpers.phoneSize(tester);
    await tester.pumpWidget(hub(true));
    await tester.pumpAndSettle();
    final bounds = tester.getRect(find.byKey(sceneBounds));
    final muscle = _key('hub-muscle-mode');
    await tester.tap(muscle);
    await tester.pumpAndSettle();
    expect(tester.widget<FlarePressable>(muscle).selected, isTrue);
    expect(_key('hub-timeline'), findsOneWidget);
    await tester.pumpWidget(hub(false));
    await tester.pumpAndSettle();
    expect(_key('hub-timeline'), findsNothing);
    expect(tester.getRect(find.byKey(sceneBounds)), bounds);
    await tester.tap(_key('hub-angle-mode'));
    await tester.pumpAndSettle();
    expect(_key('hub-timeline'), findsOneWidget);
    expect(tester.getRect(find.byKey(sceneBounds)), bounds);
  });

  testWidgets('training starts on the paused home frame and its phase', (
    tester,
  ) async {
    final mounted = await mountShell(tester);
    final time = catalog.phaseTime(12) + .1;
    mounted.scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'time': time,
      'playing': false,
      'phase': {'source': 12},
    });
    await tester.pumpAndSettle();
    await openHub(tester);
    final timeline = tester.widget<MotionTimeline>(_key('hub-timeline'));
    expect(timeline.phase, 12);
    expect(timeline.time, time);
  });

  testWidgets('angle mode snaps on release and retains its selection', (
    tester,
  ) async {
    final mounted = await mountShell(tester);
    await showPhase(tester, mounted.scene, 11);
    tester.view.physicalSize = const Size(360, 800);
    tester.view.viewPadding = const FakeViewPadding(bottom: 24);
    addTearDown(tester.view.resetViewPadding);
    await tester.pumpAndSettle();
    await openHub(tester);
    final hub = _key('training-hub');
    final timeline = _key('hub-timeline');
    final viewPlan = _key('hub-view-plan');
    final strings = AppLocalizations.of(tester.element(hub));
    MotionTimeline currentTimeline() => tester.widget<MotionTimeline>(timeline);
    Offset positionInStage(int source, {double towardNext = 0}) {
      final rect = tester.getRect(timeline);
      const endpointInset = 12.0;
      final step = (rect.width - endpointInset * 2) / 7;
      final x = endpointInset + (source - 9 + towardNext) * step;
      return Offset(rect.left + x, rect.center.dy);
    }

    expect(currentTimeline().phase, 11);
    expect(currentTimeline().time, catalog.phaseTime(11));
    expect(
      find.descendant(
        of: timeline,
        matching: find.textContaining(RegExp(r'^\d{2}$')),
      ),
      findsNothing,
    );
    final slider = tester
        .getSemantics(find.bySemanticsLabel(strings.timeline))
        .getSemanticsData();
    expect(slider.flagsCollection.isSlider, isTrue);
    expect(slider.hasAction(ui.SemanticsAction.increase), isTrue);
    expect(slider.hasAction(ui.SemanticsAction.decrease), isTrue);
    final phase = catalog.phaseBySource(11)!;
    expect(find.text('11 · ${phase.detail}'), findsOneWidget);
    expect(find.text(strings.hubPhase11Caption), findsOneWidget);
    expect(find.text(strings.hubPrimaryMuscles), findsOneWidget);
    final primaryMuscle = catalog.groupById(phase.primary.first.id)!;
    final primaryPill = find.text(primaryMuscle.shortLabel);
    expect(primaryPill, findsOneWidget);
    expect(
      tester
          .getSemantics(primaryPill)
          .getSemanticsData()
          .hasAction(ui.SemanticsAction.tap),
      isFalse,
    );
    final planAction = _hubPlanAction(tester, phase.name);
    expect(planAction.hitTestable(), findsOneWidget);
    expect(_rowText(hub, strings.hubSpecializedPlan), findsOneWidget);
    final planMinutes = find.text(
      '${strings.hubMinutesFrom(20)} · '
      '${strings.planDrillCount(catalog.plansForAngle(11).first.items.length)} · '
      '${strings.hubThreeTiers}',
    );
    expect(planMinutes, findsOneWidget);
    expect(
      tester.getTopRight(planMinutes).dx,
      closeTo(tester.getTopRight(viewPlan).dx, .1),
    );
    expect(
      tester
          .getSemantics(planAction)
          .getSemanticsData()
          .hasAction(ui.SemanticsAction.tap),
      isTrue,
    );

    final scrub = await tester.startGesture(positionInStage(11));
    await scrub.moveTo(positionInStage(12));
    await scrub.moveTo(positionInStage(12, towardNext: .22));
    await tester.pumpAndSettle();
    expect(currentTimeline().phase, 12);
    expect(currentTimeline().time, greaterThan(catalog.phaseTime(12)));
    await scrub.up();
    await tester.pumpAndSettle();
    expect(currentTimeline().time, catalog.phaseTime(12));
    expect(find.text(strings.hubPhase12Caption), findsOneWidget);
    expect(planAction, findsNothing);

    for (final phase in catalog.phases) {
      await tester.tapAt(positionInStage(phase.source));
      await tester.pumpAndSettle();
      expect(currentTimeline().phase, phase.source);
      expect(_hubPlanAction(tester, phase.name).hitTestable(), findsOneWidget);
      expect(find.text(strings.hubPlanComingSoon), findsNothing);
    }

    await tester.tapAt(positionInStage(15, towardNext: .22));
    await tester.pumpAndSettle();
    expect(currentTimeline().phase, 15);
    expect(currentTimeline().time, catalog.phaseTime(15));
    final button = tester.getRect(viewPlan);
    expect(button.height, 52);
    expect(button.left, 22);
    expect(360 - button.right, 22);
    expect(800 - button.bottom, 34 + 24);
    final oppositePhase = catalog.phaseBySource(15)!;
    final oppositePlanAction = _hubPlanAction(tester, oppositePhase.name);
    expect(oppositePlanAction.hitTestable(), findsOneWidget);
    await tester.tapAt(Offset(button.left + 16, button.center.dy));
    await tester.pumpAndSettle();
    final detail = find.byType(FlarePlanDetailPage);
    expect(
      tester.widget<FlarePlanDetailPage>(detail).title,
      oppositePhase.name,
    );
    expect(_key('flare-plan-angle-hero-15'), findsOneWidget);

    await back(tester);
    expect(hub, findsOneWidget);
    expect(currentTimeline().phase, 15);
    expect(oppositePlanAction.hitTestable(), findsOneWidget);

    await tester.tap(_key('hub-muscle-mode'));
    await tester.pumpAndSettle();
    await tester.tap(_key('hub-angle-mode'));
    await tester.pumpAndSettle();
    expect(currentTimeline().time, catalog.phaseTime(15));

    await tester.tap(find.bySemanticsLabel(strings.goBack).hitTestable());
    await tester.pumpAndSettle();
    expect(hub, findsNothing);
    expect(_key('home-menu-chip').hitTestable(), findsOneWidget);
    helpers.assertNoFlutterError(tester);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('muscle mode switches grids and keeps selections by section', (
    tester,
  ) async {
    await mountShell(tester);
    tester.view.physicalSize = const Size(360, 800);
    await tester.pumpAndSettle();
    await openHub(tester);
    final hub = _key('training-hub');
    final strings = AppLocalizations.of(tester.element(hub));
    await tester.tap(_key('hub-muscle-mode'));
    await tester.pumpAndSettle();

    void expectOnlySection(String section, int count) {
      final groups = catalog.groups.where((group) => group.section == section);
      expect(groups, hasLength(count));
      for (final group in catalog.groups) {
        expect(
          _key('hub-muscle-${group.id}'),
          group.section == section ? findsOneWidget : findsNothing,
        );
      }
      final first = tester.getRect(_key('hub-muscle-${groups.first.id}'));
      final second = tester.getRect(
        _key('hub-muscle-${groups.elementAt(1).id}'),
      );
      final third = tester.getRect(
        _key('hub-muscle-${groups.elementAt(2).id}'),
      );
      expect(first.height, 44);
      expect(first.width, second.width);
      expect(second.top, first.top);
      expect(second.left - first.right, 8);
      expect(third.top - first.bottom, 8);
    }

    final control = tester.widget<FlareSegmented<String>>(_key('hub-sections'));
    Finder sectionTab(String section) => find.bySemanticsLabel(
      control.segments.firstWhere((segment) => segment.$1 == section).$2,
    );

    Future<void> switchSection(String section) async {
      await tester.tap(sectionTab(section));
      await tester.pumpAndSettle();
    }

    bool selected(Finder tile) =>
        tester
            .getSemantics(tile)
            .getSemanticsData()
            .flagsCollection
            .isSelected ==
        ui.Tristate.isTrue;

    for (final (section, label, count) in [
      ('support', strings.hubSupportTab, '8'),
      ('core', strings.hubCoreTab, '4'),
      ('legs', strings.hubLegsTab, '5'),
    ]) {
      final tab = sectionTab(section);
      expect(find.text('$label  $count'), findsOneWidget);
      expect(selected(tab), section == 'support');
    }
    expectOnlySection('support', 8);
    final deltoids = _key('hub-muscle-deltoids');
    final deltoidsAction = _hubPlanAction(
      tester,
      catalog.groupById('deltoids')!.label,
    );
    expect(selected(deltoids), isTrue);
    expect(deltoidsAction.hitTestable(), findsOneWidget);
    final triceps = _key('hub-muscle-triceps');
    await tester.tap(triceps);
    await tester.pumpAndSettle();
    expect(selected(triceps), isTrue);
    final tricepsAction = _hubPlanAction(
      tester,
      catalog.groupById('triceps')!.label,
    );
    expect(tricepsAction.hitTestable(), findsOneWidget);

    await switchSection('core');
    expectOnlySection('core', 4);
    expect(selected(sectionTab('core')), isTrue);
    final firstCore = catalog.groups.firstWhere(
      (group) => group.section == 'core',
    );
    expect(selected(_key('hub-muscle-${firstCore.id}')), isTrue);

    await switchSection('legs');
    expectOnlySection('legs', 5);
    final lastMuscle = catalog.groups.lastWhere(
      (group) => group.section == 'legs',
    );
    final lastChip = _key('hub-muscle-${lastMuscle.id}');
    await tester.ensureVisible(lastChip);
    await tester.pumpAndSettle();
    expect(lastChip.hitTestable(), findsOneWidget);
    await tester.tap(lastChip);
    await tester.pumpAndSettle();
    expect(selected(lastChip), isTrue);
    expect(
      _hubPlanAction(tester, lastMuscle.label).hitTestable(),
      findsOneWidget,
    );

    await switchSection('support');
    expect(selected(triceps), isTrue);
    await switchSection('legs');
    expect(selected(lastChip), isTrue);
    for (final section in catalog.sections) {
      await switchSection(section.id);
      for (final group in catalog.groups.where(
        (g) => g.section == section.id,
      )) {
        final tile = _key('hub-muscle-${group.id}');
        await tester.ensureVisible(tile);
        await tester.pumpAndSettle();
        await tester.tap(tile);
        await tester.pumpAndSettle();
        expect(selected(tile), isTrue);
        expect(
          _hubPlanAction(tester, group.label).hitTestable(),
          findsOneWidget,
        );
        expect(find.text(strings.hubPlanComingSoon), findsNothing);
      }
    }
    await switchSection('support');
    await tester.ensureVisible(deltoids);
    await tester.pumpAndSettle();
    await tester.tap(deltoids);
    await tester.pumpAndSettle();
    await tester.tap(deltoidsAction);
    await tester.pumpAndSettle();
    expect(find.byType(FlarePlanDetailPage), findsOneWidget);

    await back(tester);
    expect(hub, findsOneWidget);
    expect(_key('hub-timeline'), findsNothing);
    expectOnlySection('support', 8);
    expect(selected(deltoids), isTrue);
    expect(deltoidsAction.hitTestable(), findsOneWidget);
    helpers.assertNoFlutterError(tester);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets(
    'home training opens the displayed support phase from play or pause',
    (tester) async {
      final scene = (await mountShell(tester)).scene;
      await showPhase(tester, scene, 9);
      expect(_key('home-phase-name'), findsOneWidget);
      expect(_key('home-plan-angle'), findsOneWidget);

      final training = _key('home-go-to-training');
      for (final (source, playing) in [(11, true), (15, false)]) {
        await showPhase(tester, scene, source, playing: playing);
        expect(
          _key('home-plan-angle'),
          playing ? findsNothing : findsOneWidget,
        );
        expect(find.widgetWithText(FlarePressable, '前往训练'), findsOneWidget);
        expect(tester.widget<FlarePressable>(training).semanticLabel, '前往训练');
        final time = scene.time;
        await tester.tap(training);
        await tester.pumpAndSettle();
        final detail = tester.widget<FlarePlanDetailPage>(
          find.byType(FlarePlanDetailPage),
        );
        expect(detail.title, catalog.phaseBySource(source)!.name);
        expect(detail.selectedTier, 1);
        expect(scene.playing, isFalse);
        expect(find.bySemanticsLabel('返回'), findsOneWidget);
        final hero = tester.widget<Image>(
          _key('flare-plan-angle-hero-$source'),
        );
        expect(
          (hero.image as AssetImage).assetName,
          'assets/angles/phase-$source.webp',
        );
        _expectPlanMinutes(tester, 20);
        expect(detail.plans.map((plan) => plan.id), [
          'angle-11-t1',
          'angle-11-t2',
          'angle-11-t3',
        ]);
        expect(find.text('发力肌群'), findsOneWidget);
        final plannedMuscle = _key('flare-plan-muscle-deltoids');
        final triceps = _key('flare-plan-muscle-triceps');
        expect(plannedMuscle.hitTestable(), findsOneWidget);
        expect(triceps.hitTestable(), findsOneWidget);
        expect(
          _rowText(plannedMuscle, catalog.groupById('deltoids')!.shortLabel),
          findsOneWidget,
        );
        expect(
          _rowText(triceps, catalog.groupById('triceps')!.shortLabel),
          findsOneWidget,
        );
        await tester.tap(plannedMuscle);
        await tester.pumpAndSettle();
        final muscle = tester.widget<FlarePlanDetailPage>(
          find.byType(FlarePlanDetailPage),
        );
        expect(muscle.title, catalog.groupById('deltoids')!.label);
        expect(muscle.plans.first.id, 'muscle-deltoids-t1');
        await _expectScrollNavFade(tester, find.byType(FlarePlanDetailPage));
        await back(tester);
        await back(tester);
        expect(training, findsOneWidget);
        expect(_key('home-plan-angle'), findsOneWidget);
        expect(scene.phase, source);
        expect(scene.time, time);
        expect(scene.playing, isFalse);
      }
      await tester.tap(_key('home-plan-angle'));
      await tester.pumpAndSettle();
      expect(
        tester
            .widget<FlarePlanDetailPage>(find.byType(FlarePlanDetailPage))
            .phase
            ?.source,
        15,
      );
      helpers.assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    },
  );

  testWidgets('train muscle opens a plan when present and library otherwise', (
    tester,
  ) async {
    final scene = (await mountShell(tester, testCatalog: pilotCatalog)).scene;
    await showPhase(tester, scene, 12);
    expect(_key('home-plan-angle'), findsNothing);
    await openHub(tester);
    final strings = AppLocalizations.of(tester.element(_key('training-hub')));
    expect(_key('hub-view-plan'), findsNothing);
    expect(find.text(strings.hubStillPlanning), findsOneWidget);
    final unavailable = find.text(strings.hubPlanComingSoon);
    expect(unavailable, findsOneWidget);
    expect(
      tester
          .getSemantics(unavailable)
          .getSemanticsData()
          .hasAction(ui.SemanticsAction.tap),
      isFalse,
    );
    await back(tester);
    await showPhase(tester, scene, 11);

    for (final group in ['deltoids', 'triceps']) {
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'select',
        'groupId': group,
        'time': scene.time,
        'playing': false,
        'phase': {'source': 11},
      });
      await tester.pumpAndSettle();
      await tester.tap(_key('train-group'));
      await tester.pumpAndSettle();
      if (group == 'deltoids') {
        final detail = tester.widget<FlarePlanDetailPage>(
          find.byType(FlarePlanDetailPage),
        );
        expect(detail.plans.first.id, 'muscle-deltoids-t1');
        expect(find.text('发力肌群'), findsNothing);
        _expectPlanMinutes(tester, 17);
        for (final label in ['中级', '高级']) {
          await tester.tap(_tier(label));
          await tester.pumpAndSettle();
          _expectPlanMinutes(tester, 18);
        }
      } else {
        final library = tester.widget<LibraryPage>(find.byType(LibraryPage));
        expect(library.initialGroup?.id, group);
      }
      await back(tester);
      expect(_key('train-group'), findsOneWidget);
      expect(scene.detail, group);
      expect(scene.playing, isFalse);
      await back(tester);
    }
    helpers.assertNoFlutterError(tester);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('plan tiers keep doses across a scene switch and gate start', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    final membership = FlareMembership(_MembershipStore());
    try {
      final mounted = await mountShell(tester, membership: membership);
      await showPhase(tester, mounted.scene, 11);
      tester.view.physicalSize = const Size(390, 844);
      tester.view.viewPadding = const FakeViewPadding(top: 24, bottom: 24);
      await tester.pumpAndSettle();
      await openHub(tester);
      await tester.tap(_hubPlanAction(tester, catalog.phaseBySource(11)!.name));
      await tester.pumpAndSettle();
      final header = find.descendant(
        of: find.byType(FlarePlanDetailPage),
        matching: find.byType(FlareNavBar),
      );
      final backChip = find.descendant(
        of: header,
        matching: find.byType(FlareBackChip),
      );
      final nav = tester.widget<FlareNavBar>(header);
      expect(nav.fade, 24);
      expect(nav.title, isNull);
      final backRect = tester.getRect(backChip);
      final muscles = _key('flare-plan-muscle-deltoids');
      expect(tester.getSize(muscles).height, 32);
      expect(
        tester.getRect(muscles).bottom,
        lessThan(tester.getTopLeft(_key('flare-plan-tier')).dy),
      );
      expect(find.text('训练内容').hitTestable(), findsOneWidget);
      final firstRow = _key('flare-plan-item-0-forearms-A');
      expect(firstRow.hitTestable(), findsOneWidget);
      expect(
        tester.getRect(firstRow).bottom,
        lessThan(tester.getTopLeft(_key('flare-plan-start')).dy),
      );
      await _expectScrollNavFade(tester, find.byType(FlarePlanDetailPage));
      final scroll = tester.state<ScrollableState>(_detailScroll()).position;
      scroll.jumpTo(331);
      await tester.pumpAndSettle();
      expect(tester.getRect(backChip), backRect);
      await _showPlanTop(tester);
      final strings = AppLocalizations.of(
        tester.element(_key('flare-plan-tier')),
      );
      await tester.tap(_tier('高级'));
      await tester.pumpAndSettle();
      _expectPlanMinutes(tester, 23);
      await _revealPlanContent(
        tester,
        _key('flare-plan-item-1-t-flare-side-hold'),
      );
      await _showPlanTop(tester);
      await tester.tap(_tier('初级'));
      await tester.pumpAndSettle();
      _expectPlanMinutes(tester, 20);
      await _revealPlanContent(
        tester,
        _key('flare-plan-item-1-h-short-side-plank'),
      );
      await _showPlanTop(tester);
      await tester.tap(_tier('中级'));
      await tester.pumpAndSettle();
      _expectPlanMinutes(tester, 23);
      await tester.tap(find.text(strings.sceneGym));
      await tester.pumpAndSettle();
      final parallelBars = _key('flare-plan-item-3-triceps-B');
      final dosage =
          '4 × ${strings.secondsLabel(15)} · ${strings.planRestSeconds(60)}';
      await _revealPlanContent(tester, parallelBars);
      expect(_rowText(parallelBars, dosage), findsOneWidget);
      await _showPlanTop(tester);
      await tester.tap(find.text(strings.planBodyweightScene));
      await tester.pumpAndSettle();
      final deltoids = _key('flare-plan-item-1-deltoids-A');
      await _revealPlanContent(tester, deltoids);
      expect(
        _rowText(
          deltoids,
          '${strings.planDosePerSide('3 × ${strings.countLabel(10)}')} · ${strings.planRestSeconds(45)}',
        ),
        findsOneWidget,
      );
      final replacement = _key('flare-plan-item-3-triceps-A');
      await _revealPlanContent(tester, replacement);
      expect(parallelBars, findsNothing);
      expect(_rowText(replacement, dosage), findsOneWidget);
      expect(
        _rowText(replacement, strings.planBodyweightSubstitution),
        findsOneWidget,
      );

      await tester.tap(replacement);
      await tester.pumpAndSettle();
      final drill = tester
          .widget<DrillDetailPage>(find.byType(DrillDetailPage))
          .drill;
      expect(drill.id, 'triceps-A');
      await back(tester);
      await _revealPlanContent(tester, replacement);

      await tester.tap(_key('flare-plan-start'));
      await tester.pumpAndSettle();
      expect(find.byType(FlareMembershipPage), findsOneWidget);
      expect(find.byType(helpers.TrainingRouteProbe), findsNothing);
      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();
      expect(await membership.restore(), isTrue);

      await tester.tap(_key('flare-plan-start'));
      await helpers.waitForTrainingRoute(tester);
      final delivery = tester
          .widget<helpers.TrainingRouteProbe>(
            find.byType(helpers.TrainingRouteProbe),
          )
          .plan;
      final substitute = delivery.items.singleWhere(
        (item) => item.exerciseId == 'triceps-A',
      );
      expect(substitute.sets, 4);
      expect(substitute.workSeconds, 15);
      expect(substitute.restSeconds, 60);
      await tester.tap(_key('training-probe-close'));
      await tester.pumpAndSettle();
      helpers.assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    } finally {
      membership.dispose();
      semantics.dispose();
    }
  });

  testWidgets('premium member completes an authored plan in the SDK', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    final membership = FlareMembership(_MembershipStore());
    try {
      expect(await membership.restore(), isTrue);
      final result = await mountShell(
        tester,
        membership: membership,
        realPlayer: true,
      );
      final store = result.store;

      await openHub(tester);
      await tester.tap(_key('hub-muscle-mode'));
      await tester.pumpAndSettle();
      await tester.tap(
        _hubPlanAction(tester, catalog.groupById('deltoids')!.label),
      );
      await tester.pumpAndSettle();
      await tester.tap(_key('flare-plan-start'));
      final playerFinder = find.byType(sdk.TrainerPlayer);
      for (
        var attempt = 0;
        attempt < 100 && playerFinder.evaluate().isEmpty;
        attempt++
      ) {
        await tester.runAsync(
          () => Future<void>.delayed(const Duration(milliseconds: 10)),
        );
        await tester.pump(const Duration(milliseconds: 100));
      }
      expect(find.byType(FlareMembershipPage), findsNothing);
      final player = tester.widget<sdk.TrainerPlayer>(playerFinder);
      final authored = catalog.plansForMuscle('deltoids').first;
      expect(
        player.plan.items.map((item) => item.exerciseId),
        authored.items.map((item) => item.drill),
      );

      final estimate = sdk.SessionBuilder(
        rhythms: player.rhythms,
        rhythmDefaults: player.rhythmDefaults,
        prepSeconds: player.prepSeconds,
        transitionSeconds: player.transitionSeconds,
      ).planSeconds(player.plan);
      final finish = _key('finish');
      for (
        var elapsed = 0;
        elapsed < estimate.ceil() + 120 && finish.evaluate().isEmpty;
        elapsed += 2
      ) {
        final complete = _key('complete-set-button').hitTestable();
        if (complete.evaluate().isNotEmpty) {
          await tester.tap(complete);
        }
        await tester.pump(const Duration(seconds: 2));
      }
      expect(finish, findsOneWidget);
      final saved = store.trainerSessions.single;
      expect(saved.full, isTrue);
      expect(
        saved.items.map((item) => item.completedSets),
        authored.items.map((item) => item.sets),
      );
      expect(store.sessions.every((row) => row.completed), isTrue);
      await tester.pumpAndSettle();
      await tester.tap(finish);
      await tester.pumpAndSettle();
      expect(playerFinder, findsNothing);
      expect(find.byType(FlarePlanDetailPage), findsOneWidget);
      helpers.assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    } finally {
      membership.dispose();
      semantics.dispose();
    }
  });
}
