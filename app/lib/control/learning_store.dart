import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/engine.dart' as trainer;

import '../data/catalog.dart';
import '../data/local_state_storage.dart';
import '../domain/learning_settings.dart';
import '../domain/training_session.dart';
import '../domain/training_plan.dart';

export '../data/local_state_storage.dart';
export '../domain/learning_settings.dart';
export '../domain/training_session.dart';
export '../domain/training_plan.dart';

/// App progress is a local, user-confirmed learning record. It never infers
/// proficiency, diagnoses pain, or converts an illustration into an assessment.
class LearningStore extends ChangeNotifier {
  LearningStore({
    required this.catalog,
    LocalStateStorage? storage,
    DateTime Function()? now,
  }) : _storage = storage ?? SharedPreferencesLocalStateStorage(),
       _now = now ?? DateTime.now;

  static const storageKey = 'flare.learning.v1';
  static const assessmentIds = {'wrist', 'pike', 'straddle', 'dips', 'lsit'};
  final Catalog catalog;
  final LocalStateStorage _storage;
  final DateTime Function() _now;
  Future<void>? _initializing;
  Future<void> _writeQueue = Future.value();
  bool _initialized = false;
  bool _readSucceeded = false;
  bool _corruptState = false;
  bool _disposed = false;
  bool _safetyAccepted = false;
  LearningSettings _settings = const LearningSettings();
  double _lastTime = 0;
  String _todayDate = '';
  List<String> _todayIds = [];
  List<TrainingRoutine> _routines = [];
  List<TrainingSession> _sessions = [];
  // Detached SDK JSON snapshots retain every public result field. Expose
  // decoded copies so mutable SDK lists/maps cannot change stored history.
  List<Map<String, dynamic>> _trainerSessions = [];
  Set<String> _completedLessonIds = {};
  Map<String, bool> _gateReports = {};
  Map<String, int> _assessmentGrades = {};
  int _startStage = 1;
  String? _storageError;
  Map<String, dynamic> _preservedRoot = {};

  bool get initialized => _initialized;
  bool get safetyAccepted => _safetyAccepted;
  LearningSettings get settings => _settings;
  double get lastTime => _lastTime;
  String? get storageError => _storageError;
  bool get corruptState => _corruptState;
  bool get persistenceBlocked => _corruptState || !_readSucceeded;
  List<String> get todayIds =>
      List.unmodifiable(_todayDate == _today ? _todayIds : <String>[]);
  List<TrainingSession> get sessions => List.unmodifiable(_sessions);
  List<trainer.SessionResult> get trainerSessions => List.unmodifiable([
    for (final json in _trainerSessions)
      trainer.SessionResult.fromJson(_copyJson(json)),
  ]);

  /// Detached, lossless backup snapshots, including forward-compatible fields.
  List<Map<String, dynamic>> get trainerSessionJson =>
      List.unmodifiable([for (final json in _trainerSessions) _copyJson(json)]);
  List<TrainingRoutine> get routines => List.unmodifiable(_routines);
  TrainingRoutine? routineById(String id) =>
      _routines.where((routine) => routine.id == id).firstOrNull;
  Set<String> get completedLessonIds => Set.unmodifiable(_completedLessonIds);
  Map<String, bool> get gateReports => Map.unmodifiable(_gateReports);
  Map<String, int> get assessmentGrades => Map.unmodifiable(_assessmentGrades);
  int get startStage => _startStage;
  int get currentStage {
    for (final stage in catalog.stages.where(
      (stage) => stage.n >= _startStage,
    )) {
      if (!isStagePassed(stage.n)) return stage.n;
    }
    return catalog.stages.last.n;
  }

