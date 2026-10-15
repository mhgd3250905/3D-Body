import 'package:flutter/material.dart';

import 'motion.dart';
import 'theme.dart';

/// A small, offline render of the accepted v42 / R12 loop. It can play before the
/// WebView or model is ready, without starting a second 3D renderer.
class FlareLoadingSilhouette extends StatelessWidget {
  const FlareLoadingSilhouette({
    super.key,
    this.size = 176,
    this.animate = true,
  });

  final double size;
  final bool animate;

  static const animationAsset = 'assets/brand/flare-loading-v42-r12.webp';
  static const stillAsset = 'assets/brand/flare-loading-v42-r12-still.webp';

  @override
  Widget build(BuildContext context) {
    final moving = animate && !FlareMotion.reduced(context);
    Widget still() => Image.asset(
      stillAsset,
      width: size,
      height: size,
      fit: BoxFit.contain,
      color: FlareColors.accent,
      colorBlendMode: BlendMode.srcIn,
      filterQuality: FilterQuality.high,
      excludeFromSemantics: true,
    );
    return SizedBox.square(
      dimension: size,
      child: moving
          ? Image.asset(
              animationAsset,
              width: size,
              height: size,
              fit: BoxFit.contain,
              color: FlareColors.accent,
              colorBlendMode: BlendMode.srcIn,
              filterQuality: FilterQuality.high,
              excludeFromSemantics: true,
              frameBuilder: (context, child, frame, synchronouslyLoaded) =>
                  frame == null ? still() : child,
            )
          : still(),
    );
  }
}
