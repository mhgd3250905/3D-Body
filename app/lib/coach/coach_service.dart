import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../data/catalog.dart';
import '../data/local_state_storage.dart';
import 'coach_config.dart';
import 'template_fallback.dart';
import 'usage_store.dart';

typedef AssetReader = Future<String> Function(String path);

/// FlareLab 的 AI 训练助理：SDK（ugk_coach）+ App 的目录交集、预设回落、记账、免责标记。
///
/// - 目录：随包 `assets/coach/catalog.json`（Pose-Hub 目录的 flarelab 范围快照），
///   配了 `UGK_COACH_CATALOG_URL` 时可远端更新（SDK 校验大小 / sha256 / 版本后才切换）。
/// - 范围：profile 白名单 ∩ App 里真有动作和示范视频的 id；不在交集里的 id 写进
///   profile.select.exclude，Agent 动作目录和门禁都会排除。
class CoachService {
  CoachService({
    this.config = CoachConfig.fromEnvironment,
    required this.appCatalog,
    uc.LlmClient? client,
    CoachUsageStore? usage,
    LocalStateStorage? storage,
    AssetReader? readAsset,
    this.maxRequestRetries = 4,
    this.retryBaseDelay = const Duration(seconds: 1),
  }) : _client = client ?? _clientFor(config),
       usage = usage ?? CoachUsageStore.device(),
       _storage = storage ?? SharedPreferencesLocalStateStorage(),
       _read = readAsset ?? rootBundle.loadString;

  static const catalogAsset = 'assets/coach/catalog.json';
  static const profileAsset = 'assets/coach/flarelab.json';
  static const mediaAsset = 'assets/data/drill-media-manifest.json';
  static const storageKey = 'flare.coach.v1';

  final CoachConfig config;
  final int maxRequestRetries;
  final Duration retryBaseDelay;
  final Catalog appCatalog;
  final CoachUsageStore usage;

  final uc.LlmClient? _client;
  final LocalStateStorage _storage;
  final AssetReader _read;

  late final uc.CatalogRepository _repo;
  late final uc.CoachProfile _baseProfile;
  late uc.CoachProfile _profile;
  late uc.Catalog _trustedCatalog;
  late final TemplateFallback _templates = TemplateFallback(
    appCatalog,
    cautionsOf: (id) => _active?[id]?.cautions ?? const [],
    equipmentOf: (id) => _active?[id]?.equipment ?? const [],
  );
  uc.CoachAgent? _agent;
  uc.CoachConversationController? _conversation;

  /// SDK owns all conversation messages, questions and Agent lifecycle.
  uc.CoachConversationController? get conversation => _conversation;

  /// 当前会话使用固定目录快照；远端更新在明确开始新对话时生效。
  uc.Catalog? _active;
  late Map<String, Object?> _profileJson;
  late Set<String> _usable;
  Future<void>? _loading;
  bool _disclaimerAccepted = false;
  bool _disposed = false;
  Future<void>? _disposal;
  Set<String> _excluded = const {};

