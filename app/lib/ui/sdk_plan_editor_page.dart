import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../data/catalog.dart';
import '../trainer/training_plan_adapter.dart' show trainingPlanFromDrills;
import 'components.dart';
import 'page_kit.dart';
import 'plans_page.dart' show showDrillPicker;
import 'theme.dart';

/// Edits item order within each block while preserving the SDK plan's identity,
/// block types, rounds, rests and the unchanged item objects and doses.
class SdkPlanEditorPage extends StatefulWidget {
  const SdkPlanEditorPage({
    super.key,
    required this.plan,
    required this.catalog,
    required this.onBack,
    required this.onSaved,
    this.initialTier = 'A',
  });
  final uc.TrainingPlan plan;
  final Catalog catalog;
  final VoidCallback onBack;
  final Future<bool> Function(uc.TrainingPlan plan) onSaved;
  final String initialTier;

  @override
  State<SdkPlanEditorPage> createState() => _SdkPlanEditorPageState();
}

class _SdkPlanEditorPageState extends State<SdkPlanEditorPage> {
  static uc.TrainingPlan _decodePlan(Object? json) {
    final decoded = const uc.PlanCodec().decodeStrict(json);
    if (!decoded.ok) throw const FormatException('Invalid SDK plan');
    return decoded.plan!;
  }

  late final _name = TextEditingController(text: widget.plan.title);
  late final List<List<uc.PlanItem>> _items = [
    for (final block in _decodePlan(widget.plan.toJson()).blocks)
      [...block.items],
  ];
  bool _picking = false;
  bool _saving = false;

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _add(int blockIndex) async {
    if (_picking || _saving) return;
    _picking = true;
    final ids = await showDrillPicker(
      context,
      catalog: widget.catalog,
      initialTier: widget.initialTier,
      room: widget.catalog.drills.length,
    );
    _picking = false;
    if (!mounted || ids == null || ids.isEmpty) return;
    try {
      final added = trainingPlanFromDrills(
        title: widget.plan.title,
        drills: [for (final id in ids) widget.catalog.drillById(id)!],
      ).items.toList();
      setState(() => _items[blockIndex].addAll(added));
    } on Object {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(context.strings.saveFailed)));
    }
  }

  Future<void> _save() async {
    if (_saving || !_items.any((items) => items.isNotEmpty)) return;
    setState(() => _saving = true);
    // PlanCodec preserves every untouched schema field, including note,
    // replacedFrom, safetyNotes and avoid; only title and block item arrays vary.
    final json = widget.plan.toJson();
    json['title'] = _name.text.trim().isEmpty
        ? widget.plan.title
        : _name.text.trim();
    json['blocks'] = [
      for (final (i, block) in widget.plan.blocks.indexed)
        if (_items[i].isNotEmpty)
          {
            ...block.toJson(),
            'items': [for (final item in _items[i]) item.toJson()],
          },
    ];
    var saved = false;
    try {
      saved = await widget.onSaved(_decodePlan(json));
    } on Object {
      saved = false;
    }
    if (!mounted) return;
    setState(() => _saving = false);
    if (!saved) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(context.strings.saveFailed)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        children: [
          FlareNavBar(
            title: s.planEdit,
            onBack: _saving ? () {} : widget.onBack,
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
              children: [
                FlareFieldGroup(
                  label: s.planNameHint,
                  field: TextField(
                    key: const ValueKey('sdk-plan-name'),
                    controller: _name,
                    enabled: !_saving,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(4, 12, 4, 0),
                  child: Text(
                    s.planReorderHint,
                    style: TextStyle(fontSize: 13, color: FlareColors.dim),
                  ),
                ),
                for (final (bi, block) in widget.plan.blocks.indexed) ...[
                  FlareSection(
                    block.type == uc.BlockType.circuit
                        ? '${block.name} · × ${block.rounds} · ${s.rest} ${s.secondsLabel(block.restBetweenRoundsSeconds)}'
                        : block.name,
                  ),
                  FlareListGroup(
                    children: [
                      ReorderableListView.builder(
                        key: ValueKey('sdk-plan-block-$bi'),
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        buildDefaultDragHandles: false,
                        itemCount: _items[bi].length,
                        onReorderItem: (from, to) {
                          if (_saving) return;
                          setState(() {
                            final item = _items[bi].removeAt(from);
                            _items[bi].insert(to, item);
                          });
                        },
                        itemBuilder: (context, ii) {
                          final item = _items[bi][ii];
                          final drill = widget.catalog.drillById(
                            item.exerciseId,
                          );
                          final amount = item.segments.isNotEmpty
                              ? [
                                  for (final (index, segment)
                                      in item.segments.indexed)
                                    '${index + 1}. ${segment.label?.trim().isNotEmpty == true ? segment.label : widget.catalog.drillById(segment.exerciseId)?.name ?? segment.exerciseId} · '
                                        '${segment.mode == uc.DoseMode.time ? s.secondsLabel(segment.workSeconds!) : s.countLabel(segment.reps!)}'
                                        '${segment.holdSeconds == null ? '' : ' · ⏸ ${s.secondsLabel(segment.holdSeconds!)}'}',
                                ].join('\n')
                              : item.mode == uc.DoseMode.time
                              ? s.secondsLabel(item.workSeconds!)
                              : s.countLabel(item.reps!);
                          final sets =
                              block.type == uc.BlockType.circuit &&
                                  block.rounds > 1
                              ? 1
                              : item.sets;
                          return ListTile(
                            key: ObjectKey(item),
                            contentPadding: const EdgeInsetsDirectional.only(
                              start: 4,
                              end: 4,
                            ),
                            subtitleTextStyle: TextStyle(
                              fontSize: 13,
                              color: FlareColors.dim,
                            ),
                            leading: ReorderableDragStartListener(
                              index: ii,
                              child: const Padding(
                                padding: EdgeInsets.all(8),
                                child: Icon(Icons.drag_indicator_rounded),
                              ),
                            ),
                            title: Text(drill?.name ?? item.exerciseId),
                            subtitle: Text(
                              '× $sets${item.perSide ? ' · ${s.bothSides}' : ''} · ${s.rest} ${s.secondsLabel(item.restSeconds)}${item.segments.isEmpty ? ' · ' : '\n'}$amount',
                            ),
                            trailing: IconButton(
                              key: ValueKey('sdk-plan-remove-$bi-$ii'),
                              tooltip: s.planRemoveDrill,
                              icon: Icon(
                                Icons.remove_circle_outline_rounded,
                                size: 20,
                                color: FlareColors.dim,
                              ),
                              onPressed: _saving
                                  ? null
                                  : () =>
                                        setState(() => _items[bi].removeAt(ii)),
                            ),
                          );
                        },
                      ),
                      FlareListRow(
                        key: ValueKey('sdk-plan-add-$bi'),
                        leading: const FlareRowIcon(Icons.add_rounded),
                        title: s.planAddDrills,
                        trailing: const SizedBox.shrink(),
                        onTap: _saving ? null : () => _add(bi),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          FlareBottomAction(
            child: PrimaryAction(
              key: const ValueKey('sdk-plan-save'),
              label: s.planSave,
              icon: Icons.check_rounded,
              onPressed: !_saving && _items.any((items) => items.isNotEmpty)
                  ? _save
                  : null,
            ),
          ),
        ],
      ),
    );
  }
}
