import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'theme.dart';

/// One motion language for the whole app.
///
/// Pages push in from the right over a dimmed, slightly receding page, the
/// way iOS navigation does; modal flows (the timer) rise from the bottom;
/// peers cross-fade. Everything settles on the same decelerating curve so the
/// app reads as one material instead of instant cuts. When the system asks
/// for reduced motion every duration collapses to zero.
abstract final class FlareMotion {
  /// Fast out, long soft landing (close to UIKit's navigation spring).
  static const Curve settle = Cubic(.22, .9, .24, 1);
  static const Curve standard = Cubic(.3, 0, .1, 1);
  static const Duration push = Duration(milliseconds: 420);
  static const Duration pop = Duration(milliseconds: 360);
  static const Duration modal = Duration(milliseconds: 460);
  static const Duration fade = Duration(milliseconds: 260);
  static const Duration quick = Duration(milliseconds: 180);
  static const Duration sheet = Duration(milliseconds: 420);

  static bool reduced(BuildContext context) =>
      MediaQuery.maybeDisableAnimationsOf(context) ?? false;

  static Duration of(BuildContext context, Duration value) =>
      reduced(context) ? Duration.zero : value;

  static AnimationStyle sheetStyle(BuildContext context) => AnimationStyle(
    curve: settle,
    duration: of(context, sheet),
    reverseCurve: Curves.easeInCubic,
    reverseDuration: of(context, const Duration(milliseconds: 260)),
  );
}

/// Touch feedback vocabulary, used sparingly the way iOS does: a tick for
/// selections and scrubbing, a light tap for toggles and primary actions, a
/// firmer tap when a training block starts, and a success pattern at the end.
abstract final class FlareHaptics {
  static void selection() => unawaited(HapticFeedback.selectionClick());
  static void light() => unawaited(HapticFeedback.lightImpact());
  static void medium() => unawaited(HapticFeedback.mediumImpact());
  static void heavy() => unawaited(HapticFeedback.heavyImpact());

  /// Two quick taps, the closest built-in to UIKit's success notification.
  static void success() {
    unawaited(HapticFeedback.mediumImpact());
    Future<void>.delayed(
      const Duration(milliseconds: 120),
      () => unawaited(HapticFeedback.lightImpact()),
    );
  }
}

/// Builds an image that fades in once decoded instead of popping in, unless it
/// was already in memory (synchronous) or motion is reduced.
Widget fadeInFrame(
  BuildContext context,
  Widget child,
  int? frame,
  bool wasSynchronouslyLoaded,
) {
  if (wasSynchronouslyLoaded || FlareMotion.reduced(context)) return child;
  return AnimatedOpacity(
    opacity: frame == null ? 0 : 1,
    duration: FlareMotion.fade,
    curve: Curves.easeOut,
    child: child,
  );
}

enum _Kind { push, pop, modalIn, modalOut, fade }

/// Animated page host for the shell's state-driven navigation.
///
/// The shell decides which page is current; this widget turns each change of
/// [pageKey] into a transition. [depth] orders pages (deeper pushes, shallower
/// pops, equal cross-fades). A [modal] page rises from the bottom. A null
/// [child] is a transparent page that reveals whatever sits underneath (the
/// 3D stage), so returning home slides the page away off the live scene.
///
/// Both pages stay mounted for the duration, keyed by their page key, so the
/// incoming page keeps its state once the transition ends.
class FlareStage extends StatefulWidget {
  const FlareStage({
    super.key,
    required this.pageKey,
    required this.depth,
    required this.child,
    this.modal = false,
    this.onSettled,
    this.onSwipeBack,
  });
  final Object pageKey;
  final int depth;
  final Widget? child;
  final bool modal;
  final VoidCallback? onSettled;

  /// When set, a drag from the left edge carries the page with the finger
  /// (iOS swipe-back); releasing far or fast enough calls this to go back,
  /// and the pop continues from where the finger let go.
  final VoidCallback? onSwipeBack;

  @override
  State<FlareStage> createState() => _FlareStageState();
}

