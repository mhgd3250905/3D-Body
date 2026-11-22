import 'dart:convert';

import 'package:flutter/foundation.dart' show FlutterError, debugPrint, kIsWeb;
import 'package:flutter/services.dart';
import 'package:ugk_coach/ugk_coach.dart' show sha256Hex;
import 'package:ugk_trainer_runtime/ugk_trainer.dart';

import '../domain/flare_plan.dart';
import 'plan_voice_duration_stub.dart'
    if (dart.library.io) 'plan_voice_duration_io.dart';

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

/// A revisioned path keeps plan recordings distinct in the native audio cache.
const flarePlanVoiceAssetRoot =
    'assets/trainer_voice/flare-plan-voice-r1-6c5d81a9';

const flareCooldownPnfCue = '用三到四成力，发力五秒。';
const _cooldownPnfKey = 'supplemental.cooldown.pnf';
const _announcementManifest =
    'assets/trainer_voice/flare-plan-announcements.json';

const _guideManifest = 'assets/trainer_voice/flare-supplemental-voice.json';
const _networkOnlyPlanVoice = bool.fromEnvironment(
  'FLARE_PLAN_VOICE_NETWORK_ONLY',
);
const _tracePlanVoiceSources = bool.fromEnvironment('FLARE_PLAN_VOICE_TRACE');

typedef _PlanVoiceClip = ({
  String asset,
  String sha256,
  String? text,
  double seconds,
});

Future<Map<String, _PlanVoiceClip>> _bundledPlanVoice(String manifest) async {
  try {
    return await rootBundle.loadStructuredData(manifest, (text) async {
      final clips = (jsonDecode(text) as Map<String, Object?>)['clips'] as Map;
      return {
        for (final entry in clips.entries)
          entry.key as String: (
            asset: '$flarePlanVoiceAssetRoot/${entry.key}.m4a',
            sha256: (entry.value as Map)['sha256'] as String,
            text: entry.value['text'] as String?,
            seconds: (entry.value['ms'] as num) / 1000,
          ),
      };
    });
  } on FlutterError {
    return const {};
  }
}

Future<PoseHubPlanVoiceCache>? _nativePlanVoiceCache;

String _planVoiceKey(String path) =>
    path.split('/').last.replaceFirst(RegExp(r'\.m4a$'), '');

String _guideKey(FlarePlan plan, int index, FlarePlanItem item) =>
    item.voiceKey ?? 'supplemental.${plan.id}.${index + 1}';

Iterable<String> _planVoicePaths(
  FlarePlan plan,
  PoseHubPlanVoiceManifest manifest,
) {
  final guides = {
    for (final (index, item) in plan.allItems.indexed)
      _guideKey(plan, index, item),
  };
  return manifest.files.keys.where((path) {
    final key = _planVoiceKey(path);
    return guides.contains(key) ||
        guides.any((guide) => key.startsWith('$guide.')) ||
        key.startsWith('supplemental.side.') ||
        (plan.kind == FlarePlanKind.cooldown &&
            (key == _cooldownPnfKey ||
                key.startsWith('supplemental.cooldown.kickoff.') ||
                key.startsWith('supplemental.cooldown.round.')));
  });
}

