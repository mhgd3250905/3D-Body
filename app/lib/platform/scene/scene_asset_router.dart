import 'dart:typed_data';

typedef SceneAssetLoader = Future<Uint8List> Function(String assetKey);

class SceneAssetResponse {
  const SceneAssetResponse({
    required this.statusCode,
    required this.contentType,
    required this.body,
  });

  final int statusCode;
  final String contentType;
  final Uint8List body;
}

/// Resolves only assets explicitly present in the Flutter bundle manifest.
/// No request path is ever joined to a filesystem directory.
class SceneAssetRouter {
  SceneAssetRouter({required Iterable<String> assets, required this.load})
    : _assets = {
        for (final key in assets)
          if (key.startsWith(assetPrefix) &&
              _mimeFor(key.substring(assetPrefix.length)) != null)
            key.substring(assetPrefix.length): key,
      };

  static const assetPrefix = 'assets/scene/';
  final Map<String, String> _assets;
  final SceneAssetLoader load;

  Future<SceneAssetResponse> route(
    String requestTarget, {
    String method = 'GET',
  }) async {
    if (method != 'GET' && method != 'HEAD') return _error(405);
    final name = _assetName(requestTarget);
    if (name == null) return _error(400);
    final key = _assets[name];
    if (key == null) return _error(404);
    try {
      final bytes = await load(key);
      return SceneAssetResponse(
        statusCode: 200,
        contentType: _mimeFor(name)!,
        body: bytes,
      );
    } catch (_) {
      return _error(404);
    }
  }

  static String? _assetName(String target) {
    // Validate the raw path before Uri parsing can normalize dot segments.
    final raw = target.split('?').first;
    if (!raw.startsWith('/') || raw.startsWith('//') || raw.contains('#')) {
      return null;
    }
    String path;
    try {
      path = Uri.decodeComponent(raw);
    } on FormatException {
      return null;
    } on ArgumentError {
      return null;
    }
    if (path.contains('%') ||
        path.contains('\\') ||
        path.contains(':') ||
        RegExp(r'[\x00-\x1f\x7f]').hasMatch(path)) {
      return null;
    }
    if (path == '/') return 'index.html';
    final segments = path.substring(1).split('/');
    if (segments.any((part) => part.isEmpty || part.startsWith('.'))) {
      return null;
    }
    return segments.join('/');
  }

  static String? _mimeFor(String name) =>
      switch (name.split('.').last.toLowerCase()) {
        'html' => 'text/html; charset=utf-8',
        'js' || 'mjs' => 'text/javascript; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'glb' => 'model/gltf-binary',
        'gz' => 'application/gzip',
        'bin' => 'application/octet-stream',
        'wasm' => 'application/wasm',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        _ => null,
      };

  static SceneAssetResponse _error(int status) => SceneAssetResponse(
    statusCode: status,
    contentType: 'text/plain; charset=utf-8',
    body: Uint8List(0),
  );
}
