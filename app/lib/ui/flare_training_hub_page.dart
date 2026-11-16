import 'dart:math' as math;
import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../data/catalog.dart';
import '../platform/scene/scene.dart';
import 'components.dart';
import 'flare_plan_detail_page.dart' show flarePlanMinutes;
import 'flare_plan_visuals.dart';
import 'motion.dart';
import 'motion_controls.dart';
import 'theme.dart';

const _gutter = 22.0;
const _planCardHeight = 76.0;

Color _hubSurface(FlarePalette p) =>
    p.isDark ? const Color(0xff141418) : p.surface;

class FlareTrainingHubPage extends StatefulWidget {
  const FlareTrainingHubPage({
    super.key,
    required this.catalog,
    required this.actorBody,
    required this.enableScene,
    required this.visible,
    required this.onBack,
    required this.onAngle,
    required this.onMuscle,
  });

  final Catalog catalog;
  final String actorBody;
  final bool enableScene;
  final bool visible;
  final VoidCallback onBack;
  final ValueChanged<Phase> onAngle;
  final ValueChanged<MuscleGroup> onMuscle;

  @override
  State<FlareTrainingHubPage> createState() => _FlareTrainingHubPageState();
}

class _FlareTrainingHubPageState extends State<FlareTrainingHubPage> {
  final _stage = SceneController();
  late double _time = widget.catalog.phaseTime(11);
  bool _muscles = false;
  String _muscleId = 'deltoids';

  Phase get _phase => widget.catalog.phaseAt(_time);
  MuscleGroup get _muscle => widget.catalog.groupById(_muscleId)!;

  @override
  void initState() {
    super.initState();
    _render(animate: false);
    _stage.setVisible(widget.visible);
    _stage.requestPresentation();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _stage.setTheme(
      Theme.of(context).brightness == Brightness.dark ? 'dark' : 'light',
    );
  }

