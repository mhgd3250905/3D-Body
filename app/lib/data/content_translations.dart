import 'dart:convert';

import 'package:flutter/services.dart';

import '../l10n/languages.dart';

/// Bundled content translations, loaded once for instant offline switching.
class ContentTranslations {
  ContentTranslations._(this._languages, this._shortLabels);

  final Map<String, Map<String, String>> _languages;
  final Map<String, Map<String, String>> _shortLabels;

  Map<String, String> forLanguage(String language) =>
      _languages[language] ?? _languages['en']!;

  Map<String, String> shortLabelsFor(String language) =>
      _shortLabels[language] ?? _shortLabels['en']!;

  static Future<ContentTranslations> load({AssetBundle? bundle}) async {
    final source = bundle ?? rootBundle;
    final maps = await Future.wait(
      languageNames.keys.map((code) async {
        final json =
            jsonDecode(
                  await source.loadString('assets/l10n/content_$code.json'),
                )
                as Map<String, dynamic>;
        final short =
            jsonDecode(
                  await source.loadString(
                    'assets/l10n/muscle_short_$code.json',
                  ),
                )
                as Map<String, dynamic>;
        return (
          MapEntry(code, Map<String, String>.from(json)),
          MapEntry(code, Map<String, String>.from(short)),
        );
      }),
    );
    return ContentTranslations._(
      Map.fromEntries(maps.map((v) => v.$1)),
      Map.fromEntries(maps.map((v) => v.$2)),
    );
  }
}
