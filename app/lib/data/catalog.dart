import 'dart:convert';

import 'package:flutter/services.dart';

import '../domain/catalog_models.dart';

export '../domain/catalog_models.dart';
export '../domain/dose.dart';

class PhaseKey {
  const PhaseKey({
    required this.time,
    required this.source,
    required this.support,
  });
  final double time;
  final int source;
  final String support;
}

/// The offline catalog is the single source for content used by Flutter views.
/// Geometry and animation continue to be supplied by the existing 3D engine.
class Catalog {
  Catalog._({
    required List<MuscleSection> sections,
    required List<MuscleGroup> groups,
    required List<Phase> phases,
    required List<Drill> drills,
    required List<CourseStage> stages,
    required List<PhaseKey> phaseKeys,
    required Map<String, String> tiers,
    required this.note,
    required this.drillNote,
    required this.curriculumNote,
    required this.period,
  }) : sections = List.unmodifiable(sections),
       groups = List.unmodifiable(groups),
       phases = List.unmodifiable(phases),
       drills = List.unmodifiable(drills),
       stages = List.unmodifiable(stages),
       phaseKeys = List.unmodifiable(phaseKeys),
       tiers = Map.unmodifiable(tiers),
       _groups = {for (final value in groups) value.groupId: value},
       _phases = {for (final value in phases) value.source: value},
       _drills = {for (final value in drills) value.id: value},
       _stages = {for (final value in stages) value.n: value},
       _lessons = {
         for (final stage in stages)
           for (final value in stage.lessons) value.id: value,
       },
       _gates = {
         for (final stage in stages)
           for (final value in stage.gates) value.id: value,
       };

  final List<MuscleSection> sections;
  final List<MuscleGroup> groups;
  final List<Phase> phases;
  final List<Drill> drills;
  final List<CourseStage> stages;
  final List<PhaseKey> phaseKeys;
  final Map<String, String> tiers;
  final String note;
  final String drillNote;
  final String curriculumNote;
  final double period;
  bool get unreviewed => true;
  final Map<String, MuscleGroup> _groups;
  final Map<int, Phase> _phases;
  final Map<String, Drill> _drills;
  final Map<int, CourseStage> _stages;
  final Map<String, Lesson> _lessons;
  final Map<String, CourseGate> _gates;
  Map<String, String> _translations = const {};
  Catalog? _original;

  String translate(String source) => _translations[source] ?? source;

  /// Translate presentation only, after parsing original doses and references.
  /// Language changes must never change saved IDs, targets or progress rules.
  Catalog localized(Map<String, String> translations) {
    String t(String value) => translations[value] ?? value;
    PhaseMuscle item(PhaseMuscle value) => PhaseMuscle(
      id: value.id,
      side: value.side,
      why: value.why == null ? null : t(value.why!),
    );
    final result = Catalog._(
      sections: sections
          .map(
            (v) =>
                MuscleSection(id: v.id, label: t(v.label), short: t(v.short)),
          )
          .toList(),
      groups: groups
          .map(
            (v) => MuscleGroup(
              groupId: v.id,
              section: v.section,
              colour: v.colour,
              label: t(v.label),
              view: v.view,
              role: t(v.role),
              deep: v.deep,
              panels: v.panels,
              note: v.note == null ? null : t(v.note!),
            ),
          )
          .toList(),
      phases: phases
          .map(
            (v) => Phase(
              source: v.source,
              id: v.id,
              name: t(v.name),
              detail: t(v.detail),
              caption: t(v.caption),
              primary: v.primary.map(item).toList(),
              secondary: v.secondary.map(item).toList(),
            ),
          )
          .toList(),
      drills: drills
          .map(
            (v) => Drill(
              id: v.id,
              groupId: v.groupId,
              tier: v.tier,
              tierLabel: t(v.tierLabel),
              name: t(v.name),
              nameEn: v.nameEn,
              equipment: t(v.equipment),
              prescription: t(v.prescription),
              cues: v.cues.map(t).toList(),
              mistake: t(v.mistake),
              why: t(v.why),
              difficulty: v.difficulty,
              imageAsset: v.imageAsset,
              thumbnailAsset: v.thumbnailAsset,
              dose: v.dose.copyWith(
                blockLabels: v.dose.blockLabels.map(t).toList(),
              ),
              safety: v.safety == null ? null : t(v.safety!),
              illustrationNote: v.illustrationNote == null
                  ? null
                  : t(v.illustrationNote!),
            ),
          )
          .toList(),
      stages: stages
          .map(
            (v) => CourseStage(
              n: v.n,
              id: v.id,
              title: t(v.title),
              weeksMin: v.weeksMin,
              weeksMax: v.weeksMax,
              sourcePro: v.sourcePro,
              lessons: v.lessons
                  .map(
                    (l) => Lesson(
                      id: l.id,
                      stage: l.stage,
                      n: l.n,
                      title: t(l.title),
                      minutes: l.minutes,
                      phases: l.phases,
                      drills: l.drills,
                    ),
                  )
                  .toList(),
              gates: v.gates
                  .map(
                    (g) => CourseGate(
                      id: g.id,
                      text: t(g.text),
                      kind: g.kind,
                      unit: g.unit,
                      sourceText: t(g.sourceText),
                      sourceKind: g.sourceKind,
                      sourceTarget: g.sourceTarget,
                      phases: g.phases,
                      target: g.target,
                    ),
                  )
                  .toList(),
            ),
          )
          .toList(),
      phaseKeys: phaseKeys,
      tiers: tiers.map((key, value) => MapEntry(key, t(value))),
      note: t(note),
      drillNote: t(drillNote),
      curriculumNote: t(curriculumNote),
      period: period,
    );
    result._translations = Map.unmodifiable(translations);
    result._original = _original ?? this;
    return result;
  }

