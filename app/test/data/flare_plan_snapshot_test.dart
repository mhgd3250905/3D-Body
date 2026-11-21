import 'dart:convert';
import 'dart:io';

import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flare/trainer/trainer_voice.dart' show flarePlanVoiceAssetRoot;
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' show sha256Hex;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart';

import '../domain/fixtures.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'offline startup reads r2 and every plan voice from the bundle',
    () async {
      final updater = PoseHubCatalogUpdater(
        config: PoseHubCatalogUpdates.buildConfig,
        store: MemoryPoseHubCatalogStore(),
        http: _OfflineHttp(),
      );
      expect(await updater.checkNow(), PoseHubCatalogUpdateOutcome.failed);

      final snapshot = await updater.planSnapshotFor(
        'flare',
        catalogPack: PoseHubCatalogUpdates.bundledPackVersion,
        loadBundled: () => loadFlareBundledPlanSnapshot(bundle: _AsyncAssets()),
      );
      expect(snapshot, isNotNull);
      expect(snapshot!.version, 'flare-plans-r2');
      expect(
        snapshot.id,
        'c5d267638431650564e16e01b5a158b2b720453c1f237211a1d43ad4c12af104',
      );
      final catalog = loadCatalogFixture(
        includeFlarePlans: true,
      ).withPlanSnapshot(snapshot);
      expect(catalog.flareWarmupPlan!.items, hasLength(22));
      expect(catalog.flareWarmupPlan!.estimatedMinutes, 17);
      expect(catalog.flareCooldownPlans, hasLength(3));

      final assetsByDigest = <String, String>{};
      for (final name in [
        'flare-supplemental-voice.json',
        'flare-plan-announcements.json',
      ]) {
        final index =
            jsonDecode(
                  await rootBundle.loadString('assets/trainer_voice/$name'),
                )
                as Map<String, dynamic>;
        final clips = index['clips'] as Map<String, dynamic>;
        for (final entry in clips.entries) {
          assetsByDigest[entry.value['sha256'] as String] =
              '$flarePlanVoiceAssetRoot/${entry.key}.m4a';
        }
      }
      expect(snapshot.voiceManifest.files, hasLength(173));
      for (final clip in snapshot.voiceManifest.files.values) {
        final path = assetsByDigest[clip.sha256];
        expect(path, isNotNull, reason: clip.path);
        final asset = await rootBundle.load(path!);
        final bytes = asset.buffer.asUint8List(
          asset.offsetInBytes,
          asset.lengthInBytes,
        );
        expect(bytes.length, clip.bytes, reason: clip.path);
        expect(sha256Hex(bytes), clip.sha256, reason: clip.path);
      }
    },
  );

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

class _OfflineHttp implements PoseHubCatalogHttpClient {
  @override
  Future<PoseHubCatalogHttpResponse> get(
    Uri uri, {
    Map<String, String> headers = const {},
    int maxBytes = 64 * 1024 * 1024,
  }) async => throw const SocketException('Offline');
}

class _AsyncAssets extends CachingAssetBundle {
  // Match the asynchronous asset channel used by the Android host.
  @override
  Future<ByteData> load(String key) => Future(() => rootBundle.load(key));
}
