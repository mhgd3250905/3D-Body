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
      final cooldown = catalog.flareCooldownPlan!;
      expect((warmup.id, warmup.estimatedMinutes), ('general-warmup', 8));
      expect(
        (cooldown.id, cooldown.estimatedMinutes),
        ('general-cooldown', 10),
      );

      final supplementalRhythms = flarePublicRhythms(supplementary);
      final supplementalSource = flareCoachCatalogFromPublic(
        supplementary,
        rhythms: supplementalRhythms,
      );
      List<(String, int?, int?, bool)> doses(FlarePlan authored) {
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
        expect(
          authored.items.map((item) => item.voiceCue),
          everyElement(isNotEmpty),
        );
        expect(
          plan.exerciseIds.map(
            (id) => supplementary.tryGet(id)?.availableForTraining,
          ),
          everyElement(isTrue),
        );
        return [
          for (final item in plan.items)
            (item.exerciseId, item.reps, item.workSeconds, item.perSide),
        ];
      }

      expect(doses(warmup), [
        ('h-step-jack', null, 60, false),
        ('forearms-A', null, 60, false),
        ('h-catcow-quad', 8, null, false),
        ('h-kneeling-thread-needle', 6, null, true),
        ('h-quad-cars', 5, null, true),
        ('h-adductor-rock', 8, null, true),
        (flareWarmupPushupId, 10, null, false),
        ('rotator-cuff-A', 4, null, true),
      ]);
      expect(doses(cooldown), [
        ('h-wall-wrist-flexor-stretch', null, 30, false),
        ('h-standing-wrist-extensor-stretch', null, 30, true),
        ('h-wall-pec', null, 30, false),
        ('h-dd-shoulder', null, 30, false),
        ('s-kneel-hipflex', null, 30, true),
        ('s-butterfly', null, 45, false),
        ('n-straddle-fold', null, 60, false),
        ('s-figure4', null, 30, true),
        ('h-supine-twist', null, 30, true),
      ]);
      expect(warmup.items.where((item) => item.usesPlaceholderDemo), isEmpty);
      expect(
        cooldown.items
            .where((item) => item.usesPlaceholderDemo)
            .map((item) => (item.drill, item.displayName, item.displayNameEn)),
        [
          (
            'h-wall-wrist-flexor-stretch',
            '跪姿前臂拉伸（指尖朝膝）',
            'Kneeling Forearm Stretch (Fingers Toward Knees)',
          ),
          (
            'h-wall-pec',
            '背后十指交扣扩胸',
            'Standing Chest Opener with Clasped Hands',
          ),
        ],
      );
    },
  );

  test('the SDK schedules every bundled supplemental Mandarin cue', () async {
    final active = await withFlareWarmupAction(pack);
    final activeRhythms = flarePublicRhythms(active);
    final activeSource = flareCoachCatalogFromPublic(
      active,
      rhythms: activeRhythms,
    );
    final baseVoice = await loadTrainerVoiceSource(
      language: 'zh',
      leftFirst: false,
    );
    for (final authored in [
      catalog.flareWarmupPlan!,
      catalog.flareCooldownPlan!,
    ]) {
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
      final script = sdk.SessionScript(source: voice, lang: 'zh');
      final phases = sdk.SessionBuilder(
        rhythms: activeRhythms,
        prepSecondsFor: script.prepSecondsFor,
        switchSecondsFor: script.switchSecondsFor,
      ).phases(plan);
      final seconds = phases.fold(0.0, (total, phase) => total + phase.seconds);
      final clips = phases
          .expand((phase) => script.cues(phase, planSeconds: seconds))
          .expand((cue) => cue.clips)
          .toSet();
      for (final (index, item) in authored.items.indexed) {
        final key = 'supplemental.${authored.id}.${index + 1}';
        expect(clips, contains(key), reason: item.drill);
        expect(voice.line(key, lang: 'zh'), item.voiceCue);
        final bytes = await rootBundle.load(voice.asset(key, lang: 'zh'));
        expect(bytes.lengthInBytes, greaterThan(0));
      }
    }
  });

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