class _FlareStageState extends State<FlareStage> with TickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(vsync: this)
    ..addStatusListener(_status);

  /// Finger-driven offset of the current page, 0 at rest, 1 fully off.
  late final AnimationController _swipe = AnimationController(vsync: this);
  late final Listenable _motion = Listenable.merge([_controller, _swipe]);
  double _popFrom = 0;
  bool _swiping = false;
  Widget? _previous;
  Object? _previousKey;
  _Kind _kind = _Kind.fade;

  bool get animating => _previousKey != null;

  void _status(AnimationStatus status) {
    if (status != AnimationStatus.completed) return;
    setState(() {
      _previous = null;
      _previousKey = null;
    });
    widget.onSettled?.call();
  }

  @override
  void didUpdateWidget(FlareStage old) {
    super.didUpdateWidget(old);
    if (old.pageKey == widget.pageKey) return;
    final kind = widget.modal && !old.modal
        ? _Kind.modalIn
        : old.modal && !widget.modal
        ? _Kind.modalOut
        : widget.depth > old.depth
        ? _Kind.push
        : widget.depth < old.depth
        ? _Kind.pop
        : _Kind.fade;
    final duration = FlareMotion.of(context, switch (kind) {
      _Kind.push => FlareMotion.push,
      _Kind.pop => FlareMotion.pop,
      _Kind.modalIn || _Kind.modalOut => FlareMotion.modal,
      _Kind.fade => FlareMotion.fade,
    });
    // A pop released from a swipe carries on from the finger's position.
    _popFrom = kind == _Kind.pop ? _swipe.value : 0;
    _swipe.value = 0;
    _swiping = false;
    if (duration == Duration.zero) {
      _previous = null;
      _previousKey = null;
      _controller.value = 1;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) widget.onSettled?.call();
      });
      return;
    }
    _kind = kind;
    _previous = old.child;
    _previousKey = old.pageKey;
    _controller.duration = _popFrom > 0
        ? duration * (1 - _popFrom).clamp(.35, 1)
        : duration;
    _controller.forward(from: 0);
  }

  void _dragStart(DragStartDetails _) {
    if (animating) return;
    _swipe.stop();
    _swiping = true;
  }

  void _dragUpdate(DragUpdateDetails details) {
    if (!_swiping) return;
    final width = MediaQuery.sizeOf(context).width;
    _swipe.value = (_swipe.value + details.delta.dx / width).clamp(0, 1);
  }

  void _dragEnd(DragEndDetails details) {
    if (!_swiping) return;
    _swiping = false;
    final velocity = details.primaryVelocity ?? 0;
    final commit = velocity > 700 || (_swipe.value > .4 && velocity > -300);
    if (commit && widget.onSwipeBack != null) {
      widget.onSwipeBack!();
      // If the shell refused to go back, settle the page home again.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && !animating && _swipe.value > 0) _settleSwipe();
      });
    } else {
      _settleSwipe();
    }
  }

  void _settleSwipe() => _swipe.animateBack(
    0,
    duration: FlareMotion.of(
      context,
      Duration(milliseconds: (320 * _swipe.value).round().clamp(120, 320)),
    ),
    curve: FlareMotion.settle,
  );

  @override
  void dispose() {
    _controller.dispose();
    _swipe.dispose();
    super.dispose();
  }

  Widget _page(Widget? child) => child == null
      ? const SizedBox.expand()
      : Material(color: FlareColors.background, child: child);

  @override
  Widget build(BuildContext context) {
    final current = _layer(
      key: widget.pageKey,
      incoming: true,
      empty: widget.child == null,
      child: _page(widget.child),
    );
    final previous = animating
        ? _layer(
            key: _previousKey!,
            incoming: false,
            empty: _previous == null,
            child: _page(_previous),
          )
        : null;
    // The page that moves across the screen is drawn on top.
    final previousOnTop = _kind == _Kind.pop || _kind == _Kind.modalOut;
    final canSwipe =
        widget.onSwipeBack != null && widget.child != null && !widget.modal;
    return Stack(
      fit: StackFit.expand,
      children: [
        // While a swipe peels the page away, a dimmed backdrop sits beneath.
        AnimatedBuilder(
          key: const ValueKey('_swipe-underlay'),
          animation: _swipe,
          builder: (context, _) => _swipe.value == 0 || animating
              ? const SizedBox.shrink()
              : IgnorePointer(
                  child: ColoredBox(
                    color: Color.alphaBlend(
                      Colors.black.withValues(alpha: .22 * (1 - _swipe.value)),
                      FlareColors.background,
                    ),
                  ),
                ),
        ),
        if (previous != null && !previousOnTop) previous,
        current,
        if (previous != null && previousOnTop) previous,
        if (canSwipe && !animating)
          Positioned(
            key: const ValueKey('_swipe-edge'),
            left: 0,
            top: 0,
            bottom: 0,
            width: 18,
            child: GestureDetector(
              behavior: HitTestBehavior.translucent,
              onHorizontalDragStart: _dragStart,
              onHorizontalDragUpdate: _dragUpdate,
              onHorizontalDragEnd: _dragEnd,
              onHorizontalDragCancel: () {
                if (_swiping) {
                  _swiping = false;
                  _settleSwipe();
                }
              },
            ),
          ),
      ],
    );
  }

  Widget _layer({
    required Object key,
    required bool incoming,
    required bool empty,
    required Widget child,
  }) {
    return KeyedSubtree(
      key: ValueKey(key),
      // An empty page (the 3D stage underneath) never takes touches, and a
      // page on its way out stops taking them at once.
      child: IgnorePointer(
        ignoring: empty || !incoming,
        child: AnimatedBuilder(
          animation: _motion,
          child: RepaintBoundary(child: child),
          builder: (context, child) {
            final v = animating ? _controller.value : 1.0;
            final t = FlareMotion.settle.transform(v);
            final width = MediaQuery.sizeOf(context).width;
            var dx = 0.0, dy = 0.0, scale = 1.0, opacity = 1.0, dim = 0.0;
            var shadow = false;
            switch (_kind) {
              case _Kind.push:
                if (incoming) {
                  dx = (1 - t) * width;
                  shadow = true;
                } else {
                  dx = -.28 * t * width;
                  dim = .22 * t;
                }
              case _Kind.pop:
                final from = _popFrom;
                if (incoming) {
                  dx = -.28 * (1 - from) * (1 - t) * width;
                  dim = .22 * (1 - from) * (1 - t);
                } else {
                  dx = (from + (1 - from) * t) * width;
                  shadow = true;
                }
              case _Kind.modalIn:
                final height = MediaQuery.sizeOf(context).height;
                if (incoming) {
                  dy = (1 - t) * height;
                  shadow = true;
                } else {
                  scale = 1 - .06 * t;
                  dim = .3 * t;
                }
              case _Kind.modalOut:
                final height = MediaQuery.sizeOf(context).height;
                if (incoming) {
                  scale = .94 + .06 * t;
                  dim = .3 * (1 - t);
                } else {
                  dy = t * height;
                  shadow = true;
                }
              case _Kind.fade:
                if (incoming) {
                  opacity = Curves.easeOut.transform(v);
                  scale = .985 + .015 * t;
                } else {
                  opacity = 1 - Curves.easeIn.transform(v);
                }
            }
            if (!animating && incoming && _swipe.value > 0) {
              dx = _swipe.value * width;
              shadow = true;
            }
            // Keep one widget shape at rest and in flight: changing the
            // wrappers would remount the page and drop its state.
            return Transform.translate(
              offset: Offset(dx, dy),
              child: Transform.scale(
                scale: scale,
                child: Opacity(
                  opacity: opacity,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(scale < 1 ? 18 : 0),
                      boxShadow: [
                        if (shadow)
                          BoxShadow(
                            color: Colors.black.withValues(alpha: .18),
                            blurRadius: 24,
                          ),
                      ],
                    ),
                    child: ClipRRect(
                      clipBehavior: scale < 1 ? Clip.antiAlias : Clip.none,
                      borderRadius: BorderRadius.circular(
                        scale < 1 ? 18 * (1 - scale) / .06 : 0,
                      ),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          child!,
                          IgnorePointer(
                            child: ColoredBox(
                              color: Colors.black.withValues(alpha: dim),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

/// Gentle entrance: fades in and rises a few pixels, once, after [delay].
/// Used for list and grid items (staggered by index) and swapped panels.
class FadeSlideIn extends StatefulWidget {
  const FadeSlideIn({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.offset = 14,
    this.duration = const Duration(milliseconds: 420),
  });
  final Widget child;
  final Duration delay;
  final double offset;
  final Duration duration;

  /// Delay for the [index]th item of a list, capped so long lists never wait.
  static Duration stagger(int index, {int step = 32, int cap = 10}) =>
      Duration(milliseconds: step * (index < cap ? index : cap));

  @override
  State<FadeSlideIn> createState() => _FadeSlideInState();
}

class _FadeSlideInState extends State<FadeSlideIn>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: widget.duration,
  );

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (FlareMotion.reduced(context)) {
        _controller.value = 1;
      } else if (widget.delay == Duration.zero) {
        _controller.forward();
      } else {
        Future<void>.delayed(widget.delay, () {
          if (mounted) _controller.forward();
        });
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _controller,
    child: widget.child,
    builder: (context, child) {
      final t = FlareMotion.settle.transform(_controller.value);
      if (t >= 1) return child!;
      return Opacity(
        opacity: Curves.easeOut.transform(_controller.value),
        child: Transform.translate(
          offset: Offset(0, widget.offset * (1 - t)),
          child: child,
        ),
      );
    },
  );
}

/// Press feedback without stealing the tap: the child sinks slightly while a
/// finger rests on it and springs back on release. A drag (scrolling) cancels
/// the press so lists never wobble while scrolling.
class Pressable extends StatefulWidget {
  const Pressable({super.key, required this.child, this.scale = .965});
  final Widget child;
  final double scale;
  @override
  State<Pressable> createState() => _PressableState();
}

class _PressableState extends State<Pressable> {
  bool _down = false;
  Offset? _origin;

  void _set(bool value) {
    if (_down != value) setState(() => _down = value);
  }

  @override
  Widget build(BuildContext context) => Listener(
    onPointerDown: (event) {
      _origin = event.position;
      _set(true);
    },
    onPointerMove: (event) {
      if (_origin != null && (event.position - _origin!).distance > 8) {
        _set(false);
      }
    },
    onPointerUp: (_) => _set(false),
    onPointerCancel: (_) => _set(false),
    child: AnimatedScale(
      scale: _down ? widget.scale : 1,
      duration: FlareMotion.of(
        context,
        _down
            ? const Duration(milliseconds: 110)
            : const Duration(milliseconds: 320),
      ),
      curve: _down ? Curves.easeOut : Curves.easeOutBack,
      child: widget.child,
    ),
  );
}
