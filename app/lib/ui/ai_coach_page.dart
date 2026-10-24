import 'dart:async';

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;

import '../coach/coach_service.dart';
import '../coach/coach_ui_mapping.dart';
import '../coach/plan_mapping.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'app_glass.dart';
import 'coach_question_bubble.dart';
import 'coach_ui_theme.dart';
import 'motion.dart';
import 'plans_page.dart' show DrillPoster;
import 'theme.dart';

/// AI 定制只做中文（模型、目录文案都是中文），其他语言界面不显示入口。
bool aiCoachAvailable(BuildContext context) =>
    Localizations.localeOf(context).languageCode == 'zh';

/// App presentation state: progress, composer recovery and plan persistence.
/// Messages, questions and the Agent lifecycle belong to the SDK controller.
class AiCoachSession extends ChangeNotifier {
  AiCoachSession(this.service, {DateTime Function()? now})
    : _now = now ?? DateTime.now,
      createdAt = (now ?? DateTime.now)();

  final CoachService service;
  final DateTime Function() _now;
  final DateTime createdAt;
  uc.CoachConversationController? get controller => service.conversation;
  List<uc.CoachConversationMessage> get messages =>
      controller?.state.messages ?? const [];
  bool get busy => controller?.state.isWaiting ?? false;
  bool get loaded => _loaded;
  bool get showDisclaimer => _loaded && !service.disclaimerAccepted;
  DateTime? get startedAt => _pendingInput?.at;
  String? get pendingText => busy ? _pendingInput?.text : null;

  final Map<String, String> saved = {};
  final Map<String, String> pendingSaved = {};
  final Set<String> _presetTurns = {};
  StreamSubscription<uc.AgentEvent>? _events;
  Future<void>? _loading;
  _PendingInput? _pendingInput;
  bool _loaded = false;
  bool _disposed = false;
  bool _presented = true;
  int generation = 0;
  uc.AgentEvent? progress;
  String? cancelledText;
  String? notice;

  Future<void> load() => _loading ??= _load();

  Future<void> _load() async {
    await service.load();
    if (_disposed) return;
    controller?.addListener(_changed);
    _events = controller?.events.listen((event) {
      progress = event;
      _notify();
    });
    _loaded = true;
    _notify();
  }

  void _changed() {
    if (!_presented) controller?.invalidateQuestion();
    _notify();
  }

  void openPresentation() => _presented = true;
  void closePresentation() {
    _presented = false;
    controller?.invalidateQuestion();
  }

  Future<void> acceptDisclaimer() async {
    await service.acceptDisclaimer();
    _notify();
  }

  Future<void> send(String text, {required String tier}) async {
    await load();
    await _submit(text, () => service.send(text, tier: tier));
  }

  Future<void> answerText(
    String id,
    String text, {
    required String tier,
  }) async {
    await _submit(text, () => service.answerText(id, text, tier: tier));
  }

  Future<void> answerChoices(
    String id,
    List<String> choices, {
    required String tier,
  }) async {
    final text = controller?.choiceText(id, choices);
    if (text == null) return;
    await _submit(text, () => service.answerChoices(id, choices, tier: tier));
  }

  Future<void> _submit(
    String raw,
    Future<uc.CoachTurnResult?> Function() submit,
  ) async {
    if (_disposed || raw.trim().isEmpty || busy) return;
    final input = _PendingInput(raw.trim(), _now());
    _pendingInput = input;
    progress = null;
    notice = null;
    try {
      final result = await submit();
      if (_disposed || !identical(_pendingInput, input)) return;
      if (result != null) {
        if (result.status == uc.TurnStatus.fallback) {
          _presetTurns.add(result.turnId);
        }
        notice = switch (result.status) {
          uc.TurnStatus.limitReached => '本次对话已达到上限。请点击“新对话”继续，已保存的计划会保留。',
          uc.TurnStatus.inputTooLong => '这条消息太长了，请缩短后再发送。',
          uc.TurnStatus.error => '暂时没能排出合格的计划，请稍后再试。',
          _ => null,
        };
      }
    } on Object {
      if (!_disposed && identical(_pendingInput, input)) {
        notice = '出了点问题，没能排出计划。请稍后再试。';
      }
    } finally {
      if (identical(_pendingInput, input)) {
        _pendingInput = null;
        _notify();
      }
    }
  }

