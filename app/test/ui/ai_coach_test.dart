import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/coach_service.dart';
import 'package:flare/coach/plan_mapping.dart';
import 'package:flare/coach/template_fallback.dart';
import 'package:flare/coach/usage_store.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/domain/dose.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';
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
  );

  group('服务与映射', () {
    test('范围 = profile 白名单 ∩ App 动作与视频；交集完整时不改 profile', () async {
      final s = service(fake: uc.FakeLlmClient(const []));
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

      final s = service(fake: uc.FakeLlmClient(const []), reader: reader);
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
      final report = s.assistant!.validate(plan);
      expect(report.errorCategories, contains('E_SCOPE'));
    });

    test('合格样例计划通过 SDK 校验', () async {
      final s = service(fake: uc.FakeLlmClient(const []));
      await s.load();
      final plan = const uc.EnvelopeParser()
          .parse(jsonEncode(validPlanEnvelope()), planId: 'p')
          .reply!
          .plan!;
      expect(s.assistant!.validate(plan).errors, isEmpty);
    });

    test('计划映射：块拍平、轮数折进组数、剂量随 routine 保存', () {
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
      final triceps = entries[2];
      expect(triceps.dose!.sets, 4); // 2 组 × 2 轮
      expect(triceps.drill.dose.sets, 4);
      expect(triceps.drill.dose.min, 8);
      expect(triceps.doseText, '4 组 × 8 次');
      final side = entries[3];
      expect(side.drill.dose.mode, DoseMode.time);
      expect(side.drill.dose.perSide, isTrue);
      expect(side.doseText, '2 组 × 每侧 20 秒');

      final routine = TrainingRoutine(
        id: 'r1',
        name: 'AI',
        drillIds: [for (final e in entries) e.drill.id],
        doses: {for (final e in entries) e.drill.id: e.dose!},
        source: 'ai',
      );
      final back = TrainingRoutine.fromJson(
        jsonDecode(jsonEncode(routine.toJson())) as Map<String, dynamic>,
      );
      expect(back.doses.keys, routine.drillIds);
      expect(back.drills(catalog)[2].dose.sets, 4);
      expect(back.source, 'ai');
      // 去掉一个动作，剂量跟着去掉；旧格式（没有 doses）照常读。
      expect(back.copyWith(drillIds: ['abs-A']).doses, isEmpty);
      expect(
        TrainingRoutine.fromJson({
          'id': 'r2',
          'name': 'old',
          'drillIds': ['abs-A'],
        }).drills(catalog).single.dose.raw,
        catalog.drillById('abs-A')!.dose.raw,
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

  group('PR #122 审核：多轮回落记得先前约束', () {
    test('未配置：先说做了手术，第二轮仍不给计划', () async {
      final s = service();
      final conv = uc.CoachConversation();
      expect((await s.ask('我做了手术，想恢复训练', conv)).reply!.plan, isNull);
      final a2 = await s.ask('给我一个简单方案', conv);
      expect(a2.reply!.plan, isNull);
      expect(a2.reply!.text, contains('就医'));
    });

    test('首轮模型建议就医、第二轮断网：回落仍不给计划', () async {
      final s = service(
        fake: uc.FakeLlmClient([
          {'kind': 'reply', 'text': '术后请先咨询医生，确认可以练再来。'},
          const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
        ]),
      );
      final conv = uc.CoachConversation();
      await s.ask('我做了手术，想恢复训练', conv);
      expect((await s.ask('给我一个简单方案', conv)).reply?.plan, isNull);
    });

    test('健身房练核心 → 追问时长 → 答「10分钟」时断网：回落仍是核心、健身房版', () async {
      final s = service(
        fake: uc.FakeLlmClient([
          {
            'kind': 'ask',
            'text': '想练几分钟？',
            'options': ['10分钟', '20分钟'],
          },
          const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
        ]),
      );
      final conv = uc.CoachConversation();
      await s.ask('在健身房，想练核心', conv);
      final plan = (await s.ask('10分钟', conv)).reply?.plan;
      expect(plan, isNotNull);
      expect(plan!.id, 'template-core-C');
    });
  });

  group('AI 定制页', () {
    Future<LearningStore> pumpShell(
      WidgetTester tester,
      CoachService coach, {
      Size size = const Size(390, 844),
      double textScale = 1,
      Brightness brightness = Brightness.light,
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
        storage: helpers.MemoryStateStorage(),
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

    Future<void> say(WidgetTester tester, String text) async {
      await tester.enterText(find.byKey(const ValueKey('coach-input')), text);
      await tester.tap(find.byKey(const ValueKey('coach-send')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 50));
      await tester.pumpAndSettle();
    }

    Future<void> tapVisible(WidgetTester tester, Finder f) async {
      await tester.scrollUntilVisible(
        f,
        200,
        scrollable: find.descendant(
          of: find.byKey(const ValueKey('coach-list')),
          matching: find.byType(Scrollable),
        ),
      );
      await tester.pumpAndSettle();
      await tester.tap(f);
      await tester.pumpAndSettle();
    }

    testWidgets('生成 → 渲染计划卡 → 保存 → 出现在我的计划 → 开始训练', (tester) async {
      final usage = CoachUsageStore();
      final fake = uc.FakeLlmClient([validPlanEnvelope()]);
      final coach = service(fake: fake, usage: usage);
      final store = await pumpShell(tester, coach);
      expect(find.byKey(const ValueKey('plan-ai-unconfigured')), findsNothing);
      await openCoach(tester);
      expect(find.text('说说你想怎么练'), findsOneWidget);
      await say(tester, '在家 20 分钟，练支撑臂');

      expect(fake.requests, hasLength(1));
      expect(find.byKey(const ValueKey('coach-plan-card')), findsOneWidget);
      expect(find.byKey(const ValueKey('coach-badge-ai')), findsOneWidget);
      expect(find.text('居家支撑臂 20 分钟'), findsOneWidget);
      expect(find.text('4 组 × 8 次'), findsOneWidget);
      expect(find.text(catalog.drillById('triceps-A')!.name), findsOneWidget);
      expect(find.byType(DrillPoster), findsNWidgets(4));
      expect(usage.totals.calls, 1);

      await tapVisible(tester, find.byKey(const ValueKey('coach-save')));
      expect(store.routines, hasLength(1));
      final routine = store.routines.single;
      expect(routine.name, '居家支撑臂 20 分钟');
      expect(routine.source, 'ai');
      expect(routine.doses['triceps-A']!.sets, 4);
      expect(find.text('已保存到我的计划'), findsOneWidget);

      // 直接开练：进入跟练，第一项是热身动作。
      await tapVisible(tester, find.byKey(const ValueKey('coach-start')));
      final run = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(run.title, '居家支撑臂 20 分钟');
      expect(run.drills.map((d) => d.id).first, 'forearms-A');
      expect(run.drills[2].dose.sets, 4);

      // 结束跟练回到对话，再返回计划页：我的计划里有这份。
      await tester.tap(find.byKey(const ValueKey('run-end')));
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('coach-plan-card')), findsOneWidget);
      expect(find.text('已保存到我的计划'), findsOneWidget);
      await tester.tap(find.byTooltip('返回').first);
      await tester.pumpAndSettle();
      expect(find.byKey(ValueKey('routine-${routine.id}')), findsOneWidget);
      await tester.tap(find.byKey(ValueKey('routine-${routine.id}')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('plan-start')));
      await tester.pumpAndSettle();
      final again = tester.widget<PlanRunPage>(find.byType(PlanRunPage));
      expect(again.drills[2].dose.sets, 4);
      expect(again.drills[3].prescription, '2 组 × 每侧 20 秒');
      expect(tester.takeException(), isNull);
    });

    testWidgets('助理追问一次 → 点选项 → 出计划；第二轮要求直接出计划', (tester) async {
      final fake = uc.FakeLlmClient([
        {
          'kind': 'ask',
          'text': '在家还是健身房？',
          'options': ['在家', '健身房'],
        },
        validPlanEnvelope(),
      ]);
      final coach = service(fake: fake);
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '想练支撑');
      expect(find.text('在家还是健身房？'), findsOneWidget);
      expect(find.byKey(const ValueKey('coach-plan-card')), findsNothing);
      await tester.tap(find.byKey(const ValueKey('coach-option-0')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 50));
      await tester.pumpAndSettle();
      expect(fake.requests, hasLength(2));
      expect(fake.requests.last.messages.last.content, contains('已经追问过一次'));
      expect(fake.requests.last.messages.last.content, contains('在家'));
      expect(find.byKey(const ValueKey('coach-plan-card')), findsOneWidget);
      // 选项只在最新一条追问上可点。
      final chip = tester.widget<ActionChip>(
        find.byKey(const ValueKey('coach-option-0')),
      );
      expect(chip.onPressed, isNull);
    });

    testWidgets('第一次输出校验失败 → 带错误重写 → 通过', (tester) async {
      final bad = validPlanEnvelope();
      final blocks = ((bad['plan'] as Map)['blocks'] as List);
      ((blocks[0] as Map)['items'] as List)[0] = {
        'exerciseId': 'made-up-drill',
        'mode': 'reps',
        'sets': 2,
        'reps': 10,
        'perSide': false,
        'restSeconds': 15,
      };
      final usage = CoachUsageStore();
      final fake = uc.FakeLlmClient([bad, validPlanEnvelope()]);
      final coach = service(fake: fake, usage: usage);
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '在家 20 分钟，练支撑臂');
      expect(fake.requests, hasLength(2));
      expect(fake.requests.last.messages.last.content, contains('E_UNKNOWN'));
      expect(find.byKey(const ValueKey('coach-badge-ai')), findsOneWidget);
      expect(find.byKey(const ValueKey('coach-badge-preset')), findsNothing);
      expect(usage.records.map((r) => r.outcome), [
        uc.CallOutcome.rejected,
        uc.CallOutcome.rewritten,
      ]);
    });

    testWidgets('两次校验失败 → 回落预设方案并说明', (tester) async {
      final bad = validPlanEnvelope();
      (((bad['plan'] as Map)['blocks'] as List)[1] as Map)['items'] = [
        {
          'exerciseId': 'deltoids-A',
          'mode': 'time',
          'sets': 1,
          'workSeconds': 20,
          'perSide': false, // 单侧动作没标每侧
          'restSeconds': 30,
        },
      ];
      final coach = service(fake: uc.FakeLlmClient([bad, bad]));
      await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '想练核心');
      expect(find.byKey(const ValueKey('coach-badge-preset')), findsOneWidget);
      expect(find.byKey(const ValueKey('coach-preset-note')), findsOneWidget);
      expect(find.textContaining('AI 两次都没排出合格的计划'), findsOneWidget);
      expect(find.textContaining('核心折叠'), findsWidgets);
    });

    testWidgets('断网 → 离线回落预设方案，可保存可开练', (tester) async {
      final usage = CoachUsageStore();
      final fake = uc.FakeLlmClient([
        const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
      ]);
      final coach = service(fake: fake, usage: usage);
      final store = await pumpShell(tester, coach);
      await openCoach(tester);
      await say(tester, '健身房练腿');
      expect(fake.requests, hasLength(1)); // 网络错误不重写
      expect(find.textContaining('网络不可用'), findsOneWidget);
      expect(find.byKey(const ValueKey('coach-badge-preset')), findsOneWidget);
      final legsGym = PresetPlan.byId('legs')!.drills(catalog, 'C');
      expect(find.text(legsGym.first.name), findsOneWidget);
      await tapVisible(tester, find.byKey(const ValueKey('coach-save')));
      expect(store.routines.single.drillIds, [for (final d in legsGym) d.id]);
      expect(store.routines.single.doses, isEmpty); // 预设沿用动作库处方
      expect(store.routines.single.source, 'template');
      expect(usage.records.single.turnOutcome, uc.TurnOutcome.fallback);
    });

    testWidgets('未配置 key：入口显示未配置，不调模型，直接给预设方案', (tester) async {
      final coach = service();
      expect(coach.configured, isFalse);
      await pumpShell(tester, coach);
      expect(
        find.byKey(const ValueKey('plan-ai-unconfigured')),
        findsOneWidget,
      );
      await openCoach(tester);
      expect(find.text('未配置 AI · 使用预设方案'), findsOneWidget);
      expect(
        find.byKey(const ValueKey('coach-unconfigured-note')),
        findsOneWidget,
      );
      await say(tester, '先做个手腕热身');
      expect(find.textContaining('AI 还没配置'), findsOneWidget);
      expect(find.byKey(const ValueKey('coach-badge-preset')), findsOneWidget);
      expect(find.textContaining('热身激活'), findsWidgets);
      expect(coach.usage.totals.calls, 0);
    });

    testWidgets('首次使用显示免责说明，确认后不再显示', (tester) async {
      final storage = _Memory();
      final coach = service(storage: storage);
      await pumpShell(tester, coach);
      await tester.tap(find.byKey(const ValueKey('plan-ai-coach')));
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('coach-disclaimer')), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('coach-disclaimer-ok')));
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('coach-disclaimer')), findsNothing);
      expect(storage.value, contains('disclaimerAccepted'));
      final again = service(storage: storage);
      await again.load();
      expect(again.disclaimerAccepted, isTrue);
    });

    testWidgets('等待中显示分步进度与已用时，可停止；停止后原话回到输入框', (tester) async {
      final coach = service(
        fake: uc.FakeLlmClient([
          (uc.LlmRequest r) async {
            await Future<void>.delayed(const Duration(seconds: 30));
            return jsonEncode(validPlanEnvelope());
          },
        ]),
      );
      await pumpShell(tester, coach);
      await openCoach(tester);
      await tester.enterText(find.byKey(const ValueKey('coach-input')), '练支撑');
      await tester.tap(find.byKey(const ValueKey('coach-send')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byKey(const ValueKey('coach-thinking')), findsOneWidget);
      expect(find.text('正在理解你的需求…'), findsOneWidget);
      await tester.pump(const Duration(seconds: 8));
      expect(find.textContaining('正在从托马斯动作库里挑动作'), findsOneWidget);
      expect(find.textContaining('已用'), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('coach-stop')));
      await tester.pump(const Duration(seconds: 30));
      await tester.pumpAndSettle();
      expect(find.byKey(const ValueKey('coach-thinking')), findsNothing);
      expect(find.byKey(const ValueKey('coach-plan-card')), findsNothing);
      final field = tester.widget<TextField>(
        find.byKey(const ValueKey('coach-input')),
      );
      expect(field.controller!.text, '练支撑');
    });

    Finder inMsg(int i, String key) => find.descendant(
      of: find.byKey(ValueKey('coach-msg-$i')),
      matching: find.byKey(ValueKey(key)),
    );
    Finder textInMsg(int i, String text) => find.descendant(
      of: find.byKey(ValueKey('coach-msg-$i')),
      matching: find.text(text),
    );

    Map<String, Object?> planWithId(String id, int tricepsReps) {
      final env = validPlanEnvelope();
      final plan = env['plan'] as Map<String, Object?>;
      plan['id'] = id;
      ((((plan['blocks'] as List)[1] as Map)['items'] as List)[0]
              as Map)['reps'] =
          tricepsReps;
      return env;
    }

    Future<void> dismissSnack(WidgetTester tester) async {
      await tester.pump(const Duration(seconds: 5));
      await tester.pumpAndSettle();
    }

    testWidgets('模型两轮给同一 plan id：第二张卡未保存，可单独保存', (tester) async {
      final store = await pumpShell(
        tester,
        service(
          fake: uc.FakeLlmClient([
            planWithId('plan-1', 8),
            planWithId('plan-1', 6),
          ]),
        ),
      );
      await openCoach(tester);
      await say(tester, '在家 20 分钟，练支撑臂');
      await tapVisible(tester, inMsg(1, 'coach-save'));
      await dismissSnack(tester);
      await say(tester, '次数少一点');
      expect(textInMsg(3, '保存到我的计划'), findsOneWidget);
      await tapVisible(tester, inMsg(3, 'coach-save'));
      expect(store.routines, hasLength(2));
      expect(store.routines.last.doses['triceps-A']!.target, 6);
      expect(textInMsg(1, '已保存到我的计划'), findsOneWidget);
      expect(textInMsg(3, '已保存到我的计划'), findsOneWidget);
    });

    testWidgets('预设 template-* 多轮：每张卡各自保存', (tester) async {
      final store = await pumpShell(tester, service());
      await openCoach(tester);
      await say(tester, '练腿');
      await tapVisible(tester, inMsg(1, 'coach-save'));
      await dismissSnack(tester);
      await say(tester, '再来一组练腿');
      expect(textInMsg(3, '保存到我的计划'), findsOneWidget);
      await tapVisible(tester, inMsg(3, 'coach-save'));
      expect(store.routines, hasLength(2));
    });

    testWidgets('删除已保存的计划后：原计划可重新保存且内容一致', (tester) async {
      final store = await pumpShell(
        tester,
        service(fake: uc.FakeLlmClient([validPlanEnvelope()])),
      );
      await openCoach(tester);
      await say(tester, '在家 20 分钟，练支撑臂');
      await tapVisible(tester, find.byKey(const ValueKey('coach-save')));
      final first = store.routines.single;
      await dismissSnack(tester);
      await store.deleteRoutine(first.id);
      await tester.pumpAndSettle();
      expect(store.routines, isEmpty);
      expect(find.text('保存到我的计划'), findsOneWidget);
      await tapVisible(tester, find.byKey(const ValueKey('coach-save')));
      final again = store.routines.single;
      expect(again.name, first.name);
      expect(again.drillIds, first.drillIds);
      expect(again.doses['triceps-A']!.sets, 4);
      expect(find.text('已保存到我的计划'), findsOneWidget);
    });

    testWidgets('重试退避中停止：立即结束、无第二次请求、不回落、恢复输入', (tester) async {
      var calls = 0;
      var sleeping = false;
      final gate = Completer<void>();
      final client = uc.OpenAiCompatibleClient(
        config: const uc.LlmConfig(
          baseUrl: 'https://gw.example.com/v1/',
          model: 'm',
          maxRetries: 2,
        ),
        sleep: (_) {
          sleeping = true;
          return gate.future;
        },
        httpClient: MockClient((_) async {
          calls++;
          return http.Response('limited', 429, headers: {'retry-after': '30'});
        }),
      );
      final usage = CoachUsageStore();
      final coach = CoachService(
        config: const CoachConfig(apiKey: 'test'),
        appCatalog: catalog,
        client: client,
        usage: usage,
        storage: _Memory(),
        readAsset: readAsset,
      );
      await pumpShell(tester, coach);
      await openCoach(tester);
      await tester.enterText(find.byKey(const ValueKey('coach-input')), '练支撑');
      await tester.tap(find.byKey(const ValueKey('coach-send')));
      for (var i = 0; i < 20 && !sleeping; i++) {
        await tester.pump(const Duration(milliseconds: 50));
      }
      expect(sleeping, isTrue);
      expect(find.byKey(const ValueKey('coach-thinking')), findsOneWidget);
      await tester.tap(find.byKey(const ValueKey('coach-stop')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byKey(const ValueKey('coach-thinking')), findsNothing);
      expect(calls, 1);
      expect(find.byKey(const ValueKey('coach-msg-1')), findsNothing);
      expect(find.byKey(const ValueKey('coach-badge-preset')), findsNothing);
      final field = tester.widget<TextField>(
        find.byKey(const ValueKey('coach-input')),
      );
      expect(field.controller!.text, '练支撑');
      expect(usage.records.single.outcome, uc.CallOutcome.cancelled);
    });

    for (final dark in [false, true]) {
      testWidgets('360 宽 + 1.3 倍字号${dark ? '（深色）' : ''}不溢出', (tester) async {
        final coach = service(fake: uc.FakeLlmClient([validPlanEnvelope()]));
        await pumpShell(
          tester,
          coach,
          size: const Size(360, 740),
          textScale: 1.3,
          brightness: dark ? Brightness.dark : Brightness.light,
        );
        await openCoach(tester);
        await say(tester, '在家 20 分钟，练支撑臂');
        expect(find.byKey(const ValueKey('coach-plan-card')), findsOneWidget);
        await tapVisible(tester, find.byKey(const ValueKey('coach-save')));
        expect(tester.takeException(), isNull);
      });
    }
  });
}
