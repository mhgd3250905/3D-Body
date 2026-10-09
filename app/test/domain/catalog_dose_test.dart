import 'dart:convert';
import 'dart:io';

import 'package:flare/data/catalog.dart';
import 'package:flutter_test/flutter_test.dart';

import 'fixtures.dart';

void main() {
  final catalog = loadCatalogFixture();

  test(
    'real catalog keeps all 17 groups, 8 source phases, and 51 tiered drills',
    () {
      expect(catalog.groups, hasLength(17));
      expect(
        catalog.phases.map((phase) => phase.source),
        orderedEquals(List.generate(8, (i) => i + 9)),
      );
      expect(catalog.drills, hasLength(51));
      for (final group in catalog.groups) {
        expect(
          catalog.drillsFor(group.id).map((drill) => drill.tier),
          orderedEquals(['A', 'B', 'C']),
        );
      }
      expect(catalog.searchDrills('侧平板', tier: 'A'), hasLength(2));
      expect(
        catalog.searchDrills('side plank', tier: 'A').map((drill) => drill.id),
        orderedEquals(['deltoids-A', 'chest-A', 'hip-abductors-A']),
      );
      expect(catalog.searchDrills('', section: 'core'), hasLength(12));
      expect(catalog.supportFor(11), 'right');
      expect(catalog.supportFor(15), 'left');
      expect(
        catalog.phaseBySource(11)!.muscle('deltoids')!.resolvedSide('left'),
        'left',
      );
      expect(
        () => catalog.groups.first.panels.add('replacement'),
        throwsUnsupportedError,
      );
    },
  );

  test(
    'every real prescription is bounded or an explicitly reviewed manual fallback',
    () {
      final manual = catalog.drills
          .where((drill) => drill.dose.mode == DoseMode.manual)
          .map((drill) => drill.id)
          .toList();
      expect(manual, orderedEquals(['forearms-A', 'forearms-C']));
      for (final drill in catalog.drills) {
        final dose = drill.dose;
        expect(dose.sets, greaterThan(0), reason: drill.id);
        expect(dose.max, greaterThanOrEqualTo(dose.min), reason: drill.id);
        expect(dose.targetForWeek(-1), dose.min, reason: drill.id);
        expect(dose.targetForWeek(100), dose.max, reason: drill.id);
        expect(dose.raw, drill.prescription);
      }
      expect(catalog.drillById('forearms-B')!.dose.sets, 2);
      expect(catalog.drillById('forearms-B')!.dose.setsMax, 3);
      expect(catalog.drillById('forearms-B')!.dose.blockLabels, ['腕屈', '腕伸']);
      expect(catalog.drillById('scapular-A')!.dose.blockLabels, [
        'Y',
        'T',
        'W',
      ]);
      expect(catalog.drillById('hamstrings-C')!.dose.mode, DoseMode.reps);
      expect(catalog.drillById('hamstrings-C')!.dose.min, 4);
    },
  );

  test(
    'range parser rejects bad quantities and prioritizes the work unit over a cue',
    () {
      expect(parseDose('3 组 × 每侧 20–30 秒')!.perSide, isTrue);
      expect(parseDose('2 组 × 1–2 分钟')!.min, 60);
      expect(parseDose('2 组 × 1–2 分钟')!.max, 120);
      expect(parseDose('3 组 × 4–5 次（下放 4 秒）')!.mode, DoseMode.reps);
      expect(parseDose('3 组 × 5–4 次'), isNull);
      expect(parseDose('0 组 × 10 次'), isNull);
      expect(parseDose('3 组 × 0 秒'), isNull);
      expect(parseDose('3 组 × 每侧 20–30 米'), isNull);
      expect(parseDose('2 轮 × 4 个方向 × 10 次'), isNull);
    },
  );

  test(
    'curriculum preserves source suggestions but live gates are draft self-review',
    () {
      expect(catalog.stages, hasLength(6));
      expect(catalog.stages.expand((stage) => stage.lessons), hasLength(18));
      expect(catalog.unreviewed, isTrue);
      expect(
        catalog.stages.every((stage) => stage.draft && !stage.pro),
        isTrue,
      );
      final gate = catalog.stageByNumber(4)!.gates.single;
      expect(gate.sourceKind, 'ai');
      expect(gate.sourceTarget, 70);
      expect(gate.kind, 'self-review');
      expect(gate.target, isNull);
      expect(gate.text, isNot(contains('得分')));
    },
  );

  test(
    'each illustration maps to two actual WebP assets and an original SHA-256',
    () {
      final manifest =
          jsonDecode(
                File('assets/data/source-manifest.json').readAsStringSync(),
              )
              as Map;
      final images = manifest['images'] as Map;
      expect(images.length, 51);
      for (final drill in catalog.drills) {
        final metadata = images[drill.id] as Map;
        expect(metadata['sourceSha256'], matches(RegExp(r'^[0-9a-f]{64}$')));
        for (final path in [
          drill.imageAsset,
          drill.thumbnailAsset,
          // Light theme twin: same pose and highlight on a warm white sweep.
          drill.imageAsset.replaceFirst('drills/', 'drills/light/'),
          drill.thumbnailAsset.replaceFirst('drills/', 'drills/light/'),
        ]) {
          final header = File(path).readAsBytesSync().sublist(0, 12);
          expect(String.fromCharCodes(header.sublist(0, 4)), 'RIFF');
          expect(String.fromCharCodes(header.sublist(8, 12)), 'WEBP');
        }
      }
      expect(catalog.drillById('adductors-B')!.illustrationNote, isNotNull);
    },
  );
}
