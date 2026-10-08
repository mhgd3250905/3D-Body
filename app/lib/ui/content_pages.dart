import 'package:flutter/material.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'theme.dart';

class PageHeader extends StatelessWidget {
  const PageHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.onBack,
    this.action,
  });
  final String title;
  final String? subtitle;
  final VoidCallback? onBack;
  final Widget? action;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
    child: Row(
      children: [
        if (onBack != null)
          IconButton(
            onPressed: onBack,
            tooltip: context.strings.goBack,
            icon: const Icon(Icons.arrow_back),
          ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(left: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 25,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                if (subtitle != null)
                  Text(
                    subtitle!,
                    style: const TextStyle(
                      color: FlareColors.muted,
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),
        ),
        ?action,
      ],
    ),
  );
}

class WelcomePage extends StatefulWidget {
  const WelcomePage({super.key, required this.onEnter});
  final Future<void> Function(bool assessment) onEnter;
  @override
  State<WelcomePage> createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  bool _accepted = false;
  bool _busy = false;
  Future<void> _enter(bool assessment) async {
    setState(() => _busy = true);
    await widget.onEnter(assessment);
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 560),
            child: ListView(
              padding: const EdgeInsets.all(28),
              shrinkWrap: true,
              children: [
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Image.asset(
                        'assets/brand/icon.png',
                        width: 72,
                        height: 72,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        s.appName,
                        style: const TextStyle(
                          fontSize: 25,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 34),
                Text(
                  s.welcomeTitle,
                  style: const TextStyle(
                    fontSize: 32,
                    height: 1.3,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 16),
                BodyText(s.welcomeBody, color: FlareColors.muted),
                const SizedBox(height: 26),
                for (final pair in [
                  (Icons.slow_motion_video, s.welcomeStep1),
                  (Icons.touch_app_outlined, s.welcomeStep2),
                  (Icons.timer_outlined, s.welcomeStep3),
                ])
                  Padding(
                    padding: const EdgeInsets.only(bottom: 14),
                    child: Row(
                      children: [
                        Icon(pair.$1, color: FlareColors.accent),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Text(
                            pair.$2,
                            style: const TextStyle(fontSize: 15),
                          ),
                        ),
                      ],
                    ),
                  ),
                SectionTitle(s.safety),
                SurfaceCard(child: BodyText(s.safetyBody)),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    s.ackSafety,
                    style: const TextStyle(fontSize: 14),
                  ),
                  value: _accepted,
                  onChanged: (value) =>
                      setState(() => _accepted = value ?? false),
                  controlAffinity: ListTileControlAffinity.leading,
                ),
                FilledButton(
                  onPressed: _accepted && !_busy ? () => _enter(false) : null,
                  child: Text(s.enterApp),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: _accepted && !_busy ? () => _enter(true) : null,
                  child: Text(s.assessment),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class LibraryPage extends StatefulWidget {
  const LibraryPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onDrill,
    required this.onRemove,
    this.onBack,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Drill> onDrill;
  final ValueChanged<String> onRemove;
  final VoidCallback? onBack;
  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  String _query = '';
  String? _section;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final drills = widget.catalog.searchDrills(
      _query,
      tier: widget.store.settings.tier,
      section: _section,
    );
    return Column(
      children: [
        PageHeader(
          title: s.library,
          subtitle: s.libraryCount,
          onBack: widget.onBack,
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
              SectionTitle(s.today),
              if (widget.store.todayIds.isEmpty)
                SurfaceCard(
                  child: BodyText(s.todayEmpty, color: FlareColors.muted),
                ),
              for (final id in widget.store.todayIds)
                if (widget.catalog.drillById(id) case final Drill drill)
                  DrillTile(
                    drill: drill,
                    onTap: () => widget.onDrill(drill),
                    trailing: IconButton(
                      tooltip: s.remove,
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: () => widget.onRemove(id),
                    ),
                  ),
              const SizedBox(height: 18),
              TextField(
                decoration: InputDecoration(
                  hintText: s.searchDrills,
                  prefixIcon: const Icon(Icons.search),
                ),
                onChanged: (value) => setState(() => _query = value),
              ),
              const SizedBox(height: 14),
              TierSelector(
                value: widget.store.settings.tier,
                onChanged: (tier) => widget.store.updateSettings(tier: tier),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 7,
                runSpacing: 5,
                children: [
                  ChoiceChip(
                    label: Text(s.all),
                    selected: _section == null,
                    onSelected: (_) => setState(() => _section = null),
                  ),
                  for (final section in widget.catalog.sections)
                    ChoiceChip(
                      label: Text(section.short),
                      selected: _section == section.id,
                      onSelected: (_) => setState(() => _section = section.id),
                    ),
                ],
              ),
              const SizedBox(height: 16),
              if (drills.isEmpty)
                BodyText(s.noResults, color: FlareColors.muted),
              for (final drill in drills)
                DrillTile(drill: drill, onTap: () => widget.onDrill(drill)),
              const SizedBox(height: 14),
              BodyText(s.contentDraftNote, color: FlareColors.muted),
            ],
          ),
        ),
      ],
    );
  }
}

