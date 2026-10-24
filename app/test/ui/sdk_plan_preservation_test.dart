import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flare/coach/plan_mapping.dart';
import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/coach_service.dart';
import 'package:flare/coach/usage_store.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/ui/ai_coach_page.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/sdk_plan_editor_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;
import 'package:ugk_trainer/engine.dart' as trainer;

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage;

uc.TrainingPlan structuredPlan() => uc.TrainingPlan(
  id: 'structured',
  source: 'ai',
  title: '完整循环计划',
  summary: '保留结构',
  goal: 'strength',
  scene: 'home',
  level: 1,
  targetMinutes: 20,
  equipment: const ['mat'],
  avoid: const {'wrist'},
  notes: const ['原说明'],
  safetyNotes: const ['停止条件'],
  blocks: const [
    uc.PlanBlock(
      id: 'warm',
      name: '热身',
      type: uc.BlockType.warmup,
      items: [
        uc.PlanItem(
          exerciseId: 'scapular-A',
          mode: uc.DoseMode.reps,
          sets: 1,
          reps: 8,
          perSide: false,
          restSeconds: 15,
          note: '慢速',
        ),
      ],
    ),
    uc.PlanBlock(
      id: 'circuit',
      name: '循环训练',
      type: uc.BlockType.circuit,
      rounds: 3,
      restBetweenRoundsSeconds: 60,
      items: [
        uc.PlanItem(
          exerciseId: 'scapular-A',
          mode: uc.DoseMode.reps,
          sets: 2,
          reps: 12,
          perSide: false,
          restSeconds: 25,
          replacedFrom: 'old-action',
        ),
        uc.PlanItem(
          exerciseId: 'triceps-A',
          mode: uc.DoseMode.reps,
          sets: 1,
          reps: 10,
          perSide: false,
          restSeconds: 30,
        ),
      ],
    ),
  ],
);

uc.TrainingPlan segmentedPlan() => structuredPlan().copyWith(
  blocks: [
    const uc.PlanBlock(
      id: 'segments',
      name: '分段循环',
      type: uc.BlockType.circuit,
      rounds: 3,
      restBetweenRoundsSeconds: 60,
      items: [
        uc.PlanItem(
          exerciseId: 'scapular-A',
          mode: uc.DoseMode.reps,
          sets: 2,
          perSide: false,
          restSeconds: 30,
          note: '原父项备注',
          segments: [
            uc.PlanSegment(
              id: 'y',
              label: 'Y',
              exerciseId: 'scapular-A',
              mode: uc.DoseMode.reps,
              reps: 8,
            ),
            uc.PlanSegment(
              id: 't',
              label: 'T',
              exerciseId: 'triceps-A',
              mode: uc.DoseMode.time,
              workSeconds: 20,
            ),
            uc.PlanSegment(
              id: 'w',
              label: 'W',
              exerciseId: 'forearms-A',
              mode: uc.DoseMode.reps,
              reps: 6,
              holdSeconds: 2,
              rhythm: {
                'kind': 'rep_hold',
                'leadSeconds': 0,
                'phases': [
                  {'id': 'go', 'seconds': 1},
                  {'id': 'hold', 'seconds': 2},
                ],
              },
            ),
          ],
        ),
        uc.PlanItem(
          exerciseId: 'scapular-A',
          mode: uc.DoseMode.reps,
          sets: 1,
          reps: 10,
          perSide: false,
          restSeconds: 15,
        ),
      ],
    ),
  ],
);

