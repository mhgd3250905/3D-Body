import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../data/drill_media.dart';
import '../platform/drill_media/media_controller.dart';
import '../platform/drill_media/media_view.dart';
import '../l10n/app_localizations.dart';
import 'motion.dart';
import 'theme_fade.dart';

/// Still frame until tapped. Only the current card creates a media platform view.
class DrillMediaCard extends StatefulWidget {
  const DrillMediaCard({super.key, required this.drillId, this.active = true});
  final String drillId;
  final bool active;
  @override
  State<DrillMediaCard> createState() => _DrillMediaCardState();
}

class _DrillMediaCardState extends State<DrillMediaCard>
    with WidgetsBindingObserver {
  final Object _token = Object();
  final _coordinator = DrillPlaybackCoordinator.shared;
  late DrillMediaController _controller;
  late Future<Map<String, DrillMedia>> _loading;
  bool _foreground = true;
  bool _pageActive = true;
  bool _opened = false;
  int _attempt = 0;
  bool get _active => widget.active && _foreground && _pageActive;
  @override
  void initState() {
    super.initState();
    _loading = DrillMedia.load();
    _controller = DrillMediaController()..setActive(widget.active);
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _pageActive = FlarePageActivity.of(context);
    _controller.setActive(_active);
    if (!_pageActive && _opened) _close();
  }

  void _close() {
    _coordinator.release(_token);
    _controller.dispose();
    _controller = DrillMediaController()..setActive(_active);
    _attempt++;
    _opened = false;
  }

  void _releaseForAnotherCard() {
    if (mounted) setState(_close);
  }

  @override
  void didUpdateWidget(DrillMediaCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.drillId != widget.drillId) _close();
    _controller.setActive(_active);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (kIsWeb && state == AppLifecycleState.inactive) return;
    _foreground = state == AppLifecycleState.resumed;
    _controller.setActive(_active);
  }

  void _toggle() {
    if (!_active) return;
    if (!_opened || _controller.failed) {
      _coordinator.claim(_token, _releaseForAnotherCard);
      setState(() {
        _controller.dispose();
        _controller = DrillMediaController()..setActive(_active);
        _attempt++;
        _opened = true;
        _controller.toggle();
      });
    } else {
      _controller.toggle();
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);
    return AspectRatio(
      aspectRatio: 1,
      child: FutureBuilder<Map<String, DrillMedia>>(
        future: _loading,
        builder: (context, snapshot) {
          final media = snapshot.data?[widget.drillId];
          return AnimatedBuilder(
            animation: _controller,
            builder: (context, _) {
              final failed =
                  _opened &&
                  (snapshot.hasError ||
                      snapshot.connectionState == ConnectionState.done &&
                          media == null ||
                      _controller.failed);
              final wantsPlay = _opened && _controller.wantsPlay;
              return Stack(
                fit: StackFit.expand,
                children: [
                  ColoredBox(
                    color: const Color(0xff101013),
                    child: Image.asset(
                      'assets/drill_media/${widget.drillId}.jpg',
                      fit: BoxFit.contain,
                      errorBuilder: (_, _, _) => const Center(
                        child: Icon(
                          Icons.fitness_center,
                          color: Colors.white54,
                        ),
                      ),
                    ),
                  ),
                  if (_opened && media != null && !failed) ...[
                    Positioned.fill(
                      child: ThemeFadeWindow(enabled: _pageActive),
                    ),
                    DrillMediaPlatformView(
                      key: ValueKey('${widget.drillId}:$_attempt'),
                      media: media,
                      controller: _controller,
                      labels: {
                        'title': s.drillDemo,
                        'play': s.play,
                        'pause': s.pause,
                        'error': s.demoFailed,
                        'disabled': s.demoPaused,
                      },
                    ),
                    // Keep the still frame above the platform's startup surface
                    // until the decoder has actually presented a video frame.
                    IgnorePointer(
                      child: AnimatedOpacity(
                        opacity: _controller.hasFrame ? 0 : 1,
                        duration: FlareMotion.of(
                          context,
                          const Duration(milliseconds: 120),
                        ),
                        child: ColoredBox(
                          color: const Color(0xff101013),
                          child: Image.asset(
                            'assets/drill_media/${widget.drillId}.jpg',
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                    ),
                  ],
                  Semantics(
                    button: true,
                    label: failed
                        ? s.retry
                        : wantsPlay
                        ? s.pause
                        : s.play,
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: _active ? _toggle : null,
                      child: LayoutBuilder(
                        builder: (context, size) => Align(
                          alignment: Alignment.bottomRight,
                          child: Padding(
                            padding: const EdgeInsets.all(8),
                            child: !wantsPlay || failed
                                ? Container(
                                    width: (size.maxWidth * .16).clamp(24, 48),
                                    height: (size.maxWidth * .16).clamp(24, 48),
                                    decoration: BoxDecoration(
                                      color: const Color(0xaa101013),
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white24),
                                    ),
                                    child: Icon(
                                      failed
                                          ? Icons.refresh
                                          : Icons.play_arrow_rounded,
                                      color: _active
                                          ? Colors.white
                                          : Colors.white38,
                                      size: (size.maxWidth * .09).clamp(16, 28),
                                    ),
                                  )
                                : const SizedBox.shrink(),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              );
            },
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _coordinator.release(_token);
    _controller.dispose();
    super.dispose();
  }
}
