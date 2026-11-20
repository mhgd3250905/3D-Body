import 'package:flutter/services.dart';
import 'package:ugk_coach/ugk_coach.dart';

const flareBundledVideoCacheVersion = '21.0.0';

abstract interface class FlareBundledVideoCache {
  String get rootDirectory;

  Future<void> stage(AssetBundle assets, String asset, PoseHubPackFile file);
}

Future<FlareBundledVideoCache?> createFlareBundledVideoCache({
  String? rootDirectory,
}) async => null;
