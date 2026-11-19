import 'dart:async';

import 'package:flare/ui/flare_premium_offer_card.dart';
import 'package:flare/ui/flare_premium_preview.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'flow_regressions_test.dart' show phoneSize, testApp;

const _card = ValueKey('premium-preview-card');
const _gradient = ValueKey('premium-preview-gradient');
const _subscribe = ValueKey('premium-preview-subscribe');

void main() {
  testWidgets(
    'premium preview times the veil, card, glow and unlock separately',
    (tester) async {
      await phoneSize(tester);
      tester.view.viewPadding = const FakeViewPadding(bottom: 34);
      addTearDown(tester.view.resetViewPadding);
      final locked = ValueNotifier(true);
      addTearDown(locked.dispose);
      await tester.pumpWidget(testApp(const Scaffold()));
      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      final route = PageRouteBuilder<void>(
        transitionDuration: const Duration(milliseconds: 400),
        pageBuilder: (_, _, _) => Scaffold(
          body: ValueListenableBuilder(
            valueListenable: locked,
            builder: (_, value, _) => FlarePremiumPreview(
              feature: FlarePremiumFeature.records,
              locked: value,
              onSubscribe: () {},
              child: const SizedBox.expand(),
            ),
          ),
        ),
      );
      unawaited(navigator.push(route));
      await tester.pump();
      final card = find.byKey(_card);
      FadeTransition cardFade() =>
          tester.element(card).findAncestorWidgetOfExactType<FadeTransition>()!;
      const cardBottom = 844.0;
      final offer = find.byType(FlarePremiumOfferCard);
      FlarePremiumOfferCard offerCard() => tester.widget(offer);
      expect(card, findsNothing);
      await tester.pump(const Duration(milliseconds: 200));
      expect(route.animation!.status, AnimationStatus.forward);
      expect(card, findsNothing);
      expect(find.byKey(_subscribe).hitTestable(), findsNothing);
      await tester.pump(const Duration(milliseconds: 201));
      expect(route.animation!.status, AnimationStatus.completed);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 110));
      expect(cardFade().opacity.value, allOf(greaterThan(0), lessThan(1)));
      expect(
        tester.getRect(card).bottom,
        allOf(greaterThan(cardBottom), lessThan(cardBottom + 40)),
      );
      await tester.pump(const Duration(milliseconds: 130));
      expect(cardFade().opacity.value, 1);
      expect(tester.getRect(card).bottom, greaterThan(cardBottom));
      await tester.pump(const Duration(milliseconds: 120));
      expect(offerCard().glow.value, closeTo(.75, .001));
      final fullSize = tester.getRect(card);
      expect(fullSize.left, closeTo(0, .001));
      expect(fullSize.right, closeTo(390, .001));
      expect(fullSize.bottom, closeTo(cardBottom, .001));
      expect(offerCard().safeBottom, 34);
      expect(tester.getSize(find.byKey(_subscribe)).height, 54);
      await tester.pump(const Duration(milliseconds: 120));
      expect(offerCard().glow.value, 1);
      final bounds = tester.getRect(card);
      await tester.pump(const Duration(milliseconds: 1079));
      expect(offerCard().sheenEnabled.value, isFalse);
      await tester.pump(const Duration(milliseconds: 1));
      expect(offerCard().sheenEnabled.value, isTrue);

      final fade = find.byKey(_gradient);
      final blocker = find.byKey(const ValueKey('premium-preview-blocker'));
      expect(tester.getRect(blocker).top, closeTo(844 * .45, .001));
      expect(tester.getRect(fade).top, 0);
      expect(tester.getRect(fade).bottom, closeTo(bounds.top + 28, .001));
      final decoration =
          tester.widget<DecoratedBox>(fade).decoration as BoxDecoration;
      final tint = decoration.gradient! as LinearGradient;
      final height = tester.getSize(fade).height;
      expect(tint.stops![1] * height, closeTo(844 * .40, .001));
      expect(tint.stops![2] * height, closeTo(844 * .55, .001));
      expect(tint.stops![3] * height, closeTo(bounds.top, .001));
      expect(tint.colors.map((color) => color.a), [0, 0, .70, .96, .96]);
      expect(tint.colors.last, FlareColors.background.withValues(alpha: .96));
      expect(find.byType(BackdropFilter), findsNothing);
      expect(
        find.descendant(of: fade, matching: find.byType(ShaderMask)),
        findsNothing,
      );

      locked.value = false;
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 110));
      expect(cardFade().opacity.value, closeTo(.5, .001));
      expect(tester.getRect(card), bounds);
      expect(find.byKey(_subscribe).hitTestable(), findsNothing);
      await tester.pump(const Duration(milliseconds: 110));
      expect(card, findsNothing);
      expect(fade, findsNothing);
    },
  );

  testWidgets('premium preview waits for the shell page transition', (
    tester,
  ) async {
    await phoneSize(tester);
    final open = ValueNotifier(false);
    addTearDown(open.dispose);
    await tester.pumpWidget(
      testApp(
        Scaffold(
          body: ValueListenableBuilder(
            valueListenable: open,
            builder: (_, isOpen, _) => FlareStage(
              pageKey: isOpen ? 'planEditor' : 'plans',
              depth: isOpen ? 2 : 1,
              child: isOpen
                  ? FlarePremiumPreview(
                      feature: FlarePremiumFeature.planEditor,
                      locked: true,
                      onSubscribe: () {},
                      child: const SizedBox.expand(),
                    )
                  : const SizedBox.expand(),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    open.value = true;
    await tester.pump();
    await tester.pump();
    await tester.pump(FlareMotion.push - const Duration(milliseconds: 1));
    expect(find.byKey(_card), findsNothing);
    await tester.pump(const Duration(milliseconds: 2));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 110));
    expect(find.byKey(_card), findsOneWidget);
  });

  testWidgets(
    'workout panel keeps its offset and safe inset during route pop',
    (tester) async {
      await phoneSize(tester);
      tester.view.viewPadding = const FakeViewPadding(bottom: 24);
      addTearDown(tester.view.resetViewPadding);
      await tester.pumpWidget(testApp(const Scaffold()));
      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      final route = PageRouteBuilder<void>(
        transitionDuration: const Duration(milliseconds: 100),
        reverseTransitionDuration: const Duration(milliseconds: 350),
        pageBuilder: (_, _, _) => FlarePremiumPreview(
          feature: FlarePremiumFeature.training,
          locked: true,
          onSubscribe: () {},
          child: const SizedBox.expand(),
        ),
      );
      unawaited(navigator.push(route));
      await tester.pump();
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 101));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      final card = find.byKey(_card);
      final bounds = tester.getRect(card);
      final offer = find.byType(FlarePremiumOfferCard);
      final glow = tester.widget<FlarePremiumOfferCard>(offer).glow.value;
      expect(glow, allOf(greaterThan(0), lessThan(1)));

      navigator.pop();
      tester.view.viewPadding = const FakeViewPadding(bottom: 0);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 150));
      expect(route.animation!.status, AnimationStatus.reverse);
      expect(tester.getRect(card), bounds);
      expect(tester.widget<FlarePremiumOfferCard>(offer).safeBottom, 24);
      expect(tester.widget<FlarePremiumOfferCard>(offer).glow.value, glow);
      await tester.pumpAndSettle();
      expect(card, findsNothing);
    },
  );

  testWidgets('premium preview blocks only the covered pointer and semantics', (
    tester,
  ) async {
    await phoneSize(tester);
    final semantics = tester.ensureSemantics();
    var back = 0;
    var covered = 0;
    var subscriptions = 0;
    var swipes = 0;
    await tester.pumpWidget(
      testApp(
        Scaffold(
          body: Builder(
            builder: (context) => MediaQuery(
              data: MediaQuery.of(context).copyWith(disableAnimations: true),
              child: FlarePremiumPreview(
                feature: FlarePremiumFeature.training,
                locked: true,
                onSubscribe: () => subscriptions++,
                onEdgeBack: () => swipes++,
                child: Stack(
                  children: [
                    Positioned(
                      top: 30,
                      left: 40,
                      child: TextButton(
                        onPressed: () => back++,
                        child: const Text('Preview back'),
                      ),
                    ),
                    Positioned(
                      top: 430,
                      left: 40,
                      child: TextButton(
                        onPressed: () => covered++,
                        child: const Text('Covered action'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
    final offer = tester.widget<FlarePremiumOfferCard>(
      find.byType(FlarePremiumOfferCard),
    );
    expect(offer.title, '跟着练，每组都算数');
    expect(offer.highlight, '每组');
    expect(find.text('FLARE PRO'), findsOneWidget);
    expect(find.text('解锁 Flare 会员'), findsOneWidget);
    expect(find.text('语音计时'), findsOneWidget);
    expect(find.text('动作示范'), findsOneWidget);
    expect(find.text('自动记录'), findsOneWidget);
    expect(
      tester
          .widget<FlarePremiumOfferCard>(find.byType(FlarePremiumOfferCard))
          .sheenEnabled
          .value,
      isFalse,
    );
    expect(find.semantics.byLabel('Preview back'), findsOne);
    expect(find.semantics.byLabel('Covered action'), findsNothing);
    await tester.tap(find.text('Preview back'));
    await tester.tapAt(tester.getCenter(find.text('Covered action')));
    await tester.tap(find.byKey(_subscribe));
    await tester.dragFrom(const Offset(10, 505), const Offset(120, 0));
    expect(back, 1);
    expect(covered, 0);
    expect(subscriptions, 1);
    expect(swipes, 1);
    semantics.dispose();
  });
}
