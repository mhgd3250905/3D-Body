import 'dart:async';

import 'package:flare/control/flare_membership.dart';
import 'package:flare/data/local_state_storage.dart';
import 'package:flutter_test/flutter_test.dart';

const _annual = MembershipOffer(
  term: MembershipTerm.annual,
  price: 25.99,
  currency: 'EUR',
  localizedPrice: '25,99 €',
  localizedMonthlyPrice: '2,17 €',
  trialDays: 14,
);

class _Storage implements LocalStateStorage {
  String? value;
  bool failWrites = false;

  @override
  Future<String?> read(String key) async => value;

  @override
  Future<void> write(String key, String value) async {
    if (failWrites) throw StateError('Disk unavailable');
    this.value = value;
  }
}

class _Store implements MembershipStore {
  final request = Completer<List<MembershipOffer>>();
  int requestCount = 0;

  @override
  Future<List<MembershipOffer>> offers() {
    requestCount++;
    return request.future;
  }

  @override
  Future<MembershipSnapshot?> purchase(MembershipTerm term) =>
      throw UnimplementedError();

  @override
  Future<MembershipSnapshot> refresh() => throw UnimplementedError();

  @override
  Future<MembershipSnapshot> restore() => throw UnimplementedError();
}

void main() {
  test(
    'a fresh lifetime reuses localized prices without claiming a trial',
    () async {
      final storage = _Storage();
      final connectedStore = _Store()..request.complete([_annual]);
      final connected = FlareMembership(connectedStore, offerStorage: storage);
      addTearDown(connected.dispose);
      expect((await connected.offers()).single.trialDays, 14);

      final offlineStore = _Store();
      final offline = FlareMembership(offlineStore, offerStorage: storage);
      addTearDown(offline.dispose);
      final rejected = expectLater(offline.offers(), throwsStateError);
      offlineStore.request.completeError(StateError('Store unavailable'));
      await rejected;

      final cached = (await offline.cachedOffers()).single;
      expect(cached.term, MembershipTerm.annual);
      expect(cached.price, 25.99);
      expect(cached.currency, 'EUR');
      expect(cached.localizedPrice, '25,99 €');
      expect(cached.localizedMonthlyPrice, '2,17 €');
      expect(cached.trialDays, isNull);
    },
  );

  test(
    'concurrent requests share a fetch and cache failures preserve live offers',
    () async {
      final storage = _Storage()..failWrites = true;
      final store = _Store();
      final membership = FlareMembership(store, offerStorage: storage);
      addTearDown(membership.dispose);
      final first = membership.offers();
      final second = membership.offers();
      expect(identical(first, second), isTrue);
      expect(store.requestCount, 1);
      store.request.complete([_annual]);
      expect(await first, [_annual]);
      expect((await membership.cachedOffers()).single.trialDays, isNull);
    },
  );
}
