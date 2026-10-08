import 'package:flutter/widgets.dart';

import 'scene_controller.dart';
import 'scene_view_stub.dart'
    if (dart.library.io) 'scene_view_native.dart'
    if (dart.library.js_interop) 'scene_view_web.dart'
    as platform;

export 'scene_controller.dart';

/// Keep this widget mounted beneath Flutter's overlays to preserve the GLB,
/// camera and paused frame when navigating to details or training pages.
class SceneView extends StatefulWidget {
  const SceneView({super.key, required this.controller});

  final SceneController controller;

  @override
  State<SceneView> createState() => _SceneViewState();
}

class _SceneViewState extends State<SceneView> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      widget.controller.setVisible(true);
    } else {
      widget.controller.pause();
      widget.controller.setVisible(false);
    }
  }

  @override
  Widget build(BuildContext context) =>
      platform.ScenePlatformView(controller: widget.controller);

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
}