void main() {
  final catalog = loadCatalogFixture();
  test('完整计划往返保留重复动作、块、轮休、剂量与元数据，执行次序由SDK确定', () {
    final plan = structuredPlan();
    final routine = TrainingRoutine(
      id: 'r',
      name: 'AI',
      drillIds: const [],
      sdkPlan: plan,
    );
    final restored = TrainingRoutine.fromJson(
      jsonDecode(jsonEncode(routine.toJson())) as Map<String, dynamic>,
    );
    expect(restored.valid, isTrue);
    expect(restored.drillIds, ['scapular-A', 'triceps-A']);
    expect(restored.sdkPlan!.toJson(), plan.toJson());
    final work = trainer.SessionBuilder()
        .phases(restored.sdkPlan!)
        .where((p) => p.isWork)
        .toList();
    expect(work.map((p) => p.exerciseId), [
      'scapular-A',
      'scapular-A',
      'triceps-A',
      'scapular-A',
      'triceps-A',
      'scapular-A',
      'triceps-A',
    ]);
    expect(work.map((p) => p.reps), [8, 12, 10, 12, 10, 12, 10]);
    expect(
      trainer.SessionBuilder()
          .phases(restored.sdkPlan!)
          .where((p) => p.kind == trainer.PhaseKind.roundRest)
          .map((p) => p.seconds),
      [60, 60],
    );
    final entries = CoachPlanMapper(catalog).entries(plan);
    expect(entries, hasLength(3));
    expect(entries.map((e) => e.blockIndex), [0, 1, 1]);
    expect(entries[0].dose!.target, 8);
    expect(entries[1].dose!.target, 12);
    expect(entries[1].doseText, '每轮 1 组 × 12 次');
    expect(entries[1].blockName, contains('3 轮'));
    expect(entries[1].blockName, contains('60 秒'));
  });

  test('SDK计划不按旧20动作/12组截断；缺目录动作阻止映射而非跳过', () {
    final plan = structuredPlan();
    final json = plan.toJson();
    json['blocks'] = [
      {
        ...plan.blocks.first.toJson(),
        'items': [
          for (var i = 0; i < 21; i++)
            {...plan.items.first.toJson(), 'exerciseId': 'id-$i', 'sets': 13},
        ],
      },
    ];
    final large = const uc.PlanCodec().decode(json);
    final routine = TrainingRoutine(
      id: 'r',
      name: 'large',
      drillIds: const [],
      sdkPlan: large,
    );
    expect(routine.valid, isTrue);
    expect(routine.sdkPlan!.items.length, 21);
    expect(routine.sdkPlan!.items.first.sets, 13);
    expect(() => CoachPlanMapper(catalog).entries(large), throwsStateError);
    expect(CoachPlanMapper(catalog).missingIds(large), hasLength(21));
  });

  test('旧routine兼容，结构化更新须传完整计划，损坏SDK数据不降级执行', () {
    final old = TrainingRoutine.fromJson({
      'id': 'old',
      'name': 'old',
      'drillIds': ['scapular-A'],
    });
    expect(old.sdkPlan, isNull);
    expect(old.copyWith(drillIds: ['triceps-A']).drillIds, ['triceps-A']);
    final saved = old.copyWith(sdkPlan: structuredPlan());
    expect(saved.drillIds, ['scapular-A', 'triceps-A']);
    expect(
      saved.copyWith(name: '新名').sdkPlan!.toJson(),
      structuredPlan().toJson(),
    );
    expect(() => saved.copyWith(drillIds: ['triceps-A']), throwsStateError);
    expect(
      () => TrainingRoutine.fromJson({
        'id': 'r',
        'name': 'bad',
        'drillIds': ['scapular-A'],
        'sdkPlan': {'blocks': 'broken'},
      }),
      throwsFormatException,
    );
  });

  test('坏SDK存档中单个item.mode或block.type不得被部分解码后覆写', () {
    final original = TrainingRoutine(
      id: 'r',
      name: 'AI',
      drillIds: const [],
      sdkPlan: structuredPlan(),
    ).toJson();
    for (final corruptMode in [true, false]) {
      final raw = jsonDecode(jsonEncode(original)) as Map<String, dynamic>;
      final blocks = (raw['sdkPlan'] as Map)['blocks'] as List;
      if (corruptMode) {
        ((blocks.last as Map)['items'] as List).first['mode'] = 'invalid-mode';
      } else {
        (blocks.last as Map)['type'] = 'invalid-type';
      }
      final before = jsonEncode(raw);
      // b8 can still return a non-null partial plan; the App must check errors.
      final decoded = const uc.PlanCodec().decodeStrict(raw['sdkPlan']);
      expect(decoded.plan, isNotNull);
      expect(decoded.ok, isFalse);
      expect(() => TrainingRoutine.fromJson(raw), throwsFormatException);
      expect(jsonEncode(raw), before);
    }
    expect(
      TrainingRoutine.fromJson(original).sdkPlan!.toJson(),
      structuredPlan().toJson(),
    );
    expect(
      TrainingRoutine.fromJson({
        'id': 'old',
        'name': 'old',
        'drillIds': ['scapular-A'],
      }).sdkPlan,
      isNull,
    );
  });

  test('0.4.1分段父剂量可空，Codec/显示保留有序分段和重复父项', () {
    final plan = segmentedPlan();
    final routine = TrainingRoutine(
      id: 'segments',
      name: '分段',
      drillIds: const [],
      sdkPlan: plan,
    );
    final restored = TrainingRoutine.fromJson(
      jsonDecode(jsonEncode(routine.toJson())) as Map<String, dynamic>,
    );
    expect(restored.sdkPlan!.toJson(), plan.toJson());
    expect(restored.sdkPlan!.items.first.reps, isNull);
    expect(restored.sdkPlan!.items.first.workSeconds, isNull);
    expect(restored.drillIds, ['scapular-A', 'triceps-A', 'forearms-A']);
    final entries = CoachPlanMapper(catalog).entries(restored.sdkPlan!);
    expect(
      entries,
      hasLength(2),
    ); // Assets are not additional parent exercises.
    expect(entries.map((entry) => entry.drill.id), [
      'scapular-A',
      'scapular-A',
    ]);
    expect(entries.first.dose, isNull);
    expect(
      entries.first.doseText,
      '每轮 1 组\n1. Y · 8 次\n2. T · 20 秒\n3. W · 6 次 · 停留 2 秒',
    );
    expect(entries.first.item.segments.map((segment) => segment.id), [
      'y',
      't',
      'w',
    ]);
    expect(
      entries.first.item.segments.last.rhythm,
      plan.items.first.segments.last.rhythm,
    );
    expect(entries.first.blockName, contains('3 轮'));
    expect(entries.last.dose!.target, 10);
  });

  test('坏分段不能被静默恢复，段素材缺失阻止整计划展示', () {
    final plan = segmentedPlan();
    final raw = TrainingRoutine(
      id: 'r',
      name: '坏分段',
      drillIds: const [],
      sdkPlan: plan,
    ).toJson();
    final firstItem =
        (((raw['sdkPlan'] as Map)['blocks'] as List).first as Map)['items']
            as List;
    ((firstItem.first as Map)['segments'] as List)[1]['mode'] = 'invalid';
    expect(() => TrainingRoutine.fromJson(raw), throwsFormatException);
    final missing = plan.copyWith(
      blocks: [
        uc.PlanBlock(
          id: 'missing',
          name: '',
          type: uc.BlockType.main,
          items: [
            plan.items.first.copyWith(
              segments: const [
                uc.PlanSegment(
                  id: 'm',
                  exerciseId: 'missing-segment',
                  mode: uc.DoseMode.time,
                  workSeconds: 20,
                ),
              ],
            ),
          ],
        ),
      ],
    );
    expect(CoachPlanMapper(catalog).missingIds(missing), {'missing-segment'});
    expect(() => CoachPlanMapper(catalog).entries(missing), throwsStateError);
  });

  Future<void> showEditor(
    WidgetTester tester,
    uc.TrainingPlan plan,
    ValueChanged<uc.TrainingPlan> save, {
    Future<bool> Function(uc.TrainingPlan)? persist,
  }) async {
    tester.view.physicalSize = const Size(390, 1100);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(),
        locale: const Locale('zh'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: SdkPlanEditorPage(
            plan: plan,
            catalog: catalog,
            onBack: () {},
            onSaved:
                persist ??
                (plan) async {
                  save(plan);
                  return true;
                },
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('保真编辑：改名、块内重排、删除空块，原剂量轮次备注保持', (tester) async {
    uc.TrainingPlan? saved;
    final plan = structuredPlan();
    await showEditor(tester, plan, (value) => saved = value);
    await tester.enterText(find.byKey(const ValueKey('sdk-plan-name')), '新名字');
    final list = tester.widget<ReorderableListView>(
      find.byKey(const ValueKey('sdk-plan-block-1')),
    );
    list.onReorderItem!(0, 1);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('sdk-plan-remove-0-0')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('sdk-plan-save')));
    expect(saved!.title, '新名字');
    expect(saved!.blocks, hasLength(1));
    expect(saved!.blocks.single.type, uc.BlockType.circuit);
    expect(saved!.blocks.single.rounds, 3);
    expect(saved!.blocks.single.restBetweenRoundsSeconds, 60);
    expect(saved!.items.map((item) => item.exerciseId), [
      'triceps-A',
      'scapular-A',
    ]);
    expect(saved!.items.last.toJson(), plan.blocks.last.items.first.toJson());
    expect(saved!.avoid, plan.avoid);
    expect(saved!.notes, plan.notes);
    expect(saved!.safetyNotes, plan.safetyNotes);
    expect(tester.takeException(), isNull);
  });

  testWidgets('整计划删除为空时不能保存', (tester) async {
    final plan = structuredPlan().copyWith(
      blocks: [structuredPlan().blocks.first],
    );
    uc.TrainingPlan? saved;
    await showEditor(tester, plan, (value) => saved = value);
    await tester.tap(find.byKey(const ValueKey('sdk-plan-remove-0-0')));
    await tester.pumpAndSettle();
    expect(
      tester
          .widget<PrimaryAction>(find.byKey(const ValueKey('sdk-plan-save')))
          .onPressed,
      isNull,
    );
    expect(saved, isNull);
  });
  testWidgets('保真编辑新增动作使用库默认剂量，原块和条目不改写', (tester) async {
    uc.TrainingPlan? saved;
    final plan = structuredPlan();
    await showEditor(tester, plan, (value) => saved = value);
    await tester.ensureVisible(find.byKey(const ValueKey('sdk-plan-add-1')));
    await tester.tap(find.byKey(const ValueKey('sdk-plan-add-1')));
    await tester.pumpAndSettle();
    final added = catalog.drillById('abs-A')!;
    await tester.enterText(
      find.byKey(const ValueKey('picker-search')),
      added.name,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('pick-abs-A')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('picker-done')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('sdk-plan-save')));
    await tester.pumpAndSettle();
    expect(saved!.blocks.first.toJson(), plan.blocks.first.toJson());
    expect(saved!.blocks.last.rounds, 3);
    expect(saved!.blocks.last.restBetweenRoundsSeconds, 60);
    expect(
      saved!.blocks.last.items.take(2).map((i) => i.toJson()),
      plan.blocks.last.items.map((i) => i.toJson()),
    );
    expect(saved!.items.last.exerciseId, 'abs-A');
    expect(saved!.items.last.sets, added.dose.sets);
    expect(saved!.items.last.restSeconds, added.dose.restSec);
  });

  testWidgets('保存期间防重复，持久化失败保留编辑并显示失败', (tester) async {
    final pending = Completer<bool>();
    var calls = 0;
    await showEditor(
      tester,
      structuredPlan(),
      (_) {},
      persist: (_) {
        calls++;
        return pending.future;
      },
    );
    await tester.tap(find.byKey(const ValueKey('sdk-plan-save')));
    await tester.pump();
    expect(
      tester
          .widget<PrimaryAction>(find.byKey(const ValueKey('sdk-plan-save')))
          .onPressed,
      isNull,
    );
    expect(calls, 1);
    pending.complete(false);
    await tester.pumpAndSettle();
    expect(
      find.text(
        AppLocalizations.of(
          tester.element(find.byType(SdkPlanEditorPage)),
        ).saveFailed,
      ),
      findsOneWidget,
    );
    expect(
      tester
          .widget<PrimaryAction>(find.byKey(const ValueKey('sdk-plan-save')))
          .onPressed,
      isNotNull,
    );
  });
  testWidgets('0.2分段计划编辑显示混合剂量，改名重排保存不丢分段节奏', (tester) async {
    final original = segmentedPlan();
    uc.TrainingPlan? saved;
    await showEditor(tester, original, (value) => saved = value);
    expect(find.textContaining('1. Y · 8 次'), findsOneWidget);
    expect(find.textContaining('2. T · 20 秒'), findsOneWidget);
    expect(find.textContaining('3. W · 6 次'), findsOneWidget);
    expect(tester.takeException(), isNull);
    await tester.enterText(find.byKey(const ValueKey('sdk-plan-name')), '分段改名');
    final list = tester.widget<ReorderableListView>(
      find.byKey(const ValueKey('sdk-plan-block-0')),
    );
    list.onReorderItem!(0, 1);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('sdk-plan-save')));
    await tester.pumpAndSettle();
    expect(saved!.title, '分段改名');
    expect(saved!.blocks.single.rounds, 3);
    expect(saved!.blocks.single.restBetweenRoundsSeconds, 60);
    expect(saved!.items.last.toJson(), original.items.first.toJson());
    expect(saved!.items.first.toJson(), original.items.last.toJson());
    expect(saved!.items.last.reps, isNull);
    expect(tester.takeException(), isNull);
  });
  testWidgets('AI分段卡按父项计数，完整显示各段并原样交付开练', (tester) async {
    tester.view.physicalSize = const Size(390, 1100);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    // The display fixture must also pass the actual coach gate: triceps-A is
    // reps-only in the trusted catalog, so use the timed abs-A for this segment.
    final raw = segmentedPlan().toJson();
    final items = ((raw['blocks'] as List).single as Map)['items'] as List;
    final segments = (items.first as Map)['segments'] as List;
    (segments[1] as Map)['exerciseId'] = 'abs-A';
    final plan = const uc.PlanCodec().decode(raw);
    final store = LearningStore(
      catalog: catalog,
      storage: MemoryStateStorage(),
    );
    await store.initialize();
    final service = CoachService(
      config: const CoachConfig(apiKey: 'test'),
      appCatalog: catalog,
      client: uc.FakeLlmClient(const []),
      usage: CoachUsageStore(),
      storage: MemoryStateStorage(),
      readAsset: (path) async => File(path).readAsStringSync(),
    );
    final session = AiCoachSession(service);
    await session.load();
    await session.acceptDisclaimer();
    expect(service.validatePlan(plan).errors, isEmpty);
    final admitted = uc.ToolGate(
      catalog: service.catalog,
      profile: service.profile,
    ).admitTemplate(plan);
    expect(admitted, isNotNull);
    service.restoreHistory([
      uc.CoachConversationMessage(
        id: 'saved-segmented-plan',
        at: DateTime.utc(2026, 10, 24),
        plan: admitted,
      ),
    ]);
    addTearDown(session.dispose);
    addTearDown(store.dispose);
    uc.TrainingPlan? started;
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(),
        locale: const Locale('zh'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: AiCoachPage(
            session: session,
            catalog: catalog,
            store: store,
            onBack: () {},
            onDrill: (_) {},
            onStart: (value) => started = value,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    final cardFinder = find.byType(cui.CoachPlanCard);
    expect(cardFinder, findsOneWidget);
    final card = tester.widget<cui.CoachPlanCard>(cardFinder);
    // Segment media are not independent parent rows. The SDK receives full
    // localized doses; its own expanded layout renders those public DTOs.
    expect(card.plan.items, hasLength(2));
    expect(card.plan.items.map((item) => item.exerciseId), [
      'scapular-A',
      'scapular-A',
    ]);
    expect(card.plan.items.first.detailDose, contains('3 轮'));
    expect(card.plan.items.first.detailDose, contains('1. Y · 8 次'));
    expect(card.plan.items.first.detailDose, contains('2. T · 20 秒'));
    expect(card.plan.items.first.detailDose, contains('3. W · 6 次 · 停留 2 秒'));
    expect(card.plan.items.last.detailDose, contains('10 次'));
    expect(card.saved, isFalse);
    card.onSave();
    card.onSave();
    await tester.pumpAndSettle();
    expect(store.routines, hasLength(1));
    expect(store.routines.single.sdkPlan!.toJson(), plan.toJson());
    final savedCard = tester.widget<cui.CoachPlanCard>(cardFinder);
    expect(savedCard.saved, isTrue);
    savedCard.onStart(() => null);
    expect(identical(started, plan), isTrue);
    expect(tester.takeException(), isNull);
  });
  testWidgets('段素材可另加为父项，manual腕部使用已发布默认次数而非占位1次', (tester) async {
    final original = segmentedPlan();
    uc.TrainingPlan? saved;
    await showEditor(tester, original, (value) => saved = value);
    final add = find.byKey(const ValueKey('sdk-plan-add-0'));
    await tester.ensureVisible(add);
    await tester.pumpAndSettle();
    await tester.tap(add);
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byKey(const ValueKey('picker-search')),
      catalog.drillById('forearms-A')!.name,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('pick-forearms-A')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('picker-done')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('sdk-plan-save')));
    await tester.pumpAndSettle();
    expect(saved!.items, hasLength(3));
    expect(saved!.items.first.toJson(), original.items.first.toJson());
    expect(saved!.items.last.exerciseId, 'forearms-A');
    expect(saved!.items.last.mode, uc.DoseMode.reps);
    expect(saved!.items.last.sets, 2);
    expect(saved!.items.last.reps, 10);
    expect(saved!.items.last.restSeconds, 15);
  });
}
