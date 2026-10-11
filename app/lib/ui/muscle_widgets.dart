import 'package:flutter/material.dart';

import '../domain/catalog_models.dart';
import 'theme.dart';

/// A photograph of the existing teaching body, with this group highlighted.
/// Transparent artwork shares the same quiet colour field in either theme.
class MuscleThumbnail extends StatelessWidget {
  const MuscleThumbnail({super.key, required this.group, this.size = 72});

  final MuscleGroup group;
  final double size;

  @override
  Widget build(BuildContext context) {
    Theme.of(context);
    final color = Color(group.colorValue);
    final radius = (size * .22).clamp(8.0, 16.0);
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: size,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: Color.alphaBlend(
              color.withValues(alpha: FlareColors.palette.isDark ? .16 : .1),
              FlareColors.surface,
            ),
            borderRadius: BorderRadius.circular(radius),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(radius),
            child: Padding(
              padding: EdgeInsets.all(size * .055),
              child: Image.asset(
                'assets/muscles/${group.id}.webp',
                fit: BoxFit.contain,
                gaplessPlayback: true,
                excludeFromSemantics: true,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A complete muscle entry used by primary and supporting muscle lists.
class MuscleItemTile extends StatelessWidget {
  const MuscleItemTile({
    super.key,
    required this.group,
    this.subtitle,
    required this.onTap,
  });

  final MuscleGroup group;
  final String? subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    Theme.of(context);
    final description = subtitle?.trim();
    final hasDescription = description != null && description.isNotEmpty;
    return Semantics(
      button: true,
      label: [group.label, if (hasDescription) description].join('。'),
      onTap: onTap,
      excludeSemantics: true,
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Row(
              children: [
                MuscleThumbnail(group: group),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        group.label,
                        style: TextStyle(
                          fontSize: 16,
                          height: 1.3,
                          fontWeight: FontWeight.w600,
                          color: FlareColors.palette.text,
                        ),
                      ),
                      if (hasDescription) ...[
                        const SizedBox(height: 5),
                        Text(
                          description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            height: 1.45,
                            color: FlareColors.dim,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  Icons.chevron_right_rounded,
                  size: 20,
                  color: FlareColors.dim,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A compact image-and-name entry for related muscles, suitable for a Wrap.
class MuscleItemChip extends StatelessWidget {
  const MuscleItemChip({super.key, required this.group, required this.onTap});

  final MuscleGroup group;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    Theme.of(context);
    return Semantics(
      button: true,
      label: group.label,
      onTap: onTap,
      excludeSemantics: true,
      child: Material(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 48, maxWidth: 240),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(4, 4, 12, 4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  MuscleThumbnail(group: group, size: 40),
                  const SizedBox(width: 9),
                  Flexible(
                    child: Text(
                      group.label,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 13,
                        height: 1.3,
                        fontWeight: FontWeight.w500,
                        color: FlareColors.secondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A related muscle card in the detail panel's horizontal collection.
class MuscleAssistCard extends StatelessWidget {
  const MuscleAssistCard({
    super.key,
    required this.group,
    required this.onTap,
    this.compact = false,
  });

  final MuscleGroup group;
  final VoidCallback onTap;
  final bool compact;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    label: group.label,
    onTap: onTap,
    excludeSemantics: true,
    child: SizedBox(
      width: 160,
      child: Material(
        color: FlareColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: FlareColors.hairline),
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: EdgeInsets.all(compact ? 8 : 10),
            child: Row(
              children: [
                MuscleThumbnail(group: group, size: compact ? 32 : 48),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    group.label,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.35,
                      fontWeight: FontWeight.w600,
                      color: FlareColors.text,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

/// A small preview of the groups behind a single "other muscles" entry.
class MuscleThumbnailStack extends StatelessWidget {
  const MuscleThumbnailStack({super.key, required this.groups});

  final List<MuscleGroup> groups;

  @override
  Widget build(BuildContext context) {
    final shown = groups.take(3).toList();
    if (shown.isEmpty) return const SizedBox.shrink();
    return ExcludeSemantics(
      child: SizedBox(
        width: 32 + (shown.length - 1) * 23,
        height: 32,
        child: Stack(
          children: [
            for (final (index, group) in shown.indexed)
              Positioned(
                left: index * 23,
                child: MuscleThumbnail(group: group, size: 32),
              ),
          ],
        ),
      ),
    );
  }
}
