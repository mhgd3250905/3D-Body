import 'dart:async';

import 'package:flutter/foundation.dart';

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
  const MembershipSnapshot(
    this.appUserId,
    this.expiresAt, {
    this.startsAt,
    this.term,
    this.isTrial = false,
    this.willRenew,
  });

  final String appUserId;
  final DateTime? expiresAt;
  final DateTime? startsAt;
  final MembershipTerm? term;
  final bool isTrial;
  final bool? willRenew;

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
  FlareMembership(this._store, {DateTime Function()? now})
    : _now = now ?? DateTime.now;

  final MembershipStore _store;
  final DateTime Function() _now;
  MembershipSnapshot? _snapshot;
  Future<bool>? _refresh;
  Timer? _expiryTimer;
  int _generation = 0;
  bool _disposed = false;
  bool _busy = false;

  bool get busy => _busy;
  bool get isPremium => _snapshot?.isActiveAt(_now()) ?? false;
  MembershipSnapshot? get activeSubscription => isPremium ? _snapshot : null;
  String? get activeAppUserId => isPremium ? _snapshot?.appUserId : null;

  Future<List<MembershipOffer>> offers() => _store.offers();

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
