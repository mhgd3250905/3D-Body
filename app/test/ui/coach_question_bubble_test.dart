import 'dart:async';
import 'dart:convert';
import 'package:flare/ui/coach_question_bubble.dart';
import 'package:flare/ui/coach_ui_theme.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;

uc.AskUserQuestion question({bool multiple = false, bool text = false}) =>
    uc.AskUserGate.check(
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
    uc.AskUserQuestion q,
    Future<void> Function(String) onText,
    Future<void> Function(List<String>) onChoices, {
    bool enabled = true,
    bool dark = false,
    bool answered = false,
    List<String> answeredChoices = const [],
  }) async {
    tester.view.physicalSize = const Size(320, 1100);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(dark ? Brightness.dark : Brightness.light),
        home: Builder(
          builder: (context) => MediaQuery(
            data: const MediaQueryData(
              size: Size(320, 1100),
              textScaler: TextScaler.linear(2),
              disableAnimations: true,
            ),
            child: Scaffold(
              body: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: cui.CoachUiTheme(
                    style: flareCoachUiStyle(context),
                    child: cui.CoachQuestionBubble(
                      question: coachQuestionData(
                        q,
                        id: 'q1',
                        answered: answered,
                        answeredChoices: answeredChoices,
                      ),
                      enabled: enabled,
                      onTextAnswer: onText,
                      onChoiceAnswer: onChoices,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  Finder option(int i) => find.byKey(ValueKey('question-option-q1-$i'));
  final submit = find.byKey(const ValueKey('question-submit-q1'));
  for (final dark in [false, true]) {
    for (final multiple in [false, true]) {
      testWidgets('SDK问题选项320宽2倍字完整换行 dark=$dark multiple=$multiple', (
        tester,
      ) async {
        final answers = <List<String>>[];
        final q = question(multiple: multiple);
        await show(
          tester,
          q,
          (_) async {},
          (v) async => answers.add(v),
          dark: dark,
        );
        for (final value in q.options) {
          final p = tester.renderObject<RenderParagraph>(find.text(value));
          expect(p.didExceedMaxLines, isFalse);
          expect(p.size.height, greaterThan(30));
        }
        await tester.tap(option(0));
        await tester.pumpAndSettle();
        if (multiple) {
          expect(answers, isEmpty);
          await tester.ensureVisible(submit);
          await tester.tap(submit);
          await tester.pumpAndSettle();
        }
        expect(answers, [
          [q.options.first],
        ]);
        expect(tester.takeException(), isNull);
      });
    }
  }
  testWidgets('SDK多选保留原字符串与顺序，历史禁用不能重发', (tester) async {
    final answers = <List<String>>[];
    final q = question(multiple: true);
    await show(tester, q, (_) async {}, (v) async => answers.add(v));
    expect(tester.widget<cui.CoachTextAction>(submit).onPressed, isNull);
    await tester.tap(option(1));
    await tester.pumpAndSettle();
    await tester.tap(option(0));
    await tester.pumpAndSettle();
    await tester.ensureVisible(submit);
    await tester.tap(submit);
    await tester.pumpAndSettle();
    expect(answers, [q.options]);
    await show(
      tester,
      q,
      (_) async {},
      (v) async => answers.add(v),
      enabled: false,
      answered: true,
      answeredChoices: q.options,
    );
    for (final pill in tester.widgetList<cui.CoachOptionPill>(
      find.byType(cui.CoachOptionPill),
    )) {
      expect(pill.chosen, isTrue);
      expect(pill.enabled, isFalse);
    }
    expect(submit, findsNothing);
    expect(answers, hasLength(1));
  });
  testWidgets('SDK文字问题使用独立回答回调，异步提交期间不能重复提交', (tester) async {
    final answers = <String>[];
    final gate = Completer<void>();
    await show(tester, question(text: true), (v) async {
      answers.add(v);
      await gate.future;
    }, (_) async {});
    await tester.enterText(
      find.byKey(const ValueKey('question-input-q1')),
      '  今天20分钟  ',
    );
    await tester.pump();
    await tester.ensureVisible(submit);
    await tester.tap(submit);
    await tester.pump();
    expect(answers, ['今天20分钟']);
    expect(tester.widget<cui.CoachTextAction>(submit).onPressed, isNull);
    expect(
      tester
          .widget<TextField>(find.byKey(const ValueKey('question-input-q1')))
          .enabled,
      isFalse,
    );
    gate.complete();
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });
}
