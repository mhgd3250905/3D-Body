import 'package:flutter/material.dart';
import '../domain/catalog_models.dart';
import '../l10n/app_localizations.dart';
import 'motion.dart';
import 'theme.dart';

extension FlareStrings on BuildContext {
  AppLocalizations get strings => AppLocalizations.of(this);
}

/// Quiet container used sparingly: grouped rows and small spec blocks.
class SurfaceCard extends StatelessWidget {
  const SurfaceCard({super.key, required this.child, this.padding = 16});
  final Widget child;
  final double padding;
  @override
  Widget build(BuildContext context) => Container(
    padding: EdgeInsets.all(padding),
    decoration: BoxDecoration(
      color: FlareColors.surface,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: FlareColors.hairline),
    ),
    child: child,
  );
}

/// Small grey label above a block ("一起发力", "最近").
class Eyebrow extends StatelessWidget {
  const Eyebrow(this.text, {super.key, this.color});
  final String text;
  final Color? color;
  @override
  Widget build(BuildContext context) => Text(
    text,
    style: TextStyle(
      color: color ?? FlareColors.dim,
      fontSize: 12,
      height: 1.4,
      letterSpacing: .4,
      fontWeight: FontWeight.w500,
    ),
  );
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.text, {super.key});
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 22, bottom: 10, left: 2),
    child: Semantics(header: true, child: Eyebrow(text)),
  );
}

/// The one primary action of a page. Full width, accent, generous height.
class PrimaryAction extends StatelessWidget {
  const PrimaryAction({
    super.key,
    required this.label,
    required this.onPressed,
    this.arrow = false,
    this.icon,
  });
  final String label;
  final VoidCallback? onPressed;
  final bool arrow;
  final IconData? icon;
  @override
  Widget build(BuildContext context) => Pressable(
    scale: .975,
    child: SizedBox(
      width: double.infinity,
      height: 56,
      child: FilledButton(
        onPressed: onPressed,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 20),
              const SizedBox(width: 8),
            ],
            Flexible(
              child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis),
            ),
            if (arrow) ...[
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward_rounded, size: 19),
            ],
          ],
        ),
      ),
    ),
  );
}

/// Round glass control, matching the home header buttons.
class RoundIconButton extends StatelessWidget {
  const RoundIconButton({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onPressed,
    this.diameter = 40,
  });
  final IconData icon;
  final String tooltip;
  final VoidCallback? onPressed;
  final double diameter;
  @override
  Widget build(BuildContext context) => Pressable(
    scale: .9,
    child: IconButton(
      onPressed: onPressed,
      tooltip: tooltip,
      style: IconButton.styleFrom(
        fixedSize: Size.square(diameter),
        minimumSize: const Size.square(44),
        backgroundColor: FlareColors.control,
        foregroundColor: FlareColors.controlIcon,
        side: BorderSide(color: FlareColors.controlBorder, width: .5),
        shape: const CircleBorder(),
      ),
      icon: Icon(icon, size: 18),
    ),
  );
}

/// Pill tag with a colour dot. Tappable when [onTap] is given.
class DotTag extends StatelessWidget {
  const DotTag({super.key, required this.label, this.color, this.onTap});
  final String label;
  final Color? color;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) => Pressable(
    scale: .95,
    child: Material(
      color: FlareColors.pill,
      shape: StadiumBorder(side: BorderSide(color: FlareColors.hairline)),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onTap,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 36),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (color != null) ...[
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 7),
                ],
                Text(
                  label,
                  style: TextStyle(fontSize: 13, color: FlareColors.secondary),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

/// Rounded group of rows separated by hairlines (settings, menus).
class RowGroup extends StatelessWidget {
  const RowGroup({super.key, required this.children});
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Container(
    decoration: BoxDecoration(
      color: FlareColors.surface,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(color: FlareColors.hairline),
    ),
    clipBehavior: Clip.antiAlias,
    child: Column(
      children: [
        for (var i = 0; i < children.length; i++) ...[
          if (i > 0) const Divider(indent: 16, endIndent: 16),
          children[i],
        ],
      ],
    ),
  );
}

class FlareRow extends StatelessWidget {
  const FlareRow({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
  });
  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap,
    child: ConstrainedBox(
      constraints: const BoxConstraints(minHeight: 56),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            if (leading != null) ...[leading!, const SizedBox(width: 14)],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 3),
                    Text(
                      subtitle!,
                      style: TextStyle(fontSize: 12, color: FlareColors.dim),
                    ),
                  ],
                ],
              ),
            ),
            trailing ??
                (onTap == null
                    ? const SizedBox.shrink()
                    : Icon(
                        Icons.chevron_right_rounded,
                        size: 20,
                        color: FlareColors.dim,
                      )),
          ],
        ),
      ),
    ),
  );
}

