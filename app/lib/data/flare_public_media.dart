// Bundle verified catalogue artwork and fetch training media on demand.
import 'package:flutter/foundation.dart' show ValueListenable;
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import 'flare_bundled_video_cache_stub.dart'
    if (dart.library.io) 'flare_bundled_video_cache_io.dart';
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
      _activeSupplementalAsset(id) ?? _baselineCoverAsset(id);

  static String thumbnailAssetFor(String id) =>
      _activeSupplementalAsset(id, thumbnail: true) ??
      _baselineThumbnailAsset(id);

  static String? _activeSupplementalAsset(String id, {bool thumbnail = false}) {
    final policy = current;
    return policy is _FlareTrainingMediaPolicy
        ? policy.supplementalArtwork(id, thumbnail: thumbnail)
        : null;
  }

  static String _baselineCoverAsset(String id) =>
      id == flareV5DrillId ? flareV5PosterAsset : '$coverRoot$id.webp';

  static String _baselineThumbnailAsset(String id) =>
      id == flareV5DrillId ? flareV5PosterAsset : '$thumbnailRoot$id.webp';

  static Future<trainer.TrainingMediaPolicy> load({
    coach.PoseHubAppTestCatalog? activeCatalog,
    AssetBundle? bundle,
    String? rootDirectory,
    bool prefetchBeforeTraining = false,
  }) async {
    final assets = bundle ?? rootBundle;
    final baseline = await withFlareWarmupAction(
      activeCatalog ?? await loadFlarePublicCatalog(bundle: assets),
      bundle: assets,
    );
    final supplemental = await FlareSupplementalActions.load(bundle: assets);
    final catalog = supplemental?.apply(baseline) ?? baseline;
    final bundled =
        trainer.poseHubPackVersionOf(baseline) ==
            PoseHubCatalogUpdates.bundledPackVersion
        ? baseline
        : await withFlareWarmupAction(
            await loadFlareBundledPublicCatalog(bundle: assets),
            bundle: assets,
          );
    final supplementalAssets =
        supplemental?.assetsBySha ?? const <String, String>{};
    final assetsBySha = {
      for (final action in bundled.allActions)
        action.cover.sha256: _baselineCoverAsset(action.id),
      for (final action in bundled.allActions)
        action.thumbnail.sha256: _baselineThumbnailAsset(action.id),
      ...supplementalAssets,
    };
    final videos = {
      if (FlareOfflineMedia.enabled)
        for (final action in bundled.allActions)
          if (!flareSupplementalActionIds.contains(action.id))
            action.video.sha256: (
              action.video,
              FlareOfflineMedia.videoAssetFor(action.video.sha256),
            ),
      for (final id in flareSupplementalActionIds)
        if (catalog.tryGet(id) case final action?)
          for (final video in [
            action.video,
            ...action.themedMedia.values.map((variant) => variant.video),
          ])
            if (supplementalAssets[video.sha256] case final asset?)
              video.sha256: (video, asset),
    };
    final videoCache = videos.isEmpty
        ? null
        : await createFlareBundledVideoCache(rootDirectory: rootDirectory);
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
      legacyCacheDirectory: videoCache?.rootDirectory,
      legacyVideos: [
        if (videoCache != null)
          for (final (video, _) in videos.values)
            trainer.CatalogLegacyVideoFile(
              version: flareBundledVideoCacheVersion,
              bytes: video.bytes,
              sha256: video.sha256,
            ),
      ],
      bundledFileLoader: (file) async {
        final asset = assetsBySha[file.sha256];
        if (asset == null) return null;
        final bytes = await assets.load(asset);
        return bytes.buffer.asUint8List(
          bytes.offsetInBytes,
          bytes.lengthInBytes,
        );
      },
    );
    return _FlareTrainingMediaPolicy(
      repository: videoCache == null
          ? repository
          : _FlareBundledVideoRepository(
              repository,
              videoCache,
              assets,
              videos,
            ),
      bundled: bundled,
      supplementalAssets: supplementalAssets,
      posterAssetRoot: coverRoot,
      prefetchBeforeTraining: prefetchBeforeTraining,
    );
  }
}

class _FlareTrainingMediaPolicy extends trainer.TrainingMediaPolicy {
  const _FlareTrainingMediaPolicy({
    required super.repository,
    required this.bundled,
    required this.supplementalAssets,
    required super.posterAssetRoot,
    required super.prefetchBeforeTraining,
  });

