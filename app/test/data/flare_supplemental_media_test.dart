import 'dart:convert';
import 'dart:io';

import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'local supplemental rows preserve the shipped baseline and scope',
    () async {
      final fixture = _SupplementalBundle();
      final original = await loadFlareBundledPublicCatalog(bundle: fixture);
      final baseline = await withFlareWarmupAction(original, bundle: fixture);
      final shared = await FlareShared.load(
        activeCatalog: original,
        bundle: fixture,
      );
      final local = shared.pack;

      expect(trainer.poseHubPackVersionOf(local), 'r2-v18');
      expect(local.allActions.map((action) => action.id), [
        ...baseline.allActions.map((action) => action.id),
        ...flareSupplementalActionIds,
      ]);
      for (final action in baseline.allActions) {
        expect(local.tryGet(action.id)?.raw, action.raw, reason: action.id);
      }
      expect(
        shared.allowedActionIds.intersection(flareSupplementalActionIds),
        isEmpty,
      );
      for (final id in flareSupplementalActionIds) {
        expect(shared.catalog[id], isNotNull);
        expect(original.tryGet(id), isNull);
      }
      expect(
        await withFlareSupplementalActions(local, bundle: fixture),
        same(local),
      );
    },
  );

  test('verified active rows win over the supplemental copy', () async {
    final fixture = _SupplementalBundle();
    final original = await loadFlareBundledPublicCatalog(bundle: fixture);
    final local = await withFlareSupplementalActions(original, bundle: fixture);
    final id = flareSupplementalActionIds.first;
    final verified = coach.PoseHubAppTestCatalog.fromJson({
      ...local.raw,
      'pack': 'r2-v22',
      'actions': [
        for (final action in local.allActions)
          if (action.id == id)
            {...action.raw, 'revision': 'active-verified'}
          else
            action.raw,
      ],
    });

    expect(
      await withFlareSupplementalActions(verified, bundle: fixture),
      same(verified),
    );
    expect(verified.tryGet(id)?.raw['revision'], 'active-verified');

    final older = coach.PoseHubAppTestCatalog.fromJson({
      ...original.raw,
      'pack': 'r2-v20',
    });
    final augmented = await withFlareSupplementalActions(
      older,
      bundle: fixture,
    );
    expect(trainer.poseHubPackVersionOf(augmented), 'r2-v20');
    expect(augmented.allActions.length, older.allActions.length + 6);
    expect(augmented.tryGet(id)?.allMediaFiles, isNotEmpty);

    final missing = _SupplementalBundle(omitManifest: true);
    final fallback = await withFlareSupplementalActions(
      original,
      bundle: missing,
    );
    expect(fallback.tryGet(flareWarmupPushupId), isNotNull);
    expect(fallback.tryGet(id), isNull);
  });

  test(
    'base and themed clips and posters resolve without HTTP after cache clear',
    () async {
      final fixture = _SupplementalBundle();
      final temporary = await Directory.systemTemp.createTemp(
        'flare-supplemental-media-',
      );
      addTearDown(() => temporary.delete(recursive: true));
      var networkCalls = 0;
      await HttpOverrides.runZoned(
        () async {
          final policy = await FlarePublicMedia.load(
            bundle: fixture,
            rootDirectory: temporary.path,
          );
          final repository = policy.repository;
          addTearDown(repository.dispose);
          final action = policy.actionFor(flareSupplementalActionIds.first)!;
          final themed = action.mediaFor(coach.PoseHubMediaTheme.dark);
          expect(
            policy.posterAssetFor(action.id),
            fixture.paths[action.cover.sha256],
          );
          expect(await repository.cachedVideo(action.id), isNull);
          for (final file in [
            action.video,
            action.cover,
            themed.video,
            themed.cover,
            themed.thumbnail,
          ]) {
            final uri = await repository.ensureFileWithPriority(file);
            expect(uri.isScheme('file'), isTrue);
            final bytes = await File.fromUri(uri).readAsBytes();
            expect(bytes.length, file.bytes);
            expect(coach.sha256Hex(bytes), file.sha256);
            expect(
              repository.watchFile(file).value.phase,
              trainer.CatalogMediaDownloadPhase.ready,
            );
          }
          expect(await repository.cachedVideo(action.id), isNotNull);
          await repository.clearVideoCache();
          expect(await repository.cachedVideo(action.id), isNull);
          final restored = await repository.ensureFile(action.video);
          expect(
            coach.sha256Hex(await File.fromUri(restored).readAsBytes()),
            action.video.sha256,
          );
        },
        createHttpClient: (_) {
          networkCalls++;
          throw StateError('Unexpected live media access from an offline test');
        },
      );
      expect(networkCalls, 0);
    },
  );

  test('the six shipped r2-v21 demonstrations resolve offline', () async {
    final directory = await Directory.systemTemp.createTemp(
      'flare-r2-v21-assets-',
    );
    addTearDown(() => directory.delete(recursive: true));
    await HttpOverrides.runZoned(() async {
      final policy = await FlarePublicMedia.load(rootDirectory: directory.path);
      addTearDown(policy.repository.dispose);
      for (final id in flareSupplementalActionIds) {
        final action = policy.actionFor(id)!;
        final poster = policy.posterAssetFor(id);
        expect(poster, isNotNull, reason: id);
        for (final file in [action.video, action.cover, action.thumbnail]) {
          final uri = await policy.repository.ensureFile(file);
          final bytes = await File.fromUri(uri).readAsBytes();
          expect(bytes.length, file.bytes, reason: file.path);
          expect(coach.sha256Hex(bytes), file.sha256, reason: file.path);
        }
      }
    }, createHttpClient: (_) => throw StateError('Unexpected HTTP request'));
  });
}

