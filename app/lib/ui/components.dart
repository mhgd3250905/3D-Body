import 'package:flutter/material.dart';
import '../domain/catalog_models.dart';
import '../l10n/app_localizations.dart';
import 'theme.dart';

extension FlareStrings on BuildContext {
  AppLocalizations get strings => AppLocalizations.of(this);
}

class SurfaceCard extends StatelessWidget {
  const SurfaceCard({super.key, required this.child, this.padding = 16});
  final Widget child;
  final double padding;
  @override
  Widget build(BuildContext context) => Container(
    padding: EdgeInsets.all(padding),
    decoration: BoxDecoration(
      color: FlareColors.surface,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: Colors.white.withValues(alpha: .07)),
    ),
    child: child,
  );
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key});
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 20, bottom: 10),
    child: Text(
      text,
      style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
    ),
  );
}

class TierSelector extends StatelessWidget {
  const TierSelector({super.key, required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String> onChanged;
  @override
  Widget build(BuildContext context) => SizedBox(
    width: double.infinity,
    child: SegmentedButton<String>(
      showSelectedIcon: false,
      segments: [
        ButtonSegment(value: 'A', label: Text(context.strings.tierA)),
        ButtonSegment(value: 'B', label: Text(context.strings.tierB)),
        ButtonSegment(value: 'C', label: Text(context.strings.tierC)),
      ],
      selected: {value},
      onSelectionChanged: (values) => onChanged(values.first),
      style: const ButtonStyle(visualDensity: VisualDensity.compact),
    ),
  );
}

class DrillTile extends StatelessWidget {
  const DrillTile({
    super.key,
    required this.drill,
    required this.onTap,
    this.trailing,
  });
  final Drill drill;
  final VoidCallback onTap;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) => Card(
    margin: const EdgeInsets.only(bottom: 10),
    color: FlareColors.surface,
    clipBehavior: Clip.antiAlias,
    child: InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(
                drill.thumbnailAsset,
                width: 80,
                height: 80,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    drill.name,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    drill.prescription,
                    style: const TextStyle(
                      color: FlareColors.muted,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    '${drill.tierLabel} · ${drill.equipment}',
                    style: const TextStyle(
                      color: FlareColors.muted,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            trailing ??
                const Icon(Icons.chevron_right, color: FlareColors.muted),
          ],
        ),
      ),
    ),
  );
}

class BodyText extends StatelessWidget {
  const BodyText(this.text, {super.key, this.color});
  final String text;
  final Color? color;
  @override
  Widget build(BuildContext context) => Text(
    text,
    style: TextStyle(
      fontSize: 14,
      height: 1.65,
      color: color ?? const Color(0xffd8d8df),
    ),
  );
}
