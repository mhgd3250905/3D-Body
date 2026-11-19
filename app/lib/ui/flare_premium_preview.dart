import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

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
  static const _delay = Duration(milliseconds: 120);
  static const _cardDuration = Duration(milliseconds: 360);
  static const _glowDuration = Duration(milliseconds: 480);
  static const _veilDuration = Duration(milliseconds: 240);
  static const _exitDuration = Duration(milliseconds: 220);
  static const _sheenDelay = Duration(milliseconds: 700);
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
  );
  late final _exit = AnimationController(vsync: this, duration: _exitDuration);
  late final _motion = Listenable.merge([_entrance, _exit]);
  Timer? _entranceDelay;
  Timer? _sheenTimer;
  bool? _reducedMotion;
  bool _sheenReady = false;
  double _edgeDistance = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final reducedMotion = FlareMotion.reduced(context);
    if (_reducedMotion == reducedMotion) return;
    _reducedMotion = reducedMotion;
    _updateReveal();
  }

  @override
  void didUpdateWidget(FlarePremiumPreview oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.locked != widget.locked) _updateReveal();
  }

  void _updateReveal() {
    _entranceDelay?.cancel();
    _sheenTimer?.cancel();
    _sheenReady = false;
    _entrance.stop();
    _exit.stop();
    if (_reducedMotion == true) {
      _entrance.value = widget.locked ? 1 : 0;
      _exit.value = widget.locked ? 0 : 1;
    } else if (widget.locked) {
      _entrance.reset();
      _exit.reset();
      _entranceDelay = Timer(_delay, _entrance.forward);
      _sheenTimer = Timer(_delay + _cardDuration + _sheenDelay, () {
        setState(() => _sheenReady = true);
      });
    } else if (_entrance.value != 0) {
      _exit.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _entranceDelay?.cancel();
    _sheenTimer?.cancel();
    _entrance.dispose();
    _exit.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.sizeOf(context).height;
    final safeBottom = MediaQuery.viewPaddingOf(context).bottom;
    final background = FlareColors.background;
    return LayoutBuilder(
      builder: (context, constraints) {
        final height = constraints.maxHeight;
        final fadeTop = (screenHeight * .45).clamp(0.0, height);
        final blurTop = screenHeight * .50;
        final blurRamp = screenHeight * .10;
        return AnimatedBuilder(
          animation: _motion,
          child: widget.child,
          builder: (context, child) {
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
                  child: child!,
                ),
                if (blocked)
                  Positioned.fill(
                    top: fadeTop,
                    child: const AbsorbPointer(
                      key: ValueKey('premium-preview-blocker'),
                      child: SizedBox.expand(),
                    ),
                  ),
                if (widget.locked || shown)
                  CustomMultiChildLayout(
                    delegate: _PremiumOfferLayout(40 * (1 - cardProgress)),
                    children: [
                      if (shown)
                        LayoutId(
                          id: _OfferSlot.backdrop,
                          child: IgnorePointer(
                            child: _PremiumBackdrop(
                              fadeTop: fadeTop,
                              blurTop: blurTop,
                              blurRamp: blurRamp,
                              opacity: opacity,
                              background: background,
                            ),
                          ),
                        ),
                      LayoutId(
                        id: _OfferSlot.panel,
                        child: IgnorePointer(
                          ignoring: !widget.locked || !shown,
                          child: ExcludeSemantics(
                            excluding: !widget.locked || !shown,
                            child: FadeTransition(
                              opacity: AlwaysStoppedAnimation(opacity),
                              child: Material(
                                type: MaterialType.transparency,
                                child: _offer(context, safeBottom),
                              ),
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
      sheenEnabled: widget.locked && _sheenReady,
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
    required this.fadeTop,
    required this.blurTop,
    required this.blurRamp,
    required this.opacity,
    required this.background,
  });

  final double fadeTop;
  final double blurTop;
  final double blurRamp;
  final double opacity;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final height = constraints.maxHeight;
        final panelTop = height - FlarePremiumOfferCard.topRadius;
        return Stack(
          fit: StackFit.expand,
          children: [
            if (blurTop < height)
              Positioned.fill(
                top: blurTop,
                child: _PremiumBackdropBlur(
                  rampHeight: blurRamp,
                  visibleHeight: height - blurTop,
                  strength: opacity,
                ),
              ),
            FadeTransition(
              opacity: AlwaysStoppedAnimation(opacity),
              child: ShaderMask(
                key: const ValueKey('premium-preview-gradient'),
                blendMode: BlendMode.dstIn,
                // Start the mask at the top of the viewport to keep the
                // transparent stop inside its layer at fractional pixel sizes.
                shaderCallback: (bounds) => LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: const [
                    Colors.transparent,
                    Colors.transparent,
                    Colors.white,
                    Colors.white,
                  ],
                  stops: [
                    0,
                    math.min(fadeTop, panelTop) / height,
                    panelTop / height,
                    1,
                  ],
                ).createShader(bounds),
                child: ColoredBox(color: background.withValues(alpha: .92)),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _PremiumBackdropBlur extends StatelessWidget {
  const _PremiumBackdropBlur({
    required this.rampHeight,
    required this.visibleHeight,
    required this.strength,
  });

  final double rampHeight;
  final double visibleHeight;
  final double strength;

  @override
  Widget build(BuildContext context) {
    const slices = 10;
    final band = rampHeight / slices;
    final sigma = 10 * strength;
    // ShaderMask paints into an isolated layer on the web, so the filter
    // must sample the page in sibling layers outside the tint's mask.
    return Stack(
      key: const ValueKey('premium-preview-blur'),
      fit: StackFit.expand,
      children: [
        for (var i = 0; i < slices && band * i < visibleHeight; i++)
          Positioned.fill(
            top: band * i,
            bottom: null,
            child: SizedBox(
              height: math.min(band, visibleHeight - band * i),
              child: _blurBand(sigma * (i + .5) / slices),
            ),
          ),
        if (rampHeight < visibleHeight)
          Positioned.fill(top: rampHeight, child: _blurBand(sigma)),
      ],
    );
  }

  Widget _blurBand(double sigma) => ClipRect(
    child: BackdropFilter(
      filter: ui.ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
      child: const SizedBox.expand(),
    ),
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
