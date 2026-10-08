import 'dart:io';
import 'dart:typed_data';

import 'package:flare/platform/scene/scene_asset_router.dart';
import 'package:flare/platform/scene/scene_asset_server.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test(
    'gzip models are served verbatim for the bundled JavaScript decoder',
    () async {
      final compressed = Uint8List.fromList(
        gzip.encode([103, 108, 84, 70, 128, 255]),
      );
      final server = await SceneAssetServer.start(
        router: SceneAssetRouter(
          assets: ['assets/scene/coach/model.meshopt.glb.gz'],
          load: (_) async => compressed,
        ),
      );
      final client = HttpClient();
      addTearDown(() async {
        client.close(force: true);
        await server.close();
      });

      final request = await client.getUrl(
        server.origin.resolve('/coach/model.meshopt.glb.gz'),
      );
      final response = await request.close();
      expect(response.statusCode, HttpStatus.ok);
      expect(response.headers.contentType?.mimeType, 'application/gzip');
      expect(response.headers.value(HttpHeaders.contentEncodingHeader), isNull);
      expect(response.contentLength, compressed.length);
      final actual = await response.fold<List<int>>(
        [],
        (data, part) => data..addAll(part),
      );
      expect(actual, compressed);
      expect(gzip.decode(actual), [103, 108, 84, 70, 128, 255]);
    },
  );

  test(
    'loopback transport serves bundled bytes and accepts only its own origin',
    () async {
      final bytes = Uint8List.fromList([103, 108, 84, 70, 128, 255]);
      final server = await SceneAssetServer.start(
        router: SceneAssetRouter(
          assets: ['assets/scene/index.html', 'assets/scene/coach/model.glb'],
          load: (_) async => bytes,
        ),
      );
      final client = HttpClient();
      addTearDown(() async {
        client.close(force: true);
        await server.close();
      });
      expect(server.origin.host, '127.0.0.1');
      expect(server.origin.port, greaterThan(0));
      expect(server.permitsNavigation(server.sceneUri), isTrue);
      expect(
        server.permitsNavigation(Uri.parse('https://example.com/')),
        isFalse,
      );
      expect(
        server.permitsNavigation(
          Uri.parse('http://localhost:${server.origin.port}/'),
        ),
        isFalse,
      );
      expect(
        server.permitsNavigation(
          Uri.parse('http://127.0.0.1:${server.origin.port + 1}/'),
        ),
        isFalse,
      );

      final request = await client.getUrl(
        server.origin.resolve('/coach/model.glb'),
      );
      final response = await request.close();
      expect(response.statusCode, HttpStatus.ok);
      expect(response.headers.contentType?.mimeType, 'model/gltf-binary');
      final actual = await response.fold<List<int>>(
        [],
        (data, part) => data..addAll(part),
      );
      expect(actual, bytes);
      final headRequest = await client.openUrl('HEAD', server.sceneUri);
      final head = await headRequest.close();
      expect(head.statusCode, HttpStatus.ok);
      expect(head.contentLength, bytes.length);
      expect(
        await head.fold<int>(0, (length, part) => length + part.length),
        0,
      );
    },
  );
}
