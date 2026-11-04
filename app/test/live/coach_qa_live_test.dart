// Opt-in real-provider check. The ordinary suite never sends model requests.
// See app/tool/qa-live/README.md for invocation and transcript boundaries.
import 'dart:convert';
import 'dart:io';

import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/flare_coach_chat.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_coach/ugk_coach_qa_v2.dart';
import 'package:ugk_coach_chat/ugk_coach_chat.dart';

const _enabled = bool.fromEnvironment('FLARE_QA_LIVE');
const _outputPath = String.fromEnvironment('FLARE_QA_OUTPUT');

const _scenarios = <(String, List<String>)>[
  (
    'support-arm-choices-and-second-card',
    ['推荐几个托马斯支撑臂的动作。', '居家', '瑜伽垫、弹力带', '换第2个动作，其他动作不变。'],
  ),
  (
    'core-plan-first-card-and-duration',
    ['在家徒手，帮我排一套10分钟的核心训练。', '换第1个动作，其他动作不变。', '改成15分钟，动作不变。'],
  ),
  (
    'office-standing-legs-and-place',
    ['在办公室练腿，不躺地，不用哑铃，推荐几个动作。', '太难了，简单一点。', '换场地'],
  ),
];

class _MemoryStorage implements LocalStateStorage {
  final _values = <String, String>{};

  @override
  Future<String?> read(String key) async => _values[key];

  @override
  Future<void> write(String key, String value) async => _values[key] = value;
}

// Widget-test bindings disable real HTTP by default. This explicit opt-in
// scope uses dart:io's original implementation without logging requests.
class _RealHttpOverrides extends HttpOverrides {}

CoachChatHostActions _actions() => CoachChatHostActions(
  onStartTraining: (_, _) async => null,
  onOpenAction: (_, _) async {},
  onOpenLibrary: (_, _) async {},
  onOpenSavedPlans: (_) async {},
  onOpenCustomPlan: (_) async {},
  onOpenSettings: (_) async {},
);

Future<void> _completeSdkSafety(
  CoachChatController controller,
  Map<String, Object?> scenario,
) async {
  final answers = <Map<String, String>>[];
  scenario['simulatedSdkSafetyAnswers'] = answers;
  // These are synthetic healthy-adult fixture answers, not user health data.
  // Exercise the SDK's own controls rather than writing its preference flags.
  for (var step = 0; controller.inSafetyCheck && step < 20; step++) {
    final message = controller.messages.lastWhere(
      (message) =>
          controller.isActive(message) &&
          message.options.any((option) => option.value.startsWith('@safety:')),
    );
    final index = message.options.indexWhere(
      (option) => option.value == '@safety:ack' || option.value == '@safety:no',
    );
    expect(index, greaterThanOrEqualTo(0));
    answers.add({
      'question': message.text,
      'answer': message.options[index].label,
    });
    await controller.choose(message, index);
  }
  expect(controller.inSafetyCheck, isFalse);
  expect(controller.preferences.trainingAllowed, isTrue);
}

Future<coach.CoachTurnResult?> _answerSdkChoices(
  CoachChatController controller,
  ChatMessage pending,
  List<String> requested,
  String scriptPrompt,
  Map<String, Object?> turn,
  List<String> observations,
) async {
  final options = pending.question!.options;
  final selected = <String>[];
  for (final choice in requested) {
    // Test-fixture matching only: use the model's displayed option verbatim.
    // Production understanding remains entirely inside the SDK/model.
    final option = options
        .where((option) => option.contains(choice))
        .firstOrNull;
    if (option == null) {
      observations.add(
        'Requested fixture option "$choice" was not offered; '
        'answered the pending question as text through the SDK.',
      );
      turn['answerApi'] = 'CoachChatController.answerQuestion';
      return controller.answerQuestion(pending, scriptPrompt);
    }
    selected.add(option);
  }
  turn['scriptPrompt'] = scriptPrompt;
  turn['user'] = selected.join('、');
  turn['selectedOptions'] = selected;
  turn['answerApi'] = 'CoachChatController.answerChoices';
  return controller.answerChoices(pending, selected);
}

List<Map<String, Object?>> _numberedCards(
  CoachQaReply reply,
  FlareShared shared,
) {
  final cards = {for (final card in reply.cards) card.id: card};
  final ids = reply.plan == null
      ? [for (final card in reply.cards) card.id]
      : reply.planOrderedIds;
  return [
    for (var i = 0; i < ids.length; i++)
      {
        'number': i + 1,
        'id': ids[i],
        'name': cards[ids[i]]?.name ?? shared.nameOf(ids[i], reply.language),
        'why': cards[ids[i]]?.why,
      },
  ];
}

Map<String, Object?> _replyJson(CoachQaReply reply, FlareShared shared) => {
  // SDK toJson contains only the delivered response and step timings. It
  // excludes its internal form, tool trace and provider reasoning content.
  ...reply.toJson(),
  'numberedCards': _numberedCards(reply, shared),
  'planOrderedIds': reply.planOrderedIds,
};

