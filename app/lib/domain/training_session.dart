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
