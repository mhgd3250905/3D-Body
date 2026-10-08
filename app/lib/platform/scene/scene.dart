import 'package:flutter/widgets.dart';

import 'scene_controller.dart';
import 'scene_view_stub.dart'
    if (dart.library.io) 'scene_view_native.dart'
    if (dart.library.js_interop) 'scene_view_web.dart'
    as platform;

export 'scene_controller.dart';

/// Keep this widget mounted beneath Flutter's overlays to preserve the GLB,
/// camera and paused frame when navigating to details or training pages.
/// The app shell owns navigation/native lifecycle visibility; the Web scene
/// owns document visibility. A second observer here would stop iframe drags
/// on focus loss, or restart an offstage scene when the app resumes.
class SceneView extends StatelessWidget {
  const SceneView({super.key, required this.controller});

  final SceneController controller;

  @override
  Widget build(BuildContext context) =>
      platform.ScenePlatformView(controller: controller);
}
