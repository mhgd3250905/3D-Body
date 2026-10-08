/// Conservative targets imported from the provided teaching library.
/// These are training references, not measurements or automatic progression.
enum DoseMode { time, reps, manual }

class Dose {
  Dose({
    required this.sets,
    required this.perSide,
    required this.mode,
    required this.min,
    required this.max,
    required this.restSec,
    required this.raw,
    int? setsMax,
    List<String> blockLabels = const [''],
  }) : setsMax = setsMax ?? sets,
       blockLabels = List.unmodifiable(blockLabels) {
    if (sets < 1 ||
        this.setsMax < sets ||
        min < 0 ||
        max < min ||
        restSec < 0 ||
        blockLabels.isEmpty) {
      throw ArgumentError('Invalid training dose');
    }
    if (mode != DoseMode.manual && min == 0) {
      throw ArgumentError('Timed and repetition doses need a positive target');
    }
  }

  final int sets;
  final int setsMax;
  final bool perSide;
  final DoseMode mode;
  final int min;
  final int max;
  final int restSec;
  final String raw;

  /// A set may contain multiple movements: Y, T, W or wrist flex/extension.
  final List<String> blockLabels;

  int get blocksPerSet => blockLabels.length * (perSide ? 2 : 1);

  /// Lower bound is the default. Increasing a target is a deliberate UI choice.
  int targetForWeek(int weekInStage) {
    final fraction = (weekInStage / 3).clamp(0.0, 1.0);
    return (min + (max - min) * fraction).round();
  }

  Dose copyWith({int? restSec, List<String>? blockLabels}) => Dose(
    sets: sets,
    setsMax: setsMax,
    perSide: perSide,
    mode: mode,
    min: min,
    max: max,
    restSec: restSec ?? this.restSec,
    raw: raw,
    blockLabels: blockLabels ?? this.blockLabels,
  );

  factory Dose.manual(String raw) {
    final count = RegExp(r'(\d+)\s*(?:组|轮)').firstMatch(raw);
    return Dose(
      sets: int.tryParse(count?.group(1) ?? '') ?? 1,
      perSide: RegExp(r'每侧|每边|单侧').hasMatch(raw),
      mode: DoseMode.manual,
      min: 0,
      max: 0,
      restSec: 90,
      raw: raw,
    );
  }
}

/// Returns null for multi-direction rounds and distance carries. Their literal
/// prescription stays visible and the timer requires manual confirmation.
Dose? parseDose(String raw, {int restTime = 60, int restReps = 90}) {
  final text = raw.replaceAll(RegExp(r'\s+'), ' ').trim();
  final setMatch = RegExp(
    r'(\d+)\s*(?:[–—\-~至到]\s*(\d+))?\s*组',
  ).firstMatch(text);
  if (setMatch == null) return null;
  final sets = int.parse(setMatch.group(1)!);
  final setsMax = int.parse(setMatch.group(2) ?? setMatch.group(1)!);
  if (sets < 1 || setsMax < sets) return null;
  final afterSets = text.substring(setMatch.end);
  final separators = afterSets.split(RegExp(r'[×x*]'));
  final tail =
      (separators.length > 1 ? separators.skip(1).join(' ') : afterSets)
          .replaceAll(RegExp(r'每侧|每边|单侧'), '');
  final quantity = RegExp(r'(\d+)\s*(?:[–—\-~至到]\s*(\d+))?').firstMatch(tail);
  if (quantity == null) return null;
  var minimum = int.parse(quantity.group(1)!);
  var maximum = int.parse(quantity.group(2) ?? quantity.group(1)!);
  if (minimum <= 0 || maximum < minimum) return null;
  final unit = tail.substring(quantity.end).trim();
  final DoseMode mode;
  if (RegExp(r'^(秒|s\b|sec)', caseSensitive: false).hasMatch(unit)) {
    mode = DoseMode.time;
  } else if (RegExp(r'^(分钟|min)', caseSensitive: false).hasMatch(unit)) {
    mode = DoseMode.time;
    minimum *= 60;
    maximum *= 60;
  } else if (RegExp(r'^(次|下|步|rep)', caseSensitive: false).hasMatch(unit)) {
    mode = DoseMode.reps;
  } else {
    return null;
  }
  return Dose(
    sets: sets,
    setsMax: setsMax,
    perSide: RegExp(r'每侧|每边|单侧').hasMatch(text),
    mode: mode,
    min: minimum,
    max: maximum,
    restSec: mode == DoseMode.time ? restTime : restReps,
    raw: raw,
    blockLabels: text.contains('每个字母') ? const ['Y', 'T', 'W'] : const [''],
  );
}
