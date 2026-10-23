import 'dart:async';

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/engine.dart' as trainer;

import '../coach/coach_service.dart';
import '../coach/plan_mapping.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'coach_question_bubble.dart';
import 'motion.dart';
import 'plans_page.dart' show DrillPoster;
import 'theme.dart';

/// AI 定制只做中文（模型、目录文案都是中文），其他语言界面不显示入口。
bool aiCoachAvailable(BuildContext context) =>
    Localizations.localeOf(context).languageCode == 'zh';

/// 对话里的一条。
class CoachMessage {
  const CoachMessage.user(String this.text) : answer = null, resultId = -1;
  const CoachMessage.answer(CoachAnswer this.answer, this.resultId)
    : text = null;
  final String? text;
  final CoachAnswer? answer;

  /// 应用给每份回答分配的身份（会话内唯一），保存状态按它绑定，不依赖模型给的 plan id。
  final int resultId;
  bool get isUser => text != null;
}

/// 一次 AI 定制对话的状态。由外壳持有，进入跟练 / 动作详情再回来时对话还在。
class AiCoachSession extends ChangeNotifier {
  AiCoachSession(this.service, {DateTime Function()? now})
    : _now = now ?? DateTime.now;

  final CoachService service;
  final DateTime Function() _now;
  final uc.CoachConversation conversation = uc.CoachConversation();
  final List<CoachMessage> messages = [];

  /// 已保存的回答：回答身份（[CoachMessage.resultId]）→ routine id。
  /// routine 可能已被删除，是否「已保存」以 store 里实际存在为准（[isSaved]）。
  final Map<int, String> saved = {};
  int _nextResult = 0;
  uc.CancelToken? _cancel;
  DateTime? _startedAt;
  uc.AgentEvent? progress;
  bool _loaded = false;
  bool _disposed = false;

  /// 刚被停止的那句话（页面取走后清空）。
  String? cancelledText;

  bool get busy => _cancel != null;
  DateTime? get startedAt => _startedAt;
  bool get loaded => _loaded;
  bool get showDisclaimer => _loaded && !service.disclaimerAccepted;

  Future<void> load() async {
    await service.load();
    _loaded = true;
    _notify();
  }

  Future<void> acceptDisclaimer() async {
    await service.acceptDisclaimer();
    _notify();
  }

  Future<void> send(String raw, {required String tier}) async {
    final text = raw.trim();
    if (text.isEmpty || busy) return;
    final cancel = uc.CancelToken();
    _cancel = cancel;
    _startedAt = _now();
    progress = null;
    messages.add(CoachMessage.user(text));
    _notify();
    CoachAnswer answer;
    try {
      answer = await service.ask(
        text,
        conversation,
        cancel: cancel,
        tier: tier,
        onProgress: (event) {
          progress = event;
          _notify();
        },
      );
    } on Object {
      answer = const CoachAnswer(
        reply: uc.CoachReply.text('出了点问题，没能排出计划。请稍后再试。'),
      );
    }
    if (_disposed) return;
    _cancel = null;
    _startedAt = null;
    if (answer.cancelled) {
      // 取消：撤回这句话，页面把它放回输入框。
      if (messages.isNotEmpty && messages.last.isUser) messages.removeLast();
      cancelledText = text;
    } else {
      messages.add(CoachMessage.answer(answer, _nextResult++));
    }
    _notify();
  }

  void newConversation() {
    if (busy) return;
    service.resetConversation();
    conversation.clear();
    messages.clear();
    saved.clear();
    cancelledText = null;
    _notify();
  }

  /// 停止正在进行的请求（HTTP 真正中止，不回落、不记进对话）。
  void stop() => _cancel?.cancel();

  void markSaved(int resultId, String routineId) {
    saved[resultId] = routineId;
    _notify();
  }

