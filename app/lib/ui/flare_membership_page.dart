import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart' show DateFormat, NumberFormat;
import 'package:url_launcher/url_launcher.dart';

import '../control/flare_membership.dart';
import 'components.dart';
import 'theme.dart' show flareFontFamily, flareFontFallback;

enum MembershipDestination { askCoach, customPlan, newWorkout }

const _terms =
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const _privacy = 'https://flare-privacy.294851575.workers.dev/';
const _playSubscriptions =
    'https://play.google.com/store/account/subscriptions?sku=flare_premium&package=dev.mhgd.flare';
const _appStoreSubscriptions = 'https://apps.apple.com/account/subscriptions';
const _appleDisclosureZh =
    '除非在当前周期结束前至少 24 小时取消，否则将自动续订；可在 App Store 账户设置中管理或取消。';
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

String _subscriptionDisclosure(
  BuildContext context, {
  required bool withTrial,
}) {
  final language = Localizations.localeOf(context).languageCode;
  if (_usesAppStore) {
    return language == 'zh' ? _appleDisclosureZh : _appleDisclosureEn;
  }
  return switch ((language, withTrial)) {
    ('zh', true) => '可随时在 Google Play 取消，试用期内取消不扣费',
    ('zh', false) => '订阅将自动续订，可随时在 Google Play 取消。',
    ('en', true) =>
      "Cancel anytime in Google Play. Cancel before the trial ends and you won't be charged.",
    ('en', false) =>
      'Subscription renews automatically. Cancel anytime in Google Play.',
    _ => context.strings.premiumDisclosure,
  };
}

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
  const FlareMembershipPage({super.key, required this.membership});

  final FlareMembership membership;

  @override
  State<FlareMembershipPage> createState() => _FlareMembershipPageState();
}

class _FlareMembershipPageState extends State<FlareMembershipPage> {
  MembershipTerm _selected = MembershipTerm.annual;
  late Future<List<MembershipOffer>> _offers = widget.membership.offers();
  bool _purchasing = false;

  Future<void> _purchase() async {
    if (_purchasing || widget.membership.busy) return;
    setState(() => _purchasing = true);
    try {
      final active = await widget.membership.purchase(_selected);
      if (active && mounted && ModalRoute.of(context)?.isCurrent == true) {
        Navigator.pop(context, true);
      }
    } on Exception {
      if (mounted && ModalRoute.of(context)?.isCurrent == true) {
        showMembershipMessage(context, context.strings.premiumUnavailable);
      }
    } finally {
      if (mounted) setState(() => _purchasing = false);
    }
  }

