import 'package:flare/coach/membership_gateway.dart';
import 'package:flare/control/flare_ai_consent.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final uri = Uri.https('gateway.invalid', '/v1/chat/completions');

  test('without an active RC identity no request leaves the app', () async {
    final notices = <GatewayNotice>[];
    final client = MembershipGateway(
      readConsent: () async => true,
      readUserId: () => null,
      onNotice: notices.add,
      client: MockClient((_) async => throw StateError('request escaped')),
    );
    addTearDown(client.close);
    expect((await client.post(uri)).statusCode, 402);
    expect(notices, [(kind: GatewayRejection.premiumRequired, limit: null)]);
  });

  test(
    'uses current RC identity and keeps quota and IP throttling distinct',
    () async {
      final notices = <GatewayNotice>[];
      var call = 0;
      final client = MembershipGateway(
        readConsent: () async => true,
        readUserId: () => r'$RCAnonymousID:00000000000000000000000000000001',
        onNotice: notices.add,
        client: MockClient((request) async {
          expect(request.headers['X-App'], 'flare');
          expect(
            request.headers['Authorization'],
            r'Bearer rc:$RCAnonymousID:00000000000000000000000000000001',
          );
          return switch (++call) {
            1 => http.Response('{"error":"not_premium"}', 402),
            2 => http.Response('{"error":"quota_exceeded","limit":30}', 429),
            3 => http.Response('{"error":"quota_exceeded","limit":50}', 429),
            _ => http.Response('{"error":"rate_limited","limit":20}', 429),
          };
        }),
      );
      addTearDown(client.close);
      expect((await client.post(uri)).statusCode, 402);
      expect(
        (await client.post(uri)).body,
        '{"error":"quota_exceeded","limit":30}',
      );
      expect(
        (await client.post(uri)).body,
        '{"error":"quota_exceeded","limit":50}',
      );
      expect((await client.post(uri)).statusCode, 429);
      expect(notices, [
        (kind: GatewayRejection.premiumRequired, limit: null),
        (kind: GatewayRejection.dailyQuota, limit: 30),
        (kind: GatewayRejection.dailyQuota, limit: 50),
        (kind: GatewayRejection.rateLimit, limit: null),
      ]);
    },
  );

  test(
    'checks consent again for each request, including after withdrawal',
    () async {
      SharedPreferences.setMockInitialValues({});
      final consent = FlareAiConsent();
      var calls = 0;
      final notices = <GatewayNotice>[];
      final client = MembershipGateway(
        readConsent: consent.read,
        readUserId: () => r'$RCAnonymousID:00000000000000000000000000000001',
        onNotice: notices.add,
        client: MockClient((_) async {
          calls++;
          return http.Response('{}', 200);
        }),
      );
      addTearDown(client.close);

      await expectLater(client.post(uri), throwsA(isA<http.ClientException>()));
      expect(calls, 0);
      await consent.grant();
      expect((await client.post(uri)).statusCode, 200);
      expect(calls, 1);

      final prefs = await SharedPreferences.getInstance();
      expect(prefs.getBool(FlareAiConsent.key), isTrue);
      final timestamp = prefs.getString(FlareAiConsent.timestampKey);
      expect(DateTime.tryParse(timestamp!)?.isUtc, isTrue);
      expect(await FlareAiConsent().read(), isTrue);

      await consent.withdraw();
      await expectLater(client.post(uri), throwsA(isA<http.ClientException>()));
      expect(calls, 1);
      expect(notices, isEmpty);
      expect(prefs.containsKey(FlareAiConsent.key), isFalse);
      expect(prefs.containsKey(FlareAiConsent.timestampKey), isFalse);
      expect(await FlareAiConsent().read(), isFalse);
    },
  );
}