  bool isPreset(uc.CoachConversationMessage message) =>
      message.plan?.plan.source == 'template' ||
      _presetTurns.contains(message.turnId);

  void newConversation() {
    if (busy) return;
    service.newConversation();
    _pendingInput = null;
    saved.clear();
    pendingSaved.clear();
    _presetTurns.clear();
    generation++;
    cancelledText = null;
    notice = null;
    _notify();
  }

  void stop() {
    cancelledText = _pendingInput?.text;
    _pendingInput = null;
    controller?.cancel();
  }

  void markPendingSave(String resultId, String routineId) {
    pendingSaved[resultId] = routineId;
    _notify();
  }

  void markSaved(String resultId, String routineId) {
    pendingSaved.remove(resultId);
    saved[resultId] = routineId;
    _notify();
  }

  bool isSaved(String resultId, LearningStore store) {
    final id = saved[resultId];
    return id != null && store.routineById(id) != null;
  }

  void _notify() {
    if (!_disposed) notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    controller?.removeListener(_changed);
    unawaited(_events?.cancel());
    unawaited(service.dispose());
    super.dispose();
  }
}

/// Only the uncommitted composer bubble; never a second conversation history.
class _PendingInput {
  const _PendingInput(this.text, this.at);
  final String text;
  final DateTime at;
}

class AiCoachPage extends StatefulWidget {
  const AiCoachPage({
    super.key,
    required this.session,
    required this.catalog,
    required this.store,
    required this.onBack,
    required this.onStart,
    required this.onDrill,
  });

  final AiCoachSession session;
  final Catalog catalog;
  final LearningStore store;
  final VoidCallback onBack;
  final ValueChanged<uc.TrainingPlan> onStart;
  final ValueChanged<Drill> onDrill;

  static const examples = ['在家 20 分钟，练支撑臂', '健身房 30 分钟，核心和腿', '手腕有点不舒服，先做热身'];

  @override
  State<AiCoachPage> createState() => _AiCoachPageState();
}

class _AiCoachPageState extends State<AiCoachPage> {
  final _input = TextEditingController();
  final _scroll = ScrollController();
  late final Set<String> _initiallySeen;
  Timer? _ticker;
  final _saving = <String>{};

  /// 本次等待已过的秒数（按 1 秒节拍累加）。
  int _elapsed = 0;

  AiCoachSession get session => widget.session;

  @override
  void initState() {
    super.initState();
    session.openPresentation();
    _initiallySeen = {for (final message in session.messages) message.id};
    session.addListener(_changed);
    if (!session.loaded) unawaited(session.load());
    if (session.busy) _startTicker();
  }

