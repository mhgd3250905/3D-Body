import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import '../coach/plan_mapping.dart';
import '../trainer/flare_plan_resume.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/training_plan_adapter.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../data/flare_shared_library.dart';
import '../data/flare_public_media.dart';
import 'components.dart';
import 'page_kit.dart';
import 'drill_filter.dart';
import 'flare_action_artwork.dart';
import 'flare_plan_detail_page.dart' show FlarePlanWarmupLink;
import 'flare_plan_visuals.dart' show FlarePlanGlow;
import 'motion.dart';
import 'theme.dart';

export 'flare_plan_detail_page.dart';

bool _routineHasItem(TrainingRoutine routine, String drillId) =>
    routine.sdkPlan?.items.any((item) => item.exerciseId == drillId) ??
    routine.drillIds.contains(drillId);

/// Bundled poster for a plan row or card. Every drill — Flare's own catalog
/// and the SDK shared scope — has one under `assets/public_posters/`; the old
/// `assets/drill_media/<id>.jpg` stills were removed with the SDK media move.
String drillPosterAsset(Drill drill) =>
    drill.thumbnailAsset.startsWith(FlarePublicMedia.posterRoot)
    ? drill.thumbnailAsset
    : '${FlarePublicMedia.posterRoot}${drill.id}.webp';

/// Still poster of a drill's video. Never plays: plan surfaces are for
/// choosing, and the drill page owns playback.
class DrillPoster extends StatelessWidget {
  const DrillPoster(this.drill, {super.key});
  final Drill drill;
  @override
  Widget build(BuildContext context) {
    final bundled = FlarePublicMedia.of(context)?.posterAssetFor(drill.id);
    return ColoredBox(
      color: FlareColors.raised,
      child: FlareActionArtwork(
        actionId: drill.id,
        thumbnail: true,
        fit: BoxFit.cover,
        fallback: Image.asset(
          bundled == null
              ? drillPosterAsset(drill)
              : FlarePublicMedia.thumbnailAssetFor(drill.id),
          fit: BoxFit.cover,
          gaplessPlayback: true,
          excludeFromSemantics: true,
          errorBuilder: (_, _, _) => Center(
            child: Icon(
              Icons.fitness_center_outlined,
              size: 20,
              color: FlareColors.dim,
            ),
          ),
        ),
      ),
    );
  }
}

/// Up to three overlapping round posters, for a compact row.
class _Stack extends StatelessWidget {
  const _Stack(this.drills);
  final List<Drill> drills;
  @override
  Widget build(BuildContext context) {
    final shown = drills.take(3).toList();
    const size = 40.0, step = 14.0;
    return SizedBox(
      width: size + step * 2,
      height: size,
      child: Stack(
        children: [
          for (var i = shown.length - 1; i >= 0; i--)
            Positioned(
              left: step * i,
              child: Container(
                width: size,
                height: size,
                padding: const EdgeInsets.all(2),
                decoration: BoxDecoration(
                  color: FlareColors.surface,
                  shape: BoxShape.circle,
                ),
                child: ClipOval(child: DrillPoster(shown[i])),
              ),
            ),
        ],
      ),
    );
  }
}

