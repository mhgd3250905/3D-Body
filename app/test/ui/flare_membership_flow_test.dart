import 'package:flare/control/flare_membership.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/flare_membership_page.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' as helpers;

class _TestStore implements MembershipStore {
  MembershipTerm? purchased;
  static const offersForTest = [
    MembershipOffer(
      term: MembershipTerm.monthly,
      price: 2.99,
      currency: 'USD',
      localizedPrice: r'$2.99',
      trialDays: 3,
    ),
    MembershipOffer(
      term: MembershipTerm.annual,
      price: 19.99,
      currency: 'USD',
      localizedPrice: r'$19.99',
      localizedMonthlyPrice: r'$1.67',
      trialDays: 7,
    ),
  ];

  @override
  Future<List<MembershipOffer>> offers() async => offersForTest;

  @override
  Future<MembershipSnapshot> refresh() async =>
      const MembershipSnapshot('tester', null);

  @override
  Future<MembershipSnapshot> purchase(MembershipTerm term) async {
    purchased = term;
    return restore();
  }

  @override
  Future<MembershipSnapshot> restore() async =>
      MembershipSnapshot('tester', DateTime.now().add(const Duration(days: 1)));
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final previousShared = FlareShared.current;
  setUpAll(() async => FlareShared.current = await FlareShared.load());
  tearDownAll(() => FlareShared.current = previousShared);

  testWidgets(
    'angle training, saved routine training and copying ask for membership',
    (tester) async {
      await helpers.phoneSize(tester);
      final semantics = tester.ensureSemantics();
      final purchases = _TestStore();
      final membership = FlareMembership(purchases);
      final membershipBack = find.descendant(
        of: find.byType(FlareMembershipPage),
        matching: find.byType(FlareBackChip),
      );
      try {
        final catalog = loadCatalogFixture(includeFlarePlans: true);
        final store = LearningStore(
          catalog: catalog,
          storage: helpers.MemoryStateStorage(),
        );
        await store.initialize();
        await store.acknowledgeSafety();
        final routine = (await store.createRoutine('Audit routine', const [
          'abs-A',
        ]))!;
        final routineRow = find.byKey(ValueKey('routine-${routine.id}'));
        final scene = SceneController(commandSink: (_) {});
        addTearDown(store.dispose);
        addTearDown(scene.dispose);
        await tester.pumpWidget(
          helpers.testApp(
            FlareShell(
              catalog: catalog,
              store: store,
              sceneController: scene,
              enableScene: false,
              membership: membership,
              trainingPageBuilder: helpers.TrainingRouteProbe.new,
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
        await helpers.openPlansFromHome(tester);

        await helpers.tapVisible(tester, routineRow);
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('plan-start')));
        await tester.pumpAndSettle();
        expect(find.byType(FlareMembershipPage), findsOneWidget);
        expect(find.byType(helpers.TrainingRouteProbe), findsNothing);
        expect(find.text('免费试用 7 天'), findsOneWidget);
        expect(find.text('省 44%'), findsOneWidget);
        await tester.tap(membershipBack);
        await tester.pumpAndSettle();
        await tester.binding.handlePopRoute();
        await tester.pumpAndSettle();

        await helpers.tapVisible(
          tester,
          find.byKey(const ValueKey('plan-angle-11')),
        );
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('flare-plan-start')));
        await tester.pumpAndSettle();
        expect(find.byType(FlareMembershipPage), findsOneWidget);
        expect(find.byType(helpers.TrainingRouteProbe), findsNothing);
        await tester.tap(membershipBack);
        await tester.pumpAndSettle();
        await tester.binding.handlePopRoute();
        await tester.pumpAndSettle();
        final plansScroll = find.descendant(
          of: find.byKey(const PageStorageKey<String>('plans-scroll')),
          matching: find.byWidgetPredicate(
            (widget) =>
                widget is Scrollable &&
                widget.axisDirection == AxisDirection.down,
          ),
        );
        final position = tester.state<ScrollableState>(plansScroll).position;
        position.jumpTo(position.minScrollExtent);
        await tester.pumpAndSettle();
        await tester.tap(routineRow);
        await tester.pumpAndSettle();

        await helpers.tapVisible(
          tester,
          find.byKey(const ValueKey('plan-copy')),
        );
        await tester.pumpAndSettle();
        expect(find.byType(FlareMembershipPage), findsOneWidget);
        expect(store.routines, hasLength(1));
        await helpers.tapVisible(
          tester,
          find.byKey(const ValueKey('premium-monthly')),
        );
        await tester.pumpAndSettle();
        expect(find.text('免费试用 3 天'), findsOneWidget);
        await helpers.tapVisible(
          tester,
          find.byKey(const ValueKey('premium-subscribe')),
        );
        await tester.pumpAndSettle();
        expect(purchases.purchased, MembershipTerm.monthly);
        expect(find.byType(FlareMembershipPage), findsNothing);
        expect(find.byType(PlanDetailPage), findsOneWidget);
        expect(store.routines, hasLength(2));
        expect(store.routines.last.drillIds, ['abs-A']);
        helpers.assertNoFlutterError(tester);
        await tester.pumpWidget(const SizedBox());
      } finally {
        membership.dispose();
        semantics.dispose();
      }
    },
  );
}
