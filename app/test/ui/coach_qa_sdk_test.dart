import 'dart:async';
import 'dart:convert';

import 'package:flare/coach/flare_coach_chat.dart';
import 'package:flare/coach/flare_coach_chat_storage.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_coach_chat/ugk_coach_chat.dart';

import '../domain/fixtures.dart';

class _Storage implements LocalStateStorage {
  final values = <String, String>{
    FlareCoachChatPreferenceStore.storageKey: jsonEncode({
      'safetyAccepted': true,
    }),
  };

  @override
  Future<String?> read(String key) async => values[key];
  @override
  Future<void> write(String key, String value) async => values[key] = value;
}

typedef _ToolReply =
    (String, Map<String, Object?>) Function(int count, String context);

class _Model implements coach.LlmClient {
  _Model(this.reply);
  final _ToolReply reply;
  final requests = <coach.LlmRequest>[];
  final counts = <String, int>{};
  final replies = <Map<String, Object?>>[];

  @override
  String get model => 'fake-qa-sdk';
  @override
  coach.Pricing? get pricing => null;

  @override
  Future<coach.LlmResponse> complete(
    coach.LlmRequest request, {
    coach.CancelToken? cancel,
  }) async {
    requests.add(request);
    final (tool, arguments) = reply(
      requests.length,
      request.messages.last.content,
    );
    final count = counts[tool] = (counts[tool] ?? 0) + 1;
    replies.add({'tool': tool, 'arguments': arguments});
    return coach.LlmResponse(
      content: '',
      model: model,
      toolCalls: [
        coach.LlmToolCall(
          id: '$tool-$count',
          name: tool,
          arguments: jsonEncode(arguments),
        ),
      ],
    );
  }
}

// The fake selects only IDs the SDK actually returned (search results). It
// never injects a separate catalogue or bypasses production scope/admission.
List<String> _candidateIds(String context) => RegExp(
  r'^([A-Za-z0-9_-]+) \|',
  multiLine: true,
).allMatches(context).map((match) => match.group(1)!).toList();

class _Harness {
  _Harness(this.host, this.controller, this.store);
  final FlareCoachChat host;
  final CoachChatController controller;
  final LearningStore store;

  static Future<_Harness> open(WidgetTester tester, _Model model) async {
    final sharedBefore = FlareShared.current;
    final harness = (await tester.runAsync(() async {
      FlareShared.current = await FlareShared.load().timeout(
        const Duration(seconds: 15),
        onTimeout: () =>
            throw StateError('QA fixture: shared catalogue timed out'),
      );
      final storage = _Storage();
      final store = LearningStore(
        catalog: loadCatalogFixture(),
        storage: storage,
      );
      await store.initialize().timeout(const Duration(seconds: 15));
      await store.acknowledgeSafety().timeout(const Duration(seconds: 15));
      final host = FlareCoachChat(
        store: store,
        storage: storage,
        gateway: CoachGatewayBinding.shared(model),
        replyDelay: Duration.zero,
      );
      final controller = await host
          .load(
            actions: CoachChatHostActions(
              onStartTraining: (_, _) async => null,
              onOpenAction: (_, _) async {},
              onOpenLibrary: (_, _) async {},
              onOpenSavedPlans: (_) async {},
              onOpenCustomPlan: (_) async {},
              onOpenSettings: (_) async {},
            ),
          )
          .timeout(
            const Duration(seconds: 15),
            onTimeout: () =>
                throw StateError('QA fixture: FlareCoachChat.load timed out'),
          );
      return _Harness(host, controller, store);
    }))!;
    addTearDown(() async {
      await tester.pumpWidget(const SizedBox());
      var closed = false;
      Object? closeError;
      unawaited(
        harness.host.close().then(
          (_) => closed = true,
          onError: (Object error, StackTrace _) {
            closeError = error;
            closed = true;
          },
        ),
      );
      for (var attempt = 0; attempt < 20 && !closed; attempt++) {
        await _pump(tester);
      }
      harness.store.dispose();
      FlareShared.current = sharedBefore;
      expect(
        closed,
        isTrue,
        reason: 'SDK QA fixture close must finish while pumped',
      );
      expect(closeError, isNull, reason: 'SDK QA fixture close failed');
      harness.controller.dispose();
    });
    return harness;
  }

