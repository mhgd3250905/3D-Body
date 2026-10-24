import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;

/// Maps an awaited coach-gated question. All answer controls live in the SDK.
cui.CoachQuestionData coachQuestionData(
  uc.AskUserQuestion question, {
  required String id,
  bool answered = false,
  List<String> answeredChoices = const [],
}) => cui.CoachQuestionData(
  id: id,
  question: question.question,
  mode: question.mode == uc.AskUserMode.text
      ? cui.CoachQuestionMode.text
      : cui.CoachQuestionMode.choice,
  options: question.options,
  multiple: question.multiple,
  answered: answered,
  answeredChoices: answeredChoices,
);