  MuscleGroup? groupById(String id) => _groups[id];
  Phase? phaseBySource(int source) => _phases[source];
  Drill? drillById(String id) => _drills[id];
  CourseStage? stageByNumber(int n) => _stages[n];
  Lesson? lessonById(String id) => _lessons[id];
  CourseGate? gateById(String id) => _gates[id];

  List<Drill> drillsFor(String groupId, {String? tier}) => List.unmodifiable(
    drills.where(
      (drill) =>
          drill.groupId == groupId && (tier == null || drill.tier == tier),
    ),
  );

  List<Drill> searchDrills(
    String query, {
    String? tier,
    String? groupId,
    String? section,
  }) {
    final terms = _searchText(query)
        .trim()
        .toLowerCase()
        .split(RegExp(r'\s+'))
        .where((term) => term.isNotEmpty);
    return List.unmodifiable(
      drills.where((drill) {
        if (tier != null && drill.tier != tier) return false;
        if (groupId != null && drill.groupId != groupId) return false;
        final group = _groups[drill.groupId]!;
        if (section != null && group.section != section) return false;
        final haystack = _searchText(
          '${drill.name} ${drill.nameEn} ${drill.equipment} ${group.label} ${drill.tierLabel} ${_original?.drillById(drill.id)?.name ?? ''} ${_original?.groupById(drill.groupId)?.label ?? ''}',
        );
        return terms.every(haystack.contains);
      }),
    );
  }

  static String _searchText(String value) {
    var result = value.toLowerCase();
    const accents = {
      'a': 'àáâãäåāăą',
      'c': 'çćč',
      'd': 'ďđ',
      'e': 'èéêëēėęě',
      'i': 'ìíîïī',
      'l': 'ł',
      'n': 'ñńň',
      'o': 'òóôõöøō',
      'r': 'ř',
      's': 'śš',
      't': 'ť',
      'u': 'ùúûüūů',
      'y': 'ýÿ',
      'z': 'źżž',
      'е': 'ё',
      'ا': 'أإآٱ',
      'ي': 'ى',
    };
    for (final entry in accents.entries) {
      result = result.replaceAll(RegExp('[${entry.value}]'), entry.key);
    }
    return result
        .replaceAll('ß', 'ss')
        .replaceAll(RegExp(r'[\u064b-\u065f\u0670]'), '');
  }

  double phaseTime(int source) =>
      phaseKeys.firstWhere((key) => key.source == source).time;

  /// Nearest saved key, with circular midpoint boundaries like samplePhase in
  /// the package. The renderer reports its exact phase during playback.
  Phase phaseAt(double time) {
    final wrapped = ((time % period) + period) % period;
    final keys = phaseKeys.where((key) => key.time < period).toList();
    PhaseKey closest = keys.first;
    var best = period;
    for (final key in keys) {
      var distance = (wrapped - key.time).abs();
      if (distance > period / 2) distance = period - distance;
      if (distance < best) {
        closest = key;
        best = distance;
      }
    }
    return _phases[closest.source]!;
  }

  String supportFor(int source) =>
      phaseKeys.firstWhere((key) => key.source == source).support;

