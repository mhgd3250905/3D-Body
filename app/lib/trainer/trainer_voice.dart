import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:ugk_trainer/ugk_trainer.dart';

/// Offline shared prompts from the pinned SmartFit LC32 bundle, with HipLab's
/// side prompt retained for legacy single-drill fixtures. The whole-plan
/// player passes leftFirst: false and follows the SDK side sequence.
/// English prompts are generated offline with the installed Windows Zira voice.
/// These recordings are internal-test assets; see source-manifest.json.
/// The SDK retains chimes for other languages.
/// The caller can map the app's zh_Hant UI preference to spoken zh.
Future<VoiceSource> loadTrainerVoiceSource({
  String language = 'zh',
  bool leftFirst = true,
  Future<String> Function(String path)? read,
}) async {
  const root = 'assets/trainer_voice';
  final text = await (read ?? rootBundle.loadString)('$root/_common/pack.json');
  return _LeftFirstVoiceSource(
    DrillPackVoiceSource.fromPacks(
      common: jsonDecode(text) as Map<String, dynamic>,
      root: root,
    ),
    language: language,
    leftFirst: leftFirst,
  );
}

/// English phrase grammar and optional legacy side-call compatibility.
/// New whole-plan routes preserve the SDK's goRight announcement.
class _LeftFirstVoiceSource extends VoiceSource {
  _LeftFirstVoiceSource(
    this.source, {
    required this.language,
    required this.leftFirst,
  });
  final VoiceSource source;
  final String language;
  final bool leftFirst;

  List<String> _englishOrdinal(String prefix, int n) {
    final digits = source.number(n);
    return digits.isEmpty ? const [] : [prefix, ...digits];
  }

  @override
  Set<String> get languages => source.languages;
  @override
  bool has(String key, {required String lang}) => source.has(key, lang: lang);
  @override
  String asset(String key, {required String lang}) =>
      source.asset(key, lang: lang);
  @override
  String? line(String key, {required String lang}) =>
      source.line(key, lang: lang);
  @override
  double seconds(String key, {required String lang}) =>
      source.seconds(key, lang: lang);
  @override
  String? call(VoiceCall c) =>
      source.call(leftFirst && c == VoiceCall.goRight ? VoiceCall.go : c);
  @override
  String? drill(String exerciseId, DrillLine line) =>
      source.drill(exerciseId, line);
  @override
  KitVoice? kitVoice(String exerciseId) => source.kitVoice(exerciseId);
  @override
  List<String> number(int n) => source.number(n);
  @override
  List<String> secondsPhrase(int n) => language == 'en' && n == 1
      ? ['n.1', 'u.sec_one']
      : source.secondsPhrase(n);
  @override
  List<String> minutesPhrase(int n) => language == 'en' && n == 1
      ? ['n.1', 'u.min_one']
      : source.minutesPhrase(n);
  @override
  List<String> setsPhrase(int n) =>
      language == 'en' && n == 1 ? ['n.1', 'u.sets_one'] : source.setsPhrase(n);
  @override
  List<String> repsPhrase(int n) =>
      language == 'en' && n == 1 ? ['n.1', 'u.reps_one'] : source.repsPhrase(n);
  @override
  List<String> ordinalSet(int n) => language == 'en'
      ? _englishOrdinal('p.set_number', n)
      : source.ordinalSet(n);
  @override
  List<String> ordinalRound(int n) => language == 'en'
      ? _englishOrdinal('p.round_number', n)
      : source.ordinalRound(n);
}
