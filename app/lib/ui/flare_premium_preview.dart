import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'components.dart';
import 'flare_premium_offer_card.dart';
import 'motion.dart';
import 'theme.dart';

enum FlarePremiumFeature { records, planEditor, training }

/// Keeps the feature and its back navigation in place while offering Premium.
class FlarePremiumPreview extends StatefulWidget {
  const FlarePremiumPreview({
    super.key,
    required this.feature,
    required this.locked,
    required this.onSubscribe,
    required this.child,
    this.onEdgeBack,
  });

  final FlarePremiumFeature feature;
  final bool locked;
  final VoidCallback onSubscribe;
  final Widget child;
  final VoidCallback? onEdgeBack;

  @override
  State<FlarePremiumPreview> createState() => _FlarePremiumPreviewState();
}

class _FlarePremiumPreviewState extends State<FlarePremiumPreview>
    with TickerProviderStateMixin {
  static const _cardDuration = Duration(milliseconds: 360);
  static const _glowDuration = Duration(milliseconds: 480);
  static const _veilDuration = Duration(milliseconds: 240);
  static const _exitDuration = Duration(milliseconds: 220);
  static const _sheenDelay = Duration(milliseconds: 1200);
  static final _veilProgress = Interval(
    0,
    _veilDuration.inMilliseconds / _glowDuration.inMilliseconds,
    curve: Curves.easeOutCubic,
  );
  static final _cardProgress = Interval(
    0,
    _cardDuration.inMilliseconds / _glowDuration.inMilliseconds,
    curve: Curves.easeOutCubic,
  );

  late final _entrance = AnimationController(
    vsync: this,
    duration: _glowDuration,
  )..addListener(_scheduleSheen);
  late final _exit = AnimationController(vsync: this, duration: _exitDuration);
  late final _motion = Listenable.merge([_entrance, _exit]);
  final _sheenEnabled = ValueNotifier(false);
  ModalRoute<dynamic>? _route;
  Timer? _sheenTimer;
  bool? _reducedMotion;
  bool _stageSettled = true;
  bool _pageActive = true;
  bool _routeClosing = false;
  bool _entranceStarted = false;
  double? _safeBottom;
  double _edgeDistance = 0;

  bool get _leaving => !_pageActive || _routeClosing;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final wasLeaving = _leaving;
    final route = ModalRoute.of(context);
    if (_route != route) {
      _route?.animation?.removeStatusListener(_onRouteStatus);
      _route = route;
      _routeClosing = route?.animation?.status == AnimationStatus.reverse;
      route?.animation?.addStatusListener(_onRouteStatus);
      if (route?.offstage == true) {
        // Hero measurement temporarily reports a completed route animation.
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) _maybeStartEntrance();
        });
      }
    }
    _stageSettled = FlarePageActivity.settledOf(context);
    _pageActive = FlarePageActivity.of(context);
    if (_leaving) {
      if (!wasLeaving) _freezeForExit();
      return;
    }
    final reducedMotion = FlareMotion.reduced(context);
    if (_reducedMotion != reducedMotion) {
      _reducedMotion = reducedMotion;
      _updateReveal();
    } else if (wasLeaving) {
      _resumeAfterExitCancelled();
    } else {
      _maybeStartEntrance();
    }
  }

  @override
  void didUpdateWidget(FlarePremiumPreview oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_leaving && oldWidget.locked != widget.locked) _updateReveal();
  }

  void _updateReveal() {
    _freezeForExit();
    _entranceStarted = false;
    if (_reducedMotion == true) {
      _entrance.value = widget.locked ? 1 : 0;
      _exit.value = widget.locked ? 0 : 1;
    } else if (widget.locked) {
      _entrance.reset();
      _exit.reset();
      _maybeStartEntrance();
    } else if (_entrance.value != 0) {
      _exit.forward(from: 0);
    }
  }

  void _freezeForExit() {
    _entrance.stop();
    _exit.stop();
    _sheenTimer?.cancel();
    _sheenTimer = null;
    _sheenEnabled.value = false;
  }

  void _resumeAfterExitCancelled() {
    if (_reducedMotion == true) {
      _updateReveal();
    } else if (widget.locked && _entranceStarted) {
      if (!_entrance.isCompleted) _entrance.forward();
      _scheduleSheen();
    } else if (!widget.locked && _entrance.value != 0 && !_exit.isCompleted) {
      _exit.forward();
    } else {
      _maybeStartEntrance();
    }
  }

  void _onRouteStatus(AnimationStatus status) {
    final wasLeaving = _leaving;
    if (status == AnimationStatus.reverse) {
      _routeClosing = true;
      if (!wasLeaving) _freezeForExit();
    } else if (status == AnimationStatus.completed) {
      _routeClosing = false;
      if (wasLeaving && !_leaving) {
        _resumeAfterExitCancelled();
        setState(() {});
      } else {
        _maybeStartEntrance();
      }
    }
  }

  void _maybeStartEntrance() {
    final routeReady =
        _route?.offstage != true &&
        (_route?.animation?.status ?? AnimationStatus.completed) ==
            AnimationStatus.completed;
    if (widget.locked &&
        _reducedMotion == false &&
        !_entranceStarted &&
        !_leaving &&
        _stageSettled &&
        routeReady) {
      _entranceStarted = true;
      _entrance.forward();
    }
  }

  void _scheduleSheen() {
    if (!_leaving &&
        _entranceStarted &&
        _sheenTimer == null &&
        _cardProgress.transform(_entrance.value) == 1) {
      _sheenTimer = Timer(_sheenDelay, () => _sheenEnabled.value = true);
    }
  }

  @override
  void dispose() {
    _route?.animation?.removeStatusListener(_onRouteStatus);
    _sheenTimer?.cancel();
    _sheenEnabled.dispose();
    _entrance.dispose();
    _exit.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.sizeOf(context).height;
    final viewBottom = MediaQuery.viewPaddingOf(context).bottom;
    if (!_leaving || _safeBottom == null) _safeBottom = viewBottom;
    final background = FlareColors.background;
    final offer = RepaintBoundary(
      child: Material(
        type: MaterialType.transparency,
        child: _offer(context, _safeBottom!),
      ),
    );
    return LayoutBuilder(
      builder: (context, constraints) {
        final height = constraints.maxHeight;
        final fadeTop = (screenHeight * .45).clamp(0.0, height);
        final tintStart = screenHeight * .40;
        final tintMid = screenHeight * .55;
        return AnimatedBuilder(
          animation: _motion,
          child: offer,
          builder: (context, offer) {
            final opacity =
                _veilProgress.transform(_entrance.value) * (1 - _exit.value);
            final cardProgress = _cardProgress.transform(_entrance.value);
            final shown = opacity > 0;
            final blocked = widget.locked || shown;
            return Stack(
              fit: StackFit.expand,
              children: [
                _PreviewSemantics(
                  cutoff: blocked ? fadeTop : null,
                  child: widget.child,
                ),
                if (blocked)
                  Positioned.fill(
                    top: fadeTop,
                    child: const AbsorbPointer(
                      key: ValueKey('premium-preview-blocker'),
                      child: SizedBox.expand(),
                    ),
                  ),
                if (shown)
                  CustomMultiChildLayout(
                    delegate: _PremiumOfferLayout(40 * (1 - cardProgress)),
                    children: [
                      LayoutId(
                        id: _OfferSlot.backdrop,
                        child: IgnorePointer(
                          child: _PremiumBackdrop(
                            tintStart: tintStart,
                            tintMid: tintMid,
                            opacity: opacity,
                            background: background,
                          ),
                        ),
                      ),
                      LayoutId(
                        id: _OfferSlot.panel,
                        child: IgnorePointer(
                          ignoring: !widget.locked,
                          child: ExcludeSemantics(
                            excluding: !widget.locked,
                            child: FadeTransition(
                              opacity: AlwaysStoppedAnimation(opacity),
                              child: offer!,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                if (blocked && widget.onEdgeBack != null)
                  Positioned(
                    left: 0,
                    top: fadeTop,
                    bottom: 0,
                    width: 24,
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      excludeFromSemantics: true,
                      onHorizontalDragStart: (_) => _edgeDistance = 0,
                      onHorizontalDragUpdate: (details) =>
                          _edgeDistance += details.delta.dx,
                      onHorizontalDragEnd: (details) {
                        final fast = (details.primaryVelocity ?? 0) >= 700;
                        if (_edgeDistance >= 64 ||
                            (_edgeDistance >= 12 && fast)) {
                          widget.onEdgeBack?.call();
                        }
                      },
                    ),
                  ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _offer(BuildContext context, double safeBottom) {
    final strings = context.strings;
    final (
      title,
      highlight,
      description,
      benefits,
      icons,
    ) = switch (widget.feature) {
      FlarePremiumFeature.records => (
        strings.premiumPreviewRecordsTitle,
        strings.premiumPreviewRecordsHighlight,
        strings.premiumPreviewRecordsDescription,
        [
          strings.premiumPreviewBenefitStreak,
          strings.premiumPreviewBenefitMilestones,
          strings.premiumPreviewBenefitDuration,
        ],
        [
          Icons.local_fire_department_outlined,
          Icons.emoji_events_outlined,
          Icons.timer_outlined,
        ],
      ),
      FlarePremiumFeature.planEditor => (
        strings.premiumPreviewPlanEditorTitle,
        strings.premiumPreviewPlanEditorHighlight,
        strings.premiumPreviewPlanEditorDescription,
        [
          strings.premiumPreviewBenefitSets,
          strings.premiumPreviewBenefitActions,
          strings.premiumPreviewBenefitSaves,
        ],
        [
          Icons.tune_rounded,
          Icons.layers_outlined,
          Icons.all_inclusive_rounded,
        ],
      ),
      FlarePremiumFeature.training => (
        strings.premiumPreviewTrainingTitle,
        strings.premiumPreviewTrainingHighlight,
        strings.premiumPreviewTrainingDescription,
        [
          strings.premiumPreviewBenefitVoice,
          strings.premiumPreviewBenefitDemos,
          strings.premiumPreviewBenefitLogging,
        ],
        [
          Icons.graphic_eq_rounded,
          Icons.play_circle_outline_rounded,
          Icons.insights_rounded,
        ],
      ),
    };
    return FlarePremiumOfferCard(
      badge: strings.premiumPreviewBadge,
      title: title,
      highlight: highlight,
      description: description,
      benefits: benefits,
      benefitIcons: icons,
      buttonLabel: strings.premiumPreviewSubscribe,
      footer: strings.premiumPreviewFooter,
      safeBottom: safeBottom,
      glow: _entrance,
      sheenEnabled: _sheenEnabled,
      onSubscribe: widget.onSubscribe,
    );
  }
}

enum _OfferSlot { backdrop, panel }

class _PremiumOfferLayout extends MultiChildLayoutDelegate {
  _PremiumOfferLayout(this.offset);

  final double offset;

  @override
  void performLayout(Size size) {
    final panel = layoutChild(
      _OfferSlot.panel,
      BoxConstraints.tightFor(
        width: size.width,
      ).copyWith(maxHeight: size.height),
    );
    final top = size.height - panel.height + offset;
    positionChild(_OfferSlot.panel, Offset(0, top));
    if (hasChild(_OfferSlot.backdrop)) {
      // The backdrop extends behind the rounded corners of the panel.
      layoutChild(
        _OfferSlot.backdrop,
        BoxConstraints.tightFor(
          width: size.width,
          height: top + FlarePremiumOfferCard.topRadius,
        ),
      );
      positionChild(_OfferSlot.backdrop, Offset.zero);
    }
  }

  @override
  bool shouldRelayout(_PremiumOfferLayout oldDelegate) =>
      offset != oldDelegate.offset;
}

class _PremiumBackdrop extends StatelessWidget {
  const _PremiumBackdrop({
    required this.tintStart,
    required this.tintMid,
    required this.opacity,
    required this.background,
  });

  final double tintStart;
  final double tintMid;
  final double opacity;
  final Color background;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final height = constraints.maxHeight;
      final panelTop = height - FlarePremiumOfferCard.topRadius;
      final start = math.min(tintStart, panelTop);
      final hasMidStop = tintMid < panelTop;
      final clear = background.withValues(alpha: 0);
      final tint = background.withValues(alpha: .96 * opacity);
      return DecoratedBox(
        key: const ValueKey('premium-preview-gradient'),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              clear,
              clear,
              if (hasMidStop) background.withValues(alpha: .70 * opacity),
              tint,
              tint,
            ],
            stops: [
              0,
              start / height,
              if (hasMidStop) tintMid / height,
              panelTop / height,
              1,
            ],
          ),
        ),
        child: const SizedBox.expand(),
      );
    },
  );
}

/// Restricts access to obscured controls while leaving the preview and header
/// visible, including the native and accessibility back actions.
class _PreviewSemantics extends SingleChildRenderObjectWidget {
  const _PreviewSemantics({required this.cutoff, required super.child});

  final double? cutoff;

  @override
  RenderObject createRenderObject(BuildContext context) =>
      _RenderPreviewSemantics(cutoff);

  @override
  void updateRenderObject(
    BuildContext context,
    _RenderPreviewSemantics renderObject,
  ) => renderObject.cutoff = cutoff;
}

class _RenderPreviewSemantics extends RenderProxyBox {
  _RenderPreviewSemantics(this._cutoff);

  double? _cutoff;

  set cutoff(double? value) {
    if (_cutoff == value) return;
    _cutoff = value;
    markNeedsSemanticsUpdate();
  }

  @override
  Rect? describeSemanticsClip(RenderObject? child) {
    final cutoff = _cutoff;
    return cutoff == null ? null : Rect.fromLTWH(0, 0, size.width, cutoff);
  }
}
