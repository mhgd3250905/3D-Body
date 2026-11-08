import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

import 'components.dart';
import 'drill_filter.dart';
import 'motion.dart';
import 'page_kit.dart';
import 'theme.dart';

/// Flare's presentation of the SDK's catalogue facets. The SDK remains the
/// authority for matching actions; this control does not alter their data.
class PublicLibraryFilter extends StatelessWidget {
  const PublicLibraryFilter({
    super.key,
    required this.actions,
    required this.filter,
    required this.controller,
    required this.strings,
    required this.onChanged,
    required this.label,
  });

  final List<uc.PoseHubPackAction> actions;
  final sdk.TrainingLibraryFilter filter;
  final TextEditingController controller;
  final sdk.TrainingLibraryStrings strings;
  final ValueChanged<sdk.TrainingLibraryFilter> onChanged;
  final String Function(String) label;

  Future<void> _openSheet(BuildContext context) async {
    FocusScope.of(context).unfocus();
    final result = await showModalBottomSheet<sdk.TrainingLibraryFilter>(
      context: context,
      sheetAnimationStyle: FlareMotion.sheetStyle(context),
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => _PublicLibraryFilterSheet(
        actions: actions,
        initial: filter,
        strings: strings,
        label: label,
      ),
    );
    if (context.mounted && result != null) onChanged(result);
  }