Future<Map<String, _PlanVoiceClip>> _snapshotPlanVoice(
  FlarePlan plan,
  PoseHubPlanSnapshot snapshot,
  Map<String, _PlanVoiceClip> bundled,
  PoseHubPlanVoiceCache? voiceCache,
) async {
  final receipts = snapshot.voiceManifest;
  final paths = receipts.plans[plan.id] ?? _planVoicePaths(plan, receipts);
  final bundledBySha = {for (final clip in bundled.values) clip.sha256: clip};
  Future<List<int>?> readBundled(String digest) async {
    final clip = bundledBySha[digest];
    if (clip == null) return null;
    final data = await rootBundle.load(clip.asset);
    return data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);
  }

  var local = const <String, Uri?>{};
  if (!kIsWeb || voiceCache != null) {
    try {
      final cache =
          voiceCache ??
          await (_nativePlanVoiceCache ??=
              PoseHubPlanVoiceCache.inApplicationSupport(
                loadBundled: _networkOnlyPlanVoice ? null : readBundled,
              ));
      local = receipts.plans.containsKey(plan.id)
          ? await cache.prefetchPlan(receipts, plan.id)
          : await cache.prefetchFiles(receipts, paths);
    } on Exception {
      // A missing native cache can still use the exact bundled recordings.
      _nativePlanVoiceCache = null;
    }
  }

  final result = <String, _PlanVoiceClip>{};
  for (final path in paths) {
    final file = receipts.files[path]!;
    final offline = bundledBySha[file.sha256];
    final uri = local[path];
    var asset = uri?.toString();
    if (asset == null && !_networkOnlyPlanVoice && offline != null) {
      try {
        final bytes = await readBundled(file.sha256);
        if (bytes != null &&
            bytes.length == file.bytes &&
            sha256Hex(bytes) == file.sha256) {
          asset = offline.asset;
        }
      } on FlutterError {
        // The bundled fallback can be absent in development builds.
      }
    }
    final seconds =
        offline?.seconds ??
        (uri == null ? null : await readPlanVoiceDuration(uri));
    if (asset == null || seconds == null) continue;
    final key = _planVoiceKey(path);
    result[key] = (
      asset: asset,
      sha256: file.sha256,
      text: offline?.text,
      seconds: seconds,
    );
    if (_tracePlanVoiceSources) {
      debugPrint(
        'FlarePlanVoice prepared plan=${plan.id} snapshot=${snapshot.id} '
        'clip=$key sha=${file.sha256} source=${uri == null ? 'bundle' : 'cache'}',
      );
    }
  }
  return result;
}

/// Use the authored Mandarin cue in these plans while keeping the usual
/// common prompts, action names, playback controls and audio output.
Future<VoiceSource> withSupplementalTrainerVoice(
  VoiceSource source,
  FlarePlan? plan, {
  required String language,
  PoseHubPlanSnapshot? planSnapshot,
  PoseHubPlanVoiceCache? voiceCache,
}) async {
  if (plan == null || language != 'zh') return source;
  final [bundleGuides, bundleAnnouncements] = await Future.wait([
    _bundledPlanVoice(_guideManifest),
    _bundledPlanVoice(_announcementManifest),
  ]);
  final bundled = {...bundleGuides, ...bundleAnnouncements};
  final clips = planSnapshot != null
      ? await _snapshotPlanVoice(plan, planSnapshot, bundled, voiceCache)
      : _networkOnlyPlanVoice
      ? const <String, _PlanVoiceClip>{}
      : bundled;
  final cues = <String, _SupplementalCue>{};
  final shortCues = <String, _SupplementalCue>{};
  final guideKeys = {_cooldownPnfKey};
  for (final (index, item) in plan.allItems.indexed) {
    final key = _guideKey(plan, index, item);
    final shortKey = '$key.short';
    guideKeys.addAll([key, shortKey]);
    if ((item.voiceCue, clips[key]) case (final text?, final clip?)) {
      cues[item.trainingDrillForScene('A')] = (
        key: key,
        text: text,
        seconds: clip.seconds,
        authoredName: item.displayName,
      );
      if (clips[shortKey] case final shortClip?) {
        shortCues[shortKey] = (
          key: shortKey,
          // Read a shorter line aloud while the full instruction stays visible.
          text: text,
          seconds: shortClip.seconds,
          authoredName: item.displayName,
        );
      }
    }
    if ((item.pnfTrainingIdForScene('A'), clips[_cooldownPnfKey]) case (
      final exerciseId?,
      final pnfClip?,
    )) {
      cues[exerciseId] = (
        key: _cooldownPnfKey,
        text: flareCooldownPnfCue,
        seconds: pnfClip.seconds,
        authoredName: item.displayName,
      );
    }
  }
  return _SupplementalVoiceSource(source, cues, shortCues, {
    for (final MapEntry(key: key, value: clip) in clips.entries)
      if (planSnapshot == null
          ? bundleAnnouncements.containsKey(key)
          : !guideKeys.contains(key))
        key: (
          key: key,
          text: clip.text ?? '',
          seconds: clip.seconds,
          authoredName: null,
        ),
  }, clips);
}

SessionScript buildCooldownTrainerScript(VoiceSource source, String language) =>
    _CooldownSessionScript(source: source, lang: language);

