import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import 'flare_public_catalog.dart';

/// Uses the exact public catalogue media shipped for this internal build.
abstract final class FlareOfflineMedia {
  static const enabled = bool.fromEnvironment('FLARE_OFFLINE_PUBLIC_MEDIA');
  static const _assetRoot = 'assets/public_media/offline';

  static String videoAssetFor(String sha256) => '$_assetRoot/video/$sha256.mp4';

  static Future<trainer.VoiceSource> withCatalogVoice(
    trainer.VoiceSource primary, {
    required coach.PoseHubAppTestCatalog catalog,
    String? cacheDirectory,
  }) async {
    if (!enabled) {
      return trainer.withPoseHubCatalogVoice(
        primary,
        catalog: catalog,
        cacheDirectory: cacheDirectory,
      );
    }
    final index = trainer.CatalogVoiceIndex.fromCatalogJson(
      catalog.raw,
      baseUrl: trainer.PoseHubActionLibrary.mediaBaseUriFor(catalog),
    );
    final String directory;
    try {
      directory =
          cacheDirectory ??
          '${(await getApplicationSupportDirectory()).path}/ugk_catalog_voice';
    } on Object {
      return primary;
    }
    final supplemental = await FlareSupplementalActions.load();
    return trainer.LayeredVoiceSource(
      primary: primary,
      catalog: index,
      cache: trainer.CatalogVoiceCache.files(
        directory,
        http: _BundledVoiceFiles({
          for (final clip in index.allClips)
            clip.url:
                supplemental?.assetsBySha[clip.sha256] ??
                '$_assetRoot/voice/${clip.sha256}.m4a',
        }),
      ),
    );
  }
}

class _BundledVoiceFiles implements trainer.PoseHubCatalogHttpClient {
  _BundledVoiceFiles(this.assets);

  final Map<Uri, String> assets;

  @override
  Future<trainer.PoseHubCatalogHttpResponse> get(
    Uri uri, {
    Map<String, String> headers = const {},
    int maxBytes = 64 * 1024 * 1024,
  }) async {
    final asset = assets[uri];
    if (asset == null) {
      return trainer.PoseHubCatalogHttpResponse(404, Uint8List(0));
    }
    final data = await rootBundle.load(asset);
    final bytes = data.buffer.asUint8List(
      data.offsetInBytes,
      data.lengthInBytes,
    );
    if (bytes.length > maxBytes) {
      return trainer.PoseHubCatalogHttpResponse(413, Uint8List(0));
    }
    return trainer.PoseHubCatalogHttpResponse(200, bytes);
  }
}
