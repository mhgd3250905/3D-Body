import 'dart:convert';
import 'dart:io';

import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/coach_service.dart';
import 'package:flare/coach/plan_mapping.dart';
import 'package:flare/coach/template_fallback.dart';
import 'package:flare/coach/usage_store.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/domain/drill_timer.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/timer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';
import 'ai_coach_test.dart' show readAsset, validPlanEnvelope;
import 'flow_regressions_test.dart' as helpers;

/// PR #122 第二轮本机审核（F122-1 ~ F122-5）的回归测试。
void main() {
  final catalog = loadCatalogFixture();

  uc.TrainingPlan aiPlan() => const uc.EnvelopeParser()
      .parse(jsonEncode(validPlanEnvelope()), planId: 'p')
      .reply!
      .plan!;

  Drill aiTriceps() => CoachPlanMapper(
    catalog,
  ).entries(aiPlan()).firstWhere((e) => e.drill.id == 'triceps-A').drill;

  CoachService service({uc.FakeLlmClient? fake}) => CoachService(
    config: fake == null ? const CoachConfig() : const CoachConfig(apiKey: 't'),
    appCatalog: catalog,
    client: fake,
    usage: CoachUsageStore(),
    storage: helpers.MemoryStateStorage(),
    readAsset: readAsset,
  );

  /// 用真实 DrillTimer 跑一个动作：[finish]=false 时做完 1 组后中途退出。
  TrainingSession run(Drill drill, String id, {bool finish = true}) {
    var now = 0;
    final t = DrillTimer(drill.dose, now: () => now);
    final started = DateTime.utc(2026, 10, 20, 8);
    t.start();
    for (var i = 0; i < 20000; i++) {
      final p = t.snapshot.phase;
      if (p == TimerPhase.finished) break;
      if (!finish && t.snapshot.completedSets >= 1) break;
      now += 500;
      t.tick();
      if (t.snapshot.phase == TimerPhase.work) t.completeSet();
      if (t.snapshot.phase == TimerPhase.rest) t.skipRest();
    }
    if (!finish) t.abandon();
    return TrainingSession.fromTimer(
      id: id,
      drillId: drill.id,
      startedAt: started,
      endedAt: started.add(Duration(milliseconds: now + 1000)),
      snapshot: t.snapshot,
      pain: false,
    );
  }

  group('F122-1 合法 AI 四组可结束保存', () {
    test('正常完成 / 中途退出 / 保存 routine 后重新开练都能记录', () async {
      final store = LearningStore(
        catalog: catalog,
        storage: helpers.MemoryStateStorage(),
      );
      await store.initialize();
      final drill = aiTriceps();
      expect(drill.dose.sets, 4);
      expect(catalog.drillById('triceps-A')!.dose.setsMax, 3);

      final done = run(drill, 's-done');
      expect(done.completed, isTrue);
      expect(done.plannedSets, 4);
      expect(await store.logSession(done), isTrue);

      final quit = run(drill, 's-quit', finish: false);
      expect(quit.completed, isFalse);
      expect(quit.plannedSets, 4);
      expect(await store.logSession(quit), isTrue);

      final entries = CoachPlanMapper(catalog).entries(aiPlan());
      final routine = (await store.createRoutine(
        'AI',
        [for (final e in entries) e.drill.id],
        doses: {for (final e in entries) e.drill.id: e.dose!},
        source: 'ai',
      ))!;
      final again = routine.drills(catalog)[2];
      expect(again.dose.sets, 4);
      expect(await store.logSession(run(again, 's-again')), isTrue);
      expect(store.sessions.map((s) => s.id), ['s-done', 's-quit', 's-again']);
    });

    Future<bool> openTimer(
      WidgetTester tester,
      LearningStore store,
      Drill drill,
    ) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      var closed = false;
      var now = 0;
      await tester.pumpWidget(
        MaterialApp(
          theme: flareTheme(),
          locale: const Locale('zh'),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: Scaffold(
            body: SafeArea(
              child: TrainingTimerPage(
                drill: drill,
                store: store,
                now: () => now += 200,
                onClose: () => closed = true,
              ),
            ),
          ),
        ),
      );
      await tester.tap(find.widgetWithText(FilledButton, '开始'));
      for (var i = 0; i < 5; i++) {
        await tester.pump(const Duration(milliseconds: 100));
      }
      await tester.tap(find.byTooltip('结束本次练习'));
      for (var i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 100));
      }
      await tester.tap(find.text('结束并保存'));
      for (var i = 0; i < 6; i++) {
        await tester.pump(const Duration(milliseconds: 100));
      }
      return closed;
    }

    testWidgets('跟练页：AI 四组开始后结束并保存 → 记录并关闭', (tester) async {
      final store = LearningStore(
        catalog: catalog,
        storage: helpers.MemoryStateStorage(),
      );
      await store.initialize();
      addTearDown(store.dispose);
      expect(await openTimer(tester, store, aiTriceps()), isTrue);
      expect(store.sessions.single.plannedSets, 4);
      expect(find.text('正在保存…'), findsNothing);
      await tester.pumpWidget(const SizedBox());
    });

    testWidgets('跟练页：保存抛异常 → 不卡在「正在保存」，可重试', (tester) async {
      final store = _ThrowOnceStore(catalog);
      await store.initialize();
      addTearDown(store.dispose);
      expect(await openTimer(tester, store, aiTriceps()), isFalse);
      expect(find.text('正在保存…'), findsNothing);
      expect(find.text('重试'), findsOneWidget);
      await tester.tap(find.text('重试'));
      for (var i = 0; i < 4; i++) {
        await tester.pump(const Duration(milliseconds: 100));
      }
      expect(store.sessions, hasLength(1));
      await tester.pumpWidget(const SizedBox());
    });
  });

  group('F122-2 回落场景', () {
    test('「没有器械」不当作有器械；历史否定器械照样有效', () {
      expect(TemplateFallback.pickTier('在家没有器械，练核心', 'A'), 'A');
      expect(TemplateFallback.pickTier('没器械', 'B'), 'A');
      expect(TemplateFallback.pickTier('练核心', 'B', history: ['我在家，无器械']), 'A');
      final r = TemplateFallback(
        catalog,
      ).reply('在家没有器械，练核心', reason: PresetReason.offline, tier: 'A');
      expect(r.plan!.id, 'template-core-A');
    });

    test('历史健身房 → 本轮改在家：用居家档位', () async {
      final s = service(
        fake: uc.FakeLlmClient([
          {
            'kind': 'ask',
            'text': '想练几分钟？',
            'options': ['10分钟'],
          },
          const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
        ]),
      );
      final conv = uc.CoachConversation();
      await s.ask('在健身房练核心', conv);
      final plan = (await s.ask('改为在家练10分钟', conv)).reply!.plan!;
      expect(plan.id, 'template-core-A');
      expect(TemplateFallback.pickTier('在家练', 'B'), 'B');
    });
  });

  group('F122-3 回落保留保护约束', () {
    test('历史说手腕不舒服 → 断网热身回落不含手腕承重动作、带 avoid', () async {
      final s = service(
        fake: uc.FakeLlmClient([
          {'kind': 'reply', 'text': '好的，我会避开手腕承重。'},
          const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
        ]),
      );
      await s.load();
      final conv = uc.CoachConversation();
      await s.ask('手腕不舒服，别安排手腕承重', conv);
      final reply = (await s.ask('给我一个热身方案', conv)).reply!;
      final ids = reply.plan?.exerciseIds ?? const <String>{};
      expect(ids, isNot(contains('serratus-A')));
      for (final id in ids) {
        expect(s.catalog[id]!.cautions, isNot(contains('手腕')), reason: id);
      }
      // 热身徒手版 4 个动作里 3 个含手腕负担，只留肩胛动作。
      expect(ids, {'scapular-A'});
      expect(reply.plan!.avoid, contains('手腕'));
      expect(reply.text, contains('已去掉 3 个'));
    });

    test('预设动作全被约束剔除时只给说明、不给可开练计划', () async {
      final t = TemplateFallback(catalog, cautionsOf: (_) => const ['手腕']);
      final r = t.reply('手腕疼，练支撑', reason: PresetReason.offline, tier: 'A');
      expect(r.plan, isNull);
      expect(r.text, contains('手腕'));
      expect(TemplateFallback.protectedParts('手腕热身', const []), isEmpty);
    });

    test('顿号并列部位共享不适谓词：都保留（第三轮复审）', () {
      expect(TemplateFallback.protectedParts('手腕、肩都不舒服，做热身', const []), {
        '手腕',
        '肩',
      });
      expect(TemplateFallback.protectedParts('腰、膝都不舒服，练腿', const []), {
        '腰',
        '膝',
      });
      // 不扩大为「提到部位就避让」：前一段有自己的内容时不继承后一段的不适。
      expect(TemplateFallback.protectedParts('练肩、手腕不舒服', const []), {'手腕'});
    });

    Future<Set<String>> offlineIds(CoachService s, List<String> turns) async {
      await s.load();
      final conv = uc.CoachConversation();
      uc.CoachReply? last;
      for (final t in turns) {
        last = (await s.ask(t, conv)).reply;
      }
      return last!.plan?.exerciseIds ?? const <String>{};
    }

    test('未配置模型：手腕、肩都不舒服 → 热身回落剔除手腕/肩 cautions', () async {
      final s = service();
      final ids = await offlineIds(s, ['手腕、肩都不舒服，做热身']);
      expect(ids, isNot(contains('serratus-A')));
      for (final id in ids) {
        expect(
          s.catalog[id]!.cautions,
          isNot(anyOf(contains('手腕'), contains('肩'))),
          reason: id,
        );
      }
    });

    test('未配置模型：腰、膝都不舒服 → 练腿回落剔除腰/膝 cautions', () async {
      final s = service();
      final ids = await offlineIds(s, ['腰、膝都不舒服，练腿']);
      expect(ids, isNot(contains('glute-max-A')));
      expect(ids, isNot(contains('hamstrings-A')));
      for (final id in ids) {
        expect(
          s.catalog[id]!.cautions,
          isNot(anyOf(contains('腰'), contains('膝'))),
          reason: id,
        );
      }
    });

    test('历史说手腕、肩都不舒服 → 断网热身回落两者都保留', () async {
      final s = service(
        fake: uc.FakeLlmClient([
          {'kind': 'reply', 'text': '好的，会避开手腕和肩的负担。'},
          const uc.LlmException(uc.LlmErrorKind.network, 'offline'),
        ]),
      );
      final ids = await offlineIds(s, ['手腕、肩都不舒服', '给我一个热身方案']);
      expect(ids, isNot(contains('serratus-A')));
      for (final id in ids) {
        expect(
          s.catalog[id]!.cautions,
          isNot(anyOf(contains('手腕'), contains('肩'))),
          reason: id,
        );
      }
    });
  });

  group('F122-4 远端目录切换后重算范围', () {
    test('远端新增 flarelab 动作但 App 没有：排除出范围、校验报错', () async {
      final s = service(fake: uc.FakeLlmClient(const []));
      await s.load();
      expect(s.excludedIds, isEmpty);
      final json =
          jsonDecode(File(CoachService.catalogAsset).readAsStringSync())
              as Map<String, dynamic>;
      final drills = json['drills'] as List;
      final copy = Map<String, dynamic>.from(
        drills.firstWhere((d) => d['id'] == 'triceps-A') as Map,
      );
      copy['id'] = 'remote-new-A';
      copy['apps'] = ['flarelab'];
      drills.add(copy);
      json['version'] = '9.9.9';
      final next = uc.CatalogPayload(
        text: jsonEncode(json),
        origin: 'remote',
        sha256: 'x',
      ).parse();
      s.catalogRepository.replace(next, origin: 'remote');

      expect(s.excludedIds, {'remote-new-A'});
      expect(
        s.profile.scope(s.catalog).map((d) => d.id),
        isNot(contains('remote-new-A')),
      );
      final env = validPlanEnvelope();
      ((((env['plan'] as Map)['blocks'] as List)[1] as Map)['items']
              as List)[0]['exerciseId'] =
          'remote-new-A';
      final plan = const uc.EnvelopeParser()
          .parse(jsonEncode(env), planId: 'p')
          .reply!
          .plan!;
      expect(s.assistant!.validate(plan).errors, isNotEmpty);
    });
  });

  group('F122-5 编辑已保存 AI 计划', () {
    testWidgets('编辑页显示保存的剂量与估时，保存后内容不变', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      final store = LearningStore(
        catalog: catalog,
        storage: helpers.MemoryStateStorage(),
      );
      await store.initialize();
      addTearDown(store.dispose);
      final entries = CoachPlanMapper(catalog).entries(aiPlan());
      final routine = (await store.createRoutine(
        'AI',
        [for (final e in entries) e.drill.id],
        doses: {for (final e in entries) e.drill.id: e.dose!},
        source: 'ai',
      ))!;
      TrainingRoutine? saved;
      await tester.pumpWidget(
        MaterialApp(
          theme: flareTheme(),
          locale: const Locale('zh'),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: Scaffold(
            body: RoutineEditorPage(
              catalog: catalog,
              store: store,
              routine: routine,
              onBack: () {},
              onSaved: (r) => saved = r,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final defaultText = catalog.drillById('triceps-A')!.prescription;
      expect(find.text('4 组 × 8 次'), findsOneWidget);
      expect(find.text(defaultText), findsNothing);
      final minutes = estimateMinutes(routine.drills(catalog));
      expect(find.textContaining('$minutes'), findsWidgets);
      expect(
        minutes,
        isNot(
          estimateMinutes([
            for (final id in routine.drillIds) catalog.drillById(id)!,
          ]),
        ),
      );
      await tester.tap(find.byKey(const ValueKey('routine-save')));
      await tester.pumpAndSettle();
      expect(saved!.doses['triceps-A']!.text, '4 组 × 8 次');
      await tester.pumpWidget(const SizedBox());
      await tester.pump(const Duration(seconds: 5));
    });
  });
}

class _ThrowOnceStore extends LearningStore {
  _ThrowOnceStore(Catalog catalog)
    : super(catalog: catalog, storage: helpers.MemoryStateStorage());
  var _thrown = false;
  @override
  Future<bool> logSession(TrainingSession session) {
    if (!_thrown) {
      _thrown = true;
      throw ArgumentError('Invalid training session');
    }
    return super.logSession(session);
  }
}
