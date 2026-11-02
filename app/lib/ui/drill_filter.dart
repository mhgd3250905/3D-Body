import 'package:flutter/material.dart';

import '../data/catalog.dart';
import 'components.dart';
import 'motion.dart';
import 'theme.dart';

/// The one drill filter shared by 训练库 and the 选择动作 sheet: a 40-high
/// search, then one chip row — a pinned 筛选 chip (opens the sheet), the three
/// scenes (single choice), a divider, then 全部部位 and each body area. Both
/// screens use the same groups, order and rules, so a drill found in one is
/// found the same way in the other.
class FlareDrillFilter extends StatelessWidget {
  const FlareDrillFilter({
    super.key,
    required this.catalog,
    required this.controller,
    required this.query,
    required this.tier,
    required this.section,
    required this.onTier,
    required this.onSection,
    required this.onQueryChanged,
    this.searchKey,
    this.clearKey,
    this.padding = const EdgeInsets.symmetric(horizontal: 20),
  });
  final Catalog catalog;
  final TextEditingController controller;
  final String query;
  final String tier;
  final String? section;
  final ValueChanged<String> onTier;
  final ValueChanged<String?> onSection;
  final ValueChanged<String> onQueryChanged;
  final Key? searchKey;
  final Key? clearKey;
  final EdgeInsets padding;

  static const tiers = ['A', 'B', 'C'];

  static String tierLabel(BuildContext context, String tier) {
    final s = context.strings;
    return switch (tier) {
      'B' => s.sceneHome,
      'C' => s.sceneGym,
      _ => s.sceneNone,
    };
  }

  /// Non-default groups in use (the scene always has one value, so only a
  /// chosen body area counts).
  int get activeCount => section == null ? 0 : 1;

