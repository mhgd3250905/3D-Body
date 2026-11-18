import 'package:flutter/material.dart';

import '../platform/scene/scene.dart';
import '../platform/scene/scene_variant.dart';
import 'components.dart' show FlareStrings;

class FlareV5Stage extends StatelessWidget {
  const FlareV5Stage({
    super.key,
    required this.controller,
    this.fallback,
    this.interactive = true,
    this.onRetry,
  });

  final SceneController controller;
  final Widget? fallback;
  final bool interactive;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: controller,
      builder: (context, _) {
        final presented = controller.presented;
        return Stack(
          fit: StackFit.expand,
          children: [
            SceneView(
              controller: controller,
              body: flareStraightLegsScene,
              interactive: interactive && presented,
              concealed: !presented,
            ),
            if (!presented)
              fallback ??
                  ColoredBox(
                    color: const Color(0xfff4efe6),
                    child: Center(
                      child: controller.errorCode == null
                          ? Semantics(
                              label: context.strings.sceneLoading,
                              child: const CircularProgressIndicator(),
                            )
                          : TextButton(
                              onPressed: onRetry,
                              child: Text(context.strings.retry),
                            ),
                    ),
                  ),
            if (!presented &&
                fallback != null &&
                controller.errorCode != null &&
                onRetry != null)
              Center(
                child: FilledButton(
                  onPressed: onRetry,
                  child: Text(context.strings.retry),
                ),
              ),
          ],
        );
      },
    );
  }
}
