import 'package:flutter/material.dart';

import '../data/flare_v5_drill.dart';
import '../platform/scene/scene.dart';
import 'components.dart' show FlareStrings;
import 'flare_v5_stage.dart';
import 'motion.dart';

/// Transport for the demonstration loop. Training time and repetitions are
/// independent and stay with the session player.
class FlareV5Playback extends StatefulWidget {
  const FlareV5Playback({
    super.key,
    required this.initialSpeed,
    this.autoplay = false,
    this.sessionPaused = false,
  });

  final double initialSpeed;
  final bool autoplay;
  final bool sessionPaused;

  @override
  State<FlareV5Playback> createState() => _FlareV5PlaybackState();
}

class _FlareV5PlaybackState extends State<FlareV5Playback>
    with WidgetsBindingObserver {
  static const _speeds = [(.25, '0.25×'), (.5, '0.5×'), (1.0, '1×')];
  final _scene = SceneController();
  late double _speed = widget.initialSpeed;
  late bool _playRequested = widget.autoplay;
  late bool _foreground;
  bool _routeActive = true;
  bool _syncPending = false;
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    final lifecycle = WidgetsBinding.instance.lifecycleState;
    _foreground = lifecycle == null || lifecycle == AppLifecycleState.resumed;
    WidgetsBinding.instance.addObserver(this);
    _prepareAfterMount();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _routeActive =
        FlarePageActivity.of(context) &&
        TickerMode.valuesOf(context).enabled &&
        (ModalRoute.isCurrentOf(context) ?? true);
    _syncAfterBuild();
  }

  @override
  void didUpdateWidget(covariant FlareV5Playback oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.sessionPaused != widget.sessionPaused) _syncAfterBuild();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _foreground = state == AppLifecycleState.resumed;
    _syncPlayback();
  }

  void _prepareAfterMount() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _scene.setSpeed(_speed);
      _scene.setTime(_scene.time);
      _syncPlayback();
      _scene.requestPresentation();
    });
  }

  void _syncAfterBuild() {
    if (_syncPending) return;
    _syncPending = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _syncPending = false;
      if (mounted) _syncPlayback();
    });
  }

  void _syncPlayback() {
    final playing =
        _playRequested && _foreground && _routeActive && !widget.sessionPaused;
    if (playing == _scene.playing) return;
    if (playing) {
      _scene.play();
    } else {
      _scene.pause();
    }
  }

  void _togglePlayback() {
    _playRequested = !_scene.playing;
    _syncPlayback();
  }

  void _seek(double value) {
    _playRequested = false;
    _scene.setTime(value);
  }

  void _retry() {
    setState(() => _generation++);
    _prepareAfterMount();
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
    return Column(
      children: [
        Expanded(
          child: FlareV5Stage(
            key: ValueKey(_generation),
            controller: _scene,
            fallback: Image.asset(
              flareV5PosterAsset,
              fit: BoxFit.contain,
              excludeFromSemantics: true,
            ),
            // Preserve vertical scrolling in details and the session chrome
            // above the platform view in the player.
            interactive: false,
            onRetry: _retry,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: ListenableBuilder(
            listenable: _scene,
            builder: (context, _) => Row(
              children: [
                IconButton(
                  key: const ValueKey('flare-v5-demo-play'),
                  tooltip: _scene.playing ? s.pause : s.play,
                  onPressed: _scene.presented && !widget.sessionPaused
                      ? _togglePlayback
                      : null,
                  icon: Icon(
                    _scene.playing
                        ? Icons.pause_rounded
                        : Icons.play_arrow_rounded,
                  ),
                ),
                Expanded(
                  child: Semantics(
                    label: s.timeline,
                    child: Slider(
                      key: const ValueKey('flare-v5-demo-progress'),
                      value: _scene.time,
                      max: _scene.period,
                      onChanged: _scene.presented ? _seek : null,
                      semanticFormatterCallback: (value) =>
                          '${value.toStringAsFixed(2)} s',
                    ),
                  ),
                ),
                PopupMenuButton<double>(
                  key: const ValueKey('flare-v5-demo-speed'),
                  tooltip: s.playbackSpeed,
                  enabled: _scene.presented,
                  initialValue: _speed,
                  onSelected: (value) {
                    _speed = value;
                    _scene.setSpeed(value);
                  },
                  itemBuilder: (_) => [
                    for (final (value, label) in _speeds)
                      PopupMenuItem(value: value, child: Text(label)),
                  ],
                  child: SizedBox(
                    width: 56,
                    height: 48,
                    child: Center(
                      child: Text(
                        _speeds.firstWhere((entry) => entry.$1 == _speed).$2,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
