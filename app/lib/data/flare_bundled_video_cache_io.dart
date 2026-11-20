import 'dart:io';

import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:ugk_coach/ugk_coach.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart';

import 'flare_bundled_video_cache_stub.dart';

export 'flare_bundled_video_cache_stub.dart'
    show FlareBundledVideoCache, flareBundledVideoCacheVersion;

Future<FlareBundledVideoCache?> createFlareBundledVideoCache({
  String? rootDirectory,
}) async =>
    _VideoCache(rootDirectory ?? (await getApplicationCacheDirectory()).path);

class _VideoCache implements FlareBundledVideoCache {
  _VideoCache(this.rootDirectory);

  @override
  final String rootDirectory;
  final _jobs = <String, Future<void>>{};

  @override
  Future<void> stage(AssetBundle assets, String asset, PoseHubPackFile file) {
    return _jobs[file.sha256] ??= _write(assets, asset, file).whenComplete(() {
      _jobs.remove(file.sha256);
    });
  }

  Future<void> _write(
    AssetBundle assets,
    String asset,
    PoseHubPackFile file,
  ) async {
    // The SDK's verified legacy importer reads version/SHA under this root.
    final folder = Directory(
      '$rootDirectory/training-media/$flareBundledVideoCacheVersion',
    );
    final target = File('${folder.path}/${file.sha256}');
    try {
      if (await target.length() == file.bytes &&
          sha256Hex(await target.readAsBytes()) == file.sha256) {
        return;
      }
    } on FileSystemException {
      // A cleared or unreadable cache can be restored from the asset.
    }
    final data = await assets.load(asset);
    final bytes = data.buffer.asUint8List(
      data.offsetInBytes,
      data.lengthInBytes,
    );
    if (bytes.length != file.bytes || sha256Hex(bytes) != file.sha256) {
      throw const CatalogMediaException(
        'integrity',
        'Bundled video integrity mismatch.',
      );
    }
    await folder.create(recursive: true);
    final scratch = await folder.createTemp('publish-');
    final pending = File('${scratch.path}/video.part');
    try {
      await pending.writeAsBytes(bytes, flush: true);
      await pending.rename(target.path);
    } finally {
      if (await pending.exists()) await pending.delete();
      await scratch.delete();
    }
  }
}
