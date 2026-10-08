import 'package:flutter/widgets.dart';

import 'scene_controller.dart';

class ScenePlatformView extends StatefulWidget {
  const ScenePlatformView({super.key, required this.controller});

  final SceneController controller;

  @override
  State<ScenePlatformView> createState() => _ScenePlatformViewState();
}

class _ScenePlatformViewState extends State<ScenePlatformView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) widget.controller.reportError('unsupported');
    });
  }

  @override
  Widget build(BuildContext context) =>
      const ColoredBox(color: Color(0xff08080a), child: SizedBox.expand());
}
