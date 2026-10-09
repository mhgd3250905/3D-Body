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
    this.large = true,
  });
  final String title;
  final String? subtitle;
  final VoidCallback? onBack;
  final Widget? action;
  final bool large;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(16, 8, 16, 14),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 44,
          child: Row(
            children: [
              if (onBack != null)
                RoundIconButton(
                  icon: Icons.arrow_back_ios_new_rounded,
                  tooltip: context.strings.goBack,
                  onPressed: onBack,
                ),
              const Spacer(),
              ?action,
            ],
          ),
        ),
        if (title.isNotEmpty) ...[
          const SizedBox(height: 14),
          Padding(
            padding: const EdgeInsets.only(left: 4),
            child: Text(
              title,
              style: TextStyle(
                fontSize: large ? 30 : 24,
                height: 1.2,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
        if (subtitle != null)
          Padding(
            padding: const EdgeInsets.only(left: 4, top: 6),
            child: Eyebrow(subtitle!),
          ),
      ],
    ),
  );
}

/// The three-rule safety card. Shown once before entering, and from Settings.
Future<bool?> showSafetySheet(
  BuildContext context, {
  VoidCallback? onAssessment,
}) {
  final s = context.strings;
  return showModalBottomSheet<bool>(
    context: context,
    isScrollControlled: true,
    builder: (sheet) => SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Eyebrow(s.safetySheetEyebrow),
            const SizedBox(height: 4),
            Text(
              s.safetySheetTitle,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 18),
            for (final (index, rule) in [
              (s.safetyRule1, s.safetyRule1Note),
              (s.safetyRule2, s.safetyRule2Note),
              (s.safetyRule3, s.safetyRule3Note),
            ].indexed)
              Padding(
                padding: const EdgeInsets.only(bottom: 18),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: FlareColors.accent.withValues(alpha: .12),
                        borderRadius: BorderRadius.circular(9),
                      ),
                      child: Text(
                        '${index + 1}',
                        style: TextStyle(
                          color: FlareColors.accent,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            rule.$1,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            rule.$2,
                            style: TextStyle(
                              fontSize: 13,
                              height: 1.45,
                              color: FlareColors.dim,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 6),
            PrimaryAction(
              label: s.gotIt,
              onPressed: () => Navigator.pop(sheet, true),
            ),
            if (onAssessment != null)
              TextButton(
                onPressed: () {
                  Navigator.pop(sheet, false);
                  onAssessment();
                },
                child: Text(
                  s.startWithAssessment,
                  style: TextStyle(color: FlareColors.secondary),
                ),
              ),
          ],
        ),
      ),
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
  bool _busy = false;
  Future<void> _enter(bool assessment) async {
    setState(() => _busy = true);
    await widget.onEnter(assessment);
    if (mounted) setState(() => _busy = false);
  }

  Future<void> _start() async {
    var assessment = false;
    final accepted = await showSafetySheet(
      context,
      onAssessment: () => assessment = true,
    );
    if (!mounted) return;
    if (accepted == true || assessment) await _enter(assessment);
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Scaffold(
      backgroundColor: FlareColors.background,
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -.35),
            radius: 1.0,
            colors: FlareColors.stage,
            stops: [0, .55, 1],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(28, 12, 28, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(
                      child: Image.asset(
                        'assets/brand/hero-thomas.webp',
                        fit: BoxFit.contain,
                        semanticLabel: s.welcomeHeadline,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      s.brandEyebrow,
                      style: TextStyle(
                        color: FlareColors.accent,
                        fontSize: 12,
                        letterSpacing: 3,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      s.welcomeHeadline,
                      style: const TextStyle(
                        fontSize: 36,
                        height: 1.15,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      s.welcomeLine,
                      style: TextStyle(
                        fontSize: 16,
                        height: 1.5,
                        color: FlareColors.secondary,
                      ),
                    ),
                    const SizedBox(height: 28),
                    PrimaryAction(
                      label: s.startApp,
                      onPressed: _busy ? null : _start,
                    ),
                    const SizedBox(height: 6),
                    Center(
                      child: TextButton(
                        onPressed: _busy ? null : _start,
                        child: Text.rich(
                          TextSpan(
                            text: s.welcomeFootPrefix,
                            children: [
                              TextSpan(
                                text: ' ${s.safety}',
                                style: TextStyle(
                                  color: FlareColors.secondary,
                                  decoration: TextDecoration.underline,
                                  decorationColor: FlareColors.dim,
                                ),
                              ),
                            ],
                          ),
                          style: TextStyle(
                            fontSize: 12,
                            color: FlareColors.dim,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _FilterPill extends StatelessWidget {
  const _FilterPill({
    required this.label,
    required this.selected,
    required this.onTap,
    this.trailing,
  });
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(right: 8),
    child: Material(
      color: selected ? FlareColors.solid : FlareColors.pill,
      shape: StadiumBorder(
        side: BorderSide(
          color: selected ? Colors.transparent : FlareColors.hairline,
        ),
      ),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onTap,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 36),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    color: selected
                        ? FlareColors.onSolid
                        : FlareColors.secondary,
                  ),
                ),
                ?trailing,
              ],
            ),
          ),
        ),
      ),
    ),
  );
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
  bool _searching = false;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final catalog = widget.catalog;
    final tier = widget.store.settings.tier;
    final drills = catalog.searchDrills(_query, tier: tier, section: _section);
    final sectionLabel = _section == null
        ? s.allSections
        : catalog.sections.firstWhere((item) => item.id == _section).short;
    return Column(
      children: [
        PageHeader(
          title: s.library,
          onBack: widget.onBack,
          action: RoundIconButton(
            icon: _searching ? Icons.close_rounded : Icons.search_rounded,
            tooltip: _searching ? s.closeSearch : s.search,
            onPressed: () => setState(() {
              _searching = !_searching;
              if (!_searching) _query = '';
            }),
          ),
        ),
        Expanded(
          child: CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList.list(
                  children: [
                    if (_searching) ...[
                      TextField(
                        autofocus: true,
                        decoration: InputDecoration(
                          hintText: s.searchDrills,
                          prefixIcon: const Icon(Icons.search_rounded),
                        ),
                        onChanged: (value) => setState(() => _query = value),
                      ),
                      const SizedBox(height: 12),
                    ],
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          for (final item in [
                            ('A', s.tierA),
                            ('B', s.tierB),
                            ('C', s.tierC),
                          ])
                            _FilterPill(
                              label: item.$2,
                              selected: tier == item.$1,
                              onTap: () =>
                                  widget.store.updateSettings(tier: item.$1),
                            ),
                          PopupMenuButton<String?>(
                            tooltip: s.allSections,
                            color: FlareColors.popup,
                            initialValue: _section,
                            onSelected: (value) => setState(
                              () => _section = value == '' ? null : value,
                            ),
                            itemBuilder: (_) => [
                              PopupMenuItem(
                                value: '',
                                child: Text(s.allSections),
                              ),
                              for (final section in catalog.sections)
                                PopupMenuItem(
                                  value: section.id,
                                  child: Text(section.short),
                                ),
                            ],
                            child: IgnorePointer(
                              child: _FilterPill(
                                label: sectionLabel,
                                selected: false,
                                onTap: () {},
                                trailing: Padding(
                                  padding: EdgeInsets.only(left: 2),
                                  child: Icon(
                                    Icons.expand_more_rounded,
                                    size: 16,
                                    color: FlareColors.dim,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (widget.store.todayIds.isNotEmpty) ...[
                      SectionTitle(s.today),
                      for (final id in widget.store.todayIds)
                        if (catalog.drillById(id) case final Drill drill)
                          DrillTile(
                            drill: drill,
                            onTap: () => widget.onDrill(drill),
                            trailing: IconButton(
                              tooltip: s.remove,
                              icon: Icon(
                                Icons.remove_circle_outline,
                                size: 20,
                                color: FlareColors.dim,
                              ),
                              onPressed: () => widget.onRemove(id),
                            ),
                          ),
                    ],
                    const SizedBox(height: 16),
                    if (drills.isEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 40),
                        child: Center(
                          child: Text(
                            s.noResults,
                            style: TextStyle(color: FlareColors.dim),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                sliver: SliverGrid.builder(
                  itemCount: drills.length,
                  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                    maxCrossAxisExtent: 220,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: .78,
                  ),
                  itemBuilder: (context, index) {
                    final drill = drills[index];
                    final group = catalog.groupById(drill.groupId)!;
                    return DrillCard(
                      drill: drill,
                      groupLabel: group.label,
                      color: Color(group.colorValue),
                      onTap: () => widget.onDrill(drill),
                    );
                  },
                ),
              ),
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
    this.group,
  });
  final Drill drill;
  final MuscleGroup? group;
  final VoidCallback onBack;
  final VoidCallback onStart;
  final VoidCallback onAdd;
  final bool added;

  Widget _spec(String label, String value) => Expanded(
    child: Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 12, 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Eyebrow(label),
          const SizedBox(height: 5),
          Text(
            value,
            style: const TextStyle(
              fontSize: 15,
              height: 1.4,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    ),
  );

  Widget _cue(int index, String text) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 22,
          height: 22,
          margin: const EdgeInsets.only(top: 1),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: FlareColors.controlBorder),
          ),
          child: Text(
            '${index + 1}',
            style: TextStyle(fontSize: 11, color: FlareColors.secondary),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(text, style: const TextStyle(fontSize: 15, height: 1.55)),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final top = MediaQuery.paddingOf(context).top;
    final shown = drill.cues.take(2).toList();
    final rest = drill.cues.skip(2).toList();
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                Stack(
                  children: [
                    // The illustrations are dark studio renders: on the dark
                    // theme they melt into the page, on light they sit as a
                    // rounded photo plate.
                    ClipRRect(
                      borderRadius: FlareColors.palette.isDark
                          ? BorderRadius.zero
                          : const BorderRadius.vertical(
                              bottom: Radius.circular(28),
                            ),
                      child: AspectRatio(
                        aspectRatio: 1.08,
                        child: Image.asset(drill.imageAsset, fit: BoxFit.cover),
                      ),
                    ),
                    if (FlareColors.palette.isDark)
                      Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                FlareColors.background.withValues(alpha: 0),
                                FlareColors.background.withValues(alpha: 0),
                                FlareColors.background,
                              ],
                              stops: [0, .72, 1],
                            ),
                          ),
                        ),
                      ),
                    Positioned(
                      left: 16,
                      right: 16,
                      top: (8 - top).clamp(0, 8).toDouble() + 8,
                      child: Row(
                        children: [
                          RoundIconButton(
                            icon: Icons.arrow_back_ios_new_rounded,
                            tooltip: s.goBack,
                            onPressed: onBack,
                          ),
                          const Spacer(),
                          RoundIconButton(
                            icon: added
                                ? Icons.bookmark_added_rounded
                                : Icons.bookmark_add_outlined,
                            tooltip: added ? s.addedToday : s.addToday,
                            onPressed: added ? null : onAdd,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(
                    22,
                    FlareColors.palette.isDark ? 4 : 20,
                    22,
                    20,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          if (group != null) ...[
                            Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                color: Color(group!.colorValue),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 7),
                          ],
                          Expanded(
                            child: Eyebrow(
                              [
                                if (group != null) group!.label,
                                drill.tierLabel,
                              ].join(' · '),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        drill.name,
                        style: const TextStyle(
                          fontSize: 28,
                          height: 1.2,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        drill.nameEn,
                        style: TextStyle(color: FlareColors.dim, fontSize: 12),
                      ),
                      const SizedBox(height: 18),
                      Container(
                        decoration: BoxDecoration(
                          color: FlareColors.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: FlareColors.hairline),
                        ),
                        child: IntrinsicHeight(
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _spec(s.spec, drill.prescription),
                              const VerticalDivider(width: 1),
                              _spec(s.equipment, drill.equipment),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 22),
                      for (var i = 0; i < shown.length; i++) _cue(i, shown[i]),
                      const Divider(),
                      Disclosure(
                        title: s.moreCuesAndSafety,
                        children: [
                          for (var i = 0; i < rest.length; i++)
                            _cue(i + 2, rest[i]),
                          SectionTitle(s.mistake),
                          BodyText(drill.mistake),
                          SectionTitle(s.drillWhy),
                          BodyText(drill.why),
                          SectionTitle(s.safety),
                          BodyText(drill.safety ?? s.safetyBody),
                          if (drill.illustrationNote != null) ...[
                            SectionTitle(s.illustration),
                            BodyText(
                              drill.illustrationNote!,
                              color: FlareColors.dim,
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
            child: PrimaryAction(label: s.startTimer, onPressed: onStart),
          ),
        ],
      ),
    );
  }
}

class PathPage extends StatefulWidget {
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
  State<PathPage> createState() => _PathPageState();
}

class _PathPageState extends State<PathPage> {
  int? _open;

  Lesson? _nextLesson() {
    final store = widget.store;
    final stage = widget.catalog.stageByNumber(store.currentStage);
    if (stage == null) return null;
    for (final lesson in stage.lessons) {
      if (!store.completedLessonIds.contains(lesson.id)) return lesson;
    }
    return null;
  }

  Widget _marker(CourseStage stage, bool current) {
    final store = widget.store;
    final passed = store.isStagePassed(stage.n);
    return Container(
      width: 28,
      height: 28,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: passed
            ? FlareColors.success.withValues(alpha: .16)
            : FlareColors.background,
        border: Border.all(
          color: current
              ? FlareColors.accent
              : passed
              ? Colors.transparent
              : FlareColors.controlBorder,
          width: current ? 1.6 : 1,
        ),
      ),
      child: passed
          ? Icon(Icons.check_rounded, size: 16, color: FlareColors.success)
          : Text(
              '${stage.n}',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: current ? FlareColors.accent : FlareColors.dim,
              ),
            ),
    );
  }

  Widget _lessons(CourseStage stage, Lesson? next) {
    final s = context.strings;
    final store = widget.store;
    final unlocked = store.isStageUnlocked(stage.n);
    return Padding(
      padding: const EdgeInsets.only(top: 12, bottom: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          RowGroup(
            children: [
              for (final lesson in stage.lessons)
                FlareRow(
                  title: lesson.title,
                  subtitle: s.minutesShort(lesson.minutes),
                  leading: Icon(
                    store.completedLessonIds.contains(lesson.id)
                        ? Icons.check_circle_rounded
                        : lesson == next
                        ? Icons.circle
                        : Icons.circle_outlined,
                    size: 18,
                    color: store.completedLessonIds.contains(lesson.id)
                        ? FlareColors.success
                        : lesson == next
                        ? FlareColors.accent
                        : FlareColors.dim,
                  ),
                  onTap: () => widget.onLesson(lesson),
                ),
            ],
          ),
          if (stage.gates.isNotEmpty) ...[
            SectionTitle(s.stageGates),
            for (final gate in stage.gates)
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                dense: true,
                value: store.gateReports[gate.id] ?? false,
                onChanged: unlocked
                    ? (value) => widget.onGate(gate.id, value ?? false)
                    : null,
                title: Text(
                  gate.text,
                  style: const TextStyle(fontSize: 13, height: 1.45),
                ),
                controlAffinity: ListTileControlAffinity.leading,
              ),
          ],
          if (!unlocked)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Eyebrow(s.locked),
            ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final store = widget.store;
    final stages = widget.catalog.stages;
    final open = _open ?? store.currentStage;
    final next = _nextLesson();
    return Column(
      children: [
        PageHeader(
          title: s.pathTitle,
          onBack: widget.onBack,
          action: RoundIconButton(
            icon: Icons.fact_check_outlined,
            tooltip: s.assessment,
            onPressed: widget.onAssessment,
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
              for (final (index, stage) in stages.indexed)
                IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Column(
                        children: [
                          const SizedBox(height: 14),
                          _marker(stage, stage.n == store.currentStage),
                          Expanded(
                            child: index == stages.length - 1
                                ? const SizedBox()
                                : Container(
                                    width: 1,
                                    color: FlareColors.controlBorder,
                                  ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            InkWell(
                              borderRadius: BorderRadius.circular(12),
                              onTap: () => setState(
                                () => _open = open == stage.n ? 0 : stage.n,
                              ),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 14,
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      stage.title,
                                      style: TextStyle(
                                        fontSize: 17,
                                        fontWeight: FontWeight.w600,
                                        color: store.isStageUnlocked(stage.n)
                                            ? FlareColors.text
                                            : FlareColors.secondary,
                                      ),
                                    ),
                                    if (open == stage.n) ...[
                                      const SizedBox(height: 4),
                                      Eyebrow(
                                        store.isStagePassed(stage.n)
                                            ? s.passed
                                            : store.isStageUnlocked(stage.n)
                                            ? s.current
                                            : s.locked,
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ),
                            if (open == stage.n) _lessons(stage, next),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
          child: PrimaryAction(
            label: next == null ? s.allDone : s.continueLesson(next.title),
            onPressed: next == null ? null : () => widget.onLesson(next),
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
    final unlocked = store.isStageUnlocked(lesson.stage);
    return Column(
      children: [
        PageHeader(
          title: lesson.title,
          subtitle:
              '${s.stageLabel(lesson.stage)} · ${s.minutesShort(lesson.minutes)}',
          onBack: onBack,
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
              if (lesson.phases.isNotEmpty) ...[
                SectionTitle(s.lessonPhases),
                RowGroup(
                  children: [
                    for (final source in lesson.phases)
                      if (catalog.phaseBySource(source) case final Phase phase)
                        FlareRow(
                          title: phase.name,
                          subtitle: phase.caption,
                          leading: Text(
                            source.toString().padLeft(2, '0'),
                            style: TextStyle(
                              color: FlareColors.accent,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                  ],
                ),
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: onWatch,
                  icon: const Icon(Icons.view_in_ar_outlined, size: 18),
                  label: Text(s.watchPhases),
                ),
              ],
              SectionTitle(s.suggestedDrills),
              for (final id in lesson.drills)
                if (catalog.drillById(id) case final Drill drill)
                  DrillTile(drill: drill, onTap: () => onDrill(drill)),
              if (!unlocked)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Eyebrow(s.locked),
                ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
          child: PrimaryAction(
            icon: complete ? Icons.check_rounded : null,
            label: complete ? s.lessonCompleted : s.markLesson,
            onPressed: unlocked && !complete ? onComplete : null,
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
        PageHeader(
          title: s.assessment,
          subtitle: s.assessmentNote,
          onBack: widget.onBack,
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            children: [
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
                  dropdownColor: FlareColors.popup,
                  borderRadius: BorderRadius.circular(16),
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
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                  ],
                  onChanged: (value) {
                    if (value != null) setState(() => _grades[item.$1] = value);
                  },
                ),
              ],
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
          child: PrimaryAction(
            label: s.saveAssessment,
            onPressed: _busy
                ? null
                : () async {
                    setState(() => _busy = true);
                    await widget.onSave(Map.of(_grades));
                    if (mounted) setState(() => _busy = false);
                  },
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: TextButton(
            onPressed: _busy ? null : widget.onSkip,
            child: Text(
              s.skipAssessment,
              style: TextStyle(color: FlareColors.secondary),
            ),
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
    this.now,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Drill> onDrill;
  final VoidCallback? onBack;
  final DateTime Function()? now;

  Widget _stat(String value, String label) => Expanded(
    child: Container(
      padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: FlareColors.hairline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: const TextStyle(
              fontSize: 40,
              height: 1.1,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Eyebrow(label),
        ],
      ),
    ),
  );

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final today = (now ?? DateTime.now)();
    final day = DateTime(today.year, today.month, today.day);
    final monday = day.subtract(Duration(days: day.weekday - 1));
    final trained = {
      for (final session in store.sessions)
        if (session.completedSets > 0 || session.activeSeconds > 0)
          DateTime(
            session.startedAt.toLocal().year,
            session.startedAt.toLocal().month,
            session.startedAt.toLocal().day,
          ),
    };
    final labels = s.weekdayLabels.split(',');
    return Column(
      children: [
        PageHeader(title: s.history, onBack: onBack),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
            children: [
              Row(
                children: [
                  _stat('${store.weekTrainingDays}', s.weekDays),
                  const SizedBox(width: 12),
                  _stat('${store.streakDays}', s.streak),
                ],
              ),
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  for (var i = 0; i < 7; i++)
                    Column(
                      children: [
                        Container(
                          width: 30,
                          height: 30,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color:
                                trained.contains(monday.add(Duration(days: i)))
                                ? FlareColors.accent
                                : FlareColors.surface,
                            border: monday.add(Duration(days: i)) == day
                                ? Border.all(
                                    color: FlareColors.secondary,
                                    width: 1,
                                  )
                                : null,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          labels[i],
                          style: TextStyle(
                            fontSize: 11,
                            color: FlareColors.dim,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
              SectionTitle(s.recent),
              if (store.sessions.isEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Text(
                    s.historyEmpty,
                    style: TextStyle(color: FlareColors.dim),
                  ),
                )
              else
                RowGroup(
                  children: [
                    for (final session in store.sessions.reversed.take(30))
                      if (catalog.drillById(session.drillId)
                          case final Drill drill)
                        FlareRow(
                          title: drill.name,
                          subtitle:
                              '${_dateLabel(session.startedAt.toLocal(), day, s.todayLabel)} · ${s.setsLabel(session.completedSets, session.plannedSets)}',
                          trailing: Text(
                            session.pain
                                ? s.painFlag
                                : session.completed
                                ? s.completed
                                : s.incomplete,
                            style: TextStyle(
                              fontSize: 12,
                              color: session.pain
                                  ? FlareColors.warning
                                  : session.completed
                                  ? FlareColors.secondary
                                  : FlareColors.dim,
                            ),
                          ),
                          onTap: () => onDrill(drill),
                        ),
                  ],
                ),
            ],
          ),
        ),
      ],
    );
  }

  String _dateLabel(DateTime date, DateTime today, String todayLabel) {
    final time =
        '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    if (DateTime(date.year, date.month, date.day) == today) {
      return '$todayLabel $time';
    }
    return '${date.month}/${date.day} $time';
  }
}