bool hasFlarePlanAnnouncements(VoiceSource source) =>
    source is _SupplementalVoiceSource && source.announcements.isNotEmpty;

SessionScript buildSupplementalTrainerScript(
  VoiceSource source,
  String language, {
  required FlarePlan plan,
  required List<SessionPhase> phases,
}) {
  if (language == 'zh' &&
      source is _SupplementalVoiceSource &&
      source.announcements.isNotEmpty) {
    return _SupplementalPlanScript(source, plan, phases);
  }
  return plan.kind == FlarePlanKind.cooldown
      ? buildCooldownTrainerScript(source, language)
      : SessionScript(source: source, lang: language);
}

typedef _WorkPhaseKey = (int, PhaseKind, int, String?, Side?);

_WorkPhaseKey _workPhaseKey(SessionPhase phase) =>
    (phase.itemIndex, phase.kind, phase.set, phase.segmentId, phase.side);

typedef _WorkVoiceTiming = ({double offset, double available, double intro});

class _SupplementalPlanScript extends SessionScript {
  _SupplementalPlanScript(this.voice, this.plan, List<SessionPhase> phases)
    : super(source: voice, lang: 'zh') {
    var elapsed = 0.0;
    final starts = <int, double>{};
    final ends = <int, double>{};
    final phasesAt = <_WorkPhaseKey, double>{};
    final intros = <int, double>{};
    for (final phase in phases) {
      if (phase.isWork) {
        starts.putIfAbsent(phase.itemIndex, () => elapsed);
        ends[phase.itemIndex] = elapsed + phase.seconds;
        phasesAt[_workPhaseKey(phase)] = elapsed;
        intros.putIfAbsent(phase.itemIndex, () {
          final segment = _segmentCue(phase, _guide(phase)?.key);
          final firstAccent = segment ?? _sides(phase).firstOrNull;
          return firstAccent == null
              ? .12
              : firstAccent.at + len(firstAccent.clips) + .08;
        });
      } else if (phase.kind == PhaseKind.switchSide) {
        phasesAt[_workPhaseKey(phase)] = elapsed;
      }
      elapsed += phase.seconds;
    }
    for (final MapEntry(key: phase, value: at) in phasesAt.entries) {
      final start = starts[phase.$1]!;
      _workTiming[phase] = (
        offset: at - start,
        available: ends[phase.$1]! - start,
        intro: intros[phase.$1]!,
      );
    }
  }

  final _SupplementalVoiceSource voice;
  final FlarePlan plan;
  final _workTiming = <_WorkPhaseKey, _WorkVoiceTiming>{};

  @override
  List<String> cueKeys(String exerciseId) => const [];

  _SupplementalCue? _guide(SessionPhase phase) =>
      voice.cues[phase.item?.exerciseId ?? phase.exerciseId];

  String? _present(String? key) =>
      key != null && source.has(key, lang: lang) ? key : null;

  String? _intro(SessionPhase phase) {
    final guide = _guide(phase)?.key;
    if (guide == null) return null;
    return _present(
      guide.startsWith('supplemental.cooldown.stretch.')
          ? '$guide.intro.${plan.tier}'
          : '$guide.intro',
    );
  }

  @override
  List<VoiceCue> cues(
    SessionPhase p, {
    required double planSeconds,
    bool bySkip = false,
  }) {
    if (p.isWork &&
        p.segmentId == 'pnf-press' &&
        _present(_cooldownPnfKey) != null) {
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
      return _transition(p, planSeconds, bySkip);
    }
    final base = super.cues(p, planSeconds: planSeconds, bySkip: bySkip);
    return p.isWork || p.kind == PhaseKind.switchSide ? _work(p, base) : base;
  }

