import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late Catalog catalog;
  late FlareShared shared;
  setUpAll(() async {
    catalog = await Catalog.load();
    shared = await FlareShared.load();
  });

  test('display rounds the current scene schedule up to a minute', () {
    final plan = catalog.plansForAngle(11).last;
    final builder = sdk.SessionBuilder(rhythms: shared.rhythms);
    final estimates = <int>{};
    for (final scene in ['A', 'B', 'C']) {
      final resolved = shared.authoredPlan(plan, catalog, scene);
      final seconds = builder.planSeconds(resolved);
      final display = shared.authoredPlanMinutes(plan, catalog, scene);
      expect(display, (seconds / 60).ceil(), reason: scene);
      estimates.add(display!);
    }
    expect(estimates.length, greaterThan(1));
  });

  test('every bodyweight and home plan uses only allowed equipment', () {
    const bodyweight = {'mat', 'wall', 'chair', 'towel', 'clamp-pad'};
    const home = {...bodyweight, 'band', 'dumbbell', 'slider'};
    final plans = [
      ...catalog.flarePlanAngles.expand(catalog.plansForAngle),
      ...catalog.flarePlanMuscles.expand(catalog.plansForMuscle),
    ];
    for (final plan in plans) {
      for (final (scene, allowed) in [('A', bodyweight), ('B', home)]) {
        final tools = shared.authoredPlanEquipment(plan, scene);
        expect(
          tools.difference(allowed),
          isEmpty,
          reason: '${plan.id} / $scene',
        );
      }
    }
    final wrists = catalog.plansForMuscle('forearms')[1];
    expect(
      shared.authoredPlanEquipment(wrists, 'B'),
      containsAll(['chair', 'dumbbell']),
    );
    expect(shared.authoredPlanEquipment(wrists, 'C'), contains('bench'));
  });

  test('advanced towel pulldown has matching bodyweight and home doses', () {
    final plan = catalog.plansForMuscle('lats').last;
    for (final scene in ['A', 'B']) {
      final exercise = shared
          .authoredPlan(plan, catalog, scene)
          .items
          .singleWhere((item) => item.exerciseId == 'h-towel-pulldown');
      expect((exercise.sets, exercise.reps, exercise.restSeconds), (3, 10, 60));
    }
  });
}
