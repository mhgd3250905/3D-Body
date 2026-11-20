import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

/// Uses the exact public catalogue media shipped for this internal build.
abstract final class FlareOfflineMedia {
  static const enabled = bool.fromEnvironment('FLARE_OFFLINE_PUBLIC_MEDIA');
  static const _assetRoot = 'assets/public_media/offline';

  static Future<void> installVideos(
    coach.PoseHubAppTestCatalog catalog, {
    String? rootDirectory,
  }) async {
    final root = rootDirectory ?? (await getApplicationSupportDirectory()).path;
    final store = trainer.createPoseHubCatalogFileStore(root);
    // The SDK adopts and verifies local videos from training-media/<version>/<sha>.
    const seed = 'training-media/0.0.0';
    for (final action in catalog.allActions) {
      final video = action.video;
      final name = '$seed/${video.sha256}';
      final cached = await store.read(name);
      if (cached != null &&
          cached.length == video.bytes &&
          coach.sha256Hex(cached) == video.sha256) {
        continue;
      }
      final bytes = await _read('video/${video.sha256}.mp4');
      if (bytes.length != video.bytes ||
          coach.sha256Hex(bytes) != video.sha256) {
        throw const FormatException('Bundled Flare video checksum mismatch.');
      }
      await store.writeAtomic(name, bytes);
    }
  }

  static Future<trainer.VoiceSource> withCatalogVoice(
    trainer.VoiceSource primary, {
    required coach.PoseHubAppTestCatalog catalog,
  }) async {
    if (!enabled) {
      return trainer.withPoseHubCatalogVoice(primary, catalog: catalog);
    }
    final index = trainer.CatalogVoiceIndex.fromCatalogJson(
      catalog.raw,
      baseUrl: trainer.PoseHubActionLibrary.mediaBaseUriFor(catalog),
    );
    final String directory;
    try {
      directory = (await getApplicationSupportDirectory()).path;
    } on Object {
      return primary;
    }
    return trainer.LayeredVoiceSource(
      primary: primary,
      catalog: index,
      cache: trainer.CatalogVoiceCache.files(
        '$directory/ugk_catalog_voice',
        http: _BundledVoiceFiles({
          for (final clip in index.allClips) clip.url: clip.sha256,
        }),
      ),
    );
  }

  static Future<Uint8List> _read(String path) async {
    final data = await rootBundle.load('$_assetRoot/$path');
    return data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
  }
}

class _BundledVoiceFiles implements trainer.PoseHubCatalogHttpClient {
  _BundledVoiceFiles(this.digests);

  final Map<Uri, String> digests;

  @override
  Future<trainer.PoseHubCatalogHttpResponse> get(
    Uri uri, {
    Map<String, String> headers = const {},
    int maxBytes = 64 * 1024 * 1024,
  }) async {
    final digest = digests[uri];
    if (digest == null) {
      return trainer.PoseHubCatalogHttpResponse(404, Uint8List(0));
    }
    final bytes = await FlareOfflineMedia._read('voice/$digest.m4a');
    if (bytes.length > maxBytes) {
      return trainer.PoseHubCatalogHttpResponse(413, Uint8List(0));
    }
    return trainer.PoseHubCatalogHttpResponse(200, bytes);
  }
}
