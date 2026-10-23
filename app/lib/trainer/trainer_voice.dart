import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:ugk_trainer/ugk_trainer.dart';

/// Offline shared prompts from the pinned SmartFit LC32 bundle, with HipLab's
/// right-side prompt to preserve FlareLab's left-first sequence.
/// Only zh speech is supplied; the SDK retains chimes for other languages.
/// The caller can map the app's zh_Hant UI preference to spoken zh.
Future<VoiceSource> loadTrainerVoiceSource({
  Future<String> Function(String path)? read,
}) async {
  const root = 'assets/trainer_voice';
  final text = await (read ?? rootBundle.loadString)('$root/_common/pack.json');
  return _LeftFirstVoiceSource(
    DrillPackVoiceSource.fromPacks(
      common: jsonDecode(text) as Map<String, dynamic>,
      root: root,
    ),
  );
}

/// SDK's right-first announcement is unsuitable for FlareLab's established
/// left-first sequence. Adapt the semantic call while preserving all source
/// recordings and metadata. The explicit side-switch call remains unchanged.
class _LeftFirstVoiceSource extends VoiceSource {
  _LeftFirstVoiceSource(this.source);
  final VoiceSource source;

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
      source.call(c == VoiceCall.goRight ? VoiceCall.go : c);
  @override
  String? drill(String exerciseId, DrillLine line) =>
      source.drill(exerciseId, line);
  @override
  KitVoice? kitVoice(String exerciseId) => source.kitVoice(exerciseId);
  @override
  List<String> number(int n) => source.number(n);
  @override
  List<String> secondsPhrase(int n) => source.secondsPhrase(n);
  @override
  List<String> minutesPhrase(int n) => source.minutesPhrase(n);
  @override
  List<String> setsPhrase(int n) => source.setsPhrase(n);
  @override
  List<String> repsPhrase(int n) => source.repsPhrase(n);
  @override
  List<String> ordinalSet(int n) => source.ordinalSet(n);
  @override
  List<String> ordinalRound(int n) => source.ordinalRound(n);
}
