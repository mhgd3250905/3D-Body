import 'dart:async';

import 'package:flare/coach/flare_coach_chat.dart';
import 'package:flare/control/flare_membership.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/flare_coach_chat_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ugk_coach_chat/ugk_coach_chat.dart'
    show CoachChatController, CoachChatHostActions;

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' as helpers;

class _MemberStore implements MembershipStore {
  @override
  Future<MembershipSnapshot> refresh() async =>
      MembershipSnapshot('tester', DateTime.now().add(const Duration(days: 1)));

  @override
  Future<List<MembershipOffer>> offers() async => [];

  @override
  Future<MembershipSnapshot?> purchase(MembershipTerm term) => refresh();

  @override
  Future<MembershipSnapshot> restore() => refresh();
}

/// Keeps SDK and catalogue startup out of the navigation test.
class _CoachRouteProbe extends FlareCoachChat {
  _CoachRouteProbe({required super.store, required super.membership});

  final _pending = Completer<CoachChatController>();
  int loads = 0;

  @override
  bool get configured => true;

  @override
  Future<CoachChatController> load({required CoachChatHostActions actions}) {
    loads++;
    return _pending.future;
  }
}

void main() {
  testWidgets('members can decline, consent, and withdraw from privacy', (
    tester,
  ) async {
    SharedPreferences.setMockInitialValues({});
    await helpers.phoneSize(tester);
    final semantics = tester.ensureSemantics();
    final membership = FlareMembership(_MemberStore());
    final catalog = loadCatalogFixture();
    final store = LearningStore(
      catalog: catalog,
      storage: helpers.MemoryStateStorage(),
    );
    final scene = SceneController(commandSink: (_) {});
    final coach = _CoachRouteProbe(store: store, membership: membership);

    final entry = find.byKey(const ValueKey('plan-ai-coach'));
    final disclosure = find.text('使用 AI 前请确认');
    final chat = find.byType(FlareCoachChatPage);
    final agree = find.text('同意并继续');
    final decline = find.text('暂不使用');

    Future<void> openConsent() async {
      await helpers.tapVisible(tester, entry);
      await tester.pumpAndSettle();
    }

    Future<void> settleChatNavigation() async {
      // The route probe keeps the chat loading, so pump only the transition.
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 450));
    }

    Future<void> leaveChat() async {
      await tester.tap(
        find.descendant(of: chat, matching: find.byTooltip('返回')),
      );
      await tester.pumpAndSettle();
      expect(chat, findsNothing);
    }

    try {
      await store.initialize();
      await store.acknowledgeSafety();
      expect(await membership.refresh(), isTrue);
      await tester.pumpWidget(
        helpers.testApp(
          FlareShell(
            catalog: catalog,
            store: store,
            sceneController: scene,
            enableScene: false,
            membership: membership,
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
      await helpers.openPlansFromHome(tester);

      await openConsent();
      expect(disclosure, findsOneWidget);
      expect(coach.loads, 0);
      await tester.tapAt(const Offset(5, 5));
      await tester.binding.handlePopRoute();
      await tester.drag(disclosure, const Offset(0, 350));
      await tester.pumpAndSettle();
      expect(disclosure, findsOneWidget);

      await helpers.tapVisible(tester, find.text('查看隐私政策'));
      await tester.pumpAndSettle();
      expect(find.text('AI 定制与设备标识'), findsOneWidget);
      expect(coach.loads, 0);
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      expect(disclosure, findsOneWidget);

      await helpers.tapVisible(tester, decline);
      await tester.pumpAndSettle();
      expect(disclosure, findsNothing);
      expect(chat, findsNothing);
      expect(coach.loads, 0);
      expect(await coach.aiConsent.read(), isFalse);

      await openConsent();
      await helpers.tapVisible(tester, agree);
      await settleChatNavigation();
      expect(disclosure, findsNothing);
      expect(chat, findsOneWidget);
      expect(coach.loads, 1);
      expect(await coach.aiConsent.read(), isTrue);

      await leaveChat();
      await helpers.tapVisible(tester, entry);
      await settleChatNavigation();
      expect(disclosure, findsNothing);
      expect(chat, findsOneWidget);
      await leaveChat();

      await tester.tap(find.byTooltip('返回').first);
      await tester.pumpAndSettle();
      await tester.tap(helpers.labeledControl('更多'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('设置').last);
      await tester.pumpAndSettle();
      await helpers.tapVisible(tester, find.text('关于 Flare'));
      await tester.pumpAndSettle();
      await helpers.tapVisible(tester, find.text('撤回 AI 数据共享同意'));
      await tester.pumpAndSettle();
      expect(await coach.aiConsent.read(), isFalse);

      await tester.tap(find.byTooltip('返回').first);
      await tester.pumpAndSettle();
      await tester.tap(find.byTooltip('返回').first);
      await tester.pumpAndSettle();
      await helpers.openPlansFromHome(tester);
      await openConsent();
      expect(disclosure, findsOneWidget);
      expect(coach.loads, 2);

      await helpers.tapVisible(tester, decline);
      await tester.pumpAndSettle();
      helpers.assertNoFlutterError(tester);
    } finally {
      await tester.pumpWidget(const SizedBox());
      await tester.pumpAndSettle();
      await coach.close();
      membership.dispose();
      scene.dispose();
      store.dispose();
      semantics.dispose();
    }
  });
}
