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
  final published = uc.Catalog.fromJson(
    jsonDecode(File('assets/coach/catalog.json').readAsStringSync()),
  );
  final rhythms = sdk.rhythmsFromCatalog(published);
  uc.TrainingPlan planFor(List<String> ids) => trainingPlanFromDrills(
    title: 'Test',
    drills: [for (final id in ids) catalog.drillById(id)!],
    sourceCatalog: published,
  );

  test(
    '51 catalog drills guide automatically without placeholder repetitions',
    () {
      final raw = trainingPlanFromDrills(
        title: 'All',
        drills: catalog.drills,
        sourceCatalog: published,
      );
      final plan = expandSegmentedTrainingPlan(raw, catalog);
      expect(
        plan.items.map((item) => item.exerciseId),
        catalog.drills.map((d) => d.id),
      );
      final work = sdk.SessionBuilder(
        rhythms: rhythms,
      ).phases(plan).where((p) => p.isWork);
      expect(work.every((p) => !p.selfPaced), isTrue);
      expect(work.every((p) => p.seconds > 0), isTrue);
      for (final (i, item) in raw.items.indexed) {
        final drill = catalog.drills[i];
        if (drill.dose.mode == DoseMode.manual) {
          final expected = published[drill.id]!.defaultDose;
          expect(item.mode, expected.mode);
          expect(item.reps, expected.reps);
          expect(item.workSeconds, expected.seconds);
          expect(item.restSeconds, expected.restSeconds);
        } else {
          expect(item.sets, drill.dose.sets);
          expect(item.workSeconds ?? item.reps, drill.dose.min);
          expect(item.restSeconds, drill.dose.restSec);
        }
        expect(item.perSide, drill.dose.perSide);
      }
    },
  );

  test('manual fixed-contract fallback exactly matches published defaults', () {
    for (final id in ['forearms-A', 'forearms-C']) {
      final fallback = trainingPlanFromDrills(
        title: 'Test',
        drills: [catalog.drillById(id)!],
      );
      expect(
        fallback.items.single.toJson(),
        planFor([id]).items.single.toJson(),
      );
    }
    final carry = planFor(['forearms-C']).items.single;
    expect(carry.mode, uc.DoseMode.time);
    expect(carry.workSeconds, 30);
    expect(carry.reps, isNull);
    expect(carry.note, catalog.drillById('forearms-C')!.prescription);
    final unknown = catalog
        .drillById('abs-A')!
        .withDose(Dose.manual('unknown distance'));
    expect(
      () => trainingPlanFromDrills(title: 'Unsupported', drills: [unknown]),
      throwsFormatException,
    );
  });

  test('card estimate includes all Y/T/W segments and keeps one parent', () {
    final raw = planFor(['scapular-A']);
    final expanded = expandSegmentedTrainingPlan(raw, catalog);
    final builder = sdk.SessionBuilder();
    final estimated = estimateTrainingPlanSeconds(raw, catalog);
    expect(expanded.items.single.segments, hasLength(3));
    expect(estimated, builder.planSeconds(expanded));
    expect(estimated, greaterThan(builder.planSeconds(raw)));
    expect(raw.items.single.segments, isEmpty);
  });

  test('wrist directions match the fixed catalog and source demonstration', () {
    const cue = '手指朝前、朝侧、朝后、掌背着地依次摇';
    expect(catalog.drillById('forearms-A')!.cues.first, cue);
    final source = (published.raw['drills'] as List).cast<Map>().firstWhere(
      (d) => d['id'] == 'forearms-A',
    );
    expect((source['cues'] as Map)['zh'][0], cue);
    final item = expandSegmentedTrainingPlan(
      planFor(['forearms-A']),
      catalog,
    ).items.single;
    expect(item.segments.map((s) => s.id), [
      'fingers-forward',
      'fingers-sideways',
      'fingers-backward',
      'back-of-hand',
    ]);
    expect(item.segments.map((s) => s.label), ['手指朝前', '手指朝侧', '手指朝后', '手背撑地']);
  });

  for (final entry in {
    'forearms-A': 4,
    'scapular-A': 3,
    'forearms-B': 2,
  }.entries) {
    test(
      '${entry.key} is one parent with ordered segments and one result item',
      () {
        final raw = planFor([entry.key]);
        final plan = expandSegmentedTrainingPlan(raw, catalog);
        final item = plan.items.single;
        expect(plan.blocks.single.id, raw.blocks.single.id);
        expect(plan.blocks.single.type, uc.BlockType.main);
        expect(item.segments.length, entry.value);
        expect(
          item.segments.every((s) => s.exerciseId == item.exerciseId),
          isTrue,
        );
        final builder = sdk.SessionBuilder(rhythms: rhythms);
        final phases = builder.phases(plan);
        final work = phases.where((p) => p.isWork).toList();
        expect(work.map((p) => p.itemIndex).toSet(), {0});
        expect(work.map((p) => p.segmentId), [
          for (var set = 0; set < item.sets; set++)
            ...item.segments.map((s) => s.id),
        ]);
        expect(
          phases
              .where((p) => p.kind == sdk.PhaseKind.rest)
              .map((p) => p.seconds),
          List.filled(item.sets - 1, item.restSeconds.toDouble()),
        );
        final engine = sdk.SessionEngine(phases);
        final seconds = phases.fold<double>(0, (sum, p) => sum + p.seconds);
        engine.update(seconds + .01);
        expect(engine.fullyCompletedExercises, 1);
        final result = sdk.SessionRecorder(
          plan: plan,
          totalExercises: 1,
        ).finish(engine, activeSeconds: seconds);
        expect(result.items, hasLength(1));
        expect(result.items.single.completedSets, item.sets);
        expect(
          expandSegmentedTrainingPlan(plan, catalog).toJson(),
          plan.toJson(),
        );
      },
    );
  }

  test('AI circuit keeps round order and authored block metadata', () {
    final raw = planFor(['forearms-B', 'abs-A']);
    final original = uc.PlanBlock(
      id: 'original',
      name: 'Circuit',
      type: uc.BlockType.circuit,
      rounds: 2,
      restBetweenRoundsSeconds: 48,
      items: raw.items.toList(),
    );
    final plan = expandSegmentedTrainingPlan(
      raw.copyWith(blocks: [original]),
      catalog,
    );
    expect(plan.blocks.single.id, 'original');
    expect(plan.blocks.single.rounds, 2);
    expect(plan.blocks.single.restBetweenRoundsSeconds, 48);
    expect(plan.items.length, 2);
    final work = sdk.SessionBuilder(
      rhythms: rhythms,
    ).phases(plan).where((p) => p.isWork);
    expect(work.map((p) => p.exerciseId), [
      'forearms-B',
      'forearms-B',
      'abs-A',
      'forearms-B',
      'forearms-B',
      'abs-A',
    ]);
    expect(plan.items.first.note, raw.items.first.note);
  });

  test(
    'explicit mixed segments retain own material ids and absent parent dose',
    () {
      final parent = uc.PlanItem(
        exerciseId: 'scapular-A',
        mode: uc.DoseMode.reps,
        sets: 1,
        perSide: false,
        restSeconds: 20,
        segments: const [
          uc.PlanSegment(
            id: 'a',
            exerciseId: 'abs-A',
            mode: uc.DoseMode.time,
            workSeconds: 2,
            label: 'Authored A',
          ),
          uc.PlanSegment(
            id: 'b',
            exerciseId: 'chest-A',
            mode: uc.DoseMode.reps,
            reps: 2,
            label: 'Authored B',
            holdSeconds: 2,
          ),
        ],
      );
      final plan = planFor(['scapular-A']).copyWith(
        blocks: [
          uc.PlanBlock(
            id: 'mixed',
            name: 'Mixed',
            type: uc.BlockType.main,
            items: [parent],
          ),
        ],
      );
      final prepared = expandSegmentedTrainingPlan(plan, catalog);
      expect(prepared.items.single, same(parent));
      final work = sdk.SessionBuilder(
        rhythms: rhythms,
      ).phases(prepared).where((p) => p.isWork);
      expect(work.map((p) => p.exerciseId), ['abs-A', 'chest-A']);
      expect(work.map((p) => p.segment!.label), ['Authored A', 'Authored B']);
    },
  );

  test('unknown segment material rejects the whole plan', () {
    final raw = planFor(['scapular-A']);
    final item = raw.items.single.copyWith(
      segments: const [
        uc.PlanSegment(
          id: 'bad',
          exerciseId: 'missing-action',
          mode: uc.DoseMode.reps,
          reps: 2,
        ),
      ],
    );
    final plan = raw.copyWith(
      blocks: [
        uc.PlanBlock(
          id: 'bad',
          name: 'Bad',
          type: uc.BlockType.main,
          items: [item],
        ),
      ],
    );
    expect(
      () => expandSegmentedTrainingPlan(plan, catalog),
      throwsA(isA<UnknownTrainingDrills>()),
    );
  });

  test('default automatic repetitions preserve SDK right-first policy', () {
    expect(rhythms['chest-A']!.selfPaced, isFalse);
    final side = catalog.drills.firstWhere((d) => d.dose.perSide);
    final phases = sdk.SessionBuilder(
      rhythms: rhythms,
    ).phases(planFor([side.id]));
    expect(phases.firstWhere((p) => p.isWork).side, sdk.Side.right);
  });
}