  @override
  void didUpdateWidget(covariant AiCoachPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!identical(oldWidget.session, widget.session)) {
      oldWidget.session.removeListener(_changed);
      oldWidget.session.closePresentation();
      widget.session.openPresentation();
      widget.session.addListener(_changed);
    }
  }

  @override
  void dispose() {
    session.removeListener(_changed);
    session.closePresentation();
    _ticker?.cancel();
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  void _changed() {
    if (!mounted) return;
    if (session.busy) {
      _startTicker();
    } else {
      _ticker?.cancel();
      _ticker = null;
      // 停止后把原话放回输入框，方便改了再发。
      if (session.cancelledText case final text?) {
        session.cancelledText = null;
        if (_input.text.isEmpty) _input.text = text;
      }
    }
    setState(() {});
    WidgetsBinding.instance.addPostFrameCallback((_) => _toEnd());
  }

  void _startTicker() {
    if (_ticker != null) return;
    final started = session.startedAt;
    _elapsed = started == null
        ? 0
        : DateTime.now().difference(started).inSeconds.clamp(0, 999);
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _elapsed++);
    });
  }

  void _toEnd() {
    if (!_scroll.hasClients) return;
    _scroll.animateTo(
      _scroll.position.minScrollExtent,
      duration: FlareMotion.of(context, const Duration(milliseconds: 260)),
      curve: Curves.easeOutCubic,
    );
  }

  void _send([String? text]) {
    final value = (text ?? _input.text).trim();
    if (value.isEmpty || session.busy) return;
    FlareHaptics.light();
    _input.clear();
    FocusScope.of(context).unfocus();
    unawaited(session.send(value, tier: widget.store.settings.tier));
  }

  List<String> get _suggestions {
    if (session.messages.isEmpty) return AiCoachPage.examples;
    final latest = session.messages.last;
    if (latest.question != null) return const ['直接出计划'];
    if (latest.plan != null) return const ['时间短一点', '换成徒手', '难度低一点'];
    return const ['在家练核心', '托马斯热身', '练支撑臂'];
  }

  Future<void> _save(
    uc.TrainingPlan plan,
    List<CoachPlanEntry> entries,
    String resultId,
  ) async {
    if (entries.isEmpty ||
        session.isSaved(resultId, widget.store) ||
        !_saving.add(resultId)) {
      return;
    }
    try {
      final pending = session.pendingSaved[resultId];
      final previous = pending == null
          ? null
          : widget.store.routineById(pending);
      final routine =
          previous ??
          await widget.store.createRoutine(
            CoachPlanMapper.routineName(plan),
            plan.exerciseIds.toList(),
            sdkPlan: plan,
            source: plan.source == 'template' ? 'template' : 'ai',
          );
      if (routine == null) throw StateError('Plan was not saved');
      session.markPendingSave(resultId, routine.id);
      if (previous != null) {
        if (!await widget.store.retrySave()) {
          throw StateError('Plan persistence failed');
        }
      } else if (widget.store.storageError != null ||
          widget.store.persistenceBlocked) {
        throw StateError('Plan persistence failed');
      }
      session.markSaved(resultId, routine.id);
      if (!mounted) return;
      FlareHaptics.success();
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(SnackBar(content: Text('已保存到「我的计划」：${routine.name}')));
    } on Object {
      if (!mounted) return;
      ScaffoldMessenger.of(context)
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(content: Text('保存失败，请重试保存。计划仍保留在本次对话中。')),
        );
    } finally {
      _saving.remove(resultId);
    }
  }

  @override
  Widget build(BuildContext context) {
    final configured = session.service.configured;
    final header = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 2, 12, 4),
          child: Row(
            children: [
              FlareGlassIconButton(
                icon: Icons.arrow_back_rounded,
                label: '返回',
                onPressed: widget.onBack,
              ),
              const Expanded(
                child: Center(
                  child: Text(
                    'AI 定制',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              FlareGlassIconButton(
                key: const ValueKey('coach-new-chat'),
                icon: Icons.add_comment_outlined,
                label: '新对话',
                onPressed: session.busy || session.messages.isEmpty
                    ? null
                    : session.newConversation,
              ),
            ],
          ),
        ),
        if (!configured)
          Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Text(
              '未配置 AI · 使用预设方案',
              style: TextStyle(fontSize: 12, color: FlareColors.secondary),
            ),
          ),
      ],
    );
    return cui.CoachUiTheme(
      style: flareCoachUiStyle(context),
      child: ColoredBox(
        color: FlareColors.background,
        child: Column(
          children: [
            header,
            Expanded(
              child: cui.CoachChatList(
                key: ValueKey('coach-list-${session.generation}'),
                controller: _scroll,
                topColor: FlareColors.background,
                dockHeight: 0,
                initiallySeen: _initiallySeen,
                timeMarkBuilder: (at, now) => cui.CoachTimeMark(at, now: now),
                typing: session.busy
                    ? _Thinking(
                        key: const ValueKey('coach-thinking'),
                        seconds: _elapsed,
                        event: session.progress,
                        onStop: session.stop,
                      )
                    : null,
                entries: [
                  if (session.showDisclaimer)
                    cui.CoachChatEntry(
                      id: 'disclaimer-${session.generation}',
                      at: session.createdAt,
                      isUser: false,
                      child: _Disclaimer(onAccept: session.acceptDisclaimer),
                    ),
                  if (session.messages.isEmpty && session.pendingText == null)
                    cui.CoachChatEntry(
                      id: 'intro-${session.generation}',
                      at: session.createdAt,
                      isUser: false,
                      greeting: true,
                      child: const cui.CoachGreetingBlock(
                        text:
                            '说说你想怎么练\n场地、时长、想练的部位、哪里不舒服都可以讲。'
                            '我只用 App 里的托马斯动作排计划，排好可以存进「我的计划」或直接开练。',
                      ),
                    ),
                  for (var i = 0; i < session.messages.length; i++)
                    cui.CoachChatEntry(
                      id: session.messages[i].id,
                      at: session.messages[i].at,
                      isUser: session.messages[i].isUser,
                      isCard: session.messages[i].plan != null,
                      child: KeyedSubtree(
                        key: ValueKey('coach-msg-$i'),
                        child: session.messages[i].isUser
                            ? _plain(
                                session.messages[i].text,
                                user: true,
                                id: 'user-$i',
                              )
                            : _answer(context, session.messages[i], i),
                      ),
                    ),
                  if (session.pendingText case final text?)
                    cui.CoachChatEntry(
                      id: 'pending-input-${session.generation}',
                      at: session.startedAt ?? session.createdAt,
                      isUser: true,
                      child: _plain(text, user: true),
                    ),
                  if (session.notice case final notice?)
                    cui.CoachChatEntry(
                      id: 'notice-${session.generation}-${session.messages.length}',
                      at: DateTime.now(),
                      isUser: false,
                      child: _plain(notice),
                    ),
                ],
              ),
            ),
            _SuggestionStrip(
              items: session.busy ? const [] : _suggestions,
              onTap: _send,
            ),
            _Composer(
              controller: _input,
              busy: session.busy,
              onSend: _send,
              onPlans: widget.onBack,
            ),
          ],
        ),
      ),
    );
  }

  Widget _plain(
    String text, {
    bool user = false,
    String id = 'notice',
    String? caption,
  }) => cui.CoachMessageBubble(
    message: cui.CoachBubbleData(
      id: id,
      text: text,
      isUser: user,
      caption: caption,
    ),
    optionsActive: false,
    onOption: (_) {},
  );

  Widget _answer(
    BuildContext context,
    uc.CoachConversationMessage message,
    int index,
  ) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    mainAxisSize: MainAxisSize.min,
    children: [
      if (message.text.isNotEmpty)
        _plain(
          message.text,
          caption: session.isPreset(message) && message.plan == null
              ? '预设方案'
              : null,
        ),
      if (message.question case final question?)
        cui.CoachQuestionBubble(
          key: ValueKey('coach-question-${message.id}'),
          question: coachQuestionData(
            question,
            id: 'coach-question-${message.id}',
            answered: message.questionAnswered,
            answeredChoices: message.answeredChoices,
          ),
          enabled: session.controller?.canAnswer(message.id) ?? false,
          onTextAnswer: (text) => session.answerText(
            message.id,
            text,
            tier: widget.store.settings.tier,
          ),
          onChoiceAnswer: (choices) => session.answerChoices(
            message.id,
            choices,
            tier: widget.store.settings.tier,
          ),
        ),
      if (message.actions case final actions?)
        _ActionCard(
          actions: actions,
          catalog: widget.catalog,
          onDrill: widget.onDrill,
        ),
      if (message.plan case final admitted?)
        _planCard(
          context,
          admitted.plan,
          message.id,
          session.isPreset(message),
        ),
    ],
  );

  Widget _planCard(
    BuildContext context,
    uc.TrainingPlan plan,
    String resultId,
    bool preset,
  ) {
    if (!session.loaded) return const SizedBox.shrink();
    final service = session.service;
    // Recheck the coach gate before any display DTO is constructed. Paths/names
    // come exclusively from this App catalog, never from the model or DTOs.
    if (!uc.PlanValidator(
      catalog: service.catalog,
      profile: service.profile,
    ).validate(plan).ok) {
      return _plain('计划未通过本 App 的训练校验，无法开始。');
    }
    final mapper = FlareCoachUiMapper(
      widget.catalog,
      trustedIds: {
        for (final drill in service.profile.scope(service.catalog)) drill.id,
      },
    );
    final cui.CoachRoutine routine;
    try {
      routine = mapper.routine(plan, resultId: resultId, preset: preset);
    } on StateError {
      return _plain('计划包含暂不可用的动作，无法开始。');
    }
    final entries = CoachPlanMapper(widget.catalog).entries(plan);
    final saved = session.isSaved(resultId, widget.store);
    final retry = session.pendingSaved.containsKey(resultId) && !saved;
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (retry)
            const Padding(
              padding: EdgeInsets.only(bottom: 8),
              child: Text('尚未写入本机存储，请重试保存', key: ValueKey('coach-save-retry')),
            ),
          KeyedSubtree(
            key: const ValueKey('coach-plan-card'),
            child: cui.CoachPlanCard(
              key: ValueKey('coach-plan-$resultId'),
              plan: routine,
              library: mapper.library(flareCoachUiStyle(context).colors.stage),
              saved: saved,
              onSave: () {
                if (!saved) unawaited(_save(plan, entries, resultId));
              },
              onStart: (_) {
                ScaffoldMessenger.of(context).hideCurrentSnackBar();
                widget.onStart(plan);
              },
              onOpen: () => _openPlan(plan, entries),
            ),
          ),
        ],
      ),
    );
  }

  void _openPlan(uc.TrainingPlan plan, List<CoachPlanEntry> entries) {
    unawaited(
      showModalBottomSheet<void>(
        context: context,
        isScrollControlled: true,
        builder: (context) => SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(plan.title, style: Theme.of(context).textTheme.titleLarge),
                if (plan.summary.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Text(plan.summary),
                  ),
                for (final entry in entries)
                  ListTile(
                    title: Text(entry.drill.name),
                    subtitle: Text('${entry.blockName}\n${entry.doseText}'),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: () {
                      Navigator.of(context).pop();
                      widget.onDrill(entry.drill);
                    },
                  ),
                for (final note in [...plan.notes, ...plan.safetyNotes])
                  Text(note),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Disclaimer extends StatelessWidget {
  const _Disclaimer({required this.onAccept});
  final VoidCallback onAccept;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 14),
    child: FlareStaticSurface(
      key: const ValueKey('coach-disclaimer'),
      padding: const EdgeInsets.fromLTRB(14, 12, 8, 6),
      radius: 20,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Icon(
                  Icons.health_and_safety_outlined,
                  size: 18,
                  color: FlareColors.secondary,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'AI 排的计划只作训练参考，不能代替医生或教练的判断；'
                  '训练中出现疼痛、麻木或头晕，请立即停止。',
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.45,
                    color: FlareColors.secondary,
                  ),
                ),
              ),
            ],
          ),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              key: const ValueKey('coach-disclaimer-ok'),
              onPressed: onAccept,
              style: TextButton.styleFrom(foregroundColor: FlareColors.text),
              child: const Text('知道了'),
            ),
          ),
        ],
      ),
    ),
  );
}