  @override
  void didUpdateWidget(FlareTrainingHubPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.visible != widget.visible) _stage.setVisible(widget.visible);
  }

  @override
  void dispose() {
    _stage.dispose();
    super.dispose();
  }

  void _render({bool animate = true, bool scrubbing = false}) {
    if (!widget.enableScene) return;
    _stage.configureTrainingHub(
      phaseSource: _phase.source,
      phaseTime: _time,
      muscleId: _muscleId,
      showMuscles: _muscles,
      animate: animate,
      scrubbing: scrubbing,
    );
  }

  void _selectMode(bool muscles) {
    if (_muscles == muscles) return;
    FlareHaptics.selection();
    setState(() => _muscles = muscles);
    _render(animate: !FlareMotion.reduced(context));
  }

  void _seek(double time) {
    setState(() => _time = time);
    _render(scrubbing: true);
  }

  void _snap(double time) {
    final catalog = widget.catalog;
    final anchor = catalog.phaseTime(catalog.phaseAt(time).source);
    setState(() => _time = anchor);
    _render(animate: !FlareMotion.reduced(context));
  }

  void _selectMuscle(String id) {
    if (id == _muscleId) return;
    FlareHaptics.selection();
    setState(() => _muscleId = id);
    _render(animate: !FlareMotion.reduced(context));
  }

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final safe = MediaQuery.viewPaddingOf(context);
    final catalog = widget.catalog;
    final phase = _phase;
    final muscle = _muscle;
    final plans = _muscles
        ? catalog.plansForMuscle(muscle.id)
        : catalog.plansForAngle(phase.source);
    final beginner = plans.firstOrNull;
    final selectedKey = ValueKey(
      _muscles ? muscle.id : 'phase-${phase.source}',
    );
    final stageHeight = _muscles ? 400.0 : 452.0;
    final cardBottom = safe.bottom + 30;
    final controlsBottom = cardBottom + _planCardHeight + 12;
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: (p.isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark)
          .copyWith(statusBarColor: Colors.transparent),
      child: ColoredBox(
        color: p.background,
        child: LayoutBuilder(
          builder: (context, box) {
            final available = math.max(0.0, box.maxHeight - controlsBottom);
            final height = math.max(stageHeight + 116, available);
            final page = SizedBox(
              height: height,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _HubStage(
                    height: stageHeight,
                    safeTop: safe.top,
                    muscles: _muscles,
                    onBack: widget.onBack,
                    onMode: _selectMode,
                    scene: widget.enableScene
                        ? SceneView(
                            key: ValueKey(widget.actorBody),
                            controller: _stage,
                            body: widget.actorBody,
                          )
                        : const SizedBox.expand(),
                  ),
                  Expanded(
                    child: _muscles
                        ? _HubMuscles(
                            catalog: catalog,
                            selected: _muscleId,
                            onSelected: _selectMuscle,
                          )
                        : _angleControls(context, phase),
                  ),
                ],
              ),
            );
            return Stack(
              children: [
                Positioned.fill(
                  bottom: controlsBottom,
                  child: height == available
                      ? page
                      : SingleChildScrollView(child: page),
                ),
                PositionedDirectional(
                  start: 16,
                  end: 16,
                  bottom: cardBottom,
                  child: _HubPlanCard(
                    selection: selectedKey,
                    title: _muscles ? muscle.label : phase.name,
                    plan: beginner,
                    onOpen: _muscles
                        ? () => widget.onMuscle(muscle)
                        : () => widget.onAngle(phase),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _angleControls(BuildContext context, Phase phase) {
    final s = context.strings;
    final p = FlareColors.palette;
    final catalog = widget.catalog;
    final caption = switch (phase.source) {
      9 => s.hubPhase09Caption,
      10 => s.hubPhase10Caption,
      11 => s.hubPhase11Caption,
      12 => s.hubPhase12Caption,
      13 => s.hubPhase13Caption,
      14 => s.hubPhase14Caption,
      15 => s.hubPhase15Caption,
      16 => s.hubPhase16Caption,
      _ => phase.caption,
    };
    return Padding(
      padding: const EdgeInsets.fromLTRB(_gutter, 2, _gutter, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          MotionTimeline(
            key: const ValueKey('hub-timeline'),
            catalog: widget.catalog,
            time: _time,
            phase: phase.source,
            onSeek: _seek,
            onSettle: _snap,
            connectedNodes: true,
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(top: 14, bottom: 4),
              child: AnimatedSwitcher(
                duration: FlareMotion.reduced(context)
                    ? Duration.zero
                    : const Duration(milliseconds: 220),
                switchInCurve: Curves.easeOutCubic,
                switchOutCurve: Curves.easeOutCubic,
                layoutBuilder: (current, previous) => Stack(
                  alignment: AlignmentDirectional.topStart,
                  children: [
                    for (final old in previous) ExcludeSemantics(child: old),
                    ?current,
                  ],
                ),
                transitionBuilder: (child, animation) => FadeTransition(
                  opacity: animation,
                  child: AnimatedBuilder(
                    animation: animation,
                    child: child,
                    builder: (_, child) => Transform.translate(
                      offset: Offset(0, 8 * (1 - animation.value)),
                      child: child,
                    ),
                  ),
                ),
                child: Column(
                  key: ValueKey(phase.source),
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    FlarePlanKicker(
                      label:
                          '${phase.source.toString().padLeft(2, '0')} · ${phase.detail}',
                    ),
                    const SizedBox(height: 6),
                    Text(
                      phase.name,
                      style: TextStyle(
                        color: p.text,
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -.4,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      caption,
                      style: TextStyle(
                        color: p.secondary,
                        fontSize: 13,
                        height: 1.55,
                      ),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      s.hubPrimaryMuscles,
                      style: TextStyle(
                        color: p.dim,
                        fontSize: 11,
                        letterSpacing: 1.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        for (final item in phase.primary)
                          if (catalog.groupById(item.groupId) case final group?)
                            _PrimaryMusclePill(group: group),
                      ],
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

class _HubStage extends StatelessWidget {
  const _HubStage({
    required this.height,
    required this.safeTop,
    required this.muscles,
    required this.onBack,
    required this.onMode,
    required this.scene,
  });
  final double height;
  final double safeTop;
  final bool muscles;
  final VoidCallback onBack;
  final ValueChanged<bool> onMode;
  final Widget scene;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final shadow = Colors.black.withValues(alpha: p.isDark ? .45 : .12);
    return SizedBox(
      height: height,
      child: DecoratedBox(
        decoration: BoxDecoration(gradient: flarePlanArtGradient(p)),
        child: Stack(
          fit: StackFit.expand,
          children: [
            const Positioned(
              left: 0,
              right: 0,
              top: 90,
              child: Center(child: FlarePlanGlow(diameter: 320)),
            ),
            Positioned(
              left: 0,
              right: 0,
              top: 392,
              child: Center(
                child: Transform.scale(
                  scaleX: 240 / 28,
                  child: SizedBox.square(
                    dimension: 28,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [shadow, shadow.withValues(alpha: 0)],
                          stops: const [0, .7],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              top: safeTop + 54,
              bottom: 0,
              child: ClipRect(child: IgnorePointer(child: scene)),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
              child: IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [p.background.withValues(alpha: 0), p.background],
                      stops: const [0, .78],
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              left: 16,
              top: safeTop + 10,
              child: FlarePlanBackButton(onTap: onBack),
            ),
            Positioned(
              left: 0,
              right: 0,
              top: safeTop + 10,
              child: Center(
                child: _HubModeControl(muscles: muscles, onMode: onMode),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HubModeControl extends StatelessWidget {
  const _HubModeControl({required this.muscles, required this.onMode});
  final bool muscles;
  final ValueChanged<bool> onMode;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    return SizedBox(
      width: 176,
      height: 36,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: ColoredBox(
            color: const Color(0x2e7f7f87),
            child: Padding(
              padding: const EdgeInsets.all(3),
              child: Stack(
                children: [
                  AnimatedAlign(
                    alignment: muscles
                        ? AlignmentDirectional.centerEnd
                        : AlignmentDirectional.centerStart,
                    duration: FlareMotion.reduced(context)
                        ? Duration.zero
                        : const Duration(milliseconds: 220),
                    curve: Curves.easeOutCubic,
                    child: FractionallySizedBox(
                      widthFactor: .5,
                      heightFactor: 1,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: p.text,
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                    ),
                  ),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (final (value, label) in [
                        (false, s.hubAngle),
                        (true, s.hubMuscle),
                      ])
                        Expanded(
                          child: FlarePressable(
                            key: ValueKey(
                              value ? 'hub-muscle-mode' : 'hub-angle-mode',
                            ),
                            scale: 1,
                            selected: muscles == value,
                            inMutuallyExclusiveGroup: true,
                            onTap: () => onMode(value),
                            child: Center(
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Text(
                                  label,
                                  maxLines: 1,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: muscles == value
                                        ? FontWeight.w600
                                        : FontWeight.w400,
                                    color: muscles == value
                                        ? p.background
                                        : p.secondary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
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

class _HubMuscles extends StatelessWidget {
  const _HubMuscles({
    required this.catalog,
    required this.selected,
    required this.onSelected,
  });
  final Catalog catalog;
  final String selected;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return ShaderMask(
      blendMode: BlendMode.dstIn,
      shaderCallback: (bounds) => LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: const [
          Colors.transparent,
          Colors.white,
          Colors.white,
          Colors.transparent,
        ],
        stops: [
          0,
          (12 / math.max(1, bounds.height)).clamp(0.0, .5),
          (1 - 16 / math.max(1, bounds.height)).clamp(.5, 1.0),
          1,
        ],
      ).createShader(bounds),
      child: ScrollConfiguration(
        behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
        child: SingleChildScrollView(
          key: const PageStorageKey('hub-muscle-groups'),
          padding: const EdgeInsets.fromLTRB(_gutter, 0, _gutter, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final section in catalog.sections) ...[
                Padding(
                  padding: const EdgeInsets.only(top: 14, bottom: 8),
                  child: Semantics(
                    header: true,
                    child: Text(
                      section.label,
                      style: TextStyle(
                        color: p.dim,
                        fontSize: 11,
                        letterSpacing: 1.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final group in catalog.groups.where(
                      (group) => group.section == section.id,
                    ))
                      _chip(context, group, p),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _chip(BuildContext context, MuscleGroup group, FlarePalette p) {
    final active = selected == group.id;
    return FlarePressable(
      key: ValueKey('hub-muscle-${group.id}'),
      onTap: () => onSelected(group.id),
      selected: active,
      inMutuallyExclusiveGroup: true,
      scale: 1,
      child: AnimatedContainer(
        duration: FlareMotion.reduced(context)
            ? Duration.zero
            : const Duration(milliseconds: 180),
        height: 32,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: active ? p.accent.withValues(alpha: .12) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: active ? p.accent.withValues(alpha: .55) : p.hairline,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Flexible(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: AlignmentDirectional.centerStart,
                child: Text(
                  group.label,
                  maxLines: 1,
                  style: TextStyle(
                    fontSize: 12.5,
                    color: active ? p.text : p.secondary,
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

class _PrimaryMusclePill extends StatelessWidget {
  const _PrimaryMusclePill({required this.group});

  final MuscleGroup group;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return Container(
      height: 28,
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: _hubSurface(p),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: p.hairline),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: 6,
        children: [
          SizedBox.square(
            dimension: 7,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: Color(group.colorValue),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Flexible(
            child: Text(
              group.id == 'abs' ? group.shortLabel : group.label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: p.secondary, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}

class _HubPlanCard extends StatelessWidget {
  const _HubPlanCard({
    required this.selection,
    required this.title,
    required this.plan,
    required this.onOpen,
  });

  static const _radius = BorderRadius.all(Radius.circular(20));
  final Key selection;
  final String title;
  final FlarePlan? plan;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    final selectedPlan = plan;
    final planned = selectedPlan != null;
    final reduced = FlareMotion.reduced(context);
    final duration = reduced
        ? Duration.zero
        : const Duration(milliseconds: 240);
    final subtitle = selectedPlan == null
        ? s.hubStageBeingPlanned
        : [
            s.hubMinutesFrom(flarePlanMinutes(selectedPlan)),
            s.planDrillCount(selectedPlan.items.length),
            s.hubThreeTiers,
          ].join(' · ');
    final pending = p.isDark ? const Color(0xff111114) : p.surface;

    return FlarePressable(
      onTap: planned ? onOpen : null,
      scale: .98,
      pressDuration: const Duration(milliseconds: 120),
      semanticLabel: planned ? s.hubViewPlan : null,
      preserveChildSemantics: true,
      plainWhenDisabled: true,
      child: TweenAnimationBuilder<double>(
        tween: Tween(end: planned ? 1 : 0),
        duration: duration,
        curve: Curves.easeOutCubic,
        builder: (context, progress, child) {
          final base = Color.lerp(pending, _hubSurface(p), progress)!;
          final tint = Color.alphaBlend(
            p.accent.withValues(alpha: .22 * progress),
            base,
          );
          return CustomPaint(
            foregroundPainter: _PlanCardOutline(
              dashed: (p.isDark ? p.selectedSegment : p.controlBorder)
                  .withValues(alpha: 1 - progress),
              solid: p.accent.withValues(alpha: .35 * progress),
            ),
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: _radius,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [tint, base, base],
                  stops: const [0, .7, 1],
                ),
              ),
              child: child,
            ),
          );
        },
        child: SizedBox(
          height: _planCardHeight,
          child: Stack(
            fit: StackFit.expand,
            children: [
              if (planned)
                const IgnorePointer(
                  child: SizedBox(key: ValueKey('hub-view-plan')),
                ),
              Padding(
                padding: const EdgeInsetsDirectional.only(start: 18, end: 10),
                child: Row(
                  children: [
                    Expanded(
                      child: AnimatedSwitcher(
                        duration: reduced
                            ? Duration.zero
                            : const Duration(milliseconds: 200),
                        layoutBuilder: (current, previous) => Stack(
                          alignment: AlignmentDirectional.centerStart,
                          children: [
                            for (final old in previous)
                              ExcludeSemantics(child: old),
                            ?current,
                          ],
                        ),
                        child: Column(
                          key: selection,
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _line(
                              s.hubSpecializedPlan,
                              15,
                              TextStyle(
                                color: planned ? p.accentInk : p.dim,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1.5,
                              ),
                            ),
                            const SizedBox(height: 4),
                            _line(
                              planned ? title : s.hubPlanInPreparation,
                              22,
                              TextStyle(
                                color: planned ? p.text : p.secondary,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            _line(
                              subtitle,
                              17,
                              TextStyle(color: p.secondary, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                    AnimatedSwitcher(
                      duration: duration,
                      child: planned
                          ? const Padding(
                              padding: EdgeInsetsDirectional.only(start: 8),
                              child: _PlanCardArrow(),
                            )
                          : const SizedBox.shrink(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _line(String label, double height, TextStyle style) => SizedBox(
    height: height,
    child: FittedBox(
      fit: BoxFit.scaleDown,
      alignment: AlignmentDirectional.centerStart,
      child: Text(label, style: style, maxLines: 1),
    ),
  );
}

class _PlanCardOutline extends CustomPainter {
  const _PlanCardOutline({required this.dashed, required this.solid});

  final Color dashed;
  final Color solid;

  @override
  void paint(Canvas canvas, Size size) {
    final bounds = (Offset.zero & size).deflate(.5);
    final outline = RRect.fromRectAndRadius(
      bounds,
      const Radius.circular(19.5),
    );
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    if (solid.a > 0) canvas.drawRRect(outline, paint..color = solid);
    if (dashed.a == 0) return;
    final track = (Path()..addRRect(outline)).computeMetrics().single;
    paint.color = dashed;
    for (var distance = 0.0; distance < track.length; distance += 8) {
      canvas.drawPath(
        track.extractPath(distance, math.min(distance + 4, track.length)),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(_PlanCardOutline old) =>
      old.dashed != dashed || old.solid != solid;
}

class _PlanCardArrow extends StatelessWidget {
  const _PlanCardArrow();

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return SizedBox.square(
      dimension: 52,
      child: DecoratedBox(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color.lerp(p.accent, Colors.white, .15)!, p.accent],
          ),
          boxShadow: [
            BoxShadow(
              color: p.accent,
              blurRadius: 22,
              spreadRadius: -8,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Icon(Icons.arrow_forward_rounded, color: p.onAccent, size: 20),
      ),
    );
  }
}
