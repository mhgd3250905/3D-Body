import 'dart:io';

import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_action_scope.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/trainer/trainer_voice.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late Catalog catalog;
  late uc.PoseHubAppTestCatalog pack;
  late uc.Catalog source;
  late Map<String, sdk.Rhythm> rhythms;
  setUpAll(() async {
    catalog = await Catalog.load();
    pack = uc.PoseHubAppTestCatalog.fromBytes(
      File(flarePublicCatalogAsset).readAsBytesSync(),
      semanticCatalogBytes: File(flarePublicSemanticsAsset).readAsBytesSync(),
    );
    rhythms = flarePublicRhythms(pack);
    source = flareCoachCatalogFromPublic(pack, rhythms: rhythms);
  });

  uc.TrainingPlan training(FlarePlan plan, String scene) =>
      trainingPlanFromFlarePlan(
        plan: plan,
        title: 'Flare',
        sceneTier: scene,
        catalog: catalog,
        sourceCatalog: source,
        rhythms: rhythms,
      );

  Iterable<FlarePlan> allPlans() => [
    ...catalog.flarePlanAngles.expand(catalog.plansForAngle),
    ...catalog.flarePlanMuscles.expand(catalog.plansForMuscle),
  ];

  test('bundled plans cover every phase and muscle in all three tiers', () {
    expect(catalog.flarePlanCounts, (
      plans: 72,
      angles: 8,
      muscles: 17,
      tiers: 3,
    ));
    expect(catalog.flarePlanAngles, [9, 10, 11, 12, 13, 14, 16]);
    expect(
      catalog.flarePlanMuscles,
      unorderedEquals(catalog.groups.map((group) => group.id)),
    );
    for (final phase in catalog.phases) {
      expect(
        catalog.plansForAngle(phase.source).map((plan) => plan.tier),
        [1, 2, 3],
        reason: '${phase.source}',
      );
    }
    for (final group in catalog.groups) {
      expect(catalog.plansForMuscle(group.id).map((plan) => plan.tier), [
        1,
        2,
        3,
      ], reason: group.id);
    }
    final angle = catalog.plansForAngle(11);
    final muscle = catalog.plansForMuscle('deltoids');
    expect(catalog.plansForAngle(15), angle);
    final localized = catalog.localized(const {'三角肌': 'Deltoids'});
    expect(localized.plansForAngle(15), angle);
    expect(localized.plansForMuscle('deltoids'), muscle);
  });

  test(
    'supplemental plans resolve in the player at their authored doses',
    () async {
      final supplementary = await withFlareWarmupAction(pack);
      expect(pack.tryGet(flareWarmupPushupId), isNull);
      expect(supplementary.allActions.map((a) => a.id), [
        ...pack.allActions.map((a) => a.id),
        flareWarmupPushupId,
      ]);
      expect(await withFlareWarmupAction(pack), same(supplementary));

      final pushup = supplementary.tryGet(flareWarmupPushupId)!;
      expect(flareAuthorizedActionIds, isNot(contains(pushup.id)));
      for (final (asset, file) in [
        (FlarePublicMedia.coverAssetFor(pushup.id), pushup.cover),
        (FlarePublicMedia.thumbnailAssetFor(pushup.id), pushup.thumbnail),
      ]) {
        final bytes = File(asset).readAsBytesSync();
        expect(bytes.length, file.bytes);
        expect(uc.sha256Hex(bytes), file.sha256);
      }

      final warmup = catalog.flareWarmupPlan!;
      expect((warmup.id, warmup.estimatedMinutes), ('general-warmup', 9));

      final supplementalRhythms = flarePublicRhythms(supplementary);
      final supplementalSource = flareCoachCatalogFromPublic(
        supplementary,
        rhythms: supplementalRhythms,
      );
      uc.TrainingPlan playablePlan(FlarePlan authored) {
        final plan = trainingPlanFromFlarePlan(
          plan: authored,
          title: authored.id,
          sceneTier: 'A',
          catalog: catalog,
          sourceCatalog: supplementalSource,
          rhythms: supplementalRhythms,
        );
        expect(plan.items, hasLength(authored.items.length));
        expect(plan.items.map((item) => item.sets), everyElement(1));
        expect(plan.items.map((item) => item.restSeconds), everyElement(0));
        expect(
          authored.items.map((item) => item.voiceCue),
          everyElement(isNotEmpty),
        );
        expect(
          authored.items.map(
            (item) => supplementary
                .tryGet(item.drillForScene('A'))
                ?.availableForTraining,
          ),
          everyElement(isTrue),
        );
        return plan;
      }

      List<(String, int?, int?, bool)> doses(uc.TrainingPlan plan) => [
        for (final item in plan.items)
          (item.exerciseId, item.reps, item.workSeconds, item.perSide),
      ];
      final warmupPlan = playablePlan(warmup);
      expect(doses(warmupPlan), [
        ('h-step-jack', null, 60, false),
        ('warmup-neck-wrist-fingers', null, 45, false),
        ('n-squat-shift', 5, null, true),
        ('n-leg-circles', 3, null, true),
        ('w-dead-bug', 5, null, true),
        ('s-9090', 4, null, true),
        ('t-seated-straddle-lift-1leg', 5, null, true),
        ('forearms-A', null, 50, false),
        ('h-catcow-quad', 6, null, false),
        ('h-kneeling-thread-needle', 4, null, true),
        (flareWarmupPushupId, 10, null, false),
        ('rotator-cuff-A', 4, null, true),
      ]);
      expect(
        warmup.items
            .where((item) => item.usesPlaceholderDemo)
            .map((item) => item.drill),
        ['h-step-jack', 'forearms-A', 'n-squat-shift'],
      );
      expect(
        warmup.items[1].trainingDrillForScene('A'),
        'warmup-neck-wrist-fingers',
      );
      expect(warmup.items[7].trainingDrillForScene('A'), 'forearms-A');
      expect(
        [
          for (final index in [3, 5, 6, 8]) warmup.items[index].displayName,
        ],
        ['仰卧单腿直腿大画圈', '90/90 坐姿换髋', '坐姿分腿单腿抬起', '四足猫牛式'],
      );
      expect(warmup.items[8].usesPlaceholderDemo, isFalse);

      final timeline = sdk.SessionBuilder(
        rhythms: supplementalRhythms,
        transitionSeconds: flareWarmupTransitionSeconds,
      ).phases(warmupPlan);
      Iterable<sdk.SessionPhase> work(String id) =>
          timeline.where((phase) => phase.isWork && phase.exerciseId == id);
      final neck = work('warmup-neck-wrist-fingers').single;
      expect((neck.seconds, neck.segment), (45, null));
      expect(
        work('n-leg-circles').map(
          (phase) =>
              (phase.segmentId, phase.segment?.label, phase.side, phase.reps),
        ),
        [
          ('clockwise', '顺时针', sdk.Side.right, 3),
          ('clockwise', '顺时针', sdk.Side.left, 3),
          ('counterclockwise', '逆时针', sdk.Side.right, 3),
          ('counterclockwise', '逆时针', sdk.Side.left, 3),
        ],
      );
      final hips = work('s-9090').single;
      expect(hips.reps, 4);
      expect(hips.rhythm?.alternatePair, isTrue);
      final lift = work('t-seated-straddle-lift-1leg').single;
      expect((lift.reps, lift.holdSeconds), (5, 1));
      expect(
        lift.rhythm!
            .phasesFor()
            .where((part) => part.id == 'hold')
            .map((part) => part.seconds),
        [1, 1],
      );
      expect(
        work('forearms-A').map((phase) => (phase.segmentId, phase.seconds)),
        [
          ('fingers-forward', 17),
          ('fingers-sideways', 17),
          ('fingers-backward', 16),
        ],
      );
    },
  );

  test('the SDK schedules every bundled warm-up Mandarin cue', () async {
    final active = await withFlareWarmupAction(pack);
    final activeRhythms = flarePublicRhythms(active);
    final activeSource = flareCoachCatalogFromPublic(
      active,
      rhythms: activeRhythms,
    );
    final baseVoice = await sdk.withPoseHubCatalogVoice(
      await loadTrainerVoiceSource(language: 'zh', leftFirst: false),
      catalog: active,
    );
    for (final authored in [catalog.flareWarmupPlan!]) {
      final voice = await withSupplementalTrainerVoice(
        baseVoice,
        authored,
        language: 'zh',
      );
      final plan = trainingPlanFromFlarePlan(
        plan: authored,
        title: authored.id,
        sceneTier: 'A',
        catalog: catalog,
        sourceCatalog: activeSource,
        rhythms: activeRhythms,
      );
      final knownIds = {
        for (final item in authored.items) item.trainingDrillForScene('A'),
      };
      final playable = expandSegmentedTrainingPlan(
        plan,
        catalog,
        known: knownIds.contains,
      );
      final script = sdk.SessionScript(source: voice, lang: 'zh');
      final phases = sdk.SessionBuilder(
        rhythms: activeRhythms,
        transitionSeconds: authored.kind == FlarePlanKind.warmup
            ? flareWarmupTransitionSeconds
            : 15,
        prepSecondsFor: script.prepSecondsFor,
        switchSecondsFor: script.switchSecondsFor,
        voiceGuideFor: voice.voiceGuide,
      ).phases(playable);
      final seconds = phases.fold(0.0, (total, phase) => total + phase.seconds);
      if (authored.kind == FlarePlanKind.warmup) {
        expect(seconds, inInclusiveRange(480, 600), reason: '${seconds}s');
      }
      final clips = phases
          .expand((phase) => script.cues(phase, planSeconds: seconds))
          .expand((cue) => cue.clips)
          .toSet();
      final missing = <String>[];
      for (final (index, item) in authored.items.indexed) {
        final key = 'supplemental.${authored.id}.${index + 1}';
        if (!clips.contains(key)) missing.add('${index + 1}: ${item.drill}');
        expect(voice.line(key, lang: 'zh'), item.voiceCue);
        final bytes = await rootBundle.load(voice.asset(key, lang: 'zh'));
        expect(bytes.lengthInBytes, greaterThan(0));
      }
      expect(missing, isEmpty, reason: '${authored.id}, ${seconds}s');
    }
  });

  test('cooldown tiers preserve circuit, stretch, safety and hold doses', () {
    final plans = catalog.flareCooldownPlans;
    expect(plans.map((plan) => plan.id), [
      'general-cooldown',
      'general-cooldown-t2',
      'general-cooldown-t3',
    ]);
    expect(catalog.flareCooldownPlan, same(plans.first));

    for (final (index, authored) in plans.indexed) {
      final tier = index + 1;
      final rounds = [2, 3, 3][index];
      const reposition = 10;
      final roundRest = [30, 45, 45][index];
      final stretchSeconds = [30, 45, 60][index];
      expect(authored.tier, tier);
      expect(authored.strengtheningRounds, rounds);
      expect(authored.strengtheningRestSeconds, reposition);
      expect(authored.strengtheningRoundRestSeconds, roundRest);
      expect(authored.strengtheningItems, hasLength([6, 7, 6][index]));
      expect(authored.items, hasLength(tier == 3 ? 13 : 12));
      expect(authored.items.first.drill, 'o-stand-sidebend');
      expect(authored.items.any((item) => item.drill == 's-frog'), tier == 3);
      expect(
        authored.allItems.map((item) => item.safetyNote),
        everyElement(isNotEmpty),
      );

      final full = training(authored, 'A');
      final stretchOnly = trainingPlanFromFlarePlan(
        plan: authored,
        title: authored.id,
        sceneTier: 'A',
        catalog: catalog,
        sourceCatalog: source,
        rhythms: rhythms,
        skipStrengthening: true,
      );
      expect(full.blocks.map((block) => block.type), [
        uc.BlockType.circuit,
        uc.BlockType.cooldown,
      ]);
      expect(full.blocks.first.rounds, rounds);
      expect(full.blocks.first.restBetweenRoundsSeconds, roundRest);
      expect(stretchOnly.blocks.map((block) => block.type), [
        uc.BlockType.cooldown,
      ]);
      expect(
        stretchOnly.blocks.single.items.map((item) => item.toJson()),
        full.blocks.last.items.map((item) => item.toJson()),
      );

      final playableIds = <String, String>{
        for (final item in authored.allItems)
          ...item.trainingMediaIdsForScene('A'),
      };
      expect(full.exerciseIds.toSet(), playableIds.keys.toSet());
      expect(
        playableIds.values.map((id) => pack.tryGet(id)?.availableForTraining),
        everyElement(isTrue),
      );
      final bItems = stretchOnly.items.toList();
      expect(
        bItems.map((item) => item.workSeconds),
        everyElement(stretchSeconds),
      );
      final starred = authored.items.where(
        (item) => item.dose.sets == 2 || item.dose.pnfSeconds != null,
      );
      expect(starred.map((item) => item.voiceKey), [
        'supplemental.cooldown.stretch.7',
        'supplemental.cooldown.stretch.10',
        'supplemental.cooldown.stretch.11',
      ]);

      final builder = FlareCooldownSessionBuilder(
        strengtheningRestSeconds: reposition,
        rhythms: rhythms,
        switchSecondsFor: (_, _, _) => 19,
      );
      final fullTimeline = builder.phases(full);
      final aRests = fullTimeline.where(
        (phase) => phase.kind == sdk.PhaseKind.rest && phase.blockIndex == 0,
      );
      expect(
        aRests,
        hasLength((authored.strengtheningItems.length - 1) * rounds),
      );
      expect(aRests.map((phase) => phase.seconds), everyElement(reposition));
      final roundRests = fullTimeline.where(
        (phase) => phase.kind == sdk.PhaseKind.roundRest,
      );
      expect(roundRests, hasLength(rounds - 1));
      expect(roundRests.map((phase) => phase.seconds), everyElement(roundRest));
      final bTimeline = builder.phases(stretchOnly);
      for (final timeline in [fullTimeline, bTimeline]) {
        expect(
          timeline
              .where((phase) => phase.kind == sdk.PhaseKind.switchSide)
              .map((phase) => phase.seconds),
          everyElement(5),
        );
        expect(
          timeline
              .where((phase) => phase.kind == sdk.PhaseKind.rest)
              .map((phase) => (phase.seconds, phase.nextItem != null)),
          everyElement((reposition, true)),
        );
      }
      final bFullTransitions = fullTimeline.where(
        (phase) => phase.kind == sdk.PhaseKind.rest && phase.blockIndex == 1,
      );
      expect(bFullTransitions, hasLength(authored.items.length));
      expect(bFullTransitions.first.itemInBlock, 0);
      final bOnlyTransitions = bTimeline.where(
        (phase) => phase.kind == sdk.PhaseKind.rest,
      );
      expect(bOnlyTransitions, hasLength(authored.items.length - 1));
      final wrist = bTimeline.where((phase) => phase.itemInBlock == 4);
      expect(
        wrist
            .where((phase) => phase.isWork)
            .map((phase) => (phase.segmentId, phase.side, phase.seconds)),
        [
          ('wrist-flexed', sdk.Side.right, (stretchSeconds + 1) ~/ 2),
          ('wrist-extended', sdk.Side.right, stretchSeconds ~/ 2),
          ('wrist-flexed', sdk.Side.left, (stretchSeconds + 1) ~/ 2),
          ('wrist-extended', sdk.Side.left, stretchSeconds ~/ 2),
        ],
      );
      final firstPriority = starred.first;
      final hip = bTimeline.where(
        (phase) => phase.item?.exerciseId == firstPriority.drill,
      );
      if (tier == 3) {
        expect(
          hip
              .where((phase) => phase.isWork)
              .map((phase) => (phase.segmentId, phase.side, phase.seconds)),
          [
            ('stretch-hold', sdk.Side.right, 60),
            ('pnf-press', sdk.Side.right, 5),
            ('stretch-hold', sdk.Side.left, 60),
            ('pnf-press', sdk.Side.left, 5),
          ],
        );
        final turn = hip.singleWhere(
          (phase) => phase.kind == sdk.PhaseKind.switchSide,
        );
        expect(
          (turn.side, turn.segmentId, turn.exerciseId),
          (sdk.Side.left, 'stretch-hold', firstPriority.drill),
        );
      }
      expect(
        starred.map((item) => (item.dose.sets, item.dose.pnfSeconds)),
        everyElement(tier == 3 ? (1, 5) : (2, null)),
      );
      final shoulders = fullTimeline.where(
        (phase) => phase.isWork && phase.exerciseId == 'scapular-A',
      );
      expect(
        shoulders
            .take(tier == 1 ? 2 : 3)
            .map((phase) => (phase.segmentId, phase.reps, phase.holdSeconds)),
        switch (tier) {
          1 => [('t', 6, 2), ('w', 6, 2)],
          2 => [('y', 6, null), ('t', 6, null), ('w', 6, 2)],
          _ => [('y', 6, 2), ('t', 6, 2), ('w', 6, 2)],
        },
      );
      final controlledMove = fullTimeline.firstWhere(
        (phase) =>
            phase.isWork &&
            phase.exerciseId ==
                switch (tier) {
                  1 => 'h-wall-palm-lift',
                  2 => 'h-inner-thigh',
                  _ => 'h-wall-straddle',
                },
      );
      final controlledPhases = controlledMove.rhythm!.phasesFor();
      expect(
        controlledPhases
            .singleWhere((phase) => phase.id == (tier == 3 ? 'go' : 'back'))
            .seconds,
        3,
      );
      expect(controlledMove.holdSeconds, switch (tier) {
        1 => null,
        2 => 2,
        _ => 1,
      });

      final fullSeconds = builder.planSeconds(full);
      final stretchSecondsTotal = builder.planSeconds(stretchOnly);
      expect(fullSeconds, [1533, 2470, 2267][index]);
      expect(stretchSecondsTotal, [875, 1185, 1375][index]);
      expect(full.targetMinutes, (fullSeconds / 60).ceil());
      expect(full.targetMinutes, authored.estimatedMinutes);
      expect(stretchOnly.targetMinutes, (stretchSecondsTotal / 60).ceil());
    }
  });

  test(
    'cooldown preserves fractional movement cadence without rounding a set',
    () {
      final builder = FlareCooldownSessionBuilder(strengtheningRestSeconds: 10);
      const wristRaise = uc.PlanItem(
        exerciseId: 'wrist-raise',
        mode: uc.DoseMode.reps,
        sets: 1,
        reps: 5,
        perSide: false,
        restSeconds: 0,
      );
      final rhythm = sdk.Rhythm.fromJson({
        'kind': 'rep_hold',
        'leadSeconds': .6,
        'phases': 'go=1.5s; hold=2s; back=3s',
      });
      expect(builder.workSeconds(wristRaise, rhythm), closeTo(33.1, 1e-9));
    },
  );

  test('every scene uses an available, scoped drill and exact dose', () {
    final plans = allPlans();
    expect(plans, hasLength(72));
    for (final plan in plans) {
      for (final scene in ['A', 'B', 'C']) {
        final converted = training(plan, scene);
        expect(converted.level, plan.tier);
        expect(converted.targetMinutes, greaterThan(0));
        for (final (index, item) in converted.items.indexed) {
          final authored = plan.items[index];
          final id = authored.drillForScene(scene);
          final dose = authored.doseForScene(scene);
          expect(item.exerciseId, id);
          expect(item.sets, dose.sets);
          expect(item.reps, dose.reps);
          expect(item.workSeconds, dose.seconds);
          expect(item.perSide, dose.perSide);
          expect(item.restSeconds, dose.restSeconds);
          expect(flareAuthorizedActionIds, contains(id));
          expect(pack.tryGet(id)?.availableForTraining, isTrue, reason: id);
          expect(
            File('${FlarePublicMedia.coverRoot}$id.webp').existsSync(),
            isTrue,
            reason: id,
          );
          expect(
            File('${FlarePublicMedia.thumbnailRoot}$id.webp').existsSync(),
            isTrue,
            reason: id,
          );
        }
      }
    }
  });

  test('scene overrides replace the whole dose before SDK scheduling', () {
    final plan = FlarePlan.fromJson({
      'id': 'scene-doses',
      'kind': 'angle',
      'target': 11,
      'tier': 3,
      'items': [
        {
          'drill': 'triceps-B',
          'sets': 4,
          'seconds': 20,
          'restSeconds': 75,
          'bodyweight': 'chest-A',
          'bodyweightDose': {'sets': 3, 'reps': 4, 'restSeconds': 45},
          'home': 'h-side-er',
          'homeDose': {
            'sets': 2,
            'reps': 12,
            'restSeconds': 30,
            'perSide': true,
          },
        },
        {
          'drill': 'abs-C',
          'sets': 2,
          'reps': 8,
          'restSeconds': 45,
          'bodyweight': 'abs-A',
        },
      ],
    });

    final a = training(plan, 'A');
    final b = training(plan, 'B');
    final c = training(plan, 'C');
    (String, int, int?, int?, int, bool) dose(uc.PlanItem item) => (
      item.exerciseId,
      item.sets,
      item.reps,
      item.workSeconds,
      item.restSeconds,
      item.perSide,
    );
    expect(dose(a.items.first), ('chest-A', 3, 4, null, 45, false));
    expect(dose(b.items.first), ('h-side-er', 2, 12, null, 30, true));
    expect(dose(c.items.first), ('triceps-B', 4, null, 20, 75, false));
    expect(dose(a.items.last), ('abs-A', 2, 8, null, 45, false));
    expect(dose(b.items.last), ('abs-C', 2, 8, null, 45, false));
    expect(a.items.first.replacedFrom, 'triceps-B');
    expect(b.items.first.replacedFrom, 'triceps-B');
    expect(c.items.first.replacedFrom, isNull);

    final builder = sdk.SessionBuilder(rhythms: rhythms);
    Iterable<sdk.SessionPhase> work(uc.TrainingPlan plan, String id) =>
        builder.phases(plan).where((p) => p.isWork && p.exerciseId == id);
    final pairs = work(a, 'chest-A');
    expect(pairs, hasLength(3));
    expect(pairs.map((p) => p.side), everyElement(isNull));
    expect(pairs.map((p) => p.reps), everyElement(4));
    expect(pairs.map((p) => p.rhythm?.alternatePair), everyElement(isTrue));
    final singleSide = work(b, 'h-side-er');
    expect(singleSide.map((p) => p.side), [
      sdk.Side.right,
      sdk.Side.left,
      sdk.Side.right,
      sdk.Side.left,
    ]);
    expect(singleSide.map((p) => p.reps), everyElement(12));
    expect(work(c, 'triceps-B').map((p) => p.seconds), [20, 20, 20, 20]);
    for (final scenario in [a, b, c]) {
      expect(
        scenario.targetMinutes,
        (builder.planSeconds(scenario) / 60).ceil(),
      );
    }
  });

  test('bundled prescriptions preserve timed holds and simultaneous reps', () {
    final abs = catalog.plansForMuscle('abs').singleWhere((p) => p.tier == 3);
    final bodyweight = training(abs, 'A');
    final holds = bodyweight.items.where(
      (item) => const ['abs-A', 'h-bear-plank'].contains(item.exerciseId),
    );
    expect(holds.map((item) => item.sets), [3, 3]);
    expect(holds.map((item) => item.workSeconds), [20, 20]);
    expect(holds.map((item) => item.restSeconds), [60, 45]);
    final builder = sdk.SessionBuilder(rhythms: rhythms);
    final phases = builder.phases(bodyweight);
    for (final hold in holds) {
      final work = phases.where(
        (p) => p.isWork && p.exerciseId == hold.exerciseId,
      );
      expect(work.map((p) => p.seconds), [20, 20, 20]);
    }

    final angle = catalog.plansForAngle(12).singleWhere((p) => p.tier == 2);
    final plan = training(angle, 'C');
    final hipFlexors = plan.items.singleWhere(
      (i) => i.exerciseId == 'hip-flexors-A',
    );
    expect(hipFlexors.perSide, isFalse);
    final work = builder
        .phases(plan)
        .where((p) => p.isWork && p.exerciseId == 'hip-flexors-A');
    expect(work, hasLength(hipFlexors.sets));
    expect(work.map((p) => p.side), everyElement(isNull));
  });

  test('every scene resolves unique drills in each of the 72 plans', () {
    final plans = allPlans();
    expect(plans, hasLength(72));
    for (final plan in plans) {
      for (final scene in ['A', 'B', 'C']) {
        final actionIds = training(
          plan,
          scene,
        ).items.map((item) => item.exerciseId);
        expect(
          actionIds.toSet(),
          hasLength(actionIds.length),
          reason: '${plan.id} scene $scene resolved to $actionIds',
        );
      }
    }
  });

  test('player preserves timed work and existing unilateral execution', () {
    final plan = training(catalog.plansForAngle(11)[1], 'A');
    final expanded = expandSegmentedTrainingPlan(
      plan,
      catalog,
      known: (id) => source[id] != null,
    );
    final phases = sdk.SessionBuilder(rhythms: rhythms).phases(expanded);
    final work = phases.where((phase) => phase.isWork);
    final wristWork = work.where((phase) => phase.exerciseId == 'forearms-A');
    expect(wristWork.map((phase) => phase.seconds), [15, 15, 15, 15]);
    final pushups = work.where((phase) => phase.exerciseId == 'triceps-A');
    expect(pushups.map((phase) => phase.reps), [8, 8, 8, 8]);
    final unilateral = work.where(
      (phase) => phase.exerciseId == 'hip-abductors-A',
    );
    expect(unilateral.map((phase) => phase.side), [
      for (var group = 0; group < 3; group++) ...[
        sdk.Side.right,
        sdk.Side.left,
      ],
    ]);
    expect(unilateral.map((phase) => phase.reps), everyElement(8));
  });

  test('rejects missing or ambiguous authored work dose', () {
    final json = {'drill': 'triceps-A', 'sets': 3, 'restSeconds': 45};
    expect(() => FlarePlanItem.fromJson(json), throwsFormatException);
    expect(
      () => FlarePlanItem.fromJson({...json, 'reps': 8, 'seconds': 15}),
      throwsFormatException,
    );
    expect(
      () => FlarePlanItem.fromJson({
        ...json,
        'reps': 8,
        'home': 'triceps-C',
        'homeDose': {'sets': 3, 'restSeconds': 30},
      }),
      throwsFormatException,
    );
    expect(
      () => FlarePlanItem.fromJson({
        ...json,
        'reps': 8,
        'bodyweightDose': {
          'sets': 3,
          'reps': 4,
          'seconds': 8,
          'restSeconds': 0,
        },
      }),
      throwsFormatException,
    );
  });
}