  Future<void> _openSheet(BuildContext context) async {
    final result = await showModalBottomSheet<(String, String?)>(
      context: context,
      isScrollControlled: true,
      sheetAnimationStyle: FlareMotion.sheetStyle(context),
      builder: (_) => _DrillFilterSheet(
        catalog: catalog,
        query: query,
        tier: tier,
        section: section,
      ),
    );
    if (result == null) return;
    if (result.$1 != tier) onTier(result.$1);
    if (result.$2 != section) onSection(result.$2);
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: padding,
          child: SizedBox(
            height: 40,
            child: TextField(
              key: searchKey,
              controller: controller,
              textInputAction: TextInputAction.search,
              textAlignVertical: TextAlignVertical.center,
              decoration: InputDecoration(
                hintText: s.searchDrills,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                prefixIcon: const Icon(Icons.search_rounded, size: 20),
                prefixIconConstraints: const BoxConstraints(minWidth: 40),
                suffixIcon: query.isEmpty
                    ? null
                    : IconButton(
                        key: clearKey,
                        tooltip: s.clearSearch,
                        icon: const Icon(Icons.close_rounded, size: 18),
                        onPressed: () {
                          controller.clear();
                          onQueryChanged('');
                        },
                      ),
              ),
              onChanged: onQueryChanged,
              onSubmitted: (_) => FocusScope.of(context).unfocus(),
            ),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 36,
          child: Row(
            children: [
              SizedBox(width: padding.left),
              FlareFilterChip(
                key: const ValueKey('drill-filter-open'),
                label: s.filterAction,
                icon: Icons.tune_rounded,
                count: activeCount,
                selected: activeCount > 0,
                onTap: () => _openSheet(context),
              ),
              Expanded(
                child: ShaderMask(
                  shaderCallback: (rect) => const LinearGradient(
                    colors: [Colors.transparent, Colors.black],
                    stops: [0, .04],
                  ).createShader(rect),
                  blendMode: BlendMode.dstIn,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: EdgeInsets.only(left: 8, right: padding.right),
                    child: Row(
                      children: [
                        for (final t in tiers)
                          FlareFilterChip(
                            key: ValueKey('drill-filter-tier-$t'),
                            label: tierLabel(context, t),
                            selected: tier == t,
                            onTap: () {
                              if (t != tier) onTier(t);
                            },
                          ),
                        const _ChipDivider(),
                        FlareFilterChip(
                          key: const ValueKey('drill-filter-section-all'),
                          label: s.allSections,
                          selected: section == null,
                          onTap: () {
                            if (section != null) onSection(null);
                          },
                        ),
                        for (final item in catalog.sections)
                          FlareFilterChip(
                            key: ValueKey('drill-filter-section-${item.id}'),
                            label: item.short,
                            selected: section == item.id,
                            onTap: () {
                              if (section != item.id) onSection(item.id);
                            },
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ChipDivider extends StatelessWidget {
  const _ChipDivider();
  @override
  Widget build(BuildContext context) => Container(
    width: 1,
    height: 18,
    margin: const EdgeInsets.fromLTRB(2, 0, 10, 0),
    color: FlareColors.hairline,
  );
}

/// Pill chip: selected is a light-orange fill with orange ink, no outline.
class FlareFilterChip extends StatelessWidget {
  const FlareFilterChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.icon,
    this.count = 0,
    this.trailingGap = true,
  });
  final String label;
  final bool selected;
  final VoidCallback onTap;
  final IconData? icon;
  final int count;
  final bool trailingGap;

  @override
  Widget build(BuildContext context) {
    final ink = selected ? FlareColors.accentInk : FlareColors.secondary;
    return Padding(
      padding: EdgeInsets.only(right: trailingGap ? 8 : 0),
      child: Semantics(
        selected: selected,
        button: true,
        child: Pressable(
          scale: .95,
          child: AnimatedContainer(
            duration: FlareMotion.of(context, FlareMotion.fade),
            curve: FlareMotion.standard,
            decoration: ShapeDecoration(
              color: selected
                  ? FlareColors.accent.withValues(alpha: .16)
                  : FlareColors.pill,
              shape: const StadiumBorder(),
            ),
            child: Material(
              type: MaterialType.transparency,
              child: InkWell(
                customBorder: const StadiumBorder(),
                onTap: () {
                  FlareHaptics.selection();
                  onTap();
                },
                child: ConstrainedBox(
                  constraints: const BoxConstraints(minHeight: 36),
                  child: Padding(
                    padding: EdgeInsets.symmetric(
                      horizontal: icon == null ? 14 : 12,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (icon != null) ...[
                          Icon(icon, size: 16, color: ink),
                          const SizedBox(width: 4),
                        ],
                        Text(
                          label,
                          maxLines: 1,
                          softWrap: false,
                          style: TextStyle(
                            fontSize: 13,
                            height: 1.2,
                            fontWeight: selected
                                ? FontWeight.w600
                                : FontWeight.w400,
                            color: ink,
                          ),
                        ),
                        if (count > 0) ...[
                          const SizedBox(width: 6),
                          Container(
                            constraints: const BoxConstraints(minWidth: 18),
                            height: 18,
                            padding: const EdgeInsets.symmetric(horizontal: 5),
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: FlareColors.accent,
                              borderRadius: BorderRadius.circular(9),
                            ),
                            child: Text(
                              '$count',
                              textScaler: TextScaler.noScaling,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: FlareColors.onAccent,
                              ),
                            ),
                          ),
                        ],
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
}

/// 筛选 sheet: 重置 top-right, the same two groups as the chip row, and a
/// live 显示 N 个动作 button. Returns (tier, section) or null if dismissed.
class _DrillFilterSheet extends StatefulWidget {
  const _DrillFilterSheet({
    required this.catalog,
    required this.query,
    required this.tier,
    required this.section,
  });
  final Catalog catalog;
  final String query;
  final String tier;
  final String? section;
  @override
  State<_DrillFilterSheet> createState() => _DrillFilterSheetState();
}

class _DrillFilterSheetState extends State<_DrillFilterSheet> {
  late String _tier = widget.tier;
  late String? _section = widget.section;

  Widget _group(String title, List<Widget> chips) => Padding(
    padding: const EdgeInsets.fromLTRB(20, 4, 20, 16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: FlareColors.dim,
          ),
        ),
        const SizedBox(height: 10),
        Wrap(spacing: 8, runSpacing: 8, children: chips),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final count = widget.catalog
        .searchDrills(widget.query, tier: _tier, section: _section)
        .length;
    return SafeArea(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.sizeOf(context).height * .8,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 8, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      s.filterAction,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  TextButton(
                    key: const ValueKey('drill-filter-reset'),
                    onPressed: _tier == 'A' && _section == null
                        ? null
                        : () => setState(() {
                            _tier = 'A';
                            _section = null;
                          }),
                    child: Text(s.filterReset),
                  ),
                ],
              ),
            ),
            Flexible(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _group(s.filterScene, [
                      for (final t in FlareDrillFilter.tiers)
                        FlareFilterChip(
                          key: ValueKey('drill-sheet-tier-$t'),
                          label: FlareDrillFilter.tierLabel(context, t),
                          selected: _tier == t,
                          trailingGap: false,
                          onTap: () => setState(() => _tier = t),
                        ),
                    ]),
                    _group(s.filterSection, [
                      FlareFilterChip(
                        label: s.allSections,
                        selected: _section == null,
                        trailingGap: false,
                        onTap: () => setState(() => _section = null),
                      ),
                      for (final item in widget.catalog.sections)
                        FlareFilterChip(
                          key: ValueKey('drill-sheet-section-${item.id}'),
                          label: item.short,
                          selected: _section == item.id,
                          trailingGap: false,
                          onTap: () => setState(() => _section = item.id),
                        ),
                    ]),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
              child: PrimaryAction(
                key: const ValueKey('drill-filter-apply'),
                label: s.filterShowCount(count),
                onPressed: count == 0
                    ? null
                    : () => Navigator.pop(context, (_tier, _section)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