class _ActionCard extends StatelessWidget {
  const _ActionCard({
    required this.actions,
    required this.catalog,
    required this.onDrill,
  });
  final uc.ValidatedActions actions;
  final Catalog catalog;
  final ValueChanged<Drill> onDrill;
  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: FlareStaticSurface(
        key: const ValueKey('coach-actions-card'),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '动作推荐',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            for (final item in actions.items)
              if (catalog.drillById(item.id) case final drill?)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: InkWell(
                    key: ValueKey('coach-action-${item.id}'),
                    onTap: () => onDrill(drill),
                    borderRadius: BorderRadius.circular(12),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: SizedBox(
                            width: 64,
                            height: 64,
                            child: DrillPoster(drill),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                drill.name,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  height: 1.4,
                                ),
                              ),
                              if (item.note != null && item.note!.isNotEmpty)
                                Text(
                                  item.note!,
                                  style: TextStyle(
                                    fontSize: 13,
                                    height: 1.4,
                                    color: FlareColors.secondary,
                                  ),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          Icons.chevron_right_rounded,
                          size: 18,
                          color: FlareColors.dim,
                        ),
                      ],
                    ),
                  ),
                ),
          ],
        ),
      ),
    ),
  );
}

/// Show real SDK progress; elapsed time is not a fabricated completion ratio.
class _Thinking extends StatelessWidget {
  const _Thinking({
    super.key,
    required this.seconds,
    required this.onStop,
    this.event,
  });
  final int seconds;
  final VoidCallback onStop;
  final uc.AgentEvent? event;