/// Training entry points shared with the angle and muscle hub.
class PlansPage extends StatelessWidget {
  const PlansPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onRoutine,
    required this.onNewRoutine,
    required this.onOpenAngle,
    required this.onOpenMuscle,
    required this.onAllAngles,
    required this.onAllMuscles,
    required this.onContinue,
    this.onOpenSupplemental,
    this.resume,
    this.onBack,
    this.onAiCoach,
    this.aiCoachConfigured = true,
  });

  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<TrainingRoutine> onRoutine;
  final VoidCallback onNewRoutine;
  final ValueChanged<Phase> onOpenAngle;
  final ValueChanged<MuscleGroup> onOpenMuscle;
  final VoidCallback onAllAngles;
  final VoidCallback onAllMuscles;
  final VoidCallback onContinue;
  final ValueChanged<FlarePlan>? onOpenSupplemental;
  final FlarePlanResume? resume;
  final VoidCallback? onBack;
  final VoidCallback? onAiCoach;
  final bool aiCoachConfigured;

  static const _pageInset = 22.0;
  static const _bottomFade = 84.0;
  static const _featuredAngles = [11, 9, 15];
  static const _featuredMuscles = [
    'deltoids',
    'triceps',
    'forearms',
    'rotator-cuff',
  ];

  Widget _routineRow(BuildContext context, TrainingRoutine routine) {
    final s = context.strings;
    final plan = routine.sdkPlan;
    final mapper = CoachPlanMapper(
      catalog,
      shared: FlareShared.current?.catalog,
    );
    final drills = plan == null
        ? routine.drills(catalog)
        : [for (final item in plan.items) ?mapper.drillById(item.exerciseId)];
    final minutes = plan == null
        ? estimateMinutes(drills)
        : (estimateTrainingPlanSeconds(plan, catalog) / 60).ceil().clamp(
            1,
            999,
          );
    return FlareListRow(
      key: ValueKey('routine-${routine.id}'),
      leading: _Stack(drills),
      title: routine.name,
      subtitle: s.planMeta(plan?.items.length ?? drills.length, minutes),
      onTap: () => onRoutine(routine),
    );
  }

  @override
  Widget build(BuildContext context) {
    Theme.of(context);
    final p = FlareColors.palette;
    final s = context.strings;
    final sectionLabelStyle = TextStyle(
      color: p.dim,
      fontSize: 12,
      fontWeight: FontWeight.w600,
      letterSpacing: 1.5,
    );
    final safe = MediaQuery.viewPaddingOf(context);
    final resume = this.resume;
    final routines = store.routines;
    final aiCoach = onAiCoach;
    final openSupplemental = onOpenSupplemental;
    final supplemental = [?catalog.flareWarmupPlan, ?catalog.flareCooldownPlan];
    final routineRowCount = routines.length + (aiCoach == null ? 0 : 1);
    final angles = [
      for (final source in {
        ..._featuredAngles,
        ...catalog.phases.map((phase) => phase.source),
      })
        if (catalog.phaseBySource(source) case final phase?)
          if (catalog
                  .plansForAngle(source)
                  .where((plan) => plan.tier == 1)
                  .firstOrNull
              case final beginner?)
            (phase, beginner),
    ];
    final shared = FlareShared.current;
    final scene = store.settings.tier;
    int? minutesFor(FlarePlan plan) =>
        shared?.authoredPlanMinutes(plan, catalog, scene);
    int? shortestPlan(Iterable<FlarePlan> plans) {
      final minutes = plans.map(minutesFor).whereType<int>();
      return minutes.isEmpty ? null : minutes.reduce(math.min);
    }

    final muscles = [
      for (final id in {..._featuredMuscles, ...catalog.flarePlanMuscles})
        if (catalog.groupById(id) case final group?)
          if (catalog.plansForMuscle(id) case final plans when plans.isNotEmpty)
            (group, shortestPlan(plans)),
    ];

    return ColoredBox(
      color: p.background,
      child: FlareScrollNav(
        onBack: onBack,
        child: Stack(
          fit: StackFit.expand,
          children: [
            CustomScrollView(
              key: const PageStorageKey<String>('plans-scroll'),
              slivers: [
                SliverPadding(
                  padding: EdgeInsets.fromLTRB(
                    _pageInset,
                    safe.top + FlareGeometry.navRow + FlareGeometry.navFade,
                    _pageInset,
                    0,
                  ),
                  sliver: SliverToBoxAdapter(
                    child: Semantics(
                      header: true,
                      child: Text(
                        s.plans,
                        style: TextStyle(
                          color: p.text,
                          fontSize: 30,
                          height: 1.2,
                          fontWeight: FontWeight.w700,
                          letterSpacing: -.4,
                        ),
                      ),
                    ),
                  ),
                ),
                if (openSupplemental != null && supplemental.isNotEmpty)
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
                    sliver: SliverToBoxAdapter(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 6),
                            child: Semantics(
                              header: true,
                              child: Text(
                                s.warmupCooldownHeading,
                                style: sectionLabelStyle,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            spacing: 10,
                            children: [
                              for (final plan in supplemental)
                                Expanded(
                                  child: _SupplementalPlanCard(
                                    plan: plan,
                                    onTap: () => openSupplemental(plan),
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(
                    _pageInset,
                    24,
                    _pageInset,
                    0,
                  ),
                  sliver: SliverList.list(
                    children: [
                      Semantics(
                        header: true,
                        child: Text(s.plansMine, style: sectionLabelStyle),
                      ),
                      const SizedBox(height: 12),
                      if (resume != null) ...[
                        _LastPlanCard(resume: resume, onContinue: onContinue),
                        const SizedBox(height: 12),
                      ],
                      _NewPlanRow(
                        withHistory: resume != null,
                        onTap: onNewRoutine,
                      ),
                    ],
                  ),
                ),
                if (routineRowCount > 0)
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(
                      _pageInset,
                      12,
                      _pageInset,
                      0,
                    ),
                    sliver: DecoratedSliver(
                      decoration: BoxDecoration(
                        color: FlareListGroup.fill(),
                        borderRadius: const BorderRadius.all(
                          Radius.circular(FlareGeometry.groupRadius),
                        ),
                      ),
                      sliver: SliverList.separated(
                        itemCount: routineRowCount,
                        separatorBuilder: (_, _) => Padding(
                          padding: const EdgeInsetsDirectional.only(
                            start: FlareGeometry.rowTextStart,
                          ),
                          child: SizedBox(
                            height: FlareGeometry.hairline,
                            child: ColoredBox(
                              color: p.text.withValues(alpha: .10),
                            ),
                          ),
                        ),
                        itemBuilder: (context, index) {
                          const radius = Radius.circular(
                            FlareGeometry.groupRadius,
                          );
                          final first = index == 0;
                          final last = index == routineRowCount - 1;
                          return ClipRRect(
                            borderRadius: BorderRadius.vertical(
                              top: first ? radius : Radius.zero,
                              bottom: last ? radius : Radius.zero,
                            ),
                            clipBehavior: first || last
                                ? Clip.antiAlias
                                : Clip.none,
                            child: index < routines.length
                                ? _routineRow(context, routines[index])
                                : FlareListRow(
                                    key: const ValueKey('plan-ai-coach'),
                                    leading: const FlareRowIcon(
                                      Icons.auto_awesome_rounded,
                                    ),
                                    title: s.plansAiTitle,
                                    subtitle: aiCoachConfigured
                                        ? s.plansAiHint
                                        : s.plansAiUnavailable,
                                    onTap: aiCoach,
                                  ),
                          );
                        },
                      ),
                    ),
                  ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(
                    _pageInset,
                    24,
                    _pageInset,
                    0,
                  ),
                  sliver: SliverToBoxAdapter(
                    child: _PlansSection(
                      title: s.plansAnglesTitle,
                      description: s.plansAnglesDescription,
                      count: angles.length,
                      actionKey: const ValueKey('plan-all-angles'),
                      onAll: onAllAngles,
                    ),
                  ),
                ),
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 212,
                    child: ListView.separated(
                      key: const PageStorageKey<String>('plan-angle-carousel'),
                      scrollDirection: Axis.horizontal,
                      primary: false,
                      padding: const EdgeInsets.symmetric(
                        horizontal: _pageInset,
                      ),
                      itemCount: angles.length,
                      separatorBuilder: (_, _) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        final (phase, beginner) = angles[index];
                        return _AnglePlanCard(
                          phase: phase,
                          beginner: beginner,
                          minutes: minutesFor(beginner),
                          usesBothHands:
                              catalog.supportFor(phase.source) == 'both',
                          onTap: () => onOpenAngle(phase),
                        );
                      },
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(
                    _pageInset,
                    24,
                    _pageInset,
                    0,
                  ),
                  sliver: SliverToBoxAdapter(
                    child: _PlansSection(
                      title: s.plansMusclesTitle,
                      description: s.plansMusclesDescription,
                      count: muscles.length,
                      actionKey: const ValueKey('plan-all-muscles'),
                      onAll: onAllMuscles,
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: _pageInset),
                  sliver: SliverGrid.builder(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisExtent: 64,
                          mainAxisSpacing: 10,
                          crossAxisSpacing: 10,
                        ),
                    itemCount: muscles.length,
                    itemBuilder: (context, index) {
                      final (group, minutes) = muscles[index];
                      return _MusclePlanCard(
                        group: group,
                        minutes: minutes,
                        onTap: () => onOpenMuscle(group),
                      );
                    },
                  ),
                ),
                SliverToBoxAdapter(
                  child: SizedBox(height: _bottomFade + safe.bottom),
                ),
              ],
            ),
            PositionedDirectional(
              start: 0,
              end: 0,
              bottom: 0,
              height: _bottomFade + safe.bottom,
              child: IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [p.background.withValues(alpha: 0), p.background],
                      stops: [0, _bottomFade / (_bottomFade + safe.bottom)],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LastPlanCard extends StatelessWidget {
  const _LastPlanCard({required this.resume, required this.onContinue});

  static const _height = 148.0;
  static const _radius = 24.0;
  static const _artTopOverflow = 28.0;
  static const _artEndOverflow = 8.0;

  final FlarePlanResume resume;
  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    final progress = resume.total == 0
        ? 0.0
        : (resume.completed / resume.total).clamp(0.0, 1.0);
    final tier = switch (resume.tier) {
      1 => s.planTierBeginner,
      2 => s.planTierIntermediate,
      3 => s.planTierAdvanced,
      _ => null,
    };
    final date = resume.endedAt.toLocal();
    final now = DateTime.now();
    final dateLabel = DateUtils.isSameDay(date, now)
        ? s.plansToday
        : DateUtils.isSameDay(date, DateTime(now.year, now.month, now.day - 1))
        ? s.plansYesterday
        : MaterialLocalizations.of(context).formatShortDate(date);
    final art = switch ((resume.phaseSource, resume.groupId)) {
      (final int source, _) => 'assets/angles/v5-phase-$source.png',
      (_, final String id) => 'assets/plan_resume_muscles/$id.webp',
      _ => null,
    };
    final gradient = _planAccentGradient(p);

    return Container(
      key: const ValueKey('plan-last-session'),
      height: _height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(_radius),
        gradient: RadialGradient(
          center: const Alignment(.7, -.2),
          radius: .83,
          colors: [
            p.isDark
                ? const Color(0xff2a1a14)
                : Color.alphaBlend(p.accent.withValues(alpha: .12), p.surface),
            p.surface,
          ],
        ),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(_radius),
                border: Border.all(color: p.hairline),
              ),
            ),
          ),
          if (art != null)
            PositionedDirectional(
              end: -_artEndOverflow,
              top: -_artTopOverflow,
              bottom: 0,
              width: _height + _artTopOverflow,
              child: IgnorePointer(
                child: ClipPath(
                  clipper: _LastPlanArtClipper(Directionality.of(context)),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      const PositionedDirectional(
                        end: 5,
                        top: _artTopOverflow - 1,
                        child: FlarePlanGlow(diameter: 150),
                      ),
                      Image.asset(
                        art,
                        // The rear-support pose's head sits beside the CTA.
                        alignment: resume.phaseSource == 9
                            ? AlignmentDirectional.bottomStart
                            : AlignmentDirectional.bottomEnd,
                        fit: BoxFit.contain,
                        excludeFromSemantics: true,
                        errorBuilder: (_, _, _) => const SizedBox.shrink(),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          PositionedDirectional(
            start: 16,
            end: art == null ? 16 : (resume.phaseSource == null ? 122 : 135),
            top: 17,
            bottom: 55,
            child: Align(
              alignment: AlignmentDirectional.topStart,
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: AlignmentDirectional.topStart,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      s.plansLastSession,
                      style: TextStyle(
                        color: p.accentInk,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      resume.title,
                      style: TextStyle(
                        color: p.text,
                        fontSize: 21,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      [
                        ?tier,
                        s.plansFinishedCount(resume.completed, resume.total),
                        dateLabel,
                      ].join(' · '),
                      style: TextStyle(color: p.dim, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ),
          PositionedDirectional(
            start: 16,
            bottom: 22,
            width: 110,
            height: 4,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(2),
              child: ColoredBox(
                color: p.isDark ? const Color(0x1affffff) : p.track,
                child: Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: FractionallySizedBox(
                    widthFactor: progress,
                    heightFactor: 1,
                    child: DecoratedBox(
                      decoration: BoxDecoration(gradient: gradient),
                    ),
                  ),
                ),
              ),
            ),
          ),
          if (resume.canContinue)
            PositionedDirectional(
              end: 16,
              bottom: 12,
              child: FlarePressable(
                key: const ValueKey('plan-continue'),
                onTap: onContinue,
                child: Container(
                  height: 36,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: gradient,
                    boxShadow: [
                      BoxShadow(
                        color: p.accent.withValues(alpha: .36),
                        blurRadius: 14,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      MediaQuery.withClampedTextScaling(
                        maxScaleFactor: 1.35,
                        child: Text(
                          s.plansContinue,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Icon(
                        Directionality.of(context) == TextDirection.rtl
                            ? Icons.arrow_back_rounded
                            : Icons.arrow_forward_rounded,
                        size: 15,
                        color: Colors.white,
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _LastPlanArtClipper extends CustomClipper<Path> {
  const _LastPlanArtClipper(this.direction);

  final TextDirection direction;

  @override
  Path getClip(Size size) {
    const corner = Radius.circular(_LastPlanCard._radius);
    const bleed = _LastPlanCard._artEndOverflow;
    final rtl = direction == TextDirection.rtl;
    // The artwork can extend past the top and end. The bottom corner follows
    // the card's curve and shares its exact bottom edge.
    return Path()
      ..addRect(Rect.fromLTRB(0, 0, size.width, size.height - corner.y))
      ..addRRect(
        RRect.fromRectAndCorners(
          Rect.fromLTRB(
            rtl ? bleed : 0,
            0,
            rtl ? size.width : size.width - bleed,
            size.height,
          ),
          bottomLeft: rtl ? corner : Radius.zero,
          bottomRight: rtl ? Radius.zero : corner,
        ),
      );
  }

  @override
  bool shouldReclip(_LastPlanArtClipper oldClipper) =>
      oldClipper.direction != direction;
}

LinearGradient _planAccentGradient(FlarePalette p) => LinearGradient(
  colors: [p.accent, Color.alphaBlend(const Color(0x22000000), p.accent)],
);

class _NewPlanRow extends StatelessWidget {
  const _NewPlanRow({required this.withHistory, required this.onTap});

  final bool withHistory;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    final hint = withHistory ? s.plansNewCompactHint : s.plansNewEmptyHint;
    return FlarePressable(
      key: const ValueKey('plan-new'),
      onTap: onTap,
      child: CustomPaint(
        painter: _PlansDashedOutline(
          p.isDark ? const Color(0x24ffffff) : const Color(0x24000000),
        ),
        child: SizedBox(
          height: withHistory ? 52 : 72,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                DecoratedBox(
                  decoration: BoxDecoration(
                    color: p.accent.withValues(alpha: .14),
                    shape: BoxShape.circle,
                  ),
                  child: SizedBox.square(
                    dimension: 26,
                    child: Icon(
                      Icons.add_rounded,
                      size: 19,
                      color: p.accentInk,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Flexible(
                  child: FittedBox(
                    alignment: AlignmentDirectional.centerStart,
                    fit: BoxFit.scaleDown,
                    child: Text(
                      s.planNew,
                      style: TextStyle(
                        color: p.text,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: FittedBox(
                    alignment: AlignmentDirectional.centerEnd,
                    fit: BoxFit.scaleDown,
                    child: Text(
                      hint,
                      style: TextStyle(color: p.dim, fontSize: 12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PlansDashedOutline extends CustomPainter {
  const _PlansDashedOutline(this.color);

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final outline = Path()
      ..addRRect(
        RRect.fromRectAndRadius(
          (Offset.zero & size).deflate(.5),
          const Radius.circular(16),
        ),
      );
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    for (final metric in outline.computeMetrics()) {
      for (var start = 0.0; start < metric.length; start += 8) {
        canvas.drawPath(
          metric.extractPath(start, math.min(start + 4, metric.length)),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant _PlansDashedOutline oldDelegate) =>
      oldDelegate.color != color;
}

class _PlansSection extends StatelessWidget {
  const _PlansSection({
    required this.title,
    required this.description,
    required this.count,
    required this.actionKey,
    required this.onAll,
  });

  final String title;
  final String description;
  final int count;
  final Key actionKey;
  final VoidCallback onAll;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Semantics(
                header: true,
                child: Text(
                  title,
                  style: TextStyle(
                    color: p.text,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            FlarePressable(
              key: actionKey,
              onTap: onAll,
              child: ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 32),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    MediaQuery.withClampedTextScaling(
                      maxScaleFactor: 1.35,
                      child: Text(
                        context.strings.plansSeeAll(count),
                        style: TextStyle(color: p.dim, fontSize: 12),
                      ),
                    ),
                    const SizedBox(width: 2),
                    Icon(
                      Directionality.of(context) == TextDirection.rtl
                          ? Icons.chevron_left_rounded
                          : Icons.chevron_right_rounded,
                      size: 16,
                      color: p.dim,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        Text(description, style: TextStyle(color: p.dim, fontSize: 12)),
        const SizedBox(height: 12),
      ],
    );
  }
}

class _AnglePlanCard extends StatelessWidget {
  const _AnglePlanCard({
    required this.phase,
    required this.beginner,
    required this.minutes,
    required this.usesBothHands,
    required this.onTap,
  });

  final Phase phase;
  final FlarePlan beginner;
  final int? minutes;
  final bool usesBothHands;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    return FlarePressable(
      key: ValueKey('plan-angle-${phase.source}'),
      onTap: onTap,
      child: Container(
        width: 168,
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: p.hairline),
        ),
        child: Stack(
          children: [
            PositionedDirectional(
              top: 4,
              start: 0,
              end: 0,
              height: 132,
              child: Image.asset(
                'assets/angles/v5-phase-${phase.source}.webp',
                fit: BoxFit.contain,
                excludeFromSemantics: true,
              ),
            ),
            PositionedDirectional(
              top: 76,
              start: 0,
              end: 0,
              height: 60,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [p.surface.withValues(alpha: 0), p.surface],
                  ),
                ),
              ),
            ),
            PositionedDirectional(
              start: 14,
              end: 14,
              top: 130,
              bottom: 12,
              child: Align(
                alignment: AlignmentDirectional.bottomStart,
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: AlignmentDirectional.bottomStart,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        usesBothHands
                            ? s.plansTwoHandSupport
                            : s.plansOneHandSupport,
                        style: TextStyle(
                          color: p.accentInk,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        phase.name,
                        style: TextStyle(
                          color: p.text,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        [
                          s.planTierBeginner,
                          if (minutes case final value?) s.minutesShort(value),
                          s.planDrillCount(beginner.items.length),
                        ].join(' · '),
                        style: TextStyle(color: p.dim, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SupplementalPlanCard extends StatelessWidget {
  const _SupplementalPlanCard({required this.plan, required this.onTap});

  final FlarePlan plan;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    final warmup = plan.kind == FlarePlanKind.warmup;
    final title = warmup ? s.preWorkoutWarmup : s.postWorkoutStretch;
    final subtitle = s.bodyweightPlanMinutes(plan.estimatedMinutes!);
    final circle = switch ((p.isDark, warmup)) {
      (true, true) => const Color(0xffff6a3d).withValues(alpha: .14),
      (true, false) => const Color(0xff5eead4).withValues(alpha: .12),
      (false, true) => const Color(0xfff2602f).withValues(alpha: .09),
      (false, false) => const Color(0xff2ec4b6).withValues(alpha: .11),
    };

    return FlarePressable(
      key: ValueKey('plan-${plan.id}'),
      semanticLabel: '$title, $subtitle',
      onTap: onTap,
      child: Container(
        height: 64,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: p.hairline),
          boxShadow: [
            if (!p.isDark)
              const BoxShadow(
                color: Color(0x0a000000),
                offset: Offset(0, 2),
                blurRadius: 10,
              ),
          ],
        ),
        child: Row(
          spacing: 10,
          children: [
            SizedBox.square(
              dimension: 44,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: circle,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Image.asset(
                    warmup
                        ? 'assets/plan_icons/icon-warmup.png'
                        : 'assets/plan_icons/icon-stretch.png',
                    width: warmup ? 40 : 38,
                    height: warmup ? 40 : 38,
                    excludeFromSemantics: true,
                  ),
                ),
              ),
            ),
            Expanded(
              child: MediaQuery.withClampedTextScaling(
                maxScaleFactor: 1.2,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: p.text,
                        fontSize: 14,
                        height: 1.16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: p.dim, fontSize: 11),
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
}

class _MusclePlanCard extends StatelessWidget {
  const _MusclePlanCard({
    required this.group,
    required this.minutes,
    required this.onTap,
  });

  final MuscleGroup group;
  final int? minutes;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    return FlarePressable(
      key: ValueKey('plan-muscle-${group.id}'),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: p.hairline),
        ),
        child: Row(
          children: [
            SizedBox.square(
              dimension: 42,
              child: ClipOval(
                child: ColoredBox(
                  color: p.raised,
                  child: Image.asset(
                    'assets/muscles/${group.id}.webp',
                    fit: BoxFit.cover,
                    excludeFromSemantics: true,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: AlignmentDirectional.centerStart,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      group.shortLabel,
                      style: TextStyle(
                        color: p.text,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      [
                        s.plansThreeLevels,
                        if (minutes case final value?) s.hubMinutesFrom(value),
                      ].join(' · '),
                      style: TextStyle(color: p.dim, fontSize: 11),
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
}

/// A saved personal plan, with its actions in training order.
class PlanDetailPage extends StatelessWidget {
  const PlanDetailPage({
    super.key,
    required this.title,
    required this.drills,
    required this.onBack,
    required this.onStart,
    required this.onDrill,
    this.onCopy,
    this.onEdit,
    this.onOpenWarmup,
    this.sdkPlan,
    this.catalog,
    this.soundEnabled = true,
  });
  final String title;
  final List<Drill> drills;
  final VoidCallback onBack;
  final VoidCallback onStart;
  final ValueChanged<Drill> onDrill;
  final uc.TrainingPlan? sdkPlan;
  final Catalog? catalog;
  final bool soundEnabled;

  final VoidCallback? onCopy;
  final VoidCallback? onEdit;
  final VoidCallback? onOpenWarmup;

  /// Consecutive entries of one block, keeping their global index.
  static List<List<(int, CoachPlanEntry)>> _blocks(
    List<CoachPlanEntry> entries,
  ) {
    final out = <List<(int, CoachPlanEntry)>>[];
    int? last;
    for (final (index, entry) in entries.indexed) {
      final block = entry.blockIndex;
      if (last != block) out.add([]);
      last = block;
      out.last.add((index, entry));
    }
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final plan = sdkPlan;
    final mapper = catalog == null
        ? null
        : CoachPlanMapper(catalog!, shared: FlareShared.current?.catalog);
    final available =
        plan == null || (mapper != null && mapper.missingIds(plan).isEmpty);
    final entries = plan != null && available ? mapper!.entries(plan) : null;
    final minutes = plan == null
        ? estimateMinutes(drills)
        : (estimateTrainingPlanSeconds(plan, catalog) / 60).ceil().clamp(
            1,
            999,
          );
    final ts = trainerStrings(s);
    return FlareNavPage(
      title: title,
      subtitle: s.planMeta(entries?.length ?? drills.length, minutes),
      onBack: onBack,
      action: onEdit == null
          ? null
          : FlareNavIconButton(
              key: const ValueKey('plan-edit'),
              icon: Icons.edit_outlined,
              tooltip: s.planEdit,
              onPressed: onEdit,
            ),
      blurBackdrop: false,
      body: ScrollEdge(
        child: ListView(
          padding: EdgeInsets.fromLTRB(
            20,
            flareNavInset(context, hasSubtitle: true),
            20,
            20,
          ),
          children: [
            if (!available)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Text(
                  ts.mediaUnavailable,
                  style: TextStyle(color: FlareColors.warning),
                ),
              ),
            if (entries != null)
              for (final block in _blocks(entries)) ...[
                FlareSection(
                  [
                    block.first.$2.block.name,
                    if (block.first.$2.block.type == uc.BlockType.circuit)
                      ts.roundOf(1, block.first.$2.block.rounds),
                    if (block.first.$2.block.type == uc.BlockType.circuit)
                      '${s.rest} · ${s.secondsLabel(block.first.$2.block.restBetweenRoundsSeconds)}',
                  ].where((part) => part.isNotEmpty).join(' · '),
                ),
                FlareListGroup(
                  children: [
                    for (final (index, entry) in block)
                      _NumberedDrill(
                        key: ValueKey('sdk-plan-row-$index'),
                        index: index,
                        drill: entry.drill,
                        doseText: entry.doseText,
                        grouped: true,
                        // Shared public actions open the SDK details.
                        onTap: () => catalog!.drillById(entry.drill.id) == null
                            ? FlareShared.openDetail(
                                context,
                                entry.drill.id,
                                soundEnabled: soundEnabled,
                              )
                            : onDrill(entry.drill),
                      ),
                  ],
                ),
              ],
            if (entries == null) ...[
              const SizedBox(height: 16),
              FlareListGroup(
                children: [
                  for (final (index, drill) in drills.indexed)
                    FadeSlideIn(
                      key: ValueKey('plan-row-${drill.id}'),
                      delay: FadeSlideIn.stagger(index),
                      child: _NumberedDrill(
                        index: index,
                        drill: drill,
                        grouped: true,
                        onTap: () => onDrill(drill),
                      ),
                    ),
                ],
              ),
            ],
            const SizedBox(height: 12),
            if (onCopy != null)
              Center(
                child: TextButton.icon(
                  key: const ValueKey('plan-copy'),
                  onPressed: onCopy,
                  icon: const Icon(Icons.copy_outlined, size: 18),
                  label: Text(s.premiumCopyRoutine),
                ),
              ),
          ],
        ),
      ),
      bottomBar: FlareBottomAction(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if ((onOpenWarmup, catalog?.flareWarmupPlan?.estimatedMinutes)
                case (final open?, final minutes?))
              FlarePlanWarmupLink(onOpen: open, minutes: minutes),
            PrimaryAction(
              key: const ValueKey('plan-start'),
              icon: Icons.play_arrow_rounded,
              label: s.planStart,
              onPressed:
                  (plan == null ? drills.isEmpty : plan.items.isEmpty) ||
                      !available
                  ? null
                  : onStart,
            ),
          ],
        ),
      ),
    );
  }
}

class _NumberedDrill extends StatelessWidget {
  const _NumberedDrill({
    super.key,
    required this.index,
    required this.drill,
    required this.onTap,
    this.trailing,
    this.doseText,
    this.grouped = false,
  });

  /// Inside a [FlareListGroup]: no own panel, no gap.
  final bool grouped;
  final int index;
  final Drill drill;
  final VoidCallback onTap;
  final Widget? trailing;
  final String? doseText;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: grouped ? 0 : 8),
      child: RepaintBoundary(
        child: Material(
          color: grouped ? Colors.transparent : FlareColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(grouped ? 0 : 16),
            side: grouped
                ? BorderSide.none
                : BorderSide(color: FlareColors.hairline, width: .5),
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  SizedBox(
                    width: 28,
                    child: Center(
                      child: Text(
                        '${index + 1}',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: FlareColors.dim,
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: SizedBox.square(
                      dimension: 52,
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
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          doseText ?? drill.prescription,
                          style: TextStyle(
                            color: FlareColors.dim,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  trailing ??
                      Padding(
                        padding: const EdgeInsets.only(right: 4),
                        child: Icon(
                          Icons.chevron_right_rounded,
                          color: FlareColors.dim,
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

/// Create or edit one of the user's sets: a name, drills in order, add more
/// from a picker, drag to reorder, swipe-free removal with a clear button.
class RoutineEditorPage extends StatefulWidget {
  const RoutineEditorPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onBack,
    required this.onSaved,
    this.routine,
    this.seedName,
    this.seedDrillIds = const [],
    this.onDeleted,
    this.allowSave,
    this.readOnly = false,
  });
  final Catalog catalog;
  final LearningStore store;
  final VoidCallback onBack;
  final ValueChanged<TrainingRoutine> onSaved;
  final TrainingRoutine? routine;
  final String? seedName;
  final List<String> seedDrillIds;
  final VoidCallback? onDeleted;
  final Future<bool> Function()? allowSave;
  final bool readOnly;
  @override
  State<RoutineEditorPage> createState() => _RoutineEditorPageState();
}

class _RoutineEditorPageState extends State<RoutineEditorPage> {
  late final TextEditingController _name = TextEditingController(
    text: widget.routine?.name ?? widget.seedName ?? '',
  );
  late List<String> _ids = [
    ...(widget.routine?.drillIds ?? widget.seedDrillIds),
  ];
  bool _busy = false;

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _add() async {
    if (widget.readOnly) return;
    final picked = await showDrillPicker(
      context,
      catalog: widget.catalog,
      initialTier: widget.store.settings.tier,
      exclude: _ids.toSet(),
      room: TrainingRoutine.maxDrills - _ids.length,
    );
    if (!mounted || widget.readOnly || picked == null || picked.isEmpty) return;
    setState(() => _ids = [..._ids, ...picked]);
  }

  Future<void> _save() async {
    if (widget.readOnly ||
        _busy ||
        !(await widget.allowSave?.call() ?? true) ||
        !mounted ||
        widget.readOnly ||
        _busy) {
      return;
    }
    final s = context.strings;
    var name = _name.text.trim();
    if (name.isEmpty) name = s.planDefaultName;
    name = TrainingRoutine.truncateName(name);
    setState(() => _busy = true);
    final existing = widget.routine;
    TrainingRoutine? saved;
    if (existing == null) {
      saved = await widget.store.createRoutine(name, _ids);
    } else {
      await widget.store.updateRoutine(existing.id, name: name, drillIds: _ids);
      saved = widget.store.routineById(existing.id);
    }
    if (!mounted) return;
    setState(() => _busy = false);
    if (saved != null) {
      FlareHaptics.success();
      widget.onSaved(saved);
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    // A saved AI plan keeps its own targets; show and estimate with them, the
    // same targets the routine still holds after saving.
    final doses = widget.routine?.doses ?? const <String, RoutineDose>{};
    final drills = [
      for (final id in _ids)
        if (widget.catalog.drillById(id) case final Drill drill)
          switch (doses[id]) {
            final RoutineDose dose => drill.withDose(dose.apply(drill.dose)),
            null => drill,
          },
    ];
    final full = _ids.length >= TrainingRoutine.maxDrills;
    return FlareNavPage(
      title: widget.routine == null ? s.planNew : s.planEdit,
      onBack: widget.onBack,
      blurBackdrop: false,
      body: ScrollEdge(
        child: ReorderableListView.builder(
          padding: EdgeInsets.fromLTRB(20, flareNavInset(context), 20, 20),
          buildDefaultDragHandles: false,
          header: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              FlareFieldGroup(
                label: s.planNameHint,
                field: TextField(
                  key: const ValueKey('routine-name'),
                  controller: _name,
                  readOnly: widget.readOnly,
                  canRequestFocus: !widget.readOnly,
                  maxLength: TrainingRoutine.maxName,
                  textInputAction: TextInputAction.done,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                  ),
                  decoration: InputDecoration(
                    hintText: s.planDefaultName,
                    counterText: '',
                  ),
                  onSubmitted: (_) => FocusScope.of(context).unfocus(),
                ),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: Eyebrow(
                      drills.isEmpty
                          ? s.planEmptyDrills
                          : '${s.planMeta(drills.length, estimateMinutes(drills))}'
                                '${drills.length > 1 ? ' · ${s.planReorderHint}' : ''}',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
          footer: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FlareListGroup(
                  children: [
                    FlareListRow(
                      key: const ValueKey('routine-add'),
                      leading: const FlareRowIcon(Icons.add_rounded),
                      title: s.planAddDrills,
                      trailing: const SizedBox.shrink(),
                      onTap: widget.readOnly || full ? null : _add,
                    ),
                  ],
                ),
                if (widget.onDeleted != null) ...[
                  const SizedBox(height: 28),
                  FlareListGroup(
                    children: [
                      FlareListRow(
                        key: const ValueKey('routine-delete'),
                        title: s.planDelete,
                        destructive: true,
                        trailing: const SizedBox.shrink(),
                        onTap: widget.readOnly || _busy
                            ? null
                            : widget.onDeleted,
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          itemCount: drills.length,
          onReorderItem: (from, to) {
            if (widget.readOnly) return;
            FlareHaptics.selection();
            setState(() {
              final id = _ids.removeAt(from);
              _ids.insert(to, id);
            });
          },
          // Dark lifts the dragged row; light outlines it with a
          // hairline instead of a drop shadow (开哥 2026-11-03).
          proxyDecorator: (child, _, _) => Material(
            color: Colors.transparent,
            elevation: FlareColors.palette.isDark ? 6 : 0,
            shadowColor: Colors.black38,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: FlareColors.palette.isDark
                  ? BorderSide.none
                  : BorderSide(color: FlareColors.hairline, width: .5),
            ),
            child: child,
          ),
          itemBuilder: (context, index) {
            final drill = drills[index];
            return _NumberedDrill(
              key: ValueKey('edit-${drill.id}'),
              index: index,
              drill: drill,
              onTap: () {},
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    tooltip: s.planRemoveDrill,
                    icon: Icon(
                      Icons.remove_circle_outline_rounded,
                      size: 20,
                      color: FlareColors.dim,
                    ),
                    onPressed: widget.readOnly
                        ? null
                        : () {
                            FlareHaptics.light();
                            setState(() => _ids.remove(drill.id));
                          },
                  ),
                  ReorderableDragStartListener(
                    enabled: !widget.readOnly,
                    index: index,
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(4, 12, 8, 12),
                      child: Icon(
                        Icons.drag_indicator_rounded,
                        color: FlareColors.dim,
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
      bottomBar: FlareBottomAction(
        child: PrimaryAction(
          key: const ValueKey('routine-save'),
          label: s.planSave,
          onPressed: widget.readOnly || _busy || _ids.isEmpty ? null : _save,
        ),
      ),
    );
  }
}

/// Multi-select from the whole library. Returns the newly chosen IDs in the
/// order they were tapped, or null when dismissed.
Future<List<String>?> showDrillPicker(
  BuildContext context, {
  required Catalog catalog,
  required String initialTier,
  Set<String> exclude = const {},
  int room = TrainingRoutine.maxDrills,
}) => showModalBottomSheet<List<String>>(
  context: context,
  isScrollControlled: true,
  sheetAnimationStyle: FlareMotion.sheetStyle(context),
  builder: (sheet) => RepaintBoundary(
    child: _DrillPicker(
      catalog: catalog,
      initialTier: initialTier,
      exclude: exclude,
      room: room,
    ),
  ),
);

class _DrillPicker extends StatefulWidget {
  const _DrillPicker({
    required this.catalog,
    required this.initialTier,
    required this.exclude,
    required this.room,
  });
  final Catalog catalog;
  final String initialTier;
  final Set<String> exclude;
  final int room;
  @override
  State<_DrillPicker> createState() => _DrillPickerState();
}

class _DrillPickerState extends State<_DrillPicker> {
  late String _tier = widget.initialTier;
  String? _section;
  String _query = '';
  final List<String> _picked = [];
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final catalog = widget.catalog;
    final drills = catalog.searchDrills(
      _query,
      tier: _tier,
      section: _section,
      includeStraightLegFlare: true,
    );
    return SafeArea(
      child: SizedBox(
        height: MediaQuery.sizeOf(context).height * .86,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
              // Wrap, not Row: a long title (Выбор упражнений at 1.5×) drops
              // the count to the next line instead of splitting mid-word.
              child: Wrap(
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.end,
                spacing: 12,
                runSpacing: 2,
                children: [
                  Builder(
                    builder: (context) => Text(
                      s.pickerTitle,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  Text(
                    s.pickerSelected(_picked.length),
                    style: TextStyle(
                      fontSize: 13,
                      color: _picked.isEmpty
                          ? FlareColors.dim
                          : FlareColors.accentInk,
                    ),
                  ),
                ],
              ),
            ),
            FlareDrillFilter(
              catalog: catalog,
              controller: _searchController,
              query: _query,
              tier: _tier,
              section: _section,
              searchKey: const ValueKey('picker-search'),
              onQueryChanged: (value) => setState(() => _query = value),
              onTier: (value) => setState(() => _tier = value),
              onSection: (value) => setState(() => _section = value),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: drills.isEmpty
                  ? EmptyNote(icon: Icons.search_off_rounded, text: s.noResults)
                  : CustomScrollView(
                      keyboardDismissBehavior:
                          ScrollViewKeyboardDismissBehavior.onDrag,
                      slivers: [
                        SliverPadding(
                          padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
                          sliver: SliverCardRows(
                            itemCount: drills.length,
                            itemBuilder: (context, index) {
                              final drill = drills[index];
                              final already = widget.exclude.contains(drill.id);
                              final order = _picked.indexOf(drill.id);
                              final picked = order >= 0;
                              final full = _picked.length >= widget.room;
                              return Semantics(
                                selected: picked,
                                button: true,
                                child: GestureDetector(
                                  key: ValueKey('pick-${drill.id}'),
                                  onTap: already || (!picked && full)
                                      ? null
                                      : () {
                                          FlareHaptics.selection();
                                          setState(() {
                                            picked
                                                ? _picked.remove(drill.id)
                                                : _picked.add(drill.id);
                                          });
                                        },
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.stretch,
                                    children: [
                                      AspectRatio(
                                        aspectRatio: 4 / 3,
                                        child: AnimatedContainer(
                                          duration: FlareMotion.of(
                                            context,
                                            FlareMotion.fade,
                                          ),
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(
                                              14,
                                            ),
                                            border: Border.all(
                                              width: 2,
                                              color: picked
                                                  ? FlareColors.accent
                                                  : Colors.transparent,
                                            ),
                                          ),
                                          child: ClipRRect(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                            child: Stack(
                                              fit: StackFit.expand,
                                              children: [
                                                Opacity(
                                                  opacity: already ? .38 : 1,
                                                  child: DrillPoster(drill),
                                                ),
                                                if (already)
                                                  Positioned(
                                                    left: 6,
                                                    bottom: 6,
                                                    child: _AddedTag(
                                                      label: s.pickerAdded,
                                                    ),
                                                  ),
                                                if (picked)
                                                  Positioned(
                                                    top: 6,
                                                    right: 6,
                                                    child: Container(
                                                      width: 24,
                                                      height: 24,
                                                      alignment:
                                                          Alignment.center,
                                                      decoration: BoxDecoration(
                                                        shape: BoxShape.circle,
                                                        color:
                                                            FlareColors.accent,
                                                      ),
                                                      child: Text(
                                                        '${order + 1}',
                                                        textScaler: TextScaler
                                                            .noScaling,
                                                        style: TextStyle(
                                                          fontSize: 12,
                                                          fontWeight:
                                                              FontWeight.w700,
                                                          color: FlareColors
                                                              .onAccent,
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        drill.name,
                                        style: TextStyle(
                                          fontSize: 12,
                                          height: 1.3,
                                          color: already
                                              ? FlareColors.dim
                                              : FlareColors.text,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
            ),
            FlareBottomAction(
              child: PrimaryAction(
                key: const ValueKey('picker-done'),
                label: _picked.isEmpty
                    ? s.planAddDrills
                    : s.pickerAddCount(_picked.length),
                onPressed: _picked.isEmpty
                    ? null
                    : () => Navigator.pop(context, List.of(_picked)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 已加入: a neutral frosted tag with a small check, never the accent, so it
/// cannot be mistaken for a new pick (accent ring + order number).
class _AddedTag extends StatelessWidget {
  const _AddedTag({required this.label});
  final String label;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.fromLTRB(6, 3, 8, 3),
    decoration: BoxDecoration(
      color: FlareColors.popup.withValues(alpha: .92),
      borderRadius: BorderRadius.circular(999),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.check_rounded, size: 12, color: FlareColors.secondary),
        const SizedBox(width: 3),
        Text(
          label,
          maxLines: 1,
          textScaler: TextScaler.noScaling,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: FlareColors.secondary,
          ),
        ),
      ],
    ),
  );
}

/// From a drill page: add it to one of the user's sets, or start a new set
/// with it. Returns 'new' for a new set, a routine ID when added, or null.
Future<String?> showAddToPlanSheet(
  BuildContext context, {
  required LearningStore store,
  required Catalog catalog,
  required Drill drill,
}) => showModalBottomSheet<String>(
  context: context,
  isScrollControlled: true,
  sheetAnimationStyle: FlareMotion.sheetStyle(context),
  builder: (sheet) {
    final s = sheet.strings;
    final routines = store.routines;
    return RepaintBoundary(
      child: SafeArea(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.sizeOf(sheet).height * .7,
          ),
          child: ListView.builder(
            shrinkWrap: true,
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
            itemCount: routines.length + 2,
            itemBuilder: (context, index) {
              if (index == 0) {
                return Padding(
                  padding: const EdgeInsets.fromLTRB(0, 0, 0, 12),
                  child: Text(
                    s.planAddTo,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                );
              }
              if (index == routines.length + 1) {
                return ListTile(
                  key: const ValueKey('add-to-new'),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 4),
                  minTileHeight: 60,
                  leading: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: FlareColors.accent.withValues(alpha: .14),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.add_rounded,
                      color: FlareColors.accentInk,
                    ),
                  ),
                  title: Text(
                    s.planNewWith,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  onTap: () => Navigator.pop(sheet, 'new'),
                );
              }
              final routine = routines[index - 1];
              final poster = routine.drills(catalog).firstOrNull;
              final containsDrill = _routineHasItem(routine, drill.id);
              return ListTile(
                key: ValueKey('add-to-${routine.id}'),
                contentPadding: const EdgeInsets.symmetric(horizontal: 4),
                minTileHeight: 60,
                leading: SizedBox.square(
                  dimension: 44,
                  child: ClipOval(
                    child: poster == null ? null : DrillPoster(poster),
                  ),
                ),
                title: Text(
                  routine.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                subtitle: Text(
                  s.planDrillCount(
                    routine.sdkPlan?.items.length ?? routine.drillIds.length,
                  ),
                  style: TextStyle(fontSize: 12, color: FlareColors.dim),
                ),
                trailing: containsDrill
                    ? Icon(Icons.check_rounded, color: FlareColors.success)
                    : Icon(Icons.add_rounded, color: FlareColors.dim),
                enabled:
                    !containsDrill &&
                    (routine.sdkPlan != null ||
                        routine.drillIds.length < TrainingRoutine.maxDrills),
                onTap: () => Navigator.pop(sheet, routine.id),
              );
            },
          ),
        ),
      ),
    );
  },
);
