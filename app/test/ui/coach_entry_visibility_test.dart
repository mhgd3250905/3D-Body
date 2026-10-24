import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/coach_service.dart';
import 'package:flare/coach/usage_store.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'coach_agent_fixtures.dart';
import 'flow_regressions_test.dart' as helpers;

void main() {
  test('Empty and whitespace credentials keep AI disabled', () {
    expect(const CoachConfig().configured, isFalse);
    expect(const CoachConfig(apiKey: ' \n').configured, isFalse);
    expect(const CoachConfig(relayToken: ' ').configured, isFalse);
    expect(const CoachConfig(apiKey: 'test-key').configured, isTrue);
    expect(const CoachConfig(relayToken: 'test-relay').configured, isTrue);
  });

  for (final configured in [false, true]) {
    testWidgets('All AI entry points respect Key presence: $configured', (
      tester,
    ) async {
      await helpers.phoneSize(tester);
      final semantics = tester.ensureSemantics();
      try {
        final catalog = loadCatalogFixture();
        final store = LearningStore(
          catalog: catalog,
          storage: helpers.MemoryStateStorage(),
        );
        await store.initialize();
        await store.acknowledgeSafety();
        final scene = SceneController(commandSink: (_) {});
        final fake = AgentFakeLlmClient(const []);
        final coach = CoachService(
          appCatalog: catalog,
          config: configured
              ? const CoachConfig(apiKey: 'test-key')
              : const CoachConfig(),
          client: configured ? fake : null,
          usage: CoachUsageStore(),
          storage: helpers.MemoryStateStorage(),
        );
        addTearDown(store.dispose);
        addTearDown(scene.dispose);
        await tester.pumpWidget(
          MaterialApp(
            theme: flareTheme(),
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
        final plans = tester.widget<PlansPage>(find.byType(PlansPage));
        expect(plans.onAiCoach != null, configured);
        expect(
          find.byKey(const ValueKey('plan-ai-coach')),
          configured ? findsOneWidget : findsNothing,
        );
        expect(
          find.byKey(const ValueKey('plan-ai-unconfigured')),
          findsNothing,
        );

        await tester.tap(find.byTooltip('返回').first);
        await tester.pumpAndSettle();
        await tester.tap(helpers.labeledControl('更多'));
        await tester.pumpAndSettle();
        await tester.tap(find.text('设置').last);
        await tester.pumpAndSettle();
        // Settings builds its rows in a scrollable Column; checking the actual
        // row also covers offscreen entry points, not only the first viewport.
        expect(
          find.byKey(const ValueKey('settings-ai-usage')),
          configured ? findsOneWidget : findsNothing,
        );
        expect(fake.requests, isEmpty);
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
        await tester.pumpAndSettle();
      } finally {
        semantics.dispose();
      }
    });
  }
}