  @override
  Widget build(BuildContext context) {
    final present = actions.expand(sdk.PoseHubActionFacets.bodyParts).toSet();
    final parts = [
      for (final part in sdk.poseHubBodyParts)
        if (present.contains(part) || part == filter.bodyPart) part,
    ];
    final shape = OutlineInputBorder(
      borderRadius: BorderRadius.circular(FlareGeometry.libraryChipRadius),
      borderSide: BorderSide.none,
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SizedBox(
          height: FlareGeometry.librarySearchHeight,
          child: TextField(
            key: const ValueKey('posehub-search'),
            controller: controller,
            style: FlareType.rowMeta.copyWith(color: FlareColors.text),
            cursorColor: FlareColors.accent,
            textInputAction: TextInputAction.search,
            onChanged: (value) => onChanged(filter.copyWith(query: value)),
            onSubmitted: (_) => FocusScope.of(context).unfocus(),
            decoration: InputDecoration(
              hintText: strings.searchHint,
              hintStyle: FlareType.rowMeta.copyWith(color: FlareColors.dim),
              hintMaxLines: 1,
              isDense: true,
              filled: true,
              fillColor: FlareColors.libraryChipFill,
              contentPadding: const EdgeInsetsDirectional.only(
                end: FlareGeometry.rowIconGap,
              ),
              border: shape,
              enabledBorder: shape,
              focusedBorder: shape.copyWith(
                borderSide: BorderSide(
                  color: FlareColors.accent,
                  width: FlareGeometry.hairline,
                ),
              ),
              prefixIcon: Icon(
                Icons.search_rounded,
                size: FlareGeometry.rowSideInset,
                color: FlareColors.muted,
              ),
              prefixIconConstraints: const BoxConstraints.tightFor(
                width: FlareGeometry.librarySearchHeight,
                height: FlareGeometry.librarySearchHeight,
              ),
              suffixIcon: filter.query.isEmpty
                  ? null
                  : IconButton(
                      key: const ValueKey('posehub-search-clear'),
                      tooltip: strings.clear,
                      icon: Icon(
                        Icons.close_rounded,
                        size: FlareGeometry.rowSideInset,
                      ),
                      onPressed: () {
                        controller.clear();
                        onChanged(filter.copyWith(query: ''));
                      },
                    ),
              suffixIconConstraints: const BoxConstraints.tightFor(
                width: FlareGeometry.librarySearchHeight,
                height: FlareGeometry.librarySearchHeight,
              ),
            ),
          ),
        ),
        const SizedBox(height: FlareGeometry.libraryChipGap),
        SizedBox(
          height: FlareGeometry.hitTarget,
          child: Row(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  key: const ValueKey('public-library-quick-filters'),
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      if (filter.muscle != null)
                        FlareFilterChip(
                          key: const ValueKey('public-library-muscle'),
                          label: label(filter.muscle!),
                          icon: Icons.close_rounded,
                          selected: true,
                          flat: true,
                          onTap: () =>
                              onChanged(filter.copyWith(clearMuscle: true)),
                        ),
                      FlareFilterChip(
                        key: const ValueKey('public-library-all'),
                        label: strings.all,
                        selected: filter.activeCount == 0,
                        flat: true,
                        onTap: () => onChanged(filter.cleared()),
                      ),
                      for (final part in parts)
                        FlareFilterChip(
                          key: ValueKey('public-library-body-$part'),
                          label: label(part),
                          selected: filter.bodyPart == part,
                          flat: true,
                          onTap: () => onChanged(
                            filter.copyWith(bodyPart: part, clearMuscle: true),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: FlareGeometry.libraryFilterGap),
              FlareFilterChip(
                key: const ValueKey('public-library-filter'),
                label: strings.filter,
                icon: Icons.tune_rounded,
                count: filter.activeCount,
                selected: filter.activeCount > 0,
                trailingGap: false,
                flat: true,
                onTap: () => _openSheet(context),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _PublicLibraryFilterSheet extends StatefulWidget {
  const _PublicLibraryFilterSheet({
    required this.actions,
    required this.initial,
    required this.strings,
    required this.label,
  });

  final List<uc.PoseHubPackAction> actions;
  final sdk.TrainingLibraryFilter initial;
  final sdk.TrainingLibraryStrings strings;
  final String Function(String) label;

  @override
  State<_PublicLibraryFilterSheet> createState() =>
      _PublicLibraryFilterSheetState();
}

class _PublicLibraryFilterSheetState extends State<_PublicLibraryFilterSheet> {
  late sdk.TrainingLibraryFilter _draft = widget.initial;

  Widget _choice(
    String facet,
    String value,
    String text,
    bool selected,
    VoidCallback onTap,
  ) => FlareFilterChip(
    key: ValueKey('public-library-$facet-$value'),
    label: text,
    selected: selected,
    trailingGap: false,
    flat: true,
    onTap: () => setState(onTap),
  );

  Widget _field(String title, String facet, List<Widget> choices) =>
      FlareListGroup(
        key: ValueKey('public-library-field-$facet'),
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              FlareListRow(title: title),
              Padding(
                padding: const EdgeInsetsDirectional.only(
                  start: FlareGeometry.rowSideInset,
                  end: FlareGeometry.rowSideInset,
                  bottom: FlareGeometry.rowControlBottom,
                ),
                child: Wrap(
                  spacing: FlareGeometry.libraryChipGap,
                  children: choices,
                ),
              ),
            ],
          ),
        ],
      );

  @override
  Widget build(BuildContext context) {
    final s = widget.strings;
    final all = sdk.TrainingLibraryFilter.all;
    final actions = widget.actions;
    final tools = actions.expand(sdk.PoseHubActionFacets.equipment).toSet();
    if (!const [
      sdk.TrainingLibraryFilter.all,
      '徒手',
      '需要器械',
    ].contains(_draft.equipment)) {
      tools.add(_draft.equipment);
    }
    final equipment = tools.toList()..sort();
    final parts = actions.expand(sdk.PoseHubActionFacets.bodyParts).toSet();
    final types = actions.map(sdk.PoseHubActionFacets.type).toSet();
    final levels = actions
        .map(sdk.PoseHubActionFacets.level)
        .whereType<int>()
        .toSet();
    final muscles = actions.expand(sdk.PoseHubActionFacets.muscles).toSet();
    if (_draft.muscle case final String muscle) muscles.add(muscle);
    final unknownMuscles =
        muscles.difference(sdk.poseHubMuscleLabels.keys.toSet()).toList()
          ..sort();
    final knownMuscles = [
      for (final muscle in sdk.poseHubMuscleLabels.keys)
        if (muscles.contains(muscle)) muscle,
      ...unknownMuscles,
    ];
    final fields = [
      _field(s.bodyPart, 'body', [
        _choice(
          'body',
          all,
          s.all,
          _draft.bodyPart == all,
          () => _draft = _draft.copyWith(bodyPart: all),
        ),
        for (final part in sdk.poseHubBodyParts)
          if (parts.contains(part) || _draft.bodyPart == part)
            _choice(
              'body',
              part,
              widget.label(part),
              _draft.bodyPart == part,
              () => _draft = _draft.copyWith(bodyPart: part),
            ),
      ]),
      _field(s.category, 'type', [
        _choice(
          'type',
          all,
          s.all,
          _draft.type == all,
          () => _draft = _draft.copyWith(type: all),
        ),
        for (final type in const ['力量', '拉伸放松', '其他'])
          if (types.contains(type) || _draft.type == type)
            _choice(
              'type',
              type,
              widget.label(type),
              _draft.type == type,
              () => _draft = _draft.copyWith(type: type),
            ),
      ]),
      _field(s.equipment, 'equipment', [
        for (final tool in [all, '徒手', '需要器械', ...equipment])
          _choice(
            'equipment',
            tool,
            tool == all
                ? s.all
                : widget.label(sdk.poseHubEquipmentLabels[tool] ?? tool),
            _draft.equipment == tool,
            () => _draft = _draft.copyWith(equipment: tool),
          ),
      ]),
      _field(s.level, 'level', [
        _choice(
          'level',
          all,
          s.all,
          _draft.level == null,
          () => _draft = _draft.copyWith(clearLevel: true),
        ),
        for (final level in const [1, 2, 3])
          if (levels.contains(level) || _draft.level == level)
            _choice(
              'level',
              '$level',
              s.levelLabel(level),
              _draft.level == level,
              () => _draft = _draft.copyWith(level: level),
            ),
      ]),
      _field(s.side, 'side', [
        for (final (side, text) in [
          (sdk.TrainingLibrarySide.any, s.all),
          (sdk.TrainingLibrarySide.bilateral, s.bilateral),
          (sdk.TrainingLibrarySide.unilateral, s.unilateral),
        ])
          _choice(
            'side',
            side.name,
            text,
            _draft.side == side,
            () => _draft = _draft.copyWith(side: side),
          ),
      ]),
      _field(s.muscleGroup, 'muscle', [
        _choice(
          'muscle',
          all,
          s.all,
          _draft.muscle == null,
          () => _draft = _draft.copyWith(clearMuscle: true),
        ),
        for (final muscle in knownMuscles)
          _choice(
            'muscle',
            muscle,
            widget.label(muscle),
            _draft.muscle == muscle,
            () => _draft = _draft.copyWith(muscle: muscle),
          ),
      ]),
    ];
    final count = actions
        .where((a) => sdk.PoseHubActionFacets.matchesFilter(a, _draft))
        .length;
    return SafeArea(
      top: false,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight:
              MediaQuery.sizeOf(context).height -
              MediaQuery.paddingOf(context).top -
              FlareGeometry.hitTarget,
        ),
        child: Column(
          key: const ValueKey('public-library-filter-sheet'),
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: FlareGeometry.pageInset,
              ),
              child: FlareListRow(
                title: s.filter,
                trailing: TextButton(
                  key: const ValueKey('public-library-filter-reset'),
                  onPressed: _draft.activeCount == 0
                      ? null
                      : () => setState(() => _draft = _draft.cleared()),
                  child: Text(s.reset),
                ),
              ),
            ),
            Flexible(
              child: SingleChildScrollView(
                key: const ValueKey('public-library-filter-fields'),
                padding: const EdgeInsets.symmetric(
                  horizontal: FlareGeometry.pageInset,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    for (var i = 0; i < fields.length; i++) ...[
                      if (i > 0) const SizedBox(height: FlareGeometry.groupGap),
                      fields[i],
                    ],
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(
                FlareGeometry.pageInset,
                FlareGeometry.libraryFieldGap,
                FlareGeometry.pageInset,
                FlareGeometry.libraryBottom,
              ),
              child: PrimaryAction(
                key: const ValueKey('public-library-filter-apply'),
                label: s.viewResultsFor(count),
                onPressed: () => Navigator.of(context).pop(_draft),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
