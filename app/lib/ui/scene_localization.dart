import '../domain/catalog_models.dart';
import '../l10n/app_localizations.dart';

Map<String, Object?> sceneLocalization(
  AppLocalizations strings,
  Iterable<MuscleGroup> groups, {
  required bool rtl,
}) => {
  'locale': strings.localeName,
  'rtl': rtl,
  'groups': {for (final group in groups) group.id: group.label},
  'shortGroups': {for (final group in groups) group.id: group.shortLabel},
  'viewLabels': {
    for (final group in groups) group.id: strings.viewGroup(group.shortLabel),
  },
  'syncEffort': strings.syncEffort,
  'mapAccessibility': strings.phaseMapAccessibility,
  'sceneAccessibility': strings.sceneAccessibleTitle,
  'sceneFailed': strings.sceneFailed,
  'retry': strings.retry,
};
