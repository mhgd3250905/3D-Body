import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/coach_service.dart';
import 'package:flare/coach/plan_mapping.dart';
import 'package:flare/coach/template_fallback.dart';
import 'package:flare/coach/usage_store.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/ai_coach_page.dart';
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';
import 'coach_agent_fixtures.dart';
import 'flow_regressions_test.dart' as helpers;

/// 测试里同步读资产文件（widget 测试的假时钟里异步 IO 不会完成）。
Future<String> readAsset(String path) async => File(path).readAsStringSync();

/// 一份合格的 flarelab 计划：剂量单位、单侧与目录一致，全部可在家做。
Map<String, Object?> validPlanEnvelope({String text = '按你说的在家 20 分钟练支撑。'}) {
  Map<String, Object?> item(
    String id,
    String mode,
    int sets,
    int amount, {
    bool perSide = false,
    int rest = 30,
  }) => {
    'exerciseId': id,
    'mode': mode,
    'sets': sets,
    if (mode == 'reps') 'reps': amount else 'workSeconds': amount,
    'perSide': perSide,
    'restSeconds': rest,
  };
  return {
    'kind': 'plan',
    'text': text,
    'plan': {
      'schemaVersion': 1,
      'title': '居家支撑臂 20 分钟',
      'summary': '手腕肩胛热身后练支撑臂和侧撑。',
      'goal': 'strength',
      'scene': 'home',
      'equipment': ['mat'],
      'level': 1,
      'targetMinutes': 20,
      'blocks': [
        {
          'id': 'b1',
          'name': '热身',
          'type': 'warmup',
          'rounds': 1,
          'restBetweenRoundsSeconds': 0,
          'items': [
            item('forearms-A', 'reps', 2, 10, rest: 15),
            item('scapular-A', 'reps', 2, 8),
          ],
        },
        {
          'id': 'b2',
          'name': '支撑主练',
          'type': 'main',
          'rounds': 2,
          'restBetweenRoundsSeconds': 60,
          'items': [
            item('triceps-A', 'reps', 2, 8, rest: 45),
            item('deltoids-A', 'time', 1, 20, perSide: true),
          ],
        },
      ],
      'notes': [],
      'safetyNotes': ['手腕不适加重就停止。'],
    },
  };
}

class _Memory implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

class _ControlledStorage extends helpers.MemoryStateStorage {
  bool failWrites = false;
  Completer<void>? block;
  int writes = 0;
  @override
  Future<void> write(String key, String value) async {
    writes++;
    if (failWrites) throw StateError('test storage unavailable');
    await block?.future;
    await super.write(key, value);
  }
}

