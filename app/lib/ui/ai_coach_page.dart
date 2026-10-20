import 'dart:async';

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../coach/coach_service.dart';
import '../coach/plan_mapping.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'content_pages.dart';
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
    messages.add(CoachMessage.user(text));
    _notify();
    CoachAnswer answer;
    try {
      answer = await service.ask(
        text,
        conversation,
        cancel: cancel,
        tier: tier,
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
  final void Function(String title, List<Drill> drills) onStart;
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
      _scroll.position.maxScrollExtent,
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

  Future<void> _save(
    uc.TrainingPlan plan,
    List<CoachPlanEntry> entries,
    int resultId,
  ) async {
    final routine = await widget.store.createRoutine(
      CoachPlanMapper.routineName(plan),
      [for (final e in entries) e.drill.id],
      doses: {for (final e in entries) e.drill.id: ?e.dose},
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
          PageHeader(
            title: 'AI 定制',
            large: false,
            onBack: widget.onBack,
            subtitle: configured ? null : '未配置 AI · 使用预设方案',
          ),
          Expanded(
            child: ScrollEdge(
              // 对话不长：整列一次排版，旧消息里的按钮也始终在树上。
              child: SingleChildScrollView(
                key: const ValueKey('coach-list'),
                controller: _scroll,
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (session.showDisclaimer)
                      _Disclaimer(onAccept: session.acceptDisclaimer),
                    if (session.messages.isEmpty)
                      _Intro(
                        configured: configured,
                        onExample: session.busy ? null : _send,
                      ),
                    for (final (i, m) in session.messages.indexed)
                      FadeSlideIn(
                        key: ValueKey('coach-msg-$i'),
                        offset: 8,
                        child: m.isUser
                            ? _UserBubble(m.text!)
                            : _answer(context, m, i),
                      ),
                    if (session.busy)
                      _Thinking(
                        key: const ValueKey('coach-thinking'),
                        seconds: _elapsed,
                        onStop: session.stop,
                      ),
                  ],
                ),
              ),
            ),
          ),
          _Composer(controller: _input, busy: session.busy, onSend: _send),
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
        if (reply.text.isNotEmpty)
          _CoachBubble(
            text: reply.text,
            preset: answer.preset && reply.plan == null,
          ),
        if (reply.kind == uc.ReplyKind.ask && reply.options.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final (i, option) in reply.options.indexed)
                  ActionChip(
                    key: ValueKey('coach-option-$i'),
                    label: Text(option),
                    onPressed: latest && !session.busy
                        ? () => _send(option)
                        : null,
                  ),
              ],
            ),
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
    final entries = CoachPlanMapper(widget.catalog).entries(plan);
    final drills = [for (final e in entries) e.drill];
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
              widget.onStart(CoachPlanMapper.routineName(plan), drills);
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
  const _Intro({required this.configured, required this.onExample});
  final bool configured;
  final ValueChanged<String>? onExample;
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
        const SizedBox(height: 14),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final (i, example) in AiCoachPage.examples.indexed)
              ActionChip(
                key: ValueKey('coach-example-$i'),
                label: Text(example),
                onPressed: onExample == null ? null : () => onExample!(example),
              ),
          ],
        ),
      ],
    ),
  );
}

class _UserBubble extends StatelessWidget {
  const _UserBubble(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Align(
    alignment: Alignment.centerRight,
    child: Padding(
      padding: const EdgeInsets.only(left: 48, bottom: 12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: FlareColors.accent.withValues(alpha: .16),
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(18),
            topRight: Radius.circular(18),
            bottomLeft: Radius.circular(18),
            bottomRight: Radius.circular(6),
          ),
        ),
        child: Text(text, style: const TextStyle(fontSize: 15, height: 1.45)),
      ),
    ),
  );
}

class _CoachBubble extends StatelessWidget {
  const _CoachBubble({required this.text, this.preset = false});
  final String text;
  final bool preset;
  @override
  Widget build(BuildContext context) => Align(
    alignment: Alignment.centerLeft,
    child: Padding(
      padding: const EdgeInsets.only(right: 32, bottom: 12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: FlareColors.surface,
          border: Border.all(color: FlareColors.hairline),
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(18),
            topRight: Radius.circular(18),
            bottomLeft: Radius.circular(6),
            bottomRight: Radius.circular(18),
          ),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 15,
            height: 1.5,
            color: preset ? FlareColors.secondary : FlareColors.text,
          ),
        ),
      ),
    ),
  );
}

/// 推理模型出一份计划约 30–40 秒：分阶段提示 + 已用时 + 可停止。
class _Thinking extends StatelessWidget {
  const _Thinking({super.key, required this.seconds, required this.onStop});
  final int seconds;
  final VoidCallback onStop;

  static (String, String) stage(int seconds) => switch (seconds) {
    < 6 => ('正在理解你的需求…', '第 1 步 / 共 3 步'),
    < 22 => ('正在从托马斯动作库里挑动作、配剂量…', '第 2 步 / 共 3 步'),
    < 45 => ('正在核对动作范围、剂量和安全…', '第 3 步 / 共 3 步'),
    _ => ('比平时久一点，可以继续等，或停止后改用预设方案', '仍在等待'),
  };

