import 'dart:convert';

import 'package:flare/ui/coach_question_bubble.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart';

AskUserQuestion question({bool multiple = false, bool text = false}) =>
    AskUserGate.check(
      jsonEncode({
        'question': '今天想先练习什么？',
        'mode': text ? 'text' : 'choice',
        if (!text) ...{
          'options': ['核心肩胛支撑控制基础训练', '💪🦵🤸🧘🏋🏃🚴🏊🚶🧗🤾🤼'],
          'multiple': multiple,
        },
      }),
    ).question!;

void main() {
  Future<void> show(
    WidgetTester tester,
    AskUserQuestion q,
    ValueChanged<String> onAnswer, {
    bool enabled = true,
    bool dark = false,
  }) async {
    tester.view.physicalSize = const Size(320, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        theme: ThemeData(brightness: dark ? Brightness.dark : Brightness.light),
        home: MediaQuery(
          data: const MediaQueryData(
            size: Size(320, 900),
            textScaler: TextScaler.linear(2),
          ),
          child: Scaffold(
            body: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: CoachQuestionBubble(
                  question: q,
                  enabled: enabled,
                  onAnswer: onAnswer,
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  for (final dark in [false, true]) {
    for (final multiple in [false, true]) {
      testWidgets('SDK选项12码点320宽2倍字完整换行 dark=$dark multiple=$multiple', (
        tester,
      ) async {
        final answers = <String>[];
        final q = question(multiple: multiple);
        await show(tester, q, answers.add, dark: dark);
        for (final value in q.options) {
          final paragraph = tester.renderObject<RenderParagraph>(
            find.text(value),
          );
          expect(paragraph.didExceedMaxLines, isFalse);
          expect(paragraph.size.width, lessThan(250));
          expect(paragraph.size.height, greaterThan(40));
        }
        await tester.tap(find.byKey(const ValueKey('coach-option-0')));
        await tester.pumpAndSettle();
        if (multiple) {
          expect(answers, isEmpty);
          final submit = find.byKey(const ValueKey('coach-options-submit'));
          await tester.ensureVisible(submit);
          await tester.pumpAndSettle();
          await tester.tap(submit);
        }
        expect(answers, [q.options.first]);
        expect(tester.takeException(), isNull);
      });
    }
  }

  testWidgets('多选按SDK选项顺序提交；禁用后不丢选择且不能重发', (tester) async {
    final answers = <String>[];
    final q = question(multiple: true);
    await show(tester, q, answers.add);
    expect(
      tester
          .widget<TextButton>(
            find.byKey(const ValueKey('coach-options-submit')),
          )
          .onPressed,
      isNull,
    );
    await tester.tap(find.byKey(const ValueKey('coach-option-1')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('coach-option-0')));
    await tester.pumpAndSettle();
    final submit = find.byKey(const ValueKey('coach-options-submit'));
    await tester.ensureVisible(submit);
    await tester.pumpAndSettle();
    await tester.tap(submit);
    expect(answers, [q.options.join('、')]);
    await show(tester, q, answers.add, enabled: false);
    expect(tester.widget<TextButton>(submit).onPressed, isNull);
    for (final chip in tester.widgetList<FilterChip>(find.byType(FilterChip))) {
      expect(chip.selected, isTrue);
      expect(chip.onSelected, isNull);
    }
    await show(tester, q, answers.add);
    expect(tester.widget<TextButton>(submit).onPressed, isNotNull);
    expect(tester.takeException(), isNull);
  });

  testWidgets('文字提问只显示问题和输入提示；单选禁用不发送', (tester) async {
    final answers = <String>[];
    await show(tester, question(text: true), answers.add);
    expect(find.text('在下方输入你的回答'), findsOneWidget);
    expect(find.byType(ActionChip), findsNothing);
    await show(tester, question(), answers.add, enabled: false);
    for (final chip in tester.widgetList<ActionChip>(find.byType(ActionChip))) {
      expect(chip.onPressed, isNull);
    }
    expect(answers, isEmpty);
  });
}
