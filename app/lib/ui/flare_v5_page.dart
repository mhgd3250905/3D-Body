import 'package:flutter/material.dart';

import '../platform/scene/scene.dart';
import 'flare_v5_stage.dart';
import 'components.dart' show FlareStrings;
import 'page_kit.dart';

class FlareV5Page extends StatefulWidget {
  const FlareV5Page({super.key, required this.speed});

  final double speed;

  @override
  State<FlareV5Page> createState() => _FlareV5PageState();
}

class _FlareV5PageState extends State<FlareV5Page> with WidgetsBindingObserver {
  final _scene = SceneController();
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _prepare();
    });
  }

  void _prepare() {
    _scene.setSpeed(widget.speed);
    _scene.play();
    _scene.requestPresentation();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state != AppLifecycleState.resumed) _scene.pause();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _scene.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Scaffold(
      body: FlareNavPage(
        title: s.flareStraightLegs,
        onBack: () => Navigator.of(context).pop(),
        bodyScrollsUnderBar: false,
        body: FlareV5Stage(
          key: ValueKey(_generation),
          controller: _scene,
          onRetry: () {
            setState(() => _generation++);
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) _prepare();
            });
          },
        ),
        bottomBar: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: ListenableBuilder(
              listenable: _scene,
              builder: (context, _) => Row(
                children: [
                  IconButton.filled(
                    tooltip: _scene.playing ? s.pause : s.play,
                    onPressed: !_scene.presented
                        ? null
                        : _scene.playing
                        ? _scene.pause
                        : _scene.play,
                    icon: Icon(
                      _scene.playing
                          ? Icons.pause_rounded
                          : Icons.play_arrow_rounded,
                    ),
                  ),
                  Expanded(
                    child: Slider(
                      value: _scene.time,
                      max: _scene.period,
                      onChanged: _scene.presented ? _scene.setTime : null,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