  @override
  Widget build(BuildContext context) {
    final (title, step) = stage(seconds);
    final progress = (seconds / 40).clamp(.04, .94);
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 12, 8, 8),
        decoration: BoxDecoration(
          color: FlareColors.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: FlareColors.hairline),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  height: 1.4,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: LinearProgressIndicator(
                  value: progress,
                  minHeight: 5,
                  backgroundColor: FlareColors.track,
                  color: FlareColors.accent,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Expanded(
                  child: Text(
                    '$step · 已用 $seconds 秒，通常 30–40 秒',
                    key: const ValueKey('coach-elapsed'),
                    style: TextStyle(fontSize: 12, color: FlareColors.dim),
                  ),
                ),
                TextButton.icon(
                  key: const ValueKey('coach-stop'),
                  onPressed: onStop,
                  icon: const Icon(Icons.stop_circle_outlined, size: 18),
                  label: const Text('停止'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final minutes = estimateMinutes([for (final e in entries) e.drill]);
    String? lastBlock;
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Container(
        key: const ValueKey('coach-plan-card'),
        decoration: BoxDecoration(
          color: FlareColors.surface,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: preset
                ? FlareColors.hairline
                : FlareColors.accent.withValues(alpha: .45),
          ),
        ),
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 6,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                _Badge(
                  key: ValueKey(
                    preset ? 'coach-badge-preset' : 'coach-badge-ai',
                  ),
                  label: preset ? '预设方案' : 'AI 定制',
                  color: preset ? FlareColors.warning : FlareColors.accentInk,
                ),
                Text(
                  '${entries.length} 个动作 · 约 $minutes 分钟',
                  style: TextStyle(fontSize: 12, color: FlareColors.dim),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              plan.title,
              style: const TextStyle(
                fontSize: 19,
                height: 1.3,
                fontWeight: FontWeight.w700,
              ),
            ),
            if (plan.summary.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                plan.summary,
                style: TextStyle(
                  fontSize: 13,
                  height: 1.45,
                  color: FlareColors.secondary,
                ),
              ),
            ],
            if (preset) ...[
              const SizedBox(height: 6),
              Text(
                '这是 App 内置的成套训练，不是按你的需求定制的。',
                key: const ValueKey('coach-preset-note'),
                style: TextStyle(
                  fontSize: 12,
                  height: 1.4,
                  color: FlareColors.warning,
                ),
              ),
            ],
            const SizedBox(height: 10),
            for (final (i, entry) in entries.indexed) ...[
              if (entry.blockName != lastBlock && !preset)
                Padding(
                  padding: const EdgeInsets.only(top: 6, bottom: 4),
                  child: Eyebrow(lastBlock = entry.blockName),
                ),
              _EntryRow(
                key: ValueKey('coach-row-$i'),
                entry: entry,
                onTap: () => onDrill(entry.drill),
              ),
            ],
            for (final note in {...plan.safetyNotes, '训练中出现疼痛、麻木或头晕，立即停止。'})
              Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Icon(
                        Icons.info_outline_rounded,
                        size: 14,
                        color: FlareColors.dim,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        note,
                        style: TextStyle(
                          fontSize: 12,
                          height: 1.4,
                          color: FlareColors.dim,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 14),
            PrimaryAction(
              key: const ValueKey('coach-start'),
              icon: Icons.play_arrow_rounded,
              label: '开始训练',
              height: 52,
              onPressed: onStart,
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                key: const ValueKey('coach-save'),
                onPressed: onSave,
                icon: Icon(
                  saved ? Icons.check_rounded : Icons.bookmark_add_outlined,
                  size: 18,
                ),
                label: Text(saved ? '已保存到我的计划' : '保存到我的计划'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
              ),
            ),
          ],
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

class _Composer extends StatelessWidget {
  const _Composer({
    required this.controller,
    required this.busy,
    required this.onSend,
  });
  final TextEditingController controller;
  final bool busy;
  final VoidCallback onSend;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.fromLTRB(16, 8, 10, 12),
    decoration: BoxDecoration(
      color: FlareColors.background,
      border: Border(top: BorderSide(color: FlareColors.hairline)),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: TextField(
            key: const ValueKey('coach-input'),
            controller: controller,
            enabled: !busy,
            minLines: 1,
            maxLines: 4,
            maxLength: 300,
            textInputAction: TextInputAction.send,
            onSubmitted: (_) => onSend(),
            decoration: const InputDecoration(
              hintText: '比如：在家 15 分钟，练侧撑换手',
              counterText: '',
              isDense: true,
            ),
          ),
        ),
        const SizedBox(width: 6),
        RoundIconButton(
          key: const ValueKey('coach-send'),
          icon: Icons.arrow_upward_rounded,
          tooltip: '发送',
          diameter: 44,
          onPressed: busy ? null : onSend,
        ),
      ],
    ),
  );
}
