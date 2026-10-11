import 'package:flutter/widgets.dart';

/// Stable preference codes; names stay native so the picker remains usable.
const languageNames = <String, String>{
  'zh': '简体中文',
  'zh_Hant': '繁體中文',
  'en': 'English',
  'es': 'Español',
  'pt': 'Português',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'ru': 'Русский',
  'ja': '日本語',
  'ko': '한국어',
  'ar': 'العربية',
  'hi': 'हिन्दी',
  'id': 'Bahasa Indonesia',
};

Locale localeForLanguage(String code) => code == 'zh_Hant'
    ? const Locale.fromSubtags(languageCode: 'zh', scriptCode: 'Hant')
    : Locale(code);

String languageForLocale(Locale locale) {
  if (locale.languageCode == 'zh') {
    return locale.scriptCode == 'Hant' ||
            ['TW', 'HK', 'MO'].contains(locale.countryCode)
        ? 'zh_Hant'
        : 'zh';
  }
  return languageNames.containsKey(locale.languageCode)
      ? locale.languageCode
      : 'en';
}

/// Unsupported system languages use English, independent of ARB file order.
Locale resolveAppLocale(List<Locale>? preferred, Iterable<Locale> supported) {
  for (final locale in preferred ?? const <Locale>[]) {
    if (locale.languageCode == 'zh' ||
        languageNames.containsKey(locale.languageCode)) {
      return localeForLanguage(languageForLocale(locale));
    }
  }
  return const Locale('en');
}
