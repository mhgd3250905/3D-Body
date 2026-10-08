import 'dose.dart';

class MuscleSection {
  const MuscleSection({
    required this.id,
    required this.label,
    required this.short,
  });
  final String id;
  final String label;
  final String short;

  factory MuscleSection.fromJson(Map<String, dynamic> json) => MuscleSection(
    id: json['id'] as String,
    label: json['label'] as String,
    short: json['short'] as String,
  );
}

class MuscleGroup {
  MuscleGroup({
    required this.groupId,
    required this.section,
    required this.colour,
    required this.label,
    required this.view,
    required this.role,
    required this.deep,
    required List<String> panels,
    this.note,
  }) : panels = List.unmodifiable(panels);

  final String groupId;
  String get id => groupId;
  final String section;
  final String colour;
  int get colorValue => 0xff000000 | int.parse(colour.substring(1), radix: 16);
  final String label;
  final String view;
  final String role;
  final String? note;
  final bool deep;
  final List<String> panels;

  factory MuscleGroup.fromJson(Map<String, dynamic> json) => MuscleGroup(
    groupId: json['groupId'] as String,
    section: json['section'] as String,
    colour: json['colour'] as String,
    label: json['label'] as String,
    view: json['view'] as String,
    role: json['role'] as String,
    note: json['note'] as String?,
    deep: json['deep'] as bool,
    panels: (json['panels'] as List).cast<String>(),
  );
}

class PhaseMuscle {
  const PhaseMuscle({required this.id, required this.side, this.why});
  final String id;
  String get groupId => id;

  /// support / free / both: resolved from the saved pose, never the phase name.
  final String side;
  final String? why;

  factory PhaseMuscle.fromJson(Map<String, dynamic> json) => PhaseMuscle(
    id: json['id'] as String,
    side: json['side'] as String,
    why: json['why'] as String?,
  );

  String resolvedSide(String support) {
    if (side == 'both' || support == 'both') return 'both';
    if (side == 'support') return support;
    return support == 'left' ? 'right' : 'left';
  }
}

class Phase {
  Phase({
    required this.source,
    required this.id,
    required this.name,
    required this.detail,
    required this.caption,
    required List<PhaseMuscle> primary,
    required List<PhaseMuscle> secondary,
  }) : primary = List.unmodifiable(primary),
       secondary = List.unmodifiable(secondary);

  final int source;
  final String id;
  final String name;
  final String detail;
  final String caption;
  final List<PhaseMuscle> primary;
  final List<PhaseMuscle> secondary;
  List<PhaseMuscle> get items => List.unmodifiable([...primary, ...secondary]);

  PhaseMuscle? muscle(String groupId) {
    for (final item in items) {
      if (item.id == groupId) return item;
    }
    return null;
  }

  factory Phase.fromJson(Map<String, dynamic> json) => Phase(
    source: json['source'] as int,
    id: json['id'] as String,
    name: json['name'] as String,
    detail: json['detail'] as String,
    caption: json['caption'] as String,
    primary: (json['primary'] as List)
        .map(
          (item) =>
              PhaseMuscle.fromJson(Map<String, dynamic>.from(item as Map)),
        )
        .toList(),
    secondary: (json['secondary'] as List)
        .map(
          (item) =>
              PhaseMuscle.fromJson(Map<String, dynamic>.from(item as Map)),
        )
        .toList(),
  );
}

class Drill {
  Drill({
    required this.id,
    required this.groupId,
    required this.tier,
    required this.tierLabel,
    required this.name,
    required this.nameEn,
    required this.equipment,
    required this.prescription,
    required List<String> cues,
    required this.mistake,
    required this.why,
    required this.difficulty,
    required this.imageAsset,
    required this.thumbnailAsset,
    required this.dose,
    this.safety,
    this.illustrationNote,
  }) : cues = List.unmodifiable(cues);

  final String id;
  final String groupId;
  final String tier;
  final String tierLabel;
  final String name;
  final String nameEn;
  final String equipment;
  final String prescription;
  final List<String> cues;
  final String mistake;
  final String why;
  final int difficulty;
  final String? safety;
  final String imageAsset;
  final String thumbnailAsset;
  final String? illustrationNote;
  final Dose dose;

