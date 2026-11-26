import 'dart:io';

import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'plan action details and video descriptors come from official r2-v29',
    () async {
      final bundled = await loadFlareBundledPublicCatalog();
      final shared = await FlareShared.load(activeCatalog: bundled);
      final data = await rootBundle.load(flarePublicCatalogAsset);
      final bytes = data.buffer.asUint8List(
        data.offsetInBytes,
        data.lengthInBytes,
      );
      expect(
        coach.sha256Hex(bytes),
        PoseHubCatalogUpdates.bundledCatalogSha256,
      );
      expect(trainer.poseHubPackVersionOf(bundled), 'r2-v29');
      expect(shared.pack, same(bundled));
      final needle = bundled.tryGet('h-kneeling-thread-needle')!;
      expect((needle.raw['rhythm'] as Map)['coverFrame'], isNull);
      expect(needle.video.path, contains('/r2-v24/'));
      expect(
        needle.video.sha256,
        'a6c259c649667d08539ee71adf045867b7f46a30cff0087f7b9b3a788f01a7b4',
      );
      expect(
        needle.cover.sha256,
        'c0fddbfe287ce868eedcce8f8c23cd60f30d826567c3973cc9df9c01d690929d',
      );
      expect(flareSupplementalActionIds, hasLength(16));
      final canonical = bundled.toAiCatalog();
      for (final id in {flareWarmupPushupId, ...flareSupplementalActionIds}) {
        final action = shared.pack.tryGet(id)!;
        final definition = shared.catalog[id]!;
        expect(action.availableForTraining, isTrue, reason: id);
        expect(action.video.downloadUri?.scheme, 'https', reason: id);
        expect(action.video.sha256, hasLength(64), reason: id);
        expect(definition.purpose, isNotEmpty, reason: id);
        expect(definition.purpose, canonical[id]!.purpose, reason: id);
        expect(definition.cues['zh'], isNotEmpty, reason: id);
        expect(definition.cues, canonical[id]!.cues, reason: id);
        expect(shared.allowedActionIds, isNot(contains(id)));
      }
    },
  );

  test(
    'plan artwork resolves offline with no packaged action videos',
    () async {
      final directory = await Directory(
        '.dart_tool',
      ).createTemp('flare-plan-art-');
      addTearDown(() => directory.delete(recursive: true));
      final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
      final obsoleteAssets = manifest.listAssets().where(
        (path) => path.startsWith('assets/public_media/flare-'),
      );
      expect(obsoleteAssets, isEmpty);

      var networkCalls = 0;
      await HttpOverrides.runZoned(
        () async {
          final policy = await FlarePublicMedia.load(
            rootDirectory: directory.path,
          );
          addTearDown(policy.repository.dispose);
          final bundled = await loadFlareBundledPublicCatalog();
          for (final action in bundled.allActions) {
            final id = action.id;
            expect(
              policy.posterAssetFor(id),
              FlarePublicMedia.coverAssetFor(id),
            );
            expect(await policy.repository.cachedVideo(id), isNull, reason: id);
            for (final file in [action.cover, action.thumbnail]) {
              final uri = await policy.repository.ensureFile(file);
              final bytes = await File.fromUri(uri).readAsBytes();
              expect(bytes.length, file.bytes, reason: file.path);
              expect(coach.sha256Hex(bytes), file.sha256, reason: file.path);
            }
          }
        },
        createHttpClient: (_) {
          networkCalls++;
          throw StateError(
            'Unexpected network access while loading bundled artwork',
          );
        },
      );
      expect(networkCalls, 0);
    },
  );
}
