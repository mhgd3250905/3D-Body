import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app_glass.dart';
import 'components.dart';
import 'motion.dart';
import 'row_icons.dart';
import 'theme.dart';

/// Shared page kit (UI polish r1). Every Thomas-owned pushed page uses one
/// navigation bar, one back glyph, one title size and one bottom action, so
/// pages read as one app. SDK routes (trainer, check-in, completion, coach
/// chat widgets) keep their own chrome.

/// Navigation-bar control: the home top-bar 40pt r12 glass square in a
/// 48pt touch target.
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
      enabled: onPressed != null,
      excludeSemantics: true,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onPressed,
        child: Pressable(
          scale: .94,
          child: SizedBox.square(
            dimension: 48,
            child: Center(
              child: SizedBox.square(
                dimension: 40,
                // The home top-bar square: HipLab glass without blur (plain
                // page behind it), r12, hairline rim, no light shadow.
                child: FlareHipGlassSurface(
                  radius: 12,
                  blur: false,
                  child: Center(
                    child: Icon(
                      icon,
                      size: 18,
                      color: onPressed == null
                          ? FlareColors.dim
                          : (color ?? FlareColors.text),
                    ),
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

/// The back chip (HipLab): one 44pt frosted circle with a 32pt chevron,
/// parked 16pt from the leading edge on the 44pt control rail under the
/// status bar. Flat glass: a uniform tint over a real, clipped backdrop
/// blur and one hairline rim; no bevel and no shadow.
class FlareBackChip extends StatelessWidget {
  const FlareBackChip({super.key, required this.onPressed});
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => FlareNavChip(
    label: context.strings.goBack,
    icon: FlareNavBar.backIcon,
    onPressed: onPressed,
  );
}

/// The shared navigation chip, also used by the home menu entry.
class FlareNavChip extends StatelessWidget {
  const FlareNavChip({
    super.key,
    required this.label,
    required this.icon,
    required this.onPressed,
  });

  final String label;
  final IconData icon;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: FlareGeometry.hitTarget,
    child: Tooltip(
      message: label,
      child: FlarePressable(
        semanticLabel: label,
        scale: FlareMotion.navPressScale,
        onTap: onPressed == null
            ? null
            : () {
                FlareHaptics.light();
                onPressed!();
              },
        child: _FlareChipSurface(
          child: Center(
            child: Icon(
              icon,
              size: FlareGeometry.navIconSize,
              color: onPressed == null ? FlareColors.dim : FlareColors.text,
            ),
          ),
        ),
      ),
    ),
  );
}

class _FlareChipSurface extends StatelessWidget {
  const _FlareChipSurface({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final dark = FlareColors.isDark;
    final high = MediaQuery.maybeHighContrastOf(context) ?? false;
    final fill = FlareNavigationGlass.chipFill(dark: dark, high: high);
    final rim = FlareNavigationGlass.chipRim(dark: dark, high: high);
    final body = ColoredBox(color: fill, child: child);
    return DecoratedBox(
      position: DecorationPosition.foreground,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: rim,
          width: FlareNavigationGlass.chipRimWidth(high: high),
        ),
      ),
      // The oval clip is the paint bound the backdrop blur samples within.
      child: ClipOval(
        child: high
            ? body
            : BackdropFilter(
                filter: ui.ImageFilter.blur(
                  sigmaX: FlareNavigationGlass.chipSigma,
                  sigmaY: FlareNavigationGlass.chipSigma,
                  tileMode: TileMode.mirror,
                ),
                child: body,
              ),
      ),
    );
  }
}

/// The one navigation bar (HipLab geometry): a 44pt row (52 with a
/// subtitle) whose title 17/w600 is centred between 60pt insets, the back
/// chip on the leading control rail and at most one trailing action, then
/// the 24pt transition strip before content. Inside a [FlareStage] moving
/// between two pages that both go back, the stage keeps one chip still and
/// this bar leaves its slot empty ([FlareBackPin]).
class FlareNavBar extends StatelessWidget {
  const FlareNavBar({
    super.key,
    this.title,
    this.onBack,
    this.action,
    this.subtitle,
    this.topInset = 0,
    this.fade = FlareGeometry.navFade,
    this.glass = false,
  });
  final String? title;
  final VoidCallback? onBack;
  final Widget? action;
  final String? subtitle;
  final double topInset;
  final double fade;
  final bool glass;

  static const IconData backIcon = Icons.chevron_left_rounded;
  static const double titleSize = 17;

  /// The back chip's leading edge.
  static const double chipEdge = FlareGeometry.navSideInset;

  @override
  Widget build(BuildContext context) {
    final row = subtitle == null
        ? FlareGeometry.navRow
        : FlareGeometry.navRowWithSubtitle;
    final pinned = FlareBackPin.hiddenOf(context);
    return SizedBox(
      height: topInset + row + fade,
      child: Stack(
        children: [
          if (glass) const Positioned.fill(child: FlareNavFrost()),
          if (title != null)
            Positioned(
              top: topInset,
              left: FlareGeometry.navTitleInset,
              right: FlareGeometry.navTitleInset,
              height: row,
              // Like a system bar, the title caps its text growth so title
              // and subtitle always fit the row.
              child: IgnorePointer(
                child: MediaQuery.withClampedTextScaling(
                  maxScaleFactor: 1.3,
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Semantics(
                          header: true,
                          child: Text(
                            title!,
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: FlareType.navTitle.copyWith(
                              height: 1.2,
                              color: FlareColors.text,
                            ),
                          ),
                        ),
                        if (subtitle != null)
                          Text(
                            subtitle!,
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: FlareType.navSubtitle.copyWith(
                              height: 1.25,
                              color: FlareColors.muted,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          if (onBack != null && !pinned)
            PositionedDirectional(
              start: chipEdge,
              top: topInset,
              child: FlareBackChip(onPressed: onBack),
            ),
          if (action != null)
            PositionedDirectional(
              end: chipEdge,
              top: topInset,
              height: FlareGeometry.navRow,
              child: Center(child: action),
            ),
        ],
      ),
    );
  }
}

/// The material band includes the system status area, not just the fade tail.
double flareNavInset(BuildContext context, {bool hasSubtitle = false}) =>
    MediaQuery.paddingOf(context).top +
    (hasSubtitle ? FlareGeometry.navRowWithSubtitle : FlareGeometry.navRow) +
    FlareGeometry.navFade;

/// App-owned page surface with its navigation material above the body.
/// Scrollable bodies clear [flareNavInset] in their own content padding.
class FlareNavPage extends StatelessWidget {
  const FlareNavPage({
    super.key,
    this.title,
    this.subtitle,
    this.onBack,
    this.action,
    required this.body,
    this.bodyScrollsUnderBar = true,
    this.bottomBar,
  });

  final String? title;
  final String? subtitle;
  final VoidCallback? onBack;
  final Widget? action;
  final Widget body;
  final bool bodyScrollsUnderBar;
  final Widget? bottomBar;

  @override
  Widget build(BuildContext context) {
    final safeTop = MediaQuery.paddingOf(context).top;
    final row = subtitle == null
        ? FlareGeometry.navRow
        : FlareGeometry.navRowWithSubtitle;
    return ColoredBox(
      color: FlareColors.background,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Column(
            children: [
              Expanded(
                child: bodyScrollsUnderBar
                    ? body
                    : Padding(
                        padding: EdgeInsets.only(top: safeTop + row),
                        child: body,
                      ),
              ),
              ?bottomBar,
            ],
          ),
          PositionedDirectional(
            top: 0,
            start: 0,
            end: 0,
            child: FlareNavBar(
              title: title,
              subtitle: subtitle,
              onBack: onBack,
              action: action,
              topInset: safeTop,
              fade: bodyScrollsUnderBar ? FlareGeometry.navFade : 0,
              glass: true,
            ),
          ),
        ],
      ),
    );
  }
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

/// Settings group (HipLab): one radius-10 surface with no outline and no
/// shadow (dark white α.06, light white α.70); 0.5 separators start at the
/// text column: 58 after a row with an icon, 16 otherwise, unless [inset]
/// fixes it for the whole group. Groups sit 28 apart without headings.
class FlareListGroup extends StatelessWidget {
  const FlareListGroup({super.key, required this.children, this.inset});
  final List<Widget> children;

  /// Separator start for every row; null picks it per row.
  final double? inset;

  static Color fill() => FlareColors.isDark
      ? Colors.white.withValues(alpha: .06)
      : Colors.white.withValues(alpha: .70);

  double _insetBefore(Widget next) =>
      inset ??
      (next is FlareListRow && next.leading != null
          ? FlareGeometry.rowTextStart
          : 16);

  @override
  Widget build(BuildContext context) => Material(
    color: fill(),
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.all(
        Radius.circular(FlareGeometry.groupRadius),
      ),
    ),
    clipBehavior: Clip.antiAlias,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < children.length; i++) ...[
          if (i > 0)
            Padding(
              padding: EdgeInsetsDirectional.only(
                start: _insetBefore(children[i]),
              ),
              child: Container(
                height: FlareGeometry.hairline,
                color: FlareColors.text.withValues(alpha: .10),
              ),
            ),
          children[i],
        ],
      ],
    ),
  );
}

/// Thomas row artwork in the shared 30pt slot. The same icon adapter keeps
/// existing callers, while named symbols distinguish settings and appearance.
/// Decoration only; the row owns the action and spoken name.
class FlareRowIcon extends StatelessWidget {
  const FlareRowIcon(this.icon, {super.key, this.symbol});
  final IconData icon;
  final FlareRowSymbol? symbol;

  @override
  Widget build(BuildContext context) {
    final resolved =
        symbol ??
        switch (icon) {
          Icons.fitness_center_outlined => FlareRowSymbol.training,
          Icons.playlist_play_rounded => FlareRowSymbol.plans,
          Icons.insights_outlined => FlareRowSymbol.records,
          Icons.tune_outlined => FlareRowSymbol.settings,
          Icons.translate_rounded => FlareRowSymbol.language,
          Icons.contrast_rounded => FlareRowSymbol.appearance,
          Icons.accessibility_new_rounded => FlareRowSymbol.actor,
          Icons.speed_rounded => FlareRowSymbol.speed,
          Icons.high_quality_outlined => FlareRowSymbol.quality,
          Icons.health_and_safety_outlined => FlareRowSymbol.safety,
          Icons.info_outline_rounded => FlareRowSymbol.about,
          Icons.add_rounded => FlareRowSymbol.add,
          Icons.auto_awesome_rounded => FlareRowSymbol.coach,
          _ => null,
        };
    if (resolved != null) return FlareRowEmblem(symbol: resolved);
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: FlareGeometry.rowIconSlot,
        child: Icon(icon, color: FlareColors.accentText),
      ),
    );
  }
}

/// Whether the resolved UI language sets a row title on one line (CJK) or
/// lets it take two (alphabetic and Indic scripts run longer).
bool flareCompactScript(BuildContext context) => const {
  'zh',
  'ja',
  'ko',
}.contains(Localizations.localeOf(context).languageCode);

/// Settings row (HipLab): padding 16/10, minimum 52 (60 with a subtitle),
/// title 17/w400, subtitle 13 muted (two lines), meta 14 faint, a 15pt
/// chevron only on a tappable row without its own trailing control. A
/// tappable row presses as a whole at .99; a static row is not a button.
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
  Widget build(BuildContext context) {
    final compact = flareCompactScript(context);
    final content = ConstrainedBox(
      constraints: BoxConstraints(
        minHeight: subtitle == null
            ? FlareGeometry.rowMinHeight
            : FlareGeometry.rowMinHeightWithSubtitle,
      ),
      child: Padding(
        padding: const EdgeInsetsDirectional.fromSTEB(
          FlareGeometry.rowSideInset,
          FlareGeometry.rowVerticalInset,
          FlareGeometry.rowSideInset,
          FlareGeometry.rowVerticalInset,
        ),
        child: Row(
          children: [
            if (leading != null) ...[
              leading!,
              const SizedBox(width: FlareGeometry.rowIconGap),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  FlareWordSafeText(
                    title,
                    maxLines: compact ? 1 : 2,
                    style: FlareType.rowTitle.copyWith(
                      height: 1.25,
                      color: destructive
                          ? FlareColors.danger
                          : FlareColors.text,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: FlareGeometry.rowSubtitleGap),
                    Text(
                      subtitle!,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: FlareType.rowSubtitle.copyWith(
                        height: 1.3,
                        color: FlareColors.muted,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            if (meta != null) ...[
              const SizedBox(width: 8),
              ConstrainedBox(
                constraints: BoxConstraints(maxWidth: compact ? 140 : 105),
                child: Text(
                  meta!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.end,
                  style: FlareType.rowMeta.copyWith(color: FlareColors.faint),
                ),
              ),
              const SizedBox(width: 4),
            ],
            trailing ??
                (onTap == null
                    ? const SizedBox.shrink()
                    : Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: FlareGeometry.rowChevron,
                        color: FlareColors.faint,
                      )),
          ],
        ),
      ),
    );
    if (onTap == null) return content;
    return FlarePressable(
      scale: .99,
      preserveChildSemantics: trailing != null,
      onTap: () {
        FlareHaptics.light();
        onTap!();
      },
      child: content,
    );
  }
}

/// A switch row's control (HipLab): a 51×31 capsule with a 27pt white knob
/// inset 2, inside a 51×44 hit target; accent when on, system grey when
/// off; 200ms easeOutCubic, none under reduced motion. Give every switch
/// its own [semanticLabel].
class FlareSwitch extends StatelessWidget {
  const FlareSwitch({
    super.key,
    required this.value,
    required this.onChanged,
    required this.semanticLabel,
  });
  final bool value;
  final ValueChanged<bool> onChanged;
  final String semanticLabel;

  void _toggle() {
    FlareHaptics.selection();
    onChanged(!value);
  }

  @override
  Widget build(BuildContext context) {
    final duration = FlareMotion.of(context, FlareMotion.toggle);
    final dark = FlareColors.isDark;
    return Semantics(
      container: true,
      toggled: value,
      enabled: true,
      label: semanticLabel,
      onTap: _toggle,
      child: FocusableActionDetector(
        shortcuts: const {
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: {
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (_) {
              _toggle();
              return null;
            },
          ),
        },
        child: GestureDetector(
          excludeFromSemantics: true,
          behavior: HitTestBehavior.opaque,
          onTap: _toggle,
          child: SizedBox(
            width: 51,
            height: FlareGeometry.hitTarget,
            child: Center(
              child: AnimatedContainer(
                duration: duration,
                curve: Curves.easeOutCubic,
                width: 51,
                height: 31,
                padding: const EdgeInsets.all(2),
                decoration: BoxDecoration(
                  color: value ? FlareColors.accent : FlareColors.switchOff,
                  borderRadius: BorderRadius.circular(15.5),
                ),
                child: AnimatedAlign(
                  duration: duration,
                  curve: Curves.easeOutCubic,
                  alignment: value
                      ? AlignmentDirectional.centerEnd
                      : AlignmentDirectional.centerStart,
                  child: Container(
                    width: 27,
                    height: 27,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(
                            alpha: dark ? .32 : .16,
                          ),
                          blurRadius: 3,
                          offset: const Offset(0, 1.5),
                        ),
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

/// Confirmation (HipLab): at most 320 wide and 78 % of the screen high,
/// radius 14, centred text with a scrolling message, a 50pt action row
/// split by 0.5 hairlines; one light shadow. Resolves null for a scrim tap,
/// false for cancel and true for confirm: act only on `true`.
Future<bool?> showFlareConfirmDialog(
  BuildContext context, {
  required String title,
  String? message,
  required String cancelLabel,
  required String confirmLabel,
  bool destructive = false,
}) => showGeneralDialog<bool>(
  context: context,
  barrierDismissible: true,
  barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
  barrierColor: Colors.black.withValues(alpha: .36),
  transitionDuration: FlareMotion.of(context, FlareMotion.quick),
  pageBuilder: (dialogContext, _, _) => _FlareConfirmDialog(
    title: title,
    message: message,
    cancelLabel: cancelLabel,
    confirmLabel: confirmLabel,
    destructive: destructive,
  ),
  transitionBuilder: (context, animation, _, child) {
    final t = CurvedAnimation(parent: animation, curve: Curves.easeOutCubic);
    return FadeTransition(
      opacity: t,
      child: ScaleTransition(
        scale: Tween(begin: .96, end: 1.0).animate(t),
        child: child,
      ),
    );
  },
);

class _FlareConfirmDialog extends StatelessWidget {
  const _FlareConfirmDialog({
    required this.title,
    required this.message,
    required this.cancelLabel,
    required this.confirmLabel,
    required this.destructive,
  });
  final String title;
  final String? message;
  final String cancelLabel;
  final String confirmLabel;
  final bool destructive;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final hairline = Container(color: FlareColors.text.withValues(alpha: .10));
    Widget action(String label, bool result, {bool strong = false}) => Expanded(
      child: FlarePressable(
        scale: .98,
        semanticLabel: label,
        onTap: () => Navigator.of(context).pop(result),
        child: SizedBox(
          height: FlareGeometry.buttonHeight,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  label,
                  maxLines: 1,
                  style: FlareType.secondaryButton.copyWith(
                    fontWeight: strong ? FontWeight.w600 : FontWeight.w400,
                    color: !strong
                        ? FlareColors.text
                        : destructive
                        ? FlareColors.danger
                        : FlareColors.accentText,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxWidth: FlareGeometry.dialogMaxWidth,
            maxHeight: size.height * .78,
          ),
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: FlareColors.palette.popup,
              borderRadius: BorderRadius.circular(FlareGeometry.dialogRadius),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: .18),
                  blurRadius: 28,
                  offset: const Offset(0, 12),
                ),
              ],
            ),
            // A transparent Material gives bare Text a real text style
            // inside the dialog route.
            child: Material(
              type: MaterialType.transparency,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(FlareGeometry.dialogRadius),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Flexible(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(20, 20, 20, 18),
                        child: Column(
                          children: [
                            Text(
                              title,
                              textAlign: TextAlign.center,
                              style: FlareType.navTitle.copyWith(
                                color: FlareColors.text,
                              ),
                            ),
                            if (message != null) ...[
                              const SizedBox(height: 6),
                              Text(
                                message!,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 14,
                                  height: 1.45,
                                  color: FlareColors.muted,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    SizedBox(height: FlareGeometry.hairline, child: hairline),
                    IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          action(cancelLabel, false),
                          SizedBox(
                            width: FlareGeometry.hairline,
                            child: hairline,
                          ),
                          action(confirmLabel, true, strong: true),
                        ],
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
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
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

/// Up to two lines that never split a word: when the longest word
/// (Einheiten, тренировок) is wider than the column at the current text
/// scale, the font shrinks just enough for it to fit.
class FlareWordSafeText extends StatelessWidget {
  const FlareWordSafeText(
    this.text, {
    super.key,
    required this.style,
    this.align,
    this.maxLines = 2,
  });
  final int maxLines;
  final String text;
  final TextStyle style;
  final TextAlign? align;
  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, box) {
      final base = DefaultTextStyle.of(context).style.merge(style);
      var widest = 0.0;
      for (final word in text.split(RegExp(r'\s+'))) {
        final painter = TextPainter(
          text: TextSpan(text: word, style: base),
          textScaler: MediaQuery.textScalerOf(context),
          textDirection: Directionality.of(context),
          maxLines: 1,
        )..layout();
        if (painter.width > widest) widest = painter.width;
        painter.dispose();
      }
      final fit = box.maxWidth.isFinite && widest > box.maxWidth
          ? box.maxWidth / widest * .98
          : 1.0;
      return Text(
        text,
        maxLines: maxLines,
        textAlign: align,
        overflow: TextOverflow.ellipsis,
        style: style.copyWith(fontSize: (style.fontSize ?? 14) * fit),
      );
    },
  );
}
