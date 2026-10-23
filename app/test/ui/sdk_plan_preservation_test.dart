import 'dart:async';
import 'dart:convert';

import 'package:flare/coach/plan_mapping.dart';
import 'package:flare/domain/training_plan.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/sdk_plan_editor_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/engine.dart' as trainer;

import '../domain/fixtures.dart';

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
    expect(entries[0].dose.target, 8);
    expect(entries[1].dose.target, 12);
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
}
