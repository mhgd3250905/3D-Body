import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart' show CupertinoSlidingSegmentedControl;
import 'app_glass.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import '../coach/plan_mapping.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/training_plan_adapter.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'content_pages.dart' show PageHeader;
import 'drill_media.dart';
import 'motion.dart';
import 'theme.dart';

bool _routineHasItem(TrainingRoutine routine, String drillId) =>
    routine.sdkPlan?.items.any((item) => item.exerciseId == drillId) ??
    routine.drillIds.contains(drillId);

/// Titles and one-line purposes for the ready-made directions.
extension PresetText on PresetPlan {
  String title(BuildContext context) {
    final s = context.strings;
    return switch (id) {
      'warmup' => s.presetWarmup,
      'support' => s.presetSupport,
      'core' => s.presetCore,
      'legs' => s.presetLegs,
      'side' => s.presetSide,
      _ => s.presetFlare,
    };
  }

  String line(BuildContext context) {
    final s = context.strings;
    return switch (id) {
      'warmup' => s.presetWarmupLine,
      'support' => s.presetSupportLine,
      'core' => s.presetCoreLine,
      'legs' => s.presetLegsLine,
      'side' => s.presetSideLine,
      _ => s.presetFlareLine,
    };
  }

  IconData get icon => switch (id) {
    'warmup' => Icons.local_fire_department_outlined,
    'support' => Icons.front_hand_outlined,
    'core' => Icons.fitness_center_rounded,
    'legs' => Icons.directions_run_rounded,
    'side' => Icons.swap_horiz_rounded,
    _ => Icons.all_inclusive_rounded,
  };
}

String sceneLabel(BuildContext context, String tier) {
  final s = context.strings;
  return switch (tier) {
    'B' => s.sceneHome,
    'C' => s.sceneGym,
    _ => s.sceneNone,
  };
}

/// Still poster of a drill's video. Never plays: plan surfaces are for
/// choosing, and the drill page owns playback.
class DrillPoster extends StatelessWidget {
  const DrillPoster(this.drill, {super.key});
  final Drill drill;
  @override
  Widget build(BuildContext context) => ColoredBox(
    color: FlareColors.raised,
    child: Image.asset(
      'assets/drill_media/${drill.id}.jpg',
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
  );
}

/// Up to three overlapping round posters, for a compact row.
class _Stack extends StatelessWidget {
  const _Stack(this.drills);
  final List<Drill> drills;
  @override
  Widget build(BuildContext context) {
    final shown = drills.take(3).toList();
    const size = 44.0, step = 18.0;
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

class _SceneSwitch extends StatelessWidget {
  const _SceneSwitch({required this.store, this.preview = false});
  final LearningStore store;
  final bool preview;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    if (preview) {
      return SizedBox(
        width: double.infinity,
        child: CupertinoSlidingSegmentedControl<String>(
          groupValue: store.settings.tier,
          backgroundColor: FlareColors.palette.segmentTrack,
          thumbColor: FlareColors.palette.segmentThumb,
          padding: const EdgeInsets.all(4),
          children: {
            for (final entry in [
              ('A', s.sceneNone),
              ('B', s.sceneHome),
              ('C', s.sceneGym),
            ])
              entry.$1: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 6,
                  vertical: 10,
                ),
                child: Text(
                  entry.$2,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: FlareColors.text,
                    fontSize: 13,
                    height: 1.25,
                    fontWeight: entry.$1 == store.settings.tier
                        ? FontWeight.w600
                        : FontWeight.w400,
                  ),
                ),
              ),
          },
          onValueChanged: (tier) {
            if (tier == null || tier == store.settings.tier) {
              return;
            }
            FlareHaptics.selection();
            store.updateSettings(tier: tier);
          },
        ),
      );
    }
    return FlareSegmented<String>(
      expand: true,
      segments: [('A', s.sceneNone), ('B', s.sceneHome), ('C', s.sceneGym)],
      selected: store.settings.tier,
      onChanged: (tier) {
        if (tier == store.settings.tier) return;
        FlareHaptics.selection();
        store.updateSettings(tier: tier);
      },
    );
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader(this.text, {this.action});
  final String text;
  final Widget? action;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 18, bottom: 10, left: 2),
    child: Row(
      children: [
        Expanded(
          child: Semantics(
            header: true,
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 17,
                height: 1.3,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
        ?action,
      ],
    ),
  );
}

