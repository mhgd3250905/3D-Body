import 'package:intl/intl.dart';
import 'package:flutter/material.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'motion.dart';
import 'theme.dart';
import 'drill_media.dart';
import 'app_glass.dart';
import 'page_kit.dart';
import 'drill_filter.dart';

/// The three-rule safety card. Shown once before entering, and from Settings.
Future<bool?> showSafetySheet(BuildContext context) {
  final s = context.strings;
  return showModalBottomSheet<bool>(
    context: context,
    sheetAnimationStyle: FlareMotion.sheetStyle(context),
    isScrollControlled: true,
    builder: (sheet) => SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Eyebrow(s.safetySheetEyebrow),
            const SizedBox(height: 4),
            Text(
              s.safetySheetTitle,
              style: const TextStyle(
                fontSize: 22,
                height: 1.25,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 24),
            for (final (index, rule) in [
              (s.safetyRule1, s.safetyRule1Note),
              (s.safetyRule2, s.safetyRule2Note),
              (s.safetyRule3, s.safetyRule3Note),
            ].indexed)
              Padding(
                padding: EdgeInsets.only(top: index == 0 ? 0 : 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: FlareColors.accent.withValues(alpha: .12),
                        borderRadius: BorderRadius.circular(8),
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
                    const SizedBox(width: 12),
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
                          const SizedBox(height: 4),
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
            const SizedBox(height: 24),
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
                // 20pt page margin; SafeArea supplies the home-indicator inset.
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
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
                    const SizedBox(height: 24),
                    Text(
                      s.brandEyebrow,
                      style: TextStyle(
                        color: FlareColors.accentInk,
                        fontSize: 12,
                        letterSpacing: .3,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      s.welcomeHeadline,
                      style: const TextStyle(
                        fontSize: 28,
                        height: 1.2,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      s.welcomeLine,
                      style: TextStyle(
                        fontSize: 15,
                        height: 1.45,
                        color: FlareColors.secondary,
                      ),
                    ),
                    const SizedBox(height: 24),
                    PrimaryAction(
                      label: s.startApp,
                      onPressed: _busy ? null : _start,
                    ),
                    const SizedBox(height: 4),
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
        FlareNavBar(title: s.library, onBack: widget.onBack),
        FlareDrillFilter(
          catalog: catalog,
          controller: _searchController,
          query: _query,
          tier: tier,
          section: _section,
          searchKey: const ValueKey('library-search'),
          clearKey: const ValueKey('library-clear-search'),
          onQueryChanged: _queryChanged,
          onTier: (value) => widget.store.updateSettings(tier: value),
          onSection: (value) => setState(() => _selectSection(value)),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: ScrollEdge(
            child: CustomScrollView(
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: SliverList.list(
                    children: [
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
                  sliver: SliverCardRows(
                    itemCount: drills.length,
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
        // Fits long labels (Dosierung, Оборудование at 1.5×) without
        // breaking mid-word, but never eats the value column.
        ConstrainedBox(
          constraints: const BoxConstraints(minWidth: 56, maxWidth: 124),
          child: Eyebrow(label),
        ),
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
            color: FlareColors.accent.withValues(alpha: .14),
          ),
          child: Text(
            '${index + 1}',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: FlareColors.accentInk,
            ),
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
          FlareNavBar(title: drill.name, onBack: widget.onBack),
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
                      FlareListGroup(
                        children: [
                          _spec(s.spec, drill.prescription),
                          _spec(s.equipment, drill.equipment),
                        ],
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
          FlareBottomAction(
            child: LayoutBuilder(
              builder: (context, box) {
                // When 加入计划 cannot fit at a readable size (long languages
                // at 320 / 1.5× text) it becomes a labelled icon button
                // instead of shrinking to unreadable type.
                final label = TextPainter(
                  text: TextSpan(
                    text: s.planAddTo,
                    style: FlareType.secondaryButton,
                  ),
                  textScaler: MediaQuery.textScalerOf(context),
                  textDirection: Directionality.of(context),
                  maxLines: 1,
                )..layout();
                final compact = label.width + 64 > box.maxWidth * .46;
                label.dispose();
                return Row(
                  children: [
                    if (compact)
                      SizedBox.square(
                        dimension: FlareBottomAction.buttonHeight,
                        child: IconButton.filledTonal(
                          key: const ValueKey('drill-add-to-plan'),
                          tooltip: s.planAddTo,
                          style: IconButton.styleFrom(
                            backgroundColor: FlareColors.secondaryFill,
                            foregroundColor: FlareColors.text,
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.all(
                                Radius.circular(FlareGeometry.buttonRadius),
                              ),
                            ),
                          ),
                          onPressed: () {
                            FlareHaptics.light();
                            widget.onAddToPlan();
                          },
                          icon: const Icon(
                            Icons.playlist_add_rounded,
                            size: 22,
                          ),
                        ),
                      )
                    else
                      ConstrainedBox(
                        // Long languages / large text: the secondary pill shrinks
                        // its label instead of pushing 开始 off screen.
                        constraints: BoxConstraints(
                          maxWidth: box.maxWidth * .46,
                        ),
                        child: FlareSecondaryButton(
                          key: const ValueKey('drill-add-to-plan'),
                          expand: false,
                          icon: Icons.playlist_add_rounded,
                          label: s.planAddTo,
                          onPressed: () {
                            FlareHaptics.light();
                            widget.onAddToPlan();
                          },
                        ),
                      ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: PrimaryAction(
                        label: s.startTimer,
                        onPressed: widget.onStart,
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// 训练记录 as an achievement page. Every number comes from the local
/// session log: current streak, sessions, minutes, days trained, this week,
/// a 16-week heatmap, and streak milestones earned on their real dates.
class ProgressPage extends StatefulWidget {
  const ProgressPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onDrill,
    this.onBack,
    this.onStart,
    this.now,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Drill> onDrill;
  final VoidCallback? onBack;

  /// Empty state's 去练第一个动作 (opens the library). Hidden when null.
  final VoidCallback? onStart;
  final DateTime Function()? now;

  static const milestones = [3, 7, 14, 30, 60, 100];

  /// First day each streak milestone was reached, over all history.
  static Map<int, DateTime> earnedDates(Set<DateTime> days) {
    final sorted = days.toList()..sort();
    final earned = <int, DateTime>{};
    var run = 0;
    DateTime? previous;
    for (final day in sorted) {
      final next = previous == null
          ? null
          : DateTime(previous.year, previous.month, previous.day + 1);
      run = next == day ? run + 1 : 1;
      previous = day;
      for (final m in milestones) {
        if (run >= m) earned.putIfAbsent(m, () => day);
      }
    }
    return earned;
  }

  @override
  State<ProgressPage> createState() => _ProgressPageState();
}

class _ProgressPageState extends State<ProgressPage> {
  int? _celebrate;

  @override
  void initState() {
    super.initState();
    final earned = ProgressPage.earnedDates(widget.store.trainingDates);
    if (earned.isEmpty) return;
    final best = earned.keys.reduce((a, b) => a > b ? a : b);
    if (best > widget.store.celebratedStreak) {
      // One-time: shown on this visit, persisted so it never repeats.
      _celebrate = best;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) widget.store.markStreakCelebrated(best);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final store = widget.store;
    final today = (widget.now ?? DateTime.now)();
    final day = DateTime(today.year, today.month, today.day);
    final days = store.trainingDates;
    final logged = store.sessions
        .where((x) => x.completedSets > 0 || x.activeSeconds > 0)
        .toList();
    final body = logged.isEmpty
        ? _EmptyRecords(onStart: widget.onStart)
        : ScrollEdge(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
              children: [
                if (_celebrate case final int unlocked)
                  FadeSlideIn(child: _CelebrateBanner(days: unlocked)),
                _Hero(
                  streak: store.streakDays,
                  sessions: logged.length,
                  minutes: store.totalActiveSeconds ~/ 60,
                  days: days.length,
                ),
                FlareSection(s.recordsThisWeek),
                _WeekStrip(trained: days, today: day),
                FlareSection(s.recordsHeatmap),
                _Heatmap(sessions: logged, today: day),
                FlareSection(s.recordsMilestones),
                _Milestones(
                  earned: ProgressPage.earnedDates(days),
                  streak: store.streakDays,
                ),
                FlareSection(s.recent),
                FlareListGroup(
                  children: [
                    for (final session
                        in (logged
                              ..sort((a, b) => b.endedAt.compareTo(a.endedAt)))
                            .take(30))
                      if (widget.catalog.drillById(session.drillId)
                          case final Drill drill)
                        FlareListRow(
                          title: drill.name,
                          subtitle:
                              '${_dateLabel(session.startedAt.toLocal(), day, s.todayLabel, s.localeName)} · ${s.setsLabel(session.completedSets, session.plannedSets).replaceAll(' ', '\u00a0')}',
                          trailing: _StatusTag(
                            label: session.pain
                                ? s.painFlag
                                : session.completed
                                ? s.completed
                                : s.incomplete,
                            color: session.pain
                                ? FlareColors.warning
                                : session.completed
                                ? FlareColors.success
                                : FlareColors.dim,
                          ),
                          onTap: () => widget.onDrill(drill),
                        ),
                  ],
                ),
              ],
            ),
          );
    return Column(
      children: [
        FlareNavBar(title: s.history, onBack: widget.onBack),
        Expanded(child: body),
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

class _CelebrateBanner extends StatelessWidget {
  const _CelebrateBanner({required this.days});
  final int days;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    // Plain r16 surface with the hairline rim (no tint wash, no shadow in
    // light); the accent lives only in the small icon tile.
    child: FlareStaticSurface(
      key: const ValueKey('records-celebrate'),
      padding: const EdgeInsets.fromLTRB(12, 12, 16, 12),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: FlareColors.accent.withValues(alpha: .12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              Icons.emoji_events_rounded,
              color: FlareColors.accentInk,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              context.strings.milestoneUnlocked(days),
              style: const TextStyle(
                fontSize: 14,
                height: 1.35,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

class _Hero extends StatelessWidget {
  const _Hero({
    required this.streak,
    required this.sessions,
    required this.minutes,
    required this.days,
  });
  final int streak;
  final int sessions;
  final int minutes;
  final int days;

  Widget _stat(String value, String label) => Expanded(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        FittedBox(
          fit: BoxFit.scaleDown,
          alignment: AlignmentDirectional.centerStart,
          child: Text(
            value,
            maxLines: 1,
            style: const TextStyle(
              fontSize: 20,
              height: 1.2,
              fontWeight: FontWeight.w600,
              fontFeatures: [FontFeature.tabularFigures()],
            ),
          ),
        ),
        const SizedBox(height: 4),
        FlareWordSafeText(
          label,
          style: TextStyle(fontSize: 12, height: 1.3, color: FlareColors.dim),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return FlareStaticSurface(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Semantics(
            label: '${s.streak} $streak',
            child: ExcludeSemantics(
              child: Wrap(
                crossAxisAlignment: WrapCrossAlignment.end,
                spacing: 6,
                children: [
                  Text(
                    '$streak',
                    textScaler: MediaQuery.textScalerOf(
                      context,
                    ).clamp(maxScaleFactor: 1.2),
                    style: TextStyle(
                      fontSize: 32,
                      height: 1.1,
                      fontWeight: FontWeight.w600,
                      color: FlareColors.accentInk,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 5),
                    child: Text(
                      s.recordsStreakUnit,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: FlareColors.dim,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Divider(height: 1, thickness: .5, color: FlareColors.hairline),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _stat('$sessions', s.recordsSessions),
              const SizedBox(width: 12),
              _stat('$minutes', s.recordsMinutes),
              const SizedBox(width: 12),
              _stat('$days', s.recordsDays),
            ],
          ),
        ],
      ),
    );
  }
}

/// Mon–Sun: trained = solid orange with a check, today = ring, future = faint.
class _WeekStrip extends StatelessWidget {
  const _WeekStrip({required this.trained, required this.today});
  final Set<DateTime> trained;
  final DateTime today;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final labels = s.weekdayLabels.split(',');
    final monday = DateTime(
      today.year,
      today.month,
      today.day - today.weekday + 1,
    );
    return FlareStaticSurface(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
      child: Row(
        children: [
          for (var i = 0; i < 7; i++)
            Expanded(
              child: Builder(
                builder: (context) {
                  final date = DateTime(
                    monday.year,
                    monday.month,
                    monday.day + i,
                  );
                  final done = trained.contains(date);
                  final isToday = date == today;
                  final future = date.isAfter(today);
                  return Semantics(
                    label: done
                        ? s.trainedOn(s.weekDayLabel(labels[i]))
                        : s.notTrainedOn(s.weekDayLabel(labels[i])),
                    child: ExcludeSemantics(
                      child: Opacity(
                        opacity: future ? .4 : 1,
                        child: Column(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: done
                                    ? FlareColors.accent
                                    : FlareColors.palette.track,
                                border: isToday
                                    ? Border.all(
                                        color: done
                                            ? FlareColors.text
                                            : FlareColors.accent,
                                        width: 2,
                                      )
                                    : null,
                              ),
                              child: done
                                  ? Icon(
                                      Icons.check_rounded,
                                      size: 18,
                                      color: FlareColors.onAccent,
                                    )
                                  : null,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              labels[i],
                              maxLines: 1,
                              textScaler: MediaQuery.textScalerOf(
                                context,
                              ).clamp(maxScaleFactor: 1.3),
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: isToday
                                    ? FontWeight.w700
                                    : FontWeight.w400,
                                color: isToday
                                    ? FlareColors.text
                                    : FlareColors.dim,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}

/// 16 weeks × 7 days, oldest left; shade by sessions that day (1, 2, 3+).
class _Heatmap extends StatelessWidget {
  const _Heatmap({required this.sessions, required this.today});
  final List<TrainingSession> sessions;
  final DateTime today;
  static const weeks = 16;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final counts = <DateTime, int>{};
    for (final x in sessions) {
      final t = x.endedAt.toLocal();
      final d = DateTime(t.year, t.month, t.day);
      counts[d] = (counts[d] ?? 0) + 1;
    }
    final monday = DateTime(
      today.year,
      today.month,
      today.day - today.weekday + 1,
    );
    final start = DateTime(
      monday.year,
      monday.month,
      monday.day - 7 * (weeks - 1),
    );
    Color shade(int n) => switch (n) {
      0 => FlareColors.palette.track,
      1 => FlareColors.accent.withValues(alpha: .4),
      2 => FlareColors.accent.withValues(alpha: .7),
      _ => FlareColors.accent,
    };
    final legend = TextStyle(fontSize: 11, color: FlareColors.dim);
    return FlareStaticSurface(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          LayoutBuilder(
            builder: (context, box) {
              const gap = 3.0;
              final cell = (box.maxWidth - gap * (weeks - 1)) / weeks;
              return ExcludeSemantics(
                child: Row(
                  children: [
                    for (var w = 0; w < weeks; w++) ...[
                      if (w > 0) const SizedBox(width: gap),
                      Column(
                        children: [
                          for (var d = 0; d < 7; d++) ...[
                            if (d > 0) const SizedBox(height: gap),
                            Builder(
                              builder: (_) {
                                final date = DateTime(
                                  start.year,
                                  start.month,
                                  start.day + w * 7 + d,
                                );
                                final future = date.isAfter(today);
                                return Container(
                                  width: cell,
                                  height: cell,
                                  decoration: BoxDecoration(
                                    color: future
                                        ? Colors.transparent
                                        : shade(counts[date] ?? 0),
                                    borderRadius: BorderRadius.circular(3),
                                    border: date == today
                                        ? Border.all(
                                            color: FlareColors.text,
                                            width: 1.2,
                                          )
                                        : null,
                                  ),
                                );
                              },
                            ),
                          ],
                        ],
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(s.heatLess, style: legend),
              const SizedBox(width: 6),
              for (final n in [0, 1, 2, 3]) ...[
                Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: shade(n),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(width: 3),
              ],
              const SizedBox(width: 3),
              Text(s.heatMore, style: legend),
            ],
          ),
        ],
      ),
    );
  }
}

/// Earned: orange badge + date. Next one: progress + 还差 N 天. Rest dimmed.
class _Milestones extends StatelessWidget {
  const _Milestones({required this.earned, required this.streak});
  final Map<int, DateTime> earned;
  final int streak;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final next = ProgressPage.milestones.firstWhere(
      (m) => !earned.containsKey(m) && m > streak,
      orElse: () => -1,
    );
    Widget badge(int m) {
      final date = earned[m];
      final got = date != null;
      final isNext = m == next;
      final sub = got
          ? s.milestoneEarned(DateFormat.Md(s.localeName).format(date))
          : isNext
          ? s.milestoneLeft(m - streak)
          : s.milestoneLocked;
      return Opacity(
        key: ValueKey('milestone-$m'),
        opacity: got || isNext ? 1 : .45,
        child: Column(
          children: [
            SizedBox.square(
              dimension: 60,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  if (isNext)
                    SizedBox.expand(
                      child: CircularProgressIndicator(
                        value: (streak / m).clamp(0, 1).toDouble(),
                        strokeWidth: 3,
                        color: FlareColors.accent,
                        backgroundColor: FlareColors.palette.track,
                      ),
                    ),
                  Container(
                    width: isNext ? 48 : 56,
                    height: isNext ? 48 : 56,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: got
                          ? FlareColors.accent
                          : FlareColors.palette.track,
                    ),
                    child: Text(
                      '$m',
                      textScaler: TextScaler.noScaling,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: got
                            ? FlareColors.onAccent
                            : FlareColors.secondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            FlareWordSafeText(
              s.milestoneDays(m),
              align: TextAlign.center,
              maxLines: 3,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 2),
            // Two lines, centered: «Осталось 4 дня» / «تحقق في …» at 320 pt
            // and 1.5× text wrap at a space instead of being cut.
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: FlareWordSafeText(
                sub,
                align: TextAlign.center,
                maxLines: 2,
                style: TextStyle(
                  fontSize: 11,
                  height: 1.2,
                  color: got ? FlareColors.accentInk : FlareColors.dim,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return FlareStaticSurface(
      padding: const EdgeInsets.fromLTRB(8, 16, 8, 14),
      child: Column(
        children: [
          for (var row = 0; row < 2; row++) ...[
            if (row > 0) const SizedBox(height: 16),
            Row(
              children: [
                for (final m in ProgressPage.milestones.skip(row * 3).take(3))
                  Expanded(child: badge(m)),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

/// Status as a small fixed pill that never wraps.
class _StatusTag extends StatelessWidget {
  const _StatusTag({required this.label, required this.color});
  final String label;
  final Color color;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    decoration: BoxDecoration(
      color: color.withValues(alpha: .14),
      borderRadius: BorderRadius.circular(999),
    ),
    child: Text(
      label,
      maxLines: 1,
      softWrap: false,
      textScaler: MediaQuery.textScalerOf(context).clamp(maxScaleFactor: 1.2),
      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color),
    ),
  );
}

class _EmptyRecords extends StatelessWidget {
  const _EmptyRecords({this.onStart});
  final VoidCallback? onStart;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 48),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              key: const ValueKey('records-empty'),
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: FlareColors.accent.withValues(alpha: .14),
              ),
              child: Icon(
                Icons.emoji_events_outlined,
                size: 56,
                color: FlareColors.accentInk,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              s.recordsEmptyTitle,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              s.historyEmpty,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                height: 1.45,
                color: FlareColors.dim,
              ),
            ),
            if (onStart != null) ...[
              const SizedBox(height: 28),
              PrimaryAction(
                key: const ValueKey('records-start'),
                label: s.recordsEmptyAction,
                onPressed: onStart,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
