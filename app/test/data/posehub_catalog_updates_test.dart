import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'old pack upgrades atomically with display files only and reopens offline',
    () async {
      final root = await Directory('.dart_tool').createTemp('flare-display-');
      addTearDown(() async {
        sdk.PoseHubActionLibrary.useVerifiedCache(null);
        PoseHubCatalogUpdates.activeStore = null;
        await root.delete(recursive: true);
      });
      sdk.PoseHubCatalogStore openStore() =>
          sdk.createPoseHubCatalogFileStore('${root.path}/catalog');
      final pointer = PoseHubCatalogUpdates.buildConfig.pointerUri;
      final http = CatalogTestHttp(pointer);
      final catalogBytes = await File(flarePublicCatalogAsset).readAsBytes();
      final semanticBytes = await File(flarePublicSemanticsAsset).readAsBytes();
      final published = coach.PoseHubAppTestCatalog.fromBytes(
        catalogBytes,
        semanticCatalogBytes: semanticBytes,
      );
      const nextPack = 'r2-v22';
      final previous = await _oldBaseline(published, semanticBytes);
      expect(sdk.poseHubPackVersionOf(previous), 'r2-v11');
      expect(sdk.poseHubPackVersionOf(published), nextPack);
      expect(
        coach.sha256Hex(catalogBytes),
        PoseHubCatalogUpdates.bundledCatalogSha256,
      );
      final mediaBase = sdk.PoseHubActionLibrary.mediaBaseUriFor(published);
      final artwork = {
        for (final action in published.allActions) ...{
          action.cover.resolve(mediaBase): File(
            '${FlarePublicMedia.coverRoot}${action.id}.webp',
          ),
          action.thumbnail.resolve(mediaBase): File(
            '${FlarePublicMedia.thumbnailRoot}${action.id}.webp',
          ),
        },
      };
      for (final entry in artwork.entries) {
        http.files[entry.key] = entry.value.readAsBytes;
      }
      http.publish(nextPack, catalogBytes, published, semanticBytes);

      Future<PoseHubCatalogUpdates> launch(
        sdk.PoseHubCatalogStore store,
      ) async => (await PoseHubCatalogUpdates.start(
        store: store,
        http: http,
        assetRootDirectory: root.path,
        loadLocal: () async =>
            await sdk.readVerifiedPoseHubCatalog(store) ?? previous,
      ))!;

      final store = openStore();
      final first = await launch(store);
      final progress = <coach.PoseHubDisplayUpdateProgress>[];
      final changes = <coach.PoseHubAppTestCatalog>[];
      final progressSub = first.updater.displayProgress.listen(progress.add);
      final changesSub = first.updater.catalogChanges.listen(changes.add);
      try {
        expect(http.requests, isEmpty);
        expect(
          await first.maybeCheck(),
          sdk.PoseHubCatalogUpdateOutcome.updated,
        );
        expect(changes.map(sdk.poseHubPackVersionOf), [nextPack]);
        expect(
          progress.first.phase,
          coach.PoseHubDisplayUpdatePhase.downloading,
        );
        expect(progress.last.phase, coach.PoseHubDisplayUpdatePhase.completed);
        expect(progress.last.completedFiles, 572);
        expect(progress.last.receivedBytes, progress.last.totalBytes);
        expect(http.requests, hasLength(573));
        expect(http.requests, containsAll(artwork.keys));
        expect(artwork, hasLength(570));
        expect(
          http.requests.where(
            (uri) => !uri.path.endsWith('.json') && !uri.path.endsWith('.webp'),
          ),
          isEmpty,
        );
        expect(
          sdk.poseHubPackVersionOf(await loadFlarePublicCatalog()),
          nextPack,
        );
      } finally {
        await progressSub.cancel();
        await changesSub.cancel();
        first.dispose();
      }

      final reopenedStore = openStore();
      final reopened = (await sdk.readVerifiedPoseHubCatalog(reopenedStore))!;
      expect(sdk.poseHubPackVersionOf(reopened), nextPack);
      final cover = reopened.tryGet('chest-A')!.cover;
      final file = await sdk.PoseHubImageCache(
        rootDirectory: root.path,
      ).findLocal(cover, mediaBaseUri: mediaBase);
      expect(file, isNotNull);
      expect(
        coach.sha256Hex(await File.fromUri(file!).readAsBytes()),
        cover.sha256,
      );

      http.requests.clear();
      progress.clear();
      final second = await launch(reopenedStore);
      final secondProgress = second.updater.displayProgress.listen(
        progress.add,
      );
      try {
        expect(
          await second.maybeCheck(),
          sdk.PoseHubCatalogUpdateOutcome.notModified,
        );
        expect(http.requests, [pointer]);
        expect(progress, isEmpty);

        // A later catalogue adds one new display file. Invalid bytes must
        // keep the active pack intact and leave the new transfer retryable.
        const failedPack = 'r2-v23';
        final newArtwork = await artwork.values.first.readAsBytes();
        final bytes = Uint8List.fromList([...newArtwork, 0]);
        final descriptor = {
          'path': 'media/flare-home/r2-v23/frame.webp',
          'bytes': bytes.length,
          'sha256': coach.sha256Hex(bytes),
        };
        final nextBytes = utf8.encode(
          jsonEncode({
            ...published.raw,
            'pack': failedPack,
            'displayAssets': {'flare-home-frame': descriptor},
          }),
        );
        final next = coach.PoseHubAppTestCatalog.fromBytes(
          nextBytes,
          semanticCatalogBytes: semanticBytes,
        );
        http.publish(failedPack, nextBytes, next, semanticBytes);
        final newFile = next.displayAssets['flare-home-frame']!;
        final newUri = newFile.resolve(mediaBase);
        http.files[newUri] = () async => Uint8List(bytes.length);
        expect(await second.checkNow(), sdk.PoseHubCatalogUpdateOutcome.failed);
        expect(progress.last.phase, coach.PoseHubDisplayUpdatePhase.failed);
        expect(
          sdk.poseHubPackVersionOf(
            (await sdk.readVerifiedPoseHubCatalog(reopenedStore))!,
          ),
          nextPack,
        );
        expect(
          await sdk.PoseHubImageCache(
            rootDirectory: root.path,
          ).findLocal(newFile, mediaBaseUri: mediaBase),
          isNull,
        );
        http.files[newUri] = () async => bytes;
        expect(
          await second.checkNow(),
          sdk.PoseHubCatalogUpdateOutcome.updated,
        );
        expect(progress.last.phase, coach.PoseHubDisplayUpdatePhase.completed);
        expect(
          sdk.poseHubPackVersionOf(
            await loadFlarePublicCatalog(verifiedCache: reopenedStore),
          ),
          failedPack,
        );
      } finally {
        await secondProgress.cancel();
        second.dispose();
      }
    },
  );
}

