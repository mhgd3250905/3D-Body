import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'components.dart';
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
    with SingleTickerProviderStateMixin {
  late final _reveal = AnimationController(vsync: this);
  Timer? _entranceDelay;
  bool? _reducedMotion;
  double _exitOffset = 0;
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
    _reveal.stop();
    if (_reducedMotion == true) {
      _reveal.value = widget.locked ? 1 : 0;
    } else if (widget.locked) {
      _entranceDelay = Timer(const Duration(milliseconds: 120), () {
        _reveal.animateTo(
          1,
          duration: const Duration(milliseconds: 220),
          curve: Curves.easeOutCubic,
        );
      });
    } else {
      _exitOffset = 16 * (1 - _reveal.value);
      _reveal.animateBack(0, duration: const Duration(milliseconds: 200));
    }
  }

  @override
  void dispose() {
    _entranceDelay?.cancel();
    _reveal.dispose();
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
        final fadeEnd = (screenHeight * .62).clamp(fadeTop, height);
        final opaqueStop = height > fadeTop
            ? (fadeEnd - fadeTop) / (height - fadeTop)
            : 1.0;
        return AnimatedBuilder(
          animation: _reveal,
          child: widget.child,
          builder: (context, child) {
            final shown = _reveal.value > 0;
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
                    child: AbsorbPointer(
                      child: FadeTransition(
                        opacity: _reveal,
                        child: DecoratedBox(
                          key: const ValueKey('premium-preview-gradient'),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                background.withValues(alpha: 0),
                                background,
                                background,
                              ],
                              stops: [0, opaqueStop, 1],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                if (widget.locked || shown)
                  Positioned(
                    left: 16,
                    right: 16,
                    bottom: safeBottom + 16,
                    child: IgnorePointer(
                      ignoring: !widget.locked || !shown,
                      child: ExcludeSemantics(
                        excluding: !widget.locked || !shown,
                        child: FadeTransition(
                          opacity: _reveal,
                          child: Transform.translate(
                            offset: Offset(
                              0,
                              widget.locked
                                  ? 16 * (1 - _reveal.value)
                                  : _exitOffset,
                            ),
                            child: Material(
                              type: MaterialType.transparency,
                              child: _PreviewCard(
                                feature: widget.feature,
                                onSubscribe: widget.onSubscribe,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
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

class _PreviewCard extends StatelessWidget {
  const _PreviewCard({required this.feature, required this.onSubscribe});

  final FlarePremiumFeature feature;
  final VoidCallback onSubscribe;

  @override
  Widget build(BuildContext context) {
    final strings = context.strings;
    final (title, description) = switch (feature) {
      FlarePremiumFeature.records => (
        strings.premiumPreviewRecordsTitle,
        strings.premiumPreviewRecordsDescription,
      ),
      FlarePremiumFeature.planEditor => (
        strings.premiumPreviewPlanEditorTitle,
        strings.premiumPreviewPlanEditorDescription,
      ),
      FlarePremiumFeature.training => (
        strings.premiumPreviewTrainingTitle,
        strings.premiumPreviewTrainingDescription,
      ),
    };
    final dark = Theme.of(context).brightness == Brightness.dark;
    return DecoratedBox(
      key: const ValueKey('premium-preview-card'),
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: dark
            ? Border.all(color: Colors.white.withValues(alpha: .08))
            : null,
        boxShadow: dark
            ? null
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: .08),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Icon(
                  Icons.lock_rounded,
                  size: 18,
                  color: FlareColors.accentInk,
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: Text(
                    strings.premiumPreviewBadge,
                    style: FlareType.navSubtitle.copyWith(
                      color: FlareColors.accentInk,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Semantics(
              header: true,
              child: Text(
                title,
                style: FlareType.navTitle.copyWith(
                  color: FlareColors.text,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: FlareType.rowMeta.copyWith(color: FlareColors.dim),
            ),
            const SizedBox(height: 18),
            SizedBox(
              height: 48,
              child: FilledButton(
                key: const ValueKey('premium-preview-subscribe'),
                onPressed: onSubscribe,
                style: FilledButton.styleFrom(
                  backgroundColor: FlareColors.accent,
                  foregroundColor: FlareColors.onAccent,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  textStyle: FlareType.primaryButton.copyWith(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                child: Text(
                  strings.premiumPreviewSubscribe,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
