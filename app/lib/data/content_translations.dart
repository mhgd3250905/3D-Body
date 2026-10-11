import 'dart:convert';

import 'package:flutter/services.dart';

import '../l10n/languages.dart';

/// Bundled content translations, loaded once for instant offline switching.
class ContentTranslations {
  ContentTranslations._(this._languages);

  final Map<String, Map<String, String>> _languages;

  Map<String, String> forLanguage(String language) =>
      _languages[language] ?? _languages['en']!;

  static Future<ContentTranslations> load({AssetBundle? bundle}) async {
    final source = bundle ?? rootBundle;
    final maps = await Future.wait(
      languageNames.keys.map((code) async {
        final json =
            jsonDecode(
                  await source.loadString('assets/l10n/content_$code.json'),
                )
                as Map<String, dynamic>;
        return MapEntry(code, Map<String, String>.from(json));
      }),
    );
    return ContentTranslations._(Map.fromEntries(maps));
  }
}
