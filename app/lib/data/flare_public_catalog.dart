// Read the shipped public definitions through the SDK's verified adapter.
import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import 'posehub_catalog_updates.dart';

const flarePublicCatalogAsset = 'assets/public_media/catalog.json';
const flarePublicSemanticsAsset = 'assets/public_media/catalog/catalog.json';
const flareWarmupPushupId = 't-kneeling-scap-pushup';

const _flareWarmupActionAsset = 'assets/public_media/flare-warmup-action.json';
final _warmupCatalogs = Expando<Future<coach.PoseHubAppTestCatalog>>();

/// Project the one exact warm-up action from Pose-Hub r2-v19. The bundled
/// delivery and canonical bytes stay intact for the hot-update verifier.
Future<coach.PoseHubAppTestCatalog> withFlareWarmupAction(
  coach.PoseHubAppTestCatalog pack, {
  AssetBundle? bundle,
}) async {
  if (trainer.poseHubPackVersionOf(pack) !=
          PoseHubCatalogUpdates.bundledPackVersion ||
      pack.tryGet(flareWarmupPushupId) != null) {
    return pack;
  }

  return _warmupCatalogs[pack] ??= _addFlareWarmupAction(
    pack,
    bundle ?? rootBundle,
  );
}

Future<coach.PoseHubAppTestCatalog> _addFlareWarmupAction(
  coach.PoseHubAppTestCatalog pack,
  AssetBundle bundle,
) async {
  final data = await bundle.load(_flareWarmupActionAsset);
  final supplement =
      jsonDecode(
            utf8.decode(
              data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
            ),
          )
          as Map<String, dynamic>;
  final action = supplement['action'] as Map<String, dynamic>;
  final definition = supplement['definition'] as Map<String, dynamic>;
  if (action['id'] != flareWarmupPushupId ||
      definition['id'] != flareWarmupPushupId ||
      action['availableForTraining'] != true) {
    throw const FormatException('Invalid Flare warm-up action');
  }

  final canonicalData = await bundle.load(flarePublicSemanticsAsset);
  final canonicalBytes = canonicalData.buffer.asUint8List(
    canonicalData.offsetInBytes,
    canonicalData.lengthInBytes,
  );
  if (coach.sha256Hex(canonicalBytes) != pack.semanticCatalogFile.sha256) {
    throw const FormatException('Unexpected Flare warm-up baseline');
  }
  final canonical =
      jsonDecode(utf8.decode(canonicalBytes)) as Map<String, dynamic>;
  final semantics = {
    ...canonical,
    'drills': [...canonical['drills'] as List, definition],
  };
  final semanticsBytes = utf8.encode(jsonEncode(semantics));
  final source = pack.raw;
  final summary = source['trainingSemantics'] as Map;
  final distribution = source['mediaDistribution'] as Map;
  final files = (action['files'] as Map).values.map(
    coach.PoseHubPackFile.fromJson,
  );

  return coach.PoseHubAppTestCatalog.fromJson({
    ...source,
    'actions': [...source['actions'] as List, action],
    'totalCount': (source['totalCount'] as int) + 1,
    'readyCount': (source['readyCount'] as int) + 1,
    'trainingSemantics': {
      ...summary,
      'definitionCompleteCount':
          (summary['definitionCompleteCount'] as int) + 1,
      'definitionCompleteIds': [
        ...summary['definitionCompleteIds'] as List,
        flareWarmupPushupId,
      ],
    },
    'semanticCatalog': {
      ...source['semanticCatalog'] as Map,
      'bytes': semanticsBytes.length,
      'sha256': coach.sha256Hex(semanticsBytes),
    },
    'mediaDistribution': {
      ...distribution,
      'mediaFiles': (distribution['mediaFiles'] as int) + files.length,
      'mediaBytes':
          (distribution['mediaBytes'] as int) +
          files.fold(0, (bytes, file) => bytes + file.bytes),
    },
  }, semanticCatalog: semantics);
}

/// Prefer the SDK-verified hot-update cache unless it predates Flare's
/// bundled r2-v18 baseline (for example after an offline app upgrade).
Future<coach.PoseHubAppTestCatalog> loadFlarePublicCatalog({
  AssetBundle? bundle,
  trainer.PoseHubCatalogStore? verifiedCache,
}) async {
  final store = verifiedCache ?? PoseHubCatalogUpdates.activeStore;
  if (store != null) {
    final cached = await trainer.readVerifiedPoseHubCatalog(store);
    if (cached != null) {
      final order = trainer.comparePoseHubPacks(
        trainer.poseHubPackVersionOf(cached),
        PoseHubCatalogUpdates.bundledPackVersion,
      );
      if (order != null && order >= 0) return cached;
    }
  }
  return loadFlareBundledPublicCatalog(bundle: bundle);
}

