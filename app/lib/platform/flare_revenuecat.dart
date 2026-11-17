import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:purchases_flutter/purchases_flutter.dart' as rc;

import '../control/flare_membership.dart';

class FlareRevenueCat implements MembershipStore {
  FlareRevenueCat(this.publicKey);

  final String publicKey;
  Future<void>? _configuration;
  final _packages = <MembershipTerm, rc.Package>{};

  Future<void> _configure() => _configuration ??= _configureOnce();

  Future<void> _configureOnce() async {
    try {
      if (publicKey.trim().isEmpty) throw StateError('Store unavailable');
      await rc.Purchases.setLogLevel(rc.LogLevel.warn);
      await rc.Purchases.configure(rc.PurchasesConfiguration(publicKey));
    } on Object {
      _configuration = null;
      throw const MembershipStoreUnavailable();
    }
  }

  Future<MembershipSnapshot> _snapshot(rc.CustomerInfo info) async {
    final uid = await rc.Purchases.appUserID;
    final entitlement = info.entitlements.active['premium'];
    final expiration = entitlement?.expirationDate;
    return MembershipSnapshot(
      uid,
      expiration == null ? null : DateTime.tryParse(expiration),
    );
  }

  @override
  Future<MembershipSnapshot> refresh() async {
    await _configure();
    await rc.Purchases.invalidateCustomerInfoCache();
    return _snapshot(await rc.Purchases.getCustomerInfo());
  }

  @override
  Future<List<MembershipOffer>> offers() async {
    await _configure();
    final offering = (await rc.Purchases.getOfferings()).current;
    _packages.clear();
    if (offering?.identifier != 'default') return const [];
    final plans = [
      (MembershipTerm.monthly, offering?.monthly),
      (MembershipTerm.annual, offering?.annual),
    ];
    final usesAppStore = defaultTargetPlatform == TargetPlatform.iOS;
    final eligible = usesAppStore
        ? await _eligibleIosTrials([
            for (final (_, package) in plans)
              if (package != null &&
                  _iosTrialDays(package.storeProduct) != null)
                package.storeProduct.identifier,
          ])
        : const <String>{};
    final result = <MembershipOffer>[];
    for (final (term, package) in plans) {
      if (package == null) continue;
      final product = package.storeProduct;
      final trialDays = usesAppStore
          ? (eligible.contains(product.identifier)
                ? _iosTrialDays(product)
                : null)
          : _playTrialDays(product);
      _packages[term] = package;
      result.add(
        MembershipOffer(
          term: term,
          price: product.price,
          currency: product.currencyCode,
          localizedPrice: product.priceString,
          localizedMonthlyPrice: product.pricePerMonthString,
          trialDays: trialDays,
        ),
      );
    }
    return result;
  }

  int? _iosTrialDays(rc.StoreProduct product) {
    final intro = product.introductoryPrice;
    if (intro == null || intro.price != 0) return null;
    return _trialDays(
      intro.periodUnit,
      intro.periodNumberOfUnits,
      intro.cycles,
    );
  }

  int? _playTrialDays(rc.StoreProduct product) {
    final phase = product.defaultOption?.freePhase;
    final period = phase?.billingPeriod;
    if (period == null || phase?.price.amountMicros != 0) return null;
    final cycles = phase?.billingCycleCount;
    return _trialDays(
      period.unit,
      period.value,
      cycles != null && cycles > 0 ? cycles : 1,
    );
  }

  int? _trialDays(rc.PeriodUnit unit, int value, int cycles) {
    if (value <= 0 || cycles <= 0) return null;
    return switch (unit) {
      rc.PeriodUnit.day => value * cycles,
      rc.PeriodUnit.week => value * cycles * 7,
      // Calendar months and years do not have fixed lengths in days.
      _ => null,
    };
  }

  Future<Set<String>> _eligibleIosTrials(List<String> ids) async {
    if (ids.isEmpty) return const {};
    try {
      final eligibility =
          await rc.Purchases.checkTrialOrIntroductoryPriceEligibility(ids);
      return {
        for (final entry in eligibility.entries)
          if (entry.value.status ==
              rc.IntroEligibilityStatus.introEligibilityStatusEligible)
            entry.key,
      };
    } on Exception {
      return const {};
    }
  }

  @override
  Future<MembershipSnapshot?> purchase(MembershipTerm term) async {
    await _configure();
    final package = _packages[term];
    if (package == null) throw const MembershipStoreUnavailable();
    try {
      final result = await rc.Purchases.purchase(
        rc.PurchaseParams.package(package),
      );
      return _snapshot(result.customerInfo);
    } on PlatformException catch (error) {
      if (rc.PurchasesErrorHelper.getErrorCode(error) ==
          rc.PurchasesErrorCode.purchaseCancelledError) {
        return null;
      }
      throw const MembershipStoreUnavailable();
    }
  }

  @override
  Future<MembershipSnapshot> restore() async {
    await _configure();
    return _snapshot(await rc.Purchases.restorePurchases());
  }
}

class MembershipStoreUnavailable implements Exception {
  const MembershipStoreUnavailable();
}
