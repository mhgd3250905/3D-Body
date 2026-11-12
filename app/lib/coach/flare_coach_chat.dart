import 'dart:async';
import 'dart:developer' as developer;

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_chat/ugk_coach_chat.dart';
import 'package:ugk_trainer_runtime/engine.dart'
    show SessionBuilderPlanExecutionTiming;

import '../control/flare_ai_consent.dart';
import '../control/learning_store.dart';
import '../control/flare_membership.dart';
import '../data/flare_action_scope.dart';
import '../data/flare_shared_library.dart';
import 'ai_tags.dart';
import 'coach_config.dart';
import 'flare_coach_chat_storage.dart';
import 'flare_coach_profile.dart';
import 'membership_gateway.dart';

/// App lifetime and host ports only. The SDK owns the sole conversation,
/// messages, questions, admission, safety and the chat UI.
class FlareCoachChat {
  FlareCoachChat({
    required this.store,
    CoachConfig? config,
    this.membership,
    this.gateway,
    this.storage,
    this.observer,
    this.replyDelay = const Duration(milliseconds: 450),
  }) : config =
           config ??
           (membership == null
               ? CoachConfig.fromEnvironment
               : const CoachConfig());

  final LearningStore store;
  final aiConsent = FlareAiConsent();
  final CoachConfig config;
  final FlareMembership? membership;
  final CoachGatewayBinding? gateway;
  final LocalStateStorage? storage;
  final CoachChatObserver? observer;
  final Duration replyDelay;
  CoachChatController? _controller;
  FlareCoachChatPreferenceStore? _preferences;
  Future<CoachChatController>? _loading;
  bool _closed = false;

  final gatewayNotice = ValueNotifier<GatewayNotice?>(null);

  void _notifyGateway(GatewayNotice notice) {
    if (_closed) return;
    if (notice.kind == GatewayRejection.premiumRequired) {
      membership?.rejectPremium();
    }
    // Clear before publishing so repeated equal notices still reach the UI.
    gatewayNotice.value = null;
    gatewayNotice.value = notice;
  }

  bool get configured =>
      gateway != null ||
      (membership != null
          ? MembershipGateway.baseUrl != null
          : config.configured);
  CoachChatController? get controllerOrNull => _controller;
  CoachChatController get controller =>
      _controller ?? (throw StateError('Open the coach first'));

  static uc.OpenAiCompatibleClient createClient(
    CoachConfig c, {
    http.Client? httpClient,
  }) => uc.OpenAiCompatibleClient(
    config: uc.LlmConfig.deepSeekOpenCsg.copyWith(
      baseUrl: c.baseUrl,
      model: c.model,
      jsonMode: false,
      maxRetries: 0,
    ),
    httpClient: httpClient,
    auth: c.usesRelay
        ? uc.RelayAuth(appToken: () async => c.relayToken)
        : uc.ApiKeyAuth(c.apiKey),
  );

  uc.OpenAiCompatibleClient _createRuntimeClient() {
    final member = membership;
    if (member == null) {
      return createClient(config, httpClient: _ConsentClient(aiConsent));
    }
    final baseUrl = MembershipGateway.baseUrl;
    if (baseUrl == null) throw StateError('AI gateway is not configured');
    return uc.OpenAiCompatibleClient(
      config: uc.LlmConfig.deepSeekOpenCsg.copyWith(
        baseUrl: baseUrl,
        model: 'flare',
        jsonMode: false,
        maxRetries: 0,
      ),
      httpClient: MembershipGateway(
        readUserId: () => member.activeAppUserId,
        readConsent: aiConsent.read,
        onNotice: _notifyGateway,
      ),
    );
  }

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
                  final client = _createRuntimeClient();
                  return CoachClientLease.owned(client, release: client.close);
                },
              ),
          plans: FlareCoachPlanStore(
            store,
            canSave: () {
              if (membership?.isPremium ?? true) return true;
              _notifyGateway((
                kind: GatewayRejection.premiumRequired,
                limit: null,
              ));
              return false;
            },
          ),
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
    aiConsent.dispose();
    await _controller?.close();
    await _preferences?.dispose();
    gatewayNotice.dispose();
  }
}

/// The optional local/development transport is subject to the same consent.
class _ConsentClient extends http.BaseClient {
  _ConsentClient(this.consent);

  final FlareAiConsent consent;
  final http.Client _client = http.Client();

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    if (!await consent.read()) {
      throw http.ClientException('AI data sharing consent is required.');
    }
    return _client.send(request);
  }

  @override
  void close() {
    _client.close();
    super.close();
  }
}
