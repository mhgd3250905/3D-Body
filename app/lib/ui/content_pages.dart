import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'motion.dart';
import 'theme.dart';

class PageHeader extends StatelessWidget {
  const PageHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.onBack,
    this.action,
    this.large = true,
  });
  final String title;
  final String? subtitle;
  final VoidCallback? onBack;
  final Widget? action;
  final bool large;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(16, 8, 16, 14),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 44,
          child: Row(
            children: [
              if (onBack != null)
                RoundIconButton(
                  icon: Icons.arrow_back_ios_new_rounded,
                  tooltip: context.strings.goBack,
                  onPressed: onBack,
                ),
              const Spacer(),
              ?action,
            ],
          ),
        ),
        if (title.isNotEmpty) ...[
          const SizedBox(height: 14),
          Semantics(
            header: true,
            child: Padding(
              padding: const EdgeInsets.only(left: 4),
              child: Text(
                title,
                style: TextStyle(
                  fontSize: large ? 30 : 24,
                  height: 1.2,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
        if (subtitle != null)
          Padding(
            padding: const EdgeInsets.only(left: 4, top: 6),
            child: Eyebrow(subtitle!),
          ),
      ],
    ),
  );
}

/// The three-rule safety card. Shown once before entering, and from Settings.
Future<bool?> showSafetySheet(
  BuildContext context, {
  VoidCallback? onAssessment,
}) {
  final s = context.strings;
  return showModalBottomSheet<bool>(
    context: context,
    sheetAnimationStyle: FlareMotion.sheetStyle(context),
    isScrollControlled: true,
    builder: (sheet) => SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Eyebrow(s.safetySheetEyebrow),
            const SizedBox(height: 4),
            Text(
              s.safetySheetTitle,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 18),
            for (final (index, rule) in [
              (s.safetyRule1, s.safetyRule1Note),
              (s.safetyRule2, s.safetyRule2Note),
              (s.safetyRule3, s.safetyRule3Note),
            ].indexed)
              Padding(
                padding: const EdgeInsets.only(bottom: 18),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: FlareColors.accent.withValues(alpha: .12),
                        borderRadius: BorderRadius.circular(9),
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
                    const SizedBox(width: 14),
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
                          const SizedBox(height: 3),
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
            const SizedBox(height: 6),
            PrimaryAction(
              label: s.gotIt,
              onPressed: () => Navigator.pop(sheet, true),
            ),
            if (onAssessment != null)
              TextButton(
                onPressed: () {
                  Navigator.pop(sheet, false);
                  onAssessment();
                },
                child: Text(
                  s.startWithAssessment,
                  style: TextStyle(color: FlareColors.secondary),
                ),
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
    var assessment = false;
    final accepted = await showSafetySheet(
      context,
      onAssessment: () => assessment = true,
    );
    if (!mounted) return;
    if (accepted == true || assessment) await _enter(assessment);
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
                padding: const EdgeInsets.fromLTRB(28, 12, 28, 16),
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
                    const SizedBox(height: 12),
                    Text(
                      s.brandEyebrow,
                      style: TextStyle(
                        color: FlareColors.accentInk,
                        fontSize: 12,
                        letterSpacing: 3,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      s.welcomeHeadline,
                      style: const TextStyle(
                        fontSize: 36,
                        height: 1.15,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      s.welcomeLine,
                      style: TextStyle(
                        fontSize: 16,
                        height: 1.5,
                        color: FlareColors.secondary,
                      ),
                    ),
                    const SizedBox(height: 28),
                    PrimaryAction(
                      label: s.startApp,
                      onPressed: _busy ? null : _start,
                    ),
                    const SizedBox(height: 6),
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

class _FilterPill extends StatelessWidget {
  const _FilterPill({
    required this.label,
    required this.selected,
    required this.onTap,
    this.trailing,
  });
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(right: 8),
    child: Semantics(
      selected: selected,
      button: true,
      child: Pressable(
        scale: .95,
        child: AnimatedContainer(
          duration: FlareMotion.of(context, FlareMotion.fade),
          curve: FlareMotion.standard,
          decoration: ShapeDecoration(
            color: selected ? FlareColors.solid : FlareColors.pill,
            shape: StadiumBorder(
              side: BorderSide(
                color: selected ? Colors.transparent : FlareColors.hairline,
              ),
            ),
          ),
          child: Material(
            type: MaterialType.transparency,
            child: InkWell(
              customBorder: const StadiumBorder(),
              onTap: onTap,
              child: ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 36),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        label,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: selected
                              ? FontWeight.w600
                              : FontWeight.w400,
                          color: selected
                              ? FlareColors.onSolid
                              : FlareColors.secondary,
                        ),
                      ),
                      ?trailing,
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

class LibraryPage extends StatefulWidget {
  const LibraryPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onDrill,
    required this.onRemove,
    this.onBack,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Drill> onDrill;
  final ValueChanged<String> onRemove;
  final VoidCallback? onBack;
  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  String _query = '';
  String? _section;
  bool _searching = false;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final catalog = widget.catalog;
    final tier = widget.store.settings.tier;
    final drills = catalog.searchDrills(_query, tier: tier, section: _section);
    final sectionLabel = _section == null
        ? s.allSections
        : catalog.sections.firstWhere((item) => item.id == _section).short;
    return Column(
      children: [
        PageHeader(
          title: s.library,
          onBack: widget.onBack,
          action: RoundIconButton(
            icon: _searching ? Icons.close_rounded : Icons.search_rounded,
            tooltip: _searching ? s.closeSearch : s.search,
            onPressed: () => setState(() {
              _searching = !_searching;
              if (!_searching) _query = '';
            }),
          ),
        ),
        Expanded(
          child: ScrollEdge(
            child: CustomScrollView(
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              slivers: [
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  sliver: SliverList.list(
                    children: [
                      // The search field folds open under the header.
                      AnimatedSize(
                        duration: FlareMotion.of(context, FlareMotion.expand),
                        curve: FlareMotion.settle,
                        alignment: Alignment.topCenter,
                        child: _searching
                            ? FadeSlideIn(
                                offset: 6,
                                duration: FlareMotion.fade,
                                child: Padding(
                                  padding: const EdgeInsets.only(bottom: 12),
                                  child: TextField(
                                    autofocus: true,
                                    textInputAction: TextInputAction.search,
                                    decoration: InputDecoration(
                                      hintText: s.searchDrills,
                                      prefixIcon: const Icon(
                                        Icons.search_rounded,
                                      ),
                                    ),
                                    onChanged: (value) =>
                                        setState(() => _query = value),
                                  ),
                                ),
                              )
                            : const SizedBox(width: double.infinity),
                      ),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            for (final item in [
                              ('A', s.tierA),
                              ('B', s.tierB),
                              ('C', s.tierC),
                            ])
                              _FilterPill(
                                label: item.$2,
                                selected: tier == item.$1,
                                onTap: () {
                                  if (tier == item.$1) return;
                                  FlareHaptics.selection();
                                  widget.store.updateSettings(tier: item.$1);
                                },
                              ),
                            Pressable(
                              scale: .95,
                              child: PopupMenuButton<String?>(
                                tooltip: s.allSections,
                                color: FlareColors.popup,
                                initialValue: _section,
                                onSelected: (value) => setState(
                                  () => _section = value == '' ? null : value,
                                ),
                                itemBuilder: (_) => [
                                  PopupMenuItem(
                                    value: '',
                                    child: Text(s.allSections),
                                  ),
                                  for (final section in catalog.sections)
                                    PopupMenuItem(
                                      value: section.id,
                                      child: Text(section.short),
                                    ),
                                ],
                                child: IgnorePointer(
                                  child: _FilterPill(
                                    label: sectionLabel,
                                    selected: false,
                                    onTap: () {},
                                    trailing: Padding(
                                      padding: EdgeInsets.only(left: 2),
                                      child: Icon(
                                        Icons.expand_more_rounded,
                                        size: 16,
                                        color: FlareColors.dim,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (widget.store.todayIds.isNotEmpty) ...[
                        SectionTitle(s.today),
                        for (final id in widget.store.todayIds)
                          if (catalog.drillById(id) case final Drill drill)
                            DrillTile(
                              drill: drill,
                              onTap: () => widget.onDrill(drill),
                              trailing: IconButton(
                                tooltip: s.remove,
                                icon: Icon(
                                  Icons.remove_circle_outline_rounded,
                                  size: 20,
                                  color: FlareColors.dim,
                                ),
                                onPressed: () {
                                  FlareHaptics.light();
                                  widget.onRemove(id);
                                  final messenger = ScaffoldMessenger.of(
                                    context,
                                  );
                                  messenger
                                    ..hideCurrentSnackBar()
                                    ..showSnackBar(
                                      SnackBar(
                                        content: Text(s.removedFromToday),
                                        duration: const Duration(seconds: 4),
                                        action: SnackBarAction(
                                          label: s.undo,
                                          onPressed: () =>
                                              widget.store.addToToday(id),
                                        ),
                                      ),
                                    );
                                },
                              ),
                            ),
                      ],
                      const SizedBox(height: 16),
                      if (drills.isEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 40),
                          child: Center(
                            child: Column(
                              children: [
                                Icon(
                                  Icons.search_off_rounded,
                                  size: 28,
                                  color: FlareColors.dim,
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  s.noResults,
                                  style: TextStyle(color: FlareColors.dim),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                  sliver: SliverGrid.builder(
                    itemCount: drills.length,
                    gridDelegate:
                        const SliverGridDelegateWithMaxCrossAxisExtent(
                          maxCrossAxisExtent: 220,
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          childAspectRatio: .78,
                        ),
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
                          groupLabel: group.label,
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
    required this.onAdd,
    required this.added,
    this.group,
  });
  final Drill drill;
  final MuscleGroup? group;
  final VoidCallback onBack;
  final VoidCallback onStart;
  final VoidCallback onAdd;
  final bool added;

  @override
  State<DrillDetailPage> createState() => _DrillDetailPageState();
}

class _DrillDetailPageState extends State<DrillDetailPage> {
  /// Scroll offset, driving the compact bar that forms once the picture and
  /// the large title have scrolled away (no rebuild of the page itself).
  final _offset = ValueNotifier<double>(0);

  Drill get drill => widget.drill;
  MuscleGroup? get group => widget.group;

  @override
  void dispose() {
    _offset.dispose();
    super.dispose();
  }

  Widget _spec(String label, String value) => Expanded(
    child: Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 12, 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Eyebrow(label),
          const SizedBox(height: 5),
          Text(
            value,
            style: const TextStyle(
              fontSize: 15,
              height: 1.4,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
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
            border: Border.all(color: FlareColors.controlBorder),
          ),
          child: Text(
            '${index + 1}',
            style: TextStyle(fontSize: 11, color: FlareColors.secondary),
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
    // The picture runs under the status bar; the controls sit below it.
    final top = MediaQuery.paddingOf(context).top;
    final width = MediaQuery.sizeOf(context).width;
    const heroAspect = 1.0;
    final heroHeight = width / heroAspect;
    final barHeight = top + 60;
    final shown = drill.cues.take(2).toList();
    final rest = drill.cues.skip(2).toList();
    return ColoredBox(
      color: FlareColors.background,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: Stack(
              children: [
                Positioned.fill(
                  child: NotificationListener<ScrollNotification>(
                    onNotification: (n) {
                      if (n.depth == 0 && n.metrics.axis == Axis.vertical) {
                        _offset.value = n.metrics.pixels;
                      }
                      return false;
                    },
                    child: ListView(
                      padding: EdgeInsets.zero,
                      children: [
                        Stack(
                          children: [
                            AspectRatio(
                              aspectRatio: heroAspect,
                              child: Image.asset(
                                drillArt(drill.imageAsset),
                                fit: BoxFit.cover,
                                frameBuilder: (context, child, frame, sync) =>
                                    fadeInFrame(context, child, frame, sync),
                              ),
                            ),
                            Positioned.fill(
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      FlareColors.background.withValues(
                                        alpha: 0,
                                      ),
                                      FlareColors.background.withValues(
                                        alpha: 0,
                                      ),
                                      FlareColors.background,
                                    ],
                                    stops: [0, .72, 1],
                                  ),
                                ),
                              ),
                            ),
                          ],
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
                                        drill.tierLabel,
                                      ].join(' · '),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                drill.name,
                                style: const TextStyle(
                                  fontSize: 28,
                                  height: 1.2,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                drill.nameEn,
                                style: TextStyle(
                                  color: FlareColors.dim,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 18),
                              Container(
                                decoration: BoxDecoration(
                                  color: FlareColors.surface,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: FlareColors.hairline,
                                  ),
                                ),
                                child: IntrinsicHeight(
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.stretch,
                                    children: [
                                      _spec(s.spec, drill.prescription),
                                      const VerticalDivider(width: 1),
                                      _spec(s.equipment, drill.equipment),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 22),
                              for (var i = 0; i < shown.length; i++)
                                _cue(i, shown[i]),
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
                ),
                // Once the picture and title have gone, a compact bar forms
                // behind the pinned controls: frosted backdrop, hairline and
                // the drill's name, the way an iOS large title collapses.
                Positioned(
                  left: 0,
                  right: 0,
                  top: 0,
                  height: barHeight,
                  child: IgnorePointer(
                    child: ValueListenableBuilder<double>(
                      valueListenable: _offset,
                      builder: (context, offset, _) {
                        final bar =
                            ((offset - (heroHeight - barHeight - 24)) / 32)
                                .clamp(0.0, 1.0);
                        final title =
                            ((offset - (heroHeight + 40 - barHeight)) / 24)
                                .clamp(0.0, 1.0);
                        if (bar == 0) return const SizedBox.expand();
                        return ClipRect(
                          child: BackdropFilter(
                            filter: ImageFilter.blur(
                              sigmaX: 18 * bar,
                              sigmaY: 18 * bar,
                            ),
                            child: DecoratedBox(
                              decoration: BoxDecoration(
                                color: FlareColors.background.withValues(
                                  alpha: .86 * bar,
                                ),
                                border: Border(
                                  bottom: BorderSide(
                                    color: FlareColors.controlBorder.withValues(
                                      alpha: bar,
                                    ),
                                    width: .6,
                                  ),
                                ),
                              ),
                              child: Padding(
                                padding: EdgeInsets.fromLTRB(72, top, 72, 0),
                                child: Center(
                                  child: Opacity(
                                    opacity: title,
                                    child: Transform.translate(
                                      offset: Offset(0, 6 * (1 - title)),
                                      child: Text(
                                        drill.name,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
                // Back and save stay pinned while the picture scrolls away.
                Positioned(
                  left: 16,
                  right: 16,
                  top: top + 8,
                  child: Row(
                    children: [
                      RoundIconButton(
                        icon: Icons.arrow_back_ios_new_rounded,
                        tooltip: s.goBack,
                        onPressed: widget.onBack,
                      ),
                      const Spacer(),
                      AnimatedSwitcher(
                        duration: FlareMotion.of(context, FlareMotion.fade),
                        transitionBuilder: (child, animation) =>
                            ScaleTransition(
                              scale: Tween(begin: .7, end: 1.0).animate(
                                CurvedAnimation(
                                  parent: animation,
                                  curve: FlareMotion.spring,
                                ),
                              ),
                              child: FadeTransition(
                                opacity: animation,
                                child: child,
                              ),
                            ),
                        child: RoundIconButton(
                          key: ValueKey(widget.added),
                          icon: widget.added
                              ? Icons.bookmark_added_rounded
                              : Icons.bookmark_add_outlined,
                          tooltip: widget.added ? s.addedToday : s.addToday,
                          onPressed: widget.added
                              ? null
                              : () {
                                  FlareHaptics.light();
                                  widget.onAdd();
                                },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
            child: PrimaryAction(
              label: s.startTimer,
              onPressed: widget.onStart,
            ),
          ),
        ],
      ),
    );
  }
}

class PathPage extends StatefulWidget {
  const PathPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onLesson,
    required this.onGate,
    required this.onAssessment,
    this.onBack,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Lesson> onLesson;
  final void Function(String, bool) onGate;
  final VoidCallback onAssessment;
  final VoidCallback? onBack;
  @override
  State<PathPage> createState() => _PathPageState();
}

class _PathPageState extends State<PathPage> {
  int? _open;
  final _currentGatesKey = GlobalKey();

  void _showCurrentGates() {
    setState(() => _open = widget.store.currentStage);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final gatesContext = _currentGatesKey.currentContext;
      if (gatesContext != null) {
        Scrollable.ensureVisible(
          gatesContext,
          duration: FlareMotion.of(context, FlareMotion.push),
          curve: FlareMotion.settle,
          alignment: .1,
        );
      }
    });
  }

  Lesson? _nextLesson() {
    final store = widget.store;
    final stage = widget.catalog.stageByNumber(store.currentStage);
    if (stage == null) return null;
    for (final lesson in stage.lessons) {
      if (!store.completedLessonIds.contains(lesson.id)) return lesson;
    }
    return null;
  }

  Widget _marker(CourseStage stage, bool current) {
    final store = widget.store;
    final passed = store.isStagePassed(stage.n);
    return Container(
      width: 28,
      height: 28,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: passed
            ? FlareColors.success.withValues(alpha: .16)
            : FlareColors.background,
        border: Border.all(
          color: current
              ? FlareColors.accent
              : passed
              ? Colors.transparent
              : FlareColors.controlBorder,
          width: current ? 1.6 : 1,
        ),
      ),
      child: passed
          ? Icon(Icons.check_rounded, size: 16, color: FlareColors.success)
          : Text(
              '${stage.n}',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: current ? FlareColors.accentInk : FlareColors.dim,
              ),
            ),
    );
  }

  Widget _lessons(CourseStage stage, Lesson? next) {
    final s = context.strings;
    final store = widget.store;
    final unlocked = store.isStageUnlocked(stage.n);
    return Padding(
      padding: const EdgeInsets.only(top: 12, bottom: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          RowGroup(
            children: [
              for (final lesson in stage.lessons)
                FlareRow(
                  title: lesson.title,
                  subtitle: s.minutesShort(lesson.minutes),
                  leading: Icon(
                    store.completedLessonIds.contains(lesson.id)
                        ? Icons.check_circle_rounded
                        : lesson == next
                        ? Icons.circle
                        : Icons.circle_outlined,
                    size: 18,
                    color: store.completedLessonIds.contains(lesson.id)
                        ? FlareColors.success
                        : lesson == next
                        ? FlareColors.accent
                        : FlareColors.dim,
                  ),
                  onTap: () => widget.onLesson(lesson),
                ),
            ],
          ),
          if (stage.gates.isNotEmpty)
            Column(
              key: stage.n == store.currentStage ? _currentGatesKey : null,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SectionTitle(s.stageGates),
                for (final gate in stage.gates)
                  CheckboxListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    value: store.gateReports[gate.id] ?? false,
                    onChanged: unlocked
                        ? (value) {
                            FlareHaptics.selection();
                            widget.onGate(gate.id, value ?? false);
                          }
                        : null,
                    title: Text(
                      gate.text,
                      style: const TextStyle(fontSize: 13, height: 1.45),
                    ),
                    controlAffinity: ListTileControlAffinity.leading,
                  ),
              ],
            ),
          if (!unlocked)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Eyebrow(s.locked),
            ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final store = widget.store;
    final stages = widget.catalog.stages;
    final open = _open ?? store.currentStage;
    final next = _nextLesson();
    final allDone = stages
        .where((stage) => stage.n >= store.startStage)
        .every((stage) => store.isStagePassed(stage.n));
    return Column(
      children: [
        PageHeader(
          title: s.pathTitle,
          onBack: widget.onBack,
          action: RoundIconButton(
            icon: Icons.fact_check_outlined,
            tooltip: s.assessment,
            onPressed: widget.onAssessment,
          ),
        ),
        Expanded(
          child: ScrollEdge(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
              children: [
                for (final (index, stage) in stages.indexed)
                  // No IntrinsicHeight: the rail is painted behind, so a
                  // stage can fold open or shut smoothly.
                  Stack(
                    children: [
                      if (index != stages.length - 1)
                        Positioned(
                          left: 13.5,
                          top: 42,
                          bottom: 0,
                          child: Container(
                            width: 1,
                            color: FlareColors.controlBorder,
                          ),
                        ),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(top: 14),
                            child: _marker(
                              stage,
                              stage.n == store.currentStage,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                InkWell(
                                  borderRadius: BorderRadius.circular(12),
                                  onTap: () => setState(
                                    () => _open = open == stage.n ? 0 : stage.n,
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 14,
                                    ),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                stage.title,
                                                style: TextStyle(
                                                  fontSize: 17,
                                                  fontWeight: FontWeight.w600,
                                                  color:
                                                      store.isStageUnlocked(
                                                        stage.n,
                                                      )
                                                      ? FlareColors.text
                                                      : FlareColors.secondary,
                                                ),
                                              ),
                                              if (open == stage.n) ...[
                                                const SizedBox(height: 4),
                                                Eyebrow(
                                                  store.isStagePassed(stage.n)
                                                      ? s.passed
                                                      : store.isStageUnlocked(
                                                          stage.n,
                                                        )
                                                      ? s.current
                                                      : s.locked,
                                                ),
                                              ],
                                            ],
                                          ),
                                        ),
                                        AnimatedRotation(
                                          turns: open == stage.n ? .5 : 0,
                                          duration: FlareMotion.of(
                                            context,
                                            FlareMotion.expand,
                                          ),
                                          curve: FlareMotion.settle,
                                          child: Icon(
                                            Icons.expand_more_rounded,
                                            size: 20,
                                            color: FlareColors.dim,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                // The stage opens and closes as one smooth fold.
                                AnimatedSize(
                                  duration: FlareMotion.of(
                                    context,
                                    FlareMotion.expand,
                                  ),
                                  curve: FlareMotion.settle,
                                  alignment: Alignment.topCenter,
                                  child: open == stage.n
                                      ? FadeSlideIn(
                                          key: ValueKey('stage-${stage.n}'),
                                          offset: 8,
                                          child: _lessons(stage, next),
                                        )
                                      : const SizedBox(width: double.infinity),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
          child: PrimaryAction(
            label: next != null
                ? s.continueLesson(next.title)
                : allDone
                ? s.allDone
                : s.confirmStageGates,
            onPressed: next != null
                ? () => widget.onLesson(next)
                : allDone
                ? null
                : _showCurrentGates,
          ),
        ),
      ],
    );
  }
}

class LessonPage extends StatelessWidget {
  const LessonPage({
    super.key,
    required this.catalog,
    required this.lesson,
    required this.store,
    required this.onBack,
    required this.onWatch,
    required this.onComplete,
    required this.onDrill,
  });
  final Catalog catalog;
  final Lesson lesson;
  final LearningStore store;
  final VoidCallback onBack;
  final VoidCallback onWatch;
  final VoidCallback onComplete;
  final ValueChanged<Drill> onDrill;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final complete = store.completedLessonIds.contains(lesson.id);
    final unlocked = store.isStageUnlocked(lesson.stage);
    return Column(
      children: [
        PageHeader(
          title: lesson.title,
          subtitle:
              '${s.stageLabel(lesson.stage)} · ${s.minutesShort(lesson.minutes)}',
          onBack: onBack,
        ),
        Expanded(
          child: ScrollEdge(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
              children: [
                if (lesson.phases.isNotEmpty) ...[
                  SectionTitle(s.lessonPhases),
                  RowGroup(
                    children: [
                      for (final source in lesson.phases)
                        if (catalog.phaseBySource(source)
                            case final Phase phase)
                          FlareRow(
                            title: phase.name,
                            subtitle: phase.caption,
                            leading: Text(
                              source.toString().padLeft(2, '0'),
                              style: TextStyle(
                                color: FlareColors.accentInk,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: onWatch,
                    icon: const Icon(Icons.view_in_ar_outlined, size: 18),
                    label: Text(s.watchPhases),
                  ),
                ],
                SectionTitle(s.suggestedDrills),
                for (final id in lesson.drills)
                  if (catalog.drillById(id) case final Drill drill)
                    DrillTile(drill: drill, onTap: () => onDrill(drill)),
                if (!unlocked)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Eyebrow(s.locked),
                  ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 14),
          child: PrimaryAction(
            icon: complete ? Icons.check_rounded : null,
            label: complete ? s.lessonCompleted : s.markLesson,
            onPressed: unlocked && !complete
                ? () {
                    FlareHaptics.success();
                    onComplete();
                  }
                : null,
          ),
        ),
      ],
    );
  }
}

class AssessmentPage extends StatefulWidget {
  const AssessmentPage({
    super.key,
    required this.initialGrades,
    required this.onSave,
    required this.onSkip,
    required this.onBack,
  });
  final Map<String, int> initialGrades;
  final Future<void> Function(Map<String, int>) onSave;
  final Future<void> Function() onSkip;
  final VoidCallback onBack;
  @override
  State<AssessmentPage> createState() => _AssessmentPageState();
}

class _AssessmentPageState extends State<AssessmentPage> {
  late final Map<String, int> _grades = {
    for (final id in ['wrist', 'pike', 'straddle', 'dips', 'lsit'])
      id: widget.initialGrades[id] ?? 1,
  };
  bool _busy = false;
  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Column(
      children: [
        PageHeader(
          title: s.assessment,
          subtitle: s.assessmentNote,
          onBack: widget.onBack,
        ),
        Expanded(
          child: ScrollEdge(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
              children: [
                for (final item in [
                  ('wrist', s.wristTest),
                  ('pike', s.compressionTest),
                  ('straddle', s.hipTest),
                  ('dips', s.dipsTest),
                  ('lsit', s.supportTest),
                ]) ...[
                  // One card per test: a four-step selector with short
                  // labels, and the full wording of the chosen step below.
                  Padding(
                    padding: const EdgeInsets.only(top: 12),
                    child: _GradeCard(
                      title: item.$2,
                      grades: item.$1 == 'dips'
                          ? [
                              (s.dipsShort1, s.dipsGrade1),
                              (s.dipsShort2, s.dipsGrade2),
                              (s.dipsShort3, s.dipsGrade3),
                              (s.dipsShort4, s.dipsGrade4),
                            ]
                          : [
                              (s.gradeShort1, s.grade1),
                              (s.gradeShort2, s.grade2),
                              (s.gradeShort3, s.grade3),
                              (s.gradeShort4, s.grade4),
                            ],
                      value: _grades[item.$1]!,
                      onChanged: (value) =>
                          setState(() => _grades[item.$1] = value),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
          child: PrimaryAction(
            label: s.saveAssessment,
            onPressed: _busy
                ? null
                : () async {
                    setState(() => _busy = true);
                    await widget.onSave(Map.of(_grades));
                    if (mounted) setState(() => _busy = false);
                  },
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: TextButton(
            onPressed: _busy ? null : widget.onSkip,
            child: Text(
              s.skipAssessment,
              style: TextStyle(color: FlareColors.secondary),
            ),
          ),
        ),
      ],
    );
  }
}

class _GradeCard extends StatelessWidget {
  const _GradeCard({
    required this.title,
    required this.grades,
    required this.value,
    required this.onChanged,
  });
  final String title;

  /// (short label, full description) for grades 1–4.
  final List<(String, String)> grades;
  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final full = grades[(value - 1).clamp(0, grades.length - 1)].$2;
    return SurfaceCard(
      padding: 14,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 2, bottom: 12),
            child: Semantics(
              header: true,
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  height: 1.3,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          FlareSegmented<int>(
            expand: true,
            segments: [
              for (var i = 0; i < grades.length; i++) (i + 1, grades[i].$1),
            ],
            semanticLabels: [for (final grade in grades) grade.$2],
            selected: value,
            onChanged: onChanged,
          ),
          const SizedBox(height: 10),
          AnimatedSwitcher(
            duration: FlareMotion.of(context, FlareMotion.fade),
            switchInCurve: FlareMotion.settle,
            switchOutCurve: FlareMotion.exit,
            layoutBuilder: (current, previous) => Stack(
              alignment: Alignment.topLeft,
              children: [...previous, ?current],
            ),
            child: Padding(
              key: ValueKey(value),
              padding: const EdgeInsets.only(left: 2),
              child: ExcludeSemantics(
                child: Text(
                  full,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.4,
                    color: FlareColors.secondary,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ProgressPage extends StatelessWidget {
  const ProgressPage({
    super.key,
    required this.catalog,
    required this.store,
    required this.onDrill,
    this.onBack,
    this.now,
  });
  final Catalog catalog;
  final LearningStore store;
  final ValueChanged<Drill> onDrill;
  final VoidCallback? onBack;
  final DateTime Function()? now;

  Widget _stat(String value, String label) => Expanded(
    child: Container(
      padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: FlareColors.hairline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: const TextStyle(
              fontSize: 40,
              height: 1.1,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Eyebrow(label),
        ],
      ),
    ),
  );

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final today = (now ?? DateTime.now)();
    final day = DateTime(today.year, today.month, today.day);
    final monday = day.subtract(Duration(days: day.weekday - 1));
    final trained = {
      for (final session in store.sessions)
        if (session.completedSets > 0 || session.activeSeconds > 0)
          DateTime(
            session.endedAt.toLocal().year,
            session.endedAt.toLocal().month,
            session.endedAt.toLocal().day,
          ),
    };
    final labels = s.weekdayLabels.split(',');
    return Column(
      children: [
        PageHeader(title: s.history, onBack: onBack),
        Expanded(
          child: ScrollEdge(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
              children: [
                Row(
                  children: [
                    _stat('${store.weekTrainingDays}', s.weekDays),
                    const SizedBox(width: 12),
                    _stat('${store.streakDays}', s.streak),
                  ],
                ),
                const SizedBox(height: 18),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    for (var i = 0; i < 7; i++)
                      Semantics(
                        label: trained.contains(monday.add(Duration(days: i)))
                            ? s.trainedOn('周${labels[i]}')
                            : s.notTrainedOn('周${labels[i]}'),
                        child: ExcludeSemantics(
                          child: Column(
                            children: [
                              Container(
                                width: 30,
                                height: 30,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color:
                                      trained.contains(
                                        monday.add(Duration(days: i)),
                                      )
                                      ? FlareColors.accent
                                      : FlareColors.palette.track,
                                  border: monday.add(Duration(days: i)) == day
                                      ? Border.all(
                                          color: FlareColors.secondary,
                                          width: 1,
                                        )
                                      : null,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                labels[i],
                                style: TextStyle(
                                  fontSize: 11,
                                  color: FlareColors.dim,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
                SectionTitle(s.recent),
                if (store.sessions.isEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 12),
                    child: Text(
                      s.historyEmpty,
                      style: TextStyle(color: FlareColors.dim),
                    ),
                  )
                else
                  RowGroup(
                    children: [
                      for (final session in store.sessions.reversed.take(30))
                        if (catalog.drillById(session.drillId)
                            case final Drill drill)
                          FlareRow(
                            title: drill.name,
                            subtitle:
                                '${_dateLabel(session.startedAt.toLocal(), day, s.todayLabel)} · ${s.setsLabel(session.completedSets, session.plannedSets)}',
                            trailing: Text(
                              session.pain
                                  ? s.painFlag
                                  : session.completed
                                  ? s.completed
                                  : s.incomplete,
                              style: TextStyle(
                                fontSize: 12,
                                color: session.pain
                                    ? FlareColors.warning
                                    : session.completed
                                    ? FlareColors.secondary
                                    : FlareColors.dim,
                              ),
                            ),
                            onTap: () => onDrill(drill),
                          ),
                    ],
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  String _dateLabel(DateTime date, DateTime today, String todayLabel) {
    final time =
        '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    if (DateTime(date.year, date.month, date.day) == today) {
      return '$todayLabel $time';
    }
    return '${date.month}/${date.day} $time';
  }
}
