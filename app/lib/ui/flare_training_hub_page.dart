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
import 'scene_localization.dart';
import 'theme.dart';

const _gutter = 22.0;
const _planButtonHeight = 52.0;
const _planFooterHeight = 16.0 + 10 + _planButtonHeight;

Color _hubSurface(FlarePalette p) =>
    p.isDark ? const Color(0xff141418) : p.surface;

class FlareTrainingHubPage extends StatefulWidget {
  const FlareTrainingHubPage({
    super.key,
    required this.catalog,
    required this.actorBody,
    required this.enableScene,
    this.mountScene = true,
    required this.visible,
    required this.onBack,
    required this.onAngle,
    required this.onMuscle,
    this.actorHandoff = false,
    this.sceneBoundsKey,
    this.onScenePresented,
  });

  final Catalog catalog;
  final String actorBody;
  final bool enableScene;
  final bool mountScene;
  final bool visible;
  final VoidCallback onBack;
  final ValueChanged<Phase> onAngle;
  final ValueChanged<MuscleGroup> onMuscle;
  final bool actorHandoff;
  final GlobalKey? sceneBoundsKey;
  final VoidCallback? onScenePresented;

  @override
  State<FlareTrainingHubPage> createState() => _FlareTrainingHubPageState();
}

class _FlareTrainingHubPageState extends State<FlareTrainingHubPage> {
  final _stage = SceneController();
  late double _time = widget.catalog.phaseTime(11);
  bool _muscles = false;
  String _muscleId = 'deltoids';
  bool _muscleFocused = false;
  bool _reportedPresentation = false;
  bool _requestedPresentation = false;
  final Map<String, String> _lastMuscleInSection = {};

  Phase get _phase => widget.catalog.phaseAt(_time);
  MuscleGroup get _muscle => widget.catalog.groupById(_muscleId)!;

  @override
  void initState() {
    super.initState();
    _stage.addListener(_sceneChanged);
    _render(animate: false);
    _stage.setVisible(widget.visible);
  }

  void _sceneChanged() {
    if (!_stage.ready) {
      _requestedPresentation = _reportedPresentation = false;
      return;
    }
    if (!_requestedPresentation) {
      _requestedPresentation = true;
      _stage.requestPresentation();
    }
    if (_stage.presented && !_reportedPresentation) {
      _reportedPresentation = true;
      widget.onScenePresented?.call();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _stage.setTheme(
      Theme.of(context).brightness == Brightness.dark ? 'dark' : 'light',
    );
    _localizeScene();
  }

  @override
  void didUpdateWidget(FlareTrainingHubPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.visible != widget.visible) _stage.setVisible(widget.visible);
    if (oldWidget.catalog != widget.catalog) _localizeScene();
    if (oldWidget.actorHandoff != widget.actorHandoff) _render();
  }

  void _localizeScene() {
    _stage.setLocalization(
      sceneLocalization(
        context.strings,
        widget.catalog.groups,
        rtl: Directionality.of(context) == TextDirection.rtl,
      ),
    );
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
      focusMuscle: _muscleFocused,
      animate: animate,
      scrubbing: scrubbing,
      showCallouts: !widget.actorHandoff,
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
    if (id == _muscleId && _muscleFocused) return;
    FlareHaptics.selection();
    setState(() {
      _muscleId = id;
      _muscleFocused = true;
      _lastMuscleInSection[_muscle.section] = id;
    });
    _render(animate: !FlareMotion.reduced(context));
  }

