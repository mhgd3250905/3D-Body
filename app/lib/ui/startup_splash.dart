import 'package:flutter/material.dart';

import 'components.dart';
import 'flare_silhouette.dart';
import 'motion.dart';
import 'theme.dart';

/// Shared by the full-screen startup cover and the live scene beneath it.
RadialGradient flareStageGradient() => RadialGradient(
  center: const Alignment(0, -.2),
  radius: 1.05,
  colors: FlareColors.stage,
  stops: const [0, .52, 1],
);

/// Keeps the first app frame covered until data and the scene are presented.
/// The host retains this state across startup; after revealing once it stays
/// out of the way when pages or the underlying WebView subsequently change.
class FlareStartupSplash extends StatefulWidget {
  const FlareStartupSplash({
    super.key,
    required this.ready,
    required this.onRetry,
    required this.onRevealed,
    this.error,
  });

  final bool ready;

  /// A localized message supplied by the host, never a platform error code.
  final String? error;
  final VoidCallback onRetry;
  final VoidCallback onRevealed;

  @override
  State<FlareStartupSplash> createState() => _FlareStartupSplashState();
}

class _FlareStartupSplashState extends State<FlareStartupSplash>
    with SingleTickerProviderStateMixin {
  static const _contentEnd = 120 / 340;
  bool _completed = false;
  bool _notified = false;
  late final AnimationController _reveal = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 340),
  )..addStatusListener(_statusChanged);

  void _statusChanged(AnimationStatus status) {
    if (status != AnimationStatus.completed || _completed) return;
    // The controller also invalidates AnimatedBuilder in this frame. Latch
    // before that rebuild and notify the host after paint, including when
    // reduced motion completes synchronously during an ancestor's build.
    _completed = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || _notified) return;
      _notified = true;
      widget.onRevealed();
    });
  }

  void _syncReadiness() {
    if (_completed) return;
    if (!widget.ready || widget.error != null) {
      _reveal.stop();
      _reveal.value = 0;
      return;
    }
    if (FlareMotion.reduced(context)) {
      _reveal.value = 1;
    } else if (!_reveal.isAnimating) {
      _reveal.forward();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncReadiness();
  }

  @override
  void didUpdateWidget(FlareStartupSplash oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncReadiness();
  }

  @override
  void dispose() {
    _reveal.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _reveal,
    builder: (context, _) {
      if (_completed) {
        return const SizedBox.shrink(key: ValueKey('startup-revealed'));
      }
      final progress = _reveal.value;
      final contentOpacity = progress >= _contentEnd - .000001
          ? 0.0
          : 1 -
                Curves.easeOut.transform(
                  (progress / _contentEnd).clamp(0.0, 1.0),
                );
      final coverOpacity =
          1 -
          FlareMotion.dissolve.transform(
            ((progress - _contentEnd) / (1 - _contentEnd)).clamp(0.0, 1.0),
          );
      return BlockSemantics(
        child: Material(
          type: MaterialType.transparency,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Keep the live platform view drawing underneath, while none of
              // its controls or the hidden homepage can receive startup taps.
              const ModalBarrier(dismissible: false, color: Colors.transparent),
              IgnorePointer(
                child: Opacity(
                  key: const ValueKey('startup-cover-opacity'),
                  opacity: coverOpacity,
                  child: DecoratedBox(
                    decoration: BoxDecoration(gradient: flareStageGradient()),
                  ),
                ),
              ),
              if (contentOpacity > 0)
                Opacity(
                  key: const ValueKey('startup-content-opacity'),
                  opacity: contentOpacity,
                  child: SafeArea(
                    child: Center(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 24,
                        ),
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 320),
                          child: _content(context),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      );
    },
  );

  Widget _content(BuildContext context) {
    final s = context.strings;
    final error = widget.error;
    return Semantics(
      container: true,
      liveRegion: true,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ExcludeSemantics(
            child: FlareLoadingSilhouette(animate: error == null),
          ),
          const SizedBox(height: 16),
          Text(
            s.appName,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: FlareColors.text,
              fontSize: 22,
              height: 1.3,
              fontWeight: FontWeight.w600,
              letterSpacing: .2,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            error ?? s.sceneLoading,
            textAlign: TextAlign.center,
            style: TextStyle(color: FlareColors.dim, fontSize: 12, height: 1.6),
          ),
          if (error != null) ...[
            const SizedBox(height: 18),
            OutlinedButton(onPressed: widget.onRetry, child: Text(s.retry)),
          ],
        ],
      ),
    );
  }
}