  String get title => switch (event?.kind) {
    uc.AgentEventKind.reading || uc.AgentEventKind.listing => '正在查阅托马斯动作库…',
    uc.AgentEventKind.checking => '正在核对计划与安全条件…',
    uc.AgentEventKind.retrying =>
      '网络不稳，正在重试（${event!.attempt}/${event!.maxAttempts}）…',
    uc.AgentEventKind.slow => '响应比平时久，仍在等待；你可以随时停止',
    uc.AgentEventKind.askUser => '正在整理需要确认的问题…',
    _ => '正在理解你的需求…',
  };

  @override
  Widget build(BuildContext context) => cui.CoachTypingBubble(
    progressLabel: '$title · 已用 $seconds 秒',
    onCancel: onStop,
  );
}

class _SuggestionStrip extends StatelessWidget {
  const _SuggestionStrip({required this.items, required this.onTap});
  final List<String> items;
  final ValueChanged<String> onTap;
  @override
  Widget build(BuildContext context) => items.isEmpty
      ? const SizedBox(height: 6)
      : SizedBox(
          key: const ValueKey('coach-suggestions'),
          height:
              52 +
              (MediaQuery.textScalerOf(context).scale(14) - 14).clamp(0, 28),
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.fromLTRB(16, 2, 16, 8),
            itemCount: items.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (_, i) => ActionChip(
              key: ValueKey('coach-suggestion-$i'),
              label: Text(items[i]),
              backgroundColor: FlareColors.surface.withValues(alpha: .72),
              side: BorderSide.none,
              shape: const StadiumBorder(),
              onPressed: () => onTap(items[i]),
            ),
          ),
        );
}