  final coach.PoseHubAppTestCatalog bundled;
  final Map<String, String> supplementalAssets;

  String? supplementalArtwork(String id, {bool thumbnail = false}) {
    if (!flareSupplementalActionIds.contains(id)) return null;
    final action = actionFor(id);
    if (action == null) return null;
    return supplementalAssets[(thumbnail ? action.thumbnail : action.cover)
        .sha256];
  }

  @override
  String? posterAssetFor(String id) {
    if (id == flareV5DrillId) return flareV5PosterAsset;
    if (flareSupplementalActionIds.contains(id)) return supplementalArtwork(id);
    if (bundled.tryGet(id) == null) return null;
    return super.posterAssetFor(id);
  }
}

/// The pinned SDK's bundle loader handles images. Stage each bundled clip on
/// first use so its verified video importer can publish the normal cache alias.
class _FlareBundledVideoRepository
    implements
        trainer.CatalogMediaRepository,
        trainer.CatalogMediaPriorityRepository,
        trainer.CatalogMediaVideoPinning {
  _FlareBundledVideoRepository(
    this._delegate,
    this._cache,
    this._assets,
    this._videos,
  );

  final trainer.CatalogMediaRepository _delegate;
  final FlareBundledVideoCache _cache;
  final AssetBundle _assets;
  final Map<String, (coach.PoseHubPackFile, String)> _videos;
  final _pending = <Future<Uri>>{};
  Future<void>? _clearing;

  @override
  Future<Uri> ensureFile(coach.PoseHubPackFile file) => ensureFileWithPriority(
    file,
    priority: trainer.CatalogMediaPriority.current,
  );

  @override
  Future<Uri> ensureFileWithPriority(
    coach.PoseHubPackFile file, {
    required trainer.CatalogMediaPriority priority,
  }) async {
    final local = _videos[file.sha256];
    if (local == null ||
        !file.path.endsWith('.mp4') ||
        file.bytes != local.$1.bytes) {
      return _delegate.ensureFileWithPriority(file, priority: priority);
    }
    if (_clearing case final clearing?) await clearing;
    final job = _prepare(file, local.$2, priority);
    _pending.add(job);
    try {
      return await job;
    } finally {
      _pending.remove(job);
    }
  }

  Future<Uri> _prepare(
    coach.PoseHubPackFile file,
    String asset,
    trainer.CatalogMediaPriority priority,
  ) async {
    await _cache.stage(_assets, asset, file);
    return _delegate.ensureFileWithPriority(file, priority: priority);
  }

  @override
  Future<Uri> ensureAction(String actionId) async {
    final action = catalog.tryGet(actionId);
    if (action == null || !_videos.containsKey(action.video.sha256)) {
      return _delegate.ensureAction(actionId);
    }
    await Future.wait(action.files.values.map(ensureFile), eagerError: true);
    return mediaBaseUri;
  }

  @override
  Future<void> clearVideoCache() => _clearing ??= _clear();

  Future<void> _clear() async {
    try {
      await Future.wait(
        _pending.map((job) => job.then<void>((_) {}, onError: (Object _) {})),
      );
      await _delegate.clearVideoCache();
    } finally {
      _clearing = null;
    }
  }

  @override
  coach.PoseHubAppTestCatalog get catalog => _delegate.catalog;
  @override
  Uri get mediaBaseUri => _delegate.mediaBaseUri;
  @override
  ValueListenable<trainer.CatalogMediaDownloadState> watchFile(
    coach.PoseHubPackFile file,
  ) => _delegate.watchFile(file);
  @override
  ValueListenable<trainer.CatalogMediaDownloadState> watchAction(
    String actionId,
  ) => _delegate.watchAction(actionId);
  @override
  Future<Uri?> cachedVideo(String actionId) => _delegate.cachedVideo(actionId);
  @override
  void Function() retainVideo(String actionId) =>
      _delegate.retainVideo(actionId);
  @override
  void Function() retainVideoFile(coach.PoseHubPackFile file) =>
      (_delegate as trainer.CatalogMediaVideoPinning).retainVideoFile(file);
  @override
  Future<int> videoCacheBytes() => _delegate.videoCacheBytes();
  @override
  void dispose() => _delegate.dispose();
}
