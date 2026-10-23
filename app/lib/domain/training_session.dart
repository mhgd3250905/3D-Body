import 'package:ugk_trainer/engine.dart' as trainer;

import 'drill_timer.dart';

/// A user-confirmed local log. It is never an automated skill or health score.
class TrainingSession {
  const TrainingSession({
    required this.id,
    required this.drillId,
    required this.startedAt,
    required this.endedAt,
    required this.activeSeconds,
    required this.completedSets,
    required this.plannedSets,
    required this.pain,
    required this.completed,
  });

  final String id;
  final String drillId;
  final DateTime startedAt;
  final DateTime endedAt;
  final int activeSeconds;
  final int completedSets;
  final int plannedSets;
  final bool pain;
  final bool completed;

  /// Compatibility projection only. The SDK result remains the authority:
  /// do not reconstruct sides/visits or recalculate historical counters.
  /// SDK 0.2.0 segments already aggregate into one parent ItemResult, so this
  /// projection stays one row per parent for both old and new result JSON.
  /// Unreached or unrepresentable items stay in the full SDK archive only.
  static TrainingSession? fromTrainerItem(
    trainer.SessionResult result,
    trainer.ItemResult item,
  ) {
    if (item.status == trainer.ItemStatus.notReached ||
        !item.activeSeconds.isFinite ||
        item.activeSeconds < 0) {
      return null;
    }
    final row = TrainingSession(
      id:
          'sdk:${Uri.encodeComponent(result.sessionId)}:'
          'b${item.blockIndex}:i${item.itemInBlock}',
      drillId: item.exerciseId,
      startedAt: result.startedAt,
      endedAt: result.endedAt,
      activeSeconds: item.activeSeconds.round(),
      completedSets: item.completedSets,
      plannedSets: item.plannedSets,
      pain: result.discomfort.any(
        (event) =>
            event.blockIndex == item.blockIndex &&
            event.itemInBlock == item.itemInBlock,
      ),
      completed: item.status == trainer.ItemStatus.completed,
    );
    return row.valid ? row : null;
  }

  factory TrainingSession.fromTimer({
    required String id,
    required String drillId,
    required DateTime startedAt,
    required DateTime endedAt,
    required TimerSnapshot snapshot,
    required bool pain,
  }) => TrainingSession(
    id: id,
    drillId: drillId,
    startedAt: startedAt,
    endedAt: endedAt,
    activeSeconds: snapshot.activeWorkMs ~/ 1000,
    completedSets: snapshot.completedSets,
    plannedSets: snapshot.sets,
    pain: pain,
    completed: snapshot.phase == TimerPhase.finished,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'drillId': drillId,
    'startedAt': startedAt.toUtc().toIso8601String(),
    'endedAt': endedAt.toUtc().toIso8601String(),
    'activeSeconds': activeSeconds,
    'completedSets': completedSets,
    'plannedSets': plannedSets,
    'pain': pain,
    'completed': completed,
  };

  factory TrainingSession.fromJson(Map<String, dynamic> json) =>
      TrainingSession(
        id: json['id'] as String,
        drillId: json['drillId'] as String,
        startedAt: DateTime.parse(json['startedAt'] as String),
        endedAt: DateTime.parse(json['endedAt'] as String),
        activeSeconds: json['activeSeconds'] as int,
        completedSets: json['completedSets'] as int,
        plannedSets: json['plannedSets'] as int,
        pain: json['pain'] as bool,
        completed: json['completed'] as bool,
      );

  bool get valid =>
      id.isNotEmpty &&
      drillId.isNotEmpty &&
      !endedAt.isBefore(startedAt) &&
      activeSeconds >= 0 &&
      activeSeconds <= endedAt.difference(startedAt).inSeconds + 1 &&
      plannedSets > 0 &&
      completedSets >= 0 &&
      completedSets <= plannedSets &&
      (!completed || completedSets == plannedSets);
}