  List<VoiceCue> _transition(SessionPhase p, double planSeconds, bool bySkip) {
    final intro = _intro(p);
    if (intro == null) {
      return plan.kind == FlarePlanKind.cooldown
          ? _CooldownSessionScript(
              source: voice,
              lang: lang,
            ).cues(p, planSeconds: planSeconds, bySkip: bySkip)
          : SessionScript(
              source: voice,
              lang: lang,
            ).cues(p, planSeconds: planSeconds, bySkip: bySkip);
    }
    final prep = p.kind == PhaseKind.prep;
    final roundBreak = p.kind == PhaseKind.roundRest;
    final roundLine = _present(
      prep && p.rounds > 1
          ? 'supplemental.cooldown.kickoff.${p.rounds}'
          : roundBreak
          ? 'supplemental.cooldown.round.${p.round}'
          : null,
    );
    final start = p.seconds > 5 ? p.seconds - 5 + .12 : .12;
    final at = roundLine != null && roundBreak
        ? start - len([roundLine]) - .16
        : .12;
    return [
      if (!prep) const VoiceCue(0, ['chime.end'], CuePriority.call),
      if (roundLine != null && at >= 0 && at + len([roundLine]) < start)
        VoiceCue(
          at,
          [roundLine],
          CuePriority.call,
          subtitle: source.line(roundLine, lang: lang),
        ),
      if (start + len([intro]) <= p.seconds)
        VoiceCue(
          start,
          [intro],
          CuePriority.call,
          subtitle: source.line(intro, lang: lang),
        ),
      for (final remaining in [3, 2, 1])
        if (p.seconds > remaining)
          VoiceCue(p.seconds - remaining, const [
            'chime.tick',
          ], CuePriority.count),
    ];
  }

  VoiceCue? _segmentCue(SessionPhase p, String? guide) {
    if (guide == null || p.segmentId == null) return null;
    // Brief labels share the side-call sound lane so a previous segment's
    // technique recording can finish without masking a new segment label.
    final key = _present('chime.$guide.segment.${p.segmentId}');
    if (key == null) return null;
    final side = _phaseSide(p) ?? p.rhythm?.pairFirstSide;
    final sideKey = _present(
      side == null ? null : 'chime.supplemental.side.$side',
    );
    final at = sideKey == null
        ? .02
        : len([sideKey]) +
              .06 +
              (p.rhythm?.alternatePair == true ? p.rhythm!.lead : 0);
    return at + len([key]) <= p.seconds
        ? VoiceCue(at, [key], CuePriority.call)
        : null;
  }

  String? _phaseSide(SessionPhase p) =>
      p.side?.name ??
      switch (p.segmentId) {
        'straddle-left' => 'left',
        'straddle-right' => 'right',
        _ => null,
      };

  List<VoiceCue> _sides(SessionPhase p) {
    VoiceCue? sideAt(String side, double time) {
      final key = _present('chime.supplemental.side.$side');
      return key == null || time + len([key]) > p.seconds
          ? null
          : VoiceCue(time, [key], CuePriority.call);
    }

    final rhythm = p.rhythm;
    if (_phaseSide(p) case final side?) return [?sideAt(side, 0)];
    if (rhythm == null || !rhythm.alternatePair) return const [];
    final reps = rhythm.repPlan(
      reps: p.reps,
      hold: p.holdSeconds,
      seconds: p.seconds,
    );
    final sides = <VoiceCue>[];
    for (var count = 1; count <= reps.reps; count++) {
      var at = reps.repStart(0, count);
      String? previous;
      for (final phase in reps.phases) {
        final side = phase.side;
        if (side != null && side != previous) {
          if (sideAt(side, at) case final cue?) sides.add(cue);
        }
        previous = side;
        at += phase.seconds;
      }
    }
    return sides;
  }