  static uc.LlmClient? _clientFor(CoachConfig c) {
    if (!c.configured) return null;
    return uc.OpenAiCompatibleClient(
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
  }

  /// Whether a model client is available; false hides AI entry points.
  bool get configured => _client != null;
  bool get disclaimerAccepted => _disclaimerAccepted;

  /// 因 App 缺动作 / 视频而排除出 AI 范围的 id。
  Set<String> get excludedIds {
    _syncCatalog();
    return _excluded;
  }

  uc.CoachProfile get profile {
    _syncCatalog();
    return _profile;
  }

  uc.Catalog get catalog {
    _syncCatalog();
    return _active!;
  }

  Future<void> load() => _disposed ? Future.value() : _loading ??= _load();

  Future<void> _load() async {
    final texts = await Future.wait([_read(profileAsset), _read(mediaAsset)]);
    final media = (jsonDecode(texts[1]) as Map)['actions'] as Map;
    _usable = {
      for (final id in media.keys)
        if (appCatalog.drillById('$id') != null) '$id',
    };
    final manifest = config.catalogManifestUrl;
    _repo = uc.CatalogRepository(
      bundled: uc.BundledCatalogSource(() => _read(catalogAsset)),
      remote: manifest.isEmpty
          ? null
          : uc.RemoteCatalogSource(manifestUrl: Uri.parse(manifest)),
    );
    await _repo.load();
    if (_disposed) return;
    _profileJson = Map<String, Object?>.from(jsonDecode(texts[0]) as Map);
    _baseProfile = uc.CoachProfile.fromJson(_profileJson);
    _syncCatalog();
    await usage.load();
    try {
      final raw = await _storage.read(storageKey);
      if (raw != null) {
        _disclaimerAccepted =
            (jsonDecode(raw) as Map)['disclaimerAccepted'] == true;
      }
    } on Object {
      _disclaimerAccepted = false;
    }
    // 远端目录：后台检查一次，失败保持随包目录。
    if (manifest.isNotEmpty) {
      unawaited(_repo.refresh().then((_) {}, onError: (_) {}));
    }
  }

  /// 目录（随包或远端热更新）与 App 资产的交集：profile 范围里 App 没有动作 / 视频的 id
  /// 写进 select.exclude，Agent 的目录同时只包含这份交集。进行中的会话保持快照。
  /// 远端新增 / 改到 flarelab 范围的 id 若 App 没有，也会被排除，不会进提示词或通过校验。
  void _syncCatalog() {
    final current = _repo.current;
    if (identical(current, _active)) return;
    // A conversation uses one admitted catalog/profile snapshot. A background
    // refresh must not erase history or the ask_user question budget.
    if (_conversation case final conversation?) {
      if (conversation.state.isWaiting ||
          conversation.state.messages.isNotEmpty ||
          conversation.agent.isBusy ||
          conversation.agent.turnCount > 0) {
        return;
      }
    }
    final scope = _baseProfile.scope(current).toList();
    final excluded = {
      for (final d in scope)
        if (!_usable.contains(d.id)) d.id,
    };
    final json = Map<String, Object?>.from(_profileJson);
    if (excluded.isNotEmpty) {
      final select = Map<String, Object?>.from(json['select'] as Map);
      select['exclude'] = [
        ...((select['exclude'] as List?) ?? const []),
        ...excluded,
      ];
      json['select'] = select;
    }
    _active = current;
    _excluded = Set.unmodifiable(excluded);
    _profile = uc.CoachProfile.fromJson(json);
    _trustedCatalog = uc.Catalog(
      version: current.version,
      formatVersion: current.formatVersion,
      generatedAt: current.generatedAt,
      sourceCommit: current.sourceCommit,
      taxonomy: current.taxonomy,
      problems: current.problems,
      drills: [
        for (final drill in scope)
          if (_usable.contains(drill.id)) drill,
      ],
    );
    final client = _client;
    if (_conversation == null && client != null) {
      _agent = uc.CoachAgent(
        client: client,
        catalog: () => _trustedCatalog,
        // Keep the same Agent through explicit new conversations. Its original
        // profile rules apply to the current App-filtered catalog snapshot.
        profile: _baseProfile,
        usage: usage,
        appId: 'flarelab-app',
        // Device memory was not part of the previous opt-in. Retain chat history
        // in this session without introducing cross-session personal memory.
        enableUserMemory: false,
        maxRequestRetries: maxRequestRetries,
        retryBaseDelay: retryBaseDelay,
        fallback: (r) {
          final reply = _templates.reply(
            r.userText,
            reason: PresetReason.of(r.reason),
            tier: _tier,
            history: _userTexts,
          );
          return uc.SessionFallbackReply(reply.text, plan: reply.plan);
        },
      );
      _conversation = uc.CoachConversationController(agent: _agent!);
    }
  }

  String _tier = 'A';

  Future<void> acceptDisclaimer() async {
    _disclaimerAccepted = true;
    try {
      await _storage.write(
        storageKey,
        jsonEncode({'disclaimerAccepted': true}),
      );
    } on Object {
      // 写不进去下次再提示一次即可。
    }
  }

  List<String> get _userTexts => [
    for (final message
        in _conversation?.state.messages ??
            const <uc.CoachConversationMessage>[])
      if (message.isUser) message.text,
  ];

  Future<uc.CoachTurnResult?> send(
    String text, {
    String tier = 'A',
    uc.CancelToken? cancel,
  }) {
    if (_disposed) return Future.value();
    final conversation = _conversation;
    if (conversation == null) {
      return load().then(
        (_) => _conversation == null
            ? null
            : send(text, tier: tier, cancel: cancel),
      );
    }
    return _submit(
      conversation,
      text,
      tier: tier,
      cancel: cancel,
      submit: (context) =>
          conversation.send(text, context: context, cancel: cancel),
    );
  }

  Future<uc.CoachTurnResult?> answerText(
    String questionId,
    String text, {
    String tier = 'A',
  }) {
    if (_disposed) return Future.value();
    final conversation = _conversation;
    if (conversation == null) {
      return load().then(
        (_) => _conversation == null
            ? null
            : answerText(questionId, text, tier: tier),
      );
    }
    if (!conversation.canAnswer(questionId)) return Future.value();
    return _submit(
      conversation,
      text,
      tier: tier,
      submit: (context) =>
          conversation.answerText(questionId, text, context: context),
    );
  }

  Future<uc.CoachTurnResult?> answerChoices(
    String questionId,
    List<String> choices, {
    String tier = 'A',
  }) {
    if (_disposed) return Future.value();
    final conversation = _conversation;
    if (conversation == null) {
      return load().then(
        (_) => _conversation == null
            ? null
            : answerChoices(questionId, choices, tier: tier),
      );
    }
    // Use the SDK's exact validated ordering to derive App context as well.
    final text = conversation.choiceText(questionId, choices);
    if (text == null) return Future.value();
    return _submit(
      conversation,
      text,
      tier: tier,
      submit: (context) =>
          conversation.answerChoices(questionId, choices, context: context),
    );
  }

  Future<uc.CoachTurnResult?> _submit(
    uc.CoachConversationController conversation,
    String raw, {
    required String tier,
    required Future<uc.CoachTurnResult?> Function(uc.CoachContext) submit,
    uc.CancelToken? cancel,
  }) {
    final text = raw.trim();
    if (_disposed || text.isEmpty || conversation.state.isWaiting) {
      return Future.value();
    }
    if (cancel?.isCancelled ?? false) {
      conversation.cancel();
      return Future.value();
    }
    _syncCatalog();
    _tier = tier;
    final history = _userTexts;
    if (TemplateFallback.anyRedFlag(text, history)) {
      return Future.value(_safetyCommand(conversation, text));
    }
    return submit(_contextFor(text, tier, history));
  }

  /// App-owned safety command: never send red-flag requests to the model.
  /// Display history remains exclusively in the SDK controller.
  uc.CoachTurnResult _safetyCommand(
    uc.CoachConversationController conversation,
    String text,
  ) {
    conversation.invalidateQuestion();
    final at = DateTime.now();
    final id =
        'local-safety-${at.microsecondsSinceEpoch}-${conversation.state.messages.length}';
    conversation.restoreHistory([
      ...conversation.state.messages,
      uc.CoachConversationMessage(
        id: '$id-user',
        at: at,
        isUser: true,
        text: text,
      ),
      uc.CoachConversationMessage(
        id: id,
        at: at,
        text: TemplateFallback.redFlagReply,
        turnId: id,
      ),
    ]);
    return uc.CoachTurnResult(
      turnId: id,
      status: uc.TurnStatus.fallback,
      text: TemplateFallback.redFlagReply,
    );
  }

  uc.CoachContext _contextFor(String text, String tier, List<String> history) {
    final chosenTier = TemplateFallback.pickTier(text, tier, history: history);
    final allText = [...history, text];
    Set<String>? equipment;
    const namedEquipment = {
      '哑铃': 'dumbbell',
      '弹力带': 'band',
      '壶铃': 'kettlebell',
      '瑞士球': 'swiss-ball',
      '泡沫轴': 'foam-roller',
    };
    for (final value in allText) {
      for (final clause in value.split(
        RegExp(r'[，,。.；;！!？?\n]|但是|但|不过|(?=只有|只用|仅有|仅用)'),
      )) {
        if (RegExp(r'徒手|(没有|没|无|不用|不要)(任何)?(器械|器材|装备)|空手').hasMatch(clause)) {
          equipment = <String>{};
          continue;
        }
        if (RegExp(r'只有|只用|仅有|仅用').hasMatch(clause)) {
          equipment = <String>{};
        }
        final excluded = RegExp(r'没有|没带|不要|不用|缺少|无|别用').hasMatch(clause);
        for (final item in namedEquipment.entries) {
          if (!clause.contains(item.key)) continue;
          if (excluded) {
            equipment?.remove(item.value);
          } else {
            (equipment ??= <String>{}).add(item.value);
          }
        }
      }
    }
    return uc.CoachContext(
      scene: chosenTier == 'C' ? 'gym' : 'home',
      avoid: TemplateFallback.protectedParts(text, history),
      equipment: equipment,
      notes: ['计划页场景：${TemplateFallback.tierLabel(chosenTier)}。'],
    );
  }

  /// Called only for an explicit new chat, never between clarification turns.
  void newConversation() {
    if (_disposed) return;
    _conversation?.newConversation();
    if (_active != null) _syncCatalog();
  }

  /// Restores only presentation data, after admission with the current App gate.
  /// The SDK closes every historical question and resets the same Agent.
  void restoreHistory(List<uc.CoachConversationMessage> messages) {
    final conversation = _conversation;
    if (_disposed || conversation == null) return;
    final gate = uc.ToolGate(catalog: catalog, profile: profile);
    final admitted = <uc.CoachConversationMessage>[];
    for (final message in messages) {
      final storedPlan = message.plan;
      final plan = storedPlan == null
          ? null
          : gate.admitTemplate(storedPlan.plan);
      if (storedPlan != null && plan == null) {
        throw StateError('Stored plan is outside the current App gate');
      }
      uc.ValidatedActions? actions;
      if (message.actions case final storedActions?) {
        final checked = gate.check('', [
          uc.LlmToolCall(
            id: 'restore-${message.id}',
            name: uc.CoachTools.showActions,
            arguments: jsonEncode({
              'items': [
                for (final item in storedActions.items)
                  {
                    'actionId': item.id,
                    if (item.note != null) 'note': item.note,
                  },
              ],
            }),
          ),
        ]);
        if (!checked.ok || checked.actions == null) {
          throw StateError('Stored actions are outside the current App gate');
        }
        actions = checked.actions;
      }
      admitted.add(
        uc.CoachConversationMessage(
          id: message.id,
          at: message.at,
          isUser: message.isUser,
          text: message.text,
          question: message.question,
          questionAnswered: message.questionAnswered,
          answeredChoices: message.answeredChoices,
          plan: plan,
          actions: actions,
          turnId: message.turnId,
        ),
      );
    }
    conversation.restoreHistory(admitted);
  }

  Future<void> dispose() => _disposal ??= _dispose();

  Future<void> _dispose() async {
    _disposed = true;
    try {
      if (_loading case final loading?) await loading;
    } finally {
      try {
        await _conversation?.dispose();
      } finally {
        if (_client case final uc.OpenAiCompatibleClient client) client.close();
      }
    }
  }

  @visibleForTesting
  uc.CoachAgent? get agent => _agent;

  @visibleForTesting
  uc.ValidationReport validatePlan(uc.TrainingPlan plan) {
    _syncCatalog();
    return uc.PlanValidator(
      catalog: _active!,
      profile: _profile,
    ).validate(plan);
  }

  /// 测试用：模拟远端目录切换（`_repo.replace`）。
  @visibleForTesting
  uc.CatalogRepository get catalogRepository => _repo;
}
