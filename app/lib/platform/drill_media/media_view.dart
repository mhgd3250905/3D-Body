export 'media_view_stub.dart'
    if (dart.library.io) 'media_view_native.dart'
    if (dart.library.js_interop) 'media_view_web.dart';
