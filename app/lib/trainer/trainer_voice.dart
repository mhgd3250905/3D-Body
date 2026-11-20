import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:ugk_trainer_runtime/ugk_trainer.dart';

import '../domain/flare_plan.dart';

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
  const pack = '$root/_common/pack.json';
  DrillPackVoiceSource decode(String text) => DrillPackVoiceSource.fromPacks(
    common: jsonDecode(text) as Map<String, dynamic>,
    root: root,
  );
  final source = read == null
      ? await rootBundle.loadStructuredData(pack, (text) async => decode(text))
      : decode(await read(pack));
  return _LeftFirstVoiceSource(
    source,
    language: language,
    leftFirst: leftFirst,
  );
}

const flareCooldownPnfCue = '用三到四成力，发力五秒。';
const _cooldownPnfKey = 'supplemental.cooldown.pnf';

/// Use the authored Mandarin cue in these plans while keeping the usual
/// common prompts, action names, playback controls and audio output.
Future<VoiceSource> withSupplementalTrainerVoice(
  VoiceSource source,
  FlarePlan? plan, {
  required String language,
}) async {
  if (plan == null || language != 'zh') return source;
  final durations = await rootBundle.loadStructuredData(
    'assets/trainer_voice/flare-supplemental-voice.json',
    (text) async {
      final clips = (jsonDecode(text) as Map<String, dynamic>)['clips'] as Map;
      return <String, int>{
        for (final clip in clips.entries)
          clip.key as String: (clip.value as Map)['ms'] as int,
      };
    },
  );
  final cues = <String, _SupplementalCue>{};
  for (final (index, item) in plan.allItems.indexed) {
    final key = item.voiceKey ?? 'supplemental.${plan.id}.${index + 1}';
    if ((item.voiceCue, durations[key]) case (final text?, final ms?)) {
      cues[item.trainingDrillForScene('A')] = (
        key: key,
        text: text,
        seconds: ms / 1000,
        authoredName: item.displayName,
      );
    }
    if ((item.pnfTrainingIdForScene('A'), durations[_cooldownPnfKey]) case (
      final exerciseId?,
      final ms?,
    )) {
      cues[exerciseId] = (
        key: _cooldownPnfKey,
        text: flareCooldownPnfCue,
        seconds: ms / 1000,
        authoredName: item.displayName,
      );
    }
  }
  return _SupplementalVoiceSource(source, cues);
}

SessionScript buildCooldownTrainerScript(VoiceSource source, String language) =>
    _CooldownSessionScript(source: source, lang: language);

class _CooldownSessionScript extends SessionScript {
  _CooldownSessionScript({required super.source, required super.lang});

  // The spoken technique line belongs to the changeover. The work phase
  // keeps its ordinary rep counts and timer cues.
  @override
  List<String> cueKeys(String exerciseId) => const [];

  @override
  List<VoiceCue> cues(
    SessionPhase p, {
    required double planSeconds,
    bool bySkip = false,
  }) {
    if (p.isWork &&
        p.segmentId == 'pnf-press' &&
        source.has(_cooldownPnfKey, lang: lang)) {
      // A spoken countdown would interrupt the instruction in this 5s hold.
      return const [
        VoiceCue(
          0,
          ['chime.start', _cooldownPnfKey],
          CuePriority.call,
          subtitle: flareCooldownPnfCue,
        ),
      ];
    }
    if (p.kind == PhaseKind.prep || p.nextExerciseId != null) {
      final id = p.exerciseId;
      final key = id == null ? null : source.drill(id, DrillLine.cue1);
      final guide = key != null && key.startsWith('supplemental.cooldown.')
          ? key
          : p.kind == PhaseKind.prep
          ? call(VoiceCall.first)
          : null;
      final round = p.kind == PhaseKind.roundRest;
      final start = (round ? p.seconds - 10 : 0.0) + .25;
      return [
        if (round)
          ...super
              .cues(p, planSeconds: planSeconds, bySkip: bySkip)
              .where((cue) => cue.at + len(cue.clips) <= start)
        else if (p.kind == PhaseKind.rest)
          const VoiceCue(0, ['chime.end'], CuePriority.call),
        if (guide != null &&
            source.has(guide, lang: lang) &&
            start + len([guide]) < p.seconds)
          VoiceCue(
            start,
            [guide],
            CuePriority.coach,
            subtitle: source.line(guide, lang: lang),
          ),
        // Countdown chimes use their own channel and leave the guide intact.
        for (final remaining in [3, 2, 1])
          if (p.seconds > remaining)
            VoiceCue(p.seconds - remaining, const [
              'chime.tick',
            ], CuePriority.count),
      ];
    }
    return super.cues(p, planSeconds: planSeconds, bySkip: bySkip);
  }
}

