import 'dart:async';
import 'dart:developer' as developer;

import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_chat/ugk_coach_chat.dart';
import 'package:ugk_trainer_runtime/engine.dart'
    show SessionBuilderPlanExecutionTiming;

import '../control/learning_store.dart';
import '../data/flare_action_scope.dart';
import '../data/flare_shared_library.dart';
import 'ai_tags.dart';
import 'coach_config.dart';
import 'flare_coach_chat_storage.dart';
import 'flare_coach_profile.dart';

/// App lifetime and host ports only. The SDK owns the sole conversation,
/// messages, questions, admission, safety and the chat UI.
class FlareCoachChat {
  FlareCoachChat({
    required this.store,
    this.config = CoachConfig.fromEnvironment,
    this.gateway,
    this.storage,
    this.observer,
    this.replyDelay = const Duration(milliseconds: 450),
  });

  final LearningStore store;
  final CoachConfig config;
  final CoachGatewayBinding? gateway;
  final LocalStateStorage? storage;
  final CoachChatObserver? observer;
  final Duration replyDelay;
  CoachChatController? _controller;
  FlareCoachChatPreferenceStore? _preferences;
  Future<CoachChatController>? _loading;
  bool _closed = false;

  /// Without a Key/token every AI entry stays hidden and no client exists.
  bool get configured => gateway != null || config.configured;
  CoachChatController? get controllerOrNull => _controller;
  CoachChatController get controller =>
      _controller ?? (throw StateError('Open the coach first'));

  static uc.OpenAiCompatibleClient createClient(CoachConfig c) =>
      uc.OpenAiCompatibleClient(
        config: uc.LlmConfig.deepSeekOpenCsg.copyWith(
          baseUrl: c.baseUrl,
          model: c.model,
          jsonMode: false,
          maxRetries: 0,
        ),
        auth: c.usesRelay
            ? uc.RelayAuth(appToken: () async => c.relayToken)
            : uc.ApiKeyAuth(c.apiKey),
      );

  Future<CoachChatController> load({required CoachChatHostActions actions}) {
    if (_closed) return Future.error(StateError('Coach host is closed'));
    return _loading ??= _load(actions);
  }

  Future<CoachChatController> _load(CoachChatHostActions actions) async {
    try {
      final shared = FlareShared.current ?? await FlareShared.load();
      FlareShared.current ??= shared;
      if (_closed) throw StateError('Coach host is closed');
      final builder = shared.sessionBuilder();
      final appAiTags = await loadAppAiTags();
      final profile = flareCoachAppProfile(
        shared: shared,
        executionTiming: builder.executionTiming,
        appAiTags: appAiTags,
      );
      final history = FlareCoachChatHistoryStore(store, storage: storage);
      final preferences = FlareCoachChatPreferenceStore(
        store,
        storage: storage,
      );
      final chat = CoachChatController(
        profile: profile,
        catalog: shared.catalog,
        replyDelay: replyDelay,
        bindings: CoachChatBindings(
          storageNamespace: flareAppId,
          gateway:
              gateway ??
              CoachGatewayBinding(
                create: () {
                  final client = createClient(config);
                  return CoachClientLease.owned(client, release: client.close);
                },
              ),
          plans: FlareCoachPlanStore(store),
          history: history,
          preferences: preferences,
          actions: actions,
          observer: (event, detail) {
            observer?.call(event, detail);
            developer.log(event, name: 'flare.coach');
          },
          beforeNewConversation: history.archive,
        ),
      );
      _preferences = preferences;
      _controller = chat;
      if (_closed) {
        await chat.close();
        throw StateError('Coach host is closed');
      }
      final result = await chat.start();
      if (!result.ok) throw StateError('SDK coach restoration failed');
      return chat;
    } on Object {
      await _controller?.close();
      unawaited(_preferences?.dispose());
      _controller = null;
      _preferences = null;
      _loading = null;
      rethrow;
    }
  }

  void requestCompose() => _controller?.requestCompose();

  Future<void> close() async {
    _closed = true;
    await _controller?.close();
    await _preferences?.dispose();
  }
}
