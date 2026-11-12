import 'dart:io';
import 'dart:ui' as ui;

import 'package:flare/control/flare_membership.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/flare_membership_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

const _capture = bool.fromEnvironment('CAPTURE_PAYWALL_V2_PREVIEWS');
const _pixelRatio = 3.0;
const _previewSize = Size(1080, 2520);
const _previewBoundary = ValueKey('paywall-preview');
const _subscribe = ValueKey('premium-subscribe');
const _monthly = ValueKey('premium-monthly');
const _manage = ValueKey('premium-manage');

class _FixtureStore implements MembershipStore {
  const _FixtureStore(this.snapshot);

  final MembershipSnapshot snapshot;

  @override
  Future<MembershipSnapshot> refresh() async => snapshot;

  @override
  Future<List<MembershipOffer>> offers() async => const [
    MembershipOffer(
      term: MembershipTerm.annual,
      price: 19.99,
      currency: 'USD',
      localizedPrice: r'$19.99',
      localizedMonthlyPrice: r'$1.67',
      trialDays: 7,
    ),
    MembershipOffer(
      term: MembershipTerm.monthly,
      price: 2.99,
      currency: 'USD',
      localizedPrice: r'$2.99',
      trialDays: 3,
    ),
  ];

  @override
  Future<MembershipSnapshot?> purchase(MembershipTerm term) async =>
      throw StateError('The paywall fixture never purchases');

  @override
  Future<MembershipSnapshot> restore() async =>
      throw StateError('The paywall fixture never restores');
}

FlareMembership _member({
  bool active = false,
  bool trial = false,
  bool renew = true,
}) {
  const uid = 'paywall-v2-fixture';
  final snapshot = active
      ? MembershipSnapshot(
          uid,
          DateTime(2026, 11, 19, 12),
          term: MembershipTerm.annual,
          isTrial: trial,
          willRenew: renew,
        )
      : const MembershipSnapshot(uid, null);
  return FlareMembership(
    _FixtureStore(snapshot),
    now: () => DateTime(2026, 11, 12, 12),
  );
}

Future<void> _openPaywall(
  WidgetTester tester,
  FlareMembership membership, {
  Locale locale = const Locale('zh'),
  double textScale = 1.5,
  Size physicalSize = const Size(1080, 2400),
}) async {
  tester.view.devicePixelRatio = _pixelRatio;
  tester.view.physicalSize = physicalSize;
  tester.view.padding = const FakeViewPadding(top: 72, bottom: 72);
  tester.view.viewPadding = const FakeViewPadding(top: 72, bottom: 72);
  addTearDown(tester.view.reset);

  await membership.refresh();
  await tester.pumpWidget(
    MaterialApp(
      locale: locale,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      theme: flareTheme(Brightness.light),
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(
          context,
        ).copyWith(textScaler: TextScaler.linear(textScale)),
        child: child!,
      ),
      home: RepaintBoundary(
        key: _previewBoundary,
        child: FlareMembershipPage(membership: membership),
      ),
    ),
  );
  await tester.pumpAndSettle();
  expect(tester.takeException(), isNull);
}

Future<void> _savePreview(WidgetTester tester, String name) async {
  final boundary = tester.renderObject<RenderRepaintBoundary>(
    find.byKey(_previewBoundary),
  );
  await tester.runAsync(() async {
    final image = await boundary.toImage(pixelRatio: _pixelRatio);
    try {
      expect(image.width, _previewSize.width.toInt());
      expect(image.height, _previewSize.height.toInt());
      final data = await image.toByteData(format: ui.ImageByteFormat.png);
      final file = File('build/deliveries/paywall-v2/$name');
      await file.parent.create(recursive: true);
      await file.writeAsBytes(
        data!.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
      );
    } finally {
      image.dispose();
    }
  });
  expect(tester.takeException(), isNull);
}

void _expectAppFont(WidgetTester tester, String label) {
  final richText = tester.widget<RichText>(
    find.descendant(of: find.text(label), matching: find.byType(RichText)),
  );
  expect(richText.text.style?.fontFamily, flareFontFamily, reason: label);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    await (FontLoader(
      'FlareSans',
    )..addFont(rootBundle.load('assets/fonts/FlareSans.ttf'))).load();
    if (_capture) {
      await (FontLoader(
        'MaterialIcons',
      )..addFont(rootBundle.load('fonts/MaterialIcons-Regular.otf'))).load();
    }
  });

  for (final (locale, annualLabel, monthlyLabel) in [
    (const Locale('zh'), '免费试用 7 天', '免费试用 3 天'),
    (const Locale('en'), 'Start 7-day free trial', 'Start 3-day free trial'),
  ]) {
    testWidgets('$locale offers fit at 360dp/1.5x with a fixed CTA', (
      tester,
    ) async {
      final membership = _member();
      try {
        await _openPaywall(tester, membership, locale: locale);
        final action = find.byKey(_subscribe);
        expect(find.text(annualLabel), findsOneWidget);
        _expectAppFont(tester, annualLabel);
        _expectAppFont(
          tester,
          locale.languageCode == 'zh' ? '恢复购买' : 'Restore',
        );
        final anchor = tester.getBottomLeft(action);

        final monthly = find.byKey(_monthly);
        await tester.scrollUntilVisible(
          monthly,
          120,
          scrollable: find.byType(Scrollable).first,
        );
        await tester.pumpAndSettle();
        expect(tester.getBottomLeft(action), anchor);
        await tester.tap(monthly);
        await tester.pumpAndSettle();
        expect(find.text(monthlyLabel), findsOneWidget);
        expect(tester.takeException(), isNull);
      } finally {
        membership.dispose();
      }
    });
  }

  for (final (label, trial, renew, status, detail) in [
    ('trial', true, true, '试用中', '起扣费'),
    ('renewing', false, true, '生效中', '自动续订'),
    ('canceled', false, false, '生效中', '到期'),
  ]) {
    testWidgets('$label member fits at 360dp/1.5x and explains billing', (
      tester,
    ) async {
      final membership = _member(active: true, trial: trial, renew: renew);
      try {
        await _openPaywall(tester, membership);
        expect(find.text(status), findsOneWidget);
        expect(find.text('年付 · 2026-11-19 $detail'), findsOneWidget);
        expect(find.byKey(_manage).hitTestable(), findsOneWidget);
        _expectAppFont(tester, '管理订阅');
        expect(find.byKey(_subscribe), findsNothing);
        expect(tester.takeException(), isNull);
      } finally {
        membership.dispose();
      }
    });
  }

  // Run with --dart-define=CAPTURE_PAYWALL_V2_PREVIEWS=true to write fixture PNGs.
  if (_capture) {
    for (final (active, name) in [
      (false, 'flare-paywall-v2-offers-fixture.png'),
      (true, 'flare-paywall-v2-member-fixture.png'),
    ]) {
      testWidgets('capture $name', (tester) async {
        final membership = _member(active: active, trial: active);
        final shadowsDisabled = debugDisableShadows;
        debugDisableShadows = false;
        try {
          await _openPaywall(
            tester,
            membership,
            textScale: 1,
            physicalSize: _previewSize,
          );
          await _savePreview(tester, name);
        } finally {
          debugDisableShadows = shadowsDisabled;
          membership.dispose();
        }
      });
    }
  }
}