  String get _today => _dateStamp(_now());
  static String _dateStamp(DateTime value) {
    final date = value.toLocal();
    return '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  /// Completed rows are distinct by stable session ID. Pain is retained in the
  /// history but never automatically marks a lesson or gate as passed.
  Set<String> get completedTodayIds => Set.unmodifiable(
    _sessions
        .where(
          (session) =>
              session.completed && _dateStamp(session.endedAt) == _today,
        )
        .map((session) => session.drillId),
  );
  int get todayActiveSeconds => _sessions
      .where((session) => _dateStamp(session.endedAt) == _today)
      .fold(0, (sum, session) => sum + session.activeSeconds);
  int get totalActiveSeconds =>
      _sessions.fold(0, (sum, session) => sum + session.activeSeconds);

  Set<String> get _trainingDays => _sessions
      .where(
        (session) => session.completedSets > 0 || session.activeSeconds > 0,
      )
      .map((session) => _dateStamp(session.endedAt))
      .toSet();

  int get streakDays {
    final days = _trainingDays;
    final now = _now().toLocal();
    var cursor = DateTime(now.year, now.month, now.day);
    if (!days.contains(_dateStamp(cursor))) {
      cursor = DateTime(cursor.year, cursor.month, cursor.day - 1);
    }
    var count = 0;
    while (days.contains(_dateStamp(cursor))) {
      count++;
      cursor = DateTime(cursor.year, cursor.month, cursor.day - 1);
    }
    return count;
  }

  int get weekTrainingDays {
    final now = _now().toLocal();
    final monday = DateTime(now.year, now.month, now.day - now.weekday + 1);
    final today = _today;
    final begin = _dateStamp(monday);
    return _trainingDays
        .where(
          (date) => date.compareTo(begin) >= 0 && date.compareTo(today) <= 0,
        )
        .length;
  }

  bool isStagePassed(int n) {
    final stage = catalog.stageByNumber(n);
    return stage != null &&
        stage.lessons.every(
          (lesson) => _completedLessonIds.contains(lesson.id),
        ) &&
        stage.gates.every((gate) => _gateReports[gate.id] == true);
  }

  bool isStageUnlocked(int n) {
    if (catalog.stageByNumber(n) == null) return false;
    if (n <= _startStage) return true;
    for (var previous = _startStage; previous < n; previous++) {
      if (!isStagePassed(previous)) return false;
    }
    return true;
  }

  Future<void> initialize() {
    if (_initialized) return Future.value();
    return _initializing ??= _load();
  }

  Future<void> _load() async {
    String? raw;
    try {
      raw = await _storage.read(storageKey);
      _readSucceeded = true;
    } catch (_) {
      _storageError = '本机进度暂时无法读取，原数据未改动。本次记录暂不写入；可重新打开后再试。';
    }
    if (raw != null) {
      try {
        _restore(jsonDecode(raw) as Map<String, dynamic>);
      } catch (_) {
        _corruptState = true;
        _storageError = '已有本机进度格式异常，已保留原数据。本次记录暂未写入。';
      }
    }
    _initialized = true;
    _notify();
  }

  void _restore(Map<String, dynamic> json) {
    // Validate a complete detached snapshot before assigning any live fields.
    // Partial decoding must never silently replace existing saved progress.
    if (json['version'] != 1) {
      throw const FormatException('Unsupported local state version');
    }
    final safety = json['safetyAccepted'] as bool;
    final settings = LearningSettings.fromJson(
      Map<String, dynamic>.from(json['settings'] as Map),
    );
    final lastTime = (json['lastTime'] as num).toDouble();
    final today = json['today'] as Map;
    final todayDate = today['date'] as String;
    final todayIds = (today['ids'] as List).cast<String>().toList();
    final sessions = (json['sessions'] as List)
        .map(
          (value) =>
              TrainingSession.fromJson(Map<String, dynamic>.from(value as Map)),
        )
        .toList();
    final trainerSessions = <Map<String, dynamic>>[
      for (final value in (json['trainerSessions'] as List? ?? const []))
        _trainerResultJson(Map<String, dynamic>.from(value as Map)),
    ];
    if (trainerSessions.map((row) => row['sessionId']).toSet().length !=
        trainerSessions.length) {
      throw const FormatException('Duplicate SDK session IDs');
    }
    final lessons = (json['completedLessonIds'] as List).cast<String>().toSet();
    final gates = Map<String, bool>.from(json['gateReports'] as Map);
    final grades = Map<String, int>.from(json['assessmentGrades'] as Map);
    final startStage = json['startStage'] as int;
    // Saved sets arrived after version 1; older states simply have none.
    // A set whose drills left the catalog keeps the drills that remain.
    final routines = <TrainingRoutine>[
      for (final value in (json['routines'] as List? ?? const []))
        TrainingRoutine.fromJson(Map<String, dynamic>.from(value as Map)),
    ];
    final keptRoutines = [
      for (final routine in routines)
        if (routine.sdkPlan != null)
          routine
        else
          routine.copyWith(
            drillIds: [
              for (final id in routine.drillIds)
                if (catalog.drillById(id) != null) id,
            ],
          ),
    ].where((routine) => routine.valid).toList();
    final parsedDate = DateTime.tryParse('${todayDate}T12:00:00');
    if (!settings.valid ||
        !lastTime.isFinite ||
        lastTime < 0 ||
        lastTime > catalog.period ||
        (todayDate.isNotEmpty &&
            (parsedDate == null || _dateStamp(parsedDate) != todayDate)) ||
        todayIds.any((id) => catalog.drillById(id) == null) ||
        todayIds.toSet().length != todayIds.length ||
        sessions.any(
          (session) =>
              !session.valid || catalog.drillById(session.drillId) == null,
        ) ||
        sessions.map((session) => session.id).toSet().length !=
            sessions.length ||
        lessons.any((id) => catalog.lessonById(id) == null) ||
        gates.keys.any((id) => catalog.gateById(id) == null) ||
        !_validGrades(grades, allowEmpty: true) ||
        startStage != _placement(grades)) {
      throw const FormatException('Invalid local learning state');
    }
    _safetyAccepted = safety;
    _settings = settings;
    _lastTime = lastTime;
    _todayDate = todayDate;
    _todayIds = todayIds;
    _sessions = sessions;
    _trainerSessions = trainerSessions;
    _completedLessonIds = lessons;
    _gateReports = gates;
    _assessmentGrades = grades;
    _startStage = startStage;
    _routines = keptRoutines;
    _preservedRoot = json;
  }

  Map<String, dynamic> _snapshotData() => {
    ..._preservedRoot,
    'version': 1,
    'safetyAccepted': _safetyAccepted,
    'settings': {
      ...(_preservedRoot['settings'] as Map? ?? const {}),
      ..._settings.toJson(),
    },
    'lastTime': _lastTime,
    'today': {'date': _todayDate, 'ids': _todayIds},
    'sessions': _sessions.map((session) => session.toJson()).toList(),
    'trainerSessions': _trainerSessions,
    'completedLessonIds': _completedLessonIds.toList()..sort(),
    'gateReports': _gateReports,
    'assessmentGrades': _assessmentGrades,
    'startStage': _startStage,
    'routines': _routines.map((routine) => routine.toJson()).toList(),
  };

  void _ensureInitialized() {
    if (!_initialized) {
      throw StateError('Initialize local state before editing it');
    }
  }

  Future<bool> _persist() {
    _ensureInitialized();
    _notify();
    if (persistenceBlocked) return Future.value(false);
    final encoded = jsonEncode(_snapshotData());
    final result = Completer<bool>();
    // Writes are ordered snapshots: an older asynchronous save cannot overtake
    // a newer plan/session update and erase it. Failed writes remain retryable.
    _writeQueue = _writeQueue.then((_) async {
      try {
        await _storage.write(storageKey, encoded);
        _storageError = null;
        result.complete(true);
      } catch (_) {
        _storageError = '本机存储暂时不可写，记录保留在本次运行中。可重试保存。';
        result.complete(false);
      }
      _notify();
    });
    return result.future;
  }

  Future<bool> retrySave() => _persist();

  Future<bool> acknowledgeSafety() {
    _ensureInitialized();
    _safetyAccepted = true;
    return _persist();
  }

  Future<bool> updateSettings({
    String? tier,
    double? speed,
    bool? cues,
    bool? sound,
    bool? haptics,
    int? weeklyGoal,
    String? themeMode,
    String? language,
    String? actorBody,
  }) {
    _ensureInitialized();
    final next = _settings.copyWith(
      themeMode: themeMode,
      language: language,
      actorBody: actorBody,
      tier: tier,
      speed: speed,
      cues: cues,
      sound: sound,
      haptics: haptics,
      weeklyGoal: weeklyGoal,
    );
    if (!next.valid) throw ArgumentError('Invalid learning settings');
    _settings = next;
    return _persist();
  }

  Future<bool> setLastTime(double time) {
    _ensureInitialized();
    if (!time.isFinite || time < 0 || time > catalog.period) {
      throw ArgumentError.value(time, 'time');
    }
    _lastTime = time;
    return _persist();
  }

  void _ensureToday() {
    if (_todayDate != _today) {
      _todayDate = _today;
      _todayIds = [];
    }
  }

  /// Call after returning from a suspended app to update the visible date.
  void refreshDate() => _notify();

  Future<bool> addToToday(String drillId) {
    _ensureInitialized();
    if (catalog.drillById(drillId) == null) {
      throw ArgumentError.value(drillId, 'drillId');
    }
    _ensureToday();
    if (!_todayIds.contains(drillId)) _todayIds.add(drillId);
    return _persist();
  }

  Future<bool> removeFromToday(String drillId) {
    _ensureInitialized();
    _ensureToday();
    _todayIds.remove(drillId);
    return _persist();
  }

  /// Saves a new set and returns it, or null when nothing valid was given.
  Future<TrainingRoutine?> createRoutine(
    String name,
    List<String> drillIds, {
    Map<String, RoutineDose> doses = const {},
    String? source,
    uc.TrainingPlan? sdkPlan,
  }) async {
    _ensureInitialized();
    final routine = TrainingRoutine(
      id: 'r${_now().microsecondsSinceEpoch}',
      name: name.trim(),
      drillIds: sdkPlan != null
          ? sdkPlan.exerciseIds.toList()
          : drillIds.where((id) => catalog.drillById(id) != null).toList(),
      doses: doses,
      source: source,
      sdkPlan: sdkPlan,
    );
    if (!routine.valid) throw ArgumentError('Invalid training routine');
    _routines = [..._routines, routine];
    await _persist();
    return routine;
  }

  Future<bool> updateRoutine(
    String id, {
    String? name,
    List<String>? drillIds,
    uc.TrainingPlan? sdkPlan,
  }) {
    _ensureInitialized();
    final index = _routines.indexWhere((routine) => routine.id == id);
    if (index < 0) throw ArgumentError.value(id, 'id');
    final previous = _routines[index];
    if (previous.sdkPlan != null &&
        sdkPlan == null &&
        drillIds != null &&
        !listEquals(previous.drillIds, drillIds)) {
      return Future.value(false);
    }
    final next = _routines[index].copyWith(
      name: name?.trim(),
      sdkPlan: sdkPlan,
      drillIds: sdkPlan != null
          ? sdkPlan.exerciseIds.toList()
          : drillIds
                ?.where((drillId) => catalog.drillById(drillId) != null)
                .toList(),
    );
    if (!next.valid) throw ArgumentError('Invalid training routine');
    _routines = [..._routines]..[index] = next;
    return _persist();
  }

  /// Adds one drill to the end of a set; already present is a no-op.
  Future<bool> addToRoutine(String id, String drillId) {
    final routine = routineById(id);
    if (routine == null) throw ArgumentError.value(id, 'id');
    if (routine.drillIds.contains(drillId)) return Future.value(true);
    if (routine.sdkPlan case final plan?) {
      final drill = catalog.drillById(drillId);
      if (drill == null) return Future.value(false);
      final dose = drill.dose;
      final blockIds = plan.blocks.map((block) => block.id).toSet();
      var blockId = 'added-$drillId';
      while (blockIds.contains(blockId)) {
        blockId = '$blockId-1';
      }
      final block = uc.PlanBlock(
        id: blockId,
        name: drill.name,
        type: uc.BlockType.main,
        items: [
          uc.PlanItem(
            exerciseId: drillId,
            mode: dose.mode == DoseMode.time
                ? uc.DoseMode.time
                : uc.DoseMode.reps,
            sets: dose.sets,
            reps: dose.mode == DoseMode.time ? null : dose.min,
            workSeconds: dose.mode == DoseMode.time ? dose.min : null,
            perSide: dose.perSide,
            restSeconds: dose.restSec,
          ),
        ],
      );
      final blocks = [...plan.blocks];
      final cooldown = blocks.indexWhere(
        (b) => b.type == uc.BlockType.cooldown,
      );
      blocks.insert(cooldown < 0 ? blocks.length : cooldown, block);
      return updateRoutine(id, sdkPlan: plan.copyWith(blocks: blocks));
    }
    return updateRoutine(id, drillIds: [...routine.drillIds, drillId]);
  }

  Future<bool> deleteRoutine(String id) {
    _ensureInitialized();
    _routines = _routines.where((routine) => routine.id != id).toList();
    return _persist();
  }

  /// Puts a deleted set back where it was (undo).
  Future<bool> restoreRoutine(TrainingRoutine routine, int index) {
    _ensureInitialized();
    if (!routine.valid || routineById(routine.id) != null) {
      return Future.value(false);
    }
    _routines = [..._routines]
      ..insert(index.clamp(0, _routines.length), routine);
    return _persist();
  }

  /// Most sets one record may plan: the drill's own range, or a saved plan's
  /// own target (same bound as [RoutineDose.maxSets]).
  static int maxPlannedSets(Drill drill) =>
      math.max(drill.dose.setsMax, RoutineDose.maxSets);

  Future<bool> logSession(TrainingSession session) {
    _ensureInitialized();
    final drill = catalog.drillById(session.drillId);
    if (!session.valid ||
        drill == null ||
        session.plannedSets > maxPlannedSets(drill)) {
      throw ArgumentError('Invalid training session');
    }
    final existing = _sessions.where((row) => row.id == session.id).firstOrNull;
    if (existing != null) {
      if (jsonEncode(existing.toJson()) != jsonEncode(session.toJson())) {
        throw ArgumentError('Session ID already belongs to a different record');
      }
      return _persist();
    }
    _sessions.add(session);
    return _persist();
  }

  static Map<String, dynamic> _copyJson(Map<String, dynamic> value) =>
      jsonDecode(jsonEncode(value)) as Map<String, dynamic>;

  /// Parse/validate without changing SDK completion semantics. In particular,
  /// a completed item alongside an incomplete session is preserved verbatim.
  static Map<String, dynamic> _trainerResultJson(Map<String, dynamic> json) {
    if (json['schema'] != trainer.SessionResult.schema) {
      throw const FormatException('Unsupported SDK session result');
    }
    final result = trainer.SessionResult.fromJson(json);
    if (result.sessionId.isEmpty ||
        result.planId.isEmpty ||
        !result.activeSeconds.isFinite ||
        result.activeSeconds < 0 ||
        result.completedExercises < 0 ||
        result.totalExercises < 0 ||
        result.completedExercises > result.totalExercises ||
        result.items.any(
          (item) =>
              item.exerciseId.isEmpty ||
              item.blockIndex < 0 ||
              item.itemInBlock < 0 ||
              !item.activeSeconds.isFinite ||
              item.activeSeconds < 0 ||
              item.plannedSets < 0 ||
              item.completedSets < 0,
        ) ||
        result.items
                .map((item) => (item.blockIndex, item.itemInBlock))
                .toSet()
                .length !=
            result.items.length ||
        result.discomfort.any((event) => !event.at.isFinite || event.at < 0)) {
      throw const FormatException('Invalid SDK session result');
    }
    return _copyJson(json);
  }

  /// Save a full SDK result and legacy history rows in one ordered snapshot.
  /// Same-ID retries never duplicate rows; failed/blocked writes must throw so
  /// TrainerPlayer retains its retry UI instead of reporting a false success.
  Future<void> saveTrainerSession(trainer.SessionResult result) async {
    _ensureInitialized();
    final json = _trainerResultJson(result.toJson());
    final existing = _trainerSessions
        .where((row) => row['sessionId'] == result.sessionId)
        .firstOrNull;
    if (existing != null &&
        !_sameJson(trainer.SessionResult.fromJson(existing).toJson(), json)) {
      throw ArgumentError(
        'SDK session ID already belongs to a different result',
      );
    }
    if (existing == null) {
      final rows = <TrainingSession>[];
      for (final item in result.items) {
        final row = TrainingSession.fromTrainerItem(result, item);
        if (row == null || catalog.drillById(row.drillId) == null) continue;
        final previous = _sessions.where((s) => s.id == row.id).firstOrNull;
        if (previous != null && !_sameJson(previous.toJson(), row.toJson())) {
          throw ArgumentError(
            'SDK legacy row ID collides with existing history',
          );
        }
        if (previous == null) rows.add(row);
      }
      _trainerSessions = [..._trainerSessions, json];
      _sessions = [..._sessions, ...rows];
    }
    if (!await _persist()) throw StateError('SDK session could not be saved');
  }

  static bool _sameJson(Object? a, Object? b) {
    if (a is Map && b is Map) {
      return a.length == b.length &&
          a.keys.every(
            (key) => b.containsKey(key) && _sameJson(a[key], b[key]),
          );
    }
    if (a is List && b is List) {
      return a.length == b.length &&
          List.generate(a.length, (i) => i).every((i) => _sameJson(a[i], b[i]));
    }
    return a == b;
  }

  Future<bool> completeLesson(String lessonId, {bool completed = true}) {
    _ensureInitialized();
    if (catalog.lessonById(lessonId) == null) {
      throw ArgumentError.value(lessonId, 'lessonId');
    }
    if (completed) {
      _completedLessonIds.add(lessonId);
    } else {
      _completedLessonIds.remove(lessonId);
    }
    return _persist();
  }

  Future<bool> reportGate(String gateId, bool passed) {
    _ensureInitialized();
    if (catalog.gateById(gateId) == null) {
      throw ArgumentError.value(gateId, 'gateId');
    }
    _gateReports[gateId] = passed;
    return _persist();
  }

  static bool _validGrades(
    Map<String, int> grades, {
    bool allowEmpty = false,
  }) =>
      (allowEmpty && grades.isEmpty) ||
      (setEquals(grades.keys.toSet(), assessmentIds) &&
          grades.values.every((value) => value >= 1 && value <= 4));

  static int _placement(Map<String, int> grades) {
    if (grades.isEmpty || (grades['wrist'] ?? 1) < 2) return 1;
    final average =
        grades.values.fold(0, (sum, value) => sum + value) / grades.length;
    return average >= 3
        ? 3
        : average >= 2
        ? 2
        : 1;
  }

  Future<bool> recordAssessment(Map<String, int> grades) {
    _ensureInitialized();
    if (!_validGrades(grades)) {
      throw ArgumentError('Assessment needs five self-reported grades in 1..4');
    }
    _assessmentGrades = Map.of(grades);
    _startStage = _placement(grades);
    return _persist();
  }

  Future<bool> skipAssessment() {
    _ensureInitialized();
    _assessmentGrades = {};
    _startStage = 1;
    return _persist();
  }

  void _notify() {
    if (!_disposed) notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
