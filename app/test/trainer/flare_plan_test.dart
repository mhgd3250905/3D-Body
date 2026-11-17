import 'dart:io';

import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_action_scope.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
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
          final id = scene == 'A'
              ? authored.bodyweight ?? authored.drill
              : authored.drill;
          expect(item.exerciseId, id);
          expect(item.sets, authored.sets);
          expect(item.reps, authored.reps);
          expect(item.workSeconds, authored.seconds);
          expect(item.perSide, authored.perSide);
          expect(item.restSeconds, authored.restSeconds);
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
    expect(pushups.map((phase) => phase.seconds), [15, 15, 15, 15]);
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
  });
}
