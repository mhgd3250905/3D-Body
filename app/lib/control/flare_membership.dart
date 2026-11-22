import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';

import '../data/local_state_storage.dart';

enum MembershipTerm { monthly, annual }

class MembershipOffer {
  const MembershipOffer({
    required this.term,
    required this.price,
    required this.currency,
    required this.localizedPrice,
    this.localizedMonthlyPrice,
    this.trialDays,
  });

  final MembershipTerm term;
  final double price;
  final String currency;
  final String localizedPrice;
  final String? localizedMonthlyPrice;
  final int? trialDays;
}

class MembershipSnapshot {
  const MembershipSnapshot(this.appUserId, this.expiresAt);

  final String appUserId;
  final DateTime? expiresAt;

  bool isActiveAt(DateTime time) =>
      appUserId.isNotEmpty && (expiresAt?.isAfter(time) ?? false);
}

abstract interface class MembershipStore {
  Future<MembershipSnapshot> refresh();
  Future<List<MembershipOffer>> offers();
  Future<MembershipSnapshot?> purchase(MembershipTerm term);
  Future<MembershipSnapshot> restore();
}

/// One lifetime owner for subscription operations and the current RC identity.
class FlareMembership extends ChangeNotifier {
  FlareMembership(this._store, {DateTime Function()? now, this._offerStorage})
    : _now = now ?? DateTime.now;

  /// US reference prices, matching the StoreKit configuration. The store
  /// supplies the actual localized prices and trial eligibility before purchase.
  static const referenceOffers = [
    MembershipOffer(
      term: MembershipTerm.monthly,
      price: 2.99,
      currency: 'USD',
      localizedPrice: r'$2.99',
    ),
    MembershipOffer(
      term: MembershipTerm.annual,
      price: 19.99,
      currency: 'USD',
      localizedPrice: r'$19.99',
      localizedMonthlyPrice: r'$1.67',
    ),
  ];

  static const _offerCacheKey = 'flare.membership.offer-prices.v1';

  final MembershipStore _store;
  final DateTime Function() _now;
  final LocalStateStorage? _offerStorage;
  List<MembershipOffer>? _cachedOffers;
  Future<List<MembershipOffer>>? _offersRequest;
  MembershipSnapshot? _snapshot;
  Future<bool>? _refresh;
  Timer? _expiryTimer;
  int _generation = 0;
  bool _disposed = false;
  bool _busy = false;

  bool get busy => _busy;
  List<MembershipOffer> get fallbackOffers => referenceOffers;
  bool get isPremium => _snapshot?.isActiveAt(_now()) ?? false;
  String? get activeAppUserId => isPremium ? _snapshot?.appUserId : null;

  Future<List<MembershipOffer>> offers() => _offersRequest ??= _loadOffers()
      .whenComplete(() => _offersRequest = null);

  Future<List<MembershipOffer>> _loadOffers() async {
    final offers = await _store.offers();
    if (offers.isEmpty) return offers;

    // Cached prices are display estimates. Trials depend on live eligibility.
    final prices = [
      for (final offer in offers)
        MembershipOffer(
          term: offer.term,
          price: offer.price,
          currency: offer.currency,
          localizedPrice: offer.localizedPrice,
          localizedMonthlyPrice: offer.localizedMonthlyPrice,
        ),
    ];
    _cachedOffers = List.unmodifiable(prices);
    try {
      await _offerStorage?.write(
        _offerCacheKey,
        jsonEncode([
          for (final offer in prices)
            {
              'term': offer.term.name,
              'price': offer.price,
              'currency': offer.currency,
              'localizedPrice': offer.localizedPrice,
              'localizedMonthlyPrice': offer.localizedMonthlyPrice,
            },
        ]),
      );
    } on Object {
      // A local cache failure cannot block a live purchase.
    }
    return offers;
  }

  Future<List<MembershipOffer>> cachedOffers() async {
    if (_cachedOffers case final prices?) return prices;
    try {
      final encoded = await _offerStorage?.read(_offerCacheKey);
      final decoded = encoded == null ? null : jsonDecode(encoded);
      final prices = [
        if (decoded case final List<Object?> entries)
          for (final entry in entries) ?_readOffer(entry),
      ];
      // A live request may finish while the storage read is in progress.
      return _cachedOffers ??= List.unmodifiable(prices);
    } on Object {
      return _cachedOffers ?? const [];
    }
  }

  MembershipOffer? _readOffer(Object? entry) {
    if (entry
        case {
          'term': final String name,
          'price': final num price,
          'currency': final String currency,
          'localizedPrice': final String localizedPrice,
          'localizedMonthlyPrice': final String? monthlyPrice,
        }
        when price.isFinite &&
            price > 0 &&
            currency.isNotEmpty &&
            localizedPrice.isNotEmpty) {
      for (final term in MembershipTerm.values) {
        if (term.name != name) continue;
        return MembershipOffer(
          term: term,
          price: price.toDouble(),
          currency: currency,
          localizedPrice: localizedPrice,
          localizedMonthlyPrice: monthlyPrice,
        );
      }
    }
    return null;
  }

  Future<bool> refresh() {
    if (_busy) return Future.value(isPremium);
    return _refresh ??= _load().whenComplete(() => _refresh = null);
  }

  Future<bool> _load() async {
    final generation = _generation;
    try {
      final snapshot = await _store.refresh();
      if (generation == _generation) _publish(snapshot);
    } on Exception {
      if (generation == _generation) _publish(null);
    }
    return isPremium;
  }

  Future<bool> purchase(MembershipTerm term) =>
      _transact(() => _store.purchase(term));

  Future<bool> restore() => _transact(_store.restore);

  Future<bool> _transact(Future<MembershipSnapshot?> Function() action) async {
    if (_busy || _disposed) return false;
    _busy = true;
    final generation = ++_generation;
    notifyListeners();
    try {
      final snapshot = await action();
      if (generation == _generation && snapshot != null) _publish(snapshot);
      return isPremium;
    } finally {
      _busy = false;
      if (!_disposed) notifyListeners();
    }
  }

  /// The Worker can reject a cached RC decision after expiry or revocation.
  void rejectPremium() {
    _generation++;
    _publish(null);
  }

  void _publish(MembershipSnapshot? snapshot) {
    if (_disposed) return;
    _snapshot = snapshot;
    _expiryTimer?.cancel();
    final expiresAt = snapshot?.expiresAt;
    if (expiresAt != null && expiresAt.isAfter(_now())) {
      _expiryTimer = Timer(expiresAt.difference(_now()), () {
        if (!_disposed) notifyListeners();
      });
    }
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _expiryTimer?.cancel();
    super.dispose();
  }
}
