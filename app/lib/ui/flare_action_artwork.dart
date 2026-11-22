import 'package:flutter/material.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../data/flare_public_media.dart';

/// A static PoseHub image from the active catalogue and its verified cache.
/// The bundled still remains visible until the current artwork has decoded.
class FlareActionArtwork extends StatelessWidget {
  const FlareActionArtwork({
    super.key,
    required this.actionId,
    required this.fallback,
    this.thumbnail = false,
    this.fit = BoxFit.contain,
  });

  final String actionId;
  final Widget fallback;
  final bool thumbnail;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    final policy = FlarePublicMedia.of(context);
    final action = policy?.actionFor(actionId);
    if (action == null) return fallback;
    return trainer.PoseHubStandingImage(
      action: action,
      repository: policy!.repository,
      theme: Theme.of(context).brightness == Brightness.dark
          ? trainer.TrainerTheme.dark
          : trainer.TrainerTheme.light,
      thumbnail: thumbnail,
      preferCatalogArtwork: true,
      fit: fit,
      legacyFallback: fallback,
    );
  }
}
