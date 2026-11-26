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

  test('only dev preview selects bundled r3 on a compatible catalog', () async {
    final store = MemoryPoseHubCatalogStore();
    Future<PoseHubCatalogUpdates> open(PoseHubCatalogChannel channel) async =>
        (await PoseHubCatalogUpdates.start(
          config: PoseHubCatalogUpdateConfig(channel: channel),
          store: store,
          http: _OfflineHttp(),
          previewWarmupR3: true,
        ))!;

    final dev = await open(PoseHubCatalogChannel.dev);
    addTearDown(dev.dispose);
    final baseline = await dev.planSnapshotFor('r2-v25');
    expect(baseline!.version, 'flare-plans-r2');

    // r2 is already the verified selection on a data-preserving upgrade.
    final devPlans = PoseHubChannelPlanStore(
      store: store,
      channelUri: dev.updater.config.pointerUri,
    );
    await devPlans.install(baseline);
    final preview = (await dev.planSnapshotFor('r2-v26'))!;
    expect(preview.version, 'flare-plans-r3');
    expect((await dev.restorePlanSnapshot(preview.id))?.id, preview.id);
    expect((await dev.restorePlanSnapshot(baseline.id))?.id, baseline.id);
    final catalog = loadCatalogFixture(
      includeFlarePlans: true,
    ).withPlanSnapshot(preview);
    final warmup = catalog.flareWarmupPlan!;
    expect(warmup.estimatedMinutes, 20);
    expect(warmup.items.map((item) => item.drill), [
      't-quadruped-wrist-shift',
      't-quadruped-wrist-circle',
      't-quadruped-backhand-press',
      'h-catcow-quad',
      'h-kneeling-thread-needle',
      'h-quad-cars',
      'h-adductor-rock',
      't-9090-hip-switch-planted',
      't-9090-back-knee-lift',
      'h-sumo-pry',
      'n-straddle-fold',
      't-seated-straddle-lift-1leg',
      't-seated-straddle-lifts',
      'adductors-A',
      'h-good-morning',
      'serratus-A',
      'h-tabletop',
    ]);
    final r2 = loadCatalogFixture(
      includeFlarePlans: true,
    ).withPlanSnapshot(baseline).flareWarmupPlan!;
    const reusedCues = {
      'h-catcow-quad': 6,
      'h-kneeling-thread-needle': 7,
      'h-sumo-pry': 16,
      'h-good-morning': 18,
    };
    final oldVoiceFiles = preview.voiceManifest.files.keys;
    for (final item in warmup.items) {
      final slot = reusedCues[item.drill];
      if (slot != null) {
        expect(item.drill, r2.items[slot - 1].drill);
        expect(item.voiceKey, 'supplemental.general-warmup.$slot');
        expect(item.voiceCue, r2.items[slot - 1].voiceCue);
      } else {
        expect(item.voiceKey, startsWith('supplemental.general-warmup-r3.'));
      }
      expect(
        oldVoiceFiles.any(
          (file) => file.split('/').last == '${item.voiceKey}.m4a',
        ),
        slot != null,
      );
    }

    final stable = await open(PoseHubCatalogChannel.stable);
    addTearDown(stable.dispose);
    expect((await stable.planSnapshotFor('r2-v26'))?.id, baseline.id);

    final publishedR3 = PoseHubPlanSnapshot.fromBytes(
      [...preview.planPack.jsonBytes, 10],
      File('assets/data/flare-plan-voice-manifest.json').readAsBytesSync(),
      minSdk: preview.minSdk,
    );
    await devPlans.install(publishedR3);
    expect((await dev.planSnapshotFor('r2-v26'))?.id, publishedR3.id);
  });

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
