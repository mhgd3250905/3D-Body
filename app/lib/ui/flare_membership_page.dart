import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../control/flare_membership.dart';
import 'components.dart';
import 'theme.dart';

const _terms =
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const _privacy = 'https://flare-privacy.294851575.workers.dev/';
const _playSubscriptions =
    'https://play.google.com/store/account/subscriptions?sku=flare_premium&package=dev.mhgd.flare';

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
    openMembershipLink(context, _playSubscriptions);

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

  Future<void> _purchase() async {
    try {
      final active = await widget.membership.purchase(_selected);
      if (active && mounted) Navigator.pop(context, true);
    } on Exception {
      if (mounted) {
        showMembershipMessage(context, context.strings.premiumUnavailable);
      }
    }
  }

  Future<void> _restore() async {
    final active = await restoreFlareSubscription(context, widget.membership);
    if (active && mounted) Navigator.pop(context, true);
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
    BuildContext context,
    MembershipTerm term,
    MembershipOffer? offer, {
    int? savings,
  }) {
    final s = context.strings;
    final selected = _selected == term;
    final monthlyPrice = term == MembershipTerm.annual && offer != null
        ? offer.localizedMonthlyPrice ??
              NumberFormat.simpleCurrency(
                locale: Localizations.localeOf(context).toLanguageTag(),
                name: offer.currency,
              ).format(offer.price / 12)
        : null;
    return Semantics(
      button: true,
      selected: selected,
      child: Material(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          key: ValueKey('premium-${term.name}'),
          borderRadius: BorderRadius.circular(16),
          onTap: offer == null || widget.membership.busy
              ? null
              : () => setState(() => _selected = term),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            curve: Curves.easeOut,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: selected
                    ? FlareColors.accent
                    : FlareColors.line.withValues(alpha: .2),
                width: selected ? 2 : 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        term == MembershipTerm.monthly
                            ? s.premiumMonthly
                            : s.premiumYearly,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    if (savings != null)
                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: FlareColors.secondaryFill,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            s.premiumSavings(savings),
                            style: TextStyle(
                              color: FlareColors.accentText,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                if (offer != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    offer.localizedPrice,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  if (monthlyPrice != null)
                    Text(
                      s.premiumMonthlyEstimate(monthlyPrice),
                      style: TextStyle(
                        fontSize: 13,
                        color: FlareColors.secondary,
                      ),
                    ),
                ],
              ],
            ),
          ),
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
        child: Stack(
          children: [
            ListView(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 56, 16, 16),
              children: [
                Text(
                  s.premiumTitle,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  s.premiumSubtitle,
                  style: TextStyle(fontSize: 15, color: FlareColors.secondary),
                ),
                const SizedBox(height: 24),
                for (final (index, benefit) in [
                  (Icons.chat_bubble_outline_rounded, s.premiumAiCoach),
                  (Icons.auto_awesome_rounded, s.premiumAiPlans),
                  (Icons.playlist_add_rounded, s.premiumCustomWorkouts),
                ].indexed) ...[
                  if (index != 0) const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(benefit.$1, size: 20, color: FlareColors.accent),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          benefit.$2,
                          style: const TextStyle(fontSize: 15),
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 24),
                FutureBuilder(
                  future: _offers,
                  builder: (context, snapshot) => ListenableBuilder(
                    listenable: widget.membership,
                    builder: (context, _) {
                      final offers = {
                        for (final offer
                            in snapshot.data ?? const <MembershipOffer>[])
                          offer.term: offer,
                      };
                      final selected = offers[_selected];
                      final trialDays = selected?.trialDays;
                      final busy = widget.membership.busy;
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _offerCard(
                            context,
                            MembershipTerm.monthly,
                            offers[MembershipTerm.monthly],
                          ),
                          const SizedBox(height: 12),
                          _offerCard(
                            context,
                            MembershipTerm.annual,
                            offers[MembershipTerm.annual],
                            savings: _savings(
                              offers[MembershipTerm.monthly],
                              offers[MembershipTerm.annual],
                            ),
                          ),
                          if (snapshot.connectionState ==
                              ConnectionState.waiting)
                            const Padding(
                              padding: EdgeInsets.all(12),
                              child: Center(child: CircularProgressIndicator()),
                            )
                          else if (offers.isEmpty)
                            TextButton(
                              onPressed: () => setState(
                                () => _offers = widget.membership.offers(),
                              ),
                              child: Text(s.premiumUnavailable),
                            ),
                          const SizedBox(height: 20),
                          FilledButton(
                            key: const ValueKey('premium-subscribe'),
                            onPressed: busy || selected == null
                                ? null
                                : _purchase,
                            style: FilledButton.styleFrom(
                              minimumSize: const Size.fromHeight(52),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                              textStyle: const TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            child: Text(
                              trialDays == null
                                  ? s.premiumSubscribe
                                  : s.premiumTrial(trialDays),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            s.premiumDisclosure,
                            style: TextStyle(
                              fontSize: 12,
                              height: 1.4,
                              color: FlareColors.secondary,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 16,
                            children: [
                              _link(s.premiumRestore, busy ? null : _restore),
                              _link(
                                s.premiumTerms,
                                () => openMembershipLink(context, _terms),
                              ),
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
              ],
            ),
            PositionedDirectional(
              top: 0,
              end: 16,
              child: IconButton(
                tooltip: MaterialLocalizations.of(context).closeButtonTooltip,
                icon: const Icon(Icons.close_rounded, size: 24),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _link(String label, VoidCallback? action) => TextButton(
    style: TextButton.styleFrom(
      padding: EdgeInsets.zero,
      minimumSize: const Size(0, 44),
      textStyle: const TextStyle(fontSize: 13),
    ),
    onPressed: action,
    child: Text(label),
  );
}