// The accepted r2-v11 app checkout can be supplied for a byte-for-byte replay.
// CI uses the same version and schema with the repository's current fixture.
Future<coach.PoseHubAppTestCatalog> _oldBaseline(
  coach.PoseHubAppTestCatalog published,
  List<int> semanticBytes,
) async {
  const oldApp = String.fromEnvironment('FLARE_OLD_PACK_APP');
  if (oldApp.isEmpty) {
    return coach.PoseHubAppTestCatalog.fromBytes(
      utf8.encode(jsonEncode({...published.raw, 'pack': 'r2-v11'})),
      semanticCatalogBytes: semanticBytes,
    );
  }
  final oldBytes = await File('$oldApp/$flarePublicCatalogAsset').readAsBytes();
  expect(
    coach.sha256Hex(oldBytes),
    '6f46c0a3fc0b6546193e2e3d867d90add55ce21bf0b8f3c482edaa507cdcabc0',
  );
  return coach.PoseHubAppTestCatalog.fromBytes(
    oldBytes,
    semanticCatalogBytes: await File(
      '$oldApp/$flarePublicSemanticsAsset',
    ).readAsBytes(),
  );
}

class CatalogTestHttp implements sdk.PoseHubCatalogHttpClient {
  CatalogTestHttp(this.pointer);

  final Uri pointer;
  final files = <Uri, Future<List<int>> Function()>{};
  final requests = <Uri>[];
  late String _pack;

  void publish(
    String pack,
    List<int> bytes,
    coach.PoseHubAppTestCatalog catalog,
    List<int> semanticBytes,
  ) {
    _pack = pack;
    final uri = pointer.resolve('../$pack/catalog.json');
    files[pointer] = () async => utf8.encode(
      jsonEncode({
        'schema': 1,
        'pack': pack,
        'catalog': uri.toString(),
        'catalog_bytes': bytes.length,
        'catalog_sha256': coach.sha256Hex(bytes),
        'min_sdk': '0.8.0',
        'published_at': '2026-11-18T11:35:15+08:00',
      }),
    );
    files[uri] = () async => bytes;
    files[uri.resolve(catalog.semanticCatalogFile.path)] = () async =>
        semanticBytes;
  }

  @override
  Future<sdk.PoseHubCatalogHttpResponse> get(
    Uri uri, {
    Map<String, String> headers = const {},
    int maxBytes = 64 * 1024 * 1024,
  }) async {
    requests.add(uri);
    if (uri == pointer && headers['If-None-Match'] == _pack) {
      return sdk.PoseHubCatalogHttpResponse(304, Uint8List(0));
    }
    final read = files[uri];
    if (read == null) throw StateError('Unexpected download: $uri');
    final bytes = await read();
    if (bytes.length > maxBytes) throw StateError('Test response exceeds cap');
    return sdk.PoseHubCatalogHttpResponse(
      200,
      Uint8List.fromList(bytes),
      etag: uri == pointer ? _pack : null,
    );
  }
}
