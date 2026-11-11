import 'dart:async';
import 'dart:convert';

import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_coach_chat/ugk_coach_chat.dart';

import '../control/learning_store.dart';

/// Flare's 「我的计划」 remains the only durable writer of saved plans. Only
/// routines that carry a complete SDK plan are offered to the chat module;
/// hand-built legacy sets stay in Flare's own editor untouched.
class FlareCoachPlanStore extends CoachPlanStorageAdapter {
  FlareCoachPlanStore(this.store, {this.canSave});
  final LearningStore store;
  final bool Function()? canSave;

  static String revisionOf(TrainingRoutine routine) =>
      jsonEncode(routine.toJson());

  CoachSavedPlanSnapshot? snapshot(TrainingRoutine routine) {
    final plan = routine.sdkPlan;
    if (plan == null) return null;
    return CoachSavedPlanSnapshot(
      externalId: routine.id,
      title: routine.name,
      plan: plan,
      storageRevision: revisionOf(routine),
    );
  }

  @override
  Future<List<CoachSavedPlanSnapshot>> load() async => [
    for (final routine in store.routines) ?snapshot(routine),
  ];

  @override
  Stream<void> get changes => Stream.multi((listener) {
    void changed() => listener.add(null);
    store.addListener(changed);
    listener.onCancel = () => store.removeListener(changed);
  }, isBroadcast: true);

  @override
  Future<CoachPlanWriteResult> save(CoachPlanWriteRequest request) async {
    if (canSave?.call() == false) {
      return const CoachPlanWriteResult.failure(CoachPlanWriteStatus.failed);
    }
    final name = TrainingRoutine.truncateName(request.name.trim());
    try {
      if (request.mode == CoachPlanWriteMode.update) {
        final id = request.externalId;
        final existing = id == null ? null : store.routineById(id);
        if (existing == null) {
          return const CoachPlanWriteResult.failure(
            CoachPlanWriteStatus.deleted,
          );
        }
        if (request.expectedStorageRevision != null &&
            request.expectedStorageRevision != revisionOf(existing)) {
          return const CoachPlanWriteResult.failure(
            CoachPlanWriteStatus.conflict,
          );
        }
        final ok = await store.updateRoutine(
          existing.id,
          name: name.isEmpty ? existing.name : name,
          sdkPlan: request.plan,
        );
        if (!ok) {
          return const CoachPlanWriteResult.failure(
            CoachPlanWriteStatus.failed,
          );
        }
        return CoachPlanWriteResult.saved(
          snapshot(store.routineById(existing.id)!)!,
        );
      }
      final created = await store.createRoutine(
        name.isEmpty ? TrainingRoutine.truncateName(request.plan.title) : name,
        const [],
        source: 'ai',
        sdkPlan: request.plan,
      );
      if (created == null) {
        return const CoachPlanWriteResult.failure(CoachPlanWriteStatus.failed);
      }
      return CoachPlanWriteResult.saved(snapshot(created)!);
    } on Object catch (error) {
      return CoachPlanWriteResult.failure(
        CoachPlanWriteStatus.failed,
        error: error,
      );
    }
  }
}

/// SDK chat envelopes, archives and the last started plan. The previous
/// `flare.coach.v1` key (disclaimer only) is read, never overwritten.
class FlareCoachChatHistoryStore extends CoachChatHistoryStore {
  FlareCoachChatHistoryStore(this.store, {LocalStateStorage? storage})
    : _storage = storage ?? SharedPreferencesLocalStateStorage();
  static String envelopeKey(String namespace) =>
      'flare.coach.chat.v1:$namespace';
  static const archiveIndexKey = 'flare.coach.chat.archives.v1';
  static const lastPlanKey = 'flare.coach.last-plan.v1';
  final LearningStore store;
  final LocalStateStorage _storage;
  Future<void> _archiveTail = Future.value();

  @override
  Future<CoachChatSnapshot?> load(String namespace) async {
    final raw = await _storage.read(envelopeKey(namespace));
    return raw == null
        ? null
        : CoachChatSnapshot.fromJson(
            Map<String, Object?>.from(jsonDecode(raw) as Map),
          );
  }

  @override
  Future<void> write(String namespace, CoachChatSnapshot snapshot) =>
      _storage.write(envelopeKey(namespace), jsonEncode(snapshot.toJson()));

