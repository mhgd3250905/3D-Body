import 'package:flare/control/flare_membership.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/flare_membership_page.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/trainer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

import 'flow_regressions_test.dart' as helpers;

Finder _key(String value) => find.byKey(ValueKey(value));

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
  final previousShared = FlareShared.current;
  final previousUpdateStore = PoseHubCatalogUpdates.activeStore;

  setUpAll(() async {
    PoseHubCatalogUpdates.activeStore = null;
    FlareShared.current = await FlareShared.load();
    catalog = await Catalog.load();
  });

  tearDownAll(() {
    FlareShared.current = previousShared;
    PoseHubCatalogUpdates.activeStore = previousUpdateStore;
  });

  Future<({SceneController scene, LearningStore store})> mountShell(
    WidgetTester tester, {
    FlareMembership? membership,
    bool realPlayer = false,
  }) async {
    await helpers.phoneSize(tester);
    final store = LearningStore(
      catalog: catalog,
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
          catalog: catalog,
          store: store,
          sceneController: scene,
          enableScene: false,
          membership: membership,
          trainingPageBuilder: realPlayer
              ? (plan) => FlareTrainingPage(
                  plan: plan,
                  catalog: catalog,
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
      'period': catalog.period,
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

  testWidgets('both paused support phases open the same three plan tiers', (
    tester,
  ) async {
    final scene = (await mountShell(tester)).scene;
    await showPhase(tester, scene, 9);
    expect(_key('home-phase-name'), findsOneWidget);
    expect(_key('home-plan-angle'), findsNothing);

    await showPhase(tester, scene, 11, playing: true);
    expect(_key('home-plan-angle'), findsNothing);

    for (final source in [11, 15]) {
      await showPhase(tester, scene, source);
      final time = scene.time;
      await tester.tap(_key('home-plan-angle'));
      await tester.pumpAndSettle();
      final detail = tester.widget<FlarePlanDetailPage>(
        find.byType(FlarePlanDetailPage),
      );
      expect(detail.title, catalog.phaseBySource(source)!.name);
      expect(find.bySemanticsLabel('返回'), findsOneWidget);
      final hero = tester.widget<Image>(_key('flare-plan-angle-hero-$source'));
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
      final fallbackMuscle = _key('flare-plan-muscle-triceps');
      await _revealPlanContent(tester, plannedMuscle);
      expect(_rowText(plannedMuscle, '专项计划'), findsOneWidget);
      expect(_rowText(fallbackMuscle, '专项计划'), findsNothing);
      await tester.tap(plannedMuscle);
      await tester.pumpAndSettle();
      final muscle = tester.widget<FlarePlanDetailPage>(
        find.byType(FlarePlanDetailPage),
      );
      expect(muscle.title, catalog.groupById('deltoids')!.label);
      expect(muscle.plans.first.id, 'muscle-deltoids-t1');
      await back(tester);
      await back(tester);
      expect(_key('home-plan-angle'), findsOneWidget);
      expect(scene.time, time);
      expect(scene.playing, isFalse);
    }
    helpers.assertNoFlutterError(tester);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('train muscle opens a plan when present and library otherwise', (
    tester,
  ) async {
    final scene = (await mountShell(tester)).scene;
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
      await mountShell(tester, membership: membership);
      tester.view.physicalSize = const Size(360, 800);
      await tester.pumpAndSettle();
      await helpers.openPlansFromHome(tester);
      expect(_key('plans-angle-11'), findsOneWidget);
      expect(_key('plans-angle-15'), findsNothing);
      expect(_key('plans-muscle-deltoids'), findsOneWidget);

      await tester.tap(_key('plans-angle-11'));
      await tester.pumpAndSettle();
      final header = _key('flare-plan-scrolled-header');
      final scroll = tester.state<ScrollableState>(_detailScroll()).position;
      scroll.jumpTo(330);
      await tester.pumpAndSettle();
      expect(tester.widget<AnimatedOpacity>(header).opacity, 0);
      scroll.jumpTo(331);
      await tester.pumpAndSettle();
      expect(tester.widget<AnimatedOpacity>(header).opacity, 1);
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

      await helpers.openPlansFromHome(tester);
      await tester.tap(_key('plans-muscle-deltoids'));
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
