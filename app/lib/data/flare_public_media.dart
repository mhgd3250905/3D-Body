// Bundle verified catalogue artwork and fetch training media on demand.
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import 'flare_offline_media.dart';
import 'flare_public_catalog.dart';
import 'flare_v5_drill.dart';
import 'posehub_catalog_updates.dart';

abstract final class FlarePublicMedia {
  static const posterRoot = 'assets/public_posters/';
  static const coverRoot =
      '$posterRoot${PoseHubCatalogUpdates.bundledPackVersion}/cover/';
  static const thumbnailRoot =
      '$posterRoot${PoseHubCatalogUpdates.bundledPackVersion}/thumbnail/';

  /// The active verified snapshot; bare widget tests may omit the policy.
  static trainer.TrainingMediaPolicy? current;

  static trainer.TrainingMediaPolicy? of(BuildContext context) =>
      trainer.TrainingMediaPolicyScope.maybeOf(context) ?? current;

  static String coverAssetFor(String id) =>
      id == flareV5DrillId ? flareV5PosterAsset : '$coverRoot$id.webp';

  static String thumbnailAssetFor(String id) =>
      id == flareV5DrillId ? flareV5PosterAsset : '$thumbnailRoot$id.webp';

  static Future<trainer.TrainingMediaPolicy> load({
    coach.PoseHubAppTestCatalog? activeCatalog,
    String? rootDirectory,
    bool prefetchBeforeTraining = false,
  }) async {
    final catalog = await withFlareWarmupAction(
      activeCatalog ?? await loadFlarePublicCatalog(),
    );
    final bundled =
        trainer.poseHubPackVersionOf(catalog) ==
            PoseHubCatalogUpdates.bundledPackVersion
        ? catalog
        : await withFlareWarmupAction(await loadFlareBundledPublicCatalog());
    final assetsBySha = {
      for (final action in bundled.allActions)
        action.cover.sha256: coverAssetFor(action.id),
      for (final action in bundled.allActions)
        action.thumbnail.sha256: thumbnailAssetFor(action.id),
    };
    if (FlareOfflineMedia.enabled) {
      await FlareOfflineMedia.installVideos(
        bundled,
        rootDirectory: rootDirectory,
      );
    }
    final repository = await trainer.TrainingMediaRepository.fromCatalog(
      catalog: catalog,
      catalogRevision:
          trainer.poseHubPackVersionOf(catalog) ==
                  PoseHubCatalogUpdates.bundledPackVersion &&
              catalog.tryGet(flareWarmupPushupId) != null
          ? catalog.semanticCatalogFile.sha256
          : poseHubCatalogRevisionOf(catalog),
      // The SDK resolves the media root from the catalogue in use.
      mediaBaseUrls: [
        if (!FlareOfflineMedia.enabled)
          trainer.PoseHubActionLibrary.mediaBaseUriFor(catalog),
      ],
      rootDirectory: rootDirectory,
      bundledFileLoader: (file) async {
        final asset = assetsBySha[file.sha256];
        if (asset == null) return null;
        final bytes = await rootBundle.load(asset);
        return bytes.buffer.asUint8List(
          bytes.offsetInBytes,
          bytes.lengthInBytes,
        );
      },
    );
    return _FlareTrainingMediaPolicy(
      repository: repository,
      bundled: bundled,
      posterAssetRoot: coverRoot,
      prefetchBeforeTraining: prefetchBeforeTraining,
    );
  }
}

class _FlareTrainingMediaPolicy extends trainer.TrainingMediaPolicy {
  const _FlareTrainingMediaPolicy({
    required super.repository,
    required this.bundled,
    required super.posterAssetRoot,
    required super.prefetchBeforeTraining,
  });

  final coach.PoseHubAppTestCatalog bundled;

  @override
  String? posterAssetFor(String id) {
    if (id == flareV5DrillId) return flareV5PosterAsset;
    if (bundled.tryGet(id) == null) return null;
    return super.posterAssetFor(id);
  }
}
