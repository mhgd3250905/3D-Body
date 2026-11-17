import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart'
    show poseHubEquipmentLabels;

import '../control/flare_membership.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../data/flare_shared_library.dart';
import '../l10n/languages.dart';
import 'components.dart';
import 'drill_media.dart';
import 'flare_plan_visuals.dart';
import 'motion.dart';
import 'page_kit.dart';
import 'theme.dart';

const _gutter = 22.0;
const _heroHeight = 300.0;
const _heroTitleOverlap = 24.0;
const _heroArtTop = 64.0;
const _switchTime = Duration(milliseconds: 220);
const _figures = [FontFeature.tabularFigures()];
const _startButtonHeight = 56.0;
const _startButtonBottomInset = 12.0;
const _lastExerciseGap = 24.0;
const _startButtonFadeHeight = 48.0;

class FlarePlanDetailPage extends StatefulWidget {
  const FlarePlanDetailPage({
    super.key,
    required this.title,
    required this.plans,
    required this.selectedTier,
    required this.catalog,
    required this.store,
    required this.onTierChanged,
    required this.onMuscle,
    required this.onDrill,
    required this.onBack,
    required this.onStart,
    this.phase,
    this.membership,
  });

  final String title;
  final Phase? phase;
  final List<FlarePlan> plans;
  final int selectedTier;
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<int> onTierChanged;
  final ValueChanged<MuscleGroup> onMuscle;
  final ValueChanged<String> onDrill;
  final VoidCallback onBack;
  final ValueChanged<FlarePlan> onStart;
  final FlareMembership? membership;

  @override
  State<FlarePlanDetailPage> createState() => _FlarePlanDetailPageState();
}

