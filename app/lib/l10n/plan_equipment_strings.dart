import 'package:flutter/widgets.dart';

import 'app_localizations.dart';
import 'languages.dart';

String planEquipmentNeededLabel(Locale locale) =>
    _planEquipmentStrings(locale).planEquipmentNeeded;

String? planEquipmentName(String id, Locale locale) {
  // ICU select keys use underscores, while catalog IDs use hyphens.
  if (id.contains('_')) return null;
  final label = _planEquipmentStrings(
    locale,
  ).planEquipmentNameForId(id.replaceAll('-', '_'));
  return label.isEmpty ? null : label;
}

AppLocalizations _planEquipmentStrings(Locale locale) =>
    lookupAppLocalizations(localeForLanguage(languageForLocale(locale)));
