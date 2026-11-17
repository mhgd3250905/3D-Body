import 'dart:async';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../control/flare_membership.dart';
import '../data/catalog.dart';
import 'components.dart';
import 'page_kit.dart';
import 'theme.dart';

const _terms =
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const _privacy = 'https://flare-privacy.294851575.workers.dev/';
const _playSubscriptions =
    'https://play.google.com/store/account/subscriptions?sku=flare_premium&package=dev.mhgd.flare';
const _appStoreSubscriptions = 'https://apps.apple.com/account/subscriptions';
const _appleDisclosureZh =
    '订阅将自动续订，除非在当前周期结束前至少 24 小时取消；可在 App Store 账户设置中管理和取消。';
const _appleDisclosureEn =
    'Subscription renews automatically unless canceled at least 24 hours before '
    'the end of the current period. Manage or cancel in your App Store account settings.';

bool get _usesAppStore =>
    !kIsWeb && defaultTargetPlatform == TargetPlatform.iOS;

Future<void> openMembershipLink(BuildContext context, String url) async {
  try {
    if (await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication)) {
      return;
    }
  } on Exception {
    // A store or browser handler may be unavailable.
  }
  if (context.mounted) {
    showMembershipMessage(context, context.strings.premiumUnavailable);
  }
}

void showMembershipMessage(BuildContext context, String message) =>
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));

Future<void> manageFlareSubscription(BuildContext context) =>
    openMembershipLink(
      context,
      _usesAppStore ? _appStoreSubscriptions : _playSubscriptions,
    );

Future<bool> restoreFlareSubscription(
  BuildContext context,
  FlareMembership membership,
) async {
  try {
    final restored = await membership.restore();
    if (!restored && context.mounted) {
      showMembershipMessage(context, context.strings.premiumRestoreEmpty);
    }
    return restored;
  } on Exception {
    if (context.mounted) {
      showMembershipMessage(context, context.strings.premiumUnavailable);
    }
    return false;
  }
}

class FlareMembershipPage extends StatefulWidget {
  const FlareMembershipPage({
    super.key,
    required this.membership,
    required this.catalog,
  });

  final FlareMembership membership;
  final Catalog catalog;

  @override
  State<FlareMembershipPage> createState() => _FlareMembershipPageState();
}

class _FlareMembershipPageState extends State<FlareMembershipPage> {
  MembershipTerm _selected = MembershipTerm.annual;
  final _liveOffers = <MembershipTerm, MembershipOffer>{};
  final _cachedOffers = <MembershipTerm, MembershipOffer>{};
  bool _reconnecting = false;
  bool _storeUnavailable = false;
  bool _retryFailed = false;

  @override
  void initState() {
    super.initState();
    unawaited(_readCachedOffers());
    unawaited(_loadOffers());
  }

  Future<void> _readCachedOffers() async {
    final prices = await widget.membership.cachedOffers();
    if (!mounted) return;
    setState(() {
      for (final offer in prices) {
        _cachedOffers.putIfAbsent(offer.term, () => offer);
      }
    });
  }

  Future<bool> _loadOffers({bool retry = false}) async {
    if (_reconnecting) return false;
    setState(() => _reconnecting = true);
    List<MembershipOffer> offers;
    try {
      offers = await widget.membership.offers().timeout(
        const Duration(seconds: 10),
      );
    } on Exception {
      offers = const [];
    }
    if (!mounted) return false;

    setState(() {
      _liveOffers
        ..clear()
        ..addEntries(offers.map((offer) => MapEntry(offer.term, offer)));
      _cachedOffers.addAll(_liveOffers);
      _storeUnavailable = !_liveOffers.containsKey(_selected);
      _retryFailed = retry && _storeUnavailable;
      _reconnecting = false;
    });
    return !_storeUnavailable;
  }

  Future<void> _purchase() async {
    final term = _selected;
    if (!_liveOffers.containsKey(term) && !await _loadOffers(retry: true)) {
      return;
    }
    if (!mounted) return;
    try {
      final active = await widget.membership.purchase(term);
      if (active && mounted) Navigator.pop(context, true);
    } on Exception {
      if (!mounted) return;
      setState(() {
        _liveOffers.remove(term);
        _storeUnavailable = true;
        _retryFailed = true;
      });
    }
  }

  Future<void> _restore() async {
    final active = await restoreFlareSubscription(context, widget.membership);
    if (active && mounted) Navigator.pop(context, true);
  }

  void _select(MembershipTerm term) {
    setState(() {
      _selected = term;
      _storeUnavailable = !_liveOffers.containsKey(term);
      _retryFailed = false;
    });
  }