class _Composer extends StatelessWidget {
  const _Composer({
    required this.controller,
    required this.busy,
    required this.onSend,
    required this.onPlans,
  });
  final VoidCallback onPlans;
  final TextEditingController controller;
  final bool busy;
  final VoidCallback onSend;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
    child: FlareGlassBar(
      radius: 28,
      padding: const EdgeInsets.fromLTRB(4, 0, 7, 0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: IconButton(
              key: const ValueKey('coach-open-plans'),
              tooltip: '我的计划',
              onPressed: onPlans,
              icon: Icon(
                Icons.bookmark_border_rounded,
                color: FlareColors.secondary,
                size: 21,
              ),
            ),
          ),
          Expanded(
            child: TextField(
              key: const ValueKey('coach-input'),
              controller: controller,
              enabled: !busy,
              minLines: 1,
              maxLines: 4,
              maxLength: 300,
              textInputAction: TextInputAction.send,
              style: const TextStyle(fontSize: 16, height: 1.5),
              onSubmitted: (_) => onSend(),
              decoration: const InputDecoration(
                hintText: '说说想怎么练…',
                counterText: '',
                isDense: true,
                contentPadding: EdgeInsets.symmetric(vertical: 14),
                filled: false,
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 6, bottom: 7),
            child: ValueListenableBuilder<TextEditingValue>(
              valueListenable: controller,
              builder: (context, value, _) {
                final ready = !busy && value.text.trim().isNotEmpty;
                return IconButton.filled(
                  key: const ValueKey('coach-send'),
                  tooltip: '发送',
                  style: IconButton.styleFrom(
                    backgroundColor: FlareColors.accent,
                    foregroundColor: FlareColors.onAccent,
                    minimumSize: const Size(38, 38),
                  ),
                  onPressed: ready ? onSend : null,
                  icon: const Icon(Icons.arrow_upward_rounded, size: 20),
                );
              },
            ),
          ),
        ],
      ),
    ),
  );
}
