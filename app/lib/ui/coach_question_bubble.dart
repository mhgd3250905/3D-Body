import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart';

/// SDK ask_user presentation, independent of FlareLab routes, stores and theme.
/// Pass only a question from an awaited CoachAgent.send() result. Keep enabled
/// false while sending; callbacks send plain text through the same Agent.
/// SmartFit can reuse this file with its own semantic colors and labels.
class CoachQuestionBubble extends StatefulWidget {
  const CoachQuestionBubble({
    super.key,
    required this.question,
    required this.enabled,
    required this.onAnswer,
    this.backgroundColor,
    this.foregroundColor,
    this.secondaryColor,
    this.optionColor,
    this.accentColor,
    this.textHint = '在下方输入你的回答',
    this.choiceHint = '也可以在下方直接输入',
    this.multipleHint = '可以多选',
    this.confirmLabel = '确认选择',
    this.optionKeyPrefix = 'coach-option',
    this.confirmKey = const ValueKey('coach-options-submit'),
  });

  final AskUserQuestion question;
  final bool enabled;
  final ValueChanged<String> onAnswer;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final Color? secondaryColor;
  final Color? optionColor;
  final Color? accentColor;
  final String textHint;
  final String choiceHint;
  final String multipleHint;
  final String confirmLabel;
  final String optionKeyPrefix;
  final Key? confirmKey;

  @override
  State<CoachQuestionBubble> createState() => _CoachQuestionBubbleState();
}

class _CoachQuestionBubbleState extends State<CoachQuestionBubble>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;
  final _selected = <String>{};

  @override
  void didUpdateWidget(covariant CoachQuestionBubble oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!identical(oldWidget.question, widget.question)) _selected.clear();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final colors = Theme.of(context).colorScheme;
    final question = widget.question;
    final fg = widget.foregroundColor ?? colors.onSurface;
    final secondary = widget.secondaryColor ?? colors.onSurfaceVariant;
    final accent = widget.accentColor ?? colors.primary;
    final option = widget.optionColor ?? colors.surface;
    return Align(
      alignment: Alignment.centerLeft,
      child: FractionallySizedBox(
        widthFactor: .86,
        alignment: Alignment.centerLeft,
        child: Container(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 13),
          decoration: BoxDecoration(
            color: widget.backgroundColor ?? colors.surfaceContainerLow,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(22),
              topRight: Radius.circular(22),
              bottomLeft: Radius.circular(6),
              bottomRight: Radius.circular(22),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                question.question,
                style: TextStyle(color: fg, fontSize: 16, height: 1.5),
              ),
              if (question.mode == AskUserMode.choice) ...[
                const SizedBox(height: 10),
                if (question.multiple) ...[
                  Text(
                    widget.multipleHint,
                    style: TextStyle(color: secondary, fontSize: 12),
                  ),
                  const SizedBox(height: 6),
                ],
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final (i, value) in question.options.indexed)
                      if (question.multiple)
                        FilterChip(
                          key: ValueKey('${widget.optionKeyPrefix}-$i'),
                          label: Text(
                            value,
                            softWrap: true,
                            maxLines: 6,
                            overflow: TextOverflow.visible,
                          ),
                          selected: _selected.contains(value),
                          backgroundColor: option,
                          selectedColor: accent.withValues(alpha: .15),
                          checkmarkColor: accent,
                          side: BorderSide.none,
                          shape: const StadiumBorder(),
                          onSelected: !widget.enabled
                              ? null
                              : (selected) => setState(() {
                                  selected
                                      ? _selected.add(value)
                                      : _selected.remove(value);
                                }),
                        )
                      else
                        ActionChip(
                          key: ValueKey('${widget.optionKeyPrefix}-$i'),
                          label: Text(
                            value,
                            softWrap: true,
                            maxLines: 6,
                            overflow: TextOverflow.visible,
                          ),
                          color: WidgetStatePropertyAll(
                            _selected.contains(value)
                                ? accent.withValues(alpha: .15)
                                : option,
                          ),
                          labelStyle: TextStyle(
                            color: _selected.contains(value) ? accent : fg,
                          ),
                          side: BorderSide.none,
                          shape: const StadiumBorder(),
                          onPressed: !widget.enabled
                              ? null
                              : () {
                                  setState(() {
                                    _selected
                                      ..clear()
                                      ..add(value);
                                  });
                                  widget.onAnswer(value);
                                },
                        ),
                  ],
                ),
                if (question.multiple)
                  TextButton(
                    key: widget.confirmKey,
                    onPressed: !widget.enabled || _selected.isEmpty
                        ? null
                        : () => widget.onAnswer(
                            question.options
                                .where(_selected.contains)
                                .join('、'),
                          ),
                    child: Text(widget.confirmLabel),
                  ),
              ],
              const SizedBox(height: 8),
              Text(
                question.mode == AskUserMode.text
                    ? widget.textHint
                    : widget.choiceHint,
                style: TextStyle(color: secondary, fontSize: 12, height: 1.4),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
