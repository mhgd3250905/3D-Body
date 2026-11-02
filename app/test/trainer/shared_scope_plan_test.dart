import 'dart:io';

import 'package:flare/coach/plan_mapping.dart';
import 'package:flare/data/flare_drill_resolver.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';

// Device bug: 「撑地前手腕与肩胛热身」 used SDK shared public actions that are
// absent from Flare's legacy 51-drill catalog and failed to start.
void main() {
  final catalog = loadCatalogFixture();
  final pack = uc.PoseHubAppTestCatalog.fromBytes(
    File(flarePublicCatalogAsset).readAsBytesSync(),
    semanticCatalogBytes: File(flarePublicSemanticsAsset).readAsBytesSync(),
  );
  final shared = flareCoachCatalogFromPublic(pack);
  const ids = [
    'h-standing-wrist-deviation',
    'h-standing-forearm-rotation',
    'h-bilateral-upper-back-hug',
  ];
  final plan = trainingPlanFromDrills(
    title: '撑地前手腕与肩胛热身',
    drills: [for (final id in ids) sharedDisplayDrill(shared, id)!],
  );
  bool known(String id) => shared[id] != null;

  test('共享 211 动作计划可映射', () {
    for (final id in ids) {
      expect(catalog.drillById(id), isNull, reason: '$id 不在旧目录');
      expect(shared[id], isNotNull, reason: '$id 在共享目录');
    }
    final mapper = CoachPlanMapper(catalog, shared: shared);
    expect(mapper.missingIds(plan), isEmpty);
    expect(mapper.entries(plan).map((e) => e.drill.id), ids);
    expect(CoachPlanMapper(catalog).missingIds(plan), ids.toSet());
  });

  test('共享 211 动作计划可启动（校验 + 展开）', () {
    validateTrainingPlan(plan, catalog, known: known);
    final expanded = expandSegmentedTrainingPlan(plan, catalog, known: known);
    expect(expanded.items.map((i) => i.exerciseId), ids);
    expect(estimateTrainingPlanSeconds(plan, catalog), greaterThan(0));
  });

  test('真正未知的 ID 仍拒绝启动', () {
    final json = plan.toJson();
    final bad = const uc.PlanCodec().decode({
      ...json,
      'blocks': [
        {
          ...plan.blocks.first.toJson(),
          'items': [
            {...plan.items.first.toJson(), 'exerciseId': 'no-such-move'},
          ],
        },
      ],
    });
    expect(
      () => expandSegmentedTrainingPlan(bad, catalog, known: known),
      throwsA(isA<UnknownTrainingDrills>()),
    );
  });
}
