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
    Map<String, Object?> Function(String tool, String context, int count);

class _Model implements coach.LlmClient {
  _Model(this.reply);
  final _ToolReply reply;
  final requests = <coach.LlmRequest>[];
  final counts = <String, int>{};

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
    final tool = request.tools.single.name;
    final count = counts[tool] = (counts[tool] ?? 0) + 1;
    final context = request.messages
        .lastWhere((message) => message.role == coach.LlmRole.user)
        .content;
    return coach.LlmResponse(
      content: '',
      model: model,
      toolCalls: [
        coach.LlmToolCall(
          id: '$tool-$count',
          name: tool,
          arguments: jsonEncode(reply(tool, context, count)),
        ),
      ],
    );
  }
}

Map<String, Object?> _form({
  String intent = 'actions',
  String place = 'home',
  String next = 'answer',
  String status = 'none',
  bool equipmentKnown = true,
}) => {
  'language': 'zh',
  'intent': intent,
  'place': place,
  'equipment_known': equipmentKnown,
  'equipment': ['mat', 'chair'],
  'answer_status': status,
  'next': next,
};

// The fake selects only IDs actually supplied by the SDK candidate tool. It
// never injects a separate catalogue or bypasses production scope/admission.
List<String> _candidateIds(String context) {
  final candidates = context.split('[候选动作]').last.split('[用户这句话]').first;
  return RegExp(
    r'^([A-Za-z0-9_-]+) \|',
    multiLine: true,
  ).allMatches(candidates).map((match) => match.group(1)!).toList();
}

class _Harness {
  _Harness(this.host, this.controller, this.store);
  final FlareCoachChat host;
  final CoachChatController controller;
  final LearningStore store;

  static Future<_Harness> open(WidgetTester tester, _Model model) async {
    final sharedBefore = FlareShared.current;
    final harness = (await tester.runAsync(() async {
      FlareShared.current = await FlareShared.load();
      final storage = _Storage();
      final store = LearningStore(
        catalog: loadCatalogFixture(),
        storage: storage,
      );
      await store.initialize();
      await store.acknowledgeSafety();
      final host = FlareCoachChat(
        store: store,
        storage: storage,
        gateway: CoachGatewayBinding.shared(model),
        replyDelay: Duration.zero,
      );
      final controller = await host.load(
        actions: CoachChatHostActions(
          onStartTraining: (_, _) async => null,
          onOpenAction: (_, _) async {},
          onOpenLibrary: (_, _) async {},
          onOpenSavedPlans: (_) async {},
          onOpenCustomPlan: (_) async {},
          onOpenSettings: (_) async {},
        ),
      );
      return _Harness(host, controller, store);
    }))!;
    addTearDown(() async {
      await tester.pumpWidget(const SizedBox());
      await tester.runAsync(harness.host.close);
      harness.store.dispose();
      FlareShared.current = sharedBefore;
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

void main() {
  testWidgets('Flare SDK QA page submits single/multiple choices once', (
    tester,
  ) async {
    final model = _Model((tool, context, count) {
      if (tool == 'fill_form') {
        return switch (count) {
          1 => _form(
            place: 'unknown',
            equipmentKnown: false,
            next: 'ask_place',
          ),
          2 => _form(
            intent: 'answer_pending',
            equipmentKnown: false,
            status: 'answered',
            next: 'ask_equipment',
          ),
          _ => _form(intent: 'answer_pending', status: 'answered'),
        };
      }
      if (tool == 'ask_user') {
        return count == 1
            ? {
                'question': '你想在哪里练？',
                'options': ['居家', '健身房', '办公室', '直接推荐'],
              }
            : {
                'question': '手边有哪些器械？',
                'options': ['瑜伽垫', '椅子', '哑铃', '弹力带', '徒手', '直接推荐'],
              };
      }
      if (tool == 'respond') {
        final ids = _candidateIds(context);
        expect(ids.length, greaterThanOrEqualTo(2));
        return {
          'text': '先试试这两个动作。',
          'items': [
            for (final id in ids.take(2)) {'id': id, 'why': '适合当前条件'},
          ],
          'chips': ['换场地'],
        };
      }
      throw StateError('Unexpected fake tool $tool');
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
    final place = controller.messages.last;
    expect(place.question!.multiple, isFalse);
    await tester.tap(find.byKey(ValueKey('question-option-${place.id}-0')));
    await _pump(tester);
    final equipment = controller.messages.last;
    expect(equipment.question!.multiple, isTrue);
    expect(controller.canAnswerQuestion(place), isFalse);
    expect(model.requests, hasLength(4));

    for (final option in [0, 1]) {
      final finder = find.byKey(
        ValueKey('question-option-${equipment.id}-$option'),
      );
      await tester.ensureVisible(finder);
      await tester.tap(finder);
      await _pump(tester);
    }
    expect(model.requests, hasLength(4), reason: 'Multi-select awaits Submit');
    final submit = find.byKey(ValueKey('question-submit-${equipment.id}'));
    await tester.ensureVisible(submit);
    await tester.tap(submit);
    await _pump(tester);
    expect(model.requests, hasLength(6));
    expect(
      controller.messages
          .where((message) => message.isUser)
          .map((message) => message.text),
      ['想练几个动作', '居家', '瑜伽垫、椅子'],
    );
    expect(model.requests[4].messages.last.content, contains('瑜伽垫、椅子'));
    expect(controller.canAnswerQuestion(equipment), isFalse);
    expect(find.byKey(const ValueKey('recommend-number-1')), findsOneWidget);
    expect(find.byKey(const ValueKey('recommend-number-2')), findsOneWidget);
    expect(find.byKey(const ValueKey('recommend-number-3')), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Flare SDK plan numbers include warmup/main/cooldown order', (
    tester,
  ) async {
    final model = _Model((tool, context, _) {
      if (tool == 'fill_form') {
        return {
          ..._form(intent: 'plan', place: 'gym'),
          'minutes': 15,
          'types': ['strength'],
          'goals': ['strength'],
        };
      }
      if (tool == 'build_plan') {
        final ids = _candidateIds(context);
        expect(ids.length, greaterThanOrEqualTo(3));
        return {
          'text': '这套按十五分钟安排。',
          'title': '基础力量训练',
          'minutes': 15,
          'main_ids': ids.take(3).toList(),
          'block_names': {'warmup': '热身', 'main': '主训练', 'cooldown': '收操'},
        };
      }
      if (tool == 'rewrite') return {'text': '这套按你的条件安排。'};
      throw StateError('Unexpected fake tool $tool');
    });
    final harness = await _Harness.open(tester, model);
    await harness.mount(tester);
    await _send(tester, '在健身房练十五分钟力量');
    final controller = harness.controller;
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
