import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _MemoryStorage implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

Widget _host(Widget child) => MaterialApp(
  theme: flareTheme(),
  locale: const Locale('zh'),
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  home: Scaffold(body: child),
);

void _phoneSize(WidgetTester tester) {
  tester.view.physicalSize = const Size(390, 844);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
}

void main() {
  final catalog = loadCatalogFixture();

  testWidgets('completed lessons still direct users to pending stage gates', (
    tester,
  ) async {
    _phoneSize(tester);
    final store = LearningStore(catalog: catalog, storage: _MemoryStorage());
    await store.initialize();
    addTearDown(store.dispose);
    final stage = catalog.stages.first;
    for (final lesson in stage.lessons) {
      await store.completeLesson(lesson.id);
    }
    expect(store.isStageUnlocked(2), isFalse);
    expect(store.isStagePassed(stage.n), isFalse);
    await tester.pumpWidget(
      _host(
        PathPage(
          catalog: catalog,
          store: store,
          onLesson: (_) => fail('Pending gates must not open another lesson'),
          onGate: (_, _) => fail('The action must not confirm gates itself'),
          onAssessment: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('全部完成'), findsNothing);
    final pending = find.widgetWithText(FilledButton, '待确认 · 本阶段过关条件');
    expect(tester.widget<FilledButton>(pending).onPressed, isNotNull);
    // Collapse the current stage to verify the action also restores its gates.
    await tester.tap(find.text(stage.title));
    await tester.pumpAndSettle();
    expect(find.text(stage.gates.first.text), findsNothing);
    await tester.tap(pending);
    await tester.pumpAndSettle();
    final firstGate = find.text(stage.gates.first.text);
    expect(firstGate, findsOneWidget);
    final viewport = tester.getRect(find.byType(ListView));
    expect(viewport.contains(tester.getCenter(firstGate)), isTrue);
    expect(store.gateReports, isEmpty);
    expect(store.isStageUnlocked(2), isFalse);
    expect(tester.takeException(), isNull);
  });

  testWidgets('all done appears only after lessons and stage gates pass', (
    tester,
  ) async {
    _phoneSize(tester);
    final store = LearningStore(catalog: catalog, storage: _MemoryStorage());
    await store.initialize();
    addTearDown(store.dispose);
    for (final stage in catalog.stages) {
      for (final lesson in stage.lessons) {
        await store.completeLesson(lesson.id);
      }
      for (final gate in stage.gates) {
        await store.reportGate(gate.id, true);
      }
    }
    await tester.pumpWidget(
      _host(
        PathPage(
          catalog: catalog,
          store: store,
          onLesson: (_) {},
          onGate: (_, _) {},
          onAssessment: () {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    final done = find.widgetWithText(FilledButton, '全部完成');
    expect(done, findsOneWidget);
    expect(tester.widget<FilledButton>(done).onPressed, isNull);
    expect(find.text('待确认 · 本阶段过关条件'), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('a session crossing Sunday midnight marks its Monday end date', (
    tester,
  ) async {
    _phoneSize(tester);
    final today = DateTime(2026, 10, 12, 12);
    final store = LearningStore(
      catalog: catalog,
      storage: _MemoryStorage(),
      now: () => today,
    );
    await store.initialize();
    addTearDown(store.dispose);
    await store.logSession(
      TrainingSession(
        id: 'sunday-to-monday',
        drillId: 'deltoids-A',
        startedAt: DateTime(2026, 10, 11, 23, 59),
        endedAt: DateTime(2026, 10, 12, 0, 1),
        activeSeconds: 60,
        completedSets: 3,
        plannedSets: 3,
        pain: false,
        completed: true,
      ),
    );
    expect(store.weekTrainingDays, 1);
    expect(store.streakDays, 1);
    await tester.pumpWidget(
      _host(
        ProgressPage(
          catalog: catalog,
          store: store,
          now: () => today,
          onDrill: (_) {},
        ),
      ),
    );
    await tester.pumpAndSettle();
    Color? dotColor(String label) {
      final day = tester.widget<Column>(
        find
            .ancestor(of: find.text(label), matching: find.byType(Column))
            .first,
      );
      final dot = day.children.first as Container;
      return (dot.decoration! as BoxDecoration).color;
    }

    expect(dotColor('一'), FlareColors.accent);
    expect(dotColor('日'), FlareColors.palette.track);
    expect(tester.takeException(), isNull);
  });
}
