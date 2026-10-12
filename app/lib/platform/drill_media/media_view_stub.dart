import 'package:flutter/widgets.dart';
import '../../data/drill_media.dart';
import 'media_controller.dart';

class DrillMediaPlatformView extends StatefulWidget {
  const DrillMediaPlatformView({
    super.key,
    required this.media,
    required this.controller,
    required this.labels,
  });
  final DrillMedia media;
  final DrillMediaController controller;
  final Map<String, String> labels;
  @override
  State<DrillMediaPlatformView> createState() => _UnsupportedState();
}

class _UnsupportedState extends State<DrillMediaPlatformView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) widget.controller.reportError();
    });
  }

  @override
  Widget build(BuildContext context) => const SizedBox.expand();
}