  List<MuscleGroup> synergists(Phase phase, String groupId, {int limit = 2}) {
    final seen = <String>{groupId};
    final result = <MuscleGroup>[];
    for (final item in phase.items) {
      if (!seen.add(item.id)) continue;
      result.add(_groups[item.id]!);
      if (result.length >= limit) break;
    }
    return List.unmodifiable(result);
  }

  static Future<Catalog> load({AssetBundle? bundle}) async {
    final source = bundle ?? rootBundle;
    final strings = await Future.wait([
      source.loadString('assets/data/phase-muscles.json'),
      source.loadString('assets/data/drills.json'),
      source.loadString('assets/data/course-stages.json'),
      source.loadString('assets/data/source-manifest.json'),
    ]);
    return Catalog.fromJson(
      phaseMuscles: jsonDecode(strings[0]) as Map<String, dynamic>,
      drillLibrary: jsonDecode(strings[1]) as Map<String, dynamic>,
      curriculum: jsonDecode(strings[2]) as Map<String, dynamic>,
      manifest: jsonDecode(strings[3]) as Map<String, dynamic>,
    );
  }

  factory Catalog.fromJson({
    required Map<String, dynamic> phaseMuscles,
    required Map<String, dynamic> drillLibrary,
    required Map<String, dynamic> curriculum,
    required Map<String, dynamic> manifest,
  }) {
    final sections = (phaseMuscles['sections'] as List)
        .map(
          (value) =>
              MuscleSection.fromJson(Map<String, dynamic>.from(value as Map)),
        )
        .toList();
    final groups = (phaseMuscles['groups'] as List)
        .map(
          (value) =>
              MuscleGroup.fromJson(Map<String, dynamic>.from(value as Map)),
        )
        .toList();
    final phases = (phaseMuscles['phases'] as List)
        .map((value) => Phase.fromJson(Map<String, dynamic>.from(value as Map)))
        .toList();
    final images = manifest['images'] as Map;
    final drills = <Drill>[];
    for (final tierMap in (drillLibrary['drills'] as Map).values) {
      for (final value in (tierMap as Map).values) {
        final json = Map<String, dynamic>.from(value as Map);
        drills.add(
          Drill.fromJson(
            json,
            Map<String, dynamic>.from(images[json['id']] as Map),
          ),
        );
      }
    }
    final stages = (curriculum['stages'] as List)
        .map(
          (value) =>
              CourseStage.fromJson(Map<String, dynamic>.from(value as Map)),
        )
        .toList();
    final timeline = phaseMuscles['timeline'] as Map;
    final period = (timeline['period'] as num).toDouble();
    final keys = (timeline['keys'] as List).map((value) {
      final json = value as Map;
      return PhaseKey(
        time: (json['time'] as num).toDouble(),
        source: json['source'] as int,
        support: json['support'] as String,
      );
    }).toList();
    final ids = groups.map((group) => group.id).toSet();
    final drillIds = drills.map((drill) => drill.id).toSet();
    final sources = phases.map((phase) => phase.source).toSet();
    if (groups.length != 17 ||
        ids.length != 17 ||
        phases.length != 8 ||
        drills.length != 51 ||
        drillIds.length != 51 ||
        stages.length != 6 ||
        stages.expand((stage) => stage.lessons).length != 18 ||
        period <= 0) {
      throw const FormatException('Unexpected offline catalog size');
    }
    for (final phase in phases) {
      if (phase.items.any((item) => !ids.contains(item.id))) {
        throw const FormatException('Unknown muscle group in phase');
      }
    }
    for (final drill in drills) {
      if (!ids.contains(drill.groupId) ||
          !['A', 'B', 'C'].contains(drill.tier) ||
          drill.id != '${drill.groupId}-${drill.tier}') {
        throw const FormatException('Invalid drill reference');
      }
    }
    for (final lesson in stages.expand((stage) => stage.lessons)) {
      if (lesson.drills.any((id) => !drillIds.contains(id)) ||
          lesson.phases.any((source) => !sources.contains(source))) {
        throw const FormatException('Invalid lesson reference');
      }
    }
    return Catalog._(
      sections: sections,
      groups: groups,
      phases: phases,
      drills: drills,
      stages: stages,
      phaseKeys: keys,
      tiers: Map<String, String>.from(
        (drillLibrary['meta'] as Map)['tiers'] as Map,
      ),
      note: phaseMuscles['note'] as String,
      drillNote: (drillLibrary['meta'] as Map)['note'] as String,
      curriculumNote: (curriculum['meta'] as Map)['note'] as String,
      period: period,
    );
  }
}