/// Quiet disclosure: a single grey line that opens to reveal detail.
class Disclosure extends StatelessWidget {
  const Disclosure({super.key, required this.title, required this.children});
  final String title;
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Theme(
    data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
    child: ExpansionTile(
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 12),
      expandedCrossAxisAlignment: CrossAxisAlignment.start,
      iconColor: FlareColors.dim,
      collapsedIconColor: FlareColors.dim,
      shape: const Border(),
      collapsedShape: const Border(),
      expansionAnimationStyle: AnimationStyle(
        curve: FlareMotion.settle,
        duration: FlareMotion.of(context, FlareMotion.expand),
        reverseCurve: FlareMotion.standard,
        reverseDuration: FlareMotion.of(context, FlareMotion.collapse),
      ),
      title: Text(
        title,
        style: TextStyle(fontSize: 14, color: FlareColors.secondary),
      ),
      children: children,
    ),
  );
}

class TierSelector extends StatelessWidget {
  const TierSelector({super.key, required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String> onChanged;
  @override
  Widget build(BuildContext context) => FlareSegmented<String>(
    expand: true,
    segments: [
      ('A', context.strings.tierA),
      ('B', context.strings.tierB),
      ('C', context.strings.tierC),
    ],
    selected: value,
    onChanged: onChanged,
  );
}

/// Compact list row for a drill (today's list, lesson drills).
class DrillTile extends StatelessWidget {
  const DrillTile({
    super.key,
    required this.drill,
    required this.onTap,
    this.trailing,
    this.color,
    this.groupLabel,
  });
  final Drill drill;
  final VoidCallback onTap;
  final Widget? trailing;
  final Color? color;
  final String? groupLabel;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Pressable(
      scale: .98,
      child: Material(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(18),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    drillArt(drill.thumbnailAsset),
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                    frameBuilder: (context, child, frame, sync) =>
                        fadeInFrame(context, child, frame, sync),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        drill.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        drill.prescription,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: FlareColors.dim, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                trailing ??
                    Padding(
                      padding: EdgeInsets.only(right: 6),
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

/// Image-first tile for the two-column library grid.
class DrillCard extends StatelessWidget {
  const DrillCard({
    super.key,
    required this.drill,
    required this.onTap,
    required this.groupLabel,
    required this.color,
  });
  final Drill drill;
  final VoidCallback onTap;
  final String groupLabel;
  final Color color;
  @override
  Widget build(BuildContext context) => Pressable(
    child: Material(
      color: FlareColors.surface,
      borderRadius: BorderRadius.circular(20),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: ColoredBox(
                color: FlareColors.raised,
                child: Image.asset(
                  drillArt(drill.thumbnailAsset),
                  fit: BoxFit.cover,
                  frameBuilder: (context, child, frame, sync) =>
                      fadeInFrame(context, child, frame, sync),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    drill.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: color,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          groupLabel,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 11,
                            color: FlareColors.dim,
                          ),
                        ),
                      ),
                    ],
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

class BodyText extends StatelessWidget {
  const BodyText(this.text, {super.key, this.color});
  final String text;
  final Color? color;
  @override
  Widget build(BuildContext context) => Text(
    text,
    style: TextStyle(
      fontSize: 14,
      height: 1.65,
      color: color ?? FlareColors.body,
    ),
  );
}

/// Training illustrations come as a dark studio set and a matching light set
/// (same pose, framing and highlight) under `assets/drills/light/`.
String drillArt(String asset) => FlareColors.palette.isDark
    ? asset
    : asset.replaceFirst('assets/drills/', 'assets/drills/light/');

/// Scroll-under edges for a page body: a hairline fades in under the header
/// once content scrolls beneath it, and another above the bottom action while
/// more content waits below, the way iOS bars separate only when needed.
class ScrollEdge extends StatefulWidget {
  const ScrollEdge({super.key, required this.child, this.bottom = true});
  final Widget child;
  final bool bottom;
  @override
  State<ScrollEdge> createState() => _ScrollEdgeState();
}

class _ScrollEdgeState extends State<ScrollEdge> {
  bool _under = false;
  bool _more = false;

  bool _onMetrics(ScrollMetrics metrics) {
    if (metrics.axis != Axis.vertical) return false;
    final under = metrics.pixels > 1;
    final more = metrics.extentAfter > 1;
    if (under != _under || more != _more) {
      setState(() {
        _under = under;
        _more = more;
      });
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    Widget line(bool visible, Alignment alignment) => Align(
      alignment: alignment,
      child: IgnorePointer(
        child: AnimatedOpacity(
          opacity: visible ? 1 : 0,
          duration: FlareMotion.of(context, FlareMotion.quick),
          child: Container(height: .6, color: FlareColors.controlBorder),
        ),
      ),
    );
    return NotificationListener<ScrollMetricsNotification>(
      onNotification: (n) => n.depth == 0 && _onMetrics(n.metrics),
      child: NotificationListener<ScrollNotification>(
        onNotification: (n) => n.depth == 0 && _onMetrics(n.metrics),
        child: Stack(
          children: [
            Positioned.fill(child: widget.child),
            line(_under, Alignment.topCenter),
            if (widget.bottom) line(_more, Alignment.bottomCenter),
          ],
        ),
      ),
    );
  }
}

/// iOS-style segmented control: a recessed track with one thumb that slides
/// to the chosen segment. Tap a segment, or drag the thumb across. Segments
/// share one width (the widest label) unless [expand] fills the row.
class FlareSegmented<T> extends StatefulWidget {
  const FlareSegmented({
    super.key,
    required this.segments,
    required this.selected,
    required this.onChanged,
    this.expand = false,
    this.semanticLabels,
  });
  final List<(T, String)> segments;
  final T selected;
  final ValueChanged<T> onChanged;
  final bool expand;

  /// Fuller spoken labels when the visible ones are abbreviated.
  final List<String>? semanticLabels;

  @override
  State<FlareSegmented<T>> createState() => _FlareSegmentedState<T>();
}

class _FlareSegmentedState<T> extends State<FlareSegmented<T>> {
  int? _dragIndex;

  int get _selectedIndex {
    final index = widget.segments.indexWhere((s) => s.$1 == widget.selected);
    return index < 0 ? 0 : index;
  }

  void _choose(int index) {
    if (index < 0 || index >= widget.segments.length) return;
    final value = widget.segments[index].$1;
    if (value == widget.selected) return;
    FlareHaptics.selection();
    widget.onChanged(value);
  }

  int _indexAt(double dx, double width) => (dx / width * widget.segments.length)
      .floor()
      .clamp(0, widget.segments.length - 1);

  @override
  Widget build(BuildContext context) {
    final count = widget.segments.length;
    final shown = _dragIndex ?? _selectedIndex;
    final dark = FlareColors.palette.isDark;
    final row = Row(
      mainAxisSize: widget.expand ? MainAxisSize.max : MainAxisSize.min,
      children: [
        for (var i = 0; i < count; i++)
          Expanded(
            child: Semantics(
              button: true,
              inMutuallyExclusiveGroup: true,
              selected: i == _selectedIndex,
              label: widget.semanticLabels?[i] ?? widget.segments[i].$2,
              onTap: () => _choose(i),
              excludeSemantics: true,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () => _choose(i),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: FlareMotion.of(context, FlareMotion.quick),
                      style: TextStyle(
                        fontFamily: 'FlareSans',
                        fontSize: 13,
                        height: 1.2,
                        letterSpacing: .2,
                        color: i == shown
                            ? FlareColors.text
                            : FlareColors.palette.muted,
                        fontWeight: i == shown
                            ? FontWeight.w600
                            : FontWeight.w500,
                      ),
                      child: Text(
                        widget.segments[i].$2,
                        maxLines: 1,
                        softWrap: false,
                        overflow: TextOverflow.fade,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
    final control = Container(
      height: 34,
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: FlareColors.palette.segmentTrack,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Builder(
        builder: (context) => GestureDetector(
          onHorizontalDragStart: (d) => setState(
            () =>
                _dragIndex = _indexAt(d.localPosition.dx, context.size!.width),
          ),
          onHorizontalDragUpdate: (d) {
            final index = _indexAt(d.localPosition.dx, context.size!.width);
            if (index != _dragIndex) {
              FlareHaptics.selection();
              setState(() => _dragIndex = index);
            }
          },
          onHorizontalDragEnd: (_) {
            final index = _dragIndex;
            setState(() => _dragIndex = null);
            if (index != null && widget.segments[index].$1 != widget.selected) {
              widget.onChanged(widget.segments[index].$1);
            }
          },
          onHorizontalDragCancel: () => setState(() => _dragIndex = null),
          child: Stack(
            children: [
              Positioned.fill(
                child: AnimatedAlign(
                  alignment: Alignment(
                    count == 1 ? 0 : -1 + 2 * shown / (count - 1),
                    0,
                  ),
                  duration: FlareMotion.of(context, FlareMotion.fade),
                  curve: FlareMotion.settle,
                  child: FractionallySizedBox(
                    widthFactor: 1 / count,
                    heightFactor: 1,
                    child: AnimatedScale(
                      scale: _dragIndex != null ? .96 : 1,
                      duration: FlareMotion.of(context, FlareMotion.quick),
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: FlareColors.palette.segmentThumb,
                          borderRadius: BorderRadius.circular(8),
                          border: dark
                              ? null
                              : Border.all(
                                  color: const Color(0x0a000000),
                                  width: .5,
                                ),
                          boxShadow: dark
                              ? null
                              : const [
                                  BoxShadow(
                                    color: Color(0x1f000000),
                                    blurRadius: 8,
                                    offset: Offset(0, 3),
                                  ),
                                  BoxShadow(
                                    color: Color(0x0a000000),
                                    blurRadius: 1,
                                    offset: Offset(0, 1),
                                  ),
                                ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              row,
            ],
          ),
        ),
      ),
    );
    return Semantics(
      container: true,
      child: widget.expand
          ? SizedBox(width: double.infinity, child: control)
          : IntrinsicWidth(child: control),
    );
  }
}
