import 'dart:io';

import 'package:flare/data/flare_offline_media.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/trainer/trainer_voice.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'offline library plays the bundled r2-v19 warm-up video from a cold cache',
    () async {
      final root = await Directory.systemTemp.createTemp('flare-offline-');
      addTearDown(() => root.delete(recursive: true));

      final policy = await FlarePublicMedia.load(rootDirectory: root.path);
      final repository = policy.repository;
      addTearDown(repository.dispose);

      final video = repository.catalog.tryGet(flareWarmupPushupId)!.video;
      final local = await repository.ensureFile(video);
      expect(local.scheme, 'file');
      expect(await File.fromUri(local).length(), video.bytes);
      expect(
        coach.sha256Hex(await File.fromUri(local).readAsBytes()),
        video.sha256,
      );
    },
    skip: !FlareOfflineMedia.enabled,
  );

  test(
    'all six r2-v21 action voices resolve from the bundle on a cold cache',
    () async {
      final root = await Directory.systemTemp.createTemp(
        'flare-offline-voice-',
      );
      addTearDown(() => root.delete(recursive: true));

      final catalog = await withFlareSupplementalActions(
        await loadFlareBundledPublicCatalog(),
      );
      final source =
          await FlareOfflineMedia.withCatalogVoice(
                await loadTrainerVoiceSource(),
                catalog: catalog,
                cacheDirectory: root.path,
              )
              as trainer.LayeredVoiceSource;
      final clips = source.catalog.allClips.where(
        (clip) => flareSupplementalActionIds.contains(clip.actionId),
      );
      expect(clips, hasLength(102));
      final result = await source.cache.prefetch(clips);
      expect(result.failed, isEmpty);
      expect(result.ready, 102);
    },
    skip: !FlareOfflineMedia.enabled,
  );
}
