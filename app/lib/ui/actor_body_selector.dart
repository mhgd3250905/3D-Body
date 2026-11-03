import 'package:flutter/material.dart';

import 'theme.dart';
import '../l10n/app_localizations.dart';

/// All athlete styles stay readable at phone widths and larger text sizes.
class ActorBodySelector extends StatelessWidget {
  const ActorBodySelector({
    super.key,
    required this.value,
    required this.onChanged,
  });

  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);
    // A label wider than the row (Серебряное крыло at 320 pt, 1.5×) wraps
    // to two lines inside its chip instead of being clipped at the edge.
    return LayoutBuilder(
      builder: (context, box) => _chips(context, s, box.maxWidth),
    );
  }

  Widget _chips(BuildContext context, AppLocalizations s, double maxWidth) {
    return Wrap(
      spacing: 8,
      runSpacing: 6,
      children: [
        for (final (id, label) in [
          ('original', s.actorBodyOriginal),
          ('training', s.actorBodyTraining),
          ('shadow', s.actorBodyShadow),
          ('chrome', s.actorBodyChrome),
          ('street', s.actorBodyStreet),
          ('robot', s.actorBodyRobot),
          ('cyber', s.actorBodyCyber),
        ])
          ChoiceChip(
            key: ValueKey('actor-body-$id'),
            showCheckmark: false,
            side: BorderSide.none,
            shape: const StadiumBorder(),
            materialTapTargetSize: MaterialTapTargetSize.padded,
            visualDensity: const VisualDensity(vertical: -2),
            backgroundColor: FlareColors.palette.segmentTrack,
            selectedColor: FlareColors.accent.withValues(alpha: .16),
            label: ConstrainedBox(
              constraints: BoxConstraints(
                maxWidth: maxWidth.isFinite
                    ? (maxWidth - 40).clamp(40, double.infinity)
                    : double.infinity,
              ),
              child: Text(
                label,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: value == id ? FlareColors.accentInk : FlareColors.text,
                  fontWeight: FontWeight.w500,
                  fontFamily: 'FlareSans',
                  fontFamilyFallback: const [
                    'NotoSansKR',
                    'NotoSansArabic',
                    'NotoSansDevanagari',
                  ],
                  fontSize: 13,
                  height: 1.2,
                ),
              ),
            ),
            selected: value == id,
            onSelected: (selected) {
              if (selected) onChanged(id);
            },
          ),
      ],
    );
  }
}
