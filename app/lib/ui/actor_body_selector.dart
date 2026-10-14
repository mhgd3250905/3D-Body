import 'package:flutter/material.dart';
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
            label: Text(
              label,
              style: const TextStyle(
                fontFamily: 'FlareSans',
                fontFamilyFallback: [
                  'NotoSansKR',
                  'NotoSansArabic',
                  'NotoSansDevanagari',
                ],
                fontSize: 13,
                height: 1.2,
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
