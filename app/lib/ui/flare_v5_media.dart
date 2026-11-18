import 'package:flutter/material.dart';

import '../platform/scene/scene.dart';
import '../platform/scene/scene_variant.dart';
import 'motion.dart';

/// Draws V5 inside the existing media slot. Playback and navigation controls
/// belong to the enclosing detail or Trainer page.
class FlareV5Media extends StatefulWidget {
  const FlareV5Media({
    super.key,
    required this.speed,
    required this.playing,
    required this.mirrored,
    required this.fallback,
    required this.background,
  });

  final double speed;
  final bool playing;
  final bool mirrored;
  final Widget fallback;
  final Color background;

  @override
  State<FlareV5Media> createState() => _FlareV5MediaState();
}

class _FlareV5MediaState extends State<FlareV5Media>
    with WidgetsBindingObserver {
  final _scene = SceneController();
  bool _activePage = true;
  bool _inForeground = true;
  bool _updatePending = false;
  bool _needsPresentation = true;
  Brightness? _brightness;

  @override
  void initState() {
    super.initState();
    final lifecycle = WidgetsBinding.instance.lifecycleState;
    _inForeground = lifecycle == null || lifecycle == AppLifecycleState.resumed;
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _activePage =
        FlarePageActivity.of(context) &&
        TickerMode.valuesOf(context).enabled &&
        (ModalRoute.isCurrentOf(context) ?? true);
    _syncAfterBuild();
  }

  @override
  void didUpdateWidget(covariant FlareV5Media oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.playing != widget.playing ||
        oldWidget.speed != widget.speed) {
      _syncAfterBuild();
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _inForeground = state == AppLifecycleState.resumed;
    _syncAfterBuild();
  }

  void _syncAfterBuild() {
    if (_updatePending) return;
    _updatePending = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _updatePending = false;
      if (!mounted) return;
      final brightness = Theme.of(context).brightness;
      if (_brightness != brightness) {
        _brightness = brightness;
        _scene.setTheme(brightness.name);
      }
      if (_needsPresentation || _scene.speed != widget.speed) {
        _scene.setSpeed(widget.speed);
      }
      final play = _activePage && _inForeground && widget.playing;
      if (play != _scene.playing) {
        play ? _scene.play() : _scene.pause();
      }
      if (_needsPresentation) {
        _needsPresentation = false;
        _scene.requestPresentation();
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _scene.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ColoredBox(
    color: widget.background,
    child: ListenableBuilder(
      listenable: _scene,
      builder: (context, _) {
        final presented = _scene.presented;
        return Stack(
          fit: StackFit.expand,
          children: [
            if (_scene.errorCode == null)
              Transform.flip(
                flipX: widget.mirrored,
                child: SceneView(
                  controller: _scene,
                  body: flareMediaScene,
                  interactive: false,
                  concealed: !presented,
                ),
              ),
            if (!presented) widget.fallback,
          ],
        );
      },
    ),
  );
}