  Future<void> mount(WidgetTester tester) async {
    tester.view.physicalSize = const Size(430, 1200);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(),
        home: CoachChatPage(controller: controller),
      ),
    );
    await _pump(tester);
  }
}

Future<void> _pump(WidgetTester tester) async {
  await tester.runAsync(
    () => Future<void>.delayed(const Duration(milliseconds: 1)),
  );
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 900));
  await tester.pump();
}

Future<void> _send(WidgetTester tester, String text) async {
  await tester.enterText(find.byKey(const ValueKey('chat-input')), text);
  await tester.pump();
  await tester.tap(find.byKey(const ValueKey('chat-send')));
  await _pump(tester);
}

Future<void> _waitFor(
  WidgetTester tester,
  bool Function() ready,
  String stage, {
  String Function()? diagnostics,
}) async {
  for (var attempt = 0; attempt < 20; attempt++) {
    await _pump(tester);
    if (ready()) return;
  }
  fail(
    'SDK QA page did not finish: $stage'
    '${diagnostics == null ? '' : '\n${diagnostics()}'}',
  );
}

String _errorDescription(Object? error) => error is StateError
    ? '${error.runtimeType}: ${error.message}'
    : '${error?.runtimeType}: $error';

String _diagnostics(CoachChatController controller, _Model model) =>
    jsonEncode({
      'modelToolCounts': model.counts,
      'modelRequestTools': [
        for (final request in model.requests)
          request.tools.map((tool) => tool.name).toList(),
      ],
      'fakeReplies': model.replies,
      'typing': controller.typing,
      'controllerError': _errorDescription(controller.error),
      'lastResultStatus': controller.lastResult?.status.name,
      'lastResultError': _errorDescription(controller.lastResult?.error),
      'lastResultIssues': [
        for (final issue in controller.lastResult?.issues ?? []) '$issue',
      ],
      'lastQaReplyKind': controller.lastQaReply?.kind,
      'lastQaReplyIssues': controller.lastQaReply?.issues,
    });

