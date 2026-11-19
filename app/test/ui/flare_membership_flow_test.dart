import 'package:flare/control/flare_membership.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/components.dart' show PrimaryAction;
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/flare_membership_page.dart';
import 'package:flare/ui/flare_premium_preview.dart';
import 'package:flare/ui/page_kit.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' as helpers;

class _TestStore implements MembershipStore {
  MembershipTerm? purchased;
  bool offline = false;
  int offerRequests = 0;
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
  Future<List<MembershipOffer>> offers() async {
    offerRequests++;
    if (offline) throw Exception('Store is offline');
    return offersForTest;
  }

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

  testWidgets('offline prices stay visible and subscribe retries the store', (
    tester,
  ) async {
    await helpers.phoneSize(tester);
    final store = _TestStore()..offline = true;
    final membership = FlareMembership(store);
    await tester.pumpWidget(
      helpers.testApp(
        FlareMembershipPage(
          membership: membership,
          catalog: loadCatalogFixture(includeFlarePlans: true),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final annual = find.byKey(const ValueKey('premium-annual'));
    final monthly = find.byKey(const ValueKey('premium-monthly'));
    final subscribe = find.byKey(const ValueKey('premium-subscribe'));
    expect(
      tester.getTopLeft(annual).dy,
      lessThan(tester.getTopLeft(monthly).dy),
    );
    expect(find.text(r'$19.99/年', findRichText: true), findsOneWidget);
    expect(find.text('免费试用 7 天'), findsNothing);
    expect(find.textContaining('符合资格可免费试用 7 天'), findsOneWidget);
    expect(find.text('符合资格可免费试用 3 天'), findsOneWidget);
    expect(find.text(r'订阅 $19.99/年'), findsOneWidget);
    expect(find.text('暂未连上 Google Play，价格以商店显示为准'), findsOneWidget);
    await helpers.tapVisible(tester, subscribe);
    await tester.pumpAndSettle();
    expect(find.text('仍未连上 Google Play，请稍后重试'), findsOneWidget);
    expect(store.offerRequests, 2);
    expect(store.purchased, isNull);

    await helpers.tapVisible(tester, monthly);
    await tester.pumpAndSettle();
    expect(find.text(r'订阅 $2.99/月'), findsOneWidget);
    store.offline = false;
    await helpers.tapVisible(tester, subscribe);
    await tester.pumpAndSettle();
    expect(store.offerRequests, 3);
    expect(store.purchased, MembershipTerm.monthly);
    helpers.assertNoFlutterError(tester);
    await tester.pumpWidget(const SizedBox());
    membership.dispose();
  });

  testWidgets('training records stay in place and unlock after purchase', (
    tester,
  ) async {
    await helpers.phoneSize(tester);
    final catalog = loadCatalogFixture(includeFlarePlans: true);
    final store = LearningStore(
      catalog: catalog,
      storage: helpers.MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    final purchases = _TestStore();
    final membership = FlareMembership(purchases);
    final scene = SceneController(commandSink: (_) {});
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    final more = find.byKey(const ValueKey('home-menu-chip'));
    final paywall = find.byType(FlareMembershipPage);
    final records = find.byType(ProgressPage, skipOffstage: false);

    Future<void> openRecords() async {
      await tester.tap(more);
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('more-progress')));
      await tester.pumpAndSettle();
    }

    try {
      await tester.pumpWidget(
        helpers.testApp(
          FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
            membership: membership,
          ),
        ),
      );
      scene.receiveEvent({
        'source': 'flare-scene',
        'type': 'ready',
        'period': catalog.period,
      });
      scene.play();
      await tester.pumpAndSettle();

      await openRecords();
      final subscribe = find.byKey(const ValueKey('premium-preview-subscribe'));
      expect(paywall, findsNothing);
      expect(records, findsOneWidget);
      expect(tester.widget<ProgressPage>(records).readOnly, isTrue);
      final recordElement = tester.element(records);
      expect(scene.playing, isFalse);

      await tester.tap(subscribe);
      await tester.pumpAndSettle();
      expect(paywall, findsOneWidget);
      await tester.tap(
        find.descendant(of: paywall, matching: find.byType(FlareBackChip)),
      );
      await tester.pumpAndSettle();
      expect(paywall, findsNothing);
      expect(subscribe.hitTestable(), findsOneWidget);
      expect(tester.element(records), same(recordElement));
      expect(tester.widget<ProgressPage>(records).readOnly, isTrue);

      await tester.tap(subscribe);
      await tester.pumpAndSettle();
      expect(paywall, findsOneWidget);
      await helpers.tapVisible(
        tester,
        find.byKey(const ValueKey('premium-subscribe')),
      );
      await tester.pumpAndSettle();
      expect(purchases.purchased, isNotNull);
      expect(membership.isPremium, isTrue);
      expect(paywall, findsNothing);
      expect(subscribe, findsNothing);
      expect(tester.element(records), same(recordElement));
      expect(tester.widget<ProgressPage>(records).readOnly, isFalse);

      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      expect(records, findsNothing);
      final offerRequests = purchases.offerRequests;
      await openRecords();
      expect(records, findsOneWidget);
      expect(paywall, findsNothing);
      expect(subscribe, findsNothing);
      expect(purchases.offerRequests, offerRequests);
      helpers.assertNoFlutterError(tester);
      await tester.pumpWidget(const SizedBox());
    } finally {
      membership.dispose();
    }
  });

  testWidgets(
    'plan editors preview read-only while copying still opens membership',
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

        final editor = find.byType(RoutineEditorPage);
        final preview = find.byType(FlarePremiumPreview);
        final paywall = find.byType(FlareMembershipPage);
        final save = find.byKey(const ValueKey('routine-save'));
        final subscribe = find.byKey(
          const ValueKey('premium-preview-subscribe'),
        );

        await helpers.tapVisible(
          tester,
          find.byKey(const ValueKey('plan-new')),
        );
        await tester.pumpAndSettle();
        expect(editor, findsOneWidget);
        expect(paywall, findsNothing);
        expect(tester.widget<FlarePremiumPreview>(preview).locked, isTrue);
        expect(tester.widget<RoutineEditorPage>(editor).readOnly, isTrue);
        expect(tester.widget<PrimaryAction>(save).onPressed, isNull);
        await tester.binding.handlePopRoute();
        await tester.pumpAndSettle();

        await helpers.tapVisible(tester, routineRow);
        await tester.pumpAndSettle();
        await helpers.tapVisible(
          tester,
          find.byKey(const ValueKey('plan-edit')),
        );
        await tester.pumpAndSettle();
        expect(find.byKey(const ValueKey('edit-abs-A')), findsOneWidget);
        expect(
          tester
              .widget<TextField>(find.byKey(const ValueKey('routine-name')))
              .readOnly,
          isTrue,
        );
        expect(tester.widget<PrimaryAction>(save).onPressed, isNull);
        final editorElement = tester.element(editor);
        await tester.tap(subscribe);
        await tester.pumpAndSettle();
        expect(paywall, findsOneWidget);
        await tester.tap(membershipBack);
        await tester.pumpAndSettle();
        expect(tester.element(editor), same(editorElement));
        expect(tester.widget<PrimaryAction>(save).onPressed, isNull);
        expect(store.routines.single.drillIds, ['abs-A']);

        await tester.binding.handlePopRoute();
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