Future<void> _writeTranscript(
  Directory output,
  Map<String, Object?> report,
) async {
  await output.create(recursive: true);
  const encoder = JsonEncoder.withIndent('  ');
  await File(
    '${output.path}/dialogues.json',
  ).writeAsString('${encoder.convert(report)}\n', flush: true);
  final text = StringBuffer()
    ..writeln('# Flare Coach QA v2 real-model conversations')
    ..writeln()
    ..writeln('Model: deepseek-v4.1-flash; thinking enabled; effort max.')
    ..writeln('All user and assistant text below is verbatim. No credentials,')
    ..writeln('headers or provider reasoning / chain of thought are saved.')
    ..writeln('These checks do not establish device or action-tag acceptance.')
    ..writeln();
  for (final scenario in report['scenarios'] as List<Map<String, Object?>>) {
    text
      ..writeln('## ${scenario['id']}')
      ..writeln();
    for (final turn in scenario['turns'] as List<Map<String, Object?>>) {
      text
        ..writeln('### Turn ${turn['number']}')
        ..writeln()
        ..writeln('User:')
        ..writeln(turn['user'])
        ..writeln()
        ..writeln('Assistant:');
      if (turn['reply'] case final Map<String, Object?> reply) {
        text
          ..writeln(reply['text'])
          ..writeln();
        if (reply['assumption'] case final String assumption) {
          text.writeln('Assumption: $assumption');
        }
        if (reply['question'] case final question?) {
          text.writeln('Question and options: ${jsonEncode(question)}');
        }
        for (final card
            in reply['numberedCards'] as List<Map<String, Object?>>) {
          text.writeln(
            '${card['number']}. ${card['name']} [${card['id']}]'
            '${card['why'] == null ? '' : ' — ${card['why']}'}',
          );
        }
        text
          ..writeln('Chips: ${jsonEncode(reply['chips'])}')
          ..writeln('Plan seconds: ${reply['planSeconds']}')
          ..writeln('Steps: ${jsonEncode(reply['steps'])}')
          ..writeln('Observed checks: ${jsonEncode(turn['observations'])}');
      } else {
        text.writeln('No delivered reply: ${turn['failureType']}');
      }
      text.writeln();
    }
  }
  await File(
    '${output.path}/dialogues.md',
  ).writeAsString(text.toString(), flush: true);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test(
    'CoachQaAgent real model: three fixed conversations (opt-in)',
    () async {
      expect(CoachConfig.fromEnvironment.configured, isTrue);
      expect(CoachConfig.fromEnvironment.model, 'deepseek-v4.1-flash');
      expect(RegExp(r'^[Ee]:[\\/]').hasMatch(_outputPath), isTrue);
      final output = Directory(_outputPath);
      final scenarios = <Map<String, Object?>>[];
      final failures = <String>[];
      final report = <String, Object?>{
        'startedAtUtc': DateTime.now().toUtc().toIso8601String(),
        'model': 'deepseek-v4.1-flash',
        'thinking': {'type': 'enabled'},
        'reasoningEffort': 'max',
        'sdkCommit': 'f7b8a8e4853e9f50fc93888e1768ec1dbc75b588',
        'tagCommit': '5d17c24af859d905dbbdee4b1d623b99881ac618',
        'tagStatus': 'ai-draft; not human reviewed',
        'scenarios': scenarios,
        'failures': failures,
      };
      await HttpOverrides.runWithHttpOverrides(() async {
        final shared = await FlareShared.load();
        FlareShared.current = shared;
        for (
          var scenarioIndex = 0;
          scenarioIndex < _scenarios.length;
          scenarioIndex++
        ) {
          final (id, prompts) = _scenarios[scenarioIndex];
          final storage = _MemoryStorage();
          final store = LearningStore(
            catalog: await Catalog.load(),
            storage: storage,
          );
          await store.initialize();
          await store.acknowledgeSafety();
          final host = FlareCoachChat(store: store, storage: storage);
          final turns = <Map<String, Object?>>[];
          final scenario = <String, Object?>{'id': id, 'turns': turns};
          scenarios.add(scenario);
          try {
            final controller = await host.load(actions: _actions());
            await _completeSdkSafety(controller, scenario);
            expect(controller.profile.agentMode, CoachChatAgentMode.qaV2);
            expect(controller.qaAgent.thinking, {
              'thinking': {'type': 'enabled'},
              'reasoning_effort': 'max',
            });
            expect(
              controller.catalog.drills.every(
                (drill) => shared.allowedActionIds.contains(drill.id),
              ),
              isTrue,
            );
            scenario['tagCoverage'] = controller.qaAgent.tagCoverage;
            scenario['thinking'] = controller.qaAgent.thinking;
            for (var i = 0; i < prompts.length; i++) {
              // A fixed script: model replies never cause extra paid turns.
              // ignore: avoid_print
              print(
                'LIVE QA ${scenarioIndex + 1}/3 turn ${i + 1}/${prompts.length}',
              );
              final turn = <String, Object?>{
                'number': i + 1,
                'user': prompts[i],
              };
              turns.add(turn);
              await _send(
                controller,
                prompts[i],
                shared,
                turn,
                failures,
                id,
                i,
              );
              await _writeTranscript(output, report);
            }
          } finally {
            await host.close();
            store.dispose();
          }
        }
      }, _RealHttpOverrides());
      report['finishedAtUtc'] = DateTime.now().toUtc().toIso8601String();
      await _writeTranscript(output, report);
      expect(failures, isEmpty, reason: 'See saved verbatim conversations');
    },
    skip: !_enabled,
    timeout: const Timeout(Duration(minutes: 30)),
  );
}