  List<VoiceCue> _work(SessionPhase p, List<VoiceCue> base) {
    final guide = _guide(p);
    final accents = [
      if (p.isWork) ..._sides(p),
      if (p.isWork) ?_segmentCue(p, guide?.key),
    ]..sort((a, b) => a.at.compareTo(b.at));
    final timing = _workTiming[_workPhaseKey(p)];
    final start = timing?.intro ?? .12;
    final offset = timing?.offset ?? 0;
    final duration = guide == null ? 0.0 : len([guide.key]);
    final fits =
        duration > 0 && start + duration <= (timing?.available ?? p.seconds);
    final technique = p.isWork && fits && offset == 0 && guide != null
        ? VoiceCue(start, [guide.key], CuePriority.coach, subtitle: guide.text)
        : null;
    final breathKey = _present(
      guide?.key == 'supplemental.cooldown.stretch.13'
          ? '${guide!.key}.breath'
          : null,
    );
    final breathAt = fits && start + duration > offset
        ? start + duration - offset + .2
        : .7;
    final breath =
        p.isWork &&
            breathKey != null &&
            p.set == 1 &&
            breathAt + len([breathKey]) <= p.seconds
        ? VoiceCue(
            breathAt,
            [breathKey],
            CuePriority.coach,
            subtitle: source.line(breathKey, lang: lang),
          )
        : null;
    final regular = <VoiceCue>[];
    for (final cue in base) {
      final spoken = cue.voiceClips
          .where(
            (key) => _phaseSide(p) == null || key != call(VoiceCall.goRight),
          )
          .toList();
      final spokenLength = len(spoken);
      var at = cue.at;
      bool crossesAccent(VoiceCue accent) =>
          at < accent.at + len(accent.clips) && at + spokenLength > accent.at;
      if (!cue.atWorkEnd && cue.priority == CuePriority.count) {
        for (final accent in accents) {
          if (crossesAccent(accent)) at = accent.at + len(accent.clips) + .03;
        }
      }
      final time = offset + at;
      // Let the work clock and its visual counts continue; the technique
      // gets the speech lane while its recording is in flight.
      final overlapsTechnique =
          fits &&
          time < start + duration + .08 &&
          time + spokenLength > start - .08;
      final overlapsBreath =
          breath != null &&
          at < breath.at + len(breath.clips) &&
          at + spokenLength > breath.at;
      final overlapsAccent = accents.any(
        (a) => at >= a.at - .06 && at < a.at + len(a.clips),
      );
      final clips = [
        if (!overlapsAccent) ...cue.chimes,
        if (!overlapsTechnique &&
            !overlapsBreath &&
            !accents.any(crossesAccent) &&
            (at == cue.at || at + spokenLength < p.seconds))
          ...spoken,
      ];
      if (clips.isNotEmpty) {
        regular.add(
          VoiceCue(
            at,
            clips,
            cue.priority,
            subtitle: cue.subtitle,
            queueWithoutCutting: cue.queueWithoutCutting,
            atWorkEnd: cue.atWorkEnd,
          ),
        );
      }
    }
    return [...regular, ...accents, ?technique, ?breath]
      ..sort((a, b) => a.at.compareTo(b.at));
  }
}

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
      var guide = p.kind == PhaseKind.prep ? call(VoiceCall.first) : null;
      if (key != null && key.startsWith('supplemental.cooldown.')) {
        final shortKey = '$key.short';
        guide = p.seconds == 5 && source.has(shortKey, lang: lang)
            ? shortKey
            : key;
      }
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
  _SupplementalVoiceSource(
    super.source,
    this.cues,
    Map<String, _SupplementalCue> shortCues,
    this.announcements,
    this.clips,
  ) : byKey = {
        for (final cue in cues.values) cue.key: cue,
        ...shortCues,
        ...announcements,
      },
      super(language: 'zh', leftFirst: false);

  final Map<String, _SupplementalCue> cues;
  final Map<String, _SupplementalCue> byKey;
  final Map<String, _SupplementalCue> announcements;
  final Map<String, _PlanVoiceClip> clips;

  String _assetKey(String key) => key.startsWith('chime.supplemental.')
      ? key.substring('chime.'.length)
      : key;

  @override
  bool has(String key, {required String lang}) =>
      lang == 'zh' && byKey.containsKey(_assetKey(key)) ||
      super.has(key, lang: lang);

  @override
  bool expected(String key, {required String lang}) =>
      lang == 'zh' && byKey.containsKey(_assetKey(key)) ||
      source.expected(key, lang: lang);

  @override
  String asset(String key, {required String lang}) =>
      (lang == 'zh' && byKey.containsKey(_assetKey(key))
          ? clips[_assetKey(key)]?.asset
          : null) ??
      super.asset(key, lang: lang);

  @override
  String? line(String key, {required String lang}) =>
      (lang == 'zh' ? byKey[_assetKey(key)]?.text : null) ??
      super.line(key, lang: lang);

  @override
  double seconds(String key, {required String lang}) =>
      (lang == 'zh' ? byKey[_assetKey(key)]?.seconds : null) ??
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
      final missing = announcements.isEmpty
          ? exerciseIds
          : exerciseIds.where((id) => !cues.containsKey(id));
      if (missing.isNotEmpty) {
        await (parent as PreparableVoiceSource).prepare(missing, lang: lang);
      }
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