class DrillDetailPage extends StatelessWidget {
  const DrillDetailPage({
    super.key,
    required this.drill,
    required this.onBack,
    required this.onStart,
    required this.onAdd,
    required this.added,
  });
  final Drill drill;
  final VoidCallback onBack;
  final VoidCallback onStart;
  final VoidCallback onAdd;
  final bool added;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        PageHeader(title: s.library, onBack: onBack),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: AspectRatio(
                  aspectRatio: 1.2,
                  child: Image.asset(drill.imageAsset, fit: BoxFit.cover),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                s.illustration,
                style: const TextStyle(fontSize: 11, color: FlareColors.muted),
              ),
              if (drill.illustrationNote != null)
                BodyText(drill.illustrationNote!, color: FlareColors.muted),
              const SizedBox(height: 12),
              Text(
                drill.name,
                style: const TextStyle(
                  fontSize: 27,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                drill.nameEn,
                style: const TextStyle(color: FlareColors.muted, fontSize: 12),
              ),
              const SizedBox(height: 14),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: SurfaceCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s.dose,
                            style: const TextStyle(
                              color: FlareColors.muted,
                              fontSize: 11,
                            ),
                          ),
                          const SizedBox(height: 6),
                          BodyText(drill.prescription),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: SurfaceCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s.equipment,
                            style: const TextStyle(
                              color: FlareColors.muted,
                              fontSize: 11,
                            ),
                          ),
                          const SizedBox(height: 6),
                          BodyText(drill.equipment),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              SectionTitle(s.cues),
              SurfaceCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (var i = 0; i < drill.cues.length; i++)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 9),
                        child: BodyText('${i + 1}  ${drill.cues[i]}'),
                      ),
                  ],
                ),
              ),
              SectionTitle(s.mistake),
              BodyText(drill.mistake),
              SectionTitle(s.drillWhy),
              SurfaceCard(child: BodyText(drill.why)),
              SectionTitle(s.safety),
              BodyText(drill.safety ?? s.safetyBody),
              const SizedBox(height: 18),
              OutlinedButton.icon(
                onPressed: added ? null : onAdd,
                icon: Icon(added ? Icons.check : Icons.add),
                label: Text(added ? s.addedToday : s.addToday),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
          child: FilledButton.icon(
            onPressed: onStart,
            icon: const Icon(Icons.timer_outlined),
            label: Text(s.startTimer),
          ),
        ),
      ],
    );
  }
}