/// The plans tab: the user's own sets, then six ready-made directions with
/// one scene switch that turns every preset into its bodyweight, home or gym
/// version.
class PlansPage extends StatelessWidget {
  const PlansPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onPreset,
    required this.onRoutine,
    required this.onNewRoutine,
    this.onBack,
    this.onAiCoach,
    this.aiCoachConfigured = true,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<PresetPlan> onPreset;
  final ValueChanged<TrainingRoutine> onRoutine;
  final VoidCallback onNewRoutine;
  final VoidCallback? onBack;

  /// AI 定制入口（中文界面才给）；null 不显示。
  final VoidCallback? onAiCoach;
  final bool aiCoachConfigured;

  Widget _entrySurface({
    required Widget child,
    required Key key,
    required VoidCallback onTap,
  }) => FlareStaticSurface(
    child: Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(FlareRadius.group),
      child: InkWell(
        key: key,
        borderRadius: BorderRadius.circular(FlareRadius.group),
        onTap: onTap,
        child: Padding(padding: const EdgeInsets.all(16), child: child),
      ),
    ),
  );

  Widget _entryIcon(IconData icon) => Container(
    width: 44,
    height: 44,
    decoration: BoxDecoration(
      color: FlareColors.accent.withValues(alpha: .10),
      shape: BoxShape.circle,
    ),
    child: Icon(icon, color: FlareColors.accentInk, size: 21),
  );

  Widget _aiCard(BuildContext context) => _entrySurface(
    key: const ValueKey('plan-ai-coach'),
    onTap: onAiCoach!,
    child: Row(
      children: [
        _entryIcon(Icons.auto_awesome_rounded),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Wrap(
                spacing: 8,
                runSpacing: 4,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  const Text(
                    'AI 定制',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  if (!aiCoachConfigured)
                    Text(
                      '未配置',
                      key: const ValueKey('plan-ai-unconfigured'),
                      style: TextStyle(
                        fontSize: 12,
                        color: FlareColors.warning,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 5),
              Text(
                aiCoachConfigured
                    ? '说出场地、时长和想练的部位，排一份托马斯专项计划'
                    : '暂未接入 AI，会按你的描述推荐一套预设方案',
                style: TextStyle(
                  fontSize: 13,
                  height: 1.45,
                  color: FlareColors.secondary,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Icon(Icons.chevron_right_rounded, color: FlareColors.dim, size: 20),
      ],
    ),
  );

  Widget _newCard(BuildContext context) => _entrySurface(
    key: const ValueKey('plan-new'),
    onTap: onNewRoutine,
    child: Row(
      children: [
        _entryIcon(Icons.add_rounded),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                context.strings.planNew,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                context.strings.planNewHint,
                style: TextStyle(
                  fontSize: 13,
                  height: 1.45,
                  color: FlareColors.secondary,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );

  Widget _routineRow(BuildContext context, TrainingRoutine routine) {
    final s = context.strings;
    final plan = routine.sdkPlan;
    final drills = plan == null
        ? routine.drills(catalog)
        : [for (final item in plan.items) ?catalog.drillById(item.exerciseId)];
    final count = plan?.items.length ?? drills.length;
    final minutes = plan == null
        ? estimateMinutes(drills)
        : (estimateTrainingPlanSeconds(plan, catalog) / 60).ceil().clamp(
            1,
            999,
          );
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: RepaintBoundary(
        child: _entrySurface(
          key: ValueKey('routine-${routine.id}'),
          onTap: () => onRoutine(routine),
          child: Row(
            children: [
              _Stack(drills),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      routine.name,
                      style: const TextStyle(
                        fontSize: 16,
                        height: 1.3,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      s.planMeta(count, minutes),
                      style: TextStyle(
                        fontSize: 13,
                        height: 1.4,
                        color: FlareColors.secondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              Icon(
                Icons.chevron_right_rounded,
                color: FlareColors.dim,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final tier = store.settings.tier;
    final routines = store.routines;
    final mine = <Widget>[
      _SectionHeader(
        s.plansMine,
        action: routines.isEmpty
            ? null
            : RoundIconButton(
                key: const ValueKey('plan-new-small'),
                icon: Icons.add_rounded,
                tooltip: s.planNew,
                diameter: 44,
                onPressed: onNewRoutine,
              ),
      ),
      if (routines.isEmpty)
        _newCard(context)
      else
        for (final routine in routines) _routineRow(context, routine),
    ];
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
          child: Row(
            children: [
              SizedBox(
                width: 48,
                child: onBack == null
                    ? null
                    : FlareGlassIconButton(
                        icon: Icons.arrow_back_ios_new_rounded,
                        label: s.goBack,
                        onPressed: onBack,
                      ),
              ),
              Expanded(
                child: Semantics(
                  header: true,
                  child: Text(
                    s.plans,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 24,
                      height: 1.25,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 48),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
          child: _SceneSwitch(store: store, preview: true),
        ),
        Expanded(
          child: CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList.list(
                  children: [
                    if (onAiCoach != null) _aiCard(context),
                    if (routines.isNotEmpty) ...mine,
                    _SectionHeader(s.plansReady),
                  ],
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverLayoutBuilder(
                  builder: (context, box) {
                    final textScale =
                        MediaQuery.textScalerOf(context).scale(14) / 14;
                    final columns =
                        box.crossAxisExtent < 330 || textScale > 1.35 ? 1 : 2;
                    final presets = PresetPlan.all;
                    return SliverList.builder(
                      itemCount: (presets.length / columns).ceil(),
                      itemBuilder: (context, row) => Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            for (
                              var column = 0;
                              column < columns;
                              column++
                            ) ...[
                              if (column > 0) const SizedBox(width: 14),
                              Expanded(
                                child: row * columns + column >= presets.length
                                    ? const SizedBox.shrink()
                                    : RepaintBoundary(
                                        key: ValueKey(
                                          'preset-$tier-${presets[row * columns + column].id}',
                                        ),
                                        child: _PresetCard(
                                          preset:
                                              presets[row * columns + column],
                                          drills:
                                              presets[row * columns + column]
                                                  .drills(catalog, tier),
                                          onTap: () => onPreset(
                                            presets[row * columns + column],
                                          ),
                                        ),
                                      ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
                sliver: SliverList.list(
                  children: [if (routines.isEmpty) ...mine],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _PresetCard extends StatelessWidget {
  const _PresetCard({
    required this.preset,
    required this.drills,
    required this.onTap,
  });
  final PresetPlan preset;
  final List<Drill> drills;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return FlareStaticSurface(
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(FlareRadius.group),
        child: InkWell(
          key: ValueKey('preset-${preset.id}'),
          borderRadius: BorderRadius.circular(FlareRadius.group),
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(FlareRadius.group),
                ),
                child: AspectRatio(
                  aspectRatio: 4 / 3,
                  child: RepaintBoundary(
                    child: drills.isEmpty
                        ? ColoredBox(
                            color: FlareColors.raised,
                            child: Icon(preset.icon, color: FlareColors.dim),
                          )
                        : DrillPoster(drills.first),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(14, 13, 14, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      preset.title(context),
                      style: const TextStyle(
                        fontSize: 17,
                        height: 1.3,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      preset.line(context),
                      style: TextStyle(
                        fontSize: 13,
                        height: 1.45,
                        color: FlareColors.secondary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '${s.planDrillCount(drills.length)} · ≈ ${s.minutesShort(estimateMinutes(drills))}',
                      style: TextStyle(
                        fontSize: 12,
                        height: 1.4,
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
    );
  }
}

/// One set, ready to run: what it is for, the scene, and its drills in order.
/// Presets follow the shared scene switch; the user's own sets are fixed.
class PlanDetailPage extends StatelessWidget {
  const PlanDetailPage({
    super.key,
    required this.title,
    required this.drills,
    required this.onBack,
    required this.onStart,
    required this.onDrill,
    this.line,
    this.store,
    this.onSaveAsMine,
    this.onEdit,
    this.sdkPlan,
    this.catalog,
  });
  final String title;
  final String? line;
  final List<Drill> drills;
  final VoidCallback onBack;
  final VoidCallback onStart;
  final ValueChanged<Drill> onDrill;
  final uc.TrainingPlan? sdkPlan;
  final Catalog? catalog;

  /// Given for presets: shows the scene switch.
  final LearningStore? store;
  final VoidCallback? onSaveAsMine;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final plan = sdkPlan;
    final mapper = catalog == null ? null : CoachPlanMapper(catalog!);
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
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        children: [
          PageHeader(
            title: title,
            large: false,
            onBack: onBack,
            action: onEdit == null
                ? null
                : RoundIconButton(
                    key: const ValueKey('plan-edit'),
                    icon: Icons.edit_outlined,
                    tooltip: s.planEdit,
                    onPressed: onEdit,
                  ),
          ),
          Expanded(
            child: ScrollEdge(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                children: [
                  if (line != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Text(
                        line!,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 15,
                          height: 1.45,
                          color: FlareColors.secondary,
                        ),
                      ),
                    ),
                  Text(
                    s.planMeta(entries?.length ?? drills.length, minutes),
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: FlareColors.dim),
                  ),
                  const SizedBox(height: 16),
                  if (store case final store?) ...[
                    _SceneSwitch(store: store),
                    const SizedBox(height: 16),
                  ],
                  if (!available)
                    Text(
                      ts.mediaUnavailable,
                      style: TextStyle(color: FlareColors.warning),
                    ),
                  if (entries != null)
                    for (final (index, entry) in entries.indexed) ...[
                      if (index == 0 ||
                          entries[index - 1].blockIndex != entry.blockIndex)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          child: Text(
                            [
                              entry.block.name,
                              if (entry.block.type == uc.BlockType.circuit)
                                ts.roundOf(1, entry.block.rounds),
                              if (entry.block.type == uc.BlockType.circuit)
                                '${s.rest} · ${s.secondsLabel(entry.block.restBetweenRoundsSeconds)}',
                            ].where((part) => part.isNotEmpty).join(' · '),
                          ),
                        ),
                      _NumberedDrill(
                        key: ValueKey('sdk-plan-row-$index'),
                        index: index,
                        drill: entry.drill,
                        doseText: entry.doseText,
                        onTap: () => onDrill(entry.drill),
                      ),
                    ],
                  if (entries == null)
                    for (final (index, drill) in drills.indexed)
                      FadeSlideIn(
                        key: ValueKey('plan-row-${drill.id}'),
                        delay: FadeSlideIn.stagger(index),
                        child: _NumberedDrill(
                          index: index,
                          drill: drill,
                          onTap: () => onDrill(drill),
                        ),
                      ),
                  if (onSaveAsMine != null)
                    Center(
                      child: TextButton.icon(
                        key: const ValueKey('plan-save-as-mine'),
                        onPressed: onSaveAsMine,
                        icon: const Icon(Icons.bookmark_add_outlined, size: 18),
                        label: Text(s.planSaveAsMine),
                      ),
                    ),
                ],
              ),
            ),
          ),
          FlareActionBar(
            child: PrimaryAction(
              key: const ValueKey('plan-start'),
              icon: Icons.play_arrow_rounded,
              label: s.planStart,
              onPressed: drills.isEmpty || !available ? null : onStart,
            ),
          ),
        ],
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
    this.state,
    this.doseText,
  });
  final int index;
  final Drill drill;
  final VoidCallback onTap;
  final Widget? trailing;
  final String? doseText;

  /// null: plain; true: done; false: current.
  final bool? state;
  @override
  Widget build(BuildContext context) {
    final done = state == true;
    final current = state == false;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: RepaintBoundary(
        child: Material(
          color: current
              ? FlareColors.accent.withValues(alpha: .10)
              : FlareStaticSurface.colorOf(context),
          borderRadius: BorderRadius.circular(FlareRadius.group),
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
                      child: done
                          ? Icon(
                              Icons.check_circle_rounded,
                              size: 20,
                              color: FlareColors.success,
                            )
                          : Text(
                              '${index + 1}',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: current
                                    ? FlareColors.accentInk
                                    : FlareColors.dim,
                                fontFeatures: const [
                                  FontFeature.tabularFigures(),
                                ],
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: SizedBox.square(
                      dimension: 60,
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
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: done ? FlareColors.secondary : null,
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
  });
  final Catalog catalog;
  final LearningStore store;
  final VoidCallback onBack;
  final ValueChanged<TrainingRoutine> onSaved;
  final TrainingRoutine? routine;
  final String? seedName;
  final List<String> seedDrillIds;
  final VoidCallback? onDeleted;
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
    final picked = await showDrillPicker(
      context,
      catalog: widget.catalog,
      initialTier: widget.store.settings.tier,
      exclude: _ids.toSet(),
      room: TrainingRoutine.maxDrills - _ids.length,
    );
    if (!mounted || picked == null || picked.isEmpty) return;
    setState(() => _ids = [..._ids, ...picked]);
  }

  Future<void> _save() async {
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
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        children: [
          PageHeader(
            title: widget.routine == null ? s.planNew : s.planEdit,
            large: false,
            onBack: widget.onBack,
          ),
          Expanded(
            child: ScrollEdge(
              child: ReorderableListView.builder(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                buildDefaultDragHandles: false,
                header: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    TextField(
                      key: const ValueKey('routine-name'),
                      controller: _name,
                      maxLength: TrainingRoutine.maxName,
                      textInputAction: TextInputAction.done,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                      decoration: InputDecoration(
                        hintText: s.planDefaultName,
                        labelText: s.planNameHint,
                        counterText: '',
                      ),
                      onSubmitted: (_) => FocusScope.of(context).unfocus(),
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
                      OutlinedButton.icon(
                        key: const ValueKey('routine-add'),
                        onPressed: full ? null : _add,
                        icon: const Icon(Icons.add_rounded, size: 18),
                        label: Text(s.planAddDrills),
                      ),
                      if (widget.onDeleted != null) ...[
                        const SizedBox(height: 24),
                        Center(
                          child: TextButton(
                            key: const ValueKey('routine-delete'),
                            onPressed: _busy ? null : widget.onDeleted,
                            child: Text(
                              s.planDelete,
                              style: TextStyle(
                                color: FlareColors.warning,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                itemCount: drills.length,
                onReorderItem: (from, to) {
                  FlareHaptics.selection();
                  setState(() {
                    final id = _ids.removeAt(from);
                    _ids.insert(to, id);
                  });
                },
                proxyDecorator: (child, _, _) => Material(
                  color: Colors.transparent,
                  elevation: 6,
                  shadowColor: Colors.black38,
                  borderRadius: BorderRadius.circular(FlareRadius.item),
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
                          onPressed: () {
                            FlareHaptics.light();
                            setState(() => _ids.remove(drill.id));
                          },
                        ),
                        ReorderableDragStartListener(
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
          ),
          FlareActionBar(
            child: PrimaryAction(
              key: const ValueKey('routine-save'),
              label: s.planSave,
              onPressed: _busy || _ids.isEmpty ? null : _save,
            ),
          ),
        ],
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
  builder: (sheet) => _DrillPicker(
    catalog: catalog,
    initialTier: initialTier,
    exclude: exclude,
    room: room,
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

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final catalog = widget.catalog;
    final drills = catalog.searchDrills(_query, tier: _tier, section: _section);
    Widget pill(String label, bool selected, VoidCallback onTap) => Padding(
      padding: const EdgeInsets.only(right: 8),
      child: Semantics(
        selected: selected,
        button: true,
        child: Material(
          color: selected ? FlareColors.accent : FlareColors.pill,
          shape: StadiumBorder(
            side: BorderSide(
              color: selected ? Colors.transparent : FlareColors.hairline,
            ),
          ),
          child: InkWell(
            customBorder: const StadiumBorder(),
            onTap: () {
              FlareHaptics.selection();
              onTap();
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Center(
                widthFactor: 1,
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    color: selected
                        ? FlareColors.onAccent
                        : FlareColors.secondary,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    return SafeArea(
      child: SizedBox(
        height: MediaQuery.sizeOf(context).height * .86,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
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
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
              child: TextField(
                key: const ValueKey('picker-search'),
                textInputAction: TextInputAction.search,
                decoration: InputDecoration(
                  hintText: s.searchDrills,
                  prefixIcon: const Icon(Icons.search_rounded),
                  isDense: true,
                ),
                onChanged: (value) => setState(() => _query = value),
              ),
            ),
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  for (final item in [
                    ('A', s.sceneNone),
                    ('B', s.sceneHome),
                    ('C', s.sceneGym),
                  ])
                    pill(
                      item.$2,
                      _tier == item.$1,
                      () => setState(() => _tier = item.$1),
                    ),
                  Container(
                    width: 1,
                    margin: const EdgeInsets.fromLTRB(2, 8, 10, 8),
                    color: FlareColors.hairline,
                  ),
                  pill(
                    s.allSections,
                    _section == null,
                    () => setState(() => _section = null),
                  ),
                  for (final section in catalog.sections)
                    pill(
                      section.short,
                      _section == section.id,
                      () => setState(() => _section = section.id),
                    ),
                ],
              ),
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
                                selected: picked || already,
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
                                                DrillPoster(drill),
                                                if (picked || already)
                                                  Positioned(
                                                    top: 6,
                                                    right: 6,
                                                    child: Container(
                                                      width: 22,
                                                      height: 22,
                                                      alignment:
                                                          Alignment.center,
                                                      decoration: BoxDecoration(
                                                        shape: BoxShape.circle,
                                                        color: already
                                                            ? FlareColors.dim
                                                            : FlareColors
                                                                  .accent,
                                                      ),
                                                      child: already
                                                          ? Icon(
                                                              Icons
                                                                  .check_rounded,
                                                              size: 14,
                                                              color: FlareColors
                                                                  .onAccent,
                                                            )
                                                          : Text(
                                                              '${order + 1}',
                                                              style: TextStyle(
                                                                fontSize: 11,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .w700,
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
            FlareActionBar(
              child: PrimaryAction(
                key: const ValueKey('picker-done'),
                label: _picked.isEmpty
                    ? s.planAddDrills
                    : '${s.planAddDrills} · ${_picked.length}',
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
    return SafeArea(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.sizeOf(sheet).height * .7,
        ),
        child: ListView(
          shrinkWrap: true,
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 0, 4, 12),
              child: Text(
                s.planAddTo,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            for (final routine in store.routines)
              ListTile(
                key: ValueKey('add-to-${routine.id}'),
                contentPadding: const EdgeInsets.symmetric(horizontal: 4),
                minTileHeight: 60,
                leading: SizedBox.square(
                  dimension: 44,
                  child: ClipOval(
                    child: routine.drills(catalog).isEmpty
                        ? null
                        : DrillPoster(routine.drills(catalog).first),
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
                trailing: _routineHasItem(routine, drill.id)
                    ? Icon(Icons.check_rounded, color: FlareColors.success)
                    : Icon(Icons.add_rounded, color: FlareColors.dim),
                enabled:
                    !_routineHasItem(routine, drill.id) &&
                    (routine.sdkPlan != null ||
                        routine.drillIds.length < TrainingRoutine.maxDrills),
                onTap: () => Navigator.pop(sheet, routine.id),
              ),
            ListTile(
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
                child: Icon(Icons.add_rounded, color: FlareColors.accentInk),
              ),
              title: Text(
                s.planNewWith,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              onTap: () => Navigator.pop(sheet, 'new'),
            ),
          ],
        ),
      ),
    );
  },
);

/// The run hub between drills: what is next, what is done, and one button.
/// Historical run-hub fixture. Production entry points now push the complete
/// plan directly into FlareTrainingPage / TrainerPlayer.
class PlanRunPage extends StatelessWidget {
  const PlanRunPage({
    super.key,
    required this.title,
    required this.drills,
    required this.done,
    this.skipped = const {},
    required this.index,
    required this.onStart,
    required this.onSelect,
    required this.onSkip,
    required this.onFinish,
  });
  final String title;
  final List<Drill> drills;
  final Set<int> done;
  final Set<int> skipped;
  final int index;
  final VoidCallback onStart;
  final ValueChanged<int> onSelect;
  final VoidCallback onSkip;
  final VoidCallback onFinish;

  bool get ended => index >= drills.length;
  bool get complete => ended && done.length == drills.length;

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final total = drills.length;
    final progress = total == 0 ? 0.0 : done.length / total;
    final endColor = complete ? FlareColors.success : FlareColors.secondary;
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        children: [
          PageHeader(title: title, large: false, onBack: onFinish),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 4),
            child: Column(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: TweenAnimationBuilder<double>(
                    tween: Tween(end: progress),
                    duration: FlareMotion.of(context, FlareMotion.expand),
                    curve: FlareMotion.settle,
                    builder: (context, value, _) => LinearProgressIndicator(
                      value: value,
                      minHeight: 5,
                      backgroundColor: FlareColors.track,
                      color: FlareColors.accent,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  s.planAllDoneLine(done.length, total),
                  style: TextStyle(fontSize: 12, color: FlareColors.dim),
                ),
                if (skipped.isNotEmpty)
                  Text(
                    s.planSkippedCount(skipped.length),
                    style: TextStyle(fontSize: 12, color: FlareColors.dim),
                  ),
              ],
            ),
          ),
          Expanded(
            child: ScrollEdge(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                children: [
                  if (ended)
                    FadeSlideIn(
                      key: const ValueKey('run-complete'),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 28),
                        child: Column(
                          children: [
                            Container(
                              width: 72,
                              height: 72,
                              decoration: BoxDecoration(
                                color: endColor.withValues(alpha: .14),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                complete
                                    ? Icons.check_rounded
                                    : Icons.flag_outlined,
                                size: 38,
                                color: endColor,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              complete ? s.planAllDone : s.planRunEnded,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    FadeSlideIn(
                      key: ValueKey('run-next-$index'),
                      offset: 10,
                      child: _NextCard(
                        drill: drills[index],
                        label: s.planOf(index + 1, total),
                      ),
                    ),
                  const SizedBox(height: 18),
                  Eyebrow(s.planDrillCount(total)),
                  const SizedBox(height: 10),
                  for (final (i, drill) in drills.indexed)
                    _NumberedDrill(
                      key: ValueKey('run-row-$i'),
                      index: i,
                      drill: drill,
                      state: done.contains(i)
                          ? true
                          : i == index
                          ? false
                          : null,
                      trailing: skipped.contains(i)
                          ? Padding(
                              padding: const EdgeInsets.only(right: 4),
                              child: Text(
                                s.planSkipped,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: FlareColors.dim,
                                ),
                              ),
                            )
                          : const SizedBox(width: 8),
                      onTap: () => onSelect(i),
                    ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
            child: PrimaryAction(
              key: const ValueKey('run-start'),
              icon: ended ? Icons.check_rounded : Icons.play_arrow_rounded,
              label: ended ? s.done : s.planStartDrill(drills[index].name),
              onPressed: ended ? onFinish : onStart,
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: ended
                ? const SizedBox(height: 48)
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextButton(
                        key: const ValueKey('run-skip'),
                        onPressed: onSkip,
                        child: Text(
                          s.planSkip,
                          style: TextStyle(color: FlareColors.secondary),
                        ),
                      ),
                      const SizedBox(width: 12),
                      TextButton(
                        key: const ValueKey('run-end'),
                        onPressed: onFinish,
                        child: Text(
                          s.planFinish,
                          style: TextStyle(color: FlareColors.secondary),
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

class _NextCard extends StatelessWidget {
  const _NextCard({required this.drill, required this.label});
  final Drill drill;
  final String label;
  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: FlareStaticSurface(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(FlareRadius.group),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AspectRatio(
              aspectRatio: 16 / 10,
              child: DrillMediaCard(
                key: ValueKey('run-media-${drill.id}'),
                drillId: drill.id,
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Eyebrow(label, color: FlareColors.accentInk),
                  const SizedBox(height: 4),
                  Text(
                    drill.name,
                    style: const TextStyle(
                      fontSize: 20,
                      height: 1.25,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${drill.prescription} · ${drill.equipment}',
                    style: TextStyle(
                      fontSize: 13,
                      height: 1.4,
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
  );
}
