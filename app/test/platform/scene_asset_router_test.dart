import 'dart:typed_data';

import 'package:flare/platform/scene/scene_asset_router.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late List<String> loaded;
  late SceneAssetRouter router;
  setUp(() {
    loaded = [];
    router = SceneAssetRouter(
      assets: [
        'assets/scene/index.html',
        'assets/scene/src/runtime.js',
        'assets/scene/coach/flare-coach.glb',
        'assets/scene/coach/flare-coach.meshopt.glb.gz',
        'assets/scene/coach/coach-rig.json',
        'assets/data/catalog.json',
        'assets/scene/source.blend',
      ],
      load: (key) async {
        loaded.add(key);
        return Uint8List.fromList([0, 127, 128, 255]);
      },
    );
  });

  test('raw and encoded traversal never reach the asset loader', () async {
    for (final target in [
      '/../data/catalog.json',
      '/src/../../index.html',
      '/%2e%2e/data/catalog.json',
      '/src/%2E%2E/index.html',
      '/%252e%252e/data/catalog.json',
      '/src%2f..%2findex.html',
      '/src\\..\\index.html',
      '/%5c..%5cindex.html',
      '//index.html',
      '/C:/index.html',
      '/%00index.html',
      '/bad%escape',
      'http://example.com/index.html',
    ]) {
      expect((await router.route(target)).statusCode, 400, reason: target);
    }
    expect(loaded, isEmpty);
  });

  test(
    'only scene manifest entries with supported MIME types can load',
    () async {
      for (final target in [
        '/data/catalog.json',
        '/coach/missing.glb',
        '/source.blend',
      ]) {
        expect((await router.route(target)).statusCode, 404);
      }
      expect(
        (await router.route('/index.html', method: 'POST')).statusCode,
        405,
      );
      expect(loaded, isEmpty);
    },
  );

  test(
    'module/GLB/gzip/JSON responses retain binary bytes and their correct MIME',
    () async {
      final expected = {
        '/': 'text/html; charset=utf-8',
        '/src/runtime.js?v=1': 'text/javascript; charset=utf-8',
        '/coach/flare-coach.glb': 'model/gltf-binary',
        '/coach/flare-coach.meshopt.glb.gz': 'application/gzip',
        '/coach/coach-rig.json': 'application/json; charset=utf-8',
      };
      for (final entry in expected.entries) {
        final result = await router.route(entry.key);
        expect(result.statusCode, 200);
        expect(result.contentType, entry.value);
        expect(result.body, [0, 127, 128, 255]);
      }
      expect(loaded.length, 5);
    },
  );
}