class PathPage extends StatelessWidget {
  const PathPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onLesson,
    required this.onGate,
    required this.onAssessment,
    this.onBack,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Lesson> onLesson;
  final void Function(String, bool) onGate;
  final VoidCallback onAssessment;
  final VoidCallback? onBack;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Column(
      children: [
        PageHeader(
          title: s.path,
          onBack: onBack,
          subtitle: s.stageLabel(store.currentStage),
          action: IconButton(
            onPressed: onAssessment,
            tooltip: s.assessment,
            icon: const Icon(Icons.fact_check_outlined),
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
              BodyText(s.courseDraft, color: FlareColors.muted),
              const SizedBox(height: 18),
              for (final stage in catalog.stages)
                Padding(
                  padding: const EdgeInsets.only(bottom: 14),
                  child: SurfaceCard(
                    padding: 8,
                    child: ExpansionTile(
                      initiallyExpanded: stage.n == store.currentStage,
                      shape: const Border(),
                      collapsedShape: const Border(),
                      leading: CircleAvatar(
                        backgroundColor: store.isStagePassed(stage.n)
                            ? FlareColors.success.withValues(alpha: .2)
                            : FlareColors.accent.withValues(alpha: .15),
                        child: store.isStagePassed(stage.n)
                            ? const Icon(
                                Icons.check,
                                color: FlareColors.success,
                              )
                            : Text(
                                stage.n.toString(),
                                style: const TextStyle(
                                  color: FlareColors.accent,
                                ),
                              ),
                      ),
                      title: Text(
                        stage.title,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      subtitle: Text(
                        store.isStagePassed(stage.n)
                            ? s.passed
                            : store.isStageUnlocked(stage.n)
                            ? s.current
                            : s.locked,
                        style: const TextStyle(
                          fontSize: 11,
                          color: FlareColors.muted,
                        ),
                      ),
                      children: [
                        for (final lesson in stage.lessons)
                          ListTile(
                            title: Text(
                              lesson.title,
                              style: const TextStyle(fontSize: 14),
                            ),
                            subtitle: Text(
                              '${lesson.minutes} min',
                              style: const TextStyle(fontSize: 11),
                            ),
                            trailing: Icon(
                              store.completedLessonIds.contains(lesson.id)
                                  ? Icons.check_circle
                                  : Icons.chevron_right,
                              color:
                                  store.completedLessonIds.contains(lesson.id)
                                  ? FlareColors.success
                                  : FlareColors.muted,
                            ),
                            onTap: () => onLesson(lesson),
                          ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
                          child: Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              s.gate,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                        for (final gate in stage.gates)
                          CheckboxListTile(
                            value: store.gateReports[gate.id] ?? false,
                            onChanged: store.isStageUnlocked(stage.n)
                                ? (value) => onGate(gate.id, value ?? false)
                                : null,
                            title: Text(
                              gate.text,
                              style: const TextStyle(fontSize: 13),
                            ),
                            subtitle: Text(
                              s.selfReport,
                              style: const TextStyle(
                                color: FlareColors.muted,
                                fontSize: 10,
                              ),
                            ),
                            controlAffinity: ListTileControlAffinity.leading,
                          ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class LessonPage extends StatelessWidget {
  const LessonPage({
    super.key,
    required this.catalog,
    required this.lesson,
    required this.store,
    required this.onBack,
    required this.onWatch,
    required this.onComplete,
    required this.onDrill,
  });
  final Catalog catalog;
  final Lesson lesson;
  final LearningStore store;
  final VoidCallback onBack;
  final VoidCallback onWatch;
  final VoidCallback onComplete;
  final ValueChanged<Drill> onDrill;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final complete = store.completedLessonIds.contains(lesson.id);
    return Column(
      children: [
        PageHeader(title: s.stageLabel(lesson.stage), onBack: onBack),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
              Text(
                lesson.title,
                style: const TextStyle(
                  fontSize: 29,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 14),
              BodyText(s.courseDraft, color: FlareColors.muted),
              if (lesson.phases.isNotEmpty) ...[
                SectionTitle(s.watchPhases),
                for (final source in lesson.phases)
                  if (catalog.phaseBySource(source) case final Phase phase)
                    SurfaceCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$source  ${phase.name}',
                            style: const TextStyle(fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 7),
                          BodyText(phase.caption),
                        ],
                      ),
                    ),
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: onWatch,
                  icon: const Icon(Icons.view_in_ar),
                  label: Text(s.watchPhases),
                ),
              ],
              SectionTitle(s.suggestedDrills),
              for (final id in lesson.drills)
                if (catalog.drillById(id) case final Drill drill)
                  DrillTile(drill: drill, onTap: () => onDrill(drill)),
              const SizedBox(height: 12),
              FilledButton.icon(
                onPressed: store.isStageUnlocked(lesson.stage) && !complete
                    ? onComplete
                    : null,
                icon: Icon(complete ? Icons.check : Icons.check_circle_outline),
                label: Text(complete ? s.lessonCompleted : s.markLesson),
              ),
              if (!store.isStageUnlocked(lesson.stage))
                BodyText(s.locked, color: FlareColors.muted),
            ],
          ),
        ),
      ],
    );
  }
}

class AssessmentPage extends StatefulWidget {
  const AssessmentPage({
    super.key,
    required this.initialGrades,
    required this.onSave,
    required this.onSkip,
    required this.onBack,
  });
  final Map<String, int> initialGrades;
  final Future<void> Function(Map<String, int>) onSave;
  final Future<void> Function() onSkip;
  final VoidCallback onBack;
  @override
  State<AssessmentPage> createState() => _AssessmentPageState();
}

class _AssessmentPageState extends State<AssessmentPage> {
  late final Map<String, int> _grades = {
    for (final id in ['wrist', 'pike', 'straddle', 'dips', 'lsit'])
      id: widget.initialGrades[id] ?? 1,
  };
  bool _busy = false;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Column(
      children: [
        PageHeader(title: s.assessment, onBack: widget.onBack),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
              BodyText(s.assessmentNote, color: FlareColors.muted),
              for (final item in [
                ('wrist', s.wristTest),
                ('pike', s.compressionTest),
                ('straddle', s.hipTest),
                ('dips', s.dipsTest),
                ('lsit', s.supportTest),
              ]) ...[
                SectionTitle(item.$2),
                DropdownButtonFormField<int>(
                  initialValue: _grades[item.$1],
                  isExpanded: true,
                  items: [
                    for (final grade
                        in item.$1 == 'dips'
                            ? [
                                (1, s.dipsGrade1),
                                (2, s.dipsGrade2),
                                (3, s.dipsGrade3),
                                (4, s.dipsGrade4),
                              ]
                            : [
                                (1, s.grade1),
                                (2, s.grade2),
                                (3, s.grade3),
                                (4, s.grade4),
                              ])
                      DropdownMenuItem(
                        value: grade.$1,
                        child: Text(
                          grade.$2,
                          style: const TextStyle(fontSize: 13),
                        ),
                      ),
                  ],
                  onChanged: (value) {
                    if (value != null) setState(() => _grades[item.$1] = value);
                  },
                ),
              ],
              const SizedBox(height: 26),
              FilledButton(
                onPressed: _busy
                    ? null
                    : () async {
                        setState(() => _busy = true);
                        await widget.onSave(Map.of(_grades));
                        if (mounted) setState(() => _busy = false);
                      },
                child: Text(s.saveAssessment),
              ),
              TextButton(
                onPressed: _busy ? null : widget.onSkip,
                child: Text(s.skipAssessment),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class ProgressPage extends StatelessWidget {
  const ProgressPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onDrill,
    this.onBack,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Drill> onDrill;
  final VoidCallback? onBack;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Column(
      children: [
        PageHeader(title: s.history, onBack: onBack),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
              Row(
                children: [
                  for (final item in [
                    (
                      store.sessions
                          .where((session) => session.completed)
                          .length
                          .toString(),
                      s.sessionCount,
                    ),
                    (
                      (store.totalActiveSeconds / 60).toStringAsFixed(1),
                      s.activeMinutes,
                    ),
                    (store.completedLessonIds.length.toString(), s.lessonCount),
                  ])
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: SurfaceCard(
                          padding: 12,
                          child: Column(
                            children: [
                              Text(
                                item.$1,
                                style: const TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w700,
                                  color: FlareColors.accent,
                                ),
                              ),
                              Text(
                                item.$2,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: FlareColors.muted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 22),
              if (store.sessions.isEmpty)
                SurfaceCard(child: BodyText(s.historyEmpty)),
              for (final session in store.sessions.reversed)
                if (catalog.drillById(session.drillId) case final Drill drill)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: SurfaceCard(
                      child: InkWell(
                        onTap: () => onDrill(drill),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    drill.name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                                Icon(
                                  session.pain
                                      ? Icons.warning_amber_rounded
                                      : session.completed
                                      ? Icons.check_circle
                                      : Icons.pause_circle_outline,
                                  color: session.pain
                                      ? Colors.amber
                                      : FlareColors.success,
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _dateLabel(session.startedAt.toLocal()),
                              style: const TextStyle(
                                color: FlareColors.muted,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${s.setsLabel(session.completedSets, session.plannedSets)} · ${s.secondsLabel(session.activeSeconds)}',
                              style: const TextStyle(fontSize: 13),
                            ),
                            if (!session.completed) Text(s.incomplete),
                            if (session.pain)
                              BodyText(s.painFlag, color: Colors.amber),
                          ],
                        ),
                      ),
                    ),
                  ),
              const SizedBox(height: 16),
              BodyText(s.privacyBody, color: FlareColors.muted),
            ],
          ),
        ),
      ],
    );
  }

  String _dateLabel(DateTime date) =>
      '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}  ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
}
