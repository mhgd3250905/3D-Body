import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart' show CupertinoSlidingSegmentedControl;
import 'package:ugk_coach/ugk_coach.dart' as uc;
import '../coach/plan_mapping.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/training_plan_adapter.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../data/flare_shared_library.dart';
import '../data/flare_public_media.dart';
import 'components.dart';
import 'page_kit.dart';
import 'drill_filter.dart';
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
  Widget build(BuildContext context) => ColoredBox(
    color: FlareColors.raised,
    child: Image.asset(
      drillPosterAsset(drill),
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
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    entry.$2,
                    maxLines: 1,
                    softWrap: false,
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
  const _SectionHeader(this.text);
  final String text;
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

  Widget _aiRow(BuildContext context) => FlareListRow(
    key: const ValueKey('plan-ai-coach'),
    leading: const FlareRowIcon(Icons.auto_awesome_rounded),
    title: 'AI 定制',
    subtitle: aiCoachConfigured
        ? '说出场地、时长和想练的部位，排一份专项计划'
        : '暂未接入 AI，会按你的描述推荐一套预设方案',
    trailing: aiCoachConfigured
        ? null
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '未配置',
                key: const ValueKey('plan-ai-unconfigured'),
                style: TextStyle(fontSize: 13, color: FlareColors.dim),
              ),
              Icon(
                Icons.chevron_right_rounded,
                size: 20,
                color: FlareColors.dim,
              ),
            ],
          ),
    onTap: onAiCoach,
  );

  Widget _newRow(BuildContext context, {required bool first}) => FlareListRow(
    key: ValueKey(first ? 'plan-new' : 'plan-new-small'),
    leading: const FlareRowIcon(Icons.add_rounded),
    title: context.strings.planNew,
    subtitle: first ? context.strings.planNewHint : null,
    onTap: onNewRoutine,
  );

  Widget _routineRow(BuildContext context, TrainingRoutine routine) {
    final s = context.strings;
    final plan = routine.sdkPlan;
    final drills = plan == null
        ? routine.drills(catalog)
        : [
            for (final item in plan.items)
              ?CoachPlanMapper(
                catalog,
                shared: FlareShared.current?.catalog,
              ).drillById(item.exerciseId),
          ];
    final count = plan?.items.length ?? drills.length;
    final minutes = plan == null
        ? estimateMinutes(drills)
        : (estimateTrainingPlanSeconds(plan, catalog) / 60).ceil().clamp(
            1,
            999,
          );
    return RepaintBoundary(
      child: FlareListRow(
        key: ValueKey('routine-${routine.id}'),
        leading: _Stack(drills),
        title: routine.name,
        subtitle: s.planMeta(count, minutes),
        onTap: () => onRoutine(routine),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final tier = store.settings.tier;
    final routines = store.routines;
    return Column(
      children: [
        FlareNavBar(title: s.plans, onBack: onBack),
        Expanded(
          child: CustomScrollView(
            slivers: [
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList.list(
                  children: [
                    _SectionHeader(s.plansMine),
                    FlareListGroup(
                      children: [
                        for (final routine in routines)
                          _routineRow(context, routine),
                        _newRow(context, first: routines.isEmpty),
                        if (onAiCoach != null) _aiRow(context),
                      ],
                    ),
                    const SizedBox(height: 10),
                    _SectionHeader(s.plansReady),
                    _SceneSwitch(store: store, preview: true),
                    const SizedBox(height: 14),
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
              const SliverToBoxAdapter(child: SizedBox(height: 28)),
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
    return Material(
      color: FlareColors.surface,
      borderRadius: BorderRadius.circular(18),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        key: ValueKey('preset-${preset.id}'),
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.zero,
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
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        children: [
          FlareNavBar(
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
          ),
          Expanded(
            child: ScrollEdge(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                children: [
                  if (line != null)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(4, 4, 4, 0),
                      child: Text(
                        line!,
                        style: TextStyle(
                          fontSize: 15,
                          height: 1.45,
                          color: FlareColors.secondary,
                        ),
                      ),
                    ),
                  if (store case final store?) ...[
                    const SizedBox(height: 16),
                    _SceneSwitch(store: store),
                  ],
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
                              onTap: () =>
                                  catalog!.drillById(entry.drill.id) == null
                                  ? FlareShared.openDetail(context, entry.drill.id)
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
          FlareBottomAction(
            child: PrimaryAction(
              key: const ValueKey('plan-start'),
              icon: Icons.play_arrow_rounded,
              label: s.planStart,
              onPressed:
                  (plan == null ? drills.isEmpty : plan.items.isEmpty) ||
                      !available
                  ? null
                  : onStart,
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
          borderRadius: BorderRadius.circular(grouped ? 0 : 16),
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
          FlareNavBar(
            title: widget.routine == null ? s.planNew : s.planEdit,
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
                    FlareFieldGroup(
                      label: s.planNameHint,
                      field: TextField(
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
                            onTap: full ? null : _add,
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
                              onTap: _busy ? null : widget.onDeleted,
                            ),
                          ],
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
                  borderRadius: BorderRadius.circular(18),
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
          FlareBottomAction(
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
    final drills = catalog.searchDrills(_query, tier: _tier, section: _section);
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