/// Reads the shipped baseline even when a newer pack is active.
Future<coach.PoseHubAppTestCatalog> loadFlareBundledPublicCatalog({
  AssetBundle? bundle,
}) async {
  final assets = bundle ?? rootBundle;
  // Large loadString assets decode in an isolate outside widget fake clocks.
  // Read exact bytes; the SDK verifies the canonical semantics descriptor.
  final delivery = await assets.load(flarePublicCatalogAsset);
  final semantics = await assets.load(flarePublicSemanticsAsset);
  return coach.PoseHubAppTestCatalog.fromBytes(
    delivery.buffer.asUint8List(delivery.offsetInBytes, delivery.lengthInBytes),
    semanticCatalogBytes: semantics.buffer.asUint8List(
      semantics.offsetInBytes,
      semantics.lengthInBytes,
    ),
  );
}

/// Match SF's public-definition adapter: authored execution is authoritative;
/// a media loop never supplies a training cadence. Unknown reps stay manual.
Map<String, trainer.Rhythm> flarePublicRhythms(
  coach.PoseHubAppTestCatalog pack,
) {
  final catalog = pack.toAiCatalog();
  return Map.unmodifiable({
    for (final drill in catalog.drills)
      drill.id: _publicRhythm(pack.tryGet(drill.id)!, drill),
  });
}

trainer.Rhythm _publicRhythm(
  coach.PoseHubPackAction action,
  coach.Drill drill,
) {
  // Canonical legacy definitions do not contain the delivery's execution
  // extension. Read it from the verified row rather than dropping its timing.
  final metadata = action.raw['rhythm'] as Map?;
  final execution = metadata?['execution'];
  var rhythm = execution is Map
      ? trainer.Rhythm.fromJson(Map<String, dynamic>.from(execution))
      : drill.defaultDose.mode == coach.DoseMode.reps
      ? trainer.Rhythm.selfPacedReps
      : trainer.Rhythm.timedHold;
  // Dose's public typed model omits this extension. SF retains the exact raw
  // canonical/defaultDose value rather than deriving a hold from the video.
  final dose = drill.raw['defaultDose'] as Map?;
  final hold = dose?['holdSeconds'];
  if (hold is int && rhythm.counted) rhythm = rhythm.withHold(hold);
  return rhythm;
}

/// The fitter sees the same per-rep cycle as the player. One-off lead and full
/// phases remain on the SDK rhythm and are measured by executionTiming.
coach.Catalog flareCoachCatalogFromPublic(
  coach.PoseHubAppTestCatalog pack, {
  Map<String, trainer.Rhythm>? rhythms,
}) {
  final source = pack.toAiCatalog();
  final execution = rhythms ?? flarePublicRhythms(pack);
  final drills = <Map<String, Object?>>[];
  for (final drill in source.drills) {
    final rhythm = execution[drill.id];
    if (drill.defaultDose.mode != coach.DoseMode.reps ||
        rhythm == null ||
        !rhythm.counted) {
      drills.add(drill.raw);
      continue;
    }
    final cycle = rhythm.cycleFor();
    if (!cycle.isFinite || cycle <= 0) {
      drills.add(drill.raw);
      continue;
    }
    final assets = Map<String, Object?>.from(
      drill.raw['assets'] as Map? ?? const {},
    );
    final video = Map<String, Object?>.from(
      assets['video'] as Map? ?? const {},
    );
    final sources = List<Object?>.from(video['sources'] as List? ?? const []);
    final first = sources.indexWhere(
      (value) => coach.AssetSource.tryParse(value) != null,
    );
    if (first >= 0) {
      sources[first] = {
        ...Map<String, Object?>.from(sources[first] as Map),
        'repSeconds': cycle,
      };
    } else {
      // Only project an existing, SDK-verified public video source.
      final file = pack.tryGet(drill.id)?.video.raw;
      if (file == null) {
        drills.add(drill.raw);
        continue;
      }
      final projected = <String, Object?>{
        ...file,
        'app': 'pose-hub',
        'repSeconds': cycle,
      };
      if (coach.AssetSource.tryParse(projected) == null) {
        drills.add(drill.raw);
        continue;
      }
      sources.insert(0, projected);
    }
    drills.add({
      ...drill.raw,
      'assets': {
        ...assets,
        'video': {...video, 'sources': sources},
      },
    });
  }
  return coach.Catalog.fromJson({...source.raw, 'drills': drills});
}