  factory Drill.fromJson(
    Map<String, dynamic> json,
    Map<String, dynamic> image,
  ) {
    var dose =
        parseDose(json['prescription'] as String) ??
        Dose.manual(json['prescription'] as String);
    // The literal "各" refers to wrist flexion plus extension, each receiving
    // the stated number of sets. Both blocks must be confirmed for a full set.
    if (json['id'] == 'forearms-B') {
      dose = dose.copyWith(blockLabels: const ['腕屈', '腕伸']);
    }
    return Drill(
      id: json['id'] as String,
      groupId: json['groupId'] as String,
      tier: json['tier'] as String,
      tierLabel: json['tierLabel'] as String,
      name: json['name'] as String,
      nameEn: json['nameEn'] as String,
      equipment: json['equipment'] as String,
      prescription: json['prescription'] as String,
      cues: (json['cues'] as List).cast<String>(),
      mistake: json['mistake'] as String,
      why: json['why'] as String,
      difficulty: json['difficulty'] as int,
      safety: json['safety'] as String?,
      imageAsset: image['imageAsset'] as String,
      thumbnailAsset: image['thumbnailAsset'] as String,
      illustrationNote: image['note'] as String?,
      dose: dose,
    );
  }
}

class CourseGate {
  CourseGate({
    required this.id,
    required this.text,
    required this.kind,
    required this.unit,
    required this.sourceText,
    required this.sourceKind,
    required this.sourceTarget,
    required List<int> phases,
    this.target,
  }) : phases = List.unmodifiable(phases);

  final String id;
  final String text;

  /// hold / reps / pain-free / self-review; every result is self-reported.
  final String kind;
  final num? target;
  final String unit;
  final List<int> phases;
  final String sourceText;
  final String sourceKind;
  final num sourceTarget;

  factory CourseGate.fromJson(Map<String, dynamic> json) {
    final usesAi = json['kind'] == 'ai';
    return CourseGate(
      id: json['id'] as String,
      text: usesAi
          ? (json['id'] == 'ai9to11'
                ? '自行回顾 09–11：后撑、移重与侧撑是否连贯'
                : '自行回顾整圈：换手、开腿与节奏是否连贯')
          : json['text'] as String,
      kind: usesAi ? 'self-review' : json['kind'] as String,
      target: usesAi ? null : json['target'] as num,
      unit: usesAi ? 'self-report' : json['unit'] as String,
      phases: (json['phases'] as List? ?? const []).cast<int>(),
      sourceText: json['text'] as String,
      sourceKind: json['kind'] as String,
      sourceTarget: json['target'] as num,
    );
  }
}

class Lesson {
  Lesson({
    required this.id,
    required this.stage,
    required this.n,
    required this.title,
    required this.minutes,
    required List<int> phases,
    required List<String> drills,
  }) : phases = List.unmodifiable(phases),
       drills = List.unmodifiable(drills);
  final String id;
  final int stage;
  final int n;
  final String title;
  final int minutes;
  final List<int> phases;
  final List<String> drills;
  bool get draft => true;

  factory Lesson.fromJson(Map<String, dynamic> json, int stage) => Lesson(
    id: json['id'] as String,
    stage: stage,
    n: json['n'] as int,
    title: json['title'] as String,
    minutes: json['minutes'] as int,
    phases: (json['phases'] as List).cast<int>(),
    drills: (json['drills'] as List).cast<String>(),
  );
}

class CourseStage {
  CourseStage({
    required this.n,
    required this.id,
    required this.title,
    required this.weeksMin,
    required this.weeksMax,
    required this.sourcePro,
    required List<Lesson> lessons,
    required List<CourseGate> gates,
  }) : lessons = List.unmodifiable(lessons),
       gates = List.unmodifiable(gates);
  final int n;
  final String id;
  final String title;
  final int weeksMin;
  final int weeksMax;
  final bool sourcePro;
  bool get pro => false;
  bool get draft => true;
  final List<Lesson> lessons;
  final List<CourseGate> gates;

  factory CourseStage.fromJson(Map<String, dynamic> json) => CourseStage(
    n: json['n'] as int,
    id: json['id'] as String,
    title: json['title'] as String,
    weeksMin: (json['weeks'] as List)[0] as int,
    weeksMax: (json['weeks'] as List)[1] as int,
    sourcePro: json['pro'] as bool,
    lessons: (json['lessons'] as List)
        .map(
          (value) => Lesson.fromJson(
            Map<String, dynamic>.from(value as Map),
            json['n'] as int,
          ),
        )
        .toList(),
    gates: (json['gates'] as List)
        .map(
          (value) =>
              CourseGate.fromJson(Map<String, dynamic>.from(value as Map)),
        )
        .toList(),
  );
}
