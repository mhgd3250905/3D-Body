// Flare configuration for the SDK public media policy. Media are fetched on
// demand from the shared public pack; nothing is hosted or uploaded by Flare.
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import 'flare_public_catalog.dart';

abstract final class FlarePublicMedia {
  static const posterRoot = 'assets/public_posters/';

  /// Set once at startup; null in bare widget tests (SDK media then disabled).
  static trainer.TrainingMediaPolicy? current;

  static Future<trainer.TrainingMediaPolicy> load({
    String? rootDirectory,
    bool prefetchBeforeTraining = true,
  }) async {
    final catalog = await loadFlarePublicCatalog();
    final repository = await trainer.TrainingMediaRepository.fromCatalog(
      catalog: catalog,
      catalogRevision: trainer.PoseHubActionLibrary.catalogSha256,
      mediaBaseUrls: [
        Uri.parse(trainer.PoseHubActionLibrary.mediaReleaseBaseUri),
      ],
      rootDirectory: rootDirectory,
    );
    return trainer.TrainingMediaPolicy(
      repository: repository,
      posterAssetRoot: posterRoot,
      prefetchBeforeTraining: prefetchBeforeTraining,
    );
  }
}
