import 'package:flare/ui/flare_premium_preview.dart';
import 'package:flare/ui/flare_premium_offer_card.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'flow_regressions_test.dart' show phoneSize, testApp;

const _card = ValueKey('premium-preview-card');
const _gradient = ValueKey('premium-preview-gradient');
const _blur = ValueKey('premium-preview-blur');
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
      await tester.pumpWidget(
        testApp(
          Scaffold(
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
        ),
      );
      final card = find.byKey(_card);
      FadeTransition cardFade() =>
          tester.element(card).findAncestorWidgetOfExactType<FadeTransition>()!;
      expect(cardFade().opacity.value, 0);
      const cardBottom = 844.0 - 34 - 16;
      expect(tester.getRect(card).bottom, cardBottom + 24);
      final offer = find.byType(FlarePremiumOfferCard);
      FlarePremiumOfferCard offerCard() => tester.widget(offer);
      expect(offerCard().glow.value, 0);
      expect(find.byKey(_subscribe).hitTestable(), findsNothing);

      await tester.pump(const Duration(milliseconds: 119));
      expect(cardFade().opacity.value, 0);
      await tester.pump(const Duration(milliseconds: 1));
      await tester.pump(const Duration(milliseconds: 110));
      expect(cardFade().opacity.value, allOf(greaterThan(0), lessThan(1)));
      expect(
        tester.getRect(card).bottom,
        allOf(greaterThan(cardBottom), lessThan(cardBottom + 24)),
      );
      await tester.pump(const Duration(milliseconds: 130));
      expect(cardFade().opacity.value, 1);
      expect(tester.getRect(card).bottom, greaterThan(cardBottom));
      await tester.pump(const Duration(milliseconds: 80));
      expect(offerCard().glow.value, closeTo(.8, .001));
      final fullSize = tester.getRect(card);
      expect(fullSize.left, closeTo(16, .001));
      expect(fullSize.right, closeTo(374, .001));
      expect(fullSize.bottom, closeTo(cardBottom, .001));
      expect(tester.getSize(find.byKey(_subscribe)).height, 52);
      expect(tester.getRect(find.byKey(_blur)).top, closeTo(844 * .52, .001));
      await tester.pump(const Duration(milliseconds: 80));
      expect(offerCard().glow.value, 1);
      final bounds = tester.getRect(card);
      await tester.pump(const Duration(milliseconds: 519));
      expect(offerCard().sheenEnabled, isFalse);
      await tester.pump(const Duration(milliseconds: 1));
      expect(offerCard().sheenEnabled, isTrue);

      final fade = find.byKey(_gradient);
      expect(tester.getRect(fade).top, closeTo(844 * .45, .001));
      final tint = find.descendant(of: fade, matching: find.byType(ColoredBox));
      expect(
        tester.widget<ColoredBox>(tint).color,
        FlareColors.background.withValues(alpha: .72),
      );
      final filters = find.descendant(
        of: find.byKey(_blur),
        matching: find.byType(BackdropFilter),
      );
      expect(filters, findsNWidgets(11));
      expect(tester.getTopLeft(filters.last).dy, closeTo(844 * .62, .001));

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
    expect(find.text('开通会员，开始跟练'), findsOneWidget);
    expect(find.text('FLARE 会员'), findsOneWidget);
    expect(find.text('语音计时'), findsOneWidget);
    expect(find.text('动作示范'), findsOneWidget);
    expect(find.text('自动记录'), findsOneWidget);
    expect(
      tester
          .widget<FlarePremiumOfferCard>(find.byType(FlarePremiumOfferCard))
          .sheenEnabled,
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