Future<void> _send(
  CoachChatController controller,
  String prompt,
  FlareShared shared,
  Map<String, Object?> turn,
  List<String> failures,
  String scenarioId,
  int index,
) async {
  final observations = <String>[];
  turn['observations'] = observations;
  try {
    final previous = controller.lastQaReply;
    final pending = controller.messages
        .where(
          (message) =>
              message.qaV2 &&
              message.question != null &&
              !message.questionAnswered &&
              controller.canAnswerQuestion(message),
        )
        .lastOrNull;
    final List<String>? requestedChoices =
        scenarioId == 'support-arm-choices-and-second-card' && index == 1
        ? const ['居家']
        : scenarioId == 'support-arm-choices-and-second-card' && index == 2
        ? const ['瑜伽垫', '弹力带']
        : null;
    final result = requestedChoices != null && pending != null
        ? await _answerSdkChoices(
            controller,
            pending,
            requestedChoices,
            prompt,
            turn,
            observations,
          )
        : await controller.send(prompt);
    turn['resultStatus'] = result?.status.name;
    final reply = controller.lastQaReply;
    if (reply == null || identical(reply, previous)) {
      turn['failureType'] = 'no new delivered QA reply';
      turn['appErrorType'] = controller.error?.runtimeType.toString();
      failures.add('$scenarioId turn ${index + 1}: no new QA reply');
      return;
    }
    final displayed = controller.messages
        .where((message) => message.qaV2 && !message.isUser)
        .lastOrNull;
    turn['displayedSdkText'] = displayed?.text;
    turn['reply'] = _replyJson(reply, shared);
    if (reply.kind == 'error') {
      failures.add('$scenarioId turn ${index + 1}: model error reply');
    }
    final shownIds = {
      ...reply.planOrderedIds,
      for (final card in reply.cards) card.id,
    };
    final outsideScope = shownIds.difference(shared.allowedActionIds);
    if (outsideScope.isNotEmpty) {
      failures.add('$scenarioId turn ${index + 1}: out-of-scope IDs');
      observations.add('Out-of-scope IDs: ${outsideScope.join(', ')}');
    }
    if (scenarioId == 'support-arm-choices-and-second-card') {
      if (index == 0) {
        observations.add(
          'Expected place single choice; actual askStep=${reply.askStep?.name}, '
          'multiple=${reply.question?.multiple}',
        );
      } else if (index == 1) {
        observations.add(
          'Expected equipment multiple choice; actual askStep=${reply.askStep?.name}, '
          'multiple=${reply.question?.multiple}',
        );
      } else if (index == 3) {
        _observeReplacement(previous, reply, 2, observations);
      }
    } else if (scenarioId == 'core-plan-first-card-and-duration') {
      observations.add(
        'Plan numbering includes warmup/cooldown; kind=${reply.kind}, '
        'planSeconds=${reply.planSeconds}, orderedItems=${reply.planOrderedIds.length}',
      );
      if (index == 1) _observeReplacement(previous, reply, 1, observations);
      if (index == 2 && previous != null) {
        observations.add(
          'Requested same actions at 15 minutes; sameOrderedIds='
          '${_ids(previous).join('|') == _ids(reply).join('|')}',
        );
      }
    }
  } catch (error) {
    // Only a class name is saved for transport exceptions, never request data.
    turn['failureType'] = error.runtimeType.toString();
    failures.add('$scenarioId turn ${index + 1}: ${error.runtimeType}');
  }
}

List<String> _ids(CoachQaReply reply) => reply.plan == null
    ? [for (final card in reply.cards) card.id]
    : reply.planOrderedIds;

void _observeReplacement(
  CoachQaReply? previous,
  CoachQaReply reply,
  int requested,
  List<String> observations,
) {
  if (previous == null) return;
  final before = _ids(previous), after = _ids(reply);
  final changed = <int>[
    for (var i = 0; i < before.length && i < after.length; i++)
      if (before[i] != after[i]) i + 1,
  ];
  observations.add(
    'Requested displayed card $requested; beforeCount=${before.length}, '
    'afterCount=${after.length}, changedPositions=$changed. '
    'No-change replies may correctly explain that no replacement is available.',
  );
}