void main() {
  testWidgets('Flare SDK QA page submits single/multiple choices once', (
    tester,
  ) async {
    final model = _Model((count, context) {
      return switch (count) {
        1 => (
          'ask_user',
          {
            'step': 'place',
            'question': '你想在哪里练？',
            'options': ['居家', '健身房', '办公室', '直接推荐'],
          },
        ),
        2 => ('set_conditions', {'language': 'zh', 'place': 'home'}),
        3 => (
          'ask_user',
          {
            'step': 'equipment',
            'question': '手边有哪些器械？',
            'options': ['瑜伽垫', '椅子', '哑铃', '弹力带', '徒手', '直接推荐'],
            'multi': true,
          },
        ),
        4 => (
          'set_conditions',
          {
            'equipment_known': true,
            'equipment': ['mat', 'chair'],
          },
        ),
        5 => ('search_actions', {'types': ['static-stretch']}),
        6 => (
          'show_actions',
          {
            'text': '先试试这几个动作。',
            'items': [
              for (final id in _candidateIds(context).take(3))
                {'id': id, 'why': '适合当前条件'},
            ],
            'chips': ['换场地'],
          },
        ),
        _ => throw StateError('Unexpected fake call $count'),
      };
    });
    final harness = await _Harness.open(tester, model);
    final controller = harness.controller;
    expect(controller.profile.agentMode, CoachChatAgentMode.qaV2);
    expect(controller.qaAgent.index.taggedCount, greaterThan(200));
    expect(
      controller.qaAgent.index.all.every(
        (action) => FlareShared.current!.allowedActionIds.contains(action.id),
      ),
      isTrue,
    );
    await harness.mount(tester);
    await _send(tester, '想练几个动作');
    await _waitFor(
      tester,
      () => !controller.typing && controller.messages.last.question != null,
      'place question',
    );
    final place = controller.messages.last;
    expect(place.question!.multiple, isFalse);
    await tester.tap(find.byKey(ValueKey('question-option-${place.id}-0')));
    await _waitFor(
      tester,
      () =>
          !controller.typing &&
          controller.messages.last.id != place.id &&
          controller.messages.last.question != null,
      'equipment question',
    );
    final equipment = controller.messages.last;
    expect(equipment.question!.multiple, isTrue);
    expect(controller.canAnswerQuestion(place), isFalse);
    expect(model.requests, hasLength(3));

    for (final option in [0, 1]) {
      final finder = find.byKey(
        ValueKey('question-option-${equipment.id}-$option'),
      );
      await tester.ensureVisible(finder);
      await tester.tap(finder);
      await _pump(tester);
    }
    expect(model.requests, hasLength(3), reason: 'Multi-select awaits Submit');
    final submit = find.byKey(ValueKey('question-submit-${equipment.id}'));
    await tester.ensureVisible(submit);
    await tester.tap(submit);
    await _waitFor(
      tester,
      () =>
          !controller.typing &&
          controller.lastQaReply?.cards.isNotEmpty == true,
      'recommendation',
    );
    expect(model.requests, hasLength(6));
    expect(
      controller.messages
          .where((message) => message.isUser)
          .map((message) => message.text),
      ['想练几个动作', '居家', '瑜伽垫、椅子'],
    );
    expect(model.requests[3].messages.last.content, contains('瑜伽垫、椅子'));
    expect(controller.canAnswerQuestion(equipment), isFalse);
    expect(find.byKey(const ValueKey('recommend-number-1')), findsOneWidget);
    expect(find.byKey(const ValueKey('recommend-number-2')), findsOneWidget);
    expect(find.byKey(const ValueKey('recommend-number-3')), findsOneWidget);
    expect(find.byKey(const ValueKey('recommend-number-4')), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Flare SDK plan numbers include warmup/main/cooldown order', (
    tester,
  ) async {
    var main = <String>[];
    var warm = <String>[];
    final model = _Model((count, context) {
      return switch (count) {
        1 => (
          'set_conditions',
          {'language': 'zh', 'place': 'gym', 'place_word': '健身房', 'minutes': 15},
        ),
        2 => ('search_actions', {'types': ['strength']}),
        3 => () {
          main = _candidateIds(context).take(3).toList();
          return ('search_actions', <String, Object?>{'roles': ['warmup'], 'limit': 3});
        }(),
        4 => () {
          warm = _candidateIds(context).take(1).toList();
          return ('search_actions', <String, Object?>{'roles': ['cooldown'], 'limit': 3});
        }(),
        5 => (
          'build_plan',
          {
            'mode': 'new',
            'text': '这套按十五分钟安排。',
            'title': '基础力量训练',
            'minutes': 15,
            'warmup_ids': warm,
            'main_ids': main,
            'cooldown_ids': _candidateIds(context).take(1).toList(),
            'block_names': {'warmup': '热身', 'main': '主训练', 'cooldown': '收操'},
          },
        ),
        _ => throw StateError('Unexpected fake call $count'),
      };
    });
    final harness = await _Harness.open(tester, model);
    await harness.mount(tester);
    await _send(tester, '在健身房练十五分钟力量');
    final controller = harness.controller;
    await _waitFor(
      tester,
      () =>
          !controller.typing &&
          controller.messages.any((message) => message.plan != null),
      'plan',
      diagnostics: () => _diagnostics(controller, model),
    );
    final message = controller.messages.lastWhere(
      (message) => message.plan != null,
    );
    final plan = message.plan!;
    expect(
      plan.blocks.map((block) => block.type),
      containsAllInOrder([
        coach.BlockType.warmup,
        coach.BlockType.main,
        coach.BlockType.cooldown,
      ]),
    );
    final ordered = [
      for (final block in plan.blocks)
        for (final item in block.items) item.exerciseId,
    ];
    expect(controller.qaAgent.state.lastPlan!.orderedIds, ordered);
    expect(message.qaV2, isTrue);

    final expand = find.byKey(ValueKey('plan-expand-${plan.id}'));
    await tester.ensureVisible(expand);
    await tester.tap(expand);
    await _pump(tester);
    for (var index = 0; index < ordered.length; index++) {
      final number = index + 1;
      final title = find.byKey(ValueKey('plan-name-$number'));
      expect(
        tester.widget<Text>(title).data,
        controller.catalog[ordered[index]]!.name.of('zh'),
      );
      final row = find
          .ancestor(
            of: find.byKey(ValueKey('plan-row-thumb-$number')),
            matching: find.byType(Row),
          )
          .first;
      expect(
        find.descendant(of: row, matching: find.text('$number')),
        findsOneWidget,
      );
    }
    expect(tester.takeException(), isNull);
  });
}
