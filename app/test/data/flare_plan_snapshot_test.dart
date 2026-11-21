import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' show sha256Hex;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart';

import '../domain/fixtures.dart';

void main() {
  test(
    'verified snapshots replace supplemental plans and preserve old IDs',
    () {
      final catalog = loadCatalogFixture(includeFlarePlans: true);
      final baseline = catalog.flareWarmupPlan!;
      final source =
          jsonDecode(File('assets/data/flare-plans.json').readAsStringSync())
              as Map<String, dynamic>;
      final rows = (source['plans'] as List).cast<Map<String, dynamic>>();
      final warmup = rows.singleWhere((plan) => plan['id'] == baseline.id);
      warmup['estimatedMinutes'] = 15;
      final voice = utf8.encode(jsonEncode({'schema': 1, 'files': []}));
      source['voice_manifest'] = {
        'url': 'https://example.test/voice/manifest.json',
        'bytes': voice.length,
        'sha256': sha256Hex(voice),
      };
      final snapshot = PoseHubPlanSnapshot.fromBytes(
        utf8.encode(jsonEncode(source)),
        voice,
        minSdk: '1.0.2',
      );

      final active = catalog.withPlanSnapshot(snapshot);
      expect(active.planSnapshot?.id, snapshot.id);
      expect(active.flareWarmupPlan?.estimatedMinutes, 15);
      expect(active.flareCooldownPlans, hasLength(3));
      expect(active.flarePlanCounts, catalog.flarePlanCounts);
      expect(active.bundledSupplementalPlanById(baseline.id), same(baseline));
      expect(active.localized({}).planSnapshot?.id, snapshot.id);
      expect(active.withPlanSnapshot(null).flareWarmupPlan, same(baseline));
    },
  );
}