  /// 这份回答保存的计划还在「我的计划」里（删了就可以重新保存）。
  bool isSaved(int resultId, LearningStore store) {
    final id = saved[resultId];
    return id != null && store.routineById(id) != null;
  }

  void _notify() {
    if (!_disposed) notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _cancel?.cancel();
    super.dispose();
  }
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
  Timer? _ticker;

  /// 本次等待已过的秒数（按 1 秒节拍累加）。
  int _elapsed = 0;

  AiCoachSession get session => widget.session;

  @override
  void initState() {
    super.initState();
    session.addListener(_changed);
    if (!session.loaded) unawaited(session.load());
    if (session.busy) _startTicker();
  }

  @override
  void didUpdateWidget(covariant AiCoachPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!identical(oldWidget.session, widget.session)) {
      oldWidget.session.removeListener(_changed);
      widget.session.addListener(_changed);
    }
  }

  @override
  void dispose() {
    session.removeListener(_changed);
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
    final latest = session.messages.last.answer;
    if (latest?.question != null) return const ['直接出计划'];
    if (latest?.reply?.plan != null) return const ['时间短一点', '换成徒手', '难度低一点'];
    return const ['在家练核心', '托马斯热身', '练支撑臂'];
  }

  Future<void> _save(
    uc.TrainingPlan plan,
    List<CoachPlanEntry> entries,
    int resultId,
  ) async {
    final routine = await widget.store.createRoutine(
      CoachPlanMapper.routineName(plan),
      plan.exerciseIds.toList(),
      sdkPlan: plan,
      source: plan.source == 'template' ? 'template' : 'ai',
    );
    if (!mounted || routine == null) return;
    FlareHaptics.success();
    session.markSaved(resultId, routine.id);
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('已保存到「我的计划」：${routine.name}')));
  }

  @override
  Widget build(BuildContext context) {
    final configured = session.service.configured;
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 2, 12, 4),
            child: Row(
              children: [
                RoundIconButton(
                  icon: Icons.arrow_back_rounded,
                  tooltip: '返回',
                  diameter: 40,
                  onPressed: widget.onBack,
                ),
                const Expanded(
                  child: Center(
                    child: Text(
                      'AI 定制',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                RoundIconButton(
                  key: const ValueKey('coach-new-chat'),
                  icon: Icons.add_comment_outlined,
                  tooltip: '新对话',
                  diameter: 40,
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
          Expanded(
            child: ListView.builder(
              key: const ValueKey('coach-list'),
              controller: _scroll,
              reverse: true,
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
              itemCount:
                  session.messages.length +
                  (session.busy ? 1 : 0) +
                  (session.messages.isEmpty ? 1 : 0) +
                  (session.showDisclaimer ? 1 : 0),
              findChildIndexCallback: (key) {
                if (key is ObjectKey && key.value is CoachMessage) {
                  final i = session.messages.indexOf(key.value as CoachMessage);
                  return i < 0
                      ? null
                      : session.messages.length -
                            i -
                            1 +
                            (session.busy ? 1 : 0);
                }
                if (key == const ValueKey('coach-thinking-row')) {
                  return session.busy ? 0 : null;
                }
                final base = session.messages.length + (session.busy ? 1 : 0);
                if (key == const ValueKey('coach-intro-row')) {
                  return session.messages.isEmpty ? base : null;
                }
                if (key == const ValueKey('coach-disclaimer-row')) {
                  return session.showDisclaimer
                      ? base + (session.messages.isEmpty ? 1 : 0)
                      : null;
                }
                return null;
              },
              itemBuilder: (context, position) {
                var index = position;
                if (session.busy) {
                  if (index == 0) {
                    return RepaintBoundary(
                      key: const ValueKey('coach-thinking-row'),
                      child: _Thinking(
                        key: const ValueKey('coach-thinking'),
                        seconds: _elapsed,
                        event: session.progress,
                        onStop: session.stop,
                      ),
                    );
                  }
                  index--;
                }
                if (index < session.messages.length) {
                  final i = session.messages.length - index - 1;
                  final m = session.messages[i];
                  return RepaintBoundary(
                    key: ObjectKey(m),
                    child: KeyedSubtree(
                      key: ValueKey('coach-msg-$i'),
                      child: m.isUser
                          ? _UserBubble(m.text!)
                          : _answer(context, m, i),
                    ),
                  );
                }
                index -= session.messages.length;
                if (session.messages.isEmpty && index == 0) {
                  return KeyedSubtree(
                    key: const ValueKey('coach-intro-row'),
                    child: _Intro(configured: configured),
                  );
                }
                return KeyedSubtree(
                  key: const ValueKey('coach-disclaimer-row'),
                  child: _Disclaimer(onAccept: session.acceptDisclaimer),
                );
              },
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
    );
  }

  Widget _answer(BuildContext context, CoachMessage message, int index) {
    final answer = message.answer!;
    final reply = answer.reply;
    if (reply == null) return const SizedBox.shrink();
    final latest = index == session.messages.length - 1;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (reply.text.isNotEmpty && answer.question == null)
          _CoachBubble(
            text: reply.text,
            preset: answer.preset && reply.plan == null,
          ),
        if (answer.question case final question?)
          Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: CoachQuestionBubble(
              key: ValueKey('coach-question-${answer.turnId}'),
              question: question,
              enabled: latest && !session.busy,
              onAnswer: _send,
              backgroundColor: FlareColors.surface,
              foregroundColor: FlareColors.text,
              secondaryColor: FlareColors.secondary,
              optionColor: FlareColors.raised,
              accentColor: FlareColors.accentInk,
            ),
          ),
        if (answer.actions case final actions?)
          _ActionCard(
            actions: actions,
            catalog: widget.catalog,
            onDrill: widget.onDrill,
          ),
        if (reply.plan case final plan?)
          _planCard(context, plan, answer, message.resultId),
      ],
    );
  }

  Widget _planCard(
    BuildContext context,
    uc.TrainingPlan plan,
    CoachAnswer answer,
    int resultId,
  ) {
    final mapper = CoachPlanMapper(widget.catalog);
    final missing = mapper.missingIds(plan);
    if (missing.isNotEmpty) {
      return _CoachBubble(text: '计划包含暂不可用的动作，无法开始：${missing.join('、')}');
    }
    final entries = mapper.entries(plan);
    final saved = session.isSaved(resultId, widget.store);
    return _PlanCard(
      key: ValueKey('coach-plan-$resultId'),
      plan: plan,
      entries: entries,
      preset: answer.preset,
      saved: saved,
      onDrill: widget.onDrill,
      onSave: saved || entries.isEmpty
          ? null
          : () => _save(plan, entries, resultId),
      onStart: entries.isEmpty
          ? null
          : () {
              // 保存提示别盖住跟练页底部按钮。
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
              widget.onStart(plan);
            },
    );
  }
}

class _Disclaimer extends StatelessWidget {
  const _Disclaimer({required this.onAccept});
  final VoidCallback onAccept;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 14),
    child: Container(
      key: const ValueKey('coach-disclaimer'),
      padding: const EdgeInsets.fromLTRB(14, 12, 8, 6),
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: FlareColors.hairline),
      ),
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
                  color: FlareColors.accentInk,
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
              child: const Text('知道了'),
            ),
          ),
        ],
      ),
    ),
  );
}