class _SupplementalBundle extends CachingAssetBundle {
  _SupplementalBundle({bool omitManifest = false}) {
    if (omitManifest) return;
    final donor =
        jsonDecode(
              File(
                'assets/public_media/flare-warmup-action.json',
              ).readAsStringSync(),
            )
            as Map<String, Object?>;
    final action = donor['action'] as Map<String, Object?>;
    final definition = donor['definition'] as Map<String, Object?>;
    final media = action['files'] as Map<String, Object?>;
    final actions = [
      for (final id in flareSupplementalActionIds)
        {
          ...action,
          'id': id,
          'files': {
            ..._mediaSet(media, id, 'base'),
            'themes': {
              'dark': {'skin': 'test', ..._mediaSet(media, id, 'dark')},
            },
          },
        },
    ];
    _bytes[flareSupplementalActionsAsset] = utf8.encode(
      jsonEncode({
        'sourcePackVersion': 'r2-v21',
        'actions': actions,
        'definitions': [
          for (final id in flareSupplementalActionIds)
            {...definition, 'id': id},
        ],
        'assetsBySha256': paths,
      }),
    );
  }

  final _bytes = <String, List<int>>{};
  final paths = <String, String>{};

  Map<String, Object?> _mediaSet(
    Map<String, Object?> source,
    String id,
    String variant,
  ) => {
    for (final MapEntry(key: role, value: raw) in source.entries)
      role: _media(raw as Map<String, Object?>, id, variant, role),
  };

  Map<String, Object?> _media(
    Map<String, Object?> source,
    String id,
    String variant,
    String role,
  ) {
    final name = '$id-$variant-$role';
    final bytes = utf8.encode(name);
    final hash = coach.sha256Hex(bytes);
    final extension = role == 'video' ? 'mp4' : 'webp';
    final path = 'media/$id/r2-v21/$name.$extension';
    final asset = paths[hash] =
        'assets/public_media/flare-r2-v21-$hash.$extension';
    _bytes[asset] = bytes;
    return {
      ...source,
      'assetName': path.split('/').last,
      'path': path,
      'bytes': bytes.length,
      'sha256': hash,
      'downloadUrl': 'https://media.uuugk.win/pack/r2-v1/$path',
    };
  }

  @override
  Future<ByteData> load(String key) async {
    final bytes = _bytes[key];
    if (bytes == null && key == flareSupplementalActionsAsset) {
      throw const FileSystemException('Supplemental manifest omitted');
    }
    return ByteData.sublistView(
      bytes == null ? await File(key).readAsBytes() : Uint8List.fromList(bytes),
    );
  }
}
