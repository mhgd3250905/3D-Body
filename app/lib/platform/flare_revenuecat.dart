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
    final result = <MembershipOffer>[];
    for (final (term, package, expectedTrial) in [
      (MembershipTerm.monthly, offering?.monthly, 3),
      (MembershipTerm.annual, offering?.annual, 7),
    ]) {
      if (package == null) continue;
      final product = package.storeProduct;
      final phase = product.defaultOption?.freePhase;
      final period = phase?.billingPeriod?.iso8601;
      final hasTrial =
          phase?.price.amountMicros == 0 &&
          (period == 'P${expectedTrial}D' ||
              (expectedTrial == 7 && period == 'P1W'));
      _packages[term] = package;
      result.add(
        MembershipOffer(
          term: term,
          price: product.price,
          currency: product.currencyCode,
          localizedPrice: product.priceString,
          localizedMonthlyPrice: product.pricePerMonthString,
          trialDays: hasTrial ? expectedTrial : null,
        ),
      );
    }
    return result;
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