class _FlarePlanDetailPageState extends State<FlarePlanDetailPage> {
  final _scroll = ScrollController();

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final p = FlareColors.palette;
    final plans = widget.plans;
    final catalog = widget.catalog;
    final phase = widget.phase;
    final plan = plans.firstWhere(
      (plan) => plan.tier == widget.selectedTier,
      orElse: () => plans.first,
    );
    final scene = widget.store.settings.tier;
    final shared = FlareShared.current;
    final minutes = shared?.authoredPlanMinutes(plan, catalog, scene);
    final equipment = shared?.authoredPlanEquipment(plan, scene);
    final language = Localizations.localeOf(context).languageCode;
    final equipmentNames = equipment
        ?.map((tool) {
          if (tool == 'clamp-pad') return language == 'zh' ? '夹垫' : 'Small pad';
          final label = poseHubEquipmentLabels[tool] ?? tool;
          final translated = catalog.translate(label);
          return translated == label && language != 'zh'
              ? tool.replaceAll('-', ' ')
              : translated;
        })
        .join(' · ');
    final safe = MediaQuery.viewPaddingOf(context);
    final muscles = [
      for (final muscle in phase?.primary ?? const <PhaseMuscle>[])
        ?catalog.groupById(muscle.id),
    ];
    final tiers = [
      s.planTierBeginner,
      s.planTierIntermediate,
      s.planTierAdvanced,
    ];
    final groupId = plan.groupId;
    final targetGroup = groupId == null ? null : catalog.groupById(groupId);
    final intro = switch ((plan.phaseSource, plan.groupId)) {
      (11, _) => s.angleSupportPlanIntro,
      (_, 'deltoids') => s.deltoidsPlanIntro,
      _
          when targetGroup != null &&
              targetGroup.label != targetGroup.shortLabel =>
        targetGroup.label,
      _ => null,
    };

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: (p.isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark)
          .copyWith(statusBarColor: Colors.transparent),
      child: ColoredBox(
        color: p.background,
        child: FlareScrollNav(
          onBack: widget.onBack,
          scrollFadeController: _scroll,
          child: Stack(
            children: [
              Positioned.fill(
                bottom: safe.bottom + _startButtonBottomInset,
                child: ScrollConfiguration(
                  behavior: ScrollConfiguration.of(
                    context,
                  ).copyWith(scrollbars: false),
                  child: ListView(
                    controller: _scroll,
                    padding: const EdgeInsets.only(
                      bottom: _startButtonHeight + _lastExerciseGap,
                    ),
                    children: [
                      _PlanHero(
                        title: widget.title,
                        intro: intro,
                        phaseSource: phase?.source ?? plan.phaseSource,
                        groupId: plan.groupId,
                        safeTop: FlareGeometry.navSafeTop(context),
                        info: _PlanInfo(
                          minutes: minutes,
                          count: plan.items.length,
                        ),
                      ),
                      if (muscles.isNotEmpty)
                        _PlanMuscleStrip(
                          groups: muscles,
                          onTapFor: (group) =>
                              catalog.plansForMuscle(group.id).isEmpty
                              ? null
                              : () => widget.onMuscle(group),
                        ),
                      Padding(
                        padding: EdgeInsets.fromLTRB(
                          _gutter,
                          muscles.isEmpty ? 12 : 8,
                          _gutter,
                          0,
                        ),
                        child: _PlanTiers(
                          key: const ValueKey('flare-plan-tier'),
                          selected: plan.tier,
                          labels: [
                            for (final option in plans)
                              (option.tier, tiers[option.tier - 1]),
                          ],
                          onChanged: widget.onTierChanged,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(
                          _gutter,
                          8,
                          _gutter,
                          0,
                        ),
                        child: _PlanScenes(
                          selected: scene,
                          onChanged: (value) =>
                              widget.store.updateSettings(tier: value),
                        ),
                      ),
                      _heading(
                        s.planTrainingContent,
                        [
                          s.planDrillCount(plan.items.length),
                          if (equipmentNames case final names?)
                            names.isEmpty
                                ? s.sceneNone
                                : '${s.equipment} · $names',
                        ].join('\n'),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: _gutter,
                        ),
                        child: _PlanRows(
                          plan: plan,
                          scene: scene,
                          buildRow: _row,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              PositionedDirectional(
                bottom: 0,
                start: 0,
                end: 0,
                child: _PlanBottom(
                  membership: widget.membership,
                  minutes: minutes,
                  safeBottom: safe.bottom,
                  onStart: () => widget.onStart(plan),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _heading(String title, String hint) => Padding(
    padding: const EdgeInsets.fromLTRB(_gutter, 16, _gutter, 8),
    child: FlarePlanSectionHeading(title: title, hint: hint),
  );

  Widget _row(
    BuildContext context,
    int index,
    FlarePlanItem item,
    String scene,
    bool separator,
  ) {
    final id = item.drillForScene(scene);
    final name =
        widget.catalog.drillById(id)?.name ??
        FlareShared.current?.nameOf(
          id,
          languageForLocale(Localizations.localeOf(context)),
        );
    return _PlanExercise(
      key: ValueKey('flare-plan-item-$index-$id'),
      id: id,
      name: name ?? id,
      index: index,
      dose: item.doseForScene(scene),
      bodyweightSubstitution: scene == 'A' && id != item.drill,
      separator: separator,
      onTap: name == null ? null : () => widget.onDrill(id),
    );
  }
}

class _PlanHero extends StatelessWidget {
  const _PlanHero({
    required this.title,
    required this.intro,
    required this.phaseSource,
    required this.groupId,
    required this.safeTop,
    required this.info,
  });

  final String title;
  final String? intro;
  final int? phaseSource;
  final String? groupId;
  final double safeTop;
  final Widget info;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    final shadow = Colors.black.withValues(alpha: p.isDark ? .45 : .12);
    final isAngle = phaseSource != null;
    final width = MediaQuery.sizeOf(context).width;
    final viewportHeight = safeTop + _heroHeight;
    final artHeight = (width * .70).clamp(0.0, 236.0);
    final artTop = safeTop + _heroArtTop - .01 * artHeight;
    return Stack(
      children: [
        Positioned(
          left: 0,
          right: 0,
          top: 0,
          height: viewportHeight,
          child: DecoratedBox(
            key: const ValueKey('flare-plan-hero-viewport'),
            decoration: BoxDecoration(gradient: flarePlanArtGradient(p)),
            child: Stack(
              children: [
                Positioned(
                  right: -40,
                  top: safeTop - 24,
                  child: const FlarePlanGlow(diameter: 300),
                ),
                if (!isAngle)
                  Positioned(
                    right: 24,
                    top: artTop + artHeight - 18,
                    width: 220,
                    height: 26,
                    child: _PlanArtShadow(shadow),
                  ),
                if (groupId case final id?)
                  Positioned(
                    right: 20,
                    top: artTop,
                    height: artHeight,
                    child: FlarePlanMuscleFade(
                      child: Image.asset(
                        'assets/plan_resume_muscles/$id.webp',
                        key: ValueKey('flare-plan-muscle-hero-$id'),
                        excludeFromSemantics: true,
                      ),
                    ),
                  ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 104,
                  child: DecoratedBox(
                    decoration: BoxDecoration(gradient: _bottomFade(p, .82)),
                  ),
                ),
                if (phaseSource case final source?)
                  Positioned.fill(
                    child: _AnglePlanArt(
                      source: source,
                      safeTop: safeTop,
                      width: width,
                      shadow: shadow,
                    ),
                  ),
              ],
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.fromLTRB(
            _gutter,
            viewportHeight - _heroTitleOverlap,
            _gutter,
            0,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FlarePlanKicker(
                label: isAngle ? s.anglePlanLabel : s.musclePlanLabel,
              ),
              const SizedBox(height: 4),
              Semantics(
                header: true,
                child: Text(
                  title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.w700,
                    color: p.text,
                    letterSpacing: -.5,
                    height: 1.1,
                  ),
                ),
              ),
              if (intro case final line?) ...[
                const SizedBox(height: 4),
                Text(
                  line,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.5,
                    color: p.secondary,
                  ),
                ),
              ],
              const SizedBox(height: 8),
              info,
            ],
          ),
        ),
      ],
    );
  }
}

class _AnglePlanArt extends StatelessWidget {
  const _AnglePlanArt({
    required this.source,
    required this.safeTop,
    required this.width,
    required this.shadow,
  });

  final int source;
  final double safeTop;
  final double width;
  final Color shadow;

  // The pose renders retain their original transparent canvas. Use the
  // silhouette bounds to align the visible figure instead of the canvas edge.
  static const _angleBounds = {
    9: (.150, .849),
    10: (.180, .820),
    11: (.070, .929),
    12: (.060, .940),
    13: (.279, .720),
    14: (.060, .940),
    15: (.115, .884),
    16: (.120, .880),
  };

  @override
  Widget build(BuildContext context) {
    final (topInset, bottomInset) = _angleBounds[source]!;
    final artHeight = (width * .70).clamp(0.0, 268.0);
    final artTop = safeTop + _heroArtTop - artHeight * topInset;

    return Stack(
      children: [
        Positioned(
          right: 20,
          top: artTop + artHeight * bottomInset - 14,
          width: artHeight * .72,
          height: 24,
          child: _PlanArtShadow(shadow),
        ),
        Positioned(
          right: 12,
          top: artTop,
          height: artHeight,
          child: Image.asset(
            'assets/angles/phase-$source.webp',
            key: ValueKey('flare-plan-angle-hero-$source'),
            excludeFromSemantics: true,
          ),
        ),
      ],
    );
  }
}

class _PlanArtShadow extends StatelessWidget {
  const _PlanArtShadow(this.color);

  final Color color;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final height = constraints.maxHeight;
      return Center(
        child: Transform.scale(
          scaleX: constraints.maxWidth / height,
          child: SizedBox.square(
            dimension: height,
            child: DecoratedBox(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [color, color.withValues(alpha: 0)],
                  stops: const [0, .7],
                ),
              ),
            ),
          ),
        ),
      );
    },
  );
}

LinearGradient _bottomFade(FlarePalette palette, double stop) => LinearGradient(
  begin: Alignment.topCenter,
  end: Alignment.bottomCenter,
  colors: [palette.background.withValues(alpha: 0), palette.background],
  stops: [0, stop],
);

class _PlanInfo extends StatelessWidget {
  const _PlanInfo({required this.minutes, required this.count});
  final int? minutes;
  final int count;

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final p = FlareColors.palette;
    return Align(
      alignment: AlignmentDirectional.centerStart,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        alignment: AlignmentDirectional.centerStart,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (minutes case final value?) ...[
              _metric(
                Icons.schedule_rounded,
                value,
                s.minutesShort(value),
                p,
                context,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: SizedBox.square(
                  dimension: 3,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: p.dim,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ),
            ],
            _metric(
              Icons.format_list_bulleted_rounded,
              count,
              s.planDrillCount(count),
              p,
              context,
            ),
          ],
        ),
      ),
    );
  }

  Widget _metric(
    IconData icon,
    int value,
    String label,
    FlarePalette p,
    BuildContext context,
  ) {
    final number = '$value';
    final index = label.indexOf(number);
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: 6,
      children: [
        Icon(icon, size: 14, color: p.accentInk),
        Semantics(
          label: label,
          excludeSemantics: true,
          child: Text.rich(
            TextSpan(
              style: TextStyle(fontSize: 13, color: p.secondary),
              children: [
                if (index < 0)
                  TextSpan(text: label)
                else ...[
                  TextSpan(text: label.substring(0, index)),
                  WidgetSpan(
                    alignment: PlaceholderAlignment.baseline,
                    baseline: TextBaseline.alphabetic,
                    child: AnimatedSwitcher(
                      duration: FlareMotion.of(
                        context,
                        const Duration(milliseconds: 180),
                      ),
                      child: Text(
                        number,
                        key: ValueKey(value),
                        style: TextStyle(
                          fontSize: 13,
                          color: p.text,
                          fontWeight: FontWeight.w600,
                          fontFeatures: _figures,
                        ),
                      ),
                    ),
                  ),
                  TextSpan(text: label.substring(index + number.length)),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _PlanTiers extends StatelessWidget {
  const _PlanTiers({
    super.key,
    required this.selected,
    required this.labels,
    required this.onChanged,
  });
  final int selected;
  final List<(int, String)> labels;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return SizedBox(
      height: 40,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: p.hairline),
        ),
        child: Padding(
          padding: const EdgeInsets.all(3),
          child: LayoutBuilder(
            builder: (context, box) {
              final width = box.maxWidth / labels.length;
              return Stack(
                children: [
                  AnimatedPositionedDirectional(
                    duration: FlareMotion.reduced(context)
                        ? Duration.zero
                        : _switchTime,
                    curve: Curves.easeOutCubic,
                    start:
                        width *
                        labels.indexWhere((tier) => tier.$1 == selected),
                    top: 0,
                    bottom: 0,
                    width: width,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: p.text,
                        borderRadius: BorderRadius.circular(17),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x40000000),
                            offset: Offset(0, 2),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                    ),
                  ),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (final (value, label) in labels)
                        Expanded(
                          child: FlarePressable(
                            scale: 1,
                            selected: value == selected,
                            inMutuallyExclusiveGroup: true,
                            onTap: () {
                              if (value != selected) {
                                FlareHaptics.selection();
                                onChanged(value);
                              }
                            },
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                              ),
                              child: Center(
                                child: FittedBox(
                                  fit: BoxFit.scaleDown,
                                  child: Text(
                                    label,
                                    maxLines: 1,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: selected == value
                                          ? p.background
                                          : p.dim,
                                      fontWeight: selected == value
                                          ? FontWeight.w600
                                          : FontWeight.w400,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}

class _PlanScenes extends StatelessWidget {
  const _PlanScenes({required this.selected, required this.onChanged});
  final String selected;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final p = FlareColors.palette;
    return Align(
      alignment: AlignmentDirectional.centerStart,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        alignment: AlignmentDirectional.centerStart,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: 8,
          children: [
            for (final (value, label) in [
              ('A', s.planBodyweightScene),
              ('B', s.sceneHome),
              ('C', s.sceneGym),
            ])
              FlarePressable(
                scale: 1,
                selected: selected == value,
                inMutuallyExclusiveGroup: true,
                onTap: () {
                  if (value != selected) {
                    FlareHaptics.selection();
                    onChanged(value);
                  }
                },
                child: AnimatedContainer(
                  duration: FlareMotion.reduced(context)
                      ? Duration.zero
                      : const Duration(milliseconds: 180),
                  height: 30,
                  padding: const EdgeInsets.symmetric(horizontal: 13),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: value == selected
                        ? p.accent.withValues(alpha: .1)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(
                      color: value == selected
                          ? p.accent.withValues(alpha: .45)
                          : p.hairline,
                    ),
                  ),
                  child: Text(
                    label,
                    maxLines: 1,
                    style: TextStyle(
                      fontSize: 12,
                      color: value == selected ? p.accentInk : p.secondary,
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

class _PlanMuscleStrip extends StatelessWidget {
  const _PlanMuscleStrip({required this.groups, required this.onTapFor});

  static const _fadeWidth = 24.0;
  final List<MuscleGroup> groups;
  final VoidCallback? Function(MuscleGroup) onTapFor;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return Padding(
      padding: const EdgeInsetsDirectional.only(start: _gutter, top: 8),
      child: Row(
        children: [
          Flexible(
            child: Text(
              context.strings.planActiveMuscles,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: p.secondary,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            flex: 4,
            child: Stack(
              alignment: AlignmentDirectional.centerStart,
              children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsetsDirectional.only(end: _fadeWidth),
                  child: Row(
                    spacing: 8,
                    children: [
                      for (final group in groups)
                        _PlanMuscle(group: group, onTap: onTapFor(group)),
                    ],
                  ),
                ),
                PositionedDirectional(
                  end: 0,
                  top: 0,
                  bottom: 0,
                  width: _fadeWidth,
                  child: IgnorePointer(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: AlignmentDirectional.centerStart,
                          end: AlignmentDirectional.centerEnd,
                          colors: [
                            p.background.withValues(alpha: 0),
                            p.background,
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PlanMuscle extends StatelessWidget {
  const _PlanMuscle({required this.group, required this.onTap});

  final MuscleGroup group;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final face = DecoratedBox(
      decoration: BoxDecoration(
        color: p.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: p.hairline),
      ),
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(4, 4, 12, 4),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: 6,
          children: [
            SizedBox.square(
              dimension: 24,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: p.raised,
                  shape: BoxShape.circle,
                ),
                child: ClipOval(
                  child: Image.asset(
                    'assets/muscles/${group.id}.webp',
                    fit: BoxFit.cover,
                    excludeFromSemantics: true,
                  ),
                ),
              ),
            ),
            Text(
              group.shortLabel,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: p.text,
              ),
            ),
          ],
        ),
      ),
    );
    final key = ValueKey('flare-plan-muscle-${group.id}');
    return onTap == null
        ? KeyedSubtree(key: key, child: face)
        : FlarePressable(
            key: key,
            semanticLabel: group.shortLabel,
            onTap: onTap,
            child: face,
          );
  }
}

class _PlanExercise extends StatelessWidget {
  const _PlanExercise({
    super.key,
    required this.id,
    required this.name,
    required this.index,
    required this.dose,
    required this.bodyweightSubstitution,
    required this.separator,
    required this.onTap,
  });
  final String id;
  final String name;
  final int index;
  final FlarePlanDose dose;
  final bool bodyweightSubstitution;
  final bool separator;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final p = FlareColors.palette;
    final amount = dose.reps == null
        ? s.secondsLabel(dose.seconds!)
        : s.countLabel(dose.reps!);
    final volume = dose.sets == 1 ? amount : '${dose.sets} × $amount';
    final side = dose.perSide ? s.planDosePerSide('') : '';
    final rest = dose.sets > 1
        ? ' · ${s.planRestSeconds(dose.restSeconds)}'
        : '';
    final title = Text(
      name,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: p.text,
      ),
    );
    return Column(
      children: [
        FlarePressable(
          scale: .99,
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: ColoredBox(
                    color: p.isDark ? p.raised : p.surface,
                    child: SizedBox.square(
                      dimension: 64,
                      child: DrillMediaCard(
                        drillId: id,
                        active: false,
                        thumbnail: true,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${index + 1}'.padLeft(2, '0'),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1,
                          color: p.accentInk,
                          fontFeatures: _figures,
                        ),
                      ),
                      const SizedBox(height: 3),
                      title,
                      const SizedBox(height: 4),
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Text.rich(
                            TextSpan(
                              style: TextStyle(fontSize: 12, color: p.dim),
                              children: [
                                TextSpan(
                                  text: volume,
                                  style: TextStyle(color: p.secondary),
                                ),
                                TextSpan(text: '$side$rest'),
                              ],
                            ),
                          ),
                          if (bodyweightSubstitution)
                            Container(
                              constraints: const BoxConstraints(minHeight: 18),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                              ),
                              decoration: BoxDecoration(
                                color: p.accent.withValues(alpha: .14),
                                borderRadius: BorderRadius.circular(9),
                              ),
                              child: Center(
                                widthFactor: 1,
                                heightFactor: 1,
                                child: Text(
                                  s.planBodyweightSubstitution,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: p.accentInk,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                if (onTap != null)
                  Icon(
                    Icons.chevron_right_rounded,
                    size: 16,
                    color: p.dim.withValues(alpha: .45),
                  ),
              ],
            ),
          ),
        ),
        if (separator)
          Padding(
            padding: const EdgeInsetsDirectional.only(start: 80),
            child: SizedBox(
              height: 1,
              width: double.infinity,
              child: ColoredBox(color: p.hairline),
            ),
          ),
      ],
    );
  }
}

class _PlanBottom extends StatefulWidget {
  const _PlanBottom({
    required this.membership,
    required this.minutes,
    required this.safeBottom,
    required this.onStart,
  });
  final FlareMembership? membership;
  final int? minutes;
  final double safeBottom;
  final VoidCallback onStart;

  @override
  State<_PlanBottom> createState() => _PlanBottomState();
}

class _PlanBottomState extends State<_PlanBottom> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    final detail = TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: p.onAccent.withValues(alpha: .75),
    );
    Widget label() => FittedBox(
      fit: BoxFit.scaleDown,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.membership?.isPremium == false) ...[
            Icon(Icons.lock_outline_rounded, size: 16, color: p.onAccent),
            const SizedBox(width: 8),
          ],
          Text(
            s.planStart,
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: p.onAccent,
            ),
          ),
          if (widget.minutes case final minutes?) ...[
            const SizedBox(width: 6),
            Text('·', style: detail),
            const SizedBox(width: 4),
            Text(s.minutesShort(minutes), style: detail),
          ],
        ],
      ),
    );
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        IgnorePointer(
          child: SizedBox(
            width: double.infinity,
            height: _startButtonFadeHeight,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [p.background.withValues(alpha: 0), p.background],
                ),
              ),
            ),
          ),
        ),
        ColoredBox(
          color: p.background,
          child: Padding(
            padding: EdgeInsets.fromLTRB(
              _gutter,
              0,
              _gutter,
              widget.safeBottom + _startButtonBottomInset,
            ),
            child: FlarePressable(
              key: const ValueKey('flare-plan-start'),
              scale: 1,
              onTap: widget.onStart,
              onPressChanged: (pressed) => setState(() => _pressed = pressed),
              child: AnimatedScale(
                scale: _pressed && !FlareMotion.reduced(context) ? .98 : 1,
                duration: const Duration(milliseconds: 100),
                child: Container(
                  width: double.infinity,
                  height: _startButtonHeight,
                  alignment: Alignment.center,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color.lerp(p.accent, Colors.white, .15)!,
                        p.accent,
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: p.accent,
                        offset: const Offset(0, 10),
                        blurRadius: 28,
                        spreadRadius: -8,
                      ),
                    ],
                  ),
                  foregroundDecoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: const LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Color(0x40ffffff), Color(0x00ffffff)],
                      stops: [0, 1 / _startButtonHeight],
                    ),
                  ),
                  child: widget.membership == null
                      ? label()
                      : ListenableBuilder(
                          listenable: widget.membership!,
                          builder: (_, _) => label(),
                        ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _PlanRows extends StatefulWidget {
  const _PlanRows({
    required this.plan,
    required this.scene,
    required this.buildRow,
  });

  final FlarePlan plan;
  final String scene;
  final Widget Function(
    BuildContext context,
    int index,
    FlarePlanItem item,
    String scene,
    bool separator,
  )
  buildRow;

  @override
  State<_PlanRows> createState() => _PlanRowsState();
}

class _PlanRowsState extends State<_PlanRows> with TickerProviderStateMixin {
  static const _leaveTime = Duration(milliseconds: 120);
  static const _rowTime = Duration(milliseconds: 240);
  static const _rowDelay = Duration(milliseconds: 40);
  static const _sizeTime = Duration(milliseconds: 260);

  late FlarePlan _visiblePlan = widget.plan;
  late String _visibleScene = widget.scene;
  late final _leave = AnimationController(vsync: this, duration: _leaveTime)
    ..addStatusListener(_showLatest);
  late final _enter = AnimationController(
    vsync: this,
    duration: _rowTime,
    value: 1,
  );
  bool _reducedMotion = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _reducedMotion = FlareMotion.reduced(context);
    if (_reducedMotion) {
      _useLatest();
      _leave.reset();
      _enter.value = 1;
    }
  }

  @override
  void didUpdateWidget(covariant _PlanRows oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (_reducedMotion ||
        (widget.plan.id == _visiblePlan.id && widget.scene == _visibleScene)) {
      _useLatest();
    } else if (!_leave.isAnimating) {
      // Preserve the current per-row progress if a selection interrupts entry.
      _enter.stop();
      _leave.forward(from: 0);
    }
  }

  void _useLatest() {
    _visiblePlan = widget.plan;
    _visibleScene = widget.scene;
  }

  void _showLatest(AnimationStatus status) {
    if (status != AnimationStatus.completed) return;
    // Swap data only after the current list has faded out; intermediate
    // selections are never queued or mounted as overlapping lists.
    setState(_useLatest);
    _leave.reset();
    _enter.duration = _rowTime + _rowDelay * (_visiblePlan.items.length - 1);
    _enter.forward(from: 0);
  }

  @override
  void dispose() {
    _leave.dispose();
    _enter.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rows = Column(
      children: [
        for (final (index, item) in _visiblePlan.items.indexed)
          _enterRow(
            index,
            widget.buildRow(
              context,
              index,
              item,
              _visibleScene,
              index + 1 < _visiblePlan.items.length,
            ),
          ),
      ],
    );
    if (_reducedMotion) return rows;

    return AnimatedSize(
      alignment: Alignment.topCenter,
      duration: _sizeTime,
      curve: Curves.easeOutCubic,
      child: AnimatedBuilder(
        animation: _leave,
        child: rows,
        builder: (_, child) {
          final progress = Curves.easeIn.transform(_leave.value);
          final leaving = _leave.isAnimating;
          return IgnorePointer(
            ignoring: leaving,
            child: ExcludeSemantics(
              excluding: leaving,
              child: Opacity(
                opacity: 1 - progress,
                child: Transform.translate(
                  offset: Offset(0, -6 * progress),
                  child: child,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _enterRow(int index, Widget child) => AnimatedBuilder(
    animation: _enter,
    child: child,
    builder: (_, child) {
      final elapsed = _enter.value * _enter.duration!.inMilliseconds;
      final delay = _rowDelay.inMilliseconds * index;
      final progress = _enter.isCompleted
          ? 1.0
          : ((elapsed - delay) / _rowTime.inMilliseconds).clamp(0.0, 1.0);
      final eased = Curves.easeOutCubic.transform(progress);
      return IgnorePointer(
        ignoring: progress == 0,
        child: ExcludeSemantics(
          excluding: progress == 0,
          child: Opacity(
            opacity: eased,
            child: Transform.translate(
              offset: Offset(0, 10 * (1 - eased)),
              child: child,
            ),
          ),
        ),
      );
    },
  );
}