  /// Each archive has its own key; the index is published after its payload.
  Future<void> archive(CoachChatSnapshot snapshot) {
    final result = _archiveTail.then((_) async {
      final raw = await _storage.read(archiveIndexKey);
      final keys = raw == null
          ? <String>[]
          : (jsonDecode(raw) as List).cast<String>();
      var sequence = keys.length + 1;
      var key = '$archiveIndexKey:$sequence';
      while (await _storage.read(key) != null) {
        sequence++;
        key = '$archiveIndexKey:$sequence';
      }
      await _storage.write(key, jsonEncode(snapshot.toJson()));
      await _storage.write(archiveIndexKey, jsonEncode([...keys, key]));
    });
    _archiveTail = result.then<void>((_) {}, onError: (Object _) {});
    return result;
  }

  @override
  Future<CoachChatHistoryContext> readTrainingContext() async {
    final raw = await _storage.read(lastPlanKey);
    coach.TrainingPlan? last;
    if (raw != null) {
      try {
        last = const coach.PlanCodec().decodeStrict(jsonDecode(raw)).plan;
      } on Object {
        last = null;
      }
    }
    return CoachChatHistoryContext(
      lastPlan: last,
      history: [
        for (final result in store.trainerSessions)
          WorkoutLog(
            title: result.planTitle,
            at: result.startedAt,
            minutes:
                (result.endedAt.difference(result.startedAt).inSeconds / 60)
                    .round(),
            completed: result.items
                .where((item) => item.completedSets >= item.plannedSets)
                .length,
            total: result.items.length,
          ),
      ],
    );
  }

  @override
  Future<void> rememberStartedPlan(
    coach.TrainingPlan plan, {
    String? savedExternalId,
  }) => _storage.write(lastPlanKey, jsonEncode(plan.toJson()));
}

/// SDK safety acceptance plus Flare's own theme/sound settings. The earlier
/// Flare AI disclaimer counts as accepted; Flare's safety sheet still applies.
class FlareCoachChatPreferenceStore extends CoachChatPreferenceStore {
  FlareCoachChatPreferenceStore(this.store, {LocalStateStorage? storage})
    : _storage = storage ?? SharedPreferencesLocalStateStorage();
  static const storageKey = 'flare.coach.preferences.v1';
  static const legacyDisclaimerKey = 'flare.coach.v1';
  final LearningStore store;
  final LocalStateStorage _storage;
  final _changes = StreamController<void>.broadcast();
  Future<void>? _loading;
  bool _accepted = false, _blocked = false, _checking = false;

  Future<void> _read() async {
    try {
      final raw = await _storage.read(storageKey);
      if (raw != null) {
        final value = jsonDecode(raw) as Map;
        _accepted = value['safetyAccepted'] == true;
        _blocked = value['safetyBlocked'] == true;
        _checking = value['safetyChecking'] == true;
        return;
      }
      final legacy = await _storage.read(legacyDisclaimerKey);
      if (legacy != null) {
        _accepted = (jsonDecode(legacy) as Map)['disclaimerAccepted'] == true;
      }
    } on Object {
      _accepted = false;
    }
  }

  CoachChatPreferences get _value => CoachChatPreferences(
    safetyAccepted: _accepted,
    safetyBlocked: _blocked,
    safetyChecking: _checking,
    appearance: store.settings.themeMode,
    voice: store.settings.sound,
    chimes: store.settings.sound,
    enableUserMemory: false,
    starfield: false,
  );

  @override
  Future<CoachChatPreferences> load() async {
    await (_loading ??= _read());
    return _value;
  }

  @override
  Stream<CoachChatPreferences> get changes => Stream.multi((listener) {
    void changed() => listener.add(_value);
    store.addListener(changed);
    final subscription = _changes.stream.listen((_) => changed());
    listener.onCancel = () async {
      store.removeListener(changed);
      await subscription.cancel();
    };
  }, isBroadcast: true);

  @override
  Future<void> update(CoachChatPreferences preferences) async {
    await (_loading ??= _read());
    await _storage.write(
      storageKey,
      jsonEncode({
        'safetyAccepted': preferences.safetyAccepted,
        'safetyBlocked': preferences.safetyBlocked,
        'safetyChecking': preferences.safetyChecking,
      }),
    );
    _accepted = preferences.safetyAccepted;
    _blocked = preferences.safetyBlocked;
    _checking = preferences.safetyChecking;
    const modes = {'system', 'light', 'dark'};
    final sound = preferences.voice || preferences.chimes;
    if (sound != store.settings.sound ||
        (modes.contains(preferences.appearance) &&
            preferences.appearance != store.settings.themeMode)) {
      await store.updateSettings(
        sound: sound,
        themeMode: modes.contains(preferences.appearance)
            ? preferences.appearance
            : null,
      );
    }
    _changes.add(null);
  }

  Future<void> dispose() => _changes.close();
}