void main() {
  final catalog = loadCatalogFixture();

  CoachService service({
    uc.FakeLlmClient? fake,
    CoachUsageStore? usage,
    LocalStateStorage? storage,
    AssetReader reader = readAsset,
  }) => CoachService(
    config: fake == null
        ? const CoachConfig()
        : const CoachConfig(apiKey: 'test'),
    appCatalog: catalog,
    client: fake,
    usage: usage ?? CoachUsageStore(),
    storage: storage ?? _Memory(),
    readAsset: reader,
    maxRequestRetries: 0,
  );

  group('服务与映射', () {
    test('所有预设三档可执行，manual处方使用发布剂量而非零次', () {
      final templates = TemplateFallback(catalog);
      final source = uc.Catalog.fromJson(
        jsonDecode(File('assets/coach/catalog.json').readAsStringSync()),
      );
      for (final preset in PresetPlan.all) {
        for (final tier in ['A', 'B', 'C']) {
          final plan = templates.build(preset.id, tier)!;
          expect(() => validateTrainingPlan(plan, catalog), returnsNormally);
          expect(estimateTrainingPlanSeconds(plan, catalog), greaterThan(0));
          for (final item in plan.items) {
            if (catalog.drillById(item.exerciseId)!.dose.mode.name !=
                'manual') {
              continue;
            }
            final expected = source[item.exerciseId]!.defaultDose;
            expect(item.mode, expected.mode);
            expect(item.reps, expected.reps);
            expect(item.workSeconds, expected.seconds);
            expect(item.sets, expected.sets);
            expect(item.restSeconds, expected.restSeconds);
          }
        }
      }
    });

    test('范围 = profile 白名单 ∩ App 动作与视频；交集完整时不改 profile', () async {
      final s = service(fake: AgentFakeLlmClient(const []));
      await s.load();
      expect(s.excludedIds, isEmpty);
      expect(s.profile.scope(s.catalog), hasLength(51));
      for (final d in s.profile.scope(s.catalog)) {
        expect(catalog.drillById(d.id), isNotNull, reason: d.id);
        expect(File('assets/drill_media/${d.id}.mp4').existsSync(), isTrue);
      }
    });

    test('App 缺视频的动作从 AI 范围里排除，校验报 E_SCOPE', () async {
      Future<String> reader(String path) async {
        final text = File(path).readAsStringSync();
        if (!path.endsWith('drill-media-manifest.json')) return text;
        final json = jsonDecode(text) as Map<String, dynamic>;
        (json['actions'] as Map).remove('triceps-A');
        return jsonEncode(json);
      }

      final s = service(fake: AgentFakeLlmClient(const []), reader: reader);
      await s.load();
      expect(s.excludedIds, {'triceps-A'});
      expect(
        s.profile.scope(s.catalog).map((d) => d.id),
        isNot(contains('triceps-A')),
      );
      final plan = const uc.EnvelopeParser()
          .parse(jsonEncode(validPlanEnvelope()), planId: 'p')
          .reply!
          .plan!;
      final report = s.validatePlan(plan);
      expect(report.errorCategories, contains('E_SCOPE'));
    });

    test('合格样例计划通过 SDK 校验', () async {
      final s = service(fake: AgentFakeLlmClient(const []));
      await s.load();
      final plan = const uc.EnvelopeParser()
          .parse(jsonEncode(validPlanEnvelope()), planId: 'p')
          .reply!
          .plan!;
      expect(s.validatePlan(plan).errors, isEmpty);
    });

    test('计划展示保留原块和逐项剂量；持久化以完整SDK计划为准', () {
      final plan = const uc.EnvelopeParser()
          .parse(jsonEncode(validPlanEnvelope()), planId: 'p')
          .reply!
          .plan!;
      final entries = CoachPlanMapper(catalog).entries(plan);
      expect(entries.map((e) => e.drill.id), [
        'forearms-A',
        'scapular-A',
        'triceps-A',
        'deltoids-A',
      ]);
      expect(
        entries[2].dose!.sets,
        2,
      ); // main.rounds is not an extra set multiplier.
      expect(entries[2].doseText, '2 组 × 8 次');
      expect(entries[3].doseText, '1 组 × 每侧 20 秒');
      final routine = TrainingRoutine(
        id: 'r1',
        name: 'AI',
        drillIds: plan.exerciseIds.toList(),
        sdkPlan: plan,
        source: 'ai',
      );
      final back = TrainingRoutine.fromJson(
        jsonDecode(jsonEncode(routine.toJson())) as Map<String, dynamic>,
      );
      expect(back.sdkPlan!.toJson(), plan.toJson());
      expect(back.source, 'ai');
      expect(back.copyWith(name: '改名').sdkPlan!.toJson(), plan.toJson());
      expect(() => back.copyWith(drillIds: ['abs-A']), throwsStateError);
      expect(
        TrainingRoutine.fromJson({
          'id': 'r2',
          'name': 'old',
          'drillIds': ['abs-A'],
        }).sdkPlan,
        isNull,
      );
    });

    test('预设回落按关键词挑方向、按场景挑档位；红旗情况建议就医', () {
      expect(TemplateFallback.pickPreset('想练练核心和腹部'), 'core');
      expect(TemplateFallback.pickPreset('手腕热身'), 'warmup');
      expect(TemplateFallback.pickPreset('随便练练'), 'flare');
      expect(TemplateFallback.pickTier('去健身房练腿', 'A'), 'C');
      expect(TemplateFallback.pickTier('家里有哑铃', 'A'), 'B');
      final t = TemplateFallback(catalog);
      final r = t.reply('练腿', reason: PresetReason.offline, tier: 'A');
      expect(r.plan!.source, 'template');
      expect(r.text, contains('预设方案'));
      expect(r.text, contains('网络不可用'));
      expect(
        r.plan!.exerciseIds,
        PresetPlan.byId('legs')!.drills(catalog, 'A').map((d) => d.id).toSet(),
      );
      final red = t.reply('手腕刚扭伤肿了', reason: PresetReason.offline, tier: 'A');
      expect(red.plan, isNull);
      expect(red.text, contains('就医'));
    });
  });

  group('App 与 SDK conversation 接线', () {
    test('未配置时不创建 AI 会话，也不处理隐藏入口的输入', () async {
      final s = service();
      addTearDown(s.dispose);
      await s.load();
      expect(s.conversation, isNull);
      expect(await s.send('想练托马斯'), isNull);
    });

    test('红旗本地提示保留历史约束，两轮均不调用模型', () async {
      final fake = AgentFakeLlmClient(const []);
      final s = service(fake: fake);
      addTearDown(s.dispose);
      await s.send('我做了手术，想恢复训练');
      final result = await s.send('给我一个简单方案');
      expect(result!.plan, isNull);
      expect(result.text, contains('就医'));
      expect(fake.requests, isEmpty);
      expect(
        s.conversation!.state.messages.where((m) => m.isUser),
        hasLength(2),
      );
    });

    test('追问回答断网时仍按历史方向和场所选择 App 预设', () async {
      final s = service(
        fake: AgentFakeLlmClient([
          {
            'kind': 'ask',
            'text': '想练几分钟？',
            'options': ['10分钟', '20分钟'],
          },
          const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
        ]),
      );
      addTearDown(s.dispose);
      await s.send('在健身房，想练核心');
      final question = s.conversation!.state.pendingQuestion!;
      final result = await s.answerChoices(question.id, ['10分钟']);
      expect(result!.plan!.plan.id, 'template-core-C');
    });

    test('选择按 SDK 原顺序整理后仍传入 App 器械上下文', () async {
      final fake = AgentFakeLlmClient([
        {
          'kind': 'ask',
          'text': '有哪些器械？',
          'options': ['弹力带', '哑铃', '壶铃'],
          'multiple': true,
        },
        {'kind': 'ask', 'text': '练多久？'},
        {'kind': 'reply', 'text': '已按新器械条件更新。'},
      ]);
      final s = service(fake: fake);
      addTearDown(s.dispose);
      await s.send('在家练支撑臂');
      final question = s.conversation!.state.pendingQuestion!;
      await s.answerChoices(question.id, ['壶铃', '弹力带']);
      expect(
        s.conversation!.state.messages.where((m) => m.isUser).last.text,
        '弹力带、壶铃',
      );
      await s.send('只有弹力带');
      final current = fake.requests.last.messages.last.content;
      expect(current, contains('弹力带'));
      expect(current, isNot(contains('壶铃')));
      expect(current, isNot(contains('哑铃')));
    });

    test('App 取消事件接到 SDK，问题不进入展示历史', () async {
      final s = service(
        fake: AgentFakeLlmClient([
          {
            'kind': 'ask',
            'text': '练多久？',
            'options': ['10分钟', '20分钟'],
          },
        ]),
      );
      addTearDown(s.dispose);
      await s.load();
      var busyAtEvent = false;
      final subscription = s.conversation!.events.listen((event) {
        if (event.kind == uc.AgentEventKind.askUser) {
          busyAtEvent = s.conversation!.state.isWaiting;
          s.conversation!.cancel();
        }
      });
      addTearDown(subscription.cancel);
      final result = await s.send('想练核心');
      expect(busyAtEvent, isTrue);
      expect(result, isNull);
      expect(s.conversation!.state.messages, isEmpty);
      expect(s.conversation!.state.pendingQuestion, isNull);
    });

    test('App 进度监听期间禁答，SDK 返回后才启用问题', () async {
      final session = AiCoachSession(
        service(
          fake: AgentFakeLlmClient([
            {
              'kind': 'ask',
              'text': '今天练多久？',
              'options': ['10分钟', '20分钟'],
            },
          ]),
        ),
      );
      addTearDown(session.dispose);
      await session.load();
      final beforeReturn = <bool>[];
      session.addListener(() {
        if (session.busy &&
            session.progress?.kind == uc.AgentEventKind.askUser) {
          beforeReturn.add(session.controller!.state.pendingQuestion == null);
        }
      });
      await session.send('想练托马斯', tier: 'A');
      expect(beforeReturn, isNotEmpty);
      expect(beforeReturn, everyElement(isTrue));
      final message = session.messages.last;
      expect(message.question, isNotNull);
      expect(session.controller!.canAnswer(message.id), isTrue);
    });

    test('连续回答同步锁定一次，取消恢复首份输入且下一轮可继续', () async {
      final started = Completer<void>();
      final lateReply = Completer<Map<String, Object?>>();
      final fake = AgentFakeLlmClient([
        {'kind': 'ask', 'text': '今天练多久？'},
        (uc.LlmRequest _) {
          started.complete();
          return lateReply.future;
        },
        {'kind': 'reply', 'text': '已按下一轮条件继续。'},
      ]);
      final session = AiCoachSession(service(fake: fake));
      addTearDown(() {
        if (!lateReply.isCompleted) {
          lateReply.complete({'kind': 'reply', 'text': '迟到的旧回复'});
        }
        session.dispose();
      });
      await session.load();
      await session.send('在家练核心', tier: 'A');
      final questionId = session.controller!.state.pendingQuestion!.id;
      final agent = session.service.agent;

      final first = session.answerText(questionId, '第一份回答：十分钟', tier: 'A');
      final duplicate = session.answerText(questionId, '第二份回答：二十分钟', tier: 'A');
      expect(session.controller!.state.isWaiting, isTrue);
      expect(session.busy, isTrue);
      expect(session.pendingText, '第一份回答：十分钟');
      await duplicate;
      await started.future;
      expect(fake.requests, hasLength(2));
      expect(session.pendingText, '第一份回答：十分钟');

      session.stop();
      expect(session.cancelledText, '第一份回答：十分钟');
      expect(session.pendingText, isNull);
      expect(session.busy, isFalse);
      expect(session.controller!.canAnswer(questionId), isFalse);
      await session.send('下一轮改练支撑臂', tier: 'A');
      await first;
      lateReply.complete({'kind': 'reply', 'text': '迟到的旧回复'});
      await Future<void>.delayed(Duration.zero);

      expect(identical(session.service.agent, agent), isTrue);
      expect(fake.requests, hasLength(3));
      expect(session.messages.where((m) => m.isUser).map((m) => m.text), [
        '在家练核心',
        '下一轮改练支撑臂',
      ]);
      expect(session.messages.last.text, '已按下一轮条件继续。');
      expect(session.cancelledText, '第一份回答：十分钟');
    });

    test('回答继承 App 条件，新对话刷新目录但复用同一个 Agent', () async {
      final fake = AgentFakeLlmClient([
        {
          'kind': 'ask',
          'text': '重点想练哪里？',
          'options': ['核心', '腿部'],
        },
        {'kind': 'ask', 'text': '有什么要补充的？'},
      ]);
      final s = service(fake: fake);
      addTearDown(s.dispose);
      await s.send('在家没有器械，手腕不舒服');
      final agent = s.agent;
      final controller = s.conversation;
      final json =
          jsonDecode(File(CoachService.catalogAsset).readAsStringSync())
              as Map<String, dynamic>;
      json['version'] = '9.9.9';
      s.catalogRepository.replace(
        uc.CatalogPayload(
          text: jsonEncode(json),
          origin: 'remote',
          sha256: 'x',
        ).parse(),
        origin: 'remote',
      );
      final question = controller!.state.pendingQuestion!;
      await s.answerChoices(question.id, ['核心']);
      expect(identical(s.agent, agent), isTrue);
      expect(s.catalog.version, isNot('9.9.9'));
      final request = fake.requests.last.messages.last.content;
      expect(request, contains('手腕'));
      expect(request, contains('home'));
      expect(request, contains('没有器械'));
      s.newConversation();
      expect(identical(s.agent, agent), isTrue);
      expect(identical(s.conversation, controller), isTrue);
      expect(controller.state.messages, isEmpty);
      expect(s.catalog.version, '9.9.9');
    });

    test('恢复历史只读问题，新的输入仍经同一 Agent 和 App 条件门禁', () async {
      final fake = AgentFakeLlmClient([
        {
          'kind': 'ask',
          'text': '练多久？',
          'options': ['10分钟', '20分钟'],
        },
        {'kind': 'reply', 'text': '好的，继续安排。'},
      ]);
      final s = service(fake: fake);
      addTearDown(s.dispose);
      await s.send('在家没有器械，手腕不舒服');
      final controller = s.conversation!;
      final history = controller.state.messages;
      final id = controller.state.pendingQuestion!.id;
      final agent = s.agent;
      s.restoreHistory(history);
      expect(controller.canAnswer(id), isFalse);
      expect(controller.state.pendingQuestion, isNull);
      expect(controller.state.messages.last.questionAnswered, isTrue);
      expect(await s.answerChoices(id, ['10分钟']), isNull);
      expect(fake.requests, hasLength(1));
      await s.send('继续练核心');
      expect(identical(s.agent, agent), isTrue);
      expect(fake.requests.last.messages.last.content, contains('手腕'));
      expect(fake.requests.last.messages.last.content, contains('没有器械'));
    });
  });

  group('SDK 共用聊天页', () {
    Future<LearningStore> pumpShell(
      WidgetTester tester,
      CoachService coach, {
      Size size = const Size(390, 844),
      double textScale = 1,
      Brightness brightness = Brightness.light,
      ValueChanged<uc.TrainingPlan>? onTraining,
      LocalStateStorage? appStorage,
    }) async {
      tester.view.physicalSize = size;
      tester.view.devicePixelRatio = 1;
      tester.platformDispatcher.textScaleFactorTestValue = textScale;
      FlareColors.use(brightness);
      addTearDown(() => FlareColors.use(Brightness.dark));
      addTearDown(tester.view.reset);
      addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
      final store = LearningStore(
        catalog: catalog,
        storage: appStorage ?? helpers.MemoryStateStorage(),
      );
      await store.initialize();
      await store.acknowledgeSafety();
      if (brightness == Brightness.dark) {
        await store.updateSettings(themeMode: 'dark');
      }
      final scene = SceneController(commandSink: (_) {});
      addTearDown(store.dispose);
      addTearDown(scene.dispose);
      await tester.pumpWidget(
        MaterialApp(
          theme: flareTheme(brightness),
          locale: const Locale('zh'),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
            coach: coach,
            trainingPageBuilder: onTraining == null
                ? null
                : (plan) {
                    onTraining(plan);
                    return Scaffold(
                      body: Builder(
                        builder: (context) => TextButton(
                          key: const ValueKey('test-close-training'),
                          onPressed: () => Navigator.of(context).pop(),
                          child: const Text('Close'),
                        ),
                      ),
                    );
                  },
          ),
        ),
      );
      await tester.pumpAndSettle();
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'ready',
        'time': 0.0,
        'period': 9.0,
        'phase': {'source': 9},
      });
      await tester.pumpAndSettle();
      await tester.tap(helpers.labeledControl('计划'));
      await tester.pumpAndSettle();
      return store;
    }

    Future<void> openCoach(WidgetTester tester) async {
      await tester.tap(find.byKey(const ValueKey('plan-ai-coach')));
      await tester.pumpAndSettle();
      if (find
          .byKey(const ValueKey('coach-disclaimer-ok'))
          .evaluate()
          .isNotEmpty) {
        await tester.tap(find.byKey(const ValueKey('coach-disclaimer-ok')));
        await tester.pumpAndSettle();
      }
    }

    Finder key(String value) => find.byKey(ValueKey(value));
    Finder scrollable() => find
        .descendant(
          of: find.byType(cui.CoachChatList),
          matching: find.byType(Scrollable),
        )
        .first;
    Future<void> tapVisible(WidgetTester tester, Finder finder) async {
      await tester.scrollUntilVisible(finder, 160, scrollable: scrollable());
      await tester.pumpAndSettle();
      await tester.tap(finder);
      await tester.pumpAndSettle();
    }

    String planId(WidgetTester tester, int index) {
      final page = tester.widget<AiCoachPage>(find.byType(AiCoachPage));
      return 'coach-plan-${page.session.messages.where((m) => m.plan != null).elementAt(index).id}';
    }

    String questionId(WidgetTester tester, int index) {
      final page = tester.widget<AiCoachPage>(find.byType(AiCoachPage));
      return 'coach-question-${page.session.messages.where((m) => m.question != null).elementAt(index).id}';
    }

    Future<void> expand(WidgetTester tester, int index) async {
      final finder = key('plan-expand-${planId(tester, index)}');
      await tester.ensureVisible(finder);
      await tester.pumpAndSettle();
      await tester.tap(finder);
      await tester.pumpAndSettle();
    }

    Future<void> say(
      WidgetTester tester,
      String text, {
      bool settle = true,
    }) async {
      await tester.enterText(key('coach-input'), text);
      await tester.pump();
      await tester.tap(key('coach-send'));
      await tester.pump(const Duration(milliseconds: 100));
      if (settle) await tester.pumpAndSettle();
    }

    Future<void> save(WidgetTester tester, int index) async {
      await expand(tester, index);
      await tapVisible(tester, key('plan-save-${planId(tester, index)}'));
      await tester.pump(const Duration(seconds: 5));
      await tester.pumpAndSettle();
    }

    Finder option(WidgetTester tester, int index, int i) =>
        key('question-option-${questionId(tester, index)}-$i');

    testWidgets('SDK列表、气泡和套路卡替代App布局，保留唯一开始按钮', (tester) async {
      await pumpShell(
        tester,
        service(fake: AgentFakeLlmClient([validPlanEnvelope()])),
      );
      await openCoach(tester);
      expect(find.byType(cui.CoachChatList), findsOneWidget);
      expect(find.byType(cui.CoachGreetingBlock), findsOneWidget);
      await say(tester, '在家20分钟练支撑');
      expect(find.byType(cui.CoachMessageBubble), findsNWidgets(2));
      expect(find.byType(cui.CoachPlanCard), findsOneWidget);
      expect(find.byType(cui.CoachStartButton), findsOneWidget);
      final card = tester.widget<cui.CoachPlanCard>(
        find.byType(cui.CoachPlanCard),
      );
      expect(card.plan.items.map((i) => i.exerciseId), [
        'forearms-A',
        'scapular-A',
        'triceps-A',
        'deltoids-A',
      ]);
      expect(card.plan.items[2].dose, contains('2 组'));
      await expand(tester, 0);
      expect(find.text('收起'), findsOneWidget);
      await expand(tester, 0);
      expect(find.text('展开'), findsOneWidget);
      expect(
        find.descendant(
          of: find.byType(cui.CoachChatList),
          matching: find.byType(BackdropFilter),
        ),
        findsNothing,
      );
      expect(tester.takeException(), isNull);
    });

    testWidgets('生成→SDK卡保存→完整计划开练→回对话→我的计划再次开练', (tester) async {
      final started = <uc.TrainingPlan>[];
      final store = await pumpShell(
        tester,
        service(fake: AgentFakeLlmClient([validPlanEnvelope()])),
        onTraining: started.add,
      );
      await openCoach(tester);
      await say(tester, '在家20分钟练支撑');
      await save(tester, 0);
      expect(store.routines, hasLength(1));
      final routine = store.routines.single;
      expect(routine.source, 'ai');
      expect(routine.sdkPlan!.blocks[1].rounds, 2);
      expect(
        tester.widget<cui.CoachPlanCard>(find.byType(cui.CoachPlanCard)).saved,
        isTrue,
      );
      await tapVisible(tester, key('plan-start-${planId(tester, 0)}'));
      expect(started.single.toJson(), routine.sdkPlan!.toJson());
      await tester.tap(key('test-close-training'));
      await tester.pumpAndSettle();
      expect(find.byType(cui.CoachPlanCard), findsOneWidget);
      await tester.tap(find.byTooltip('返回').first);
      await tester.pumpAndSettle();
      await tester.tap(key('routine-${routine.id}'));
      await tester.pumpAndSettle();
      await tester.tap(key('plan-start'));
      await tester.pumpAndSettle();
      expect(started, hasLength(2));
      expect(started.last.toJson(), routine.sdkPlan!.toJson());
      expect(tester.takeException(), isNull);
    });

    testWidgets('多选→文字澄清→套路：同一个Agent，原顺序字符串，问题不重复', (tester) async {
      final fake = AgentFakeLlmClient([
        {
          'kind': 'ask',
          'text': '主要练哪些部位？',
          'options': ['核心', '腿部', '支撑臂'],
          'multiple': true,
        },
        {'kind': 'ask', 'text': '还有什么想补充的？'},
        validPlanEnvelope(),
      ]);
      final coach = service(fake: fake);
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '在家练托马斯');
      final agent = coach.agent;
      expect(find.text('主要练哪些部位？'), findsOneWidget);
      expect(find.byType(cui.CoachQuestionBubble), findsOneWidget);
      expect(
        tester
            .widget<cui.CoachTextAction>(
              key('question-submit-${questionId(tester, 0)}'),
            )
            .onPressed,
        isNull,
      );
      await tester.tap(option(tester, 0, 2));
      await tester.pumpAndSettle();
      await tester.tap(option(tester, 0, 0));
      await tester.pumpAndSettle();
      await tapVisible(tester, key('question-submit-${questionId(tester, 0)}'));
      expect(identical(coach.agent, agent), isTrue);
      expect(agent!.questionsAsked, 2);
      expect(find.text('核心、支撑臂'), findsOneWidget);
      expect(find.text('还有什么想补充的？'), findsOneWidget);
      final old = tester.widget<cui.CoachOptionPill>(option(tester, 0, 0));
      expect(old.enabled, isFalse);
      expect(old.chosen, isTrue);
      await tester.enterText(
        key('question-input-${questionId(tester, 1)}'),
        '20分钟，先热身',
      );
      await tester.pump();
      await tapVisible(tester, key('question-submit-${questionId(tester, 1)}'));
      expect(identical(coach.agent, agent), isTrue);
      expect(agent.turnCount, 3);
      expect(agent.questionsAsked, 0);
      expect(
        fake.requests.last.messages.map((m) => m.content).join(),
        contains('核心、支撑臂'),
      );
      expect(find.byType(cui.CoachPlanCard), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('SDK问题去重，历史快照中的不同正文与问题同显', (tester) async {
      final coach = service(
        fake: AgentFakeLlmClient([
          {'kind': 'ask', 'text': '今天练多久？'},
        ]),
      );
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '在家练核心');
      expect(find.text('今天练多久？'), findsOneWidget);
      final history = coach.conversation!.state.messages;
      expect(history.last.text, isEmpty);
      // History may carry distinct narration alongside an admitted question.
      coach.restoreHistory([
        ...history.take(history.length - 1),
        history.last.copyWith(text: '我先按居家条件安排。'),
      ]);
      await tester.pumpAndSettle();
      expect(find.text('我先按居家条件安排。'), findsOneWidget);
      expect(find.text('今天练多久？'), findsOneWidget);
      expect(
        tester
            .widget<cui.CoachQuestionBubble>(
              find.byType(cui.CoachQuestionBubble),
            )
            .enabled,
        isFalse,
      );
      expect(tester.takeException(), isNull);
    });

    testWidgets('离开期间返回的问题在重开时仍是只读历史', (tester) async {
      final coach = service(
        fake: AgentFakeLlmClient([
          (uc.LlmRequest _) async {
            await Future<void>.delayed(const Duration(seconds: 30));
            return {
              'kind': 'ask',
              'text': '练多久？',
              'options': ['10分钟', '20分钟'],
            };
          },
        ]),
      );
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '练核心', settle: false);
      await tester.tap(find.byTooltip('返回').first);
      await tester.pumpAndSettle();
      expect(find.byType(AiCoachPage), findsNothing);
      await tester.pump(const Duration(seconds: 30));
      await tester.pumpAndSettle();
      await openCoach(tester);
      expect(find.text('练多久？'), findsOneWidget);
      expect(
        tester.widget<cui.CoachOptionPill>(option(tester, 0, 0)).enabled,
        isFalse,
      );
      expect(coach.conversation!.state.pendingQuestion, isNull);
      expect(tester.takeException(), isNull);
    });

    testWidgets('单选原字符串立即回答，旧问题关闭且不会重发', (tester) async {
      final fake = AgentFakeLlmClient([
        {
          'kind': 'ask',
          'text': '在哪里练？',
          'options': ['在家', '健身房'],
        },
        validPlanEnvelope(),
      ]);
      final coach = service(fake: fake);
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '想练支撑');
      final agent = coach.agent;
      await tester.tap(option(tester, 0, 0));
      await tester.pumpAndSettle();
      expect(fake.requests, hasLength(2));
      expect(identical(agent, coach.agent), isTrue);
      expect(fake.requests.last.messages.last.content, contains('在家'));
      expect(
        tester.widget<cui.CoachOptionPill>(option(tester, 0, 0)).enabled,
        isFalse,
      );
      expect(find.byType(cui.CoachPlanCard), findsOneWidget);
    });

    testWidgets('取消后立即再发，旧问题仍禁用且迟到结果不覆盖新轮', (tester) async {
      final fake = AgentFakeLlmClient([
        {
          'kind': 'ask',
          'text': '练哪里？',
          'options': ['核心', '腿部'],
        },
        (uc.LlmRequest _) async {
          await Future<void>.delayed(const Duration(seconds: 30));
          return validPlanEnvelope();
        },
        validPlanEnvelope(),
      ]);
      final coach = service(fake: fake);
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '练托马斯');
      final agent = coach.agent;
      await say(tester, '练支撑臂', settle: false);
      expect(find.byType(cui.CoachTypingBubble), findsOneWidget);
      expect(
        tester.widget<cui.CoachOptionPill>(option(tester, 0, 0)).enabled,
        isFalse,
      );
      await tester.tap(key('chat-cancel'));
      await tester.pump();
      expect(
        tester.widget<cui.CoachOptionPill>(option(tester, 0, 0)).enabled,
        isFalse,
      );
      expect(
        tester.widget<TextField>(key('coach-input')).controller!.text,
        '练支撑臂',
      );
      await say(tester, '在家20分钟练支撑臂', settle: false);
      await tester.pump(const Duration(seconds: 30));
      await tester.pumpAndSettle();
      expect(identical(agent, coach.agent), isTrue);
      expect(find.byType(cui.CoachPlanCard), findsOneWidget);
      expect(
        coach.conversation!.state.messages
            .where((m) => m.isUser)
            .map((m) => m.text),
        ['练托马斯', '在家20分钟练支撑臂'],
      );
    });

    testWidgets('退出再打开只显示历史，旧澄清不重新启用', (tester) async {
      final coach = service(
        fake: AgentFakeLlmClient([
          {
            'kind': 'ask',
            'text': '练多久？',
            'options': ['10分钟', '20分钟'],
          },
        ]),
      );
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '练核心');
      expect(
        tester.widget<cui.CoachOptionPill>(option(tester, 0, 0)).enabled,
        isTrue,
      );
      await tester.tap(find.byTooltip('返回').first);
      await tester.pumpAndSettle();
      await openCoach(tester);
      expect(find.text('练多久？'), findsOneWidget);
      expect(
        tester.widget<cui.CoachOptionPill>(option(tester, 0, 0)).enabled,
        isFalse,
      );
      await tester.tap(key('coach-new-chat'));
      await tester.pumpAndSettle();
      expect(coach.agent!.turnCount, 0);
      expect(coach.agent!.questionsAsked, 0);
      expect(find.byType(cui.CoachQuestionBubble), findsNothing);
    });

    testWidgets('模型重复plan id仍独立保存；删除后可再次保存完整原计划', (tester) async {
      final a = validPlanEnvelope(), b = validPlanEnvelope();
      (a['plan'] as Map)['id'] = 'same';
      (b['plan'] as Map)['id'] = 'same';
      final store = await pumpShell(
        tester,
        service(fake: AgentFakeLlmClient([a, b])),
      );
      await openCoach(tester);
      await say(tester, '在家20分钟');
      await save(tester, 0);
      final first = store.routines.single;
      await say(tester, '再来一份');
      await save(tester, 1);
      expect(store.routines, hasLength(2));
      expect(store.routines[0].id, isNot(store.routines[1].id));
      await store.deleteRoutine(store.routines.last.id);
      await tester.pumpAndSettle();
      final secondCard = tester.widget<cui.CoachPlanCard>(
        key(planId(tester, 1)),
      );
      expect(secondCard.saved, isFalse);
      await tapVisible(tester, key('plan-save-${planId(tester, 1)}'));
      expect(store.routines, hasLength(2));
      expect(
        store.routines.last.sdkPlan!.exerciseIds,
        first.sdkPlan!.exerciseIds,
      );
    });

    testWidgets('SDK保存双击去重，写入完成才标为已保存', (tester) async {
      final storage = _ControlledStorage();
      final store = await pumpShell(
        tester,
        service(fake: AgentFakeLlmClient([validPlanEnvelope()])),
        appStorage: storage,
      );
      await openCoach(tester);
      await say(tester, '在家20分钟');
      final before = storage.writes;
      storage.block = Completer<void>();
      final card = tester.widget<cui.CoachPlanCard>(
        find.byType(cui.CoachPlanCard),
      );
      card.onSave();
      card.onSave();
      await tester.pump();
      expect(store.routines, hasLength(1));
      expect(storage.writes, before + 1);
      expect(
        tester.widget<cui.CoachPlanCard>(find.byType(cui.CoachPlanCard)).saved,
        isFalse,
      );
      storage.block!.complete();
      storage.block = null;
      await tester.pumpAndSettle();
      expect(
        tester.widget<cui.CoachPlanCard>(find.byType(cui.CoachPlanCard)).saved,
        isTrue,
      );
    });

    testWidgets('保存失败提示并可重试，复用同一份内存计划不重复建档', (tester) async {
      final storage = _ControlledStorage();
      final store = await pumpShell(
        tester,
        service(fake: AgentFakeLlmClient([validPlanEnvelope()])),
        appStorage: storage,
      );
      await openCoach(tester);
      await say(tester, '在家20分钟');
      storage.failWrites = true;
      tester.widget<cui.CoachPlanCard>(find.byType(cui.CoachPlanCard)).onSave();
      await tester.pumpAndSettle();
      expect(store.routines, hasLength(1));
      final first = store.routines.single.id;
      expect(
        tester.widget<cui.CoachPlanCard>(find.byType(cui.CoachPlanCard)).saved,
        isFalse,
      );
      expect(key('coach-save-retry'), findsOneWidget);
      expect(find.textContaining('保存失败'), findsOneWidget);
      storage.failWrites = false;
      tester.widget<cui.CoachPlanCard>(find.byType(cui.CoachPlanCard)).onSave();
      await tester.pumpAndSettle();
      expect(store.routines, hasLength(1));
      expect(store.routines.single.id, first);
      expect(
        tester.widget<cui.CoachPlanCard>(find.byType(cui.CoachPlanCard)).saved,
        isTrue,
      );
      expect(key('coach-save-retry'), findsNothing);
      expect(store.storageError, isNull);
    });

    testWidgets('模型未入白名单的动作不能映射为可执行SDK卡，只能安全回落', (tester) async {
      final bad = validPlanEnvelope();
      final blocks = (bad['plan'] as Map)['blocks'] as List;
      final item = (blocks.first as Map)['items'] as List;
      (item.first as Map)['exerciseId'] = 'model-only-action';
      (item.first as Map)['poster'] = 'https://invalid.example/model-image.png';
      final coach = service(fake: AgentFakeLlmClient([bad, bad, bad]));
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '在家练支撑臂');
      final card = tester.widget<cui.CoachPlanCard>(
        find.byType(cui.CoachPlanCard),
      );
      expect(card.plan.metaLabel, contains('预设方案'));
      expect(card.library.tryGet('model-only-action'), isNull);
      final trusted = coach.profile
          .scope(coach.catalog)
          .map((d) => d.id)
          .toSet();
      for (final item in card.plan.items) {
        expect(trusted, contains(item.exerciseId));
        final exercise = card.library.tryGet(item.exerciseId)!;
        expect(exercise.name, catalog.drillById(item.exerciseId)!.name);
        expect(exercise.poster, 'assets/drill_media/${item.exerciseId}.jpg');
      }
      expect(tester.takeException(), isNull);
    });

    testWidgets('断网仍显示明确预设来源，可信模板可保存并开练', (tester) async {
      final started = <uc.TrainingPlan>[];
      final store = await pumpShell(
        tester,
        service(
          fake: AgentFakeLlmClient([
            const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
          ]),
        ),
        onTraining: started.add,
      );
      await openCoach(tester);
      await say(tester, '在家练腿');
      final card = tester.widget<cui.CoachPlanCard>(
        find.byType(cui.CoachPlanCard),
      );
      expect(card.plan.metaLabel, contains('预设方案'));
      await save(tester, 0);
      expect(store.routines.single.source, 'template');
      await tapVisible(tester, key('plan-start-${planId(tester, 0)}'));
      expect(started.single.source, 'template');
      expect(tester.takeException(), isNull);
    });

    testWidgets('无Key时AI入口、未配置提示及用量均隐藏', (tester) async {
      await pumpShell(tester, service());
      expect(key('plan-ai-coach'), findsNothing);
      expect(find.textContaining('未配置 AI'), findsNothing);
      expect(find.byType(AiCoachPage), findsNothing);
    });

    testWidgets('首次免责说明仍由App保存', (tester) async {
      final storage = _Memory();
      final coach = service(fake: AgentFakeLlmClient([]), storage: storage);
      await pumpShell(tester, coach);
      await tester.tap(key('plan-ai-coach'));
      await tester.pumpAndSettle();
      expect(key('coach-disclaimer'), findsOneWidget);
      await tester.tap(key('coach-disclaimer-ok'));
      await tester.pumpAndSettle();
      expect(key('coach-disclaimer'), findsNothing);
      final again = service(fake: AgentFakeLlmClient([]), storage: storage);
      await again.load();
      expect(again.disclaimerAccepted, isTrue);
    });

    testWidgets('SDK等待气泡显示真实进度，取消后输入恢复，不回落', (tester) async {
      final fake = AgentFakeLlmClient([
        (uc.LlmRequest _) async {
          await Future<void>.delayed(const Duration(seconds: 30));
          return validPlanEnvelope();
        },
      ]);
      await pumpShell(tester, service(fake: fake));
      await openCoach(tester);
      await say(tester, '练支撑', settle: false);
      expect(find.byType(cui.CoachTypingBubble), findsOneWidget);
      await tester.pump(const Duration(seconds: 8));
      expect(find.textContaining('已用'), findsOneWidget);
      await tester.tap(key('chat-cancel'));
      await tester.pump(const Duration(seconds: 30));
      await tester.pumpAndSettle();
      expect(find.byType(cui.CoachTypingBubble), findsNothing);
      expect(find.byType(cui.CoachPlanCard), findsNothing);
      expect(
        tester.widget<TextField>(key('coach-input')).controller!.text,
        '练支撑',
      );
    });

    testWidgets('390宽正常字号深色SDK套路卡可展开，使用App字体和文案', (tester) async {
      await pumpShell(
        tester,
        service(fake: AgentFakeLlmClient([validPlanEnvelope()])),
        brightness: Brightness.dark,
      );
      await openCoach(tester);
      await say(tester, '在家20分钟');
      await expand(tester, 0);
      final context = tester.element(find.byType(cui.CoachPlanCard));
      final style = cui.CoachUiTheme.of(context);
      expect(style.colors.brightness, Brightness.dark);
      expect(style.typography.body.fontFamily, 'FlareSans');
      expect(style.strings.save, '保存');
      expect(find.text('收起'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    for (final dark in [false, true]) {
      testWidgets('SDK呈现320宽2倍字号${dark ? '深色' : '浅色'}，主题字体由App注入', (
        tester,
      ) async {
        final env = validPlanEnvelope();
        (env['plan'] as Map)['title'] = '托马斯基础支撑与肩胛控制训练计划逐步增加难度';
        await pumpShell(
          tester,
          service(fake: AgentFakeLlmClient([env])),
          size: const Size(320, 740),
          textScale: 2,
          brightness: dark ? Brightness.dark : Brightness.light,
        );
        await openCoach(tester);
        await say(tester, '在家20分钟');
        await expand(tester, 0);
        final context = tester.element(find.byType(cui.CoachPlanCard));
        final style = cui.CoachUiTheme.of(context);
        expect(
          style.colors.brightness,
          dark ? Brightness.dark : Brightness.light,
        );
        expect(style.typography.body.fontFamily, 'FlareSans');
        expect(style.strings.save, '保存');
        expect(tester.takeException(), isNull);
      });
    }
  });
}