  void _selectMuscleSection(String section) {
    if (section == _muscle.section) return;
    _selectMuscle(
      _lastMuscleInSection[section] ??
          widget.catalog.groups
              .firstWhere((group) => group.section == section)
              .id,
    );
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
    final footerBottom = safe.bottom + 34;
    final controlsBottom =
        footerBottom + _planFooterHeight + (_muscles ? 12 : 4);
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: (p.isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark)
          .copyWith(statusBarColor: Colors.transparent),
      child: ColoredBox(
        color: widget.actorHandoff ? Colors.transparent : p.background,
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
                    actorHandoff: widget.actorHandoff,
                    sceneBoundsKey: widget.sceneBoundsKey,
                    onBack: widget.onBack,
                    onMode: _selectMode,
                    onHorizontalDragUpdate: _muscles || box.maxWidth <= 0
                        ? null
                        : (details) => _stage.rotateTrainingHubAngle(
                            -2 * math.pi * details.delta.dx / box.maxWidth,
                          ),
                    scene: widget.enableScene && widget.mountScene
                        ? SceneView(
                            key: ValueKey(widget.actorBody),
                            controller: _stage,
                            body: widget.actorBody,
                            interactive: false,
                            concealed: widget.actorHandoff,
                          )
                        : const SizedBox.expand(),
                  ),
                  Expanded(
                    child: _muscles
                        ? _HubMuscles(
                            catalog: catalog,
                            selected: muscle,
                            onSelected: _selectMuscle,
                            onSection: _selectMuscleSection,
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
                  start: _gutter,
                  end: _gutter,
                  bottom: footerBottom,
                  child: _HubPlanFooter(
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
    required this.actorHandoff,
    required this.sceneBoundsKey,
    required this.onBack,
    required this.onMode,
    required this.onHorizontalDragUpdate,
    required this.scene,
  });
  final double height;
  final double safeTop;
  final bool muscles;
  final bool actorHandoff;
  final GlobalKey? sceneBoundsKey;
  final VoidCallback onBack;
  final ValueChanged<bool> onMode;
  final GestureDragUpdateCallback? onHorizontalDragUpdate;
  final Widget scene;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final shadow = Colors.black.withValues(alpha: p.isDark ? .45 : .12);
    return SizedBox(
      height: height,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: actorHandoff ? null : flarePlanArtGradient(p),
        ),
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (!actorHandoff)
              const Positioned(
                left: 0,
                right: 0,
                top: 90,
                child: Center(child: FlarePlanGlow(diameter: 320)),
              ),
            if (!actorHandoff)
              Positioned(
                left: 0,
                right: 0,
                top: muscles ? 392 : null,
                bottom: muscles ? null : height * .06,
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
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onHorizontalDragUpdate: onHorizontalDragUpdate,
                child: ClipRect(
                  key: sceneBoundsKey,
                  child: IgnorePointer(child: scene),
                ),
              ),
            ),
            if (!muscles && !actorHandoff)
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                height: 32,
                child: IgnorePointer(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          p.background.withValues(alpha: 0),
                          p.background,
                        ],
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
    required this.onSection,
  });

  final Catalog catalog;
  final MuscleGroup selected;
  final ValueChanged<String> onSelected;
  final ValueChanged<String> onSection;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    final s = context.strings;
    final groups = <String, List<MuscleGroup>>{
      for (final section in catalog.sections)
        section.id: catalog.groups
            .where((group) => group.section == section.id)
            .toList(),
    };
    final current = groups[selected.section]!;
    return Padding(
      padding: const EdgeInsets.fromLTRB(_gutter, 12, _gutter, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            spacing: 22,
            children: [
              for (final section in catalog.sections)
                Flexible(
                  child: _SectionTab(
                    id: section.id,
                    label: switch (section.id) {
                      'support' => s.hubSupportTab,
                      'core' => s.hubCoreTab,
                      'legs' => s.hubLegsTab,
                      _ => section.short,
                    },
                    count: groups[section.id]!.length,
                    selected: section.id == selected.section,
                    onTap: () => onSection(section.id),
                  ),
                ),
            ],
          ),
          SizedBox(height: 1, child: ColoredBox(color: p.hairline)),
          const SizedBox(height: 2),
          Expanded(
            child: ShaderMask(
              blendMode: BlendMode.dstIn,
              shaderCallback: (bounds) {
                final fade = (12 / math.max(1, bounds.height)).clamp(0.0, .5);
                return LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: const [
                    Colors.transparent,
                    Colors.white,
                    Colors.white,
                    Colors.transparent,
                  ],
                  stops: [0, fade, 1 - fade, 1],
                ).createShader(bounds);
              },
              child: AnimatedSwitcher(
                duration: FlareMotion.reduced(context)
                    ? Duration.zero
                    : const Duration(milliseconds: 200),
                layoutBuilder: (current, previous) => Stack(
                  fit: StackFit.expand,
                  children: [
                    for (final old in previous)
                      IgnorePointer(child: ExcludeSemantics(child: old)),
                    ?current,
                  ],
                ),
                child: GridView.builder(
                  key: PageStorageKey(selected.section),
                  primary: false,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisExtent: 44,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: current.length,
                  itemBuilder: (context, index) {
                    final group = current[index];
                    return _MuscleGridCell(
                      group: group,
                      selected: selected.id == group.id,
                      onTap: () => onSelected(group.id),
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionTab extends StatelessWidget {
  const _SectionTab({
    required this.id,
    required this.label,
    required this.count,
    required this.selected,
    required this.onTap,
  });

  final String id;
  final String label;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return FlarePressable(
      key: ValueKey('hub-section-$id'),
      selected: selected,
      inMutuallyExclusiveGroup: true,
      scale: 1,
      onTap: onTap,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        alignment: AlignmentDirectional.centerStart,
        child: IntrinsicWidth(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  spacing: 6,
                  children: [
                    Text(
                      label,
                      style: TextStyle(
                        fontSize: 14,
                        color: selected ? p.text : p.dim,
                        fontWeight: selected
                            ? FontWeight.w600
                            : FontWeight.w400,
                      ),
                    ),
                    Text(
                      count.toString(),
                      style: TextStyle(color: p.dim, fontSize: 11),
                    ),
                  ],
                ),
              ),
              SizedBox(
                height: 2,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: selected ? p.text : Colors.transparent,
                    borderRadius: BorderRadius.circular(1),
                  ),
                  child: const SizedBox.expand(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MuscleGridCell extends StatelessWidget {
  const _MuscleGridCell({
    required this.group,
    required this.selected,
    required this.onTap,
  });

  final MuscleGroup group;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = FlareColors.palette;
    return FlarePressable(
      key: ValueKey('hub-muscle-${group.id}'),
      onTap: onTap,
      selected: selected,
      inMutuallyExclusiveGroup: true,
      scale: 1,
      child: AnimatedContainer(
        duration: FlareMotion.reduced(context)
            ? Duration.zero
            : const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: selected
              ? Color.alphaBlend(p.accent.withValues(alpha: .06), p.surface)
              : p.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: selected ? p.accent : p.hairline,
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Row(
          spacing: 10,
          children: [
            SizedBox.square(
              dimension: 8,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Color(group.colorValue),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            Expanded(
              child: Text(
                group.label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 13,
                  color: p.text,
                  fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
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

class _HubPlanFooter extends StatelessWidget {
  const _HubPlanFooter({
    required this.selection,
    required this.title,
    required this.plan,
    required this.onOpen,
  });

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
    final label = planned ? s.hubViewNamedPlan(title) : s.hubPlanComingSoon;
    final subtitle = selectedPlan == null
        ? s.hubStillPlanning
        : [
            s.hubMinutesFrom(flarePlanMinutes(selectedPlan)),
            s.planDrillCount(selectedPlan.items.length),
            s.hubThreeTiers,
          ].join(' · ');
    final duration = FlareMotion.reduced(context)
        ? Duration.zero
        : const Duration(milliseconds: 200);
    final foreground = p.isDark ? Colors.black : Colors.white;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SizedBox(
          height: 16,
          child: Row(
            spacing: 10,
            children: [
              Expanded(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: AlignmentDirectional.centerStart,
                  child: Text(
                    s.hubSpecializedPlan,
                    style: TextStyle(
                      color: p.dim,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                    ),
                  ),
                ),
              ),
              Expanded(
                flex: 2,
                child: _switchText(
                  duration: duration,
                  alignment: AlignmentDirectional.centerEnd,
                  child: FittedBox(
                    key: selection,
                    fit: BoxFit.scaleDown,
                    alignment: AlignmentDirectional.centerEnd,
                    child: Text(
                      subtitle,
                      style: TextStyle(color: p.secondary, fontSize: 12),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        FlarePressable(
          onTap: planned ? onOpen : null,
          scale: .98,
          pressDuration: const Duration(milliseconds: 120),
          semanticLabel: planned ? label : null,
          plainWhenDisabled: true,
          child: Container(
            height: _planButtonHeight,
            decoration: BoxDecoration(
              color: planned
                  ? p.isDark
                        ? Colors.white
                        : const Color(0xff1b1b1f)
                  : Colors.transparent,
              border: planned ? null : Border.all(color: p.hairline),
              borderRadius: BorderRadius.circular(26),
            ),
            child: Stack(
              fit: StackFit.expand,
              children: [
                if (planned)
                  const IgnorePointer(
                    child: SizedBox(key: ValueKey('hub-view-plan')),
                  ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: _switchText(
                    duration: duration,
                    alignment: AlignmentDirectional.center,
                    child: FittedBox(
                      key: selection,
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        spacing: 8,
                        children: [
                          Text(
                            label,
                            style: TextStyle(
                              color: planned ? foreground : p.dim,
                              fontSize: 15,
                              fontWeight: planned
                                  ? FontWeight.w600
                                  : FontWeight.w500,
                            ),
                          ),
                          if (planned)
                            Icon(
                              Icons.arrow_forward_rounded,
                              color: foreground,
                              size: 16,
                            ),
                        ],
                      ),
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

  Widget _switchText({
    required Duration duration,
    required AlignmentGeometry alignment,
    required Widget child,
  }) => AnimatedSwitcher(
    duration: duration,
    layoutBuilder: (current, previous) => Stack(
      alignment: alignment,
      fit: StackFit.expand,
      children: [
        for (final old in previous) ExcludeSemantics(child: old),
        ?current,
      ],
    ),
    child: child,
  );
}