  Widget _offerCard(
    BuildContext context,
    MembershipTerm term,
    MembershipOffer? offer, {
    required int? savings,
  }) {
    final s = context.strings;
    final selected = _selected == term;
    final annual = term == MembershipTerm.annual;
    final live = _liveOffers[term];
    final trial = live?.trialDays;
    // Offer availability is checked again before opening the purchase sheet.
    final referenceTrialDays = annual ? 7 : 3;
    final subtitles = [
      if (annual && offer != null)
        s.premiumMonthlyEstimate(
          offer.localizedMonthlyPrice ??
              NumberFormat.simpleCurrency(
                locale: Localizations.localeOf(context).toLanguageTag(),
                name: offer.currency,
              ).format(offer.price / 12),
        ),
      if (live == null)
        s.premiumConditionalTrial(referenceTrialDays)
      else if (trial != null)
        s.premiumTrialOffer(trial),
    ];

    return Semantics(
      selected: selected,
      button: true,
      child: AnimatedContainer(
        duration: MediaQuery.disableAnimationsOf(context)
            ? Duration.zero
            : const Duration(milliseconds: 150),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          boxShadow: selected
              ? const [
                  BoxShadow(
                    color: Color(0x29C8501E),
                    blurRadius: 12,
                    offset: Offset(0, 6),
                  ),
                ]
              : null,
        ),
        child: Material(
          color: _cardBackground,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
            side: BorderSide(
              color: selected ? _flareOrange : _fineLine,
              width: selected ? 1.6 : .6,
            ),
          ),
          child: InkWell(
            key: ValueKey('premium-${term.name}'),
            borderRadius: BorderRadius.circular(18),
            onTap: widget.membership.busy || _reconnecting
                ? null
                : () => _select(term),
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 72),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                child: Row(
                  children: [
                    Expanded(
                      flex: 5,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Wrap(
                            spacing: 6,
                            runSpacing: 3,
                            crossAxisAlignment: WrapCrossAlignment.center,
                            children: [
                              Text(
                                annual ? s.premiumYearly : s.premiumMonthly,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              if (savings != null)
                                Container(
                                  constraints: const BoxConstraints(
                                    minHeight: 20,
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 7,
                                  ),
                                  decoration: BoxDecoration(
                                    color: _flareOrange,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    s.premiumSavings(savings),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          if (subtitles.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.only(top: 3),
                              child: Text(
                                subtitles.join(' · '),
                                style: TextStyle(color: _muted, fontSize: 12),
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 6),
                    if (offer != null)
                      Expanded(
                        flex: 3,
                        child: Text.rich(
                          TextSpan(
                            text: offer.localizedPrice,
                            children: [
                              TextSpan(
                                text: annual
                                    ? s.premiumPerYear
                                    : s.premiumPerMonth,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w400,
                                  color: _muted,
                                ),
                              ),
                            ],
                          ),
                          textAlign: TextAlign.end,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    const SizedBox(width: 10),
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: selected ? _flareRed : null,
                        border: selected
                            ? null
                            : Border.all(color: _muted, width: 1.4),
                      ),
                      child: selected
                          ? const Icon(
                              Icons.check_rounded,
                              size: 16,
                              color: Colors.white,
                            )
                          : null,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _storeNotice(BuildContext context) {
    final s = context.strings;
    final store = _usesAppStore ? 'App Store' : 'Google Play';
    return DecoratedBox(
      decoration: BoxDecoration(
        color: _flareOrange.withValues(alpha: .08),
        borderRadius: BorderRadius.circular(17),
      ),
      child: Padding(
        padding: const EdgeInsetsDirectional.only(start: 10, end: 6),
        child: Row(
          children: [
            const Icon(Icons.refresh_rounded, color: _flareRed, size: 16),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                _retryFailed
                    ? s.premiumStoreRetryFailed(store)
                    : s.premiumStoreOffline(store),
                style: TextStyle(
                  color: FlareColors.isDark
                      ? const Color(0xFFFFAE91)
                      : const Color(0xFF964628),
                  fontSize: 12,
                ),
              ),
            ),
            TextButton(
              onPressed: _reconnecting ? null : () => _loadOffers(retry: true),
              style: TextButton.styleFrom(
                minimumSize: const Size(40, 34),
                padding: const EdgeInsets.symmetric(horizontal: 5),
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                foregroundColor: _flareRed,
                textStyle: const TextStyle(
                  fontFamily: flareFontFamily,
                  fontFamilyFallback: flareFontFallback,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
              child: Text(s.retry),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return Scaffold(
      backgroundColor: FlareColors.background,
      body: SafeArea(
        top: false,
        child: FlareNavPage(
          onBack: () => Navigator.pop(context),
          blurBackdrop: false,
          body: ListenableBuilder(
            listenable: widget.membership,
            builder: (context, _) {
              final offers = {
                for (final offer in widget.membership.fallbackOffers)
                  offer.term: offer,
                ..._cachedOffers,
                ..._liveOffers,
              };
              final monthly = offers[MembershipTerm.monthly];
              final annual = offers[MembershipTerm.annual];
              final live = _liveOffers[_selected];
              final shownPrice = offers[_selected]?.localizedPrice;
              final trialDays = live?.trialDays;
              final store = _usesAppStore ? 'App Store' : 'Google Play';
              final period = _selected == MembershipTerm.annual
                  ? s.premiumPerYear
                  : s.premiumPerMonth;
              final subscribeLabel = switch ((live, trialDays, shownPrice)) {
                (null, _, final price?) => s.premiumSubscribeAt(
                  '$price$period',
                ),
                (_, final days?, _) => s.premiumTrial(days),
                _ => s.premiumSubscribe,
              };
              final disclosure = switch (live) {
                null => s.premiumStoreRenewal(store),
                final offer when trialDays != null => s.premiumTrialRenewal(
                  '${offer.localizedPrice}$period',
                  store,
                ),
                final offer => s.premiumPaidRenewal(
                  '${offer.localizedPrice}$period',
                  store,
                ),
              };
              final iosDisclosure = _usesAppStore
                  ? Localizations.localeOf(context).languageCode == 'zh'
                        ? _appleDisclosureZh
                        : _appleDisclosureEn
                  : null;
              return ListView(
                padding: EdgeInsetsDirectional.fromSTEB(
                  16,
                  flareNavInset(context),
                  16,
                  8,
                ),
                children: [
                  _PremiumHero(widget.catalog),
                  const SizedBox(height: 16),
                  const _PremiumBenefits(),
                  const SizedBox(height: 16),
                  _offerCard(
                    context,
                    MembershipTerm.annual,
                    annual,
                    savings: _savings(monthly, annual),
                  ),
                  const SizedBox(height: 10),
                  _offerCard(
                    context,
                    MembershipTerm.monthly,
                    monthly,
                    savings: null,
                  ),
                  if (_storeUnavailable) ...[
                    const SizedBox(height: 10),
                    _storeNotice(context),
                  ],
                  const SizedBox(height: 14),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(27),
                      gradient: const LinearGradient(
                        colors: [_flareOrange, _flareRed],
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x59F0502A),
                          blurRadius: 12,
                          offset: Offset(0, 8),
                        ),
                      ],
                    ),
                    child: FilledButton(
                      key: const ValueKey('premium-subscribe'),
                      onPressed: _reconnecting || widget.membership.busy
                          ? null
                          : _purchase,
                      style: FilledButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        disabledBackgroundColor: Colors.transparent,
                        foregroundColor: Colors.white,
                        disabledForegroundColor: Colors.white70,
                        minimumSize: const Size.fromHeight(54),
                        shape: const StadiumBorder(),
                        textStyle: const TextStyle(
                          fontFamily: flareFontFamily,
                          fontFamilyFallback: flareFontFallback,
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      child: Text(subscribeLabel),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    [disclosure, ?iosDisclosure].join(' '),
                    textAlign: TextAlign.center,
                    style: TextStyle(color: _muted, fontSize: 11, height: 1.35),
                  ),
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 7,
                    children: [
                      _link(
                        s.premiumRestore,
                        widget.membership.busy ? null : _restore,
                      ),
                      Text('·', style: TextStyle(color: _linkColor)),
                      _link(
                        s.premiumTerms,
                        () => openMembershipLink(context, _terms),
                      ),
                      Text('·', style: TextStyle(color: _linkColor)),
                      _link(
                        s.premiumPrivacy,
                        () => openMembershipLink(context, _privacy),
                      ),
                    ],
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _link(String label, VoidCallback? action) => TextButton(
    style: TextButton.styleFrom(
      padding: EdgeInsets.zero,
      minimumSize: const Size(0, 44),
      foregroundColor: _linkColor,
      textStyle: const TextStyle(
        fontFamily: flareFontFamily,
        fontFamilyFallback: flareFontFallback,
        fontSize: 12,
        fontWeight: FontWeight.w700,
      ),
    ),
    onPressed: action,
    child: Text(label),
  );
}

const _flareOrange = Color(0xFFFF6A3D);
const _flareRed = Color(0xFFF0502A);
Color get _cardBackground =>
    FlareColors.isDark ? FlareColors.surface : Colors.white;
Color get _fineLine =>
    FlareColors.isDark ? const Color(0x22FFFFFF) : const Color(0x0F000000);
Color get _muted =>
    FlareColors.isDark ? FlareColors.secondary : const Color(0xFF807872);
Color get _linkColor =>
    FlareColors.isDark ? const Color(0xFFFFAE91) : const Color(0xFFB45A32);

int? _savings(MembershipOffer? monthly, MembershipOffer? annual) {
  if (monthly == null ||
      annual == null ||
      monthly.price <= 0 ||
      annual.price <= 0 ||
      monthly.currency != annual.currency) {
    return null;
  }
  final percentage = (100 * (1 - annual.price / (12 * monthly.price))).round();
  return percentage > 0 ? percentage : null;
}

class _PremiumHero extends StatelessWidget {
  const _PremiumHero(this.catalog);

  final Catalog catalog;

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    final counts = catalog.flarePlanCounts;
    const radius = BorderRadius.all(Radius.circular(26));
    return DecoratedBox(
      decoration: const BoxDecoration(
        borderRadius: radius,
        boxShadow: [
          BoxShadow(
            color: Color(0x455A280F),
            blurRadius: 18,
            offset: Offset(0, 14),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: radius,
        child: CustomPaint(
          painter: const _FlareOrbit(),
          foregroundPainter: const _HeroBorder(),
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 208),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(22, 19, 14, 16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'FLARE PRO',
                    style: TextStyle(
                      color: _flareOrange,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    s.premiumTitle,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 27,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    s.premiumPlanSummary(counts.plans),
                    style: const TextStyle(
                      color: Color(0xBFFFFFFF),
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 26),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      for (final (count, label) in [
                        (counts.angles, s.premiumAngleCount),
                        (counts.muscles, s.premiumMuscleCount),
                        (counts.tiers, s.premiumLevelCount),
                      ])
                        Flexible(
                          child: SizedBox(
                            width: 82,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '$count',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 24,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                                Text(
                                  label,
                                  style: const TextStyle(
                                    color: Color(0x99FFFFFF),
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _FlareOrbit extends CustomPainter {
  const _FlareOrbit();

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    canvas.drawRect(
      rect,
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1A120F), Color(0xFF3A1E14)],
        ).createShader(rect),
    );
    final center = Offset(size.width * .82, size.height * .30);
    canvas.drawRect(
      rect,
      Paint()
        ..shader = ui.Gradient.radial(center, size.width * .55, [
          const Color(0x8CFF6A3D),
          const Color(0x00FF6A3D),
        ]),
    );

    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(-.5);
    for (final (index, alpha) in [.47, .27, .15].indexed) {
      final scale = 1 + index * .27;
      canvas.drawOval(
        Rect.fromCenter(
          center: Offset.zero,
          width: 91 * scale,
          height: 39 * scale,
        ),
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2
          ..color = const Color(0xFFFFAA78).withValues(alpha: alpha),
      );
    }
    for (final (offset, radius, alpha) in const [
      (Offset(36, 12), 2.8, .70),
      (Offset(-39, -22), 2.3, .44),
      (Offset(50, -21), 1.9, .38),
      (Offset(-62, 6), 1.5, .23),
    ]) {
      canvas.drawCircle(
        offset,
        radius,
        Paint()..color = const Color(0xFFFFBE99).withValues(alpha: alpha),
      );
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _FlareOrbit oldDelegate) => false;
}

class _HeroBorder extends CustomPainter {
  const _HeroBorder();

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        (Offset.zero & size).deflate(.3),
        const Radius.circular(26),
      ),
      Paint()
        ..color = const Color(0x29FFFFFF)
        ..strokeWidth = .6
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(covariant _HeroBorder oldDelegate) => false;
}

class _PremiumBenefits extends StatelessWidget {
  const _PremiumBenefits();

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: _cardBackground,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          for (final (index, (icon, title, description)) in [
            (Icons.fitness_center_rounded, s.premiumAiCoach, s.premiumAiPlans),
            (
              Icons.record_voice_over_outlined,
              s.premiumVoiceTitle,
              s.premiumVoiceDescription,
            ),
            (
              Icons.playlist_add_rounded,
              s.premiumCustomWorkouts,
              s.premiumCustomDescription,
            ),
          ].indexed) ...[
            if (index > 0)
              Padding(
                padding: const EdgeInsetsDirectional.only(start: 57, end: 14),
                child: Divider(height: 0, thickness: .5, color: _fineLine),
              ),
            ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 56),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 13,
                  vertical: 6,
                ),
                child: Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: _flareOrange.withValues(alpha: .11),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(icon, size: 18, color: _flareRed),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: TextStyle(
                              color: FlareColors.isDark
                                  ? null
                                  : const Color(0xFF1C1816),
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Text(
                            description,
                            style: TextStyle(color: _muted, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
