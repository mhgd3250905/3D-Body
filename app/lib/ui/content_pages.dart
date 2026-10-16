import 'package:intl/intl.dart';
import 'package:flutter/material.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'motion.dart';
import 'theme.dart';
import 'drill_media.dart';

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
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 44),
          child: Row(
            children: [
              SizedBox(
                width: 44,
                child: onBack == null
                    ? null
                    : RoundIconButton(
                        icon: Icons.arrow_back_ios_new_rounded,
                        tooltip: context.strings.goBack,
                        onPressed: onBack,
                      ),
              ),
              Expanded(
                child: Semantics(
                  header: true,
                  child: Text(
                    title,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: large ? 24 : 20,
                      height: 1.2,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 44, child: action),
            ],
          ),
        ),
        if (subtitle != null)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Eyebrow(subtitle!),
          ),
      ],
    ),
  );
}

/// The three-rule safety card. Shown once before entering, and from Settings.
Future<bool?> showSafetySheet(BuildContext context) {
  final s = context.strings;
  return showModalBottomSheet<bool>(
    context: context,
    sheetAnimationStyle: FlareMotion.sheetStyle(context),
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
                          color: FlareColors.accentInk,
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
    final accepted = await showSafetySheet(context);
    if (!mounted) return;
    if (accepted == true) await _enter(false);
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
                        frameBuilder: (context, child, frame, sync) =>
                            fadeInFrame(context, child, frame, sync),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      s.brandEyebrow,
                      style: TextStyle(
                        color: FlareColors.accentInk,
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
  });
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(right: 8),
    child: Semantics(
      selected: selected,
      button: true,
      child: Pressable(
        scale: .95,
        child: AnimatedContainer(
          duration: FlareMotion.of(context, FlareMotion.fade),
          curve: FlareMotion.standard,
          decoration: ShapeDecoration(
            color: selected ? FlareColors.solid : FlareColors.pill,
            shape: StadiumBorder(
              side: BorderSide(
                color: selected ? Colors.transparent : FlareColors.hairline,
              ),
            ),
          ),
          child: Material(
            type: MaterialType.transparency,
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
                          fontWeight: selected
                              ? FontWeight.w600
                              : FontWeight.w400,
                          color: selected
                              ? FlareColors.onSolid
                              : FlareColors.secondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
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
    this.onBack,
    this.initialGroup,
    this.initialQuery,
    this.onQueryChanged,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Drill> onDrill;
  final VoidCallback? onBack;
  final MuscleGroup? initialGroup;
  final String? initialQuery;
  final ValueChanged<String>? onQueryChanged;
  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  late final TextEditingController _searchController;
  String get _query => _searchController.text;
  String? _section;
  @override
  void initState() {
    super.initState();
    _section = widget.initialGroup?.section;
    _searchController = TextEditingController(
      text: widget.initialQuery ?? widget.initialGroup?.label ?? '',
    );
  }

  @override
  void didUpdateWidget(LibraryPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialGroup != widget.initialGroup) {
      _section = widget.initialGroup?.section;
    }
    if (oldWidget.initialQuery != widget.initialQuery ||
        oldWidget.initialGroup != widget.initialGroup) {
      final query = widget.initialQuery ?? widget.initialGroup?.label ?? '';
      if (_query != query) {
        _searchController.value = TextEditingValue(
          text: query,
          selection: TextSelection.collapsed(offset: query.length),
        );
      }
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _selectSection(String? section) {
    _section = section;
  }

  void _queryChanged(String value) {
    setState(() {});
    widget.onQueryChanged?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final catalog = widget.catalog;
    final tier = widget.store.settings.tier;
    final drills = catalog.searchDrills(_query, tier: tier, section: _section);
    return Column(
      children: [
        PageHeader(title: s.library, onBack: widget.onBack),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
          child: TextField(
            key: const ValueKey('library-search'),
            controller: _searchController,
            textInputAction: TextInputAction.search,
            decoration: InputDecoration(
              hintText: s.searchDrills,
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: _query.isEmpty
                  ? null
                  : IconButton(
                      key: const ValueKey('library-clear-search'),
                      tooltip: s.clearSearch,
                      icon: const Icon(Icons.close_rounded),
                      onPressed: () {
                        _searchController.clear();
                        _queryChanged('');
                      },
                    ),
            ),
            onChanged: _queryChanged,
            onSubmitted: (_) => FocusScope.of(context).unfocus(),
          ),
        ),
        Expanded(
          child: ScrollEdge(
            child: CustomScrollView(
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: SliverList.list(
                    children: [
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _FilterPill(
                              label: s.allSections,
                              selected: _section == null,
                              onTap: () => setState(() => _selectSection(null)),
                            ),
                            for (final section in catalog.sections)
                              _FilterPill(
                                label: section.short,
                                selected: _section == section.id,
                                onTap: () {
                                  FlareHaptics.selection();
                                  setState(() => _selectSection(section.id));
                                },
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      FlareSegmented<String>(
                        expand: true,
                        segments: [
                          ('A', s.sceneNone),
                          ('B', s.sceneHome),
                          ('C', s.sceneGym),
                        ],
                        selected: tier,
                        onChanged: (value) {
                          if (value == tier) return;
                          FlareHaptics.selection();
                          widget.store.updateSettings(tier: value);
                        },
                      ),
                      const SizedBox(height: 16),
                      if (drills.isEmpty)
                        EmptyNote(
                          icon: Icons.search_off_rounded,
                          text: s.noResults,
                          top: 40,
                        ),
                    ],
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                  sliver: SliverLayoutBuilder(
                    builder: (context, constraints) => SliverGrid.builder(
                      itemCount: drills.length,
                      gridDelegate:
                          constraints.crossAxisExtent <= 700 ||
                              MediaQuery.sizeOf(context).shortestSide < 600
                          ? const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              mainAxisSpacing: 12,
                              crossAxisSpacing: 12,
                              childAspectRatio: .78,
                            )
                          : const SliverGridDelegateWithMaxCrossAxisExtent(
                              maxCrossAxisExtent: 220,
                              mainAxisSpacing: 12,
                              crossAxisSpacing: 12,
                              childAspectRatio: .78,
                            ),
                      itemBuilder: (context, index) {
                        final drill = drills[index];
                        final group = catalog.groupById(drill.groupId)!;
                        // Re-keyed per filter so a new result set eases in,
                        // staggered from the top.
                        return FadeSlideIn(
                          key: ValueKey('$tier|$_section|$_query|${drill.id}'),
                          delay: FadeSlideIn.stagger(index),
                          child: DrillCard(
                            drill: drill,
                            groupLabel: group.shortLabel,
                            color: Color(group.colorValue),
                            onTap: () => widget.onDrill(drill),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class DrillDetailPage extends StatefulWidget {
  const DrillDetailPage({
    super.key,
    required this.drill,
    required this.onBack,
    required this.onStart,
    required this.onAddToPlan,
    this.group,
  });
  final Drill drill;
  final MuscleGroup? group;
  final VoidCallback onBack;
  final VoidCallback onStart;
  final VoidCallback onAddToPlan;

  @override
  State<DrillDetailPage> createState() => _DrillDetailPageState();
}

class _DrillDetailPageState extends State<DrillDetailPage> {
  Drill get drill => widget.drill;
  MuscleGroup? get group => widget.group;

  /// One fact per line, label left and value right, so long Chinese doses
  /// ("3 组 × 每侧 20–30 秒") stay on one line instead of breaking mid-unit.
  Widget _spec(String label, String value) => Padding(
    padding: const EdgeInsets.fromLTRB(16, 13, 16, 13),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(width: 56, child: Eyebrow(label)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 15,
              height: 1.4,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
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
    final shown = drill.cues.take(2).toList();
    final rest = drill.cues.skip(2).toList();
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          PageHeader(
            title: drill.name,
            large: false,
            onBack: widget.onBack,
            action: RoundIconButton(
              key: const ValueKey('drill-add-to-plan'),
              icon: Icons.playlist_add_rounded,
              tooltip: s.planAddTo,
              onPressed: () {
                FlareHaptics.light();
                widget.onAddToPlan();
              },
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                DrillMediaCard(
                  key: ValueKey('demo:${drill.id}'),
                  drillId: drill.id,
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(22, 4, 22, 20),
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
                                // Same words as the library's scene filter.
                                switch (drill.tier) {
                                  'B' => s.sceneHome,
                                  'C' => s.sceneGym,
                                  _ => s.sceneNone,
                                },
                              ].join(' · '),
                            ),
                          ),
                        ],
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
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _spec(s.spec, drill.prescription),
                            const Divider(height: 1, indent: 16, endIndent: 16),
                            _spec(s.equipment, drill.equipment),
                          ],
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
            child: PrimaryAction(
              label: s.startTimer,
              onPressed: widget.onStart,
            ),
          ),
        ],
      ),
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
            session.endedAt.toLocal().year,
            session.endedAt.toLocal().month,
            session.endedAt.toLocal().day,
          ),
    };
    final labels = s.weekdayLabels.split(',');
    return Column(
      children: [
        PageHeader(title: s.history, onBack: onBack),
        Expanded(
          child: ScrollEdge(
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
                      Semantics(
                        label: trained.contains(monday.add(Duration(days: i)))
                            ? s.trainedOn(s.weekDayLabel(labels[i]))
                            : s.notTrainedOn(s.weekDayLabel(labels[i])),
                        child: ExcludeSemantics(
                          child: Column(
                            children: [
                              Container(
                                width: 30,
                                height: 30,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color:
                                      trained.contains(
                                        monday.add(Duration(days: i)),
                                      )
                                      ? FlareColors.accent
                                      : FlareColors.palette.track,
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
                        ),
                      ),
                  ],
                ),
                SectionTitle(s.recent),
                if (store.sessions.isEmpty)
                  EmptyNote(icon: Icons.insights_outlined, text: s.historyEmpty)
                else
                  RowGroup(
                    children: [
                      for (final session
                          in (store.sessions.toList()..sort(
                                (a, b) => b.endedAt.compareTo(a.endedAt),
                              ))
                              .take(30))
                        if (catalog.drillById(session.drillId)
                            case final Drill drill)
                          FlareRow(
                            title: drill.name,
                            subtitle:
                                '${_dateLabel(session.startedAt.toLocal(), day, s.todayLabel, s.localeName)} · ${s.setsLabel(session.completedSets, session.plannedSets)}',
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
        ),
      ],
    );
  }

  String _dateLabel(
    DateTime date,
    DateTime today,
    String todayLabel,
    String locale,
  ) {
    final time =
        '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    if (DateTime(date.year, date.month, date.day) == today) {
      return '$todayLabel $time';
    }
    return '${DateFormat.MMMd(locale).format(date)} $time';
  }
}
