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

/// 一轮问答在 App 里的结果。
class CoachAnswer {
  const CoachAnswer({
    this.reply,
    this.presetReason,
    this.cancelled = false,
    this.rewritten = false,
    this.tokens = 0,
    this.turnId,
    this.question,
    this.actions,
    this.limitReached = false,
  });

  /// 给用户的回复（取消时为 null）。
  final uc.CoachReply? reply;

  /// 非 null = 这是 App 内置预设方案（或离线安全提示），不是 AI 定制。
  final PresetReason? presetReason;
  final bool cancelled;

  /// 第一次输出没过校验、重写后通过。
  final bool rewritten;
  final int tokens;
  final String? turnId;
  final uc.AskUserQuestion? question;
  final uc.ValidatedActions? actions;
  final bool limitReached;

  bool get preset => presetReason != null;
}

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
  late uc.CoachProfile _profile;
  late final TemplateFallback _templates = TemplateFallback(
    appCatalog,
    cautionsOf: (id) => _active?[id]?.cautions ?? const [],
    equipmentOf: (id) => _active?[id]?.equipment ?? const [],
  );
  uc.CoachAgent? _agent;
  uc.CoachConversation? _conversation;
  uc.CoachContext _context = const uc.CoachContext();

  /// 当前会话使用固定目录快照；远端更新在明确开始新对话时生效。
  uc.Catalog? _active;
  late Map<String, Object?> _profileJson;
  late Set<String> _usable;
  Future<void>? _loading;
  bool _disclaimerAccepted = false;
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

  Future<void> load() => _loading ??= _load();

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
    _profileJson = Map<String, Object?>.from(jsonDecode(texts[0]) as Map);
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
  /// 写进 select.exclude，新会话按这份目录创建 Agent。进行中的会话保持快照。
  /// 远端新增 / 改到 flarelab 范围的 id 若 App 没有，也会被排除，不会进提示词或通过校验。
  void _syncCatalog() {
    final current = _repo.current;
    if (identical(current, _active)) return;
    // A conversation uses one admitted catalog/profile snapshot. A background
    // refresh must not erase history or the ask_user question budget.
    if (_agent != null && (_agent!.isBusy || _agent!.turnCount > 0)) return;
    final scope = uc.CoachProfile.fromJson(_profileJson).scope(current);
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
    _excluded = excluded;
    _profile = uc.CoachProfile.fromJson(json);
    final previous = _agent;
    if (previous != null) unawaited(previous.dispose());
    if (_client case final client?) {
      _agent = uc.CoachAgent(
        client: client,
        catalog: () => current,
        profile: _profile,
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
            history: _conversation == null
                ? const []
                : TemplateFallback.userTexts(_conversation!),
          );
          return uc.SessionFallbackReply(reply.text, plan: reply.plan);
        },
      );
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

  /// Ask one turn using the same Agent across all clarification answers.
  /// The legacy conversation is an App fallback ledger, not the model protocol.
  Future<CoachAnswer> ask(
    String text,
    uc.CoachConversation conversation, {
    uc.CancelToken? cancel,
    String tier = 'A',
    ValueChanged<uc.AgentEvent>? onProgress,
  }) async {
    await load();
    if (cancel?.isCancelled ?? false) {
      return const CoachAnswer(cancelled: true);
    }
    if (_agent?.isBusy ?? false) return const CoachAnswer(cancelled: true);
    if (_conversation != null && !identical(_conversation, conversation)) {
      _agent?.reset();
      _context = const uc.CoachContext();
    }
    _conversation = conversation;
    _syncCatalog();
    _tier = tier;
    final history = TemplateFallback.userTexts(conversation);
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
    final previousContext = _context;
    _context = _context.copyWith(
      scene: chosenTier == 'C' ? 'gym' : 'home',
      avoid: {
        ..._context.avoid,
        ...TemplateFallback.protectedParts(text, history),
      },
      equipment: equipment,
      notes: ['计划页场景：${TemplateFallback.tierLabel(chosenTier)}。'],
    );
    final agent = _agent;
    if (agent == null || TemplateFallback.anyRedFlag(text, history)) {
      final reply = _templates.reply(
        text,
        reason: agent == null
            ? PresetReason.notConfigured
            : PresetReason.unavailable,
        tier: tier,
        history: history,
      );
      _record(conversation, text, reply);
      return CoachAnswer(
        reply: reply,
        presetReason: agent == null
            ? PresetReason.notConfigured
            : PresetReason.unavailable,
      );
    }
    final subscription = onProgress == null
        ? null
        : agent.events.listen(onProgress);
    late final uc.CoachTurnResult result;
    try {
      result = await agent.send(text, context: _context, cancel: cancel);
    } finally {
      if (subscription != null) unawaited(subscription.cancel());
    }
    final tokens = result.usage.promptTokens + result.usage.completionTokens;
    if (result.status == uc.TurnStatus.cancelled) {
      _context = previousContext;
      return CoachAnswer(cancelled: true, tokens: tokens);
    }
    if (result.status == uc.TurnStatus.busy) {
      return const CoachAnswer(cancelled: true);
    }
    final question = result.question;
    final plan = result.plan?.plan;
    final reply = switch (result.status) {
      uc.TurnStatus.limitReached => const uc.CoachReply.text(
        '本次对话已达到上限。请点击“新对话”继续，已保存的计划会保留。',
      ),
      uc.TurnStatus.inputTooLong => const uc.CoachReply.text(
        '这条消息太长了，请缩短后再发送。',
      ),
      uc.TurnStatus.error => const uc.CoachReply.text('暂时没能排出合格的计划，请稍后再试。'),
      _ =>
        question != null
            ? uc.CoachReply.ask(question.question, question.options)
            : plan != null
            ? uc.CoachReply.plan(result.text, plan)
            : uc.CoachReply.text(result.text),
    };
    _record(conversation, text, reply);
    return CoachAnswer(
      reply: reply,
      turnId: result.turnId,
      question: question,
      actions: result.actions,
      limitReached: result.status == uc.TurnStatus.limitReached,
      rewritten: result.resubmits > 0,
      presetReason: result.status == uc.TurnStatus.fallback
          ? PresetReason.of(result.fallbackReason!)
          : null,
      tokens: tokens,
    );
  }

  void _record(
    uc.CoachConversation conversation,
    String text,
    uc.CoachReply reply,
  ) {
    final now = DateTime.now();
    conversation
      ..addUser(text.trim(), now)
      ..addAssistant(reply, now);
  }

  /// Called only for an explicit new chat, never between clarification turns.
  void resetConversation() {
    _agent?.reset();
    _conversation = null;
    _context = const uc.CoachContext();
    _syncCatalog();
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