class _Intro extends StatelessWidget {
  const _Intro({required this.configured});
  final bool configured;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 4, bottom: 12),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '说说你想怎么练',
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 6),
        Text(
          '场地、时长、想练的部位、哪里不舒服都可以讲。'
          '我只用 App 里的托马斯动作排计划，排好可以存进「我的计划」或直接开练。',
          style: TextStyle(
            fontSize: 14,
            height: 1.5,
            color: FlareColors.secondary,
          ),
        ),
        if (!configured) ...[
          const SizedBox(height: 10),
          Text(
            'AI 还没配置：现在会直接给出 App 内置的预设方案。',
            key: const ValueKey('coach-unconfigured-note'),
            style: TextStyle(
              fontSize: 13,
              height: 1.45,
              color: FlareColors.warning,
            ),
          ),
        ],
      ],
    ),
  );
}

class _UserBubble extends StatelessWidget {
  const _UserBubble(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => _TextBubble(text: text, user: true);
}

class _CoachBubble extends StatelessWidget {
  const _CoachBubble({required this.text, this.preset = false});
  final String text;
  final bool preset;
  @override
  Widget build(BuildContext context) =>
      _TextBubble(text: text, secondary: preset);
}

/// Match SmartFit's content-level bubbles: a flat face, a small tail and no rim.
class _TextBubble extends StatelessWidget {
  const _TextBubble({
    required this.text,
    this.user = false,
    this.secondary = false,
  });
  final String text;
  final bool user;
  final bool secondary;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 14),
    child: Align(
      alignment: user ? Alignment.centerRight : Alignment.centerLeft,
      child: FractionallySizedBox(
        widthFactor: user ? .78 : .86,
        alignment: user ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          padding: const EdgeInsets.fromLTRB(16, 11, 16, 12),
          decoration: BoxDecoration(
            color: user
                ? FlareColors.accent.withValues(alpha: .14)
                : FlareColors.surface,
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(22),
              topRight: const Radius.circular(22),
              bottomLeft: Radius.circular(user ? 22 : 6),
              bottomRight: Radius.circular(user ? 6 : 22),
            ),
          ),
          child: Text(
            text,
            style: TextStyle(
              fontSize: 16,
              height: 1.5,
              color: secondary ? FlareColors.secondary : FlareColors.text,
            ),
          ),
        ),
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
    child: Container(
      key: const ValueKey('coach-actions-card'),
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: FlareColors.hairline),
      ),
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
  Widget build(BuildContext context) => Align(
    alignment: Alignment.centerLeft,
    child: Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
      constraints: BoxConstraints(
        maxWidth: MediaQuery.sizeOf(context).width * .86,
      ),
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(22),
          topRight: Radius.circular(22),
          bottomLeft: Radius.circular(6),
          bottomRight: Radius.circular(22),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              for (var i = 0; i < 3; i++)
                Padding(
                  padding: const EdgeInsets.only(right: 5),
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: FlareColors.dim.withValues(alpha: .45 + i * .2),
                      shape: BoxShape.circle,
                    ),
                    child: const SizedBox(width: 6, height: 6),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(title, style: const TextStyle(fontSize: 15, height: 1.45)),
          const SizedBox(height: 4),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '已用 $seconds 秒',
                key: const ValueKey('coach-elapsed'),
                style: TextStyle(fontSize: 12, color: FlareColors.dim),
              ),
              const SizedBox(width: 12),
              TextButton.icon(
                key: const ValueKey('coach-stop'),
                onPressed: onStop,
                icon: const Icon(Icons.stop_circle_outlined, size: 17),
                label: const Text('停止'),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

/// Compact media-first plan, matching SmartFit's folded / expanded contract.
/// The scrolling card paints one static face and keeps one start control.
class _PlanCard extends StatefulWidget {
  const _PlanCard({
    super.key,
    required this.plan,
    required this.entries,
    required this.preset,
    required this.saved,
    required this.onDrill,
    required this.onSave,
    required this.onStart,
  });
  final uc.TrainingPlan plan;
  final List<CoachPlanEntry> entries;
  final bool preset;
  final bool saved;
  final ValueChanged<Drill> onDrill;
  final VoidCallback? onSave;
  final VoidCallback? onStart;
  @override
  State<_PlanCard> createState() => _PlanCardState();
}

class _PlanCardState extends State<_PlanCard>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;
  bool _expanded = false;

  Widget _start() => IconButton.filled(
    key: const ValueKey('coach-start'),
    tooltip: '开始训练',
    style: IconButton.styleFrom(
      backgroundColor: FlareColors.accent,
      foregroundColor: FlareColors.onAccent,
      minimumSize: const Size(48, 48),
    ),
    onPressed: widget.onStart,
    icon: const Icon(Icons.play_arrow_rounded, size: 27),
  );

  Widget _toggle({bool onMedia = false}) => TextButton.icon(
    key: const ValueKey('coach-plan-expand'),
    onPressed: () => setState(() => _expanded = !_expanded),
    style: TextButton.styleFrom(
      foregroundColor: onMedia ? Colors.white : FlareColors.secondary,
      backgroundColor: onMedia ? const Color(0x66000000) : FlareColors.raised,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      minimumSize: const Size(64, 36),
    ),
    iconAlignment: IconAlignment.end,
    icon: Icon(
      _expanded ? Icons.expand_less_rounded : Icons.expand_more_rounded,
      size: 18,
    ),
    label: Text(_expanded ? '收起' : '展开'),
  );

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final plan = widget.plan;
    final entries = widget.entries;
    final minutes = (trainer.SessionBuilder().planSeconds(plan) / 60).ceil();
    final summary = '${entries.length} 个动作 · 约 $minutes 分钟';
    return Align(
      alignment: Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 400),
        child: RepaintBoundary(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: Container(
              key: const ValueKey('coach-plan-card'),
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: FlareColors.surface.withValues(alpha: .94),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: FlareColors.controlBorder.withValues(alpha: .65),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: .05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (!_expanded && entries.length > 1)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(19),
                      child: Stack(
                        children: [
                          Positioned.fill(
                            child: DrillPoster(entries.first.drill),
                          ),
                          const Positioned.fill(
                            child: DecoratedBox(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    Color(0xcc000000),
                                  ],
                                  stops: [.2, 1],
                                ),
                              ),
                            ),
                          ),
                          ConstrainedBox(
                            constraints: const BoxConstraints(minHeight: 180),
                            child: Padding(
                              padding: const EdgeInsets.fromLTRB(14, 8, 14, 13),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Align(
                                    alignment: Alignment.centerRight,
                                    child: _toggle(onMedia: true),
                                  ),
                                  const SizedBox(height: 56),
                                  Text(
                                    plan.title,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 19,
                                      height: 1.3,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    summary,
                                    style: const TextStyle(
                                      color: Color(0xffdddddf),
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  else if (!_expanded && entries.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.all(6),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(17),
                            child: SizedBox(
                              width: 108,
                              height: 130,
                              child: DrillPoster(entries.first.drill),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  plan.title,
                                  style: const TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.w700,
                                    height: 1.3,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  entries.first.doseText,
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: FlareColors.secondary,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                _toggle(),
                              ],
                            ),
                          ),
                        ],
                      ),
                    )
                  else ...[
                    Padding(
                      padding: const EdgeInsets.fromLTRB(10, 8, 10, 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  plan.title,
                                  style: const TextStyle(
                                    fontSize: 19,
                                    fontWeight: FontWeight.w700,
                                    height: 1.3,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  summary,
                                  style: TextStyle(
                                    color: FlareColors.secondary,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 6),
                          _toggle(),
                        ],
                      ),
                    ),
                    if (plan.summary.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(10, 4, 10, 8),
                        child: Text(
                          plan.summary,
                          style: TextStyle(
                            fontSize: 13,
                            height: 1.45,
                            color: FlareColors.secondary,
                          ),
                        ),
                      ),
                    for (final (i, entry) in entries.indexed) ...[
                      if (i == 0 ||
                          entry.blockIndex != entries[i - 1].blockIndex)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(10, 8, 10, 4),
                          child: Eyebrow(entry.blockName),
                        ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: _EntryRow(
                          key: ValueKey('coach-row-$i'),
                          entry: entry,
                          onTap: () => widget.onDrill(entry.drill),
                        ),
                      ),
                    ],
                    for (final note in {
                      ...plan.safetyNotes,
                      '训练中出现疼痛、麻木或头晕，立即停止。',
                    })
                      Padding(
                        padding: const EdgeInsets.fromLTRB(10, 6, 10, 0),
                        child: Text(
                          note,
                          style: TextStyle(
                            fontSize: 12,
                            height: 1.4,
                            color: FlareColors.secondary,
                          ),
                        ),
                      ),
                  ],
                  Padding(
                    padding: const EdgeInsets.fromLTRB(6, 8, 2, 2),
                    child: Row(
                      children: [
                        if (_expanded)
                          Expanded(
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: TextButton.icon(
                                key: const ValueKey('coach-save'),
                                onPressed: widget.onSave,
                                icon: Icon(
                                  widget.saved
                                      ? Icons.check_rounded
                                      : Icons.bookmark_add_outlined,
                                  size: 18,
                                ),
                                label: Text(
                                  widget.saved ? '已保存到我的计划' : '保存到我的计划',
                                ),
                              ),
                            ),
                          )
                        else
                          Expanded(
                            child: Row(
                              children: [
                                for (final entry in entries.skip(1).take(3))
                                  Padding(
                                    padding: const EdgeInsets.only(right: 6),
                                    child: InkWell(
                                      onTap: () => widget.onDrill(entry.drill),
                                      borderRadius: BorderRadius.circular(10),
                                      child: Tooltip(
                                        message: entry.drill.name,
                                        child: ClipRRect(
                                          borderRadius: BorderRadius.circular(
                                            10,
                                          ),
                                          child: SizedBox(
                                            width: 36,
                                            height: 36,
                                            child: DrillPoster(entry.drill),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                if (entries.length > 4)
                                  Text(
                                    '+${entries.length - 4}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: FlareColors.secondary,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        const SizedBox(width: 6),
                        _start(),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(8, 2, 8, 5),
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        _Badge(
                          key: ValueKey(
                            widget.preset
                                ? 'coach-badge-preset'
                                : 'coach-badge-ai',
                          ),
                          label: widget.preset ? '预设方案' : 'AI 定制',
                          color: widget.preset
                              ? FlareColors.warning
                              : FlareColors.accentInk,
                        ),
                        if (widget.preset)
                          Text(
                            'App 内置成套训练',
                            key: const ValueKey('coach-preset-note'),
                            style: TextStyle(
                              fontSize: 11,
                              color: FlareColors.secondary,
                            ),
                          ),
                        if (widget.saved && !_expanded)
                          Text(
                            '已保存到我的计划',
                            style: TextStyle(
                              fontSize: 11,
                              color: FlareColors.secondary,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({super.key, required this.label, required this.color});
  final String label;
  final Color color;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(
      color: color.withValues(alpha: .14),
      borderRadius: BorderRadius.circular(99),
    ),
    child: Text(
      label,
      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color),
    ),
  );
}

class _EntryRow extends StatelessWidget {
  const _EntryRow({super.key, required this.entry, required this.onTap});
  final CoachPlanEntry entry;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => InkWell(
    borderRadius: BorderRadius.circular(14),
    onTap: onTap,
    child: Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: SizedBox(
              width: 52,
              height: 52,
              child: DrillPoster(entry.drill),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  entry.drill.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 15,
                    height: 1.3,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  entry.doseText,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.35,
                    color: FlareColors.secondary,
                  ),
                ),
              ],
            ),
          ),
          Icon(Icons.chevron_right_rounded, size: 20, color: FlareColors.dim),
        ],
      ),
    ),
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
              backgroundColor: FlareColors.surface,
              side: BorderSide(color: FlareColors.hairline),
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
    child: Container(
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: FlareColors.controlBorder),
      ),
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