  Future<void> _restore() async {
    final active = await restoreFlareSubscription(context, widget.membership);
    if (active && mounted) Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.membership,
      builder: (context, _) {
        final subscription = widget.membership.activeSubscription;
        return Scaffold(
          backgroundColor: _page,
          body: FutureBuilder<List<MembershipOffer>>(
            future: subscription == null ? _offers : null,
            builder: (context, snapshot) {
              final offers = {
                for (final offer in snapshot.data ?? const <MembershipOffer>[])
                  offer.term: offer,
              };
              return Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      child: subscription == null
                          ? _unsubscribedContent(snapshot, offers)
                          : _subscribedContent(subscription),
                    ),
                  ),
                  _footer(subscription, offers[_selected]),
                ],
              );
            },
          ),
        );
      },
    );
  }

  Widget _hero({required bool subscribed}) {
    final top = MediaQuery.paddingOf(context).top;
    final s = context.strings;
    final language = Localizations.localeOf(context).languageCode;
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(24, top + 12, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              DecoratedBox(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(100),
                  color: const Color(0x29ffffff),
                  border: Border.all(color: const Color(0x47ffffff)),
                ),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  child: Text(
                    'FLARE PRO',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.5,
                    ),
                  ),
                ),
              ),
              IconButton(
                visualDensity: VisualDensity.standard,
                constraints: const BoxConstraints.tightFor(
                  width: 32,
                  height: 32,
                ),
                padding: EdgeInsets.zero,
                style: IconButton.styleFrom(
                  backgroundColor: const Color(0x29ffffff),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.square(32),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                tooltip: MaterialLocalizations.of(context).closeButtonTooltip,
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close_rounded, size: 18),
              ),
            ],
          ),
          if (!subscribed) ...[
            const SizedBox(height: 14),
            Text(
              switch (language) {
                'en' => 'Unlock Flare Pro',
                _ => s.premiumTitle,
              },
              style: const TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.w800,
                height: 36 / 28,
              ),
            ),
            const SizedBox(height: 6),
            Text(switch (language) {
              'zh' => 'AI 教练陪你把每个动作练对',
              'en' => 'Your AI coach for every move',
              _ => s.premiumSubtitle,
            }, style: const TextStyle(color: _white82, fontSize: 15)),
            const SizedBox(height: 6),
          ],
        ],
      ),
    );
  }

  Widget _unsubscribedContent(
    AsyncSnapshot<List<MembershipOffer>> snapshot,
    Map<MembershipTerm, MembershipOffer> offers,
  ) {
    final monthly = offers[MembershipTerm.monthly];
    final annual = offers[MembershipTerm.annual];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Stack(
          clipBehavior: Clip.none,
          children: [
            const PositionedDirectional(
              start: 0,
              end: 0,
              top: 0,
              bottom: -104,
              child: _HeroWash(),
            ),
            ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 196),
              child: _hero(subscribed: false),
            ),
          ],
        ),
        _benefits(subscribed: false),
        const SizedBox(height: 28),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: [
              _offerCard(
                MembershipTerm.annual,
                annual,
                savings: _savings(monthly, annual),
              ),
              const SizedBox(height: 10),
              _offerCard(MembershipTerm.monthly, monthly),
              if (snapshot.connectionState == ConnectionState.waiting)
                const Padding(
                  padding: EdgeInsets.all(12),
                  child: CircularProgressIndicator(color: _gradient2),
                )
              else if (offers.isEmpty)
                TextButton(
                  onPressed: () =>
                      setState(() => _offers = widget.membership.offers()),
                  child: Text(context.strings.premiumUnavailable),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _subscribedContent(MembershipSnapshot subscription) {
    final top = MediaQuery.paddingOf(context).top;
    return Stack(
      children: [
        const PositionedDirectional(
          start: 0,
          end: 0,
          top: 0,
          height: 220,
          child: _HeroWash(),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ConstrainedBox(
              constraints: BoxConstraints(minHeight: top + 68),
              child: _hero(subscribed: true),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: _memberCard(subscription),
            ),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsetsDirectional.only(start: 20, bottom: 8),
              child: Text(
                _copy('你的会员权益', 'Your membership benefits'),
                style: const TextStyle(
                  fontSize: 13,
                  color: _secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            _benefits(subscribed: true),
            const SizedBox(height: 16),
          ],
        ),
      ],
    );
  }

  Widget _memberCard(MembershipSnapshot subscription) {
    final s = context.strings;
    final term = switch (subscription.term) {
      MembershipTerm.annual => s.premiumYearly,
      MembershipTerm.monthly => s.premiumMonthly,
      null => null,
    };
    final expiration = subscription.expiresAt?.toLocal();
    final date = expiration == null
        ? null
        : DateFormat('yyyy-MM-dd').format(expiration);
    final detail = date == null
        ? null
        : subscription.isTrial && subscription.willRenew == true
        ? _copy('$date 起扣费', 'Billing starts $date')
        : subscription.willRenew == true
        ? _copy('$date 自动续订', 'Renews $date')
        : _copy('$date 到期', 'Expires $date');
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [
          BoxShadow(
            color: Color(0x596f1a00),
            blurRadius: 28,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: DecoratedBox(
          decoration: const BoxDecoration(
            gradient: _FixedAngleGradient(
              direction: Offset(.7071067812, .7071067812),
              colors: [_dark1, _dark2],
            ),
          ),
          child: Stack(
            children: [
              const Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: Alignment.topRight,
                      colors: [Color(0x59f5b83d), Color(0x00f5b83d)],
                      stops: [0, .6],
                    ),
                  ),
                ),
              ),
              Positioned(
                right: -40,
                bottom: -60,
                child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      width: 28,
                      color: const Color(0x0fffffff),
                    ),
                  ),
                ),
              ),
              ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 180),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 18),
                  child: IntrinsicHeight(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _goldBadge(
                          subscription.isTrial
                              ? _copy('试用中', 'Trial')
                              : _copy('生效中', 'Active'),
                          fontSize: 12,
                        ),
                        const SizedBox(height: 22),
                        Text(
                          s.premiumStatus,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            height: 1,
                          ),
                        ),
                        if (term != null || detail != null) ...[
                          const SizedBox(height: 6),
                          Text(
                            [?term, ?detail].join(' · '),
                            style: const TextStyle(
                              color: _white82,
                              fontSize: 14,
                              height: 1.15,
                            ),
                          ),
                        ],
                        const SizedBox(height: 12),
                        const Spacer(),
                        const Text(
                          'PRO MEMBER',
                          style: TextStyle(
                            color: Color(0x99ffffff),
                            fontSize: 12,
                            height: 1,
                            letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _benefits({required bool subscribed}) {
    final s = context.strings;
    final benefits = [
      (
        Icons.chat_bubble_outline_rounded,
        _copy('AI 教练问答', 'AI Coach Q&A', fallback: s.premiumAiCoach),
        _copy('动作、疼痛、进度，随时问', 'Ask about moves, pain or progress anytime'),
        _copy('去提问', 'Ask'),
        MembershipDestination.askCoach,
      ),
      (
        Icons.auto_awesome_rounded,
        _copy('AI 定制训练计划', 'AI Custom Plans', fallback: s.premiumAiPlans),
        _copy('按你的柔韧度和时间生成', 'Built for your flexibility and schedule'),
        _copy('去定制', 'Customize'),
        MembershipDestination.customPlan,
      ),
      (
        Icons.playlist_add_rounded,
        _copy(
          '无限自定义训练组',
          'Unlimited Custom Workouts',
          fallback: s.premiumCustomWorkouts,
        ),
        _copy('248 个动作自由组合', 'Mix and match 248 moves'),
        _copy('去新建', 'Create'),
        MembershipDestination.newWorkout,
      ),
    ];
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x1a8e2100),
            blurRadius: 24,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        clipBehavior: Clip.antiAlias,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          child: Column(
            children: [
              for (final (index, benefit) in benefits.indexed) ...[
                if (index != 0)
                  const Divider(height: 1, thickness: 1, color: _divider),
                InkWell(
                  key: ValueKey('premium-benefit-${benefit.$5.name}'),
                  onTap: subscribed
                      ? () => Navigator.pop(context, benefit.$5)
                      : null,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: _iconFill,
                          ),
                          child: Icon(benefit.$1, color: _gradient2, size: 20),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                benefit.$2,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: _ink,
                                ),
                              ),
                              if (!subscribed) ...[
                                const SizedBox(height: 2),
                                Text(
                                  benefit.$3,
                                  style: const TextStyle(
                                    color: _secondary,
                                    fontSize: 13,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        if (subscribed) ...[
                          const SizedBox(width: 8),
                          ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 105),
                            child: Text(
                              '${benefit.$4} ›',
                              textAlign: TextAlign.end,
                              style: const TextStyle(
                                color: _gradient2,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  int? _savings(MembershipOffer? monthly, MembershipOffer? annual) {
    if (monthly == null ||
        annual == null ||
        monthly.price <= 0 ||
        annual.price <= 0 ||
        monthly.currency != annual.currency) {
      return null;
    }
    final percentage = (100 * (1 - annual.price / (12 * monthly.price)))
        .round();
    return percentage > 0 ? percentage : null;
  }

  Widget _offerCard(
    MembershipTerm term,
    MembershipOffer? offer, {
    int? savings,
  }) {
    final s = context.strings;
    final selected = _selected == term;
    final annual = term == MembershipTerm.annual;
    final trial = offer?.trialDays;
    final monthlyPrice = annual && offer != null
        ? offer.localizedMonthlyPrice ??
              NumberFormat.simpleCurrency(
                locale: Localizations.localeOf(context).toLanguageTag(),
                name: offer.currency,
              ).format(offer.price / 12)
        : null;
    final monthlyDetail = monthlyPrice != null
        ? s.premiumMonthlyEstimate(monthlyPrice)
        : annual
        ? null
        : _copy('每月', 'Per month');
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Semantics(
          button: true,
          selected: selected,
          child: Material(
            color: selected ? _selectedFill : Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(
                color: selected ? _primary : _cardBorder,
                width: selected ? 2 : 1,
              ),
            ),
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              key: ValueKey('premium-${term.name}'),
              onTap: offer == null || widget.membership.busy
                  ? null
                  : () => setState(() => _selected = term),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            annual ? s.premiumYearly : s.premiumMonthly,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: _ink,
                            ),
                          ),
                          if (trial != null) ...[
                            const SizedBox(height: 3),
                            Text(
                              _copy(
                                '$trial 天免费试用',
                                '$trial-day free trial',
                                fallback: s.premiumTrial(trial),
                              ),
                              style: const TextStyle(
                                color: _gradient2,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    if (offer != null)
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              offer.localizedPrice,
                              textAlign: TextAlign.end,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: _ink,
                              ),
                            ),
                            if (monthlyDetail != null)
                              Text(
                                monthlyDetail,
                                textAlign: TextAlign.end,
                                style: const TextStyle(
                                  color: _secondary,
                                  fontSize: 12,
                                ),
                              ),
                          ],
                        ),
                      ),
                    const SizedBox(width: 12),
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: selected ? _primary : _controlBorder,
                          width: selected ? 7 : 2,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        if (savings != null)
          PositionedDirectional(
            start: 14,
            top: -11,
            child: IgnorePointer(
              child: _goldBadge(
                _copy(
                  '最划算 · 省 $savings%',
                  'Best value · Save $savings%',
                  fallback: s.premiumSavings(savings),
                ),
                fontSize: 11,
              ),
            ),
          ),
      ],
    );
  }

  Widget _footer(MembershipSnapshot? subscription, MembershipOffer? offer) {
    final s = context.strings;
    final busy = widget.membership.busy;
    final trial = offer?.trialDays;
    final price = offer == null ? null : _pricePerPeriod(offer);
    final subscribeText = switch ((trial, price)) {
      (final int days, _) => s.premiumTrial(days),
      (_, final String amount) => _copy(
        '订阅 $amount',
        'Subscribe $amount',
        fallback: '${s.premiumSubscribe} $amount',
      ),
      _ => s.premiumSubscribe,
    };
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (subscription == null) ...[
              _primaryAction(
                subscribeText,
                _purchasing || busy || offer == null ? null : _purchase,
              ),
              const SizedBox(height: 10),
              if (price != null && trial != null)
                _legalLine(
                  _copy(
                    '试用结束后 $price，自动续订',
                    '$price after the trial. Renews automatically.',
                  ),
                ),
              _legalLine(
                _subscriptionDisclosure(context, withTrial: trial != null),
              ),
            ] else
              OutlinedButton(
                key: const ValueKey('premium-manage'),
                onPressed: () => manageFlareSubscription(context),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  backgroundColor: Colors.white,
                  foregroundColor: _ink,
                  side: const BorderSide(color: _controlBorder),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  textStyle: const TextStyle(
                    fontFamily: flareFontFamily,
                    fontFamilyFallback: flareFontFallback,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                child: Text(s.premiumManage, textAlign: TextAlign.center),
              ),
            const SizedBox(height: 14),
            Wrap(
              alignment: WrapAlignment.center,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                _link(
                  _copy('恢复购买', 'Restore', fallback: s.premiumRestore),
                  busy ? null : _restore,
                ),
                const Text(
                  ' · ',
                  style: TextStyle(fontSize: 12, color: _gradient2),
                ),
                _link(
                  _copy('使用条款', 'Terms', fallback: s.premiumTerms),
                  () => openMembershipLink(context, _terms),
                ),
                const Text(
                  ' · ',
                  style: TextStyle(fontSize: 12, color: _gradient2),
                ),
                _link(
                  _copy('隐私政策', 'Privacy', fallback: s.premiumPrivacy),
                  () => openMembershipLink(context, _privacy),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _primaryAction(String label, VoidCallback? action) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: action == null
            ? null
            : const LinearGradient(colors: [_gradient2, _primary]),
        boxShadow: action == null
            ? null
            : const [
                BoxShadow(
                  color: Color(0x59ff6a3d),
                  blurRadius: 16,
                  offset: Offset(0, 6),
                ),
              ],
      ),
      child: FilledButton(
        key: const ValueKey('premium-subscribe'),
        onPressed: action,
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(56),
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          disabledBackgroundColor: _cardBorder,
          disabledForegroundColor: _secondary,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(
            fontFamily: flareFontFamily,
            fontFamilyFallback: flareFontFallback,
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        child: _purchasing
            ? Semantics(
                liveRegion: true,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const ExcludeSemantics(
                      child: SizedBox.square(
                        dimension: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: _secondary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Flexible(
                      child: Text(
                        context.strings.premiumPurchaseInProgress,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              )
            : Text(label, textAlign: TextAlign.center),
      ),
    );
  }

  Widget _legalLine(String label) => Text(
    label,
    textAlign: TextAlign.center,
    style: const TextStyle(fontSize: 12, height: 1.5, color: _secondary),
  );

  Widget _link(String label, VoidCallback? action) => TextButton(
    style: TextButton.styleFrom(
      foregroundColor: _gradient2,
      padding: const EdgeInsets.symmetric(horizontal: 4),
      minimumSize: const Size(0, 28),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: const TextStyle(
        fontFamily: flareFontFamily,
        fontFamilyFallback: flareFontFallback,
        fontSize: 12,
      ),
    ),
    onPressed: action,
    child: Text(label),
  );

  String _pricePerPeriod(MembershipOffer offer) {
    final annual = offer.term == MembershipTerm.annual;
    final period = _copy(
      annual ? '年' : '月',
      annual ? 'year' : 'month',
      fallback: annual
          ? context.strings.premiumYearly
          : context.strings.premiumMonthly,
    );
    return '${offer.localizedPrice}/$period';
  }

  String _copy(String zh, String en, {String? fallback}) =>
      switch (Localizations.localeOf(context).languageCode) {
        'zh' => zh,
        'en' => en,
        _ => fallback ?? en,
      };
}

const _primary = Color(0xffff6a3d);
const _gradient1 = Color(0xff8e2100);
const _gradient2 = Color(0xffed3700);
const _glow = Color(0xffff9d80);
const _dark1 = Color(0xff6f1a00);
const _dark2 = Color(0xffbe2c00);
const _iconFill = Color(0xfffff3ef);
const _selectedFill = Color(0xfffff8f5);
const _page = Color(0xfff6f8f7);
const _ink = Color(0xff14211c);
const _secondary = Color(0xff6b7772);
const _divider = Color(0xffeef2f0);
const _cardBorder = Color(0xffe3e7e5);
const _controlBorder = Color(0xffc9d2ce);
const _white82 = Color(0xd1ffffff);

Widget _goldBadge(String text, {required double fontSize}) => DecoratedBox(
  decoration: BoxDecoration(
    color: const Color(0xfff5b83d),
    borderRadius: BorderRadius.circular(100),
  ),
  child: Padding(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
    child: Text(
      text,
      style: TextStyle(
        color: const Color(0xff3a2a00),
        fontSize: fontSize,
        fontWeight: FontWeight.w800,
      ),
    ),
  ),
);

class _HeroWash extends StatelessWidget {
  const _HeroWash();

  @override
  Widget build(BuildContext context) => const DecoratedBox(
    decoration: BoxDecoration(
      gradient: _FixedAngleGradient(
        direction: Offset(.3420201433, .9396926208),
        colors: [_gradient1, _gradient2, _primary],
        stops: [0, .60, 1],
      ),
    ),
    child: CustomPaint(painter: _HeroGlow()),
  );
}

class _FixedAngleGradient extends LinearGradient {
  const _FixedAngleGradient({
    required this.direction,
    required super.colors,
    super.stops,
  });

  final Offset direction;

  @override
  ui.Shader createShader(Rect rect, {TextDirection? textDirection}) {
    // Project the corners onto the gradient axis so the angle stays fixed
    // when the width or accessible text height changes.
    final extent =
        (direction.dx.abs() * rect.width + direction.dy.abs() * rect.height) /
        2;
    final offset = direction * extent;
    return ui.Gradient.linear(
      rect.center - offset,
      rect.center + offset,
      colors,
      stops,
    );
  }
}

class _HeroGlow extends CustomPainter {
  const _HeroGlow();

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final radiusX = size.width * 1.2;
    final radiusY = size.height * .9;
    canvas.save();
    canvas.scale(radiusX, radiusY);
    final gradient = RadialGradient(
      colors: [_glow, _glow.withValues(alpha: 0)],
      stops: const [0, .55],
    );
    final brush = Paint()
      ..shader = gradient.createShader(
        Rect.fromCircle(
          center: Offset(size.width * .85 / radiusX, 0),
          radius: 1,
        ),
      );
    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.width / radiusX, size.height / radiusY),
      brush,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _HeroGlow oldDelegate) => false;
}
