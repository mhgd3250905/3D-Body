import 'dart:convert';
import 'dart:io';

import 'package:flare/data/catalog.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/ugk_trainer.dart' as sdk;

import '../domain/fixtures.dart';

void main() {
  final catalog = loadCatalogFixture();

  test('all catalog drills are retained, with original targets and sides', () {
    final plan = trainingPlanFromDrills(title: 'All', drills: catalog.drills);
    validateTrainingPlan(plan, catalog);
    expect(
      plan.items.map((item) => item.exerciseId),
      catalog.drills.map((d) => d.id),
    );
    for (final (i, item) in plan.items.indexed) {
      final dose = catalog.drills[i].dose;
      expect(item.sets, dose.sets);
      expect(item.perSide, dose.perSide);
      expect(item.restSeconds, dose.restSec);
      expect(
        item.mode,
        dose.mode == DoseMode.time ? uc.DoseMode.time : uc.DoseMode.reps,
      );
      expect(item.workSeconds ?? item.reps, dose.min == 0 ? 1 : dose.min);
    }
  });

  test('multi-segment sets remain Y T W then Y T W with original set rest', () {
    final drill = catalog.drills.firstWhere(
      (d) => d.dose.blockLabels.length == 3,
    );
    final input = trainingPlanFromDrills(title: 'YTW', drills: [drill]);
    final plan = expandSegmentedTrainingPlan(input, catalog);
    final block = plan.blocks.single;
    expect(block.type, uc.BlockType.circuit);
    expect(block.rounds, drill.dose.sets);
    expect(block.restBetweenRoundsSeconds, drill.dose.restSec);
    expect(block.items.map((i) => i.exerciseId).toSet(), {drill.id});
    final phases = sdk.SessionBuilder().phases(plan);
    final work = phases.where((p) => p.kind == sdk.PhaseKind.work).toList();
    final oneSide = work.where((p) => p.side != sdk.Side.left).toList();
    expect(oneSide.map((p) => p.item!.note!.split('\n').first), [
      for (var set = 0; set < drill.dose.sets; set++) ...drill.dose.blockLabels,
    ]);
    expect(oneSide.map((p) => p.itemIndex).toSet().length, drill.dose.sets * 3);
    final roundRests = phases.where(
      (p) =>
          p.kind == sdk.PhaseKind.roundRest && p.seconds == drill.dose.restSec,
    );
    expect(roundRests.length, drill.dose.sets - 1);
    expect(expandSegmentedTrainingPlan(plan, catalog).toJson(), plan.toJson());
  });

  test(
    'AI circuit keeps round order, original per-item note and authored rest',
    () {
      final wrist = catalog.drillById('forearms-B')!;
      final other = catalog.drillById('abs-A')!;
      final raw = trainingPlanFromDrills(
        title: 'Circuit',
        drills: [wrist, other],
      );
      final input = raw.copyWith(
        blocks: [
          uc.PlanBlock(
            id: 'authored-circuit',
            name: 'Circuit',
            type: uc.BlockType.circuit,
            rounds: 2,
            restBetweenRoundsSeconds: 48,
            items: raw.items.toList(),
          ),
        ],
      );
      final plan = expandSegmentedTrainingPlan(input, catalog);
      final phases = sdk.SessionBuilder().phases(plan);
      final work = phases.where(
        (p) => p.kind == sdk.PhaseKind.work && p.side != sdk.Side.left,
      );
      expect(work.map((p) => p.exerciseId), [
        wrist.id,
        wrist.id,
        other.id,
        wrist.id,
        wrist.id,
        other.id,
      ]);
      expect(plan.blocks.single.rounds, 2);
      expect(plan.blocks.single.restBetweenRoundsSeconds, 48);
      expect(plan.items.first.note, contains(wrist.prescription));
      expect(
        expandSegmentedTrainingPlan(plan, catalog).toJson(),
        plan.toJson(),
      );
    },
  );

  test('unknown IDs reject the entire plan instead of being skipped', () {
    final raw = trainingPlanFromDrills(
      title: 'One',
      drills: [catalog.drills.first],
    );
    final plan = raw.copyWith(
      blocks: [
        uc.PlanBlock(
          id: 'bad',
          name: 'Bad',
          type: uc.BlockType.main,
          items: [
            ...raw.items,
            raw.items.first.copyWith(exerciseId: 'missing-action'),
          ],
        ),
      ],
    );
    expect(
      () => expandSegmentedTrainingPlan(plan, catalog),
      throwsA(isA<UnknownTrainingDrills>()),
    );
  });

  test('published rhythms and SDK default right-first side order are used', () {
    final coach = uc.Catalog.fromJson(
      jsonDecode(File('assets/coach/catalog.json').readAsStringSync()),
    );
    final rhythms = sdk.rhythmsFromCatalog(coach);
    final drill = catalog.drillById('glute-max-A')!;
    final plan = trainingPlanFromDrills(title: 'Rhythm', drills: [drill]);
    final work = sdk.SessionBuilder(
      rhythms: rhythms,
    ).phases(plan).where((p) => p.kind == sdk.PhaseKind.work).toList();
    expect(rhythms.containsKey(drill.id), isTrue);
    expect(work.first.selfPaced, isFalse);
    final sideDrill = catalog.drills.firstWhere((d) => d.dose.perSide);
    final sidePlan = trainingPlanFromDrills(
      title: 'Sides',
      drills: [sideDrill],
    );
    expect(
      sdk.SessionBuilder()
          .phases(sidePlan)
          .firstWhere((p) => p.kind == sdk.PhaseKind.work)
          .side,
      sdk.Side.right,
    );
  });
}
