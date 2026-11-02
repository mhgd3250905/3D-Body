import 'package:flutter/material.dart';

import 'components.dart';
import 'motion.dart';
import 'theme.dart';

/// Shared page kit (UI polish r1). Every Thomas-owned pushed page uses one
/// navigation bar, one back glyph, one title size and one bottom action, so
/// pages read as one app. SDK routes (trainer, check-in, completion, coach
/// chat widgets) keep their own chrome.

/// Fixed width of the leading/trailing slot; keeps the title optically
/// centred even when only one side has a control.
const double _kNavSlot = 48;

/// Plain icon control for the navigation bar: 44pt touch target, no ring.
class FlareNavIconButton extends StatelessWidget {
  const FlareNavIconButton({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onPressed,
    this.color,
  });
  final IconData icon;
  final String tooltip;
  final VoidCallback? onPressed;
  final Color? color;

  @override
  Widget build(BuildContext context) => Tooltip(
    message: tooltip,
    child: Semantics(
      button: true,
      label: tooltip,
      excludeSemantics: true,
      child: Material(
        type: MaterialType.transparency,
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onPressed,
          child: SizedBox.square(
            dimension: 44,
            child: Icon(
              icon,
              size: 21,
              color: onPressed == null
                  ? FlareColors.dim
                  : (color ?? FlareColors.text),
            ),
          ),
        ),
      ),
    ),
  );
}

/// The one navigation bar: icon-only back (‹), centred 17/w600 title,
/// at most one trailing action.
class FlareNavBar extends StatelessWidget {
  const FlareNavBar({
    super.key,
    this.title,
    this.onBack,
    this.action,
    this.subtitle,
  });
  final String? title;
  final VoidCallback? onBack;
  final Widget? action;
  final String? subtitle;

  static const IconData backIcon = Icons.arrow_back_ios_new_rounded;
  static const double titleSize = 17;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(6, 4, 6, 8),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 44),
          child: Row(
            children: [
              SizedBox(
                width: _kNavSlot,
                child: onBack == null
                    ? null
                    : Align(
                        alignment: AlignmentDirectional.centerStart,
                        child: FlareNavIconButton(
                          icon: backIcon,
                          tooltip: context.strings.goBack,
                          onPressed: onBack,
                        ),
                      ),
              ),
              Expanded(
                child: title == null
                    ? const SizedBox.shrink()
                    : Semantics(
                        header: true,
                        child: Text(
                          title!,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: titleSize,
                            height: 1.3,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
              ),
              SizedBox(
                width: _kNavSlot,
                child: action == null
                    ? null
                    : Align(
                        alignment: AlignmentDirectional.centerEnd,
                        child: action,
                      ),
              ),
            ],
          ),
        ),
        if (subtitle != null)
          Padding(
            padding: const EdgeInsets.only(top: 2),
            child: Eyebrow(subtitle!),
          ),
      ],
    ),
  );
}

/// Pinned primary action at the bottom of a page: 50pt Thomas pill, no
/// glass ring around it, sitting on the page background with a hairline-free
/// soft fade so scrolled content does not end in a hard edge.
class FlareBottomAction extends StatelessWidget {
  const FlareBottomAction({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.fromLTRB(20, 8, 20, 12),
  });

  /// Usually a [FlareBottomButton]; any widget is allowed for compound bars.
  final Widget child;
  final EdgeInsetsGeometry padding;

  static const double buttonHeight = 50;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          FlareColors.background.withValues(alpha: 0),
          FlareColors.background,
        ],
        stops: const [0, .35],
      ),
    ),
    child: Padding(padding: padding, child: child),
  );
}

/// The pill primary button used inside [FlareBottomAction].
class FlareBottomButton extends StatelessWidget {
  const FlareBottomButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.arrow = false,
    this.semanticsLabel,
    this.height = FlareBottomAction.buttonHeight,
  });
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool arrow;
  final String? semanticsLabel;
  final double height;

  @override
  Widget build(BuildContext context) => PrimaryAction(
    label: label,
    onPressed: onPressed,
    icon: icon,
    arrow: arrow,
    semanticsLabel: semanticsLabel,
    height: height,
  );
}

/// Group heading: 12/w600 dim.
class FlareSection extends StatelessWidget {
  const FlareSection(this.text, {super.key, this.trailing});
  final String text;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(4, 22, 4, 8),
    child: Row(
      children: [
        Expanded(
          child: Semantics(
            header: true,
            child: Text(
              text,
              style: TextStyle(
                color: FlareColors.dim,
                fontSize: 12,
                height: 1.4,
                letterSpacing: .3,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
        ?trailing,
      ],
    ),
  );
}

/// Flat grouped list panel: no outline, separated by inset hairlines.
class FlareListGroup extends StatelessWidget {
  const FlareListGroup({super.key, required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => ClipRRect(
    borderRadius: BorderRadius.circular(18),
    child: Material(
      color: FlareColors.surface,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < children.length; i++) ...[
            if (i > 0)
              Divider(
                height: .5,
                thickness: .5,
                indent: 16,
                endIndent: 0,
                color: FlareColors.hairline,
              ),
            children[i],
          ],
        ],
      ),
    ),
  );
}

/// Accent-tinted 32×32 icon block for [FlareListRow.leading].
class FlareRowIcon extends StatelessWidget {
  const FlareRowIcon(this.icon, {super.key});
  final IconData icon;

  @override
  Widget build(BuildContext context) => Container(
    width: 32,
    height: 32,
    alignment: Alignment.center,
    decoration: BoxDecoration(
      color: FlareColors.accent.withValues(alpha: .14),
      borderRadius: BorderRadius.circular(8),
    ),
    child: Icon(icon, size: 18, color: FlareColors.accentInk),
  );
}

/// Row ≥56: title 16/w500, subtitle 13 dim (1 line), meta 14, chevron.
class FlareListRow extends StatelessWidget {
  const FlareListRow({
    super.key,
    required this.title,
    this.subtitle,
    this.leading,
    this.meta,
    this.trailing,
    this.onTap,
    this.destructive = false,
  });
  final String title;
  final String? subtitle;
  final Widget? leading;
  final String? meta;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool destructive;

  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap == null
        ? null
        : () {
            FlareHaptics.light();
            onTap!();
          },
    child: ConstrainedBox(
      constraints: const BoxConstraints(minHeight: 56),
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(16, 10, 12, 10),
        child: Row(
          children: [
            if (leading != null) ...[leading!, const SizedBox(width: 12)],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: destructive ? FlareColors.danger : null,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 13, color: FlareColors.dim),
                    ),
                  ],
                ],
              ),
            ),
            if (meta != null) ...[
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  meta!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(fontSize: 14, color: FlareColors.secondary),
                ),
              ),
            ],
            const SizedBox(width: 4),
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

/// A labelled text field sitting in a flat grouped panel: the label is a
/// [FlareSection] above, the field itself has no outline.
class FlareFieldGroup extends StatelessWidget {
  const FlareFieldGroup({super.key, required this.label, required this.field});
  final String label;
  final Widget field;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    mainAxisSize: MainAxisSize.min,
    children: [
      FlareSection(label),
      Theme(
        data: Theme.of(context).copyWith(
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: FlareColors.surface,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 16,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(18),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(18),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(18),
              borderSide: BorderSide(
                color: FlareColors.accent.withValues(alpha: .6),
                width: 1,
              ),
            ),
          ),
        ),
        child: field,
      ),
    ],
  );
}