typedef _SupplementalCue = ({
  String key,
  String text,
  double seconds,
  String? authoredName,
});

class _SupplementalVoiceSource extends _LeftFirstVoiceSource
    implements PreparableVoiceSource {
  _SupplementalVoiceSource(super.source, this.cues)
    : byKey = {for (final cue in cues.values) cue.key: cue},
      super(language: 'zh', leftFirst: false);

  final Map<String, _SupplementalCue> cues;
  final Map<String, _SupplementalCue> byKey;

  @override
  bool has(String key, {required String lang}) =>
      lang == 'zh' && byKey.containsKey(key) || super.has(key, lang: lang);

  @override
  bool expected(String key, {required String lang}) =>
      lang == 'zh' && byKey.containsKey(key) ||
      source.expected(key, lang: lang);

  @override
  String asset(String key, {required String lang}) =>
      lang == 'zh' && byKey.containsKey(key)
      ? 'assets/trainer_voice/_common/voice/zh/$key.m4a'
      : super.asset(key, lang: lang);

  @override
  String? line(String key, {required String lang}) =>
      (lang == 'zh' ? byKey[key]?.text : null) ?? super.line(key, lang: lang);

  @override
  double seconds(String key, {required String lang}) =>
      (lang == 'zh' ? byKey[key]?.seconds : null) ??
      super.seconds(key, lang: lang);

  @override
  String? drill(String exerciseId, DrillLine line) {
    final cue = cues[exerciseId];
    if (cue == null) return super.drill(exerciseId, line);
    return switch (line) {
      DrillLine.cue1 => cue.key,
      DrillLine.name when cue.authoredName == null => super.drill(
        exerciseId,
        line,
      ),
      _ => null,
    };
  }

  @override
  String? drillText(String exerciseId, DrillLine line, {required String lang}) {
    final cue = cues[exerciseId];
    if (cue == null) return source.drillText(exerciseId, line, lang: lang);
    return switch (line) {
      DrillLine.cue1 => cue.text,
      DrillLine.name =>
        cue.authoredName ?? source.drillText(exerciseId, line, lang: lang),
      _ => null,
    };
  }

  @override
  KitVoice? kitVoice(String exerciseId) =>
      cues.containsKey(exerciseId) ? null : super.kitVoice(exerciseId);

  @override
  Future<void> prepare(
    Iterable<String> exerciseIds, {
    required String lang,
  }) async {
    final parent = source;
    if (parent is PreparableVoiceSource) {
      await (parent as PreparableVoiceSource).prepare(exerciseIds, lang: lang);
    }
  }
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
  // Flare's English pack records "Set number" / "Round number" rather than
  // the SDK's `p.set` / `p.round`, so English keeps the app's own phrase;
  // other languages pass the spoken [lang] through to the SDK grammar.
  @override
  List<String> ordinalSet(int n, {String lang = 'zh'}) =>
      language == 'en' || lang == 'en'
      ? _englishOrdinal('p.set_number', n)
      : source.ordinalSet(n, lang: lang);
  @override
  List<String> ordinalRound(int n, {String lang = 'zh'}) =>
      language == 'en' || lang == 'en'
      ? _englishOrdinal('p.round_number', n)
      : source.ordinalRound(n, lang: lang);
}
